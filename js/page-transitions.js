/**
 * ============================================================
 *  HameemBhai er Dokan — Page Transitions
 *  Smooth fade-in/fade-out for navigating between pages
 * ============================================================
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // 1. Fade in on load
    document.body.classList.add('page-transition');
    setTimeout(function() {
      document.body.classList.add('is-loaded');
    }, 50);

    // 2. Fade out on link click
    var links = document.querySelectorAll('a[href]');
    
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = link.getAttribute('href');
        var target = link.getAttribute('target');

        // Ignore links that open in new tabs, anchor links, or mailto/tel
        if (
          target === '_blank' ||
          e.ctrlKey || e.metaKey ||
          href.startsWith('#') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.includes('wa.me')
        ) {
          return;
        }

        // Ignore links for the same page (e.g. tabs or filters)
        if (href === window.location.pathname.split('/').pop() || href === '') {
            return;
        }

        e.preventDefault();
        
        // Remove loaded class to trigger fade out
        document.body.classList.remove('is-loaded');

        // Wait for CSS transition (300ms) then navigate
        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    });
  });

  // Handle Safari back button cache (BFCache)
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      document.body.classList.add('is-loaded');
    }
  });

})();
