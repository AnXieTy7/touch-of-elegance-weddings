// Touch of Elegance — interactive behaviors
(function () {
  'use strict';

  // Light mode only — dark mode removed

  // ===== Sticky header =====
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu =====
  const menuBtn = document.querySelector('.menu-toggle');
  menuBtn?.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('menu-open'))
  );

  // ===== Scroll reveal =====
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '-50px 0px -50px 0px', threshold: 0.05 }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ===== Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox?.querySelector('img');
  const lbClose = lightbox?.querySelector('.lightbox-close');
  const lbPrev = lightbox?.querySelector('.lightbox-prev');
  const lbNext = lightbox?.querySelector('.lightbox-next');

  let lbItems = [];
  let lbIndex = 0;

  function collectLbItems(scope) {
    return Array.from(scope.querySelectorAll('[data-lightbox]')).map(el => {
      const img = el.querySelector('img');
      return { src: el.dataset.lightbox || img?.src, alt: img?.alt || '' };
    });
  }

  function openLb(items, index) {
    if (!lightbox) return;
    lbItems = items;
    lbIndex = index;
    lbImg.src = lbItems[lbIndex].src;
    lbImg.alt = lbItems[lbIndex].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showLb(delta) {
    lbIndex = (lbIndex + delta + lbItems.length) % lbItems.length;
    lbImg.src = lbItems[lbIndex].src;
    lbImg.alt = lbItems[lbIndex].alt;
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      e.preventDefault();
      const scope = trigger.closest('[data-lightbox-scope]') || document;
      const items = collectLbItems(scope);
      const idx = items.findIndex(i => i.src === (trigger.dataset.lightbox || trigger.querySelector('img')?.src));
      openLb(items, Math.max(0, idx));
    }
  });
  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', () => showLb(-1));
  lbNext?.addEventListener('click', () => showLb(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(-1);
    if (e.key === 'ArrowRight') showLb(1);
  });

  // ===== Gallery filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      document.querySelectorAll('.masonry-item').forEach(item => {
        const cats = (item.dataset.cat || '').split(',');
        item.style.display = (cat === 'all' || cats.includes(cat)) ? '' : 'none';
      });
    });
  });

  // ===== Year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Form (demo handler) =====
  document.querySelectorAll('form.inquiry-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center;padding:3rem 1rem;">
            <div style="font-family:var(--font-italic);font-style:italic;color:var(--color-mauve);font-size:2.25rem;margin-bottom:1rem;">Thank you</div>
            <h3 style="font-family:var(--font-display);font-size:1.75rem;font-weight:400;margin-bottom:1rem;">Your inquiry has been received</h3>
            <p style="color:var(--color-text-muted);max-width:42ch;margin:0 auto;">Sheren will personally reach out within 24 hours to begin designing your unforgettable day.</p>
          </div>
        `;
      }, 900);
    });
  });
})();
