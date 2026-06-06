/**
 * ============================================================
 *  HameemBhai er Dokan — Orders Page JS
 *  Interactive order tracker dashboard, status tags,
 *  and download links simulation
 * ============================================================
 */
(function () {
  'use strict';

  var fmt = HBD.utils.formatBDT;

  document.addEventListener('DOMContentLoaded', function () {
    // Auth Check
    if (!HBD.store.UserStore.isLoggedIn()) {
      HBD.components.showToast('Please login to track your orders.', 'error');
      setTimeout(function () { window.location.href = 'login.html'; }, 1000);
      return;
    }

    HBD.components.renderHeader('login');
    HBD.components.renderFooter();

    renderOrders();

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  function renderOrders() {
    var listContainer = document.getElementById('orders-list');
    var emptyEl = document.getElementById('orders-empty');

    if (!listContainer || !emptyEl) return;

    // Get orders from LocalStorage or generate mock ones if they are a returning customer
    var orders = JSON.parse(localStorage.getItem('hbd_orders') || '[]');

    if (orders.length === 0 && HBD.store.UserStore.isReturning()) {
      // Seed two highly realistic previous orders for demo purposes
      orders = [
        {
          id: 'HB-89412',
          date: '2025-05-18',
          status: 'Delivered',
          items: [
            { name: 'Standard Lighter Case', tier: 'Standard', qty: 2, price: 300 }
          ],
          total: 600,
          paymentMethod: 'bkash',
          brief: 'Retro synthwave vectors, neon pink and purple lines. For Clipper lighter.'
        },
        {
          id: 'HB-72351',
          date: '2025-04-20',
          status: 'Delivered',
          items: [
            { name: 'Digital Portrait', tier: 'Portrait', qty: 1, price: 1500 }
          ],
          total: 1350, // 10% applied
          paymentMethod: 'nagad',
          brief: 'Portrait of my parents under warm sunlight, oil painting look.'
        }
      ];
      localStorage.setItem('hbd_orders', JSON.stringify(orders));
    }

    // Add a pending simulated order if they just completed a checkout in this session
    // (We check if their orderCount is greater than the seeded list)
    var user = HBD.store.UserStore.getCurrentUser();
    var hasNewOrderPending = user && user.orderCount > orders.filter(function(o) { return o.status === 'Delivered'; }).length;

    if (hasNewOrderPending && orders.filter(function(o) { return o.status === 'In Progress'; }).length === 0) {
      orders.unshift({
        id: 'HB-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toISOString().split('T')[0],
        status: 'In Progress',
        items: [
          { name: 'Standard Lighter Case', tier: 'Standard', qty: 1, price: 300 },
          { name: 'Logo Premium', tier: 'Premium', qty: 1, price: 3000 }
        ],
        total: 2970, // 10% returning customer auto applied
        paymentMethod: 'bkash',
        brief: 'Mock orders brief submitted during active session checkout.'
      });
      localStorage.setItem('hbd_orders', JSON.stringify(orders));
    }

    if (orders.length === 0) {
      listContainer.style.display = 'none';
      emptyEl.style.display = 'block';
      return;
    }

    listContainer.style.display = 'block';
    emptyEl.style.display = 'none';

    listContainer.innerHTML = '';

    orders.forEach(function (order) {
      var card = HBD.utils.createElement('div', 'order-card');
      card.style.background = 'rgba(255,255,255,0.02)';
      card.style.border = '1px solid var(--border-color)';
      card.style.borderRadius = '16px';
      card.style.padding = '25px';
      card.style.marginBottom = '25px';
      card.style.backdropFilter = 'blur(10px)';

      var statusColor = order.status === 'Delivered' ? 'var(--color-success)' : 'var(--accent-pink)';

      var itemsHTML = (order.items || []).map(function (item) {
        return '<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px; color:var(--text-muted);">' +
                 '<span>' + HBD.utils.sanitize(item.name || 'Service Item') + ' (' + HBD.utils.sanitize(item.tier || 'Standard') + ') × ' + (item.qty || 1) + '</span>' +
                 '<span>' + fmt((item.price || 0) * (item.qty || 1)) + '</span>' +
               '</div>';
      }).join('');

      card.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">' +
          '<div>' +
            '<strong style="font-size:18px; color:#fff;">Order ' + HBD.utils.sanitize(order.id || order.orderId || 'HB-XXXXX') + '</strong>' +
            '<span style="font-size:12px; color:var(--text-muted); display:block; margin-top:4px;">Placed on ' + HBD.utils.formatDate(order.date || order.createdAt) + '</span>' +
          '</div>' +
          '<span style="background:' + statusColor + '20; color:' + statusColor + '; padding:6px 14px; border-radius:30px; font-size:12px; font-weight:600; text-transform:uppercase;">' +
            (order.status || 'Pending') +
          '</span>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          itemsHTML +
        '</div>' +
        '<div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:8px; margin-bottom:20px; font-size:13px; color:var(--text-muted);">' +
          '<strong>Brief Details:</strong> ' + HBD.utils.sanitize(order.brief || 'No details provided.') +
        '</div>' +
        '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:15px;">' +
          '<div>' +
            '<span style="font-size:13px; color:var(--text-muted);">Payment: ' + (order.paymentMethod || 'BKASH').toUpperCase() + '</span>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<span style="font-size:13px; color:var(--text-muted); display:block;">Total Paid</span>' +
            '<strong style="font-size:18px; color:var(--accent-pink);">' + fmt(order.total || 0) + '</strong>' +
          '</div>' +
        '</div>' +
        (order.status === 'Delivered'
          ? '<div style="margin-top:20px; text-align:right;"><button class="hbd-btn hbd-btn--primary hbd-btn--sm" onclick="alert(\'Downloading mock high-res vector package... 🚀\')">Download Deliverables 📥</button></div>'
          : '');

      listContainer.appendChild(card);
    });
  }

})();
