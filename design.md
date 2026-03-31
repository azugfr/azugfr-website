### [DESIGN] - AZUG FR Website Technical Design - 2026-03-31T18:10:00Z
**Objective**: Define the architecture, interfaces, data models, and validation strategy for the AZUG FR static website.
**Context**: Requirements are captured in `requirements.md`. The repository currently ships a legacy static HTML site through a GitHub Pages workflow that uploads the repository root directly. The target state is Astro static output on GitHub Pages with Tailwind CSS, build-time content sync, Astro Content Collections, Pagefind search, and Penpot-guided UI implementation.
**Decision**: Use a content-first, schema-validated static architecture with build-time ingestion and collection-driven route generation, executed as a controlled migration from the existing legacy site.
**Execution**: Converted requirements into an implementable architecture, documented interfaces and normalized models, defined failure handling, and structured the validation strategy around Astro, Zod, and static build outputs.
**Output**: Architecture, data flow, interfaces, models, error matrix, and test strategy are documented below.
**Validation**: Design elements map directly to the requirements IDs and can be implemented incrementally with deterministic build checks.
**Next**: Execute `tasks.md` in dependency order, starting with project bootstrap and schema definitions.

## 1. Adaptive Execution Strategy

Because the confidence score is **83%**, this work follows the **medium-confidence** path:

- Build the project in production-like shape from the start.
- Prioritize early validation of content schemas and sync pipelines.
- Keep implementation atomic so feed normalization and route generation can be tested independently.
- Treat missing Penpot coverage for News, Resources, and Global Azure France as bounded design follow-ups rather than blockers.

## 2. Architecture Overview

### Migration Architecture

- **Current state**: root-level static HTML pages, Bootstrap/custom CSS, jQuery-era JavaScript, direct GitHub Pages artifact upload, and a PHP contact handler that is not compatible with a purely static deployment target.
- **Target state**: Astro project with generated static output, collection-backed content, reusable Tailwind components, and a deployment workflow that uploads build output instead of repository root contents.
- **Migration principle**: replace legacy pages intentionally, preserve reusable assets where appropriate, and document route carry-over or retirement.

### Runtime Architecture

- **Framework**: Astro with `output: "static"`
- **Styling**: Tailwind CSS
- **Search**: Pagefind client-side index and UI integration
- **Deployment**: GitHub Pages
- **Rendering Model**: Static HTML pages generated from validated content collections

### Build-Time Architecture

- **Sync layer**
  - Meetup GraphQL fetcher -> normalized `events` JSON files
  - RSS bridge fetcher -> normalized `news` JSON files
- **Content layer**
  - Astro Content Collections + Zod schemas
  - Optional curated markdown/JSON for speakers, sponsors, resources, about content
- **Presentation layer**
  - Shared layouts, section components, and content card components
- **Search layer**
  - Pagefind post-build indexing of generated pages

### Legacy-to-Target Mapping

| Current Asset/Route | Target Treatment |
| --- | --- |
| `index.html` | Replace with `src/pages/index.astro` |
| `blog.html` and `single-post.html` | Replace with `/news` and `/news/[slug]` |
| `gab.html` and `gabparis.html` | Re-express as event content and, later, flagship or event-specific landing pages |
| `style.css`, `css/*` | Replace progressively with Tailwind-based styling and only retain static assets that are still needed |
| `js/*` | Remove or replace with minimal Astro/client behavior as needed |
| `process.php` | Replace with static-compatible contact strategy or documented deferral |
| `.github/workflows/static.yml` | Replace with Astro build + Pages deploy workflow |

## 3. Proposed File/Module Structure

```text
/
├─ astro.config.mjs
├─ package.json
├─ tailwind.config.mjs
├─ requirements.md
├─ design.md
├─ tasks.md
├─ public/
│  └─ ...
├─ scripts/
│  ├─ sync-meetup-events.mjs
│  ├─ sync-linkedin-news.mjs
│  └─ normalize-content-utils.mjs
└─ src/
   ├─ content/
   │  ├─ config.ts
   │  ├─ events/*.json
   │  ├─ news/*.json
   │  ├─ speakers/*.{json,md}
   │  ├─ sponsors/*.{json,md}
   │  └─ resources/*.{json,md}
   ├─ data/
   │  └─ site.ts
   ├─ layouts/
   │  ├─ BaseLayout.astro
   │  └─ ContentLayout.astro
   ├─ components/
   │  ├─ site/
   │  ├─ events/
   │  ├─ news/
   │  ├─ speakers/
   │  ├─ resources/
   │  └─ search/
   ├─ lib/
   │  ├─ content/
   │  ├─ seo/
   │  ├─ routes/
   │  └─ format/
   └─ pages/
      ├─ index.astro
      ├─ about.astro
      ├─ resources.astro
      ├─ news/
      ├─ events/
      ├─ speakers/
      └─ global-azure-france.astro
```

