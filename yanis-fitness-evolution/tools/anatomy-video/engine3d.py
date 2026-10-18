"""Petit moteur 3D logiciel (z-buffer, numpy) pour les démonstrations anatomiques.

Aucune dépendance GPU : le rendu est reproductible sur n'importe quelle machine
qui exécute Python + numpy + Pillow. Les maillages sont des primitives lissées
(sphères, tubes fuselés, superellipses) assemblées en un rig articulé.
"""
from __future__ import annotations

import numpy as np

EPS = 1e-9


# ---------------------------------------------------------------- vecteurs ---
def v(*args):
    return np.asarray(args, dtype=np.float32)


def norm(x):
    x = np.asarray(x, dtype=np.float32)
    n = np.linalg.norm(x, axis=-1, keepdims=True)
    return x / np.maximum(n, EPS)


def lerp(a, b, t):
    return a + (b - a) * t


def smoothstep(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)


def ease_out(t):
    t = np.clip(t, 0.0, 1.0)
    return 1 - (1 - t) ** 3


def rotation(axis, angle):
    """Matrice 4x4 de rotation autour d'un axe unitaire."""
    ax = norm(axis)
    x, y, z = ax
    c, s = np.cos(angle), np.sin(angle)
    C = 1 - c
    R = np.array(
        [
            [x * x * C + c, x * y * C - z * s, x * z * C + y * s, 0],
            [y * x * C + z * s, y * y * C + c, y * z * C - x * s, 0],
            [z * x * C - y * s, z * y * C + x * s, z * z * C + c, 0],
            [0, 0, 0, 1],
        ],
        dtype=np.float32,
    )
    return R


def translate(t):
    T = np.eye(4, dtype=np.float32)
    T[:3, 3] = t
    return T


def scale(s):
    S = np.eye(4, dtype=np.float32)
    S[0, 0], S[1, 1], S[2, 2] = s
    return S


def basis_from_axis(axis, ref=(0, 0, 1)):
    """Deux vecteurs orthonormés perpendiculaires à `axis`."""
    a = norm(axis)
    ref = np.asarray(ref, dtype=np.float32)
    if abs(float(a @ ref)) > 0.97:
        ref = np.array([1.0, 0, 0], dtype=np.float32)
    u = norm(np.cross(a, ref))
    w = np.cross(a, u)
    return u, w


# ------------------------------------------------------------------ caméra ---
class Camera:
    def __init__(self, eye, target, fov=32.0, width=900, height=1125, up=(0, 1, 0)):
        self.eye = np.asarray(eye, dtype=np.float32)
        self.target = np.asarray(target, dtype=np.float32)
        self.fov = np.radians(fov)
        self.width, self.height = width, height
        self.up = np.asarray(up, dtype=np.float32)
        self.aspect = width / height
        self._build()

    def _build(self):
        f = norm(self.target - self.eye)
        r = norm(np.cross(f, self.up))
        u = np.cross(r, f)
        self.fwd, self.right, self.upv = f, r, u
        self.focal = 1.0 / np.tan(self.fov / 2.0)

    def project(self, pts):
        """Retourne (x, y, depth, valid) en pixels / mètres."""
        pts = np.asarray(pts, dtype=np.float32)
        rel = pts - self.eye
        x = rel @ self.right
        y = rel @ self.upv
        z = rel @ self.fwd  # profondeur positive devant la caméra
        valid = z > 0.05
        zz = np.maximum(z, 1e-4)
        xn = (self.focal / self.aspect) * x / zz
        yn = self.focal * y / zz
        sx = (xn * 0.5 + 0.5) * self.width
        sy = (0.5 - yn * 0.5) * self.height
        return sx, sy, z, valid


