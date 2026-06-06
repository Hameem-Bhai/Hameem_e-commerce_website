import re

with open('css/base.css', 'r', encoding='utf-8') as f:
    content = f.read()

# The file got corrupted - find and fix the garbled block
# Find "Section Headers" and everything up to end of file, replace cleanly

# First find where the corruption starts - look for the garbled unicode
bad_start = content.find('\n/* Section Headers */')
if bad_start == -1:
    # Maybe it's at different location, look from end of star ratings
    bad_start = content.find('/* ══════════════════════════════════════════════════════════════\n   HBD STAR RATINGS')

# Find the healthy end of star ratings section
star_start = content.find('/* ══════════════════════════════════════════════════════════════\n   HBD STAR RATINGS')

print(f"File length: {len(content)}")
print(f"Star ratings section at: {star_start}")

# Show 200 chars around the corruption
bad_pos = content.find('════════════════════\xef\xbf\xbd')
if bad_pos == -1:
    bad_pos = content.find('════════════════════')
    # Find which one has the garbled chars after it
    idx = bad_pos
    while idx < len(content):
        if content[idx] == '\n' and content[idx+1:idx+3] == '/*':
            break
        idx += 1
    print("Potential corruption near:", repr(content[bad_pos:bad_pos+100]))
