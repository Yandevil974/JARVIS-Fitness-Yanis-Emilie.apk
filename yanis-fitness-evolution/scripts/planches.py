#!/usr/bin/env python3
"""Planches de contact GIF pour vérification visuelle (diagnostic uniquement).

Modes :
  planches <entries.json> <out.png>          entries.json = [{"name":..., "file":...}]
  chrono   <media.gif> <out.png> [n_frames]  bande multi-images d'un GIF animé

Aucun média n'est modifié : lecture seule + planches dans /tmp ou ailleurs.
"""
import json
import sys

from PIL import Image, ImageDraw

CELL_W = 300
CELL_H = 210
LABEL_H = 26


def fit(im, w, h):
    r = min(w / im.width, h / im.height)
    return im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))))


def planches(entries, out):
    cols = 5
    rows = (len(entries) + cols - 1) // cols
    sheet = Image.new("RGB", (CELL_W * cols, (CELL_H + LABEL_H) * rows), (12, 14, 19))
    d = ImageDraw.Draw(sheet)
    for i, e in enumerate(entries):
        p = e["file"] if e["file"].startswith("/") else "public/media/" + e["file"]
        if not p.endswith(".gif") and not p.endswith(".png") and not p.endswith(".jpg"):
            p += ".gif"
        try:
            im = Image.open(p)
            im.seek(0)
            im = im.convert("RGB")
        except Exception:
            continue
        im = fit(im, CELL_W - 8, CELL_H - 8)
        x = (i % cols) * CELL_W + 4
        y = (i // cols) * (CELL_H + LABEL_H)
        sheet.paste(im, (x, y))
        d.text((x + 2, y + CELL_H - 4), str(e.get("name", ""))[:46], fill=(235, 238, 242))
    sheet.save(out)
    print("OK", out, sheet.size)


def chrono(path, out, n=4):
    im = Image.open(path)
    frames = getattr(im, "n_frames", 1)
    idxs = [min(i, frames - 1) for i in range(n)]
    tiles = []
    for i in idxs:
        im.seek(i)
        tiles.append(im.convert("RGB"))
    w = 360
    th = 300
    tiles = [fit(t, w, th) for t in tiles]
    sheet = Image.new("RGB", (w * n, th + 20), (12, 14, 19))
    for i, t in enumerate(tiles):
        sheet.paste(t, (i * w, 0))
    d = ImageDraw.Draw(sheet)
    d.text((4, th + 2), f"{path.split('/')[-1]} ({frames} images)", fill=(235, 238, 242))
    sheet.save(out)
    print("OK", out)


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "planches":
        planches(json.load(open(sys.argv[2])), sys.argv[3])
    elif mode == "chrono":
        chrono(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 4)
    else:
        print(__doc__)
        sys.exit(1)
