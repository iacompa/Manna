import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { setAppLanguage, type AppLanguage } from '@/i18n';
import { setStoredLanguage } from '@/lib/onboarding-storage';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function OnboardingLanguageScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  async function choose(lang: AppLanguage) {
    setAppLanguage(lang);
    await setStoredLanguage(lang);
    router.push('/onboarding/goals');
  }

  return (
    <ScreenShell title={t('onboarding.languageTitle')} subtitle={t('onboarding.languageSubtitle')}>
      <View style={{ gap: 12 }}>
        <PrimaryButton label={t('onboarding.english')} onPress={() => void choose('en')} />
        <PrimaryButton
          label={t('onboarding.spanish')}
          variant="secondary"
          onPress={() => void choose('es')}
        />
        <PrimaryButton label={t('onboarding.skip')} variant="secondary" onPress={() => router.push('/onboarding/goals')} />
      </View>
    </ScreenShell>
  );
}
