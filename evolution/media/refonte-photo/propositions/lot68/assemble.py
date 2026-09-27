"""Assemblage proposition26 (lot68) — isolé sous propositions/, aucun écrit livré.

Sources : phases/crunch-depart-2.png (DÉBUT) + phases/crunch-fin-5.png (FIN),
issues de la stratégie BRIEF-REPRISE.md (arrivée construite d'abord, départ édité).
Sorties : planches/crunch-a-la-poulie.png, gif/homme/crunch-a-la-poulie-homme.gif
(788x440, 2x500 ms), review/lot68-proposition-26.jpg, mesures.json.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import json
import hashlib

H = Path(__file__).resolve().parent
R = H.parents[1]

frames = [Image.open(H / 'phases' / p).convert('RGB')
          for p in ['crunch-depart-2.png', 'crunch-fin-5.png']]
assert frames[0].size == frames[1].size == (1376, 768), [f.size for f in frames]

(H / 'planches').mkdir(exist_ok=True)
(H / 'gif' / 'homme').mkdir(parents=True, exist_ok=True)

font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 24)
full = Image.new('RGB', (2752, 810), 'white')
d = ImageDraw.Draw(full)
for i, f in enumerate(frames):
    full.paste(f, (1376 * i, 42))
    d.text((1376 * i + 12, 8), 'DÉBUT' if i == 0 else 'FIN', font=font, fill='black')
full.save(H / 'planches' / 'crunch-a-la-poulie.png')

scaled = [f.resize((788, 440), Image.Resampling.LANCZOS) for f in frames]
g = H / 'gif' / 'homme' / 'crunch-a-la-poulie-homme.gif'
scaled[0].save(g, save_all=True, append_images=scaled[1:], duration=500, loop=0, disposal=2)

r = Image.new('RGB', (1606, 482), 'white')
d = ImageDraw.Draw(r)
d.text((10, 7), 'N°26 - Crunch à la poulie - PROPOSITION NON VALIDÉE (lot68)', font=font, fill='black')
for i, f in enumerate(scaled):
    r.paste(f, (10 + 798 * i, 42))
r.save(R / 'review' / 'lot68-proposition-26.jpg', quality=95)

# Mesure du vert strict sur les ABDOMINAUX (corps), ROI corporelle identique pour les 2 cases.
# Boîte englobante des abdominaux dans le repère 788x440 (athlete centre-gauche).
ROI = [220, 176, 394, 286]
counts = []
with Image.open(g) as im:
    for i in range(im.n_frames):
        im.seek(i)
        a = np.asarray(im.convert('RGB'), dtype=int)[ROI[1]:ROI[3], ROI[0]:ROI[2]]
        red, green, blue = a[:, :, 0], a[:, :, 1], a[:, :, 2]
        counts.append(int(((green > 120) & (green > red + 15) & (green > blue + 60)).sum()))

sha = hashlib.sha256(g.read_bytes()).hexdigest()
mesures = {
    'numero': 26,
    'identifiant': 'crunch-a-la-poulie|homme',
    'size': [788, 440],
    'frames': 2,
    'duration_ms': 500,
    'roi_abdominaux': ROI,
    'strict_lime': counts,
    'sources': ['phases/crunch-depart-2.png', 'phases/crunch-fin-5.png'],
    'strategie': 'brief-reprise : arrivée construite d\'abord (5 essais dont 4 éditions guidées), départ édité depuis l\'arrivée (2 essais)',
    'generations_lot68': 8,
    'validation_utilisateur': False,
}
(H / 'mesures.json').write_text(json.dumps(mesures, indent=2, ensure_ascii=False))
print('strict_lime:', counts, 'sha256:', sha)
