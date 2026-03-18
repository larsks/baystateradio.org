---
id: bay-go1o
status: closed
deps: []
links: []
created: 2026-03-18T12:26:26Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Add "Today" link to calendar


There needs to be a button or link of some sort at the top of the calendar (in content/nets.md) that will
bring the user back to the current month.

The new widget should appear to the right of the existing widgets (to the right of the next-month
button).



## Notes

**2026-03-18T12:35:23Z**

# Plan: Add "Today" link to calendar (bay-go1o)

## Context
The `/nets` page has an interactive monthly calendar. Users can navigate between months with prev/next buttons, but have no way to jump back to the current month. This ticket asks for a "Today" button placed to the right of the existing next-month button.

## File to Modify
`/home/lars/projects/baystateradio.org/content/js/calendar.js`

## Implementation

### 1. Add "Today" button to the header HTML (line 103–108)

Change the `cal-header` HTML in `renderCalendar()` to include a third button:

```javascript
let html = `<div class="cal-header">
  <button class="cal-nav" id="cal-prev" aria-label="Previous month">&#8249;</button>
  <span class="cal-month-label">${MONTH_NAMES[month]} ${year}</span>
  <button class="cal-nav" id="cal-next" aria-label="Next month">&#8250;</button>
  <button class="cal-nav" id="cal-today" aria-label="Go to today">Today</button>
</div>`;
```

### 2. Add event listener for the "Today" button (after line 149)

After the `cal-next` listener, add:

```javascript
document.getElementById("cal-today").addEventListener("click", () => {
  const now = new Date();
  renderCalendar(nets, now.getFullYear(), now.getMonth(), container);
});
```

### 3. Disable "Today" when already on current month

```javascript
const nowCheck = new Date();
const isCurrentMonth = year === nowCheck.getFullYear() && month === nowCheck.getMonth();

// button becomes:
<button class="cal-nav" id="cal-today" aria-label="Go to today"${isCurrentMonth ? ' disabled' : ''}>Today</button>
```
