# ÉTAT AU 01/10/2026 — BRANCHE `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`

> **Suite du chantier (02/10/2026) : branche `arena/01a0fae1-jarvis-fitness-yanis-emilie-ap`.**
> L'historique de `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap` (tête `3c163a6`) a été repris **tel quel**
> (`git fetch origin 3c163a6:refs/remotes/base/passation`, puis adoption de l'arbre, aucun `reset --hard`).
> État inchangé au moment de la reprise : lot 1 validé non intégré, lot 2 proposé en attente, APK intact.
> Ce document reste la référence ; seul le nom de la branche de travail change.
> **Bloc de reprise prêt à copier-coller dans un nouveau chat : `PASSATION-COPIER-COLLER.md`**
> (consigne + passation complète, état au 01/10/2026 : lot 1 validé, lot 2 proposé).

## 1. Prototype n°44 VALIDÉ (accord explicite, fichier identifié par son empreinte)

L'utilisateur a cité le lien brut de `44-vert260-660-webp-q90.webp` (commit `7bbaca5`) et répondu **« validé »**.
Enregistré dans `evolution/media/refonte-photo/hd-2026-09-30/VALIDATION-44-2026-09-30.json` :

- fichier validé : `…/hd-2026-09-30/prototype-44-vert260/exports/44-vert260-660-webp-q90.webp`,
  **sha256 `0ecbbd679668154303d0c33090c7fc48b086a7ae82460f6ac284205a6e642618`**, 388×660, 2 images de 500 ms, **98 ko** ;
- réglages validés : **WebP animé**, **q90**, **660 px**, **vert rapproché du 260** (contour resserré,
  correspondance de percentiles) ; cadrage identique au GIF livré ;
- fichier de secours consigné (GIF 660, 403 ko) si la WebView refuse le WebP ;
- contrôles du prototype : **0 pixel modifié hors zone verte** (1 045 768 / 1 052 290 px vérifiés),
  saturation 0,894/0,925 pour 0,914 sur le 260, 11 137 nuances conservées, transition de contour 13,0 → 8,5 px.
- **Portée** : couvre le **n°44** seulement. Le **n°45** (même démonstration) attend un accord explicite séparé.
  **Aucun GIF livré remplacé, APK non reconstruit.**

## 2. Inventaire des sources des 389 (fichier `INVENTAIRE-SOURCES-389.json`)

Construit en lisant les en-têtes PNG directement dans les objets git (aucun téléchargement, aucun média modifié) :

| Source native disponible | Nombre |
|---|---|
| Planche native enregistrée dans le manifeste (324) + retrouvée dans un lot de propositions (24) + retrouvée par nom (7) | **355** |
| Dont exploitable à **660 px sans agrandissement** (panneau ≥ 660 px) | **340** |
| Dont nécessitant un léger agrandissement (panneaux de 381 à 596 px de haut) | 15 |
| **Aucune source PNG native** : 34 entrées, **toutes « femme »**, séries piscine/aqua/elliptique (210, 224-259, 274-276, 289-330) | 34 |

Dimensions natives dominantes : **1376×768** (266 entrées) et 1456×720 (43). Un panneau de 768 px de haut
alimente donc un export 660 px **sans agrandissement** — argument décisif en faveur des 660 px retenus.
Les 34 entrées sans source native correspondent au chantier **piscine/aqua/cardio**, prévu **après** les visuels :
elles seront traitées avec ce chantier (guides piscine), pas en aveugle.

## 3. Lot 1 VALIDÉ le 01/10/2026 (n°45, 48, 19, 85) — TOUJOURS NON INTÉGRÉ

Consigne utilisateur : « Fais le a » (les quatre numéros du lot 1 proposé). Méthode **identique au n°44 validé**,
zéro génération d'image : outil `evolution/media/tools/retouche-lot1-vert260.py`, sorties dans
`evolution/media/refonte-photo/hd-2026-09-30/lot1/` (`travail/`, `exports/`, `planches/`, `CONTROLES.json`),
page de validation **`hd-2026-09-30/lot1/valider.html`** (servie sur le port 8080).

**VALIDATION** : l'utilisateur a répondu **« C'est bon »** après avoir consulté `lot1/valider.html`.
Enregistré dans `hd-2026-09-30/VALIDATION-LOT1-2026-10-01.json`, avec l'empreinte des 8 fichiers validés
(4 WebP q90 + 4 GIF de repli) :

| N° | WebP validé (sha256, début) | poids | taille |
|---|---|---|---|
| 45 | `0ecbbd6796681543…` | 98 ko | 388×660 |
| 48 | `760d7f2b9caa2dae…` | 157 ko | 396×660, 4 phases |
| 19 | `fce01231559fa5e7…` | 80 ko | 572×660 |
| 85 | `89adcd10c03f674d…` | 200 ko | 1182×660 |

**Portée de cette validation** : les 4 propositions, telles quelles. Elle **ne couvre pas** l'intégration :
aucun GIF livré remplacé, APK non reconstruit, format WebP dans l'app non adopté (accord + test WebView
toujours requis). Rappel : *proposition ≠ validation ≠ intégration*.

**Suite** : la méthode est validée → reprise de la série des 389 par lots de quatre, en partant des sources
natives, tant que les numéros ont un PNG natif exploitable.

| N° | Source native | Export | WebP q90 | GIF de repli | Ce qui a été fait |
|---|---|---|---|---|---|
| 45 | = n°44 (GIF livrés identiques, sha `4696c143…`) | 388×660 | 98 ko | 403 ko | reprise **à l'identique** de la sortie validée du 44, aucune recuisson |
| 48 | `lot64/phases/zottman-phase1..4.png` 800×1334 | 396×660, 4 phases | 157 ko | 762 ko | voile vert translucide de l'avant-bras **préservé** (peau/veines visibles) ; le **coussin teal foncé du banc est écarté du masque** (plancher de luminosité 0,45) : c'est lui qui donnait le « raccord plat » signalé ; l'ancien GIF faisait 264×440 |
| 19 | `lot57/planches/bulgarian-split-squat-halteres.png` 688×768 ×2 | 572×660 | 80 ko | 392 ko | le vert de l'app **est le panneau du legging** (olive), pas un muscle : panneau réel gardé (tissu, couture, ombre) ramené dans la famille 260 ; l'aplat lime du lot68 (`recolorisation-reserves.json`, `validation_utilisateur: false`) est abandonné ; **plus de débordement sur l'avant-bras** ; plantes du décor hors zone |
| 85 | `lot68/phases/85-depart-2.png` + `85-fin-4.png` 1376×768 | 1182×660 | 200 ko | 843 ko | deltoïdes **remontés à leur clarté d'origine** (l'ancien export les assombrissait, V 0,60 → 0,52) avec forme anatomique et ombres ; deux ROI (un par deltoïde) pour traiter les deux épaules |

Contrôles mesurés (détail complet dans `lot1/CONTROLES.json`) : erreur WebP 1,52 / 1,84 / 1,64 (PSNR 42,96 / 41,42 / 42,22 dB),
GIF 2,17 / 2,80 / 3,13 ; zones vertes 5 903 px (19), 37 125 px (48), 4 047 px (85) ; contraste du vert après passage
(19 : S 0,694 → 0,887 ; 48 : 0,424 → 0,724 ; 85 : 0,784 → 0,907) ; **aucun pixel modifié hors zone**.

Interdits respectés : `gif_livres_modifies: 0`, `apk_reconstruit: false`, `proposition_non_integree: true`,
aucun `git push` hors `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`. Commit `d01fb1a`.

## 3bis. Lot 2 (n°11, 12, 30, 42) — VALIDÉ le 02/10/2026, TOUJOURS NON INTÉGRÉ

