---
layout: defalt
title: "統計学"
permalink: /statistics/
---

<div class="page-header">
    <h1>統計学</h1>
    <p class="page-subtitle">Statistics</p>
</div>


<div class="category-content">
    <div class="articles-section">
        <h2>記事一覧</h2>
        <div class="articles-grid">
            {% assign statistics_posts = site.posts | where: "categories", "statistics" %}
            {% include category_empty.html posts=statistics_posts %}
            {% for post in statistics_posts %}
            <a href="{{ post.url | relative_url }}" class="article-card">
                <div class="article-meta">
                    <span class="article-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                    <span class="article-category">統計学</span>
                </div>
                <h3 class="article-title">{{ post.title }}</h3>
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <span class="article-link">続きを読む →</span>
            </a>
            {% endfor %}
        </div>
    </div>
</div>
