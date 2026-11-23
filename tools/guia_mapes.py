#!/usr/bin/env python3
"""Mapes de base de l'app del guia (guia/img/ i guia/mapes.js).

L'app del guia dibuixa el seu propi mapa. Quan no hi ha teselles d'OpenTopoMap desades al mòbil,
fa servir de fons els mapes de l'Atles cartogràfic (assets/maps/*-ca.webp), que ja estan
georeferenciats en Web Mercator. Aquest script calcula la finestra de cada mapa amb el mateix
codi de tools/atles.py, en fa una còpia lleugera en JPEG i escriu guia/mapes.js.

Executa-ho des de l'arrel, després de  python3 tools/atles.py:   python3 tools/guia_mapes.py
Només necessita Pillow (no baixa res: les teselles no es tornen a demanar).
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import atles  # noqa: E402

class Prou(Exception):
    pass

finestra = {}
def captura(x0, y0, x1, y1, out_w):
    finestra['box'] = [x0, y0, x1, y1]
    raise Prou()
atles.basemap = captura

class Llenç:  # canvas mut: només cal arribar a la crida de basemap()
    def __getattr__(self, _):
        return lambda *a, **k: self
llenç = Llenç()

def bbox(fn, *args):
    finestra.clear()
    try:
        fn(llenç, *args)
    except Prou:
        return finestra['box']
    raise RuntimeError('No s’ha trobat la finestra del mapa')

maps = []
def afegeix(clau, src, box, amplada):
    im = Image.open(os.path.join(ROOT, 'assets', 'maps', src)).convert('RGB')
    h = round(im.height * amplada / im.width)
    out = os.path.join(ROOT, 'guia', 'img', f'mapa-{clau}.jpg')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.resize((amplada, h), Image.LANCZOS).save(out, 'JPEG', quality=72, optimize=True, progressive=True)
    maps.append({'k': clau, 'src': f'img/mapa-{clau}.jpg', 'box': [round(v, 9) for v in box], 'size': [amplada, h]})
    print(f'  guia/img/mapa-{clau}.jpg ({os.path.getsize(out) // 1024} kB)', file=sys.stderr)

afegeix('general', 'general-ca.webp', bbox(atles.overview), 1800)
for i in range(atles.NPAGES - 1):
    if i < len(atles.DAYS):
        d = atles.DAYS[i]; clau = f'd{d["day"]}'; src = f'jornada-{d["day"]}-ca.webp'; arg = d
    else:
        st = atles.CSTAGES[i - len(atles.DAYS)]; clau = st['code'].lower(); src = f'pla-c-{clau}-ca.webp'; arg = None
    afegeix(clau, src, bbox(atles.page, i, arg), 1500)

with open(os.path.join(ROOT, 'guia', 'mapes.js'), 'w', encoding='utf8') as f:
    f.write('/* Mapes de l’Atles cartogràfic per al fons del mapa de l’app quan no hi ha teselles desades.\n'
            '   box: finestra en Web Mercator normalitzat [x0, y0, x1, y1] (0..1, y cap al sud). Generat amb tools/guia_mapes.py. */\n')
    f.write('window.MAPES = ' + json.dumps(maps, ensure_ascii=False) + ';\n')
print('guia/mapes.js', file=sys.stderr)
