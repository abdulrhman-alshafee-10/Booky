/**
 * blog.js — blog listing engine
 * Search, category/tag filter chips, sort, load-more, live count, no-results.
 * Reads the data-post-* dataset contract on every [article] child of [data-blog-grid].
 * Null-safe: no-ops on pages without [data-blog].
 */

const BATCH = 6; // posts per load-more reveal

export function initBlog() {
  const root = document.querySelector("[data-blog]");
  if (!root) return;

  const grid          = root.querySelector("[data-blog-grid]");
  const sortEl        = root.querySelector("[data-blog-sort]");
  const countShown    = root.querySelector("[data-count-shown]");
  const countTotal    = root.querySelector("[data-count-total]");
  const loadMoreWrap  = root.querySelector("[data-blog-load-more-wrap]");
  const loadMoreBtn   = root.querySelector("[data-blog-load-more]");
  const emptyState    = root.querySelector("[data-blog-empty='no-results']");
  const searchInputs  = document.querySelectorAll("[data-blog-search]");
  const chipBtns      = document.querySelectorAll("[data-blog-chip]");
  const clearBtns     = document.querySelectorAll("[data-blog-clear]");

  if (!grid) return;

  const allPosts = Array.from(grid.querySelectorAll("article[data-post-id]"));
  let activeCategory = "all";
  let activeTag      = "";
  let searchQuery    = "";
  let sortValue      = sortEl ? sortEl.value : "newest";
  let visibleCount   = BATCH;

  // ─── helpers ───────────────────────────────────────────────────────
  function getPostData(el) {
    return {
      id:         el.dataset.postId,
      title:      (el.dataset.postTitle || "").toLowerCase(),
      category:   el.dataset.postCategory || "",
      tags:       (el.dataset.postTags || "").split(" ").filter(Boolean),
      date:       el.dataset.postDate || "1970-01-01",
      popularity: parseInt(el.dataset.postPopularity || "0", 10),
    };
  }

  function matchesFilters(el) {
    const d = getPostData(el);
    const catOk  = activeCategory === "all" || d.category === activeCategory;
    const tagOk  = !activeTag || d.tags.includes(activeTag);
    const queryOk = !searchQuery || d.title.includes(searchQuery.toLowerCase());
    return catOk && tagOk && queryOk;
  }

  function sortPosts(posts) {
    return [...posts].sort((a, b) => {
      const da = getPostData(a), db = getPostData(b);
      if (sortValue === "oldest")  return da.date.localeCompare(db.date);
      if (sortValue === "popular") return db.popularity - da.popularity;
      return db.date.localeCompare(da.date); // newest (default)
    });
  }

  function render() {
    const matched   = sortPosts(allPosts.filter(matchesFilters));
    const total     = matched.length;
    let   shown     = 0;

    allPosts.forEach(el => el.classList.add("hidden"));

    matched.forEach((el, i) => {
      if (i < visibleCount) {
        el.classList.remove("hidden");
        shown++;
      }
    });

    // Count
    if (countShown) countShown.textContent = shown;
    if (countTotal) countTotal.textContent = total;

    // Load-more
    if (loadMoreWrap) {
      loadMoreWrap.hidden = total <= visibleCount;
    }

    // No-results
    if (emptyState) {
      emptyState.classList.toggle("hidden", total > 0);
    }
  }

  // ─── chip filter ─────────────────────────────────────────────────
  function setActiveChip(chipEl) {
    chipBtns.forEach(btn => btn.classList.remove("is-active"));
    if (chipEl) chipEl.classList.add("is-active");
  }

  chipBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.blogCategory;
      const tag = btn.dataset.blogTag;

      if (cat !== undefined) {
        activeCategory = cat;
        activeTag      = "";
        setActiveChip(btn);
      }
      if (tag !== undefined) {
        activeTag      = (activeTag === tag) ? "" : tag; // toggle
        activeCategory = "all";
        setActiveChip(activeTag ? btn : null);
      }

      visibleCount = BATCH;
      render();

      // Close drawer on mobile after selection
      const drawer = document.getElementById("blog-sidebar");
      if (drawer && window.innerWidth < 1024) {
        drawer.classList.remove("is-open");
      }
    });
  });

  // ─── search ───────────────────────────────────────────────────────
  let searchTimer;
  searchInputs.forEach(input => {
    input.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchQuery  = input.value.trim();
        visibleCount = BATCH;
        // Sync all search inputs
        searchInputs.forEach(s => { if (s !== input) s.value = input.value; });
        render();
      }, 200);
    });
  });

  // ─── sort ─────────────────────────────────────────────────────────
  if (sortEl) {
    sortEl.addEventListener("change", () => {
      sortValue    = sortEl.value;
      visibleCount = BATCH;
      render();
    });
  }

  // ─── load-more ────────────────────────────────────────────────────
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      loadMoreBtn.classList.add("is-loading");
      setTimeout(() => {
        visibleCount += BATCH;
        loadMoreBtn.classList.remove("is-loading");
        render();
      }, 300);
    });
  }

  // ─── clear filters ───────────────────────────────────────────────
  clearBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = "all";
      activeTag      = "";
      searchQuery    = "";
      visibleCount   = BATCH;
      searchInputs.forEach(s => { s.value = ""; });
      setActiveChip(document.querySelector("[data-blog-category='all'][data-blog-chip]"));
      render();
    });
  });

  // ─── mobile drawer open / close ──────────────────────────────────
  document.querySelectorAll("[data-drawer-open='blog-sidebar']").forEach(btn => {
    btn.addEventListener("click", () => {
      const drawer  = document.getElementById("blog-sidebar");
      const overlay = document.querySelector("[data-drawer-overlay='blog-sidebar']");
      if (!drawer) return;
      drawer.classList.add("is-open");
      if (overlay) overlay.classList.add("is-visible");
      // focus trap: move focus to close button inside drawer
      const closeBtn = drawer.querySelector("[data-drawer-close='blog-sidebar']");
      if (closeBtn) closeBtn.focus();
    });
  });

  document.querySelectorAll("[data-drawer-close='blog-sidebar']").forEach(btn => {
    btn.addEventListener("click", closeSidebar);
  });

  document.querySelectorAll("[data-drawer-overlay='blog-sidebar']").forEach(ov => {
    ov.addEventListener("click", closeSidebar);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSidebar();
  });

  function closeSidebar() {
    const drawer  = document.getElementById("blog-sidebar");
    const overlay = document.querySelector("[data-drawer-overlay='blog-sidebar']");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    // Return focus to open trigger
    const trigger = document.querySelector("[data-drawer-open='blog-sidebar']");
    if (trigger) trigger.focus();
  }

  // ─── pre-filter from URL ?q= or ?cat= ────────────────────────────
  try {
    const params = new URLSearchParams(window.location.search);
    const qParam   = params.get("q");
    const catParam = params.get("cat");
    if (qParam) {
      searchQuery = qParam;
      searchInputs.forEach(s => { s.value = qParam; });
    }
    if (catParam) {
      activeCategory = catParam;
      const chip = document.querySelector(`[data-blog-category="${catParam}"][data-blog-chip]`);
      setActiveChip(chip || null);
    }
  } catch (_) { /* ignore */ }

  // ─── initial render ──────────────────────────────────────────────
  render();
}
