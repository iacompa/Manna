import type { AiRequest, AiResult } from "@manna/contracts";
import { aiResultSchema } from "@manna/contracts";

export type PlusAiClientConfig = {
  /** e.g. https://<project>.supabase.co/functions/v1 */
  functionsBaseUrl: string;
  getAccessToken: () => Promise<string | null>;
  fetchImpl?: typeof fetch;
};

export type RunPlusAiOptions = {
  signal?: AbortSignal;
};

export type RunPlusAiOutcome =
  | { ok: true; result: AiResult }
  | { ok: false; kind: "offline" | "unauthorized" | "invalid_response" | "http_error"; status?: number };

/**
 * Thin Plus AI transport — no provider SDKs, no model selection (ADR-0002).
 */
export async function runPlusAi(
  request: AiRequest,
  config: PlusAiClientConfig,
  options: RunPlusAiOptions = {},
): Promise<RunPlusAiOutcome> {
  const fetchFn = config.fetchImpl ?? fetch;
  const token = await config.getAccessToken();
  if (!token) {
    return { ok: false, kind: "unauthorized" };
  }

  const base = config.functionsBaseUrl.replace(/\/$/, "");
  let response: Response;
  try {
    response = await fetchFn(`${base}/ai-run`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": request.idempotencyKey,
      },
      body: JSON.stringify(request),
      signal: options.signal,
    });
  } catch {
    return { ok: false, kind: "offline" };
  }

  if (!response.ok) {
    return { ok: false, kind: "http_error", status: response.status };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return { ok: false, kind: "invalid_response" };
  }

  const parsed = aiResultSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, kind: "invalid_response" };
  }

  return { ok: true, result: parsed.data };
}
