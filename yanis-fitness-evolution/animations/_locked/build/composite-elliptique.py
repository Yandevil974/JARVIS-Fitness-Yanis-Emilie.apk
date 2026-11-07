#!/usr/bin/env python3
"""composite-elliptique.py v3 — matage par DIFFÉRENCE contre la plaque de fond
de chaque scène (fond identique par construction), puis collage des trois phases
sur la plaque de la scène P1 : décor unique, échelle unique, ligne de sol unique.

Le crochet résiduel de pose-03 est recopié depuis la plaque P3 (vrai fond) avant
matage : aucune bavure d'inpaint dans le GIF.
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


def diff_mask(img, plate, thresh=16):
    d = cv2.absdiff(img, plate)
    m = (cv2.cvtColor(d, cv2.COLOR_BGR2GRAY) > thresh).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    return largest_cc(m)


def cut_ground_shadow(img, mask, y0=640):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    V = hsv[..., 2].astype(np.int16)
    S = hsv[..., 1].astype(np.int16)
    sandy = (V >= 140) & (S >= 14)
    zone = np.zeros_like(mask, bool)
    zone[y0:, :] = True
    mask = mask.copy()
    mask[zone & sandy] = 0
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return largest_cc(mask)


def synth_shadow(plate, cx, cy, rx, ry, strength=0.20):
    out = plate.astype(np.float32)
    yy, xx = np.mgrid[0:out.shape[0], 0:out.shape[1]].astype(np.float32)
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    a = np.clip(1 - d, 0, 1) ** 1.6 * strength
    out *= (1 - a[..., None])
    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    plate1 = load(CORR + "decor-E1-elliptique-vide-v1.png")
    plate2 = load(CORR + "decor-E1-elliptique-P2-vide-v1.png")
    plate3 = load(CORR + "decor-E1-elliptique-P3-vide-v1.png")

    # 1) pose 3 nettoyée : le crochet (pixels sombres du rectangle) remplacé par
    #    le vrai fond de la plaque P3
    p3 = load(CORR + "pose-03-mains-corrigees-v5.png")
    x0, y0, x1, y1 = 800, 262, 880, 400
    roi = p3[y0:y1, x0:x1]
    g = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    hook = (g < 100).astype(np.uint8) * 255
    hook = cv2.morphologyEx(hook, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    hook = cv2.dilate(hook, np.ones((2, 2), np.uint8))
    hf = cv2.GaussianBlur(hook, (0, 0), 1.2).astype(np.float32) / 255.0
    # ne remplace QUE le crochet, pas le pied gris de console (gris clair exclu)
    grey = (g >= 100)
    hf[grey] = 0.0
    hf = hf[..., None]
    fixed = (roi.astype(np.float32) * (1 - hf) + plate3[y0:y1, x0:x1].astype(np.float32) * hf)
    p3clean = p3.copy()
    p3clean[y0:y1, x0:x1] = np.clip(fixed, 0, 255).astype(np.uint8)
    cv2.imwrite(CORR + "pose-03-propre.png", p3clean)
    cv2.imwrite("/tmp/p3-hookzone.png",
                cv2.resize(p3clean[200:500, 640:1000], (720, 600)))

    phases = [("P1", load(CORR + "pose-01-final.png"), plate1),
              ("P2", load(CORR + "pose-02-final.png"), plate2),
              ("P3", p3clean, plate3)]
    H, W = plate1.shape[:2]
    meta = {}
    for name, img, plate in phases:
        m = diff_mask(img, plate)
        m = cut_ground_shadow(img, m)
        b = cv2.boundingRect(m)
        meta[name] = b
        cv2.imwrite(f"/tmp/key3-{name}.png", m)
        print(name, "bbox", b)

    x1_, y1_, w1_, h1_ = meta["P1"]
    ground_y = y1_ + h1_
    cx1 = x1_ + w1_ // 2
    for name, img, plate in phases:
        x, y, w, h = meta[name]
        s = h1_ / h
        fg = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        mk = cv2.resize(cv2.imread(f"/tmp/key3-{name}.png", 0), None, fx=s, fy=s,
                        interpolation=cv2.INTER_AREA)
        bx, by, bw, bh = cv2.boundingRect(mk)
        a = cv2.GaussianBlur(mk, (0, 0), 1.6).astype(np.float32) / 255.0
        cx = bx + bw // 2
        tx, ty = cx1 - (cx - bx), ground_y - bh
        out = plate1.astype(np.float32)
        sub_f = fg[by:by + bh, bx:bx + bw].astype(np.float32)
        sub_a = a[by:by + bh, bx:bx + bw][..., None]
        X0, Y0 = max(0, tx), max(0, ty)
        X1, Y1 = min(W, tx + bw), min(H, ty + bh)
        fx0, fy0 = X0 - tx, Y0 - ty
        sl = (slice(fy0, fy0 + (Y1 - Y0)), slice(fx0, fx0 + (X1 - X0)))
        out[Y0:Y1, X0:X1] = out[Y0:Y1, X0:X1] * (1 - sub_a[sl]) + sub_f[sl] * sub_a[sl]
        out = np.clip(out, 0, 255).astype(np.uint8)
        out = synth_shadow(out, cx1, ground_y - 4, int(w1_ * 0.60), 24)
        cv2.imwrite(f"/tmp/comp3-{name}.png", out)
        print(name, "composite scale %.3f pos (%d,%d)" % (s, tx, ty))


if __name__ == "__main__":
    main()
