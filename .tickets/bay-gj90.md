---
id: bay-gj90
status: closed
deps: []
links: []
created: 2026-03-20T01:02:59Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Padding on org grid

Images in the organization grid (content/organizations.md) abut the border directly. I would like to add a small amount of padding at the top of these grid cells so that there is space between the edge of the image and the border.

## Notes

**2026-03-20T01:06:29Z**

Plan: Add padding-top: 0.5rem to .org-card-image rule in content/css/style.css.liquid (around line 155) so images no longer abut the card top border. Build and test, then commit and close ticket.
