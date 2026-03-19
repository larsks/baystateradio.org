---
id: bay-ajdu
status: closed
deps: []
links: []
created: 2026-03-19T00:49:16Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix calendar width

The calendar presented by contents/nets.md is too wide. It appears to have a mininum width of just over 1500 px, which causes problems both on smaller screens and on printed output.

The calendar should scale well to smaller sizes, and should hide overflow content if necessary.

## Notes

**2026-03-19T00:55:33Z**

## Plan: Fix calendar width

### Root Cause

`grid-template-columns: repeat(7, 1fr)` allows each column to be at least as wide as its minimum content size. Because `.cal-pill` uses `white-space: nowrap`, the minimum content width of a pill is the full unbroken text width. Since all 7 columns share the same `1fr` unit and must all be equal, they all expand to the widest pill's intrinsic width — producing a calendar that is `7 × max_pill_width` pixels wide.

### Fix

**File**: `content/css/style.css.liquid`

Change `.cal-grid`:
```css
/* before */
grid-template-columns: repeat(7, 1fr);

/* after */
grid-template-columns: repeat(7, minmax(0, 1fr));
```

`minmax(0, 1fr)` sets the minimum column width to 0, decoupling column sizing from content minimum widths. The existing `.cal-pill` rules (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) will then gracefully clip long event names within each cell.

No JavaScript changes are needed — this is a pure CSS fix.
