"""Athlète 3D articulé + matériel de poulie pour la démonstration triceps.

Le personnage est construit à partir de primitives lissées : torse en sections,
membres fuselés, tête, mains, vêtements, puis surimpressions musculaires rouges
(chef long, chef latéral, chef médial du triceps) et orange (deltoïde antérieur,
brachioradial). Tout est déterministe et paramétré par la pose.
"""
from __future__ import annotations

import numpy as np

from engine3d import (
    Camera, Mesh, Scene, basis_from_axis, ellipsoid, loft, norm, rotation,
    rounded_box, smoothstep, translate, tube, v,
)

SKIN = (0.80, 0.585, 0.470)
SKIN_DARK = (0.74, 0.53, 0.42)
SHIRT = (0.66, 0.10, 0.13)
SHIRT_DARK = (0.48, 0.07, 0.10)
SHORTS = (0.075, 0.080, 0.095)
SHOE = (0.10, 0.105, 0.12)
ACCENT = (0.93, 0.43, 0.13)
STEEL = (0.30, 0.33, 0.37)
RUBBER = (0.055, 0.058, 0.065)
TRICEPS = (0.86, 0.10, 0.08)
TRICEPS2 = (0.72, 0.06, 0.06)
TRICEPS3 = (0.96, 0.22, 0.10)
SECONDARY = (0.95, 0.55, 0.14)


def partial_tube(p0, p1, radii, a0, a1, seg=14, color=(0.8, 0.1, 0.1), **mat):
    """Coque partielle autour d'un segment : sert à « peindre » un muscle."""
    p0 = np.asarray(p0, dtype=np.float32)
    p1 = np.asarray(p1, dtype=np.float32)
    axis = p1 - p0
    d = axis / max(np.linalg.norm(axis), 1e-6)
    u, w = basis_from_axis(d)
    n = len(radii)
    verts = []
    for k, r in enumerate(radii):
        c = p0 + axis * (k / (n - 1))
        for i in range(seg):
            a = a0 + (a1 - a0) * i / (seg - 1)
            verts.append(c + u * np.cos(a) * r + w * np.sin(a) * r)
    faces = []
    for k in range(n - 1):
        for i in range(seg - 1):
            a = k * seg + i
            b = a + 1
            c = a + seg
            dd = c + 1
            faces.append((a, c, b))
            faces.append((b, c, dd))
    return Mesh(verts, faces, color=color, **mat)


def _profile(radii, t):
    n = len(radii) - 1
    x = max(0.0, min(1.0, t)) * n
    i = int(np.floor(x))
    j = min(i + 1, n)
    f = x - i
    return radii[i] * (1 - f) + radii[j] * f


def _smooth_bump(x, lo, hi, soft=0.10):
    """1 au cœur de [lo, hi], dégradé doux sur `soft` de part et d'autre."""
    up = np.clip((x - lo) / soft, 0, 1)
    down = np.clip((hi - x) / soft, 0, 1)
    return np.minimum(up, down)


