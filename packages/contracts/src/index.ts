/**
 * Versioned Plus AI + shared domain contracts (Zod + inferred types).
 */

export {
  aiCitationSchema,
  aiOperationSchema,
  aiRequestPayloadSchema,
  aiRequestSchema,
  aiResultFailureSchema,
  aiResultSchema,
  aiResultSuccessSchema,
  aiSectionSchema,
  canonicalRefSchema,
  consentReceiptSchema,
  corpusVersionSchema,
  entitlementSnapshotSchema,
  safetyDispositionSchema,
} from "./schemas";

import type { z } from "zod";
import type {
  aiCitationSchema,
  aiOperationSchema,
  aiRequestPayloadSchema,
  aiRequestSchema,
  aiResultSchema,
  aiSectionSchema,
  canonicalRefSchema,
  consentReceiptSchema,
  corpusVersionSchema,
  entitlementSnapshotSchema,
  safetyDispositionSchema,
} from "./schemas";

export type CorpusVersion = z.infer<typeof corpusVersionSchema>;
export type CanonicalRef = z.infer<typeof canonicalRefSchema>;
export type PassageId = string;
export type AiOperation = z.infer<typeof aiOperationSchema>;
export type AiRequest = z.infer<typeof aiRequestSchema>;
export type AiRequestPayload = z.infer<typeof aiRequestPayloadSchema>;
export type SafetyDisposition = z.infer<typeof safetyDispositionSchema>;
export type AiCitation = z.infer<typeof aiCitationSchema>;
export type AiResult = z.infer<typeof aiResultSchema>;
export type AiSection = z.infer<typeof aiSectionSchema>;
export type EntitlementSnapshot = z.infer<typeof entitlementSnapshotSchema>;
export type ConsentReceipt = z.infer<typeof consentReceiptSchema>;
