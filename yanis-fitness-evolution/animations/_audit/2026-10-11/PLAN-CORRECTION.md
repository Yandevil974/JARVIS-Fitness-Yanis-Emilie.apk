# PLAN DE CORRECTION — COMBIEN DE GIFS À CORRIGER
**11 octobre 2026** — réponse chiffrée + ordre de traitement.

---

## 1. LA RÉPONSE EN UNE LIGNE

> **39 exercices sont couverts. 3 sont conformes et partent au verrou tout de suite.
> 36 exercices + 3 étapes de chrono = 39 fichiers à corriger.**

---

## 2. LE DÉCOMPTE EXACT

| Étape | Nombre |
|---|---|
| GIF d'exercices livrés (lot historique 9 oct.) | **37** |
| + front squat (intégré le 10 oct.) | +1 → 38 |
| + fentes bulgares pied avant surélevé (terminé, non intégré) | +1 → **39** |
| **Exercices couverts** | **39 / 307 = 12,7 %** |
| **Restant à produire** | **268** |

### Sur ces 39 : combien sont bons ?

| | Nombre | Détail |
|---|---|---|
| ✅ **CONFORMES — partent au verrou** | **3** | front squat, fentes bulgares, leg extension (version app) |
| 🟡 **À réaligner sur le décor verrouillé** | **33** | le personnage est bon, le décor dérive |
| 🟠 **Défaut anatomique / cadrage en plus du décor** | **3** | goblet squat (pose basse écrasée), step-up (banc qui change de place), squat cycliste (échelle qui saute) |
| 🔴 **CASSÉ — à refaire entièrement** | **1** | bulgarian split squat (images 2-3 vides, image 4 = 1×1 pixel) |
| **TOTAL À CORRIGER** | **36** | |
| + étapes de chrono `warmup-*` dans le même état | **3** | non comptées dans les 307 exercices |
| **TOTAL FICHIERS À CORRIGER** | **39** | |

