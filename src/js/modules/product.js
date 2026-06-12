/* product.js — the single product page (plan §10, Phase 13).
 * Gallery + native <dialog> lightbox, format → price/availability sync,
 * frequently-bought-together total + add-all, buy-now, sticky add-bar,
 * recently-viewed (localStorage), and the share "copy link" button.
 * No-ops cleanly on pages without a [data-product] root. */
import { qs, qsa } from "../utils/dom.js";
import { addToCart, readPayload, coverImg, format, coverSrc } from "./store.js";
import { toast } from "./toast.js";
import { openOverlay } from "./dialog.js";

const RECENT_KEY = "booky-recent-v1";
const RECENT_CAP = 8;

/* ── Gallery + lightbox ──────────────────────────────────── */
function initGallery(root) {
  const mainImg = qs("[data-gallery-main] img", root);
  const thumbs = qsa("[data-gallery-thumb]", root);
  if (!mainImg || !thumbs.length) return;

  const sources = thumbs.map((t) => t.querySelector("img")?.src || "");
  let index = thumbs.findIndex((t) => t.getAttribute("aria-current") === "true");
  if (index < 0) index = 0;

  const lightbox = qs("#product-lightbox");
  const lbImg = lightbox ? qs("[data-lb-img]", lightbox) : null;

  function show(i) {
    index = (i + sources.length) % sources.length;
    mainImg.src = sources[index];
    thumbs.forEach((t, n) => t.setAttribute("aria-current", String(n === index)));
    if (lbImg && lightbox.open) lbImg.src = sources[index];
  }

  thumbs.forEach((t, n) => t.addEventListener("click", () => show(n)));

  if (lightbox && lbImg) {
    const open = () => { lbImg.src = sources[index]; lightbox.showModal(); };
    qs("[data-gallery-open]", root)?.addEventListener("click", open);
    qs("[data-gallery-main] button", root)?.addEventListener("click", open);
    qs("[data-lb-prev]", lightbox)?.addEventListener("click", () => show(index - 1));
    qs("[data-lb-next]", lightbox)?.addEventListener("click", () => show(index + 1));
    qs("[data-lb-close]", lightbox)?.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
    });
  }
}

/* ── Format → price / availability / payload sync ────────── */
const AVAIL = {
  in:  { cls: "is-in",  icon: "i-check-circle", text: "In stock — ships within 24 hours" },
  pre: { cls: "is-pre", icon: "i-clock",        text: "Available to pre-order" },
  out: { cls: "is-out", icon: "i-info",         text: "Temporarily out of stock" },
};

function initFormats(root) {
  const inputs = qsa('input[name="format"]', root);
  if (!inputs.length) return;
  const priceEl = qs("[data-prod-price]", root);
  const oldEl = qs("[data-prod-old]", root);
  const saveEl = qs("[data-prod-save]", root);
  const availEl = qs("[data-prod-avail]", root);
  const stickyPrice = qs("[data-sticky-price]");

  function apply(input) {
    const price = parseFloat(input.dataset.price) || 0;
    const old = parseFloat(input.dataset.old) || 0;
    if (priceEl) priceEl.textContent = format(price);
    if (stickyPrice) stickyPrice.textContent = format(price);
    if (oldEl) {
      oldEl.hidden = !(old > price);
      oldEl.textContent = format(old);
    }
    if (saveEl) {
      if (old > price) { saveEl.hidden = false; saveEl.textContent = `Save ${Math.round((1 - price / old) * 100)}%`; }
      else saveEl.hidden = true;
    }
    const a = AVAIL[input.dataset.avail] || AVAIL.in;
    if (availEl) {
      availEl.className = `prod-avail ${a.cls}`;
      availEl.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${a.icon}"></use></svg><span>${a.text}</span>`;
    }
    /* keep the payload the Add/Buy buttons read in sync */
    root.dataset.productPrice = price.toFixed(2);
    root.dataset.productFormat = input.value;
  }

  inputs.forEach((i) => i.addEventListener("change", () => i.checked && apply(i)));
  const checked = inputs.find((i) => i.checked) || inputs[0];
  if (checked) { checked.checked = true; apply(checked); }
}

/* ── Buy-now → add then go to checkout ───────────────────── */
function initBuyNow(root) {
  qs("[data-buy-now]", root)?.addEventListener("click", (e) => {
    e.preventDefault();
    const qty = parseInt(qs("[data-qty-field]", root)?.value, 10) || 1;
    addToCart(readPayload(root), qty);
    window.location.href = "checkout.html";
  });
}

