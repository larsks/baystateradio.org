---
id: bay-e5mm
status: closed
deps: []
links: []
created: 2026-03-18T02:05:21Z
type: feature
priority: 2
assignee: Lars Kellogg-Stedman
---
# Generate ical output

I would like to present the net schedule information currently shown at http://localhost:8080/nets/ as an icalendar format file (at http://localhost:8080/nets.ics). We should assume a timezone of America/New_York.

## Notes

**2026-03-18T02:24:31Z**

An icalendar validator reports the following errors:

Missing DTSTAMP property near line # 24Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 33Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 41Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 50Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 59Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 68Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 77Reference: RFC 5545 3.6.1. Event Component
Missing DTSTAMP property near line # 85Reference: RFC 5545 3.6.1. Event Component
Invalid RRULE value (invalid BYDAY value) near line # 85Reference: 3.8.5.3. Recurrence Rule
Missing DTSTAMP property near line # 93Reference: RFC 5545 3.6.1. Event Component 

