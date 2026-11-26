#!/usr/bin/env python3
"""Genera les dues presentacions del treball (una per assignatura) i la pàgina que les tria.

  presentacio.html               → tria de presentació
  presentacio-organitzacio.html  → Organització d'activitats de muntanya (escola de senderisme) i normativa
  presentacio-orientacio.html    → Orientació, cartografia i planificació

Les dues comparteixen estils i controls (fletxes, tecla N per al guió, pantalla completa, impressió en PDF).
Executa-ho des de l'arrel:  python3 tools/presentacions.py   (i després python3 tools/stamp.py)
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSS = r"""
:root{--forest:#163e33;--gold:#e5c98d;--cream:#f4f1e6;--ink:#1c2b26;--muted:#5b6b64;--serif:Georgia,"Times New Roman",serif}
*{box-sizing:border-box}html,body{margin:0;height:100%;background:#0e2a22;font-family:Inter,system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:var(--ink)}
.deck{position:fixed;inset:0;display:grid;place-items:center}
.slide{display:none;width:min(100vw,177.78vh);height:min(56.25vw,100vh);background:#fffefa;padding:5.2% 6%;position:relative;overflow:hidden;font-size:clamp(11px,1.55vw,26px)}
.slide.on{display:flex;flex-direction:column}
.slide.dark{background:var(--forest);color:var(--cream)}
.k{font-size:.62em;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:#8a7a4e;margin:0 0 .8em}.dark .k{color:var(--gold)}
h1,h2{font-family:var(--serif);font-weight:400;margin:0;letter-spacing:-.015em;line-height:1.05}h1{font-size:4.2em}h2{font-size:2.5em;margin-bottom:.55em}
p{margin:0 0 .6em;line-height:1.45}ul{margin:0;padding-left:1.1em;line-height:1.5}li{margin-bottom:.35em}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:5%;flex:1;align-items:start;min-height:0}.cols.c3{grid-template-columns:repeat(3,1fr);gap:3%}.cols.w{grid-template-columns:1.25fr .75fr}.cols.m{grid-template-columns:.8fr 1.2fr}
.card{background:var(--cream);border-radius:.5em;padding:1em 1.1em}.card b{display:block;font-size:1.05em;margin-bottom:.25em}.card small{color:var(--muted);font-size:.88em;line-height:1.4;display:block}.card+.card{margin-top:.55em}
.dark .card{background:rgba(255,255,255,.08)}.dark .card small{color:#c9d3cb}
.big{font-family:var(--serif);font-size:3.4em;line-height:1;color:var(--forest)}.dark .big{color:var(--gold)}
.stat{display:grid;grid-template-columns:repeat(4,1fr);gap:3%;margin-top:auto}.stat div{border-top:.12em solid var(--gold);padding-top:.5em}.stat span{font-size:.75em;opacity:.85}
img{max-width:100%;display:block;border-radius:.4em}.fit{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;height:100%}.fit img{max-height:100%;width:auto;max-width:100%;object-fit:contain}
.bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.38}.over{position:relative;display:flex;flex-direction:column;height:100%}
table{border-collapse:collapse;width:100%;font-size:.84em}td,th{text-align:left;padding:.42em .5em;border-bottom:1px solid #dfe3d8}th{font-size:.8em;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}tr.w td{font-weight:600}
table.c td,table.c th{font-size:.92em;padding:.35em .45em}table.c td:last-child{white-space:nowrap}
.foot{position:absolute;left:6%;right:6%;bottom:3.2%;display:flex;justify-content:space-between;font-size:.62em;color:var(--muted)}.dark .foot{color:#b9c7be}
.bar{position:fixed;left:0;bottom:0;height:4px;background:var(--gold);transition:width .2s;z-index:5}
.ui{position:fixed;right:12px;top:10px;display:flex;gap:8px;z-index:6;transition:opacity .4s}.ui.hide{opacity:0;pointer-events:none}.ui button,.ui a{font:600 13px/1 inherit;color:#fff;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.3);border-radius:6px;padding:9px 12px;cursor:pointer;text-decoration:none}
.notes{position:fixed;left:0;right:0;bottom:0;background:rgba(10,25,20,.96);color:#eef0e8;padding:16px 22px 22px;font-size:15px;line-height:1.5;max-height:38vh;overflow:auto;display:none;z-index:4}.notes.on{display:block}.notes b{color:var(--gold)}
.nav{position:fixed;top:0;bottom:0;width:22%;z-index:3;cursor:pointer}.nav.l{left:0}.nav.r{right:0;width:78%}
@media print{.ui,.bar,.nav,.notes{display:none}.deck{position:static;display:block}.slide{display:flex!important;flex-direction:column;width:100vw;height:56.25vw;page-break-after:always}@page{size:13.333in 7.5in;margin:0}}
.months{display:grid;grid-template-columns:repeat(12,1fr);gap:.25em;margin:.4em 0 .5em}.months span{font-size:.62em;text-align:center;padding:1.3em 0 .3em;border-radius:.25em;background:#eceee7;color:#7b8378;font-weight:700}.months .best{background:var(--forest);color:#fff}.months .ok{background:#9daa86;color:#102c25}.months .risk{background:#e2cfa6;color:#102c25}
.mini{font-size:.8em;color:var(--muted);line-height:1.4}.dark .mini{color:#c9d3cb}
.band{background:var(--forest);color:var(--cream);border-radius:.5em;padding:.75em 1em;margin-top:.8em}
.lv{display:grid;grid-template-columns:repeat(4,1fr);gap:2.5%;margin-bottom:.8em}.lv div{background:var(--cream);border-radius:.5em;padding:.8em .9em}.lv b{display:block;font-size:.95em}.lv i{font-style:normal;color:#8a7a4e;font-weight:700;font-size:.8em;letter-spacing:.06em;text-transform:uppercase}.lv small{display:block;color:var(--muted);font-size:.8em;line-height:1.35;margin-top:.3em}
.dots{display:flex;gap:.25em;margin:.35em 0}.dots span{width:.7em;height:.7em;border-radius:50%;background:#d9ddd0}.dots span.on{background:var(--forest)}
.qr{background:#fff;border-radius:.5em;padding:.7em;text-align:center;border:1px solid #dfe3d8}.qr img{width:100%;max-width:10em;margin:0 auto}.qr small{display:block;font-size:.65em;color:var(--muted);margin-top:.4em}
.law{font-size:.8em;color:var(--muted);margin-top:.25em;display:block}
ol{margin:0;padding-left:1.3em;line-height:1.5}ol li{margin-bottom:.5em}
table.s td:first-child{width:17%}table.s td:last-child{white-space:normal;width:21%;font-weight:600;color:var(--forest)}
.hb{margin:.2em 0 .6em}.hb .r{display:grid;grid-template-columns:36% 1fr 17%;align-items:center;gap:.6em;margin:.5em 0;font-size:.85em}.hb i{display:block;height:1.15em;background:var(--forest);border-radius:.2em}.hb .o i{background:#aab5a3}.hb b{text-align:right;font-weight:600;white-space:nowrap}
.tl{display:flex;height:2.6em;border-radius:.4em;overflow:hidden;margin:.5em 0 .35em;font-size:.8em}.tl div{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;white-space:nowrap;overflow:hidden}.tl .n{background:#3b4a44}.tl .w{background:var(--forest)}.tl .g{background:#e5c98d;color:#102c25}.tl .d{background:#9daa86}
.subj{display:inline-block;align-self:flex-start;font-size:.6em;letter-spacing:.12em;text-transform:uppercase;font-weight:700;border:1px solid var(--gold);color:var(--gold);border-radius:2em;padding:.45em 1em;margin-bottom:1.2em}
"""

JS = r"""(function(){var s=[].slice.call(document.querySelectorAll('.slide')),i=Math.max(0,Math.min(s.length-1,(parseInt(location.hash.slice(1))||1)-1)),n=document.getElementById('notes');
function go(k){i=Math.max(0,Math.min(s.length-1,k));s.forEach(function(e,j){e.classList.toggle('on',j===i)});n.innerHTML='<b>'+(i+1)+' / '+s.length+'</b> · '+s[i].dataset.n;document.getElementById('bar').style.width=((i+1)/s.length*100)+'%';history.replaceState(null,'','#'+(i+1));}
document.getElementById('next').onclick=function(){go(i+1)};document.getElementById('prev').onclick=function(){go(i-1)};
document.getElementById('bn').onclick=function(){n.classList.toggle('on')};
document.getElementById('bf').onclick=function(){var d=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else if(d.requestFullscreen)d.requestFullscreen();};
document.addEventListener('keydown',function(e){if(['ArrowRight','PageDown',' ','Enter'].indexOf(e.key)>-1){e.preventDefault();go(i+1)}else if(['ArrowLeft','PageUp'].indexOf(e.key)>-1)go(i-1);else if(e.key==='n'||e.key==='N')n.classList.toggle('on');else if(e.key==='Home')go(0);else if(e.key==='End')go(s.length-1);});
var x0=null;document.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});document.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)go(i+(dx<0?1:-1));x0=null},{passive:true});
var ui=document.querySelector('.ui'),ut;function sh(){ui.classList.remove('hide');clearTimeout(ut);ut=setTimeout(function(){ui.classList.add('hide')},2500)}document.addEventListener('mousemove',sh);sh();
go(i);})();"""

HEAD = '''<!doctype html>
<html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="robots" content="noindex"><link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<style>{css}</style></head><body>
'''

import json, math, re


def _load_days():
    t = open(os.path.join(ROOT, 'content.js'), encoding='utf8').read()
    j = t.index('[', t.index('window.DAYS'))
    return {d['day']: d for d in json.JSONDecoder().raw_decode(t[j:])[0]}


DAYS = _load_days()


def _pt(day, name):
    return next(p for p in DAYS[day]['points'] if p['ca'] == name)


def _brg(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    dl = lo2 - lo1
    y = math.sin(dl) * math.cos(la2)
    x = math.cos(la1) * math.sin(la2) - math.sin(la1) * math.cos(la2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def _dist(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371.0088 * math.asin(math.sqrt(h))


def _c(x, d=1):
    return f'{x:.{d}f}'.replace('.', ',')


def profile_svg(day, limit_name, limit_txt):
    """Perfil esquemàtic d'una jornada entre els punts de pas del GPX, amb l'hora límit marcada."""
    pts = DAYS[day]['points']
    W, H, L, R, T, B = 760, 310, 62, 26, 34, 62
    km1 = max(p['km'] for p in pts)
    y0, y1 = 3700, 5200
    X = lambda k: L + (W - L - R) * k / km1
    Y = lambda e: T + (H - T - B) * (1 - (e - y0) / (y1 - y0))
    poly = ' '.join(f'{X(p["km"]):.1f},{Y(p["ele"]):.1f}' for p in pts)
    o = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Perfil del dia {day}" style="width:100%;height:auto;display:block;font-family:Inter,system-ui,sans-serif">']
    for e in (4000, 4500, 5000):
        o.append(f'<line x1="{L}" x2="{W - R}" y1="{Y(e):.1f}" y2="{Y(e):.1f}" stroke="#dfe3d8"/><text x="{L - 8}" y="{Y(e) + 5:.1f}" font-size="15" text-anchor="end" fill="#5b6b64">{e}</text>')
    for k in range(0, int(km1) + 1, 2):
        o.append(f'<text x="{X(k):.1f}" y="{H - B + 20}" font-size="15" text-anchor="middle" fill="#5b6b64">{k}</text>')
    o.append(f'<text x="{W - R}" y="{H - B + 40}" font-size="14" text-anchor="end" fill="#5b6b64">km</text>')
    o.append(f'<polygon points="{X(0):.1f},{Y(y0):.1f} {poly} {X(km1):.1f},{Y(y0):.1f}" fill="rgba(22,62,51,.12)"/>')
    o.append(f'<polyline points="{poly}" fill="none" stroke="#163e33" stroke-width="3.2" stroke-linejoin="round"/>')
    lim = next(p for p in pts if p['ca'] == limit_name)
    o.append(f'<line x1="{X(lim["km"]):.1f}" x2="{X(lim["km"]):.1f}" y1="{Y(lim["ele"]):.1f}" y2="{H - B}" stroke="#b8923c" stroke-width="2.2" stroke-dasharray="6 5"/>')
    o.append(f'<text x="{X(lim["km"]):.1f}" y="{H - B + 42}" font-size="16" font-weight="700" text-anchor="middle" fill="#8a6a1f">{limit_txt}</text>')
    n = len(pts)
    for i, p in enumerate(pts):
        x, y = X(p['km']), Y(p['ele'])
        key = p['ca'] == limit_name
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{7 if key else 5.5}" fill="{"#b8923c" if key else "#163e33"}"/>')
        if i == 0:
            a, dx, dy = 'start', 6, 26
        elif i == n - 1:
            a, dx, dy = 'end', 4, 30
        elif key:
            a, dx, dy = 'middle', 0, -26
        elif x > X(lim['km']) - 130:
            a, dx, dy = 'end', -12, -22
        else:
            a, dx, dy = 'middle', 0, 26
        wgt = '700' if key else '500'
        o.append(f'<text x="{x + dx:.1f}" y="{y + dy:.1f}" font-size="15.5" font-weight="{wgt}" text-anchor="{a}" fill="#1c2b26">{p["ca"]}<tspan x="{x + dx:.1f}" dy="17" font-weight="400" fill="#5b6b64">{p["ele"]:,} m</tspan></text>'.replace(',', '.'))
    o.append('</svg>')
    return ''.join(o)


WEB = '7m5n2m6tv8-eng.github.io/apolobamba'


def slide(notes, body, foot='', dark=False, num=None):
    cls = 'slide dark' if dark else 'slide'
    f = f'<div class="foot"><span>{foot}</span><span>{num}</span></div>' if num else ''
    return f'<section class="{cls}" data-n="{notes}">{body}{f}</section>'


def deck(fname, title, slides):
    out = []
    for n, (notes, body, foot, dark) in enumerate(slides, 1):
        if n > 1:
            body = re.sub(r'<p class="k">\d\d · ', f'<p class="k">{n - 1:02d} · ', body, count=1)
        out.append(slide(notes, body, foot, dark, n if n > 1 else None))
    html = (HEAD.format(title=title, css=CSS) + '<div class="deck" id="deck">\n\n' + '\n\n'.join(out) + '\n</div>\n'
            '<div class="nav l" id="prev" aria-hidden="true"></div><div class="nav r" id="next" aria-hidden="true"></div>\n'
            '<div class="ui"><a href="presentacio.html">← Presentacions</a><button id="bn" type="button">Guió</button><button id="bf" type="button">Pantalla completa</button></div>\n'
            '<div class="notes" id="notes"></div><div class="bar" id="bar"></div>\n<script>\n' + JS + '\n</script></body></html>\n')
    open(os.path.join(ROOT, fname), 'w', encoding='utf8').write(html)
    print(fname, len(slides), 'diapositives')


def cover(subject, lead, focus):
    return (f'<div class="bg" style="background-image:url(assets/apolobamba-landscape.webp)"></div><div class="over">'
            f'<p class="k">Treball TD2 · Tècnic esportiu en mitja muntanya</p><span class="subj">{subject}</span>'
            f'<h1>Andes Wild Trek<br>Apolobamba</h1><p style="font-size:1.2em;margin-top:.7em;max-width:62%">{lead}</p>'
            f'<div class="stat"><div><span>Autor</span><br><b>Izan Pimentel Pérez</b></div><div><span>Data</span><br><b>Novembre de 2026</b></div>'
            f'<div><span>Avui</span><br><b>{focus}</b></div><div><span>Travessa</span><br><b>Pelechuco → Charazani</b></div></div></div>')


DAYS_TABLE = ('<table><tr><th>Dia</th><th>Jornada</th><th>Km</th><th>Desnivell</th><th>Hores</th><th>Nit</th></tr>'
              '<tr><td>5</td><td>Pelechuco → Campament 1</td><td>9,7</td><td>+1.047 / −540</td><td>6–8</td><td>4.168 m</td></tr>'
              '<tr><td>6</td><td>Campament 1 → Hilo Hilo</td><td>4,2</td><td>+31 / −189</td><td>2–3</td><td>4.010 m</td></tr>'
              '<tr class="w"><td>7</td><td>Hilo Hilo → Pas Sunchulli → Campament 2</td><td>11,4</td><td>+1.062 / −354</td><td>7–9</td><td>4.500–4.700 m</td></tr>'
              '<tr><td>8</td><td>Campament 2 → Incacancha</td><td>8,3</td><td>+211 / −867</td><td>5–7</td><td>4.060 m</td></tr>'
              '<tr><td>9</td><td>Incacancha → Campament 3</td><td>4,1</td><td>+602 / −491</td><td>4–6</td><td>4.171 m</td></tr>'
              '<tr><td>10</td><td>Campament 3 → Charazani</td><td>15,8</td><td>+497 / −1.473</td><td>8–9 h 30</td><td>3.195 m</td></tr></table>')


_a, _b = _pt(7, 'Agua buena 3'), _pt(7, 'Pas Sunchulli')
FOG_CARD = ('<div class="card"><b>Exemple: Agua buena 3 → Pas Sunchulli</b><small>Pel camí: ' + _c(_b['km'] - _a['km']) + ' km i +' + str(_b['ele'] - _a['ele']) + ' m · en línia recta ≈' + _c(_dist(_a['ll'], _b['ll'])) + ' km · azimut vertader ≈' + str(round(_brg(_a['ll'], _b['ll']))) + '° <br>Calculat amb les coordenades del GPX.</small></div>')

# ───────────────────────── 1 · ORGANITZACIÓ D'ACTIVITATS (ESCOLA DE SENDERISME) ─────────────────────────
ORG_SUBJ = 'Organització d’activitats · Escola de senderisme'
ORG = [
 ('Bon dia. Soc l’Izan Pimentel i us presento Andes Wild Trek, una empresa de guiatge i una travessa de sis jornades a l’Apolobamba, a Bolívia. Avui em centro en l’organització: l’empresa i la normativa, el producte i el preu, el client, com es condueix el grup i com s’avalua. La cartografia i la planificació de la ruta les presento a l’altra assignatura.',
  cover(ORG_SUBJ, 'Com s’organitza i es ven una travessa guiada de sis jornades: empresa, normativa, producte, grup i avaluació.', 'Empresa, normativa i grup'), '', True),

 ('La idea neix d’una pregunta: puc portar la manera de guiar del Pirineu a una serralada remota? L’Apolobamba és poc freqüentada, té camins de pastors i una cultura viva. El projecte no ven un cim: ven un grup reduït, interpretació del territori i decisions responsables.',
  '<p class="k">01 · La idea</p><h2>Caminar lluny.<br>Sentir-nos a prop.</h2><div class="cols"><div><p>Una travessa exigent i poc freqüentada, guiada amb el mateix criteri que al Pirineu.</p><ul><li>Grup reduït de 8–13 persones</li><li>Guia de muntanya i guia local</li><li>Interpretació del paisatge i de la cultura kallawaya</li><li>L’èxit és ajustar l’activitat al grup, no arribar a un coll</li></ul></div><div class="fit"><img src="assets/apolobamba-range-small.webp" alt=""></div></div>',
  'Andes Wild Trek · Apolobamba', False),

 ('El model és una agència organitzadora de viatges combinats, amb mi com a autònom a Catalunya. Jo venc el paquet en nom propi i en soc el responsable davant del client; un operador bolivià presta els serveis locals. El client tipus ve del Pirineu, té experiència de travessa i vol aprendre.',
  '<p class="k">02 · Empresa</p><h2>Qui ven, què ven i a qui.</h2><div class="cols"><div><p><b>Model:</b> agència organitzadora de viatges combinats. Titular autònom a Catalunya; operador local a Bolívia com a proveïdor.</p><ul><li>Ven el paquet en nom propi: transport, allotjament i guiatge</li><li>L’operador no es presenta com a venedor</li><li>Mínim de 8 reserves per sortir; màxim de 13</li></ul></div><div><p><b>Client:</b> senderista amb travesses de diversos dies, 25–55 anys com a referència.</p><ul><li>Ve del Pirineu i de clubs excursionistes</li><li>Vol aprendre i conviure, no fer un cim</li><li>Accepta tenda, fred i canvis de programa</li></ul></div></div>',
  'Bloc 03 · cap. 2', False),

 ('Primera part de la normativa, en una sola mirada, amb l’estat de cada punt. Per vendre el viatge cal donar d’alta l’activitat: model 036 i RETA; el 037 està suprimit des del febrer de 2025. A l’IAE, el guiatge és el grup 889, però com que venc el paquet en nom propi el règim fiscal és el d’agències de viatges i l’epígraf és el 755.2, agències de viatges, i la gestoria ho confirma. Com a agència a Catalunya cal declaració responsable i garantia d’insolvència, a més de la responsabilitat civil i l’assegurança d’activitat. Sobre qui pot guiar: el títol de tècnic esportiu en mitja muntanya, del Reial decret 702/2019, no habilita per a terreny tècnic d’alta muntanya. Jo en soc titular i estic inscrit al ROPEC, però el registre català no val a Bolívia. A Bolívia, la Llei 292 demana autorització o aliança amb una empresa boliviana i, a l’àrea protegida, permís del SERNAP. Per això el producte té un límit: amb neu dura o gel al Pas Sunchulli no es creua.',
  '<p class="k">03 · Normativa · empresa, títol i destinació</p><h2>Marc legal: què cal i en quin punt som.</h2><table class="c s"><tr><th>Àmbit</th><th>Què exigeix</th><th>Estat</th></tr>'
  '<tr><td><b>Alta d’activitat</b></td><td>Model 036 i alta al RETA <span class="law">AEAT · TGSS (el 037 està suprimit des del 3/02/2025)</span></td><td>Previst a l’inici</td></tr>'
  '<tr><td><b>IAE i fiscalitat</b></td><td>Guiatge: grup 889. Paquet en nom propi: règim especial d’agències de viatges, epígraf 755.2 <span class="law">RDL 1175/1990 · IVA</span></td><td>Amb la gestoria</td></tr>'
  '<tr><td><b>Agència de viatges</b></td><td>Declaració responsable i garantia d’insolvència <span class="law">Llei 13/2002 i Decret 75/2020 de turisme · Codi de consum</span></td><td>Pendent</td></tr>'
  '<tr><td><b>Assegurances</b></td><td>RC professional i assegurança de viatge i activitat: fins a 5.100 m, rescat i repatriació</td><td>A cotitzar</td></tr>'
  '<tr><td><b>Títol i registre</b></td><td>Titular del TD2 en mitja muntanya, inscrit al ROPEC; no habilita per a terreny tècnic d’alta muntanya <span class="law">RD 702/2019 · Llei 3/2008 · Decret 68/2009</span></td><td>Titular · inscrit</td></tr>'
  '<tr><td><b>Bolívia</b></td><td>Autorització o aliança amb empresa boliviana; permís escrit del SERNAP a l’àrea protegida <span class="law">Llei 292, art. 16 i 17</span></td><td>Via operador local; permís pendent</td></tr></table>'
  '<p class="band"><b>Límit del producte:</b> amb neu dura o gel al Pas Sunchulli que exigeixi grampons, piolet o assegurament, no es creua. El guia local no amplia les competències del TD2.</p>',
  'Bloc 02 · cap. 3', False),

 ('Segona part de la normativa: el contracte amb el client. És un contracte de viatge combinat: identifica organitzador, operador, serveis, preu total, mínim de persones, cancel·lacions i drets del viatger. Ho regula el llibre quart de la llei general de consumidors, el Reial decret legislatiu 1/2007, modificat el 2018 per adaptar-lo a la directiva europea. Abans de signar, el client rep la informació precontractual, i les dades, també les de salut, es tracten amb el reglament europeu i la llei orgànica de protecció de dades. Les condicions són una proposta pendent d’assessoria: preu anticipat, senyal del trenta per cent, garantia de sortida i una escala de cancel·lació que ha de ser adequada i justificable.',
  '<p class="k">04 · Normativa · contracte i condicions</p><h2>Les condicions, clares des del principi.</h2><div class="cols"><div><p><b>Contracte de viatge combinat</b><span class="law">RDL 1/2007, llibre IV, modificat pel RDL 23/2018 · RGPD i LOPDGDD</span></p><ul><li>Organitzador, operador i serveis inclosos</li><li>Preu total, mínim de 8 i màxim de 13</li><li>Cancel·lacions i drets del viatger</li><li>Informació precontractual; dades de salut amb consentiment explícit</li></ul><p class="mini" style="margin-top:.8em">Les despeses de cancel·lació han de ser adequades i justificables. Proposta pendent de validar amb assessoria.</p></div><div><table class="c"><tr><th>Condició</th><th>Proposta</th></tr><tr><td>Preu</td><td>2.700 € fins a 90 dies abans · 2.850 € després</td></tr><tr><td>Pagament</td><td>Senyal del 30 % · resta 45 dies abans</td></tr><tr><td>Garantia de sortida</td><td>Sense 8 persones: avís ≥ 30 dies i devolució del 100 % en 14 dies</td></tr><tr><td>Cancel·lació</td><td>10 % (&gt;90 d) · 25 % · 50 % · 75 % · 100 % (&lt;15 d)</td></tr><tr><td>Cessió de plaça</td><td>Possible, a una persona que compleixi els requisits</td></tr><tr><td>Circumstàncies extraordinàries</td><td>Sense despeses</td></tr></table></div></div>',
  'Bloc 02 i fitxa del client', False),

 ('Per vendre bé cal dir clarament per a qui és. La fitxa del client resumeix el nivell en quatre indicadors: exigència física alta, dificultat tècnica baixa, altitud molt alta i aïllament alt. I posa requisits concrets: una travessa prèvia de tres dies o més i poder caminar vuit o nou hores amb mil metres de desnivell dos dies seguits. Abans de reservar fem una conversa prèvia i demanem revisió amb medicina del viatge.',
  '<p class="k">06 · El client</p><h2>És per a tu? Nivell i requisits.</h2><div class="lv"><div><i>Exigència física</i><div class="dots"><span class="on"></span><span class="on"></span><span class="on"></span><span></span></div><b>Alta</b><small>Fins a 9 h 30, sis dies seguits.</small></div><div><i>Dificultat tècnica</i><div class="dots"><span class="on"></span><span></span><span></span><span></span></div><b>Baixa</b><small>Sender i pista, sense grimpada.</small></div><div><i>Altitud</i><div class="dots"><span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span></div><b>Molt alta</b><small>Cinc nits a més de 4.000 m; pas a 5.032 m.</small></div><div><i>Aïllament</i><div class="dots"><span class="on"></span><span class="on"></span><span class="on"></span><span></span></div><b>Alt</b><small>Sense cobertura; evacuació de moltes hores, segons la zona.</small></div></div><div class="cols"><div><p><b>Requisits</b></p><ul><li>Una travessa prèvia de 3 dies o més</li><li>8–9 h amb uns 1.000 m, dos dies seguits</li><li>Revisió amb medicina del viatge</li><li>Passaport vigent i 13 dies lliures</li></ul></div><div><p><b>Selecció i informació</b></p><ul><li>Conversa prèvia: experiència, salut i expectatives</li><li>Fitxa de 2 pàgines, preparació i pla d’entrenament</li><li>Dossier complet per WhatsApp</li><li>Punt de trobada: aeroport d’El Alto, dia 1</li></ul></div></div>',
  'Bloc 05 · fitxa del client', False),

 ('El programa dura onze dies. Tres a La Paz per aclimatar-nos, un de trasllat, sis jornades a peu i un de retorn. Hi afegim dos dies de reserva pressupostats: el client ha de disposar de tretze dies. Els dies de reserva no tenen cost addicional.',
  '<p class="k">07 · Programa</p><h2>Onze dies i dos de reserva.</h2><div class="fit"><img src="assets/pres-calendari.png" alt="Calendari del programa"></div><div class="stat" style="color:var(--ink)"><div><span>A peu</span><br><b>53,4 km · 6 jornades</b></div><div><span>Desnivell</span><br><b>+3.450 / −3.915 m</b></div><div><span>Pas Sunchulli</span><br><b>5.032 m</b></div><div><span>Nits en tenda</span><br><b>5, entre 4.000 i 4.700 m</b></div></div>',
  'Bloc 03 · cap. 4 · totals arrodonits sobre el track', False),

 ('El pressupost cobreix tretze jornades. Amb vuit clients, el grup mínim, el cost és de 17.245 euros, amb un deu per cent de contingència. El guia principal, jo mateix, hi consto a 180 euros al dia, 2.340 euros en total, i el guia local a 100 euros al dia: és un cost, no benefici. Per tenir un marge del vint per cent, el preu surt a 2.695 euros, que arrodoneixo a 2.700. A partir de deu clients s’afegeix un guia de suport. El preu inclou guiatge, transport del programa, àpats, allotjament, material col·lectiu i l’assegurança d’activitat; no inclou els vols, l’equip personal ni les despeses personals. Si els costos locals pugen un vint per cent, el marge baixa a l’onze i mig per cent. Les partides que cal contrastar primer són transport, assegurança, garantia i allotjament a La Paz.',
  '<p class="k">08 · Pressupost</p><h2>2.700 € per persona.</h2><div class="cols"><div><div class="hb">'
  '<div class="r"><span>Àpats i allotjament dels clients</span><i style="width:67%"></i><b>4.030 € · 23 %</b></div>'
  '<div class="r"><span>Guia principal i guia local</span><i style="width:61%"></i><b>3.640 € · 21 %</b></div>'
  '<div class="r"><span>Assegurances, RC i garantia</span><i style="width:33%"></i><b>2.000 € · 12 %</b></div>'
  '<div class="r"><span>Contingència (10 %)</span><i style="width:26%"></i><b>1.568 € · 9 %</b></div>'
  '<div class="r o"><span>Altres partides</span><i style="width:100%"></i><b>6.007 € · 35 %</b></div></div>'
  '<p class="mini">Cost per sortida amb 8 clients: 17.245 €. Fórmula: (10.447,50 + 653,75·n + suport) × 1,10. Quantitats: hipòtesis a substituir per cotitzacions reals.</p></div>'
  '<div><p class="big">20,2%</p><p>de marge amb el grup mínim de 8 persones. Amb 6–7 clients no s’arriba al 20 %.</p>'
  '<div class="card"><b>El preu inclou</b><small>Guiatge principal i local, suport de càrregues, transport del programa, àpats i allotjament, material col·lectiu i assegurança d’activitat i viatge.</small></div>'
  '<div class="card"><b>No inclou</b><small>Vols internacionals, equip personal i despeses personals. Suport local a partir de 10 clients (1.953,75 €).</small></div></div></div>',
  'Bloc 03 · cap. 5', False),

 ('Com es condueix el grup. Tres funcions: el guia principal fa el briefing, porta el ritme, registra els passos i té la decisió final; el guia local coneix el sector, coordina amb les comunitats i confirma acampades i alternatives; i un tancament fa el recompte. El grup és de vuit a tretze i a partir de deu hi ha suport. El dia s’organitza sempre igual: briefing, ritme de grup, reagrupaments i revisió al vespre.',
  '<p class="k">09 · Conducció del grup</p><h2>Qui fa què, i cada dia igual.</h2><div class="cols"><div><div class="card"><b>Guia principal</b><small>Briefing, valoració individual, ritme, registre de passos, decisió final d’aturar o modificar i coordinació d’emergència.</small></div><div class="card"><b>Guia local / operador</b><small>Reconeixement recent, coordinació amb comunitats, confirmació d’acampada i alternatives.</small></div><div class="card"><b>Tancament</b><small>Recompte i contacte amb el cap de grup; avís si algú es queda enrere. Suport local a partir de 10 clients.</small></div></div><div><ul><li><b>Abans:</b> conversa prèvia, reunió de grup a La Paz i revisió de material</li><li><b>Cada matí:</b> objectiu, condicions, aigua, punts de decisió i estat del grup</li><li><b>Durant:</b> ritme de grup, reagrupaments i interpretació en llocs adequats</li><li><b>Al vespre:</b> revisió del dia i checklist del guia</li><li><b>Després:</b> enquesta, autoavaluació i pla de millora</li></ul></div></div>',
  'Bloc 04 · cap. 8 i bloc 06 · cap. 10', False),

 ('Les dinàmiques fan grup i ensenyen. N’hi ha tres, en moments tranquils i en llocs coneguts: el mapa humà, el primer dia a La Paz, per aprendre noms i expectatives; Històries del camí, a Pelechuco o a Hilo Hilo, un relat cooperatiu; i Detectius del paisatge, el dia 9, per llegir el relleu i situar-lo al mapa. Tot el material pesa 145 grams. El dia del pas Sunchulli no hi ha tallers: la prioritat és caminar.',
  '<p class="k">10 · Dinàmiques i interpretació</p><h2>Aprendre caminant, sense perdre el ritme.</h2><table><tr><th>Dinàmica</th><th>Moment i lloc</th><th>Durada</th><th>Objectiu</th></tr><tr><td><b>El mapa humà</b></td><td>Dia 1, allotjament de La Paz</td><td>20–25 min</td><td>Aprendre els noms i compartir expectatives</td></tr><tr><td><b>Històries del camí</b></td><td>Dia 4 a Pelechuco o tarda del dia 6 a Hilo Hilo</td><td>25–30 min</td><td>Passar-ho bé i crear un relat cooperatiu</td></tr><tr><td><b>Detectius del paisatge</b></td><td>Dia 9, replà entre Tambillo i el Campament 3</td><td>15–20 min</td><td>Llegir el relleu i situar-lo al mapa</td></tr></table><div class="cols" style="margin-top:.9em"><div class="card"><b>Kit de 145 g</b><small>Tot el material de les dinàmiques cap en una butxaca de la motxilla.</small></div><div class="card"><b>Dia 7, sense tallers</b><small>El dia del Pas Sunchulli la prioritat és caminar i passar el coll a temps.</small></div></div>',
  'Bloc 04 · cap. 8', False),

 ('La seguretat també és organització. Aquests són els sis riscos principals, què fem abans i què fem si passa. L’altitud: tres nits a La Paz, uns cinc-cents metres de desnivell de nit per dia i revisió amb medicina del viatge; amb símptomes no es puja a dormir més amunt. La neu al coll: hora límit a les 14.40 i, si no es pot, dia de reserva o pla C. Les carreteres: consulta als transportistes i a l’ABC 48 i 24 hores abans. L’aigua, per l’efecte del mercuri a les zones mineres. L’aïllament: Garmin inReach (GPS i comunicador satèl·lit) i assegurança amb rescat, però un SOS no garanteix vehicle ni helicòpter, per això l’evacuació s’acorda amb l’operador abans de sortir. I els permisos del SERNAP. Hi ha dos dies de reserva inclosos al preu. El detall cartogràfic dels plans el presento a l’altra assignatura.',
  '<p class="k">11 · Seguretat i imprevistos</p><h2>Riscos principals i com es gestionen.</h2><table class="c s"><tr><th>Risc</th><th>Prevenció</th><th>Si passa</th></tr>'
  '<tr><td><b>Altitud</b></td><td>3 nits a La Paz, ≈500 m per nit, revisió amb medicina del viatge i registre diari</td><td>Amb símptomes no es puja a dormir més amunt; signes greus: descens i assistència</td></tr>'
  '<tr><td><b>Neu o gel al coll</b></td><td>Finestra del 15/6 al 31/7; previsió 48 h i 24 h amb dues fonts; hora límit 14.40</td><td>No es creua: dia de reserva o pla C</td></tr>'
  '<tr><td><b>Carreteres i conflictes</b></td><td>ABC i transportistes 48 h i 24 h abans de cada trasllat</td><td>2 dies de reserva; pla B o pla C</td></tr>'
  '<tr><td><b>Aigua i mercuri</b></td><td>Només fonts per sobre de les mines o confirmades per la comunitat</td><td>L’aigua es tracta sempre</td></tr>'
  '<tr><td><b>Aïllament i evacuació</b></td><td>Garmin inReach (SOS i missatges), expedient d’obertura amb contactes reals, assegurança amb rescat</td><td>Un SOS no garanteix vehicle ni helicòpter: l’evacuació s’acorda amb l’operador</td></tr>'
  '<tr><td><b>Permisos</b></td><td>Permís escrit del SERNAP i registre a Pelechuco i Lagunillas</td><td>Es resol abans de sortir; si no, pla C</td></tr></table><p class="mini" style="margin-top:.9em">Mitjans: Garmin inReach, farmaciola de grup, oxímetre i material de seguretat del grup · 2 dies de reserva inclosos al preu.</p>',
  'Bloc 06 · cap. 10 i bloc 04 · annex A', False),

 ('L’avaluació no es queda al paper. Fem servir cinc instruments: fitxa de metodologia, checklist diari, enquesta del client, autoavaluació del guia i pla de millora. Tres estan construïts i operatius, encara per provar amb clients reals: l’enquesta és un formulari anònim en quatre idiomes que el client obre amb aquest QR en acabar el viatge, i les respostes arriben a un full de càlcul; el checklist i l’autoavaluació són dins de l’app del guia, funcionen sense cobertura i s’exporten en PDF o CSV.',
  '<p class="k">12 · Avaluació</p><h2>Cinc instruments, tres operatius.</h2><div class="cols m"><div class="qr"><img src="assets/enquesta-qr.svg" alt="QR de l’enquesta"><small>Enquesta anònima · ca, es, en, fr</small></div><div><div class="card"><b>Enquesta del client · formulari en línia</b><small>Anònima, uns 3 minuts, en l’idioma del client. Nou afirmacions d’1 a 5 i quatre preguntes obertes. Respostes a un full de càlcul.</small></div><div class="card"><b>Checklist diari · app del guia</b><small>Dotze comprovacions abans de sortir, decisió d’inici i registre de la jornada. Sense cobertura; PDF o CSV.</small></div><div class="card"><b>Autoavaluació del guia · app del guia</b><small>Deu aspectes d’1 a 5 amb un fet observable, en les 72 h posteriors.</small></div><p class="mini" style="margin-top:.6em">També: fitxa de metodologia i pla de millora per a la següent edició.</p></div></div>',
  'Bloc 04 · annex A · pàgina del treball', False),

 ('La comunicació només afirma el que es pot acreditar. La web té dues parts: la del client, amb el viatge, el preu i les condicions, i la del treball. El flyer porta un codi QR a la web. I la campanya és de vuit setmanes, amb l’objectiu de vuit reserves adequades al perfil.',
  '<p class="k">13 · Màrqueting i web</p><h2>Dir només el que es pot acreditar.</h2><div class="cols"><div><ul><li>Web del client: etapes, preu i condicions, sense tracks ni meteo</li><li>Documents per al client: fitxa, preparació, pla d’entrenament i dossier complet per WhatsApp</li><li>Campanya de vuit setmanes a Instagram i clubs</li><li>Objectiu: 8 reserves; calen 80–160 consultes</li><li>Reserves no obertes: projecte acadèmic</li></ul></div><div class="fit"><img src="assets/flyer.jpg" alt="Flyer"></div></div>',
  'Bloc 01 · cap. 7', False),

 ('Per acabar: l’organització és coherent sobre el paper, i sé què falta per convertir-la en un viatge real. Validar les condicions amb assessoria, l’alta i les garanties, el permís del SERNAP, les cotitzacions locals i el reconeixement de camp. Moltes gràcies; quedo a la vostra disposició per a preguntes.',
  f'<p class="k">14 · Conclusions</p><h2>Què queda definit i què falta.</h2><div class="cols"><div><p><b>Definit</b></p><ul><li>Model d’empresa i marc legal</li><li>Producte, client i condicions</li><li>Pressupost amb sensibilitat</li><li>Conducció, dinàmiques i avaluació en ús</li></ul></div><div><p><b>Abans de vendre</b></p><ul><li>Assessoria: condicions, fiscalitat i garantia</li><li>Acreditació del guia local a Bolívia</li><li>Permís escrit del SERNAP i operador</li><li>Cotitzacions locals i reconeixement de camp</li></ul></div></div><p class="big" style="font-size:1.7em;margin:.4em 0 1.6em">Moltes gràcies.</p>',
  'Web: ' + WEB, True),
]

# ───────────────────────── 2 · ORIENTACIÓ, CARTOGRAFIA I PLANIFICACIÓ ─────────────────────────
ORI_SUBJ = 'Orientació, cartografia i planificació'
ORI = [
 ('Bon dia. Soc l’Izan Pimentel i us presento la planificació de la travessa Pelechuco–Charazani, a l’Apolobamba. Avui em centro en com he construït la ruta: les fonts i la cartografia, el càlcul d’horaris i de llum, l’altitud, els punts de decisió, la meteorologia, les alternatives i les eines de navegació.',
  cover(ORI_SUBJ, 'Com s’ha planificat la travessa: fonts, mapes, horaris, llum, decisions i alternatives.', 'Ruta, mapes i decisions'), '', True),

 ('Aquesta és la zona. La Cordillera d’Apolobamba és a la frontera amb el Perú, dins d’una àrea protegida. La travessa va de Pelechuco a Charazani: sis jornades, 53 quilòmetres, diversos passos alts i el Pas Sunchulli, a 5.032 metres segons el GPS i fins a 5.100 segons altres fonts. Al mapa general hi ha la ruta principal, els plans B, el pla C i els punts on pot arribar un vehicle.',
  '<p class="k">01 · La zona</p><h2>Pelechuco → Charazani.</h2><div class="cols w"><div class="fit"><img src="assets/maps/general-ca.webp" alt="Mapa general"></div><div><ul><li>ANMI Apolobamba, La Paz (Bolívia)</li><li>53,4 km · +3.450 / −3.915 m</li><li>Pas Sunchulli: 5.032 m (GPX); fins a 5.100 m segons altres fonts</li><li>Cinc nits en tenda, de 4.010 a 4.700 m</li><li>≈36 % del camí va per pistes mineres</li></ul><p class="mini" style="margin-top:.8em">Mapa general de l’Atles A3: ruta, plans B, pla C i sortides en vehicle.</p></div></div>',
  'Atles cartogràfic · làmina 1', False),

 ('No he recorregut la ruta, i el treball ho diu. Però no em quedo només amb el GPS de 2012: és la base de la geometria i dels temps, i l’he posat al dia amb fonts recents. OpenStreetMap mostra que prop d’un terç del camí ja és pista minera, i això obre sortides en vehicle. Relats i registres de 2022 a 2025 confirmen el corredor, Hilo Hilo i els passos, i un d’ells avisa d’un problema de navegació cap a Lorisani. Sis operadors, consultats aquest novembre, coincideixen en llocs i durades. I les carreteres, amb els informes de l’ABC de 2025 i 2026. Tot plegat diu que el disseny és versemblant, però no com està el camí avui.',
  '<p class="k">02 · Fonts</p><h2>Una base de 2012, posada al dia.</h2><div class="cols"><div><table class="c"><tr><th>Font</th><th>Any</th><th>Què aporta</th></tr><tr><td>Track GPS (Wikiloc)</td><td>2012</td><td>Geometria i temps de pas (199 punts)</td></tr><tr><td>Relats i registres de caminants</td><td>2022–2025</td><td>Corredor, Hilo Hilo, passos i accés; avís de navegació cap a Lorisani</td></tr><tr><td>OpenStreetMap i SRTM</td><td>2026</td><td>≈36 % del camí ja és pista minera; rutes dels plans B i C</td></tr><tr><td>Sis operadors bolivians</td><td>nov. 2026</td><td>Llocs, cotes i durades</td></tr><tr><td>ABC (carreteres)</td><td>2025–2026</td><td>Talls i esllavissades</td></tr></table></div><div><table class="c"><tr><th>Dada</th><th>GPX 2012</th><th>Fonts recents</th></tr><tr><td>Hilo Hilo</td><td>4.010 m</td><td>4.010 m</td></tr><tr><td>Pas Sunchulli</td><td>5.032 m</td><td>5.100 m</td></tr><tr><td>Etapa 2 sencera</td><td>7 h 17</td><td>unes 9 h</td></tr><tr><td>Camp de Sunchulli</td><td>4.717 m</td><td>uns 4.500 m</td></tr><tr><td>Pistes mineres</td><td>no hi consten</td><td>≈36 % del camí</td></tr><tr><td>Final</td><td>Charazani</td><td>sovint Curva</td></tr></table></div></div><p class="band">Confirmen que el disseny és versemblant. No substitueixen el reconeixement: passos, campaments, aigua i el pont de l’última jornada.</p>',
  'Bloc 06 · cap. 9 i 10 · annex E', False),

 ('Amb aquestes dades he fet un atles de 11 làmines A3: el mapa general, una làmina per jornada i quatre del pla C. La base és OpenTopoMap, amb corbes de nivell i rius. Projecció web Mercator, graella en graus WGS84, quadrícula UTM 19 Sud cada quilòmetre, declinació apuntada a cada làmina i escala gràfica corregida a la latitud. El GPS i les coordenades UTM 19 Sud de l’app i del SOS fan servir el mateix datum, WGS84: només canvia la forma d’expressar la posició. Cada làmina porta perfil, punts de pas amb hora, evacuacions i plans B. Els topònims s’han normalitzat: el que al GPS diu Hilohilo o Paso Sunchulli, al text és Hilo Hilo i Pas Sunchulli. L’atles no és una carta oficial: l’IGM de Bolívia edita la sèrie 1:50.000, i la tinc pendent de contrastar abans de sortir.',
  '<p class="k">03 · Cartografia</p><h2>Un atles de 11 làmines A3.</h2><div class="cols w"><div class="fit"><img src="assets/maps/jornada-7-ca.webp" alt="Làmina del dia 7"></div><div><ul><li>Base OpenTopoMap: relleu, corbes i hidrografia</li><li>Web Mercator (EPSG:3857), graella en graus WGS84 i escala corregida a la latitud</li><li>Quadrícula UTM 19 S cada 1 km i declinació (≈ 9,8° O); mateix datum (WGS84) que el GPS i l’app</li><li>No és carta oficial: per contrastar amb la sèrie 1:50.000 de l’IGM abans de sortir</li></ul><table class="c" style="margin-top:.6em"><tr><th>GPX</th><th>Text</th></tr><tr><td>Hilohilo</td><td>Hilo Hilo</td></tr><tr><td>Paso Sunchulli</td><td>Pas Sunchulli</td></tr><tr><td>Charasani / Fin</td><td>Charazani</td></tr></table></div></div>',
  'Bloc 06 · cap. 11 · Atles, làmina del dia 7', False),

 ('Aquestes són les sis jornades. La decisió clau del disseny és partir la segona etapa del traçat en dos dies, amb nit a Hilo Hilo. L’última jornada té un punt de decisió a la cruïlla de Curva. Cap jornada supera les nou hores i mitja.',
  '<p class="k">04 · Les jornades</p><h2>Sis jornades que caben en la llum.</h2>' + DAYS_TABLE + '<p style="margin-top:.8em"><b>Regla de llum:</b> sortida a partir de les 07.10 i arribada abans de les 16.40.</p>',
  'Bloc 06 · cap. 10 · totals arrodonits sobre el track', False),

 ('Com he calculat els horaris. El GPS de 2012 conserva l’hora de cada punt: és el temps d’una persona sense grup. A la planificació multiplico aquests temps per un factor d’1,1 a 1,6 per a un grup de vuit a tretze amb parades i reagrupaments; els dies curts de recuperació, més. La prova és l’etapa 2 sencera: 7 hores i 17 minuts el 2012, que per a un grup són de nou hores i mitja a gairebé dotze. No cap en la llum, i per això la partim en dos dies. Els operadors actuals, que la fan en unes nou hores, ho confirmen.',
  '<p class="k">05 · Càlcul d’horaris</p><h2>Del temps d’una persona al d’un grup.</h2><table class="c"><tr><th>Jornada</th><th>Registre 2012</th><th>Planificació</th><th>Factor</th></tr><tr><td>Dia 5 · 9,7 km</td><td>5 h 34</td><td>6–8 h</td><td>1,1–1,4</td></tr><tr><td>Dia 6 · 4,2 km</td><td>1 h 17</td><td>2–3 h</td><td>1,6–2,3 (recuperació)</td></tr><tr><td>Dia 7 · 11,4 km</td><td>6 h 00</td><td>7–9 h</td><td>1,2–1,5</td></tr><tr><td>Dia 8 · 8,3 km</td><td>4 h 29</td><td>5–7 h</td><td>1,1–1,6</td></tr><tr><td>Dia 9 · 4,1 km</td><td>2 h 32</td><td>4–6 h</td><td>1,6–2,4</td></tr><tr><td>Dia 10 · 15,8 km</td><td>5 h 57</td><td>8–9 h 30</td><td>1,3–1,6</td></tr><tr class="w"><td>Etapa 2 sencera · 15,6 km</td><td>7 h 17</td><td>9 h 30–11 h 40</td><td>1,3–1,6 → no cap</td></tr></table><p class="mini" style="margin-top:.6em">El registre no indica la mida del grup ni les parades: és una referència mínima, no un horari.</p>',
  'Bloc 06 · cap. 9', False),

 ('La finestra de llum la he calculada jo amb les equacions solars de la NOAA per a Pelechuco. Al juny de 2027 el sol surt entre les 6.54 i les 7.02 i es pon cap a les 18.15. Vull ser al lloc segur noranta minuts abans de la posta: cap a les 16.40. D’aquí surt la regla: sortida a partir de les 7.10 i arribada abans de les 16.40, una finestra màxima de nou hores i mitja. A la barra, per a un dia de mitjan juny, es veu la marxa útil en verd i la reserva de llum en daurat. I a cada punt de control, l’hora límit és 16.40 menys el temps conservador fins al lloc segur següent.',
  '<p class="k">06 · Llum</p><h2>Nou hores i mitja de marxa útil.</h2><div class="cols" style="flex:none"><div><table class="c"><tr><th>Juny 2027</th><th>Sortida del sol</th><th>Posta</th><th>Posta − 90 min</th></tr><tr><td>1 de juny</td><td>06:54</td><td>18:13</td><td>16:43</td></tr><tr><td>15 de juny</td><td>06:59</td><td>18:14</td><td>16:44</td></tr><tr><td>30 de juny</td><td>07:02</td><td>18:17</td><td>16:47</td></tr></table><p class="mini" style="margin-top:.5em">Càlcul propi amb les equacions NOAA per a Pelechuco (−14,820°, −69,071°), hora de Bolívia (UTC−4). Horitzó ideal: el relleu i els núvols redueixen la llum útil.</p></div><div><div class="card"><b>Regla de la travessa</b><small>Sortida a partir de les 07.10 · arribada abans de les 16.40 · màxim 9 h 30.</small></div><div class="card"><b>Hora límit de cada punt</b><small>16.40 menys el temps conservador fins al lloc segur següent. Frontal només per a contingències.</small></div></div></div>'
  '<p class="mini" style="margin:1.1em 0 .2em"><b>Dia tipus: 15 de juny de 2027</b></p><div class="tl"><div class="n" style="flex:59"></div><div class="d" style="flex:11"></div><div class="w" style="flex:570">Marxa útil · 9 h 30</div><div class="g" style="flex:94">Reserva · 1 h 34</div><div class="n" style="flex:46"></div></div><p class="mini">Sortida del sol 06:59 · inici de la marxa 07:10 · arribada al lloc segur 16:40 · posta 18:14</p>',
  'Bloc 06 · cap. 10.1', False),

 ('L’altitud condiciona el calendari. La referència és no pujar més d’uns cinc-cents metres de cota de nit per dia per sobre dels tres mil; el primer salt, de Pelechuco al Campament 1, és de 508. La nit d’Hilo Hilo és més baixa que l’anterior i fa d’adaptació abans del pas. La nit crítica és la del Campament 2: al GPX és a 4.717 metres, 707 més que Hilo Hilo, i per això proposo situar-lo cap als 4.500.',
  '<p class="k">07 · Perfil i aclimatació</p><h2>On dormim cada nit.</h2><div class="fit"><img src="assets/pres-altitud.png" alt="Cota de cada nit"></div>',
  'Referència: CDC Yellow Book 2026 · Bloc 03, cap. 4.2', False),

 ('Els punts de decisió són on la planificació es converteix en una decisió concreta. El perfil del dia 7 els mostra: l’última mitja volta còmoda és a Agua buena 3 a les 13.40; si a les 14.40 no som al Pas Sunchulli, mitja volta i el 4×4 ens recull per la pista, i amb neu dura o gel no es creua. El dia 10, a la cruïlla de Curva a les 11.10, si anem justos, acabem a Curva amb vehicle; els operadors sumen fins a deu hores per a tota la jornada, així que amb grup és el final probable i la recollida es contracta sempre. I a qualsevol punt segur, abans de continuar comparo el temps per seguir i el de tornar, amb noranta minuts de reserva abans de la posta. El perfil és esquemàtic: uneix els punts de pas del GPX.',
  '<p class="k">08 · Punts de decisió</p><h2>Hores límit escrites abans de sortir.</h2><div class="cols w"><div>' + profile_svg(7, 'Pas Sunchulli', '14.40 · hora límit') + '<p class="mini">Dia 7 · perfil esquemàtic entre els punts de pas del GPX.</p><p class="mini" style="margin-top:.5em"><b>Retirada ordinària:</b> només pel camí comprovat fins al darrer punt segur. Símptomes greus d’altitud: descens prioritari i assistència.</p></div><div><div class="card"><b>Dia 7 · Pas Sunchulli · 14.40</b><small>Última mitja volta còmoda: Agua buena 3, 13.40. Si a les 14.40 no s’hi és, mitja volta i 4×4 per la pista. Amb neu dura o gel, no es creua.</small></div><div class="card"><b>Dia 10 · Cruïlla de Curva · 11.10</b><small>Passada l’hora, o si Charazani passaria de les 16.10 (30 min de marge sobre la hora límit): final a Curva amb vehicle. Amb grup és el final probable.</small></div><div class="card"><b>A cada punt segur</b><small>Comparar el temps per seguir i per tornar, amb 90 min de reserva abans de la posta.</small></div></div></div>',
  'Bloc 06 · cap. 10 · app del guia', False),

 ('I si no es veu el coll? Amb boira, la navegació es fa amb un mètode escrit. Abans de sortir, a l’atles i al GPS tinc l’azimut i la distància entre punts de pas. Aquí, de l’Agua buena 3 al Pas Sunchulli: un quilòmetre i quatre pel camí, uns dos-cents metres de pujada i un azimut d’uns cent trenta-cinc graus respecte al nord vertader. El nord del mapa és el vertader: abans de fer servir l’azimut amb la brúixola, s’ha de passar a magnètic amb la declinació, que és oest: unes 9,8° el 20/06/2027 (model NOAA WMMHR-2025: 9,84° O a Pelechuco i 9,79° O a Charazani, amb un canvi de 0,23° per any). Cal sumar-la a l’azimut vertader. En marxa, cada punt es confirma amb tres dades: cota, temps i azimut seguit. Si una no coincideix, es para, es reagrupa el grup i es torna al darrer punt segur. No s’inventen dreceres.',
  '<p class="k">09 · Navegació</p><h2>Si no es veu el coll: navegar amb boira.</h2><div class="cols"><div><ol><li><b>Abans de sortir:</b> azimut i distància entre punts de pas, a l’atles i al GPS</li><li><b>En marxa:</b> cada punt es confirma amb tres dades: cota, temps i azimut seguit</li><li><b>Si una no coincideix:</b> parar, reagrupar i tornar al darrer punt segur</li><li><b>Mai una drecera improvisada;</b> amb neu dura o gel, el coll no es creua</li><li><b>Redundància:</b> atles, brúixola i GPS; l’app complementa</li></ol></div><div>' + FOG_CARD + '<div class="card"><b>Declinació magnètica</b><small>El nord del mapa és el vertader. Declinació oest de ≈ 9,8° (NOAA WMMHR-2025, 20/06/2027; 0,23° de canvi per any). Azimut magnètic = azimut vertader + 9,8°; s’apunta a cada làmina.</small></div></div></div>',
  'Atles cartogràfic · app del guia', False),

 ('La meteorologia es consulta 48 i 24 hores abans, cada matí i abans de cada pas crític, amb dues fonts com a mínim; si no coincideixen, es decideix amb la més desfavorable. SENAMHI és la font oficial. Windy dona el model europeu al punt exacte del pas: vent a 500 hectopascals i isoterma de zero graus. Meteoblue compara models, Mountain-Forecast dona la previsió per cotes i el satèl·lit GOES mostra les tempestes que entren de l’Amazònia. Durant la travessa no hi ha cobertura: la previsió arriba pel Garmin inReach.',
  '<p class="k">09 · Meteorologia</p><h2>Dues fonts, i es decideix amb la pitjor.</h2><div class="cols"><div><table class="c"><tr><th>Font</th><th>Per a què</th></tr><tr><td>SENAMHI</td><td>Font oficial: pronòstic i avisos</td></tr><tr><td>Windy (ECMWF)</td><td>Al Pas Sunchulli (−14,997; −68,997): vent a 500 hPa, isoterma 0 °C, núvols</td></tr><tr><td>Meteoblue</td><td>Meteograma i comparació de models</td></tr><tr><td>Mountain-Forecast</td><td>Vent i fred a la cota dels passos</td></tr><tr><td>Satèl·lit GOES</td><td>Tempestes que entren des de l’Amazònia</td></tr></table></div><div><div class="card"><b>Quan</b><small>48 h i 24 h abans, cada matí i abans de cada pas crític. Es registra font, hora i decisió.</small></div><div class="card"><b>Durant la travessa</b><small>Sense cobertura: Garmin inReach, guia local i arrier, i observació del cel, el vent i la pressió.</small></div><div class="card"><b>Amb neu dura o gel al pas</b><small>No es creua: es fa servir un dia de reserva o el pla C.</small></div></div></div>',
  'Bloc 06 · cap. 10 · annex E', False),

 ('La temporada i els plans B. La millor època és de mitjan juny a finals de juliol: a l’agost hi ha hagut nevades fortes al Pas Sunchulli. Cada jornada té un pla B: hora límit al pas, una baixada alternativa a les Mil Corbes pel sud del Pas 5, i final a Curva. Com que un terç del camí ja va per pistes mineres, gairebé sempre hi ha sortida en vehicle. I una dada de planificació: l’aigua s’agafa només per sobre de les mines, perquè tractar-la no elimina el mercuri.',
  '<p class="k">10 · Temporada i plans B</p><h2>Juny i juliol, amb un pla B a cada jornada.</h2><div class="cols"><div><p><b>Finestra recomanada: del 15 de juny al 31 de juliol</b></p><div class="months"><span>G</span><span>F</span><span>M</span><span>A</span><span class="ok">M</span><span class="best">J</span><span class="best">J</span><span class="risk">A</span><span class="ok">S</span><span>O</span><span>N</span><span>D</span></div><p class="mini">Fosc: recomanat · verd: possible · beix: risc de nevades fortes (1993, 2019) · gris: no.</p><ul><li>≈36 % del camí per pistes mineres: sortida en vehicle gairebé sempre</li><li>Aigua només per sobre de les mines</li></ul></div><div><div class="card"><b>Pas Sunchulli · dia 7</b><small>Hora límit 14.40. Amb neu dura o gel no es creua: dia de reserva.</small></div><div class="card"><b>Mil Corbes · dia 8</b><small>Baixada alternativa pel sud del Pas 5 (2,9 km, −600 m, uns 200 m sense cartografiar) o nit a Quellwa Cota.</small></div><div class="card"><b>Final · dia 10</b><small>Decisió a Curva a les 11.10; sense pont confirmat, final a Curva.</small></div></div></div>',
  'Bloc 06 · cap. 10.2–10.6 · GPX dels plans B', False),

 ('Si abans de sortir el Pas Sunchulli està tancat, o la zona minera no ho aconsella, hi ha un pla C complet pel camí de l’Akamani. El dia 4 anem en vehicle de La Paz a Curva i fem quatre etapes: trenta-cinc quilòmetres i un màxim de 4.661 metres, sense passar per Sunchulli ni per les Mil Corbes. El traçat surt d’OpenStreetMap i SRTM, amb un marge d’error del deu per cent, i s’ha de reconèixer.',
  '<p class="k">11 · Pla C</p><h2>Una ruta completa per l’Akamani.</h2><div class="cols w"><div><table class="c"><tr><th>Etapa</th><th>Recorregut</th><th>Km</th><th>Desnivell</th><th>Hores</th><th>Nit</th></tr><tr><td>C1</td><td>Curva → Cañisaya</td><td>5,2</td><td>+200 / −60</td><td>2–3</td><td>3.880 m</td></tr><tr class="w"><td>C2</td><td>Cañisaya → Pas d’Akamani (4.661 m) → Incacancha</td><td>10,0</td><td>+950 / −750</td><td>6–8</td><td>4.060 m</td></tr><tr><td>C3</td><td>Incacancha → Pas Lorisani → Huayrapata</td><td>12,1</td><td>+580 / −950</td><td>6–8</td><td>3.700 m</td></tr><tr><td>C4</td><td>Huayrapata → Pas de Chatalayo → RN16 → Charazani</td><td>7,3</td><td>+340 / −680</td><td>4–5</td><td>3.195 m</td></tr></table><div class="card" style="margin-top:.6em"><b>Quan s’activa</b><small>Abans de sortir (pas tancat, conflicte miner, sense permisos) o des d’Incacancha, per C3 i C4.</small></div></div><div class="fit"><img src="assets/maps/pla-c-c2-ca.webp" alt="Làmina de l’etapa C2"></div></div>',
  'Traçat: OpenStreetMap i SRTM (±10 %) · per reconèixer', False),

 ('Les eines de navegació. L’atles imprès i la brúixola són la base. El GPS porta els GPX de la ruta, de cada pla B i del pla C. I he fet una app per al guia que funciona sense cobertura: hora de Bolívia, llum fins al lloc segur, posició GPS sobre el traçat, retard, la pròxima hora límit amb la seva decisió, el mapa desat i una pantalla SOS amb coordenades WGS84 i UTM 19 Sud. L’app no substitueix el mapa, la brúixola ni el GPS: els complementa.',
  '<p class="k">12 · Eines de navegació</p><h2>Mapa, brúixola, GPS i una app sense cobertura.</h2><div class="cols"><div><ul><li><b>Atles A3 imprès</b> i brúixola</li><li><b>GPS</b> amb els GPX de la ruta, els plans B i el pla C</li><li><b>Garmin inReach:</b> GPS, previsió, missatges i SOS</li><li><b>Coordenades</b> en WGS84 i UTM 19 S</li></ul><p class="band" style="font-size:.85em">L’app complementa, no substitueix, el mapa, la brúixola i el GPS.</p></div><div><div class="card"><b>App del guia · sense cobertura</b><small>Hora de Bolívia i llum · GPS sobre el traçat i retard · pròxima hora límit i decisió · mapa desat · plans B i C · meteo per punts · SOS amb WGS84/UTM 19S.</small></div><div class="card"><b>Al vespre</b><small>Checklist del dia i registre de passos, decisions i condicions.</small></div></div></div>',
  'Bloc 06 · cap. 10 i 11 · ' + WEB + '/guia', False),

 ('Per acabar: la ruta està planificada amb fonts contrastades, horaris justificats, una finestra de llum calculada i decisions escrites. El que falta és el reconeixement de camp: el traçat, els temps reals, el Campament 2, la baixada alternativa, el pla C i el pont de l’última jornada. Moltes gràcies; quedo a la vostra disposició per a preguntes.',
  '<p class="k">13 · Conclusions</p><h2>Planificada al detall, pendent de trepitjar.</h2><div class="cols"><div><p><b>Definit</b></p><ul><li>GPX de 2012 posat al dia amb fonts de 2022–2026</li><li>Topònims normalitzats</li><li>Atles A3 i GPX de tots els plans</li><li>Horaris amb factor de grup i regla de llum</li><li>Punts de decisió, meteo i alternatives</li></ul></div><div><p><b>Reconeixement de camp</b></p><ul><li>Traçat, temps reals i cotes de nit</li><li>Campament 2 cap als 4.500 m</li><li>Baixada alternativa a les Mil Corbes i pla C</li><li>Contrast amb la carta oficial de l’IGM</li><li>Aigua, pont final i comunicacions</li></ul></div></div><p class="big" style="font-size:1.7em;margin:.4em 0 1.6em">Moltes gràcies.</p>',
  'Web: ' + WEB, True),
]

CHOOSER = HEAD.format(title='Presentacions · Andes Wild Trek · Apolobamba', css=CSS + r"""
body{overflow:auto}.pick{min-height:100%;display:flex;flex-direction:column;justify-content:center;max-width:1100px;margin:0 auto;padding:48px 24px;color:var(--cream)}
.pick h1{font-size:clamp(34px,5vw,60px);margin:0 0 .4em}.pick .k{color:var(--gold);font-size:12px}.pick>p{color:#c9d3cb;max-width:640px;line-height:1.5}
.two{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:28px}.two a{display:flex;flex-direction:column;gap:10px;background:#fffefa;color:var(--ink);border-radius:12px;padding:26px 26px 22px;text-decoration:none;border:2px solid transparent;transition:border-color .2s,transform .2s}.two a:hover{border-color:var(--gold);transform:translateY(-3px)}
.two span{font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#8a7a4e}.two b{font:400 clamp(22px,2.6vw,30px)/1.15 var(--serif);color:var(--forest)}.two small{color:var(--muted);font-size:14px;line-height:1.5}.two em{font-style:normal;margin-top:auto;font-weight:700;font-size:14px;color:var(--forest)}
.back{margin-top:30px;color:var(--gold);font-weight:600;text-decoration:none;font-size:14px}
@media(max-width:700px){.two{grid-template-columns:1fr}}
""") + """<main class="pick"><p class="k">Treball TD2 · Andes Wild Trek · Apolobamba</p><h1>Presentacions</h1>
<p>Una presentació per assignatura, d’uns 15 minuts cadascuna. Dins de la presentació: fletxes o clic per avançar, tecla N per al guió i botó de pantalla completa.</p>
<div class="two">
<a href="presentacio-organitzacio.html"><span>Assignatura 1</span><b>Organització d’activitats de muntanya · Escola de senderisme</b><small>Empresa, normativa i legislació, contracte i condicions, client, programa, pressupost, conducció del grup, dinàmiques, seguretat, avaluació i màrqueting.</small><em>""" + f'{len(ORG)} diapositives →' + """</em></a>
<a href="presentacio-orientacio.html"><span>Assignatura 2</span><b>Orientació, cartografia i planificació</b><small>Zona i fonts, atles cartogràfic, jornades, càlcul d’horaris i de llum, aclimatació, punts de decisió, meteorologia, plans B i C i eines de navegació.</small><em>""" + f'{len(ORI)} diapositives →' + """</em></a>
</div><a class="back" href="treball.html">← Tornar al treball</a></main></body></html>
"""

if __name__ == '__main__':
    deck('presentacio-organitzacio.html', 'Organització d’activitats · Andes Wild Trek · Apolobamba', ORG)
    deck('presentacio-orientacio.html', 'Orientació, cartografia i planificació · Andes Wild Trek · Apolobamba', ORI)
    open(os.path.join(ROOT, 'presentacio.html'), 'w', encoding='utf8').write(CHOOSER)
    print('presentacio.html (tria)')
