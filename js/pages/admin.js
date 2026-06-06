/**
 * ============================================================
 *  HameemBhai er Dokan — Admin Dashboard JS
 *  Depends on: HBD.data, HBD.store (AdminStore), HBD.components
 * ============================================================
 */
(function () {
  'use strict';

  // ── Guard: redirect non-admins immediately ──────────────────
  document.addEventListener('DOMContentLoaded', function () {

    // Inject logo into sidebar slot
    var logoSlot = document.getElementById('admin-logo-slot');
    if (logoSlot) logoSlot.innerHTML = HBD.components.HB_LOGO_SVG;

    if (!HBD.store.AdminStore.isAdmin()) {
      // Not logged in as admin → go to login
      alert('Admin access only. Please log in with the admin account.');
      window.location.href = 'login.html';
      return;
    }

    _initSidebar();
    _initModal();
    _initLogout();
    _renderAll();

    // Event listeners for real-time updates
    HBD.store.EventBus.on('data:changed', function () {
      _renderAll();
    });

    HBD.store.EventBus.on('admin:ordersUpdated', function () {
      _renderOrders();
    });

    // Handle hash navigation (e.g. admin.html#reviews)
    var hash = window.location.hash.replace('#', '');
    if (hash) _switchSection(hash);
  });


  // ════════════════════════════════════════════════════════════
  //  SIDEBAR NAV
  // ════════════════════════════════════════════════════════════
  function _initSidebar() {
    var nav = document.getElementById('admin-nav');
    if (!nav) return;
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-section]');
      if (!btn) return;
      var section = btn.getAttribute('data-section');
      _switchSection(section);
    });
  }

  function _switchSection(name) {
    // Update nav items
    document.querySelectorAll('.admin-nav__item').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-section') === name);
    });
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(function (el) {
      el.classList.toggle('is-active', el.id === 'section-' + name);
    });
  }


  // ════════════════════════════════════════════════════════════
  //  MODAL SYSTEM
  // ════════════════════════════════════════════════════════════
  var _modalSaveHandler = null;

  function _initModal() {
    var overlay = document.getElementById('admin-modal-overlay');
    var closeBtn = document.getElementById('admin-modal-close');
    var cancelBtn = document.getElementById('admin-modal-cancel');
    var saveBtn = document.getElementById('admin-modal-save');

    function closeModal() {
      overlay.classList.remove('is-open');
      _modalSaveHandler = null;
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    var isMouseDownOnOverlay = false;
    overlay.addEventListener('mousedown', function (e) {
      isMouseDownOnOverlay = (e.target === overlay);
    });
    overlay.addEventListener('mouseup', function (e) {
      if (isMouseDownOnOverlay && e.target === overlay) {
        closeModal();
      }
      isMouseDownOnOverlay = false;
    });

    saveBtn.addEventListener('click', function () {
      if (_modalSaveHandler) {
        var ok = _modalSaveHandler();
        if (ok !== false) closeModal();
      }
    });
  }

  function _openModal(title, bodyHTML, onSave, saveBtnText) {
    document.getElementById('admin-modal-title').textContent = title;
    document.getElementById('admin-modal-body').innerHTML = bodyHTML;
    document.getElementById('admin-modal-save').textContent = saveBtnText || 'Save Changes';
    _modalSaveHandler = onSave;
    document.getElementById('admin-modal-overlay').classList.add('is-open');
  }


  // ════════════════════════════════════════════════════════════
  //  LOGOUT
  // ════════════════════════════════════════════════════════════
  function _initLogout() {
    var link = document.getElementById('admin-logout-link');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        HBD.store.UserStore.logout();
        window.location.href = 'login.html';
      });
    }
  }


  // ════════════════════════════════════════════════════════════
  //  RENDER ALL SECTIONS
  // ════════════════════════════════════════════════════════════
  function _renderAll() {
    _renderOrders();
    _renderCustomers();
    _renderServices();
    _renderCategories();
    _renderReviews();
    _renderRecommended();
    _renderCodes();
    _renderSettings();
  }


  // ════════════════════════════════════════════════════════════
  //  ORDERS
  // ════════════════════════════════════════════════════════════
  function _renderOrders() {
    var tbody = document.querySelector('#admin-table-orders tbody');
    if (!tbody) return;

    HBD.store.AdminStore.getOrders().then(function (orders) {
      tbody.innerHTML = '';

      if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">No orders found.</td></tr>';
        return;
      }

      orders.slice().reverse().forEach(function (o) {
        var tr = document.createElement('tr');
        
        // Calculate BDT total
        var totalVal = parseFloat(o.order_total || o.total || 0);
        var totalDisplay = '৳' + totalVal.toLocaleString('en-IN');

        // Build items display
        var itemsText = '';
        if (Array.isArray(o.items)) {
          itemsText = o.items.map(function(item) {
            return item.name + ' (' + item.tier + ') x' + item.qty;
          }).join(', ');
        } else {
          itemsText = String(o.order_items || o.items || '');
        }

        var date = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-GB') : 'N/A';

        tr.innerHTML =
          '<td><strong>#' + _esc(o.order_number || o.id || 'N/A') + '</strong></td>' +
          '<td><div class="admin-table__name">' + _esc(o.customer_name || o.name || 'N/A') + '</div>' +
               '<div class="admin-table__sub">' + _esc(o.customer_email || o.email || '') + '<br>' + _esc(o.customer_phone || o.phone || '') + '</div></td>' +
          '<td>' + date + '</td>' +
          '<td class="admin-table__price">' + totalDisplay + '</td>' +
          '<td><span class="admin-table__badge admin-table__badge--' + (o.status === 'Completed' ? 'visible' : 'popular') + '">' +
            _esc(o.status || 'Pending') +
          '</span></td>' +
          '<td class="admin-table__actions">' +
            '<button class="admin-btn admin-btn--sm admin-btn--outline" data-action="view-order" data-id="' + _esc(o.order_number || o.id) + '">👁️ Details</button>' +
          '</td>';

        // Attach inline details viewer on button click
        var viewBtn = tr.querySelector('[data-action="view-order"]');
        if (viewBtn) {
          viewBtn.addEventListener('click', function () {
            var detailsBody = 
              '<div style="text-align: left; line-height: 1.6; color: #fff;">' +
                '<p><strong>Order Number:</strong> #' + _esc(o.order_number || o.id) + '</p>' +
                '<p><strong>Customer:</strong> ' + _esc(o.customer_name || o.name) + '</p>' +
                '<p><strong>Email:</strong> ' + _esc(o.customer_email || o.email) + '</p>' +
                '<p><strong>Phone:</strong> ' + _esc(o.customer_phone || o.phone) + '</p>' +
                '<p><strong>Shipping Location:</strong> ' + _esc(o.location || o.shipping_location || 'N/A') + '</p>' +
                '<p><strong>Date:</strong> ' + date + '</p>' +
                '<p><strong>Total:</strong> ' + totalDisplay + '</p>' +
                '<p><strong>Status:</strong> ' + _esc(o.status || 'Pending') + '</p>' +
                '<p><strong>Payment Method:</strong> ' + _esc(o.payment_method || 'N/A') + '</p>' +
                '<p><strong>Transaction ID:</strong> ' + _esc(o.transaction_id || 'N/A') + '</p>' +
                '<hr style="border: 0; border-top: 1px solid #333; margin: 15px 0;">' +
                '<p><strong>Items Ordered:</strong></p>' +
                '<pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; font-family:monospace; font-size:12px; white-space:pre-wrap; border:1px solid #333;">' + _esc(itemsText) + '</pre>' +
                '<p><strong>Design Brief:</strong></p>' +
                '<pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; font-family:monospace; font-size:12px; white-space:pre-wrap; border:1px solid #333;">' + _esc(o.design_brief || 'None') + '</pre>' +
                '<div style="margin-top:20px; display:flex; gap:10px;">' +
                  '<button class="admin-btn admin-btn--primary" id="btn-complete-order">Mark Completed ✅</button>' +
                  '<button class="admin-btn admin-btn--outline" onclick="window.open(\'https://wa.me/' + _esc(o.customer_phone || o.phone || '').replace(/[^0-9]/g, '') + '\')">💬 WhatsApp Customer</button>' +
                '</div>' +
              '</div>';

            _openModal('Order #' + (o.order_number || o.id), detailsBody, function () {
              return true;
            }, 'Close');

            var completeBtn = document.getElementById('btn-complete-order');
            if (completeBtn) {
              completeBtn.addEventListener('click', function() {
                HBD.store.AdminStore.updateOrderStatus(o.orderId || o.id, 'Completed').then(function (res) {
                  if (res && res.success) {
                    _renderOrders();
                    document.getElementById('admin-modal-close').click();
                    HBD.components.showToast('Order marked completed! ✅', 'success');
                  } else {
                    HBD.components.showToast('Failed to update order status: ' + (res ? res.message : 'Unknown error'), 'error');
                  }
                });
              });
            }
          });
        }

        tbody.appendChild(tr);
      });
    });
  }


  // ════════════════════════════════════════════════════════════
  //  CUSTOMERS
  // ════════════════════════════════════════════════════════════
  function _renderCustomers() {
    var tbody = document.querySelector('#admin-table-customers tbody');
    if (!tbody) return;

    HBD.store.AdminStore.getUsers().then(function (users) {
      tbody.innerHTML = '';

      if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="admin-empty">No customers found.</td></tr>';
        return;
      }

      users.forEach(function (u) {
        var tr = document.createElement('tr');
        var date = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'N/A';
        
        tr.innerHTML =
          '<td class="admin-table__name">' + _esc(u.name || 'N/A') + '</td>' +
          '<td>' + _esc(u.email || 'N/A') + '</td>' +
          '<td>' + _esc(u.phone || 'N/A') + '</td>' +
          '<td>' + _esc(u.location || 'N/A') + '</td>' +
          '<td>' + date + '</td>';
        
        tbody.appendChild(tr);
      });
    });
  }


  // ════════════════════════════════════════════════════════════
  //  SERVICES
  // ════════════════════════════════════════════════════════════
  function _renderServices(filter) {
    var tbody = document.getElementById('services-tbody');
    if (!tbody) return;
    var services = HBD.data.services;
    if (filter) {
      var q = filter.toLowerCase();
      services = services.filter(function (s) {
        return s.name.toLowerCase().indexOf(q) !== -1 ||
               s.tier.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (services.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">No services found</td></tr>';
      return;
    }
    tbody.innerHTML = services.map(function (s) {
      var cat = HBD.data.getCategoryById(s.categoryId);
      return '<tr>' +
        '<td><div class="admin-table__name">' + _esc(s.name) + '</div>' +
             '<div class="admin-table__sub">' + _esc(s.id) + '</div></td>' +
        '<td>' + (cat ? (cat.icon + ' ' + _esc(cat.name)) : _esc(s.categoryId)) + '</td>' +
        '<td>' + _esc(s.tier) + '</td>' +
        '<td class="admin-table__price">' + _esc(s.priceDisplay || ('৳' + s.price)) + '</td>' +
        '<td>' + (s.popular
          ? '<span class="admin-table__badge admin-table__badge--popular">⭐ Popular</span>'
          : '<span style="color:rgba(255,255,255,0.25);font-size:0.75rem;">—</span>') + '</td>' +
        '<td class="admin-table__actions">' +
          '<button class="admin-btn admin-btn--sm admin-btn--outline" data-action="edit-service" data-id="' + s.id + '">✏️ Edit</button>' +
          '<button class="admin-btn admin-btn--sm admin-btn--danger" data-action="delete-service" data-id="' + s.id + '">🗑️</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    // Wire actions
    if (!tbody._wired) {
      tbody._wired = true;
      tbody.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');
        if (action === 'edit-service') _openServiceModal(id);
        if (action === 'delete-service') _deleteService(id);
      });
    }

    // Search wiring (only once)
    var searchEl = document.getElementById('services-search');
    if (searchEl && !searchEl._wired) {
      searchEl._wired = true;
      searchEl.addEventListener('input', function () {
        _renderServices(searchEl.value.trim());
      });
    }

    // Add service button
    var addBtn = document.getElementById('add-service-btn');
    if (addBtn && !addBtn._wired) {
      addBtn._wired = true;
      addBtn.addEventListener('click', function () { _openServiceModal(null); });
    }
  }

  function _openServiceModal(id) {
    var s = id ? HBD.data.getServiceById(id) : null;
    var cats = HBD.data.categories;
    var catOptions = cats.map(function (c) {
      return '<option value="' + c.id + '"' + (s && s.categoryId === c.id ? ' selected' : '') + '>' + c.icon + ' ' + c.name + '</option>';
    }).join('');

    var features = (s && s.features) ? s.features : [''];
    var featuresHTML = features.map(function (f, i) {
      return '<div class="admin-feature-row">' +
        '<input class="admin-input" type="text" value="' + _esc(f) + '" placeholder="Feature ' + (i+1) + '"/>' +
        '<button type="button" class="admin-btn admin-btn--sm admin-btn--danger admin-btn--icon" onclick="this.parentElement.remove()">✕</button>' +
      '</div>';
    }).join('');

    var imageBase64 = s ? s.image : '';

    var body =
      '<div class="admin-form-grid">' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Service Name *</label>' +
          '<input class="admin-input" id="svc-name" type="text" value="' + (s ? _esc(s.name) : '') + '" placeholder="e.g. Premium Lighter Case"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Category *</label>' +
          '<select class="admin-select" id="svc-cat">' + catOptions + '</select>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Tier *</label>' +
          '<input class="admin-input" id="svc-tier" type="text" value="' + (s ? _esc(s.tier) : '') + '" placeholder="Basic / Standard / Premium"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Price (BDT) *</label>' +
          '<input class="admin-input" id="svc-price" type="number" value="' + (s ? s.price : '') + '" placeholder="500"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Original Price (BDT)</label>' +
          '<input class="admin-input" id="svc-originalPrice" type="number" value="' + (s && s.originalPrice ? s.originalPrice : '') + '" placeholder="600"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Stock</label>' +
          '<input class="admin-input" id="svc-stock" type="number" value="' + (s && s.stock !== undefined ? s.stock : '') + '" placeholder="10"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Badge</label>' +
          '<input class="admin-input" id="svc-badge" type="text" value="' + (s && s.badge ? s.badge : '') + '" placeholder="e.g. Popular"/>' +
        '</div>' +
        '<div class="admin-form-group admin-form-group--full">' +
          '<label class="admin-label">Description *</label>' +
          '<textarea class="admin-textarea" id="svc-desc" placeholder="Describe this service…">' + (s ? _esc(s.description) : '') + '</textarea>' +
        '</div>' +
        '<div class="admin-form-group admin-form-group--full">' +
          '<label class="admin-label">Product Image</label>' +
          '<div class="admin-image-upload-wrapper" style="display:flex; gap:15px; align-items:center; margin-bottom: 8px;">' +
            '<div class="admin-image-preview" id="svc-image-preview" style="width: 80px; height: 60px; border-radius: 8px; border:1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2) no-repeat center; background-size: cover; display: flex; align-items: center; justify-content: center; font-size:12px; color: rgba(255,255,255,0.4); flex-shrink: 0;">' +
              (s && s.image ? '' : 'No Image') +
            '</div>' +
            '<div style="flex: 1;">' +
              '<input type="file" id="svc-image-file" accept="image/*" class="admin-file-input" style="display:none;" />' +
              '<button type="button" class="admin-btn admin-btn--outline" onclick="document.getElementById(\'svc-image-file\').click()">📸 Choose Local Photo</button>' +
              '<span style="display:block; font-size:10px; color:rgba(255,255,255,0.3); margin-top:5px;">Or paste a web link below:</span>' +
              '<input class="admin-input" id="svc-image-url" type="text" value="' + (s && s.image && !s.image.startsWith('data:') ? _esc(s.image) : '') + '" placeholder="https://example.com/image.jpg" style="margin-top:5px; font-size:12px; padding:8px 12px;" />' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="admin-form-group admin-form-group--full">' +
          '<label class="admin-label">Features</label>' +
          '<div class="admin-features-list" id="svc-features-list">' + featuresHTML + '</div>' +
          '<button type="button" class="admin-add-feature" id="svc-add-feat">+ Add feature</button>' +
        '</div>' +
        '<div class="admin-form-group admin-form-group--full">' +
          '<div class="admin-checkbox-group">' +
            '<input type="checkbox" id="svc-popular"' + (s && s.popular ? ' checked' : '') + '/>' +
            '<label for="svc-popular">Mark as Popular (shows badge on card)</label>' +
          '</div>' +
        '</div>' +
      '</div>';

    _openModal(s ? 'Edit Service' : 'Add New Service', body, function () {
      var name  = document.getElementById('svc-name').value.trim();
      var cat   = document.getElementById('svc-cat').value;
      var tier  = document.getElementById('svc-tier').value.trim();
      var price = parseFloat(document.getElementById('svc-price').value);
      var desc  = document.getElementById('svc-desc').value.trim();
      var originalPrice = parseInt(document.getElementById('svc-originalPrice').value);
      var stock = document.getElementById('svc-stock').value;
      var badge = document.getElementById('svc-badge').value.trim();
      var pop   = document.getElementById('svc-popular').checked;
      var imageUrl = document.getElementById('svc-image-url').value.trim();
      var featInputs = document.querySelectorAll('#svc-features-list .admin-input');
      var feats = Array.from(featInputs).map(function (el) { return el.value.trim(); }).filter(Boolean);

      if (!name || !cat || !tier || isNaN(price)) {
        _showFeedback('admin-modal-body', 'Please fill in all required fields.', 'error');
        return false;
      }

      var finalImage = imageUrl || imageBase64 || '';

      var services = HBD.data.services.slice();
      var newSvc = {
        id:          id || (cat + '-' + Date.now()),
        categoryId:  cat,
        name:        name,
        tier:        tier,
        price:       price,
        priceDisplay:'৳' + price.toLocaleString('en-IN'),
        description: desc,
        features:    feats,
        popular:     pop,
        image:       finalImage,
        originalPrice: isNaN(originalPrice) ? null : originalPrice,
        stock:       stock !== '' ? parseInt(stock) : null,
        badge:       badge || null
      };

      if (id) {
        // Replace existing
        var idx = services.findIndex(function (sv) { return sv.id === id; });
        if (idx !== -1) services[idx] = newSvc;
      } else {
        services.push(newSvc);
      }

      HBD.store.AdminStore.saveServices(services).then(function (res) {
        if (res && res.success) {
          _renderServices();
          HBD.components.showToast((id ? 'Service updated!' : 'Service added!') + ' 🎉', 'success');
          document.getElementById('admin-modal-close').click();
        } else {
          HBD.components.showToast('Failed to save service: ' + (res ? res.message : 'Unknown error'), 'error');
        }
      });
      return false; // prevent synchronous close
    });

    // Wire uploader, preview, and "add feature" button
    setTimeout(function () {
      var fileInput = document.getElementById('svc-image-file');
      var preview = document.getElementById('svc-image-preview');
      var urlInput = document.getElementById('svc-image-url');

      if (s && s.image) {
        preview.style.backgroundImage = 'url(' + s.image + ')';
        preview.textContent = '';
      }

      if (fileInput && preview) {
        fileInput.addEventListener('change', function () {
          var file = fileInput.files[0];
          if (!file) return;

          if (file.size > 1.5 * 1024 * 1024) {
            alert('File is too large! Please choose an image smaller than 1.5 MB.');
            return;
          }
          if (file.size > 500 * 1024) {
            HBD.components.showToast('Warning: Large image files can quickly fill up your 5MB browser storage. We recommend using smaller, compressed images or pasting a web image link. ⚠️', 'info');
          }

          var reader = new FileReader();
          reader.onload = function (e) {
            imageBase64 = e.target.result;
            preview.textContent = '';
            preview.style.backgroundImage = 'url(' + imageBase64 + ')';
            if (urlInput) urlInput.value = ''; // clear url input if file uploaded
          };
          reader.readAsDataURL(file);
        });
      }

      var addFeat = document.getElementById('svc-add-feat');
      if (addFeat) {
        addFeat.addEventListener('click', function () {
          var list = document.getElementById('svc-features-list');
          var row = document.createElement('div');
          row.className = 'admin-feature-row';
          row.innerHTML = '<input class="admin-input" type="text" placeholder="New feature"/>' +
            '<button type="button" class="admin-btn admin-btn--sm admin-btn--danger admin-btn--icon" onclick="this.parentElement.remove()">✕</button>';
          list.appendChild(row);
        });
      }
    }, 50);
  }

  function _deleteService(id) {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    var services = HBD.data.services.filter(function (s) { return s.id !== id; });
    HBD.store.AdminStore.saveServices(services).then(function (res) {
      if (res && res.success) {
        _renderServices();
        HBD.components.showToast('Service deleted.', 'info');
      } else {
        HBD.components.showToast('Failed to delete service: ' + (res ? res.message : 'Unknown error'), 'error');
      }
    });
  }


  // ════════════════════════════════════════════════════════════
  //  CATEGORIES
  // ════════════════════════════════════════════════════════════
  function _renderCategories() {
    var tbody = document.getElementById('categories-tbody');
    if (!tbody) return;
    var cats = HBD.data.categories;
    tbody.innerHTML = cats.map(function (c) {
      return '<tr>' +
        '<td style="font-size:1.5rem">' + c.icon + '</td>' +
        '<td class="admin-table__name">' + _esc(c.name) + '</td>' +
        '<td><code style="font-size:0.75rem;color:rgba(255,255,255,0.4)">' + _esc(c.id) + '</code></td>' +
        '<td style="max-width:220px;font-size:0.8rem;color:rgba(255,255,255,0.5)">' + _esc(c.description) + '</td>' +
        '<td><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:' + _esc(c.color) + ';vertical-align:middle"></span></td>' +
        '<td class="admin-table__actions">' +
          '<button class="admin-btn admin-btn--sm admin-btn--outline" data-action="edit-cat" data-id="' + c.id + '">✏️ Edit</button>' +
          '<button class="admin-btn admin-btn--sm admin-btn--danger" data-action="delete-cat" data-id="' + c.id + '">🗑️</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    if (!tbody._wired) {
      tbody._wired = true;
      tbody.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');
        if (action === 'edit-cat') _openCategoryModal(id);
        if (action === 'delete-cat') _deleteCategory(id);
      });
    }

    var addBtn = document.getElementById('add-category-btn');
    if (addBtn && !addBtn._wired) {
      addBtn._wired = true;
      addBtn.addEventListener('click', function () { _openCategoryModal(null); });
    }
  }

  function _openCategoryModal(id) {
    var c = id ? HBD.data.getCategoryById(id) : null;
    var body =
      '<div class="admin-form-grid">' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Name *</label>' +
          '<input class="admin-input" id="cat-name" type="text" value="' + (c ? _esc(c.name) : '') + '" placeholder="e.g. Digital Art"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Icon (emoji) *</label>' +
          '<input class="admin-input" id="cat-icon" type="text" value="' + (c ? _esc(c.icon) : '') + '" placeholder="🎨" style="font-size:1.2rem"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Accent Colour</label>' +
          '<input class="admin-input" id="cat-color" type="color" value="' + (c ? c.color : '#f4a8c7') + '" style="height:42px;cursor:pointer;padding:4px"/>' +
        '</div>' +
        (c ? '' :
        '<div class="admin-form-group">' +
          '<label class="admin-label">ID (URL slug) *</label>' +
          '<input class="admin-input" id="cat-id" type="text" value="" placeholder="e.g. digital-art"/>' +
        '</div>') +
        '<div class="admin-form-group admin-form-group--full">' +
          '<label class="admin-label">Description</label>' +
          '<textarea class="admin-textarea" id="cat-desc">' + (c ? _esc(c.description) : '') + '</textarea>' +
        '</div>' +
      '</div>';

    _openModal(c ? 'Edit Category' : 'Add Category', body, function () {
      var name  = document.getElementById('cat-name').value.trim();
      var icon  = document.getElementById('cat-icon').value.trim();
      var color = document.getElementById('cat-color').value;
      var desc  = document.getElementById('cat-desc').value.trim();
      var catId = id || (document.getElementById('cat-id') ? document.getElementById('cat-id').value.trim() : '');
      if (!name || !icon || !catId) {
        _showFeedback('admin-modal-body', 'Name, icon, and ID are required.', 'error');
        return false;
      }
      var cats = HBD.data.categories.slice();
      var newCat = { id: catId, name: name, icon: icon, color: color, description: desc };
      if (id) {
        var idx = cats.findIndex(function (x) { return x.id === id; });
        if (idx !== -1) cats[idx] = newCat;
      } else {
        cats.push(newCat);
      }
      HBD.store.AdminStore.saveCategories(cats).then(function (res) {
        if (res && res.success) {
          _renderCategories();
          HBD.components.showToast('Category saved! 📂', 'success');
          document.getElementById('admin-modal-close').click();
        } else {
          HBD.components.showToast('Failed to save category: ' + (res ? res.message : 'Unknown error'), 'error');
        }
      });
      return false; // prevent synchronous close
    });
  }

  function _deleteCategory(id) {
    if (!confirm('Delete category "' + id + '"? Services in this category will not be deleted but will become uncategorised.')) return;
    var cats = HBD.data.categories.filter(function (c) { return c.id !== id; });
    HBD.store.AdminStore.saveCategories(cats).then(function (res) {
      if (res && res.success) {
        _renderCategories();
        HBD.components.showToast('Category deleted.', 'info');
      } else {
        HBD.components.showToast('Failed to delete category: ' + (res ? res.message : 'Unknown error'), 'error');
      }
    });
  }


  // ════════════════════════════════════════════════════════════
  //  REVIEWS
  // ════════════════════════════════════════════════════════════
  function _renderReviews(filter) {
    var grid = document.getElementById('reviews-grid');
    if (!grid) return;
    var reviews = HBD.data.reviews;
    if (filter) {
      var q = filter.toLowerCase();
      reviews = reviews.filter(function (r) {
        var authorName = r.userName || r.author || r.name || '';
        var textContent = r.text || r.comment || '';
        return authorName.toLowerCase().indexOf(q) !== -1 ||
               textContent.toLowerCase().indexOf(q) !== -1;
      });
    }

    grid.innerHTML = reviews.map(function (r) {
      var isHidden = r.hidden;
      var name = r.userName || r.author || r.name || 'Anonymous';
      
      // Generate avatar background gradient based on name hash
      var hash = 0;
      for (var i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      var h = Math.abs(hash % 360);
      var avatarStyle = 'background: linear-gradient(135deg, hsl(' + h + ', 75%, 65%) 0%, hsl(' + ((h + 40) % 360) + ', 75%, 50%) 100%);';
      var initial = name.charAt(0).toUpperCase();

      // Render gold stars
      var starsHTML = '';
      var rating = r.rating || 5;
      for (var s = 1; s <= 5; s++) {
        if (s <= rating) {
          starsHTML += '<span class="admin-review-card__star admin-review-card__star--full">★</span>';
        } else {
          starsHTML += '<span class="admin-review-card__star admin-review-card__star--empty">★</span>';
        }
      }

      // Fetch service info
      var svc = HBD.data.getServiceById(r.serviceId);
      var svcLabel = svc ? svc.name + ' (' + svc.tier + ')' : 'General / Feedback';

      return '<div class="admin-review-card' + (isHidden ? ' is-hidden' : '') + '" data-id="' + r.id + '">' +
        '<div class="admin-review-card__header">' +
          '<div class="admin-review-card__avatar" style="' + avatarStyle + '">' + initial + '</div>' +
          '<div class="admin-review-card__info">' +
            '<div class="admin-review-card__name">' + _esc(name) + '</div>' +
            '<div class="admin-review-card__meta">' + starsHTML + ' · ' + _esc(r.date || '') + '</div>' +
          '</div>' +
          '<span class="admin-table__badge ' + (isHidden ? 'admin-table__badge--hidden' : 'admin-table__badge--visible') + '">' +
            (isHidden ? '🙈 Hidden' : '✅ Visible') +
          '</span>' +
        '</div>' +
        '<div class="admin-review-card__product-badge">🏷️ ' + _esc(svcLabel) + '</div>' +
        '<p class="admin-review-card__text">' + _esc(r.text || r.comment || '') + '</p>' +
        '<div class="admin-review-card__actions">' +
          '<button class="admin-btn admin-btn--sm admin-btn--outline" data-action="toggle-review" data-id="' + r.id + '">' +
            (isHidden ? '👁️ Show' : '🙈 Hide') + '</button>' +
          '<button class="admin-btn admin-btn--sm admin-btn--outline" data-action="edit-review" data-id="' + r.id + '">✏️ Edit</button>' +
          '<button class="admin-btn admin-btn--sm admin-btn--danger" data-action="delete-review" data-id="' + r.id + '">🗑️</button>' +
        '</div>' +
      '</div>';
    }).join('') || '<div class="admin-empty">No reviews found.</div>';

    if (!grid._wired) {
      grid._wired = true;
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');
        if (action === 'toggle-review') _toggleReview(id);
        if (action === 'delete-review') _deleteReview(id);
        if (action === 'edit-review') _openReviewModal(id);
      });
    }

    // Add review button
    var addReviewBtn = document.getElementById('add-review-btn');
    if (addReviewBtn && !addReviewBtn._wired) {
      addReviewBtn._wired = true;
      addReviewBtn.addEventListener('click', function () { _openReviewModal(null); });
    }

    // Search wiring
    var searchEl = document.getElementById('reviews-search');
    if (searchEl && !searchEl._wired) {
      searchEl._wired = true;
      searchEl.addEventListener('input', function () { _renderReviews(searchEl.value.trim()); });
    }
  }

  function _toggleReview(id) {
    var reviews = HBD.data.reviews.map(function (r) {
      return r.id === id ? Object.assign({}, r, { hidden: !r.hidden }) : r;
    });
    HBD.store.AdminStore.saveReviews(reviews).then(function (res) {
      if (res && res.success) {
        _renderReviews();
      } else {
        HBD.components.showToast('Failed to toggle review: ' + (res ? res.message : 'Unknown error'), 'error');
      }
    });
  }

  function _deleteReview(id) {
    if (!confirm('Permanently delete this review?')) return;
    var reviews = HBD.data.reviews.filter(function (r) { return r.id !== id; });
    HBD.store.AdminStore.saveReviews(reviews).then(function (res) {
      if (res && res.success) {
        _renderReviews();
        HBD.components.showToast('Review deleted.', 'info');
      } else {
        HBD.components.showToast('Failed to delete review: ' + (res ? res.message : 'Unknown error'), 'error');
      }
    });
  }

  function _openReviewModal(id) {
    var r = id ? HBD.data.reviews.find(function (rev) { return rev.id === id; }) : null;
    var services = HBD.data.services;
    var serviceOptions = services.map(function (s) {
      return '<option value="' + s.id + '"' + (r && r.serviceId === s.id ? ' selected' : '') + '>' + _esc(s.name) + ' (' + _esc(s.tier) + ')</option>';
    }).join('');
    serviceOptions = '<option value="general">General / Feedback</option>' + serviceOptions;

    var ratingOptions = [5, 4, 3, 2, 1].map(function (stars) {
      return '<option value="' + stars + '"' + (r && r.rating === stars ? ' selected' : (stars === 5 ? ' selected' : '')) + '>' + '★'.repeat(stars) + ' (' + stars + ' Stars)</option>';
    }).join('');

    var defaultDate = r ? r.date : new Date().toISOString().split('T')[0];

    var body =
      '<div class="admin-form-grid">' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Customer Name *</label>' +
          '<input class="admin-input" id="rev-name" type="text" value="' + (r ? _esc(r.userName || r.author || r.name) : '') + '" placeholder="e.g. Rafsan Ahmed"/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Product / Service *</label>' +
          '<select class="admin-select" id="rev-serviceId">' + serviceOptions + '</select>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Rating *</label>' +
          '<select class="admin-select" id="rev-rating">' + ratingOptions + '</select>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Date *</label>' +
          '<input class="admin-input" id="rev-date" type="date" value="' + defaultDate + '" />' +
        '</div>' +
        '<div class="admin-form-group admin-form-group--full">' +
          '<label class="admin-label">Review Comment *</label>' +
          '<textarea class="admin-textarea" id="rev-text" placeholder="Describe the customer\'s review comment…">' + (r ? _esc(r.text || r.comment) : '') + '</textarea>' +
        '</div>' +
      '</div>';

    _openModal(r ? 'Edit Review' : 'Add Custom Review', body, function () {
      var name = document.getElementById('rev-name').value.trim();
      var svcId = document.getElementById('rev-serviceId').value;
      var rating = parseInt(document.getElementById('rev-rating').value);
      var date = document.getElementById('rev-date').value;
      var text = document.getElementById('rev-text').value.trim();

      if (!name || !date || !text || isNaN(rating)) {
        _showFeedback('admin-modal-body', 'Please fill in all required fields.', 'error');
        return false;
      }

      var reviews = HBD.data.reviews.slice();
      var newRev = {
        id: id || ('r-' + Date.now()),
        serviceId: svcId,
        userName: name,
        rating: rating,
        text: text,
        date: date,
        hidden: r ? !!r.hidden : false
      };

      if (id) {
        var idx = reviews.findIndex(function (x) { return x.id === id; });
        if (idx !== -1) reviews[idx] = newRev;
      } else {
        reviews.push(newRev);
      }

      HBD.store.AdminStore.saveReviews(reviews).then(function (res) {
        if (res && res.success) {
          _renderReviews();
          HBD.components.showToast(id ? 'Review updated! ✏️' : 'Review added! ⭐', 'success');
          document.getElementById('admin-modal-close').click();
        } else {
          HBD.components.showToast('Failed to save review: ' + (res ? res.message : 'Unknown error'), 'error');
        }
      });
      return false; // prevent synchronous close
    });
  }


  // ════════════════════════════════════════════════════════════
  //  RECOMMENDED
  // ════════════════════════════════════════════════════════════
  function _renderRecommended() {
    var list = document.getElementById('recommended-list');
    if (!list) return;
    var currentIds = HBD.data.recommendedIds;
    var services = HBD.data.services;

    list.innerHTML = services.map(function (s) {
      var isActive = currentIds.indexOf(s.id) !== -1;
      var cat = HBD.data.getCategoryById(s.categoryId);
      return '<div class="admin-recommended-item' + (isActive ? ' is-active' : '') + '">' +
        '<input type="checkbox" id="rec-' + s.id + '" value="' + s.id + '"' + (isActive ? ' checked' : '') + '/>' +
        '<label for="rec-' + s.id + '" class="admin-recommended-item__name">' + _esc(s.name) + ' <span style="color:rgba(255,255,255,0.4);font-size:0.75rem;">— ' + _esc(s.tier) + '</span></label>' +
        '<span class="admin-recommended-item__cat">' + (cat ? cat.icon + ' ' + cat.name : '') + '</span>' +
      '</div>';
    }).join('');

    // Highlight on check change
    list.addEventListener('change', function (e) {
      var item = e.target.closest('.admin-recommended-item');
      if (item) item.classList.toggle('is-active', e.target.checked);
    });

    var saveBtn = document.getElementById('save-recommended-btn');
    if (saveBtn && !saveBtn._wired) {
      saveBtn._wired = true;
      saveBtn.addEventListener('click', function () {
        var checked = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'))
          .map(function (el) { return el.value; });
        if (checked.length > 6) {
          HBD.components.showToast('Maximum 6 recommended items!', 'error');
          return;
        }
        HBD.store.AdminStore.saveRecommended(checked).then(function (res) {
          if (res && res.success) {
            HBD.components.showToast('Recommended updated! 🏆', 'success');
          } else {
            HBD.components.showToast('Failed to save recommended items: ' + (res ? res.message : 'Unknown error'), 'error');
          }
        });
      });
    }
  }


  // ════════════════════════════════════════════════════════════
  //  PROMO CODES
  // ════════════════════════════════════════════════════════════
  function _renderCodes() {
    var grid = document.getElementById('codes-grid');
    if (!grid) return;
    var codes = HBD.data.referralCodes;

    var html = '';
    for (var code in codes) {
      if (!codes.hasOwnProperty(code)) continue;
      var info = codes[code];
      html +=
        '<div class="admin-code-card">' +
          '<div class="admin-code-card__code">' + _esc(code) + '</div>' +
          '<div class="admin-code-card__discount">' + info.discount + '% OFF</div>' +
          '<div class="admin-code-card__desc">' + _esc(info.description) + '</div>' +
          '<div class="admin-code-card__actions">' +
            '<button class="admin-btn admin-btn--sm admin-btn--outline" data-action="edit-code" data-code="' + code + '">✏️ Edit</button>' +
            '<button class="admin-btn admin-btn--sm admin-btn--danger" data-action="delete-code" data-code="' + code + '">🗑️ Delete</button>' +
          '</div>' +
        '</div>';
    }
    if (!html) html = '<div class="admin-empty">No promo codes. Add one!</div>';
    grid.innerHTML = html;

    if (!grid._wired) {
      grid._wired = true;
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        if (action === 'edit-code')   _openCodeModal(btn.getAttribute('data-code'));
        if (action === 'delete-code') _deleteCode(btn.getAttribute('data-code'));
      });
    }

    var addBtn = document.getElementById('add-code-btn');
    if (addBtn && !addBtn._wired) {
      addBtn._wired = true;
      addBtn.addEventListener('click', function () { _openCodeModal(null); });
    }
  }

  function _openCodeModal(existingCode) {
    var codes = HBD.data.referralCodes;
    var info = existingCode ? codes[existingCode] : null;
    var body =
      '<div class="admin-form-grid">' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Code *</label>' +
          '<input class="admin-input" id="code-key" type="text" value="' + (existingCode ? _esc(existingCode) : '') + '" placeholder="e.g. SAVE20"' + (existingCode ? ' readonly style="opacity:0.5"' : '') + '/>' +
        '</div>' +
        '<div class="admin-form-group">' +
          '<label class="admin-label">Discount % *</label>' +
          '<input class="admin-input" id="code-discount" type="number" min="1" max="100" value="' + (info ? info.discount : '') + '" placeholder="20"/>' +
        '</div>' +
        '<div class="admin-form-group admin-form-group--full">' +
          '<label class="admin-label">Description</label>' +
          '<input class="admin-input" id="code-desc" type="text" value="' + (info ? _esc(info.description) : '') + '" placeholder="e.g. 20% off for new customers"/>' +
        '</div>' +
      '</div>';

    _openModal(existingCode ? 'Edit Code' : 'Add Promo Code', body, function () {
      var key      = existingCode || document.getElementById('code-key').value.trim().toUpperCase();
      var discount = parseFloat(document.getElementById('code-discount').value);
      var desc     = document.getElementById('code-desc').value.trim();
      if (!key || isNaN(discount) || discount < 1 || discount > 100) {
        _showFeedback('admin-modal-body', 'Code and a valid discount % are required.', 'error');
        return false;
      }
      var newCodes = Object.assign({}, codes);
      newCodes[key] = { discount: discount, description: desc || (discount + '% discount') };
      HBD.store.AdminStore.saveReferralCodes(newCodes).then(function (res) {
        if (res && res.success) {
          _renderCodes();
          HBD.components.showToast('Promo code saved! 🎟️', 'success');
          document.getElementById('admin-modal-close').click();
        } else {
          HBD.components.showToast('Failed to save promo code: ' + (res ? res.message : 'Unknown error'), 'error');
        }
      });
      return false; // prevent synchronous close
    });
  }

  function _deleteCode(code) {
    if (!confirm('Delete promo code "' + code + '"?')) return;
    var codes = Object.assign({}, HBD.data.referralCodes);
    delete codes[code];
    HBD.store.AdminStore.saveReferralCodes(codes).then(function (res) {
      if (res && res.success) {
        _renderCodes();
        HBD.components.showToast('Code deleted.', 'info');
      } else {
        HBD.components.showToast('Failed to delete code: ' + (res ? res.message : 'Unknown error'), 'error');
      }
    });
  }


  // ════════════════════════════════════════════════════════════
  //  SETTINGS
  // ════════════════════════════════════════════════════════════
  function _renderSettings() {
    // Stats
    var statsGrid = document.getElementById('admin-stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = [
        { label: 'Services',    value: HBD.data.services.length },
        { label: 'Categories',  value: HBD.data.categories.length },
        { label: 'Reviews',     value: HBD.data.reviews.length },
        { label: 'Promo Codes', value: Object.keys(HBD.data.referralCodes).length }
      ].map(function (s) {
        return '<div class="admin-stat-card">' +
          '<div class="admin-stat-card__label">' + s.label + '</div>' +
          '<div class="admin-stat-card__value">' + s.value + '</div>' +
        '</div>';
      }).join('');
    }

    // Export
    var exportBtn = document.getElementById('export-btn');
    if (exportBtn && !exportBtn._wired) {
      exportBtn._wired = true;
      exportBtn.addEventListener('click', function () {
        HBD.store.AdminStore.exportJSON().then(function (json) {
          var blob = new Blob([json], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'hbd-admin-backup-' + new Date().toISOString().slice(0,10) + '.json';
          a.click();
          URL.revokeObjectURL(url);
          HBD.components.showToast('Backup downloaded! 📤', 'success');
        });
      });
    }

    // Import
    var importBtn = document.getElementById('import-btn');
    if (importBtn && !importBtn._wired) {
      importBtn._wired = true;
      importBtn.addEventListener('click', function () {
        var json = document.getElementById('import-textarea').value.trim();
        if (!json) { HBD.components.showToast('Paste JSON first!', 'error'); return; }
        if (!confirm('Import this data? It will overwrite your current settings.')) return;
        HBD.store.AdminStore.importJSON(json).then(function (ok) {
          if (ok) {
            HBD.components.showToast('Import successful! 📥 Reloading…', 'success');
            setTimeout(function () { window.location.reload(); }, 1000);
          } else {
            HBD.components.showToast('Invalid JSON or server error. Please check the file.', 'error');
          }
        });
      });
    }

    // Reset
    var resetBtn = document.getElementById('reset-btn');
    if (resetBtn && !resetBtn._wired) {
      resetBtn._wired = true;
      resetBtn.addEventListener('click', function () {
        if (!confirm('⚠️ Reset EVERYTHING back to defaults? All your edits will be gone.')) return;
        HBD.store.AdminStore.reset().then(function () {
          HBD.components.showToast('Reset to defaults! Reloading…', 'info');
          setTimeout(function () { window.location.reload(); }, 800);
        });
      });
    }
  }


  // ════════════════════════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════════════════════════
  function _esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function _showFeedback(containerId, msg, type) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var existing = container.querySelector('.admin-feedback');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'admin-feedback admin-feedback--' + (type || 'error');
    el.textContent = (type === 'error' ? '⚠️ ' : '✅ ') + msg;
    container.prepend(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 4000);
  }

})();