def build_arm(side, shoulder, elbow, wrist, pose, muscle_glow=1.0):
    """Bras complet + muscles triceps surlignés (peinture faciale)."""
    from engine3d import face_centroids, face_normals, paint

    out = []
    g = float(muscle_glow)
    axis = elbow - shoulder
    d_upper = norm(axis)
    # repère du bras : `back` = vers l'arrière, `out` = vers l'extérieur
    back = v(-1.0, 0.0, 0.0)
    back = norm(back - d_upper * float(back @ d_upper))
    out_dir = norm(np.cross(d_upper, back))
    if float(out_dir[2]) * side < 0:
        out_dir = -out_dir

    def local(p):
        return (float((p - shoulder) @ back), float((p - shoulder) @ out_dir),
                float((p - shoulder) @ d_upper))

    # ---------------------------------------------------------- deltoïde ---
    delt = ellipsoid(shoulder + v(-0.006, -0.020, side * 0.002),
                     (0.076, 0.092, 0.086), seg=20, rings=13,
                     color=SKIN, spec=0.10, shin=16, rim=0.26)
    c = face_centroids(delt)
    n = face_normals(delt)
    # face antérieure du deltoïde = -back, orientée vers l'avant du corps
    front = np.clip(-(n @ back), 0, 1) ** 1.2
    lo = np.clip(((c - shoulder) @ v(0, 1, 0)) / 0.07, 0, 1)
    w = front * np.clip(0.35 + lo, 0, 1)
    out.append(paint(delt, w * 0.72, (0.86, 0.48, 0.11), emission=(0.055 * g, 0.026 * g, 0.0)))
    # ------------------------------------------------------ haut du bras ---
    upper_radii = [0.052, 0.072, 0.086, 0.092, 0.090, 0.083, 0.072, 0.062, 0.056]
    arm_m = tube(shoulder, elbow, upper_radii, seg=30, color=SKIN,
                 spec=0.09, shin=20, rim=0.34)
    c = face_centroids(arm_m)
    n = face_normals(arm_m)
    t = (c - shoulder) @ axis / float(axis @ axis)
    back_w = np.clip((n @ back) * 1.35 + 0.05, 0, 1) ** 0.85
    inner = np.clip((c - shoulder) @ out_dir * (-side) / 0.05 + 0.5, 0, 1)
    long_head = back_w * _smooth_bump(t, 0.06, 0.90, 0.16) * (0.30 + 0.70 * inner)
    lateral = back_w * _smooth_bump(t, 0.10, 0.86, 0.16) * (0.30 + 0.70 * (1 - inner))
    medial = back_w * _smooth_bump(t, 0.62, 1.00, 0.14)
    side_w = np.clip(np.abs(n @ out_dir) * 1.25 - 0.10, 0, 1) * _smooth_bump(t, 0.16, 0.90, 0.14)
    weight = np.clip(np.maximum.reduce([long_head, lateral, medial * 0.95, side_w * 0.62]) * 1.35, 0, 1)
    tone = np.where(long_head >= lateral, 1.0, 2.0)
    tone = np.where(medial > 0.62, 3.0, tone)
    col = np.tile(np.array(TRICEPS, np.float32), (len(arm_m.faces), 1))
    col[tone == 2.0] = TRICEPS2
    col[tone == 3.0] = TRICEPS3
    out.append(paint(arm_m, weight, col, emission=(0.30 * g, 0.015 * g, 0.006 * g)))
    # deltoïde déjà peint ci-dessus
    # ---------------------------------------------------------- avant-bras --
    fore_radii = [0.052, 0.068, 0.062, 0.043, 0.036]
    fore = tube(elbow, wrist, fore_radii, seg=18, color=SKIN,
                spec=0.10, shin=18, rim=0.34)
    c = face_centroids(fore)
    n = face_normals(fore)
    tf = (c - elbow) @ (wrist - elbow) / float((wrist - elbow) @ (wrist - elbow))
    up_out = np.clip(-(n @ back) * 0.55 + (n @ out_dir) * 0.75 + 0.15, 0, 1)
    wb = up_out * _smooth_bump(tf, 0.02, 0.62, 0.16) * 0.8
    out.append(paint(fore, wb, SECONDARY, emission=(0.10 * g, 0.045 * g, 0.0)))
    out.append(ellipsoid(elbow, (0.052, 0.055, 0.055), seg=14, rings=9,
                         color=SKIN, spec=0.09, shin=16, rim=0.30))
    # main (poing fermé autour de la barre)
    hand_c = wrist + v(0.030, -0.010, 0)
    out.append(rounded_box(hand_c, (0.082, 0.098, 0.072), radius_ratio=0.42,
                           seg=14, rings=8, color=SKIN_DARK, spec=0.09, shin=14, rim=0.26))
    out.append(ellipsoid(hand_c + v(0.030, -0.030, -side * 0.030),
                         (0.030, 0.024, 0.022), seg=10, rings=7,
                         color=SKIN_DARK, spec=0.08, shin=12, rim=0.22))
    info = {
        "triceps": shoulder + axis * 0.62 + back * 0.07,
        "deltoid": shoulder + v(0.05, 0.01, side * 0.06),
        "forearm": elbow + (wrist - elbow) * 0.30 - back * 0.03,
    }
    return out, info


