---
layout: defalt
title: "R"
permalink: /r/
---

<div class="page-header">
    <h1>R</h1>
    <p class="page-subtitle">Data Analysis with R</p>
</div>


<div class="category-content">
    <div class="articles-section">
        <h2>記事一覧</h2>
        <div class="articles-grid">
            {% assign r_posts = site.posts | where: "categories", "r" %}
            {% include category_empty.html posts=r_posts %}
            {% for post in r_posts %}
            <a href="{{ post.url | relative_url }}" class="post-card">
                <div class="post-meta">
                    <span class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                    <span class="post-category">R</span>
                </div>
                <h3 class="article-title">{{ post.title }}</h3>
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <span class="article-link">続きを読む →</span>
            </a>
            {% endfor %}
        </div>
    </div>
</div>
