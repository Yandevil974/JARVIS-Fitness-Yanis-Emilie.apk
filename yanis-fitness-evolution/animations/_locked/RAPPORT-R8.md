# RAPPORT R8 — 13 octobre 2026 — MODULE 1 (ÉCHAUFFEMENT)

## 1. ⚠️ ERREUR DE MESURE QUE J'AI COMMISE, PUIS CORRIGÉE

J'ai d'abord annoncé que le GIF « mobilite » était à refaire (sol 166). **C'était faux.**
La mesure « coin bas-gauche 18 % × 14 % » tombait sur un **objet de premier plan** (bande sombre
en bas du cadre), pas sur le sol.

Preuve (mobilite, pose f0) : le sol mesuré à 65 % de hauteur vaut **225-242**,
à 85 % il vaut **215**, et au dernier rang (95 %) il tombe à **147**. Le coin 86-100 % mélange
donc le sol et cette bande sombre.

**Correctif apporté à `build/verifier-pose.py`** : ajout d'une seconde mesure, `sol_dom` =
couleur **moyenne du groupe de pixels clairs majoritaire** dans les 45 % du bas.
Les deux mesures sont désormais affichées côte à côte. **Quand elles divergent fortement,
c'est que le coin contient autre chose que du sol.**

Étalonnage de `sol_dom` sur les **19 images déjà validées** par l'utilisateur :
**min 219 · médiane 249 · max 253**.

### Ce que ça change pour les 3 GIF d'échauffement

| GIF | sol_coin (ancienne mesure) | sol_dom (nouvelle) | Verdict |
|---|---|---|---|
| `warmup-route` | 218 | **251** | ✅ dans la plage validée |
| `warmup-mobilite` | 165 (objet, pas le sol) | **242** | ✅ dans la plage validée |
| `warmup-approche` | 242 | **251** | ✅ dans la plage validée |

→ **Aucun des 3 n'était à refaire. Les 3 sont conservés tels quels.**

⚠️ Cette correction remet aussi en cause 3 des 7 alertes du rapport R7
(`bulgarian-CORRIGE` 195-198, `face-pull` 196, `pallof` 177-213) : le coin y est
**constant sur les 5 images**, ce qui est typique d'un objet et non du sol.
**À revérifier avec `sol_dom` avant toute régénération.** Je n'ai rien régénéré.

## 2. CE QUI A ÉTÉ FAIT

8 images ont été générées puis **toutes écartées** (les poses d'origine étaient déjà bonnes) :

| Candidat | Raison du rejet |
|---|---|
| `mobilite-0` | sorti en **portrait** 768×1376 (cadrage paysage exigé) |
| `mobilite-0b` | sol_coin 206 |
| `mobilite-1` | sol_coin 223 — correct mais inutile |
| `mobilite-2` | sol_coin 196 |
| `mobilite-2b` | format 1584×672, mer 1,65 %, corrélation 0,028 → scène entièrement redessinée |
| `mobilite-min0/1/2` | édition minimale réussie (corrélation **0,978 / 0,982 / 0,980** = pose et décor préservés) **mais le sol n'a pas bougé** → inutile |

Tous sont conservés dans `_poses-warmup/_rejets/` pour traçabilité. Aucun n'est utilisé.
**Leçon : la consigne « édition minimale » préserve bien l'image (0,98 de corrélation) mais le
générateur n'exécute pas la correction de couleur demandée.**

## 3. LES 3 GIF PRÊTS (format app)

Assemblés avec `faire-gif.sh` : 5 images `A → M → B → M → A`, délais 25/20/50/20/25 cs.

| Fichier | Taille | Poids | Saturation | Mer | Lime | Sol (dominant) |
|---|---|---|---|---|---|---|
| `warmup-route-3poses-APP.gif` | 440×246 | 324 Ko | 46,4 | 6,67 % | 0,0 % | 251 243 219 |
| `warmup-mobilite-3poses-APP.gif` | 440×246 | 336 Ko | 29,4 | 21,11 % | 0,0 % | 242 237 227 |
| `warmup-approche-3poses-APP.gif` | 440×246 | 296 Ko | 40,8 | 7,50 % | 0,0 % | 251 243 218 |

Les 3 sous les 600 Ko. Les 3 au-dessus du seuil E1 (≥ 22). Lime à 0 partout.

Note : les originaux étaient en 4 images (130/110/130/110 cs, très lent) car produits comme
« étapes de chronomètre ». Ils sont ici remontés au **standard des animations d'exercice**
(5 images, 25/20/50/20/25), cohérent avec le reste de l'app.

## 4. CE QU'ILS REMPLACENT

Les 3 JPG affichés aujourd'hui par `WARMUP_IMAGES` (`src/data/visuals.js`) :

| Fichier | Saturation | Mer | Végétation | Sol |
|---|---|---|---|---|
| `warmup-cardio.jpg` | **4,1** | 0,57 % | 0,0 % | 254 |
| `warmup-mobilite.jpg` | **6,3** | 0,75 % | 0,0 % | 254 |
| `warmup-series-approche.jpg` | **8,5** | 0,11 % | 0,01 % | 243 |

Dessins pâles sur fond blanc : **hors cible E1 de très loin** (cible ≥ 22).

## 5. STATUT DU MODULE 1 — ✅ INTÉGRÉ LE 13 OCTOBRE (accord explicite de l'utilisateur)

Les 5 endroits ont été touchés :

| Endroit | Ce qui a changé |
|---|---|
| `public/media/` | + 3 GIF (330 / 341 / 303 Ko) |
| `release/media/` | + les 3 mêmes GIF |
| `public/media-index.json` | 277 → **280** entrées |
| `release/media-index.json` | 277 → **280** entrées |
| `src/data/visuals.js` | `WARMUP_IMAGES` → les 3 nouveaux `.gif` |
| `release/assets/index-BLZxzv9Y.js` | patch **binaire**, delta **−2 octets** |

| Remplacement | Nouveau fichier |
|---|---|
| `/media/warmup-cardio.jpg` | `/media/4d6d57f97bdd691e.gif` |
| `/media/warmup-mobilite.jpg` | `/media/6d278876a579cbc8.gif` |
| `/media/warmup-series-approche.jpg` | `/media/0c5a8fe6ba79eb47.gif` |

Noms de fichiers = **sha256 du contenu** (16 premiers caractères), comme le reste du dépôt.
Vérifié : 0 collision avec les fichiers existants.

### Contrôles après intégration (tous exécutés, pas supposés)

| Contrôle | Résultat |
|---|---|
| `node --check` sur le bundle patché | **syntaxe JS valide** |
| anciennes références dans le bundle | **0** (les 3) |
| nouvelles références dans le bundle | **1 chacune** |
| `npm test` | **94 passés / 0 échec** |
| les 3 GIF servis par l'app | **HTTP 200 · image/gif** |
| `media-index.json` | 280 entrées, les 3 présents des 2 côtés |

**Les 3 JPG d'origine sont conservés** (aucune suppression : règle du verrou).

### Trouvaille : un bundle mort

`release/assets/index-D_-dR1q5.js` (1,36 Mo) n'est chargé par **aucun** `index.html`.
Il s'agit d'un ancien build resté là. Non supprimé (règle : rien sans accord).
