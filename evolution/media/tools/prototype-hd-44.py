#!/usr/bin/env python3
"""Prototype HD n°44 — mesurer ce que chaque EXPORT change vraiment (GIF/WebP/APNG).

La série style389 est suspendue pour cause de pixellisation. Avant toute reprise, ce
script établit des faits mesurés sur le n°44 (geste validé) et ne modifie AUCUN GIF livré :

  * définition réellement livrée aujourd'hui (259x440) vs taille d'affichage de
    l'application (.movement-visual { height: 300px }) -> agrandissement subi ;
  * ce que le maître disponible contient réellement (détail au-delà de la grille 440) ;
  * poids / erreur / PSNR de chaque réglage d'export, à définition égale puis croissante ;
  * tramage et palettes : la limite GIF de 256 couleurs vaut-elle la peine d'être payée ;
  * formats alternatifs (WebP animé, APNG) en poids et en fidélité — POUR COMPARAISON
    SEULEMENT : aucun changement de format sans accord utilisateur ni test WebView.

Entrées (copies de travail, jamais modifiées) :
  sources/44-phase1-supinated-800x1333.png   geste n°44 validé (lot69, commit c685298)
  sources/44-phase2-supinated-800x1333.png
  sources/44-livre-actuel-259x440.gif        GIF livré aujourd'hui (témoin)
  sources/260-reference-elliptique-fractionne-femme-373x440.gif  référence de teinte 260

Sorties : exports/, planches/, CONTROLES.json

    python3 evolution/media/tools/prototype-hd-44.py
"""
import hashlib
import json
import pathlib

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageSequence

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30/prototype-44'
SRC = OUT / 'sources'
EXP = OUT / 'exports'
PL = OUT / 'planches'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
F = lambda n: ImageFont.truetype(FONT, n)
DUREE = 500
AFFICHAGE_CSS = 300          # .movement-visual { height: 300px } dans styles.css
PALETTE_MAX = 256            # limite dure du GIF


def sha(p):
    return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()


def vert(a):
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    return (g > 95) & (g > r * 1.15) & (g > b * 1.4)


def cadre(im, hauteur):
    """Hauteur imposée, largeur proportionnelle : aucun recadrage, aucun miroir."""
    return im.resize((max(1, round(im.width * hauteur / im.height)), hauteur), Image.LANCZOS)


def decoder(cible):
    im = Image.open(cible)
    frames, durees = [], []
    for f in ImageSequence.Iterator(im):
        frames.append(f.convert('RGB'))
        durees.append(f.info.get('duration'))
    return frames, durees


def mesure(cible, attendues, note):
    frames, durees = decoder(cible)
    phases = []
    for i, (gif, png) in enumerate(zip(frames, attendues)):
        a = np.asarray(gif).astype(float)
        b = np.asarray(png).astype(float)
        diff = np.abs(a - b).mean(axis=2)
        m = vert(np.asarray(png))
        mse = float((diff ** 2).mean())
        phases.append({
            'phase': i + 1,
            'taille': [gif.width, gif.height],
            'couleurs_uniques': int(len(np.unique(np.asarray(gif).reshape(-1, 3), axis=0))),
            'erreur_hors_vert': round(float(diff[~m].mean()), 2),
            'erreur_dans_vert': round(float(diff[m].mean()), 2),
            'erreur_max': int(diff.max()),
            'psnr_db': round(10 * np.log10(255.0 ** 2 / max(mse, 1e-9)), 2),
        })
    return {'fichier': str(cible.relative_to(ROOT)), 'note': note,
            'sha256': sha(cible), 'poids_ko': round(cible.stat().st_size / 1024),
            'images': len(frames), 'durees_ms': durees,
            'taille': [frames[0].width, frames[0].height],
            'agrandissement_dpr3': round(3 * AFFICHAGE_CSS / frames[0].height, 2),
            'phases': phases}


def exporter_gif(cible, images, methode):
    """methode : 'pipeline_actuel' (RGB->GIF direct), 'median' ou 'octree' (palette fixée)."""
    if methode == 'pipeline_actuel':
        images[0].save(cible, save_all=True, append_images=images[1:], duration=DUREE,
                       loop=0, optimize=True, disposal=2)
        return
    meth = Image.MEDIANCUT if methode == 'median' else Image.FASTOCTREE
    quant = [im.quantize(colors=PALETTE_MAX, method=meth, dither=Image.Dither.NONE)
             for im in images]
    quant[0].save(cible, save_all=True, append_images=quant[1:], duration=DUREE,
                  loop=0, optimize=True, disposal=2)


