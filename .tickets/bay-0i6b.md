---
id: bay-0i6b
status: closed
deps: []
links: []
created: 2026-03-19T01:26:10Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix org printing problem

When printing http://localhost:8080/organizations/, many of the box borders are missing the top portion of the left border. It looks as if the image area is overlapping that border somehow. Can we fix this so that the borders print correctly?

## Notes

**2026-03-19T01:32:42Z**

## Plan

Root cause: `overflow: hidden` on `.org-card` causes print renderers to clip the border when combined with the image content.

Fix: Add print-specific overrides in the existing `@media print {}` block in `content/css/style.css.liquid`:

```css
.org-card {
  overflow: visible;
  border-radius: 0;
  break-inside: avoid;
}

.org-card-image {
  overflow: visible;
}
```

- `overflow: visible` — prevents border clipping by the print renderer
- `border-radius: 0` — avoids corner-clipping math that disturbs border rendering in print
- `break-inside: avoid` — keeps each card intact across page breaks

**2026-03-19T01:36:59Z**

## Final Solution

The initial fix (`overflow: visible`) was insufficient. Firefox and Chrome both
still showed the top border being occluded by the image.

Root cause: a card's `border` property paints *behind* child content. Image
elements (replaced elements) render on top of it, occluding the border.

The working fix removes the `border` from `.org-card` in print and replaces it
with a `::before` pseudo-element overlay that paints *on top* of all content:

```css
.org-card {
  overflow: visible;
  border-radius: 0;
  break-inside: avoid;
  border: none;
}

.org-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border: thin solid #ccc;
  pointer-events: none;
  z-index: 10;
}

.org-card-image {
  overflow: visible;
}
```

`.org-card` already has `position: relative` (set for the screen styles), so
the `::before` positions correctly in print without any additional changes.
