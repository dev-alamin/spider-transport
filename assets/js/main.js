/**
 * SPIDER Transport — main.js
 *
 * Stack:
 *  - GSAP + ScrollTrigger  (animations)
 *  - Vanilla JS             (interactions)
 *
 * Note: jQuery is intentionally omitted.
 * When this scaffold converts to a WP Block Theme, interactive
 * behaviors will migrate to the @wordpress/interactivity API
 * (store(), getContext(), data-wp-* directives).
 *
 * Keep this file modular — one function per concern.
 */

/* ============================================================
   GSAP PLUGIN REGISTRATION
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   UTILITY
   ============================================================ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   NAV — scroll state + mobile toggle
   ============================================================ */
function initNav() {
  const nav    = qs('.nav');
  const toggle = qs('.nav__toggle');
  if (!nav) return;

  // Scrolled state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close on nav link click (mobile)
  qsa('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav__link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });
}

/* ============================================================
   SCROLL ANIMATIONS
   Picks up all [data-animate] elements automatically.
   ============================================================ */
function initScrollAnimations() {
  const elements = qsa('[data-animate]');
  if (!elements.length) return;

  elements.forEach(el => {
    const type  = el.dataset.animate || 'up';  // up | fade | left | right | scale
    const delay = parseFloat(el.dataset.delay  || 0);
    const dur   = parseFloat(el.dataset.dur    || 0.7);

    const fromVars = { opacity: 0, duration: dur, delay, ease: 'power3.out' };

    if (type === 'up')    { fromVars.y = 28; }
    if (type === 'fade')  { /* opacity only */ }
    if (type === 'left')  { fromVars.x = -36; }
    if (type === 'right') { fromVars.x = 36; }
    if (type === 'scale') { fromVars.scale = 0.92; }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => gsap.to(el, { ...fromVars, opacity: 1, y: 0, x: 0, scale: 1 }),
      once: true,
    });
  });
}

/* ============================================================
   STAGGER GROUPS
   Add data-stagger to a parent; children animate in sequence.
   ============================================================ */
function initStaggerGroups() {
  qsa('[data-stagger]').forEach(parent => {
    const children = qsa('[data-stagger-item]', parent);
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: parent,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
        });
      },
      once: true,
    });
  });
}

/* ============================================================
   COUNTER ANIMATION
   <span data-counter="12">0</span>%
   ============================================================ */
function initCounters() {
  qsa('[data-counter]').forEach(el => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          },
        });
      },
      once: true,
    });
  });
}

/* ============================================================
   TABS  (Bruksområder section)
   data-tabs / data-tab-btn / data-tab-panel
   ============================================================ */
function initTabs() {
  qsa('[data-tabs]').forEach(wrapper => {
    const btns   = qsa('[data-tab-btn]',   wrapper);
    const panels = qsa('[data-tab-panel]', wrapper);

    function activate(index) {
      btns.forEach((b, i) => {
        b.classList.toggle('active', i === index);
        b.setAttribute('aria-selected', i === index);
      });
      panels.forEach((p, i) => {
        const isActive = i === index;
        gsap.to(p, { opacity: isActive ? 1 : 0, y: isActive ? 0 : 12, duration: 0.3, ease: 'power2.out' });
        p.style.pointerEvents = isActive ? '' : 'none';
      });
    }

    // Init
    gsap.set(panels, { opacity: 0, y: 12, position: 'absolute', top: 0, left: 0, width: '100%' });
    activate(0);

    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => activate(i));
    });
  });
}

/* ============================================================
   SLIDER / CAROUSEL  (arrow navigation)
   data-slider / data-slide / data-prev / data-next
   ============================================================ */
function initSliders() {
  qsa('[data-slider]').forEach(slider => {
    const slides   = qsa('[data-slide]', slider);
    const prevBtn  = qs('[data-prev]', slider);
    const nextBtn  = qs('[data-next]', slider);
    if (!slides.length) return;

    let current = 0;

    function go(index) {
      slides[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
    }

    go(0);
    prevBtn?.addEventListener('click', () => go(current - 1));
    nextBtn?.addEventListener('click', () => go(current + 1));
  });
}

/* ============================================================
   HERO ENTRANCE (runs immediately, no scroll trigger)
   ============================================================ */
function initHeroEntrance() {
  const hero = qs('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__label',    { opacity: 0, y: 16, duration: 0.6 })
    .from('.hero__headline', { opacity: 0, y: 24, duration: 0.7 }, '-=0.3')
    .from('.hero__body',     { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
    .from('.hero__actions',  { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
    .from('.hero__stats',    { opacity: 0, y: 12, duration: 0.5, stagger: 0.1 }, '-=0.3')
    .from('.hero__visual',   { opacity: 0, x: 40, duration: 0.9 }, '-=0.8');
}

/* ============================================================
   INIT — run all modules on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroEntrance();
  initScrollAnimations();
  initStaggerGroups();
  initCounters();
  initTabs();
  initSliders();
});

/* ============================================================
   WP INTERACTIVITY API — MIGRATION NOTES
   ============================================================
   When converting to a Block Theme, replace the above with:

   import { store, getContext } from '@wordpress/interactivity';

   store('spider/nav', {
     state: { isOpen: false, isScrolled: false },
     actions: {
       toggleMenu() { getContext().isOpen = !getContext().isOpen; },
     },
     callbacks: {
       onScroll() { ... },
     },
   });

   Then in block.json add: "interactivity": true
   And use data-wp-interactive, data-wp-on, data-wp-class etc.
   ============================================================ */
