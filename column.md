---
layout: defalt
title: "コラム"
permalink: /column/
---

<div class="page-header">
    <h1>コラム</h1>
    <p class="page-subtitle">Articles</p>
</div>



<div class="column-content">
    <div class="categories-section">
        <h2>カテゴリー一覧</h2>
        <div class="categories-grid categories-grid--fixed">
            <a href="{% link r.md %}" class="category-card"><h3>R</h3><p>Data Analysis</p></a>
            <a href="{% link programming.md %}" class="category-card"><h3>プログラミング</h3><p>Programming</p></a>
            <a href="{% link qualtrics.md %}" class="category-card"><h3>Qualtrics</h3><p>Survey Design</p></a>
            <a href="{% link statistics.md %}" class="category-card"><h3>統計学</h3><p>Statistics</p></a>
            <a href="{% link research.md %}" class="category-card"><h3>研究</h3><p>Research</p></a>
            <a href="{% link blog.md %}" class="category-card"><h3>ブログ</h3><p>Blog</p></a>
        </div>
    </div>
    <div class="recent-articles-section">
        <h2>最新記事</h2>
        <div class="articles-grid">
            {% assign recent_posts = site.posts | slice: 0, 6 %}
            {% for post in recent_posts %}
            <div class="post-card">
                <h3 class="article-title">{{ post.title }}</h3>
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <div class="post-footer-inline">
                    <div class="post-meta">
                        <span class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                        <span class="post-category">{{ post.categories | first }}</span>
                    </div>
                    <a href="{{ post.url | relative_url }}" class="article-link">続きを読む →</a>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div>
