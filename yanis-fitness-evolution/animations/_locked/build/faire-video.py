#!/usr/bin/env python3
"""Mini-vidéo explicative d'un geste : clés A/M/B + interpolations DIS (t=0.25/0.5/0.75),
bandeau légende (accents OK via ImageMagick), encodage H.264 yuv420p (ffmpeg imageio).
Usage :
  python3 faire-video.py --keys a.png,m.png,b.png --loop 0,1,2,1 --size 880x492 --fps 12 \
      --loops 3 --caption "Texte · sous-texte" --out video.mp4
"""
import argparse, subprocess, sys, os
import cv2, numpy as np
import imageio_ffmpeg
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fluid_gif_lib import load_resize, flow_between, intermediate


def make_caption_overlay(caption, w, h):
    """Bandeau opaque noir + texte DejaVu (accents), fondu à 55 % au compositing."""
    band_h = max(34, int(h * 0.10))
    png = "/tmp/_caption_band.png"
    subprocess.run([
        "convert", "-size", f"{w}x{band_h}", "xc:black",
        "-font", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "-pointsize", str(int(band_h * 0.42)), "-fill", "white", "-gravity", "center",
        "-annotate", "+0+0", caption, png], check=True)
    ov = cv2.imread(png, cv2.IMREAD_COLOR)
    if ov is None:
        raise SystemExit("bandeau légende illisible")
    if ov.shape[0] != band_h or ov.shape[1] != w:
        ov = cv2.resize(ov, (w, band_h), interpolation=cv2.INTER_AREA)
    return ov


def blend_overlay(frame, ov, alpha=0.55):
    h, w = frame.shape[:2]
    bh = ov.shape[0]
    roi = frame[h - bh:h, 0:w, :].astype(np.float32)
    frame[h - bh:h, 0:w, :] = (roi * (1 - alpha) + ov.astype(np.float32) * alpha).astype(np.uint8)
    return frame


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--loop", required=True)
    ap.add_argument("--size", default="880x492")
    ap.add_argument("--fps", type=int, default=12)
    ap.add_argument("--loops", type=int, default=3)
    ap.add_argument("--caption", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--contact", default="")
    a = ap.parse_args()
    w, h = [int(v) for v in a.size.split("x")]
    keys = [load_resize(p, w, h) for p in a.keys.split(",")]
    seq = [int(v) for v in a.loop.split(",")]
    ov = make_caption_overlay(a.caption, w, h) if a.caption else None

    # précalcule les flows entre paires consécutives de la séquence
    flows = {}
    for i in range(len(seq) - 1):
        x, y = seq[i], seq[i + 1]
        if (x, y) not in flows:
            flows[(x, y)] = (flow_between(keys[x], keys[y]), flow_between(keys[y], keys[x]))

    frames = []
    for rep in range(a.loops):
        for i in range(len(seq) - 1):
            x, y = seq[i], seq[i + 1]
            f_ab, f_ba = flows[(x, y)]
            frames.append(keys[x].copy())
            for t in (0.25, 0.5, 0.75):
                frames.append(intermediate(keys[x], keys[y], f_ab, f_ba, t))
        # referme la boucle : dernière clé vers première
        x, y = seq[-1], seq[0]
        if (x, y) not in flows:
            flows[(x, y)] = (flow_between(keys[x], keys[y]), flow_between(keys[y], keys[x]))
        f_ab, f_ba = flows[(x, y)]
        frames.append(keys[x].copy())
        for t in (0.25, 0.5, 0.75):
            frames.append(intermediate(keys[x], keys[y], f_ab, f_ba, t))

    if ov is not None:
        frames = [blend_overlay(f, ov) for f in frames]

    if a.contact:
        sel = [frames[i] for i in range(0, len(frames), max(1, len(frames) // 6))][:6]
        sheet = np.vstack([np.hstack(sel[:3]), np.hstack(sel[3:6])])
        cv2.imwrite(a.contact, sheet)

    gen = imageio_ffmpeg.write_frames(
        a.out, (w, h), fps=a.fps, codec="libx264",
        output_params=["-pix_fmt", "yuv420p", "-crf", "21", "-movflags", "+faststart"])
    gen.send(None)
    for f in frames:
        gen.send(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
    gen.close()
    print(f"--- {a.out}: {len(frames)} frames, {len(frames)/a.fps:.1f} s, {w}x{h} @ {a.fps} fps")


if __name__ == "__main__":
    main()
