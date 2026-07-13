import type { SqlDriver, TranslationId, VerseRow } from "./types";
import { TRANSLATION_IDS } from "./types";
import type { DailyPassage } from "./types";

type DbVerseRow = {
  translation_id: string;
  book_usfm: string;
  chapter: number;
  verse: number;
  text: string;
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

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export async function getDailyPassage(
  driver: SqlDriver,
  options: { date?: Date; locale?: "en" | "es" } = {},
): Promise<DailyPassage | null> {
  const date = options.date ?? new Date();
  const locale = options.locale ?? "en";
  const primaryTranslationId =
    locale === "es" ? TRANSLATION_IDS.RV1909 : TRANSLATION_IDS.BSB;

  const anchors = await driver.getAllAsync<DbVerseRow>(
    `SELECT translation_id, book_usfm, chapter, verse, text
     FROM verse_segments
     WHERE translation_id = ? AND segment_order = 0
     ORDER BY book_usfm, chapter, verse`,
    primaryTranslationId,
  );
  if (anchors.length === 0) return null;

  const index = hashString(dayKey(date)) % anchors.length;
  const anchor = anchors[index];
  if (!anchor) return null;

  const siblings = await driver.getAllAsync<DbVerseRow>(
    `SELECT translation_id, book_usfm, chapter, verse, text
     FROM verse_segments
     WHERE translation_id = ? AND book_usfm = ? AND chapter = ?
     ORDER BY verse ASC, segment_order ASC`,
    primaryTranslationId,
    anchor.book_usfm,
    anchor.chapter,
  );

  const byVerse = new Map<number, string>();
  for (const row of siblings) {
    const existing = byVerse.get(row.verse);
    byVerse.set(row.verse, existing ? `${existing}${row.text}` : row.text);
  }

  const orderedVerses = [...byVerse.entries()].sort(([a], [b]) => a - b);
  const startIdx = orderedVerses.findIndex(([verse]) => verse === anchor.verse);
  if (startIdx < 0) return null;

  const slice = orderedVerses.slice(startIdx, startIdx + 2);
  if (slice.length === 0) return null;

  const verses: VerseRow[] = slice.map(([verse, text]) => ({
    translationId: primaryTranslationId,
    bookUsfm: anchor.book_usfm,
    chapter: anchor.chapter,
    verse,
    text,
  }));

  return {
    bookUsfm: anchor.book_usfm,
    chapter: anchor.chapter,
    verseStart: verses[0].verse,
    verseEnd: verses[verses.length - 1].verse,
    primaryTranslationId,
    verses,
  };
}
