#!/usr/bin/env python3
"""Before/after sheet of representative media corrections (first GIF frame each).
PYTHONPATH=.cache/image-tools python3 evolution/media/review/contact-sheet.py  (needs .cache/media-web from build.mjs)"""
from PIL import Image, ImageDraw, ImageFont
import json, pathlib
root = pathlib.Path(__file__).resolve().parents[3]
web = root / '.cache/media-web'
m = json.loads((root / 'evolution/media/mapping.json').read_text())

def load(p, size=210):
    if not p:
        return None
    im = Image.open(web / p.lstrip('/')); im.seek(0); im = im.convert('RGB'); im.thumbnail((size, size))
    bg = Image.new('RGB', (size, size), 'white'); bg.paste(im, ((size - im.width) // 2, (size - im.height) // 2)); return bg

try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
    bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
except Exception:
    font = bold = small = ImageFont.load_default()

ex = m['exercises']
rows = []
for id_, why in [
    ('hip-thrust-unilateral', "avant : Bulgarian split squat (autre mouvement) ; après : hip thrust barre, annoté « ici une seule jambe »"),
    ('french-press-barre-ez', "avant : extension à la poulie debout (autre matériel, autre position) ; après : extension couchée barre EZ"),
    ('tractions-pull-up', "avant : image de secours (clé « pull-up » perdue par la normalisation) ; après : traction pronation"),
    ('tractions-supination-chin-up', "avant : même image de secours pour toutes les tractions ; après : traction supination"),
    ('step-up-sur-banc-hauteur-du-genou', "avant : step-up haut ; après : step-up hauteur du genou"),
    ('pont-fessier-au-sol-activation', "avant : hip thrust barre sur banc ; après : pont au sol"),
    ('triceps-dips', "avant : image haute en miroir (tête/buste inversés) ; après : image haute redessinée, même style"),
    ('face-pull-a-la-poulie', "avant : tirage vertical derrière la nuque ; aucun face pull disponible → absence explicite"),
    ('clamshell-a-l-elastique', "avant (1.4.0) : abduction assise à la machine (guide source : bird dog) ; aucun clamshell disponible → absence explicite"),
    ('leg-extension', "avant : autre machine ; aucune extension de genoux disponible → absence explicite"),
]:
    e = ex[id_]; rows.append((e['name'], e['previous'], e['media'], e['level'], why))
for t in ['Ciseaux au bord', 'Talons-fesses', 'Gainage au bord (vertical)', 'Mobilité hanches / chevilles']:
    o = m['poolGuides'][t]; rows.append(('Piscine · ' + t, o.get('previous'), o['media'], o['level'], o.get('note') or 'avant : GIF de musculation au sol ; après : illustration aquatique'))
st = m['stretches']['stretch-fes-0']; rows.append(('Étirement · Pigeon assis', st.get('previous'), st['media'], st['level'], 'avant : pigeon au sol ; après : posture assise (cheville sur le genou)'))
wu = m['warmup']['Activation fessiers']; rows.append(('Échauffement · Activation fessiers', wu.get('previous'), wu['media'], wu['level'], 'avant : photo de cercles de bras ; après : ponts fessiers au sol'))

W = 980; rowh = 250; H = 70 + rowh * len(rows)
sheet = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(sheet)
d.text((20, 14), "Yanis Fitness Evolution 1.5.0 — visuels d'exercice : avant (1.4.0) / après (revue)", font=bold, fill='black')
d.text((20, 40), "« exact » : même mouvement, matériel, position · « variante » : un détail diffère, expliqué dans l'app · « none » : carte « Pas de démonstration », aucun autre mouvement affiché.", font=small, fill=(80, 80, 80))
d.text((330, 58), "AVANT", font=bold, fill=(160, 40, 40)); d.text((600, 58), "APRÈS", font=bold, fill=(30, 120, 60))
for i, (name, prev, new, level, why) in enumerate(rows):
    y = 70 + i * rowh
    d.line((20, y, W - 20, y), fill=(220, 220, 220))
    d.text((20, y + 12), name[:34], font=bold, fill='black')
    lines, cur = [], ''
    for w in why.split():
        if d.textlength(cur + ' ' + w, font=small) > 280: lines.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    lines.append(cur)
    for j, l in enumerate(lines[:8]): d.text((20, y + 40 + j * 16), l, font=small, fill=(70, 70, 70))
    d.text((20, y + rowh - 40), 'état : ' + level, font=font, fill=(30, 120, 60) if level == 'exact' else (200, 120, 0) if level == 'variante' else (160, 40, 40))
    a = load(prev); b = load(new)
    if a: sheet.paste(a, (320, y + 15)); d.rectangle((320, y + 15, 530, y + 225), outline=(200, 120, 120), width=2)
    else: d.rectangle((320, y + 15, 530, y + 225), outline=(200, 200, 200)); d.text((340, y + 110), "(aucune)", font=font, fill=(120, 120, 120))
    if b: sheet.paste(b, (590, y + 15)); d.rectangle((590, y + 15, 800, y + 225), outline=(120, 180, 120), width=2)
    else:
        d.rectangle((590, y + 15, 800, y + 225), outline=(120, 120, 120), width=2, fill=(245, 245, 245))
        d.text((610, y + 95), "Pas de démonstration", font=font, fill=(60, 60, 60)); d.text((610, y + 118), "pour ce mouvement", font=font, fill=(60, 60, 60)); d.text((610, y + 150), "(consigne écrite conservée)", font=small, fill=(100, 100, 100))
    if prev: d.text((320, y + 228), prev.split('/')[-1][:24], font=small, fill=(120, 120, 120))
    if new: d.text((590, y + 228), new.split('/')[-1][:24], font=small, fill=(120, 120, 120))
out = root / 'evolution/media/review/corrections-apercu.jpg'; sheet.save(out, quality=88); print(out, sheet.size)
