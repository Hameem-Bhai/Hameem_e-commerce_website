// ============================================================
// Admin — Site Content Editor & Availability Controller
// Appended to admin page functionality
// ============================================================

(function () {
  'use strict';

  /* ── POPULATE ALL FIELDS when the section opens ── */
  function populateContentFields() {
    var data = HBD.content.load();
    var sections = ['home', 'about', 'contact', 'global'];

    sections.forEach(function (section) {
      var sectionData = data[section] || {};
      Object.keys(sectionData).forEach(function (key) {
        var el = document.getElementById('cnt-' + section + '-' + key);
        if (el) el.value = sectionData[key] || '';
      });
    });

    // Mark active availability button
    var status = localStorage.getItem('hbd-availability') || 'closed';
    highlightAvailBtn(status);
  }

  /* ── SAVE a section ── */
  window.saveContentSection = function (section) {
    var prefix = 'cnt-' + section + '-';
    var defaults = HBD.content.getDefaults()[section] || {};
    var newData = {};

    Object.keys(defaults).forEach(function (key) {
      var el = document.getElementById(prefix + key);
      if (el) newData[key] = el.value;
    });

    var headers = {};
    if (window.HBD && window.HBD.store && window.HBD.store.UserStore && window.HBD.store.UserStore._headers) {
      headers = window.HBD.store.UserStore._headers();
    } else {
      headers = { 'Content-Type': 'application/json' };
    }

    fetch('/api/content', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ section: section, data: newData })
    })
    .then(function (res) { return res.json(); })
    .then(function (res) {
      if (res.success) {
        HBD.content.setSection(section, newData);
        HBD.components.showToast('✅ ' + section.charAt(0).toUpperCase() + section.slice(1) + ' content saved on server!', 'success');
      } else {
        HBD.components.showToast('❌ Save failed: ' + res.message, 'error');
      }
    })
    .catch(function (err) {
      HBD.content.setSection(section, newData);
      HBD.components.showToast('⚠️ Saved locally (Server offline)', 'info');
    });
  };

  /* ── RESET a section ── */
  window.resetContentSection = function (section) {
    if (!confirm('Reset ' + section + ' content to defaults?')) return;

    var headers = {};
    if (window.HBD && window.HBD.store && window.HBD.store.UserStore && window.HBD.store.UserStore._headers) {
      headers = window.HBD.store.UserStore._headers();
    } else {
      headers = { 'Content-Type': 'application/json' };
    }

    fetch('/api/content/reset', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ section: section })
    })
    .then(function (res) { return res.json(); })
    .then(function (res) {
      if (res.success) {
        HBD.content.reset(section);
        populateContentFields();
        HBD.components.showToast('🔄 ' + section.charAt(0).toUpperCase() + section.slice(1) + ' reset on server!', 'success');
      } else {
        HBD.components.showToast('❌ Reset failed: ' + res.message, 'error');
      }
    })
    .catch(function (err) {
      HBD.content.reset(section);
      populateContentFields();
      HBD.components.showToast('⚠️ Reset locally (Server offline)', 'info');
    });
  };

  /* ── AVAILABILITY ── */
  window.setAvailability = function (status) {
    var headers = {};
    if (window.HBD && window.HBD.store && window.HBD.store.UserStore && window.HBD.store.UserStore._headers) {
      headers = window.HBD.store.UserStore._headers();
    } else {
      headers = { 'Content-Type': 'application/json' };
    }

    fetch('/api/availability', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ status: status })
    })
    .then(function (res) { return res.json(); })
    .then(function (res) {
      var textMap = {
        available: 'Currently Available',
        busy: 'Busy — Limited Orders',
        closed: 'Closed for Now'
      };

      if (res.success) {
        localStorage.setItem('hbd-availability', status);
        highlightAvailBtn(status);

        // Update the floating badge on page if present
        var badge = document.querySelector('.hbd-status-badge');
        if (badge) {
          badge.setAttribute('data-status', status);
          var textEl = badge.querySelector('.hbd-status-text');
          if (textEl) textEl.textContent = textMap[status] || status;
        }

        HBD.components.showToast('🟢 Status set to: ' + (textMap[status] || status), 'success');
      } else {
        HBD.components.showToast('❌ Status update failed: ' + res.message, 'error');
      }
    })
    .catch(function (err) {
      var textMap = {
        available: 'Currently Available',
        busy: 'Busy — Limited Orders',
        closed: 'Closed for Now'
      };
      localStorage.setItem('hbd-availability', status);
      highlightAvailBtn(status);
      var badge = document.querySelector('.hbd-status-badge');
      if (badge) {
        badge.setAttribute('data-status', status);
        var textEl = badge.querySelector('.hbd-status-text');
        if (textEl) textEl.textContent = textMap[status] || status;
      }
      HBD.components.showToast('⚠️ Status saved locally (Server offline)', 'info');
    });
  };

  function highlightAvailBtn(status) {
    ['available', 'busy', 'closed'].forEach(function(s) {
      var btn = document.getElementById('avail-' + s);
      if (btn) btn.classList.toggle('is-active', s === status);
    });
  }

  /* ── HOOK into admin nav to populate when section opens ── */
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.getElementById('admin-nav');
    if (!nav) return;

    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-section]');
      if (!btn) return;
      var section = btn.getAttribute('data-section');
      if (section === 'site-content' || section === 'availability') {
        setTimeout(populateContentFields, 50);
      }
    });

    // Pre-populate if already on the section
    populateContentFields();
  });

})();
