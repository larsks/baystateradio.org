---
id: bay-qj61
status: closed
deps: []
links: []
created: 2026-03-18T21:12:10Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Fix post ordering on News page

Posts on the news page appear in ascending date order instead of newest-first because LiquidJS silently ignores the | reverse filter when used inline in a {% for %} tag.

## Acceptance Criteria

News page lists posts newest-first after build.


## Notes

**2026-03-18T21:12:18Z**



**2026-03-18T21:12:26Z**

Fix post ordering on News page

Plan: assign reversed collection to variable before iterating.
In LiquidJS, inline filter in for-tag is silently ignored.
Change news.liquid line 8 to use assign+for pattern.
