# Passation — JARVIS Fitness Evolution

> 🚩 **Reprise dans un nouveau chat** : suivre `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md`
> (état mesuré, outils, recette de prompt, pièges, prochaines étapes).

## En cours — refonte de TOUS les visuels sur la nouvelle photo (25 septembre 2026)

**Cible réelle : 331 GIF** = un couple (mouvement × athlète). Les 343 lignes du plan ne
contiennent que 325 identifiants : 17 gestes existent chez les deux athlètes et demandent
deux GIF distincts (l'un à l'homme, l'autre à la femme). L'écart inexpliqué de 4 est clos.

**Avancement mesuré** (fichier suivi : `evolution/media/refonte-photo/production/etat.json`) :

| Surface | Faits et vérifiés | Restants |
|---|---|---|
| Musculation | 127 | 75 |
| Tabata au sol | 10 | 27 |
| Étirements | 29 | 0 ✅ |
| Piscine (guides) | 0 | 9 |
| Piscine (protocoles) | 0 | 40 |
| Aqua Tabata | 0 | 6 |
| Elliptique | 5 | 0 ✅ |
| Échauffement | 3 | 0 ✅ |
| **Total** | **174** | **157** |

**25 septembre 2026 — reprise dans un nouveau chat : les mouvements déjà créés ont été
vérifiés avant de produire.** 119 GIF livrés mesurés (`evolution/media/tools/verif-gifs.py` :
2 images, 500 ms, 440 px, boucle, identifiant et athlète du plan, vert des deux cases,
quasi-doubles) puis **38 relus case par case** en pleine définition
(`evolution/media/tools/feuilles-verif.py`) : **4 gestes faux trouvés parmi les livrés**
(développé couché test 1RM montré assis, leg curl 1 1/4 cases inversées, dead bug rotation
sans position dead bug, grenouille sans la posture prescrite) — refaits, relus et acceptés
au **lot 17** avec 4 mouvements neufs (123 / 331). Deux planches restent en 3ᵉ essai
(`production/a-refaire.json`), **75 couples valides restent à relire**, et 21 GIF ont une
case sans vert lime (`production/style-a-reprendre.json`, lot style dédié à venir).
Détail mesuré : `evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md`.

**Deux outils ajoutés à cette étape, qui changent la méthode** :

1. `evolution/media/tools/refonte-sheet.py` — une planche 2 cases devient un GIF :
   les deux positions sortent d'une seule génération (même athlète, même salle, même
   cadrage), puis les cases sont recalées par corrélation du décor et la **même fenêtre**
   est découpée dans les deux. C'est ce qui rend l'enchaînement fluide, sans saut.
2. `evolution/media/refonte-photo/production/prescriptions.json` — les **343 gestes**
   sont désormais écrits en collant la **prescription exacte lue dans l'APK livré**
   (nom + durée + consigne), extraite du paquet. Plus aucune posture n'est devinée.

**Plan de production** : `production/plan.json` — 729 noms de l'application rattachés à
**343 mouvements** ; quand deux noms désignent le même geste, un seul GIF les sert
(autorisé pour deux identifiants). Aucun nom ne reste sans visuel.

**Contrôle qualité, sans complaisance** : 5 planches produites ont été **refusées après
lecture des deux cases** et sont listées dans `production/a-refaire.json` avec le motif
et la prescription concernée. Elles ne sont pas comptées comme faites.

**Vocabulaire visuel imposé** (identique à la famille déjà livrée) : photo de l'utilisateur
comme seul modèle, une seule chose change par image, les muscles travaillés en **vert
lime** et eux seuls, éclairage clair, aucun texte, aucun cadrage qui coupe la tête ou les pieds.

**Reste à faire** : les 297 mouvements, puis le câblage (carte des alias, `build.mjs`,
`BUNDLE_SHA`), la reconstruction de l'APK, `.sha256` + `.fidelity.json`, les 64 tests.
**La clé de signature n'est pas dans cet espace de travail** : elle devra être recollée
par l'utilisateur au moment de la construction finale (`/tmp/rk.txt`, droits 0600).
Aucun groupe de constats n'est fermé ; l'IA conversationnelle reste en pause.

## Télécharger la version livrée (1.4.8 — 24 septembre 2026)

[**Yanis-Fitness-Evolution-1.4.8.apk**](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/f48bf739a824661c774e524062aea1ca19958516/downloads/Yanis-Fitness-Evolution-1.4.8.apk)
— 28 035 594 octets, SHA-256 `fee667192291dd8adc93593bb395b6193e82849e11a4d5db94bf9218c8b99e9f`, signature `150e3846…`
(installation directe par-dessus la 1.4.2 à la 1.4.7, rien à désinstaller).

Lien de branche si vous préférez :
[`arena/01a0cd68-…/downloads/Yanis-Fitness-Evolution-1.4.8.apk`](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/01a0cd68-jarvis-fitness-yanis-emilie-ap/downloads/Yanis-Fitness-Evolution-1.4.8.apk)

Cette version contient **tous les visuels manquants du premier lot** (Tabata au sol, 4 étirements, 10 variantes, récupérations piscine, correctif 1.4.7) et passe **64/64 tests**, dont la mesure du script réellement embarqué dans l'APK.

## Ce qui reste à faire — état exact au 24 septembre 2026

### 1. Variantes « alias » : 13 restent à traiter (sur 27 mesurées)

Les dix premières étaient livrées ; les dix-sept autres ont été vérifiées **image par image** sur les dessins réellement servis (`evolution/media/review/alias-restants-dessins-livres.png`).

- **8 animations produites et validées** (dans `evolution/media/candidate/alias-animations/`, planches dans `evolution/media/candidate/alias-planches/`) :
  face pull à l'élastique · kickback à l'élastique · leg extension · curl poulie basse (sert aussi `curl-poulie-basse-supination`) ·
  élévations latérales incliné 45° · tractions prise large · split squat poulie basse · extensions triceps + pullover barre EZ.
