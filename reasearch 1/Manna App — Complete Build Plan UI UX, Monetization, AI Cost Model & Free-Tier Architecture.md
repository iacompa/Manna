# Manna App — Complete Build Plan: UI/UX, Monetization, AI Cost Model & Free-Tier Architecture

## Executive Summary

This document is a step-by-step plan to build the Manna Bible app with a three-tier architecture: (1) a fully functional **free version with no AI**, (2) a **BYOK (Bring Your Own Key) tier** where technically inclined users connect their own API, and (3) a **paid "Manna Plus" subscription** where you handle the AI for the user. The goal is a minimum 50% profit margin on the paid tier, a world-class UI, and a free tier that is genuinely useful — not a crippled app that just nags users to pay.

***

## Part 1: The Three-Tier Product Strategy

The entire business logic of this app rests on one insight: **most Bible readers are not tech-savvy**, and they will happily pay a small monthly fee to not think about APIs. Your job is to make the paid tier so convenient and the free tier so genuinely good that no user ever feels cheated — but the AI experience is clearly better when paying.

### Tier Breakdown

| Feature | 🆓 Free (No AI) | 🔑 BYOK (Power User) | ✨ Manna Plus (Paid) |
|---|---|---|---|
| Full Bible (KJV + RV1909) | ✅ | ✅ | ✅ |
| Home screen widget (static daily verse) | ✅ | ✅ | ✅ |
| Daily verse (rule-based by topic/season) | ✅ | ✅ | ✅ |
| Prayer library (Biblical prayers) | ✅ | ✅ | ✅ |
| Verse highlights & saved collections | ✅ | ✅ | ✅ |
| Notifications (morning verse, prayer reminders) | ✅ | ✅ | ✅ |
| English + Spanish | ✅ | ✅ | ✅ |
| Offline reading | ✅ | ✅ | ✅ |
| Basic keyword search | ✅ | ✅ | ✅ |
| Personalized onboarding profile | ✅ (stored locally) | ✅ | ✅ |
| AI verse explanations (literal/esoteric/personal) | ❌ | ✅ (their API cost) | ✅ |
| AI-powered semantic verse search | ❌ | ✅ | ✅ |
| AI daily verse personalized to their spiritual journey | ❌ | ✅ | ✅ |
| AI-generated personal prayers | ❌ | ✅ | ✅ |
| Feedback loop (verse ratings improve recommendations) | Basic (local) | ✅ | ✅ |
| Dynamic widget (AI-personalized verse) | ❌ | ✅ | ✅ |
| Daily check-in with AI response | ❌ | ✅ | ✅ |
| Priority infrastructure, faster responses | ❌ | ❌ | ✅ |
| Premium widget styles | ❌ | ❌ | ✅ |
| Price | $0 | $0 (pay their own API) | $3.99–$4.99/month |

***

## Part 2: Free Tier Without AI — It Must Still Be Great

This is critical. The free version cannot feel broken or intentionally hobbled. Here is how to make it genuinely excellent without any AI calls.

### Rule-Based Verse Recommendation System (No AI Required)

Before AI was common, every Bible app used topic-tagged databases. You will build a pre-tagged verse library that powers the free tier:

**Step 1 — Tag every verse at build time.**
Use the `scrollmapper/bible_databases` SQLite file as your base. Then apply a pre-built topic tagging schema. There are several open-source tagged Bible verse datasets available:[^1]

- The **Open Bible Topical Index** (openbible.info) provides thousands of Bible references organized by topic
- The **Bible Topic Finder** format provides 700+ topics with verse lists (available in CSV/JSON from GitHub repos)
- Add custom tags: `mood_comfort`, `mood_anxiety`, `mood_joy`, `mood_grief`, `theme_purpose`, `theme_love`, `theme_faith`, `season_lent`, `season_advent`, `season_sunday`, `prayer_morning`, `prayer_evening`

**Step 2 — Map onboarding answers to topic tags.**
When the user says "I'm struggling with anxiety" → tag_weight `mood_anxiety: 1.0, theme_peace: 0.9`. When they say "I want to feel closer to God" → `theme_closeness: 1.0, theme_prayer: 0.8`. Store these weights locally in AsyncStorage — no server required.

**Step 3 — Daily verse selection algorithm (pure logic, no AI).**
```
function pickDailyVerse(userTags, shownVerseHistory, dayOfYear) {
  1. Filter verse DB to tags matching user's top 3 themes
  2. Remove verses shown in last 30 days (avoid repetition)
  3. Apply day-of-week weight (Sundays get worship/praise tags)
  4. Apply seasonal weight (Christmas/Easter/Lent boost relevant tags)
  5. Pick the top-scored verse using weighted random selection
  6. Log to local history
}
```

This produces a **different, relevant verse every day, forever**, with zero API calls.[^2]

