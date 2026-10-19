"""Vêtements découpés sur la peau, bord découpé au ras du champ (pas de dents).

La source est la peau réelle ; chaque pièce est la région où le champ de poids
dépasse 0,5. Les triangles traversés par la frontière sont découpés le long de
la courbe de niveau : le bord du tissu est lisse à l'échelle du pixel.
"""
from __future__ import annotations

import numpy as np

from engine3d import Mesh, smoothstep, vertex_normals
import body
import outfit
import normals as N

_C = {}


def _skin_normals():
    if "n" in _C:
        return _C["n"]
    v, f = body.skin()
    n, _, _ = N.outward(v, f, vertex_normals(v, f))
    _C["n"] = n
    return n


def cut(field, level=0.0):
    """Découpe le maillage de la peau sur l'iso-niveau du champ.

    Retourne (used_verts, faces, is_border) : géométrie indexée sur les sommets
    d'origine + les sommets créés sur la frontière.
    """
    v, f = body.skin()
    s = field - level
    inside = s >= 0.0
    nf = f.shape[0]
    fi = inside[f]
    cnt = fi.sum(1)
    keep = cnt > 0
    idx = np.nonzero(keep)[0]
    allin = cnt[idx] == 3
    mixed = idx[~allin]
    out_verts = []
    out_faces = []
    remap = {}
    used = []
    parents = []

    def vorig(i):
        k = ("o", int(i))
        if k not in remap:
            remap[k] = len(out_verts)
            out_verts.append(v[i])
            used.append(int(i))
            parents.append((int(i), -1))
        return remap[k]

    def vnew(i, j):
        a, b = (int(i), int(j)) if int(i) < int(j) else (int(j), int(i))
        k = ("n", a, b)
        if k not in remap:
            remap[k] = len(out_verts)
            t = s[a] / (s[a] - s[b])
            out_verts.append(v[a] + t * (v[b] - v[a]))
            used.append(-1)
            parents.append((a, b, t))
        return remap[k]

    for fi_ in idx[allin]:
        out_faces.append([vorig(int(f[fi_, 0])), vorig(int(f[fi_, 1])), vorig(int(f[fi_, 2]))])

    for fi_ in mixed:
        tri = f[fi_]
        sgn = inside[tri]
        if sgn.all() or not sgn.any():
            continue
        poly = []
        for k in range(3):
            a, b = int(tri[k]), int(tri[(k + 1) % 3])
            if inside[a]:
                poly.append(("o", a))
            if inside[a] != inside[b]:
                poly.append(("n", a, b))
        pts = []
        for p in poly:
            if p[0] == "o":
                pts.append(vorig(p[1]))
            else:
                pts.append(vnew(p[1], p[2]))
        for t in range(1, len(pts) - 1):
            out_faces.append([pts[0], pts[t], pts[t + 1]])
    return (np.array(out_verts, np.float32), np.array(out_faces, np.int32),
            used, parents)


def border_vertices(faces, nverts):
    e = np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]])
    s = np.sort(e, 1)
    key = s[:, 0].astype(np.int64) * 1000003 + s[:, 1]
    uniq, inv, cnt = np.unique(key, return_inverse=True, return_counts=True)
    b = e[cnt[inv] == 1]
    return np.unique(b)


