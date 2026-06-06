/**
 * ============================================================
 *  HameemBhai er Dokan — Central EmailJS Service
 *  Handles sending Premium HTML emails across the site.
 * ============================================================
 */
(function () {
  'use strict';

  window.HBD = window.HBD || {};

  // 🔴 IMPORTANT: Replace these with your actual keys from EmailJS dashboard
  var PUBLIC_KEY = 'puQ7_l1LxjSuGpKIm';
  var SERVICE_ID = 'service_m58hxvd';
  
  // 🔴 IMPORTANT: Replace these with your 4 Template IDs once you create them
  var TEMPLATES = {
    receipt: 'template_cwen0io',           // Customer Receipt
    welcome: 'template_q1ruj0l',           // Welcome Email
    adminOrder: 'TEMPLATE_ADMIN_ORDER_ID', // Admin Order Notification
    adminContact: 'TEMPLATE_ADMIN_CONTACT_ID' // Admin Contact Notification
  };

  var isInitialized = false;

  function init() {
    if (isInitialized) return true;
    if (!window.emailjs) {
      console.warn('EmailJS library not loaded.');
      return false;
    }
    emailjs.init(PUBLIC_KEY);
    isInitialized = true;
    return true;
  }

  /**
   * Send Customer Receipt Email
   */
  function sendReceipt(params) {
    if (!init()) return Promise.reject('EmailJS not ready');
    // Format the items properly into HTML table rows for the receipt
    var itemsHtml = params.items.map(function(item) {
      var service = HBD.data.getServiceById(item.serviceId);
      var name = service ? service.name : 'Item';
      var price = (service ? service.price : 0) * item.qty;
      return `<tr>
        <td><strong>${name}</strong><br><span style="color:#888;font-size:12px;">Tier: ${item.tier} | Qty: ${item.qty}</span></td>
        <td class="text-right">BDT ${price}</td>
      </tr>`;
    }).join('');

    var emailParams = {
      customer_name: params.name,
      customer_email: params.email,
      order_number: params.orderId,
      order_date: new Date().toLocaleDateString('en-GB'),
      payment_method: params.paymentMethod,
      transaction_id: params.txId || 'N/A',
      order_items_html: itemsHtml,
      order_subtotal: params.subtotal,
      order_discount: params.discount,
      deliveryFee: params.deliveryFee,
      order_total: params.total,
      website_url: window.location.origin
    };
    
    return emailjs.send(SERVICE_ID, TEMPLATES.receipt, emailParams);
  }

  /**
   * Send Admin Order Notification
   */
  function sendAdminOrder(params) {
    var itemsText = params.items.map(function(item) {
      var service = HBD.data.getServiceById(item.serviceId);
      return '▪ ' + (service ? service.name : 'Item') + ' (' + item.tier + ') ×' + item.qty;
    }).join('\n');

    return fetch('https://formsubmit.co/ajax/basithameem@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        OrderNumber: params.orderId,
        Customer: params.name,
        Email: params.email,
        Phone: params.phone,
        Address: params.address || 'N/A',
        Payment: params.paymentMethod,
        TransactionID: params.txId || 'N/A',
        Total: '৳' + params.total,
        Items: itemsText,
        DesignBrief: params.brief || 'No brief provided',
        _subject: '🔔 New Order Received: #' + params.orderId
      })
    });
  }

  /**
   * Send Welcome Email
   */
  function sendWelcome(name, email) {
    if (!init()) return Promise.reject('EmailJS not ready');
    if (TEMPLATES.welcome === 'TEMPLATE_WELCOME_ID') return Promise.resolve(); // Skip if not set

    var emailParams = {
      customer_name: name,
      customer_email: email,
      website_url: window.location.origin
    };
    
    return emailjs.send(SERVICE_ID, TEMPLATES.welcome, emailParams);
  }

  /**
   * Send Contact Form Notification
   */
  function sendContact(name, contactInfo, subject, message) {
    return fetch('https://formsubmit.co/ajax/basithameem@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Name: name,
        Contact: contactInfo,
        Subject: subject,
        Message: message,
        _subject: '🔔 New Contact Inquiry: ' + subject
      })
    });
  }

  // Export
  window.HBD.email = {
    sendReceipt: sendReceipt,
    sendAdminOrder: sendAdminOrder,
    sendWelcome: sendWelcome,
    sendContact: sendContact
  };

})();
