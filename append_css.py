import sys

new_css = """
/* ══════════════════════════════════════════════════════════════
   CRAZY COOL UPGRADES (Light Mode, Grain, Glitch, 3D)
   ══════════════════════════════════════════════════════════════ */

/* ── 1. LIGHT MODE THEME VARIABLES ── */
[data-theme="light"] {
  --clr-bg-primary:    #f8f9fa;
  --clr-bg-elevated:   #ffffff;
  --clr-bg-surface:    #f1f3f5;
  --clr-bg-overlay:    rgba(248, 249, 250, 0.85);
  --clr-bg-glass:      rgba(255, 255, 255, 0.65);

  --clr-accent:        #e64980;
  --clr-accent-hover:  #d6336c;
  --clr-accent-glow:   rgba(230, 73, 128, 0.35);
  --clr-accent-subtle: rgba(230, 73, 128, 0.08);

  --clr-text-primary:  #1a1a1a;
  --clr-text-secondary:#495057;
  --clr-text-muted:    #868e96;
  --clr-text-on-accent:#ffffff;

  --border-subtle:     rgba(0, 0, 0, 0.06);
  --border-medium:     rgba(0, 0, 0, 0.12);
}

/* ── 2. CINEMATIC GRAIN ── */
.cinematic-grain {
  position: fixed;
  top: -50%; left: -50%; width: 200%; height: 200%;
  pointer-events: none;
  z-index: 9999;
  background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.08"/%3E%3C/svg%3E');
  animation: grain-dance 8s steps(10) infinite;
  mix-blend-mode: overlay;
  opacity: 0.8;
}
[data-theme="light"] .cinematic-grain {
  opacity: 0.4;
  mix-blend-mode: multiply;
}
@keyframes grain-dance {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  80% { transform: translate(3%, 35%); }
  90% { transform: translate(-10%, 10%); }
}

/* ── 3. 3D GLASS TILT CARDS ── */
.hbd-3d-card {
  perspective: 1000px;
  transform-style: preserve-3d;
  will-change: transform;
}
.hbd-3d-card-inner {
  position: relative;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
}
.hbd-3d-card-glare {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 10;
  mix-blend-mode: overlay;
}
[data-theme="light"] .hbd-3d-card-glare {
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 60%);
}
.hbd-3d-card:hover .hbd-3d-card-glare { opacity: 1; }

/* ── 4. CYBERPUNK GLITCH EFFECT ── */
.glitch-hover {
  position: relative;
}
.glitch-hover::before, .glitch-hover::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0;
  pointer-events: none;
}
.glitch-hover::before {
  left: 2px;
  text-shadow: -2px 0 var(--clr-accent);
  clip: rect(44px, 450px, 56px, 0);
}
.glitch-hover::after {
  left: -2px;
  text-shadow: -2px 0 #00ffff;
  clip: rect(44px, 450px, 56px, 0);
}
.glitch-hover:hover::before {
  opacity: 1;
  animation: glitch-anim 2s infinite linear alternate-reverse;
}
.glitch-hover:hover::after {
  opacity: 1;
  animation: glitch-anim2 3s infinite linear alternate-reverse;
}
@keyframes glitch-anim {
  0% { clip: rect(31px, 9999px, 94px, 0); }
  20% { clip: rect(62px, 9999px, 42px, 0); }
  40% { clip: rect(16px, 9999px, 78px, 0); }
  60% { clip: rect(89px, 9999px, 13px, 0); }
  80% { clip: rect(54px, 9999px, 98px, 0); }
  100% { clip: rect(21px, 9999px, 56px, 0); }
}
@keyframes glitch-anim2 {
  0% { clip: rect(14px, 9999px, 67px, 0); }
  20% { clip: rect(82px, 9999px, 12px, 0); }
  40% { clip: rect(45px, 9999px, 89px, 0); }
  60% { clip: rect(23px, 9999px, 34px, 0); }
  80% { clip: rect(76px, 9999px, 91px, 0); }
  100% { clip: rect(34px, 9999px, 23px, 0); }
}

/* ── 5. SPLIT TEXT REVEAL ── */
.split-line { overflow: hidden; display: block; }
.split-char {
  display: inline-block;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
}
.is-visible .split-char {
  transform: translateY(0);
  opacity: 1;
}

/* ── 6. THEME TOGGLE BUTTON ── */
.theme-toggle-btn {
  background: var(--clr-bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--clr-text-primary);
  font-size: 1.1rem;
  transition: all var(--transition-fast);
}
.theme-toggle-btn:hover {
  background: rgba(244,168,199,0.15);
  border-color: var(--clr-accent);
  color: var(--clr-accent);
  transform: scale(1.1);
}
"""

with open('css/base.css', 'a', encoding='utf-8') as f:
    f.write(new_css)
print('base.css updated.')
