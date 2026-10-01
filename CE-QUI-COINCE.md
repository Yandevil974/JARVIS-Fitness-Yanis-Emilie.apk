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

## 3bis. Lot 2 PROPOSÉ le 01/10/2026 (n°11, 12, 30, 42) — RIEN D'INTÉGRÉ

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

# 🚧 Ce qui coince — état prioritaire au 27 septembre 2026 — Étape 2 : n°80 toujours non corrigé

## 🚩 Situation actuelle — après refus utilisateur du lot73 (§100)

L’utilisateur refuse le n°80 : la main tourne encore quand le bras monte. Lot74 a également échoué et a été écarté.
**Aucune correction n’est validée pour le n°80.** Cible exacte : départ bras ouverts ; arrivée bras presque tendus levés et rapprochés
pour réunir les mains/haltères au-dessus du torse comme pour taper dans ses mains, sans rotation bras/poignets/mains ; garder le
banc incliné. Ne pas présenter lot73 comme corrigé. La page 80 du PDF ciblé est obsolète pour validation ; ne pas intégrer.
Prochaine méthode : guide de pose fidèle à la photo utilisateur puis lecture pleine définition de l’orientation aux deux phases.
Les GIF livrés restent intacts. Détails §100 et registre des retours.


**RÈGLE (27/09, instruction utilisateur) : les lettres isolées (T, Y, E, etc.) sont des relances
d'un CHAT BLOQUÉ côté interface — PAS des instructions. À réception d'une lettre : NE RIEN FAIRE
(aucun travail, aucun appel, aucun compteur), rappeler l'état en cours et attendre le vrai message.**
**Questions en attente (widget ignoré par l'interface, reposées en texte simple) :**
(1) Validation : « les 26 » ou liste de numéros « ok » (ex. « ok 19, 26, 31 ») ou « je relis le PDF ».
(2) Vert : garder (154,205,50) ou uniformiser sur le n°260 (117,189,18) ou décider plus tard.

## 🚩 Lot68 tour6 (27/09/2026) — PDF comparatif PRODUIT, en attente de votre validation

**« E » = lettre isolée, aucune validation déduite. 0/10 appels.**
**PDF PRODUIT : `evolution/media/refonte-photo/review/CORRECTIONS-avant-apres.pdf`** — 26 pages (une par
reprise), AVANT à gauche / APRÈS à droite, chaque page marquée PROPOSITION NON VALIDÉE avec votre retour et
les réserves restantes en pied de page. Généré par `tools/pdf-corrections-avant-apres.py` après vérification
des **26/26 SHAs** (44/45 re-mis à jour avant exécution).
**PROCHAINE ÉTAPE = VOTRE REVUE, PAR NUMÉRO.** Répondez par numéro : « n° X ok » / « n° X à refaire ».
Aucun numéro validé ne sera intégré sans une phrase explicite de votre part (une lettre isolée ne compte pas).
Après accord : intégration des seuls validés via la chaîne imposée (valide-couples.py → livrés → manifeste →
PDF principal → index), contrôles pleine définition avant chaque copie.
**Rappel en attente avant étape3 :** vert identique au n°260 ? (RGB réel 117,189,18 ; si « identique »,
re-passe PIL sur 19/44/45/48/80/85 avant intégration). Construction app : metcon + piscine nage fractionnée
et/ou Aqua Tabata pour Émilie, à confirmer avant de coder.
**26 propositions, 0 approuvée. Livrés inchangés.** **Branche : `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`.**

**Reprise 27/09 :** la branche de session imposée est `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`
(base récupérée depuis `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap` à `8663b6e`). Contrôles : PDF 26 pages ;
propositions/SHA 26/26 ; 0 approbation. Aucun appel de génération ni intégration. Réponses validation par numéro
et choix du vert toujours en attente (détails VERIFICATION §94).

**Retour utilisateur 27/09 — PDF à réviser :** n°26 phase 2 avec les deux mains derrière la tête ; n°44/45 en curl
normal supiné (pas marteau) ; n°80 phase 2 avec la même orientation des mains que la phase 1. Exigence de style globale :
vert clairement visible et suivant les formes anatomiques, jamais une simple plaque. **Portée du « tous les GIFs » à confirmer**
(ensemble 331 GIFs livrés, ou GIFs du PDF de corrections). 10 appels tentés dont un rejet de format ; ébauches lot69 contrôlées
par `verif-ids.py` et `refonte-sheet.py`, mais 26 et 80 ont encore des réserves Le n°80 lot69 a été refusé : prise tournée en fin ; lot70 également refusé ; lot71 était trop plié ; la photo jointe précise la cible : bras presque tendus rapprochés au-dessus du torse comme un clap, sans rotation. Lot73 reprend cette cible. Le PDF ciblé 3 pages (`review/CORRECTIONS-ciblees-lot69.pdf`) a été actualisé, toujours non validé ; le PDF complet 26 pages reste à refaire. Statut :
révisions demandées, 0 approbation, 0 intégration ; livrés intacts. Voir VERIFICATION §99 et `retours-utilisateur-2026-09-26.json`.

**N°80 : lot73 refusé explicitement** — l’utilisateur constate encore la main tournée quand le bras monte. Lot74 a aussi reproduit l’erreur et est
écarté. La photo fixe la cible (bras presque tendus réunis au-dessus du torse comme un clap, sans rotation bras/mains, banc incliné). Page80 du PDF
ciblé précédent obsolète pour validation ; reprendre avec guide visuel et contrôle de la prise avant tout PDF. Voir VERIFICATION §100. Livrés intacts.

Les 389 visuels du PDF restent publiés sans modification. Votre relecture a rouvert
**26 points de suivi** : aucune proposition n’est intégrée avant votre accord.
La relecture interne antérieure ne remplace pas votre validation.

> ⚠️ **Branche de session imposée par Arena : `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`.**
> Le contenu a été récupéré sans écraser de modifications depuis `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap`
> au commit `8663b6e`. Tous les changements de cette session restent sur la branche imposée ; jamais sur `main`.

## 0. Feuille de route donnée par l'utilisateur le 26/09 (dans cet ordre, par étapes)

1. **Piscine + cardio pour Yanis TERMINÉ** : 58 couples homme ajoutés et validés aux lots51–56,
   n°332–389. Câblage athlète=profil posé et testé. Dernier : elliptique-fractionné homme n°389.
2. **ÉTAPE ACTUELLE : vérification du PDF par l'utilisateur.** PDF 131 pages / 389 exercices,
   numéros stables. Retours reçus : 26 points ouverts (§1). Montrer les propositions AVANT validation.
   Ne pas commencer étape3 sans instruction ou fin de revue.
3. Pouvoir **augmenter le niveau** du programme cardio (piscine et autres) sur Émilie et Yanis
   (les protocoles ont déjà 3 niveaux `niveaux[]` ; la sélection est automatique dans `bh()` :
   à exposer à l'utilisateur — à concevoir après l'étape 1).
4. **Images pendant le chronomètre** (piscine, aqua, nage fractionnée, elliptique) : le timer `v5`
   n'affiche une image que pour piscine (`JarvisPoolMedia`) ; les étapes elliptique n'en ont aucune.
5. Construire l'application (1.4.9 → clé de signature utilisateur). AVANT cela, rappeler les ajouts
   metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie (§1).
6. IA conversationnelle (en dernier).

## 1. Retours PDF :26 points ouverts, accord utilisateur obligatoire

**26 propositions sur26 points, 0 approuvée.** PDF comparatif PRODUIT (26 pages, tout NON VALIDÉ) :
review/CORRECTIONS-avant-apres.pdf. Prochain travail : validation utilisateur par numéro, puis intégration
des seuls validés. Lot68 :25 générations cumulées ; tour6 : 0/10.
Historique : Lot67 :7 générations ;80 proposé sur banc INCLINÉ conformément à confirmation utilisateur.
Départ paumes vers le haut, prises fermées/bras ouverts ; arrivée plus allongée/poids rapprochés.
Réserves flexion coudes/trajectoire, échelle poids, légère variation buste/tête, aplats verts.
GIF788×440,2×500ms ; ROI pectoraux626/487, pas validation de style. Aucun angle exact prescrit.
Reconstruction lot67/assemble.py ; review/lot67-proposition-80.jpg ; détail §85.
Suite26/85/204 et réserves restantes. Aucun livré remplacé ; comparatif bloque3 manquants.
PDF uniquement reprises, AVANT gauche/APRÈS droite quand TOUT prêt, accord avant intégration.

### Rappels obligatoires
-AVANT étape3 : demander choix vert identique260, attendre réponse.
-À construction app : rappeler metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie,
  confirmer périmètre avant coder. Rappels-utilisateur.json reste non traité.

## 1b. Chantiers ouverts (pas bloquants, planifiés)

1. **Lot « style » : 33 GIF** ayant une case sans vert lime sur le corps
   (`production/style-a-reprendre.json` : 26 mesurés + 7 constatés à la lecture visuelle de ce
   tour). Le geste est juste partout ; reprise **uniquement sur votre décision** (§3.2).
2. **Relecture cumulative : TERMINÉE** (feuilles `verification/relecture-26-01..06.jpg`).
3. **Livraison finale** : terminer les étapes utilisateur §0 avant signature (§3.6).

## 2. Blocs techniques récurrents du générateur d'images (constats, pas des excuses)

1. **Barre sur le dos vs rack avant** : en vue de profil, une génération sur deux pose la
   barre devant le cou. Les vues **de face** et **de dos** réussissent (prouvé lot 20).
2. **Amplitude finale des tirages** : le modèle s'arrête à mi-course pour les rowings lourds féminins.
3. **Orientation gauche/droite** : les gestes unilatéraux se retournent parfois entre les
   deux cases ; il faut l'ancrer explicitement (« tête du même côté de l'image »).
