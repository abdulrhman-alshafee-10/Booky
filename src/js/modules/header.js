/**
 * Header behaviours:
 *  - sticky-shrink on scroll (rAF-throttled, passive)
 *  - transparent → solid transition for header-3 (IntersectionObserver on hero)
 *  - mega-menu (hover via CSS; keyboard/click via JS + Esc + outside-click)
 *  - announcement bar dismiss (persisted in localStorage)
 */

import { onClickOutside } from "../utils/dom.js";

export function initHeader() {
  const header = document.querySelector("[data-header]");

  /* ── Sticky shrink ───────────────────────────────────────── */
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle("is-stuck", window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Transparent header (header-3) ──────────────────────── */
  if (header && header.hasAttribute("data-header-transparent")) {
    const hero = document.querySelector("[data-hero-dark]") || document.querySelector("[data-hero]");

    const makeSolid = (solid) => {
      header.classList.toggle("is-solid", solid);
    };

    if (hero) {
      // Use IntersectionObserver so the transition fires exactly when
      // the hero scrolls out of view, regardless of hero height.
      const io = new IntersectionObserver(
        ([entry]) => makeSolid(!entry.isIntersecting),
        { rootMargin: "-56px 0px 0px 0px" }
      );
      io.observe(hero);
      // Initial state
      makeSolid(!hero.getBoundingClientRect().top <= 56);
    } else {
      // No dark hero on this page → always show solid from load
      makeSolid(true);
    }

    // On mobile the header is always solid for legibility
    const mobileMediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleMobile = (mq) => { if (mq.matches) makeSolid(true); };
    mobileMediaQuery.addEventListener("change", handleMobile);
    handleMobile(mobileMediaQuery);
  }

  /* ── Mega-menu keyboard / click ──────────────────────────── */
  document.querySelectorAll("[data-mega-trigger]").forEach((trigger) => {
    const menu = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!menu) return;
    const parent = trigger.closest(".has-mega");
    if (!parent) return;
    let cleanup = null;

    const open = () => {
      trigger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      cleanup = onClickOutside(parent, close);
    };
    const close = () => {
      trigger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      cleanup?.();
      cleanup = null;
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      trigger.getAttribute("aria-expanded") === "true" ? close() : open();
    });
    parent.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { close(); trigger.focus(); }
    });
    parent.addEventListener("focusout", (e) => {
      if (!parent.contains(e.relatedTarget)) close();
    });
  });

  /* ── Announcement dismiss ────────────────────────────────── */
  const announce = document.querySelector("[data-announce]");
  const dismissBtn = document.querySelector("[data-announce-dismiss]");
  try {
    if (announce && localStorage.getItem("booky-announce-dismissed") === "1") {
      announce.style.display = "none";
    }
  } catch { /* ignore */ }

  dismissBtn?.addEventListener("click", () => {
    if (announce) announce.style.display = "none";
    try { localStorage.setItem("booky-announce-dismissed", "1"); } catch { /* ignore */ }
  });
}
