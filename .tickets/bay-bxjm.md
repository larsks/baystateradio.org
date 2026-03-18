---
id: bay-bxjm
status: closed
deps: []
links: []
created: 2026-03-18T14:14:15Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Add subscribe link

Add a "subscribe" link to the calendar widget in content/nets.md. The link should appear at the top of the calendar aligned with the right edge, and should point to /nets.ics.

## Notes

**2026-03-18T14:27:44Z**

## Plan

### 1. `content/js/calendar.js` — add subscribe link to cal-header

Add `<a class="cal-subscribe" href="/nets.ics">Subscribe</a>` inside `.cal-header` after the Today button.

### 2. `content/css/style.css.liquid` — add `.cal-subscribe` styles

Add styles with `margin-left: auto` to push the link to the right edge of the flexbox header.
