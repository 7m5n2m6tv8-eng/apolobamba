#!/usr/bin/env python3
"""QR de l'enquesta del client (Google Forms) en SVG, per a l'app del guia i la pàgina del treball.
Ús: python3 tools/qr_enquesta.py https://forms.gle/XXXX   (només necessita reportlab)"""
import sys, os
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderSVG
url = sys.argv[1]
w = QrCodeWidget(url, barLevel='M'); w.barWidth = w.barHeight = 300
d = Drawing(300, 300); d.add(w)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for p in ('guia/img/enquesta-qr.svg', 'assets/enquesta-qr.svg'):
    renderSVG.drawToFile(d, os.path.join(ROOT, p)); print(p)
