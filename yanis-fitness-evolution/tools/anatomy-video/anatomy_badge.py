"""Badges anatomiques : réutilise l'atlas humain livré avec l'application.

Les tracés musculaires proviennent de `src/components/anatomical-regions.js`
(vue postérieure) : deltoïde postérieur, triceps, avant-bras, dos. Chaque badge
met en évidence une zone précise, comme les pastilles de la vidéo de référence.
"""
from __future__ import annotations

import os
import re

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ATLAS = os.path.abspath(os.path.join(HERE, "..", "..", "public", "human", "back.webp"))

# Tracés extraits de src/components/anatomical-regions.js (côté gauche de l'atlas)
TRICEPS = "M238 214 Q252 215 259 237 L237 282 Q225 286 218 276 L226 244 Z"
DELT = "M250 163 Q267 158 280 170 L289 202 Q271 220 252 207 Z"
DELT_SIDE = "M244 178 Q239 204 236 219 L249 228 260 208 Z"
FOREARM = "M217 281 Q230 282 237 298 L210 372 194 369 Z"
BACK = "M263 216 Q287 209 336 210 L326 303 296 322 Q280 296 274 263 Z"

CROP = (186, 140, 330, 350)  # (x0, y0, x1, y1) deltoïde + triceps + dos gauches
ANGLE = -58  # redresse le bras à l'horizontale pour les vignettes


def _mirror(d, axis_x=688.0):
    return d, axis_x


def sample_path(d, steps=14):
    """Échantillonne un tracé SVG simple (M, L, Q, Z) en polygone."""
    tokens = re.findall(r"[MLQZmlqz]|-?\d+(?:\.\d+)?", d)
    pts = []
    cur = (0.0, 0.0)
    i = 0
    cmd = None
    while i < len(tokens):
        t = tokens[i]
        if t in "MLQZmlqz":
            cmd = t
            i += 1
            if cmd in "Zz":
                break
            continue
        if cmd in "Mm":
            cur = (float(tokens[i]), float(tokens[i + 1]))
            pts.append(cur)
            i += 2
            cmd = "L" if cmd == "M" else "l"
        elif cmd in "Ll":
            cur = (float(tokens[i]), float(tokens[i + 1]))
            pts.append(cur)
            i += 2
        elif cmd in "Qq":
            c = (float(tokens[i]), float(tokens[i + 1]))
            end = (float(tokens[i + 2]), float(tokens[i + 3]))
            for k in range(1, steps + 1):
                u = k / steps
                x = (1 - u) ** 2 * cur[0] + 2 * (1 - u) * u * c[0] + u * u * end[0]
                y = (1 - u) ** 2 * cur[1] + 2 * (1 - u) * u * c[1] + u * u * end[1]
                pts.append((x, y))
            cur = end
            i += 4
        else:
            i += 1
    if len(pts) > 2:
        pts.append(pts[0])
    return pts


def _poly_mask(size, path, mirror=False, offset=(0, 0), scale=1):
    im = Image.new("L", size, 0)
    d = ImageDraw.Draw(im)
    pts = sample_path(path)
    if mirror:
        pts = [(688 - x, y) for (x, y) in pts]
    pts = [((x - offset[0]) * scale, (y - offset[1]) * scale) for (x, y) in pts]
    d.polygon(pts, fill=255)
    return im


def _tint(im, mask, color, strength=0.88):
    """Colore la zone en conservant le modelé de l'atlas."""
    arr = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    lum = arr.mean(axis=2, keepdims=True)
    base = 0.35 + 0.85 * lum  # garde les reliefs
    tint = np.asarray(color, dtype=np.float32)[None, None, :] * base
    tint = np.clip(tint, 0, 1)
    m = (np.asarray(mask, dtype=np.float32) / 255.0)[:, :, None] * strength
    out = arr * (1 - m) + tint * m
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")


