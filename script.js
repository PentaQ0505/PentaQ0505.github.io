/* script.js — ThenAndNow landing
 * Motion-driven hero entrance + IntersectionObserver scroll reveals
 * + interactive wipe slider + demo button state toggle
 * Hallmark discipline: respect prefers-reduced-motion, 8-state interactive components
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────
   * 1. SCROLL REVEAL · IntersectionObserver
   * ───────────────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────────────
   * 2. HERO ENTRANCE · staggered load animation
   * ───────────────────────────────────────────────── */
  function initHeroEntrance() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.hero [data-reveal]').forEach((el) => {
        el.classList.add('is-in');
      });
      return;
    }

    const heroEls = document.querySelectorAll('.hero [data-reveal]');
    heroEls.forEach((el) => {
      // run immediately on next frame
      requestAnimationFrame(() => {
        setTimeout(() => el.classList.add('is-in'), 80);
      });
    });
  }

  /* ─────────────────────────────────────────────────
   * 3. WIPE SLIDER · pointer-driven before/after
   * ───────────────────────────────────────────────── */
  function initWipe() {
    const wipe = document.getElementById('wipe');
    if (!wipe) return;

    let pos = 50;            // % from left
    let dragging = false;
    let pointerId = null;

    function setPos(p) {
      pos = Math.max(0, Math.min(100, p));
      wipe.style.setProperty('--wipe-x', `${pos}%`);
    }

    function onPointerDown(e) {
      dragging = true;
      pointerId = e.pointerId;
      wipe.setPointerCapture(pointerId);
      updateFromEvent(e);
    }
    function onPointerMove(e) {
      if (!dragging) return;
      updateFromEvent(e);
    }
    function onPointerUp(e) {
      dragging = false;
      if (pointerId !== null) {
        try { wipe.releasePointerCapture(pointerId); } catch (_) {}
        pointerId = null;
      }
    }
    function updateFromEvent(e) {
      const rect = wipe.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setPos((x / rect.width) * 100);
    }

    function onKeydown(e) {
      if (e.key === 'ArrowLeft') { setPos(pos - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(pos + 5); e.preventDefault(); }
    }

    wipe.addEventListener('pointerdown', onPointerDown);
    wipe.addEventListener('pointermove', onPointerMove);
    wipe.addEventListener('pointerup', onPointerUp);
    wipe.addEventListener('pointercancel', onPointerUp);
    wipe.addEventListener('keydown', onKeydown);
    wipe.tabIndex = 0;

    setPos(50);
  }

  /* ─────────────────────────────────────────────────
   * 4. DEMO BUTTON · Motion-powered state toggle
   * ───────────────────────────────────────────────── */
  function initDemoButton() {
    const btn = document.getElementById('demoBtn');
    if (!btn) return;

    const labelEl = btn.querySelector('span');
    const originalLabel = labelEl ? labelEl.textContent : 'Auto-align';

    btn.addEventListener('click', () => {
      const isRealign = btn.classList.toggle('is-realign');
      if (labelEl) labelEl.textContent = isRealign ? 'Re-align' : originalLabel;

      // micro-bounce on click — Apple HIG §13 multimodal
      if (!prefersReducedMotion && window.Motion) {
        const { animate } = window.Motion;
        animate(btn, { scale: [0.94, 1] }, { duration: 0.22, easing: [0.22, 1, 0.36, 1] });
      }

      // animate the wipe position to give visual feedback
      const wipe = document.getElementById('wipe');
      if (wipe && !prefersReducedMotion && window.Motion) {
        const { animate } = window.Motion;
        animate(
          (t) => {
            const eased = 1 - Math.pow(1 - t, 3);
            const fromX = parseFloat(wipe.style.getPropertyValue('--wipe-x') || '50');
            const targetX = isRealign ? 65 : 50;
            const x = fromX + (targetX - fromX) * eased;
            wipe.style.setProperty('--wipe-x', `${x}%`);
          },
          { duration: 0.7 }
        );
      }
    });
  }

  /* ─────────────────────────────────────────────────
   * 5. NAV SHADOW · add on scroll for material feel
   * ───────────────────────────────────────────────── */
  function initNavElevation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 8) {
        nav.style.boxShadow = '0 1px 0 oklch(91% 0.025 80 / 0.6)';
      } else {
        nav.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────────────
   * 6. SMOOTH SCROLL · for in-page anchor links
   * ───────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────
   * BOOT
   * ───────────────────────────────────────────────── */
  function boot() {
    initScrollReveal();
    initHeroEntrance();
    initWipe();
    initDemoButton();
    initNavElevation();
    initSmoothScroll();

    // Debug / screenshot mode: ?reveal=all forces all data-reveal visible
    const params = new URLSearchParams(window.location.search);
    if (params.get('reveal') === 'all') {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-in');
      });
    }
    // Debug: ?scroll=N scrolls to N px synchronously (for screenshot sections)
    if (params.get('scroll')) {
      const y = parseInt(params.get('scroll'), 10);
      // Apply synchronously before paint
      document.documentElement.scrollTop = y;
      document.body.scrollTop = y;
      requestAnimationFrame(() => {
        document.documentElement.scrollTop = y;
        document.body.scrollTop = y;
        window.scrollTo(0, y);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();