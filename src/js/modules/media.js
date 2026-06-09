/**
 * Video background guard.
 * Autoplays [data-video-bg] elements only when:
 *  - prefers-reduced-motion is not set
 *  - viewport width > 768px (save data on mobile)
 * Pauses when scrolled off-screen (IntersectionObserver, saves battery).
 */

import { prefersReducedMotion } from "./reduced-motion.js";

export function initVideoBackgrounds() {
  document.querySelectorAll("[data-video-bg]").forEach((video) => {
    if (prefersReducedMotion()) return;
    if (window.innerWidth <= 768) return;

    /* Show the video element (hidden by default in markup) */
    video.classList.remove("hidden");

    /* Pause/play based on visibility */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => { /* autoplay blocked — poster stays */ });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(video);
  });
}
