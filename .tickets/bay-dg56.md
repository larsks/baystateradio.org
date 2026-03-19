---
id: bay-dg56
status: closed
deps: []
links: []
created: 2026-03-19T15:30:32Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# ical.js + schedule.js: deduplicate parseDuration (defined in both files)

parseDuration is identical in both modules. Extract to a shared module and import.


## Notes

**2026-03-19T19:13:34Z**

## Implementation Plan: Deduplicate parseDuration

The parseDuration function is identically defined in both ical.js (lines 12-20, exported) and schedule.js (lines 20-28, private). Neither file currently imports it externally.

### Steps:
1. Create src/duration.js with the shared parseDuration function
2. Update ical.js to import parseDuration from duration.js (remove local definition)
3. Update schedule.js to import parseDuration from duration.js (remove local definition)
4. Run tests (npm test) to verify both modules work correctly
5. Run build (npm run build) to ensure the project builds successfully
6. Commit changes with message "bay-dg56: deduplicate parseDuration into shared module"
