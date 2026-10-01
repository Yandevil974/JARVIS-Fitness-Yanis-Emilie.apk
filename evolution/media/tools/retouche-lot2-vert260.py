#!/usr/bin/env python3
"""Lot 2 (n°1, 9, 10, 12) — même méthode que le lot 1 et le prototype n°44 validés.

Les sources natives de ces quatre numéros sont des planches à DEUX CASES (1376x768) :
une case par phase. Le GIF livré est un recadrage de chaque case (hauteur 768 -> 440),
agrandi ; on repart donc de la case native, on resserre le contour du vert, on ramène la
famille de couleurs dans celle du n°260 (percentiles p5/p50/p95, teinte recentrée de
moitié, aucun pixel uniformisé), puis on exporte WebP animé 660 (+ GIF de repli).

Cadrage : on réutilise EXACTEMENT la fenêtre du GIF livré (décalage x et largeur mesurés
par appariement à l'identique), pour ne pas changer le cadrage validé.

Zone verte : elle est peinte sur les muscles et peut être fragmentée en plusieurs taches
(sillons, ombres) ; on garde toutes les taches ≥ 250 px dans les ROI du corps — les
plantes et le matériel du décor sont exclus par construction (ROI).

    python3 evolution/media/tools/retouche-lot2-vert260.py
"""
import hashlib
import importlib.util
import json
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]

# --- on réutilise les fonctions déterministes du lot 1 (déjà validé) --------------
_spec = importlib.util.spec_from_file_location(
    'lot1', ROOT / 'evolution/media/tools/retouche-lot1-vert260.py')
L1 = importlib.util.module_from_spec(_spec)
sys.modules['lot1'] = L1
_spec.loader.exec_module(L1)

BASE = L1.BASE
OUT = BASE / 'lot2'
SRC = ROOT / '.cache/lot2/src'
HAUTEUR_EXPORT = L1.HAUTEUR_EXPORT
DUREE = L1.DUREE
F = L1.F
cadre = L1.cadre
sha = L1.sha
decoder = L1.decoder
extraire = L1.extraire
mesurer_export = L1.mesurer_export
statistiques_zone = L1.statistiques_zone
exporter_webp = L1.exporter_webp
exporter_gif_palette_partagee = L1.exporter_gif_palette_partagee
rgb_vers_hsv, hsv_vers_rgb = L1.rgb_vers_hsv, L1.hsv_vers_rgb
percentiles, mapper_par_ancres = L1.percentiles, L1.mapper_par_ancres
dilater, eroder, remplir_trous = L1.dilater, L1.eroder, L1.remplir_trous
score_vert = L1.score_vert

