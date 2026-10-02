#!/usr/bin/env python3
"""Lot 4 (n degre 131, 133, 114, 23) — meme methode que les lots 2 et 3 valides le 02/10/2026.

Aucune innovation de methode : memes fonctions deterministes que le lot 1 / lot 2, memes
reglages (WebP anime 660 q90, vert ramene dans la famille du n degre 260, rampe alpha
0,03-0,17, percentiles p5/p50/p95, teinte recentree de moitie, aucun pixel uniformise).

Deux differences, purement techniques :

 1. Chaque phase declare une CAISSE (fenetre en pixels natifs) au lieu d'un numero de
    case : la caisse = la fenetre trouvee par recalage sur le GIF livre
    (evolution/media/tools/priorite-sources.py). Le cadrage de l'export est donc
    exactement celui du GIF livre, mesure, sans aucune approximation.
    Les quatre numeros de ce lot viennent de planches 1376x768 (deux cases).

 2. Les ROI ne sont pas posees a la main : elles sont DERIVEES de la tache verte mesuree
    dans le GIF livre (bbox en coordonnees GIF, consignee dans PRIORITE-SOURCES.json),
    convertie en pixels natifs puis elargie de 100 % de sa taille. Traceable, rejouable :
    chaque ROI se relit dans CONTROLES.json avec la bbox d'origine.

ATTENTE DE VERIFICATION : je n'ai pas de vision dans cette session ; le tri automatique
 muscle/decor a echoue (voir
hd-2026-09-30/PRIORITE-SOURCES-TRI.md). Ces quatre numeros ont ete choisis par l'utilisateur
sur la page de tri visuel. La validation finale du lot reste son verdict, numero par numero.

Les numeros 131 (leg curl allonge) et 133 (leg curl allonge, pieds flechis) sont deux
variantes du meme geste : sources et GIF livres differents, mais memes zones attendues
(ischio-jambiers). A regarder comme une paire.

    python3 evolution/media/tools/retouche-lot3-vert260.py
"""
import hashlib
import importlib.util
import json
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]


def _charger(nom, fichier):
    spec = importlib.util.spec_from_file_location(nom, ROOT / 'evolution/media/tools' / fichier)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


L1 = _charger('lot1', 'retouche-lot1-vert260.py')
L2 = _charger('lot2', 'retouche-lot2-vert260.py')

BASE = L1.BASE
LOT = 15
OUT = BASE / f'lot{LOT}'
SRC = ROOT / f'.cache/lot{LOT}/src'
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
composantes = L2.composantes
ALPHA_BAS, ALPHA_HAUT = L1.ALPHA_BAS, L1.ALPHA_HAUT

# --------------------------------------------------------------------------------------
# Ce que le lot a de mesure : caisse (fenetre native recalee sur le GIF livre) + bbox de la
# tache verte telle qu'elle apparait dans le GIF livre (coordonnees GIF, 440 px de haut).
# Provenance : hd-2026-09-30/PRIORITE-SOURCES.json, recalage par priorite-sources.py.
# --------------------------------------------------------------------------------------
# --- CIBLES (début) ---
CIBLES = [
    dict(numero=273, cle='flexion-avant-jambes-tendues|homme',
         planche='planches/lot04/flexion-avant-jambes-tendues.png', ref_source='c685298',
         livre='gif/homme/flexion-avant-jambes-tendues-homme.gif', ref_livre='base/lots-complets',
         note='flexion avant jambes tendues ; erreur d’alignement 5.77/255, perte x3.05',
         phases=[dict(caisse=(14, 0, 690, 768), vert_gif=(149, 342, 310, 385), seuil=0.10, mini=200),
                 dict(caisse=(692, 0, 1368, 768), vert_gif=(136, 344, 311, 393), seuil=0.10, mini=200)]),
    dict(numero=1, cle='ab-wheel-roulette|homme',
         planche='planches/lot34/ab-wheel-roulette.png', ref_source='c685298',
         livre='gif/homme/ab-wheel-roulette-homme.gif', ref_livre='base/lots-complets',
         note='ab wheel roulette ; erreur d’alignement 6.01/255, perte x3.05',
         phases=[dict(caisse=(0, 0, 684, 768), vert_gif=(30, 210, 75, 244), seuil=0.10, mini=200),
                 dict(caisse=(692, 0, 1376, 768), vert_gif=(42, 208, 78, 240), seuil=0.10, mini=200)]),
    dict(numero=325, cle='talon-vers-la-fesse-debout|homme',
         planche='planches/lot06/talon-vers-la-fesse-debout.png', ref_source='c685298',
         livre='gif/homme/talon-vers-la-fesse-debout-homme.gif', ref_livre='base/lots-complets',
         note='talon vers la fesse debout ; erreur d’alignement 6.15/255, perte x3.05',
         phases=[dict(caisse=(0, 0, 611, 768), vert_gif=(177, 237, 210, 300), seuil=0.10, mini=200),
                 dict(caisse=(670, 0, 1281, 768), vert_gif=(203, 245, 228, 308), seuil=0.10, mini=200)]),
    dict(numero=66, cle='developpe-halteres-incline-pronation|homme',
         planche='planches/lot38/developpe-halteres-incline-pronation.png', ref_source='c685298',
         livre='gif/homme/developpe-halteres-incline-pronation-homme.gif', ref_livre='base/lots-complets',
         note='developpe halteres incline pronation ; erreur d’alignement 6.26/255, perte x3.05',
         phases=[dict(caisse=(0, 0, 684, 768), vert_gif=(47, 220, 77, 249), seuil=0.10, mini=200),
                 dict(caisse=(692, 0, 1376, 768), vert_gif=(29, 192, 75, 252), seuil=0.10, mini=200)]),
]
# --- CIBLES (fin) ---

