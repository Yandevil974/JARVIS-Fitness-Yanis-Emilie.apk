#!/usr/bin/env python3
"""Mini-vidéo explicative style REEL réseaux sociaux : format vertical 9:16,
titre en haut, consignes étape par étape en bas, chrono de maintien animé.
Mouvement = clés A/M/B + interpolations DIS (flux optique), comme faire-video.py.

Usage :
  python3 faire-video-reel.py --keys a.png,m.png,b.png --crop 472 --size 576x1024 --fps 12 \
    --titre "SUSPENSION À LA BARRE" \
    --phases "0,1|1 · Saisir la barre, épaules actives;1,2|2 · Se suspendre, menton rentré;HOLD,2,3.0|MAINTIEN 30 s en séance — respiration calme;2,0|3 · Remonter contrôlé — 3 répétitions" \
    --out video.mp4
"""
import argparse, subprocess, sys, os
import cv2, numpy as np
import imageio_ffmpeg
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fluid_gif_lib import load_resize, flow_between, intermediate

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def band(text, w, h, pt, fg="white", bg="black"):
    if len(text) > 40:
        for sep in (" — ", " - ", " · "):
            if sep in text:
                i = text.rfind(sep) if text.count(sep) == 1 else text.find(sep, len(text) // 3)
                text = text[:i] + "\n" + text[i + len(sep):]
                break
    png = f"/tmp/_band_{abs(hash(text)) % 99999}.png"
    subprocess.run(["convert", "-size", f"{w}x{h}", f"xc:{bg}",
                    "-font", FONT, "-pointsize", str(pt), "-fill", fg,
                    "-gravity", "center", "-annotate", "+0+0", text, png], check=True)
    return cv2.imread(png, cv2.IMREAD_COLOR)


def put(frame, img, y, alpha=0.6):
    h = img.shape[0]
    roi = frame[y:y + h, :img.shape[1]].astype(np.float32)
    frame[y:y + h, :img.shape[1]] = (roi * (1 - alpha) + img.astype(np.float32) * alpha).astype(np.uint8)
    return frame


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--crop", type=int, required=True, help="x0 du crop vertical sur la clé 1376x768")
    ap.add_argument("--size", default="576x1024")
    ap.add_argument("--fps", type=int, default=12)
    ap.add_argument("--titre", required=True)
    ap.add_argument("--phases", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--contact", default="")
    a = ap.parse_args()
    W, H = [int(v) for v in a.size.split("x")]
    src = [load_resize(p, 1376, 768) for p in a.keys.split(",")]
    # crop vertical centré sur l'athlète puis mise à l'échelle
    cw = int(768 * W / H)
    keys = [cv2.resize(s[:, a.crop:a.crop + cw], (W, H), interpolation=cv2.INTER_AREA) for s in src]

    top_h = int(H * 0.075)
    bot_h = int(H * 0.085)
    titre = band(a.titre, W, top_h, int(top_h * 0.42), fg="yellow")

    flows = {}
    def get_flow(x, y):
        if (x, y) not in flows:
            flows[(x, y)] = (flow_between(keys[x], keys[y]), flow_between(keys[y], keys[x]))
        return flows[(x, y)]

    frames = []
    metas = []  # (texte_bas, hold_ratio ou None)
    for seg in a.phases.split(";"):
        parts = seg.split("|")
        spec, texte = parts[0], parts[1]
        bot = band(texte, W, bot_h, int(bot_h * 0.34))
        if spec.startswith("HOLD"):
            _, idx, secs, = spec.split(",")[:3]
            n = int(float(secs) * a.fps)
            for i in range(n):
                frames.append(keys[int(idx)].copy())
                metas.append((bot, 1.0 - i / max(1, n - 1)))
        else:
            x, y = [int(v) for v in spec.split(",")]
            f_ab, f_ba = get_flow(x, y)
            steps = 7
            for i in range(steps):
                t = i / steps
                fr = keys[x].copy() if i == 0 else intermediate(keys[x], keys[y], f_ab, f_ba, t)
                frames.append(fr)
                metas.append((bot, None))

    out_frames = []
    for fr, (bot, ratio) in zip(frames, metas):
        fr = put(fr, titre, 0, alpha=0.65)
        fr = put(fr, bot, H - bot_h, alpha=0.6)
        if ratio is not None:
            # pastille chrono : barre de progression + compte symbolique 30 s -> 0
            cx, cy, cw2, ch2 = W - int(W * 0.34), int(H * 0.12), int(W * 0.28), int(H * 0.035)
            cv2.rectangle(fr, (cx, cy), (cx + cw2, cy + ch2), (20, 20, 20), -1)
            cv2.rectangle(fr, (cx, cy), (cx + int(cw2 * ratio), cy + ch2), (0, 200, 255), -1)
            secs_left = int(round(30 * ratio))
            label = f"{secs_left}s"
            cv2.putText(fr, label, (cx - 56, cy + ch2 - 4),
                        cv2.FONT_HERSHEY_SIMPLEX, ch2 * 0.028, (0, 0, 0), 3)
            cv2.putText(fr, label, (cx - 58, cy + ch2 - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, ch2 * 0.028, (255, 255, 255), 2)
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
