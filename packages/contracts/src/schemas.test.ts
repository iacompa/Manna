import assert from "node:assert/strict";
import { test } from "node:test";
import { aiRequestSchema, aiResultSchema } from "./schemas";

test("aiRequestSchema rejects forbidden client fields", () => {
  const parsed = aiRequestSchema.safeParse({
    operation: "draft_prayer",
    consentReceiptId: "consent-1",
    corpusVersion: "corpus-v1",
    idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
    payload: { kind: "draft_prayer", intent: "gratitude", language: "en" },
    model: "evil",
  });
  assert.equal(parsed.success, false);
});

test("aiResultSchema accepts typed failure", () => {
  const parsed = aiResultSchema.safeParse({
    ok: false,
    operation: "explain_passage",
    safety: "provider_failure",
    fallback: "retry_later",
    messageKey: "ai.errors.provider_unavailable",
  });
  assert.equal(parsed.success, true);
});
