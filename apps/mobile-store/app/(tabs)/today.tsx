import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { getSampleVerse } from '@/lib/corpus-sqlite';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

function greetingKey(hour: number): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
  if (hour < 12) return 'greetingMorning';
  if (hour < 18) return 'greetingAfternoon';
  return 'greetingEvening';
}

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const [passage, setPassage] = useState<string>('…');
  const [reference, setReference] = useState('John 3:16');

  const greeting = useMemo(() => t(`today.${greetingKey(new Date().getHours())}`), [t]);

  useEffect(() => {
    void (async () => {
      const translation = i18n.language === 'es' ? 'RV1909' : 'BSB';
      const verse = await getSampleVerse(translation);
      if (verse) {
        setPassage(verse.text);
        setReference(`${verse.book} ${verse.chapter}:${verse.verse} (${verse.translation})`);
      }
    })();
  }, [i18n.language]);

  return (
    <ScreenShell title={greeting} subtitle={t('today.dailyPassage')}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>{reference}</Text>
      <Text style={{ ...typography.scripture, color: colors.textPrimary, backgroundColor: colors.surface, padding: 16 }}>
        {passage}
      </Text>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>{t('today.stubNote')}</Text>
      <PrimaryButton label={t('onboarding.readInContext')} onPress={() => router.push('/reader')} />
    </ScreenShell>
  );
}
