#!/usr/bin/env python3
"""retouche-vert-seul.py — améliorer la couleur verte des 34 visuels « femme » sans source native.

Décision utilisateur du 02/10/2026 : « N'agrandit pas. Laisse comme c'est. Juste la couleur
verte à améliorer. »

Donc, par rapport aux lots 1 à 21 :
  - **aucun agrandissement** : on travaille et on exporte à la taille exacte du GIF livré
    (440 px de haut, 2 images de 500 ms). Le seul départ possible reste ce GIF, puisque ces
    34 numéros n'ont aucune planche PNG native.
  - **seul le vert change** : la zone verte est ramenée dans la famille du n°260
    (saturation 0,914, teinte 86,3°) par correspondance de percentiles, comme le prototype 44
    validé. Rien d'autre n'est touché : 0 pixel modifié hors zone.
  - pas de recolorisation du décor, pas de voile, pas de masque étendu (ETENDRE_VERT = False,
    comme sur le modèle retouche-lot4).

Regroupement : plusieurs numéros partagent le même GIF à l'octet près. Ils sortent donc
identiques et ne sont fabriqués qu'une seule fois — on le dit au lieu de faire revalider
deux fois la même image.

Sorties : evolution/media/refonte-photo/hd-2026-09-30/sans-source/vert/
    avant/            les GIF livrés, tels quels
    exports/          les GIF corrigés, taille native
    planches/         avant | après | le vert seul, pour juger
    CONTROLES.json    couverture_peau, debordement_vert, décomposition du manque
    valider.html      la page à regarder

    python3 evolution/media/tools/retouche-vert-seul.py
"""
import hashlib
import importlib.util
import json
import pathlib
import subprocess
import sys

import numpy as np
from PIL import Image, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / "evolution/media/refonte-photo/hd-2026-09-30"
OUT = BASE / "sans-source" / "vert"
CACHE = ROOT / ".cache/sans-source"
REF_GIF = "refs/remotes/base/lots-complets"
PREF = "evolution/media/refonte-photo/"
REF260 = BASE / "prototype-44/sources/260-reference-elliptique-fractionne-femme-373x440.gif"

# les primitives éprouvées du chantier (prototype 44, lots 1 à 21)
_spec = importlib.util.spec_from_file_location(
    "lot1", ROOT / "evolution/media/tools/retouche-lot1-vert260.py")
L1 = importlib.util.module_from_spec(_spec)
sys.modules["lot1"] = L1
_spec.loader.exec_module(L1)

# ETENDRE_VERT = False, comme sur le modèle retouche-lot4 : on reste sur le COEUR VERT
# FRANC, pas sur le halo. Le seuil 0,12 est aussi celui avec lequel la référence 260 a été
# mesurée (saturation médiane 0,914, teinte 86,3° dans la consigne) : on compare donc
# deux zones définies exactement pareil.
SEUIL_VERT = 0.12
SEUIL_VERT_MESURE = 0.12
VAL_MIN = 0.18
SEUIL_DEBORDEMENT = 0.12
SEUIL_ZONE = 50          # en dessous, ce n'est pas une zone verte : du bruit
PALETTE_MAX = 256
DUREE = 500


# ------------------------------------------------------------------ lecture
def recuperer():
    """Les 34 GIF livrés, groupés par empreinte (plusieurs numéros partagent le même fichier)."""
    inv = json.load(open(BASE / "INVENTAIRE-SOURCES-389.json"))
    groupes = {}
    for e in inv["C3_sans_aucune_source"]:
        cle = e["cle"]
        sexe = cle.split("|")[-1]
        nom = cle.split("|")[0]
        chemin = f"{PREF}gif/{sexe}/{nom}-{sexe}.gif"
        local = CACHE / f"{e['numero']}.gif"
        if not local.exists():
            local.parent.mkdir(parents=True, exist_ok=True)
            r = subprocess.run(["git", "show", f"{REF_GIF}:{chemin}"],
                               cwd=ROOT, capture_output=True)
            if r.returncode or not r.stdout:
                continue
            local.write_bytes(r.stdout)
        h = hashlib.sha256(local.read_bytes()).hexdigest()
        g = groupes.setdefault(h, dict(empreinte=h, numeros=[], cle=nom, fichier=local,
                                       poids=local.stat().st_size))
        g["numeros"].append(e["numero"])
    for g in groupes.values():
        g["numeros"].sort()
    return sorted(groupes.values(), key=lambda g: g["numeros"][0])


