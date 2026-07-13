import { ChapterProse } from "@/components/ChapterProse";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getScriptureRepository } from "@/lib/corpus-sqlite";
import { readerHref } from "@/lib/reader-routes";
import { bookDisplayName, type TranslationCode, type VerseRow } from "@manna/scripture";
import { getSemanticColors, typography } from "@manna/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, useColorScheme, View } from "react-native";

export default function ReaderScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ book?: string; chapter?: string }>();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = getSemanticColors(scheme);
  const locale = i18n.language === "es" ? "es" : "en";

  const bookUsfm = params.book ?? "JHN";
  const chapter = Number(params.chapter ?? "3") || 3;

  const [translation, setTranslation] = useState<TranslationCode>("BSB");
  const [bilingual, setBilingual] = useState(false);
  const [primaryVerses, setPrimaryVerses] = useState<VerseRow[]>([]);
  const [secondaryVerses, setSecondaryVerses] = useState<VerseRow[]>([]);
  const [subtitle, setSubtitle] = useState("");
  const [adjacent, setAdjacent] = useState<{
    prev: { bookUsfm: string; chapter: number } | null;
    next: { bookUsfm: string; chapter: number } | null;
  }>({ prev: null, next: null });

  useEffect(() => {
    void (async () => {
      const repo = await getScriptureRepository();
      const book = repo.getBookList().find((b) => b.usfm === bookUsfm);
      if (book) {
        setSubtitle(`${bookDisplayName(book, locale)} ${chapter}`);
      } else {
        setSubtitle(`${bookUsfm} ${chapter}`);
      }

      const content = await repo.getChapter(translation, bookUsfm, chapter);
      setPrimaryVerses(content.verses);

      if (bilingual) {
        const other: TranslationCode = translation === "BSB" ? "RV1909" : "BSB";
        const paired = await repo.getChapter(other, bookUsfm, chapter);
        setSecondaryVerses(paired.verses);
      } else {
        setSecondaryVerses([]);
      }

      setAdjacent({
        prev: repo.getAdjacentChapter(bookUsfm, chapter, "prev"),
        next: repo.getAdjacentChapter(bookUsfm, chapter, "next"),
      });
    })();
  }, [bookUsfm, chapter, translation, bilingual, locale]);

  return (
    <ScreenShell title={t("reader.title")} subtitle={subtitle}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {(["BSB", "RV1909"] as const).map((code) => (
          <Pressable
            key={code}
            accessibilityRole="button"
            onPress={() => setTranslation(code)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: translation === code ? colors.interactive : colors.surface,
            }}
          >
            <Text style={{ color: translation === code ? colors.surface : colors.textPrimary }}>{code}</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => setBilingual((value) => !value)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: bilingual ? colors.interactive : colors.surface,
          }}
        >
          <Text style={{ color: bilingual ? colors.surface : colors.textPrimary }}>{t("reader.bilingual")}</Text>
        </Pressable>
      </View>

      {primaryVerses.length === 0 ? (
        <Text style={{ ...typography.body, color: colors.textSecondary }}>{t("reader.missingChapter")}</Text>
      ) : (
        <ChapterProse verses={primaryVerses} secondaryVerses={bilingual ? secondaryVerses : undefined} />
      )}

      <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
        <PrimaryButton
          label={t("reader.previous")}
          onPress={() => {
            if (adjacent.prev) {
              router.replace(readerHref(adjacent.prev.bookUsfm, adjacent.prev.chapter));
            }
          }}
        />
        <PrimaryButton
          label={t("reader.next")}
          onPress={() => {
            if (adjacent.next) {
              router.replace(readerHref(adjacent.next.bookUsfm, adjacent.next.chapter));
            }
          }}
        />
      </View>
    </ScreenShell>
  );
}
