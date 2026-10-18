"""Décor de salle de sport, éclairage et composition des plans."""
from __future__ import annotations

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from engine3d import (
    Camera, DEFAULT_LIGHTS, Mesh, Scene, ellipsoid, loft, norm, render,
    rounded_box, to_image, translate, tube, v,
)
from human import (
    ACCENT, SHORTS, SKIN, build_athlete, build_machine, build_muscle_overlay,
    cable_mesh,
)

FLOOR = (0.085, 0.089, 0.098)
WALL = (0.085, 0.092, 0.105)
WALL_PANEL = (0.115, 0.122, 0.138)
STEEL = (0.28, 0.30, 0.34)
DARK_STEEL = (0.13, 0.14, 0.17)

PULLEY = np.array([0.80, 2.30, -0.72], dtype=np.float32)


def _plane(cx, cy, cz, sx, sz, color, **mat):
    verts = np.array([
        [cx - sx / 2, cy, cz - sz / 2],
        [cx + sx / 2, cy, cz - sz / 2],
        [cx + sx / 2, cy, cz + sz / 2],
        [cx - sx / 2, cy, cz + sz / 2],
    ], dtype=np.float32)
    faces = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
    m = Mesh(verts, faces, normals=np.tile(np.array([0, 1, 0], np.float32), (4, 1)),
             color=color, **mat)
    return m


def _wall(x=None, z=None, width=16, height=4.6, color=WALL, normal=(1, 0, 0)):
    cx, cz = (x, 0) if x is not None else (0, z)
    if x is not None:
        verts = np.array([
            [x, 0, cz - width / 2], [x, 0, cz + width / 2],
            [x, height, cz + width / 2], [x, height, cz - width / 2],
        ], dtype=np.float32)
    else:
        verts = np.array([
            [cx - width / 2, 0, z], [cx + width / 2, 0, z],
            [cx + width / 2, height, z], [cx - width / 2, height, z],
        ], dtype=np.float32)
    faces = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
    n = np.tile(np.array(normal, np.float32), (4, 1))
    return Mesh(verts, faces, normals=n, color=color, spec=0.05, shin=8, rim=0.05)


def _bench(pos, angle=0.0):
    out = []
    x, y, z = pos
    top = y + 0.45
    out.append(rounded_box(v(x, top, z), (0.44, 0.11, 1.25), radius_ratio=0.4,
                           seg=16, rings=7, color=(0.10, 0.10, 0.12),
                           spec=0.22, shin=18, rim=0.22))
    for s in (-1, 1):
        out.append(tube(v(x - 0.16, y + 0.02, z + s * 0.46),
                        v(x - 0.16, top - 0.05, z + s * 0.46),
                        [0.035, 0.035], seg=8, color=STEEL,
                        spec=0.5, shin=40, rim=0.3))
        out.append(tube(v(x + 0.16, y + 0.02, z + s * 0.46),
                        v(x + 0.16, top - 0.05, z + s * 0.46),
                        [0.035, 0.035], seg=8, color=STEEL,
                        spec=0.5, shin=40, rim=0.3))
    out.append(rounded_box(v(x, y + 0.04, z), (0.62, 0.08, 1.32),
                           radius_ratio=0.3, seg=12, rings=5, color=DARK_STEEL,
                           spec=0.3, shin=24, rim=0.2))
    return out


def _dumbbell(pos, size=1.0):
    x, y, z = pos
    out = []
    out.append(tube(v(x - 0.16 * size, y, z), v(x + 0.16 * size, y, z),
                    [0.018 * size] * 3, seg=8, color=(0.55, 0.56, 0.60),
                    spec=0.65, shin=70, rim=0.35))
    for s in (-1, 1):
        out.append(ellipsoid(v(x + s * 0.17 * size, y, z),
                             (0.055 * size, 0.075 * size, 0.075 * size),
                             seg=12, rings=8, color=(0.10, 0.10, 0.12),
                             spec=0.4, shin=32, rim=0.25))
    return out


