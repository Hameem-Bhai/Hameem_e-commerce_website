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
    var dotsContainer = document.getElementById('reviews-dots');
    var prevBtn = document.getElementById('reviews-prev');
    var nextBtn = document.getElementById('reviews-next');
    if (!track) return;

    var reviews = HBD.data.reviews.slice(0, 10); // Show top 10
    var currentIndex = 0;
    var cardsPerView = getCardsPerView();

    // Render review cards
    reviews.forEach(function (review) {
      var cardWrapper = document.createElement('div');
      cardWrapper.className = 'reviews-carousel__slide';
      HBD.components.renderReviewCard(review, cardWrapper);
      track.appendChild(cardWrapper);
    });

    // Render dots
    var totalPages = Math.ceil(reviews.length / cardsPerView);
    renderDots(totalPages);

    function getCardsPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function renderDots(pages) {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews-carousel__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', 'Go to review page ' + (i + 1));
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      var slideWidth = 100 / cardsPerView;
      var offset = currentIndex * slideWidth;
      track.style.transform = 'translateX(-' + offset + '%)';

      // Update dots
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.reviews-carousel__dot');
        var activePage = Math.floor(currentIndex / cardsPerView);
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === activePage);
        });
      }
    }

    // Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentIndex = Math.max(0, currentIndex - cardsPerView);
        updateCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var maxIndex = reviews.length - cardsPerView;
        currentIndex = Math.min(maxIndex, currentIndex + cardsPerView);
        updateCarousel();
      });
    }

    // Dot click
    if (dotsContainer) {
      dotsContainer.addEventListener('click', function (e) {
        var dot = e.target.closest('.reviews-carousel__dot');
        if (!dot) return;
        var pageIndex = parseInt(dot.getAttribute('data-index'), 10);
        currentIndex = pageIndex * cardsPerView;
        updateCarousel();
      });
    }

    // Handle resize
    window.addEventListener('resize', HBD.utils.debounce(function () {
      cardsPerView = getCardsPerView();
      totalPages = Math.ceil(reviews.length / cardsPerView);
      renderDots(totalPages);
      currentIndex = 0;
      updateCarousel();
    }, 250));

    // Set initial card widths via CSS custom property
    track.style.setProperty('--cards-per-view', cardsPerView);
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
