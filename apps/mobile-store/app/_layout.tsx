import '@/i18n';
import { getSemanticColors } from '@manna/ui';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="reader/index" options={{ title: 'Reader' }} />
        <Stack.Screen name="search/index" options={{ title: 'Search' }} />
        <Stack.Screen name="pray/guided" options={{ title: 'Pray' }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
