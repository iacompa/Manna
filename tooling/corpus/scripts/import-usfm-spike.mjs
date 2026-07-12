#!/usr/bin/env node
/**
 * Phase 0 USFM → SQLite spike. Minimal \c / \v parsing only — not a production importer.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const corpusRoot = resolve(__dirname, "..");
const repoRoot = resolve(corpusRoot, "../..");

const FIXTURES = [
  {
    path: join(corpusRoot, "fixtures/bsb-jhn-3-spike.usfm"),
    translation_id: "bsb-en",
    book_usfm: "JHN",
  },
  {
    path: join(corpusRoot, "fixtures/rv1909-jhn-3-spike.usfm"),
    translation_id: "rv1909-es",
    book_usfm: "JHN",
  },
];

const CORPUS_VERSION = "spike-0.1.0";
const DB_PATH = join(corpusRoot, "out/scripture-spike.db");
const MANIFEST_PATH = join(repoRoot, "content/manifests/corpus-spike-manifest.json");
const SCHEMA_PATH = join(corpusRoot, "schema/spike.sql");

function sha256(bufferOrString) {
  return createHash("sha256").update(bufferOrString).digest("hex");
}

/** @param {string} usfm */
function parseMinimalUsfm(usfm) {
  let chapter = null;
  /** @type {{ chapter: number, verse: number, text: string }[]} */
  const verses = [];
  for (const rawLine of usfm.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const chapterMatch = line.match(/^\\c\s+(\d+)/);
    if (chapterMatch) {
      chapter = Number(chapterMatch[1]);
      continue;
    }
    const verseMatch = line.match(/^\\v\s+(\d+)\s+(.*)$/);
    if (verseMatch && chapter !== null) {
      verses.push({
        chapter,
        verse: Number(verseMatch[1]),
        text: verseMatch[2].trim(),
      });
    }
  }
  return verses;
}

function loadSchema(db) {
  const sql = readFileSync(SCHEMA_PATH, "utf8");
  db.exec(sql);
}

function main() {
  mkdirSync(dirname(DB_PATH), { recursive: true });

  if (existsSync(DB_PATH)) {
    unlinkSync(DB_PATH);
  }

  const db = new DatabaseSync(DB_PATH);
  loadSchema(db);

  const insert = db.prepare(
    `INSERT INTO verses (translation_id, book_usfm, chapter, verse, text)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const insertMeta = db.prepare(
    `INSERT INTO corpus_meta (key, value) VALUES (?, ?)`,
  );

  /** @type {Record<string, string>} */
  const fixtureHashes = {};
  /** @type {string[]} */
  const rowDigestParts = [];

  db.exec("BEGIN");
  try {
    for (const fixture of FIXTURES) {
      const raw = readFileSync(fixture.path);
      fixtureHashes[fixture.path.replace(corpusRoot + "/", "")] = sha256(raw);
      const parsed = parseMinimalUsfm(raw.toString("utf8"));
      for (const v of parsed) {
        insert.run(
          fixture.translation_id,
          fixture.book_usfm,
          v.chapter,
          v.verse,
          v.text,
        );
        rowDigestParts.push(
          `${fixture.translation_id}|${fixture.book_usfm}|${v.chapter}|${v.verse}|${v.text}`,
        );
      }
    }
    rowDigestParts.sort();
    const integrity_hash = sha256(rowDigestParts.join("\n"));
    insertMeta.run("corpus_version", CORPUS_VERSION);
    insertMeta.run("integrity_hash", integrity_hash);
    insertMeta.run("schema", "spike.sql");
    db.exec("COMMIT");

    const manifest = {
      schema_version: 1,
      corpus_version: CORPUS_VERSION,
      generated_at: new Date().toISOString(),
      phase: "0E-spike",
      fixtures_sha256: fixtureHashes,
      integrity_hash,
      db_path: "tooling/corpus/out/scripture-spike.db",
      verse_count: rowDigestParts.length,
      rights_ledger: "content/manifests/rights-ledger.yaml",
      note: "Stub manifest — not a signed shipping artifact.",
    };
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
    console.log(
      `Spike OK: ${rowDigestParts.length} verses → ${DB_PATH}\nManifest → ${MANIFEST_PATH}\nintegrity_hash=${integrity_hash}`,
    );
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  } finally {
    db.close();
  }
}

main();
