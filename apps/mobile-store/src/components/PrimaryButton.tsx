import { getSemanticColors, hitSlop, radius, spacing, typography } from '@manna/ui';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({ label, onPress, variant = 'primary' }: PrimaryButtonProps) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = getSemanticColors(scheme);
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? colors.interactive : colors.surface,
          borderColor: colors.interactive,
          opacity: pressed ? 0.85 : 1,
          minHeight: hitSlop.iosMinTouch,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: isPrimary ? colors.surface : colors.interactive },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
});
