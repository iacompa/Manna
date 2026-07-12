/**
 * Phase 1 stub — POST Plus AI gateway (ADR-0002).
 * Route: Supabase Edge `ai-run` (maps to product surface POST /v1/ai/run).
 * Model is server-held only: gemini-2.5-flash-lite (no generation in this stub).
 */

import {
  PLUS_MODEL_ID,
  failClosedToFreeSearch,
  parseAiRequestBody,
} from "@manna/ai-policy";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, idempotency-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const idempotencyKey = req.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return jsonResponse({ error: "missing_idempotency_key" }, 400);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const parsed = parseAiRequestBody(body);
  if (!parsed.ok) {
    return jsonResponse({ error: parsed.code, details: parsed }, 400);
  }

  if (parsed.request.idempotencyKey !== idempotencyKey) {
    return jsonResponse({ error: "idempotency_key_mismatch" }, 400);
  }

  // Pipeline steps 1–11 (ADR-0002): JWT entitlement, budget reservation, safety,
  // retrieval, generation, schema validation, hydration — not wired in Phase 1.
  void PLUS_MODEL_ID;

  const stub = failClosedToFreeSearch(
    parsed.request.operation,
    "provider_failure",
    "ai.errors.gateway_stub",
  );

  return jsonResponse(stub, 503);
});
