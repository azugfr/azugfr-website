### [ANALYZE] - AZUG FR Website Specification Baseline - 2026-03-31T18:00:00Z
**Objective**: Define clear, testable requirements for the first production version of the AZUG FR website.
**Context**: The repository currently contains a legacy static HTML/CSS/JS website already deployed through GitHub Pages, with pages such as `index.html`, `blog.html`, `gab.html`, `gabparis.html`, and `single-post.html`, plus a Pages workflow that uploads the repository root directly. The requested target stack is Astro in static mode with Tailwind CSS, build-time content synchronization into `src/content`, Astro Content Collections with Zod schemas, Pagefind search, GitHub Pages deployment, and Penpot as the design source of truth. User preferences confirmed for this spec phase: support upcoming and archived events, implement news detail pages in the first phase, derive speakers from event data with optional manual overrides, and defer the dedicated `/global-azure-france` landing page until after core site pages.
**Decision**: Treat this document as the authoritative requirements artifact for the initial implementation plan, using EARS notation plus explicit scope, dependencies, edge cases, and validation targets.
**Execution**: Reviewed provided architectural constraints, current repository contents, legacy deployment workflow, and Penpot page inventory. Mapped requested IA to currently observed Penpot pages: `1 · Home`, `2 · Events`, `3 · Event Detail`, `4 · Speakers`, `5 · Speaker Detail`, `6 · Sponsors`, `7 · AI Showcase`, `8 · About & Contact`, and `0 · Design System`. Noted that dedicated News, Resources, and Global Azure France pages are not yet explicitly represented in the observed Penpot page list and should be treated as design-alignment follow-ups.
**Output**: Requirements, constraints, dependency graph, edge-case matrix, and confidence score are captured below.
**Validation**: Requirements are phrased as testable statements and trace directly to the requested information architecture and stack.
**Next**: Use these requirements as the input for `design.md`, then derive `tasks.md`.

## 1. Problem Statement

AZUG FR needs a static website that presents the community manifesto, events, news, speakers, resources, sponsors, and organization information in a way that is easy to maintain, easy to deploy to GitHub Pages, and grounded in Penpot designs while keeping build-time content files as the operational source of truth.

The current repository already hosts a legacy static site, so the work is a migration from hand-authored HTML/CSS/JS and direct-root Pages deployment toward an Astro- and content-driven architecture.

## 2. Scope

### In Scope

- Static Astro site deployed to GitHub Pages.
- Tailwind-based layout and styling.
- Build-time synchronization of:
  - Meetup events into `src/content/events/*.json`
  - LinkedIn RSS bridge posts into `src/content/news/*.json`
- Astro Content Collections with Zod schemas for:
  - `events`
  - `news`
  - `speakers`
  - `sponsors`
  - `resources`
- Pagefind-powered client-side search.
- Core routes:
  - `/`
  - `/events`
  - `/events/[slug]`
  - `/news`
  - `/news/[slug]`
  - `/speakers`
  - `/speakers/[slug]`
  - `/resources`
  - `/about`
- Post-core milestone route:
  - `/global-azure-france`
- Content-first authoring model where generated or curated files in `src/content` are treated as the source of truth at runtime.

### Out of Scope for Initial Core Milestone

- Server-side rendering.
- User authentication or personalized dashboards.
- Headless CMS integration beyond the specified build-time sync feeds.
- Real-time data fetching in production pages.
- Visual redesign beyond what is required to align implementation with Penpot and the design system.
- First-milestone implementation of `/global-azure-france`.

## 3. Assumptions and Constraints

