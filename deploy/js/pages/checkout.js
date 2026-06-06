/**
 * ============================================================
 *  HameemBhai er Dokan — Checkout Page JS
 *  Multi-step wizard tabs, validations, dynamic payment
 *  briefings, order summaries, and success tracking
 * ============================================================
 */
(function () {
  'use strict';

  var currentStep = 1;
  var checkoutData = {
    name: '',
    phone: '',
    email: '',
    address: '',
    brief: '',
    paymentMethod: '',
    senderPhone: '',
    txId: ''
  };

  var fmt = HBD.utils.formatBDT;

  document.addEventListener('DOMContentLoaded', function () {
    // Auth check
    if (!HBD.store.UserStore || !HBD.store.UserStore.isLoggedIn()) {
      window.location.href = 'login.html?redirect=checkout';
      return;
    }

    // Cart check
    if (HBD.store.CartStore.getItems().length === 0) {
      HBD.components.showToast('Your cart is empty. Please select a service first!', 'error');
      setTimeout(function () { window.location.href = 'services.html'; }, 1000);
      return;
    }

    HBD.components.renderHeader('checkout');
    HBD.components.renderFooter();

    // Pre-fill user data if logged in
    var user = HBD.store.UserStore.getCurrentUser();
    if (user) {
      var nameIn = document.getElementById('co-name');
      var phoneIn = document.getElementById('co-phone');
      var emailIn = document.getElementById('co-email');
      var addressIn = document.getElementById('co-address');
      if (nameIn) {
        nameIn.value = user.name || '';
        nameIn.readOnly = true;
      }
      if (phoneIn) {
        phoneIn.value = user.phone || '';
        phoneIn.readOnly = true;
      }
      if (emailIn) {
        emailIn.value = user.email || '';
        emailIn.readOnly = true;
      }
      if (addressIn && user.address) {
        addressIn.value = user.address;
        addressIn.readOnly = true;
      }
      var noticeEl = document.getElementById('registered-user-notice');
      if (noticeEl) {
        noticeEl.style.display = 'flex';
      }
    }

    // Handle unlocking of contact fields
    var unlockBtn = document.getElementById('unlock-contact-fields');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var nameIn = document.getElementById('co-name');
        var phoneIn = document.getElementById('co-phone');
        var emailIn = document.getElementById('co-email');
        var addressIn = document.getElementById('co-address');
        if (nameIn) nameIn.readOnly = false;
        if (phoneIn) phoneIn.readOnly = false;
        if (emailIn) emailIn.readOnly = false;
        if (addressIn) addressIn.readOnly = false;

        var noticeEl = document.getElementById('registered-user-notice');
        if (noticeEl) {
          noticeEl.style.background = 'rgba(255, 255, 255, 0.03)';
          noticeEl.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          noticeEl.innerHTML = '<span style="font-size: var(--fs-xs); color: var(--clr-text-secondary); display: flex; align-items: center; gap: 8px;">' +
            '<span style="color: var(--clr-accent);">⚠️</span> Editing contact details specifically for this order.' +
            '</span>';
        }
      });
    }

    // Dynamic Shipping Address showing/hiding based on cart contents
    var hasPhysical = HBD.store.CartStore.hasPhysicalItems();
    var addressGroup = document.getElementById('shipping-address-group');
    var addressInput = document.getElementById('co-address');
    if (hasPhysical) {
      if (addressGroup) addressGroup.style.display = 'block';
      if (addressInput) addressInput.required = true;
    } else {
      if (addressGroup) addressGroup.style.display = 'none';
      if (addressInput) addressInput.required = false;
    }

    renderOrderSummary();
    renderPaymentMethods();
    bindStepEvents();

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  // ════════════════════════════════════════════════════════════
  //  ORDER SUMMARY SIDEBAR
  // ════════════════════════════════════════════════════════════
  function renderOrderSummary() {
    var items = HBD.store.CartStore.getItems();
    var listContainer = document.getElementById('checkout-items-list');

    var subtotalEl = document.getElementById('checkout-subtotal');
    var returningEl = document.getElementById('checkout-returning');
    var promoEl = document.getElementById('checkout-promo');
    var totalEl = document.getElementById('checkout-total');

    var rowReturning = document.getElementById('checkout-row-returning');
    var rowPromo = document.getElementById('checkout-row-promo');
    var labelPromo = document.getElementById('checkout-label-promo');

    if (!listContainer) return;

    listContainer.innerHTML = '';

    items.forEach(function (item) {
      var service = HBD.data.getServiceById(item.serviceId);
      if (!service) return;

      var cat = HBD.data.getCategoryById(service.categoryId);
      var itemEl = HBD.utils.createElement('div', 'checkout-item');

      itemEl.innerHTML =
        '<div class="checkout-item__details">' +
          '<span class="checkout-item__emoji">' + (cat ? cat.icon : '📦') + '</span>' +
          '<div>' +
            '<span class="checkout-item__name">' + HBD.utils.sanitize(service.name) + '</span>' +
            '<span class="checkout-item__tier">' + HBD.utils.sanitize(item.tier) + ' × ' + item.qty + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="checkout-item__price">' + fmt(service.price * item.qty) + '</span>';

      listContainer.appendChild(itemEl);
    });

    var summary = HBD.store.CartStore.getTotal();

    if (subtotalEl) subtotalEl.textContent = fmt(summary.subtotal);
    if (totalEl) totalEl.textContent = fmt(summary.total);

    if (summary.returningDiscount > 0) {
      if (rowReturning) rowReturning.style.display = 'flex';
      if (returningEl) returningEl.textContent = '-' + fmt(summary.returningDiscount);
    } else {
      if (rowReturning) rowReturning.style.display = 'none';
    }

    if (summary.promoDiscount > 0) {
      if (rowPromo) rowPromo.style.display = 'flex';
      if (labelPromo) labelPromo.textContent = 'Promo (' + summary.promoCode + ')';
      if (promoEl) promoEl.textContent = '-' + fmt(summary.promoDiscount);
    } else {
      if (rowPromo) rowPromo.style.display = 'none';
    }

    var rowDelivery = document.getElementById('checkout-row-delivery');
    var deliveryEl = document.getElementById('checkout-delivery');
    if (summary.deliveryFee > 0) {
      if (rowDelivery) rowDelivery.style.display = 'flex';
      if (deliveryEl) deliveryEl.textContent = '+' + fmt(summary.deliveryFee);
    } else {
      if (rowDelivery) rowDelivery.style.display = 'none';
    }
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER PAYMENT METHODS
  // ════════════════════════════════════════════════════════════
  function renderPaymentMethods() {
    var container = document.getElementById('payment-methods-grid');
    if (!container) return;

    container.innerHTML = '';

    var hasDigital = HBD.store.CartStore.hasDigitalItems();

    HBD.data.paymentMethods.forEach(function (pm, index) {
      // Disable COD if there are digital items
      if (pm.id === 'cod' && hasDigital) {
        return; 
      }

      var active = index === 0 ? ' is-active' : '';
      if (index === 0) checkoutData.paymentMethod = pm.id;

      var div = HBD.utils.createElement('div', 'payment-card' + active);
      div.setAttribute('data-id', pm.id);
      div.innerHTML =
        '<div class="payment-card__header">' +
          '<div class="payment-card__radio"></div>' +
          '<strong>' + HBD.utils.sanitize(pm.name) + '</strong>' +
        '</div>' +
        '<p class="payment-card__caption">' + getPaymentCaption(pm.id) + '</p>';

      container.appendChild(div);
    });

    bindPaymentSelection();
    updatePaymentInstructions();
  }

  function getPaymentCaption(id) {
    var captions = {
      bkash: 'bKash personal/agent transfer. Safe and instant.',
      nagad: 'Nagad digital wallet transfer. Easy cash out.',
      rocket: 'Rocket mobile wallet payment. Direct utility.',
      cod: 'Cash on Delivery. Pay cash after preview designs.'
    };
    return captions[id] || '';
  }

  function bindPaymentSelection() {
    var cards = document.querySelectorAll('.payment-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        checkoutData.paymentMethod = card.getAttribute('data-id');
        updatePaymentInstructions();
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  //  PAYMENT MANUAL INSTRUCTIONS
  // ════════════════════════════════════════════════════════════
  function updatePaymentInstructions() {
    var instructionPanel = document.getElementById('payment-details-instruction');
    var instructionText = document.getElementById('payment-instructions-text');
    var codNotesGroup = document.getElementById('cod-notes-group');
    var paymentFieldsRow = document.getElementById('payment-fields-row');
    var codNotesInput = document.getElementById('co-cod-notes');
    var senderInput = document.getElementById('co-sender-phone');
    var trxInput = document.getElementById('co-trxid');

    if (!instructionPanel || !instructionText) return;

    if (checkoutData.paymentMethod === 'cod') {
      instructionPanel.style.display = 'block';
      if (codNotesGroup) codNotesGroup.style.display = 'block';
      if (paymentFieldsRow) paymentFieldsRow.style.display = 'none';

      instructionText.innerHTML =
        '<strong>Cash on Delivery (COD) terms:</strong> HameemBhai will start work on your design immediately. ' +
        'Before the final case delivery, we will send watermarked previews. ' +
        'Payment of BDT amount must be cash/wallet cleared to unlock final deliverables.';

      if (codNotesInput) codNotesInput.required = false;
      if (senderInput) senderInput.required = false;
      if (trxInput) trxInput.required = false;
    } else {
      instructionPanel.style.display = 'block';
      if (codNotesGroup) codNotesGroup.style.display = 'none';
      if (paymentFieldsRow) paymentFieldsRow.style.display = 'flex';

      instructionText.innerHTML =
        'Please send the grand total BDT amount to HameemBhai\'s personal bKash number: ' +
        '<strong style="color: var(--clr-accent);">01785501873</strong> (Send Money / cash-in). ' +
        'Enter your sender bKash number and the transaction TrxID code below for immediate verification.';

      if (codNotesInput) codNotesInput.required = false;
      if (senderInput) senderInput.required = true;
      if (trxInput) trxInput.required = true;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  STEP NAVIGATION & CONTROL
  // ════════════════════════════════════════════════════════════
  function bindStepEvents() {
    // Form Step 1
    var form1 = document.getElementById('form-step-1');
    if (form1) {
      form1.addEventListener('submit', function (e) {
        e.preventDefault();
        checkoutData.name = document.getElementById('co-name').value.trim();
        checkoutData.phone = document.getElementById('co-phone').value.trim();
        checkoutData.email = document.getElementById('co-email').value.trim();
        checkoutData.brief = document.getElementById('co-brief').value.trim();

        var addressInput = document.getElementById('co-address');
        var hasPhysical = HBD.store.CartStore.hasPhysicalItems();
        checkoutData.address = (hasPhysical && addressInput) ? addressInput.value.trim() : '';

        goToStep(2);
      });
    }

    // Form Step 2
    var form2 = document.getElementById('form-step-2');
    if (form2) {
      form2.addEventListener('submit', function (e) {
        e.preventDefault();
        if (checkoutData.paymentMethod === 'cod') {
          checkoutData.senderPhone = '';
          checkoutData.txId = document.getElementById('co-cod-notes').value.trim() || 'COD Term Accepted';
        } else {
          var sender = document.getElementById('co-sender-phone').value.trim();
          var trx = document.getElementById('co-trxid').value.trim();

          // Validate sender phone: exactly 11 digits
          if (!/^\d{11}$/.test(sender)) {
            HBD.components.showToast('Sender bKash number must be exactly 11 digits!', 'error');
            return;
          }

          // Validate TrxID: exactly 10 characters (alphanumeric)
          if (!/^[a-zA-Z0-9]{10}$/.test(trx)) {
            HBD.components.showToast('Transaction ID (TrxID) must be exactly 10 characters!', 'error');
            return;
          }

          checkoutData.senderPhone = sender;
          checkoutData.txId = trx;
        }

        populateStep3Review();
        goToStep(3);
      });
    }

    // Back buttons
    var backTo1 = document.getElementById('prev-to-step-1');
    if (backTo1) backTo1.addEventListener('click', function () { goToStep(1); });

    var backTo2 = document.getElementById('prev-to-step-2');
    if (backTo2) backTo2.addEventListener('click', function () { goToStep(2); });

    // Place Order Button Click
    var placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', function () {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing Order... ⌛';

        setTimeout(simulateOrderSuccess, 1500);
      });
    }
  }

  function goToStep(step) {
    // Hide all step panes
    document.querySelectorAll('.checkout-step-pane').forEach(function (pane) {
      pane.classList.remove('is-active');
    });

    // Show selected step pane
    var targetPane = document.getElementById('step-pane-' + step);
    if (targetPane) targetPane.classList.add('is-active');

    // Update progress steps active states
    document.querySelectorAll('.progress-step').forEach(function (stepEl) {
      var sNum = parseInt(stepEl.getAttribute('data-step'), 10);
      stepEl.classList.toggle('is-active', sNum === step);
      stepEl.classList.toggle('is-completed', sNum < step);
    });

    // Update progress bar filler line
    var fill = document.getElementById('progress-fill');
    if (fill) {
      var percentages = { 1: '0%', 2: '50%', 3: '100%' };
      fill.style.width = percentages[step];
    }

    currentStep = step;
    HBD.utils.scrollToTop(true);
  }

  function populateStep3Review() {
    var customerInfoEl = document.getElementById('review-customer-info');
    var paymentInfoEl = document.getElementById('review-payment-info');
    var briefInfoEl = document.getElementById('review-brief-info');

    if (customerInfoEl) {
      customerInfoEl.innerHTML =
        '<strong>Name:</strong> ' + HBD.utils.sanitize(checkoutData.name) + '<br>' +
        '<strong>Phone:</strong> ' + HBD.utils.sanitize(checkoutData.phone) + '<br>' +
        '<strong>Email:</strong> ' + HBD.utils.sanitize(checkoutData.email) +
        (checkoutData.address ? '<br><strong>Shipping Address:</strong> ' + HBD.utils.sanitize(checkoutData.address) : '');
    }

    if (paymentInfoEl) {
      var pm = HBD.data.paymentMethods.find(function (p) { return p.id === checkoutData.paymentMethod; });
      var pmName = pm ? pm.name : checkoutData.paymentMethod.toUpperCase();
      var details = '';
      if (checkoutData.paymentMethod === 'cod') {
        details = 'Upon Delivery (Notes: ' + (checkoutData.txId || 'None') + ')';
      } else {
        details = 'Sender: ' + checkoutData.senderPhone + ', TrxID: ' + checkoutData.txId;
      }
      paymentInfoEl.innerHTML =
        '<strong>Method:</strong> ' + HBD.utils.sanitize(pmName) + '<br>' +
        '<strong>Payment Info:</strong> ' + HBD.utils.sanitize(details);
    }

    if (briefInfoEl) {
      briefInfoEl.textContent = checkoutData.brief;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  SIMULATE ORDER PLACED SUCCESS & SEND TO WHATSAPP
  // ════════════════════════════════════════════════════════════
  //  SIMULATE ORDER PLACED SUCCESS & SEND TO WHATSAPP / EMAIL
  // ════════════════════════════════════════════════════════════
  function simulateOrderSuccess() {
    var layoutEl = document.getElementById('checkout-layout');
    var successEl = document.getElementById('checkout-success-pane');
    var progressBar = document.getElementById('checkout-progress-bar');

    var successOrderId = document.getElementById('success-order-id');
    var successPhone = document.getElementById('success-phone');

    if (!layoutEl || !successEl) return;

    var orderNumber = 'HB-' + Math.floor(10000 + Math.random() * 90000);

    if (successOrderId) successOrderId.textContent = orderNumber;
    if (successPhone) successPhone.textContent = checkoutData.phone;

    // Persist returning state flag in LocalStorage for next order discount
    HBD.store.UserStore.incrementOrders();

    // Construct Text Message (for WhatsApp & Copy)
    var itemsText = HBD.store.CartStore.getItems().map(function(item) {
        var service = HBD.data.getServiceById(item.serviceId);
        return "▪ " + (service ? service.name : 'Item') + " (" + item.tier + ") ×" + item.qty;
    }).join("\n");

    var summary = HBD.store.CartStore.getTotal();
    var pm = HBD.data.paymentMethods.find(function (p) { return p.id === checkoutData.paymentMethod; });
    var pmName = pm ? pm.name : checkoutData.paymentMethod.toUpperCase();

    var paymentDetails = "";
    if (checkoutData.paymentMethod === 'cod') {
      paymentDetails = "*Notes:* " + (checkoutData.txId || 'None') + "\n";
    } else {
      paymentDetails = "*Sender Number:* " + checkoutData.senderPhone + "\n" +
                       "*Transaction ID (TrxID):* " + checkoutData.txId + "\n";
    }

    var rawMessage = "Hello HameemBhai! I just placed a new order on your website. 🚀\n\n" +
                    "*Order ID:* " + orderNumber + "\n" +
                    "*Name:* " + checkoutData.name + "\n" +
                    "*Phone:* " + checkoutData.phone + "\n" +
                    (checkoutData.email ? "*Email:* " + checkoutData.email + "\n" : "") +
                    (checkoutData.address ? "*Shipping Address:* " + checkoutData.address + "\n" : "") + "\n" +
                    "*Order Items:*\n" + itemsText + "\n\n" +
                    "*Total Amount:* ৳" + summary.total + "\n" +
                    "*Payment Method:* " + pmName + "\n" +
                    paymentDetails + "\n" +
                    (checkoutData.brief ? "*Design Brief:*\n" + checkoutData.brief : "");

    // Set up Copy Button
    var btnCopy = document.getElementById('btn-copy-order');
    if (btnCopy) {
      btnCopy.onclick = function() {
        navigator.clipboard.writeText(rawMessage).then(function() {
          var original = btnCopy.innerHTML;
          btnCopy.innerHTML = '✅ Copied!';
          HBD.components.showToast('Order details copied to clipboard!', 'success');
          setTimeout(function() { btnCopy.innerHTML = original; }, 2000);
        });
      };
    }

    // Set up WhatsApp Button
    var btnWa = document.getElementById('btn-wa-order');
    if (btnWa) {
      var waUrl = "https://wa.me/8801785501873?text=" + encodeURIComponent(rawMessage);
      btnWa.href = waUrl;
    }

    // Send Emails via Central Email Service & Save Order (treated as background tasks)
    try {
      if (HBD.email) {
        var emailParams = {
          name: checkoutData.name,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address || '',
          orderId: orderNumber,
          items: HBD.store.CartStore.getItems(),
          subtotal: summary.subtotal,
          discount: summary.promoDiscount + summary.returningDiscount,
          deliveryFee: summary.deliveryFee,
          total: summary.total,
          paymentMethod: pmName,
          txId: checkoutData.paymentMethod === 'cod' ? 'COD' : ('Sender: ' + checkoutData.senderPhone + ', TrxID: ' + checkoutData.txId),
          brief: checkoutData.brief
        };

        // 1. Save order to Admin DB
        if (HBD.store.AdminStore && HBD.store.AdminStore.saveOrder) {
          HBD.store.AdminStore.saveOrder(emailParams);
        }

        // 2. Send receipt to customer (if they provided email)
        if (checkoutData.email) {
          HBD.email.sendReceipt(emailParams).then(function() {
            console.log('Customer receipt sent');
          }).catch(function(err) {
            console.error('Customer receipt failed', err);
          });
        }

        // 3. Send notification to admin
        HBD.email.sendAdminOrder(emailParams).then(function() {
          console.log('Admin notification sent');
        }).catch(function(err) {
          console.error('Admin notification failed', err);
        });
      }
    } catch (e) {
      console.error('Background order processing failed but continuing checkout:', e);
    }

    // Clear cart completely
    HBD.store.CartStore.clear();

    // Toggle layouts
    layoutEl.style.display = 'none';
    if (progressBar) progressBar.style.display = 'none';
    successEl.style.display = 'block';

    HBD.components.showToast('Order ' + orderNumber + ' successfully placed!', 'success');
    HBD.utils.scrollToTop(true);
  }

})();