# ------------------------------------------------------------------ maillage ---
class Mesh:
    __slots__ = ("verts", "faces", "normals", "color", "spec", "shin", "rim", "emis")

    def __init__(self, verts, faces, normals=None, color=(0.7, 0.7, 0.7), spec=0.1,
                 shin=20.0, rim=0.25, emis=(0, 0, 0), smooth=True):
        self.verts = np.asarray(verts, dtype=np.float32)
        self.faces = np.asarray(faces, dtype=np.int32)
        if normals is not None:
            self.normals = np.asarray(normals, dtype=np.float32)
        else:
            self.normals = vertex_normals(self.verts, self.faces)
            if smooth:
                # moyenne des normales de faces sur les sommets : surface lisse
                fn = face_normals_np(self.verts, self.faces)
                acc = np.zeros_like(self.verts)
                for i in range(3):
                    np.add.at(acc, self.faces[:, i], fn)
                avg = norm(acc)
                self.normals = norm(self.normals * 0.25 + avg * 0.75)
        col = np.asarray(color, dtype=np.float32)
        nf = len(self.faces)
        self.color = col if col.ndim == 2 else np.tile(col, (nf, 1))
        # auto-éclairage des surfaces claires (peau/mannequin) : évite les faces noires
        if self.color.ndim == 2:
            albedo = float(np.clip(self.color.mean(), 0, 1))
            if albedo > 0.35:
                em = np.asarray(emis, dtype=np.float32)
                em = em if em.ndim == 2 else np.tile(em, (nf, 1))
                self.emis = em + (albedo - 0.35) * 0.30
        self.spec, self.shin, self.rim = float(spec), float(shin), float(rim)
        em = np.asarray(emis, dtype=np.float32)
        self.emis = em if em.ndim == 2 else np.tile(em, (nf, 1))

    def transform(self, M):
        R = M[:3, :3]
        t = M[:3, 3]
        out = Mesh.__new__(Mesh)
        out.verts = self.verts @ R.T + t
        out.faces = self.faces
        nrm = self.normals @ R.T
        out.normals = norm(nrm)
        out.color, out.spec, out.shin, out.rim = self.color, self.spec, self.shin, self.rim
        out.emis = self.emis
        return out

    def mirrored_z(self):
        out = Mesh.__new__(Mesh)
        out.verts = self.verts * np.array([1, 1, -1], dtype=np.float32)
        out.faces = self.faces[:, ::-1]
        out.normals = self.normals * np.array([1, 1, -1], dtype=np.float32)
        out.color, out.spec, out.shin, out.rim = self.color, self.spec, self.shin, self.rim
        out.emis = self.emis
        return out


def face_normals_np(verts, faces):
    fn = np.cross(verts[faces[:, 1]] - verts[faces[:, 0]],
                  verts[faces[:, 2]] - verts[faces[:, 0]])
    return norm(fn)


def vertex_normals(verts, faces):
    fn = np.cross(verts[faces[:, 1]] - verts[faces[:, 0]], verts[faces[:, 2]] - verts[faces[:, 0]])
    vn = np.zeros_like(verts)
    for i in range(3):
        np.add.at(vn, faces[:, i], fn)
    return norm(vn)


def _grid_faces(rows, seg, offset=0):
    faces = []
    for r in range(rows - 1):
        for s in range(seg):
            a = offset + r * seg + s
            b = offset + r * seg + (s + 1) % seg
            c = offset + (r + 1) * seg + s
            d = offset + (r + 1) * seg + (s + 1) % seg
            faces.append((a, c, b))
            faces.append((b, c, d))
    return faces


def ellipsoid(center, radii, seg=18, rings=12, rot=None, color=(0.7, 0.7, 0.7), **mat):
    """Sphère/ellipsoïde lissé. `rot` : matrice 3x3 ou 4x4."""
    cx, cy, cz = center
    rx, ry, rz = radii
    verts = []
    faces = []
    # pôle sud
    verts.append((0, -ry, 0))
    for j in range(1, rings):
        phi = np.pi * j / rings - np.pi / 2
        yy = np.sin(phi) * ry
        rr = np.cos(phi)
        for i in range(seg):
            a = 2 * np.pi * i / seg
            verts.append((np.cos(a) * rr * rx, yy, np.sin(a) * rr * rz))
    south = len(verts)
    verts.append((0, ry, 0))
    for i in range(seg):
        faces.append((0, 1 + i, 1 + (i + 1) % seg))
    for r in range(rings - 2):
        a0 = 1 + r * seg
        b0 = 1 + (r + 1) * seg
        for i in range(seg):
            a = a0 + i
            b = a0 + (i + 1) % seg
            c = b0 + i
            d = b0 + (i + 1) % seg
            faces.append((a, c, b))
            faces.append((b, c, d))
    last = 1 + (rings - 2) * seg
    for i in range(seg):
        faces.append((south, last + (i + 1) % seg, last + i))
    verts = np.asarray(verts, dtype=np.float32) * np.array([1, 1, 1], dtype=np.float32)
    M = np.eye(4, dtype=np.float32)
    if rot is not None:
        R = np.asarray(rot, dtype=np.float32)
        if R.shape == (4, 4):
            M = R.copy()
        else:
            M[:3, :3] = R
    M[:3, 3] += np.asarray(center, dtype=np.float32)
    m = Mesh(verts, np.asarray(faces, dtype=np.int32), color=color, **mat)
    return m.transform(M)