def lire(chemin):
    im = Image.open(chemin)
    frames = [f.convert("RGB") for f in ImageSequence.Iterator(im)]
    durees = [f.info.get("duration", DUREE) for f in ImageSequence.Iterator(im)]
    return frames, durees


# ------------------------------------------------------------ zone et mesure
def masque_vert(frames):
    """Ce que le GIF livré peint en vert, sur les deux images ensemble."""
    m = np.zeros(frames[0].size[::-1], bool)
    for f in frames:
        a = np.asarray(f).astype(np.int16)
        m |= (L1.score_vert(a) > SEUIL_VERT) & (a.max(axis=2) / 255.0 > VAL_MIN)
    if not m.any():
        return m
    m = L1.plus_grande_composante(m)
    return L1.remplir_trous(m)


def vert_apres(frames):
    """Le vert mesuré après correction (seuil de mesure de la consigne)."""
    m = np.zeros(frames[0].size[::-1], bool)
    for f in frames:
        a = np.asarray(f).astype(np.int16)
        m |= (L1.score_vert(a) > SEUIL_VERT_MESURE) & (a.max(axis=2) / 255.0 > VAL_MIN)
    return m


def vert_large(frames):
    """Tout ce que le GIF livré teinte de vert, halo pâle compris (score > 0,02)."""
    m = np.zeros(frames[0].size[::-1], bool)
    for f in frames:
        a = np.asarray(f).astype(np.int16)
        m |= (L1.score_vert(a) > 0.02) & (a.max(axis=2) / 255.0 > VAL_MIN)
    return m


def couverture_et_debordement(sil, attendu, natif, halo=None):
    """(couverture, débordement, composition du vert manquant).

    Le débordement se mesure contre `halo` (tout ce que le GIF livré teintait déjà en vert,
    même pâle) et non contre le seul cœur vert franc : sinon le halo, une fois remonté dans
    la famille 260, compterait comme un débordement alors que l'application le peignait.
    """
    if not sil.any() or not attendu.any():
        return 0.0, 0.0, {}
    couv = float((sil & attendu).sum()) / float(attendu.sum())
    contre = L1.dilater(halo, 2) if halo is not None else L1.dilater(attendu, 3)
    deb = float((sil & ~contre).sum()) / float(sil.sum())
    manque = attendu & ~sil
    tot = float(attendu.sum())
    r, g, b = natif[..., 0], natif[..., 1], natif[..., 2]
    peau = manque & (r > g) & (g > b) & ((r - b) > 12)
    pale = manque & ~peau & (L1.score_vert(natif) > 0.02)
    compo = {"manque_peau": round(float(peau.sum()) / tot, 3),
             "manque_vert_pale": round(float(pale.sum()) / tot, 3),
             "manque_autre": round(float((manque & ~peau & ~pale).sum()) / tot, 3)}
    return couv, deb, compo


def stats_zone(frames, masque):
    """Saturation, valeur et teinte MÉDIANES de la zone, sur les deux images.

    La référence 260 est donnée en médiane par la consigne (saturation 0,914, teinte 86,3°) :
    on mesure donc la médiane des deux côtés, sinon on comparerait une moyenne à une médiane.
    L1.rgb_vers_hsv renvoie V sur 0-255, d'où la division.
    """
    px = np.concatenate([np.asarray(f)[masque] for f in frames], axis=0)
    h, s, v = L1.rgb_vers_hsv(px.astype(float))
    v = v / 255.0
    return dict(saturation=round(float(np.median(s)), 3), valeur=round(float(np.median(v)), 3),
                teinte=round(float(np.median(h) * 360) % 360, 1),
                saturation_moyenne=round(float(s.mean()), 3),
                pixels=int(masque.sum()), nuances=int(len(np.unique(px, axis=0))))


