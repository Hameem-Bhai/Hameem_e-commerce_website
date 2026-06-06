import sys

# Replace in home.js
try:
    with open('js/pages/home.js', 'r', encoding='utf-8') as f:
        home_js = f.read()
    home_js = home_js.replace("card.className = 'category-card';", "card.className = 'category-card hbd-3d-card';")
    with open('js/pages/home.js', 'w', encoding='utf-8') as f:
        f.write(home_js)
    print("Updated home.js")
except Exception as e:
    print(f"Error home.js: {e}")

# Replace in components.js
try:
    with open('js/components.js', 'r', encoding='utf-8') as f:
        comp_js = f.read()
    
    # We will just append the glitch-hover to the logo mark since it's defined near the top
    # original: var HB_LOGO_SVG = '<div class="hbd-logo-mark"><span class="hbd-logo-mark__text">HB</span></div>';
    comp_js = comp_js.replace(
        '<div class="hbd-logo-mark">',
        '<div class="hbd-logo-mark glitch-hover" data-text="HB">'
    )
    
    # For service cards, the class is likely 'service-card'
    comp_js = comp_js.replace("className = 'service-card';", "className = 'service-card hbd-3d-card';")
    comp_js = comp_js.replace('class="service-card"', 'class="service-card hbd-3d-card"')
    
    with open('js/components.js', 'w', encoding='utf-8') as f:
        f.write(comp_js)
    print("Updated components.js")
except Exception as e:
    print(f"Error components.js: {e}")

