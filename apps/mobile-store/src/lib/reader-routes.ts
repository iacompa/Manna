import type { Href } from "expo-router";

export function readerHref(bookUsfm: string, chapter: number): Href {
  return {
    pathname: "/reader",
    params: { book: bookUsfm, chapter: String(chapter) },
  };
}
