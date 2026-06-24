/**
 * ============================================================
 *  HameemBhai er Dokan — Login / Register Page JS
 *  Interactive tab toggles, form fields validation,
 *  mock authentication store bindings, and success routing
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('login');
    HBD.components.renderFooter();

    initAuthTabs();
    initAuthForms();
    checkURLState();

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  // ════════════════════════════════════════════════════════════
  //  TAB TOGGLE SYSTEM
  // ════════════════════════════════════════════════════════════
  function initAuthTabs() {
    var buttons = document.querySelectorAll('.auth-tabs__btn');
    var panes = document.querySelectorAll('.auth-pane');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });
  }

  function switchTab(tabName) {
    var buttons = document.querySelectorAll('.auth-tabs__btn');
    var panes = document.querySelectorAll('.auth-pane');

    buttons.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-tab') === tabName);
    });

    panes.forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'pane-' + tabName);
    });
  }

  function checkURLState() {
    // If query string says ?tab=register OR page pathname is register.html, switch to register tab
    var tabParam = HBD.utils.getQueryParam('tab');
    var isRegisterPage = window.location.pathname.indexOf('register.html') !== -1;

    if (tabParam === 'register' || isRegisterPage) {
      switchTab('register');
    } else {
      switchTab('login');
    }

    // Check for expired session token
    if (HBD.utils.getQueryParam('expired') === 'true') {
      try {
        var cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        if (tabParam) cleanUrl += '?tab=' + tabParam;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      } catch (e) {}

      setTimeout(function () {
        HBD.components.showToast('Your session has expired. Please log in again.', 'warning');
      }, 100);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  FORM BINDINGS & MOCK VALIDATIONS
  // ════════════════════════════════════════════════════════════
  function initAuthForms() {
    var loginForm = document.getElementById('form-login');
    var registerForm = document.getElementById('form-register');

    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var emailInput = document.getElementById('login-email');
        var passwordInput = document.getElementById('login-password');

        var username = emailInput.value.trim();
        var password = passwordInput.value.trim();

        if (!username || !password) {
          HBD.components.showToast('Please fill out all fields.', 'error');
          return;
        }

        HBD.store.UserStore.login(username, password).then(function (loggedIn) {
          if (loggedIn && loggedIn.success) {
            HBD.components.showToast('Successfully logged in! Welcome back, ' + username + '! 👋', 'success');
            setTimeout(function () {
              var redirect = HBD.utils.getQueryParam('redirect');
              window.location.href = (redirect === 'checkout') ? 'checkout.html' : 'index.html';
            }, 1000);
          } else {
            HBD.components.showToast(loggedIn.message || 'Invalid email or password. Please try again!', 'error');
          }
        });
      });
    }

    // Register Form Submit
    if (registerForm) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('reg-name').value.trim();
        var email = document.getElementById('reg-email').value.trim();
        var phone = document.getElementById('reg-phone').value.trim();
        var addressEl = document.getElementById('reg-address');
        var address = addressEl ? addressEl.value.trim() : '';
        var password = document.getElementById('reg-password').value.trim();
        var confirm = document.getElementById('reg-confirm').value.trim();

        if (!name || !email || !phone || !password || !confirm) {
          HBD.components.showToast('Please fill out all fields.', 'error');
          return;
        }

        if (password !== confirm) {
          HBD.components.showToast('Passwords do not match. Try again!', 'error');
          return;
        }

        HBD.store.UserStore.register({
          name: name,
          email: email,
          phone: phone,
          address: address,
          password: password
        }).then(function (registered) {
          if (registered && registered.success) {
            // Send Welcome Email
            if (HBD.email) {
              HBD.email.sendWelcome(name, email);
            }
            
            // Automatically log them in
            HBD.store.UserStore.login(email, password).then(function () {
              HBD.components.showToast('Account created successfully! Enjoy your 10% returning discount. 🚀', 'success');
              setTimeout(function () {
                var redirect = HBD.utils.getQueryParam('redirect');
                window.location.href = (redirect === 'checkout') ? 'checkout.html' : 'index.html';
              }, 1000);
            });
          } else {
            HBD.components.showToast(registered.message || 'An account with this email already exists.', 'error');
          }
        });
      });
    }
  }

})();
