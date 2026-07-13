# Lock-screen / home-screen Bible verse widgets — research for Manna

**Status:** Product research (not an ADR)  
**Authority:** `PLAN.md` § Widgets wins over this brief  
**Date:** 2026-07-12  
**Scope:** iOS WidgetKit path first; Android Glance deferred per plan  

---

## Executive summary

1. **Market pattern (2025–2026):** Viral “Bible on your lock screen” ads usually sell either (a) a **WidgetKit verse widget** (YouVersion, BitBible, Heavenly, Biblo, Scriptr) or (b) a **wallpaper/Focus rotation** product (FaithWall, Bible Verse Lock Screen) — often freemium, theme packs, and “tailored” mood/topic selection, not live generative AI on the lock screen.
2. **Manna fit:** Ship **free, offline, rule-based daily Scripture** from the local corpus (same deterministic picker as Today), never AI paraphrases, prayer text, or “God chose this” copy on the lock screen.
3. **Implementation path:** Official [`expo-widgets`](https://docs.expo.dev/versions/latest/sdk/widgets/) + CNG config plugin, App Group shared payload, **30-day local timeline**, deep link to the exact passage — **dev/EAS build only** (not Expo Go).
4. **Timing:** After reader + Today land (Phase 2 Wave C). Current repo has daily/recommendation stubs; **`WidgetPayload` is named in PLAN but not yet in `@manna/contracts`**.
5. **Risks to design for:** App Review (privacy labels + widget extension), battery/update budget, stale-but-dated never-blank UI, lock-screen truncation, and Android Glance as a later dedicated module.

---

## 1. What leading apps do

Sources include App Store listings, YouVersion help docs, and 2026 roundups ([FaithLock widget guide](https://www.getfaithlock.com/resources/best-bible-verse-widgets-iphone), [FaithWall lock-screen guide](https://faithwall.app/blog/bible-verse-lock-screen-iphone)). No single ad URL was provided; the most likely “viral ad” cluster is the freemium lock-screen/wallpaper + widget apps below, not YouVersion’s quieter VOTD widget.

### Competitive snapshot

| Product | Primary surface | Sizes / families (typical) | Personalization | Update cadence | Deep link / tap |
|---|---|---|---|---|---|
| **YouVersion Bible** | Home + lock | Home S/M/L; lock compact reference | Default translation; curated VOTD (not user-picked) | Daily | Opens VOTD / Bible App |
| **Heavenly** | Home + lock | S/M/L + lock | Translation + themes; premium design library | Daily (sometimes laggy to mid-morning) | Opens app / verse context |
| **BitBible** | Lock-first | Small/medium + lock | Minimal — curated feed | Daily, reliability-focused | Opens app |
| **Bible Verse Lock Screen** (`id6747117806`) | Wallpaper + widgets | Customizable widget sizes + wallpaper | Translation, books, themes, gallery | Daily auto wallpaper/widget | Wallpaper set + widget gallery |
| **FaithWall** | Wallpaper / Focus rotation | Wallpaper primary; daily widget optional | Verse packs (Peace, Strength, …) | Pack rotation / daily widget | “Set Lock Screen” flow |
| **Biblo / Bible Widgets / Scriptr** | Home + lock widgets | Small–large + lock accessories | Topics, themes, photos, collections | Daily / topic feed | Opens topic or verse |
| **Widgetsmith** | DIY text widget | All + lock | Full visual control; **manual** verse text | Manual | N/A (generic) |
| **FaithLock** | App-blocker, not classic widget | N/A for glance widget | Quiz unlock with verse | Per unlock | Engagement loop (anti-pattern for Manna calmness) |

### Patterns that matter for Manna

**Sizes**

- **Home:** `systemSmall` (reference + short excerpt), `systemMedium` (full short passage + translation label). Large is optional later; PLAN locks **small + medium** for v1.
- **Lock Screen (iOS 16+):** `accessoryRectangular` (best for 1–2 lines + reference), `accessoryInline` (reference or ultra-short), optionally circular later (poor for verse text). Lock accessories truncate aggressively (~20–40 visible characters on the smallest surfaces).

**Personalization competitors sell**

- Translation picker  
- Theme / mood / book packs (“for anxiety”, “peace”)  
- Pretty typography / photo backgrounds  
- Wallpaper automation (Shortcuts / Focus), which is **not** WidgetKit  

**What “tailored” usually means in ads**

- Rule-based topic packs or onboarding quiz → curated list — **not** streaming an LLM onto the lock screen.  
- Manna already has the right analog: deterministic `pickDailyPassage` + optional theme filter from local editorial candidates (`packages/recommendation`).

**Update cadence**

- Almost all Bible widgets: **once per local calendar day**.  
- Stale “yesterday’s verse until mid-morning” is a common complaint — Manna’s **30-day precomputed timeline** directly addresses this.

**Deep links**

- Tap → open app to that passage / VOTD.  
- Manna PLAN: deep link to the **exact passage**; handle deep-link-failure state without blanking the widget.

---

## 2. How they likely work technically

### WidgetKit architecture (industry standard)

1. **Widget Extension** — separate process from the app; SwiftUI (or Expo’s `@expo/ui` → SwiftUI) renders archived snapshots.
2. **App Group** — shared container (UserDefaults / files) so the main app writes verse payloads the extension can read when the app is not running.
3. **Timeline** — array of `(date, entry)` handed to WidgetKit; system displays the entry for “now” and reloads per policy (`atEnd`, `after(date)`, etc.). Apple budgets reloads for battery; apps cannot guarantee minute-level refresh.
4. **Privacy / Lock Screen** — content may be **redacted** when locked / Always On if marked sensitive or if the user disables Lock Screen widget access ([WidgetKit security](https://support.apple.com/guide/security/widgetkit-security-secbb0a1f9b4/web)). Scripture excerpts are not banking data, but still avoid prayer journals and personal labels.
5. **No live network required for display** — good products cache the current (and often next) verse locally; network only refreshes the next pack when online.

### Implications for “AI tailored” ads

Live model inference inside a widget extension is a poor fit (time budget, battery, offline, App Review). Ads that claim personalization almost certainly **precompute** a verse ID in the app and push a static string into the shared container / timeline.

---

## 3. Exact Expo path for Manna

### Docs (authoritative)

| Resource | URL |
|---|---|
| Expo Widgets API | https://docs.expo.dev/versions/latest/sdk/widgets/ |
| Expo Background Task (inexact refresh helper) | https://docs.expo.dev/versions/latest/sdk/background-task/ |
| Stable widgets blog (SDK 56+) | https://expo.dev/blog/ios-widgets-and-live-activities-in-expo |
| Example app | `npx create-expo-app --example with-widgets` |
| Apple WidgetKit strategy | https://developer.apple.com/documentation/widgetkit/developing-a-widgetkit-strategy |

Repo already uses **Expo SDK 57** (`apps/mobile-store`); `babel-preset-expo` includes a widgets plugin — path is first-party and current.

### Config plugin (CNG)

`expo-widgets` is **not available in Expo Go**. Requires a **development build** / EAS build after prebuild so the Widget Extension target and App Group exist.

Suggested `app.json` / `app.config` shape (bundle ID already `com.iacompa.manna`):

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.iacompa.manna"
    },
    "plugins": [
      [
        "expo-widgets",
        {
          "bundleIdentifier": "com.iacompa.manna.widgets",
          "groupIdentifier": "group.com.iacompa.manna",
          "widgets": [
            {
              "name": "DailyPassageWidget",
              "displayName": "Daily passage",
              "description": "Today’s Scripture from Manna",
              "supportedFamilies": [
                "systemSmall",
                "systemMedium",
                "accessoryRectangular",
                "accessoryInline"
              ]
            }
          ]
        }
      ]
    ]
  }
}
```

### Runtime pattern

1. Mark widget UI with the `'widget'` directive; build layout with `@expo/ui/swift-ui` (`Text`, `VStack`, …).
2. `createWidget('DailyPassageWidget', Component)` — name must match config.
3. From the main app (after daily pick / corpus load):
   - Write shared **App Group** payload (JSON).
   - Call `updateTimeline` with **~30 daily entries** (PLAN: thirty-day local timeline) so correctness does not depend on background tasks.
4. Optional: `expo-background-task` for opportunistic re-seed — **never required** for daily correctness (PLAN).

### Family → copy budget (design constraint)

| Family | Show | Avoid |
|---|---|---|
| `accessoryInline` | Reference only, e.g. `John 14:27 · BSB` | Full verse body |
| `accessoryRectangular` | Reference + truncated excerpt (1–2 lines) | Long passages, dual-language dump |
| `systemSmall` | Reference + short excerpt + date | Dense bilingual |
| `systemMedium` | Excerpt + reference + translation code; optional EN/ES secondary line if space | AI commentary, themes as guilt labels |

---

## 4. Fit with Manna free tier and Plus

### Free (default — complete product)

- Source: local SQLCipher / scripture DB + reviewed daily candidates.  
- Picker: existing deterministic `pickDailyPassage` / `getDailyPassage` (theme filter optional; installation-local seed).  
- Widget shows **canonical Scripture text only** (user’s primary translation; bilingual secondary only if it fits medium home widget — never force dual text on lock accessories).  
- Offline forever for already-timelined days.

### Plus

- May **refresh the same local payload** (e.g. re-seed timeline after theme preference sync from Plus features, or after corpus pack update).  
- Must **not** put Plus AI commentary, explanations, or paraphrases on the widget.  
- Entitlement must not gate the basic daily widget (PLAN free-tier table: Basic widget = Yes for free).

### Explicit non-goals for v1 widgets

- Live OpenRouter / Gemini on the lock screen  
- Prayer journal snippets  
- “Personalized for your struggle” marketing labels on the widget face  
- Streaks / guilt copy  

---

## 5. Privacy and theological presentation

PLAN requirements (non-negotiable):

| Rule | Widget implication |
|---|---|
| Scripture is primary | Widget body = licensed/canonical excerpt + reference + translation id |
| Never blank | Always show last valid dated passage or explicit dated stale state |
| Never AI paraphrases | No generative rewrite in App Group storage |
| No sensitive personalization labels | No “for your anxiety”, “God chose this for you”, mood chips on lock screen |
| Prayer stays private | `prayer_journal` never written to widget storage |
| Minimal payload | Excerpt, date, translation, deep link only |

Suggested lock-screen copy tone: calm, factual — e.g. date + reference + text. Accessibility: Dynamic Type as supported by Expo UI; VoiceOver labels = reference + full excerpt when truncated visually.

Honor system redaction: if iOS asks for privacy redaction, show reference-only or generic “Daily passage” placeholder — still never an empty hole without a state.

---

## 6. Phase implementation packet (after reader lands)

**Plan slot:** Phase 2 Wave C — *Notifications, settings, iOS widgets…* (after Wave A reader and Wave B Today / deterministic recommendations).  
**Branch naming:** `codex/<packet-id>` (e.g. `codex/p2c-ios-daily-widget`).  
**Prerequisite:** Reader can open a `CanonicalRef`; Today can produce a stable daily pick; local DB has verse text for BSB (and Spanish when gate allows).

### Packet goals

1. User can add Manna widgets (home small/medium + lock rectangular/inline).  
2. Timeline covers **30 local calendar days** from last successful seed.  
3. Tap opens `manna://passage/...` (or Expo Router equivalent) to the exact ref.  
4. Airplane-mode proof: widget still shows today’s dated passage.  
5. Never blank; stale-valid shows date; unavailable translation is labeled, not silently substituted.

### Files / ownership (proposed)

| Area | Path | Notes |
|---|---|---|
| Contracts | `packages/contracts/src/schemas.ts` (+ export) | Freeze `WidgetPayload` (+ zod); PLAN already lists it |
| Domain / recommendation | `packages/recommendation` | 30-day seed helper over `pickDailyPassage` |
| Scripture load | `packages/scripture` | Resolve refs → display text for payload |
| Widget UI | `apps/mobile-store/widgets/DailyPassageWidget.tsx` (or `src/widgets/`) | `'widget'` directive + `createWidget` |
| App seed service | `apps/mobile-store/src/widgets/seedDailyTimeline.ts` | Write App Group + `updateTimeline` |
| Settings / Today | settings row “Add widget” instructions; Today onAppear re-seed | No Expo Go |
| Config | `apps/mobile-store/app.json` | `expo-widgets` plugin + group id |
| Privacy | PrivacyInfo / Info.plist via CNG | Widget extension privacy manifest |
| Tests | contract schema tests; seed pure tests; optional Detox/dev-client checklist | Physical device required for gallery proof |

### Shared payload schema (draft for contracts)

```ts
// Freeze in @manna/contracts — illustrative draft
type WidgetDisplayState =
  | "fresh"
  | "locally_scheduled"
  | "stale_but_valid"
  | "privacy"
  | "unavailable_translation"
  | "updating"
  | "deep_link_failure";

type WidgetPayload = {
  schemaVersion: 1;
  localDate: string; // YYYY-MM-DD
  translationId: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  referenceDisplay: string; // localized short ref
  excerpt: string; // canonical text, length-capped per family at render
  deepLink: string; // manna://...
  state: WidgetDisplayState;
  corpusVersion: string;
  algorithmVersion: string;
};
```

**App Group:** `group.com.iacompa.manna`  
**Widget bundle id:** `com.iacompa.manna.widgets`  
**Local table (PLAN):** `widget_state` in on-device DB for last seed metadata; App Group holds the **minimal** display JSON only.

### EAS / build requirements

| Environment | Widgets work? |
|---|---|
| Expo Go | **No** |
| `eas build --profile development` + dev client | Yes |
| Preview / production IPA | Yes |
| Simulator | Partial — prefer **physical iPhone** for lock-screen accessory families |

Any change to the widgets config plugin → **new native binary**.

### Acceptance checklist

- [ ] Widget gallery shows English and Spanish display names/descriptions  
- [ ] Small / medium / accessoryRectangular / accessoryInline all non-blank  
- [ ] Timeline advances at local midnight without opening the app (pre-seeded)  
- [ ] Force-quit app + airplane mode → still shows correct dated excerpt  
- [ ] Tap → reader at exact ref; broken link → `deep_link_failure` UI, not crash  
- [ ] No prayer, theme guilt, or AI strings in App Group file inspection  
- [ ] Privacy Nutrition Labels / manifests include widget extension  
- [ ] Reviewer score gate ≥ 9/10 for RC-adjacent packet  

---

## 7. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **App Review** — unclear privacy, overclaimed “AI personalization”, wallpaper automation entitlements confusion | P1 | Honest metadata; widget = Scripture display; no tracking in widget path; privacy manifests for app + extension |
| **Battery / reload budget** — system skips reload | P2 | 30-day timeline so skipped reload still shows correct day; background task optional only |
| **Stale widgets** — user sees yesterday | P1 product | Pre-seed; `stale_but_valid` with visible date; re-seed on app foreground / Today |
| **Truncation** — lock screen cuts mid-verse | P2 | Family-specific excerpt caps; prefer complete short verses in editorial daily set |
| **Empty / loading forever** | P0 | Placeholder only during first seed; never ship blank; fallback to last valid |
| **Translation / corpus mismatch** | P1 | `unavailable_translation` state; never silent substitute |
| **Deep link scheme collisions** | P2 | Single `manna` scheme; versioned path; failure state |
| **Android Glance later** | Planned | Separate Kotlin/Glance Expo module; shared payload shape; WorkManager opportunistic; no exact-alarm; after 14 stable iOS GA days (Phase 5) |
| **Design debt from competitor aesthetics** | Product | Calm Manna tokens; no streaky / blocker UX; bilingual independent QA |

---

## 8. Recommendation for Manna positioning

Do **not** compete with Heavenly on watercolor art or FaithLock on app blocking. Compete on what the constitution already owns:

- Offline-first bilingual canonical Scripture  
- Calm, non-manipulative presence on the lock screen  
- Deterministic daily passage aligned with in-app Today  
- Fail-safe, dated, never-blank widget that works when AI and network do not  

That is enough to match the user desire behind the ad (“verse when I glance at my phone”) without adopting the freemium mood-AI wallpaper category’s theology or privacy posture.

---

## References

- Manna `PLAN.md` — § Widgets, Phase 2 Wave C, public contracts (`WidgetPayload`), failure table  
- [Expo Widgets](https://docs.expo.dev/versions/latest/sdk/widgets/)  
- [YouVersion iOS widget help](https://help.youversion.com/l/en/article/11tgx3c639-widget-ios)  
- [FaithLock — Best Bible Verse Widgets for iPhone (2026)](https://www.getfaithlock.com/resources/best-bible-verse-widgets-iphone)  
- [FaithWall — Bible Verse Lock Screen setup (2026)](https://faithwall.app/blog/bible-verse-lock-screen-iphone)  
- Apple — [WidgetKit strategy](https://developer.apple.com/documentation/widgetkit/developing-a-widgetkit-strategy), [WidgetKit security](https://support.apple.com/guide/security/widgetkit-security-secbb0a1f9b4/web)  
