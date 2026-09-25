#!/usr/bin/env python3
"""Regenere l'index visuel numerote de tous les GIF valides.

    python3 evolution/media/tools/index-general.py

Une vignette = premiere case du GIF livre, numerotee dans l'ordre
(surface, nom) : c'est la piece montree dans le chat a chaque lot.
"""
import json
import pathlib
import sys

from PIL import Image, ImageDraw

RACINE = pathlib.Path(__file__).resolve().parents[1] / 'refonte-photo'
HAUTEUR_VIGNETTE = 150
COLONNES = 10


def main():
    etat = json.load(open(RACINE / 'production' / 'etat.json'))
    plan = json.load(open(RACINE / 'production' / 'plan.json'))
    mvt = {m['identifiant']: m for m in plan['mouvements']}
    cles = sorted(etat['valides'],
                  key=lambda c: (mvt[c.split('|')[0]]['surface'], mvt[c.split('|')[0]]['noms'][0]))
    vignettes = []
    for numero, cle in enumerate(cles, 1):
        ident, athlete = cle.split('|')
        p = RACINE / 'gif' / athlete / f'{ident}-{athlete}.gif'
        if not p.exists():
            p = RACINE / 'gif' / f'{ident}-{athlete}.gif'
        im = Image.open(p)
        im.seek(0)
        im = im.convert('RGB')
        echelle = HAUTEUR_VIGNETTE / im.height
        vignettes.append((numero, cle, im.resize((round(im.width * echelle), HAUTEUR_VIGNETTE))))
    largeur = max(v.width for _, _, v in vignettes)
    lignes = (len(vignettes) + COLONNES - 1) // COLONNES
    marge, entete = 8, 18
    tuile = Image.new('RGB', (COLONNES * (largeur + marge) + marge,
                              lignes * (HAUTEUR_VIGNETTE + entete + marge) + marge), 'white')
    dessin = ImageDraw.Draw(tuile)
    for i, (numero, cle, v) in enumerate(vignettes):
        x = marge + (i % COLONNES) * (largeur + marge)
        y = marge + (i // COLONNES) * (HAUTEUR_VIGNETTE + entete + marge)
        dessin.text((x, y + 3), '%d  %s' % (numero, cle), fill=(10, 10, 10))
        tuile.paste(v, (x, y + entete))
    cible = RACINE / 'review' / 'index-general.jpg'
    tuile.save(cible, quality=88)
    print('%s  %s  (%d vignettes)' % (cible, tuile.size, len(vignettes)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
