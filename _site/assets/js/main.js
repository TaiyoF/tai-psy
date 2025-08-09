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
    
    // スムーススクロール
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
    const cards = document.querySelectorAll('.card, .post-card, .category-card, .article-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // カード全体をクリック可能にする
        card.addEventListener('click', function(e) {
            // リンクやボタンがクリックされた場合は処理しない
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            // カード内の最初のリンクを見つけてクリック
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
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 下にスクロール
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上にスクロール
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));

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
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
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

document.head.appendChild(mobileStyle);
