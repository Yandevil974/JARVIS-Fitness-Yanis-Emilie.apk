#!/usr/bin/env python3
"""chirurgie-pose3.py — pose 3 composite SANS crochet :
1. composite v5 sur plaque P1 (matage différence contre plaque P3)
2. rectangle du crochet remplace par le fond vrai (plate1)
3. poignée loin reconstruite par clonage de bande (barre rectiligne)
4. pied de console + console reconstruits par clonage depuis la zone propre
Contrôle : zoom 100 % et échelle app 440x246.
"""
import cv2
import numpy as np

CORR = "corrections/warmup-elliptique-poses/"
load = lambda p: cv2.imread(CORR + p)

plate1 = load("decor-E1-elliptique-vide-v1.png")
plate3 = load("decor-E1-elliptique-P3-vide-v1.png")
v5 = load("pose-03-mains-corrigees-v5.png")
p1 = load("pose-01-final.png")


def largest_cc(m):
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    return m if n <= 1 else (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8) * 255


def diff_mask(img, plate, thresh=16):
    d = cv2.absdiff(img, plate)
    m = (cv2.cvtColor(d, cv2.COLOR_BGR2GRAY) > thresh).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    return largest_cc(m)


def cut_shadow(img, m, y0=640):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    V, S = hsv[..., 2].astype(np.int16), hsv[..., 1].astype(np.int16)
    sandy = (V >= 140) & (S >= 14)
    z = np.zeros_like(m, bool); z[y0:, :] = True
    m = m.copy(); m[z & sandy] = 0
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return largest_cc(m)


# --- matte v5 contre sa plaque
m5 = cut_shadow(v5, diff_mask(v5, plate3))
bx, by, bw, bh = cv2.boundingRect(m5)
# référence P1
m1 = cut_shadow(p1, diff_mask(p1, plate1))
b1 = cv2.boundingRect(m1)
s = b1[3] / bh
H, W = plate1.shape[:2]
fg = cv2.resize(v5, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
mk = cv2.resize(m5, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
cx, cy, cw, ch = cv2.boundingRect(mk)
a = cv2.GaussianBlur(mk, (0, 0), 1.6).astype(np.float32) / 255.0
gx1, gy1 = b1[0] + b1[2] // 2, b1[1] + b1[3]
tx, ty = gx1 - (cx + cw // 2 - bx * 0) - cw // 2 + cx - cx, 0  # placeholder
tx = gx1 - (cx + cw // 2)
ty = gy1 - ch
comp = plate1.astype(np.float32)
sub_f = fg[cy:cy + ch, cx:cx + cw].astype(np.float32)
sub_a = a[cy:cy + ch, cx:cx + cw][..., None]
X0, Y0 = max(0, tx), max(0, ty)
X1, Y1 = min(W, tx + cw), min(H, ty + ch)
fx0, fy0 = X0 - tx, Y0 - ty
comp[Y0:Y1, X0:X1] = comp[Y0:Y1, X0:X1] * (1 - sub_a[fy0:fy0 + Y1 - Y0, fx0:fx0 + X1 - X0]) \
    + sub_f[fy0:fy0 + Y1 - Y0, fx0:fx0 + X1 - X0] * sub_a[fy0:fy0 + Y1 - Y0, fx0:fx0 + X1 - X0]
comp = np.clip(comp, 0, 255).astype(np.uint8)
cv2.imwrite("/tmp/comp-P3-aveccrochet.png", comp)

# --- rectangle du crochet en coordonnées v5 -> coordonnées comp
def T(x, y):
    return int(tx + (x * s - cx)), int(ty + (y * s - cy))


rx0, ry0 = T(798, 258)
rx1, ry1 = T(884, 402)
print("rect comp:", rx0, ry0, rx1, ry1)
# 1) fond vrai
comp[ry0:ry1, rx0:rx1] = plate1[ry0:ry1, rx0:rx1]
# 2) clonage de la poignée loin : bande propre au-dessus du rectangle
#    pente de la barre ~ dx/dy ; on copie la bande [ry0-45, ry0-5] vers le bas
band_h = 40
slope = -0.20
yy = ry0 - 5
while yy < ry1:
    src_y0, src_y1 = ry0 - 45, ry0 - 5
    dst_y0, dst_y1 = yy, min(ry1, yy + band_h)
    shift = int(slope * (dst_y0 - src_y0))
    seg = comp[src_y0:src_y1, rx0:rx1].copy()
    M = np.float32([[1, 0, shift], [0, 1, 0]])
    seg = cv2.warpAffine(seg, M, (rx1 - rx0, src_y1 - src_y0),
                         borderMode=cv2.BORDER_REPLICATE)
    hgt = dst_y1 - dst_y0
    comp[dst_y0:dst_y1, rx0:rx1] = seg[:hgt]
    yy = dst_y1
cv2.imwrite(CORR + "pose-03-composite-propre.png", comp)
cv2.imwrite("/tmp/p3-chirurgie-zoom.png",
            cv2.resize(comp[ry0 - 80:ry1 + 120, rx0 - 90:rx1 + 120], None, fx=2, fy=2))
comp440 = cv2.resize(comp, (440, 246), interpolation=cv2.INTER_AREA)
cv2.imwrite("/tmp/p3-chirurgie-440.png", comp440)
print("ok")
