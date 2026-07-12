/**
 * Shared AI policy sketches — used by Plus server and BYOK client.
 * Phase 0: types + pure helpers only. No provider SDKs.
 * Canonical request/result shapes also sketched in `@manna/contracts`; keep in sync until packages wire workspace deps.
 */

export type AiOperation =
  | "daily_reflection"
  | "explain_passage"
  | "search_scripture"
  | "draft_prayer";

export type CanonicalRef = {
  translationId: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
};

export type AiCitation = {
  ref: CanonicalRef;
  /** Always corpus-hydrated; never raw model quote text */
  text: string;
};

export type SafetyDisposition =
  | "allow"
  | "refuse_with_message"
  | "crisis_intervention"
  | "budget_exhausted"
  | "corpus_mismatch"
  | "provider_failure";

export type AiRequest = {
  operation: AiOperation;
  consentReceiptId: string;
  corpusVersion: string;
  idempotencyKey: string;
  payload: Record<string, unknown>;
};

export type AiResult =
  | {
      ok: true;
      operation: AiOperation;
      corpusVersion: string;
      safety: "allow";
      sections: Array<{
        titleKey?: string;
        body: string;
        kind: "ai_commentary" | "safety_message" | "editorial_note";
      }>;
      citations: AiCitation[];
      releaseId: string;
    }
  | {
      ok: false;
      operation: AiOperation;
      safety: Exclude<SafetyDisposition, "allow">;
      fallback: "free_search" | "free_context" | "update_required" | "retry_later";
      messageKey: string;
    };

/** Fields the Plus client must never send (ADR-0002). */
export const FORBIDDEN_CLIENT_AI_FIELDS = [
  "user_id",
  "model",
  "modelId",
  "entitlement",
  "entitlementTier",
  "cost",
  "scriptureText",
  "apiKey",
  "providerCredentials",
] as const;

export type ForbiddenClientAiField = (typeof FORBIDDEN_CLIENT_AI_FIELDS)[number];

/** Fair-use ceilings from PLAN.md §2. */
export const FAIR_USE_DAILY_CEILINGS: Record<AiOperation, number> = {
  daily_reflection: 1,
  explain_passage: 30,
  search_scripture: 30,
  draft_prayer: 10,
};

/** Budgeted max tokens (docs/product/ai-unit-economics.md). */
export const MAX_TOKENS_BY_OPERATION: Record<
  AiOperation,
  { maxInput: number; maxOutput: number }
> = {
  daily_reflection: { maxInput: 2500, maxOutput: 500 },
  explain_passage: { maxInput: 1800, maxOutput: 350 },
  search_scripture: { maxInput: 1200, maxOutput: 200 },
  draft_prayer: { maxInput: 1500, maxOutput: 300 },
};

/** Plus model lock until eval gate (ADR-0002). BYOK ignores this. */
export const PLUS_MODEL_ID = "gemini-2.5-flash-lite" as const;

const AUTHORITY_PATTERNS: RegExp[] = [
  /\bi\s+am\s+(god|jesus|the\s+holy\s+spirit)\b/i,
  /\bgod\s+(chose|selected|told\s+me\s+to\s+give)\s+(this|you)\b/i,
  /\bas\s+your\s+(pastor|priest|therapist|prophet)\b/i,
];

export function containsProhibitedAuthorityLanguage(text: string): boolean {
  return AUTHORITY_PATTERNS.some((re) => re.test(text));
}

export function assertNoForbiddenClientFields(
  body: Record<string, unknown>,
): { ok: true } | { ok: false; field: ForbiddenClientAiField } {
  for (const field of FORBIDDEN_CLIENT_AI_FIELDS) {
    if (field in body) {
      return { ok: false, field };
    }
  }
  return { ok: true };
}

/**
 * Replace model-emitted quote strings with corpus text.
 * `lookup` is injected (SQLite on device, server corpus in Edge).
 */
export function hydrateCitations(
  refs: CanonicalRef[],
  lookup: (ref: CanonicalRef) => string | null,
): { ok: true; citations: AiCitation[] } | { ok: false; unresolved: CanonicalRef } {
  const citations: AiCitation[] = [];
  for (const ref of refs) {
    const text = lookup(ref);
    if (text == null || text.length === 0) {
      return { ok: false, unresolved: ref };
    }
    citations.push({ ref, text });
  }
  return { ok: true, citations };
}

export function failClosedToFreeSearch(
  operation: AiOperation,
  safety: Exclude<SafetyDisposition, "allow">,
  messageKey: string,
): AiResult {
  return {
    ok: false,
    operation,
    safety,
    fallback: safety === "corpus_mismatch" ? "update_required" : "free_search",
    messageKey,
  };
}

export function isAiRequestShape(value: unknown): value is AiRequest {
  if (value == null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.operation === "string" &&
    typeof v.consentReceiptId === "string" &&
    typeof v.corpusVersion === "string" &&
    typeof v.idempotencyKey === "string" &&
    v.payload != null &&
    typeof v.payload === "object"
  );
}
