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
| Animations créées | 43 / **614** (POC 5 + L1 : 3 + L2 : 3 + L3 : 2 + L4 : 3 + L5 : 3 + A-01 : 3 + A-02 : 3 + A-03 : 3 + A-01 FEMME : 3 + A-02 FEMME : 3 + A-03 FEMME : 3 + **R1 FEMME : 3** (dead bug, bird dog, gainage latéral) + **R2 FEMME : 3** (mountain climbers, dead bug rotation, gainage latéral dyn.)) |
| Animations corrigées (option A) | 3 / 5 (dead bug rotation, gainage latéral, gainage latéral dyn.) |
| Animations femme à reprendre | **3** (A-02F fire hydrant M/B, A-02F squat M — voir § LOT A-02 FEMME ; + A-03F abduction B trop proche de M, voir § LOT A-03 FEMME) |
| Fichiers dupliqués corrigés | 4 / 48 (1 fichier soldé, 1 quasi soldé) |
| Exercices du fichier bcdbe16aeafaafec.gif traités | 8 / 8 ✅ |
| Exercices du fichier 8de6e89e5395700c.gif traités | 6 / 7 |
| Exercices du fichier 666443484c7f0861.gif traités | 1 / 3 (pont fessier activation) |
| Lots livrés | POC (5) + L1 (3) + L2 (3) + L3 (2) + L4 (3) + L5 (3) + A-01 (3) + A-02 (3) + A-03 (3) + **A-01 FEMME (3)** + **A-02 FEMME (3)** + **A-03 FEMME (3)** |
| Versions femme produites | **15 / 307** |
| Thème A (échauffement) | 17 / 25 entrées en **homme**, **15 / 25 en femme** · reste **8 entrées jamais produites** (A-04 : 3, A-05 : 2, A-08 : 2, A-09 : 1) à faire en **H + F**, et **les 2 circuits** à refaire en version composite (H) et à créer (F) — **LOT 3 F : circuit gainage 8/9 positions (drapeau rouge 10 images), circuit abdominaux à venir** |
| Doublons sur les fichiers du chantier | 0 (57 GIF + 30 PNG, toutes empreintes md5 distinctes) |

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

## LOT A-02 FEMME — ÉCHAUFFEMENT, mannequin femme (`animations/themeA/femme/`) — 2026-10-06

Versions **femme** des trois entrées du LOT A-02, chaînées depuis
`animations/REF-personnage-feminin.jpg` (identité) + une frame du LOT A-01 FEMME
(décor terrasse, cadrage, tapis noir).

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `femme/fire-hydrant-elastique-3poses.gif` | Fire hydrant à l'élastique | A = à quatre pattes, genou au sol (+ élastique au-dessus des genoux) · M = genou soulevé · B = jambe haute | ⚠️ **M et B à refaire** (voir ci-dessous) |
| `femme/squat-poids-du-corps-3poses.gif` | Squat au poids du corps | A = debout, bras tendus devant · M = mi-descente · B = squat bas | ⚠️ **M à refaire** (trop proche du A) |
| `femme/fentes-arriere-pdc-3poses.gif` | Fentes arrière au poids du corps | A = debout, mains sur les hanches · M = jambe arrière posée, demi-descente · B = fente basse, genou arrière au sol | ✅ conforme |

Planche : `themeA/femme/LOT-A02F-echauffement-femme.gif` (1420×265).
Contrôle anti-doublon : 45 fichiers GIF dans le chantier, 45 empreintes md5 distinctes,
0 doublon.

### 🔎 Nouveauté de méthode — l'agent VOIT désormais les images