- **2 animations produites mais à refaire** (la pose prescrite n'est pas encore convaincante) :
  élévations latérales incliné 30° (l'inclinaison du banc doit être visible) · écartés câbles incliné (l'athlète doit être allongé sur le banc incliné).
- **3 animations pas encore produites** : rowing assis câble unilatéral (un seul bras) · développé couché décliné prise serrée · Pallof press à l'élastique.
- **Rien à produire** pour `kickback-a-la-poulie-drop-set-final` : le dessin livré est bien un kickback à la poulie.

### 2. Câblage et version suivante

- Étendre `evolution/media/candidate/alias-visuals-map.json` (variantes + `files` avec empreintes), copier les GIF dans `alias-animations/`, autoriser un même fichier pour deux identifiants (aujourd'hui la carte et le test exigent un fichier par entrée : à faire évoluer proprement).
- Mettre à jour les tests qui comptent aujourd'hui **10 variantes** (`delivered-bundle.test.mjs`, `alias-visuals.test.mjs`, `media-inventory.test.mjs`).
- Reconstruire le paquet web (`build.mjs`), renouveler le pin `BUNDLE_SHA` de `build-media-148.py`, reconstruire l'APK, refaire `.sha256` + `.fidelity.json`, relancer 64/64 tests, puis reprendre la présente passation.

### 3. Ce qui dépend de vous

- **Essai sur votre téléphone** : c'est la seule acceptation encore en attente. Les groupes de constats (Tabata au sol, étirements, variantes, récupérations piscine) restent **ouverts** jusqu'à votre retour ; aucun n'est fermé en silence.
- **Associations historiques de récupération piscine** (« Récup — marche », « Récup complète — souffler au bord », « Récup entre tabatas », « Retour au calme ») : elles gardent leur image aquatique livrée, toujours marquées « non validées ».
- **IA conversationnelle** : en pause, comme convenu.

## Version complète livrée — 1.4.8 (24 septembre 2026)

> « oui complète tous les éléments manquants » puis « il y a des images humaines animées manquantes. corrige cela stp en cohérence avec les autres gif stp »
> Ordre retenu : **tout en une seule version**. Tout est produit, embarqué, mesuré et livré ci-dessous.

### 1. Le fichier à installer

| | |
|---|---|
| Fichier | `downloads/Yanis-Fitness-Evolution-1.4.8.apk` |
| Taille | **28 035 594 octets** |
| SHA-256 | `fee667192291dd8adc93593bb395b6193e82849e11a4d5db94bf9218c8b99e9f` |
| Signature | **`150e3846…`** — la même depuis la 1.4.2 ⇒ **installation directe par-dessus la 1.4.6 ou la 1.4.7**, rien à désinstaller, profils et historique conservés |
| Contrôles | 9/9 DEX identiques octet pour octet à la 1.4.0, signature v2 + v3, alignement vérifié, un seul signataire, **64/64 tests Node**, construction reproductible à l'octet |

**Important** : le fichier `downloads/Yanis-Fitness-Evolution-1.4.8.apk` portait jusqu'ici un **APK de contrôle** (lot C, `f39cc05a…`). Il a été **remplacé par la version complète**. Si vous aviez téléchargé l'ancien, reprenez le fichier : la taille et l'empreinte ci-dessus le distinguent sans ambiguïté.

**À ne pas installer** : la **1.4.7** (ses cinq animations aquatiques ne sont pas dans l'APK — images cassées) et la **1.4.1** (clé de signature détruite).

### 2. Ce qui a été produit — tous les manques, en une fois

| Manque mesuré | Ce qui est fait |
|---|---|
| **34 noms du Tabata au sol** sans démonstration (+ 4 noms affichant un guide aquatique par erreur) | **33 mouvements dessinés + 5 noms équivalents** du générateur = **les 38 noms couverts**, résolus **uniquement** en contexte Tabata au sol. En piscine, en étirement, en échauffement ou au repos, rien ne change. |
| **4 étirements** dont le dessin montrait un AUTRE mouvement | **4 dessins produits** dans la famille de vos étirements (1376 × 768, posture unique, figure entière, pieds au sol) : mollet en escalier, adduction de la hanche debout, mains croisées derrière le dos, étirement des fléchisseurs. Les anciens dessins restent dans le paquet pour les autres consignes. |
| **10 variantes de musculation** montrant le dessin d'une autre variante | **10 animations produites** dans la famille des GIF livrés, résolues **par identifiant exact** : tractions prise neutre, back extension 45° prise snatch, développé couché prise serrée, curl haltère supination banc Scott 90°, curl Zottman assis, fentes marchées, curl Zottman un bras banc Scott, curl Zottman, curl concentration, fentes arrière au poids du corps. Aucune substitution par muscle. |
| **Récupérations piscine sans visuel** | Mesure sur les six protocoles (**420 étapes**) : **117 « Repos » + 18 mises en place** (Tour/Tabata n/N — en place) n'affichaient **aucun** média aquatique. **2 animations produites** (`pool-repos.gif`, `pool-en-place.gif`), servies **seulement** quand un contexte piscine est établi. **420/420 étapes résolvent un média aquatique : zéro vélo, zéro elliptique, zéro photo générique.** |
| **Défaut de la 1.4.7** (5 animations référencées, absentes de l'APK) | Les 5 fichiers sont embarqués, et la construction **refuse** désormais de produire un APK si un média référencé manque. Deux tests mesurent **l'APK livré** : l'inventaire des fichiers, et le script lui-même exécuté. |

**Total : 54 fichiers média ajoutés** (33 Tabata au sol + 4 étirements + 10 variantes + 2 récupérations + 5 guides aquatiques de la 1.4.7), tous dans la famille visuelle déjà livrée (480 × 262, 2 images, 500 ms pour les GIF ; 1376 × 768 pour les dessins fixes), tous vérifiés **image par image** avant embarquement.

### 3. Ce qui ne change pas

Aucun nom, aucune consigne, aucune durée, aucune prescription, aucun programme, aucune donnée enregistrée : **209 exercices, 11 rubriques, deux profils, les étapes 1–7 et l'accueil validé restent identiques**. Hors de leur contexte, les animations produites ne s'affichent pas : un pas aquatique garde son guide de piscine, un pas terrestre garde son guide terrestre.

### 4. Ce qui reste ouvert — honnêtement

- **Aucun essai sur téléphone réel** n'a été fait ici. Les groupes concernés restent **ouverts** : Tabata au sol, variantes, étirements, récupérations piscine. Rien n'est fermé silencieusement.
- Les associations **historiques** des autres noms de récupération piscine (« Récup — marche », « Récup complète — souffler au bord », « Récup entre tabatas », « Retour au calme ») gardent leur image aquatique livrée, toujours marquée « non validée » : c'est la même honnêteté que la mesure exige.
- Les autres écarts d'alias déjà tracés dans les constats (dips, élévations, mollets, développés…) restent ouverts : ils n'étaient pas dans le relevé des dix variantes de ce lot, aucune substitution n'a été inventée pour eux.

### 5. La version se vérifie elle-même

Depuis ce lot, un test (`evolution/media/tests/delivered-bundle.test.mjs`) **extrait le JavaScript de l'APK livré** et l'exécute tel quel. Il mesure, sur le fichier que vous téléchargez et non sur la source qui l'a produit :

- les **420 étapes des six protocoles piscine** : table exacte (117 `pool-repos.gif`, 18 `pool-en-place.gif`, 45 marche aquatique, 30 sprint, 24 fractionné, 18 récupération complète, 15 retour au calme, 13 nage douce, …), **aucun chemin `cardio-`, elliptique ou photo** ;
- les **38 noms du Tabata au sol** : chacun reçoit l'animation de son propre mouvement, et **aucun** ne reçoit une animation de terre dans un pas aquatique ;
- les **10 variantes** : chacune résolue au niveau `exact` sur sa propre animation ;
- les **4 étirements** : les nouveaux dessins sont bien ceux servis, les anciens ne le sont plus.

Il vérifie aussi que l'APK, son fichier `.sha256` et son rapport de construction **concordent** (une empreinte recopiée à la main ne suffit plus).

**Construction reproductible** : relancer la construction sur les sources committées reproduit **exactement** le même SHA-256 (`fee66719…`, 28 035 594 octets). La version livrée n'est pas un objet unique non reproductible.

### 6. Note technique, sans conséquence pour vous

L'espace de travail s'est réinitialisé deux fois pendant ces lots ; le fichier de clé de signature avait disparu avec lui. La clé recollée comportait **un seul caractère erroné** : le certificat ne s'ouvrait pas. La correction exacte a été retrouvée par vérification cryptographique, l'identité **`150e3846…`** a été restaurée et l'APK ci-dessus est signé avec elle. La clé ne circule pas dans le dépôt : seuls le texte chiffré et l'empreinte publique y sont.

## Dernière avancée — 1.4.7 publiée : cinq animations humaines aquatiques, dans le style de vos GIF existants (24 septembre 2026)

> « il y a des images humaines animées manquantes. corrige cela stp en cohérence avec les autres gif stp »

**Fait.** Vos GIF humains existants ont été mesurés un par un avant de dessiner quoi que ce soit (`480 × 262`, **2 images**, **500 ms**, fond blanc, bande d'eau bleue, humain réaliste coloré, **muscles surlignés en orange**, bassin au bon niveau). Les cinq guides aquatiques qui n'avaient **aucun** dessin valide ont maintenant leur animation, dans cette famille exacte :

| Guide | Animation livrée |
|---|---|
| **Gainage au bord (vertical)** | `pool-animations/gainage-vertical.gif` — planche verticale, mains sur la margelle |
| **Mobilité épaules aquatique** | `mobilite-epaules.gif` — bras tendus devant puis ouverts, immersion à la poitrine |
| **Mobilité hanches / chevilles** | `mobilite-hanches-chevilles.gif` — genou monté puis ouvert, immersion à la taille |
| **Ciseaux au bord** | `ciseaux-au-bord.gif` — jambes alternées derrière, mains sur la margelle |
| **Talons-fesses** | `talons-fesses.gif` — talon vers la fesse en course dans l'eau |

**Ce qui disparaît** : les cinq **dessins terrestres** (planche sur banc, élastique à sec, poulie, relevés de jambes, montée de genou au mur) **et** la mention de lacune introduite en 1.4.6. **Ce qui ne change pas** : les consignes, les noms, les durées, et l'état enregistré de vos profils.

**Méthode, sans tricherie** : deux allers-retours complets avant livraison — un premier lot écarté parce que **l'eau était trop basse** (on aurait dit des exercices au sol devant un bassin) et un second corrigé avec l'immersion au niveau de la poitrine ou de la taille. Le cadrage est fait **en hauteur d'abord** (jamais de tête ni de pied coupé), puis rogné sur les côtés, avec une légère saturation en plus pour égaler vos GIF. Planche de contrôle dans l'application : `evolution/media/review/pool-animations-5-guides.png`.

| Élément | Valeur |
|---|---|
| Fichier | `downloads/Yanis-Fitness-Evolution-1.4.7.apk` (24 909 288 octets) |
| SHA-256 | `ad2913f9aff4817e1b32f638930ea478d63f89961cc0de7f69c48638d00baf06` |
| Version | 1.4.7 / code 18 · web embarqué `cf99b6e4…` |
| Identité | **`150e3846…`** (la même depuis la 1.4.2) ⇒ **installation par-dessus la 1.4.6, rien à désinstaller** |
| Contrôles | v2 + v3, 1 signataire, **9/9 DEX identiques**, paquet web + manifeste + **5 médias ajoutés** |

**Tests** : Node **46/46** ; le parcours navigateur `pool-land-guides.spec.mjs` exige désormais **l'animation fournie** (chargée, entière), **l'absence** de l'ancien dessin terrestre, **l'absence** de la mention de lacune, et contrôle pour chaque GIF la signature `GIF89a`, la taille **480 × 262** et son empreinte exacte.

**Resté ouvert, volontairement** : les quatre écarts d'étirement gardent leurs visuels livrés (votre décision du 24 septembre), et **les 34 mouvements de Tabata au sol** restent sans démonstration — même méthode disponible que pour la piscine si vous le voulez.

## ⛔ Dernière avancée — décision utilisateur : famille C refusée, les visuels livrés sont conservés (24 septembre 2026)

**Ce que vous avez dit, et ce qui a été appliqué immédiatement :**

> « la famille c est nulle en terme de rendu ne change rien, garde comme c'était AVANT — dessin livré (1.4.6) … on est en train d'enlaidir l'application. je ne veux pas d'image de la famille c »

1. **Famille C définitivement refusée** — aucune image de cette famille dans l'application, à aucun endroit.
2. **La proposition de témoin est retirée du dépôt** (le SVG et son montage comparatif) : vous ne verrez plus cette image, ni dans le dépôt, ni dans l'app, ni dans l'aperçu (il est fermé).
3. **Les quatre écarts d'étirement conservent le visuel livré** : mollet en escalier, adduction debout, mains croisées derrière le dos, fléchisseurs de l'avant-bras. **Aucune création.**
4. **Aucune création d'image n'est autorisée**, ni pour le Tabata (34 mouvements), ni pour la piscine (5 guides), ni pour la musculation (27 variantes) : les visuels livrés restent tels quels.
5. **Seuls des échanges entre dessins déjà livrés** (familles A et B) restent possibles, sur décision explicite — c'est le principe appliqué dans la 1.4.6 pour « Pigeon assis » et « Main dans le dos », qui ne sont pas concernés par ce refus.
6. **L'APK livré ne change pas** : la **1.4.6** (`48676e12…`) reste la seule version à installer. Sa finesse visuelle est exactement celle que vous avez validée en la refusant : rien n'a été ajouté à l'application.

**Traçabilité de la décision** : vos mots sont enregistrés tels quels dans `evolution/media/review/findings.json` (`userDecision`, 10 groupes concernés), dans `evolution/media/candidate/validation.json` et en tête de `evolution/media/review/REGLE-STYLE-MESUREE.md`. Deux groupes qui n'attendaient plus qu'une décision de style sont **clos par décision explicite** (jamais silencieusement) : `style-family-rule` et `gaps-without-any-faithful-drawing`. **51 groupes restent ouverts.**

**Contrôles** : Node **46/46**, dont un test qui vérifie que les deux fichiers de la proposition **ne sont plus dans le dépôt**, que la décision est citée mot pour mot, et qu'aucun groupe ne peut être clos sans décision utilisateur nominative.

### Prochaine étape précise

1. **Essai téléphone de la 1.4.6** : c'est désormais le seul chantier en attente de vous — installer par-dessus la 1.4.5, vérifier qu'un Tabata au sol n'affiche rien d'aquatique, que « Pigeon assis » et « Main dans le dos » montrent la bonne posture, et qu'une étape de piscine sans dessin correspondant affiche la lacune explicite **avec** ses consignes.
2. **Audit visuel** : je continue la relecture des 94 dessins livrés **sans rien créer**, pour vérifier ceux qui n'ont pas encore été relus en pleine image, et je documente chaque écart mesuré sans proposer de dessin.
3. **IA conversationnelle toujours en dernier.** Avertir avec 🚩 avant la limite de contexte.

## Étape précédente — règle de style mesurée dans le pack (23 septembre 2026)

**« Autorisation accordée » exécutée, mais avec un arrêt net et assumé devant la création d'images** : vous avez exigé une règle de style avant toute nouvelle image, et aucune décision de ce type n'était encore prise. Plutôt que d'inventer un style, je l'ai **mesuré dans l'application livrée**. Rien n'a été créé, aucun APK n'a donc changé.

### Pourquoi j'ai mesuré au lieu de produire

Le pack ne contient pas un style mais **trois familles qui coexistent**, mesurées une par une (`evolution/media/review/STYLE-METRICS.json`, 76 dessins réellement utilisés, 137 ressources) :

| Famille | Nombre | Format | Animation | Fond / encre | Cadrage |
|---|---|---|---|---|---|
| **A — fil de fer** | 36 | 300 × 300 | **12 images** | blanc `#ffffff` / noir `#020202` | marges médianes **43 / 30 / 25 / 15 px**, trait médian **3 px** |
| **B — rendu réaliste** | 40 | 440 × 240 (22), 246 × 440 (7), 403 × 440 (5), 480 × 262… | **2 postures** | quasi blanc, ≈ 128 couleurs | plein cadre (marge médiane 0–1 px) |
| **C — SVG animé intégré** | 144 dans le paquet web | `viewBox 0 0 120 100` | boucle CSS **3 s** | `#0a0e1a`, peau `#e8b896`, vêtement `#1e293b` | sujet centré, suit le thème |

Règle proposée : **un nouveau visuel rejoint la famille de son contexte, jamais une quatrième**. Document complet : `evolution/media/review/REGLE-STYLE-MESUREE.md` (joint à ce message).

### Ce que la mesure établit, sans discussion possible

- **76 dessins** servent **fidèlement** 95 exercices ; **114 exercices** affichent le dessin d'une **autre variante**.
- Pour les variantes prescrites des **27 écarts** de musculation mesurés (élastique, poids du corps, concentration, prise serrée, Zottman, chin-up, banc Scott, marchées, assis câble, 45°), la recherche dans les **76 dessins fidèles** ne trouve **aucun** équivalent : ces corrections **exigent une création**.
- **4 écarts d'étirement** restants et **34 mouvements de Tabata au sol** n'ont **aucun** dessin correspondant non plus.
- Volumétrie réelle du manque : **34 + 27 + 5 + 4 = 70 visuels** à créer, si vous autorisez la création.

Inventaire complet, ligne par ligne : `evolution/media/review/GAPS-SANS-DESSIN.json`.

### Vérifications de cette étape

- **Aucun APK reconstruit** (aucune modification de code) : le paquet livré reste la **1.4.6** (`48676e12…`), bundle `e372a369…` inchangé.
- Les mesures sont **figées par un test** (`evolution/media/tests/style-rule.test.mjs`) : les 36 + 40 + 144 sont vérifiés dans le paquet, la règle écrite doit contenir les valeurs mesurées, et le groupe de décision doit rester **ouvert**. Node **46/46**.
- Deux groupes ajoutés : `style-family-rule` (décision de style) et `gaps-without-any-faithful-drawing` (lacunes sans dessin fidèle) → **53 groupes ouverts**.
- **Septième effacement d'espace de travail** en début d'étape : restauré depuis le dépôt, Chromium et l'outillage reprovisionnés, **rien perdu**.

### Prochaine étape précise — elle dépend de vous

1. **Valider la règle de style** ou la corriger (les trois familles et leurs gabarits) et **choisir la famille** des 34 Tabata au sol et des 5 guides aquatiques — je recommande la **famille C** pour l'écran sombre du chrono.
2. **Autoriser un lot témoin** avant toute production en série : je créerais **un** visuel (le plus utile : un guide aquatique ou un étirement), vous le jugez en pleine image, et on ajuste le gabarit avant les 69 autres. C'est la seule façon de garantir le style sur 70 visuels.
3. **Essai téléphone** de la 1.4.6, sinon les groupes corrigés ne seront jamais vérifiés sur l'appareil réel.
4. **Audit : 53 groupes ouverts**, aucun fermé silencieusement. **IA conversationnelle toujours en dernier.** Avertir avec 🚩 avant la limite.

## Étape précédente — 1.4.6 publiée : deux visuels d'étirement corrigés et cinq lacunes explicites en piscine (23 septembre 2026)

[Télécharger la 1.4.6](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/Yanis-Fitness-Evolution-1.4.6.apk) · [consignes](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/INSTALLATION-1.4.6.md) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/Yanis-Fitness-Evolution-1.4.6.apk.sha256) · [fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/Yanis-Fitness-Evolution-1.4.6.fidelity.json) · [preuve étirements](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/evolution/media/review/stretch-echanges-avant-apres.png) · [release](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.4.6-evolution)

**« Autorisation accordée poursuis » (23 septembre 2026)** a autorisé les corrections **déjà mesurées qui n'exigent aucune création d'image**. Deux chantiers livrés ici. La règle appliquée est celle que vous aviez fixée : **échanger l'image ou montrer une lacune explicite, jamais réécrire une consigne**.

### 1. Deux visuels d'étirement qui ne montraient pas la posture décrite

| Entrée | Avant | Après | Pourquoi |
|---|---|---|---|
| **Pigeon assis** | dessin du pigeon **au sol** | dessin **du piriforme assis** (assis, cheville croisée sur le genou opposé) | la consigne décrit la position assise ; ce dessin la montre |
| **Main dans le dos** | **dos anatomique** (muscle surligné, pas une posture) | dessin **du coude au-dessus de la tête** (main derrière la tête, coude tiré) | le fichier ne montrait aucune posture d'étirement |

Les **deux dessins utilisés existaient déjà** dans l'application : aucune création, aucune consigne, aucune durée, aucun muscle modifié. Preuve navigateur, même page, même profil : avant `[coude, dos, pigeon, piriforme]` → après `[coude, **coude**, **piriforme**, piriforme]` — le reste de la liste est **identique** (25 autres dessins inchangés). Bandeau : `evolution/media/review/stretch-echanges-avant-apres.png` ; captures pleine page : `stretch-mobilite-{avant,corrige}.png` ; test `evolution/media/tests/stretch-media.spec.mjs` (2 parcours).

### 2. Cinq guides aquatiques qui affichaient un dessin terrestre

`Gainage au bord (vertical)`, `Mobilité épaules aquatique`, `Mobilité hanches / chevilles`, `Ciseaux au bord`, `Talons-fesses` portaient un **dessin terrestre** (planche sur banc, élastique à sec, poulie, relevés de jambes au banc, montée de genou au mur). Ils n'affichent plus ce dessin **à aucun des trois endroits** : visuel du mouvement, bloc « Consignes du mouvement » du chrono, et **liste des étapes d'un protocole piscine** (celle-ci passait encore par la bibliothèque générale — corrigé). Une **lacune explicite** s'affiche à la place, et **toutes les consignes aquatiques restent affichées**. Rien n'est inventé, rien n'est réécrit. Test `evolution/media/tests/pool-land-guides.spec.mjs` (2 parcours : les quatre guides avec état persisté, plus le contrôle de la liste).

### Vérifications

- **Node 44/44** ; **suite média 37/37 (4,7 min)** sur ce bundle exact ; le test Node `stretch-media.test.mjs` compare la carte des visuels au paquet 1.4.0 et prouve qu'**aucun autre visuel n'a bougé et qu'aucun nom n'a été renommé**.
- **État enregistré intact** : dans chaque parcours, les données du profil (étapes du chrono, séries, sessions, mesures) sont **identiques avant/après**.
- **Groupe `tabata-land-to-water`** (1.4.5) reste vérifié : 5/5 sur le bundle, 4 échecs rejoués contre la 1.4.4 livrée.

### Livrable — APK 1.4.6 signé

| Élément | Valeur |
|---|---|
| Fichier | `downloads/Yanis-Fitness-Evolution-1.4.6.apk` (24 909 281 octets) |
| SHA-256 | `48676e1273a4a3aea61d38d3dd08060ef753b6b8ac5be50ca919f33449556bfe` |
| Version | 1.4.6 / code 17 · web embarqué `e372a369…` |
| Identité | **`150e3846…`**, la même depuis la 1.4.2 ⇒ **installation par-dessus la 1.4.5, rien à désinstaller** |
| Contrôles | v2 + v3, 1 signataire, **9/9 DEX identiques**, 271/272 fichiers web identiques, seules entrées changées = manifeste + paquet web, fichier retéléchargé comparé |

### Prochaine étape précise

1. **Essai téléphone** de la 1.4.6 (installation directe) : vérifier qu'un Tabata au sol n'affiche rien d'aquatique, que « Pigeon assis » et « Main dans le dos » montrent la bonne posture, et qu'une étape de piscine sans dessin correspondant affiche la lacune explicite **avec** ses consignes.
2. **Décisions encore nécessaires avant toute création d'image** : règle de style (cadrage, trait, couleurs, fond) ; les **quatre écarts d'étirement restants** (mollet en escalier, adduction debout, mains croisées derrière le dos, fléchisseurs de l'avant-bras) qui n'ont **aucun** dessin correspondant dans le pack ; les **34 noms de Tabata au sol** sans démonstration.
3. **Audit : 51 groupes ouverts**, aucun fermé silencieusement. **IA conversationnelle toujours en dernier.** Avertir avec 🚩 avant la limite de contexte.

## Étape précédente — 1.4.5 publiée : un Tabata au sol n'affiche plus de guide aquatique (23 septembre 2026)

[Télécharger la 1.4.5](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/1701943/downloads/Yanis-Fitness-Evolution-1.4.5.apk) · [consignes](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/1701943/downloads/INSTALLATION-1.4.5.md) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/1701943/downloads/Yanis-Fitness-Evolution-1.4.5.apk.sha256) · [fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/1701943/downloads/Yanis-Fitness-Evolution-1.4.5.fidelity.json) · [fiche avant/après](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/1701943/evolution/media/review/REVIEW-TABATA-CONTEXTE.md)

### Le défaut, mesuré, puis corrigé

Le générateur du Tabata est le même au sol (`type:"hiit"`) et au bord du bassin (`type:"aqua"`), et plusieurs mouvements portent **le même nom** dans les deux contextes. Jusqu'à la 1.4.4 incluse, le chrono guidé cherchait les guides aquatiques **sans vérifier le contexte** : en plein Tabata **au sol**, l'étape « Gainage planche » affichait le GIF du guide aquatique *Gainage au bord (vertical)* — **comme visuel du mouvement et dans le bloc « Consignes du mouvement »**, consignes de bassin et margelle comprises. Quatre noms sont concernés : Gainage planche, Montées de genoux, Battements de jambes, Marche sur place.

**Correction livrée** (règle : *en contexte terre, jamais de guide aquatique*, la même que pour la piscine) : le chrono ne résout un guide aquatique que si l'étape est réellement aquatique, avec le résolveur déjà validé pour la piscine. **Aucun nom, aucune durée, aucune consigne, aucune prescription n'est modifié**, et l'Aqua Tabata garde **exactement** ses guides validés.

| Cas mesuré (390 × 900, profil Yanis, thème sombre, mêmes états) | 1.4.4 livrée | 1.4.5 |
|---|---|---|
| Tabata **au sol** « Gainage planche · round 1/8 » | GIF aquatique `f1dde35b…gif` en visuel **et** en consignes | aucune image ni consigne de bassin ; visuel honnête générique (groupe `tabata-missing-demonstrations` ouvert) |
| Tabata **au sol** « Montées de genoux · round 2/8 » | GIF aquatique `fe34482a…gif` | idem : rien d'aquatique |
| **Aqua Tabata** « Montées de genoux · round 1/8 » | GIF aquatique + consignes | **strictement identique** |

Captures pleine image : `evolution/media/review/tabata-{land,aqua}-{avant-144,corrige-145}.png` · fiche complète : `evolution/media/review/REVIEW-TABATA-CONTEXTE.md`.

### Vérifications de cette étape

- **Preuve en double sens** : le parcours `evolution/media/tests/tabata-context.spec.mjs` (5 cas) réussit **5/5** sur le bundle corrigé et **échoue 4 fois sur 5 rejoué contre la 1.4.4 livrée** — les 4 échecs sont exactement les cas au sol, l'aqua reste vert. Même commande, mêmes états, seul le paquet servi change.
- **Suites** : Node **42/42** ; suite média complète **33/33 (4,5 min)** sur ce bundle exact ; suite d'origine comparée à la même minute (référence 1.4.0 intacte vs livrable, mêmes causes, aucune perte).
- **Gel des données** : dans chaque parcours, l'état enregistré (étapes du chrono, `meta`, séries, activités, mesures, séances, plan) est **identique avant/après** ; les mouvements et libellés `TABATA_MODES` sont comparés octet pour octet au paquet 1.4.0.

### Livrable — APK 1.4.5 signé

| Élément | Valeur |
|---|---|
| Fichier | `downloads/Yanis-Fitness-Evolution-1.4.5.apk` (24 909 288 octets) |
| SHA-256 | `4c75fa67791202836a5a4a1ca210b8068958f9242cfc5a965af5674390f83601` |
| Version | 1.4.5 / code 16 · web embarqué `6fbd242a…` |
| Identité | **`150e3846…`**, la même que 1.4.2/1.4.3/1.4.4 ⇒ **installation par-dessus la 1.4.4, rien à désinstaller** |
| Contrôles | v2 + v3, 1 signataire, **9/9 DEX identiques**, 271/272 fichiers web identiques, seules entrées changées = manifeste + paquet web |

- **Défaut de lien réparé au passage** : la notice 1.4.4 pointait vers un commit de préparation **inexistant** (aperçu 404). Les liens des notices **1.4.4 et 1.4.5** sont repinnés vers un commit réel qui contient bien les fichiers. C'est aussi pourquoi les liens bruts de cette passation sont épinglés et revérifiés après publication.
- **Sixième effacement d'espace de travail** pendant ce chantier : `.cache`, `.private`, `/tmp` (Chromium), `node_modules` et les serveurs ont disparu **une fois de plus** ; identité restaurée depuis le dépôt, outillage réinstallé, **rien n'a été perdu** grâce aux commits poussés.
- **Réserve honnête** : aucun essai sur téléphone réel ; le groupe Tabata reste **ouvert** pour cette raison.

### Prochaine étape précise

1. **Essai téléphone** de la 1.4.5 (installation directe par-dessus la 1.4.4) : vérifier qu'un Tabata au sol n'affiche plus aucune image ni consigne de bassin, et que l'Aqua Tabata affiche toujours ses guides. Retour même court.
2. **Décisions toujours attendues avant toute création d'image** : règle de style ; échange des deux étirements (pigeon assis, main dans le dos) avec des dessins déjà présents ; piscine (retirer les 5 visuels terrestres plutôt qu'un dessin terrestre) ; Tabata (34 des 38 noms au sol sans démonstration dédiée — création ou lacune explicite assumée).
3. **Audit : 51 groupes ouverts**, aucun fermé silencieusement, aucun validé définitivement. **IA conversationnelle toujours en dernier.** Avertir avec 🚩 avant la limite de contexte.

# 🚩 Passation — Yanis Fitness Evolution

**Mise à jour : 23 septembre 2026.** Lire ce document avant de poursuivre dans une nouvelle conversation. Les fichiers et commits accessibles sont la source de vérité ; un ancien message annonçant un fichier ne garantit pas sa présence actuelle.

## Étape précédente — 1.4.4 publiée : durées lisibles, 79 alias de noms proches revus, 11 groupes instruits (23 septembre 2026)

[Télécharger la 1.4.4](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/d1a08f9/downloads/Yanis-Fitness-Evolution-1.4.4.apk) · [consignes](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/d1a08f9/downloads/INSTALLATION-1.4.4.md) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/d1a08f9/downloads/Yanis-Fitness-Evolution-1.4.4.apk.sha256) · [fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/d1a08f9/downloads/Yanis-Fitness-Evolution-1.4.4.fidelity.json) · [release](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.4.4-evolution)

**🚩 Drapeau rouge — limite de contexte proche.** Cette passation est l'écrit demandé : le travail peut reprendre dans un nouveau chat à partir d'ici, sans rien reperdre. Tout ce qui suit est **déjà poussé et publié** ; rien n'est en attente d'un commit de ma part.

### 1. Vous avez demandé trois chantiers (« Vas y ») — les trois sont faits

1. **Verdicts individuels des 79 noms proches** (les exercices sans dessin propre dont le nom ressemble à un exercice dessiné) : **79 lignes revues une par une**, preuves en pleine image (`review/alias-overlap-targets.png`, 8 × 2 vignettes ; `review/alias-overlap-equipment-19.png`, 19 dessins), fiche complète `review/alias-overlap-review.json` (classe, verdict, ce qui est réellement vu, groupe de suivi). Résultat : **3 conformes** (squat barre de sécurité, abduction à l'élastique), **45 où la consigne est identique mais où le dessin ne permet pas de distinguer** la variante, **27 écarts mesurés**, **1 écart laissé ouvert** (squat au poids du corps dessiné avec haltère). **Aucun groupe fermé, aucune validation visuelle prononcée** — les échanges d'images sont proposés mais pas exécutés sans votre décision. 3 nouveaux groupes créés.
2. **Instruction/documentation des 12 groupes non-musculation** : **11 groupes ont maintenant un bloc « instruction » daté** dans `review/findings.json` (échauffement 2, piscine 3, tabata 2, étirements 4) ; le 12ᵉ (`combo-step-seconds-display`) est **corrigé et livré**. Ajout décisif : la **relecture intégrale des 16 dessins d'étirement** en pleine image (`review/stretch-assets-review.json`, planche `review/stretch-assets-16.png`) → **10 conformes, 6 écarts**, dont **2 réparables avec des dessins déjà présents dans l'app** (« main dans le dos » → dessin coude au-dessus de la tête ; « pigeon assis » → dessin piriforme assis) : aucune consigne n'est réécrite, je n'attends que votre accord.
3. **Correction d'affichage des durées + reconstruction** : dans la modale de séance combinée, « 1500 s » s'affiche désormais **« 25 min »**, « 90 s » → **« 1 min 30 s »**. Vérifié par test Node (45 / 90 / 1500 / 3600 s). **Aucune prescription, aucun chrono, aucune valeur enregistrée n'est touchée** — c'est le texte affiché qui devient lisible.

### 2. Livrable — APK 1.4.4 signé, publié, retéléchargé

| Élément | Valeur |
|---|---|
| Fichier | `downloads/Yanis-Fitness-Evolution-1.4.4.apk` (24 909 293 octets) |
| SHA-256 | `0d7123b45e5c5a6879f2a4962a47f6f00b039d908792da8d9b362013abf8daae` |
| Version | 1.4.4 / code 15 · web embarqué `22109c5b…` |
| Identité | **`150e3846…`, la même que 1.4.2 et 1.4.3** ⇒ **installation par-dessus la 1.4.3, rien à désinstaller, données conservées** |
| Contenu | correction piscine + séance oubliée clôturée en « partielle » + durées lisibles |
| Contrôles | v2 + v3 vérifiées, 1 signataire, alignement OK, **9/9 DEX identiques** à la 1.4.3, 271/272 fichiers web identiques, **retéléchargé depuis GitHub et comparé octet pour octet** |

- **Tests sur ce paquet** : Node **41/41** ; navigateur **6/6 en ciblé sur le bundle livré** (modale combinée : 1500 s → 25 min dans trois contextes piscine ; bloc elliptique terrestre préservé ; Émilie : séance oubliée clôturée + séance du jour jamais clôturée) ; **suite média complète 28/28 (3,9 min) relancée sur ce bundle livré** ; suite d'origine relancée à la même minute sur la référence 1.4.0 intacte (10 échecs / 11 ignorés / 18 réussis) et sur la 1.4.4 livrée (9 échecs / 11 ignorés / 19 réussis) — **mêmes échecs, mêmes causes, aucune perte**, et l'écart est en faveur du livrable : profil neuf du jour (la « séance complémentaire du HTML » demande une validation d'intensité avant de démarrer, comportement reproduit à l'identique sur la référence non modifiée) et un contrôle de sécurité qui exige le serveur Vite du dépôt source.
- **Réserve honnête** : « 1.4.4 » est ma numérotation de livraison, l'application se nomme toujours **Yanis Fitness Evolution** — aucune interface, aucun thème, aucune donnée n'a changé de nom ni de place. **Aucun essai sur téléphone réel.**
- **Réserve technique** : la release GitHub `v1.4.4-evolution` est créée, mais les **pièces jointes binaires refusent de se téléverser** (l'endpoint d'upload est bloqué depuis l'atelier, exactement comme `raw.githubusercontent`). Le **lien brut épinglé ci-dessus est le canal de téléchargement** : il a été retéléchargé et son empreinte correspond.
- **Cinquième effacement d'espace de travail** : `.cache`, `.private`, `/tmp` (Chromium compris) ont encore disparu pendant ce chantier ; identité restaurée depuis le dépôt à nouveau, Chromium reprovisionné, **rien n'a été perdu** parce que tout était poussé.

### 3. Ce qui reste — et ce qui dépend de vous

Mesures faites, décisions à prendre **avant toute création visuelle** :
- **Règle de style** (obligatoire avant tout nouveau dessin : cadrage, trait, couleurs, fond, orientation) ;
- **Échange de deux images d'étirement** (pigeon assis, main dans le dos) avec des dessins déjà présents ;
- **Piscine** : retirer les 5 visuels terrestres de la bibliothèque piscine (lacune explicite) plutôt qu'un dessin terrestre à la place d'un exercice aquatique ;
- **Tabata** : 34 des 38 noms n'ont aucun dessin (la photo de récupération s'affiche) — création ou lacune explicite ; et un défaut de contexte a été **identifié** (4 noms au sol sélectionnent un guide aquatique) : ancrage repéré, **non livré** pour ne pas expédier une modification non testée ;
- **Essai téléphone par vous/Émilie** de la 1.4.4 (la séance oubliée ne doit plus revenir ; les durées doivent s'écrire en minutes) ;
- Les **5 verdicts de variantes proches** proposés sont documentés, aucune image remplacée sans votre accord.

### 4. Prochaine étape précise (ordre recommandé)

1. Installer la 1.4.4 par-dessus la 1.4.3 (ou 1.4.2), ouvrir une séance, vérifier les durées en minutes et l'absence de « Reprendre ma séance » fantôme — retour par message, même court.
2. Me donner la **règle de style** ; en attendant, je poursuis uniquement sur : le défaut de contexte tabata (corriger + tester + mesurer), la traçabilité des corrections d'images pré-approuvées, et la relecture pleine image des dessins restants.
3. **Audit : 51 groupes ouverts**, aucun fermé silencieusement, aucun validé définitivement. **IA conversationnelle toujours en dernier.**

## Étape précédente — 1.4.3 publiée : la séance oubliée ne bloque plus le programme ni les chronos (23 septembre 2026)

[Télécharger la 1.4.3](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/9856f57/downloads/Yanis-Fitness-Evolution-1.4.3.apk) · [consignes](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/9856f57/downloads/INSTALLATION-1.4.3.md) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/9856f57/downloads/Yanis-Fitness-Evolution-1.4.3.apk.sha256) · [fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/9856f57/downloads/Yanis-Fitness-Evolution-1.4.3.fidelity.json)

- **Décision appliquée** (« fais ce que tu recommande ») : une séance de musculation d'un **autre jour** est clôturée automatiquement en **« partielle »** — sa date réelle, ses séries validées, la séance planifiée du jour marquée du même statut, minuteur de repos retiré. Exactement ce que fait la modale « Terminer » : **aucune charge, répétition, consigne, image ou donnée réécrite**. Trois points d'application pour qu'aucun chemin ne reste bloqué : au **chargement**, au clic sur **« Lancer la séance »**, au clic sur une **minuterie guidée**. Une séance **du jour même** n'est jamais clôturée automatiquement (test dédié).
- **Le compteur ne peut plus afficher « 40320:00 »** : au-delà d'une heure il s'écrit en heures et minutes.
- **Vérifié sur le paquet réellement livré** : `evolution/media/tests/emilie-session-block.spec.mjs` (2 tests) — semaine 5, le bouton repasse à « Lancer la séance », l'historique montre la séance du 24/09 en « partielle » avec sa série conservée, le chrono « Lancer 30 secondes » **démarre**, le compteur affiche 00:00 ; semaine 9, aucune récidive. Avant/après consignés dans `review/REVIEW-EMILIE-BLOCAGE.md`, captures `review/emilie-{block,fixed}-*.png`.
- **APK 1.4.3** : `downloads/Yanis-Fitness-Evolution-1.4.3.apk`, 24 909 288 octets, SHA-256 `31e950848b0379830c09e9a4061eab49c812869343050747a0e163944941141c`, versionName 1.4.3 / code 14, **même identité que la 1.4.2** (`150e3846…`) ⇒ **installation par-dessus la 1.4.2 sans désinstallation**. Par rapport à la 1.4.2, seules deux entrées changent (manifeste + paquet web `52dfc705…`), **9/9 DEX identiques octet pour octet**, 271/272 fichiers web inchangés, **v2 + v3 vérifiées**, un signataire, alignement vérifié. Fichier **retéléchargé depuis GitHub et comparé octet pour octet** après publication.
- **Quatrième effacement d'espace de travail, cette fois sans dégât** : `.cache/`, `.private/` et le ZIP privé ont encore disparu, **mais la clé a été restaurée depuis le dépôt** (`evolution/signing/evolution-media-142.encrypted.json`) avec la clé de récupération — puis l'APK 1.4.3 a été signé avec cette identité restaurée. C'est la démonstration que la méthode durable tient : plus besoin de ZIP dans l'espace de travail.
- **Tests sur ce bundle** : Node **40/40** ; média **28/28 (3,8 min)** ; **suite d'origine complète 90/90 (9,2 min)** — les 90 tests historiques passent sur le web corrigé. Aucun essai sur téléphone réel.
- **Audit visuel inchangé** : 94/94 dessins relus au moins une fois, aucun validé définitivement, **48 groupes ouverts** ; celui de la séance oubliée **reste ouvert** (il ne sera fermé qu'après confirmation sur le téléphone d'Émilie) mais porte désormais la correction, sa preuve et sa limite.

### Prochaine étape précise

1. **Essai utilisateur** : si vous êtes déjà en 1.4.2 → installer la 1.4.3 **par-dessus** (rien à désinstaller) ; sinon exporter le JSON, désinstaller, installer, restaurer. Vérifier ensuite avec Émilie qu'une séance d'un autre jour n'apparaît plus en « Reprendre ma séance » et que son historique l'affiche en « Partielle » à sa date. 2. **Si un autre blocage subsiste** (par exemple sa séance datait d'hier seulement, ou l'écran « Reprendre » réapparaît) : me le dire, le groupe reste ouvert et une seconde cause sera cherchée. 3. Reprendre l'audit visuel : règle de style puis **48 groupes ouverts**, sans en fermer un seul silencieusement. **IA conversationnelle en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Dernière avancée — sauvegarde privée 1.4.2 récupérable + blocage d'Émilie reproduit (23 septembre 2026)

- **Sauvegarde privée** : `downloads/Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` (4 873 octets, SHA-256 `59323c9a048cc04fce831e8b2bc480a06cf3d75e7201e810efc80d58902067e0`) contient `.p12`, mot de passe, `identity.json`, `recovery-key.txt` et `A-LIRE.txt`. **Ne jamais publier ce ZIP sur GitHub** : il est en clair, et un commit est irréversible (le blob reste dans l'historique). Livré ici par lien local/aperçu et par la clé de récupération donnée dans la conversation.
- **Chemin de récupération durable, reprouvé aujourd'hui** : la copie **chiffrée** `evolution/signing/evolution-media-142.encrypted.json` (publique, commit `c17dccf`) + `recovery-key.txt` reconstruisent l'identité privée. Test réel : matériel privé déplacé, puis `python3 evolution/android/signing-media.py restore --recovery-key-file …` → **tous les fichiers reconstruits identiques octet pour octet**, certificat `150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b`. Le ZIP lui-même a été reconstruit à l'identique. Un espace de travail effacé ne peut donc plus faire perdre cette identité.
- **Blocage d'Émilie reproduit, pas déduit** (`review/REVIEW-EMILIE-BLOCAGE.md`, preuves `review/emilie-block-w5-*.png`, `w9-accueil.png`, spec `evolution/media/tests/emilie-session-block.spec.mjs`) : une séance de musculation **commencée et jamais clôturée** reste en mémoire. Semaines suivantes, l'accueil annonce « Reprendre ma séance », rouvre **la séance de la semaine 1 avec sa série déjà validée** (1/29 séries, compteur 40320:00), l'échauffement reste « Avant de commencer », la vue « Cette semaine » ne contient **aucun** « Validé »/« Terminée » — et **la minuterie est refusée** : « Lancer 30 secondes » ouvre la modale « Clôturer votre séance ». Tant que cette séance dort, ni le programme du jour ni le chronomètre ne démarrent. **Défaut hérité** : le mécanisme est identique dans les bundles 1.0.6, 1.3.0 et 1.4.0 publiés. **Rien n'est corrigé** : la proposition (clôturer automatiquement en « partielle » au changement de jour, ou demander explicitement) attend l'accord de l'utilisateur.
- **Tests** : `node --test` **39/39 vert** ; le nouveau test de traçabilité interdit de fermer ce groupe sans décision. `review/findings.json` : **48 groupes ouverts**.
- `review/emilie-block-*` conserve les captures ; les suites navigateur média/accueil n'ont pas été relancées (Chromium réinstallé, serveurs :5186/:5187 relancés pour la reproduction).

### Prochaine étape précise

1. **Décision utilisateur sur le blocage d'Émilie** : clôture automatique « partielle » au changement de jour (recommandé) ou choix explicite à l'ouverture. Dès l'accord, implémenter dans `candidate/build.mjs`, reconstruire, faire tomber le compteur 40320:00, puis reconstruire un APK (l'identité 1.4.2 est récupérable, donc possible). 2. Vérifier auprès d'Émilie si sa séance des premières semaines est **encore** proposée en « Reprendre ma séance » : si oui, le correctif est nécessaire ; si elle l'a clôturée, chercher la seconde cause. 3. Reprendre l'audit visuel : règle de style puis **48 groupes ouverts**, sans en fermer un seul silencieusement. **IA conversationnelle en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Dernière avancée — APK 1.4.2 publié avec une identité durable (23 septembre 2026)

**État : l'application corrigée est téléchargeable, et son identité de signature ne peut plus être perdue.** Un troisième effacement de l'espace de travail a eu lieu entre deux messages : il a détruit `.cache/`, `.private/` et **la sauvegarde de la clé 1.4.1**. Le dépôt Git, lui, a tout conservé. Deux conséquences, traitées dans cette étape.

[Télécharger la 1.4.2](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/Yanis-Fitness-Evolution-1.4.2.apk) · [consignes](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/INSTALLATION-1.4.2.md) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/Yanis-Fitness-Evolution-1.4.2.apk.sha256) · [fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/Yanis-Fitness-Evolution-1.4.2.fidelity.json)

- **Incident consigné, pas caché** : la 1.4.1 (`d3ca5a27…`) était signée avec une clé dont la seule sauvegarde était un ZIP en clair dans l'espace de travail. Cet espace est réinitialisé régulièrement : la clé est **détruite**, aucune mise à jour de cette installation n'est possible. Son APK reste publié mais **il ne faut pas l'installer**. C'est une faute de méthode, corrigée ci-dessous.
- **Méthode corrigée et éprouvée** : la nouvelle identité `150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b` est sauvegardée **chiffrée (AES-256-GCM) dans le dépôt public** — `evolution/signing/evolution-media-142.encrypted.json` — et la clé de récupération reste privée, chez l'utilisateur. La restauration a été **réellement testée** : fichiers privés supprimés, puis reconstruits depuis le seul fichier chiffré du dépôt, avec un contrôle qui **signe et vérifie** avec la clé restaurée (`evolution/android/signing-media.py`). C'est la convention déjà utilisée pour l'identité 1.4.0 ; elle est désormais appliquée à la lignée média.
- **APK publié** : `downloads/Yanis-Fitness-Evolution-1.4.2.apk`, 24 909 281 octets, SHA-256 `6e08516ec3a439bdfc7f68024fcb47feb26bae833fd443b3428251797734ceff`, versionName 1.4.2 / versionCode 13. **Contenu identique à la 1.4.1** : la seule entrée qui diffère entre les deux APK est `AndroidManifest.xml` (le numéro de version). Le paquet web est bien `b74853bc…`, celui validé en navigateur.
- **Fidélité et signature revérifiées** : 9/9 DEX identiques octet pour octet, 271/272 fichiers web inchangés, inventaire ZIP inchangé, signature **v2 + v3**, un signataire, alignement vérifié. L'APK a été **retéléchargé depuis GitHub après publication** et comparé octet pour octet : mêmes octets, même empreinte, `apksigner` y retrouve *Verifies* et le certificat `150e3846…`.
- **Les certificats existants sont intacts** : `7d6f9c8f…` (1.4.0) et `4d4fbd84…` (historique) ne sont ni régénérés ni remplacés. Seule une nouvelle identité a été créée, comme autorisé le 23 septembre.
- **Sauvegarde privée à récupérer maintenant** : `downloads/Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` (`.p12`, mot de passe, `recovery-key.txt`, mode d'emploi). Il est **ignoré par Git**. Sans lui, la copie chiffrée du dépôt reste inutilisable ; avec lui, tout l'espace de travail peut être reconstruit.
- **Suites sur cet environnement neuf** : `node --test` **38/38 vert**, bundle candidat reconstruit à l'identique (`b74853bc…`, reproductible depuis l'APK 1.4.0), `apksigner.jar` reconstruit à l'empreinte épinglée `ef494179…`. Les suites navigateur n'ont pas été relancées sur cet environnement (Chromium à réinstaller) ; elles portaient sur **exactement le même paquet web**, ce qui est vérifiable par empreinte et non par affirmation.
- **Audit visuel inchangé** : 94/94 dessins relus au moins une fois, aucun validé définitivement, **47 groupes ouverts**.

### Prochaine étape précise

Deux choses en parallèle. **(1) Côté utilisateur** : télécharger la 1.4.2, puis tester sur le téléphone — exporter le JSON dans la 1.4.0, désinstaller, installer, restaurer, et vérifier les blocs **piscine après musculation** ainsi que la conservation des charges et de l'historique. **(2) Côté audit** : reprendre les visuels — décider la **règle de style** avant toute nouvelle illustration, puis traiter les **47 groupes ouverts** sans en fermer un seul silencieusement : écarts de matériel (curl debout pour banc Scott, mollets debout pour presse à mollets, développé debout pour nuque/un bras, relevé suspendu pour relevé incliné, élévation latérale debout pour variantes assises/inclinées), approches d'échauffement restantes, affichage hérité des durées en secondes dans la modale, et les 79 alias de noms proches pas encore examinés un par un. Maintenir les bonnes animations, la récupération aquatique, les 209 exercices, les 11 rubriques, les deux profils, les étapes 1–7 et l'accueil validé. **IA conversationnelle en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Étape précédente — récupération piscine corrigée et carte d'alias livrée mise au jour

**23 septembre 2026 — toujours un candidat web, pas une nouvelle livraison APK.** SHA courant : `b74853bca4761ccb0f36a4f4612ed4e69b82f42b392dbf1cb7dfd7f6d047e373`. Il remplace `aba4c373…`, `8badf3aa…` et `5c041fb8…`. Les deux réassociations, l'échauffement ciblé et la protection piscine précédents sont conservés.

- **Le défaut piscine est reprouvé sur la 1.4.0 publiée**, pas seulement décrit : le web extrait de l'APK signé est servi localement et les mêmes tests y donnent **3 échecs / 4**. Un bloc « Piscine après musculation » y affiche la récupération **vélo/elliptique** pour deux prescriptions, et **aucune vignette** pour « 25 min de piscine à allure soutenue ». Le test `tests/pool-recovery.test.mjs` évalue la fonction `bg` **exacte du bundle signé**. Captures : `review/pool-defect-published-1.4.0-{30min,25min}.png`.
- **Trois verrous corrigés, un par couche fautive** : (1) l'aperçu de séance combinée passe désormais **le format du bloc** au résolveur, pas le segment hérité de l'import HTML (`G4` → `JarvisStepGuide`) ; (2) la **liste des étapes** suit le même segment — sans cela les étapes étiquetées `pool` n'étaient jamais affichées ; (3) le **chrono** (`Mg`) donne le segment `pool` aux étapes d'un composant déclaré `format:"pool"`, donc le contexte aquatique est appelé. Le contexte aquatique traite aussi un segment dont la clé de composant est déclarée pool. Le vrai bloc elliptique terrestre garde son guide sec.
- **12 textes piscine réellement livrés revus** (`candidate/pool-texts.json`) : 4 « Marche aquatique », 3 exacts + 4 représentatifs « Nage douce », 1 « Fractionné — nager ». Ordre de résolution : **texte revu** → mot-clé historique (conservé mais **non validé**) → **lacune explicite**. Jamais de repli cardio, jamais de photo générique, jamais l'image persistée d'une étape. Portée mesurée : `cardio.apres==="piscine"` = 26 occurrences, 12 textes uniques.
- **Vérifiable en images** : 12 captures candidat / 1.4.0 publiée (fiche **et** chrono), `review/pool-candidate-*.png` et `pool-reference-1.4.0-*.png`, script reproductible `candidate/capture-pool-review.mjs`. La fiche et le chrono montrent la même étape aquatique.
- **Carte d'alias livrée extraite** : **114 des 209 exercices n'ont aucun dessin propre** ; le bundle les résout par une carte d'alias (104 entrées) puis par similarité de nom. Résolution livrée : 95 exacts / 104 « variante » / 10 « famille », dont **25 alias sans aucune relation de nom**. Registre `review/alias-substitutions.json` (triage mot-à-mot, jamais une décision), rapport `review/REVIEW-ALIASES.md`.
- **Les 25 alias sans relation de nom sont revus un par un** (`review/alias-review.json`) : 19 écarts, 1 variante inversée (fente bulgare pied avant/arrière), 1 ambiguïté de libellé (« barre au front (pushdown triceps) »), 1 cas proche mais distinct (good morning), **2 refus de remplacement** (step-up), 1 corrigé par la réassociation revue. **Aucun groupe fermé.**
- **Fait lourd** : **16 des 17 dessins cibles sont déjà le visuel propre d'un autre exercice** — l'application montre le dessin d'un autre (pullovers → « Tirage vertical », ab wheel → « Jackknife sur swiss ball », wood chop → « Crunch à la poulie », clamshell → « Abduction assise machine », glute ham raise → « Leg curl allongé »). Groupe ouvert `resolution-by-another-exercise-drawing`.
- **Refus explicite** : le seul vrai dessin de step-up livré tient **deux haltères** alors que les deux prescriptions sont déclarées **au poids du corps** : il n'est pas substitué, **aucune consigne n'est réécrite**. Preuves `review/alias-stepup-candidate-12frames.png`, `review/alias-elastic-*.png` (12 images chacune), `review/alias-decisions-25-pass2.png`.
- **5 dessins cibles relus ici** (10 images, `review/alias-target-frames.json`) ; il reste **35 des 94 dessins livrés jamais relus** — groupe ouvert `thirtyfive-drawings-never-reviewed`. Aucune revendication « tous les exercices ont leur visuel ».
- **Familles de dessins relevées avant toute nouvelle illustration** (`review/illustration-survey.json`, `review/REVIEW-ILLUSTRATIONS.md`) : 71 dessins anatomiques filaires et 23 illustrations réalistes coexistent déjà, plus 3 photos cardio, 10 photos aquatiques et 30 photos étirements/échauffement. Ajouter un dessin créerait une **sixième famille** : décision de style à prendre explicitement.
- **Tests** : **37 tests Node PASS** (10 caractérisations/APK, 21 candidat, 6 traçabilité) ; **26 parcours navigateur ciblés PASS (3,5 min)** dont 3 blocs piscine après musculation et 1 bloc elliptique terrestre ; **8 accueil/11 rubriques PASS (57,9 s)** en comparaison stricte avec le web 1.4.0. Ni les 90 tests complets ni Android physique relancés.
- **Nouveau constat consigné, non corrigé** : les lignes d'étape de la modale combinée affichent la durée brute en secondes (« 1500 s ») — affichage hérité, identique en 1.4.0. **41 groupes ouverts**, aucun exercice promu automatiquement.
- **Intégrité** : 271/272 fichiers web identiques (seul `assets/public/assets/index-CBCies4k.js`), APK livré intact, **aucune image, identité ou signature ajoutée**, aucune migration de données, aucune prescription réécrite. Registres : `candidate/validation.json`, rapports `review/REVIEW-POOL.md`, `review/REVIEW-ALIASES.md`, `review/REVIEW-ILLUSTRATIONS.md`.
- **Note de continuité** : l'espace de travail de cette session a été recréé ; l'audit a été restauré depuis la branche `arena/01a0bd57-jarvis-fitness-yanis-emilie-ap` et poussé sur la branche de session (`cbe07b2`), puis complété. Les fichiers versionnés sont la source de vérité ; les caches régénérables (`.cache/`) sont reconstruits à la demande.

### Prochaine étape précise

Poursuivre la revue **dessin par dessin des 35 GIF jamais relus** (matériel, position, boucle), en priorité ceux qui servent de cible d'alias ; puis les dessins corrects pour **dips/triceps/fessiers** ; puis les étapes d'échauffement et approches restantes. Les 25 alias sans relation de nom sont revus individuellement : ne pas les rouvrir sans nouvelle preuve et **ne fermer aucun groupe** — les visuels manquants doivent être créés puis vérifiés, et la **règle de style** (ligne anatomique filaire ou illustration réaliste) doit être validée avant toute nouvelle image. Pour les anciennes approches sans identité, prévoir un traitement explicite des lacunes : **pas de remplacement depuis une séance qui aurait changé**. Maintenir les bonnes animations, la récupération aquatique, les 209 exercices, les 11 rubriques, les deux profils, les étapes 1–7 et l'accueil validé. **IA en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Étape précédente — pont au sol précis et échauffement ciblé (historique)

**23 septembre 2026 — toujours un candidat web, pas une nouvelle livraison APK.** Les deux réassociations précédentes et la protection piscine sont conservées. SHA courant : `5c041fb8d73a40bf0df0bbec64619ba5b54cc2682b85a0cb123ddcb43f8234c6`.

- **Fiche du pont au sol** : les trois phases décrivent maintenant les épaules au sol, les pieds à plat, la montée sans cambrure et les **2 secondes de contraction déjà prescrites**. Même précision par défaut en séance. Les notes/tips explicites du programme restent prioritaires. Le catalogue (2 × 15, tempo 2012, repos 45 s), la note source, respiration/erreurs et toutes les autres variantes restent inchangés : pas de changement global de `Yu.bridge`.
- **Activation fessiers d’échauffement** : bon GIF au sol en fiche et chrono. Les **10 répétitions / 60 s propres à cette phase** ne sont pas transformées en prescription de séance. Une ancienne étape sauvegardée est corrigée uniquement si contexte, nom, pattern, durée et consigne correspondent exactement ; l’ancienne image reste dans le stockage, aucune migration.
- **Approches des deux IDs déjà revus** (pont au sol et French press EZ) : bon visuel en fiche, chrono et zoom. Les nouvelles étapes conservent leur `exerciseId` / `mediaRole` via **les deux boutons de lancement**. Aucun changement de charge, pourcentage, arrondi, répétition ou durée. La validation finale du chrono marque toujours l’échauffement effectué et retire le chrono comme auparavant.
- **Limites** : mobilité hanches/chevilles, activation scapulaire et panneau général d’échauffement encore à traiter. Les **207 autres approches conservent leur visuel antérieur** ; les anciennes approches sans identité ne sont pas déduites de la séance actuelle. Le libellé générique « charge légère à choisir » existe encore pour le poids du corps. Ne pas annoncer tous les échauffements corrigés. **41 groupes ouverts** à la date de la dernière avancée, dips et autres variantes non résolus, aucun exercice accepté automatiquement comme définitivement validé.
- **32 tests Node PASS**, dont comparaison des 209 générateurs d’échauffement sur **1 254 combinaisons** charge/incrément ; **20 parcours navigateur ciblés PASS (3,2 min)** et **8 accueil/11 rubriques PASS (57,6 s)**. Deux profils, nouveaux et anciens chronos, zoom/rechargement, achèvement et conservation des données. Ni les 90 tests complets ni Android physique relancés.
- **271/272 fichiers web identiques** et APK livré intact ; aucune nouvelle image d’exercice, signature ou identité. Neuf fonctions ciblées autorisées par AST (`bg/v5/Kh/Z5/k5/Bg/a5/$5/j5`) et helpers ; tout le reste est identique. Seules les **deux réassociations** existantes et une **précision technique par ID** sont actives. Le dossier privé de signature reste absent : aucun nouvel APK possible dans cette étape sans restaurer l’identité existante.
- Harnais de tests : dépendance VM `lt.elite.PATTERN_INFO` extraite du véritable bundle ; sélection de vignette par classe, son nom accessible étant l’alt de l’image et non « Agrandir ». Une collecte parallèle a rencontré un ENOENT de dossier temporaire : **lancer les suites média puis accueil séquentiellement**. Le passage final est entièrement vert ; pas de contournement applicatif. Conserver `MEDIA_REVIEW_CANDIDATE=1` pour l’unique différence autorisée de libellé bibliothèque du pont.
- Captures réelles affichées/examinées et sauvegardées : `review/floor-bridge-technique-candidate.jpg`, `review/warmup-bridge-candidate.jpg`. Rapport : `review/REVIEW-WARMUP.md`. Métadonnées techniques : `candidate/technique-overrides.json`, helper `candidate/warmup-context.mjs`, tests `tests/warmup-candidate.*` et `candidate/validation.json`, sous `evolution/media/`.

### Prochaine étape précise

Continuer les dessins corrects pour dips/triceps/fessiers, puis couvrir les étapes d’échauffement et approches restantes. Pour les anciennes approches sans identité, prévoir un traitement explicite des lacunes : **pas de remplacement depuis une séance qui aurait changé**. Maintenir les bonnes animations, la récupération aquatique, les 209 exercices, les 11 rubriques, les deux profils, les étapes 1–7 et l’accueil validé. **IA en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Étape précédente — French press, bibliothèque et repos (historique)

**Continuer ici avec le même assistant ; actualiser ET présenter cette passation à chaque étape.** Préserver toute l’application validée, aucune refonte, aucune suppression de fonction, IA conversationnelle en dernier.

- **13 GIF courts / 26 images relus**, sur cinq planches, plus deux vignettes originales affichées/examinées. Registre `evolution/media/review/short-focus.json` ; rapport et comparaison `review/REVIEW-SHORT-FOCUS.md`, `review/french-press-comparison.jpg`. C’est une relecture ciblée parmi les 48 GIF courts, pas 13 nouveaux médias. Les 46 GIF longs/588 images restent tracés séparément : ne pas recommencer ce lot sans raison.
- **Deux réassociations cumulatives seulement** dans `candidate/association-overrides.json` : pont au sol → `/media/8eecb0152081ff26.gif` ; **French press barre EZ** → `/media/ea226c444f72de0f.gif` à la place de la poulie. Pour le French press, les deux positions et le conseil original embarqué « Coudes fixes, barre vers le front » ont été vérifiés. Ce dessin couché avec barre EZ existait déjà. Aucune photo ou nouvelle image ajoutée, aucun miroir/retournement, aucune définition/prescription modifiée. **207 autres résolutions identiques**, y compris la vraie variante poulie ; les haltères/pullover/California press ne sont pas remplacés arbitrairement par une barre EZ.
- **Bibliothèque corrigée pour ces deux identifiants** : vignettes WebP d’origine, copie de présentation immuable. Le pont affiche maintenant « GUIDE HUMAIN », pas l’ancienne anatomie générique. **Aperçu « ENSUITE » du repos et zoom** alignés aussi. Fiches, animation/pause, séance sauvegardée, aperçu/zoom et rechargement testés dans les deux profils. Aucune réécriture des charges, séances, historiques ou chronos.
- **Limites à garder visibles :** le French press est un GIF à deux positions clés, pas une vidéo continue ; pas de certification clinique. Les consignes génériques du pont mentionnent encore banc/sol et charge. Les échauffements/approches et `step.img` des autres chronos guidés restent à traiter. Le test du repos concerne la séance sauvegardée et son aperçu, PAS tous les minuteurs guidés. Dips toujours fautifs, proposition photo toujours non approuvée. **41 groupes ouverts** (dernier état), aucun exercice promu automatiquement en acceptation finale.
- **26 tests Node PASS** (9 caractérisations, 11 candidat, 6 traçabilité). **14 tests navigateur ciblés PASS en 2,1 min**, puis **8 accueil/11 rubriques PASS en 57,9 s** sur le même candidat. Rapport `candidate/validation.json`. Pas de reprise des 90 tests complets ni d’essai Android physique.
- Les nouveaux tests ont nécessité des corrections de fixtures, pas de contournement applicatif : convention `kg` remplacée par les conventions existantes ; abandon d’une modification artificielle du stockage pendant que l’app tourne, car la sauvegarde au déchargement la remplace. Cas initiaux isolés par exercice/profil, vrai rechargement inchangé. La comparaison accueil a correctement signalé le nouveau libellé du pont ; **`MEDIA_REVIEW_CANDIDATE=1` est requis** pour admettre seulement cette différence précise, avec assertions des libellés ET vignettes candidate/référence. Pas de masque global des textes ; comportement historique des tests conservé sans option.
- **SHA candidat courant : `148cef273a0e3223cc0c3bdb9bdba320163cf1da7582194fcc746155c46b52e8`**. Il remplace `b5ab9b…` (piscine + pont seul). Toujours **271/272 fichiers web identiques**, dont tous les médias. AST : seuls `bg`, `v5`, `Kh`, `Z5`, `k5` et helpers ciblés autorisés à différer ; accueil, catalogue, moteurs et étapes 1–7 inchangés. Sources React historiques NON utilisées pour reconstruire l’app.
- **Aucun nouvel APK**, aucune nouvelle identité/signature. La 1.4.0 publiée reste intacte ; son lien plus bas n’est PAS une livraison des corrections visuelles. `.private/yanis-fitness-evolution-home/` toujours absent, revérifié ; ne pas générer une autre clé ni demander sans cesse à l’utilisateur de chercher le ZIP.
- Capture Émilie sombre du French press et comparatif avant/après affichés et examinés dans ce passage : tête/appuis visibles et bon matériel. Ne pas assimiler ces images à la validation de toutes les surfaces.

### Reprise précise

1. Poursuivre les dessins exacts pour dips/triceps/fessiers, sans substitutions par famille ou matériel. Les dessins de tractions/step-up du lot court n’exposent pas une amplitude complète ; pas de réassociation automatique. Le GIF aquatique de jambe n’est pas un kickback terrestre.
2. Préciser les consignes **du seul pont au sol**, sans changer sa prescription ni la vraie variante sur banc ; traiter échauffements/approches et anciens chronos guidés par contexte/identifiant. Ne pas déclarer ces surfaces corrigées par le seul nouveau helper bibliothèque/repos.
3. Garder ce candidat cumulatif et les protections piscine ; compléter les médias manquants avant acceptation finale. Continuer à contrôler les 209 IDs et les autres catégories, les deux profils/thèmes, mouvement/boucle/cadrage et les données persistées.
4. Commandes : `node evolution/media/candidate/build.mjs`, `node evolution/media/coverage.mjs`, `node --test evolution/media/tests/*.test.mjs`. Planches courtes : `PYTHONPATH=.cache/image-tools python3 evolution/media/review_frames.py --short-focus --tile 300`. Reproduction navigateur/envs complets dans `evolution/media/candidate/README.md` ; ne pas oublier `MEDIA_REVIEW_CANDIDATE=1` pour les tests accueil sur ce candidat.
5. Mettre à jour et **présenter à nouveau `PASSATION.md`** à la prochaine étape. Aucun changement de chat imposé actuellement ; avertir avec 🚩 avant d’atteindre la limite.

## Étape précédente — animations longues et pont seul (historique, remplacé par le cumul ci-dessus)

L’utilisateur dit **« Poursuis »**. Toujours continuer dans ce chat et **présenter la passation à chaque étape**. Ne pas repartir de zéro ni remplacer globalement les visuels.

- **46 GIF longs / 588 images vus sur planches intégrales ordonnées**, quatre séquences agrandies (1, 12, 25, 35). Registre versionné : `evolution/media/review/long-animations.json`. Il contient hachages, tous les indices vus, observations et états par association. Script reproductible désormais sauvegardé : `evolution/media/review_frames.py`. Ce n’est pas une certification anatomique ni une lecture réelle de tous les GIF dans toutes les vues ; ne plus refaire ce lot sans raison, mais compléter sa validation en situation.
- **102 associations dans ce lot : 58 écarts, 23 variantes à préciser, 21 gestes de base cohérents**, sans acceptation finale automatique. Dix nouveaux groupes documentés (36 à cette date, **41 au dernier état**). Notamment kickback triceps/fessier, adduction/abduction, bilatéral/unilatéral et marche en pont/répétitions 1,5. Les incertitudes restent explicitement séparées des écarts certains.
- **209 identifiants suivis individuellement** dans `review/exercise-coverage.json`, dérivé par `evolution/media/coverage.mjs`. Les autres catégories restent dans l’inventaire et les constats ; ce registre musculation ne les déclare pas validées.
- **Une seule réassociation ajoutée au candidat piscine conservé** : `pont-fessier-au-sol-activation` → GIF existant `/media/8eecb0152081ff26.gif` (pont bilatéral au sol sans charge). Douze images et agrandissement vérifiés ; animation en fiche et pause/reprise testées pour les deux profils. Le vrai pont pieds sur banc garde `/media/0766d3a06bf79dc8.gif`. Les 208 autres résolutions restent identiques. Aucun média binaire, définition d’exercice, prescription, charge ou donnée modifié.
- **Limites explicites :** la vignette bibliothèque de ce pont lit encore `k.gif` et reste anatomique ; les consignes génériques `Yu.bridge` mentionnent encore banc/sol et charge. Images directes, échauffements et chronos enregistrés restent à examiner par surface. Le groupe pont n’est donc PAS clos. Le GIF de step-up avec haltères et celui d’abduction assise avec bande sont seulement des pistes, pas des remplacements intégrés ; ne pas substituer un matériel sans vérifier la prescription.
- **22 tests Node réussis** : 9 caractérisations de l’APK, 9 tests du candidat, 4 tests de traçabilité. **16 parcours navigateur réussis** : 8 ciblés piscine/pont puis les 8 tests accueil/11 rubriques sur le même candidat. Les nouveaux tests de fiche ont nécessité une correction de sélecteur (onglet Bibliothèque) et de méthode de capture (rendu GIF réel plutôt que canvas). Aucun contournement dans l’application pour rendre les tests verts. Pas de reprise des 90 tests complets ni de test Android physique.
- Bundle candidat courant SHA **`b5ab9b5570c00b7842d202ae8fb03fd23ef2c9f80f6f5046393a74aa9663d47f`**, remplace le candidat piscine seul `75f39ae8…`. Toujours **271/272 fichiers web identiques** à la 1.4.0. AST : seules `bg`, `v5`, `Kh` et le helper isolé changent ; tous les autres blocs identiques. Rapport `candidate/validation.json`, recette `candidate/README.md`, association explicite `candidate/association-overrides.json`.
- **APK 1.4.0 intact ; aucun APK corrigé livré.** Clé privée toujours absente, revérifiée ; aucune nouvelle identité créée ou autorisée. IA en pause.

**Prochaine étape :** poursuivre les réassociations exactes et les ressources manquantes, en priorité dips/triceps et variantes fessiers ; traiter les vues encore alimentées directement par un ancien `gif/img` sans effacer les données. Garder les sources déjà correctes et le candidat cumulatif. Rapport lisible : `evolution/media/review/REVIEW-ANIMATIONS.md`, comparatif du pont `review/floor-bridge-comparison.jpg`.

## Étape précédente — candidat piscine seul (historique)

**Dernière consigne utilisateur :** « Pour l'instant tu fonctionne encore. On poursuit avec toi et a chaque fois met moi la passation stp. Sur les autres chat c'était l'enfer il m'ont démonté l'appli ». **Continuer ici tant que possible ; actualiser ET présenter la passation à chaque étape. Ne pas imposer un changement de chat ni une refonte.**

### Travail effectivement effectué dans cette étape

- Ajout d’un **candidat web isolé**, reproductible depuis la 1.4.0 signée exacte : `evolution/media/candidate/`. Aucun APK modifié ou signé ; aucune nouvelle identité.
- Frontière piscine/cardio dans `bg` et affichage du chrono `v5` : une étape piscine connue réutilise son association aquatique, même si un vieux chrono contient une image elliptique. Visuel, guide et agrandissement utilisent la même association. Le segment de l’étape prime dans les séances mixtes ; les véritables blocs cardio restent inchangés.
- Les noms génériques sans guide aquatique affichent un message de lacune dans le chrono plutôt qu’un vélo/elliptique ou une photo trompeuse. **Ce n’est pas une couverture complète** ; les 26 groupes restent ouverts. Aucun dessin/animation remplacé ou déclaré validé par ce correctif.
- **271 des 272 fichiers web sont inchangés** ; seul le bundle ciblé diffère. Comparaison AST : toutes les autres instructions de premier niveau restent identiques, notamment catalogue, accueil, moteur des chronos et sept étapes. Aucun changement des consignes, durées, historiques ou sauvegardes.
- **17 tests Node réussis** (9 caractérisations de la 1.4.0 + 8 tests du candidat), **6 nouveaux parcours navigateur réussis** (deux profils/deux thèmes, reprise, zoom, pause/reprise, étape cardio réelle, isolation) et **8 tests accueil existants réussis** sur le candidat comparé à la 1.4.0, dont les 11 rubriques. Ce n’est PAS la totalité des 90 tests de livraison relancée, ni un test Android physique.
- Tests navigateur : premiers échecs dus aux sélecteurs, à l’écriture différée et à une fixture de mensuration incomplète ; tests corrigés, schéma de fixture désormais validé, passage complet final vert. Aucun changement applicatif supplémentaire pour contourner les échecs. Données exclusivement fictives.
- Rapport précis : `evolution/media/candidate/validation.json`, recette/limites : `candidate/README.md`. Bundle candidat SHA **`75f39ae838c5ae7fc96b624f4f21ed4b960820590226d814de03ca86ce4b0107`**. Sortie reproductible `.cache/media-pool-candidate/`, non suivie par Git. Ne pas la présenter comme un APK livré.
- **`.private/yanis-fitness-evolution-home/` toujours absent**, revérifié dans cette reprise. Pas de génération de clé. Le candidat ne nécessite pas de signature ; toute future livraison doit restaurer l’identité 1.4.0 existante.

### Prochaine étape précise

Compléter la revue traçable de toutes les images des animations et la table des associations exactes, priorités dips/triceps et récupération aquatique. Garder le candidat piscine comme base incrémentale, sans repartir de zéro. Les mauvais guides aquatiques anciens, les visuels manquants et les minuteries mixtes sans segment restent à résoudre. Le parcours exact de l’utilisateur n’a pas été reproduit sur téléphone. Préserver les médias valables et ne pas remplacer globalement par des photos.

## 🚩 Exigences de continuité et récupération piscine

L’utilisateur demande de remettre l’audit à jour **ici dans le chat** et de préciser pour la suite : **« faire une continuité à l’identique »**, **pas de coquilles dans les animations**, **tous les exercices pourvus**, et **pas de vélo lors de la récupération en nage fractionnée en piscine**. Il souhaite une passation avant que le chat ne ralentisse davantage. Ne pas supposer que les réponses interrompues ont été terminées.

### Consignes impératives pour la continuation

1. **Continuer l’application complète existante, pas une refonte ni une version allégée.** Conserver les deux profils, les 209 exercices/variantes, les 11 rubriques, les charges/historiques/données, les chronos, les étapes 1–7 et l’accueil validé : orbe bleu tournoyant, clair/sombre colorés, carte « Prochaine séance » avec photo d’origine. Continuité à l’identique de ce qui est validé ; corriger les défauts, pas les reproduire.
2. **Chaque exercice doit avoir son visuel correspondant**, dans musculation, échauffement/approches, piscine, Tabata sol/aqua et étirements. Aucun exercice oublié ; une image absente, générique ou d’un autre mouvement reste une lacune non résolue.
3. **Animations sans coquilles :** examiner chaque image et la boucle, tête/corps/appuis, matériel, posture, direction et cadrage dans l’application. Préserver les anciens visuels corrects. Ne pas changer les consignes pour justifier une mauvaise image, ni remplacer globalement les dessins par des photos. Le comparatif photo dips n’est toujours pas approuvé.
4. **Récupération en nage fractionnée : pas de vélo/elliptique à sec.** Montrer la récupération aquatique correspondant à la consigne (marche aquatique, nage douce ou bord selon l’étape), dans les fiches, chronos, agrandissements et minuteurs repris après fermeture. Ne pas supprimer les véritables blocs elliptiques des séances mixtes.
5. Même package/certificat 1.4.0 pour la future mise à jour ; pas de nouvelle identité. IA générale toujours en dernier. Fournir un vrai lien direct seulement après construction et vérification du futur APK corrigé.

### État de l’audit avant le candidat ciblé — historique conservé

- Branche de session récupérée par avance rapide depuis le dépôt distant jusqu’à `9526b3e` ; audit original au commit `58acfff`. Ne pas repartir de zéro.
- **26 groupes ouverts**, dont le nouveau `pool-recovery-to-cardio`. Le repli de `bg("Récupération active", "pool")` vers l’image d’elliptique a été reproduit en exécutant la fonction exacte du bundle signé. Le fichier a été vu : appareil elliptique à sec. Les 24 récupérations standard libellées « marche » se résolvent correctement dans ce résolveur : **le parcours exact du téléphone reste à reproduire**, ne pas prétendre l’avoir testé. Examiner aussi les séances complémentaires et `step.img` prioritaire dans `v5`.
- **9 tests de caractérisation/provenance passent** (6 existants + 3 nouveaux), avec SHA APK et bundle contrôlés. Ce ne sont pas des tests d’une application corrigée. Aucun nouveau test navigateur ou appareil.
- Les planches des 16 premières animations longues ont été affichées avant interruption ; aucun registre exhaustif de validation n’a été sauvegardé. Les planches/script temporaires n’ont pas survécu à cette nouvelle réinitialisation. Ne pas considérer les 46 animations longues/588 images comme intégralement validées ; compléter et tracer la revue.
- **Aucun média corrigé en production, aucun nouvel APK livré.** La 1.4.0 publiée reste inchangée, SHA `30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`.
- **Signature : `.private/yanis-fitness-evolution-home/` est absent**, existence revérifiée le 23 septembre. Sa présence mentionnée lors de la livraison était historique. Conservation externe du ZIP privé non confirmée. Le fichier chiffré Git seul ne suffit pas. Ne pas régénérer de clé ; restaurer cette même identité avant un futur APK signé. L’audit peut continuer sans clé. Ne pas demander de secrets dans le chat ni demander répétitivement de rechercher d’anciennes archives introuvables.

### Texte de reprise pour une nouvelle conversation

> Lis `PASSATION.md` et `evolution/media/README.md`, puis poursuis l’audit et les corrections des visuels de Yanis Fitness Evolution en continuité à l’identique de l’application complète 1.4.0 et du style validé. Ne repars pas de zéro et ne perds aucune fonction ni donnée. Tous les exercices de musculation, échauffement, piscine, Tabata et étirements doivent avoir un visuel fidèle ; contrôler toutes les images des animations, sans tête inversée, mauvaise posture ou mauvais matériel. Conserver les visuels corrects. En récupération de nage fractionnée, aucun vélo/elliptique : respecter la consigne aquatique, y compris dans les minuteurs enregistrés. Les **41 groupes d’anomalies** restent ouverts. La revue des 46 GIF longs/588 images est tracée dans `review/long-animations.json` ; continue sans recommencer cet inventaire. Reprends le candidat cumulatif `evolution/media/candidate/` (SHA `b74853bc…` : récupération piscine corrigée, deux réassociations, échauffement ciblé ; **37 tests Node et 26 parcours navigateur réussis**), sans le confondre avec un APK livré. Même identité 1.4.0, IA en dernier. Continue dans ce chat tant que possible ; actualise et présente la passation à chaque étape, puis précise la suivante.

### Ordre de reprise recommandé

1. Lire `evolution/media/README.md`, puis `review/findings.json` et les inventaires. Le problème porte sur **toutes les catégories**, pas seulement le GIF des dips.
2. Compléter l’inspection **image par image** des animations longues et vérifier les cadrages/orientations réellement affichés dans les fiches, agrandissements et chronos. Les planches première/médiane ne suffisent pas pour valider ces animations.
3. Conserver les anciens visuels corrects ; corriger les associations par **exercice, matériel, position et contexte sol/piscine**, sans modifier les exercices pour les faire correspondre aux images. Priorités identifiées : dips/triceps, approches d’échauffement, collisions Tabata/piscine, étirements erronés.
4. Le comparatif photographique des dips est une **proposition non approuvée**, pas un remplacement déjà accepté. Si un autre support est nécessaire, le montrer directement dans le chat et expliquer s’il s’agit d’animation ou de deux positions fixes. **Ne pas remplacer globalement les dessins par des photos** sous prétexte de cette demande.
5. Garder un état de revue explicite pour chaque correspondance. Une image générique ou l’absence signalée de démonstration ne satisfait pas « tous ont leur image correspondante » ; ne pas annoncer l’audit terminé avec ces lacunes.
6. Intégrer et tester les corrections sur toutes les surfaces, y compris les minuteurs déjà enregistrés, sans perdre les deux profils, les charges, les données, les sept étapes ou l’accueil validé. Ensuite seulement produire une mise à jour **avec le package et la signature 1.4.0 existants**, numéro de version augmenté, contrôles du nouvel APK et lien direct. **Aucune nouvelle identité autorisée ; IA en pause.**

## Priorité actuelle — audit/correction des visuels d’exercice (en cours)

Après réception du lien 1.4.0, l’utilisateur signale que les images animées ne sont plus comme avant et demande **toutes les catégories** : musculation, échauffement, piscine, Tabata, étirements ; exemple dips/triceps avec tête incohérente. **IA toujours en pause.**

- Rapport et scripts : **`evolution/media/README.md`** ; catalogue runtime complet `review/inventory-1.4.0.json`, métadonnées 137 médias/727 images internes décodées, **41 groupes d’anomalies ouverts** dans `review/findings.json`.
- **209 exercices, 29 étirements, 19 guides piscine, 420 étapes de 18 niveaux/6 protocoles, 38 noms Tabata au sol et 6 aqua**, 5 guides cardio inventoriés dans le vrai bundle signé. Les données ne viennent pas du vieux `Movement.jsx`.
- **262/262 images identiques au complet original fourni**, pas seulement à 1.3.0 ; cela ne prouve PAS leur justesse. Les deux images du GIF dips changent l’orientation du regard/haut du corps de façon incohérente. Ne pas tenter un retournement global.
- Correspondances fausses confirmées : hip thrust unilatéral/squat bulgare, step-up/fentes, tractions/tirage poulie, extensions triceps sur banc/poulie debout, etc. Échauffement : bras pour activation fessiers et développé couché pour toutes les approches. Étirements : plusieurs positions différentes du texte. Piscine : plusieurs gestes terrestres erronés.
- **Tabata au sol : 4 noms renvoient à un guide piscine ; 34 autres ne résolvent aucune démonstration et affichent la photo générique de récupération.** Résoudre par contexte, pas par mots-clés.
- Les planches première/médiane des 137 médias ont été vues ; cela couvre les deux images des 48 GIF à deux images. Les 46 animations 12/24 images ont maintenant été examinées sur planches intégrales ; voir le registre nouveau en tête, sans confondre revue sur planches et lecture réelle dans toutes les vues. Décodage réussi ≠ contenu correct.
- **9 tests de caractérisation/provenance de l’audit réussis au 23 septembre**, pas des tests d’une application corrigée. Aucun correctif de production, nouvel APK, remplacement de signature ou modification des séances à ce stade.
- **Proposition dips en photographies réelles**, non intégrée : `evolution/media/review/dips-comparaison.jpg`, provenance/licence à côté. Deux positions, pas une vidéo continue. Source `yuhonas/free-exercise-db` au commit `a859101d633a01c4a1a920d6a8ce41dabba0705f`. Aucun changement esthétique global validé à ce stade. Montrer le comparatif directement et clarifier le support des remplacements (dessins anatomiques / photos réelles en complément), car l’utilisateur veut retrouver ses anciens visuels.
- **Suite :** table explicite des gestes/matériels/positions/contextes, remplacements validés de chaque visuel fautif, suppression des replis trompeurs, tests de toutes les surfaces (y compris minuteurs persistés), puis mise à jour avec **la clé et le package 1.4.0 existants**, pas une nouvelle installation parallèle. Les sept étapes et l’accueil approuvé restent intacts.

## Dernier APK livré — 1.4.0 complet fabriqué, signé et vérifié

**Décision de livraison précédente :** après explication de l’installation séparée et du transfert JSON, l’utilisateur a choisi **« Oui, on y va »**, puis écrit **« Poursuis »**. Cette nouvelle autorisation a été utilisée pour **une** nouvelle identité. Ne pas la régénérer lors d’une reprise. L’IA générale reste en pause.

### Livrable actuel

- **`downloads/Yanis-Fitness-Evolution-1.4.0.apk`**, 24 905 185 octets : étapes 1–7 et accueil approuvé (orbe bleu tournoyant, clair/sombre colorés, carte photo d’origine).
- SHA-256 **`30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`**.
- **Publication vérifiée** au commit `653b95bcef9636527a14bef7fbc2b25331284613`. L’APK téléchargé depuis GitHub est identique octet pour octet au fichier testé. Lien direct : https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/653b95bcef9636527a14bef7fbc2b25331284613/downloads/Yanis-Fitness-Evolution-1.4.0.apk
- Release de test : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.4.0-evolution — la description pointe vers l’APK Git ; aucun asset attaché (upload EOF, ne pas inventer un lien `/releases/download/`).
- Notice : `downloads/INSTALLATION-1.4.0.md`. Rapports : `.fidelity.json`, `.apk.sha256`, `evolution/android/validation-home-release.json`, `evolution/android/HOME-RELEASE.md`.
- Nom exact **Yanis Fitness Evolution**, version **1.4.0 / code 11**, nouveau package **`app.yanis.fitness.evolution.home`**. Installation à côté des anciennes, transfert explicite des données par JSON. Les APK 1.3.0 et antérieurs restent inchangés.
- **90 tests navigateur réussis dans un passage complet sur le web extrait du nouvel APK signé**, 150 tests de logique, 4 tests d’intégrité, 8 tests APK/signature/récupération. Trois builds signés identiques. Signature v2/v3 et alignement vérifiés. Aucun test physique/emulateur, pas de promesse de son/micro/notifications OEM validés sur téléphone.
- 272 fichiers web, 271 inchangés ; **les neuf DEX Android sont identiques octet pour octet à la 1.3.0**. Quatre entrées ZIP changent : manifeste, table de ressources (package), configuration Capacitor et bundle web. Toutes les étapes natives sont conservées.
- Bundle web embarqué SHA **`f80a7e82cbe8d45b7c959541ce384c54f3694582eef14515467dbfef204f9f26`** ; correspond au candidat d’accueil validé `0586fc9c2402f6580eb20c6fd5ee49c735cd6cd257b08bf613bca1dda65ecb94`, avec uniquement `V 1.3.0` remplacé par `V 1.4.0`.

### Nouvelle signature — ne plus perdre la continuité

- Autorisation : `evolution/android/home-authorization.json`.
- Identité immuable : `evolution/android/identity-home.json` ; recette mutable : `release-home.json`, `build-home.py`.
- Certificat **`7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd`**.
- Privé présent à la livraison mais **absent lors de la vérification du 23 septembre** : `.private/yanis-fitness-evolution-home/` (hors Git, jamais servi par HTTP).
- ZIP **`Yanis-Fitness-Evolution-1.4-SAUVEGARDE-PRIVEE.zip`** présenté via le visualiseur pendant la fabrication. Ce ZIP contient les secrets ; **conservation externe non confirmée**. Demander de le conserver en deux endroits privés, sans réclamer le contenu ou un secret dans le chat.
- Copie chiffrée publique : `evolution/signing/evolution-home.encrypted.json`. Récupération documentée dans `evolution/signing/HOME-IDENTITY.md` via `signing-home.py`, **sans initialisation**. Un secret ou le ZIP privé reste indispensable.
- Chaque build signe après une restauration réelle de la sauvegarde chiffrée et vérifie le certificat. La présence d’une copie chiffrée ne remplace pas la conservation du secret.
- Ne pas lancer les anciennes recettes `signing-next.py` / `build.py --new-parallel` pour cette livraison : elles concernent la 1.3.0. Garder les anciennes identités et leurs APK intacts.

### Livraison déjà effectuée et vérifications téléphone

Le **lien direct de la 1.4.0 a déjà été donné**. Installation/import/test sur téléphone pour Yanis et Émilie, sans désinstaller les anciennes applications. La nouvelle installation portera le même nom : appuyer sur Ouvrir après l’installation puis vérifier la version 1.4.0. Accorder à nouveau les permissions et activer explicitement les rappels par profil si souhaité. Éviter les rappels doublons provenant des anciennes installations. Confirmer la conservation de la sauvegarde privée.

L’aperçu navigateur sur 5183 sert le contenu de **l’APK signé** depuis `.cache/home-signed-web/`. Ce n’est pas une installation Android. Les fichiers de cache et outils peuvent disparaître ; les sources, l’APK public, les rapports et la sauvegarde chiffrée sont dans Git. Ne jamais servir la racine du dépôt ni les fichiers privés. Les tests de référence utilisent la 1.3.0 extraite sur 5184.

**IA conversationnelle toujours en pause, prévue seulement après le retour de test demandé.**

## 1. Historique des demandes visuelles — priorité avant toute IA

L’utilisateur demande :

> « Avant de poursuivre préviens moi avec un drapeau rouge la limite du chat et une passation pour un nouveau chat. Peux tu me proposer un accueil de l’appli plus jarvisien, futuriste, et faire remonter. Avant de faire IA conversationnelle, et montre moi tes idées avant que je valide. »

- **IA conversationnelle en pause.** Aucun fournisseur, budget, hébergement ou accord de transfert de données choisi. Le questionnaire précédent a été ignoré ; ne pas déduire un accord cloud.
- **Montrer les idées AVANT validation.** Cet accord a depuis été reçu (« Parfait je valide ») pour la refonte de l’accueil, pas pour l’IA ou une autre identité.
- **Dernier choix explicite : organisation B + style lumineux/orbe A, avec les couleurs de l’application en mode clair.** Une nouvelle maquette a été demandée, pas une intégration. La séance, le point JARVIS et les priorités suivent donc la structure B ; aucune autre remontée de rubrique n’a été précisée.

> « l’organisation de B avec le style lumineux et l’orbe de A.,oui avec les couleurs quil y a sur mon appli en mode claire. Peux tu faire une nouvelle maquette en fonction de ca stp »

- L’utilisateur se perd dans le workspace : **montrer les images directement dans le chat**, pas seulement des chemins ou du code.
- **Dernière correction de l’utilisateur (révision 03) :** garder l’orbe **bleu et tournoyant**, montrer aussi un **sombre qui conserve des couleurs**, et retrouver l’ancienne présentation de « Prochaine séance » **avec l’homme sur la machine**. À ce moment, il s’agissait encore d’une demande de maquettes ; la validation explicite est venue ensuite (voir état actuel).

> « L'orbe de jarvis faudrait qu'il garde le bleu et tournoyant. En sombre faudrait quil garde aussi des couleurs. Peux tu me montrer en maquette. “Prochaine séance” je souhaite le format et la présentation d'avant avec le mec sur la machine. C'était top »

- Prévenir avec **🚩 PASSATION — NOUVEAU CHAT** quand une nouvelle conversation est prudente. Ne pas inventer un pourcentage de contexte restant ou garantir une alerte avant une coupure : aucun compteur exact n’est disponible.

## 2. Références visuelles — révision 03 validée

Dossier isolé : **`design/accueil-jarvis/`**.

**Version actuelle : `design/accueil-jarvis/revision-bleu/`.** Deux maquettes claire/sombre colorée, même orbe bleu quel que soit le profil, rotation CSS réelle avec pause et mouvements réduits. La carte séance reprend la photographie exacte et la hiérarchie d’origine, adaptée au format téléphone : homme sur la machine à droite, textes à gauche, bouton et lien programme. Image extraite de l’APK, identique au `training-hero.jpg` des sources, pas une nouvelle image générée. Les textes restent fictifs.

Les accents orange de Yanis et rose/violet d’Émilie restent dans les cartes/actions ; **l’orbe ne devient plus orange ou rose**. Clair : lavande/menthe pastel. Sombre : violet/vert profond, ambre et cyan, pas noir/gris uniforme. Révision 03 désormais validée et intégrée au candidat web décrit ci-dessus.

Historique des références conservées :

- **A — NEXUS / cockpit JARVIS** : bleu nuit/cyan, orbe technique, présence JARVIS marquée.
- **B — VECTOR / futuriste utile** : graphite/menthe, séance remontée en premier, briefing et priorité lisibles.
- **C — ORBIT / compagnon futuriste** : halo indigo, verre fumé, ambiance plus douce.
- **Nouvelle étude réalisée : B × A en mode clair**, sous `design/accueil-jarvis/clair/`. Orbe compact en regard du bonjour, séance en première carte, point JARVIS lavande, priorité menthe, programme et navigation. Palette relevée dans le CSS embarqué dans l’APK livré : Yanis ivoire/orange/corail et pastels ; Émilie rose/violet. Cette version claire a depuis été corrigée par la révision 03 (orbe bleu animé, carte photo et thème sombre). **Version historique remplacée par la révision 03 validée.** Les trois premières pistes restent conservées comme références.
- Les noms des pistes ne remplacent PAS le nom de l’application : **Yanis Fitness Evolution** reste inchangé.

À consulter en priorité :

- `design/accueil-jarvis/revision-bleu/maquette-claire.png` et `maquette-sombre.png` — images individuelles à afficher dans le chat.
- `design/accueil-jarvis/revision-bleu/comparatif.png` — les deux thèmes côte à côte.
- `design/accueil-jarvis/revision-bleu/orbe-bleu-anime.gif` — aperçu du mouvement (8 secondes, 100 images).
- `design/accueil-jarvis/revision-bleu/index.html` et `README.md` — prototype et documentation/provenance/tests. `serve.py` sert le design seul sur 5182, entrée par cette révision.

Étude claire précédente :

- `design/accueil-jarvis/clair/maquette-yanis.png` — nouvelle proposition principale claire.
- `design/accueil-jarvis/clair/maquette-emilie.png` — même organisation, palette Émilie.
- `design/accueil-jarvis/clair/index.html` — prototype autonome avec changement de profil ; les autres actions restent simulées.

Références initiales :

- `design/accueil-jarvis/propositions-accueil.png` — comparaison des trois propositions.
- `design/accueil-jarvis/proposition-a.png`, `proposition-b.png`, `proposition-c.png` — vues séparées.
- `design/accueil-jarvis/index.html` — étude visuelle consultable dans un navigateur.
- `design/accueil-jarvis/README.md` — intention, règles de hiérarchie et périmètre.

**Données fictives explicitement marquées.** Aucune sauvegarde sportive chargée. Les profils de démonstration changent seulement les textes (et les accents colorés dans la nouvelle étude claire), sans lire ni écrire les données personnelles. Dans le comparatif initial, les profils restent indépendants entre les trois propositions. Les autres boutons montrent un avertissement de maquette : pas de micro, réseau IA, envoi de message, sauvegarde ou lancement de séance.

Vérifications réalisées sur les maquettes seulement : trois concepts, sept largeurs de 320 à 1440 px sans débordement ni contenu recouvert par la navigation, changement de profil isolé, absence d’écriture dans les stockages web, d’appel externe et d’erreur JavaScript. **Ce ne sont pas de nouveaux tests de l’APK.**

Nouvelle étude claire : contrôles réussis pour **les deux profils × sept largeurs (320, 360, 390, 520, 768, 1024, 1440 px)**, palettes distinctes, aucune icône manquante, aucun texte tronqué ni recouvrement par la navigation ; actions inertes, stockages web vides, aucune requête externe ni erreur JavaScript. Deux PNG exportés et inspectés visuellement. Script : `design/accueil-jarvis/clair/render.mjs`.

Révision 03 : contrôles réussis **clair/sombre × Yanis/Émilie × sept largeurs**, photo originale et icônes chargées, pas de texte tronqué ni recouvrement de navigation/pied de carte. Rotation réellement vérifiée, pause/reprise, mouvements réduits, bleu indépendant du profil. Profils isolés, actions inertes, stockages web vides, aucune requête externe ni erreur JavaScript. PNG et GIF exportés et inspectés. SHA de l’APK revérifié inchangé. Scripts dans `revision-bleu/` ; images intermédiaires hors Git sous `.cache/`.

### Suite après validation

La révision 03 a été approuvée par **« Parfait je valide »** et intégrée sous `evolution/home/`. Consulter l’état actuel en tête de document : nouvelle installation séparée explicitement autorisée, APK 1.4.0 signé et contrôlé. Ne plus attendre une validation graphique déjà reçue et ne pas commencer l’IA à la place.

## 3. Livraison précédente 1.3.0 — à conserver, remplacée comme téléchargement principal par la 1.4.0

**Yanis Fitness Evolution 1.3.0**, versionCode 10, étapes 1 à 7 incluses, pas d’IA conversationnelle générale.

- Package : **`app.yanis.fitness.evolution`**.
- Certificat SHA-256 : `4d4fbd84463300631bb19e0186f4efc51c589a2e27da1ab56dc1f1ad5479e7dc`.
- APK : `downloads/Yanis-Fitness-Evolution-1.3.0.apk` ; 24 901 083 octets.
- SHA-256 : **`4c2efeaea0d1d59e9bc329f4b3651e2a860a1416bad900c23a15e0249622a323`**, revérifié pendant cette étude visuelle, APK inchangé.
- Livraison source : **`a62496689dacf7665470f7c65c906bc4f1f86dfa`**.
- Téléchargement direct : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/a62496689dacf7665470f7c65c906bc4f1f86dfa/downloads/Yanis-Fitness-Evolution-1.3.0.apk
- Release de test : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.3.0-evolution
- Notice : `downloads/INSTALLATION-1.3.0.md`.

Cette application séparée a été autorisée expressément après la perte de la signature précédente. Elle s’installe à côté des anciennes. **Ne pas désinstaller ou effacer les anciennes applications.** Exporter le JSON depuis celle qui contient les données récentes, importer dans la 1.3.0, vérifier Yanis ET Émilie et la conservation après fermeture/réouverture.

**Aucun retour de test sur téléphone n’a été fourni.** Ne pas présenter installation, acoustique, notifications/Doze/OEM/redémarrage comme validés sur appareil.

### Historique des contrôles de livraison, pas relancés pour ces maquettes

176 tests JS ; 86 parcours navigateur sur un même APK signé (78 lors du passage complet + 8 après correction des doubles/sélecteurs de test, sans changement de code applicatif) ; 25 scénarios natifs de notifications et 20 de voix avec services simulés, également après conversion du DEX final. Huit tests du nouvel APK, neuf contrôles publics historiques, treize tests de signature/récupération, cinq tests de ressources. L’ancienne archive privée absente a un test distinct explicitement ignoré. Trois builds signés identiques. Les détails sont dans `evolution/notifications/README.md`.

## 4. Historique de la signature 1.3.0 — nouvelle identité 1.4.0 décrite en tête

**Constat du 21 septembre :** le workspace a été retrouvé au commit initial `98291d5`. Les sources ont été récupérées depuis la branche distante par fetch et avance rapide, sans changer de branche ni écraser de modifications. Le dossier privé de la nouvelle signature **n’est pas présent dans cet environnement retrouvé**. Cela n’efface pas l’APK déjà publié ni les sources de l’étape 7 reconstruites et poussées.

- Identité publique immuable : `evolution/android/identity-next.json`.
- Livraison actuelle : `evolution/android/release-next.json`.
- Sauvegarde **chiffrée** conservée dans Git : `evolution/signing/evolution-next.encrypted.json` (AES-256-GCM).
- Archive privée remise dans la conversation précédente : **`Yanis-Fitness-Evolution-SAUVEGARDE-PRIVEE.zip`**. Elle contient le keystore, son mot de passe et `recovery-key.txt`. **Sa conservation externe n’a pas été confirmée.**
- La copie chiffrée ne peut pas être restaurée sans le secret. Ne pas affirmer le contraire et ne pas annoncer un futur APK signé tant que ce point n’est pas résolu.
- Restaurer depuis une copie privée selon `evolution/signing/NEXT-IDENTITY.md` et `evolution/android/signing-next.py`, vérifier le certificat attendu. Ne demander aucun secret en texte dans le chat, ne rien publier en clair et ne jamais servir `.private` par HTTP.
- **Ne jamais régénérer une clé, contourner les protections ou créer une autre application sans un nouvel accord explicite.** L’autorisation antérieure a déjà été utilisée pour la 1.3.0 ; elle n’autorise pas une succession d’identités.
- Les anciens `identity.json`/`release.json` concernent la 1.2.0. Ne pas les substituer à `identity-next.json`/`release-next.json`.

Les maquettes visuelles n’ont pas besoin de cette clé ; leur réalisation ne justifie ni nouveau keystore ni nouveau build.

## 5. Sources et exigences de conservation

Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.

Branche contenant les travaux : **`arena/01a0bd57-jarvis-fitness-yanis-emilie-ap`**. Dans une nouvelle session, respecter la branche imposée par Arena : consulter/récupérer ces commits sans changer arbitrairement de branche, sans reset destructif, sans travailler directement sur `main`. Vérifier l’état Git avant toute action.

- APK complet fourni : référence épinglée par `complete-hotfix/manifest.json`. Les extensions cumulatives sont dans `evolution/`.
- **Ne pas reconstruire l’application complète uniquement depuis les anciennes sources `JARVIS-Fitness-Source/`**, moins complètes. Elles servent aux outils/tests et au plugin vocal.
- Étapes présentes : `reminders`, `voice`, `spokesperson`, `appointments`, `adaptation`, `decisions`, `notifications`.
- Une consultation n’est pas une confirmation ; aucune adaptation ou saisie de bilan automatique.
- Poids ≠ mensurations ; pas de données de progression ou de récupération inventées.
- Profils et historiques séparés, brouillons préservés ; annulation des callbacks vocaux tardifs et priorité du chrono.
- Pas de faux état « micro actif », « capteur connecté », « IA en ligne » ni de score médical fictif dans la future interface.
- Garder les alertes de sécurité/stockage et les séances/chronos en cours prioritaires, même si un orbe est ajouté.
- Annoncer la prochaine étape après chaque étape terminée. **IA générale en dernier**.

> Lis `PASSATION.md` et `evolution/media/README.md`, puis poursuis l’audit des visuels de Yanis Fitness Evolution en continuité à l’identique de l’application complète 1.4.0 et du style validé. Ne repars pas de zéro et ne perds aucune fonction ni donnée. **Décision ferme de l’utilisateur (24 septembre 2026) : AUCUNE création d’image, la famille C est refusée, les visuels livrés sont conservés** — l’audit doit donc se faire uniquement par relecture, mesure et échange de dessins déjà livrés si l’utilisateur le demande explicitement. Tous les exercices doivent avoir un visuel fidèle ; contrôler les images, sans tête inversée, mauvaise posture ni mauvais matériel ; conserver les visuels corrects. En récupération de nage fractionnée, aucun vélo/elliptique ; en contexte terre, jamais de guide aquatique ; jamais réécrire une consigne. **La 1.4.6 est publiée** (`48676e12…` : piscine, séance oubliée clôturée, durées lisibles, Tabata au sol sans guide aquatique, deux visuels d’étirement échangés, cinq lacunes explicites en piscine — identité durable `150e3846…`, installation directe par-dessus la 1.4.5). C’est le seul APK à installer. Le candidat cumulatif est `evolution/media/candidate/` (**bundle `e372a369…`**, Node **46/46**). **51 groupes ouverts**, deux clos par décision explicite citée mot pour mot. Continue dans ce chat tant que possible ; actualise ET présente la passation à chaque étape ; avertir avec 🚩 avant la limite.

Si une validation ou des corrections sont données après cette passation, mettre à jour ce document avec les mots exacts de l’utilisateur et les éventuelles réserves avant de démarrer l’intégration.
