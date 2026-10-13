#!/usr/bin/env python3
# ============================================================================
#  verifier-pose.py — MESURE (pas d'opinion) d'une pose / d'un GIF
#  JARVIS Fitness — décor verrouillé E1 (terrasse vue mer) + sol sablé clair
#
#  USAGE
#    python3 verifier-pose.py image1.png image2.gif ...        # tableau
#    python3 verifier-pose.py --csv out.csv image1 ...         # export CSV
#    python3 verifier-pose.py --frames gif.gif                 # toutes les images
#
#  CE QUI EST MESURÉ (chaque chiffre sort d'un calcul, jamais d'une impression)
#    sol    : moyenne RGB du COIN BAS-GAUCHE (18% x 14%)        cible R 225-240
#             (jamais le tiers bas entier : le tapis noir fausse tout)
#    sat    : saturation moyenne (HSL)                          cible E1 >= 22
#    mer    : % de pixels BLEU dense dans les 45% du haut       cible >= 3
#    veg    : % de pixels VEGETATION (verts)                    cible >= 3
#    lime   : % vert lime (style ABANDONNE)                     cible = 0.0
#    or     : % jaune-orange dore (muscles travailles)          cible > 0
#
#  CE QUE CET OUTIL NE FAIT PAS (et qu'il ne faut PAS lui faire dire)
#    - il ne juge PAS la posture. Le generateur redessine le fond a chaque pose
#      (mesure : masque de difference mediane = 30 a 60% de l'image sur un triplet
#      deposes pourtant conforme) -> aucune soustraction de fond n'est fiable ici.
#      La posture se controle A L'OEIL, par l'utilisateur, sur la planche presentee.
#    - le % de vegetation est indicauf : sur les exercices au sol ou en plan serre,
#      le cadrage coupe les palmiers. Ne pas en faire un critere absolu.
# ============================================================================
import sys, os, csv, glob, re, subprocess, tempfile
import numpy as np
from PIL import Image

CIBLE_SOL_R = (225, 240)      # rouge du coin de sol
CIBLE_SAT = 22.0              # saturation E1
SEUIL_LIME = 0.30             # % toléré de vert lime (bruit de compression)


def rgb_to_hsv(rgb):
    """rgb float [0..1] (h,w,3) -> (h,w,3) hsv, h en degres 0..360"""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-8
    idx = m & (mx == r); h[idx] = ((g - b)[idx] / d[idx]) % 6
    idx = m & (mx == g); h[idx] = ((b - r)[idx] / d[idx]) + 2
    idx = m & (mx == b); h[idx] = ((r - g)[idx] / d[idx]) + 4
    h = h * 60.0
    s = np.where(mx > 1e-8, d / np.maximum(mx, 1e-8), 0.0)
    return np.stack([h, s, mx], axis=2)


def hsl_saturation_mean(rgb):
    mx = rgb.max(axis=2); mn = rgb.min(axis=2)
    l = (mx + mn) / 2.0
    d = mx - mn
    s = np.where(d < 1e-8, 0.0, d / np.where(l < 0.5, mx + mn + 1e-8, 2.0 - mx - mn))
    return float(s.mean() * 100.0)


def silhouette(rgb):
    """RETIRE : cette metrique a ete testee et s'est revelee non fiable.
    Le masque 'peu sature + clair' attrape le sol gris ET le ciel : il couvrait
    30 a 45% de l'image sur des poses pourtant conformes, avec un rapport h/l
    egal a celui du cadre (0,49) dans 100% des cas. Elle ne mesure rien.
    Conserve pour memoire : ne pas la reactiver sans la recalibrer."""
    return None