def _superellipse(a, rx, rz, n=2.0):
    c, s = np.cos(a), np.sin(a)
    x = np.sign(c) * np.abs(c) ** (2.0 / n) * rx
    z = np.sign(s) * np.abs(s) ** (2.0 / n) * rz
    return x, z


def loft(rings, seg=20, color=(0.7, 0.7, 0.7), n=2.0, caps=True, **mat):
    """`rings` : liste de (y, rx, rz, cx, cz) empilés selon Y local."""
    verts = []
    for (y, rx, rz, cx, cz) in rings:
        for i in range(seg):
            a = 2 * np.pi * i / seg
            x, z = _superellipse(a, rx, rz, n)
            verts.append((cx + x, y, cz + z))
    nrows = len(rings)
    faces = _grid_faces(nrows, seg)
    verts = list(verts)
    if caps:
        y0, rx0, rz0, cx0, cz0 = rings[0]
        y1, rx1, rz1, cx1, cz1 = rings[-1]
        c0 = len(verts)
        verts.append((cx0, y0, cz0))
        c1 = len(verts)
        verts.append((cx1, y1, cz1))
        for i in range(seg):
            faces.append((c0, i, (i + 1) % seg))
            b = (nrows - 1) * seg
            faces.append((c1, b + (i + 1) % seg, b + i))
    return Mesh(verts, faces, color=color, **mat)


def tube(p0, p1, radii, seg=12, color=(0.7, 0.7, 0.7), bulge=0.0, caps=True, **mat):
    """Segment fuselé le long de p0→p1, avec extrémités arrondies.

    `radii` : liste de rayons normalisés (0..1) le long du segment ; la moyenne
    est mise à l'échelle pour donner des muscles crédibles (ventre charnu).
    """
    p0 = np.asarray(p0, dtype=np.float32)
    p1 = np.asarray(p1, dtype=np.float32)
    axis = p1 - p0
    L = float(np.linalg.norm(axis))
    d = axis / max(L, EPS)
    u, w = basis_from_axis(d)
    n = len(radii)
    verts = []
    for k, r in enumerate(radii):
        t = k / (n - 1)
        c = p0 + axis * t
        for i in range(seg):
            a = 2 * np.pi * i / seg
            verts.append(c + u * (np.cos(a) * r) + w * (np.sin(a) * r))
    faces = _grid_faces(n, seg)
    verts = list(verts)
    if caps:
        cap0 = len(verts)
        verts.append(p0 - d * radii[0] * 0.45)
        cap1 = len(verts)
        verts.append(p1 + d * radii[-1] * 0.45)
        for i in range(seg):
            faces.append((cap0, (i + 1) % seg, i))
            b = (n - 1) * seg
            faces.append((cap1, b + i, b + (i + 1) % seg))
    return Mesh(verts, faces, color=color, **mat)


def bezier_tube(pts, radius, seg=8, steps=18, color=(0.2, 0.2, 0.2), **mat):
    pts = np.asarray(pts, dtype=np.float32)
    ts = np.linspace(0, 1, steps)
    curve = (
        ((1 - ts) ** 3)[:, None] * pts[0]
        + (3 * (1 - ts) ** 2 * ts)[:, None] * pts[1]
        + (3 * (1 - ts) * ts**2)[:, None] * pts[2]
        + (ts**3)[:, None] * pts[3]
    )
    verts = []
    for i, c in enumerate(curve):
        if i == 0:
            d = curve[1] - curve[0]
        elif i == steps - 1:
            d = curve[-1] - curve[-2]
        else:
            d = curve[i + 1] - curve[i - 1]
        u, w = basis_from_axis(d)
        for k in range(seg):
            a = 2 * np.pi * k / seg
            verts.append(c + u * np.cos(a) * radius + w * np.sin(a) * radius)
    faces = _grid_faces(steps, seg)
    return Mesh(verts, faces, color=color, **mat)


