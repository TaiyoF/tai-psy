---
layout: defalt
title: "ホーム"
---
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-98LMZK1CYK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-98LMZK1CYK');
</script>

<div class="hero-section">
    <div class="hero-content">
        <h1 class="hero-title">ホーム</h1>
        <p class="hero-subtitle">Welcome!</p>
        <div class="hero-disclaimer">
            <p>このサイトは大阪大学人間科学研究科 藤田太陽の個人サイトです。<br>内容はすべて個人の見解であり、所属機関等とは関係ありません。</p>
        </div>
    </div>
</div>

<div class="content-section">
  <div class="grid-container">
    <a class="card card--link" href="{% link about-me.md %}">
      <h3>プロフィール</h3>
      <p>大阪大学大学院人間科学研究科で大学院生をしています。</p>
      <span class="card-link">詳細を見る →</span>
    </a>

    <a class="card card--link" href="{% link about-research.md %}">
      <h3>研究テーマ</h3>
      <p>社会規範がどのように形成するのかについて研究しています。</p>
      <span class="card-link">詳細を見る →</span>
    </a>

    <a class="card card--link" href="{% link about-cv.md %}">
      <h3>業績</h3>
      <p>研究発表や論文執筆などの学術業績についてのページです。</p>
      <span class="card-link">詳細を見る →</span>
    </a>
  </div>
</div>

<div class="recent-posts-section">
  <h2>最新記事</h2>

  <div class="posts-grid">
    {% assign recent_posts = site.posts | slice: 0, 3 %}
    {% for post in recent_posts %}
      <a class="post-card post-card--link" href="{{ post.url | relative_url }}">
        <h3 class="post-title">{{ post.title }}</h3>

        <p class="post-excerpt">
          {{ post.excerpt | strip_html | strip_newlines | strip | truncate: 100 }}
        </p>

        <div class="post-footer-inline">
          <div class="post-meta">
            <span class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
            <span class="post-category">{{ post.categories | first }}</span>
          </div>

          <span class="post-link">続きを読む →</span>
        </div>
      </a>
    {% endfor %}
  </div>

  <div class="view-all-posts">
    <a href="{% link column.md %}" class="btn btn-outline">すべての記事を見る</a>
  </div>
</div>

