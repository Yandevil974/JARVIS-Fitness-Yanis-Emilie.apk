#!/usr/bin/env python3
"""PDF de revue des 331 exercices refondus : numero + nom + les 2 frames animees cote a cote.

Regroupes par surface, ordre alphabetique d'identifiant puis athlete.
Sortie : evolution/media/refonte-photo/livraison/REVUE-331-exercices.pdf
Usage : .cache/pyvenv/bin/python evolution/media/tools/pdf-revue-331.py
"""
import json, pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[3]
EV = ROOT / 'evolution'
LIV = EV / 'media/refonte-photo/livraison'
FONT_DIR = pathlib.Path('/usr/share/fonts/truetype/dejavu')
F_TITLE = ImageFont.truetype(str(FONT_DIR / 'DejaVuSans-Bold.ttf'), 30)
F_SUB = ImageFont.truetype(str(FONT_DIR / 'DejaVuSans.ttf'), 22)
F_FOOT = ImageFont.truetype(str(FONT_DIR / 'DejaVuSans.ttf'), 20)
F_HDR = ImageFont.truetype(str(FONT_DIR / 'DejaVuSans-Bold.ttf'), 44)

PAGE = (1240, 1754)  # A4 @150 dpi
PER_PAGE = 3
SURFACES = ['musculation', 'tabata-sol', 'piscine', 'piscine-protocoles', 'aqua-tabata',
            'etirements', 'elliptique', 'echauffement']
SURF_LABEL = {'musculation': 'MUSCULATION', 'tabata-sol': 'TABATA AU SOL', 'piscine': 'PISCINE (guides)',
              'piscine-protocoles': 'PISCINE (protocoles)', 'aqua-tabata': 'AQUA TABATA',
              'etirements': 'ETIREMENTS', 'elliptique': 'VELO / ELLIPTIQUE', 'echauffement': 'ECHAUFFEMENT'}

def frames(path):
    im = Image.open(path)
    out = []
    n = getattr(im, 'n_frames', 1)
    for i in range(min(n, 2)):
        im.seek(i)
        out.append(im.convert('RGB'))
    while len(out) < 2:
        out.append(out[-1])
    return out

def fit(im, box):
    im = im.copy()
    im.thumbnail(box, Image.LANCZOS)
    return im

def main():
    man = json.load(open(LIV / 'manifeste-331.json'))
    # Numerotation FIGEE (livraison/numerotation-pdf.json) : un numero ne change jamais ;
    # les couples ajoutes apres coup recoivent les numeros suivants (valide-couples.py).
    numeros = json.load(open(LIV / 'numerotation-pdf.json'))['numeros']
    sans = [e['cle'] for e in man['entrees'] if e['cle'] not in numeros]
    assert not sans, 'couples sans numero PDF (lancer valide-couples.py) : %s' % sans
    entrees = sorted(man['entrees'], key=lambda e: numeros[e['cle']])
    pages = []
    draw = None
    # page de titre
    pg = Image.new('RGB', PAGE, 'white')
    d = ImageDraw.Draw(pg)
    d.text((60, 70), f'JARVIS Fitness — Revue des {len(entrees)} exercices', font=F_HDR, fill='black')
    d.text((60, 150), 'Chaque exercice : numero + nom + les 2 images animees (frame 1 et frame 2)', font=F_SUB, fill='#333333')
    d.text((60, 190), 'Signalez simplement le NUMERO en cas de coquille. Les numeros sont figes : 1-331 inchanges, nouveaux couples a la suite.', font=F_SUB, fill='#333333')
    y = 260
    from collections import Counter
    c = Counter(e['surface'] for e in entrees)
    for s in SURFACES:
        d.text((60, y), f'{SURF_LABEL.get(s, s)} : {c.get(s, 0)}', font=F_SUB, fill='black')
        y += 40
    autres = {k: v for k, v in c.items() if k not in SURFACES}
    for k, v in autres.items():
        d.text((60, y), f'{k} : {v}', font=F_SUB, fill='black')
        y += 40
    d.text((60, y + 20), f'Total : {len(entrees)} — branche arena/01a0dcad', font=F_SUB, fill='#555555')
    pages.append(pg)

    num = 0
    buf = []
    cur_surface = None
    for e in entrees:
        num = numeros[e['cle']]
        nom = e['noms'][0] if e['noms'] else e['identifiant']
        f1, f2 = frames(EV / e['gif'])
        buf.append((num, e, nom, f1, f2))
    # composition des pages
    idx = 0
    page_no = 1
    total_pages = 1 + (len(buf) + PER_PAGE - 1) // PER_PAGE
    while idx < len(buf):
        pg = Image.new('RGB', PAGE, 'white')
        d = ImageDraw.Draw(pg)
        slot_h = (PAGE[1] - 120) // PER_PAGE
        for s in range(PER_PAGE):
            if idx >= len(buf):
                break
            num, e, nom, f1, f2 = buf[idx]
            idx += 1
            y0 = 40 + s * slot_h
            if e['surface'] != cur_surface:
                cur_surface = e['surface']
            # entete exercice
            titre = f'{num}. {nom} — {e["athlete"]}'
            d.text((60, y0), titre, font=F_TITLE, fill='black')
            d.text((60, y0 + 44), f'{SURF_LABEL.get(e["surface"], e["surface"])} · {e["identifiant"]}',
                   font=F_SUB, fill='#666666')
            # frames
            im1 = fit(f1, (480, slot_h - 145))
            im2 = fit(f2, (480, slot_h - 145))
            gap = 40
            tot = im1.width + im2.width + gap
            x = (PAGE[0] - tot) // 2
            y = y0 + 104
            d.text((x, y - 26), 'frame 1', font=F_FOOT, fill='#999999')
            d.text((x + im1.width + gap, y - 26), 'frame 2', font=F_FOOT, fill='#999999')
            pg.paste(im1, (x, y))
            pg.paste(im2, (x + im1.width + gap, y))
            d.rectangle([x - 2, y - 2, x + im1.width + 2, y + im1.height + 2], outline='#cccccc')
            d.rectangle([x + im1.width + gap - 2, y - 2, x + im1.width + gap + im2.width + 2, y + im2.height + 2], outline='#cccccc')
        page_no += 1
        d.text((60, PAGE[1] - 50), f'JARVIS Fitness — revue 331 — page {page_no}/{total_pages}', font=F_FOOT, fill='#999999')
        pages.append(pg)
    out = LIV / 'REVUE-331-exercices.pdf'
    pages[0].save(out, save_all=True, append_images=pages[1:], resolution=150.0)
    print('ecrit', out, out.stat().st_size, 'octets,', len(pages), 'pages,', num, 'exercices')

if __name__ == '__main__':
    main()
