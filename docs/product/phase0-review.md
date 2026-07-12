# Phase 0 independent review

- **Reviewer:** Independent Grok agent (did not implement Phase 0 packets)
- **Date:** 2026-07-12
- **Repo HEAD reviewed:** `310413b` (`main`, synced with `origin/main` at review start)
- **Remote:** https://github.com/iacompa/Manna
- **Plan authority:** patched `PLAN.md` → ADRs → Figma → agent packets → research briefs

## Verdict

**FAIL**

Phase 0 exit requires **≥ 9/10**. This review scores **7.8/10**. Figma is incomplete (correctly documented) and is gated below as a tracked P1 exception, but that exception **does not** lift the overall score to ≥9 because additional P1 gaps remain in CI honesty, PLAN residual contradiction, and the blank mobile/BYOK kill-switch path.

## Overall score

| | |
|---|---|
| **Overall** | **7.8 / 10** |
| Phase 0 exit bar | ≥ 9/10 |
| Result | **Does not pass Phase 0 exit** |

### Per-criterion scores

| # | Criterion | Score | Notes |
|---|---|---:|---|
| 1 | Repo live + `.gitignore` + `AGENTS.md` + monorepo + PLAN locks | 8.5 | Solid bootstrap; residual PLAN contradiction on Play BYOK |
| 2 | ADR-0001 + ADR-0002 + unit economics | 8.5 | Strong architecture docs; ADRs still Proposed; denylist/CI unrealized |
| 3 | Corpus/rights spike + USFM→SQLite | 8.5 | Spike runs; rights ledger honest; not a shipping corpus |
| 4 | Figma foundations | **3.0** | **Incomplete** — tokens only; Starter quota blocker |
| 5 | Blank `mobile-store` Expo path (+ typecheck) | 6.5 | Blank Expo exists; Router claim false; typecheck smoke inconclusive |
| 6 | `AGENTS.md` BYOK module contract quality | 9.0 | Contract is clear and enforceable on paper |

Weighted judgment favors engineering truth over doc polish: architecture and agent rules are ahead of implementable kill-switch / design / CI proof.

---

## Criterion evidence

### 1. Repo hygiene and PLAN locks — mostly met

**Present**

- GitHub `main` live at ~`310413b` with clean working tree at review start
- Root `.gitignore` covers Node/Expo/EAS/env/secrets/local DBs/Turbo/iOS/Android/corpus raw+out
- Monorepo skeleton: `apps/mobile-store`, `packages/*` (8), `supabase/`, `tooling/corpus`, `content/`, `docs/`, pnpm + turbo + Node 24 pin
- `AGENTS.md` present and substantive
- `PLAN.md` locks visible: `$4.99` / `$29.99`, `gemini-2.5-flash-lite`, in-store BYOK + `EXPO_PUBLIC_ENABLE_BYOK` kill switch, decision log D-0001…D-0003

**Gaps**

- `PLAN.md` §9 Google checklist still says **“No BYOK or external-payment path in the Play artifact”** while D-0003 / §2 / §6 say BYOK ships in the same store app. Agents will conflict on Android store posture until this is reconciled.
- README claims “Expo Router store app”; app is classic `App.tsx` without `expo-router` dependency.

### 2. ADRs + unit economics — strong docs, thin enforcement

**Present**

- [ADR-0001](../decisions/ADR-0001-byok-in-store-kill-switch.md): in-store BYOK, SecureStore-only keys, blank any-model field, package boundary, compile-time flag, kill-switch remediation, CI artifact scan design
- [ADR-0002](../decisions/ADR-0002-plus-ai-gateway-flash-lite.md): `POST /v1/ai/run`, server-held keys, Flash-Lite lock, hydration/fail-closed pipeline, budgets/kill switches
- [ai-unit-economics.md](./ai-unit-economics.md): honest Scenario A failure (~$1.64 unbudgeted), Scenario B with **$0.30 spend budget by construction**, CM ≥50% (~81–88% under stated packs). Does not overclaim production metering

**Gaps**

- Both ADRs status **Proposed**, not Accepted
- `tooling/byok-artifact-denylist.txt` referenced in ADR-0001 — **missing**
- CI BYOK scan is an echo stub; `pnpm typecheck || true` means typecheck never fails the workflow
- Eval suite is a markdown skeleton only; no `tooling/ai-eval/` tree on disk
- `@manna/ai-byok` is `export {}`; policy package has types/helpers only (acceptable for Phase 0 docs, insufficient for kill-switch proof)

