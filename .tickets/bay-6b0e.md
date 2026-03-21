---
id: bay-6b0e
status: closed
deps: []
links: []
created: 2026-03-21T01:40:11Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Fix header h1 alignment and size on printed output

After bay-mc4m, the page header h1 is centered and a different size on print. The @media (max-width: 768px) block sets text-align: center on .hero and font-size: 250% on body > header h1 without restricting to screen media, so these bleed into print. Fix by overriding in @media print.

