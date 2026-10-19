"""Lecture de l'atlas BodyParts3D (ashemag/human-atlas)."""
from __future__ import annotations

import json
import os

import numpy as np

ROOT = os.environ.get("ATLAS_DIR", "/tmp/anat")


class Part:
    __slots__ = ("id", "name", "system", "concept", "verts", "faces", "chunk")

    def __init__(self, rec, verts, faces):
        self.id = rec["id"]
        self.name = rec["name"]
        self.system = rec.get("system")
        self.concept = rec.get("conceptId")
        self.chunk = rec["chunk"]
        self.verts = verts
        self.faces = faces

    def __repr__(self):
        return f"<{self.name} {len(self.verts)}v {len(self.faces)}f>"


_CACHE = {}


def _chunk(i):
    if i not in _CACHE:
        _CACHE[i] = np.memmap(os.path.join(ROOT, f"body-{i}.bin"), dtype=np.uint8, mode="r")
    return _CACHE[i]


def meta():
    with open(os.path.join(ROOT, "atlas.json")) as fh:
        return json.load(fh)


def part(rec):
    a = meta()
    buf = _chunk(rec["chunk"])
    nv, ni = rec["vertexCount"], rec["indexCount"]
    p = np.frombuffer(buf, dtype=np.float32, count=nv * 3, offset=rec["positions"])
    idx = np.frombuffer(buf, dtype=np.uint32, count=ni, offset=rec["indices"])
    return Part(rec, p.reshape(nv, 3).astype(np.float32), idx.reshape(-1, 3).astype(np.int32))


def find(name=None, concept=None):
    out = []
    for rec in meta()["parts"]:
        if name and rec["name"] != name:
            continue
        if concept and rec.get("conceptId") != concept:
            continue
        out.append(part(rec))
    return out


def skin():
    """La peau complète (FMA7163) : 22 902 sommets, 44 744 faces."""
    ps = find(concept="FMA7163")
    assert ps, "peau absente de l'atlas"
    return ps[0]


def merge(ps):
    vs, fs, off = [], [], 0
    for p in ps:
        vs.append(p.verts)
        fs.append(p.faces + off)
        off += len(p.verts)
    return np.concatenate(vs), np.concatenate(fs)
