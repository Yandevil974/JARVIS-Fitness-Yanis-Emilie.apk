#!/usr/bin/env python3
"""Lot 1 (n°45, 48, 19, 85) — retouche déterministe depuis les sources natives.

Mêmes règles que le prototype n°44 VALIDÉ le 30/09/2026 (aucune génération d'image) :

 1. on part de la source native (aucun agrandissement) ;
 2. on resserre le contour de la zone verte (l'alpha passe de 0,03 à 0,17 : plus de halo,
    c'est le halo qui donnait l'effet « plaque collée ») ;
 3. on rapproche la famille de couleurs de la référence n°260 par correspondance de
    percentiles p5/p50/p95 sur la saturation et la valeur, teinte recentrée de moitié :
    aucun pixel n'est uniformisé, chaque pixel garde sa nuance (texture, relief, ombres) ;
 4. on n'écrit qu'ensuite : PNG de travail à la résolution native, puis WebP animé 660 px
    et GIF de repli 660 px (palette partagée) ;
 5. on décode réellement chaque fichier exporté et on le compare au PNG de travail.

Spécificités du lot, mesurées avant d'écrire :

 * 19 (bulgarian split squat, femme) : la zone verte de l'app est le PANNEAU DU LEGGING
   (olive, R≈G, B très bas) — pas du muscle. Le vert « lime strict » du lot68 y avait
   fabriqué un aplat qui débordait sur l'avant-bras (recolorisation NON validée par
   l'utilisateur). On garde donc le panneau réel, avec son tissu, sa couture et son
   ombre, et on l'amène dans la famille 260. Plantes du décor hors zone.
 * 48 (curl Zottman, homme) : le vert de la source est un voile translucide sur
   l'avant-bras (la peau se voit au travers). On préserve la translucidité.
 * 85 (élévations latérales coude 90, homme) : les deltoïdes sont peints dans la source,
   avec relief ; l'ancien export les avait ASSOMBRIS (V 0,60 → 0,52) et aplatis.
 * 45 : même démonstration que 44 (GIF livrés identiques, sha256 4696c143…) — aucun
   nouveau calcul, on reprend la sortie validée du 44.

    python3 evolution/media/tools/retouche-lot1-vert260.py
"""
import hashlib
import json
import pathlib
import shutil
import subprocess
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'
OUT = BASE / 'lot1'
SRC = ROOT / '.cache/lot1/src'
REF260 = BASE / 'prototype-44/sources/260-reference-elliptique-fractionne-femme-373x440.gif'
SORTIE_44 = BASE / 'prototype-44-vert260/exports/44-vert260-660-webp-q90.webp'
SORTIE_44_GIF = BASE / 'prototype-44-vert260/exports/44-vert260-660-repli.gif'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
F = lambda n: ImageFont.truetype(FONT, n)

HAUTEUR_EXPORT = 660          # décision utilisateur du 30/09/2026
DUREE = 500
PALETTE_MAX = 256
ALPHA_BAS, ALPHA_HAUT = 0.03, 0.17   # rampe resserrée du 44 validé

