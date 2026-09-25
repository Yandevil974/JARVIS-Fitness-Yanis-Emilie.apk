#!/usr/bin/env python3
"""Planches-contact d'audit realisme : vignettes des planches source (2 cases)
avec identifiant en legende, N par page. Usage :
  audit-sheet.py --cles "id|athlete,..." --par 6 --out verification/audit-01.jpg
ou --liste /tmp/fichier.txt (une cle par ligne)."""
import argparse, pathlib, sys
from PIL import Image, ImageDraw

RACINE = pathlib.Path(__file__).resolve().parents[3]
REFONTE = RACINE / 'evolution' / 'media' / 'refonte-photo'


def trouver_planche(cle):
    ident, ath = cle.split('|')
    cands = sorted((REFONTE / 'planches').glob(f'*/{ident}.png'),
                   key=lambda p: int(p.parent.name.replace('lot', '') or 0))
    if cands:
        return cands[-1], 'planche'
    g = REFONTE / 'gif' / ath / f'{ident}-{ath}.gif'
    if g.exists():
        return g, 'gif'
    return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cles', default='')
    ap.add_argument('--liste', default='')
    ap.add_argument('--par', type=int, default=6)
    ap.add_argument('--larg', type=int, default=420)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    cles = [c.strip() for c in a.cles.split(',') if c.strip()]
    if a.liste:
        cles += [l.strip() for l in pathlib.Path(a.liste).read_text().splitlines() if l.strip()]
    if not cles:
        sys.exit('aucune cle')
    CAP = 22
    pages = [cles[i:i + a.par] for i in range(0, len(cles), a.par)]
    made = []
    for n, page in enumerate(pages, 1):
        imgs = []
        for c in page:
            p, kind = trouver_planche(c)
            if p is None:
                print('MANQUE', c)
                continue
            if kind == 'planche':
                im = Image.open(p).convert('RGB')
            else:
                g = Image.open(p)
                f0 = g.convert('RGB')
                g.seek(1)
                f1 = g.convert('RGB')
                im = Image.new('RGB', (f0.width + 8 + f1.width, f0.height), (200, 200, 200))
                im.paste(f0, (0, 0))
                im.paste(f1, (f0.width + 8, 0))
            h = int(im.height * a.larg / im.width)
            imgs.append((c, im.resize((a.larg, h))))
        colw = a.larg + 12
        rowh = max(im.height for _, im in imgs) + CAP + 8
        cols = 2
        rows = (len(imgs) + 1) // 2
        W = cols * colw + 20
        H = rows * rowh + 16
        canvas = Image.new('RGB', (W, H), (246, 248, 250))
        d = ImageDraw.Draw(canvas)
        for i, (c, im) in enumerate(imgs):
            r, col = divmod(i, cols)
            x = 10 + col * colw
            y = 8 + r * rowh
            d.text((x + 2, y + 2), c, fill=(20, 20, 20))
            canvas.paste(im, (x, y + CAP))
        if not imgs:
            continue
        out = pathlib.Path(a.out)
        if out.suffix:
            out = out.with_name(f'{out.stem}-{n:02d}.jpg')
        else:
            out = pathlib.Path(f'{a.out}-{n:02d}.jpg')
        out.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(out, quality=88)
        made.append((out, [c for c, _ in imgs]))
    for out, cls in made:
        print(out, ' ', ', '.join(cls))


if __name__ == '__main__':
    main()
