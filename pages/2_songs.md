---
title: Songs
metaDescription: The page lists all the songs by category
layout: layouts/songs.njk
permalink: /songs/index.html
eleventyNavigation:
  key: Songs
  order: 2
pagination:
  data: collections.categories
  size: Infinity
excluded:
  - attic
  - archive
  - deprecated
  - sandbox
---

<h1>{{ title }}</h1>

