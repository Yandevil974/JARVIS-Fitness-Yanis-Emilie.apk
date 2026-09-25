# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 35

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**235 / 331** visuels validés, 96 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. Les 5 planches encore refusées (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Soulevé de terre partiel (homme)** — 2 refus | départ non posé sur les pins (barre à mi-cuisse, buste quasi droit) et vert sur quadriceps au lieu de chaîne postérieure | vue de face, pins, « cases différentes » | lot36 : LEFT barre **posée sur les pins** sous les genoux, buste 45° ; vert uniquement fessiers/ischios | aucune |
| **Curl haltères incliné prise neutre (homme)** — 1 refus | génération en grille 2×2 (quatre quadrants) | bench incliné, ancre de tête | lot36 : « EXACTLY TWO panels side by side landscape 2:1, NOT a 2x2 grid » | aucune |
| **Relevés de jambes suspendu (homme)** — 1 refus | génération en grille 2×2 (quatre quadrants) | barre de traction, vue de profil | lot36 : même consigne de format 2 panneaux | aucune |
| **Mollets à la presse (homme)** — 1 refus | case 2 = genoux fléchis (leg press) au lieu de chevilles seules ; vert absent en case 2 | presse 45°, marges machine | lot36 : genoux tendus immobiles, mouvement de cheville seul, vert mollets aux deux cases | aucune |
| **Hip thrust barre (femme)** — retirée à la relecture | haltères montrés au lieu de la **barre** (matériel faux, critère utilisateur) | lot précédent accepté à tort | lot36 : barre longue avec disques aux deux bouts posée sur le pli de hanche | aucune |

Clos ce tour : **tirage vertical prise neutre RÉSOLU** (poignées parallèles verticales) et
**mollets unilatéraux RÉSOLUS** (pied libre croisé en l'air) ; + développé haltères plat
prise neutre (vue de FACE pied de banc), extensions triceps haltères plat, curl Scott 90
supination, leg press unilatéral.

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