# --- ce que le lot a de mesuré --------------------------------------------------
# pour chaque numéro : planche native (2 cases) + pour chaque phase la case, les ROI de
# la zone verte, le seuil, et la fenêtre du GIF livré exprimée en pixels de la case.
CIBLES = [
    dict(numero=11, cle='back-squat|homme', ref_livre='refs/remotes/base/lots-complets',
         planche='planches/lot01/homme/back-squat.png',
         livre='gif/homme/back-squat-homme.gif', ref_source='refs/remotes/base/lots-complets',
         note='vert sur fessiers et quadriceps des deux jambes (les taches du décor, x<150, sont hors ROI)',
         phases=[
             dict(case=0, rois=[(150, 310, 220, 480), (255, 410, 345, 535), (342, 410, 430, 548)], seuil=0.10, mini=200,
                  fenetre=(0.0, 672.0)),
             dict(case=1, rois=[(150, 330, 195, 480), (216, 484, 330, 580), (362, 484, 478, 580)], seuil=0.10, mini=200,
                  fenetre=(0.0, 672.0)),
         ]),
    dict(numero=12, cle='back-squat-barre-haute|homme', ref_livre='refs/remotes/base/lots-complets',
         planche='planches/lot20/back-squat-barre-haute.png',
         livre='gif/homme/back-squat-barre-haute-homme.gif', ref_source='refs/remotes/base/lots-complets',
         note='vert sur fessiers et quadriceps des deux jambes',
         phases=[
             dict(case=0, rois=[(145, 365, 220, 475), (255, 412, 322, 532), (360, 412, 428, 532)], seuil=0.10, mini=200,
                  fenetre=(10.5, 682.5)),
             dict(case=1, rois=[(145, 368, 200, 465), (222, 458, 308, 553), (382, 458, 468, 550)], seuil=0.10, mini=200,
                  fenetre=(0.0, 672.0)),
         ]),
    dict(numero=30, cle='curl-barre-debout|homme', ref_livre='refs/remotes/base/lots-complets',
         planche='planches/lot26/curl-barre-debout.png',
         livre='gif/homme/curl-barre-debout-homme.gif', ref_source='refs/remotes/base/lots-complets',
         note='vert sur les biceps des deux bras',
         phases=[
             dict(case=0, rois=[(145, 275, 232, 420), (220, 224, 284, 392), (402, 224, 468, 392)], seuil=0.10, mini=200,
                  fenetre=(0.0, 679.0)),
             dict(case=1, rois=[(145, 356, 232, 475), (225, 224, 288, 345), (409, 223, 474, 345)], seuil=0.10, mini=200,
                  fenetre=(0.0, 679.0)),
         ]),
    dict(numero=42, cle='curl-scott-barre-ez-pronation|homme', ref_livre='refs/remotes/base/lots-complets',
         planche='planches/lot18/curl-scott-barre-ez-pronation.png',
         livre='gif/homme/curl-scott-barre-ez-pronation-homme.gif', ref_source='refs/remotes/base/lots-complets',
         note='vert sur les avant-bras / biceps pendant le curl Scott',
         phases=[
             dict(case=0, rois=[(280, 268, 512, 460)], seuil=0.10, mini=200, fenetre=(0.0, 684.2)),
             dict(case=1, rois=[(285, 238, 485, 390), (450, 285, 528, 390)], seuil=0.10, mini=200, fenetre=(3.5, 687.7)),
         ]),
]
ALPHA_BAS, ALPHA_HAUT = L1.ALPHA_BAS, L1.ALPHA_HAUT


def composantes(m, mini):
    """Toutes les taches ≥ mini px (le vert est souvent fragmenté par les sillons)."""
    h, w = m.shape
    vu = np.zeros_like(m, bool)
    out = np.zeros_like(m, bool)
    for y0 in range(h):
        for x0 in np.nonzero(m[y0] & ~vu[y0])[0]:
            if vu[y0, x0]:
                continue
            q = [(y0, x0)]
            vu[y0, x0] = True
            pts = []
            while q:
                y, x = q.pop()
                pts.append((y, x))
                for yy in range(max(0, y - 1), min(h, y + 2)):
                    for xx in range(max(0, x - 1), min(w, x + 2)):
                        if m[yy, xx] and not vu[yy, xx]:
                            vu[yy, xx] = True
                            q.append((yy, xx))
            if len(pts) >= mini:
                for y, x in pts:
                    out[y, x] = True
    return out


