#!/usr/bin/env python3
"""Marca la web amb una versió nova perquè els navegadors carreguin sempre l'última.

Executa-ho des de l'arrel del repositori abans de fer commit:  python3 tools/stamp.py
"""
import hashlib, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'treball.html']
ASSETS = r'(site\.css|content\.js|extras\.js|photo-credits\.js|site\.js|modules\.js)'
STAMP = re.compile(r'\?v=[0-9a-f]{10}')
VAR = re.compile(r'window\.AWT_VERSION="[0-9a-f]*"')
SWC = re.compile(r"const CACHE = 'guia-apolobamba-[0-9a-z]+';")  # app del guia: versió de la memòria cau

def normalise(text):
    return VAR.sub('', STAMP.sub('', text))

h = hashlib.sha1()
for path in sorted(p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts and p.name != 'version.txt' and 'tools' not in p.parts):
    data = path.read_bytes()
    if path.name in PAGES:
        data = normalise(data.decode()).encode()
    if path.relative_to(ROOT).as_posix() == 'guia/sw.js':
        data = SWC.sub('', data.decode()).encode()
    h.update(str(path.relative_to(ROOT)).encode()); h.update(data)
version = h.hexdigest()[:10]
for name in PAGES:
    p = ROOT / name; s = STAMP.sub('', p.read_text())
    s = re.sub(ASSETS + r'"', lambda m: f'{m.group(1)}?v={version}"', s)
    s = VAR.sub(f'window.AWT_VERSION="{version}"', s)
    p.write_text(s)
sw = ROOT / 'guia' / 'sw.js'
sw.write_text(SWC.sub(f"const CACHE = 'guia-apolobamba-{version}';", sw.read_text()))
(ROOT / 'version.txt').write_text(version + '\n')
print(version)
