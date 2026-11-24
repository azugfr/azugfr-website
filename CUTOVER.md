# Production Cutover Plan

This document describes how to switch the AZUG FR website from the legacy static
HTML site (`master`) to the new Astro-based site (`nextgen`).

## Pre-flight Checks

- [ ] All T1–T21 tasks complete on `nextgen`
- [ ] CI green on the cutover PR
- [ ] Local `npm run build && npm run preview` reviewed at `/fr`, `/en`, `/fr/events`, `/fr/news`, `/fr/speakers`, `/fr/about`, `/fr/search`
- [ ] Mobile viewport checked on all key pages
- [ ] FR/EN language toggle works correctly
- [ ] Pagefind search returns results

## Cutover Steps

Production is `https://azug.fr`: GitHub Pages with a verified custom domain (`azug.fr` A records and a
`www` CNAME to `azugfr.github.io`), built by GitHub Actions. The `github-pages` environment only lets
`master` deploy.

1. **Open the cutover PR into `master`**
   - `master` (legacy HTML) and `nextgen` share no history, so the PR branch first records `master` as a
     parent with `git merge -s ours --allow-unrelated-histories origin/master`. The PR then replaces the
     legacy files, including `.github/workflows/static.yml`, with the Astro site.
   - CI (`ci.yml`) must pass on the PR.

2. **Merge the PR**
   - Use **"Create a merge commit"** (not squash or rebase): the `-s ours` merge parent must be kept, and the rollback below relies on a merge commit.
   - `master` has no branch protection, so check CI is green before merging.
   - The push to `master` runs `deploy.yml` (Astro build, Pagefind, `actions/deploy-pages`), which
     publishes to azug.fr. No Pages setting changes are needed; the custom domain stays configured.

3. **Post-cutover verification**
   - `https://azug.fr/` redirects to `/fr/`; check `/fr/events/`, `/en/`, `/fr/search/` (Pagefind).
   - Canonical links and `robots.txt` point at `https://azug.fr`.
   - Legacy URLs redirect: `/gab.html` and `/gabparis.html` to `/fr/global-azure-france/`,
     `/blog.html` and `/single-post.html` to `/fr/news/`.

## Rollback

If issues are found after cutover, run `git revert -m 1 <merge-commit>` on `master` and push. The revert
restores the legacy files and `static.yml`, whose push trigger on `master` republishes the old site.

## Legacy Files Status

See `MIGRATION_MAP.md` for disposition of all legacy files.
The following legacy files on `master` can be archived after cutover is confirmed stable:
- `index.html`, `blog.html`, `single-post.html`, `gab.html`, `gabparis.html`
- `style.css`, `css/`, `js/`
- `process.php`
- `.github/workflows/static.yml`
