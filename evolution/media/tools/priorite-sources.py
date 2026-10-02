#!/usr/bin/env python3
"""Mesure, pour chaque numero, l'ecart reel entre le GIF livre et sa source PNG native.

Pourquoi : fixer la priorite des lots suivants SANS deviner. Pour chaque numero qui a une
source native, on fait trois mesures deterministes :

 1. ALIGNEMENT : on recale chaque image du GIF livre sur la planche native (recherche
    grossiere puis fine de la fenetre horizontale). On note l'erreur moyenne (0-255).
    Une erreur forte = la planche annoncee n'est PAS la bonne source (piege n 3 : 218,
    235, 239 faisaient 47 a 80/255). Ces numeros sont ECARTES de la file d'attente.
 2. PERTE : combien de pixels de la source ont ete jetes pour fabriquer le GIF livre
    (pixels de la fenetre source / pixels du GIF). C'est la cause mecanique du
    « pixelise » : plus c'est haut, plus le numero a y gagner.
 3. VERT : ou est la tache verte la plus grande dans le GIF livre, et y a-t-il une tache
    verte au meme endroit dans la source native ?
      - vert des deux cotes et au meme endroit  -> retouchable (c'est le muscle)
      - vert dans le GIF, rien dans la source   -> ECARTER : le vert a ete fabrique
        apres coup (piege n 1 : feuillage du decor, ex. 1, 9, 10)
    La decision finale reste visuelle : ce tableau ne fait que trier.

Sortie : evolution/media/refonte-photo/hd-2026-09-30/PRIORITE-SOURCES.json

    python3 evolution/media/tools/priorite-sources.py [--limite N]
"""
import argparse
import io
import json
import pathlib
import subprocess
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'
CACHE = ROOT / '.cache/priorite'
REF_SOURCES = 'c685298'                    # planches natives / propositions
REF_GIF = 'base/lots-complets'             # les 391 GIF livres
PREF = 'evolution/media/refonte-photo/'

SEUIL_VERT = 0.12          # (G - max(R,B)) / 255 : vert franc, pas le feuillage jaune-vert
VAL_MIN = 0.18             # luminosite mini (exclut les ombres noires)
TAILLE_TACHE = 150         # px a l'echelle de la source redimensionnee
ERREUR_ALIGNEMENT_MAX = 26.0   # au-dela, la planche annoncee n'est pas la bonne source


def git_show(ref, chemin):
    return subprocess.run(['git', 'show', f'{ref}:{chemin}'], cwd=ROOT,
                          capture_output=True, check=True).stdout


def extraire(ref, chemin, cible):
    cible = pathlib.Path(cible)
    if cible.exists() and cible.stat().st_size:
        return cible
    cible.parent.mkdir(parents=True, exist_ok=True)
    cible.write_bytes(git_show(ref, chemin))
    return cible


def score_vert(a):
    return (a[..., 1].astype(np.int16) - np.maximum(a[..., 0], a[..., 2])) / 255.0


def valeur(a):
    return a.max(axis=2) / 255.0


def plus_grosse_tache(masque, minimum):
    """Renvoie (nb_pixels, centroid_y, centroid_x, bbox) de la plus grande composante."""
    h, w = masque.shape
    vu = np.zeros_like(masque, bool)
    meilleure = None
    for y0 in range(h):
        for x0 in np.nonzero(masque[y0] & ~vu[y0])[0]:
            if vu[y0, x0]:
                continue
            q = deque([(y0, x0)]); vu[y0, x0] = True; pts = []
            while q:
                y, x = q.popleft(); pts.append((y, x))
                for yy in range(max(0, y - 1), min(h, y + 2)):
                    for xx in range(max(0, x - 1), min(w, x + 2)):
                        if masque[yy, xx] and not vu[yy, xx]:
                            vu[yy, xx] = True
                            pts.append((yy, xx))
                            q.append((yy, xx))
            if len(pts) >= minimum and (meilleure is None or len(pts) > meilleure[0]):
                ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
                meilleure = (int(len(pts)), float(np.mean(ys)), float(np.mean(xs)),
                             (int(min(xs)), int(min(ys)), int(max(xs) + 1), int(max(ys) + 1)))
    return meilleure