ELARGISSEMENT = (1.0, 1.0)   # on ajoute 100 % de la largeur et 100 % de la hauteur autour de la bbox


# --- Consigne du 02/10/2026 : le vert doit COUVRIR la peau, sans DEPASSER -----------------
# Le vert du GIF livre, ramene en resolution native, sert de verite de terrain :
#   couverture  = part de ce vert attendu que notre retouche recouvre  (trous si trop bas)
#   debordement = part de notre vert posee LA OU LE GIF LIVRE N'EN AVAIT PAS (decor si haut)
# Sous SEUIL_COUVERTURE, on baisse le seuil de detection du vert natif pour boucher les trous,
# en refusant tout essai qui agrandirait le debordement au-dela de SEUIL_DEBORDEMENT.
SEUIL_COUVERTURE = 0.85
# Consigne de l'utilisateur du 02/10/2026, apres avoir vu les chiffres du lot 13 :
# rester sur le COEUR VERT FRANC, comme les 49 numeros deja valides. Le halo degrade du
# muscle reste tel quel. Les mesures restent calculees et consignees, mais n'agissent plus.
ETENDRE_VERT = False

# Numeros ou l'utilisateur a demande que le vert COUVRE AUSSI LA PEAU que le GIF livre
# peignait en vert (demande du 02/10/2026 : n°66 ou le manque atteignait 33 %, puis n°1 a 23 %).
# Le vert ne s'ajoute que la ou le GIF livre en mettait : jamais ailleurs.
COUVRIR_PEAU = {1: True, 66: True}
SEUIL_DEBORDEMENT = 0.12   # au-dela, le vert deborde franchement hors de ce que le GIF livre couvrait


def masque_vert_gif(frame, caisse):
    """Masque vert du GIF livre, ramene a la taille exacte de la caisse native."""
    x0, y0, x1, y1 = caisse
    a = np.asarray(frame.convert('RGB')).astype(float)
    m = composantes(score_vert(a) > 0.08, 30)
    up = Image.fromarray((m * 255).astype(np.uint8)).resize((x1 - x0, y1 - y0), Image.NEAREST)
    return np.asarray(up) > 127


def etendre_sur_vert(m, sc, seuil_bas, portee=6):
    """Etend le masque de proche en proche, uniquement sur les pixels deja verts.

    Le muscle n'est pas uniforme : ses bords et ses zones d'ombre sont verts, mais trop
    peu pour franchir le seuil. Plutot que de baisser le seuil partout (ce qui peindrait
    aussi le decor, souvent verdatre lui aussi), on part du vert franc et on gagne du
    terrain par pas de 2 px en n'acceptant que les pixels dont le score reste vert.
    Un decor ELOIGNE n'est donc jamais atteint : la progression est locale.
    """
    grow = m.copy()
    candidat = sc >= seuil_bas
    for _ in range(portee):
        pas = dilater(grow, 2) & candidat & ~grow
        if not pas.any():
            break
        grow |= pas
    return grow


