#!/usr/bin/env python3
"""Fabrique une page de TRI VISUEL pour une liste de numeros candidats.

Pour chaque numero, la page montre cote a cote :
  1. la fenetre de la SOURCE NATIVE recalee sur le GIF livre (non retouchee),
  2. le GIF LIVRE tel qu'il est dans l'app (il s'anime),
  3. la meme fenetre avec la zone verte mesuree en magenta,
avec les chiffres : erreur d'alignement, facteur de perte, position et taille de la tache verte.

Pourquoi une page et pas une automatisation : les essais de tri automatique ont ECHOUE
(voir PRIORITE-SOURCES-TRI.md). Ni le recouvrement des masques verts, ni la teinte, ni la
proportion de peau autour de la tache ne separent un vert pose sur le MUSCLE d'un vert de
DECOR (n degre 1, piege connu : 0,349 de recouvrement contre 0,274 pour le n degre 42 valide).
Seul l'oeil tranche. Cette page sert a trancher vite, sur le telephone.

    python3 evolution/media/tools/planche-tri.py 387,388,264,14,22,28,18,66
"""
import json
import pathlib
import shutil
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'
TRI = BASE / 'tri'
CACHE = ROOT / '.cache/priorite'
REF_SOURCES = 'c685298'
REF_GIF = 'base/lots-complets'
PREF = 'evolution/media/refonte-photo/'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SEUIL_VERT = 0.12
VAL_MIN = 0.18
H = 300          # hauteur d'affichage : celle de .movement-visual dans l'app


def extraire(ref, chemin, cible):
    cible = pathlib.Path(cible)
    if cible.exists() and cible.stat().st_size:
        return cible
    cible.parent.mkdir(parents=True, exist_ok=True)
    cible.write_bytes(subprocess.run(['git', 'show', f'{ref}:{chemin}'], cwd=ROOT,
                                     capture_output=True, check=True).stdout)
    return cible


def score_vert(a):
    return (a[..., 1].astype(np.int16) - np.maximum(a[..., 0], a[..., 2])) / 255.0


def valeur(a):
    return a.max(axis=2) / 255.0


def cadre(im, h=H):
    if im.height <= h:
        return im
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)


def blocs(numeros):
    prio = {r['numero']: r for r in json.load(open(BASE / 'PRIORITE-SOURCES.json'))['numeros']}
    inv = json.load(open(BASE / 'INVENTAIRE-SOURCES-389.json'))
    src = {e['numero']: e for s in ('A_manifeste', 'B_propositions', 'C2_retrouves_par_nom')
           for e in inv[s]}
    TRI.mkdir(parents=True, exist_ok=True)
    faits = []
    for n in numeros:
        e = src[n]
        sexe = e['cle'].split('|')[-1]
        cle = e['cle'].split('|')[0]
        r = prio.get(n, {})
        src_p = extraire(REF_SOURCES, PREF + e['chemin'], CACHE / 'src' / f'{n}.png')
        gif_p = extraire(REF_GIF, PREF + f'gif/{sexe}/{cle}-{sexe}.gif', CACHE / 'gif' / f'{n}.gif')
        source = Image.open(src_p).convert('RGB')
        gif = Image.open(gif_p)
        shutil.copy(gif_p, TRI / f'{n}-livre.gif')
        images = [im.convert('RGB') for im in ImageSequence.Iterator(gif)][:2]

        cellules, infos = [], []
        for k, g in enumerate(images):
            ph = (r.get('phases') or [{}])[k]
            fx, fw = ph.get('x0_source_natif'), ph.get('largeur_source_natif')
            if fx is None:
                fw = min(source.width, round(g.width * source.height / g.height))
                fx = (source.width - fw) // 2
            fen = source.crop((int(fx), 0, int(fx + fw), source.height))
            petit = fen.resize(g.size, Image.LANCZOS)
            sa = np.asarray(petit)
            m = (score_vert(sa) > SEUIL_VERT) & (valeur(sa) > VAL_MIN)
            overlay = sa.copy()
            overlay[m] = (255, 0, 255)
            cellules.append(cadre(fen))
            cellules.append(cadre(Image.fromarray(overlay)))
            infos.append(dict(phase=k + 1, x0=round(fx), largeur=round(fw),
                              pixels=int(m.sum()),
                              bbox=ph.get('vert_source', {}).get('bbox') if ph.get('vert_source') else None))
        (TRI / f'{n}-source.png').save(TRI / f'{n}-source.png') if False else None
        # on empile les phases cote a cote dans une seule image source + une seule image vert
        srcs = [c for k, c in enumerate(cellules) if k % 2 == 0]
        verts = [c for k, c in enumerate(cellules) if k % 2 == 1]
        def coller(imgs):
            w = sum(i.width for i in imgs) + 10 * (len(imgs) - 1)
            b = Image.new('RGB', (w, H), (245, 245, 245))
            x = 0
            for i in imgs:
                b.paste(i, (x, 0)); x += i.width + 10
            return b
        coller(srcs).save(TRI / f'{n}-source.png')
        coller(verts).save(TRI / f'{n}-vert.png')
        faits.append(dict(numero=n, cle=e['cle'], dims_source=list(source.size),
                          dims_gif=list(gif.size), images=len(images),
                          erreur=r.get('erreur_alignement_max'),
                          perte=r.get('facteur_perte'), infos=infos,
                          verdict=r.get('verdict')))
        print(f"n°{n} prêt — err {r.get('erreur_alignement_max')} · perte x{r.get('facteur_perte')}")
    return faits


