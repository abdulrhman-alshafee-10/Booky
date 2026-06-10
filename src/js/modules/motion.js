/**
 * Booky — GSAP Motion Layer (Phase 6-1)
 *
 * Activates the inert data-reveal / data-counter / data-parallax hooks
 * laid in Phases 1–5. Fully gated behind prefers-reduced-motion.
 *
 * Rules:
 *  - Only transform / opacity animated (zero CLS, no layout shift)
 *  - Additive, never load-bearing: content is fully visible with motion off
 *  - GSAP globals (window.gsap / window.ScrollTrigger) set by plugins.js
 *  - Graceful no-op if globals are absent
 */

import { prefersReducedMotion, onMotionChange } from "./reduced-motion.js";

let initialized = false;

export function initMotion() {
  /* Under reduced-motion: ensure all hooked elements show their final state */
  if (prefersReducedMotion()) {
    showFinalStates();
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    showFinalStates();
    return;
  }

  if (initialized) return;
  initialized = true;

  /* ── Hero entrance ──────────────────────────────────────────── */
  initHeroReveal(gsap);

  /* ── Scroll reveals (data-reveal) ──────────────────────────── */
  initScrollReveals(gsap, ScrollTrigger);

  /* ── Counters (data-counter) ────────────────────────────────── */
  initCounters(gsap, ScrollTrigger);

  /* ── Parallax (data-parallax) ───────────────────────────────── */
  initParallax(gsap, ScrollTrigger);

  /* ── Refresh on webfont swap + resize ──────────────────────── */
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  /* ── Disable if user later enables reduced-motion ───────────── */
  onMotionChange((reduced) => {
    if (reduced) {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
      showFinalStates();
    }
  });
}

/* ── Ensure GSAP-set reveal elements are at their final visible state ── */
function showFinalStates() {
  /* Only clear inline styles GSAP may have set on below-fold elements.
     Above-fold elements were never set to opacity:0 so they're fine. */
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (el.style.opacity === "0") {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.visibility = "visible";
    }
  });
  /* Counters: DOM already contains final number; nothing to do */
}

/* ── Hero entrance ────────────────────────────────────────────── */
function initHeroReveal(gsap) {
  const hero = document.querySelector("[data-hero-animate]");
  if (!hero) return;

  /* Collect sequenced children; fall back to a generic set */
  const targets = hero.querySelectorAll(
    "[data-hero-item], .hero-eyebrow, h1, .hero-copy, .hero-ctas, .hero-media"
  );
  if (!targets.length) return;

  /*
   * Start from opacity ~0.001 (not 0) to avoid penalising LCP.
   * Short duration — the page should feel snappy, not theatrical.
   */
  gsap.fromTo(
    targets,
    { opacity: 0.001, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "power2.out",
      stagger: 0.08,
      clearProps: "will-change",
    }
  );
}

/* ── ScrollTrigger batch reveals ─────────────────────────────── */
function initScrollReveals(gsap, ScrollTrigger) {
  const allElements = document.querySelectorAll("[data-reveal]");
  if (!allElements.length) return;

  /* Only reveal elements that are NOT already in the viewport.
     In-viewport elements (hero content, above-fold) keep their CSS
     animations and are never hidden by GSAP — prevents opacity-0 flicker. */
  const belowFold = [...allElements].filter((el) => {
    const { top } = el.getBoundingClientRect();
    return top > window.innerHeight * 0.9;
  });

  if (!belowFold.length) return;

  /* Set initial state — hidden until scrolled into view */
  gsap.set(belowFold, { opacity: 0, y: 22, willChange: "transform, opacity" });

  ScrollTrigger.batch(belowFold, {
    start: "top 88%",
    once: true,
    onEnter(batch) {
      const sorted = [...batch].sort((a, b) => {
        return (parseFloat(a.dataset.revealDelay) || 0) -
               (parseFloat(b.dataset.revealDelay) || 0);
      });

      sorted.forEach((el, i) => {
        const delay = parseFloat(el.dataset.revealDelay) || i * 0.06;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay,
          ease: "power2.out",
          clearProps: "will-change,opacity,transform",
          onComplete() {
            el.style.willChange = "";
          },
        });
      });
    },
  });
}

/* ── Number counters ──────────────────────────────────────────── */
function initCounters(gsap, ScrollTrigger) {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  counters.forEach((el) => {
    const target = parseFloat(el.dataset.counter) || 0;
    const isFloat = el.dataset.counter.includes(".");
    const proxy = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter() {
        gsap.to(proxy, {
          val: target,
          duration: 1.8,
          ease: "power1.out",
          onUpdate() {
            el.textContent = isFloat
              ? proxy.val.toFixed(1)
              : Math.round(proxy.val).toLocaleString();
          },
          onComplete() {
            el.textContent = isFloat
              ? target.toFixed(1)
              : target.toLocaleString();
          },
        });
      },
    });
  });
}

/* ── Parallax decorative layers ───────────────────────────────── */
function initParallax(gsap, ScrollTrigger) {
  const layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  /* Disable on small screens — perf + reduced visual benefit */
  if (window.innerWidth < 768) return;

  layers.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    const distance = 60 * speed;

    gsap.to(el, {
      yPercent: distance,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") || el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  });
}
