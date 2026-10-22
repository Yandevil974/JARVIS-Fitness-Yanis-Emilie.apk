#!/usr/bin/env python3
"""Reel vertical style « Facebook 3D fitness » (inspiré du ref 1080x1298 de Sifeddine Camirov).

Pour chaque exercice de module : fenêtre vidéo (cles existantes, fade recette lockee),
bande de badges musculaires en haut, legende cible en bas, carte anatomique
(figures noir + vert) entre les exercices, carte finale app.

Streaming des frames vers l'encodeur (pas de grosse liste en RAM).

Usage :
  python3 faire-reel-fb.py --assets /tmp/reel --out reel.mp4
"""
import argparse
import numpy as np
import cv2
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FPS = 34
WIN_W, WIN_H = 1080, 602
WIN_Y = 460
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
WHITE = (245, 245, 245)
GOLD = (232, 190, 90)
GREY = (168, 173, 179)
GOLD_BGR = (90, 190, 232)  # cv2 dessine en BGR

BASE = "candidats"


def load(p):
    img = cv2.imread(p, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(p)
    return img


def cover_resize(img, w, h):
    ih, iw = img.shape[:2]
    s = max(w / iw, h / ih)
    nw, nh = int(iw * s + 0.5), int(ih * s + 0.5)
    img = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_AREA)
    x, y = (nw - w) // 2, (nh - h) // 2
    return img[y : y + h, x : x + w]


