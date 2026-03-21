---
id: bay-5ho0
status: closed
deps: [bay-lx0z]
links: []
created: 2026-03-21T03:47:38Z
type: chore
priority: 3
assignee: Lars Kellogg-Stedman
---
# css: fix breakpoint gap, comma formatting, and inch units

Three minor issues: 1) 'body > header nav,.noprint' missing space after comma. 2) min-width:769px creates a 1px gap vs max-width:768px. 3) 0.5in/0.25in padding in screen-context rules is non-idiomatic; rem is more predictable.

## Design

1. Fix comma: 'body > header nav, .noprint'. 2. Change min-width:769px to min-width:768px. 3. Replace 0.5in->3rem and 0.25in->1.5rem in screen-context base rules; add print overrides with in units if needed.

## Acceptance Criteria

No comma formatting issue. Single breakpoint value. Screen padding uses rem. Build passes.


## Notes

**2026-03-21T03:59:05Z**

Plan:
1. Fix min-width:769px -> min-width:768px (eliminates 1px gap)
2. Replace all inch units in screen-context rules with rem equivalents:
   - nav: 0.5in -> 3rem
   - h1: 0.5in -> 3rem
   - main: 0.25in 0.5in -> 1.5rem 3rem
   - footer: 0.5in -> 3rem
   - mobile main override: 0.25in 1rem -> 1.5rem 1rem
