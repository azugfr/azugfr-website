### [PLAN] - AZUG FR Website Implementation Plan - 2026-03-31T18:20:00Z
**Objective**: Define the implementation plan for the AZUG FR website in dependency order with clear deliverables and validation steps.
**Context**: `requirements.md` defines the scope and `design.md` defines the architecture. The repository already contains a legacy static site, so the plan starts with migration inventory and controlled Astro adoption rather than assuming a blank repository. The target experience must also support French and English as first-class locales.
**Decision**: Organize work into atomic milestones that minimize cross-file churn and keep pull requests easy to review.
**Execution**: Broke implementation into dependency-first phases covering bootstrap, schemas, sync, routes, styling, search, validation, and deployment.
**Output**: Detailed tasks, outcomes, dependencies, and validation notes are listed below.
**Validation**: Each task includes objective completion criteria and can be mapped into SQL todos for execution.
**Next**: Start with repository bootstrap and content schema setup before any page implementation.

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

| ID | Task | Expected Outcome | Depends On |
| --- | --- | --- | --- |
| T1 | Inventory legacy pages, assets, and behaviors | Explicit migration map for current HTML pages, assets, workflow, and PHP contact handling | None |
| T2 | Bootstrap Astro + Tailwind project | Working Astro static project with Tailwind, scripts, and base config alongside the migration plan | T1 |
| T3 | Establish localization foundation | Locale strategy, dictionaries, route policy, fallback rules, and locale switcher model for `fr` and `en` | T2 |
| T4 | Configure Astro static deployment for GitHub Pages | Correct `site`, `base`, output settings, and workflow migration for Pages | T2, T3 |
| T5 | Define Astro Content Collections in `src/content/config.ts` | Zod schemas for `events`, `news`, `speakers`, `sponsors`, `resources` with locale-aware modeling | T2, T3 |
| T6 | Create initial curated content fixtures | Minimal valid bilingual sample entries for all collections | T5 |
| T7 | Implement Meetup sync script | Deterministic event JSON generation into `src/content/events` with locale-aware output or fallback markers | T5 |
| T8 | Implement LinkedIn RSS sync script | Deterministic news JSON generation into `src/content/news` with locale-aware output or fallback markers | T5 |
| T9 | Add content normalization helpers | Stable slugs, date/status derivation, identity normalization, and locale resolution | T5 |
| T10 | Add shared layout, SEO, and navigation primitives | Reusable shell aligned with Penpot patterns and bilingual UI chrome | T2, T3 |
| T11 | Implement Home page | Manifesto, featured event, latest news, sponsors in FR and EN | T5, T10 |
| T12 | Implement Events list page | Upcoming and archived event listings in localized routes | T5, T9, T10 |
| T13 | Implement Event detail page | Event detail route with localized metadata and speaker links | T5, T9, T10 |
| T14 | Implement News list and detail pages | Localized news index and statically generated news details | T5, T10 |
| T15 | Implement speaker derivation/override pipeline | Stable speaker collection enrichment from events with locale-aware fields | T5, T7, T9 |
| T16 | Implement Speakers list and detail pages | Localized speaker directory with related events | T5, T10, T15 |
| T17 | Implement Resources page | Localized curated resources listing with external links | T5, T10 |
| T18 | Implement About page | Manifesto, history, organizers, partners in FR and EN | T5, T10 |
| T19 | Implement sponsor presentation components | Reusable sponsor cards/logos/tiers with localized descriptive content where needed | T5, T10 |
| T20 | Integrate Pagefind search UI | Client-side search over supported content pages with locale-aware behavior | T11, T12, T13, T14, T16, T17, T18 |
| T21 | Replace legacy deploy flow and retire superseded files safely | Astro build/deploy workflow live with a documented retirement path for old root artifacts | T1, T4, T20 |
| T22 | Implement `/global-azure-france` landing page | Flagship page built after core routes in FR and EN | T10, T18, T21 |

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
