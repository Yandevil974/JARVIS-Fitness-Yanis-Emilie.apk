# PASSATION — À COPIER-COLLER
## JARVIS Fitness (Yanis & Émilie) — état au 11 octobre 2026

**Branche unique : `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`**
Ne jamais créer une autre branche. Tous les agents travaillent ici, pour la continuité et la cohérence du projet.
Avant d'écrire : `git fetch` puis `git pull` (branche partagée). **Jamais de force-push.**

À lire avant de produire quoi que ce soit :
- `yanis-fitness-evolution/animations/_locked/REFERENCE-VERROUILLEE.md` → le verrou, les règles
- `yanis-fitness-evolution/animations/_locked/SUIVI-COMMUN.md` → l'état vérifié, les mesures, la méthode
- `yanis-fitness-evolution/animations/_locked/GALERIE.html` → tout voir en images (à ouvrir dans un navigateur)

---

# 1. L'URGENCE — À COMPRENDRE EN PREMIER

**On ne fabrique pas un musée de GIF. On livre une application rapide, fonctionnelle et performante.**

- **Rapide** : l'app doit s'ouvrir et répondre instantanément sur un téléphone. Un GIF qui pèse 3 Mo est un échec.
- **Fonctionnelle** : chaque exercice du programme doit avoir son animation **et** son texte-clé.
- **Performante** : les GIF restent **sous 600 Ko** (les nôtres font 270–330 Ko : ne pas dépasser).

**Règle d'arbitrage, en cas de doute : entre « plus beau » et « l'app qui marche », on livre l'app qui marche.**
**Ne jamais bloquer l'application entière à cause d'un GIF.** Le GIF se corrige après, en série.

**Ordre imposé : finir les corrections des animations AVANT de poursuivre autre chose.**

---

# 2. LES REVENDICATIONS DE L'UTILISATEUR — NON NÉGOCIABLES

## 2.1 Le personnage est FIGÉ. Intouchable.
Mannequin 3D **très musclé**, corps **blanc/argent mat**, **visage noir sans traits**, **casquette blanche**,
**short noir**, **baskets blanches**, muscles travaillés en **jaune-orangé doré**.
Référence unique et définitive : `_locked/reference/00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg`
→ **Jamais de redessin. Jamais de substitution. Jamais de « version alternative » du personnage.**
→ Le générateur d'image **redessine l'athlète** : vérifier qu'il n'a pas changé de silhouette, d'échelle ni d'accessoire entre les poses.

## 2.2 Le décor est FIGÉ : terrasse vue sur mer.
- **Mer bleue dense, bien visible à l'horizon** (pas une bande pâle)
- **Végétation dense** : palmiers, plantes en pot nombreuses
- **Lumière dorée** / chaude
- **Muret bas** présent mais secondaire
- **Sol : sablé clair** — voir règle 2.3 (c'est une revendication explicite de l'utilisateur)

**INTERDITS ABSOLUS** : salle de sport, parquet, mur intérieur, miroir, fond gris,
petits pavés gris à joints sombres, décor pâle/délavé.

## 2.3 Le sol doit être SABLÉ CLAIR — défaut signalé par l'utilisateur
> « **le sol n'est plus couleur sablé** »

**Cible mesurée : `232 211 188`** (R V B), soit de **grandes dalles lisses crème/sablé très clair**, joints discrets.
Ce n'est pas un détail esthétique : c'est une exigence de fidélité.

