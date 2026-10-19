"""Rig du coude par distance géodésique sur la peau (pas de fuite vers le torse)."""
from __future__ import annotations

import heapq

import numpy as np

import atlas

_C = {}


def graph(v, f):
    if "g" in _C:
        return _C["g"]
    e = np.concatenate([f[:, [0, 1]], f[:, [1, 2]], f[:, [2, 0]]])
    e = np.concatenate([e, e[:, ::-1]])
    L = np.linalg.norm(v[e[:, 0]] - v[e[:, 1]], axis=1)
    order = np.argsort(e[:, 0], kind="stable")
    e, L = e[order], L[order]
    starts = np.searchsorted(e[:, 0], np.arange(len(v) + 1))
    _C["g"] = (e[:, 1], L, starts)
    return _C["g"]


def geodesic(v, f, seeds):
    nb, L, starts = graph(v, f)
    dist = np.full(len(v), np.inf, np.float32)
    heap = []
    for i in seeds:
        dist[i] = 0.0
        heapq.heappush(heap, (0.0, int(i)))
    while heap:
        d, i = heapq.heappop(heap)
        if d > dist[i]:
            continue
        for k in range(starts[i], starts[i + 1]):
            j = nb[k]
            nd = d + L[k]
            if nd < dist[j]:
                dist[j] = nd
                heapq.heappush(heap, (nd, int(j)))
    return dist


def elbow_weights(v, f, wrist, radius=0.075, span=(0.170, 0.290), smooth=0.055):
    """1 sous le coude (main/avant-bras), 0 au-dessus ; transition sur 5 cm."""
    d0 = np.linalg.norm(v - wrist, axis=1)
    seeds = np.nonzero(d0 < radius)[0]
    dist = geodesic(v, f, seeds)
    lo, hi = span
    t = np.clip((dist - lo) / (hi - lo), 0, 1)
    w = 1.0 - (t * t * (3 - 2 * t))
    return w.astype(np.float32)
