#!/usr/bin/env python3
"""Refonte photo : assemble deux positions retouchees en GIF 2 images.

Famille v5 (celle approuvee) : chaque position est une RETOUCHE de la photo
maitre de l'utilisateur, donc meme visage, meme corps, meme salle, meme cadrage.
On ne recadre rien et on ne retouche rien ici : on assemble.

    python3 evolution/media/tools/photo-to-gif.py --out evolution/media/refonte-photo/gif \
        homme-elevations-assises:planches/homme-elevations-assises-1b.png:planches/homme-elevations-assises-2.png

Sortie : <nom>.gif — 2 images, 500 ms, boucle infinie, largeur proportionnelle
(hauteur 440, comme les GIF de la refonte v5).

--sheet NOM sortie.jpg  : planche de controle « position 1 | position 2 ».
"""
import argparse
import pathlib
import sys

from PIL import Image, ImageDraw

HAUTEUR = 440
DUREE = 500


def preparer(chemin):
    """Charge une position et la ramene a la famille (hauteur 440)."""
    image = Image.open(chemin).convert('RGB')
    largeur = max(1, round(HAUTEUR * image.size[0] / image.size[1]))
    return image.resize((largeur, HAUTEUR), Image.LANCZOS)


def enregistrer(cible, images):
    cible.parent.mkdir(parents=True, exist_ok=True)
    images[0].save(cible, save_all=True, append_images=images[1:],
                   duration=DUREE, loop=0, optimize=True)


def planche(cible, blocs):
    """blocs : [(titre, image_gauche, image_droite)] -> une planche de controle."""
    marge, entete = 10, 28
    largeur = max(g.width + d.width + 3 * marge for _, g, d in blocs)
    hauteur = entete * len(blocs) + HAUTEUR * len(blocs) + marge * (len(blocs) + 1)
    tuile = Image.new('RGB', (largeur, hauteur), 'white')
    dessin = ImageDraw.Draw(tuile)
    y = marge
    for titre, gauche, droite in blocs:
        dessin.text((marge, y + 8), titre, fill=(20, 20, 20))
        y += entete
        tuile.paste(gauche, (marge, y))
        tuile.paste(droite, (marge * 2 + gauche.width, y))
        y += HAUTEUR + marge
    cible.parent.mkdir(parents=True, exist_ok=True)
    tuile.save(cible, quality=92)
    return tuile.size


def main(argv):
    analyseur = argparse.ArgumentParser(description=__doc__,
                                        formatter_class=argparse.RawDescriptionHelpFormatter)
    analyseur.add_argument('paires', nargs='+',
                           help='NOM:position1.png:position2.png (ou DOSSIER/NOM.png:DOSSIER)')
    analyseur.add_argument('--out', required=True, type=pathlib.Path, help='dossier des GIF')
    analyseur.add_argument('--sheet', type=pathlib.Path, help='planche de controle (JPG)')
    analyseur.add_argument('--prefixe', default='refonte-photo-', help='prefixe des titres de planche')
    args = analyseur.parse_args(argv)

    blocs, faits = [], []
    for item in args.paires:
        morceaux = item.split(':')
        if len(morceaux) != 3:
            print('attendu NOM:position1.png:position2.png — recu %r' % item, file=sys.stderr)
            return 2
        nom, gauche, droite = morceaux
        images = [preparer(gauche), preparer(droite)]
        if images[0].width != images[1].width:
            # Deux retouches peuvent sortir a des largeurs legerement differentes :
            # on garde la plus large et on centre l'autre sur fond blanc, sans
            # jamais etirer ni recadrer le personnage.
            largeur = max(i.width for i in images)
            cadrees = []
            for image in images:
                if image.width == largeur:
                    cadrees.append(image)
                    continue
                tuile = Image.new('RGB', (largeur, HAUTEUR), 'white')
                tuile.paste(image, ((largeur - image.width) // 2, 0))
                cadrees.append(tuile)
            images = cadrees
        cible = args.out / (nom + '.gif')
        enregistrer(cible, images)
        faits.append((cible, images[0].size))
        blocs.append((args.prefixe + nom, images[0], images[1]))
        print('%-56s %s  2 images  %d ms' % (cible, images[0].size, DUREE))
    if args.sheet and blocs:
        taille = planche(args.sheet, blocs)
        print('planche de controle : %s %s' % (args.sheet, taille))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
