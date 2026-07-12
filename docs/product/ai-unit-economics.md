# AI unit economics — Manna Plus @ $4.99/mo

- **Status:** Phase 0 feasibility sheet (not a live cost dashboard)
- **Date:** 2026-07-12
- **Model price lock:** Gemini 2.5 Flash-Lite — **$0.10 / M input**, **$0.40 / M output** ([Google pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash-lite))
- **Related:** PLAN.md §2 subscription / fair-use; ADR-0002; orchestration override

## Goal (release gate)

At **$4.99 / month** list price, under a **pessimistic ~30% store fee**:

1. **p95 AI COGS ≤ $0.30** per paid MAU per month  
2. **Contribution margin ≥ 50%** under fair-use ceilings and budgeted token envelopes

This sheet proves the gate is **reachable** with Flash-Lite + server budgets. It does **not** claim production metering is wired yet.

## Revenue after store fee

| Item | Amount |
|---|---|
| List price (monthly) | $4.99 |
| Pessimistic store fee | 30% → **$1.497** |
| **Net after store** | **$3.493** |
| Annual list ($29.99/yr ≈ $2.499/mo) | Better AI headroom; gate is proven on the tighter monthly SKU |

Taxes/VAT, refunds, FX, and RevenueCat take rates are **not** fully modeled here; a $0.25–$0.50/mo “other variable” allowance is reserved below so the margin claim stays conservative.

## Fair-use ceilings (PLAN)

| Operation | Cap / day | Cap / 30-day month |
|---|---|---|
| `daily_reflection` | 1 | 30 |
| `explain_passage` | 30 | 900 |
| `search_scripture` | 30 | 900 |
| `draft_prayer` | 10 | 300 |
| **Total ops** | **71** | **2,130** |

Ceilings are **hard server caps**, not a promise that p95 users hit them daily. Never market as “unlimited.”

## Cost formula

\[
\text{cost} = \frac{T_{in}}{10^6}\cdot 0.10 + \frac{T_{out}}{10^6}\cdot 0.40
\]

Embedding calls for semantic search are **not** included in Flash-Lite generation pricing. Phase 0 treats them as a **separate pessimistic add-on** (see below) until an embedding model is pinned in a release record.

---

## Scenario A — Unbudgeted ceiling exhaustion (failure mode)

**Assumption:** User hits every fair-use ceiling every day for 30 days, with **fat** prompts (no max-token discipline).

| Op | Pessimistic \(T_{in}\) | Pessimistic \(T_{out}\) | Unit $ | × / mo | Monthly $ |
|---|---:|---:|---:|---:|---:|
| `daily_reflection` | 6,000 | 1,200 | $0.00108 | 30 | $0.0324 |
| `explain_passage` | 4,500 | 900 | $0.00081 | 900 | $0.7290 |
| `search_scripture` | 3,500 | 600 | $0.00059 | 900 | $0.5310 |
| `draft_prayer` | 4,000 | 800 | $0.00072 | 300 | $0.2160 |
| **Generation subtotal** | | | | | **$1.508** |
| Embeddings add-on (pessimistic) | ~1.5k tok equiv / search @ $0.10/M | | $0.00015 | 900 | **$0.135** |
| **Total AI COGS** | | | | | **≈ $1.64** |

**Verdict:** Far above the **$0.30** p95 gate. Ceiling counts alone do **not** protect margin. **Per-request max tokens + per-user monthly AI budget + global spend breaker are load-bearing** (ADR-0002).

---

## Scenario B — Budgeted ceilings (engineering target)

Server enforces max tokens so that **even a user at 100% fair-use ops** stays ≤ **$0.30 / mo** generation COGS.

### Locked pessimistic token envelopes (v1 proposal)

| Op | Max \(T_{in}\) | Max \(T_{out}\) | Unit $ | × / mo @ ceiling | Monthly $ |
|---|---:|---:|---:|---:|---:|
| `daily_reflection` | 2,500 | 500 | $0.00045 | 30 | $0.0135 |
| `explain_passage` | 1,800 | 350 | $0.00032 | 900 | $0.2880 |
| `search_scripture` | 1,200 | 200 | $0.00020 | 900 | $0.1800 |
| `draft_prayer` | 1,500 | 300 | $0.00027 | 300 | $0.0810 |
| **Sum if all at max** | | | | | **$0.5625** |

**Problem:** Full ceiling × max envelopes still exceeds $0.30. Therefore the product must combine:

1. **Op ceilings** (PLAN), and  
2. A **per-user monthly AI spend budget of $0.30** (hard reject when reserved cost would exceed), and/or  
3. **Tighter effective p95 usage** than theoretical max ops.

Release gate language in PLAN is **p95 AI COGS ≤ $0.30**, not “every ceiling user forever.” Ops ceilings stop abuse; the **$0.30 spend budget** stops COGS blowups for pathological ceiling grinders.

### Spend-budget reservation rule