def build_leg(side, hip, knee, ankle, foot_forward):
    out = []
    # cuisse
    out.append(tube(hip, knee, [0.108, 0.122, 0.112, 0.082], seg=16,
                    color=(0.22, 0.21, 0.22), spec=0.06, shin=10, rim=0.22))
    # genou
    out.append(ellipsoid(knee, (0.072, 0.075, 0.070), seg=14, rings=9,
                         color=(0.22, 0.21, 0.22), spec=0.05, shin=10, rim=0.20))
    # tibia + mollet
    out.append(tube(knee, ankle, [0.060, 0.070, 0.050, 0.036], seg=14,
                    color=(0.74, 0.54, 0.43), spec=0.09, shin=16, rim=0.30))
    calf = knee + (ankle - knee) * 0.36 + v(-0.022, 0, 0)
    out.append(ellipsoid(calf, (0.052, 0.095, 0.058), seg=14, rings=9,
                         color=(0.74, 0.54, 0.43), spec=0.09, shin=16, rim=0.30))
    # chaussette (manchon ouvert autour de la cheville)
    sock_top = ankle + (knee - ankle) * 0.19
    out.append(tube(sock_top, ankle + v(0.008, -0.045, 0),
                    [0.047, 0.048, 0.046, 0.044], seg=14,
                    color=(0.88, 0.88, 0.90), spec=0.05, shin=8, rim=0.12,
                    caps=False))
    # chaussure
    shoe_c = ankle + v(0.065, -0.035, 0)
    out.append(rounded_box(shoe_c, (0.30, 0.105, 0.125), radius_ratio=0.45,
                           seg=16, rings=8, color=SHOE, spec=0.16, shin=20, rim=0.28))
    out.append(rounded_box(shoe_c + v(0.0, -0.052, 0), (0.31, 0.030, 0.128),
                           radius_ratio=0.5, seg=14, rings=6, color=ACCENT,
                           spec=0.10, shin=14, rim=0.20))
    # lacets / languette
    out.append(rounded_box(shoe_c + v(0.045, 0.045, 0), (0.15, 0.045, 0.09),
                           radius_ratio=0.5, seg=12, rings=5,
                           color=(0.16, 0.16, 0.18), spec=0.08, shin=10, rim=0.2))
    return out


def skeleton(pose):
    """Points articulaires (mètres, X avant, Y haut, Z gauche)."""
    bob = pose.get("bob", 0.0)
    lean = np.radians(pose.get("lean", 7.0))
    elbow_deg = pose.get("elbow", 95.0)
    pelvis = v(0.0, 0.955 + bob, 0.0)
    # ceinture pelvienne
    hip_l = pelvis + v(0.0, 0.0, 0.105)
    hip_r = pelvis + v(0.0, 0.0, -0.105)
    knee_l = v(0.055, 0.500, 0.116)
    knee_r = v(-0.035, 0.500, -0.116)
    ankle_l = v(0.115, 0.080, 0.124)
    ankle_r = v(-0.075, 0.080, -0.124)

    chest = pelvis + v(np.sin(lean) * 0.50, 0.50, 0.0)
    neck = chest + v(0.012, 0.075, 0.0)
    head = neck + v(0.028, 0.095, 0.0)

    shoulder_l = chest + v(0.005, -0.045, 0.232)
    shoulder_r = chest + v(0.005, -0.045, -0.232)
    elbow_l = shoulder_l + v(0.075, -0.285, 0.040)
    elbow_r = shoulder_r + v(0.075, -0.285, -0.040)

    def wrist_of(elbow, side):
        a = np.radians(elbow_deg)
        # la main reste sur une barre horizontale : léger rentrement en Z
        return elbow + v(np.sin(a) * 0.275, -np.cos(a) * 0.275, side * 0.048)

    wrist_l = wrist_of(elbow_l, +1)
    wrist_r = wrist_of(elbow_r, -1)
    bar = (wrist_l + wrist_r) / 2 + v(0.045, -0.005, 0)
    return dict(
        pelvis=pelvis, chest=chest, neck=neck, head=head,
        shoulder_l=shoulder_l, shoulder_r=shoulder_r,
        elbow_l=elbow_l, elbow_r=elbow_r,
        wrist_l=wrist_l, wrist_r=wrist_r, bar=bar,
        hip_l=hip_l, hip_r=hip_r, knee_l=knee_l, knee_r=knee_r,
        ankle_l=ankle_l, ankle_r=ankle_r,
    )


