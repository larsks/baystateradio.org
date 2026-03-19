---
id: bay-nivw
status: closed
deps: []
links: []
created: 2026-03-19T02:16:54Z
type: chore
priority: 2
assignee: Lars Kellogg-Stedman
---
# Create reusable caara-races-blurb include

Move caara-blurb.md to _includes/caara-races-blurb.liquid so it can be embedded in multiple content pages via Liquid include.


## Notes

**2026-03-19T02:18:00Z**



**2026-03-19T02:19:05Z**

Plan: Reusable Blurb via include in Eleventy

Approach:
1. Replace content/caara-blurb.md with content/_includes/caara-races-blurb.liquid
2. Wrap existing markdown content in a Liquid capture block rendered via the markdown filter
3. No config changes needed
4. Usage: {% include "caara-races-blurb.liquid" %}