Même méthode (outil `evolution/media/tools/retouche-lot2-vert260.py`, qui réutilise les fonctions du lot 1).
Sorties : `hd-2026-09-30/lot2/` (`travail/`, `exports/`, `planches/`, `CONTROLES.json`), page de validation
**`hd-2026-09-30/lot2/valider.html`** (port 8080). Choix des numéros : les plus gros écarts mesurés entre le
GIF livré et sa source native **qui portent un vrai vert sur le muscle**.

| N° | Source native | Export | WebP q90 | GIF repli | Ce que ça montre |
|---|---|---|---|---|---|
| 11 | `planches/lot01/homme/back-squat.png` (2 cases) | 577×660 | 101 ko | 389 ko | fessiers + quadriceps des 2 jambes |
| 12 | `planches/lot20/back-squat-barre-haute.png` | 577×660 | 103 ko | 392 ko | idem, variante barre haute |
| 30 | `planches/lot26/curl-barre-debout.png` | 583×660 | 110 ko | 402 ko | biceps + avant-bras, stries conservées |
| 42 | `planches/lot18/curl-scott-barre-ez-pronation.png` | 588×660 | 113 ko | 419 ko | avant-bras sur pupitre, doigts/tendons nets |

Contrôles : erreur WebP 1.74 / 1.75 / 1.74 / 1.71 (PSNR ≈ 41.7–41.9 dB) ; GIF 2.9–3.1 ;
saturation après passage 0.904 / 0.930 / 0.873 / 0.876 (référence 260 = 0.914) ;
**0 pixel modifié hors zone**. Cadrage identique au GIF livré (décalage mesuré par appariement).

**Deux pièges découverts pendant la sélection (à connaître pour la suite) :**

1. **Le vert du GIF livré peut ne pas exister dans la source native.** n°1, 9, 10 : le vert présent dans
   l'app est une bande fabriquée à l'intégration — dans la planche native, le vert mesuré est celui du
   **feuillage du décor** (la couleur la plus « lime » de la case est `RGB 202,215,21` sur une feuille).
   Ces numéros ne sont donc pas des candidats de retouche tant que la source du vert de l'app n'est pas
   identifiée. Écartés du lot, signalés à l'utilisateur.
2. **Les GIF de l'app ne sont pas les fichiers des branches d'archive.** `public/media` est un magasin
   **par empreinte** (94 GIF uniques pour 389 numéros, 0 contenu commun avec `refonte-photo/gif/`), et la
   branche de passation (`3cbb3e5`) ne contient que les 26 GIF retouchés du lot68 — les autres numéros
   gardent la version de `c685298`. Toujours vérifier `git show <branche>:<chemin>` avant de comparer.

Autre point de méthode : `git fetch` ne peut pas récupérer ces branches par leur nom sur ce remote
(`couldn't find remote ref`), mais **par SHA oui** :
`git fetch origin <sha>:refs/remotes/base/passation`. C'est ainsi que les bases `base/passation` et
`base/lots-complets` sont reconstituées après un redémarrage du bac à sable.

**VALIDÉ le 02/10/2026** — numéro par numéro (« 11 OK », « 12 OK », « 30 OK », « 42 OK ») après
consultation de `lot2/valider.html` (servie sur le port 8080), sur la branche
`arena/01a0fae1-jarvis-fitness-yanis-emilie-ap` qui a repris l'arbre de `arena/01a0edb7-…` (tête `3c163a6`).
Empreintes sha256 des 8 exports vérifiées identiques à `lot2/CONTROLES.json` **avant** validation, puis
consignées dans **`hd-2026-09-30/VALIDATION-LOT2-2026-10-02.json`**.

| N° | WebP validé (sha256, début) | poids | taille | PSNR |
|---|---|---|---|---|
| 11 | `71876430d23be5eb…` | 101 ko | 577×660 | 41,85 dB |
| 12 | `fd465c308965a68a…` | 103 ko | 577×660 | 41,81 dB |
| 30 | `43c18771d9ad7a8e…` | 110 ko | 583×660 | 41,70 dB |
| 42 | `471ba0741d9d7f08…` | 113 ko | 588×660 | 41,93 dB |

**Portée** : les 4 propositions telles quelles. **Non couvert** : l'intégration — aucun GIF livré remplacé,
APK intact, WebP dans l'app toujours soumis au test WebView sur le téléphone + accord.
Rappel : *proposition ≠ validation ≠ intégration*.

---

## Lot 3 — VALIDÉ le 02/10/2026 (n°387, 388, 264, 14) — TOUJOURS NON INTÉGRÉ

Validé numéro par numéro (« 387 OK », « 388 OK », « 264 OK », « 14 OK ») après consultation de
`lot3/valider.html`. Empreintes et mesures dans **`hd-2026-09-30/VALIDATION-LOT3-2026-10-02.json`** ;
détail des ROI, seuils, percentiles et PSNR dans `lot3/CONTROLES.json`.

| N° | Exercice | Export | WebP | PSNR | GIF repli | Saturation avant → après (réf. 260 = 0,914) |
|---|---|---|---|---|---|---|
| 387 | talons-fesses | 193×660 | 42 ko | 41,49 dB | 120 ko | 0,690 → 0,930 |
| 388 | talons-fesses effort | 193×660 | 42 ko | 41,49 dB | 120 ko | identique (même source, même GIF livré) |
| 264 | étirement contre le mur | 188×660 | 39 ko | 41,67 dB | 130 ko | 0,835 → 0,918 |
| 14 | back squat inertie/pause | 573×660 | 99 ko | 42,04 dB | 397 ko | 0,908 → 0,947 · 0,572 → 0,775 |

**Contrôle clé** : **0 pixel modifié hors zone verte** sur les 8 phases du lot.

**Deux particularités à connaître** :
- **387 et 388** partagent la même source et le même GIF livré (sha256 identiques) : les deux exports
  sont donc identiques, et c'est volontaire.
- **14** : la phase 2 est restée plus terne (0,775) parce que l'ombrage entre phases est conservé ;
  l'utilisateur a validé ce choix tel quel.
- Les **ROI du lot 3 ne sont pas posées à l'œil** : elles sont dérivées de la tache verte mesurée dans
  le GIF livré (bbox consignée, élargie de 100 %). Session sans vision, voir
  `hd-2026-09-30/PRIORITE-SOURCES-TRI.md` : **tous les essais de tri automatique muscle/décor ont
  échoué**, ne pas les retenter.

**Portée** : les 4 propositions telles quelles. **Non couvert** : l'intégration — aucun GIF livré
remplacé, APK intact, WebP dans l'app toujours soumis au test WebView + accord.

**Suite** : la file d'attente est `hd-2026-09-30/PRIORITE-SOURCES.json` (78 numéros retenus, triés par
« perte » décroissante). Le lot 4 se choisit sur la page de tri visuel (`tri/tri.html`, à refabriquer
avec `evolution/media/tools/planche-tri.py`, car `tri/` et `.cache/` sont ignorés par git et ne
survivent pas à un changement de session).

**Suite** : lots suivants de 4 numéros depuis les sources natives, avec vérification préalable que le vert
existe bien dans la source (pièges §2) ; priorité aux numéros dont le GIF livré perd le plus de pixels
(`evolution/media/tools/priorite-sources.py`, tableau `hd-2026-09-30/PRIORITE-SOURCES.json`).

---

## 4. Prochain lot proposé (aucune action engagée sans votre accord)

Après validation numéro par numéro du lot 1, reprendre les 389 par lots de quatre en partant des sources
natives (voir `INVENTAIRE-SOURCES-389.json` : 340 numéros exploitables à 660 px sans agrandissement).
Les 34 numéros féminins piscine/aqua/elliptique sans PNG natif (210, 224-259, 274-276, 289-330) demandent un
chantier à part : ils ne peuvent pas être « dé-pixellisés » à partir de l'existant.

