# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 34

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**230 / 331** visuels validés, 101 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. Les 3 planches encore refusées (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Tirage vertical prise neutre (femme)** — 1 refus | la prise est montrée en pronation large sur barre droite, pas en prise neutre | format 2 panneaux paysage (OK par ailleurs) | lot35 : « TWO PARALLEL VERTICAL HANDLES, palms facing each other, NOT a wide pronated grip » | aucune |
| **Soulevé de terre partiel (homme)** — 1 refus | les deux cases montrent le lockout debout : aucune position de départ fléchie sur les pins | vue de face, pins sous les genoux | lot35 : imposer LEFT buste penché ~45° barre SUR les pins / RIGHT debout, cases obligatoirement différentes | aucune |
| **Mollets unilatéraux (homme)** — 1 refus | le pied libre touche le sol aux deux cases (donc pas unilatéral) | ancre d'orientation, marche basse | lot35 : pied libre CROISÉ derrière la cheville porteuse, en l'air aux deux cases | aucune |

Clos ce tour : **ab-wheel RÉSOLU** (« EXACTLY ONE person per panel », 2ᵉ refus effacé) et
**extensions triceps barre EZ RÉSOLUE** (régénération avec ancre de tête, retrait relecture
effacé) ; + gainage latéral, soulevé de terre roumain unilatéral, respiration
diaphragmatique, squat cycliste, élévations latérales.

## 2. Blocs techniques récurrents du générateur d'images (constats, pas des excuses)

1. **Barre sur le dos vs rack avant** : en vue de profil, une génération sur deux pose la
   barre devant le cou. Les vues **de face** et **de dos** réussissent (prouvé lot 20).
   Règle désormais : tout squat/good morning se dessine de face ou de dos.
2. **Amplitude finale des tirages** : le modèle s'arrête à mi-course (hanche) pour les
   rowings lourds féminins. C'est le seul geste qui résiste encore (3 échecs).
3. **Orientation gauche/droite** : les gestes unilatéraux se retournent parfois entre les
   deux cases ; il faut l'ancrer explicitement (« tête du même côté de l'image »).
4. **Têtes/pieds coupés** aux bords des cases : corrigé par la consigne de marges (lot 20).
5. **Modération d'image** : 1 blocage aléatoire sur 30 générations (curl-poulie-basse,
   lot 19) ; un échec compte dans le lot de 10, retry au tour suivant. Aucun contournement
   demandé : simple constat de plafond.

## 3. Décisions que j'attends de vous (rien n'est fermé en silence)

1. **back-extension-45° prise snatch** (compté valide) : aucune barre n'apparaît, bras
   croisés. Le geste 45° est juste, le qualificatif « prise snatch » non représenté.
   → garder tel quel, ou refaire avec barre prise large sur les épaules ?
2. **Lot « style » des 21 GIF** dont une case n'a pas de vert lime (`production/style-a-reprendre.json`) :
   les régénérer (2 à 3 lots consommés) ou accepter l'état livré ?
3. **Relecture des 69 couples valides restants** : la poursuivre en parallèle de la
   production (rythme actuel ~12/tour) ou la mettre en pause pour accélérer les 194 restants ?
4. **Piscine (9 guides + 40 protocoles) et aqua tabata (6)** : 55 visuels aquatiques,
   immersion poitrine/taille imposée. Les enchaîner maintenant ou après la musculation ?
5. **Essai téléphone de la 1.4.8** : les groupes de constats restent OUVERTS jusqu'à votre
   retour ; aucun n'est clos sans vous.
6. **Clé de signature** : absente de cet espace de travail, je ne la fabrique ni ne la
   publie ; vous la recollerez au moment de la construction finale.

## 4. Contraintes d'environnement (sans impact sur le contenu)

- L'espace de travail s'est réinitialisé **deux fois** cette session (HEAD revenu à `main`) :
  procédure de restauration appliquée à chaque fois (fetch de la branche arena + reset +
  venv), **zéro perte** puisque tout est poussé sur `arena/01a0d6f5-…` à chaque tour.
- 2 GIF orphelins à la racine de `gif/` (premiers lots) : sans effet sur l'app, nettoyage
  prévu au câblage final.
