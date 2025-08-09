---
layout: defalt
title: "Qualtrics"
permalink: /qualtrics/
---

<div class="page-header">
    <h1>Qualtrics</h1>
    <p class="page-subtitle">Survey Design with Qualtrics</p>
</div>


<div class="category-content">
    <div class="articles-section">
        <h2>記事一覧</h2>
        <div class="articles-grid">
            {% assign qualtrics_posts = site.posts | where: "categories", "qualtrics" %}
            {% include category_empty.html posts=qualtrics_posts %}
            {% for post in qualtrics_posts %}
            <a href="{{ post.url | relative_url }}" class="article-card">
                <div class="article-meta">
                    <span class="article-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                    <span class="article-category">Qualtrics</span>
                </div>
                <h3 class="article-title">{{ post.title }}</h3>
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <span class="article-link">続きを読む →</span>
            </a>
            {% endfor %}
        </div>
    </div>
</div>
