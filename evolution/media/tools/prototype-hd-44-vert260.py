#!/usr/bin/env python3
"""Prototype n°44 — vert rapproché du 260, export WebP animé 660 px.

Décisions utilisateur du 30/09/2026 : format WebP animé, hauteur 660 px, vert rapproché
du n°260. Ce script ne génère AUCUNE image (0 appel de modèle) : c'est un travail
déterministe sur les masters 800x1333 du geste validé (lot69, commit c685298).

Ce qu'il fait, dans l'ordre imposé (retouche AVANT export) :

 1. mesure le vert réel des masters : masque, cœur, halo de bordure, teinte/saturation/valeur ;
 2. resserre le contour (le halo fait 6-8 px : c'est ce qui donne l'effet « feuille collée »)
    tout en conservant la silhouette et la texture internes ;
 3. rapproche la famille de couleurs de la référence n°260 par correspondance de
    percentiles (p5/p50/p95) sur la saturation et la valeur, recentrage doux de la teinte :
    les pixels ne sont PAS uniformisés (chaque pixel garde sa propre nuance) ;
 4. n'écrit qu'après : PNG de travail à la résolution native, puis WebP animé 660 px
    (+ GIF 660 de repli, au cas où la WebView ne lirait pas le WebP) ;
 5. décode réellement chaque fichier exporté et le compare au PNG de travail.

    python3 evolution/media/tools/prototype-hd-44-vert260.py
"""
import hashlib
import json
import pathlib
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'
SRC = BASE / 'prototype-44/sources'
OUT = BASE / 'prototype-44-vert260'
TRAVAIL = OUT / 'travail'
EXP = OUT / 'exports'
PL = OUT / 'planches'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
F = lambda n: ImageFont.truetype(FONT, n)

HAUTEUR_EXPORT = 660          # décision utilisateur
DUREE = 500
# fenêtre identique au GIF livré (259x440 pris dans 264x440, x de 0 à 259) : le cadrage
# validé n'est ni recadré autrement, ni mis en miroir, ni tourné.
FENETRE_X_SOURCE = 259 / 264

SEUIL_MASQUE = 0.10           # greenness minimale pour appartenir à la zone verte
ALPHA_BAS, ALPHA_HAUT = 0.03, 0.17   # rampe resserrée (l'originale court jusqu'à ~0.26)


def sha(p):
    return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()


def rgb_vers_hsv(a):
    """HSV vectorisé (h en fraction de tour, s et v dans [0,1]) sur un tableau Nx3 float."""
    mx = a.max(axis=1)
    mn = a.min(axis=1)
    d = mx - mn
    h = np.zeros(len(a))
    nz = d > 1e-9
    idx = nz & (mx == a[:, 0])
    h[idx] = ((a[idx, 1] - a[idx, 2]) / d[idx]) % 6
    idx = nz & (mx == a[:, 1])
    h[idx] = (a[idx, 2] - a[idx, 0]) / d[idx] + 2
    idx = nz & (mx == a[:, 2])
    h[idx] = (a[idx, 0] - a[idx, 1]) / d[idx] + 4
    h = (h / 6) % 1.0
    s = np.where(mx > 1e-9, d / np.maximum(mx, 1e-9), 0)
    return h, s, mx


def hsv_vers_rgb(h, s, v):
    i = np.floor(h * 6).astype(int) % 6
    f = h * 6 - np.floor(h * 6)
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    out = np.zeros((len(h), 3))
    for k, (r_, g_, b_) in enumerate((
            (v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q))):
        m = i == k
        if m.any():
            out[m, 0], out[m, 1], out[m, 2] = r_[m], g_[m], b_[m]
    return out


