/**
 * product-gallery.js — thumb→main swap, lightbox, keyboard nav.
 * Reduced-motion: skips zoom transition; lightbox still opens.
 */
import { prefersReducedMotion } from "./reduced-motion.js";

export function initProductGallery() {
  const gallery = document.querySelector("[data-product-gallery]");
  if (!gallery) return;

  const main    = gallery.querySelector("[data-gallery-main]");
  const thumbs  = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
  const lightbox = document.getElementById("gallery-lightbox");
  const lbContent = lightbox?.querySelector("[data-lb-content]");

  if (!main || !thumbs.length) return;

  function activate(idx) {
    const thumb = thumbs[idx];
    if (!thumb) return;
    const coverClass = thumb.dataset.galleryThumb;
    /* Swap main cover class */
    const mainCover = main.querySelector(".cover-art");
    if (mainCover) { mainCover.className = `cover-art ${coverClass}`; }
    thumbs.forEach((t, i) => t.setAttribute("aria-pressed", String(i === idx)));
    main.dataset.activeIdx = idx;
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => activate(i));
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); activate(Math.min(i + 1, thumbs.length - 1)); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); activate(Math.max(i - 1, 0)); }
    });
  });

  /* Lightbox */
  main.addEventListener("click", () => openLightbox(parseInt(main.dataset.activeIdx || 0)));

  function openLightbox(idx) {
    if (!lightbox) return;
    if (lbContent) {
      const cover = thumbs[idx]?.dataset.galleryThumb || "cover-1";
      lbContent.innerHTML = `<div class="cover-art ${cover}" style="aspect-ratio:2/3"></div>`;
    }
    lightbox.classList.add("is-open");
    lightbox.removeAttribute("hidden");
    lightbox.querySelector("[data-lb-close]")?.focus();

    /* Arrow key nav inside lightbox */
    const keyHandler = (e) => {
      if (e.key === "ArrowRight") { openLightbox(Math.min(idx + 1, thumbs.length - 1)); }
      if (e.key === "ArrowLeft")  { openLightbox(Math.max(idx - 1, 0)); }
      if (e.key === "Escape")     { closeLightbox(); }
    };
    lightbox.addEventListener("keydown", keyHandler, { once: true });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    main.focus();
  }

  lightbox?.querySelector("[data-lb-close]")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("pointerdown", (e) => { if (e.target === lightbox) closeLightbox(); });

  activate(0);
}
