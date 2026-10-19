"""Corps réel BodyParts3D : rig du coude, matière argentée, surlignage triceps.

Repère : X avant, Y haut, Z gauche (mètres). Le sujet fait face à +X.
"""
from __future__ import annotations

import math

import numpy as np

from engine3d import Mesh, smoothstep
import atlas

SILVER = np.array((0.455, 0.468, 0.500), np.float32)
GLOW_TRICEPS = np.array((1.00, 0.30, 0.06), np.float32)
GLOW_DELTOID = np.array((0.98, 0.38, 0.10), np.float32)
GLOW_SECOND = np.array((0.90, 0.42, 0.14), np.float32)

# articulations (côté repère : z > 0 = gauche)
SHOULDER = np.array((-0.035, 1.391, 0.193), np.float32)
ELBOW = np.array((-0.028, 1.120, 0.209), np.float32)
WRIST = np.array((0.018, 0.882, 0.242), np.float32)

_SK = {}


def skin():
    """Peau convertie dans le repère moteur (X avant, Y haut, Z gauche)."""
    if "v" not in _SK:
        sk = atlas.skin()
        a = sk.verts
        _SK["v"] = np.stack([a[:, 2], a[:, 1], a[:, 0]], 1).astype(np.float32)
        _SK["f"] = sk.faces
    return _SK["v"], _SK["f"]


def joints():
    out = {}
    for side in (1, -1):
        d = np.array([1, 1, side], np.float32)
        out[side] = dict(S=SHOULDER * d, E=ELBOW * d, W=WRIST * d)
    return out


def arm_weight(v):
    """Poids du bras (1 = main/avant-bras, 0 = torse), par côté."""
    key = ("w", len(v))
    if key in _SK:
        return _SK[key]
    import rig
    vv, ff = skin()
    out = {}
    for side, J in joints().items():
        out[side] = rig.elbow_weights(vv, ff, J["W"])
    _SK[key] = out
    return out


def pose(v, theta, lean=0.0):
    """Flexion des deux coudes (θ degrés, rotation autour de Z au coude)."""
    return pose_weighted(v, arm_weight(v), theta, lean)


def pose_weighted(v, ws_all, theta, lean=0.0):
    """Idem, avec des poids fournis (pièces de vêtement découpées)."""
    a = math.radians(theta)
    c, s = math.cos(a), math.sin(a)
    out = v.copy()
    for side, J in joints().items():
        E = J["E"]
        rel = v - E
        x, y, z = rel[:, 0], rel[:, 1], rel[:, 2]
        rot = np.stack([c * x - s * y, s * x + c * y, z], 1)
        ws = ws_all[side] * ((v[:, 2] * side) > 0)
        out = out + ws[:, None] * (E + rot - v)
    if lean:
        out = lean_only(out, lean)
    return out


def lean_only(v, lean):
    if not lean:
        return v
    b = math.radians(-lean)
    piv = np.array((0.012, 0.94, 0.0), np.float32)
    rel = v - piv
    cb, sb = math.cos(b), math.sin(b)
    x, y, z = rel[:, 0], rel[:, 1], rel[:, 2]
    return np.stack([cb * x + sb * y, -sb * x + cb * y, z], 1) + piv


def _seg_dist(p, a, b):
    ab = b - a
    t = np.clip(((p - a) @ ab) / (ab @ ab), 0, 1)
    return np.linalg.norm(p - (a + t[:, None] * ab), axis=1)


STRIPE = (1500.0, 0.055, (0.0, 1.0, 0.20))  # stries de fibres (fréquence, amplitude, direction)


def shade(v):
    """Micro-stries verticales + grain, borné."""
    t = v[:, 1] * 1.0 + 0.25 * np.abs(v[:, 2]) + 0.08 * v[:, 0]
    tone = np.sin(37.0 * v[:, 1] + 11.0 * v[:, 2])
    grains = np.sin(213.0 * v[:, 2] + 91.0 * v[:, 1] + 57.0 * v[:, 0])
    s = 1.0 + 0.050 * np.sin(1250.0 * t + tone * 6.0) + 0.030 * grains
    return np.clip(s, 0.808, 1.105).astype(np.float32)


def _relax_face_val(f, val, iters=3, lam=0.6):
    """Diffuse une valeur par face sur le maillage (adoucit les taches)."""
    nv = int(f.max()) + 1
    acc = np.zeros(nv, np.float32)
    cnt = np.zeros(nv, np.float32)
    for i in range(3):
        np.add.at(acc, f[:, i], val)
        np.add.at(cnt, f[:, i], 1.0)
    vv = acc / np.maximum(cnt, 1)
    out = val.copy()
    for _ in range(iters):
        out = 0.35 * out + 0.65 * vv[f].mean(1)
    return out


