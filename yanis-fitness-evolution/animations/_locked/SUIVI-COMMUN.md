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

## 1 bis. INTÉGRÉ DANS L'APP LE 11 OCTOBRE (commit `2225d5b`) — feu vert explicite de l'utilisateur

| Exercice (app) | Fichier média | État |
|---|---|---|
| `Front squat` | `/media/6008e0f8a2557d40.gif` | **intégré** (remplace l'ancien `1c28908ab83cde2e.gif`) |
| `Fentes bulgares haltères (pied avant surélevé)` | `/media/3a817d4e229a92ee.gif` | **intégré** (nouveau) |
| `Leg extension` | `/media/0223a993070bf19b.gif` | **intégré** (nouveau, 5 images) |

Fait dans les 4 endroits requis : `public/media/`, `release/media/`, `public/media-index.json`, `release/media-index.json`
(+ `legacy.json` et le bundle `release/assets/index-BLZxzv9Y.js` patché **en binaire** — delta d'octets vérifié).
Contrôle : `npm test` = **94 passés / 0 échec** ; `media-index.json` = 267 entrées ; les 3 exercices résolvent leur GIF.
| `Bulgarian split squat haltères` | `/media/493af81454d9f86c.gif` | **intégré** (exercice enfin séparé de la version sans haltères) |
| `Goblet squat` | `/media/33d8d73dda8abb5b.gif` | **intégré** (décor E1) |
| `Leg press` | `/media/d7bd0092279c8789.gif` | **intégré** (décor E1) |

**Défaut « 1 exercice = 1 animation » corrigé** : `Bulgarian split squat` et `Bulgarian split squat haltères` partageaient
`cf312b839f6da027.gif` — ils ont désormais chacun leur animation.
→ **Après ces 3 : il reste 1 cassé (bulgarian) + 18 décors pâles.** Ne pas écrire « tout est corrigé ».

**En attente d'accord** : 2 images fixes de validation dans `build/validation/` (front squat A et bulgarian A, décor E1).

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

## 3. LA QUEUE DE CORRECTION — VÉRIFIÉE LE 11 OCTOBRE (fin de journée)

> ⚠️ **Les listes précédentes étaient gonflées par des erreurs de lecture. Voici l'état RÉELLEMENT vérifié**,
> image par image, après `-coalesce`. Détail des corrections : §6 « RETRACTIONS ».

### 🔴 1 SEUL GIF EST VRAIMENT CASSÉ

| GIF | Preuve | Action |
|---|---|---|
| `themeB/bulgarian-split-squat-3poses.gif` | image 1 = moyenne 66 % / écart-type 22 % (normal) — **images 2, 3 et 4 = moyenne 91 % / écart-type 5-6 % = fond vide, aucun athlète** | **régénérer entièrement** |

⚠️ `bulgarian-split-squat` et `fentes-bulgares-halteres-pied-avant-sureleve` sont **deux entrées distinctes** de
l'inventaire → **interdiction de réutiliser le même GIF** (règle « 1 exercice = 1 animation »).

### 🟠 20 GIF — DÉCOR PÂLE, À RÉALIGNER SUR E1 (animation correcte)

`themeB/` presse-a-cuisses-pieds-hauts · back-squat-charge-moderee · bulgarian-split-squat-halteres · leg-press ·
**goblet-squat** · **leg-extension** · **step-up** · **squat-cycliste**
`themeA/` abduction-assise · pallof-press · squat-poids-du-corps · face-pull · clamshell · fire-hydrant ·
abduction-hanche · pompes · gainage-planche · pont-fessier-activation
`B-04/` **front squat** (déjà intégré dans l'app) · **fentes bulgares** (terminé, non intégré) · **leg extension** (terminé)

→ **Méthode (gain de temps majeur, §5) : garder le personnage et la pose, régénérer UNIQUEMENT les 3 fonds,
puis relancer `build/faire-gif.sh`. Aucune régénération d'athlète.**

### 🔵 1 GIF HORS FORMAT (hors périmètre des 307)

`poc/back-squat.gif` — **portrait 480×860** alors que la production est en paysage ; disques coupés, 3ᵉ pose debout.
→ **à trancher avec l'utilisateur** : garder, recadrer, ou refaire.

### ✅ 18 GIF CONFORMES À E1 — ne pas y toucher

`lot1/` dead-bug · bird-dog · gainage-lateral — `lot2/` dead-bug-rotation · gainage-lateral-dyn · mountain-climbers —
`lot3/` circuit-abdos · circuit-gainage — `lot4/` plat · plat-neutre · decline-neutre —
`lot5/` incline-30 · incline-45 · incline-45-prise-neutre —
`themeA/` mobilite-des-epaules · respiration-diaphragmatique · hip-thrust-unilateral · fentes-arriere-pdc

### Données brutes

`QUEUE-CORRECTION.tsv` — saturation des 50 GIF, classés. Rejouable :
```bash
convert IMG -resize 400x -colorspace HSL -channel G -separate +channel -format "%[fx:mean*100]" info:
```

---

## 3 bis. COMMENT VÉRIFIER UN GIF SANS SE TROMPER (méthode obligatoire)

```bash
# structure + délais
convert GIF            -coalesce -format "%s:%wx%h " info:
convert GIF            -format "%T cs " info:
# une image est-elle VIDE ? écart-type très bas = oui
convert GIF -coalesce -format "%s moy=%[fx:int(mean*100)]%% ec=%[fx:int(standard_deviation*100)]%%\n" info:
```

**Piège à connaître :** `identify GIF` sur un GIF **non coalescé** affiche une image `1x1` sur des fichiers
**parfaitement sains** (c'est le codage interne du GIF). Ne jamais conclure « image manquante » sans `-coalesce`.
**Les 3 GIF verrouillés sont sains** : 5 images pleines, délais `25 20 50 20 25`.

---

## 3 ter. DÉCORS DÉJÀ CORRIGÉS — EN ATTENTE DE VALIDATION UTILISATEUR (11 octobre)

Fichiers dans `build/corrections/` (assemblés par `faire-gif.sh`, 5 images, délais `25 20 50 20 25 cs`, décor E1) :

| Exercice | Fichier | Saturation | Statut |
|---|---|---|---|
| bulgarian split squat haltères | `bulgarian-split-squat-halteres-3poses.gif` | 43,2 / 34,7 | **INTÉGRÉ** le 11/10 (accord explicite) |
| goblet squat | `goblet-squat-3poses.gif` | 29,0 / 35,8 | **INTÉGRÉ** le 11/10 (accord explicite) |
| leg press | `leg-press-3poses.gif` | 27,3 / 25,9 | **INTÉGRÉ** le 11/10 (accord explicite) |
| bulgarian split squat (sans haltères) | `bulgarian-split-squat-3poses-CORRIGE.gif` | 34,8 / 33,5 | **attente validation** (GIF cassé reconstruit) |

→ Reste **14 décors** à réaligner après ces intégrations. Le GIF du bulgarian sans haltères n'entre PAS dans l'app
tant que l'utilisateur ne l'a pas validé.
Recette appliquée : l'athlète est conservé (aucune régénération de pose), **seul le fond** est remplacé depuis les frames existantes + la référence décor E1.

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

---

## 7. RETRACTIONS — ERREURS COMMISES PUIS CORRIGÉES (11 octobre 2026)

À ne **pas** répéter. Corrigées après vérification image par image.

| Affirmation antérieure | Verdict | Réalité vérifiée |
|---|---|---|
| « leg extension : 4 images au lieu de 5, athlète masqué par la machine » | ❌ **RETIRÉ** | 4 images pleines, **standard du projet**. L'extension des genoux est claire et lisible. La version app (5 images) est une **amélioration**, pas une réparation d'urgence |
| « image 1×1 pixel / image manquante » sur leg-extension, squat-cycliste, step-up, bulgarian | ⚠️ **ARTEFACT** | `identify` sur GIF non coalescé affiche `1x1` sur des fichiers **sains**. Seul `-coalesce` fait foi |
| « goblet squat : pose basse écrasée / déformée » | ⚠️ **EXAGÉRÉ** | La pose basse se lit bien comme un **squat correct**. Le rendu des genoux est un peu raide → **polissage**, pas régénération |
| « step-up : le banc change de place et d'échelle » | ❌ **NON CONFIRMÉ** | Le banc reste cohérent d'une image à l'autre. Retiré de la queue |
| « squat cycliste : l'échelle saute » | ❌ **NON CONFIRMÉ** | Cadrage cohérent. Retiré de la queue |
| « 36 GIF à corriger » / « 33 à réaligner » (plan précédent) | ❌ **FAUX** | **1 cassé + 20 décors à réaligner.** Le plan précédent visait en plus le **mauvais décor** |
| « 42 puis 37 puis 39 couverts » | ✅ | **39** est le bon chiffre (37 du lot historique + front squat + fentes bulgares) |

**Leçon à retenir :** ne jamais conclure sur une vignette ou un `identify` brut. **Extraire, coalescer, mesurer.**

---

## 8. GAIN DE TEMPS MAJEUR — LE GARDE-FOU EST SOLIDE

**Les 3 GIF verrouillés se reconstruisent depuis leurs PNG sources**, sans jamais retoucher l'athlète :

| GIF | Sources | Taille cible | RMSE de reproduction |
|---|---|---|---|
| front squat | `_sources/B-04/front-squat-A / M4 / B.png` | 440×246 | ~1,7 % |
| fentes bulgares | `_sources/B-04/fentes-bulgares-A-banc-profil2 / M-banc-profil / B5-banc-profil.png` | 440×246 | (pipeline identique) |
| leg extension | `_sources/B-04/leg-extension-A3 / M5 / B4.png` | 440×440 | ~2 % |

**Conséquence : corriger le décor = régénérer 3 FONDS par exercice**, puis relancer l'assemblage.
Le personnage, la pose et le cadrage restent intacts. C'est ce qui rend les 20 réalignements réalisables.

**Outil prêt :** `build/faire-gif.sh` — usage :
```bash
./build/faire-gif.sh A.png M.png B.png 440x246 sortie.gif
```
Il assemble `A → M → B → M → A` avec les **délais officiels 25/20/50/20/25 cs**, vérifie le nombre d'images,
la taille, et **mesure la saturation du décor** (cible E1 ≥ 22). Exemple produit :
`build/EXEMPLE-leg-extension-5images-440x440.gif`.
