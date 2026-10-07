# 🚩 PASSATION + CONSIGNE — CHANTIER « RECONSTRUCTION DES ANIMATIONS »

## Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

**État consolidé au 7 octobre 2026 (Fitness 13 — 5ᵉ tour) · 55 / 614 animations livrées
(thème A : 22/25 en HOMME, 22/25 en FEMME — les 22 exercices d'activation/mobilité/gainage
sont 100 % terminés en H et F ✅) · LOT A-04 H+F et LOT A-05 H+F 100 % complets · ne
restent sur le Thème A que les 3 étapes chrono `warmup-route`, `warmup-mobilite`,
`warmup-approche` (H + F) et le passage des 2 circuits LOT 3 HOMME en composite · branche
de session `arena/93096144-jarvis-fitness-yanis-emilie-ap`**

> ### 🔄 MISES À JOUR DU 2026-10-07 (Fitness 13 — 5ᵉ tour) — LOT A-05 HOMME et LOT A-05 FEMME 100 % livrés (22/25 H et 22/25 F sur le Thème A)
>
> 1. **`circuit-abdominaux` FEMME LIVRÉ (`5e5a2e3`)** : 9ᵉ position (planche haute tenue)
>    produite, GIF composite `themeA/femme/circuit-abdominaux-3poses.gif` (460×257, 16 frames)
>    et planche `themeA/femme/LOT3F-circuit-abdominaux-femme.gif` (1420×265) assemblés.
> 2. **Corrections autorisées par le user (feu vert) soldées :**
>    - ✅ **squat FEMME position M** (`277b87f`, RMSE A→M 0,288) ;
>    - ✅ **abduction hanche FEMME position B** (`e67a36f`, RMSE M→B 0,255) ;
>    - ✅ **fire hydrant FEMME A/M/B** en **vue arrière trois-quarts** (`e5b670a`, RMSE A→M 0,088, M→B 0,090) ;
>    - ✅ **squat HOMME A/M/B** refait en trois-quarts sur tapis noir (`9ed4d87`, RMSE A→M 0,076, M→B 0,090).
> 3. **LOT A-04 HOMME (`db1c520`) et LOT A-04 FEMME (`2a202a4`) COMPLETS (3/3 H + 3/3 F) :**
>    - ✅ `abduction-assise-machine-ou-elastique` (H + F), `pallof-press-a-l-elastique` (H + F),
>      `face-pull-a-l-elastique` (H + F) + planches `LOT-A04-echauffement.gif` et
>      `LOT-A04F-echauffement-femme.gif`.
> 4. **LOT A-05 HOMME COMPLET (3/3, `5346b43`) :**
>    - ✅ **`respiration-diaphragmatique` HOMME** (`1ca6f4e`, RMSE A→M 0,0616, M→B 0,1144) ;
>    - ✅ **`hip-thrust-unilateral-1-jambe` HOMME** (`5346b43`, RMSE A→M 0,1502, M→B 0,1194) ;
>    - ✅ `dead-bug` HOMME (déjà en LOT 1) + planche `themeA/LOT-A05-echauffement.gif` (1420×265)
>      + grille `themeA/LOT-A05-PLANCHE-TRAVAIL.jpg`.
> 5. **LOT A-05 FEMME COMPLET (3/3) :**
>    - ✅ **`respiration-diaphragmatique` FEMME** (`beb04bf`, RMSE A→M 0,0865, M→B 0,1106) ;
>    - ✅ **`hip-thrust-unilateral-1-jambe` FEMME** (RMSE A→M 0,0842, M→B 0,1706) ;
>    - ✅ `dead-bug` FEMME (déjà en LOT R1F) + planche `themeA/femme/LOT-A05F-echauffement-femme.gif`
>      (1420×265) + grille `themeA/femme/LOT-A05F-PLANCHE-TRAVAIL.jpg`.

> ### 🔄 MISES À JOUR DU 2026-10-07 (2ᵉ passe) — règles 14 et 15
>
> 1. **Doute sur la configuration d'un mouvement → vérifier en ligne AVANT de générer**
>    (YouTube, sites de fitness, **GB Performance**, guides de coachs) et **citer la source
>    dans le commit** — l'exigence porte aussi sur les **angles, appuis et amplitudes**, pas
>    seulement sur le nom du mouvement.
> 2. **Le user ne voit NI le visualiseur d'Arena NI les pièces jointes** : les aperçus sont
>    déposés **dans le dépôt** et signalés par un **lien GitHub**.

