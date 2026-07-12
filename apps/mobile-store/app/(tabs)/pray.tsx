import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function PrayTabScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenShell title={t('pray.title')}>
      <PrimaryButton label={t('pray.guidedActs')} onPress={() => router.push('/pray/guided')} />
    </ScreenShell>
  );
}
