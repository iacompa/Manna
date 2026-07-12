import { ScreenShell } from '@/components/ScreenShell';
import { isByokEnabled } from '@/lib/byok-flag';
import { getSemanticColors, typography } from '@manna/ui';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, useColorScheme, View } from 'react-native';

function SettingsRow({ href, label }: { href: string; label: string }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  return (
    <Link href={href as never} asChild>
      <Pressable accessibilityRole="button" style={{ paddingVertical: 12 }}>
        <Text style={{ ...typography.body, color: colors.interactive }}>{label}</Text>
      </Pressable>
    </Link>
  );
}

export default function SettingsIndexScreen() {
  const { t } = useTranslation();
  const byok = isByokEnabled();

  return (
    <ScreenShell title={t('settings.title')} scroll>
      <View>
        <SettingsRow href="/(settings)/plus" label={t('settings.plus')} />
        <SettingsRow href="/(settings)/restore" label={t('settings.restore')} />
        {byok ? <SettingsRow href="/(settings)/ai-provider" label={t('settings.aiProvider')} /> : null}
      </View>
    </ScreenShell>
  );
}
