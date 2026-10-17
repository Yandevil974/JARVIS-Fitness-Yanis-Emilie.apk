"""Deformation MLS (Moving Least Squares) a similarite.

Implementation de l'algorithme decrit dans :
  Schaefer, S., McPhail, T., Warren, J., "Image Deformation Using Moving
  Least Squares", ACM Transactions on Graphics 25(3), 2006.

Le module expose une seule fonction publique :

    mls_similarity(P, Q, alpha=1.0, groups=None) -> MLSField

ou
    P : (N,2) float  positions des points de controle dans le DOMAINE CIBLE
    Q : (N,2) float  positions correspondantes dans le DOMAINE SOURCE
    groups : (N,) int optionnel, indice de groupe pour chaque point de
             controle.  Le calcul local (similarite) de chaque point n'utilise
             que les points du meme groupe : c'est ce qui permet de garder un
             objet (la barre) parfaitement rigide pendant que le reste se
             deforme.

La deformation renvoyee mappe le domaine CIBLE vers le domaine SOURCE :
d(P_k) = Q_k.  On l'utilise donc pour reechantillonner une image source
(morphing a source unique : aucun melange de deux images, donc aucun double
contour possible).
"""

import numpy as np

__all__ = ["mls_similarity", "MLSField", "selftest"]


class MLSField:
    """Champ de deformation MLS pret a etre evalue sur des points arbitraires."""

    def __init__(self, coeffs, P, alpha, eps, radius=None):
        # coeffs : (N,6) = [a, b, c, d, tx, ty] tel que
        #   d(x,y) = a*x + b*y + tx ,  d_y(x,y) = c*x + d*y + ty
        # (somme ponderee des transformations locales)
        self.coeffs = coeffs
        self.P = P
        self.alpha = alpha
        self.eps = eps
        # rayon de support compact par point (None => support infini)
        self.radius = None if radius is None else np.asarray(radius, dtype=np.float64)

    def __call__(self, pts):
        """pts : (M,2) -> (M,2) positions dans le domaine source."""
        M = len(pts)
        dt = np.float64 if M <= 200000 else np.float32
        pts = np.asarray(pts, dtype=dt)
        out = np.empty((M, 2), dtype=dt)
        P = self.P.astype(dt, copy=False)
        C = self.coeffs.astype(dt, copy=False)
        eps = dt(self.eps)
        R = None if self.radius is None else self.radius.astype(dt)
        # par tuiles pour limiter la memoire
        tile = 16384 if dt is np.float32 else 200000
        for s in range(0, M, tile):
            e = min(s + tile, M)
            q = pts[s:e]
            dx = q[:, None, 0] - P[None, :, 0]
            dy = q[:, None, 1] - P[None, :, 1]
            d2 = dx * dx + dy * dy
            if R is None:
                w = (d2 + eps) ** dt(-self.alpha)
            else:
                u2 = d2 / (R[None, :] * R[None, :])
                w = np.where(u2 < 1.0, (1.0 - u2) ** 2, 0.0).astype(dt)
            acc = w @ C
            den = w.sum(axis=1)
            ox = (q[:, 0] * acc[:, 0] + q[:, 1] * acc[:, 1] + acc[:, 4])
            oy = (q[:, 0] * acc[:, 2] + q[:, 1] * acc[:, 3] + acc[:, 5])
            ok = den > 1e-20
            den = np.where(ok, den, dt(1.0))
            out[s:e, 0] = np.where(ok, ox / den, q[:, 0])
            out[s:e, 1] = np.where(ok, oy / den, q[:, 1])
        return out


def _procrustes_similarity(a, b, wt):
    """Similarite locale (rotation + echelle, sans reflexion) sending a -> b.

    a, b : (m,2) points centres, wt : (m,) poids.
    Retourne (A, b0) avec A = s*R et b0 = translation, tel que
    A @ a_j + b0 ~= b_j.
    """
    sw = wt.sum()
    am = (wt[:, None] * a).sum(0) / sw
    bm = (wt[:, None] * b).sum(0) / sw
    ac = a - am
    bc = b - bm
    H = (bc[:, :, None] * (wt[:, None] * ac)[:, None, :]).sum(0)  # sum w b c^T
    den = float((wt * (ac * ac).sum(1)).sum())
    if den < 1e-12 or not np.isfinite(H).all():
        return np.eye(2), bm - am
    U, S, Vt = np.linalg.svd(H)
    R = U @ Vt
    if np.linalg.det(R) < 0:
        U = U.copy()
        U[:, -1] *= -1.0
        R = U @ Vt
    tr = float(np.trace(R.T @ H))
    s = tr / den
    if not np.isfinite(s) or s <= 1e-6:
        return np.eye(2), bm - am
    A = s * R
    return A, bm - A @ am


