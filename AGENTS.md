# Manna — Agent Operating Constitution

This file governs human and automated agents working in this repository. When instructions conflict, authority is: **patched `PLAN.md` → ADRs → Figma → agent packets → research briefs (historical only)**.

## Product constitution (non-negotiable)

1. **Scripture is primary** — canonical text is distinct from AI, notes, and personalization.
2. **Free app is complete** — offline Bible, bilingual reading, search, prayer, daily passage, reminders, widget.
3. **AI is optional and humble** — never impersonates God, clergy, prophet, therapist, or doctrinal authority.
4. **English and Spanish are equal** — designed and tested independently.
5. **Privacy outranks engagement** — spiritual data stays on-device in v1.
6. **Calmness outranks retention tricks** — no streaks, guilt copy, or manipulative notifications.
7. **Fail safely** — Scripture and prayer work when AI, billing, or network fail.
8. **Do not silently reinterpret research briefs** — `reasearch 1/` is input history only; `PLAN.md` wins.

## Monetization locks

| Item | Value |
|---|---|
| Plus monthly | `$4.99` — product `manna_plus_monthly` |
| Plus annual | `$29.99` — product `manna_plus_annual`, 7-day trial |
| Plus AI model | `gemini-2.5-flash-lite` only until eval + ADR approve change |
| Free tier | No Manna-managed AI |

## BYOK module contract (`@manna/ai-byok`)

Bring Your Own Key ships **inside the free store app** when enabled. It is not a separate store listing in v1.

### Feature flag

- `EXPO_PUBLIC_ENABLE_BYOK` — must be `true` at build time to compile BYOK into the store artifact.
- Default for production store builds: **`false`** until policy clearance explicitly flips it.
- No runtime remote flag to enable BYOK in store builds (prevents accidental store-policy violations).

### Package boundary

- All OpenRouter client code, SecureStore key handling, model picker UI, and BYOK-specific copy live in **`packages/ai-byok`** (`@manna/ai-byok`).
- Shared validators and schemas live in **`packages/ai-policy`** — used by Plus server **and** BYOK client.
- The store app may reference BYOK only through:
  - Conditional settings route: `apps/mobile-store/app/(settings)/ai-provider.tsx`
  - A single re-export barrel guarded by the flag (no deep imports elsewhere).

### Forbidden patterns

- No `openrouter.ai` URLs, API key strings, or BYOK UI copy outside `@manna/ai-byok` and flagged app entrypoints.
- No scattered `if (byok)` across screens — use package exclusion + flag.
- No sending user OpenRouter keys to Manna backends, logs, Sentry, or analytics.

### BYOK behavior

- User pastes OpenRouter API key → stored in **Expo SecureStore** only.
- Model field: **blank default**, user may enter **any** model ID (no preset list in v1).
- On failure: fail closed to free local Scripture search; never partial AI output.

### Kill switch (store rejection remediation)

1. Set `EXPO_PUBLIC_ENABLE_BYOK=false`.
2. Remove `@manna/ai-byok` from Metro/store dependency graph (conditional exports / build profile).
3. Rebuild and resubmit — no rewrite of `@manna/ai-policy` or Plus server path.

See [docs/decisions/ADR-0001-byok-in-store-kill-switch.md](./docs/decisions/ADR-0001-byok-in-store-kill-switch.md).

### CI scan (flag off)

When `EXPO_PUBLIC_ENABLE_BYOK=false`, CI **must fail** if any of the following appear in artifacts scanned for the store build graph:

- Package import of `@manna/ai-byok` from app code outside the allowed guarded entry
- Strings: `openrouter`, `OPENROUTER`, `api_key` in BYOK context, BYOK settings route paths
- Dependencies linking `@manna/ai-byok` in production store lockfile slice

Implement scan in `.github/workflows/` (Phase 0 stub documents intent; full gate lands with mobile CI).

## Plus AI routing

- Server path: `POST /v1/ai/run` with Manna-held keys, model **`gemini-2.5-flash-lite`**.
- Client must not send model ID, entitlement tier, or canonical Scripture text for Plus.
- Unit economics gate: p95 COGS ≤ `$0.30`/paid user/month, ≥50% contribution margin at `$4.99` after 30% store fee.

## File ownership map (agent lanes)

| Lane | Owns | Must not touch without orchestrator |
|---|---|---|
| Mobile shell | `apps/mobile-store/app/**`, navigation, widgets (later) | `packages/contracts`, Supabase migrations |
| Design | Figma + `docs/product/figma.md` | Implementation tokens without handoff |
| AI / backend | `supabase/functions/**`, Plus gateway, `packages/ai-policy` | RevenueCat entitlements without billing lane |
| BYOK | `packages/ai-byok/**`, flagged settings route only | Plus server keys, paywall copy |
| Corpus | `tooling/corpus/**`, `content/manifests/**`, `packages/scripture` | Shipping unlicensed content |
| Billing | RevenueCat integration, paywall, entitlements | AI prompt content |
| Contracts | `packages/contracts/**`, `packages/domain/**` | Parallel edits across lanes |

## Merge gates and review scores

- Max ~3 implementation workers + 1 independent reviewer concurrently.
- Dedicated branch per packet: `codex/<packet-id>`.
- **< 8/10** — cannot merge.
- **≥ 9/10** — required for RC / P0-adjacent packets.
- P0/P1 findings always block merge regardless of score.
- Workers return: implementation, tests, evidence, risks, self-rating.
- Orchestrator does not claim 10/10 without reviewer evidence.

## Model assignment (orchestrator reference)

| Role | Suggested model tier |
|---|---|
| AI gateway, safety, unit economics | Highest reasoning (architecture) |
| Billing / entitlements | Highest reasoning |
| Figma / design system | Strong visual judgment + Figma MCP |
| Mobile UI from Figma | Solid RN/Expo execution |
| Corpus ETL | Mechanical correctness |
| Repo bootstrap / CI | Fast scaffolding |
| Independent review | Fresh adversarial pass |

## Deferred BYOK product

If stores forbid in-app API keys post-GA, extract `@manna/ai-byok` into `apps/mobile-byok/` (separate Android package ID). Modular boundary is intentional — see PLAN §6.
