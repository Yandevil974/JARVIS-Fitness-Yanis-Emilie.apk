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
| Animations créées | **49 / 614** (POC 5 + L1 : 3 + L2 : 3 + L3 : 2 + L4 : 3 + L5 : 3 + A-01 : 3 + A-02 : 3 + A-03 : 3 + **A-04 HOMME : 3/3 complet (`db1c520`)** + A-01 FEMME : 3 + A-02 FEMME : 3 + A-03 FEMME : 3 + **A-04 FEMME : 1/3** (`abduction-assise`, `721ad18`) + **R1 FEMME : 3** + **R2 FEMME : 3** + **LOT 3 FEMME : 2 composites** (`circuit-gainage`, `circuit-abdominaux`)) |
| Restant à produire | **565** |
| Animations corrigées (option A + feu vert du 2026-10-07) | 3 / 5 (option A) + **4 corrections feu vert** (squat F pos M, abduction F pos B, fire hydrant F A/M/B en arrière 3/4, squat H A/M/B) |
| Animations femme à reprendre | **0** ✅ (squat M, abduction B et fire hydrant A/M/B tous corrigés le 2026-10-07) |
| Fichiers dupliqués corrigés | 4 / 48 (1 fichier soldé, 1 quasi soldé) |
| Exercices du fichier bcdbe16aeafaafec.gif traités | 8 / 8 ✅ (H + F) |
| Exercices du fichier 8de6e89e5395700c.gif traités | 6 / 7 |
| Exercices du fichier 666443484c7f0861.gif traités | 1 / 3 (pont fessier activation) |
| Lots livrés | POC (5) + L1 (3) + L2 (3) + L3 (2) + L4 (3) + L5 (3) + A-01 (3) + A-02 (3) + A-03 (3) + **A-04 HOMME (3/3 complet ✅)** + **A-01 FEMME (3)** + **A-02 FEMME (3)** + **A-03 FEMME (3)** + **A-04 FEMME (1/3 en cours + base A de `pallof-press`)** + **R1 FEMME (3)** + **R2 FEMME (3)** + **LOT 3 FEMME (2 composites)** |
| Versions femme produites | **18 / 307** |
| Thème A (échauffement) | **20 / 25 en homme, 18 / 25 en femme** · LOT A-04 HOMME 100 % livré (`db1c520`), LOT A-04 FEMME à 1/3 (`abduction-assise` livrée `721ad18`, `pallof-press` pos A prête), puis LOT A-05 (2 H + 2 F), `warmup-*` (3 H + 3 F), et les **2 circuits HOMME** à passer en version composite |
| Doublons sur les fichiers du chantier | 0 (toutes empreintes md5 distinctes) |

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
| 9 | Bird dog | B — bras droit + jambe gauche tendus à l'horizontale | `_sources/LOT3F/circuit-gainage-P3-B.png` | ✅ |

**LIVRÉ — 9 / 9 positions** (2026-10-07, 2ᵉ tour) :

