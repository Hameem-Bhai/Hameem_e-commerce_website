/**
 * ============================================================
 *  HameemBhai er Dokan — Components Module
 *  Shared UI components that render to the DOM
 *  Namespace: window.HBD.components
 *  Depends on: HBD.data, HBD.store, HBD.utils
 * ============================================================
 */
(function () {
  'use strict';

  window.HBD = window.HBD || {};

  var ce  = function (t, c, h) { return HBD.utils.createElement(t, c, h); };
  var fmt = function (n) { return HBD.utils.formatBDT(n); };

  // ════════════════════════════════════════════════════════════
  //  HB BRAND LOGO IMAGE
  // ════════════════════════════════════════════════════════════
  var HB_LOGO_SVG = '<img src="logo.png" alt="HameemBhai er Dokan" class="hbd-logo-img">';



  // ════════════════════════════════════════════════════════════
  //  renderHeader(activePage)
  //  Sticky glassmorphism header with nav, search, cart badge
  // ════════════════════════════════════════════════════════════
  function renderHeader(activePage) {
    var headerEl = document.getElementById('hbd-header');
    if (!headerEl) {
      headerEl = ce('header', 'hbd-header');
      headerEl.id = 'hbd-header';
      document.body.prepend(headerEl);
    }

    var cartCount = HBD.store.CartStore.getCount();

    var navLinks = [
      { label: 'Home',     href: 'index.html',    id: 'home' },
      { label: 'Services', href: 'services.html', id: 'services' },
      { label: 'Blog',     href: 'blog.html',     id: 'blog' },
      { label: 'About',    href: 'about.html',    id: 'about' },
      { label: 'Contact',  href: 'contact.html',  id: 'contact' }
    ];

    var navHTML = navLinks.map(function (link) {
      var activeClass = activePage === link.id ? ' active' : '';
      return '<a href="' + link.href + '" class="hbd-nav__link' + activeClass + '">' + link.label + '</a>';
    }).join('');

    headerEl.innerHTML =
      '<div class="hbd-header__inner">' +
        // Logo
        '<a href="index.html" class="hbd-header__logo" aria-label="Home">' +
          HB_LOGO_SVG +
          '<span class="hbd-header__brand">Hameem<span class="hbd-header__brand-suffix"> Bhai er Dokan</span><span class="hbd-logo-dot">.</span>' +
          '</span>' +
        '</a>' +

        // Desktop Navigation
        '<nav class="hbd-nav" aria-label="Main navigation">' +
          navHTML +
        '</nav>' +

        // Right actions
        '<div class="hbd-header__actions">' +
          // Search
          '<div class="hbd-search">' +
            '<button class="hbd-search__toggle" aria-label="Toggle search" title="Search">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
            '</button>' +
            '<div class="hbd-search__dropdown">' +
              '<input type="text" class="hbd-search__input" placeholder="Search services..." aria-label="Search services" />' +
              '<div class="hbd-search__results"></div>' +
            '</div>' +
          '</div>' +

          // Wishlist
          '<a href="wishlist.html" class="hbd-header__icon-btn" aria-label="Wishlist" title="Wishlist">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '</a>' +

          // Cart
          '<a href="cart.html" class="hbd-header__icon-btn hbd-header__cart" aria-label="Cart" title="Cart">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
            (cartCount > 0
              ? '<span class="hbd-header__badge">' + cartCount + '</span>'
              : '') +
          '</a>' +

          // User Menu (wrapped in relative container)
          '<div class="hbd-user-menu">' +
            '<button class="hbd-header__icon-btn hbd-header__user" aria-label="Account" title="Account">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
            '</button>' +
            '<div class="hbd-user-dropdown" id="hbd-user-dropdown"></div>' +
          '</div>' +

          // Mobile hamburger
          '<button class="hbd-hamburger" aria-label="Open menu" title="Menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>' +

      // Mobile nav drawer
      '<div class="hbd-mobile-nav" id="hbd-mobile-nav">' +
        '<div class="hbd-mobile-nav__links">' +
          navHTML +
        '</div>' +
      '</div>';

    // ── Wire up interactions ──────────────────
    _initHeaderEvents(headerEl);

    // Listen for cart changes to update badge
    HBD.store.EventBus.on('cart:changed', function (data) {
      var badge = headerEl.querySelector('.hbd-header__badge');
      if (data.count > 0) {
        if (badge) {
          badge.textContent = data.count;
        } else {
          var cartLink = headerEl.querySelector('.hbd-header__cart');
          if (cartLink) {
            var b = ce('span', 'hbd-header__badge', data.count);
            cartLink.appendChild(b);
          }
        }
      } else if (badge) {
        badge.remove();
      }
    });

    // ── Admin toolbar (only for admin user) ──
    _maybeRenderAdminBar();
    HBD.store.EventBus.on('user:changed', function () {
      _maybeRenderAdminBar();
    });

    // ── Inject JSON-LD Schema ──
    injectSchema(activePage);
  }

  /** Dynamically inject combined LocalBusiness + Person + BreadcrumbList JSON-LD Schema */
  function injectSchema(activePage) {
    if (document.getElementById('hbd-jsonld-schema')) return;

    var siteUrl = 'https://www.hameembhaierdokan.studio';
    var pageUrl = siteUrl + '/' + (activePage === 'home' ? 'index.html' : activePage + '.html');
    var pageNameMap = {
      home: 'Hameem Bhai er Dokan | Home',
      services: 'All Services',
      blog: 'Blog Articles',
      about: 'About Us',
      contact: 'Contact Us',
      cart: 'Your Shopping Cart',
      checkout: 'Checkout',
      login: 'Login / Register',
      profile: 'User Profile',
      orders: 'Order History',
      wishlist: 'Wishlist',
      admin: 'Admin Panel'
    };

    var pageName = pageNameMap[activePage] || 'Page';

    var schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": siteUrl + "/#localbusiness",
          "name": "Hameem Bhai er Dokan",
          "image": siteUrl + "/logo.png",
          "url": siteUrl,
          "telephone": "+8801785501873",
          "priceRange": "৳৳",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Dhanmondi",
            "addressLocality": "Dhaka",
            "addressCountry": "BD"
          },
          "founder": {
            "@id": siteUrl + "/#person"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "40"
          }
        },
        {
          "@type": "Person",
          "@id": siteUrl + "/#person",
          "name": "Hameem Bhai",
          "url": siteUrl + "/about.html",
          "jobTitle": "Creative Director & Founder",
          "worksFor": {
            "@id": siteUrl + "/#localbusiness"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": pageUrl + "/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Hameem Bhai er Dokan",
              "item": siteUrl
            }
          ]
        }
      ]
    };

    if (activePage !== 'home') {
      schemaData["@graph"][2].itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": pageUrl
      });
    }

    var script = ce('script');
    script.type = 'application/ld+json';
    script.id = 'hbd-jsonld-schema';
    script.text = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(script);
  }

  /** Internal — attach header event listeners */
  function _initHeaderEvents(header) {
    // Hamburger toggle
    var hamburger = header.querySelector('.hbd-hamburger');
    var mobileNav = header.querySelector('#hbd-mobile-nav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('is-active');
        mobileNav.classList.toggle('is-open');
        document.body.classList.toggle('menu-open');
      });
    }

    // Search toggle
    var searchToggle = header.querySelector('.hbd-search__toggle');
    var searchDropdown = header.querySelector('.hbd-search__dropdown');
    var searchInput = header.querySelector('.hbd-search__input');
    if (searchToggle && searchDropdown) {
      searchToggle.addEventListener('click', function (e) {
        if (userDropdown) userDropdown.classList.remove('is-open');
        searchDropdown.classList.toggle('is-open');
        if (searchDropdown.classList.contains('is-open') && searchInput) {
          searchInput.focus();
        }
      });
    }

    // Live search
    if (searchInput) {
      searchInput.addEventListener('input', HBD.utils.debounce(function () {
        var query = searchInput.value.trim().toLowerCase();
        var resultsEl = header.querySelector('.hbd-search__results');
        if (!resultsEl) return;

        if (query.length < 2) {
          resultsEl.innerHTML = '';
          return;
        }

        var matches = HBD.data.services.filter(function (s) {
          return s.name.toLowerCase().indexOf(query) !== -1 ||
                 s.description.toLowerCase().indexOf(query) !== -1 ||
                 s.tier.toLowerCase().indexOf(query) !== -1;
        }).slice(0, 5);

        if (matches.length === 0) {
          resultsEl.innerHTML = '<div class="hbd-search__empty">No results found</div>';
          return;
        }

        resultsEl.innerHTML = matches.map(function (s) {
          var cat = HBD.data.getCategoryById(s.categoryId);
          return '<a href="service.html?id=' + s.id + '" class="hbd-search__result-item">' +
                   '<span class="hbd-search__result-icon">' + (cat ? cat.icon : '📦') + '</span>' +
                   '<div class="hbd-search__result-info">' +
                     '<span class="hbd-search__result-name">' + HBD.utils.sanitize(s.name) + '</span>' +
                     '<span class="hbd-search__result-price">' + s.priceDisplay + '</span>' +
                   '</div>' +
                 '</a>';
        }).join('');
      }, 250));
    }

    // Close search on outside click
    document.addEventListener('click', function (e) {
      if (searchDropdown && !searchDropdown.contains(e.target) && !searchToggle.contains(e.target)) {
        searchDropdown.classList.remove('is-open');
      }
    });

    // User dropdown
    var userBtn = header.querySelector('.hbd-header__user');
    var userDropdown = header.querySelector('#hbd-user-dropdown');
    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', function (e) {
        if (searchDropdown) searchDropdown.classList.remove('is-open');
        _renderUserDropdown(userDropdown);
        userDropdown.classList.toggle('is-open');
      });

      document.addEventListener('click', function (e) {
        if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
          userDropdown.classList.remove('is-open');
        }
      });
    }

    // Sticky header scroll effect
    var lastScroll = 0;
    window.addEventListener('scroll', HBD.utils.throttle(function () {
      var current = window.pageYOffset;
      if (current > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      lastScroll = current;
      // Back-to-top button visibility
      var btt = document.querySelector('.hbd-footer__back-to-top');
      if (btt) {
        if (current > 300) {
          btt.classList.add('is-visible');
        } else {
          btt.classList.remove('is-visible');
        }
      }
    }, 100));
  }

  /** Render user dropdown content */
  function _renderUserDropdown(el) {
    if (HBD.store.UserStore.isLoggedIn()) {
      var user = HBD.store.UserStore.getCurrentUser();
      el.innerHTML =
        '<div class="hbd-user-dropdown__header">' +
          '<strong>' + HBD.utils.sanitize(user.name) + '</strong>' +
          '<small>' + HBD.utils.sanitize(user.email) + '</small>' +
          (HBD.store.UserStore.isReturning()
            ? '<span class="hbd-badge hbd-badge--returning">🌟 Returning Customer — 10% Off!</span>'
            : '') +
        '</div>' +
        '<div class="hbd-user-dropdown__links">' +
          '<a href="profile.html">My Profile</a>' +
          '<a href="orders.html">My Orders</a>' +
          '<a href="wishlist.html">Wishlist</a>' +
          '<button class="hbd-user-dropdown__logout" id="hbd-logout-btn">Logout</button>' +
        '</div>';

      // Logout handler
      setTimeout(function () {
        var logoutBtn = document.getElementById('hbd-logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function () {
            HBD.store.UserStore.logout();
            showToast('Logged out successfully.', 'info');
            _renderUserDropdown(el);
          });
        }
      }, 0);
    } else {
      el.innerHTML =
        '<div class="hbd-user-dropdown__header">' +
          '<p>Welcome! Sign in for 10% off as a returning customer.</p>' +
        '</div>' +
        '<div class="hbd-user-dropdown__links">' +
          '<a href="login.html" class="hbd-btn hbd-btn--primary hbd-btn--sm">Login</a>' +
          '<a href="register.html" class="hbd-btn hbd-btn--outline hbd-btn--sm">Register</a>' +
        '</div>';
    }
  }


  // ════════════════════════════════════════════════════════════
  //  renderFooter()
  //  Multi-column footer with quick links, services, payments
  // ════════════════════════════════════════════════════════════
  function renderFooter() {
    var footerEl = document.getElementById('hbd-footer');
    if (!footerEl) {
      footerEl = ce('footer', 'hbd-footer');
      footerEl.id = 'hbd-footer';
      document.body.appendChild(footerEl);
    }

    footerEl.innerHTML =
      '<div class="hbd-footer__inner">' +
        // Col 1 — Brand
        '<div class="hbd-footer__col hbd-footer__col--brand">' +
          '<div class="hbd-footer__logo">' + HB_LOGO_SVG +
            '<span class="hbd-footer__brand-name">Hameem<span class="hbd-footer__brand-suffix"> Bhai er Dokan</span><span class="hbd-logo-dot">.</span></span>' +
          '</div>' +
          '<p class="hbd-footer__tagline">' + HBD.content.get('global', 'tagline') + '<br>' + HBD.content.get('contact', 'location') + '.</p>' +
          '<div class="hbd-footer__social">' +
            '<a href="' + HBD.content.get('global', 'footerInstagram') + '" target="_blank" rel="noopener" aria-label="Instagram" class="hbd-footer__social-link">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>' +
            '</a>' +
            '<a href="' + HBD.content.get('global', 'footerWhatsapp') + '" target="_blank" rel="noopener" aria-label="WhatsApp" class="hbd-footer__social-link">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.309A9.94 9.94 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" fill-rule="evenodd" clip-rule="evenodd"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +

        // Col 2 — Quick Links
        '<div class="hbd-footer__col">' +
          '<h4 class="hbd-footer__heading">Quick Links</h4>' +
          '<ul class="hbd-footer__list">' +
            '<li><a href="index.html">Home</a></li>' +
            '<li><a href="services.html">All Services</a></li>' +
            '<li><a href="blog.html">Blog</a></li>' +
            '<li><a href="about.html">About Us</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
          '</ul>' +
        '</div>' +

        // Col 3 — Services
        '<div class="hbd-footer__col">' +
          '<h4 class="hbd-footer__heading">Services</h4>' +
          '<ul class="hbd-footer__list">' +
            '<li><a href="services.html?cat=lighter-cases">🔥 Lighter Cases</a></li>' +
            '<li><a href="services.html?cat=graphics-design">🎨 Graphics Design</a></li>' +
            '<li><a href="services.html?cat=poster-design">📋 Poster Design</a></li>' +
            '<li><a href="services.html?cat=website-building">🌐 Website Building</a></li>' +
            '<li><a href="services.html?cat=digital-painting">🖌️ Digital Painting</a></li>' +
          '</ul>' +
        '</div>' +

        // Col 4 — Contact & Payment
        '<div class="hbd-footer__col">' +
          '<h4 class="hbd-footer__heading">Contact & Payment</h4>' +
          '<div class="hbd-footer__payments">' +
            '<span class="hbd-payment-badge">bKash</span>' +
            '<span class="hbd-payment-badge">Cash on Delivery</span>' +
          '</div>' +
          '<p class="hbd-footer__contact-intro" style="font-size:0.85rem; color:var(--clr-text-secondary); margin-bottom:10px;">Get in touch with Hameem Bhai at Hameem Bhai er Dokan:</p>' +
          '<p class="hbd-footer__contact-info">' +
            '📱 bKash: <strong>' + HBD.content.get('global', 'footerPhone') + '</strong><br>' +
            '💬 WhatsApp: <a href="' + HBD.content.get('global', 'footerWhatsapp') + '" target="_blank" style="color:var(--clr-accent)">' + HBD.content.get('global', 'footerPhone') + '</a><br>' +
            '📧 <a href="mailto:' + HBD.content.get('global', 'footerEmail') + '" style="color:var(--clr-accent)">' + HBD.content.get('global', 'footerEmail') + '</a><br>' +
            '📍 ' + HBD.content.get('contact', 'location') +
          '</p>' +
        '</div>' +
      '</div>' +

      // Bottom bar
      '<div class="hbd-footer__bottom">' +
        '<p>&copy; 2026 Hameem Bhai er Dokan. All rights reserved. | Created by Hameem Bhai</p>' +
        '<div class="hbd-footer__trust-badge" style="font-size: 0.8rem; color: var(--clr-text-muted); margin: 8px 0;">Hameem Bhai\'s Studio — 40+ Orders, 4.9★ Rating, Made in Dhaka</div>' +
        '<button class="hbd-footer__back-to-top" aria-label="Back to top" title="Back to top">' +
          '↑ Top' +
        '</button>' +
      '</div>';

    // Back-to-top button
    var backToTop = footerEl.querySelector('.hbd-footer__back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        HBD.utils.scrollToTop(true);
      });
    }
  }


  // ════════════════════════════════════════════════════════════
  //  renderServiceCard(service, container?)
  //  Glassmorphism card — category icon, name, price, rating
  //  Returns the card DOM element
  // ════════════════════════════════════════════════════════════
  function renderServiceCard(service, container) {
    var cat = HBD.data.getCategoryById(service.categoryId);
    var avgRating = HBD.data.getAverageRating(service.id);
    var reviewCount = HBD.data.getReviewsByService(service.id).length;
    var isWished = HBD.store.WishlistStore.has(service.id);

    var card = ce('div', 'hbd-service-card');
    card.setAttribute('data-service-id', service.id);
    card.setAttribute('data-category', service.categoryId);

    var imageBgStyle = '';
    var catIconHTML = '';
    if (service.image) {
      imageBgStyle = "background: url('" + service.image + "') center/cover; border-bottom: 1px solid rgba(255, 255, 255, 0.05);";
      catIconHTML = '<span class="hbd-service-card__cat-icon--thumb">' + (cat ? cat.icon : '📦') + '</span>';
    } else {
      var catColor = cat ? cat.color : '#f4a8c7';
      imageBgStyle = 'background: linear-gradient(135deg, #1b191e 0%, ' + catColor + '30 50%, #0d0c0f 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.05);';
      catIconHTML = '<span class="hbd-service-card__cat-icon">' + (cat ? cat.icon : '📦') + '</span>';
    }

    card.innerHTML =
      '<div class="hbd-service-card__image" style="' + imageBgStyle + '">' +
        catIconHTML +
        (service.badge ? '<span class="hbd-badge hbd-badge--popular">🌟 ' + service.badge + '</span>' : '') +
        '<button class="hbd-service-card__wish' + (isWished ? ' is-active' : '') + '" aria-label="Toggle wishlist" data-sid="' + service.id + '">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + (isWished ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="hbd-service-card__body">' +
        '<span class="hbd-service-card__category">' + (cat ? cat.name : '') + '</span>' +
        '<h3 class="hbd-service-card__title">' + HBD.utils.sanitize(service.name) + '</h3>' +
        '<div class="hbd-service-card__studio" style="font-size: 0.78rem; color: var(--clr-text-muted); margin-bottom: 8px;">Available at <span style="color: var(--clr-accent); font-weight: 500;">Hameem Bhai er Dokan</span></div>' +
        '<p class="hbd-service-card__desc">' + HBD.utils.sanitize(service.description) + '</p>' +
        (service.stock ? '<div class="hbd-service-card__stock" style="color: #FF6B35; font-size: 12px; margin-top: 5px; font-weight: 600;">🔥 Only ' + service.stock + ' left in stock!</div>' : '') +
        '<div class="hbd-service-card__meta">' +
          '<span class="hbd-service-card__price">' +
            (service.originalPrice && service.originalPrice > service.price ? '<del style="color: #888; font-size: 12px; margin-right: 5px;">৳' + service.originalPrice + '</del>' : '') +
            (service.price > 0 ? 'From ' + service.priceDisplay : service.priceDisplay) +
          '</span>' +
          (avgRating > 0
            ? '<span class="hbd-service-card__rating">' + renderStarsHTML(avgRating) + ' <small>(' + reviewCount + ')</small></span>'
            : '') +
        '</div>' +
        '<a href="service.html?id=' + service.id + '" class="hbd-btn hbd-btn--outline hbd-btn--sm hbd-service-card__cta">View Details →</a>' +
      '</div>';

    // Wishlist toggle
    var wishBtn = card.querySelector('.hbd-service-card__wish');
    if (wishBtn) {
      wishBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var nowWished = HBD.store.WishlistStore.toggle(service.id);
        wishBtn.classList.toggle('is-active', nowWished);
        var svg = wishBtn.querySelector('svg path');
        // no path fill manipulation needed — class handles it via CSS
        showToast(
          nowWished ? service.name + ' added to wishlist ❤️' : service.name + ' removed from wishlist',
          nowWished ? 'success' : 'info'
        );
      });
    }

    if (container) container.appendChild(card);
    return card;
  }


  // ════════════════════════════════════════════════════════════
  //  renderTierCard(service, container?)
  //  Pricing card for a specific tier — used on detail pages
  // ════════════════════════════════════════════════════════════
  function renderTierCard(service, container) {
    var card = ce('div', 'hbd-tier-card' + (service.badge ? ' hbd-tier-card--popular' : ''));
    card.setAttribute('data-service-id', service.id);

    var featuresHTML = service.features.map(function (f) {
      return '<li class="hbd-tier-card__feature"><span class="hbd-tier-card__check">✓</span> ' + HBD.utils.sanitize(f) + '</li>';
    }).join('');

    card.innerHTML =
      (service.badge ? '<div class="hbd-tier-card__ribbon">🌟 ' + service.badge + '</div>' : '') +
      '<div class="hbd-tier-card__header">' +
        '<h3 class="hbd-tier-card__name">' + HBD.utils.sanitize(service.tier) + '</h3>' +
        '<div class="hbd-tier-card__price">' +
          (service.originalPrice && service.originalPrice > service.price ? '<div style="color: #888; font-size: 14px; text-decoration: line-through; margin-bottom: 2px;">৳' + service.originalPrice + '</div>' : '') +
          (service.price > 0
            ? '<span class="hbd-tier-card__amount">' + fmt(service.price) + '</span>'
            : '<span class="hbd-tier-card__amount hbd-tier-card__amount--quote">Get Quote</span>') +
        '</div>' +
      '</div>' +
      '<p class="hbd-tier-card__desc">' + HBD.utils.sanitize(service.description) + '</p>' +
      '<ul class="hbd-tier-card__features">' + featuresHTML + '</ul>' +
      '<div class="hbd-tier-card__actions">' +
        (service.price > 0
          ? '<button class="hbd-btn hbd-btn--primary hbd-tier-card__add-btn" data-sid="' + service.id + '" data-tier="' + HBD.utils.sanitize(service.tier) + '">Add to Cart 🛒</button>'
          : '<a href="contact.html?service=' + service.id + '" class="hbd-btn hbd-btn--outline">Get a Quote →</a>') +
      '</div>';

    // Add to cart handler
    var addBtn = card.querySelector('.hbd-tier-card__add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        HBD.store.CartStore.add(service.id, service.tier);
        showToast(service.name + ' added to cart! 🛒', 'success');
        // Brief button animation
        addBtn.textContent = 'Added ✓';
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = 'Add to Cart 🛒';
          addBtn.disabled = false;
        }, 1500);
      });
    }

    if (container) container.appendChild(card);
    return card;
  }


  // ════════════════════════════════════════════════════════════
  //  renderReviewCard(review, container?)
  //  Displays a single user review
  // ════════════════════════════════════════════════════════════
  function renderReviewCard(review, container) {
    var card = ce('div', 'hbd-review-card');

    // Generate a beautiful, vibrant HSL gradient background for the avatar based on the userName
    var hash = 0;
    for (var i = 0; i < review.userName.length; i++) {
      hash = review.userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    var h1 = Math.abs(hash % 360);
    var h2 = (h1 + 40) % 360;
    var gradStyle = 'background: linear-gradient(135deg, hsl(' + h1 + ', 65%, 55%) 0%, hsl(' + h2 + ', 65%, 45%) 100%); border: 1.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.15);';

    card.innerHTML =
      '<div class="hbd-review-card__header">' +
        '<div class="hbd-review-card__avatar" style="' + gradStyle + '">' +
          '<span class="hbd-review-card__initial" style="color: #fff; font-weight: 700; font-family: var(--font-heading); font-size: 1.1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">' + review.userName.charAt(0) + '</span>' +
        '</div>' +
        '<div class="hbd-review-card__info">' +
          '<strong class="hbd-review-card__name">' + HBD.utils.sanitize(review.userName) + '</strong>' +
          '<span class="hbd-review-card__date">' + HBD.utils.timeAgo(review.date) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="hbd-review-card__stars">' + renderStarsHTML(review.rating) + '</div>' +
      '<p class="hbd-review-card__text">' + HBD.utils.sanitize(review.text) + '</p>';

    if (container) container.appendChild(card);
    return card;
  }


  // ════════════════════════════════════════════════════════════
  //  renderProcessTimeline(container)
  //  Order process steps as a vertical timeline
  // ════════════════════════════════════════════════════════════
  function renderProcessTimeline(container) {
    var timeline = ce('div', 'hbd-timeline');

    HBD.data.processSteps.forEach(function (step) {
      var item = ce('div', 'hbd-timeline__step');
      item.innerHTML =
        '<div class="hbd-timeline__icon">' + step.icon + '</div>' +
        '<div class="hbd-timeline__content">' +
          '<h4 class="hbd-timeline__title">Step ' + step.step + ': ' + HBD.utils.sanitize(step.title) + '</h4>' +
          '<p class="hbd-timeline__desc">' + HBD.utils.sanitize(step.description) + '</p>' +
        '</div>';
      timeline.appendChild(item);
    });

    if (container) container.appendChild(timeline);
    return timeline;
  }


  // ════════════════════════════════════════════════════════════
  //  showToast(message, type)
  //  Animated slide-in notification — types: success, error, info
  // ════════════════════════════════════════════════════════════
  var _toastContainer = null;

  function showToast(message, type) {
    type = type || 'info';

    // Create container on first use
    if (!_toastContainer) {
      _toastContainer = ce('div', 'hbd-toast-container');
      _toastContainer.id = 'hbd-toast-container';
      _toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(_toastContainer);
    }

    var icons = { success: '✅', error: '❌', info: 'ℹ️' };
    var toast = ce('div', 'hbd-toast hbd-toast--' + type);
    toast.innerHTML =
      '<span class="hbd-toast__icon">' + (icons[type] || icons.info) + '</span>' +
      '<span class="hbd-toast__msg">' + message + '</span>' +
      '<button class="hbd-toast__close" aria-label="Close">&times;</button>';

    // Close button
    toast.querySelector('.hbd-toast__close').addEventListener('click', function () {
      _dismissToast(toast);
    });

    _toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    // Auto dismiss after 4s
    setTimeout(function () { _dismissToast(toast); }, 4000);
  }

  function _dismissToast(toast) {
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }


  // ════════════════════════════════════════════════════════════
  //  renderStars(rating, container?)
  //  Star rating display with half-star support
  //  Also: renderStarsHTML(rating) → HTML string
  // ════════════════════════════════════════════════════════════
  function renderStarsHTML(rating) {
    var html = '';
    var fullStars = Math.floor(rating);
    var hasHalf = (rating - fullStars) >= 0.3 && (rating - fullStars) <= 0.7;
    var emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    for (var i = 0; i < fullStars; i++) {
      html += '<span class="hbd-star hbd-star--full">★</span>';
    }
    if (hasHalf) {
      html += '<span class="hbd-star hbd-star--half">★</span>';
    }
    for (var j = 0; j < emptyStars; j++) {
      html += '<span class="hbd-star hbd-star--empty">☆</span>';
    }
    html += '<span class="hbd-star__value">' + rating.toFixed(1) + '</span>';
    return html;
  }

  function renderStars(rating, container) {
    var el = ce('div', 'hbd-stars', renderStarsHTML(rating));
    if (container) container.appendChild(el);
    return el;
  }


  // ════════════════════════════════════════════════════════════
  //  renderLoadingScreen()
  //  Animated HB monogram loading screen (once per session)
  // ════════════════════════════════════════════════════════════
  function renderLoadingScreen() {
    // Only show once per session
    if (sessionStorage.getItem('hbd_loaded')) return;

    var overlay = ce('div', 'hbd-loading-screen');
    overlay.id = 'hbd-loading-screen';
    overlay.innerHTML =
      '<div class="hbd-loading-screen__content">' +
        '<div class="hbd-loading-screen__logo">' + HB_LOGO_SVG + '</div>' +
        '<div class="hbd-loading-screen__spinner">' +
          '<div class="hbd-loading-screen__dot"></div>' +
          '<div class="hbd-loading-screen__dot"></div>' +
          '<div class="hbd-loading-screen__dot"></div>' +
        '</div>' +
        '<p class="hbd-loading-screen__text">HameemBhai er Dokan</p>' +
      '</div>';

    document.body.prepend(overlay);
    document.body.classList.add('is-loading');

    // Dismiss after animation
    setTimeout(function () {
      overlay.classList.add('is-done');
      document.body.classList.remove('is-loading');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 600);
      sessionStorage.setItem('hbd_loaded', '1');
    }, 2200);
  }


  // ════════════════════════════════════════════════════════════
  //  initCursorTrail()
  //  Custom cursor with pink glow trail effect
  //  (desktop only — skips on touch devices)
  // ════════════════════════════════════════════════════════════
  function initCursorTrail() {
    // Skip on touch / mobile devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    if (window.innerWidth < 1024) return;

    var TRAIL_COUNT = 8;
    var dots = [];

    for (var i = 0; i < TRAIL_COUNT; i++) {
      var dot = ce('div', 'hbd-cursor-dot');
      dot.style.opacity = (1 - i / TRAIL_COUNT) * 0.6;
      dot.style.width = dot.style.height = Math.max(6, 18 - i * 2) + 'px';
      document.body.appendChild(dot);
      dots.push({ el: dot, x: 0, y: 0 });
    }

    var mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      var x = mouseX, y = mouseY;
      for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        // Ease toward target
        dot.x += (x - dot.x) * (0.35 - i * 0.03);
        dot.y += (y - dot.y) * (0.35 - i * 0.03);
        dot.el.style.transform = 'translate(' + dot.x + 'px, ' + dot.y + 'px) translate(-50%, -50%)';
        // Next dot follows current
        x = dot.x;
        y = dot.y;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }


  // ════════════════════════════════════════════════════════════
  //  initScrollAnimations()
  //  IntersectionObserver: adds '.is-visible' to elements
  //  with '[data-animate]' attribute when they enter viewport
  // ════════════════════════════════════════════════════════════
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: stop observing after first reveal
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all elements with data-animate attribute
    var targets = document.querySelectorAll('[data-animate]');
    targets.forEach(function (el) { observer.observe(el); });

    // Re-scan for dynamically added elements
    var reobserve = function () {
      var newTargets = document.querySelectorAll('[data-animate]:not(.is-visible)');
      newTargets.forEach(function (el) { observer.observe(el); });
    };
    HBD.store.EventBus.on('content:loaded', reobserve);
    HBD.store.EventBus.on('data:changed', reobserve);
  }


  // ════════════════════════════════════════════════════════════
  //  renderCategoryFilter(container, onSelect)
  //  Category filter pills — emits selected category
  // ════════════════════════════════════════════════════════════
  function renderCategoryFilter(container, onSelect) {
    var filterWrap = ce('div', 'hbd-cat-filter');
    var allBtn = ce('button', 'hbd-cat-filter__btn is-active', 'All');
    allBtn.setAttribute('data-cat', 'all');
    filterWrap.appendChild(allBtn);

    HBD.data.categories.forEach(function (cat) {
      var btn = ce('button', 'hbd-cat-filter__btn',
        '<span class="hbd-cat-filter__icon">' + cat.icon + '</span> ' + cat.name
      );
      btn.setAttribute('data-cat', cat.id);
      filterWrap.appendChild(btn);
    });

    filterWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.hbd-cat-filter__btn');
      if (!btn) return;

      // Update active state
      filterWrap.querySelectorAll('.hbd-cat-filter__btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');

      if (typeof onSelect === 'function') {
        onSelect(btn.getAttribute('data-cat'));
      }
    });

    if (container) container.appendChild(filterWrap);
    return filterWrap;
  }


  // ════════════════════════════════════════════════════════════
  //  renderCustomOrderForm(container)
  //  Custom order form for "Get Quote" / custom orders
  // ════════════════════════════════════════════════════════════
  function renderCustomOrderForm(container) {
    var form = ce('form', 'hbd-order-form');
    form.id = 'hbd-custom-order-form';

    var categoryOptions = HBD.data.categories.map(function (c) {
      return '<option value="' + c.id + '">' + c.icon + ' ' + c.name + '</option>';
    }).join('');

    form.innerHTML =
      '<h3 class="hbd-order-form__title">📝 Custom Order Request</h3>' +
      '<div class="hbd-order-form__grid">' +
        '<div class="hbd-form-group">' +
          '<label for="cof-name">Your Name *</label>' +
          '<input type="text" id="cof-name" name="name" required placeholder="e.g. Rakib Hasan" class="hbd-input" />' +
        '</div>' +
        '<div class="hbd-form-group">' +
          '<label for="cof-email">Email *</label>' +
          '<input type="email" id="cof-email" name="email" required placeholder="you@example.com" class="hbd-input" />' +
        '</div>' +
        '<div class="hbd-form-group">' +
          '<label for="cof-phone">Phone</label>' +
          '<input type="tel" id="cof-phone" name="phone" placeholder="+880 1XXX-XXXXXX" class="hbd-input" />' +
        '</div>' +
        '<div class="hbd-form-group">' +
          '<label for="cof-category">Service Category *</label>' +
          '<select id="cof-category" name="category" required class="hbd-input">' +
            '<option value="">Select a category</option>' +
            categoryOptions +
          '</select>' +
        '</div>' +
        '<div class="hbd-form-group hbd-form-group--full">' +
          '<label for="cof-desc">Project Description *</label>' +
          '<textarea id="cof-desc" name="description" required rows="5" placeholder="Tell us about your project — the more detail, the better!" class="hbd-input"></textarea>' +
        '</div>' +
        '<div class="hbd-form-group hbd-form-group--full">' +
          '<label for="cof-budget">Estimated Budget (BDT)</label>' +
          '<input type="text" id="cof-budget" name="budget" placeholder="e.g. 5000" class="hbd-input" />' +
        '</div>' +
      '</div>' +
      '<button type="submit" class="hbd-btn hbd-btn--primary hbd-btn--lg">Submit Request ✨</button>';

    // Pre-fill category from URL
    var preselect = HBD.utils.getQueryParam('service');
    if (preselect) {
      var svc = HBD.data.getServiceById(preselect);
      if (svc) {
        setTimeout(function () {
          var catSelect = form.querySelector('#cof-category');
          if (catSelect) catSelect.value = svc.categoryId;
        }, 0);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Request submitted! We\'ll get back to you within 24 hours 🙌', 'success');
      form.reset();
    });

    if (container) container.appendChild(form);
    return form;
  }


  // ════════════════════════════════════════════════════════════
  //  EXPOSE PUBLIC API
  // ════════════════════════════════════════════════════════════
  window.HBD.components = {
    HB_LOGO_SVG: HB_LOGO_SVG,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    renderServiceCard: renderServiceCard,
    renderTierCard: renderTierCard,
    renderReviewCard: renderReviewCard,
    renderProcessTimeline: renderProcessTimeline,
    renderCategoryFilter: renderCategoryFilter,
    renderCustomOrderForm: renderCustomOrderForm,
    showToast: showToast,
    renderStars: renderStars,
    renderStarsHTML: renderStarsHTML,
    renderLoadingScreen: renderLoadingScreen,
    initCursorTrail: initCursorTrail,
    initScrollAnimations: initScrollAnimations,
    _maybeRenderAdminBar: _maybeRenderAdminBar
  };


  // ════════════════════════════════════════════════════════════
  //  ADMIN BAR — injected at top of page for admin users
  // ════════════════════════════════════════════════════════════
  function _maybeRenderAdminBar() {
    var existing = document.getElementById('hbd-admin-bar');

    // Not admin — remove bar if it exists and return
    if (!HBD.store.AdminStore.isAdmin()) {
      if (existing) {
        existing.remove();
        document.body.style.setProperty('--admin-bar-h', '0px');
      }
      return;
    }

    // Already rendered
    if (existing) return;

    var bar = document.createElement('div');
    bar.id = 'hbd-admin-bar';
    bar.className = 'hbd-admin-bar';
    bar.innerHTML =
      '<div class="hbd-admin-bar__collapsed-trigger">' +
        '<span class="hbd-admin-bar__logo-icon">⚡</span>' +
      '</div>' +
      '<div class="hbd-admin-bar__expanded-content">' +
        '<div class="hbd-admin-bar__header-email">basithameem@gmail.com</div>' +
        '<nav class="hbd-admin-bar__links">' +
          '<a href="admin.html#services" class="hbd-admin-bar__link">🛍️ Services</a>' +
          '<a href="admin.html#reviews" class="hbd-admin-bar__link">⭐ Reviews</a>' +
          '<a href="admin.html#codes" class="hbd-admin-bar__link">🎟️ Promo Codes</a>' +
          '<a href="admin.html#settings" class="hbd-admin-bar__link">⚙️ Settings</a>' +
        '</nav>' +
        '<a href="admin.html" class="hbd-admin-bar__btn">Dashboard ➔</a>' +
      '</div>';

    document.body.prepend(bar);

    // Set header offset to 0 since the bar is now a floating panel on the left edge
    document.body.style.setProperty('--admin-bar-h', '0px');
  }

})();

