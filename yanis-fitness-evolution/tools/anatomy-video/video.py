"""Animation complète : « Extension triceps à la poulie ».

Génère les trames 3D, les incrustations (badges musculaires, consignes) puis
encode le MP4 H.264 vertical utilisé par l'application.
"""
from __future__ import annotations

import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from engine3d import Camera, to_image
from human import skeleton
from scene import PULLEY, background_for, render_frame
from anatomy_badge import build_badges

W, H = 900, 1124  # hauteur paire (exigence H.264 yuv420p)
FPS = 24
DURATION = 11.5
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# Plans : (nom, caméra, temps de début, temps de fin)
SHOTS = [
    ("front", (3.35, 1.42, 2.55), (0.40, 0.96, -0.02), 34.0, 0.0, 4.9),
    ("side", (0.62, 1.44, 3.35), (0.40, 1.06, 0.02), 34.0, 4.9, 7.8),
    ("back", (-2.10, 1.40, 1.48), (0.22, 1.04, 0.10), 34.0, 7.8, 10.3),
    ("front", (3.35, 1.42, 2.55), (0.40, 0.96, -0.02), 34.0, 10.3, DURATION),
]


def ease_in_out(t):
    t = min(max(t, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * t)


def shot_at(time):
    for name, eye, target, fov, t0, t1 in SHOTS:
        if t0 <= time < t1:
            return name, eye, target, fov, (time - t0) / (t1 - t0)
    return SHOTS[-1][0], SHOTS[-1][1], SHOTS[-1][2], SHOTS[-1][3], 1.0


def rep_phase(time):
    """0 = bras fléchis (étirement), 1 = extension complète."""
    if time < 1.9:
        return 0.0, 0.0
    t = time - 1.9
    period = 2.05
    k = int(t // period)
    local = (t % period) / period
    if local < 0.42:  # concentrique
        u = ease_in_out(local / 0.42)
        phase = u
        power = 1.0
    elif local < 0.52:  # tenue en extension
        phase = 1.0
        power = 1.0
    elif local < 0.94:  # excentrique contrôlé
        u = ease_in_out((local - 0.52) / 0.42)
        phase = 1.0 - u
        power = 0.85
    else:  # courte pause en bas
        phase = 0.0
        power = 0.55
    return phase, power


def pose_at(time):
    phase, power = rep_phase(time)
    elbow = 52.0 + 104.0 * phase
    lean = 9.0 - 2.2 * phase
    bob = -0.012 * (1 - phase) + 0.004 * math.sin(time * 2.1)
    return {
        "elbow": elbow,
        "lean": lean,
        "bob": bob,
        "phase": phase,
        "power": power,
    }


# --------------------------------------------------------------- badges -----
def _arm_icon(size, active=1.0, secondary=False):
    """Petit diagramme de bras (vue postérieure) rendu en supersampling."""
    S = size * 3
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    def P(u, v):
        return (u * S, v * S)

    skin = (196, 166, 138, 255)
    skin_dark = (150, 122, 98, 255)
    # avant-bras (part du coude vers le bas-droite)
    d.polygon([P(0.52, 0.56), P(0.72, 0.62), P(0.80, 0.94), P(0.58, 0.92)], fill=skin)
    d.polygon([P(0.52, 0.56), P(0.58, 0.92), P(0.50, 0.90), P(0.45, 0.60)], fill=skin_dark)
    # bras (épaule → coude)
    d.polygon([
        P(0.28, 0.14), P(0.62, 0.10), P(0.74, 0.22), P(0.74, 0.42),
        P(0.66, 0.56), P(0.52, 0.58), P(0.34, 0.50), P(0.26, 0.34),
    ], fill=skin)
    # galbe interne
    d.polygon([P(0.28, 0.14), P(0.34, 0.50), P(0.52, 0.58), P(0.42, 0.34),
               P(0.36, 0.18)], fill=skin_dark)
    # deltoïde
    d.ellipse([P(0.30, 0.02), P(0.74, 0.30)],
              fill=(214, 146, 66, 255) if secondary else skin)
    d.arc([P(0.30, 0.02), P(0.74, 0.30)], start=200, end=340,
          fill=(238, 206, 172, 255), width=max(2, int(S * 0.010)))
    # trois chefs du triceps (tons rouges)
    bellies = [
        [P(0.38, 0.19), P(0.46, 0.50), 0.11],
        [P(0.58, 0.20), P(0.61, 0.47), 0.10],
        [P(0.48, 0.45), P(0.52, 0.57), 0.09],
    ]
    for i, (a, b, rr) in enumerate(bellies):
        lvl = min(1.0, max(0.0, active)) * (1.0 - 0.12 * i)
        col = (int(150 + 100 * lvl), int(46 - 24 * lvl), int(38 - 22 * lvl), 255)
        d.ellipse([min(a[0], b[0]) - rr * S, min(a[1], b[1]) - S * 0.02,
                   max(a[0], b[0]) + rr * S, max(a[1], b[1]) + S * 0.03], fill=col)
        if i < 2:  # séparation des fibres
            xx = (a[0] + b[0]) / 2
            d.line([(xx, min(a[1], b[1]) + S * 0.01), (xx, max(a[1], b[1]) - S * 0.01)],
                   fill=(120, 26, 24, 210), width=max(1, int(S * 0.008)))
    # brachioradial
    d.polygon([P(0.55, 0.60), P(0.68, 0.64), P(0.74, 0.86), P(0.60, 0.82)],
              fill=(206, 132, 52, 255) if secondary else (186, 154, 126, 255))
    # olécrâne + reflet
    d.ellipse([P(0.47, 0.53), P(0.55, 0.61)], fill=(226, 194, 160, 255))
    d.arc([P(0.33, 0.10), P(0.72, 0.52)], start=200, end=320,
          fill=(240, 208, 174, 210), width=max(2, int(S * 0.012)))
    return im.resize((size, size), Image.LANCZOS)


_BADGES = None


def _badge_images(icon_w, icon_h):
    global _BADGES
    if _BADGES is None or _BADGES[0] != (icon_w, icon_h):
        _BADGES = ((icon_w, icon_h), build_badges(size=(icon_w, icon_h)))
    return _BADGES[1]


def draw_badges(canvas, time, alpha, rep=0.0):
    """Quatre badges type « planche anatomique » en haut de l'image."""
    if alpha <= 0.01:
        return canvas
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d0 = ImageDraw.Draw(overlay)
    n = 4
    total_w = W * 0.94
    gap = total_w * 0.022
    bw = (total_w - gap * (n - 1)) / n
    bh = bw * 1.24
    y = H * 0.022
    x_start = (W - total_w) / 2
    titles = [("TRICEPS", "CHEF LONG"), ("TRICEPS", "LATÉRAL"),
              ("TRICEPS", "MÉDIAL"), ("SECONDAIRES", "DELTOÏDE + AVANT-BRAS")]
    # libellés courts : la carte n'affiche jamais de texte tronqué
    short = ["CHEF LONG", "LATÉRAL", "MÉDIAL", "DELTOÏDE + AVANT-BRAS"]
    for i in range(n):
        x = x_start + i * (bw + gap)
        pulse = 1.0 + (0.035 if (i < 3 and rep > 0.35) else 0.0)
        cx, cy = x + bw / 2, y + bh / 2
        card = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(card)
        box = [x, y, x + bw, y + bh]
        d.rounded_rectangle(box, radius=int(bw * 0.14), fill=(9, 11, 15, 236),
                            outline=(104, 116, 134, 130), width=2)
        # anneau de progression (synchronisé avec la répétition)
        rr = bw * 0.335
        ring_c = (cx, y + bh * 0.405)
        d.ellipse([ring_c[0] - rr, ring_c[1] - rr, ring_c[0] + rr, ring_c[1] + rr],
                  outline=(46, 52, 62, 255), width=max(2, int(bw * 0.016)))
        start = 208
        sweep = 124 * min(1.0, max(0.0, rep))
        if sweep > 1:
            d.arc([ring_c[0] - rr, ring_c[1] - rr, ring_c[0] + rr, ring_c[1] + rr],
                  start=start, end=start + sweep, fill=(255, 168, 62, 255),
                  width=max(3, int(bw * 0.026)))
        icon_w = int(bw * 0.86)
        icon_h = int(bh * 0.66)
        icons = _badge_images(icon_w, icon_h)
        icon = icons[i]
        # masque arrondi pour fondre l'illustration dans la carte
        rmask = Image.new("L", icon.size, 0)
        ImageDraw.Draw(rmask).rounded_rectangle([0, 0, icon.width - 1, icon.height - 1],
                                                radius=int(icon.width * 0.10), fill=255)
        card.paste(icon, (int(cx - icon.width / 2), int(y + bh * 0.045)), rmask)
        # pastille numérotée
        px, py = x + bw * 0.815, y + bh * 0.115
        pr = bw * 0.105
        d.ellipse([px - pr, py - pr, px + pr, py + pr],
                  fill=(255, 198, 66, 255) if i < 3 else (232, 142, 54, 255))
        fnum = ImageFont.truetype(FONT_B, int(bw * 0.135))
        tw = d.textlength(str(i + 1), font=fnum)
        d.text((px - tw / 2, py - bw * 0.072), str(i + 1), font=fnum,
               fill=(26, 18, 8, 255))
        # libellés sur deux lignes
        f1 = ImageFont.truetype(FONT_R, int(bw * 0.100))
        t1, t2 = titles[i]
        if i == 3:
            t1 = "SECONDAIRES"
        w1 = d.textlength(t1, font=f1)
        d.text((cx - w1 / 2, y + bh * 0.745), t1, font=f1, fill=(180, 189, 204, 255))
        size2 = int(bw * 0.115)
        f2 = ImageFont.truetype(FONT_B, size2)
        while d.textlength(short[i], font=f2) > bw * 0.88 and size2 > 9:
            size2 -= 1
            f2 = ImageFont.truetype(FONT_B, size2)
        w2 = d.textlength(short[i], font=f2)
        d.text((cx - w2 / 2, y + bh * 0.805), short[i], font=f2,
               fill=(240, 243, 248, 255))
        if alpha < 0.999:
            a = card.split()[3].point(lambda p: int(p * alpha))
            card.putalpha(a)
        overlay = Image.alpha_composite(overlay, card)
    return Image.alpha_composite(canvas.convert("RGBA"), overlay)


REPS_TOTAL = 4
REP_PERIOD = 2.05
REP_START = 1.9


def draw_highlight_card(canvas, time):
    """Carton d'ouverture : planche anatomique complète + rôle des muscles."""
    a = 1.0
    if time < 0.25:
        a = time / 0.25
    if time > 1.35:
        a = max(0.0, 1 - (time - 1.35) / 0.45)
    if a <= 0.01:
        return canvas
    # voile sombre derrière la planche pour la détacher de la scène
    dim = Image.new("RGBA", canvas.size, (4, 5, 8, int(190 * min(1.0, a * 1.6))))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), dim)
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    pw, ph = int(W * 0.56), int(W * 0.56 * 1.10)
    px, py = (W - pw) // 2, int(H * 0.205)
    d.rounded_rectangle([px - 10, py - 10, px + pw + 10, py + ph + 10], radius=26,
                        fill=(9, 11, 15, 240), outline=(255, 164, 56, 190), width=3)
    plate = _highlight_plate((pw, ph))
    overlay.alpha_composite(plate, (px, py))
    f = ImageFont.truetype(FONT_B, 24)
    txt = "PLANCHE ANATOMIQUE · MUSCLES SOLLICITÉS"
    tw = d.textlength(txt, font=f)
    d.text(((W - tw) / 2, py + ph + 26), txt, font=f, fill=(246, 247, 251, 255))
    f2 = ImageFont.truetype(FONT_R, 20)
    sub = "Rouge : triceps brachial (3 chefs)   ·   Orange : deltoïde antérieur, brachioradial"
    tw2 = d.textlength(sub, font=f2)
    d.text(((W - tw2) / 2, py + ph + 60), sub, font=f2, fill=(196, 203, 214, 255))
    if a < 0.999:
        ov = overlay.split()[3].point(lambda p: int(p * a))
        overlay.putalpha(ov)
    return Image.alpha_composite(canvas.convert("RGBA"), overlay)


