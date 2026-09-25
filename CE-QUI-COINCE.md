# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 20

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**137 / 331** visuels validés, 194 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. Les 2 planches encore refusées (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Mountain climbers (femme)** — 5 refus | cases assemblées : pieds nus d'un côté, chaussures de l'autre, et même jambe avant | prompt permuté, édition de planche, cases séparées, proche/lointaine, cadrage imposé | **éditer UNE seule case** (lot27-case1, chaussures imposées) : « tends la jambe pliée vers l'arrière et amène le genou de l'autre jambe sous la poitrine » ; assembler ensuite case éditée + case d'origine inversée | aucune |
| **Élévations latérales coude à 90 (homme)** — 2 refus | géométrie enfin bonne mais vert posé AUSSI sur les abdominaux aux deux cases | départs variés, géométrie avant-bras horizontaux | même prompt géométrique + règle de vert exclusive : « vert UNIQUEMENT sur les deux deltoïdes latéraux ; abdomen, poitrine et bras gardent leur couleur naturelle » | aucune |

Clos ce tour : 7 neuves acceptées ; souleve-de-terre-roumain-halteres reporté d'un tour
(plafond de 10 générations atteint).

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
