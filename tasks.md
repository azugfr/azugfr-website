### [PLAN] - AZUG FR Website Implementation Plan - 2026-03-31T18:20:00Z
**Objective**: Define the implementation plan for the AZUG FR website in dependency order with clear deliverables and validation steps.
**Context**: `requirements.md` defines the scope and `design.md` defines the architecture. The repository already contains a legacy static site, so the plan starts with migration inventory and controlled Astro adoption rather than assuming a blank repository.
**Decision**: Organize work into atomic milestones that minimize cross-file churn and keep pull requests easy to review.
**Execution**: Broke implementation into dependency-first phases covering bootstrap, schemas, sync, routes, styling, search, validation, and deployment.
**Output**: Detailed tasks, outcomes, dependencies, and validation notes are listed below.
**Validation**: Each task includes objective completion criteria and can be mapped into SQL todos for execution.
**Next**: Start with repository bootstrap and content schema setup before any page implementation.

## 1. Milestone Ordering

1. Legacy inventory and migration mapping
2. Astro/Tailwind bootstrap
3. Content collections and schema layer
4. Sync pipelines
5. Shared layout/design-system primitives
6. Core content pages
7. Search integration
8. Deployment hardening
9. Post-core flagship page

## 2. Detailed Task Plan

| ID | Task | Expected Outcome | Depends On |
| --- | --- | --- | --- |
| T1 | Inventory legacy pages, assets, and behaviors | Explicit migration map for current HTML pages, assets, workflow, and PHP contact handling | None |
| T2 | Bootstrap Astro + Tailwind project | Working Astro static project with Tailwind, scripts, and base config alongside the migration plan | T1 |
| T3 | Configure Astro static deployment for GitHub Pages | Correct `site`, `base`, output settings, and workflow migration for Pages | T2 |
| T4 | Define Astro Content Collections in `src/content/config.ts` | Zod schemas for `events`, `news`, `speakers`, `sponsors`, `resources` | T2 |
| T5 | Create initial curated content fixtures | Minimal valid sample entries for all collections | T4 |
| T6 | Implement Meetup sync script | Deterministic event JSON generation into `src/content/events` | T4 |
| T7 | Implement LinkedIn RSS sync script | Deterministic news JSON generation into `src/content/news` | T4 |
| T8 | Add content normalization helpers | Stable slugs, date/status derivation, identity normalization | T4 |
| T9 | Add shared layout, SEO, and navigation primitives | Reusable shell aligned with Penpot patterns | T2 |
| T10 | Implement Home page | Manifesto, featured event, latest news, sponsors | T4, T9 |
| T11 | Implement Events list page | Upcoming and archived event listings | T4, T8, T9 |
| T12 | Implement Event detail page | Event detail route with metadata and speaker links | T4, T8, T9 |
| T13 | Implement News list and detail pages | News index and statically generated news details | T4, T9 |
| T14 | Implement speaker derivation/override pipeline | Stable speaker collection enrichment from events | T4, T6, T8 |
| T15 | Implement Speakers list and detail pages | Speaker directory with related events | T4, T9, T14 |
| T16 | Implement Resources page | Curated resources listing with external links | T4, T9 |
| T17 | Implement About page | Manifesto, history, organizers, partners | T4, T9 |
| T18 | Implement sponsor presentation components | Reusable sponsor cards/logos/tiers | T4, T9 |
| T19 | Integrate Pagefind search UI | Client-side search over supported content pages | T10, T11, T12, T13, T15, T16, T17 |
| T20 | Replace legacy deploy flow and retire superseded files safely | Astro build/deploy workflow live with a documented retirement path for old root artifacts | T1, T3, T19 |
| T21 | Implement `/global-azure-france` landing page | Flagship page built after core routes | T9, T17, T20 |

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

#### Task T3 - Configure GitHub Pages behavior
- Set Astro static output and page base configuration.
- Replace the root-upload workflow with generated-output deployment.
- Verify asset paths in preview.
- **Validation**: Preview build behaves correctly under the configured base path.

#### Task T4 - Define content collections
- Implement `src/content/config.ts`.
- Encode Zod schemas from `design.md`.
- Add reference validation helpers where needed.
- **Validation**: Invalid fixture entries fail the build.

