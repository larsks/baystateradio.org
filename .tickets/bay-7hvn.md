---
id: bay-7hvn
status: closed
deps: []
links: []
created: 2026-03-21T01:14:35Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix noprint class misuse in bay-g1jp; add mobile Add-to-calendar link

The bay-g1jp fix used .noprint:has(#net-calendar) to hide the calendar on small screens, but noprint should be used exclusively for print media. Introduce a hidden-sm class for responsive hiding. Also, hiding the calendar hides the Add to calendar link, so add a second one above the List of nets section that only appears on small screens and not on print.


## Notes

**2026-03-21T01:17:29Z**

# Plan: Revisit bay-g1jp — Responsive Calendar / Add-to-Calendar Link

## Context

The original bay-g1jp fix hid the calendar on small screens by targeting `.noprint:has(#net-calendar)`. This was a hack: `.noprint` is meant solely for print-media suppression. The fix should use a dedicated responsive class. Additionally, hiding the calendar also hides the "Add to calendar" link generated inside `calendar.js`, so mobile users lose access to the ICS subscription link.

## Changes

### 1. `eleventy.config.js` (line 67)

Register `hidden-sm` as a markdown-it-container with a custom renderer that emits **both** `hidden-sm` and `noprint` classes. This keeps the calendar invisible on print while adding the new responsive class cleanly:

```js
/* Before */
plugins: [anchorPlugin, attrsPlugin, [markdownItContainer, "noprint"]],

/* After */
plugins: [
  anchorPlugin,
  attrsPlugin,
  [markdownItContainer, "noprint"],
  [markdownItContainer, "hidden-sm", {
    render(tokens, idx) {
      return tokens[idx].nesting === 1
        ? '<div class="hidden-sm noprint">\n'
        : '</div>\n';
    }
  }],
],
```

### 2. `content/css/style.css.liquid`

**Inside `@media (max-width: 768px)`** — replace the misuse of `.noprint` with the new class:

```css
/* Before */
.noprint:has(#net-calendar) {
  display: none;
}

/* After */
.hidden-sm {
  display: none;
}
```

**Inside `@media (min-width: 769px)`** — hide the mobile-only link on large screens:

```css
.show-sm {
  display: none;
}
```

No change needed to the `@media print` rule — the `hidden-sm` container already carries `noprint`, and the new link will carry `noprint` explicitly, so both are suppressed by the existing print rule.

### 3. `content/nets.md`

**Calendar wrapper** — swap `noprint` for `hidden-sm`:

```markdown
/* Before */
::: noprint
## Calendar
...
:::

/* After */
::: hidden-sm
## Calendar
...
:::
```

**Add-to-calendar link** — insert just below `## List of nets {.calendar}`, before the `<table>`:

```html
<a class="show-sm noprint cal-subscribe" href="/nets.ics">Add to calendar</a>
```

- `show-sm`: hidden on ≥769px screens, visible on ≤768px
- `noprint`: hidden on print via the existing print rule
- `cal-subscribe`: reuses the existing calendar link style

## Files Modified

- `eleventy.config.js` — line 67 (register `hidden-sm` container with custom renderer)
- `content/css/style.css.liquid` — lines 365-368 (replace with `.hidden-sm` rule), ~449-453 (add `.show-sm` rule)
- `content/nets.md` — line 19 (`::: noprint` → `::: hidden-sm`), line 27 (new link)

## Verification

1. `npm run build` — confirm build passes
2. `npm test` — confirm tests pass
3. View `/nets` at full width: calendar visible, no mobile link visible
4. View `/nets` at ≤768px: calendar hidden, "Add to calendar" link visible above the table
5. Print preview of `/nets`: neither the calendar section nor the "Add to calendar" link appear
