---
id: bay-n7tz
status: closed
deps: []
links: []
created: 2026-03-22T04:09:17Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Fix org list page rendering after directory rename

After renaming content/org/ to content/orgs/ and moving organizations.md to orgs/index.md, the org listing page is broken and cover images are missing.

## Acceptance Criteria

npm run build succeeds, orgs index page renders with base layout and org cards, cover images resolve to /orgs/<slug>/cover.*, tests pass


## Notes

**2026-03-22T04:09:57Z**

# Context

After renaming `content/org/` → `content/orgs/` and moving `content/organizations.md` → `content/orgs/index.md`, three bugs were introduced. The most critical one is why the org list page looks broken.

## Root Cause (Primary)

`content/orgs/index.md` is missing `layout: base` in its front matter.

Because the file now lives inside `content/orgs/`, it inherits `layout: "org"` from `content/orgs/orgs.json`. The `org` layout is designed for individual org detail pages — it renders a metadata table (`title`, `url`, `location`) and then `{{ content }}`. The org card list IS inside `{{ content }}`, but the page is visually broken because it's wrapped in wrong HTML.

Compare: `content/nets/index.md` and `content/events/index.md` both explicitly set `layout: base` to override their directory's data file. `orgs/index.md` is missing this override — it was the one line NOT added in commit `06d91d9`.

## Secondary Issues

**`org.11tydata.js` is misnamed.** The file `content/orgs/org.11tydata.js` should be `content/orgs/orgs.11tydata.js`. In Eleventy, directory data files must match the directory name. Since the directory is `orgs/`, the file is not applied as a directory data file — `eleventyComputed.coverImage` is never computed, so all cover images are missing.

**Hardcoded `/org/` path.** Even if correctly named, line 13 of `org.11tydata.js` returns `/org/${slug}/${cover}` — it should be `/orgs/${slug}/${cover}`.

**Stale test fixtures.** `src/org.test.js` lines 5–6 use `url: "/org/caara/"` and `url: "/org/barc/"`. These should be `/orgs/caara/` etc. Tests still pass today because the fixtures are manually set values, but they're misleading.

## Files to Modify

| File | Change |
|------|--------|
| `content/orgs/index.md` | Add `layout: base` to front matter |
| `content/orgs/org.11tydata.js` | Rename to `orgs.11tydata.js` (git mv) |
| `content/orgs/orgs.11tydata.js` | Update line 13: `/org/` → `/orgs/` |
| `src/org.test.js` | Update fixture URLs from `/org/` → `/orgs/` |

## Implementation Steps

1. Add `layout: base` to `content/orgs/index.md` front matter (after `eleventyExcludeFromCollections` line, matching the pattern in `nets/index.md`)
2. `git mv content/orgs/org.11tydata.js content/orgs/orgs.11tydata.js`
3. Edit `content/orgs/orgs.11tydata.js` line 13: change `/org/` to `/orgs/`
4. Edit `src/org.test.js` lines 5, 6, 61, 72, 80, 86: update `/org/` URLs to `/orgs/`
5. Run `npm run build` — verify no errors and `_site/orgs/index.html` renders org cards correctly
6. Run `npm test` — verify all tests pass

## Verification

- `npm run build` completes without errors
- `_site/orgs/index.html` contains org-card elements rendered with `base` layout structure (not org detail layout)
- Cover images resolve to `/orgs/<slug>/cover.*` paths
- `npm test` passes
