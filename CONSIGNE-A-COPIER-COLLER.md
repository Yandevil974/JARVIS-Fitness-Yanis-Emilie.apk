# 📋 CONSIGNE À COPIER-COLLER — nouveau chat

Copier **tout le bloc ci-dessous** (entre les deux lignes) et le coller en premier message
du nouveau chat. Il est autonome : il ne suppose rien des conversations précédentes.

---

Reprends le chantier « reconstruction des animations » de JARVIS Fitness.

**Dépôt** : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public).
**Branche contenant tout l'historique consolidé (63 / 614 animations)** :
`arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` (derniers commits : `877f003` suivi tour 9,
`f11b3b9` `goblet-squat` HOMME). Repli : `arena/93096144-jarvis-fitness-yanis-emilie-ap`,
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

## 1. ÉTAT CONSOLIDÉ AU 2026-10-08 (63 / 614 animations livrées)

- **Thème A (Échauffement, mobilité & activation) : 100 % TERMINÉ (50 / 50 ✅)**
  - **25 / 25 en HOMME** (LOT 1, LOT 2, LOT 3, A-01 à A-05, et LOT A-08/09 `warmup-route`,
    `warmup-mobilite`, `warmup-approche` `204a8b4`) ;
  - **25 / 25 en FEMME** (LOT R1F, LOT R2F, LOT 3F composites 9 poses `circuit-gainage`
    `f07c04d` & `circuit-abdominaux` `5e5a2e3`, A-01F à A-05F, et LOT A-08F/09F
    `warmup-route`, `warmup-mobilite`, `warmup-approche` `5467b86`).
- **Thème B (Musculation — Sous-thème Jambes : quadriceps & squats) : ouvert (2 / 187 en HOMME)**
  - **Lot B-01 HOMME (2 / 3 livrés + 1 exercice à 2/3 positions)** :
    - ✅ **`bulgarian-split-squat` HOMME** (`c2efd7d`, **62 / 614**) : squat bulgare au poids
      du corps en vue 3/4 avant sur tapis noir avec banc noir derrière (RMSE A→M `0,1278`,
      M→B `0,1347`, planche `themeB/LOT-B01-bulgarian-split-squat-PLANCHE-FINALE.jpg`).
    - ✅ **`goblet-squat` HOMME** (`f11b3b9`, **63 / 614**) : haltère noir tenu verticalement
      en coupe contre le sternum, A debout → M demi-squat 45° → B squat profond 90° coudes à
      l'intérieur des genoux (planche `themeB/LOT-B01-goblet-squat-PLANCHE-FINALE.jpg`).
      ⚠️ **Réserve déclarée** : le générateur a aussi changé l'échelle de caméra — mesuré sur
      le **décor seul**, l'écart A→M est de `0,3946` (contre `0,1301` pour le bulgarian déjà
      livré). Les RMSE affichés (`0,3476` / `0,2979`) **ne mesurent donc pas le mouvement** ;
      la lisibilité a été validée à l'œil. Le dire tel quel, ne pas le maquiller.
    - ⚠️ **`step-up-sur-banc-hauteur-du-genou` HOMME : 2 / 3 positions** — A et M conformes
      dans `themeB/_sources/B-01/`, **la position B a été refusée 5 fois** (le générateur
      repose le mannequin au sol au lieu de le hisser sur le banc) → **aucun GIF livré, ne pas
      annoncer l'exercice comme terminé**. Pistes : vue de profil, ou générer B d'abord.
- **À FAIRE IMMÉDIATEMENT, dans l'ordre :**
  1. **Finir `step-up-sur-banc-hauteur-du-genou` HOMME : 1 SEULE image** (position B = extension
     complète debout sur le banc noir). A et M sont **déjà commitées** dans
     `themeB/_sources/B-01/` — ne pas les régénérer, elles sont payées. Pistes : (a) repartir de
     M en demandant explicitement de **hisser le mannequin sur le banc** ; (b) passer en **vue
     de profil** (le profil débloque les poses qui échouent en 3/4) ; (c) générer **B d'abord**
     et re-chaîner A et M depuis les sources déjà dans git.
  2. **Assembler le Lot B-01 HOMME** : planche animée `themeB/LOT-B01-quadriceps.gif`
     (`1420×265`, 4 frames) + grille 3×3 `themeB/LOT-B01-PLANCHE-TRAVAIL.jpg` (`1440×900`).
     ⚠️ `scripts/build-gif-lot.sh` **régénère** les 3 GIFs individuels depuis des PNG
     `<ex>-A/M/B.png` : passer un dossier d'appui contenant les PNG déjà commités et vérifier
     ensuite les 3 GIFs individuels (`git checkout --` ceux qui ne devaient pas bouger).
  3. **Enchaîner avec le Lot B-01 FEMME** (`bulgarian-split-squat`, `goblet-squat`,
     `step-up-sur-banc-hauteur-du-genou` en version femme dans `themeB/femme/`, sources dans
     `themeB/femme/_sources/B-01F/`), puis **Lot B-02 H puis F**.
  4. **Poursuivre le Thème B** dans l'ordre de `PLAN-THEMES.md`.
  *(Note : les 2 circuits LOT 3 HOMME en version composite et les 3 animations du POC restent
  en réserve jusqu'à accord explicite du user).*

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
