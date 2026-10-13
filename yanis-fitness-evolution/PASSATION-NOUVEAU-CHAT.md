# PASSATION — JARVIS Fitness (Yanis & Émilie)

> **Mode d'emploi** : colle tout ce fichier dans un nouveau chat, en premier message.
> Il contient la mission, l'ordre de travail, l'état exact mesuré et les règles non négociables.

---

## 1. LA MISSION

Terminer l'app de fitness JARVIS (musculation, natation, cardio, aqua) pour Yanis et Émilie.
Trois objectifs, dans cet ordre de priorité :

1. **L'app doit marcher et être rapide.** On ne bloque JAMAIS la livraison de l'app pour un GIF.
2. **Corriger les décors et animations** (sol sablé clair, décor terrasse mer, athlète figé).
3. **Compléter les exercices qui n'ont pas d'animation** (le gros chantier).

---

## 2. OÙ EST LE CODE

- Dépôt : `/home/user/JARVIS-Fitness-Yanis-Emilie.apk` (dossier `yanis-fitness-evolution/`)
- **Branche unique : `arena/b4c56c3f-jarvis-fitness-yanis-emilie-ap`**
  → ne JAMAIS créer d'autre branche, jamais de force-push. Faire `git fetch` avant d'écrire.
- Lancer l'app : `cd yanis-fitness-evolution && npm install && npm run dev` (port 5173)
- Tests : `npm test` → attendu **94 passés / 0 échec / 2 ignorés**

---

## 3. ORDRE DE TRAVAIL IMPOSÉ (à respecter strictement)

Travailler **module par module, dans cet ordre**, et **terminer un module avant de passer au suivant**.
Mesurer l'état réel avant de proposer quoi que ce soit.

| # | Module | État au 13/10/2026 |
|---|---|---|
| 1 | Échauffement | ✅ **TERMINÉ ET INTÉGRÉ** |
| 2 | Étirement | 🟢 OK — 100 % des visuels (29 visuels) |
| 3 | **Musculation** | 🔴 **LE CHANTIER — 88 exercices sans animation** (86 côté élite, 0 côté Émilie) |
| 4 | Fractionné | 🟢 OK |
| 5 | Chronométrée | 🔴 19 étapes piscine sans visuel |
| 6 | Elliptique | 🟢 OK |
| 7 | Piscine | 🔴 135 étapes sans visuel |
| 8 | Tabata | 🔴 48 mouvements, 0 % de visuel, et les animations attribuées ne correspondent pas |
| 9 | Aqua | 🟢 OK (77 étapes, 100 %) |

**Le module en cours, c'est le 3 (musculation).** Ne pas attaquer le 8 avant.

---

## 4. RÈGLES INCONTOURNABLES — À NE JAMAIS ENFREINDRE

### 4.1 Protocole de validation (non négociable)

1. Pour un **nouvel exercice** : produire d'abord **1 image fixe**.
2. Attendre un **accord EXPLICITE** de l'utilisateur.
3. Seulement ensuite produire le GIF.
4. **Chaque GIF est présenté AVANT intégration.**
5. Un « Y » isolé ne vaut PAS validation. Rien n'entre dans l'app sans feu vert.
6. **Ne jamais régénérer un GIF qui est déjà conforme.**

### 4.2 L'athlète est FIGÉ — intouchable

Mannequin 3D très musclé, corps blanc/argent **mat**, **visage noir sans traits**,
**casquette blanche**, **short noir**, **baskets blanches**, **muscles jaune-orangé doré**.

- Référence unique : `animations/_locked/reference/00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg`
- Vérifier que le générateur ne redessine pas l'athlète (silhouette, échelle, accessoires)
  ni ne change l'exercice demandé.

### 4.3 Le décor est FIGÉ — décor « E1 » (dense)

Terrasse vue mer : **mer bleue dense** à l'horizon, **végétation dense** (palmiers, plantes en pot),
**lumière dorée**, muret bas secondaire.

**INTERDITS** : salle, parquet, mur intérieur, miroir, fond gris,
petits pavés gris à joints sombres, décor pâle (saturation < 22).
→ **Ne jamais réaligner sur le décor PÂLE.**

### 4.4 Le sol doit être sablé clair

- Cible : **232 211 188** (R, V, B) — plage validée **219–253** sur la colonne `sol_dom`.
- Seuil rouge ≈ 225–240. En dessous de 215 → à refaire.
- Sur les exercices au sol (tapis noir dans le coin), **le contrôle visuel fait foi**.

### 4.5 Les couleurs

