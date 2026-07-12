# Mobile store routing (Phase 0)

- **Runtime entry:** `index.ts` → `App.tsx` (Expo blank template).
- **Contract routes:** `app/(settings)/ai-provider.tsx` is the BYOK settings anchor for Phase 1 Expo Router wiring; it is not mounted until Router is installed.
- **Phase 1:** add `expo-router`, set `main` to `expo-router/entry`, and mount `app/` routes (tabs stub + settings stack).

Do not treat `app/` as live navigation until that migration lands.
