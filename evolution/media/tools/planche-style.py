#!/usr/bin/env python3
"""Planche de positions -> animations GIF dans le style de la photo de reference.

La photo de reference deposee par l'utilisateur (voir .cache/work/ref/) montre
un personnage musculaire en materiau blanc brillant, sur fond de studio gris
tres sombre, avec les muscles travailles en vert citron. Le style est donc
l'inverse de celui des planches precedentes (fond blanc, trait noir) : ici le
fond est sombre et la figure est claire. Le decoupage de panels-to-gif.py ne
s'applique plus, d'ou cet outil.

Disposition CONSTATEE des planches produites (canvas 16:9, 1376 x 768)

    Le modele decoupe l'image en 2 rangees x 4 colonnes, soit huit cases de
    344 x 384. La rangee du haut porte l'homme, celle du bas la femme ; dans
    chaque rangee les colonnes 0 et 1 sont les deux positions du mouvement et
    les colonnes 2 et 3 en sont la repetition (paire dupliquee, verifiee par
    --check). On ne garde donc que les colonnes 0 et 1.

        +--------+--------+--------+--------+
        |  homme |  homme |  homme |  homme |
        |  pos A |  pos B |  pos A |  pos B |     <- rangee 0 : yanis
        +--------+--------+--------+--------+
        |  femme |  femme |  femme |  femme |
        |  pos A |  pos B |  pos A |  pos B |     <- rangee 1 : emilie
        +--------+--------+--------+--------+
           col 0    col 1    col 2    col 3

Sortie : deux GIF, <nom>-yanis.gif et <nom>-emilie.gif, 2 images, 500 ms par
image, boucle infinie. Le cadre est centre sur le personnage ; il est PORTRAIT
(246 x 440, rapport de la photo de reference) pour un mouvement debout ou assis,
et PAYSAGE (440 x 246) pour un mouvement allonge. Les deux images d'un meme GIF
partagent exactement la meme fenetre : aucune saccade a la lecture.

    # Controle d'une planche, sans rien produire
    python3 evolution/media/tools/planche-style.py --check planche.png

    # Production
    python3 evolution/media/tools/planche-style.py --out DIR planche.png ...

Options utiles : --grid 2x4 (defaut) ou 1x2 ; --prendre 0,1 (colonnes gardees) ;
--profil (pour une planche 1x2) ; --orientation portrait|paysage|auto ; --seuil.
"""
import argparse
import collections
import pathlib
import sys

from PIL import Image, ImageChops, ImageFilter, ImageStat

PORTRAIT = (246, 440)      # rapport 0,559 : celui de la photo de reference
PAYSAGE = (440, 246)
DUREE = 500
SEUIL = 120         # luminance d'un pixel de la figure (fond ~ 28, halo ~ 76)
BRUIT = 0.005       # composant ignore, en fraction de la case
ECART = 12          # colonnes vides separant deux personnages cote a cote
MARGE = 6           # marge minimale autour du personnage, en pixels
PROFILS = ('yanis', 'emilie')
INSET = 6           # marge retiree a chaque case : supprime les filets clairs


