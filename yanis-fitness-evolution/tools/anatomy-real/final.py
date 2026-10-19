"""Scène finale : corps réel strié, tenue, poulie, câble, salle."""
from __future__ import annotations

import math

import numpy as np

from engine3d import Mesh, Scene, render, tube, rounded_box
import body
import outfit
import wear

PULLEY = np.array((0.42, 2.12, -0.92), np.float32)
_C = {}
# repère moteur : X avant, Y haut, Z gauche.  Le sujet regarde +X.


def hands(theta, lean):
    v, f = body.skin()
    W = body.arm_weight(v)
    posed = body.pose(v, theta, lean)
    out = []
    for side, J in body.joints().items():
        Wp = body.pose(J["W"][None, :], theta, lean)[0]
        sel = (W[side] > 0.92) & (np.linalg.norm(body.pose(v, 0, 0) - J["W"], axis=1) < 0.105)
        out.append(posed[sel].mean(0) if sel.sum() > 8 else Wp)
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
    ms.append(tube((x, 0.02, z), (x, 2.14, z), [0.052, 0.046], seg=16,
                   color=(0.072, 0.077, 0.089), spec=0.35, shin=30, rim=0.3))
    ms.append(rounded_box(np.array([x, 0.030, z], np.float32),
                          (0.32, 0.034, 0.28), color=(0.062, 0.067, 0.079),
                          spec=0.2, shin=20, rim=0.2))
    ms.append(rounded_box(PULLEY + np.array([0.0, 0.060, 0.0], np.float32),
                          (0.17, 0.11, 0.095), color=(0.098, 0.103, 0.116),
                          spec=0.4, shin=40, rim=0.3))
    for i in range(8):
        ms.append(rounded_box(np.array([x - 0.11, 0.13 + i * 0.058, z], np.float32),
                              (0.19, 0.034, 0.15), color=(0.082, 0.087, 0.098),
                              spec=0.25, shin=24, rim=0.22))
    _C["t"] = ms
    return ms


def compose(theta, lean, cam, bg=None, bg_depth=None, tank_alpha=0.84):
    """Trois passes : corps+tenue+tissu → débardeur translucide → salle."""
    v, f = body.skin()
    w = outfit.weights(v)["tank"]
    sc = Scene()
    sc.add(body.mesh(theta, lean))
    ms = wear.realize(wear.pieces(), theta, lean)
    for k in ("shorts", "socks", "shoes", "gloves"):
        if k in ms:
            sc.add(ms[k])
    sc.add(wear.brim(lean))
    bars, mid = bar(theta, lean)
    for m in bars:
        sc.add(m)
    sc.add(cable(mid))
    for m in tower():
        sc.add(m)
    core, dep = render(sc, cam, background=bg, bg_depth=bg_depth)
    # voile du débardeur (translucide, bords fondus)
    tk = ms.get("tank")
    if tk is not None:
        a = tk.color.mean(1) * 0 + 1.0
        sc2 = Scene()
        sc2.add(tk)
        c2, d2 = render(sc2, cam, background=bg, bg_depth=bg_depth, fog_density=0.0)
        m2 = (d2 <= dep + 0.010) & (d2 < 1e8)
        al = tank_alpha * np.ones(int(m2.sum()), np.float32)
        m2f = m2
        core[m2f] = core[m2f] * (1 - al)[:, None] + c2[m2f] * al[:, None]
    return core, dep, mid
