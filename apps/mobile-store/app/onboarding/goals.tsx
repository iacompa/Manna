import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, spacing, typography } from '@manna/ui';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

const GOAL_KEYS = [
  'comfort',
  'wisdom',
  'prayer',
  'learnScripture',
  'buildHabit',
  'hope',
  'guidance',
  'gratitude',
] as const;

export default function OnboardingGoalsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  const canContinue = useMemo(() => selected.length <= 3, [selected.length]);

  function toggle(goal: string) {
    setSelected((prev) => {
      if (prev.includes(goal)) {
        return prev.filter((g) => g !== goal);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, goal];
    });
  }

  return (
    <ScreenShell title={t('onboarding.goalsTitle')} subtitle={t('onboarding.goalsSubtitle')}>
      <View style={styles.grid}>
        {GOAL_KEYS.map((key) => {
          const active = selected.includes(key);
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              onPress={() => toggle(key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.interactive : colors.surface,
                  borderColor: colors.interactive,
                },
              ]}
            >
              <Text style={{ color: active ? colors.surface : colors.textPrimary, ...typography.body }}>
                {t(`goals.${key}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton
        label={t('onboarding.continue')}
        onPress={() => router.push('/onboarding/reading-setup')}
        variant={canContinue ? 'primary' : 'secondary'}
      />
      <PrimaryButton label={t('onboarding.skip')} variant="secondary" onPress={() => router.push('/onboarding/reading-setup')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
