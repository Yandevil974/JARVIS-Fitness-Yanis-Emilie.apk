# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 41

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**270 / 331** visuels validés, 61 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. La planche encore refusée (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Oiseau-chien (homme)** — 1 refus | case 2 : extension du MÊME côté (bras loin + jambe loin tendus ensemble, appuis du même côté) au lieu de membres opposés | prompt quadrupède + « opposite arm and opposite leg » | **lot42 : côtés caméra imposés** — bras PROCHE caméra vertical au sol + jambe PROCHE caméra tendue en arrière, bras LOIN tendu vers l'avant, genou LOIN au sol | aucune |

Clos ce tour (lot 41) : **corde invisible RÉSOLUE** (2 panneaux paysage corps entier, saut
réel, mains vides), mollets, montées de genoux, montées sur mollets, mountain climbers lents
(vue de FACE), patineurs, planche, planche latérale G, pompes au mur — 9 planches acceptées.
Note style : case 1 de corde invisible sans vert lime → `style-a-reprendre.json` (22 entrées).

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