- Before generation: `reserve = priced(max_in, max_out)` for that op (+ embedding estimate for search).  
- If `user_month_spent + reserve > $0.30` → return budget-exhausted typed fallback (free context preserved).  
- Settle actual usage after completion; unused reservation released.

Under this rule, **AI generation COGS is capped at ≤ $0.30 / paid MAU / month by construction** (plus small overshoot risk from estimation error — meter actuals and keep 5–10% headroom in `reserve`).

### Pessimistic p95 usage (planning mix)

Heavy but realistic Plus user (not grinding all 71/day):

| Op | Pessimistic tokens (in/out) | Unit $ | p95 rate / mo | Monthly $ |
|---|---|---:|---:|---:|
| `daily_reflection` | 2,500 / 500 | $0.00045 | 28 | $0.0126 |
| `explain_passage` | 1,800 / 350 | $0.00032 | 120 | $0.0384 |
| `search_scripture` | 1,200 / 200 | $0.00020 | 90 | $0.0180 |
| `draft_prayer` | 1,500 / 300 | $0.00027 | 40 | $0.0108 |
| Embeddings (search) | ~800 tok @ $0.10/M | $0.00008 | 90 | $0.0072 |
| **p95 AI COGS** | | | | **≈ $0.087** |

**Headroom to gate:** $0.30 − $0.087 ≈ **$0.21** (~3.4×). Comfortable if metering and prompt sizes stay disciplined.

---

## Contribution margin

### Definition used here

\[
\text{CM} = \frac{\text{Net after store} - \text{Variable COGS}}{\text{Net after store}}
\]

with Net after store = **$3.493**.

### Variable COGS pack (pessimistic Phase 0)

| Line | p95 / paid MAU / mo |
|---|---:|
| AI (budget-capped / Scenario B p95) | $0.087 (cap $0.30) |
| Embeddings already in AI row | — |
| RevenueCat + store-adjacent variable | $0.10 |
| Supabase / DB / vector / egress | $0.08 |
| Observability / support allocation | $0.07 |
| Refund/FX/incident cushion | $0.10 |
| **Total variable (p95)** | **≈ $0.437** |
| **Total variable (AI at hard cap $0.30 + others)** | **≈ $0.650** |

### Margin results

| Case | Variable COGS | CM on $3.493 net |
|---|---:|---:|
| p95 AI + other | $0.437 | **(3.493 − 0.437) / 3.493 ≈ 87.5%** |
| AI at $0.30 cap + other | $0.650 | **(3.493 − 0.650) / 3.493 ≈ 81.4%** |
| Release gate | — | **≥ 50%** ✅ |

Even if “other variable” were wrong by **2×** at AI-cap ($0.30 + $0.70 = $1.00), CM ≈ **71%** — still above 50%.

### Gross-basis check (optional)

\((4.99 - 1.497 - 0.650) / 4.99 ≈ 57\%\) ≥ 50%. Gate holds on both conventions.

---

## Annual SKU note

$29.99/yr after 30% fee → **$20.993/yr ≈ $1.749/mo** net. Same $0.30 AI cap is a larger share of monthly net (~17%) but CM at AI-cap + $0.35 other ≈ **(1.749 − 0.65) / 1.749 ≈ 63%** — still ≥ 50%. Monthly remains the binding constraint.

---

## Controls required for the proof to remain true

1. Freeze `gemini-2.5-flash-lite` + prompt/schema versions in a signed release (ADR-0002).  
2. Enforce per-op max tokens matching the budgeted envelope table (or tighter).  
3. Enforce **$0.30 / user / calendar month** AI spend budget (USD, metered).  
4. Global org spend breaker + per-op kill switches.  
5. Re-run this sheet when embedding prices, provider routing, or fair-use caps change.  
6. Do not claim 10/10: live p95 depends on real usage distributions after beta.

## Open risks

| Risk | Impact | Mitigation |
|---|---|---|
| Fat system prompts / large retrieval dumps | Token overrun | Hard max context assembly; truncate retrieval to N pericopes |
| Embedding model cost unknown | Extra COGS | Pin model; fold into $0.30 budget reservation |
| Retry storms | Double spend | Idempotency keys; charge only settled successful generations where possible |
| Price list changes | Margin erosion | Re-benchmark; eval gate before model swap |
| Ceiling grinders hit budget early | UX frustration | Clear fair-use + reset copy; never break free path |
| Eval forces larger prompts | Economics regress | Reject model/prompt change if sheet fails |

## Self-check vs gate

| Gate | Phase 0 status |
|---|---|
| p95 AI COGS ≤ $0.30 | **Pass by budget construction**; illustrative p95 ≈ **$0.087** |
| CM ≥ 50% after 30% store fee | **Pass** (~81–88% under stated packs) |
| Fair-use ceilings honored | Caps from PLAN; spend budget is additional |
| Confidence | **Architecture-feasible, not production-proven** |
