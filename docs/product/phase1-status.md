# Phase 1 vertical slice — gap check

**Checked at:** `9bed793` on `main`  
**Scope:** Phase 1 vertical slice only (stubs/spikes acceptable; not GA readiness).

## Item status

| # | Item | Status | Brief quality notes |
|---|------|--------|---------------------|
| 1 | Expo Router tabs Today / Read / Pray / Library + `_layout` | **DONE** | `(tabs)/_layout.tsx` wires four tabs with i18n titles, semantic colors, settings header link; screen files present (`today`, `read`, `pray`, `library`). Today loads fixture verse by language; other tabs are stub shells. |
| 2 | Onboarding stub | **DONE** | Stack flow: `language` → `goals` → `reading-setup` → `first-passage`; language step persists locale and uses shared UI primitives. |
| 3 | `packages/ui` tokens | **DONE** | `tokens.ts` + `theme.ts`: light/dark semantic colors, spacing, radius, typography; consumed by tabs/settings/onboarding. |
| 4 | i18n EN / ES | **DONE** | `react-i18next` init with `en.json` / `es.json` (parity line count); tabs, onboarding, settings keyed. |
| 5 | SQLite / fixture load | **PARTIAL** | `corpus-sqlite.ts` creates DB, seeds John 3:16 EN+ES inline; Today reads it. No shipped corpus manifest / `@manna/scripture` bundle path yet. |
| 6 | `supabase/functions/ai-run` | **PARTIAL** | Edge handler validates auth, idempotency, `parseAiRequestBody`; returns fail-closed `503` stub. No entitlement, budget, retrieval, or model call (documented). |
| 7 | `packages/contracts` AiRequest / AiResult | **DONE** | Zod schemas + exported types; discriminated payload/result unions; unit tests in `schemas.test.ts`. |
| 8 | `packages/ai-policy` validators | **DONE** | `parseAiRequestBody`, forbidden-field guard, policy-core (model ID, fail-closed helpers); tests present. |
| 9 | `packages/recommendation` daily pick | **PARTIAL** | `pickDailyPassage` + deterministic tests; **not wired** into mobile Today (still hard-coded sample verse). |
| 10 | `docs/product/phase1-billing-notes.md` | **DONE** | SKU IDs, entitlement `manna_plus`, server-mirror notes, env placeholders; clearly marks paywall/webhooks out of scope. |
| 11 | Paywall / settings Plus stubs | **PARTIAL** | Settings `plus` + `restore` stub screens and nav links exist; **no paywall route/component** or RevenueCat SDK integration in app. |
| 12 | BYOK flag-off inert | **DONE** | `EXPO_PUBLIC_ENABLE_BYOK=false` in `eas.json` / `.env.example`; `ai-provider.tsx` re-exports default; settings hides BYOK row; CI leak scan passes. |

## Summary

| Metric | Value |
|--------|-------|
| **Phase 1 slice readiness** | **7 / 10** |
| DONE | 7 |
| PARTIAL | 4 |
| MISSING | 0 |

Readiness reflects a credible **navigation + policy + contracts spine** with intentional stubs. Not yet an end-to-end slice for daily passage selection, Plus purchase, or live AI.

## Top gaps (fix order)

1. **Paywall + RevenueCat** — billing notes exist but no paywall UI or purchase/restore implementation beyond placeholder settings copy.
2. **AI gateway completion** — `ai-run` stops at validation/fail-closed; needs entitlement check, budget, safety pipeline, and model invocation per ADR-0002.
3. **Corpus + daily pick integration** — fixture SQLite is a spike; wire `@manna/recommendation` into Today and replace inline verses with reviewed candidates / corpus versioning.

## Non-blocking follow-ups

- Expand Read / Pray / Library beyond stub text.
- Grow i18n catalogs as screens gain real copy.
- BYOK remains correctly inert until policy flips compile-time flag.
