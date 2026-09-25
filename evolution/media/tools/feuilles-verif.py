#!/usr/bin/env python3
"""Feuilles de relecture humaine : les DEUX cases de chaque GIF, en pleine definition.

Une feuille = 3 mouvements (6 cases), aucune reduction : c'est l'outil de lecture
impose par la regle « jamais d'acceptation a l'oeil sur une vignette ».

    python3 evolution/media/tools/feuilles-verif.py --cles "a|homme,b|femme" \
        --out evolution/media/refonte-photo/review/verif-01.jpg
    python3 evolution/media/tools/feuilles-verif.py --toutes --par 3 \
        --prefix evolution/media/refonte-photo/review/verif
"""
import argparse
import pathlib
import sys

from PIL import Image, ImageDraw

RACINE = pathlib.Path(__file__).resolve().parents[1] / 'refonte-photo'
GIF = RACINE / 'gif'


def chemin(cle):
    identifiant, athlete = cle.split('|')
    for candidat in (GIF / athlete / f'{identifiant}-{athlete}.gif',
                     GIF / f'{identifiant}-{athlete}.gif'):
        if candidat.exists():
            return candidat
    return None


def feuille(cles, sortie, par=3):
    sortie = pathlib.Path(sortie)
    faites = []
    for debut in range(0, len(cles), par):
        groupe = cles[debut:debut + par]
        lignes = []
        for cle in groupe:
            p = chemin(cle)
            if p is None:
                lignes.append((cle, None))
                continue
            im = Image.open(p)
            frames = []
            for i in range(getattr(im, 'n_frames', 1)):
                im.seek(i)
                frames.append(im.convert('RGB'))
            lignes.append((cle, frames))
        hauteur_case = max((f.height for _, fr in lignes if fr for f in fr), default=440)
        largeur_case = max((f.width for _, fr in lignes if fr for f in fr), default=400)
        marge, entete = 24, 30
        largeur = 2 * largeur_case + 3 * marge
        hauteur = len(lignes) * (hauteur_case + entete + marge) + marge
        cible = sortie if len(cles) <= par else sortie.with_name(
            '%s-%02d%s' % (sortie.stem, debut // par + 1, sortie.suffix))
        tuile = Image.new('RGB', (largeur, hauteur), 'white')
        dessin = ImageDraw.Draw(tuile)
        y = marge
        for cle, frames in lignes:
            dessin.text((marge, y + 6), cle, fill=(10, 10, 10))
            y += entete
            if frames:
                tuile.paste(frames[0], (marge, y))
                if len(frames) > 1:
                    tuile.paste(frames[1], (2 * marge + largeur_case, y))
                dessin.line((marge + largeur_case + marge // 2, y,
                             marge + largeur_case + marge // 2, y + hauteur_case),
                            fill=(210, 210, 210), width=2)
            y += hauteur_case + marge
        cible.parent.mkdir(parents=True, exist_ok=True)
        tuile.save(cible, quality=92)
        faites.append((str(cible), tuile.size, [c for c, _ in lignes]))
        print('%s  %s  %s' % (cible, tuile.size, ', '.join(c for c, _ in lignes)))
    return faites


def main(argv):
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument('--cles', help='liste "ident|athlete,ident|athlete"')
    a.add_argument('--toutes', action='store_true', help='tous les GIF livres')
    a.add_argument('--par', type=int, default=3)
    a.add_argument('--out', type=pathlib.Path)
    a.add_argument('--prefix', type=pathlib.Path)
    args = a.parse_args(argv)
    if args.toutes:
        cles = []
        for athlete in ('homme', 'femme'):
            for p in sorted((GIF / athlete).glob('*.gif')):
                cles.append('%s|%s' % (p.stem[:-len(athlete) - 1], athlete))
        feuille(cles, args.prefix or (RACINE / 'review' / 'verif'), args.par)
        return 0
    cles = [c for c in args.cles.split(',') if c.strip()]
    feuille(cles, args.out or (RACINE / 'review' / 'verif.jpg'), args.par)
    return 0


if __name__ == '__main__':
    sys.exit(main(argv=None) if False else main(sys.argv[1:]))
