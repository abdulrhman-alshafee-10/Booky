/**
 * Swiper carousel initialiser.
 * Reads [data-swiper="id"] containers and inits per-type config.
 * Degrades gracefully if Swiper is unavailable (scroll-flex fallback).
 * Respects reduced motion (no autoplay).
 */

import { prefersReducedMotion } from "./reduced-motion.js";

const CONFIGS = {
  /* ── Product carousels ────────────────────────────────── */
  new: {
    slidesPerView: 1.3,
    spaceBetween: 16,
    breakpoints: {
      480: { slidesPerView: 2.2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1280: { slidesPerView: 5 },
    },
  },

  bestsellers: {
    slidesPerView: 1.3,
    spaceBetween: 16,
    breakpoints: {
      480: { slidesPerView: 2.2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1280: { slidesPerView: 5 },
    },
  },

  reviews: {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  },

  /* ── Trending tabs carousels (one per tab panel) ──────── */
  trending: {
    slidesPerView: 1.3,
    spaceBetween: 16,
    breakpoints: {
      480: { slidesPerView: 2.2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
  },

  /* ── Instagram / gallery strip ────────────────────────── */
  instagram: {
    slidesPerView: 2.2,
    spaceBetween: 12,
    breakpoints: {
      480: { slidesPerView: 3.2 },
      768: { slidesPerView: 4.5 },
      1024: { slidesPerView: 6 },
    },
  },

  /* ── Hero full-bleed slider ───────────────────────────── */
  hero: {
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "fade",
    loop: true,
    grabCursor: false,
  },
};

export function initCarousels() {
  const Swiper = window.Swiper;
  const Modules = window.SwiperModules;

  document.querySelectorAll("[data-swiper]").forEach((container) => {
    const id = container.dataset.swiper;
    const base = CONFIGS[id] || { slidesPerView: 1.3, spaceBetween: 16 };

    /* Graceful degradation — scrollable flex when Swiper is absent */
    if (!Swiper || !Modules) {
      const wrap = container.querySelector(".swiper-wrapper");
      if (wrap) {
        wrap.style.display = "flex";
        wrap.style.overflowX = "auto";
        wrap.style.gap = "1rem";
        wrap.style.scrollSnapType = "x mandatory";
      }
      return;
    }

    const modules = [Modules.A11y, Modules.Keyboard];
    const opts = {
      ...base,
      modules,
      a11y: { enabled: true },
      keyboard: { enabled: true },
      dir: document.documentElement.dir === "rtl" ? "rtl" : "ltr",
    };

    /* Enable grab cursor except for hero (full-slide, no drag feel needed) */
    if (id !== "hero") opts.grabCursor = true;

    /* Fade effect for hero */
    if (base.effect === "fade" && Modules.EffectFade) {
      modules.push(Modules.EffectFade);
      opts.effect = "fade";
      opts.fadeEffect = { crossFade: true };
    }

    /* Pagination */
    const pagEl = document.querySelector(`[data-swiper-pagination="${id}"]`);
    if (pagEl) {
      modules.push(Modules.Pagination);
      opts.pagination = { el: pagEl, clickable: true };
    }

    /* External nav buttons */
    const nextEl = document.querySelector(`[data-swiper-next="${id}"]`);
    const prevEl = document.querySelector(`[data-swiper-prev="${id}"]`);
    if (nextEl && prevEl) {
      modules.push(Modules.Navigation);
      opts.navigation = { nextEl, prevEl };
    }
    /* Hero uses built-in .swiper-button-next/prev (in markup) */
    if (id === "hero") {
      const heroNext = container.querySelector(".swiper-button-next");
      const heroPrev = container.querySelector(".swiper-button-prev");
      if (heroNext && heroPrev) {
        modules.push(Modules.Navigation);
        opts.navigation = { nextEl: heroNext, prevEl: heroPrev };
      }
    }

    /* Autoplay */
    const shouldAutoplay = !prefersReducedMotion();
    if (id === "reviews" && shouldAutoplay) {
      modules.push(Modules.Autoplay);
      opts.autoplay = { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true };
    }
    if (id === "hero" && shouldAutoplay) {
      modules.push(Modules.Autoplay);
      opts.autoplay = { delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true };
    }

    new Swiper(container, opts);
  });
}