def build_athlete(pose, glow=1.0):
    S = skeleton(pose)
    meshes = []
    # ------------------------------------------------------------- torse ----
    lean = np.radians(pose.get("lean", 7.0))
    def cx(y):
        return np.tan(lean) * (y - 0.955)

    rings = [
        (0.855, 0.118, 0.152, cx(0.855), 0.0),
        (0.905, 0.130, 0.172, cx(0.905), 0.0),
        (0.965, 0.135, 0.180, cx(0.965), 0.0),
        (1.020, 0.122, 0.158, cx(1.020), 0.004),
        (1.075, 0.125, 0.156, cx(1.075), 0.008),
        (1.150, 0.140, 0.172, cx(1.150), 0.012),
        (1.235, 0.148, 0.196, cx(1.235), 0.016),
        (1.320, 0.156, 0.214, cx(1.320), 0.020),
        (1.395, 0.150, 0.224, cx(1.395), 0.022),
        (1.445, 0.130, 0.204, cx(1.445), 0.022),
        (1.480, 0.100, 0.150, cx(1.480), 0.018),
    ]
    meshes.append(loft(rings, seg=26, color=SKIN, n=2.35, spec=0.10, shin=16, rim=0.28))
    # trapèzes / cou
    meshes.append(ellipsoid((cx(1.47) - 0.01, 1.468, 0), (0.092, 0.062, 0.148),
                            seg=18, rings=10, color=SKIN, spec=0.1, shin=14, rim=0.25))
    meshes.append(tube((cx(1.46), 1.462, 0), (cx(1.60) + 0.018, 1.610, 0),
                       [0.060, 0.062, 0.055], seg=16, color=SKIN, spec=0.1,
                       shin=16, rim=0.3))
    # ------------------------------------------------------------ tête ------
    hc = v(cx(1.600) + 0.032, 1.690, 0)
    meshes.append(ellipsoid(hc, (0.089, 0.112, 0.086), seg=22, rings=14,
                            color=SKIN, spec=0.13, shin=24, rim=0.30))
    # mâchoire / menton
    meshes.append(ellipsoid(hc + v(0.006, -0.060, 0), (0.058, 0.058, 0.062),
                            seg=16, rings=10, color=SKIN, spec=0.10, shin=18, rim=0.26))
    # nez discret
    meshes.append(ellipsoid(hc + v(0.082, -0.012, 0), (0.020, 0.026, 0.017),
                            seg=10, rings=7, color=SKIN, spec=0.08, shin=12, rim=0.2))
    # lunettes de soleil
    meshes.append(rounded_box(hc + v(0.072, 0.022, 0), (0.028, 0.026, 0.126),
                              radius_ratio=0.5, seg=14, rings=6,
                              color=(0.035, 0.035, 0.042), spec=0.70, shin=80, rim=0.40))
    meshes.append(tube(hc + v(0.055, 0.022, -0.062), hc + v(-0.02, 0.030, -0.080),
                       [0.006, 0.006], seg=6, color=(0.05, 0.05, 0.06)))
    meshes.append(tube(hc + v(0.055, 0.022, 0.062), hc + v(-0.02, 0.030, 0.080),
                       [0.006, 0.006], seg=6, color=(0.05, 0.05, 0.06)))
    for s_ in (-1, 1):
        meshes.append(ellipsoid(hc + v(-0.014, -0.006, s_ * 0.080),
                                (0.022, 0.030, 0.012), seg=10, rings=7,
                                color=SKIN, spec=0.08, shin=12, rim=0.2))
    # casquette
    meshes.append(ellipsoid(hc + v(-0.006, 0.050, 0), (0.096, 0.076, 0.092),
                            seg=22, rings=11, color=(0.075, 0.075, 0.085),
                            spec=0.16, shin=24, rim=0.32))
    meshes.append(rounded_box(hc + v(0.100, 0.036, 0), (0.130, 0.020, 0.120),
                              radius_ratio=0.45, seg=16, rings=6,
                              color=(0.065, 0.065, 0.075), spec=0.20, shin=26, rim=0.30))
    # ---------------------------------------------------------- épaules -----
    arm_l, info_l = build_arm(+1, S["shoulder_l"], S["elbow_l"], S["wrist_l"], pose, glow)
    arm_r, info_r = build_arm(-1, S["shoulder_r"], S["elbow_r"], S["wrist_r"], pose, glow)
    meshes += arm_l + arm_r
    # ----------------------------------------------------------- jambes -----
    leg_l = build_leg(+1, S["hip_l"], S["knee_l"], S["ankle_l"], True)
    leg_r = build_leg(-1, S["hip_r"], S["knee_r"], S["ankle_r"], False)
    # short : bassin + hauts de cuisse
    meshes.append(loft([
        (0.858, 0.148, 0.196, cx(0.858), 0.0),
        (0.905, 0.156, 0.202, cx(0.905), 0.0),
        (0.960, 0.152, 0.196, cx(0.960), 0.002),
        (1.012, 0.134, 0.172, cx(1.012), 0.004),
    ], seg=26, color=SHORTS, n=2.3, spec=0.06, shin=12, rim=0.18))
    for (hip, knee) in ((S["hip_l"], S["knee_l"]), (S["hip_r"], S["knee_r"])):
        a = hip + (knee - hip) * 0.02 + v(0, 0.0, 0)
        b = hip + (knee - hip) * 0.34
        meshes.append(tube(a, b, [0.140, 0.148, 0.144, 0.138], seg=18, color=SHORTS,
                           spec=0.05, shin=10, rim=0.16, caps=False))
        # revers du short
        meshes.append(tube(b - (knee - hip) * 0.04, b, [0.141, 0.140], seg=18,
                           color=(0.11, 0.115, 0.13), spec=0.08, shin=12, rim=0.16,
                           caps=False))
    meshes += leg_l + leg_r
    # ------------------------------------------------------------ brassière -
    # haut rouge (tank) : du bassin au haut du sternum, plus les bretelles
    top = 1.452
    shirt_rings = []
    for (y, rx, rz, cxx, cz) in rings:
        if 1.005 <= y <= top:
            shirt_rings.append((y, rx * 1.025, rz * 1.025, cxx, cz))
    shirt_rings.append((top, 0.128, 0.168, cx(top), 0.020))
    meshes.append(loft(shirt_rings, seg=26, color=SHIRT, n=2.35,
                       spec=0.06, shin=8, rim=0.16))
    # bretelles
    for s in (-1, 1):
        a = v(cx(1.40) + 0.10, 1.40, s * 0.105)
        b = v(cx(1.47) - 0.02, 1.475, s * 0.125)
        c = v(cx(1.42) - 0.115, 1.40, s * 0.095)
        meshes.append(tube(a, b, [0.034, 0.038, 0.032], seg=10, color=SHIRT,
                           spec=0.05, shin=6, rim=0.12))
        meshes.append(tube(b, c, [0.036, 0.038, 0.030], seg=10, color=SHIRT,
                           spec=0.05, shin=6, rim=0.12))
    # --------------------------------------------------------- barre + câble --
    bar = S["bar"]
    bar_mesh = tube(bar + v(0, 0, -0.30), bar + v(0, 0, 0.30),
                    [0.020, 0.021, 0.021, 0.020], seg=12, color=(0.24, 0.25, 0.28),
                    spec=0.55, shin=60, rim=0.45)
    meshes.append(bar_mesh)
    for s in (-1, 1):
        meshes.append(tube(bar + v(0, 0, s * 0.175), bar + v(0, 0, s * 0.215),
                           [0.026, 0.026], seg=10, color=(0.12, 0.12, 0.14),
                           spec=0.2, shin=20, rim=0.2))
    # mousqueton
    meshes.append(ellipsoid(bar + v(0, 0.02, 0), (0.018, 0.035, 0.018),
                            seg=10, rings=6, color=(0.62, 0.63, 0.66),
                            spec=0.6, shin=50, rim=0.4))
    info = {
        "bar": bar,
        "triceps_l": info_l["triceps"],
        "triceps_r": info_r["triceps"],
        "deltoid": info_l["deltoid"],
        "forearm": info_l["forearm"],
        "shoulder": S["shoulder_l"],
        "wrist": S["wrist_l"],
        "pelvis": S["pelvis"],
        "head": S["head"],
        "ankle_l": S["ankle_l"],
        "ankle_r": S["ankle_r"],
    }
    return meshes, info


