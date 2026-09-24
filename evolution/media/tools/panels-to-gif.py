#!/usr/bin/env python3
"""Fabrique une animation (GIF) a partir d'une planche de deux positions.

La planche doit contenir deux positions du meme mouvement, cote a cote, sur fond
blanc, separees par un filet vertical clair. La sortie respecte exactement la
famille des GIF aquatiques deja livres : 480 x 262, 2 images, 500 ms par image,
fond blanc, figure entiere (aucune tete ni pied coupe), centree.

    python3 evolution/media/tools/panels-to-gif.py planche.png sortie.gif
"""
import argparse
import pathlib
import re
import sys

from PIL import Image, ImageChops


FRAME = (480, 262)
MARGIN = 8          # marge minimale autour de la figure
FILL = 236          # hauteur visee de la figure, comme les GIF deja livres
INK = 150           # seuil : encre du dessin (trait noir, muscles surlignes)


def panel_split(image):
    """Coupe la planche en deux au filet vertical clair le plus proche du milieu."""
    grey = image.convert('L')
    width, height = grey.size
    pixels = grey.load()
    best, best_x = -1, width // 2
    for x in range(width // 2 - 40, width // 2 + 40):
        count = sum(1 for y in range(0, height, 4) if 150 < pixels[x, y] < 245)
        if count > best:
            best, best_x = count, x
    return image.crop((0, 0, best_x - 6, height)), image.crop((best_x + 6, 0, width, height))


def ink_box(image):
    grey = image.convert('L')
    mask = ImageChops.difference(grey, Image.new('L', grey.size, 255))
    return mask.point(lambda value: 255 if value > INK else 0).getbbox()


def build(panels):
    boxes = [ink_box(panel) for panel in panels]
    if any(box is None for box in boxes):
        raise SystemExit('aucune figure detectee sur la planche')
    scale = min(min(FILL / (box[3] - box[1]) for box in boxes),
                min((FRAME[0] - 2 * MARGIN) / (box[2] - box[0]) for box in boxes))
    frames = []
    for panel, box in zip(panels, boxes):
        large = panel.resize((max(1, round(panel.width * scale)), max(1, round(panel.height * scale))), Image.LANCZOS)
        box = [round(value * scale) for value in box]
        # Marge large : le cadrage centre la figure sans jamais toucher un bord.
        pad = (FRAME[0], FRAME[1])
        canvas = Image.new('RGB', (large.width + 2 * pad[0], large.height + 2 * pad[1]), 'white')
        canvas.paste(large, pad)
        left = pad[0] + (box[0] + box[2]) // 2 - FRAME[0] // 2
        top = pad[1] + (box[1] + box[3]) // 2 - FRAME[1] // 2
        frames.append(canvas.crop((left, top, left + FRAME[0], top + FRAME[1])))
    # La figure doit rester entiere : on refuse une image qui touche un bord.
    for index, frame in enumerate(frames):
        box = ink_box(frame)
        if box is None or box[0] <= 0 or box[1] <= 0 or box[2] >= FRAME[0] or box[3] >= FRAME[1]:
            print('ATTENTION : figure au bord du cadre dans l’image', index, box, file=sys.stderr)
    return frames


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('planches', nargs='+', help='planches PNG ou dossiers de planches')
    parser.add_argument('--out', required=True, type=pathlib.Path, help='dossier de sortie')
    args = parser.parse_args()
    sources = []
    for item in args.planches:
        path = pathlib.Path(item)
        sources.extend(sorted(path.glob('*.png')) if path.is_dir() else [path])
    args.out.mkdir(parents=True, exist_ok=True)
    for source in sources:
        image = Image.open(source).convert('RGB')
        panels = panel_split(image)
        frames = build(panels)
        name = source.stem.split('-', 1)[-1] if source.stem.startswith('tabata-') else source.stem
        target = args.out / (re.sub(r'^\d+[-_]', '', name) + '.gif')
        frames[0].save(target, save_all=True, append_images=frames[1:], duration=500, loop=0,
                       optimize=True, disposal=2)
        print(target, frames[0].size, 'images', len(frames))


if __name__ == '__main__':
    main()
