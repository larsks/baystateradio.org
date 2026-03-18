---
id: bay-3ynt
status: closed
deps: []
links: []
created: 2026-03-18T13:51:03Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix jiggling widgets

The calendar presented in contents/nets.md has a UI problem: as the month name changes, the position of widgets to the right of the month shifts back and forth. This makes it impossible to simply advance several months, because the "next month" widget may shift away from the current mouse position.

We need a way to resolve this, either by using a fixed-width field for the month name or by relocating the widgets.

## Notes

**2026-03-18T13:56:49Z**

# Plan: Fix jiggling widgets (bay-3ynt)

## Approach

Add `min-width` and `text-align: center` to `.cal-month-label` in the CSS so it always occupies enough space for the longest possible month+year string ("September XXXX"), preventing layout shifts.

## Files to modify

- `content/css/style.css.liquid` — lines 117–121, `.cal-month-label` block

## Change

```css
.cal-month-label {
  font-weight: 700;
  font-size: 1.1rem;
  font-family: Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif;
  min-width: 11em;
  text-align: center;
}
```

`11em` at bold 1.1rem comfortably accommodates "September 2026" (the longest month name + 4-digit year).
