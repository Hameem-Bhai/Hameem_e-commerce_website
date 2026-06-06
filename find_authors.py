import re

with open('js/data.js', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r"author:\s*['\"](.*?)['\"]", content)
print(set(matches))
