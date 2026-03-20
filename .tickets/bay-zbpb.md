---
id: bay-zbpb
status: closed
deps: []
links: []
created: 2026-03-20T01:10:05Z
type: bug
priority: 1
assignee: Lars Kellogg-Stedman
---
# Org card images not scaling down to fit container

Images wider than the card container overflow and are clipped, appearing shifted to the right. The img element uses max-width/max-height instead of explicit dimensions, so object-fit: contain has no effect and images render at natural size.

## Acceptance Criteria

All org card images scale down to fit within their container. No image touches or overflows the card border. object-fit: contain keeps aspect ratio and centers the image.


## Notes

**2026-03-20T01:10:24Z**

Fix: change .org-card-image img from max-width/max-height to width: 100%; height: 100% so object-fit: contain has explicit dimensions to work with, scaling oversized images down to fit the container.
