#!/usr/bin/env python3
"""Planche de controle du lot 2 : les dix animations de variantes produites."""
import pathlib
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parents[3]
NOMS = ['face-pull-elastique', 'kickback-elastique', 'leg-extension', 'curl-poulie-basse',
        'elevations-incline-30', 'elevations-incline-45', 'tractions-prise-large',
        'split-squat-poulie', 'ecartes-cables-incline', 'extensions-triceps-pullover']
LEGENDES = {
    'face-pull-elastique': "face-pull-a-l-elastique : bande elastique, tirage vers la face",
    'kickback-elastique': "kickback-a-l-elastique : bande sous le pied, extension du bras",
    'leg-extension': "leg-extension : machine a rouleaux sur les tibias, extension des genoux",
    'curl-poulie-basse': "curl-poulie-basse (+ supination) : poulie basse, paumes vers le haut",
    'elevations-incline-30': "elevations-laterales-incline-30 (face au banc) : banc a 30 degres",
    'elevations-incline-45': "elevations-laterales-incline-45 : banc a 45 degres",
    'tractions-prise-large': "tractions-prise-large : barre fixe, prise large",
    'split-squat-poulie': "split-squat-poulie-basse : fente au sol, poignee de poulie basse",
    'ecartes-cables-incline': "ecartes-cables-incline : banc incline, deux poulies basses",
    'extensions-triceps-pullover': "extensions-triceps-pullover-barre-ez : barre EZ, allonge",
}

largeur, hauteur = 480, 262
marge, bandeau, colonnes = 14, 30, 2
lignes = (len(NOMS) + colonnes - 1) // colonnes
planche = Image.new('RGB', (colonnes * (largeur + marge) + marge, lignes * (hauteur + bandeau + marge) + marge), 'white')
dessin = ImageDraw.Draw(planche)
for index, nom in enumerate(NOMS):
    colonne, ligne = index % colonnes, index // colonnes
    x = marge + colonne * (largeur + marge)
    y = marge + ligne * (hauteur + bandeau + marge)
    gif = Image.open(ROOT / 'evolution/media/candidate/alias-animations' / ('alias-%s.gif' % nom))
    gif.seek(0)
    planche.paste(gif.convert('RGB'), (x, y))
    dessin.rectangle([x, y + hauteur, x + largeur, y + hauteur + bandeau], fill='white')
    dessin.text((x + 2, y + hauteur + 2), LEGENDES[nom], fill='black')
    dessin.text((x + 2, y + hauteur + 16), 'alias-%s.gif — image 1 sur 2' % nom, fill='#444444')
sortie = ROOT / 'evolution/media/review/alias-lot2-verification.png'
planche.save(sortie)
print('planche :', sortie, '|', len(NOMS), 'animations')
