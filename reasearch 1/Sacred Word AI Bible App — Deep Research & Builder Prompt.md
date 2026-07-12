# Sacred Word AI Bible App — Deep Research & Builder Prompt

## Executive Summary

This report covers everything needed to build a personalized, AI-powered Bible app for iOS and Android — from free Bible data sources to AI personalization architecture, widget design, multilingual support, prayer features, onboarding, notification strategy, and a complete ChatGPT prompt to start building. The Bible is a public domain book and its full text is freely available in dozens of machine-readable formats, making it ideal for an app of this kind.

***

## 1. Bible Data: Free & Open-Source Sources

The single most important first step is choosing your Bible data source. You have several excellent, completely free options.

### Primary Recommendation: Free Use Bible API (AO Lab)

The **Free Use Bible API** (bible.helloao.org), built by AO Lab — a nonprofit dedicated to Scripture accessibility — is the best choice for this project. Key facts:[^1][^2]

- Serves **1,256+ Bible translations** across **1,004 languages** in clean JSON format[^2]
- **Zero restrictions**: no API keys, no rate limits, no copyright barriers — including for commercial use[^2]
- MIT-licensed and hosted on AWS for low-latency global access[^2]
- Includes: verse content, footnotes, audio links, cross-references, and commentary datasets[^2]
- Comes with an official JavaScript/TypeScript SDK (`free-use-bible-api` on npm) for zero-dependency integration[^2]
- Includes major public domain English translations: **KJV, WEB, ASV, BSB, NET** and many more[^2]
- Includes **Spanish translations** (Reina Valera 1909, and more — see below)[^2]

### Spanish Translations (Free & Public Domain)

For the Spanish Bible, the following are all public domain and freely downloadable:

| Translation | Notes | Source |
|---|---|---|
| Reina Valera 1909 (RV1909) | Classic Spanish; fully public domain | ebible.org[^3] |
| Reina Valera Gómez (RVG) | Free for non-commercial distribution | ebible.org[^4] |
| Santa Biblia Libre para el Mundo (BLM) | Public domain | ebible.org[^5] |

The **Reina Valera 1909** is available on eBible.org in USFM, USFX, plain text, ePub, and HTML formats — all public domain.[^3][^6]

### Additional Data Sources

| Source | What It Offers | Cost |
|---|---|---|
| **scrollmapper/bible_databases** (GitHub) | MySQL, SQLite, CSV, JSON, YAML, TXT, MD formats; cross-references | Free/Open Source[^7] |
| **bible-api.com** | Simple REST API; KJV, WEB, and others; random verse endpoint | Free (rate-limited)[^8] |
| **Bible Brain API** (Faith Comes By Hearing) | REST API for text, audio, video; 2,695 languages | Free (non-commercial)[^9] |
| **API.Bible** (American Bible Society) | ~2,500 versions; 1,600+ languages; NIV, ESV, etc. via licensing | Free Starter tier (5,000 calls/month, 3 copyrighted translations)[^10] |
| **dailybible.ca** | KJV, ASV, Darby, and others; search & verse lookup | Free, no auth[^11] |
| **MaatheusGois/bible** (GitHub) | JSON format in 15+ languages including Spanish (🇪🇸) and English (🇺🇸) | Free/Open Source[^12] |

### How to Bundle the Bible Offline (Recommended)

Rather than calling an API every time (which requires internet and introduces latency), **download the full Bible as a JSON/SQLite file and bundle it inside the app**. This is the right approach for:
- Offline reading (works without internet)
- Faster verse retrieval
- No rate limit issues

Use the AO Lab CLI (`@helloao/cli`) to generate your own instance, or download the `scrollmapper/bible_databases` SQLite file and include it as an asset in your React Native app.[^7][^2]

***

## 2. AI Personalization Engine: How to Recommend the Right Verses

This is the heart of what makes the app special. The goal is to not randomly recommend verses, but to *semantically understand the user's needs* and match them with the most relevant Scripture.

### Architecture: RAG + Vector Embeddings

The proven approach used by successful Bible AI projects is **Retrieval-Augmented Generation (RAG)** with **vector embeddings**:[^13][^14]

**Step 1 — Pre-compute Embeddings (Done Once)**
- Feed all 31,102 Bible verses into a **SentenceTransformer** model (e.g., `paraphrase-MiniLM-L3-v2` or `all-MiniLM-L6-v2`)[^14][^15]
- Each verse becomes a 384-dimension numerical vector that captures its *meaning*, not just its keywords[^14]
- Store these vectors in a **FAISS index** (~2.22 MB file) for near-instant lookup[^15][^14]

**Step 2 — User Profiling**
- When the user answers onboarding questions (see Section 5), their answers are converted to an embedding too
- User's stated needs ("I'm looking for purpose," "I want to feel closer to God") are embedded and stored
- Each time the user interacts, their profile embedding is updated

**Step 3 — Semantic Matching**
- At recommendation time, query the FAISS index with the user's current profile vector
- Retrieve the top 5–10 semantically closest verses[^14]
- Pass them to an LLM (GPT-4o-mini, Claude Haiku, or Gemini Flash) with a system prompt to explain, contextualize, and deliver the verse in a warm, pastoral tone[^16][^13]

This approach ensures **zero hallucination** — the AI only speaks from retrieved verses, not invented ones.[^17]

### Feedback Loop (The "Rating" System)

