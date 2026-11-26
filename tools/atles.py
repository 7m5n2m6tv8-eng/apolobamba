#!/usr/bin/env python3
"""Genera l'Atles cartogràfic A3 (dossiers/Apolobamba_Atles_Cartografic_A3.pdf).

Una pàgina per jornada a peu (les sis jornades de window.DAYS, a content.js), amb el mapa
topogràfic d'OpenTopoMap, el recorregut del track GPS (guia/track.js), els punts de pas
numerats amb els topònims normalitzats en català, el perfil i les dades de la jornada.

Executa-ho des de l'arrel del repositori:  python3 tools/atles.py
Necessita: reportlab i Pillow (pip install reportlab pillow) i connexió a tile.opentopomap.org.
Les teselles es desen a .cache/teselles (no es pugen al repositori).
També crea els mapes de cada jornada per al dossier del client (assets/maps/jornada-<dia>-<ca|es>.webp);
després cal executar  node tools/dossier.js  per posar-los al dossier.
"""
import io, json, math, os, re, sys, time, urllib.request
from PIL import Image
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.colors import HexColor, white, Color
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dossiers', 'Apolobamba_Atles_Cartografic_A3.pdf')
CACHE = os.environ.get('TILE_CACHE', os.path.join(ROOT, '.cache', 'teselles'))
TILE_URL = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
UA = 'Apolobamba-TD2-atles/1.0 (treball academic; github.com/7m5n2m6tv8-eng/apolobamba)'

# ---------- dades ----------
def load(path, name):
    src = open(os.path.join(ROOT, path), encoding='utf8').read()
    m = re.search(r'window\.' + name + r'\s*=\s*', src)
    return json.JSONDecoder().raw_decode(src, m.end())[0]

DAYS = load('content.js', 'DAYS')
TRACK = load('guia/track.js', 'TRACK')
PTS, CUT = TRACK['pts'], TRACK['cut']
assert len(DAYS) == 6 and len(CUT) == 7, 'S’esperen sis jornades'
PLANS = load('content.js', 'PLANS')
PLANC = load('guia/planc.js', 'PLANC')
CPTS, CCUT, ALT = PLANC['pts'], PLANC['cut'], PLANC['alt']
ROUTES = PLANC.get('routes', [])
CSTAGES = PLANS['c']['stages']
NPAGES = 1 + len(DAYS) + len(CSTAGES)   # mapa general + jornades + pla C
VEHC = HexColor('#d9822b')

# Topònims normalitzats: els de content.js (taula de normalització del treball, cap. 9).
# «Agua buena 1–4» es manté perquè és el nom dels punts d'aigua del GPS que fa servir el treball.
LANGS = ('ca', 'es', 'en', 'fr')
LANG = 'ca'      # idioma de les etiquetes del mapa (l'atles és en català; 'es' només per als mapes del dossier)
EXPORT = False   # True quan es dibuixen els mapes per al dossier (sense l'escala numèrica d'A3)
def name(p):
    return p.get(LANG) or p['es']

NOTES = {
    5: ['Pas 1 (4.706 m): no es creua amb neu o gel, mala visibilitat, vent fort o tempesta.',
        'Pla B: tornar a Pelechuco (6,4 km com a màxim). La pista Pelechuco–Hilo Hilo creua el Pas 1: un 4×4 pot arribar al pas i al Campament 1.',
        'Nit 508 m més amunt que Pelechuco: valoració de cada persona al vespre i al matí.'],
    6: ['Jornada curta de recuperació. Camp acordat amb la comunitat d’Hilo Hilo.',
        'Pla B: Hilo Hilo té pista a Pelechuco (uns 20 km). Dia de reserva si algú necessita més aclimatació.'],
    7: ['Última mitja volta còmoda: Agua buena 3, 13.40. Hora límit al Pas Sunchulli: 14.40; si no, mitja volta i 4×4 per la pista. Amb neu dura o gel no es creua.',
        'Evacuació: la pista Hilo Hilo–Sorapata arriba al pas; després del pas, Sunchully (2,6 km) té pista a Sorapata.',
        'Aigua: res del riu Sunchulli ni per sota de les mines; 2–3 l per persona des d’Agua buena 3.',
        'Campament 2: lluny del campament miner, a l’emplaçament més baix de la vall (≈4.500 m).'],
    8: ['Pla B1: amb neu, gel o poca visibilitat, baixada alternativa pel sud del Pas 5 (línia de punts): 2,9 km, −600 m; un tram de ~200 m per reconèixer.',
        'Pla B2: Quellwa Cota (4.460 m, a 1 km): acampar amb permís o evacuar per la pista a Sunchully.',
        'Pla B3: abans del Pas 4, tornar al Campament 2.'],
    9: ['Amb tempesta, neu o gel previstos als colls, no es comença la pujada: quedar-se a Incacancha.',
        'Sortida per l’est: etapes C3 i C4 del pla C (19,4 km, màxim 4.060 m).',
        'Evacuació: el Campament 3 és a 600 m d’una pista a Cañisaya (4,8 km) i Curva.'],
    10: ['Cruïlla de Curva (11.10): si el grup va just o Charazani passaria de les 16.10, final a Curva i vehicle.',
         'Sense confirmació recent del pont, el final és a Curva.',
         'Abans de sortir, comprovar a l’ABC la RN16 Charazani–Escoma.'],
    'C1': ['Jornada curta d’aclimatació. Camp a Cañisaya acordat amb la comunitat.',
           'Evacuació: tot el tram va per pista; vehicle des de Curva.'],
    'C2': ['Hora límit al Pas d’Akamani: 13.10. Si no, tornar al Campament 3.',
           'Amb tempesta, neu o gel previstos, no es comença la pujada.',
           'Evacuació: el Campament 3 és a 600 m d’una pista a Cañisaya.'],
    'C3': ['Jornada llarga però sense passos alts.',
           'Aigua de fonts laterals, mai del riu principal.',
           'Camp a Huayrapata per acordar amb la comunitat.'],
    'C4': ['El vehicle espera a la RN16 (tram Charazani–Apolo): comprovar-ne l’estat a l’ABC el dia abans.',
           'Antiga mina d’antimoni: no agafar aigua a la zona.',
           'Si el vehicle no hi pot arribar: a peu fins a Charazani, 8,7 km i +550/−740 m (5–6 h).'],
}

