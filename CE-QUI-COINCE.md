# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 20

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**137 / 331** visuels validés, 194 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. Les 3 planches encore refusées (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Développé haltère un bras debout (homme)** — 3 refus | vert sur l'épaule du bras LIBRE en case départ (la case fin était bonne au lot 23) | « RIGHT shoulder », édition ciblée, vert « côté gauche de l'image » | vert en **manche complète** : « peindre tout le bras qui tient l'haltère, de l'épaule au coude » — une grande zone se place mieux qu'un petit deltoïde | aucune |
| **Mountain climbers (femme)** — 1 refus | les deux cases montrent la même jambe avant | prompt « les jambes ont permuté » | édition de la case 1 : « dans la case DROITE seulement, avancer l'AUTRE genou » | aucune |
| **Développé couché haltères (femme)** — 1 refus | un seul haltère tenu à deux mains | prompt « un haltère dans chaque main » | insister sur le compte : « DEUX haltères séparés, QUATRE disques visibles, les mains ne se touchent jamais » | aucune |

Clos depuis la dernière liste : rowing-barre-buste-penche-test-3-5-reps (tirage complet obtenu
par édition ; écart résiduel « arrivée au ventre » soumis à votre option du §3).

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
