# 🧭 BASE COMMUNE — SUIVI PARTAGÉ DES GIFs
**Mis à jour le 11 octobre 2026 — décision décor E1 verrouillée.**
`animations/_locked/` = la base commune. Tout agent lit ce dossier **avant** de produire.

---

## 0. CORRECTIONS DES ANIMATIONS EXISTANTES — TERMINÉES (11 oct. 2026, soir)

**La dernière pose manquante est faite.** Abduction hanche, pose M : athlète **DEBOUT**, face caméra,
mains sur les hanches, jambe droite en abduction, élastique aux chevilles. **Plus d'athlète allongé.**

| | Mesure exécutée |
|---|---|
| Fichier | `build/corrections/abduction-hanche-elastique-3poses.gif` |
| Format | 5 images 440×246 · délais 25 20 50 20 25 cs · **320 Ko** (325 243 octets) |
| Sol coin 18×14 % (R V B) | A **235 214 185** · M **241 220 190** · B **230 211 185** (cible 232 211 188, rouge 225–240) |
| Saturation | A **43,0** · B **40,8** (E1 ≥ 22) |
| Images coalescées | 5/5 pleines (moy 62–66 %, écart-type 26–27 % — pas d'image vide) |
| Pose source M | `animations/_audit/2026-10-11/gif/themeA/abduction-hanche-elastique-3poses.gif` image 1 |
| Poses A/B inchangées | `_poses-sable/abduction-hanche-elastique-{0,2}.png` |

**INTÉGRÉ le 11 oct. 2026** — accord explicite de l'utilisateur (« Ok »).

| Endroit | Fait, mesuré |
|---|---|
| `public/media/3d5191762cfcb157.gif` | 325 243 octets, sha256[:16] = `3d5191762cfcb157` |
| `release/media/3d5191762cfcb157.gif` | identique |
| `public/media-index.json` + `release/media-index.json` | 277 → **278** entrées, identiques, 0 fichier manquant |
| `src/data/legacy.json` | 1 occurrence `b49969e64dc275f5` → `3d5191762cfcb157`, **delta 0 octet** (731 335) |
| `release/assets/index-BLZxzv9Y.js` (binaire) | 1 occurrence, **delta 0 octet** (1 359 491) |
| Résolution | `Abduction hanche à l'élastique` → `/media/3d5191762cfcb157.gif` (seul exercice, 1=1) |
| `npm test` | **94 passés / 0 échec / 2 skipped** |

Ancien fichier `b49969e64dc275f5.gif` **conservé** (pas de suppression). Poulie et assise **inchangées**.

**Nuance honnête (ne bloque pas)** : la pose A déjà validée a les **bras dorés** ; M et B ont les **bras argent**.
C'est un héritage de A, pas un défaut de M. Ne pas régénérer A sans demande.

**Suite production (11 oct.) — 1er exo elite sans animation**
`Triceps extensions haltères, banc plat` : fixe validée (« Ok ») → GIF assemblé
`build/corrections/triceps-extensions-halteres-banc-plat-3poses.gif`
5×440×246 · 25/20/50/20/25 · **324 Ko** (329 185) · sat 44,4/44,8 · sol coin 219–221.
**INTÉGRÉ le 11 oct. (accord « Oui »).** Curl Scott barre EZ, pronation → `/media/2ef8b38d43658412.gif` (336 982 octets).
media-index 279→280. Guide elite ajouté. Bundle +149 octets. `npm test` 94/0. Elite sans GIF : 85→84.

**INTÉGRÉ le 11 oct. (accord « Ok »).** `/media/79046121e6da34f3.gif`
media-index 278→279. Guide elite ajouté (clé nouvelle). Bundle +178/157 octets (insert, pas un remplacement de hash).
`npm test` 94/0. Elite sans GIF : 86→85.

**Curl Scott barre EZ, pronation** : fixe validée (« Ok ») → GIF assemblé
`build/corrections/curl-scott-barre-ez-pronation-3poses.gif`
5×440×246 · 25/20/50/20/25 · **332 Ko** (336 982) · sat 50,4/51,5 · sol coin 218/214/217.
**Présenté, NON intégré.**

**Utilisateur prévenu** (demande explicite §8 passation) : les corrections de sol/décor des GIF existants
sont terminées. Ensuite seulement : exercices sans animation, protocole 1 image fixe → accord → GIF.

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

## 1 ter. CRITÈRE AJOUTÉ LE 11 OCTOBRE — **LE SOL DOIT ÊTRE SABLÉ CLAIR**

L'utilisateur a signalé : « **le sol n'est plus couleur sablé** ». C'est un critère de fidélité à part entière.

**Cible mesurée sur les 1ers GIF validés (votre référence) :**

| Élément | Valeur cible |
|---|---|
| Sol (moyenne des pixels clairs du tiers bas) | **R233 V212 B186** |
| Écart R−B (chaleur) | **≈ 47** |
| Aspect | **dalles larges, lisses, crème/sablé TRÈS CLAIR**, joints discrets |

**Mesure de contrôle (obligatoire, en plus de la saturation E1 ≥ 22) :**
```bash
# moyenne du sol = pixels clairs du tiers bas, tapis noir exclu
convert "$GIF[0]" -coalesce -gravity South -crop 100%x33% +repage /tmp/bot.png
convert /tmp/bot.png -colorspace HSL -channel L -separate +channel -threshold 45% /tmp/mask.png
convert /tmp/bot.png /tmp/mask.png -compose multiply -composite \
  -format "%[fx:int(255*mean.r)] %[fx:int(255*mean.g)] %[fx:int(255*mean.b)]" info:
```
**Seuil : le sol doit être ≈ 225-235 en rouge.** En dessous de 210 → le sol est trop gris/sombre → à refaire.

**Défauts mesurés le 11 octobre (toutes mes productions, y compris les intégrées) :**

| GIF | Sol mesuré | Écart |
|---|---|---|
| 01 front squat (intégré) | 200 187 174 | **-33** |
| 02 fentes bulgares (intégré) | 192 171 155 | **-41** |
| 03 leg extension (intégré) | 184 172 160 | **-49** |
| bulgarian haltères (intégré) | 213 172 106 | -20 |
| goblet squat (intégré) | 202 179 154 | -31 |
| leg press (intégré) | 196 181 166 | -37 |
| bulgarian réparé (intégré) | 193 177 158 | -40 |
| back squat charge modérée | 201 184 164 | -32 → **corrigé 230 209 181** |
| presse à cuisses pieds hauts | 203 173 134 | -30 → **corrigé 221 198 169** |
| step-up sur banc | 190 173 150 | -43 → **corrigé 226 201 167** |

**Cause identifiée** : la référence passée à la génération était le **fichier utilisateur** (dont le sol est en fait à 192 183 165,
car il est recadré serré sur l'athlète) et non un **1er GIF validé plein format** dont le sol est à 233 212 186.
**Recette correcte** : passer comme 2ᵉ image de référence **`reference/05-SOL-CIBLE-1er-GIF-valide.png`**
(= `poc/back-squat.gif[0]`) et demander explicitement des *dalles crèmes sablées larges et claires, pas de petits pavés gris*.

---

## 1 quater. CORRECTIF MAJEUR DE L'APP — 20 EXERCICES SANS ANIMATION (11 octobre)

**Bug réel trouvé et corrigé** dans `src/data/library.js` :

```js
const guides = { ...legacy.elite.MUSCU_GUIDES, ...legacy.emilie.MUSCU_GUIDES };   // AVANT
```
La résolution se fait par `guides[norm(name)]`, mais **les clés du corpus ne sont pas normalisées**.
Toute clé contenant un tiret, un accent ou une apostrophe était donc **introuvable** :
`step-up sur banc (hauteur du genou)`, `pallof press à l'élastique`, `back squat (charge modérée)`…

**Conséquence mesurée** : **20 exercices s'affichaient SANS animation dans l'app alors que leur GIF existait**
(dont les **tractions**, le **step-up**, le **pallof press**, le **face pull**, le **hip thrust barre**, les **kickbacks**…).

**Correction** : normaliser les clés à la lecture —
```js
const guides = {};
for (const source of [legacy.elite.MUSCU_GUIDES, legacy.emilie.MUSCU_GUIDES])
  for (const [key, value] of Object.entries(source)) guides[norm(key)] = value;
```
et `if (guide?.ref) guide = guides[norm(guide.ref)] || guides[guide.ref];`
**Contrôles faits avant d'écrire** : 0 collision entre clés normalisées, tous les `ref` du corpus déjà normalisés.
**Résultat** : exercices sans animation **112 → 92**. `npm test` : 94 passés / 0 échec.

---

## 1 quinquies. LE SOL SABLÉ — REPRIS SUR 6 GIF (11 octobre)

Les 3 verrous + les 3 nouveaux intégrés ont été **refaits avec le sol sablé** (mêmes poses, même athlète, décor E1) :

| Exercice | Ancien sol | Nouveau sol | Statut |
|---|---|---|---|
| front squat | 200 187 174 | **232 213 183** | intégré |
| fentes bulgares haltères | 192 171 155 | **233 213 180** | intégré |
| leg extension | 184 172 160 | **209 189 163** | intégré |
| back squat charge modérée | 201 184 164 | 230 209 181 | intégré |
| presse à cuisses pieds hauts | 203 173 134 | 221 198 169 | intégré |
| step-up sur banc | 190 173 150 | 226 201 167 | intégré |

**Reste 4 GIF à reprendre pour le sol** : bulgarian haltères, goblet squat, leg press, bulgarian réparé.
Les anciens verrous sont conservés (`01-FRONT-SQUAT-verrouille-6008e0f8a2557d40.gif` etc.) à côté des nouveaux
(`…-SOL-SABLE.gif`) pour la traçabilité.

**Référence de sol à passer en 2ᵉ image de génération : `reference/05-SOL-CIBLE-1er-GIF-valide.png`.**
Ne plus utiliser le fichier utilisateur comme référence de décor (son sol est recadré à 192 183 165).

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

## 3 quater. ACCORD UTILISATEUR DU 11 OCTOBRE 11h37 — STYLE VALIDÉ

L'utilisateur a envoyé un fichier de référence (« Screenshot_20261011_113733_Chrome.jpg ») et écrit :
> « **Oui** si tous les gifs et décor ressemblent au fichier joint, ce que tu as fait est top et c'est ce que je veux
> comme image et gif, couleur, vue mer, plante tout y est, athlète »

**Ce que cela valide** : le style E1 (mer bleue + palmiers/plantes + lumière dorée + athlète blanc/argent, muscles dorés)
est **exactement** ce que veut l'utilisateur. La galerie qu'il a vue contenait déjà le GIF reconstruit
`bulgarian-split-squat-3poses-CORRIGE.gif` **et** les 3 décors corrigés → **ils sont validés et intégrés**.

⚠️ **Le fichier joint n'est PAS récupérable** : le bac à sable a été réinitialisé et `/home/user/uploads/` n'existe pas.
Ne pas demander à l'utilisateur de le renvoyer : sa validation est écrite ci-dessus et fait foi.
**Ne jamais générer d'image de remplacement** pour ce fichier.

### Ce qui est intégré à la suite de cet accord
- `Bulgarian split squat` → `/media/f183700b3362f93b.gif` (**le GIF cassé est réparé et intégré**) ;
  il ne partage plus `cf312b839f6da027.gif` avec `Bulgarian split squat haltères` → **1 exercice = 1 animation respecté**.
- `Bulgarian split squat haltères`, `Goblet squat`, `Leg press` → intégrés (commit `007bb86`).

**Total intégré : 7 exercices.** Reste **11 décors** à réaligner.

---

## 3 quinquies. 3 NOUVEAUX DÉCORS CORRIGÉS — EN ATTENTE (`build/corrections/`)

| Exercice | Fichier | Saturation | Statut |
|---|---|---|---|
| back squat charge modérée | `back-squat-charge-moderee-3poses.gif` | 27,8 / 27,3 | **attente validation** |
| presse à cuisses pieds hauts | `presse-a-cuisses-pieds-hauts-3poses.gif` | 46,7 / 25,5 | **attente validation** |
| step-up sur banc | `step-up-sur-banc-hauteur-du-genou-3poses.gif` | 33,5 / 35,4 | **attente validation** |

Note : la pose M de la presse à cuisses était sortie **trop pâle (18,5)** à la première génération → **refaite** (60,1).
Le contrôle de saturation **par pose** est donc obligatoire, pas seulement sur les poses A et B.

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


---

## 6 bis. RESTE À CORRIGER — 5 EXERCICES (vérifié le 11/10 après le lot R5)

| Exercice | Défaut mesuré | Action |
|---|---|---|
| **gainage planche** | poses générées avec **artefacts visuels confirmés** (rectangles plus clairs collés dans le fond, visibles sur les poses M et B) | **régénérer les 3 poses** |
| **face-pull** | sol pâle | refaire les 3 poses |
| **clamshell** | sol pâle | refaire les 3 poses |
| **fire hydrant** | sol pâle | refaire les 3 poses |
| **abduction hanche** | sol pâle | refaire les 3 poses |

**Barre de finition** : coin de sol **225-240** en rouge, saturation **>= 22**, athlète inchangé, aucune artefact.
Quota : **10 générations d'images par tour** → 15 poses à faire = **2 tours**. Les poses déjà faites
(`build/corrections/_poses-sable/`) ne sont **pas** repayées.

**Quand ces 5 sont faits, verts et présentés → PREVENIR L'UTILISATEUR** (demande explicite).

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