## 4. System Interaction and Data Flow

### Sequence

```text
Meetup API --------\
                    -> Sync scripts -> Normalized JSON -> Content Collections validation
RSS bridge --------/                                       |
                                                           v
                                                  Astro route generation
                                                           |
                                                           v
                                                    Static HTML output
                                                           |
                                                           v
                                                   Pagefind indexing
                                                           |
                                                           v
                                                   GitHub Pages deploy
```

### Content Responsibility Split

- **Generated content**
  - `events`
  - `news`
- **Curated content**
  - `speakers` manual overrides and enrichments
  - `sponsors`
  - `resources`
  - about/manifesto/history data

## 5. Route Design

| Route | Source | Notes |
| --- | --- | --- |
| `/` | Aggregated collections + site data | Manifesto, next event, latest news, sponsors |
| `/events` | `events` | Upcoming + archived grouping |
| `/events/[slug]` | `events` | Per-event detail pages |
| `/news` | `news` | Chronological list |
| `/news/[slug]` | `news` | Full or summary + source link |
| `/speakers` | `speakers` | List and discovery page |
| `/speakers/[slug]` | `speakers` | Speaker details + related events |
| `/resources` | `resources` | Replay/slide listing |
| `/about` | Curated data/content | Manifesto, history, organizers, partners |
| `/global-azure-france` | Curated page content | Implemented after core milestone |

## 6. Content Collection Schemas

### `events`

Recommended fields:

- `slug: string`
- `title: string`
- `summary: string`
- `description?: string`
- `startDate: string`
- `endDate?: string`
- `timezone: string`
- `status: "upcoming" | "past" | "cancelled"`
- `venue?: { name?: string; city?: string; address?: string; mode: "in_person" | "online" | "hybrid" }`
- `registrationUrl?: string`
- `meetupUrl?: string`
- `heroImage?: string`
- `speakerSlugs?: string[]`
- `tags?: string[]`
- `source: { provider: "meetup"; externalId: string; lastSyncedAt: string }`

### `news`

- `slug: string`
- `title: string`
- `summary: string`
- `content?: string`
- `publishedAt: string`
- `author?: string`
- `sourceUrl: string`
- `image?: string`
- `tags?: string[]`
- `source: { provider: "linkedin-rss"; externalId: string; lastSyncedAt: string }`

### `speakers`

- `slug: string`
- `name: string`
- `headline?: string`
- `bio?: string`
- `photo?: string`
- `company?: string`
- `role?: string`
- `location?: string`
- `expertise?: string[]`
- `links?: { website?: string; linkedin?: string; github?: string; x?: string }`
- `derivedFrom?: { eventSourceIds?: string[]; displayNameVariants?: string[] }`

### `sponsors`

- `slug: string`
- `name: string`
- `tier?: string`
- `description?: string`
- `website: string`
- `logo?: string`
- `alt?: string`
- `featured?: boolean`

### `resources`

- `slug: string`
- `title: string`
- `type: "slides" | "video" | "article" | "repository" | "other"`
- `summary?: string`
- `url: string`
- `eventSlug?: string`
- `speakerSlugs?: string[]`
- `publishedAt?: string`

## 7. Interface Contracts

### Sync Script Contracts

#### Meetup sync output

- Input: Meetup GraphQL credentials/configuration
- Output: One normalized JSON file per event in `src/content/events`
- Guarantees:
  - Stable slug generation
  - Required date/title/source fields
  - Explicit status derivation (`upcoming`, `past`, `cancelled`)

#### LinkedIn RSS sync output

- Input: RSS bridge URL
- Output: One normalized JSON file per post in `src/content/news`
- Guarantees:
  - Stable slug generation
  - Valid publish date
  - Original source URL preserved

### Content Utility Contracts

- `getUpcomingEvents(): EventEntry[]`
- `getArchivedEvents(): EventEntry[]`
- `getFeaturedEvent(): EventEntry | null`
- `getLatestNews(limit: number): NewsEntry[]`
- `getSpeakerBySlug(slug: string): SpeakerEntry | undefined`
- `getRelatedEventsForSpeaker(slug: string): EventEntry[]`
- `getFeaturedSponsors(): SponsorEntry[]`

These should be pure, build-time-safe helpers with no runtime network access.

### Migration Utility Contracts

