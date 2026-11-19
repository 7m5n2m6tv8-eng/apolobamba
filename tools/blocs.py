#!/usr/bin/env python3
"""Regenera els blocs 01–06 a partir del treball complet i actualitza modules.json (text i pàgines).

Cada bloc = portada + les pàgines del PDF complet on comencen els capítols indicats (fins al
capítol següent). També escriu Apolobamba_Formularis_Operatius.pdf (annexos A i B). El bloc 05 es fa amb la fitxa del viatge i la preparació del client (CA).
Executa-ho des de l'arrel:  python3 tools/blocs.py   (necessita pypdf i reportlab)
"""
import io, json, re, sys
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parent.parent
FULL = ROOT / 'dossiers/Apolobamba_TD2_Treball_Complet.pdf'
DATE = '19.11.2026'
# id → (fitxer, capítols). Capítols: '1'..'11' i annexos 'A'..'E'
BLOCS = {
    'marketing': ('dossiers/01_Marqueting.pdf', ['7']),
    'normativa': ('dossiers/02_Normativa.pdf', ['3', '6', 'B']),
    'empresa': ('dossiers/03_Entorn_Laboral_Pressupost.pdf', ['1', '2', '4', '5']),
    'metodologia': ('dossiers/04_Metodologia.pdf', ['8', 'A']),
    'client': ('dossiers/05_Fitxa_Client.pdf', None),
    'guia': ('dossiers/06_Fitxa_Guia.pdf', ['4', '9', '10', '11', 'B', 'C', 'D', 'E']),
}


def heading_pages(texts):
    """Pàgina on comença cada capítol. Els títols surten de l'índex (pàgina 2) i es busquen a l'inici d'una línia."""
    idx = next(i for i, t in enumerate(texts) if 'Índex' in t)
    titles = {}
    for line in texts[idx].splitlines():
        m = re.match(r'^(\d{1,2}\.|Annex [A-E]\.)\s*(.+?)\s*\.{3,}\s*\d+$', line)
        if m: titles[m.group(1).rstrip('.').replace('Annex ', '')] = (m.group(1) + ' ' + m.group(2))[:40]
    starts = {}
    for i in range(idx + 1, len(texts)):
        lines = [l.strip() for l in texts[i].splitlines()]
        for ch, title in titles.items():
            if ch not in starts and any(l.startswith(title) for l in lines):
                starts[ch] = i
    return starts


def cover(name, num, sections):
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=A4); w, h = A4
    c.setFillColorRGB(.086, .243, .2); c.rect(0, 0, w, h, stroke=0, fill=1)
    c.setFillColorRGB(.91, .78, .47); c.setFont('Helvetica', 10); c.drawString(45, h - 55, 'ANDES WILD TREK / APOLOBAMBA')
    c.setFillColorRGB(1, 1, 1); c.setFont('Helvetica-Bold', 26); c.drawString(45, h - 125, name)
    c.setFont('Helvetica', 11); c.drawString(45, h - 165, f'Bloc {num:02d} de 06')
    for k, s in enumerate(sections): c.drawString(45, h - 235 - 30 * k, s)
    c.setFont('Helvetica', 10)
    for y, s in [(150, 'Pelechuco - Charazani · sis jornades de marxa · 11 dies + 2 de reserva'), (125, f'{DATE} · Izan Pimentel Pérez · TD2 Mitja Muntanya'),
                 (100, 'Projecte acadèmic · programa pendent de reconeixement de camp'), (75, 'Web del projecte: https://7m5n2m6tv8-eng.github.io/apolobamba/')]:
        c.drawString(45, y, s)
    c.save(); buf.seek(0); return PdfReader(buf).pages[0]


def main():
    full = PdfReader(FULL); texts = [p.extract_text() or '' for p in full.pages]
    st = heading_pages(texts)
    order = sorted(st.items(), key=lambda kv: kv[1])
    rng = {}
    for k, (ch, p) in enumerate(order):
        end = order[k + 1][1] if k + 1 < len(order) else len(texts)
        rng[ch] = range(p, max(end, p + 1))
    print('capítols:', {k: (r.start + 1, r.stop) for k, r in rng.items()})
    mods = json.loads((ROOT / 'modules.json').read_text())
    for num, d in enumerate(mods, 1):
        f, chs = BLOCS[d['id']]
        w = PdfWriter(); w.add_page(cover(d['name'], num, d['sections']))
        if chs is None:
            pages = [p for n in ('Fitxa_Viatge_CA', 'Preparacio_Material_CA') for p in PdfReader(ROOT / f'dossiers/client/{n}.pdf').pages]
        else:
            idx = sorted({i for ch in chs for i in rng[ch]})
            pages = [full.pages[i] for i in idx]
        for p in pages: w.add_page(p)
        w.write(ROOT / f)
        d['pages'] = len(pages) + 1
        d['text'] = re.sub(r'\s+', ' ', ' '.join(p.extract_text() or '' for p in pages)).strip()
        print(f, len(pages) + 1, 'pàgines')
    (ROOT / 'modules.json').write_text(json.dumps(mods, ensure_ascii=False))
    # Formularis operatius = annexos A i B, sense portada
    w = PdfWriter()
    for i in sorted({i for ch in ('A', 'B') for i in rng[ch]}): w.add_page(full.pages[i])
    w.write(ROOT / 'dossiers/Apolobamba_Formularis_Operatius.pdf'); print('dossiers/Apolobamba_Formularis_Operatius.pdf')


if __name__ == '__main__':
    sys.exit(main())
