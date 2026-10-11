# AUDIT COMPLET — GIFs JARVIS FITNESS
**Date : 11 octobre 2026**
**Branche de session (imposée, non changée) :** `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`
**Périmètre :** lecture seule sur les branches de référence + contrôle visuel image par image.
**Aucun GIF créé, modifié ou intégré pendant cet audit.** Rien n'a été touché dans `public/media/`, `src/` ni `release/`.

---

## 0. RÈGLE NON NÉGOCIABLE (à recopier dans chaque passation)

> 1. **Mon athlète.** Tous les GIF doivent lui ressembler : mannequin anatomique 3D très musclé, corps blanc/argent **mat**, visage noir mat sans traits, casquette blanche, short noir, baskets blanches, muscles travaillés **jaune-orangé doré**. La référence prioritaire reste MA photo / MA capture.
> 2. **Le décor.** Mer visible + végétation (palmiers/plantes), terrasse claire au bord de mer avec muret bas. Il doit ressembler aux **1ers GIF validés**. Décor figé : aucune modification, remplacement ni réinterprétation.
> 3. **Une image par exercice.** Une image fixe de validation doit m'être proposée **pour chaque exercice**, pour que je vérifie que **tous mes critères** sont pris en compte — **avant** tout GIF, et j'attends mon accord explicite.
> 4. **En cas de doute** sur la composition d'un GIF, se référer à **tous les sites de fitness existants** qui proposent photos et GIFs, pour s'y conformer.
> 5. **Chaque GIF réalisé doit m'être présenté.**
> 6. **« Y » = relance du chat** (le chat bloque) — ce n'est pas une validation.

---

## 1. GARDE-FOUS RESPECTÉS PENDANT CET AUDIT

- Aucune génération d'image, aucun GIF produit.
- Aucune écriture dans `public/media/`, `release/`, `src/`.
- Aucun fichier GIF supprimé, renommé ou modifié.
- Branche de session conservée ; les branches `83fa8373`, `6d7633a6` et les branches septembre sont consultées **en lecture seule**.
- Le dossier livré `animations/_audit/2026-10-11/` est un **dossier d'audit neuf**, il ne remplace aucun livrable.

---

## 2. LE PERSONNAGE ET LE DÉCOR DE RÉFÉRENCE SONT BIEN IDENTIFIÉS

Le style verrouillé est confirmé **visuellement** (voir `planches/00-reference-personnage-acceptee.jpg`) :

| Critère | Constat |
|---|---|
| Silhouette | mannequin anatomique 3D très musclé, muscles striés apparents |
| Teint | corps blanc / argent **mat** |
| Visage | noir mat, **sans aucun trait** |
| Casquette | blanche |
| Short | noir |
| Chaussures | blanches |
| Muscles travaillés | surlignés **jaune-orangé doré** |
| Décor | terrasse claire, **mer visible**, palmiers et plantes, **muret bas** blanc |

**Point important :** la capture `Screenshot_20261011_085401_Google.jpg` annoncée dans la passation **est absente de ce chat** (vérifié : aucun dossier `/home/user/uploads`). Le fichier de référence que vous citez n'a donc pas pu être ouvert. **Merci de le joindre à nouveau** si vous voulez que je le confronte directement. Je n'ai rien inventé ni généré en remplacement : la référence a été reconstruite **à partir des images déjà acceptées par vous**, qui portent exactement ce style.

---

## 3. RECOMPTE VÉRIFIÉ — CHIFFRES EXACTS

### 3.1 Branche `origin/arena/6d7633a6` (état du 9 octobre, la plus fournie sur les animations)