COLORS = ['#b4573a', '#1c7c86', '#2b5fa8', '#b8860b', '#2f7d4f', '#9b3d5a']
CCOLOR = '#6a3d9a'
ESC = HexColor('#b4573a')
INK, MUTED, ACCENT, LINE = HexColor('#163e33'), HexColor('#5b6b64'), HexColor('#1c7c86'), HexColor('#d6ddd9')

# ---------- format català ----------
def fmt(n):
    return f'{round(n):,}'.replace(',', '.')
def dec(x, n=1):
    s = f'{abs(x):.{n}f}'.replace('.', ',')
    return ('−' if x < 0 else '') + s
def deg(x, n=5):
    return dec(x, n) + '°'

# ---------- fonts ----------
FD = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('Sans', FD + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('Sans-Bold', FD + 'DejaVuSans-Bold.ttf'))
cond = FD + 'DejaVuSansCondensed.ttf'
pdfmetrics.registerFont(TTFont('Cond', cond if os.path.exists(cond) else FD + 'DejaVuSans.ttf'))
condb = FD + 'DejaVuSansCondensed-Bold.ttf'
pdfmetrics.registerFont(TTFont('Cond-Bold', condb if os.path.exists(condb) else FD + 'DejaVuSans-Bold.ttf'))

# ---------- UTM 19S (WGS84) ----------
UTM_ZONE, DECL = 19, '9,8° O'
def utm_inv(E, N, zone=UTM_ZONE, south=True):
    """UTM (WGS84) -> (lat, lon) en graus."""
    a, f = 6378137.0, 1 / 298.257223563; e2 = f * (2 - f); ep2 = e2 / (1 - e2); k0 = 0.9996
    x = E - 500000.0; y = N - (10000000.0 if south else 0)
    M = y / k0; mu = M / (a * (1 - e2 / 4 - 3 * e2**2 / 64 - 5 * e2**3 / 256))
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    p1 = mu + (3 * e1 / 2 - 27 * e1**3 / 32) * math.sin(2 * mu) + (21 * e1**2 / 16 - 55 * e1**4 / 32) * math.sin(4 * mu) \
        + (151 * e1**3 / 96) * math.sin(6 * mu) + (1097 * e1**4 / 512) * math.sin(8 * mu)
    n1 = a / math.sqrt(1 - e2 * math.sin(p1)**2); t1 = math.tan(p1)**2; c1 = ep2 * math.cos(p1)**2
    r1 = a * (1 - e2) / (1 - e2 * math.sin(p1)**2)**1.5; d = x / (n1 * k0)
    lat = p1 - (n1 * math.tan(p1) / r1) * (d**2 / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1**2 - 9 * ep2) * d**4 / 24
        + (61 + 90 * t1 + 298 * c1 + 45 * t1**2 - 252 * ep2 - 3 * c1**2) * d**6 / 720)
    lon = (d - (1 + 2 * t1 + c1) * d**3 / 6 + (5 - 2 * c1 + 28 * t1 - 3 * c1**2 + 8 * ep2 + 24 * t1**2) * d**5 / 120) / math.cos(p1)
    return math.degrees(lat), (zone - 1) * 6 - 180 + 3 + math.degrees(lon)

def utm_fwd(lat, lon, zone=UTM_ZONE):
    """(lat, lon) -> UTM (E, N) hemisferi sud, per iteració sobre utm_inv."""
    E, N = 500000.0, 10000000.0 + lat * 110574.0
    for _ in range(8):
        la, lo = utm_inv(E, N, zone)
        N += (lat - la) * 110574.0; E += (lon - lo) * 111320.0 * math.cos(math.radians(lat))
    return E, N

# ---------- Web Mercator i teselles ----------
def merc(lat, lon):
    """Coordenades normalitzades 0..1 (x cap a l'est, y cap al sud)."""
    s = math.sin(math.radians(lat))
    return (lon + 180) / 360, 0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)

def unmerc(x, y):
    lon = x * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y))))
    return lat, lon

def tile(z, x, y):
    path = os.path.join(CACHE, str(z), str(x), f'{y}.png')
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        url = TILE_URL.format(s='abc'[(x + y) % 3], z=z, x=x, y=y)
        for attempt in range(4):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': UA})
                data = urllib.request.urlopen(req, timeout=60).read()
                Image.open(io.BytesIO(data)).verify()
                open(path, 'wb').write(data)
                break
            except Exception as e:
                if attempt == 3:
                    raise RuntimeError(f'No s’ha pogut baixar {url}: {e}')
                time.sleep(2 * (attempt + 1))
        time.sleep(0.15)
    return Image.open(path).convert('RGB')

