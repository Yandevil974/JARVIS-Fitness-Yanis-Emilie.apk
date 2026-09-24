#!/usr/bin/env python3
"""Decoupe une planche 2 cases (photo) en GIF de 2 images, cadrage verrouille.

Une planche = une seule generation : les deux positions sortent du MEME rendu,
donc meme athlete, meme salle, meme lumiere. Pour que l'enchainement soit fluide,
les deux cases sont recalees l'une sur l'autre par correlation du decor (le fond
est identique) puis la MEME fenetre est decoupee dans les deux.

    python3 evolution/media/tools/refonte-sheet.py --athlete homme \
        --out evolution/media/refonte-photo/gif planche1.png planche2.png ...

--sheet evolution/media/refonte-photo/review/NOM.jpg : planche de controle.
"""
import argparse
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw

HAUTEUR = 440
DUREE = 500
LARGEUR_MAX = 900


def deux_cases(planche):
    """Separe la planche 16:9 en deux cases egales, en cherchant le filet clair."""
    gris = np.asarray(planche.convert('L'), dtype=np.float32)
    hauteur, largeur = gris.shape
    centre = largeur // 2
    # filet de separation : colonnes claires et peu contrastees, proches du centre
    bande = gris[:, max(0, centre - 60):centre + 60]
    clarte = bande.mean(axis=0)
    ecart = bande.std(axis=0)
    score = clarte - ecart
    colonne = centre - 60 + int(np.argmax(score))
    if clarte.max() < 150:            # pas de filet net : coupe au centre
        colonne = centre
    gauche = planche.crop((0, 0, colonne - 3, hauteur))
    droite = planche.crop((colonne + 3, 0, largeur, hauteur))
    return gauche, droite


def recaler(gauche, droite, portee=90, pas=2):
    """Decale la case de droite sur la case de gauche (correlation du decor)."""
    gauche_gris = np.asarray(gauche.convert('L').resize((gauche.width // 4, gauche.height // 4)),
                             dtype=np.float32)
    droite_gris = np.asarray(droite.convert('L').resize((droite.width // 4, droite.height // 4)),
                             dtype=np.float32)
    hauteur = min(gauche_gris.shape[0], droite_gris.shape[0])
    largeur = min(gauche_gris.shape[1], droite_gris.shape[1])
    # on compare la partie basse (sol) et haute (mur) : le decor, pas l'athlete
    lignes = list(range(0, hauteur // 3)) + list(range(2 * hauteur // 3, hauteur))
    meilleur, meilleur_score = (0, 0), -1e18
    for dy in range(-portee // 4, portee // 4 + 1, pas):
        for dx in range(-portee // 4, portee // 4 + 1, pas):
            aa, bb = [], []
            for y in lignes:
                y2 = y + dy
                if y2 < 0 or y2 >= hauteur:
                    continue
                x1, x2 = max(0, dx), min(largeur, largeur + dx)
                aa.append(gauche_gris[y, x1:x2])
                bb.append(droite_gris[y2, 0:x2 - x1])
            if not aa:
                continue
            a = np.concatenate(aa)
            b = np.concatenate(bb)
            if a.size < 100:
                continue
            score = -np.abs(a - b).mean()
            if score > meilleur_score:
                meilleur_score, meilleur = score, (dx * 4, dy * 4)
    return meilleur


def cadre(images, largeur_max=LARGEUR_MAX):
    """Meme echelle et meme cadrage pour les deux images, sans rien couper."""
    largeur = min(i.width for i in images)
    hauteur = min(i.height for i in images)
    images = [i.crop((0, 0, largeur, hauteur)) for i in images]
    sorties = []
    for image in images:
        echelle = HAUTEUR / image.height
        taille = (min(largeur_max, round(image.width * echelle)), HAUTEUR)
        sorties.append(image.resize(taille, Image.LANCZOS))
    largeur_finale = min(i.width for i in sorties)
    return [i.crop(((i.width - largeur_finale) // 2, 0,
                    (i.width - largeur_finale) // 2 + largeur_finale, i.height)) for i in sorties]


def enregistrer(cible, images):
    cible.parent.mkdir(parents=True, exist_ok=True)
    images[0].save(cible, save_all=True, append_images=images[1:], duration=DUREE, loop=0,
                   optimize=True, disposal=2)


def main(argv):
    analyseur = argparse.ArgumentParser(description=__doc__,
                                        formatter_class=argparse.RawDescriptionHelpFormatter)
    analyseur.add_argument('planches', nargs='+', type=pathlib.Path)
    analyseur.add_argument('--out', required=True, type=pathlib.Path)
    analyseur.add_argument('--athlete', default='homme', choices=['homme', 'femme'])
    analyseur.add_argument('--sheet', type=pathlib.Path, help='planche de controle de ce lot (JPG)')
    args = analyseur.parse_args(argv)

    controles, faits = [], []
    for source in args.planches:
        planche = Image.open(source).convert('RGB')
        gauche, droite = deux_cases(planche)
        dx, dy = recaler(gauche, droite)
        # On applique le decalage trouve pour que le decor des deux cases coincide.
        if dx or dy:
            droite = droite.crop((max(0, -dx), max(0, -dy), droite.width - max(0, dx),
                                  droite.height - max(0, dy)))
            gauche = gauche.crop((max(0, dx), max(0, dy), gauche.width - max(0, -dx),
                                  gauche.height - max(0, -dy)))
        images = cadre([gauche, droite])
        nom = source.stem + '-' + args.athlete + '.gif'
        cible = args.out / nom
        enregistrer(cible, images)
        faits.append((cible, images[0].size, (dx, dy)))
        controles.append((source.stem, *images))
        print('%-60s %s  decalage %s' % (cible, images[0].size, (dx, dy)))
    if args.sheet and controles:
        marge, entete = 10, 24
        largeur = sum(i.width for _, a, b in controles[:1] for i in (a, b)) + 3 * marge
        hauteur = len(controles) * (HAUTEUR + entete + marge) + marge
        largeur = max(largeur, max(a.width + b.width + 3 * marge for _, a, b in controles))
        tuile = Image.new('RGB', (largeur, hauteur), 'white')
        dessin = ImageDraw.Draw(tuile)
        y = marge
        for titre, a, b in controles:
            dessin.text((marge, y + 5), titre, fill=(15, 15, 15))
            y += entete
            tuile.paste(a, (marge, y))
            tuile.paste(b, (marge * 2 + a.width, y))
            y += HAUTEUR + marge
        args.sheet.parent.mkdir(parents=True, exist_ok=True)
        tuile.save(args.sheet, quality=90)
        print('planche de controle : %s %s' % (args.sheet, tuile.size))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
