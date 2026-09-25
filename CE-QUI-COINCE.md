# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 37

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**242 / 331** visuels validés, 89 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. Les 3 planches encore refusées (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Soulevé de terre partiel (homme)** — 6 refus | même par ÉDITION le départ barre sur pins buste 45° n'apparaît pas (l'edit a retourné la vue de dos) | prompts texte, cases séparées, « deadlift bottom », édition | **lot38 : BLOCK PULL sans pins** : barre posée sur deux blocs noirs sous les disques, barre à mi-tibia ; départ hanche basse / lockout | aucune |
| **Mollets à la presse (homme)** — 4 refus | édition quasi identique à la case 1 : chevilles immobiles, vert sur tibias | presse 45°, genoux tendus, cases séparées, édition | **lot38 : talons DÉBORDANT de la plaque** : case 1 talons pendus dans le vide sous la plaque, case 2 talons montés au-dessus | aucune |
| **Drop lunges fentes sautées contrôlées (homme)** — 1 refus | permutation de jambes correcte mais haltère orphelin en case 1, aucun en case 2 | haltères aux deux mains | **lot38 : poids du corps**, mains sur les hanches aux deux cases, AUCUN haltère | aucune |

Clos ce tour : développés haltères décliné et incliné 45° prise neutre (vue de FACE pied de
banc), extensions triceps haltères incliné, tirage vertical prise pronation ; gainage
planche régénéré et relu (remplace le GIF précédent, couple déjà valide).

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
