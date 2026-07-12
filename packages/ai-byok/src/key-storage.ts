/**
 * SecureStore-backed API key persistence (device only).
 * Implementation lands in Phase 1; interface is stable for kill-switch packaging.
 */
export type ByokKeyStorage = {
  getApiKey(): Promise<string | null>;
  setApiKey(key: string): Promise<void>;
  clearApiKey(): Promise<void>;
};

export const BYOK_SECURE_STORE_KEY = "manna.byok.openrouter_api_key";

/** Phase 0 in-memory stub — never used in production store builds with flag off. */
export function createInMemoryByokKeyStorage(): ByokKeyStorage {
  let value: string | null = null;
  return {
    async getApiKey() {
      return value;
    },
    async setApiKey(key: string) {
      value = key;
    },
    async clearApiKey() {
      value = null;
    },
  };
}