- The Astro project will run in `output: "static"` mode.
- The current repository already includes a GitHub Pages workflow that uploads the repository root directly, so deployment must be migrated without breaking production publishing.
- Deployment target is GitHub Pages, so asset paths and base path behavior must be compatible with static hosting.
- Content files committed to `src/content` must be sufficient for local builds and preview environments even when external APIs are unavailable.
- Meetup and RSS ingestion runs at build-time or via explicit sync scripts before build.
- Penpot is the visual source of truth, but content schemas and checked-in content files are the implementation source of truth.
- Speaker profiles are primarily derived from event data, with optional manual overrides stored in `src/content/speakers`.
- Archived events are required in addition to upcoming events.
- News detail pages are required in the first implementation phase.
- Existing legacy content, media, and route intent should be inventoried and deliberately migrated, redirected, replaced, or retired rather than ignored implicitly.

## 4. Penpot Alignment Notes

Observed high-level pages in Penpot:

- `0 · Design System`
- `1 · Home`
- `2 · Events`
- `3 · Event Detail`
- `4 · Speakers`
- `5 · Speaker Detail`
- `6 · Sponsors`
- `7 · AI Showcase`
- `8 · About & Contact`
- `9 · Dev Guide`

Implications:

- Home, Events, Event Detail, Speakers, Speaker Detail, and About already have direct design counterparts.
- Sponsors and AI Showcase may supply sections or reusable patterns for core pages.
- News, Resources, and Global Azure France should be specified in a way that allows implementation before or alongside additional Penpot page design completion, while preserving design-system consistency.

## 5. Functional Requirements in EARS Notation

### Site Shell and Navigation

- **R1**: WHEN a visitor opens any page, THE SYSTEM SHALL render a consistent global header, navigation, footer, and brand treatment aligned with the Penpot design system.
- **R2**: WHEN a visitor navigates the site, THE SYSTEM SHALL expose only statically generated routes and assets compatible with GitHub Pages hosting.
- **R3**: WHERE a route is part of the primary information architecture, THE SYSTEM SHALL include it in navigation, footer links, or contextual links as appropriate to the page design.
- **R4**: IF a requested content page does not exist, THEN THE SYSTEM SHALL serve a static not-found experience consistent with the design system.
- **R4a**: WHEN replacing the legacy site, THE SYSTEM SHALL define how existing root-level pages and assets are migrated, redirected, or removed so the production site does not regress unexpectedly.

### Home

- **R5**: WHEN a visitor opens `/`, THE SYSTEM SHALL present the AZUG FR manifesto and community positioning.
- **R6**: WHEN at least one future event exists, THE SYSTEM SHALL highlight the next upcoming event on `/`.
- **R7**: IF no future event exists, THEN THE SYSTEM SHALL present a fallback state on `/` that communicates the absence of a scheduled event without leaving the featured section empty.
- **R8**: WHEN news items exist, THE SYSTEM SHALL show the latest news items on `/`.
- **R9**: WHEN sponsor data exists, THE SYSTEM SHALL show sponsor visibility on `/` according to the content model and design hierarchy.

### Events

- **R10**: WHEN a visitor opens `/events`, THE SYSTEM SHALL list upcoming and archived AZUG FR events from the `events` content collection.
- **R11**: WHEN event data includes time, venue, registration, and speaker fields, THE SYSTEM SHALL expose them in normalized page components on `/events` and `/events/[slug]`.
- **R12**: WHEN a visitor opens `/events/[slug]`, THE SYSTEM SHALL render a statically generated detail page for the matching event.
- **R13**: IF an event references speakers, THEN THE SYSTEM SHALL link to matching speaker profile pages when speaker records can be resolved.
- **R14**: IF a speaker reference cannot be resolved, THEN THE SYSTEM SHALL continue rendering the event page and surface the speaker as plain content rather than failing the build silently.

### News

- **R15**: WHEN a visitor opens `/news`, THE SYSTEM SHALL list news items sourced from the `news` content collection.
- **R16**: WHEN a visitor opens `/news/[slug]`, THE SYSTEM SHALL render a statically generated detail page for the matching news item.
- **R17**: IF a news item contains only excerpt-level data from the RSS bridge, THEN THE SYSTEM SHALL render the best available summary and link back to the original source when full content is unavailable.

