---
layout: defalt
title: "ホーム"
---

<div class="hero-section">
    <div class="hero-content">
        <h1 class="hero-title">藤田 太陽</h1>
        <p class="hero-subtitle">大阪大学 大学院人間科学研究科 社会心理学研究分野</p>
        <div class="hero-disclaimer">
            <p>このサイトは藤田太陽の個人サイトです。<br>内容はすべて個人の見解であり、所属機関等とは関係ありません。</p>
        </div>
    </div>
</div>

<div class="content-section">
    <div class="grid-container">
        <div class="card">
            <h3>プロフィール</h3>
            <p>大阪大学大学院人間科学研究科博士前期課程。社会心理学を専攻し、統計学とプログラミングを活用した研究を行っています。</p>
            <a href="{% link about-me.md %}" class="card-link">詳細を見る →</a>
        </div>
        <div class="card">
            <h3>研究テーマ</h3>
            <p>社会規範がどのように形成・変容・維持されるのかについて研究しています。自由意志信念の自己制御機能についても関心があります。</p>
            <a href="{% link about-research.md %}" class="card-link">詳細を見る →</a>
        </div>
        <div class="card">
            <h3>業績</h3>
            <p>研究発表や論文執筆などの学術業績について紹介しています。学会発表、論文投稿、受賞歴などの情報を掲載しています。</p>
            <a href="{% link about-cv.md %}" class="card-link">詳細を見る →</a>
        </div>
    </div>
</div>

<div class="recent-posts-section">
    <h2>最新記事</h2>
    <div class="posts-grid">
        {% assign recent_posts = site.posts | slice: 0, 3 %}
        {% for post in recent_posts %}
        <div class="post-card">
            <div class="post-meta">
                <span class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                <span class="post-category">{{ post.categories | first }}</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 100 }}</p>
            <a href="{{ post.url | relative_url }}" class="post-link">続きを読む →</a>
        </div>
        {% endfor %}
    </div>
    <div class="view-all-posts">
        <a href="{% link column.md %}" class="btn btn-outline">すべての記事を見る</a>
    </div>
</div>
