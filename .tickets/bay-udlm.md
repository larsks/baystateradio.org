---
id: bay-udlm
status: closed
deps: []
links: []
created: 2026-03-18T17:14:42Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Add to calendar link for nets

On each net detail page (e.g., /net/6pmnet), include an "Add to calendar" link as a new line in the "Schedule" cell of the metadata table. This will require:

1. Generate an icalendar format file for each net (/net/6pmnet.ics), and
2. Add the link to the layout in content/_includes/net.liquid.

## Notes

**2026-03-18T17:23:59Z**

## Implementation Plan

### 1. Create `content/net-ics.11ty.js`
Uses Eleventy pagination to generate one ICS file per net. Mirrors `nets.ics.11ty.js` but produces a single-VEVENT calendar per net.

### 2. Edit `content/_includes/net.liquid`
Add an "Add to calendar" link inside the Schedule `<td>`, only when `schedule` is set.

## Files
- **Create**: `content/net-ics.11ty.js`
- **Edit**: `content/_includes/net.liquid` (lines 14-16)