### Speakers

- **R18**: WHEN a visitor opens `/speakers`, THE SYSTEM SHALL list contributor profiles from the `speakers` content collection.
- **R19**: WHEN speaker profiles are derivable from event data, THE SYSTEM SHALL support generating or enriching speaker records from events with optional manual overrides.
- **R20**: WHEN a visitor opens `/speakers/[slug]`, THE SYSTEM SHALL render a statically generated profile page with biography, expertise, related events, and external links when available.

### Resources

- **R21**: WHEN a visitor opens `/resources`, THE SYSTEM SHALL list curated slides, replay links, and related resource entries from the `resources` content collection.
- **R22**: IF a resource references an external platform such as YouTube or slide hosting, THEN THE SYSTEM SHALL render an accessible outbound link rather than requiring embedded playback.

### About

- **R23**: WHEN a visitor opens `/about`, THE SYSTEM SHALL present the manifesto, community history, organizers, and partners.
- **R24**: WHEN partner or organizer data exists in curated content, THE SYSTEM SHALL render it using reusable content sections that match the design system.

### Global Azure France

- **R25**: WHERE the flagship event landing page is enabled, THE SYSTEM SHALL expose `/global-azure-france` as a dedicated statically generated route.
- **R26**: WHILE `/global-azure-france` is not implemented in the first milestone, THE SYSTEM SHALL keep the route and related navigation out of the production build to avoid dead links.

### Search

- **R27**: WHEN the production build completes, THE SYSTEM SHALL generate a Pagefind index for searchable public content pages.
- **R28**: WHEN a visitor performs a client-side search, THE SYSTEM SHALL return relevant matches across supported collections without requiring a runtime backend.

### Build-Time Synchronization

- **R29**: WHEN the Meetup synchronization task runs, THE SYSTEM SHALL fetch event data and write normalized JSON files into `src/content/events`.
- **R30**: WHEN the LinkedIn RSS bridge synchronization task runs, THE SYSTEM SHALL fetch post data and write normalized JSON files into `src/content/news`.
- **R31**: IF external feed data is invalid, incomplete, or unavailable, THEN THE SYSTEM SHALL fail with explicit diagnostics or preserve the previously valid local content set according to the sync script policy.
- **R32**: WHEN sync output is written, THE SYSTEM SHALL produce stable slugs and deterministic field shapes suitable for Content Collections validation.

### Migration and Legacy Compatibility

- **R32a**: WHEN the Astro migration is introduced, THE SYSTEM SHALL preserve GitHub Pages deployment continuity by replacing the current root-upload workflow with a build-and-deploy workflow for generated output.
- **R32b**: WHEN legacy content or assets still provide business value, THE SYSTEM SHALL migrate them into the new content or public asset structure instead of losing them during framework migration.
- **R32c**: IF a legacy feature such as the PHP contact form cannot be supported on static hosting in its current form, THEN THE SYSTEM SHALL replace it with a static-compatible alternative or explicitly defer it with documented scope control.

### Content Collections and Validation

- **R33**: WHEN the site builds, THE SYSTEM SHALL validate `events`, `news`, `speakers`, `sponsors`, and `resources` entries with Zod-backed Astro Content Collections schemas.
- **R34**: IF a content entry violates its schema, THEN THE SYSTEM SHALL fail the build with actionable validation output.
- **R35**: WHEN cross-collection references exist, THE SYSTEM SHALL validate or normalize them so route generation and cross-links remain deterministic.

### Accessibility, SEO, and UX

- **R36**: WHEN any public page is rendered, THE SYSTEM SHALL provide semantic structure, accessible headings, keyboard-usable navigation, and sufficient text contrast.
- **R37**: WHEN content pages are generated, THE SYSTEM SHALL expose route-level metadata for title, description, canonical URL, and social sharing fields when available.
- **R38**: IF an image or sponsor logo is displayed, THEN THE SYSTEM SHALL support descriptive alt text or an explicit decorative treatment.

