#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { PROTESTANT_BOOKS } from "../lib/canon.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const DB_PATH = join(repoRoot, "packages/scripture/assets/scripture.db");

const MIN_VERSES = 30_900;
const MAX_VERSES = 31_200;
const EXPECTED_TRANSLATIONS = ["bsb-en", "rv1909-es"];

export function validateScriptureDb(dbPath = DB_PATH) {
  if (!existsSync(dbPath)) {
    throw new Error(`Missing scripture database at ${dbPath}`);
  }
  const db = new DatabaseSync(dbPath);
  const issues = [];

  const translations = db
    .prepare(`SELECT id FROM translations ORDER BY id`)
    .all()
    .map((r) => r.id);
  for (const id of EXPECTED_TRANSLATIONS) {
    if (!translations.includes(id)) {
      issues.push(`missing translation ${id}`);
    }
  }

  const bookCount = db.prepare(`SELECT count(*) AS c FROM books`).get().c;
  if (bookCount !== PROTESTANT_BOOKS.length) {
    issues.push(`books table has ${bookCount}, expected ${PROTESTANT_BOOKS.length}`);
  }

  for (const translationId of EXPECTED_TRANSLATIONS) {
    const books = db
      .prepare(
        `SELECT DISTINCT book_usfm FROM verse_segments WHERE translation_id = ? ORDER BY book_usfm`,
      )
      .all(translationId)
      .map((r) => r.book_usfm);
    if (books.length !== PROTESTANT_BOOKS.length) {
      issues.push(
        `${translationId}: ${books.length} books in verse_segments, expected ${PROTESTANT_BOOKS.length}`,
      );
    }
    const verseCount = db
      .prepare(
        `SELECT count(*) AS c FROM verse_segments WHERE translation_id = ?`,
      )
      .get(translationId).c;
    if (verseCount < MIN_VERSES || verseCount > MAX_VERSES) {
      issues.push(
        `${translationId}: verse count ${verseCount} outside sanity band ${MIN_VERSES}-${MAX_VERSES}`,
      );
    }
    const fts = db
      .prepare(
        `SELECT count(*) AS c FROM verse_search WHERE translation_id = ?`,
      )
      .get(translationId).c;
    if (fts !== verseCount) {
      issues.push(
        `${translationId}: FTS rows ${fts} != verse_segments ${verseCount}`,
      );
    }
  }

  const corpusVersion = db
    .prepare(`SELECT value FROM corpus_metadata WHERE key = 'corpus_version'`)
    .get();
  if (!corpusVersion?.value) {
    issues.push("missing corpus_metadata.corpus_version");
  }

  db.close();

  if (issues.length > 0) {
    throw new Error(issues.join("; "));
  }
  return { ok: true, dbPath };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    validateScriptureDb();
    console.log("validate-scripture-db: OK");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
