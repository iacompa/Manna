-- Alpha scripture.db schema (PLAN.md § local databases)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS corpus_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS translations (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  language_code TEXT NOT NULL,
  versification_id TEXT NOT NULL DEFAULT 'standard'
);

CREATE TABLE IF NOT EXISTS books (
  book_usfm TEXT PRIMARY KEY,
  canon_order INTEGER NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  name_en TEXT NOT NULL,
  chapter_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chapters (
  book_usfm TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_count INTEGER NOT NULL DEFAULT 0,
  integrity_hash TEXT,
  PRIMARY KEY (book_usfm, chapter),
  FOREIGN KEY (book_usfm) REFERENCES books (book_usfm)
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_id TEXT NOT NULL,
  book_usfm TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  block_order INTEGER NOT NULL,
  block_type TEXT NOT NULL DEFAULT 'paragraph',
  UNIQUE (translation_id, book_usfm, chapter, block_order),
  FOREIGN KEY (translation_id) REFERENCES translations (id),
  FOREIGN KEY (book_usfm) REFERENCES books (book_usfm)
);

CREATE TABLE IF NOT EXISTS verse_segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_id TEXT NOT NULL,
  book_usfm TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  verse_end INTEGER,
  content_block_id INTEGER NOT NULL,
  segment_order INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  UNIQUE (
    translation_id,
    book_usfm,
    chapter,
    verse,
    segment_order
  ),
  FOREIGN KEY (translation_id) REFERENCES translations (id),
  FOREIGN KEY (content_block_id) REFERENCES content_blocks (id)
);

CREATE VIRTUAL TABLE IF NOT EXISTS verse_search USING fts5 (
  translation_id,
  book_usfm,
  chapter UNINDEXED,
  verse UNINDEXED,
  text,
  content = 'verse_segments',
  content_rowid = 'id',
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER IF NOT EXISTS verse_segments_ai
AFTER INSERT ON verse_segments
BEGIN
  INSERT INTO
    verse_search (rowid, translation_id, book_usfm, chapter, verse, text)
  VALUES (
    new.id,
    new.translation_id,
    new.book_usfm,
    new.chapter,
    new.verse,
    new.text
  );
END;

CREATE TRIGGER IF NOT EXISTS verse_segments_ad
AFTER DELETE ON verse_segments
BEGIN
  INSERT INTO
    verse_search (
      verse_search,
      rowid,
      translation_id,
      book_usfm,
      chapter,
      verse,
      text
    )
  VALUES (
    'delete',
    old.id,
    old.translation_id,
    old.book_usfm,
    old.chapter,
    old.verse,
    old.text
  );
END;

CREATE TRIGGER IF NOT EXISTS verse_segments_au
AFTER UPDATE ON verse_segments
BEGIN
  INSERT INTO
    verse_search (
      verse_search,
      rowid,
      translation_id,
      book_usfm,
      chapter,
      verse,
      text
    )
  VALUES (
    'delete',
    old.id,
    old.translation_id,
    old.book_usfm,
    old.chapter,
    old.verse,
    old.text
  );
  INSERT INTO
    verse_search (rowid, translation_id, book_usfm, chapter, verse, text)
  VALUES (
    new.id,
    new.translation_id,
    new.book_usfm,
    new.chapter,
    new.verse,
    new.text
  );
END;
