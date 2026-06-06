/**
 * ============================================================
 *  HameemBhai er Dokan — Store Module
 *  State management with localStorage persistence
 *  Namespace: window.HBD.store
 *  Depends on: HBD.data, HBD.utils
 * ============================================================
 */
(function () {
  'use strict';

  window.HBD = window.HBD || {};

  // ────────────────────────────────────────────────────────────
  //  STORAGE KEYS
  // ────────────────────────────────────────────────────────────
  var KEYS = {
    CART:     'hbd_cart',
    USER:     'hbd_user',
    WISHLIST: 'hbd_wishlist',
    PROMO:    'hbd_promo',
    ORDERS:   'hbd_orders',
    USERS:    'hbd_users_db'
  };

  // ────────────────────────────────────────────────────────────
  //  localStorage helpers (safe wrappers)
  // ────────────────────────────────────────────────────────────
  function _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("[HBD Store] Storage save failed for key '" + key + "':", e);
      return false;
    }
  }

  function _load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function _remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* noop */ }
  }


  // ================================================================
  //  EVENT BUS — lightweight pub/sub for cross-component comms
  // ================================================================
  var EventBus = (function () {
    var _listeners = {};

    /**
     * Subscribe to an event.
     * @param {string}   event    Event name (e.g. 'cart:changed')
     * @param {Function} callback Handler
     * @returns {Function} Unsubscribe function
     */
    function on(event, callback) {
      if (!_listeners[event]) _listeners[event] = [];
      _listeners[event].push(callback);
      // Return an unsubscribe function for convenience
      return function off() {
        _listeners[event] = _listeners[event].filter(function (cb) {
          return cb !== callback;
        });
      };
    }

    /**
     * Emit an event with optional data payload.
     * @param {string} event Event name
     * @param {*}      data  Payload
     */
    function emit(event, data) {
      var cbs = _listeners[event];
      if (!cbs) return;
      for (var i = 0; i < cbs.length; i++) {
        try { cbs[i](data); } catch (e) { console.error('[HBD EventBus]', event, e); }
      }
    }

    return { on: on, emit: emit };
  })();


  // ================================================================
  //  CART STORE
  // ================================================================
  var CartStore = (function () {
    // Cart items: [{ itemId, serviceId, tier, qty, addedAt }]
    var _items = _load(KEYS.CART, []);
    var _promo = _load(KEYS.PROMO, null); // { code, discount }

    function _persist() {
      _save(KEYS.CART, _items);
      _save(KEYS.PROMO, _promo);
      EventBus.emit('cart:changed', { items: _items, total: getTotal(), count: getCount() });
    }

    /**
     * Add a service to the cart.
     * If the same service+tier already exists, increments qty.
     * @param {string} serviceId
     * @param {string} tier
     * @returns {object} The cart item added/updated
     */
    function add(serviceId, tier) {
      // Check if already in cart
      for (var i = 0; i < _items.length; i++) {
        if (_items[i].serviceId === serviceId) {
          _items[i].qty += 1;
          _persist();
          return _items[i];
        }
      }

      var item = {
        itemId: HBD.utils.generateId(),
        serviceId: serviceId,
        tier: tier || '',
        qty: 1,
        addedAt: new Date().toISOString()
      };
      _items.push(item);
      _persist();
      return item;
    }

    /**
     * Remove an item from the cart by itemId.
     */
    function remove(itemId) {
      _items = _items.filter(function (it) { return it.itemId !== itemId; });
      _persist();
    }

    /**
     * Update quantity; removes if qty <= 0.
     */
    function updateQty(itemId, qty) {
      for (var i = 0; i < _items.length; i++) {
        if (_items[i].itemId === itemId) {
          if (qty <= 0) {
            _items.splice(i, 1);
          } else {
            _items[i].qty = qty;
          }
          _persist();
          return;
        }
      }
    }

    /**
     * Get all cart items (enriched with service data).
     */
    function getItems() {
      return _items.map(function (item) {
        var service = HBD.data.getServiceById(item.serviceId);
        return {
          itemId: item.itemId,
          serviceId: item.serviceId,
          tier: item.tier,
          qty: item.qty,
          addedAt: item.addedAt,
          service: service,
          lineTotal: service ? service.price * item.qty : 0
        };
      });
    }

    /**
     * Get subtotal before discounts.
     */
    function getSubtotal() {
      return getItems().reduce(function (sum, item) { return sum + item.lineTotal; }, 0);
    }

    /**
     * Get total with discounts applied (promo + returning customer).
     * Returns { subtotal, promoDiscount, returningDiscount, total, promoCode }
     */
    function getTotal() {
      var subtotal = getSubtotal();
      var promoDiscount = 0;
      var returningDiscount = 0;
      var deliveryFee = hasPhysicalItems() ? 150 : 0;

      // Promo code discount
      if (_promo && _promo.discount) {
        promoDiscount = Math.round(subtotal * (_promo.discount / 100));
      }

      // Returning customer: extra 10% on remaining
      var afterPromo = subtotal - promoDiscount;
      if (UserStore.isReturning()) {
        returningDiscount = Math.round(afterPromo * 0.10);
      }

      var total = Math.max(0, afterPromo - returningDiscount) + deliveryFee;

      return {
        subtotal: subtotal,
        promoDiscount: promoDiscount,
        returningDiscount: returningDiscount,
        deliveryFee: deliveryFee,
        total: total,
        promoCode: _promo ? _promo.code : null
      };
    }

    function hasPhysicalItems() {
      for (var i = 0; i < _items.length; i++) {
        var service = HBD.data.getServiceById(_items[i].serviceId);
        if (service && service.categoryId === 'lighter-cases') {
          return true;
        }
      }
      return false;
    }

    function hasDigitalItems() {
      for (var i = 0; i < _items.length; i++) {
        var service = HBD.data.getServiceById(_items[i].serviceId);
        if (service && service.categoryId !== 'lighter-cases') {
          return true;
        }
      }
      return false;
    }

    /**
     * Get number of items in cart (sum of quantities).
     */
    function getCount() {
      return _items.reduce(function (sum, it) { return sum + it.qty; }, 0);
    }

    /**
     * Apply a promo/referral code.
     * @returns {{ success: boolean, message: string }}
     */
    function applyPromo(code) {
      if (!code) return { success: false, message: 'Please enter a promo code.' };

      var upperCode = code.toUpperCase().trim();
      var ref = HBD.data.referralCodes[upperCode];

      if (!ref) {
        return { success: false, message: 'Invalid promo code. Please try again.' };
      }

      _promo = { code: upperCode, discount: ref.discount };
      _persist();
      return { success: true, message: ref.description + ' applied!' };
    }

    /**
     * Remove currently applied promo code.
     */
    function removePromo() {
      _promo = null;
      _persist();
    }

    /**
     * Clear the entire cart.
     */
    function clear() {
      _items = [];
      _promo = null;
      _save(KEYS.CART, []);
      _remove(KEYS.PROMO);
      EventBus.emit('cart:changed', { items: [], total: getTotal(), count: 0 });
    }

    return {
      add: add,
      remove: remove,
      updateQty: updateQty,
      getItems: getItems,
      getSubtotal: getSubtotal,
      getTotal: getTotal,
      getCount: getCount,
      applyPromo: applyPromo,
      removePromo: removePromo,
      clear: clear,
      hasPhysicalItems: hasPhysicalItems,
      hasDigitalItems: hasDigitalItems
    };
  })();


  // ================================================================
  //  USER STORE
  // ================================================================
  var UserStore = (function () {
    var _user = _load(KEYS.USER, null);
    var TOKEN_KEY = 'hbd_auth_token';

    function _getToken() {
      try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
    }

    function _setToken(tok) {
      try {
        if (tok) localStorage.setItem(TOKEN_KEY, tok);
        else localStorage.removeItem(TOKEN_KEY);
      } catch (e) {}
    }

    function _headers() {
      return {
        'Content-Type': 'application/json',
        'Authorization': _getToken()
      };
    }

    function _persist() {
      if (_user) {
        _save(KEYS.USER, _user);
      } else {
        _remove(KEYS.USER);
      }
      EventBus.emit('user:changed', _user);
    }

    function register(data) {
      return fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success) {
          _user = res.user;
          _setToken(res.token);
          _persist();
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function login(email, password) {
      return fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success) {
          _user = res.user;
          _setToken(res.token);
          _persist();
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function logout() {
      var tok = _getToken();
      if (tok) {
        fetch('/api/auth/logout', { method: 'POST', headers: _headers() })
          .catch(function () {});
      }
      _user = null;
      _setToken('');
      _persist();
    }

    function getCurrentUser() {
      return _user;
    }

    function isLoggedIn() {
      return _user !== null;
    }

    function isReturning() {
      return _user !== null && _user.orderCount > 0;
    }

    function incrementOrders() {
      if (!_user) return;
      _user.orderCount = (_user.orderCount || 0) + 1;
      _persist();
    }

    function updateProfile(fields) {
      return fetch('/api/auth/profile', {
        method: 'PUT',
        headers: _headers(),
        body: JSON.stringify(fields)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success) {
          _user = res.user;
          _persist();
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    return {
      register: register,
      login: login,
      logout: logout,
      getCurrentUser: getCurrentUser,
      isLoggedIn: isLoggedIn,
      isReturning: isReturning,
      incrementOrders: incrementOrders,
      updateProfile: updateProfile,
      _headers: _headers
    };
  })();


  // ================================================================
  //  WISHLIST STORE
  // ================================================================
  var WishlistStore = (function () {
    var _ids = _load(KEYS.WISHLIST, []); // array of serviceId strings

    function _persist() {
      _save(KEYS.WISHLIST, _ids);
      EventBus.emit('wishlist:changed', _ids);
    }

    /**
     * Add a service to the wishlist.
     */
    function add(serviceId) {
      if (_ids.indexOf(serviceId) === -1) {
        _ids.push(serviceId);
        _persist();
      }
    }

    /**
     * Remove a service from the wishlist.
     */
    function remove(serviceId) {
      var idx = _ids.indexOf(serviceId);
      if (idx !== -1) {
        _ids.splice(idx, 1);
        _persist();
      }
    }

    /**
     * Toggle wishlist membership — returns new state (true = now wishlisted).
     */
    function toggle(serviceId) {
      if (has(serviceId)) {
        remove(serviceId);
        return false;
      } else {
        add(serviceId);
        return true;
      }
    }

    /**
     * Get all wishlisted service objects.
     */
    function getAll() {
      return _ids.map(function (id) { return HBD.data.getServiceById(id); }).filter(Boolean);
    }

    /**
     * Get raw array of wishlisted service IDs.
     */
    function getIds() {
      return _ids.slice(); // return copy
    }

    /**
     * Check if a service is wishlisted.
     */
    function has(serviceId) {
      return _ids.indexOf(serviceId) !== -1;
    }

    /**
     * Get count of wishlisted items.
     */
    function getCount() {
      return _ids.length;
    }

    /**
     * Clear entire wishlist.
     */
    function clear() {
      _ids = [];
      _persist();
    }

    return {
      add: add,
      remove: remove,
      toggle: toggle,
      getAll: getAll,
      getIds: getIds,
      has: has,
      getCount: getCount,
      clear: clear
    };
  })();


  // ================================================================
  //  ADMIN STORE — persist admin edits to localStorage
  // ================================================================
  var AdminStore = (function () {
    var KEY = 'hbd_admin_data';

    function _loadAll() {
      return _load(KEY, {});
    }

    function _saveAll(obj) {
      var success = _save(KEY, obj);
      if (success) {
        // Tell data module to re-merge
        if (window.HBD && window.HBD.data && window.HBD.data.reloadFromStorage) {
          window.HBD.data.reloadFromStorage();
        }
        EventBus.emit('data:changed', {});
        return true;
      }
      return false;
    }

    /** Returns true if the currently logged-in user is the admin */
    function isAdmin() {
      var user = UserStore.getCurrentUser();
      return !!(user && window.HBD.data && user.email === window.HBD.data.ADMIN_EMAIL);
    }

    function saveServices(arr) {
      return fetch('/api/admin/services', {
        method: 'POST',
        headers: UserStore._headers(),
        body: JSON.stringify(arr)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success && window.HBD.data.reloadFromStorage) {
          return window.HBD.data.reloadFromStorage().then(function () { return res; });
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function saveCategories(arr) {
      return Promise.resolve({ success: true }); // Categories are static
    }

    function saveReviews(arr) {
      return fetch('/api/admin/reviews', {
        method: 'POST',
        headers: UserStore._headers(),
        body: JSON.stringify(arr)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success && window.HBD.data.reloadFromStorage) {
          return window.HBD.data.reloadFromStorage().then(function () { return res; });
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function saveReferralCodes(obj) {
      return fetch('/api/admin/referrals', {
        method: 'POST',
        headers: UserStore._headers(),
        body: JSON.stringify(obj)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success && window.HBD.data.reloadFromStorage) {
          return window.HBD.data.reloadFromStorage().then(function () { return res; });
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function saveRecommended(arr) {
      return fetch('/api/admin/recommended', {
        method: 'POST',
        headers: UserStore._headers(),
        body: JSON.stringify(arr)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.success && window.HBD.data.reloadFromStorage) {
          return window.HBD.data.reloadFromStorage().then(function () { return res; });
        }
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    /** Wipe all admin overrides and restore defaults */
    function reset() {
      // Restores to static defaults in memory
      if (window.HBD && window.HBD.data && window.HBD.data.reloadFromStorage) {
        window.HBD.data.reloadFromStorage();
      }
      EventBus.emit('data:changed', {});
      return Promise.resolve({ success: true });
    }

    /** Export entire admin data blob as JSON string */
    function exportJSON() {
      return fetch('/api/admin/db/export', {
        headers: UserStore._headers()
      })
      .then(function (res) { return res.json(); })
      .then(function (res) { return JSON.stringify(res, null, 2); });
    }

    /** Import a JSON string and replace all admin overrides */
    function importJSON(jsonStr) {
      try {
        var parsed = JSON.parse(jsonStr);
        return fetch('/api/admin/db/import', {
          method: 'POST',
          headers: UserStore._headers(),
          body: JSON.stringify(parsed)
        })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          if (res.success && window.HBD.data.reloadFromStorage) {
            return window.HBD.data.reloadFromStorage().then(function () { return res.success; });
          }
          return res.success;
        });
      } catch (e) {
        return Promise.resolve(false);
      }
    }

    function getOrders() {
      return fetch('/api/orders', {
        headers: UserStore._headers()
      })
      .then(function (res) { return res.json(); })
      .catch(function (err) { return []; });
    }

    function saveOrder(orderData) {
      return fetch('/api/orders', {
        method: 'POST',
        headers: UserStore._headers(),
        body: JSON.stringify(orderData)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        EventBus.emit('admin:ordersUpdated');
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function updateOrderStatus(orderId, status) {
      return fetch('/api/orders/' + orderId, {
        method: 'PUT',
        headers: UserStore._headers(),
        body: JSON.stringify({ status: status })
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        EventBus.emit('admin:ordersUpdated');
        return res;
      })
      .catch(function (err) {
        return { success: false, message: 'Server connection failed: ' + err.message };
      });
    }

    function getUsers() {
      return fetch('/api/users', {
        headers: UserStore._headers()
      })
      .then(function (res) { return res.json(); })
      .catch(function (err) { return []; });
    }

    function saveUser(userData) {
      return Promise.resolve({ success: true });
    }

    return {
      getOrders:       getOrders,
      saveOrder:       saveOrder,
      updateOrderStatus: updateOrderStatus,
      getUsers:        getUsers,
      saveUser:        saveUser,
      isAdmin:         isAdmin,
      saveServices:    saveServices,
      saveCategories:  saveCategories,
      saveReviews:     saveReviews,
      saveReferralCodes: saveReferralCodes,
      saveRecommended: saveRecommended,
      reset:           reset,
      exportJSON:      exportJSON,
      importJSON:      importJSON
    };
  })();


  // ────────────────────────────────────────────────────────────
  //  EXPOSE PUBLIC API
  // ────────────────────────────────────────────────────────────
  
  // ════════════════════════════════════════════════════════════
  

  window.HBD.store = {
    EventBus:      EventBus,
    CartStore:     CartStore,
    UserStore:     UserStore,
    WishlistStore: WishlistStore,
    AdminStore:    AdminStore
  };

})();
