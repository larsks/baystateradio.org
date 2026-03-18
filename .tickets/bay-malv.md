---
id: bay-malv
status: closed
deps: []
links: []
created: 2026-03-18T21:51:42Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Add news to main page

I would like to display the latest news item on the main page. This should show up in a sidebar on the right of the page, labelled "Latest News". It should follow the display format used in content/news.liquid -- that it, it should display the post title, a byline, and an excerpt from the news post if one is available (otherwise the complete content), and it should properly render the excerpt as HTML.

## Notes

**2026-03-18T21:57:10Z**

## Approved Plan

1. Create `content/_includes/home.liquid` — extends base.liquid, two-column grid layout with sidebar showing latest news post
2. Update `content/index.md` — change `layout: base` to `layout: home`
3. Add CSS to `content/css/style.css.liquid` — `.home-layout` grid, `.sidebar` styles, responsive media query
