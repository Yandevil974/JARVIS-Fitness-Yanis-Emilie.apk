"""Tenue peinte sur la peau : aucun maillage séparé, donc aucune couture."""
from __future__ import annotations

import numpy as np

from engine3d import smoothstep
import body

SHIRT = np.array((0.640, 0.028, 0.038), np.float32)
SHORTS = np.array((0.045, 0.047, 0.055), np.float32)
SOCK = np.array((0.120, 0.125, 0.140), np.float32)
SHOE = np.array((0.052, 0.054, 0.062), np.float32)
GLOVE = np.array((0.042, 0.043, 0.052), np.float32)
CAP = np.array((0.030, 0.032, 0.040), np.float32)


def _seg(p, a, b):
    ab = b - a
    t = np.clip(((p - a) @ ab) / (ab @ ab), 0, 1)
    return np.linalg.norm(p - (a + t[:, None] * ab), axis=1)


def _band(x, lo, hi, w=0.010):
    return smoothstep((x - lo) / w) * (1.0 - smoothstep((x - hi) / w))


_EDGE = {}


def _edges(v, f):
    if "e" in _EDGE:
        return _EDGE["e"]
    e = np.concatenate([f[:, [0, 1]], f[:, [1, 2]], f[:, [2, 0]]])
    e = np.concatenate([e, e[:, ::-1]])
    e = e[np.argsort(e[:, 0], kind="stable")]
    starts = np.searchsorted(e[:, 0], np.arange(len(v) + 1))
    _EDGE["e"] = (e[:, 1], starts)
    return _EDGE["e"]


def _relax(w, v, f, iters=5, lam=0.5):
    """Diffuse le poids sur le maillage : bords arrondis à l'échelle des faces."""
    nb, starts = _edges(v, f)
    cnt = np.maximum(starts[1:] - starts[:-1], 1)
    rep = np.repeat(np.arange(len(v)), cnt)
    for _ in range(iters):
        acc = np.zeros(len(v), np.float32)
        np.add.at(acc, rep, w[nb])
        w = (1 - lam) * w + lam * (acc / cnt)
    return np.clip(w, 0, 1)


_ARM_Z = 0.204
_ARM_X = 0.030


def _arm_dist(v, side):
    """Distance horizontale à l'axe vertical du bras (cylindre du bras)."""
    dx = v[:, 0] - _ARM_X
    dz = v[:, 2] * side - _ARM_Z
    return np.sqrt(dx * dx + dz * dz)


def fields(v):
    """Champs signés (mètres) : la surface de niveau 0 est la couture.

    Débardeur : panneau avant/arrière (|z| < 0,162) + deux bretelles étroites
    sur les épaules. Encolure plus haute dans le dos que devant.
    """
    from engine3d import smoothstep
    y = v[:, 1]
    z = np.abs(v[:, 2])
    x = v[:, 0]
    back = smoothstep((-x + 0.030) / 0.070)
    out_z = smoothstep((z - 0.040) / 0.080)
    top = (1.352 + 0.082 * out_z) * (1 - back) + (1.396 + 0.040 * out_z) * back
    panel = np.minimum.reduce([y - 0.992, top - y, 0.162 - z])
    strap = np.minimum.reduce([y - 1.318, 1.452 - y,
                               z - 0.058, 0.124 - z, 0.045 - x])
    tank = np.maximum(panel, strap)
    shorts = np.minimum.reduce([y - 0.702, 1.004 - y, 0.205 - z])
    socks = np.minimum.reduce([y - 0.088, 0.196 - y, z - 0.030, 0.170 - z])
    shoes = np.minimum(0.090 - y, 0.190 - z)
    gloves = np.minimum.reduce([z - 0.206, 0.930 - y, x + 0.020])
    cap = y - 1.634
    return dict(tank=tank, shorts=shorts, socks=socks, shoes=shoes,
                gloves=gloves, cap=cap)


def weights(v, soft=0.004):
    """Poids 0..1 (les champs adoucis sur 6 mm) pour la peinture."""
    from engine3d import smoothstep
    return {k: smoothstep(np.clip(f / soft, -1, 1) * 0.5 + 0.5)
            for k, f in fields(v).items()}


def _vmix(vc, wv, color, a=1.0):
    w = (wv * a)[:, None]
    return vc * (1 - w) + color[None, :] * w


def _shade(v):
    t = v[:, 1] + 0.25 * np.abs(v[:, 2]) + 0.08 * v[:, 0]
    tone = np.sin(37.0 * v[:, 1] + 11.0 * v[:, 2])
    grain = np.sin(213.0 * v[:, 2] + 91.0 * v[:, 1] + 57.0 * v[:, 0])
    return 1.0 + 0.075 * np.sin(1250.0 * t + tone * 6.0) + 0.045 * grain


def colors():
    """Couleur par sommet : peau striée + tissus (le tissu ne prend pas les stries)."""
    v, f = body.skin()
    base = body.vertex_colors().copy()
    w = weights(v)
    cover = np.clip(w["shorts"] + w["socks"] + w["shoes"] + w["gloves"] + w["cap"], 0, 1)
    vc = base * (1.0 + (_shade(v) - 1.0) * (1.0 - cover))[:, None]
    vc = np.clip(vc, 0, 1)
    vc = _vmix(vc, w["shorts"], SHORTS)
    vc = _vmix(vc, w["socks"], SOCK)
    vc = _vmix(vc, w["shoes"], SHOE * 0.85)
    vc = _vmix(vc, w["gloves"], GLOVE)
    vc = _vmix(vc, w["cap"], CAP)
    # débardeur translucide : le gris strié reste visible sous le rouge
    vc = _vmix(vc, w["tank"], SHIRT, 0.80)
    return np.clip(vc, 0, 1)


def mesh(theta, lean):
    v, f = body.skin()
    vc = colors()
    w = weights(v)
    cov = {k: (w[k][f[:, 0]] + w[k][f[:, 1]] + w[k][f[:, 2]]) / 3.0 for k in w}
    fabric = np.clip(cov["shorts"] + cov["socks"] + cov["shoes"] + cov["gloves"]
                     + cov["cap"] + 0.85 * cov["tank"], 0, 1)
    spec = 0.30 * (1.0 - 0.78 * fabric) + 0.05
    shin = 42.0 - 26.0 * fabric
    rim = 0.38 * (1.0 - 0.72 * fabric)
    from engine3d import Mesh
    return Mesh(body.pose(v, theta, lean), f, color=(0.6, 0.6, 0.62),
                spec=spec.astype(np.float32), shin=shin.astype(np.float32),
                rim=rim.astype(np.float32), vcolor=vc.astype(np.float32))


def brim(lean, y0=1.672):
    from engine3d import rounded_box
    c = np.array([0.130, y0, 0.0], np.float32)
    m = rounded_box(c, (0.190, 0.013, 0.106), radius_ratio=0.46, seg=20, rings=6,
                    color=CAP, spec=0.26, shin=34, rim=0.28)
    m.verts = body.lean_only(m.verts, lean)
    return m