The app improves by asking users how each verse made them feel. This data is gold:

- After showing a verse, ask: "Did this help you? 🙏" with a 1–5 rating or emoji scale
- Next-day check-in: "We shared this verse yesterday — did it impact you?"[^18]
- Store ratings per user in the database (Supabase or Firebase)
- Use ratings to **weight** future recommendations: high-rated verse types get shown more, low-rated types get deprioritized
- Over time, the AI learns the user's spiritual language and emotional resonances

### Existing Open-Source Implementations to Study

- **Clear-Bible/scripture-recall** (GitHub) — uses RAG + OpenAI for Scripture memorization with feedback; built in Vite + React + Capacitor (iOS-deployable)[^19]
- **ashioyajotham/bible** (GitHub) — intelligent Bible agent using Gemini and Google Search; modular architecture for verse, teaching, reflection, and analysis agents[^20]
- **Versewise** — AI companion using LangChain, Weaviate vector DB, and OpenAI; stores user preferences in MySQL[^21]
- **Biblos** — Chroma vector search with BAAI BGE embeddings + Claude LLM for semantic search and summarization[^16]
- **Bible Vector Search** (faith.tools) — free open-source semantic Bible search using AI embeddings[^22]

***

## 3. App Architecture & Tech Stack

### Recommended Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Mobile Framework** | React Native + Expo | Cross-platform iOS + Android; large ecosystem; open-source Bible app templates exist[^23] |
| **UI Library** | NativeWind (Tailwind for RN) + shadcn-rn | Beautiful, consistent design; fast to iterate |
| **Bible Data** | Bundled SQLite (scrollmapper) + AO Lab JSON | Offline-first; full Bible in-app[^7][^2] |
| **AI/LLM** | OpenAI GPT-4o-mini or Anthropic Claude Haiku | Cost-effective; great theological reasoning |
| **Vector Search** | FAISS (pre-computed, bundled) or Pinecone (cloud) | Fast semantic verse retrieval[^14] |
| **Backend** | Supabase | User auth, profile storage, ratings, PostgreSQL[^21] |
| **Push Notifications** | Expo Notifications + OneSignal | Cross-platform notifications with scheduling[^24] |
| **Widgets** | Expo Widgets (iOS 14+ WidgetKit; Android App Widgets) | Home screen widgets for verses[^25] |
| **i18n / Multilingual** | react-i18next + react-native-localize | English/Spanish auto-detection, easy to extend[^26] |
| **State Management** | Zustand | Lightweight; persist language preference and user profile[^27] |
| **Audio (optional)** | Bible Brain API for audio Bible | Voice reading of verses in both languages[^9] |

### Open-Source Template to Start From

The **bibletags-react-native-app** (GitHub: educational-resources-and-services) is an open-source React Native + Expo Bible app template that already includes:
- Multi-version Bible import
- Multi-language UI translation support
- iOS and Android build scripts[^23]

This is the ideal starting point — fork it and build on top.

***

## 4. Widgets

Widgets are a flagship feature. Here is how to implement them well.

### iOS Widgets (WidgetKit)
- iOS 14+ supports **Small, Medium, and Large** widget sizes on the Home Screen and Lock Screen[^25]
- Small widget: 1 verse + reference + a calming background (e.g., a nature photo or gentle gradient)
- Medium widget: 1 verse + 1-sentence context about why it's relevant to the user
- Large widget: verse + full AI explanation + a "Tap to Pray" button
- YouVersion's "Verse of the Day" widgets follow this exact pattern and are the #1 reference to study[^25]
- Widgets update daily; for personalized content, the app writes the "today's recommendation" to a shared App Group container that the widget reads

### Android Widgets
- Android App Widgets work similarly and are supported via Expo Widgets or native modules
- Use the same shared data container approach
- The Bible Widget app (Google Play) has 800K+ iOS downloads showing massive demand for this feature[^28]

### Dynamic Personalization in Widgets
- After onboarding, store the user's "spiritual theme" (e.g., "seeking purpose," "dealing with loss," "growing in faith") in local storage
- Each morning (5–7 AM via a background task), the AI queries for the best verse for this user's current theme
- That verse is written to the widget data store so it shows when the user looks at their home screen
- The widget should feel like a gentle friend left them a note, not a random fortune cookie

***

## 5. Onboarding & Personalization Questions

This is where the app learns who the user is. The onboarding should feel conversational and warm, not like a boring form.

### Onboarding Question Flow (Recommended)

**Screen 1 — Welcome**
- "Welcome. This is your Bible companion. Let's get to know you."

**Screen 2 — Faith Background**
- "How close do you feel to God right now?" (Slider: Very far → Very close)
- "How familiar are you with the Bible?" (Not at all / Some stories / Fairly familiar / Deep student)

**Screen 3 — What Brings You Here**
- "What brought you to this app today?" (Multiple select)
  - I want to feel closer to God
  - I'm going through a hard time
  - I want to learn the Bible
  - I want to pray more
  - I'm searching for purpose
  - I'm new to faith
  - I want to strengthen my spiritual habits

**Screen 4 — Life Themes**
- "Is there anything specific you're facing right now?" (Free text, optional)
- "What areas of life do you want God's guidance in?" (Love / Family / Career / Anxiety / Grief / Purpose / Forgiveness / Health)

