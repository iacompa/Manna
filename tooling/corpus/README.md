# Corpus tooling

USFM → SQLite pipeline for `scripture.db`. See `PLAN.md` §4 and `docs/editorial/corpus-phase0-spike.md`.

## Phase 0 spike

```bash
pnpm --filter @manna/corpus-tooling spike
# or
node --experimental-sqlite tooling/corpus/scripts/import-usfm-spike.mjs
```

Fixtures: `fixtures/` (few verses). Output DB: `out/scripture-spike.db` (gitignored). Manifest: `content/manifests/corpus-spike-manifest.json`.

Raw archives belong in `raw/` (gitignored when large).
