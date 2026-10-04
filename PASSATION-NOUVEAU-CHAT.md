# PASSATION — JARVIS Fitness (Yanis & Émilie) — état consolidé au 04/10/2026 (1.7.2)

Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Branche fixe :
`arena/01a10207-jarvis-fitness-yanis-emilie-ap`.

## État actuel

- **Release livrée** : 1.7.2 (`versionCode 172`), tag `v1.7.2-pyramide-circuit-aqua`, APK signée par GitHub Actions.
- **Miroir vérifié** : `downloads/Yanis-Fitness-Evolution-1.7.2-pyramide-circuit-aqua.apk` (87 796 244 octets), SHA-256 `ec89ec894635578dafabf41d460067f6ad2e8042c362d262c9f63aaabc868eaa`.
- **Chantier 3 validé et livré** : Pyramide piscine (1080 / 1440 / 1800 s) et Circuit aqua à intervalles variables (1260 / 1620 / 1850 s), trois niveaux chacun, séances facultatives démarrées manuellement pour Yanis et Émilie. Aucun changement à la programmation automatique.
- Les six protocoles source et les deux METCON validés sont conservés ; les mouvements et GIF existants sont réutilisés, sans modification des médias.
- Vérifications : `npm test` — 136 tests, 134 réussis, 0 échec, 2 ignorés ; build web et build Android signé réussis ; empreinte du miroir vérifiée.
- E2E : dernier passage complet connu en 1.7.0 — 17 réussis, 0 échec, 11 ignorés. Le nouveau scénario Playwright piscine/aqua n'a pas pu être lancé ici (Chromium absent, téléchargement indisponible).
- **Chantier 4 en cours — inventaire uniquement** : `pages/Jarvis.jsx` affiche le chat ; `engine/coach.js` est un interpréteur français local à règles/intents, appelé synchroniquement par `AppContext.sendCoach`. Pas de modèle, SDK d’IA, service HTTP d’IA, serveur, fournisseur ni clé API dans le dépôt.
- Messages par profil, limités à 100, persistés avec l’état local (IndexedDB/localStorage et sauvegarde native Android). Dictée/lecture vocale existantes via services du navigateur/Android selon réglages ; elles sont distinctes d’un LLM.
- Calculs, recommandations et actions passent actuellement par les moteurs locaux et des types d’action connus ; l’arrêt douleur est automatique, les autres changements passent normalement par une confirmation utilisateur. **Garde-fou recommandé pour la proposition** : aucun modèle ne modifie directement l’état ni ne fabrique des charges/mesures.
- **Proposition à valider, pas implémentée** : architecture hybride avec relais serveur pour la clé fournisseur, contexte sportif strictement minimal et opt-in, moteur local comme repli, actions proposées sous schéma fermé puis confirmation dans l’app. Fournisseur/hébergement/coût, données autorisées et niveau d’action restent à décider.
- **Point annexe repéré** : `src/app-identity.js` affiche encore `V 1.5.1` alors que package/Gradle sont en 1.7.2 (`versionCode 172`) ; ne pas corriger sans l’inclure au périmètre validé.
- **Suite** : chantier 4 reste le dernier ; terminer l’inventaire, soumettre et faire valider la proposition avant toute modification applicative.
- Pages reste bloqué par permissions ; ne pas dispatcher `pages-apk.yml` sans changement des permissions.

La branche distante est la source de vérité : toujours `git fetch origin`, vérifier la branche et le diff, puis avancer proprement si nécessaire. Ne pas changer de branche ni utiliser les anciennes consignes `git reset --hard` des notes historiques ci-dessous.

**Notes ci-dessous** : sections historiques rédigées au 02/10. Les contraintes médias et validations restent applicables ; les anciennes indications de branche, version, tests et prochaine action sont remplacées par l'état actuel ci-dessus.

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
Enfin, les **25 mouvements de cardio / HIIT / aqua tabata** (Burpees, Burpees simplifiés,
Squats, Squats doux, Squats sautés, Squats sumo, Jumping jacks, High knees, Montées de
genoux, Montées sur mollets, Chaise au mur, Chaise douce, Corde invisible, Dips au bord,
Fentes alternées, Mountain climbers lents, Oiseau-chien, Patineurs, Planche latérale G et D,
Pompes au mur, Ponts fessiers, Repos actif, Russian twist, Superman) ont reçu leur **GIF
humain du corpus** — le chrono n'affiche plus un visuel d'emprunt. Variante femme intégrée
pour Montées de genoux, Fentes alternées, Ponts fessiers et Squats.
Contrôles : **209/209 exercices**, **420 étapes** de protocoles piscine/aqua, 18 étapes
écrites en dur, 70 étirements/échauffement, **25 mouvements HIIT/Tabata**, 22 replis,
52 types de chrono × 2 profils — **0 sans GIF, 0 visuel introuvable**.

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
   Version livrée le 02/10 : `downloads/Yanis-Fitness-Evolution-1.5.1-chrono-gifs-v3.apk`
   (87 763 952 o, sha256 `45b589da…`, contenu neuf = tag `v1.5.1-chrono-gifs-v3`).
   Attention : `mirror-apk.yml` lit ses valeurs **par défaut** dans le fichier du commit
   poussé — quand le nom change, corriger les **quatre** lignes (`default` tag, `default`
   nom, `TAG`, `NOM`), pas seulement celles entre guillemets.
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

