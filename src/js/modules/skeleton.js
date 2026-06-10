/**
 * skeleton.js — show skeleton loaders while async content loads.
 * Elements with [data-skeleton] are shown until their target is populated.
 */

export function initSkeleton() {
  const skeletons = document.querySelectorAll("[data-skeleton]");
  if (!skeletons.length) return;
  skeletons.forEach((sk) => {
    const target = sk.dataset.skeleton ? document.querySelector(sk.dataset.skeleton) : sk.nextElementSibling;
    if (!target) { sk.hidden = true; return; }
    const obs = new MutationObserver(() => {
      if (target.children.length || target.textContent.trim()) {
        sk.hidden = true;
        obs.disconnect();
      }
    });
    obs.observe(target, { childList: true, subtree: true, characterData: true });
    /* Fallback: hide after 3s regardless */
    setTimeout(() => { sk.hidden = true; obs.disconnect(); }, 3000);
  });
}
