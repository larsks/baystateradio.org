---
id: bay-c8fn
status: closed
deps: []
links: []
created: 2026-03-19T02:32:57Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Add org links to events

Events in content/event/ will usually have an "organization" file, which contains a slug matching a basename in the content/org/ directory. When displaying these events in contents/events.md, I would like to replace that slug with the name and acronym from the front-matter of the corresponding file in content/org.

## Notes

**2026-03-19T02:39:39Z**

Look up each event's org in collections.org using where filter on fileSlug, display org title and acronym. Falls back to raw slug if no matching org, shows nothing if no org set.
