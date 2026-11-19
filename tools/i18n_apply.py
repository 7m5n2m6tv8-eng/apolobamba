#!/usr/bin/env python3
"""Afegeix l'anglès i el francès a content.js: window.COPY.en / .fr (de tools/i18n_web.py) i els noms dels punts
de pas de window.DAYS (de tools/i18n_plans.py). També hi aplica tools/fitxa_data.py als quatre idiomes. Comprova que l'estructura sigui la mateixa que en català.
Executa-ho des de l'arrel:  python3 tools/i18n_apply.py   (després de python3 tools/plans_data.py)"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import i18n_web as W, i18n_plans as T, fitxa_data as F

def shape(a, b, path=''):
    errs = []
    if isinstance(a, dict):
        for k in a:
            if k not in b: errs.append(f'falta {path}.{k}')
            else: errs += shape(a[k], b[k], f'{path}.{k}')
    elif isinstance(a, list):
        if not isinstance(b, list) or len(a) != len(b): errs.append(f'llargada diferent a {path}')
        else:
            for i, (x, y) in enumerate(zip(a, b)): errs += shape(x, y, f'{path}[{i}]')
    return errs

p = os.path.join(ROOT, 'content.js'); src = open(p, encoding='utf8').read()
m = re.search(r'window\.COPY = ', src); C, end = json.JSONDecoder().raw_decode(src, m.end())
C['en'], C['fr'] = W.EN, W.FR
F.apply(C)  # nivell, requisits, reserva, cancel·lació i material (tools/fitxa_data.py), als quatre idiomes
for L in ('en', 'fr'):
    e = shape(C['ca'], C[L], L)
    if e: print('\n'.join(e)); sys.exit(1)
src = src[:m.end()] + json.dumps(C, ensure_ascii=False) + src[end:]
m = re.search(r'window\.DAYS = ', src); D, end = json.JSONDecoder().raw_decode(src, m.end())
for d in D:
    for pt in d['points']:
        pt['en'], pt['fr'] = T.point(pt['ca'])
src = src[:m.end()] + json.dumps(D, ensure_ascii=False) + src[end:]
open(p, 'w', encoding='utf8').write(src)
print('content.js: COPY.en, COPY.fr i noms de DAYS en/fr')