| Catégorie | Nombre |
|---|---|
| GIF dans `animations/` | **103** |
| — GIF **individuels** (1 exercice = 1 fichier) | **77** (dont **45 HOMME** et **32 FEMME**) |
| — **planches / montages** (plusieurs exercices dans une image) | **26** (14 HOMME + 12 FEMME) |
| GIF dans `public/media/` (corpus historique de l'app) | 325 |
| GIF dans `release/media/` | 94 |

La passation annonçait « 103 fichiers, soit 77 individuels et 26 planches » : **c'est confirmé, exact.**

### 3.2 Branche `origin/arena/83fa8373` (état du 10 octobre, la plus récente sur le lot B-04)

| Catégorie | Nombre |
|---|---|
| GIF dans `animations/themeB/_sources/B-04/` | **10** |
| — dont **variantes/aperçus de fentes bulgares** | 6 |
| — dont **aperçus de front squat** | 2 |
| — dont **leg extension** | 2 |
| GIF ajouté dans `public/media/` (front squat intégré) | **1** (`6008e0f8a2557d40.gif`) |
| GIF dans `public/media/` | 95 (94 de la session + le front squat) |

La passation annonçait « 10 GIF bruts : 6 variantes fentes bulgares, 2 aperçus front squat, 2 leg extension » : **c'est confirmé, exact — ce ne sont pas 10 exercices validés.**

### 3.3 Réconciliation de 74 / 76 / 77 — LA QUESTION EST TRANCHÉE

J'ai rejoué le compteur commit par commit sur `6d7633a6` :

| Étape | Commit | Individuels | HOMME | FEMME |
|---|---|---|---|---|
| squat cycliste HOMME livré | `069dd4f` | **74** | 43 | 31 |
| squat cycliste FEMME livré | `d83b70c` | **75** | 43 | 32 |
| leg press HOMME livré | `fa9d52a` | **76** | 44 | 32 |
| leg extension HOMME livré | `945908f` | **77** | 45 | 32 |

**Conclusion : il n'y a aucune contradiction.** 74 et 76 sont simplement des **instantanés plus anciens** du même compteur ; 77 est l'état réel le plus récent.
**Ce qui est compté :** uniquement les GIF **individuels** (1 exercice = 1 fichier). Ni les planches, ni les aperçus, ni les variantes, ni les rejets.

### 3.4 Le périmètre a changé — et le compte de 614 ne s'applique plus tel quel

| Étape | Date | Commit | Contenu |
|---|---|---|---|
| Périmètre H+F | 7 oct. | `c05a672` | « 614 animations (209×2 + 100 chrono + 29×2 + 19×2) » |
| Bascule HOMME seul | 8-9 oct. | `00f4e00` / `5283475` | « GIFs **HOMME uniquement**, communs à Yanis et Émilie ; FEMME reportées, livraisons FEMME conservées » |
| Nouveau plan thématique | 9 oct. | `a777244` | **307 entrées, 614 animations**, dont **307 HOMME communes** |

Donc : **le 77/614 est un compteur mixte hérité**. Le dénominateur actif est **307** (entrées HOMME).
**Couverture réelle HOMME : 37 exercices de l'inventaire sur 307 entrées = 12,1 %.**
Décompte exact : 45 fichiers GIF individuels dans les dossiers HOMME, moins 1 (c'est en fait un GIF FEMME, `poc/nage-douce-femme.gif`), moins 4 POC (dont `back-squat`, conservé **avec réserves**), moins 3 `warmup-*` qui sont des **étapes de chronomètre** et non des exercices de l'inventaire → **37 exercices**.

### 3.5 Corpus historiques — à ne pas confondre avec le chantier

| Corpus | Où | Volume | Nature |
|---|---|---|---|
| `public/media` (complet) | branche `6d7633a6` | **325 GIF** | médias historiques de l'app |
| `public/media` (ce que voit cette session) | checkout session | **94 GIF** | sous-ensemble, identique à celui de `release/media` |
| Corpus « refonte-photo » | anciennes branches `01a0d***` (septembre) | **266 GIF HOMME + 124 FEMME + 511 planches** | essais sur la **vraie photo**, **salle de sport**, vert lime |

**Ce corpus de septembre est un autre style, pas le vôtre aujourd'hui** (voir `planches/06-corpus-septembre-refonte-photo.jpg`) : athlète photoréaliste, salle de sport, muscles vert lime, pas de mer. Il a manifestement été **abandonné** au profit du mannequin blanc / terrasse bord de mer. **Aucune image n'est reproduite ici** pour ne pas prêter à confusion : je le signale comme périmètre historique.

**Le corpus de l'app (`public/media`)** est d'un style encore différent, celui d'origine : dessins au trait (noir & blanc), photos de salle, quelques images anatomiques rouges (voir `planches/07-corpus-app-public-media.jpg`). **Ce n'est pas le style verrouillé.** Les 188 GIF « suivis » du checkout sont ce corpus historique — **pas 188 nouvelles animations reconstruites.**

---

## 4. CONTRÔLE VISUEL DES 43 GIF HOMME DU CHANTIER — RÉSULTAT

Méthode : chaque GIF a été extrait, désassemblé en **toutes** ses images, et contrôlé sur les 6 critères (silhouette musclée / teint mat argenté / visage noir sans traits / casquette blanche + short noir + baskets blanches / muscles jaune-orangé doré / **décor mer + végétation sur terrasse**). Bandes de contrôle : `planches/10-…` à `14-…`.

### 4.1 CONFORMES — 38 GIF sur 43

| Zone | Fichiers | Verdict |
|---|---|---|
`lot1/` | bird-dog, dead-bug, gainage-lateral | conforme
`lot2/` | dead-bug-rotation, gainage-lateral-dyn, mountain-climbers | conforme
`lot3/` | circuit-abdos, circuit-gainage | conforme (réserves déjà documentées : versions composites)
`lot4/` | developpe-halteres-decline-neutre, -plat, -plat-neutre | conforme
`lot5/` | developpe-halteres-incline-30, -45, -45-prise-neutre | conforme
`themeA/` | abduction-assise, abduction-hanche, clamshell, face-pull, fentes-arriere-pdc, fire-hydrant, gainage-planche, hip-thrust-unilateral, mobilite-des-epaules, pallof-press, pompes, pont-fessier-activation, respiration-diaphragmatique, squat-poids-du-corps, warmup-approche, warmup-mobilite, warmup-route | conforme
`themeB/` | back-squat-charge-moderee, bulgarian-split-squat-halteres, leg-press, presse-a-cuisses-pieds-hauts | conforme
`poc/` | developpe-couche-barre, hip-thrust-barre | conforme
**Total** | | **38**

**Réserve de conception à trancher (pas un défaut de rendu) :** trois GIF intègrent un élément qui n'est pas une machine libre sur la terrasse — machine d'abduction sur socle (`abduction-assise`), cage à poulie à montants verticaux (`pallof-press`, `face-pull`). Le personnage et le décor restent conformes. **Dites-moi si ces trois sont acceptables tels quels ou à reprendre** — je ne les modifie pas sans votre autorisation.

### 4.2 ÉCARTS TECHNIQUES VÉRIFIÉS — 5 GIF sur 43

| # | Fichier | Constat vérifié (mesures) | Gravité |
|---|---|---|---|
| **1** | `themeB/bulgarian-split-squat-3poses.gif` | **GIF cassé** : 4 images annoncées ; image 0 = athlete correct, **images 1 et 2 = un fond vide nuageux sans athlète** (moyenne 90 % blanc), **image 3 = 1×1 pixel vide**. Aucune animation d'exercice. | **Critique** |
| **2** | `themeB/leg-extension-3poses.gif` | **GIF livré à 4 images** au lieu de 5 (pas de retour à la pose A), **et** rendu encombré : machine massive, athlète partiellement masqué, texture bruitée. Une version plus propre existe (`leg-extension-app.gif`, 5 images) **non intégrée**. | **Élevé** |
| **3** | `themeB/goblet-squat-3poses.gif` | Sur l'image 3 (pose basse), **le bas du mannequin est écrasé / déformé** — artéfacts visibles. Fichier **régénéré et réintégré** le 5 oct. (`1e759eb`), il reste que la pose basse est la plus fragile du lot. | **Moyen** |
| **4** | `themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` | **Cadrage incohérent entre les images** : le banc et l'échelle du plan varient de l'une à l'autre (l'athlète ne monte pas au même endroit). `squat-cycliste` a le même défaut léger de saut d'échelle. | **Moyen** |
| **5** | `poc/back-squat.gif` | Réserve déjà connue : **portrait 480×860** (les autres sont en paysage), **disques coupés**, 3ᵉ pose debout. Séquence A→M→B→M câblée en 50/50 (pas 130/110/130/110). | **Moyen** |

### 4.3 POINTS STRUCTURELS RELEVÉS (pas des écarts visuels)

- **Format disparate :** la production récente sort en **460×257** (4 images) ou **440×440 / 440×246** (5 images) ; le corpus `public/media` est en 300×300, 440×240, 480×262… Aucun format commun. À trancher pour l'affichage dans l'app.
- **Trois fiches FEMME non livrées sur quatre en `themeB/femme`** sont en fait des **planches** conservées (12 au total) — elles ne comptent pas comme exercices.
- **Le motif d'intégration diffère selon la branche :** certaines branches pilotent les GIF par `GIF_OVERRIDES` (`src/data/gif-overrides.js`, 224 entrées), la branche 83fa par `src/data/legacy.json`. À unifier avant toute nouvelle intégration.

---

## 5. ÉTAT DU LOT B-04 (le lot en cours au moment de la passation)

| Exercice | État vérifié | Fichier | Validation |
|---|---|---|---|
| **Front squat** | **SUITE COMPLÈTE, VALIDÉE et INTÉGRÉE** (A conservée, **M4** retenue, B validée) | `public/media/6008e0f8a2557d40.gif` — 440×246, **5 images**, A→M4→B→M4→A | ✅ votre validation explicite du 10 oct. (`SUIVI.md`) |
| **Fentes bulgares haltères pied avant surélevé** | **TERMINÉ en profil, banc fixe** ; 5 images A→M→B5→M→A, 440×246 ; banc identique sur les 3 poses ; flexion du genou avant bien visible (~90° en B5) ; personnage et mer conformes | `_sources/B-04/fentes-bulgares-profil-banc-app.gif` | **Non intégré** — en attente de votre décision |
| **Leg extension** | 3 poses candidates retenues (A3/M5/B4) physiquement musclées, machine Titan trois-quarts. **Le GIF livré dans `animations/themeB/` est l'ancien (4 images, non conforme)** ; la version format app en 5 images existe à côté | `_sources/B-04/leg-extension-app.gif` (440×440, 5 images) | **Non intégré, non validé** |
| **Tractions** | **BLOQUÉ** — 2 poses A rejetées (vous étiez debout sur le tapis, pas suspendu à la barre) | `tractions-A.png`, `tractions-A-profil.png` | ❌ à reprendre |
| **Développé couché prise serrée** | **INTROUVABLE** : `developpe-couche-prise-serree-A-validation-v5.png` et le dossier `animations/themeB/_sources/B-04/` **n'existent sur aucune des 36 branches distantes**. Il n'existe qu'un **alias de candidat** issu du corpus de septembre, dans un autre style. Aucun fichier « v5 » dans « A v4 rejetée » n'est retrouvable. | — | ⚠️ **à reconfirmer avec vous** |

Vérification du style des trois séries B-04 : `planches/01-…`, `20-…`, `21-…`, `22-…`, `23-…`.

---

## 6. CE QUI RESTE — NOMBRES VÉRIFIÉS

| Question | Réponse vérifiée |
|---|---|
Exercices du périmètre HOMME | **307**
GIF HOMME livrés couvrant un exercice de l'inventaire | **37**
Couverture HOMME réelle | **37 / 307 = 12,1 %**
Restant à produire | **270** (307 − 37)
Fichiers GIF individuels dans les dossiers HOMME | 45 = 37 inventaire + 4 POC (dont 1 avec réserves) + 3 étapes de chrono + 1 GIF FEMME mal rangé
Compteur mixte historique (ne pas utiliser comme objectif) | 77 / 614 (dont 45 H + 32 F)
GIF dans `animations/` au total | 103 = **77 individuels** + **26 planches**
GIF « suivis » du checkout de session (corpus historique app) | **188** = 94 (public) + 94 (release), tous dans le style d'origine
Corpus septembre abandonné | 266 GIF HOMME + 124 FEMME + 511 planches

**Ce qui reste, concrètement, dans le lot en cours :** `tractions` (bloqué), `developpe-couche-prise-serree` (à reconfirmer), `fentes-bulgares-halteres-pied-avant-sureleve` (terminé, en attente d'intégration), `leg-extension` (terminé en version app, en attente d'intégration) ; puis B-05 (`step-up-haut`, `back-squat-barre-haute`, `hack-squat`) et B-06 (`back-squat-inertie-pause-complete`, `fentes-barre`).

---

## 7. CE QUE JE VOUS DEMANDE (aucune production sans votre réponse)

1. **Le fichier de référence** `Screenshot_20261011_085401_Google.jpg` : pouvez-vous le joindre au chat ? Sans lui, je m'appuie sur les images déjà validées par vous.
2. **Les 5 écarts** de la section 4.2 : m'autorisez-vous à les **corriger** ? (je ne touche rien avant votre accord)
3. **Les 3 GIF à machine intégrée** (abduction assise, pallof press, face pull) : acceptables ou à reprendre ?
4. **Les validations en attente** : fentes bulgares (terminé) et leg extension (version app) — à valider et intégrer, ou à revoir ?
5. **Le développé couché prise serrée** : le fichier « A-validation-v5 » n'existe nulle part dans le dépôt. Confirmez-vous qu'il faut **repartir de zéro** sur cet exercice ?
6. **Une image de validation par exercice** : règle rappelée en tête de ce rapport. Dites-moi simplement « on reprend » et je commence par **une seule image fixe** pour le prochain exercice, puis j'attends votre accord explicite.

---

## 8. CONTENU DU DOSSIER D'AUDIT

```
animations/_audit/2026-10-11/
  RAPPORT-AUDIT-2026-10-11.md   ← ce rapport
  PASSATION-EN-COURS.md         ← passation + règle non négociable
  gif/themelot/    (14 GIF individuels, lots 1 à 5)
  gif/themeA/      (17 GIF individuels, échauffement)
  gif/themeB/      ( 9 GIF individuels, musculation)
  gif/poc/         ( 5 GIF individuels, POC + nage douce FEMME)
  gif/B-04/        (les 3 GIF du lot B-04 + les 2 écarts à voir)
  gif/planches-animees/ (8 planches GIF, plusieurs exercices par image)
  planches/        (référence, contrôles, écarts, corpus historiques)
```

**Total reproduit : 45 GIF individuels du chantier + 8 planches animées + les 3 GIF du lot B-04 + les 2 GIF en écart.**
Rien n'a été supprimé, renommé ou modifié dans le dépôt.

### Comment regarder

- Les **GIF** s'ouvrent directement et s'animent (`gif/themeA/`, `gif/themeB/`, `gif/B-04/`).
- Les **planches de contrôle** `planches/10-…` à `14-…` montrent, pour chaque GIF, **toutes ses images côte à côte** : c'est là que les écarts se voient le plus vite.
- Les écarts sont isolés et nommés : `planches/02-…` (bulgarian cassé), `03-…` (leg extension 4 images), `04-…` (step-up cadrage), `05-…` (goblet squat + doublons).
