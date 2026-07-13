import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getScriptureRepository } from "@/lib/corpus-sqlite";
import { readerHref } from "@/lib/reader-routes";
import { bookDisplayName, type BibleBook, type Testament } from "@manna/scripture";
import { getSemanticColors, typography } from "@manna/ui";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useColorScheme, View } from "react-native";

export default function ReadTabScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = getSemanticColors(scheme);
  const locale = i18n.language === "es" ? "es" : "en";

  const [testament, setTestament] = useState<Testament>("NT");
  const [selectedBook, setSelectedBook] = useState<string | null>("JHN");
  const [verseCount, setVerseCount] = useState<number | null>(null);
  const [books, setBooks] = useState<BibleBook[]>([]);

  useEffect(() => {
    void (async () => {
      const repo = await getScriptureRepository();
      setBooks(repo.getBookList(testament));
      setVerseCount(await repo.getVerseCount());
    })();
  }, [testament]);

  const activeBook = books.find((b) => b.usfm === selectedBook);

  return (
    <ScreenShell title={t("read.title")}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>
        {t("read.corpusStatus")}: {verseCount ?? "…"}
      </Text>
      <PrimaryButton label={t("search.title")} onPress={() => router.push("/search")} />

      <View style={{ flexDirection: "row", gap: 8, marginVertical: 12 }}>
        {(["OT", "NT"] as const).map((tab) => (
          <Pressable
            key={tab}
            accessibilityRole="button"
            onPress={() => {
              setTestament(tab);
              setSelectedBook(null);
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: testament === tab ? colors.interactive : colors.surface,
            }}
          >
            <Text
              style={{
                ...typography.body,
                textAlign: "center",
                color: testament === tab ? colors.surface : colors.textPrimary,
              }}
            >
              {tab === "OT" ? t("read.oldTestament") : t("read.newTestament")}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={{ maxHeight: activeBook ? 200 : 380 }} contentContainerStyle={{ gap: 8 }}>
        {books.map((book) => (
          <Pressable
            key={book.usfm}
            accessibilityRole="button"
            onPress={() => setSelectedBook(book.usfm)}
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: selectedBook === book.usfm ? colors.surface : "transparent",
            }}
          >
            <Text style={{ ...typography.body, color: colors.textPrimary }}>
              {bookDisplayName(book, locale)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {activeBook ? (
        <View style={{ marginTop: 16, gap: 8 }}>
          <Text style={{ ...typography.caption, color: colors.textSecondary }}>{t("read.chooseChapter")}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((chapter) => (
              <Pressable
                key={chapter}
                accessibilityRole="button"
                onPress={() => router.push(readerHref(activeBook.usfm, chapter))}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ ...typography.body, color: colors.textPrimary }}>{chapter}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </ScreenShell>
  );
}
