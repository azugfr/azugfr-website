# AZUG FR — Legacy to Astro Migration Map

> Inventory of legacy files on `master` and their migration disposition for the Astro `nextgen` build.

## Disposition Key

| Decision | Meaning |
|----------|---------|
| **migrate** | Content or asset copied into Astro project as-is or with minimal transformation |
| **replace** | Superseded by a purpose-built Astro/Tailwind equivalent; legacy file retired after replacement is live |
| **retire** | No equivalent needed in the new site; file removed after `nextgen` goes live |
| **defer** | Will be addressed in a later task; keep legacy file live until then |

---

## HTML Pages

| File | Lines | Content Summary | Decision | Astro Target | Notes |
|------|-------|-----------------|----------|--------------|-------|
| `index.html` | 619 | Single-page site: intro hero, about carousel, team section, contact form. Bootstrap + jQuery + Owl Carousel + parallax. French-language. | **migrate** | `src/pages/[locale]/index.astro` (T11) | Extract team/about content to `src/content/` fixtures (T6); replace jQuery parallax with CSS |
| `blog.html` | 412 | Generic "ONE Parallax Template" blog listing; title never customised; placeholder content only | **replace** | `src/pages/[locale]/news/index.astro` (T14) | Content will come from Meetup/LinkedIn sync scripts (T7, T8) |
| `single-post.html` | 355 | Generic template single post; no real AZUG content | **replace** | `src/pages/[locale]/news/[slug].astro` (T14) | — |
| `gab.html` | 161 | Global Azure France 2022 event landing page (Bordeaux) | **defer** | `src/pages/[locale]/global-azure-france/index.astro` (T22) | Preserve historical content; migrate when T22 is implemented |
| `gabparis.html` | 77 | Global Azure 2022 Paris companion page | **defer** | Part of T22 | Minimal standalone page; fold into T22 flagship route |

## Stylesheets

| File/Dir | Content | Decision | Notes |
|---------|---------|----------|-------|
| `style.css` | 1 240 lines of custom CSS layered on Bootstrap | **replace** | Tailwind CSS (T2) replaces all layout/utility classes; brand colours extracted to `tailwind.config.mjs` tokens |
| `css/animate.css` | WOW.js animation library CSS | **replace** | Use `@tailwindcss/animations` or CSS `@keyframes` directly |
| `css/blog.css` | Blog template styles | **replace** | Superseded by Tailwind typography |
| `css/bootstrap.min.css` | Bootstrap 3 grid + components | **replace** | Tailwind grid replaces Bootstrap |
| `css/font-awesome.min.css` | Font Awesome 4 icon font | **replace** | Use `astro-icon` or inline SVGs |
| `css/magnific-popup.css` | Lightbox plugin CSS | **replace** | Use native `<dialog>` or lightweight modern lightbox |
| `css/owl.carousel.css` / `css/owl.theme.css` | Owl Carousel 2 styles | **replace** | Use CSS scroll-snap or Swiper (if carousel needed) |
| `css/responsive.css` | Custom responsive breakpoints | **replace** | Tailwind responsive prefixes |
| `css/slidingmenu.css` | Off-canvas menu styles | **replace** | Tailwind + Astro component nav |

## JavaScript

| File/Dir | Content | Decision | Notes |
|---------|---------|----------|-------|
| `js/` (21 files) | jQuery 2, Bootstrap JS, Owl Carousel, WOW.js, Isotope, Magnific Popup, parallax, Waypoints, counter, nav, retina | **retire** | Astro islands + vanilla JS replace jQuery ecosystem; no bundled legacy JS needed |
| `js/custom.js` | Site-specific initialisation (WOW, carousel, nav, counter) | **retire** | Behaviour re-implemented in Astro components using scoped `<script>` |

## Server-side

| File | Content | Decision | Notes |
|------|---------|----------|-------|
| `process.php` | 131-line PHP contact form mailer (`mail()` + anti-spam) | **retire** | Static site has no PHP runtime; replace with an external form service (Formspark / Formspree) referenced from the contact section |

## CI/CD

| File | Content | Decision | Notes |
|------|---------|----------|-------|
| `.github/workflows/static.yml` | GitHub Pages workflow — pushes repo root from `master` | **retire** | Replaced by `.github/workflows/deploy.yml` (T4) which builds Astro and deploys `dist/`; retire `static.yml` in T21 after `nextgen` becomes the default branch |

## Static Assets

| File/Dir | Content | Decision | Notes |
|---------|---------|----------|-------|
| `logo.png` | AZUG FR logo | **migrate** | Copy to `public/logo.png`; also add SVG version when available |
| `img/favicon.ico` | Site favicon | **migrate** | Copy to `public/favicon.ico` |
| `img/apple-touch-icon*.png` | iOS home-screen icons | **migrate** | Copy to `public/`; add `manifest.webmanifest` in T10 |
| `img/banner*.png` | Hero section background banners | **migrate** | Copy to `public/img/`; optimise with Astro `<Image>` in hero component (T10) |
| `img/gab/` | Global Azure event images | **defer** | Migrate together with T22 GAB landing page |
| `img/dark_stripes.png` | Section background texture | **replace** | Replicate with CSS `background` or Tailwind pattern |

## Summary Counts

| Decision | Count |
|----------|-------|
| migrate | 8 |
| replace | 14 |
| retire | 5 |
| defer | 3 |
| **Total** | **30** |
