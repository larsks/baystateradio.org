---
id: bay-dfgx
status: closed
deps: []
links: []
created: 2026-03-19T15:30:23Z
type: chore
priority: 3
assignee: Lars Kellogg-Stedman
---
# calendar.js: consolidate two new Date() calls for now into one variable

Lines 92–96: today and nowCheck are both new Date() at the same moment. Use one variable.


## Notes

**2026-03-19T19:16:11Z**

Implementation plan for bay-dfgx:

1. In src/calendar.js, consolidate the two `new Date()` calls on lines 92 and 94
2. Keep the `today` variable (line 92) and remove the `nowCheck` variable (line 94)
3. Update line 95 to use `today` instead of `nowCheck` for checking the current month
4. Verify build passes with `npm run build`
5. Verify tests pass with `npm test`