def cable_mesh(pulley, bar, radius=0.0075):
    """Câble tendu entre la poulie et le mousqueton de la barre."""
    top = np.asarray(pulley, dtype=np.float32)
    bot = np.asarray(bar, dtype=np.float32) + v(0, 0.035, 0)
    mid = (top + bot) / 2 + v(0, -0.02, 0)
    pts = np.array([top, mid, mid + (bot - top) * 0.02, bot], dtype=np.float32)
    from engine3d import bezier_tube
    return bezier_tube(pts, radius, seg=7, steps=10, color=(0.10, 0.105, 0.12),
                       spec=0.5, shin=40, rim=0.25)


def build_machine(pulley=(0.95, 2.35, -0.95)):
    """Station de poulie haute compacte (colonne, poulie, pile de poids)."""
    px, py, pz = pulley
    out = []
    col = v(1.22, 0, -1.12)
    out.append(rounded_box(col + v(0, 1.30, 0), (0.13, 2.62, 0.13),
                           radius_ratio=0.25, seg=14, rings=7, color=(0.16, 0.17, 0.20),
                           spec=0.35, shin=30, rim=0.3))
    # bras de poulie
    out.append(rounded_box(v(px, py + 0.16, pz), (0.11, 0.11, 0.62),
                           radius_ratio=0.3, seg=12, rings=6,
                           color=(0.14, 0.15, 0.18), spec=0.32, shin=28, rim=0.3))
    # poulie
    out.extend(_pulley_wheel(v(px, py, pz)))
    # pile de poids
    for i in range(9):
        y = 0.22 + i * 0.076
        out.append(rounded_box(v(1.185, y, -1.12), (0.30, 0.064, 0.22),
                               radius_ratio=0.18, seg=12, rings=5,
                               color=(0.21, 0.22, 0.25), spec=0.45, shin=36, rim=0.32))
        out.append(rounded_box(v(1.185, y, -1.005), (0.06, 0.066, 0.02),
                               radius_ratio=0.3, seg=8, rings=4,
                               color=ACCENT, spec=0.2, shin=20, rim=0.2))
    # tige de guidage
    for zz in (-1.235, -1.005):
        out.append(tube(v(1.24, 0.12, zz), v(1.24, 1.05, zz), [0.012, 0.012], seg=8,
                        color=(0.55, 0.56, 0.60), spec=0.7, shin=80, rim=0.4))
    # pieds
    out.append(rounded_box(v(1.25, 0.045, -1.12), (0.66, 0.09, 0.30),
                           radius_ratio=0.2, seg=12, rings=5,
                           color=(0.13, 0.14, 0.16), spec=0.3, shin=24, rim=0.24))
    # poignée de réglage
    out.append(ellipsoid(v(1.17, 1.32, -1.13), (0.035, 0.035, 0.035), seg=10, rings=7,
                         color=(0.55, 0.20, 0.12), spec=0.3, shin=24, rim=0.2))
    return out


