import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { getSampleVerse } from '@/lib/corpus-sqlite';
import { setOnboardingComplete } from '@/lib/onboarding-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

export default function OnboardingFirstPassageScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const [passage, setPassage] = useState<string>('…');

  useEffect(() => {
    void (async () => {
      const translation = i18n.language === 'es' ? 'RV1909' : 'BSB';
      const verse = await getSampleVerse(translation);
      setPassage(verse?.text ?? t('today.stubNote'));
    })();
  }, [i18n.language, t]);

  async function finish() {
    await setOnboardingComplete();
    router.replace('/(tabs)/today');
  }

  return (
    <ScreenShell title={t('onboarding.firstPassageTitle')}>
      <Text style={{ ...typography.scripture, color: colors.textPrimary, backgroundColor: colors.surface, padding: 16 }}>
        {passage}
      </Text>
      <PrimaryButton label={t('onboarding.readInContext')} onPress={() => router.push('/reader')} />
      <PrimaryButton label={t('onboarding.finish')} onPress={() => void finish()} />
      <PrimaryButton label={t('onboarding.skip')} variant="secondary" onPress={() => void finish()} />
    </ScreenShell>
  );
}