**Mesure de contrôle obligatoire — au COIN DE SOL uniquement** (bas-gauche, sans tapis ni machine) :
```bash
convert "GIF[0]" -coalesce -gravity SouthWest -crop 18%x14%+0+0 +repage -resize 60x \
  -format "%[fx:int(255*mean.r)] %[fx:int(255*mean.g)] %[fx:int(255*mean.b)]" info:
```
**Mesure au coin de sol** — ⚠️ **uniquement fiable sur les exercices DEBOUT.**
Sur les exercices **au sol** (clamshell, fire hydrant, gainage, pompes, pont fessier), le coin contient le
**tapis noir** → la mesure tombe à 170-230 alors que le sol est bon. **Dans ce cas, le contrôle VISUEL fait foi**.`

**Seuil : le rouge doit être ≈ 225–240.** En dessous de 215 → le sol est trop gris → **à refaire**.

⚠️ **Ne jamais mesurer sur le tiers bas entier** : le tapis noir et les machines faussent la moyenne
(ex. mesure 145 alors que le vrai sol est à 224). **Le coin de sol est le seul endroit fiable.**

## 2.4 Les couleurs
- Muscles travaillés : **jaune-orangé doré** (jamais vert lime, jamais rouge)
- Mer : **bleu dense**
- Sol : **sablé clair**
Le **vert lime** appartient à un ancien style abandonné (corpus « refonte-photo ») : **ne jamais le réintroduire**.

## 2.5 Le protocole de validation — non négociable
1. **Un nouvel exercice = UNE image fixe d'abord.** On génère/compose **une seule** image fixe, **on la montre**, et **on attend l'accord explicite** avant de produire le GIF.
2. **Chaque GIF est présenté** à l'utilisateur avant intégration.
3. **Un « Y » isolé ne vaut PAS validation.** Seul un accord explicite compte (« oui », « ok », « vas-y », « je valide »).
4. **Rien n'entre dans l'application sans feu vert explicite.**
5. **Ne jamais régénérer un GIF conforme.**

---

# 3. LES 10 ERREURS À NE PAS COMMETTRE (toutes déjà commises une fois)

1. **Réaligner sur le décor pâle.** Un ancien plan (`PLAN-CORRECTION.md`) proposait de réaligner 33 GIF sur le décor pâle du front squat. **C'est faux.** La cible est le décor **dense** des 1ers GIF validés. Lire la bannière du fichier.
2. **Mesurer le sol sur le tiers bas.** Donne des chiffres faux (145 au lieu de 224). → **Coin de sol.**
3. **Prendre votre fichier joint comme référence de sol.** Il est recadré serré sur l'athlète : son sol mesure 162. La vraie référence de sol est `reference/05-SOL-CIBLE-1er-GIF-valide.png`.
4. **Juger un GIF sans le coalescer.** `identify` brut affiche des frames `1×1` fantômes → faux diagnostics de « GIF cassé ». Toujours : `convert gif -coalesce`.
5. **Annoncer des chiffres non mesurés.** Les annonces « 36 puis 33 puis 21 GIF cassés » étaient **fausses**. Ne jamais annoncer un chiffre sans l'avoir mesuré, et **corriger publiquement** en cas d'erreur.
6. **`-delay` doit précéder CHAQUE image** dans ImageMagick, sinon les durées sont fausses. Utiliser l'outil fourni, il est testé.
7. **Éditer un bundle JS en mode texte.** Python convertit les fins de ligne et corrompt le fichier silencieusement (12 Ko perdus une fois). Lire/écrire en **binaire** (`rb`/`wb`) et **vérifier que le delta d'octets vaut exactement la taille ajoutée**.
8. **Mutualiser deux exercices sur une animation.** « Bulgarian split squat » et « Bulgarian split squat haltères » sont **2 exercices distincts** (ils partageaient `cf312b839f6da027.gif` — corrigé). Règle : **1 exercice = 1 animation**.
9. **Croire que `/tmp` survit.** Il est purgé régulièrement. Tout ce qui compte va **dans le dépôt**. Avant toute génération, recopier les références depuis le dépôt.
10. **Utiliser l'ancien `public/media` ou le corpus « refonte-photo » (salle, vert lime) comme référence.** Jamais.

---

# 4. OÙ SONT LES CHOSES

| Quoi | Où |
|---|---|
| Le verrou (règles + décision décor) | `animations/_locked/REFERENCE-VERROUILLEE.md` |
| L'état vérifié (mesures, méthode, rétractations) | `animations/_locked/SUIVI-COMMUN.md` |
| Tout voir en images | `animations/_locked/GALERIE.html` |
| La queue chiffrée des GIF à corriger | `animations/_locked/QUEUE-CORRECTION.tsv` |
| **L'outil d'assemblage** | `animations/_locked/build/faire-gif.sh` |
| Les GIF corrigés (en attente d'accord) | `animations/_locked/build/corrections/` |
| Les poses PNG déjà refaites en sablé | `animations/_locked/build/corrections/_poses-sable/` |
| Références et verrous | `animations/_locked/reference/` |
| Guides de l'app (clé → GIF) | `src/data/legacy.json` (fusion `elite` + `emilie`) |
| Résolution dans l'app | `src/data/library.js` |
| Build livré | `release/` (guides inlinés dans `release/assets/index-BLZxzv9Y.js`) |

**Modules de reprise rapide :**
```bash
cd yanis-fitness-evolution && npm ci && npm test    # 96 tests, 0 échec attendu
# assembler un GIF (l'outil contrôle le décor tout seul) :
./animations/_locked/build/faire-gif.sh A.png M.png B.png 440x246 sortie.gif
# combien d'exercices sans animation :
node --input-type=module -e "import {EXERCISES} from './src/data/library.js';
console.log(EXERCISES.filter(e=>!e.gif).length, 'sans GIF');"
```

---

# 5. LA RECETTE QUI FONCTIONNE (pour corriger un décor)

Un décor se corrige **sans jamais toucher à l'athlète** :

1. **Extraire les poses existantes** du GIF à corriger :
   `convert "ancien.gif" -coalesce -scene 0 "pose-%d.png"`
2. **Générer chaque pose** avec le générateur d'image en passant **2 images** :
   - **image 1** = la pose existante (l'athlète à conserver **tel quel**) ;
   - **image 2** = `reference/05-SOL-CIBLE-1er-GIF-valide.png` (la référence de décor).
   Et demander explicitement : *« ONE SINGLE CONTINUOUS BACKGROUND, BRIGHTLY LIT, no collage, no patchwork,
   no lighter rectangles, no visible seams. Large smooth pale cream/sandy flagstones, very light warm sandy beige,
   NOT grey, NOT dark, NOT small cobblestones with dark grout lines »*.
   → Cette formulation a corrigé les **artefacts en rectangles plus clairs** du gainage planche.
3. **Vérifier chaque pose** : coin de sol ≈ 225–240 en rouge, saturation ≥ 22, athlète inchangé.
4. **Assembler** : `./faire-gif.sh A.png M.png B.png 440x246 sortie.gif`
   — donne 5 images, délais `25 20 50 20 25` centisecondes (vérifié).
5. **Présenter** le GIF à l'utilisateur. **Attendre l'accord.** Puis intégrer.

**Limite : 10 générations d'images par tour.** Les poses déjà générées sont **conservées dans le dépôt**
(`build/corrections/_poses-sable/`) : un tour suivant ne repaie que ce qui manque.

---

# 6. ÉTAT EXACT DES CORRECTIONS (honnête, vérifié)

## 6.1 Intégré dans l'application — 9 exercices
| Exercice | Média | Sol |
|---|---|---|
| Front squat | `08e001311b255115.gif` | 237 |
| Fentes bulgares haltères (pied avant surélevé) | `81d9dc9b0652b954.gif` | 242 |
| Leg extension | `4a75246261f34b24.gif` | (machine) |
| Bulgarian split squat | `f183700b3362f93b.gif` | 224 |
| Bulgarian split squat haltères | `493af81454d9f86c.gif` | — |
| Goblet squat | `33d8d73dda8abb5b.gif` | — |
| Leg press | `d7bd0092279c8789.gif` | 234 |
| Back squat (charge modérée) | `8dcad3315ed67aa3.gif` | 228 |
| Presse à cuisses pieds hauts | `73b7bb33f4a9d6df.gif` | 226 |
| Step-up sur banc (hauteur du genou) | `0e32e3e5fab9f6f6.gif` | 223 |

## 6.2 Corrigé et prêt, en attente d'accord utilisateur
`back-squat-charge-moderee` (229) · `step-up` (224) · `bulgarian split squat` (224) · `leg press` (234) ·
`bulgarian haltères` (228) · `goblet squat` (224) · `squat cycliste` (219) · `abduction assise` (240) ·
`pallof press` (213) · `squat poids du corps` (235) · **`pompes` (219)** · **`pont-fessier-activation` (233)**

## 6.3 RESTE À CORRIGER — **1 SEULE POSE** (le travail à finir avant toute autre chose)
Les 9 exercices qui restaient ont été traités. **Il ne manque plus qu'une pose :**

| Exercice | État |
|---|---|
| **abduction hanche** | poses A et B **bonnes** (sol 236 / 230, athlète DEBOUT, mains sur les hanches). La **pose M est fausse** : le générateur a produit un athlète **allongé sur le côté** (autre exercice). → **régénérer UNIQUEMENT la pose M** |

**Ce qui a été terminé** (sol sablé, contrôlé visuellement, sans artefacts) :
gainage planche · clamshell · fire hydrant · pompes · pont-fessier-activation · face-pull ·
bulgarian haltères · goblet squat · squat cycliste · abduction assise · pallof press · squat poids du corps ·
bulgarian split squat · leg press · back squat charge modérée · presse à cuisses · step-up

### Comment finir (1 génération suffit)
Source de la pose M : `animations/_audit/2026-10-11/gif/themeA/abduction-hanche-elastique-3poses.gif` (image 1).
Référence décor : `reference/05-SOL-CIBLE-1er-GIF-valide.png`.
**Imposer dans le prompt** : *« the athlete is STANDING UPRIGHT, front-facing, both hands on the hips, one leg
lifted straight out to the side, do NOT lie him down, do NOT change the exercise or the camera angle »*.
Puis :
```bash
./animations/_locked/build/faire-gif.sh abduction-hanche-0.png abduction-hanche-1.png abduction-hanche-2.png \
  440x246 abduction-hanche-elastique-3poses.gif
