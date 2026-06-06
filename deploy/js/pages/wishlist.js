/**
 * ============================================================
 *  HameemBhai er Dokan — Wishlist Page JS
 *  Query favorited services and render dynamic cards
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('wishlist');
    HBD.components.renderFooter();

    renderWishlist();

    // Listen for wishlist state changes
    HBD.store.EventBus.on('wishlist:changed', function () {
      renderWishlist();
    });

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  function renderWishlist() {
    var ids = HBD.store.WishlistStore.getIds();
    var gridEl = document.getElementById('wishlist-grid');
    var emptyEl = document.getElementById('wishlist-empty');

    if (!gridEl || !emptyEl) return;

    if (ids.length === 0) {
      gridEl.style.display = 'none';
      emptyEl.style.display = 'block';
      return;
    }

    gridEl.style.display = 'grid';
    emptyEl.style.display = 'none';

    gridEl.innerHTML = '';

    ids.forEach(function (id) {
      var service = HBD.data.getServiceById(id);
      if (service) {
        var card = HBD.components.renderServiceCard(service, gridEl);
        card.setAttribute('data-animate', 'fade-up');
      }
    });

    HBD.store.EventBus.emit('content:loaded');
  }

})();