def disc(center, normal, radius, seg=18, color=(0.2, 0.2, 0.2), thickness=0.02, **mat):
    c = np.asarray(center, dtype=np.float32)
    nn = norm(normal)
    u, w = basis_from_axis(nn)
    verts = []
    for side in (-1, 1):
        for i in range(seg):
            a = 2 * np.pi * i / seg
            verts.append(c + nn * (side * thickness / 2) + u * np.cos(a) * radius + w * np.sin(a) * radius)
    faces = []
    for i in range(seg):
        a, b = i, (i + 1) % seg
        c2, d = seg + i, seg + (i + 1) % seg
        faces.append((a, c2, b))
        faces.append((b, c2, d))
        faces.append((seg + seg, a, b)) if False else None
    # capuchons
    ca = len(verts)
    verts.append(c + nn * (thickness / 2))
    cb = len(verts)
    verts.append(c - nn * (thickness / 2))
    for i in range(seg):
        faces.append((ca, i, (i + 1) % seg))
        faces.append((cb, seg + (i + 1) % seg, seg + i))
    return Mesh(verts, faces, color=color, **mat)


def rounded_box(center, size, radius_ratio=0.18, seg=16, rings=8, color=(0.7, 0.7, 0.7), **mat):
    sx, sy, sz = size
    rr = []
    for j in range(rings + 1):
        t = j / rings
        y = (t - 0.5) * sy
        # profil arrondi aux extrémités
        edge = np.sin(np.pi * min(max(t, 0.0), 1.0)) ** 0.35
        rr.append((y, sx / 2 * edge, sz / 2 * edge, 0, 0))
    m = loft(rr, seg=seg, color=color, n=2.9, **mat)
    return m.transform(translate(center))


# ------------------------------------------------------------------ scène ----
class Scene:
    def __init__(self):
        self.verts = []
        self.normals = []
        self.faces = []
        self.color = []
        self.spec = []
        self.shin = []
        self.rim = []
        self.emis = []
        self.count = 0

    def add(self, mesh: Mesh):
        if mesh.verts.size == 0:
            return
        self.verts.append(mesh.verts)
        self.normals.append(mesh.normals)
        self.faces.append(mesh.faces + self.count)
        nf = len(mesh.faces)
        self.color.append(mesh.color)
        self.spec.append(np.full(nf, mesh.spec, dtype=np.float32))
        self.shin.append(np.full(nf, mesh.shin, dtype=np.float32))
        self.rim.append(np.full(nf, mesh.rim, dtype=np.float32))
        em = np.asarray(mesh.emis, dtype=np.float32)
        self.emis.append(em if em.ndim == 2 else np.tile(em, (nf, 1)))
        self.count += len(mesh.verts)

    def arrays(self):
        if not self.verts:
            return None
        return dict(
            verts=np.concatenate(self.verts),
            normals=np.concatenate(self.normals),
            faces=np.concatenate(self.faces),
            color=np.concatenate(self.color),
            spec=np.concatenate(self.spec),
            shin=np.concatenate(self.shin),
            rim=np.concatenate(self.rim),
            emis=np.concatenate(self.emis),
        )


# ---------------------------------------------------------------- rendu ------
DEFAULT_LIGHTS = {
    # clé (haut-droit, chaude) / remplissage frontal (froide) / contre-jour
    "key": norm(np.array([0.55, 0.85, 0.65])),
    "key_color": np.array([1.00, 0.94, 0.86], dtype=np.float32),
    "fill": norm(np.array([0.35, 0.18, 0.92])),
    "fill_color": np.array([0.62, 0.74, 0.94], dtype=np.float32),
    "rim": norm(np.array([-0.85, 0.45, -0.75])),
    "rim_color": np.array([1.00, 0.78, 0.60], dtype=np.float32),
    "ambient": 0.62,
    "sky": np.array([0.30, 0.34, 0.40], dtype=np.float32),
    "ground": np.array([0.16, 0.16, 0.18], dtype=np.float32),
}


def _tone(x, knee=1.25):
    """Tonemap doux : compresse les hautes lumières sans blanchir les gris."""
    return knee * (1.0 - np.exp(-x / knee))


