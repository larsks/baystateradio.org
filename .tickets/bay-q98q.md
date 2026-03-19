---
id: bay-q98q
status: closed
deps: []
links: []
created: 2026-03-19T13:39:51Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Enhanced scheduling specification

We currently support a shorthand mechanism for specifying scheduling information. We accept strings of the following formats:

- spec: Mon 08:00 4h
  meaning: Repeating every monday from 8:00am to 12:00pm

- spec: Mon,Wed,Fri 12:00 30m
  meaning: Repeating every monday, wednesday, and friday from 12:00pm to 12:30pm

- spec: * 17:00 1h
  meaning: Repeating every day from 5:00pm to 6:00pm

- spec: 2026-03-14 17:00 1h
  meaning: Single event on March 14, 2026, from 5:00pm to 6:00pm

We need to have more flexibility for specifying repeating events. For example, we need to be able to express:

- "the first Monday of every month"
- "every second Tuesday"
- "every third Wednesday"

What are our options? Should we replace our custom syntax with icalendar RRULE specifications? Is there a simpler existing syntax we could adopt?

## Notes

**2026-03-19T14:01:14Z**

# Plan: Enhanced Scheduling Specification (bay-q98q)

## Context

The current schedule shorthand supports three patterns:
- `Mon 08:00 4h` — weekly on named day(s)
- `* 17:00 1h` — every day
- `2026-03-14 17:00 1h` — one-time date

Two new patterns are needed:
1. **Monthly ordinal**: "the first Monday of every month"
2. **Alternating**: "every other Tuesday" or "every third wednesday"

The recommendation is to **extend the existing custom shorthand** rather than switching to raw RRULE syntax. The shorthand is simple and readable for content authors, and both new patterns map cleanly to RFC 5545 RRULE.

## Recommendation: Extend Custom Shorthand

### New syntax

| Spec | Meaning | RRULE |
|------|---------|-------|
| `1Mon 08:00 1h` | First Monday of every month | `RRULE:FREQ=MONTHLY;BYDAY=1MO` |
| `2Tue 08:00 1h` | Second Tuesday of every month | `RRULE:FREQ=MONTHLY;BYDAY=2TU` |
| `-1Fri 09:00 1h` | Last Friday of every month | `RRULE:FREQ=MONTHLY;BYDAY=-1FR` |
| `Tue/2 18:00 2h` | Every other Tuesday (bi-weekly) | `RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=TU` |

Distinguishing rule: if the day field starts with a digit or `-` before the day abbreviation, it's a monthly ordinal. If it ends with `/N`, it's an N-week interval.

### Human-readable display

| Spec | Display |
|------|---------|
| `1Mon` | "First Monday of every month" |
| `2Tue` | "Second Tuesday of every month" |
| `-1Fri` | "Last Friday of every month" |
| `Tue/2` | "Every other Tuesday" |
| `Wed/3` | "Every third Tuesday" |

Ordinals 1→"First", 2→"Second", 3→"Third", 4→"Fourth", 5→"Fifth", -1→"Last".

### DTSTART calculation

- **Monthly ordinal `NDay`**: Find the Nth occurrence of Day in the month of ANCHOR (January 2026). E.g., `1Mon` → 2026-01-05 (first Monday of January).
- **Alternating `Day/N`**: Find the first occurrence of Day on or after ANCHOR (same logic as existing weekly).

## Files to Modify

- `src/schedule.js` — update `formatDayPart()` to recognize ordinal and interval patterns
- `src/ical.js` — update `netToVevent()` to generate correct RRULE for new patterns; add DTSTART calculation helpers
- `src/schedule.test.js` — add tests for new display formats
- `src/ical.test.js` — add tests for new RRULE generation

## Implementation Steps

1. Follow ticket workflow: `tk show bay-q98q`, `tk start bay-q98q`, `git checkout -b ticket/bay-q98q`
2. Add plan to ticket with `tk add-note`
3. **`src/ical.js`**:
   - Add helper `findMonthlyOrdinalStart(n, dayAbbr)` — finds Nth occurrence of weekday in ANCHOR's month
   - Update `netToVevent()`: detect ordinal (`/^-?\d+[A-Z]/.test(dayPart)`) and interval (`/\/\d+$/.test(dayPart)`) patterns; emit appropriate RRULE
4. **`src/schedule.js`**:
   - Update `formatDayPart()`: detect and format ordinal/interval patterns
5. Add tests to both test files
6. Run `npm run build` and `npm test`
7. Commit with message `bay-q98q: support monthly ordinal and bi-weekly schedule patterns`
8. `tk close bay-q98q`

## Verification

- `npm test` — all existing tests pass, new tests cover:
  - `1Mon 08:00 1h` → display "First Monday of every month from 8:00am to 9:00am"
  - `2Tue 08:00 1h` → RRULE `FREQ=MONTHLY;BYDAY=2TU`
  - `-1Fri 09:00 1h` → RRULE `FREQ=MONTHLY;BYDAY=-1FR`
  - `Tue/2 18:00 2h` → RRULE `FREQ=WEEKLY;INTERVAL=2;BYDAY=TU`
  - `Wed/3 18:00 2h` → RRULE `FREQ=WEEKLY;INTERVAL=3;BYDAY=WE`
- `npm run build` — site builds without errors
