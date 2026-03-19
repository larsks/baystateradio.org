---
id: bay-wwed
status: closed
deps: []
links: []
created: 2026-03-19T15:30:15Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# calendar.js: split renderCalendar to separate HTML building from DOM mutation

Lines 88–162: function builds day-event map, generates HTML, sets innerHTML, and attaches event listeners. Split into buildCalendarHtml() and renderCalendar().


## Notes

**2026-03-19T19:14:34Z**

Split renderCalendar into two functions to separate HTML generation from DOM mutation:

1. Create buildCalendarHtml(events, year, month):
   - Take events, year, month as parameters
   - Build day-event map using getNetsForMonth
   - Generate and return HTML string (lines 90-135)
   - Return the HTML string

2. Modify renderCalendar(events, year, month, container):
   - Call buildCalendarHtml to get HTML
   - Set container.innerHTML with the returned HTML
   - Attach event listeners to navigation buttons

This separates concerns: buildCalendarHtml is pure (no side effects), renderCalendar handles DOM mutation.
