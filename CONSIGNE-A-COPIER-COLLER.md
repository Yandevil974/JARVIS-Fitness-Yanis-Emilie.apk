# 📋 CONSIGNE À COPIER-COLLER — nouveau chat

Copier **tout le bloc ci-dessous** (entre les deux lignes) et le coller en premier message
du nouveau chat. Il est autonome : il ne suppose rien des conversations précédentes.

---

Reprends le chantier « reconstruction des animations » de JARVIS Fitness.

**Dépôt** `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public).
**Branche de session** : `arena/93096144-jarvis-fitness-yanis-emilie-ap` — c'est celle qui
contient tout l'historique du chantier à l'issue du tour Fitness 13. Si la branche annoncée
par le prompt système est différente (une branche `arena/<autre-id>-…`), écris sur celle
annoncée par le système.
**Derniers commits de contenu : `5e5a2e3` (circuit-abdos F 9/9), `e5b670a` (fire hydrant F 3/4),
`9ed4d87` (squat H 3/4).**

**OUVERTURE OBLIGATOIRE :**

```bash
git fetch origin
# ⚠️ un simple `git fetch origin` ne rapporte PAS toujours les branches arena.
# Si `git branch -r` ne montre pas la branche, forcer le refspec :
git fetch origin 'refs/heads/arena/*:refs/remotes/origin/arena/*'
# puis, si HEAD est retombé sur ddd1fb9 :
git reset --hard origin/arena/93096144-jarvis-fitness-yanis-emilie-ap
```

Lis ensuite `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
`yanis-fitness-evolution/animations/PLAN-THEMES.md`.

---

## 1. ÉTAT AU 2026-10-07 (après Fitness 13 — 3ᵉ tour)

- **49 / 614 animations livrées.** Thème A : **20 / 25 en homme, 18 / 25 en femme**
  (rattrapage de la fille 100 % terminé sur les lots 1, 2, 3 et A-01 à A-03 ✅).
- **`circuit-gainage` FEMME : LIVRÉ** (composite 3 phases, 9/9 positions, commit `f07c04d`).
- **`circuit-abdominaux` FEMME : LIVRÉ** (composite 3 phases, 9/9 positions, commit `5e5a2e3`).
  Fichiers : `themeA/femme/circuit-abdominaux-3poses.gif` (460×257, 16 frames) et
  `themeA/femme/LOT3F-circuit-abdominaux-femme.gif` (planche 1420×265, 3 colonnes).
  ⚠️ **Écart assumé** : sa phase 3 est une **planche HAUTE (sur les mains)**.
- **Corrections autorisées par le user (feu vert du 2026-10-07) — toutes livrées :**
  - ✅ **squat FEMME, position M** corrigée (`277b87f`) — RMSE A→M 0,288 ;
  - ✅ **abduction hanche FEMME, position B** corrigée (`e67a36f`) — RMSE M→B 0,255 ;
  - ✅ **fire hydrant FEMME, positions A, M et B** corrigées en **vue arrière trois-quarts**
    (`e5b670a`) — RMSE A→M 0,088, M→B 0,090 ;
  - ✅ **squat HOMME, positions A, M et B** corrigées en **vue trois-quarts sur tapis noir**
    (`9ed4d87`) — RMSE A→M 0,076, M→B 0,090.
- **LOT A-04 HOMME : 3 / 3 exercices LIVRÉS (`db1c520`) :**
  - ✅ **`abduction-assise-machine-ou-elastique` HOMME** (`bd77abf`) en **vue de face directe**
    (RMSE A→M 0,0735, M→B 0,0838) ;
  - ✅ **`pallof-press-a-l-elastique` HOMME** (`f2c7d13`) en **vue trois-quarts avant**
    (RMSE A→M 0,0500, M→B 0,0898 ; réserve : pieds plus écartés en B) ;
  - ✅ **`face-pull-a-l-elastique` HOMME** (`db1c520`) en **vue trois-quarts arrière** face
    au poteau noir à gauche (A bras tendus → M tirage coudes hauts → B rotation externe 90°,
    RMSE A→M 0,0566, M→B 0,0520) ;
  - ✅ Planche animée `themeA/LOT-A04-echauffement.gif` (1420×265, 4 frames) et planche 3×3
    `themeA/LOT-A04-PLANCHE-TRAVAIL.jpg` (1440×897).
