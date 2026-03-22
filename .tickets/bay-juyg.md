---
id: bay-juyg
status: closed
deps: []
links: []
created: 2026-03-21T12:51:06Z
type: task
priority: 2
assignee: Lars Kellogg-Stedman
---
# Show latest news post in full

On the news page (content/news.md), the most recent post should be shown in its entirety, rather than only an excerpt. Remaining posts on the page should show only excerpts.

## Notes

**2026-03-21T12:53:39Z**

# Plan: Show latest news post in full (bay-juyg)

## Context
The news page currently shows an excerpt + "continue reading" link for posts that define `page.excerpt` in frontmatter, or full content for posts without an excerpt. The ticket asks to always show the most recent post in full, while remaining posts use the existing excerpt logic.

## File to modify
`content/news.liquid` — the news page template

## Current logic (lines 16–21)
```liquid
{% if post.data.page.excerpt %}
{{ post.data.page.excerpt | renderTemplate | markdown }}
<p>[<a href="{{ post.url }}">continue reading...</a>]</p>
{% else %}
{{ post.templateContent }}
{%endif %}
```

## Proposed change
Use `forloop.first` to unconditionally render the first (most recent) post in full, then apply excerpt logic to the rest:

```liquid
{% if forloop.first %}
{{ post.templateContent }}
{% elsif post.data.page.excerpt %}
{{ post.data.page.excerpt | renderTemplate | markdown }}
<p>[<a href="{{ post.url }}">continue reading...</a>]</p>
{% else %}
{{ post.templateContent }}
{%endif %}
```

## Ticket workflow steps
1. `tk show bay-juyg` — already done
2. `tk start bay-juyg`
3. `git worktree add .claude/worktrees/bay-juyg -b worktree-bay-juyg`
4. `ln -s $PWD/node_modules .claude/worktrees/bay-juyg/node_modules`
5. Work inside the worktree
6. Add plan to ticket via temp file
7. Edit `content/news.liquid`
8. Commit code + ticket file together
9. `tk close bay-juyg`
10. Merge and clean up

## Verification
- `npm run build` passes with no errors
- `npm test` passes
- Inspect the built `_site/news/index.html` to confirm: first post renders full `templateContent`, subsequent posts show excerpts with "continue reading" links
