# Suivi du chantier « reconstruction des animations »

## PRIORITÉ ACTUELLE — 9 octobre 2026 : HOMME commun aux deux profils

**Nouvelle demande utilisateur : produire uniquement les GIFs HOMME pour Yanis ET Émilie ;
les nouvelles versions FEMME seront faites plus tard. Conserver les FEMME déjà livrées.**
La passation et la consigne sont réunies dans [REPRISE-JARVIS.md](../../REPRISE-JARVIS.md).
Les anciens ordres de génération FEMME plus bas sont historiques et ne sont plus actifs.
Un même GIF peut servir aux deux profils pour le même exercice, jamais à deux exercices distincts.
Le compteur historique 76/614 est inchangé ; couverture HOMME commune à auditer sur 307 entrées.
Ce changement documentaire n'effectue aucune intégration applicative.


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
| Animations créées | **76 / 614** (ajout leg press HOMME B-03 ; détails et sources en dernière section) |
| Restant à produire | **538** |
| Animations corrigées (option A + feu vert du 2026-10-07) | 3 / 5 (option A) + **4 corrections feu vert** (squat F pos M, abduction F pos B, fire hydrant F A/M/B en arrière 3/4, squat H A/M/B) |
| Animations femme à reprendre | **0** ✅ (squat M, abduction B et fire hydrant A/M/B tous corrigés le 2026-10-07) |
| Fichiers dupliqués corrigés | 4 / 48 (1 fichier soldé, 1 quasi soldé) |
| Exercices du fichier bcdbe16aeafaafec.gif traités | 8 / 8 ✅ (H + F) |
| Exercices du fichier 8de6e89e5395700c.gif traités | 6 / 7 |
| Exercices du fichier 666443484c7f0861.gif traités | 1 / 3 (pont fessier activation) |
| Lots livrés | POC (5) + L1–L5 + Thème A (50/50) + R1/R2/LOT 3 FEMME + **B-01 HOMME et FEMME (3/3 chacun)** + **B-02 HOMME et FEMME (3/3 chacun)** + **B-03 en cours : squat cycliste HOMME + FEMME livrés ; back-squat POC audité avec réserves ; leg-press HOMME livrée ; leg-press FEMME et back-squat FEMME reportées** |
| Versions femme produites | **32 / 307** (Thème A 25 + B-01F 3 + B-02F 3 + cycliste B-03F 1) |
| Thème A (échauffement) | **25 / 25 en homme (100% ✅), 25 / 25 en femme (100% ✅) = 50 / 50 animations du Thème A livrées !** (Reste uniquement en réserve : passer les 2 circuits HOMME en version composite après accord user) |
| Thème B (musculation) | **16 / 187** (9 HOMME + 7 FEMME, incluant le POC `back-squat` audité avec réserves et le `squat-cycliste-squat-complet` HOMME livré en B-03) ; B-01 et B-02 terminés H+F, B-03 en cours |
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

## LOT A-04 FEMME — COMPLET (3 / 3 exercices livrés, 9 / 9 positions) — 2026-10-07 (`2a202a4`)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/femme/abduction-assise-machine-ou-elastique-3poses.gif` | Abduction assise (machine ou élastique) FEMME | Vue de face directe symétrique : A = genoux et pieds serrés au centre · M = ouverture moyenne des genoux fléchis à 90°, pieds fixes au centre, mains posées sur le banc · B = ouverture maximale en papillon/losange, pieds sur tranche externe au centre, mains écartées aux extrémités du banc | ✅ **livré (`721ad18`)** (RMSE A→M = **0,0864**, M→B = **0,0746**) |
| `themeA/femme/pallof-press-a-l-elastique-3poses.gif` | Pallof press à l'élastique FEMME | Vue trois-quarts avant, poteau noir à gauche, élastique à hauteur de poitrine : A = mains jointes contre le sternum · M = mains poussées à mi-course devant la poitrine · B = bras verrouillés à 180° loin devant la poitrine (réserve : pieds légèrement plus écartés en B) | ✅ **livré (`8686998`)** (RMSE A→M = **0,0595**, M→B = **0,0949**) |
| `themeA/femme/face-pull-a-l-elastique-3poses.gif` | Face pull à l'élastique FEMME | Vue trois-quarts arrière face au poteau noir à gauche : A = bras tendus à l'horizontale · M = tirage vers le visage coudes hauts (~90°) · B = rotation externe d'épaule à 90° (avant-bras verticaux, mains aux tempes/oreilles, omoplates serrées) | ✅ **livré (`2a202a4`)** (RMSE A→M = **0,0578**, M→B = **0,0511**) |

**Planche animée 3 colonnes et aperçus dans le dépôt (règle 15) :**
- `themeA/femme/LOT-A04F-echauffement-femme.gif` (1420×265, 4 frames, sans `-layers optimize`) ;
- `themeA/femme/LOT-A04F-PLANCHE-TRAVAIL.jpg` (grille 3×3 complète 1440×900 des 3 exercices A/M/B) ;
- `themeA/femme/LOT-A04F-abduction-assise-PLANCHE-FINALE.jpg` ;
- `themeA/femme/LOT-A04F-pallof-press-PLANCHE-FINALE.jpg` ;
- `themeA/femme/LOT-A04F-face-pull-PLANCHE-FINALE.jpg`.

---

## LOT A-05 HOMME — COMPLET (3 / 3 exercices livrés, dont `dead-bug` en LOT 1) — 2026-10-07 (`5346b43`)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/respiration-diaphragmatique-3poses.gif` | Respiration diaphragmatique HOMME | Allongé sur le dos sur tapis noir, genoux fléchis à 90°, pieds à plat (profil 3/4 rapproché) : A = inspiration diaphragmatique ample (ventre gonflé vers le haut, deux mains sur le ventre) · M = expiration contrôlée (ventre revenu à plat, main droite sur le thorax et main gauche sur l'abdomen) · B = fin d'expiration avec Stomach Vacuum hypopressif profond sous l'arc costal (engagement maximal du transverse), bras posés le long du corps pour dégager la vue sur le creux abdominal | ✅ **livré (`1ca6f4e`)** (RMSE A→M = **0,0616**, M→B = **0,1144** ; réserve : amplitude ventrale/vacuum volontairement accentuée pour une lecture immédiate en vignette) |
| `themeA/hip-thrust-unilateral-1-jambe-3poses.gif` | Hip thrust unilatéral (1 jambe) HOMME | Haut du dos (omoplates) appuyé contre le banc noir, bras ouverts sur le banc, pied gauche à plat au sol, jambe droite décollée genou fléchi à 90° : A = bassin bas près du tapis · M = bassin monté à mi-hauteur · B = extension complète de hanche en table horizontale (épaules pivotées sur le banc, tibia gauche vertical à 90°, cuisse droite verticale à 90°) | ✅ **livré (`5346b43`)** (RMSE A→M = **0,1502**, M→B = **0,1194**) |
| `lot1/dead-bug-3poses.gif` | Dead bug HOMME | Déjà livré dans le LOT 1 HOMME | ✅ **déjà livré** |

**Planche animée 3 colonnes et aperçus dans le dépôt (règle 15) :**
- `themeA/LOT-A05-echauffement.gif` (1420×265, 4 frames, sans `-layers optimize`) ;
- `themeA/LOT-A05-PLANCHE-TRAVAIL.jpg` (grille 3×2 de 1440×600 des 2 nouveaux exercices A/M/B) ;
- `themeA/LOT-A05-respiration-diaphragmatique-PLANCHE-FINALE.jpg` ;
- `themeA/LOT-A05-hip-thrust-unilateral-PLANCHE-FINALE.jpg`.

---

