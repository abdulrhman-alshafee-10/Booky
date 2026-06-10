/**
 * audio-preview.js
 * Visual play/pause toggle for the audiobook waveform strip.
 * No real audio — purely a UI state toggle.
 * Reduced-motion safe.
 */

export function initAudioPreview() {
  const btn = document.querySelector("[data-audio-toggle]");
  if (!btn) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bars = document.querySelectorAll(".audio-bar");
  let playing = false;
  let animFrame = null;
  const heights = ["0.75rem","1.25rem","1.875rem","1rem","2rem","1.375rem","0.875rem","1.625rem","2.125rem","0.75rem","1.5rem","1.125rem","1.75rem","0.875rem","1.375rem","2rem","1.25rem","0.75rem","1.875rem","1rem"];

  function animateBars() {
    if (!playing || prefersReduced) return;
    bars.forEach((bar) => {
      const h = parseFloat(heights[Math.floor(Math.random() * heights.length)]);
      bar.style.height = h + "rem";
    });
    animFrame = setTimeout(animateBars, 120);
  }

  function stopAnimation() {
    clearTimeout(animFrame);
    bars.forEach((bar, i) => { bar.style.height = heights[i % heights.length]; });
  }

  btn.addEventListener("click", () => {
    playing = !playing;
    btn.setAttribute("aria-label", playing ? "Pause playback" : "Play Echoes of the Deep");
    const icon = btn.querySelector("use");
    if (icon) icon.setAttribute("href", playing ? "#icon-pause" : "#icon-play");
    if (playing) { animateBars(); } else { stopAnimation(); }
  });
}
