# 🚩 PASSATION — reprendre la refonte des visuels dans un nouveau chat

**À lire en entier avant de produire quoi que ce soit.** Ce fichier est écrit pour qu'une
session neuve (sans mémoire de la conversation précédente) puisse continuer sans rien casser.

---

## 1. Où l'on en est (mesuré, pas estimé)

- Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`
- Branche de travail **obligatoire** : `arena/01a0d6f5-jarvis-fitness-yanis-emilie-ap`
  (session Arena courante ; ne jamais pousser sur `main`, ne jamais créer d'autre branche).
- Avancement : **331 / 331 animations validées — JALON : plus aucun exercice sans visuel** (`production/etat.json`, clé `chiffres`).
  Restent **0**. Toutes surfaces terminées (musculation 203, tabata sol 37,
  piscine guides 9, protocoles 40, aqua tabata 6, étirements 29, elliptique 5, échauffement 3).
  **Tabata au sol TERMINÉE (37/37), piscine guides TERMINÉE (9/9).** **Musculation TERMINÉE (203/203).**
  Terminés : **étirements 29 ✅, elliptique 5 ✅, échauffement 3 ✅**.
- **Vérification des mouvements déjà créés (25/09)** : 70 couples relus case par case
  (`verification/VERIFICATION-2026-09-25.md`) ; 7 gestes faux trouvés parmi les livrés
  (4 refaits et acceptés au lot 17 ; 3 retirés des valides ce tour : back-squat-barre-haute,
  back-squat-inertie-pause-complete, burpees) ; **24 couples restent à relire** (feuilles de 3,
  307 déjà relus).
  Style : 25 GIF ont une case sans vert lime (`production/style-a-reprendre.json`),
  à reprendre dans un lot dédié sans toucher aux gestes.
- Index visuel numéroté : `review/index-general.jpg` (331 vignettes, régénéré à chaque lot).

## 2. Ce que l'utilisateur a demandé (et qui ne change pas)

Refaire **tous** les GIF animés de l'application à partir de la nouvelle photo, pour
**tous les domaines** (musculation, tabata au sol, aqua tabata, piscine, metcon piscine,
vélo elliptique, échauffement, étirement) : aucun oubli, aucun exercice sans visuel,
enchaînements propres et fluides, **mêmes visage et corps que la photo validée**
(homme = `planches/maitre-homme.png`, femme = `planches/maitre-femme.png`, visage A,
poitrine généreuse validée). L'athlète qui montre l'exercice est le propriétaire du
profil : Émilie → femme, Yanis → homme.

Contraintes permanentes : ne rien perdre de l'app 1.4.0 (209 exercices, 11 rubriques,
2 profils, étapes 1–7) ; **aucune image « famille C »** ; jamais de vélo ni d'elliptique
en récupération de piscine ; ne jamais réécrire une prescription pour justifier une
mauvaise image ; pas de rotation/miroir global ; une seule version finale livrée à la fin ;
`PASSATION.md` mis à jour et présenté à chaque étape ; **la clé de signature ne se publie
jamais** (l'utilisateur la recollera au moment de la livraison) ; IA conversationnelle en
dernier.

Le travail se fait par **lots de ≤ 10 images par tour** (plafond de l'outil de génération ;
un échec compte aussi). L'utilisateur écrit « suite » pour enchaîner.

## 3. Installation (l'espace de travail est réinitialisé souvent)

```bash
cd /home/user/JARVIS-Fitness-Yanis-Emilie.apk
git log --oneline -1                     # si HEAD != branche arena : récupérer
git fetch origin '+refs/heads/arena/01a0d51c-jarvis-fitness-yanis-emilie-ap:refs/remotes/origin/arena/01a0d51c-jarvis-fitness-yanis-emilie-ap'
git reset --hard origin/arena/01a0d51c-jarvis-fitness-yanis-emilie-ap
python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install -q pillow numpy
```

Ne jamais supprimer ni renommer la racine du dépôt.

## 4. La chaîne de production

| Outil | Rôle |
|---|---|
| `evolution/media/tools/refonte-sheet.py` | planche 2 cases → GIF animé (découpe au séparateur clair, recalage du décor, même fenêtre, hauteur 440, 500 ms). Options `--athlete homme\|femme --out <dossier gif> --sheet <jpg de contrôle>` |
| `evolution/media/tools/verif-ids.py` | **garde-fou obligatoire** : refuse toute planche dont le nom n'est pas un identifiant réel de `production/plan.json`. À lancer **avant** la conversion |
| `evolution/media/tools/verif-gifs.py` | mesure les GIF livrés (2 images, 500 ms, 440 px, identifiant du plan, vert des deux cases, quasi-doubles, zone du vert) : `verification/verif-gifs.json` |
| `evolution/media/tools/feuilles-verif.py` | imprime les DEUX cases d'un GIF en pleine définition, 3 mouvements par feuille : l'outil de relecture humaine imposé |
| `evolution/media/tools/index-general.py` | régénère `review/index-general.jpg` (vignettes numérotées de tous les valides) |
| `production/plan.json` | 343 lignes = **331 couples (mouvement × athlète)** ; 17 gestes existent chez les deux athlètes et demandent deux GIF |
| `production/prescriptions.json` | le geste exact lu dans l'APK livrée (source de tous les prompts) |
| `production/etat.json` | valides / restants / chiffres par surface |
| `production/a-refaire.json` | planches refusées avec motif + `reglesPrompt` + corrections utilisateur |
| `reference-app/*.gif` | GIF d'origine extraits de l'APK : **témoin à regarder** quand un nom est ambigu |
| `gif/homme/`, `gif/femme/` | les GIF livrés (`<slug>-homme.gif`, `<slug>-femme.gif`) |
| `review/*.jpg` | planches de contrôle montrées dans le chat |

Commande type d'un lot :

```bash
P=.cache/pyvenv/bin/python; R=evolution/media/refonte-photo
$P evolution/media/tools/verif-ids.py $R/planches/lotNN/*.png
$P evolution/media/tools/refonte-sheet.py --athlete homme --out $R/gif/homme \
   --sheet $R/review/lotNN-musculation-homme.jpg $R/planches/lotNN/*.png
```

## 5. Recette de prompt (elle a coûté cher, ne pas la réinventer)

> Edit the reference photo and produce a WIDE LANDSCAPE photographic demo sheet, 16:9,
> made of TWO panels of equal width side by side, separated by a thin light grey vertical
> line. The sheet reads like a book, from LEFT to RIGHT: the LEFT panel is the START of
> the movement, the RIGHT panel is the END. BOTH panels show the EXACT SAME MAN/WOMAN as
> the reference image: same face, same hair, same body, same clothes, same calm gym with a
> wooden floor, same lighting, and the SAME camera angle in both panels. … LEFT panel
> (start) … RIGHT panel (end), highlight <muscle> in lime green. Everything else keeps its
> natural colours. Photorealistic, natural skin texture, no text, no labels, no numbers, no
> arrows, no logo, no watermark.

## 6. Pièges déjà payés — à vérifier sur CHAQUE planche

1. **Prise en pronation** pour toute barre (mains **sur** la barre, paumes vers l'avant,
   jamais en supination dessous) — sauf cible qui dit supination/EZ.
2. **Poulie basse = câble horizontal** (rowing) ; **poulie haute = câble vertical**
   (tirage vertical). Écrire la position de la poulie en toutes lettres.
3. **Unilatéral** : écrire que l'autre bras/membre ne touche jamais l'engin, du début à la fin.
4. **Le nom cible décrit la machine**, pas le nom d'origine (ex. « rowing assis au cou »
   se dessine en **tirage vertical prise large**).
5. **Sens de lecture gauche→droite** : la case de gauche est le début. Vérifier qu'aucune
   planche n'est inversée.
6. **Le vert va sur le muscle cible uniquement** (ex. moyen fessier = côté de la hanche,
   pas la cuisse ; abduction = jambe **sur le côté**, kickback = jambe **en arrière**).
7. **Même cadrage entre les deux cases** (une case de face + une de dos = GIF qui saute).
8. **Myo-reps / mini-séries** : les deux cases sont presque identiques, le membre ne
   revient pas à la position de départ.
9. **Vérifier l'identifiant** avant d'écrire le prompt (`verif-ids.py`) : ne jamais dessiner
   pour un mouvement qui n'existe pas dans le plan.
10. **Lire les DEUX cases** d'une planche avant de la compter — jamais d'acceptation à l'œil
    sur une vignette. En cas de doute : recadrer et zoomer (`PIL`) plutôt que deviner.

## 7. À faire au démarrage du nouveau chat

1. **Aucune planche en attente** : `production/a-refaire.json` VIDE. **331/331 couples
   valides** après lot 45 (nage-douce résolue au 2ᵉ essai, nage-douce-respiration du 1ᵉʳ,
   10 copies conformes : 4 protocoles nage douce + 6 aqua tabata).
   Prochain tour = **livraison finale** : APK signé avec VOTRE cle (jamais publiée, à
   re-coller ; /tmp/rk.txt mode 0600), images pleine résolution, lien raw unique dans le
   chat ; en parallèle lot « style » (25 GIF) et relecture des 24 couples restants.
   Résolus au lot 35 : tirage-vertical-prise-neutre (poignées parallèles) et mollets-unilateraux
   (pied libre croisé en l'air). Résolus au lot 34 : ab-wheel et extensions-triceps-barre-ez.
   Résolus au lot 33 : developpe-incline-halteres et tirage-vertical-prise-large.
   Mountain climbers résolue au lot 31 (vue de FACE).
   Anciennement en attente : mountain-climbers, developpe-incline, tirage-vertical, ab-wheel, extensions-ez
   (vue de FACE, genou avant côté gauche puis droit de l'image) et developpe-incline-halteres
   (deux haltères séparés, quatre disques). Méthode gagnante sur refus
   asymétrique : éditer la case réussie pour fabriquer l'autre. L'audit réalisme est clos : ses 6 remplacements
   sont acceptés ; règles de grée obligatoires dans chaque prompt futur
   (`production/audit-realisme.json`).
2. Continuer la relecture des **75 couples déjà valides non relus** (feuilles de 3,
   `feuilles-verif.py`), puis le lot « style » des 22 GIF sans vert sur une case
   (`production/style-a-reprendre.json`).
3. Continuer la musculation (48 restants), puis
   **tabata au sol (27)**, **piscine guides (9)**, **piscine protocoles (40)**,
   **aqua tabata (6)** — par lots de ≤ 10.
3. Après chaque lot : convertir, relire, mettre à jour `etat.json`, `a-refaire.json`,
   `PASSATION.md`, régénérer `review/index-general.jpg`, commit + push sur la branche arena,
   et présenter la planche de contrôle dans le chat avec un tableau numéroté.
4. Clé de signature : **ne jamais la fabriquer ni la publier**. L'utilisateur la fournira
   au moment de la construction de l'APK final.

## 8. Livraison finale (rappel)

Une **seule** version complète à la fin, APK signé, **images en pleine définition**, et un
**lien cliquable unique** dans le chat :
`https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/<commit>/<chemin>`
