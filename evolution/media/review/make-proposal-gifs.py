#!/usr/bin/env python3
"""Turn a two-panel proposal drawing (start | end) into a 2-frame GIF in the library format
(650 ms per frame, longest side 440 px, white background), plus a labelled review sheet.
PYTHONPATH=.cache/image-tools python3 evolution/media/review/make-proposal-gifs.py"""
from PIL import Image, ImageDraw, ImageFont
import json, pathlib, sys
root = pathlib.Path(__file__).resolve().parents[3]
raw = root / '.cache/proposals/raw'
out = root / 'evolution/media/assets/proposals'
out.mkdir(parents=True, exist_ok=True)
LOT_FILE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'evolution/media/review/proposals-lot1.json'
LOT = json.loads(LOT_FILE.read_text())

def split_panels(im):
    g = im.convert('L'); w, h = g.size; px = g.load()
    # columns that are almost entirely white in the middle band = the gap between panels
    white = []
    for x in range(int(w * 0.3), int(w * 0.7)):
        col = sum(1 for y in range(0, h, 3) if px[x, y] > 240)
        white.append((x, col / (h / 3)))
    gap = [x for x, r in white if r > 0.97]
    if not gap:
        raise SystemExit('no white gap found')
    # take the widest contiguous run
    runs, start, prev = [], gap[0], gap[0]
    for x in gap[1:]:
        if x != prev + 1: runs.append((start, prev)); start = x
        prev = x
    runs.append((start, prev)); a, b = max(runs, key=lambda r: r[1] - r[0])
    return im.crop((0, 0, a, h)), im.crop((b + 1, 0, w, h))

def frame(panel, size):
    p = panel.convert('RGB'); p.thumbnail(size)
    bg = Image.new('RGB', size, 'white'); bg.paste(p, ((size[0] - p.width) // 2, (size[1] - p.height) // 2)); return bg

def make(entry):
    im = Image.open(raw / entry['source']).convert('RGB')
    left, right = split_panels(im)
    # common canvas: keep the panel aspect (both panels share the generator height)
    ratio = left.width / left.height
    size = (440, round(440 / ratio)) if ratio >= 1 else (round(440 * ratio), 440)
    frames = [frame(left, size), frame(right, size)]
    target = out / entry['file']
    frames[0].save(target, save_all=True, append_images=frames[1:], duration=650, loop=0, optimize=False)
    return frames, size

font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
rows = []
for entry in LOT['proposals']:
    frames, size = make(entry)
    rows.append((entry, frames))
    print(entry['file'], size)
cell = 300; W = 40 + cell * 2 + 30 + 120; rowh = cell + 70; H = 60 + rowh * len(rows)
sheet = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(sheet)
d.text((20, 12), LOT['title'], font=font, fill='black')
d.text((20, 34), LOT['subtitle'], font=small, fill=(80, 80, 80))
for i, (entry, frames) in enumerate(rows):
    y = 60 + i * rowh
    d.line((20, y, W - 20, y), fill=(220, 220, 220))
    d.text((20, y + 8), f"{i + 1}. {entry['name']}  →  {', '.join(entry['uses'])}", font=font, fill='black')
    d.text((20, y + 30), entry['positions'], font=small, fill=(70, 70, 70))
    for j, f in enumerate(frames):
        t = f.copy(); t.thumbnail((cell, cell)); x = 20 + j * (cell + 30)
        sheet.paste(t, (x, y + 50)); d.rectangle((x, y + 50, x + t.width, y + 50 + t.height), outline=(180, 180, 180))
        d.text((x, y + 52 + t.height), 'position 1' if j == 0 else 'position 2', font=small, fill=(120, 120, 120))
sheet.save(root / 'evolution/media/review' / LOT['sheet'], quality=85)
print('sheet', sheet.size)
