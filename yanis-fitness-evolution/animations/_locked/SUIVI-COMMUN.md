# 🧭 BASE COMMUNE — SUIVI PARTAGÉ DES GIFs
**Mis à jour le 11 octobre 2026 — décision décor E1 verrouillée.**
`animations/_locked/` = la base commune. Tout agent lit ce dossier **avant** de produire.

---

## 1. DÉCISION VERROUILLÉE : **CIBLE E1 (décor dense)**

**L'utilisateur a choisi E1** le 11 octobre 2026 → le décor de référence est **celui de son fichier**
`reference/00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg`, **identique à celui des 1ers GIF validés**
(POC 5 oct. + lots 1-5).

> **Mer bleue bien visible · végétation dense (palmiers, plantes en pot) · lumière chaude.**
> **NON conforme :** tout décor « pâle » (saturation < 22) où la mer est à peine perceptible.

**Ne plus reposer la question.** C'est E1 jusqu'à nouvel ordre explicite.

---

## 2. CHIFFRES À JOUR

| | Nombre |
|---|---|
| **Périmètre actif (exercices HOMME)** | **307** |
| **Livrés** | **39** → 12,7 % |
| **Restants à produire** | **268** |
| **À CORRIGER (cible E1)** | **21** |
| Intégrés dans l'app aujourd'hui | **1** (front squat) |

**Compteur historique mixte (ne plus utiliser) :** 77 / 614.
**Fichiers dans `animations/` :** 103 = 77 individuels + 26 planches.

---

## 3. LA QUEUE DE CORRECTION — 21 GIF

### ✅ 18 GIF CONFORMES à E1 — ne pas y toucher

`lot1/` dead-bug · bird-dog · gainage-lateral — `lot2/` dead-bug-rotation · gainage-lateral-dyn · mountain-climbers — `lot3/` circuit-abdos · circuit-gainage — `lot4/` plat · plat-neutre · decline-neutre — `lot5/` incline-30 · incline-45 · incline-45-prise-neutre — `themeA/` mobilite-des-epaules · respiration-diaphragmatique · hip-thrust-unilateral · fentes-arriere-pdc

### 🟠 21 GIF À RÉALIGNER SUR E1 — décor pâle à corriger

**A. Les 4 CASSÉS / DÉFORMÉS — priorité absolue** (défaut d'animation **en plus** du décor)

| GIF | Défaut | Action |
|---|---|---|
| `themeB/bulgarian-split-squat-3poses.gif` | **CASSÉ** : images 2-3 vides, image 4 = 1×1 px | **régénérer entièrement** |
| `themeB/goblet-squat-3poses.gif` | pose basse **écrasée / déformée** | régénérer la pose B puis chaîner |
| `themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` | **le banc change de place et d'échelle** | régénérer en fixant le banc |
| `themeB/squat-cycliste-squat-complet-3poses.gif` | **l'échelle saute** entre les images | régénérer en fixant le cadrage |

⚠️ `bulgarian-split-squat` et `fentes-bulgares-halteres-pied-avant-sureleve` sont **deux entrées DISTINCTES**
de l'inventaire → **interdiction de réutiliser le même GIF** (règle « 1 exercice = 1 animation »).

**B. 1 réparation SANS GÉNÉRATION**

| GIF | Défaut | Action |
|---|---|---|
| `themeB/leg-extension-3poses.gif` | **4 images** au lieu de 5 (pas de retour à A) | remplacer par `leg-extension-app.gif` (440×440, 5 images, A→M→B→M→A) — **déjà disponible**, puis réaligner le décor |

**C. 16 GIF — décor pâle seulement** (animation correcte)

`themeB/` presse-a-cuisses-pieds-hauts · back-squat-charge-moderee · bulgarian-split-squat-halteres · leg-press
`themeA/` abduction-assise · pallof-press · squat-poids-du-corps · face-pull · clamshell · fire-hydrant · abduction-hanche · pompes · gainage-planche · pont-fessier-activation
`B-04/` **front squat** (intégré dans l'app) · **fentes bulgares** (terminé, non intégré)

→ **méthode : garder le personnage et la pose, ne régénérer QUE le fond sur le décor E1.**

### Données brutes

`QUEUE-CORRECTION.tsv` — mesure de saturation des 50 GIF, classés. Rejouable :
```bash
convert IMG -resize 400x -colorspace HSL -channel G -separate +channel -format "%[fx:mean*100]" info:
```

---

## 4. CE QUI PEUT PARTIR DANS L'APP

| GIF | Exercice | État |
|---|---|---|
| `01-FRONT-SQUAT-verrouille-…gif` | Front squat | ✅ **déjà intégré** (décor pâle → à réaligner si E1 s'applique à l'app) |
| `02-FENTES-BULGARES-verrouille.gif` | Fentes bulgares haltères pied avant surélevé | 🟢 terminé, **attend le feu vert** |
| `03-LEG-EXTENSION-verrouille.gif` | Leg extension | 🟢 terminé, **attend le feu vert** |

**Ces 2 feux verts font passer l'app de 1 à 3 exercices animés — zéro génération.**

⚙️ **POC (hors 307, tous conformes à E1) :** back-squat (portrait 480×860, disques coupés — réserves),
developpe-couche-barre, hip-thrust-barre, souleve-de-terre-roumain, nage-douce-femme (FEMME).
→ **à trancher : garder, refaire ou abandonner ?**

---

## 5. PROTOCOLE POUR TOUT AGENT QUI REPREND

1. **Lire** `REFERENCE-VERROUILLEE.md` (le verrou) **puis** ce fichier. La cible est **E1**.
2. **Ne rien régénérer** de conforme. Le personnage n'a **jamais** besoin d'être refait.
3. **Partir de la dernière pose validée** comme image d'entrée — **jamais de zéro**.
4. **Vérifier soi-même** avant de montrer : personnage (blanc/argent mat, visage noir sans traits, casquette,
   short noir, baskets blanches, muscles jaune-orangé doré) **et** décor **E1** (mer bleue visible + végétation dense).
5. **Une seule image fixe par exercice** → présenter → **attendre l'accord explicite**.
6. **Chaque GIF terminé est présenté immédiatement.** Pas de lot de 10.
7. **Rien dans `public/media/`, `src/`, `release/` sans autorisation explicite.**
8. Plafond : **10 appels image par tour**. C'est lui qui fixe le rythme.

## 6. COMMENT COMPTER (pour ne plus se tromper)

- **1 exercice = 1 GIF individuel.** Jamais les planches, variantes ou aperçus.
- Un GIF **cassé** n'est **pas** compté comme livré.
- Les `warmup-*` = **étapes de chronomètre**, hors des 307.
- Les **POC** = hors inventaire, comptés à part.
- Toujours vérifier les défauts **sur les images extraites une par une**, jamais sur la vignette.

---

*Verrou : `REFERENCE-VERROUILLEE.md` · Audit : `../_audit/2026-10-11/RAPPORT-AUDIT-2026-10-11.md`*
