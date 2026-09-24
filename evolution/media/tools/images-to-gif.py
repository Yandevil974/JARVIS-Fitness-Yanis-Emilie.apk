"""Assemble des images pleines (une par position) en GIF 2 images.

Refonte v5 : chaque position est une retouche du modele maitre (votre photo
avec la salle et le visage), donc meme cadre, meme decor, meme corps : aucune
fenetre a calculer, l image entiere est gardee et ramenee a 440 de haut.

    python images-to-gif.py SORTIE.gif POSITION1.png POSITION2.png
"""
import importlib.util, pathlib, sys
from PIL import Image

ICI = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('ps', ICI / 'planche-style.py')
ps = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ps)

HAUTEUR = 440


def main(argv):
    if len(argv) < 3:
        print(__doc__)
        return 2
    cible, sources = pathlib.Path(argv[0]), argv[1:]
    images = [Image.open(s).convert('RGB') for s in sources]
    taille = images[0].size
    if any(i.size != taille for i in images):
        print('tailles differentes : %s' % [i.size for i in images], file=sys.stderr)
        return 1
    cadre = (round(HAUTEUR * taille[0] / taille[1]), HAUTEUR)
    images = [i.resize(cadre, Image.LANCZOS) for i in images]
    cible.parent.mkdir(parents=True, exist_ok=True)
    ps.enregistrer(cible, images)
    print('%s  %s  %d Ko' % (cible, cadre, cible.stat().st_size // 1024))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
