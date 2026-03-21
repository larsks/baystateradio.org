---
id: bay-seur
status: in_progress
deps: []
links: []
created: 2026-03-21T12:12:38Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Implement an author registry

To specify the author in news posts (in content/post), I would like to enable an author registry:

- A data file content/data/authors.yaml maps an identifier to information about an author.
- In templates that display author information, we will look up the entry for the post author in the author registry:
  - if we find a matching entry, we will use the metadata to generate an author string.
  - if we do not find a matching entry, we will use the author data from the post verbatim.

## Notes

**2026-03-21T12:21:08Z**

# Plan: Implement Author Registry (bay-seur)

## Context

Posts in `content/post/` have an optional `author` frontmatter field currently stored as a plain string (e.g. "Lars Kellogg-Stedman (N1LKS)"). The ticket asks for a registry that maps short identifiers (e.g. `n1lks`) to structured author metadata, with templates looking up the identifier and falling back to verbatim display if no match is found.

`content/data/authors.yaml` already exists (untracked) with one entry. The approach mirrors the existing org lookup pattern (`src/org.js` / `formatOrganization` filter).

---

## Implementation Steps

### 1. Move authors data to Eleventy's data directory

Move `content/data/authors.yaml` → `content/_data/authors.yaml`.

Eleventy's input dir is `content/`, so its auto-data dir is `content/_data/`. Placing `authors.yaml` there makes `authors` available as a global template variable with no config changes. The `content/data/` directory is not auto-loaded.

### 2. Create `src/author.js`

Model after `src/org.js`. Reuse `escHtml` from `org.js`.

```js
import { escHtml } from "./org.js";

// authors is a plain object (key → {name, callsign?, url?}), not an array
export function resolveAuthor(slug, authors) {
  if (!slug || !authors || typeof authors !== "object") return null;
  return authors[slug] ?? null;
}

export function formatAuthor(slug, authors) {
  if (!slug) return "";
  const author = resolveAuthor(slug, authors);
  if (!author) return String(slug);   // verbatim fallback
  const { name, callsign, url } = author;
  const label = callsign
    ? `${escHtml(name)} (${escHtml(callsign)})`
    : escHtml(name);
  return url ? `<a href="${escHtml(url)}">${label}</a>` : label;
}
```

### 3. Create `src/author.test.js`

Vitest tests covering:
- `resolveAuthor`: found, not found, empty slug, null/undefined slug, bad authors arg
- `formatAuthor`: linked name+callsign, linked name only, plain name+callsign, plain name only, unknown slug (verbatim), empty/null slug, XSS escaping in name/callsign/url

### 4. Update `eleventy.config.js`

Add import and register a filter that reads `authors` from the template context (same pattern as `formatOrganization`):

```js
import { formatAuthor } from "./src/author.js";

// inside export default function:
eleventyConfig.addFilter("formatAuthor", function (slug) {
  const authors = this.context?.getAll()?.authors ?? {};
  return formatAuthor(slug, authors);
});
```

### 5. Update templates

**`content/_includes/post.liquid`** (line 7):
```liquid
- by {{ author }} at
+ by {{ author | formatAuthor | safe }} at
```

**`content/_includes/home.liquid`** (line 15):
```liquid
- by {{ latest.data.author }} at
+ by {{ latest.data.author | formatAuthor | safe }} at
```

The `| safe` filter is needed because `formatAuthor` may return an HTML `<a>` tag, and Liquid escapes output by default.

---

## Critical Files

| File | Change |
|------|--------|
| `content/data/authors.yaml` | Move to `content/_data/authors.yaml` |
| `src/author.js` | Create — lookup + format logic |
| `src/author.test.js` | Create — vitest unit tests |
| `eleventy.config.js` | Add import + `formatAuthor` filter |
| `content/_includes/post.liquid` | Use `| formatAuthor | safe` |
| `content/_includes/home.liquid` | Use `| formatAuthor | safe` |

---

## Verification

1. `npm test` — all tests pass including new `author.test.js`
2. `npm run build` — build succeeds with no errors
3. Check `_site/post/*/index.html` for a post with `author: n1lks` — byline renders as linked `<a href="https://n1lks.oddbit.com/">Lars Kellogg-Stedman (N1LKS)</a>`
4. Check a post with no matching author (verbatim string) — byline renders the raw string unchanged
5. Check the homepage sidebar — byline renders correctly for the latest post
