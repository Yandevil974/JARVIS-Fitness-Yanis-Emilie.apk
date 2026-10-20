#!/usr/bin/env python3
"""Montage « vidéo de tout l'échauffement » (aperçu complet).

Assemble : carton-titre + vidéo pour chaque étape validée, + carton de fin.
Pour ajouter E5 (activation scapulaire) quand sa vidéo arrivera : ajouter UNE
ligne dans SEGS et relancer — aucun changement de code applicatif.

Usage : python3 docs/videos-3d/montage-apercu.py   (depuis yanis-fitness-evolution/)
Sorties : public/videos/warmup-apercu-complet.mp4 (+ poster).
"""
import subprocess
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H = 1024, 768
CARD_DUR = 1.4  # secondes par carton
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# (n°, titre, sous-titre, fichier vidéo ou None pour le carton de fin)
SEGS = [
    ("1", "Mise en route", "Marche sur tapis", "warmup-mise-en-route.mp4"),
    ("2", "Mobilité des épaules", "Cercles de bras", "warmup-mobilite-epaules.mp4"),
    ("3", "Mobilité hanches & chevilles", "Squat profond tenu", "warmup-mobilite-hanches.mp4"),
    ("4", "Activation fessiers", "Pont fessier", "warmup-pont-fessier.mp4"),
    # ("5", "Activation scapulaire", "Élastique", "warmup-activation-scapulaire.mp4"),  # E5 à venir
]
END_CARD = ("✓", "Aperçu terminé", "Lance l'échauffement guidé dans l'app !")


def text_center(d, cx, y, s, font, fill):
    bb = d.textbbox((0, 0), s, font=font)
    d.text((cx - (bb[2] - bb[0]) / 2, y), s, font=font, fill=fill)


def fit(font_path, s, max_w, start):
    size = start
    while size > 20:
        f = ImageFont.truetype(font_path, size)
        bb = ImageDraw.Draw(Image.new("RGB", (8, 8))).textbbox((0, 0), s, font=f)
        if bb[2] - bb[0] <= max_w:
            return f
        size -= 4
    return ImageFont.truetype(font_path, 20)


def card(num, title, sub, path):
    img = Image.new("RGB", (W, H), (16, 20, 24))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 14], fill=(255, 140, 0))  # barreau orange
    d.rectangle([0, H - 14, W, H], fill=(255, 140, 0))
    text_center(d, W / 2, 150, "ÉCHAUFFEMENT COMPLET", ImageFont.truetype(FR, 30), (150, 155, 160))
    text_center(d, W / 2, 215, num, ImageFont.truetype(FB, 150), (255, 140, 0))
    text_center(d, W / 2, 420, title, fit(FB, title, W - 120, 64), (255, 255, 255))
    text_center(d, W / 2, 520, sub, ImageFont.truetype(FR, 34), (170, 175, 180))
    img.save(path)


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def main():
    import os
    os.makedirs("/tmp/apercu", exist_ok=True)
    inputs, parts = [], []
    idx = 0

    def add_clip(video_path, list_path):
        nonlocal idx
        inputs.extend(["-i", list_path if False else video_path])
        parts.append(f"[{idx}:v]")
        idx += 1

    order = [(n, t, s, v) for (n, t, s, v) in SEGS] + [(END_CARD[0], END_CARD[1], END_CARD[2], None)]
    for i, (n, t, s, v) in enumerate(order):
        cpath = f"/tmp/apercu/card{i}.jpg"
        card(n, t, s, cpath)
        # carton statique -> clip (mêmes params que les segments)
        clip = f"/tmp/apercu/card{i}.mp4"
        run([FF, "-y", "-hide_banner", "-loglevel", "error",
             "-loop", "1", "-framerate", "24", "-t", str(CARD_DUR), "-i", cpath,
             "-vf", f"scale={W}:{H}", "-c:v", "libx264", "-pix_fmt", "yuv420p",
             "-crf", "20", "-an", clip])
        add_clip(clip, None)
        if v:
            add_clip(f"public/videos/{v}", None)

    n = len(parts)
    filt = "".join(parts) + f"concat=n={n}:v=1:a=0,fade=t=in:st=0:d=0.5,fade=t=out:st=22:d=1[v]"
    run([FF, "-y", "-hide_banner", "-loglevel", "error", *inputs,
         "-filter_complex", filt, "-map", "[v]",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "21",
         "-movflags", "+faststart", "-an",
         "public/videos/warmup-apercu-complet.mp4"])
    run([FF, "-y", "-hide_banner", "-loglevel", "error", "-ss", "3",
         "-i", "public/videos/warmup-apercu-complet.mp4",
         "-frames:v", "1", "-q:v", "3",
         "public/videos/posters/warmup-apercu-complet.jpg"])
    print("OK : public/videos/warmup-apercu-complet.mp4")


if __name__ == "__main__":
    main()
