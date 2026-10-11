# PASSATION — À COPIER-COLLER
JARVIS Fitness (Yanis & Émilie) — état au 11/10/2026
Branche unique : `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap` — HEAD `2225d5b`
À lire AVANT de produire quoi que ce soit :
`yanis-fitness-evolution/animations/_locked/REFERENCE-VERROUILLEE.md` (le verrou) et `SUIVI-COMMUN.md` (l'état vérifié).

---

## 1. L'URGENCE — à comprendre en premier
On ne fait pas un musée de GIF. On fait une **application rapide, fonctionnelle et performante**.
- Rapide : elle doit s'ouvrir et répondre **immédiatement** sur un téléphone.
- Fonctionnelle : chaque exercice du programme doit avoir son animation **et** son texte-clé.
- Performante : les GIF sont **légers** (cible < 600 Ko), jamais de fichier de 3 Mo.
Règle d'arbitrage : **en cas de doute entre "plus beau" et "app qui marche", on livre l'app qui marche.**
Ne bloque jamais l'app entière pour un GIF. Le GIF se corrige après, en série.

## 2. LES RÈGLES (non négociables)
1. **Le personnage de départ est FIGÉ.** Mannequin 3D très musclé, corps blanc/argent mat, visage noir sans traits, casquette blanche, short noir, baskets blanches, muscles travaillés en **jaune-orange doré**. Référence : `_locked/reference/00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg` (fichier de l'utilisateur, 470629 o). Jamais de redessin, jamais de substitution.
2. **Le décor est FIGÉ sur la cible E1** : terrasse en pierre vue sur mer, mer **bleue dense** visible, palmiers et plantes en pot **denses**, lumière **dorée**, muret bas. C'est le rendu des **premiers GIF validés** = le fichier de l'utilisateur. Interdits absolus : salle de sport, parquet, mur intérieur, miroir, fond gris, décor **pâle/délavé**.
3. **Un nouvel exercice = UNE image fixe d'abord.** Je génère/compose **une seule image fixe de validation**, je la montre, et **j'attends l'accord explicite** de l'utilisateur AVANT de produire le GIF. Pas d'accord = pas de GIF.
4. **Chaque GIF est présenté** à l'utilisateur avant intégration.
5. **Un "Y" isolé ne vaut PAS validation.** Seul un accord explicite ("oui", "ok", "vas-y", "je valide") compte.
6. **1 exercice = 1 animation.** Jamais un fichier partagé entre deux exercices (défaut historique réel : `cf312b839f6da027.gif` sert 3 entrées, `f73444e9dc2fee89.gif` en sert 2 — à séparer).
7. **Intégration dans l'app uniquement après feu vert explicite.** L'intégration se fait en **4 endroits** : `public/media/`, `release/media/`, `public/media-index.json` + `release/media-index.json`, `src/data/legacy.json` (et, si le bundle de `release/assets/` est livré tel quel, il doit être patché aussi).
8. **Ne jamais régénérer un GIF conforme** (18 sont conformes, liste au §3 de `SUIVI-COMMUN.md`).
9. Travailler dans cette branche. Vérifier le distant (`git fetch`) avant d'écrire : elle est partagée.

## 3. LES ERREURS À NE PAS COMMETTRE (toutes déjà commises une fois)
1. **La pire : réaligner sur le décor pâle.** Un plan a proposé de réaligner 33 GIF sur le décor pâle du front squat. **C'est faux.** La cible est **E1 = dense**, pas la version pâle des 10-11 octobre.
2. **Juger un GIF sans le coalescer.** `identify` brut montre des frames `1×1` fantômes → on croit à tort à un GIF cassé. Toujours : `convert gif -coalesce` puis contrôler moyenne/écart-type.
3. **Annoncer des chiffres faux.** "36 puis 33 puis 21 GIF cassés" : **faux**. Le vrai chiffre est **1 cassé + 20 décors pâles + 18 conformes**. Ne jamais annoncer un chiffre sans l'avoir mesuré.
4. **`-delay` doit précéder CHAQUE image** dans la commande ImageMagick, sinon les durées sont fausses. (Utiliser l'outil fourni, il est testé.)
5. **Ne pas éditer un bundle JS avec Python en mode texte** : les fins de ligne sont converties et le fichier est corrompu silencieusement. Lire/écrire en **binaire** (`rb`/`wb`) et vérifier que le delta d'octets vaut exactement la taille du texte ajouté.
6. **Confondre "bulgarian split squat" et "fentes bulgares haltères"** : ce sont **2 exercices distincts**. Les mutualiser mettrait 2 exercices sur 1 animation.
7. **Croire que le `/tmp` survit** : non. Tout ce qui compte va dans le dépôt.
8. **Utiliser `/media` ancien ou le corpus "refonte-photo" (salle, vert lime) comme référence** : jamais.
9. Ne pas demander à l'utilisateur de re-fournir le screenshot de référence : il est au dépôt (`834235a`).
10. Toujours `git fetch` avant push (branche partagée) ; **jamais de force-push**.

## 4. OÙ SONT LES CHOSES
| Quoi | Où |
|---|---|
| Le verrou (règles + décision E1) | `animations/_locked/REFERENCE-VERROUILLEE.md` |
| L'état vérifié (queue de correction, méthode de contrôle, rétractations) | `animations/_locked/SUIVI-COMMUN.md` |
| La queue chiffrée, 50 GIF | `animations/_locked/QUEUE-CORRECTION.tsv` |
| L'outil d'assemblage | `animations/_locked/build/faire-gif.sh` |
| Références et verrous GIF | `animations/_locked/reference/` |
| Images fixes de validation en attente | `animations/_locked/build/validation/` |
| Galerie visuelle | `animations/_locked/GALERIE.html` |
| Guides de l'app (clé → GIF) | `src/data/legacy.json` (fusion `elite` + `emilie`, clés en minuscules sans accents) |
| Résolution dans l'app | `src/data/library.js` (~l.188 fusion, ~l.251 résolution par `norm()`, ~l.278 `gif`) |
| Build livré | `release/` (guides inlinés dans `release/assets/index-BLZxzv9Y.js`) |
| Audit complet | `animations/_audit/2026-10-11/` (rapport + `PLAN-CORRECTION.md` — **lire la bannière, son plan initial est faux**) |

Modules de reprise rapide :
```bash
cd yanis-fitness-evolution && npm ci && npm test        # 96 tests, 0 échec
node --input-type=module -e "import {EXERCISES} from './src/data/library.js';
console.log(EXERCISES.filter(e=>!e.gif).length, 'exercices sans GIF');"
./animations/_locked/build/faire-gif.sh A.png M.png B.png 440x246 sortie.gif   # contrôle E1 >= 22 intégré
```

## 5. ÉTAT EXACT (honnête, pas de complaisance)
**Livré et intégré dans l'app ce jour (commit `2225d5b`)** — feu vert utilisateur explicite :
- `front squat` → `/media/6008e0f8a2557d40.gif` (décor E1, corrigé ; remplace l'ancien `1c28908ab83cde2e.gif`)
- `fentes bulgares haltères (pied avant surélevé)` → `/media/3a817d4e229a92ee.gif` (nouveau)
- `leg extension` → `/media/0223a993070bf19b.gif` (nouveau, 5 images)
- Copiés dans `public/media` **et** `release/media`, indexés, guides créés dans `legacy.json`, bundle de `release/` patché.
- Vérifié : `npm test` = **94 passés / 0 échec** ; les 3 exercices résolvent bien leur GIF ; `media-index.json` = 267 entrées.

**Reste à faire (ne pas dire que c'est fini) :**
- **1 GIF cassé** : `themeB/bulgarian-split-squat-3poses.gif` (frames 2-4 vides) → à régénérer. **2 images fixes de validation sont déjà prêtes** dans `build/validation/` et attendent l'accord de l'utilisateur.
- **18 décors pâles à réaligner sur E1** : themeA (abduction-assise, pallof-press, squat-poids-du-corps, face-pull, clamshell, fire-hydrant, abduction-hanche, pompes, gainage-planche, pont-fessier-activation) + themeB (presse-a-cuisses-pieds-hauts, back-squat-charge-moderee, bulgarian-split-squat-halteres, leg-press, goblet-squat, leg-extension, step-up, squat-cycliste).
  Méthode : **3 fonds par exercice** (positions A/M/B), **jamais l'athlète**, puis assemblage par `faire-gif.sh`.
- **18 GIF conformes** : ne pas y toucher.
- **268 animations restantes** sur un périmètre de **307** (39 livrés = 12,7 %).

**Ordre de priorité imposé par l'urgence :**
1. Le GIF cassé (bulgarian) — dès accord sur l'image fixe.
2. Les 18 décors pâles, en série, du plus visible au moins visible.
3. Compléter les exercices sans animation.

## 6. MESSAGE-TYPE POUR L'UTILISATEUR
> État : 3 animations intégrées (front squat corrigé, fentes bulgares, leg extension), 96 tests au vert.
> Il reste 1 animation cassée + 18 décors à réaligner. Je ne touche pas aux 18 déjà conformes.
> Pour le prochain exercice, je t'envoie **une image fixe** ; dis-moi **oui** et je fais le GIF.
