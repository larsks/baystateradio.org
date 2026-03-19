---
id: bay-8b0p
status: closed
deps: []
links: []
created: 2026-03-19T15:12:11Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Review javascript

Review the javascript sources in this project:

- eleventy.config.js
- src/*.js

Highlight places where we can improve the structure and/or maintainability of the code. We are looking to avoid constructs that are unnecessary or confusing.

## Notes

**2026-03-19T15:23:31Z**

## Plan

1. Read all JS source files to get exact line numbers
2. Write docs/js-review.md with findings organized by file
3. Build to confirm no regressions
4. Commit and close ticket

## Findings summary (after reading sources)

- eleventy.config.js: passthroughCopyExtension called 10x; loop would be cleaner
- calendar.js: DAY_NAMES array (abbr list) vs schedule.js DAY_NAMES object (abbr→full name) — same name, different shape, causes confusion; renderCalendar mixes concerns; event listeners leak on each re-render; two `new Date()` calls (today/nowCheck) that could be one
- events.js: sort comparator calls .split(" ")[0] twice per comparison
- ical.js: BYDAY and DAY_OF_WEEK cover same abbreviation set; parseDuration duplicated with schedule.js; 4 RRULE build paths; bad regex input throws uncaught TypeError
- schedule.js: parseDuration duplicated; formatDayPart uses chained if/else instead of guard clauses; ordinals[-1] is a surprise numeric key
- org.js: template literal HTML with unescaped title/acronym from frontmatter

**2026-03-19T15:25:21Z**

# JavaScript Code Review

## `eleventy.config.js`

### `passthroughCopyExtension` called 10 times (lines 19–29)

`setupPassthroughCopy` calls `passthroughCopyExtension` once per extension.
A loop over an array is shorter and easier to extend:

```js
const PASSTHROUGH_EXTENSIONS = [
  "kmz", "kml", "png", "jpg", "pdf",
  "txt", "gpx", "js", "gif", "webp", "svg",
];

function setupPassthroughCopy(eleventyConfig) {
  for (const ext of PASSTHROUGH_EXTENSIONS) {
    for (const e of [ext, ext.toUpperCase()]) {
      eleventyConfig.addPassthroughCopy(`content/**/*.${e}`);
    }
  }
}
```

### Unused `_` parameter (line 12)

`[ext, ext.toUpperCase()].forEach((item, _) => ...)` — the index parameter
`_` is never used. `forEach` callback can just be `(item) => ...`.

---

## `src/calendar.js`

### `DAY_NAMES` name collision with `src/schedule.js`

`calendar.js` line 3 declares `DAY_NAMES` as an ordered array of abbreviations
(`["Sun", "Mon", …]`). `schedule.js` line 1 declares `DAY_NAMES` as an object
mapping abbreviations to full names (`{ Mon: "Monday", … }`). Same name, different
shape. If either is ever imported into a shared context, or a reader looks at both
files in the same session, the mismatch is confusing. Rename to make intent
explicit: e.g. `DAY_ABBREVS` for the array and keep `DAY_NAMES` for the map.

### `renderCalendar` mixes concerns (lines 88–162, ~75 lines)

The function builds a day-event map, generates HTML, sets `innerHTML`, and
attaches three event listeners — all in one pass. Consider splitting into:

- `buildCalendarHtml(dayMap, year, month)` → returns an HTML string
- `renderCalendar(events, year, month, container)` → calls the builder, sets
  `innerHTML`, attaches listeners

### Event listeners accumulate on every render (lines 138–161)

Each call to `renderCalendar` sets `container.innerHTML` (destroying old nodes
and their listeners), then immediately queries `document.getElementById` and
attaches new listeners. Because the buttons are **inside** `container`, the old
listeners are dropped when `innerHTML` is replaced — so this doesn't technically
leak. However, the pattern is fragile: if a listener were ever attached to a node
**outside** the container it would accumulate indefinitely. A safer idiom is to
attach listeners once in `init()` using event delegation on `container`, passing
the current year/month in a closure or data attribute.

### Two separate `new Date()` calls for "now" (lines 92–96)

```js
const today = new Date();          // line 92
const nowCheck = new Date();       // line 94
```

Both are called at the same moment and mean the same thing. Use one variable.

---

## `src/events.js`

### Sort comparator re-splits strings on every comparison (lines 36–40)

