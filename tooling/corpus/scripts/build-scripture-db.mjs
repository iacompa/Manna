#!/usr/bin/env node
/**
 * Download pinned USFM archives → SQLite scripture.db (Alpha).
 */
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import {
  BOOK_BY_USFM,
  PROTESTANT_BOOKS,
  bookUsfmFromBsbFilename,
  bookUsfmFromRv1909Filename,
} from "../lib/canon.mjs";
import { sha256, sha256File } from "../lib/hash.mjs";
import { parseUsfmBook } from "../lib/usfm.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const corpusRoot = resolve(__dirname, "..");
const repoRoot = resolve(corpusRoot, "../..");

const CORPUS_VERSION = "alpha-1.0.0";
const SCHEMA_PATH = join(corpusRoot, "schema/scripture.sql");
const SOURCES_PATH = join(repoRoot, "content/manifests/corpus-sources.json");
const MANIFEST_PATH = join(repoRoot, "content/manifests/corpus-manifest.json");
const RAW_DIR = join(corpusRoot, "raw");
const OUT_DB = join(corpusRoot, "out/scripture.db");
const SHIP_DB = join(repoRoot, "packages/scripture/assets/scripture.db");

const skipDownload = process.argv.includes("--skip-download");

/** @typedef {{ translation_id: string, display_name: string, language_code: string, url: string, archive_filename: string, sha256: string }} CorpusSource */

function loadSources() {
  return /** @type {{ sources: CorpusSource[] }} */ (
    JSON.parse(readFileSync(SOURCES_PATH, "utf8"))
  );
}

async function ensureArchive(source) {
  mkdirSync(RAW_DIR, { recursive: true });
  const archivePath = join(RAW_DIR, source.archive_filename);
  if (!existsSync(archivePath)) {
    if (skipDownload) {
      throw new Error(`Missing archive ${archivePath}; run without --skip-download`);
    }
    console.log(`Downloading ${source.url} …`);
    execFileSync("curl", ["-fsSL", "-o", archivePath, source.url], {
      stdio: "inherit",
    });
  }
  const digest = await sha256File(archivePath);
  if (digest !== source.sha256) {
    throw new Error(
      `SHA-256 mismatch for ${source.archive_filename}: expected ${source.sha256}, got ${digest}`,
    );
  }
  return archivePath;
}

function extractArchive(archivePath) {
  const extractDir = join(RAW_DIR, basename(archivePath, ".zip"));
  if (!existsSync(extractDir)) {
    mkdirSync(extractDir, { recursive: true });
    execFileSync("unzip", ["-qo", archivePath, "-d", extractDir], {
      stdio: "inherit",
    });
  }
  return extractDir;
}

function listUsfmFiles(extractDir, translationId) {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.toLowerCase().endsWith(".usfm")) {
        files.push(full);
      }
    }
  };
  walk(extractDir);
  return files.filter((file) => {
    if (translationId === "bsb-en") {
      return bookUsfmFromBsbFilename(file) !== null;
    }
    return bookUsfmFromRv1909Filename(file) !== null;
  });
}

function resolveBookUsfm(file, translationId) {
  if (translationId === "bsb-en") {
    return bookUsfmFromBsbFilename(file);
  }
  return bookUsfmFromRv1909Filename(file);
}

function loadSchema(db) {
  db.exec(readFileSync(SCHEMA_PATH, "utf8"));
}