def exporter_gif_palette_partagee(cible, images):
    """Une seule palette pour les deux phases (le GIF de l'app a 2 images)."""
    ref = images[0].quantize(colors=PALETTE_MAX, method=Image.MEDIANCUT, dither=Image.Dither.NONE)
    quant = [ref] + [im.quantize(palette=ref, dither=Image.Dither.NONE) for im in images[1:]]
    quant[0].save(cible, save_all=True, append_images=quant[1:], duration=DUREE,
                  loop=0, optimize=True, disposal=2)


def exporter_gif_trame(cible, images, tramage):
    """Palette adaptative avec ou sans tramage, pour mesurer ce que le tramage change."""
    quant = [im.quantize(colors=PALETTE_MAX, method=Image.MEDIANCUT, dither=tramage)
             for im in images]
    quant[0].save(cible, save_all=True, append_images=quant[1:], duration=DUREE,
                  loop=0, optimize=True, disposal=2)


def exporter_webp(cible, images, qualite=None):
    images[0].save(cible, save_all=True, append_images=images[1:], duration=DUREE, loop=0,
                   quality=qualite if qualite else 100, lossless=qualite is None, method=6)


def detail_residuel(im, grille):
    """Énergie de détail contenue au-dessus d'une grille de compression donnée."""
    w, h = im.size
    petite = im.convert('L').resize((max(1, round(w * grille / h)), grille), Image.LANCZOS)
    retour = petite.resize((w, h), Image.BICUBIC)
    a = np.asarray(im.convert('L'), dtype=float)
    b = np.asarray(retour, dtype=float)
    return round(float(np.sqrt(((a - b) ** 2).mean())), 2), round(float(a.std()), 1)


