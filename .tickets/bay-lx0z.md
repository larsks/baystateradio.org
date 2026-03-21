---
id: bay-lx0z
status: closed
deps: [bay-pj0s]
links: []
created: 2026-03-21T03:47:31Z
type: chore
priority: 2
assignee: Lars Kellogg-Stedman
---
# css: extract custom properties and fix dead code

The Avenir/Montserrat font stack is duplicated 3x. Colors (#222, #ccc, #555, #f0f0f0, #ff704d) are repeated throughout. .cal-cell has 'vertical-align: top' which has no effect on grid items.

## Design

1. Add :root custom properties for --font-display, --color-nav, --color-border, --color-muted, --color-bg-subtle, --color-today. 2. Replace all hardcoded duplicates with var() references. 3. Fix .cal-cell: vertical-align: top -> align-self: start.

## Acceptance Criteria

No duplicate font stacks or color values. CSS custom properties defined at :root. .cal-cell uses align-self: start. Site builds and looks identical.


## Notes

**2026-03-21T03:52:42Z**

Plan:
1. Add :root custom properties at top of file (after front matter):
   --font-display, --color-nav, --color-border, --color-muted,
   --color-bg-subtle, --color-today
2. Replace all 3 instances of the Avenir/Montserrat font stack with var(--font-display)
3. Replace #222 with var(--color-nav) (nav bg, cal-nav, cal-subscribe hover)
4. Replace #ccc with var(--color-border) (org-card border, cal-subscribe border,
   cal-grid borders, cal-dow borders, cal-cell borders, sidebar borders,
   org-card::before border)
5. Replace #555 with var(--color-muted) (org-excerpt, cal-day-num, cal-subscribe color)
6. Replace #f0f0f0 with var(--color-bg-subtle) (cal-dow bg, cal-pill bg)
7. Replace #ff704d with var(--color-today) (.cal-cell--today .cal-day-num bg)
8. Fix .cal-cell: vertical-align: top -> align-self: start
