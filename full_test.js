/**
 * Comprehensive runtime test for HameemBhai er Dokan
 * Tests all JS modules by actually exercising key functions
 */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

let errors = [];
let warnings = [];

function loadFile(dom, path) {
  try {
    var code = fs.readFileSync(path, 'utf8');
    dom.window.eval(code);
    return true;
  } catch(e) {
    errors.push('[LOAD ERROR] ' + path + ': ' + e.message);
    return false;
  }
}

// Create a comprehensive DOM with elements for ALL pages
const html = `<!DOCTYPE html><html lang="en"><body>
<div id="hbd-header"></div>
<div id="hbd-footer"></div>
<div id="hero-section"></div>
<div id="hero-particles"></div>
<div id="hero-scroll-indicator"></div>
<div id="categories-grid"></div>
<div id="recommended-grid"></div>
<div id="how-it-works-timeline"></div>
<div id="reviews-track"></div>
<div id="reviews-dots"></div>
<button id="reviews-prev"></button>
<button id="reviews-next"></button>
<div id="stats-section">
  <span class="stats__number" data-target="500">0</span>
  <span class="stats__number" data-target="300">0</span>
</div>
<div id="returning-banner" style="display:none;"></div>
<div id="referral-codes"></div>
<div id="orders-list"></div>
<div id="orders-empty" style="display:none;"></div>
</body></html>`;

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true
});

const window = dom.window;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k,v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};
window.localStorage = global.localStorage;

// Mock IntersectionObserver
window.IntersectionObserver = function(cb) {
  return { observe: function(){}, unobserve: function(){}, disconnect: function(){} };
};

// Mock requestAnimationFrame
window.requestAnimationFrame = function(cb) { return setTimeout(cb, 0); };

// Mock fetch
window.fetch = function(url, options) {
  var data = {};
  if (url === '/api/auth/register') {
    data = { success: true, token: 'mock-token', user: { name: 'Test User', email: 'test@test.com', orderCount: 0 } };
  } else if (url === '/api/orders' && options && options.method === 'POST') {
    var body = JSON.parse(options.body);
    // mock orders store update
    var existing = global.localStorage.getItem('hbd_orders');
    var orders = existing ? JSON.parse(existing) : [];
    orders.push(body);
    global.localStorage.setItem('hbd_orders', JSON.stringify(orders));
    data = { success: true, order: body };
  } else if (url === '/api/orders') {
    var raw = global.localStorage.getItem('hbd_orders');
    data = raw ? JSON.parse(raw) : [];
  } else if (url === '/api/public-data') {
    data = {
      services: [
        { id: 'lc-custom-3d', categoryId: 'lighter-cases', name: 'Mock Service', tier: 'Standard', price: 500, features: [] }
      ],
      categories: [
        { id: 'lighter-cases', name: 'Lighter Cases', icon: '🔥', description: 'desc' }
      ],
      reviews: [
        { id: 'r-1', serviceId: 'lc-custom-3d', userName: 'Test User', rating: 5, text: 'Great' }
      ],
      referralCodes: {
        'HAMEEMBHAI10': { discount: 10, description: '10% off' }
      },
      recommendedIds: ['lc-custom-3d']
    };
  } else {
    data = { success: true };
  }
  return Promise.resolve({
    ok: true,
    json: function() { return Promise.resolve(data); }
  });
};

// Mock emailjs
window.emailjs = {
  init: function() {},
  send: function() { return Promise.resolve(); }
};

// Capture console errors
const origError = console.error;
const origWarn = console.warn;
console.error = function() {
  var msg = Array.from(arguments).join(' ');
  if (!msg.includes('[HBD EventBus]')) { // Ignore EventBus noise
    warnings.push('[CONSOLE.ERROR] ' + msg);
  }
  origError.apply(console, arguments);
};
console.warn = function() {
  var msg = Array.from(arguments).join(' ');
  warnings.push('[CONSOLE.WARN] ' + msg);
  origWarn.apply(console, arguments);
};

console.log('=== Loading core modules ===');

// Load core modules in order
loadFile(dom, 'd:/my website/js/content-store.js');
loadFile(dom, 'd:/my website/js/utils.js');
loadFile(dom, 'd:/my website/js/data.js');
loadFile(dom, 'd:/my website/js/store.js');
loadFile(dom, 'd:/my website/js/components.js');
loadFile(dom, 'd:/my website/js/email-service.js');

console.log('=== Core modules loaded ===');