def feuille(titre, lignes, sous_titre=None):
    """lignes : [(nom, [images])] -> une planche lisible, hauteur bornée."""
    marge, entete, hauteur_titre = 12, 26, 40 if sous_titre else 30
    largeur = max(sum(i.width for i in imgs) + marge * (len(imgs) + 1) for _, imgs in lignes)
    hauteur_max = max(im.height for _, imgs in lignes for im in imgs)
    image = Image.new('RGB', (largeur, hauteur_titre + len(lignes) * (hauteur_max + entete + marge) + marge), 'white')
    d = ImageDraw.Draw(image)
    d.text((marge, 8), titre, font=F(19), fill='#12242f')
    if sous_titre:
        d.text((marge, 30), sous_titre, font=F(14), fill='#5a6a75')
    y = hauteur_titre + marge
    for nom, imgs in lignes:
        d.text((marge, y), nom, font=F(15), fill='#12242f')
        y += entete
        x = marge
        for im in imgs:
            image.paste(im, (x, y + (hauteur_max - im.height) // 2))
            x += im.width + marge
        y += hauteur_max + marge
    return image


def affichage_300(f0):
    """Ce que l'écran reçoit : hauteur 300 px CSS (= .movement-visual)."""
    return f0.resize((max(1, round(f0.width * AFFICHAGE_CSS / f0.height)), AFFICHAGE_CSS), Image.LANCZOS)


def dpr3(f0):
    """Ce qu'un téléphone DPR3 échantillonne réellement (900 px de haut), montré à 50 %."""
    grand = f0.resize((max(1, round(f0.width * 900 / f0.height)), 900), Image.LANCZOS)
    return grand.resize((max(1, grand.width // 2), 450), Image.LANCZOS)


def main():
    for dossier in (EXP, PL):
        dossier.mkdir(parents=True, exist_ok=True)
    m1 = Image.open(SRC / '44-phase1-supinated-800x1333.png').convert('RGB')
    m2 = Image.open(SRC / '44-phase2-supinated-800x1333.png').convert('RGB')
    livre, _ = decoder(SRC / '44-livre-actuel-259x440.gif')

    controles = {
        'date': '2026-09-30', 'numero': 44, 'cle': 'curl-scott-haltere-neutre|homme',
        'objet': 'prototype de définition et d’export avant toute reprise des 389',
        'gif_livres_modifies': 0, 'generation_images': 0, 'recoloration': False,
        'apk_reconstruit': False, 'palette_max_gif': PALETTE_MAX,
        'affichage_css_px': AFFICHAGE_CSS,
        'sources': [
            {'fichier': 'sources/44-phase1-supinated-800x1333.png', 'taille': list(m1.size),
             'sha256': sha(SRC / '44-phase1-supinated-800x1333.png'),
             'provenance': 'commit c685298, propositions/lot69 (geste n°44 validé)'},
            {'fichier': 'sources/44-phase2-supinated-800x1333.png', 'taille': list(m2.size),
             'sha256': sha(SRC / '44-phase2-supinated-800x1333.png'),
             'provenance': 'commit c685298, propositions/lot69 (geste n°44 validé)'},
            {'fichier': 'sources/44-livre-actuel-259x440.gif', 'taille': list(livre[0].size),
             'images': len(livre), 'sha256': sha(SRC / '44-livre-actuel-259x440.gif'),
             'provenance': 'branche 01a0e6c9, gif/homme — témoin, non modifié'},
        ],
        'detail_du_maitre_au_dessus_de_la_grille_livree': {},
        'exports': [], 'planches': [],
    }
    for grille in (440, 660, 880, 1320):
        r, sd = detail_residuel(m1, grille)
        controles['detail_du_maitre_au_dessus_de_la_grille_livree'][f'grille_{grille}'] = {
            'rms_detail': r, 'ecart_type_image': sd}

    def meilleur_alignement(master, temoin):
        """Le GIF livré porte un léger décalage de fabrication : on le retrouve pour comparer à armes égales."""
        cible = np.asarray(temoin).astype(float)
        meilleur = None
        for dx in range(-3, 4):
            for dy in range(-3, 4):
                essai = np.asarray(cadre(master, 440).crop((dx, dy, dx + 259, dy + 440))).astype(float)
                e = float(np.abs(essai - cible).mean())
                if meilleur is None or e < meilleur[0]:
                    meilleur = (round(e, 2), dx, dy)
        return meilleur

    alignements = [meilleur_alignement(f, t) for f, t in zip((m1, m2), livre)]
    controles['alignement_livre_vs_maitre'] = [
        {'phase': i + 1, 'decalage_px': [a[1], a[2]], 'ecart_moyen_non_aligné': a[0]}
        for i, a in enumerate(alignements)]
    controles['exports'].append(dict(
        mesure(SRC / '44-livre-actuel-259x440.gif',
               [cadre(f, 440).crop((a[1], a[2], a[1] + 259, a[2] + 440))
                for f, a in zip((m1, m2), alignements)],
               'GIF livré aujourd’hui — comparaison à définition ÉGALE, aligné (± 3 px) sur le maître'),
        hauteur=440, format='gif', reglage='livré'))
    controles['exports'].append(dict(
        mesure(SRC / '44-livre-actuel-259x440.gif',
               [cadre(f, 440).crop((0, 0, 259, 440)) for f in (m1, m2)],
               'GIF livré aujourd’hui — comparaison à la définition 440 px (définition perdue)'),
        hauteur=440, format='gif', reglage='livré_vs_440'))

    for hauteur in (440, 660, 880):
        attendues = [cadre(m1, hauteur), cadre(m2, hauteur)]
        for reglage, suffixe in (('pipeline_actuel', 'gif-actuel'),
                                 ('median', 'gif-palette-mediancut'),
                                 ('octree', 'gif-palette-octree')):
            cible = EXP / f'44-h{hauteur}-{suffixe}.gif'
            exporter_gif(cible, attendues, reglage)
            controles['exports'].append(dict(mesure(cible, attendues, f'GIF {reglage}'),
                                             hauteur=hauteur, format='gif', reglage=reglage))
        for q, suffixe in ((90, 'webp-q90'), (80, 'webp-q80')):
            cible = EXP / f'44-h{hauteur}-{suffixe}.webp'
            exporter_webp(cible, attendues, q)
            controles['exports'].append(dict(mesure(cible, attendues, f'WebP q{q}'),
                                             hauteur=hauteur, format='webp', reglage=f'q{q}'))
        cible = EXP / f'44-h{hauteur}-apng.png'
        attendues[0].save(cible, save_all=True, append_images=attendues[1:], duration=DUREE,
                          loop=0, format='PNG')
        controles['exports'].append(dict(mesure(cible, attendues, 'APNG sans perte'),
                                         hauteur=hauteur, format='apng', reglage='sans perte'))

    # --- D2. essais de palette et de tramage à 660 px -----------------------------
    hauteur = 660
    attendues = [cadre(m1, hauteur), cadre(m2, hauteur)]
    essais = {
        'partagee': lambda c: exporter_gif_palette_partagee(c, attendues),
        'trame-floyd': lambda c: exporter_gif_trame(c, attendues, Image.Dither.FLOYDSTEINBERG),
        'trame-aucune': lambda c: exporter_gif_trame(c, attendues, Image.Dither.NONE),
    }
    controles['essais_palette_660'] = []
    for nom, fabrique in essais.items():
        cible = EXP / f'44-h{hauteur}-palette-{nom}.gif'
        fabrique(cible)
        controles['essais_palette_660'].append(dict(mesure(cible, attendues, f'essai palette {nom}'),
                                                    hauteur=hauteur, format='gif', reglage=nom))

    # --- E. planches : définition, formats, affichage réel -------------------------
    def ligne(nom, frames):
        f0 = frames[0]
        natif = f0 if f0.height <= 460 else cadre(f0, 460)
        zone = (max(0, f0.width // 2 - 72), int(f0.height * 0.30),
                min(f0.width, f0.width // 2 + 72), int(f0.height * 0.30) + 144)
        zoom = f0.crop(zone)
        zoom = zoom.resize((zoom.width * 2, zoom.height * 2), Image.NEAREST)
        return (nom, [natif, affichage_300(f0), dpr3(f0), zoom])

    sous = 'colonnes : natif 1:1 · affichage app 300 px · DPR3 (900 px réels) montré à 50 % · zoom 200 %'
    feuille('PROTOTYPE N°44 — DÉFINITION DES EXPORTS GIF (fichiers réellement décodés)', [
        ligne('LIVRÉ AUJOURD’HUI — 259x440', livre),
        ligne('440 px', decoder(EXP / '44-h440-gif-actuel.gif')[0]),
        ligne('660 px', decoder(EXP / '44-h660-gif-actuel.gif')[0]),
        ligne('880 px', decoder(EXP / '44-h880-gif-actuel.gif')[0]),
    ], sous).save(PL / 'PROTOTYPE-44-definition.png')

    feuille('PROTOTYPE N°44 — COMPARAISON DE FORMATS À 880 px (aucun changement de format proposé ici)', [
        ligne('GIF 880 px — 682 ko', decoder(EXP / '44-h880-gif-actuel.gif')[0]),
        ligne('WEBP animé 880 px q90 — 140 ko', decoder(EXP / '44-h880-webp-q90.webp')[0]),
        ligne('APNG 880 px sans perte — 1 300 ko', decoder(EXP / '44-h880-apng.png')[0]),
    ], sous).save(PL / 'PROTOTYPE-44-formats.png')

    # ce que l'œil reçoit à l'écran : même région du maître, hauteur d'affichage réelle
    region = (int(m1.width * 0.16), int(m1.height * 0.26), int(m1.width * 0.50), int(m1.height * 0.62))
    vignettes = [('LIVRÉ 259 px', affichage_300(livre[0]))]
    for h in (440, 660, 880):
        vignettes.append((f'GIF {h} px', affichage_300(decoder(EXP / f'44-h{h}-gif-actuel.gif')[0][0])))
    bande = feuille('PROTOTYPE N°44 — AFFICHAGE RÉEL DANS L’APPLICATION (300 px de haut, comme '
                    '.movement-visual)',
                    [(' | '.join(n for n, _ in vignettes), [im for _, im in vignettes])],
                    'chaque image est montrée exactement à la taille que l’écran lui donne aujourd’hui')
    bande.save(PL / 'PROTOTYPE-44-affichage-300px.png')

    # détail 1:1 sur le bras vert, à la définition native de chaque fichier
    bande = feuille('PROTOTYPE N°44 — LE BRAS VERT À 100 % (1 pixel du fichier = 1 pixel affiché)',
                    [ligne(n, f) for n, f in (('LIVRÉ 259x440', livre),
                                              ('GIF 440', decoder(EXP / '44-h440-gif-actuel.gif')[0]),
                                              ('GIF 660', decoder(EXP / '44-h660-gif-actuel.gif')[0]),
                                              ('GIF 880', decoder(EXP / '44-h880-gif-actuel.gif')[0]))])
    bande.save(PL / 'PROTOTYPE-44-zoom-bras.png')

    # les deux phases du geste validé, à définition conseillée (660) et haute (880)
    def deux_phases(h, nom):
        frames = decoder(EXP / f'44-h{h}-{nom}.gif')[0]
        lignes = []
        for i, f in enumerate(frames, 1):
            zone = (max(0, f.width // 2 - 72), int(f.height * 0.28),
                    min(f.width, f.width // 2 + 72), int(f.height * 0.28) + 144)
            zoom = f.crop(zone)
            lignes.append((f'PHASE {i} — natif', [f if f.height <= 460 else cadre(f, 460),
                                                  zoom.resize((zoom.width * 2, zoom.height * 2), Image.NEAREST)]))
        feuille(f'PROTOTYPE N°44 — LES DEUX PHASES, GIF {h} px DÉCODÉ', lignes,
                'gauche : image entière · droite : zoom 200 % sur le bras vert').save(
            PL / f'PROTOTYPE-44-deux-phases-{h}.png')

    deux_phases(660, 'gif-actuel')
    deux_phases(880, 'gif-actuel')

    controles['planches'] = [str((PL / n).relative_to(ROOT)) for n in (
        'PROTOTYPE-44-definition.png', 'PROTOTYPE-44-formats.png',
        'PROTOTYPE-44-affichage-300px.png', 'PROTOTYPE-44-zoom-bras.png',
        'PROTOTYPE-44-deux-phases-660.png', 'PROTOTYPE-44-deux-phases-880.png',
        'CONTROLE-geste-maitre-vs-livre.png')]
    controles['lecture_du_vert'] = []
    for chemin, label in ((SRC / '260-reference-elliptique-fractionne-femme-373x440.gif', 'RÉFÉRENCE 260'),
                          (SRC / '44-livre-actuel-259x440.gif', '44 livré'),
                          (None, 'MAITRE 44')):
        im = m1 if chemin is None else Image.open(chemin)
        a = np.asarray(im.convert('RGB'))
        m = vert(a)
        entree = {'image': label, 'pixels_verts': int(m.sum())}
        if m.any():
            couleurs, comptes = np.unique(a[m].reshape(-1, 3), axis=0, return_counts=True)
            ordre = np.argsort(-comptes)[:5]
            entree['mediane_rgb'] = [int(v) for v in np.median(a[m], axis=0)]
            entree['teintes_principales'] = [{'rgb': [int(v) for v in couleurs[i]],
                                              'pixels': int(comptes[i])} for i in ordre]
            entree['part_teinte_dominante'] = round(float(comptes[ordre[0]] / m.sum()), 3)
        controles['lecture_du_vert'].append(entree)
    (OUT / 'CONTROLES.json').write_text(json.dumps(controles, ensure_ascii=False, indent=1) + '\n')

    print('détail du maître au-dessus de la grille :',
          controles['detail_du_maitre_au_dessus_de_la_grille_livree'])
    for e in controles.get('essais_palette_660', []):
        p = e['phases'][0]
        print(f"{e['taille'][0]:>4}x{e['taille'][1]:<5} gif   palette {e['reglage']:<13} "
              f"{e['poids_ko']:>5} ko  err.hors-vert {p['erreur_hors_vert']:>5}  "
              f"err.vert {p['erreur_dans_vert']:>5}  PSNR {p['psnr_db']:>5} dB")
    for e in controles['exports']:
        p = e['phases'][0]
        print(f"{e['taille'][0]:>4}x{e['taille'][1]:<5} {e['format']:<5} {e['reglage']:<19} "
              f"{e['poids_ko']:>5} ko  err.hors-vert {p['erreur_hors_vert']:>5}  "
              f"err.vert {p['erreur_dans_vert']:>5}  PSNR {p['psnr_db']:>5} dB")
    print('planches :', controles['planches'])


if __name__ == '__main__':
    main()
