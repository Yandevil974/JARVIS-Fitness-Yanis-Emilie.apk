#!/usr/bin/env python3
"""Genere l'animation du developpe couche (bench press) a partir de :
  - une image SOURCE (l'athlete, barre au sternum)
  - une image CIBLE IA (le meme athlete, barre au lockout, bras tendus)

Principe : morphing MLS (Moving Least Squares, similarite, Schaefer 2006) a
source unique.  Une seule image est reechantillonnee : il est donc
STRUCTURELLEMENT impossible de voir un double contour (fantome de barre).

La barre n'est PAS reechantillonnee : elle est composee comme une COUCHE
RIGIDE (recadrage + translation) a partir de l'image source.  Sa rigidite est
donc garantie au pixel pres, quelle que soit la deformation du reste.

Le "creux" laisse par la barre en montant est rempli avec le contenu reel de
l'image cible (la poitrine, que l'IA a bien rendue), ce qui evite tout
etirement visible.

Groupes de controle MLS :
  0 = bras     : correspondances issues du flux optique dense (DIS)
  1 = statique : corps au repos + decor (identite)
"""

import argparse
import os
import subprocess
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bench_mls import mls_similarity  # noqa: E402


# ---------------------------------------------------------------------------
# Utilitaires
# ---------------------------------------------------------------------------
def extend_top(img, H):
    """Etend le cadre vers le haut (bande d'eau) pour degager la barre."""
    if H <= 0:
        return img
    W = img.shape[1]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark = (gray < 75).sum(axis=1)
    rows = np.where(dark[:int(img.shape[0] * 0.30)] > 100)[0]
    K = int(rows[0]) - 3 if len(rows) else 130
    K = int(np.clip(K, 24, 140))
    strip = img[:K]
    hsv = cv2.cvtColor(strip, cv2.COLOR_BGR2HSV)
    veg = ((hsv[..., 1] > 50) & (hsv[..., 0] >= 12) & (hsv[..., 0] <= 100)).astype(np.uint8)
    veg = cv2.dilate(veg, np.ones((5, 15), np.uint8))
    clean = ~veg.any(axis=0)
    best = (0, 0, 0)
    run = 0
    start = 0
    for x in range(W):
        if clean[x]:
            if run == 0:
                start = x
            run += 1
            if run > best[0]:
                best = (run, start, x + 1)
        else:
            run = 0
    if best[0] < 60:
        best = (W, 0, W)
    c0, c1 = best[1], best[2]
    patch = strip[:, c0:c1]
    # repetition miroir : le raccord est continu (ligne 43 -> ligne 43 -> ...)
    p = np.vstack([patch, patch[::-1]])
    reps_y = int(np.ceil(H / float(p.shape[0])))
    reps_x = int(np.ceil(W / float(patch.shape[1])))
    band = np.tile(p, (reps_y, reps_x, 1))[:H, :W]
    band = cv2.GaussianBlur(band, (0, 0), 1.6)
    out = np.vstack([band, img]).astype(np.float32)
    nb = 16
    for k in range(nb):
        w = (k + 1) / float(nb)
        out[H - 1 - k] = (1 - w) * band[H - 1 - k] + w * img[0]
    return out.astype(np.uint8)


def ease_cos(u):
    """Easing cosinus : demarrage/arret progressifs."""
    return 0.5 - 0.5 * np.cos(np.pi * u)


# ---------------------------------------------------------------------------
# Detection
# ---------------------------------------------------------------------------
def detect_plate(img):
    """Masque de la plaque de charge (disque sombre en haut de l'image)."""
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = g.shape
    m = (g < 75).astype(np.uint8) * 255
    m[int(h * 0.42):, :] = 0
    m[:, :int(w * 0.40)] = 0
    m[:, int(w * 0.63):] = 0
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    if n < 2:
        return np.zeros((h, w), np.uint8), None
    i = max(range(1, n), key=lambda k: stats[k][4])
    if stats[i][4] < 5000:
        return np.zeros((h, w), np.uint8), None
    return (lab == i).astype(np.uint8), stats[i]


