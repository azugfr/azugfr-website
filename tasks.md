### [PLAN] - AZUG FR Website Implementation Plan - 2026-03-31T18:20:00Z
**Objective**: Define the implementation plan for the AZUG FR website in dependency order with clear deliverables and validation steps.
**Context**: `requirements.md` defines the scope and `design.md` defines the architecture. The repository already contains a legacy static site, so the plan starts with migration inventory and controlled Astro adoption rather than assuming a blank repository. The target experience must also support French and English as first-class locales.
**Decision**: Organize work into atomic milestones that minimize cross-file churn and keep pull requests easy to review.
**Execution**: Broke implementation into dependency-first phases covering bootstrap, schemas, sync, routes, styling, search, validation, and deployment.
**Output**: Detailed tasks, outcomes, dependencies, and validation notes are listed below.
**Validation**: Each task includes objective completion criteria and can be mapped into SQL todos for execution.
**Next**: All T1–T22 tasks are complete. The site builds 18 pages across FR/EN. Refer to `CUTOVER.md` for the production switch playbook.

---

### [STATUS] - 2026-04-14T10:26:00Z

**All 22 tasks complete.** The `nextgen` branch contains a fully working Astro 5 static site with:
- FR/EN bilingual routing (`/fr/*`, `/en/*`) with language toggle
- Content Collections (Zod-validated) for events, news, speakers, sponsors, resources
- Bilingual content fixtures + sync scripts (Meetup GraphQL, LinkedIn RSS)
- 18 statically generated pages (9 routes × 2 locales)
- Pagefind client-side search indexed at build time
- GitHub Pages deploy workflow + `CUTOVER.md` playbook

**Branch**: `nextgen` → `origin/nextgen`
**Build output**: 18 pages, 0 errors
**Pagefind**: 14 content pages indexed (FR + EN)
**Ready for production**: follow `CUTOVER.md` to switch Pages source from `master` to `nextgen`

## 1. Milestone Ordering

1. Legacy inventory and migration mapping
2. Astro/Tailwind bootstrap
3. Localization foundation
4. Content collections and schema layer
5. Sync pipelines
6. Shared layout/design-system primitives
7. Core content pages
8. Search integration
9. Deployment hardening
10. Post-core flagship page

## 2. Detailed Task Plan