---

## 7. SÉANCE DU 02/10/2026 (2e chat) — AUDIT REFAIT À NEUF

L'utilisateur a redemandé de vérifier que **tous** les exercices/chronos ont un GIF.
J'ai réécrit un audit complet (`scripts/audit-gifs.mjs`) + un test de non-régression
(`tests/gif-coverage.test.js`, 6 cas). Résultat, **vérifié sur la branche** :

- **Musculation : 209/209** exercices avec démonstration humaine (GIF exact, 0 variante
  forcée, 0 « animation créée »). Fichiers présents.
- **Étirements : 29 positions × 2 profils = 58 visuels**, 0 manquant.
- **Chronos piscine/aqua : 840/840** étapes résolues (tous niveaux × homme/femme).
- **HIIT / Aqua Tabata : 25 mouvements × 2 profils = 50**, 0 manquant.
- **Chronos METCON : elliptique seul + combo elliptique→piscine, 856/856** résolus.
- **intervalSteps (tabata libre) : 0 étape sans GIF.**
- **0 fichier média référencé introuvable** (tous les `/media/*.gif` existent).

**Tests : 102 au total, 100 passent, 0 échec, 2 ignorés** (`npm test`).

L'APK livré `downloads/Yanis-Fitness-Evolution-1.5.1-chrono-gifs-v3.apk`
(87 763 952 o, sha256 `45b589da…`) contient bien les 381 fichiers de `public/media/`
et le code du résolveur (`pool-nage-statique`, `guide-ciseaux-au-bord`, `Burpees`
présents dans le bundle). Donc la correction du 02/10 est **bien dans l'APK livré** ;
si l'utilisateur ne voit toujours pas les GIF, c'est un cache/ancienne installation —
réinstaller l'APK v3 depuis le lien brut.

**Chantier 1 (coachs)** : propositions A–E **validées par l'utilisateur et
implémentées** dans la même séance (`v1.6.0-coachs`) :
- Nouveau module `src/engine/coach-state.js` : `weeklyCoachState(p, date, reviewOverride)`
  (décision unique : protect / deload −40 % / lighten −20 % / reprise / progress /
  maintain / nodata, avec raisons chiffrées), `applyCoachStateToSession`,
  `applyReviewAdaptation` (bilan fatigue ≥ 4 ou douleur ≥ 3 ⇒ prochaine séance réduite,
  une fois par jour). Les bilans de plus de 8 jours ne pèsent plus.
- `coach.js` : action `coach-state` dans `applyCoachAction` ; `coachFindings` affiche la
  décision en finding unique (remplace les findings douleur/récupération/creux séparés) ;
  séances manquées → action `replan`.
- `team.js` : `teamAdvice` ouvre sur la décision de la semaine ; `teamInsights` rôle 0
  porte la décision, rôles santé/mobilité lisent douleurs/énergie/échauffements réels.
- `Team.jsx` : enregistrer un bilan applique l'adaptation (B) + entrée « Mes adaptations ».
- `Training.jsx` : bannière « Décision du coach » sur la prochaine séance (A).
- Tests : `tests/coach-state.test.js` (14 cas). Total : **116 tests, 114 passent, 0 échec**.

**Livraison chantier 1** : tag `v1.6.0-coachs` → APK signé construit par
`android-release.yml`, miroir commité par `mirror-apk.yml` sur la branche
`arena/01a0fdbd-…` : `downloads/Yanis-Fitness-Evolution-1.6.0-coachs.apk`
(87 784 592 o, sha256 `1b3b9a7e…`). Lien brut à coller dans Chrome :
`https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/01a0fdbd-jarvis-fitness-yanis-emilie-ap/downloads/Yanis-Fitness-Evolution-1.6.0-coachs.apk`
L'utilisateur exige ce lien **cliquable dans le chat** (format Markdown
`[texte](url)`, pas de bloc de code), comme les fois précédentes.