> ### 🟢 OÙ EN EST LE RATTRAPAGE DE LA FILLE (consigne du user)
>
> Le user a demandé de **rattraper l'homme côté femme** pour qu'ensuite les deux avancent
> au même rythme. État réel, sans enjolivement :
>
> | Lot du thème A | Homme | Femme | Planche femme |
> | --- | --- | --- | --- |
> | **Lot 1** — dead bug, bird dog, gainage latéral | ✅ | ✅ **fait** | `LOT-R1F-rattrapage-lot1-femme.gif` (1420×265, 3 colonnes) |
> | **Lot 2** — mountain climbers, dead bug rotation, gainage latéral dyn. | ✅ | ✅ **fait** | `LOT-R2F-rattrapage-lot2-femme.gif` (1420×265, 3 colonnes) |
> | **Lot 3** — les 2 circuits | ⚠️ version simple (remplacement après accord) | ✅ **fait** : `circuit-gainage` (`f07c04d`) + `circuit-abdominaux` (`5e5a2e3`) **LIVRÉS (9/9)** | `LOT3F-circuit-gainage-femme.gif` + `LOT3F-circuit-abdominaux-femme.gif` (1420×265) |
>
> **Le rattrapage de la fille est 100 % terminé** : l'homme et la femme comptent désormais
> tous deux **17 / 25** entrées sur le thème A, et les corrections du squat (H + F), de
> l'abduction (F) et du fire hydrant (F) sont livrées.
>
> ### 🚩 RÈGLE VITALE (apprise d'un incident du 2026-10-07)
>
> Un tour **interrompu par le user**, suivi du **reset du sandbox**, a effacé des images
> non commitées — elles ont dû être régénérées et repayées. **Committer dès qu'un exercice
> est complet**, ne jamais attendre la fin du lot pour committer.
>
> ### 👁️ L'AGENT VOIT LES IMAGES
>
> Contrairement aux tours antérieurs, l'agent **voit** les images produites et les GIF
> livrés. Il contrôle chaque position **avant** de livrer (visuellement + mesure objective
> `compare -metric RMSE`) et signale les défauts au lieu de les livrer en silence.
> **La validation finale reste celle de l'utilisateur (règle 7).**
>
> ### ⚠️ BRANCHE DE SESSION
>
> **`arena/6a360b28-jarvis-fitness-yanis-emilie-ap`** — contrainte technique d'Arena :
> la session est suivie par cette branche, l'agent ne peut écrire que dessus. Elle contient
> **tout l'historique du chantier** (POC → LOT 5 → thème A → lots FEMME).
>
> ### 🚨 LE SANDBOX SE RÉINITIALISE À CHAQUE TOUR
>
> À chaque ouverture de tour : la branche locale retombe sur `ddd1fb9` et **tout ce qui
> n'est pas dans git est effacé**. En ouverture : `git fetch origin` puis, si HEAD est
> retombé, `git reset --hard origin/arena/6a360b28-jarvis-fitness-yanis-emilie-ap`.
> **Seul ce qui est dans git survit.** Toute nouvelle référence doit être déposée par le
> user **sur GitHub** (pièce jointe du chat et `curl` ne fonctionnent pas).

---

## 0. CADRE

- Dépôt : `github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public)
- **Branche de travail : `arena/6a360b28-jarvis-fitness-yanis-emilie-ap`**
  — ne jamais changer de branche, c'est elle qu'Arena suit.
- Dernier commit de contenu **livré** : **`1257544`** — LOT R2 FEMME terminé (lot 2 rattrapé)
- **`circuit-gainage` FEMME : LIVRÉ** (`f07c04d`) — 9/9 positions, animation composite
  460×257 + planche 1420×265, planche validée par le user.
- En cours : **`circuit-abdominaux` FEMME, 8/9 positions** (la 9ᵉ ouvre le prochain tour).
- Ne pas toucher à `release/`, `public/media` ni à aucun fichier applicatif.

### Historique consolidé

```
1257544  LOT R2 FEMME terminé — lot 2 rattrapé (3/3)
8a4cb13  LOT R1 FEMME terminé + LOT R2 FEMME (mountain climbers, partiel)
a465884  LOT R1 FEMME — rattrapage lot 1 (dead bug + gainage latéral)
9a1072f  passation — hash de contenu e33605b
e33605b  LOT A-03 FEMME — pompes, gainage planche, abduction hanche
7f6d833  suivi + passation — LOT A-02 FEMME
bda24e1  LOT A-02 FEMME — fire hydrant, squat, fentes arrière (2 sous réserve)
475beaa  DRAPEAU ROUGE — passation (état arena/50bc4ba3)
da07c20  LOT A-01 FEMME — échauffement & activation
f9b95da  référence du personnage féminin, déplacée et commitée
45056dd  dépôt de la photo du personnage femme par le user
494682f  LOT A-03 — échauffement, suite (thème A, homme)
c05a672  périmètre HOMME + FEMME — 614 animations
918e424  LOT A-02 — échauffement, suite (homme) + build-gif-lot.sh
6bb5fad  LOT A-01 — échauffement & activation (homme)
e8b7199  plan de production thématique
acae07f  passation (ancienne branche) · 02f7c8d LOT 4 · 2f5e0e5 LOT 5 · 1e7f70a LOT 3
        26a1ffe LOT 2 · 8e5b5d3 LOT 1 · 957fffe inventaire maître + POC validé
