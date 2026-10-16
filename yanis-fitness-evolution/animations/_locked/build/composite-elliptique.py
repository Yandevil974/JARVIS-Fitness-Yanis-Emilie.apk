#!/usr/bin/env python3
"""composite-elliptique.py v2 — poses elliptique sur décor unique, par keying couleur.

Chaque phase (athlète + machine) est détourée au keying couleur (blanc/argent
neutre, or, gris machine, noirs), puis collée sur la plaque de décor vide à la
même échelle et sur la même ligne de sol. Ombre de contact synthétique commune :
aucun saut de décor, aucun saut d'ombre entre les images du GIF.
"""
import cv2
import numpy as np

CORR = "corrections/warmup-elliptique-poses/"


def load(p):
    return cv2.imread(p, cv2.IMREAD_COLOR)


def largest_cc(mask):
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    if n <= 1:
        return mask
    idx = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    return (lab == idx).astype(np.uint8) * 255


def fill_holes(mask):
    ff = mask.copy()
    h, w = ff.shape
    flood = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(ff, flood, (0, 0), 255)
    return mask | cv2.bitwise_not(ff)


def color_key(img):
    b, g, r = (x.astype(np.int16) for x in cv2.split(img))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    H, S, V = (x.astype(np.int16) for x in cv2.split(hsv))
    white = (S < 16) & (V > 175) & (np.abs(b - r) < 9)          # corps blanc/argent
    gold = (H >= 12) & (H <= 40) & (S > 90) & (V > 90)          # muscles dorés
    dark = (V < 110)                                            # noirs + machine
    gray = (S < 30) & (V >= 110) & (V <= 190)                   # gris machine
    m = (white | gold | dark | gray).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((13, 13), np.uint8))
    m = largest_cc(m)
    m = fill_holes(m)
    return m


def cut_ground_shadow(img, mask, y0=660, y1=None):
    """retire l'ombre portée (sable assombri) sous la machine, garde la machine"""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    V = hsv[..., 2].astype(np.int16)
    S = hsv[..., 1].astype(np.int16)
    sandy = (V >= 140) & (S >= 14)         # sable clair ou sable ombré
    zone = np.zeros_like(mask, bool)
    zone[y0:, :] = True
    mask = mask.copy()
    mask[zone & sandy] = 0
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return largest_cc(mask)


def synth_shadow(plate, cx, cy, rx, ry, strength=0.22):
    out = plate.astype(np.float32)
    yy, xx = np.mgrid[0:out.shape[0], 0:out.shape[1]].astype(np.float32)
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    a = np.clip(1 - d, 0, 1) ** 1.6 * strength
    out *= (1 - a[..., None])
    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    plate = load(CORR + "decor-E1-elliptique-vide-v1.png")
    phases = [("P1", "pose-01-final.png"),
              ("P2", "pose-02-final.png"),
              ("P3", "pose-03-propre.png")]
    H, W = plate.shape[:2]
    comps, meta = {}, {}
    for name, f in phases:
        img = load(CORR + f)
        m = color_key(img)
        m = cut_ground_shadow(img, m)
        x, y, w, h = cv2.boundingRect(m)
        meta[name] = (x, y, w, h)
        cv2.imwrite(f"/tmp/key-{name}.png", m)
        comps[name] = (img, m)
        print(name, "bbox", (x, y, w, h))

    # échelle/position de référence : P1
    x1, y1, w1, h1 = meta["P1"]
    ground_y = y1 + h1
    cx1 = x1 + w1 // 2
    for name, (img, m) in comps.items():
        x, y, w, h = meta[name]
        s = h1 / h
        nw, nh = int(round(w * s)), int(round(h * s))
        fg = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        mk = cv2.resize(m, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        a = cv2.GaussianBlur(mk, (0, 0), 2.0).astype(np.float32) / 255.0
        bx, by, bw, bh = cv2.boundingRect(mk)
        cx = bx + bw // 2
        tx = cx1 - (cx - bx)
        ty = ground_y - bh
        out = plate.astype(np.float32)
        sub_f = fg[by:by + bh, bx:bx + bw].astype(np.float32)
        sub_a = a[by:by + bh, bx:bx + bw][..., None]
        X0, Y0 = max(0, tx), max(0, ty)
        X1, Y1 = min(W, tx + bw), min(H, ty + bh)
        fx0, fy0 = X0 - tx, Y0 - ty
        out[Y0:Y1, X0:X1] = out[Y0:Y1, X0:X1] * (1 - sub_a[fy0:fy0 + (Y1 - Y0), fx0:fx0 + (X1 - X0)]) \
            + sub_f[fy0:fy0 + (Y1 - Y0), fx0:fx0 + (X1 - X0)] * sub_a[fy0:fy0 + (Y1 - Y0), fx0:fx0 + (X1 - X0)]
        out = np.clip(out, 0, 255).astype(np.uint8)
        # ombre de contact synthétique identique pour toutes les phases
        out = synth_shadow(out, cx1, ground_y - 6, int(w1 * 0.62), 26)
        cv2.imwrite(f"/tmp/comp-{name}.png", out)
        print(name, "composite ok, scale %.3f" % s)


if __name__ == "__main__":
    main()