#### Task T5 - Create initial fixtures
- Add representative entries for each collection.
- Include empty-state-safe fixtures where appropriate.
- **Validation**: Core pages can render from sample content before sync scripts exist.

### Phase C - Data Ingestion

#### Task T6 - Meetup sync
- Fetch and normalize event data.
- Write deterministic JSON files.
- Mark event status and slug.
- **Validation**: Fixture-backed or live dry-run emits schema-valid event files.

#### Task T7 - LinkedIn RSS sync
- Fetch and normalize news items.
- Preserve source URLs and publish dates.
- **Validation**: Generated news entries pass schema validation.

#### Task T8 - Content normalization helpers
- Centralize slugging, dedupe, identity resolution, and date formatting inputs.
- **Validation**: Helper tests cover collisions and missing optional fields.

### Phase D - Shared UI

#### Task T9 - Shared layout and design primitives
- Create `BaseLayout`, common section wrappers, cards, metadata rows, and navigation/footer.
- Translate Penpot patterns into reusable Tailwind component structure.
- **Validation**: Home and list pages can be assembled without page-specific CSS hacks.

### Phase E - Core Routes

#### Task T10 - Home
- Add manifesto, next event, latest news, sponsor highlights.
- Handle no-upcoming-event state.
- **Validation**: Home renders with and without future events.

#### Task T11 - Events list
- Group or segment upcoming and archived events.
- Add cards and filter-ready structure if needed.
- **Validation**: Correct ordering and grouping.

#### Task T12 - Event detail
- Show schedule, venue, registration, description, and speakers.
- **Validation**: Missing optional fields do not break rendering.

#### Task T13 - News list/detail
- Create list and detail routes from `news`.
- Support summary fallback + source link.
- **Validation**: Entries without full content still render valid detail pages.

#### Task T14 - Speaker derivation pipeline
- Build normalization/merge logic from events to speakers.
- Support manual override data shape.
- **Validation**: Duplicated or variant speaker names resolve deterministically.

#### Task T15 - Speakers list/detail
- Render speaker directory and profiles.
- Link related events.
- **Validation**: Speaker pages render even when optional profile fields are sparse.

#### Task T16 - Resources
- Render resource list with type badges and external links.
- **Validation**: No embedded player dependency is required for completion.

#### Task T17 - About
- Render manifesto, history, organizers, and partners using curated content.
- **Validation**: Page remains useful even with partial partner data.

#### Task T18 - Sponsor components
- Implement reusable sponsor display blocks for home/about or dedicated sections.
- **Validation**: Missing logos degrade to text treatment.

### Phase F - Search and Delivery

#### Task T19 - Pagefind search
- Add search UI and production indexing hook.
- Limit indexed pages to public content routes.
- **Validation**: Search returns results for representative fixture content.

#### Task T20 - Replace legacy deploy flow and retire superseded files safely
- Replace the existing Pages workflow that uploads `.` with an Astro build-and-deploy sequence.
- Retire or archive superseded root HTML/CSS/JS/PHP artifacts only after replacements are in place.
- **Validation**: CI can build deterministically from committed content snapshots and deploy generated output without broken routes.

### Phase G - Post-Core

#### Task T21 - Global Azure France
- Implement dedicated landing page after core routes are stable.
- **Validation**: Route is hidden until complete, then promoted intentionally.

## 4. Validation Matrix

| Requirement Area | Validation Method |
| --- | --- |
| Static hosting compatibility | Astro build + GitHub Pages preview |
| Content schema correctness | Content Collection validation |
| External data normalization | Sync fixtures and dry-run outputs |
| Page completeness | Route-level smoke tests and manual review |
| Search | Pagefind output existence and query smoke test |
| Accessibility baseline | Manual keyboard/heading/contrast review |
| Penpot alignment | Visual comparison on shared core pages |

## 5. Recommended PR Slicing

1. Legacy inventory + Astro bootstrap
2. Content schemas + fixtures
3. Sync scripts + normalization helpers
4. Shared layout + home/events
5. News + speakers
6. Resources + about + sponsors
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