def _plate_rack(pos):
    x, y, z = pos
    out = []
    for i in range(4):
        out.append(ellipsoid(v(x - 0.02, y + 0.35 + i * 0.22, z),
                             (0.028, 0.26, 0.26), seg=16, rings=9,
                             color=(0.11, 0.11, 0.13), spec=0.35, shin=28, rim=0.24))
        out.append(ellipsoid(v(x - 0.045, y + 0.35 + i * 0.22, z),
                             (0.012, 0.09, 0.09), seg=10, rings=6,
                             color=ACCENT if i % 2 == 0 else STEEL,
                             spec=0.35, shin=26, rim=0.24))
    out.append(tube(v(x, y, z), v(x, y + 1.25, z), [0.03, 0.03], seg=8,
                    color=STEEL, spec=0.5, shin=40, rim=0.3))
    return out


def _ceiling_light(pos, size=(0.9, 0.9)):
    x, y, z = pos
    out = []
    out.append(rounded_box(v(x, y, z), (size[0], 0.05, size[1]),
                           radius_ratio=0.4, seg=14, rings=5,
                           color=(0.95, 0.92, 0.85), spec=0.2, shin=10, rim=0.0,
                           emis=(0.55, 0.50, 0.40)))
    return out


def build_gym():
    """Décor statique : sol, murs, matériel, sources lumineuses."""
    sc = Scene()
    # sol carrelé (grandes dalles)
    for ix in range(-4, 5):
        for iz in range(-4, 5):
            c = FLOOR if (ix + iz) % 2 == 0 else (0.095, 0.099, 0.108)
            sc.add(_plane(ix * 2.0, 0, iz * 2.0, 2.0, 2.0, c,
                          spec=0.18, shin=30, rim=0.05))
    # murs
    sc.add(_wall(x=-6.4, width=15, normal=(1, 0, 0), color=WALL))
    sc.add(_wall(x=6.4, width=15, normal=(-1, 0, 0), color=WALL))
    sc.add(_wall(z=-6.4, width=15, normal=(0, 0, 1), color=WALL))
    sc.add(_wall(z=6.4, width=15, normal=(0, 0, -1), color=WALL))
    # panneaux muraux + liserés
    for i in range(-4, 5):
        sc.add(_wall(x=-6.35, width=1.1, height=4.2, color=WALL_PANEL, normal=(1, 0, 0)))
    for zz in (-5.9, -3.4, 3.4, 5.9):
        sc.add(rounded_box(v(-6.30, 2.35, zz), (0.04, 0.035, 2.2),
                           radius_ratio=0.5, seg=8, rings=4, color=(0.18, 0.17, 0.16),
                           spec=0.1, shin=10, rim=0.0, emis=(0.22, 0.13, 0.06)))
    sc.add(rounded_box(v(-6.28, 0.10, 0), (0.05, 0.07, 11.0),
                       radius_ratio=0.5, seg=8, rings=4, color=ACCENT,
                       spec=0.2, shin=16, rim=0.1, emis=(0.10, 0.04, 0.01)))
    # plafond + luminaires
    for zz in (-3.8, -1.2, 1.4, 4.0):
        for xx in (-3.6, 0.0, 3.6):
            for m in _ceiling_light((xx, 4.3, zz)):
                sc.add(m)
    # poutres
    for xx in (-5.0, 0.0, 5.0):
        sc.add(rounded_box(v(xx, 4.42, 0), (0.18, 0.14, 13.0), radius_ratio=0.3,
                           seg=10, rings=5, color=(0.09, 0.095, 0.105),
                           spec=0.1, shin=10, rim=0.05))
    # machines et accessoires
    for m in build_machine(PULLEY):
        sc.add(m)
    for m in _bench((0.15, 0, -3.15)):
        sc.add(m)
    for m in _bench((-3.3, 0, 2.0), angle=0):
        sc.add(m)
    for m in _plate_rack((3.6, 0, -3.6)):
        sc.add(m)
    # rack d'haltères au fond
    for tier in range(3):
        yy = 0.55 + tier * 0.28
        sc.add(rounded_box(v(-3.2, yy, -5.75), (2.4, 0.06, 0.32),
                           radius_ratio=0.2, seg=10, rings=4,
                           color=DARK_STEEL, spec=0.25, shin=20, rim=0.18))
        for i in range(6):
            for m in _dumbbell((-4.15 + i * 0.38, yy + 0.10, -5.72), size=0.8 + 0.05 * tier):
                sc.add(m)
    # panneaux lumineux diffus derrière le sujet (halo de salle de sport)
    for zz in (-1.0, 1.6):
        sc.add(rounded_box(v(-6.28, 2.05, zz), (0.06, 1.4, 0.9),
                           radius_ratio=0.4, seg=10, rings=5,
                           color=(0.85, 0.82, 0.75), spec=0.05, shin=8, rim=0.0,
                           emis=(0.42, 0.38, 0.32)))
    # colonnes
    for xx, zz in ((-5.6, -4.2), (5.6, -4.2), (-5.6, 4.2), (5.6, 4.2)):
        sc.add(rounded_box(v(xx, 2.2, zz), (0.24, 4.4, 0.24), radius_ratio=0.2,
                           seg=10, rings=5, color=(0.06, 0.065, 0.075),
                           spec=0.05, shin=8, rim=0.02))
    return sc