/* ── Frequently bought together ──────────────────────────── */
function initBoughtTogether() {
  const box = qs("[data-bought-together]");
  if (!box) return;
  const totalEl = qs("[data-bt-total]", box);
  const recalc = () => {
    let sum = 0;
    qsa("[data-bt-item]", box).forEach((c) => { if (c.checked) sum += parseFloat(c.dataset.btPrice) || 0; });
    if (totalEl) totalEl.textContent = format(sum);
  };
  box.addEventListener("change", (e) => { if (e.target.closest("[data-bt-item]")) recalc(); });
  qs("[data-bt-addall]", box)?.addEventListener("click", () => {
    const checked = qsa("[data-bt-item]:checked", box);
    if (!checked.length) return;
    checked.forEach((c) => addToCart(readPayload(c)));
    toast({ title: "Bundle added", message: `${checked.length} books added to your cart`, type: "success" });
    openOverlay("mini-cart");
  });
  recalc();
}

/* ── Sticky add-to-cart bar (appears past the buy block) ──── */
function initStickyBar(root) {
  const bar = qs("[data-sticky-bar]");
  const anchor = qs("[data-buy-anchor]", root);
  if (!bar || !anchor || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.classList.toggle("is-visible", past);
  }, { threshold: 0 });
  io.observe(anchor);
  /* sticky bar add button shares the product payload */
  qs("[data-sticky-add]", bar)?.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(readPayload(root), parseInt(qs("[data-qty-field]", root)?.value, 10) || 1);
    toast({ title: "Added to cart", message: root.dataset.productTitle, type: "success" });
    openOverlay("mini-cart");
  });
}

/* ── Recently viewed (localStorage) ──────────────────────── */
function readRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function initRecentlyViewed(root) {
  const id = root.dataset.productId;
  let list = readRecent().filter((b) => b && b.id !== id);
  const rail = qs("[data-recently-viewed]");

  if (rail) {
    const items = list.slice(0, 5);
    const section = rail.closest("[data-recently-section]");
    if (!items.length) { if (section) section.hidden = true; }
    else {
      if (section) section.hidden = false;
      rail.innerHTML = items.map(revealCard).join("");
    }
  }

  /* record the current product for next visits */
  const me = readPayload(root);
  list.unshift({ id: me.id, title: me.title, author: me.author, price: me.price, cover: me.cover });
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_CAP))); } catch { /* ignore */ }
}

/* Card-1 "Reveal" markup so cart/wishlist/compare delegation works. */
function revealCard(b) {
  const credit = b.author ? `${b.title} by ${b.author}` : b.title;
  return `<article class="card-reveal" data-product-id="${b.id}" data-product-title="${attr(b.title)}" data-product-author="${attr(b.author || "")}" data-product-price="${b.price || 0}" data-product-cover="${attr(b.cover || "")}">
    <div class="card-media">
      <a class="cover" href="product.html" aria-label="View ${attr(b.title)}"><img src="${coverSrc(b.cover)}" alt="${attr(credit)} — book cover" width="600" height="900" loading="lazy" decoding="async"></a>
      <div class="cover-actions">
        <button class="cover-icon-btn" data-quickview aria-label="Quick view ${attr(b.title)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-eye"></use></svg></button>
        <button class="cover-icon-btn" data-compare aria-label="Compare ${attr(b.title)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-compare"></use></svg></button>
        <button class="cover-icon-btn" data-wishlist aria-label="Save ${attr(b.title)}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-heart"></use></svg></button>
      </div>
      <button class="card-reveal-add" data-add-to-cart aria-label="Add ${attr(b.title)} to cart"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-bag"></use></svg> Add to cart</button>
    </div>
    <div class="card-reveal-body">
      <a class="card-title" href="product.html">${attr(b.title)}</a>
      <a class="card-author" href="author.html">${attr(b.author || "")}</a>
      <div class="price-group"><span class="price">${format(b.price || 0)}</span></div>
    </div>
  </article>`;
}
function attr(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

/* ── Share: copy link ────────────────────────────────────── */
function initCopyLink() {
  qs("[data-copy-link]")?.addEventListener("click", (e) => {
    const input = e.target.closest(".coupon-form")?.querySelector("input");
    const value = input?.value || window.location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(value).catch(() => {});
    toast({ title: "Link copied", message: "Share it anywhere you like.", type: "success" });
  });
}

export function initProduct() {
  const root = qs("[data-product]");
  initBoughtTogether();
  initCopyLink();
  if (!root) return;
  initGallery(root);
  initFormats(root);
  initBuyNow(root);
  initStickyBar(root);
  initRecentlyViewed(root);
}
