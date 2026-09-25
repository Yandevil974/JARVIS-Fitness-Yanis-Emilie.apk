# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 44

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**319 / 331** visuels validés, 12 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. La planche encore refusée (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Nage douce (femme)** — 1 refus | case 2 : DEUX femmes dans la même case (corps dupliqué) | prompt brasse douce standard | **lot45 : ancre « EXACTLY ONE woman, ONE head, ONE body per panel »** + même lot pour nage-douce-respiration (échec transitoire MAX_TOKENS au lot 44) | aucune |

Clos ce tour (lot 44, protocoles piscine) : 8 planches acceptées (aqua-jogging sur place,
ciseaux mains au bord, déplacements latéraux 4 m, montées de genoux EFFORT, étirements au
bord, mobilité épaules, mobilité hanches/chevilles, repos) + **26 copies conformes** de GIF
déjà validés pour les étapes de protocole qui décrivent le MÊME geste que leur guide
(comme le fait l'app d'origine avec ses médias) : récupérations marchées, variantes EFFORT,
échauffements, tours/tabatas en place, nage statique Z2, fractionné/sprint 1-6/1-8…
Notes style : étirements-au-bord et repos sans vert mesuré ([0,0]) → `style-a-reprendre.json`
(25 entrées) ; relecture-23 : relevés de jambes allongé homme case 1 sans vert → idem.

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
