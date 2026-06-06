const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = `<!DOCTYPE html><html><body>
  <div id="admin-modal-overlay">
    <h2 id="admin-modal-title"></h2>
    <div id="admin-modal-body"></div>
    <button id="admin-modal-save"></button>
    <button id="admin-modal-cancel"></button>
    <button id="admin-modal-close"></button>
  </div>
  <table id="admin-table-orders"><tbody></tbody></table>
  <div id="admin-nav"></div>
  <button id="add-service-btn"></button>
  <table><tbody id="services-tbody"></tbody></table>
  <table><tbody id="categories-tbody"></tbody></table>
  <table><tbody id="reviews-tbody"></tbody></table>
  <div id="recommended-container"></div>
  <div id="codes-container"></div>
</body></html>`;

// Mock localStorage store
const store = {};
const localStorageMock = {
  getItem: (k) => store[k] || null,
  setItem: (k,v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true
});
const window = dom.window;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
});

global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = localStorageMock;

// Mock HBD toast
global.window.HBD = {
  components: {
    showToast: (msg, type) => { console.log(`TOAST: [${type}] ${msg}`); }
  }
};

// Load code files
window.eval(fs.readFileSync('js/content-store.js', 'utf8'));
window.eval(fs.readFileSync('js/utils.js', 'utf8'));
window.eval(fs.readFileSync('js/data.js', 'utf8'));
window.eval(fs.readFileSync('js/store.js', 'utf8'));

// Mock Admin check so we don't get redirected
window.HBD.store.AdminStore.isAdmin = () => true;

// Load admin.js
window.eval(fs.readFileSync('js/pages/admin.js', 'utf8'));

// Simulate DOMContentLoaded so admin.js runs its initialization
const event = new window.Event('DOMContentLoaded');
window.document.dispatchEvent(event);

console.log("--- Triggering Edit Service Modal by clicking the first rendered edit button ---");
const doc = window.document;
const editBtn = doc.querySelector('[data-action="edit-service"]');
if (!editBtn) {
  console.error("FAIL: No edit button found in rendered services!");
  process.exit(1);
}
editBtn.click();

// Wait for setTimeout to execute modal rendering
setTimeout(() => {
  console.log("--- Filling out DOM inputs in JSDOM ---");
  doc.getElementById('svc-name').value = "Plain Lighter Case Edited";
  doc.getElementById('svc-cat').value = "lighter-cases";
  doc.getElementById('svc-tier').value = "Basic";
  doc.getElementById('svc-price').value = "350";
  doc.getElementById('svc-desc').value = "A clean, flat-design lighter case.";
  doc.getElementById('svc-originalPrice').value = "450";
  doc.getElementById('svc-stock').value = "15";
  doc.getElementById('svc-badge').value = "Updated Item";
  doc.getElementById('svc-popular').checked = true;
  doc.getElementById('svc-image-url').value = "https://example.com/logo.png";

  console.log("--- Triggering Save Button Click ---");
  const saveBtn = doc.getElementById('admin-modal-save');
  saveBtn.click();

  console.log("\nChecking if services list is updated:");
  const updatedSvc = window.HBD.data.getServiceById('lc-plain');
  console.log(`Updated price: ${updatedSvc.price}`);
  console.log(`Updated name: ${updatedSvc.name}`);
  console.log(`Updated originalPrice: ${updatedSvc.originalPrice}`);
  console.log(`Updated stock: ${updatedSvc.stock}`);
  console.log(`Updated badge: ${updatedSvc.badge}`);
  console.log(`Updated popular: ${updatedSvc.popular}`);
  console.log(`Updated image: ${updatedSvc.image}`);

  console.log("\nChecking if stored in localStorage:");
  console.log(store['hbd_admin_data']);
}, 100);