Contrairement aux tours précédents (réserve « l'agent ne voit pas les images »),
l'agent a pu **contrôler visuellement** les 9 images générées et les GIF déjà livrés.
Ce contrôle a révélé les défauts ci-dessous : c'est précisément ce qui a permis de les
identifier au lieu de les livrer en silence.

### Réserves honnêtes de ce lot (2 animations sur 3)

1. **`femme/fire-hydrant-elastique-3poses.gif` — M et B non conformes.**
   La technique demandée (vérifiée en ligne) est une **abduction latérale** : genou
   fléchi à 90° **constant**, mouvement issu uniquement de la hanche, montée latérale
   jusqu'à hauteur de hanche maximum, bassin qui ne bascule pas
   ([callisthenie-corner](https://www.callisthenie-corner.fr/fire-hydrant/),
   [epicfitness](https://epicfitness.fr/sculptez-fessiers-fire-hydrant),
   [my15minutechallenge](https://www.my15minutechallenge.com/exercices/fire-hydrants/)).
   Sur les images obtenues, le mouvement se lit comme une **extension de jambe vers
   l'arrière** (proche d'un donkey kick), le genou ne reste pas à 90° et la plante du
   pied ne regarde pas vers l'arrière. → à régénérer.
2. **`femme/squat-poids-du-corps-3poses.gif` — position M (mi-course) insuffisante.**
   La mi-descente est trop proche du départ (quasi debout) : l'amplitude ne se lit pas.
   Régénérée une fois dans la limite des 10 images du tour, le résultat reste trop
   proche du A. À refaire.
   *À noter, honnêtement :* la version **homme** du même squat (`themeA/squat-poids-du-corps-3poses.gif`,
   livrée au LOT A-02) présente la même faiblesse d'amplitude en position finale — la
   position B est un demi-squat, les cuisses n'atteignent pas le parallèle annoncé.
   Comme la règle 2 interdit de remplacer une animation livrée sans accord, elle n'a
   **pas** été touchée : accord du user à demander.
3. **Cadrages** : le générateur change légèrement d'angle et d'échelle d'une position à
   l'autre (le squat passe d'une vue de face à une vue de dos puis de profil). La
   boucle reste lisible, mais ce n'est pas parfaitement stable.

### Fichiers de reprise conservés dans git (pour ne pas repayer 6 images)

`themeA/femme/_sources/A-02F/` contient les **6 positions saines** (fire hydrant A,
squat A et B, fentes A/M/B) en PNG 920×514. Au prochain tour, seules **3 images**
seront à régénérer (fire hydrant M, fire hydrant B, squat M) au lieu de 9.
Ce dossier est un **atelier temporaire** : il sera supprimé une fois les 2 animations
corrigées. Le LOT A-03 FEMME applique la même règle avec son propre atelier
`themeA/femme/_sources/A-03F/` (9 positions PNG 1376×768).

## LOT A-03 FEMME — ÉCHAUFFEMENT, mannequin femme (`animations/themeA/femme/`) — 2026-10-06

Versions **femme** des trois entrées du LOT A-03 (pompes, gainage planche, abduction
hanche), chaînées depuis `animations/REF-personnage-feminin.jpg` pour l'identité, puis
image à image (A → M → B) comme le veut la méthode : chaque position est générée depuis
la précédente, dans une seule session de génération (cadrage, lumière et décor restent
donc stables d'une position à l'autre).

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `femme/pompes-3poses.gif` | Pompes | A = planche haute bras tendus · M = descente bras ~45° du buste · B = poitrine à quelques cm du tapis | ✅ conforme |
| `femme/gainage-planche-3poses.gif` | Gainage planche | A = planche haute sur les mains · M = un avant-bras posé (asymétrie visible) · B = planche complète sur les deux avant-bras | ✅ conforme |
| `femme/abduction-hanche-elastique-3poses.gif` | Abduction hanche à l'élastique | A = debout, pieds joints, élastique aux chevilles · M = jambe écartée ~20° · B = abduction ~40° | ⚠️ **B trop proche de M** (écart RMSE 0,029) |

Planche : `themeA/femme/LOT-A03F-echauffement-femme.gif` (1420×265).
Contrôle anti-doublon : 64 fichiers GIF/PNG dans le chantier, 64 empreintes md5
distinctes, **0 doublon**.
Sources de reprise conservées : `themeA/femme/_sources/A-03F/` (les 9 positions PNG
1376×768, pour corriger l'abduction B avec **1 seule** image au prochain tour).

### Réserve honnête de ce lot (1 animation sur 3)

- **`femme/abduction-hanche-elastique-3poses.gif` — position B trop proche de M.**
  La jambe est bien écartée à la mi-course ; la position finale n'ajoute presque rien
  (mesure objective : RMSE 0,029 entre M et B, contre 0,104 entre des positions
  réellement différentes). La technique est en revanche respectée : buste vertical,
  mains sur les hanches, bassin qui ne bascule pas, élastique aux chevilles, amplitude
  dans la fourchette 30-45° recommandée
  ([mickaelconseillerlr](https://mickaelconseillerlr.fr/produit/abduction-debout-avec-elastique-renforcement-des-hanches-et-des-fessiers/)).
  → **1 image à régénérer** au prochain tour (accord user demandé, règle 2).
- **Pompes FEMME** : générateur utilisé pour la *mi-course* d'un exercice totalement
  différent (gainage planche) — il a rendu une image quasi identique au départ. Régénérée
  avec une consigne d'asymétrie explicite (« un bras tendu / l'autre sur l'avant-bras »),
  la version retenue est correcte. **2 images payées** pour cette position (comptées dans
  le budget du tour).
- **Style** : conforme (corps argenté mat, visage noir sans traits, casquette, tresse,
  tenue noire, baskets blanches, terrasse bord de mer, tapis noir, muscles dorés).
  À noter, la paire de lunettes de soleil apparue sur certaines frames du fire hydrant
  (LOT A-02 FEMME) **n'est pas réapparue** ici.

### 📊 Budget d'images IA de ce tour : 10 / 10 (drapeau rouge)

3 positions de pompes + 2 positions de gainage planche (1 échec) + 3 positions
d'abduction hanche = **8 images utiles + 1 image ratée rejouée = 10 images**.
La position B de l'abduction a été payée mais n'apporte pas l'amplitude attendue : elle
n'est **pas** masquée dans le compteur, elle est signalée ci-dessus.

## LOT R1 FEMME — RATTRAPAGE DU LOT 1 (dead bug, gainage latéral) — 2026-10-07

Consigne du user : **rattraper l'homme côté femme** pour qu'ensuite les deux avancent au
même rythme. Les 3 exercices du **LOT 1** n'existaient qu'en version homme
(`animations/lot1/`). Versions femme chaînées depuis `REF-personnage-feminin.jpg`
(identité) + une frame du LOT A-03 FEMME (décor terrasse, cadrage, tapis noir).

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `femme/dead-bug-3poses.gif` | Dead bug | A = bras verticaux, genoux à 90° · M = bras droit abaissé à 45°, jambe gauche tendue · B = extension complète bras/jambe opposés | ✅ conforme |
| `femme/gainage-lateral-3poses.gif` | Gainage latéral | A = hanches basses (installation), flanc au sol · M = hanches à mi-hauteur, pente douce · B = ligne droite complète, main libre sur la hanche | ✅ conforme |
| `femme/bird-dog-3poses.gif` | Bird dog | A = quatre pattes, dos plat · M = bras tendu vers l'avant à mi-hauteur · B = bras à l'horizontale + jambe opposée tendue | ✅ conforme (B produite le 2026-10-07) |

Planche : `themeA/femme/LOT-R1F-rattrapage-lot1-femme.gif` — **complète le 2026-10-07** (1420×265,
3 colonnes : dead bug + bird dog + gainage latéral).

### 🔴 Drapeau rouge — 10 / 10 images IA

Ce tour a payé **10 images** : dead bug A + M + B (3), bird dog A + M (2),
gainage latéral (3 positions utiles + **2 images rejouées**). Le **bird dog B** est resté
hors budget : l'exercice est livré **incomplet et signalé comme tel**, jamais masqué.
Les 9 positions sont conservées dans `themeA/femme/_sources/LOT1F/` (PNG 1376×768).
✅ **Lot 1 FEMME désormais complet (3/3).**

### Deux images rejouées — détail honnête

1. **Gainage latéral, position A** : la 1ʳᵉ image est revenue en **planche haute**
   (appui sur la main, hanches levées, brassière rendue blanche) alors que A doit être
   l'installation hanches au sol. La 2ᵉ tentative est revenue en **planche moyenne**
   (hanches décollées de ~20 cm). Elle a été **recyclée en position M** au lieu d'être
   jetée. Une 3ᵉ génération (paysage) a donné la **ligne droite complète** → position B.
   *Résultat : cadrage et style parfaitement cohérents sur les 3 frames, mais la
   position A reste une « hanches basses / installation » plutôt qu'un corps
   parfaitement allongé au sol — exactement la même convention que la version HOMME
   validée (`lot1/gainage-lateral-3poses.gif` : A = hanches basses). Réserve assumée.*
2. **Gainage latéral, position M** : 1ʳᵉ tentative revenue en **format portrait**,
   inexploitable pour une boucle en paysage (rupture d'échelle entre les frames).
   → régénérée en paysage.

Les 2 images rejouées sont **comptées** dans le budget du tour, pas dissimulées.

### Technique vérifiée en ligne avant génération

- **Dead bug** : allongé sur le dos, bras perpendiculaires au sol, genoux à 90°,
  **bras et jambe OPPOSÉS** étendus simultanément, **lombaires plaquées au sol** du début
  à la fin, descente lente, amplitude maximale *avec* lombaires collées
  ([lateliergym](https://lateliergym.fr/dead-bug-abdos-profonds-guide/),
  [jemeremetsausport](https://jemeremetsausport.com/dead-bug/),
  [callisthenie-corner](https://www.callisthenie-corner.fr/dead-bug/)).
- **Gainage latéral** : allongé sur le côté, jambes tendues et superposées, **coude sous
  l'épaule**, montée du bassin jusqu'à la **ligne droite cheville-hanche-épaule**, **main
  libre sur la hanche**, cage thoracique tournée vers l'avant (pas vers le sol), bassin
  qui ne s'affaisse pas
  ([magicfit](https://www.magicfit.fr/la-planche-laterale-musculation/),
  ([callisthenie-corner](https://www.callisthenie-corner.fr/planche-laterale/)),
  [jemeremetsausport](https://jemeremetsausport.com/planche-laterale/)).

### Contrôle objectif des positions

| Comparaison | RMSE normalisé | Lecture |
| --- | --- | --- |
| dead bug A → M | 0,050 | mouvement lisible |
| dead bug M → B | 0,052 | mouvement lisible |
| gainage latéral A → M | 0,040 | mouvement lisible |
| gainage latéral M → B | 0,154 | mouvement très lisible |

(seuil retenu : > 0,030 = les deux positions se distinguent ; les positions déclarées
« trop proches » aux lots précédents mesuraient 0,029.)

Contrôle anti-doublon : **52 GIF** et **23 PNG** dans le chantier, **toutes les
empreintes md5 distinctes, 0 doublon**. Les GIF femme et homme d'un même exercice ne
partagent évidemment aucune empreinte (mannequins différents).

### Réserve de style

Le générateur a rendu la **brassière blanche/argentée** sur les tentatives ratées du
gainage latéral ; les 3 frames retenues montrent bien une brassière **noire**. À
surveiller : la brillance du corps varie un peu d'une frame à l'autre (le code impose un
argenté **mat**).



## LOT R2 FEMME — RATTRAPAGE DU LOT 2 — 2026-10-07 (terminé le même jour)

Versions **femme** des exercices du **LOT 2** (mountain climbers, dead bug avec rotation,
gainage latéral dynamique), chaînées depuis `REF-personnage-feminin.jpg` (identité) + une
frame du LOT A-03/R1 FEMME (décor, cadrage, tapis noir).

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `femme/mountain-climbers-3poses.gif` | Mountain climbers | A = planche haute stricte · M = genou droit ramené à mi-course, pied décollé · B = genou droit aux pectoraux | ✅ conforme |
| `femme/dead-bug-rotation-3poses.gif` | Dead bug avec rotation | A = mort, genoux 90°, bras verticaux · M = bras droit vers l'arrière + jambe gauche tendue · B = extension complète bras/jambe opposés | ✅ conforme |
| `femme/gainage-lateral-dyn-3poses.gif` | Gainage latéral dynamique | A = hanches hautes (ligne droite) · M = bassin descendu (creux) · B = retour hanches hautes | ✅ conforme (même convention que la version HOMME validée) |

Planche : `themeA/femme/LOT-R2F-rattrapage-lot2-femme.gif` (**1420×265, 3 colonnes**).
✅ **Lot 2 FEMME désormais complet (3/3).**
Convention retenue pour le gainage latéral dynamique : identique à la version HOMME
validée (A = hanches hautes, M = creux, B = retour hanches hautes) — le retour à la
position haute est mesuré à 0,038 entre A et B, ce qui est normal et attendu pour un
mouvement cyclique.

### Budget d'images IA — 2 tours, aucune image perdue en silence

- **Tour du 2026-10-07 (1ᵉʳ)** : 10 / 10 images. bird dog B (fin du lot 1) + mountain
  climbers A/M/B + dead bug rotation A/M + gainage latéral dyn. A + 3 images rejouées.
  → 3 positions manquaient, elles ont été annoncées comme telles, pas masquées.
- **Tour du 2026-10-07 (2ᵉ)** : **4 images** (dead bug rotation B, gainage latéral dyn.
  M et B + 1 régénération après interruption du tour par le user). Les 3 positions
  manquantes sont produites → **lot 2 FEMME complet**.

⚠️ Rappel de la règle vitale : le tour interrompu a été balayé par le reset du sandbox
(les images non commitées ont disparu) — elles ont été régénérées et **commitée
immédiatement**. Ne jamais travailler plus longtemps que nécessaire sans committer.

### Images rejouées (comptées, pas cachées)

1. **dead bug rotation M** : 1ʳᵉ image revenue en **portrait** (832×1275) et avec le
   **corps pivoté en bloc** (le buste se redresse au lieu de rester au sol) → refaite en
   paysage avec consigne explicite « corps allongé à l'horizontale, seule la torsion du
   tronc change ». 2ᵉ essai conforme.
2. **dead bug rotation M (génération)** : 1 erreur technique du générateur
   (`Response contains no images`) → relancée, comptée.
3. **gainage latéral dyn. M** : l'image reçue montrait un **exercice allongé sur le dos**
   au lieu de la planche latérale hanches basses → supprimée, **pas** intégrée.

### Technique vérifiée en ligne avant génération

- **Mountain climbers** : position de planche stricte, mains sous les épaules, **hanches
  basses** (l'erreur n°1 est de laisser monter le bassin), genou ramené **franchement**
  vers la poitrine (pas de demi-flexion), dos plat, bassin stable
  ([gym-studio](https://www.gym-studio.com/exercices/mountain-climbers),
  [jemeremetsausport](https://jemeremetsausport.com/mountain-climber-2/),
  [homefittraining](https://homefittraining.fr/entrainement/exercices/les-mountain-climbers/)).
- **Dead bug avec rotation** : même base que le dead bug — lombaires plaquées au tapis,
  bras et jambe opposés — la **rotation du tronc** ajoute le travail des obliques sans
  décoller le dos
  ([callisthenie-corner](https://www.callisthenie-corner.fr/dead-bug/),
  [lateliergym](https://lateliergym.fr/dead-bug-abdos-profonds-guide/)).
- **Gainage latéral dynamique** : planche latérale (main sous l'épaule, corps aligné)
  avec **descente puis remontée contrôlées du bassin** ; l'erreur à ne pas montrer est
  un bassin durablement affaissé
  ([magicfit](https://www.magicfit.fr/la-planche-laterale-musculation/),
  [jogetjim](https://www.jogetjim.fr/gainage-lateral/)).

### Contrôle objectif

| Comparaison | RMSE normalisé |
| --- | --- |
| mountain climbers A → M | 0,144 |
| mountain climbers M → B | 0,043 |
| dead bug rotation A → M | 0,090 |
| dead bug rotation M → B | 0,072 |
| gainage latéral dyn. A → M | 0,095 |
| gainage latéral dyn. M → B | 0,094 |
| gainage latéral dyn. A → B | 0,038 *(retour en position haute — attendu)* |

(seuil de lisibilité : > 0,030.) Anti-doublon : **0 doublon** sur les 57 GIF du chantier.

### Réserve de style (à surveiller)

Le générateur rend parfois le corps **brillant** (proche du chromé) et non l'argenté
**mat** du code visuel — visible sur les frames du mountain climbers. Aucun autre écart
d'identité relevé : brassière et short noirs, casquette blanche, tresse, baskets
blanches, décor terrasse bord de mer, tapis noir.

## LOT 3 FEMME — CIRCUIT GAINAGE (en cours) — 2026-10-07

**Objectif du lot (décision user § 7.2 de la passation) :** les circuits ne sont plus des
animations à une seule position mais des **animations COMPOSITES en 3 phases** : les trois
mouvements du circuit sont déroulés à la suite dans une seule animation, chaînés image par
image (≈ 9 images par circuit → **1 circuit par tour**).

**Découpage retenu pour `circuit-gainage` (planche → gainage latéral → bird dog) :**
9 positions chaînées, chacune produite depuis la précédente, en FEMME.

| # | Phase | Position | Fichier source | Statut |
| --- | --- | --- | --- | --- |
| 1 | Planche | A — installation à genoux, avant-bras au sol | `_sources/LOT3F/circuit-gainage-P1-A.png` | ✅ |
| 2 | Planche | M — jambes qui s'allongent, hanches à mi-course | `_sources/LOT3F/circuit-gainage-P1-M.png` | ✅ |
| 3 | Planche | B — planche complète sur avant-bras, ligne droite | `_sources/LOT3F/circuit-gainage-P1-B.png` | ✅ |
| 4 | Gainage latéral | A — sur le flanc gauche, avant-bras au sol, hanches basse | `_sources/LOT3F/circuit-gainage-P2-A.png` | ✅ |
| 5 | Gainage latéral | M — bassin à mi-hauteur | `_sources/LOT3F/circuit-gainage-P2-M.png` | ✅ |
| 6 | Gainage latéral | B — hanches hautes, ligne droite chevilles-épaules | `_sources/LOT3F/circuit-gainage-P2-B.png` | ✅ |
| 7 | Bird dog | A — à quatre pattes, dos plat | `_sources/LOT3F/circuit-gainage-P3-A.png` | ✅ |
| 8 | Bird dog | M — bras droit qui s'allonge vers l'avant | `_sources/LOT3F/circuit-gainage-P3-M.png` | ✅ |
| 9 | Bird dog | B — bras droit + jambe gauche tendus à l'horizontale | — | ⬜ **drapeau rouge** |

**Planche de travail (8/9) :** `themeA/femme/_sources/LOT3F/PLANCHE-TRAVAIL-LOT3F-circuit-gainage.png`
— affichée au user pour son œil (règle 7). La 9ᵉ position étant absente, cette planche est
un **aperçu de travail**, pas la planche de livraison.

### Budget d'images IA du tour — 10 / 10, aucune image perdue en silence

| Image | Résultat |
| --- | --- |
| P1-A (départ, depuis la référence d'identité + une frame du LOT R2F) | ✅ conforme |
| P1-M (essai 1) | ❌ revenue en **planche sur les mains (bras tendus)** alors que la position A est sur les avant-bras → écartée, non intégrée |
| P1-M (essai 2) | ✅ conforme (même appui des avant-bras que A) |
| P1-B | ✅ conforme (planche complète sur avant-bras) |
| P2-A | ✅ conforme (flanc gauche, hanches basses) |
| P2-M (essai 1) | ❌ erreur technique du générateur : `Response contains no images` → relancée |
| P2-M (essai 2) | ✅ conforme |
| P2-B | ✅ conforme (hanches hautes) |
| P3-A | ✅ conforme (quatre pattes) |
| P3-M | ✅ conforme (bras qui part vers l'avant) |
| P3-B | 🚫 **refusée par la limite technique** : `Image generation limit of 10 reached for this turn` |

**11 appels au total** (8 images retenues + 1 image écartée + 1 erreur générateur + 1 refus
par la limite). Le drapeau rouge est technique : il ne dit rien de la qualité des images.

### Contrôle objectif des positions retenues (avant assemblage)

| Comparaison | RMSE normalisé | Lecture |
| --- | --- | --- |
| P1-A → P1-M | 0,158 | mouvement très lisible |
| P2-A → P2-M | 0,053 | lisible |
| P2-M → P2-B | 0,035 | lisible (au-dessus du seuil 0,030) |
| P3-A → P3-M | 0,057 | lisible |

Toutes les positions sont en **paysage 1376×768** (aucun portrait). Anti-doublon : les 8
PNG ont des empreintes md5 **toutes distinctes**.

### Réserves honnêtes sur ces images

- **P2-M et P2-B** présentent un **artefact de dallage dans le ciel** (motif de blocs
  visible au-dessus de la mer) — l'anti-doublon/bavures déjà connues du chantier.
- La **montée du bassin** entre P2-M et P2-B reste **discrète** (RMSE 0,035) : lisible
  mais moins franche que sur la version HOMME validée du gainage latéral dynamique.
- Le rendu du corps est bien **argenté mat** sur cette série (pas d'écart de brillance
  relevé), visage noir sans traits, casquette blanche, tresse, brassière et short noirs,
  baskets blanches, terrasse bord de mer, tapis noir : **style conforme**.

### Technique vérifiée en ligne avant génération

- **Planche (avant-bras)** : avant-bras au sol, **coudes pile sous les épaules**, corps en
  **ligne droite ininterrompue des talons à la tête**, bassin neutre, abdominaux
  contractés + fessiers serrés + quadriceps engagés, nuque dans l'axe, respiration
  continue ; erreurs à ne pas montrer : bassin affaissé (cambrure), fesses en V inversé,
  tête qui tombe ([callisthenie-corner](https://www.callisthenie-corner.fr/planche/),
  [litobox](https://www.litobox.com/exercice-planche),
  [barretractionpro](https://barretractionpro.com/gainage-planche/)).
- **Gainage latéral** : appui sur l'avant-bras, **coude sous l'épaule**, montée du bassin
  jusqu'à la ligne droite cheville-hanche-épaule, **main libre sur la hanche**, cage
  thoracique tournée vers l'avant, hanches qui ne s'affaissent pas ; erreurs :
  bassin affaissé, rotation involontaire du tronc, coude décalé
  ([jogetjim](https://www.jogetjim.fr/gainage-lateral/),
  [magicfit](https://www.magicfit.fr/le-gainage-lateral-musculation/),
  [h2olesangles](https://www.h2olesangles.fr/gainage-lateral/)).
- **Bird dog** : à quatre pattes, mains sous les épaules, genoux sous les hanches, dos
  plat, extension **bras droit + jambe gauche opposés**, bassin qui ne bascule pas
  (mêmes sources que le LOT R1 FEMME : [jemeremetsausport](https://jemeremetsausport.com/bird-dog/)).

### Suite immédiate

1. produire la **9ᵉ position** (P3-B, extension complète du bird dog) au prochain tour ;
2. assembler `themeA/femme/circuit-gainage-3poses.gif` (460×257, `-delay 130/110`) —
   ⚠️ si la phase 3 est ajoutée à part, utiliser la même chaîne d'images et **jamais
   `-layers optimize` sur la planche** ;
3. afficher la planche définitive → validation user ;
4. **puis seulement** produire `circuit-abdominaux` en FEMME (crunch → relevés de jambes
   → gainage, 9 images, 1 circuit par tour) ;
5. le remplacement des fichiers **HOMME** (aujourd'hui en version simple) ne se fera
   **qu'après accord explicite du user** (règle 2).

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
