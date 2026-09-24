#!/usr/bin/env python3
"""Fabrique un visuel d'etirement (JPG) a partir d'une figure unique.

Format mesure sur les etirements deja livres : 1376 x 768, figure entiere
haute d'environ 95 % du cadre, centree, pieds a quelques pixels du bas, fond
blanc. Un dessin d'etirement est une image FIXE : une seule posture, pas
d'animation (contrairement aux mouvements de Tabata et de piscine).

    python3 evolution/media/tools/figure-to-stretch.py figure.png sortie.jpg
"""
import argparse
import pathlib
import sys

from PIL import Image, ImageChops

FRAME = (1376, 768)
HEIGHT = 0.94     # part de la hauteur du cadre occupee par la figure
BOTTOM = 14       # marge sous les pieds, en pixels
INK = 18


def figure_box(image):
    grey = image.convert('L')
    mask = ImageChops.difference(grey, Image.new('L', grey.size, 255)).point(
        lambda value: 255 if value > INK else 0)
    boxes, runs, start, gap = [], [], None, 0
    width, height = mask.size
    pixels = mask.load()
    counts = [sum(1 for y in range(height) if pixels[x, y]) for x in range(width)]
    for x, count in enumerate(counts + [0] * 31):
        if count:
            start = x if start is None else start
            gap = 0
        elif start is not None:
            gap += 1
            if gap > 30:
                runs.append((start, min(x - gap, width - 1)))
                start, gap = None, 0
    for left, right in runs:
        strip = mask.crop((left, 0, right + 1, height)).getbbox()
        if strip:
            boxes.append((left + strip[0], strip[1], left + strip[2], strip[3]))
    return boxes


def build(source, target, index):
    image = Image.open(source).convert('RGB')
    boxes = figure_box(image)
    if index == 0:
        if len(boxes) != 1:
            raise SystemExit('%s : %d figure(s) detectee(s) ; choisir avec --figure' % (source.name, len(boxes)))
        chosen = boxes[0]
    else:
        if index > len(boxes):
            raise SystemExit('%s : figure %d inexistante (%d trouvee(s))' % (source.name, index, len(boxes)))
        chosen = boxes[index - 1]
    box = chosen
    figure = image.crop(box)
    scale = (FRAME[1] * HEIGHT) / figure.height
    figure = figure.resize((max(1, round(figure.width * scale)), max(1, round(figure.height * scale))), Image.LANCZOS)
    if figure.width > FRAME[0] - 20:
        raise SystemExit('%s : figure trop large apres mise a l echelle' % source.name)
    canvas = Image.new('RGB', FRAME, 'white')
    canvas.paste(figure, ((FRAME[0] - figure.width) // 2, FRAME[1] - BOTTOM - figure.height))
    canvas.save(target, quality=92, optimize=True)
    print(target, FRAME, 'figure', figure.size, 'source', box)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sources', nargs='+', type=pathlib.Path)
    parser.add_argument('--out', required=True, type=pathlib.Path)
    parser.add_argument('--figure', type=int, default=0,
                        help='numero de la figure a garder quand la planche en contient plusieurs (1 = la plus a gauche)')
    parser.add_argument('--only', help='nom du fichier source a traiter avec --figure')
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    for source in args.sources:
        index = args.figure if (not args.only or source.stem == args.only) else 0
        build(source, args.out / (source.stem + '.jpg'), index)


if __name__ == '__main__':
    main()