def statistiques_reference():
    frames, _ = lire(REF260)
    m = masque_vert(frames)
    px = np.concatenate([np.asarray(f)[m] for f in frames], axis=0)
    h, s, v = L1.rgb_vers_hsv(px.astype(float))
    v = v / 255.0
    stats = dict(saturation=round(float(np.median(s)), 3), valeur=round(float(np.median(v)), 3),
                 teinte=round(float(np.median(h) * 360) % 360, 1), pixels=int(m.sum()),
                 saturation_moyenne=round(float(s.mean()), 3))
    # les ancres de percentiles, plus la teinte MEDIANE (scalaire) pour le recentrage
    return stats, s, v, float(np.median(h))


# ------------------------------------------------------------------ le vert
def corriger(frames, masque, ref_s, ref_v, ref_h):
    """Ramène la zone verte dans la famille 260. Rien n'est touché hors du masque."""
    avant = [np.asarray(f).astype(float) for f in frames]
    empile = np.concatenate([a[masque] for a in avant], axis=0)
    h0, s0, v0 = L1.rgb_vers_hsv(empile)
    v0 = v0 / 255.0   # rgb_vers_hsv renvoie V sur 0-255 ; on repasse en 0-1 pour borner

    # correspondance de percentiles (p5 / p50 / p95), comme le prototype 44 validé
    qs = [5, 50, 95]
    s = L1.mapper_par_ancres(s0, L1.percentiles(s0, qs), L1.percentiles(ref_s, qs))
    v = L1.mapper_par_ancres(v0, L1.percentiles(v0, qs), L1.percentiles(ref_v, qs))
    # teinte : recentrée à 50 % de l'écart, la variation interne est conservée
    h = h0 + 0.5 * (ref_h - np.median(h0))
    s = np.clip(s, 0, 1)
    v = np.clip(v, 0, 1)

    rvb = L1.hsv_vers_rgb(h % 1.0, s, v) * 255.0
    apres = []
    decalage = 0
    for a in avant:
        n = a.copy()
        n[masque] = np.clip(rvb[decalage:decalage + int(masque.sum())], 0, 255)
        decalage += int(masque.sum())
        apres.append(np.clip(n, 0, 255).astype(np.uint8))
    return [Image.fromarray(x) for x in apres], avant


# ---------------------------------------------------------------- la sortie
def planche(avant, apres, masque, cible):
    """avant | après | le vert seul, à la taille native."""
    w, h = avant[0].size
    bande = Image.new("RGB", (w * 2 + 10, h * len(avant) + 6 * (len(avant) - 1)), (12, 14, 20))
    for i, (a, b) in enumerate(zip(avant, apres)):
        y = i * (h + 6)
        bande.paste(a, (0, y))
        bande.paste(b, (w + 10, y))
    vert_seul = Image.new("RGB", (w, h * len(apres) + 6 * (len(apres) - 1)), (0, 0, 0))
    m3 = np.repeat(masque[..., None], 3, axis=2)
    for i, b in enumerate(apres):
        vert_seul.paste(Image.fromarray((np.asarray(b) * m3).astype(np.uint8)), (0, i * (h + 6)))
    total = Image.new("RGB", (bande.width + vert_seul.width + 10, bande.height), (12, 14, 20))
    total.paste(bande, (0, 0))
    total.paste(vert_seul, (bande.width + 10, 0))
    total.save(cible)


CSS = """<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vert seul — 34 visuels femme sans source native</title><style>
*{box-sizing:border-box}
body{margin:0;background:#0b1220;color:#e2e8f0;font:15px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:28px 18px 70px}
h1{font-size:26px;margin:0 0 6px}
.sous{color:#94a3b8;margin:0 0 26px}
.carte{background:#111c31;border:1px solid #1e293b;border-radius:12px;padding:16px;margin:16px 0}
.carte h2{font-size:17px;margin:0 0 4px}
.carte .nums{color:#fbbf24;font-size:13px;margin:0 0 12px}
img{display:block;max-width:100%;height:auto;background:#000;border-radius:8px}
table{border-collapse:collapse;font-size:12.5px;margin-top:10px;width:100%}
th,td{border:1px solid #1e293b;padding:5px 8px;text-align:left}
th{background:#0f172a;color:#94a3b8}
.ok{color:#4ade80}.ko{color:#f87171}
.encadre{background:#111c31;border:1px solid #1e293b;border-left:3px solid #4ade80;
 border-radius:8px;padding:14px 16px;margin:14px 0}
.att{border-left-color:#fbbf24}
code{background:#0f172a;padding:1px 5px;border-radius:4px;font-size:12.5px;color:#fbbf24}
</style></head><body><div class="wrap">
<h1>Le vert seul — 34 visuels femme sans source</h1>
<p class="sous">Aucun agrandissement : taille exacte du GIF livré. Seule la couleur verte change.</p>
"""


