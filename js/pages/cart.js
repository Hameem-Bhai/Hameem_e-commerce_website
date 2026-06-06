/**
 * ============================================================
 *  HameemBhai er Dokan — Cart Page JS
 *  Interactive cart list, quantity steppers, live subtotals,
 *  promo code validations, and empty state handling
 * ============================================================
 */
(function () {
  'use strict';

  var ce = HBD.utils.createElement;
  var fmt = HBD.utils.formatBDT;

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('cart');
    HBD.components.renderFooter();

    renderCart();

    // Bind general event handlers
    bindCartActions();

    // Listen for cart changes
    HBD.store.EventBus.on('cart:changed', function () {
      renderCart();
    });

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  // ════════════════════════════════════════════════════════════
  //  RENDER CART MAIN
  // ════════════════════════════════════════════════════════════
  function renderCart() {
    var items = HBD.store.CartStore.getItems();
    var layoutEl = document.getElementById('cart-layout');
    var emptyEl = document.getElementById('cart-empty');

    if (!layoutEl || !emptyEl) return;

    if (items.length === 0) {
      layoutEl.style.display = 'none';
      emptyEl.style.display = '';
      return;
    }

    layoutEl.style.display = 'flex';
    emptyEl.style.display = 'none';

    renderCartItems(items);
    renderSummary();
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER ITEMS TABLE
  // ════════════════════════════════════════════════════════════
  function renderCartItems(items) {
    var tbody = document.getElementById('cart-items-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    items.forEach(function (item) {
      var service = HBD.data.getServiceById(item.serviceId);
      if (!service) return;

      var cat = HBD.data.getCategoryById(service.categoryId);
      var lineTotal = service.price * item.qty;

      var tr = ce('tr', 'cart-item-row');
      tr.innerHTML =
        '<td data-label="Service">' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-media" style="background-color:' + (cat ? cat.color + '22' : '#33333322') + '">' +
              '<span>' + (cat ? cat.icon : '📦') + '</span>' +
            '</div>' +
            '<div>' +
              '<a href="service.html?id=' + service.id + '" class="cart-item-title">' + HBD.utils.sanitize(service.name) + '</a>' +
              '<span class="cart-item-cat">' + (cat ? cat.name : '') + '</span>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td class="cart-item-tier" data-label="Tier">' + HBD.utils.sanitize(item.tier) + '</td>' +
        '<td class="cart-item-price" data-label="Price">' + fmt(service.price) + '</td>' +
        '<td class="cart-item-qty" data-label="Qty">' +
          '<div class="qty-stepper">' +
            '<button class="qty-btn qty-btn--minus" data-id="' + item.itemId + '">−</button>' +
            '<input type="number" class="qty-input" value="' + item.qty + '" min="1" max="10" data-id="' + item.itemId + '" readonly />' +
            '<button class="qty-btn qty-btn--plus" data-id="' + item.itemId + '">+</button>' +
          '</div>' +
        '</td>' +
        '<td class="cart-item-total" data-label="Total">' + fmt(lineTotal) + '</td>' +
        '<td class="cart-item-remove" data-label="">' +
          '<button class="remove-btn" data-id="' + item.itemId + '" aria-label="Remove item">✕</button>' +
        '</td>';

      tbody.appendChild(tr);
    });

    bindItemStepperEvents();
  }

  // ════════════════════════════════════════════════════════════
  //  BIND QUANTITY & REMOVE BUTTONS
  // ════════════════════════════════════════════════════════════
  function bindItemStepperEvents() {
    var tbody = document.getElementById('cart-items-body');
    if (!tbody) return;

    // Minus buttons
    tbody.querySelectorAll('.qty-btn--minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var itemId = btn.getAttribute('data-id');
        var input = tbody.querySelector('.qty-input[data-id="' + itemId + '"]');
        var qty = parseInt(input.value, 10);
        if (qty > 1) {
          HBD.store.CartStore.updateQty(itemId, qty - 1);
        }
      });
    });

    // Plus buttons
    tbody.querySelectorAll('.qty-btn--plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var itemId = btn.getAttribute('data-id');
        var input = tbody.querySelector('.qty-input[data-id="' + itemId + '"]');
        var qty = parseInt(input.value, 10);
        if (qty < 10) {
          HBD.store.CartStore.updateQty(itemId, qty + 1);
        } else {
          HBD.components.showToast('Maximum quantity of 10 reached per service.', 'info');
        }
      });
    });

    // Remove buttons
    tbody.querySelectorAll('.remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var itemId = btn.getAttribute('data-id');
        HBD.store.CartStore.remove(itemId);
        HBD.components.showToast('Service package removed from cart.', 'info');
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER SUMMARY & TOTALS
  // ════════════════════════════════════════════════════════════
  function renderSummary() {
    var summary = HBD.store.CartStore.getTotal();

    // Populate values
    var subtotalEl = document.getElementById('summary-subtotal');
    var returningEl = document.getElementById('summary-returning-discount');
    var promoEl = document.getElementById('summary-promo-discount');
    var totalEl = document.getElementById('summary-total');

    var rowReturning = document.getElementById('row-returning-discount');
    var rowPromo = document.getElementById('row-promo-discount');
    var labelPromo = document.getElementById('label-promo-discount');

    if (subtotalEl) subtotalEl.textContent = fmt(summary.subtotal);
    if (totalEl) totalEl.textContent = fmt(summary.total);

    // Returning Customer 10%
    if (summary.returningDiscount > 0) {
      if (rowReturning) rowReturning.style.display = 'flex';
      if (returningEl) returningEl.textContent = '-' + fmt(summary.returningDiscount);
    } else {
      if (rowReturning) rowReturning.style.display = 'none';
    }

    // Promo Code Discount
    if (summary.promoDiscount > 0) {
      if (rowPromo) rowPromo.style.display = 'flex';
      if (promoEl) promoEl.textContent = '-' + fmt(summary.promoDiscount);
      if (labelPromo) labelPromo.textContent = 'Promo (' + summary.promoCode + ')';
    } else {
      if (rowPromo) rowPromo.style.display = 'none';
    }

    // Delivery Fee (Physical)
    var rowDelivery = document.getElementById('row-delivery-fee');
    var deliveryEl = document.getElementById('summary-delivery-fee');
    if (summary.deliveryFee > 0) {
      if (rowDelivery) rowDelivery.style.display = 'flex';
      if (deliveryEl) deliveryEl.textContent = '+' + fmt(summary.deliveryFee);
    } else {
      if (rowDelivery) rowDelivery.style.display = 'none';
    }

    // Active Promo Badge
    var badgeCard = document.getElementById('active-promo-badge');
    var badgeText = document.getElementById('active-promo-text');
    var promoInput = document.getElementById('promo-code');

    if (summary.promoDiscount > 0) {
      if (badgeCard) badgeCard.style.display = 'flex';
      if (badgeText) badgeText.textContent = summary.promoCode + ' Applied!';
      if (promoInput) {
        promoInput.value = '';
        promoInput.disabled = true;
      }
    } else {
      if (rowPromo) rowPromo.style.display = 'none';
      var badgeCard = document.getElementById('active-promo-badge');
      var promoInput = document.getElementById('promo-code');

      if (badgeCard) badgeCard.style.display = 'none';
      if (promoInput) {
        promoInput.disabled = false;
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  BIND COUPON ACTIONS & CLEARING
  // ════════════════════════════════════════════════════════════
  function bindCartActions() {
    var clearBtn = document.getElementById('clear-cart-btn');
    var applyPromoBtn = document.getElementById('apply-promo-btn');
    var removePromoBtn = document.getElementById('remove-promo-btn');

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear your shopping cart?')) {
          HBD.store.CartStore.clear();
          HBD.components.showToast('Shopping cart cleared.', 'info');
        }
      });
    }

    var checkoutBtn = document.querySelector('.summary-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function (e) {
        if (!HBD.store.UserStore.isLoggedIn()) {
          e.preventDefault();
          HBD.components.showToast('Please log in or create an account to checkout.', 'info');
          setTimeout(function() {
            window.location.href = 'login.html?redirect=checkout';
          }, 1500);
        }
      });
    }

    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', function () {
        var input = document.getElementById('promo-code');
        var code = input.value.trim().toUpperCase();

        if (!code) {
          HBD.components.showToast('Please enter a coupon code.', 'error');
          return;
        }

        var success = HBD.store.CartStore.applyPromo(code);
        if (success) {
          HBD.components.showToast('Coupon code "' + code + '" successfully applied! 🥳', 'success');
        } else {
          HBD.components.showToast('Invalid coupon code. Try another!', 'error');
        }
      });
    }

    if (removePromoBtn) {
      removePromoBtn.addEventListener('click', function () {
        HBD.store.CartStore.removePromo();
        HBD.components.showToast('Coupon code removed.', 'info');
      });
    }
  }

})();
