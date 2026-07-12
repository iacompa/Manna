/**
 * BYOK settings screen — imports @manna/ai-byok only when EXPO_PUBLIC_ENABLE_BYOK=true.
 * Wired to Expo Router in Phase 1; file path is the contract anchor per AGENTS.md.
 */
import { Text, View } from "react-native";

const byokEnabled = process.env.EXPO_PUBLIC_ENABLE_BYOK === "true";

export default function AiProviderSettingsScreen() {
  if (!byokEnabled) {
    return null;
  }

  return (
    <View>
      <Text>AI provider (BYOK) — implement via @manna/ai-byok</Text>
    </View>
  );
}