def page(faits, titre):
    f = [dict(numero=x) for x in faits]
    rows = []
    for x in faits:
        ph = " · ".join(f"phase {i['phase']} : {i['pixels']} px"
                        + (f" @bbox {tuple(i['bbox'])}" if i.get('bbox') else "")
                        for i in x['infos'])
        rows.append(f"""
  <h2>n°{x['numero']} — {x['cle']}</h2>
  <p>Source {x['dims_source'][0]}×{x['dims_source'][1]} → GIF livré {x['dims_gif'][0]}×{x['dims_gif'][1]}
  · erreur d'alignement {x['erreur']}/255 · perte ×{x['perte']} · {x['images']} phase(s)<br>
  Vert mesuré dans la source : {ph}</p>
  <div class="deux">
    <figure><img src="{x['numero']}-source.png" alt="source"><figcaption>SOURCE native (fenêtre recalée, non retouchée)</figcaption></figure>
    <figure><img src="{x['numero']}-livre.gif" alt="gif livre"><figcaption>GIF LIVRÉ aujourd'hui dans l'app</figcaption></figure>
  </div>
  <figure><img src="{x['numero']}-vert.png" alt="vert mesure"><figcaption>Zone verte détectée dans la source (magenta)</figcaption></figure>""")

    html = f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>JARVIS Fitness — tri visuel des candidats</title>
<style>
 body {{ margin:0; padding:16px 12px 70px; background:#f5f6f8; color:#12242f;
        font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; }}
 h1 {{ font-size:21px; margin:0 0 6px; }} h2 {{ font-size:18px; margin:26px 0 6px;
        padding-top:10px; border-top:2px solid #dcdfe4; }}
 p {{ color:#5a6a75; font-size:14px; margin:0 0 10px; }}
 .note {{ background:#fff8e1; border:1px solid #f0e0a8; border-radius:10px; padding:10px 12px;
        font-size:13.5px; margin:12px 0; }}
 .deux {{ display:flex; gap:10px; flex-wrap:wrap; }} .deux figure {{ margin:0; flex:1 1 46%; }}
 img {{ width:100%; border:1px solid #dcdfe4; border-radius:10px; background:#fff; }}
 figcaption {{ font-size:12.5px; color:#5a6a75; margin-top:4px; }}
 code {{ background:#eef1f4; padding:1px 5px; border-radius:5px; font-size:13px; }}
</style></head><body>
<h1>Tri visuel — {titre}</h1>
<p>Ces numéros ont tous une <strong>source native qui correspond au GIF livré</strong> (erreur d'alignement
basse) et une <strong>zone verte mesurée dans la source</strong>. Reste la seule question que je ne peux pas
trancher seul : <strong>le vert est-il bien sur le muscle</strong> (fessier, quadriceps, biceps, mollet…)
ou sur le décor (plante, tapis, machine) ?</p>
<div class="note">Sur chaque ligne : à gauche la <strong>source native</strong> (nette), à droite le
<strong>GIF livré</strong> tel qu'il est dans l'app, en dessous la <strong>zone verte détectée</strong> en
magenta. Si le magenta tombe sur le muscle → le numéro est bon pour la retouche. S'il tombe sur une plante,
un tapis ou un mur → on l'écarte et je le note.</div>
{''.join(rows)}
<p style="margin-top:26px">Dis-moi lesquels tu retiens (par exemple « 387, 388, 264 et 14 »), et je fais le
lot suivant avec exactement la même méthode que le lot 2 que tu viens de valider.</p>
</body></html>"""
    (TRI / 'tri.html').write_text(html, encoding='utf-8')
    print(f"\nécrit : {TRI/'tri.html'} ({len(faits)} numéros)")


if __name__ == '__main__':
    nums = [int(x) for x in sys.argv[1].split(',')]
    titre = sys.argv[2] if len(sys.argv) > 2 else "candidats lot 3"
    page(blocs(nums), titre)
