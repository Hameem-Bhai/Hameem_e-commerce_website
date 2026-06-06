// ============================================================
// HameemBhai er Dokan — Premium Effects JS
// WhatsApp Bubble · Status Badge · Sparkle Cursor
// Sound Effects · Drag Carousel · Stagger Animations · Counters
// ============================================================

(function () {
  'use strict';

  /* ── SPARKLE COLOURS ── */
  var SPARKLE_COLORS = [
    '#f4a8c7', '#c4a0f4', '#a0c4f4', '#f4d4a0', '#a0f4c4', '#ffffff'
  ];

  /* ── 1. FLOATING WHATSAPP BUBBLE ── */
  function injectWABubble() {
    if (document.querySelector('.hbd-wa-bubble')) return;
    var a = document.createElement('a');
    a.href = 'https://wa.me/8801785501873?text=Hi%20HameemBhai!%20I%20want%20to%20order%20a%20service.';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'hbd-wa-bubble';
    a.innerHTML = '<span class="hbd-wa-bubble__icon">💬</span><span class="hbd-wa-bubble__label">Chat on WhatsApp</span>';
    document.body.appendChild(a);
  }

  /* ── 2. LIVE STATUS BADGE ── */
  function injectStatusBadge() {
    if (document.querySelector('.hbd-status-badge')) return;
    var statusData = {
      available: { text: 'Currently Available', color: 'available' },
      busy: { text: 'Busy — Limited Orders', color: 'busy' },
      closed: { text: 'Closed for Now', color: 'closed' }
    };
    var currentStatus = localStorage.getItem('hbd-availability') || 'closed';
    var badge = document.createElement('div');
    badge.className = 'hbd-status-badge';
    badge.setAttribute('data-status', currentStatus);
    badge.innerHTML = '<span class="hbd-status-dot"></span><span class="hbd-status-text">' + statusData[currentStatus].text + '</span>';
    document.body.appendChild(badge);
  }

  /* ── 3. CURSOR SPARKLE TRAIL ── */
  function initSparkleTrail() {
    var lastSparkle = 0;
    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastSparkle < 60) return; // throttle to ~16 per second
      lastSparkle = now;
      var s = document.createElement('div');
      s.className = 'hbd-sparkle';
      var color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      var size = 4 + Math.random() * 6;
      s.style.cssText = 'left:' + e.clientX + 'px;top:' + e.clientY + 'px;background:' + color + ';width:' + size + 'px;height:' + size + 'px;box-shadow:0 0 6px ' + color + ';';
      document.body.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
    });
  }

  /* ── 4. UI SOUND EFFECTS ── */
  var soundEnabled = localStorage.getItem('hbd-sound') !== 'off';

  function createBeep(freq, duration, volume, type) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume || 0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playClick() { if (soundEnabled) createBeep(800, 0.08, 0.04, 'sine'); }
  function playHover() { if (soundEnabled) createBeep(600, 0.05, 0.02, 'sine'); }
  function playSuccess() {
    if (!soundEnabled) return;
    createBeep(523, 0.1, 0.04);
    setTimeout(function() { createBeep(659, 0.1, 0.04); }, 100);
    setTimeout(function() { createBeep(784, 0.15, 0.04); }, 200);
  }
  window.HBD = window.HBD || {};
  window.HBD.sounds = { click: playClick, hover: playHover, success: playSuccess };

  function injectSoundBtn() {
    if (document.querySelector('.hbd-sound-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'hbd-sound-btn';
    btn.title = 'Toggle Sound Effects';
    btn.innerHTML = soundEnabled ? '🔊' : '🔇';
    btn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      localStorage.setItem('hbd-sound', soundEnabled ? 'on' : 'off');
      btn.innerHTML = soundEnabled ? '🔊' : '🔇';
      playClick();
    });
    document.body.appendChild(btn);
  }

  function initSoundListeners() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .hbd-btn, a.hbd-btn');
      if (btn) playClick();
    });
    var lastHovered = null;
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest('.hbd-btn, .category-card, .service-card, .value-card');
      if (el && el !== lastHovered) { lastHovered = el; playHover(); }
    });
  }

  /* ── 5. STAGGER SCROLL ANIMATIONS ── */
  function initStaggerAnimations() {
    var staggerEls = document.querySelectorAll('[data-stagger]');
    if (!staggerEls.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        var children = el.children;
        for (var i = 0; i < children.length; i++) {
          (function(child, idx) {
            child.style.transitionDelay = (idx * 0.1) + 's';
          })(children[i], i);
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.15 });
    staggerEls.forEach(function(el) { observer.observe(el); });
  }

  /* ── 6. ANIMATED NUMBER COUNTERS ── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var isPercent = el.getAttribute('data-percent') === 'true';
        var duration = 1800;
        var start = performance.now();
        function step(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          // ease-out-expo
          var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) { requestAnimationFrame(step); }
          else { el.textContent = target; }
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { observer.observe(el); });
  }

  /* ── 7. HORIZONTAL DRAG CAROUSEL ── */
  function initDragCarousels() {
    var carousels = document.querySelectorAll('.hbd-drag-carousel');
    carousels.forEach(function(carousel) {
      var isDown = false;
      var startX, scrollLeft;
      var velocity = 0;
      var lastX = 0;
      var lastTime = 0;
      var rafId;

      carousel.addEventListener('mousedown', function(e) {
        isDown = true;
        carousel.classList.add('is-dragging');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        cancelAnimationFrame(rafId);
        velocity = 0;
        lastX = e.pageX;
        lastTime = Date.now();
      });
      carousel.addEventListener('mouseleave', function() { if(isDown) releaseCarousel(); });
      carousel.addEventListener('mouseup', function() { if(isDown) releaseCarousel(); });
      carousel.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - carousel.offsetLeft;
        var walk = (x - startX) * 1.5;
        var now = Date.now();
        velocity = (e.pageX - lastX) / (now - lastTime + 1);
        lastX = e.pageX;
        lastTime = now;
        carousel.scrollLeft = scrollLeft - walk;
      });

      function releaseCarousel() {
        isDown = false;
        carousel.classList.remove('is-dragging');
        // Momentum scrolling
        (function momentum() {
          if (Math.abs(velocity) < 0.5) return;
          carousel.scrollLeft -= velocity * 12;
          velocity *= 0.92;
          rafId = requestAnimationFrame(momentum);
        })();
      }

      // Touch support
      var touchStartX = 0;
      var touchScrollLeft = 0;
      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = carousel.scrollLeft;
      }, { passive: true });
      carousel.addEventListener('touchmove', function(e) {
        var walk = (touchStartX - e.touches[0].pageX) * 1.2;
        carousel.scrollLeft = touchScrollLeft + walk;
      }, { passive: true });
    });
  }

  /* ── INIT ALL ON DOM READY ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectWABubble();
    injectStatusBadge();
    initSparkleTrail();
    injectSoundBtn();
    initSoundListeners();
    initStaggerAnimations();
    initCounters();
    initDragCarousels();
  });

})();