# --- ce que le lot a de particulier, mesuré puis figé ici ------------------------
CIBLES = [
    dict(
        numero=19, cle='bulgarian-split-squat-halteres|femme', mode='olive', v_min=0.0,
        sources=[dict(git='c685298', chemin='evolution/media/refonte-photo/propositions/lot57/planches/bulgarian-split-squat-halteres.png',
                      local='19-planche.png', caisse=(0, 0, 688, 768))],
        phases=[dict(caisse=(0, 0, 688, 768), rois=[(222, 360, 350, 520)], seuil=0.16, fenetre=(10 / 394, 381 / 394)),
                dict(caisse=(688, 0, 1376, 768), rois=[(170, 360, 302, 515)], seuil=0.14, fenetre=(0.0, 381 / 394))],
        livre='gif/femme/bulgarian-split-squat-halteres-femme.gif', ref_livre='3cbb3e5', echelle_livre=440 / 768,
        note='panneau du legging (olive) ramené dans la famille 260 ; aplat lime du lot68 abandonné'),
    dict(
        numero=48, cle='curl-zottman-un-bras-banc-scott|homme', mode='vert', v_min=0.45, rampe=(0.03, 0.32),
        sources=[dict(git='c685298', chemin=f'evolution/media/refonte-photo/propositions/lot64/phases/zottman-phase{i}.png',
                      local=f'48-phase{i}.png') for i in (1, 2, 3, 4)],
        phases=[dict(rois=[(150, 420, 420, 720)], seuil=0.10, fenetre=(0.0, 1.0)) for _ in range(4)],
        livre='gif/homme/curl-zottman-un-bras-banc-scott-homme.gif', ref_livre='3cbb3e5', echelle_livre=264 / 800,
        note='voile vert translucide de l’avant-bras préservé (la peau reste visible au travers)'),
    dict(
        numero=85, cle='elevations-laterales-coude-a-90|homme', mode='vert', v_min=0.30,
        sources=[dict(git='c685298', chemin='evolution/media/refonte-photo/propositions/lot68/phases/85-depart-2.png', local='85-depart-2.png'),
                 dict(git='c685298', chemin='evolution/media/refonte-photo/propositions/lot68/phases/85-fin-4.png', local='85-fin-4.png')],
        phases=[dict(rois=[(560, 170, 700, 290), (710, 170, 830, 290)], seuil=0.10, fenetre=(0.0, 1.0)),
                dict(rois=[(560, 170, 700, 290), (710, 170, 830, 290)], seuil=0.07, fenetre=(0.0, 1.0))],
        livre='gif/homme/elevations-laterales-coude-a-90-homme.gif', ref_livre='3cbb3e5', echelle_livre=440 / 768,
        note='deltoïdes rendus à leur clarté d’origine (l’ancien export les assombrissait)'),
]


# --- outils copiés à l'identique du prototype 44 validé --------------------------
def sha(p):
    return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()


def rgb_vers_hsv(a):
    mx = a.max(axis=1); mn = a.min(axis=1); d = mx - mn
    h = np.zeros(len(a)); nz = d > 1e-9
    idx = nz & (mx == a[:, 0]); h[idx] = ((a[idx, 1] - a[idx, 2]) / d[idx]) % 6
    idx = nz & (mx == a[:, 1]); h[idx] = (a[idx, 2] - a[idx, 0]) / d[idx] + 2
    idx = nz & (mx == a[:, 2]); h[idx] = (a[idx, 0] - a[idx, 1]) / d[idx] + 4
    h = (h / 6) % 1.0
    s = np.where(mx > 1e-9, d / np.maximum(mx, 1e-9), 0)
    return h, s, mx


def hsv_vers_rgb(h, s, v):
    i = np.floor(h * 6).astype(int) % 6
    f = h * 6 - np.floor(h * 6)
    p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s)
    out = np.zeros((len(h), 3))
    for k, (r_, g_, b_) in enumerate(((v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q))):
        m = i == k
        if m.any():
            out[m, 0], out[m, 1], out[m, 2] = r_[m], g_[m], b_[m]
    return out


def score_vert(a):
    """(G - max(R,B))/255 : le vert franc (44, 48, 85)."""
    return (a[..., 1] - np.maximum(a[..., 0], a[..., 2])) / 255.0


def score_olive(a):
    """Signature du panneau olive : B très bas et R≈G (sinon c'est du vert franc).

    Le critère est celui qui avait servi au lot68 (G-B, G-R), mais borné pour ne pas
    confondre le panneau du legging avec un vert franc : min(R,G) - B.
    """
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return np.where((g - r) < 40, (np.minimum(r, g) - b) / 255.0, 0.0)


def plus_grande_composante(m):
    h, w = m.shape
    vu = np.zeros_like(m, bool)
    meilleure = []
    for y0 in range(h):
        for x0 in np.nonzero(m[y0] & ~vu[y0])[0]:
            if vu[y0, x0]:
                continue
            q = deque([(y0, x0)]); vu[y0, x0] = True; pts = []
            while q:
                y, x = q.popleft(); pts.append((y, x))
                for yy in range(max(0, y - 1), min(h, y + 2)):
                    for xx in range(max(0, x - 1), min(w, x + 2)):
                        if m[yy, xx] and not vu[yy, xx]:
                            vu[yy, xx] = True; q.append((yy, xx))
            if len(pts) > len(meilleure):
                meilleure = pts
    out = np.zeros_like(m, bool)
    for y, x in meilleure:
        out[y, x] = True
    return out