- Muscles : **jaune-orangé doré** (JAMAIS vert lime, jamais rouge).
- Mer : **bleue dense**.
- Sol : **sablé clair**.

### 4.6 Autres règles dites par l'utilisateur

- **1 exercice = 1 animation.** Jamais de mutualisation d'un GIF entre deux exercices.
- **Avant toute proposition**, vérifier les poses sur des sites de fitness de référence
  (posture, amplitude, prise, angle, placement du matériel) — **et** vérifier aussi
  l'athlète, le décor et la couleur.

---

## 5. LES OUTILS (déjà écrits, dans le dépôt)

| Outil | Emplacement | Ce qu'il fait |
|---|---|---|
| Mesure d'image | `animations/_locked/build/verifier-pose.py` | Mesure sol, saturation, mer, végétation, lime, muscles dorés. Ne juge PAS la posture. |
| Compteur manquant | `animations/_locked/build/lister-sans-animation.py` | Compte les exercices sans animation (reproduit la résolution réelle de `src/data/library.js`). |
| Audit des 9 modules | `scripts/audit-modules.mjs` | `node scripts/audit-modules.mjs` — audit mesuré des 9 modules dans l'ordre imposé. |
| Fabrication GIF | `animations/_locked/build/faire-gif.sh` | À lancer **depuis** `_locked/build/`. |
| État des modules | `ETAT-MODULES.md` | Tableau de bord lisible. |

⚠️ `verifier-pose.py` a besoin de **numpy** et **pillow** (`pip3 install --break-system-packages numpy pillow`).
Si le bac à sable est réinitialisé : `npm install` est obligatoire (sinon `node` ne peut pas
importer `src/data/library.js` et les tests échouent).

---

## 6. COMMENT INTÉGRER UN GIF DANS L'APP — LES 5 ENDROITS

C'est la procédure exacte, elle a déjà servi 7 fois.

1. **Copier le GIF dans `public/media/` ET `release/media/`**
   → nom = **sha256 du contenu, 16 premiers caractères** (`sha256sum f.gif | cut -c1-16`).
   Vérifier qu'il n'y a pas de collision de nom.
2. **Régénérer `public/media-index.json`** : c'est une **liste JSON plate**, **triée**,
   de chemins préfixés `/`, écrite en **JSON compact** (`separators=(",",":")`).
   La régénérer en parcourant `public/` en excluant `runtime.js`, `runtime.css`, `media-index.json`.
   Puis **copier le même fichier** vers `release/media-index.json`.
3. **Ajouter le guide dans `src/data/legacy.json`**, dans `elite.MUSCU_GUIDES` :
   ```json
   "Nom de l'exercice": { "img": "/media/<sha256>.gif", "tip": "💡 Conseil court." }
   ```
   → L'aller-retour `json.load` / `json.dumps(..., ensure_ascii=False, indent=1)` est
   **sans perte** (0 ligne de différence). C'est le seul format à utiliser pour éditer ce fichier.
4. **Patcher le bundle `release/assets/index-BLZxzv9Y.js` EN BINAIRE**
   (jamais en mode texte : c'est de l'UTF-8 avec des emojis, l'édition texte le casse).
   - Le bundle contient **DEUX** tables `MUSCU_GUIDES"` (Émilie puis élite) et elles
     **commencent par la même clé** → une ancre naïve est ambiguë.
   - **Ancre fiable** : chercher les offsets de `MUSCU_GUIDES":{` et prendre celui
     dont les 400 octets suivants contiennent `tractions (pull-up)` → c'est la table **élite**.
   - Insérer le bloc après `MUSCU_GUIDES":{`, puis **vérifier le delta de taille**
     (`assert n1-n0 == len(bloc.encode())`) et **`node --check`** sur le fichier.
5. **Vérifier** : `npm test` (94/0), les GIF en `HTTP 200 · image/gif`, et
   `git grep` les anciennes références (doivent être à 0).

⚠️ **NE PAS reconstruire l'app avec un bundler.** Refaire le build écraserait
`public/runtime.js` et le désynchroniserait. On **patche**, on ne reconstruit pas.

---

## 7. PIÈGES DÉJÀ PAYÉS — NE PAS LES REFAIRE

1. **Le coin bas-gauche n'est PAS le sol.** Il contient souvent un objet de premier plan,
   une ombre ou un bord de cadre. Il a déjà mesuré 166 alors que le vrai sol valait 225–242,
   ce qui a coûté 10 générations d'images inutiles.
   → **Utiliser la colonne `sol_dom`** (couleur majoritaire des pixels clairs des 45 % du bas).
2. **Le générateur d'images ne sait pas faire d'édition minimale de couleur.** Le prompt
   « change ONLY the colour of the floor » renvoie une image identique (sol inchangé, mesure 164-169).
   Et les prompts de régénération complète redessinent trop (sortie en portrait, ou exercice changé).
   → Ne pas compter sur l'IA pour ne modifier qu'un sol.
3. **Corrélation structurelle (NCC)** : à calculer avant d'accepter une régénération.
   Repères : même pose / décor différent ≈ 0,73–0,86 · édition minimale ≈ 0,98 ·
   exercice différent < 0,1.
4. **Pas de vision sur les images.** Lire un JPG/PNG ne donne pas la vision du contenu.
   Ne jamais prétendre avoir « regardé » une image. Substituts : mesure chiffrée +
   corrélation structurelle + planche de comparaison soumise à l'utilisateur
   (faire les libellés avec `convert -font DejaVuSans-Bold.ttf -annotate` ;
   `montage -label` échoue, la police helvetica est absente).
5. **Mesurer la mer sur l'image entière**, jamais sur une bande haute (c'est le ciel).
6. **`-delay` devant CHAQUE image** dans une commande ImageMagick, sinon l'animation est cassée.
7. **Un GIF détecté « conforme » ne se régénère pas.**