function seedBooks(db) {
  const insert = db.prepare(
    `INSERT INTO books (book_usfm, canon_order, testament, name_en, chapter_count)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const book of PROTESTANT_BOOKS) {
    insert.run(
      book.book_usfm,
      book.canon_order,
      book.testament,
      book.name_en,
      book.chapters,
    );
  }
}

function seedTranslations(db, sources) {
  const insert = db.prepare(
    `INSERT INTO translations (id, display_name, language_code, versification_id)
     VALUES (?, ?, ?, 'standard')`,
  );
  for (const source of sources) {
    insert.run(source.translation_id, source.display_name, source.language_code);
  }
}

/**
 * @param {DatabaseSync} db
 * @param {string} translationId
 * @param {string} bookUsfm
 * @param {ReturnType<typeof parseUsfmBook>} parsed
 */
function importBook(db, translationId, bookUsfm, parsed) {
  const insertBlock = db.prepare(
    `INSERT INTO content_blocks (translation_id, book_usfm, chapter, block_order, block_type)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const insertVerse = db.prepare(
    `INSERT INTO verse_segments (
       translation_id, book_usfm, chapter, verse, verse_end, content_block_id, segment_order, text
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  let verseCount = 0;
  const chapterVerseCounts = new Map();

  for (const chapter of parsed.chapters) {
    let blockOrder = 0;
    for (const block of chapter.blocks) {
      blockOrder += 1;
      insertBlock.run(
        translationId,
        bookUsfm,
        chapter.chapter,
        blockOrder,
        block.block_type,
      );
      const blockId = /** @type {number} */ (
        db.prepare("SELECT last_insert_rowid() AS id").get().id
      );
      let segmentOrder = 0;
      for (const verse of block.verses) {
        insertVerse.run(
          translationId,
          bookUsfm,
          chapter.chapter,
          verse.verse,
          verse.verse_end,
          blockId,
          segmentOrder,
          verse.text,
        );
        segmentOrder += 1;
        verseCount += 1;
        chapterVerseCounts.set(
          chapter.chapter,
          (chapterVerseCounts.get(chapter.chapter) ?? 0) + 1,
        );
      }
    }
  }

  const upsertChapter = db.prepare(
    `INSERT INTO chapters (book_usfm, chapter, verse_count, integrity_hash)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(book_usfm, chapter) DO UPDATE SET
       verse_count = excluded.verse_count,
       integrity_hash = excluded.integrity_hash`,
  );

  for (const [ch, count] of chapterVerseCounts.entries()) {
    const rows = db
      .prepare(
        `SELECT verse, text FROM verse_segments
         WHERE translation_id = ? AND book_usfm = ? AND chapter = ?
         ORDER BY verse, segment_order`,
      )
      .all(translationId, bookUsfm, ch);
    const digest = sha256(
      rows.map((r) => `${r.verse}|${r.text}`).join("\n"),
    );
    upsertChapter.run(bookUsfm, ch, count, digest);
  }

  return verseCount;
}

async function main() {
  const { sources } = loadSources();
  mkdirSync(dirname(OUT_DB), { recursive: true });
  mkdirSync(dirname(SHIP_DB), { recursive: true });

  if (existsSync(OUT_DB)) {
    unlinkSync(OUT_DB);
  }

  const db = new DatabaseSync(OUT_DB);
  loadSchema(db);
  seedBooks(db);
  seedTranslations(db, sources);

  /** @type {Record<string, { books: string[], verse_count: number, archive_sha256: string }>} */
  const perTranslation = {};

  db.exec("BEGIN");
  try {
    for (const source of sources) {
      const archivePath = await ensureArchive(source);
      const extractDir = extractArchive(archivePath);
      const files = listUsfmFiles(extractDir, source.translation_id);
      const importedBooks = [];
      let verseTotal = 0;

      for (const file of files.sort()) {
        const bookUsfm = resolveBookUsfm(file, source.translation_id);
        if (!bookUsfm || !BOOK_BY_USFM.has(bookUsfm)) {
          continue;
        }
        const usfm = readFileSync(file, "utf8");
        const parsed = parseUsfmBook(usfm);
        const effectiveBook = parsed.book_usfm ?? bookUsfm;
        if (effectiveBook !== bookUsfm) {
          console.warn(
            `Book code mismatch ${file}: filename ${bookUsfm}, \\id ${parsed.book_usfm}`,
          );
        }
        verseTotal += importBook(db, source.translation_id, bookUsfm, parsed);
        importedBooks.push(bookUsfm);
      }

      importedBooks.sort();
      perTranslation[source.translation_id] = {
        books: importedBooks,
        verse_count: verseTotal,
        archive_sha256: source.sha256,
      };
    }

    const rowDigest = db
      .prepare(
        `SELECT translation_id, book_usfm, chapter, verse, text
         FROM verse_segments ORDER BY translation_id, book_usfm, chapter, verse, segment_order`,
      )
      .all()
      .map((r) => `${r.translation_id}|${r.book_usfm}|${r.chapter}|${r.verse}|${r.text}`)
      .join("\n");
    const integrity_hash = sha256(rowDigest);

    const insertMeta = db.prepare(
      `INSERT INTO corpus_metadata (key, value) VALUES (?, ?)`,
    );
    insertMeta.run("corpus_version", CORPUS_VERSION);
    insertMeta.run("integrity_hash", integrity_hash);
    insertMeta.run("schema", "scripture.sql");

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  db.close();

  copyFileSync(OUT_DB, SHIP_DB);
  const db_sha256 = await sha256File(SHIP_DB);

  const manifest = {
    schema_version: 1,
    corpus_version: CORPUS_VERSION,
    generated_at: new Date().toISOString(),
    phase: "alpha-corpus",
    sources_manifest: "content/manifests/corpus-sources.json",
    rights_ledger: "content/manifests/rights-ledger.yaml",
    db_path: "packages/scripture/assets/scripture.db",
    db_sha256,
    translations: perTranslation,
    book_inventory_expected: PROTESTANT_BOOKS.length,
    note: "Alpha shipping corpus — BSB + RV1909; not counsel-signed.",
  };

  const verifyDb = new DatabaseSync(SHIP_DB);
  const integrity_hash = verifyDb
    .prepare(`SELECT value FROM corpus_metadata WHERE key = 'integrity_hash'`)
    .get().value;
  manifest.integrity_hash = integrity_hash;
  verifyDb.close();

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log("Build OK");
  console.log(`  DB: ${SHIP_DB}`);
  console.log(`  SHA-256: ${db_sha256}`);
  for (const [tid, stats] of Object.entries(perTranslation)) {
    console.log(
      `  ${tid}: ${stats.books.length} books, ${stats.verse_count} verse rows`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
