import { DEFAULT_BYOK_SETTINGS } from "./types";

export type AiProviderSettingsScreenProps = {
  /** Reserved for Phase 1 navigation hooks. */
  testID?: string;
};

/**
 * BYOK settings UI shell — OpenRouter client wiring is Phase 1.
 * React Native view implementation mounts from the store app when the flag is on.
 */
export function AiProviderSettingsScreen(_props: AiProviderSettingsScreenProps = {}) {
  void DEFAULT_BYOK_SETTINGS.modelId;
  return null;
}