def basemap(x0, y0, x1, y1, out_w):
    """Mosaic d'OpenTopoMap per a la finestra normalitzada (x0,y0)-(x1,y1), a out_w píxels d'amplada."""
    z = 13
    while z < 17 and (x1 - x0) * 256 * 2 ** z < out_w * 0.95:
        z += 1
    n = 2 ** z
    tx0, tx1 = int(x0 * n), int(x1 * n)
    ty0, ty1 = int(y0 * n), int(y1 * n)
    mosaic = Image.new('RGB', ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            mosaic.paste(tile(z, tx, ty), ((tx - tx0) * 256, (ty - ty0) * 256))
    box = ((x0 * n - tx0) * 256, (y0 * n - ty0) * 256, (x1 * n - tx0) * 256, (y1 * n - ty0) * 256)
    out_h = round(out_w * (y1 - y0) / (x1 - x0))
    img = mosaic.resize((out_w, out_h), Image.LANCZOS, box=box)
    print(f'  base: zoom {z}, {(tx1 - tx0 + 1) * (ty1 - ty0 + 1)} teselles', file=sys.stderr)
    return img

def haversine(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371000 * math.asin(math.sqrt(h))

# ---------- utilitats de dibuix ----------
def halo_text(c, x, y, s, font, size, fill, anchor='left', halo=2.6):
    w = pdfmetrics.stringWidth(s, font, size)
    if anchor == 'center': x -= w / 2
    elif anchor == 'right': x -= w
    c.saveState()
    c.setStrokeColor(white); c.setLineWidth(halo); c.setLineJoin(1)
    t = c.beginText(x, y); t.setFont(font, size); t.setTextRenderMode(1); t.textOut(s); c.drawText(t)
    c.restoreState()
    c.setFillColor(fill); c.setFont(font, size); c.drawString(x, y, s)
    return w

def wrap(s, font, size, width):
    lines, cur = [], ''
    for word in s.split():
        test = (cur + ' ' + word).strip()
        if pdfmetrics.stringWidth(test, font, size) <= width: cur = test
        else: lines.append(cur); cur = word
    if cur: lines.append(cur)
    return lines

def nice(span, target):
    raw = span / target
    p = 10 ** math.floor(math.log10(raw))
    return min((m * p for m in (1, 2, 2.5, 5, 10)), key=lambda v: abs(v - raw))

# ---------- pàgina ----------
W, H = landscape(A3)
M = 34
MAP = (M + 26, 214, 760, 534)          # x, y, amplada, alçada del mapa
PANEL_X = MAP[0] + MAP[2] + 34
PANEL_W = W - M - PANEL_X
PROF = (MAP[0], 70, MAP[2], 100)       # perfil

def page(c, i, day, pageno=None):
    pageno = pageno or i + 2
    planc = i >= len(DAYS)
    if planc:
        j = i - len(DAYS)
        st = CSTAGES[j]
        day = dict(st, day=st['day'], points=st['points'])
        col = HexColor(CCOLOR)
        seg = CPTS[CCUT[j]:CCUT[j + 1] + 1]
        others = [(CPTS[:CCUT[j] + 1], 'rest'), (CPTS[CCUT[j + 1]:], 'rest'), (PTS, 'main')]
        title = f'Pla C · {st["code"]} · ' + ((st.get(LANG) or st['es'])['name'].replace(' → ', ' – '))
        subtitle = f'Etapa {j + 1} de 4 del pla C (dia {st["day"]}) · Variant Cañisaya – Akamani – Charazani · Serralada d’Apolobamba (Bolívia)'
        notes = NOTES[st['code']]
        night = f'{(st.get(LANG) or st["es"])["night"].split(",")[0]} · {st["nightLabel"]}'
        escapes = []
    else:
        col = HexColor(COLORS[i])
        a, b = CUT[i], CUT[i + 1]
        seg = PTS[a:b + 1]
        others = [(PTS[:a + 1], 'rest'), (PTS[b:], 'rest'), (CPTS, 'planc')]
        first, last = name(day['points'][0]), name(day['points'][-1])
        via = [name(p) for p in day['points'] if p['ca'] == 'Pas Sunchulli']
        title = f'Dia {day["day"]} · ' + ' – '.join([first] + via + [last])
        subtitle = f'Jornada {i + 1} de 6 a peu · Travessa Pelechuco – Charazani · Serralada d’Apolobamba (Bolívia)'
        notes = NOTES[day['day']]
        night = f'{last} · {"allotjament local" if day["day"] == 10 else "tenda"} · {day["nightLabel"]}'
        escapes = [e for e in PLANS['escapes'] if day['day'] in e['days']]
    last = name(day['points'][-1])

    # capçalera
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 10.5)
    c.drawString(M, H - M - 8, 'ANDES WILD TREK  /  ATLES CARTOGRÀFIC' + ('  /  PLA C' if planc else ''))
    c.setFillColor(INK); c.setFont('Sans-Bold', 22)
    c.drawString(M, H - M - 36, title)
    c.setFillColor(MUTED); c.setFont('Sans', 10.5)
    c.drawString(M, H - M - 54, subtitle)
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.line(M, H - M - 66, W - M, H - M - 66)

    # finestra del mapa (amb marge i la proporció del marc)
    mx, my, mw, mh = MAP
    xy = [merc(p[0], p[1]) for p in seg] + [merc(*p['ll']) for p in day['points']]
    if not planc and day['day'] == 8: xy += [merc(p[0], p[1]) for r in ROUTES if r['day'] == 8 and r['kind'] == 'walk' for p in r['pts']]
    x0, x1 = min(p[0] for p in xy), max(p[0] for p in xy)
    y0, y1 = min(p[1] for p in xy), max(p[1] for p in xy)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    min_span = 3200 / (2 * math.pi * 6371000 * math.cos(math.radians(seg[0][0])))  # ≥ 3,2 km
    sx, sy = max(x1 - x0, min_span) * 1.32, max(y1 - y0, min_span) * 1.22
    if sx / sy < mw / mh: sx = sy * mw / mh
    else: sy = sx * mh / mw
    X0, X1, Y0, Y1 = cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2
    to_page = lambda lat, lon: (mx + (merc(lat, lon)[0] - X0) / sx * mw, my + mh - (merc(lat, lon)[1] - Y0) / sy * mh)

    img = basemap(X0, Y0, X1, Y1, 2300)
    buf = io.BytesIO(); img.save(buf, 'JPEG', quality=84, optimize=True); buf.seek(0)
    c.drawImage(ImageReader(buf), mx, my, mw, mh)

    c.saveState()
    p = c.beginPath(); p.rect(mx, my, mw, mh); c.clipPath(p, stroke=0)
    # quadrícula UTM 19S cada 1 km (WGS84)
    latN_, lonW_ = unmerc(X0, Y0); latS_, lonE_ = unmerc(X1, Y1)
    cs = [utm_fwd(latN_, lonW_), utm_fwd(latN_, lonE_), utm_fwd(latS_, lonW_), utm_fwd(latS_, lonE_)]
    Emin, Emax = min(q[0] for q in cs), max(q[0] for q in cs); Nmin, Nmax = min(q[1] for q in cs), max(q[1] for q in cs)
    UTM_LAB = []
    c.setStrokeColor(Color(0.1, 0.25, 0.55, 0.55)); c.setLineWidth(0.45)
    for E in range(int(math.ceil(Emin / 1000)) * 1000, int(Emax) + 1, 1000):
        pts = [to_page(*utm_inv(E, N)) for N in range(int(Nmin) - 500, int(Nmax) + 1500, 500)]
        pa = c.beginPath(); pa.moveTo(*pts[0]); [pa.lineTo(*q) for q in pts[1:]]; c.drawPath(pa, stroke=1, fill=0)
        UTM_LAB.append(('E', E, to_page(*utm_inv(E, Nmax))))
    for N in range(int(math.ceil(Nmin / 1000)) * 1000, int(Nmax) + 1, 1000):
        pts = [to_page(*utm_inv(E, N)) for E in range(int(Emin) - 500, int(Emax) + 1500, 500)]
        pa = c.beginPath(); pa.moveTo(*pts[0]); [pa.lineTo(*q) for q in pts[1:]]; c.drawPath(pa, stroke=1, fill=0)
        UTM_LAB.append(('N', N, to_page(*utm_inv(Emax, N))))
    # resta de la travessa
    def poly(points, color, width, dash=None):
        path = c.beginPath()
        for k, q in enumerate(points):
            X, Y = to_page(q[0], q[1])
            path.moveTo(X, Y) if k == 0 else path.lineTo(X, Y)
        c.setStrokeColor(color); c.setLineWidth(width); c.setLineJoin(1); c.setLineCap(1)
        c.setDash(*(dash or ([], 0))); c.drawPath(path, stroke=1, fill=0); c.setDash([], 0)
    for part, kind in others:
        if len(part) > 1:
            if kind == 'planc':
                poly(part, white, 3.4); poly(part, Color(0.42, 0.24, 0.6, 0.85), 1.6, ([6, 4], 0))
            elif kind == 'main':
                poly(part, white, 3.2); poly(part, Color(0.2, 0.2, 0.2, 0.6), 1.3, ([2, 3], 0))
            else:
                poly(part, white, 3.6); poly(part, Color(0.2, 0.2, 0.2, 0.75), 1.5, ([4, 3], 0))
    if not planc:
        for r in ROUTES:
            if r['day'] != day['day']: continue
            if r['kind'] == 'walk':
                poly(r['pts'], white, 5); poly(r['pts'], ESC, 2.6, ([1.5, 3.5], 0))
            else:
                poly(r['pts'], white, 4.4); poly(r['pts'], VEHC, 2.2, ([7, 3], 0))
    poly(seg, white, 6.5)
    poly(seg, col, 3.2)

    # punts de pas i etiquetes (col·locació simple sense solapaments)
    placed = []
    marks = [to_page(*p['ll']) for p in day['points']]
    for (X, Y) in marks: placed.append((X - 9, Y - 9, X + 9, Y + 9))
    for k, p in enumerate(day['points']):
        X, Y = marks[k]
        r = 8.5 if k in (0, len(day['points']) - 1) else 7.5
        c.setFillColor(col); c.setStrokeColor(white); c.setLineWidth(1.8); c.circle(X, Y, r, stroke=1, fill=1)
        c.setFillColor(white); c.setFont('Sans-Bold', 8.5); c.drawCentredString(X, Y - 3, str(k + 1))
    for k, p in enumerate(day['points']):
        X, Y = marks[k]
        l1, l2 = name(p), f'{fmt(p["ele"])} m'
        w = max(pdfmetrics.stringWidth(l1, 'Sans-Bold', 10), pdfmetrics.stringWidth(l2, 'Sans', 8.5)) + 4
        h = 23
        best = None
        for dx, dy in ((13, -4), (-13 - w, -4), (13, -20), (-13 - w, -20), (13, 10), (-13 - w, 10),
                       (-w / 2, 13), (-w / 2, -32), (24, -4), (-24 - w, -4), (13, 26), (-13 - w, -36)):
            box = (X + dx, Y + dy - 9, X + dx + w, Y + dy - 9 + h)
            inside = box[0] > mx + 4 and box[2] < mx + mw - 4 and box[1] > my + 4 and box[3] < my + mh - 4
            hits = sum(1 for o in placed if not (box[2] < o[0] or box[0] > o[2] or box[3] < o[1] or box[1] > o[3]))
            score = hits * 10 + (0 if inside else 50)
            if best is None or score < best[0]: best = (score, dx, dy, box)
            if score == 0: break
        _, dx, dy, box = best
        placed.append(box)
        halo_text(c, X + dx + 2, Y + dy + 3, l1, 'Sans-Bold', 10, INK, halo=3)
        halo_text(c, X + dx + 2, Y + dy - 7, l2, 'Sans', 8.5, MUTED, halo=3)
    for e in escapes:
        X, Y = to_page(*e['ll'])
        if not (mx + 8 < X < mx + mw - 8 and my + 8 < Y < my + mh - 8): continue
        c.setFillColor(ESC); c.setStrokeColor(white); c.setLineWidth(1.5); c.rect(X - 6, Y - 6, 12, 12, stroke=1, fill=1)
        c.setFillColor(white); c.setFont('Sans-Bold', 7.5); c.drawCentredString(X, Y - 2.6, 'E')
        lab = e[LANG]; w = pdfmetrics.stringWidth(lab, 'Sans-Bold', 8.5) + 4
        best = None
        for dx, dy in ((10, -3), (-10 - w, -3), (-w / 2, 10), (-w / 2, -18)):
            box = (X + dx, Y + dy - 3, X + dx + w, Y + dy + 9)
            inside = box[0] > mx + 4 and box[2] < mx + mw - 4 and box[1] > my + 4 and box[3] < my + mh - 4
            hits = sum(1 for o in placed if not (box[2] < o[0] or box[0] > o[2] or box[3] < o[1] or box[1] > o[3]))
            score = hits * 10 + (0 if inside else 50)
            if best is None or score < best[0]: best = (score, dx, dy, box)
        _, dx, dy, box = best; placed.append(box)
        halo_text(c, X + dx + 2, Y + dy, lab, 'Sans-Bold', 8.5, ESC, halo=3)
    c.restoreState()

    # marc, coordenades, nord i escala
    c.setStrokeColor(INK); c.setLineWidth(1); c.rect(mx, my, mw, mh, stroke=1, fill=0)
    latN, lonW = unmerc(X0, Y0); latS, lonE = unmerc(X1, Y1)
    c.setFont('Sans', 7.5); c.setFillColor(MUTED)
    step = nice(lonE - lonW, 4)
    v = math.ceil(lonW / step) * step
    while v < lonE:
        X = mx + (merc(latS, v)[0] - X0) / sx * mw
        if mx + 25 < X < mx + mw - 25:
            c.line(X, my, X, my - 4); c.drawCentredString(X, my - 13, deg(v, 3))
        v += step
    step = nice(latN - latS, 4)
    v = math.ceil(latS / step) * step
    while v < latN:
        Y = my + mh - (merc(v, lonW)[1] - Y0) / sy * mh
        if my + 25 < Y < my + mh - 25:
            c.line(mx, Y, mx - 4, Y)
            c.saveState(); c.translate(mx - 8, Y); c.rotate(90); c.drawCentredString(0, 0, deg(v, 3)); c.restoreState()
        v += step
    # etiquetes UTM (km) a dalt i a la dreta
    c.setFont('Sans', 6.8); c.setFillColor(Color(0.1, 0.25, 0.55))
    for kind, v, (X, Y) in UTM_LAB:
        if kind == 'E' and mx + 20 < X < mx + mw - 20: c.drawCentredString(X, my + mh + 4, f'{v // 1000}')
        if kind == 'N' and my + 20 < Y < my + mh - 20: c.drawString(mx + mw + 3, Y - 2.4, f'{v // 1000}')
    c.setFont('Sans', 7.5)
    c.drawCentredString(mx + mw / 2, my - 24, 'Longitud · WGS84')
    c.saveState(); c.translate(mx - 25, my + mh / 2); c.rotate(90); c.drawCentredString(0, 0, 'Latitud · WGS84'); c.restoreState()

    nx, ny = mx + mw - 30, my + mh - 48
    c.setFillColor(white); c.setStrokeColor(INK); c.setLineWidth(0.8)
    c.roundRect(nx - 14, ny - 6, 28, 42, 3, stroke=1, fill=1)
    path = c.beginPath(); path.moveTo(nx, ny + 22); path.lineTo(nx - 6, ny + 2); path.lineTo(nx, ny + 7); path.lineTo(nx + 6, ny + 2); path.close()
    c.setFillColor(INK); c.drawPath(path, stroke=0, fill=1)
    c.setFont('Sans-Bold', 9); c.drawCentredString(nx, ny + 25, 'N')
    halo_text(c, nx - 56, ny - 18, f'Declinació {DECL} (juny 2027)', 'Sans-Bold', 7.5, INK, halo=2.6)

    m_per_pt = haversine(unmerc(X0, cy), unmerc(X1, cy)) / mw
    length = nice(mw * m_per_pt / 5, 1)
    bar = length / m_per_pt
    bx, by = mx + 14, my + 14
    c.setFillColor(Color(1, 1, 1, 0.88)); c.setStrokeColor(Color(1, 1, 1, 0))
    c.roundRect(bx - 6, by - 6, bar + 130, 24, 3, stroke=0, fill=1)
    for k in range(4):
        c.setFillColor(INK if k % 2 == 0 else white); c.setStrokeColor(INK); c.setLineWidth(0.6)
        c.rect(bx + bar * k / 4, by, bar / 4, 4, stroke=1, fill=1)
    c.setFillColor(INK); c.setFont('Sans', 7.5)
    c.drawString(bx, by + 7, '0')
    label = f'{dec(length / 1000, 1 if length % 1000 else 0)} km' if length >= 1000 else f'{fmt(length)} m'
    c.drawString(bx + bar + 5, by + 0.5, label)
    c.setFont('Sans', 7); c.setFillColor(MUTED)
    if not EXPORT:
        c.drawString(bx + bar + 5 + pdfmetrics.stringWidth(label, 'Sans', 7.5) + 8, by + 0.5, f'(1:{fmt(round(m_per_pt / 0.000352778, -2))} en A3)')

    # perfil
    px, py, pw, ph = PROF
    k0 = seg[0][3]
    kmax = seg[-1][3] - k0
    emin = min(q[2] for q in seg); emax = max(q[2] for q in seg)
    lo, hi = math.floor((emin - 60) / 100) * 100, math.ceil((emax + 60) / 100) * 100
    PX = lambda k: px + pw * k / kmax
    PY = lambda e: py + ph * (e - lo) / (hi - lo)
    c.setStrokeColor(LINE); c.setLineWidth(0.5); c.setFont('Sans', 7); c.setFillColor(MUTED)
    estep = nice(hi - lo, 4)
    e = math.ceil(lo / estep) * estep
    while e <= hi:
        c.line(px, PY(e), px + pw, PY(e)); c.drawRightString(px - 4, PY(e) - 2.5, fmt(e)); e += estep
    kstep = nice(kmax, 8)
    k = 0
    while k <= kmax + 1e-6:
        c.drawCentredString(PX(k), py - 10, dec(k, 0 if kstep >= 1 else 1)); k += kstep
    c.drawCentredString(px + pw / 2, py - 21, 'Distància de l’etapa (km)' if planc else 'Distància de la jornada (km)')
    c.saveState(); c.translate(px - 30, py + ph / 2); c.rotate(90); c.drawCentredString(0, 0, 'Altitud (m)'); c.restoreState()
    path = c.beginPath(); path.moveTo(PX(0), py)
    for q in seg: path.lineTo(PX(q[3] - k0), PY(q[2]))
    path.lineTo(PX(kmax), py); path.close()
    c.setFillColor(Color(col.red, col.green, col.blue, 0.16)); c.drawPath(path, stroke=0, fill=1)
    path = c.beginPath()
    for n, q in enumerate(seg):
        (path.moveTo if n == 0 else path.lineTo)(PX(q[3] - k0), PY(q[2]))
    c.setStrokeColor(col); c.setLineWidth(1.6); c.drawPath(path, stroke=1, fill=0)
    scale_k = kmax / day['km']
    for n, p in enumerate(day['points']):
        X, Y = PX(p['km'] * scale_k), PY(p['ele'])
        c.setFillColor(col); c.setStrokeColor(white); c.setLineWidth(1.2); c.circle(X, Y, 5.6, stroke=1, fill=1)
        c.setFillColor(white); c.setFont('Sans-Bold', 6.5); c.drawCentredString(X, Y - 2.3, str(n + 1))
    c.setStrokeColor(INK); c.setLineWidth(0.6); c.rect(px, py, pw, ph, stroke=1, fill=0)

    # panell
    x, y = PANEL_X, H - M - 92
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'DADES DE L’ETAPA' if planc else 'DADES DE LA JORNADA'); y -= 8
    rows = [('Distància', f'{dec(day["km"])} km'),
            ('Desnivell', f'+{fmt(day["ascent"])} / −{fmt(day["descent"])} m'),
            ('Punt més alt', f'{fmt(day["max"])} m'),
            ('Durada prevista', day['hours'].replace('9 h 30', '9 h 30 min')),
            ('Sortida', day['start']),
            ('Arribada prevista', day['arrival']),
            ('Nit', night)]
    for k, v in rows:
        y -= 16
        c.setFillColor(MUTED); c.setFont('Sans', 9); c.drawString(x, y, k)
        c.setFillColor(INK); c.setFont('Sans-Bold', 9.5)
        if pdfmetrics.stringWidth(v, 'Sans-Bold', 9.5) > PANEL_W - 100:
            c.setFont('Cond-Bold', 9.5)
        c.drawRightString(x + PANEL_W, y, v)
        c.setStrokeColor(LINE); c.setLineWidth(0.4); c.line(x, y - 5, x + PANEL_W, y - 5)

    y -= 30
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'PUNTS DE PAS'); y -= 4
    many = len(day['points']) > 6
    gap = 33 if many else 37
    for n, p in enumerate(day['points']):
        y -= gap
        c.setFillColor(col); c.circle(x + 8, y + 9, 8, stroke=0, fill=1)
        c.setFillColor(white); c.setFont('Sans-Bold', 8.5); c.drawCentredString(x + 8, y + 6, str(n + 1))
        c.setFillColor(INK); c.setFont('Sans-Bold', 10); c.drawString(x + 22, y + 10, name(p))
        c.setFillColor(INK); c.setFont('Sans', 8.5)
        c.drawString(x + 22, y - 1, f'km {dec(p["km"])} · {fmt(p["ele"])} m · {p["time"]} h')
        c.setFillColor(MUTED); c.setFont('Sans', 7.5)
        az = ''
        if n + 1 < len(day['points']):
            q = day['points'][n + 1]['ll']; la1, lo1, la2, lo2 = map(math.radians, (p['ll'][0], p['ll'][1], q[0], q[1]))
            b = (math.degrees(math.atan2(math.sin(lo2 - lo1) * math.cos(la2), math.cos(la1) * math.sin(la2) - math.sin(la1) * math.cos(la2) * math.cos(lo2 - lo1))) + 360) % 360
            d = haversine(p['ll'], q) / 1000
            az = f'   → {n + 2}: {dec(d)} km recta · az. {round(b):03d}° V / {round((b + 9.8) % 360):03d}° M'
        c.drawString(x + 22, y - 11, f'{deg(p["ll"][0])}  {deg(p["ll"][1])}' + az)

    y -= 34
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'A TENIR EN COMPTE · PLANS B' if not planc else 'A TENIR EN COMPTE'); y -= 4
    room = y - (PROF[1] + PROF[3] + 4 + 126)   # espai fins a la llegenda
    need = sum(len(wrap(n_, 'Sans', 8.5, PANEL_W - 10)) * 11.5 + 4 for n_ in notes)
    fs, lh = (8.5, 11.5) if need <= room else (7.8, 10.2)
    for note in notes:
        for n, line in enumerate(wrap(note, 'Sans', fs, PANEL_W - 10)):
            y -= lh
            if n == 0:
                c.setFillColor(col); c.circle(x + 2.5, y + 3, 2, stroke=0, fill=1)
            c.setFillColor(INK); c.setFont('Sans', fs); c.drawString(x + 10, y, line)
        y -= 4

    # llegenda
    y = PROF[1] + PROF[3] + 4
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'LLEGENDA')
    y -= 18
    c.setStrokeColor(col); c.setLineWidth(3.2); c.line(x, y + 3, x + 26, y + 3)
    c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, 'Recorregut de l’etapa' if planc else 'Recorregut de la jornada')
    y -= 16
    c.setStrokeColor(Color(0.2, 0.2, 0.2, 0.75)); c.setLineWidth(1.5); c.setDash([4, 3], 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
    c.drawString(x + 34, y, 'Resta del pla C' if planc else 'Resta de la travessa')
    y -= 14
    if planc:
        c.setStrokeColor(Color(0.2, 0.2, 0.2, 0.6)); c.setLineWidth(1.3); c.setDash([2, 3], 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
        c.setFillColor(INK); c.drawString(x + 34, y, 'Ruta principal (Pelechuco – Charazani)')
    else:
        c.setStrokeColor(Color(0.42, 0.24, 0.6, 0.85)); c.setLineWidth(1.6); c.setDash([6, 4], 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
        c.setFillColor(INK); c.drawString(x + 34, y, 'Pla C (Cañisaya – Akamani – Charazani)')
        y -= 14
        c.setStrokeColor(ESC); c.setLineWidth(2.6); c.setDash([1.5, 3.5], 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
        c.drawString(x + 34, y, 'Ruta a peu dels plans B (GPX de la jornada)')
        y -= 14
        c.setStrokeColor(VEHC); c.setLineWidth(2.2); c.setDash([7, 3], 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
        c.setFillColor(INK); c.drawString(x + 34, y, 'Pista o carretera d’evacuació en vehicle')
        y -= 14
        c.setFillColor(ESC); c.rect(x + 8, y - 2, 11, 11, stroke=0, fill=1)
        c.setFillColor(white); c.setFont('Sans-Bold', 7); c.drawCentredString(x + 13.5, y + 0.6, 'E')
        c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, 'Punt d’evacuació en vehicle (pista o carretera)')
    y -= 14
    c.setFillColor(col); c.circle(x + 13, y + 3, 6, stroke=0, fill=1)
    c.setFillColor(white); c.setFont('Sans-Bold', 7); c.drawCentredString(x + 13, y + 0.6, '1')
    c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, 'Punt de pas (vegeu la llista)')
    y -= 16
    for line in wrap('Altituds del registre GPS. Hores previstes en hora de Bolívia (UTC−4); el guia les ajusta segons el grup, la llum i les condicions.', 'Sans', 7.5, PANEL_W):
        c.setFillColor(MUTED); c.setFont('Sans', 7.5); c.drawString(x, y, line); y -= 10

    # peu
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.line(M, 40, W - M, 40)
    c.setFillColor(MUTED); c.setFont('Sans', 7.5)
    c.drawString(M, 28, 'Mapa base: © OpenTopoMap (CC-BY-SA) · dades © col·laboradors d’OpenStreetMap i SRTM. ' + (
        'Recorregut: camí de l’Akamani a OpenStreetMap (consulta del 17/11/2026) i altituds SRTM; encara no s’ha reconegut sobre el terreny.' if planc else
        'Recorregut: track GPS de Gallotrekk (Wikiloc, 2012), contrastat amb operadors bolivians; encara no s’ha reconegut sobre el terreny.'))
    c.drawString(M, 17, 'Marges en graus WGS84; quadrícula blava UTM 19S cada 1 km. Declinació ≈ 9,8° O (juny 2027): azimut magnètic (M) = vertader (V) + 9,8°; els azimuts dels punts de pas són en línia recta. Escala vàlida en A3.')
    c.drawRightString(W - M, 17, f'Andes Wild Trek · Izan Pimentel Pérez · novembre de 2026 · pàgina {pageno} de {NPAGES}')

def overview(c):
    """Làmina 1: mapa general amb la ruta principal, el pla C, les rutes dels plans B i els punts d'evacuació."""
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 10.5)
    c.drawString(M, H - M - 8, 'ANDES WILD TREK  /  ATLES CARTOGRÀFIC')
    c.setFillColor(INK); c.setFont('Sans-Bold', 22)
    c.drawString(M, H - M - 36, 'Mapa general · ruta principal, plans B i pla C')
    c.setFillColor(MUTED); c.setFont('Sans', 10.5)
    c.drawString(M, H - M - 54, 'Travessa Pelechuco – Charazani i variant Cañisaya – Akamani – Charazani · Serralada d’Apolobamba (Bolívia)')
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.line(M, H - M - 66, W - M, H - M - 66)
    mx, my, mw = MAP[0], PROF[1], MAP[2]; mh = MAP[1] + MAP[3] - PROF[1]
    allp = [p[:2] for p in PTS] + [p[:2] for p in CPTS]
    xy = [merc(a, b) for a, b in allp]
    x0, x1 = min(p[0] for p in xy), max(p[0] for p in xy); y0, y1 = min(p[1] for p in xy), max(p[1] for p in xy)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2; sx, sy = (x1 - x0) * 1.12, (y1 - y0) * 1.08
    if sx / sy < mw / mh: sx = sy * mw / mh
    else: sy = sx * mh / mw
    X0, Y0 = cx - sx / 2, cy - sy / 2
    to_page = lambda lat, lon: (mx + (merc(lat, lon)[0] - X0) / sx * mw, my + mh - (merc(lat, lon)[1] - Y0) / sy * mh)
    img = basemap(X0, Y0, X0 + sx, Y0 + sy, 2300)
    buf = io.BytesIO(); img.save(buf, 'JPEG', quality=84, optimize=True); buf.seek(0)
    c.drawImage(ImageReader(buf), mx, my, mw, mh)
    c.saveState(); pth = c.beginPath(); pth.rect(mx, my, mw, mh); c.clipPath(pth, stroke=0)
    def poly(points, color, width, dash=None):
        path = c.beginPath()
        for k, q in enumerate(points):
            X, Y = to_page(q[0], q[1]); path.moveTo(X, Y) if k == 0 else path.lineTo(X, Y)
        c.setStrokeColor(color); c.setLineWidth(width); c.setLineJoin(1); c.setLineCap(1)
        c.setDash(*(dash or ([], 0))); c.drawPath(path, stroke=1, fill=0); c.setDash([], 0)
    for r in ROUTES:
        if r['kind'] == 'vehicle': poly(r['pts'], white, 3.6); poly(r['pts'], VEHC, 1.8, ([6, 3], 0))
    for r in ROUTES:
        if r['kind'] == 'walk' and not r['id'].startswith('b9-est'): poly(r['pts'], white, 4); poly(r['pts'], ESC, 2.2, ([1.5, 3], 0))
    poly(CPTS, white, 5); poly(CPTS, HexColor(CCOLOR), 2.8, ([7, 4], 0))
    for i in range(len(DAYS)):
        seg = PTS[CUT[i]:CUT[i + 1] + 1]; poly(seg, white, 5.5); poly(seg, HexColor(COLORS[i]), 3)
    placed = []
    def label(lat, lon, txt, colr, dot=True, dx=8, dy=-3, size=8.5):
        X, Y = to_page(lat, lon)
        if dot:
            c.setFillColor(colr); c.setStrokeColor(white); c.setLineWidth(1.4); c.circle(X, Y, 4.2, stroke=1, fill=1)
        w = pdfmetrics.stringWidth(txt, 'Sans-Bold', size)
        for ddx, ddy in ((dx, dy), (-dx - w, dy), (dx, dy + 11), (-dx - w, dy - 11)):
            box = (X + ddx, Y + ddy - 2, X + ddx + w, Y + ddy + 9)
            if not any(not (box[2] < o[0] or box[0] > o[2] or box[3] < o[1] or box[1] > o[3]) for o in placed): break
        placed.append(box); halo_text(c, X + ddx, Y + ddy, txt, 'Sans-Bold', size, colr, halo=3)
    for d in DAYS:
        p = d['points'][-1]; label(*p['ll'], f'{name(p)} · {fmt(p["ele"])} m', INK)
    label(*DAYS[0]['points'][0]['ll'], 'Pelechuco · 3.660 m', INK)
    label(*DAYS[2]['points'][3]['ll'], 'Pas Sunchulli · 5.032 m', HexColor('#9b3d5a'))
    for st in CSTAGES:
        p = st['points'][-1]
        if st['code'] in ('C1', 'C3', 'C4'): label(*p['ll'], f'{st["code"]} · {name(p)}', HexColor(CCOLOR))
    label(*CSTAGES[0]['points'][0]['ll'], 'Curva (inici del pla C)', HexColor(CCOLOR))
    for e in PLANS['escapes']:
        X, Y = to_page(*e['ll'])
        c.setFillColor(ESC); c.setStrokeColor(white); c.setLineWidth(1.4); c.rect(X - 5, Y - 5, 10, 10, stroke=1, fill=1)
        c.setFillColor(white); c.setFont('Sans-Bold', 6.5); c.drawCentredString(X, Y - 2.3, 'E')
    c.restoreState()
    c.setStrokeColor(INK); c.setLineWidth(1); c.rect(mx, my, mw, mh, stroke=1, fill=0)
    nx, ny = mx + mw - 30, my + mh - 48
    c.setFillColor(white); c.setStrokeColor(INK); c.setLineWidth(0.8); c.roundRect(nx - 14, ny - 6, 28, 42, 3, stroke=1, fill=1)
    path = c.beginPath(); path.moveTo(nx, ny + 22); path.lineTo(nx - 6, ny + 2); path.lineTo(nx, ny + 7); path.lineTo(nx + 6, ny + 2); path.close()
    c.setFillColor(INK); c.drawPath(path, stroke=0, fill=1); c.setFont('Sans-Bold', 9); c.drawCentredString(nx, ny + 25, 'N')
    m_per_pt = haversine(unmerc(X0, cy), unmerc(X0 + sx, cy)) / mw; length = nice(mw * m_per_pt / 5, 1); bar = length / m_per_pt
    bx, by = mx + 14, my + 14
    c.setFillColor(Color(1, 1, 1, 0.88)); c.roundRect(bx - 6, by - 6, bar + 70, 24, 3, stroke=0, fill=1)
    for k in range(4):
        c.setFillColor(INK if k % 2 == 0 else white); c.setStrokeColor(INK); c.setLineWidth(0.6); c.rect(bx + bar * k / 4, by, bar / 4, 4, stroke=1, fill=1)
    c.setFillColor(INK); c.setFont('Sans', 7.5); c.drawString(bx, by + 7, '0'); c.drawString(bx + bar + 5, by + 0.5, f'{dec(length / 1000, 0)} km')
    # panell
    x, y = PANEL_X, H - M - 92
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'RUTA PRINCIPAL'); y -= 4
    for i, d in enumerate(DAYS):
        y -= 14; c.setStrokeColor(HexColor(COLORS[i])); c.setLineWidth(3); c.line(x, y + 3, x + 18, y + 3)
        c.setFillColor(INK); c.setFont('Sans', 8.3)
        c.drawString(x + 24, y, f'Dia {d["day"]} · {name(d["points"][0])} → {name(d["points"][-1])} · {dec(d["km"])} km')
    y -= 24
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'PLANS B (UN GPX PER JORNADA)'); y -= 4
    for b in PLANS['b']:
        txt = f'Dia {b["day"]}: ' + ' · '.join(t for t, _ in b['ca'])
        for n, line in enumerate(wrap(txt, 'Sans', 7.8, PANEL_W - 4)):
            y -= 10; c.setFillColor(INK); c.setFont('Sans', 7.8); c.drawString(x, y, line)
        y -= 3
    y -= 18
    T = PLANS['c']['totals']
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'PLA C · CAÑISAYA – AKAMANI – CHARAZANI'); y -= 4
    for st in CSTAGES:
        y -= 12; c.setFillColor(INK); c.setFont('Sans', 8.3); c.drawString(x, y, f'{st["code"]} · {st["ca"]["name"]} · {dec(st["km"])} km')
    y -= 12; c.setFillColor(MUTED); c.setFont('Sans', 8)
    c.drawString(x, y, f'Total {dec(T["km"])} km · +{fmt(T["ascent"])}/−{fmt(T["descent"])} m · màxim {fmt(T["max"])} m (làmines 8 a 11)')
    y = PROF[1] + 70
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'LLEGENDA'); y -= 16
    for colr, wdt, dash, txt in ((HexColor(CCOLOR), 2.8, [7, 4], 'Pla C'), (ESC, 2.2, [1.5, 3], 'Ruta a peu dels plans B'), (VEHC, 1.8, [6, 3], 'Pista o carretera d’evacuació en vehicle')):
        c.setStrokeColor(colr); c.setLineWidth(wdt); c.setDash(dash, 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
        c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, txt); y -= 14
    c.setFillColor(ESC); c.rect(x + 8, y - 2, 11, 11, stroke=0, fill=1); c.setFillColor(white); c.setFont('Sans-Bold', 7); c.drawCentredString(x + 13.5, y + 0.6, 'E')
    c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, 'Punt d’evacuació en vehicle')
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.line(M, 40, W - M, 40)
    c.setFillColor(MUTED); c.setFont('Sans', 7.5)
    c.drawString(M, 28, 'Mapa base: © OpenTopoMap (CC-BY-SA) · dades © col·laboradors d’OpenStreetMap i SRTM. Ruta principal: track GPS de Gallotrekk (Wikiloc, 2012). Pla C i plans B: OpenStreetMap (consulta del 17/11/2026).')
    c.drawString(M, 17, 'Tots els recorreguts són de planificació i s’han de reconèixer sobre el terreny. GPX a dossiers/gpx/ i a l’app del guia.')
    c.drawRightString(W - M, 17, f'Andes Wild Trek · Izan Pimentel Pérez · novembre de 2026 · pàgina 1 de {NPAGES}')

