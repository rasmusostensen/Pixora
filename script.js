/* Pixora — shared JS */

(function () {
  'use strict';

  /* ── Hamburger menu ──────────────────────────────────────── */
  const ham = document.getElementById('ham');
  const navLinks = document.getElementById('nav-links');

  if (ham && navLinks) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('active');
      navLinks.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('active');
        navLinks.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Active nav link ─────────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace('./', '');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Nav dark/light based on hero scroll position ────────── */
  const mainNav  = document.getElementById('main-nav');
  const heroSection = document.getElementById('hero');

  if (mainNav && heroSection) {
    const updateNav = () => {
      const threshold = heroSection.offsetHeight - 80;
      if (window.scrollY < threshold) {
        mainNav.classList.add('nav-dark');
      } else {
        mainNav.classList.remove('nav-dark');
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
  }

  /* ── Hero cursor spotlight ───────────────────────────────── */
  const heroEl      = document.getElementById('hero');
  const spotlightEl = document.getElementById('heroSpotlight');

  if (heroEl && spotlightEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightEl.style.background =
        `radial-gradient(700px circle at ${x}px ${y}px, rgba(0,0,0,.04) 0%, transparent 65%)`;
    });
    heroEl.addEventListener('mouseleave', () => {
      spotlightEl.style.background = 'none';
    });
  }

  /* ── FAQ accordion ───────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Scroll-reveal (general .reveal elements) ────────────── */
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity  = '1';
          e.target.style.transform = 'translateY(0)';
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity .6s ease ${i % 3 * 0.1}s, transform .6s ease ${i % 3 * 0.1}s`;
      revealObs.observe(el);
    });

    /* ── Stat items staggered reveal ──────────────────────── */
    const statObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.reveal-stat').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      statObs.observe(el);
    });
  }

  /* ── Smooth anchor scroll for #links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Spline card → open Pixorbot chat on click ───────────── */
  /* .spline-click-capture has pointer-events:none so clicks fall through
     the overlay → spline-viewer → bubble up to .spline-card here.        */
  const splineCard = document.querySelector('.spline-card');
  if (splineCard) {
    splineCard.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent the chat.js "click outside → close" handler
      /* Use the direct open function exposed by chat.js — avoids synthetic
         click events and event-bubbling race conditions.                    */
      if (typeof window.pxOpen === 'function') {
        window.pxOpen();
      } else {
        const toggle = document.getElementById('px-toggle');
        if (toggle) toggle.click();
      }
    });
  }

  /* ── BackgroundPaths: animated flowing lines in hero ─────── */
  /* Disabled temporarily for debugging
  (function () {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const NS = 'http://www.w3.org/2000/svg';

    // Inject one CSS keyframe used by all paths
    const kf = document.createElement('style');
    kf.textContent = `
      @keyframes pxPathFlow {
        from { stroke-dashoffset: 0.3; }
        to   { stroke-dashoffset: -0.7; }
      }
    `;
    document.head.appendChild(kf);

    function buildSVG(position) {
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 696 316');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

      for (let i = 0; i < 36; i++) {
        const px = 380 - i * 5 * position;
        const d  =
          `M-${px} -${189 + i * 6}` +
          `C-${px} -${189 + i * 6}` +
          ` -${312 - i * 5 * position} ${216 - i * 6}` +
          `  ${152 - i * 5 * position} ${343 - i * 6}` +
          `C ${616 - i * 5 * position} ${470 - i * 6}` +
          `  ${684 - i * 5 * position} ${875 - i * 6}` +
          `  ${684 - i * 5 * position} ${875 - i * 6}`;

        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', '#111111');
        path.setAttribute('stroke-width', String(0.5 + i * 0.035));
        // pathLength="1" normalises the path so dash values are 0–1
        path.setAttribute('pathLength', '1');
        path.style.strokeOpacity = String(0.015 + i * 0.009);
        path.style.strokeDasharray = '0.3 0.7'; // 30% visible dash
        // Stagger each path: longer & offset differently
        const dur = (20 + i * 0.55).toFixed(1);
        const del = (-(i * 0.75)).toFixed(1);
        path.style.animation = `pxPathFlow ${dur}s linear ${del}s infinite`;
        svg.appendChild(path);
      }
      return svg;
    }

    const wrap = document.createElement('div');
    wrap.style.cssText = [
      'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;',
      // Fade paths out on the left so they never cover the hero text
      'mask-image:linear-gradient(to right,transparent 0%,transparent 28%,rgba(0,0,0,.45) 48%,black 68%);',
      '-webkit-mask-image:linear-gradient(to right,transparent 0%,transparent 28%,rgba(0,0,0,.45) 48%,black 68%);'
    ].join('');
    wrap.appendChild(buildSVG(1));
    wrap.appendChild(buildSVG(-1));
    hero.insertBefore(wrap, hero.firstChild);
  })();
  // end BackgroundPaths

  /* ── Spline: forward global cursor to robot ──────────────── */
  /* Without pointer-events:none on spline-viewer, native events reach the
     canvas when the cursor is inside the card. This code handles the
     outside-card case so the robot keeps tracking anywhere on the page.  */
  (function () {
    const viewer = document.querySelector('spline-viewer');
    if (!viewer) return;

    let canvas = null;

    function getCanvas() {
      if (canvas) return canvas;
      const shadow = viewer.shadowRoot;
      if (!shadow) return null;
      canvas = shadow.querySelector('canvas');
      return canvas;
    }

    function forwardMove(e) {
      const c = getCanvas();
      if (!c) return;

      /* Skip forwarding when cursor is already inside the card —
         spline-viewer receives native events there directly.        */
      const rect = viewer.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (inside) return;

      const opts = {
        clientX:   e.clientX,
        clientY:   e.clientY,
        screenX:   e.screenX,
        screenY:   e.screenY,
        movementX: e.movementX || 0,
        movementY: e.movementY || 0,
        bubbles:    true,
        cancelable: true,
        view:       window
      };
      try { c.dispatchEvent(new PointerEvent('pointermove', opts)); } catch (_) {}
      try { c.dispatchEvent(new MouseEvent('mousemove',    opts)); } catch (_) {}
    }

    let active = false;

    function init() {
      if (active || !getCanvas()) return;
      active = true;
      document.addEventListener('mousemove', forwardMove, { passive: true });
    }

    /* Try on Spline load event */
    viewer.addEventListener('load', () => setTimeout(init, 300));

    /* Fallback poll until canvas appears (up to 12 s) */
    const poll = setInterval(() => {
      if (getCanvas()) { init(); clearInterval(poll); }
    }, 500);
    setTimeout(() => clearInterval(poll), 12000);
  })();

})();
