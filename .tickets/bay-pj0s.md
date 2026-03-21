---
id: bay-pj0s
status: closed
deps: []
links: []
created: 2026-03-21T03:47:24Z
type: chore
priority: 1
assignee: Lars Kellogg-Stedman
---
# css: remove global link text-decoration override and consolidate media query duplication

The global 'a { text-decoration: none }' rule removes underlines from all links sitewide, failing WCAG 1.4.1. It forces \!important in the print block. The .home-layout/.sidebar collapse rules are also duplicated identically in both the max-width:768px and print media queries.

## Design

1. Remove global a { text-decoration: none } block (specific link contexts already have scoped rules). 2. Remove \!important from print link color rule. 3. Consolidate .home-layout/.sidebar rules into a single combined @media screen and (max-width:768px), print block.

## Acceptance Criteria

Body-copy links show underlines. Nav/org-card/calendar links have no underlines. Print layout is single-column. No \!important in CSS.


## Notes

**2026-03-21T03:48:06Z**

Plan:
1. Remove the global `a, a:link, a:visited, a:hover, a:active { text-decoration: none }` block (line 332-334). Specific contexts (nav a, .org-card-link, .cal-subscribe, .cal-pill) already scope this.
2. In @media print: remove !important from `a { color: inherit }` link color rule.
3. Remove the duplicate .home-layout / .sidebar rules from @media screen and (max-width: 768px) and @media print.
4. Replace both with a single combined: @media screen and (max-width: 768px), print { .home-layout { grid-template-columns: 1fr } .sidebar { border-left: none; border-top: 2px solid #ccc; padding-left: 0; padding-top: 1em } }
