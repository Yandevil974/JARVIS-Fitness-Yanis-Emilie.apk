# PASSATION — JARVIS Fitness (Yanis & Émilie) — version du 15 octobre 2026

> **Mode d'emploi** : colle tout ce fichier dans un nouveau chat, en premier message.
> Il contient la mission, l'ordre de travail, l'état exact mesuré et les règles non négociables.
> **Cette version remplace celle du 13/10** (corrections : branche réelle, ancre du bundle,
> runtime portable, pièges de sandbox).

---

## ⚠ POINT D'ATTENTION IMMÉDIAT (à traiter en premier)

**3 GIF du lot 1 musculation sont PRÊS, PRÉSENTÉS et NON INTÉGRÉS.** Ils attendent un
feu vert **explicite en toutes lettres** (ex. « OK intégration des 3 GIF »).
Un « Y » isolé = RELANCER LE CHAT, ce n'est **PAS** une validation (règle de l'utilisateur,
répétée le 15/10). Ne rien intégrer tant que la phrase n'est pas claire.

---

## 1. LA MISSION

Terminer l'app de fitness JARVIS (musculation, natation, cardio, aqua) pour Yanis et Émilie.

Trois objectifs, dans cet ordre de priorité :

1. **L'app doit marcher et être rapide.** On ne bloque JAMAIS la livraison pour un GIF.
2. **Corriger les décors et animations** (sol sablé clair, décor terrasse mer, athlète figé).
3. **Compléter les exercices qui n'ont pas d'animation** (le gros chantier).

---

## 2. OÙ EST LE CODE

- Dépôt : `/home/user/JARVIS-Fitness-Yanis-Emilie.apk` (dossier `yanis-fitness-evolution/`)
- **La branche qui contient TOUT le travail : `arena/f60f808f-jarvis-fitness-yanis-emilie-ap`**
  (au 15/10 : commit `3f59dab`).
- ⚠ **Une nouvelle session Arena repart du clone vierge de `main`.** Au démarrage :
  `git fetch origin arena/f60f808f-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD`
  puis `cd yanis-fitness-evolution && npm install` et
  `pip3 install --break-system-packages numpy pillow`.
- **Pousser CHAQUE commit immédiatement** (`git push origin <votre branche de session>`).
  La sandbox est réinitialisée sans prévenir (déjà 3 fois) : `.git` revient au clone vierge,
  `node_modules`, `numpy/pillow` et `/tmp` disparaissent. **Un travail non poussé = perdu**
  (3 images validées ont été perdues comme ça le 15/10).
- Ne JAMAIS créer d'autre branche, jamais de force-push, ne pousser que sur votre branche
  de session (celle du sandbox). L'ancienne branche `arena/b4c56c3f-…` est historique
  (elle s'arrête au commit `558ddf3`) : ne pas y pousser.
- Lancer l'app : `cd yanis-fitness-evolution && npm install && npm run dev` (port 5173).
- Tests : `npm test` → attendu **96 tests · 94 passés · 0 échec · 2 ignorés**.

---

## 3. ORDRE DE TRAVAIL IMPOSÉ (à respecter strictement)

Module par module, dans cet ordre ; **terminer un module avant le suivant**.
Mesurer l'état réel avant de proposer quoi que ce soit.

| # | Module | État au 15/10/2026 |
|---|---|---|
| 1 | Échauffement | ✅ TERMINÉ ET INTÉGRÉ |
| 2 | Étirement | 🟢 OK — 100 % des visuels (29) |
| 3 | **Musculation** | 🔴 **EN COURS** — lot 1 (3 polyarticulaires) : 3 GIF prêts à intégrer · puis 85 autres exercices à animer |
| 4 | Fractionné | 🟢 OK |
| 5 | Chronométrée | 🔴 19 étapes piscine sans visuel |
| 6 | Elliptique | 🟢 OK |
| 7 | Piscine | 🔴 135 étapes sans visuel |
| 8 | Tabata | 🔴 48 mouvements, 0 % de visuel, motifs attribués non conformes |
| 9 | Aqua | 🟢 OK (77 étapes, 100 %) |

**Module en cours = 3 (musculation).** Ne pas attaquer le 8 avant.

---

## 4. RÈGLES INCONTOURNABLES — À NE JAMAIS ENFREINDRE

### 4.1 Protocole de validation (non négociable)

1. Pour un nouvel exercice : produire d'abord **1 image fixe** (par lot de 3 exercices :
   présenter les 3 images fixes d'un coup).
2. Attendre un **accord EXPLICITE en toutes lettres** de l'utilisateur.
3. Seulement ensuite produire le GIF (format app : 5 images **A → M → B → M → A**).
4. **Chaque GIF est présenté AVANT intégration.**
5. **Un « Y » isolé = relancer le chat. Ce n'est PAS une validation.** Rien n'entre
   dans l'app sans feu vert explicite. L'utilisateur l'a rappelé lui-même le 15/10.
6. **Ne jamais régénérer un GIF/une pose déjà conforme.**
7. Protocole courant validé par l'utilisateur : **par lot de 3 exercices**, 3 images fixes
   → accord → 3 GIF → présentation → accord → intégration.

### 4.2 L'athlète est FIGÉ — intouchable

Mannequin 3D très musclé, corps blanc/argent **mat**, **visage noir sans traits**,
**casquette blanche**, **short noir**, **baskets blanches**, **muscles jaune-orangé doré**.

- Référence unique : `animations/_locked/reference/00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg`
- Vérifier silhouette, échelle, accessoires et muscles à chaque génération
  (contrôle « masse musculaire » déjà demandé : planche
  `animations/_locked/PLANCHE-MUSCULATURE-controle-2026-10-13.jpg`, ratios cuisses/tête
  ≥ à la référence = pas de perte).

### 4.3 Le décor est FIGÉ — décor « E1 » (dense)

Terrasse vue mer : **mer bleue dense** à l'horizon, **végétation dense** (palmiers, plantes
en pot), **lumière dorée**, muret bas secondaire. Saturation cible **22 à 47**.

