/**
 * ============================================================
 *  HameemBhai er Dokan — Utilities Module
 *  General-purpose helper functions
 *  Namespace: window.HBD.utils
 * ============================================================
 */
(function () {
  'use strict';

  window.HBD = window.HBD || {};

  // ──────────────────────────────────────────────
  //  formatBDT(amount) → "৳1,500"
  //  Formats a number with the Taka symbol and
  //  Bangladeshi comma grouping (Indian system).
  // ──────────────────────────────────────────────
  function formatBDT(amount) {
    if (amount === 0 || amount === null || amount === undefined) return 'Get Quote';
    var num = Number(amount);
    if (isNaN(num)) return '৳0';

    // Indian/Bangladeshi number system: last 3 digits, then groups of 2
    var str = num.toFixed(0);
    var isNegative = str.charAt(0) === '-';
    if (isNegative) str = str.slice(1);

    var lastThree = str.slice(-3);
    var rest = str.slice(0, -3);

    if (rest.length > 0) {
      lastThree = ',' + lastThree;
      // Insert commas every 2 digits for the remaining part
      var result = '';
      for (var i = rest.length - 1, count = 0; i >= 0; i--, count++) {
        if (count > 0 && count % 2 === 0) result = ',' + result;
        result = rest[i] + result;
      }
      str = result + lastThree;
    }

    return (isNegative ? '-' : '') + '৳' + str;
  }

  // ──────────────────────────────────────────────
  //  getQueryParam(name) → value | null
  // ──────────────────────────────────────────────
  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // ──────────────────────────────────────────────
  //  debounce(fn, delay) → debounced function
  // ──────────────────────────────────────────────
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay || 300);
    };
  }

  // ──────────────────────────────────────────────
  //  throttle(fn, delay) → throttled function
  // ──────────────────────────────────────────────
  function throttle(fn, delay) {
    var lastCall = 0;
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      var now = Date.now();
      var remaining = delay - (now - lastCall);

      if (remaining <= 0) {
        clearTimeout(timer);
        lastCall = now;
        fn.apply(ctx, args);
      } else if (!timer) {
        timer = setTimeout(function () {
          lastCall = Date.now();
          timer = null;
          fn.apply(ctx, args);
        }, remaining);
      }
    };
  }

  // ──────────────────────────────────────────────
  //  generateId() → unique string  (e.g. "hb_k8x3a7v2")
  // ──────────────────────────────────────────────
  var _idCounter = 0;
  function generateId() {
    _idCounter++;
    return 'hb_' + Date.now().toString(36) + (_idCounter).toString(36) +
           Math.random().toString(36).slice(2, 6);
  }

  // ──────────────────────────────────────────────
  //  timeAgo(dateStr) → "2 days ago"
  //  Accepts ISO date string or Date object
  // ──────────────────────────────────────────────
  function timeAgo(date) {
    var d = (date instanceof Date) ? date : new Date(date);
    var now = new Date();
    var diff = Math.floor((now - d) / 1000); // seconds

    if (diff < 60)    return 'just now';
    if (diff < 3600)  return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
    if (diff < 604800) {
      var days = Math.floor(diff / 86400);
      return days + (days === 1 ? ' day ago' : ' days ago');
    }
    if (diff < 2592000) {
      var weeks = Math.floor(diff / 604800);
      return weeks + (weeks === 1 ? ' week ago' : ' weeks ago');
    }
    if (diff < 31536000) {
      var months = Math.floor(diff / 2592000);
      return months + (months === 1 ? ' month ago' : ' months ago');
    }
    var years = Math.floor(diff / 31536000);
    return years + (years === 1 ? ' year ago' : ' years ago');
  }

  // ──────────────────────────────────────────────
  //  scrollToTop(smooth?)
  // ──────────────────────────────────────────────
  function scrollToTop(smooth) {
    window.scrollTo({
      top: 0,
      behavior: smooth !== false ? 'smooth' : 'auto'
    });
  }

  // ──────────────────────────────────────────────
  //  scrollToElement(selector, offset?)
  // ──────────────────────────────────────────────
  function scrollToElement(selector, offset) {
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 80);
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // ──────────────────────────────────────────────
  //  createElement(tag, className?, innerHTML?) → HTMLElement
  //  Quick DOM element factory
  // ──────────────────────────────────────────────
  function createElement(tag, className, innerHTML) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML !== undefined && innerHTML !== null) el.innerHTML = innerHTML;
    return el;
  }

  // ──────────────────────────────────────────────
  //  sanitize(str) — basic HTML escape
  // ──────────────────────────────────────────────
  function sanitize(str) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, function (c) { return map[c]; });
  }

  // ──────────────────────────────────────────────
  //  clamp(value, min, max)
  // ──────────────────────────────────────────────
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // ──────────────────────────────────────────────
  //  isMobile() — viewport < 768px
  // ──────────────────────────────────────────────
  function isMobile() {
    return window.innerWidth < 768;
  }

  // ──────────────────────────────────────────────
  //  formatDate(dateStr) → "May 28, 2025"
  // ──────────────────────────────────────────────
  function formatDate(date) {
    var d = (date instanceof Date) ? date : new Date(date);
    var months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ──────────────────────────────────────────────
  //  EXPOSE PUBLIC API
  // ──────────────────────────────────────────────
  window.HBD.utils = {
    formatBDT: formatBDT,
    getQueryParam: getQueryParam,
    debounce: debounce,
    throttle: throttle,
    generateId: generateId,
    timeAgo: timeAgo,
    scrollToTop: scrollToTop,
    scrollToElement: scrollToElement,
    createElement: createElement,
    sanitize: sanitize,
    clamp: clamp,
    isMobile: isMobile,
    formatDate: formatDate
  };

})();
