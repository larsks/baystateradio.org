---
id: bay-g1jp
status: closed
deps: []
links: []
created: 2026-03-20T23:55:44Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix nets display on small screens

The calendar in contents/nets.md is practically useless on small screens (like cell phones). We should simply hide the calendar below a certain screen size.

## Notes

**2026-03-21T00:27:05Z**

Add `@media (max-width: 768px)` rule to `content/css/style.css.liquid`:

```css
.noprint:has(#net-calendar) { display: none; }
```

Targets the .noprint container wrapping the calendar section only (not other .noprint elements like the logo). Same block hidden by the print media query.
