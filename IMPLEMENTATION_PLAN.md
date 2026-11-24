# AZUG FR — Implementation Plan & Session Log

> Last updated: 2026-04-14
> Branch: `nextgen`
> Status: **All 22 implementation tasks complete ✅**

---

## What Is This File?

This file records the full implementation plan for the AZUG FR website migration from a
legacy Bootstrap/jQuery static HTML site to a modern Astro 5 + Tailwind CSS static site.
It serves as the single source of control for tracking progress, decisions made, and the
current state of the project.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 (`output: "static"`) |
| Styling | Tailwind CSS |
| Hosting | GitHub Pages (`https://azugfr.github.io`) |
| Content | Astro Content Collections + Zod schemas |
| Data sync | Meetup GraphQL API → `src/content/events/*.json` |
| Data sync | LinkedIn RSS bridge → `src/content/news/*.json` |
| Search | Pagefind (post-build, client-side) |
| Languages | French (default) + English (`fr`/`en` locale prefix routing) |
| Design | Penpot (source of truth) |

---

## Completed Tasks

| ID | Task | Status | Commit |
|----|------|--------|--------|
| T1 | Legacy inventory + migration map | ✅ done | `MIGRATION_MAP.md` |
| T2 | Bootstrap Astro 5 + Tailwind CSS | ✅ done | `astro.config.mjs`, `package.json` |
| T3 | Localization foundation (FR/EN) | ✅ done | `src/data/i18n/`, `src/lib/i18n/` |
| T4 | GitHub Pages deploy workflow | ✅ done | `.github/workflows/deploy.yml` |
| T5 | Content Collections schemas | ✅ done | `src/content/config.ts` |
| T6 | Bilingual content fixtures | ✅ done | `src/content/*/` |
| T7 | Meetup GraphQL sync script | ✅ done | `scripts/sync-meetup-events.mjs` |
| T8 | LinkedIn RSS sync script | ✅ done | `scripts/sync-linkedin-news.mjs` |
| T9 | Content normalization helpers | ✅ done | `src/lib/content/` |
| T10 | Shared layouts + NavBar + Footer + LanguageToggle | ✅ done | `src/layouts/`, `src/components/site/` |
| T11 | Home page (`/fr`, `/en`) | ✅ done | `src/pages/[locale]/index.astro` |
| T12 | Events list page | ✅ done | `src/pages/[locale]/events/index.astro` |
| T13 | Event detail page | ✅ done | `src/pages/[locale]/events/[slug].astro` |
| T14 | News list + detail pages | ✅ done | `src/pages/[locale]/news/` |
| T15 | Speaker derivation pipeline | ✅ done | `scripts/derive-speakers.mjs` |
| T16 | Speakers list + detail pages | ✅ done | `src/pages/[locale]/speakers/` |
| T17 | Resources page | ✅ done | `src/pages/[locale]/resources/index.astro` |
| T18 | About page | ✅ done | `src/pages/[locale]/about.astro` |
| T19 | Sponsor components | ✅ done | `src/components/sponsors/` |
| T20 | Pagefind search integration | ✅ done | `src/pages/[locale]/search.astro` |
| T21 | Deploy hardening + cutover docs | ✅ done | `CUTOVER.md`, `src/pages/404.astro` |
| T22 | Global Azure France page | ✅ done | `src/pages/[locale]/global-azure-france.astro` |

---

## Generated Routes (18 pages total)

| Route | Description |
|-------|-------------|
| `/` | Redirects → `/fr` (301) |
| `/fr`, `/en` | Localized home page |
| `/fr/events`, `/en/events` | Events list (upcoming + archived) |
| `/fr/events/[slug]`, `/en/events/[slug]` | Event detail |
| `/fr/news`, `/en/news` | News list |
| `/fr/news/[slug]`, `/en/news/[slug]` | News detail |
| `/fr/speakers`, `/en/speakers` | Speakers directory |
| `/fr/speakers/[slug]`, `/en/speakers/[slug]` | Speaker profile |
| `/fr/resources`, `/en/resources` | Resources listing |
| `/fr/about`, `/en/about` | About / manifesto |
| `/fr/search`, `/en/search` | Pagefind search |
| `/fr/global-azure-france`, `/en/global-azure-france` | GAB flagship page |
| `/404` | Custom not-found with redirect to `/fr` |

---

