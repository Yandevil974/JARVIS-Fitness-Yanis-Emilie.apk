#!/usr/bin/env python3
"""fluid-gif.py — GIF à mouvement fluide par interpolation optique entre poses clés.

Le protocole visuel interdit le diaporama (A-M-B-M-A figé) : le GIF doit montrer
un vrai mouvement. Ici les images intermédiaires sont CALCULÉES par flux optique
(DIS Farneback) entre deux poses clés partageant la même scène : le décor reste
identique, seuls les membres bougent, image après image.

USAGE
  python3 fluid-gif.py --keys A.png,B.png --segments "0>1:7,1>0:7" \
      --size 440x246 --delay 9 --out sortie.gif [--frames-dir DIR]

  --keys      poses clés, dans l'ordre (mêmes scène/caméra)
  --segments  boucle : liste de transitions idx>idx:nb_intermediaires
              (la pose d'arrivée d'un segment est la clé elle-même, non dupliquée)
  --delay     délai GIF en centièmes par image intermédiaire (les clés gardent
              un délai un peu plus long, --delay-key, défaut delay+4)
  --out       GIF de sortie (palette commune, -loop 0)
  --frames-dir  optionnel : y écrire aussi les images intermédiaires en PNG

Contrôle : le script affiche le nombre d'images et la durée de boucle.
"""
import argparse
import os
import subprocess
import sys

import cv2
import numpy as np


def load_resize(path, w, h):
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        sys.exit(f"FICHIER ABSENT ou illisible : {path}")
    if (img.shape[1], img.shape[0]) != (w, h):
        img = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA)
    return img


def flow_between(a, b):
    ga = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    gb = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    dis.setUseSpatialPropagation(True)
    return dis.calc(ga, gb, None)


def warp(img, flow, t):
    h, w = flow.shape[:2]
    xs, ys = np.meshgrid(np.arange(w, dtype=np.float32),
                         np.arange(h, dtype=np.float32))
    mapx = (xs + t * flow[..., 0]).astype(np.float32)
    mapy = (ys + t * flow[..., 1]).astype(np.float32)
    return cv2.remap(img, mapx, mapy, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_REPLICATE)


def intermediate(a, b, flow_ab, flow_ba, t):
    wa = warp(a, flow_ab, t)          # A avancé vers B
    wb = warp(b, flow_ba, 1.0 - t)    # B reculé vers A
    out = ((1.0 - t) * wa.astype(np.float32) + t * wb.astype(np.float32))
    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys", required=True)
    ap.add_argument("--segments", required=True)
    ap.add_argument("--size", default="440x246")
    ap.add_argument("--delay", type=int, default=9)
    ap.add_argument("--delay-key", type=int, default=None)
    ap.add_argument("--out", required=True)
    ap.add_argument("--frames-dir", default=None)
    args = ap.parse_args()

    w, h = (int(v) for v in args.size.split("x"))
    keys = [load_resize(p, w, h) for p in args.keys.split(",")]
    delay_key = args.delay_key if args.delay_key is not None else args.delay + 4

    flow_cache = {}

    def get_flow(i, j):
        pair = (i, j)
        if pair not in flow_cache:
            flow_cache[pair] = flow_between(keys[i], keys[j])
        return flow_cache[pair]

    frames = []   # (image, delay_cs)
    for seg in args.segments.split(","):
        i, rest = seg.split(">")
        j, n = rest.split(":")
        i, j, n = int(i), int(j), int(n)
        fab, fba = get_flow(i, j), get_flow(j, i)
        if not frames:
            frames.append((keys[i], delay_key))
        for s in range(1, n + 1):
            t = s / (n + 1.0)
            frames.append((intermediate(keys[i], keys[j], fab, fba, t), args.delay))
        frames.append((keys[j], delay_key))
    # dernière image = retour implicite au début de boucle : on ne duplique pas
    if len(frames) > 1 and np.array_equal(frames[-1][0], frames[0][0]):
        frames.pop()

    if args.frames_dir:
        os.makedirs(args.frames_dir, exist_ok=True)
        for k, (im, _) in enumerate(frames):
            cv2.imwrite(os.path.join(args.frames_dir, f"frame-{k:02d}.png"), im)

    tmp = subprocess.run(["mktemp", "-d"], capture_output=True, text=True).stdout.strip()
    paths = []
    for k, (im, _) in enumerate(frames):
        p = os.path.join(tmp, f"f{k:02d}.png")
        cv2.imwrite(p, im)
        paths.append(p)
    # palette commune : une seule carte de couleurs pour toute la boucle
    pal = os.path.join(tmp, "pal.png")
    subprocess.run(["convert"] + paths + ["+append", "-colors", "256", pal], check=True)
    mapped = []
    for p in paths:
        m = p.replace(".png", "-m.png")
        subprocess.run(["convert", p, "-dither", "FloydSteinberg", "-remap", pal, m],
                       check=True)
        mapped.append(m)
    cmd = ["convert"]
    for (im, d), m in zip(frames, mapped):
        cmd += ["-delay", str(d), m]
    cmd += ["-loop", "0", "-layers", "Optimize", args.out]
    subprocess.run(cmd, check=True)

    total = sum(d for _, d in frames) / 100.0
    info = subprocess.run(["identify", "-format", "%wx%h %n", args.out],
                          capture_output=True, text=True).stdout
    print(f"--- {args.out}\n    images : {info}\n    boucle : {total:.2f} s "
          f"({len(frames)} images, délai médian {args.delay} cs)")


if __name__ == "__main__":
    main()