def render(scene: Scene, cam: Camera, background=None, bg_depth=None,
           lights=None, fog_color=(0.035, 0.040, 0.050), fog_density=0.035,
           blur_bg=0.0):
    """Rend la scène. Si `background` est fourni (pré-rendu flou), on part de
    cette image et de son z-buffer pour ne dessiner que le sujet."""
    lights = lights or DEFAULT_LIGHTS
    H, W = cam.height, cam.width
    if background is None:
        color = np.zeros((H, W, 3), dtype=np.float32)
        color[:] = np.array(fog_color, dtype=np.float32)
        depth = np.full((H, W), 1e9, dtype=np.float32)
    else:
        color = background.copy()
        depth = bg_depth.copy()

    A = scene.arrays()
    if A is None:
        return color, depth
    sx, sy, zc, valid = cam.project(A["verts"])
    faces = A["faces"]
    nrm = A["normals"]

    # éclairage style studio
    L = lights["key"].astype(np.float32)
    Lc = lights["key_color"]
    F = lights["fill"].astype(np.float32)
    Fc = lights["fill_color"]
    R = lights["rim"].astype(np.float32)
    Rc = lights["rim_color"]
    amb = lights["ambient"]
    Vdir = norm(cam.eye - (A["verts"][faces[:, 0]] * 0 + cam.target)) if False else None

    # face culling + clipping grossier
    P0 = np.stack([sx[faces[:, 0]], sy[faces[:, 0]]], 1)
    P1 = np.stack([sx[faces[:, 1]], sy[faces[:, 1]]], 1)
    P2 = np.stack([sx[faces[:, 2]], sy[faces[:, 2]]], 1)
    area = (P1[:, 0] - P0[:, 0]) * (P2[:, 1] - P0[:, 1]) - (P1[:, 1] - P0[:, 1]) * (P2[:, 0] - P0[:, 0])
    ok = valid[faces].all(1) & (np.abs(area) > 0.02)
    idx = np.nonzero(ok)[0]
    # ordre proche→loin pour limiter les recouvrements inutiles (z-buffer reste maître)
    zface = (zc[faces[:, 0]] + zc[faces[:, 1]] + zc[faces[:, 2]]) / 3
    idx = idx[np.argsort(zface[idx])]

    Wf, Hf = float(W), float(H)
    for fi in idx:
        f = faces[fi]
        x0, y0 = P0[fi]
        x1, y1 = P1[fi]
        y2 = P2[fi][1]
        x2 = P2[fi][0]
        minx = int(max(0, np.floor(min(x0, x1, x2))))
        maxx = int(min(W - 1, np.ceil(max(x0, x1, x2))))
        miny = int(max(0, np.floor(min(y0, y1, y2))))
        maxy = int(min(H - 1, np.ceil(max(y0, y1, y2))))
        if maxx < minx or maxy < miny:
            continue
        ax, ay = x0, y0
        bx, by = x1, y1
        cx, cy = x2, y2
        det = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
        if abs(det) < 1e-6:
            continue
        xs = np.arange(minx, maxx + 1, dtype=np.float32) + 0.5
        ys = np.arange(miny, maxy + 1, dtype=np.float32) + 0.5
        X = xs[None, :]
        Y = ys[:, None]
        w0 = ((bx - X) * (cy - Y) - (by - Y) * (cx - X)) / det
        w1 = ((cx - X) * (ay - Y) - (cy - Y) * (ax - X)) / det
        w2 = 1.0 - w0 - w1
        inside = (w0 >= -1e-4) & (w1 >= -1e-4) & (w2 >= -1e-4)
        if not inside.any():
            continue
        z = w0 * zc[f[0]] + w1 * zc[f[1]] + w2 * zc[f[2]]
        zb = depth[miny:maxy + 1, minx:maxx + 1]
        m = inside & (z < zb)
        if not m.any():
            continue
        # normale interpolée
        nx = w0 * nrm[f[0], 0] + w1 * nrm[f[1], 0] + w2 * nrm[f[2], 0]
        ny = w0 * nrm[f[0], 1] + w1 * nrm[f[1], 1] + w2 * nrm[f[2], 1]
        nz = w0 * nrm[f[0], 2] + w1 * nrm[f[1], 2] + w2 * nrm[f[2], 2]
        inv = 1.0 / np.sqrt(nx * nx + ny * ny + nz * nz + 1e-9)
        nx *= inv
        ny *= inv
        nz *= inv
        ndl = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
        ndf = np.clip(nx * F[0] + ny * F[1] + nz * F[2], 0, 1)
        ndr = np.clip(nx * R[0] + ny * R[1] + nz * R[2], 0, 1)
        # speculaire (Blinn-Phong), lumière clé
        hx, hy, hz = L[0], L[1], L[2] + 1.0
        hinv = 1.0 / np.sqrt(hx * hx + hy * hy + hz * hz)
        ndh = np.clip((nx * hx + ny * hy + nz * hz) * hinv, 0, 1)
        base = A["color"][fi]
        # micro-relief de fibres (profondeur lissée par sommet, pas de damier)
        relief = 1.0 + 1.9 * (float(A["emis"][fi, 0]) - 0.001) / (
            1e-4 + float(np.abs(A["emis"][:, 0]).max()) + 0.001)
        spec = A["spec"][fi] * ndh ** A["shin"][fi]
        rim = A["rim"][fi] * (1 - np.clip(ndr, 0, 1)) ** 2.4
        hemi = 0.5 + 0.5 * ny  # ciel au-dessus, sol en dessous
        sky = lights.get("sky", np.array([0.30, 0.34, 0.40], np.float32))
        ground = lights.get("ground", np.array([0.16, 0.16, 0.18], np.float32))
        px = (
            base[None, None, :] * (amb + 1.45 * ndl)[:, :, None]
            + (base * Fc)[None, None, :] * (0.42 * ndf)[:, :, None]
            + (base[None, None, :] * (sky * hemi[:, :, None] + (1 - hemi[:, :, None]) * ground)) * 1.15
            + (Rc * 0.26)[None, None, :] * rim[:, :, None]
            + (spec * min(1.7, max(0.35, relief)))[:, :, None] * 0.85
            + A["emis"][fi][None, None, :]
        )
        px = _tone(px)
        # brouillard de profondeur
        fog = 1 - np.exp(-np.clip(z, 0, None) * fog_density)
        px = px * (1 - fog[:, :, None]) + np.array(fog_color, dtype=np.float32)[None, None, :] * fog[:, :, None]
        sub = color[miny:maxy + 1, minx:maxx + 1]
        px = np.clip(px, 0, 1.6)
        sub[m] = px[m]
        zb[m] = z[m]

    return color, depth


