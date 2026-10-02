#!/usr/bin/env python3
"""Fabrique l'outil de retouche d'un nouveau lot a partir de la file mesuree.

Pourquoi : la retouche d'un lot ne doit rien inventer. Tout ce qui change d'un lot a l'autre
(la planche, la fenetre recalee sur le GIF livre, la bbox de la tache verte) est deja mesure
dans hd-2026-09-30/PRIORITE-SOURCES.json. Ce script ecrit donc le fichier
retouche-lotN-vert260.py en recopiant le modele (le dernier lot valide) et en remplacant
UNIQUEMENT : le numero de lot et le bloc CIBLES. Aucune transcription a la main, donc aucun
risque de recopier un chiffre de travers.

Controle apres generation : relire le bloc CIBLES affiche, et verifier que les caisses ont le
bon rapport largeur/hauteur (elles doivent correspondre au GIF livre).

    python3 evolution/media/tools/nouveau-lot.py --lot 5 --numeros 364,365,366,340
    python3 evolution/media/tools/nouveau-lot.py --lot 5 --numeros 364,365,366,340 --modele retouche-lot4-vert260.py
"""
import argparse
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[3]
BASE = ROOT / 'evolution/media/refonte-photo/hd-2026-09-30'
OUTILS = ROOT / 'evolution/media/tools'
MARQUE_DEBUT = '# --- CIBLES (début) ---'
MARQUE_FIN = '# --- CIBLES (fin) ---'


def charger():
    prio = {r['numero']: r for r in json.load(open(BASE / 'PRIORITE-SOURCES.json'))['numeros']}
    inv = json.load(open(BASE / 'INVENTAIRE-SOURCES-389.json'))
    src = {e['numero']: e for s in ('A_manifeste', 'B_propositions', 'C2_retrouves_par_nom')
           for e in inv[s]}
    return prio, src


def bloc_cibles(numeros, prio, src):
    lignes = ['CIBLES = [']
    for n in numeros:
        r, e = prio[n], src[n]
        sexe = e['cle'].split('|')[-1]
        cle = e['cle'].split('|')[0]
        nom = cle.replace('-', ' ')
        hauteur = r['dims_source'][1]
        lignes.append(f"    dict(numero={n}, cle='{e['cle']}',")
        lignes.append(f"         planche='{e['chemin']}', ref_source='c685298',")
        lignes.append(f"         livre='gif/{sexe}/{cle}-{sexe}.gif', ref_livre='base/lots-complets',")
        lignes.append(f"         note='{nom} ; erreur d’alignement {r['erreur_alignement_max']}/255, "
                      f"perte x{r['facteur_perte']}',")
        phases = []
        for p in r['phases']:
            x0 = round(p['x0_source_natif'])
            w = round(p['largeur_source_natif'])
            bbox = tuple(p['vert_gif']['bbox']) if p['vert_gif'] else (0, 0, 1, 1)
            phases.append(f"dict(caisse=({x0}, 0, {x0 + w}, {hauteur}), vert_gif={bbox}, seuil=0.10, mini=200)")
        lignes.append('         phases=[' + ',\n                 '.join(phases) + ']),')
    lignes.append(']')
    return '\n'.join(lignes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lot', type=int, required=True)
    ap.add_argument('--numeros', required=True)
    ap.add_argument('--modele', default='retouche-lot4-vert260.py')
    args = ap.parse_args()
    numeros = [int(x) for x in args.numeros.split(',')]
    prio, src = charger()

    manquants = [n for n in numeros if n not in prio or n not in src]
    if manquants:
        sys.exit(f"numéros sans source native connue : {manquants}")
    for n in numeros:
        if not prio[n]['verdict'].startswith('RETENUE'):
            print(f"⚠️  n°{n} : le tableau de priorité dit « {prio[n]['verdict']} » — à confirmer avant de lancer")

    modele = pathlib.Path(OUTILS / args.modele).read_text(encoding='utf-8')
    if MARQUE_DEBUT not in modele or MARQUE_FIN not in modele:
        sys.exit(f"le modèle {args.modele} n'a pas les bornes {MARQUE_DEBUT} / {MARQUE_FIN}")
    i = modele.index(MARQUE_DEBUT)
    j = modele.index(MARQUE_FIN)
    nouveau = modele[:i] + MARQUE_DEBUT + '\n' + bloc_cibles(numeros, prio, src) + '\n' + modele[j:]
    nouveau, nb = re.subn(r'(?m)^LOT = \d+$', f'LOT = {args.lot}', nouveau, count=1)
    if not nb:
        sys.exit("impossible de remplacer le numéro de lot dans le modèle")
    # modèle par défaut : le lot précédent s'il existe
    if args.modele == 'retouche-lot4-vert260.py':
        for k in range(args.lot - 1, 3, -1):
            if (OUTILS / f'retouche-lot{k}-vert260.py').exists():
                break
    # en-tête
    titre = ', '.join(str(n) for n in numeros)
    nouveau = nouveau.replace(f'"""Lot {args.lot - 1} (n degre ', f'"""Lot {args.lot} (n degre ', 1)

    cible = OUTILS / f'retouche-lot{args.lot}-vert260.py'
    cible.write_text(nouveau, encoding='utf-8')
    print(f"écrit : {cible}")
    print("\n" + bloc_cibles(numeros, prio, src))
    print(f"\nVérifie les caisses ci-dessus, puis lance :")
    print(f"   .cache/pyvenv/bin/python evolution/media/tools/retouche-lot{args.lot}-vert260.py")


if __name__ == '__main__':
    main()