def _pulley_wheel(c, radius=0.115):
    out = []
    u, w = basis_from_axis(v(0, 0, 1))
    # jante
    out.append(tube(c + v(0, 0, -0.03), c + v(0, 0, 0.03),
                    [radius, radius, radius], seg=20,
                    color=(0.10, 0.10, 0.12), spec=0.4, shin=30, rim=0.3))
    # flasques
    for s in (-1, 1):
        out.append(ellipsoid(c + v(0, 0, s * 0.045), (radius, radius, 0.018),
                             seg=18, rings=8, color=(0.14, 0.15, 0.17),
                             spec=0.35, shin=26, rim=0.28))
    return out


# --------------------------------------------------- surimpression muscles ---
def _orient(axis, ref=(0, 0, 1)):
    from engine3d import basis_from_axis
    d = norm(axis)
    u, w = basis_from_axis(d, ref)
    return d, u, w


def _belly(center, d, u, w, length, width, bulge=1.0, color=TRICEPS,
           emis=(0.10, 0.008, 0.004), spec=0.35, shin=34, rim=0.32, fibers=0.0):
    from engine3d import ellipsoid, face_centroids
    R = np.stack([u, d, w], axis=1).astype(np.float32)
    m = ellipsoid((0, 0, 0), (width * 0.60, length * 0.5, width * bulge),
                  seg=20, rings=14, rot=R, color=color, spec=spec, shin=shin,
                  rim=rim, emis=emis)
    m = m.transform(translate(center))
    if fibers:
        # striations légères dans le sens des fibres (relief de surface)
        c = face_centroids(m) - np.asarray(center, dtype=np.float32)
        t = (c @ np.asarray(d, np.float32)) / max(length, 1e-6)
        k = 0.82 + 0.18 * np.cos(t * 46.0 + (c @ np.asarray(u, np.float32)) * 60.0)
        base = m.color if m.color.ndim == 2 else np.tile(m.color, (len(m.faces), 1))
        m.color = (base * k.astype(np.float32)[:, None]).astype(np.float32)
    return m


