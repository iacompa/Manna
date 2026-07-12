# Contributing to Manna

## Before you code

1. Read [PLAN.md](./PLAN.md) — it overrides research briefs in `reasearch 1/`.
2. Read [AGENTS.md](./AGENTS.md) for merge gates, file ownership, and BYOK boundaries.
3. Check [docs/decisions/](./docs/decisions/) for ADRs.

## Workflow

- One packet / branch per agent lane (`codex/<packet-id>`).
- Do not edit shared contracts, migrations, design tokens, or corpus manifests in parallel without orchestrator coordination.
- PRs need independent review ≥8/10 (≥9/10 for release-candidate packets).

## Commits

- Clear messages focused on **why**, not only what.
- No secrets, `.env*`, keys, or local `*.db` files.

## Local setup

- Node 24 LTS (see `.nvmrc` / `package.json` engines).
- pnpm via `packageManager` field in root `package.json`.
- Expo development builds via EAS (profiles in `apps/mobile-store/eas.json`).

## Tests

Run package-level tests from the repo root with Turborepo (`pnpm test` when wired). Phase 0+: smoke lint/typecheck only until CI is fully configured.