**INTERDITS** : salle, parquet, mur intérieur, miroir, fond gris, petits pavés gris à joints
sombres, décor pâle (saturation < 22). → **Ne jamais réaligner sur le décor PÂLE.**

### 4.4 Le sol doit être sablé clair

- Cible : **232 211 188** (R, V, B) — plage validée **219–253** sur la colonne `sol_dom`.
- En dessous de 215 en rouge → à refaire. Sur les exercices au sol, le contrôle visuel fait foi.

### 4.5 Les couleurs

- Muscles : **jaune-orangé doré** (JAMAIS vert lime, jamais rouge). Mer : **bleue dense**. Sol : **sablé clair**.

### 4.6 Autres règles

- **1 exercice = 1 animation.** Jamais de mutualisation d'un GIF entre deux exercices.
- **Avant toute proposition**, vérifier les poses sur des sites de fitness de référence
  (posture, amplitude, prise, angle, matériel) **et** l'athlète, le décor et la couleur.
  **Consigner les références consultées.**
- Si l'agent a la vision (les images s'affichent via `read_file`) : **vérifier soi-même**
  chaque image avant de présenter (pose, prise, athlète, décor). Ne jamais prétendre avoir
  vu ce qui n'a pas pu être vu ; sinon substituts : mesures chiffrées + NCC + planche.

---

## 5. LES OUTILS (déjà écrits, dans le dépôt)

| Outil | Emplacement | Ce qu'il fait |
|---|---|---|
| Mesure d'image | `animations/_locked/build/verifier-pose.py` | Mesure `sol_dom`, saturation, mer, végétation, lime, muscles dorés. Ne juge PAS la posture. (`--frames` pour les GIF.) |
| Compteur manquant | `animations/_locked/build/lister-sans-animation.py` | Exercices sans animation (`--liste`, `--json`). Reproduit la résolution de `library.js`. |
| Audit des 9 modules | `scripts/audit-modules.mjs` | `node scripts/audit-modules.mjs` |
| Fabrication GIF | `animations/_locked/build/faire-gif.sh` | `./faire-gif.sh A.png M.png B.png 440x246 sortie.gif` (depuis `_locked/build/`). Délais 25/20/50/20/25 cs. |
| État des modules | `ETAT-MODULES.md` | Tableau de bord |
| Assemblage libellés | `convert -font DejaVuSans-Bold.ttf -annotate` | `montage -label` échoue (police helvetica absente). |

⚠ `verifier-pose.py` exige **numpy** + **pillow**
(`pip3 install --break-system-packages numpy pillow`) — **à réinstaller après chaque
réinitialisation de sandbox**, comme `npm install`.
`npm run build:portable` exige esbuild : `npm install --no-save esbuild`.

---

## 6. COMMENT INTÉGRER UN GIF DANS L'APP — LES 5 ENDROITS (+ 1)

Procédure exacte, déjà utilisée à plusieurs reprises.

1. **Copier le GIF dans `public/media/` ET `release/media/`**
   → nom = **sha256 du contenu, 16 premiers caractères** (`sha256sum f.gif | cut -c1-16`).
   Vérifier l'absence de collision de nom.