```

---

## 1. CONSIGNE À NE PAS NÉGOCIER

1. **RÈGLE ABSOLUE N°1 : 1 exercice = 1 animation spécifique.**
   Aucun GIF partagé entre deux exercices. Interdit : copier, renommer, réutiliser,
   animation « proche » ou générique.
2. Ne jamais remplacer une animation livrée sans accord explicite, exercice par exercice.
3. Ne pas toucher à `release/` ni aux médias existants (`public/media`) tant que
   l'intégration n'est pas validée. Aucun fichier applicatif modifié à ce stade.
4. Signaler honnêtement les échecs et les réserves. Jamais de faux 100 %.
5. **Drapeau rouge = limite technique de génération atteinte (10 images IA par tour, soit
   3 exercices maximum).** Ce n'est PAS un jugement sur les images produites. Le dire au
   user quand la limite est atteinte et reprendre au tour suivant.
6. Si un doute existe sur la technique d'un exercice : vérifier en ligne (guides
   spécialisés, coachs, sites de référence) avant de générer, et **citer la source dans
   le message de commit**.
7. **L'œil de l'utilisateur tranche.** Afficher la planche de montage dans le chat pour
   validation.
8. Le user a donné son accord permanent pour committer et pousser les lots de ce chantier.
9. **Les lots sont organisés PAR THÈME**, plus par fichier dupliqué.
   Voir `yanis-fitness-evolution/animations/PLAN-THEMES.md`.
10. **Terminer un thème entier avant de passer au suivant.** Le thème A (échauffement) est
    en cours — ne pas attaquer le thème B avant la fin.
11. **PÉRIMÈTRE HOMME + FEMME** : chaque exercice, chaque étirement et chaque guide piscine
    existe en **deux** animations — mannequin homme (Yanis) et mannequin femme (Émilie).
    **Total = 614 animations.**
12. **Le sandbox se réinitialise à chaque tour.** Toujours `git fetch origin` + si besoin
    `git reset --hard origin/arena/6a360b28-…` **en ouverture de tour**.
    **Seul ce qui est dans git survit.** Toute référence doit être déposée par le user
    **sur GitHub** puis commitée. Pas de pièce jointe, pas de `curl`.
13. **Un lot commencé doit être terminé dans le même tour**, sinon les images
    intermédiaires sont perdues au reset suivant (le LOT A-04 en a fait les frais).
    **Corollaire ajouté le 2026-10-07 : committer dès qu'un exercice est complet**, sans
    attendre la fin du lot.
14. **Doute sur la CONFIGURATION d'un mouvement → vérification en ligne AVANT de générer**
    (ajouté le 2026-10-07 à la demande du user) : YouTube (démonstrations de coachs), sites
    de fitness spécialisés, **GB Performance**, guides de référence. 1 exercice = **1
    configuration exacte et cohérente** — point d'appui, angles articulaires, hauteur du
    bassin, sens du mouvement, amplitude. **La source est citée dans le message de commit**
    (extension de la règle 6 : c'est une exigence, pas une option).
15. **Le user n'a NI le visualiseur d'Arena NI les pièces jointes** (constaté le
    2026-10-07 : « je ne peux pas avoir accès au visualiseur, il n'y a rien »). **Tout
    aperçu à valider est déposé DANS LE DÉPÔT** (planche de travail, grille de contrôle,
    GIF) **et signalé par un LIEN GitHub** dans le message, avec la marche à suivre
    (onglet « Code » → chemin du fichier → vignette/raw, ou vue « Files changed » d'un
    commit). **« Fichier affiché dans le chat » ≠ « user a vu ».**

---

## 2. STYLE VALIDÉ (ne pas dévier)

- Mannequin anatomique 3D **TRÈS MUSCLÉ**, corps **BLANC ARGENTÉ MAT** (jamais chromé,
  jamais miroir).
- **VISAGE ENTIÈREMENT NOIR MAT**, lisse, sans aucun trait. Casquette blanche.
- Short noir, baskets blanches. Muscles travaillés **dorés jaune-orangé brillant**.
- **DÉCOR UNIQUE : terrasse bord de mer** (pierre claire, mer, palmiers, mur blanc bas).
  INTERDIT : salle de sport, parquet en bois, mur intérieur, miroir.
- **EXCEPTION : piscine intérieure** pour les exercices aquatiques (vue mi-air / mi-eau).
- **TAPIS DE SPORT NOIR** pour tous les exercices au sol.
- **Références d'identité :** `Screenshot_20261005_212714_Facebook.jpg` (homme, racine du
  dépôt) et **`animations/REF-personnage-feminin.jpg`** (femme, dans le dépôt).
- **Les deux mannequins suivent EXACTEMENT le même code visuel.**
  ⚠️ Réserve connue : le générateur rend parfois le corps **brillant** (proche du chromé)
  au lieu d'argenté **mat** — à surveiller et signaler.

---

## 3. MÉTHODE DE PRODUCTION D'UNE ANIMATION (3 positions)

1. Générer la position de **DÉPART** depuis la référence d'identité (homme ou femme)
   **+ une frame du chantier** pour verrouiller le décor, la lumière et le cadrage.
2. Générer la **MI-COURSE** en CHAÎNANT sur l'image précédente (source = l'étape d'avant).
3. Générer la **POSITION FINALE** en chaînant sur la mi-course.
4. Assembler le GIF : A → M → B → M → boucle, format **460×257**.
5. Assembler une planche animée, 1 colonne par exercice (**1420×265** pour 3 exercices).
6. Afficher la planche dans le chat pour validation, puis committer et pousser
   **immédiatement**.
7. Mettre à jour `animations/SUIVI.md` (compteurs, réserves) et
   `animations/PLAN-THEMES.md` (statuts).

**Plafond : 10 images IA par tour = 3 exercices par tour maximum.**
Chaque image chaînée doit être générée après que sa source existe (ne pas chaîner
plusieurs niveaux dans le même appel parallèle).

**Contrôle qualité obligatoire avant livraison :**
- contrôle **visuel** de chaque position (pose, tenue, décor, cadrage) ;
- contrôle **objectif** : `compare -metric RMSE posA.png posM.png null:` →
  seuil de lisibilité **0,030** (en dessous, le mouvement ne se lit pas) ;
- contrôle **de format** : toutes les positions en **paysage 16:9** (le générateur rend
  parfois du portrait — inexploitable dans une boucle) ;
- anti-doublon : `md5sum` sur tous les GIF du chantier.

### Script d'assemblage (à utiliser tel quel)

```bash
scripts/build-gif-lot.sh <dossier_source> <dossier_sortie> <titre_planche> <ex1> <ex2> [<ex3>]
# le dossier source contient <ex>-A.png / -M.png / -B.png (ou déjà <ex>-3poses.gif)
# produit <ex>-3poses.gif (460x257, -delay 130/110, -colors 96) + la planche animée
```

⚠️ **Ne jamais appliquer `-layers optimize` à la planche** : cela recadre les frames sur
la zone qui bouge (473×265 au lieu de 1404×265). Le script contient le garde-fou.

⚠️ Pour afficher un GIF multi-positions à l'écran, toujours passer par
`convert x.gif -coalesce` (frames partiellement optimisées).

---

## 4. INVENTAIRE (source de vérité)

Fichiers : `animations/inventaire.json` + `animations/INVENTAIRE.md`
Script d'audit : `scripts/audit-animations.mjs` (nécessite `npm install`, non installé
dans le sandbox — les comptages sont refaits en Python depuis `inventaire.json`).

- **614 animations nécessaires** après le passage au périmètre HOMME + FEMME :
  209×2 exercices + 100 chrono (50 étapes × 2 profils) + 29×2 étirements + 19×2 guides
  = **614** (les 10 protocoles aqua sont à `animation_necessaire: false`).
- Le code confirme le besoin : `src/data/visuals-gifs.js` → `stepGif(cle, profil)` renvoie
  la variante **femme** pour `profil === 'emilie'`, avec **repli sur l'homme** s'il n'y en
  a pas. Les 209 **exercices** en revanche partagent un seul GIF (`GIF_OVERRIDES[nom]`,
  aucune variante de profil) — l'app ne saura montrer la version femme des exercices
  qu'après une évolution du code (phase d'intégration, non commencée).
- 48 fichiers dupliqués (servant plusieurs exercices) · 1 orphelin · 29 manquants.
- Toutes les lignes sont en statut « à recréer » : aucune animation existante n'est
  réutilisée.

---

## 5. ÉTAT D'AVANCEMENT

| Élément | Valeur |
| --- | --- |
| Animations créées | **47 / 614** livrées (+2 du LOT A-04 HOMME : `abduction-assise`, `pallof-press`) |
| **Restant à produire** | **567** |
| Versions femme produites | **17 / 307** |
| Animations femme à reprendre | **0** ✅ (squat M, abduction B et fire hydrant A/M/B tous corrigés le 2026-10-07) |
| Animations corrigées (option A + feu vert) | 3 / 5 (option A) + 4 (squat F, abduction F, fire hydrant F, squat H) |
| Fichiers dupliqués traités | 4 / 48 · `666443484c7f0861.gif` → 1 / 3 |
| `bcdbe16aeafaafec.gif` | 8 / 8 ✅ soldé (H + F) |
| `8de6e89e5395700c.gif` | 6 / 7 |
| Doublons sur les fichiers du chantier | **0** (toutes empreintes md5 distinctes) |
| Lots livrés | POC, L1, L2, L3, L4, L5, A-01, A-02, A-03, **A-04 H (2/3)**, A-01F, A-02F, A-03F, **R1F**, **R2F**, **LOT 3F (2 composites)** |

### Thème A — ÉCHAUFFEMENT, MOBILITÉ & ACTIVATION : **19 / 25 en HOMME, 17 / 25 en FEMME**

**Convention de nommage :** `themeA/<exercice>-3poses.gif` = homme,
`themeA/femme/<exercice>-3poses.gif` = femme.

**Restant pour solder le thème A (H + F) :**
- **LOT 3 — les 2 circuits** : à créer en **FEMME** (jamais faits) et à refaire en
  **HOMME** en version composite. 1 circuit par tour (≈ 9 images) ;
- **8 entrées jamais produites** → **16 animations** (8 homme + 8 femme) :
  `A-04` (abduction assise, pallof press, face pull), `A-05` (respiration
  diaphragmatique, hip thrust unilatéral) et les 3 étapes chrono `warmup-*` ;
- **reprises en attente d'accord** : A-02F fire hydrant M/B + squat M (3 images),
  A-03F abduction B (1 image), squat HOMME (voir § 7).

| Lot | Contenu | Statut |
| --- | --- | --- |
| LOT 1 / LOT 2 | dead bug…gainage latéral dyn. (6 exercices) | ✅ H · ✅ **F (rattrapage fait)** |
| LOT 3 | circuit gainage, circuit abdominaux | ✅ H **mais version simple, à refaire en composite** · ❌ **F à créer** |
| **A-01 / A-02 / A-03** | mobilité épaules → abduction hanche | ✅ H · ✅ F (2 reprises sous réserve) |
| **A-04** | abduction assise, pallof press, face pull élastique | ⬜ **jamais produit (H ni F)** |
| **A-05** | respiration diaphragmatique, hip thrust unilatéral | ⬜ à produire |
| **A-06/A-07** | `warmup-route`, `warmup-mobilite`, `warmup-approche` (H + F = 6 anim.) | ⬜ à produire |

### Fichiers FEMME déjà livrés (`animations/themeA/femme/`)

`mobilite-des-epaules`, `pont-fessier-activation`, `clamshell-elastique` (A-01F) ·
`fire-hydrant-elastique` ⚠️, `squat-poids-du-corps` ⚠️, `fentes-arriere-pdc` (A-02F) ·
`pompes`, `gainage-planche`, `abduction-hanche-elastique` ⚠️ (A-03F) ·
`dead-bug`, `bird-dog`, `gainage-lateral` (**R1F**) ·
`mountain-climbers`, `dead-bug-rotation`, `gainage-lateral-dyn` (**R2F**) —
soit **15 animations femme**.

**Ateliers de reprise conservés dans git :**
`themeA/femme/_sources/A-02F/` (6 positions saines), `_sources/A-03F/` (9 positions),
`_sources/LOT1F/` (9 positions), `_sources/LOT2F/` (9 positions), `_sources/LOT3F/`
(8 positions du `circuit-gainage` + planche de travail + grille de contrôle).
Ces dossiers évitent de repayer des images déjà générées.

---

## 6. PROCHAINE ACTION — FINIR LE THÈME A

1. ✅ **FAIT** — la photo du personnage féminin est dans le dépôt
   (`animations/REF-personnage-feminin.jpg`).
2. ✅ **FAIT** — r**attrapage de la fille sur les lots 1 et 2** :
   `dead-bug`, `bird-dog`, `gainage-lateral`, `mountain-climbers`, `dead-bug-rotation`,
   `gainage-lateral-dyn` existent en HOMME **et** FEMME.
3. ✅ **FAIT le 2026-10-07 — LOT 3 FEMME `circuit-gainage` : 9 / 9 positions, livré.**
   Animation composite `themeA/femme/circuit-gainage-3poses.gif` (460×257, 16 frames) +
   planche 3 colonnes `themeA/femme/LOT3F-circuit-gainage-femme.gif` (1420×265).
   **Boucle retenue** : A→M→B sur chacune des 3 phases, puis retour arrière jusqu'au
   départ (évite un saut entre la fin du circuit et son début) — convention à confirmer
   par le user.
   `circuit-abdominaux` FEMME enchaîné dans le même tour (voir ci-dessous).
   Rappel du déroulé (3 phases chaînées) :
   - **phase 1 planche** : A installation à genoux → M jambes qui s'allongent → B planche
     complète sur avant-bras ;
   - **phase 2 gainage latéral** : A flanc gauche hanches basses → M bassin à mi-hauteur →
     B hanches hautes ;
   - **phase 3 bird dog** : A quatre pattes → M bras droit qui s'allonge → B extension
     complète (bras droit + jambe gauche opposés), **produite et livrée** au tour suivant.
   **Contrôle du 2026-10-07 (2ᵉ passe, à la demande du user)** — planche validée par le
   user (« valider, poursuis ») malgré les réserves listées en § 8 ; l'aperçu est **dans
   le dépôt** :
   `animations/themeA/femme/LOT3F-circuit-gainage-PLANCHE-TRAVAIL.png`
   (+ `GRILLE-CHECK-LOT3F-circuit-gainage.jpg`, `LOT3F-circuit-gainage-PLANCHE-FINALE.jpg`).
   Corrections identifiées et **à trancher par le user** avant de poursuivre :
   (a) P1-A : la main gauche est déjà posée au sol devant le genou, ce qui rend la
   séquence d'installation confuse pour un mouvement à quatre pattes ;
   (b) P1-B : les avant-bras sont bien à plat, mais les mains partent **loin devant les
   coudes** — le critère « coude pile sous l'épaule » n'est qu'approximatif ;
   (c) P2-M → P2-B : la montée du bassin est **discrète** (RMSE 0,035) ;
   (d) phase 2 : **artefact de dallage dans le ciel** (motif de blocs au-dessus de la mer).
4. 🟠 **LOT 3 FEMME `circuit-abdominaux` : 8 / 9 positions produites** (crunch → relevés de
   jambes → gainage), chaînées en 3 phases ; la **9ᵉ (planche haute tenue)** ouvre le
   prochain tour (drapeau rouge : 10 images IA du tour épuisées). Aperçu **dans le dépôt**
   (règle 15 — le user n'a pas le visualiseur) :
   `animations/themeA/femme/LOT3F-circuit-abdominaux-PLANCHE-TRAVAIL.png`.
   ⚠️ **Écart assumé** : la phase 3 est une **planche HAUTE (sur les mains)** et non sur
   avant-bras — le générateur a rendu deux fois un appui sur les mains ; c'est cohérent
   avec le départ à quatre pattes et distinct du `circuit-gainage`. **À trancher par le
   user** (si avant-bras exigés : 3 images à refaire).
5. 🟠 **CORRECTIONS AUTORISÉES (feu vert du 2026-10-07)** — voir § 7 :
   - ✅ squat FEMME position M (`277b87f`) et abduction hanche FEMME position B (`e67a36f`) ;
   - ⏳ **fire hydrant FEMME M et B** : à produire en **vue arrière trois-quarts** (base
     conforme `_sources/A-02F/fire-hydrant-elastique-A3.png`) — sur une vue de profil le
     générateur rend un donkey kick, 4 échecs constatés, la version HOMME a le même défaut ;
   - ⏳ **squat HOMME** (position finale pas assez basse) — à confirmer par le user.
6. 🔴 **À FAIRE ENSUITE — LOT 3 : les 2 circuits composites (HOMME).**
   - `circuit-gainage` : planche → gainage latéral → bird dog ;
   - `circuit-abdominaux` : crunch → relevés de jambes → gainage.
   Décision du user (§ 7.2) : les **trois mouvements déroulés à la suite** dans une seule
   animation (3 phases × 3 positions ≈ **9 images par circuit** → **1 circuit par tour**).
   À produire en **FEMME** (jamais fait) et à **refaire en HOMME** en version composite
   (aujourd'hui version simple à une seule position). **Montrer la planche avant de
   committer le remplacement des fichiers HOMME.**
7. **LOT A-04** : `abduction-assise-machine-ou-elastique`, `pallof-press-a-l-elastique`,
   `face-pull-a-l-elastique` — 3 exercices, 9 images (**jamais produits** : H puis F).
8. **LOT A-05** : `respiration-diaphragmatique`, `hip-thrust-unilateral-1-jambe` (2
   exercices = 6 images) — H puis F.
9. **Étapes chrono d'échauffement** (H + F = 6 animations) :
   - `warmup-route` = mise en route, marche ou vélo très facile, allure conversationnelle ;
   - `warmup-mobilite` = cercles d'épaules / mobilité hanches & chevilles — **à garder
     visuellement distinct de « mobilité des épaules » (A-01)** ;
   - `warmup-approche` = série d'approche légère, ~50 % de la charge de travail.
10. **Ensuite seulement : thème B — musculation**, en commençant par
   `developpe-incline-halteres` (**banc 30°, prise neutre** — tranché par le user),
   puis jambes/quadriceps.

### ⚠️ Toujours en souffrance (reporté depuis `acae07f`)

**Option A — réparation du POC** (3 animations à refaire, 9 images) :
- `poc/back-squat.gif` → départ cadré trop serré (torse seul) : refaire en pied, corps
  entier jusqu'aux semelles, barre complète dans le cadre ;
- `poc/hip-thrust-barre.gif` → artefacts, planche du banc coupée : refaire avec banc et
  barre entièrement visibles, épaules contre le banc, hanches basses ;
- `poc/souleve-de-terre-roumain.gif` → tête et pieds coupés + salissures : refaire debout,
  barre au contact des cuisses, corps entier dans le cadre ;
- puis chaîner M et B depuis chaque nouvelle position A.
À caser **après** la fin du thème A, sauf contre-ordre du user.

---

## 7. DÉCISIONS

1. ✅ **`developpe-incline-halteres` — TRANCHÉ PAR LE USER : banc incliné 30°, prise
   neutre** (paumes face à face). À produire en ouverture du thème B — pectoraux.
   À rendre visuellement distinct de `developpe-halteres-incline-30` (LOT 5) et de
   `developpe-halteres-incline-45-prise-neutre` (LOT 5).
2. ✅ **Circuits du LOT 3 — TRANCHÉ PAR LE USER : animation COMPOSITE en 3 phases.**
   Les trois mouvements déroulés à la suite dans une seule animation
   (≈ 9 images par circuit → 1 circuit par tour). À faire en fin de thème A.
3. ✅ **Lots par thème** (A échauffement → B musculation → C étirements → D cardio →
   E piscine). Les anciens fichiers dupliqués sont traités **à l'intérieur** du thème B.
4. ✅ **Terminer le thème A avant d'attaquer le thème B** (consigne du user).
5. ✅ **LOT A-01 validé par le user.** ✅ **Lots 1 et 2 FEMME validés par le user**
   (« ok pour le lot 2 », 2026-10-07).
6. ✅ **Personnage femme confirmé conforme** au style validé : même code visuel que
   l'homme (corps argenté mat, visage noir sans traits, casquette, tresse, tenue noire,
   baskets blanches, terrasse bord de mer, tapis noir, muscles dorés).
7. ✅ **FEU VERT DONNÉ LE 2026-10-07** : « tu as feu vert pour faire des corrections sur
   les gifs précédents ». Règle 2 assouplie — les corrections de GIF livrés sont autorisées
   (elles restent tracées dans `SUIVI.md`, section « CORRECTIONS AUTORISÉES »).
   Traité dans ce cadre :
   - ✅ **squat FEMME position M** (`femme/squat-poids-du-corps-3poses.gif`) — corrigée,
     RMSE A→M 0,288, réassemblée et poussée ;
   - ✅ **abduction hanche FEMME position B** (`femme/abduction-hanche-elastique-3poses.gif`)
     — corrigée, RMSE M→B 0,255, réassemblée et poussée ;
   - ⏳ **fire hydrant FEMME M/B** — diagnostic : sur une vue de profil, le générateur rend
     l'abduction latérale en **donkey kick** ; la version HOMME a le même défaut. Nouvelle
     base tournée en **vue ARRIÈRE TROIS-QUARTS** (`_sources/A-02F/fire-hydrant-elastique-A3.png`,
     conforme) ; M et B restent à produire (drapeau rouge du tour).
   - ⏳ **squat HOMME** (position finale pas assez basse) : **à confirmer explicitement** —
     le feu vert du user vise les GIF « précédents » ; je le traite comme autorisé et je le
     corrige au prochain tour, sauf contre-ordre.
   - ⏳ **POC (3 animations)** : hors « GIF précédents » du thème A — je demande
     confirmation avant d'y toucher.
8. ⏳ **Aucune autre décision en attente.**

---

## 8. RÉSERVES CONNUES (honnêtes)

- **Fire hydrant FEMME (A-02F, M et B)** : la vue de **profil** ne permet pas de montrer
  une abduction de hanche — le générateur rend systématiquement une extension arrière
  (donkey kick), et la version HOMME livrée a le même défaut. Correction en cours par un
  **changement de prise de vue (arrière trois-quarts)** ; la nouvelle position A est
  conforme, M et B restent à produire. **Cela crée une rupture de cadrage assumée** avec
  les deux autres exercices du lot (profil/face) — à valider par le user.

- **LOT 3 FEMME `circuit-abdominaux` (8/9)** : la **casquette dépasse légèrement du tapis
  noir** sur la position A (crunch, corps au sol) ; la phase 3 est une **planche haute sur
  les mains** (écart assumé, voir § 6) ; la transition de la position M de la phase 3 est
  un peu molle (genou opposé peu lisible).
- **LOT 3 FEMME `circuit-gainage` (9/9, LIVRÉ — planche validée par le user)** :
  (a) **P1-A** — la main gauche est déjà posée au sol devant le genou : l'installation à
  genoux se lit mal pour un mouvement à quatre pattes ;
  (b) **P1-B** — les deux avant-bras sont bien posés à plat (planche sur avant-bras
  confirmée au zoom) mais les **mains sont loin devant les coudes** : le critère
  « coude pile sous l'épaule » n'est qu'approximatif ;
  (c) **P2-M → P2-B** — la montée du bassin est **discrète** (RMSE 0,035, tout juste
  au-dessus du seuil 0,030) ;
  (d) **phase 2** — **artefact de dallage dans le ciel** (motif de blocs au-dessus de la
  mer), comme les bavures déjà connues des lots 1 et 3.
  Aperçu dans le dépôt : `animations/themeA/femme/_sources/LOT3F/` (`PLANCHE-TRAVAIL-…png`,
  `GRILLE-CHECK-…jpg`).

- **POC** : cadrages coupés et artefacts sur 3 animations (voir § 6).
- **Circuits LOT 3 (HOMME)** : une seule position animée sur trois alors que le user veut
  une animation composite en 3 phases. À refaire.
- **Artefacts résiduels** dans les lots 1 et 3 (bavures au-dessus des tapis).
- **Cadrages hétérogènes** : la largeur des images varie d'un lot à l'autre.
- **LOT 4** : mouvements sur banc, donc pas de tapis noir au sol ; léger écart de cadrage
  entre les trois mouvements.
- **LOT A-02 FEMME** : 2 animations livrées **non conformes** — fire hydrant M/B (le
  mouvement part en extension arrière au lieu d'une abduction latérale) et squat M
  (mi-descente trop proche du départ). Détail et sources dans `animations/SUIVI.md`.
- **LOT A-03 FEMME** : 1 animation sous réserve — `abduction-hanche-elastique-3poses.gif`
  position finale trop proche de la mi-course (RMSE 0,029 : le mouvement ne se lit pas).
- **Squat HOMME (LOT A-02)** : position finale pas assez basse — défaut constaté par
  contrôle visuel, **non corrigé** faute d'accord (règle 2).
- **LOT R1 FEMME** : la position A du gainage latéral est une « hanches basses /
  installation » plutôt qu'un corps parfaitement allongé — **même convention que la
  version HOMME validée**. Réserve assumée.
- **Stabilité de cadrage** : le générateur change parfois légèrement l'angle, l'échelle,
  et rend parfois du **portrait** au lieu du paysage (2 cas traités au LOT R2 : image
  rejouée). Toujours contrôler le format des positions avant d'assembler.
- **Brillance du corps** : le générateur rend parfois un argenté **brillant** (proche du
  chromé) au lieu du **mat** imposé par le code visuel.
- **Reset du sandbox** : à chaque tour, plus un incident le 2026-10-07 (tour interrompu
  puis reset → images non commitées perdues et repayées).
  **Conséquences :** (a) ne jamais laisser un livrable ou une référence hors de git ;
  (b) committer dès qu'un exercice est complet ; (c) `curl` n'a pas d'accès HTTP sortant,
  seule la voie GitHub permet de recevoir un fichier.
- Pour afficher un GIF multi-positions à l'écran, toujours passer par
  `convert x.gif -coalesce`.

---

## 9. DOCUMENTS ET LIENS

Documents livrés (dépôt public, branche de session
`arena/6a360b28-jarvis-fitness-yanis-emilie-ap`)

- **`yanis-fitness-evolution/animations/PLAN-THEMES.md`** — plan de production thématique
  (5 thèmes, 108 lots de 3).
- **`yanis-fitness-evolution/scripts/build-gif-lot.sh`** — assemblage GIF + planche.
- `yanis-fitness-evolution/animations/SUIVI.md` — suivi, compteurs, réserves.
- `yanis-fitness-evolution/animations/INVENTAIRE.md` — inventaire lisible.
- `yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf` — bilan 14 pages.
- `yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf` — LOT 4 + LOT 5 + corrections.
- Scripts PDF : `scripts/build-nouveaux-gifs-pdf.py`, `scripts/build-bilan-pdf.py`
  (dépendance : `reportlab`).

Onglet du dépôt avec tous les GIF :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/tree/arena/6a360b28-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations
```

