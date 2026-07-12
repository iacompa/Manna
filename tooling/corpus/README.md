# Corpus tooling

USFM → SQLite pipeline for `scripture.db`. See `PLAN.md` §4 and `docs/editorial/corpus-phase0-spike.md`.

## Alpha build (66-book BSB + RV1909)

Downloads pinned archives (SHA-256 in `content/manifests/corpus-sources.json`), imports into production schema (`schema/scripture.sql`), and copies the shipping artifact to `packages/scripture/assets/scripture.db`.

```bash
pnpm --filter @manna/corpus-tooling build
pnpm --filter @manna/corpus-tooling validate
pnpm --filter @manna/corpus-tooling test
```

Skip re-download when `tooling/corpus/raw/*.zip` already match pinned hashes:

```bash
node --experimental-sqlite tooling/corpus/scripts/build-scripture-db.mjs --skip-download
```

Outputs:

| Path | Role |
| --- | --- |
| `packages/scripture/assets/scripture.db` | App bundle target |
| `content/manifests/corpus-manifest.json` | DB hash + per-translation inventory |
| `tooling/corpus/out/scripture.db` | Local build copy (gitignored) |

Raw archives: `tooling/corpus/raw/` (gitignored).

## Phase 0 spike

```bash
pnpm --filter @manna/corpus-tooling spike
```

Fixtures only — `out/scripture-spike.db` and `corpus-spike-manifest.json`.
