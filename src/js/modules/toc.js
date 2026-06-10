/**
 * toc.js — Table of Contents builder + scroll-spy + reading progress bar.
 * Auto-builds [data-toc-list] from .prose h2 / h3 inside [data-post-body].
 * Scroll-spy uses IntersectionObserver; reading progress uses rAF-throttled scroll.
 * All motion guarded by prefers-reduced-motion.
 */

export function initToc() {
  const body    = document.querySelector("[data-post-body]");
  const tocList = document.querySelector("[data-toc-list]");
  const bar     = document.getElementById("read-progress");

  if (!body || !tocList) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── 1. Build TOC from .prose h2 / h3 ───────────────────────────────
  const headings = Array.from(body.querySelectorAll(".prose h2, .prose h3"));

  if (!headings.length) {
    // Hide empty TOC containers
    document.querySelectorAll("[id='post-toc'], .toc-float").forEach(el => {
      el.hidden = true;
    });
    return;
  }

  headings.forEach((heading, i) => {
    // Ensure each heading has an id
    if (!heading.id) {
      heading.id = `heading-${i}`;
    }

    const isH3   = heading.tagName === "H3";
    const item   = document.createElement("li");
    const link   = document.createElement("a");

    link.href        = `#${heading.id}`;
    link.className   = "toc-link" + (isH3 ? " toc-link-sub" : "");
    link.textContent = heading.textContent;
    link.dataset.headingId = heading.id;

    link.addEventListener("click", e => {
      if (!prefersReduced) {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    item.appendChild(link);
    tocList.appendChild(item);
  });

  // ─── 2. Scroll-spy via IntersectionObserver ──────────────────────────
  const tocLinks = tocList.querySelectorAll(".toc-link");

  let activeId = "";

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
          updateActiveLink(activeId);
        }
      });
    },
    {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
    }
  );

  headings.forEach(h => observer.observe(h));

  function updateActiveLink(id) {
    tocLinks.forEach(link => {
      const isCurrent = link.dataset.headingId === id;
      link.setAttribute("aria-current", isCurrent ? "true" : "false");
    });
  }

  // ─── 3. Reading progress bar (rAF-throttled) ─────────────────────────
  if (!bar) return;

  let rafPending = false;

  function updateProgress() {
    rafPending = false;
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  }

  if (!prefersReduced) {
    window.addEventListener("scroll", () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
  } else {
    // Show full bar immediately if motion is reduced (no animation)
    bar.style.transform = "scaleX(1)";
    bar.style.transition = "none";
  }
}
