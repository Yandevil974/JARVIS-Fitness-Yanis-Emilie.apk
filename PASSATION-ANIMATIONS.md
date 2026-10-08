**État consolidé au 8 octobre 2026 (fin de la session `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap`) ·
71 / 614 animations livrées · Thème A 100 % terminé (50/50) · Thème B en cours :
**Lot B-01 terminé (H + F)**, **Lot B-02 HOMME terminé** et **Lot B-02 FEMME 1/3**

> ### 🔄 BILAN DE LA SESSION `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` (62/614 → 71/614)
>
> 1. **Thème B ouvert et Lot B-01 TERMINÉ (H + F)** — `bulgarian-split-squat`, `goblet-squat`
>    et `step-up-sur-banc-hauteur-du-genou` livrés en HOMME (`c2efd7d`, `1e759eb`, `0c2d65a`)
>    **et en FEMME** (`701aa95`, `cb562cb`, `857a674`), avec planches animées et grilles 3×3.
> 2. **⚠️ Incident d'identité signalé par le user le 2026-10-08** (« l'homme a l'air différent
>    des autres gif » + « il semble moins musclé ») → **vérifié et corrigé** : deux causes
>    (peau striée / aspect écorché, et carrure plus fine) dues à des frames générées d'un
>    **prompt texte seul**, sans ancrage sur une pose de référence validée. Remède validé et
>    inscrit comme **règle du chantier** : partir d'une **pose de référence validée** +
>    **paragraphe de masse musculaire**, puis **contrôle d'identité à 1:1** (peau lisse /
>    carrure / échelle) avant tout assemblage.
> 3. **Lot B-02 HOMME TERMINÉ (3/3)** — `bulgarian-split-squat-halteres` (`e5d8f1c`),
>    `back-squat-charge-moderee` (`dcacd1c`), `presse-a-cuisses-pieds-hauts` (`770e5cd`) ;
>    planche animée `themeB/LOT-B02-quadriceps.gif` + grille `themeB/LOT-B02-PLANCHE-TRAVAIL.jpg`.
> 4. **Lot B-02 FEMME ouvert (1/3)** — `bulgarian-split-squat-halteres` FEMME (`da499ed`).
> 5. **Déblocages techniques documentés** : l'**interpolation à deux références** (frame femme
>    + pose homme validée, « reproduce only the POSITION ») a débloqué la position B du
>    step-up FEMME ; et **éviter le mot « bench »** (il fait asseoir le mannequin ou le laisse
>    au sol) au profit de « **long solid black rectangular STEP PLATFORM … the step is
>    directly UNDER his/her feet, carrying the whole weight** ».
> 6. **Outils ajoutés** : `scripts/build-planche-exo.sh` (planche 1440×300),
>    `scripts/build-planche-grille.sh` (grille 3×3 1440×900) et
>    `scripts/build-gif-lot-depuis-gifs.sh` (planche animée 1420×265 assemblée **depuis les
>    GIF déjà livrés**, sans les ré-encoder).

# 🚩 PASSATION + CONSIGNE — CHANTIER « RECONSTRUCTION DES ANIMATIONS »

## Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

67 / 614 animations livrées · Thème A 100 % terminé (25/25 en HOMME ✅ + 25/25 en FEMME ✅ = 50/50) ·
**Thème B (Musculation) : Lot B-01 (quadriceps & squats) 100 % TERMINÉ dans les DEUX profils
(3/3 HOMME ✅ + 3/3 FEMME ✅)** — `bulgarian-split-squat` (`c2efd7d` / `701aa95`), `goblet-squat`
(`1e759eb` / `cb562cb`) et `step-up-sur-banc-hauteur-du-genou` (64ᵉ / `857a674`),
identité du mannequin **rétablie** (peau lisse et mate + carrure massive) et **vérifiée 1:1**

