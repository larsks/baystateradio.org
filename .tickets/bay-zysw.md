---
id: bay-zysw
status: in_progress
deps: []
links: []
created: 2026-03-21T04:07:56Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Better organization print layout

The list of organizations (in content/organizations.md) wastes a lot of space when printing. Let's solve that by:

- Use a single column layout for printing.
- Remove the borders from each organization.
- Allow listings to have flexible vertical size

## Notes

**2026-03-21T04:14:53Z**

All changes are in @media print only.

1. Override .org-grid to single column: grid-template-columns: 1fr
2. Remove the .org-card::before rule (it draws a pseudo-element border to
   work around overflow:hidden; unnecessary in the simplified print layout)
3. Override .org-card-image: remove fixed height and background so the
   image container sizes naturally to its content

**2026-03-21T04:18:03Z**

Follow-up: need to cap image size in print layout.

Setting height: auto on .org-card-image means large images can dominate the page.
Add max-height: 2in to .org-card-image in @media print to bound them to a
reasonable print-friendly size. The image's object-fit: contain ensures it
scales down proportionally within the container.

**2026-03-21T04:23:26Z**

Follow-up: in print layout, images should be positioned left of the listing

In the print layout, having the cover images rendered above the listing results in an enormous waste of white space. Let's place cover images to the left of the associated listing. Images take a fixed amount of horizontal space, and we should account for that even for listings that don't have an image. This will ensure that all listing are aligned at the same position.