def content_box(img, thr=30, pad=12):
    m = img.max(axis=2) > thr
    ys, xs = np.where(m)
    if len(xs) == 0:
        return img
    y0, y1 = max(0, ys.min() - pad), min(img.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(img.shape[1], xs.max() + pad)
    return img[y0:y1, x0:x1]


def screen_blend(bg, fg):
    a = bg.astype(np.int16)
    b = fg.astype(np.int16)
    return (255 - ((255 - a) * (255 - b) // 255)).astype(np.uint8)


def text_layer(lines):
    """lines: list of (y, text, size, color). Returns RGBA full-frame overlay."""
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for y, txt, size, color in lines:
        f = ImageFont.truetype(FONT, size)
        bb = d.textbbox((0, 0), txt, font=f)
        d.text(((W - (bb[2] - bb[0])) // 2, y), txt, font=f, fill=color + (255,))
    return np.array(ov)


def composite(frame, overlay_rgba):
    a = overlay_rgba[:, :, 3:4].astype(np.float32) / 255.0
    f = frame.astype(np.float32)
    out = f * (1 - a) + overlay_rgba[:, :, :3].astype(np.float32) * a
    return out.astype(np.uint8)


def fade_segment(keys, interp=5, rep=1, hold=0.4):
    """Recette lockee : aller-retour, fondu direct entre cles denses. Frames a la taille fenetre."""
    n = len(keys)

    def seg(x, y):
        out = [keys[x]] * rep
        for s in range(1, interp + 1):
            t = s / (interp + 1)
            out.append(np.clip((1 - t) * keys[x].astype(np.float32)
                               + t * keys[y].astype(np.float32), 0, 255).astype(np.uint8))
        return out

    hold_n = max(1, int(hold * FPS))
    frames = []
    for x in range(n - 1):
        frames += seg(x, x + 1)
    frames += [keys[-1]] * hold_n
    for x in range(n - 1, 0, -1):
        frames += seg(x, x - 1)
    frames += [keys[0]] * hold_n
    # lissage temporel 3 tapes
    sm = [frames[0]]
    for i in range(1, len(frames) - 1):
        sm.append(np.clip(0.25 * frames[i - 1].astype(np.float32)
                          + 0.5 * frames[i].astype(np.float32)
                          + 0.25 * frames[i + 1].astype(np.float32), 0, 255).astype(np.uint8))
    sm.append(frames[-1])
    return sm


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--assets", required=True, help="dossier /tmp/reel (bg, badges, anat-*.png)")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    bg = cover_resize(load(a.assets + "/bg-studio.png"), W, H)

    badges = load(a.assets + "/badges.png")
    badges = content_box(badges)
    bw = W
    bh = int(badges.shape[0] * bw / badges.shape[1])
    badges = cv2.resize(badges, (bw, bh), interpolation=cv2.INTER_AREA)
    badges_y = 60
    base = bg.copy()
    base[badges_y : badges_y + bh] = screen_blend(bg[badges_y : badges_y + bh], badges)

    def brand_lines():
        return [(H - 92, "JARVIS FITNESS · MODULE 2 — ÉTIREMENTS", 28, GREY)]

    def figure_card(fig_path, label_top, label_main, nframes=34):
        fig = content_box(load(fig_path))
        fh = 1000
        fw = int(fig.shape[1] * fh / fig.shape[0])
        fig = cv2.resize(fig, (fw, fh), interpolation=cv2.INTER_AREA)
        canvas = np.zeros((H, W, 3), np.uint8)
        x0 = (W - fw) // 2
        canvas[(H - fh) // 2 : (H - fh) // 2 + fh, x0 : x0 + fw] = fig
        scr = screen_blend(base, canvas)
        ov = text_layer([
            ((H - fh) // 2 - 130, label_top, 34, GREY),
            ((H - fh) // 2 + fh + 40, label_main, 54, GOLD),
        ])
        fade = 9
        for i in range(nframes):
            if i < fade:
                al = i / fade
            elif i >= nframes - fade:
                al = (nframes - 1 - i) / fade
            else:
                al = 1.0
            f = base.astype(np.float32) * (1 - al) + scr.astype(np.float32) * al
            yield composite(f.astype(np.uint8), ov)

    def exercise_frames(ex):
        keys = [cover_resize(load(p), WIN_W, WIN_H) for p in ex["keys"]]
        frames = fade_segment(keys)
        if ex["loops"] > 1:
            frames = frames * ex["loops"]
        ov = text_layer([
            (WIN_Y + WIN_H + 58, f"{ex['num']} — {ex['name']}", 54, WHITE),
            (WIN_Y + WIN_H + 138, ex["cible"], 40, GOLD),
            *brand_lines(),
        ])
        for f in frames:
            out = base.copy()
            out[WIN_Y : WIN_Y + WIN_H] = f
            cv2.rectangle(out, (0, WIN_Y), (W - 1, WIN_Y + WIN_H - 1), GOLD_BGR, 3)
            yield composite(out, ov)

    def end_card(nframes=2 * FPS):
        ov = text_layer([
            (H // 2 - 260, "MODULE 2 — ÉTIREMENTS", 66, WHITE),
            (H // 2 - 150, "26 exercices guidés", 44, GOLD),
            (H // 2 - 80, "dans l'app JARVIS FITNESS", 44, WHITE),
            (H // 2 + 30, "Yanis & Emilie", 36, GREY),
        ])
        for i in range(nframes):
            al = min(1.0, i / 10)
            ov_faded = ov.copy()
            ov_faded[:, :, 3] = (ov_faded[:, :, 3].astype(np.float32) * al).astype(np.uint8)
            yield composite(base, ov_faded)

    exercises = [
        {
            "keys": [f"{BASE}/2026-10-16-etirement-lot1/01-encadrement-porte-{n}.png"
                     for n in ("A-muscle", "I1", "M-muscle", "I2", "M2", "I3", "B-muscle")],
            "num": "N°1", "name": "PORTE D'ENCADREMENT", "cible": "Cible : Pectoraux · Épaules",
            "fig": "anat-pecto.png", "label_top": "MUSCLES CIBLÉS", "label_main": "PECTORAUX · ÉPAULES",
            "loops": 1,
        },
        {
            "keys": [f"{BASE}/2026-10-16-etirement-lot1/02-bras-tendu-contre-le-mur-{n}.png"
                     for n in ("A-muscle", "M1-muscle", "M-v6", "M2-muscle", "B-muscle")],
            "num": "N°2", "name": "BRAS TENDU CONTRE LE MUR", "cible": "Cible : Deltoïdes · Triceps",
            "fig": "anat-epaule.png", "label_top": "MUSCLES CIBLÉS", "label_main": "ÉPAULES · BRAS",
            "loops": 2,
        },
        {
            "keys": [f"{BASE}/2026-10-16-etirement-lot6/03-flexion-avant-{n}.png"
                     for n in ("A", "I1", "M1", "I2", "M", "I3", "M2", "I4", "B")],
            "num": "N°3", "name": "FLEXION AVANT", "cible": "Cible : Ischio-jambiers · Lombaires",
            "fig": "anat-ischio.png", "label_top": "MUSCLES CIBLÉS", "label_main": "ISCHIOS · LOMBAIRES",
            "loops": 1,
        },
    ]

    def all_frames():
        for ex in exercises:
            yield from exercise_frames(ex)
            yield from figure_card(f"{a.assets}/{ex['fig']}", ex["label_top"], ex["label_main"])
        yield from end_card()

    gen = imageio_ffmpeg.write_frames(a.out, (W, H), fps=FPS, codec="libx264",
                                      output_params=["-crf", "19", "-movflags", "+faststart"])
    gen.send(None)
    count = 0
    for f in all_frames():
        gen.send(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
        count += 1
    gen.close()
    print(f"--- {a.out}: {count} frames, {count/FPS:.1f} s, {W}x{H} @ {FPS} fps")


if __name__ == "__main__":
    main()
