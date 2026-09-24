# Règle de style — mesurée dans le pack livré (23 septembre 2026)

## ⛔ DÉCISION DE L'UTILISATEUR — 24 septembre 2026 : famille C REFUSÉE

> « la famille c est nulle en terme de rendu ne change rien, garde comme c'était AVANT — dessin livré (1.4.6) … on est en train d'enlaidir l'application. je ne veux pas d'image de la famille c »

Conséquences, appliquées immédiatement :

1. **Aucune image de la famille C** dans l'application, à aucun endroit.
2. **Les quatre écarts d'étirement restants conservent le visuel livré** : mollet en escalier, adduction debout, mains croisées derrière le dos, fléchisseurs de l'avant-bras. Aucune création.
3. **Aucune création d'image n'est autorisée** — ni Tabata, ni piscine, ni musculation. Les mouvements sans démonstration dédiée gardent le visuel livré.
4. **Seuls des échanges entre dessins déjà livrés** (familles A et B) restent possibles, et uniquement sur décision explicite. C'est ce qui a été fait dans la 1.4.6 pour « Pigeon assis » et « Main dans le dos ».
5. La proposition de témoin (SVG famille C pour « Mollet en escalier ») est **retirée du dépôt**.

Le reste de ce document reste la **mesure** du pack existant ; il ne propose plus de création.

Document de travail à valider. **Rien n'a été créé.** Toutes les valeurs ci-dessous
sont **mesurées** sur le paquet 1.4.0 (137 ressources, 76 dessins utilisés par les
209 exercices) et sur le paquet web livré. Mesures détaillées : `STYLE-METRICS.json`.

## Ce que le pack contient réellement : trois familles, pas une

| Famille | Nombre | Format | Images | Fond | Encre | Marges (g/haut/dr/bas) | Détail mesuré |
|---|---|---|---|---|---|---|---|
| **A — fil de fer** | **36** | 300 × 300 | **12 images** (boucle) | **blanc** (`#ffffff` sur 90,6 % des pixels) | noir (`#020202`) | **43 / 30 / 25 / 15 px** | trait médian **3 px** (2 px et 3 px les plus fréquents), sujet centré |
| **B — rendu réaliste** | **40** | variable : 440 × 240 (22), 246 × 440 (7), 403 × 440 (5), 480 × 262 (2), 329/440… | **2 images** (deux postures) | quasi blanc | descriptif | **0 / 0 / 1 / 1 px** (plein cadre) | ≈ 128 couleurs par image |
| **C — SVG animé intégré** | **144** (dans le paquet web) | `viewBox 0 0 120 100`, adaptatif | animation CSS **3 s en boucle** | **sombre** `#0a0e1a` | traits `#0f172a`, peau `#e8b896` / `#f0c8a8`, vêtement `#1e293b` | sujet centré | même code que l'interface, suit le thème |

Les trois familles **coexistent déjà** dans l'application : ce ne sont pas des
propositions, ce sont les styles réellement livrés.

## Règle mesurée (le choix de création est refusé : voir la décision en tête)

1. **Un nouveau visuel rejoint la famille du contexte**, jamais une quatrième :
   - **Tabata** (écran de chrono sombre, 34 mouvements sans démonstration) → famille **C**, celle des animations déjà intégrées à l'interface ;
   - **piscine** (5 guides sans dessin valide) → famille **C** ou **A**, au choix, mais **une seule** pour les cinq, jamais un dessin terrestre ;
   - **musculation** (27 écarts de variante) → famille de l'exercice concerné : **A** s'il est déjà servi par un fil de fer (poulie, élastique, poids du corps), **B** s'il est servi par un rendu réaliste (machine, banc) ;
   - **étirements** (4 écarts) → famille **B**, celle de tous les dessins d'étirement actuels.
2. **Gabarit identique à la famille** : mêmes dimensions, même fond, même épaisseur de trait (A : 300 × 300, blanc, 3 px), même cadrage (A : marges 43/30/25/15 ; B : plein cadre).
3. **Animation complète et en boucle** : A = 12 images montrant le mouvement entier ; C = boucle CSS 3 s ; jamais une image fixe présentée comme une démonstration.
4. **Une seule modification à la fois**, prouvée par capture avant/après, avec l'état enregistré inchangé (règle déjà appliquée aux quatre corrections livrées).
5. **Jamais** : remplacer un visuel correct, réécrire une consigne, réutiliser un dessin terrestre pour un exercice aquatique, ni fermer un groupe sans essai sur téléphone.

## Ce que la règle ne décide pas (votre choix)

- **Famille A ou C** pour les cinq guides aquatiques et les 34 mouvements de Tabata : **tranché le 24 septembre 2026 — ni l'une ni l'autre, aucune création**.
- **Priorité de production**, si création autorisée : (1) les 4 étirements, (2) les 5 guides piscine, (3) les 34 Tabata, (4) les 27 variantes de musculation.
- **Programme de contrôle** : pour toute création, une **planche avant/après** en pleine image, un parcours de test qui échoue sur la version livrée et réussit sur la nouvelle, et la mention explicite « non validé sur téléphone » tant que l'essai réel n'a pas eu lieu.

## Volumétrie, conservée pour mémoire (aucune production autorisée)

| Manque | Nombre | Famille visée | Effort |
|---|---|---|---|
| Mouvements de Tabata au sol sans démonstration | **34** | C (boucle 3 s) | le plus gros lot |
| Variantes de musculation sans dessin fidèle | **27** | A ou B selon l'exercice | lot intermédiaire |
| Guides aquatiques sans dessin valide | **5** | C ou A | petit lot |
| Étirements sans dessin correspondant | **4** | B | petit lot |

**Aucune de ces corrections n'est faisable avec un visuel déjà présent dans le
pack** : c'est mesuré dans `GAPS-SANS-DESSIN.json`. Pour les étirements, deux des
six écarts ont déjà été réparés (1.4.6) parce que les dessins corrects existaient ;
les quatre restants n'ont aucun équivalent.
