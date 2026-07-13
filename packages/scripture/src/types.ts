export type Testament = "OT" | "NT";

export type TranslationCode = "BSB" | "RV1909";

export const TRANSLATION_IDS = {
  BSB: "bsb-en",
  RV1909: "rv1909-es",
} as const;

export type TranslationId = (typeof TRANSLATION_IDS)[TranslationCode];

export type BibleBook = {
  usfm: string;
  nameEn: string;
  nameEs: string;
  testament: Testament;
  chapters: number;
};

export type VerseRow = {
  translationId: TranslationId;
  bookUsfm: string;
  chapter: number;
  verse: number;
  text: string;
};

export type ChapterContent = {
  bookUsfm: string;
  chapter: number;
  translationId: TranslationId;
  verses: VerseRow[];
};

export type SearchHit = {
  translationId: TranslationId;
  bookUsfm: string;
  chapter: number;
  verse: number;
  text: string;
  snippet: string;
};

export type DailyPassage = {
  bookUsfm: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  primaryTranslationId: TranslationId;
  verses: VerseRow[];
};

export type SqlDriver = {
  getAllAsync<T>(sql: string, ...params: unknown[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, ...params: unknown[]): Promise<T | null>;
};
