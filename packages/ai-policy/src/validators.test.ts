import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAiRequestBody } from "./validators";

test("parseAiRequestBody enforces operation/payload kind alignment", () => {
  const result = parseAiRequestBody({
    operation: "daily_reflection",
    consentReceiptId: "c1",
    corpusVersion: "v1",
    idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
    payload: { kind: "draft_prayer", intent: "peace", language: "en" },
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, "invalid_body");
  }
});
