#!/usr/bin/env python3
"""faire-boucle-fluide.py — boucle GIF "vrai mouvement" à partir de poses clés.

Entre deux clés consécutives, une image intermédiaire de flou de mouvement
(interpolation optique, affichée 5 cs seulement) double la cadence de mise à
jour perçue sans ajouter de pose figée. Les clés gardent des délais courts
(10-16 cs) : on est à 8-16 images/s, pas au rythme diaporama (25-50 cs).

usage: faire-boucle-fluide.py --keys A.png,M.png,B.png --loop 0,1,2,1 \
       --size 440x246 --out out.gif [--delay-key 12 --delay-blur 5]
"""
import argparse
import subprocess

import cv2
import numpy as np

from fluid_gif_lib import flow_between, intermediate, load_resize


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--loop", required=True, help="indices de clés, ex 0,1,2,1")
    ap.add_argument("--size", default="440x246")
    ap.add_argument("--out", required=True)
    ap.add_argument("--delay-key", type=int, default=12)
    ap.add_argument("--delay-blur", type=int, default=5)
    ap.add_argument("--no-blur", action="store_true")
    a = ap.parse_args()
    w, h = (int(v) for v in a.size.split("x"))
    keys = [load_resize(p, w, h) for p in a.keys.split(",")]
    seq = [int(i) for i in a.loop.split(",")]
    frames = []
    for n, idx in enumerate(seq):
        frames.append((keys[idx], a.delay_key))
        if a.no_blur or n == len(seq) - 1:
            continue
        nxt = seq[n + 1]
        if nxt == idx:
            continue
        fab, fba = flow_between(keys[idx], keys[nxt]), flow_between(keys[nxt], keys[idx])
        frames.append((intermediate(keys[idx], keys[nxt], fab, fba, 0.5), a.delay_blur))
    if len(frames) > 1 and np.array_equal(frames[-1][0], frames[0][0]):
        frames.pop()
    import os
    tmp = subprocess.run(["mktemp", "-d"], capture_output=True, text=True).stdout.strip()
    paths, mapped = [], []
    for k, (im, _) in enumerate(frames):
        p = os.path.join(tmp, f"f{k:02d}.png")
        cv2.imwrite(p, im)
        paths.append(p)
    pal = os.path.join(tmp, "pal.png")
    subprocess.run(["convert"] + paths + ["+append", "-colors", "256", pal], check=True)
    for p in paths:
        m = p.replace(".png", "-m.png")
        subprocess.run(["convert", p, "-dither", "FloydSteinberg", "-remap", pal, m], check=True)
        mapped.append(m)
    cmd = ["convert"]
    for (im, d), m in zip(frames, mapped):
        cmd += ["-delay", str(d), m]
    cmd += ["-loop", "0", "-layers", "Optimize", a.out]
    subprocess.run(cmd, check=True)
    tot = sum(d for _, d in frames) / 100.0
    print(f"--- {a.out}: {len(frames)} images, boucle {tot:.2f} s")


if __name__ == "__main__":
    main()
