# Revue — carte d'alias livrée (pourquoi 114 exercices n'ont pas leur dessin)

**23 septembre 2026.** Extraction mécanique du bundle 1.4.0 signé, aucun correctif de production dans ce passage.

## Ce que fait l'application livrée

`eo` (carte utilisée par la fiche et l'aperçu) se construit ainsi : le dessin propre de l'exercice s'il existe (`gif`, niveau `exact`), sinon la **carte d'alias livrée** `Z4` (identifiant → nom d'un dessin existant, niveau `variante`), sinon une **recherche de similarité** (mots du nom + matériel partagé, seuil de score, niveau `famille`).

- **104 entrées d'alias** dans `Z4` ; **114 des 209 exercices n'ont aucun dessin propre**.
- Résolution livrée : **95 exacts**, **104 variantes**, **10 famille**.
- Triage par mots du nom (`alias-substitutions.json`, colonne `triage`) : **10** noms équivalents, **79** avec un mot commun, **25 sans aucune relation de nom**.

## Les 25 alias sans relation de nom

`pont-fessier-au-sol-activation` → Glute bridge pieds sur banc · `step-up-sur-banc-hauteur-du-genou` et `step-up-haut` → Fentes avant alternées · `clamshell-a-l-elastique` → Abduction assise (machine ou élastique) · `fire-hydrant-a-l-elastique` → Abduction hanche debout à la poulie · `triceps-extensions-halteres-banc-plat`, `extensions-triceps-halteres-plat`, `extensions-triceps-halteres-incline` → French press barre EZ · `tractions-pull-up`, `lean-away-pull-ups` → Tirage vertical prise large · `tractions-supination-chin-up` → Tirage vertical prise neutre · `pullover-cable-bras-tendus`, `pullover-haltere-plat` → Tirage vertical prise pronation · `barre-au-front-pushdown-triceps`, `california-press-barre-au-cou` → Extensions triceps barre EZ · `good-morning-debout` → Soulevé de terre roumain barre · `glute-ham-raise` → Leg curl allongé · `ab-wheel-roulette` → Jackknife sur swiss ball · `wood-chop-poulie-haute` → Crunch à la poulie · `mobilite-des-epaules` → Bird dog · `respiration-diaphragmatique` → Dead bug · `rowing-a-l-elastique` → Tirage horizontal à la poulie · `drop-lunges-*` → Fentes arrière alternées · `fentes-bulgares-halteres-pied-avant-sureleve` → Bulgarian split squat.

Ce triage **n'est pas** une décision de revue : un alias proche par le mot peut rester faux (matériel, position, orientation) et un alias « sans relation » peut être la meilleure source disponible. Chaque identifiant reste à revoir individuellement — **aucun groupe n'est clos par un alias**.

## Revue individuelle des 25 alias sans relation de nom (cette étape)

Pour chaque identifiant : matériel déclaré, motif, preuve image, décision — `review/alias-review.json`. **Aucun groupe n'est fermé, aucun visuel n'est créé.**

| Décision | Nombre | Exemples |
|---|---|---|
| Écart confirmé, laissé ouvert | 19 | glute ham raise → « Leg curl allongé » · wood chop → « Crunch à la poulie » · pullovers → « Tirage vertical » · ab wheel → « Jackknife sur swiss ball » · tractions → « Tirage vertical assis » · clamshell → « Abduction assise machine » · fire hydrant → adduction debout à la poulie · rowing élastique → tirage horizontal poulie · mobilité épaules → planche latérale · respiration diaphragmatique → dead bug · drop lunges → fente arrière barre · extensions triceps haltères → poulie debout |
| Variante inversée | 1 | fentes bulgares haltères dites « pied avant surélevé » alors que le dessin surélève le **pied arrière** |
| Ambiguïté de libellé | 1 | « Barre au front (pushdown triceps) » : le dessin est une extension debout barre EZ au-dessus de la tête — ni barre au front, ni pushdown. À trancher avant toute association, sans réécrire la prescription |
| Proche mais distinct | 1 | good morning → charnière de hanches réelle mais **barre en mains** (dessin du soulevé de terre roumain) |
| Refus de remplacement | 2 | step-up sur banc et step-up haut : le seul vrai dessin de step-up tient **deux haltères** alors que les deux prescriptions sont au poids du corps |
| Corrigé par la réassociation revue | 1 | pont fessier au sol — activation (candidat) |

### Fait marquant

**16 des 17 dessins cibles sont déjà le visuel propre d'un autre exercice du catalogue** : l'application affiche, pour un exercice, le dessin d'un autre. Remplacer suppose de **créer** les visuels manquants (matériel et position exacts) puis de les vérifier — pas de substituer par famille ni par mot-clé.

### Ce qui a été relu ici

5 dessins, 10 images (`review/alias-target-frames.json`) : good morning (barre en mains, charnière dos plat), leg curl allongé (appareil, chevilles sous coussins), crunch à la poulie (à genoux, poignée derrière la tête, flexion de tronc), tirage vertical (assis, barre large, vue de face), jackknife sur swiss ball (planche sur ball). Grossissements : `review/alias-decisions-25-pass2.png`, `review/alias-elastic-*.png` (12 images chacune), `review/alias-stepup-candidate-12frames.png`.

### Couverture réelle des dessins

94 GIF livrés = 46 relus au lot long + 13 au lot court + **35 jamais relus**. Aucune revendication « tous les exercices ont leur visuel » n'est possible avant ces 35. Voir `review/REVIEW-ILLUSTRATIONS.md` pour l'état des familles de dessins avant toute nouvelle illustration.
