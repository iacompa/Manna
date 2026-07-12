# Manna — Comprehensive Product, Design, Engineering, Content, AI, and Launch Plan

## 0. Document Control and Authority

- **Target file:** `/Users/michael/Documents/💻 Business/Vibe Code Files/Manna/PLAN.md`
- **Current state:** standalone Manna monorepo bootstrapped (Phase 0). Research briefs remain under `reasearch 1/` as historical inputs only.
- **Initial status:** `Approved for Implementation` (Phase 0 repo bootstrap complete).
- **Authority order:**
  1. `PLAN.md`
  2. Approved architecture decision records
  3. Corpus/license manifests and editorial policy
  4. Figma designs and component specifications
  5. Implementation issues and agent task packets
  6. The two supplied research documents as historical inputs only
- Product scope, privacy posture, canon, monetization, or AI-safety rules may change only through an owner-approved plan update. Technical substitutions require an ADR explaining evidence, compatibility, migration, and rollback.
- Every implementation phase updates the plan’s decision log, risk register, test evidence, and release readiness. Agents may not silently reinterpret the research briefs.

---

## 1. Product Definition

### Mission

Manna is a calm, bilingual, offline-first Bible and prayer companion that helps people read Scripture, build a sustainable prayer habit, and optionally receive carefully grounded AI assistance.

It is not an AI pastor, a social feed, a gamified streak product, or a motivational quote app.

### Product constitution

1. **Scripture is primary.** Canonical text is visually, structurally, and technically distinct from AI commentary, editorial notes, and personalization.
2. **The free app is complete.** Reading, bilingual comparison, search, saving, prayer, daily passages, reminders, and the basic widget remain free and offline.
3. **AI is optional and humble.** AI never impersonates God, clergy, a prophet, therapist, or doctrinal authority.
4. **English and Spanish have equal status.** Spanish is designed, reviewed, and tested independently—not mechanically translated after English ships.
5. **Privacy outranks engagement.** Spiritual interests, reading history, prayer text, searches, and themes remain on-device in v1.
6. **Calmness outranks retention tricks.** No streak pressure, guilt copy, fake testimonials, social counters, mood-reactive colors, or manipulative notifications.
7. **The app fails safely.** Scripture, prayer tools, and saved content remain available when AI, billing, the backend, or the network fails.
8. **The app never claims certainty it does not possess.** Retrieval reduces error; it does not eliminate hallucination.
9. **Personalization is explicit and reversible.** Users can inspect, change, disable, or reset every theme influencing recommendations.
10. **Accessibility is a release requirement.** It is not deferred polish.

### Audience and positioning

- Initial audience: English- and Spanish-speaking Christians aged 13+ in the United States storefront.
- Canon: broad Protestant, non-denominational, ecumenically respectful, 66 books.
- Manna must not imply complete Catholic or Orthodox support.
- Primary users:
  - New or casual readers needing approachable navigation and context
  - Users seeking comfort, wisdom, prayer structure, or a daily Scripture habit
  - Bilingual households and readers comparing English and Spanish
- Secondary users: experienced readers who value offline access, search, highlighting, collections, and contextual assistance.
- Do not market to children or enter the Kids category.
- Expansion outside the United States requires country-specific review of Scripture rights, pricing, privacy law, AI disclosures, crisis resources, taxes, and storefront policies.

### North-star outcome

**Weekly meaningful Scripture sessions:** a user reads a contextual passage, completes a prayer session, or saves a passage after reading it in context.

Manna must not optimize for raw screen time.

### Locked launch decisions

