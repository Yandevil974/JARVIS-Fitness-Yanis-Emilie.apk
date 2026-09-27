"""Assemblage proposition85 (lot68) — isolé sous propositions/, aucun écrit livré.

Sources : phases/85-depart-2.png (DÉBUT, bras le long du corps, paumes vers le corps)
+ phases/85-fin-4.png (FIN, coudes 90°, avant-bras horizontaux à hauteur des coudes).
Chaîne : fin construite avec guide 85-guide-plan-horizontal.png (3 éditions guidées),
départ édité depuis la fin. Sorties : planches/elevations-laterales-coude-a-90.png,
gif/homme/elevations-laterales-coude-a-90-homme.gif (788x440, 2x500 ms),
review/lot68-proposition-85.jpg, mesures.json.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import json
import hashlib

H = Path(__file__).resolve().parent
R = H.parents[1]

frames = [Image.open(H / 'phases' / p).convert('RGB')
          for p in ['85-depart-2.png', '85-fin-4.png']]
assert frames[0].size == frames[1].size == (1376, 768), [f.size for f in frames]

font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 24)
full = Image.new('RGB', (2752, 810), 'white')
d = ImageDraw.Draw(full)
for i, f in enumerate(frames):
    full.paste(f, (1376 * i, 42))
    d.text((1376 * i + 12, 8), 'DÉBUT' if i == 0 else 'FIN', font=font, fill='black')
full.save(H / 'planches' / 'elevations-laterales-coude-a-90.png')

scaled = [f.resize((788, 440), Image.Resampling.LANCZOS) for f in frames]
g = H / 'gif' / 'homme' / 'elevations-laterales-coude-a-90-homme.gif'
scaled[0].save(g, save_all=True, append_images=scaled[1:], duration=500, loop=0, disposal=2)

r = Image.new('RGB', (1606, 482), 'white')
d = ImageDraw.Draw(r)
d.text((10, 7), 'N°85 - Élévations latérales coude à 90° - PROPOSITION NON VALIDÉE (lot68)', font=font, fill='black')
for i, f in enumerate(scaled):
    r.paste(f, (10 + 798 * i, 42))
r.save(R / 'review' / 'lot68-proposition-85.jpg', quality=95)

# ROI DELTOÏDES (corps) commune aux deux cases, 788x440 ; plantes du décor hors ROI (x<150).
ROI = [320, 85, 480, 145]
counts = []
with Image.open(g) as im:
    for i in range(im.n_frames):
        im.seek(i)
        a = np.asarray(im.convert('RGB'), dtype=int)[ROI[1]:ROI[3], ROI[0]:ROI[2]]
        red, green, blue = a[:, :, 0], a[:, :, 1], a[:, :, 2]
        counts.append(int(((green > 120) & (green > red + 15) & (green > blue + 60)).sum()))

sha = hashlib.sha256(g.read_bytes()).hexdigest()
mesures = {
    'numero': 85,
    'identifiant': 'elevations-laterales-coude-a-90|homme',
    'size': [788, 440],
    'frames': 2,
    'duration_ms': 500,
    'roi_deltoide': ROI,
    'strict_lime': counts,
    'sources': ['phases/85-depart-2.png', 'phases/85-fin-4.png'],
    'guide': 'guides/85-guide-plan-horizontal.png (position haute, 3 éditions guidées depuis 85-fin.png)',
    'strategie': 'position haute construite avec guide 3D du plan coude/poignet, départ édité depuis la haute',
    'generations_lot68_numero85': 7,
    'reserves': [
        'léger débord du vert vers le haut du bras (deltoïde antérieur) à apprécier',
        'paume de départ vers le corps lisible mais prise petite à cette échelle',
        'écarture des coudes à apprécier par l utilisateur',
    ],
    'validation_utilisateur': False,
}
(H / 'mesures.json').write_text(json.dumps(mesures, indent=2, ensure_ascii=False))
print('strict_lime:', counts, 'sha256:', sha)