---

## 10. PHRASE DE REPRISE POUR LE NOUVEAU CHAT

> Reprends le chantier « reconstruction des animations » de JARVIS Fitness.
>
> **Dépôt** `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public). **Branche de session** :
> `arena/93096144-jarvis-fitness-yanis-emilie-ap` — elle contient tout l'historique du
> chantier. Si le prompt système annonce une autre branche `arena/<id>-…`, écris sur celle
> annoncée par le système.
> **Dernier commit de contenu : `9ed4d87`** (`5e5a2e3` circuit-abdos F 9/9, `e5b670a` fire
> hydrant F 3/4, `9ed4d87` squat H).
>
> **OUVERTURE OBLIGATOIRE :**
>
> ```bash
> git fetch origin
> # ⚠️ un simple `git fetch origin` ne rapporte PAS toujours les branches arena :
> git fetch origin 'refs/heads/arena/*:refs/remotes/origin/arena/*'
> # puis, si HEAD est retombé sur ddd1fb9 :
> git reset --hard origin/arena/93096144-jarvis-fitness-yanis-emilie-ap
> ```
>
> Lis `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
> `yanis-fitness-evolution/animations/PLAN-THEMES.md`.
>
> **ÉTAT — 45 / 614 animations livrées.** Thème A : **17/25 en homme, 17/25 en femme**
> (rattrapage femme 100 % terminé ✅).
> `circuit-gainage` FEMME (`f07c04d`) et `circuit-abdominaux` FEMME (`5e5a2e3`) **livrés**
> (composites 3 phases, 9/9).
> Corrections autorisées (feu vert) toutes livrées : squat FEMME M ✅ (`277b87f`), abduction
> FEMME B ✅ (`e67a36f`), fire hydrant FEMME A/M/B en arrière 3/4 ✅ (`e5b670a`), squat HOMME
> A/M/B en 3/4 sur tapis noir ✅ (`9ed4d87`).
>
> **À FAIRE, dans l'ordre :**
> 1. **Terminer le LOT A-04 HOMME** (`abduction-assise-machine-ou-elastique` : base A prête dans
>    `themeA/_sources/A-04/abduction-assise-machine-ou-elastique-A.png`, chaîner M et B avec
>    pieds fixes largeur de hanches et ouverture des genoux fléchis à 90° ; puis
>    `pallof-press-a-l-elastique` A/M/B et `face-pull-a-l-elastique` A/M/B) → planche
>    `themeA/LOT-A04-echauffement.gif` ;
> 2. **LOT A-04 FEMME** (les 3 mêmes exercices en FEMME) ;
> 3. **LOT A-05** (`respiration-diaphragmatique`, `hip-thrust-unilateral-1-jambe`), puis les
>    3 étapes chrono `warmup-route`, `warmup-mobilite`, `warmup-approche` — **en HOMME puis
>    en FEMME** ;
> 4. **Circuits LOT 3 HOMME en version composite** (remplacement après validation user) et
>    éventuellement **fire hydrant HOMME en vue arrière trois-quarts** ;
> 5. **POC** (3 animations) — accord user requis, hors du feu vert ;
> 6. ensuite seulement : **thème B — musculation**.
>
> **Les 15 règles** (§ 1 de cette passation) : 1 exercice = 1 animation spécifique · ne pas
> remplacer une animation livrée sans accord (feu vert corrections du 2026-10-07) · ne pas
> toucher `release/` ni `public/media` · honnêteté totale, jamais de faux 100 % · **10 images
> IA par tour** (drapeau rouge technique, compter les rejeux) · technique vérifiée en ligne
> et **source citée dans le commit** · l'œil du user tranche · commit/push autorisés ·
> lots par thème (A→B→C→D→E) · finir un thème avant le suivant · **périmètre HOMME + FEMME =
> 614 animations** (`themeA/` = homme, `themeA/femme/` = femme) · le sandbox se réinitialise
> à chaque tour (**seul git survit**) · **committer dès qu'un exercice est complet** ·
> **doute sur la configuration d'un mouvement → vérifier en ligne AVANT de générer
> (YouTube, sites de fitness, GB Performance)** · **le user n'a ni le visualiseur ni les
> pièces jointes : tout aperçu est déposé DANS LE DÉPÔT et signalé par un lien GitHub.**
>
> **Style** : mannequin très musclé, corps blanc argenté **MAT**, visage noir **sans traits**,
> casquette blanche, short noir, baskets blanches, muscles travaillés **dorés jaune-orangé** ;
> terrasse bord de mer (piscine en exception pour l'aqua) ; **tapis noir** au sol ;
> interdits : salle, parquet, mur intérieur, miroir.
>
> **Méthode** : positions chaînées **A → M → B** (chaque image générée depuis la précédente) ;
> composite = 3 phases × 3 positions ; assemblage `scripts/build-gif-lot.sh` (460×257,
> `-delay 130/110`, `-colors 96`), **jamais `-layers optimize` sur la planche** ;
> **contrôle qualité obligatoire** : visuel, `compare -metric RMSE` (seuil **0,030**), format
> **paysage**, anti-doublon `md5sum` ; puis commit + push + mise à jour de `SUIVI.md` et
> `PLAN-THEMES.md`.
