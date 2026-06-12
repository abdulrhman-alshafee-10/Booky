/* blog.js — blog listing + single helpers (plan §11, Phase 14).
 * Masonry category filter · list load-more · single reading-progress bar ·
 * demo comment form (validate + append). Each piece no-ops cleanly when its
 * markup is absent, so one init covers every blog page. */
import { qs, qsa } from "../utils/dom.js";
import { validateForm } from "./forms.js";
import { toast } from "./toast.js";

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ── Masonry category filter (chips) ─────────────────────── */
function initFilter() {
  const bar = qs("[data-blog-filters]");
  const grid = qs("[data-blog-grid]");
  if (!bar || !grid) return;
  const chips = qsa("[data-blog-filter]", bar);
  const items = qsa("[data-category]", grid);
  const empty = qs("[data-blog-empty]");

  function apply(slug) {
    let shown = 0;
    items.forEach((it) => {
      const match = slug === "all" || it.dataset.category === slug;
      it.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    apply(chip.dataset.blogFilter);
  }));
}

/* ── List load-more (reveal in batches) ──────────────────── */
function initLoadMore() {
  const btn = qs("[data-blog-loadmore]");
  const list = qs("[data-blog-list]");
  if (!btn || !list) return;
  const items = qsa("[data-blog-item]", list);
  const step = parseInt(btn.dataset.step, 10) || 3;
  let shown = parseInt(btn.dataset.initial, 10) || step;

  function refresh() {
    items.forEach((it, i) => { it.hidden = i >= shown; });
    if (shown >= items.length) { btn.hidden = true; }
  }
  refresh();
  btn.addEventListener("click", () => { shown += step; refresh(); });
}

/* ── Reading-progress bar (single-full) ──────────────────── */
function initReadingProgress() {
  const bar = qs("[data-reading-progress]");
  const article = qs("[data-article]");
  if (!bar || !article) return;
  let ticking = false;
  function update() {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
    const pct = total > 0 ? (passed / total) * 100 : 0;
    bar.style.inlineSize = pct + "%";
    bar.setAttribute("aria-valuenow", String(Math.round(pct)));
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* ── Comments demo (validate + append) ───────────────────── */
function initComments() {
  const form = qs("[data-comment-form]");
  const list = qs("[data-comment-list]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "Reader").trim();
    const body = String(data.get("comment") || "").trim();
    const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    if (list) {
      const el = document.createElement("li");
      el.className = "comment";
      el.innerHTML = `<span class="avatar avatar-md" aria-hidden="true">${esc(initials)}</span>
        <div class="comment-body">
          <div class="comment-head"><span class="comment-author">${esc(name)}</span><span class="comment-date">Just now</span></div>
          <p>${esc(body)}</p>
        </div>`;
      list.appendChild(el);
      const count = qs("[data-comment-count]");
      if (count) count.textContent = String(qsa(".comment", list).length);
    }
    form.reset();
    toast({ title: "Comment posted", message: "Thanks for joining the conversation.", type: "success" });
  });
}

export function initBlog() {
  initFilter();
  initLoadMore();
  initReadingProgress();
  initComments();
}
