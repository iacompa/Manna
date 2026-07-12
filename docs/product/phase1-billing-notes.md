# Phase 1 — Billing notes (stub)

**Status:** Engineering stub for RevenueCat integration (mobile billing lane owns UI).

## Store products

| Product ID | Price | Notes |
|---|---|---|
| `manna_plus_monthly` | $4.99 / month | Auto-renewing subscription |
| `manna_plus_annual` | $29.99 / year | 7-day free trial (annual only) |

## Entitlement

- RevenueCat entitlement identifier: **`manna_plus`**
- Plus AI (`POST /v1/ai/run` / Edge `ai-run`) must verify `manna_plus` server-side after JWT validation (ADR-0002).
- Free tier: no Manna-managed AI generation.

## Server mirror (Phase 1+)

- Pseudonymous Supabase JWT identifies the subscriber; never accept entitlement tier from the client.
- Reconcile with RevenueCat webhooks / periodic refresh before reserving AI budget.
- Kill switch and fair-use counters are independent of store SKU (monthly vs annual share one entitlement).

## Environment placeholders

See repository root `.env.example` and `apps/mobile-store/.env.example` for public vs secret keys. **No production keys in git.**

## Out of scope (Phase 1)

- Paywall screens and purchase flows (`apps/mobile-store` billing worker)
- Production webhook handlers
- Tax / pricing localization beyond USD list prices in PLAN