def erreur_fenetre(src, gif, x0):
    """Erreur moyenne (0-255) entre le GIF et la fenetre [x0, x0+w] de la source."""
    w, h = gif.size
    if x0 + w > src.size[0]:
        return 1e9
    rec = src.crop((x0, 0, x0 + w, h))
    return float(np.abs(np.asarray(rec, np.int16) - np.asarray(gif, np.int16)).mean())


def aligner(src_rgb, gif_rgb):
    """Recale gif dans src (meme hauteur). Renvoie (x0, erreur)."""
    gh, gw = gif_rgb.shape[:2]
    sh, sw = src_rgb.shape[:2]
    if sw < gw:
        return None, 1e9
    src = Image.fromarray(src_rgb)
    gif = Image.fromarray(gif_rgb)
    if sh != gh:                      # la source est mise a la hauteur du GIF, puis on cherche en x
        src = src.resize((max(1, round(sw * gh / sh)), gh), Image.LANCZOS)
    sw2 = src.size[0]
    if sw2 < gw:
        return None, 1e9
    # passe grossiere (1/4), puis fine autour du meilleur
    pas = 4
    xs = list(range(0, sw2 - gw + 1, pas))
    s4 = src.resize((max(1, sw2 // 4), max(1, gh // 4)), Image.BILINEAR)
    g4 = gif.resize((max(1, gw // 4), max(1, gh // 4)), Image.BILINEAR)
    a4 = np.asarray(s4, np.int16); b4 = np.asarray(g4, np.int16)
    w4 = max(1, gw // 4)
    best, bx = 1e18, 0
    src_a = np.asarray(src, np.int16); gif_a = np.asarray(gif, np.int16)
    for x in xs:
        e = float(np.abs(a4[:, x // 4:x // 4 + w4] - b4).mean())
        if e < best:
            best, bx = e, x
    lo, hi = max(0, bx - pas), min(sw2 - gw, bx + pas)
    for x in range(lo, hi + 1):
        e = float(np.abs(src_a[:, x:x + gw] - gif_a).mean())
        if e < best:
            best, bx = e, x
    return bx, best


def analyser(numero, cle, chemin_source, chemin_gif):
    sexe = cle.split('|')[-1]
    local_src = CACHE / 'src' / f'{numero}.png'
    local_gif = CACHE / 'gif' / f'{numero}.gif'
    try:
        extraire(REF_SOURCES, PREF + chemin_source, local_src)
        extraire(REF_GIF, PREF + chemin_gif, local_gif)
    except subprocess.CalledProcessError:
        return None
    src = Image.open(local_src).convert('RGB')
    gif = Image.open(local_gif)
    res = dict(numero=numero, cle=cle, source=chemin_source, dims_source=list(src.size),
               dims_gif=list(gif.size), images=gif.n_frames)
    phases = []
    for i, im in enumerate(ImageSequence.Iterator(gif)):
        g = im.convert('RGB')
        x0, err = aligner(np.asarray(src), np.asarray(g))
        if x0 is None:
            return dict(res, erreur_alignement=None, verdict='source inexploitable')
        # fenetre en pixels de la source NATIVE (pour la retouche)
        echelle = src.size[0] / max(1, round(src.size[0] * g.size[1] / src.size[1]))
        fx0 = x0 * echelle
        fw = g.size[0] * echelle
        # vert : cote GIF et cote source, au meme endroit
        ga = np.asarray(g)
        m_gif = (score_vert(ga) > SEUIL_VERT) & (valeur(ga) > VAL_MIN)
        t_gif = plus_grosse_tache(m_gif, TAILLE_TACHE)
        fen = src.crop((int(round(fx0)), 0, int(round(fx0 + fw)), src.size[1]))
        pt = fen.resize(g.size, Image.LANCZOS)
        sa = np.asarray(pt)
        m_src = (score_vert(sa) > SEUIL_VERT) & (valeur(sa) > VAL_MIN)
        t_src = plus_grosse_tache(m_src, TAILLE_TACHE)
        dist = None
        if t_gif and t_src:
            dist = float(np.hypot(t_gif[1] - t_src[1], t_gif[2] - t_src[2]))
        phases.append(dict(image=i, x0_source_natif=round(float(fx0), 1),
                           largeur_source_natif=round(float(fw), 1), erreur=round(float(err), 2),
                           vert_gif=dict(pixels=int(t_gif[0]),
                                         centre=[int(round(t_gif[1])), int(round(t_gif[2]))],
                                         bbox=list(t_gif[3])) if t_gif else None,
                           vert_source=dict(pixels=int(t_src[0]),
                                            centre=[int(round(t_src[1])), int(round(t_src[2]))],
                                            bbox=list(t_src[3])) if t_src else None,
                           distance_centres=round(float(dist), 1) if dist is not None else None))
    err_max = max(p['erreur'] for p in phases)
    res['phases'] = phases
    res['erreur_alignement_max'] = round(err_max, 2)
    px_src = sum(p['largeur_source_natif'] for p in phases) / len(phases) * src.size[1]
    px_gif = gif.size[0] * gif.size[1]
    res['facteur_perte'] = round(px_src / px_gif, 2)
    verts_gif = [p['vert_gif'] for p in phases]
    verts_src = [p['vert_source'] for p in phases]
    if err_max > ERREUR_ALIGNEMENT_MAX:
        res['verdict'] = 'ECARTER : la planche annoncee ne correspond pas au GIF livre'
    elif any(v is None for v in verts_gif):
        res['verdict'] = 'A REGARDER : pas de vert franc dans le GIF livre'
    elif any(v is None for v in verts_src):
        res['verdict'] = 'ECARTER : vert du GIF absent de la source (vert fabrique apres coup)'
    elif any(p['distance_centres'] is not None and p['distance_centres'] > 0.12 * min(gif.size)
             for p in phases):
        res['verdict'] = 'A REGARDER : le vert du GIF et celui de la source ne sont pas au meme endroit'
    else:
        res['verdict'] = 'RETENUE : vert present des deux cotes, au meme endroit'
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limite', type=int, default=0)
    ap.add_argument('--numeros', default='')
    args = ap.parse_args()

    inv = json.load(open(BASE / 'INVENTAIRE-SOURCES-389.json'))
    src = {}
    for section in ('A_manifeste', 'B_propositions', 'C2_retrouves_par_nom'):
        for e in inv[section]:
            src[e['numero']] = e
    numeros = sorted(src)
    if args.numeros:
        numeros = [int(x) for x in args.numeros.split(',') if int(x) in src]
    if args.limite:
        numeros = numeros[:args.limite]

    out = []
    for k, n in enumerate(numeros, 1):
        e = src[n]
        sexe = e['cle'].split('|')[-1]
        cle = e['cle'].split('|')[0]
        r = analyser(n, e['cle'], e['chemin'], f'gif/{sexe}/{cle}-{sexe}.gif')
        if r:
            out.append(r)
            print(f"[{k}/{len(numeros)}] n°{n:<4} err {r.get('erreur_alignement_max')}  "
                  f"perte x{r.get('facteur_perte')}  {r['verdict'][:60]}", flush=True)
        else:
            print(f"[{k}/{len(numeros)}] n°{n:<4} source ou GIF introuvable", flush=True)

    (BASE / 'PRIORITE-SOURCES.json').write_text(
        json.dumps(dict(seuil_vert=SEUIL_VERT, erreur_alignement_max=ERREUR_ALIGNEMENT_MAX,
                        numeros=out), ensure_ascii=False, indent=1), encoding='utf-8')
    bons = [r for r in out if r['verdict'].startswith('RETENUE')]
    bons.sort(key=lambda r: -r['facteur_perte'])
    print(f"\n{len(bons)} numeros retenus, tries par perte decroissante :")
    for r in bons[:20]:
        print(f"  n°{r['numero']:>3} perte x{r['facteur_perte']:<5} err {r['erreur_alignement_max']:<5} {r['cle'][:46]}")


if __name__ == '__main__':
    main()
