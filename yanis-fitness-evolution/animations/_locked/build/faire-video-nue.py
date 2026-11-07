#!/usr/bin/env python3
"""Vidéo « nue » : juste l'athlète qui fait le geste, sans aucun habillage.
Clefs denses (écarts ~15°) + 2 interpolations DIS par paire + masque de fond
statique + lissage temporel 3 tapes. Aller-retour avec micro-maintiens, en boucle.

Usage :
  python3 faire-video-nue.py --keys k0.png,k1.png,...,kN.png --size 1376x768 --fps 15 \
      --interp 2 --hold 0.5 --loops 2 --out video.mp4 [--contact sheet.png]
"""
import argparse, sys, os
import cv2, numpy as np
import imageio_ffmpeg
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fluid_gif_lib import load_resize, flow_between, intermediate, warp


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--size", default="1376x768")
    ap.add_argument("--fps", type=int, default=15)
    ap.add_argument("--interp", type=int, default=2)
    ap.add_argument("--mode", default="warp", choices=["warp", "fade"])
    ap.add_argument("--rep", type=int, default=1)
    ap.add_argument("--nosmooth", action="store_true")
    ap.add_argument("--hold", type=float, default=0.5)
    ap.add_argument("--loops", type=int, default=2)
    ap.add_argument("--out", required=True)
    ap.add_argument("--contact", default="")
    a = ap.parse_args()
    W, H = [int(v) for v in a.size.split("x")]
    keys = [load_resize(p, W, H) for p in a.keys.split(",")]
    n = len(keys)

    def flow_slow(a_img, b_img):
        ga = cv2.cvtColor(a_img, cv2.COLOR_BGR2GRAY)
        gb = cv2.cvtColor(b_img, cv2.COLOR_BGR2GRAY)
        dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
        dis.setUseSpatialPropagation(True)
        f = dis.calc(ga, gb, None)
        # médian spatial : supprime les flux aberrants qui créent les fantômes
        return cv2.medianBlur(f, 5)

    flows, masks = {}, {}
    def pair(x, y):
        k = (x, y) if x < y else (y, x)
        if k not in flows:
            i, j = k
            flows[k] = (flow_slow(keys[i], keys[j]), flow_slow(keys[j], keys[i]))
            ga = cv2.cvtColor(keys[i], cv2.COLOR_BGR2GRAY).astype(np.int16)
            gb = cv2.cvtColor(keys[j], cv2.COLOR_BGR2GRAY).astype(np.int16)
            m = (np.abs(ga - gb) > 12).astype(np.uint8)
            m = cv2.dilate(m, np.ones((15, 15), np.uint8))
            masks[k] = m[:, :, None].astype(bool)
        return flows[k], masks[k]

    def segment(x, y):
        out = [keys[x].copy()] * a.rep
        for s in range(1, a.interp + 1):
            t = s / (a.interp + 1)
            if a.mode == "warp":
                (f_ab, f_ba), mask = pair(x, y)
                if t <= 0.5:
                    fr = warp(keys[x], f_ab, t)
                else:
                    fr = warp(keys[y], f_ba, 1.0 - t)
                fr = np.where(mask, fr, keys[x]).astype(np.uint8)
            else:  # fade : fondu direct entre clés denses, aucun flux optique
                fr = np.clip((1 - t) * keys[x].astype(np.float32)
                             + t * keys[y].astype(np.float32), 0, 255).astype(np.uint8)
            out.append(fr)
        return out

    hold_n = max(1, int(a.hold * a.fps))
    frames = []
    for _ in range(a.loops):
        for x in range(n - 1):
            frames += segment(x, x + 1)
        frames += [keys[-1].copy()] * hold_n
        for x in range(n - 1, 0, -1):
            frames += segment(x, x - 1)
        frames += [keys[0].copy()] * hold_n

    if not a.nosmooth:
        sm = [frames[0]]
        for i in range(1, len(frames) - 1):
            sm.append(np.clip(0.25 * frames[i - 1].astype(np.float32)
                              + 0.5 * frames[i].astype(np.float32)
                              + 0.25 * frames[i + 1].astype(np.float32), 0, 255).astype(np.uint8))
        sm.append(frames[-1])
        frames = sm

    if a.contact:
        idx = [int(i * (len(frames) - 1) / 5) for i in range(6)]
        sel = [cv2.resize(frames[i], (W // 2, H // 2)) for i in idx]
        cv2.imwrite(a.contact, np.vstack([np.hstack(sel[:3]), np.hstack(sel[3:])]))

    gen = imageio_ffmpeg.write_frames(a.out, (W, H), fps=a.fps, codec="libx264",
                                      output_params=["-crf", "20", "-movflags", "+faststart"])
    gen.send(None)
    for f in frames:
        gen.send(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
    gen.close()
    print(f"--- {a.out}: {len(frames)} frames, {len(frames)/a.fps:.1f} s, {W}x{H} @ {a.fps} fps")


if __name__ == "__main__":
    main()