### 3. Corpus / rights spike — met for Phase 0 scope

**Present**

- Rights ledger stub with BSB / ONBV / RV1909 tracks and shipping gate language
- Fixtures + `import-usfm-spike.mjs` + `spike.sql` + corpus spike docs
- Reviewer re-ran spike: **4 verses**, DB written under `tooling/corpus/out/` (gitignored), integrity hash reproduced

**Gaps**

- Full USFM / FTS / signed shipping manifests correctly out of scope; do not treat spike as Alpha corpus readiness

### 4. Figma — incomplete (do not score as pass)

**Status:** **Incomplete / blocked**

- File: https://www.figma.com/design/2QHxehl21MVYrPeLKtGZuc (`fileKey` `2QHxehl21MVYrPeLKtGZuc`)
- [docs/product/figma.md](./figma.md) correctly states tokens-only work, Starter quota blocker, and “do not treat tokens-only as Figma complete”
- Missing for Phase 0 Packet 0C exit: Product Constitution pages, Components, Journeys (incl. BYOK settings + paywall), Responsive Screens, Prototypes, Content/Safety, Developer Handoff

#### Tracked P1 exception (Figma)

| Field | Value |
|---|---|
| ID | **P1-FIGMA-STARTER-QUOTA** |
| Severity | P1 (blocks Phase 0 design exit and Phase 1 UI-from-Figma) |
| Owner action | Product owner upgrades to Figma Professional (or team seat) and unblocks design agent |
| Acceptance | Packet 0C pages exist; `figma.md` updated with component/journey IDs; independent re-review of design completeness |
| Effect on score | Prevents treating criterion 4 as pass; **alone would not force overall &lt;9 if all else were ≥9**, but other P1s remain |

### 5. Blank mobile-store path — partial

**Present**

- Expo SDK ~57 blank app (`App.tsx`, assets, `eas.json`)
- Production EAS profiles default `EXPO_PUBLIC_ENABLE_BYOK=false`
- Settings path stub: `apps/mobile-store/app/(settings)/ai-provider.tsx` (contract anchor)

**Gaps**

- No `expo-router` installed; `app/` route is unwired relative to `main: index.ts` → `App.tsx`
- `ai-provider.tsx` embeds BYOK copy / `@manna/ai-byok` mention even when flag is false — will fail a real denylist scan if this file ships in production graphs
- No verified `ios/` / `android/` prebuild or EAS build evidence in-repo
- Typecheck: `typecheck` script exists; reviewer attempt hung / environment-blocked — **smoke not verified green**. CI currently cannot fail on typecheck (`|| true`)

### 6. AGENTS.md BYOK contract — high quality

**Strengths**

- Flag semantics (build-time only; default false; no remote enable)
- Package boundary + single settings entrypoint
- Forbidden patterns (no scattered `if (byok)`, no keys to backends/logs)
- Kill-switch steps + CI scan requirements documented
- Ownership map and merge gates clear
- Plus routing + unit-economics gate restated

**Residual**

- Contract documents a Phase 0 CI stub; full gate not implemented — accurate, but means the constitution is ahead of the repo’s ability to enforce it

---

## Findings

### P0 (must fix before any store-bound BYOK or false “Phase 0 complete” claim)

_None that block non-UI architecture work today._ No shipping BYOK binary exists yet; the empty package + flag-off default prevents immediate store-policy exposure.

> Note: Claiming Phase 0 **passed** while Figma + kill-switch enforcement are incomplete would be a process P0. This review refuses that claim.

### P1 (block Phase 0 exit / constrain Phase 1)

