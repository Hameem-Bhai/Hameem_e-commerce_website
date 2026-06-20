import os
import glob
import re

html_files = glob.glob('*.html')

meta_tags = """
  <!-- SEO & Social Media Meta Tags -->
  <meta name="theme-color" content="#1a1a1a">
  <meta property="og:site_name" content="Hameem Bhai er Dokan">
  <meta property="og:image" content="https://i.postimg.cc/x8RYN8Q3/logo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Hameem Bhai er Dokan">
  <meta name="twitter:image" content="https://i.postimg.cc/x8RYN8Q3/logo.png">
"""

script_tag = '<script src="js/page-transitions.js?v=1.1.9"></script>\n</body>'

for filepath in html_files:
    if filepath == 'business_card.html':
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # 1. Inject meta tags before </head> if not there
    if '<meta name="theme-color"' not in content:
        content = content.replace('</head>', f'{meta_tags}</head>')
        
    # 2. Add class="page-transition" to body
    if '<body class="' in content:
        if 'page-transition' not in content:
            content = content.replace('<body class="', '<body class="page-transition ')
    elif '<body>' in content:
        content = content.replace('<body>', '<body class="page-transition">')
        
    # 3. Inject page-transitions.js before </body>
    if 'page-transitions.js' not in content:
        content = content.replace('</body>', script_tag)
        
    # 4. Add loading="lazy" to static img tags (except header logo/hero if any, but let's just add it to all missing)
    # We will do this via regex for simple img tags that don't have it.
    content = re.sub(r'<img(?![^>]*loading="lazy")([^>]*)>', r'<img loading="lazy"\1>', content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
        
print("HTML patching complete.")
