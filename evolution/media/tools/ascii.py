#!/usr/bin/env python3
"""Apercu texte d'une image : permet de « voir » un rendu sans visionnage.

    python3 .cache/refonte/ascii.py image.png [x0 y0 x1 y1] [--cols 96]
"""
import sys

from PIL import Image

RAMP = ' .:-=+*#%@'


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    cols = 96
    for a in sys.argv[1:]:
        if a.startswith('--cols='):
            cols = int(a.split('=')[1])
    im = Image.open(args[0]).convert('L')
    if len(args) == 5:
        im = im.crop(tuple(int(v) for v in args[1:5]))
    w, h = im.size
    rows = max(1, round(cols * h / w * 0.5))
    small = im.resize((cols, rows), Image.BOX)
    px = small.load()
    print('%s %dx%d -> %dx%d' % (args[0], w, h, cols, rows))
    for y in range(rows):
        print(''.join(RAMP[min(9, px[x, y] * 10 // 256)] for x in range(cols)))


if __name__ == '__main__':
    main()
