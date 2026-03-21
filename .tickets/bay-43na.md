---
id: bay-43na
status: closed
deps: []
links: []
created: 2026-03-21T04:04:26Z
type: bug
priority: 0
assignee: Lars Kellogg-Stedman
---
# fix cal-cell height regression from align-self: start

Replacing 'vertical-align: top' with 'align-self: start' on .cal-cell in bay-lx0z broke the calendar grid. vertical-align is a no-op on grid items, but align-self: start actively overrides the default align-items: stretch, so cells now collapse to content height instead of matching row height.

## Acceptance Criteria

All calendar cells in the same row are the same height regardless of content.

