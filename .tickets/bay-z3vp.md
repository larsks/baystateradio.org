---
id: bay-z3vp
status: closed
deps: []
links: []
created: 2026-03-18T14:58:23Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix net link target

Clicking on an event in the calendar (in content/nets.md) should go to the corresponding /net/NAME URL, not directly to the remote event url. That s, clicking on the "Pocahontas Net" pill in the calendar should go to /net/pocahontas/.

## Notes

**2026-03-18T15:32:11Z**

# Approved Plan

## Root Cause
In `src/calendar.js`, `getNetsForMonth()` reads `event.component.getFirstPropertyValue("url")` from the parsed ICS and uses it as the pill href. This is the external URL.

## Key Insight
Each VEVENT has a UID in the form `${fileSlug}@baystateradio.org`. We can derive the local page URL `/net/${slug}/` from the UID without touching ICS generation.

## Change
### `src/calendar.js` line 43:
Replace URL extraction with local URL derived from event UID:
```js
const uid = event.uid || "";
const slug = uid.split("@")[0];
const url = slug ? `/net/${slug}/` : "";
```

### `src/calendar.test.js` line 84:
Update expected URL from `/nets/test/` to `/net/testnet/` (derived from fileSlug).
