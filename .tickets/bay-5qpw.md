---
id: bay-5qpw
status: closed
deps: []
links: []
created: 2026-03-18T15:42:05Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Use cover images in org pages

If an org has a cover image, display that cover image under the metadata table on the org page (e.g., for /org/caara, displays contents/org/caara/cover.jpg under the metadata table). Cover images have the basename "cover" and any valid image extension. It probably makes sense to allow *any* extension, so that we don't need to keep track of what image formats are currently popular.

## Notes

**2026-03-18T15:51:55Z**

## Implementation Plan

1. Add gif/webp/svg passthrough copy extensions to `eleventy.config.js`
2. Create `content/org/org.11tydata.js` to compute `coverImage` URL via filesystem detection
3. Update `content/_includes/org.liquid` to render cover image after metadata table
