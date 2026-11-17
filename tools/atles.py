#!/usr/bin/env python3
"""Genera l'Atles cartogràfic A3 (dossiers/Apolobamba_Atles_Cartografic_A3.pdf).

Una pàgina per jornada a peu (les sis jornades de window.DAYS, a content.js), amb el mapa
topogràfic d'OpenTopoMap, el recorregut del track GPS (guia/track.js), els punts de pas
numerats amb els topònims normalitzats en català, el perfil i les dades de la jornada.

Executa-ho des de l'arrel del repositori:  python3 tools/atles.py
Necessita: reportlab i Pillow (pip install reportlab pillow) i connexió a tile.opentopomap.org.
Les teselles es desen a .cache/teselles (no es pugen al repositori).
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

# Topònims del registre GPS normalitzats per a l'atles (la resta ja ve en català a content.js).
NORM = {'Agua buena 1': 'Punt d’aigua 1', 'Agua buena 2': 'Punt d’aigua 2',
        'Agua buena 3': 'Punt d’aigua 3', 'Agua buena 4': 'Punt d’aigua 4'}
name = lambda p: NORM.get(p['ca'], p['ca'])

NOTES = {
    5: ['Primera jornada a peu. Pas 1 (4.706 m): no es creua amb neu o gel, mala visibilitat, vent fort o tempesta.',
        'Nit 508 m més amunt que Pelechuco: valoració de cada persona al vespre i al matí.'],
    6: ['Jornada curta de recuperació. Camp acordat amb la comunitat d’Hilo Hilo.',
        'Tarda de descans i preparació del Pas Sunchulli.'],
    7: ['Hora límit al Pas Sunchulli: 14.40. Si el grup no hi és a l’hora, mitja volta cap a Hilo Hilo.',
        'Campament 2: el punt del GPS és a 4.717 m; l’objectiu és dormir cap als 4.500 m, al lloc més baix de la vall que es confirmi sobre el terreny.'],
    8: ['No s’entra a les Mil Corbes amb gel, roca lliscant o poca visibilitat. No es tallen revolts.',
        'L’aigua del Punt d’aigua 4 es tracta.'],
    9: ['Dos colls seguits: Pas d’Akamani i Apacheta de Tambillo.',
        'No es comença la pujada si es preveu tempesta, mala visibilitat, neu o gel.'],
    10: ['Punt de decisió a la Cruïlla de Curva (11.10): si el grup va just de temps, la travessa acaba a Curva i es continua en vehicle.',
         'Sense el pont verificat, el final és a Curva.'],
}

COLORS = ['#b4573a', '#1c7c86', '#7a4fa0', '#b8860b', '#2f7d4f', '#9b3d5a']
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

def page(c, i, day):
    col = HexColor(COLORS[i])
    a, b = CUT[i], CUT[i + 1]
    seg = PTS[a:b + 1]
    first, last = name(day['points'][0]), name(day['points'][-1])

    # capçalera
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 10.5)
    c.drawString(M, H - M - 8, 'ANDES WILD TREK  /  ATLES CARTOGRÀFIC')
    c.setFillColor(INK); c.setFont('Sans-Bold', 22)
    via = [name(p) for p in day['points'] if p['ca'] == 'Pas Sunchulli']
    title = ' – '.join([first] + via + [last])
    c.drawString(M, H - M - 36, f'Dia {day["day"]} · {title}')
    c.setFillColor(MUTED); c.setFont('Sans', 10.5)
    c.drawString(M, H - M - 54, f'Jornada {i + 1} de 6 a peu · Travessa Pelechuco – Charazani · Serralada d’Apolobamba (Bolívia)')
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.line(M, H - M - 66, W - M, H - M - 66)

    # finestra del mapa (amb marge i la proporció del marc)
    mx, my, mw, mh = MAP
    xy = [merc(p[0], p[1]) for p in seg] + [merc(*p['ll']) for p in day['points']]
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
    # resta de la travessa
    def poly(points, color, width, dash=None):
        path = c.beginPath()
        for k, q in enumerate(points):
            X, Y = to_page(q[0], q[1])
            path.moveTo(X, Y) if k == 0 else path.lineTo(X, Y)
        c.setStrokeColor(color); c.setLineWidth(width); c.setLineJoin(1); c.setLineCap(1)
        c.setDash(*(dash or ([], 0))); c.drawPath(path, stroke=1, fill=0); c.setDash([], 0)
    for part in (PTS[:a + 1], PTS[b:]):
        if len(part) > 1:
            poly(part, white, 3.6)
            poly(part, Color(0.2, 0.2, 0.2, 0.75), 1.5, ([4, 3], 0))
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
    c.setFont('Sans', 7.5)
    c.drawCentredString(mx + mw / 2, my - 24, 'Longitud · WGS84')
    c.saveState(); c.translate(mx - 25, my + mh / 2); c.rotate(90); c.drawCentredString(0, 0, 'Latitud · WGS84'); c.restoreState()

    nx, ny = mx + mw - 30, my + mh - 48
    c.setFillColor(white); c.setStrokeColor(INK); c.setLineWidth(0.8)
    c.roundRect(nx - 14, ny - 6, 28, 42, 3, stroke=1, fill=1)
    path = c.beginPath(); path.moveTo(nx, ny + 22); path.lineTo(nx - 6, ny + 2); path.lineTo(nx, ny + 7); path.lineTo(nx + 6, ny + 2); path.close()
    c.setFillColor(INK); c.drawPath(path, stroke=0, fill=1)
    c.setFont('Sans-Bold', 9); c.drawCentredString(nx, ny + 25, 'N')

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
    c.drawCentredString(px + pw / 2, py - 21, 'Distància de la jornada (km)')
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
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'DADES DE LA JORNADA'); y -= 8
    rows = [('Distància', f'{dec(day["km"])} km'),
            ('Desnivell', f'+{fmt(day["ascent"])} / −{fmt(day["descent"])} m'),
            ('Punt més alt', f'{fmt(day["max"])} m'),
            ('Durada prevista', day['hours'].replace('9 h 30', '9 h 30 min')),
            ('Sortida', day['start']),
            ('Arribada prevista', day['arrival']),
            ('Nit', f'{last} · {"allotjament local" if day["day"] == 10 else "tenda"} · {day["nightLabel"]}')]
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
        c.drawString(x + 22, y - 11, f'{deg(p["ll"][0])}  {deg(p["ll"][1])}')

    y -= 34
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'A TENIR EN COMPTE'); y -= 4
    for note in NOTES[day['day']]:
        for n, line in enumerate(wrap(note, 'Sans', 8.5, PANEL_W - 10)):
            y -= 11.5
            if n == 0:
                c.setFillColor(col); c.circle(x + 2.5, y + 3, 2, stroke=0, fill=1)
            c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 10, y, line)
        y -= 4

    # llegenda
    y = PROF[1] + PROF[3] + 4
    c.setFillColor(ACCENT); c.setFont('Sans-Bold', 9.5); c.drawString(x, y, 'LLEGENDA')
    y -= 18
    c.setStrokeColor(col); c.setLineWidth(3.2); c.line(x, y + 3, x + 26, y + 3)
    c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, 'Recorregut de la jornada')
    y -= 16
    c.setStrokeColor(Color(0.2, 0.2, 0.2, 0.75)); c.setLineWidth(1.5); c.setDash([4, 3], 0); c.line(x, y + 3, x + 26, y + 3); c.setDash([], 0)
    c.drawString(x + 34, y, 'Resta de la travessa')
    y -= 16
    c.setFillColor(col); c.circle(x + 13, y + 3, 6, stroke=0, fill=1)
    c.setFillColor(white); c.setFont('Sans-Bold', 7); c.drawCentredString(x + 13, y + 0.6, '1')
    c.setFillColor(INK); c.setFont('Sans', 8.5); c.drawString(x + 34, y, 'Punt de pas (vegeu la llista)')
    y -= 22
    for line in wrap('Altituds del registre GPS. Hores previstes en hora de Bolívia (UTC−4); el guia les ajusta segons el grup, la llum i les condicions.', 'Sans', 7.5, PANEL_W):
        c.setFillColor(MUTED); c.setFont('Sans', 7.5); c.drawString(x, y, line); y -= 10

    # peu
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.line(M, 40, W - M, 40)
    c.setFillColor(MUTED); c.setFont('Sans', 7.5)
    c.drawString(M, 28, 'Mapa base: © OpenTopoMap (CC-BY-SA) · dades © col·laboradors d’OpenStreetMap i SRTM. '
                        'Recorregut: track GPS de Gallotrekk (Wikiloc, 2012), contrastat amb operadors bolivians; encara no s’ha reconegut sobre el terreny.')
    c.drawString(M, 17, 'Coordenades WGS84 en graus decimals. Distàncies, desnivells i horaris de planificació. L’escala gràfica és vàlida si s’imprimeix en A3 sense ajustar.')
    c.drawRightString(W - M, 17, f'Andes Wild Trek · Izan Pimentel Pérez · novembre de 2026 · pàgina {i + 1} de 6')

def main():
    c = canvas.Canvas(OUT, pagesize=(W, H), pageCompression=1)
    c.setTitle('Andes Wild Trek · Apolobamba · Atles cartogràfic')
    c.setAuthor('Izan Pimentel Pérez')
    c.setSubject('Travessa Pelechuco – Charazani: les sis jornades a peu')
    for i, day in enumerate(DAYS):
        print(f'Dia {day["day"]}', file=sys.stderr)
        page(c, i, day)
        c.showPage()
    c.save()
    print(f'Fet: {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT) / 1e6:.1f} MB)', file=sys.stderr)

if __name__ == '__main__':
    main()