> ### 🔄 DERNIER TOUR (2026-10-08) — Lot B-01F FEMME livré + identité rétablie (+3 animations : de 64/614 à 67/614)
>
> 1. **Résolution complète de la non-conformité d'identité signalée par le user** (« l'homme a
>    l'air différent des autres GIF », « il semble moins musclé ») : les 3 exercices HOMME ont été
>    régénérés avec la **peau lisse et mate** et la **carrure massive** du chantier, puis vérifiés
>    par **comparatif à l'échelle 1:1** contre les poses de référence validées (nouvelle règle de
>    contrôle instaurée). Comparatif conforme pour les 6 animations du lot (3 H + 3 F).
> 2. **`bulgarian-split-squat` FEMME livré (`701aa95`, 65/614)** — banc noir derrière, A jambe
>    avant tendue / M demi-descente / B squat bulgare profond.
> 3. **`goblet-squat` FEMME livré (`cb562cb`, 66/614)** — haltère vertical en coupe contre le
>    sternum, squat profond coudes aux genoux.
> 4. **`step-up-sur-banc-hauteur-du-genou` FEMME livré (`857a674`, 67/614)** — RMSE A→M `0,0826`,
>    M→B `0,1809`. La position B (debout sur le banc) a résisté 2 fois de plus au générateur, puis
>    a été débloquée par **l'interpolation à 2 références** : la frame FEMME en 1ᵉʳ (identité +
>    caméra) et la **pose HOMME déjà validée** en 2ᵉ avec « the SECOND image shows ONLY THE POSE to
>    reproduce — do NOT copy the man, reproduce only the POSITION of the body », combinée à
>    l'interdiction du mot « bench » (→ « long solid black rectangular STEP PLATFORM ») et à la
>    formule « *she is the one who is high: both of her sneakers are planted flat on the black top
>    surface, the step platform is directly UNDER her feet, carrying her whole weight* ».
> 5. **Assemblages du Lot B-01F (`606da8b`)** : `themeB/femme/LOT-B01F-quadriceps.gif`
>    (1420×265, 4 frames) + `themeB/femme/LOT-B01F-PLANCHE-TRAVAIL.jpg` (grille 3×3, 1440×900) +
>    les 3 planches statiques `LOT-B01F-*-PLANCHE-FINALE.jpg`.
> 6. **Budget du tour : 3 / 10 appels** (2 rejets comptés honnêtement + 1 image retenue) — pas de
>    drapeau rouge. Ajout de `scripts/build-gif-lot-depuis-gifs.sh` (assemblage de la planche
>    animée **depuis les GIF déjà livrés**, sans ré-encoder les GIF individuels commités).

> ### 🔄 BILAN DE LA SESSION `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` (+1 animation livrée : de 62/614 à 63/614)
>
> 1. **`goblet-squat` HOMME livré (`f11b3b9`, 63 / 614)** — 3 positions en vue trois-quarts
>    avant sur tapis noir : A debout haltère noir tenu **verticalement en coupe contre le
>    sternum**, M demi-squat 45° haltère collé au thorax, B squat profond 90° **coudes à
>    l'intérieur des genoux**. Technique vérifiée en ligne (h2olesangles, moncoachsportif-
>    enligne, ligue-centre-val-de-loire) et matériel vérifié dans `inventaire.json`
>    (`dumbbell`). Livrables : `themeB/goblet-squat-3poses.gif` (460×257) +
>    `themeB/LOT-B01-goblet-squat-PLANCHE-FINALE.jpg` (1440×300).
> 2. **⚠️ Réserve de méthode majeure déclarée :** le générateur a aussi changé l'**échelle de
>    caméra** entre les positions. Mesuré sur le **décor seul**, le RMSE A→M du goblet-squat
>    est de **0,3946** (contre 0,1301 pour le déjà-livré `bulgarian-split-squat`, étalonnage).
>    Autrement dit **les RMSE du goblet-squat (0,3476 / 0,2979) ne mesurent pas le mouvement**
>    — la lisibilité a été validée **à l'œil**. À ne pas présenter comme une mesure propre.
> 3. **`step-up-sur-banc-hauteur-du-genou` HOMME : 2 / 3 positions** — A (pied gauche entier à
>    plat sur le banc à hauteur de genou, mains aux hanches) et M (montée à mi-course, jambe
>    gauche à ~135°, pied droit décollé sans élan) sont **conformes et commitées** dans
>    `themeB/_sources/B-01/`. La position B (extension complète debout sur le banc) a été
>    **refusée 5 fois** par le générateur (saut d'échelle, image fantôme, décor changé,
>    2 × mouvement inversé). **Aucun GIF livré pour cet exercice, aucune fausse annonce de
>    complétion (règle 4).** Piste pour le prochain tour : repartir d'une **vue de profil**
>    ou d'une base avec le mannequin **déjà à genou sur le banc**.
> 4. **Plafond technique respecté :** 10 / 10 appels `generate_image` ce tour (5 images
>    conformes + 5 rejets), détaillé honnêtement dans `SUIVI.md`.
> 5. Ajout de `yanis-fitness-evolution/scripts/build-planche-exo.sh` (gabarit de planche
>    `1440×300` identique aux planches des lots précédents, police `DejaVu-Sans` imposée) —
>    ce script manquait dans le dépôt.