def main():
    TRAVAIL, EXP, PL = OUT / 'travail', OUT / 'exports', OUT / 'planches'
    for d in (TRAVAIL, EXP, PL):
        d.mkdir(parents=True, exist_ok=True)

    ref260 = Image.open(L1.REF260).convert('RGB')
    m260 = score_vert(np.asarray(ref260).astype(float)) > 0.08
    ref_stats = statistiques_zone(np.asarray(ref260), m260)

    controles = {
        'date': '2026-10-01', 'lot': 2, 'numeros': [1, 9, 10, 12],
        'methode': 'identique au prototype n°44 et au lot 1 validés',
        'decisions_utilisateur': {'format': 'webp animé', 'hauteur_px': HAUTEUR_EXPORT,
                                  'vert': 'famille du n°260', 'sources': 'natives, sans agrandissement'},
        'generation_images': 0, 'recoloration': 'oui, déterministe (aucun modèle)',
        'gif_livres_modifies': 0, 'apk_reconstruit': False, 'proposition_non_integree': True,
        'reference_260': ref_stats, 'numeros_detail': {},
    }

    for cible in CIBLES:
        n = cible['numero']
        detail = {'cle': cible['cle'], 'note': cible['note'], 'sources': [], 'phases': [],
                  'plancher_luminosite': 0.0, 'rampe_alpha': [ALPHA_BAS, ALPHA_HAUT], 'exports': []}
        chemin = extraire(cible['ref_source'], f"evolution/media/refonte-photo/{cible['planche']}",
                          SRC / f"{n}-planche.png")
        board = Image.open(chemin).convert('RGB')
        cw = board.width // 2
        detail['sources'].append({'fichier': cible['planche'], 'ref_git': cible['ref_source'],
                                  'local': str(chemin.relative_to(ROOT)), 'taille': list(board.size),
                                  'sha256': sha(chemin)})

        imgs_src, masques, silhouettes, alphas, avant = [], [], [], [], []
        for i, ph in enumerate(cible['phases']):
            case = board.crop((ph['case'] * cw, 0, (ph['case'] + 1) * cw, board.height))
            imgs_src.append(case)
            a = np.asarray(case).astype(float)
            sc = score_vert(a)
            m = np.zeros(sc.shape, bool)
            for (x0, y0, x1, y1) in ph['rois']:
                partiel = np.zeros(sc.shape, bool)
                partiel[y0:y1, x0:x1] = sc[y0:y1, x0:x1] >= ph['seuil']
                m |= composantes(partiel, ph['mini'])
            sil = dilater(remplir_trous(m), 2)
            alpha = np.clip((sc - ALPHA_BAS) / (ALPHA_HAUT - ALPHA_BAS), 0, 1) * sil
            masques.append(m); silhouettes.append(sil); alphas.append(alpha)
            avant.append(statistiques_zone(np.asarray(case), m))
            detail['phases'].append({'case': 'G' if ph['case'] == 0 else 'D', 'rois_xy': [list(r) for r in ph['rois']],
                                     'seuil': ph['seuil'], 'pixels_zone': int(m.sum()),
                                     'pixels_silhouette': int(sil.sum()),
                                     'fenetre_native': list(ph['fenetre'])})

        px = np.concatenate([np.asarray(imgs_src[i])[masques[i]] / 255.0 for i in range(len(imgs_src))])
        h0, s0, v0 = rgb_vers_hsv(px)
        ancres_s = percentiles(s0, [5, 50, 95]); ancres_v = percentiles(v0, [5, 50, 95])
        teinte_src = float(np.median(h0)) * 360
        teinte_cible = ref_stats['mediane_hsv']['teinte_deg']
        detail['correspondance'] = {
            'ancres_source_saturation': [round(x, 3) for x in ancres_s],
            'cible_260_saturation': ref_stats['percentiles_saturation'],
            'ancres_source_valeur': [round(x, 3) for x in ancres_v],
            'cible_260_valeur': ref_stats['percentiles_valeur'],
            'teinte_source_deg': round(teinte_src, 1), 'teinte_260_deg': teinte_cible,
            'regle': 'percentiles p5/p50/p95 appariés ; teinte recentrée de moitié ; aucun pixel uniformisé',
        }

        travail, png_660, apres = [], [], []
        for i, case in enumerate(imgs_src):
            a = np.asarray(case).astype(float)
            alpha = alphas[i][..., None]
            h, s, v = rgb_vers_hsv(a.reshape(-1, 3) / 255.0)
            s2 = np.clip(mapper_par_ancres(s, ancres_s, ref_stats['percentiles_saturation']), 0, 1)
            v2 = np.clip(mapper_par_ancres(v, ancres_v, ref_stats['percentiles_valeur']), 0, 1)
            h2 = teinte_cible / 360 + (h - teinte_src / 360) * 0.5
            nouveau = hsv_vers_rgb(h2 % 1.0, s2, v2).reshape(a.shape) * 255.0
            melange = a * (1 - alpha) + nouveau * alpha
            out = Image.fromarray(np.clip(melange + 0.5, 0, 255).astype(np.uint8))
            out.save(TRAVAIL / f'{n}-phase{i + 1}-vert260-{out.width}x{out.height}.png', optimize=True)
            travail.append(out)
            apres.append(statistiques_zone(np.asarray(out), masques[i]))
            # fenêtre du GIF livré (exprimée en pixels de la case) -> export 660
            plein = out.resize((round(out.width * HAUTEUR_EXPORT / out.height), HAUTEUR_EXPORT), Image.LANCZOS)
            ech = plein.width / out.width
            x0n, x1n = cible['phases'][i]['fenetre']
            x0 = max(0, round(x0n * ech)); x1 = min(plein.width, round(x1n * ech))
            png_660.append(plein.crop((x0, 0, x1, HAUTEUR_EXPORT)))
        for i, im in enumerate(png_660):
            im.save(TRAVAIL / f'{n}-phase{i + 1}-vert260-{im.width}x{im.height}.png', optimize=True)

        detail['vert_avant'] = avant
        detail['vert_apres'] = apres
        detail['contour'], detail['garantie_hors_zone'] = [], []
        for i in range(len(imgs_src)):
            sc_map = score_vert(np.asarray(imgs_src[i]).astype(float))
            travail_i = np.asarray(travail[i]).astype(float)
            perimetre = max(int((silhouettes[i] & ~eroder(silhouettes[i], 1)).sum()), 1)
            partiel_avant = int(((sc_map > ALPHA_BAS) & (sc_map < ALPHA_HAUT) & silhouettes[i]).sum())
            partiel_apres = int(((alphas[i] > 0.02) & (alphas[i] < 0.98)).sum())
            hors = alphas[i] <= 0.0
            detail['contour'].append({'phase': i + 1, 'perimetre_px': perimetre,
                                      'largeur_transition_avant_px': round(partiel_avant / perimetre, 2),
                                      'largeur_transition_apres_px': round(partiel_apres / perimetre, 2)})
            detail['garantie_hors_zone'].append({
                'phase': i + 1, 'pixels_hors_zone': int(hors.sum()),
                'pixels_modifies_hors_zone': int((np.abs(travail_i - np.asarray(imgs_src[i]).astype(float)).max(axis=2)[hors] > 0).sum())})

        cible_webp = EXP / f'{n}-vert260-660-webp-q90.webp'
        exporter_webp(cible_webp, png_660, 90)
        detail['exports'].append(dict(mesurer_export(cible_webp, png_660, 'WebP animé q90 — livrable principal'),
                                      format='webp', qualite=90, hauteur=HAUTEUR_EXPORT))
        cible_gif = EXP / f'{n}-vert260-660-repli.gif'
        exporter_gif_palette_partagee(cible_gif, png_660)
        detail['exports'].append(dict(mesurer_export(cible_gif, png_660, 'GIF de repli (palette 256 partagée)'),
                                      format='gif', qualite='palette 256', hauteur=HAUTEUR_EXPORT))

        # GIF livré : mesure + empreinte (branche de passation)
        livre = extraire(cible['ref_livre'], f"evolution/media/refonte-photo/{cible['livre']}", SRC / f"{n}-livre.gif")
        lf, _ = decoder(livre)
        detail['gif_livre_mesure'] = {
            'fichier': cible['livre'], 'sha256': sha(livre), 'taille': [lf[0].width, lf[0].height],
            'images': len(lf), 'poids_ko': round(livre.stat().st_size / 1024),
            'phases': [statistiques_zone(np.asarray(f).astype(float),
                                         score_vert(np.asarray(f).astype(float)) >= 0.10) for f in lf]}

        # planches de preuve
        lignes = [(f'PHASE {i + 1}', [cadre(im, 430)]) for i, im in enumerate(png_660)]
        marge, entete = 12, 26
        larg = max(sum(x.width for x in ims) + marge * 4 for _, ims in lignes)
        haut = sum(max(x.height for x in ims) + entete + marge for _, ims in lignes) + 30
        feuille = Image.new('RGB', (larg, haut), 'white')
        d = ImageDraw.Draw(feuille)
        d.text((marge, 8), f'LOT 2 — N°{n} : export 660 px réellement DÉCODÉ (WebP q90 puis GIF de repli)',
               font=F(17), fill='#12242f')
        y = 30
        for nom, ims in lignes:
            d.text((marge, y), nom, font=F(14), fill='#5a6a75'); y += entete
            x = marge
            for im in ims:
                feuille.paste(im, (x, y)); x += im.width + marge
            y += max(i.height for i in ims) + marge
        feuille.save(PL / f'LOT2-{n}-export-decode.png')

        x0, y0, x1, y1 = cible['phases'][0]['rois'][0]
        boite = (max(0, x0 - 60), max(0, y0 - 60), min(imgs_src[0].width, x1 + 300), min(imgs_src[0].height, y1 + 60))
        av = imgs_src[0].crop(boite); ap = travail[0].crop(boite)
        z = 2 if av.width * 2 <= 900 else 1
        tuiles = [('référence n°260', ref260.crop((60, 40, 180, 290)).resize((120, 250))),
                  ('AVANT — source native', av.resize((av.width * z, av.height * z), Image.LANCZOS)),
                  ('APRÈS — PNG de travail natif', ap.resize((ap.width * z, ap.height * z), Image.LANCZOS))]
        hv = max(t.height for _, t in tuiles) + 30
        fv = Image.new('RGB', (sum(t.width + 12 for _, t in tuiles) + 12, hv), 'white')
        dd = ImageDraw.Draw(fv); xx = 6
        for lab, t in tuiles:
            dd.text((xx, 6), lab, font=F(15), fill='#12242f'); fv.paste(t, (xx, 26)); xx += t.width + 12
        fv.save(PL / f'LOT2-{n}-avant-apres-natif.png')

        taille_app = lambda f: f.resize((max(1, round(f.width * 300 / f.height)), 300), Image.LANCZOS)
        livre_app = taille_app(lf[0])
        prop_app = taille_app(png_660[0])
        fa = Image.new('RGB', (livre_app.width + prop_app.width + 36, 330), 'white')
        da = ImageDraw.Draw(fa)
        da.text((12, 8), f'N°{n} à la taille réelle de l’application (300 px de haut)', font=F(16), fill='#12242f')
        da.text((12, 30), 'GIF livré aujourd’hui', font=F(13), fill='#5a6a75')
        da.text((24 + livre_app.width, 30), 'proposition lot 2', font=F(13), fill='#5a6a75')
        fa.paste(livre_app, (12, 48)); fa.paste(prop_app, (24 + livre_app.width, 48))
        fa.save(PL / f'LOT2-{n}-taille-application.png')

        detail['planches'] = [str((PL / n).relative_to(ROOT)) for n in
                              (f'LOT2-{n}-export-decode.png', f'LOT2-{n}-avant-apres-natif.png',
                               f'LOT2-{n}-taille-application.png')]
        controles['numeros_detail'][str(n)] = detail
        print(f"n°{n} : zone {sum(int(m.sum()) for m in masques)} px, "
              f"avant {avant[0]['mediane_rgb']} (S {avant[0]['mediane_hsv']['saturation']}) "
              f"→ après {apres[0]['mediane_rgb']} (S {apres[0]['mediane_hsv']['saturation']})")
        for e in detail['exports']:
            print(f"   {e['format']:<5} {e['taille'][0]}x{e['taille'][1]} {e['poids_ko']:>5} ko "
                  f"err {e['phases'][0]['erreur_moyenne']} PSNR {e['phases'][0]['psnr_db']} dB")

    (OUT / 'CONTROLES.json').write_text(json.dumps(controles, ensure_ascii=False, indent=1) + '\n')
    print('CONTROLES :', (OUT / 'CONTROLES.json').relative_to(ROOT))


if __name__ == '__main__':
    main()