**Step 4 — Static but meaningful widget.**
The free widget shows today's rule-selected verse. It's not AI-personalized, but it's thematically relevant and updates daily. Users who upgrade to Manna Plus see a widget with a short AI-generated note: *"This verse was chosen for you because you mentioned feeling distant from God last Tuesday."*

### What Free Users Get in the Bible Reader

The Bible reader is 100% free and full-featured. Every book, chapter, and verse. Bilingual side-by-side view. Highlights and bookmarks. Keyword search. When a free user taps a verse for explanation, instead of an AI response they see:

- A pre-written **cross-reference panel** (from scrollmapper's 400,000+ cross-reference links)[^1]
- A **single curated devotional note** (written once, for the most commonly tapped high-impact verses like John 3:16, Romans 8:28, Philippians 4:7)
- A **"Unlock AI explanations" banner** at the bottom — soft upsell, not aggressive

This creates a natural moment for conversion: the user is already engaged with a verse and wants to go deeper. That's the perfect time to ask.

***

## Part 3: AI Model Selection — Intelligence, Speed, Cost

After researching all major models available in mid-2026, here is the definitive recommendation for each use case in the app.

### Model Comparison (July 2026 Pricing via OpenRouter)

| Model | Input $/1M | Output $/1M | Intelligence | Speed | Best For |
|---|---|---|---|---|---|
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | Good | Very Fast | Bulk verse tagging, daily verse selection |
| **Gemini 2.5 Flash** | $0.30 | $2.50 | Very Good | Fast | Verse explanations, prayer generation |
| **GPT-4o-mini** | $0.15 | $0.60 | Good | Fast | General fallback |
| **Llama 4 Scout** (free) | $0.00 | $0.00 | Good | Fast | Free tier fallback (if ever needed) |
| **DeepSeek V4 Flash** | $0.09 | $0.18 | Good | Fast | Ultra-cheap bulk operations |
| **Claude 3.5 Haiku** | $0.80 | $4.00 | Very Good | Medium | Deep theological reasoning |
| **GPT-4o** | $2.50 | $10.00 | Excellent | Medium | Not recommended (too expensive) |

[^3][^4]

### The Recommended AI Stack: "Smart Routing"

Do NOT use one model for everything. Route calls by task:

**Tier 1 — Ultra-cheap, high-volume** (Gemini 2.5 Flash-Lite, $0.10/$0.40):
- Daily verse selection logic assist (called once/day per user)
- Processing daily check-in mood responses
- Generating widget text (short, 1-2 sentences)
- Tagging new user-submitted prayer topics

**Tier 2 — Mid-tier, balanced** (Gemini 2.5 Flash, $0.30/$2.50 — your PRIMARY model):
- Verse explanations (literal, historical, esoteric, personal)
- AI-generated personal prayers
- Semantic search understanding
- "Why this verse for you" explanations

**Tier 3 — Reserve** (Claude 3.5 Haiku, $0.80/$4.00):
- Theological deep-dives when user asks complex doctrinal questions
- Long-form Bible passage explanations
- Only triggered when complexity is detected

**Why Gemini 2.5 Flash is the primary model:** As of July 2026, it costs $0.30/M input and $2.50/M output, offers a 1M-token context window (enough for the entire Bible in one call), scores well on theological reasoning, and is fast enough for a mobile app. Its context caching price is only $0.03/1M cached tokens, which matters because your system prompt (containing user profile + recent verse history) is the same for many calls — you cache it and pay almost nothing for repeated inclusion.[^5][^3]

### Route all AI through OpenRouter

Use OpenRouter as the unified AI gateway. Benefits:[^6]
- One API, 400+ models — swap models without changing code[^6]
- BYOK support: users can connect their own OpenAI/Anthropic/Google keys[^7]
- No markup on provider pricing[^6]
- Fallback routing: if Gemini is down, auto-route to GPT-4o-mini[^6]
- 5.5% platform fee on pay-as-you-go[^6]

***

## Part 4: Monetization Math — Engineering a 50%+ Profit Margin

This section calculates what you need to charge, what it costs you, and what your margin will be.

### Per-User AI Cost Estimation (Manna Plus subscriber)

A typical engaged Manna Plus user per month:

| Action | Frequency | Avg tokens (in+out) | Model | Cost/action | Monthly Cost |
|---|---|---|---|---|---|
| Daily verse selection | 30/month | ~500 in, 200 out | Gemini 2.5 Flash-Lite | $0.000130 | $0.004 |
| Daily check-in processing | 20/month | ~300 in, 150 out | Gemini 2.5 Flash-Lite | $0.000090 | $0.002 |
| Widget text generation | 30/month | ~400 in, 100 out | Gemini 2.5 Flash-Lite | $0.000080 | $0.002 |
| Verse explanations | 15/month | ~800 in, 500 out | Gemini 2.5 Flash | $0.001490 | $0.022 |
| AI prayer generation | 5/month | ~600 in, 400 out | Gemini 2.5 Flash | $0.001180 | $0.006 |
| Semantic search | 10/month | ~400 in, 200 out | Gemini 2.5 Flash | $0.000620 | $0.006 |
| Deep theological Q&A | 2/month | ~1200 in, 800 out | Claude 3.5 Haiku | $0.004160 | $0.008 |
| **Total AI cost per user/month** | | | | | **~$0.050** |

**Conservative estimate (heavy user): ~$0.10–$0.15/month in AI costs.** Even doubling this for overhead, you're at $0.20–$0.30/month in AI costs per paid user.

### Revenue Model

**Subscription Price: $4.99/month**

| Revenue Layer | Per User/Month | Notes |
|---|---|---|
| Gross subscription revenue | $4.99 | User pays this |
| Apple/Google store cut (Year 1) | -$1.50 | 30% of $4.99[^8] |
| Apple/Google store cut (Year 2+) | -$0.75 | 15% after 12 months[^8] |
| OpenRouter platform fee (5.5%) | -$0.02 | 5.5% of ~$0.05 AI cost[^6] |
| AI cost (conservative heavy user) | -$0.20 | Gemini Flash-Lite + Flash + Haiku blend |
| Supabase (backend infra, 1,000 users) | -$0.03 | ~$25/mo Supabase Pro split across users |
| **Net margin Year 1** | **$3.24** | **64.9% margin** ✅ |
| **Net margin Year 2+** | **$3.99** | **79.9% margin** ✅ |

**These margins exceed 50% even in Year 1.** And they improve significantly after users pass the 12-month mark when app store fees drop from 30% to 15%.[^8]

### Annual Subscription Option

Offer $29.99/year ($2.50/month effective):
- No monthly app store billing friction
- Locks users in for a full year (dramatically better retention)
- Better margin because the 30%→15% store fee reduction kicks in faster
- Users love the ~50% discount vs monthly

### Hallow Benchmark Validation

Hallow, the #1 Catholic prayer app, charges $9.99/month or $69.99/year and now generates **$8M+ in monthly revenue** with 2M+ monthly downloads. They reached #1 globally in March 2026. Your app targets a broader Protestant + Catholic + Spanish-speaking audience at a lower price point ($4.99), which lowers conversion friction while still producing excellent margins.[^9][^10]

### BYOK Tier Economics

For BYOK users:
- They pay zero to you
- They pay their AI provider directly (OpenAI, Anthropic, Google via their own keys)[^7]
- You pay: Supabase backend (~$0.03/user/month), OpenRouter 5% BYOK fee[^7]
- Net cost to you per BYOK user: ~$0.05/month
- Revenue from BYOK user: $0

**BYOK users are not loss leaders — they're marketing.** They are the tech-savvy early adopters who will review the app, post on forums, recommend it to churches, and evangelize the product for free. Keep them happy. They represent <5% of your user base but 30%+ of your organic growth.

***

## Part 5: UI/UX Design Plan — World-Class Spiritual Aesthetic

### Design Philosophy: "Sacred Clarity"

The guiding principle is that this app should feel like **entering a quiet chapel** — not a social media feed, not a productivity tool. Every design decision should ask: *does this feel peaceful and reverential?*

Current 2026 mobile design trends that apply perfectly to this app:
- **Liquid Glass / Glassmorphism**: Apple's iOS 26 introduced native Liquid Glass, and Expo now has a dedicated `expo-glass-effect` SDK for it. Your app should use this for cards, modals, and the navigation bar — it creates a luminous, ethereal feel that perfectly matches the spiritual aesthetic.[^11][^12][^13]
- **Low-stimulus / Calm interfaces**: 2026 design is moving away from aggressive animations and bright contrasts toward calm, contemplative UI. Perfect for a Bible app.[^14]
- **Bottom navigation with gesture dismissal**[^15]
- **Bento grid layouts** for the home screen[^16]
- **Emotionally intelligent design** — UI responds to the user's mood (darker palette when they report feeling low; warmer/brighter when they report feeling good)[^17]

### Color System: "Candlelight"

Build two palettes — Light and Dark — that are both used actively (not just "dark mode is a dark version of light"):

**Light Mode — "Illuminated Parchment"**
- Background: `#F8F4ED` (warm cream, like aged paper)
- Surface: `#FFFFFF` with 60% opacity glass effect
- Primary text: `#2C1810` (deep warm brown, easier on eyes than pure black)
- Secondary text: `#7A6155`
- Accent / Gold: `#C9A84C` (warm gold)
- Accent 2 / Blue: `#3B5998` (deep scripture blue)
- Verse cards background: nature photography (sunrise, mountains, water, forest)

**Dark Mode — "Evening Prayer"**
- Background: `#0F1220` (near-black with a hint of navy, like night sky)
- Surface: `#1A1F35` with glass effect
- Primary text: `#F5F0E8` (soft cream)
- Secondary text: `#9DA3B4`
- Accent / Gold: `#E8C56A`
- Verse cards: same nature photos, darker filter overlay

**The palette transitions between modes using `react-native-reanimated` smooth interpolation — never a jarring flash.**

### Typography

| Usage | Font | Why |
|---|---|---|
| Bible verse text | EB Garamond (Google Fonts, free) | Serif; feels like holding a Bible |
| Headings | Cormorant Garamond Bold | Elegant, spiritual, old-world |
| Body / UI labels | Inter | Clean, modern, readable at small sizes |
| Spanish text | Same fonts — both handle Latin characters perfectly |

Load fonts via `expo-font`. All three fonts are free and open-source.

### Screen-by-Screen Design Specs

#### Onboarding (7 Screens)
- Full-bleed nature photography backgrounds (royalty-free from Unsplash API)
- Questions appear as gentle fade-ins, one at a time
- Progress indicated by a thin gold line at the top (not a numbered stepper)
- Answers use large tap targets (64px minimum) — important for all ages
- Final screen: verse card reveals with a soft glow animation, gold line completes
- Language picker: visible on Screen 1 as a small toggle (🇺🇸 EN / 🇪🇸 ES) — no full page

#### Home Tab
- Top: Time-appropriate greeting ("Good morning, [Name] 🌅") in Cormorant Garamond
- Hero card: Today's verse in a full-width card with blurred nature photo background
  - Liquid glass overlay containing verse text (EB Garamond, 20pt) and reference
  - Below: "Why this verse for you" button (Manna Plus only; grayed out with lock icon for free users)
  - Rating row: 4 emoji buttons (🙏 💛 😐 ❌) with haptic feedback on tap
- Below hero: Bento grid with:
  - Small tile: "Continue reading" (last open Bible book/chapter)
  - Small tile: "Pray" (one tap to open prayer mode)
  - Small tile: "Your saved verses" (count badge)
  - Small tile: "Explore topics"
- Bottom section: "Today's prayer" — a Biblical prayer relevant to the day

#### Bible Reader
- Clean serif text, generous line height (1.7x)
- Floating chapter controls — previous/next chapters as Liquid Glass pills at screen bottom
- Tap any verse → bottom sheet rises with:
  - **Free users**: Cross-references + one pre-written devotional note
  - **Manna Plus**: 4 tabbed explanations (Literal / Historical / Spiritual / Personal)
- Long-press any verse → context menu: Highlight (5 color options) / Copy / Share / Pray on this
- Bilingual toggle: slides the Spanish text in from the right using a smooth 300ms animation
- Book/chapter navigation: a swipeable bottom drawer (not a separate screen)

#### Prayer Tab
- Background: full-bleed candle or window-light photo
- Liquid glass card containing "Begin Prayer" button
- Guided prayer flow uses a step-indicator (5 dots representing ACTS: Adoration, Confession, Thanksgiving, Supplication, Silence)
- Each step fades in with a breathing animation — 4-second inhale, 4-second hold, 4-second exhale visual cue
- "Write my prayer" input: Manna Plus / BYOK only; free users see a soft upsell

#### Widget Design
- Small (2×2): verse text + reference on gradient background
- Medium (4×2): verse + reference + app name + "Tap to open"
- Background: automatically cycles through 30 pre-selected nature photos
- Free tier: same verse for all free users (daily rule-selected verse)
- Manna Plus: personalized verse with subtle gold "★ For you" indicator

### Micro-Interactions & Animations

These are the details that make an app feel premium:

- **Verse card entrance**: fade up + slight scale from 0.95 to 1.0, 400ms, ease-out
- **Rating tap**: emoji bounces (spring animation, 200ms) + haptic impact
- **Bible verse highlight**: gold color floods the verse text like ink spreading on parchment (500ms)
- **Prayer step transition**: cross-fade with breathing circle expanding and contracting
- **Navigation bar**: uses iOS 26 NativeTabs with `minimizeBehavior="onScrollDown"` — it hides as you read, maximizing reading area[^18]
- **Dark/light mode switch**: smooth 600ms palette interpolation
- **Liquid Glass cards**: shimmer effect on entrance (using `expo-glass-effect`)[^13]
- **Loading state**: a slow-pulsing gold cross icon instead of a spinner

Use `react-native-reanimated` v3 for all animations — it runs on the UI thread and never causes jank.[^19]

***

## Part 6: Technical Implementation — BYOK + Paid Tiers

### How BYOK Works In-App

When a user chooses the BYOK tier:

1. Settings screen shows: "Connect your AI" with a brief explanation: *"You'll need an OpenRouter account (free). Add your API key below and you'll have full AI features at your own cost — usually less than $1/month."*
2. User pastes their OpenRouter API key into a secure text field
3. App stores the key in `expo-secure-store` (encrypted, never leaves the device)
4. All AI calls are made client-side directly to OpenRouter using the user's key[^20]
5. App specifies the default model (`google/gemini-2.5-flash`) but lets BYOK users change it in settings (power user feature)
6. If the key is invalid or runs out of credits, the app shows a gentle error: "Your AI credits are low — tap here to add more or upgrade to Manna Plus"

**Important:** For BYOK users, calls go from the **device directly to OpenRouter** — there is zero cost to you. The user bears all AI costs through their own key. You only pay for Supabase backend calls.[^7]

### How Manna Plus AI Calls Work

For paying subscribers, all AI calls route through a **Supabase Edge Function** (your server-side proxy):

```
User device → Supabase Edge Function → OpenRouter → Gemini/Claude → Response → User
```

The Supabase Edge Function:
1. Verifies the user has an active Manna Plus subscription (checks Supabase DB)
2. Applies rate limiting (max 100 AI calls/day per user — prevents abuse)
3. Uses YOUR OpenRouter API key (stored as a Supabase secret, never exposed to client)
4. Routes to the appropriate model tier based on the request type
5. Logs usage for cost monitoring

### Subscription Management

Use **RevenueCat** (free up to $2,500 MRR, then 1% of revenue) as your subscription layer:
- Handles Apple App Store and Google Play subscriptions natively
- Provides a React Native SDK
- Manages free trials, upgrades, downgrades, and cancellations
- Provides a webhook to Supabase when subscription status changes
- Validates receipts server-side to prevent fraud

### Rate Limiting & Cost Protection

To ensure you never lose money on heavy users:

- Daily AI call cap per Manna Plus user: 100 calls/day (generous; average user uses ~10/day)
- Monthly token budget per user: $0.50 in AI costs (this gives you an absolute worst case — the math above shows average is $0.15/month)
- If a user approaches the cap, show a friendly message: "You've been really active today! 🙏 Your AI features will reset at midnight."
- Monitor costs daily with OpenRouter's usage dashboard and Supabase analytics

***

## Part 7: The Full Build Plan — Phase by Phase

### Phase 0: Setup (Week 1)
- [ ] Initialize Expo project (SDK 54+, TypeScript, Expo Router v6)
- [ ] Set up Supabase project — create all tables from Research Report Part 12
- [ ] Download KJV SQLite from scrollmapper/bible_databases and bundle in `/assets/bible/`[^1]
- [ ] Download Reina Valera 1909 from eBible.org and convert to SQLite, bundle[^21]
- [ ] Set up i18next with `/locales/en.json` and `/locales/es.json`
- [ ] Set up RevenueCat with Manna Plus monthly and annual products
- [ ] Create OpenRouter account and buy initial $20 in credits (pays for thousands of users' first month)
- [ ] Set up Expo EAS Build for iOS and Android CI/CD
- [ ] Install design dependencies: `expo-glass-effect`, `react-native-reanimated`, `expo-blur`, `expo-font` (EB Garamond, Cormorant Garamond, Inter)

### Phase 1: Free Core (Weeks 2–4)
- [ ] Build onboarding flow (7 screens, all animations)
- [ ] Build full Bible reader (SQLite queries, bilingual view, book/chapter navigation)
- [ ] Build topic tag system + rule-based daily verse algorithm
- [ ] Build verse highlights & saved collections (local AsyncStorage)
- [ ] Build biblical prayer library (Lord's Prayer, Psalm 23, ACTS structure, etc.)
- [ ] Build home screen with bento grid layout
- [ ] Build bottom tab navigation with NativeTabs (iOS 26 Liquid Glass) + Android fallback
- [ ] Implement push notifications (morning verse + prayer reminders)
- [ ] Implement dark mode with smooth palette transitions
- [ ] Submit TestFlight + Google Play beta

### Phase 2: AI Layer (Weeks 5–7)
- [ ] Build Supabase Edge Functions: `get-daily-verse`, `explain-verse`, `generate-prayer`, `semantic-search`
- [ ] Implement BYOK flow: secure key storage + client-side OpenRouter calls
- [ ] Implement Manna Plus AI calls via Supabase proxy
- [ ] Build RevenueCat paywall screen (shown when free user taps AI-gated feature)
- [ ] Build AI verse explanation UI (4-tab bottom sheet: Literal / Historical / Spiritual / Personal)
- [ ] Build AI prayer generator
- [ ] Build semantic search (Ask the Bible)
- [ ] Build daily check-in with AI response
- [ ] Implement verse feedback loop (ratings → stored → influence next day's AI call)
- [ ] Rate limiting middleware in Edge Functions

### Phase 3: Widgets (Weeks 8–9)
- [ ] iOS widget (WidgetKit via `react-native-widgetkit`): Small + Medium sizes
- [ ] Android widget (Glance API via Expo native module)
- [ ] Background task (runs at 6 AM): fetches/generates tomorrow's verse, writes to App Group container
- [ ] Free tier: rule-based verse in widget; Manna Plus: AI-personalized verse with "For you" badge
- [ ] Lock screen widget (iOS 16+)

### Phase 4: Polish & Launch (Weeks 10–12)
- [ ] Complete all micro-animations (verse highlight, card entrances, rating bounce, prayer breathing)
- [ ] Implement Liquid Glass on iOS (using `expo-glass-effect`) with `expo-blur` fallback for Android[^13]
- [ ] A/B test paywall copy (soft upsell vs direct value proposition)
- [ ] Add onboarding re-engagement: if user hasn't opened in 3 days, send a re-engagement push with a particularly resonant verse (chosen by rule-based system based on their tags)
- [ ] App Store screenshots and preview video (this is make-or-break for downloads — invest here)
- [ ] ASO (App Store Optimization): keywords "Bible app", "daily Bible verse", "biblia diaria", "pray", "application Bible espanol"
- [ ] Submit to Apple App Store and Google Play Store
- [ ] Set up PostHog or Mixpanel analytics to track conversion funnel (free → BYOK → Manna Plus)

***

## Part 8: Infrastructure Costs (Ongoing)

To project real costs as you scale:

| Cost Item | 0–100 users | 1,000 users | 10,000 users |
|---|---|---|---|
| Supabase (backend + DB + auth) | Free tier | $25/mo (Pro) | $25/mo (Pro) |
| OpenRouter AI (Manna Plus users, ~$0.15/user) | ~$0 | ~$150/mo | ~$1,500/mo |
| Expo EAS Build (CI/CD) | $0 (free tier) | $0–$99/mo | $99/mo |
| OpenRouter (BYOK users) | $0 | $0 | $0 |
| Apple Dev account | $99/year | $99/year | $99/year |
| Google Play Dev account | $25 (one-time) | $25 (one-time) | $25 (one-time) |
| Domain + email | ~$15/year | $15/year | $15/year |
| **Total monthly infra** | **~$10** | **~$185** | **~$1,625** |

At 1,000 Manna Plus subscribers paying $4.99, your gross is $4,990/month. After Apple/Google cut (~$1,500) and infra (~$185), net is ~$3,305/month — **66% net margin** at 1,000 paying users.

***

## Part 9: Growth Strategy (Faith App Specific)

The Hallow playbook, adapted for your app:

1. **Target the Spanish-speaking Christian market** — Hallow's biggest untapped gap is Spanish localization. Manna ships day-one with full Spanish support. This opens a market of 450M+ Spanish-speaking Christians worldwide.[^22]
2. **Seasonal campaign pushes** — The highest download spikes for faith apps come around Lent (February/March), Christmas (December), and Easter. Plan your launch and major updates around these windows.[^9]
3. **Church partnership program** — Offer pastors a free "church code" that gives their congregation 3 months of Manna Plus free. The pastor becomes your distributor. Replicates Hallow's celebrity-partnership strategy at the grassroots level.
4. **Daily email/SMS devotional** — Build an email list from day one. Send a daily verse email (same rule-based system). This drives app opens and builds a relationship independent of the app stores.
5. **App Store Optimization** — The most cost-effective growth lever. Target: "daily Bible verse", "biblia diaria gratis", "versículo del día", "pray app", "Bible study app". Each keyword costs nothing to rank for organically.
6. **Social proof within the app** — Show "3,421 people prayed this verse today" counters. Transforms a solo activity into a community experience without requiring a social network.

***

## Part 10: ChatGPT Builder Prompt Addendum

Append the following to the end of the prompt from the first research report (Section 12). This covers everything new from this document:

```
## ADDENDUM: Three-Tier Monetization, BYOK, and Free-Tier AI Architecture

### TIER SYSTEM
Add a `subscription_tier` field to `user_profiles`: values are 'free', 'byok', or 'plus'.

### BYOK IMPLEMENTATION
In the Settings screen, add a "Connect Your AI" section:
- Text field for OpenRouter API key (use expo-secure-store, key: 'openrouter_user_key')
- When key is saved, set `subscription_tier = 'byok'` in user_profiles
- For BYOK users, ALL AI calls go directly from the device to OpenRouter using their key
- Default model for BYOK: 'google/gemini-2.5-flash'
- Allow BYOK users to change model in an advanced settings menu (show top 5 options with descriptions)
- If BYOK key fails or is empty, gracefully fallback to free tier with message: "Your AI credits are unavailable. Please check your OpenRouter account or upgrade to Manna Plus."

### MANNA PLUS (PAID) AI CALLS
For 'plus' tier users:
- ALL AI calls go through Supabase Edge Function (never expose your OpenRouter key to client)
- Rate limit: 100 AI calls per user per day (enforce in Edge Function, return 429 with friendly message)
- Use smart routing in Edge Function:
  * Daily verse selection, check-in processing, widget text → 'google/gemini-2.5-flash-lite'
  * Verse explanations, prayer generation, semantic search → 'google/gemini-2.5-flash'
  * Deep theological questions (detected by length > 200 chars + keywords like "doctrine", "theology", "prophecy") → 'anthropic/claude-3.5-haiku'
- Log all AI costs to a `ai_usage_log` table: { user_id, model, input_tokens, output_tokens, cost_usd, called_at }

### FREE TIER — RULE-BASED VERSE SYSTEM (NO AI)
Build a `verse_tags` table in SQLite alongside the Bible tables:
CREATE TABLE verse_tags (
  verse_id TEXT NOT NULL,
  book TEXT, chapter INTEGER, verse INTEGER,
  tags TEXT NOT NULL, -- JSON array: ["anxiety", "comfort", "faith", "morning"]
  PRIMARY KEY (verse_id)
);

Pre-populate this table at build time with at minimum these 500 high-impact verses tagged across these 20 themes:
faith, love, hope, anxiety, grief, purpose, forgiveness, joy, prayer, wisdom,
comfort, strength, courage, gratitude, healing, family, provision, guidance, praise, peace

Daily verse algorithm for free users (pure local logic, zero API calls):
1. Load user's top 3 tags from local AsyncStorage (set during onboarding)
2. Query verse_tags WHERE tags CONTAINS any user tag
3. Filter out verses shown in the last 30 days (stored in a local `shown_verse_history` table)
4. Apply day-of-week bonus: Sunday → add weight to "praise" and "worship" tags
5. Apply seasonal bonus: if month is December → add weight to "hope" and "advent"; if March/April → add weight to "resurrection" and "renewal"
6. Return top result

### GATING AI FEATURES
When a free user taps any AI-gated feature (verse explanation, prayer generator, semantic search, "why this verse for you"), show a bottom sheet with:
- Feature preview (1 sample AI explanation for John 3:16, hardcoded)
- "Unlock all AI features" with two options:
  1. "Manna Plus — $4.99/month" (primary CTA, gold button)
  2. "Connect my own AI (free, requires OpenRouter account)" (secondary link, smaller)
- Include a short testimonial: "This explained the verse in a way I've never heard before 🙏 — Maria, Texas"
- Never use the word "subscribe" — use "Unlock" instead

### SUBSCRIPTION WITH REVENUECAT
Install revenuecat/react-native-purchases:
- Product IDs: 'manna_plus_monthly' ($4.99/month) and 'manna_plus_annual' ($29.99/year)
- Offer a 7-day free trial on both products
- On successful purchase: update user_profiles.subscription_tier = 'plus' via Supabase
- Listen to RevenueCat webhook (configured via Supabase function) to handle cancellations, renewals, and refunds

### UI UPGRADES — LIQUID GLASS
Install expo-glass-effect and react-native-reanimated:
- Replace all Card components with GlassCard: 
  <GlassView cornerRadius={20} style={cardStyle}>{children}</GlassView>
- Use iOS 26 NativeTabs (expo-router/unstable-native-tabs) for iOS 26+ with BlurView fallback for iOS 18–25 and Android
- Add a subtle shimmer entrance animation to verse cards using Reanimated (opacity 0→1, translateY 20→0, 400ms ease-out)
- Verse rating emojis use withSpring animation (scale 1→1.3→1, 200ms) on tap with haptic impact

### DESIGN TOKENS
Create a /constants/theme.ts file with:
export const COLORS = {
  light: {
    background: '#F8F4ED',
    surface: '#FFFFFF',
    text: '#2C1810',
    textSecondary: '#7A6155',
    gold: '#C9A84C',
    blue: '#3B5998',
  },
  dark: {
    background: '#0F1220',
    surface: '#1A1F35',
    text: '#F5F0E8',
    textSecondary: '#9DA3B4',
    gold: '#E8C56A',
    blue: '#6B8FD4',
  }
}
export const FONTS = {
  verse: 'EBGaramond',
  heading: 'CormorantGaramond-Bold',
  body: 'Inter',
}
```

---

## References

1. [scrollmapper/bible_databases: Bible versions and cross-reference ...](https://github.com/scrollmapper/bible_databases) - Bible Versions and Cross-Reference Databases: MySQL, SQLite, CSV, JSON, YAML, TXT, MD. This is a col...

2. [Bible Semantic Search Engine | Ethan Glenn](https://ethanglenn.dev/blog/bible-search) - Building a semantic search engine for the Bible to search it easily, and with natural language.

3. [Google API Pricing (July 2026): Gemini 3 Flash Preview $0.50 ...](https://www.tldl.io/resources/google-gemini-api-pricing) - Google API pricing (July 2026): Gemini 2.5 Flash-Lite $0.10/M input, $0.40/M output. Compare cache, ...

4. [Models & Pricing - OpenRouter - AI School - Lilly Tech Systems](https://lillytechsystems.com/ai-school/openrouter/models.html) - OpenRouter Models and Pricing - Compare 200+ AI models, understand pricing, and choose the right mod...

5. [Gemini 2.5 Flash API Pricing 2026 - Costs, Performance & Providers](https://pricepertoken.com/pricing-page/model/google-gemini-2.5-flash) - Gemini 2.5 Flash pricing: $0.30/M input, $2.50/M output. See benchmarks, capabilities, and find the ...

6. [Pricing - OpenRouter](https://openrouter.ai/pricing) - Transparent pricing for OpenRouter. Pay only for what you use with access to 400+ AI models. Free ti...

7. [Bring Your Own API Keys — OpenRouter Blog](https://openrouter.ai/blog/announcements/bring-your-own-api-keys/) - Combine your provider limits and/or cloud credits with OpenRouter, and unify your analytics.

8. [What are Apple and Google's fees and revenue share percentage on in-app purchases and subscriptions? | MobiLoud](https://www.mobiloud.com/help-knowledge-base/what-are-apple-and-googles-fees-and-revenue-share-percentage-on-in-app-purchases-and-subscriptions)

9. [Hallow App Reaches #1 Globally Driven by Super Bowl Ad and Lent ...](https://mwm.ai/product/articles/hallow-app-soars-1-super-2026-02-16) - Hallow prayer app achieved global #1 ranking in March 2026 due to a strategic Super Bowl LX ad campa...

10. [Hallow App's Multi-Language Instagram Strategy to $8M Monthly ...](https://growwithplutus.com/blog/hallow-app-strategy-breakdown) - With $8M+ in monthly revenue and 2M+ monthly downloads across iOS and android, they've cracked the c...

11. [Build a Native View with Expo Modules | iOS 26 Liquid Glass Effect in React Native](https://www.youtube.com/watch?v=FVS58zqlrtk) - Learn how to build a custom native view using the Expo Modules API. In this hands-on tutorial, we cr...

12. [iOS 26 Liquid Glass in React Native | React Native | Expo](https://www.youtube.com/watch?v=xRn7v6wuh1M) - #ReactNative #Expo #ExpoReactNativeLearn how to implement Apple's stunning new Liquid Glass design l...

13. [Expo GlassEffect - Expo Documentation](https://docs.expo.dev/versions/latest/sdk/glass-effect/) - React components that render a liquid glass effect using iOS's native UIVisualEffectView.

14. [UX/UI design trends for 2026: calm interfaces, transparent AI and the ...](https://elements.envato.com/learn/ux-ui-design-trends) - Explore the top UX/UI design trends for 2026 — from AI-native transparency and calm interfaces to ac...

15. [The Ultimate Mobile UI Design Trends That Will Rock 2026](https://www.clariontech.com/blog/the-ultimate-mobile-ui-design-trends-that-will-rock-2026) - Explore modern mobile UI trends shaping user experience, usability, personalization, and performance...

16. [App Design Trends 2026: What's Actually Working - Intuitia Tech](https://www.intuitia.tech/blog/app-design-trends) - Top app design trends 2026: AI-native interfaces, glassmorphism, bento grids, gesture nav, passwordl...

17. [Top 2026 App Design Trends](https://www.youtube.com/watch?v=VNDq1Q_W1Bs) - The latest App Design Trends of 2026 for those people viewing web apps and websites on their phone! ...

18. [Implementando Liquid Glass com React Native & Expo](https://hmartins-dev.medium.com/implementando-liquid-glass-com-react-native-expo-3f042661b032) - Nesse artigo estarei utilizando como base as bibliotecas do Expo Router e Expo Glass Effect para imp...

19. [Implementing Liquid Glass UI in React Native: Complete Guide 2026](https://www.trifleck.com/blog/implementing-liquid-glass-ui-in-react-native-complete-guide-2026) - Want a premium glass UI without lag? This guide covers blur setup, reusable GlassCard components, an...

20. [BYOK - Bring Your Own Keys to OpenRouter](https://openrouter.ai/docs/guides/overview/auth/byok)

21. [Santa Biblia — Reina Valera 1909](https://ebible.org/Bible/details.php?id=spaRV1909)

22. [How to Build Prayer and Meditation App Making $3 Million/Year](https://ideas.maxincubator.com/prayer-meditation-app-3-million-year/) - Learn how Hallow generates $3M annually serving 1.3M users monthly. Complete blueprint for building ...