- **LOT A-04 FEMME : 1 / 3 exercice livré + base A du 2ᵉ exercice :**
  - ✅ **`abduction-assise-machine-ou-elastique` FEMME** (`721ad18`) en **vue de face directe**
    (RMSE A→M 0,0864, M→B 0,0746) + planche `themeA/femme/LOT-A04F-abduction-assise-PLANCHE-FINALE.jpg` ;
  - ⏳ **`pallof-press-a-l-elastique` FEMME** : position A prête et validée dans
    `themeA/femme/_sources/A-04F/pallof-press-a-l-elastique-A.png` (mains au sternum, poteau
    noir à gauche). Reste à chaîner M et B dès l'ouverture du prochain tour (2 images IA) ;
  - ⬜ **`face-pull-a-l-elastique` FEMME** : A → M → B en vue trois-quarts arrière face au
    poteau noir à gauche (3 images IA) → assemblage de `themeA/femme/LOT-A04F-echauffement-femme.gif`
    (1420×265) et `themeA/femme/LOT-A04F-PLANCHE-TRAVAIL.jpg` (1440×897).
- **À FAIRE, dans l'ordre :**
  1. **Terminer le LOT A-04 FEMME (2/3 et 3/3)** :
     - chaîner `M.png` et `B.png` de `pallof-press-a-l-elastique` FEMME depuis
       `themeA/femme/_sources/A-04F/pallof-press-a-l-elastique-A.png` → GIF + commit ;
     - produire `face-pull-a-l-elastique` FEMME (`A.png` → `M.png` → `B.png` en vue 3/4
       arrière face au poteau noir à gauche, en s'aidant de `_sources/A-04/face-pull-a-l-elastique-*.png`)
       → GIF + planche `themeA/femme/LOT-A04F-echauffement-femme.gif` (1420×265) + commit ;
  2. **LOT A-05** (`respiration-diaphragmatique`, `hip-thrust-unilateral-1-jambe`), puis les
     3 étapes chrono `warmup-route`, `warmup-mobilite`, `warmup-approche` — **en HOMME puis
     en FEMME** ;
  3. **Circuits LOT 3 HOMME** en version composite + éventuellement **fire hydrant HOMME** en
     vue arrière trois-quarts ;
  4. **POC** (3 animations à refaire) — **accord du user requis**, hors périmètre du feu vert ;
  5. ensuite seulement : **thème B — musculation**.

## 2. CONSIGNE À NE PAS NÉGOCIER

1. **1 exercice = 1 animation spécifique** — jamais copier / renommer / réutiliser.
2. Ne jamais remplacer une animation livrée sans accord explicite.
   ⚠️ **Feu vert du 2026-10-07** : les corrections de GIF déjà livrés sont autorisées ;
   chaque correction reste tracée dans `SUIVI.md` (section « CORRECTIONS AUTORISÉES »).
3. Pas touche à `release/` ni à `public/media` avant validation de l'intégration.
4. Honnêteté sur les échecs et réserves. Jamais de faux 100 %.
5. **Drapeau rouge à 10 images IA = 3 exercices par tour.** Limite technique, pas un
   jugement sur les images. Rejouer une image ratée est normal : la **compter** et le dire.
6. Technique doutée → vérifier en ligne et **citer la source dans le commit**.
7. **L'œil de l'utilisateur tranche** : planche affichée pour validation.
8. Accord permanent pour committer/pousser.
9. **Lots par thème** — A échauffement → B musculation → C étirements → D cardio → E piscine.
10. **Terminer un thème entier avant de passer au suivant.**
11. **Périmètre HOMME + FEMME** — 614 animations. `themeA/` = homme, `themeA/femme/` = femme.
12. **Le sandbox se réinitialise à chaque tour : seul ce qui est dans git survit.** Toute
    référence doit être déposée par le user **sur GitHub**. Pas de pièce jointe, pas de `curl`.
13. **Terminer un lot dans le tour où il est commencé** — et **committer dès qu'un exercice
    est complet**, sans attendre la fin du lot.
14. **Doute sur la CONFIGURATION d'un mouvement → vérification en ligne AVANT de générer**
    (YouTube, sites de fitness spécialisés, GB Performance, guides de coachs). 1 exercice =
    1 configuration **exacte et cohérente** : point d'appui, angles articulaires, hauteur du
    bassin, sens du mouvement, amplitude. **Source citée dans le message de commit.**
15. **Le user n'a NI le visualiseur d'Arena NI les pièces jointes.** Tout aperçu à valider
    doit être **déposé DANS LE DÉPÔT** (planche de travail, grille de contrôle, GIF) **et
    signalé par un LIEN GitHub** dans le message. « Affiché dans le chat » ≠ « user a vu ».

## 3. POINT BLOQUANT IDENTIFIÉ — le fire hydrant (à savoir avant de générer)

**Ce n'est pas un problème de prompt, c'est un problème d'ANGLE DE VUE.** Sur une vue de
**profil**, le générateur rend systématiquement l'abduction de hanche comme une **extension
de jambe vers l'arrière (donkey kick)** : quatre tentatives ont échoué, y compris avec des
consignes spatiales explicites (« le genou vient vers la caméra », « la face interne de la
cuisse »). **La version HOMME livrée a exactement le même défaut.** Une vue de profil ne
peut de toute façon pas montrer ce mouvement — la jambe s'éloigne de l'axe de la caméra.

**Solution retenue : la VUE ARRIÈRE TROIS-QUARTS** (l'angle des démonstrations de référence),
où l'on voit le dos, les fesses, les semelles tournées vers le plafond et l'ouverture de la
hanche. Base conforme déjà produite :
`themeA/femme/_sources/A-02F/fire-hydrant-elastique-A3.png`
(quatre pattes, mains sous les épaules, genoux sous les hanches, semelles vers le plafond,
élastique noir au-dessus des genoux).
Reste à chaîner : **M** (genou gauche ouvert à ~45°, genou toujours plié à 90°) puis **B**
(cuisse gauche à l'horizontale, tibia vers le sol).
⚠️ Cette correction crée une **rupture de cadrage assumée** avec les deux autres exercices du
lot A-02 FEMME (profil/face) — à valider par le user.

## 4. STYLE (ne pas dévier)

Mannequin anatomique 3D **TRÈS MUSCLÉ**, corps **BLANC ARGENTÉ MAT** (jamais chromé, jamais
miroir). **VISAGE ENTIÈREMENT NOIR MAT**, lisse, sans aucun trait. Casquette blanche. Short
noir, baskets blanches. Muscles travaillés **dorés jaune-orangé**. Décor unique : **terrasse
bord de mer** (pierre claire, mer, palmiers, mur blanc bas) ; **exception piscine intérieure**
pour l'aqua. **Tapis de sport NOIR** pour les exercices au sol. INTERDIT : salle, parquet en
bois, mur intérieur, miroir.
Références d'identité : `Screenshot_20261005_212714_Facebook.jpg` (homme, racine du dépôt) et
`animations/REF-personnage-feminin.jpg` (femme). **Les deux mannequins suivent le même code.**
⚠️ Réserve récurrente : le générateur rend parfois le corps **brillant** au lieu d'argenté mat.

## 5. MÉTHODE

3 positions chaînées **A → M → B** (chaque image générée **depuis la précédente**), puis
**circuit composite = 3 phases × 3 positions = 9 positions** produites à la suite dans la
même série chaînée (≈ 9-10 images = **1 circuit par tour et demi**, ce n'est pas anormal).

Assemblage avec `scripts/build-gif-lot.sh <src> <out> <titre> <ex>` (460×257,
`-delay 130/110`, `-colors 96`, boucle A→M→B→M). **Jamais `-layers optimize` sur la planche**
(le script contient le garde-fou).
**Convention des composites (3 phases)** : la boucle est A→M→B sur **chaque** phase, puis
retour arrière jusqu'au départ (P1A-M-B → P2A-M-B → P3A-M-B → P2M-A → P1M-A), pour éviter un
saut du mannequin entre la fin du circuit et son recommencement. **(à confirmer par le user.)**
`build-gif-lot.sh` ne sait faire que la boucle à 3 positions : pour un composite, réutiliser
les **mêmes paramètres** avec `convert` + `montage`.

**Contrôle qualité obligatoire avant de livrer :**
- contrôle **visuel** de chaque position (l'agent voit les images) ;
- contrôle **objectif** : `compare -metric RMSE posA.png posM.png null:` → seuil de lisibilité
  **0,030** (en dessous, le mouvement ne se lit pas) ;
- contrôle **de format** : **paysage** obligatoire (le générateur rend parfois du portrait,
  inexploitable) ;
- anti-doublon : `md5sum` sur tous les GIF du chantier ;
- **committer dès qu'un exercice est complet**, puis mettre à jour `SUIVI.md` /
  `PLAN-THEMES.md` et pousser.

Pour afficher un GIF multi-positions : toujours `convert x.gif -coalesce` (frames partiellement
optimisées).

## 6. PANNES CONNUES DU GÉNÉRATEUR (anticipées, à compter)

- `Response contains no images` / `finishReasons: MAX_TOKENS` → erreur technique, **relancer**.
  Les prompts très longs la déclenchent plus souvent : préférer des consignes courtes et
  impératives.
- **Image en portrait** au lieu de paysage → rejouer.
- **Planche sur les mains** au lieu d'un appui sur les avant-bras → rejouer, ou assumer et
  documenter.
- **Donkey kick** au lieu d'une abduction (vue de profil) → changer l'angle de vue (voir § 3).
- **Corps brillant** au lieu d'argenté mat → surveiller et signaler en réserve.
- Le générateur **ne change pas d'angle de vue** sur demande : il rejoue souvent le même
  cadrage. Pour changer de vue, mieux vaut **créer une nouvelle position de départ** depuis
  la référence d'identité + une référence de décor.

## 7. RÉSERVES CONNUES (honnêtes)

- POC (3 animations) : cadrages coupés et artefacts — **accord user requis** avant reprise.
- Circuits LOT 3 **HOMME** : encore en version simple (1 position sur 3) — remplacement
  après validation user.
- `circuit-abdominaux` FEMME : casquette dépassant légèrement du tapis sur la position A du
  crunch ; phase 3 en planche haute ; transition de P3-M un peu molle.
- `circuit-gainage` FEMME : main déjà posée au sol en P1-A, mains loin devant les coudes en
  P1-B, montée du bassin discrète (0,035), artefact de dallage dans le ciel en phase 2.
- Artefacts résiduels lots 1 et 3 ; LOT 4 sans tapis (mouvements sur banc) ; squat HOMME pas
  assez bas ; corps parfois brillant.
- Le sandbox se réinitialise à chaque tour → committer tôt et souvent.

## 8. LIVRAISON AU USER — RAPPEL

Le user travaille **uniquement via GitHub**. Déposer les aperçus dans le dépôt et donner le
lien, par exemple :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/arena/6a360b28-jarvis-fitness-yanis-emilie-ap/<chemin>
```

Onglet du dépôt avec tous les GIF :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/tree/arena/6a360b28-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations
```

---

**En résumé : ouverture git obligatoire → lire les 3 documents → produire la 9ᵉ position du
`circuit-abdominaux` FEMME → finir le fire hydrant FEMME en vue arrière trois-quarts →
corriger le squat HOMME (à confirmer) → LOT A-04 → A-05 → `warmup-*` → thème B.
10 images IA par tour, committer dès qu'un exercice est complet, tout aperçu déposé dans le
dépôt avec un lien, vérification en ligne de la configuration de chaque mouvement, et
honnêteté totale sur les échecs.**
