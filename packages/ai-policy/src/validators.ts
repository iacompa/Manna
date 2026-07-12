import {
  aiRequestSchema,
  aiResultSchema,
  type AiRequest,
  type AiResult,
} from "@manna/contracts";

import {
  assertNoForbiddenClientFields,
  containsProhibitedAuthorityLanguage,
  failClosedToFreeSearch,
  FORBIDDEN_CLIENT_AI_FIELDS,
  FAIR_USE_DAILY_CEILINGS,
  MAX_TOKENS_BY_OPERATION,
  PLUS_MODEL_ID,
  hydrateCitations,
  type CanonicalRef,
  type SafetyDisposition,
  type AiOperation,
  type AiCitation,
} from "./policy-core";

export type ParseAiRequestResult =
  | { ok: true; request: AiRequest }
  | { ok: false; code: "forbidden_field"; field: string }
  | { ok: false; code: "invalid_body"; issues: string[] };

export function parseAiRequestBody(body: unknown): ParseAiRequestResult {
  if (body == null || typeof body !== "object") {
    return { ok: false, code: "invalid_body", issues: ["expected_object"] };
  }

  const record = body as Record<string, unknown>;
  const forbidden = assertNoForbiddenClientFields(record);
  if (!forbidden.ok) {
    return { ok: false, code: "forbidden_field", field: forbidden.field };
  }

  const parsed = aiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid_body",
      issues: parsed.error.issues.map((i) => i.path.join(".") || i.message),
    };
  }

  if (parsed.data.operation !== parsed.data.payload.kind) {
    return {
      ok: false,
      code: "invalid_body",
      issues: ["operation_payload_kind_mismatch"],
    };
  }

  return { ok: true, request: parsed.data };
}

export function validateAiResultPayload(value: unknown): value is AiResult {
  return aiResultSchema.safeParse(value).success;
}

export function validateGeneratedSections(sections: { body: string }[]): boolean {
  return sections.every((s) => !containsProhibitedAuthorityLanguage(s.body));
}

export {
  assertNoForbiddenClientFields,
  containsProhibitedAuthorityLanguage,
  failClosedToFreeSearch,
  FORBIDDEN_CLIENT_AI_FIELDS,
  FAIR_USE_DAILY_CEILINGS,
  MAX_TOKENS_BY_OPERATION,
  PLUS_MODEL_ID,
  hydrateCitations,
};

export type { CanonicalRef, SafetyDisposition, AiOperation, AiCitation };