// Run tests asynchronously
(async function() {
  // ── TEST 1: HBD namespace ──
  if (!window.HBD) errors.push('HBD namespace missing');
  if (!window.HBD.utils) errors.push('HBD.utils missing');
  if (!window.HBD.data) errors.push('HBD.data missing');
  if (!window.HBD.store) errors.push('HBD.store missing');
  if (!window.HBD.components) errors.push('HBD.components missing');
  if (!window.HBD.email) errors.push('HBD.email missing');
  if (!window.HBD.content) errors.push('HBD.content missing');

  // ── TEST 2: Utils functions ──
  try {
    var r1 = window.HBD.utils.formatBDT(1500);
    if (!r1 || r1.indexOf('1,500') === -1) errors.push('formatBDT broken: ' + r1);
  } catch(e) { errors.push('formatBDT crash: ' + e.message); }

  try {
    var r2 = window.HBD.utils.generateId();
    if (!r2 || typeof r2 !== 'string') errors.push('generateId broken');
  } catch(e) { errors.push('generateId crash: ' + e.message); }

  try {
    var r3 = window.HBD.utils.sanitize('<script>alert(1)</script>');
    if (r3.indexOf('<script>') !== -1) errors.push('sanitize not stripping tags');
  } catch(e) { errors.push('sanitize crash: ' + e.message); }

  try {
    window.HBD.utils.createElement('div', 'test-class', 'hello');
  } catch(e) { errors.push('createElement crash: ' + e.message); }

  // ── TEST 3: Data module ──
  try {
    if (!window.HBD.data.categories || window.HBD.data.categories.length === 0) errors.push('No categories in data');
    if (!window.HBD.data.services || window.HBD.data.services.length === 0) errors.push('No services in data');
    if (!window.HBD.data.reviews || window.HBD.data.reviews.length === 0) errors.push('No reviews in data');
    if (!window.HBD.data.paymentMethods) errors.push('No paymentMethods in data');
    if (!window.HBD.data.referralCodes) errors.push('No referralCodes in data');
    if (typeof window.HBD.data.getServiceById !== 'function') errors.push('getServiceById not a function');
    if (typeof window.HBD.data.getCategoryById !== 'function') errors.push('getCategoryById not a function');
    if (typeof window.HBD.data.getRecommended !== 'function') errors.push('getRecommended not a function');

    var svc = window.HBD.data.services[0];
    var retrieved = window.HBD.data.getServiceById(svc.id);
    if (!retrieved) errors.push('getServiceById returned null for valid ID');

    var cat = window.HBD.data.getCategoryById(svc.categoryId);
    if (!cat) errors.push('getCategoryById returned null for valid ID');

    var recommended = window.HBD.data.getRecommended();
    if (!recommended || recommended.length === 0) errors.push('getRecommended returned empty');
  } catch(e) { errors.push('Data module crash: ' + e.message); }

  // ── TEST 4: Store module ──
  try {
    // CartStore
    var cart = window.HBD.store.CartStore;
    if (!cart) errors.push('CartStore missing');
    
    cart.clear();
    if (cart.getCount() !== 0) errors.push('CartStore.clear() did not empty cart');

    var svc = window.HBD.data.services[0];
    cart.add(svc.id, 'Standard');
    if (cart.getCount() !== 1) errors.push('CartStore.add() did not add item');
    
    var items = cart.getItems();
    if (!items || items.length !== 1) errors.push('CartStore.getItems() wrong length');
    if (items[0] && !items[0].service) errors.push('CartStore.getItems() missing service enrichment');

    var total = cart.getTotal();
    if (typeof total.subtotal !== 'number') errors.push('CartStore.getTotal() missing subtotal');
    if (typeof total.total !== 'number') errors.push('CartStore.getTotal() missing total');

    // Promo code
    var promoResult = cart.applyPromo('HAMEEMBHAI10');
    if (!promoResult.success) errors.push('CartStore.applyPromo() failed for valid code');

    cart.clear();

    // UserStore
    var user = window.HBD.store.UserStore;
    if (!user) errors.push('UserStore missing');
    
    user.logout();
    if (user.isLoggedIn()) errors.push('UserStore.isLoggedIn() true after logout');

    var regResult = await user.register({ name: 'Test User', email: 'test@test.com', password: '12345' });
    if (!regResult.success) errors.push('UserStore.register() failed: ' + regResult.message);
    if (!user.isLoggedIn()) errors.push('UserStore not logged in after register');
    if (user.isReturning()) errors.push('New user should not be returning');

    user.incrementOrders();
    if (!user.isReturning()) errors.push('User should be returning after incrementOrders');

    // AdminStore
    var admin = window.HBD.store.AdminStore;
    if (!admin) errors.push('AdminStore missing');
    if (typeof admin.getOrders !== 'function') errors.push('AdminStore.getOrders not a function');
    if (typeof admin.saveOrder !== 'function') errors.push('AdminStore.saveOrder not a function');

    // Test saveOrder
    try {
      await admin.saveOrder({ orderId: 'TEST-001', name: 'Test', total: 500 });
      var orders = await admin.getOrders();
      if (!orders || orders.length === 0) errors.push('AdminStore.saveOrder() did not persist');
    } catch(e) { errors.push('AdminStore.saveOrder() crash: ' + e.message); }

    // WishlistStore
    var wishlist = window.HBD.store.WishlistStore;
    if (!wishlist) errors.push('WishlistStore missing');
    wishlist.clear();
    wishlist.add('test-id');
    if (!wishlist.has('test-id')) errors.push('WishlistStore.add() did not work');
    wishlist.clear();

  } catch(e) { errors.push('Store module crash: ' + e.message + '\n' + e.stack); }

  // ── TEST 5: Components module ──
  try {
    var comp = window.HBD.components;
    if (typeof comp.renderHeader !== 'function') errors.push('renderHeader not a function');
    if (typeof comp.renderFooter !== 'function') errors.push('renderFooter not a function');
    if (typeof comp.renderServiceCard !== 'function') errors.push('renderServiceCard not a function');
    if (typeof comp.renderReviewCard !== 'function') errors.push('renderReviewCard not a function');
    if (typeof comp.showToast !== 'function') errors.push('showToast not a function');
    if (typeof comp.renderStarsHTML !== 'function') errors.push('renderStarsHTML not a function');
    if (typeof comp.initScrollAnimations !== 'function') errors.push('initScrollAnimations not a function');
    if (typeof comp.initCursorTrail !== 'function') errors.push('initCursorTrail not a function');

    // Actually render header
    comp.renderHeader('home');
    var headerEl = document.getElementById('hbd-header');
    if (!headerEl || headerEl.innerHTML.length < 100) errors.push('renderHeader did not produce content');

    // Render footer
    comp.renderFooter();
    var footerEl = document.getElementById('hbd-footer');
    if (!footerEl || footerEl.innerHTML.length < 100) errors.push('renderFooter did not produce content');

    // Render a service card
    var svc = window.HBD.data.services[0];
    var card = comp.renderServiceCard(svc);
    if (!card || !card.innerHTML) errors.push('renderServiceCard returned empty');

    // Render a review card
    var review = window.HBD.data.reviews[0];
    var reviewCard = comp.renderReviewCard(review);
    if (!reviewCard) errors.push('renderReviewCard returned empty');

    // Stars HTML
    var stars = comp.renderStarsHTML(4.5);
    if (!stars || stars.length < 10) errors.push('renderStarsHTML returned empty');

    // Show toast
    comp.showToast('Test message', 'success');

  } catch(e) { errors.push('Components crash: ' + e.message + '\n' + e.stack); }

  // ── TEST 6: Email service ──
  try {
    var email = window.HBD.email;
    if (typeof email.sendReceipt !== 'function') errors.push('sendReceipt not a function');
    if (typeof email.sendAdminOrder !== 'function') errors.push('sendAdminOrder not a function');
    if (typeof email.sendWelcome !== 'function') errors.push('sendWelcome not a function');
    if (typeof email.sendContact !== 'function') errors.push('sendContact not a function');
  } catch(e) { errors.push('Email service crash: ' + e.message); }

  // ── TEST 7: Load page JS files ──
  console.log('=== Loading page JS files ===');
  loadFile(dom, 'd:/my website/js/pages/home.js');
  loadFile(dom, 'd:/my website/js/pages/cart.js');
  loadFile(dom, 'd:/my website/js/pages/checkout.js');
  loadFile(dom, 'd:/my website/js/pages/contact.js');
  loadFile(dom, 'd:/my website/js/pages/about.js');
  loadFile(dom, 'd:/my website/js/pages/catalog.js');
  loadFile(dom, 'd:/my website/js/pages/login.js');
  loadFile(dom, 'd:/my website/js/pages/orders.js');
  loadFile(dom, 'd:/my website/js/pages/profile.js');
  loadFile(dom, 'd:/my website/js/pages/service.js');
  loadFile(dom, 'd:/my website/js/pages/wishlist.js');
  loadFile(dom, 'd:/my website/js/premium-effects.js');

  // Trigger DOMContentLoaded
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

  // ── TEST 8: Content Store ──
  try {
    var content = window.HBD.content;
    if (typeof content.get !== 'function') errors.push('content.get not a function');
    var homeContent = content.get('home');
    if (!homeContent || !homeContent.heroTitle) errors.push('content.get(home) missing heroTitle');
  } catch(e) { errors.push('Content store crash: ' + e.message); }

  // ══════════════════════════════════
  // REPORT
  // ══════════════════════════════════
  console.log('\n');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   FULL RUNTIME TEST RESULTS              ║');
  console.log('╚══════════════════════════════════════════╝');

  if (errors.length === 0) {
    console.log('✅ ALL TESTS PASSED — 0 errors found!');
  } else {
    console.log('❌ ERRORS FOUND: ' + errors.length);
    errors.forEach(function(e, i) {
      console.log('  ' + (i+1) + '. ' + e);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS: ' + warnings.length);
    warnings.forEach(function(w, i) {
      console.log('  ' + (i+1) + '. ' + w);
    });
  }

  console.log('\nDone.');
  process.exit(errors.length > 0 ? 1 : 0);
})();
