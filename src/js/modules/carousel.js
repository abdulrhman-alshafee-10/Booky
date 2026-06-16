/* carousel.js — Swiper init via [data-swiper] (plan §12, §13).
 * Presets: "hero" (fade slider) · "rail" (drag product rail).
 * No-ops when Swiper or markup is absent. Reduced-motion disables
 * autoplay and crossfade speed so nothing moves on its own. */
import { qsa, qs, prefersReducedMotion } from "../utils/dom.js";

/* Each preset is a function so we can read live state (reduced motion)
 * and scope navigation/pagination elements to the carousel root. */
const PRESETS = {
  hero(root, reduced) {
    return {
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: reduced ? 0 : 800,
      loop: true,
      autoHeight: false,
      autoplay: reduced ? false : { delay: 6000, disableOnInteraction: false },
      pagination: pag(root),
      navigation: nav(root),
    };
  },
  rail(root) {
    return {
      slidesPerView: 1.15,
      spaceBetween: 16,
      grabCursor: true,
      watchOverflow: true,
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 24 },
      },
      pagination: pag(root),
      navigation: nav(root),
    };
  },
  // One slide at a time (large testimonial / best-seller card). Crossfade —
  // slides melt in place rather than sliding, so backgrounds never bleed.
  solo(root, reduced) {
    return {
      effect: "fade",
      fadeEffect: { crossFade: true },
      slidesPerView: 1,
      speed: reduced ? 0 : 650,
      loop: !reduced,
      autoplay: reduced ? false : { delay: 5500, disableOnInteraction: false },
      pagination: pag(root),
      navigation: nav(root),
    };
  },
  // Peeking feature cards (kids hero) — fewer, larger slides + dots
  cards(root, reduced) {
    return {
      slidesPerView: 1.15,
      spaceBetween: 16,
      grabCursor: true,
      watchOverflow: true,
      loop: !reduced,
      autoplay: reduced ? false : { delay: 5000, disableOnInteraction: false },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 18 },
        1024: { slidesPerView: 1.7, spaceBetween: 20 },
      },
      pagination: pag(root),
      navigation: nav(root),
    };
  },
};

/* Pagination/nav live as siblings of .swiper inside the .booky-swiper
 * wrapper, so look them up there (falling back to the swiper root). */
const scope = (root) => root.closest(".booky-swiper") || root;

/* Resolve pagination element scoped to this carousel, if present. */
function pag(root) {
  const el = qs(".swiper-pagination", scope(root));
  return el ? { el, clickable: true } : false;
}

/* Resolve custom nav buttons scoped to this carousel, if both present. */
function nav(root) {
  const wrap = scope(root);
  const prevEl = qs("[data-swiper-prev]", wrap);
  const nextEl = qs("[data-swiper-next]", wrap);
  return prevEl && nextEl ? { prevEl, nextEl } : false;
}

export function initCarousels() {
  if (!window.Swiper) return;
  const reduced = prefersReducedMotion();

  qsa("[data-swiper]").forEach((root) => {
    const preset = PRESETS[root.dataset.swiper];
    if (!preset) return;

    const options = {
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
      },
      keyboard: { enabled: true, onlyInViewport: true },
      ...preset(root, reduced),
    };

    // eslint-disable-next-line no-new
    new window.Swiper(root, options);
  });
}
