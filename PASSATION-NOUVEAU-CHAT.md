# PASSATION — JARVIS Fitness (Yanis & Émilie) — état au 02/10/2026 (soir)

Bloc à coller **avant toute action** dans un nouveau chat. Dépôt :
`Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Branche de travail :
`arena/01a0fd17-jarvis-fitness-yanis-emilie-ap`.

**Important** : l'espace de travail est réinitialisé souvent. Mesurer l'état réel avec
`git fetch origin <branche>` puis `git reset --hard FETCH_HEAD` — c'est la seule source
de vérité (le disque local peut revenir en arrière).

---

## 1. CONSIGNE À NE PAS NÉGOCIER

1. **Priorité absolue : NETTETÉ et QUALITÉ.** Partir des PNG natifs, retoucher en
   résolution native, **puis** exporter. Jamais recolorié un GIF pixelisé, jamais agrandi
   un GIF.
2. « **Le vert doit bien couvrir la peau, pas dépassé.** » Trois mesures dans chaque
   CONTROLES.json : `couverture_peau`, `debordement_vert`, et la décomposition du manque
   (`manque_peau` / `manque_vert_pale` / `manque_autre`).
3. **Lots de 4 numéros.** Ne jamais toucher à un numéro déjà validé. **Ne jamais
   remplacer un GIF livré sans accord explicite**, numéro par numéro — **sauf** les
   remplacements déjà demandés et intégrés (voir § 2).
4. **APK d'origine, prescriptions, gestes et prises validés : intouchables.**
5. **DRAPEAU ROUGE** dès que la limite de session approche : recopier consigne + passation.
6. **L'œil de l'utilisateur tranche**, jamais les chiffres seuls. Pièges payés : le
   feuillage du décor (n°1/9/10) et l'eau du bassin (n°292/313) pris pour le muscle ;
   moyenne ≠ médiane (référence 260 = **0,914 en MÉDIANE**, teinte 86,1°).
7. **Aucun chrono ne doit afficher autre chose qu'un humain animé** (GIF). C'était le
   défaut corrigé le 02/10/2026 (§ 2).

## 2. CE QUI A ÉTÉ FAIT LE 02/10/2026 (vérifié)

**A. Tous les exercices ont un GIF humain.**
209 exercices sur 209 (95 avant). 134 visuels intégrés : 38 issus des retouches validées
(lots 1→21, prototype n°44, série « femme » au vert corrigé) + 96 du corpus des GIF livrés,
appariés par nom (139 exacts, 48 inclusions, 5 familles). Magasin média par empreinte
(`sha256(contenu)[:16].gif`) + vignettes `thumbs/*.webp`.

**B. Le chrono affiche un GIF humain à chaque étape** (le défaut signalé : « quand je lance
le chrono il n'y a pas le GIF »). 50 visuels d'étapes convertis des JPG statiques en GIF
humains, variante homme/femme :
- **29 étirements** (avec le visuel du profil actif : homme pour Yanis, femme pour Émilie) ;
- **19 guides piscine** — dont Sprint (n°292), Retour au calme (n°313), Ciseaux (n°210),
  Aqua-jogging (n°233), Battements (n°237), Déplacements latéraux (n°252), Nage douce
  (n°258), Gainage vertical (n°274), Talons-fesses (n°326) ;
- **10 étapes de protocole piscine/aqua** et **5 étapes de cardio elliptique** ;
- **3 étapes d'échauffement** (mise en route, mobilité, approche).
Un **résolveur « nom d'étape → GIF humain »** a été ajouté : tout chrono affiche un humain
animé même si l'étape ne transporte pas d'image. Deux trous ont été bouchés dans la
foulée : le **dernier exercice de musculation** encore illustré par une image statique
(« Développé haltères assis » → GIF humain vérifié à l'œil) et les **chronos lancés sans
image** depuis les routines (respiration lente, mobilité des épaules, étirement ouvert
depuis la bibliothèque). Un **filet de sécurité** choisit désormais un GIF humain selon la
nature de l'effort (breathe, stretch, swim, aqua, walk, run, row, lat, curl) : aucun chrono,
quelle que soit son origine, ne peut plus rester sans humain animé.
Contrôles : **209/209 exercices**, **420 étapes** de protocoles piscine/aqua, 18 étapes
écrites en dur, 70 étirements/échauffement, 22 replis — **0 sans GIF, 0 visuel introuvable**.

**C. Livraison.** APK signé (keystore du dépôt) construit par workflow sur tag `v*`, puis
copié dans `downloads/` par `mirror-apk.yml` → lien `raw` à coller dans Chrome. 96 tests :
94 passent, 0 échec, 2 ignorés.

## 3. MES 4 CONSIGNES, DANS CET ORDRE (à mener dans le nouveau chat)

1. **Revoir les coachs** : qu'ils soient les plus performants et réalistes possible dans
   l'accompagnement ; consignes et suivis **cohérents entre eux** et **adaptés à mes
   retours et à mes résultats** (RPE, séances manquées, progression, douleurs).
2. **Émilie** : ajouter **metcon piscine** et **metcon aqua tabata** en plus de ce qu'elle
   a déjà.
3. **Séances piscine / aqua tabata** : **trop faciles et pas assez diversifiées** —
   enrichir, durcir, varier les structures.
4. **IA conversationnelle** : la plus performante possible. À traiter **en dernier**.

## 4. MÉTHODE ET OUTILLAGE (éprouvés)

- Inventorier l'existant **avant** de modifier : `src/engine/coach.js`, `team-review.js`,
  `voice-coach.js`, `planner.js`, `source-schedule.js`, `fitness.js`, `src/data/library.js`.
- Proposer → faire valider → seulement ensuite modifier. Ne rien changer aux numéros
  validés ni aux GIF livrés sans accord explicite.
- Corpus des **389 visuels livrés** : `evolution/media/refonte-photo/gif/{homme,femme}/`
  (branches d'archive, ex. `c6852983`, 430 fichiers, 82 Mo). Le zip complet de branche se
  récupère par `https://codeload.github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/zip/<sha>`
  (≈ 2 Go, 20 s).
- Retouches validées : `evolution/media/refonte-photo/hd-2026-09-30/lotN/exports/` +
  `.../sans-source/vert/exports/`, avec les PV `VALIDATION-*.json`.
- Outils : `evolution/media/tools/` (`retouche-*.py`, `page-lot.py`, `nouveau-lot.py`,
  `enregistrer-validation.py`, `planche-tri.py`, `priorite-sources.py`).
- Le magasin média de l'app est **par empreinte** : le nom du fichier = `sha256[:16]` du
  contenu. Toute modification de contenu crée donc un nouveau nom — ne jamais supposer
  qu'un chemin reste valable.

## 5. CHAÎNE DE LIVRAISON (téléchargement)

1. Pousser un tag `v*` → `android-release.yml` construit l'APK signé et publie la release
   (≈ 3 min).
2. `mirror-apk.yml` copie l'APK dans `downloads/` (sha256 vérifié avant commit) → lien à
   coller : `https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/<branche>/downloads/<fichier>.apk`
3. `pages-apk.yml` existe pour un lien `github.io`, mais **GitHub Pages doit être activé à
   la main** (Settings → Pages → Source : GitHub Actions) : l'agent n'a pas ce droit.
4. Le lien doit être **écrit en clair dans le message** (copier-coller dans Chrome). Les
   téléchargements déclenchés depuis l'aperçu ou le chat sont bloqués sur téléphone.

## 6. PROCHAINE ACTION CONCRÈTE

**Chantier 1 (coachs)** : inventaire des consignes et suivis actuels, liste de ce qui est
générique ou incohérent, puis propositions de règles qui réagissent aux retours et aux
résultats (RPE, séances manquées, progression 1RM, cardio, douleurs). Ne rien modifier
dans l'app sans validation. Ensuite : chantier 2 (metcon piscine + aqua tabata pour
Émilie), chantier 3 (diversification piscine/aqua), chantier 4 (IA conversationnelle).