1. **P1-FIGMA-STARTER-QUOTA** — Figma journeys/components absent; tokens-only. Owner must upgrade plan and complete Packet 0C. See exception table above.
2. **P1-CI-NOOP** — `.github/workflows/ci-smoke.yml` uses `pnpm typecheck || true` and a BYOK scan that always succeeds. Merge gate is decorative.
3. **P1-PLAN-PLAY-BYOK** — `PLAN.md` §9 still forbids BYOK in the Play artifact while D-0003 enables in-store BYOK. Reconcile (flag-off Play builds vs absolute ban) in PLAN + ADR checklist.
4. **P1-KILL-SWITCH-UNPROVEN** — Missing denylist file, empty `@manna/ai-byok`, no Metro exclusion proof, settings stub can leak BYOK strings when flag off. Kill switch is designed, not demonstrated.
5. **P1-MOBILE-ROUTER-MISMATCH** — README/PLAN imply Expo Router contract path; runtime entry is blank `App.tsx`. Phase 1 mobile must either install Router or stop treating `app/(settings)/ai-provider.tsx` as live.

### P2 (should fix soon; do not pretend done)

1. ADR-0001 / ADR-0002 still **Proposed** — accept or revise after owner read.
2. Eval suite directories not created on disk (doc-only skeleton).
3. `supabase/` is README + empty dirs — fine for Phase 0, but no function stub for `/v1/ai/run`.
4. LICENSE “SPDX TBD”.
5. Phase 7 still titled as primary “Post-GA BYOK” while in-store BYOK is primary — clarify fallback-only language for agents.

---

## What may proceed to Phase 1 vs must wait

### May proceed (non-UI / contract tracks)

- Plus gateway spike against ADR-0002 (`POST /v1/ai/run` skeleton, budgets, schema in `@manna/ai-policy` / contracts)
- RevenueCat / entitlement modeling (no paywall UI from Figma yet — use wire contracts only)
- Corpus ETL expansion beyond spike (still no shipping until rights green)
- Hardening CI: real typecheck gate + BYOK denylist stub that fails closed
- PLAN contradiction fix + ADR acceptance

### Must wait

- **Any UI implementation “from Figma”** — blocked until Packet 0C completes (P1-FIGMA)
- **Declaring Phase 0 exit / RC readiness** — score &lt; 9
- **Flag-on store builds with BYOK** — until kill-switch CI + package exclusion are proven (P1-KILL-SWITCH)
- **Marketing/store copy claiming design-complete or AI-complete** — neither is true

### Conditional Phase 1 start (orchestrator discretion)

Vertical-slice **backend + domain** work can start in parallel with Figma unblock. Mobile shell may scaffold navigation/plumbing **without** inventing visual design from prose (constitution + PLAN). Do **not** parallelize more than ~3 implementers + 1 reviewer.

---

## Honest summary for the orchestrator

Phase 0 delivered a credible **paper architecture** and **repo bootstrap**: locks are in PLAN/AGENTS, ADRs and unit economics are thoughtful, corpus spike works, Figma blocker is documented honestly rather than papered over. What is missing for a ≥9 exit is **proof**: enforceable CI, a real blank build/router path matching the contract, kill-switch artifact scanning, and design foundations beyond tokens. Score **7.8** — **FAIL** the Phase 0 gate; do not rubber-stamp.

---

## Reviewer self-score (rigor)

| | |
|---|---|
| **Self-score** | **8.7 / 10** |
| Method | Read PLAN/AGENTS/ADRs/economics/figma/corpus docs; inspected mobile/EAS/CI/packages; re-ran corpus spike; attempted typecheck (inconclusive); searched PLAN for residual BYOK contradictions |
| Limits | Did not open Figma MCP/file contents beyond `figma.md`; did not run EAS build; typecheck smoke not completed green/red; GitHub API visibility check Forbidden from this environment |
| Bias check | Intentionally refused to lift score to ≥9 solely via Figma exception while P1-CI and P1-KILL-SWITCH remain open |

---

# Phase 0 re-review (post P1 hardening)

- **Reviewer:** Independent Grok agent (did not author hardening commit `3d8c7e3`)
- **Date:** 2026-07-12
- **Repo HEAD reviewed:** `3d8c7e3` (`main` = `3d8c7e3464c55a2c17cf7aa3dadf4fda3ebebe97`, matches `origin/main` at re-review start)
- **Scope:** Re-check only the five P1 hardening targets from the prior FAIL at `629fc87` / score 7.8. Prior FAIL section above is retained for history.
- **Hardening commit:** `3d8c7e3` — *Harden Phase 0 CI and BYOK kill-switch proof.*

## Verdict

**PASS-WITH-EXCEPTIONS**