def nettoyer_filets(image, lignes, colonnes):
    """Efface les filets clairs que le modele dessine autour des cases.

    Un filet est une colonne (ou une rangee) lumineuse sur presque toute sa
    longueur : sans ce nettoyage il est pris pour le personnage et fausse le
    cadrage. Chaque pixel du filet est repeint avec la moyenne de deux pixels
    lus plus a l'interieur de la case, de part et d'autre du filet. La lecture
    se fait sur l'image d'origine, l'ecriture sur la copie.
    """
    source = image.convert('RGB')
    copie = source.copy()
    largeur, hauteur = source.size
    fond = collections.Counter(source.getpixel((x, y))
                               for x in range(0, largeur, 11)
                               for y in range(0, hauteur, 11)).most_common(1)[0][0]
    positions = {'colonne': [0] + [rang * largeur // colonnes for rang in range(1, colonnes)]
                 + [largeur - 1],
                 'rangee': [0] + [rang * hauteur // lignes for rang in range(1, lignes)]
                 + [hauteur - 1]}
    for sens in ('colonne', 'rangee'):
        total = largeur if sens == 'colonne' else hauteur
        autres = hauteur if sens == 'colonne' else largeur
        for position in positions[sens]:
            for decalage in range(-9, 10):
                rang = position + decalage
                if not 0 <= rang < total:
                    continue
                pixels = [source.getpixel((rang, autre)) if sens == 'colonne'
                          else source.getpixel((autre, rang))
                          for autre in range(0, autres, 4)]
                if sum(1 for valeur in pixels if sum(valeur) / 3 >= SEUIL) <= 0.8 * len(pixels):
                    continue
                avant = min(max(rang - 12, 0), total - 1)
                apres = min(max(rang + 12, 0), total - 1)
                if avant == rang:
                    avant = apres
                if apres == rang:
                    apres = avant
                # On repeint avec la couleur de fond : une moyenne avec le filet
                # laisserait un gris moyen encore au-dessus du seuil.
                for autre in range(autres):
                    if sens == 'colonne':
                        copie.putpixel((rang, autre), fond)
                    else:
                        copie.putpixel((autre, rang), fond)
    return copie


def decouper(image, lignes, colonnes):
    largeur, hauteur = image.size
    for ligne in range(lignes):
        for colonne in range(colonnes):
            yield (colonne * largeur // colonnes + INSET,
                   ligne * hauteur // lignes + INSET,
                   (colonne + 1) * largeur // colonnes - INSET,
                   (ligne + 1) * hauteur // lignes - INSET)


def masque(cellule):
    gris = cellule.convert('L').filter(ImageFilter.MedianFilter(3))
    return gris.point(lambda valeur: 255 if valeur >= SEUIL else 0)


def composantes(masque_):
    """Composantes connexes du masque, de la plus grande a la plus petite."""
    largeur, hauteur = masque_.size
    pixels = masque_.load()
    vus = bytearray(largeur * hauteur)
    trouvees = []
    for depart in range(largeur * hauteur):
        if pixels[depart % largeur, depart // largeur] and not vus[depart]:
            pile = [depart]
            vus[depart] = 1
            points = []
            while pile:
                sommet = pile.pop()
                x, y = sommet % largeur, sommet // largeur
                points.append((x, y))
                for voisin in (sommet - 1, sommet + 1, sommet - largeur, sommet + largeur):
                    if 0 <= voisin < largeur * hauteur and not vus[voisin]:
                        if pixels[voisin % largeur, voisin // largeur]:
                            vus[voisin] = 1
                            pile.append(voisin)
            xs = [point[0] for point in points]
            ys = [point[1] for point in points]
            trouvees.append(((min(xs), min(ys), max(xs) + 1, max(ys) + 1), len(points)))
    trouvees.sort(key=lambda item: -item[1])
    return trouvees


def cadre_figure(cellule):
    """Boite du personnage : union des composantes assez grosses."""
    composantes_ = composantes(masque(cellule))
    if not composantes_:
        return None
    plancher = cellule.width * cellule.height * BRUIT
    boites = [boite for boite, aire in composantes_ if aire >= plancher]
    if not boites:
        return None
    return (min(boite[0] for boite in boites), min(boite[1] for boite in boites),
            max(boite[2] for boite in boites), max(boite[3] for boite in boites))


def personnages(cellule):
    """Nombre de personnages : amas de colonnes occupees dans le masque."""
    largeur, hauteur = cellule.size
    pixels = masque(cellule).load()
    colonnes_ = [any(pixels[x, y] for y in range(0, hauteur, 2)) for x in range(largeur)]
    amas, manque = 0, ECART + 1
    for occupee in colonnes_:
        if occupee:
            if manque > ECART:
                amas += 1
            manque = 0
        else:
            manque += 1
    return amas


ASPECTS = {'portrait': ((246, 440), (308, 440), (374, 440)),
           'paysage': ((440, 246), (440, 330), (440, 383))}


def fenetre(cellules, orientation, mode='auto'):
    """Fenetre commune a toutes les images d'un meme GIF.

    Une fenetre unique garantit un cadrage et une echelle identiques d'une image
    a l'autre : sans cela le GIF saute. Le rapport de la fenetre est toujours
    celui du cadre de sortie, donc aucune deformation. Si le personnage est
    trop large pour le cadre portrait (squat bras tendus), on passe au cadre
    plus large suivant, puis a defaut a la case entiere.

    mode « auto » : la fenetre est centree sur le personnage detecte.
    mode « case » : la fenetre est centree sur la case (piscine : la surface de
    l'eau est de la meme luminosite que le corps, la detection est impossible).
    """
    case_l, case_h = cellules[0].size
    boites = None if mode == 'case' else [cadre_figure(cellule) for cellule in cellules]
    if boites and not any(boite is None for boite in boites):
        x0 = min(boite[0] for boite in boites)
        y0 = min(boite[1] for boite in boites)
        x1 = max(boite[2] for boite in boites)
        y1 = max(boite[3] for boite in boites)
    else:
        x0, y0, x1, y1 = 0, 0, case_l, case_h
        boites = None
    largeur, hauteur = x1 - x0, y1 - y0
    if orientation == 'auto':
        orientation = 'paysage' if largeur > 1.15 * hauteur else 'portrait'
    # Marge minimale : 6 pixels de chaque cote. Le cadre de reference (246 x 440,
    # le rapport de la photo) est garde chaque fois que le personnage y tient ;
    # sinon on passe au cadre plus large suivant.
    besoin = (0, 0) if boites is None else (largeur + 2 * MARGE, hauteur + 2 * MARGE)
    centre = ((x0 + x1) / 2, (y0 + y1) / 2)
    cadres = list(ASPECTS[orientation]) + [(case_l, case_h)]
    for cadre in cadres:
        rapport = cadre[0] / cadre[1]
        hauteur_fenetre = min(case_h, case_l / rapport)
        largeur_fenetre = hauteur_fenetre * rapport
        if largeur_fenetre >= besoin[0] and hauteur_fenetre >= besoin[1]:
            sx = min(max(centre[0] - largeur_fenetre / 2, 0), case_l - largeur_fenetre)
            sy = min(max(centre[1] - hauteur_fenetre / 2, 0), case_h - hauteur_fenetre)
            boite = (round(sx), round(sy), round(sx + largeur_fenetre),
                     round(sy + hauteur_fenetre))
            if boites is not None:
                for rang, cellule_boite in enumerate(boites):
                    if (cellule_boite[0] < boite[0] or cellule_boite[1] < boite[1]
                            or cellule_boite[2] > boite[2] or cellule_boite[3] > boite[3]):
                        print('     ATTENTION : le personnage de l image %d deborde de la '
                              'fenetre %s' % (rang, boite), file=sys.stderr)
            return boite, cadre, orientation
    return (0, 0, case_l, case_h), (case_l, case_h), orientation


def ajuster(cellule, boite, cadre):
    return cellule.crop(boite).resize(cadre, Image.LANCZOS)


def enregistrer(cible, images):
    """GIF 2 images, palette commune : aucune fluctuation de couleur entre images.

    MAXCOVERAGE a 128 couleurs tient la taille du fichier (47 Ko au lieu de
    110 Ko) sans toucher aux traits du visage ; le leger lissage retire le
    bruit du fond, seul responsable du poids du GIF.
    """
    images = [image.filter(ImageFilter.SMOOTH) for image in images]
    temoin = Image.new('RGB', (images[0].width, images[0].height * len(images)))
    for rang, image in enumerate(images):
        temoin.paste(image, (0, rang * image.height))
    palette = temoin.quantize(colors=128, method=Image.MAXCOVERAGE)
    images = [image.quantize(palette=palette, dither=Image.NONE) for image in images]
    images[0].save(cible, save_all=True, append_images=images[1:], duration=DUREE,
                   loop=0, optimize=True, disposal=2)


def ecart(a, b):
    """Ecart moyen entre deux cases : repere la paire dupliquee par le modele."""
    return round(ImageStat.Stat(ImageChops.difference(
        a.convert('L').resize((86, 96)), b.convert('L').resize((86, 96)))).mean[0], 1)


def verifier(source, image, lignes, colonnes, pris):
    cellules = [image.crop(boite) for boite in decouper(image, lignes, colonnes)]
    print('%s  %dx%d  %d cases' % (source.name, *image.size, len(cellules)))
    for ligne in range(lignes):
        for colonne in range(colonnes):
            cellule = cellules[ligne * colonnes + colonne]
            boite = cadre_figure(cellule)
            nombre = personnages(cellule)
            nom = PROFILS[ligne] if lignes == 2 else (cellule and 'figure')
            if boite is None:
                print('  [%s col %d] VIDE' % (nom, colonne), file=sys.stderr)
                continue
            deborde = boite[0] <= 0 or boite[1] <= 0 or \
                boite[2] >= cellule.width or boite[3] >= cellule.height
            print('  [%s col %d] personnages=%d cadre=%s taille=%dx%d'
                  % (nom, colonne, nombre, boite, boite[2] - boite[0], boite[3] - boite[1]))
            if nombre != 1:
                print('     REFAIRE : cette case ne contient pas exactement un personnage',
                      file=sys.stderr)
            if deborde:
                print('     REFAIRE : le personnage touche un bord de la case', file=sys.stderr)
    if colonnes == 4 and lignes == 2:
        for ligne, nom in enumerate(PROFILS):
            for colonne in (0, 1):
                valeur = ecart(cellules[ligne * 4 + colonne], cellules[ligne * 4 + colonne + 2])
                print('  [%s] ecart col %d / col %d : %s  %s'
                      % (nom, colonne, colonne + 2, valeur,
                         'paire dupliquee' if valeur < 12 else 'PAIRES DIFFERENTES'))
    if lignes == 2:
        for ligne, nom in enumerate(PROFILS):
            boites = [cadre_figure(cellules[ligne * colonnes + colonne]) for colonne in pris]
            if any(boite is None for boite in boites):
                continue
            tailles = [(boite[2] - boite[0], boite[3] - boite[1]) for boite in boites]
            print('  [%s] tailles des positions : %s' % (nom, tailles))
    return cellules


def main():
    global SEUIL
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('planches', nargs='+', type=pathlib.Path)
    parser.add_argument('--out', type=pathlib.Path)
    parser.add_argument('--check', action='store_true', help='controle sans produire')
    parser.add_argument('--grid', default='2x4', help='rangees x colonnes, ex. 2x4 ou 1x2')
    parser.add_argument('--prendre', default='0,1', help='colonnes gardees, defaut 0,1')
    parser.add_argument('--profil', help='genre d une planche 1x2 (yanis ou emilie)')
    parser.add_argument('--fenetre', default='auto', choices=('auto', 'case'),
                        help="auto : centree sur le personnage ; case : centree sur la case")
    parser.add_argument('--orientation', default='auto',
                        choices=('auto', 'portrait', 'paysage'))
    parser.add_argument('--seuil', type=int, help='luminance de la figure')
    args = parser.parse_args()
    if args.seuil:
        SEUIL = args.seuil
    lignes, colonnes = (int(valeur) for valeur in args.grid.lower().split('x'))
    pris = [int(valeur) for valeur in args.prendre.split(',')]
    if args.check:
        for source in args.planches:
            verifier(source, nettoyer_filets(Image.open(source).convert('RGB'), lignes, colonnes),
                     lignes, colonnes, pris)
        return 0
    if not args.out:
        parser.error('--out est obligatoire pour produire')
    args.out.mkdir(parents=True, exist_ok=True)
    for source in args.planches:
        image = Image.open(source).convert('RGB')
        image = nettoyer_filets(image, lignes, colonnes)
        cellules = [image.crop(boite) for boite in decouper(image, lignes, colonnes)]
        if lignes == 2:
            for rang, profil in enumerate(PROFILS):
                prises = [cellules[rang * colonnes + colonne] for colonne in pris]
                boite, cadre, orientation = fenetre(prises, args.orientation, args.fenetre)
                images = [ajuster(cellule, boite, cadre) for cellule in prises]
                cible = args.out / ('%s-%s.gif' % (source.stem, profil))
                enregistrer(cible, images)
                print('%s  %s  %s  fenetre=%s' % (cible, cadre, orientation, boite))
        else:
            prises = [cellules[colonne] for colonne in pris]
            boite, cadre, orientation = fenetre(prises, args.orientation, args.fenetre)
            images = [ajuster(cellule, boite, cadre) for cellule in prises]
            nom = source.stem if not args.profil else '%s-%s' % (source.stem, args.profil)
            cible = args.out / (nom + '.gif')
            enregistrer(cible, images)
            print('%s  %s  %s  fenetre=%s' % (cible, cadre, orientation, boite))
    return 0


if __name__ == '__main__':
    sys.exit(main())
