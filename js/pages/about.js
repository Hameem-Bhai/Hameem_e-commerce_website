/**
 * ============================================================
 *  HameemBhai er Dokan — About Page JS
 *  Animated stats counters and layout interactions
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('about');
    HBD.components.renderFooter();

    initStatsCounters();

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  // ════════════════════════════════════════════════════════════
  //  STATS COUNTERS (Animated counting)
  // ════════════════════════════════════════════════════════════
  function initStatsCounters() {
    var statsSection = document.getElementById('about-stats-section');
    if (!statsSection) return;

    var counters = statsSection.querySelectorAll('.about-stats__number');
    var animated = false;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(function (counter) {
            animateCounter(counter);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

      el.textContent = Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

})();
