# ADR-0001 — In-store OpenRouter BYOK with kill switch

- **Status:** Proposed (Phase 0)
- **Date:** 2026-07-12
- **Deciders:** Product owner + engineering
- **Related:** Orchestration plan override (supersedes PLAN.md §2 “BYOK is post-GA Android only” and §6 post-GA-only BYOK product until PLAN.md is patched); PLAN.md §5 validators / fail-closed behavior; ADR-0002 (Plus gateway)

## Context

PLAN.md originally deferred BYOK to a **separate post-GA direct Android app**. The locked product override for this repo is:

> **Same free store app** may include optional Bring-Your-Own-Key (BYOK) via OpenRouter: user pastes a key, picks **any model** (blank default, no presets). Manna Plus remains server-managed Flash-Lite at $4.99/mo.

Store policy risk is material (Apple/Google may reject in-app API-key entry or “arbitrary model” UX). Removability must be a **compile-time / package-boundary** property, not a scatter of `if (byok)` across screens.

## Decision

### Product behavior (when enabled)

| Item | Lock |
|---|---|
| Surface | Settings → AI provider (store app) |
| Provider | OpenRouter |
| Key storage | **SecureStore only**; never Manna servers, logs, analytics, Sentry, exports, or backups we control |
| Model field | Free-text / any OpenRouter model id; **blank default**; **no curated presets** in v1 |
| Network path | Device → OpenRouter directly |
| Scripture | Hydrate citations from **local** corpus (same rule as Plus) |
| Validators | **Same** schema, quotation, citation, theological, and safety validators as Plus via `@manna/ai-policy` |
| Failure | Fail **closed** to free local search / free reading-prayer path |
| Monetization | No CTA to buy provider credits; user pays OpenRouter themselves |
| Plus relationship | Independent of `manna_plus` entitlement; BYOK does not replace Plus gateway |

### Package and flag boundary

```text
apps/mobile-store/
  app/(settings)/ai-provider.tsx   # imports @manna/ai-byok only when flag on
packages/ai-byok/                  # OpenRouter client, SecureStore key I/O, model field UI
packages/ai-policy/                # shared validators — Plus server AND BYOK client
```

- Feature flag: **`EXPO_PUBLIC_ENABLE_BYOK`**
- Package: **`@manna/ai-byok`**
- **Forbidden:** importing OpenRouter URLs, key helpers, or BYOK screens from outside `@manna/ai-byok` (except the single settings entry gated by the flag)
- Flag **off** → settings row hidden; Metro/conditional exports **exclude** `@manna/ai-byok` from the store graph

### Kill switch / store rejection remediation

If App Review or Play policy forbids in-app keys:

1. Set `EXPO_PUBLIC_ENABLE_BYOK=false`
2. Drop `@manna/ai-byok` from the store app dependency graph
3. Rebuild and resubmit **without** rewriting `@manna/ai-policy` or Plus gateway code

Deferred fallback (unchanged from PLAN intent): extract the same package into a separately signed post-GA Android direct app if stores permanently forbid BYOK.

### CI artifact scan (flag off)

When `EXPO_PUBLIC_ENABLE_BYOK` is false for a StoreKit / Play production profile, CI **must fail** if the production artifact contains:

- OpenRouter base URLs or host allowlist strings used only by BYOK
- SecureStore keys / keychain service names reserved for BYOK
- Copy unique to BYOK settings (“paste API key”, “OpenRouter”, etc.) unless also required by privacy disclosures that remain when flag off (prefer zero BYOK copy)
- JS/Hermes string literals or package name `@manna/ai-byok`
- Remote remote-config path that could re-enable BYOK without a binary rebuild

Scan design (Phase 0):

1. Build `production-ios` / `production-android` with flag false  
2. Unpack IPA/APK/AAB  
3. `rg` / strings scan against a checked-in deny-list (`tooling/byok-artifact-denylist.txt` — to be added by bootstrap)  
4. Persist scan log as CI artifact  
5. Gate merge/release on exit code 0  

No remote kill-switch that **enables** BYOK in a binary built with the flag off. Disable-only server switches may exist for Plus; BYOK enablement is **build-time**.

### Shared policy with Plus

`@manna/ai-policy` owns:

- Request/response Zod (or equivalent) schemas aligned with `AiRequest` / `AiResult` contracts
- Citation resolution + corpus hydration helpers (client uses local DB; server uses server corpus)
- Prohibited-authority language checks
- Crisis triage disposition enums
- Fail-closed mapping to free search

Plus path (ADR-0002) runs validators on the server after Flash-Lite generation. BYOK runs the **same** validators on-device after OpenRouter returns. Neither path displays model-emitted Scripture strings without hydration.

### Privacy and threat notes

- BYOK key disclosure (malware, screenshots, clipboard) is accepted residual risk; mitigate with SecureStore, no clipboard persistence in our code, and clear user copy.
- Key must never appear in crash breadcrumbs or network logs we emit.
- Privacy policy / Data Safety must describe optional user-provided key processing by OpenRouter when the flag is on.

## Consequences

### Positive

- Free tier can try AI without Manna COGS
- Store rejection → flip flag, drop package, rebuild
- One policy package prevents Plus/BYOK safety drift

### Negative / risks

- App Store / Play policy still may reject; kill switch is mitigation, not clearance
- “Any model” increases eval surface; BYOK models are **user-chosen** and **not** covered by Plus eval gates — UI must disclose quality/safety are not Manna-certified
- Blank model default can confuse users; keep errors actionable, still fail closed
- PLAN.md still says post-GA-only BYOK in places — **bootstrap must patch PLAN** to match this ADR

### Out of scope

- Implementing `@manna/ai-byok` UI or CI denylist files in this packet (docs only if packages not yet scaffolded)
- Purchasing OpenRouter credits in-app
- Syncing keys across devices

## Compliance checklist

- [ ] `EXPO_PUBLIC_ENABLE_BYOK` documented in `AGENTS.md`
- [ ] Import boundary lint or CODEOWNERS + CI grep for illegal imports
- [ ] Artifact denylist scan green on flag-off production builds
- [ ] PLAN.md portfolio section patched to in-store BYOK + kill switch
- [ ] Privacy disclosures updated when flag-on builds ship