| Livrable | Fichier |
| --- | --- |
| Animation composite FEMME | `themeA/femme/circuit-gainage-3poses.gif` (**460×257, 16 frames** — A→M→B sur chacune des 3 phases, puis retour arrière jusqu'à A) |
| Planche 3 colonnes | `themeA/femme/LOT3F-circuit-gainage-femme.gif` (**1420×265, 4 frames** — 1 colonne par phase : planche / latéral / bird dog) |
| Planche de contrôle statique | `themeA/femme/LOT3F-circuit-gainage-PLANCHE-FINALE.jpg` |
| Les 9 positions | `themeA/femme/_sources/LOT3F/circuit-gainage-P*.png` + `PLANCHE-TRAVAIL-…png` |

⚠️ **Note d'assemblage** : le format du chantier « A→M→B→M » ne décrit correctement que
**3 positions**. Pour un circuit composite de 3 phases (9 positions), la boucle retenue est
**A→M→B sur chaque phase puis retour à la position de départ** :
P1 A-M-B → P2 A-M-B → P3 A-M-B → P2 M-A → P1 M-A. Cela donne un **aller-retour propre,
sans saut entre la fin de la phase 3 et le début de la phase 1** (un retour direct B→A
aurait produit un téléportage du mannequin). Le générateur `scripts/build-gif-lot.sh`
ne sait produire que la boucle à 3 positions : l'assemblage du composite a donc été fait
avec la même chaîne d'outils (`convert`, `-delay 130/110`, `-colors 96`, `-layers
optimize` sur le GIF, **jamais** sur la planche), en conservant les paramètres validés.
**Si le user veut une autre convention de boucle, elle est à trancher.**

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

### Check du 2026-10-07 (2ᵉ passe, à la demande du user) — 8 positions recontrôlées

Grille de contrôle lisible dans le dépôt :
`themeA/femme/_sources/LOT3F/GRILLE-CHECK-LOT3F-circuit-gainage.jpg` (8 vignettes,
légenées). Constats :

| Point contrôlé | Verdict |
| --- | --- |
| Format paysage de chaque position | ✅ 1376×768 partout |
| Code visuel (argenté mat, visage noir sans traits, casquette, tresse, brassière + short noirs, baskets blanches) | ✅ conforme |
| Décor (terrasse bord de mer, pierre claire, tapis noir) | ✅ conforme |
| Planche sur avant-bras (P1-B) | ⚠️ avant-bras **bien à plat** (vérifié au zoom), mais **mains loin devant les coudes** — « coude sous l'épaule » approximatif |
| Installation de la phase 1 (P1-A) | ⚠️ la main est **déjà au sol devant le genou** — installation à genoux peu lisible |
| Progression du bassin en phase 2 (P2-M → P2-B) | ⚠️ **discrète** (RMSE 0,035) |
| Propre­té du ciel en phase 2 | ❌ **artefact de dallage** (motif de blocs au-dessus de la mer) |
| Bird dog phase 3 (A → M) | ✅ dos plat, prise de bras correcte, bassin stable (0,057) |

### Réserves honnêtes sur ces images

- **P2-M et P2-B** présentent un **artefact de dallage dans le ciel** (motif de blocs
  visible au-dessus de la mer) — les bavures déjà connues du chantier.
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
4. ✅ **FAIT** — `circuit-abdominaux` en FEMME lancé dans le même tour (crunch → relevés de
   jambes → gainage, 9 images) ;
5. le remplacement des fichiers **HOMME** (aujourd'hui en version simple) ne se fera
   **qu'après accord explicite du user** (règle 2).

## LOT 3 FEMME — CIRCUIT ABDOMINAUX (COMPLET, 9/9) — 2026-10-07

Second circuit composite FEMME (crunch → relevés de jambes → gainage), même méthode que
`circuit-gainage` : 9 positions chaînées (source = position précédente), 3 phases.

| # | Phase | Position | Fichier source | Statut |
| --- | --- | --- | --- | --- |
| 1 | Crunch | A — allongée sur le dos, genoux 90°, mains derrière la tête, dos plaqué | `_sources/LOT3F/circuit-abdos-P1-A.png` | ✅ |
| 2 | Crunch | M — tête et épaules décollées, omoplates encore au sol | `_sources/LOT3F/circuit-abdos-P1-M.png` | ✅ |
| 3 | Crunch | B — point haut de l'enroulement, bassin immobile | `_sources/LOT3F/circuit-abdos-P1-B.png` | ✅ |
| 4 | Relevés de jambes | A — jambes tendues verticales (position en « L »), dos plaqué | `_sources/LOT3F/circuit-abdos-P2-A.png` | ✅ |
| 5 | Relevés de jambes | M — jambes tendues à ~45°, descente contrôlée | `_sources/LOT3F/circuit-abdos-P2-M.png` | ✅ |
| 6 | Relevés de jambes | B — jambes presque parallèles au tapis, talons non posés | `_sources/LOT3F/circuit-abdos-P2-B.png` | ✅ |
| 7 | Gainage | A — à quatre pattes, mains au sol, genoux au sol, dos plat | `_sources/LOT3F/circuit-abdos-P3-A.png` | ✅ |
| 8 | Gainage | M — montée en planche, hanches à mi-course | `_sources/LOT3F/circuit-abdos-P3-M.png` | ✅ |
| 9 | Gainage | B — planche haute tenue, ligne droite talons-tête | `_sources/LOT3F/circuit-abdos-P3-B.png` | ✅ **livrée (`5e5a2e3`)** |

**LIVRÉ — 9 / 9 positions** (`5e5a2e3`) :
- `themeA/femme/circuit-abdominaux-3poses.gif` (460×257, 16 frames : aller P1A..P3B puis retour P3M..P1M) ;
- `themeA/femme/LOT3F-circuit-abdominaux-femme.gif` (planche 1420×265, 3 colonnes, 4 frames, sans `-layers optimize`) ;
- `themeA/femme/LOT3F-circuit-abdominaux-PLANCHE-FINALE.jpg` + `LOT3F-circuit-abdominaux-PLANCHE-TRAVAIL.png` (9/9).

### Écart assumé et documenté — la phase 3 est une planche HAUTE (sur les mains)

Deux prompts successifs demandaient l'appui sur les **avant-bras** ; le générateur a rendu
**deux fois** un appui sur les mains, bras tendus. Décision : **garder la planche haute**
pour ce circuit, pour trois raisons —
1. elle est **physiquement cohérente** avec la position de départ (à quatre pattes, mains
   au sol : la montée en planche conserve l'appui des mains, sans bascule sur les
   avant-bras) ;
2. c'est une **variante de gainage valide et courante** (planche haute, bras tendus) ;
3. elle **distingue** ce circuit du `circuit-gainage` (planche sur avant-bras), ce que
   demande l'esprit de la règle 1 (une animation spécifique par entrée).
⚠️ **Si le user préfère la planche sur avant-bras pour ce circuit, les phases 3 devront
être refaites (3 images) — à trancher.**

### Budget d'images IA du tour — 10 / 10, compté sans dissimulation

| Image | Résultat |
| --- | --- |
| `circuit-gainage` P3-B (fin du circuit précédent) | ✅ conforme |
| `circuit-abdos` P1-A (essai 1) | ❌ **rejetée** : corps à moitié hors du tapis noir (tête sur la dalle) et image étirée, ciel bruité → non intégrée |
| `circuit-abdos` P1-A (essai 2) | ✅ conforme (dos plaqué, genoux 90°, mains derrière la tête) |
| `circuit-abdos` P1-M | ✅ conforme |
| `circuit-abdos` P1-B | ✅ conforme |
| `circuit-abdos` P2-A | ✅ conforme (jambes verticales en « L ») |
| `circuit-abdos` P2-M | ✅ conforme (45°, descente contrôlée) |
| `circuit-abdos` P2-B | ✅ conforme (talons non posés) |
| `circuit-abdos` P3-A | ✅ conforme (quatre pattes) |
| `circuit-abdos` P3-M | ✅ conforme (montée en planche, mains au sol) |
| `circuit-abdos` P3-B | 🚫 **refusée par la limite** : `Image generation limit of 10 reached for this turn` |

### Contrôle objectif

| Comparaison | RMSE normalisé |
| --- | --- |
| crunch A → M | 0,077 |
| crunch M → B | 0,055 |
| relevés A → M | 0,061 |
| relevés M → B | 0,063 |
| gainage A → M | 0,053 |
| gainage M → B | 0,051 |

Toutes les positions en **paysage 1376×768**, empreintes md5 **toutes distinctes**, 0 doublon
sur l'ensemble du chantier (59 GIF + 17 PNG du LOT3F).

### Réserves honnêtes sur ces images

- **P1-A** : la casquette du personnage **dépasse légèrement du tapis noir** (le corps est
  bien au sol, seul l'arrière du crâne/casquette sort du tapis).
- **Phase 3** : planche **haute** au lieu d'un appui sur avant-bras (voir ci-dessus).
- **P3-M** : la jambe d'appui arrière est tendue mais le genou opposé est peu lisible
  (transition un peu molle entre la position à genoux et l'appui sur les pointes de pieds).

### Technique vérifiée en ligne avant génération

- **Crunch** : enroulement progressif du haut du dos (les omoplates décollent, le bas du dos
  reste au sol), nuque relâchée, menton légèrement rentré, mains près des tempes **sans
  tirer sur la tête**, expiration à la montée, arrêt dès que les lombaires se creusent
  ([sport-equipements](https://www.sport-equipements.fr/crunch-abdos/),
  [superphysique](https://www.superphysique.org/forums/topic2840.html)).
- **Relevés de jambes au sol** : le repère technique n°1 est la **rétroversion du bassin**
  (bas du dos plaqué) ; ne jamais descendre les jambes plus bas que ce que le gainage
  permet ; descente lente, sans élan, talons non posés entre les répétitions ; si les
  lombaires se décollent, réduire l'amplitude ou fléchir les genoux
  ([flexgymperformance](https://flexgymperformance.fr/blogs/abdos/releve-de-jambes-guide-complet),
  [jemeremetsausport](https://jemeremetsausport.com/releves-de-jambes-au-sol/),
  [infirmiermarseille](https://infirmiermarseille.fr/lever-jambes-bas-abdos/)).
- **Gainage (planche haute)** : mains sous les épaules, bras tendus, corps en ligne droite
  des talons à la tête, abdominaux + fessiers + quadriceps engagés, épaules basses
  ([callisthenie-corner](https://www.callisthenie-corner.fr/planche/),
  [barretractionpro](https://barretractionpro.com/gainage-planche/)).

### Suite immédiate

1. produire la **9ᵉ position** (P3-B, planche haute tenue) — elle ouvre le prochain tour ;
2. assembler `themeA/femme/circuit-abdominaux-3poses.gif` (même convention de boucle que
   `circuit-gainage` : A→M→B par phase puis retour arrière) + planche 1420×265 (3 colonnes) ;
3. afficher les deux planches au user **via GitHub** (règle 15) ;
4. ensuite : LOT A-04 (H + F), puis A-05, puis les 3 étapes chrono `warmup-*`.

## CORRECTIONS AUTORISÉES PAR LE USER — 2026-10-07 (feu vert « corriger les GIF précédents »)

Le user a donné un **feu vert général** pour corriger les animations déjà livrées. Règle 2
assouplie : les corrections décidées par le user peuvent désormais remplacer une animation
livrée, la résolution restant tracée dans ce fichier.

### 1. `femme/squat-poids-du-corps-3poses.gif` — position M ✅ CORRIGÉE

| | |
| --- | --- |
| Défaut | mi-course trop proche du départ (l'amplitude ne se lisait pas) |
| Correction | position M régénérée depuis `_sources/A-02F/squat-poids-du-corps-A.png` : genoux ~90°, cuisses ~45° de la verticale, fesses vers l'arrière, buste droit, talons au sol |
| Mesure | RMSE A→M = **0,288** (contre un écart quasi nul avant) |
| Fichiers | `themeA/femme/squat-poids-du-corps-3poses.gif` + `LOT-A02F-echauffement-femme.gif` réassemblés |

### 2. `femme/abduction-hanche-elastique-3poses.gif` — position B ✅ CORRIGÉE

| | |
| --- | --- |
| Défaut | position finale confondue avec la mi-course (RMSE 0,029) |
| Correction | position B régénérée depuis `_sources/A-03F/abduction-hanche-elastique-M.png` : jambe à ~45° de la jambe d'appui, écart des pieds très augmenté, élastique franchement étiré, buste vertical, bassin stable |
| Mesure | RMSE M→B = **0,255** (contre 0,029) |
| Fichiers | `themeA/femme/abduction-hanche-elastique-3poses.gif` + `LOT-A03F-echauffement-femme.gif` réassemblés |

### 3. `femme/fire-hydrant-elastique-3poses.gif` — positions A, M et B ✅ CORRIGÉES (`e5b670a`)

**Le problème était un problème d'ANGLE DE VUE, pas de prompt.** En vue arrière
trois-quarts, les positions M et B chaînées depuis `A3` montrent l'abduction latérale
du genou gauche sans ambiguïté :

| Position | Fichier | Statut |
| --- | --- | --- |
| A (quatre pattes, vue arrière trois-quarts, semelles vers le plafond, élastique aux genoux) | `_sources/A-02F/fire-hydrant-elastique-A.png` | ✅ conforme |
| M (genou gauche ouvert à ~45°, fléchi à 90°, élastique tendu) | `_sources/A-02F/fire-hydrant-elastique-M.png` | ✅ conforme (RMSE A→M = **0,088**) |
| B (cuisse gauche à l'horizontale à hauteur de hanche, genou à 90°) | `_sources/A-02F/fire-hydrant-elastique-B.png` | ✅ conforme (RMSE M→B = **0,090**) |

Livrables réassemblés : `themeA/femme/fire-hydrant-elastique-3poses.gif` (460×257),
`themeA/femme/LOT-A02F-echauffement-femme.gif` (1420×265) et
`themeA/femme/LOT-A02F-fire-hydrant-PLANCHE-FINALE.jpg`.
⚠️ Rupture d'angle de vue assumée (arrière trois-quarts) avec les deux autres exercices du
LOT A-02 FEMME (profil / face).

### 4. `themeA/squat-poids-du-corps-3poses.gif` (HOMME) — A, M et B ✅ CORRIGÉES (`9ed4d87`)

| | |
| --- | --- |
| Défaut | vue de face sans tapis noir et quasi immobile entre A, M et B (faux squat) |
| Correction | après 1 essai rejeté (chaîné depuis la frame GIF dithérée qui a rejoué la pose debout), série complète A → M → B régénérée en vue trois-quarts sur tapis noir : A debout → M demi-squat (~45°) → B squat bas |
| Mesure | RMSE A→M = **0,076** · M→B = **0,090** |
| Fichiers | `themeA/squat-poids-du-corps-3poses.gif` + `themeA/LOT-A02-echauffement.gif` + `themeA/LOT-A02-squat-homme-PLANCHE-FINALE.jpg` + `_sources/A-02/squat-poids-du-corps-A/M/B.png` |

## LOT A-04 HOMME — COMPLET (3 / 3 exercices livrés, 9 / 9 positions) — 2026-10-07 (`db1c520`)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/abduction-assise-machine-ou-elastique-3poses.gif` | Abduction assise (machine ou élastique) | Vue de face directe : A = genoux et pieds serrés au centre · M = ouverture moyenne des genoux fléchis à 90°, pieds fixes au centre · B = ouverture maximale en papillon/losange, pieds sur tranche externe au centre, mains écartées sur le banc | ✅ **livré (`bd77abf`)** |
| `themeA/pallof-press-a-l-elastique-3poses.gif` | Pallof press à l'élastique | Vue trois-quarts avant, poteau noir à gauche, élastique à hauteur de poitrine : A = mains jointes contre le sternum, coudes fléchis · M = mains poussées à mi-course devant la poitrine · B = bras verrouillés à 180° loin devant la poitrine, tronc en anti-rotation | ✅ **livré (`f2c7d13`)** (réserve mineure : pieds un peu plus écartés en B) |
| `themeA/face-pull-a-l-elastique-3poses.gif` | Face pull à l'élastique | Vue trois-quarts arrière face au poteau noir à gauche (élastique fixé à hauteur des yeux) : A = bras tendus à l'horizontale · M = tirage vers le visage, coudes hauts à hauteur d'épaule (~90°) · B = rotation externe d'épaule en fin de course (avant-bras verticaux à 90°, mains de part et d'autre des tempes/oreilles, omoplates serrées) | ✅ **livré (`db1c520`)** |

**Planche animée 3 colonnes et aperçus dans le dépôt (règle 15) :**
- `themeA/LOT-A04-echauffement.gif` (1420×265, 4 frames, sans `-layers optimize`) ;
- `themeA/LOT-A04-PLANCHE-TRAVAIL.jpg` (grille 3×3 complète 1440×897 des 3 exercices A/M/B) ;
- `themeA/LOT-A04-abduction-assise-PLANCHE-FINALE.jpg` ;
- `themeA/LOT-A04-pallof-press-PLANCHE-FINALE.jpg` ;
- `themeA/LOT-A04-face-pull-PLANCHE-FINALE.jpg`.

### Contrôle objectif (LOT A-04 HOMME, 3/3)

| Comparaison | RMSE normalisé |
| --- | --- |
| abduction assise HOMME A → M | 0,0735 |
| abduction assise HOMME M → B | 0,0838 |
| pallof press HOMME A → M | 0,0500 |
| pallof press HOMME M → B | 0,0898 |
| face pull HOMME A → M | 0,0566 |
| face pull HOMME M → B | 0,0520 |

---

## LOT A-04 FEMME — en cours (1 / 3 exercice livré + base A de `pallof-press`, 4 / 9 positions) — 2026-10-07

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/femme/abduction-assise-machine-ou-elastique-3poses.gif` | Abduction assise (machine ou élastique) FEMME | Vue de face directe symétrique : A = genoux et pieds serrés au centre · M = ouverture moyenne des genoux fléchis à 90°, pieds fixes au centre, mains posées sur le banc · B = ouverture maximale en papillon/losange, pieds sur tranche externe au centre, mains écartées aux extrémités du banc | ✅ **livré (`721ad18`)** (RMSE A→M = **0,0864**, M→B = **0,0746**) |
| `themeA/femme/pallof-press-a-l-elastique-3poses.gif` | Pallof press à l'élastique FEMME | Vue trois-quarts avant, poteau noir à gauche, élastique à hauteur de poitrine : **A produite et validée** (`_sources/A-04F/pallof-press-a-l-elastique-A.png`, mains jointes contre le sternum) · M et B à chaîner | ⏳ **1/3 position prête** (M et B ouvrent le prochain tour) |
| `themeA/femme/face-pull-a-l-elastique-3poses.gif` | Face pull à l'élastique FEMME | Vue trois-quarts arrière face au poteau noir à gauche : A → M → B à chaîner | ⬜ **au prochain tour** (après `pallof-press` M et B) |

**Aperçu dans le dépôt (règle 15) :**
- `themeA/femme/LOT-A04F-abduction-assise-PLANCHE-FINALE.jpg` (1440×300, 3 colonnes A/M/B).

### Budget d'images IA du 3ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `face-pull` HOMME A (vue 3/4 arrière face au poteau gauche, bras tendus) | ✅ conforme |
| 2 | `face-pull` HOMME M (tirage mi-course, coudes hauts à hauteur d'épaule) | ✅ conforme (RMSE A→M = 0,0566) |
| 3 | `face-pull` HOMME B (rotation externe 90°, mains aux tempes/oreilles) | ✅ conforme (RMSE M→B = 0,0520) → **LOT A-04 HOMME complet livré (`db1c520`)** |
| 4 | `abduction-assise` FEMME A (vue de face directe symétrique) | ✅ conforme |
| 5 | `abduction-assise` FEMME M (essai 1, chaîné depuis A seule) | ❌ rejeté (mains posées près des cuisses bloquant l'ouverture des genoux, RMSE 0,0471) |
| 6 | `abduction-assise` FEMME M (essai 2, avec référence ouverture) | ✅ conforme (ouverture moyenne franche, RMSE A→M = 0,0864) |
| 7 | `abduction-assise` FEMME B (essai 1, chaîné depuis M seule) | ⚠️ quasi identique à M (RMSE 0,0378) → retenu comme `M.png` |
| 8 | `abduction-assise` FEMME M (essai 3, interpolation A+B) | ❌ rejeté (pieds écartés et genoux rentrés en valgus) |
| 9 | `abduction-assise` FEMME B (essai 2, avec référence B HOMME) | ✅ conforme (ouverture maximale en losange, pieds sur tranche externe au centre, RMSE M→B = 0,0746) → **livré (`721ad18`)** |
| 10 | `pallof-press` FEMME A (vue 3/4 avant, poteau noir à gauche, mains au sternum) | ✅ conforme → **base prête pour le prochain tour** |

### Technique vérifiée en ligne avant génération (règle 14)

- **Abduction assise à l'élastique** : assis sur un banc plat, bande élastique juste
  au-dessus des genoux, pieds posés à plat au centre (ils ne s'écartent pas), genoux
  fléchis à 90° poussés vers l'extérieur contre la bande, 1 s de contraction du moyen
  fessier en fin de course
  ([fitwill](https://fitwill.app/exercise/3006/resistance-band-seated-hip-abduction/),
  [liftmanual](https://liftmanual.com/resistance-band-seated-hip-abduction/),
  [fitadium](https://www.fitadium.com/conseils/abducteurs-assis-machine/)).
  *Note d'angle de vue* : sur une vue trois-quarts avec le banc en travers, le générateur
  bloquait les genoux ou tendait les jambes en grand écart ; le passage en **vue de face
  symétrique** (assis en bout de banc face à la caméra) a résolu le blocage.
- **Pallof press à l'élastique** : gainage **anti-rotation** (transverse + obliques) ;
  debout perpendiculaire à l'ancrage fixé à hauteur de poitrine, genoux légèrement
  fléchis, départ mains jointes contre le sternum, extension des bras droit devant la
  poitrine **sans laisser le buste pivoter** vers l'ancrage, maintien 1-2 s bras tendus
  ([jemeremetsausport](https://jemeremetsausport.com/pallof-press/),
  [louismove](https://louismove.com/pallof-press/),
  [creatine-academie](https://www.creatine-academie.com/comment-realiser-pallof-press/),
  [muscletoncorps](https://muscletoncorps.fr/pallof-press/)).
- **Face pull à l'élastique** *(vérifié pour l'ouverture du prochain tour)* : élastique
  fixé à hauteur du visage/yeux, tirage vers le visage en écartant les mains de part et
  d'autre des oreilles, **coudes maintenus hauts (à hauteur d'épaule ou légèrement
  au-dessus)** + **rotation externe** de l'épaule en fin de mouvement et rétraction des
  omoplates ([cerclesdelaforme](https://www.cerclesdelaforme.com/blog/coaching-sportif/muscler-epaules-face-pull/),
  [happy-fitness](https://happy-fitness.fr/face-pull-lexercice-cle-pour-renforcer-larriere-des-epaules/),
  [louismove](https://louismove.com/facepull/)).

### Budget d'images IA du 2ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `abduction-assise` HOMME M (sur base trois-quarts) | ❌ rejeté (genoux immobiles, RMSE 0,038 bruit) |
| 2 | `abduction-assise` HOMME A (essai genoux collés sur base trois-quarts) | ❌ rejeté (genoux immobiles, RMSE 0,027) → changement d'angle vers vue de face directe |
| 3 | `abduction-assise` HOMME A (nouvelle base **vue de face directe**) | ✅ conforme |
| 4 | `abduction-assise` HOMME M (vue de face, ouverture moyenne) | ✅ conforme (RMSE A→M = 0,073) |
| 5 | `abduction-assise` HOMME B (essai 1, mains sur le banc bloquant les genoux) | ❌ rejeté (genoux bloqués par les mains) |
| 6 | `abduction-assise` HOMME B (essai 2, mains aux hanches) | ❌ rejeté (jambes tendues en grand écart) |
| 7 | `abduction-assise` HOMME B (essai 3, pieds verrouillés au centre + mains écartées sur le banc) | ✅ conforme (RMSE M→B = 0,084) → **livré (`bd77abf`)** |
| 8 | `pallof-press` HOMME A (mains au sternum, élastique à hauteur de poitrine) | ✅ conforme |
| 9 | `pallof-press` HOMME M (mains à mi-course devant la poitrine) | ✅ conforme (RMSE A→M = 0,050) |
| 10 | `pallof-press` HOMME B (bras verrouillés à 180° loin devant) | ✅ conforme (RMSE M→B = 0,090, réserve : pieds plus écartés) → **livré** |

### Budget d'images du tour de corrections — 10 / 10, compté

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | fire hydrant M (essai 1) | ❌ erreur générateur `Response contains no images` |
| 2 | squat M | ✅ conforme → **livré** |
| 3 | fire hydrant M (essai 2) | ❌ **rendu en donkey kick** (profil) → rejeté |
| 4 | fire hydrant M (essai 3) | ❌ erreur générateur |
| 5 | fire hydrant M (essai 4) | ❌ donkey kick encore (profil) → rejeté |
| 6 | fire hydrant A2 (re-cadrage arrière demandé) | ❌ le générateur a rejoué la vue de profil → rejeté |
| 7 | abduction B (essai 1) | ❌ erreur générateur |
| 8 | abduction B (essai 2) | ✅ conforme → **livré** |
| 9 | fire hydrant B2 (depuis M en donkey kick) | ❌ donkey kick (profil) → rejeté |
| 10 | fire hydrant A3 (**nouvelle base, vue arrière trois-quarts**) | ✅ conforme → **base de la nouvelle série** |

**5 images ont été rejetées** (dont 3 erreurs techniques du générateur et 2 mouvements
non conformes) : elles sont comptées, pas dissimulées. Aucune n'est intégrée à une
animation livrée.

### Technique vérifiée en ligne avant ces corrections

- **Fire hydrant** : à quatre pattes, mains sous les épaules, genoux sous les hanches ;
  **abduction de hanche** — le genou s'écarte du centre du corps sur le côté **en restant
  plié à ~90°**, jusqu'à la parallèle au sol ; le bassin ne tourne pas et le dos ne
  s'étend pas ; « à quatre pattes, éloigner le genou du centre du corps tout en le gardant
  plié » ([nievremedical](https://nievremedical.fr/sculptez-fessiers-fire-hydrant),
  [julienquaglierini](https://julienquaglierini.com/2024/06/fire-hydrant/),
  [YouTube — démonstration](https://www.youtube.com/watch?v=La3xYT8MGks) : « lock the
  elbows and abduct the hip at 90 or 45 degrees »).
- **Squat au poids du corps** : cuisses jusqu'au parallèle, poids sur les talons, genoux
  dans l'axe des orteils, buste droit
  ([fitdistance](https://fitdistance.io/exercice-musculation/squats-au-poids-du-corps)).
- **Abduction debout à l'élastique** : buste vertical, mains sur les hanches, bassin
  stable, amplitude 30-45°
  ([mickaël Conseiller](https://mickaelconseillerlr.fr/produit/abduction-debout-avec-elastique-renforcement-des-hanches-et-des-fessiers/)).

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