def remplir_trous(m):
    h, w = m.shape
    dehors = np.zeros_like(m, bool)
    q = deque()
    for y, x in ([(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)] +
                 [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)]):
        if not m[y, x] and not dehors[y, x]:
            dehors[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= yy < h and 0 <= xx < w and not m[yy, xx] and not dehors[yy, xx]:
                dehors[yy, xx] = True; q.append((yy, xx))
    return m | ~dehors


def dilater(m, n):
    out = m.copy()
    for _ in range(n):
        p = np.zeros_like(out)
        p[1:, :] |= out[:-1, :]; p[:-1, :] |= out[1:, :]
        p[:, 1:] |= out[:, :-1]; p[:, :-1] |= out[:, 1:]
        out |= p
    return out


def eroder(m, n):
    return ~dilater(~m, n)


def percentiles(v, qs):
    return [float(np.percentile(v, q)) for q in qs]


def mapper_par_ancres(x, ancres_x, ancres_y):
    ax, ay = np.asarray(ancres_x, float), np.asarray(ancres_y, float)
    pente_bas = (ay[1] - ay[0]) / max(ax[1] - ax[0], 1e-6)
    pente_haut = (ay[2] - ay[1]) / max(ax[2] - ax[1], 1e-6)
    out = np.empty_like(x)
    bas = x <= ax[0]; haut = x >= ax[2]
    milieu = ~(bas | haut) & (x <= ax[1])
    out[bas] = ay[0] + (x[bas] - ax[0]) * pente_bas
    out[haut] = ay[2] + (x[haut] - ax[2]) * pente_haut
    out[milieu] = ay[0] + (x[milieu] - ax[0]) * pente_bas
    milieu_mid = ~(bas | haut) & ~milieu
    out[milieu_mid] = ay[1] + (x[milieu_mid] - ax[1]) * pente_haut
    return out


def statistiques_zone(rgb, masque):
    if not masque.any():
        return {'pixels': 0}
    px = rgb[masque] / 255.0
    h, s, v = rgb_vers_hsv(px)
    couleurs, comptes = np.unique(rgb[masque].reshape(-1, 3), axis=0, return_counts=True)
    ordre = np.argsort(-comptes)[:5]
    return {
        'pixels': int(masque.sum()),
        'mediane_rgb': [int(x) for x in np.median(rgb[masque], axis=0)],
        'mediane_hsv': {'teinte_deg': round(float(np.median(h)) * 360, 1),
                        'saturation': round(float(np.median(s)), 3),
                        'valeur': round(float(np.median(v)), 3)},
        'percentiles_saturation': [round(x, 3) for x in percentiles(s, [5, 50, 95])],
        'percentiles_valeur': [round(x, 3) for x in percentiles(v, [5, 50, 95])],
        'nuances_distinctes': int(len(couleurs)),
        'part_teinte_dominante': round(float(comptes[ordre[0]] / masque.sum()), 3),
        'teintes_principales': [[int(c) for c in couleurs[i]] for i in ordre],
    }


def decoder(cible):
    im = Image.open(cible)
    frames, durees = [], []
    for f in ImageSequence.Iterator(im):
        frames.append(f.convert('RGB'))
        durees.append(f.info.get('duration'))
    return frames, durees


def mesurer_export(cible, attendues, note):
    frames, durees = decoder(cible)
    phases = []
    for ref, png in zip(frames, attendues):
        a = np.asarray(ref).astype(float); b = np.asarray(png).astype(float)
        diff = np.abs(a - b).mean(axis=2)
        m = np.asarray(png).astype(float)
        diff_full = np.abs(a - b).mean(axis=2)
        mse = float((diff_full ** 2).mean())
        phases.append({
            'taille': [ref.width, ref.height],
            'couleurs_uniques': int(len(np.unique(np.asarray(ref).reshape(-1, 3), axis=0))),
            'erreur_moyenne': round(float(diff.mean()), 2),
            'erreur_max': int(diff.max()),
            'psnr_db': round(10 * np.log10(255.0 ** 2 / max(mse, 1e-9)), 2),
        })
    return {'fichier': str(cible.relative_to(ROOT)), 'note': note, 'sha256': sha(cible),
            'poids_ko': round(cible.stat().st_size / 1024), 'images': len(frames),
            'durees_ms': durees, 'taille': [frames[0].width, frames[0].height], 'phases': phases}


def extraire(git, chemin, cible):
    """Les sources natives vivent dans git (branches de travail), pas dans l'arbre courant."""
    if cible.exists():
        return cible
    cible.parent.mkdir(parents=True, exist_ok=True)
    blob = subprocess.run(['git', 'show', f'{git}:{chemin}'], cwd=ROOT,
                          capture_output=True, check=True).stdout
    cible.write_bytes(blob)
    return cible


def cadre(im, h):
    if im.height <= h:
        return im
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)


