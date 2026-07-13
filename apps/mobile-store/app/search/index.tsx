import { ScreenShell } from "@/components/ScreenShell";
import { getScriptureRepository } from "@/lib/corpus-sqlite";
import { readerHref } from "@/lib/reader-routes";
import { bookDisplayName, type SearchHit, type TranslationCode } from "@manna/scripture";
import { getSemanticColors, typography } from "@manna/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, useColorScheme, View } from "react-native";

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = getSemanticColors(scheme);
  const locale = i18n.language === "es" ? "es" : "en";
  const defaultTranslation: TranslationCode = locale === "es" ? "RV1909" : "BSB";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [bookNames, setBookNames] = useState<Record<string, string>>({});

  async function runSearch() {
    setSearching(true);
    try {
      const repo = await getScriptureRepository();
      const hits = await repo.searchKeyword(query, defaultTranslation);
      setResults(hits);
      const names: Record<string, string> = {};
      for (const book of repo.getBookList()) {
        names[book.usfm] = bookDisplayName(book, locale);
      }
      setBookNames(names);
    } finally {
      setSearching(false);
    }
  }

  return (
    <ScreenShell title={t("search.title")} subtitle={t("search.subtitle")}>
      <TextInput
        accessibilityLabel={t("search.placeholder")}
        placeholder={t("search.placeholder")}
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => void runSearch()}
        style={{
          borderWidth: 1,
          borderColor: colors.textSecondary,
          borderRadius: 10,
          padding: 12,
          color: colors.textPrimary,
          marginBottom: 12,
        }}
        autoCapitalize="none"
        returnKeyType="search"
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => void runSearch()}
        style={{ padding: 12, borderRadius: 10, backgroundColor: colors.interactive, marginBottom: 16 }}
      >
        <Text style={{ ...typography.body, color: colors.surface, textAlign: "center" }}>
          {searching ? t("search.searching") : t("search.action")}
        </Text>
      </Pressable>

      <View style={{ gap: 12 }}>
        {results.map((hit) => (
          <Pressable
            key={`${hit.translationId}-${hit.bookUsfm}-${hit.chapter}-${hit.verse}`}
            accessibilityRole="button"
            onPress={() => router.push(readerHref(hit.bookUsfm, hit.chapter))}
            style={{ padding: 12, borderRadius: 10, backgroundColor: colors.surface }}
          >
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              {bookNames[hit.bookUsfm] ?? hit.bookUsfm} {hit.chapter}:{hit.verse}
            </Text>
            <Text style={{ ...typography.body, color: colors.textPrimary }}>{hit.snippet || hit.text}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}