def piece(field, color, off=0.009, spec=0.22, shin=30, rim=0.26):
    vv, ff, used, parents = cut(field)
    if len(ff) == 0:
        return None
    # élimine les triangles dégénérés (normales nulles -> pixels noirs)
    a, b, c = vv[ff[:, 0]], vv[ff[:, 1]], vv[ff[:, 2]]
    area = 0.5 * np.linalg.norm(np.cross(b - a, c - a), axis=1)
    if (area < 5e-9).any():
        ff = ff[area >= 5e-9]
        if len(ff) == 0:
            return None
    nv = _skin_normals()
    nn = np.zeros((len(vv), 3), np.float32)
    for k, i in enumerate(used):
        if i >= 0:
            nn[k] = nv[i]
    # décollage uniforme : la pièce ne coïncide jamais avec la peau
    vv = vv + nn * off
    # ne garde que la plus grande île connexe (supprime les lambeaux)
    ff = _largest_island(ff, len(vv))
    if len(ff) == 0:
        return None
    col = np.tile(color, (len(ff), 1))
    nn = _fill_normals(nn, ff, len(vv))
    # poids de rig par sommet de la pièce (interpolés depuis la peau)
    ws = body.arm_weight(body.skin()[0])
    warm = {}
    for side, w in ws.items():
        arr = np.zeros(len(vv), np.float32)
        for k, p in enumerate(parents):
            if len(p) == 2:
                arr[k] = w[p[0]]
            else:
                arr[k] = w[p[0]] * (1 - p[2]) + w[p[1]] * p[2]
        warm[side] = arr
    return dict(verts=vv, faces=ff, color=col.astype(np.float32), spec=spec,
                shin=shin, rim=rim, nverts=len(vv), warm=warm, normals=nn)


def _largest_island(ff, nv):
    """Garde la plus grande composante connexe de faces."""
    parent = np.arange(nv)

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for tri in ff:
        r0 = find(int(tri[0]))
        for k in (1, 2):
            r = find(int(tri[k]))
            if r != r0:
                parent[r] = r0
    roots = np.array([find(int(t)) for t in ff[:, 0]])
    uniq, cnt = np.unique(roots, return_counts=True)
    # garde toutes les îles importantes (deux jambes, deux mains…), jette les lambeaux
    keep = uniq[cnt >= max(6, 0.10 * cnt.max())]
    return ff[np.isin(roots, keep)]


def _fill_normals(nn, ff, nv):
    """Normales des sommets créés (et secours) = moyenne des normales voisines."""
    acc = np.zeros((nv, 3), np.float32)
    cnt = np.zeros(nv, np.float32)
    for i in range(3):
        np.add.at(acc, ff[:, i], nn[ff].sum(1) * 0 + 1.0)
        np.add.at(cnt, ff[:, i], 1.0)
    out = nn.copy()
    bad = np.linalg.norm(out, axis=1) < 1e-6
    if bad.any() and len(ff):
        nb_acc = np.zeros((nv, 3), np.float32)
        for i in range(3):
            np.add.at(nb_acc, ff[:, i], nn[ff[:, (i + 1) % 3]] + nn[ff[:, (i + 2) % 3]])
        fallback = nb_acc / np.maximum(np.linalg.norm(nb_acc, axis=1, keepdims=True), 1e-6)
        out[bad] = fallback[bad]
    ln = np.linalg.norm(out, axis=1, keepdims=True)
    return out / np.maximum(ln, 1e-6)


def pieces():
    if "p" in _C:
        return _C["p"]
    v, f = body.skin()
    w = outfit.fields(v)
    out = {}
    for k, col, off in (("tank", outfit.SHIRT, 0.008), ("shorts", outfit.SHORTS, 0.010),
                        ("socks", outfit.SOCK, 0.006), ("shoes", outfit.SHOE, 0.007),
                        ("gloves", outfit.GLOVE, 0.005), ("cap", outfit.CAP, 0.007)):
        p = piece(w[k], col, off=off)
        if p is not None:
            out[k] = p
    _C["p"] = out
    return out


def realize(pcs, theta, lean):
    """Pose chaque pièce avec la même transformation que la peau."""
    out = {}
    for k, p in pcs.items():
        posed = body.pose_weighted(p["verts"], p["warm"], theta, lean)
        out[k] = Mesh(posed, p["faces"], normals=p["normals"], color=p["color"],
                      spec=p["spec"], shin=p["shin"], rim=p["rim"])
    return out


def brim(lean, y0=1.672):
    from engine3d import rounded_box
    c = np.array([0.130, y0, 0.0], np.float32)
    m = rounded_box(c, (0.190, 0.013, 0.106), radius_ratio=0.46, seg=20, rings=6,
                    color=outfit.CAP, spec=0.26, shin=34, rim=0.28)
    m.verts = body.lean_only(m.verts, lean)
    return m
