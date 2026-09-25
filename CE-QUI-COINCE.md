# 🚧 Ce qui coince — état au 25 septembre 2026, après lot 20

Liste demandée pour revue de votre côté. Tout le reste du flux tourne normalement
(**137 / 331** visuels validés, 194 restants) ; ce fichier ne contient que les points
bloquants ou qui demandent une décision.

## 1. Les 3 planches encore refusées (je continue dessus au prochain tour)

| Mouvement | Ce qui coince, mesuré | Déjà essayé | Solution prévue au prochain tour | Décision attendue de vous |
|---|---|---|---|---|
| **Rowing barre buste penché — test 3-5 reps (femme)** — 3 refus | la case de fin s'arrête à mi-tirage : barre à la hanche, coudes à 45°, jamais aux côtes | consigne exagérée (« barre TOUCHANT les côtes, coudes derrière le torse »), vert imposé aux deux cases, buste parallèle au sol | décrire l'arrivée par les AVANT-BRAS VERTICAUX et la barre sous la poitrine ; sinon générer la case fin seule en référence d'edit | **option** : si le 4ᵉ essai échoue encore, dites-moi si vous acceptez une arrivée barre au haut de l'abdomen comme critère de fin de tirage, ou si je dois rester aux côtes coûte que coûte |
| **Good morning debout (homme)** — 2 refus | de profil, la barre finit devant le cou ou DANS LES MAINS ; la vue de dos a réglé la case départ mais la case fin le montre debout barre aux mains | vue de profil, vue de dos, consigne « barre derrière le cou dans les deux cases » | vue de dos + consigne « la case de fin a le buste horizontal, les mains ne lâchent JAMAIS la barre posée sur le dos » | aucune |
| **Rowing haltère un bras (homme)** — 1 refus | le profil se RETOURNE entre les deux cases (saut de 180° dans l'animation) | consigne unilatérale complète (main d'appui, haltère seul) | ajouter « la tête regarde le MÊME côté de l'image dans les deux cases, le banc du même côté » | aucune |

Historique clos au lot 20 (solutions trouvées, ça ne coince plus) : back-extension-horizontal
(5 refus → marges explicites + bras croisés = accepté), back-squat-barre-haute (vert adducteurs
→ vert quadriceps imposé aux deux cases = accepté), back-squat-inertie-pause-complete et
good-morning côté barre (rack avant → **vue de dos** = barre sur le dos garantie),
curl-poulie-basse (cadrage → même échelle imposée = accepté), burpees (ordre des cases = accepté).

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