```js
month.events.sort((a, b) =>
  a.event.data.schedule
    .split(" ")[0]
    .localeCompare(b.event.data.schedule.split(" ")[0]),
);
```

`.split(" ")[0]` is called twice per invocation, and the comparator is invoked
O(n log n) times. Extract the key before sorting:

```js
month.events.sort((a, b) => {
  const ka = a.event.data.schedule.split(" ")[0];
  const kb = b.event.data.schedule.split(" ")[0];
  return ka.localeCompare(kb);
});
```

Or use a Schwartzian transform if the array is large.

---

## `src/ical.js`

### `BYDAY` and `DAY_OF_WEEK` cover the same abbreviation set (lines 1–7)

```js
const BYDAY     = { Mon: "MO", Tue: "TU", Tues: "TU", Wed: "WE", … };
const DAY_OF_WEEK = { Sun: 0,  Mon: 1,    Tue: 2,  Tues: 2, … };
```

Two maps, same keys. If a new abbreviation is added (or a typo fixed), both must
be updated in sync. A single source-of-truth structure (e.g. an array of
`{ abbr, ical, dow }` objects, or a combined object) would make that maintenance
automatic.

### `parseDuration` duplicated in `src/schedule.js` (lines 12–20 / schedule.js 20–28)

The function body is identical. It should live in one module and be imported by
the other.

### RRULE construction scattered across four code paths (lines 92–133)

Each branch builds `rrule` by string concatenation with near-identical structure.
A small helper keeps this DRY and makes each branch's intent obvious:

```js
function buildRRule(freq, opts = {}) {
  const parts = [`FREQ=${freq}`];
  if (opts.interval) parts.push(`INTERVAL=${opts.interval}`);
  if (opts.byday)    parts.push(`BYDAY=${opts.byday}`);
  return `RRULE:${parts.join(";")}`;
}
```

### Uncaught `TypeError` on bad regex match (lines 107–108, 115–116)

```js
const m = dayPart.match(/^(-?\d+)(\w+)$/);
const n = parseInt(m[1]);   // TypeError if m is null
```

If the regex does not match, `m` is `null` and destructuring `m[1]` throws
immediately. The same is true for the N-weekly branch at lines 115–116. These
branches are reached only when the outer `else if` guard has already passed, so
in practice the regex should always match — but that assumption is silent. At
minimum, add an assertion:

```js
const m = dayPart.match(/^(-?\d+)(\w+)$/);
if (!m) throw new Error(`Unexpected day format: ${dayPart}`);
```

---

## `src/schedule.js`

### `parseDuration` duplicated from `src/ical.js` (lines 20–28)

See note above. Export from one module, import in the other.

### `formatDayPart` uses chained if/else instead of guard clauses (lines 35–73)

The function has four branches, each handling a distinct case. Rewriting with
early returns reduces nesting and makes each case self-contained:

```js
function formatDayPart(day) {
  if (day === "*") return "Every day";

  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    // … date case …
    return date.toLocaleDateString(…);
  }

  if (/^-?\d/.test(day)) {
    // … monthly ordinal case …
    return `${ordWord} ${name} of every month`;
  }

  if (/\/\d+$/.test(day)) {
    // … N-weekly case …
    return `Every ${intWord} ${name}`;
  }

  // weekday list
  …
}
```

### `ordinals[-1]` uses a computed negative key (line 54)

```js
const ordinals = { 1: "First", …, [-1]: "Last" };
```

JavaScript coerces all object keys to strings, so `ordinals[-1]` works and
stores the key `"-1"`. It is valid but surprising to readers unfamiliar with the
computed-property syntax. An explicit `if`:

```js
if (n === -1) return `Last ${name} of every month`;
const ordWord = ordinals[n] ?? `${n}th`;
```

...is less clever but immediately obvious.

---

## `src/org.js`

### Unescaped HTML in template literal (line 29)

```js
const label = acronym ? `${title} (${acronym})` : title;
return org.url ? `<a href="${org.url}">${label}</a>` : label;
```

`title` and `acronym` come from Eleventy frontmatter. If either contains `<`,
`>`, or `&` (e.g. `title: "Foo & Bar"`) the returned HTML will be malformed.
`org.url` with an unescaped `"` would break the attribute. A small escape helper
covers this:

```js
function escHtml(s) {
  return s.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
}
```

Then: `<a href="${escHtml(org.url)}">${escHtml(label)}</a>`.
