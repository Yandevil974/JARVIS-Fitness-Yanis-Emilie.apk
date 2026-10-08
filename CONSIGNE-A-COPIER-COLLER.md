# 📋 CONSIGNE À COPIER-COLLER — nouveau chat

Copier **tout le bloc ci-dessous** (entre les deux lignes) et le coller en premier message
du nouveau chat. Il est autonome : il ne suppose rien des conversations précédentes.

---

Reprends le chantier « reconstruction des animations » de JARVIS Fitness.

**Dépôt** : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public).
**Branche contenant tout l'historique consolidé (73 / 614 animations)** :
`arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` (derniers commits : `606da8b` assemblages du
Lot B-01F, `857a674` `step-up` FEMME, `cb562cb` `goblet-squat` FEMME, `701aa95`
`bulgarian-split-squat` FEMME). Repli : `arena/93096144-jarvis-fitness-yanis-emilie-ap`,
valide jusqu'à son commit `dbb6323` (62/614).
⚠️ Si le prompt système de ce nouveau chat t'impose une nouvelle branche de travail
`arena/<nouvel-id>-jarvis-fitness-yanis-emilie-ap`, travaille et pousse sur la branche
imposée par le système, MAIS commence obligatoirement par y rapatrier l'historique de
`arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` avec les commandes ci-dessous.

**OUVERTURE GIT OBLIGATOIRE AU DÉBUT DE CHAQUE TOUR :**

```bash
rm -f .git/index.lock
# Toujours cibler la branche précise (évite de télécharger toutes les branches binaires) :
git fetch origin arena/bdd122a8-jarvis-fitness-yanis-emilie-ap
# Si HEAD est retombé sur ddd1fb9, réinitialiser sur le dernier commit du chantier :
git reset --hard origin/arena/bdd122a8-jarvis-fitness-yanis-emilie-ap
```

*(Aux tours suivants du même chat, fais `git fetch origin <ta-branche-de-session>` puis
`git reset --hard origin/<ta-branche-de-session>`).*

