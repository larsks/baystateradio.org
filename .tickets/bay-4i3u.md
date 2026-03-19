---
id: bay-4i3u
status: closed
deps: []
links: []
created: 2026-03-19T15:30:33Z
type: task
priority: 3
assignee: Lars Kellogg-Stedman
---
# schedule.js: refactor formatDayPart to use guard clauses instead of chained if/else

Lines 35–73: four chained branches; early returns reduce nesting and improve readability.


## Notes

**2026-03-19T19:16:06Z**

Review formatDayPart function (lines 35-73) to ensure guard clause pattern is optimal:

1. Examine current structure - function already uses early returns for main branches
2. Verify each conditional branch uses proper guard clause style
3. Check if any nested logic can be flattened
4. Ensure consistent formatting and readability throughout
5. The four main pattern branches (wildcard, date, ordinal, interval) plus default case should all follow guard clause best practices

Expected outcome: Clean guard clause implementation with early returns, minimal nesting, and improved readability.