4. **Têtes/pieds coupés** aux bords des cases : corrigé par la consigne de marges (lot 20).
5. **Modération d'image** : 1 blocage aléatoire sur 30 générations ; un échec compte dans le lot de 10.
6. **Vert absent d'une case** : le générateur ne colore souvent que la case « de travail » ;
   c'est l'origine du lot style (33).

## 3. Décisions que j'attends de vous (rien n'est fermé en silence)

1. **back-extension-45° prise snatch** (compté valide) : aucune barre n'apparaît, bras
   croisés. Le geste 45° est juste, le qualificatif « prise snatch » non représenté.
   → garder tel quel, ou refaire avec barre prise large sur les épaules ?
2. **Lot « style » des 33 GIF** dont une case n'a pas de vert lime : les régénérer
   (3 à 4 lots de 10) ou accepter l'état livré ?
3. **PDF de revue** (`livraison/REVUE-331-exercices.pdf`, 131 pages, 389 exercices) : numéros
   **figés** (1–331 inchangés ; Yanis piscine à partir du n° 332). Vos « coquille au n° X » sont
   traités en priorité 1 au prochain tour.
4. **Essai téléphone de la 1.4.8** : les groupes de constats restent OUVERTS jusqu'à votre
   retour ; aucun n'est clos sans vous.
