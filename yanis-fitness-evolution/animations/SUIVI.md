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
| Animations nécessaires | **614** (périmètre HOMME + FEMME, voir ci-dessous) |
| Animations créées | 31 / **614** (POC 5 + L1 : 3 + L2 : 3 + L3 : 2 + L4 : 3 + L5 : 3 + A-01 : 3 + A-02 : 3 + A-03 : 3 + **A-01 FEMME : 3**) |
| Animations corrigées (option A) | 3 / 5 (dead bug rotation, gainage latéral, gainage latéral dyn.) |
| Fichiers dupliqués corrigés | 4 / 48 (1 fichier soldé, 1 quasi soldé) |
| Exercices du fichier bcdbe16aeafaafec.gif traités | 8 / 8 ✅ |
| Exercices du fichier 8de6e89e5395700c.gif traités | 6 / 7 |
| Exercices du fichier 666443484c7f0861.gif traités | 1 / 3 (pont fessier activation) |
| Lots livrés | POC (5) + L1 (3) + L2 (3) + L3 (2) + L4 (3) + L5 (3) + A-01 (3) + A-02 (3) + A-03 (3) + **A-01 FEMME (3)** |
| Versions femme produites | **3 / 307** |
| Thème A (échauffement) | 17 / 25 entrées · **8 restantes · 16 animations H+F** |
| Doublons sur les fichiers du chantier | 0 (35 empreintes md5 distinctes) |

## Passage au plan THÉMATIQUE (2026-10-06)

Le user a demandé d'organiser la suite des lots **par thème** (échauffement, musculation,
étirements, cardio, piscine) et non plus par fichier dupliqué.

Nouveau document de référence : **`animations/PLAN-THEMES.md`**, généré par
`scripts/build-plan-themes.py` depuis `inventaire.json`.

Répartition exacte (357 animations) :

| Thème | Contenu | Animations | Lots de 3 |
| --- | --- | --- | --- |
| **A** | Échauffement, mobilité & activation | 28 | 9 |
| **B** | Musculation (9 sous-thèmes par groupe musculaire) | 187 | 66 |
| **C** | Étirements & récupération | 81 | 19 |
| **D** | Cardio & transitions | 10 | 2 |
| **E** | Piscine & aqua | 51 | 12 |

Les lots POC → LOT 5 restent valides ; ils sont reclassés dans le plan thématique
(les abdominaux/gainage en thème A, les développés en thème B — pectoraux).

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

## LOT A-01 — ÉCHAUFFEMENT & ACTIVATION (`animations/themeA/`) — 2026-10-06

Premier lot du plan thématique. Trois exercices, trois positions chaînées
(départ → mi-course → finale, image source = position précédente), référence de
style `Screenshot_20261005_212714_Facebook.jpg`.

