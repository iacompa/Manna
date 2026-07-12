/** User-entered OpenRouter model id; blank default — no presets in v1. */
export type ByokModelId = string;

export type ByokSettings = {
  /** OpenRouter model id; empty string means unset (blank default). */
  modelId: ByokModelId;
};

export const DEFAULT_BYOK_SETTINGS: ByokSettings = {
  modelId: "",
};
