/**
 * ============================================================
 *  HameemBhai er Dokan — Service Detail Page JS
 *  Dynamic content loading, pricing tiers compare,
 *  tabs switching, custom reviews form, related services
 * ============================================================
 */
(function () {
  'use strict';

  var currentService = null;
  var selectedRating = 5;

  document.addEventListener('DOMContentLoaded', function () {
    var id = HBD.utils.getQueryParam('id');
    if (!id) {
      window.location.href = 'services.html';
      return;
    }

    currentService = HBD.data.getServiceById(id);
    if (!currentService) {
      window.location.href = 'services.html';
      return;
    }

    // ── Render shared components ──
    HBD.components.renderHeader('services');
    HBD.components.renderFooter();

    // ── Populate dynamic data ──
    populateServiceDetails();
    renderProductWidget();
    renderProcessTimeline();
    renderReviews();
    renderRelatedServices();
    initTabs();
    initReviewForm();

    HBD.store.EventBus.on('data:changed', function () {
      currentService = HBD.data.getServiceById(id);
      if (currentService) {
        populateServiceDetails();
        renderReviews();
        renderRelatedServices();
      }
    });

    // ── Init animations ──
    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  // ════════════════════════════════════════════════════════════
  //  POPULATE DYNAMIC DATA
  // ════════════════════════════════════════════════════════════
  function populateServiceDetails() {
    var cat = HBD.data.getCategoryById(currentService.categoryId);

    // Meta
    document.title = currentService.name + ' — HameemBhai er Dokan';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', currentService.description);

    // Breadcrumb
    var breadcrumbName = document.getElementById('breadcrumb-service-name');
    var breadcrumb = document.getElementById('service-breadcrumb');
    if (breadcrumbName && breadcrumb && cat) {
      breadcrumbName.textContent = currentService.name;
      breadcrumb.innerHTML =
        '<a href="index.html" class="breadcrumb__link">Home</a>' +
        '<span class="breadcrumb__sep">›</span>' +
        '<a href="services.html" class="breadcrumb__link">Services</a>' +
        '<span class="breadcrumb__sep">›</span>' +
        '<a href="services.html?category=' + cat.id + '" class="breadcrumb__link">' + HBD.utils.sanitize(cat.name) + '</a>' +
        '<span class="breadcrumb__sep">›</span>' +
        '<span class="breadcrumb__current">' + HBD.utils.sanitize(currentService.name) + '</span>';
    }

    // Main Details
    var titleEl = document.getElementById('service-name');
    var badgeEl = document.getElementById('service-cat-badge');
    var descEl = document.getElementById('service-long-desc');
    var mainEmoji = document.getElementById('service-main-emoji');
    var mainImage = document.getElementById('service-main-image');

    if (titleEl) titleEl.textContent = currentService.name;
    if (badgeEl && cat) {
      badgeEl.textContent = cat.icon + ' ' + cat.name;
      badgeEl.style.backgroundColor = cat.color + '20';
      badgeEl.style.color = cat.color;
    }
    if (descEl) descEl.textContent = currentService.description + ' HameemBhai guarantees highly customized, professional work crafted with utmost quality. Let us bring your creative brief to life with modern aesthetics and premium designs.';
    if (mainEmoji && cat) {
      if (currentService.image) {
        mainEmoji.style.display = 'none';
      } else {
        mainEmoji.style.display = 'block';
        mainEmoji.textContent = cat.icon;
      }
    }
    if (mainImage && cat) {
      if (currentService.image) {
        mainImage.style.background = "url('" + currentService.image + "') center/cover";
        mainImage.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      } else {
        mainImage.style.background = 'linear-gradient(135deg, ' + cat.color + '20, ' + cat.color + '40)';
        mainImage.style.boxShadow = '0 10px 30px ' + cat.color + '15';
      }
    }

    // Specifications
    var specsList = document.getElementById('service-specs-list');
    if (specsList) {
      specsList.innerHTML = '';
      currentService.features.forEach(function (f) {
        var li = HBD.utils.createElement('li', 'specs-list__item', '<span>✓</span> ' + HBD.utils.sanitize(f));
        specsList.appendChild(li);
      });
    }

    // Rating Header
    var ratingSummary = document.getElementById('service-rating-summary');
    var avgRating = HBD.data.getAverageRating(currentService.id);
    var reviewCount = HBD.data.getReviewsByService(currentService.id).length;

    if (ratingSummary && avgRating > 0) {
      ratingSummary.style.display = 'flex';
      var starsEl = document.getElementById('service-stars');
      var ratingTextEl = document.getElementById('service-rating-text');
      if (starsEl) starsEl.innerHTML = HBD.components.renderStarsHTML(avgRating);
      if (ratingTextEl) ratingTextEl.textContent = avgRating.toFixed(1) + ' (' + reviewCount + ' Reviews)';
    }
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER PRODUCT SIDEBAR WIDGET
  // ════════════════════════════════════════════════════════════
  function renderProductWidget() {
    var priceCurrency = document.getElementById('service-price-currency');
    var priceAmount = document.getElementById('service-price-amount');
    var priceOriginal = document.getElementById('service-price-original');
    var shortDesc = document.getElementById('service-short-desc');
    var stockIndicator = document.getElementById('service-stock-indicator');
    var deliveryTime = document.getElementById('service-delivery-time');
    
    var qtyMinus = document.getElementById('qty-minus');
    var qtyPlus = document.getElementById('qty-plus');
    var qtyInput = document.getElementById('qty-input');
    
    var addToCartBtn = document.getElementById('service-add-to-cart-btn');
    var buyNowBtn = document.getElementById('service-buy-now-btn');

    if (!currentService) return;

    // Price
    if (priceAmount) {
      if (currentService.price > 0) {
        priceAmount.textContent = '৳' + currentService.price.toLocaleString('en-IN');
        if (priceCurrency) priceCurrency.style.display = 'inline';
        
        if (priceOriginal) {
          if (currentService.originalPrice && currentService.originalPrice > currentService.price) {
            priceOriginal.style.display = 'inline';
            priceOriginal.textContent = '৳' + currentService.originalPrice.toLocaleString('en-IN');
          } else {
            priceOriginal.style.display = 'none';
          }
        }
      } else {
        priceAmount.textContent = 'Get Quote';
        if (priceCurrency) priceCurrency.style.display = 'none';
        if (priceOriginal) priceOriginal.style.display = 'none';
      }
    }

    // Description
    if (shortDesc) {
      shortDesc.textContent = currentService.description;
    }

    // Stock
    if (stockIndicator) {
      if (currentService.stock !== undefined && currentService.stock !== null) {
        if (currentService.stock > 0) {
          stockIndicator.textContent = '🟢 ' + currentService.stock + ' in Stock';
          stockIndicator.style.background = 'rgba(0, 200, 150, 0.1)';
          stockIndicator.style.color = '#00c9a7';
          stockIndicator.style.borderColor = 'rgba(0, 200, 150, 0.25)';
        } else {
          stockIndicator.textContent = '🔴 Out of Stock';
          stockIndicator.style.background = 'rgba(255, 80, 80, 0.1)';
          stockIndicator.style.color = '#ff8080';
          stockIndicator.style.borderColor = 'rgba(255, 80, 80, 0.2)';
        }
      } else {
        stockIndicator.textContent = '🟢 Available';
        stockIndicator.style.background = 'rgba(0, 200, 150, 0.1)';
        stockIndicator.style.color = '#00c9a7';
        stockIndicator.style.borderColor = 'rgba(0, 200, 150, 0.25)';
      }
    }

    // Delivery time
    if (deliveryTime) {
      deliveryTime.textContent = currentService.deliveryTime || '1–2 weeks';
    }

    // Quantity Selector logic
    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.onclick = function () {
        var val = parseInt(qtyInput.value, 10);
        if (val > 1) {
          qtyInput.value = val - 1;
        }
      };
      qtyPlus.onclick = function () {
        var val = parseInt(qtyInput.value, 10);
        qtyInput.value = val + 1;
      };
    }

    // Add to Cart
    if (addToCartBtn) {
      if (currentService.price > 0) {
        addToCartBtn.onclick = function () {
          var qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
          for (var i = 0; i < qty; i++) {
            HBD.store.CartStore.add(currentService.id, currentService.tier);
          }
          HBD.components.showToast(currentService.name + ' (' + qty + ') added to cart! 🛒', 'success');
          
          // Button feedback
          addToCartBtn.textContent = 'Added! ✅';
          addToCartBtn.disabled = true;
          setTimeout(function () {
            addToCartBtn.textContent = 'Add to Cart 🛒';
            addToCartBtn.disabled = false;
          }, 1500);
        };
      } else {
        addToCartBtn.style.display = 'none';
      }
    }

    // Buy Now
    if (buyNowBtn) {
      if (currentService.price > 0) {
        buyNowBtn.onclick = function () {
          var qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
          for (var i = 0; i < qty; i++) {
            HBD.store.CartStore.add(currentService.id, currentService.tier);
          }
          window.location.href = 'checkout.html';
        };
      } else {
        buyNowBtn.style.display = 'none';
        
        // Custom "Get Quote" button replaces actions
        var actionsContainer = document.querySelector('.service-pricing__actions');
        if (actionsContainer && !actionsContainer._hasQuoteBtn) {
          actionsContainer._hasQuoteBtn = true;
          actionsContainer.innerHTML = '';
          var quoteBtn = document.createElement('a');
          quoteBtn.href = 'contact.html?service=' + currentService.id;
          quoteBtn.className = 'hbd-btn hbd-btn--primary hbd-btn--block';
          quoteBtn.textContent = 'Get a Quote 💬';
          actionsContainer.appendChild(quoteBtn);
        }
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  ORDER TIMELINE
  // ════════════════════════════════════════════════════════════
  function renderProcessTimeline() {
    var container = document.getElementById('service-process-timeline');
    if (container) {
      container.innerHTML = '';
      HBD.components.renderProcessTimeline(container);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  REVIEWS
  // ════════════════════════════════════════════════════════════
  function renderReviews() {
    var list = document.getElementById('service-reviews-list');
    var tabCount = document.getElementById('tab-reviews-count');
    var avgScore = document.getElementById('reviews-avg-score');
    var summaryStars = document.getElementById('reviews-summary-stars');
    var summaryCount = document.getElementById('reviews-summary-count');

    if (!list) return;

    var reviews = HBD.data.getReviewsByService(currentService.id);
    var avg = HBD.data.getAverageRating(currentService.id);

    if (tabCount) tabCount.textContent = 'Reviews (' + reviews.length + ')';
    if (avgScore) avgScore.textContent = avg > 0 ? avg.toFixed(1) : '0.0';
    if (summaryStars) summaryStars.innerHTML = HBD.components.renderStarsHTML(avg);
    if (summaryCount) summaryCount.textContent = 'Based on ' + reviews.length + ' review' + (reviews.length !== 1 ? 's' : '');

    list.innerHTML = '';

    if (reviews.length === 0) {
      list.innerHTML = '<p class="reviews-empty">No reviews yet for this service tier. Be the first to write a review!</p>';
      return;
    }

    reviews.forEach(function (r) {
      HBD.components.renderReviewCard(r, list);
    });
  }

  // ════════════════════════════════════════════════════════════
  //  TABS
  // ════════════════════════════════════════════════════════════
  function initTabs() {
    var buttons = document.querySelectorAll('.service-tabs__btn');
    var panes = document.querySelectorAll('.service-tabs__pane');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabId = btn.getAttribute('data-tab');

        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        panes.forEach(function (p) { p.classList.remove('is-active'); });

        btn.classList.add('is-active');
        var pane = document.getElementById('tab-' + tabId);
        if (pane) pane.classList.add('is-active');
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  //  REVIEW FORM
  // ════════════════════════════════════════════════════════════
  function formatName(name) {
    if (!name) return 'Guest Customer';
    
    // Clean up email handles if they registered with their email name
    name = name.split('@')[0];
    
    // Replace underscores, dots, hyphens with spaces
    name = name.replace(/[._-]/g, ' ');
    
    // Special cases
    var lower = name.toLowerCase().replace(/\s+/g, '');
    if (lower === 'basithameem') {
      return 'Basit Hameem';
    }
    if (lower === 'hameembhai') {
      return 'Hameem Bhai';
    }
    
    // Capitalize first letter of each word
    return name.split(' ').map(function(word) {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ').trim();
  }

  function initReviewForm() {
    var starContainer = document.getElementById('rating-input-stars');
    var form = document.getElementById('hbd-review-form');
    var currentUser = (HBD.store && HBD.store.UserStore && HBD.store.UserStore.getCurrentUser) ? HBD.store.UserStore.getCurrentUser() : null;

    if (starContainer) {
      var stars = starContainer.querySelectorAll('.rating-input__star');

      stars.forEach(function (star) {
        // Hover effects
        star.addEventListener('mouseover', function () {
          var val = parseInt(star.getAttribute('data-value'), 10);
          highlightStars(val);
        });

        star.addEventListener('mouseout', function () {
          highlightStars(selectedRating);
        });

        // Click selection
        star.addEventListener('click', function () {
          selectedRating = parseInt(star.getAttribute('data-value'), 10);
          document.getElementById('rev-rating').value = selectedRating;
          highlightStars(selectedRating);
        });
      });

      function highlightStars(val) {
        stars.forEach(function (s, i) {
          s.classList.toggle('is-active', i < val);
        });
      }

      // Initial highlighting
      highlightStars(selectedRating);
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var textInput = document.getElementById('rev-text');

        if (!textInput.value.trim()) {
          HBD.components.showToast('Please write some review content.', 'error');
          return;
        }

        var reviewerName = 'Guest Customer';
        if (currentUser && currentUser.name) {
          reviewerName = formatName(currentUser.name);
        }

        fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: currentService.id,
            userName: reviewerName,
            rating: selectedRating,
            text: textInput.value.trim()
          })
        })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          if (res.success) {
            HBD.components.showToast('Thank you! Your review has been submitted successfully.', 'success');
            
            // Reset
            form.reset();
            selectedRating = 5;
            if (starContainer) {
              var stars = starContainer.querySelectorAll('.rating-input__star');
              stars.forEach(function (s) { s.classList.add('is-active'); });
            }
            var ratingInput = document.getElementById('rev-rating');
            if (ratingInput) ratingInput.value = 5;

            // Trigger data reload from server
            HBD.data.reloadFromStorage();
          } else {
            HBD.components.showToast(res.message || 'Failed to submit review.', 'error');
          }
        })
        .catch(function (err) {
          HBD.components.showToast('Server connection failed.', 'error');
        });
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  //  RELATED SERVICES
  // ════════════════════════════════════════════════════════════
  function renderRelatedServices() {
    var grid = document.getElementById('related-services-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Find services in same category excluding the current one
    var siblings = HBD.data.getServicesByCategory(currentService.categoryId)
      .filter(function (s) { return s.id !== currentService.id; });

    // If less than 3, get recommended picks
    if (siblings.length < 3) {
      var recommended = HBD.data.getRecommended()
        .filter(function (s) { return s.id !== currentService.id && s.categoryId !== currentService.categoryId; });
      siblings = siblings.concat(recommended);
    }

    // Limit to 3 items
    siblings.slice(0, 3).forEach(function (service) {
      var card = HBD.components.renderServiceCard(service, grid);
      card.setAttribute('data-animate', 'fade-up');
    });
  }

})();
