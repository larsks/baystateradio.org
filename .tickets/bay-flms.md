---
id: bay-flms
status: closed
deps: []
links: []
created: 2026-03-19T15:30:14Z
type: chore
priority: 3
assignee: Lars Kellogg-Stedman
---
# eleventy.config.js: remove unused _ parameter from forEach callback

Line 12: forEach((item, _) => ...) — _ is never used; callback can just be (item) => ...


## Notes

**2026-03-19T19:15:55Z**

## Implementation Plan for bay-flms

### Changes Required
- Edit eleventy.config.js line 12
- Remove unused parameter `_` from forEach callback
- Change from: `(item, _) =>` to: `(item) =>`

### Testing
- Run `npm run build` to ensure the site builds successfully
- Run `npm test` to ensure all tests pass

This is a simple code cleanup with no functional changes.
