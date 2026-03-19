---
id: bay-12xe
status: closed
deps: []
links: []
created: 2026-03-19T15:30:38Z
type: chore
priority: 3
assignee: Lars Kellogg-Stedman
---
# schedule.js: replace computed negative key ordinals[-1] with an explicit if

Line 54: { [-1]: "Last" } is valid but surprising. An explicit if (n === -1) return ... is clearer.


## Notes

**2026-03-19T19:14:44Z**

Replace computed property syntax with explicit conditional

In src/schedule.js line 54, the ordinals object uses computed property syntax `[-1]: "Last"`
which is valid but surprising. Replace this with:

1. Remove [-1] from the ordinals object
2. Add an explicit check: if (n === -1) return "Last" before looking up in ordinals
3. Verify build passes: npm run build
4. Verify tests pass: npm test
5. Commit changes