```
Les poses A et B sont dans `build/corrections/_poses-sable/abduction-hanche-elastique-{0,2}.png`.
⚠️ Le quota est de **10 générations d'images par tour** : c'est la seule raison pour laquelle cette pose reste.

→ **Après cette pose : les corrections sont TERMINÉES, et il faut prévenir l'utilisateur.**

## 6.4 Conformes — NE PAS Y TOUCHER (18)
lot1 dead-bug / bird-dog / gainage-latéral · lot2 dead-bug-rotation / gainage-latéral-dyn / mountain-climbers ·
lot3 circuit-abdos / circuit-gainage · lot4 développé haltères plat / plat-neutre / décliné-neutre ·
lot5 incliné-30 / incliné-45 / incliné-45-prise-neutre ·
themeA mobilité-des-épaules / respiration-diaphragmatique / hip-thrust-unilateral / fentes-arrière-pdc

---

# 7. CONSIGNES DE TRAVAIL — POUR CHAQUE AGENT

1. **Une seule branche** : `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`. On s'y réfère et on la complète.
   Pas de branche parallèle, pas de divergence : **la continuité et la cohérence du projet en dépendent.**
2. `git fetch` **avant** d'écrire. Branche partagée entre plusieurs sessions : le local peut avoir du retard.
   Si le distant a avancé : `git reset --hard origin/...` puis ré-appliquer son travail. **Jamais de force-push.**
3. **Mesurer avant d'annoncer.** Chaque chiffre publié doit venir d'une commande réellement exécutée.
4. **Écrire dans le suivi** : ce qui est fait, ce qui est mesuré, ce qui reste. Les autres agents en dépendent.
5. **Ne pas multiplier les questions** à l'utilisateur : l'urgence est l'application. Mais **ne jamais intégrer
   sans accord explicite** et **ne jamais prendre un « Y » seul pour une validation**.
6. **Toujours présenter** un GIF avant de l'intégrer. Toujours.
7. Si un outil échoue (chemin, quota, sandbox réinitialisé) : **le dire**, et continuer sur ce qui est possible.

---

# 8. FIN DE MISSION

**Les corrections sont terminées quand :** il ne reste **aucun** exercice de la liste du § 6.3,
que chaque GIF est mesuré (coin de sol 225–240, saturation ≥ 22), présenté, et validé.

**Quand c'est fait : prévenir l'utilisateur.** C'est lui qui l'a demandé explicitement.

**Ensuite seulement**, on poursuit : compléter les exercices du programme qui n'ont **aucune** animation
(≈ 91 côté élite au dernier décompte) — en respectant le protocole : **1 image fixe → accord → GIF**.
