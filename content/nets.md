---
title: Radio Nets
linkName: Nets
weight: 20
tags:
- page
---

<table class="bordered">
  <tr>
    <th>Name</th>
    <th>Schedule</th>
    <th>Frequency</th>
  </tr>
{%- for net in collections.net -%}
<tr>
    <td><a href="{{ net.url }}">{{ net.data.title }}</a></td>
    <td>{{ net.data.schedule | formatSchedule}}</td>
    <td>{{ net.data.frequency }}</td>
</tr>
{%- endfor -%}
</ul>
</table>