Phase 0 exit bar is **≥ 9/10**. This re-review scores **9.0/10**. All previously open non-Figma P1s from the first review are **closed** by `3d8c7e3`. The sole remaining Phase 0 P1 is **P1-FIGMA-STARTER-QUOTA**, gated below as a tracked exception with clear owner action. That exception alone does not reopen CI / PLAN / kill-switch / routing honesty findings.

## Overall score

| | |
|---|---|
| **Overall** | **9.0 / 10** |
| Phase 0 exit bar | ≥ 9/10 |
| Result | **PASS-WITH-EXCEPTIONS** (Figma Packet 0C incomplete) |
| Prior verdict (historical) | FAIL 7.8 at `629fc87` / review against `310413b` |

### Per-criterion scores (re-review)

| # | Criterion | Was | Now | Notes |
|---|---|---:|---:|---|
| 1 | Repo live + PLAN locks | 8.5 | **9.5** | §9 Play checklist reconciled with D-0003 / ADR-0001 |
| 2 | ADR-0001 + ADR-0002 + unit economics | 8.5 | **9.0** | Denylist + CI scan now exist; ADRs still Proposed (P2) |
| 3 | Corpus/rights spike | 8.5 | **8.5** | Unchanged; still Phase 0 spike scope |
| 4 | Figma foundations | 3.0 | **3.0** | Still incomplete — tracked exception only |
| 5 | Blank `mobile-store` + typecheck honesty | 6.5 | **8.8** | Router honesty documented; typecheck gate real; Router not installed yet (Phase 1) |
| 6 | `AGENTS.md` BYOK contract quality | 9.0 | **9.5** | Contract now enforced by real CI scan path |

Weighted judgment: engineering/proof criteria are at exit quality; Figma remains the design-exit hold and is explicitly excepted.

---

## Hardening re-check (five targets)

### 1. CI fails on typecheck (no `|| true`) — **CLOSED**

**Evidence**

- `.github/workflows/ci-smoke.yml` runs `pnpm typecheck` with **no** `|| true`
- Workflow also runs BYOK scan + unit tests under `EXPO_PUBLIC_ENABLE_BYOK=false`
- Package `typecheck` scripts are real `tsc --noEmit` (mobile-store + packages)
- Reviewer proved fail-closed locally: clean `tsc` on `@manna/ai-policy` exits 0; injected `string`→`number` error exits **2** (`TS2322`)

**Residual (not P1)**

- Full `pnpm typecheck` via turbo was not green-verified in this reviewer environment (local Node 26 + pnpm `minimumReleaseAge` install friction). Workflow structure is correct; CI runner uses `.nvmrc` Node 24.

### 2. Real BYOK denylist/scan when flag off — **CLOSED**

**Evidence**

- `tooling/byok-artifact-denylist.txt` present (`@manna/ai-byok`, `openrouter.ai`, `OPENROUTER`, `openrouter`)
- `tooling/byok/scan-store-byok-leak.mjs` fails closed when `EXPO_PUBLIC_ENABLE_BYOK` ≠ `true`
- Skips `*.byok.tsx.example`; rejects store `package.json` dependency on `@manna/ai-byok`
- Reviewer ran: scan **OK**; `node --test tooling/byok/scan-store-byok-leak.test.mjs` — **4/4 pass** (clean store, OpenRouter leak detect, dep detect)

**Residual (P2 / pre-GA)**

- Source scan only; bundle/IPA scan still deferred per ADR-0001 (called out in AGENTS.md)

### 3. `@manna/ai-byok` not empty; settings don’t leak with flag off — **CLOSED**

**Evidence**

- Package exports types, `DEFAULT_BYOK_SETTINGS`, in-memory `ByokKeyStorage` stub + SecureStore key constant, `AiProviderSettingsScreen` shell (no longer `export {}`)
- `apps/mobile-store/app/(settings)/ai-provider.tsx` re-exports inert `ai-provider.default.tsx` only (`<View />`)
- Flag-on pattern lives in `ai-provider.byok.tsx.example` (excluded from scan)
- `apps/mobile-store/package.json` has **no** `@manna/ai-byok` dependency
- Flag-off store source scan: **no denylist matches**

### 4. PLAN.md Play BYOK contradiction — **CLOSED**

**Evidence**

