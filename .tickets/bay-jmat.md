---
id: bay-jmat
status: closed
deps: [bay-wwed]
links: []
created: 2026-03-19T15:30:23Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# calendar.js: use event delegation instead of re-attaching listeners on each render

Lines 138–161: listeners are attached after every innerHTML replacement. Use event delegation on the container, attached once in init().


## Notes

**2026-03-19T19:34:17Z**

Refactor calendar.js to use event delegation instead of re-attaching listeners on each render:

1. Remove lines 138-161 (event listener attachments in renderCalendar function)
2. Modify renderCalendar to store current year/month on container as data attributes
3. Add event delegation in init() function:
   - Attach single click listener to container element
   - Check event.target to identify which button was clicked (cal-prev, cal-next, cal-today)
   - Read year/month from container data attributes
   - Calculate new year/month and re-render calendar
4. Test that navigation still works correctly

**2026-03-19T19:54:12Z**

Refactor calendar.js to use event delegation instead of re-attaching listeners on each render:

1. Read calendar.js to understand the current implementation
2. Remove lines 138-161 (event listener attachments in renderCalendar function)
3. Modify renderCalendar to store current year/month on container as data attributes
4. Add event delegation in init() function:
   - Attach single click listener to container element
   - Check event.target to identify which button was clicked (cal-prev, cal-next, cal-today)
   - Read year/month from container data attributes
   - Calculate new year/month and re-render calendar
5. Test that navigation still works correctly with npm test
6. Verify build passes with npm run build
