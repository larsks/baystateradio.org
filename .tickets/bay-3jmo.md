---
id: bay-3jmo
status: closed
deps: []
links: []
created: 2026-03-19T15:30:14Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# calendar.js: rename DAY_NAMES array to avoid collision with schedule.js

calendar.js declares DAY_NAMES as an ordered array; schedule.js declares it as an object map. Same name, different shape. Rename the array to DAY_ABBREVS.


## Notes

**2026-03-19T19:13:07Z**

Rename DAY_NAMES to DAY_ABBREVS in calendar.js to avoid collision with schedule.js

Steps:
1. In calendar.js line 3: rename `const DAY_NAMES = [...]` to `const DAY_ABBREVS = [...]`
2. In calendar.js line 107: update for loop to use `DAY_ABBREVS` instead of `DAY_NAMES`
3. Verify build passes with `npm run build`
4. Verify tests pass with `npm test`
