"""Scène finale compacte : un seul maillage (peau + tenue peinte).

Les vêtements sont peints dans la couleur des sommets avec des coutures
analytiques lisses ; le débardeur est translucide (le gris strié transparaît).
Un seul maillage = rendu rapide, aucune couture géométrique.
"""
from __future__ import annotations

import numpy as np

from engine3d import Mesh, Scene, render, tube, rounded_box
import body
import outfit

PULLEY = np.array((0.42, 2.12, -0.95), np.float32)
_COL = {}
_C = {}


def cloth_fields():
    """Champs signés (m) des 6 pièces + palette, pour la coupe au pixel."""
    if "cf" in _COL:
        return _COL["cf"], _COL["cp"]
    v, f = body.skin()
    fl = outfit.fields(v)
    order = ("shorts", "socks", "shoes", "gloves", "cap", "tank")
    arr = np.stack([fl[k] for k in order], 1).astype(np.float32)
    pal = np.array([[*outfit.SHORTS, 1.0], [*outfit.SOCK, 1.0], [*outfit.SHOE, 1.0],
                    [*outfit.GLOVE, 1.0], [*outfit.CAP, 1.0],
                    [*outfit.SHIRT, 0.87]], np.float32)
    _COL["cf"], _COL["cp"] = arr, pal
    return arr, pal


def colors():
    """Couleur de base par sommet : peau argentée striée + surlignage."""
    if "c" in _COL:
        return _COL["c"]
    v, f = body.skin()
    vc = body.vertex_colors().astype(np.float32)
    _COL["c"] = vc
    return vc


def hands(theta, lean):
    v = body.skin()[0]
    W = body.arm_weight(v)
    posed = body.pose(v, theta, lean)
    out = []
    for side, J in body.joints().items():
        sel = (W[side] > 0.92) & (np.linalg.norm(v - J["W"], axis=1) < 0.105)
        out.append(posed[sel].mean(0) if sel.sum() > 8 else J["W"])
    return out


def bar(theta, lean):
    a, b = hands(theta, lean)
    d = b - a
    ln = float(np.linalg.norm(d))
    d = d / max(ln, 1e-6)
    half = ln * 0.5 + 0.045
    mid = (a + b) * 0.5
    out = [tube(mid - d * half, mid + d * half, [0.014, 0.015, 0.014], seg=14,
                color=(0.32, 0.33, 0.36), spec=0.65, shin=60, rim=0.5)]
    for t in (-1, 1):
        c = mid + d * (t * (half - 0.070))
        out.append(tube(c - d * 0.018, c + d * 0.018, [0.025, 0.025], seg=14,
                        color=(0.07, 0.07, 0.09), spec=0.3, shin=24, rim=0.24))
    return out, mid


def cable(mid):
    from human import cable_mesh
    return cable_mesh(PULLEY, mid + np.array([0.0, 0.004, 0.0], np.float32))


def tower():
    if "t" in _C:
        return _C["t"]
    ms = []
    x, z = float(PULLEY[0]), float(PULLEY[2])
    ms.append(tube((x, 0.02, z), (x, 2.16, z), [0.052, 0.046], seg=16,
                   color=(0.072, 0.077, 0.089), spec=0.35, shin=30, rim=0.3))
    ms.append(rounded_box(np.array([x, 0.030, z], np.float32),
                          (0.32, 0.034, 0.28), color=(0.062, 0.067, 0.079),
                          spec=0.2, shin=20, rim=0.2))
    ms.append(rounded_box(PULLEY + np.array([0.0, 0.060, 0.0], np.float32),
                          (0.17, 0.11, 0.095), color=(0.098, 0.103, 0.116),
                          spec=0.4, shin=40, rim=0.3))
    for i in range(8):
        ms.append(rounded_box(np.array([x - 0.10, 0.13 + i * 0.058, z], np.float32),
                              (0.19, 0.034, 0.15), color=(0.082, 0.087, 0.098),
                              spec=0.25, shin=24, rim=0.22))
    _C["t"] = ms
    return ms


def stripe_amp():
    """Amplitude des stries par face : nulle sous les tissus opaques."""
    if "sa" in _COL:
        return _COL["sa"]
    v, f = body.skin()
    w = outfit.weights(v, soft=0.006)
    cover = np.clip(w["shorts"] + w["socks"] + w["shoes"] + w["gloves"] + w["cap"]
                    + 0.55 * w["tank"], 0, 1)
    cf = (cover[f[:, 0]] + cover[f[:, 1]] + cover[f[:, 2]]) / 3.0
    amp = body.STRIPE[1] * np.clip(1.0 - 0.92 * cf, 0, 1)
    _COL["sa"] = amp.astype(np.float32)
    return _COL["sa"]


def body_mesh(theta, lean):
    v, f = body.skin()
    freq, _, ax = body.STRIPE
    cf, pal = cloth_fields()
    m = Mesh(body.pose(v, theta, lean), body.faces_oriented(),
             normals=body.skin_normals(), color=(0.6, 0.6, 0.62),
             spec=0.20, shin=28, rim=0.30, vcolor=colors(),
             striate=(freq, stripe_amp(), ax), cloth=cf)
    m.cloth_pal = pal
    return m


def brim(lean, y0=1.648):
    c = np.array([0.104, y0, 0.0], np.float32)
    m = rounded_box(c, (0.175, 0.012, 0.100), radius_ratio=0.46, seg=18, rings=5,
                    color=outfit.CAP, spec=0.26, shin=34, rim=0.28)
    m.verts = body.lean_only(m.verts, lean)
    return m


def compose(theta, lean, cam, bg=None, bg_depth=None):
    sc = Scene()
    sc.add(body_mesh(theta, lean))
    sc.add(brim(lean))
    bars, mid = bar(theta, lean)
    for m in bars:
        sc.add(m)
    sc.add(cable(mid))
    for m in tower():
        sc.add(m)
    col, dep = render(sc, cam, background=bg, bg_depth=bg_depth)
    return col, dep, mid