def main():
    c = canvas.Canvas(OUT, pagesize=(W, H), pageCompression=1)
    c.setTitle('Andes Wild Trek · Apolobamba · Atles cartogràfic')
    c.setAuthor('Izan Pimentel Pérez')
    c.setSubject('Travessa Pelechuco – Charazani: les sis jornades a peu i les quatre etapes del pla C')
    print('Mapa general', file=sys.stderr); overview(c); c.showPage()
    for i in range(NPAGES - 1):
        day = DAYS[i] if i < len(DAYS) else None
        print(f'Dia {day["day"]}' if day else f'Pla C {CSTAGES[i - len(DAYS)]["code"]}', file=sys.stderr)
        page(c, i, day)
        c.showPage()
    c.save()
    print(f'Fet: {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT) / 1e6:.1f} MB)', file=sys.stderr)
    if '--no-export' not in sys.argv: export_maps()

def export_maps():
    """Mapes de cada jornada (ca i es) per al dossier del client: assets/maps/jornada-<dia>-<idioma>.webp."""
    global LANG, EXPORT
    import subprocess, tempfile
    EXPORT = True
    dpi = 220
    mx, my, mw, mh = MAP
    for lang in LANGS:
        LANG = lang
        tmp = tempfile.mkdtemp()
        pdf = os.path.join(tmp, 'mapes.pdf')
        c = canvas.Canvas(pdf, pagesize=(W, H))
        for i in range(NPAGES - 1):
            page(c, i, DAYS[i] if i < len(DAYS) else None); c.showPage()
        c.save()
        for i in range(NPAGES - 1):
            k = dpi / 72
            subprocess.run(['pdftoppm', '-r', str(dpi), '-f', str(i + 1), '-l', str(i + 1), '-singlefile', '-png',
                            '-x', str(round(mx * k)), '-y', str(round((H - my - mh) * k)), '-W', str(round(mw * k)), '-H', str(round(mh * k)),
                            pdf, os.path.join(tmp, 'm')], check=True)
            fname = f'jornada-{DAYS[i]["day"]}-{lang}.webp' if i < len(DAYS) else f'pla-c-{CSTAGES[i - len(DAYS)]["code"].lower()}-{lang}.webp'
            out = os.path.join(ROOT, 'assets', 'maps', fname)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            Image.open(os.path.join(tmp, 'm.png')).convert('RGB').save(out, 'WEBP', quality=80, method=6)
            print(f'  {os.path.relpath(out, ROOT)}', file=sys.stderr)
        # mapa general
        c = canvas.Canvas(pdf, pagesize=(W, H)); overview(c); c.showPage(); c.save()
        mx2, my2, mw2, mh2 = MAP[0], PROF[1], MAP[2], MAP[1] + MAP[3] - PROF[1]
        subprocess.run(['pdftoppm', '-r', str(dpi), '-singlefile', '-png', '-x', str(round(mx2 * k)), '-y', str(round((H - my2 - mh2) * k)),
                        '-W', str(round(mw2 * k)), '-H', str(round(mh2 * k)), pdf, os.path.join(tmp, 'm')], check=True)
        out = os.path.join(ROOT, 'assets', 'maps', f'general-{lang}.webp')
        Image.open(os.path.join(tmp, 'm.png')).convert('RGB').save(out, 'WEBP', quality=80, method=6)
        print(f'  {os.path.relpath(out, ROOT)}', file=sys.stderr)
    LANG, EXPORT = 'ca', False

if __name__ == '__main__':
    main()