def mesure(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".gif":
        # TOUJOURS coalescer : sinon frames 1x1 fantomes -> faux "GIF casse"
        tmp = tempfile.mktemp(suffix=".png")
        subprocess.run(["convert", path + "[0]", "-coalesce", tmp],
                       check=True, capture_output=True)
        im = Image.open(tmp).convert("RGB")
        os.unlink(tmp)
    else:
        im = Image.open(path).convert("RGB")
    w, h = im.size
    im2 = im.resize((400, max(1, int(400 * h / w))), Image.LANCZOS)
    rgb = np.asarray(im2).astype(np.float64) / 255.0
    H, W, _ = rgb.shape

    # --- sol : coin bas-gauche 18% x 14% (jamais le tiers bas entier)
    cw, ch = max(1, int(W * 0.18)), max(1, int(H * 0.14))
    coin = rgb[H - ch:H, 0:cw].reshape(-1, 3)
    sol = (int(coin[:, 0].mean() * 255), int(coin[:, 1].mean() * 255), int(coin[:, 2].mean() * 255))

    hsv = rgb_to_hsv(rgb)
    hu, sa, va = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    # --- mer : bleu dense dans les 45% du haut
    haut = slice(0, int(H * 0.45))
    bleu = ((hu > 185) & (hu < 260) & (sa > 0.18) & (va > 0.30))
    mer_pct = round(100.0 * bleu.mean(), 2)
    mer_haut_pct = round(100.0 * bleu[haut].mean(), 2)

    # --- vegetation : verts (feuilles) sur toute l'image
    veg = ((hu > 70) & (hu < 175) & (sa > 0.15) & (va > 0.12))
    veg_pct = round(100.0 * veg.mean(), 2)

    # --- vert LIME (style ABANDONNE) : vert franc, sature, clair
    lime = ((hu > 65) & (hu < 160) & (sa > 0.35) & (va > 0.55))
    lime_pct = round(100.0 * lime.mean(), 2)

    # --- muscles : jaune-orange dore
    or_ = ((hu > 18) & (hu < 58) & (sa > 0.40) & (va > 0.55))
    or_pct = round(100.0 * or_.mean(), 2)

    sat = round(hsl_saturation_mean(rgb), 1)

    # --- verdicts
    ok_sol = "OK" if CIBLE_SOL_R[0] <= sol[0] <= CIBLE_SOL_R[1] else ("BAS" if sol[0] < CIBLE_SOL_R[0] else "HAUT")
    ok_sat = "OK" if sat >= CIBLE_SAT else "PALE"
    ok_mer = "OK" if mer_pct >= 3.0 else "FAIBLE"
    ok_veg = "OK" if veg_pct >= 3.0 else "FAIBLE"
    ok_lime = "OK" if lime_pct <= SEUIL_LIME else "LIME!"
    verdict = "CONFORME" if (ok_sol == "OK" and ok_sat == "OK" and ok_mer == "OK"
                             and ok_lime == "OK") else "A_CONTROLER"

    return {
        "fichier": os.path.basename(path), "taille": f"{w}x{h}",
        "sol": f"{sol[0]} {sol[1]} {sol[2]}", "sol_ok": ok_sol,
        "sat": sat, "sat_ok": ok_sat,
        "mer%": mer_pct, "merH%": mer_haut_pct, "mer_ok": ok_mer,
        "veg%": veg_pct,
        "lime%": lime_pct, "lime_ok": ok_lime,
        "or%": or_pct,
        "verdict": verdict,
    }


def main():
    args = [a for a in sys.argv[1:]]
    csv_out = None
    frames = False
    if "--csv" in args:
        i = args.index("--csv"); csv_out = args[i + 1]; del args[i:i + 2]
    if "--frames" in args:
        frames = True; args.remove("--frames")

    files = []
    for a in args:
        if os.path.isdir(a):
            for root, _, fs in os.walk(a):
                for f in sorted(fs):
                    if f.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
                        files.append(os.path.join(root, f))
        else:
            files.append(a)

    if frames:
        expanded = []
        tmpdir = tempfile.mkdtemp()
        for f in files:
            if f.lower().endswith(".gif"):
                # decomposition en PNG : +adjoin evite tout probleme d'index fantome
                prefix = os.path.join(tmpdir, os.path.basename(f)[:-4])
                subprocess.run(["convert", f, "-coalesce", "+adjoin", prefix + "-f%d.png"],
                               check=True, capture_output=True)
                got = sorted(glob.glob(prefix + "-f*.png"),
                             key=lambda p: int(re.search(r"-f(\d+)\.png$", p).group(1)))
                expanded.extend(got)
            else:
                expanded.append(f)
        files = expanded

    rows = []
    for f in files:
        try:
            rows.append(mesure(f))
        except Exception as e:
            print(f"ERREUR {f}: {e}", file=sys.stderr)

    cols = ["fichier", "taille", "sol", "sol_ok", "sat", "sat_ok", "mer%", "merH%", "mer_ok",
            "veg%", "lime%", "lime_ok", "or%", "verdict"]
    if csv_out:
        with open(csv_out, "w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=cols); w.writeheader()
            for r in rows: w.writerow(r)
        print(f"-> {csv_out} ({len(rows)} lignes)")
    else:
        widths = {c: max(len(c), max((len(str(r.get(c, ''))) for r in rows), default=0)) for c in cols}
        print("  ".join(c.ljust(widths[c]) for c in cols))
        print("  ".join("-" * widths[c] for c in cols))
        for r in rows:
            print("  ".join(str(r.get(c, '')).ljust(widths[c]) for c in cols))


if __name__ == "__main__":
    main()
