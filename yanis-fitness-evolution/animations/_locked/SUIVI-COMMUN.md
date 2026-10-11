# 🧭 BASE COMMUNE — SUIVI PARTAGÉ DES GIFs
**Créé le 11 octobre 2026.** Document **unique de référence** pour tout agent qui reprend ce chantier.
`animations/_locked/` = la base commune. Personne ne modifie le verrou sans accord de l'utilisateur.

---

## 1. CHIFFRES À JOUR — VÉRIFIÉS LE 11 OCTOBRE 2026

| | Nombre |
|---|---|
| **Périmètre actif (exercices HOMME)** | **307** |
| **Livrés (validés sur la pose)** | **39** → 12,7 % |
| **Restants à produire** | **268** |
| **GIF à corriger** | **5** (voir §3) |
| Intégrés dans l'app aujourd'hui | **1** (front squat) — **3 possibles immédiatement** |

**Compteur historique mixte (ne plus utiliser comme objectif) :** 77 / 614 (45 HOMME + 32 FEMME).
**Fichiers dans `animations/` :** 103 = 77 individuels + 26 planches.

### Décomposition des 39 livrés

| État | Nombre | Détail |
|---|---|---|
| ✅ Conformes | **34** | décor du bon côté **et** animation correcte |
| 🟠 À corriger | **5** | 2 réparés par remplacement, 3 à régénérer |
| ⚙️ Hors périmètre 307 (POC) | 4 + 1 | à trancher avec l'utilisateur |

---

## 2. RÉPARTITION DU DÉCOR — LE POINT QUI DÉCIDE

Mesures de saturation (moyenne HSL) sur les 44 GIF HOMME :

| Rendu | Saturation | Nombre | Période de production |
|---|---|---|---|
| **A — DENSE** (mer bleue visible, végétation dense, lumière dorée) | **36 → 47** | **25 GIF** | 5-6 octobre + **fichier de référence de l'utilisateur (23,1)** |
| **B — PÂLE** (tout pâle, mer à peine visible) | **13 → 21** | **19 GIF** | 7-10 octobre |

**La production a dérivé de A vers B sans décision explicite.** Preuves : `reference/DECISION-DECOR-11-OCT.jpg`.

**Question en attente (bloque les corrections) :** garder **A** (conforme aux 2 références de l'utilisateur)
ou **B** (conforme à ses 3 dernières validations de pose) ?

---

## 3. LES 5 GIF À CORRIGER

| # | GIF | Défaut | Correction |
|---|---|---|---|
| 1 | `themeB/leg-extension-3poses.gif` | 4 images au lieu de 5, athlète masqué | ✅ **AUCUNE GÉNÉRATION** — remplacer par `leg-extension-app.gif` (440×440, 5 images), déjà conforme |
| 2 | `themeB/bulgarian-split-squat-3poses.gif` | **CASSÉ** : images 2-3 vides, image 4 = 1×1 px | ⚠️ **DÉCISION UTILISATEUR** — l'exercice est le même que les fentes bulgares pied avant surélevé, dont le GIF est **déjà terminé et validé**. La règle « 1 exercice = 1 animation » doit trancher : réutiliser ce GIF, ou régénérer |
| 3 | `themeB/goblet-squat-3poses.gif` | pose basse **écrasée / déformée** | régénérer la pose B puis chaîner |
| 4 | `themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` | **le banc change de place et d'échelle** entre les images | régénérer en fixant le banc |
| 5 | `themeB/squat-cycliste-squat-complet-3poses.gif` | **échelle qui saute** d'une image à l'autre | régénérer en fixant le cadrage |

**⇒ 2 exercices réparables sans produire une seule image. 3 à régénérer.**

⚙️ **POC à part (hors 307) :** `poc/back-squat` (portrait 480×860, disques coupés), `poc/developpe-couche-barre`,
`poc/hip-thrust-barre`, `poc/souleve-de-terre-roumain`, `poc/nage-douce-femme`. → garder, refaire ou abandonner ?

---

## 4. CE QUI EST PRÊT À PARTIR DANS L'APP

| GIF | Exercice | Format | État |
|---|---|---|---|
| `01-FRONT-SQUAT-verrouille-…gif` | Front squat | 440×246, 5 img | ✅ **déjà intégré** |
| `02-FENTES-BULGARES-verrouille.gif` | Fentes bulgares haltères pied avant surélevé | 440×246, 5 img | 🟢 terminé, **attend le feu vert** |
| `03-LEG-EXTENSION-verrouille.gif` | Leg extension | 440×440, 5 img | 🟢 terminé, **attend le feu vert** |

**Ces 2 feux verts font passer l'app de 1 à 3 exercices animés. Zéro génération nécessaire.**

---

## 5. PROTOCOLE POUR TOUT AGENT QUI REPREND

1. **Lire** `_locked/REFERENCE-VERROUILLEE.md` (le verrou) puis ce fichier.
2. **Ne rien régénérer** de ce qui est conforme. Le personnage n'a jamais besoin d'être refait.
3. **Avant toute image** : partir de la **dernière pose validée** comme image d'entrée (jamais de zéro).
4. **Vérifier soi-même** : personnage (blanc/argent mat, visage noir sans traits, casquette, short noir,
   baskets blanches, muscles jaune-orangé doré) **et** décor — **avant** de montrer quoi que ce soit.
5. **Une seule image fixe par exercice**, présentée, puis **attendre l'accord explicite**.
6. **Chaque GIF terminé est présenté immédiatement.** Pas de lot de 10.
7. **Rien dans `public/media/`, `src/`, `release/` sans autorisation explicite.**
8. Branche de travail : la branche de session Arena en cours. Le verrou `_locked/` est la base partagée.
9. Plafond technique : **10 appels image par tour**. C'est ce qui fixe le rythme, pas la méthode.

## 6. COMMENT COMPTER (pour ne plus se tromper)

- On compte **un exercice = un GIF individuel**. Jamais les planches, jamais les variantes, jamais les aperçus.
- Un GIF **cassé** n'est **pas** compté comme livré.
- Les `warmup-*` sont des **étapes de chronomètre**, pas des exercices : hors des 307.
- Les **POC** sont hors inventaire : comptés à part, avec réserves.
- Toujours vérifier les défauts **sur les images extraites une par une**, jamais sur la vignette.

---

*Verrou : `animations/_locked/REFERENCE-VERROUILLEE.md` · Audit : `animations/_audit/2026-10-11/RAPPORT-AUDIT-2026-10-11.md`*
