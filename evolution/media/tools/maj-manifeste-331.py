#!/usr/bin/env python3
"""Rafraichit livraison/manifeste-331.json et candidate/refonte-331-map.json depuis les GIF livres.

Pour chaque entree : SHA-256, nombre de frames et taille RE-MESURES sur le GIF ;
la planche source est retrouvee par correspondance d'image (la case gauche du GIF est
comparee a la moitie gauche de chaque planche candidate portant l'identifiant, le lot le
plus recent d'abord) — jamais devinee par le nom seul.

    .cache/pyvenv/bin/python evolution/media/tools/maj-manifeste-331.py [--planches lot50 ...]

Sans --planches : toutes les planches lotNN/<ident>.png (et lotNN/{homme,femme}/<ident>.png)
sont candidates. Le script n'ajoute ni ne retire aucune cle : 331 entrees en entree,
331 en sortie ; il imprime ce qui a change.
"""
import argparse
import hashlib
import json
import pathlib
import re

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[3]
EV = ROOT / 'evolution'
R = EV / 'media/refonte-photo'
LIV = R / 'livraison'
CAND = EV / 'media/candidate'


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def frame0(gif):
    im = Image.open(gif)
    im.seek(0)
    return im.convert('L')


def lot_num(p):
    m = re.search(r'lot(\d+)', str(p))
    return int(m.group(1)) if m else -1


def ecart(gif_l, planche):
    """Ecart moyen (0-255) entre la case gauche du GIF et la moitie gauche de la planche."""
    im = Image.open(planche).convert('L')
    w, h = im.size
    gauche = im.crop((0, 0, w // 2 - 3, h))
    # meme hauteur, largeur centree comme dans refonte-sheet.cadre
    e = gif_l.height / gauche.height
    gauche = gauche.resize((max(1, round(gauche.width * e)), gif_l.height), Image.LANCZOS)
    if gauche.width < gif_l.width:
        return 999.0
    x0 = (gauche.width - gif_l.width) // 2
    a = np.asarray(gauche.crop((x0, 0, x0 + gif_l.width, gif_l.height)).resize((64, 72)), dtype=float)
    b = np.asarray(gif_l.resize((64, 72)), dtype=float)
    return float(np.abs(a - b).mean())


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--planches', nargs='*', help='lots a considerer (ex. lot50) ; defaut : tous')
    ap.add_argument('--seuil', type=float, default=14.0, help='ecart max pour reconnaitre la planche source')
    args = ap.parse_args()
    man = json.load(open(LIV / 'manifeste-331.json'))
    lots = sorted((R / 'planches').glob('lot*'), key=lot_num, reverse=True)
    if args.planches:
        lots = [l for l in lots if l.name in set(args.planches)]
    changes = []
    for e in man['entrees']:
        gif = EV / e['gif']
        if not gif.exists():
            raise SystemExit('GIF manquant : %s' % gif)
        im = Image.open(gif)
        nouveau = {'gif_sha256': sha(gif), 'gif_frames': getattr(im, 'n_frames', 1), 'gif_size': list(im.size)}
        g0 = frame0(gif)
        meilleure, meilleur_ecart = None, None
        for lot in lots:
            for cand in (lot / ('%s.png' % e['identifiant']), lot / e['athlete'] / ('%s.png' % e['identifiant'])):
                if cand.exists():
                    d = ecart(g0, cand)
                    if meilleur_ecart is None or d < meilleur_ecart:
                        meilleure, meilleur_ecart = cand, d
            if meilleure is not None and meilleur_ecart <= args.seuil and lot_num(meilleure) == lot_num(lot):
                break  # lot le plus recent reconnu : inutile de descendre
        if meilleure is not None and meilleur_ecart <= args.seuil:
            nouveau['planche'] = str(meilleure.relative_to(R))
        else:
            nouveau['planche'] = e.get('planche')
        diff = {k: (e.get(k), v) for k, v in nouveau.items() if e.get(k) != v}
        if diff:
            changes.append((e['cle'], diff, meilleur_ecart))
            e.update(nouveau)
    man['total'] = len(man['entrees'])
    json.dump(man, open(LIV / 'manifeste-331.json', 'w'), ensure_ascii=False, indent=1)
    # map candidate : cle -> gif + sha
    mp = json.load(open(CAND / 'refonte-331-map.json'))
    n_map = 0
    for e in man['entrees']:
        ent = mp['entrees'].get(e['cle'])
        if ent is None:
            mp['entrees'][e['cle']] = {'gif': e['gif'], 'sha256': e['gif_sha256'], 'surface': e['surface']}
            n_map += 1
        elif ent.get('sha256') != e['gif_sha256'] or ent.get('gif') != e['gif']:
            ent['sha256'] = e['gif_sha256']
            ent['gif'] = e['gif']
            n_map += 1
    json.dump(mp, open(CAND / 'refonte-331-map.json', 'w'), ensure_ascii=False, indent=1)
    for cle, diff, d in changes:
        print('%-55s ecart=%s %s' % (cle, None if d is None else round(d, 1), json.dumps(diff, ensure_ascii=False)))
    print('entrees : %d ; modifiees : %d ; map candidate mise a jour : %d' % (len(man['entrees']), len(changes), n_map))


if __name__ == '__main__':
    main()
