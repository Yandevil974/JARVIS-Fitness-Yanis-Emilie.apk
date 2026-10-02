#!/usr/bin/env python3
"""Fabrique le sommaire des pages de validation, a partir de l'etat REEL du dossier
(lots presents + validations consignees). A refaire a chaque lot : ca evite un sommaire qui ment.
    python3 evolution/media/tools/page-sommaire.py
"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'

CSS = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>JARVIS Fitness — pages de validation visuels</title>
<style>
 body { margin:0; padding:18px 14px 60px; background:#f5f6f8; color:#12242f;
        font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; }
 h1 { font-size:21px; margin:0 0 6px; } p { color:#5a6a75; font-size:14px; margin:0 0 14px; }
 .btn { display:block; text-decoration:none; color:#fff; background:#1668c8; border-radius:12px;
        padding:14px 16px; margin:10px 0; font-weight:700; font-size:17px; }
 .btn small { display:block; font-weight:400; font-size:12.5px; opacity:.92; margin-top:2px; }
 .btn.attente { background:#0a7d4b; } .btn.gris { background:#5a6a75; }
 .btn.tri { background:#8a5a00; }
 .note { background:#fff8e1; border:1px solid #f0e0a8; border-radius:10px; padding:10px 12px; font-size:13.5px; }
</style></head><body>
<h1>Validation des visuels</h1>
<p>Chantier « qualité des visuels » — sources PNG natives, retouche à la résolution native, puis export.
<strong>Rien n'est intégré</strong> : aucun GIF livré remplacé, APK intact.</p>
"""

def etat_lots():
    lots = []
    for d in sorted(BASE.glob('lot*')):
        if not d.is_dir() or not (d / 'CONTROLES.json').exists():
            continue
        ctr = json.load(open(d / 'CONTROLES.json'))
        vals = sorted(BASE.glob(f'VALIDATION-LOT{d.name[3:]}-*.json'))
        # NB : le champ 'numeros' de lot2/CONTROLES.json est erroné (il liste 1, 9, 10, 12 qui
        # sont les numéros ÉCARTÉS). On prend donc les numéros réellement produits.
        faits = sorted(int(k) for k in ctr.get('numeros_detail', {}))
        numeros = ', '.join('n°' + str(x) for x in (faits or ctr.get('numeros', [])))
        lots.append((int(d.name[3:]), d.name, numeros, bool(vals)))
    return lots

def main():
    p = [CSS]
    lots = etat_lots()
    for num, dossier, numeros, valide in sorted(lots, reverse=True):
        if valide:
            cls, msg = 'gris', 'validé — non intégré'
        else:
            cls, msg = 'attente', 'EN ATTENTE de ton verdict, numéro par numéro'
        p.append(f"<a class='btn {cls}' href='{dossier}/valider.html'>Lot {num} — {numeros} <small>{msg}</small></a>")
    p.append("<a class='btn tri' href='tri/tri.html'>Tri visuel <small>page de tri des candidats (refabriquée à la demande)</small></a>")
    p.append("<a class='btn gris' href='index.html'>Prototype n°44 <small>validé — WebP 660 q90, vert 260</small></a>")
    p.append("<div class='note'>Ouvre de préférence sur le téléphone : les visuels sont affichés à la taille "
             "réelle de l'application (300 px de haut), c'est là que la netteté se juge.</div>")
    p.append("</body></html>")
    (BASE / 'sommaire.html').write_text('\n'.join(p), encoding='utf-8')
    print('sommaire écrit :', ', '.join(f'lot{n}{" (validé)" if v else ""}' for n, _, _, v in sorted(lots)))

main()
