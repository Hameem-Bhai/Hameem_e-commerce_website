/**
 * ============================================================
 *  HameemBhai er Dokan — Home Page JS
 *  Renders hero interactions, categories, recommended,
 *  how-it-works, reviews carousel, stats & referral
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── Render shared components ──
    HBD.components.renderLoadingScreen();
    HBD.components.renderHeader('home');
    HBD.components.renderFooter();

    // ── Render page sections ──
    renderCategories();
    renderRecommended();
    renderHowItWorks();
    renderReviewsCarousel();
    initStatsCounters();
    renderReturningBanner();
    renderReferralCodes();

    HBD.store.EventBus.on('data:changed', function () {
      var catGrid = document.getElementById('categories-grid');
      var recGrid = document.getElementById('recommended-grid');
      var revTrack = document.getElementById('reviews-track');
      var refCodes = document.getElementById('referral-codes');

      if (catGrid) catGrid.innerHTML = '';
      if (recGrid) recGrid.innerHTML = '';
      if (revTrack) revTrack.innerHTML = '';
      if (refCodes) refCodes.innerHTML = '';

      renderCategories();
      renderRecommended();
      renderReviewsCarousel();
      renderReferralCodes();
    });

    // ── Init animations ──
    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();

    // ── Hero scroll indicator ──
    var scrollIndicator = document.getElementById('hero-scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', function () {
        HBD.utils.scrollToElement('#categories-section', 80);
      });
    }

    // Emit content loaded so scroll animations pick up dynamic elements
    HBD.store.EventBus.emit('content:loaded');
  });


  // ════════════════════════════════════════════════════════════
  //  CATEGORIES GRID
  // ════════════════════════════════════════════════════════════
  function renderCategories() {
    var grid = document.getElementById('categories-grid'); if(grid){ grid.setAttribute('data-stagger','1'); }
    if (!grid) return;

    HBD.data.categories.forEach(function (cat, index) {
      var card = document.createElement('a');
      card.href = 'services.html?category=' + cat.id;
      card.className = 'category-card hbd-3d-card';
      card.setAttribute('data-animate', 'fade-up');
      card.style.animationDelay = (index * 0.1) + 's';

      card.innerHTML =
        '<div class="category-card__icon" style="background-color:' + cat.color + '20">' +
          '<span class="category-card__emoji">' + cat.icon + '</span>' +
        '</div>' +
        '<h3 class="category-card__name">' + HBD.utils.sanitize(cat.name) + '</h3>' +
        '<p class="category-card__desc">' + HBD.utils.sanitize(cat.description) + '</p>' +
        '<span class="category-card__link">Explore →</span>';

      grid.appendChild(card);
    });
  }



  // ════════════════════════════════════════════════════════════
  //  RECOMMENDED GRID
  // ════════════════════════════════════════════════════════════
  function renderRecommended() {
    var grid = document.getElementById('recommended-grid'); if(grid){ grid.classList.add('hbd-drag-carousel'); }
    if (!grid) return;

    var recommended = HBD.data.getRecommended();
    recommended.forEach(function (service) {
      var card = HBD.components.renderServiceCard(service);
      card.setAttribute('data-animate', 'fade-up');
      grid.appendChild(card);
    });
  }


  // ════════════════════════════════════════════════════════════
  //  HOW IT WORKS TIMELINE
  // ════════════════════════════════════════════════════════════
  function renderHowItWorks() {
    var container = document.getElementById('how-it-works-timeline');
    if (!container) return;

    // We use a simplified 4-step version for the homepage
    var steps = [
      { icon: '🛒', title: 'Browse & Pick', desc: 'Explore our services and choose the tier that fits your needs and budget.' },
      { icon: '📝', title: 'Place Your Order', desc: 'Add to cart, complete checkout, and share your creative brief with us.' },
      { icon: '⚡', title: 'We Create', desc: 'HameemBhai and the team craft your design with progress updates along the way.' },
      { icon: '🎉', title: 'You Receive', desc: 'Review, request revisions, and get your final files delivered. High-fives all around!' }
    ];

    var timeline = document.createElement('div');
    timeline.className = 'hiw-timeline';

    steps.forEach(function (step, i) {
      var item = document.createElement('div');
      item.className = 'hiw-timeline__step';
      item.setAttribute('data-animate', 'fade-up');
      item.style.animationDelay = (i * 0.15) + 's';

      item.innerHTML =
        '<div class="hiw-timeline__number">' + (i + 1) + '</div>' +
        '<div class="hiw-timeline__icon">' + step.icon + '</div>' +
        '<h3 class="hiw-timeline__title">' + step.title + '</h3>' +
        '<p class="hiw-timeline__desc">' + step.desc + '</p>';

      timeline.appendChild(item);

      // Add connector line between steps (not after last)
      if (i < steps.length - 1) {
        var connector = document.createElement('div');
        connector.className = 'hiw-timeline__connector';
        timeline.appendChild(connector);
      }
    });

    container.appendChild(timeline);
  }


  // ════════════════════════════════════════════════════════════
  //  REVIEWS CAROUSEL
  // ════════════════════════════════════════════════════════════
  function renderReviewsCarousel() {
    var track = document.getElementById('reviews-track');
    var prevBtn = document.getElementById('reviews-prev');
    var nextBtn = document.getElementById('reviews-next');
    var dotsContainer = document.getElementById('reviews-dots');
    if (!track) return;

    var reviews = HBD.data.reviews.slice(0, 10);
    var currentIndex = 0;
    var slides = [];

    // Render review cards
    track.innerHTML = '';
    reviews.forEach(function (review, idx) {
      var cardWrapper = document.createElement('div');
      cardWrapper.className = 'reviews-carousel__slide-3d';
      HBD.components.renderReviewCard(review, cardWrapper);
      
      // Click on slide to bring it to front
      cardWrapper.addEventListener('click', function() {
        if (currentIndex !== idx) {
          currentIndex = idx;
          updateCarousel();
        }
      });
      
      track.appendChild(cardWrapper);
      slides.push(cardWrapper);
    });

    // Render dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      reviews.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'reviews-carousel__dot';
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
      });
    }

    function updateCarousel() {
      slides.forEach(function(slide, idx) {
        slide.className = 'reviews-carousel__slide-3d'; // Reset
        
        if (idx === currentIndex) {
          slide.classList.add('active');
          slide.style.transform = 'translateX(-50%) translateZ(200px) scale(1)';
          slide.style.opacity = 1;
          slide.style.zIndex = 10;
        } else if (idx === currentIndex - 1 || (currentIndex === 0 && idx === slides.length - 1)) {
          // Prev
          slide.classList.add('prev');
          slide.style.transform = 'translateX(-120%) translateZ(0px) scale(0.8) rotateY(15deg)';
          slide.style.opacity = 0.6;
          slide.style.zIndex = 5;
        } else if (idx === currentIndex + 1 || (currentIndex === slides.length - 1 && idx === 0)) {
          // Next
          slide.classList.add('next');
          slide.style.transform = 'translateX(20%) translateZ(0px) scale(0.8) rotateY(-15deg)';
          slide.style.opacity = 0.6;
          slide.style.zIndex = 5;
        } else {
          // Hidden
          slide.style.transform = 'translateX(-50%) translateZ(-200px) scale(0.5)';
          slide.style.opacity = 0;
          slide.style.zIndex = 1;
        }
      });

      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.reviews-carousel__dot');
        dots.forEach(function(d, i) {
          d.classList.toggle('is-active', i === currentIndex);
        });
      }
    }

    // Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateCarousel();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
      });
    }

    // Dot click
    if (dotsContainer) {
      dotsContainer.addEventListener('click', function (e) {
        var dot = e.target.closest('.reviews-carousel__dot');
        if (!dot) return;
        currentIndex = parseInt(dot.getAttribute('data-index'), 10);
        updateCarousel();
      });
    }

    // Touch/Swipe Support
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    track.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
      }
      if (touchEndX > touchStartX + 50) {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateCarousel();
      }
    }

    // Init
    updateCarousel();
  }


  // ════════════════════════════════════════════════════════════
  //  STATS COUNTERS (Animated counting)
  // ════════════════════════════════════════════════════════════
  function initStatsCounters() {
    var statsSection = document.getElementById('stats-section');
    if (!statsSection) return;

    var counters = statsSection.querySelectorAll('.stats__number');
    var animated = false;

    if (!('IntersectionObserver' in window)) {
      // Fallback: just set values immediately
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(function (counter) {
            animateCounter(counter);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var isDecimal = el.getAttribute('data-decimal') === 'true';
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out quad
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(step);
  }


  // ════════════════════════════════════════════════════════════
  //  RETURNING CUSTOMER BANNER
  // ════════════════════════════════════════════════════════════
  function renderReturningBanner() {
    var banner = document.getElementById('returning-banner');
    if (!banner) return;

    if (HBD.store.UserStore.isReturning()) {
      banner.style.display = '';
    }

    // Also listen for user changes
    HBD.store.EventBus.on('user:changed', function () {
      banner.style.display = HBD.store.UserStore.isReturning() ? '' : 'none';
    });
  }


  // ════════════════════════════════════════════════════════════
  //  REFERRAL CODES
  // ════════════════════════════════════════════════════════════
  function renderReferralCodes() {
    var container = document.getElementById('referral-codes');
    if (!container) return;

    var codes = HBD.data.referralCodes;
    var html = '';

    for (var code in codes) {
      if (codes.hasOwnProperty(code)) {
        var info = codes[code];
        html +=
          '<div class="referral__code-item">' +
            '<code class="referral__code-text">' + code + '</code>' +
            '<span class="referral__code-desc">' + info.description + '</span>' +
            '<button class="referral__code-copy hbd-btn hbd-btn--sm hbd-btn--outline" data-code="' + code + '" aria-label="Copy code ' + code + '">Copy</button>' +
          '</div>';
      }
    }

    container.innerHTML = html;

    // Copy functionality
    container.addEventListener('click', function (e) {
      var copyBtn = e.target.closest('.referral__code-copy');
      if (!copyBtn) return;

      var codeToCopy = copyBtn.getAttribute('data-code');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeToCopy).then(function () {
          HBD.components.showToast('Code "' + codeToCopy + '" copied! 📋', 'success');
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000);
        });
      } else {
        // Fallback
        HBD.components.showToast('Code: ' + codeToCopy, 'info');
      }
    });
  }

})();
