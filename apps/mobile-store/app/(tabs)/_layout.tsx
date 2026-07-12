import { getSemanticColors } from '@manna/ui';
import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, useColorScheme } from 'react-native';

export default function TabsLayout() {
  const { t } = useTranslation();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.interactive,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerRight: () => (
          <Link href="/(settings)" asChild>
            <Pressable accessibilityRole="button" style={{ marginRight: 16 }}>
              <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
            </Pressable>
          </Link>
        ),
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t('tabs.today'),
          tabBarIcon: ({ color, size }) => <Ionicons name="sunny-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="read"
        options={{
          title: t('tabs.read'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pray"
        options={{
          title: t('tabs.pray'),
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('tabs.library'),
          tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
