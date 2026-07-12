import * as SQLite from 'expo-sqlite';

export type VerseRow = {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  text: string;
};

const FIXTURE_VERSES: Omit<VerseRow, 'id'>[] = [
  {
    book: 'John',
    chapter: 3,
    verse: 16,
    translation: 'BSB',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  },
  {
    book: 'Juan',
    chapter: 3,
    verse: 16,
    translation: 'RV1909',
    text: 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
  },
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function seedIfEmpty(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM verses');
  if ((row?.c ?? 0) > 0) {
    return;
  }
  for (const verse of FIXTURE_VERSES) {
    await db.runAsync(
      'INSERT INTO verses (book, chapter, verse, translation, text) VALUES (?, ?, ?, ?, ?)',
      verse.book,
      verse.chapter,
      verse.verse,
      verse.translation,
      verse.text,
    );
  }
}

export async function openCorpusDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('manna-corpus-spike');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS verses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          book TEXT NOT NULL,
          chapter INTEGER NOT NULL,
          verse INTEGER NOT NULL,
          translation TEXT NOT NULL,
          text TEXT NOT NULL
        );
      `);
      await seedIfEmpty(db);
      return db;
    })();
  }
  return dbPromise;
}

export async function getFixtureVerseCount(): Promise<number> {
  const db = await openCorpusDatabase();
  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM verses');
  return row?.c ?? 0;
}

export async function getSampleVerse(translation: string): Promise<VerseRow | null> {
  const db = await openCorpusDatabase();
  return db.getFirstAsync<VerseRow>(
    'SELECT * FROM verses WHERE translation = ? ORDER BY id LIMIT 1',
    translation,
  );
}
