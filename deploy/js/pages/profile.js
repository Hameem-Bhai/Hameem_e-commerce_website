/**
 * ============================================================
 *  HameemBhai er Dokan — Profile Page JS
 *  User authentication checks, dashboard rendering,
 *  profile updating and returning discount badges.
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Auth Check
    if (!HBD.store.UserStore.isLoggedIn()) {
      HBD.components.showToast('Please login to access your profile.', 'error');
      setTimeout(function () { window.location.href = 'login.html'; }, 1000);
      return;
    }

    HBD.components.renderHeader('login');
    HBD.components.renderFooter();

    populateProfile();
    bindProfileForm();

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  function populateProfile() {
    var user = HBD.store.UserStore.getCurrentUser();
    if (!user) return;

    var nameInput = document.getElementById('prof-name');
    var emailInput = document.getElementById('prof-email');
    var phoneInput = document.getElementById('prof-phone');
    var statusDesc = document.getElementById('prof-status-desc');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';

    var addressInput = document.getElementById('prof-address');
    if (addressInput) addressInput.value = user.address || '';

    if (statusDesc) {
      if (HBD.store.UserStore.isReturning()) {
        statusDesc.innerHTML = 'Congratulations! You qualify as a VIP. Enjoy a **10% automatic discount** on all HameemBhai creative listings!';
      } else {
        statusDesc.innerHTML = 'Complete just 1 checkout order with HameemBhai er Dokan to unlock a **lifetime 10% returning customer discount**!';
      }
    }
  }

  function bindProfileForm() {
    var form = document.getElementById('form-profile');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('prof-name').value.trim();
      var email = document.getElementById('prof-email').value.trim();
      var phone = document.getElementById('prof-phone').value.trim();
      var addressEl = document.getElementById('prof-address');
      var address = addressEl ? addressEl.value.trim() : '';

      if (!name || !email || !phone) {
        HBD.components.showToast('Please fill out all fields.', 'error');
        return;
      }

      HBD.store.UserStore.updateProfile({
        name: name,
        email: email,
        phone: phone,
        address: address
      }).then(function (updated) {
        if (updated && updated.success) {
          HBD.components.showToast(updated.message || 'Profile details updated successfully! ✓', 'success');
          HBD.store.EventBus.emit('user:changed');
        } else {
          HBD.components.showToast(updated && updated.message ? updated.message : 'Unable to save changes. Try again!', 'error');
        }
      });
    });
  }

})();
