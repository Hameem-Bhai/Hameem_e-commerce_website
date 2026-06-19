/**
 * ============================================================
 *  HameemBhai er Dokan — Content Store
 *  Stores all editable site content in localStorage.
 *  Every page reads from here with fallback to defaults.
 *  Namespace: window.HBD.content
 * ============================================================
 */
(function () {
  'use strict';

  window.HBD = window.HBD || {};

  var STORAGE_KEY = 'hbd-site-content';

  var DEFAULTS = {
    // ── HOME PAGE ──
    home: {
      heroBadge: '🇧🇩 Made in Bangladesh',
      heroTitle: 'Hameem Bhai er Dokan — Your Vision, Our Craft',
      heroSubtitle: 'We serve aesthetic that hits harder than your ex’s texts.<br>Street soul. Expensive taste.',
      heroCTA1: 'Explore Services →',
      heroCTA2: 'Learn More',
      heroStat1: '🔥 Premium Creative Studio',
      heroStat2: '📍 Dhanmondi, Dhaka, BD',
    },
    // ── ABOUT PAGE ──
    about: {
      heroBadge: 'The Dokan Story',
      heroTitle: 'About Hameem Bhai er Dokan',
      heroSubtitle: 'Discover the passion, values, and craftsmanship that drive Hameem Bhai er Dokan, founded by Hameem Bhai.',
      storyTitle: 'Your Vision, Our Craft',
      storyP1: 'Hameem Bhai er Dokan wasn\'t built in a boardroom — it was born from the streets of Dhaka out of a simple necessity: people need a place to show their artistic drip without paying astronomical agency fees. Founded by Hameem Bhai, our studio stands for raw creativity.',
      storyP2: 'I\'m Hameem Bhai, and this is Hameem Bhai er Dokan — my creative studio in Dhaka, investing my time and late nights so you can flex your creative vision. Whether Hameem Bhai is hand-painting custom 3D lighter cases that catch eyes, coding glassmorphism websites that feel like the future, or Hameem Bhai er Dokan is dropping corporate posters with unmatched aesthetic — we bring that raw, unfiltered passion to everything we touch.',
      storyP3: 'This isn\'t just a transaction; it\'s a creative partnership. We iterate, we vibe, and we don\'t stop until the final product from Hameem Bhai er Dokan is absolute typeshit.',
      statProjects: '40',
      statClients: '30',
      statYears: '1',
      statSatisfaction: '99',
    },
    // ── CONTACT PAGE ──
    contact: {
      title: 'Get in Touch',
      subtitle: 'Have questions or want to collaborate? Send Hameem Bhai a message!',
      email: 'basithameem@gmail.com',
      phone: '+880 1785-501873',
      whatsappLink: 'https://wa.me/8801785501873',
      location: 'Dhaka, Bangladesh',
      instagramHandle: 'hameem_bhai',
    },
    // ── FOOTER / HEADER ──
    global: {
      tagline: 'Hameem Bhai er Dokan — Bringing creative visions to life from Dhaka, Bangladesh. Created by Hameem Bhai.',
      footerEmail: 'basithameem@gmail.com',
      footerPhone: '+880 1785-501873',
      footerInstagram: 'https://instagram.com/hameem_bhai',
      footerWhatsapp: 'https://wa.me/8801785501873',
      availabilityStatus: 'available',
    }
  };

  /* ── LOAD / SAVE ── */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      var saved = JSON.parse(raw);
      // Deep merge with defaults
      var result = JSON.parse(JSON.stringify(DEFAULTS));
      for (var section in saved) {
        if (!result[section]) result[section] = {};
        for (var key in saved[section]) {
          result[section][key] = saved[section][key];
        }
      }
      return result;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function get(section, key) {
    var data = load();
    if (key === undefined) return data[section] || {};
    return (data[section] && data[section][key] !== undefined)
      ? data[section][key]
      : (DEFAULTS[section] && DEFAULTS[section][key]);
  }

  function set(section, key, value) {
    var data = load();
    if (!data[section]) data[section] = {};
    data[section][key] = value;
    save(data);
    applyContent();
  }

  function setSection(section, obj) {
    var data = load();
    data[section] = Object.assign(data[section] || {}, obj);
    save(data);
    applyContent();
  }

  function reset(section) {
    var data = load();
    if (section) {
      data[section] = JSON.parse(JSON.stringify(DEFAULTS[section] || {}));
    } else {
      data = JSON.parse(JSON.stringify(DEFAULTS));
    }
    save(data);
    applyContent();
  }

  function getDefaults() {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function syncFromServer(serverContent) {
    if (!serverContent) return;
    var localData = load();
    // Deep merge server content
    for (var section in serverContent) {
      if (!localData[section]) localData[section] = {};
      for (var key in serverContent[section]) {
        localData[section][key] = serverContent[section][key];
      }
    }
    save(localData);
    applyContent();
  }

  function syncAvailability(status) {
    if (!status) return;
    try {
      localStorage.setItem('hbd-availability', status);
    } catch (e) {}

    // Update status badge on page if present
    var badge = document.querySelector('.hbd-status-badge');
    if (badge) {
      badge.setAttribute('data-status', status);
      var textEl = badge.querySelector('.hbd-status-text');
      var statusData = {
        available: 'Currently Available',
        busy: 'Busy — Limited Orders',
        closed: 'Closed for Now'
      };
      if (textEl) {
        textEl.textContent = statusData[status] || status;
      }
    }
  }

  function applyContent() {
    // 1. Home page elements
    var isHome = document.getElementById('hero-section') !== null;
    if (isHome) {
      var badge = document.querySelector('#hero-section .hero__badge');
      if (badge) badge.textContent = get('home', 'heroBadge');
      
      var title = document.querySelector('#hero-section .hero__title');
      if (title) {
        var mainTitle = get('home', 'heroTitle');
        if (mainTitle.includes('Your Vision') && mainTitle.includes('Our Craft')) {
          title.innerHTML = 'Your Vision,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hero__title-accent">Our Craft</span>';
          title.setAttribute('data-text', 'Your Vision,\n       Our Craft');
        } else {
          title.textContent = mainTitle;
          title.setAttribute('data-text', mainTitle);
        }
      }

      var subtitle = document.querySelector('#hero-section .hero__subtitle');
      if (subtitle) subtitle.innerHTML = get('home', 'heroSubtitle');

      var cta1 = document.getElementById('hero-cta-explore');
      if (cta1) cta1.textContent = get('home', 'heroCTA1');

      var cta2 = document.getElementById('hero-cta-about');
      if (cta2) cta2.textContent = get('home', 'heroCTA2');

      var stat1 = document.querySelector('#hero-section .hero__stat-pill:nth-of-type(1)');
      if (stat1) stat1.textContent = get('home', 'heroStat1');

      var stat2 = document.querySelector('#hero-section .hero__stat-pill:nth-of-type(2)');
      if (stat2) stat2.textContent = get('home', 'heroStat2');
    }

    // 2. About page elements
    var isAbout = document.querySelector('.about-hero') !== null;
    if (isAbout) {
      var aboutBadge = document.querySelector('.about-hero__badge');
      if (aboutBadge) aboutBadge.textContent = get('about', 'heroBadge');

      var aboutTitle = document.querySelector('.about-hero__title');
      if (aboutTitle) {
        var titleText = get('about', 'heroTitle');
        var accent = 'HameemBhai';
        if (titleText.indexOf(accent) !== -1) {
          aboutTitle.innerHTML = titleText.replace(accent, '<span class="about-hero__title-accent">' + accent + '</span>');
        } else {
          aboutTitle.textContent = titleText;
        }
      }

      var aboutSubtitle = document.querySelector('.about-hero__subtitle');
      if (aboutSubtitle) aboutSubtitle.textContent = get('about', 'heroSubtitle');

      var storyTitle = document.querySelector('.story__title');
      if (storyTitle) {
        var sTitleText = get('about', 'storyTitle');
        var sAccent = 'Our Craft';
        if (sTitleText.indexOf(sAccent) !== -1) {
          storyTitle.innerHTML = sTitleText.replace(sAccent, '<span class="story__title-accent">' + sAccent + '</span>');
        } else {
          storyTitle.textContent = sTitleText;
        }
      }

      var storyP1 = document.querySelector('.story__left p:nth-of-type(1)');
      if (storyP1) storyP1.innerHTML = get('about', 'storyP1');

      var storyP2 = document.querySelector('.story__left p:nth-of-type(2)');
      if (storyP2) storyP2.innerHTML = get('about', 'storyP2');

      var storyP3 = document.querySelector('.story__left p:nth-of-type(3)');
      if (storyP3) storyP3.innerHTML = get('about', 'storyP3');

      var statProj = document.querySelector('.about-stats__item:nth-child(1) .about-stats__number');
      if (statProj) statProj.setAttribute('data-target', get('about', 'statProjects'));

      var statCl = document.querySelector('.about-stats__item:nth-child(2) .about-stats__number');
      if (statCl) statCl.setAttribute('data-target', get('about', 'statClients'));

      var statY = document.querySelector('.about-stats__item:nth-child(3) .about-stats__number');
      if (statY) statY.setAttribute('data-target', get('about', 'statYears'));

      var statSat = document.querySelector('.about-stats__item:nth-child(4) .about-stats__number');
      if (statSat) statSat.setAttribute('data-target', get('about', 'statSatisfaction'));
    }

    // 3. Contact page elements
    var isContact = document.getElementById('contact-title') !== null;
    if (isContact) {
      var contactTitle = document.getElementById('contact-title');
      if (contactTitle) contactTitle.textContent = get('contact', 'title');

      var contactSubtitle = document.getElementById('contact-subtitle');
      if (contactSubtitle) contactSubtitle.textContent = get('contact', 'subtitle');

      var emailLink = document.querySelector('.contact-info-card a[href^="mailto:"]');
      if (emailLink) {
        var email = get('contact', 'email');
        emailLink.href = 'mailto:' + email;
        emailLink.textContent = email;
      }

      var phoneLink = document.querySelector('.contact-info-card a[href^="https://wa.me/"]');
      if (phoneLink) {
        var phone = get('contact', 'phone');
        var waLink = get('contact', 'whatsappLink');
        phoneLink.href = waLink;
        phoneLink.textContent = phone;
      }

      var whatsappBtn = document.querySelector('.social-btn.whatsapp-btn');
      if (whatsappBtn) {
        whatsappBtn.href = get('contact', 'whatsappLink');
      }

      var instaBtn = document.querySelector('.social-btn.instagram-btn');
      if (instaBtn) {
        var instaHandle = get('contact', 'instagramHandle');
        instaBtn.href = 'https://instagram.com/' + instaHandle.replace('@', '');
      }

      var locText = document.querySelector('.contact-info-card .info-item:nth-of-type(3) p');
      if (locText) {
        locText.textContent = get('contact', 'location');
      }
    }

    // 4. Update footer dynamically if rendered
    var footerTagline = document.querySelector('.hbd-footer__tagline');
    if (footerTagline) {
      footerTagline.innerHTML = get('global', 'tagline') + '<br>' + get('contact', 'location') + '.';
    }

    var footerInsta = document.querySelector('.hbd-footer__social-link[aria-label="Instagram"]');
    if (footerInsta) {
      footerInsta.href = get('global', 'footerInstagram');
    }

    var footerWa = document.querySelector('.hbd-footer__social-link[aria-label="WhatsApp"]');
    if (footerWa) {
      footerWa.href = get('global', 'footerWhatsapp');
    }

    var footerPhoneStr = get('global', 'footerPhone');
    var footerWaUrl = get('global', 'footerWhatsapp');
    var footerEmailStr = get('global', 'footerEmail');

    var footerContactInfo = document.querySelector('.hbd-footer__contact-info');
    if (footerContactInfo) {
      footerContactInfo.innerHTML = 
        '📱 bKash: <strong>' + footerPhoneStr + '</strong><br>' +
        '💬 WhatsApp: <a href="' + footerWaUrl + '" target="_blank" style="color:var(--clr-accent)">' + footerPhoneStr + '</a><br>' +
        '📧 <a href="mailto:' + footerEmailStr + '" style="color:var(--clr-accent)">' + footerEmailStr + '</a><br>' +
        '📍 ' + get('contact', 'location');
    }
  }

  // Apply content on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    applyContent();
  });

  window.HBD.content = {
    get: get,
    set: set,
    setSection: setSection,
    reset: reset,
    load: load,
    getDefaults: getDefaults,
    DEFAULTS: DEFAULTS,
    syncFromServer: syncFromServer,
    syncAvailability: syncAvailability,
    applyContent: applyContent
  };

})();
