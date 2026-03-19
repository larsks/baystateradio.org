---
id: bay-hmyx
status: closed
deps: [bay-muqy, bay-lgk1]
links: []
created: 2026-03-19T15:30:32Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# ical.js: extract buildRRule helper to DRY up four RRULE code paths

Lines 92–133: four branches build RRULE strings by near-identical concatenation. A buildRRule(freq, opts) helper removes duplication.


## Notes

**2026-03-19T19:54:26Z**

Extract buildRRule helper function to eliminate duplication in RRULE string construction:

1. Create buildRRule(freq, opts) helper function above netToVevent
   - Takes frequency (DAILY, WEEKLY, MONTHLY) and optional parameters object
   - Builds RRULE string: "RRULE:FREQ=<freq>" + optional params like BYDAY, INTERVAL
   - Returns formatted RRULE string

2. Refactor four RRULE construction sites in netToVevent (lines 104, 112, 120, 132):
   - Daily: buildRRule("DAILY")
   - Monthly ordinal: buildRRule("MONTHLY", { BYDAY: `${n}${BYDAY[abbr]}` })
   - N-weekly: buildRRule("WEEKLY", { INTERVAL: interval, BYDAY: BYDAY[abbr] })
   - Weekly multiple days: buildRRule("WEEKLY", { BYDAY: byday })

3. Verify build and tests pass

**2026-03-19T20:00:01Z**

Add buildRRule(freq, opts) helper above netToVevent (line 76).
Replace the four RRULE construction sites:
- Line 99:  "RRULE:FREQ=DAILY"                            -> buildRRule("DAILY")
- Line 116: `RRULE:FREQ=MONTHLY;BYDAY=${n}${...byday}`    -> buildRRule("MONTHLY", { BYDAY: `${n}${DAYS[abbr].byday}` })
- Line 133: `RRULE:FREQ=WEEKLY;INTERVAL=${interval};BYDAY=...` -> buildRRule("WEEKLY", { INTERVAL: interval, BYDAY: DAYS[abbr].byday })
- Line 145: `RRULE:FREQ=WEEKLY;BYDAY=${byday}`            -> buildRRule("WEEKLY", { BYDAY: byday })
