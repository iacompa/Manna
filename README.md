# Manna

Calm, bilingual, offline-first Bible and prayer companion for iOS and Android.

- **Free tier:** full offline Scripture, prayer, search, and daily passages — no account required.
- **Manna Plus:** subscription AI assistance (`$4.99/mo`, `$29.99/yr`) powered by Gemini 2.5 Flash-Lite via Manna-managed keys.
- **BYOK (optional):** in the free store app, users may connect their own OpenRouter key (any model); removable via feature flag for store compliance.

## Repository

pnpm monorepo (Node 24, Expo SDK 57). See [PLAN.md](./PLAN.md) for product authority and [AGENTS.md](./AGENTS.md) for agent operating rules.

```text
apps/mobile-store/     Expo Router store app
packages/*             Shared domain, AI policy, BYOK module, UI
supabase/              Migrations, Edge Functions, RLS tests
tooling/corpus/        USFM → SQLite pipeline
content/               Manifests and license ledger
docs/                  ADRs, product, editorial, runbooks
```

## Getting started

```bash
corepack enable
pnpm install
pnpm --filter mobile-store start
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

See [LICENSE](./LICENSE) (SPDX TBD).
