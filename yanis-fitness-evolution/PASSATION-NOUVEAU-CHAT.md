# PASSATION — JARVIS Fitness (Yanis & Émilie) — version du **16 octobre 2026**

> **Mode d'emploi** : colle tout ce fichier dans un nouveau chat, en premier message.
> Il contient **tes règles incontournables**, la mission, l'ordre de travail, l'état exact mesuré
> et les pièges déjà payés. Il remplace la version du 15/10.

---

# 0. MES RÈGLES INCONTOURNABLES — À LIRE AVANT TOUTE ACTION

## 0.1 Protocole de validation (non négociable)
1. Pour un nouvel exercice : produire **1 image fixe** — par lot de 3 exercices, **présenter les 3 images fixes d'un coup**.
2. Attendre un **accord EXPLICITE en toutes lettres** (ex. « J'autorise les 3 poses, fabrique les 3 GIF »).
3. Seulement ensuite produire les GIF (format app : **A → M → B → M → A**, 440x246).
4. **Chaque GIF est présenté AVANT intégration.**
5. Second accord explicite → alors seulement intégration.
6. Un « **Y** » isolé = **relance de chat**, ce n'est **PAS** une validation. Rien n'entre dans l'app sans phrase claire.
7. **Ne jamais régénérer** un GIF ou une pose déjà conforme.
8. **1 exercice = 1 animation.** Jamais de mutualisation d'un GIF entre deux exercices.

## 0.2 L'athlète est FIGÉ — intouchable
Mannequin 3D très musclé, corps blanc/argent mat, visage noir sans traits, casquette blanche,
short noir, baskets blanches, muscles **jaune-orangé doré**.
Référence unique : `animations/_locked/reference/00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg`
Contrôle musculature : `animations/_locked/PLANCHE-MUSCULATURE-controle-2026-10-13.jpg`
(ratios cuisses/tête ≥ à la référence = pas de perte de muscle).

## 0.3 Le décor est FIGÉ — décor « E1 » (dense)
Terrasse vue mer : mer bleue **dense** à l'horizon, végétation **dense** (palmiers, plantes en pot),
lumière dorée, muret bas secondaire. Saturation cible **22 à 47**.
**INTERDITS** : salle de sport, parquet, mur intérieur, miroir, fond gris, petits pavés gris à joints
sombres, décor pâle (saturation < 22) — et donc les 381 visuels du corpus 1.8.0.
→ Ne JAMAIS réaligner sur le décor pâle.

## 0.4 Le sol doit être sablé clair
Cible **232 211 188** (R, V, B) — plage validée **219 à 253** sur la colonne `sol_dom`.
En dessous de 215 en rouge → à refaire. Sur les exercices au sol, le contrôle visuel fait foi.

## 0.5 Les couleurs
Muscles : jaune-orangé doré (**jamais vert lime, jamais rouge**). Mer : bleue dense. Sol : sablé clair.

## 0.6 ORDRE DE TRAVAIL : MODULE PAR MODULE (non négociable)
Les 9 modules dans cet ordre : **1 échauffement · 2 étirement · 3 musculation · 4 fractionné ·
5 chronométrée · 6 elliptique · 7 piscine · 8 tabata · 9 aqua**.
**On TERMINE un module avant d'ouvrir le suivant** — et « terminé » veut dire : toutes les étapes
avec un visuel **conforme à la charte (athlète verrouillé + décor E1 + sol sablé)**, intégré, tests verts.
⚠ Le mot « OK » du 15/10 pour le module 2 voulait seulement dire « aucune étape vide » : c'était un
**faux OK** (0 visuel sur 29 en charte). Ne plus jamais compter la couverture technique comme une fin de module.

## 0.7 NOUVELLE RÈGLE — LA LIVRAISON DE L'APP (ajoutée par l'utilisateur le 16/10)
> « Si je demande le lien de l'appli, celle-ci doit être livrée **avec les dernières mises à jour du
> travail effectué**. Sinon cela ne me sert à rien : **rien ne doit manquer**. »

Concrètement, **avant d'envoyer un lien d'application**, l'agent doit :
1. Construire l'APK **depuis la branche qui contient tout** (jamais depuis l'ancien tag 1.8.0, qui
   n'a pas les animations).
2. Vérifier par le contrôle automatique « **rien ne manque** » du workflow : le nombre de médias
   présents dans l'APK doit être **égal** au nombre de médias de l'application, et les animations
   témoins doivent être présentes (le build échoue sinon).
3. Vérifier que la release GitHub marquée **« latest »** correspond bien au dernier commit de la branche.
4. Mettre à jour `INSTALLER-APPLI.md` (racine) et la bannière du `README.md` : nom du fichier,
   **taille exacte en octets**, empreinte SHA-256, numéro de version.
5. Ne jamais envoyer un lien qui pointe sur une version plus ancienne que le travail réalisé.

## 0.8 Autres règles
- Vérifier les postures sur des **sites de fitness de référence** avant toute proposition, et
  **consigner les références consultées**.
- Si l'agent a la vision (images lisibles via `read_file`) : **vérifier soi-même** chaque image avant
  de la présenter (pose, prise, athlète, décor). Ne jamais prétendre avoir vu ce qui n'a pas pu l'être.
- Avant toute proposition : **mesurer l'état réel**, jamais d'estimation de mémoire.
- Pousser chaque commit immédiatement (la sandbox se réinitialise sans prévenir).
- Ne jamais reconstruire l'app avec un bundler qui écrase `release/` sans contrôle.

---

# 1. LA MISSION

Terminer l'app de fitness JARVIS (musculation, natation, cardio, aqua) pour Yanis et Émilie.
Trois objectifs, dans cet ordre de priorité :

1. **L'app doit marcher et être rapide.** On ne bloque JAMAIS la livraison de l'app pour un GIF.
2. **Corriger les décors et animations** (sol sablé clair, décor terrasse mer, athlète figé).
3. **Compléter les exercices qui n'ont pas d'animation** — module par module (règle 0.6).

---

# 2. OÙ EST LE CODE ET COMMENT REPRENDRE

- Dépôt : `/home/user/JARVIS-Fitness-Yanis-Emilie.apk` — dossier de l'app : `yanis-fitness-evolution/`
- **Branche qui contient TOUT le travail (16/10)** : `arena/f2bd110d-jarvis-fitness-yanis-emilie-ap`
  (dernier commit au 16/10 : `2737d04`). C'est la seule branche à mettre à jour.
- Ancienne branche : `arena/f60f808f-…` (s'arrête au commit `52289dc`) — historique, ne pas y pousser.
- ⚠ **La 1.8.0 (`v1.8.0-fitness-brain`) n'est pas un ancêtre** : c'est une autre ligne. Ne pas
  construire d'APK depuis ce tag.

## Reprise après réinitialisation de la sandbox
```bash
cd /home/user/JARVIS-Fitness-Yanis-Emilie.apk
git fetch origin arena/f2bd110d-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD
cd yanis-fitness-evolution
npm install && pip3 install --break-system-packages numpy pillow && npm install --no-save esbuild
npm test          # attendu : 153 tests · 151 passés · 0 échec · 2 ignorés
```
Lancer l'app : `npm run dev` (port 5173, `--host 0.0.0.0`).
Après CHAQUE travail : `git push origin arena/f2bd110d-jarvis-fitness-yanis-emilie-ap`.
Jamais d'autre branche, jamais de force-push.

---

# 3. ORDRE DE TRAVAIL — ÉTAT MESURÉ AU 16/10/2026

| # | Module | État réel | Reste à faire |
|---|---|---|---|
| 1 | Échauffement | ✅ **TERMINÉ** (3 GIF charte terrasse-mer couvrant 6 étapes) | rien |
| 2 | **Étirement** | 🔴 **EN COURS — module prioritaire** | **22 visuels à refaire** (0 sur 29 en charte) |
| 3 | Musculation | ⏸ **EN PAUSE** (3 GIF charte intégrés + 18 visuels repassés en charte) | 85 exercices, à reprendre **après** le module 2 |
| 4 | Fractionné | 🟢 conforme (visuel 100 %) | rien |
| 5 | Chronométrée | 🔴 19 étapes piscine sans visuel | après le 3 |
| 6 | Elliptique | 🟢 conforme | rien |
| 7 | Piscine | 🔴 135 étapes sans visuel | après le 5 |
| 8 | Tabata | 🔴 48 mouvements, 0 % de visuel, motifs attribués non conformes | après le 7 |
| 9 | Aqua | 🟢 conforme (77 étapes, 100 %) | rien |

**Règle d'application** : ne rien lancer sur les modules 3 à 9 tant que le module 2 n'est pas
terminé (22/22 visuels conformes, intégrés, `npm test` vert).

---

# 4. MODULE 2 — LE CHANTIER EN COURS (mesuré)

**24 étapes de séance → 22 visuels uniques** (Balasana et Torsion allongée servent chacun à
2 groupes musculaires) → **8 lots de 3**, protocole 0.1 appliqué lot par lot.

| Lot | Visuels (groupe) | État |
|---|---|---|
| 1 | Étirement dans l'encadrement de porte (pec) · Bras tendu contre le mur (pec) · Position de l'enfant / Balasana (dos, lom) | **3 images fixes PRODUITES et présentées** — attend l'accord écrit. Images dans `animations/_locked/candidats/2026-10-16-etirement-lot1/` |
| 2 | Suspension à la barre (dos) · Torsion allongée / genoux (dos, lom) · Mains croisées derrière le dos (epA) | à produire |
| 3 | Bras tendu contre la poitrine (epL) · Bras tendu devant main tirée (epP) · Bras tendu derrière (bic) | à produire |
| 4 | Coude au-dessus de la tête (tri) · Main dans le dos (tri) · Étirement des fléchisseurs (avb) | à produire |
| 5 | Étirement des extenseurs (avb) · Étirement du cobra (abs) · Pigeon assis (fes) | à produire |
| 6 | Talon vers la fesse debout (qua) · Allongé sur le côté (qua) · Flexion avant jambes tendues (isc) | à produire |
| 7 | Une jambe tendue une pliée (isc) · Grenouille plantes jointes (add) · Étirement contre le mur (mol) | à produire |
| 8 | Mollet en escalier (mol) | à produire |

**Adaptation à valider pour le lot 1** : le décor E1 interdit les murs intérieurs, donc
« l'encadrement de porte » utilise le **montant de marbre de la terrasse** comme support.

**Mesures du lot 1** (faites, conformes) : `sol_dom` 228 / 242 / 234 (plage 219-253) ·
saturation 38,2 / 41,8 / 42,9 · **vert lime ≤ 0,03 %** · muscles dorés 6,0 / 6,1 / 6,9 % ·
mer 2,4-4,5 % · NCC décor 0,74-0,81 contre `BASE-decor-sol-sable-valide.png`.

---

# 5. LES OUTILS (déjà écrits, dans le dépôt)

| Outil | Emplacement | Ce qu'il fait |
|---|---|---|
| Mesure d'image | `animations/_locked/build/verifier-pose.py` | Mesure `sol_dom`, saturation, mer, végétation, lime, muscles dorés. **Ne juge PAS la posture.** (`--frames` pour les GIF.) |
| Compteur manquant | `animations/_locked/build/lister-sans-animation.py` | Exercices sans animation (`--liste`, `--json`) |
| Audit des modules | `scripts/audit-modules.mjs` | `node scripts/audit-modules.mjs` — résolution alignée sur `library.js` (tient compte de `GIF_OVERRIDES`) |
| Fabrication GIF | `animations/_locked/build/faire-gif.sh` | `./faire-gif.sh A.png M.png B.png 440x246 sortie.gif` (depuis `build/`). Délais 25/20/50/20/25 cs |
| Assemblage libellés | `convert -font /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf -annotate …` | `montage -label` échoue (police helvetica absente) |

⚠ `verifier-pose.py` exige numpy + pillow (`pip3 install --break-system-packages numpy pillow`) —
à réinstaller après chaque réinitialisation, comme `npm install`. `npm run build:portable` exige
esbuild (`npm install --no-save esbuild`).

---

# 6. INTÉGRER UN GIF DANS L'APP — LES 5 ENDROITS (+ 1)

1. Copier le GIF dans `public/media/` **et** `release/media/` → nom = **sha256 du contenu, 16 premiers caractères** (`sha256sum f.gif | cut -c1-16`). Vérifier l'absence de collision.
2. Régénérer `public/media-index.json` : liste plate **TRIÉE**, chemins préfixés `/`, JSON compact
   (`separators=(",",":")`), en excluant `runtime.js`, `runtime.css`, `media-index.json`. Copier à l'identique vers `release/media-index.json`.
3. Ajouter le guide dans `src/data/legacy.json` : `elite.MUSCU_GUIDES` (Yanis) ou `emilie.MUSCU_GUIDES` (Émilie), en `json.load` / `json.dumps(..., ensure_ascii=False, indent=1)`.
4. Bundle : deux options selon le cas — soit patcher en binaire (UTF-8 + emojis), soit reconstruire
   proprement (`npm run build` après `npm install --no-save esbuild`) puis **contrôler** que le
   nouveau `index-*.js` est bien celui référencé par `release/index.html` et qu'il contient les clés attendues. `node --check` sur le bundle.
5. Vérifier : `npm test`, GIF en HTTP 200 · `image/gif`, anciennes références à 0 dans les données.
6. **+1 — runtime portable** : après toute modification de `legacy.json` / `visuals.js` / `visuals-gifs.js`
   → `npm run build:portable`, **re-trier `public/media-index.json`**, puis copier `public/runtime.js`
   et `public/media-index.json` vers `release/`.

⚠ **Priorité des sources** : `src/data/library.js` résout `GIF_OVERRIDES[norm(nom)] || guide?.img`.
`GIF_OVERRIDES` (corpus 1.8.0) est donc lu **AVANT** les guides : pour qu'une animation récente
s'affiche, il faut soit la mettre dans `GIF_OVERRIDES`, soit retirer la ligne correspondante.

---

# 7. LIVRER L'APP (règle 0.7 en pratique)

```bash
cd /home/user/JARVIS-Fitness-Yanis-Emilie.apk
# 1. tout est poussé ?
git status --short && git push origin arena/f2bd110d-jarvis-fitness-yanis-emilie-ap
# 2. tag de livraison (déclenche le workflow de build)
git tag -a vX.Y.Z-<mot> -m "…" && git push origin vX.Y.Z-<mot>
# 3. suivre le build
gh run watch <id> --exit-status
```
Le workflow `.github/workflows/android-release.yml` construit, **vérifie que rien ne manque**
(medias APK = medias de l'app + animations témoins), publie la release et les empreintes.
Ensuite : recopier l'APK dans `downloads/` (workflow miroir ou manuel) pour donner un **lien de
secours** `raw.githubusercontent.com`, et mettre à jour `INSTALLER-APPLI.md` + bannière `README.md`.

État de la livraison au 16/10 : release **`v1.8.2-jarvis-animations`** (« latest »),
`yanis-fitness-evolution-1.8.2.apk` = **95 561 328 octets**, sha256
`540f15ed8a4ae2f3cf846dd2977d8dce99a024bdb1e9507b7b4eef34abfa3b31`, version **1.8.2 / versionCode 184**
(au-dessus de la 180 de la 1.8.0 → mise à jour, données conservées).

---

# 8. PIÈGES DÉJÀ PAYÉS — NE PAS LES REFAIRE

1. Le coin bas-gauche n'est **pas** le sol : utiliser la colonne `sol_dom`.
2. **L'édition minimale ne fonctionne pas** (le générateur renvoie une image quasi identique :
   NCC 0,9994) → régénérer en **complet** avec les 2 références verrouillées et la pose décrite en entier.
   Repères NCC : même pose/décor différent ≈ 0,73-0,86 · édition minimale ≈ 0,98 · pose différente ≈ 0,88-0,96.
3. Mesurer la mer sur l'image entière ; 2,3-2,9 % est acceptable sous réserve du contrôle visuel.
4. `-delay` devant **CHAQUE** image d'une commande ImageMagick.
5. Un GIF conforme **ne se régénère pas**.
6. **Réinitialisations de sandbox** : tout ce qui n'est pas poussé disparaît (déjà plus de 5 fois).
7. `release/assets/index-D_-dR1q5.js` (1,36 Mo) est un **bundle mort** : ne pas y toucher.
8. Le nom des clés de guides est **normalisé** (`norm()`) : accents, apostrophes et tirets ignorés ;
   ici `library.js` applique `GIF_OVERRIDES` **avant** les guides (voir §6).
9. Ne pas confondre les deux applications : **JARVIS Fitness** = `app.jarvis.fitness` (paquet
   différent, jamais remplacé) ; **Yanis Fitness Evolution** = `app.yanis.fitness.evolution`.
10. Toujours déposer `downloads/` **uniquement** avec l'APK le plus récent : le workflow hérité y
    avait poussé 700 Mo d'anciens APK.

---

# 9. CE QU'IL FAUT DEMANDER À L'UTILISATEUR AVANT D'AGIR

1. **Module 2, lot 1** : la phrase d'accord sur les 3 poses présentées
   (« J'autorise les 3 poses, fabrique les 3 GIF ») — puis, une fois les GIF présentés, l'accord
   d'intégration.
2. Ensuite : lots de 3, **dans l'ordre du tableau §4**, sans sauter d'étape ni ouvrir un autre module.
3. En cas de message « Y » ou incomplet : c'est une relance de chat → ne rien intégrer, redemander
   une phrase claire.
4. Pour un lien d'app : appliquer la règle 0.7 (derniers travaux inclus, contrôlés, jamais un lien en retard).

**Et toujours** : mesurer avant de proposer · présenter avant d'intégrer · ne rien mettre dans l'app
sans feu vert explicite · un module après l'autre.
