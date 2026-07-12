/**
 * USFM 3.x importer for BSB + RV1909 Alpha archives.
 * Strips footnotes/cross-refs; preserves verse text and paragraph boundaries.
 */

const BLOCK_MARKERS = new Set([
  "p",
  "m",
  "mi",
  "nb",
  "pc",
  "pr",
  "cls",
  "q",
  "q1",
  "q2",
  "q3",
  "qr",
  "qc",
  "b",
  "s",
  "s1",
  "s2",
  "s3",
  "s4",
]);

/**
 * @param {string} raw
 */
export function stripUsfmDecorations(raw) {
  let text = raw;
  text = text.replace(/\\f\s+\+\s+[\s\S]*?\\f\*/g, " ");
  text = text.replace(/\\f\s+[\s\S]*?\\f\*/g, " ");
  text = text.replace(/\\ref\s+[\s\S]*?\\ref\*/g, " ");
  text = text.replace(/\\xt\s+[\s\S]*?\\xt\*/g, " ");
  text = text.replace(/\\wj\s*/g, "");
  text = text.replace(/\\wj\*/g, "");
  text = text.replace(/\\add\s*/g, "");
  text = text.replace(/\\add\*/g, "");
  text = text.replace(/\\nd\s*/g, "");
  text = text.replace(/\\nd\*/g, "");
  text = text.replace(/\\em\s*/g, "");
  text = text.replace(/\\em\*/g, "");
  text = text.replace(/\\\+[\w]+\s*/g, " ");
  text = text.replace(/\\\+[\w]+\*/g, " ");
  text = text.replace(/\\[a-z]+\d?\*?/gi, " ");
  text = text.replace(/\s+/g, " ");
  return text.trim();
}

/**
 * @param {string} usfm
 * @returns {{
 *   book_usfm: string | null,
 *   chapters: {
 *     chapter: number,
 *     blocks: {
 *       block_type: string,
 *       verses: { verse: number, verse_end: number | null, text: string }[],
 *     }[],
 *   }[],
 * }}
 */
export function parseUsfmBook(usfm) {
  const idMatch = usfm.match(/^\\id\s+(\S+)/m);
  const book_usfm = idMatch ? idMatch[1].toUpperCase() : null;

  /** @type {Map<number, { block_type: string, verses: { verse: number, verse_end: number | null, text: string }[] }[]>} */
  const chapterMap = new Map();

  let chapter = 0;
  let blockOrder = 0;
  /** @type {{ block_type: string, verses: { verse: number, verse_end: number | null, text: string }[] } | null} */
  let currentBlock = null;

  const ensureChapter = () => {
    if (!chapterMap.has(chapter)) {
      chapterMap.set(chapter, []);
    }
    return chapterMap.get(chapter);
  };

  const startBlock = (blockType) => {
    const blocks = ensureChapter();
    blockOrder += 1;
    currentBlock = { block_type: blockType, verses: [] };
    blocks.push(currentBlock);
  };

  const addVerse = (verse, verseEnd, text) => {
    if (!currentBlock) {
      startBlock("paragraph");
    }
    const cleaned = stripUsfmDecorations(text);
    if (!cleaned) {
      return;
    }
    currentBlock.verses.push({
      verse,
      verse_end: verseEnd,
      text: cleaned,
    });
  };

  const extractVersesFromLine = (line) => {
    const verseStart = /\\v\s+(\d+)(?:-(\d+))?\s*/g;
    const matches = [...line.matchAll(verseStart)];
    if (matches.length === 0) {
      return;
    }
    for (let i = 0; i < matches.length; i += 1) {
      const match = matches[i];
      const verse = Number(match[1]);
      const verseEnd = match[2] ? Number(match[2]) : null;
      const start = match.index + match[0].length;
      const end =
        i + 1 < matches.length ? matches[i + 1].index : line.length;
      addVerse(verse, verseEnd, line.slice(start, end));
    }
  };

  for (const rawLine of usfm.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      continue;
    }

    const chapterMatch = line.match(/^\\c\s+(\d+)/);
    if (chapterMatch) {
      chapter = Number(chapterMatch[1]);
      blockOrder = 0;
      currentBlock = null;
      ensureChapter();
      const remainder = line.replace(/^\\c\s+\d+\s*/, "");
      if (remainder.trim()) {
        extractVersesFromLine(remainder);
      }
      continue;
    }

    const markerMatch = line.match(/^\\([a-z]+\d?)\s*(.*)$/i);
    if (markerMatch) {
      const marker = markerMatch[1].toLowerCase();
      const rest = markerMatch[2] ?? "";
      if (marker === "c") {
        continue;
      }
      if (BLOCK_MARKERS.has(marker)) {
        startBlock(marker.startsWith("s") ? "heading" : "paragraph");
        if (rest.trim()) {
          extractVersesFromLine(rest);
        }
        continue;
      }
      if (marker === "v") {
        if (!currentBlock) {
          startBlock("paragraph");
        }
        extractVersesFromLine(line);
        continue;
      }
      if (rest.trim()) {
        if (!currentBlock) {
          startBlock("paragraph");
        }
        extractVersesFromLine(rest);
      }
      continue;
    }

    if (line.includes("\\v")) {
      if (!currentBlock) {
        startBlock("paragraph");
      }
      extractVersesFromLine(line);
      continue;
    }

    if (currentBlock && currentBlock.verses.length > 0) {
      const last = currentBlock.verses[currentBlock.verses.length - 1];
      const extra = stripUsfmDecorations(line);
      if (extra) {
        last.text = `${last.text} ${extra}`.replace(/\s+/g, " ").trim();
      }
    }
  }

  const chapters = [...chapterMap.entries()]
    .filter(([ch]) => ch > 0)
    .sort((a, b) => a[0] - b[0])
    .map(([ch, blocks]) => ({
      chapter: ch,
      blocks: blocks.filter((b) => b.verses.length > 0),
    }));

  return { book_usfm, chapters };
}
