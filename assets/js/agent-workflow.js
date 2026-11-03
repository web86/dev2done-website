/* One-time, subtle reveal of the agent's report and human review.
   The static content always remains visible when JS is unavailable. */
(() => {
  'use strict';
  function init() {
    const panel = document.querySelector('.agent-workflow-console');
    if (!panel || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        panel.classList.add('is-revealed');
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(panel);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else init();
})();
