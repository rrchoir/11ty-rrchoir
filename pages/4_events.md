---
title: Events
metaDescription: The page lists all the events
layout: layouts/base.njk
eleventyNavigation:
  key: Events
  order: 4
pagination:
  data: collections.event
  size: Infinity
permalink: /events/index.html

---
<h1>{{ title }}</h1>

    {% for event in collections.event  | sort(attribute='title') %}

     <h4> <a href="{{ event.page.url | url }}">
            {% if event.data.title %}
              {{ event.data.title }}
            {% else %}
              Untitled
              {{ event.tags }}
            {% endif %}
          </a> --  <i>{{event.data.start_date | readableDateTime }} </i> </h4>
      <p> {{ event.data.summary }} </p><br>
    {% endfor %}