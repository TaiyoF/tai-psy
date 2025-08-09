---
layout: defalt
title: "コラム"
permalink: /column/
---

<div class="page-header">
    <h1>コラム</h1>
    <p class="page-subtitle">Articles & Notes</p>
</div>



<div class="column-content">
    <div class="categories-section">
        <h2>カテゴリー一覧</h2>
        <div class="categories-grid">
            <a href="{% link r.md %}" class="category-card">
                <h3>R</h3>
                <p>Data Analysis with R</p>
            </a>
            <a href="{% link qualtrics.md %}" class="category-card">
                <h3>Qualtrics</h3>
                <p>Survey Design with Qualtrics</p>
            </a>
            <a href="{% link statistics.md %}" class="category-card">
                <h3>統計学</h3>
                <p>Statistics</p>
            </a>
            <a href="{% link research.md %}" class="category-card">
                <h3>研究</h3>
                <p>Research</p>
            </a>
            <a href="{% link trivia.md %}" class="category-card">
                <h3>雑学</h3>
                <p>Trivia</p>
            </a>
        </div>
    </div>
    <div class="recent-articles-section">
        <h2>最新記事</h2>
        <div class="articles-grid">
            {% assign recent_posts = site.posts | slice: 0, 6 %}
            {% for post in recent_posts %}
            <div class="article-card">
                <div class="article-meta">
                    <span class="article-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                    <span class="article-category">{{ post.categories | first }}</span>
                </div>
                <h3 class="article-title">{{ post.title }}</h3>
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <a href="{{ post.url | relative_url }}" class="article-link">続きを読む →</a>
            </div>
            {% endfor %}
        </div>
    </div>
</div>
