import os
import glob

html_files = glob.glob('*.html')

emailjs_script = '  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>\n'
service_script = '  <script src="js/email-service.js"></script>\n'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    if 'email.min.js' not in content:
        content = content.replace('</head>', emailjs_script + '</head>')
        modified = True
        
    if 'email-service.js' not in content:
        content = content.replace('<script src="js/components.js"></script>', '<script src="js/components.js"></script>\n' + service_script)
        modified = True
        
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file}")

print("Done patching HTML files.")
