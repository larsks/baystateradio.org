---
title: Radio Nets
linkName: Nets
weight: 30
tags:
- page
---

In the ham radio universe, a net (a shortened form of the
word “network”) is an on-the-air gathering that usually
convenes at a specific frequency and at a specific date
and time. Nets can take place on any frequency band,
and can use any mode of communication. (via [ARRL](https://www.arrl.org/files/file/On%20the%20Air%20Email/OTA%20Nets.pdf)) This page presents a calendar of local radio nets. Most nets welcome all participants, regardless of whether or not you are a member of the sponsoring club. Select a calendar entry for more information!

## Calendar

<div id="net-calendar"></div>
<script src="/js/calendar.js" defer></script>

## List of nets

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
