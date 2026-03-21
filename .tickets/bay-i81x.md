---
id: bay-i81x
status: closed
deps: []
links: []
created: 2026-03-21T01:45:19Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Scope responsive breakpoints to screen media only

The @media (max-width: 768px) block does not specify 'screen', so all its rules (text-align: center, min-height: 120px, padding: 1rem on .hero, font-size overrides, nav flex layout) bleed into print output. Fix: change to @media screen and (max-width: 768px). This supersedes bay-6b0e whose print-block overrides were an incomplete workaround.