def main():
    for d in (OUT / "avant", OUT / "exports", OUT / "planches"):
        d.mkdir(parents=True, exist_ok=True)

    ref_stats, ref_s, ref_v, ref_h = statistiques_reference()
    print("référence 260 :", ref_stats)

    groupes = recuperer()
    print(f"{len(groupes)} fichiers uniques pour {sum(len(g['numeros']) for g in groupes)} numéros")

    rapport = dict(date="2026-10-02", methode="vert seul, taille native, famille 260",
                   agrandissement=False, hauteur_export="taille native du GIF livré",
                   reference_260=ref_stats, images=[], numeros_sans_vert=[])

    for g in groupes:
        numero = g["numeros"][0]
        frames, durees = lire(g["fichier"])
        w, h = frames[0].size
        masque = masque_vert(frames)
        if masque.sum() < SEUIL_ZONE:
            rapport["numeros_sans_vert"] += g["numeros"]
            print(f"  n°{'-'.join(map(str, g['numeros'])):<12} aucun vert : rien à améliorer")
            continue

        avant_stats = stats_zone(frames, masque)
        apres, avant_arr = corriger(frames, masque, ref_s, ref_v, ref_h)

        # contrôle : rien n'a bougé hors de la zone verte
        hors = 0
        for a, b in zip(avant_arr, [np.asarray(x).astype(float) for x in apres]):
            hors += int((np.abs(a - b).max(axis=2) > 0.5)[~masque].sum())

        natif = np.asarray(frames[0]).astype(np.int16)
        couv, deb, compo = couverture_et_debordement(vert_apres(apres), masque, natif,
                                                     vert_large(frames))
        apres_stats = stats_zone(apres, masque)

        nom = f"{numero}-vert260-{w}x{h}"
        cible = OUT / "exports" / f"{nom}.gif"
        L1.exporter_gif_palette_partagee(cible, apres)
        (OUT / "avant" / f"{numero}-livre-{w}x{h}.gif").write_bytes(g["fichier"].read_bytes())
        planche(frames, apres, masque, OUT / "planches" / f"{nom}.png")

        teinte_avant = avant_stats["teinte"]
        if teinte_avant > 130:
            alerte = ("teinte très éloignée du vert muscle (260 = 86°) : ce que l'on mesure "
                      "est probablement l'eau du bassin, pas un muscle. À regarder avant "
                      "d'accepter.")
        elif teinte_avant > 115:
            alerte = "teinte tirant vers le cyan : vérifier que c'est bien le muscle et non l'eau."
        else:
            alerte = ""

        entree = dict(
            alerte=alerte,
            numeros=g["numeros"], cle=g["cle"], taille=f"{w}×{h}", images=len(frames),
            durees=durees, empreinte_source=g["empreinte"][:16],
            poids_source=g["poids"], poids_export=cible.stat().st_size,
            empreinte_export=hashlib.sha256(cible.read_bytes()).hexdigest(),
            export=str(cible.relative_to(OUT)),
            pixels_hors_zone_modifies=hors,
            couverture_peau=round(couv, 3), debordement_vert=round(deb, 3), **compo,
            avant=avant_stats, apres=apres_stats,
        )
        rapport["images"].append(entree)
        print(f"  n°{'-'.join(map(str, g['numeros'])):<12} vert {avant_stats['pixels']:>5} px  "
              f"S {avant_stats['saturation']:.3f} → {apres_stats['saturation']:.3f}  "
              f"hors_zone {hors}")

    rapport["resume"] = dict(
        numeros_total=sum(len(g["numeros"]) for g in groupes),
        fichiers_uniques=len(groupes),
        images_traitees=len(rapport["images"]),
        numeros_sans_vert=len(rapport["numeros_sans_vert"]),
        pixels_hors_zone_modifies=sum(i["pixels_hors_zone_modifies"] for i in rapport["images"]),
        agrandissement=False, gif_livres_modifies=0, apk_reconstruit=False,
    )
    with open(OUT / "CONTROLES.json", "w", encoding="utf-8") as f:
        json.dump(rapport, f, ensure_ascii=False, indent=1)

    # ---- page de validation
    p = [CSS]
    p.append(f'<div class="encadre"><p><b>Aucun agrandissement.</b> Chaque GIF reste à sa taille '
             f'd\'origine ({rapport["images"][0]["taille"]} en général, 2 images de 500 ms). '
             f'Seule la zone verte est ramenée dans la famille du n°260 '
             f'(saturation {ref_stats["saturation"]}, teinte {ref_stats["teinte"]}°), par '
             f'correspondance de percentiles — la méthode du prototype 44 validé. '
             f'<b>{rapport["resume"]["pixels_hors_zone_modifies"]} pixel modifié hors zone verte.</b></p></div>')
    p.append(f'<div class="encadre att"><p>{rapport["resume"]["fichiers_uniques"]} fichiers uniques '
             f'pour {rapport["resume"]["numeros_total"]} numéros : plusieurs numéros partagent le '
             f'même GIF à l\'octet près, ils sortent donc identiques et ne sont fabriqués qu\'une '
             f'fois. {rapport["resume"]["numeros_sans_vert"]} numéros n\'ont pas de vert du tout : '
             f'il n\'y a rien à y améliorer.</p></div>')
    for e in rapport["images"]:
        nums = ", ".join(str(n) for n in e["numeros"])
        p.append('<div class="carte">')
        p.append(f'<h2>n°{nums} — {e["cle"].replace("-", " ")}</h2>')
        if e["alerte"]:
            p.append(f'<p style="background:#3b1220;border-left:3px solid #f87171;'
                     f'padding:10px 12px;border-radius:6px;color:#fecaca;font-size:13px">'
                     f'<b>À regarder :</b> {e["alerte"]}</p>')
        p.append(f'<p class="nums">{e["taille"]} · {e["images"]} images de '
                 f'{e["durees"][0]} ms · zone verte {e["avant"]["pixels"]} px · '
                 f'{e["poids_source"]//1024} ko → {e["poids_export"]//1024} ko</p>')
        p.append(f'<img src="{e["export"]}" alt="après">')
        p.append('<table><tr><th></th><th>avant</th><th>après</th></tr>')
        p.append(f'<tr><td>saturation (260 = {ref_stats["saturation"]})</td>'
                 f'<td>{e["avant"]["saturation"]}</td><td class="ok">{e["apres"]["saturation"]}</td></tr>')
        p.append(f'<tr><td>teinte (260 = {ref_stats["teinte"]}°)</td>'
                 f'<td>{e["avant"]["teinte"]}°</td><td class="ok">{e["apres"]["teinte"]}°</td></tr>')
        p.append(f'<tr><td>nuances conservées</td><td>{e["avant"]["nuances"]}</td>'
                 f'<td>{e["apres"]["nuances"]}</td></tr>')
        p.append(f'<tr><td>couverture_peau</td><td colspan="2">{e["couverture_peau"]}</td></tr>')
        p.append(f'<tr><td>debordement_vert</td><td colspan="2">'
                 f'<span class="{"ok" if e["debordement_vert"] <= SEUIL_DEBORDEMENT else "ko"}">'
                 f'{e["debordement_vert"]}</span></td></tr>')
        p.append(f'<tr><td>manque_peau / vert_pâle / autre</td><td colspan="2">'
                 f'{e["manque_peau"]} / {e["manque_vert_pale"]} / {e["manque_autre"]}</td></tr>')
        p.append(f'<tr><td>pixels modifiés hors zone</td><td colspan="2">'
                 f'<span class="{"ok" if e["pixels_hors_zone_modifies"] == 0 else "ko"}">'
                 f'{e["pixels_hors_zone_modifies"]}</span></td></tr>')
        p.append('</table></div>')
    p.append('</div></body></html>')
    (OUT / "valider.html").write_text("".join(p), encoding="utf-8")

    print("\nécrit", OUT / "valider.html")
    print("exports :", len(rapport["images"]), "· sans vert :", rapport["numeros_sans_vert"])
    print("pixels modifiés hors zone :", rapport["resume"]["pixels_hors_zone_modifies"])


if __name__ == "__main__":
    main()