// ============================================================
// CRAZY COOL UPGRADES - Added for 10/10 Polish
// ============================================================

function injectGrain() {
  if (document.querySelector('.cinematic-grain')) return;
  const grain = document.createElement('div');
  grain.className = 'cinematic-grain';
  document.body.prepend(grain);
}

function init3DCards() {
  const cards = document.querySelectorAll('.hbd-3d-card');
  cards.forEach(card => {
    // Inject glare if not exists
    let inner = card.querySelector('.hbd-3d-card-inner');
    if(!inner) {
       inner = document.createElement('div');
       inner.className = 'hbd-3d-card-inner';
       while(card.firstChild) inner.appendChild(card.firstChild);
       card.appendChild(inner);
    }
    let glare = inner.querySelector('.hbd-3d-card-glare');
    if(!glare) {
       glare = document.createElement('div');
       glare.className = 'hbd-3d-card-glare';
       inner.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
      const rotateY = ((x - centerX) / centerX) * 15;
      
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      glare.style.transform = `translate(${(x - centerX)*0.1}px, ${(y-centerY)*0.1}px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
      glare.style.transform = `translate(0px, 0px)`;
    });
  });
}

function initMagneticButtons() {
  const btns = document.querySelectorAll('.hbd-btn:not(.magnetic-skip)');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
}

function initThemeToggle() {
  // Setup theme on load
  const savedTheme = localStorage.getItem('hbd-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Find navbar container to inject toggle
  const navContent = document.querySelector('.hbd-nav-content');
  if (navContent && !document.querySelector('.theme-toggle-btn')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.innerHTML = savedTheme === 'light' ? '🌙' : '☀️';
    toggleBtn.title = "Toggle Light/Dark Mode";
    
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('hbd-theme', next);
      toggleBtn.innerHTML = next === 'light' ? '🌙' : '☀️';
    });
    
    // Insert before cart btn
    const cartBtn = navContent.querySelector('.nav-cart');
    if (cartBtn) {
      navContent.insertBefore(toggleBtn, cartBtn);
    } else {
      navContent.appendChild(toggleBtn);
    }
  }
}

function initSplitText() {
  const splitElements = document.querySelectorAll('.split-text');
  splitElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    const wrapper = document.createElement('span');
    wrapper.className = 'split-line';
    text.split('').forEach((char, i) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'split-char';
      charSpan.innerHTML = char === ' ' ? '&nbsp;' : char;
      charSpan.style.transitionDelay = `${i * 0.05}s`;
      wrapper.appendChild(charSpan);
    });
    el.appendChild(wrapper);
    setTimeout(() => el.classList.add('is-visible'), 100);
  });
}

// Hook into existing init
const originalInit = window.onload;
window.onload = function(e) {
  if(originalInit) originalInit(e);
  injectGrain();
  init3DCards();
  initMagneticButtons();
  initThemeToggle();
  initSplitText();
};