def build_badges(size=(420, 540), scale=2):
    """Retourne 4 images RGBA (une par badge), recadrées sur l'épaule et le bras."""
    x0, y0, x1, y1 = CROP
    cw, ch = x1 - x0, y1 - y0
    W2, H2 = cw * scale, ch * scale
    atlas_rgba = Image.open(ATLAS).convert("RGBA").resize((688 * scale, 768 * scale), Image.LANCZOS)
    atlas = atlas_rgba.convert("RGB")
    crop = atlas.crop((x0 * scale, y0 * scale, x1 * scale, y1 * scale))
    # lisse la silhouette (l'atlas a des bords semi-transparents pixelisés)
    crop = crop.filter(ImageFilter.GaussianBlur(scale * 0.45))
    # fond désaturé et assombri, modelé conservé
    gray = np.asarray(crop.convert("L"), dtype=np.float32) / 255.0
    gray = np.asarray(Image.fromarray((gray * 255).astype(np.uint8), "L")
                      .filter(ImageFilter.GaussianBlur(scale * 0.6)), dtype=np.float32) / 255.0
    base = (0.16 + 0.62 * gray)[:, :, None] * np.array([0.70, 0.75, 0.84], np.float32)
    base_img = Image.fromarray((np.clip(base, 0, 1) * 255).astype(np.uint8), "RGB")

    def m(path, mirror=False):
        return _poly_mask((W2, H2), path, mirror=mirror, offset=(x0, y0), scale=scale)

    tri_l = m(TRICEPS)
    delt = Image.fromarray(np.maximum(np.asarray(m(DELT)), np.asarray(m(DELT_SIDE))), "L")
    fore = m(FOREARM)
    backm = m(BACK)
    tri = np.asarray(tri_l) / 255.0
    yy = np.arange(H2)[:, None] / scale
    xx = np.arange(W2)[None, :] / scale
    ty = (yy - 214) / 68.0
    tx = (xx - 218) / 42.0
    upper = np.clip(1 - (ty - 0.30) / 0.45, 0, 1)
    deep = np.clip((ty - 0.35) / 0.45, 0, 1)
    inner = np.clip((tx - 0.25) / 0.55, 0, 1)
    outer = np.clip(1 - (tx - 0.20) / 0.55, 0, 1)
    band_long = np.clip(tri * np.clip(1 - (ty - 0.15) / 0.62, 0, 1) * (0.35 + 0.65 * inner), 0, 1)
    band_lat = np.clip(tri * np.clip(1 - (ty - 0.10) / 0.50, 0, 1) * outer ** 1.2, 0, 1)
    band_med = np.clip(tri * np.clip((ty - 0.42) / 0.30, 0, 1) * (0.4 + 0.6 * inner), 0, 1)
    bands = [Image.fromarray((b * 255).astype(np.uint8), "L") for b in (band_long, band_lat, band_med)]
    body_alpha = crop = atlas_rgba.crop((x0 * scale, y0 * scale, x1 * scale, y1 * scale)).split()[3]
    body_alpha = body_alpha.filter(ImageFilter.GaussianBlur(scale * 0.8))
    cards = []
    for i in range(4):
        img = base_img.copy()
        img = _tint(img, backm, (0.55, 0.36, 0.34), strength=0.18)
        img = _tint(img, tri_l, (0.62, 0.16, 0.14), strength=0.45)
        if i < 3:
            img = _tint(img, delt, (0.62, 0.45, 0.22), strength=0.25)
            img = _tint(img, bands[i], (0.97, 0.14, 0.10), strength=0.95)
        else:
            img = _tint(img, delt, (0.98, 0.58, 0.14), strength=0.92)
            img = _tint(img, fore, (0.93, 0.48, 0.11), strength=0.85)
        # assombrit les bords de la vignette pour fondre la planche dans la carte
        vx = np.linspace(-1, 1, W2)[None, :]
        vy = np.linspace(-1, 1, H2)[:, None]
        vig = np.clip(1.30 - 0.78 * (vx ** 2 + vy ** 2) * 0.9, 0, 1) ** 1.15
        arr = np.asarray(img, dtype=np.float32) * vig[:, :, None]
        # liseré lumineux sur la zone active
        edge = (bands[i] if i < 3 else delt).filter(ImageFilter.GaussianBlur(scale * 1.2))
        e = np.asarray(edge, dtype=np.float32)[:, :, None] / 255.0 * 0.30
        arr = np.clip(arr + e * np.array([255, 120, 50], np.float32), 0, 255)
        img = Image.fromarray(arr.astype(np.uint8), "RGB").resize(size, Image.LANCZOS)
        alpha = body_alpha.resize(size, Image.LANCZOS)
        card = Image.new("RGBA", size, (9, 11, 15, 0))
        body = img.convert("RGBA")
        body.putalpha(alpha)
        card = Image.alpha_composite(card, body)
        # liseré du corps légèrement lumineux
        edge = alpha.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.0))
        glow = Image.new("RGBA", size, (150, 175, 210, 0))
        glow.putalpha(edge.point(lambda p: int(p * 0.35)))
        card = Image.alpha_composite(glow, card)
        # redresse le bras : rotation puis recadrage au format demandé
        big = card.rotate(ANGLE, resample=Image.BICUBIC, expand=True)
        target_ratio = size[0] / size[1]
        bw2, bh2 = big.size
        if bw2 / bh2 > target_ratio:
            nw = int(bh2 * target_ratio)
            box = ((bw2 - nw) // 2, 0, (bw2 + nw) // 2, bh2)
        else:
            nh = int(bw2 / target_ratio)
            box = (0, (bh2 - nh) // 2, bw2, (bh2 + nh) // 2)
        big = big.crop(box).resize(size, Image.LANCZOS)
        cards.append(big)
    return cards


def build_highlight_plate(size=(560, 650)):
    """Planche anatomique complète (vue postérieure) avec muscles colorés.

    Utilisée en carton d'ouverture de la vidéo : elle montre d'un coup d'œil le
    triceps (rouge), le deltoïde postérieur et l'avant-bras (orange).
    """
    scale = 2
    img = Image.open(ATLAS).convert("RGBA").resize((688 * scale, 768 * scale), Image.LANCZOS)
    crop = img.crop((150 * scale, 90 * scale, 400 * scale, 470 * scale))
    cw, ch = crop.size
    gray = np.asarray(crop.convert("L"), dtype=np.float32) / 255.0
    base = (0.14 + 0.66 * gray)[:, :, None] * np.array([0.70, 0.75, 0.84], np.float32)
    out = Image.fromarray((np.clip(base, 0, 1) * 255).astype(np.uint8), "RGB")

    def m(path, mirror=False):
        return _poly_mask((cw, ch), path, mirror=mirror,
                          offset=(150, 90), scale=scale)

    tri = Image.fromarray(np.maximum(np.asarray(m(TRICEPS)),
                                     np.asarray(m(TRICEPS, True))), "L")
    delt = Image.fromarray(np.maximum(np.asarray(m(DELT)),
                                      np.asarray(m(DELT, True))), "L")
    fore = Image.fromarray(np.maximum(np.asarray(m(FOREARM)),
                                      np.asarray(m(FOREARM, True))), "L")
    out = _tint(out, delt, (0.98, 0.58, 0.14), strength=0.92)
    out = _tint(out, fore, (0.93, 0.48, 0.11), strength=0.85)
    out = _tint(out, tri, (0.97, 0.13, 0.09), strength=0.95)
    arr = np.asarray(out, dtype=np.float32)
    edge = tri.filter(ImageFilter.GaussianBlur(scale * 1.4))
    e = np.asarray(edge, dtype=np.float32)[:, :, None] / 255.0 * 0.25
    arr = np.clip(arr + e * np.array([255, 120, 50], np.float32), 0, 255)
    out = Image.fromarray(arr.astype(np.uint8), "RGB")
    alpha = crop.split()[3].filter(ImageFilter.GaussianBlur(scale * 0.9))
    # fondu des bords : la découpe ne doit pas se voir dans le carton
    aw, ah = alpha.size
    fade = np.ones((ah, aw), dtype=np.float32)
    ramp = max(8, int(min(aw, ah) * 0.10))
    for i in range(ramp):
        k = (i + 1) / ramp
        fade[i, :] *= k
        fade[-1 - i, :] *= k
        fade[:, i] *= k
        fade[:, -1 - i] *= k
    alpha = Image.fromarray(
        (np.asarray(alpha, dtype=np.float32) * fade).astype(np.uint8), "L")
    body = out.convert("RGBA")
    body.putalpha(alpha)
    card = Image.new("RGBA", body.size, (9, 11, 15, 0))
    card = Image.alpha_composite(card, body)
    target_ratio = size[0] / size[1]
    bw, bh = card.size
    if bw / bh > target_ratio:
        nw = int(bh * target_ratio)
        box = ((bw - nw) // 2, 0, (bw + nw) // 2, bh)
    else:
        nh = int(bw / target_ratio)
        box = (0, (bh - nh) // 2, bw, (bh + nh) // 2)
    return card.crop(box).resize(size, Image.LANCZOS)


if __name__ == "__main__":
    out = os.path.join(HERE, "badge_preview.png")
    cards = build_badges()
    sheet = Image.new("RGBA", (sum(c.width for c in cards) + 30, cards[0].height), (12, 14, 18, 255))
    x = 0
    for c in cards:
        sheet.alpha_composite(c, (x, 0))
        x += c.width + 10
    sheet.convert("RGB").save(out)
    print(out)
