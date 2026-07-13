import type { VerseRow } from "@manna/scripture";
import { getSemanticColors, typography } from "@manna/ui";
import { Text, useColorScheme, View } from "react-native";

type Props = {
  verses: VerseRow[];
  secondaryVerses?: VerseRow[];
};

export function ChapterProse({ verses, secondaryVerses }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = getSemanticColors(scheme);
  const secondaryByVerse = new Map(secondaryVerses?.map((v) => [v.verse, v.text]) ?? []);

  if (verses.length === 0) {
    return <Text style={{ ...typography.body, color: colors.textSecondary }}>—</Text>;
  }

  return (
    <View style={{ gap: secondaryVerses?.length ? 12 : 0 }}>
      {verses.map((verse) => (
        <Text
          key={`${verse.translationId}-${verse.verse}`}
          style={{ ...typography.scripture, color: colors.textPrimary, lineHeight: 28 }}
        >
          <Text style={{ ...typography.caption, color: colors.textSecondary }}>{verse.verse} </Text>
          {verse.text}
          {secondaryByVerse.has(verse.verse) ? (
            <Text style={{ ...typography.body, color: colors.textSecondary }}>
              {"\n"}
              {secondaryByVerse.get(verse.verse)}
            </Text>
          ) : null}
        </Text>
      ))}
    </View>
  );
}