def exporter_gif_palette_partagee(cible, images):
    ref = images[0].quantize(colors=PALETTE_MAX, method=Image.MEDIANCUT, dither=Image.Dither.NONE)
    quant = [ref] + [im.quantize(palette=ref, dither=Image.Dither.NONE) for im in images[1:]]
    quant[0].save(cible, save_all=True, append_images=quant[1:], duration=DUREE,
                  loop=0, optimize=True, disposal=2)


def exporter_webp(cible, images, qualite):
    images[0].save(cible, save_all=True, append_images=images[1:], duration=DUREE, loop=0,
                   quality=qualite, method=6)


def main():
    TRAVAIL, EXP, PL = OUT / 'travail', OUT / 'exports', OUT / 'planches'
    for d in (TRAVAIL, EXP, PL):
        d.mkdir(parents=True, exist_ok=True)

    ref260 = Image.open(REF260).convert('RGB')
    a260 = np.asarray(ref260).astype(float)
    m260 = score_vert(a260) > 0.08
    ref_stats = statistiques_zone(np.asarray(ref260), m260)

    controles = {
        'date': '2026-09-30', 'lot': 1, 'numeros': [45, 48, 19, 85],
        'methode': 'identique au prototype n°44 validé du 30/09/2026',
        'decisions_utilisateur': {'format': 'webp animé', 'hauteur_px': HAUTEUR_EXPORT,
                                  'vert': 'famille du n°260', 'sources': 'natives, sans agrandissement'},
        'generation_images': 0, 'recoloration': 'oui, déterministe (aucun modèle)',
        'gif_livres_modifies': 0, 'apk_reconstruit': False, 'proposition_non_integree': True,
        'reference_260': ref_stats, 'numeros_detail': {},
    }

    # ---- 45 : même démonstration que le 44 validé, aucune recuisson -------------
    if SORTIE_44.exists() and SORTIE_44_GIF.exists():
        shutil.copyfile(SORTIE_44, EXP / '45-vert260-660-webp-q90.webp')
        shutil.copyfile(SORTIE_44_GIF, EXP / '45-vert260-660-repli.gif')
        controles['numeros_detail']['45'] = {
            'cle': 'curl-scott-haltere-prise-neutre|homme',
            'regle': 'même démonstration que le n°44 : les deux GIF livrés sont le même fichier '
                     '(sha256 4696c1435660b820f53adbdebbaf284531549677495fe53c85f8fc9f0e852427) ; '
                     'on reprend donc à l’identique la sortie validée du 44, sans recuisson.',
            'sorties': [str((EXP / '45-vert260-660-webp-q90.webp').relative_to(ROOT)),
                        str((EXP / '45-vert260-660-repli.gif').relative_to(ROOT))],
            'sha256': sha(EXP / '45-vert260-660-webp-q90.webp'),
        }

    for cible in CIBLES:
        n = cible['numero']
        detail = {'cle': cible['cle'], 'note': cible['note'], 'mode': cible['mode'],
                  'plancher_luminosite': cible.get('v_min', 0.0), 'rampe_alpha': list(cible.get('rampe', (ALPHA_BAS, ALPHA_HAUT))),
                  'sources': [], 'phases': [], 'exports': []}
        imgs_src, masques, silhouettes, alphas, avant, rois = [], [], [], [], [], []
        for i, ph in enumerate(cible['phases']):
            s = cible['sources'][0] if 'caisse' in ph else cible['sources'][i]
            chemin = extraire(s['git'], s['chemin'], SRC / s['local'])
            im = Image.open(chemin).convert('RGB')
            if 'caisse' in ph:
                im = im.crop(ph['caisse'])
            imgs_src.append(im)
            if not any(x['fichier'] == s['chemin'] for x in detail['sources']):
                detail['sources'].append({'fichier': s['chemin'], 'ref_git': s['git'],
                                          'local': str(chemin.relative_to(ROOT)),
                                          'taille': list(im.size), 'sha256': sha(chemin)})
            a = np.asarray(im).astype(float)
            sc = score_olive(a) if cible['mode'] == 'olive' else score_vert(a)
            m = np.zeros(sc.shape, bool)
            v_min = cible.get('v_min', 0.0) * 255.0
            lum = a.max(axis=2) >= v_min
            for (x0, y0, x1, y1) in ph['rois']:
                partiel = np.zeros(sc.shape, bool)
                partiel[y0:y1, x0:x1] = (sc[y0:y1, x0:x1] >= ph['seuil']) & lum[y0:y1, x0:x1]
                m |= plus_grande_composante(partiel)
            sil = dilater(remplir_trous(m), 2)
            ab, ah = cible.get('rampe', (ALPHA_BAS, ALPHA_HAUT))
            alpha = np.clip((sc - ab) / (ah - ab), 0, 1) * sil
            masques.append(m); silhouettes.append(sil); alphas.append(alpha)
            rois.append(ph['rois'][0])
            avant.append(statistiques_zone(np.asarray(im), m))
            detail['phases'].append({'rois_xy': [list(r) for r in ph['rois']], 'seuil': ph['seuil'],
                                     'pixels_zone': int(m.sum()), 'pixels_silhouette': int(sil.sum())})

        # --- correspondance de percentiles calculée sur TOUTES les phases du numéro ---
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

        # --- retouche : contour resserré + famille 260, à la résolution native -------
        travail, png_660, apres = [], [], []
        for i, im in enumerate(imgs_src):
            a = np.asarray(im).astype(float)
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
            plein = out.resize((round(out.width * HAUTEUR_EXPORT / out.height), HAUTEUR_EXPORT), Image.LANCZOS)
            x0f, wf = cible['phases'][i]['fenetre']
            x0 = round(plein.width * x0f); w = round(plein.width * wf)
            png_660.append(plein.crop((x0, 0, min(plein.width, x0 + w), HAUTEUR_EXPORT)))
        for i, im in enumerate(png_660):
            im.save(TRAVAIL / f'{n}-phase{i + 1}-vert260-{im.width}x{im.height}.png', optimize=True)

        detail['vert_avant'] = avant
        detail['vert_apres'] = apres
        detail['contour'] = []
        detail['garantie_hors_zone'] = []
        for i in range(len(imgs_src)):
            gn = (score_olive if cible['mode'] == 'olive' else score_vert)(np.asarray(imgs_src[i]).astype(float))
            travail_i = np.asarray(travail[i]).astype(float)
            perimetre = max(int((silhouettes[i] & ~eroder(silhouettes[i], 1)).sum()), 1)
            ab, ah = cible.get('rampe', (ALPHA_BAS, ALPHA_HAUT))
            partiel_avant = int(((gn > ab) & (gn < ah) & silhouettes[i]).sum())
            partiel_apres = int(((alphas[i] > 0.02) & (alphas[i] < 0.98)).sum())
            hors = alphas[i] <= 0.0
            detail['contour'].append({'phase': i + 1, 'perimetre_px': perimetre,
                                      'largeur_transition_avant_px': round(partiel_avant / perimetre, 2),
                                      'largeur_transition_apres_px': round(partiel_apres / perimetre, 2)})
            detail['garantie_hors_zone'].append({
                'phase': i + 1, 'pixels_hors_zone': int(hors.sum()),
                'pixels_modifies_hors_zone': int((np.abs(travail_i - np.asarray(imgs_src[i]).astype(float)).max(axis=2)[hors] > 0).sum())})

        # --- exports réels ----------------------------------------------------------
        cible_webp = EXP / f'{n}-vert260-660-webp-q90.webp'
        exporter_webp(cible_webp, png_660, 90)
        detail['exports'].append(dict(mesurer_export(cible_webp, png_660, 'WebP animé q90 — livrable principal'),
                                      format='webp', qualite=90, hauteur=HAUTEUR_EXPORT))
        cible_gif = EXP / f'{n}-vert260-660-repli.gif'
        exporter_gif_palette_partagee(cible_gif, png_660)
        detail['exports'].append(dict(mesurer_export(cible_gif, png_660, 'GIF de repli (palette 256 partagée)'),
                                      format='gif', qualite='palette 256', hauteur=HAUTEUR_EXPORT))
        detail['gif_livre_mesure'] = {}
        try:
            livre = extraire(cible['ref_livre'], 'evolution/media/refonte-photo/' + cible['livre'], SRC / f"livre-{n}.gif")
            lf, _ = decoder(livre)
            sc_l = score_olive if cible['mode'] == 'olive' else score_vert
            detail['gif_livre_mesure'] = {
                'fichier': cible['livre'], 'sha256': sha(livre), 'taille': [lf[0].width, lf[0].height],
                'poids_ko': round(livre.stat().st_size / 1024),
                'phases': [statistiques_zone(np.asarray(f).astype(float), sc_l(np.asarray(f).astype(float)) >= cible['phases'][min(i, len(cible['phases']) - 1)]['seuil'] * 0.6)
                           for i, f in enumerate(lf)]}
        except Exception as e:                                    # pragma: no cover
            detail['gif_livre_mesure'] = {'erreur': str(e)}

        # --- planches de preuve ------------------------------------------------------
        lignes = []
        for i, im in enumerate(png_660):
            lignes.append((f'PHASE {i + 1}', [cadre(im, 430)]))
        marge, entete = 12, 26
        larg = max(sum(x.width for x in ims) + marge * 4 for _, ims in lignes)
        haut = sum(max(x.height for x in ims) + entete + marge for _, ims in lignes) + 30
        feuille = Image.new('RGB', (larg, haut), 'white')
        d = ImageDraw.Draw(feuille)
        d.text((marge, 8), f'LOT 1 — N°{n} : export 660 px réellement DÉCODÉ (WebP q90 puis GIF de repli)',
               font=F(17), fill='#12242f')
        y = 30
        for nom, ims in lignes:
            d.text((marge, y), nom, font=F(14), fill='#5a6a75'); y += entete
            x = marge
            for im in ims:
                feuille.paste(im, (x, y)); x += im.width + marge
            y += max(i.height for i in ims) + marge
        feuille.save(PL / f'LOT1-{n}-export-decode.png')

        # avant / après à la résolution native de la source (zoom 100 % sur la zone)
        x0, y0, x1, y1 = rois[0]
        z = 2
        avant_v = imgs_src[0].crop((max(0, x0 - 40), max(0, y0 - 40), min(imgs_src[0].width, x1 + 40), min(imgs_src[0].height, y1 + 40)))
        apres_v = travail[0].crop(avant_v.getbbox() or (0, 0, 1, 1)) if False else travail[0].crop(
            (max(0, x0 - 40), max(0, y0 - 40), min(travail[0].width, x1 + 40), min(travail[0].height, y1 + 40)))
        ref_v = ref260.crop((60, 40, 180, 290)).resize((120, 250))
        tuiles = [('référence n°260', ref_v),
                  ('AVANT — source native', avant_v.resize((avant_v.width * z, avant_v.height * z), Image.LANCZOS)),
                  ('APRÈS — PNG de travail natif', apres_v.resize((apres_v.width * z, apres_v.height * z), Image.LANCZOS))]
        hv = max(t.height for _, t in tuiles) + 30
        fv = Image.new('RGB', (sum(t.width + 12 for _, t in tuiles) + 12, hv), 'white')
        dd = ImageDraw.Draw(fv); xx = 6
        for lab, t in tuiles:
            dd.text((xx, 6), lab, font=F(15), fill='#12242f'); fv.paste(t, (xx, 26)); xx += t.width + 12
        fv.save(PL / f'LOT1-{n}-avant-apres-natif.png')

        # à la taille réelle de l'application (300 px)
        taille_app = lambda f: f.resize((max(1, round(f.width * 300 / f.height)), 300), Image.LANCZOS)
        livre_app = taille_app(Image.open(extraire(cible['ref_livre'], 'evolution/media/refonte-photo/' + cible['livre'],
                                                   SRC / f'livre-{n}.gif')).convert('RGB'))
        prop_app = taille_app(png_660[0])
        fa = Image.new('RGB', (livre_app.width + prop_app.width + 36, 330), 'white')
        da = ImageDraw.Draw(fa)
        da.text((12, 8), f'N°{n} à la taille réelle de l’application (300 px de haut)', font=F(16), fill='#12242f')
        da.text((12, 30), 'GIF livré aujourd’hui', font=F(13), fill='#5a6a75')
        da.text((24 + livre_app.width, 30), 'proposition lot 1', font=F(13), fill='#5a6a75')
        fa.paste(livre_app, (12, 48)); fa.paste(prop_app, (24 + livre_app.width, 48))
        fa.save(PL / f'LOT1-{n}-taille-application.png')

        detail['planches'] = [str((PL / n).relative_to(ROOT)) for n in
                              (f'LOT1-{n}-export-decode.png', f'LOT1-{n}-avant-apres-natif.png',
                               f'LOT1-{n}-taille-application.png')]
        controles['numeros_detail'][str(n)] = detail
        print(f"n°{n} : zone {sum(int(m.sum()) for m in masques)} px, "
              f"avant {avant[0]['mediane_rgb']} (S {avant[0]['mediane_hsv']['saturation']}) "
              f"→ après {apres[0]['mediane_rgb']} (S {apres[0]['mediane_hsv']['saturation']})")
        for e in detail['exports']:
            print(f"   {e['format']:<5} {e['taille'][0]}x{e['taille'][1]} {e['poids_ko']:>5} ko "
                  f"err {e['phases'][0]['erreur_moyenne']} PSNR {e['phases'][0]['psnr_db']} dB")

    controles['livres_inchanges'] = [
        {'numero': 44, 'fichier': 'gif/homme/curl-scott-haltere-neutre-homme.gif',
         'sha256': '4696c1435660b820f53adbdebbaf284531549677495fe53c85f8fc9f0e852427'},
        {'numero': 45, 'fichier': 'gif/homme/curl-scott-haltere-prise-neutre-homme.gif',
         'sha256': '4696c1435660b820f53adbdebbaf284531549677495fe53c85f8fc9f0e852427'},
        {'numero': 48, 'fichier': 'gif/homme/curl-zottman-un-bras-banc-scott-homme.gif',
         'sha256': '41530fc75cfc38f69ec68dfc9f94601d21f8ff8f37a3af7f87381ab7c051a704', 'ref': '3cbb3e5'},
        {'numero': 85, 'fichier': 'gif/homme/elevations-laterales-coude-a-90-homme.gif',
         'sha256': '4a99ad5b2304de833f33bcf6580f581f4bb8fe36cc85964db5b09886fcc13fd4', 'ref': '3cbb3e5'},
        {'numero': 19, 'fichier': 'gif/femme/bulgarian-split-squat-halteres-femme.gif',
         'sha256': 'b1c1a1dfbc11cf588ca1c37066df3317406757f14895131f5b9a0760c5aa1f35', 'ref': '3cbb3e5'},
    ]
    (OUT / 'CONTROLES.json').write_text(json.dumps(controles, ensure_ascii=False, indent=1) + '\n')
    print('CONTROLES :', (OUT / 'CONTROLES.json').relative_to(ROOT))


if __name__ == '__main__':
    main()
