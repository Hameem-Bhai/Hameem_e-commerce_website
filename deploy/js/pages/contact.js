/**
 * ============================================================
 *  HameemBhai er Dokan — Contact Page JS
 *  FAQ accordions, dynamic Custom Order Form renders,
 *  subject bindings, and submission alerts
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('contact');
    HBD.components.renderFooter();

    initFAQs();
    checkURLState();
    bindContactForm();

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  // ════════════════════════════════════════════════════════════
  //  URL STATE & DYNAMIC FORM RENDER
  // ════════════════════════════════════════════════════════════
  function checkURLState() {
    var subjectParam = HBD.utils.getQueryParam('subject');
    var selectSubject = document.getElementById('con-subject');

    if (subjectParam === 'custom') {
      loadCustomOrderForm();
    } else if (subjectParam) {
      if (selectSubject) {
        selectSubject.value = subjectParam;
      }
    }
  }

  function loadCustomOrderForm() {
    var defaultFormWrapper = document.getElementById('default-contact-form-wrapper');
    var customFormContainer = document.getElementById('custom-order-form-container');
    var titleEl = document.getElementById('contact-title');
    var subtitleEl = document.getElementById('contact-subtitle');

    if (!defaultFormWrapper || !customFormContainer) return;

    defaultFormWrapper.style.display = 'none';
    customFormContainer.style.display = 'block';

    if (titleEl) titleEl.textContent = 'Custom Order Brief';
    if (subtitleEl) subtitleEl.textContent = 'Describe your unique project requirements to HameemBhai.';

    // Render the custom brief form from components.js
    HBD.components.renderCustomOrderForm(customFormContainer);

    // Bind custom form submission
    var customForm = document.getElementById('hbd-custom-order-form');
    if (customForm) {
      customForm.setAttribute('data-custom-handler', 'true');
      customForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        var formData = new FormData(customForm);
        var name = formData.get('name');
        var email = formData.get('email');
        var phone = formData.get('phone') || '';
        var catId = formData.get('category');
        var cat = HBD.data.getCategoryById(catId);
        var catName = cat ? cat.name : catId;
        var desc = formData.get('description');
        var budget = formData.get('budget') || 'Flexible';

        // 1. Save to Local Admin Orders Database!
        var orderId = 'custom-' + Date.now();
        var orderNumber = Math.floor(100000 + Math.random() * 900000);
        
        var orderData = {
          id: orderId,
          orderId: orderId,
          order_number: orderNumber,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          createdAt: new Date().toISOString(),
          order_total: budget,
          status: 'Pending',
          payment_method: 'Custom Request',
          transaction_id: 'N/A',
          order_items: 'Custom Brief: ' + catName,
          design_brief: desc
        };
        HBD.store.AdminStore.saveOrder(orderData);

        // 2. Send via Email
        if (HBD.email) {
          var subject = '🔔 Custom Order Brief: #' + orderNumber;
          var contactInfo = 'Email: ' + email + (phone ? ' | Phone: ' + phone : '');
          var message = 'Service Category: ' + catName + '\n' +
                        'Estimated Budget: ৳' + budget + '\n\n' +
                        'Project Description:\n' + desc;
          HBD.email.sendContact(name, contactInfo, subject, message);
        }

        HBD.components.showToast('Brief submitted successfully! HameemBhai will reply via email. ✉️', 'success');

        var btn = customForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Submitted ✓'; }
        customForm.reset();

        setTimeout(function () {
          window.location.href = 'index.html';
        }, 2000);
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  //  BIND DEFAULT CONTACT FORM
  // ════════════════════════════════════════════════════════════
  function bindContactForm() {
    var form = document.getElementById('hbd-contact-form');
    var selectSubject = document.getElementById('con-subject');

    if (selectSubject) {
      selectSubject.addEventListener('change', function () {
        if (selectSubject.value === 'custom') {
          loadCustomOrderForm();
        }
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('con-name').value.trim();
        var email = document.getElementById('con-email').value.trim();
        var subject = selectSubject ? selectSubject.value : 'general';
        var message = document.getElementById('con-message').value.trim();

        if (!name || !email || !message) {
          HBD.components.showToast('Please fill out all required fields.', 'error');
          return;
        }

        if (HBD.email) {
          HBD.email.sendContact(name, email, 'Contact Form: ' + subject, message);
        }

        HBD.components.showToast('Message sent successfully! HameemBhai will reply within a few hours. ✉️', 'success');
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sent ✓'; }
        form.reset();
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  //  FAQ ACCORDIONS
  // ════════════════════════════════════════════════════════════
  function initFAQs() {
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      var header = item.querySelector('.faq-item__header');

      header.addEventListener('click', function () {
        // Toggle current item
        var isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('is-open');
        });

        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    });
  }

})();
