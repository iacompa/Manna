-- Phase 0 spike schema only; production schema lives with @manna/scripture + full pipeline.
CREATE TABLE IF NOT EXISTS corpus_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS verses (
  translation_id TEXT NOT NULL,
  book_usfm TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  PRIMARY KEY (translation_id, book_usfm, chapter, verse)
);
