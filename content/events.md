---
title: Public Service Events
linkName: Public Service
weight: 20
tags:
- page
---

The [ARRL] describes Public Service as "Amateur Radio operators [volunteering to] help their communities in good times and bad, through community events, disaster response, and various programs." This page presents a calendar of amateur radio volunteer service opportunities. Volunteering is a great way to give back to the community, meet other radio amateurs, and see parts of the area you may not have seen before.

[arrl]: https://www.arrl.org/

## Schedule

{% assign schedule = collections.event | eventsByMonth %}
{% for month in schedule %}
### {{ month.name }}

{% if month.events.size == 0 %}
No events this month.
{% else %}
{% for event in month.events %}
- {{ event.data.schedule | formatEventDate }} - <a href="{{ event.url }}">{{ event.data.title }}</a>{% if event.data.organization %} ({{ event.data.organization | formatOrganization }}){% endif %}
{% endfor %}
{% endif %}
{% endfor %}
