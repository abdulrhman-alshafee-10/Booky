/* motion.js — site-wide GSAP motion pass (plan §13). The brand is restraint:
 * slow, soft, never bouncy. Reads window.gsap / window.ScrollTrigger exposed
 * by plugins.js.
 *
 * SAFETY CONTRACT (plan §13):
 *  - Every initial "hidden" state is applied by JS (gsap.set / gsap.from).
 *    With JS disabled OR prefers-reduced-motion ON, nothing is ever hidden —
 *    no FOUC, no stuck content, no LCP penalty.
 *  - Above-the-fold content is never hidden pre-reveal: any reveal target that
 *    sits inside the first viewport at load is left visible and skipped.
 *  - The LCP hero cover image is moved with transform only — never faded — so
 *    its paint time is unaffected.
 *  - Only transform/opacity are animated. No layout properties, ever.
 */
import { qs, qsa, prefersReducedMotion } from "../utils/dom.js";

/* decelerating ease, no overshoot — mirrors --ease-out cubic-bezier(.22,1,.36,1) */
const EASE = "power3.out";

/* an element counts as "above the fold" if its top is within 90% of the
   viewport height at load — those are shown immediately, never hidden. */
const aboveFold = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.9;

/* grid/group containers whose direct children get a soft staggered reveal */
const STAGGER_GROUPS = [
  ".book-grid", ".shop-grid", ".blog-grid", ".cat-strip", ".plan-grid",
  ".value-grid", ".team-grid", ".steps", ".trust-strip", ".age-grid",
  ".archive-grid", ".demos-grid", ".social-grid", ".deal-grid",
  ".bestseller-grid", ".stats-row", ".genre-grid",
].join(", ");

/* single-block reveal targets (plus any explicit [data-reveal] opt-in) */
const BLOCK_REVEAL = [
  "[data-reveal]", ".section-head", ".cta-band", ".quote-feature",
  ".about-split", ".author-bio", ".faq-group",
].join(", ");

export function initMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  /* one global guard: no GSAP, or reduced-motion → leave everything visible. */
  if (!gsap || prefersReducedMotion()) return;

  /* keep progression smooth and deterministic — without this a single janky
     first frame (tab restore, heavy load) can stall a just-started timeline. */
  gsap.ticker.lagSmoothing(0);

  initHero(gsap);

  if (ScrollTrigger) {
    initBlockReveals(gsap, ScrollTrigger);
    initStaggerGroups(gsap, ScrollTrigger);
    initCounters(gsap, ScrollTrigger);
    initParallax(gsap, ScrollTrigger);
    /* re-measure once fonts + images settle so triggers line up exactly */
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
}

/* Hero entrance: overline + title + copy rise with a gentle stagger; the
   floating cover drifts up (transform only — never faded, protects LCP). */
function initHero(gsap) {
  const hero = qs(
    ".hero, .hero-split, .hero-centered, .hero-fan, .hero-portrait, " +
    ".hero-editorial, .hero-panel, .hero-player"
  );
  if (!hero) return;

  /* for Swiper heroes, scope to the active (first) slide so we don't animate
     copy hidden on other slides */
  const scope = qs(".swiper-slide-active", hero) || qs(".swiper-slide", hero) || hero;

  const seen = new Set();
  const bits = qsa(
    ".overline, h1, .display, .hero-text p, .hero-panel-display, " +
    ".hero-panel p, .btn, .btn-primary, .btn-link, .tag-chips, .hero-search",
    scope
  ).filter((el) => (seen.has(el) ? false : seen.add(el)));

  const coverWrap = qs(
    ".hero-cover-wrap, .hero-fan-covers, .hero-editorial-covers, " +
    ".player-card, .author-portrait-lg",
    hero
  );

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  if (bits.length) {
    tl.from(bits, { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08 }, 0);
  }
  if (coverWrap) {
    /* transform only — opacity untouched so the LCP cover paints at once */
    tl.from(coverWrap, { y: 40, duration: 1, ease: EASE }, 0.05);
  }
}

/* Fade-up reveal for standalone content blocks as they enter the viewport. */
function initBlockReveals(gsap, ScrollTrigger) {
  qsa(BLOCK_REVEAL).forEach((el) => {
    if (el.closest(".swiper") || aboveFold(el)) return; // never hide visible/swiper content
    gsap.set(el, { autoAlpha: 0, y: 28 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE }),
    });
  });
}

/* Staggered reveal of the children of grids/rails. */
function initStaggerGroups(gsap, ScrollTrigger) {
  qsa(STAGGER_GROUPS).forEach((group) => {
    if (group.closest(".swiper") || aboveFold(group)) return;
    const items = Array.from(group.children);
    if (!items.length) return;
    gsap.set(items, { autoAlpha: 0, y: 24 });
    ScrollTrigger.create({
      trigger: group,
      start: "top 82%",
      once: true,
      onEnter: () =>
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: EASE,
          stagger: 0.07,
        }),
    });
  });
}

/* Count-up for stat figures (S11) when they scroll into view. */
function initCounters(gsap, ScrollTrigger) {
  qsa(".stat-num[data-count]").forEach((el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.countSuffix || "";
    const render = (n) => {
      el.textContent = Math.round(n).toLocaleString("en-US") + suffix;
    };
    const counter = { v: 0 };
    const run = () =>
      gsap.to(counter, {
        v: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => render(counter.v),
      });

    if (aboveFold(el)) {
      run();
      return;
    }
    render(0); // start from zero only when the animation will actually play
    ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: run });
  });
}

/* Subtle parallax drift (transform only) on corner ornaments + the hero cover.
   Scrub ties motion to scroll position; at rest there is zero offset. */
function initParallax(gsap, ScrollTrigger) {
  qsa(".ornament").forEach((el) => {
    const dir = el.classList.contains("ornament-br") ? 1 : -1;
    gsap.to(el, {
      yPercent: 8 * dir,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") || el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const cover = qs(".hero-cover");
  if (cover) {
    gsap.to(cover, {
      yPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: cover.closest("section") || cover,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}
