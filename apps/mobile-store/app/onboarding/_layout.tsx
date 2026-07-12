import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="language" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="reading-setup" />
      <Stack.Screen name="first-passage" />
    </Stack>
  );
}
