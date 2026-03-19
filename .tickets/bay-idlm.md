---
id: bay-idlm
status: closed
deps: []
links: []
created: 2026-03-19T11:13:39Z
type: feature
priority: 2
assignee: Lars Kellogg-Stedman
---
# Show 13-month sliding window in events listing, grey out past events


## Notes

**2026-03-19T11:13:49Z**

Rework eventsByMonth to return 13-month window (prev month + 12 ahead), wrapping events as {event, isPast}. Update template to show year in headings and grey out past events with .event-past CSS class. Update tests to use injected now date.
