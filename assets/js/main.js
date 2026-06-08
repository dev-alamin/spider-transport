// <!-- Tab sliding pill (runs after DOM ready) -->

(function () {
  const bar = document.querySelector('.tab-bar');
  if (!bar) return;
  const buttons = bar.querySelectorAll('.tab-btn');

  // Create the sliding pill
  const pill = document.createElement('div');
  pill.className = 'tab-pill';
  bar.style.position = 'relative'; // ensure relative context
  bar.appendChild(pill);

  function movePill(btn) {
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    pill.style.width = btnRect.width + 'px';
    pill.style.height = btnRect.height + 'px';
    pill.style.transform = `translate(${btnRect.left - barRect.left}px, ${btnRect.top - barRect.top}px)`;
  }

  // Set pill on active tab without animation first
  const active = bar.querySelector('.tab-active');
  if (active) {
    pill.style.transition = 'none';
    requestAnimationFrame(() => {
      movePill(active);
      requestAnimationFrame(() => {
        pill.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)';
      });
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('tab-active'));
      btn.classList.add('tab-active');
      movePill(btn);
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const cur = bar.querySelector('.tab-active');
    if (!cur) return;
    pill.style.transition = 'none';
    movePill(cur);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      pill.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)';
    }));
  });
})();


//   < !-- ═══════════════════════════════════════════
// GSAP — reusable animation system
//   ═══════════════════════════════════════════ -->

  gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Reusable helpers
// ─────────────────────────────────────────────────────────────

/**
 * fadeUp — fade + slide up on scroll. Used for single elements.
 * @param {string|Element} target   CSS selector or DOM element
 * @param {object}         opts     overrides: { y, duration, delay, start }
 */
function fadeUp(target, opts = {}) {
  const { y = 40, duration = 0.75, delay = 0, start = 'top 88%' } = opts;
  gsap.from(target, {
    scrollTrigger: { trigger: target, start },
    opacity: 0, y, duration, delay,
    ease: 'power3.out',
  });
}

/**
 * staggerIn — stagger-fade a group of children on scroll.
 * @param {string} parent     CSS selector for the scroll trigger + from() target
 * @param {string} children   CSS selector for staggered items (relative to document)
 * @param {object} opts       overrides: { y, duration, stagger, start }
 */
function staggerIn(parent, children, opts = {}) {
  const { y = 48, duration = 0.7, stagger = 0.16, start = 'top 82%' } = opts;
  gsap.from(children, {
    scrollTrigger: { trigger: parent, start },
    opacity: 0, y, duration, stagger,
    ease: 'power3.out',
  });
}

/**
 * slideIn — slide in from a side on scroll.
 * @param {string|Element} target
 * @param {object}         opts   overrides: { x, y, duration, start }
 */
function slideIn(target, opts = {}) {
  const { x = 0, y = 0, duration = 0.8, start = 'top 85%' } = opts;
  gsap.from(target, {
    scrollTrigger: { trigger: target, start },
    opacity: 0, x, y, duration,
    ease: 'power3.out',
  });
}

// ─────────────────────────────────────────────────────────────
// 1. Hero — page-load timeline (no ScrollTrigger needed)
// ─────────────────────────────────────────────────────────────
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('#hero-title', { opacity: 0, y: 48, duration: 0.9 })
  .from('#hero-text-block', { opacity: 0, y: 32, duration: 0.7 }, '-=0.55')
  .from('#hero-cta', { opacity: 0, y: 24, duration: 0.6 }, '-=0.5')
  .from('#hero-dashboard > *', { opacity: 0, y: 40, stagger: 0.14, duration: 0.7 }, '-=0.7');

// ─────────────────────────────────────────────────────────────
// 2. Every section heading — reuse fadeUp
// ─────────────────────────────────────────────────────────────
gsap.utils.toArray('.section-heading').forEach(el => fadeUp(el, { y: 36 }));

// ─────────────────────────────────────────────────────────────
// 3. Section 2 — savings cards cascade, left copy slides
// ─────────────────────────────────────────────────────────────
staggerIn('#savings-cards', '.savings-card', { y: 50, stagger: 0.15 });
slideIn('#savings-cards', { x: 30 });

// ─────────────────────────────────────────────────────────────
// 4. Section 3 — result cards
// ─────────────────────────────────────────────────────────────
staggerIn('.result-cards', '.result-card', { y: 56, stagger: 0.18 });

// ─────────────────────────────────────────────────────────────
// 5. Section 4 — process steps
// ─────────────────────────────────────────────────────────────
staggerIn('.process-steps', '.process-step', { y: 40, stagger: 0.2, start: 'top 85%' });

// ─────────────────────────────────────────────────────────────
// 6. Section 5 — tabs copy + map card
// ─────────────────────────────────────────────────────────────
slideIn('.tabs-copy', { x: -30, start: 'top 84%' });
slideIn('.tabs-map', { x: 30, start: 'top 84%' });

// ─────────────────────────────────────────────────────────────
// 7. Section 6 — case cards
// ─────────────────────────────────────────────────────────────
staggerIn('.case-cards', '.case-card', { y: 48, stagger: 0.17 });

// ─────────────────────────────────────────────────────────────
// 8. Footer
// ─────────────────────────────────────────────────────────────
fadeUp('footer', { y: 60, duration: 0.9, start: 'top 95%' });

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  const closeLinks = document.querySelectorAll('.mobile-nav-close, #mobile-menu-drawer a');

  function toggleMenu() {
    const isOpen = !menuDrawer.classList.contains('hidden');
    
    if (isOpen) {
      // Close operations
      menuDrawer.classList.add('hidden');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      document.body.style.overflow = ''; // Release window scroll
    } else {
      // Open operations
      menuDrawer.classList.remove('hidden');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Lock window scroll
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Auto-collapse when clicking anchor routes or inner button links
  closeLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!menuDrawer.classList.contains('hidden')) {
        toggleMenu();
      }
    });
  });
});