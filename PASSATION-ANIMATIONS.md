# 🚩 PASSATION + CONSIGNE — CHANTIER « RECONSTRUCTION DES ANIMATIONS »

## Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

**État consolidé au 8 octobre 2026 (fin de la session `arena/93096144-jarvis-fitness-yanis-emilie-ap`) ·
62 / 614 animations livrées · Thème A 100 % terminé (25/25 en HOMME ✅ + 25/25 en FEMME ✅ = 50/50) ·
Thème B (Musculation) ouvert : Lot B-01 HOMME 1/3 livré (`bulgarian-split-squat`, `c2efd7d`)**

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
- **Branche de référence contenant tout l'historique (62/614)** :
  `arena/93096144-jarvis-fitness-yanis-emilie-ap`
- **Attention (nouveau chat Arena)** : chaque nouveau chat Arena crée sa propre branche de
  session `arena/<nouvel-id>-jarvis-fitness-yanis-emilie-ap` initialisée sur le vieux commit
  `ddd1fb9`. Dès l'ouverture du premier tour du nouveau chat, récupérer l'état consolidé de
  `arena/93096144-jarvis-fitness-yanis-emilie-ap` sur la branche active du nouveau chat :

```bash
rm -f .git/index.lock
git fetch origin arena/93096144-jarvis-fitness-yanis-emilie-ap
git reset --hard origin/arena/93096144-jarvis-fitness-yanis-emilie-ap
```

*(Astuce performance : toujours cibler la branche précise dans `git fetch origin <branche>`
au lieu d'un `refs/heads/arena/*` global qui télécharge des dizaines de branches binaires et
peut dépasser le timeout de 30 s).*

### Historique consolidé des commits récents

```
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

## 4. ÉTAT D'AVANCEMENT GLOBAL (62 / 614)

| Élément | Valeur |
| --- | --- |
| Animations nécessaires | **614** (307 entrées × 2 profils HOMME + FEMME) |
| **Animations créées et livrées** | **62 / 614** (37 HOMME + 25 FEMME) |
| **Restant à produire** | **552** |
| **Thème A — Échauffement, mobilité & activation** | **50 / 50 (100 % ✅ : 25/25 HOMME + 25/25 FEMME)** |
| **Thème B — Musculation** | **1 / 187 en HOMME** (`bulgarian-split-squat` livré) + anciens lots POC/L4/L5 à reclasser |
| Versions femme produites | **25 / 307** |
| Doublons MD5 sur les GIFs du chantier | **0** (toutes les empreintes MD5 sont uniques) |

---

## 5. PROCHAINE ACTION IMMÉDIATE (AU PROCHAIN TOUR)

1. **Terminer le Lot B-01 HOMME (6 appels IA)** dans `yanis-fitness-evolution/animations/themeB/` :
   - **Exercice 2/3 : `goblet-squat` HOMME** (*Goblet squat — haltère*, 3 images IA : A, M, B) :
     - *Technique vérifiée* ([Gym-Studio](https://www.gym-studio.com/exercices/goblet-squat), [WOD Open](https://wod-open.com/goblet-squat/), [Epic Fitness](https://epicfitness.fr/maitriser-goblet-squat/), [Créatine Académie](https://www.creatine-academie.com/goblet-squat-technique/)) :
       pieds largeur d'épaules (pointes ouvertes 10-15°), un haltère noir tenu **verticalement**
       contre le sternum (mains en coupe sous la tête supérieure de l'haltère, coudes pointés
       vers le bas) :
       - **A** : debout jambes tendues sur tapis noir, haltère tenu verticalement contre la poitrine ;
       - **M** : demi-squat contrôlé à ~45° (astuce : s'appuyer sur `squat-poids-du-corps-M.png`
         pour garantir la vraie hauteur intermédiaire du bassin !), haltère collé au sternum ;
       - **B** : squat profond (cuisses parallèles au sol ou sous la parallèle, astuce :
         s'appuyer sur `squat-poids-du-corps-B.png`), coudes touchant l'intérieur des genoux,
         talons au sol, buste droit.
   - **Exercice 3/3 : `step-up-sur-banc-hauteur-du-genou` HOMME** (*Step-up sur banc hauteur du genou — poids du corps*, 3 images IA : A, M, B) :
     - *Technique vérifiée* ([FlexGym Performance](https://flexgymperformance.fr/blogs/quadriceps/step-up-guide-complet), [Gym-Studio](https://www.gym-studio.com/exercices/step-up-halteres), [Musculation-Nutrition](https://musculation-nutrition.fr/step-up-musculation/), [Arena Sport Club](https://arenasportclub.fr/fitness/step-up-debutant-hauteur-support-genou-progression/)) :
       au poids du corps (`"materiel": ["bodyweight"]` dans `inventaire.json`), face/profil 3/4
       devant un banc plat noir à hauteur du genou (~40-45 cm) :
       - **A** : debout devant le banc noir, **pied gauche posé ENTIÈREMENT à plat sur le banc**
         (genou gauche fléchi à ~90°), pied droit au sol sur le tapis noir, mains aux hanches ;
       - **M** : poussée unilatérale dans le talon gauche, le corps s'élève à mi-hauteur
         (genou gauche à ~135°), le pied droit a décollé du sol sans donner d'élan ;
       - **B** : debout en extension complète au sommet sur le banc noir (jambe gauche tendue,
         pied droit posé à côté sur le banc).
   - **Assemblage du Lot B-01 HOMME** :
     - `themeB/LOT-B01-quadriceps.gif` (`1420×265`, 4 frames réunissant `bulgarian-split-squat`, `goblet-squat`, `step-up-sur-banc-hauteur-du-genou`) ;
     - `themeB/LOT-B01-PLANCHE-TRAVAIL.jpg` (`1440×900`, grille 3×3 complète).
2. **Enchaîner immédiatement sur le Lot B-01 FEMME** (`themeB/femme/_sources/B-01F/`) avec
   les 4 appels IA restants du tour (`bulgarian-split-squat` FEMME A, M, B + `goblet-squat`
   FEMME A).
3. **Poursuivre le Thème B** lot par lot (Lot B-01 FEMME → Lot B-02 H puis F → Lot B-03…).
   *(Rappel : ne toucher aux 2 circuits HOMME du LOT 3 ou aux 3 animations du POC que si le
   user en donne l'ordre explicite).*
