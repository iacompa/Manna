import { z } from "zod";

export const corpusVersionSchema = z.string().min(1).max(64);

export const canonicalRefSchema = z.object({
  translationId: z.string().min(1),
  bookId: z.string().min(1),
  chapter: z.number().int().positive(),
  verseStart: z.number().int().positive(),
  verseEnd: z.number().int().positive(),
});

export const aiOperationSchema = z.enum([
  "daily_reflection",
  "explain_passage",
  "search_scripture",
  "draft_prayer",
]);

export const aiRequestPayloadSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("daily_reflection"),
    themes: z.array(z.string().min(1).max(64)).max(12),
  }),
  z.object({
    kind: z.literal("explain_passage"),
    refs: z.array(canonicalRefSchema).min(1).max(8),
    question: z.string().max(500).optional(),
  }),
  z.object({
    kind: z.literal("search_scripture"),
    query: z.string().min(1).max(300),
    language: z.enum(["en", "es"]),
  }),
  z.object({
    kind: z.literal("draft_prayer"),
    intent: z.string().min(1).max(500),
    language: z.enum(["en", "es"]),
  }),
]);

export const aiRequestSchema = z
  .object({
    operation: aiOperationSchema,
    consentReceiptId: z.string().min(1).max(128),
    corpusVersion: corpusVersionSchema,
    idempotencyKey: z.string().uuid(),
    payload: aiRequestPayloadSchema,
  })
  .strict();

export const safetyDispositionSchema = z.enum([
  "allow",
  "refuse_with_message",
  "crisis_intervention",
  "budget_exhausted",
  "corpus_mismatch",
  "provider_failure",
]);

export const aiCitationSchema = z.object({
  ref: canonicalRefSchema,
  text: z.string().min(1),
});

export const aiSectionSchema = z.object({
  titleKey: z.string().optional(),
  body: z.string().min(1),
  kind: z.enum(["ai_commentary", "safety_message", "editorial_note"]),
});

export const aiResultSuccessSchema = z.object({
  ok: z.literal(true),
  operation: aiOperationSchema,
  corpusVersion: corpusVersionSchema,
  safety: z.literal("allow"),
  sections: z.array(aiSectionSchema).min(1),
  citations: z.array(aiCitationSchema),
  releaseId: z.string().min(1),
});

export const aiResultFailureSchema = z.object({
  ok: z.literal(false),
  operation: aiOperationSchema,
  safety: z.enum([
  "refuse_with_message",
  "crisis_intervention",
  "budget_exhausted",
  "corpus_mismatch",
  "provider_failure",
]),
  fallback: z.enum(["free_search", "free_context", "update_required", "retry_later"]),
  messageKey: z.string().min(1),
});

export const aiResultSchema = z.discriminatedUnion("ok", [
  aiResultSuccessSchema,
  aiResultFailureSchema,
]);

export const entitlementSnapshotSchema = z.object({
  entitlement: z.enum(["free", "manna_plus"]),
  source: z.enum(["server_mirror", "reconciled"]),
  refreshedAt: z.string().datetime(),
});

export const consentReceiptSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  acceptedAt: z.string().datetime(),
});
