# VALIDATION UTILISATEUR + INVENTAIRE DES SOURCES (30/09/2026) — BRANCHE `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`

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
# BLOC À COPIER DANS LE NOUVEAU CHAT — 28/09/2026

Tu reprends JARVIS Fitness Yanis & Émilie, dépôt `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.

## PRIORITÉ ABSOLUE : QUALITÉ / NETTETÉ, SÉRIE ACTUELLE SUSPENDUE

L’utilisateur a demandé : « Ce sera aussi pixellisé que sur les photos ? C’est moche ».
Il veut maintenant repartir sur **des animations mieux définies**, pas continuer à recolorer les GIF basse résolution.
Il demande cette passation pour changer de chat. **Ne lance pas une nouvelle production en série avant un prototype net approuvé.**

### Consigne de travail

1. Repartir des **meilleures sources PNG/planches réellement disponibles**, contrôler leurs dimensions natives. Un agrandissement d’un GIF pixelisé n’est PAS une source HD.
2. Retoucher les muscles sur des images de travail sans perte, à la résolution native des sources, AVANT tout export GIF. Préserver les gestes, prises, visages, profils et matériel validés.
3. Vert : **comme le n°260**, avec **contour anatomique clairement délimité, relief, ombres et texture**, pas une plaque/feuille verte collée. Repère historique RGB ≈117,189,18, variable selon lumière et zone mesurée. Ne pas forcer tous les pixels à une couleur uniforme.
4. Faire un **prototype représentatif unique**, recommandé n°44 (et45, même démonstration), avec les deux phases. Montrer PNG de travail, GIF exporté réellement décodé, taille native et zoom100%. Ne pas présenter un PNG net comme preuve que le GIF est net.
5. Comparer des exports GIF de meilleure qualité (résolution adaptée à l’affichage réel, palette optimisée, tramage testé). **Le GIF reste limité à256 couleurs par palette** ; augmenter la définition ne supprime pas cette limite. Ne pas promettre un rendu photo sans défaut.
6. Si nécessaire, proposer une comparaison WebP animé/APNG avec le GIF, **sans changer le format de l’application sans accord et sans test de compatibilité dans sa WebView Android**. Vérifier l’affichage mobile réel, pas seulement un gros plan PDF.
7. Faire valider ce prototype et le compromis netteté/poids/fluidité. **Ensuite seulement**, reprendre les389 selon la méthode approuvée. Pas de modification massive, pas d’intégration automatique d’anciens essais.

### À préserver impérativement

- Les389 visuels : Yanis=homme, Émilie=femme, visageA et maîtres photo existants ; aucune familleC.
- Gestes déjà validés : ne pas les redessiner pour gagner en netteté. **N°80 : NE PLUS TOURNER LES MAINS.** Conserver exactement la prise et la pose finalement acceptées ; ne pas réimposer les anciens essais refusés ni un autre angle de coude.
- Départ à gauche, même caméra/banc/machine/orientation entre phases ; ni miroir ni rotation globale. Vérifier toutes les phases (4 pour Zottman).
- Aucun GIF livré remplacé sans accord explicite couvrant le numéro ; aucune prescription modifiée pour justifier une image. Proposition ≠ validation ≠ intégration.
- Maximum10 appels de génération par tour, échecs compris. Une lettre isolée (`Y`, `T`, `E`…) = relance technique : ne rien faire et attendre.
- APK signé seulement avec la clé utilisateur, jamais créée ni publiée. Préserver les2 profils et fonctions. IA conversationnelle en dernier.

## ÉTAT EXACT À LA PASSATION

- Les26 anciennes corrections de geste ont été validées et intégrées aux médias du projet.
- Pour le chantier vert/anatomie : **3 styles validés et intégrés :44,45,80** ; **12 propositions lot03 non validées** ; **48 à reprendre** ; **373 non traités**. Total389.
- Lot03 :19,85,214,274,275,276,223,305,316,337,338,339. Son PDF n’est PAS une livraison finale nette.
- **La plainte sur la pixellisation suspend la méthode actuelle**, y compris sa généralisation. Les validations de gestes ne sont pas annulées. Les3 styles intégrés ne sont pas retirés automatiquement : ils servent de témoins, mais ne prouvent pas que la qualité HD est acceptée.
- N°48 : débord/raccord entre muscle et coussin toujours insatisfaisant. Ne pas intégrer les essais rejetés.
- APK non reconstruit : l’application installée n’a pas reçu ces modifications.
- Deux audits sur389 existent (technique et segmentation automatique). **Ils ne certifient ni netteté ni anatomie.** Segmentation incertaine pour piscine/occlusions ; ne pas traiter aveuglément ses masques.

## FICHIERS À LIRE DANS CET ORDRE

1. `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md` : priorité récente en tête ; anciens états plus bas sont historiques.
2. `CE-QUI-COINCE.md`.
3. `evolution/media/refonte-photo/production/QUALITE-HD-2026-09-28.json`.
4. `evolution/media/refonte-photo/style-260/progression-389.json`.
5. `evolution/media/refonte-photo/production/retours-utilisateur-2026-09-26.json` et `rappels-utilisateur.json`.

## SOURCES ET RÉFÉRENCES UTILES

- **N°80, original net choisi** : `evolution/media/refonte-photo/production/lot75/ecartes-halteres.png` (planche1376×768, deux cases). Ne pas choisir les v2/v3/v4/v5 refusées.
- Témoin du geste80 accepté : `evolution/media/refonte-photo/review/80-photo-reference-directe.gif` (684×768,2 phases de1000ms). C’est un témoin de prise/pose, PAS le master pour une restauration HD.
- Photo annotée utilisateur : `20260928_113016.jpg` ; cercles jaunes=guide, pas à garder dans le rendu.
- Style anatomique apprécié : `style-260/lot01/biceps-texture-essai.png` et son comparatif. Cette image est **un crop de texture généré**, pas la preuve d’un corps entier enHD ni une anatomie médicalement certifiée.
- Styles44/45/80 intégrés : `style-260/lot02/INTEGRATION-VALIDEE.json` ; GIF proposés de ce lot copiés à l’identique dans les livrés.
- Le registre `livraison/manifeste-331.json` contient389 entrées ; `livraison/numerotation-pdf.json` fixe les numéros. **Ne pas renuméroter.**
- Anciens PNG de44/45 à rechercher au commit `c685298378773817460fb358bc605af7ce154b8b` : `evolution/media/refonte-photo/propositions/lot69/44-phase1-supinated.png`, `44-phase2-supinated.png`, `planches/curl-scott-haltere-neutre.png`. Contrôler leur taille et leur correspondance exacte avec le geste validé avant emploi.

## DÉPÔT / REPRISE TECHNIQUE

- Branche de la session quittée : `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`.
- Dernier commit de production avant cette passation : `9a28da734bf03846f831b37712707c69a646200c`. La passation est ajoutée ensuite sur la même branche : **récupérer sa tête distante**, pas seulement ce commit.
- Ancienne source complète : branche `arena/01a0e231-jarvis-fitness-yanis-emilie-ap`, commit `c685298378773817460fb358bc605af7ce154b8b`.
- **Le checkout de cette session est partiel pour `evolution`** :26 GIF canoniques présents, pas les389 sources complètes. Les autres ont été récupérés en cache pour les contrôles. Les caches, bibliothèques et poids de segmentation ne sont pas persistants.
- Si le nouveau chat repart de `ddd1fb9`, NE PAS considérer cette ancienne base comme l’état final. Vérifier `git status`, branche et commits, puis récupérer les sources sans écraser de modifications locales. **Pas de reset--hard aveugle.** Ne pas écraser les derniers GIF validés avec ceux de l’ancienne branche.
- Travailler et pousser uniquement sur **la branche imposée par Arena au nouveau chat**, même si son nom diffère. Ne jamais basculer sur/pousser vers `main`, ni supprimer/renommer la racine ou `.git`.
- Mettre à jour la branche courante dans les4 passations : `PASSATION.md`, `PASSATION-COPIER-COLLER.md`, `CE-QUI-COINCE.md`, `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md`, et dans le générateur de PDF si utilisé.

## APRÈS LA QUALITÉ DES VISUELS

Réglage du niveau cardio/piscine des2 profils → images pendant les chronos piscine/aqua/nage fractionnée/elliptique → construction de l’application → IA conversationnelle en dernier.
Avant construction, rappeler et confirmer les ajouts **metcon + piscine nage fractionnée et/ou Aqua Tabata pour Émilie**. Ne pas les oublier.

**Première action attendue du nouveau chat : examiner les sources haute définition et le pipeline d’export, puis préparer un seul prototype net. Ne pas repartir sur le lot de recoloration des anciens GIF.**
