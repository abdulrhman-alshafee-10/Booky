/**
 * gallery.js
 * Gallery page: category chip filter + lightbox (keyboard, focus-trap, Esc).
 * Reuses the same lightbox overlay from product-gallery.js pattern.
 */

export function initGallery() {
  const container = document.querySelector("[data-gallery]");
  if (!container) return;

  initGalleryFilter(container);
  initGalleryLightbox(container);
}

function initGalleryFilter(container) {
  const chips   = container.querySelectorAll("[data-gallery-chip]");
  const items   = container.querySelectorAll("[data-gallery-item]");
  const empty   = container.querySelector("[data-gallery-empty]");

  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");

      const cat = chip.dataset.galleryChip;
      let visible = 0;
      items.forEach((item) => {
        const match = cat === "all" || item.dataset.galleryCategory === cat;
        item.hidden = !match;
        if (match) visible++;
      });
      if (empty) empty.hidden = visible > 0;
    });
  });
}

function initGalleryLightbox(container) {
  const items     = container.querySelectorAll("[data-gallery-open]");
  const lightbox  = document.querySelector("[data-gallery-lightbox]");
  if (!lightbox) return;

  const imgWrap   = lightbox.querySelector("[data-lb-img]");
  const caption   = lightbox.querySelector("[data-lb-caption]");
  const closeBtn  = lightbox.querySelector("[data-lb-close]");
  const prevBtn   = lightbox.querySelector("[data-lb-prev]");
  const nextBtn   = lightbox.querySelector("[data-lb-next]");

  let currentIndex = 0;
  const allItems = Array.from(items);

  function open(index) {
    currentIndex = index;
    const item = allItems[index];
    if (!item || !imgWrap) return;

    imgWrap.innerHTML = item.dataset.galleryOpen
      ? `<div class="cover-art ${item.dataset.galleryOpen} w-full h-full rounded-lg"></div>`
      : "";
    if (caption) caption.textContent = item.dataset.galleryCaption ?? "";

    lightbox.hidden = false;
    lightbox.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    allItems[currentIndex]?.focus();
  }

  function navigate(dir) {
    const next = (currentIndex + dir + allItems.length) % allItems.length;
    open(next);
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => open(i));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  closeBtn?.addEventListener("click", close);
  prevBtn?.addEventListener("click", () => navigate(-1));
  nextBtn?.addEventListener("click", () => navigate(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape")     close();
    if (e.key === "ArrowLeft")  navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });
}
