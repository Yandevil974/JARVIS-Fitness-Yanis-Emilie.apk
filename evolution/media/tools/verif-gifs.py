#!/usr/bin/env python3
"""Controle mesure des GIF livres par la refonte photo (aucun jugement a l'oeil).

Pour chaque couple (identifiant, athlete) declare valide dans
`evolution/media/refonte-photo/production/etat.json`, le GIF livre est ouvert et
mesure :

  1. signature GIF89a, 2 images exactement, 500 ms par image, boucle infinie ;
  2. hauteur 440 px, largeur <= 900 px (famille visuelle livree) ;
  3. l'identifiant existe vraiment dans `production/plan.json` et l'athlete
     du fichier correspond a l'athlete du plan (garde-fou des noms inventes) ;
  4. le vert lime est present dans les DEUX cases (surlignage du muscle cible) ;
  5. les deux cases different vraiment (le mouvement existe) ; les identifiants
     listes en `myoReps` sont exceptes (leurs deux cases sont presque egales) ;
  6. aucun GIF n'est le quasi-double d'un autre GIF d'un AUTRE identifiant
     (une image recopiee pour deux mouvements differents serait une erreur) ;
  7. la zone du vert (tiers haut / milieu / bas du corps) est comparee a la zone
     attendue deduite du muscle cible : un desaccord de zone ne refuse PAS la
     planche, il la marque « a relire » pour la lecture humaine.

Sortie : `evolution/media/refonte-photo/verification/verif-gifs.json` + un resume
imprime. Aucune image n'est refusee par ce script : il mesure, l'humain lit.
"""
import json
import pathlib
import sys

import numpy as np
from PIL import Image

RACINE = pathlib.Path(__file__).resolve().parents[1] / 'refonte-photo'
GIF = RACINE / 'gif'
SORTIE = RACINE / 'verification'

# zones du corps AUTORISEES pour chaque code muscle du plan (detail.muscle des noms).
# Un desaccord d'UN cran est courant et normal (un squat colore aussi la hanche) :
# seule une zone a DEUX crans du muscle cible (ex. vert aux pieds pour des epaules)
# est signalee a la relecture humaine.
ZONES_MUSCLE = {
    'tra': {'haut'}, 'epA': {'haut'}, 'epL': {'haut'}, 'epP': {'haut', 'milieu-haut'},
    'pec': {'milieu-haut'}, 'dos': {'milieu-haut'}, 'bic': {'milieu-haut'},
    'tri': {'haut', 'milieu-haut'}, 'avb': {'milieu-haut'},
    'abs': {'milieu-bas'}, 'lom': {'milieu-bas'},
    'fes': {'milieu-bas'}, 'moy': {'milieu-bas'}, 'add': {'milieu-bas'},
    'qua': {'milieu-bas', 'bas'}, 'isc': {'milieu-bas', 'bas'}, 'mol': {'bas'},
}
ORDRE = ['haut', 'milieu-haut', 'milieu-bas', 'bas']
MYO_REPS = ('myo-reps', 'mini-series', '1-5-reps', 'test-3-5-reps', 'pause-complete')


