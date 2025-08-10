---
layout: defalt
title: "業績"
permalink: /about-cv/
show_papers: false
---

<div class="page-header">
    <h1>業績</h1>
    <p class="page-subtitle">Works</p>
</div>

<div class="cv-content">
    {% if page.show_papers %}
    <div class="cv-section">
        <div class="cv-card">
            <h2>査読付き論文</h2>
            <ol class="cv-ol">
                <!-- 例: 藤田 太陽・三浦 麻子. 論文タイトル. 掲載誌名, 巻(号), 頁, 20XX. <span class="cv-flag peer">査読あり</span> -->
            </ol>
        </div>
    </div>
    <div class="cv-section">
        <div class="cv-card">
            <h2>査読なし論文・報告書</h2>
            <ol class="cv-ol">
                <!-- 例: 藤田 太陽. 報告書タイトル. 機関名, 20XX. <span class="cv-flag nopeer">査読なし</span> -->
            </ol>
        </div>
    </div>
    {% endif %}
    <div class="cv-section">
        <div class="cv-card">
            <h2>学会発表</h2>
            <ol class="cv-ol">
                <li>藤田 太陽・三浦 麻子　自由意志信念が援助行動に及ぼす影響―日本・イギリス・アメリカの比較研究―　日本社会心理学会第66回大会　2025年9月（ポスター）</li>
            </ol>
        </div>
    </div>
    <div class="cv-section">
        <div class="cv-card">
            <h2>MISC</h2>
            <ol class="cv-ol">
                <li>藤田 太陽　確率分布と統計モデル　発達認知科学若手分科会，第1回統計勉強会　2025年7月</li>
            </ol>
        </div>
    </div>
    <div style="text-align:right; margin-bottom: 16px;">
        <button id="download-cv-text" class="btn btn-outline">テキストファイルでダウンロード</button>
    </div>
</div>