## LOT A-05 FEMME — COMPLET (3 / 3 exercices livrés, dont `dead-bug` en LOT R1F) — 2026-10-07

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/femme/respiration-diaphragmatique-3poses.gif` | Respiration diaphragmatique FEMME | Allongée sur le dos sur tapis noir, genoux fléchis à 90°, pieds à plat (profil 3/4 rapproché) : A = inspiration diaphragmatique ample (ventre gonflé, deux mains sur le ventre ; réserve : lueur dorée sur la cuisse en A) · M = expiration contrôlée (ventre revenu à plat sous la brassière noire, main droite sur la poitrine, main gauche sur l'abdomen) · B = fin d'expiration avec Stomach Vacuum hypopressif sous l'arc costal, bras posés le long des hanches | ✅ **livré (`beb04bf`)** (RMSE A→M = **0,0865**, M→B = **0,1106**) |
| `themeA/femme/hip-thrust-unilateral-1-jambe-3poses.gif` | Hip thrust unilatéral (1 jambe) FEMME | Haut du dos (omoplates) appuyé contre le banc noir, bras ouverts sur le banc, pied gauche à plat au sol, jambe droite décollée genou fléchi à 90° : A = bassin bas près du tapis · M = montée intermédiaire (genou droit tiré plus haut vers la poitrine ; réserve : bassin encore proche du bas en M) · B = extension complète de hanche en table horizontale (épaules pivotées à plat sur le banc, tibia gauche vertical à 90°, jambe droite levée haut à 90°) | ✅ **livré** (RMSE A→M = **0,0842**, M→B = **0,1706**) |
| `themeA/femme/dead-bug-3poses.gif` | Dead bug FEMME | Déjà livré dans le LOT R1 FEMME | ✅ **déjà livré** |

**Planche animée 3 colonnes et aperçus dans le dépôt (règle 15) :**
- `themeA/femme/LOT-A05F-echauffement-femme.gif` (1420×265, 4 frames, sans `-layers optimize`) ;
- `themeA/femme/LOT-A05F-PLANCHE-TRAVAIL.jpg` (grille 3×2 de 1440×600 des 2 nouveaux exercices A/M/B) ;
- `themeA/femme/LOT-A05F-respiration-diaphragmatique-PLANCHE-FINALE.jpg` ;
- `themeA/femme/LOT-A05F-hip-thrust-unilateral-PLANCHE-FINALE.jpg`.

## LOT A-08 / A-09 HOMME — COMPLET (3 / 3 étapes chrono `warmup-*` livrées — 25/25 Thème A HOMME ✅) — 2026-10-07 (`204a8b4`)

| Fichier | Étape chrono | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/warmup-route-3poses.gif` | `warmup-route` (*Mise en route cardio — 3 min*) | Marche active dynamique / montée de genou souple sur place (vue 3/4 avant sur tapis noir) : A = deux pieds posés sur le tapis en départ de foulée · M = montée du genou gauche à mi-hauteur (~35°), bras en balancier · B = genou gauche levé haut (~75-80°), poing gauche levé en coordination | ✅ **livré (`8cf93fa`)** (RMSE A→M = **0,0713**, M→B = **0,0994**) |
| `themeA/warmup-mobilite-3poses.gif` | `warmup-mobilite` (*Mobilité articulaire — 4 min*) | Ouverture thoracique et rétraction scapulaire dynamique debout (vue 3/4 avant) : A = avant-bras et coudes fermés verticalement devant la poitrine (protraction scapulaire) · M = ouverture à mi-course en position Cactus / W à 90/90 (rotation externe d'épaules) · B = grande ouverture thoracique bras grands ouverts en T vers l'arrière, omoplates serrées | ✅ **livré (`d698285`)** (RMSE A→M = **0,0586**, M→B = **0,0553**) |
| `themeA/warmup-approche-3poses.gif` | `warmup-approche` (*Séries d'approche — 3 min*) | Épaulé / tirage d'approche à la barre légère (barre olympique avec un petit disque fin d'échauffement de chaque côté) : A = barre légère tenue bras tendus vers le bas devant le haut des cuisses · M = tirage vertical à mi-buste (sternum), coudes hauts à 90° · B = barre légère amenée en front-rack aux clavicules | ✅ **livré (`204a8b4`)** (RMSE A→M = **0,0740**, M→B = **0,0990**) |

**Planche animée 3 colonnes et aperçus dans le dépôt (règle 15) :**
- `themeA/LOT-A08-echauffement.gif` (1420×265, 4 frames, sans `-layers optimize`) ;
- `themeA/LOT-A08-PLANCHE-TRAVAIL.jpg` (grille 3×3 complète 1440×900 des 3 étapes `warmup-*` HOMME) ;
- `themeA/LOT-A08-warmup-route-PLANCHE-FINALE.jpg` ;
- `themeA/LOT-A08-warmup-mobilite-PLANCHE-FINALE.jpg` ;
- `themeA/LOT-A08-warmup-approche-PLANCHE-FINALE.jpg`.

---

## LOT A-08F / A-09F FEMME — COMPLET (3 / 3 étapes chrono `warmup-*` livrées — 25/25 Thème A FEMME ✅) — 2026-10-07 (`5467b86`)

| Fichier | Étape chrono | Positions | Statut |
| --- | --- | --- | --- |
| `themeA/femme/warmup-route-3poses.gif` | `warmup-route` FEMME (*Mise en route cardio — 3 min*) | Marche active dynamique / montée de genou souple sur place (vue 3/4 avant sur tapis noir) : A = deux pieds posés sur le tapis en départ de foulée · M = montée du genou gauche à mi-hauteur (~45°), bras en balancier · B = genou gauche levé haut (~90°), poing gauche levé en coordination (réserve : apparition d'un relief lointain sur l'horizon gauche derrière le palmier en B) | ✅ **livré (`b017eb6`)** (RMSE A→M = **0,0837**, M→B = **0,1078**) |
| `themeA/femme/warmup-mobilite-3poses.gif` | `warmup-mobilite` FEMME (*Mobilité articulaire — 4 min*) | Ouverture thoracique et rétraction scapulaire dynamique debout (vue 3/4 avant) : A = avant-bras et coudes fermés verticalement devant le buste · M = ouverture à mi-course en position Cactus / W à 90/90 (rotation externe d'épaules) · B = grande ouverture thoracique bras grands ouverts en T vers l'arrière, omoplates serrées | ✅ **livré (`b932ebd`)** (RMSE A→M = **0,0652**, M→B = **0,0475**) |
| `themeA/femme/warmup-approche-3poses.gif` | `warmup-approche` FEMME (*Séries d'approche — 3 min*) | Épaulé / tirage d'approche à la barre légère : A = barre légère tenue bras tendus vers le bas devant le haut des cuisses · M = tirage vertical à mi-buste (sternum), coudes hauts à 90° · B = barre légère amenée en front-rack aux clavicules (réserve mineure : pieds légèrement rapprochés en B) | ✅ **livré (`5467b86`)** (RMSE A→M = **0,1004**, M→B = **0,1698**) |

**Planche animée 3 colonnes et aperçus dans le dépôt (règle 15) :**
- `themeA/femme/LOT-A08F-echauffement-femme.gif` (1420×265, 4 frames, sans `-layers optimize`) ;
- `themeA/femme/LOT-A08F-PLANCHE-TRAVAIL.jpg` (grille 3×3 complète 1440×900 des 3 étapes `warmup-*` FEMME) ;
- `themeA/femme/LOT-A08F-warmup-route-PLANCHE-FINALE.jpg` ;
- `themeA/femme/LOT-A08F-warmup-mobilite-PLANCHE-FINALE.jpg` ;
- `themeA/femme/LOT-A08F-warmup-approche-PLANCHE-FINALE.jpg`.

---

## THÈME B — LOT B-02 HOMME COMPLET (3 / 3 exercices, 9 / 9 positions) — 2026-10-08 (tour 13)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeB/bulgarian-split-squat-halteres-3poses.gif` | Bulgarian split squat haltères HOMME (`dumbbell`) | Un haltère noir dans chaque main le long du corps, pied arrière sur le banc : A = jambe avant tendue · M = demi-descente 45° · B = squat bulgare profond 90°, cuisse avant horizontale | ✅ **livré (`e5d8f1c`)** |
| `themeB/back-squat-charge-moderee-3poses.gif` | Back squat (charge modérée) HOMME (`barbell`) | Barre haute sur les trapèzes, un disque de chaque côté : A = debout, jambes tendues, prise largeur d'épaules · M = demi-squat 45°, talons au sol (RMSE 0,0952) · B = squat profond, pliure des hanches sous le haut des genoux (RMSE 0,1156) | ✅ **livré (`dcacd1c`)** |
| `themeB/presse-a-cuisses-pieds-hauts-3poses.gif` | Presse à cuisses pieds hauts HOMME (`machine`) | Assis dans la presse, dos et bassin plaqués au dossier, pieds HAUTS sur le plateau, mains sur les poignées : A = jambes quasi tendues (genoux jamais verrouillés) · M = descente contrôlée, genoux à ~90° (RMSE 0,2380) · B = flexion profonde, plateau proche du buste (RMSE 0,0430) | ✅ **livré (`770e5cd`)** |

**Assemblages du lot (règle 15) :**
- `themeB/LOT-B02-quadriceps.gif` (1420×265, planche animée 3 colonnes, 4 frames, sans `-layers optimize`) ;
- `themeB/LOT-B02-PLANCHE-TRAVAIL.jpg` (grille 3×3, 1440×900) ;
- planches statiques : `LOT-B02-bulgarian-split-squat-halteres-PLANCHE-FINALE.jpg`,
  `LOT-B02-back-squat-charge-moderee-PLANCHE-FINALE.jpg`,
  `LOT-B02-presse-a-cuisses-pieds-hauts-PLANCHE-FINALE.jpg`.

### Technique vérifiée en ligne avant génération (règle 14)

- **Back squat (charge modérée)** : la barre repose **toujours sur les trapèzes, jamais sur
  les vertèbres cervicales** ; pieds largeur d'épaules, orteils ouverts 10-30°, mains
  largeur d'épaules, **cassure simultanée des hanches et des genoux**, poids réparti entre
  le milieu du pied et le talon, **cuisses au moins jusqu'à la parallèle**, pliure des
  hanches sous le haut des genoux, genoux dans l'axe des pointes de pieds, bracing
  abdominal ; erreurs à ne pas montrer : dos arrondi, valgus, talons décollés, buttwink,
  descente trop courte
  ([fitness-lounge](https://www.fitness-lounge.fr/bien-faire-squats-barre/),
  [h2olesangles](https://www.h2olesangles.fr/back-squat/),
  [maboxdecross](https://maboxdecross.fr/mouvement/back-squat),
  [conseilmuscu](https://www.conseilmuscu.com/exercices-de-musculation/guide-complet-force-technique-squat-maitrisez-exercice-votre-musculation/)).
  *Chargement volontairement MODÉRÉ (1 disque de chaque côté) pour illustrer « charge
  modérée » sans surcharger la barre.*
- **Presse à cuisses pieds hauts** : **pieds hauts** sur le plateau = accent sur les
  **fessiers et les ischio-jambiers** (extension de hanche accrue) ; **dos et hanches bien
  plaqués contre le dossier**, fessiers collés au siège (le bassin ne se soulève jamais),
  bas du dos qui ne s'arrondit pas ; **tout le pied en contact, talons ancrés** ; descente
  contrôlée jusqu'à ~90° minimum ; **genoux jamais verrouillés en haut** ; genoux dans
  l'axe des pointes de pieds
  ([flexgymperformance](https://flexgymperformance.fr/blogs/quadriceps/presse-a-cuisses-guide-complet),
  [fitadium](https://www.fitadium.com/conseils/presse-cuisses/),
  [carefitness](https://www.carefitness.com/page/leg-press-guide-hypotrophie-musculaire)).

### Réserves honnêtes du tour (règle 4)

- **`presse-a-cuisses-pieds-hauts` position B** : l'amplitude entre M et B reste **modérée**
  (RMSE **0,0430**, juste au-dessus du seuil de 0,030) — la différence se lit surtout sur
  l'angle des genoux, pas sur la position du plateau. **2 tentatives rejetées avant** :
  la 1ʳᵉ (chaînée depuis A) passait en **profil** avec **une seule jambe lisible** ; la 2ᵉ
  (chaînée depuis M) est revenue **quasi identique à M** (RMSE 0,019).
- **`presse-a-cuisses-pieds-hauts` positions A et M** : la presse est une **presse inclinée
  à chariot** (semi-allongée) et non la presse horizontale assise : la consigne « dos
  plaqué, bassin au siège » est respectée, mais l'assise est plus basse qu'une presse
  classique. Écart de matériel assumé et documenté.
- **`bulgarian-split-squat-halteres` FEMME** : caméra légèrement plus rapprochée que la
  pose de référence du Thème A (les 3 frames du lot partagent la même caméra).

### Budget d'images IA du 13ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge technique)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `back-squat-charge-moderee` A (depuis la pose de référence `squat-poids-du-corps-A` + paragraphe de masse) | ✅ conforme |
| 2 | `back-squat-charge-moderee` B (depuis `squat-poids-du-corps-B`) | ✅ conforme |
| 3 | `back-squat-charge-moderee` M (appel **interrompu par le user**, relancé ensuite) | ⏹️ interrompu — compté honnêtement |
| 4 | `back-squat-charge-moderee` M (relancé, depuis `squat-poids-du-corps-M`) | ✅ conforme (RMSE A→M = 0,0952) → **livré (`dcacd1c`)** |
| 5 | `presse-a-cuisses-pieds-hauts` A (machine, jambes quasi tendues, pieds hauts) | ✅ conforme |
| 6 | `presse-a-cuisses-pieds-hauts` M (genoux à 90°, dos plaqué) | ✅ conforme (RMSE A→M = 0,2380) |
| 7 | `presse-a-cuisses-pieds-hauts` B tentative 1 (depuis `squat-poids-du-corps-B`) | ❌ rejetée : **vue de profil** + **une seule jambe lisible** (angle incohérent avec A et M) |
| 8 | `presse-a-cuisses-pieds-hauts` B tentative 2 (depuis M, « plateau au plus bas ») | ❌ rejetée : **quasi identique à M** (RMSE 0,019) |
| 9 | `presse-a-cuisses-pieds-hauts` B tentative 3 (depuis A + pose B en 2ᵉ référence) | ❌ rejetée : toujours trop proche de A (RMSE 0,032) |
| 10 | `presse-a-cuisses-pieds-hauts` B tentative 4 (depuis M, **description géométrique** : mollets contre cuisses, genoux vers les aisselles, ~120°) | ✅ **conforme** : même machine, même angle trois-quarts, amplitude plus franche (RMSE M→B = 0,0430) |

**3 images rejetées** (1 changement d'angle + 2 amplitudes insuffisantes), comptées, aucune
intégrée à une animation livrée. Le **`bulgarian-split-squat-halteres` FEMME** (A, M, B) a
été produit dans le **14ᵉ tour** (3 appels, aucun rejet).

### Contrôle d'identité 1:1 (règle du 2026-10-08) — appliqué et CONFORME

| Comparaison | Verdict |
| --- | --- |
| `themeA/_sources/A-02/squat-poids-du-corps-A.png` vs `themeB/_sources/B-02/back-squat-charge-moderee-A.png` | ✅ peau lisse et mate, carrure massive comparable |
| `themeA/_sources/A-02/squat-poids-du-corps-A.png` vs `themeB/_sources/B-02/presse-a-cuisses-pieds-hauts-A.png` | ✅ conforme (même mannequin, même décor) |
| `themeA/femme/_sources/A-02F/squat-poids-du-corps-A.png` vs `themeB/femme/_sources/B-02F/bulgarian-split-squat-halteres-A.png` | ✅ conforme (même femme, même carrure, peau mate lisse) — réserve d'échelle mineure |

---

## THÈME B — LOT B-02 FEMME (1 / 3 exercice livré) — 2026-10-08 (tour 14)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeB/femme/bulgarian-split-squat-halteres-3poses.gif` | Bulgarian split squat haltères FEMME (`dumbbell`) | Un haltère noir dans chaque main le long du corps, pied arrière sur le banc : A = jambe avant tendue · M = demi-descente 45°, genou arrière qui descend sans toucher le sol (RMSE 0,1485) · B = squat bulgare profond 90°, cuisse avant horizontale (RMSE 0,1973) | ✅ **livré (`da499ed`)** |
| `themeB/femme/back-squat-charge-moderee-3poses.gif` | Back squat (charge modérée) FEMME | — | ⬜ prochain tour |
| `themeB/femme/presse-a-cuisses-pieds-hauts-3poses.gif` | Presse à cuisses pieds hauts FEMME | — | ⬜ prochain tour |

**Planche statique livrée :** `themeB/femme/LOT-B02F-bulgarian-split-squat-halteres-PLANCHE-FINALE.jpg` (1440×300).
**Assemblages du lot B-02F à faire une fois les 3 exercices livrés :** `themeB/femme/LOT-B02F-quadriceps.gif` (1420×265) + `themeB/femme/LOT-B02F-PLANCHE-TRAVAIL.jpg` (grille 3×3, 1440×900) — commandes prêtes :
`bash scripts/build-gif-lot-depuis-gifs.sh <out.gif> <ex1.gif> <ex2.gif> <ex3.gif>` puis
`bash scripts/build-planche-grille.sh themeB/femme/_sources/B-02F <out.jpg> "<titre>" FEMME <ex1> <ex2> <ex3>`.

### Budget d'images IA du 14ᵉ tour Fitness 13 — 3 / 10

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `bulgarian-split-squat-halteres` FEMME A (depuis la pose de référence FEMME + paragraphe de masse) | ✅ conforme (contrôle 1:1 OK) |
| 2 | `bulgarian-split-squat-halteres` FEMME M (depuis `A-02F/squat-poids-du-corps-M`) | ✅ conforme (RMSE A→M = 0,1485) |
| 3 | `bulgarian-split-squat-halteres` FEMME B (depuis `A-02F/squat-poids-du-corps-B`) | ✅ conforme (RMSE M→B = 0,1973) → **livré (`da499ed`, 71/614)** |

Aucun rejet, **7 appels d'avance** sur le plafond de 10 : le tour s'arrête après la mise à
jour du suivi (le budget du tour n'est pas consommé pour rien — la suite ouvre le tour 15).

---

## THÈME B — LOT B-03 EN COURS (mise à jour après `069dd4f`)

Le Lot B-02F est terminé. Le Lot B-03 (Jambes — quadriceps) progresse maintenant comme suit ;
ne pas annoncer le lot terminé :

| # | Entrée | Identifiant | Matériel | Statut |
| --- | --- | --- | --- | --- |
| 1 | Back squat | `back-squat` | barre | ⚠️ POC HOMME existant à recontrôler (règle 2) ; FEMME à produire. Ne pas remplacer le POC sans accord explicite. |
| 2 | Squat cycliste (squat complet) | `squat-cycliste-squat-complet` | poids du corps | ✅ HOMME livré (`069dd4f`, 74/614) ; FEMME à produire |
| 3 | Leg press | `leg-press` | machine | ⬜ HOMME + FEMME à produire ; appliquer la recette machine ci-dessous |

### `squat-cycliste-squat-complet` HOMME — livraison `069dd4f`

- Sources A/M/B : `themeB/_sources/B-03/squat-cycliste-squat-complet-{A,M,B}.png` (1376×768),
  créées depuis les poses de référence HOMME validées de `themeA/_sources/A-02/` avec le
  paragraphe de masse musculaire.
- Technique vérifiée en ligne avant génération (règles 6 et 14) : talons surélevés sur un disque,
  pieds rapprochés, pointes vers l'avant, buste droit, genoux dans l'axe, descente contrôlée
  jusqu'au squat complet. Sources : https://www.sport-equipements.fr/squat-cycliste/ ;
  https://smartworkout.app/en/exercise-library/legs/cyclist-squat ;
  https://www.grandestcyclisme.fr/squat-cycliste/.
- RMSE : A→M **0,0778** ; M→B **0,0911** (seuil ≥ 0,030). Contrôle d'identité 1:1 conforme.
- Livrables : `themeB/squat-cycliste-squat-complet-3poses.gif` (460×257, 4 frames) et
  `themeB/LOT-B03-squat-cycliste-squat-complet-PLANCHE-FINALE.jpg` (1440×300).
- La planche animée et la grille du lot B-03 ne sont pas encore à assembler : attendre les
  livrables validés des autres exercices/profils.

### Suite à faire

1. Recontrôler le POC `back-squat` sans le remplacer ; noter le verdict et demander l'accord
   explicite avant toute reprise.
2. Continuer B-03 en HOMME puis FEMME ; vérifier en ligne la technique et `inventaire.json`
   avant chaque génération. `leg-press` est une entrée distincte de
   `presse-a-cuisses-pieds-hauts`.
3. Pour `leg-press`, reprendre la machine dans
   `themeB/_sources/B-02/presse-a-cuisses-pieds-hauts-{A,M,B}.png` et l'identité dans les poses
   de référence validées du Thème A. Pour la FEMME, appliquer la recette documentée
   **« GARDE TOUT, NE BOUGE RIEN — seuls le torse et la tête changent »** ; ne pas réessayer les
   stratégies qui ont fait quitter le plateau aux pieds.

---

## THÈME B — LOT B-02F FEMME COMPLET (3 / 3 exercices, 9 / 9 positions) — 2026-10-08 (tour 15)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeB/femme/bulgarian-split-squat-halteres-3poses.gif` | Bulgarian split squat haltères FEMME (`dumbbell`) | A = jambe avant tendue · M = demi-descente 45° · B = squat bulgare profond 90° | ✅ **livré (`da499ed`)** (tour 14) |
| `themeB/femme/back-squat-charge-moderee-3poses.gif` | Back squat (charge modérée) FEMME (`barbell`) | Barre haute sur les trapèzes, un disque de chaque côté : A = debout, jambes tendues · M = demi-squat 45°, talons au sol (RMSE **0,1470**) · B = squat profond, pliure des hanches sous les genoux (RMSE **0,1707**) | ✅ **livré (`c422d46`)** |
| `themeB/femme/presse-a-cuisses-pieds-hauts-3poses.gif` | Presse à cuisses pieds hauts FEMME (`machine`) | Assise dans la presse inclinée, dos et bassin plaqués au dossier, mains sur les poignées, **pieds HAUTS** sur le plateau : A = jambes quasi tendues (genoux non verrouillés) · M = genoux ~90°, plateau à mi-distance (RMSE **0,0360**) · B = amplitude profonde, plateau proche du buste, genoux ~120° (RMSE **0,2422**) | ✅ **livré (`9e4005c`)** |

**Assemblages du lot (règle 15) :**
- `themeB/femme/LOT-B02F-quadriceps.gif` (1420×265, 4 frames, 3 colonnes, sans `-layers optimize`) ;
- `themeB/femme/LOT-B02F-PLANCHE-TRAVAIL.jpg` (grille 3×3, 1440×900) ;
- planches statiques : `LOT-B02F-bulgarian-split-squat-halteres-PLANCHE-FINALE.jpg`,
  `LOT-B02F-back-squat-charge-moderee-PLANCHE-FINALE.jpg`,
  `LOT-B02F-presse-a-cuisses-pieds-hauts-PLANCHE-FINALE.jpg`.

### 🎯 Recette « REMPLACER L'IDENTITÉ, GARDER LES JAMBES » — nouveau déblocage du tour

Pour la presse à cuisses FEMME, trois stratégies ont échoué **avant** que la bonne soit
trouvée. Elles sont documentées ici pour ne pas les repayée :

| Stratégie | Résultat |
| --- | --- |
| Poser la femme sur la machine en décrivant la scène (réf. femme + réf. machine HOMME) | ❌ la femme s'assied, mais **les pieds ne sont PAS en appui sur le plateau** (jambes « en l'air ») |
| Même consigne + « KEY DETAILS » détaillés (pieds à plat, mains sur les poignées, poussée) | ❌ même échec |
| Inverser l'ordre des références (machine+pose HOMME en 1ʳᵉ, femme en 2ᵉ : « remplace l'homme par la femme ») | ❌ la femme est bien rendue mais **les pieds quittent le plateau** |
| ✅ **« GARDE TOUT, NE BOUGE RIEN — seuls le torse et la tête changent »** : 1ʳᵉ réf. = frame HOMME validée (machine + pose + pieds), 2ᵉ réf. = femme ; consigne « DO NOT MOVE anything about the body: his legs, knees, ankles, and especially BOTH FEET stay EXACTLY where they are… Only the identity changes » | ✅ **conforme du premier coup** : pieds restés sur le plateau, identité FEMME conforme (brassière, tresse, peau lisse) |

**Leçon générale** : quand le générateur refuse d'installer un mannequin SUR un engin, il faut
**garder la frame de l'autre sexe déjà validée** (elle contient la pose ET l'appui corrects)
et ne demander qu'un **changement d'identité**, jamais une re-pose complète.

### Technique vérifiée en ligne avant génération (règle 14)

- **Back squat (charge modérée) FEMME** : barre **sur les trapèzes** (jamais le cou), pieds
  largeur d'épaules, orteils 10-30° ouverts, cassure simultanée hanches/genoux, poids entre
  milieu du pied et talon, cuisses au moins jusqu'à la parallèle, bracing
  ([fitness-lounge](https://www.fitness-lounge.fr/bien-faire-squats-barre/),
  [h2olesangles](https://www.h2olesangles.fr/back-squat/),
  [maboxdecross](https://maboxdecross.fr/mouvement/back-squat)).
- **Presse à cuisses pieds hauts FEMME** : pieds **hauts** sur le plateau → accent fessiers
  et ischio-jambiers ; dos et bassin **plaqués au dossier** (le bassin ne décolle jamais),
  tout le pied en contact, talons ancrés, descente contrôlée jusqu'à ~90°, **genoux jamais
  verrouillés en haut**, genoux dans l'axe des pointes de pieds
  ([flexgymperformance](https://flexgymperformance.fr/blogs/quadriceps/presse-a-cuisses-guide-complet),
  [fitadium](https://www.fitadium.com/conseils/presse-cuisses/),
  [carefitness](https://www.carefitness.com/page/leg-press-guide-hypertrophie-musculaire)).

### Contrôle d'identité 1:1 (règle du 2026-10-08) — appliqué et CONFORME

| Comparaison | Verdict |
| --- | --- |
| `themeA/femme/_sources/A-02F/squat-poids-du-corps-A.png` vs `themeB/femme/_sources/B-02F/back-squat-charge-moderee-A.png` | ✅ peau lisse et mate, carrure massive, tresse, brassière + short noirs |
| `themeA/femme/_sources/A-02F/squat-poids-du-corps-A.png` vs `themeB/femme/_sources/B-02F/presse-a-cuisses-pieds-hauts-A.png` | ✅ conforme (zoom 1:1 du buste : même femme, même silhouette) |

### Réserve honnête du tour (règle 4)

- **`presse-a-cuisses-pieds-hauts` position M** : l'écart avec la position A est **juste
  au-dessus du seuil** (RMSE **0,0360** contre 0,030). Le plateau descend bien d'environ un
  tiers de la course, mais la position A est déjà à genoux légèrement fléchis : la mi-course
  est donc **moins ample** que sur la version HOMME validée. 1 image rejetée avant (RMSE
  0,0256, quasi identique à A), puis 1 correctif par description géométrique explicite.
  *Si le user veut une mi-course plus franche : 1 seule image à refaire (position M).*
- **`presse-a-cuisses-pieds-hauts` matériel** : comme la version HOMME, c'est une **presse
  inclinée à chariot** (semi-allongée) et non la presse horizontale assise — écart assumé
  et documenté (la machine est celle déjà validée au tour 13).
- **`back-squat-charge-moderee` FEMME** : aucun écart relevé ; barre bien sur les trapèzes,
  un disque par côté, talons au sol, profondeur franche en B.

### Budget d'images IA du 15ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge technique)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `back-squat-charge-moderee` FEMME A (depuis `A-02F/squat-poids-du-corps-A` + paragraphe de masse) | ✅ conforme |
| 2 | `back-squat-charge-moderee` FEMME M (depuis `A-02F/squat-poids-du-corps-M`) | ✅ conforme (RMSE A→M = 0,1470) |
| 3 | `back-squat-charge-moderee` FEMME B (depuis `A-02F/squat-poids-du-corps-B`) | ✅ conforme (RMSE M→B = 0,1707) → **livré (`c422d46`, 72/614)** |
| 4 | `presse FEMME` A tentative 1 (réf. femme + réf. machine HOMME) | ❌ rejetée : **pieds non posés sur le plateau** |
| 5 | `presse FEMME` A tentative 2 (consigne « KEY DETAILS » détaillée) | ❌ rejetée : même échec |
| 6 | `presse FEMME` A tentative 3 (références inversées : « remplace l'homme par la femme ») | ❌ rejetée : la femme est bonne mais **les pieds quittent le plateau** |
| 7 | `presse FEMME` A tentative 4 (**« garde tout, seuls le torse et la tête changent »**) | ✅ **conforme du premier coup** → identité FEMME validée au contrôle 1:1 |
| 8 | `presse FEMME` M tentative 1 (consigne « genoux 90°, plateau à mi-course ») | ❌ rejetée : **quasi identique à A** (RMSE 0,0256 < seuil) |
| 9 | `presse FEMME` M tentative 2 (description géométrique : genoux visibles 90°, plateau « much CLOSER », position des pieds rappelée + « ne déplace pas la machine ») | ✅ conforme (RMSE A→M = 0,0360) |
| 10 | `presse FEMME` B (interpolation : 1ʳᵉ réf. = position B HOMME « reproduis la position profonde », 2ᵉ réf. = femme) | ✅ conforme (RMSE M→B = 0,2422) → **lot B-02F complet (`9e4005c`, `30da262`, 73/614)** |

**4 images rejetées** (comptées, pas dissimulées : 3 refus de pose sur la machine + 1 amplitude
insuffisante). Aucune n'est intégrée à une animation livrée.

---

## ⛔ NON-CONFORMITÉ D'IDENTITÉ SIGNALÉE PAR LE USER — 2026-10-08 (PRIORITÉ au prochain tour)

Le user a signalé, planche `LOT-B01-goblet-squat-PLANCHE-FINALE.jpg` en main :
**« l'homme a l'air différent des autres gif »** puis **« il semble moins musclé aussi »**.

### Constat vérifié (comparatif à l'échelle 1:1 avec les poses de référence validées)

| Point contrôlé | Verdict |
| --- | --- |
| Première version du goblet (commit `f11b3b9`) | ❌ **peau striée de fibres grises / aspect écorché**, alors que le style validé est un **blanc argenté LISSE et mat** |
| Silhouette / masse musculaire | ❌ **plus fin que les autres GIF** : épaules moins larges, deltoïdes et pectoraux moins volumineux, bras plus minces → **carrure non conforme** (comparatif 1:1 `themeA/_sources/A-02/squat-poids-du-corps-A.png` vs `goblet-squat-A`) |
| Échelle dans le cadre | ❌ le mannequin est **plus petit** que dans les GIF du Thème A (cadrage trop large) |
| Technique du mouvement | ✅ conforme (haltère vertical au sternum, coudes bas, squat profond, coudes à l'intérieur des genoux) |

### Cause identifiée

Ces frames ont été générées en **partant d'un simple prompt texte** au lieu d'être
**ancrées sur une pose de référence validée**. Le générateur a alors rendu son propre
mannequin (peau striée, carrure plus fine), pas celui du chantier. Même famille de dérive
que les réserves déjà notées (corps « brillant » du mountain climbers, dallage refait en
grandes dalles lisses).

### Remède testé et VALIDÉ (1 image de test, 2026-10-08)

Régénération testée en repartant de la pose de référence validée **et** en ajoutant un
paragraphe de **masse musculaire explicite**. Résultat : **carrure nettement plus massive
et conforme** (épaules très larges, gros deltoïdes, bras épais, pectoraux volumineux), peau
**lisse et mate** — la voie est bonne. Le paragraphe qui a fonctionné (à réutiliser mot
pour mot) :

> He is a VERY muscular, heavily hypertrophied 3D anatomical bodybuilder: extremely wide
> shoulders and big round deltoids, thick massive arms, huge full rounded pectorals, wide
> lats, deep defined abdominals, narrow waist, powerful legs. IMPORTANT: do NOT slim him
> down, do NOT make him leaner or narrower — copy his exact silhouette, shoulder width,
> arm thickness, chest volume and muscle size from this reference image. He must fill the
> frame exactly the same way (same camera, same distance, same framing, same scale).

⚠️ Sur ce test, la **poigne** était en revanche fautive (une main au-dessus de la tête de
l'haltère au lieu de la **coupe à deux mains sous la tête supérieure**) : la prochaine
régénération doit appliquer **les deux consignes à la fois** (masse + poigne en coupe).

### Nouvelle règle de contrôle du chantier (à appliquer AVANT tout assemblage)

1. **Contrôle d'identité** : comparer la nouvelle frame **à 1:1** (même recadrage, aucun
   redimensionnement) avec une **pose de référence validée** (`themeA/_sources/A-02/squat-poids-du-corps-A.png`
   pour l'homme, `themeA/femme/_sources/A-02F/` pour la femme) et vérifier trois points :
   (a) peau blanche argentée **lisse et mate** (aucune fibre grise striée) ;
   (b) **carrure** (largeur d'épaules, volume pectoraux/bras) comparable ;
   (c) **échelle** dans le cadre comparable.
2. **Partir d'une pose de référence validée** — jamais d'un prompt texte seul — dès qu'une
   pose doit être créée « de zéro ».
3. Si la masse musculaire a fondu → **ajouter le paragraphe de masse** ci-dessus.

### ✅ RÉSOLU LE 2026-10-08 (« tour 11 ») — identité rétablie sur les 3 exercices du Lot B-01

| Exercice | Ce qui a été fait | Vérification |
| --- | --- | --- |
| `goblet-squat` HOMME | 3 positions **régénérées** en partant de la pose de référence validée + **paragraphe de masse musculaire** (peau lisse **et** carrure massive) | comparatif **1:1** avec `themeA/_sources/A-02/squat-poids-du-corps-A.png` : carrure, épaules, pectoraux et bras **conformes** ; RMSE A→M = **0,0484**, M→B = **0,0984** (caméra stable) |
| `step-up` HOMME | positions A et M **régénérées** avec la bonne identité, puis **position B produite du premier coup** (1 seul appel) | comparatif 1:1 conforme ; RMSE A→M = **0,0744**, M→B = **0,0789** ; la position B montre bien **le mannequin debout sur le banc**, les deux pieds sur le dessus |
| `bulgarian-split-squat` HOMME | recontrôlé au comparatif 1:1 (il avait été généré depuis les poses de référence, donc épargné par la dérive) | ✅ conforme (carrure identique aux poses du Thème A) |

**Aucune réserve d'identité ne subsiste sur le Lot B-01 HOMME.** La **nouvelle règle de
contrôle** reste en vigueur pour toute la suite du chantier (comparatif 1:1 peau / carrure /
échelle contre une pose de référence validée avant tout assemblage).

⚠️ **Réserve MINEURE résiduelle sur le `goblet-squat`** (assumée, technique et non
d'identité) : en position **B**, l'haltère est **un peu éloigné du sternum** (bras plus
tendus qu'un goblet parfait) et l'haltère paraît **disproportionné** (gros) ; les coudes sont
bien à l'intérieur des genoux et les talons au sol. Si le user veut la perfection sur ce
point, 1 seule image est à refaire (position B).

### État de reprise (matériel déjà payé, conservé dans git)

`themeB/_sources/B-01/_reprise/` :

| Fichier | Contenu | Usage au prochain tour |
| --- | --- | --- |
| `goblet-squat-A-v3-base-massive-poigne-a-corriger.png` | **base la plus conforme en masse** (carrure massive, peau lisse) — poigne fautive (1 main au-dessus) | **référence pour régénérer A** (corriger la poigne), puis M et B depuis ce nouveau A |
| `goblet-squat-M-v2-corps-fin.png` | mi-squat 45°, technique conforme, **corps fin** | référence de POSE uniquement |
| `goblet-squat-B-v2-corps-fin.png` | squat profond 90° coudes aux genoux, **corps fin** | référence de POSE uniquement |
| `step-up-A-v2-corps-fin.png` | départ step-up, pied gauche entier sur le banc, **corps fin** | référence de POSE |
| `step-up-M-v2-corps-fin.png` | mi-montée, pied droit décollé, **corps fin** | référence de POSE |
| `step-up-B-v3-plateforme-corps-fin.png` | **seule pose « debout sur un support » obtenue** en 5 tentatives (support devenu une **marche basse** au lieu du banc long), **corps fin** | référence de POSE (⚠️ support à remplacer par le banc long) |

⚠️ **Le dossier `_sources/B-01/` ne contient plus que les 3 PNG du `bulgarian-split-squat`.**
Les positions du `goblet-squat` et du `step-up` ont été déplacées dans `_reprise/` afin
qu'**aucun assemblage ne puisse se faire par erreur** avec des frames hétérogènes.

---

## THÈME B — MUSCULATION · LOT B-01 HOMME (2 / 3 livré : `bulgarian-split-squat`, `goblet-squat`) — 2026-10-07/08 (`c2efd7d`, `f11b3b9`)

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeB/bulgarian-split-squat-3poses.gif` | Bulgarian split squat HOMME (poids du corps) | Vue trois-quarts avant sur tapis noir avec banc de musculation plat noir derrière : A = départ jambe avant droite tendue, pied arrière gauche en appui sur le banc noir, mains aux hanches · M = demi-descente à ~45°, bras levés pour l'équilibre (réserve : banc noir légèrement plus décalé à droite sur M) · B = squat bulgare profond à 90° (cuisse avant horizontale parallèle au sol, genou arrière bas sous le banc, bras à l'horizontale) | ✅ **livré (`c2efd7d`)** (RMSE A→M = **0,1278**, M→B = **0,1347**) |
| `themeB/goblet-squat-3poses.gif` | Goblet squat HOMME (haltère) | Vue trois-quarts avant sur tapis noir, pieds largeur d'épaules pointes ouvertes : A = debout jambes tendues, **haltère noir tenu verticalement en coupe contre le sternum** (les deux mains sous la tête supérieure, coudes pointés vers le bas) · M = demi-squat contrôlé à ~45°, haltère collé au sternum · B = squat profond 90° (hanches sous la ligne des genoux), **coudes à l'intérieur des genoux**, talons au sol, buste vertical | ⚠️ **livré sous RÉSERVE d'identité (`f11b3b9`, retouché le 2026-10-08)** : technique conforme, **morphologie à reprendre** (carrure plus fine que le reste du chantier ; 1re version à peau striée) → régénération des 3 positions prévue. RMSE A→M = **0,0779**, M→B = **0,0957** (mesure propre, caméra stable) |
| `themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` | Step-up sur banc (hauteur du genou) HOMME | Vue trois-quarts avant, **banc plat noir long** devant le mannequin (hauteur du genou), mains aux hanches : A = **pied gauche entier à plat sur le dessus du banc** (genou gauche ~90°), jambe droite tendue, pied droit au sol sur le tapis · M = mi-montée, poussée dans le talon gauche (jambe gauche à ~135°), hanches au niveau du banc, **pied droit décollé du sol sans élan** · B = **extension complète debout sur le banc**, les deux pieds à plat sur le dessus, jambes tendues, buste vertical | ✅ **livré (64 / 614)** (RMSE A→M = **0,0744**, M→B = **0,0789**, caméra stable) |

**Aperçus dans le dépôt (règle 15) :**
- `themeB/LOT-B01-bulgarian-split-squat-PLANCHE-FINALE.jpg` ;
- `themeB/LOT-B01-goblet-squat-PLANCHE-FINALE.jpg` (1440×300 — A/M/B annotées) ;
- `themeB/LOT-B01-step-up-PLANCHE-FINALE.jpg` (1440×300 — A/M/B annotées) ;
- **planche animée du lot** : `themeB/LOT-B01-quadriceps.gif` (**1420×265, 4 frames**, 3 colonnes :
  `bulgarian-split-squat` / `goblet-squat` / `step-up-sur-banc-hauteur-du-genou`).

### ⚠️ Réserve de méthode importante — la mesure RMSE est « polluée » par le changement de caméra

Le seuil du chantier (`compare -metric RMSE >= 0,030`) suppose implicitement que **seul le
mannequin bouge** entre deux positions. Sur ce tour, le générateur a **aussi** changé la
distance de caméra et l'échelle du mannequin entre les frames. Mesuré sur une bande de
**décor seul** (350×500 sans le mannequin) :

| Comparaison (décor seul) | RMSE normalisé |
| --- | --- |
| `goblet-squat` A → M | **0,3946** |
| `goblet-squat` M → B | 0,2323 |
| `bulgarian-split-squat` A → M *(exercice déjà livré, pour étalonnage)* | 0,1301 |

**Conclusion honnête** : les RMSE du `goblet-squat` (0,3476 et 0,2979) sont **largement
gonflées** par le déplacement de caméra — elles prouvent bien que les positions diffèrent,
mais **pas** que la seule articulation ait bougé. La lisibilité du mouvement a donc été
validée **à l'œil** (debout → demi-squat → squat profond, haltère collé au sternum), pas par
la mesure. Réserve assumée et déclarée : **cadrage et échelle varient entre A (plus large)
et M/B (plus serrés)** sur le `goblet-squat`, comme cela avait déjà été assumé au LOT 4.

### 🚧 EN COURS — `step-up-sur-banc-hauteur-du-genou` HOMME (2 / 3 positions)

| Position | Fichier source | Statut |
| --- | --- | --- |
| A — pied gauche entier à plat sur le banc à hauteur de genou, pied droit au sol sur le tapis, mains aux hanches | `_sources/B-01/step-up-sur-banc-hauteur-du-genou-A.png` | ✅ conforme (le banc est **en travers** devant le mannequin, genou gauche fléchi ~90°, les 2 jambes lisibles) |
| M — montée à mi-course, jambe gauche à ~135°, pied droit décollé du sol sans élan | `_sources/B-01/step-up-sur-banc-hauteur-du-genou-M.png` | ✅ conforme (même banc, même décor que A) |
| B — extension complète debout sur le banc | — | ⬜ **à produire** (4 tentatives rejetées ce tour, voir budget) |

- RMSE A → M = **0,3262** (0,3462 sur recadrage central) — mouvement très lisible.
- **Aucune animation `step-up-...-3poses.gif` n'est livrée ce tour** : l'exercice est
  annoncé **incomplet**, jamais masqué (règle 4). Les 2 positions saines sont conservées
  dans git pour ne pas les payer deux fois (règle 12).

### Budget d'images IA du 11ᵉ tour Fitness 13 — 1 / 10 (aucun rejet, aucun drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `step-up` HOMME **position B** (depuis la position M, avec le vocabulaire « step platform » + « il garde la même longueur et la même place dans le cadre » + le paragraphe de masse) | ✅ **conforme du premier coup** : le mannequin est debout sur le **banc long**, les deux pieds à plat sur le dessus, jambes tendues → `step-up-sur-banc-hauteur-du-genou` **livré** |

**1 seul appel consommé** ce tour. Les positions A et M du step-up et les 3 positions du
goblet avaient été régénérées juste avant (voir la section « RÉSOLU » ci-dessus).

### Assemblage du Lot B-01 HOMME

- `themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` (460×257, 4 frames) ;
- `themeB/LOT-B01-step-up-PLANCHE-FINALE.jpg` (1440×300) ;
- `themeB/LOT-B01-quadriceps.gif` (**1420×265, 4 frames**, 3 colonnes, sans `-layers optimize`) —
  assemblée **depuis les GIF déjà commités** (coalesce + recoloriage `-colors 96`) et non en
  repassant par `build-gif-lot.sh`, précisément pour **ne pas ré-encoder** les GIF
  `bulgarian` et `goblet` déjà livrés (le script les régénère avec une empreinte différente).

### Budget d'images IA du 10ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge technique) — TOUR DE CORRECTION D'IDENTITÉ

Déclenché par le retour du user (« l'homme a l'air différent des autres gif » puis « il
semble moins musclé aussi »). Objectif du tour : réparer l'identité (peau lisse + carrure)
et finir le `step-up`.

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `goblet-squat` A v2 (depuis la pose de référence validée, consigne « peau lisse sans fibres striées ») | ✅ conforme en peau — corrige l'aspect écorché (mais corps encore **fin**) |
| 2 | `goblet-squat` M v2 (depuis `squat-poids-du-corps-M`) | ✅ conforme (RMSE A→M = **0,0779**, caméra stable) |
| 3 | `goblet-squat` B v2 (depuis `squat-poids-du-corps-B`) | ✅ conforme (RMSE M→B = **0,0957**) |
| 4 | `step-up` A v2 (depuis la pose de référence, banc en travers devant) | ✅ conforme (pied gauche entier sur le banc, 2 jambes lisibles) |
| 5 | `step-up` M v2 (chaînée depuis le nouveau A) | ✅ conforme (pied droit décollé, pied gauche toujours sur le banc) |
| 6 | `step-up` B tentative 1 (depuis M, consigne « debout sur le banc ») | ❌ rejetée : le mannequin reste **au sol**, le banc reste vide à côté |
| 7 | `step-up` B tentative 2 (depuis A, consigne « poser le 2ᵉ pied sur le banc ») | ❌ rejetée : même échec (mannequin au sol) |
| 8 | `step-up` B tentative 3 (**changement de vocabulaire : « step platform » au lieu de « bench »**) | ✅ **pose correcte** (debout, jambes tendues, les 2 pieds sur le support) — ⚠️ mais le support est devenu une **marche basse** et non le banc long |
| 9 | `step-up` B tentative 4 (remettre le banc long sous ses pieds) | ⏹️ **appel interrompu par le user** — compté honnêtement, aucune image retenue |
| 10 | `goblet-squat` A v3 (**test du paragraphe de masse musculaire**) | ✅ **carrure massive et conforme, peau lisse** → **remède validé** ; ❌ poigne fautive (1 main au-dessus de l'haltère) → base conservée pour la reprise |

**Bilan du tour : 3 images réellement livrables** (les deux séries restent à régénérer pour
la morphologie) **+ 5 rejets + 1 appel interrompu**. Drapeau rouge : **10 / 10**.
Aucune image rejetée n'est intégrée à une animation livrée. Aucune animation n'a été
annoncée comme terminée à tort.

### Budget d'images IA du 9ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge technique)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `goblet-squat` HOMME A (debout, haltère vertical au sternum, depuis `squat-poids-du-corps-A.png`) | ✅ conforme |
| 2 | `goblet-squat` HOMME M (demi-squat 45°, **depuis `squat-poids-du-corps-M.png` seule** — astuce documentée) | ✅ conforme (RMSE A→M = 0,3476) |
| 3 | `goblet-squat` HOMME B (squat profond, **depuis `squat-poids-du-corps-B.png` seule**) | ✅ conforme (RMSE M→B = 0,2979) → **`goblet-squat` HOMME livré (`f11b3b9`, 63/614)** |
| 4 | `step-up` HOMME A (base indépendante, une seule référence, `only two legs`) | ✅ conforme |
| 5 | `step-up` HOMME M (base indépendante depuis `squat-poids-du-corps-B.png`) | ✅ conforme |
| 6 | `step-up` HOMME B (tentative 1, depuis M) | ❌ rejetée : cadrage beaucoup plus large (mannequin petit) → saut d'échelle dans la boucle |
| 7 | `step-up` HOMME B (tentative 2, depuis M, consigne « même distance ») | ❌ rejetée : zoom serré + **double image fantôme** sur le bord gauche |
| 8 | `step-up` HOMME B (tentative 3, depuis M, consigne « ne pas zoomer ») | ❌ rejetée : **décor entièrement changé** (coucher de soleil sur l'océan, vue de face) |
| 9 | `step-up` HOMME B (tentative 4, interpolation M + frame B rejetée) | ❌ rejetée : le générateur a **retiré la jambe du banc** et reposé les deux pieds sur le tapis — mouvement inversé |
| 10 | `step-up` HOMME B (tentative 5, reprise de M avec consigne « ne bouge pas la caméra, ne touche pas au décor ») | ❌ rejetée : **exactement le même échec** que la tentative 4 (les 2 pieds reposés au sol, le banc à côté du mannequin) → **plafond technique atteint** |

**5 images rejetées** (comptées, pas dissimulées : 1 saut d'échelle, 1 image fantôme,
1 changement de décor, 2 mouvements inversés). Aucune n'est intégrée à une animation
livrée. **Drapeau rouge : 10 / 10 appels `generate_image` consommés ce tour.**
Le générateur refuse, sur cette série, de hisser le mannequin **debout sur le banc**
(il le repose systématiquement au sol). À retenter au prochain tour avec une nouvelle
base (par ex. une position A générée d'emblée avec le mannequin déjà **à genou sur le
banc**, ou une vue de profil) — pistes à essayer, à commencer par la vue de profil.

### Budget d'images IA du 8ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `warmup-approche` FEMME M (tirage vertical à mi-buste, coudes hauts à 90°) | ✅ conforme (RMSE A→M = 0,1004) |
| 2 | `warmup-approche` FEMME B (réception en front-rack aux clavicules) | ✅ conforme (RMSE M→B = 0,1698) → **LOT A-08F/09F FEMME complet livré (`5467b86`, 50/50 Thème A !)** |
| 3 | `bulgarian-split-squat` HOMME A (essai 1, vue de profil vers la droite) | ❌ rejeté (déjà à mi-descente et short noir masqué par la lueur dorée) |
| 4 | `bulgarian-split-squat` HOMME A (essai 2, fusion de 2 références) | ❌ rejeté (artefact anatomique à 3 jambes : 2 pieds au sol + 1 pied sur le banc) |
| 5 | `bulgarian-split-squat` HOMME A (essai 3, vue trois-quarts avant depuis `squat-poids-du-corps-A.png` seule) | ✅ conforme (2 jambes, jambe avant tendue, pied arrière sur le banc, short noir net) |
| 6 | `bulgarian-split-squat` HOMME M (essai 1, chaîné depuis A seule) | ❌ rejeté (quasi immobile, RMSE 0,0365) |
| 7 | `bulgarian-split-squat` HOMME B (squat bulgare profond 90°, cuisse avant horizontale) | ✅ conforme (RMSE A→B = 0,1016) |
| 8 | `bulgarian-split-squat` HOMME M (essai 2, interpolation A+B avec A en 1ᵉʳ) | ❌ rejeté (bras à 45° mais jambes restées debout comme A) |
| 9 | `bulgarian-split-squat` HOMME M (essai 3, chaîné avec B en 1ᵉʳ) | ❌ rejeté (bras à 45° mais jambes restées basses comme B, RMSE M→B = 0,0336) |
| 10 | `bulgarian-split-squat` HOMME M (essai 4, depuis `squat-poids-du-corps-M.png` seule à mi-hauteur 45°) | ✅ conforme (vraie mi-hauteur à 45°, RMSE A→M = 0,1278, M→B = 0,1347) → **livré (`c2efd7d`)** |

### Technique vérifiée en ligne AVANT génération du Lot B-01 (règle 14)

- **Goblet squat (haltère)** *(exercice livré ce tour, `f11b3b9`)* : pieds largeur
  d'épaules, **pointes ouvertes de 10-15°**, haltère (ou kettlebell) maintenu
  **verticalement contre le haut du sternum**, mains **en coupe sous la tête
  supérieure** de l'haltère, **coudes pointés vers le bas** ; descente genoux dans
  l'axe des orteils, **talons ancrés au sol**, torse aussi vertical que possible ;
  descente jusqu'à ce que **les coudes touchent l'intérieur des genoux** (ou hanches
  sous la ligne des genoux), pause d'une seconde en bas, remontée en poussant sur
  les talons ; erreurs à ne pas montrer : charge éloignée du buste, genoux en valgus,
  dos arrondi, talons décollés
  ([h2olesangles](https://www.h2olesangles.fr/globe-squat/),
  [moncoachsportifenligne](https://moncoachsportifenligne.fr/go-let-squat-guide-complet-pour-muscler-jambes-et-fessiers/),
  [ligue-centre-val-de-loire](https://ligue-centre-val-de-loire-judo-jujitsu-da.fr/go-let-squat/),
  [my15minutechallenge](https://www.my15minutechallenge.com/exercices/goblet-squat-avec-rebond/)).
  *Note matériel : la prise haltère est bien celle décrite par
  [moncoachsportifenligne](https://moncoachsportifenligne.fr/go-let-squat-guide-complet-pour-muscler-jambes-et-fessiers/)
  (« on cale une extrémité dans les paumes, mains en coupe sous le disque supérieur ») —
  `inventaire.json` donne bien `goblet-squat` = `["dumbbell"]`.*
- **Step-up sur banc (hauteur du genou)** : surface stable **à hauteur du genou**
  (≈ 40-45 cm : quand le pied est dessus, la cuisse est à peu près parallèle au sol et
  le genou avant fléchi à ~90°) ; **pied d'appui posé ENTIÈREMENT à plat** sur le banc
  (talon compris) ; montée en **poussant uniquement dans le talon du pied posé**, la
  jambe arrière **reste passive et ne donne aucun élan** (elle décolle du sol) ;
  buste droit, abdominaux et fessier contractés ; au sommet, extension complète de la
  jambe d'appui debout sur le banc ; en cas de montée avec levée de genou, la hanche
  et le genou de la jambe libre arrivent à ~90°
  ([louismove](https://louismove.com/kettlebell-step-ups/),
  [gornation](https://www.gornation.com/fr/blogs/calisthenics-exercises/step-up),
  [litobox](https://www.litobox.com/exercice-step-ups),
  [lady-concept](https://lady-concept.fr/7-exercices-infaillibles-pour-sculpter-vos-fessiers/)).
- **Bulgarian split squat (poids du corps)** : un pied posé bien à plat au sol à l'avant,
  l'autre pied surélevé en arrière sur un banc stable à hauteur du genou (dessus du pied
  ou pointe en appui) ; buste droit ou très légèrement incliné vers l'avant, descente
  contrôlée jusqu'à ce que la cuisse avant soit parallèle au sol (genou avant à ~90° dans
  l'axe des orteils) et que le genou arrière s'approche du sol sans le toucher ; poussée
  dans le talon avant pour remonter ([hop-sport](https://hop-sport.fr/blog/bulgarian-split-squat-muscles-sollicites-technique-et-erreurs-a-eviter),
  [fitnesstech](https://www.fitnesstech.be/blogs/noticias/la-fente-bulgare-l-exercice-unilateral-pour-les-jambes-ayant-le-plus-grand-impact-sur-les-fessiers-et-les-quadriceps),
  [docteur-fitness](https://www.docteur-fitness.com/squat-bulgare-avec-halteres),
  [femme.fitness](https://femme.fitness/exercices/bulgarian-squat/),
  [le-pied-dans-la-main](https://le-pied-dans-la-main.fr/maitriser-squat-bulgare/)).
- **Goblet squat (haltère)** *(vérifié pour le prochain tour)* : pieds largeur d'épaules,
  pointes ouvertes de 10-15°, haltère tenu verticalement contre le sternum (mains en coupe
  sous la tête supérieure), coudes pointés vers le bas ; descente buste vertical jusqu'à
  ce que les coudes touchent l'intérieur des genoux/cuisses au point bas, talons collés au
  sol ([gym-studio](https://www.gym-studio.com/exercices/goblet-squat),
  [wod-open](https://wod-open.com/goblet-squat/),
  [epicfitness](https://epicfitness.fr/maitriser-goblet-squat/),
  [creatine-academie](https://www.creatine-academie.com/goblet-squat-technique/)).
- **Step-up sur banc (hauteur du genou)** *(vérifié pour le prochain tour)* : banc à
  hauteur du genou (35-50 cm, genou à ~90° quand le pied est posé), pied d'appui posé
  entièrement à plat sur le banc, montée en poussant dans le talon du pied avant sans
  prendre d'élan avec la jambe arrière qui reste passive ([flexgymperformance](https://flexgymperformance.fr/blogs/quadriceps/step-up-guide-complet),
  [gym-studio](https://www.gym-studio.com/exercices/step-up-halteres),
  [musculation-nutrition](https://musculation-nutrition.fr/step-up-musculation/),
  [arenasportclub](https://arenasportclub.fr/fitness/step-up-debutant-hauteur-support-genou-progression/)).

### Budget d'images IA du 7ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `warmup-approche` HOMME A (barre légère tenue bras tendus devant les cuisses) | ✅ conforme |
| 2 | `warmup-approche` HOMME M (tirage vertical à mi-buste, coudes hauts à 90°) | ✅ conforme (RMSE A→M = 0,0740, M→B = 0,0990) → **LOT A-08/09 HOMME complet livré (`204a8b4`)** |
| 3 | `warmup-route` FEMME A (deux pieds au sol sur tapis noir en départ de foulée) | ✅ conforme |
| 4 | `warmup-route` FEMME M (genou gauche levé à mi-hauteur ~45°) | ✅ conforme (RMSE A→M = 0,0837) |
| 5 | `warmup-route` FEMME B (genou gauche levé haut ~90°, poing gauche levé) | ✅ conforme (RMSE M→B = 0,1078 ; réserve : colline lointaine apparue à gauche en B) → **livré (`b017eb6`)** |
| 6 | `warmup-mobilite` FEMME A (avant-bras et coudes fermés verticalement devant le buste) | ✅ conforme |
| 7 | `warmup-mobilite` FEMME M (rotation externe 90/90 Cactus / W-pose) | ✅ conforme (RMSE A→M = 0,0652) |
| 8 | `warmup-mobilite` FEMME B (grande ouverture thoracique bras grands ouverts en T) | ✅ conforme (RMSE M→B = 0,0475) → **livré (`b932ebd`)** |
| 9 | `warmup-approche` FEMME A (essai 1, chaîné depuis `REF-personnage-feminin.jpg`) | ❌ rejeté (sol changé en grandes dalles lisses au lieu du dallage de pierre irrégulier) |
| 10 | `warmup-approche` FEMME A (essai 2, chaîné depuis `warmup-mobilite-A.png` FEMME) | ✅ conforme (même dallage de pierre irrégulier et même mannequin) → **base prête pour le prochain tour** |

### Budget d'images IA du 6ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `warmup-route` HOMME (genou gauche levé haut) | ✅ conforme → retenu comme Position B finale |
| 2 | `warmup-route` HOMME M (genou gauche à mi-hauteur) | ✅ conforme (RMSE M→B = 0,0994) |
| 3 | `warmup-route` HOMME (essai foulée jambe droite) | ❌ rejeté (a relevé la même jambe gauche) |
| 4 | `warmup-route` HOMME A (deux pieds au sol en départ de foulée) | ✅ conforme (RMSE A→M = 0,0713) → **livré (`8cf93fa`)** |
| 5 | `warmup-mobilite` HOMME A (fermeture coudes/avant-bras devant la poitrine) | ✅ conforme |
| 6 | `warmup-mobilite` HOMME M (ouverture 90/90 Cactus / rotation externe) | ✅ conforme (RMSE A→M = 0,0586) |
| 7 | `warmup-mobilite` HOMME B (grande ouverture thoracique bras grands ouverts) | ✅ conforme (RMSE M→B = 0,0553) → **livré (`d698285`)** |
| 8 | `warmup-approche` HOMME (debout barre légère en front-rack aux clavicules) | ✅ conforme → retenu comme Position B finale (`warmup-approche-B.png`) |
| 9 | `warmup-approche` HOMME M (essai 1 squat depuis front-rack) | ❌ rejeté (barre horizontale verrouillée par l'IA, buste non descendu) |
| 10 | `warmup-approche` HOMME M (essai 2 squat avec réf squat) | ❌ rejeté (même verrouillage de la hauteur de la barre par l'IA → passage à A barre aux cuisses → M tirage mi-buste → B front-rack) |

### Budget d'images IA du 5ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `hip-thrust-unilateral-1-jambe` HOMME M (essai 1) | ❌ rejeté (bassin resté bas, RMSE dû à la lueur dorée) |
| 2 | `hip-thrust-unilateral-1-jambe` HOMME M (essai 2, bassin monté au niveau du banc) | ✅ conforme (RMSE A→M = 0,1502) |
| 3 | `hip-thrust-unilateral-1-jambe` HOMME B (extension complète en table horizontale) | ✅ conforme (RMSE M→B = 0,1194) → **LOT A-05 HOMME complet livré (`5346b43`)** |
| 4 | `respiration-diaphragmatique` FEMME A (inspiration diaphragmatique ventrale) | ✅ conforme (réserve : cuisse dorée en A) |
| 5 | `respiration-diaphragmatique` FEMME M (expiration contrôlée, ventre revenu à plat) | ✅ conforme (RMSE A→M = 0,0865) |
| 6 | `respiration-diaphragmatique` FEMME B (essai 1, anneaux lumineux autour de la taille) | ❌ rejeté (artefact anneaux lumineux "belt") |
| 7 | `respiration-diaphragmatique` FEMME B (essai 2, creux physique sous-costal) | ✅ conforme (RMSE M→B = 0,1106) → **livré (`beb04bf`)** |
| 8 | `hip-thrust-unilateral-1-jambe` FEMME A (omoplates sur banc noir, bassin bas) | ✅ conforme |
| 9 | `hip-thrust-unilateral-1-jambe` FEMME M (montée intermédiaire, genou droit haut) | ✅ conforme (RMSE A→M = 0,0842 ; réserve : bassin encore bas en M) |
| 10 | `hip-thrust-unilateral-1-jambe` FEMME B (extension complète en table horizontale) | ✅ conforme (RMSE M→B = 0,1706) → **LOT A-05 FEMME complet livré** |

### Technique vérifiée en ligne avant génération du LOT A-05 (règle 14)

- **Respiration diaphragmatique & Stomach Vacuum (transverse)** : allongé sur le dos,
  genoux fléchis, pieds à plat au sol (relâche les psoas et le bas du dos) ; inspiration
  lente par le nez en laissant l'abdomen se soulever sous la main sans hausser les
  épaules, puis expiration lente par la bouche en rentrant le nombril vers la colonne
  vertébrale (engagement profond du transverse / stomach vacuum hypopressif sous les
  côtes) ([pleinementgivre](https://pleinementgivre.fr/respiration-abdominale-diaphragmatique/),
  [souffle-conscient](https://souffle-conscient.fr/respiration-diaphragmatique-bienfaits-exercices-guide-complet-2026/),
  [louismove](https://louismove.com/stomach-vacuum/),
  [nievremedical](https://nievremedical.fr/stomach-vacuum-taille/)).
- **Hip thrust unilatéral (1 jambe)** : se distingue du pont fessier au sol par l'appui
  du **haut du dos (pointe des omoplates) sur un banc** ; une jambe est décollée du sol
  (genou fléchi à 90° en l'air), poussée à travers le talon du pied d'appui jusqu'à
  l'alignement complet genou-hanches-épaules au sommet (tibia d'appui vertical à 90°),
  gainage engagé pour ne pas cambrer les lombaires ni laisser le bassin basculer
  ([docteur-fitness](https://www.docteur-fitness.com/hip-thrust-unilateral),
  [hevyapp](https://www.hevyapp.com/exercises/single-leg-hip-thrust/),
  [puregym](https://www.puregym.com/exercises/glutes/hip-thrusts/single-leg-hip-thrust/),
  [muscleandstrength](https://www.muscleandstrength.com/exercises/single-leg-hip-thrust)).

### Budget d'images IA du 4ᵉ tour Fitness 13 — 10 / 10 (drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `pallof-press` FEMME M (mains poussées à mi-course devant la poitrine) | ✅ conforme (RMSE A→M = 0,0595) |
| 2 | `pallof-press` FEMME B (essai 1, buste revenu de face) | ❌ rejeté (buste tourné face caméra, tresse masquée) |
| 3 | `pallof-press` FEMME B (essai 2, angle 3/4 conservé, bras verrouillés à 180°) | ✅ conforme (RMSE M→B = 0,0949) → **livré (`8686998`)** |
| 4 | `face-pull` FEMME A (vue 3/4 arrière face au poteau gauche, bras tendus) | ✅ conforme |
| 5 | `face-pull` FEMME M (tirage mi-course, coudes hauts à hauteur d'épaule) | ✅ conforme (RMSE A→M = 0,0578) |
| 6 | `face-pull` FEMME B (rotation externe 90°, mains aux tempes/oreilles) | ✅ conforme (RMSE M→B = 0,0511) → **LOT A-04 FEMME complet livré (`2a202a4`)** |
| 7 | `respiration-diaphragmatique` HOMME A (allongé genoux fléchis, inspiration ventrale) | ✅ conforme |
| 8 | `respiration-diaphragmatique` HOMME M (expiration contrôlée, ventre revenu à plat) | ✅ conforme (RMSE A→M = 0,0616) |
| 9 | `respiration-diaphragmatique` HOMME B (stomach vacuum hypopressif / transverse engagé) | ✅ conforme (RMSE M→B = 0,1144) → **livré (`1ca6f4e`)** |
| 10 | `hip-thrust-unilateral-1-jambe` HOMME A (omoplates sur banc noir, bassin bas, jambe droite levée à 90°) | ✅ conforme → **base prête pour le prochain tour** |

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

## THÈME B — LOT B-01F FEMME COMPLET (3 / 3 exercices, 9 / 9 positions) — 2026-10-08

| Fichier | Exercice | Positions | Statut |
| --- | --- | --- | --- |
| `themeB/femme/bulgarian-split-squat-3poses.gif` | Bulgarian split squat FEMME (poids du corps) | Vue trois-quarts avant, banc noir derrière : A = jambe avant tendue, pied arrière sur le banc · M = demi-descente à ~45° · B = squat bulgare profond 90° | ✅ **livré (`701aa95`)** |
| `themeB/femme/goblet-squat-3poses.gif` | Goblet squat FEMME (haltère) | Haltère noir tenu verticalement en coupe contre le sternum : A = debout · M = demi-squat 45° · B = squat profond, coudes à l'intérieur des genoux | ✅ **livré (`cb562cb`)** |
| `themeB/femme/step-up-sur-banc-hauteur-du-genou-3poses.gif` | Step-up sur banc (hauteur du genou) FEMME | Banc plat noir long devant elle, mains aux hanches : A = pied gauche entier à plat sur le banc, genou ~90°, pied droit au sol · M = mi-montée, poussée dans le talon gauche (jambe ~135°), pied droit décollé sans élan · B = extension complète debout sur le banc, les deux pieds à plat sur le dessus, jambes tendues | ✅ **livré (`857a674`)** (RMSE A→M = **0,0826**, M→B = **0,1809**) |

**Assemblages du lot (règle 15) :**
- `themeB/femme/LOT-B01F-quadriceps.gif` (1420×265, 4 frames, 3 colonnes, sans `-layers optimize`) ;
- `themeB/femme/LOT-B01F-PLANCHE-TRAVAIL.jpg` (grille 3×3, 1440×900) ;
- planches statiques : `LOT-B01F-bulgarian-split-squat-PLANCHE-FINALE.jpg`,
  `LOT-B01F-goblet-squat-PLANCHE-FINALE.jpg`, `LOT-B01F-step-up-PLANCHE-FINALE.jpg`.

### 🎯 Nouveau déblocage technique — l'INTERPOLATION à deux références

La position B du step-up **résiste** au générateur : 3 tentatives FEMME refusées
(le mannequin reste au sol, le banc vide à côté), exactement comme les 5 tentatives
HOMME. La recette qui a fonctionné pour la FEMME (et qui complète celle documentée
pour l'HOMME) :

1. **référence 1 = la frame FEMME** (identité + caméra + décor qu'on veut garder) ;
2. **référence 2 = la frame HOMME déjà validée** qui montre la pose à obtenir, avec la
   consigne explicite « the SECOND image shows ONLY THE POSE to reproduce — do NOT copy
   the man, reproduce only the POSITION of the body » ;
3. dans le prompt : **jamais le mot « bench »** → « **long solid black rectangular STEP
   PLATFORM** (a plyometric step at knee height, long enough to extend well on both sides
   of her feet) », et la formule « **she is the one who is high : both of her sneakers are
   planted flat on the black top surface, the step platform is directly UNDER her feet,
   carrying her whole weight** » ;
4. rappeler « she keeps her exact silhouette, do NOT slim her down, do NOT make her
   leaner » (paragraphe de masse) et « the platform keeps EXACTLY the same length and the
   same place in the frame ».

### Budget d'images IA du 12ᵉ tour Fitness 13 — 3 / 10 (aucun drapeau rouge)

| # | Appel | Résultat |
| --- | --- | --- |
| 1 | `step-up` FEMME B (depuis M, « long black flat bench is used as a step platform ») | ❌ rejetée : la femme reste **au sol**, le banc vide à côté |
| 2 | `step-up` FEMME B (depuis M, recette HOMME exacte : « STEP PLATFORM », jamais « bench », + paragraphe de masse) | ❌ rejetée : même échec, elle reste au sol |
| 3 | `step-up` FEMME B (**interpolation à 2 références** : frame FEMME + pose HOMME validée, « reproduce only the POSITION ») | ✅ **conforme** : debout sur le banc long, les deux pieds à plat sur le dessus, jambes tendues → `step-up` FEMME **livré (`857a674`, 67/614)** |

**2 rejets comptés, 1 image retenue.** Les 2 images rejetées ne sont **pas** conservées
dans git (elles ne servent à rien pour la reprise). Le GIF et la planche ont été contrôlés
visuellement (3 frames + zooms des pieds, de la tenue et de la tresse) avant commit.

### Contrôle d'identité 1:1 (nouvelle règle du 2026-10-08) — appliqué et CONFORME

Comparatif à l'échelle 1:1 (aucun redimensionnement) avec les poses de référence validées :

| Comparaison | Verdict |
| --- | --- |
| `themeA/_sources/A-02/squat-poids-du-corps-A.png` vs `themeB/_sources/B-01/goblet-squat-A.png` | ✅ peau **lisse et mate**, carrure massive comparable |
| `themeA/_sources/A-02/squat-poids-du-corps-A.png` vs `themeB/_sources/B-01/step-up-...-A.png` | ✅ conforme |
| `themeA/femme/_sources/A-02F/squat-poids-du-corps-A.png` vs `themeB/femme/_sources/B-01F/goblet-squat-A.png` | ✅ conforme (même femme, même carrure, même décor) |
| `themeA/femme/_sources/A-02F/squat-poids-du-corps-A.png` vs `themeB/femme/_sources/B-01F/step-up-...-A.png` | ✅ conforme |

✅ **La non-conformité d'identité signalée par le user le 2026-10-08 est donc RÉSOLUE**
sur les 6 animations du Lot B-01 (3 HOMME + 3 FEMME) : peau lisse et mate, carrure massive,
échelle homogène dans le cadre.

---

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


## Précisions utilisateur — reprise du 9 octobre 2026

- Le drapeau rouge signale uniquement la limite de discussion du chat : préparer alors
  la consigne et la passation. Il ne signale pas le budget de génération d'images.
- Objectif suivant : **10 nouveaux GIFs**, avec planches consultables et téléchargeables
  sur GitHub dès chaque exercice complet. Le plafond reste 10 appels image par tour,
  rejets inclus ; 10 GIFs à trois poses nécessitent plusieurs tours.
- Avant génération, rechercher la technique dans des sources fitness, GB Performance,
  YouTube et autres sources pertinentes ; consigner uniquement les sources réellement
  consultées et signaler les éventuelles restrictions d'accès.
- Reprise sur `arena/7967ce00-jarvis-fitness-yanis-emilie-ap`, historique `cafe252`
  récupéré par avance rapide depuis la branche précédente, sans changement de branche.
- Ce tour est un bilan avant production : **0 appel image, 0 nouveau GIF**.
- Ordre prévu : 4 GIFs manquants B-03 (leg press H ; back squat, squat cycliste et
  leg press F), puis 6 GIFs B-04 (leg extension, front squat, fentes bulgares haltères
  pied avant surélevé, H et F). Le POC back squat H reste intact et hors de ces 10 nouveautés.
- Vérification fichiers : sources A/M/B du squat cycliste H présentes, GIF 460×257
  à 4 frames, planche 1440×300. POC back squat présent mais toile portrait 480×860,
  non conforme au format paysage actuel ; examen visuel détaillé encore à faire.
- Compteur historique conservé : 74/614, 540 restantes. Le dénominateur historique
  « Thème B : 14/187 » nécessite une harmonisation avec le périmètre H+F avant
  d'en tirer un pourcentage ; ne pas le modifier sans audit.


## Tour de production — 9 octobre 2026 (après `bcf19f2`)

**Résultat : 0 nouveau GIF livré ; compteur inchangé 74/614, 540 restantes.**
Objectif de 10 nouveaux GIFs : 0/10 terminé. Aucun GIF existant modifié.
Branche active : `arena/7967ce00-jarvis-fitness-yanis-emilie-ap`.

### Audit POC back squat HOMME
Lecture des frames coalescées A/M/B : corps entier et chaussures visibles en A (contrairement
à une ancienne note « torse seul »), mais disques coupés aux bords gauche/droit, format
portrait 480×860, B revient debout au lieu de montrer une troisième profondeur.
Verdict : non conforme au standard actuel paysage / trois poses distinctes. Conservé intact ;
aucune correction sans accord explicite. Son décompte historique est conservé, pas revalidé.

### Recherches et matériel
- `inventaire.json` : leg-press = machine ; squat-cycliste-squat-complet = bodyweight.
- Pages réellement consultées pour leg press :
  https://www.magicfit.fr/les-conseils-du-coach-lexercice-leg-press/
  https://gravitus.com/guides/exercises/leg-press/
  Repères : pieds milieu du plateau, appuis complets, genoux dans l'axe, dos/bassin soutenus,
  amplitude compatible avec maintien du bassin, pas d'hyperextension des genoux.
- Pages réellement consultées pour squat cycliste :
  https://www.sport-equipements.fr/squat-cycliste/
  https://smartworkout.app/en/exercise-library/legs/cyclist-squat
  Repères : pieds rapprochés, talons surélevés, buste redressé, genoux dans l'axe,
  descente contrôlée à parallèle ou sous parallèle selon mobilité. Disque OU cale possible.
- Recherches GB Performance et YouTube réalisées, sans tutoriel pertinent exploitable trouvé.
  Aucune vidéo visionnée ; ne pas les citer comme validations techniques.
- Référence B-02 : siège/chariot sur rails inclinés et plateau fixe dans l'image ; ne pas
  confondre avec une presse classique à siège fixe et plateau mobile.

### Budget exact : 10/10 appels generate_image (pas un drapeau de limite de chat)
| Appel | Essai | Verdict |
|---|---|---|
| 1 | Leg press H A | Rejet : pieds encore hauts, marquage doré inadéquat |
| 2 | Leg press H A, plateau agrandi | Rejet : appuis masqués, marquage musculaire absent |
| 3 | Leg press H A, nouvelle consigne | Rejet après crop des pieds : variante pieds hauts persistante |
| 4 | Cycliste F A frontal sur disque | Rejet : contact avant-pieds/tapis non convaincant, effet flottant |
| 5 | Cycliste F A depuis homme + identité femme | Rejet : disque à côté des pieds |
| 6 | Cycliste F A depuis référence femme M | Rejet : disque derrière sans appui des talons |
| 7 | Cycliste F A avec cale inclinée | Retenu comme base de reprise ; pieds en appui, identité contrôlée 1:1 |
| 8 | Cycliste F M depuis A retenue | Travail non validé : flexion trop faible |
| 9 | Cycliste F B depuis A retenue | Rejet : profondeur proche de M, pas de squat complet |
| 10 | Cycliste F B avec référence hauteur B en premier | Travail non validé : plus bas, encore insuffisant pour squat complet |

### Fichiers conservés et contrôles
- Pose A retenue : `themeB/femme/_sources/B-03F/squat-cycliste-squat-complet-A.png`.
- M et B non validées : `themeB/femme/_travail/B-03F/squat-cycliste-squat-complet-{M,B}.png`.
  NE PAS utiliser ces essais comme références validées ni assembler un GIF final avec eux.
- Planche : `themeB/femme/LOT-B03F-squat-cycliste-PLANCHE-TRAVAIL.jpg` (1440×300),
  explicitement marquée TRAVAIL NON LIVRE, pas une planche finale de lot.
- Sources conservées 1376×768 ; MD5 distincts et sans doublon PNG dans le chantier.
- RMSE des essais A→M = 0,0489463 ; M→B = 0,112622. Les seuils passent,
  mais ne prouvent PAS la justesse technique : amplitude visuelle refusée.
- Contrôle buste 1:1 sans redimensionnement entre A retenue et référence femme Thème A M :
  tenue, tresse, peau et carrure cohérentes. La référence femme A est 920×513 ; utiliser M
  1376×768 pour le contrôle d'échelle à 1:1, ne pas comparer des tailles différentes.
- Les autres essais rejetés ne sont pas conservés dans Git.

### Prochaine reprise
Priorité : corriger M/B du squat cycliste F, en repartant de A retenue et d'une référence
validée de hauteur ; conserver la cale, l'orientation et les appuis. Pas de génération depuis
les essais non conformes. Puis reprendre leg press H/F et back squat F. B-04 attend.
B-03 reste incomplet. Aucun assemblage final de lot, aucune intégration applicative.


## Reprise suivante — 9 octobre 2026 (après `1f099e7`)

**Avancement réel : squat cycliste FEMME 2 poses retenues / 3 (A et nouvelle M).
B reste non validée. Aucun GIF nouveau : 74/614, 540 restantes, objectif 10 GIFs = 0/10.**

Le user a demandé « Poursuis » et ce que veut dire « travail non livré ». Réponse :
une planche d'essais consultable n'est pas une animation achevée, contrôlée et comptée.
Ni les essais ni les animations finales de ce chantier ne sont intégrés au code applicatif
sans validation d'intégration distincte. Aucun ancien GIF livré ou POC modifié ce tour.

### Vérifications de reprise
HEAD local et distant de la branche de session = `1f099e7` avant travail ; arbre propre.
Inventaire vérifié : `squat-cycliste-squat-complet`, matériel `bodyweight`.

### Nouvelles sources effectivement consultées
- Women's Health, texte technique, cale sous talons, stance étroite et profondeur contrôlée :
  https://www.womenshealthmag.com/uk/fitness/strength-training/a70232060/cyclist-squats-for-stronger-quads/
- YouTube, Katie Orlic, « Cyclist Squats » : **description et transcription consultées**,
  pas une lecture vidéo image par image. Repères : genoux vers l'avant, fesses vers talons,
  buste relevé, bassin/épaules remontant ensemble.
  https://www.youtube.com/watch?v=Hvop-AYzB-I
- SimpliFaster / Alan Bishop : texte et photo « Hands Free Cyclist Squat » examinés.
  Référence auxiliaire de profondeur : ischios proches des mollets, bassin sous les genoux.
  Le mannequin FEMME et le mouvement sans charge restent ceux du chantier (pas copie du
  coach, de la barre ni de la salle).
  https://simplifaster.com/articles/squat-progression-that-works/
  Photo : https://simplifaster.com/wp-content/uploads/2025/06/Image_1_HFCS.jpg
- Recherche GB Performance renouvelée : pas de ressource spécifique exploitable identifiée.
  Les images de recherche génériques et les photographies externes ne sont pas ajoutées au dépôt.

### 8 appels generate_image, arrêt volontaire avant le plafond de 10
| # | Guidage | Verdict |
|---|---|---|
| 1 | Depuis A, demande de flexion complète | Pas assez bas pour B, mais **retenu comme M** après contrôles : descente intermédiaire distincte et appuis conservés |
| 2 | A + guide géométrique auxiliaire (dessin de joints) | Refus B : profondeur insuffisante et tresse déplacée |
| 3 | Guide géométrique en premier + A | Refus B : encore une demi-flexion |
| 4 | Photo technique SimpliFaster + A validée | Refus B : reste au-dessus de la profondeur demandée |
| 5 | Zone du personnage masquée sur A + photo technique + crop identité A | Refus B : profondeur insuffisante, marquage/carrure changent |
| 6 | Photo technique + crop identité A seulement | Refus B : décor, cadrage et cale changent, profondeur non résolue |
| 7 | Depuis A, consigne de position accroupie près des talons | Refus B : trop peu profond ; conservé uniquement pour illustrer le blocage sur la planche |
| 8 | Depuis la nouvelle M retenue, continuer la descente | Refus B : changement trop faible, pas une position finale complète |

Les guides dessinés/masques sont auxiliaires, pas des poses validées. Aucune image générée
refusée n'a été utilisée comme référence pour un autre appel. L'appel 8 part de M, acceptée
comme position intermédiaire, jamais acceptée comme B. Ne pas répéter aveuglément ces huit
approches : le générateur reste ancré dans des flexions partielles.

### Contrôles et fichiers conservés
- A inchangée : `themeB/femme/_sources/B-03F/squat-cycliste-squat-complet-A.png`.
- **Nouvelle M retenue** : `themeB/femme/_sources/B-03F/squat-cycliste-squat-complet-M.png`.
  1376×768, MD5 `761b22b25abbed9f78d6302d09a65fc7`, aucun doublon parmi les PNG du chantier.
- A→M : RMSE normalisée **0,0944469** (> 0,030).
- B refusée illustrée : `themeB/femme/_travail/B-03F/squat-cycliste-squat-complet-B.png`.
  M→essai B : RMSE **0,0778191** ; seuil passé mais amplitude visuelle NON conforme.
- Buste A/M inspecté par crops sans redimensionnement (échelle 1:1) : identité, tenue,
  carrure et peau cohérentes. Crop des pieds M : semelles en appui sur la cale.
- Planche mise à jour : `themeB/femme/LOT-B03F-squat-cycliste-PLANCHE-TRAVAIL.jpg`, 1440×300,
  texte « EN COURS — 2 poses retenues / 3 — aucun GIF livré » ; B explicitement refusée.
- Ancien essai M dans `_travail` reste un essai OBSOLÈTE ; ne pas le confondre avec M retenue
  dans `_sources`. Aucun GIF assemblé avec une pose non validée.

### Suite et limite constatée
Il manque la vraie position basse B du cycliste F ; conserver A/M, ne pas annoncer terminé.
Une autre méthode de contrôle de pose doit être évaluée avant de relancer les mêmes prompts.
Leg press H/F et back squat F toujours à produire ; B-04 non commencé.
Le compteur de chat n'est pas concerné par cet arrêt : aucun drapeau rouge.

## Nouvelle livraison — squat cycliste FEMME, 9 octobre 2026

**75/614 animations livrées · 539 restantes. Objectif des 10 nouveaux GIFs : 1/10 livré.**

- A et M conservées ; B désormais produite et retenue après contrôle rapproché : bassin
  sous le niveau des genoux, appuis sur cale conservés, buste et identité cohérents à 1:1.
- Sources A/M/B : `themeB/femme/_sources/B-03F/squat-cycliste-squat-complet-{A,M,B}.png`
  (1376×768).
- GIF : `themeB/femme/squat-cycliste-squat-complet-3poses.gif` (460×257, 4 frames A/M/B/M).
- Planche finale : `themeB/femme/LOT-B03F-squat-cycliste-squat-complet-PLANCHE-FINALE.jpg`
  (1440×300). L'ancienne planche TRAVAIL et `_travail` sont historiques, pas la livraison.
- RMSE A→M **0,0944469**, M→B **0,0842215**. Trois PNG distincts et aucun doublon PNG/GIF
  dans le chantier. Contrôles visuels, identité 1:1 et crops des pieds effectués.
- B-03 reste incomplet : leg press H/F et back squat F encore à produire ; POC back squat H
  audité, conservé avec réserves (portrait, disques coupés, troisième pose debout).
- La validation visuelle finale de l'utilisateur reste attendue ; aucune intégration applicative.

### Reprise et méthode ayant débloqué la pose
Le sandbox était revenu à `ddd1fb9`. Historique de la branche autorisée récupéré par fetch et
avance rapide jusqu'à `f704658`, sans reset destructif ni changement de branche.
Matériel confirmé dans inventaire : `bodyweight`. Transcription YouTube relue avant génération :
https://www.youtube.com/watch?v=Hvop-AYzB-I (genoux en avant, bassin vers talons, buste relevé).
Les autres sources techniques de la reprise précédente restent applicables :
https://www.womenshealthmag.com/uk/fitness/strength-training/a70232060/cyclist-squats-for-stronger-quads/
https://simplifaster.com/articles/squat-progression-that-works/

**2 appels image pour achever cet exercice :**
1. Guide articulé dérivé de M validée + M complète : rejet, la génération recopie encore
   la demi-flexion de M.
2. Même guide articulé + **crop du buste de M validée uniquement** : B retenue. Retirer
   la référence corps entier a permis de conserver la position basse du guide.

Guide auxiliaire : découpage/rotation des segments de M validée, translation du torse
(-25,+110 px), hanches vers y590, genoux vers y530, chevilles fixes. Le guide brut comporte
volontairement des coutures : jamais utilisé dans le GIF. Seule l'image IA nettoyée,
contrôlée, est utilisée. Aucune image générée refusée n'a servi de référence. Le crop identité
M est 360×310 à +445+116, sans redimensionnement. Le buste B comparé à M à 1:1 est cohérent.

La source B retenue a MD5 `ffcd57ec108750a18e9b8753666f8ffc` ; GIF MD5
`651966f9d4478e27f4f548c27bde0bc1`. Boucle contrôlée A/M/B/M, durées 130/110/130/110 centièmes.
Le dénominateur historique du Thème B (187) reste à harmoniser avec le périmètre H+F ;
ne pas utiliser ce ratio comme pourcentage sans audit.

### Fin du tour de livraison `d83b70c` — bilan exact

- **4 appels generate_image au total** : 2 pour achever le cycliste F (1 rejet + B retenue),
  puis 2 essais de leg press H A rejetés. Arrêt volontaire avant le plafond de 10.
- **1 nouveau GIF livré**, cycliste FEMME (`d83b70c`), objectif 10 GIFs = **1/10**.
  Compteur global **75/614**, 539 restantes. Aucun ancien GIF modifié.
- Leg press : inventaire vérifié (`machine`), page réellement consultée avant génération :
  https://gravitus.com/guides/exercises/leg-press/
  Repères pieds au centre, dos/bassin soutenus, genoux non hyperétendus. Attention : cette
  source décrit surtout un plateau mobile ; notre référence B-02 représente un siège-chariot
  mobile et un plateau fixe. Ne pas confondre leurs cinématiques.
- Appel 3 : référence machine B-02 M + crop identité HOMME Thème A ; jambes presque tendues,
  plateau plus haut. **Refus après crop** : chaussures trop masquées, contacts des semelles
  non vérifiables. Pas de pose A retenue.
- Appel 4 : mêmes références valides, demande d'angle davantage de profil pour rendre les
  pieds visibles. **Refus** : angle non obtenu, plateau masque toujours les appuis.
- Ces deux essais ne sont pas sauvegardés dans les livrables ni comptés comme progression
  du nombre de poses. Ne pas répéter la demande de profil à l'identique depuis la même image.
- Prochaine étape : établir une pose de référence de leg press standard dont les deux appuis
  soient vérifiables ; puis M/B et version FEMME. Back squat FEMME demeure à produire.
- B-03 incomplet ; B-04 non commencé ; aucune intégration dans l'application.

## Livraison leg press HOMME — 9 octobre 2026 (reprise après `261b3cb`)

**76/614 animations livrées, 538 restantes. Objectif des 10 nouveaux GIFs : 2/10 livré,
8 restants.** Nouvelle livraison : `leg-press` HOMME B-03, différente de la presse pieds hauts.

### Reprise et recherche technique
Le sandbox était revenu à `ddd1fb9`. Fetch puis merge --ff-only de la branche autorisée
`arena/7967ce00-jarvis-fitness-yanis-emilie-ap` jusqu'à `261b3cb`, sans changement de branche.
Inventaire relu : `leg-press`, matériel `machine`.

Sources effectivement consultées avant génération :
- MagicFit, texte installation/exécution : dos/bassin soutenus, genoux dans l'axe,
  extension sans verrouillage et pieds à plat :
  https://www.magicfit.fr/les-conseils-du-coach-lexercice-leg-press/
- FitRated, texte sur presse compacte à siège mobile et plateau fixe :
  https://www.fitrated.com/gear/strength-training/force-usa-compact-leg-press-review/
- YouTube Stevie Richards Fitness, **description et transcription** de la présentation
  Force USA Compact Leg Press (pas de visionnage vidéo image par image) : plateau réglable,
  pieds au milieu, rouleaux/chariot, différences avec la presse à plateau mobile :
  https://www.youtube.com/watch?v=OYZembAJ5II
- Photo de démonstration latérale examinée pour voir les deux chaussures sur le plateau :
  https://livefit.com/products/force-usa-compact-leg-press?variant=40021485977702
  Image : https://livefit.com/cdn/shop/products/clp-woman-side.jpg?v=1674594143&width=1214
  La photo sert au cadrage/à la cinématique, pas à l'identité. Photo externe non ajoutée au dépôt.

### Nouveau cadrage et recette
Les précédents essais masquaient les pieds. Un cadrage davantage latéral a été établi avec
la photo technique, un crop de l'identité HOMME Thème A et des crops de décor/châssis B-02.
Même famille de machine (siège sur rails inclinés, plateau fixe), mais illustration propre
à `leg-press`, avec pieds au centre et visibles. Ce n'est pas un renommage du GIF pieds hauts.

La première image demandée comme M était plus fléchie ; elle a été retenue comme **B**
après inspection. A et M ont ensuite été obtenues par guides articulés dérivés de cette B :
- A : translation siège/torse/dossier/poignées (+43,-43 px), pieds fixes ;
- M : translation (+23,-23 px), pieds fixes ;
- rotation des segments de jambes avec joints projetés, puis nettoyage IA du guide ;
- l'identité utilisée en complément est un crop du buste B, sans redimensionnement.
Les guides bruts ne sont jamais utilisés dans le GIF final. Pas de chaîne vers une nouvelle
pose depuis une image générée refusée. Les deux derniers appels sont des corrections locales
de raccord sur la même pose, pas des références pour une nouvelle pose.

### 8 appels generate_image au total
| # | Demande | Résultat |
|---|---|---|
| 1 | Cadrage latéral technique + identité H + crops B-02 | Retenu comme B, après vérification des pieds et flexion |
| 2 | A directement depuis B | Rejet : siège presque inchangé, extension insuffisante |
| 3 | M directement depuis B | Rejet : déplacement/amplitude trop faibles |
| 4 | Guide articulé A + crop identité B | Pose retenue provisoirement ; marche parasite dans le muret à corriger |
| 5 | Guide articulé M + crop identité B | Rejet : rendu portrait, cadrage/machine changés |
| 6 | Guide articulé M seul, paysage explicite | Pose retenue provisoirement ; marche du muret et coussin dupliqué à corriger |
| 7 | Correction locale A : muret horizontal | A finale retenue, corps/machine inchangés |
| 8 | Correction locale M : muret et suppression du coussin parasite | M finale retenue |

3 sources finales conservées, 3 essais rejetés et 2 états intermédiaires corrigés.
Arrêt à 8/10, aucun drapeau rouge (celui-ci reste réservé à la limite du chat).

### Contrôles de livraison
- A/M/B : 1376×768 paysage, identité/buste contrôlés à **1:1**, peau et carrure cohérentes.
- Crops des pieds : deux chaussures posées sur le plateau, semelles en contact, pas de talon
  flottant. Pieds au centre, pas sur le bord haut. Vérification de la flexion et du support dos/bassin.
- Cinématique : pieds/plateau/châssis fixes ; siège, dossier et mannequin se déplacent sur rails.
- RMSE A→M **0,0978314**, M→B **0,102198**, seuil 0,030 passé.
- PNG MD5 : A `22bc790e1c8505ec888a18a4db11d3d8`, M `2b9cbc6a2419dff07342e4ef558a8b9a`,
  B `fd5a75cb90543173b714c94f9a2a1210` ; aucun doublon PNG du chantier.
- GIF MD5 `ef415b61bb9eaec11ada7ec70a65a55d`, aucun doublon GIF ; 460×257,
  4 frames A/M/B/M, boucle infinie, durées 130/110/130/110 centièmes.
- Planche finale 1440×300 inspectée après assemblage.

### Livrables
- `themeB/_sources/B-03/leg-press-{A,M,B}.png`
- `themeB/leg-press-3poses.gif`
- `themeB/LOT-B03-leg-press-PLANCHE-FINALE.jpg`

### Suite
Produire **leg press FEMME** en partant de ces A/M/B HOMME conformes, conserver exactement
machine, siège, jambes, pieds, appuis et camera ; ne changer que l'identité selon la recette
FEMME documentée. Puis back squat FEMME, puis les six GIFs B-04.
B-03 reste incomplet ; POC back squat H intact avec ses réserves. Aucun GIF livré modifié,
aucune intégration dans `public/media`, `release/` ou le code. Validation visuelle utilisateur
attendue sur la planche finale.

## Changement de priorité demandé — passation courte via GitHub

- Création de `REPRISE-JARVIS.md`, document unique passation + consigne, accessible par lien.
- `CONSIGNE-A-COPIER-COLLER.md` ne contient plus qu'un court message de reprise ;
  `PASSATION-ANIMATIONS.md` renvoie à la même source de vérité.
- Phase prioritaire : une version HOMME par exercice, commune à Yanis et Émilie. FEMME plus tard.
  Conservation de tous les livrables existants. Pas de suppression ni de double comptage.
- La règle « aucun fichier partagé » s'applique entre exercices distincts, pas entre profils
  sur un même exercice. Programmes et charges individuels restent indépendants des médias.
- 76/614 reste le bilan historique double ; ne pas annoncer 76/307 HOMME. Audit nécessaire.
- 2 GIFs sur les 10 demandés sont déjà livrés ; les 8 prochains passent en HOMME uniquement.
  Suite proposée : B-04 H (3), B-05 H (3), début B-06 H (2), après vérification inventaire/fichiers.
- L'application opérationnelle rapidement est la priorité : préparer le mapping commun et
  l'intégration progressive des GIFs validés, sans attendre les FEMME. L'intégration effective
  reste une étape à valider puis tester ; aucun code ou APK modifié dans ce tour documentaire.
- Ce tour : **0 appel image, 0 nouveau GIF**. Dernier exercice livré inchangé : `fa9d52a`.
