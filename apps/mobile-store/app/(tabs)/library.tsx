import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  return (
    <ScreenShell title={t('library.title')}>
      <Text style={{ ...typography.body, color: colors.textSecondary }}>{t('library.stub')}</Text>
    </ScreenShell>
  );
}
