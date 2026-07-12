import { getSemanticColors, spacing, typography } from '@manna/ui';
import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  scroll?: boolean;
}>;

export function ScreenShell({ title, subtitle, children, scroll = true }: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const content = (
    <>
      {title ? <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text> : null}
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}
      {children}
    </>
  );

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
        },
      ]}
    >
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView>
      ) : (
        <View style={styles.scrollContent}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
  },
});