---

## 8. ÉTAT EXACT AU 13 OCTOBRE 2026

### Fait et poussé

- **Module 1 (échauffement) terminé et intégré** (accord explicite obtenu) :
  3 GIF remplacent 3 JPG pâles, dans les 5 endroits.
  `warmup-cardio.jpg` → `4d6d57f97bdd691e.gif` ·
  `warmup-mobilite.jpg` → `6d278876a579cbc8.gif` ·
  `warmup-series-approche.jpg` → `0c5a8fe6ba79eb47.gif`.
  Contrôles passés : `node --check` valide, 0 ancienne référence, `npm test` 94/0,
  GIF servis en HTTP 200. **Les anciens JPG sont conservés** (aucune suppression).
- **4 animations du stock intégrées** (pompes, fentes arrière PDC, mobilité des épaules,
  respiration diaphragmatique) → `legacy.json` passe à **55 guides élite**,
  `media-index.json` à **284 entrées**.
- **1 animation ÉCARTÉE après mesure** : le squat au poids du corps.
  Sa saturation varie de **15,2 à 47,7** entre les images → clignotement visible.
  À refaire. **Elle n'est pas dans l'app.**
- Compteur mis à jour : **209 exercices · 121 avec animation · 88 sans** (86 élite, 0 Émilie).

### En attente (ne rien faire sans accord)

- **Abduction de hanche** : GIF prêt et mesuré (sol 229-235, 328 Ko) mais **jamais validé
  visuellement par l'utilisateur** → pas intégré. Les poses A et B existantes sont la bonne
  référence (debout, mains sur les hanches, torse droit, jambe tendue sur le côté).
- Les 4 GIF pâles + 3 au sol gris repérés par l'audit.
- 3 alertes du rapport R7 à revérifier avec `sol_dom` (`bulgarian-CORRIGE`, `face-pull`, `pallof`).
- **`release/assets/index-D_-dR1q5.js`** (1,36 Mo) est un **bundle mort** chargé par aucun HTML.
  Suppression **proposée mais non autorisée** → ne pas y toucher.

### Documents de référence dans le dépôt

- `ETAT-MODULES.md` — tableau de bord des 9 modules.
- `animations/_locked/RAPPORT-R8.md` — l'erreur de mesure du sol et la métrique `sol_dom`.
- `animations/_audit/2026-10-11/` — rapports d'audit et GIF sources.
- `animations/_locked/build/corrections/` — planches de comparaison et images candidates.

---

## 9. CE QU'IL FAUT DEMANDER À L'UTILISATEUR AVANT D'AGIR

Pour le module 3 (musculation), 86 exercices restent à animer, à raison de 3 poses chacun —
soit environ **26 tours de production**. **Ne pas lancer les 26 tours d'un coup.**

Demander d'abord :
1. Par quel lot d'exercices commencer (par muscle ? par ordre alphabétique ? par priorité d'usage ?).
2. Confirmer le protocole : 1 image fixe → accord → GIF, pour chaque exercice.

Et toujours : **mesurer avant de proposer**, **présenter avant d'intégrer**,
**ne rien mettre dans l'app sans feu vert explicite**.
