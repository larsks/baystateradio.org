---
id: bay-2ff1
status: closed
deps: []
links: []
created: 2026-03-19T03:09:16Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Show event schedule

Update content/events.md to show the schedule for the year. Each month should appear as a level 3 heading (H3), and under each month should be a list of events occuring in that month, sorted by date. If there are no events in a given month, the message "No events this month." should appear instead.

## Notes

**2026-03-19T03:13:54Z**

## Plan: bay-2ff1 — Show event schedule

1. Create src/events.js with eventsByMonth(events, year) filter
2. Register filter in eleventy.config.js
3. Rewrite content/events.md to use the filter with 12 month H3 headings
4. Add vitest tests in src/events.test.js

eventsByMonth groups events by month (skipping non-ISO dates), sorts within each month, returns 12 month objects with name and events array.
