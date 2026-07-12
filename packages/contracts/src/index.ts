/**
 * Phase 0 contract sketches for Plus AI + shared domain types.
 * Not a frozen API — refine behind versioned schemas before mobile consumers ship.
 */

export type CorpusVersion = string;

export type CanonicalRef = {
  translationId: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
};

export type PassageId = string;

export type AiOperation =
  | "daily_reflection"
  | "explain_passage"
  | "search_scripture"
  | "draft_prayer";

/** Client → POST /v1/ai/run. Must not include model, keys, user_id, entitlement, or Scripture text. */
export type AiRequest = {
  operation: AiOperation;
  consentReceiptId: string;
  corpusVersion: CorpusVersion;
  idempotencyKey: string;
  /** Explicitly user-approved bounded payload */
  payload: AiRequestPayload;
};

export type AiRequestPayload =
  | { kind: "daily_reflection"; themes: string[] }
  | { kind: "explain_passage"; refs: CanonicalRef[]; question?: string }
  | { kind: "search_scripture"; query: string; language: "en" | "es" }
  | { kind: "draft_prayer"; intent: string; language: "en" | "es" };

export type SafetyDisposition =
  | "allow"
  | "refuse_with_message"
  | "crisis_intervention"
  | "budget_exhausted"
  | "corpus_mismatch"
  | "provider_failure";

export type AiCitation = {
  ref: CanonicalRef;
  /** Always corpus-hydrated; never raw model quote text */
  text: string;
};

export type AiResult =
  | {
      ok: true;
      operation: AiOperation;
      corpusVersion: CorpusVersion;
      safety: "allow";
      sections: AiSection[];
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

export type AiSection = {
  titleKey?: string;
  body: string;
  /** Label requirement: AI-assisted commentary, never Scripture */
  kind: "ai_commentary" | "safety_message" | "editorial_note";
};

export type EntitlementSnapshot = {
  entitlement: "free" | "manna_plus";
  source: "server_mirror" | "reconciled";
  refreshedAt: string;
};

export type ConsentReceipt = {
  id: string;
  version: string;
  acceptedAt: string;
};
