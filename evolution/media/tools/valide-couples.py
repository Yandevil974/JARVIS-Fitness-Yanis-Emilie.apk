#!/usr/bin/env python3
"""Valide des couples (identifiant|athlete) nouvellement produits : copies conformes,
manifeste, etat, numerotation PDF figee, map candidate — en une seule commande.

    .cache/pyvenv/bin/python evolution/media/tools/valide-couples.py --athlete homme \
        --acceptes aqua-jogging-sur-place,nage-douce,... [--lot lot51]

Regles appliquees :
  * le GIF gif/<athlete>/<slug>-<athlete>.gif doit exister (produit par refonte-sheet.py) ;
  * copies conformes : les identifiants qui, chez l'AUTRE athlete, partagent deja le meme GIF
    (meme SHA dans le manifeste) et qui figurent dans etat.restants pour cet athlete recoivent
    une copie octet pour octet (l'app d'origine partageait deja ces medias) ;
  * chaque nouveau couple entre dans le manifeste (surface, noms du plan, SHA, frames, taille,
    planche source si trouvee dans le lot indique), dans etat.valides (retire de restants) et
    recoit le numero PDF suivant (jamais de renumerotation) ;
  * rien n'est retire : un couple deja valide n'est pas touche.
"""
import argparse
import collections
import hashlib
import json
import pathlib
import shutil

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[3]
EV = ROOT / 'evolution'
R = EV / 'media/refonte-photo'
LIV = R / 'livraison'
PROD = R / 'production'
CAND = EV / 'media/candidate'


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--athlete', required=True, choices=['homme', 'femme'])
    ap.add_argument('--acceptes', required=True, help='slugs acceptes, separes par des virgules')
    ap.add_argument('--lot', help='dossier planches (ex. lot51) pour renseigner la planche source')
    ap.add_argument('--sans-copies', action='store_true')
    args = ap.parse_args()
    ath = args.athlete
    autre = 'femme' if ath == 'homme' else 'homme'
    man = json.load(open(LIV / 'manifeste-331.json'))
    etat = json.load(open(PROD / 'etat.json'))
    plan = json.load(open(PROD / 'plan.json'))
    num = json.load(open(LIV / 'numerotation-pdf.json'))
    mp = json.load(open(CAND / 'refonte-331-map.json'))
    restants = set(etat['restants'])
    valides = set(etat['valides'])
    deja = {e['cle'] for e in man['entrees']}
    # surface + noms par (identifiant, athlete) depuis le plan (premiere surface rencontree)
    info = {}
    for m in plan['mouvements']:
        info.setdefault((m['identifiant'], m['athlete']), m)
    # groupes de copies conformes chez l'autre athlete (meme SHA)
    groupes = collections.defaultdict(set)
    for e in man['entrees']:
        if e['athlete'] == autre:
            groupes[e['gif_sha256']].add(e['identifiant'])
    ident2groupe = {}
    for s, idents in groupes.items():
        for i in idents:
            ident2groupe[i] = idents
    nouveaux = []  # (cle, gif_path, planche)
    for slug in [s.strip() for s in args.acceptes.split(',') if s.strip()]:
        cle = '%s|%s' % (slug, ath)
        gif = R / 'gif' / ath / ('%s-%s.gif' % (slug, ath))
        if not gif.exists():
            raise SystemExit('GIF absent : %s' % gif)
        if (slug, ath) not in info:
            raise SystemExit('identifiant inconnu du plan pour cet athlete : %s' % cle)
        planche = None
        if args.lot:
            for cand in (R / 'planches' / args.lot / ('%s.png' % slug), R / 'planches' / args.lot / ath / ('%s.png' % slug)):
                if cand.exists():
                    planche = str(cand.relative_to(R))
        if cle not in deja:
            nouveaux.append((cle, gif, planche))
        if not args.sans_copies:
            for autre_ident in sorted(ident2groupe.get(slug, set()) - {slug}):
                c2 = '%s|%s' % (autre_ident, ath)
                if c2 in restants and c2 not in deja and (autre_ident, ath) in info:
                    dst = R / 'gif' / ath / ('%s-%s.gif' % (autre_ident, ath))
                    shutil.copyfile(gif, dst)
                    nouveaux.append((c2, dst, planche))
                    print('copie conforme : %s <- %s' % (c2, slug))
    suivant = max(num['numeros'].values()) + 1
    for cle, gif, planche in nouveaux:
        ident, a = cle.split('|')
        m = info[(ident, a)]
        im = Image.open(gif)
        entree = {'cle': cle, 'identifiant': ident, 'athlete': a, 'surface': m['surface'], 'noms': m['noms'],
                  'gif': str(gif.relative_to(EV)), 'gif_sha256': sha(gif), 'gif_frames': getattr(im, 'n_frames', 1),
                  'gif_size': list(im.size), 'planche': planche}
        man['entrees'].append(entree)
        mp['entrees'][cle] = {'gif': entree['gif'], 'sha256': entree['gif_sha256'], 'surface': m['surface']}
        valides.add(cle)
        restants.discard(cle)
        if cle not in num['numeros']:
            num['numeros'][cle] = suivant
            suivant += 1
        print('valide : %-55s n° %d  %s' % (cle, num['numeros'][cle], m['surface']))
    man['total'] = len(man['entrees'])
    etat['valides'] = sorted(valides)
    etat['restants'] = sorted(restants)
    surf_first = {}
    for m in plan['mouvements']:
        surf_first.setdefault('%s|%s' % (m['identifiant'], m['athlete']), m['surface'])
    etat['chiffres'] = {'total': len(valides) + len(restants), 'valides': len(valides), 'restants': len(restants),
                        'valides_par_surface': dict(collections.Counter(surf_first[k] for k in valides)),
                        'restants_par_surface': dict(collections.Counter(surf_first[k] for k in restants))}
    json.dump(man, open(LIV / 'manifeste-331.json', 'w'), ensure_ascii=False, indent=1)
    json.dump(etat, open(PROD / 'etat.json', 'w'), ensure_ascii=False, indent=1)
    json.dump(num, open(LIV / 'numerotation-pdf.json', 'w'), ensure_ascii=False, indent=1)
    json.dump(mp, open(CAND / 'refonte-331-map.json', 'w'), ensure_ascii=False, indent=1)
    print('manifeste : %d entrees ; etat : %s' % (len(man['entrees']), etat['chiffres']))


if __name__ == '__main__':
    main()
