---
id: bay-muqy
status: closed
deps: []
links: []
created: 2026-03-19T15:30:32Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# ical.js: add guard against null regex match in RRULE parsing

Lines 107–108, 115–116: if regex does not match, m[1] throws TypeError. Add explicit error throw on null match.


## Notes

**2026-03-19T19:13:07Z**

## Implementation Plan

1. Read src/ical.js to identify the regex match issues at lines 107-108 and 115-116
2. Add null guards after each regex match before accessing array elements:
   - Line 107-108: Check if `dayPart.match(/^(-?\d+)(\w+)$/)` returns null before accessing m[1]
   - Line 115-116: Check if `dayPart.match(/^(\w+)\/(\d+)$/)` returns null before accessing m[1]
3. Throw descriptive errors indicating invalid schedule format when match is null
4. Run tests to ensure the changes don't break existing functionality
5. Build to verify the project still compiles
