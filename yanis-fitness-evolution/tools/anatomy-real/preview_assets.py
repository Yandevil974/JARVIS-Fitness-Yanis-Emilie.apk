"""Fabrique les aperçus de la vidéo (GIF, planche 8 images, affiche).

Lit le MP4 final avec imageio-ffmpeg, sans dépendance système.
"""
from __future__ import annotations

import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DOCS = os.path.join(ROOT, "docs", "video-preview")
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def frames(mp4, w=900, h=1124, fps=24):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ff, "-v", "error", "-i", mp4, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    out = subprocess.run(cmd, capture_output=True, check=True).stdout
    arr = np.frombuffer(out, np.uint8).reshape(-1, h, w, 3)
    return arr


def gif(frames_arr, path, size=(360, 450), fps=8):
    step = max(1, int(round(24 / fps)))
    imgs = [Image.fromarray(f).resize(size, Image.LANCZOS).convert(
        "P", palette=Image.ADAPTIVE, colors=128) for f in frames_arr[::step]]
    imgs[0].save(path, save_all=True, append_images=imgs[1:], duration=int(1000 / fps),
                 loop=0, optimize=True)
    print("gif", path, os.path.getsize(path))


def sheet(arr, path, n=8, cols=4):
    h, w = arr.shape[1:3]
    idx = np.linspace(0, len(arr) - 1, n).astype(int)
    tw, th = w // 2, h // 2
    rows = (n + cols - 1) // cols
    canvas = Image.new("RGB", (cols * tw + (cols + 1) * 8, rows * th + (rows + 1) * 8),
                       (10, 12, 16))
    d = ImageDraw.Draw(canvas)
    f = ImageFont.truetype(FONT_R, 15)
    for k, i in enumerate(idx):
        im = Image.fromarray(arr[i]).resize((tw, th), Image.LANCZOS)
        x = 8 + (k % cols) * (tw + 8)
        y = 8 + (k // cols) * (th + 8)
        canvas.paste(im, (x, y))
        d.text((x + 8, y + 6), f"{i / 24:.1f} s", font=f, fill=(255, 190, 90))
    canvas.save(path, quality=88)
    print("sheet", path, os.path.getsize(path))


if __name__ == "__main__":
    mp4 = sys.argv[1]
    arr = frames(mp4)
    os.makedirs(DOCS, exist_ok=True)
    gif(arr, os.path.join(DOCS, "extension-triceps-poulie.gif"))
    sheet(arr, os.path.join(DOCS, "extension-triceps-poulie-frames.jpg"))
    Image.fromarray(arr[int(2.10 * 24)]).save(
        os.path.join(ROOT, "public", "media", "video", "extension-triceps-poulie-poster.jpg"),
        quality=90)
    print("ok", len(arr), "frames")
