---
title: Amateur Radio Organizations
linkName: Organizations
weight: 40
tags:
- page
---

{% assign sortedOrgs = collections.org | sort: 'data.title' %}
<div class="org-grid">
{%- for org in sortedOrgs -%}
<article class="org-card">
  {%- if org.data.coverImage -%}
  <div class="org-card-image">
    <img src="{{ org.data.coverImage }}" alt="{{ org.data.title }}">
  </div>
  {%- endif -%}
  <div class="org-card-body">
    <h2><a class="org-card-link" href="{{ org.url }}">{{ org.data.title }}{% if org.data.abbreviation %} ({{ org.data.abbreviation }}){% endif %}</a></h2>
    {%- if org.data.url -%}<p><a class="org-card-url" href="{{ org.data.url }}">{{ org.data.url }}</a></p>{%- endif -%}
    {%- if org.data.location -%}<p>{{ org.data.location }}</p>{%- endif -%}
    <p class="org-excerpt">{% if org.data.page.excerpt %}{{ org.data.page.excerpt }}{% else %}{{ org.templateContent | firstParagraph }}{% endif %}</p>
  </div>
</article>
{%- endfor -%}
</div>
