---
id: bay-uyxw
status: closed
deps: []
links: []
created: 2026-03-19T03:02:40Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Fix formatOrganization to handle orgs without an acronym

formatOrganization always appends (ACRONYM) to the label, but some orgs may not have an acronym defined, resulting in output like 'Ham Radio Boston (undefined)'.

## Acceptance Criteria

When an org has no acronym, formatOrganization returns just the title (or linked title). All existing tests still pass. Two new test cases cover the no-acronym path.


## Notes

**2026-03-19T03:04:03Z**

Fix formatOrganization to conditionally append (ACRONYM) only when acronym is defined.

Changes:
- src/org.js line 28: use ternary so label is 'Title (ACRONYM)' when acronym exists, else just 'Title'
- src/org.test.js: add two new test cases inside describe('formatOrganization'):
  1. Linked title only — org has URL but no acronym → '<a href="...">Title</a>'
  2. Plain title only — org has no URL and no acronym → 'Title'
