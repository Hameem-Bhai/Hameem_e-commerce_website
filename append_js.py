import sys

new_js = """
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
"""

with open('js/components.js', 'a', encoding='utf-8') as f:
    f.write(new_js)
print('components.js updated.')
