---
id: bay-f0xs
status: closed
deps: []
links: []
created: 2026-03-19T15:30:38Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# org.js: escape HTML in title/acronym/url before injecting into template literal

Line 29: title, acronym, and org.url from frontmatter are interpolated without escaping. Add escHtml() helper.


## Notes

**2026-03-19T19:10:43Z**

Implementation plan for bay-f0xs:

1. Add escHtml() helper function to org.js
   - Escape HTML special characters: &, <, >, ", '
   - Export the function for testing

2. Update formatOrganization() to escape user-controlled values
   - Escape title before use
   - Escape acronym before use
   - Escape org.url before use in href attribute

3. Add test cases to org.test.js
   - Test escHtml() with various special characters
   - Test formatOrganization() with HTML characters in title
   - Test formatOrganization() with HTML characters in acronym
   - Test formatOrganization() with HTML characters in url

4. Run tests to verify fixes work correctly
5. Run build to ensure no regressions
