# ADR-0002 — Manna Plus AI gateway (Gemini 2.5 Flash-Lite)

- **Status:** Proposed (Phase 0)
- **Date:** 2026-07-12
- **Deciders:** Product owner + AI architecture lane
- **Related:** PLAN.md §2 (fair-use / unit economics), §5 (Plus AI), §6 (contracts / failure), §7 (privacy / kill switches); orchestration override (Flash-Lite priced model); ADR-0001 (BYOK kill switch); `docs/product/ai-unit-economics.md`

## Context

Manna Plus ($4.99/mo, $29.99/yr) must offer carefully grounded AI assistance without:

- Shipping provider keys or model IDs to the client
- Treating AI as Scripture, clergy, or prophetic authority
- Storing spiritual content in the cloud
- Breaking free offline reading/prayer when AI fails
- Blowing unit economics (p95 AI COGS ≤ $0.30 / paid MAU; ≥50% contribution margin after ~30% store fee)

PLAN.md requires a single authenticated operation surface, schema-constrained generation, citation hydration from the canonical corpus, and ephemeral request handling.

## Decision

### Endpoint

One Plus AI entrypoint:

```http
POST /v1/ai/run
Authorization: Bearer <pseudonymous Supabase JWT>
Idempotency-Key: <client uuid>
Content-Type: application/json
```

**Operations** (discriminated `operation` field):

| `operation` | Fair-use ceiling (PLAN) |
|---|---|
| `daily_reflection` | 1 / day |
| `explain_passage` | 30 / day |
| `search_scripture` | 30 / day |
| `draft_prayer` | 10 / day |

### Server-held credentials and fixed model

- Provider keys live only in server secrets (Supabase Edge / secret store). Never in the mobile binary, EAS public env, logs, or client requests.
- **Generation model (v1 lock until eval gate):** `gemini-2.5-flash-lite`
- Pricing assumption for economics (Google list): **$0.10 / M input tokens**, **$0.40 / M output tokens**
- Client **must not** send: `user_id`, model ID, entitlement tier, cost, canonical Scripture text, or provider credentials
- Server derives identity from JWT; entitlement from server mirror / fresh RevenueCat reconciliation; model from signed release record

Routing may use Google AI directly or an approved gateway (e.g. OpenRouter) **only if** the same model ID is frozen, privacy/retention contracts pass, and the eval suite is re-run. The mobile client never chooses the Plus model.

### Pipeline (order is load-bearing)

1. Verify JWT, consent version, `manna_plus` entitlement, per-operation kill switch, corpus/release version, and idempotency key.
2. Reserve maximum expected cost transactionally against the user budget and global spend breaker.
3. Run bilingual safety triage on submitted text.
4. Retrieve complete passages/pericopes (hybrid FTS + pgvector) using the **server** corpus copy matching the client’s declared corpus version.
5. For `daily_reflection`, rerank **reviewed editorial candidates only**.
6. Accept only explicitly submitted local themes or bounded user text (user-approved payload).
7. Generate a **schema-constrained** response (no raw token streaming in v1).
8. Validate schema, sections, citations, corpus version, safety, and prohibited-authority language.
9. **Hydrate every Scripture quotation from the local/server canonical corpus** — model-emitted quote text is discarded; citations resolve to corpus bytes.
10. Settle actual token/cost usage; release unused reservation.
11. Return validated `AiResult` or a typed non-AI fallback (never partial AI).

### Schema validation and hydration

- Response schemas live in shared policy (`@manna/ai-policy` when packaged; mirrored on server).
- Invalid schema, unresolved citation, corpus mismatch, or safety fail → **discard entire response**; one bounded retry with an eval-approved fallback prompt/model only if that fallback passed the same suite; then free-path fallback.
- Hydration rules:
  - Every citation must resolve to `CanonicalRef` + corpus version.
  - Displayed Scripture strings come only from corpus hydration.
  - Fabricated or drifted quotations never reach the UI.

### Ephemeral requests and privacy

Aligned with PLAN §5 / §7:

- Themes, searches, reading history, and prayer text remain on-device until the user explicitly submits a bounded payload for a single request.
- Cloud AI content exists only in request memory; Manna does **not** store prompts, responses, queries, themes, prayer text, or user-linked passage IDs.
- AI usage metadata only: operation, status, latency, token/cost totals, release versions — **≤ 30 days**.
- Generic non-personalized passage explanations may be cached **without** user linkage.
- Production providers must support no-training / minimum–zero retention contractual posture before go-live.

### Kill switches and budgets

| Control | Behavior |
|---|---|
| Per-operation kill switch | Disables that `operation` globally; free product unaffected |
| Global AI spend breaker | Rejects new reservations when org daily/monthly AI spend exceeds threshold |
| Per-user fair-use counters | Server-side daily ceilings; configurable downward only after disclosure |
| Per-user cost budget | Max expected cost reserved up front; exhaustion shows reset time + free context |
| Model/prompt rollback | Signed release pin; rollback to last green eval record |
| Corpus mismatch | Disable AI with update-required; local reading remains |

SEV-0 (dangerous AI guidance, cross-user privacy leak, etc.) immediately disables affected operations.

### Client contract (Plus)

- Mobile sends `AiRequest`: operation, consent receipt id, corpus version, idempotency key, and user-approved bounded fields (e.g. passage refs, theme enums, optional short prayer intent).
- Mobile never embeds Plus provider SDKs for generation.
- Failure modes follow PLAN failure table: timeout/429 → one bounded retry → free path; offline → free product.

## Consequences

### Positive

- Single choke point for entitlement, budget, safety, and citation integrity
- Unit-economics levers (token caps, ceilings, kill switches) are enforceable server-side
- Scripture remains canonical; AI is clearly `AI-assisted commentary`

### Negative / risks

- Flash-Lite lock is provisional until the 600-case bilingual eval suite passes release gates
- Embedding model/version for `search_scripture` is **not** frozen in this ADR; must be pinned in a follow-on release record with its own cost line
- Gateway vs direct Google is an ops choice; misconfiguration could leak keys or wrong model — CI and release signing must pin `gemini-2.5-flash-lite`
- Idempotency + budget reservation races need careful transactional design (Phase 1 spike)

### Out of scope

- Full Edge Function implementation (Phase 1+)
- BYOK client path (ADR-0001)
- Streaming UX

## Compliance checklist (Phase 0 → 1)

- [ ] Signed release record includes provider, `gemini-2.5-flash-lite`, prompt hashes, schema version, embedding version, safety version
- [ ] Eval suite green on frozen combo (see `docs/product/ai-eval-suite-skeleton.md`)
- [ ] Unit economics sheet still holds at chosen max-token budgets (`docs/product/ai-unit-economics.md`)
- [ ] Privacy policy / Data Safety / subprocessors list name the AI processor
- [ ] Kill switches operable from ops runbook without app release
