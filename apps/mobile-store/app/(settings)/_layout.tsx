import { getSemanticColors } from '@manna/ui';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

export default function SettingsLayout() {
  const { t } = useTranslation();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('settings.title') }} />
      <Stack.Screen name="plus" options={{ title: t('settings.plus') }} />
      <Stack.Screen name="restore" options={{ title: t('settings.restore') }} />
      <Stack.Screen name="ai-provider" options={{ title: t('settings.aiProvider') }} />
    </Stack>
  );
}
