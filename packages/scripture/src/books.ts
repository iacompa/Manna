import type { BibleBook, Testament } from "./types";

export type { BibleBook };

export const BIBLE_BOOKS: BibleBook[] = [
  { usfm: "GEN", nameEn: "Genesis", nameEs: "Génesis", testament: "OT", chapters: 50 },
  { usfm: "EXO", nameEn: "Exodus", nameEs: "Éxodo", testament: "OT", chapters: 40 },
  { usfm: "LEV", nameEn: "Leviticus", nameEs: "Levítico", testament: "OT", chapters: 27 },
  { usfm: "NUM", nameEn: "Numbers", nameEs: "Números", testament: "OT", chapters: 36 },
  { usfm: "DEU", nameEn: "Deuteronomy", nameEs: "Deuteronomio", testament: "OT", chapters: 34 },
  { usfm: "JOS", nameEn: "Joshua", nameEs: "Josué", testament: "OT", chapters: 24 },
  { usfm: "JDG", nameEn: "Judges", nameEs: "Jueces", testament: "OT", chapters: 21 },
  { usfm: "RUT", nameEn: "Ruth", nameEs: "Rut", testament: "OT", chapters: 4 },
  { usfm: "1SA", nameEn: "1 Samuel", nameEs: "1 Samuel", testament: "OT", chapters: 31 },
  { usfm: "2SA", nameEn: "2 Samuel", nameEs: "2 Samuel", testament: "OT", chapters: 24 },
  { usfm: "1KI", nameEn: "1 Kings", nameEs: "1 Reyes", testament: "OT", chapters: 22 },
  { usfm: "2KI", nameEn: "2 Kings", nameEs: "2 Reyes", testament: "OT", chapters: 25 },
  { usfm: "1CH", nameEn: "1 Chronicles", nameEs: "1 Crónicas", testament: "OT", chapters: 29 },
  { usfm: "2CH", nameEn: "2 Chronicles", nameEs: "2 Crónicas", testament: "OT", chapters: 36 },
  { usfm: "EZR", nameEn: "Ezra", nameEs: "Esdras", testament: "OT", chapters: 10 },
  { usfm: "NEH", nameEn: "Nehemiah", nameEs: "Nehemías", testament: "OT", chapters: 13 },
  { usfm: "EST", nameEn: "Esther", nameEs: "Ester", testament: "OT", chapters: 10 },
  { usfm: "JOB", nameEn: "Job", nameEs: "Job", testament: "OT", chapters: 42 },
  { usfm: "PSA", nameEn: "Psalms", nameEs: "Salmos", testament: "OT", chapters: 150 },
  { usfm: "PRO", nameEn: "Proverbs", nameEs: "Proverbios", testament: "OT", chapters: 31 },
  { usfm: "ECC", nameEn: "Ecclesiastes", nameEs: "Eclesiastés", testament: "OT", chapters: 12 },
  { usfm: "SNG", nameEn: "Song of Solomon", nameEs: "Cantares", testament: "OT", chapters: 8 },
  { usfm: "ISA", nameEn: "Isaiah", nameEs: "Isaías", testament: "OT", chapters: 66 },
  { usfm: "JER", nameEn: "Jeremiah", nameEs: "Jeremías", testament: "OT", chapters: 52 },
  { usfm: "LAM", nameEn: "Lamentations", nameEs: "Lamentaciones", testament: "OT", chapters: 5 },
  { usfm: "EZK", nameEn: "Ezekiel", nameEs: "Ezequiel", testament: "OT", chapters: 48 },
  { usfm: "DAN", nameEn: "Daniel", nameEs: "Daniel", testament: "OT", chapters: 12 },
  { usfm: "HOS", nameEn: "Hosea", nameEs: "Oseas", testament: "OT", chapters: 14 },
  { usfm: "JOL", nameEn: "Joel", nameEs: "Joel", testament: "OT", chapters: 3 },
  { usfm: "AMO", nameEn: "Amos", nameEs: "Amós", testament: "OT", chapters: 9 },
  { usfm: "OBA", nameEn: "Obadiah", nameEs: "Abdías", testament: "OT", chapters: 1 },
  { usfm: "JON", nameEn: "Jonah", nameEs: "Jonás", testament: "OT", chapters: 4 },
  { usfm: "MIC", nameEn: "Micah", nameEs: "Miqueas", testament: "OT", chapters: 7 },
  { usfm: "NAM", nameEn: "Nahum", nameEs: "Nahúm", testament: "OT", chapters: 3 },
  { usfm: "HAB", nameEn: "Habakkuk", nameEs: "Habacuc", testament: "OT", chapters: 3 },
  { usfm: "ZEP", nameEn: "Zephaniah", nameEs: "Sofonías", testament: "OT", chapters: 3 },
  { usfm: "HAG", nameEn: "Haggai", nameEs: "Hageo", testament: "OT", chapters: 2 },
  { usfm: "ZEC", nameEn: "Zechariah", nameEs: "Zacarías", testament: "OT", chapters: 14 },
  { usfm: "MAL", nameEn: "Malachi", nameEs: "Malaquías", testament: "OT", chapters: 4 },
  { usfm: "MAT", nameEn: "Matthew", nameEs: "Mateo", testament: "NT", chapters: 28 },
  { usfm: "MRK", nameEn: "Mark", nameEs: "Marcos", testament: "NT", chapters: 16 },
  { usfm: "LUK", nameEn: "Luke", nameEs: "Lucas", testament: "NT", chapters: 24 },
  { usfm: "JHN", nameEn: "John", nameEs: "Juan", testament: "NT", chapters: 21 },
  { usfm: "ACT", nameEn: "Acts", nameEs: "Hechos", testament: "NT", chapters: 28 },
  { usfm: "ROM", nameEn: "Romans", nameEs: "Romanos", testament: "NT", chapters: 16 },
  { usfm: "1CO", nameEn: "1 Corinthians", nameEs: "1 Corintios", testament: "NT", chapters: 16 },
  { usfm: "2CO", nameEn: "2 Corinthians", nameEs: "2 Corintios", testament: "NT", chapters: 13 },
  { usfm: "GAL", nameEn: "Galatians", nameEs: "Gálatas", testament: "NT", chapters: 6 },
  { usfm: "EPH", nameEn: "Ephesians", nameEs: "Efesios", testament: "NT", chapters: 6 },
  { usfm: "PHP", nameEn: "Philippians", nameEs: "Filipenses", testament: "NT", chapters: 4 },
  { usfm: "COL", nameEn: "Colossians", nameEs: "Colosenses", testament: "NT", chapters: 4 },
  { usfm: "1TH", nameEn: "1 Thessalonians", nameEs: "1 Tesalonicenses", testament: "NT", chapters: 5 },
  { usfm: "2TH", nameEn: "2 Thessalonians", nameEs: "2 Tesalonicenses", testament: "NT", chapters: 3 },
  { usfm: "1TI", nameEn: "1 Timothy", nameEs: "1 Timoteo", testament: "NT", chapters: 6 },
  { usfm: "2TI", nameEn: "2 Timothy", nameEs: "2 Timoteo", testament: "NT", chapters: 4 },
  { usfm: "TIT", nameEn: "Titus", nameEs: "Tito", testament: "NT", chapters: 3 },
  { usfm: "PHM", nameEn: "Philemon", nameEs: "Filemón", testament: "NT", chapters: 1 },
  { usfm: "HEB", nameEn: "Hebrews", nameEs: "Hebreos", testament: "NT", chapters: 13 },
  { usfm: "JAS", nameEn: "James", nameEs: "Santiago", testament: "NT", chapters: 5 },
  { usfm: "1PE", nameEn: "1 Peter", nameEs: "1 Pedro", testament: "NT", chapters: 5 },
  { usfm: "2PE", nameEn: "2 Peter", nameEs: "2 Pedro", testament: "NT", chapters: 3 },
  { usfm: "1JN", nameEn: "1 John", nameEs: "1 Juan", testament: "NT", chapters: 5 },
  { usfm: "2JN", nameEn: "2 John", nameEs: "2 Juan", testament: "NT", chapters: 1 },
  { usfm: "3JN", nameEn: "3 John", nameEs: "3 Juan", testament: "NT", chapters: 1 },
  { usfm: "JUD", nameEn: "Jude", nameEs: "Judas", testament: "NT", chapters: 1 },
  { usfm: "REV", nameEn: "Revelation", nameEs: "Apocalipsis", testament: "NT", chapters: 22 },
];

export function getBookList(testament?: Testament): BibleBook[] {
  if (!testament) return BIBLE_BOOKS;
  return BIBLE_BOOKS.filter((b) => b.testament === testament);
}

export function getBookByUsfm(usfm: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.usfm === usfm);
}

export function bookDisplayName(book: BibleBook, locale: "en" | "es"): string {
  return locale === "es" ? book.nameEs : book.nameEn;
}
