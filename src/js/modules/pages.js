/* pages.js — small page helpers for the People/info/system set (plan §15):
 *   • letter filter   — A–Z author index   ([data-letter-filter])
 *   • faq search      — live question filter ([data-faq-search])
 *   • toc spy         — sticky legal TOC highlight ([data-toc])
 *   • password toggle — show/hide auth fields ([data-pw-toggle])
 * Each no-ops cleanly when its markup is absent. */
import { qs, qsa, on, prefersReducedMotion } from "../utils/dom.js";

/* ── A–Z letter filter (authors.html) ─────────────────────────── */
function initLetterFilter() {
  qsa("[data-letter-filter]").forEach((bar) => {
    const listId = bar.getAttribute("data-letter-filter");
    const list = listId ? qs(`#${listId}`) : bar.nextElementSibling;
    if (!list) return;
    const items = qsa("[data-letter]", list);
    const empty = qs("[data-letter-empty]", list.parentElement) || qs("[data-letter-empty]");
    const buttons = qsa("button[data-letter]", bar);

    const apply = (letter) => {
      let shown = 0;
      items.forEach((item) => {
        const match = letter === "all" || item.getAttribute("data-letter") === letter;
        item.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.getAttribute("data-letter") === letter))
      );
      if (empty) empty.hidden = shown !== 0;
    };

    buttons.forEach((b) => on(b, "click", () => apply(b.getAttribute("data-letter"))));
    apply("all");
  });
}

/* ── FAQ live search (faq.html) ──────────────────────────────── */
function initFaqSearch() {
  qsa("[data-faq-search]").forEach((input) => {
    const scope = qs(`#${input.getAttribute("data-faq-search")}`) || document;
    const items = qsa("[data-faq-item]", scope);
    const groups = qsa("[data-faq-group]", scope);
    const empty = qs("[data-faq-empty]", scope);

    const run = () => {
      const q = input.value.trim().toLowerCase();
      items.forEach((item) => {
        const hit = !q || item.textContent.toLowerCase().includes(q);
        item.hidden = !hit;
      });
      let total = 0;
      groups.forEach((g) => {
        const visible = qsa("[data-faq-item]", g).filter((i) => !i.hidden).length;
        g.hidden = visible === 0;
        total += visible;
      });
      if (empty) empty.hidden = total !== 0;
    };

    on(input, "input", run);
  });
}

/* ── Sticky TOC scroll-spy (terms.html / privacy.html) ────────── */
function initTocSpy() {
  const toc = qs("[data-toc]");
  if (!toc || !("IntersectionObserver" in window)) return;
  const links = qsa("a[href^='#']", toc);
  const map = new Map();
  links.forEach((a) => {
    const target = qs(a.getAttribute("href"));
    if (target) map.set(target, a);
  });
  if (!map.size) return;

  const setActive = (link) =>
    links.forEach((a) => a.setAttribute("aria-current", a === link ? "true" : "false"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(map.get(e.target));
      });
    },
    { rootMargin: "0px 0px -75% 0px", threshold: 0 }
  );
  map.forEach((_, section) => io.observe(section));
}

/* ── Password show/hide (login.html / register.html) ──────────── */
function initPasswordToggle() {
  qsa("[data-pw-toggle]").forEach((btn) => {
    const input = qs(`#${btn.getAttribute("data-pw-toggle")}`);
    if (!input) return;
    on(btn, "click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      const use = qs("use", btn);
      if (use) use.setAttribute("href", show ? "#i-eye-off" : "#i-eye");
    });
  });
}

/* Smooth-scroll for in-page TOC links unless reduced motion is set. */
function initTocSmooth() {
  if (prefersReducedMotion()) return;
  qsa("[data-toc] a[href^='#']").forEach((a) =>
    on(a, "click", (e) => {
      const target = qs(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", a.getAttribute("href"));
    })
  );
}

export function initPages() {
  initLetterFilter();
  initFaqSearch();
  initTocSpy();
  initTocSmooth();
  initPasswordToggle();
}
