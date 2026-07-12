import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

export default function OnboardingReadingSetupScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const preview =
    i18n.language === 'es'
      ? 'En el principio creó Dios los cielos y la tierra.'
      : 'In the beginning God created the heavens and the earth.';

  return (
    <ScreenShell title={t('onboarding.readingTitle')} subtitle={t('onboarding.readingSubtitle')}>
      <Text style={{ ...typography.scripture, color: colors.textPrimary, backgroundColor: colors.surface, padding: 16 }}>
        {preview}
      </Text>
      <PrimaryButton label={t('onboarding.continue')} onPress={() => router.push('/onboarding/first-passage')} />
      <PrimaryButton label={t('onboarding.skip')} variant="secondary" onPress={() => router.push('/onboarding/first-passage')} />
    </ScreenShell>
  );
}