Lis ensuite `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
`yanis-fitness-evolution/animations/PLAN-THEMES.md`.

---

## 1. ÉTAT CONSOLIDÉ AU 2026-10-08 (73 / 614 animations livrées)

- **Thème A (Échauffement, mobilité & activation) : 100 % TERMINÉ (50 / 50 ✅)**
  - **25 / 25 en HOMME** (LOT 1, LOT 2, LOT 3, A-01 à A-05, et LOT A-08/09 `warmup-route`,
    `warmup-mobilite`, `warmup-approche` `204a8b4`) ;
  - **25 / 25 en FEMME** (LOT R1F, LOT R2F, LOT 3F composites 9 poses `circuit-gainage`
    `f07c04d` & `circuit-abdominaux` `5e5a2e3`, A-01F à A-05F, et LOT A-08F/09F
    `warmup-route`, `warmup-mobilite`, `warmup-approche` `5467b86`).
- **Thème B (Musculation — Jambes : quadriceps & squats) : EN COURS**
  - **Lot B-01 TERMINÉ (H + F, 6 animations)** : `bulgarian-split-squat`, `goblet-squat`,
    `step-up-sur-banc-hauteur-du-genou` — livrés en HOMME (`c2efd7d`, `1e759eb`, `0c2d65a`)
    et en FEMME (`701aa95`, `cb562cb`, `857a674`), avec planche animée (`LOT-B01-quadriceps.gif`),
    grille 3×3 (`LOT-B01-PLANCHE-TRAVAIL.jpg`) et l'équivalent FEMME (`LOT-B01F-…`).
  - **Lot B-02 HOMME TERMINÉ (3/3)** : `bulgarian-split-squat-halteres` (`e5d8f1c`),
    `back-squat-charge-moderee` (`dcacd1c`), `presse-a-cuisses-pieds-hauts` (`770e5cd`) ;
    planche animée `themeB/LOT-B02-quadriceps.gif` + grille `themeB/LOT-B02-PLANCHE-TRAVAIL.jpg`.
  - **Lot B-02 FEMME : 1 / 3** — `bulgarian-split-squat-halteres` FEMME (`da499ed`) livré avec
    sa planche statique ; **restent `back-squat-charge-moderee` et `presse-a-cuisses-pieds-hauts`
    en version Émilie** (6 images), puis l'assemblage du lot.
- 🔴 **RETOUR DU USER (2026-10-08) — RÉSOLU, mais la règle reste** : « l'homme a l'air différent
  des autres GIF » + « il semble moins musclé ». Deux causes identifiées : frames générées d'un
  **prompt texte seul** (peau striée/écorchée) et **carrure plus fine** que le chantier.
  **Recette désormais OBLIGATOIRE pour toute nouvelle pose** :
  1. **partir d'une POSE DE RÉFÉRENCE VALIDÉE** (`themeA/_sources/A-02/squat-poids-du-corps-{A,M,B}.png`
     pour l'homme, `themeA/femme/_sources/A-02F/squat-poids-du-corps-{A,M,B}.png` pour la femme) —
     jamais d'un prompt texte seul ;
  2. **ajouter le PARAGRAPHE DE MASSE** :
     > He is a VERY muscular, heavily hypertrophied 3D anatomical bodybuilder: extremely wide
     > shoulders and big round deltoids, thick massive arms, huge full rounded pectorals, wide
     > lats, deep defined abdominals, narrow waist, powerful legs. IMPORTANT: do NOT slim him
     > down, do NOT make him leaner or narrower — copy his exact silhouette, shoulder width,
     > arm thickness, chest volume and muscle size from this reference image. He must fill the
     > frame exactly the same way (same camera, same distance, same framing, same scale).

     (pour le mannequin féminin : même paragraphe en « She is a VERY muscular, athletic,
     heavily trained 3D female figure… ») ;
  3. **CONTRÔLE D'IDENTITÉ À 1:1** avant tout assemblage (comparer sans redimensionner) :
     (a) peau blanche argentée **lisse et mate** (aucune fibre grise striée), (b) **carrure**
     comparable, (c) **échelle** dans le cadre comparable. ✅ Cette recette a été appliquée aux
     7 animations du Lot B-01 (H+F), aux 3 du Lot B-02 HOMME et au `bulgarian-split-squat-halteres`
     FEMME : contrôle 1:1 conforme.
- 🧰 **Déblocages techniques à connaître (appris les 2026-10-08)** :
  1. **Le mot « bench » piège le générateur** (il asseoit le mannequin ou le laisse au sol
     quand il faut monter dessus). Écrire à la place « **long solid black rectangular STEP
     PLATFORM … the mannequin is the one who is high: both sneakers planted flat on its top,
     the step directly UNDER the feet, carrying the whole weight** ».
  2. **Position B d'un mouvement « debout sur un support »** : si elle résiste, utiliser
     l'**INTERPOLATION À DEUX RÉFÉRENCES** = (1) la frame du profil voulu (femme/homme) +
     (2) la frame **de l'autre profil déjà validée** montrant la pose, avec la consigne
     « the SECOND image shows ONLY THE POSE to reproduce — do NOT copy the man, reproduce
     only the POSITION of the body ».
  3. **Presse à cuisses, position B** : chaîner **depuis M** (jamais depuis A : le générateur
     part en profil avec une seule jambe lisible) et décrire la géométrie de façon concrète
     (« mollets contre les cuisses, genoux vers les aisselles, ~120° »).
  4. **Les scripts d'assemblage sont prêts** : `scripts/build-planche-exo.sh` (1440×300),
     `scripts/build-planche-grille.sh` (1440×900), `scripts/build-gif-lot-depuis-gifs.sh`
     (planche animée 1420×265 **depuis les GIF déjà livrés**, sans les ré-encoder) et
     `scripts/build-gif-lot.sh` (GIF individuels 460×257 depuis les PNG).
- **À FAIRE IMMÉDIATEMENT, dans l'ordre :**
  1. **Finir le Lot B-02 FEMME** (6 images) : `back-squat-charge-moderee` FEMME puis
     `presse-a-cuisses-pieds-hauts` FEMME, dans `themeB/femme/_sources/B-02F/`, en appliquant
     la recette ci-dessus + le contrôle 1:1.
  2. **Assembler le Lot B-02 FEMME** : planche animée `themeB/femme/LOT-B02F-quadriceps.gif`
     (1420×265) + grille `themeB/femme/LOT-B02F-PLANCHE-TRAVAIL.jpg` (1440×900) + les 2
     planches statiques manquantes (1440×300).
  3. **Enchaîner le Lot B-03** (`back-squat` — POC à refaire, `squat-cycliste-squat-complet`,
     `leg-press`) puis les lots B-04 à B-09 du sous-thème quadriceps, H puis F.
  *(Note : les 2 circuits LOT 3 HOMME en version composite et les 3 animations du POC restent
  en réserve jusqu'à accord explicite du user.)*

## 2. LES 15 RÈGLES À NE PAS NÉGOCIER

1. **1 exercice = 1 animation spécifique** — jamais copier / renommer / réutiliser.
2. **Ne jamais remplacer une animation livrée sans accord explicite** (les corrections de GIF
   sont autorisées sous le feu vert du 2026-10-07 et tracées dans `SUIVI.md` ; POC et circuits
   HOMME hors feu vert sans accord explicite).
3. **Pas touche à `release/` ni à `public/media`** ni au code applicatif avant intégration.
4. **Honnêteté totale sur les échecs et réserves.** Jamais de faux 100 %.
5. **Drapeau rouge à 10 appels `generate_image` par tour.** Rejouer une image ratée est
   normal : **compter chaque appel** et le détailler dans le tableau de fin de tour.
6. **Technique doutée → vérifier en ligne avant de générer et citer les URLs dans le commit.**
7. **L'œil de l'utilisateur tranche** : planches déposées pour validation.
8. **Accord permanent pour committer et pousser.**
9. **Lots par thème** — A échauffement (100% ✅) → B musculation (en cours) → C étirements →
   D cardio → E piscine.
10. **Terminer un thème entier avant de passer au suivant.**
11. **Périmètre HOMME + FEMME = 614 animations** (`themeB/` = homme, `themeB/femme/` = femme).
12. **Le sandbox se réinitialise à chaque tour : seul ce qui est dans git survit.**
13. **Committer et pousser dès qu'un exercice est complet**, sans attendre la fin du lot.
14. **Vérifier en ligne la CONFIGURATION exacte de chaque mouvement AVANT de générer**
    (YouTube, sites de fitness, GB Performance, guides de coachs) ET vérifier le matériel dans
    `inventaire.json` (ex. `bulgarian-split-squat` = `bodyweight` au Lot B-01 vs
    `bulgarian-split-squat-halteres` = `dumbbell` au Lot B-02). **Citer les URLs dans le commit.**
15. **Le user n'a NI le visualiseur d'Arena NI les pièces jointes.** Tout aperçu à valider
    doit être **commité DANS LE DÉPÔT et signalé par un LIEN GitHub direct**.

## 3. STYLE VALIDÉ & ASTUCES TECHNIQUES DU GÉNÉRATEUR

- **Style** : mannequin anatomique 3D très musclé, corps **blanc argenté MAT** (jamais chromé),
  visage **noir mat lisse sans traits**, casquette blanche, short noir (plus brassière noire et
  tresse pour la femme), baskets blanches, muscles ciblés **jaune-orangé dorés**. Décor :
  **terrasse bord de mer** (dallage de pierre clair irrégulier, muret blanc bas, mer, palmiers)
  + **tapis de sport noir** au sol. Interdit : salle, parquet, mur intérieur, miroir.
- **Références d'identité** : `Screenshot_20261005_212714_Facebook.jpg` (homme) + poses HD
  `themeA/_sources/A-02/squat-poids-du-corps-{A,M,B}.png` et
  `themeA/_sources/A-08/warmup-mobilite-A.png` ; `yanis-fitness-evolution/animations/REF-personnage-feminin.jpg`
  (femme) + poses HD `themeA/femme/_sources/A-02F/squat-poids-du-corps-{A,M,B}.png` et
  `themeA/femme/_sources/A-08F/warmup-mobilite-A.png`.
- **Astuces cruciales (apprises sur les tours précédents)** :
  1. **Hauteur de squat/fente en M et B** : quand on passe 2 images `[img1, img2]`, le modèle
     verrouille la hauteur du bassin et des jambes sur **`img1`**. Pour obtenir une vraie
     flexion intermédiaire à 45° (M) ou profonde à 90° (B) sur `goblet-squat` ou un squat/fente,
     passer `squat-poids-du-corps-M.png` (pour M) ou `squat-poids-du-corps-B.png` (pour B) en
     **première image (`images[0]`)** ou en référence unique !
  2. **Éviter l'artefact des 3 jambes** : ne jamais passer simultanément une image avec 2 pieds
     au sol et une image avec 1 pied sur un banc. Passer **une seule image source** et demander
     de placer le pied sur le banc (`ONLY TWO LEGS total`).
  3. **ImageMagick `convert -annotate`** : toujours spécifier `-font DejaVu-Sans` (la police par
     défaut échoue).
- **Contrôle qualité obligatoire avant chaque commit** :
  - Visuel (`read_file`), objectif (`compare -metric RMSE` **>= 0,030**), format paysage 16:9,
    anti-doublon `md5sum`.
  - Assemblage via `scripts/build-gif-lot.sh` (`460×257` pour chaque GIF, `1420×265` pour la
    planche animée 3 colonnes sans `-layers optimize`).
