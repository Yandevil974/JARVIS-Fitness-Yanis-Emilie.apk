#!/usr/bin/env python3
"""Plan de production des visuels refonte-photo.

Construit la liste EXHAUSTIVE des noms a illustrer, tous domaines confondus, a
partir de l'inventaire livre (evolution/media/review/inventory-1.4.0.json), et
regroupe les noms qui designent REELLEMENT le meme mouvement : un seul GIF sert
alors plusieurs noms (l'application l'autorise deja pour deux identifiants).

    python3 evolution/media/tools/refonte-plan.py

Sortie : evolution/media/refonte-photo/production/plan.json
"""
import json
import pathlib
import re
import sys
import unicodedata

RACINE = pathlib.Path(__file__).resolve().parents[3]
INVENTAIRE = RACINE / 'evolution/media/review/inventory-1.4.0.json'
SORTIE = RACINE / 'evolution/media/refonte-photo/production/plan.json'


def sans_accent(texte):
    return ''.join(c for c in unicodedata.normalize('NFD', texte.lower())
                   if unicodedata.category(c) != 'Mn')


def slug(texte):
    texte = sans_accent(texte).replace('°', '').replace('%', '')
    texte = re.sub(r'[^a-z0-9]+', '-', texte).strip('-')
    return re.sub(r'-{2,}', '-', texte)


def cle_mouvement(nom):
    """Signature de mouvement : sert a reunir les noms strictement identiques.

    On retire ce qui ne change pas le geste (niveau, duree, « alterne », « sur
    place » quand le nom ne differe que par la, et les repetitions de mots) mais
    on garde l'outil et la variante (incline, unilateral, haltere, cable...).
    """
    texte = sans_accent(nom)
    texte = re.sub(r'\b(activation|en place|sur place|guide|demonstration)\b', ' ', texte)
    texte = re.sub(r'[^a-z0-9]+', ' ', texte)
    mots = sorted(set(mot for mot in texte.split() if len(mot) > 2))
    return ' '.join(mots)


def main():
    inv = json.loads(INVENTAIRE.read_text(encoding='utf-8'))
    lignes = []

    def ajouter(surface, nom, domaine, detail=None):
        lignes.append({'surface': surface, 'nom': nom, 'domaine': domaine,
                       'detail': detail, 'slug': slug(nom)})

    for ex in inv['exercises']:
        # Athlete : le proprietaire du profil, comme convenu (Emilie = la femme,
        # Yanis et les exercices partages = l'homme).
        femme = ex.get('sources') == ['emilie']
        ajouter('musculation', ex['name'],
                'femme' if femme else 'homme',
                {'id': ex['id'], 'muscle': ex.get('muscle'),
                 'materiel': ex.get('equipment'), 'visuelLivre': (ex.get('resolved') or {}).get('path')})
    for item in inv['stretches']:
        femme = item.get('sources') == ['emilie']
        ajouter('etirement', item['name'], 'femme' if femme else 'homme',
                {'id': item['id'], 'muscle': item.get('muscle')})
    for item in inv['tabataLand']:
        ajouter('tabata-au-sol', item['name'], 'homme',
                {'visuelLivre': (item.get('resolved') or {}).get('path')})
    for item in inv['tabataAqua']:
        ajouter('tabata-aqua', item['name'], 'femme',
                {'visuelLivre': (item.get('resolved') or {}).get('path')})
    for item in inv['poolGuides']:
        ajouter('piscine', item['t'], 'femme',
                {'alias': item.get('k'), 'visuelLivre': item.get('img')})
    for proto in inv['poolProtocols']:
        for niveau in proto['levels']:
            for step in niveau['steps']:
                ajouter('piscine-protocole', step['name'], 'femme',
                        {'protocole': proto['name'], 'niveau': niveau['name'],
                         'visuelLivre': (step.get('resolved') or {}).get('path')})
    for item in inv['cardioGuides']:
        ajouter('cardio-elliptique', item['t'], 'femme',
                {'alias': item.get('k'), 'visuelLivre': item.get('img')})
    for cle, nom in [('route', 'Échauffement — mise en route'),
                     ('mobilite', 'Échauffement — mobilité'),
                     ('approche', 'Échauffement — séries d’approche')]:
        ajouter('echauffement', nom, 'homme',
                {'cle': cle, 'visuelLivre': inv['warmupImages'].get(cle)})

    for ligne in lignes:
        ligne['mouvement'] = cle_mouvement(ligne['nom'])
        ligne['athlete'] = ligne['domaine']

    groupes = {}
    for ligne in lignes:
        groupes.setdefault((ligne['surface'], ligne['mouvement']), []).append(ligne)

    sortie = {'source': 'evolution/media/review/inventory-1.4.0.json',
              'regleAthlete': 'Emilie (femme) = exercices emilie ; Yanis (homme) = elite, jarvis et partages',
              'famille': '2 images retouchees de la photo validee, 500 ms, boucle infinie',
              'noms': lignes,
              'mouvements': [
                  {'identifiant': ligne['slug'],
                   'surface': cle[0],
                   'athlete': groupe[0]['athlete'],
                   'noms': [item['nom'] for item in groupe],
                   'slugs': [item['slug'] for item in groupe]}
                  for cle, groupe in sorted(groupes.items(), key=lambda kv: kv[0])
                  for ligne in [groupe[0]]],
              }
    sortie['chiffres'] = {
        'noms': len(lignes),
        'mouvements': len(sortie['mouvements']),
        'images': 2 * len(sortie['mouvements']),
        'parSurface': {cle: sum(1 for m in sortie['mouvements'] if m['surface'] == cle)
                       for cle in sorted({m['surface'] for m in sortie['mouvements']})},
        'parAthlete': {cle: sum(1 for m in sortie['mouvements'] if m['athlete'] == cle)
                       for cle in sorted({m['athlete'] for m in sortie['mouvements']})},
    }
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    SORTIE.write_text(json.dumps(sortie, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps(sortie['chiffres'], ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