def detect_body(img):
    """Masque de l'athlete (peau argentee + muscles dore) dans la zone du buste."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    Hh, Ss, Vv = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
    skin = (Vv > 140) & (Ss < 70)
    gold = (Hh >= 8) & (Hh <= 35) & (Ss > 110) & (Vv > 110)
    body = (skin | gold).astype(np.uint8)
    body[:int(hsv.shape[0] * 0.16), :] = 0
    body[int(hsv.shape[0] * 0.60):, :] = 0
    body[:, :int(img.shape[1] * 0.45)] = 0
    body[:, int(img.shape[1] * 0.68):] = 0
    body = cv2.morphologyEx(body, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    body = cv2.morphologyEx(body, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    return body


def feather(mask, r=6):
    """Masque binaire -> masque adouci (alpha 0..1)."""
    a = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), r)
    return np.clip(a, 0, 1)


# ---------------------------------------------------------------------------
# Decomposition source = fond + barre
# ---------------------------------------------------------------------------
def build_layers(src, tgt, plate_mask, fill_shift=22):
    """Retourne (clean_src, plate_rgba, delta).

    clean_src : la source ou la zone occupee par la plaque est remplacee par
                le contenu de la cible (la poitrine) : c'est ce qui sera
                revele quand la barre monte.
    plate_rgba : la plaque en couche rigide (pixels + alpha).
    delta      : le deplacement rigide de la plaque.
    """
    H, W = src.shape[:2]
    pm = plate_mask > 0
    alpha = feather(plate_mask, 5)

    # --- couche plaque (pixels d'origine + alpha) --------------------------
    plate_rgb = src.copy()
    plate_alpha = alpha.copy()

    # --- remplissage du creux avec le contenu de la cible ------------------
    shifted = np.roll(tgt, fill_shift, axis=0)
    fill = shifted.copy()
    if fill_shift:
        fill[:fill_shift] = tgt[:1]
    clean = src.astype(np.float32) * (1 - alpha[..., None]) + fill.astype(np.float32) * alpha[..., None]
    clean = clean.astype(np.uint8)
    # raccord doux en bas de la zone (le contenu cible est legerement decale)
    bot = np.zeros((H, W), np.float32)
    ys = np.where(pm.any(axis=1))[0]
    if len(ys):
        bot[ys.max():min(H, ys.max() + 40)] = 1.0
        ramp = np.linspace(1.0, 0.0, min(40, H - ys.max()), dtype=np.float32)[:, None]
        m = ramp * bot[ys.max():min(H, ys.max() + 40)]
        reg = slice(ys.max(), ys.max() + m.shape[0])
        clean[reg] = (src[reg].astype(np.float32) * m[..., None]
                      + clean[reg].astype(np.float32) * (1 - m[..., None])).astype(np.uint8)
    return clean, plate_rgb, plate_alpha


# ---------------------------------------------------------------------------
def build_control_points(src, clean, plate_mask, body_mask, flow, rng):
    """Points de controle MLS : (C, C2, groups)."""
    H, W = src.shape[:2]
    fx, fy = flow[..., 0], flow[..., 1]

    # le deplacement rigide de la plaque = mediane du flux sur la plaque
    pm = plate_mask > 0
    if pm.sum() > 50:
        dx = float(np.median(fx[pm]))
        dy = float(np.median(fy[pm]))
    else:
        dx = dy = 0.0
    print("  barre : deplacement rigide (%+.1f, %+.1f)" % (dx, dy))

    # flux lisse pour isoler le bras
    fxs = cv2.GaussianBlur(fx, (41, 41), 0)
    fys = cv2.GaussianBlur(fy, (41, 41), 0)
    mag = np.sqrt(fxs ** 2 + fys ** 2)

    C, C2, gid = [], [], []

    # --- groupe 0 : le bras (la ou le flux est significatif) --------------
    bm = (body_mask > 0) & (plate_mask == 0)
    arm = bm & (mag > 28)
    arm = cv2.dilate(arm.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
    ys, xs = np.where(arm)
    if len(xs):
        sel = rng.choice(len(xs), min(340, len(xs)), replace=False)
        for i in sel:
            x, y = xs[i], ys[i]
            C.append((x, y))
            C2.append((x + fxs[y, x], y + fys[y, x]))
            gid.append(0)
    print("  points bras : %d" % len(xs))

    # --- groupe 1 : statique (corps au repos + decor) ---------------------
    step = 18
    for y in range(0, H, step):
        for x in range(0, W, step):
            if arm[y, x] or pm[y, x]:
                continue
            C.append((x, y))
            C2.append((x, y))
            gid.append(1)

    C = np.array(C, dtype=np.float64)
    C2 = np.array(C2, dtype=np.float64)
    groups = np.array(gid, dtype=np.int64)
    print("  points de controle : %d  (bras %d / statique %d)"
          % (len(C), (groups == 0).sum(), (groups == 1).sum()))
    return C, C2, groups, (dx, dy)


def motion_mask(shape, plate_mask, body_mask, fade=60):
    h, w = shape
    m = np.zeros((h, w), np.float32)
    m[plate_mask > 0] = 1.0
    m[body_mask > 0] = 1.0
    m = cv2.dilate(m, np.ones((3, 3), np.uint8))
    k = int(fade) | 1
    return cv2.blur(m, (k, k))


# ---------------------------------------------------------------------------
def render_frame(clean, plate_rgb, plate_alpha, C, C2, groups, t, mmask,
                 kappa, neigh, roi, delta, plate_scale=1.0):
    x0, y0, x1, y1 = roi
    Ct = C + t * (C2 - C)
    field = mls_similarity(Ct, C, groups=groups, kappa=kappa, neigh=neigh)
    hh, ww = y1 - y0, x1 - x0
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    pts = np.stack([xx.ravel(), yy.ravel()], 1)
    mp = field(pts).reshape(hh, ww, 2)
    warped = cv2.remap(clean, mp[..., 0], mp[..., 1], cv2.INTER_CUBIC,
                       borderMode=cv2.BORDER_REPLICATE)
    out = clean.copy()
    w = mmask[y0:y1, x0:x1][..., None]
    out[y0:y1, x0:x1] = (warped * w + clean[y0:y1, x0:x1] * (1 - w)).astype(np.uint8)

    # --- couche rigide : la barre -----------------------------------------
    H, W = out.shape[:2]
    M = np.float32([[plate_scale, 0, 0], [0, plate_scale, 0]])
    bar = cv2.warpAffine(plate_rgb, M, (W, H), flags=cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
    bar_a = cv2.warpAffine(plate_alpha, M, (W, H), flags=cv2.INTER_LINEAR,
                           borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    sh = np.float32([[1, 0, delta[0] * t], [0, 1, delta[1] * t]])
    bar = cv2.warpAffine(bar, sh, (W, H), flags=cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
    bar_a = cv2.warpAffine(bar_a, sh, (W, H), flags=cv2.INTER_LINEAR,
                           borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    a3 = bar_a[..., None]
    out = (bar.astype(np.float32) * a3 + out.astype(np.float32) * (1 - a3)).astype(np.uint8)
    return out


# ---------------------------------------------------------------------------
def encode(frames, path, fps, mp4=None):
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = os.path.join(os.path.dirname(path) or ".", "_enc_tmp")
    os.makedirs(tmp, exist_ok=True)
    for i, f in enumerate(frames):
        cv2.imwrite(os.path.join(tmp, "f%04d.png" % i), f)
    if path.lower().endswith(".gif"):
        cmd = [ffmpeg, "-y", "-loglevel", "error", "-framerate", str(fps),
               "-i", os.path.join(tmp, "f%04d.png"),
               "-vf", "split[a][b];[a]palettegen=stats_mode=diff:max_colors=192[p];"
                      "[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle",
               "-loop", "0", path]
    else:
        cmd = [ffmpeg, "-y", "-loglevel", "error", "-framerate", str(fps),
               "-i", os.path.join(tmp, "f%04d.png"),
               "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
               "-movflags", "+faststart", path]
    subprocess.run(cmd, check=True)
    for i in range(len(frames)):
        os.remove(os.path.join(tmp, "f%04d.png" % i))
    os.rmdir(tmp)


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--target", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--mp4", default=None)
    ap.add_argument("--width", type=int, default=300)
    ap.add_argument("--frames", type=int, default=24)
    ap.add_argument("--fps", type=int, default=12)
    ap.add_argument("--headroom", type=int, default=150)
    ap.add_argument("--kappa", type=float, default=2.4)
    ap.add_argument("--neigh", type=int, default=6)
    ap.add_argument("--fill-shift", type=int, default=22)
    ap.add_argument("--plate-scale", type=float, default=1.0)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--debug", action="store_true")
    args = ap.parse_args()

    src = cv2.imread(args.src)
    tgt = cv2.imread(args.target)
    if src is None or tgt is None:
        raise SystemExit("images introuvables")
    H, W = src.shape[:2]
    print("source %dx%d  cible %dx%d" % (W, H, tgt.shape[1], tgt.shape[0]))

    plate_mask, pstats = detect_plate(src)
    body_mask = detect_body(src)
    print("  plaque : %d px   corps : %d px" % (plate_mask.sum(), body_mask.sum()))

    # --- flux dense source -> cible ---------------------------------------
    gS = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    gT = cv2.cvtColor(tgt, cv2.COLOR_BGR2GRAY)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    dis.setUseSpatialPropagation(True)
    flow = dis.calc(gS, gT, None)

    # --- decomposition en couches -----------------------------------------
    clean, plate_rgb, plate_alpha = build_layers(src, tgt, plate_mask, args.fill_shift)

    rng = np.random.default_rng(args.seed)
    C, C2, groups, delta = build_control_points(src, clean, plate_mask, body_mask, flow, rng)

    # --- marge superieure --------------------------------------------------
    if args.headroom:
        clean = extend_top(clean, args.headroom)
        plate_rgb = extend_top(plate_rgb, args.headroom)
        plate_alpha = np.vstack([np.zeros((args.headroom, W), np.float32), plate_alpha])
        plate_mask = np.vstack([np.zeros((args.headroom, W), np.uint8), plate_mask])
        body_mask = np.vstack([np.zeros((args.headroom, W), np.uint8), body_mask])
        C = C + np.array([0.0, args.headroom])
        C2 = C2 + np.array([0.0, args.headroom])
    H2 = clean.shape[0]
    print("  marge superieure : %d px (cadre %dx%d)" % (args.headroom, W, H2))

    mmask = motion_mask((H2, W), plate_mask, body_mask)
    roi = (max(0, 420), 0, min(W, 980), min(H2, 620))
    print("  ROI : %s" % (roi,))

    # --- sequence ----------------------------------------------------------
    n = args.frames
    half = n // 2
    ts = [ease_cos(i / max(1, half - 1)) for i in range(half)]
    ts += [ease_cos(1 - i / max(1, half - 1)) for i in range(half)]
    ts = np.array(ts[:n])

    outw = args.width
    outh = int(round(outw * H2 / W / 2) * 2)
    frames = []
    for i, t in enumerate(ts):
        f = render_frame(clean, plate_rgb, plate_alpha, C, C2, groups, t, mmask,
                         args.kappa, args.neigh, roi, delta, args.plate_scale)
        f = cv2.resize(f, (outw, outh), interpolation=cv2.INTER_AREA)
        frames.append(f)
        if args.debug:
            cv2.imwrite("/tmp/bench_f%03d.png" % i, f)
        if (i + 1) % 6 == 0 or i == n - 1:
            print("  frame %d/%d (t=%.3f)" % (i + 1, n, t))

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    encode(frames, args.out, args.fps)
    print("GIF : %s (%d octets)" % (args.out, os.path.getsize(args.out)))
    if args.mp4:
        encode(frames, args.mp4, args.fps)
        print("MP4 : %s (%d octets)" % (args.mp4, os.path.getsize(args.mp4)))


if __name__ == "__main__":
    main()