*(La version livrée de `leg-extension-3poses.gif` est l'ancienne, 4 images : elle est remplacée par la version app en 5 images, déjà conforme.)*

---

## 3. LES 3 NIVEAUX DE CORRECTION (par urgence réelle)

### 🔴 NIVEAU 1 — OBLIGATOIRE, ÇA NE PEUT PAS SORTIR COMME ÇA (4 GIF)

| GIF | Ce qui ne va pas |
|---|---|
| `themeB/bulgarian-split-squat-3poses.gif` | **cassé** : aucune animation visible |
| `themeB/leg-extension-3poses.gif` | **4 images** au lieu de 5, athlète masqué par la machine |
| `themeB/goblet-squat-3poses.gif` | pose basse **écrasée / déformée** |
| `themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` | **le banc change de place et d'échelle** d'une image à l'autre |

→ **4 GIF à refaire en priorité.** Ce sont ceux qui se voient à l'œil nu dans l'app.

### 🟠 NIVEAU 2 — DÉCOR NETTEMENT HORS CRITÈRES (15 GIF)

Mesure de saturation du décor : **≥ 28,5** (référence verrouillée ≈ 18,7).

`lot1/bird-dog` · `lot1/gainage-lateral` · `lot2/dead-bug-rotation` · `lot2/gainage-lateral-dyn` · `lot3/circuit-abdos` · `lot3/circuit-gainage` · `lot4/developpe-halteres-decline-neutre` · `lot4/developpe-halteres-plat-neutre` · `lot5/developpe-halteres-incline-30` · `lot5/developpe-halteres-incline-45` · `lot5/developpe-halteres-incline-45-prise-neutre` · `themeA/respiration-diaphragmatique` · `themeA/pont-fessier-activation` · `themeA/hip-thrust-unilateral-1-jambe` · `themeA/mobilite-des-epaules`

→ **15 GIF à réaligner** : même athlète, même exercice, **décor remis sur la référence**.

### 🟡 NIVEAU 3 — DÉCOR INTERMÉDIAIRE, À REPASSER (8 GIF)

Saturation entre **21 et 28,5** : plus proche, mais pas encore aligné.

`themeA/abduction-hanche-elastique` · `themeA/clamshell-elastique` · `themeA/gainage-planche` · `themeA/pompes` · `lot1/dead-bug` · `lot2/mountain-climbers` · `lot4/developpe-halteres-plat` · `themeB/leg-press`

→ **8 GIF à repasser** une fois les niveaux 1 et 2 faits.

### ✅ GROUPE DÉJÀ BON (13 GIF) — vérification légère

Saturation **< 21**, donc décor proche du verrou. Ils ne demandent **qu'un contrôle**, pas une reprise, sauf les 3 du niveau 1 qui sont dans ce groupe.

`themeB/back-squat-charge-moderee` · `themeB/bulgarian-split-squat-halteres` · `themeB/presse-a-cuisses-pieds-hauts` · `themeA/fentes-arriere-pdc` · `themeA/fire-hydrant-elastique` · `themeA/pallof-press-elastique` · `themeA/abduction-assise` · `themeA/face-pull-elastique` · `themeA/squat-poids-du-corps` · + les 3 conformes · + `themeB/leg-extension` (remplacé par la version app)

### ⚙️ À PART — les POC (4)

`poc/back-squat` (portrait 480×860, disques coupés, 3ᵉ pose debout) · `poc/developpe-couche-barre` · `poc/hip-thrust-barre` · `poc/souleve-de-terre-roumain`.
Ils ne font pas partie des 307 exercices de l'inventaire. **À trancher : on les garde, on les refait, ou on les abandonne ?**

---

## 4. MÉTHODE DE CORRECTION (rapide, et qui ne casse rien)

**Le personnage n'a pas besoin d'être refait.** C'est le décor qui dérive. Donc :

1. **Prendre l'image verrouillée** `_locked/reference/POSE-A-front-squat-reference-decor.png` comme décor de référence.
2. Pour chaque GIF : reprendre la **pose A existante** (le personnage est bon) et **régénérer uniquement le fond** sur le décor verrouillé.
3. Chaîner M et B depuis cette nouvelle A — comme pour le front squat (qui a marché).
4. Contrôler les 3 poses, assembler en **5 images `A → M → B → M → A`**.
5. **Présenter chaque GIF terminé** immédiatement, attendre l'accord.

**Ce qui prend du temps, c'est le plafond de 10 appels image par tour.** Aucun nombre de GIF par tour n'est garanti — c'est la contrainte technique qui fixe le rythme, pas la méthode.

## 5. ORDRE DE TRAITEMENT RECOMMANDÉ

1. **Niveau 1 (4 GIF cassés/déformés)** — ce sont les seuls qui font « bug » dans l'app.
2. **Verrouiller les 3 conformes** → ils partent en intégration.
3. **Niveau 2 (15 GIF décor)** par blocs de 3.
4. **Niveau 3 (8 GIF)** ensuite.
5. **Contrôle final** du groupe « déjà bon » (13).

## 6. CE QUI BLOQUE ENCORE

**Le fichier `Screenshot_20261011_085401_Google.jpg` n'est toujours pas arrivé dans l'espace de travail de l'agent**
(`/home/user/uploads/` n'existe pas sur ce poste). L'image est visible dans le chat, mais elle n'est **pas enregistrée** :
elle ne peut donc pas servir de référence de décor enregistrée pour les corrections.

**Deux solutions, au choix :**
- **A.** Vous déposez l'image directement dans le dépôt (dossier `yanis-fitness-evolution/animations/_locked/reference/`) et on verrouille **votre** décor.
- **B.** On verrouille **le décor du front squat** (déjà validé par vous le 10 octobre, déjà dans le dépôt, déjà dans le bon style) — c'est le plus rapide, et c'est **immédiatement opérationnel**.

**Sans cette décision, je ne peux pas lancer les corrections de décor sans risquer de partir dans le mauvais sens.**

---

*Verrou et règle : `animations/_locked/REFERENCE-VERROUILLEE.md`. Audit complet : `animations/_audit/2026-10-11/RAPPORT-AUDIT-2026-10-11.md`.*
