content = open('js/components.js', 'r', encoding='utf-8').read()

START = '  var HB_LOGO_SVG ='
# Find the end: the closing '</svg>'; line
# After the replacement the end marker is the old svg end
# Let's just find the semicolon after the last '</svg>'

start_idx = content.index(START)

# Find the next semicolon that ends the var declaration (after the last + ')
# The pattern is always: ends with "    '</svg>';"
END_MARKER = "    '</svg>';"
end_idx = content.index(END_MARKER, start_idx) + len(END_MARKER)

new_logo = "  var HB_LOGO_SVG = '<div class=\"hbd-logo-mark\"><span class=\"hbd-logo-mark__text\">HB</span></div>';"

result = content[:start_idx] + new_logo + content[end_idx:]
open('js/components.js', 'w', encoding='utf-8').write(result)
print('Done. Replaced', end_idx - start_idx, 'chars with', len(new_logo), 'chars.')
