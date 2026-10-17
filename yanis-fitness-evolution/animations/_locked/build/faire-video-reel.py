#!/usr/bin/env python3
"""Mini-vidéo explicative style REEL (référence Facebook fournie par l'utilisateur :
mannequin 3D anatomique, muscle cible surligné vert, rangée de badges cochés en haut,
zoom sur la zone travaillée, format portrait feed).

Adapté à notre charte : athlète verrouillé + décor E1 conservés ; le surlignage vert
n'existe QUE dans la vidéo (clés dédiées -cible-verte), les GIF gardent la carte
musculaire dorée.

Usage :
  python3 faire-video-reel.py --keys a.png,m.png,b.png --glow b-vert.png --crop 472 \
    --size 800x960 --fps 12 --badges "DOS,EPAULES,ABDOS,BRAS" --badge-active 3,3,0,2 \
    --zoom-center 0.5,0.42 \
    --phases "0,1|1 · Saisir la barre;1,2|2 · Se suspendre;HOLD,2,3.0|MAINTIEN 30 s — respiration calme;2,0|3 · Remonter contrôlé" \
    --out video.mp4
"""
import argparse, subprocess, sys, os
import cv2, numpy as np
import imageio_ffmpeg
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fluid_gif_lib import load_resize, flow_between, intermediate

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def text_png(text, w, h, pt, fg, bg, out):
    subprocess.run(["convert", "-size", f"{w}x{h}", f"xc:{bg}",
                    "-font", FONT, "-pointsize", str(pt), "-fill", fg,
                    "-gravity", "center", "-annotate", "+0+0", text, out], check=True)
    return cv2.imread(out, cv2.IMREAD_COLOR)


