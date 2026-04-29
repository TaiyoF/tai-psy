(function () {
  function throttle(fn, wait) {
    let isThrottled = false;
    return function throttled(...args) {
      if (isThrottled) return;
      fn.apply(this, args);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, wait);
    };
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.classList.toggle('active');
    });
  }

  function initObfuscatedMail() {
    document.querySelectorAll('.obf-mail').forEach((el) => {
      const user = el.getAttribute('data-u');
      const domain = el.getAttribute('data-d');
      if (!user || !domain) return;

      const address = `${user}@${domain}`;
      const revealBtn = el.querySelector('.mail-reveal');
      const copyBtn = el.querySelector('.mail-copy');
      const preview = el.querySelector('.mail-preview');

      if (revealBtn && preview) {
        revealBtn.addEventListener('click', () => {
          preview.textContent = address;
        });
      }

      if (!copyBtn) return;

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(address);
          copyBtn.textContent = 'Copied';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 1500);
        } catch (_err) {
          const link = document.createElement('a');
          link.href = `mailto:${address}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      });
    });
  }

  function initCodeSnippets() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((code) => {
      const pre = code.closest('pre');
      if (!pre || pre.parentElement?.classList.contains('code-snippet')) return;

      const className = code.className || '';
      if (!/language-/.test(className)) {
        code.classList.add('language-r');
        pre.classList.add('language-r');
      } else {
        const langMatch = className.match(/language-([\w-]+)/);
        if (langMatch) pre.classList.add(`language-${langMatch[1]}`);
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'code-snippet';

      const header = document.createElement('div');
      header.className = 'snippet-header';

      const title = document.createElement('div');
      title.className = 'snippet-title';
      const lang = (pre.className.match(/language-([\w-]+)/) || [, 'code'])[1];
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
        const original = copyBtn.innerHTML;
        try {
          await navigator.clipboard.writeText(code.textContent || '');
          copyBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
        } catch (_err) {
          copyBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
        }

        setTimeout(() => {
          copyBtn.innerHTML = original;
        }, 1200);
      });
    });

    if (window.Prism) {
      window.Prism.highlightAll();
    }

    document
      .querySelectorAll('img:not([loading])')
      .forEach((img) => img.setAttribute('loading', 'lazy'));
  }

  function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', function onAnchorClick(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initInteractiveCards() {
    const cards = document.querySelectorAll('.card, .post-card, .category-card, .article-card');

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });

      card.addEventListener('click', (e) => {
        if (
          e.target.tagName === 'A' ||
          e.target.tagName === 'BUTTON' ||
          e.target.closest('a') ||
          e.target.closest('button')
        ) {
          return;
        }

        const firstLink = card.querySelector('a');
        if (firstLink) firstLink.click();
      });
    });
  }

  function initSmartHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollTop = 0;
    const onScroll = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isGoingDown = scrollTop > lastScrollTop;

      if (scrollTop < 20) {
        header.style.transform = 'translateY(0)';
      } else if (isGoingDown && scrollTop > 120) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
    }, 80);

    window.addEventListener('scroll', onScroll);
  }

  function relocateBreadcrumb() {
    const breadcrumb = document.querySelector('nav.breadcrumb');
    const pageHeader = document.querySelector('.page-header');
    if (!breadcrumb || !pageHeader || !pageHeader.parentNode) return;

    pageHeader.insertAdjacentElement('afterend', breadcrumb);
  }

  function initBackToTop() {
    const header = document.querySelector('.site-header');
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(button);

    const toggleButton = throttle(() => {
      const shouldShow = window.scrollY > 240;
      button.style.display = shouldShow ? 'flex' : 'none';
      button.style.opacity = shouldShow ? '1' : '0';
    }, 100);

    toggleButton();
    window.addEventListener('scroll', toggleButton);

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (header) header.style.transform = 'translateY(0)';
    });
  }

  function initCvTextExport() {
    const exportBtn = document.getElementById('download-cv-text');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
      try {
        const sections = document.querySelectorAll('.cv-card');
        const lines = [];

        sections.forEach((section) => {
          const title = section.querySelector('h2')?.textContent?.trim();
          const items = section.querySelectorAll('ol.cv-ol li');
          if (!items.length) return;

          if (title) lines.push(`## ${title}`);

          items.forEach((item, index) => {
            const text = (item.innerText || item.textContent || '')
              .replace(/\s+/g, ' ')
              .trim();
            if (text) lines.push(`${index + 1}. ${text}`);
          });

          lines.push('');
        });

        const content = lines.join('\n').trim() || 'No achievements available.';
        const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');

        const link = document.createElement('a');
        link.href = url;
        link.download = `achievements_${y}${m}${d}.txt`;

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          URL.revokeObjectURL(url);
          link.remove();
        }, 0);
      } catch (err) {
        console.error('Failed to export achievements:', err);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    try { initMobileMenu(); } catch (_e) {}
    try { initObfuscatedMail(); } catch (_e) {}
    try { initCodeSnippets(); } catch (_e) {}
    try { initSmoothAnchorScroll(); } catch (_e) {}
    try { initInteractiveCards(); } catch (_e) {}
    try { initSmartHeader(); } catch (_e) {}
    try { relocateBreadcrumb(); } catch (_e) {}
    try { initBackToTop(); } catch (_e) {}
    try { initCvTextExport(); } catch (_e) {}
  });
})();
