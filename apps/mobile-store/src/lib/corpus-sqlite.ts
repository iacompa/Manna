import {
  createScriptureRepository,
  getDailyPassage,
  type ScriptureRepository,
  type SqlDriver,
  type TranslationCode,
} from "@manna/scripture";
import * as SQLite from "expo-sqlite";
import { importDatabaseFromAssetAsync } from "expo-sqlite";

const DB_NAME = "scripture.db";

let repoPromise: Promise<ScriptureRepository> | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function toDriver(db: SQLite.SQLiteDatabase): SqlDriver {
  return {
    getAllAsync: <T,>(sql: string, ...params: SQLite.SQLiteBindValue[]) =>
      db.getAllAsync<T>(sql, ...params),
    getFirstAsync: <T,>(sql: string, ...params: SQLite.SQLiteBindValue[]) =>
      db.getFirstAsync<T>(sql, ...params),
  };
}

async function openBundledDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      await importDatabaseFromAssetAsync(DB_NAME, {
        assetId: require("../../assets/scripture.db"),
        forceOverwrite: false,
      });
      return SQLite.openDatabaseAsync(DB_NAME);
    })();
  }
  return dbPromise;
}

export async function getScriptureRepository(): Promise<ScriptureRepository> {
  if (!repoPromise) {
    repoPromise = (async () => {
      const db = await openBundledDatabase();
      return createScriptureRepository(toDriver(db));
    })();
  }
  return repoPromise;
}

export async function fetchDailyPassage(locale: "en" | "es") {
  const db = await openBundledDatabase();
  return getDailyPassage(toDriver(db), { locale });
}

export async function getSampleVerse(translation: TranslationCode) {
  const repo = await getScriptureRepository();
  const chapter = await repo.getChapter(translation, "JHN", 3);
  return chapter.verses.find((verse) => verse.verse === 16) ?? chapter.verses[0] ?? null;
}