| ID | Task | Status | Expected Outcome | Depends On |
| --- | --- | --- | --- | --- |
| T1 | Inventory legacy pages, assets, and behaviors | ✅ done | `MIGRATION_MAP.md` — explicit disposition for all legacy HTML, CSS, JS, PHP, and CI artifacts | None |
| T2 | Bootstrap Astro + Tailwind project | ✅ done | `astro.config.mjs`, `package.json`, `tailwind.config.mjs`, `tsconfig.json` — working static build | T1 |
| T3 | Establish localization foundation | ✅ done | `src/data/i18n/fr.ts`, `en.ts`, `src/lib/i18n/index.ts` — `Locale`, `UiDictionary`, `resolveLocaleContent`, `getLocalizedRoute` | T2 |
| T4 | Configure Astro static deployment for GitHub Pages | ✅ done | `.github/workflows/deploy.yml` — Astro build + Pages deploy on `nextgen`/`main` push | T2, T3 |
| T5 | Define Astro Content Collections in `src/content/config.ts` | ✅ done | Zod schemas for all 5 collections with bilingual model (locale + translations sub-object); exported TS types | T2, T3 |
| T6 | Create initial curated content fixtures | ✅ done | 6 bilingual JSON files across all 5 collections; build validates all entries | T5 |
| T7 | Implement Meetup sync script | ✅ done | `scripts/sync-meetup-events.mjs` — GraphQL fetch, normalization, dry-run, `npm run sync:events` | T5 |
| T8 | Implement LinkedIn RSS sync script | ✅ done | `scripts/sync-linkedin-news.mjs` — RSS parse, normalization, dry-run, `npm run sync:news` | T5 |
| T9 | Add content normalization helpers | ✅ done | `src/lib/content/`: `slugify.ts`, `eventStatus.ts`, `contentHelpers.ts` (9 async helpers), `speakerDerive.ts`, `index.ts` | T5 |
| T10 | Add shared layout, SEO, and navigation primitives | ✅ done | `BaseLayout.astro`, `ContentLayout.astro`, `NavBar.astro` (desktop+mobile+hamburger), `LanguageToggle.astro` (FR\|EN), `Footer.astro` | T2, T3 |
| T11 | Implement Home page | ✅ done | `/fr`, `/en` — hero, featured event, latest 3 news, sponsors; `/` redirects to `/fr` | T5, T10 |
| T12 | Implement Events list page | ✅ done | `/[locale]/events` — upcoming + archived sections, `EventCard` component | T5, T9, T10 |
| T13 | Implement Event detail page | ✅ done | `/[locale]/events/[slug]` — meta row, description, registration CTA, resolved speaker grid | T5, T9, T10 |
| T14 | Implement News list and detail pages | ✅ done | `/[locale]/news` and `/[locale]/news/[slug]` — content/summary fallback, source link | T5, T10 |
| T15 | Implement speaker derivation/override pipeline | ✅ done | `scripts/derive-speakers.mjs` — reads events, emits/merges speaker stubs, preserves manual overrides, `npm run derive:speakers` | T5, T7, T9 |
| T16 | Implement Speakers list and detail pages | ✅ done | `/[locale]/speakers` and `/[locale]/speakers/[slug]` — avatar, bio, expertise, related events | T5, T10, T15 |
| T17 | Implement Resources page | ✅ done | `/[locale]/resources` — type icons, responsive grid, external links | T5, T10 |
| T18 | Implement About page | ✅ done | `/[locale]/about` — manifesto, history, mission, organizers, community links; `src/data/about.ts` | T5, T10 |
| T19 | Implement sponsor presentation components | ✅ done | `SponsorCard.astro`, `SponsorGrid.astro` — tiered badges, logo/fallback, `src/components/sponsors/index.ts` | T5, T10 |
| T20 | Integrate Pagefind search UI | ✅ done | `/[locale]/search`, `data-pagefind-body` on layouts, post-build indexing in `npm run build`, 14 pages indexed | T11–T18 |
| T21 | Replace legacy deploy flow and retire superseded files safely | ✅ done | `src/pages/404.astro`, `.github/CODEOWNERS`, `CUTOVER.md`, deploy triggers on `nextgen`+`main` | T1, T4, T20 |
| T22 | Implement `/global-azure-france` landing page | ✅ done | `/[locale]/global-azure-france` — historical editions from `gab.html`/`gabparis.html`, `src/data/globalAzure.ts`, footer link | T10, T18, T21 |

## 3. Phase Details

### Phase A - Migration Discovery

#### Task T1 - Inventory legacy pages, assets, and behaviors
- Document what happens to `index.html`, `blog.html`, `single-post.html`, `gab.html`, `gabparis.html`, legacy CSS/JS assets, and `process.php`.
- Decide whether each item is migrated, redirected, replaced, or retired.
- Capture any production-critical assets that must move into `public/`.
- **Validation**: No legacy production artifact is removed without an explicit replacement or retirement decision.

### Phase B - Foundation

#### Task T2 - Bootstrap Astro + Tailwind project
- Initialize Astro project files and package scripts.
- Add Tailwind integration and base styles.
- Ensure local build works without external data.
- **Validation**: `astro build` succeeds with fixtures.

#### Task T3 - Establish localization foundation
- Decide route structure for `/fr/*` and `/en/*`.
- Define default locale, alternate locale behavior, and fallback rules.
- Create a shared model for translated UI labels and locale switching.
- **Validation**: Localized route helpers and dictionary loading are deterministic.

#### Task T4 - Configure GitHub Pages behavior
- Set Astro static output and page base configuration.
- Replace the root-upload workflow with generated-output deployment.
- Verify asset paths in preview.
- **Validation**: Preview build behaves correctly under the configured base path.

#### Task T5 - Define content collections
- Implement `src/content/config.ts`.
- Encode Zod schemas from `design.md`, including locale-aware fields or entries.
- Add reference validation helpers where needed.
- **Validation**: Invalid fixture entries fail the build.

#### Task T6 - Create initial fixtures
- Add representative bilingual entries for each collection.
- Include empty-state-safe fixtures where appropriate.
- **Validation**: Core pages can render from sample content before sync scripts exist.

### Phase C - Data Ingestion

#### Task T7 - Meetup sync
- Fetch and normalize event data.
- Write deterministic JSON files.
- Mark event status and slug.
- Encode locale-aware output or fallback markers.
- **Validation**: Fixture-backed or live dry-run emits schema-valid event files.

#### Task T8 - LinkedIn RSS sync
- Fetch and normalize news items.
- Preserve source URLs and publish dates.
- Encode locale-aware output or fallback markers.
- **Validation**: Generated news entries pass schema validation.

