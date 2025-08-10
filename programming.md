---
layout: defalt
title: "プログラミング"
permalink: /programming/
---

<div class="page-header">
    <h1>プログラミング</h1>
    <p class="page-subtitle">Programming</p>
</div>

<div class="category-content">
    <div class="articles-section">
        <h2>記事一覧</h2>
        <div class="articles-grid">
            {% assign programming_posts = site.posts | where: "categories", "programming" %}
            {% include category_empty.html posts=programming_posts %}
            {% for post in programming_posts %}
            <a href="{{ post.url | relative_url }}" class="post-card">
                <div class="post-meta">
                    <span class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                    <span class="post-category">プログラミング</span>
                </div>
                <h3 class="article-title">{{ post.title }}</h3>
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <span class="article-link">続きを読む →</span>
            </a>
            {% endfor %}
        </div>
    </div>
</div>


