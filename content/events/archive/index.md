---
title: Public Events Archive
---

{% for event in collections.event %}
- {{ event.date | date: '%Y-%m-%d' }}: [{{event.data.title}}]({{event.url}})
{% endfor %}