## 6. Dependency Graph

### External Dependencies

- Meetup GraphQL API
- RSS bridge provider for LinkedIn company posts
- GitHub Pages hosting constraints
- Penpot design file and design system
- Pagefind build/index tooling

### Internal Dependencies

1. Content schema definitions
2. Sync scripts that emit schema-compatible JSON
3. Content-driven route generation
4. Shared layouts and page components
5. Search indexing and search UI
6. Deployment workflow

### Primary Risks and Mitigations

- **Risk**: External APIs become unavailable during build.
  - **Mitigation**: Separate sync from site build where practical, keep committed content snapshots, and fail with explicit diagnostics.
- **Risk**: Migration from the existing static site drops important legacy pages, assets, or workflows.
  - **Mitigation**: Add a migration inventory, route mapping, and content carry-over plan before removing old entry points.
- **Risk**: Penpot coverage is incomplete for some planned pages.
  - **Mitigation**: Implement with design-system primitives and log follow-up design tasks for missing page-specific designs.
- **Risk**: Cross-collection references drift.
  - **Mitigation**: Use schema validation plus pre-build normalization checks.
- **Risk**: GitHub Pages base path issues break assets or Pagefind.
  - **Mitigation**: Define base path strategy early in implementation and validate on preview deployment.

## 7. Data Flow Summary

1. External feeds are fetched by sync scripts.
2. Sync scripts normalize raw payloads into `src/content/.../*.json`.
3. Astro Content Collections validate JSON and curated markdown/json content.
4. Static routes are generated from validated entries.
5. Pagefind indexes generated output for client-side search.
6. GitHub Pages serves the fully static build output.

## 8. Edge Case Matrix

| Case | Expected Behavior |
| --- | --- |
| No upcoming events | Home and events pages show an explicit empty/upcoming-soon state |
| Only archived events exist | `/events` still renders usable chronology and filters/grouping |
| RSS items missing body content | News detail pages render summary + source link |
| Duplicate event titles | Slug generation remains deterministic and collision-safe |
| Speaker names differ across events | Derivation step supports normalization and manual overrides |
| Sponsor missing logo | Page renders sponsor name/text fallback |
| External registration link missing | Event detail page omits CTA gracefully |
| Broken cross-reference | Build reports actionable validation error or degrades explicitly per schema policy |
| Search index missing in preview | Validation step catches Pagefind generation failure |
| Legacy route still receives traffic | Redirect, replacement page, or documented retirement path exists |
| Legacy PHP contact handling removed | Static-compatible fallback or explicit scope decision is in place |

## 9. Confidence Score

**Confidence Score**: 83%

### Rationale

- Confidence is high on architecture and information architecture because the requested stack, route inventory, and content-source model are explicit.
- Confidence is reduced because the repository is not empty but legacy, so migration decisions must be made alongside fresh architecture work, and some requested pages do not yet have clearly observed Penpot page counterparts.
- Confidence is therefore in the upper medium band, which supports a comprehensive design plus phased implementation plan with early validation of sync scripts and content schemas.

## 10. Decision Record

### Decision - 2026-03-31T18:05:00Z
**Decision**: Treat checked-in content files under `src/content` as the runtime source of truth, even when they are generated from external feeds.
**Context**: The site is static, deploys to GitHub Pages, depends on build-time data acquisition from Meetup and an RSS bridge, and is migrating away from manually maintained HTML pages.
**Options**: Runtime fetches from third-party APIs; build-time sync to local content files; a full CMS-backed workflow.
**Rationale**: Build-time synced content best matches static hosting, reproducible builds, and easy review in pull requests while avoiding runtime dependency on external APIs.
**Impact**: Implementation will require sync scripts, schema normalization, and clear validation, but site rendering stays deterministic and fast.
**Review**: Reassess only if the project later requires authenticated editing, higher-frequency publishing, or non-static hosting.
