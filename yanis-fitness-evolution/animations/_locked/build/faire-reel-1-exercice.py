#!/usr/bin/env python3
"""Reel vertical 1 exercice, style « Facebook 3D fitness » — scène créée de zéro.

Plein cadre (pas de fenêtre), bande de badges en haut, legende en bas,
carte anatomique (figure noir + vert) puis carte finale app.

Usage :
  python3 faire-reel-1-exercice.py --keys k0,...,kN --anat figure.png --badges badges.png \
      --title "TRACTION POULIE HAUTE" --cible "Triceps · Dorsaux" --out reel.mp4
"""
import argparse
import numpy as np
import cv2
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FPS = 34
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
WHITE = (245, 245, 245)
GOLD = (232, 190, 90)
GREY = (168, 173, 179)


def load(p):
    img = cv2.imread(p, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(p)
    return img


def to_full(img):
    return cv2.resize(img, (W, H), interpolation=cv2.INTER_CUBIC)


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


def fade_segment(keys, interp=5, rep=1, hold=0.45):
    """Recette lockee : aller-retour, fondu direct entre cles denses (taille cles)."""
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
    sm = [frames[0]]
    for i in range(1, len(frames) - 1):
        sm.append(np.clip(0.25 * frames[i - 1].astype(np.float32)
                          + 0.5 * frames[i].astype(np.float32)
                          + 0.25 * frames[i + 1].astype(np.float32), 0, 255).astype(np.uint8))
    sm.append(frames[-1])
    del frames
    return sm


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--anat", required=True)
    ap.add_argument("--badges", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--cible", required=True)
    ap.add_argument("--loops", type=int, default=2)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    keys = [load(p) for p in a.keys.split(",")]

    # fond + badges en haut
    base = to_full(keys[0])
    badges = content_box(load(a.badges))
    bw = W
    bh = int(badges.shape[0] * bw / badges.shape[1])
    badges = cv2.resize(badges, (bw, bh), interpolation=cv2.INTER_AREA)
    badges_y = 50
    base[badges_y : badges_y + bh] = screen_blend(base[badges_y : badges_y + bh], badges)

    ov_ex = text_layer([
        (1560, a.title, 56, WHITE),
        (1648, f"Cible : {a.cible}", 40, GOLD),
        (1842, "JARVIS FITNESS · YANIS & EMILIE", 28, GREY),
    ])

    def exercise_frames():
        frames = fade_segment(keys)
        frames = frames * a.loops
        for i, f in enumerate(frames):
            out = to_full(f)
            out[badges_y : badges_y + bh] = screen_blend(
                out[badges_y : badges_y + bh], badges)
            out = composite(out, ov_ex)
            if i < 10:  # fondu depuis le noir
                al = i / 10
                out = (out.astype(np.float32) * al).astype(np.uint8)
            yield out

    def anat_card(nframes=FPS):
        # fond : premier key assombri + flou
        fig_bg = (to_full(keys[0]).astype(np.float32) * 0.35).astype(np.uint8)
        fig_bg = cv2.GaussianBlur(fig_bg, (0, 0), 25)
        fig = content_box(load(a.anat))
        fh = 1050
        fw = int(fig.shape[1] * fh / fig.shape[0])
        fig = cv2.resize(fig, (fw, fh), interpolation=cv2.INTER_AREA)
        canvas = np.zeros((H, W, 3), np.uint8)
        x0 = (W - fw) // 2
        y0 = (H - fh) // 2 - 60
        canvas[y0 : y0 + fh, x0 : x0 + fw] = fig
        scr = screen_blend(fig_bg, canvas)
        ov = text_layer([
            (y0 - 130, "MUSCLES CIBLÉS", 34, GREY),
            (y0 + fh + 40, a.cible.upper(), 54, GOLD),
        ])
        fade = 9
        for i in range(nframes):
            if i < fade:
                al = i / fade
            elif i >= nframes - fade:
                al = (nframes - 1 - i) / fade
            else:
                al = 1.0
            f = fig_bg.astype(np.float32) * (1 - al) + scr.astype(np.float32) * al
            yield composite(f.astype(np.uint8), ov)

    def end_card(nframes=2 * FPS):
        ov = text_layer([
            (H // 2 - 260, a.title, 62, WHITE),
            (H // 2 - 150, a.cible, 44, GOLD),
            (H // 2 - 80, "dans l'app JARVIS FITNESS", 42, WHITE),
            (H // 2 + 30, "Yanis & Emilie", 36, GREY),
        ])
        end_bg = base
        for i in range(nframes):
            al = min(1.0, i / 10)
            ov_f = ov.copy()
            ov_f[:, :, 3] = (ov_f[:, :, 3].astype(np.float32) * al).astype(np.uint8)
            yield composite(end_bg, ov_f)

    def all_frames():
        yield from exercise_frames()
        yield from anat_card()
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