## Key Architecture Decisions

### Single-file bilingual model
Each content JSON file stores canonical locale content at the top level,
with a `translations.<otherLocale>` sub-object for overrides:

```json
{
  "slug": "my-event",
  "locale": "fr",
  "title": "Mon événement",
  "translations": { "en": { "title": "My event" } }
}
```

Locale-neutral fields (dates, slugs, URLs, IDs) are at the top level only — never duplicated.

### Locale-prefixed routing
All content routes are under `/{locale}/path` (`/fr/...`, `/en/...`).
The root `/` redirects to `/fr` (default locale).
`getStaticPaths()` always generates both `fr` and `en` variants.

### Language toggle (Penpot spec)
- Desktop: `FR|EN` segmented control at far right of navbar (before CTA)
- Mobile: toggle to the LEFT of hamburger (`logo | spacer | toggle | ☰`)
- Active: `#0078D4` fill + white semibold text
- Inactive: neutral background + `#323130` standard weight text
- Size: 88×40px desktop / 80×32px mobile

### Content resolution
`resolveLocaleContent(entry, locale)` in `src/lib/i18n/index.ts`:
- If `entry.locale === locale` → return entry as-is
- If translation exists for locale → spread override on top of entry
- Fallback: return canonical entry (no broken pages)

---

## Data Sync Scripts

```bash
# Fetch events from Meetup GraphQL API
MEETUP_KEY=<token> node scripts/sync-meetup-events.mjs [--dry-run]

# Fetch LinkedIn posts from RSS bridge
RSS_BRIDGE_URL=<url> node scripts/sync-linkedin-news.mjs [--dry-run]

# Derive speaker stubs from event data
node scripts/derive-speakers.mjs [--dry-run]

# Run all syncs
npm run sync
```

---

## Build & Deploy

```bash
# Local development
npm run dev

# Production build (Astro + Pagefind indexing)
npm run build

# Preview production build locally
npm run preview
```

Build output: `dist/` — uploaded to GitHub Pages via `.github/workflows/deploy.yml`.
Pagefind index: `dist/pagefind/` — generated at build time, not committed to git.

Deploy triggers on push to `nextgen` or `main` branch.

---

## Cutover to Production

See `CUTOVER.md` for the full pre-flight checklist and step-by-step cutover process
to switch from the legacy `master` branch to this `nextgen` branch.

**Summary:**
1. Verify GitHub Actions build passes on `nextgen`
2. Review all pages visually at the Pages preview URL
3. Disable legacy `static.yml` workflow on `master`
4. Update GitHub Pages source → `nextgen` branch (or rename to `main`)
5. Verify `https://azugfr.github.io` → `/fr` redirect works

---

## Spec Documents

- `requirements.md` — EARS requirements R1–R38 + R4a–R4o (includes i18n + language toggle design)
- `design.md` — Technical architecture, content schemas, route table, decision records
- `tasks.md` — Original 22-task implementation plan

---

## Penpot Design File State

All 9 Penpot pages updated:
- `0 · Design System` — canonical `LanguageToggle` specimen in `NavBar-specimen`
- `1 · Home` — desktop + mobile NavBar with LanguageToggle (mobile: toggle left of hamburger)
- `2 · Events`, `3 · Event Detail`, `4 · Speakers`, `5 · Speaker Detail`,
  `6 · Sponsors`, `7 · AI Showcase`, `8 · About & Contact` — desktop NavBar updated
- MTG logo updated across all 10 instances (old logo replaced)

---

## Known Issues / Follow-ups

- [ ] `src/components/sponsors/index.ts` has a pre-existing TS error (Astro `.astro` module declaration)
      → `src/env.d.ts` added `declare module "*.astro"` as workaround; may need refinement
- [ ] News + Resources pages were included in the T11 commit; T14/T17 agents confirmed they existed
- [ ] Pagefind search UI only works after `npm run build` (not `npm run dev`)
- [ ] Speaker photos are placeholder paths — real photos needed for production
- [ ] Meetup API authentication: requires `MEETUP_KEY` OAuth token (not yet set up in GitHub Actions secrets)
- [ ] RSS bridge URL: requires `RSS_BRIDGE_URL` env var in GitHub Actions secrets
- [ ] Legacy `gab.html` / `gabparis.html` images in `img/gab/` still on `master` — migrate to `public/img/gab/` before cutover
