---
id: bay-f14m
status: closed
deps: []
links: []
created: 2026-03-21T01:28:13Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Fix nav visible on printed output after hamburger menu changes

After bay-mc4m added hamburger nav styles in @media (max-width: 768px), the nav bar now appears as a large black bar on printed output. Root cause: body > header nav { display: flex } (specificity 0,0,3) beats the print rule nav { display: none } (specificity 0,0,1) when both media queries apply. Fix by increasing specificity of the print rule to body > header nav.

