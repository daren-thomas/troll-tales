---
layout: default
title: Troll Tales
---

<div class="cards-container">
  {% for post in site.posts %}
  <div class="card">
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-meta">
      Published on {{ post.date | date: "%B %-d, %Y" }} | Tags: {{ post.tags | array_to_sentence_string }}
    </p>
    <p class="post-snippet">{{ post.excerpt }}</p>
  </div>
  {% endfor %}
</div>