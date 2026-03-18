---
id: bay-xsqm
status: closed
deps: []
links: []
created: 2026-03-18T13:59:24Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Show frequency in tooltip

Update the calendar widget in content/nets.md so that the tooltip that displays when hovering over an event displays on a new line, beneath the name and time, the value of the `frequency` field.

## Notes

**2026-03-18T14:02:36Z**

# Plan: Show frequency in tooltip (bay-xsqm)

## Change

**File**: `content/js/calendar.js`, line 134

Update the tooltip `title` attribute to include the frequency on a new line beneath the name and time.

**Current:**
```js
html += `<a class="cal-pill" href="${evt.url}" title="${evt.title}${displayTime ? " at " + displayTime : ""}">${label}</a>`;
```

**Updated:**
```js
const tooltipParts = [`${evt.title}${displayTime ? " at " + displayTime : ""}`];
if (evt.frequency) tooltipParts.push(evt.frequency);
html += `<a class="cal-pill" href="${evt.url}" title="${tooltipParts.join("\n")}">${label}</a>`;
```