#### Task T9 - Content normalization helpers
- Centralize slugging, dedupe, identity resolution, date formatting inputs, and locale resolution.
- **Validation**: Helper tests cover collisions, missing optional fields, and locale fallbacks.

### Phase D - Shared UI

#### Task T10 - Shared layout and design primitives
- Create `BaseLayout`, common section wrappers, cards, metadata rows, and navigation/footer.
- Translate Penpot patterns into reusable Tailwind component structure.
- Make shared UI locale-aware, including the language switcher and translated labels.
- **Validation**: Home and list pages can be assembled without page-specific CSS hacks.

### Phase E - Core Routes

#### Task T11 - Home
- Add manifesto, next event, latest news, sponsor highlights.
- Handle no-upcoming-event state.
- **Validation**: Home renders correctly in French and English, with and without future events.

#### Task T12 - Events list
- Group or segment upcoming and archived events.
- Add cards and filter-ready structure if needed.
- **Validation**: Correct ordering, grouping, and locale-specific labeling.

#### Task T13 - Event detail
- Show schedule, venue, registration, description, and speakers.
- **Validation**: Missing optional fields do not break rendering and locale metadata is correct.

#### Task T14 - News list/detail
- Create list and detail routes from `news`.
- Support summary fallback + source link.
- **Validation**: Entries without full content still render valid detail pages in both locales.

#### Task T15 - Speaker derivation pipeline
- Build normalization/merge logic from events to speakers.
- Support manual override data shape.
- **Validation**: Duplicated or variant speaker names resolve deterministically and localized fields stay aligned.

#### Task T16 - Speakers list/detail
- Render speaker directory and profiles.
- Link related events.
- **Validation**: Speaker pages render even when optional profile fields are sparse and locale switching remains stable.

#### Task T17 - Resources
- Render resource list with type badges and external links.
- **Validation**: No embedded player dependency is required for completion and localized labels render correctly.

#### Task T18 - About
- Render manifesto, history, organizers, and partners using curated content.
- **Validation**: Page remains useful in both locales even with partial partner data.

#### Task T19 - Sponsor components
- Implement reusable sponsor display blocks for home/about or dedicated sections.
- **Validation**: Missing logos degrade to text treatment.

### Phase F - Search and Delivery

#### Task T20 - Pagefind search
- Add search UI and production indexing hook.
- Limit indexed pages to public content routes.
- Define whether indexes are per-locale or shared with locale filtering.
- **Validation**: Search returns results for representative fixture content in the active locale.

#### Task T21 - Replace legacy deploy flow and retire superseded files safely
- Replace the existing Pages workflow that uploads `.` with an Astro build-and-deploy sequence.
- Retire or archive superseded root HTML/CSS/JS/PHP artifacts only after replacements are in place.
- **Validation**: CI can build deterministically from committed content snapshots and deploy generated output without broken routes.

### Phase G - Post-Core

#### Task T22 - Global Azure France
- Implement dedicated landing page after core routes are stable.
- **Validation**: Route is hidden until complete, then promoted intentionally in both locales.

## 4. Validation Matrix

| Requirement Area | Validation Method |
| --- | --- |
| Static hosting compatibility | Astro build + GitHub Pages preview |
| Multilingual routing | Locale route generation and switcher validation |
| Content schema correctness | Content Collection validation |
| External data normalization | Sync fixtures and dry-run outputs |
| Page completeness | Route-level smoke tests and manual review |
| Search | Pagefind output existence and locale-aware query smoke test |
| Accessibility baseline | Manual keyboard/heading/contrast review |
| Penpot alignment | Visual comparison on shared core pages |

## 5. Recommended PR Slicing

1. Legacy inventory + Astro bootstrap
2. Localization foundation + content schemas
3. Bilingual fixtures + sync scripts
4. Shared layout + localized home/events
5. Localized news + speakers
6. Localized resources + about + sponsors
7. Search + deployment migration
8. Global Azure France

## 6. Decision Record

### Decision - 2026-03-31T18:22:00Z
**Decision**: Defer `/global-azure-france` until after core site routes are complete.
**Context**: The user explicitly prioritized core site pages first.
**Options**: Build flagship page immediately; defer until core information architecture is stable.
**Rationale**: Deferral reduces risk and keeps the first implementation milestone focused on reusable infrastructure and primary community content.
**Impact**: Core architecture ships sooner; flagship experience becomes a clean follow-on milestone.
**Review**: Reassess once core pages, search, and deployment are stable.
