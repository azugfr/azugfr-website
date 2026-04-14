# AZUG FR Website

[![Deploy Astro to GitHub Pages](https://github.com/azugfr/azugfr-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/azugfr/azugfr-website/actions/workflows/deploy.yml)

The official website for **Azure User Group France (AZUG FR)** — the French Azure community. Built with Astro 5, Tailwind CSS, and deployed to GitHub Pages.

🌐 **Live site:** [azugfr.github.io](https://azugfr.github.io)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Content Collections](#content-collections)
  - [Events](#events)
  - [News](#news)
  - [Speakers](#speakers)
  - [Sponsors](#sponsors)
  - [Resources](#resources)
  - [About](#about)
- [Internationalization (i18n)](#internationalization-i18n)
- [Data Sync Scripts](#data-sync-scripts)
- [CI/CD — GitHub Actions](#cicd--github-actions)
- [Testing](#testing)
- [Adding Content Manually](#adding-content-manually)
- [Contributing](#contributing)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 5.x | Static site generator (SSG) |
| [Tailwind CSS](https://tailwindcss.com) | 3.x | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety |
| [Pagefind](https://pagefind.app) | 1.x | Static full-text search |
| [Vitest](https://vitest.dev) | 2.x | Unit tests |
| [Playwright](https://playwright.dev) | 1.x | Browser / E2E tests |
| GitHub Pages | — | Hosting & deployment |

---

## Project Structure

```
azugfr-website/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # CI/CD: build & deploy to GitHub Pages
│   └── instructions/           # Copilot instructions
│
├── public/                     # Static assets (images, icons, robots.txt)
│   └── azugfr-logo.png         # Official AZUG FR logo
│
├── scripts/                    # Node.js data-sync utilities
│   ├── sync-meetup-events.mjs  # Fetch events from Meetup GraphQL API
│   ├── sync-linkedin-news.mjs  # Fetch news from LinkedIn RSS
│   └── derive-speakers.mjs    # Auto-generate speaker stubs from event data
│
├── src/
│   ├── content/                # Content collections (Astro Content Layer)
│   │   ├── config.ts           # Zod schemas for all collections
│   │   ├── events/             # Event JSON files (~25 entries, 2022–2026)
│   │   ├── news/               # News/announcement JSON files
│   │   ├── speakers/           # Speaker profile JSON files
│   │   ├── sponsors/           # Sponsor JSON files
│   │   └── resources/          # Talk slides, videos, articles
│   │
│   ├── components/
│   │   ├── site/               # Global layout components
│   │   │   ├── NavBar.astro
│   │   │   ├── Footer.astro
│   │   │   └── LanguageToggle.astro
│   │   ├── events/             # Event-specific components
│   │   └── sponsors/           # Sponsor-specific components
│   │
│   ├── data/                   # Static data (not in content collections)
│   │   ├── site.ts             # Site name, URL, social links
│   │   ├── globalAzure.ts      # Global Azure France editions (2019–2026)
│   │   ├── about.ts            # About page content
│   │   └── i18n/               # UI string translations
│   │       ├── fr.ts
│   │       └── en.ts
│   │
│   ├── layouts/                # Page layout templates
│   │
│   ├── lib/
│   │   ├── content/            # Content helpers (filtering, sorting)
│   │   └── i18n/
│   │       ├── index.ts        # i18n utilities & resolveLocaleContent()
│   │       └── index.test.ts   # Unit tests
│   │
│   └── pages/
│       ├── index.astro         # Root redirect → /fr
│       ├── 404.astro
│       └── [locale]/           # Locale-prefixed routes (fr | en)
│           ├── index.astro     # Home page
│           ├── about.astro
│           ├── global-azure-france.astro
│           ├── search.astro
│           ├── events/
│           │   ├── index.astro
│           │   └── [slug].astro
│           ├── news/
│           │   ├── index.astro
│           │   └── [slug].astro
│           ├── speakers/
│           │   ├── index.astro
│           │   └── [slug].astro
│           └── resources/
│               └── index.astro
│
├── tests/                      # Playwright browser tests
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/azugfr/azugfr-website.git
cd azugfr-website

# Install dependencies
npm install

# Start the development server (http://localhost:4321)
npm run dev
```

The root path `/` redirects to `/fr` (default locale). Use [http://localhost:4321/fr](http://localhost:4321/fr) or [http://localhost:4321/en](http://localhost:4321/en).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run dev:network` | Dev server accessible on local network |
| `npm run build` | Build the static site → `dist/` and index with Pagefind |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run unit tests + type-check + build |
| `npm run test:unit` | Run Vitest unit tests only |
| `npm run test:browser` | Run Playwright browser tests |
| `npm run sync:events` | Sync events from Meetup API |
| `npm run sync:news` | Sync news from LinkedIn RSS |
| `npm run sync` | Run both sync scripts |
| `npm run derive:speakers` | Auto-generate speaker stubs from event data |

---

## Content Collections

All content is stored as **JSON files** in `src/content/`. Each collection is validated by a [Zod](https://zod.dev) schema defined in `src/content/config.ts`.

The **filename** of each JSON file becomes the Astro collection entry ID (used as the URL slug).

### Events

**Path:** `src/content/events/{slug}.json`  
**Source:** Meetup.com (synced via `sync-meetup-events.mjs`)

```jsonc
{
  "slug": "global-azure-france-2025-paris-2025-05-06",
  "locale": "fr",
  "title": "Global Azure France 2025 – Paris",
  "summary": "La journée annuelle dédiée à Microsoft Azure en France.",
  "description": "Full HTML/Markdown description...",
  "startDate": "2025-05-06T09:00:00+02:00",
  "endDate": "2025-05-06T18:00:00+02:00",
  "timezone": "Europe/Paris",
  "status": "past",            // "upcoming" | "past" | "cancelled"
  "venue": {
    "name": "ESGI",
    "city": "Paris",
    "address": "242 Rue du Faubourg Saint-Antoine",
    "mode": "in_person"        // "in_person" | "online" | "hybrid"
  },
  "registrationUrl": "https://www.meetup.com/...",
  "meetupUrl": "https://www.meetup.com/...",
  "speakerSlugs": ["john-doe", "jane-smith"],
  "tags": ["Azure", "Community"],
  "source": {
    "provider": "meetup",
    "externalId": "12345678",
    "lastSyncedAt": "2025-01-01T00:00:00.000Z"
  },
  "translations": {
    "en": {
      "title": "Global Azure France 2025 – Paris",
      "summary": "The annual day dedicated to Microsoft Azure in France."
    }
  }
}
```

> **Important:** `source.provider` must be the literal `"meetup"`.

---

### News

**Path:** `src/content/news/{slug}.json`  
**Source:** LinkedIn (synced via `sync-linkedin-news.mjs`)

```jsonc
{
  "slug": "global-azure-france-2026-announcement",
  "locale": "fr",
  "title": "Global Azure France 2026 — Annonce officielle",
  "summary": "Rejoignez-nous le 18 avril 2026 à l'ESGI Paris !",
  "publishedAt": "2026-01-15T10:00:00Z",
  "sourceUrl": "https://www.linkedin.com/company/azugfr/posts/...",
  "tags": ["Global Azure", "Announcement"],
  "source": {
    "provider": "linkedin-rss",
    "externalId": "urn:li:activity:...",
    "lastSyncedAt": "2026-01-15T12:00:00.000Z"
  },
  "translations": {
    "en": {
      "title": "Global Azure France 2026 — Official Announcement",
      "summary": "Join us on April 18, 2026 at ESGI Paris!"
    }
  }
}
```

> **Important:** `source.provider` must be the literal `"linkedin-rss"`.

---

### Speakers

**Path:** `src/content/speakers/{slug}.json`  
**Generated by:** `derive-speakers.mjs` (creates stubs from `speakerSlugs` in events)

```jsonc
{
  "slug": "john-doe",
  "locale": "fr",
  "name": "John Doe",
  "photo": "/speakers/john-doe.jpg",
  "company": "Microsoft",
  "role": "Cloud Solution Architect",
  "location": "Paris, France",
  "headline": "Expert Azure et DevOps",
  "bio": "...",
  "expertise": ["Azure", "DevOps", "Kubernetes"],
  "links": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "x": "https://x.com/johndoe"
  }
}
```

---

### Sponsors

**Path:** `src/content/sponsors/{slug}.json`

```jsonc
{
  "slug": "microsoft",
  "locale": "fr",
  "name": "Microsoft France",
  "website": "https://microsoft.com/fr-fr",
  "logo": "/sponsors/microsoft.svg",
  "tier": "platinum",
  "featured": true,
  "description": "Microsoft France soutient la communauté Azure."
}
```

---

### Resources

**Path:** `src/content/resources/{slug}.json`

```jsonc
{
  "slug": "global-azure-2025-kubernetes-slides",
  "locale": "fr",
  "type": "slides",          // "slides" | "video" | "article" | "repository" | "other"
  "title": "Kubernetes sur Azure — Slides",
  "url": "https://speakerdeck.com/...",
  "eventSlug": "global-azure-france-2025-paris-2025-05-06",
  "speakerSlugs": ["john-doe"]
}
```

---

## Internationalization (i18n)

The site supports **French (`fr`)** and **English (`en`)**, with French as the default locale.

- All URLs are prefixed: `/fr/...` and `/en/...`
- The root `/` redirects to `/fr`
- The **language switcher** in the navbar always navigates to the homepage of the alternate locale

### How translations work

Every content entry has a canonical `locale` (`"fr"` or `"en"`) and an optional `translations` object with overrides for the other locale.

```ts
// In a page component:
import { resolveLocaleContent } from "@/lib/i18n";

const localizedEvent = resolveLocaleContent(event, locale);
// → returns event merged with translations[locale] if available
```

UI strings (labels, navigation, buttons) live in:
- `src/data/i18n/fr.ts` — French strings
- `src/data/i18n/en.ts` — English strings

Use `getUiDictionary(locale)` from `src/lib/i18n/index.ts` to access them in components.

---

## Data Sync Scripts

These scripts pull live data from external APIs and write normalized JSON into the content collections. They are **not run during the build** — run them locally or in a scheduled workflow before pushing.

### Sync Events from Meetup

```bash
MEETUP_KEY=<your-oauth-token> npm run sync:events

# Preview without writing files
MEETUP_KEY=<your-oauth-token> node scripts/sync-meetup-events.mjs --dry-run
```

- Calls the [Meetup GraphQL API](https://www.meetup.com/api/oauth/list) for the `azure-user-group-france` group
- Fetches 50 upcoming + 50 past events
- Writes or idempotently updates `src/content/events/{slug}.json`
- Existing files matched by `source.externalId` are updated in place (slug is preserved)

### Sync News from LinkedIn

```bash
npm run sync:news
```

Fetches posts from the [AZUG FR LinkedIn page](https://www.linkedin.com/company/azugfr) and writes them to `src/content/news/`.

### Derive Speakers

```bash
npm run derive:speakers
```

Scans all event JSON files, collects `speakerSlugs`, and creates minimal speaker stub files in `src/content/speakers/` for any slug that doesn't already have a file. Manually enrich the stubs afterward with bios, photos, and links.

---

## CI/CD — GitHub Actions

The site is automatically built and deployed on every push to the `nextgen` or `main` branches.

**Workflow:** `.github/workflows/deploy.yml`

```
push to nextgen/main
  └─ build job
       ├─ actions/checkout@v4
       ├─ Node.js 20 setup
       ├─ npm ci
       ├─ npm run build          (Astro build + Pagefind index)
       └─ upload Pages artifact
  └─ deploy job
       └─ actions/deploy-pages@v4 → azugfr.github.io
```

**Manual trigger:** The workflow can also be triggered manually from the Actions tab (via `workflow_dispatch`).

> **Note:** Data sync scripts are **not** run in CI. Update content JSON files and commit them before pushing to trigger a deployment with fresh data.

---

## Testing

### Unit Tests (Vitest)

```bash
npm run test:unit
```

Tests live alongside the source code (e.g., `src/lib/i18n/index.test.ts`) and cover i18n utilities and content helpers.

### Type Checking

```bash
npx astro check
```

Validates all `.astro` files and TypeScript sources.

### Browser Tests (Playwright)

```bash
npm run test:browser
```

Smoke tests verifying key pages render correctly at both `/fr` and `/en` locales. Configuration in `playwright.config.ts`.

---

## Adding Content Manually

### Add a new event

1. Create `src/content/events/{slug}.json` following the [Events schema](#events).
2. Use a descriptive slug: `{event-name}-{YYYY-MM-DD}` (e.g., `meetup-azure-functions-paris-2026-09-15`).
3. Set `status` to `"upcoming"`, `"past"`, or `"cancelled"`.
4. Set `source.provider` to `"meetup"` (required by schema).
5. Run `npm run build` to validate — Zod will catch any schema errors.

### Add a news item

1. Create `src/content/news/{slug}.json` following the [News schema](#news).
2. Set `source.provider` to `"linkedin-rss"` (required by schema).

### Add a speaker

1. Create `src/content/speakers/{slug}.json` following the [Speakers schema](#speakers).
2. Reference the slug in the relevant event's `speakerSlugs` array.

### Add a Global Azure France edition

Edit `src/data/globalAzure.ts` and add a new entry to the `editions` array.

---

## Contributing

1. **Fork** the repository and create a branch from `nextgen`.
2. Make your changes — content or code.
3. Run `npm test` to validate everything passes.
4. Open a **pull request** against `nextgen`.

For content contributions (events, speakers, sponsors), follow the JSON schemas described above. For questions or to propose a talk, use the [Submit a Talk](https://sessionize.com/azugfr) form linked in the site footer.

---

## Community & Links

| | |
|---|---|
| 🌐 Website | [azugfr.github.io](https://azugfr.github.io) |
| 💼 LinkedIn | [linkedin.com/company/azugfr](https://www.linkedin.com/company/azugfr) |
| 🐦 X / Twitter | [@azugfr](https://twitter.com/azugfr) |
| 📅 Meetup | [meetup.com/azure-user-group-france](https://www.meetup.com/fr-FR/azure-user-group-france/) |
| 🎥 YouTube | [youtube.com/@azugfr](https://www.youtube.com/@azugfr) |
| 💻 GitHub | [github.com/azugfr](https://github.com/azugfr) |