def couverture_et_debordement(sil, attendu, native=None):
    """(couverture, debordement, composition du vert manquant).

    `native` = pixels natifs (H, W, 3) : sert a dire SUR QUOI tombe le vert que nous ne
    mettons pas alors que le GIF livre, lui, etait vert a cet endroit. Decompose en :
      manque_peau       -> rouge > vert > bleu : c'est le muscle, le vert doit y aller
      manque_vert_pale  -> deja vert, mais trop discret pour franchir le seuil
      manque_autre      -> decor, fond, vetement : le vert n'a rien a y faire
    """
    if not sil.any() or not attendu.any():
        return 0.0, 0.0, {}
    couv = float((sil & attendu).sum()) / float(attendu.sum())
    deb = float((sil & ~dilater(attendu, 3)).sum()) / float(sil.sum())
    compo = {}
    if native is not None:
        manque = attendu & ~sil
        tot = float(attendu.sum())
        r, g, b = native[..., 0], native[..., 1], native[..., 2]
        peau = manque & (r > g) & (g > b) & ((r - b) > 12)
        pale = manque & ~peau & (score_vert(native) > 0.02)
        compo = {'manque_peau': round(float(peau.sum()) / tot, 3),
                 'manque_vert_pale': round(float(pale.sum()) / tot, 3),
                 'manque_autre': round(float((manque & ~peau & ~pale).sum()) / tot, 3)}
    return couv, deb, compo


def roi_depuis_bbox_gif(bbox_gif, caisse, gif_taille):
    """Convertit la bbox mesurée dans le GIF livré en ROI dans la caisse native, élargie."""
    gx0, gy0, gx1, gy1 = bbox_gif
    x0, y0, x1, y1 = caisse
    sx = (x1 - x0) / gif_taille[0]
    sy = (y1 - y0) / gif_taille[1]
    cx0 = x0 + gx0 * sx
    cx1 = x0 + gx1 * sx
    cy0 = y0 + gy0 * sy
    cy1 = y0 + gy1 * sy
    px = (cx1 - cx0) * ELARGISSEMENT[0]
    py = (cy1 - cy0) * ELARGISSEMENT[1]
    return (int(max(x0, round(cx0 - px))), int(max(y0, round(cy0 - py))),
            int(min(x1, round(cx1 + px))), int(min(y1, round(cy1 + py))))


