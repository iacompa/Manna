# Mobile store routing (Phase 1)

- **Entry:** `expo-router/entry` → `app/`
- **Gate:** `app/index.tsx` sends new users to onboarding, then `/(tabs)/today`.
- **Tabs:** Today, Read, Pray, Library (`app/(tabs)/*`).
- **Stacks:** `onboarding/*`, `reader/index`, `pray/guided`, `(settings)/*`.
- **BYOK:** `app/(settings)/ai-provider.tsx` remains inert when `EXPO_PUBLIC_ENABLE_BYOK=false`.