def mls_similarity(P, Q, alpha=1.0, groups=None, eps=1e-5, kappa=0.0, neigh=6):
    """Construit le champ MLS (cible -> source).

    P, Q : (N,2) points de controle (cible) et leurs correspondances (source).
    alpha : smoothness (1.0 par defaut).
    groups : (N,) optionnel.
    kappa : si > 0, support compact : chaque point n'agit que dans un rayon
        kappa * (distance au neigh-ieme voisin du meme groupe).  Un support
        compact est indispensable ici : avec le support infini de la formule
        classique (alpha seul), un objet en mouvement (la barre) deforme tout
        le decor, meme a l'autre bout de l'image.
    """
    P = np.ascontiguousarray(P, dtype=np.float64)
    Q = np.ascontiguousarray(Q, dtype=np.float64)
    if P.shape != Q.shape or P.ndim != 2 or P.shape[1] != 2:
        raise ValueError("P et Q doivent etre de meme forme (N,2)")
    n = P.shape[0]
    if n == 0:
        raise ValueError("aucun point de controle")
    if groups is None:
        groups = np.zeros(n, dtype=np.int64)
    groups = np.asarray(groups, dtype=np.int64)

    d2 = ((P[:, None, :] - P[None, :, :]) ** 2).sum(-1)
    d2n = d2.copy()
    np.fill_diagonal(d2n, np.inf)  # pour le calcul du plus proche voisin

    # rayon de support compact par point
    radius = None
    if kappa and kappa > 0:
        radius = np.zeros(n, dtype=np.float64)
        for i in range(n):
            idx = np.where(groups == groups[i])[0]
            idx = idx[idx != i]
            if idx.size == 0:
                radius[i] = 1e6
                continue
            dd = np.sort(np.sqrt(d2n[i, idx]))
            k = min(neigh, dd.size) - 1
            radius[i] = max(kappa * dd[k], 1e-3)

    # poids locaux utilises pour la similarite locale
    if radius is None:
        W = (d2 + eps) ** (-alpha)
    else:
        u2 = d2 / (radius[:, None] * radius[None, :])
        W = np.where(u2 < 1.0, (1.0 - u2) ** 2, 0.0)
        # le point i est toujours dans son propre voisinage
        W = W + np.eye(n)

    coeffs = np.zeros((n, 6), dtype=np.float64)
    for i in range(n):
        idx = np.where(groups == groups[i])[0]
        w = W[i, idx]
        if idx.size < 2 or w.sum() <= 1e-12:
            A = np.eye(2)
            b0 = np.zeros(2)
        else:
            a = P[idx] - P[i]
            b = Q[idx] - Q[i]
            A, b0 = _procrustes_similarity(a, b, w)
        # transformation locale absolue : L_i(x) = A(x - Pi) + b0 + Qi
        tx = b0[0] - A[0, 0] * P[i, 0] - A[0, 1] * P[i, 1] + Q[i, 0]
        ty = b0[1] - A[1, 0] * P[i, 0] - A[1, 1] * P[i, 1] + Q[i, 1]
        coeffs[i] = (A[0, 0], A[0, 1], A[1, 0], A[1, 1], tx, ty)

    return MLSField(coeffs, P, alpha, eps, radius)


# --------------------------------------------------------------------------
# Validation analytique
# --------------------------------------------------------------------------
def selftest(verbose=True):
    """Verifie identite / translation / rotation / echelle / interpolation."""
    rng = np.random.default_rng(7)
    P = rng.uniform(0, 400, size=(60, 2))
    out = []

    def check(name, got, want, tol=1e-6):
        err = float(np.abs(got - want).max())
        out.append((name, err, err <= tol))
        if verbose:
            print("  %-22s err=%.3e  %s" % (name, err, "OK" if err <= tol else "ECHEC"))
        return err <= tol

    # identite
    f = mls_similarity(P, P)
    pts = rng.uniform(0, 400, size=(500, 2))
    check("identite", f(pts), pts, 1e-6)

    # translation
    t = np.array([37.5, -19.25])
    f = mls_similarity(P, P + t)
    check("translation", f(pts), pts + t, 1e-5)

    # rotation de 25 degres autour de c
    c = np.array([200.0, 150.0])
    th = np.deg2rad(25.0)
    R = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    f = mls_similarity(P, (P - c) @ R.T + c)
    check("rotation", f(pts), (pts - c) @ R.T + c, 1e-4)

    # echelle 1.8 autour de c
    s = 1.8
    f = mls_similarity(P, (P - c) * s + c)
    check("echelle", f(pts), (pts - c) * s + c, 1e-4)

    # interpolation : d(Pk) = Qk
    Q = P + rng.normal(0, 20, size=P.shape)
    f = mls_similarity(P, Q)
    check("interpolation", f(P), Q, 1e-3)

    # groupes : un groupe rigide reste rigide
    gid = np.array([0] * 30 + [1] * 30)
    Qg = P.copy()
    Qg[:30] = P[:30] + np.array([10.0, -60.0])
    f = mls_similarity(P, Qg, groups=gid)
    # chaque point du groupe 0 doit bouger exactement de (10,-60)
    disp = f(P[:30]) - P[:30]
    check("groupe rigide (uniforme)", disp, np.tile([10.0, -60.0], (30, 1)), 1e-2)
    # et le groupe 1 doit rester immobile
    disp1 = f(P[30:]) - P[30:]
    check("groupe statique", disp1, np.zeros_like(disp1), 1e-2)

    # support compact : un point eloigne ne doit pas bouger
    f = mls_similarity(P, P + t, kappa=2.5, neigh=4)
    far = np.array([[P[:, 0].max() + 500.0, P[:, 1].max() + 500.0]])
    check("support compact (local)", f(far), far, 1e-6)

    ok = all(o[2] for o in out)
    if verbose:
        print("  => %s" % ("TOUS LES TESTS PASSENT" if ok else "ECHEC"))
    return ok


if __name__ == "__main__":
    print("Validation analytique MLS similarite")
    selftest()
