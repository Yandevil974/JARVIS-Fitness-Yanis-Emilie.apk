#!/usr/bin/env python3
"""Consigne la validation d'un lot : empreintes sha256 + mesures, dans
hd-2026-09-30/VALIDATION-LOTn-<date>.json.

Une validation n'est PAS une integration : ce fichier ne touche a aucun GIF livre et ne
modifie aucun export. Il fige seulement ce que l'utilisateur a valide, identifie par
l'empreinte des fichiers, pour qu'on puisse plus tard prouver que tel fichier est bien celui
qui a ete valide (et detecter toute regeneration involontaire).

    python3 evolution/media/tools/enregistrer-validation.py --lot 5 --reponse "364 OK / 365 OK / 366 OK / 340 OK"
    python3 evolution/media/tools/enregistrer-validation.py --lot 5 --reponse "..." --particularites /tmp/notes.json
"""
import argparse
import datetime
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lot', type=int, required=True)
    ap.add_argument('--reponse', required=True, help='réponse exacte de l’utilisateur')
    ap.add_argument('--particularites', default='')
    ap.add_argument('--date', default='')
    args = ap.parse_args()

    dossier = BASE / f'lot{args.lot}'
    ctr = json.load(open(dossier / 'CONTROLES.json'))
    fichiers, mesures = [], {}
    for n in sorted(ctr['numeros_detail'], key=int):
        det = ctr['numeros_detail'][n]
        for e in det['exports']:
            fichiers.append(dict(numero=int(n),
                                 role=('webp-q90' if e['format'] == 'webp' else 'gif-repli'),
                                 fichier=e['fichier'], sha256=e['sha256'], taille=e['taille'],
                                 images=len(e['phases']), poids_ko=e['poids_ko']))
        mesures[n] = dict(
            psnr_webp_db=[p['psnr_db'] for p in det['exports'][0]['phases']],
            psnr_gif_db=[p['psnr_db'] for p in det['exports'][1]['phases']],
            saturation_avant=[v['mediane_hsv']['saturation'] for v in det['vert_avant']],
            saturation_apres=[v['mediane_hsv']['saturation'] for v in det['vert_apres']],
            teinte_source_deg=det['correspondance']['teinte_source_deg'],
            transition_contour_apres_px=[c['largeur_transition_apres_px'] for c in det['contour']],
            pixels_zone=[p['pixels_zone'] for p in det['phases']],
            pixels_modifies_hors_zone=sum(g['pixels_modifies_hors_zone'] for g in det['garantie_hors_zone']))

    particularites = json.load(open(args.particularites)) if args.particularites else {}
    date = args.date or datetime.date.today().isoformat()
    val = {
        'date': date, 'lot': args.lot,
        'numeros': [int(n) for n in sorted(ctr['numeros_detail'], key=int)],
        'reponse_utilisateur': args.reponse,
        'contexte': f"Après consultation de la page lot{args.lot}/valider.html (servie sur le port 8080).",
        'fichier_valides': fichiers, 'mesures': mesures,
        'saturation_reference_260': ctr['reference_260']['mediane_hsv']['saturation'],
        'particularites': particularites,
        'verifications': {'pixels_modifies_hors_zone_sur_le_lot':
                          sum(v['pixels_modifies_hors_zone'] for v in mesures.values())},
        'portee': 'Les propositions du lot, telles quelles (fichiers identifiés par leur empreinte ci-dessus).',
        'non_couvert': ("Aucune intégration : les GIF livrés ne sont pas remplacés, l'APK n'est pas reconstruit, "
                        "le format WebP de l'app n'est pas adopté (accord + test WebView sur le téléphone "
                        "toujours requis)."),
        'methode': (f"evolution/media/tools/retouche-lot{args.lot}-vert260.py — mêmes fonctions déterministes "
                    f"que les lots précédents, 0 image générée, 0 GIF livré remplacé"),
        'regle': 'proposition ≠ validation ≠ intégration'}

    cible = BASE / f'VALIDATION-LOT{args.lot}-{date}.json'
    cible.write_text(json.dumps(val, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f"écrit : {cible}")
    print("pixels modifiés hors zone sur le lot :", val['verifications']['pixels_modifies_hors_zone_sur_le_lot'])
    for n, m in mesures.items():
        print(f"  n°{n}: PSNR {m['psnr_webp_db']} | S {m['saturation_avant']} → {m['saturation_apres']}")


if __name__ == '__main__':
    main()