def band(text, w, h, pt, fg="white", bg="black"):
    if len(text) > 40:
        for sep in (" — ", " - ", " · "):
            if sep in text:
                i = text.find(sep, len(text) // 3)
                if i < 0:
                    i = text.rfind(sep)
                text = text[:i] + "\n" + text[i + len(sep):]
                break
    return text_png(text, w, h, pt, fg, bg, f"/tmp/_band_{abs(hash(text)) % 999999}.png")


def badges_strip(labels, active, w, h):
    """Rangée de badges ronds orange + libellés + coche jaune sur le badge actif."""
    sh = h
    args = ["convert", "-size", f"{w}x{sh}", "xc:black"]
    n = len(labels)
    for i, lab in enumerate(labels):
        cx = int(w * (i + 0.5) / n)
        cy = int(sh * 0.40)
        r = int(sh * 0.24)
        col = "#ff8c00" if i == active else "#7a4a00"
        args += ["-stroke", col, "-strokewidth", "4", "-fill", "none",
                 "-draw", f"circle {cx},{cy} {cx + r},{cy}"]
        if i == active:
            args += ["-stroke", "none", "-fill", "#ffd400", "-font", FONT,
                     "-pointsize", str(int(r * 1.5)), "-gravity", "northwest",
                     "-annotate", f"+{cx - int(r * 0.42)}+{cy - int(r * 0.75)}", "✓"]
        args += ["-stroke", "none", "-fill", "white", "-font", FONT,
                 "-pointsize", str(int(sh * 0.15)), "-gravity", "northwest",
                 "-annotate", f"+{cx - int(w / n * 0.35)}+{int(sh * 0.72)}", lab]
    png = f"/tmp/_badges_{abs(hash((tuple(labels), active))) % 999999}.png"
    args.append(png)
    subprocess.run(args, check=True)
    return cv2.imread(png, cv2.IMREAD_COLOR)


def put(frame, img, y, alpha=0.6):
    h = img.shape[0]
    fh, fw = frame.shape[:2]
    iw = min(img.shape[1], fw)
    roi = frame[y:y + h, :iw].astype(np.float32)
    frame[y:y + h, :iw] = (roi * (1 - alpha) + img[:, :iw].astype(np.float32) * alpha).astype(np.uint8)
    return frame


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--glow", default="")
    ap.add_argument("--crop", type=int, required=True)
    ap.add_argument("--size", default="800x960")
    ap.add_argument("--fps", type=int, default=12)
    ap.add_argument("--badges", default="")
    ap.add_argument("--badge-active", default="")
    ap.add_argument("--zoom-center", default="0.5,0.42")
    ap.add_argument("--zoom", type=float, default=1.5)
    ap.add_argument("--phases", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--contact", default="")
    a = ap.parse_args()
    W, H = [int(v) for v in a.size.split("x")]
    src = [load_resize(p, 1376, 768) for p in a.keys.split(",")]
    cw = int(768 * W / H)
    keys = [cv2.resize(s[:, a.crop:a.crop + cw], (W, H), interpolation=cv2.INTER_AREA) for s in src]
    glow = None
    if a.glow:
        g = load_resize(a.glow, 1376, 768)
        glow = cv2.resize(g[:, a.crop:a.crop + cw], (W, H), interpolation=cv2.INTER_AREA)

    top_h = int(H * 0.11)
    bot_h = int(H * 0.095)
    labels = a.badges.split(",") if a.badges else []
    actives = [int(v) for v in a.badge_active.split(",")] if a.badge_active else []
    ux, uy = [float(v) for v in a.zoom_center.split(",")]

    flows = {}
    def get_flow(x, y):
        if (x, y) not in flows:
            flows[(x, y)] = (flow_between(keys[x], keys[y]), flow_between(keys[y], keys[x]))
        return flows[(x, y)]

    frames, metas = [], []  # metas: (bot, ratio, glow_t, zoom)
    phases = a.phases.split(";")
    for pi, seg in enumerate(phases):
        spec, texte = seg.split("|")
        bot = band(texte, W, bot_h, int(bot_h * 0.32))
        act = actives[pi] if pi < len(actives) else 0
        if spec.startswith("HOLD"):
            _, idx, secs = spec.split(",")[:3]
            n = int(float(secs) * a.fps)
            for i in range(n):
                frames.append(keys[int(idx)].copy())
                gt = min(1.0, i / max(1, int(n * 0.35)))
                metas.append((bot, 1.0 - i / max(1, n - 1), gt, True, act))
        else:
            x, y = [int(v) for v in spec.split(",")]
            f_ab, f_ba = get_flow(x, y)
            steps = 7
            for i in range(steps):
                t = i / steps
                fr = keys[x].copy() if i == 0 else intermediate(keys[x], keys[y], f_ab, f_ba, t)
                frames.append(fr)
                metas.append((bot, None, 0.0, False, act))

    out_frames = []
    for fr, (bot, ratio, gt, zoom, act) in zip(frames, metas):
        if gt > 0 and glow is not None:
            fr = np.clip(fr.astype(np.float32) * (1 - gt) + glow.astype(np.float32) * gt, 0, 255).astype(np.uint8)
        if zoom:
            zw, zh = int(W / a.zoom), int(H / a.zoom)
            x0 = int(ux * W - zw / 2); y0 = int(uy * H - zh / 2)
            x0 = max(0, min(W - zw, x0)); y0 = max(0, min(H - zh, y0))
            fr = cv2.resize(fr[y0:y0 + zh, x0:x0 + zw], (W, H), interpolation=cv2.INTER_LINEAR)
        if labels:
            strip = badges_strip(labels, act, W, top_h)
            fr = put(fr, strip, 0, alpha=0.45)
        fr = put(fr, bot, H - bot_h, alpha=0.6)
        if ratio is not None:
            cx, cy, cw2, ch2 = W - int(W * 0.34), int(H * 0.14), int(W * 0.28), int(H * 0.030)
            cv2.rectangle(fr, (cx, cy), (cx + cw2, cy + ch2), (20, 20, 20), -1)
            cv2.rectangle(fr, (cx, cy), (cx + int(cw2 * ratio), cy + ch2), (0, 200, 255), -1)
            label = f"{int(round(30 * ratio))}s"
            cv2.putText(fr, label, (cx - 56, cy + ch2 - 4), cv2.FONT_HERSHEY_SIMPLEX, ch2 * 0.030, (0, 0, 0), 3)
            cv2.putText(fr, label, (cx - 58, cy + ch2 - 6), cv2.FONT_HERSHEY_SIMPLEX, ch2 * 0.030, (255, 255, 255), 2)
        out_frames.append(fr)

    if a.contact:
        sel = [out_frames[i] for i in range(0, len(out_frames), max(1, len(out_frames) // 6))][:6]
        small = [cv2.resize(s, (W // 2, H // 2)) for s in sel]
        cv2.imwrite(a.contact, np.vstack([np.hstack(small[:3]), np.hstack(small[3:6])]))

    gen = imageio_ffmpeg.write_frames(a.out, (W, H), fps=a.fps, codec="libx264",
                                      output_params=["-crf", "21", "-movflags", "+faststart"])
    gen.send(None)
    for f in out_frames:
        gen.send(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
    gen.close()
    print(f"--- {a.out}: {len(out_frames)} frames, {len(out_frames)/a.fps:.1f} s, {W}x{H} @ {a.fps} fps")


if __name__ == "__main__":
    main()
