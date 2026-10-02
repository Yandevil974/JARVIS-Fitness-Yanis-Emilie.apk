#!/usr/bin/env python3
"""Fabrique la page de validation d'un lot a partir de son CONTROLES.json.

La page ne raconte pas d'histoires : elle affiche les chiffres mesures (PSNR, saturation avant
/apres, largeur du contour, taille de la zone) et signale AUTOMATIQUEMENT les points qui sortent
des clous — contour large, saturation loin de la reference 260, zone tres etendue, teinte de
source eloignee. C'est ces alertes qu'il faut regarder en premier sur le telephone.

Un fichier de notes (JSON) peut ajouter une phrase par numero, par exemple :
  {"365": "meme planche et meme fenetre que le 366 : export identique",
   "340": "341 et 342 partagent cette planche : ils suivront presque gratuitement"}

    python3 evolution/media/tools/page-lot.py --lot 5
    python3 evolution/media/tools/page-lot.py --lot 5 --notes /tmp/notes-lot5.json
"""
import argparse
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'

CSS = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>JARVIS Fitness — lot {lot} : {liste}</title>
<style>
 body {{ margin:0; padding:16px 12px 70px; background:#f5f6f8; color:#12242f;
        font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; }}
 h1 {{ font-size:21px; margin:0 0 6px; }} h2 {{ font-size:18px; margin:26px 0 6px;
        padding-top:10px; border-top:2px solid #dcdfe4; }}
 p {{ color:#5a6a75; font-size:14px; margin:0 0 10px; }}
 ul {{ color:#5a6a75; font-size:14px; padding-left:20px; }}
 .note {{ background:#fff8e1; border:1px solid #f0e0a8; border-radius:10px; padding:10px 12px;
        font-size:13.5px; margin:12px 0; }}
 .ok {{ background:#e8f6ee; border:1px solid #b6e0c6; border-radius:10px; padding:10px 12px;
        font-size:13.5px; }}
 .alerte {{ background:#fdecec; border:1px solid #f3c2c2; border-radius:10px; padding:8px 11px;
        font-size:13.5px; margin:8px 0; }}
 .btn {{ display:block; text-decoration:none; color:#fff; background:#1668c8; border-radius:12px;
        padding:13px 16px; margin:9px 0; font-weight:700; font-size:16px; text-align:center; }}
 .btn small {{ display:block; font-weight:400; font-size:12.5px; opacity:.92; }}
 .btn.alt {{ background:#0a7d4b; }}
 .carte {{ background:#fff; border:1px solid #dcdfe4; border-radius:12px; padding:12px; margin:12px 0; }}
 .movement-visual {{ height:300px; display:flex; align-items:center; justify-content:center;
        background:#32343824; border:1px solid #dcdfe4; border-radius:12px; overflow:hidden; }}
 .movement-visual img {{ height:100%; width:auto; max-width:100%; object-fit:contain; display:block; }}
 .deux {{ display:flex; gap:10px; flex-wrap:wrap; }} .deux figure {{ margin:0; flex:1 1 46%; }}
 img {{ width:100%; border:1px solid #dcdfe4; border-radius:10px; background:#fff; }}
 figcaption {{ font-size:12.5px; color:#5a6a75; margin-top:4px; }}
 table {{ border-collapse:collapse; width:100%; font-size:13px; background:#fff;
        border-radius:10px; overflow:hidden; margin:8px 0; }}
 td, th {{ border:1px solid #e3e6ea; padding:6px 8px; text-align:left; }}
 th {{ background:#eef1f4; font-weight:600; }}
 code {{ background:#eef1f4; padding:1px 5px; border-radius:5px; font-size:13px; }}
</style></head><body>
"""


def nom_lisible(cle):
    exercice, profil = cle.split('|')
    return exercice.replace('-', ' ').capitalize(), profil


def alertes(n, det, ref_s):
    """Les points qui sortent des clous — c'est ça qu'il faut regarder."""
    out = []
    for i, c in enumerate(det['contour']):
        if c['largeur_transition_apres_px'] > 8:
            out.append(f"contour large : {c['largeur_transition_apres_px']} px de transition sur la phase {i+1} "
                       f"(3 à 6 px sur les numéros les plus nets) — le bord du vert y est plus doux")
    for i, a in enumerate(det['vert_apres']):
        s = a['mediane_hsv']['saturation']
        if s < 0.87:
            out.append(f"phase {i+1} plus terne que la référence ({s} contre {ref_s}) : l'ombrage entre les "
                       f"phases est conservé — dis-moi si tu veux la remonter")
        elif s > 0.96:
            out.append(f"phase {i+1} un peu plus saturée que la référence ({s} contre {ref_s})")
    zone = max(p['pixels_zone'] for p in det['phases'])
    if zone > 9000:
        out.append(f"zone verte étendue ({zone} px) : à vérifier qu'elle ne déborde pas sur le décor")
    t = det['correspondance']['teinte_source_deg']
    if abs(t - 86.3) > 5:
        out.append(f"teinte de la source à {t}°, éloignée des 86,3° du n°260 — la couleur de départ est différente")
    if any(g['pixels_modifies_hors_zone'] for g in det['garantie_hors_zone']):
        out.append("⚠️ des pixels ont été modifiés hors zone : ne pas valider")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lot', type=int, required=True)
    ap.add_argument('--notes', default='')
    args = ap.parse_args()

    dossier = BASE / f'lot{args.lot}'
    ctr = json.load(open(dossier / 'CONTROLES.json'))
    ref_s = ctr['reference_260']['mediane_hsv']['saturation']
    notes = json.load(open(args.notes)) if args.notes else {}
    numeros = [int(n) for n in ctr['numeros_detail']]
    numeros.sort()

    p = [CSS.format(lot=args.lot, liste=', '.join('n°' + str(n) for n in numeros))]
    p.append(f"<h1>Lot {args.lot} — {', '.join('n°' + str(n) for n in numeros)}</h1>")
    p.append("<p>Mêmes règles que le n°44 et les lots précédents que tu as validés : <strong>source PNG "
             "native, aucun agrandissement</strong>, retouche à la résolution de la source, vert ramené dans "
             "la famille du n°260, puis WebP animé 660 px (+ GIF de secours). <strong>Rien n'est intégré</strong> "
             ": aucun GIF livré remplacé, APK intact, 0 image générée.</p>")

    for n in numeros:
        det = ctr['numeros_detail'][str(n)]
        nom, profil = nom_lisible(det['cle'])
        wpg = [e for e in det['exports'] if e['format'] == 'webp'][0]
        gif = [e for e in det['exports'] if e['format'] == 'gif'][0]
        livre = det.get('gif_livre_mesure', {})
        p.append(f"<h2>n°{n} — {nom} ({profil})</h2>")
        p.append("<table>")
        p.append(f"<tr><th>Source</th><td>{det['sources'][0]['taille'][0]}×{det['sources'][0]['taille'][1]}</td>"
                 f"<th>GIF livré</th><td>{livre.get('taille', ['?','?'])[0]}×{livre.get('taille', ['?','?'])[1]}"
                 f" · {livre.get('poids_ko', '?')} ko</td></tr>")
        p.append(f"<tr><th>Export</th><td>{wpg['taille'][0]}×{wpg['taille'][1]}</td>"
                 f"<th>PSNR</th><td>{' · '.join(str(x['psnr_db']) + ' dB' for x in wpg['phases'])}</td></tr>")
        p.append(f"<tr><th>WebP q90</th><td>{wpg['poids_ko']} ko</td>"
                 f"<th>GIF de repli</th><td>{gif['poids_ko']} ko</td></tr>")
        p.append("<tr><th>Saturation</th><td colspan='3'>"
                 + ' · '.join(f"{a['mediane_hsv']['saturation']} → {b['mediane_hsv']['saturation']}"
                              for a, b in zip(det['vert_avant'], det['vert_apres']))
                 + f"  (référence 260 = {ref_s})</td></tr>")
        p.append("<tr><th>Zone</th><td>"
                 + ' · '.join(f"{q['pixels_zone']} px" for q in det['phases'])
                 + "</td><th>Contour</th><td>"
                 + ' · '.join(f"{c['largeur_transition_apres_px']} px" for c in det['contour'])
                 + "</td></tr></table>")
        if str(n) in notes:
            p.append(f"<div class='note'>{notes[str(n)]}</div>")
        al = alertes(n, det, ref_s)
        for a in al:
            p.append(f"<div class='alerte'>{a}</div>")
        if not al:
            p.append("<div class='ok'>Rien ne sort des clous sur ce numéro.</div>")
        p.append(f"<a class='btn' href='exports/{n}-vert260-660-webp-q90.webp' download>"
                 f"WebP animé 660 q90 — n°{n} <small>{wpg['poids_ko']} ko · {wpg['taille'][0]}×{wpg['taille'][1]}"
                 f" · {len(wpg['phases'])} phases de 500 ms</small></a>")
        p.append(f"<a class='btn alt' href='exports/{n}-vert260-660-repli.gif' download>"
                 f"GIF de secours <small>{gif['poids_ko']} ko</small></a>")
        p.append(f"<div class='carte'><div class='movement-visual'>"
                 f"<img src='exports/{n}-vert260-660-webp-q90.webp' alt='n°{n}'></div></div>")
        p.append("<div class='deux'>")
        p.append(f"<figure><img src='planches/LOT{args.lot}-{n}-avant-apres-natif.png' alt='avant après'>"
                 f"<figcaption>Avant / après à la résolution native</figcaption></figure>")
        p.append(f"<figure><img src='planches/LOT{args.lot}-{n}-taille-application.png' alt='taille application'>"
                 f"<figcaption>GIF livré / proposition, taille réelle</figcaption></figure>")
        p.append("</div>")

    p.append("<h2>Les fichiers exportés, décodés pour de vrai</h2>")
    p.append("<p>Ces planches montrent ce que contient <strong>réellement</strong> le WebP et le GIF de repli "
             "(fichiers rouverts image par image), pas le PNG de travail.</p>")
    p.append("<div class='deux'>")
    for n in numeros:
        p.append(f"<figure><img src='planches/LOT{args.lot}-{n}-export-decode.png' alt='{n} décodé'>"
                 f"<figcaption>n°{n} — WebP + GIF décodés</figcaption></figure>")
    p.append("</div>")

    p.append("<h2>Ce qui reste écarté</h2><ul>")
    p.append("<li><strong>n°1, 9, 10</strong> : vert = feuillage du décor (décision du 01/10/2026).</li>")
    p.append("<li><strong>n°218, 235, 239</strong> : planche annoncée ≠ GIF livré (47 à 80/255) — chantier à part.</li>")
    p.append("<li><strong>34 numéros « femme » sans source native</strong> (210, 224-259, 274-276, 289-330) : "
             "aucune source, donc hors de cette méthode.</li></ul>")
    p.append("<h2>Limites (inchangées)</h2><ul>")
    p.append("<li>Le GIF reste limité à <strong>256 couleurs par image</strong> : c'est le WebP qui porte la qualité.</li>")
    p.append("<li>Au-delà de 660 px d'export on n'ajoute aucun détail, seulement du poids.</li>")
    p.append("<li>Les ROI sont <strong>dérivées de la tache verte mesurée</strong> dans le GIF livré, pas posées "
             "à l'œil (pas de vision dans cette session) : à confirmer visuellement.</li></ul>")
    p.append("<div class='ok'><strong>Dis-moi, numéro par numéro :</strong> "
             + ' · '.join(f'« {n} OK »' for n in numeros)
             + " — ou ce qui cloche (teinte, contour, zone mal placée…). <strong>Rien ne sera intégré</strong> "
               "et aucun GIF livré ne sera remplacé avant ton accord.</div>")
    p.append(f"<h3>Contrôles chiffrés</h3><p>ROI, seuils, percentiles, poids, PSNR et garantie « aucun pixel "
             f"modifié hors zone » : <code>evolution/media/refonte-photo/hd-2026-09-30/lot{args.lot}/CONTROLES.json"
             f"</code></p>")
    p.append("</body></html>")

    cible = dossier / 'valider.html'
    cible.write_text('\n'.join(p), encoding='utf-8')
    print(f"écrit : {cible}")


if __name__ == '__main__':
    main()