_PLATE = None


def _highlight_plate(size):
    """Planche complète (torse + bras) avec les muscles colorés."""
    global _PLATE
    if _PLATE is not None and _PLATE[0] == size:
        return _PLATE[1]
    from anatomy_badge import build_highlight_plate
    _PLATE = (size, build_highlight_plate(size))
    return _PLATE[1]


def draw_rep_counter(canvas, time):
    """Compteur de répétitions 1..4 + état de la phase en cours."""
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    if time < REP_START:
        return canvas
    t = time - REP_START
    rep = min(REPS_TOTAL, int(t // REP_PERIOD) + 1)
    local = (t % REP_PERIOD) / REP_PERIOD
    phase = "concentrique" if local < 0.42 else "excentrique" if local < 0.94 else "pause"
    x0 = W * 0.045
    y = H * 0.845
    f = ImageFont.truetype(FONT_B, 20)
    label = f"RÉPÉTITION {rep}/{REPS_TOTAL}"
    d.rounded_rectangle([x0, y, x0 + 200, y + 40], radius=20,
                        fill=(9, 11, 15, 220), outline=(255, 160, 50, 170), width=2)
    d.text((x0 + 15, y + 9), label, font=f, fill=(246, 247, 251, 255))
    f2 = ImageFont.truetype(FONT_R, 17)
    d.text((x0 + 214, y + 11), phase, font=f2, fill=(196, 203, 214, 255))
    # trait de progression de la phase
    d.rectangle([x0 + 214, y + 34, x0 + 214 + 120, y + 37], fill=(52, 58, 70, 255))
    d.rectangle([x0 + 214, y + 34, x0 + 214 + int(120 * min(1.0, max(0.0, local))), y + 37],
                fill=(255, 160, 50, 255))
    return Image.alpha_composite(canvas.convert("RGBA"), overlay)


def draw_phase_label(canvas, text, sub=None, accent=(255, 166, 60)):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    f = ImageFont.truetype(FONT_B, 27)
    fs = ImageFont.truetype(FONT_R, 21)
    tw = d.textlength(text, font=f)
    pad = 20
    y = H * 0.735
    d.rounded_rectangle([W / 2 - tw / 2 - pad, y, W / 2 + tw / 2 + pad, y + 46],
                        radius=23, fill=(10, 12, 16, 210),
                        outline=accent + (170,), width=2)
    d.text((W / 2 - tw / 2, y + 10), text, font=f, fill=(245, 246, 250, 255))
    if sub:
        ss = ImageFont.truetype(FONT_R, 20)
        tws = d.textlength(sub, font=ss)
        d.text((W / 2 - tws / 2, y + 58), sub, font=ss, fill=(206, 212, 222, 255))
    return Image.alpha_composite(canvas.convert("RGBA"), overlay)


def draw_title(canvas, muscle, name, alpha=1.0):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    x0 = W * 0.045
    x1 = W * 0.60
    y = H * 0.985
    # dégradé noir vers le bas pour asseoir le titre
    grad = Image.new("L", (1, 220), 0)
    for i in range(220):
        grad.putpixel((0, i), int(190 * (i / 219) ** 1.5))
    grad = grad.resize((W, 220))
    band = Image.new("RGBA", (W, 220), (4, 5, 8, 255))
    band.putalpha(grad)
    overlay.alpha_composite(band, (0, H - 220))
    d = ImageDraw.Draw(overlay)
    f0 = ImageFont.truetype(FONT_B, 19)
    d.text((x0, y - 92), muscle, font=f0, fill=(255, 172, 66, 255))
    f1 = ImageFont.truetype(FONT_B, 33)
    d.text((x0 - 2, y - 66), name, font=f1, fill=(246, 247, 251, 255))
    f2 = ImageFont.truetype(FONT_R, 16)
    d.text((x0, y - 22), "Coudes collés au corps · extension complète · retour contrôlé",
           font=f2, fill=(176, 184, 196, 255))
    # filet accent
    d.rectangle([x0, y - 100, x0 + 46, y - 96], fill=(255, 160, 50, 255))
    if alpha < 0.999:
        a = overlay.split()[3].point(lambda p: int(p * alpha))
        overlay.putalpha(a)
    return Image.alpha_composite(canvas.convert("RGBA"), overlay)


def vignette(img):
    arr = np.asarray(img, dtype=np.float32) / 255.0
    yy, xx = np.mgrid[0:H, 0:W]
    nx = (xx - W / 2) / (W / 2)
    ny = (yy - H / 2) / (H / 2)
    r = np.sqrt(nx * nx + ny * ny) / 1.414
    v = np.clip(1.05 - 0.42 * r ** 2.2, 0, 1)[:, :, None]
    arr = arr * v
    # légère courbe de contraste
    arr = np.clip((arr - 0.5) * 1.06 + 0.5, 0, 1)
    return Image.fromarray((arr * 255).astype(np.uint8), "RGB")


def compose_frame(arr, time):
    img = to_image(arr, exposure=1.30).convert("RGB")
    img = vignette(img)
    phase, power = rep_phase(time)
    # titre + badges (apparition en fondu)
    t_in = min(1.0, max(0.0, (time - 0.15) / 0.8))
    img = draw_title(img, "TRICEPS · POULIE HAUTE", "Extension triceps à la poulie", t_in)
    img = draw_badges(img, time, t_in, rep=phase)
    img = draw_highlight_card(img, time)
    # compteur de répétitions pendant la démonstration
    if 2.0 <= time < 10.2:
        img = draw_rep_counter(img, time)
    if time > 10.35:
        img = draw_phase_label(img, "MUSCLES SOLLICITÉS",
                               "Triceps brachial (principal) · deltoïde antérieur, brachioradial (secondaires)", accent=(120, 200, 255))
    # fondus d'ouverture / fermeture (transition propre dans le lecteur)
    fade = min(1.0, time / 0.35, max(0.0, (DURATION - time) / 0.5))
    if fade < 0.999:
        img = Image.fromarray(
            (np.asarray(img.convert("RGB"), dtype=np.float32) * fade).astype(np.uint8), "RGB")
    return img.convert("RGB")


def main(out_mp4, poster=None):
    cams = {}
    bgs = {}
    for name, eye, target, fov, t0, t1 in SHOTS:
        if name in cams:
            continue
        cam = Camera(eye, target, fov=fov, width=W, height=H)
        cams[name] = cam
        info = skeleton(pose_at(0.0))
        print(f"[bg] {name}", flush=True)
        bgs[name] = background_for(cam, info, blur=1.8)
    # fond dédié au carton final (plan large)
    ffmpeg = os.environ.get("FFMPEG") or _ffmpeg()
    cmd = [
        ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", "-pix_fmt", "yuv420p", "-profile:v", "main", "-level", "4.0",
        "-movflags", "+faststart", out_mp4,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n_frames = int(round(DURATION * FPS))
    for i in range(n_frames):
        time = i / FPS
        name, eye, target, fov, local = shot_at(time)
        cam = cams[name]
        pose = pose_at(time)
        glow = 0.75 + 0.5 * pose["power"] * (0.4 + 0.6 * pose["phase"])
        bg, depth = bgs[name]
        arr, _, info = render_frame(cam, bg, depth, pose, glow=glow)
        img = compose_frame(arr, time)
        proc.stdin.write(img.tobytes())
        if poster and i == int(2.70 * FPS):
            img.save(poster, quality=90)
        if i % 24 == 0:
            print(f"[frame] {i}/{n_frames}", flush=True)
    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise SystemExit("ffmpeg a échoué")
    print("OK", out_mp4, os.path.getsize(out_mp4), "octets")


def _ffmpeg():
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    default_out = os.path.abspath(
        os.path.join(base, "..", "..", "public", "media", "video", "extension-triceps-poulie.mp4")
    )
    out = sys.argv[1] if len(sys.argv) > 1 else default_out
    os.makedirs(os.path.dirname(out), exist_ok=True)
    poster = os.path.splitext(out)[0] + "-poster.jpg"
    main(out, poster)
