const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><body><div id="hbd-header"></div></body></html>`, { url: "http://localhost/", runScripts: "dangerously" });
const window = dom.window;
global.window = window;
global.document = window.document;
global.localStorage = { getItem: ()=>null, setItem: ()=>{} };

try {
  window.eval(fs.readFileSync('d:/my website/js/utils.js', 'utf8'));
  console.log('utils.js OK');
  window.eval(fs.readFileSync('d:/my website/js/data.js', 'utf8'));
  console.log('data.js OK');
  window.eval(fs.readFileSync('d:/my website/js/store.js', 'utf8'));
  console.log('store.js OK');
  window.eval(fs.readFileSync('d:/my website/js/components.js', 'utf8'));
  console.log('components.js OK');
  window.eval(fs.readFileSync('d:/my website/js/pages/home.js', 'utf8'));
  console.log('home.js OK');
  // Trigger DOMContentLoaded
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
  console.log('DOMContentLoaded OK');
} catch (e) {
  console.error('ERROR:', e.message, e.stack);
}
