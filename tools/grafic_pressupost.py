#!/usr/bin/env python3
"""Gràfic de distribució del cost d'una sortida amb el grup mínim (treball, cap. 5, i presentació).

Executa-ho des de l'arrel:  python3 tools/grafic_pressupost.py [sortida.png ...]
Per defecte escriu assets/pres-pressupost.png. Fórmula del cap. 5.1:
cost = (10.447,50 + 653,75 × n + suport) × 1,10, amb suport = 1.953,75 € a partir de 10 clients.
"""
import os, sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = 8  # grup mínim
for f in ('Inter-Regular.otf', 'Inter-Medium.otf'):
    p = '/usr/share/fonts/opentype/inter/' + f
    if os.path.exists(p):
        font_manager.fontManager.addfont(p)
plt.rcParams['font.family'] = 'Inter'

items = [
    ('Guia principal i guia local', 2340 + 1300),
    ('Àpats i allotjament dels clients', N * (260 + 243.75)),
    ('Assegurances, RC i garantia', 300 + 200 + 300 + N * 150),
    ('Viatge internacional del guia', 1200),
    ('Transport local', 1200),
    ('Mules i suport logístic', 1200),
    ('Permisos, material i administració', 400 + 400 + 400),
    ('Manutenció i pernocta dels guies', 1007.5),
    ('Comissions i canvi', 200),
]
base = sum(v for _, v in items)
items.insert(3, ('Contingència (10%)', base * 0.10))
total = base * 1.10
items.sort(key=lambda kv: kv[1])
fmt = lambda v: f'{round(v):,}'.replace(',', '.')

fig, ax = plt.subplots(figsize=(13, 6.07), dpi=100)
names = [k for k, _ in items]; vals = [v for _, v in items]
ax.barh(names, vals, color='#163e33', height=0.62)
for i, v in enumerate(vals):
    ax.text(v + 40, i, f'{fmt(v)} € · {round(100 * v / total)}%', va='center', fontsize=11, color='#1c2b26')
ax.set_xlabel(f'Euros per sortida amb {N} clients (total {fmt(total)} €)'.replace(f'{fmt(total)}', f'{total:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')), fontsize=12)
ax.tick_params(axis='y', labelsize=12, length=0); ax.tick_params(axis='x', labelsize=11)
for s in ('top', 'right', 'left'):
    ax.spines[s].set_visible(False)
ax.set_xlim(0, max(vals) * 1.28)
fig.tight_layout()
outs = sys.argv[1:] or [os.path.join(ROOT, 'assets', 'pres-pressupost.png')]
for o in outs:
    fig.savefig(o, dpi=100 if 'pres-' in o else 138, facecolor='white')
    print(o)
print('total', total)