**Prochaine action concrète** : chantier 2 (METCON piscine + METCON aqua tabata pour
Émilie, en plus de ce qu'elle a déjà), puis chantier 3 (enrichir/durcir piscine et aqua
tabata), puis chantier 4 (IA conversationnelle, en dernier). Méthode inchangée :
inventaire → propositions → validation → modification.

---

## 3. LIVRAISON 1.6.1 — correctifs visuels du 03/10/2026 (faits, vérifiés)

Trois défauts signalés sur v1.6.0-coachs, corrigés **sans toucher aucun chiffre ni
aucun GIF validé** (commit `617b8e4`, tag `v1.6.1-coachs`) :
1. **« Ma bibliothèque »** : les 74 dernières illustrations anatomiques remplacées par
   des GIF humains du corpus livré (même muscle + même pattern ; bloc
   « Rattrapage 03/10/2026 » dans `src/data/gif-overrides.js`, générateur
   `scripts/gen-remap-biblio.mjs`). Contrôle : 0 visuel anatomique restant (test
   verrou), planches de contrôle à l'œil OK.
2. **« Repos » piscine/aqua** : `stepGifByPattern(pattern, profil, pool)` — en contexte
   bassin le repli montre une récupération DANS l'eau (`pool-recup-tabata`), plus
   l'homme aux abdominaux au sol de la salle (`54a3ca1547a3a613` reste réservé au
   contexte hors bassin, tel que validé en 1.6.0).
3. **Crawl « Nage douce »** : l'ancienne paire (`3d44d275ca25d146` / `3d2c2e5b9e90f3b7`)
   alternait une image horizontale et une image où la personne se redresse à la
   verticale (« personne à l'envers ») → paire du corpus à deux images horizontales
   (femme `a9b2430d317e3bba`, homme `f5754e3553d3922c`), vérifiée à l'œil.
Tests : **119, 117 passent, 0 échec** (3 verrous ajoutés dans `gif-coverage.test.js`).

**Livraison** : build android `run 37098280556` SUCCESS ; release `v1.6.1-coachs`
(asset `yanis-fitness-evolution-1.6.1.apk`, 87 785 244 o). Miroir dans le dépôt :
`downloads/Yanis-Fitness-Evolution-1.6.1-coachs.apk` (defaults de `mirror-apk.yml`
passés en 1.6.1 ; le push du fichier déclenche le miroir). Lien cliquable à donner :
`https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/01a0fdbd-jarvis-fitness-yanis-emilie-ap/downloads/Yanis-Fitness-Evolution-1.6.1-coachs.apk`

**Pièges sandbox re-vécus le 03/10** : réinitialisation du disque (HEAD revenu à
`ddd1fb9`, node_modules effacés) → `git fetch origin arena/01a0fdbd-…` +
`git reset --hard FETCH_HEAD`, `npm ci`, `pip install --break-system-packages pillow`.
Le CDN des assets de release (`*.githubusercontent.com`) est **inaccessible depuis le
sandbox** (curl/gh EOF) : ne JAMAIS tenter de télécharger l'APK ici — c'est le workflow
`mirror-apk.yml` (côté GitHub) qui copie l'APK dans `downloads/`, puis `git pull`.

**État** : 1.6.1 livré. Prochaine action : chantier 2 (METCON piscine + METCON aqua
tabata pour Émilie), puis chantier 3, puis chantier 4.

**Chantier 2 — proposition soumise, EN ATTENTE DE VALIDATION utilisateur** (question
posée deux fois, non tranchée) :
- Deux nouveaux protocoles pour Émilie, 100 % vocabulaire de mouvements existants :
  1. **METCON piscine** : 3 niveaux ~18/22/27 min, blocs nage courte alternés avec
     renfo au bord à repos courts (fractionné 45 s → pompes au bord 30 s → sprint
     20 s → gainage vertical 30 s…), échauffement/retour au calme dans l'eau.
  2. **METCON aqua tabata** : 3 niveaux ~20/25/30 min, tabata 20/10 dont les
     mouvements CHANGENT à chaque round (l'aqua tabata actuel répète le même round).
- Intégration sans rien retirer : section « METCON Émilie » sur la page Piscine
  (ProtocolModal existant) + extension du choix par jour cardio (`cardioChoices` :
  « metcon-piscine », « metcon-aquatabata ») + garde récupération < 45 → METCON
  bloqué. Rien n'est imposé par défaut (prescription d'origine intacte).
- Plan technique : nouveau fichier `src/data/metcon-emilie.js` (entrées au format
  `POOL_PROTOS`), ajout dans `POOL_PROTOCOLS` de `library.js`, `sourcePool` lit la
  liste combinée, tests `gif-coverage` étendus aux nouvelles étapes.
- Variante possible si l'utilisateur le demande : proposition automatique du coach
  1×/sem selon récupération, remplaçable par elle.
