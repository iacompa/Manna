import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { getSampleVerse } from '@/lib/corpus-sqlite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

export default function ReaderScreen() {
  const { t, i18n } = useTranslation();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const [reference, setReference] = useState('—');
  const [text, setText] = useState('…');

  useEffect(() => {
    void (async () => {
      const translation = i18n.language === 'es' ? 'RV1909' : 'BSB';
      const verse = await getSampleVerse(translation);
      if (verse) {
        setReference(`${verse.book} ${verse.chapter}:${verse.verse} · ${verse.translation}`);
        setText(verse.text);
      }
    })();
  }, [i18n.language]);

  return (
    <ScreenShell title={t('reader.title')} subtitle={t('reader.stubNote')}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>{t('reader.reference')}: {reference}</Text>
      <Text style={{ ...typography.scripture, color: colors.textPrimary, backgroundColor: colors.surface, padding: 16 }}>
        {text}
      </Text>
    </ScreenShell>
  );
}
