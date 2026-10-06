# Suivi du chantier « reconstruction des animations »

Règle : **1 exercice = 1 animation spécifique**. Aucun fichier partagé entre deux exercices.
Style validé : corps blanc argenté **mat**, très musclé, visage noir **sans traits**, casquette
blanche, short noir, baskets blanches, muscles actifs **jaune-orangé dorés**.
Décors : **terrasse bord de mer** (extérieur, tous les exercices au sol) et **piscine** (aquatique).
Interdit : salle de sport au parquet, mur intérieur, miroir.
Animation : **3 positions** (départ → mi-course → finale → retour → boucle), images chaînées.

## Compteur

| Élément | Valeur |
| --- | --- |
| Animations nécessaires (minimum) | 357 |
| Animations créées | 19 (POC 5 + L1 : 3 + L2 : 3 + L3 : 2 + L4 : 3 + L5 : 3) |
| Fichiers dupliqués corrigés | 4 / 48 (1 fichier soldé, 1 quasi soldé) |
| Exercices du fichier bcdbe16aeafaafec.gif traités | 8 / 8 ✅ |
| Exercices du fichier 8de6e89e5395700c.gif traités | 6 / 7 |
| Lots livrés | POC (5) + LOT 1 (3) + LOT 2 (3) + LOT 3 (2) + LOT 4 (3) + LOT 5 (3 inclinés) |

## Lots

- **POC** (`animations/poc/`) : back squat, développé couché barre, hip thrust barre,
  soulevé de terre roumain, nage douce (femme) — validés.
- **LOT 1** (`animations/lot1/`) : dead bug, bird dog, gainage latéral — les 3 premiers
  des 8 exercices qui partageaient `bcdbe16aeafaafec.gif`.
  Restent sur ce fichier : mountain climbers, dead bug avec rotation, circuit gainage,
  gainage latéral dynamique, circuit abdominaux.
- **LOT 2** (`animations/lot2/`) : mountain climbers, dead bug avec rotation,
  gainage latéral dynamique — trois nouveaux mouvements spécifiques.
- **LOT 3** (`animations/lot3/`) : circuit gainage (planche → latéral → bird dog) et
  circuit abdominaux (crunch → relevés de jambes → gainage) — 2 mouvements propres.
  Le fichier `bcdbe16aeafaafec.gif` est **entièrement remplacé (8/8)**.
- **LOT 4** (`animations/lot4/`) : développé haltères plat, développé haltères plat prise
  neutre, développé haltères décliné prise neutre — 3 des 7 exercices qui partageaient
  `8de6e89e5395700c.gif`. Écart assumé et documenté avec la référence du 2026-10-05 :
  ces trois mouvements se pratiquent allongé sur banc, donc sans tapis noir au sol, et le
  premier est montré prise classique (le nom de l'exercice ne précise pas de prise) ; le
  mannequin chaîne bien sa pose d'une image à l'autre, mais la prise de vue et le cadrage
  varient légèrement entre les trois premiers mouvements.
  Restent sur ce fichier : développé incliné haltères, développé haltères incliné 30°,
  développé haltères incliné 45° (départ), développé haltères incliné 45° prise neutre.
- **LOT 5** (`animations/lot5/`) : développé haltères incliné 30°, développé haltères
  incliné 45°, développé haltères incliné 45° prise neutre. Technique vérifiée en ligne
  avant génération : banc 30° = cible le haut des pectoraux, 45° = deltoïdes antérieurs
  davantage sollicités (l'angle est donc bien visible et distinct sur les animations) ;
  coudes à 45° du buste, omoplates serrées, haltères jamais entrechoqués en haut ;
  prise neutre = paumes face à face, coudes rentrés.
  Reste sur ce fichier : `developpe-incline-halteres` (aucun angle ni prise précisés —
  décision utilisateur requise, cf. question ouverte).
- **LOT 6** (à venir) : `e5532fe8fa9b40e9.gif` (6 soulevés de terre),
  `f1a40f2c8c8502db.gif` (5 mollets), `e169d622c8002b38.gif` (5 élévations latérales),
  puis les 43 autres fichiers dupliqués.

## Audit de conformité des animations existantes (2026-10-06)

Les 16 animations des lots POC → LOT 4 ont été recontrôlées image par image. Aucun
fichier n'est dupliqué (21 empreintes md5 toutes distinctes) et les 3 positions
(A → M → B) existent partout. Réserves relevées, à traiter en priorité avant
l'intégration dans l'application (phase 11) :

- **POC (`SHEET-POC`)** : cadrages souvent coupés (torse seul au squat, tête tronquée)
  et artefacts visuels nets sur `hip-thrust-barre.gif` (planche coupée) et
  `souleve-de-terre-roumain.gif` (tête et pieds coupés, salissures dans le décor).
- **Séquence la plus faible** : `lot2/dead-bug-rotation-3poses.gif` — le retour au sol
  est utilisé comme position A, la rotation n'est jamais montrée (A = jambes tendues
  bras levés, M = crunch, B = allongé) : ne respecte pas « départ → mi-course → finale ».
- **Doublons de concept** : `lot3/circuit-gainage-3poses.gif` et
  `lot2/gainage-lateral-dyn-3poses.gif` montrent la même chose (planche latérale) ;
  idem `lot1/gainage-lateral-3poses.gif`. Le circuit gainage ne montre que la planche
  frontale, alors que `lot3/LOT3-circuits.gif` affiche une autre planche latérale.
- **Artefacts résiduels** dans plusieurs lots 1 à 3 (bavures au-dessus des planches).
- Tous les fichiers multi-positions utilisent des frames partiellement optimisées :
  pour l'affichage, toujours passer par `convert x.gif -coalesce`.
