# 🚧 Ce qui coince — état au 26 septembre 2026, après lot 52 — 375 valides / 14 restants (Yanis piscine en cours)

Liste demandée pour revue de votre côté. **331 / 331 visuels validés, 0 restant, et la
relecture case par case est TERMINÉE (331 / 331 relus)**. Ce fichier ne contient que les
points bloquants ou qui demandent une décision.

> ⚠️ **Branche de travail changée par la plateforme** : cette session Arena est fixée sur
> `arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap`. Le contenu de `arena/01a0d6f5-…` (commit
> `11d1594`) y a été récupéré intégralement ; tout le travail est désormais poussé sur
> **`01a0dbe5`** uniquement. L'ancienne branche n'est plus alimentée.

## 0. Feuille de route donnée par l'utilisateur le 26/09 (dans cet ordre, par étapes)

1. **Piscine + cardio pour Yanis (images manquantes)** → EN COURS : 58 couples homme ajoutés,
   **44 validés aux lots 51–52** (n° 332–375 du PDF), 14 restants = 9 générations (lot 53 : 4 reprises
   piscine + 5 elliptique/transition) + câblage « athlète = profil » pour piscine/elliptique.
2. Vérification du PDF par l'utilisateur → corrections par numéro (priorité 1 dès réception).
3. Pouvoir **augmenter le niveau** du programme cardio (piscine et autres) sur Émilie et Yanis
   (les protocoles ont déjà 3 niveaux `niveaux[]` ; la sélection est automatique dans `bh()` :
   à exposer à l'utilisateur — à concevoir après l'étape 1).
4. **Images pendant le chronomètre** (piscine, aqua, nage fractionnée, elliptique) : le timer `v5`
   n'affiche une image que pour piscine (`JarvisPoolMedia`) ; les étapes elliptique n'en ont aucune.
5. Construire l'application (1.4.9 → clé de signature utilisateur).
6. IA conversationnelle (en dernier).

## 1. La planche encore refusée (je continue dessus au prochain tour)

**4** (`production/a-refaire.json`, stratégie différente consignée pour chacune) :
`battements-au-bord|homme` (2 essais : même jambe / jambe pliée → essai 3 vue zénithale),
`mobilite-hanches-chevilles|homme` (20 cm d'eau → eau à la taille), `sprint-nager-a-fond|homme`
(corps vertical → profil horizontal), `talons-fesses|homme` (genou devant → talon derrière). Les 3 refus de la relecture 26
(torsion allongée montrée ASSISE, soulevé de terre ordre inversé + angle qui change,
transition face/profil) ont été **refaits et acceptés dans le même tour** (lot 50, 3 générations),
et rowing assis + étirement a eu ses cases remises dans le bon sens (début = étirement).

## 1b. Chantiers ouverts (pas bloquants, planifiés)

1. **Lot « style » : 33 GIF** ayant une case sans vert lime sur le corps
   (`production/style-a-reprendre.json` : 26 mesurés + 7 constatés à la lecture visuelle de ce
   tour). Le geste est juste partout ; reprise **uniquement sur votre décision** (§3.2).
2. **Relecture cumulative : TERMINÉE** (feuilles `verification/relecture-26-01..06.jpg`).
3. **Livraison finale** : il ne manque QUE votre clé (§3.6).

## 2. Blocs techniques récurrents du générateur d'images (constats, pas des excuses)

1. **Barre sur le dos vs rack avant** : en vue de profil, une génération sur deux pose la
   barre devant le cou. Les vues **de face** et **de dos** réussissent (prouvé lot 20).
2. **Amplitude finale des tirages** : le modèle s'arrête à mi-course pour les rowings lourds féminins.
3. **Orientation gauche/droite** : les gestes unilatéraux se retournent parfois entre les
   deux cases ; il faut l'ancrer explicitement (« tête du même côté de l'image »).
4. **Têtes/pieds coupés** aux bords des cases : corrigé par la consigne de marges (lot 20).
5. **Modération d'image** : 1 blocage aléatoire sur 30 générations ; un échec compte dans le lot de 10.
6. **Vert absent d'une case** : le générateur ne colore souvent que la case « de travail » ;
   c'est l'origine du lot style (33).

## 3. Décisions que j'attends de vous (rien n'est fermé en silence)

1. **back-extension-45° prise snatch** (compté valide) : aucune barre n'apparaît, bras
   croisés. Le geste 45° est juste, le qualificatif « prise snatch » non représenté.
   → garder tel quel, ou refaire avec barre prise large sur les épaules ?
2. **Lot « style » des 33 GIF** dont une case n'a pas de vert lime : les régénérer
   (3 à 4 lots de 10) ou accepter l'état livré ?
3. **PDF de revue** (`livraison/REVUE-331-exercices.pdf`, 122 pages, 363 exercices) : numéros
   **figés** (1–331 inchangés ; Yanis piscine à partir du n° 332). Vos « coquille au n° X » sont
   traités en priorité 1 au prochain tour.
4. **Essai téléphone de la 1.4.8** : les groupes de constats restent OUVERTS jusqu'à votre
   retour ; aucun n'est clos sans vous.
5. **Souleve de terre — test 1RM** : un seul plateau par côté (charge peu crédible pour un 1RM),
   geste et ordre justes. → garder, ou refaire avec barre lourde ?
6. **Clé de signature** : absente de cet espace de travail, je ne la fabrique ni ne la
   publie. **Tout le reste est prêt** : `evolution/android/build-media-149.py --unsigned`
   reconstruit et contrôle l'APK 1.4.9 non signé en 3 s (103,8 Mo, 331 GIF vérifiés dans le zip) ;
   le mode `--real` signe v2+v3 avec l'identité durable `150e3846…` restaurée depuis le
   chiffré du dépôt par **votre clé de récupération** (`/tmp/rk.txt`, mode 0600), dépose
   `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`.
   Prérequis outils (hors Git, à réinstaller après reset) : `jdk4py==17.0.9.2` +
   `cryptography==46.0.3` sous `.cache/signing-tools`, `prepare-home-tools.py` (apksigner épinglé).

## 4. Contraintes d'environnement (sans impact sur le contenu)

- L'espace de travail se réinitialise souvent : restauration = `git fetch origin
  arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD` + venv.
  **Zéro perte** : tout est poussé à chaque tour.
- `.cache/` n'est pas persistant : web 1.4.8, payloads, APK non signé se régénèrent en
  moins d'une minute (`payloads-148.mjs` → `overlay-331.py` → `build-media-149.py --unsigned`).
- 2 GIF orphelins à la racine de `gif/` (premiers lots) : sans effet sur l'app, nettoyage
  prévu au câblage final.
