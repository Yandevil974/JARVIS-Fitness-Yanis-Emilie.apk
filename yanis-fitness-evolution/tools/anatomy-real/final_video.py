"""Vidéo « Extension triceps à la poulie » — corps anatomique réel.

Rendu : 900×1124, 24 i/s, muet. Trois plans (3/4 face, profil, 3/4 dos),
4 répétitions, incrustations (titre, badges, compteur, consignes).
"""
from __future__ import annotations

import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from engine3d import Camera, Scene, render
import body
import final2 as F
from scene import build_gym
import video as V

W, H, FPS = 900, 1124, 24
DURATION = 8.6
SHOTS = [
    ("front", (2.62, 1.30, 2.72), (0.03, 1.02, 0.0), 30.0, 0.0, 3.4),
    ("side", (0.46, 1.28, 3.62), (0.03, 1.02, 0.02), 30.0, 3.4, 5.9),
    ("back", (-2.72, 1.34, 1.95), (0.02, 1.02, 0.0), 30.0, 5.9, DURATION),
]
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * t)


def shot_at(t):
    for name, eye, tgt, fov, t0, t1 in SHOTS:
        if t0 <= t < t1:
            return name, (t - t0) / (t1 - t0)
    return SHOTS[-1][0], 1.0


def rep_phase(t):
    """0 = bras fléchis, 1 = extension complète (4 répétitions)."""
    if t < 1.15:
        return 0.0
    t = t - 1.15
    period = 1.72
    local = (t % period) / period
    if local < 0.40:
        p = ease(local / 0.40)
    elif local < 0.50:
        p = 1.0
    elif local < 0.92:
        p = 1.0 - ease((local - 0.50) / 0.42)
    else:
        p = 0.0
    return p


def pose_at(t):
    p = rep_phase(t)
    return 96.0 - 88.0 * p, 8.0 - 3.0 * p


def background(cam):
    sc = build_gym()
    for m in F.tower():
        sc.add(m)
    from engine3d import to_image
    col, dep = render(sc, cam, blur_bg=0.0)
    img = to_image(col, exposure=1.0)
    from PIL import ImageFilter
    img = img.filter(ImageFilter.GaussianBlur(1.4))
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return arr, dep


def _font(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT_R, size)


def draw_overlays(img, t, phase):
    """Titre en bas (jamais devant le visage), compteur en haut à gauche."""
    d = ImageDraw.Draw(img, "RGBA")
    # dégradé bas + bloc titre
    band_h = int(H * 0.20)
    grad = Image.new("RGBA", (W, band_h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    for k in range(band_h):
        a = int(226 * (k / band_h) ** 1.25)
        gd.line([(0, k), (W, k)], fill=(5, 7, 11, a))
    img.paste(grad, (0, H - band_h), grad)
    d = ImageDraw.Draw(img, "RGBA")
    y0 = H - band_h + int(band_h * 0.20)
    d.text((W * 0.055, y0), "TRICEPS · POULIE HAUTE",
            font=_font(22, True), fill=(255, 176, 74, 255))
    d.text((W * 0.055, y0 + 30), "Extension triceps à la poulie",
            font=_font(36, True), fill=(240, 244, 250, 255))
    d.text((W * 0.055, y0 + 82),
            "Coudes collés au corps · extension complète · retour contrôlé",
            font=_font(19), fill=(172, 182, 197, 255))
    # compteur de répétitions (haut gauche)
    if t >= 1.15:
        rep = 1 + min(3, int((t - 1.15) / 1.72))
        lab = f"RÉPÉTITION {rep}/4"
        f = _font(22, True)
        tw = d.textlength(lab, font=f)
        d.rounded_rectangle([W * 0.05, H * 0.045, W * 0.05 + tw + 30, H * 0.045 + 38],
                            radius=19, fill=(255, 168, 62, 232))
        d.text((W * 0.05 + 15, H * 0.045 + 7), lab, font=f, fill=(24, 16, 6, 255))
        sub = "excentrique" if phase < 0.05 else (
            "extension" if phase > 0.97 else "concentrique" if phase < 0.6 else "retour")
        d.text((W * 0.05 + tw + 44, H * 0.045 + 9), sub, font=_font(19),
               fill=(190, 200, 214, 230))
    # barre de progression de la répétition (haut de l'image)
    if t >= 1.15:
        d.rectangle([0, 0, W, 6], fill=(12, 14, 18, 220))
        d.rectangle([0, 0, int(W * min(1.0, phase)), 6], fill=(255, 168, 62, 255))
    return img


def compose_frame(arr, t, phase):
    from engine3d import to_image
    img = to_image(arr, exposure=1.02).convert("RGB")
    img = V.vignette(img)
    img = draw_overlays(img, t, phase)
    fade = min(1.0, t / 0.30, max(0.0, (DURATION - t) / 0.40))
    if fade < 0.999:
        img = Image.fromarray((np.asarray(img, np.float32) * fade).astype(np.uint8), "RGB")
    return img


def _ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def main(out_mp4, poster=None, start=0, end=None):
    cams, bgs = {}, {}
    for name, eye, tgt, fov, t0, t1 in SHOTS:
        if name in cams:
            continue
        cam = Camera(eye, tgt, fov=fov, width=W, height=H)
        cams[name] = cam
        print("[bg]", name, flush=True)
        bgs[name] = background(cam)
    n_total = int(round(DURATION * FPS))
    n0 = int(start * FPS)
    n1 = n_total if end is None else int(end * FPS)
    ff = _ffmpeg()
    cmd = [ff, "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo",
           "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an",
           "-c:v", "libx264", "-preset", "medium", "-crf", "23",
           "-pix_fmt", "yuv420p", "-profile:v", "main", "-level", "4.0",
           "-movflags", "+faststart", out_mp4]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n0, n1):
        t = i / FPS
        name, _ = shot_at(t)
        cam = cams[name]
        bg, dep = bgs[name]
        th, ln = pose_at(t)
        arr, _, _ = F.compose(th, ln, cam, bg=bg, bg_depth=dep)
        img = compose_frame(arr, t, rep_phase(t))
        if poster and i == int(2.10 * FPS):
            img.save(poster, quality=90)
        proc.stdin.write(img.tobytes())
        if i % 12 == 0:
            print(f"[frame] {i}/{n_total}", flush=True)
    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise SystemExit("ffmpeg a échoué")
    print("OK", out_mp4, os.path.getsize(out_mp4), "octets")


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "/tmp/extension.mp4"
    main(out, os.path.splitext(out)[0] + "-poster.jpg")