def main():
    TRAVAIL, EXP, PL = OUT / 'travail', OUT / 'exports', OUT / 'planches'
    for d in (TRAVAIL, EXP, PL):
        d.mkdir(parents=True, exist_ok=True)

    ref260 = Image.open(L1.REF260).convert('RGB')
    a260 = np.asarray(ref260).astype(float)
    ref_stats = statistiques_zone(np.asarray(ref260), score_vert(a260) > 0.08)

    controles = {
        'date': '2026-10-02', 'lot': LOT, 'numeros': [c['numero'] for c in CIBLES],
        'methode': 'identique au prototype n°44, au lot 1 et au lot 2 validés',
        'decisions_utilisateur': {'format': 'webp animé', 'hauteur_px': HAUTEUR_EXPORT,
                                  'vert': 'famille du n°260', 'sources': 'natives, sans agrandissement'},
        'generation_images': 0, 'recoloration': 'oui, déterministe (aucun modèle)',
        'gif_livres_modifies': 0, 'apk_reconstruit': False, 'proposition_non_integree': True,
        'roi': 'dérivées de la tache verte mesurée dans le GIF livré (bbox consignée, élargie de 100 %)',
        'reference_260': ref_stats, 'numeros_detail': {},
    }

    for cible in CIBLES:
        n = cible['numero']
        detail = {'cle': cible['cle'], 'note': cible['note'], 'sources': [], 'phases': [],
                  'rampe_alpha': [ALPHA_BAS, ALPHA_HAUT], 'exports': []}
        chemin = extraire(cible['ref_source'], f"evolution/media/refonte-photo/{cible['planche']}",
                          SRC / f"{n}-planche.png")
        board = Image.open(chemin).convert('RGB')
        detail['sources'].append({'fichier': cible['planche'], 'ref_git': cible['ref_source'],
                                  'taille': list(board.size), 'sha256': sha(chemin)})

        gif_taille = None
        livre = extraire(cible['ref_livre'], f"evolution/media/refonte-photo/{cible['livre']}",
                         SRC / f"{n}-livre.gif")
        lf, _ = decoder(livre)
        gif_taille = (lf[0].width, lf[0].height)

        imgs_src, masques, silhouettes, alphas, avant = [], [], [], [], []
        couvertures, debordements = [], []
        for i, ph in enumerate(cible['phases']):
            caisse = ph['caisse']
            case = board.crop(caisse)
            imgs_src.append(case)
            a = np.asarray(case).astype(float)
            sc = score_vert(a)
            roi = roi_depuis_bbox_gif(ph['vert_gif'], caisse, gif_taille)
            bx0, by0, bx1, by1 = roi
            rx0, ry0 = bx0 - caisse[0], by0 - caisse[1]
            rx1, ry1 = bx1 - caisse[0], by1 - caisse[1]

            def masque_pour(seuil):
                partiel = np.zeros(sc.shape, bool)
                partiel[ry0:ry1, rx0:rx1] = sc[ry0:ry1, rx0:rx1] >= seuil
                return np.zeros(sc.shape, bool) | composantes(partiel, ph['mini'])

            # la peau que le vert doit couvrir, et le perimetre qu'il ne doit pas depasser
            attendu = masque_vert_gif(lf[i], caisse)

            m = masque_pour(ph['seuil'])
            if n in COUVRIR_PEAU:
                rr, gg, bb = a[..., 0], a[..., 1], a[..., 2]
                m = m | (attendu & ~m & (rr > gg) & (gg > bb) & ((rr - bb) > 12))
            sil = dilater(remplir_trous(m), 2)
            couv, deb, compo = couverture_et_debordement(sil, attendu, a)
            seuil_eff = ph['seuil']
            if ETENDRE_VERT and couv < SEUIL_COUVERTURE:
                # Le halo vert du muscle est large : on s'y etend de proche en proche, en
                # gardant la meilleure couverture qui ne depasse pas SEUIL_DEBORDEMENT.
                meilleur = (couv, deb, m, sil, ph['seuil'])
                for essai in (0.05, 0.02):
                    for portee in (8, 20, 40):
                        m2 = etendre_sur_vert(m, sc, essai, portee)
                        sil2 = dilater(remplir_trous(m2), 2)
                        c2, d2, _ = couverture_et_debordement(sil2, attendu)
                        if d2 <= SEUIL_DEBORDEMENT and (c2, -d2) > (meilleur[0], -meilleur[1]):
                            meilleur = (c2, d2, m2, sil2, f'etendu {essai}/{portee}')
                couv, deb, m, sil, seuil_eff = meilleur
                compo = couverture_et_debordement(sil, attendu, a)[2]
            couvertures.append(couv); debordements.append(deb)
            alpha = np.clip((sc - ALPHA_BAS) / (ALPHA_HAUT - ALPHA_BAS), 0, 1) * sil
            masques.append(m); silhouettes.append(sil); alphas.append(alpha)
            avant.append(statistiques_zone(np.asarray(case), m))
            detail['phases'].append({'caisse_native': list(caisse),
                                     'bbox_vert_gif_livre': list(ph['vert_gif']),
                                     'roi_native': [roi[0], roi[1], roi[2], roi[3]],
                                     'seuil': ph['seuil'], 'seuil_effectif': seuil_eff,
                                     'mini_tache': ph['mini'],
                                     'pixels_zone': int(m.sum()),
                                     'pixels_silhouette': int(sil.sum()),
                                     'couverture_peau': round(couv, 3),
                                     'debordement_vert': round(deb, 3),
                                     'manque': compo})

        if not any(m.any() for m in masques):
            print(f"n°{n} : AUCUNE zone verte trouvée — numéro abandonné, rien d'écrit")
            continue

        px = np.concatenate([np.asarray(imgs_src[i])[masques[i]] / 255.0
                             for i in range(len(imgs_src)) if masques[i].any()])
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

        manque_peau = max(pf.get('manque', {}).get('manque_peau', 0) for pf in detail['phases'])
        print(f"   couverture {min(couvertures):.2f} a {max(couvertures):.2f}"
              f" | debordement {max(debordements):.2f} | MANQUE sur peau {manque_peau:.2f}"
              f" | seuil {'abaisse' if any(p['seuil_effectif'] != p['seuil'] for p in detail['phases']) else 'nominal'}")
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
            # la caisse EST la fenêtre du GIF livré : l'export 660 reprend tout, sans recadrage
            plein = out.resize((round(out.width * HAUTEUR_EXPORT / out.height), HAUTEUR_EXPORT),
                               Image.LANCZOS)
            png_660.append(plein)
            plein.save(TRAVAIL / f'{n}-phase{i + 1}-vert260-{plein.width}x{plein.height}.png', optimize=True)

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
                'pixels_modifies_hors_zone': int(
                    (np.abs(travail_i - np.asarray(imgs_src[i]).astype(float)).max(axis=2)[hors] > 0).sum())})

        cible_webp = EXP / f'{n}-vert260-660-webp-q90.webp'
        exporter_webp(cible_webp, png_660, 90)
        detail['exports'].append(dict(mesurer_export(cible_webp, png_660, 'WebP animé q90 — livrable principal'),
                                      format='webp', qualite=90, hauteur=HAUTEUR_EXPORT))
        cible_gif = EXP / f'{n}-vert260-660-repli.gif'
        exporter_gif_palette_partagee(cible_gif, png_660)
        detail['exports'].append(dict(mesurer_export(cible_gif, png_660, 'GIF de repli (palette 256 partagée)'),
                                      format='gif', qualite='palette 256', hauteur=HAUTEUR_EXPORT))

        detail['gif_livre_mesure'] = {
            'fichier': cible['livre'], 'sha256': sha(livre), 'taille': [lf[0].width, lf[0].height],
            'images': len(lf), 'poids_ko': round(livre.stat().st_size / 1024),
            'phases': [statistiques_zone(np.asarray(f).astype(float),
                                         score_vert(np.asarray(f).astype(float)) >= 0.10) for f in lf]}

        # --- planches de preuve --------------------------------------------------------
        lignes = [(f'PHASE {i + 1}', [cadre(im, 430)]) for i, im in enumerate(png_660)]
        marge, entete = 12, 26
        larg = max(sum(x.width for x in ims) + marge * 4 for _, ims in lignes)
        haut = sum(max(x.height for x in ims) + entete + marge for _, ims in lignes) + 30
        feuille = Image.new('RGB', (larg, haut), 'white')
        d = ImageDraw.Draw(feuille)
        d.text((marge, 8), f'LOT {LOT} — N°{n} : export 660 px réellement DÉCODÉ (WebP q90 puis GIF de repli)',
               font=F(17), fill='#12242f')
        y = 30
        for nom, ims in lignes:
            d.text((marge, y), nom, font=F(14), fill='#5a6a75'); y += entete
            x = marge
            for im in ims:
                feuille.paste(im, (x, y)); x += im.width + marge
            y += max(i.height for i in ims) + marge
        feuille.save(PL / f'LOT{LOT}-{n}-export-decode.png')

        roi = detail['phases'][0]['roi_native']
        c0 = cible['phases'][0]['caisse']
        boite = (max(c0[0], roi[0] - 20), max(c0[1], roi[1] - 20),
                 min(c0[2], roi[2] + 20), min(c0[3], roi[3] + 20))
        av = imgs_src[0].crop((boite[0] - c0[0], boite[1] - c0[1], boite[2] - c0[0], boite[3] - c0[1]))
        ap = travail[0].crop((boite[0] - c0[0], boite[1] - c0[1], boite[2] - c0[0], boite[3] - c0[1]))
        z = 2 if av.width * 2 <= 900 else 1
        tuiles = [('référence n°260', ref260.crop((60, 40, 180, 290)).resize((120, 250))),
                  ('AVANT — source native', av.resize((av.width * z, av.height * z), Image.LANCZOS)),
                  ('APRÈS — PNG de travail natif', ap.resize((ap.width * z, ap.height * z), Image.LANCZOS))]
        hv = max(t.height for _, t in tuiles) + 30
        fv = Image.new('RGB', (sum(t.width + 12 for _, t in tuiles) + 12, hv), 'white')
        dd = ImageDraw.Draw(fv); xx = 6
        for lab, t in tuiles:
            dd.text((xx, 6), lab, font=F(15), fill='#12242f'); fv.paste(t, (xx, 26)); xx += t.width + 12
        fv.save(PL / f'LOT{LOT}-{n}-avant-apres-natif.png')

        taille_app = lambda f: f.resize((max(1, round(f.width * 300 / f.height)), 300), Image.LANCZOS)
        livre_app = taille_app(lf[0].convert('RGB'))
        prop_app = taille_app(png_660[0])
        fa = Image.new('RGB', (livre_app.width + prop_app.width + 36, 330), 'white')
        da = ImageDraw.Draw(fa)
        da.text((12, 8), f'N°{n} à la taille réelle de l’application (300 px de haut)', font=F(16), fill='#12242f')
        da.text((12, 30), 'GIF livré aujourd’hui', font=F(13), fill='#5a6a75')
        da.text((24 + livre_app.width, 30), f'proposition lot {LOT}', font=F(13), fill='#5a6a75')
        fa.paste(livre_app, (12, 48)); fa.paste(prop_app, (24 + livre_app.width, 48))
        fa.save(PL / f'LOT{LOT}-{n}-taille-application.png')

        detail['planches'] = [f'lot{LOT}/planches/LOT{LOT}-{n}-{s}.png' for s in
                              ('export-decode', 'avant-apres-natif', 'taille-application')]
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
