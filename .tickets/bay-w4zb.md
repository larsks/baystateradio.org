---
id: bay-w4zb
status: closed
deps: []
links: []
created: 2026-03-19T13:54:10Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Add caara races to events

Use the information in races.yaml to create event files in contents/event, using content/event/2026-03-28-fools-dual.md as a model. For each race, we only care about the title, the date, and the location. We can ignore the url: and sheet: attributes in races.yaml (in all cases, the url: attribute in the generated file should point at https://sites.google.com/view/caararaces/home).


## Notes

**2026-03-19T14:07:03Z**

# Plan: bay-w4zb — Add CAARA races to events

## Context

The `races.yaml` file lists 13 CAARA race series events. Two already have event files
(`2026-03-28-fools-dual.md` and `2026-04-12-marblehead.md`). The remaining 11 need to
be created, following the model in `content/event/2026-03-28-fools-dual.md`.

## File format (from model + existing files)

```
---
title: <title from races.yaml>
location: <location from races.yaml>
schedule: <YYYY-MM-DD HH:MM 4h>  ← time extracted from races.yaml date field
organization: caara
url: https://sites.google.com/view/caararaces/home
---

{% include "caara-races-blurb.liquid" %}
```

## Files to create

| Filename | Title | Location | Time |
|---|---|---|---|
| `2026-05-03-twinlights.md` | Twin Lights Half Marathon | Gloucester, MA | 08:00 |
| `2026-05-09-barns-and-blooms.md` | Barns and Blooms Half Marathon | Hamilton, MA | 08:00 |
| `2026-06-07-twinlobster.md` | Twin Lobster Half Marathon | Gloucester, MA | 08:00 |
| `2026-06-28-town-and-country.md` | Town and Country Half Marathon | Newburyport, MA | 08:00 |
| `2026-07-19-ipa.md` | IPA Half Marathon | Newburyport, MA | 08:00 |
| `2026-08-02-triplethreat.md` | Triple Threat Half Marathon | Rockport, MA | 08:00 |
| `2026-09-13-bythesea.md` | Half Marathon By-The-Sea | Manchester-by-the-sea, MA | 09:00 |
| `2026-09-27-portrun.md` | Port Run Half Marathon | Newburyport, MA | 08:00 |
| `2026-10-18-around-cape-ann.md` | Around Cape Ann Half Marathon | Gloucester, MA | 09:00 |
| `2026-11-01-oceanview.md` | Ocean View Half Marathon | Ipswich, MA | 09:00 |
| `2026-12-06-happyholidays.md` | Happy Holidays Half Marathon | Gloucester, MA | 09:00 |

Note: "Oean View" typo in races.yaml corrected to "Ocean View" per user instruction.

## Steps

1. `tk start bay-w4zb`
2. `git checkout -b ticket/bay-w4zb`
3. Add plan to ticket
4. Write all 11 event files to `content/event/`
5. `npm run build` — verify build passes
6. `tk close bay-w4zb`