- Prior §9 string *“No BYOK or external-payment path in the Play artifact”* is **gone**
- Current §9: first submissions ship `EXPO_PUBLIC_ENABLE_BYOK=false`; in-store BYOK later behind kill switch (ADR-0001); no external-payment path for Plus
- Aligns with D-0003 / §2 / §6 / AGENTS.md

### 5. Expo Router vs `App.tsx` honesty — **CLOSED**

**Evidence**

- `apps/mobile-store/ROUTING.md` states runtime is `index.ts` → `App.tsx`; `app/` is contract-only until Phase 1 installs `expo-router`
- README tree line matches: *`App.tsx` entry; `app/` contract routes — see ROUTING.md*
- PLAN still correctly targets Expo Router for product IA (Phase 1+), without claiming it is live in the blank app

---

## Findings (re-review)

### P0

_None._

### P1 (remaining)

1. **P1-FIGMA-STARTER-QUOTA** — Figma journeys/components absent; tokens-only; Starter quota blocker. See exception table.

#### Tracked P1 exception (Figma) — still open

| Field | Value |
|---|---|
| ID | **P1-FIGMA-STARTER-QUOTA** |
| Severity | P1 (blocks Phase 0 design exit and Phase 1 UI-from-Figma) |
| Owner action | Product owner upgrades to Figma Professional (or team seat) and unblocks design agent |
| Acceptance | Packet 0C pages exist; `figma.md` updated with component/journey IDs; independent re-review of design completeness |
| Effect on this verdict | Sole exception enabling **PASS-WITH-EXCEPTIONS** at 9.0; does **not** block non-UI Phase 1 tracks |

### P1 closed by `3d8c7e3`

| ID | Status |
|---|---|
| P1-CI-NOOP | **Closed** |
| P1-PLAN-PLAY-BYOK | **Closed** |
| P1-KILL-SWITCH-UNPROVEN | **Closed** (source-level proof; IPA scan remains pre-GA P2) |
| P1-MOBILE-ROUTER-MISMATCH | **Closed** (honesty docs; install Router in Phase 1) |

### P2 (carry forward; do not pretend done)

1. ADR-0001 / ADR-0002 still **Proposed**
2. Eval suite directories still doc-only
3. `supabase/` still README + empty dirs (no `/v1/ai/run` stub)
4. LICENSE “SPDX TBD”
5. Bundle/IPA BYOK artifact scan before GA
6. Phase 7 title still reads primary “Post-GA BYOK” while in-store is primary — clarify fallback-only for agents

---

## What may proceed vs must wait (updated)

### May proceed

- Non-UI Phase 1: Plus gateway spike, entitlements modeling, corpus ETL expansion, domain/contracts
- Mobile plumbing **without** inventing visuals from prose (constitution + PLAN + ROUTING.md)
- Accept ADRs after owner read

### Must wait

- **UI “from Figma”** until Packet 0C completes (P1-FIGMA)
- **Flag-on store BYOK builds** until policy clearance + Metro exclusion for a real flag-on graph is validated
- Treating Phase 0 as **design-complete** — it is not

---

## Honest summary for the orchestrator

Hardening commit `3d8c7e3` closed the four engineering P1s that kept the first review at 7.8 FAIL: real typecheck gate, real denylist + fail-closed scan with tests, non-empty `@manna/ai-byok` with flag-off settings isolation, PLAN Play reconciliation, and Router/`App.tsx` honesty. Score **9.0** — **PASS-WITH-EXCEPTIONS**. The exception is Figma only (owner upgrade + Packet 0C). Do not start UI-from-Figma; backend/domain Phase 1 may proceed.

---

## Reviewer self-score (rigor) — re-review

| | |
|---|---|
| **Self-score** | **9.0 / 10** |
| Method | Confirmed HEAD `3d8c7e3`; diffed hardening commit; inspected CI/workflow, denylist, scanner, tests, `ai-byok`, settings entrypoints, PLAN §9, README/ROUTING; re-ran BYOK scan + unit tests; proved `tsc` fail-closed on injected type error |
| Limits | GitHub Actions API Forbidden from this environment; full `pnpm typecheck`/`turbo` not green-run locally (Node/pnpm policy friction); Figma file not re-opened beyond `figma.md` |
| Bias check | Required all non-Figma P1s closed before allowing ≥9 with Figma exception; refused full PASS while Packet 0C incomplete |
