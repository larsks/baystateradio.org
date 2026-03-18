---
id: bay-iebh
status: closed
deps: []
links: []
created: 2026-03-18T17:47:48Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Smaller banner except on main page

I would like to make the following changes to the appearance of the website:

1. I would like the height of the page header image to be smaller (height=200px) on all but the main page. 
2. I would like the logo (content/assets/bsr-logo-medium.png) displayed next to the page title. The logo should be resized as necessary to fit in the available space.


## Notes

**2026-03-18T17:55:42Z**

# Implementation Plan

## Files to modify
- `content/_includes/base.liquid` — template
- `content/css/style.css.liquid` — styles

## Changes

### 1. `content/_includes/base.liquid`
Add conditional CSS class to hero div, and insert logo image alongside h1:

```html
<div class="hero{% if page.url != "/" %} hero--small{% endif %}">
  <img src="/assets/bsr-logo-medium.png" alt="Bay State Radio logo" class="hero-logo">
  <h1>{{ title }}</h1>
</div>
```

### 2. `content/css/style.css.liquid`
- Add `.hero--small` to override height to 200px
- Add `.hero-logo` sizing (max-height: 80%, width: auto, drop-shadow)
- Reduce h1 font-size on small hero (250%) to avoid overflow
