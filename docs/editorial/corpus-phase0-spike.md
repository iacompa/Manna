# Corpus Phase 0 spike (Packet 0E)

## Purpose

Prove the minimal **USFM → SQLite** path for Alpha corpus work without downloading full pinned archives. Full pipeline steps remain in `PLAN.md` §4 (SHA-256 verify, 66-book inventory, FTS5, signed manifests).

## Pinned strategy (unchanged from PLAN)

| Language | Alpha | Public-release target | Fallback |
| --- | --- | --- | --- |
| English | Berean Standard Bible (BSB) | BSB | — |
| Spanish | RV1909 (`Clásica` label in product) | ONBV after written clearance | RV1909 if ONBV or editorial gate fails |

Rights status lives in [`content/manifests/rights-ledger.yaml`](../../content/manifests/rights-ledger.yaml). **No shipping content** until ledger fields are green.

## Spike artifacts

| Path | Role |
| --- | --- |
| `tooling/corpus/fixtures/` | Tiny USFM samples (few verses, not full Bible) |
| `tooling/corpus/scripts/import-usfm-spike.mjs` | Minimal parser + SQLite writer |
| `tooling/corpus/schema/spike.sql` | Spike schema (verses table + metadata) |
| `content/manifests/corpus-spike-manifest.json` | Fixture hashes + integrity stub (generated) |
| `tooling/corpus/out/` | Local `scripture-spike.db` (gitignored via `*.db`) |

## Run (smoke)

From repo root:

```bash
node --experimental-sqlite tooling/corpus/scripts/import-usfm-spike.mjs
```

Expected: writes `tooling/corpus/out/scripture-spike.db` and refreshes `content/manifests/corpus-spike-manifest.json`.

## Integrity (stub)

Phase 0 records:

- SHA-256 of each fixture file
- SHA-256 of canonical verse row serialization (sorted keys)
- `corpus_version`: `spike-0.1.0`

Production will add FTS5, per-book reports, and signed release artifacts per PLAN.

## Out of scope (Phase 0)

- Full USFM grammar / poetry markers
- Alignment graph (`exact` / `merged` / `split` / `absent`)
- Server retrieval corpus load
- Downloading pinned eBible archives
