import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenShell } from "@/components/ScreenShell";
import { fetchDailyPassage, getScriptureRepository } from "@/lib/corpus-sqlite";
import { readerHref } from "@/lib/reader-routes";
import { bookDisplayName } from "@manna/scripture";
import { getSemanticColors, typography } from "@manna/ui";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, useColorScheme } from "react-native";

function greetingKey(hour: number): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  if (hour < 12) return "greetingMorning";
  if (hour < 18) return "greetingAfternoon";
  return "greetingEvening";
}

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = getSemanticColors(scheme);
  const locale = i18n.language === "es" ? "es" : "en";

  const [passageText, setPassageText] = useState("…");
  const [reference, setReference] = useState("—");
  const [chapterTarget, setChapterTarget] = useState<{ book: string; chapter: number } | null>(null);

  const greeting = useMemo(() => t(`today.${greetingKey(new Date().getHours())}`), [t]);

  useEffect(() => {
    void (async () => {
      const daily = await fetchDailyPassage(locale);
      if (!daily) return;

      const repo = await getScriptureRepository();
      const book = repo.getBookList().find((b) => b.usfm === daily.bookUsfm);
      const bookLabel = book ? bookDisplayName(book, locale) : daily.bookUsfm;
      setReference(`${bookLabel} ${daily.chapter}:${daily.verseStart}${daily.verseEnd > daily.verseStart ? `–${daily.verseEnd}` : ""}`);
      setPassageText(daily.verses.map((v) => v.text).join(" "));
      setChapterTarget({ book: daily.bookUsfm, chapter: daily.chapter });
    })();
  }, [locale]);

  return (
    <ScreenShell title={greeting} subtitle={t("today.dailyPassage")}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>{reference}</Text>
      <Text
        style={{
          ...typography.scripture,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
          padding: 16,
          lineHeight: 28,
        }}
      >
        {passageText}
      </Text>
      <PrimaryButton
        label={t("onboarding.readInContext")}
        onPress={() => {
          if (chapterTarget) {
            router.push(readerHref(chapterTarget.book, chapterTarget.chapter));
          }
        }}
      />
    </ScreenShell>
  );
}