def to_image(color, exposure=1.0, gamma=1.0):
    from PIL import Image

    c = np.clip(np.asarray(color, dtype=np.float32) * exposure, 0, 1)
    c = (c ** gamma) * 255.0
    return Image.fromarray(c.astype(np.uint8), "RGB")


# ------------------------------------------------------- peinture faciale ---
def face_centroids(m):
    return m.verts[m.faces].mean(axis=1)


def face_normals(m):
    a = m.verts[m.faces[:, 0]]
    b = m.verts[m.faces[:, 1]]
    c = m.verts[m.faces[:, 2]]
    return norm(np.cross(b - a, c - a))


def paint(mesh, weight, color, emission=None):
    """Teinte les faces selon `weight` (0..1) : poids 1 = couleur pleine.

    Retourne un nouveau maillage ; le maillage d'origine n'est pas modifié.
    """
    out = Mesh.__new__(Mesh)
    out.verts, out.faces, out.normals = mesh.verts, mesh.faces, mesh.normals
    nf = len(mesh.faces)
    w = np.clip(np.asarray(weight, dtype=np.float32), 0, 1)[:, None]
    base = mesh.color if mesh.color.ndim == 2 else np.tile(mesh.color, (nf, 1))
    col = np.asarray(color, dtype=np.float32)
    col = col if col.ndim == 2 else np.tile(col, (nf, 1))
    out.color = base * (1 - w) + col * w
    if emission is not None:
        em = np.asarray(emission, dtype=np.float32)
        em = em if em.ndim == 2 else np.tile(em, (nf, 1))
        out.emis = mesh.emis + em * w
    else:
        out.emis = mesh.emis
    out.spec = mesh.spec
    out.shin, out.rim = mesh.shin, mesh.rim
    return out