- `mapLegacyRoutes(): LegacyRouteMap[]`
- `inventoryLegacyAssets(): LegacyAssetRecord[]`
- `resolveContactStrategy(): "defer" | "third_party_form" | "static_mailto"`

These are design-time planning helpers, not necessarily runtime modules, but the migration work should treat them as explicit concerns.

## 8. Shared UI and Design-System Strategy

- Build shared layout primitives first:
  - container
  - section wrapper
  - page hero
  - grid/list cards
  - CTA/button styles
  - metadata row
- Translate Penpot patterns into Astro + Tailwind primitives rather than one-off page CSS.
- Use the Penpot design system page as the visual anchor for spacing, typography, logo usage, and card patterns.
- For pages not explicitly available in Penpot, reuse established primitives from Home, Events, and About patterns.

## 9. Error Handling Matrix

| Failure Mode | Detection Point | Expected Response |
| --- | --- | --- |
| Missing Meetup credentials | Sync script startup | Exit with explicit error message and non-zero status |
| Invalid Meetup payload | Normalization step | Fail sync with field-level diagnostics |
| RSS feed unavailable | Sync script fetch | Exit with explicit error and preserve previous committed content |
| Invalid JSON content | Astro collection validation | Fail build with schema error |
| Duplicate slug | Normalization or collection validation | Fail build with duplicate identifier report |
| Broken cross-reference | Content validation helper | Fail build or emit explicit warning based on policy, never silent |
| Empty search index | Post-build validation | Fail CI or preview validation |
| GitHub Pages base mismatch | Preview/deploy validation | Fail deployment check with actionable config guidance |

## 10. Testing Strategy

### Unit-Level Validation

- Schema validation for each content collection
- Slug normalization tests
- Event status derivation tests
- Speaker derivation and override merge tests
- Collection helper tests for sorted/grouped outputs

### Integration-Level Validation

- Sync script dry-run or fixture-driven tests
- Astro build succeeds with representative fixture content
- Static route generation count matches expected collection sizes
- Pagefind index is generated after build
- Legacy route mapping is reviewed before removing old root HTML files

### Manual Validation

- Visual review against Penpot for:
  - Home
  - Events list/detail
  - Speakers list/detail
  - About
- Smoke check responsive layouts
- Keyboard navigation and heading hierarchy review
- GitHub Pages preview validation for asset and route correctness
- Migration review of legacy assets/pages to confirm intended retention or retirement

## 11. Performance and Maintainability Considerations

- Prefer static content lookups over heavyweight client islands.
- Keep search UI as the primary client-side enhancement.
- Normalize external feeds into minimal, stable shapes to reduce rendering complexity.
- Use collection helpers for sorting, grouping, and relationship resolution to keep `.astro` files focused on presentation.

## 12. Decision Records

### Decision - 2026-03-31T18:12:00Z
**Decision**: Use generated JSON files in `src/content` as the boundary between external data synchronization and page generation.
**Context**: The application must be fully static and easy to review in pull requests while consuming third-party content feeds during a migration away from legacy static HTML files.
**Options**: Direct network calls during page generation; generated content snapshots; external CMS with API fetches.
**Rationale**: Generated snapshots isolate third-party volatility, simplify debugging, and fit Astro Content Collections naturally.
**Impact**: Requires dedicated sync scripts and validation, but makes builds reproducible and hosting-simple.
**Review**: Revisit if editors need a non-git publishing workflow.

### Decision - 2026-03-31T18:30:00Z
**Decision**: Treat the implementation as a migration project rather than a greenfield rebuild.
**Context**: Repository analysis showed an existing HTML/CSS/JS site, active GitHub Pages deployment, legacy event pages, and a PHP form handler.
**Options**: Ignore the legacy site and rebuild from scratch; preserve all legacy files indefinitely; migrate deliberately with explicit route and asset mapping.
**Rationale**: A migration framing reduces the risk of losing useful content or breaking production behavior while still enabling a modern Astro architecture.
**Impact**: Tasks must include inventory, route replacement, deployment workflow replacement, and a decision on unsupported legacy server-side behavior.
**Review**: Reassess once the first Astro-based production release is live.

### Decision - 2026-03-31T18:14:00Z
**Decision**: Derive speaker entries from event data with optional manual overrides.
**Context**: The user confirmed this model for the initial implementation phase.
**Options**: Manual speaker authoring only; fully automated derivation only; hybrid derivation plus curated overrides.
**Rationale**: A hybrid model reduces repetitive authoring while preserving editorial quality and stable profile pages.
**Impact**: Requires merge logic and identity normalization, but improves maintainability as events grow.
**Review**: Reassess if speaker metadata quality from upstream sources proves too inconsistent.
