---
id: bay-ytbx
status: closed
deps: [bay-5qpw]
links: []
created: 2026-03-18T15:00:14Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Better organization display

Replace the list of organizations displayed at /orgs with something more visually appealing. Display organizations in "boxes" in a grid, where each box has:

- The organization cover image, if available. This should be no larger than 200x200.
- The organization title
- The URL (if available)
- The location (if available)
- An excerpt from the content at /org/<name>

If there is a standard eleventy mechanism to extract an excerpt from a page we should use that; otherwise, let's discuss the best option.

## Notes

**2026-03-18T16:05:42Z**

## Implementation Plan

1. Add a `firstParagraph` filter to `eleventy.config.js` that extracts the text of the first `<p>` from an HTML string (strips inner tags too). Used as excerpt fallback.

2. Replace `<ul>` list in `content/organizations.md` with a CSS grid of org cards. Each card shows:
   - Cover image (if present, ≤200px tall, linked to org page) via `org.data.coverImage`
   - Title (linked to org page)
   - URL (if present)
   - Location (if present)
   - Excerpt: `page.excerpt` if set via `---` separator, else `templateContent | firstParagraph`

3. Add `.org-grid` / `.org-card` CSS to `content/css/style.css.liquid`
