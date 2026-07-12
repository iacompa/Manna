import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, spacing, typography } from '@manna/ui';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme, View } from 'react-native';

const ACTS_STEPS = ['Adoration', 'Confession', 'Thanksgiving', 'Supplication'] as const;

export default function GuidedPrayerScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  return (
    <ScreenShell title={t('pray.guidedActs')} subtitle={t('pray.actsStub')}>
      <View style={{ gap: spacing.sm }}>
        {ACTS_STEPS.map((step, index) => (
          <Text key={step} style={{ ...typography.body, color: colors.textPrimary }}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>
    </ScreenShell>
  );
}