- iOS and iPadOS are designed and beta-tested first.
- Android architecture is validated from Phase 0 but releases after iOS stability.
- iOS 16.4+ and Android 7+ are the technical minimums supported by Expo SDK 57; the physical QA matrix emphasizes current devices and representative older hardware. ([Expo compatibility](https://docs.expo.dev/versions/latest/))
- Initial public availability is limited to the US storefront.
- No web application in v1.
- No account is required for the free product.
- No cross-device spiritual-content sync in v1.
- Notifications are local-only in v1; do not add OneSignal.
- The public store app contains Free and Manna Plus.
- BYOK (Bring Your Own Key) ships **in the same free store app**: Settings → paste OpenRouter API key → user selects any model (blank default, no presets). Key stays in device SecureStore only. A separate post-GA direct Android app remains a **fallback** if Apple/Google forbid in-app API keys.
- Working name is Manna, subject to trademark, store-name, domain, and bundle-ID clearance.

### Explicitly deferred

- Community, Study Circles, social profiles, public comments, and prayer-sharing
- Streaks, leaderboards, engagement counters, and gamified rewards
- Audio Bible
- Church codes and congregation administration
- Email/SMS devotionals
- Advanced reading plans and spaced-repetition memorization
- Original-language tools and scholarly commentary libraries
- Catholic and Orthodox canon packs
- Cloud prayer-journal sync
- Open-ended theological chat
- Voice conversation
- Remote marketing notifications
- Donations or external payment links
- AI-generated content placed directly in notifications or lock-screen widgets

---

## 2. V1 Scope and Business Model

### Launch content inventory

Before public release, Manna must contain:

- Complete approved English and Spanish 66-book corpora
- At least 500 editorially reviewed contextual daily passages
- At least 24 reviewed themes
- At least 100 human-reviewed passage context notes available to free users
- At least 30 reviewed prayer-library entries
- Guided prayer covering Adoration, Confession, Thanksgiving, Supplication, and optional Silence
- At least 20 curated topic collections
- Complete English and Spanish onboarding, settings, privacy, billing, safety, error, and empty-state copy
- A bilingual AI evaluation corpus of at least 600 total cases
- Verified US English/Spanish crisis and safety resources
- Translation, attribution, license, and content-source screens

### Product portfolio

| Capability | Free store app | Manna Plus | BYOK (in free store app) |
|---|---|---|---|
| Full offline Bible | Yes | Yes | Yes |
| English/Spanish and bilingual reading | Yes | Yes | Yes |
| Reference and keyword search | Yes | Yes | Yes |
| Highlights, bookmarks, collections | Local | Local | Local |
| Prayer library and private journal | Local | Local | Local |
| Reviewed daily passage | Local | Local | Local |
| Local reminders | Yes | Yes | Yes |
| Basic widget | Yes | Yes | Yes |
| AI passage explanation | — | Manna-managed (`gemini-2.5-flash-lite`) | User’s OpenRouter key (any model) |
| Semantic “Ask Scripture” | — | Manna-managed (`gemini-2.5-flash-lite`) | Local vectors + user key |
| AI prayer draft | — | Manna-managed (`gemini-2.5-flash-lite`) | User’s key |
| Optional personalized daily reflection | — | Yes | Yes |
| Cloud spiritual-content sync | No | No | No |
| Public store distribution | Yes | Yes | Yes (BYOK is a settings module in the store app; removable via kill switch) |
| Initial price | $0 | $4.99 monthly / $29.99 annual | Free from Manna; provider costs paid by user |

### Subscription policy

- RevenueCat entitlement: `manna_plus`
- Offering: `default`
- Products:
  - `manna_plus_monthly`
  - `manna_plus_annual`
- Seven-day trial on annual only.
- Display only store-provided localized prices, billing periods, and eligibility.
- The paywall must say “subscription,” explain auto-renewal, disclose the post-trial amount, show cancellation instructions, and provide Restore Purchases.
- Never claim “unlimited.” Initial fair-use ceilings:
  - 1 personalized daily reflection per day
  - 30 passage explanations per day
  - 30 semantic searches per day
  - 10 prayer drafts per day
- Limits are configurable server-side but may only be lowered after updated user disclosure.
- Reaching a limit always preserves the free contextual reading and prayer path.
- Unit-economics calculations must include store fees, taxes/VAT, refunds, RevenueCat, AI, embeddings, database, observability, customer support, foreign exchange, and incident overhead.
- Release requires at least 50% contribution margin under a pessimistic 30% store-fee assumption and p95 AI COGS no greater than $0.30 per paid active user per month.

---

## 3. Complete UI and UX Specification

### Navigation

Use four persistent destinations:

1. **Today**
2. **Read**
3. **Pray**
4. **Library**

Settings, privacy, billing, translation management, and support open from a clearly labeled header control.

Use standard Expo Router stacks and tabs. Do not make unstable native-tab APIs a launch dependency.

### First launch

Four resumable, skippable steps:

1. **Language**
   - `English`
   - `Español`
   - Do not use flags.
2. **Optional goals**
   - Choose up to three: Comfort, Wisdom, Prayer, Learn Scripture, Build a Habit, Hope, Guidance, Gratitude
   - Explain that these remain on-device.
3. **Reading setup**
   - Primary translation
   - Optional second translation
   - Live text-size and line-spacing preview
   - Default reading mode: one language or bilingual
4. **First passage**
   - Show a complete contextual passage
   - Primary action: `Read in context`
   - Secondary: `Save` and `Pray`

Do not ask for a name, account, payment, notification permission, faith-proximity score, mental-health state, or free-text life situation during onboarding.

Target median time to the first useful passage: 45 seconds or less.

### Today

- Localized time-of-day greeting without requiring a name.
- One contiguous daily passage, not an isolated “fortune-cookie” verse.
- Always show translation and reference.
- Primary action: `Read in context`
- Secondary actions: `Save` and `Pray`
- Feedback:
  - `Helpful`
  - `Not for me today`
- Optional follow-up lets the user adjust theme preferences.
- Show:
  - Continue Reading
  - Prayer shortcut
  - Saved-content shortcut
- Avoid a crowded bento dashboard.
- Do not place a locked AI control on the passage itself. AI becomes available after `Explore context` is intentionally selected.

### Reader

- Render chapters as prose, poetry, headings, paragraphs, footnotes, and verse segments—not a stack of verse cards.
- Preserve source punctuation and formatting.
- Default Scripture font: EB Garamond.
- UI font: Inter or system sans.
- Reader controls:
  - Text size
  - Line spacing
  - Serif/sans choice
  - Light/dark theme
  - Verse-number visibility
  - Primary and secondary translations
- Previous/next chapter controls remain reachable without obscuring text.
- Book picker is a full-screen accessible route with:
  - Search
  - Recent books
  - Old/New Testament grouping
  - Chapter grid
- Restore the precise canonical anchor and scroll position after:
  - Relaunch
  - Rotation
  - Font change
  - Language change
  - Translation change
- Selecting one or more contiguous verse segments shows:
  - Save
  - Highlight
  - Copy
  - Share
  - Pray
  - Explore Context
- Long-press may be a shortcut but cannot be the only selection method.
- Copy/share includes reference, translation, and required attribution.
- Sharing bilingual content asks whether to include primary, secondary, or both translations.
- Share cards use a controlled Manna gradient and typography; no unlicensed photography.

### Bilingual reading

- Phones: interleaved passage blocks.
- Tablets and landscape: optional parallel columns.
- Preserve the anchored passage when switching translations.
- Never align rows solely by verse number.
- Display concise labels for:
  - Merged verses
  - Split verses
  - Alternate numbering
  - Missing/omitted segments
- If a secondary translation is unavailable, show its name, download size, and status. Never silently substitute a different edition.
- Primary translation, secondary translation, and UI language are independent settings.

### Search

#### Free search

- English and Spanish book-name and abbreviation parser
- Accent-insensitive keyword search
- Exact reference lookup
- Filters by translation, testament, and book
- Bilingual mode searches both installed translations and groups aligned results
- Every result links to chapter context

#### Plus semantic search

“Ask Scripture” returns three to five contextual passage results with:

- Exact local Scripture
- Reference and translation
- A short relevance explanation
- `Read in context`
- No open-ended chatbot response

### Pray

Top-level choices:

- Guided Prayer
- Prayer Library
- Private Journal
- AI Prayer Draft

Guided Prayer:

1. Optional arrival/silence
2. Adoration
3. Confession
4. Thanksgiving
5. Supplication
6. Optional closing silence

Each stage can be skipped, paused, or exited. Optional breathing animation becomes a static timer when Reduce Motion is enabled.

Private Journal:

- Label: `Private — stored only on this device`
- Encrypted autosave
- Optional biometric lock and auto-lock
- App-switcher snapshot redaction
- Encrypted Recently Deleted for 30 days
- `Still praying`, `Changed`, `Answered`, and `Archived` are user-controlled statuses
- Manna never infers whether or how God answered
- User can delete immediately or restore within the 30-day window

Before sending prayer text to AI:

- Show the exact text and structured themes that will leave the device
- Offer `Use topic only`
- Keep theme context off by default for each request until the user explicitly remembers the preference
- Explain the processor and retention behavior
- Require AI consent and 13+ confirmation

AI prayers are editable drafts. They are never inserted automatically into the journal.

### AI explanation

`Explore context` produces a validated result with:

1. **What the passage says**
2. **In this passage**
3. **Christian perspectives**
4. **Reflection and prayer**

Historical-cultural information appears only when supported by a separately licensed and reviewed source. Otherwise, omit that section.

- Label the result `AI-assisted commentary`.
- Load every displayed Scripture quotation from the local canonical corpus.
- Validate the complete response before display.
- Do not stream unvalidated model prose.
- Show cited passages as tappable links.
- Provide `Useful / Not useful`.
- Report categories:
  - Inaccurate
  - Unclear
  - Biased
  - Unsafe
  - Wrong translation
  - Broken citation
- Free-text reporting is transmitted only after a separate confirmation.

### Paywall and purchases

The paywall appears only after an intentional AI request.

Required states:

- Products loading
- Products unavailable
- Trial eligible/ineligible
- Purchase pending
- Ask to Buy
- User canceled
- Purchase failed
- Purchase successful
- Restore found
- Restore not found
- Billing retry
- Grace period
- Entitlement revoked
- Offline

Dismissal returns to useful free context. A successful purchase resumes the exact interrupted request.

Before purchase, show:

- Monthly and annual options
- Localized total price and period
- Trial eligibility and exact post-trial charge
- Auto-renewal
- Cancellation path
- Terms
- Privacy
- Restore Purchases
- Fair-use summary

Do not use fabricated testimonials or disguise subscription terms behind “Unlock.”

### Settings

Sections:

- Reading and typography
- UI language
- Primary/secondary translations
- Personalization themes
- Notifications and privacy preview
- Journal security
- Manna Plus and Restore Purchases
- AI consent and data controls
- **AI provider (BYOK)** — visible only when `EXPO_PUBLIC_ENABLE_BYOK=true`; OpenRouter key and model picker live in `@manna/ai-byok`
- Export local data
- Delete local data
- Delete cloud AI identity/metadata
- Manage subscription
- Scripture licenses and attribution
- Privacy, Terms, Support, and Report a Problem

Subscription cancellation and cloud-data deletion are separate actions and must be explained distinctly.

### Notifications

- Local notifications only in v1.
- Ask permission only after the user configures a reminder.
- Show an in-app privacy preview before the OS prompt.
- Default copy: `Your Manna passage is ready.`
- Passage preview requires a separate opt-in.
- Never include name, mood, grief, anxiety, prayer topic, or personalization reason.
- Permit at most two user-scheduled notifications per day.
- Separate passage and prayer controls.
- Support selected days, local time, quiet hours, and preview privacy.
- No automatic re-engagement notifications.
- Generate a 30-day passage timeline but schedule only 14 days at once.
- Rebuild schedules after reboot/foreground, timezone/DST, language, translation, or preference changes.
- Permission denial preserves the intended schedule and offers direct Settings instructions.

### Widgets

iOS:

- Official `expo-widgets`
- Small, medium, accessory rectangular, and accessory inline families
- App Group shared payload
- Thirty-day local timeline
- Deep link to the exact passage
- Fresh, locally scheduled, stale-but-valid, privacy, unavailable-translation, updating, and deep-link-failure states
- Never blank
- Never show AI paraphrases or sensitive personalization labels

Android:

- Dedicated Kotlin/Glance Expo module
- Resizable layouts
- Shared minimal widget storage
- WorkManager opportunistic refresh
- Do not request exact-alarm permission

Background work is inexact and must never be required for daily correctness. ([Expo BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/), [Expo Widgets](https://docs.expo.dev/versions/latest/sdk/widgets/))

### Visual system

Baseline semantic colors:

- Light background: `#F8F4ED`
- Light surface: `#FFFDF8`
- Light primary text: `#2C1810`
- Light secondary text: `#6B554A`
- Light interactive blue: `#2F5597`
- Light accent: `#8A681A`
- Dark background: `#0F1220`
- Dark surface: `#1A1F35`
- Dark primary text: `#F5F0E8`
- Dark secondary text: `#BCC1D0`
- Dark interactive blue: `#9CB7FF`
- Dark accent: `#E8C56A`

All final tokens require WCAG 2.2 AA validation. Gold may not be used for small text unless the specific pairing passes.

Rules:

- Opaque Scripture surfaces
- Glass only for navigation and lightweight overlays
- `expo-glass-effect` only as progressive iOS 26 enhancement with opaque fallbacks. ([Expo GlassEffect](https://docs.expo.dev/versions/latest/sdk/glass-effect/))
- No runtime Unsplash dependency
- Owned/licensed images only
- Restrained 180–400 ms motion
- No mood-driven palette changes
- No information conveyed only through color, emoji, gesture, haptic, or animation
- 44-point iOS / 48-dp Android targets
- Dynamic Type up to 200%
- VoiceOver, TalkBack, Switch Control, keyboard, Reduce Motion, and Reduce Transparency support
- Constrained tablet line width
- Dedicated compact phone, large phone, tablet, and 320-point stress layouts

### Figma authority

Use the installed Figma integration. Required pages:

1. Product Constitution
2. Foundations
3. Components
4. Journeys
5. Responsive Screens
6. Interactive Prototypes
7. Content and Safety
8. Research
9. Developer Handoff

Every component includes English/Spanish, light/dark, text-scale, focus, pressed, selected, disabled, loading, error, Reduce Motion, and Reduce Transparency states.

No feature begins from loose screenshots. Feature implementation starts only after its journey passes product, bilingual, accessibility, theological, and engineering review.

---

## 4. Scripture, Editorial, and Theological Governance

### Corpus decisions

#### Alpha

- Berean Standard Bible
- Reina-Valera 1909
- Pinned USFM archives
- No third-party prebuilt SQLite file

#### English public release

Use BSB. Its publisher states that the text is in the public domain and does not require licensing. ([BSB licensing](https://berean.bible/licensing.htm))

#### Spanish public-release target

Use Biblica Open Nueva Biblia Viva only after written clearance explicitly covers:

- US commercial distribution
- Offline full-text app bundling
- App Store/Play DRM
- CC BY-SA obligations
- Trademark usage
- Headings and footnotes
- Embedding generation
- AI retrieval and contextual generation
- Attribution placement
- Future corpus updates

The published terms are CC BY-SA and contain attribution/trademark requirements; do not infer that this automatically settles App Store DRM or AI use. ([ONBV terms](https://ebible.org/spaonbv/copyright.htm))

#### Spanish fallback

- RV1909 labeled `Clásica`
- Territory-aware legal review still required
- Two native-Spanish Scripture reviewers must approve usability and fidelity
- If either modern Spanish clearance or RV1909 editorial approval fails, Spanish public release is blocked rather than silently shipping a poor translation

RV1909 is currently identified as public domain by eBible. ([RV1909 source](https://ebible.org/details.php?all=1&id=spaRV1909))

#### Exclusions

- KJV is not the default because of archaic readability and UK distribution restrictions.
- Do not ship active-draft Spanish translations as authoritative GA text.
- Do not assume illustrations, audio, cross-references, footnotes, headings, or topical data inherit the Scripture text’s license.
- An API or repository software license does not grant rights to every translation it serves.

### Rights ledger

Track separately for each content source:

- Text
- Translation name and trademark
- Headings
- Footnotes
- Cross-references
- Topical tags
- Commentary/reference notes
- Source packaging
- Offline redistribution
- Commercial use
- Store DRM
- Derivative works
- Embeddings
- AI retrieval and generation
- Attribution
- Territory
- Effective dates
- Revocation/termination provisions

No content enters a shipping build until every relevant field is green.

### Corpus pipeline

1. Download only allowlisted pinned source URLs.
2. Preserve the untouched archive in controlled content storage.
3. Verify SHA-256 before parsing.
4. Parse with a pinned USFM grammar.
5. Retain raw provenance and unsupported-marker reports.
6. Validate the 66-book inventory, chapters, source verse labels, Unicode, duplicates, omissions, and unsupported structures.
7. Normalize without rewriting Scripture.
8. Preserve paragraphs, poetry, headings, footnotes, quotations, and source punctuation.
9. Build explicit English/Spanish alignment relationships:
   - `exact`
   - `merged`
   - `split`
   - `absent`
10. Import reviewed themes and contextual daily passages.
11. Generate SQLite, FTS5, integrity hashes, and per-book reports.
12. Spot-check samples from every book against source.
13. Generate:
   - `corpus-manifest.json`
   - License bundle
   - Attribution bundle
   - Corpus diff
   - Integrity report
   - Signed release artifact
14. Load the identical corpus version into server retrieval.
15. Fail AI closed when client and server corpus versions differ.

No live Bible API is a runtime source of canonical Scripture.

Corpus updates use signed manifests, storage checks, an atomic versioned-file swap, and rollback to the prior database. Never overwrite sacred text silently.

### Canonical model

Core identifiers contain:

- Canon ID
- Versification ID
- USFM book code
- Chapter
- Source verse label/span
- Translation ID
- Corpus version

Do not use localized strings such as `John 3:16` as primary keys.

### Editorial council

Before content freeze, appoint:

- At least one seminary-qualified English Scripture reviewer
- At least two native-Spanish Scripture reviewers
- At least two reviewers from different Protestant traditions
- One Spanish theological terminology editor
- One trauma-informed pastoral/safety reviewer
- One legal/content-rights owner

The council approves:

- Product content constitution
- Denominational-boundary style guide
- Translation suitability
- Topic mappings
- Daily candidates
- Curated notes
- Prayer library
- AI prompts and rubrics
- Safety responses
- Contested-topic policy

### Contested and sensitive topics

Create explicit guidance for:

- Salvation and sacraments
- Authorship and dating disputes
- Gender and sexuality
- Prophecy and end times
- Healing and spiritual warfare
- Hell and judgment
- Abuse and domestic violence
- Suicide and self-harm
- Grief, anxiety, psychosis, and scrupulosity
- Money and prosperity teaching
- Politics and nationalism
- Interfaith questions

When traditions differ, label the perspectives. Do not silently blend them.

Historical claims require source-level provenance. If a reviewed source is unavailable, the AI must limit itself to textual/literary context.

### Corrections and incidents

Users can report an explanation or citation.

- Critical Scripture corruption, fabricated quotation, or dangerous guidance:
  - Disable affected content/operation within four hours
  - Human review within 24 hours
- High-severity theological or translation defect:
  - Triage within one business day
  - Correction target within three business days
- Ordinary content issue:
  - Respond within 14 days

Maintain a versioned incident register, reviewer decision, affected corpus/model/prompt versions, correction, and rollback evidence.

---

## 5. Recommendation and AI Design

### Free recommendation engine

Use only reviewed contextual passage candidates.

Scoring inputs:

- Explicit user-selected themes
- Editorial theme relevance
- Prior `Helpful / Not for me today` feedback
- Context and book diversity
- Day/season modifiers
- Translation availability
- Thirty-day repetition exclusion

Seed deterministically with:

- Local installation ID
- Date
- Corpus version
- Algorithm version

If no themes exist, use a balanced editorial rotation. If exclusions empty the pool, relax the oldest history constraint without breaking passage context.

Reasons are enums rendered through reviewed localized templates. Never say “God chose this for you.”

### Plus AI operations

- `daily_reflection`
- `explain_passage`
- `search_scripture`
- `draft_prayer`

One authenticated endpoint:

`POST /v1/ai/run`

Pipeline:

1. Verify pseudonymous JWT, consent version, entitlement, operation availability, corpus version, and idempotency key.
2. Reserve maximum expected cost transactionally.
3. Run bilingual safety triage.
4. Retrieve complete passages/pericopes using hybrid FTS and pgvector.
5. For daily content, rerank reviewed candidates only.
6. Accept only explicitly submitted local themes or bounded user text.
7. Generate a schema-constrained response.
8. Validate schema, sections, citations, corpus version, safety, and prohibited-authority language.
9. Hydrate every Scripture quotation from the canonical corpus.
10. Settle actual token/cost usage.
11. Return the validated response or a typed non-AI fallback.

Do not accept from the client:

- `user_id`
- Model ID
- Entitlement tier
- Cost
- Canonical Scripture text
- Provider credentials

### Context and privacy

- Themes, searches, reading history, and prayer text remain local.
- The user sees and approves what is submitted.
- Cloud AI content exists only ephemerally in request memory.
- Do not store prompts, responses, queries, themes, prayer text, passage IDs linked to users, or journal content.
- AI usage metadata may store operation, status, latency, token/cost totals, and release versions for 30 days.
- Generic non-personalized passage explanations may be cached without user linkage.
- Production providers must contractually support appropriate no-training and minimum/zero-retention behavior.
- Google identifies political or religious beliefs as sensitive information; keep spiritual data local and use prominent disclosure for optional AI transmission. ([Google Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en))

### Model selection

**Locked for Manna Plus (v1 launch):** `gemini-2.5-flash-lite` via server-held keys (OpenRouter adapter). Do not substitute without ADR, full eval rerun, and unit-economics proof (p95 COGS ≤ $0.30, ≥50% contribution margin at $4.99/mo after 30% store fee).

Do not hard-code other model names from the research briefs.

For generation, embeddings, and safety classification:

1. Benchmark current candidates.
2. Exclude providers failing privacy, retention, availability, or contractual requirements.
3. Run the complete bilingual evaluation suite.
4. Choose the least expensive model/version passing every threshold.
5. Freeze provider, model, prompt, schema, embedding, and safety versions in a signed release record.
6. Rerun all evaluations before any change.
7. Use fallbacks only if they passed the same suite.

No raw token streaming in v1.

### Evaluation suite

At least 600 balanced English/Spanish cases covering:

- Reference and semantic retrieval
- Passage explanations
- Bilingual alignment
- Prayer drafting
- Disputed doctrine
- Prompt injection
- Fabricated quotations
- Incorrect references
- Spiritual-authority language
- Suicide/self-harm
- Abuse
- Psychosis and scrupulosity
- Medical/legal requests
- Provider timeout/failure
- Corpus mismatch
- Cost ceilings

Release gates:

- 100% citation resolution
- 100% exact Scripture quotations
- At least 90% Recall@5 in each language
- At least 95% theological/editorial human approval
- At least 99.5% schema validity after one bounded retry
- No more than five percentage points English/Spanish disparity
- Zero critical safety failures
- p95 semantic-search result within four seconds
- p95 explanation within seven seconds
- p95 prayer draft within eight seconds

### Safety rules

AI must never:

- Claim to be God, Jesus, the Holy Spirit, clergy, a prophet, or therapist
- Say God personally selected a passage
- Deliver individualized prophecy or divine commands
- Guarantee healing, salvation, punishment, or relationship outcomes
- Diagnose mental or physical illness
- Attribute suffering to insufficient faith
- Replace emergency, medical, legal, or pastoral help
- State one disputed Christian interpretation as universally settled

Crisis-sensitive input interrupts ordinary generation with a professionally reviewed English/Spanish safety response and relevant human resources. Preserve unsent local drafts and allow the user to return to Scripture.

---

## 6. Engineering Architecture

### Exact foundation

- Private standalone Git repository
- Node 24 LTS, exact current patch pinned
- pnpm 11, exact current patch pinned
- Turborepo current stable
- Expo SDK 57
- Matching React Native/React/TypeScript versions from the stable Expo template
- Strict TypeScript
- No canary or beta production dependencies
- Expo Router stable stacks/tabs
- Continuous Native Generation and development builds
- EAS Build
- Supabase PostgreSQL, Auth, Edge Functions, and pgvector
- RevenueCat
- OpenRouter as the initial server adapter, behind a provider-neutral interface
- `expo-sqlite` with FTS5, SQLCipher, and `sqlite-vec` enabled. Expo officially supports all three through its config plugin. ([Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/))
- `react-i18next` and `expo-localization`
- TanStack Query for remote request state
- Zustand only for ephemeral view state
- Zod shared contracts
- Reanimated and Gesture Handler
- Expo Notifications and BackgroundTask
- Expo Widgets on iOS
- Custom Glance Expo module on Android
- RevenueCat React Native SDK
- Jest/React Native Testing Library
- Vitest for pure packages
- Deno tests for Edge Functions
- pgTAP for RLS
- Maestro for E2E
- Sentry only after privacy configuration and consent

Do not add:

- OneSignal
- Firebase
- A second backend
- A second billing authority
- NativeWind/shadcn as an unreviewed UI dependency
- An unstable navigation API
- Runtime Bible APIs
- Client-side Plus API keys

### Repository layout

```text
apps/
  mobile-store/

packages/
  domain/
  contracts/
  scripture/
  recommendation/
  ai-policy/
  ai-byok/
  ui/
  test-fixtures/

tooling/
  corpus/

supabase/
  migrations/
  functions/
  tests/

content/
  manifests/
  licenses/

docs/
  decisions/
  product/
  editorial/
  threat-model/
  runbooks/
```

After public GA, add `apps/mobile-byok/` as a physically separate dependency graph.

### Local databases

#### Immutable `scripture.db`

- `corpus_metadata`
- `translations`
- `books`
- `chapters`
- `content_blocks`
- `verse_segments`
- `footnotes`
- `alignment_segments`
- `topics`
- `passage_topics`
- `daily_candidates`
- `curated_notes`
- `prayer_library`
- FTS5 external-content search table
- Per-book/per-chapter integrity hashes
- Optional precomputed vector table for the later BYOK product

FTS tokenizer: `unicode61 remove_diacritics=2`.

#### Encrypted `user.db`

Encrypt the entire mutable database with SQLCipher.

- `settings`
- `profile_themes`
- `reading_progress`
- `bookmarks`
- `highlights`
- `collections`
- `collection_items`
- `passage_feedback`
- `shown_history`
- `daily_timeline`
- `notification_schedules`
- `widget_state`
- `prayer_journal`
- `saved_insights`
- `ai_response_cache`
- `recently_deleted`
- `device_state`
- `schema_migrations`

No v1 sync tables are required.

Cryptography:

- Generate a random 256-bit database key.
- Store it with device-only SecureStore accessibility.
- Exclude the encrypted database and key from OS backup.
- Encrypt WAL/journal data through SQLCipher.
- Never print the key in logs or crash breadcrumbs.
- Key rotation creates a new encrypted database, copies transactionally, verifies invariants, then deletes the old copy.
- Before migration, create an encrypted local last-known-good snapshot.
- Never automatically wipe a corrupt database.
- Reinstall/key loss means local spiritual content is unrecoverable unless the user created an export; explain this plainly.
- Manual `.manna-export` uses an Argon2id-derived user passphrase key plus AES-256-GCM, versioned manifest, checksums, and explicit category selection.
- Prayer/journal content is excluded from export by default.
- Import validates schema, checksums, and available storage before an atomic merge.
- Optional biometric journal lock protects UI access without becoming the database’s only key source.

Widgets receive only a minimal separate payload containing the user-authorized Scripture excerpt, date, translation, and deep link. Journal, themes, and feedback never enter widget storage.

### Minimal cloud schema

- `entitlements`
- `revenuecat_events`
- `ai_budget_reservations`
- `ai_usage_daily`
- `ai_global_budget`
- `corpus_releases`
- `model_releases`
- `prompt_releases`
- `remote_kill_switches`
- `generic_ai_cache`
- `consent_versions`
- Optional allowlisted `product_events`

Do not create cloud tables for:

- Prayer journals
- Reading history
- Search history
- Highlights/bookmarks
- Collections
- Spiritual themes
- Life situations
- Raw AI requests/responses

Every public table has RLS. Entitlements, budgets, releases, and switches are service-role-only. ([Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security))

### Public contracts

Freeze in `@manna/contracts`:

- `CanonicalRef`
- `PassageId`
- `TranslationManifest`
- `CorpusManifest`
- `ScriptureRepository`
- `RecommendationEngine`
- `WidgetPayload`
- `LocalProfileSnapshot`
- `ConsentReceipt`
- `EntitlementSnapshot`
- `AiRequest`
- `AiResult`
- `SafetyDisposition`
- `ContentReport`

Contract compatibility supports the prior two mobile releases. Breaking changes require a new schema/API version.

### Billing identity

1. Free use creates no server identity.
2. Before first Plus purchase or Plus AI request, create an anonymous Supabase user.
3. Use that UUID as the RevenueCat App User ID.
4. Purchase with localized RevenueCat packages.
5. Call `POST /v1/entitlements/refresh`.
6. Backend queries current RevenueCat subscriber state and updates its server mirror.
7. AI authorization trusts the server mirror or a fresh server-side reconciliation.
8. Webhooks use a configured secret Authorization header, TLS, event deduplication, replay-safe processing, and subscriber-state reconciliation. Do not infer entitlement solely from webhook order. ([RevenueCat webhooks](https://www.revenuecat.com/docs/integrations/webhooks))
9. Restore Purchases runs before suggesting another purchase.
10. Reinstall creates a new anonymous identity and deliberately applies the configured RevenueCat restore/transfer policy.
11. Test store-account changes, duplicate aliases, transfer, refund, revocation, grace period, billing retry, and Ask to Buy.
12. Same-platform store restoration is supported; cross-platform subscription portability is not promised in v1.
13. Deleting the pseudonymous cloud identity does not cancel the store subscription.
14. Managing/canceling the subscription does not delete local content.

### Failure behavior

| Failure | Required behavior |
|---|---|
| Offline | Full free product works; Plus shows cached saved insight or free context |
| AI timeout/429 | One bounded retry using an approved fallback, then free path |
| Invalid AI schema/citation | Discard entire response; never show partial output |
| Corpus mismatch | Disable AI with update-required status; local reading remains |
| Supabase unavailable | Free product remains; Plus request explains temporary outage |
| RevenueCat lag | Refresh subscriber state; never trust client tier |
| Budget exhausted | Show reset time and free context |
| Notification permission denied | Preserve preference and explain Settings path |
| Background task skipped | Existing local schedule and widget timeline remain correct |
| Widget stale | Show last valid dated passage |
| Translation unavailable | Identify the missing edition; never substitute silently |
| Corrupt user database | Preserve file, attempt verified snapshot recovery, offer export/support |
| Lost encryption key | Explain local-data loss; never create a blank DB over evidence without consent |
| Unsafe input | Reviewed safety intervention and human resources |
| Content/license emergency | Disable affected AI/content pack and invoke rollback runbook |

### BYOK in the free store app (primary)

- Implemented only in package `@manna/ai-byok`; settings entry `apps/mobile-store/app/(settings)/ai-provider.tsx` imports that package **only** when `EXPO_PUBLIC_ENABLE_BYOK=true`
- User’s OpenRouter key stored only in SecureStore; never sent to Manna servers, logs, analytics, crash reports, or exports
- Direct requests from device to OpenRouter; user picks **any** model ID (blank default field, no preset list)
- Shared validators from `@manna/ai-policy` (same schema, quotation, citation, theological, and safety rules as Plus server path)
- Fall back to free local search when provider or key fails
- No links or calls to action for buying provider credits
- **Kill switch:** set `EXPO_PUBLIC_ENABLE_BYOK=false`, exclude `@manna/ai-byok` from the store Metro graph, rebuild. CI must fail if BYOK strings, OpenRouter URLs, or routes leak into production store artifacts when the flag is false (see ADR-0001)

### BYOK post-GA fallback product

If Apple/Google forbid in-app API keys after GA, extract the same `@manna/ai-byok` package into a separate direct Android application (separate package ID, signing key, EAS channel, privacy disclosure). Modular boundary makes migration cheap.

### Environments

- Local Supabase CLI
- Development/test stores
- Staging with separate Supabase, RevenueCat, EAS, corpus, and AI credentials
- Production with least-privilege secrets and protected deployment

EAS profiles:

- `development`
- `preview-store`
- `production-ios`
- `production-android`
- Later: `direct-byok-android`

Each environment uses separate identifiers, deep links, App Groups, credentials, data, and analytics.

### CI and migration gates

Every PR:

- Frozen install
- Format/lint
- Strict typecheck
- Unit/component/contract tests
- Local database migration tests from every supported schema
- Supabase reset, function tests, and pgTAP RLS tests
- Corpus fixture parsing, hash, fidelity, and FTS tests
- English/Spanish localization parity and pseudo-localization
- Maestro smoke flow
- Offline smoke flow
- Secret scanning
- Dependency/SBOM/license audit
- Production bundle inspection

Nightly/release:

- Full corpus ETL and diff
- Full bilingual AI evaluation
- Native iOS/Android builds
- Full Maestro matrix
- RevenueCat sandbox lifecycle
- Physical-device notification/widget tests
- Performance and accessibility tests
- Network-capture/privacy declaration comparison

Migration policy:

- User DB: encrypted snapshot, transactional migration, invariants, rollback
- Scripture DB: immutable signed versioned swap
- Supabase: expand/backfill/contract; remain compatible with two prior mobile versions
- Edge/API releases deploy backward-compatible contracts before mobile
- EAS OTA runtime version includes native, local-schema, and corpus compatibility
- Never OTA a corpus, native extension, billing model, or incompatible database change

---

## 7. Privacy, Security, and Operations

### Data classification

| Data | Location | Off-device use | Retention |
|---|---|---|---|
| Scripture corpus | Device/server | Retrieval | Versioned release |
| Themes/preferences | Encrypted device | Optional ephemeral AI context | Until local deletion |
| Reading/search history | Encrypted device | None | Until local deletion |
| Highlights/collections | Encrypted device | None | Until local deletion |
| Prayer/journal text | Encrypted device | Explicit ephemeral AI request only | Until deletion |
| AI request content | Request memory | Provider processing | Not stored by Manna |
| AI usage metadata | Server | Cost/security | 30 days |
| Purchase/entitlement | Store, RevenueCat, server mirror | Billing authorization | Legal/operational schedule |
| Product telemetry | Optional, allowlisted | First-party product analysis | Maximum 13 months |
| Crash diagnostics | Opt-in, scrubbed | Reliability | Shortest practical period |

### Privacy rules

- No ads or tracking.
- Do not include an ATT prompt unless the product later introduces actual cross-app/web tracking.
- First-party telemetry is opt-in.
- Never emit prayer text, queries, themes, passage IDs, personalization reasons, or keys.
- Sentry:
  - Default PII off
  - `beforeSend` redaction
  - Text-input breadcrumbs off
  - Request bodies off
  - Only request IDs, error classes, and version tags
- Provide a provider/subprocessor inventory.
- Complete a DPIA-style review of religious, prayer, mental-health, and teen data.
- AI disclosure appears immediately before the first request.
- App privacy policy, App Store privacy labels, Google Data Safety, privacy manifests, SDK behavior, and audited network traffic must agree.
- Every app/extension/SDK bundle receives the required privacy manifest declarations.
- Build with Xcode 26+ and current required platform SDKs. ([Apple requirements](https://developer.apple.com/news/upcoming-requirements/))
- Complete Google Play’s Data Safety form even if most data remains local. ([Google Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en))

### Threat model

Cover:

- Lost or stolen device
- Malicious/repackaged client
- Entitlement forgery
- RevenueCat webhook replay
- Cross-user RLS access
- Prompt injection
- Scripture/corpus tampering
- Model/provider compromise
- BYOK key disclosure
- Log/analytics leakage
- Corrupt or interrupted migration
- Widget/App Group leakage
- Clipboard/share exposure
- Cost-exhaustion attacks
- Corpus/license revocation
- Supply-chain dependency compromise

### Operational controls

- AI operation kill switches
- Global AI spend breaker
- Model/prompt rollback
- Corpus rollback
- Entitlement refresh/reconciliation
- Dependency and secret rotation
- Encrypted migration recovery
- Support and content-report queue
- Public support page and status communication
- Incident runbooks

Incident levels:

- **SEV-0:** Scripture corruption, cross-user privacy leak, widespread entitlement fraud, dangerous AI guidance
- **SEV-1:** major crash, purchase failure, unusable reader, widespread corpus mismatch
- **SEV-2:** localized UI/widget/notification degradation
- **SEV-3:** ordinary defect/content correction

SEV-0 immediately disables the affected server operation or content release and triggers owner, engineering, privacy, editorial, and support response.

---

## 8. Multi-Agent Execution Program

### Operating model

Four total slots:

1. Root orchestrator/integrator
2. Implementation worker A
3. Implementation worker B
4. Independent review agent

The reviewer remains independent throughout. If three implementation workers are temporarily used, work pauses for an explicit review wave before merging.

Rules:

- Dedicated worktree and `codex/` branch per packet
- Explicit file and contract ownership
- No simultaneous edits to shared contracts, migrations, design tokens, or corpus manifests
- Workers submit:
  - Implementation
  - Tests
  - Evidence
  - Risks
  - Contract changes
  - Self-rating
- Reviewer provides independent findings and score.
- Below 8/10 cannot merge.
- Release-candidate packets require at least 9/10.
- P0/P1 findings block regardless of score.
- Root performs integration review and assigns remediation agents to specific defects.

### Phase 0 — Authority, business, and feasibility

**Indicative weeks 1–3**

Parallel wave A:

- Repository/toolchain/platform setup
- Product constitution, Figma foundations, and concept research

Parallel wave B:

- Scripture rights/editorial council/corpus spike
- Native feasibility: SQLCipher, FTS5, sqlite-vec, iOS widget, Android Glance

Parallel wave C:

- AI retrieval/safety/evaluation prototype
- Privacy, App Review, billing identity, economics, and threat model

Deliverables:

- Private standalone repository
- `PLAN.md`, `AGENTS.md`, ADR template, risk register
- Organization developer accounts, D-U-N-S, banking/tax agreements
- Support domain/email and privacy contact
- Name/trademark/store-name clearance
- Bundle/package ID owner decision
- Signing-key custody and recovery
- Encryption-export review
- Stable blank iOS and Android builds
- Physical-device widget proofs
- Encrypted DB create/migrate/corrupt/recover proof
- Corpus rights matrix
- AI golden-set baseline
- Figma low-fidelity prototype
- First usability round

Exit gate:

- No unresolved repository, toolchain, license, native-widget, cryptography, privacy, billing, or product-positioning blocker
- Reviewer score at least 9/10

### Phase 1 — Production-shaped vertical slice

**Indicative weeks 4–6**

Prove one complete flow:

Language onboarding → Today passage → bilingual reader → save/highlight → guided prayer → local reminder → iOS widget → validated Plus explanation → paywall → purchase/restore → return to the interrupted request.

Worker A:

- Mobile shell, design foundations, onboarding, Today, reader, local DB

Worker B:

- Corpus fixture, recommendation timeline, staging AI gateway, RevenueCat sandbox, widget transport

Reviewer:

- UX/accessibility, corpus fidelity, privacy/network, billing, failure behavior

Exit gate:

- Complete on physical iPhone and representative Android
- Works offline except AI/purchase
- No critical accessibility/privacy/content defect
- Purchase and restore pass
- Scripture/AI distinction understood by at least 95% of test users
- Reviewer score at least 9/10

### Phase 2 — Free core

**Indicative weeks 7–11**

Wave A:

- Full reader, search, bilingual alignment, highlights, collections, Library

Wave B:

- Today, deterministic recommendations, feedback, prayer library, encrypted journal

Wave C:

- Notifications, settings, iOS widgets, Android shell, translation management

Continuous review:

- Accessibility
- Spanish parity
- Offline
- Corrupt/low-storage/migration
- Performance

Exit gate:

- Entire free product completes in airplane mode
- Corpus integrity green
- No data loss
- All primary tasks meet UX thresholds
- No unresolved P0/P1 or relevant P2 finding

### Phase 3 — Manna Plus

**Indicative weeks 12–15**

Worker A:

- Hybrid retrieval, AI gateway, validators, safety, budgets, caches, kill switches

Worker B:

- RevenueCat lifecycle, paywall, pseudonymous identity, AI client states, reporting

Reviewer:

- Bilingual model evaluation
- Theological review
- Billing fraud/race conditions
- Provider chaos and cost load
- Privacy/network audit

Exit gate:

- All AI evaluation thresholds pass
- Purchase/restore/refund/revocation lifecycle passes
- COGS/margin gates pass
- No prompt/response retention
- Provider terms approved
- Reviewer score at least 9/10

### Phase 4 — iOS productization and beta

**Indicative weeks 16–19**

- Complete Figma/code parity review
- iPhone and iPad layouts
- VoiceOver, Switch Control, keyboard, Dynamic Type
- Performance and battery
- Privacy manifests and App Store labels
- Real localized screenshots
- Demo/reviewer state
- TestFlight internal and external cohorts
- English/Spanish editorial regression
- Support and incident drills

Exit gate:

- At least 40 balanced English/Spanish external testers
- No P0/P1
- No unresolved P2 accessibility, corpus, privacy, billing, security, or AI-grounding issue
- Crash-free sessions at least 99.8%
- Modern Spanish release gate satisfied
- App Review submission package complete

### Phase 5 — Initial US iOS release and Android parity

**Indicative weeks 20–23**

Initial App Store release cannot use phased rollout; phased release is for updates. Control risk through TestFlight, the US storefront restriction, tested kill switches, and manual release after all gates. ([Apple phased updates](https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases))

After at least 14 stable iOS GA days:

- Complete Android-specific visual adaptation
- Glance widgets
- TalkBack and font scaling
- Play Billing lifecycle
- Low/mid/high Android device testing
- Google closed testing
- Data Safety and metadata
- Spanish/English regression

Exit gate:

- Android free and Plus parity
- Closed-testing evidence green
- No iOS incident indicating a shared architectural defect
- Android reviewer score at least 9/10

### Phase 6 — Android US release and update operations

**Indicative weeks 24–26**

- Manual initial US release after closed testing
- Monitor crashes, billing, AI, widgets, and support
- Subsequent iOS updates use Apple’s 1%, 2%, 5%, 10%, 20%, 50%, 100% phased schedule
- Subsequent Android updates use Play staged rollout
- Expand countries only through a new rights/privacy/pricing/safety gate

### Phase 7 — Post-GA BYOK

Begin only after both public store products are stable.

- Separate direct Android application
- Separate package/signing/update channel
- OpenRouter direct key flow
- Local sqlite-vec semantic retrieval
- Separate security and support documentation
- Artifact isolation audit
- No public-store distribution without written policy clearance

---

## 9. Verification and Acceptance

### Automated testing

- Pure domain unit tests
- React Native component tests
- Zod contract/JSON Schema tests
- Corpus parser and round-trip fidelity tests
- Reference parser fixtures in English and Spanish
- Bilingual alignment fixtures
- FTS and diacritic tests
- Recommendation determinism/deduplication tests
- SQLCipher migration, corruption, key-loss, export/import tests
- Deno Edge Function tests
- pgTAP RLS/cross-user tests
- RevenueCat event-order/idempotency tests
- AI golden/adversarial evaluations
- Maestro core journeys
- Visual regression
- Artifact and dependency-graph scanning
- Secret/SBOM/license scanning
- OTA-channel compatibility tests

### Physical-device matrix

At minimum:

- Compact older iPhone on minimum supported iOS
- Current standard iPhone
- 6.9-inch iPhone
- 13-inch iPad with multitasking
- Low-memory Android on minimum supported API
- Current Pixel-class Android
- Current Samsung-class Android
- Android tablet

Test:

- English and Spanish
- Light/dark
- 200% text
- VoiceOver/TalkBack
- Reduced motion/transparency
- Offline/slow/interrupted network
- Low storage
- App termination/reboot
- Timezone/DST
- Notification denial/revocation
- Widget stale/update/deep link
- Purchase pending/refund/revocation
- Corpus and local-schema migrations

### UX research gates

Round 1:

- 12 moderated low-fidelity sessions
- Six English, six Spanish
- At least four users aged 55+

Round 2:

- 16 high-fidelity sessions
- Eight per language
- At least four assistive-technology users

Beta:

- At least 40 balanced English/Spanish physical-device testers

Required:

- Median first passage at most 45 seconds; p90 at most 90 seconds
- At least 90% unassisted completion of book/chapter lookup, language switch, save, and guided-prayer start
- At least 85% completion of onboarding, bilingual reading, journal, AI explanation, and purchase/restore without critical error
- English/Spanish task scores within five percentage points
- At least 95% correctly distinguish Scripture from AI/editorial text
- At least 90% understand subscription price, period, trial, cancellation, dismissal, and restore
- Reader comfort at least 4/5 for 80% after a 15-minute session
- Average Single Ease Question at least 6/7
- Beta UMUX-Lite at least 80
- Zero blocker accessibility findings

### Performance and reliability budgets

- p75 cold start below two seconds
- p95 warm chapter load below 150 ms
- p95 local search below 300 ms
- p95 local daily recommendation below 100 ms
- p95 semantic AI search below four seconds
- p95 explanation below seven seconds
- p95 prayer draft below eight seconds
- Initial download below 100 MB unless corpus quality requires an approved exception
- At least 99.8% crash-free sessions
- Widget always fresh or explicitly dated stale-valid; never blank
- Free journey works completely offline
- No silent data wipe after migration/corruption

### Store readiness

Apple:

- Xcode 26+ and required SDK
- 6.9-inch iPhone screenshots
- 13-inch iPad screenshots
- Actual localized UI
- No prices in description
- Privacy policy in-app and in App Store Connect
- Privacy manifest for app and widget extension
- Accurate nutrition labels
- No unnecessary ATT prompt
- Subscription terms and Restore
- Demo/reviewer access to Plus
- Detailed AI, billing, and non-obvious-feature notes

Google:

- Current target SDK
- Data Safety form
- Privacy policy
- Accurate billing disclosures
- Closed-testing evidence
- TalkBack and Android form-factor QA
- First Play / App Store submissions ship with `EXPO_PUBLIC_ENABLE_BYOK=false` (no BYOK module in the store graph). In-store BYOK is allowed later behind the compile-time kill switch (ADR-0001); if policy rejects it, flip the flag off, drop `@manna/ai-byok` from the Metro graph, rebuild, and resubmit — no external-payment path for Manna Plus (store billing only)

---

## 10. Metrics, Monitoring, and Expansion

### Product metrics

- Weekly meaningful Scripture sessions
- First-session activation
- Onboarding completion
- Read-in-context rate
- Prayer-session completion
- Helpful/not-helpful recommendation rate
- Search success
- Widget adoption
- Notification opt-in and disable rate
- English/Spanish parity
- Accessibility support contacts

### Trust metrics

- Citation failure rate
- Altered-quotation rate
- AI report rate by category
- Safety-intervention rate
- Content correction SLA
- Privacy consent withdrawal
- Notification complaint rate
- Refund and accidental-purchase rate

### Engineering/business metrics

- Crash-free sessions
- Local DB migration failures
- Corpus mismatch
- Widget freshness
- Entitlement reconciliation failures
- AI latency/schema/citation failures
- Cost by operation/model
- p50/p95 paid-user COGS
- Trial conversion
- Renewal/cancellation/refund
- Contribution margin
- Support contacts per 1,000 users

Do not interpret higher time-in-app as inherently positive.

Country expansion requires:

- Translation and trademark rights
- AI/embedding permission
- Privacy and teen-data review
- Crisis resources
- Local pricing/tax review
- Store policy review
- Spanish dialect/editorial review
- Support coverage
- Country-specific Terms/Privacy updates

---

## 11. Risk Register

| Risk | Owner | Mitigation and hard stop |
|---|---|---|
| Modern Spanish rights remain unclear | Rights owner | Written offline/commercial/AI/DRM clearance; otherwise approved RV1909 or block Spanish GA |
| Spanish translation feels archaic | Editorial/UX | Native-speaker long-session testing; block GA if quality fails |
| Bilingual versification corrupts alignment | Corpus owner | Explicit mapping, fixtures, per-book review; disable unresolved bilingual books |
| AI presents itself as divine authority | AI/editorial | Schema and language validators, human eval, kill switch; zero critical failures |
| Historical claims are fabricated | Editorial/AI | Reviewed provenance corpus only; omit historical section otherwise |
| Prayer or spiritual data leaks | Security/privacy | SQLCipher local-only storage, ephemeral AI, no content logs; release-blocking audit |
| User loses local data after reinstall | Product/security | Clear disclosure, encrypted export, verified import, future E2EE sync |
| RevenueCat races misgrant/deny access | Commerce | Stable pseudonymous ID, auth header, dedupe, subscriber reconciliation, lifecycle tests |
| AI cost exceeds margin | AI/platform | Per-operation limits, reservations, global breaker, cache, model release gates |
| Provider terms permit training/retention | Privacy/legal | Exclude provider regardless of price/performance |
| Widgets fail to update on time | Native | Thirty-day local timeline, stale-valid state, no exact-time promise |
| Android becomes an iOS visual port | UX/native | Android designs and Glance spike in Phase 0; Android-specific review |
| BYOK causes store rejection | Commerce/security | Flip `EXPO_PUBLIC_ENABLE_BYOK`, drop `@manna/ai-byok` from store graph, rebuild; post-GA separate Android app as fallback |
| App name conflicts | Owner/legal | Phase 0 clearance; stop branding work and request owner naming decision |
| Scope overwhelms polish | Orchestrator | Vertical slice first; enforce deferred list and gate every expansion |
| Agent changes shared contracts concurrently | Orchestrator/reviewer | File ownership, worktrees, serialized contract merges |
| Store privacy declarations diverge from behavior | Privacy/release | Runtime network audit compared to manifests, labels, policy, and SDK inventory |
| Initial release cannot be staged | Release owner | TestFlight/closed testing, US-only storefront, manual GA, kill switches |
| Corpus license is revoked or corrected | Rights/content | Versioned manifests, removal/rollback runbook, legal response |

---

## 11.5 Decision Log

| Date | ID | Decision | Authority |
|---|---|---|---|
| 2026-07-12 | D-0001 | Manna Plus pricing locked at **$4.99/mo** (`manna_plus_monthly`) and **$29.99/yr** (`manna_plus_annual`); 7-day trial on annual only | Owner / orchestration plan |
| 2026-07-12 | D-0002 | Plus AI generation locked to **Gemini 2.5 Flash-Lite** (`gemini-2.5-flash-lite`) until eval gate and ADR approve change | Owner / orchestration plan |
| 2026-07-12 | D-0003 | BYOK ships in the **same free store app** (OpenRouter, any model, blank default); kill switch via `EXPO_PUBLIC_ENABLE_BYOK` + `@manna/ai-byok` package boundary | ADR-0001 |
| 2026-07-12 | D-0004 | Patched `PLAN.md` supersedes conflicting research briefs; briefs are historical only | Document control §0 |

---

## 12. Assumptions and Quality Record

### Locked assumptions

- Manna is a new private standalone repository.
- Initial public market is the United States storefront.
- UI and content ship in English and Spanish together.
- V1 canon is 66-book broad Protestant.
- Free use requires no account or network.
- Spiritual content remains local in v1.
- Plus uses only pseudonymous entitlement and ephemeral AI context.
- Initial price is $4.99/month and $29.99/year, with annual-only seven-day trial.
- BYOK is in the free store app behind `EXPO_PUBLIC_ENABLE_BYOK` and `@manna/ai-byok`; separate direct Android app remains post-GA fallback if stores forbid in-app keys.
- No ads, tracking, OneSignal, external payments, or donation flow.
- The Figma integration is installed and is the visual source of truth.
- Store policies, SDK requirements, prices, provider terms, and translation rights are reverified at Phase 0 and before every submission.

### Planning-agent ratings

| Agent lane | Self/readiness score | Orchestrator rating | Notes |
|---|---:|---:|---|
| Research synthesis | 9.0 | 9.0 | Strong reconciliation of both briefs |
| Repository/architecture audit | 9.0 | 9.2 | Correctly identified the empty nested workspace and major trust risks |
| Bible rights/editorial research | 9.5 | 9.5 | Primary-source-backed; counsel remains final authority |
| First adversarial plan review | 8.6 readiness | 9.1 | Found BYOK, background, entitlement, and UX corrections |
| UX plan deepening | 9.6 | 9.6 | Comprehensive states, accessibility, bilingual, and Figma handoff |
| Architecture plan deepening | 9.5 | 8.8 | Strong blueprint; cloud sync and webhook-auth assumptions required correction |
| Comprehensive adversarial review | 7.8 prior readiness | 9.4 | Identified the final privacy, geography, initial-release, cryptography, and operational gaps |

After incorporating the review findings, this plan’s pre-implementation readiness is **9.2/10**. It is not a release score. Implementation readiness becomes confirmed only when Phase 0 produces evidence for Spanish rights, cryptography, physical widgets, business accounts, privacy, and the first bilingual usability round.
