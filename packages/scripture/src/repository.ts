import { getBookByUsfm, getBookList as listBooks, type BibleBook } from "./books";
import type {
  ChapterContent,
  SearchHit,
  SqlDriver,
  Testament,
  TranslationCode,
  TranslationId,
  VerseRow,
} from "./types";
import { TRANSLATION_IDS } from "./types";

function toTranslationId(code: TranslationCode): TranslationId {
  return TRANSLATION_IDS[code];
}

type DbVerseRow = {
  translation_id: string;
  book_usfm: string;
  chapter: number;
  verse: number;
  text: string;
  segment_order?: number;
};

function mapVerse(row: DbVerseRow): VerseRow {
  return {
    translationId: row.translation_id as TranslationId,
    bookUsfm: row.book_usfm,
    chapter: row.chapter,
    verse: row.verse,
    text: row.text,
  };
}

function mergeVerseSegments(rows: DbVerseRow[]): VerseRow[] {
  const verses: VerseRow[] = [];
  for (const row of rows) {
    const last = verses[verses.length - 1];
    if (last && last.verse === row.verse && last.bookUsfm === row.book_usfm) {
      last.text += row.text;
      continue;
    }
    verses.push(mapVerse(row));
  }
  return verses;
}

export type ScriptureRepository = {
  getCorpusVersion: () => Promise<string | null>;
  getVerseCount: () => Promise<number>;
  getBookList: (testament?: Testament) => BibleBookRef[];
  getChapter: (
    translation: TranslationCode,
    bookUsfm: string,
    chapter: number,
  ) => Promise<ChapterContent>;
  getBilingualChapter: (
    bookUsfm: string,
    chapter: number,
  ) => Promise<{ bsb: ChapterContent; rv1909: ChapterContent }>;
  searchKeyword: (
    query: string,
    translation?: TranslationCode,
    limit?: number,
  ) => Promise<SearchHit[]>;
  getAdjacentChapter: (
    bookUsfm: string,
    chapter: number,
    direction: "prev" | "next",
  ) => { bookUsfm: string; chapter: number } | null;
};

export type BibleBookRef = BibleBook;

export function createScriptureRepository(driver: SqlDriver): ScriptureRepository {
  return {
    async getCorpusVersion() {
      const row = await driver.getFirstAsync<{ value: string }>(
        "SELECT value FROM corpus_metadata WHERE key = ? LIMIT 1",
        "corpus_version",
      );
      return row?.value ?? null;
    },

    async getVerseCount() {
      const row = await driver.getFirstAsync<{ c: number }>(
        "SELECT COUNT(*) as c FROM verse_segments",
      );
      return row?.c ?? 0;
    },

    getBookList(testament?: Testament) {
      return listBooks(testament);
    },

    async getChapter(translation, bookUsfm, chapter) {
      const translationId = toTranslationId(translation);
      const rows = await driver.getAllAsync<DbVerseRow>(
        `SELECT translation_id, book_usfm, chapter, verse, text, segment_order
         FROM verse_segments
         WHERE translation_id = ? AND book_usfm = ? AND chapter = ?
         ORDER BY verse ASC, segment_order ASC`,
        translationId,
        bookUsfm,
        chapter,
      );
      return {
        bookUsfm,
        chapter,
        translationId,
        verses: mergeVerseSegments(rows),
      };
    },

    async getBilingualChapter(bookUsfm, chapter) {
      const [bsb, rv1909] = await Promise.all([
        this.getChapter("BSB", bookUsfm, chapter),
        this.getChapter("RV1909", bookUsfm, chapter),
      ]);
      return { bsb, rv1909 };
    },

    async searchKeyword(query, translation, limit = 40) {
      const trimmed = query.trim();
      if (!trimmed) return [];

      const ftsQuery = trimmed
        .split(/\s+/)
        .map((term) => term.replace(/"/g, '""'))
        .filter(Boolean)
        .map((term) => `"${term}"*`)
        .join(" ");

      const translationId = translation ? toTranslationId(translation) : null;

      const rows = await driver.getAllAsync<{
        translation_id: string;
        book_usfm: string;
        chapter: number;
        verse: number;
        text: string;
        snippet: string;
      }>(
        translationId
          ? `SELECT translation_id, book_usfm, chapter, verse, text,
                    snippet(verse_search, 4, '', '', '…', 24) AS snippet
             FROM verse_search
             WHERE verse_search MATCH ? AND translation_id = ?
             ORDER BY rank
             LIMIT ?`
          : `SELECT translation_id, book_usfm, chapter, verse, text,
                    snippet(verse_search, 4, '', '', '…', 24) AS snippet
             FROM verse_search
             WHERE verse_search MATCH ?
             ORDER BY rank
             LIMIT ?`,
        ...(translationId ? [ftsQuery, translationId, limit] : [ftsQuery, limit]),
      );

      return rows.map((row) => ({
        translationId: row.translation_id as TranslationId,
        bookUsfm: row.book_usfm,
        chapter: row.chapter,
        verse: row.verse,
        text: row.text,
        snippet: row.snippet,
      }));
    },

    getAdjacentChapter(bookUsfm, chapter, direction) {
      const book = getBookByUsfm(bookUsfm);
      if (!book) return null;

      if (direction === "next") {
        if (chapter < book.chapters) {
          return { bookUsfm, chapter: chapter + 1 };
        }
        const books = listBooks();
        const idx = books.findIndex((b) => b.usfm === bookUsfm);
        const nextBook = books[idx + 1];
        return nextBook ? { bookUsfm: nextBook.usfm, chapter: 1 } : null;
      }

      if (chapter > 1) {
        return { bookUsfm, chapter: chapter - 1 };
      }
      const books = listBooks();
      const idx = books.findIndex((b) => b.usfm === bookUsfm);
      const prevBook = books[idx - 1];
      return prevBook ? { bookUsfm: prevBook.usfm, chapter: prevBook.chapters } : null;
    },
  };
}
