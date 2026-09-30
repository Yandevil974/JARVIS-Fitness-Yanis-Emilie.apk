# Prototype HD n°44 — ce qui a été mesuré le 30/09/2026 (aucun GIF livré modifié)

Branche : `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap`.
Objet : la série « vert anatomique » (style 260) est **suspendue** à cause de la pixellisation signalée par l'utilisateur.
Ce prototype ne recolore rien : il mesure ce que valent les sources réellement disponibles et ce que chaque
réglage d'export change dans un fichier **réellement livrable**. Décision attendue : le compromis
netteté / poids / fluidité, **avant** toute reprise des 389.

Dossier : `evolution/media/refonte-photo/hd-2026-09-30/prototype-44/`
Outil rejouable : `evolution/media/tools/prototype-hd-44.py` (0 appel de génération d'image, 0 recoloration).

---

## 1. Les sources du n°44 (geste validé) et leur vraie définition

| Fichier | Taille | Provenance |
|---|---|---|
| `sources/44-phase1-supinated-800x1333.png` | 800×1333 | commit `c685298`, `propositions/lot69` |
| `sources/44-phase2-supinated-800x1333.png` | 800×1333 | commit `c685298`, `propositions/lot69` |
| `sources/44-livre-actuel-259x440.gif` | 259×440, 2 phases de 500 ms | branche `01a0e6c9`, `gif/homme` — **témoin, non modifié** |
| `sources/260-reference-elliptique-fractionne-femme-373x440.gif` | 373×440, 2×500 ms | référence de teinte n°260 |

Contrôles faits sur ces masters :

- **Ce ne sont pas des images 800×1333 natives.** Mesure d'énergie de détail au-dessus d'une grille de
  compression : le master contient **1,7 à 1,9 fois** plus de détail qu'un simple agrandissement du
  264×440 déjà utilisé (grille 660 px : 1,51 contre 0,80 ; grille 880 : 1,03 contre 0,55).
  Autrement dit : **définition utile ≈ 450–550 px de haut**, pas 1333. Promettre du « vrai HD 800 » serait faux.
- Le master **correspond au geste livré** : même pose, même prise, même cadrage, léger décalage de fabrication
  (−1 / +2 px en phase 1, 0 / −1 px en phase 2). Contrôle par régions (main, disques, visage, coude,
  avant-bras, coussin, fond) : aucun déplacement local, aucun membre tourné. Écart moyen hors vert
  entre le GIF livré et le master ramené à 259×440 : **10,7 / 255** (PSNR 21,7 dB) — c'est le prix des
  réductions et re-quantifications successives, pas un autre geste.
- Le **vert** du master est anatomique (médiane 132,177,61 ; teintes très dispersées, part de la teinte
  dominante 0,002) alors que le **GIF livré est une plaque** (médiane 118,171,44 ; 5 teintes seulement,
  part dominante 0,218, avec moucheté noir visible). La référence 260 (112,182,12) est **plus foncée en bleu
  et plus saturée** que les deux.
  → Si l'utilisateur valide, la retouche verte se fera **dans le PNG** (médiane de travail ≈ 800×1333,
  définition utile ≈ 2× l'actuelle) **avant** export, jamais après.

## 2. Ce que l'application affiche réellement (contrainte de netteté)

| Contexte | Hauteur CSS | Défini à | Calcul |
|---|---|---|---|
| Carte d'exercice (`.movement-visual`) | **300 px** | `styles.css` l.2644 | — |
| Vignette de séance (`.movement.small`) | 155 px | l.2689 | — |
| Écran d'exercice (`.exercise-stage`) | 300 → 365 px (immersif) | l.3748 / 8044 | — |
| Détail d'exercice | 315 px | l.11861 | — |

Conséquence : le GIF livré (259×440) est **agrandi ×2,05 à ×3,39** pour remplir 300 px CSS
(et il faut 900 px réels sur un écran DPR3 pour que ce soit net). C'est la cause mécanique du
« c'est pixellisé ».

## 3. Ce que chaque export change (fichiers réellement décodés, mesurés)

Erreur = écart moyen /255 contre l'image de travail ; « vert » = dans le masque musculaire.

| Fichier | Poids | err. hors vert | err. dans le vert | PSNR |
|---|---|---|---|---|
| **Livré aujourd'hui** 259×440 (aligné) | 198 ko | 10,70 | 23,96 | 21,7 dB |
| GIF 264×440 (pipeline actuel) | 202 ko | 1,86 | 9,70 | 38,2 dB |
| GIF 396×660 | 412 ko | 1,92 | 10,24 | 37,8 dB |
| GIF 528×880 | **682 ko** | 1,92 | 9,97 | 37,9 dB |
| GIF 792×1320 (plus produit par l'outil) | 1 388 ko | 1,94 | 9,89 | 37,8 dB |
| GIF 396×660 palette partagée 2 phases | 401 ko | 1,92 | 10,24 | 37,8 dB |
| GIF 396×660 palette FASTOCTREE | 258 ko | 2,80 | 4,59 | 37,4 dB |
| **WebP animé** 396×660 q90 | **99 ko** | 1,85 | 2,62 | 41,4 dB |
| **WebP animé** 528×880 q90 | **140 ko** | 1,66 | 2,24 | 42,3 dB |
| WebP animé 528×880 q80 | 82 ko | 2,30 | 3,12 | 39,3 dB |
| APNG 396×660 (sans perte) | 800 ko | 0,00 | 0,00 | sans perte |
| APNG 528×880 (sans perte) | 1 300 ko | 0,00 | 0,00 | sans perte |

Enseignements :

1. **Passer du fichier livré au master à définition égale divise l'erreur par ~6** (10,70 → 1,86 hors vert,
   23,96 → 9,70 dans le vert). Une bonne partie du « moche » vient de la chaîne de fabrication, pas du format.
2. **L'erreur du GIF se concentre dans le vert** : ≈ 10/255 dans le muscle contre ≈ 1,9/255 ailleurs.
   Le plafond de 256 couleurs frappe précisément la zone que l'utilisateur regarde.
3. **Le tramage Pillow ne change rien** ici : Floyd–Steinberg et « aucun » donnent des fichiers
   bit à bit identiques (même poids, même erreur), palettes adaptative, MEDIANCUT, FASTOCTREE et
   « pipeline actuel » confondus. À l'inverse, l'export direct RGB→GIF est identique à MEDIANCUT.
   → Le levier utile n'est pas le tramage, c'est la **résolution** et **le format**.
4. **Palette partagée entre les 2 phases** : −11 ko et même fidélité (401 contre 412 ko à 660 px).
5. **WebP animé** : 4 à 5 fois plus léger que le GIF **et** plus fidèle (à 880 px : 140 ko / err 2,24 contre
   682 ko / err 9,97). **APNG** : sans perte mais ≈ 2× le poids du GIF.

## 4. Poids du projet si la série repartait (389 visuels, 2 phases, 500 ms)

| Scénario | Poids moyen/GIF | Total estimé |
|---|---|---|
| Aujourd'hui (259–264×440 GIF) | 192 ko (médiane mesurée) | **72 Mo** (391 fichiers) |
| Reprise en GIF 396×660 | 412 ko | ≈ 160 Mo |
| Reprise en GIF 528×880 | 682 ko | ≈ 265 Mo |
| Reprise en WebP animé 396×660 q90 | 99 ko | **≈ 38 Mo** |
| Reprise en WebP animé 528×880 q90 | 140 ko | ≈ 54 Mo |
| Reprise en APNG 396×660 | 800 ko | ≈ 310 Mo |

Le GIF à définition utile est donc **le scénario le plus lourd** ; le WebP animé est le seul qui
améliore la netteté **et** allège l'application.

## 5. Compatibilité WebView (à confirmer sur le téléphone, pas depuis ici)

- WebP animé : Chromium 32+ / WebView Android 4.2+ ; APNG : supporté par WebView récent mais
  historiquement inégal selon les versions.
- **Rien ne sera changé dans l'application sans accord explicite.** Une page de test est fournie
  (`index.html` de ce dossier, ouverte par le serveur de prévisualisation) : elle affiche côte à côte
  le GIF, le WebP et l'APNG aux conditions réelles de l'application (300 px de haut) et indique si
  l'animation joue vraiment sur l'appareil. À ouvrir **depuis le téléphone**.

## 6. Décision demandée (avant toute reprise des 389)

1. **Résolution d'export** : 440 (actuel), **660 recommandé**, ou 880 px de haut ?
2. **Format** : GIF conservé (le plus lourd) ou WebP animé (plus net et plus léger) après essai sur le téléphone ?
3. **Vert** : garder la teinte actuelle des masters, ou se rapprocher du 260 (plus foncé et saturé),
   en retouche PNG avant export ?
4. Après accord seulement : reprise des 389 selon la méthode validée (aucun GIF livré remplacé sans
   accord par numéro).

Rappels : n°80 (mains) et tous les gestes validés restent intouchés ; l'APK n'est pas reconstruit ;
le prototype n'a consommé **aucun appel de génération d'image** et n'a modifié **aucun média livré**.
