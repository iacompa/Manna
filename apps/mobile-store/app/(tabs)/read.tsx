import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { getFixtureVerseCount } from '@/lib/corpus-sqlite';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

export default function ReadTabScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    void getFixtureVerseCount().then(setCount);
  }, []);

  return (
    <ScreenShell title={t('read.title')}>
      <Text style={{ ...typography.body, color: colors.textSecondary }}>
        {t('read.corpusStatus')}: {count ?? '…'} verses (fixture)
      </Text>
      <PrimaryButton label={t('read.openReader')} onPress={() => router.push('/reader')} />
    </ScreenShell>
  );
}