def vert(image):
    """Masque du vert lime (surlignage du muscle) + statistiques de zone."""
    a = np.asarray(image.convert('RGB'), dtype=int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (g > 120) & (g > r + 15) & (g > b + 60)
    n = int(m.sum())
    if not n:
        return 0, None, None
    ys, xs = np.nonzero(m)
    h, w = m.shape
    return n, (float(ys.mean()) / h, float(xs.mean()) / w), (ys.min() / h, ys.max() / h)


def zone_attendue(identifiant, slugs, slug_muscle):
    codes = {slug_muscle.get(s) for s in slugs}
    codes.discard(None)
    zones = set()
    for code in codes:
        zones |= ZONES_MUSCLE.get(code, set())
    return sorted(zones, key=ORDRE.index) if zones else None


def zone_mesuree(bbox_y):
    """bbox_y = (y_min, y_max) en fraction de la hauteur de l'image."""
    y0, y1 = bbox_y
    milieu = (y0 + y1) / 2
    if y1 < 0.42:
        return 'haut'
    if y0 > 0.62:
        return 'bas'
    if milieu < 0.5:
        return 'milieu-haut'
    return 'milieu-bas'


def main():
    plan = json.load(open(RACINE / 'production' / 'plan.json'))
    etat = json.load(open(RACINE / 'production' / 'etat.json'))
    mouvements = {m['identifiant']: m for m in plan['mouvements']}
    slug_muscle = {n['slug']: (n.get('detail') or {}).get('muscle') for n in plan['noms']}

    resultat = {'regle': 'mesures sur les GIF livres ; aucune acceptation automatique',
                'controles': [], 'anomalies': [], 'aRelire': [], 'doubles': []}

    signatures = []
    for cle in etat['valides']:
        identifiant, athlete = cle.split('|')
        ligne = {'cle': cle}
        fichier = GIF / athlete / f'{identifiant}-{athlete}.gif'
        if not fichier.exists():
            # tolere les fichiers poses a la racine de gif/ pendant les premiers lots
            alt = GIF / f'{identifiant}-{athlete}.gif'
            fichier = alt if alt.exists() else fichier
        if not fichier.exists():
            ligne['erreur'] = 'FICHIER ABSENT'
            resultat['anomalies'].append(ligne)
            resultat['controles'].append(ligne)
            continue
        raw = fichier.read_bytes()
        if not raw.startswith(b'GIF89a'):
            ligne['erreur'] = 'signature != GIF89a'
        im = Image.open(fichier)
        n = getattr(im, 'n_frames', 1)
        durees = []
        frames = []
        for i in range(n):
            im.seek(i)
            durees.append(im.info.get('duration'))
            frames.append(im.convert('RGB'))
        ligne.update(fichier=str(fichier.relative_to(RACINE)), frames=n,
                     durees=durees, taille=frames[0].size,
                     boucle=im.info.get('loop'))
        if n != 2:
            ligne['erreur'] = ligne.get('erreur', '') + ' frames=%d!=2' % n
        if any(d != 500 for d in durees):
            ligne['erreur'] = ligne.get('erreur', '') + ' duree=%s!=500ms' % durees
        if im.info.get('loop') not in (0, None):
            ligne['erreur'] = ligne.get('erreur', '') + ' boucle=%s' % im.info.get('loop')
        h, w = frames[0].size[1], frames[0].size[0]
        if h != 440 or w > 900:
            ligne['erreur'] = ligne.get('erreur', '') + ' taille=%dx%d' % (w, h)

        mvt = mouvements.get(identifiant)
        if mvt is None:
            ligne['erreur'] = ligne.get('erreur', '') + ' IDENTIFIANT ABSENT DU PLAN'
        else:
            if mvt.get('athlete') != athlete:
                ligne['erreur'] = ligne.get('erreur', '') + ' athlete plan=%s' % mvt.get('athlete')
            ligne['noms'] = mvt.get('noms')
            ligne['surface'] = mvt.get('surface')

        verts = [vert(f) for f in frames]
        ligne['vert_px'] = [v[0] for v in verts]
        if any(v[0] == 0 for v in verts):
            ligne['erreur'] = ligne.get('erreur', '') + ' VERT ABSENT (case %s)' % \
                [i for i, v in enumerate(verts) if v[0] == 0]
        else:
            bbox = (min(v[2][0] for v in verts), max(v[2][1] for v in verts))
            ligne['vert_zone'] = zone_mesuree(bbox)
            ligne['vert_centre'] = [round(v[1][0], 2) for v in verts]
            attendu = zone_attendue(identifiant, mvt.get('slugs', []), slug_muscle) if mvt else None
            ligne['vert_attendu'] = attendu
            if attendu and ligne['vert_zone'] not in attendu:
                ecart = min(abs(ORDRE.index(ligne['vert_zone']) - ORDRE.index(z))
                            for z in attendu)
                if ecart >= 2:
                    resultat['aRelire'].append({
                        'cle': cle, 'motif': 'vert en zone %s, muscle cible (%s) attendu en %s'
                        % (ligne['vert_zone'], ','.join(sorted(
                            {slug_muscle.get(s) for s in mvt.get('slugs', [])} - {None})),
                           '/'.join(attendu))})

        a = np.asarray(frames[0].convert('L'), dtype=float)
        b = np.asarray(frames[1].convert('L'), dtype=float)
        delta = np.abs(a - b)
        ligne['mouvement_px'] = round(float((delta > 25).mean()), 4)
        myo = any(t in identifiant for t in MYO_REPS)
        if ligne['mouvement_px'] < 0.02 and not myo:
            ligne['erreur'] = ligne.get('erreur', '') + ' DEUX CASES QUASI IDENTIQUES'
        ligne['myo_reps'] = myo

        petite = np.asarray(frames[0].convert('L').resize((48, 48)), dtype=float)
        signatures.append((cle, petite))
        if ligne.get('erreur'):
            resultat['anomalies'].append({k: v for k, v in ligne.items() if k != 'noms'})
        resultat['controles'].append(ligne)

    # quasi-doubles entre identifiants differents
    for i in range(len(signatures)):
        for j in range(i + 1, len(signatures)):
            (c1, s1), (c2, s2) = signatures[i], signatures[j]
            if c1.split('|')[0] == c2.split('|')[0]:
                continue
            ecart = np.abs(s1 - s2).mean()
            if ecart < 6.0:
                resultat['doubles'].append({'a': c1, 'b': c2, 'ecart': round(float(ecart), 2)})

    # fichiers GIF presents mais declares nulle part (orphelins)
    declares = {'%s-%s' % tuple(c.split('|')) for c in etat['valides']}
    orphelins = []
    for athlete in ('homme', 'femme'):
        for p in sorted((GIF / athlete).glob('*.gif')):
            if p.stem not in declares:
                orphelins.append(str(p.relative_to(RACINE)))
    for p in sorted(GIF.glob('*.gif')):
        orphelins.append('racine/' + p.name)
    resultat['orphelins'] = orphelins

    SORTIE.mkdir(parents=True, exist_ok=True)
    json.dump(resultat, open(SORTIE / 'verif-gifs.json', 'w'), ensure_ascii=False, indent=1)
    n_ok = sum(1 for c in resultat['controles'] if not c.get('erreur'))
    print('GIF controles : %d  —  conformes : %d  —  anomalies : %d'
          % (len(resultat['controles']), n_ok, len(resultat['anomalies'])))
    for a in resultat['anomalies']:
        print('  ANOMALIE %-55s %s' % (a['cle'], a['erreur']))
    print('quasi-doubles entre mouvements : %d' % len(resultat['doubles']))
    for d in resultat['doubles']:
        print('  DOUBLE %s ~ %s (ecart %.2f)' % (d['a'], d['b'], d['ecart']))
    print('a relire (zone du vert) : %d' % len(resultat['aRelire']))
    for a in resultat['aRelire']:
        print('  A RELIRE %-55s %s' % (a['cle'], a['motif']))
    print('fichiers orphelins : %d' % len(resultat['orphelins']))
    for o in resultat['orphelins']:
        print('  ORPHELIN %s' % o)
    return 0


if __name__ == '__main__':
    sys.exit(main())