| Fichier | Exercice | Positions | Source technique |
| --- | --- | --- | --- |
| `mobilite-des-epaules-3poses.gif` | Mobilité des épaules | A = bras le long du corps · M = bras à l'horizontale · B = bras au-dessus de la tête | Cercles de bras : debout, pieds largeur d'épaules, bras tendus, petits cercles dont on augmente l'amplitude, puis inversion du sens ([croq-kilos](https://www.croq-kilos.com/actus/5-exercices-special-echauffement), [fitdistance](https://fitdistance.io/exercice-musculation/cercles-alternes-bras-echauffement)) |
| `pont-fessier-activation-3poses.gif` | Pont fessier au sol — activation | A = bassin au sol · M = bassin à mi-hauteur · B = ligne droite épaules-hanches-genoux | Pieds à plat largeur de hanche, genoux ~90°, pousser sur les talons, monter jusqu'à l'alignement épaules-hanches-genoux sans creuser les lombaires, contracter les fessiers 1-2 s en haut ([maboxdecross](https://maboxdecross.fr/mouvement/glute-bridge)) |
| `clamshell-elastique-3poses.gif` | Clamshell à l'élastique | A = genoux joints · M = ouverture à mi-hauteur (~30-40°) · B = ouverture maximale | Allongé sur le côté, hanches fléchies ~45°, genoux pliés, pieds superposés, élastique au-dessus des genoux, ouvrir le genou supérieur en rotation externe **sans faire basculer le bassin** ([handball-formation](https://handball-formation.fr/exercice-pour-fessier/), [saintdenis-dojo](https://www.saintdenis-dojo.fr/renforcement-moyen-fessier-exercices-conseils/)) |

Planche de montage : `themeA/LOT-A01-echauffement.gif` (3 colonnes animées, 1404×265).
Contrôle anti-doublon : 4 empreintes md5 distinctes, 0 doublon sur l'ensemble du chantier.

**Réserve honnête** : je ne peux pas voir les images générées (pas de vision sur ce
poste) — la validation visuelle appartient à l'utilisateur (règle 7). Les trois
dessins sont décrits ci-dessus tels qu'ils ont été demandés au générateur.

**Validation utilisateur (2026-10-06)** : LOT A-01 validé → feu vert pour le LOT A-02.

## LOT A-02 — ÉCHAUFFEMENT & ACTIVATION, suite (`animations/themeA/`) — 2026-10-06

| Fichier | Exercice | Positions | Source technique |
| --- | --- | --- | --- |
| `fire-hydrant-elastique-3poses.gif` | Fire hydrant à l'élastique | A = à quatre pattes, genou au sol · M = genou soulevé à mi-hauteur · B = genou à hauteur de hanche, cuisse parallèle au sol | À quatre pattes, mains sous les épaules, genoux sous les hanches, genou fléchi à 90° **qui ne change pas**, ouverture latérale jusqu'au parallélisme, **bassin qui ne bascule pas**, dos plat ([epicfitness](https://epicfitness.fr/sculptez-fessiers-fire-hydrant), [litobox](https://www.litobox.com/exercice-fire-hydrant)) |
| `squat-poids-du-corps-3poses.gif` | Squat au poids du corps | A = debout · M = genoux ~45° · B = cuisses parallèles au sol | Pieds largeur d'épaules, orteils légèrement dehors, poids sur les talons, descendre jusqu'à cuisses parallèles, genoux dans l'axe des orteils, buste droit ([fitdistance](https://fitdistance.io/exercice-musculation/squats-au-poids-du-corps)) |
| `fentes-arriere-pdc-3poses.gif` | Fentes arrière au poids du corps | A = debout · M = demi-descente · B = fente basse, genou arrière frôlant le sol | Grand pas **en arrière**, genou avant à l'aplomb de la cheville (tibia vertical), genou arrière descendant frôler le sol sans le toucher, buste droit et gainé ([magicfit](https://www.magicfit.fr/fente-arriere-musculation/), [fitnesce](https://fitnesce.fr/fente-arriere/)) |

Planche : `themeA/LOT-A02-echauffement.gif`. La planche A-01 a été régénérée avec le
même gabarit (colonnes espacées de 12 px) via `scripts/build-gif-lot.sh`.
Contrôle : 6 empreintes md5 distinctes en thème A, 0 doublon sur l'ensemble du chantier.

## LOT A-03 — ÉCHAUFFEMENT & ACTIVATION, suite (`animations/themeA/`) — 2026-10-06

| Fichier | Exercice | Positions | Source technique |
| --- | --- | --- | --- |
| `pompes-3poses.gif` | Pompes | A = planche haute, bras tendus · M = descente à mi-hauteur · B = poitrine à quelques cm du sol | Mains un peu plus larges que les épaules, **corps en ligne droite épaules → chevilles**, coudes à **~45° du buste** (pas en T), amplitude complète ([odyn](https://odyn.fr/pages/articles/pompes-debutants-guide-complet.php), [marbosport](https://www.marbosport.fr/Les-pompes-comment-bien-les-executer-et-quelles-variantes-choisir-blog-fre-1777531313.html)) |
| `gainage-planche-3poses.gif` | Gainage planche | A = planche haute sur les mains · M = transition, un avant-bras posé · B = planche complète sur les deux avant-bras, corps aligné | Coudes à l'aplomb des épaules, avant-bras parallèles, **ligne droite tête → épaules → hanches → talons**, abdominaux et fessiers contractés, hanches qui ne s'affaissent pas |
| `abduction-hanche-elastique-3poses.gif` | Abduction hanche à l'élastique (debout) | A = pieds joints · M = jambe écartée ~20° · B = abduction maximale ~40° | Élastique autour des **chevilles**, debout, jambe tendue écartée sur le côté **sans rotation des hanches ni du buste**, buste vertical, amplitude **30-45° maximum** (au-delà c'est le bassin qui bascule) ([mickaelconseillerlr](https://mickaelconseillerlr.fr/produit/abduction-debout-avec-elastique-renforcement-des-hanches-et-des-fessiers/), [magicfit](https://www.magicfit.fr/abducteurs-a-la-poulie-musculation/)) |

Planche : `themeA/LOT-A03-echauffement.gif`. 9 animations livrées en thème A,
0 doublon sur l'ensemble du chantier (32 empreintes md5 distinctes).

## LOT A-01 FEMME — ÉCHAUFFEMENT, mannequin femme (`animations/themeA/femme/`) — 2026-10-06

**Référence du personnage : `animations/REF-personnage-feminin.jpg`** (commitée dans le
dépôt par le user — elle survivra désormais aux resets du sandbox).

| Fichier | Exercice | Positions |
| --- | --- | --- |
| `femme/mobilite-des-epaules-3poses.gif` | Mobilité des épaules | A = bras le long du corps · M = à l'horizontale · B = au-dessus de la tête |
| `femme/pont-fessier-activation-3poses.gif` | Pont fessier au sol — activation | A = bassin au sol · M = mi-hauteur · B = ligne droite épaules-hanches-genoux |
| `femme/clamshell-elastique-3poses.gif` | Clamshell à l'élastique | A = genoux joints · M = ouverture ~30-40° · B = ouverture maximale |

Planche : `themeA/femme/LOT-A01F-echauffement-femme.gif`.
Convention de nommage retenue : `themeA/<exercice>-3poses.gif` = homme,
`themeA/femme/<exercice>-3poses.gif` = femme.

⚠️ **Le LOT A-04 (abduction assise, pallof press, face pull) a été perdu en cours de
route** : les positions A et M étaient générées mais les positions B ont été interrompues,
puis le reset du sandbox a effacé les fichiers intermédiaires. **À refaire depuis zéro.**

### Décisions prises le 2026-10-06

| Sujet | Décision |
| --- | --- |
| **Référence personnage femme** | `yanis-fitness-evolution/animations/REF-personnage-feminin.jpg`, commitée dans le dépôt (seul moyen de survivre aux resets — les uploads `/home/user/uploads/` sont effacés) |
| **Périmètre HOMME + FEMME** | **Tout le chantier en double** : chaque exercice, chaque étirement et chaque guide piscine existe en version Yanis (homme) **et** Émilie (femme). Total : **614 animations** (209×2 + 100 chrono + 29×2 + 19×2) |
| Organisation des lots | **Par thème** (A échauffement → B musculation → C étirements → D cardio → E piscine) |
| Terminer un thème avant le suivant | **Oui — consigne du user : finir le thème A (échauffement) avant d'attaquer le thème B** |
| Circuits du LOT 3 | **Animation composite en 3 phases** — les trois mouvements déroulés à la suite (≈ 9 images par circuit, 1 circuit par tour). À faire en fin de thème A |
| `developpe-incline-halteres` | ✅ **TRANCHÉ PAR LE USER** — **banc incliné 30°, prise neutre** (paumes face à face). À produire dans le thème B — pectoraux |

## Audit de conformité des animations existantes (2026-10-06)

Les 16 animations des lots POC → LOT 4 ont été recontrôlées image par image. Aucun
fichier n'est dupliqué (24 empreintes md5 toutes distinctes) et les 3 positions
(A → M → B) existent partout.
- Tous les fichiers multi-positions utilisent des frames partiellement optimisées :
  pour l'affichage, toujours passer par `convert x.gif -coalesce`.

### Option A — corrections appliquées (2026-10-06)

Technique vérifiée en ligne avant régénération (dead bug : bras et jambe opposés +
rotation du tronc pour les obliques, lombaires plaquées au sol ; planche latérale :
coude sous l'épaule, main libre sur la hanche, corps en ligne droite, hanches qui ne
s'affaissent pas).

| Fichier | Avant | Après |
| --- | --- | --- |
| `lot2/dead-bug-rotation-3poses.gif` | A = jambes tendues bras levés (retour au sol), M = crunch, B = allongé : rotation jamais montrée | A = dead bug (genoux 90°, bras au plafond), M = rotation du tronc avec bras étendu au-dessus de la tête et jambe opposée tendue, B = extension maximale |
| `lot1/gainage-lateral-3poses.gif` | A = planche sur avant-bras, M = bras levé, B = planche haute sur la main : incohérent | A = hanches basses (installation), M = hanches à mi-hauteur, B = ligne droite complète, main libre sur la hanche |
| `lot2/gainage-lateral-dyn-3poses.gif` | A et B visuellement identiques (même planche sur avant-bras) | A = hanches hautes (ligne droite), M = hanches descendues (creux), B = retour hanches hautes |

### Rester à corriger (option A, non terminée)

Le POC n'a pas pu être régénéré : plafond de 10 images IA atteint au 2ᵉ tour de
l'option A. À reprendre au prochain tour (3 images à produire, puis assemblage) :

- `poc/back-squat.gif` — départ cadré trop serré (torse seul) : régénérer la position A
  en pied, corps entier jusqu'aux semelles, barre complète dans le cadre.
- `poc/hip-thrust-barre.gif` — artefacts (planche coupée) : régénérer la position A
  avec banc et barre entièrement visibles, épaules contre le banc, hanches basses.
- `poc/souleve-de-terre-roumain.gif` — tête et pieds coupés + salissures : régénérer la
  position A debout, barre au contact des cuisses, corps entier dans le cadre.
- Les positions M et B seront chaînées depuis chaque nouvelle position A.

### Réserves non traitées

- **`lot3/circuit-gainage-3poses.gif`** et **`lot3/LOT3-circuits.gif`** montrent encore
  une planche frontale / latérale qui recoupe les exercices désormais corrigés. Le
  circuit ne déroule qu'une seule de ses trois positions (planche → latéral → bird dog) :
  à décider (animation composite en plusieurs phases ou découpage).
- **Artefacts résiduels** dans les lots 1 et 3 (bavures au-dessus des tapis).