2. **Régénérer `public/media-index.json`** : liste JSON plate, **TRIÉE**, chemins préfixés `/`,
   en JSON compact (`separators=(",",":")`), en parcourant `public/` en excluant
   `runtime.js`, `runtime.css`, `media-index.json`. Puis **copier le même fichier** vers
   `release/media-index.json`.
   ⚠ `npm run build:portable` réécrit ce fichier **NON TRIÉ** : toujours re-trier après.
3. **Ajouter le guide dans `src/data/legacy.json`** :
   - exercices **élite** → `elite.MUSCU_GUIDES` · exercices **Émilie** → `emilie.MUSCU_GUIDES`
   - `"Nom de l'exercice": {"img": "/media/<sha256>.gif", "tip": "💡 Conseil court."}`
   - édition **uniquement** via `json.load` / `json.dumps(..., ensure_ascii=False, indent=1)`
     (aller-retour sans perte ; c'est le seul format à utiliser).
4. **Patcher le bundle `release/assets/index-BLZxzv9Y.js` EN BINAIRE** (jamais en texte :
   UTF-8 avec emojis). Trouver les deux occurrences de `MUSCU_GUIDES":{` :
   - **1ʳᵉ occurrence = table ÉMILIE** (commence par `back squat barre haute`,
     `abduction assise (machine ou elastique)`, …)
   - **2ᵉ occurrence = table ÉLITE** (commence par `Pompes`, `Fentes arrière au poids
     du corps`, …)
   ⚠ **L'ancien critère « les 400 octets suivants contiennent `tractions (pull-up)` » est
   PÉRIMÉ** (le marqueur est à +620 o depuis les ajouts du stock). Se fier aux **clés de
   tête** ci-dessus. Insérer le bloc, vérifier le delta de taille et `node --check`.
5. **Vérifier** : `npm test` (94/0), les GIF en `HTTP 200 · image/gif`, anciennes références
   à 0 dans les **données** (legacy.json, bundle, runtime) — les anciens **fichiers** restent
   sur le disque et dans media-index (aucune suppression).
6. **+1 — runtime portable** : `public/runtime.js` et `release/runtime.js` embarquent les
   données. Après toute modification de `legacy.json`/`visuals.js` :
   `npm run build:portable`, re-trier `public/media-index.json`, puis copier
   `public/runtime.js` et `public/media-index.json` vers `release/`.
   (Sans ça, l'export portable a déjà gardé 3 vieux JPG pendant des tours entiers.)

⚠ **NE PAS reconstruire l'app avec un bundler** : `vite build` écraserait `release/`.
On **patche**, on ne reconstruit pas.

---

## 7. PIÈGES DÉJÀ PAYÉS — NE PAS LES REFAIRE

1. **Le coin bas-gauche n'est PAS le sol.** Utiliser la colonne `sol_dom`
   (couleur majoritaire des pixels clairs des 45 % du bas).
2. **L'édition minimale ne fonctionne pas** (couleur OU pose) : le générateur renvoie une
   image quasi identique (preuve le 15/10 : pose B des fentes → NCC **0,9994**, 0,16 % de
   pixels changés). → **Régénérer en complet** avec les 2 références verrouillées
   (`BASE-decor-sol-sable-valide.png` + `BASE-athlete-reference-utilisateur`) et la pose
   décrite en entier. Repères NCC : même pose/décor différent ≈ 0,73-0,86 · édition minimale
   ≈ 0,98 · pose différente ≈ 0,88-0,96 · exercice différent < 0,1.
3. **Mesurer la mer sur l'image entière** (la bande haute = le ciel). Seuil outil 3 % ;
   minimum des GIF validés **1,86 %** → 2,3-2,9 % est acceptable **sous réserve du contrôle
   visuel** (mer bien visible).
4. **`-delay` devant CHAQUE image** d'une commande ImageMagick (sinon animation cassée).
5. **Un GIF conforme ne se régénère pas.**
6. **Réinitialisations de sandbox** : tout ce qui n'est pas poussé disparaît ; le dossier
   `build/` est exclu des snapshots. Récupération :
   `git fetch origin arena/f60f808f-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD`.
7. `index-D_-dR1q5.js` (1,36 Mo) est un **bundle mort** : suppression proposée mais
   **jamais autorisée** → ne pas y toucher.
8. Les poses validées A/M/B se fabriquent en **générations complètes** (NCC entre poses
   ≈ 0,88-0,96) ; assembler avec `faire-gif.sh` (A→M→B→M→A, 440x246).

---

## 8. ÉTAT EXACT AU 15 OCTOBRE 2026 (mesuré, pas estimé)

### Fait et poussé (branche `arena/f60f808f-…`)

- **Module 1 (échauffement) intégré** : 3 JPG pâles remplacés par
  `4d6d57f97bdd691e.gif` · `6d278876a579cbc8.gif` · `0c5a8fe6ba79eb47.gif`.
- **4 animations du stock intégrées** (pompes, fentes arrière PDC, mobilité épaules,
  respiration diaphragmatique) → 55 guides élite.
- **Abduction de hanche INTÉGRÉE** le 15/10 : `/media/0e3fd7381f21657e.gif`
  (sol 229-235, 335 342 o) dans les 5 endroits + runtime ; `npm test` 94/0 ;
  ancienne ref `b49969e64dc275f5.gif` à 0 dans les données (fichier conservé).
- **Contrôle musculature** (demandé par l'utilisateur) : **pas de perte**
  (planche `PLANCHE-MUSCULATURE-controle-2026-10-13.jpg`, ratios cuisses/tête
  1,21-1,70x vs 1,27x pour la photo de référence).
- **LOT 1 (polyarticulaires) — 3 GIF prêts, mesurés, PRÉSENTÉS, NON INTÉGRÉS** :

| GIF | Mesures (5 frames) | Verdict |
|---|---|---|
| `01-developpe-couche-barre-3poses.gif` | sol 227-235 · sat 41,6-42,9 · mer 2,8-3,9 % · lime ≤0,05 · or 4,4-5,0 | conforme (mer limite sur 2 frames) |
| `02-tractions-prise-large-3poses.gif` | sol 229-233 · sat 43,7-46,1 · mer 2,6-3,4 % · lime ≤0,07 · or 4,2-5,1 | conforme (mer limite sur 3 frames) |
| `03-fentes-barre-3poses.gif` | sol 225-234 · sat 43,2-45,1 · mer 2,4-2,7 % · lime ≤0,06 · or 5,8-6,1 | mer sous 3 % (visuel OK) ; joints de sol très atténués sur la pose B |

  Tous en 440x246, délais 25/20/50/20/25 cs, ≈ 320 Ko. Chemin :
  `animations/_locked/candidats/2026-10-13-lot1/`.
- `npm test` = **96 · 94 passés · 0 échec · 2 ignorés** · media-index **285 entrées**.

### En attente (ne rien faire sans accord)

- **L'intégration des 3 GIF du lot 1** (feu vert explicite exigé).
- Les 4 GIF pâles + 3 au sol gris de l'audit (pallof 14,3 · abduction assise 14,5 ·
  squat cycliste 14,8 · squat poids du corps 15,2 · bulgarian-CORRIGE 195-198 ·
  face-pull 196 · pallof 177-213), et les 3 alertes R7 à revérifier avec `sol_dom`.
- **Squat au poids du corps** : écarté (clignotement saturation 15,2→47,7) — à refaire.
- **Rowing à l'élastique** : aucun GIF.
- Compteur : **209 exercices · 121 avec animation · 88 sans** (86 élite + rowing élastique
  + squat PDC). Par muscle : bic 16 · qua 13 · tri 12 · dos 11 · pec 9 · isc 7 · epA 6 ·
  abs 5 · epL 4 · epP 3 · mol 1 · lom 1.
- `release/assets/index-D_-dR1q5.js` : **ne pas toucher**.

### Documents de référence dans le dépôt

`ETAT-MODULES.md` · `animations/_locked/RAPPORT-R8.md` (mesure du sol, `sol_dom`) ·
`animations/_audit/2026-10-11/` (audits et GIF sources) ·
`animations/_locked/build/corrections/` (planches et candidats) ·
`animations/_locked/REFERENCE-VERROUILLEE.md` (le verrou) ·
`animations/_locked/PLANCHE-MUSCULATURE-controle-2026-10-13.jpg`.

---

## 9. CE QU'IL FAUT DEMANDER À L'UTILISATEUR AVANT D'AGIR

1. **En premier** : le feu vert explicite pour intégrer les 3 GIF du lot 1
   (phrase en toutes lettres ; un « Y » ne suffit **jamais**).
2. Puis continuer **par lots de 3 exercices polyarticulaires** (pec / dos / qua) :
   3 images fixes → accord explicite → 3 GIF → présentation → accord → intégration.
   **Ne pas lancer 26 tours d'un coup.**
3. En cas de message « Y » ou message incomplet : c'est une relance de chat bloqué →
   **ne pas en tenir compte**, ne rien intégrer, redemander poliment une phrase claire.

Et toujours : **mesurer avant de proposer, présenter avant d'intégrer, ne rien mettre
dans l'app sans feu vert explicite.**