---
# PROTOTYPE n°44 — RÉGLAGES CHOISIS PAR L'UTILISATEUR ET PROTOTYPE CONSTRUIT (30/09/2026)

**Décisions utilisateur du 30/09/2026 : format WebP animé · hauteur 660 px · vert rapproché du n°260.**
Le prototype correspondant est construit, mesuré et **non intégré** : aucun GIF livré remplacé,
0 appel de génération d'image, APK non reconstruit. Rapport : `hd-2026-09-30/RAPPORT-VERT260-44.md` ;
outil rejouable : `evolution/media/tools/prototype-hd-44-vert260.py` ; page de test téléphone :
`hd-2026-09-30/index.html` (diagnostic automatique de lecture de l'animation WebP incluse).

Ce qui a été fait, dans l'ordre imposé (retouche **avant** export) :

- **Le vert des masters est dilué, pas seulement pastel** : cœur 10 386 px pour un périmètre de 787 px,
  soit une transition de ~13 px avec la peau (phase 2 ~8 px) — c'est la cause de l'effet « feuille collée ».
  Une seule zone verte par phase (bras) : aucune plante parasite. Contour resserré (rampe 0,03–0,17) :
  transition 13,0 → 8,5 px et 8,2 → 5,5 px. Silhouette = plus grande composante connexe, trous internes comblés.
- **Famille 260** par correspondance de percentiles (p5/p50/p95) sur saturation et valeur, teinte recentrée
  à 50 % de l'écart, calculée sur les **deux phases ensemble**. Aucun pixel uniformisé.
  Saturation 0,677/0,749 → **0,894/0,925** (référence 260 = 0,914) ; valeur 0,702/0,733 → 0,612/0,651
  (260 = 0,616) ; teinte 85,6°/88,1° (260 = 86,3°). **11 137 nuances conservées**, teinte dominante 0,3 %
  (le GIF 260 mesuré n'a que 6 teintes avec 31 % sur la dominante : c'est un témoin appauvri, pas la cible à copier).
- **0 pixel modifié hors zone verte** (1 045 768 / 1 052 290 pixels vérifiés, écart max 0).
- **Exports décodés** (388×660, 2 images, 2×500 ms) : WebP q90 **98 ko** (err. 1,85 hors vert / 1,88 dans le vert,
  PSNR 41,3 dB) · q92 115 ko (1,61 / 1,68, 42,2 dB) · q85 73 ko (2,23 / 2,29, 39,5 dB) · sans perte 612 ko ·
  GIF de repli 403 ko (moucheté dans le vert, limite des 256 couleurs). Livré actuel pour mémoire : 198 ko,
  10,7 / 24,0, PSNR 21,7 dB.
- **Poids projeté des 389** : ≈ **37 Mo** en WebP q90 (44 Mo en q92) contre 72 Mo aujourd'hui.
- Cadrage inchangé (fenêtre 259/264 identique au livré), ni recadrage, ni miroir, ni rotation ; geste/prise
  issus du master lot69 validé. `sha256` des GIF livrés 44/45 consignés (inchangés).

**Décision encore attendue** : (1) le WebP s'anime-t-il sur le téléphone (diagnostic de la page de test) ?
(2) q92 / **q90** / q85 ? (3) le vert est-il validé tel quel ? Ensuite seulement, reprise des 389 numéro par
numéro, avec accord explicite avant tout remplacement de GIF livré.

Branche de travail : `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`.

---
# PROTOTYPE HD n°44 — MESURÉ LE 30/09/2026 — BRANCHE `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`

**Priorité netteté : le prototype demandé (n°44, deux phases) est construit et mesuré.** Aucune recoloration,
aucun GIF livré remplacé, aucun appel de génération d'image, APK intact. Rapport complet :
`evolution/media/refonte-photo/hd-2026-09-30/RAPPORT-PROTOTYPE-HD-44.md` ; outil rejouable :
`evolution/media/tools/prototype-hd-44.py` ; page de test à ouvrir sur le téléphone :
`evolution/media/refonte-photo/hd-2026-09-30/index.html`.

Faits mesurés (aucun n'invente une validation) :

- Les masters 800×1333 du lot69 (`propositions/lot69/44-phase1-supinated.png`, `44-phase2-supinated.png`)
  **ne sont pas du 800 natif** : ils portent 1,7 à 1,9× plus de détail qu'un agrandissement du 264 déjà
  utilisé dans les GIF (contrôle par grille de compression) → **définition utile ≈ 450–550 px de haut**.
  Ils correspondent bien au geste livré : même pose, même prise, même cadrage (décalage de fabrication
  −1/+2 px phase1, 0/−1 px phase2 ; aucune main, aucun membre déplacé localement).
- Le GIF livré 44/45 (259×440, 198 ko, 2×500 ms) est agrandi ×2 à ×3,4 par l'application
  (`.movement-visual { height:300px }` dans `src/styles.css`) : c'est la cause mécanique du « pixellisé ».
- À définition égale, l'écart du fichier livré contre le maître est de **10,7/255 hors vert et 24/255 dans
  le vert** (PSNR 21,7 dB) ; un export rejoué depuis le maître à 440 px tombe à **1,9 et 9,7** (PSNR 38,2 dB).
  Une grande part du mauvais rendu vient donc de la chaîne de fabrication, pas du format.
- L'erreur du GIF se concentre dans le vert (≈10/255 contre ≈1,9 ailleurs) : le plafond de 256 couleurs
  frappe exactement la zone regardée.
- **Le tramage Pillow ne change rien** (Floyd–Steinberg = aucun : fichiers bit à bit identiques ; palettes
  adaptive/MEDIANCUT/FASTOCTREE/« pipeline actuel » confondues). Palette partagée entre les 2 phases :
  −11 ko à qualité égale. WebP animé 880 px : **140 ko et erreur 2,2** contre GIF 682 ko / 10,0.
  APNG : sans perte mais ≈2× le poids du GIF.
- Poids du projet si reprise des 389 : GIF 660 ≈ **160 Mo**, GIF 880 ≈ 265 Mo, WebP animé 660 ≈ **38 Mo**,
  aujourd'hui 72 Mo (391 GIF mesurés). Le GIF à définition utile est le scénario le plus lourd.
- Vert : maître 44 médiane [132,177,61] (fragmenté, relief) ; GIF livré [118,171,44] (5 teintes, part
  dominante 0,22 = plaque) ; référence 260 [112,182,12] (plus foncée/saturée). Retouche éventuelle à
  faire dans le PNG de travail **avant** export.

**Décision attendue avant toute reprise des 389** : définition (440 / **660 recommandé** / 880),
format (GIF conservé ou WebP animé après test réel dans la WebView — page de test fournie), et teinte du vert.
Aucun PDF de revue n'a été régénéré ce tour (`pdf-revue-331.py` non utilisé). Les 3 styles intégrés
(44/45/80) et les 26 corrections de geste restent en place, non retirés.

Branche de travail actuelle : `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`. Partout où les documents
ci-dessous citent `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap` comme branche active, lire la branche
actuelle ; `01a0e6c9` (head `3cbb3e5`) et `01a0e231` (`c685298`) restent les sources à récupérer,
à ne jamais écraser.

---
# PRIORITÉ — REPARTIR SUR UNE VRAIE QUALITÉ HD (28/09/2026)

**Série style389 SUSPENDUE pour problème de pixellisation.** Dernier retour utilisateur : « Ce sera aussi pixellisé que sur les photos ? C’est moche ». Demande suivante : consigne et passation pour un nouveau chat afin de repartir sur des GIF mieux définis.
Lire le nouveau bloc autonome `PASSATION-COPIER-COLLER.md`. Ne plus exécuter la suite des lots sur les GIF indexés existants sans prototype haute qualité approuvé.

## Diagnostic et méthode à changer

Les lots01–03 ont travaillé sur des crops générés plus grands puis les ont réduits et recomposés dans les GIF existants. Par exemple44/45 =259×440,48=264×440,80=684×768. La méthode verrouillait les pixels hors masque à l’identique et réservait seulement les indices de palette libres pour les nouvelles textures : parfois6–7 couleurs libres, et0 sur80. Ce verrouillage a préservé les gestes mais limité la qualité des dégradés et généré du tramage/moucheté. **Ne pas confondre cette fidélité pixel avec une bonne qualité d’image.**
Repartir de sources PNG/planches natives suffisamment définies, identifier le crop exact de chaque phase, travailler sans perte et exporter seulement à la fin. Le numéro et la prise validés restent les références. Ne pas inventer des détails de mains avec un agrandissement génératif ; pour80 repartir de `production/lot75/ecartes-halteres.png`, pas d’un essai rejeté. Le rendu biceps apprécié est une référence de style, pas une justification pour appliquer des fibres de biceps à tous les muscles.
La nouvelle référence de fidélité doit être la géométrie/prise du geste approuvé et les images sources de meilleure qualité. Si la nouvelle quantification modifie des nuances hors muscle, l’expliquer et comparer ; **ne pas continuer à sacrifier les gradients uniquement pour conserver une ancienne palette pauvre**. Ne jamais promettre « pixels identiques » si ce contrôle n’est plus vrai.

### Prototype requis avant série

1. n°44/45 recommandé : vérifier les sources PNG lot69 à c685298, leur vraie définition et leur correspondance avec le geste validé.
2. Retouche anatomique locale enPNG sans perte, deux phases, pas de recompression intermédiaire depuisGIF/JPEG.
3. Comparer exportsGIF (résolution native/adaptée, palette/tramage) à taille d’affichage réelle etzoom100%, poids/durées/nombre de phases mesurés. Montrer le GIF décodé, pas seulement la sourcePNG.
4. SiGIF reste insuffisant : comparer WebP animé/APNG, tester la compatibilité effective avec la WebView Android avant proposition d’adoption. Pas de changement de format de l’app sans accord.
5. Validation utilisateur explicite du prototype et du compromisqualité/poids/fluidité, puis seulement reprise389. Pas de reconstructionAPK à ce stade.

## État conservé, mais méthode suspendue

26 corrections de geste approuvées et intégrées. Style :3 intégrés(44/45/80),12 propositions lot03 non validées,48 à reprendre,373 non traités. La critique de qualité n’efface pas les anciens accords de gestes et n’autorise pas un retour automatique aux versions précédentes. Aucun fichier média modifié lors de cette passation.
Teinte260 et périmètre389 déjà confirmés. Les anciens compteurs et validations ci-dessous sont historiques ; aucune approbation de nettetéHD acquise.
Les docs, registres et candidatPDF sont dans le dépôt ; `.cache`/modèles/dépendances/sources miroir ne sont pas persistants. Base complète historiquec685298 + corrections de la branchecourante ; ne pas écraser les secondes avec la première.

---
## HISTORIQUE — ne pas exécuter les anciens « prochaine action » contre la priorité HD

# STYLE389 — lot03 (28/09/2026) :12 propositions supplémentaires

Demande : « Termine la couleur sur les gifs ». **Travail NON terminé sur389.**
**3 intégrés (44/45/80),12 propositions,1 à reprendre(48),373 non traités.** Les propositions lot03 :19,85,214,274,275,276,223,305,316,337,338,339. PDF5 pages `style-260/lot03/STYLE-260-lot03.pdf`. Copies conformes vérifiées par SHA ; toutes les phases contrôlées et masquées localement, aucun pixel hors masque changé après GIF.
10 générations de crops locaux réussies dans ce tour, plafond atteint. Un essai de montage48 sans génération a échoué au contrôle du raccord coussin ; exclu du PDF, ne pas intégrer.
Audit automatisé des389 avec segmentation humaine disponible dans `style-260/audit-corps/audit-389.json`. **Exploratoire uniquement**, ne remplace pas le contrôle humain : nombreux cas de piscine/occlusion ambigus. Aucun recoloriage automatique généralisé effectué.
Sources389 récupérées dans `.cache/style-global/source` (c685298 +26 corrections présentes +3 styles intégrés). Poids ONNX non livrés dans l’app, cache seulement. SHA des livrés inchangés.
Prochaine action : revue lot03, reprendre48 proprement, poursuivre les373 non traités. Pas de nouvelle demande de périmètre/teinte : confirmé389, référence260 et démarcation anatomique. APK inchangé.

---

# STYLE 389 — lot02 VALIDÉ ET INTÉGRÉ (28/09/2026)

L’utilisateur répond **« Validé »** au PDF montrant **44/45 et80 uniquement**. Ces trois GIF ont été copiés octet pour octet dans les médias livrés. Accord enregistré, manifeste/map et suivi actualisés. Les phases, durées, dimensions et pixels hors masque restent identiques aux gestes approuvés. Aucun nouvel appel de génération.
**3/389 styles validés et intégrés ; 386 restants : n°48 à reprendre +385 non traités.** Ne pas intégrer48 : il n’était pas dans le comparatif validé.
PDF principal mis à jour uniquement pour44/45/80 (pages16 et28), 131 pages conservées ; les129 autres images de pages sont identiques. Index actualisé pour les trois numéros. Numérotation, état et plan inchangés. **APK non reconstruit, application installée inchangée.**
Rapport : `style-260/lot02/INTEGRATION-VALIDEE.json`. Comparatif validé : `style-260/lot02/STYLE-260-lot02-VALIDE.pdf`. Progression : `style-260/progression-389.json`.
Prochaine action : reprendre raccord muscle/coussin48, puis19 et85. Teinte260 et portée389 déjà confirmées. Ne pas redemander. Avant construction : rappel metcon/piscine fractionnée/Aqua Tabata Émilie ; signature clé utilisateur seulement. IA en dernier.

---

# STYLE 389 — lot02 (28/09/2026), priorité actuelle

L’utilisateur a répondu **« super vas-y »** au premier essai de relief : direction de style acceptée, poursuivre les 389. Ne pas redemander teinte/périmètre.
Lot02 : **3 GIF complets proposés (44/45/80), 1 à reprendre (48), 385 non traités, 0 intégré**. N°48 exclu du PDF présenté : raccord muscle/coussin insuffisant. PDF de contrôle `style-260/lot02/STYLE-260-lot02.pdf` : 2 pages.
Six générations tentées (5 crops + 1 échec), uniquement muscles locaux. Sources/masques et script reproductible conservés. Contrôle sur GIF décodés : **0 pixel modifié hors masque**, donc mains/visages/gestes préservés ; n°80 approuvé inchangé dans les livrés. Aucun APK ni manifeste modifié.
Suivi exhaustif : `style-260/progression-389.json`. Reste : corriger48 puis19/85 et avancer par lots sur les autres. Le style n’est pas terminé sur les389. Les images générées restent des propositions, pas des validations utilisateur automatiques.
Reprise technique de session : HEAD local revenu à ddd1fb9 avec fichiers présents ; fetch branche imposée puis reset MIXED vers323773e (aucun fichier de travail écrasé). Dépendances réinstallées dans .cache.

---

# STYLE — périmètre confirmé : les 389 visuels (28/09/2026)

L’utilisateur répond **« tout, les 389 »** : uniformiser le vert comme le n°260, avec muscle nettement délimité et relief, pas une plaque. Ne plus redemander le choix ni le périmètre.
Audit **technique** 389/389 terminé (SHA, décodage, dimensions, phases/durées), PAS une validation anatomique. Rapport `style-260/audit-technique-389.json`.
Premier essai de teinte seule 44/45 insuffisant : effet plaque conservé, pas de généralisation. Un essai de texture musculaire généré localement pour 44/45 phase1 puis composité uniquement dans le masque vert ; pixels hors masque inchangés. Anatomie et teinte restent à contrôler ; phase2 pas traitée. Aperçu `style-260/lot01/STYLE-389-premier-essai.pdf`.
**0/389 GIF style finalisés, 0 intégré.** N°80 et tous les gestes validés sont intacts. Un appel génération dans ce tour. Pas de recoloration des plantes.
Suite : valider une méthode anatomique locale, traiter par lots avec contrôle des DEUX phases (4 pour Zottman), notamment 19/44/45/48/80/85. Ne pas annoncer 389 corrigés sur la foi d’une mesure de vert ou d’un audit technique. Étape3 cardio/piscine à poursuivre après ce chantier demandé. APK inchangé.

---

# Décision style — 28/09/2026 (prioritaire)

L’utilisateur choisit **uniformiser le vert comme le n°260**, avec **démarcation anatomique nette du muscle, pas une couche verte posée**. Choix de teinte résolu ; ne plus le redemander. Préserver relief/texture/faisceaux et tous les gestes validés, notamment les mains du n°80.
**Seul le périmètre reste à confirmer : les 26 corrections ou l’ensemble des 389 visuels actuels (331 historiques + 58 ajouts).** Aucune recoloration engagée à ce stade ; aucune validation du futur rendu déduite. Les 26 corrections de geste restent approuvées et intégrées aux médias. Avant intégration du style, contrôler notamment 19/44/45/48/80/85, plantes exclues.

---

# ÉTAT PRIORITAIRE — 28/09/2026 : 26/26 CORRECTIONS VALIDÉES ET INTÉGRÉES AUX MÉDIAS

Branche : `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`.
Après validation spécifique du n°80, l’utilisateur répond « oui validé » à la demande de validation des 25 autres propositions. Accord enregistré et intégration effectuée, sans recoloration ni nouvelle génération.
- n°80 : GIF approuvé inchangé, SHA e8e5b756e84e0ed7b47fe1aba80c156bffcef9317780593562489b2dd27d165b.
- n°26,44,45 : dernières révisions lot69. Autres : propositions référencées dans le registre, SHA contrôlés depuis c685298.
- 26/26 approuvés ; zéro point de ce lot en attente. `aRefaire` mis à jour ; autres historiques conservés.
- 389 SHA de livrés contrôlés dans le miroir `.cache/integration80`. Manifeste/map, PDF principal (131 pages) et index (389 vignettes) actualisés. Numérotation inchangée. Le PDF montre désormais les 4 phases des Zottman 46/47/48.
- État, plan, prescriptions et fonctionnalités de l’app non modifiés. APK non reconstruit : l’application installée ne contient pas encore ces corrections.
- Le checkout ne contient que les 26 GIF corrigés ; autres sources et livrés disponibles à c685298, reconstruits dans le miroir pour vérification. Ne pas lancer une construction directement depuis cette arborescence partielle.

**Prochaine étape : étape 3 — réglage du niveau cardio/piscine pour les deux profils.** Avant de commencer, obtenir le choix du vert : conserver l’actuel (154,205,50), uniformiser au n°260 (~117,189,18), ou décider plus tard. La validation des images n’est PAS une réponse à ce choix. Si uniformisation demandée, contrôler notamment 19/44/45/48/80/85 ; la portée globale reste à préciser.
Avant construction d’application : rappeler les ajouts metcon + piscine nage fractionnée et/ou Aqua Tabata pour Émilie et confirmer le périmètre. Signature avec clé utilisateur uniquement, IA conversationnelle en dernier.
Rapport : `evolution/media/refonte-photo/verification/INTEGRATION-25-2026-09-28.json`.

---
## Historique (anciens compteurs et refus remplacés par l’accord ci-dessus)

# ÉTAT PRIORITAIRE — 28/09/2026 : n°80 VALIDÉ ET INTÉGRÉ AUX MÉDIAS

Branche active : `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`.
Accord explicite utilisateur sur `review/80-photo-reference-directe.gif` (commit e85296d).
Copie octet pour octet dans `gif/homme/ecartes-halteres-homme.gif` ; manifeste et map actualisés, PDF principal et index régénérés.
**1/26 approuvé, 25 en attente.** Aucun autre GIF modifié. APK non reconstruit, application installée inchangée.
Étape 2 reste ouverte ; ne pas valider les 25 autres par déduction. Avant étape 3 (réglages de niveau cardio/piscine des deux profils), demander le choix du vert : actuel (154,205,50), identique au n°260 (~117,189,18), ou décider plus tard. Aucune recoloration effectuée.
Avant construction : rappeler metcon + piscine fractionnée et/ou Aqua Tabata pour Émilie. Signature uniquement clé utilisateur ; IA en dernier.
Le checkout initial ne contenait pas l’arborescence evolution : les registres proviennent de c685298 ; les autres livrés sont contrôlés dans `.cache/integration80`, non importés en masse. Pour une construction complète, restaurer les sources de c685298 dans un espace de travail puis appliquer les corrections de cette branche.
Les paragraphes ci-dessous sont HISTORIQUES et leurs anciens compteurs/refus du n°80 sont dépassés par cet accord.

---

# 🚩 PASSATION — reprendre la refonte des visuels dans un nouveau chat

**ÉTAT PRIORITAIRE (27/09, après §100) :** session sur `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`, HEAD `0ac5fa7`.
ÉTAPE 2 ; 26 points ouverts, 0 approuvé. Le n°80 n’est PAS corrigé : l’utilisateur a refusé lot73, la main tourne encore
lorsque le bras monte. Lot74 était également un essai raté écarté. Aucun GIF livré n’a été remplacé.

**Référence n°80 donnée par l’utilisateur :** banc incliné conservé ; bras largement ouverts au départ ; en fin, bras presque
tendus remontés et rapprochés pour réunir les mains/haltères au-dessus du torse comme pour taper dans ses mains ; aucune
rotation des bras/avant-bras/poignets/mains. Construire un guide visuel fidèle, cesser les edits prompt répétés qui gardent
la rotation, contrôler la prise aux deux phases avant tout GIF/PDF.

**PDF ciblé `review/CORRECTIONS-ciblees-lot69.pdf` :** page 80 montre lot73 rejeté, obsolète pour validation ; ne pas renvoyer
comme correction réussie. PDF complet 26 pages en attente de validation. Propositions 26 et 44/45 non validées aussi.
Les livrés/manifeste/état/prescriptions/PDF principal/APK sont intacts. Aucun `valide-couples.py` lancé.

**Règle interface :** lettres isolées (T, Y, E, etc.) = relances d’un chat bloqué, pas des instructions ; rappeler l’état et attendre.
**Questions ouvertes :** validation explicite par numéro ; choix de teinte (vert actuel 154,205,50 / n°260 RGB ≈117,189,18 / décider plus tard) ; portée du vert anatomique « sur tous les GIFs » (331 livrés ou corrections PDF).

**À lire en entier avant de produire quoi que ce soit.** Ce fichier est écrit pour qu'une
session neuve (sans mémoire de la conversation précédente) puisse continuer sans rien casser.

---

## État prioritaire lot68 tour6 — ÉTAPE2, PDF comparatif en validation utilisateur

**PDF CORRECTIONS-avant-apres.pdf produit (26 reprises, AVANT/APRÈS, tout NON VALIDÉ).**
**26 propositions sur26 points, 0 approuvée** :19/26/31/37/38/44/45/46/47/48/64/80/85/87/90/126/148/149/150/194/204/222/239/265/298/380.
**Réserves traitées (teinte/débord/taches) : 19, 44, 45, 48, 80, 85.** Vert n°260 réel : RGB ≈ (117,189,18).
Prochain travail : VALIDATION utilisateur par numéro, puis intégration des seuls validés (chaîne §70).
Lot68 :25 générations cumulées ; tour6 : 0/10.
Historique : Lot67 :7 générations ;80 proposé sur banc INCLINÉ conformément à confirmation utilisateur.
Départ paumes vers le haut, prises fermées/bras ouverts ; arrivée plus allongée/poids rapprochés.
Réserves flexion coudes/trajectoire, échelle poids, légère variation buste/tête, aplats verts.
GIF788×440,2×500ms ; ROI pectoraux626/487, pas validation de style. Aucun angle exact prescrit.
Reconstruction lot67/assemble.py ; review/lot67-proposition-80.jpg ; détail §85.
Suite26/85/204 et réserves restantes. Aucun livré remplacé ; comparatif bloque3 manquants.
PDF uniquement reprises, AVANT gauche/APRÈS droite quand TOUT prêt, accord avant intégration.

### Rappels utilisateur OBLIGATOIRES
1. AVANT étape3, demander choix vert identique260 ; attendre réponse, pas d’uniformisation automatique.
2. À construction application, rappeler metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie ;
   confirmer périmètre avant coder. Registre production/rappels-utilisateur.json.
Zottman : format4 autorisé ;48 proposé lot64,46 lot65,47 lot66 ; aucune image approuvée.148 = Mountain climbers homme à3 jambes.

## 1. Où l'on en est (mesuré, pas estimé)

- Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`
- Branche de session Arena **obligatoire** : `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap` ; l'état du
  commit `8663b6e` a été récupéré depuis `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap`. Ne jamais pousser
  sur `main` ni créer une autre branche. Si l'espace revient à `d721868`, vérifier `git status`, récupérer
  la branche source avec `git fetch origin arena/01a0e12a-jarvis-fitness-yanis-emilie-ap`, puis restaurer son état
  (`git reset --hard FETCH_HEAD`) sans avoir de modifications locales à écraser ; pousser uniquement sur la
  branche de session Arena `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`. Mettre à jour les quatre fichiers
  de passation et le nom de branche de la page de titre de `tools/pdf-revue-331.py` si Arena impose une autre.
- Avancement : **331 / 331 animations validées — JALON : plus aucun exercice sans visuel** (`production/etat.json`, clé `chiffres`).
  Restent **0**. Toutes surfaces terminées (musculation 203, tabata sol 37,
  piscine guides 9, protocoles 40, aqua tabata 6, étirements 29, elliptique 5, échauffement 3).
  **Tabata au sol TERMINÉE (37/37), piscine guides TERMINÉE (9/9).** **Musculation TERMINÉE (203/203).**
  Terminés : **étirements 29 ✅, elliptique 5 ✅, échauffement 3 ✅**.
- **Relecture case par case TERMINÉE (26/09, relecture 26, §66)** : 331 / 331 couples relus
  (`verification/VERIFICATION-2026-09-25.md`). Sur l'ensemble : 10 gestes/cadrages faux trouvés
  parmi les livrés et tous refaits (dont, au lot 50 : torsion-allongee montrée assise,
  souleve-de-terre ordre inversé + angle, transition face/profil ; rowing-assis-etirement cases
  échangées par PIL). `a-refaire.json` VIDE.
  Style : **33** GIF ont une case sans vert lime sur le corps (`production/style-a-reprendre.json`),
  à reprendre dans un lot dédié sans toucher aux gestes, **sur décision explicite de l'utilisateur**.
- Index visuel numéroté : `review/index-general.jpg` (331 vignettes, régénéré à chaque lot).

## 2. Ce que l'utilisateur a demandé (et qui ne change pas)

Refaire **tous** les GIF animés de l'application à partir de la nouvelle photo, pour
**tous les domaines** (musculation, tabata au sol, aqua tabata, piscine, metcon piscine,
vélo elliptique, échauffement, étirement) : aucun oubli, aucun exercice sans visuel,
enchaînements propres et fluides, **mêmes visage et corps que la photo validée**
(homme = `planches/maitre-homme.png`, femme = `planches/maitre-femme.png`, visage A,
poitrine généreuse validée). L'athlète qui montre l'exercice est le propriétaire du
profil : Émilie → femme, Yanis → homme.

Contraintes permanentes : ne rien perdre de l'app 1.4.0 (209 exercices, 11 rubriques,
2 profils, étapes 1–7) ; **aucune image « famille C »** ; jamais de vélo ni d'elliptique
en récupération de piscine ; ne jamais réécrire une prescription pour justifier une
mauvaise image ; pas de rotation/miroir global ; une seule version finale livrée à la fin ;
`PASSATION.md` mis à jour et présenté à chaque étape ; **la clé de signature ne se publie
jamais** (l'utilisateur la recollera au moment de la livraison) ; IA conversationnelle en
dernier.

Le travail se fait par **lots de ≤ 10 images par tour** (plafond de l'outil de génération ;
un échec compte aussi). L'utilisateur écrit « suite » pour enchaîner.

## 3. Installation (l'espace de travail est réinitialisé souvent)

```bash
cd /home/user/JARVIS-Fitness-Yanis-Emilie.apk
git log --oneline -1                     # si HEAD != branche arena : récupérer
git fetch origin arena/01a0e12a-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD
python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install -q pillow numpy pymupdf
# chaîne APK (1 min, sans clé) :
node evolution/media/tools/payloads-148.mjs && python3 evolution/media/tools/overlay-331.py
python3 evolution/android/build-media-149.py --unsigned
```

Ne jamais supprimer ni renommer la racine du dépôt.

## 4. La chaîne de production

| Outil | Rôle |
|---|---|
| `evolution/media/tools/refonte-sheet.py` | planche 2 cases → GIF animé (découpe au séparateur clair, recalage du décor, même fenêtre, hauteur 440, 500 ms). Options `--athlete homme\|femme --out <dossier gif> --sheet <jpg de contrôle>` |
| `evolution/media/tools/verif-ids.py` | **garde-fou obligatoire** : refuse toute planche dont le nom n'est pas un identifiant réel de `production/plan.json`. À lancer **avant** la conversion |
| `evolution/media/tools/verif-gifs.py` | mesure les GIF livrés (2 images, 500 ms, 440 px, identifiant du plan, vert des deux cases, quasi-doubles, zone du vert) : `verification/verif-gifs.json` |
| `evolution/media/tools/feuilles-verif.py` | imprime les DEUX cases d'un GIF en pleine définition, 3 mouvements par feuille : l'outil de relecture humaine imposé |
| `evolution/media/tools/index-general.py` | régénère `review/index-general.jpg` (vignettes numérotées de tous les valides) |
| `evolution/media/tools/pdf-revue-331.py` | PDF de revue utilisateur, **numéros stables** (tri : surface du manifeste puis identifiant, athlète — ne pas changer) |
| `evolution/media/tools/maj-manifeste-331.py` | après tout GIF refait : re-mesure SHA/frames/taille, retrouve la planche source par correspondance d'image, met à jour `candidate/refonte-331-map.json` |
| `evolution/media/tools/payloads-148.mjs` (node) | extrait les 2 payloads du bundle ORIGINAL 1.4.8 → `.cache/payloads-148.json` (prérequis de l'overlay) |
| `evolution/media/tools/overlay-331.py` | web 1.4.8 + 331 GIF + hook `REFONTE_MEDIA` (athlète = profil actif) → `.cache/web-148` |
| `evolution/android/build-media-149.py` | `--unsigned` : APK 1.4.9 non signé + contrôles (sans clé) ; `--real` : signature v2+v3 avec l'identité restaurée → `downloads/` |
| `production/plan.json` | 343 lignes = **331 couples (mouvement × athlète)** ; 17 gestes existent chez les deux athlètes et demandent deux GIF |
| `production/prescriptions.json` | le geste exact lu dans l'APK livrée (source de tous les prompts) |
| `production/etat.json` | valides / restants / chiffres par surface |
| `production/a-refaire.json` | planches refusées avec motif + `reglesPrompt` + corrections utilisateur |
| `reference-app/*.gif` | GIF d'origine extraits de l'APK : **témoin à regarder** quand un nom est ambigu |
| `gif/homme/`, `gif/femme/` | les GIF livrés (`<slug>-homme.gif`, `<slug>-femme.gif`) |
| `review/*.jpg` | planches de contrôle montrées dans le chat |

Commande type d'un lot :

```bash
P=.cache/pyvenv/bin/python; R=evolution/media/refonte-photo
$P evolution/media/tools/verif-ids.py $R/planches/lotNN/*.png
$P evolution/media/tools/refonte-sheet.py --athlete homme --out $R/gif/homme \
   --sheet $R/review/lotNN-musculation-homme.jpg $R/planches/lotNN/*.png
```

## 5. Recette de prompt (elle a coûté cher, ne pas la réinventer)

> Edit the reference photo and produce a WIDE LANDSCAPE photographic demo sheet, 16:9,
> made of TWO panels of equal width side by side, separated by a thin light grey vertical
> line. The sheet reads like a book, from LEFT to RIGHT: the LEFT panel is the START of
> the movement, the RIGHT panel is the END. BOTH panels show the EXACT SAME MAN/WOMAN as
> the reference image: same face, same hair, same body, same clothes, same calm gym with a
> wooden floor, same lighting, and the SAME camera angle in both panels. … LEFT panel
> (start) … RIGHT panel (end), highlight <muscle> in lime green. Everything else keeps its
> natural colours. Photorealistic, natural skin texture, no text, no labels, no numbers, no
> arrows, no logo, no watermark.

## 6. Pièges déjà payés — à vérifier sur CHAQUE planche

1. **Prise en pronation** pour toute barre (mains **sur** la barre, paumes vers l'avant,
   jamais en supination dessous) — sauf cible qui dit supination/EZ.
2. **Poulie basse = câble horizontal** (rowing) ; **poulie haute = câble vertical**
   (tirage vertical). Écrire la position de la poulie en toutes lettres.
3. **Unilatéral** : écrire que l'autre bras/membre ne touche jamais l'engin, du début à la fin.
4. **Le nom cible décrit la machine**, pas le nom d'origine (ex. « rowing assis au cou »
   se dessine en **tirage vertical prise large**).
5. **Sens de lecture gauche→droite** : la case de gauche est le début. Vérifier qu'aucune
   planche n'est inversée.
6. **Le vert va sur le muscle cible uniquement** (ex. moyen fessier = côté de la hanche,
   pas la cuisse ; abduction = jambe **sur le côté**, kickback = jambe **en arrière**).
7. **Même cadrage entre les deux cases** (une case de face + une de dos = GIF qui saute).
8. **Myo-reps / mini-séries** : les deux cases sont presque identiques, le membre ne
   revient pas à la position de départ.
9. **Vérifier l'identifiant** avant d'écrire le prompt (`verif-ids.py`) : ne jamais dessiner
   pour un mouvement qui n'existe pas dans le plan.
10. **Lire les DEUX cases** d'une planche avant de la compter — jamais d'acceptation à l'œil
    sur une vignette. En cas de doute : recadrer et zoomer (`PIL`) plutôt que deviner.

## 7. À faire au démarrage du nouveau chat

0bis. **État lot 53 (26/09, plus récent)** : **385 valides / 4 restants**, câblage profil posé (§70) ; lot 52 : **375 valides / 14 restants** (lot 52 : 6/10 acceptées, 4 reprises
   motivées dans `a-refaire.json`, VERIFICATION §69) ; précédemment lot 51 : **363 valides / 26 restants** — demande utilisateur :
   visuels piscine/cardio pour YANIS (homme dans le bassin / sur l'elliptique). Lot 51 = 9/10 acceptées
   + 23 copies conformes (n° 332–363). Reste 15 générations (lot 52 piscine ×10 dont retry
   battements-au-bord ; lot 53 elliptique ×5) puis câblage `bt`/`If` (VERIFICATION §68). Outils :
   `valide-couples.py`, numérotation PDF figée `livraison/numerotation-pdf.json`. Feuille de route
   utilisateur en 6 étapes : voir `CE-QUI-COINCE.md` §0.
0. **État lot 50 (26/09)** : 331/331 valides, **331/331 relus**, `a-refaire.json` VIDE, style 33,
   PDF régénéré (mêmes numéros ; n° 169/180/327/330 = nouvelles images), APK 1.4.9 non signé
   reconstruit et contrôlé par `build-media-149.py --unsigned`. **Ordre des priorités au réveil :**
   (1) « coquille au n° X » → corriger, régénérer GIF, `maj-manifeste-331.py`, PDF mêmes numéros,
   planche de contrôle ; (2) clé collée dans `/tmp/rk.txt` → `pip install --target
   .cache/signing-tools jdk4py==17.0.9.2 cryptography==46.0.3`, `prepare-home-tools.py`,
   `signing-media.py restore --recovery-key-file /tmp/rk.txt`, `build-media-149.py --real`,
   un seul lien raw ; (3) sinon lot style seulement sur décision explicite.
1. **Aucune planche en attente** : `production/a-refaire.json` VIDE. **331/331 couples
   valides** après lot 45 (nage-douce résolue au 2ᵉ essai, nage-douce-respiration du 1ᵉʳ,
   10 copies conformes : 4 protocoles nage douce + 6 aqua tabata).
   **Lot 48 : PDF de revue livré** `livraison/REVUE-331-exercices.pdf` (112 pages, 331
   exercices numérotés 1→331, nom + athlète + frames 1-2 ; outil `tools/pdf-revue-331.py`) :
   l'utilisateur relit par NUMÉRO et signalera les coquilles. Lot 47 : APK 1.4.9 NON SIGNÉ
   construit et contrôlé (§65). Prochain tour = **livraison finale** : APK signé avec VOTRE
   cle (jamais publiée, à re-coller ; /tmp/rk.txt mode 0600), images pleine résolution,
   lien raw unique dans le chat ; en parallèle lot « style » (26 GIF) et relecture des
   21 couples restants. Bloc de reprise copiable : `PASSATION-COPIER-COLLER.md` (racine).
   Résolus au lot 35 : tirage-vertical-prise-neutre (poignées parallèles) et mollets-unilateraux
   (pied libre croisé en l'air). Résolus au lot 34 : ab-wheel et extensions-triceps-barre-ez.
   Résolus au lot 33 : developpe-incline-halteres et tirage-vertical-prise-large.
   Mountain climbers résolue au lot 31 (vue de FACE).
   Anciennement en attente : mountain-climbers, developpe-incline, tirage-vertical, ab-wheel, extensions-ez
   (vue de FACE, genou avant côté gauche puis droit de l'image) et developpe-incline-halteres
   (deux haltères séparés, quatre disques). Méthode gagnante sur refus
   asymétrique : éditer la case réussie pour fabriquer l'autre. L'audit réalisme est clos : ses 6 remplacements
   sont acceptés ; règles de grée obligatoires dans chaque prompt futur
   (`production/audit-realisme.json`).
2. Relecture : **terminée** (rien à relire). Lot « style » des 33 GIF sans vert sur une case
   (`production/style-a-reprendre.json`) : **seulement si l'utilisateur le décide**.
3. Continuer la musculation (48 restants), puis
   **tabata au sol (27)**, **piscine guides (9)**, **piscine protocoles (40)**,
   **aqua tabata (6)** — par lots de ≤ 10.
3. Après chaque lot : convertir, relire, mettre à jour `etat.json`, `a-refaire.json`,
   `PASSATION.md`, régénérer `review/index-general.jpg`, commit + push sur la branche arena,
   et présenter la planche de contrôle dans le chat avec un tableau numéroté.
4. Clé de signature : **ne jamais la fabriquer ni la publier**. L'utilisateur la fournira
   au moment de la construction de l'APK final.
5. **Build 1.4.9 (lot 47) : APK NON SIGNÉ construit et contrôlé.** Chaîne rejouable après
   reset : (a) extraire web 1.4.8 + payloads node (`new Function('return JSON.parse(`…`)')`
   sur les 2 littéraux `=JSON.parse(`…`)` du bundle — le parse Python échoue sur `\escape`),
   (b) `python3 evolution/media/tools/rebuild-assoc-331.py`,
   (c) `python3 evolution/media/tools/overlay-331.py` (copie 331 GIF + écrase 146 anciens
   chemins + patch payloads EXO_GIFS/imgs + hook `REFONTE_MEDIA` avec 6 ids duaux
   homme/femme sélectionnés par `activeProfile` de `jarvis_fitness_v3`),
   (d) repackage zip (remplacer `assets/public/**`, ajouter les 331 gifs, retirer les
   signatures META-INF) → `.cache/build/Yanis-Fitness-Evolution-1.4.9-non-signe.apk`,
   (e) contrôles node (syntaxe, payloads, 331 chemins GIF), (f) **signature avec la clé
   utilisateur** → `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`
   + lien raw unique. Détail : `verification/VERIFICATION-2026-09-25.md` §65.

## 8. Livraison finale (rappel)

Une **seule** version complète à la fin, APK signé, **images en pleine définition**, et un
**lien cliquable unique** dans le chat :
`https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/<commit>/<chemin>`

---

## Lot 4 — VALIDÉ le 02/10/2026 (n°131, 133, 114, 23) — TOUJOURS NON INTÉGRÉ

Validé numéro par numéro (« 131 OK », « 133 OK », « 114 OK », « 23 OK »), **sans** demande d'égalisation
de phase ni de resserrage de contour. Empreintes et mesures :
**`hd-2026-09-30/VALIDATION-LOT4-2026-10-02.json`** ; détail : `lot4/CONTROLES.json`.

| N° | Exercice | Export | WebP | PSNR | GIF repli | Saturation avant → après (réf. 0,914) | Contour |
|---|---|---|---|---|---|---|---|
| 131 | leg curl allongé | 573×660 | 94 ko | 42,32 dB | 389 ko | 0,855 → 0,901 · 0,884 → 0,919 | 5,6 / 3,1 px |
| 133 | leg curl pieds fléchis | 579×660 | 92 ko | 42,45 dB | 405 ko | 0,964 → 0,960 · 0,652 → 0,828 | 6,7 / 6,2 px |
| 114 | gainage planche | 588×660 | 87 ko | 42,68 dB | 381 ko | 0,946 → 0,921 · 0,944 → 0,918 | 6,4 / 6,1 px |
| 23 | circuit abdominaux (femme) | 585×660 | 64 ko | 43,53 dB | 375 ko | 0,718 → 0,880 · 0,776 → 0,902 | 9,8 / 11,8 px |

**Contrôle clé** : **0 pixel modifié hors zone verte** sur les 8 phases.

**Points signalés puis validés tels quels** : le n°133 garde sa phase 2 à 0,828 (ombrage entre phases) ;
le n°23 a un contour nettement plus doux (9,8 et 11,8 px). L'utilisateur a accepté les deux.

---

## ⚠️ DÉCISION DE PLANNING — 02/10/2026 : les numéros PISCINE ne sont plus réservés

Les numéros piscine **entrent dans la file comme les autres**, au lieu d'attendre le chantier
cardio/piscine. Concrètement : 364, 365, 366, 340, 341, 342, 376, 377, 379, 347 côté « homme »
(erreur d'alignement 2,8 à 3,4/255, les meilleures du lot restant) et 208, 217, 247 côté « femme ».
Rappel : la segmentation automatique est **incertaine en piscine** (occlusions, éclaboussures) —
le repérage visuel de la zone verte y est encore plus indispensable qu'ailleurs.

---

## 🧰 Réinitialisation du bac à sable — procédure éprouvée (2 réinitialisations le 02/10/2026)

Ce qui disparaît : `.cache/` (venv + sources extraites), `tri/` (page de tri, ignorée par git),
les **réfs d'archive** `base/*`, le serveur du port 8080, et parfois **tout l'arbre de travail**
(retour au clone de `main`). Ce qui survit : **tout ce qui est poussé sur la branche**.

Reprise, dans cet ordre :
1. `git fetch origin arena/01a0fae1-jarvis-fitness-yanis-emilie-ap`
2. si l'arbre est revenu à `main` : `git merge --ff-only FETCH_HEAD` (avance rapide, **rien d'écrasé**)
   — ne jamais `reset --hard` ;
3. `bash evolution/media/tools/preparer-session.sh` → venv, réfs `base/lots-complets` (c685298),
   `base/passation` (3c163a6), `base/gif-livres` (3cbb3e5) ;
4. relancer le serveur : `python3 evolution/media/tools/serve-validation.py 8080` ;
5. refabriquer la page de tri si besoin : `planche-tri.py <numéros> "titre"`.

**Conséquence pratique** : les pages de validation se consultent **pendant le tour**, pas après.

## Regroupement par planche — les numéros qui partagent une retouche

Mesure faite sur les 54 candidats restants au 02/10/2026 : **54 numéros = 46 retouches distinctes seulement**, parce que plusieurs numéros partagent la même planche ET les mêmes fenêtres. Groupes de 2 et plus (une seule retouche couvre tout le groupe) :

    [350, 351, 352, 353, 354]  <- planches/lot51/marche-aquatique.png
    [337, 338, 339]            <- planches/lot51/ciseaux-mains-au-bord.png
    [370, 371, 372]            <- planches/lot51/nage-statique-a-l-elastique.png

Les 43 autres numéros sont isolés (une retouche chacun). S'y ajoutent les groupes déjà traités : [364, 365, 366] en deux lots, [340, 341, 342] et [376, 377, 378, 379].

Conséquence pratique : le **lot 9 (350 à 353) est sorti identique à l'octet près au n°347 validé au lot 8** (sha256 `2c42f5b87df21152…`). Le n°354 suivra avec le même fichier. Quand un lot tombe sur un groupe déjà validé, il n'y a rien de nouveau à juger : le dire clairement plutôt que de faire revalider la même image.

## .gitignore ajoute (02/10/2026)

Le depot n'avait pas de `.gitignore`. Lors d'une purge, un `git add -A` a commite tout le venv `.cache/pyvenv` (~40 Mo). Un `.gitignore` a ete ajoute (commit `b2a7966`) couvrant `.cache/`, `evolution/media/refonte-photo/hd-2026-09-30/tri/` et `__pycache__/`. Si l'arbre local diverge apres une purge avec un commit qui ne contient que le venv, l'annuler : verifier d'abord `git show --name-only <sha> | grep -v '.cache/pyvenv'` (s'il ne reste que la ligne d'en-tete, il n'y a aucun travail reel dedans), puis `git reset --hard FETCH_HEAD`.
