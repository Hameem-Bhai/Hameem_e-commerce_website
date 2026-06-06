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

// Mock localStorage store that throws QuotaExceededError
const localStorageMock = {
  getItem: (k) => null,
  setItem: (k,v) => {
    const err = new Error("Mock QuotaExceededError: Local Storage space limit exceeded.");
    err.name = "QuotaExceededError";
    err.code = 22;
    throw err;
  },
  removeItem: (k) => {}
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
let lastToast = null;
global.window.HBD = {
  components: {
    showToast: (msg, type) => {
      lastToast = { msg, type };
      console.log(`TOAST MOCK: [${type}] ${msg}`);
    }
  }
};

// Load code files
window.eval(fs.readFileSync('js/content-store.js', 'utf8'));
window.eval(fs.readFileSync('js/utils.js', 'utf8'));
window.eval(fs.readFileSync('js/data.js', 'utf8'));
window.eval(fs.readFileSync('js/store.js', 'utf8'));

// Mock Admin check
window.HBD.store.AdminStore.isAdmin = () => true;

// Load admin.js
window.eval(fs.readFileSync('js/pages/admin.js', 'utf8'));

// Simulate DOMContentLoaded
const event = new window.Event('DOMContentLoaded');
window.document.dispatchEvent(event);

console.log("\n--- Testing save failure behavior ---");
const doc = window.document;
const editBtn = doc.querySelector('[data-action="edit-service"]');
if (!editBtn) {
  console.error("FAIL: No edit button found in rendered services!");
  process.exit(1);
}
editBtn.click();

setTimeout(() => {
  // Try to save changes
  const saveBtn = doc.getElementById('admin-modal-save');
  const overlay = doc.getElementById('admin-modal-overlay');

  // Verify modal is open initially
  console.log(`Modal is open initially: ${overlay.classList.contains('is-open')}`);
  if (!overlay.classList.contains('is-open')) {
    console.error("FAIL: Modal not open!");
    process.exit(1);
  }

  console.log("Triggering save button click (will trigger QuotaExceededError in mock storage)...");
  saveBtn.click();

  // Verify modal remains open
  const openAfterSave = overlay.classList.contains('is-open');
  console.log(`Modal is still open after failed save: ${openAfterSave}`);

  // Verify we received a failure toast
  console.log(`Received error toast:`, lastToast);

  if (openAfterSave && lastToast && lastToast.type === 'error') {
    console.log("\nSUCCESS: Save failure handled perfectly! Modal remained open and user was notified.");
    process.exit(0);
  } else {
    console.error("\nFAIL: Modal was closed or no error toast was shown.");
    process.exit(1);
  }
}, 100);