**Screen 5 — Reading Preferences**
- "How do you prefer to receive Scripture?" (Short verses / Full passages / Stories / Teachings)
- "What language do you prefer?" (English / Spanish / Both)
- "How often would you like to receive verses?" (Every day / A few times a week / When I open the app)

**Screen 6 — Prayer**
- "Would you like reminders to pray?" (Yes / No)
- "If yes, when?" (Morning / Evening / Custom time)

**Screen 7 — Notifications**
- "Can we send you a good morning verse?" (permission request)
- "Would you like check-ins about how your day is going?" (Yes / No)

### Daily/Per-Session Micro-Questions

Every time the user opens the app (or once a day), show 1 brief question:
- "How are you feeling today?" (Emoji picker: 😔 😐 🙂 😊 🙏)
- "Did yesterday's verse mean something to you?" (Yes / A little / Not really)
- "Is there something on your mind you'd like guidance on?" (Optional free text)
- "What do you want from the Bible today?" (Comfort / Wisdom / Encouragement / Direction / Praise)

These micro-inputs constantly refresh the user's profile embedding and improve recommendations over time.[^29]

***

## 6. Bible Reading Experience

### Full Bible Reader
- Book → Chapter → Verse navigation with smooth scrolling
- Side-by-side bilingual view (English + Spanish columns)[^30]
- Tap any verse to get an AI explanation (literal, historical/exoteric, and deeper/esoteric interpretations)
- "What does this mean for me today?" button — AI personalizes the explanation based on user's profile
- Highlight and save verses; organize into personal "collections" (like Pinterest boards for Scripture)
- Cross-reference viewer (linked from scrollmapper's cross-reference database)[^7]

### Explanations (Literal, Exoteric, Esoteric)
When the user taps a verse for explanation, present three layers:
1. **Literal** — What does this say plainly?
2. **Historical/Contextual** — When was it written, who wrote it, what was happening?
3. **Spiritual/Esoteric** — What deeper spiritual principle does this reveal? How has it been interpreted by mystics, church fathers, or theologians?
4. **Personal Application** — Given what you told us about your life, how might this verse speak to you specifically?

### Prayer Helper
- Library of **Biblical prayers** (Lord's Prayer, Psalms, Paul's prayers, etc.) formatted for easy reading
- AI-generated personal prayers: user describes their situation, AI writes a prayer grounded in Scripture (citing specific verses)
- "Pray with me" mode: app walks user through a structured prayer with Scripture references at each stage (praise → confession → thanksgiving → supplication)
- Prayer journal: log what the user prayed for; revisit later to see how God answered

***

## 7. Notifications Strategy

Push notifications are powerful if done right — and can feel intrusive if done wrong. The key principle: **only what the user asked for, and make it feel personal**.[^31][^32]

### Notification Types

| Type | Timing | Content Example |
|---|---|---|
| Morning Verse | 7:00 AM (user's local time) | "Good morning, [Name]. 'I can do all things through Christ…' — Start your day with this. 🙏" |
| Evening Reflection | 8:00 PM | "How was today? Here's something for tonight: [verse]" |
| Prayer Reminder | User-set time | "It's your prayer time. Tap to pray. God is listening." |
| Weekly Check-in | Sunday | "We've walked with you this week. Here's what stood out: [top verse you read]" |
| Milestone | Contextual | "You've read 100 verses! Here's one that summarizes your journey so far." |
| Day-specific | Contextual | "It's been 3 days since you opened the app. Miss you. Here's something just for you." |

### Notification Best Practices
- **Schedule at optimal times** — morning notifications outperform afternoon[^24]
- **Always personalize** — include the user's name and reference their current theme ("You mentioned you've been dealing with anxiety…")
- **Never spam** — max 2 notifications per day; let users control frequency in settings[^32]
- **Always include a verse** — don't just say "come back" — give them something of value immediately[^24]
- **Inbox for missed notifications** — let users review past verses they didn't open[^24]

***

## 8. Competitor Analysis

Understanding what already exists helps you build something better.

| App | AI Features | Strengths | Weaknesses |
|---|---|---|---|
| **YouVersion (Bible App)** | Verse of Day widget, reading plans | 500M+ downloads; most complete Bible library; widgets[^25] | No real personalization; generic verse delivery; no prayer AI |
| **Bold Bible** | "Eli" AI companion; voice + text; Scripture memory flashcards; Study Circles | Free forever; 33+ reading plans; AI discernment tool[^33] | Limited Spanish support; no daily personalized verse |
| **Faith Guide** | AI Bible Q&A | Good for Q&A | Not personalized; no widget |
| **Faithtime.ai** | AI devotionals | Devotional-focused | Paid; limited |
| **Versewise** | RAG-based semantic search; LangChain + Weaviate; user preference memory | Technical depth; personalized | Not a native mobile app; web only[^21] |
| **Living Bible App** | Voice Bible; 7 languages; GPT-4o-mini verse matching | Multilingual voice; Spanish support[^34] | No personalization memory; no widgets |

**Opportunity gap**: No app combines (1) deep onboarding personalization + (2) daily AI-curated verses based on user's spiritual journey + (3) home screen widgets + (4) bilingual English/Spanish + (5) prayer assistance + (6) feedback loop to improve recommendations. **This is your app.**

***

## 9. Design Principles

The app should feel like a **sacred space**, not a social media feed.

- **Color palette**: Deep navy, gold, warm cream, soft amber — evoke candlelight and parchment
- **Typography**: Serif fonts for Bible text (feel of a real Bible); clean sans-serif for UI
- **Animations**: Slow, gentle transitions — no bouncy or aggressive UI
- **Background imagery**: Nature photography (sky, mountains, water, light) as verse backgrounds on widgets and home screen
- **Dark mode**: Essential — many people read Scripture in the morning or evening in low light
- **Iconography**: Minimal; use traditional Christian symbols (cross, dove, open book) sparingly and tastefully
- **Onboarding screens**: Should feel like entering a sanctuary — calm music option, warm imagery, slow deliberate pace
- **Reference app**: YouVersion's visual design is the #1 reference; also look at the Hallow app (Catholic prayer) for the "sacred space" aesthetic

***

## 10. Additional Features to Consider

These are features you did not mention but would significantly increase the app's value:

- **Scripture Memory Mode**: Spaced-repetition flashcards to memorize key verses (like Clear-Bible/scripture-recall)[^19]
- **Reading Plans**: Structured plans (Read the Bible in a Year, Topical plans: Anxiety, Love, Purpose) — this is what keeps users coming back daily
- **Community / Study Circles**: Group Bible study with shared verse reactions (like Bold Bible's Study Circles)[^33]
- **Audio Bible**: Text-to-speech or recorded audio reading of any passage — via Bible Brain API (2,695 languages)[^9]
- **Journaling**: Let users write personal reflections on verses; AI can offer prompts ("What does this verse mean for your life right now?")
- **Biblical Prayer Calendar**: Structured prayers for each day of the week (Praise Monday, Intercession Tuesday, etc.)
- **"Ask the Bible"**: Type any life question in natural language; AI retrieves the most relevant verses using semantic search[^14]
- **Offline Mode**: Full Bible, last 7 days of verses, and saved content available without internet
- **Haptic Feedback**: Gentle vibration when a particularly resonant verse is shown — makes the experience feel alive

***

## 11. Monetization (Free App)

Since the app is free, consider:
- **Free forever** for core features (reading, daily verse, basic widgets, prayer reminders)
- **Optional donation** — "Support this ministry" with a one-time or monthly tip (like YouVersion's model)
- **Premium tier** (optional, later): Advanced AI explanations, unlimited journaling, more widget styles, audio Bible in all languages
- **Never sell user data** — this is a faith app; trust is everything
- App stores (Apple App Store + Google Play) require no upfront cost for free apps; Apple charges $99/year developer fee

***

## 12. ChatGPT App Builder Prompt

Copy and paste the following prompt into ChatGPT (GPT-4o or the o1/o3 model for best results). This prompt encodes all the research above so ChatGPT can start building the app for you.

***

```
You are a senior full-stack mobile developer and UI/UX designer. I want you to build a complete, production-ready React Native (Expo) mobile app for iOS and Android. Below is the full specification based on deep technical research. Follow all instructions exactly.

## APP NAME
Working title: "Sacred Word" (I can change this later)

## CORE PURPOSE
A personalized, AI-powered Bible companion app that:
1. Contains the full Bible (offline, bundled as SQLite or JSON)
2. Uses AI to recommend the most spiritually relevant verses to each user every day
3. Learns the user's spiritual needs through onboarding + daily micro-questions
4. Provides home screen widgets showing personalized Bible verses
5. Helps users pray using Biblical prayers and AI-assisted personal prayer
6. Supports both English and Spanish
7. Gets smarter over time through user feedback ratings on each verse

---

## TECH STACK (use exactly these)
- **Framework**: React Native + Expo (managed workflow)
- **Bible Data**: Bundle the KJV (English) and Reina Valera 1909 (Spanish) as local SQLite files using `expo-sqlite`. Download KJV from `scrollmapper/bible_databases` (GitHub) and Reina Valera 1909 from `ebible.org` (public domain). Both are completely free and require no license.
- **AI / LLM**: OpenAI API (GPT-4o-mini for cost efficiency) — call via a simple Supabase Edge Function to keep the API key server-side
- **Backend**: Supabase (auth, user_profiles table, verse_ratings table, prayer_logs table)
- **Vector Search**: Use a pre-computed FAISS index of Bible verse embeddings (using `sentence-transformers/paraphrase-MiniLM-L3-v2`) stored as a backend service. Alternatively, use the free Bible Vector Search API: `https://bible-search.antioch.tech/api/search?verse_query={query}` for semantic search during early development.
- **Push Notifications**: Expo Notifications + OneSignal
- **Widgets**: Use `react-native-widgetkit` (iOS) and Android's App Widget host via Expo native modules
- **i18n**: `react-i18next` + `react-native-localize` for English/Spanish auto-detection and manual switching
- **State Management**: Zustand (persist user profile, language preference, onboarding completion)
- **UI**: NativeWind (Tailwind CSS for React Native) + custom components
- **Storage**: Expo SecureStore (for tokens), AsyncStorage (for settings), expo-sqlite (Bible data + user data)

---

## DATABASE SCHEMA (Supabase / PostgreSQL)

Create these tables:

```sql
-- User spiritual profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  language TEXT DEFAULT 'en', -- 'en' or 'es'
  faith_proximity INTEGER DEFAULT 3, -- 1-5 scale from onboarding
  bible_familiarity TEXT, -- 'none', 'some', 'familiar', 'deep'
  spiritual_themes TEXT[], -- e.g. ['purpose', 'anxiety', 'love']
  life_situation TEXT, -- free text from onboarding
  reading_style TEXT, -- 'short', 'full', 'stories', 'teachings'
  notification_morning BOOLEAN DEFAULT true,
  notification_morning_time TIME DEFAULT '07:00',
  notification_evening BOOLEAN DEFAULT false,
  notification_evening_time TIME DEFAULT '20:00',
  prayer_reminders BOOLEAN DEFAULT false,
  prayer_reminder_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verse ratings / feedback loop
CREATE TABLE verse_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  verse_reference TEXT NOT NULL, -- e.g. 'John 3:16'
  verse_text TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  impact_category TEXT, -- 'motivated', 'comforted', 'closer_to_god', 'helped_pray', 'not_helpful'
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  rated_at TIMESTAMPTZ
);

-- Daily verse log
CREATE TABLE daily_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  verse_reference TEXT NOT NULL,
  verse_text TEXT,
  reasoning TEXT, -- why AI chose this for the user
  shown_date DATE DEFAULT CURRENT_DATE,
  language TEXT DEFAULT 'en'
);

-- Prayer journal
CREATE TABLE prayer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  prayer_text TEXT,
  associated_verse TEXT,
  prayed_at TIMESTAMPTZ DEFAULT NOW(),
  answer_noted TEXT, -- user can update later when prayer is answered
  language TEXT DEFAULT 'en'
);

-- Daily check-in responses
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  mood_emoji TEXT, -- '😔', '😐', '🙂', '😊', '🙏'
  yesterday_verse_helped BOOLEAN,
  intention_today TEXT, -- 'comfort', 'wisdom', 'encouragement', 'direction', 'praise'
  free_text TEXT, -- optional user input
  checked_in_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## APP SCREENS & NAVIGATION

Use React Navigation with a bottom tab navigator containing these tabs:

### Tab 1: Home (🏠)
- Welcome message with user's name
- Today's personalized verse (large card with background image)
  - Verse text + reference
  - "Why this verse for you today" button (AI explanation)
  - Rating buttons: 🙏 Really helped | 😊 Nice | 😐 Okay | ❌ Not for me
- Morning/evening greeting based on time of day
- Quick access to Prayer Helper and Read Bible

### Tab 2: Bible (📖)
- Book selector → Chapter selector → Verse reader
- English/Spanish toggle (switches translation in real-time)
- Tap any verse for a popup with:
  1. **Literal meaning** — plain explanation
  2. **Historical context** — who, when, why
  3. **Spiritual depth** — deeper/esoteric interpretation
  4. **Personal application** — based on the user's profile
- Highlight verses (save to profile)
- Search bar with SEMANTIC SEARCH (not just keyword) — use the semantic search API
- Cross-references panel (from scrollmapper cross-reference data)

### Tab 3: Prayer (🙏)
- "Pray Now" button — launches guided prayer with:
  - Step 1: Praise (with a praise Psalm)
  - Step 2: Confession (with 1 John 1:9)
  - Step 3: Thanksgiving (Philippians 4:6)
  - Step 4: Personal request (user types; AI writes a prayer using their words + Bible verses)
- "Write My Prayer" — user types their situation; AI generates a personalized, Scripture-grounded prayer
- Library of Biblical prayers (Lord's Prayer, Prayer of Jabez, Psalm 23, Paul's prayers from Ephesians/Philippians/Colossians)
- Prayer journal — view past prayers; mark as answered
- Prayer reminder settings

### Tab 4: Explore (✨)
- "Ask the Bible" — semantic search for any life question; returns top 5 verses
- Topic explorer: Love / Anxiety / Purpose / Faith / Forgiveness / Family / Healing / Courage / Wisdom (tapping shows curated verse collections)
- "Today's Reading Plan" — optional structured reading
- Scripture memory mode (spaced repetition: show verse, hide words progressively)
- Past verse history + saved highlights

### Tab 5: Profile (👤)
- Language preference (English / Spanish / Both)
- Update spiritual themes & life situation
- Notification settings (morning verse, evening reflection, prayer reminders)
- Verse feedback history
- Widget setup instructions

---

## ONBOARDING FLOW

Build a 7-screen onboarding flow that runs on first launch only (store completion state in AsyncStorage):

**Screen 1**: Beautiful welcome screen with app logo, "Your personal Bible companion" tagline, soft animation. Language selector (English / Español) at top.

**Screen 2**: "How close do you feel to God right now?" — Animated slider from "Very far" to "Very close" (stores as 1-5 integer).

**Screen 3**: "How familiar are you with the Bible?" — 4 cards to tap: "Not at all", "I know some stories", "Pretty familiar", "I study it deeply".

**Screen 4**: "What brings you here today?" — Multi-select cards: "Feel closer to God", "Going through something hard", "Learn the Bible", "Pray more", "Find purpose", "New to faith", "Build spiritual habits".

**Screen 5**: "Is there anything specific on your mind?" — Optional free text field + multi-select tags: Love / Family / Work / Anxiety / Loss / Direction / Forgiveness / Health.

**Screen 6**: Reading + notification preferences — how often to receive verses, preferred time, prayer reminders (Yes/No + time picker).

**Screen 7**: "We're ready to walk with you." — Show their first personalized verse based on their onboarding answers. Ask for notification permission here.

All onboarding answers → save to `user_profiles` table in Supabase.

---

## AI VERSE RECOMMENDATION SYSTEM

Create a Supabase Edge Function called `get-daily-verse`:

```typescript
// Input: user_id
// 1. Fetch user profile from user_profiles table
// 2. Fetch last 30 verse ratings from verse_ratings table
// 3. Build a context string from the profile:
//    e.g., "User is feeling disconnected from God, dealing with anxiety and searching for purpose.
//           They have rated verses about peace and comfort highly. Avoid recommending 
//           historical/genealogy verses."
// 4. Call OpenAI API with system prompt:
//    "You are a wise and compassionate biblical scholar. Given the user's spiritual profile,
//     recommend the single most relevant Bible verse for them today. 
//     You must respond ONLY with JSON: { book: string, chapter: number, verse: number, 
//     translation: 'KJV'|'RV1909', reasoning: string (1 sentence, warm and personal) }
//     Do not invent verses. Only recommend real verses."
// 5. Fetch the verse text from the local Bible database
// 6. Log to daily_verses table
// 7. Return verse + reasoning to app
```

For semantic search (Bible tab), call:
`GET https://bible-search.antioch.tech/api/search?verse_query={user_question}`
and return top 5 results.

---

## WIDGETS

### iOS Widget (WidgetKit via react-native-widgetkit)
- Write today's verse to an App Group shared container each morning
- Small widget: 1-2 lines of verse text + reference, colored background
- Medium widget: Full verse + "Tap to pray on this" call-to-action
- Background auto-updates via background app refresh at 6 AM daily

### Android Widget
- Use Glance API (Jetpack Compose-based) via Expo native module
- Same data, similar layout to iOS

---

## MULTILINGUAL SUPPORT

- Default language: auto-detect from device locale (`react-native-localize`)
- Supported: English (en) and Spanish (es)
- All UI strings in `/locales/en.json` and `/locales/es.json`
- Bible text: KJV for English, Reina Valera 1909 for Spanish (both bundled in SQLite)
- AI responses: instruct GPT-4o-mini to respond in the user's selected language
- Language toggle: available in onboarding (Screen 1) and Profile tab
- Side-by-side bilingual Bible view: English verse on left, Spanish on right (toggleable)

---

## DESIGN SYSTEM

- **Primary colors**: Deep navy (#1A1F3A), warm gold (#C9A84C), cream (#F5F0E8), soft amber (#E8A87C)
- **Background images**: Use a set of 10 nature photos (sky, mountains, ocean, forest at dawn) as verse card backgrounds
- **Fonts**: 
  - Bible text: Georgia or EB Garamond (serif, feels like a Bible)
  - UI text: Inter or Nunito (clean, readable)
- **Animations**: Fade-in transitions only (no bouncy spring animations)
- **Dark mode**: Full dark mode support (background #0F1220, text #F5F0E8)
- **Icons**: Use Feather Icons via `react-native-vector-icons`

---

## NOTIFICATION CONTENT EXAMPLES

Morning (7 AM):
- Title: "Good morning 🌅"
- Body: "Here's something for your day: '[verse preview]' — Tap to read more."

Evening (8 PM):
- Title: "Evening reflection 🕯️"
- Body: "How was your day? Here's a verse to close with: '[verse preview]'"

Prayer reminder:
- Title: "Time to pray 🙏"
- Body: "God is waiting to hear from you. Open the app to pray."

Re-engagement (after 3 days of no opens):
- Title: "We miss you ✨"
- Body: "Here's a verse we think you need today: '[verse preview]'"

---

## FILE STRUCTURE

```
/app
  /(tabs)
    /home - Home screen
    /bible - Bible reader
    /prayer - Prayer helper
    /explore - Explore/search
    /profile - User profile & settings
  /onboarding - 7 onboarding screens
  /components - Reusable UI components
  /hooks - Custom hooks (useVerseRecommendation, useDailyCheckin, etc.)
  /lib
    /supabase.ts - Supabase client
    /openai.ts - OpenAI helper functions
    /bible-db.ts - SQLite Bible query functions
    /i18n.ts - i18next setup
  /locales
    /en.json - English strings
    /es.json - Spanish strings
  /assets
    /bible - KJV.db, RV1909.db (SQLite files)
    /images - Background photos for verse cards
/supabase
  /functions
    /get-daily-verse - Edge function for AI verse recommendation
    /generate-prayer - Edge function for AI prayer generation
```

---

## WHAT TO BUILD FIRST (Priority Order)

1. Project setup: Expo + Supabase + i18n + SQLite Bible bundled
2. Onboarding flow (7 screens) + save to Supabase
3. Home tab with daily verse card + rating system
4. Bible reader tab (full navigation + bilingual)
5. AI verse recommendation Edge Function
6. Push notifications (morning + evening)
7. Prayer helper tab
8. Explore / semantic search tab
9. Profile tab + notification settings
10. Widgets (iOS first, then Android)
11. Feedback loop (daily check-ins improving recommendations)
12. Polish: animations, dark mode, design system

---

## IMPORTANT CONSTRAINTS

- All Bible text must come from public domain sources (KJV and Reina Valera 1909 — both fully public domain, no license needed)
- The app is FREE — no paywalls on core features
- Never show ads
- Never sell or share user data
- All AI responses about Scripture must be grounded in actual Bible verses — no hallucination; always cite the verse reference
- If using OpenAI, keep the API key in a Supabase Edge Function — never expose it in the client app
- The app must work OFFLINE for Bible reading (verses are bundled locally)

Please start by scaffolding the complete project structure, setting up Expo + Supabase + SQLite Bible data + i18n, and building the onboarding flow. After each section is complete, ask me to confirm before proceeding to the next.
```

***

## 13. Suggested App Names

| Name | Feel | Notes |
|---|---|---|
| **Sacred Word** | Reverent, universal | Clear purpose |
| **Lumina Bible** | Modern, light-themed | Good for younger audience |
| **Veritas** | Latin for "Truth" | Sophisticated |
| **Palabra Viva** (Living Word) | Bilingual appeal | Works in English/Spanish |
| **Compass Scripture** | Purpose/guidance focus | Strong metaphor |
| **Vine** | Biblical metaphor (John 15) | Short, memorable |
| **Manna** | Manna = daily bread from heaven | Perfect metaphor for daily verses |

**Recommendation: "Manna"** — short, deeply biblical (Exodus 16, "daily bread"), universally understood by believers, available as an app name, and perfectly captures the concept of daily spiritual nourishment.

***

## 14. Conclusion & Next Steps

The technical foundation is completely free and already exists:
- **Bible data**: Free, public domain, machine-readable via AO Lab, eBible.org, and scrollmapper[^3][^7][^2]
- **AI personalization**: Proven architecture via RAG + FAISS vector embeddings[^15][^14]
- **Open-source reference**: `bibletags-react-native-app` on GitHub is a working React Native + Expo Bible app template[^23]
- **Multilingual**: `react-i18next` + `react-native-localize` makes English/Spanish support straightforward[^27][^26]
- **Notifications**: Expo Notifications handles scheduling, personalization, and opt-in management[^24]

The ChatGPT prompt in Section 12 is ready to use. Feed it to GPT-4o (or o3 for best code quality) and tell it: *"Use the research document I've attached and follow the prompt below to build this app."* Then confirm each section before proceeding. Expect 8–12 ChatGPT sessions to get a working MVP.

---

## References

1. [Free Use Bible API](https://bible.helloao.org/) - Access over 1000 Bible translations in an easy-to-use JSON format that also includes basic formattin...

2. [Get Free Use Bible API on faith.tools](https://faith.tools/app/288-free-use-bible-api) - A free, open-source JSON API by AO Lab serving 1256 Bible translations across 1004 languages with no...

3. [Santa Biblia — Reina Valera 1909](https://ebible.org/Bible/details.php?id=spaRV1909)

4. [Santa Biblia Reina Valera Gómez](https://ebible.org/find/details.php?id=sparvg)

5. [Bible List - eBible.org](https://ebible.org/find/country.php?c=CR&sort=l) - Select a translation for a list of available downloads. — Reina Valera 1909. Free Bible for the Worl...

6. [Santa Biblia — Reina Valera 1909 - eBible.org](https://ebible.org/spaRV1909/copyright.htm) - Santa Biblia — Reina Valera 1909. The Holy Bible in Spanish, Reina Valera translation of 1909. Publi...

7. [scrollmapper/bible_databases: Bible versions and cross-reference ...](https://github.com/scrollmapper/bible_databases) - Bible Versions and Cross-Reference Databases: MySQL, SQLite, CSV, JSON, YAML, TXT, MD. This is a col...

8. [bible-api.com](https://bible-api.com/) - This service provides a JSON API for retrieving Bible verses and passages, provided by Tim Morgan. Y...

9. [Get Bible Brain API on faith.tools](https://faith.tools/app/153-bible-brain-api) - Bible Brain is the free developer API from Faith Comes By Hearing, offering REST endpoints for Bible...

10. [Get API.Bible on faith.tools](https://faith.tools/app/494-api-bible) - The largest Bible API available — access nearly 2,500 text and audio Bible versions in 1,600+ langua...

11. [Free RESTful JSON API for Public Domain Bible Translations](https://dailybible.ca/api-docs) - Free Bible API providing RESTful JSON access to public domain translations including KJV, ASV, Douay...

12. [GitHub - MaatheusGois/bible: Bible API in JSON 🇸🇦 🇨🇳 🇩🇪 🇬🇷 🇺🇸 🇬🇧 🇺🇳 🇪🇸 🇫🇮 🇫🇷 🇰🇷 🇧🇷 🇵🇹 🇷🇴 🇷🇺 🇻🇳](https://github.com/MaatheusGois/bible) - Bible API in JSON 🇸🇦 🇨🇳 🇩🇪 🇬🇷 🇺🇸 🇬🇧 🇺🇳 🇪🇸 🇫🇮 🇫🇷 🇰🇷 🇧🇷 🇵🇹 🇷🇴 🇷🇺 🇻🇳 - MaatheusGois/bible

13. [Building a Unified Bible Platform: Q&A, Insights, and Ministry Matching](https://blog.josephvelliah.com/unified-bible-platform-with-ai-services) - Discover a unified Bible platform with AI-powered Q&A, curated insights, and ministry matching - tra...

14. [Bible Semantic Search Engine | Ethan Glenn](https://ethanglenn.dev/blog/bible-search) - Building a semantic search engine for the Bible to search it easily, and with natural language.

15. [Building ScriptureLM: AI-Powered Bible Study with Semantic Search and Summarization](https://medium.com/@anubhavsingh1729/building-scripturelm-ai-powered-bible-study-with-semantic-search-and-summarization-b0b40e27daf3) - Introduction

16. [Biblos – Semantic Bible Embedded Vector Search and Claude LLM](https://www.reddit.com/r/Christianity/comments/17lm3m0/biblos_semantic_bible_embedded_vector_search_and/) - A simple tool for semantic search and summarization of Bible passages. Leveraging Chroma for vector ...

17. [Implementing Semantic Search in Bible AI with FAISS - LinkedIn](https://www.linkedin.com/posts/olorunfunminiyi-akinlua-7b8b37225_rag-vectordatabases-faiss-activity-7415145394076229632-ur-a) - 🚀 Day 3/5 — Making the Bible Searchable with Semantic Search (FAISS) Day 3 of my Bible-only AI (RAG)...

18. [I Spent 100 Days Building an AI Personal Bible Verses— Here’s What I Learned About Code, Faith…](https://medium.com/@wanghaisheng/i-spent-100-days-building-an-ai-personal-bible-verses-heres-what-i-learned-about-code-faith-ff8ad2f5aa9b) - I Spent 100 Days Building an AI Theologian — Here’s What I Learned About Code, Faith, and Shipping a...

19. [GitHub - Clear-Bible/scripture-recall: An app that employs conversational AI for the memorization of scripture.](https://github.com/Clear-Bible/scripture-recall) - An app that employs conversational AI for the memorization of scripture. - Clear-Bible/scripture-rec...

20. [GitHub - ashioyajotham/bible: An intelligent agent system for biblical study and analysis, combining modern AI with scriptural wisdom for spiritual insights and biblical research.](https://github.com/ashioyajotham/bible) - An intelligent agent system for biblical study and analysis, combining modern AI with scriptural wis...

21. [Versewise - diye.dev](https://www.diye.dev/projects/versewise) - diye.dev

22. [Get Bible Vector Search on faith.tools](https://faith.tools/app/833-bible-vector-search) - A free, open-source semantic Bible search tool that uses AI embeddings to find Scripture passages by...

23. [GitHub - educational-resources-and-services/bibletags-react-native-app](https://github.com/educational-resources-and-services/bibletags-react-native-app) - Contribute to educational-resources-and-services/bibletags-react-native-app development by creating ...

24. [Maximize Push Notifications - The Church App](https://www.thechurchapp.org/blog/2016/4/maximize-push-notifications) - Increasing efficiency, promoting campaigns, and making great content incredibly accessible are only ...

25. [New! Bible App iOS 14 Widgets for your Home Screen. - YouVersion](https://blog.youversion.com/2020/10/youversion-bible-app-ios-14-widget-announcement/) - Now, you can get that daily encouragement directly on your home screen by activating Verse of the Da...

26. [Multilingual Support in React Native Apps](https://medium.com/@avinashukla0704/multilingual-support-in-react-native-apps-754ebecde039) - In the digital age, reaching a wide range of users across different languages and cultural backgroun...

27. [How I Built a Fully Localized, Multilingual App in React Native (with ...](https://the-expert-developer.medium.com/how-i-built-a-fully-localized-multilingual-app-in-react-native-with-dynamic-language-switching-0957eb2f5d4c) - Supporting one language isn’t enough anymore.

28. [Bible Widget - Daily Verses - Apps on Google Play](https://play.google.com/store/apps/details?id=com.kawaiiapps.biblewidget&hl=en) - Daily verses on home screen. Works offline. Easy sharing. 800K+ iOS downloads.

29. [How AI Model Development Solves Key Challenges in Mobile App ...](https://www.zigpoll.com/content/how-can-we-leverage-ai-to-enhance-user-onboarding-experiences-in-our-mobile-app-ensuring-personalized-guidance-without-compromising-performance-or-increasing-load-times) - AI model development revolutionizes mobile app onboarding by delivering personalized, efficient user...

30. [Bilingual Bible Multi Language - App Store - Apple](https://apps.apple.com/us/app/bilingual-bible-multi-language/id1501949414) - The Bilingual Bible is a wonderful tool to be able to express to others in a foreign language what y...

31. [How to Use Push Notifications to Increase Engagement](https://churchleaders.com/ministry-tech-leaders/329289-10-ways-you-can-use-push-notifications-to-grow-your-church-by-increasing-engagement-jesse-wisnewski.html/3) - Your church needs to explore different ways to communicate with your church to get their attention. ...

32. [Best Practices for Church App Push Notifications - Subsplash](https://www.subsplash.com/blog/church-push-notification-best-practices) - Discover how to use church app push notifications to boost engagement and discipleship. Learn the ri...

33. [Best AI Bible Apps 2026 - Top 5 Compared - Bold Bible](https://boldbible.org/compare/best-ai-bible-apps) - Compare the 8 best AI Bible apps for 2026: Bold Bible, Faith Guide, Bible Ace, Faithtime.ai, AI Bibl...

34. [Built a multilingual voice Bible app in 2 weeks - feedback welcome!](https://www.reddit.com/r/SideProject/comments/1q10niu/built_a_multilingual_voice_bible_app_in_2_weeks/) - Built a multilingual voice Bible app in 2 weeks - feedback welcome!

