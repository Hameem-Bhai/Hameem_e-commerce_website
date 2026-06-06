import sys

new_css = """
/* ── AMBIENT GLOW MESH BACKGROUND ── */
body::after {
  content: "";
  position: fixed;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at 30% 70%, rgba(244, 168, 199, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 70% 30%, rgba(110, 207, 148, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(126, 184, 240, 0.05) 0%, transparent 50%);
  z-index: -2;
  pointer-events: none;
  animation: ambient-drift 25s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}
[data-theme="light"] body::after {
  background: radial-gradient(circle at 30% 70%, rgba(230, 73, 128, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 70% 30%, rgba(110, 207, 148, 0.03) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(126, 184, 240, 0.03) 0%, transparent 50%);
}
@keyframes ambient-drift {
  0% { transform: rotate(0deg) translate(0, 0) scale(1); }
  33% { transform: rotate(3deg) translate(-2%, 3%) scale(1.05); }
  66% { transform: rotate(-3deg) translate(2%, -3%) scale(0.95); }
  100% { transform: rotate(0deg) translate(0%, 0%) scale(1); }
}
"""

with open('css/base.css', 'a', encoding='utf-8') as f:
    f.write(new_css)
print('Glow appended to base.css')
