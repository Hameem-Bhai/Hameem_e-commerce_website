const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = `<!DOCTYPE html><html><body></body></html>`;

// Mock localStorage store
const store = {};
const localStorageMock = {
  getItem: (k) => {
    const val = store[k];
    return val === undefined ? null : val;
  },
  setItem: (k,v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

// Helper to create JSDOM instance and load HBD scripts
function createDOM() {
  const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    pretendToBeVisual: true
  });
  const window = dom.window;
  
  // Define property for localStorage
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true
  });
  
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = localStorageMock;
  
  // Load scripts
  try {
    const contentStoreCode = fs.readFileSync('js/content-store.js', 'utf8');
    window.eval(contentStoreCode);
    const utilsCode = fs.readFileSync('js/utils.js', 'utf8');
    window.eval(utilsCode);
    const dataCode = fs.readFileSync('js/data.js', 'utf8');
    window.eval(dataCode);
    const storeCode = fs.readFileSync('js/store.js', 'utf8');
    window.eval(storeCode);
    return dom;
  } catch(e) {
    console.error("Load error:", e);
    return null;
  }
}

console.log("--- Initializing DOM Session 1 ---");
const dom1 = createDOM();
const HBD1 = dom1.window.HBD;

const plainSvc1 = HBD1.data.getServiceById('lc-plain');
console.log(`Session 1: Initial lc-plain price is ${plainSvc1.price}`);

console.log("--- Modifying price to 350 and saving ---");
const services = HBD1.data.services.map(s => {
  if (s.id === 'lc-plain') {
    return Object.assign({}, s, { price: 350 });
  }
  return s;
});

HBD1.store.AdminStore.saveServices(services);

const plainSvc1After = HBD1.data.getServiceById('lc-plain');
console.log(`Session 1: After save, lc-plain price is ${plainSvc1After.price}`);
console.log(`Session 1: hbd_admin_data in localStorage:`, store['hbd_admin_data']);

console.log("\n--- Initializing DOM Session 2 (simulating reload) ---");
const dom2 = createDOM();
const HBD2 = dom2.window.HBD;
const plainSvc2 = HBD2.data.getServiceById('lc-plain');
console.log(`Session 2: On reload, lc-plain price is ${plainSvc2.price}`);

if (plainSvc2.price === 350) {
  console.log("SUCCESS: Price persisted correctly!");
} else {
  console.log("FAIL: Price reverted to default!");
}