def build_muscle_overlay(pose, glow=1.0):
    """Trois chefs du triceps + deltoïde antérieur + brachioradial.

    Maillages « X-ray » dessinés par-dessus le corps : lisibles de face comme
    de dos, comme une planche d'anatomie fonctionnelle.
    """
    S = skeleton(pose)
    g = float(glow)
    meshes = []
    for side, sh, el, wr in ((1, S["shoulder_l"], S["elbow_l"], S["wrist_l"]),
                             (-1, S["shoulder_r"], S["elbow_r"], S["wrist_r"])):
        axis = el - sh
        d, u, w = _orient(axis)
        back = v(-1, 0, 0)
        back = norm(back - d * float(back @ d))
        outer = np.cross(d, back)
        if float(outer[2]) * side < 0:
            outer = -outer
        fwd = norm(v(1, 0, 0) - d * float(v(1, 0, 0) @ d))
        # ---- chef long : face postéro-médiale, du haut du bras au coude ----
        c_long = sh + d * 0.28 + back * 0.049 - outer * 0.026
        meshes.append(_belly(c_long, d, back, outer, length=0.20, width=0.050,
                             bulge=1.0, color=(0.62, 0.035, 0.028),
                             emis=(0.16 * g, 0.008 * g, 0.004 * g), fibers=1.0))
        # ---- chef latéral : face postéro-externe, plus haut ----
        c_lat = sh + d * 0.25 + back * 0.050 + outer * 0.030
        meshes.append(_belly(c_lat, d, back, outer, length=0.165, width=0.044,
                             bulge=0.95, color=(0.50, 0.022, 0.020),
                             emis=(0.13 * g, 0.006 * g, 0.003 * g), fibers=1.0))
        # ---- chef médial : près du coude, plus clair ----
        c_med = sh + d * 0.44 + back * 0.042 - outer * 0.014
        meshes.append(_belly(c_med, d, back, outer, length=0.115, width=0.046,
                             bulge=0.9, color=(0.74, 0.10, 0.055),
                             emis=(0.14 * g, 0.012 * g, 0.005 * g), fibers=1.0))
        # ---- tendon distal vers l'olécrâne ----
        meshes.append(_belly(sh + d * 0.50 + back * 0.030, d, back, outer,
                             length=0.075, width=0.024, bulge=0.7,
                             color=(0.88, 0.78, 0.68),
                             emis=(0.05 * g, 0.045 * g, 0.035 * g)))
        # ---- deltoïde antérieur (secondaire) ----
        c_delt = sh - d * 0.03 + fwd * 0.052 + outer * 0.018
        meshes.append(_belly(c_delt, d, fwd, outer, length=0.105, width=0.058,
                             bulge=0.95, color=(0.72, 0.36, 0.05),
                             emis=(0.09 * g, 0.038 * g, 0.002 * g), fibers=1.0))
        # ---- brachioradial (secondaire) ----
        df, uf, wf = _orient(wr - el)
        ff = norm(v(1, 0, 0) - df * float(v(1, 0, 0) @ df))
        fo = np.cross(df, ff)
        if float(fo[2]) * side < 0:
            fo = -fo
        cf = el + df * 0.085 + ff * 0.024 + fo * 0.020
        meshes.append(_belly(cf, df, ff, fo, length=0.125, width=0.034,
                             bulge=1.0, color=(0.66, 0.28, 0.04),
                             emis=(0.06 * g, 0.024 * g, 0.001 * g), fibers=1.0))
    return meshes