> ### 🔄 BILAN COMPLET DE LA SESSION `arena/93096144-jarvis-fitness-yanis-emilie-ap` (+18 animations livrées : de 44/614 à 62/614)
>
> 1. **Fin du LOT 3 FEMME (composites 9 poses) & Corrections autorisées (feu vert) :**
>    - ✅ **`circuit-abdominaux` FEMME** (`5e5a2e3`) : 9/9 positions, GIF composite 16 frames (`460×257`) + planche `LOT3F-circuit-abdominaux-femme.gif` (`1420×265`) ;
>    - ✅ **`fire-hydrant-elastique` FEMME** corrigé en **vue arrière trois-quarts** (`e5b670a`, RMSE A→M `0,089`, M→B `0,104`) ;
>    - ✅ **`squat-poids-du-corps` HOMME** corrigé en **vue trois-quarts sur tapis noir** (`9ed4d87`, RMSE A→M `0,076`, M→B `0,090`).
> 2. **LOT A-04 HOMME (`db1c520`) & LOT A-04F FEMME (`2a202a4`) — 100 % livrés (6 animations) :**
>    - ✅ **`abduction-assise-machine-ou-elastique`** H (`bd77abf`) & F (`721ad18`) — en **vue de face directe symétrique** (pieds fixes au centre, ouverture des genoux en papillon/losange) ;
>    - ✅ **`pallof-press-a-l-elastique`** H (`f2c7d13`) & F (`8686998`) — gainage anti-rotation debout perpendiculaire au poteau noir ;
>    - ✅ **`face-pull-a-l-elastique`** H (`db1c520`) & F (`2a202a4`) — tirage haut vers le visage avec rotation externe d'épaules à 90°.
> 3. **LOT A-05 HOMME (`5346b43`) & LOT A-05F FEMME (`0b5c1fd`) — 100 % livrés (4 nouvelles animations + `dead-bug` déjà livré) :**
>    - ✅ **`respiration-diaphragmatique`** H (`1ca6f4e`) & F (`beb04bf`) — inspiration ventrale → expiration contrôlée → *Stomach Vacuum* hypopressif sous-costal ;
>    - ✅ **`hip-thrust-unilateral-1-jambe`** H (`5346b43`) & F (`0b5c1fd`) — haut du dos sur banc noir, montée unilatérale jusqu'à la table horizontale.
> 4. **LOT A-08 / A-09 HOMME (`204a8b4`) & LOT A-08F / A-09F FEMME (`5467b86`) — 100 % livrés (6 étapes chrono `warmup-*`) → THÈME A 100 % TERMINÉ (50 / 50) :**
>    - ✅ **`warmup-route`** H (`8cf93fa`) & F (`b017eb6`) — marche active dynamique / montée de genou souple sur place ;
>    - ✅ **`warmup-mobilite`** H (`d698285`) & F (`b932ebd`) — ouverture thoracique & rétraction scapulaire dynamique (bras fermés → Cactus 90/90 → ouverture en T) ;
>    - ✅ **`warmup-approche`** H (`204a8b4`) & F (`5467b86`) — épaulé / tirage d'approche à la barre légère (devant cuisses → tirage mi-buste → réception *front-rack* aux clavicules).
> 5. **Ouverture du Thème B — Musculation (Sous-thème Jambes : quadriceps & squats — Lot B-01) :**
>    - ✅ **`bulgarian-split-squat` HOMME** (`c2efd7d`, **62 / 614**) — squat bulgare au poids du corps en vue trois-quarts avant (A jambe avant tendue, pied arrière sur banc noir → M demi-descente à ~45° → B squat bulgare profond à 90°, RMSE A→M `0,1278`, M→B `0,1347`).

