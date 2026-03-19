---
id: bay-lgk1
status: closed
deps: []
links: []
created: 2026-03-19T15:30:24Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# ical.js: consolidate BYDAY and DAY_OF_WEEK into a single source of truth

Lines 1–7: two maps share the same keys. A single combined structure eliminates sync risk.


## Notes

**2026-03-19T19:13:21Z**

Consolidate BYDAY and DAY_OF_WEEK maps into a single source of truth

Current state:
- Lines 1-7 define two separate maps with identical keys
- BYDAY: maps day abbreviations to iCal BYDAY codes (MO, TU, etc.)
- DAY_OF_WEEK: maps same abbreviations to JS day-of-week numbers (0-6)

Implementation:
1. Create a single DAYS constant with structure: { abbr: { byday: string, dayOfWeek: number } }
2. Update references to BYDAY[x] to use DAYS[x].byday
3. Update references to DAY_OF_WEEK[x] to use DAYS[x].dayOfWeek
4. Verify build and tests pass

Affected code locations:
- Line 57: DAY_OF_WEEK[day] in findFirstOccurrence
- Line 67: DAY_OF_WEEK[dayAbbr] in findMonthlyOrdinalStart
- Line 112: BYDAY[abbr] in monthly ordinal case
- Line 120: BYDAY[abbr] in N-weekly interval case
- Line 131: BYDAY[d] in weekly multi-day case
