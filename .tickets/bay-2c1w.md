---
id: bay-2c1w
status: closed
deps: []
links: []
created: 2026-03-19T15:30:07Z
type: task
priority: 3
assignee: Lars Kellogg-Stedman
---
# eleventy.config.js: replace 10 passthroughCopyExtension calls with a loop

Lines 19–29 call passthroughCopyExtension once per extension; a loop over an array is shorter and easier to extend.


## Notes

**2026-03-19T19:15:02Z**

Replace 10 individual passthroughCopyExtension calls (lines 19-29) with a loop:

1. Create an array of extensions: ["kmz", "kml", "png", "jpg", "pdf", "txt", "gpx", "js", "gif", "webp", "svg"]
2. Use forEach to loop over the array and call passthroughCopyExtension for each extension

This makes the code more concise and easier to extend in the future.
