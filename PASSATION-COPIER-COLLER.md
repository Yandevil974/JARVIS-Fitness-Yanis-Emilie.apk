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
