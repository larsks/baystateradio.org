---
id: bay-utst
status: closed
deps: []
links: []
created: 2026-03-18T14:37:38Z
type: feature
priority: 2
assignee: Lars Kellogg-Stedman
---
# Use nets.ics as calendar widget event source via ical.js


## Notes

**2026-03-18T14:37:43Z**

# Plan: Use nets.ics as calendar widget event source via ical.js

## Context

The nets page currently generates two redundant build outputs from the same source data:
- `nets.ics` — RFC 5545 iCalendar for external calendar apps
- `nets.json` — stripped-down JSON consumed by the client-side calendar widget

The calendar widget (`content/js/calendar.js`) fetches `nets.json` and re-implements its own schedule parsing (`parseSchedule`, `getScheduleTime`). This duplicates logic already encoded in the ICS file.

`ical.js` is already a devDependency (used in `src/ical.test.js`). By bundling it with `esbuild`, the calendar widget can fetch `nets.ics` directly and use `ICAL.Event` + `ICAL.Event.iterator()` for recurrence expansion — eliminating `nets.json.11ty.js` and the custom schedule parser entirely.

---

## Ticket Workflow

1. `tk create "Use nets.ics as calendar widget event source via ical.js" --type feature --priority 2`
2. `tk start <id>`
3. `git checkout -b ticket/<id>`
4. Add approved plan to ticket: `cat <plan_file> | tk add-note <id>`

---

## Implementation Steps

### 1. Add `esbuild` devDependency

```bash
npm install --save-dev esbuild
```

### 2. Add esbuild build hook to `eleventy.config.js`

Add an `eleventy.after` hook that bundles the calendar entry point into `_site/js/calendar.js`. This runs after eleventy writes its output, so there's no conflict with passthrough copy.

```javascript
import esbuild from "esbuild";

// inside export default function(eleventyConfig):
eleventyConfig.on("eleventy.after", async () => {
  await esbuild.build({
    entryPoints: ["src/calendar.js"],
    bundle: true,
    outfile: "_site/js/calendar.js",
    platform: "browser",
    format: "iife",
    minify: true,
  });
});
```

### 3. Move and rewrite `content/js/calendar.js` → `src/calendar.js`

Delete `content/js/calendar.js`. Create `src/calendar.js` as an ES module:

- `import ICAL from "ical.js"`
- `init()` fetches `/nets.ics`, parses with `ICAL.parse()` + `new ICAL.Component()`, extracts all VEVENTs as `ICAL.Event` objects
- **Remove** `parseSchedule()`, `getScheduleTime()` — replaced by ical.js
- **Rewrite** `getNetsForMonth(events, year, month)`:
  - For recurring events: `event.iterator(monthStart)` — iterates occurrences on/after month start; stop when occurrence ≥ month end
  - For single events: check if `event.startDate` falls within the month
  - Extract per-occurrence data: `title` (from `event.summary`), `time` (from `occ.hour`/`occ.minute`), `url` (from `event.component.getFirstPropertyValue('url')`), `frequency` (from `event.description`)
- `renderCalendar()` and all HTML generation logic stays identical — it already works with `{title, time, url, frequency}` objects

Key API calls:
```javascript
const parsed = ICAL.parse(icsText);
const vcalendar = new ICAL.Component(parsed);
const events = vcalendar.getAllSubcomponents("vevent").map(v => new ICAL.Event(v));

// In getNetsForMonth:
const monthStart = ICAL.Time.fromDateTimeString(`${year}-${mm}-01T00:00:00`);
const monthEnd = /* monthStart + daysInMonth days */;
const iter = event.iterator(monthStart);  // starts at/after monthStart
let occ;
while ((occ = iter.next()) && occ.compare(monthEnd) < 0) { ... }
```

### 4. Delete `content/nets.json.11ty.js`

No longer needed. The widget now reads from `nets.ics`.

### 5. Write tests in `src/calendar.test.js`

Export `getNetsForMonth` from `src/calendar.js` for testing. Write tests using a minimal ICS fixture string, parsed with ical.js, covering:
- Weekly recurring event appears on correct days of a month
- Daily recurring event appears on every day of a month
- One-time event appears only on its specific date
- One-time event in a different month does not appear

---

## Files Modified

| File | Change |
|------|--------|
| `eleventy.config.js` | Add `esbuild` import + `eleventy.after` hook |
| `content/js/calendar.js` | **Delete** (moved to `src/`) |
| `src/calendar.js` | **Create** — rewritten to use ical.js |
| `src/calendar.test.js` | **Create** — unit tests |
| `content/nets.json.11ty.js` | **Delete** |
| `package.json` | Add `esbuild` devDependency |

The `nets.md` page and the `<script src="/js/calendar.js">` tag require **no changes** — the output path is the same.

---

## Verification

1. `npm install` — confirms esbuild added
2. `npm run build` — eleventy builds, then esbuild produces `_site/js/calendar.js`
3. Confirm `_site/js/calendar.js` exists and is bundled (contains ical.js code)
4. Confirm `_site/nets.json` does **not** exist
5. `npm test` — all tests pass including new `calendar.test.js`
6. Serve locally (`npm run serve`) and verify the calendar widget renders correctly, navigates months, and shows correct events