def greenness(a):
    """À quel point le pixel tire vers le vert : (G - max(R,B)) / 255."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (g - np.maximum(r, b)) / 255.0


def plus_grande_composante(m):
    h, w = m.shape
    vu = np.zeros_like(m, bool)
    meilleure = None
    for y0 in range(h):
        ligne = np.nonzero(m[y0] & ~vu[y0])[0]
        for x0 in ligne:
            if vu[y0, x0]:
                continue
            q = deque([(y0, x0)])
            vu[y0, x0] = True
            pts = []
            while q:
                y, x = q.popleft()
                pts.append((y, x))
                for yy in (y - 1, y, y + 1):
                    for xx in (x - 1, x, x + 1):
                        if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not vu[yy, xx]:
                            vu[yy, xx] = True
                            q.append((yy, xx))
            if meilleure is None or len(pts) > len(meilleure):
                meilleure = pts
    out = np.zeros_like(m, bool)
    for y, x in meilleure or []:
        out[y, x] = True
    return out


def remplir_trous(m):
    """Comble les creux internes (les sillons du muscle ne doivent pas trouer la silhouette)."""
    h, w = m.shape
    dehors = np.zeros_like(m, bool)
    q = deque()
    for y, x in ([(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)] +
                 [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)]):
        if not m[y, x] and not dehors[y, x]:
            dehors[y, x] = True
            q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= yy < h and 0 <= xx < w and not m[yy, xx] and not dehors[yy, xx]:
                dehors[yy, xx] = True
                q.append((yy, xx))
    return m | ~dehors


def dilater(m, n):
    out = m.copy()
    for _ in range(n):
        p = np.zeros_like(out)
        p[1:, :] |= out[:-1, :]
        p[:-1, :] |= out[1:, :]
        p[:, 1:] |= out[:, :-1]
        p[:, :-1] |= out[:, 1:]
        out |= p
    return out


def eroder(m, n):
    return ~dilater(~m, n)


def percentiles(v, qs):
    return [float(np.percentile(v, q)) for q in qs]


def mapper_par_ancres(x, ancres_x, ancres_y):
    """Application monotone par morceaux : les ancres source vont sur les ancres cible."""
    ax, ay = np.asarray(ancres_x, float), np.asarray(ancres_y, float)
    pente_bas = (ay[1] - ay[0]) / max(ax[1] - ax[0], 1e-6)
    pente_haut = (ay[2] - ay[1]) / max(ax[2] - ax[1], 1e-6)
    out = np.empty_like(x)
    bas = x <= ax[0]
    haut = x >= ax[2]
    milieu = ~(bas | haut) & (x <= ax[1])
    out[bas] = ay[0] + (x[bas] - ax[0]) * pente_bas
    out[haut] = ay[2] + (x[haut] - ax[2]) * pente_haut
    milieu_mid = ~(bas | haut) & ~milieu
    out[milieu] = ay[0] + (x[milieu] - ax[0]) * pente_bas
    out[milieu_mid] = ay[1] + (x[milieu_mid] - ax[1]) * pente_haut
    return out


def statistiques_vert(rgb, masque):
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
        'teintes_principales': [[int(v2) for v2 in couleurs[i]] for i in ordre],
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
    for gif, png in zip(frames, attendues):
        a = np.asarray(gif).astype(float)
        b = np.asarray(png).astype(float)
        diff = np.abs(a - b).mean(axis=2)
        m = greenness(np.asarray(png)) > 0.10
        mse = float((diff ** 2).mean())
        phases.append({
            'phase': len(phases) + 1,
            'taille': [gif.width, gif.height],
            'couleurs_uniques': int(len(np.unique(np.asarray(gif).reshape(-1, 3), axis=0))),
            'erreur_hors_vert': round(float(diff[~m].mean()), 2),
            'erreur_dans_vert': round(float(diff[m].mean()), 2),
            'erreur_max': int(diff.max()),
            'psnr_db': round(10 * np.log10(255.0 ** 2 / max(mse, 1e-9)), 2),
        })
    return {'fichier': str(cible.relative_to(ROOT)), 'note': note, 'sha256': sha(cible),
            'poids_ko': round(cible.stat().st_size / 1024), 'images': len(frames),
            'durees_ms': durees, 'taille': [frames[0].width, frames[0].height], 'phases': phases}


def vignette_vert(im, x0, y0, x1, y1, facteur=2):
    c = im.crop((x0, y0, x1, y1))
    return c.resize((c.width * facteur, c.height * facteur), Image.LANCZOS)


def main():
    for d in (TRAVAIL, EXP, PL):
        d.mkdir(parents=True, exist_ok=True)

    masters = [Image.open(SRC / f'44-phase{i}-supinated-800x1333.png').convert('RGB') for i in (1, 2)]
    ref260 = Image.open(SRC / '260-reference-elliptique-fractionne-femme-373x440.gif').convert('RGB')

    controles = {
        'date': '2026-09-30', 'numero': 44, 'cle': 'curl-scott-haltere-neutre|homme',
        'decisions_utilisateur': {'format': 'webp animé', 'hauteur_px': HAUTEUR_EXPORT,
                                  'vert': 'rapproché du 260'},
        'generation_images': 0, 'recoloration': 'oui, déterministe (aucun modèle)',
        'gif_livres_modifies': 0, 'apk_reconstruit': False, 'proposition_non_integree': True,
        'sources': [{'fichier': str((SRC / f'44-phase{i}-supinated-800x1333.png').relative_to(ROOT)),
                     'taille': list(masters[i - 1].size),
                     'sha256': sha(SRC / f'44-phase{i}-supinated-800x1333.png')} for i in (1, 2)],
    }

    # --- 1. mesure du vert des masters (avant retouche) --------------------------
    avant = []
    masques, alphas, silhouettes = [], [], []
    for im in masters:
        a = np.asarray(im).astype(float)
        gn = greenness(a)
        m = gn >= SEUIL_MASQUE
        sil = dilater(remplir_trous(plus_grande_composante(m)), 2)
        alpha = np.clip((gn - ALPHA_BAS) / (ALPHA_HAUT - ALPHA_BAS), 0, 1) * sil
        masques.append(m)
        silhouettes.append(sil)
        alphas.append(alpha)
        avant.append(statistiques_vert(np.asarray(im), m))

    # --- 2. référence 260 ---------------------------------------------------------
    a260 = np.asarray(ref260).astype(float)
    m260 = greenness(a260) > 0.08
    ref_stats = statistiques_vert(np.asarray(ref260), m260)

    # --- 3. correspondance de percentiles, calculée sur les DEUX phases ----------
    # (les deux phases doivent partager la même famille de vert : aucun saut au changement d'image)
    px = np.concatenate([np.asarray(masters[i])[masques[i]] / 255.0 for i in (0, 1)])
    h0, s0, v0 = rgb_vers_hsv(px)
    ancres_s = percentiles(s0, [5, 50, 95])
    ancres_v = percentiles(v0, [5, 50, 95])
    cible_s = ref_stats['percentiles_saturation']
    cible_v = ref_stats['percentiles_valeur']
    teinte_src = float(np.median(h0)) * 360
    teinte_cible = ref_stats['mediane_hsv']['teinte_deg']
    controles['correspondance'] = {
        'ancres_master_saturation': [round(x, 3) for x in ancres_s],
        'cible_260_saturation': cible_s,
        'ancres_master_valeur': [round(x, 3) for x in ancres_v],
        'cible_260_valeur': cible_v,
        'teinte_master_deg': round(teinte_src, 1), 'teinte_260_deg': teinte_cible,
        'regle': 'percentiles appariés (p5/p50/p95) ; teinte recentrée à 50 % de l’écart ; '
                 'aucun pixel uniformisé',
    }

    # --- 4. retouche (contour resserré + famille 260) -----------------------------
    apres, png_660 = [], []
    for i, im in enumerate(masters):
        a = np.asarray(im).astype(float)
        alpha = alphas[i][..., None]
        h, s, v = rgb_vers_hsv(a.reshape(-1, 3) / 255.0)
        s2 = np.clip(mapper_par_ancres(s, ancres_s, cible_s), 0, 1)
        v2 = np.clip(mapper_par_ancres(v, ancres_v, cible_v), 0, 1)
        h2 = teinte_cible / 360 + (h - teinte_src / 360) * 0.5
        nouveau = hsv_vers_rgb(h2 % 1.0, s2, v2).reshape(a.shape) * 255.0
        melange = a * (1 - alpha) + nouveau * alpha
        out = Image.fromarray(np.clip(melange + 0.5, 0, 255).astype(np.uint8))
        out.save(TRAVAIL / f'44-phase{i + 1}-vert260-800x1333.png')
        apres.append(statistiques_vert(np.asarray(out), masques[i]))

        # export : même fenêtre que le GIF livré, hauteur 660
        plein = out.resize((round(out.width * HAUTEUR_EXPORT / out.height), HAUTEUR_EXPORT), Image.LANCZOS)
        largeur = round(plein.width * FENETRE_X_SOURCE)
        png_660.append(plein.crop((0, 0, largeur, HAUTEUR_EXPORT)))
    for i, im in enumerate(png_660):
        im.save(TRAVAIL / f'44-phase{i + 1}-vert260-{im.width}x{im.height}.png')

    controles['vert_avant'] = avant
    controles['vert_apres'] = apres
    controles['reference_260'] = ref_stats
    controles['contour'] = []
    controles['garantie_hors_zone'] = []
    for i in range(2):
        a = np.asarray(masters[i]).astype(float)
        gn = greenness(a)
        travail = np.asarray(Image.open(TRAVAIL / f'44-phase{i + 1}-vert260-800x1333.png')).astype(float)
        perimetre = max(int((silhouettes[i] & ~eroder(silhouettes[i], 1)).sum()), 1)
        # largeur de transition = épaisseur moyenne de la zone partiellement verte
        partiel_avant = int(((gn > 0.03) & (gn < 0.20) & silhouettes[i]).sum())
        partiel_apres = int(((alphas[i] > 0.02) & (alphas[i] < 0.98)).sum())
        hors = alphas[i] <= 0.0
        ecart_hors = float(np.abs(travail - a).max(axis=2)[hors].max())
        controles['contour'].append({
            'phase': i + 1,
            'coeur_avant_px': int((gn >= 0.20).sum()),
            'perimetre_px': perimetre,
            'largeur_transition_avant_px': round(partiel_avant / perimetre, 2),
            'largeur_transition_apres_px': round(partiel_apres / perimetre, 2),
            'rampe_alpha_utilisee': [ALPHA_BAS, ALPHA_HAUT],
        })
        controles['garantie_hors_zone'].append({
            'phase': i + 1,
            'pixels_hors_zone': int(hors.sum()),
            'ecart_max_hors_zone': ecart_hors,
            'pixels_modifies_hors_zone': int((np.abs(travail - a).max(axis=2)[hors] > 0).sum()),
        })

    # --- 5. exports réels ---------------------------------------------------------
    controles['exports'] = []
    attendues = png_660
    for q, nom in ((90, 'webp-q90'), (85, 'webp-q85'), (92, 'webp-q92')):
        cible = EXP / f'44-vert260-660-{nom}.webp'
        attendues[0].save(cible, save_all=True, append_images=attendues[1:], duration=DUREE,
                          loop=0, quality=q, method=6)
        controles['exports'].append(dict(mesurer_export(cible, attendues, f'WebP animé q{q}'),
                                         format='webp', qualite=q, hauteur=HAUTEUR_EXPORT))
    cible = EXP / '44-vert260-660-webp-sans-perte.webp'
    attendues[0].save(cible, save_all=True, append_images=attendues[1:], duration=DUREE,
                      loop=0, lossless=True, method=6)
    controles['exports'].append(dict(mesurer_export(cible, attendues, 'WebP animé sans perte'),
                                     format='webp', qualite='sans perte', hauteur=HAUTEUR_EXPORT))
    cible = EXP / '44-vert260-660-repli.gif'
    attendues[0].save(cible, save_all=True, append_images=attendues[1:], duration=DUREE,
                      loop=0, optimize=True, disposal=2)
    controles['exports'].append(dict(mesurer_export(cible, attendues, 'GIF de repli si la WebView refuse le WebP'),
                                     format='gif', qualite='palette 256', hauteur=HAUTEUR_EXPORT))

    # --- 6. planches --------------------------------------------------------------
    z1 = (219, 430, 350, 700)                      # zone verte phase 1 (coordonnées master)
    z2 = (210, 430, 340, 690)
    a1 = vignette_vert(masters[0], *z1)
    b1 = vignette_vert(Image.open(TRAVAIL / '44-phase1-vert260-800x1333.png'), *z1)
    a2 = vignette_vert(masters[1], *z2)
    b2 = vignette_vert(Image.open(TRAVAIL / '44-phase2-vert260-800x1333.png'), *z2)
    c260 = ref260.crop((60, 40, 180, 290))
    hmax = max(a1.height, b1.height)
    largeur = 12 + c260.width + 12 + a1.width + 12 + b1.width + 12
    feuille = Image.new('RGB', (largeur, hmax + 90), 'white')
    d = ImageDraw.Draw(feuille)
    d.text((12, 8), 'VERT RAPPROCHÉ DU 260 — phase 1 : référence · avant · après (PNG de travail 800x1333, zoom x2)',
           font=F(17), fill='#12242f')
    feuille.paste(c260.resize((c260.width, hmax)), (12, 44))
    feuille.paste(a1, (36 + c260.width, 44))
    feuille.paste(b1, (60 + c260.width + a1.width, 44))
    d.text((12, 22), 'référence n°260 (crop) — avant (master) — après (muqueuse : contour resserré, famille 260)',
           font=F(13), fill='#5a6a75')
    feuille.save(PL / 'VERT260-phase1-avant-apres.png')

    feuille = Image.new('RGB', (12 + a2.width + 12 + b2.width + 12, hmax + 60), 'white')
    d = ImageDraw.Draw(feuille)
    d.text((12, 8), 'VERT RAPPROCHÉ DU 260 — phase 2 : avant / après (PNG de travail, zoom x2)',
           font=F(17), fill='#12242f')
    feuille.paste(a2, (12, 40))
    feuille.paste(b2, (24 + a2.width, 40))
    feuille.save(PL / 'VERT260-phase2-avant-apres.png')

    # PNG de travail vs WebP réellement décodé
    def ligne(nom, frames):
        f0 = frames[0]
        zone = (max(0, f0.width // 2 - 70), int(f0.height * 0.28),
                min(f0.width, f0.width // 2 + 70), int(f0.height * 0.28) + 140)
        zoom = f0.crop(zone)
        return (nom, [f0, zoom.resize((zoom.width * 2, zoom.height * 2), Image.LANCZOS)])

    webp90 = decoder(EXP / '44-vert260-660-webp-q90.webp')[0]
    gif660 = decoder(EXP / '44-vert260-660-repli.gif')[0]
    png660 = [Image.open(TRAVAIL / f'44-phase{i}-vert260-{png_660[0].width}x{HAUTEUR_EXPORT}.png').convert('RGB')
              for i in (1, 2)]
    lignes = [ligne('PNG de travail 660 (sans perte)', png660),
              ligne('WEBP animé q90 — fichier DÉCODÉ', webp90),
              ligne('GIF de repli — fichier DÉCODÉ', gif660)]
    marge, entete, ht = 12, 26, 34
    larg = max(sum(i.width for i in imgs) + marge * 4 for _, imgs in lignes)
    hmax2 = max(im.height for _, imgs in lignes for im in imgs)
    feuille = Image.new('RGB', (larg, ht + len(lignes) * (hmax2 + entete + marge) + marge), 'white')
    d = ImageDraw.Draw(feuille)
    d.text((marge, 8), 'PROTOTYPE n°44 VERT 260 — PNG de travail vs fichiers réellement décodés (zoom 100 %)',
           font=F(18), fill='#12242f')
    y = ht + marge
    for nom, imgs in lignes:
        d.text((marge, y), nom, font=F(15), fill='#12242f')
        y += entete
        x = marge
        for im in imgs:
            feuille.paste(im, (x, y + (hmax2 - im.height) // 2))
            x += im.width + marge
        y += hmax2 + marge
    feuille.save(PL / 'VERT260-png-vs-decode.png')

    # vue à la taille d'affichage réelle (300 px de haut, comme .movement-visual)
    def a_taille_app(f):
        return f.resize((max(1, round(f.width * 300 / f.height)), 300), Image.LANCZOS)
    livre = Image.open(SRC / '44-livre-actuel-259x440.gif').convert('RGB')
    avant660 = Image.open(TRAVAIL / f'44-phase1-vert260-{png_660[0].width}x{HAUTEUR_EXPORT}.png').convert('RGB')
    ligne_app = [('LIVRÉ aujourd’hui (GIF 259)', a_taille_app(livre)),
                 ('PROTOTYPE WebP 660 — à l’échelle de l’écran', a_taille_app(webp90[0]))]
    marge = 12
    larg = sum(im.width for _, im in ligne_app) + marge * 3
    haut = max(im.height for _, im in ligne_app) + 60
    feuille = Image.new('RGB', (larg, haut), 'white')
    d = ImageDraw.Draw(feuille)
    d.text((marge, 8), 'À LA TAILLE RÉELLE DE L’APPLICATION (300 px de haut) — avant / après le prototype',
           font=F(17), fill='#12242f')
    x = marge
    for nom, im in ligne_app:
        d.text((x, 30), nom, font=F(13), fill='#5a6a75')
        feuille.paste(im, (x, 48))
        x += im.width + marge
    feuille.save(PL / 'VERT260-taille-application.png')

    controles['planches'] = [str((PL / n).relative_to(ROOT)) for n in (
        'VERT260-taille-application.png',
        'VERT260-phase1-avant-apres.png', 'VERT260-phase2-avant-apres.png', 'VERT260-png-vs-decode.png')]
    controles['livres_inchanges'] = [
        {'fichier': 'gif/homme/curl-scott-haltere-neutre-homme.gif',
         'sha256': '4696c1435660b820f53adbdebbaf284531549677495fe53c85f8fc9f0e852427'},
        {'fichier': 'gif/homme/curl-scott-haltere-prise-neutre-homme.gif',
         'sha256': '4696c1435660b820f53adbdebbaf284531549677495fe53c85f8fc9f0e852427'},
    ]
    (OUT / 'CONTROLES.json').write_text(json.dumps(controles, ensure_ascii=False, indent=1) + '\n')

    print('vert avant (master) :', [(v['mediane_rgb'], v['mediane_hsv']['saturation']) for v in avant])
    print('vert après (travail):', [(v['mediane_rgb'], v['mediane_hsv']['saturation']) for v in apres])
    print('référence 260      :', ref_stats['mediane_rgb'], ref_stats['mediane_hsv']['saturation'])
    for e in controles['exports']:
        p = e['phases'][0]
        print(f"  {e['format']:<5} {str(e['qualite']):<11} {e['taille'][0]}x{e['taille'][1]}  "
              f"{e['poids_ko']:>5} ko  err hors vert {p['erreur_hors_vert']:>5}  "
              f"dans vert {p['erreur_dans_vert']:>5}  PSNR {p['psnr_db']:>6} dB")
    print('planches :', controles['planches'])


if __name__ == '__main__':
    main()
