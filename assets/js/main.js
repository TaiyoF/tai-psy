// ===== メインJavaScriptファイル =====

document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの制御
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    
    if (mobileMenuToggle && siteNav) {
        mobileMenuToggle.addEventListener('click', function() {
            siteNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // メールアドレスの難読化を復元 + 表示/コピー
    try {
        document.querySelectorAll('.obf-mail').forEach(function(el){
            const user = el.getAttribute('data-u');
            const domain = el.getAttribute('data-d');
            if (!user || !domain) return;
            const addr = user + '@' + domain;

            const revealBtn = el.querySelector('.mail-reveal');
            const copyBtn = el.querySelector('.mail-copy');
            const preview = el.querySelector('.mail-preview');

            if (revealBtn && preview) {
                revealBtn.addEventListener('click', function(){
                    preview.textContent = addr;
                });
            }

            if (copyBtn) {
                copyBtn.addEventListener('click', async function(){
                    try {
                        await navigator.clipboard.writeText(addr);
                        copyBtn.textContent = 'コピーしました';
                        setTimeout(() => (copyBtn.textContent = 'コピー'), 1500);
                    } catch (e) {
                        // クリップボードが使えない場合は mailto を開く
                        const a = document.createElement('a');
                        a.href = 'mailto:' + addr;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                });
            }
        });
    } catch (e) { /* no-op */ }

    // コードブロック: 言語検出 + カスタムヘッダー + コピー
    try {
        document.querySelectorAll('pre code').forEach(function(code){
            const pre = code.closest('pre');
            if (!pre) return;
            const cls = code.className || '';
            // ```lang 指定がない場合はRをデフォルトに
            if (!/language-/.test(cls)) {
                code.classList.add('language-r');
                pre.classList.add('language-r');
            } else {
                // pre側にも同じlanguage-xxxを反映
                const langMatch = cls.match(/language-([\w-]+)/);
                if (langMatch) pre.classList.add('language-' + langMatch[1]);
            }
            // ラッパー（.code-snippet）を付けてヘッダー＆コピー
            if (!pre.parentElement.classList.contains('code-snippet')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'code-snippet';
                const header = document.createElement('div');
                header.className = 'snippet-header';
                const title = document.createElement('div');
                title.className = 'snippet-title';
                // 表示する言語名を整える
                const lang = (pre.className.match(/language-([\w-]+)/) || [,'code'])[1];
                title.textContent = lang.toUpperCase();
                const actions = document.createElement('div');
                actions.className = 'snippet-actions';
                const copyBtn = document.createElement('button');
                copyBtn.type = 'button';
                copyBtn.className = 'snippet-btn snippet-copy';
                copyBtn.setAttribute('aria-label', 'Copy code');
                copyBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="4" rx="1"></rect><path d="M9 3H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path></svg>';
                actions.appendChild(copyBtn);
                header.appendChild(title);
                header.appendChild(actions);
                const body = document.createElement('div');
                body.className = 'snippet-body';
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(header);
                wrapper.appendChild(body);
                body.appendChild(pre);
                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(code.textContent);
                        const original = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
                        setTimeout(() => { copyBtn.innerHTML = original; }, 1200);
                    } catch(e) {
                        // 失敗時は×アイコンを一瞬表示
                        const original = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
                        setTimeout(() => { copyBtn.innerHTML = original; }, 1200);
                    }
                });
            }
        });
        if (window.Prism) { window.Prism.highlightAll(); }
        // 画像の遅延読み込み（未指定のimgに付与）
        document.querySelectorAll('img:not([loading])').forEach(img => img.setAttribute('loading', 'lazy'));
    } catch (e) { /* no-op */ }
    
    // スムーススクロール（同一ページ内のみ）
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // カードのホバーエフェクトとクリック機能
    const cards = document.querySelectorAll('.post-card, .category-card, .article-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            const link = this.querySelector('a');
            if (link) {
                link.click();
            }
        });
    });
    
    // ヘッダーのスクロール効果（控えめに）
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const goingDown = scrollTop > lastScrollTop;
        if (scrollTop < 20) {
            header.style.transform = 'translateY(0)';
        } else if (goingDown && scrollTop > 120) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    }, 80));

    // パンくずをページヘッダー直下へ移動（投稿以外）
    try {
        const breadcrumb = document.querySelector('nav.breadcrumb');
        const pageHeader = document.querySelector('.page-header');
        if (breadcrumb && pageHeader && pageHeader.parentNode) {
            pageHeader.insertAdjacentElement('afterend', breadcrumb);
        }
    } catch (e) {
        // no-op
    }

    // Back-to-top button
    try {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
        document.body.appendChild(btn);

        const toggleBtn = () => {
            const show = window.scrollY > 240;
            btn.style.display = show ? 'flex' : 'none';
            btn.style.opacity = show ? '1' : '0';
        };
        toggleBtn();
        window.addEventListener('scroll', throttle(toggleBtn, 100));

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // ヘッダーを確実に表示
            try { if (header) header.style.transform = 'translateY(0)'; } catch(_) {}
        });
    } catch (e) { /* no-op */ }

    // 業績ページ: テキスト出力ボタン
    const downloadCvBtn = document.getElementById('download-cv-text');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function () {
            try {
                const sections = document.querySelectorAll('.cv-card');
                const lines = [];
                sections.forEach(section => {
                    const titleEl = section.querySelector('h2');
                    const items = section.querySelectorAll('ol.cv-ol li');
                    if (items.length > 0) {
                        if (titleEl) {
                            lines.push(`【${titleEl.textContent.trim()}】`);
                        }
                        items.forEach((li, idx) => {
                            const text = (li.innerText || li.textContent || '')
                                .replace(/\s+/g, ' ')
                                .trim();
                            lines.push(`${idx + 1}. ${text}`);
                        });
                        lines.push('');
                    }
                });

                const content = lines.join('\n') || '（業績の項目がありません）';
                const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                a.href = url;
                a.download = `achievements_${y}${m}${d}.txt`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    a.remove();
                }, 0);
            } catch (err) {
                console.error('Failed to export achievements:', err);
            }
        });
    }
});

// ===== ユーティリティ関数 =====

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== 追加のスタイル（CSSで対応できない場合） =====

// モバイルメニューのスタイルを動的に追加
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    .site-nav.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #ffffff;
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-top: 1px solid #e2e8f0;
    }
    
    .site-nav.active .nav-list {
        flex-direction: column;
        gap: 15px;
    }
    
    .site-nav.active .nav-link {
        color: #4a5568;
        padding: 12px 16px;
        border-radius: 6px;
    }
    
    .site-nav.active .nav-link:hover {
        background: #f7fafc;
        color: #2d3748;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .site-header {
        transition: transform 0.2s ease;
    }
`;

document.head.appendChild(mobileMenuStyle);