def highlight(f, v):
    """Couleur par face : argent + triceps/deltoïde saturés (repère du repos).

    Le triceps n'occupe que la face postérieure du bras (derrière l'axe de
    l'humérus), le deltoïde une calotte d'épaule, l'avant-bras une bande
    proche du coude : le reste du corps reste argenté.
    """
    c = np.tile(SILVER, (len(f), 1))
    cen = v[f].mean(1)
    triceps = np.zeros(len(f), np.float32)
    deltoid = np.zeros(len(f), np.float32)
    fore = np.zeros(len(f), np.float32)
    for side, J in joints().items():
        S, E, W = J["S"], J["E"], J["W"]
        m = (cen[:, 2] * side) > 0.11
        # triceps : tiers postérieur du bras, du coude à l'épaule
        d = _seg_dist(cen, S, E)
        back = np.clip(((-0.020) - cen[:, 0]) / 0.045, 0, 1)
        side_band = np.clip((np.abs(cen[:, 2]) - 0.170) / 0.020, 0, 1)
        span = (np.clip((cen[:, 1] - 1.140) / 0.045, 0, 1)
                * np.clip((1.350 - cen[:, 1]) / 0.040, 0, 1))
        core = np.clip(1.0 - d / 0.068, 0, 1) ** 0.55
        tri = m * back * span * core * side_band
        triceps = np.maximum(triceps, tri)
        # deltoïde : calotte d'épaule, atténuée si le triceps est fort
        dd = np.linalg.norm(cen - S, axis=1)
        delt = m * np.clip(1.0 - dd / 0.062, 0, 1) ** 0.9 * side_band
        delt = delt * (1.0 - 0.9 * np.clip(tri * 1.6, 0, 1))
        deltoid = np.maximum(deltoid, delt)
        # avant-bras : bande sous le coude (secondaire)
        dl = _seg_dist(cen, E, W)
        near = (np.clip((cen[:, 1] - 1.035) / 0.040, 0, 1)
                * np.clip((1.135 - cen[:, 1]) / 0.040, 0, 1))
        fore = np.maximum(fore, m * near * np.clip(1.0 - dl / 0.055, 0, 1) ** 0.9 * side_band)
    triceps = _relax_face_val(f, triceps, 4, 0.6)
    deltoid = _relax_face_val(f, deltoid, 3, 0.6)
    fore = _relax_face_val(f, fore, 3, 0.6)
    fib = 0.80 + 0.28 * (0.5 + 0.5 * np.sin(520.0 * cen[:, 1] + 90.0 * cen[:, 2]))
    triceps = np.clip(triceps * fib, 0, 1)
    fore = np.clip(fore * 0.55, 0, 1)
    # montée en saturation : contour net mais pas de dégradé mou
    triceps = np.clip((triceps - 0.05) / 0.30, 0, 1) ** 0.65
    deltoid = np.clip((deltoid - 0.10) / 0.50, 0, 1)
    fore = np.clip((fore - 0.15) / 0.50, 0, 1)
    warm = np.zeros_like(c)
    for amt, col in ((triceps, GLOW_TRICEPS), (deltoid * 0.22, GLOW_DELTOID),
                     (fore * 0.7, GLOW_SECOND)):
        warm += col[None, :] * amt[:, None]
    core = np.clip(triceps + 0.28 * deltoid + 0.30 * fore, 0, 1)
    col = c * (1.0 - 1.0 * core)[:, None] + warm * 1.35
    return np.clip(col, 0, 1)


def skin_normals():
    if "nrm" not in _SK:
        import normals as N
        ff, fn, _ = N.orient(*skin())
        _SK["nrm"] = N.smooth_normals(*skin(), ff, fn)
        _SK["forient"] = ff
    return _SK["nrm"]


def faces_oriented():
    skin_normals()
    return _SK["forient"]


def mesh(theta, lean, color=None, spec=0.22, shin=30, rim=0.34, stripe=True):
    v, f = skin()
    if color is None:
        color = face_colors()
    return Mesh(pose(v, theta, lean), f, normals=skin_normals(),
                color=color.astype(np.float32),
                spec=spec, shin=shin, rim=rim,
                striate=STRIPE if stripe else None)


def vertex_colors():
    """Couleur par sommet (peau striée + surlignage), lissée entre faces."""
    if "vc" in _SK:
        return _SK["vc"]
    v, f = skin()
    fc = highlight(f, v) * shade(v[f].mean(1))[:, None]
    vc = np.zeros((len(v), 3), np.float32)
    cnt = np.zeros(len(v), np.float32)
    for i in range(3):
        np.add.at(vc, f[:, i], fc)
        np.add.at(cnt, f[:, i], 1.0)
    _SK["vc"] = np.clip(vc / np.maximum(cnt, 1)[:, None], 0, 1)
    return _SK["vc"]


def face_colors():
    """Couleur par face = moyenne des couleurs de sommets (dégradés doux)."""
    if "fc" not in _SK:
        vc = vertex_colors()
        f = skin()[1]
        _SK["fc"] = ((vc[f[:, 0]] + vc[f[:, 1]] + vc[f[:, 2]]) / 3.0).astype(np.float32)
    return _SK["fc"]


def lmesh(theta, lean):
    """Version allégée (repère du repos) pour les pièces de tissu."""
    v, f = skin()
    return pose(v, theta, lean), f