5. **Souleve de terre — test 1RM** : un seul plateau par côté (charge peu crédible pour un 1RM),
   geste et ordre justes. → garder, ou refaire avec barre lourde ?
6. **Clé de signature** : absente de cet espace de travail, je ne la fabrique ni ne la
   publie. **Chaîne technique prête, mais feuille de route §0 encore en cours** : `evolution/android/build-media-149.py --unsigned`
   reconstruit et contrôle l'APK 1.4.9 non signé en 3 s (103,8 Mo, 331 GIF vérifiés dans le zip) ;
   le mode `--real` signe v2+v3 avec l'identité durable `150e3846…` restaurée depuis le
   chiffré du dépôt par **votre clé de récupération** (`/tmp/rk.txt`, mode 0600), dépose
   `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`.
   Prérequis outils (hors Git, à réinstaller après reset) : `jdk4py==17.0.9.2` +
   `cryptography==46.0.3` sous `.cache/signing-tools`, `prepare-home-tools.py` (apksigner épinglé).

## 4. Contraintes d'environnement (sans impact sur le contenu)

- L'espace de travail se réinitialise souvent : source = `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap`
  (état récupéré au commit 8663b6e) ; branche de session imposée =
  `arena/01a0e6c9-jarvis-fitness-yanis-emilie-ap`. Vérifier `git status`, fetch/reset la source si nécessaire,
  puis pousser uniquement sur la branche imposée ; recréer le venv.
  **Zéro perte** : tout est poussé à chaque tour.
- `.cache/` n'est pas persistant : web 1.4.8, payloads, APK non signé se régénèrent en
  moins d'une minute (`payloads-148.mjs` → `overlay-331.py` → `build-media-149.py --unsigned`).
- 2 GIF orphelins à la racine de `gif/` (premiers lots) : sans effet sur l'app, nettoyage
  prévu au câblage final.
