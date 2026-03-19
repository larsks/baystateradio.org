---
id: bay-vhi5
status: closed
deps: []
links: []
created: 2026-03-19T15:30:23Z
type: task
priority: 3
assignee: Lars Kellogg-Stedman
---
# events.js: avoid re-splitting strings in sort comparator

Lines 36–40: .split(" ")[0] is called twice per comparison, O(n log n) times. Extract keys before sorting.


## Notes

**2026-03-19T19:16:17Z**

Optimize sort comparator in events.js to avoid redundant string splitting:

1. Lines 36-40 currently call .split(" ")[0] twice per comparison, which happens O(n log n) times during sorting
2. Use Schwartzian transform pattern: extract date keys before sorting, sort by keys, then map back to original objects
3. This reduces string splits from O(n log n) to O(n)

Implementation:
- Map events to tuples of [event, dateKey]
- Sort by dateKey using localeCompare
- Map back to just events
