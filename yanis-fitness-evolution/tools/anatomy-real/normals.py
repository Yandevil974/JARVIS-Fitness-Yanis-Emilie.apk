"""Normales orientées vers l'extérieur (le maillage BodyParts3D a des faces
d'orientation mixte : la normale brute pointe vers l'intérieur par plaques)."""
from __future__ import annotations

import numpy as np

import body

_SEG = None


def _skeleton():
    """Segments (a, b) approximatifs du corps, en repère moteur."""
    global _SEG
    if _SEG is not None:
        return _SEG
    J = body.joints()
    segs = []
    # colonne + tête
    segs.append((np.array((0.00, 0.86, 0.0), np.float32), np.array((0.00, 1.34, 0.0), np.float32)))
    segs.append((np.array((0.00, 1.34, 0.0), np.float32), np.array((-0.02, 1.52, 0.0), np.float32)))
    segs.append((np.array((-0.02, 1.52, 0.0), np.float32), np.array((-0.01, 1.72, 0.0), np.float32)))
    for side, j in J.items():
        S, E, W = j["S"], j["E"], j["W"]
        segs.append((S, E))
        segs.append((E, W))
        segs.append((W, W + np.array((0.10, -0.10, 0), np.float32)))
        hip = np.array((0.0, 0.96, side * 0.085), np.float32)
        knee = np.array((0.02, 0.48, side * 0.105), np.float32)
        ankle = np.array((0.00, 0.075, side * 0.105), np.float32)
        toe = np.array((0.13, 0.03, side * 0.105), np.float32)
        segs.append((np.array((0.0, 1.30, 0.0), np.float32), hip))
        segs.append((hip, knee))
        segs.append((knee, ankle))
        segs.append((ankle, toe))
    _SEG = segs
    return segs


def _nearest_dir(v):
    segs = _skeleton()
    best = np.full(len(v), np.inf, np.float32)
    ref = np.zeros_like(v)
    for a, b in segs:
        ab = b - a
        t = np.clip(((v - a) @ ab) / (ab @ ab), 0, 1)
        p = a + t[:, None] * ab
        d = np.linalg.norm(v - p, axis=1)
        m = d < best
        best[m] = d[m]
        ref[m] = p[m]
    d = v - ref
    n = np.linalg.norm(d, axis=1)
    n[n < 1e-6] = 1
    return d / n[:, None]


def outward(v, f, n=None):
    """Normales par sommet, retournées si elles pointent vers le squelette."""
    from engine3d import vertex_normals
    n = vertex_normals(v, f) if n is None else n
    r = _nearest_dir(v)
    flip = (n * r).sum(1) < 0
    n = n.copy()
    n[flip] *= -1
    return n, int(flip.sum()), len(v)


def _smooth_outward_legacy(v, f):
    """Normales lissées, orientées vers l'extérieur (champ cohérent).

    Le maillage source a des faces d'orientation mixte : on oriente chaque
    normale de face avec la direction radiale du squelette, puis on moyenne.
    """
    fn = np.cross(v[f[:, 1]] - v[f[:, 0]], v[f[:, 2]] - v[f[:, 0]])
    ln = np.linalg.norm(fn, axis=1, keepdims=True)
    fn = fn / np.maximum(ln, 1e-12)
    cen = v[f].mean(1)
    r = _nearest_dir(cen)
    flip = (fn * r).sum(1) < 0
    fn[flip] *= -1
    acc = np.zeros((len(v), 3), np.float32)
    for i in range(3):
        np.add.at(acc, f[:, i], fn)
    ln = np.linalg.norm(acc, axis=1, keepdims=True)
    return (acc / np.maximum(ln, 1e-9)).astype(np.float32)


def orient(v, f):
    """Oriente les faces vers l'extérieur (par composante connexe).

    BodyParts3D livre des morceaux de peau cousus dont certains sont
    retournés : on propage une orientation cohérente par arête, puis on
    retourne chaque composante si sa normale moyenne pointe vers le squelette.
    """
    nf = len(f)
    flip = np.zeros(nf, bool)
    dirs = {}
    for i, tri in enumerate(f):
        for k in range(3):
            a, b = int(tri[k]), int(tri[(k + 1) % 3])
            key = (a, b) if a < b else (b, a)
            dirs.setdefault(key, []).append((i, a < b))
    adj = [[] for _ in range(nf)]
    for (a, b), lst in dirs.items():
        if len(lst) != 2:
            continue
        (i, di), (j, dj) = lst
        adj[i].append((j, di == dj))
        adj[j].append((i, di == dj))
    comp = -np.ones(nf, np.int64)
    ncomp = 0
    for start in range(nf):
        if comp[start] >= 0:
            continue
        comp[start] = ncomp
        stack = [start]
        while stack:
            i = stack.pop()
            for j, same in adj[i]:
                if comp[j] >= 0:
                    continue
                flip[j] = flip[i] ^ same
                comp[j] = ncomp
                stack.append(j)
        ncomp += 1
    ff = f.copy()
    ff[flip] = ff[flip][:, ::-1]
    fn = np.cross(v[ff[:, 1]] - v[ff[:, 0]], v[ff[:, 2]] - v[ff[:, 0]])
    fn /= np.maximum(np.linalg.norm(fn, axis=1, keepdims=True), 1e-12)
    r = _nearest_dir(v[f].mean(1))
    for c in range(ncomp):
        m = comp == c
        if (fn[m] * r[m]).sum() < 0:
            ff[m] = ff[m][:, ::-1]
            fn[m] *= -1
    return ff, fn, comp


def smooth_normals(v, f, ff=None, fn=None):
    if ff is None:
        ff, fn, _ = orient(v, f)
    acc = np.zeros((len(v), 3), np.float32)
    for i in range(3):
        np.add.at(acc, ff[:, i], fn)
    ln = np.linalg.norm(acc, axis=1, keepdims=True)
    return (acc / np.maximum(ln, 1e-9)).astype(np.float32)