def background_for(cam, athlete_info=None, blur=1.6):
    """Pré-rendu du décor pour une caméra : couleur (float), profondeur."""
    sc = build_gym()
    color, depth = render(sc, cam, blur_bg=blur)
    img = to_image(color, exposure=1.0, gamma=1.0)
    # ombre de contact douce sous l'athlète
    if athlete_info is not None:
        sx, sy, z, ok = cam.project(np.array([
            athlete_info["ankle_l"], athlete_info["ankle_r"],
        ], dtype=np.float32))
        if ok.all():
            W, H = cam.width, cam.height
            layer = Image.new("L", (W, H), 0)
            d = ImageDraw.Draw(layer)
            cx = float((sx[0] + sx[1]) / 2)
            cy = float((sy[0] + sy[1]) / 2) + 6
            rx = max(60, abs(float(sx[0] - sx[1])) * 1.9 + 70)
            ry = rx * 0.28
            # plusieurs ellipses pour un dégradé doux
            for k in range(9, 0, -1):
                a = int(26 * (1 - k / 10) ** 1.3)
                d.ellipse([cx - rx * k / 9, cy - ry * k / 9,
                           cx + rx * k / 9, cy + ry * k / 9], fill=a)
            layer = layer.filter(ImageFilter.GaussianBlur(rx * 0.10))
            img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img,
                                  layer.point(lambda p: min(255, int(p * 2.2))))
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return arr, depth


def frame_scene(pose, glow=1.0):
    sc = Scene()
    meshes, info = build_athlete(pose, glow=glow)
    for m in meshes:
        sc.add(m)
    sc.add(cable_mesh(PULLEY, info["bar"]))
    return sc, info


def overlay_scene(pose, glow=1.0):
    sc = Scene()
    for m in build_muscle_overlay(pose, glow=glow):
        sc.add(m)
    return sc


def render_frame(cam, bg_color, bg_depth, pose, glow=1.0, muscle_alpha=0.0):
    """3 passes : décor → athlète → surimpression musculaire (X-ray)."""
    sc, info = frame_scene(pose, glow=glow)
    color, depth = render(sc, cam, background=bg_color, bg_depth=bg_depth,
                          blur_bg=0.0)
    if muscle_alpha > 0:
        ov = overlay_scene(pose, glow=glow)
        dark = np.zeros_like(color)
        ov_col, _ = render(ov, cam, background=dark, bg_depth=bg_depth.copy(),
                           blur_bg=0.0, fog_density=0.0)
        lum = ov_col.max(axis=2)
        cov = np.clip((lum - 0.02) * 12.0, 0, 1) * muscle_alpha
        m = cov > 0.004
        if m.any():
            c = cov[m][:, None]
            color[m] = color[m] * (1 - c) + ov_col[m] * c
    return color, depth, info