---

## 0. CADRE ET OUVERTURE GIT OBLIGATOIRE

- **Dépôt** : `github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public)
- **Branche de référence contenant tout l'historique (63/614)** :
  `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` (état le plus récent).
  La branche précédente `arena/93096144-jarvis-fitness-yanis-emilie-ap` reste valide
  jusqu'à son commit `dbb6323` (62/614) : elle sert de repli.
- **Attention (nouveau chat Arena)** : chaque nouveau chat Arena crée sa propre branche de
  session `arena/<nouvel-id>-jarvis-fitness-yanis-emilie-ap` initialisée sur le vieux commit
  `ddd1fb9`. Dès l'ouverture du premier tour du nouveau chat, récupérer l'état consolidé de
  `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` sur la branche active du nouveau chat :

```bash
rm -f .git/index.lock
git fetch origin arena/bdd122a8-jarvis-fitness-yanis-emilie-ap
git reset --hard origin/arena/bdd122a8-jarvis-fitness-yanis-emilie-ap
```

*(Cette branche contient tout l'historique consolidé : celui de
`arena/93096144-jarvis-fitness-yanis-emilie-ap`, commit `dbb6323`, PLUS les commits de la
session `bdd122a8` — si le fetch de la branche `bdd122a8` échoue, replier sur
`arena/93096144-jarvis-fitness-yanis-emilie-ap`.)*

*(Astuce performance : toujours cibler la branche précise dans `git fetch origin <branche>`
au lieu d'un `refs/heads/arena/*` global qui télécharge des dizaines de branches binaires et
peut dépasser le timeout de 30 s).*

### Historique consolidé des commits récents

```
da499ed  feat(animations): livre bulgarian-split-squat-halteres FEMME (Lot B-02F, 71/614)
770e5cd  feat(animations): LOT B-02 HOMME COMPLET — presse a cuisses + planche animee + grille (70/614)
dcacd1c  feat(animations): livre back-squat-charge-moderee HOMME (Lot B-02, 69/614)
e5d8f1c  feat(animations): livre bulgarian-split-squat-halteres HOMME (Lot B-02, 68/614)
df9d8df  docs(animations): suivi tour 12 — Lot B-01 complet H+F (67/614) + recette consolidee
606da8b  feat(animations): LOT B-01F FEMME COMPLET — planche animee + grille 3x3 (67/614)
857a674  feat(animations): livre step-up-sur-banc-hauteur-du-genou FEMME (Lot B-01F, 67/614)
0c2d65a  feat(animations): LOT B-01 HOMME COMPLET — step-up livre (64/614, Theme B 3/187)
1e759eb  fix(animations): goblet-squat HOMME regenere avec l'identite du chantier (carrure + peau)
877f003  docs(animations): suivi tour 9 — goblet-squat HOMME livre (63/614) + step-up HOMME 2/3 positions
f11b3b9  feat(animations): livre goblet-squat HOMME (LOT B-01, 63/614)
dbb6323  docs(passation): consolide PASSATION-ANIMATIONS.md et CONSIGNE-A-COPIER-COLLER.md (62/614)
688d8ce  docs(animations): suivi tour 8 — Theme A 100% (50/50) + ouverture Theme B (62/614)
c2efd7d  feat(animations): livre bulgarian-split-squat HOMME (LOT B-01, 62/614)
5467b86  feat(animations): LOT A-08F/09F FEMME COMPLET (25/25 Theme A FEMME, 61/614)
b932ebd  feat(animations): livre warmup-mobilite FEMME (LOT A-08F, 60/614)
b017eb6  feat(animations): add LOT A-09F warmup-route FEMME (59/614)
204a8b4  feat(animations): LOT A-08/09 HOMME COMPLET (25/25 Theme A, 58/614)
d698285  feat(animations): add LOT A-08 warmup-mobilite HOMME (57/614)
8cf93fa  feat(animations): add LOT A-09 warmup-route HOMME (56/614)
0b5c1fd  feat(animations): LOT A-05F FEMME COMPLET — hip-thrust-unilateral + planche (55/614)
beb04bf  feat(animations): add LOT A-05F respiration-diaphragmatique FEMME (54/614)
5346b43  feat(animations): LOT A-05 HOMME COMPLET — hip-thrust-unilateral + planche (53/614)
1ca6f4e  feat(animations): add LOT A-05 respiration-diaphragmatique HOMME (52/614)
2a202a4  feat(animations): LOT A-04F FEMME COMPLET — face-pull + planche (51/614)
8686998  feat(animations): add LOT A-04F pallof-press FEMME (50/614)
721ad18  feat(animations): add LOT A-04F abduction-assise FEMME (49/614)
db1c520  feat(animations): LOT A-04 HOMME COMPLET — face-pull + planche (48/614)
f2c7d13  feat(animations): add LOT A-04 pallof-press HOMME (47/614)
bd77abf  feat(animations): add LOT A-04 abduction-assise HOMME (46/614)
9ed4d87  fix(animations): corrige squat-poids-du-corps HOMME en vue 3/4 sur tapis noir
e5b670a  fix(animations): corrige fire-hydrant-elastique FEMME en vue arriere 3/4
5e5a2e3  feat(animations): livre circuit-abdominaux FEMME composite (9/9, 45/614)
f07c04d  feat(animations): livre circuit-gainage FEMME composite (9/9, 44/614)
```

---

## 1. LES 15 RÈGLES À NE PAS NÉGOCIER

1. **RÈGLE ABSOLUE N°1 : 1 exercice = 1 animation spécifique.**
   Aucun GIF partagé entre deux exercices. Interdit : copier, renommer, réutiliser,
   animation « proche » ou générique.
2. **Ne jamais remplacer une animation livrée sans accord explicite.**
   ⚠️ *Feu vert du 2026-10-07* : les corrections de GIF précédents sont autorisées à
   condition d'être tracées dans `SUIVI.md` (§ « CORRECTIONS AUTORISÉES »). En revanche,
   la reprise du **POC (3 animations)** et le passage des **2 circuits HOMME (LOT 3)** en
   version composite restent soumis à un accord explicite du user.
3. **Ne pas toucher à `release/` ni à `public/media`** ni à aucun fichier applicatif tant
   que l'intégration n'est pas validée.
4. **Honnêteté totale sur les échecs et les réserves.** Jamais de faux 100 %. Signaler tout
   décalage de banc, variation d'écartement des pieds, relief apparu à l'horizon, ou rendu
   un peu brillant.
5. **Drapeau rouge = limite technique de génération atteinte (10 appels `generate_image` par
   tour).** Rejouer une image ratée est normal : **compter chaque appel** et le détailler
   honnêtement dans le tableau de fin de tour.
6. **Vérifier la technique en ligne AVANT de générer** et **citer les URLs sources dans le
   message de commit**.
7. **L'œil de l'utilisateur tranche.** Fournir les planches de contrôle pour validation.
8. **Accord permanent pour committer et pousser** sur la branche de session.
9. **Lots organisés PAR THÈME** (`PLAN-THEMES.md` : A échauffement → B musculation →
   C étirements → D cardio → E piscine).
10. **Terminer un thème entier avant de passer au suivant.** Le Thème A est désormais 100 %
    terminé (50/50) ; le chantier est sur le **Thème B — Musculation**.
11. **PÉRIMÈTRE HOMME + FEMME = 614 animations** : chaque entrée existe en version homme
    (`themeB/<ex>-3poses.gif`) et en version femme (`themeB/femme/<ex>-3poses.gif`).
12. **Le sandbox se réinitialise à chaque tour.** Toujours `git fetch` + `git reset --hard`
    en ouverture de tour. **Seul ce qui est dans git survit.**
13. **Committer et pousser dès qu'un exercice est complet**, sans attendre la fin d'un lot
    de 3 exercices (évite toute perte en cas d'interruption ou de reset).
14. **Doute sur la CONFIGURATION d'un mouvement → vérifier en ligne AVANT de générer**
    (YouTube, sites de fitness, GB Performance, guides de coachs) ET vérifier le matériel
    attendu dans `inventaire.json` (ex. `bulgarian-split-squat` = `bodyweight` au Lot B-01,
    tandis que `bulgarian-split-squat-halteres` = `dumbbell` au Lot B-02). **Citer les
    sources dans le message de commit.**
15. **Le user n'a NI le visualiseur d'Arena NI les pièces jointes.** Tout aperçu à valider
    (planche A/M/B `1440×300`, grille 3×3 `1440×900`, planche animée `1420×265`, GIF
    `460×257`) doit être **commité dans le dépôt et communiqué par un lien GitHub direct**.

---

## 2. STYLE VALIDÉ (ne pas dévier)

- Mannequin anatomique 3D **TRÈS MUSCLÉ**, corps **BLANC ARGENTÉ MAT** avec fibres grises
  striées (jamais chromé, jamais miroir).
- **VISAGE ENTIÈREMENT NOIR MAT**, lisse, sans aucun trait. Casquette blanche.
- Short noir, baskets blanches (plus brassière de sport noire et tresse blanc-argenté pour
  le mannequin féminin). Muscles sollicités illuminés en **jaune-orangé doré**.
- **DÉCOR UNIQUE : terrasse bord de mer** (dallage de pierre irrégulier clair, muret blanc
  bas, mer, palmiers). INTERDIT : salle de sport, parquet en bois, mur intérieur, miroir.
- **EXCEPTION : piscine intérieure** pour les exercices aquatiques (Thème E).
- **TAPIS DE SPORT NOIR** au sol.
- **Références d'identité :**
  - Homme : `Screenshot_20261005_212714_Facebook.jpg` (et poses HD saines comme
    `yanis-fitness-evolution/animations/themeA/_sources/A-08/warmup-mobilite-A.png` ou
    `themeA/_sources/A-02/squat-poids-du-corps-{A,M,B}.png`) ;
  - Femme : `yanis-fitness-evolution/animations/REF-personnage-feminin.jpg` (et poses HD
    saines comme `themeA/femme/_sources/A-08F/warmup-mobilite-A.png` ou
    `themeA/femme/_sources/A-02F/squat-poids-du-corps-{A,M,B}.png`).

---

## 3. MÉTHODE, ASTUCES TECHNIQUES & CONTRÔLE QUALITÉ

### A. Chaînage et assemblage
- 3 positions **A (départ) → M (mi-course) → B (finale)** conservées en PNG HD (`1376×768`)
  dans `_sources/<LOT>/`.
- GIF individuel : `460×257`, boucle 4 frames `A (130) → M (110) → B (130) → M (110)`,
  `-loop 0 -layers optimize -colors 96 +dither`.
- Planche statique par exercice (`LOT-<id>-<ex>-PLANCHE-FINALE.jpg`, `1440×300`) : toujours
  passer `-font DejaVu-Sans` à ImageMagick `convert -annotate` (la police par défaut
  Helvetica échoue dans le sandbox).
- Planche animée de lot (`1420×265`, 3 colonnes, 4 frames) via
  `yanis-fitness-evolution/scripts/build-gif-lot.sh <src_dir> <out_dir> <nom_planche_sans_ext> <ex1> <ex2> <ex3>`
  (**ne jamais appliquer `-layers optimize` sur la planche animée**).
- Attention : `build-gif-lot.sh` régénère les 3 GIFs individuels ; si deux d'entre eux
  étaient déjà commités, faire `git checkout --` dessus après génération de la planche ou
  les ré-inclure proprement.

### B. Leçons techniques cruciales (pour ne pas gaspiller d'appels IA)
1. **Règle de la 1ʳᵉ image (`images[0]`) dans `generate_image`** :
   Quand on passe 2 images `[img1, img2]`, le modèle d'édition verrouille fortement le
   squelette des jambes et la hauteur du bassin sur **`img1`**.
   - Si on veut abaisser le bassin à mi-hauteur (demi-squat 45° en M) ou en bas (squat 90°
     en B) et que le modèle reste figé debout, utiliser comme `img1` (ou comme unique
     référence) une pose déjà fléchie à la bonne hauteur (ex. `squat-poids-du-corps-M.png`
     pour un demi-squat 45°, `squat-poids-du-corps-B.png` pour un squat profond 90°) !
2. **Danger des 3 jambes lors de la fusion de 2 images** :
   Ne jamais passer simultanément une image avec les 2 pieds au sol et une image avec 1 pied
   sur un banc : le modèle fusionne les jambes et produit un mannequin à **3 jambes**. Pour
   poser un pied sur un banc, passer **une seule image source** et demander de déplacer la
   jambe sur le banc (en précisant `ONLY TWO LEGS total`).
3. **Contrôle qualité obligatoire avant chaque commit** :
   - Inspection visuelle systématique avec `read_file` ;
   - Mesure objective `compare -metric RMSE A.png M.png null:` et `M.png B.png null:`
     (seuil minimal **`>= 0,030`**) ;
   - Vérification de l'absence de doublon MD5 (`md5sum`).

---

## 4. ÉTAT D'AVANCEMENT GLOBAL (67 / 614)

| Élément | Valeur |
| --- | --- |
| Animations nécessaires | **614** (307 entrées × 2 profils HOMME + FEMME) |
| **Animations créées et livrées** | **67 / 614** (39 HOMME + 28 FEMME) |
| **Restant à produire** | **547** |
| **Thème A — Échauffement, mobilité & activation** | **50 / 50 (100 % ✅ : 25/25 HOMME + 25/25 FEMME)** |
| **Thème B — Musculation** | **3 / 187 en HOMME ET 3 / 187 en FEMME** — **Lot B-01 (quadriceps & squats) complet dans les deux profils** + anciens lots POC/L4/L5 à reclasser |
| Versions femme produites | **28 / 307** (Thème A 25 + Lot B-01F 3) |
| Doublons MD5 sur les GIFs du chantier | **0** (toutes les empreintes MD5 sont uniques) |

---

## 5. PROCHAINE ACTION IMMÉDIATE (AU PROCHAIN TOUR)

1. **Terminer le Lot B-02 FEMME (2 exercices restants, 6 images)** dans
   `themeB/femme/_sources/B-02F/` :
   - **`back-squat-charge-moderee` FEMME** (3 positions A, M, B) : barre haute sur les
     trapèzes, prise largeur d'épaules, un disque de chaque côté (charge modérée), A debout →
     M demi-squat 45° → B squat profond (pliure des hanches sous le haut des genoux), talons
     au sol. Partir de `themeA/femme/_sources/A-02F/squat-poids-du-corps-{A,M,B}.png`
     **+ paragraphe de masse**, puis **contrôle 1:1** ;
   - **`presse-a-cuisses-pieds-hauts` FEMME** (3 positions) : assise dans la presse, dos et
     bassin plaqués, **pieds hauts** sur le plateau, genoux jamais verrouillés ;
     ⚠️ pour la position B (flexion profonde), la recette qui a marché en HOMME est la
     **description géométrique** (« mollets contre cuisses, genoux vers les aisselles,
     ~120° ») chaînée **depuis M** — les essais depuis A partent en profil (1 seule jambe
     lisible, 2 rejets payés au tour 13).
2. **Assembler le Lot B-02 FEMME** :
   `bash scripts/build-gif-lot-depuis-gifs.sh themeB/femme/LOT-B02F-quadriceps.gif themeB/femme/<ex1>-3poses.gif themeB/femme/<ex2>-3poses.gif themeB/femme/<ex3>-3poses.gif`
   puis
   `bash scripts/build-planche-grille.sh themeB/femme/_sources/B-02F themeB/femme/LOT-B02F-PLANCHE-TRAVAIL.jpg "<titre>" FEMME <ex1> <ex2> <ex3>` ;
   puis les 2 planches statiques manquantes avec `scripts/build-planche-exo.sh`.
3. **Enchaîner le Lot B-03** (`back-squat` (POC, à refaire), `squat-cycliste-squat-complet`,
   `leg-press`) — H puis F, même méthode.
4. **Rappel de méthode (ne pas s'en écarter)** : 1 exercice = 1 animation ; partir d'une
   **pose de référence validée** + **paragraphe de masse** ; **contrôle 1:1** avant
   assemblage ; **RMSE ≥ 0,030** ; committer **dès qu'un exercice est complet** ; planches
   `1440×300` / grille `1440×900` / planche animée `1420×265` / GIF `460×257` **commitées**
   et annoncées par un **lien GitHub direct** (le user n'a pas le visualiseur).
   *(Réserve toujours ouverte : reprise du POC et passage des 2 circuits HOMME du LOT 3 en
   composite — sur accord explicite du user uniquement.)*


### ✅ Fait (ne pas refaire)

- ✅ **Lot B-01 HOMME complet (3/3)** : `themeB/LOT-B01-quadriceps.gif` (1420×265), grille
  `themeB/LOT-B01-PLANCHE-TRAVAIL.jpg` (1440×900) et les 3 planches `LOT-B01-*-PLANCHE-FINALE.jpg`.
- ✅ **Lot B-01 FEMME complet (3/3)** : `themeB/femme/LOT-B01F-quadriceps.gif`, grille
  `themeB/femme/LOT-B01F-PLANCHE-TRAVAIL.jpg` et les 3 planches `LOT-B01F-*-PLANCHE-FINALE.jpg`.
- ✅ **Identité conforme et vérifiée 1:1** sur les 6 animations du lot (peau lisse et mate,
  carrure massive, échelle homogène).
- ⚠️ **Réserve mineure résiduelle** (si le user veut la perfection) : sur `goblet-squat` HOMME
  position **B**, l'haltère paraît un peu gros et légèrement décollé du sternum → **1 image** à
  refaire, **à ne faire QUE sur demande explicite**.

### Prochaine action : LOT B-02 — Quadriceps & squats (HOMME puis FEMME)

| # | Entrée | Identifiant | Matériel (`inventaire.json`) |
| --- | --- | --- | --- |
| 1 | Back squat (charge modérée) | `back-squat-charge-moderee` | `barre` |
| 2 | Presse à cuisses pieds hauts | `presse-a-cuisses-pieds-hauts` | `machine` |
| 3 | Bulgarian split squat haltères | `bulgarian-split-squat-halteres` | `haltères` |

⚠️ **Deux points à trancher AVANT de générer** :
1. **Où placer la machine** (presse à cuisses) ? Le décor validé est la **terrasse bord de mer** et
   une salle de sport est **interdite**. Convention des lots précédents : le matériel est posé
   **sur la terrasse** (banc noir du Lot B-01, rack du POC). La reconduire et la faire valider.
2. **`back-squat-charge-moderee` vs le `back-squat` du POC** : deux **entrées distinctes** (règle 1)
   → l'animation doit rester **visuellement distincte** ; le POC ne peut pas être remplacé sans
   accord explicite (règle 2).

### 🧠 Recette consolidée (à appliquer à CHAQUE exercice — elle a coûté 2 tours)

1. **Ne jamais générer d'un prompt texte seul** : partir d'une **pose de référence validée**
   (`themeA/_sources/A-02/squat-poids-du-corps-{A,M,B}.png` pour l'homme,
   `themeA/femme/_sources/A-02F/…` pour la femme).
2. Ajouter **le paragraphe de masse musculaire** mot pour mot (voir `SUIVI.md`) : sans lui, la
   carrure fond et le mannequin ne ressemble plus au chantier.
3. **Si la pose résiste** (objet à tenir, support à escalader) → **interpolation à 2 références** :
   la frame du **profil voulu** en 1ᵉʳ (identité + caméra + décor) et la **pose validée de l'autre
   profil** en 2ᵉ, avec « *the SECOND image shows ONLY THE POSE to reproduce — do NOT copy the man,
   reproduce only the POSITION of the body* ».
4. **Ne jamais écrire « bench »** pour un support sur lequel il faut **monter ou se tenir debout** :
   écrire « *solid black rectangular STEP PLATFORM … he/she is the one who is high: both sneakers
   planted flat on the black top, the platform directly UNDER their feet, carrying their whole
   weight* », et préciser que le support **ne bouge pas** et **garde sa taille dans le cadre**.
5. **Contrôle d'identité 1:1 obligatoire** avant tout assemblage : comparer **sans redimensionner**
   à la pose de référence (peau lisse et mate sans fibres grises / carrure / échelle), puis
   RMSE ≥ 0,030, puis `md5sum` (0 doublon), puis inspection visuelle.
6. **Committer dès qu'un exercice est complet** (règle 13) et **détailler le budget d'images**
   (règle 5) — aucun rejet dissimulé.
