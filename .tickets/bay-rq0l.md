---
id: bay-rq0l
status: in_progress
deps: []
links: []
created: 2026-03-23T14:07:40Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Icalendar files for events

I would like to generate an icalendar file for all events in @content/events/. This should be exposed at /events.ics. I would also like to generate an icalendar file for each individual event at /events/<event-slug>.ics. Please review the existing icalendar implementations in @content/nets/net.ics.11ty.js and @content/nets/nets.ics.11ty.js and follow that model. Consider ways in which we can avoid duplication of code between these two implementations.

