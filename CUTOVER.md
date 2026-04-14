# Production Cutover Plan

This document describes how to switch the AZUG FR website from the legacy static
HTML site (`master`) to the new Astro-based site (`nextgen`).

## Pre-flight Checks

- [ ] All T1–T21 tasks complete on `nextgen`
- [ ] `nextgen` builds successfully via GitHub Actions
- [ ] Preview review: check `/fr`, `/en`, `/fr/events`, `/fr/news`, `/fr/speakers`, `/fr/about`, `/fr/search`
- [ ] Mobile viewport checked on all key pages
- [ ] FR/EN language toggle works correctly
- [ ] Pagefind search returns results

## Cutover Steps

1. **Disable the legacy deploy workflow**
   - Go to GitHub Actions → `static.yml` → Disable workflow
   - Or rename `.github/workflows/static.yml` to `.github/workflows/static.yml.bak` on `master`

2. **Update GitHub Pages source**
   - Go to repo Settings → Pages → Source
   - Change from `master / (root)` to the `nextgen` branch (or `main` after rename)
   - Or let the `deploy.yml` workflow handle it via `actions/deploy-pages`

3. **Rename `nextgen` to `main` (optional)**
   - `git branch -m nextgen main` in the worktree
   - `git push origin main`
   - Update default branch in GitHub Settings → Branches

4. **Post-cutover verification**
   - Visit `https://azugfr.github.io` — should redirect to `/fr`
   - Check `https://azugfr.github.io/fr/events` renders correctly
   - Verify Pagefind search works on `/fr/search`

## Rollback

If issues are found after cutover:
- Re-enable `static.yml` on `master`
- GitHub Pages will revert to serving from `master`
- Investigate and fix issues on `nextgen` before retrying

## Legacy Files Status

See `MIGRATION_MAP.md` for disposition of all legacy files.
The following legacy files on `master` can be archived after cutover is confirmed stable:
- `index.html`, `blog.html`, `single-post.html`, `gab.html`, `gabparis.html`
- `style.css`, `css/`, `js/`
- `process.php`
- `.github/workflows/static.yml`
