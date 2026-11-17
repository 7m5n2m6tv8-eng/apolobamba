#!/usr/bin/env python3
"""Genera els GPX de la ruta principal, de cada pla B (per jornada) i del pla C a dossiers/gpx/.

Executa-ho des de l'arrel:  python3 tools/gpx.py
Dades: content.js (DAYS i PLANS), guia/track.js (track de 2012) i guia/planc.js (pla C i rutes dels plans B,
calculades sobre OpenStreetMap). Els noms van en català.
"""
import json, os, re
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dossiers', 'gpx')

def load(path, name):
    src = open(os.path.join(ROOT, path), encoding='utf8').read()
    m = re.search(r'window\.' + name + r'\s*=\s*', src)
    return json.JSONDecoder().raw_decode(src, m.end())[0]

DAYS = load('content.js', 'DAYS'); PLANS = load('content.js', 'PLANS')
TR = load('guia/track.js', 'TRACK'); PC = load('guia/planc.js', 'PLANC')
COPY = load('content.js', 'COPY')

def wpt(lat, lon, name, ele=None, desc=None):
    e = f'<ele>{ele}</ele>' if ele is not None else ''
    d = f'<desc>{escape(desc)}</desc>' if desc else ''
    return f'<wpt lat="{lat}" lon="{lon}">{e}<name>{escape(name)}</name>{d}</wpt>'

def trk(name, pts, desc=''):
    seg = '\n'.join(f'<trkpt lat="{p[0]}" lon="{p[1]}">' + (f'<ele>{p[2]}</ele>' if len(p) > 2 else '') + '</trkpt>' for p in pts)
    d = f'<desc>{escape(desc)}</desc>' if desc else ''
    return f'<trk><name>{escape(name)}</name>{d}<trkseg>\n{seg}\n</trkseg></trk>'

def write(fname, title, desc, body):
    os.makedirs(OUT, exist_ok=True)
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Andes Wild Trek · tools/gpx.py" '
           'xmlns="http://www.topografix.com/GPX/1/1">\n'
           f'<metadata><name>{escape(title)}</name><desc>{escape(desc)}</desc></metadata>\n' + '\n'.join(body) + '\n</gpx>\n')
    open(os.path.join(OUT, fname), 'w', encoding='utf8').write(xml)
    print('  dossiers/gpx/' + fname)

SRC_MAIN = f'Track: {TR["author"]}, Wikiloc ({TR["year"]}). Planificació no reconeguda sobre el terreny.'
SRC_OSM = 'Rutes calculades sobre OpenStreetMap (ODbL, consulta del 17/11/2026) i altituds SRTM. Pendents de reconèixer.'

# Ruta principal
body = [wpt(p['ll'][0], p['ll'][1], f'Dia {d["day"]} · {p["ca"]}', p['ele']) for d in DAYS for i, p in enumerate(d['points']) if d['day'] == 5 or i > 0]
for i, d in enumerate(DAYS):
    a, b = TR['cut'][i], TR['cut'][i + 1]
    body.append(trk(f'Dia {d["day"]} · {COPY["ca"]["stageNames"][i]}', [p[:3] for p in TR['pts'][a:b + 1]]))
write('Apolobamba_Ruta_Principal.gpx', 'Apolobamba · Pelechuco – Charazani', SRC_MAIN, body)

# Plans B per jornada
for b in PLANS['b']:
    d = next(x for x in DAYS if x['day'] == b['day']); i = DAYS.index(d)
    a, c = TR['cut'][i], TR['cut'][i + 1]
    body = [trk(f'Dia {d["day"]} · ruta prevista', [p[:3] for p in TR['pts'][a:c + 1]], 'Referència: jornada del programa principal')]
    for r in PC['routes']:
        if r['day'] == d['day']:
            kind = 'a peu' if r['kind'] == 'walk' else 'pista per a vehicles'
            body.append(trk(r['ca'], r['pts'], f'{kind} · {str(r["km"]).replace(".", ",")} km · +{r["up"]:.0f}/−{r["down"]:.0f} m'))
    for e in PLANS['escapes']:
        if d['day'] in e['days']:
            body.append(wpt(e['ll'][0], e['ll'][1], 'Evacuació · ' + e['ca']))
    desc = ' | '.join(f'{t}: {x}' for t, x in b['ca'])
    write(f'Apolobamba_Pla_B_Dia{d["day"]}.gpx', f'Apolobamba · Pla B del dia {d["day"]}', desc + ' | ' + SRC_OSM, body)

# Pla C
body = []
for j, st in enumerate(PLANS['c']['stages']):
    body += [wpt(p['ll'][0], p['ll'][1], f'{st["code"]} · {p["ca"]}', p['ele']) for k, p in enumerate(st['points']) if j == 0 or k > 0]
    a, c = PC['cut'][j], PC['cut'][j + 1]
    body.append(trk(f'{st["code"]} · {st["ca"]["name"]}', [p[:3] for p in PC['pts'][a:c + 1]], f'{st["hours"]} · {str(st["km"]).replace(".", ",")} km'))
write('Apolobamba_Pla_C.gpx', PLANS['c']['ca']['title'], PLANS['c']['ca']['intro'] + ' ' + SRC_OSM, body)
