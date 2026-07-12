import { ScreenShell } from '@/components/ScreenShell';
import { getSemanticColors, typography } from '@manna/ui';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

export default function SettingsRestoreScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  return (
    <ScreenShell title={t('settings.restore')}>
      <Text style={{ ...typography.body, color: colors.textSecondary }}>{t('settings.restoreStub')}</Text>
    </ScreenShell>
  );
}
