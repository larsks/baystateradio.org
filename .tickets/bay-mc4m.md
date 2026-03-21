---
id: bay-mc4m
status: closed
deps: []
links: []
created: 2026-03-20T23:56:47Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Fix header and nav on small screens

The page header and navigation does not display well on small screens.

We should scale the logo and h1 font size on small screens so that they fit. The logo should probably be positioned above the title on small displays (to free up horizontal space for the text).

We need to figure out how to make that navigation menu work on small displays. Maybe it should collapse into a "hamburger" type menu? I am looking for suggestions for solutions.

## Notes

**2026-03-21T00:38:14Z**

# Plan: bay-mc4m — Fix header and nav on small screens

## Context

The page header (logo + h1) and navigation menu are desktop-only in design. On small screens (phones), the hero section is oversized and the nav items overflow or wrap badly. The ticket asks us to:
1. Scale the logo and h1 down on small screens, stacking the logo above the title.
2. Collapse the navigation into a hamburger menu on small screens.

## Files to Modify

- `content/_includes/base.liquid` — add hamburger `<button>` and inline JS toggle
- `content/css/style.css.liquid` — add `@media (max-width: 768px)` rules

## Implementation

### 1. `content/_includes/base.liquid`

Inside `<nav>`, before the `<ul>`, add a hamburger button:

```html
<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
  <span></span><span></span><span></span>
</button>
```

After the closing `</header>`, add an inline `<script>`:

```html
<script>
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('nav ul');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
  });
</script>
```

### 2. `content/css/style.css.liquid`

Add a `@media (max-width: 768px)` block:

```css
@media (max-width: 768px) {
  /* Hero: stack logo above h1, reduce size */
  .hero, .hero--small {
    flex-direction: column;
    height: auto;
    min-height: 120px;
    padding: 1rem;
    gap: 0.5rem;
    text-align: center;
  }
  .hero h1 { font-size: 250%; }
  .hero--small h1 { font-size: 180%; }
  .hero-logo { max-height: 60px; width: auto; }

  /* Nav: hide hamburger button on desktop (handled below), show on mobile */
  .nav-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin-left: auto;
  }
  .nav-toggle span {
    display: block;
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 2px;
  }

  nav { flex-direction: column; align-items: flex-start; }
  nav ul { display: none; flex-direction: column; gap: 0; width: 100%; padding: 0; }
  nav ul.open { display: flex; }
  nav ul li a { display: block; padding: 0.5rem 1rem; }
}

/* Hide hamburger on wider screens */
@media (min-width: 769px) {
  .nav-toggle { display: none; }
}
```

Also update the existing nav `display` rule so the `<nav>` itself uses `flex` and `flex-wrap: wrap` to accommodate the toggle button layout.

## Verification

1. `npm run build` — build must succeed
2. `npm test` — tests must pass
3. Manual check at ≤768px viewport: logo stacks above h1, hamburger button appears, clicking it opens/closes nav links
4. Manual check at ≥769px viewport: normal horizontal nav, no hamburger button visible
