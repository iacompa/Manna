# @manna/scripture

Canonical **offline** Scripture bundle for the store app (Alpha: BSB English + RV1909 Spanish).

## Bundled database

| Path | Role |
| --- | --- |
| `assets/scripture.db` | Immutable SQLite corpus shipped with the app |

Regenerate from repo root:

```bash
pnpm --filter @manna/corpus-tooling build
pnpm --filter @manna/corpus-tooling validate
```

Manifest + archive SHA-256: `content/manifests/corpus-manifest.json`, `content/manifests/corpus-sources.json`.

## Reader worker (mobile)

Open the bundled DB with **Expo SQLite** (`expo-sqlite`). Copy or open `assets/scripture.db` from the app bundle (e.g. `require('./assets/scripture.db')` / `Asset` + `SQLite.openDatabaseAsync` per your Expo version).

Core tables:

- `translations` — `bsb-en`, `rv1909-es`
- `books`, `chapters`
- `verse_segments` — one row per verse (text column)
- `verse_search` — FTS5 (`unicode61 remove_diacritics 2`)

Example read:

```sql
SELECT text FROM verse_segments
WHERE translation_id = ? AND book_usfm = ? AND chapter = ? AND verse = ?;
```

Full-text:

```sql
SELECT book_usfm, chapter, verse, text FROM verse_search
WHERE translation_id = ? AND verse_search MATCH ?;
```

Check `corpus_metadata.corpus_version` and compare to `content/manifests/corpus-manifest.json` `db_sha256` when debugging mismatches.

Do **not** treat this package as a runtime download of live Bible APIs — Scripture is local-only for v1.
