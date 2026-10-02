# PASSATION — JARVIS Fitness (Yanis & Émilie) — état au 02/10/2026

Bloc à coller **avant toute action** dans un nouveau chat. Dépôt :
`Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Branche de travail :
`arena/01a0fd17-jarvis-fitness-yanis-emilie-ap` (les branches `arena/*` des chats
précédents existent aussi ; elles se récupèrent par SHA).

---

## 1. CONSIGNE À NE PAS NÉGOCIER

1. **Priorité absolue : NETTETÉ et QUALITÉ.** Partir des PNG natifs, retoucher en
   résolution native, **puis** exporter. Jamais recolorié un GIF pixelisé, jamais agrandi
   un GIF.
2. « **Le vert doit bien couvrir la peau, pas dépassé.** » Trois mesures dans chaque
   CONTROLES.json : `couverture_peau`, `debordement_vert`, et la décomposition du manque
   (`manque_peau` / `manque_vert_pale` / `manque_autre`).
3. **Lots de 4 numéros.** Ne jamais toucher à un numéro déjà validé. **Ne jamais
   remplacer un GIF livré sans accord explicite**, numéro par numéro.
4. **APK d'origine, prescriptions, gestes et prises validés : intouchables.**
5. **DRAPEAU ROUGE** dès que la limite de session approche : recopier consigne +
   passation, ne pas partir sans.
6. **L'œil de l'utilisateur tranche**, jamais les chiffres seuls. Le tri automatique
   muscle/décor a échoué (pièges 1/9/10 = feuillage, 292/313 = eau du bassin).
7. Un visuel retouché n'entre dans l'application **qu'après validation à l'œil**.

## 2. ÉTAT CHIFFRÉ (vérifié)

- **209 exercices sur 209 ont un visuel humain animé** (95 avant le 02/10/2026).
- **134 visuels intégrés** ce jour : 38 issus des retouches validées (lots 1 à 21,
  prototype n°44, série « femme » au vert corrigé), 96 issus du corpus des GIF livrés.
- **10 guides piscine** passent de l'illustration statique au visuel animé :
  Ciseaux au bord, Marche aquatique, Aqua-jogging, Battements au bord, Déplacements
  latéraux, Nage douce, Gainage vertical, Sprint (n°292), Retour au calme (n°313),
  Talons-fesses.
- **67 numéros retouchés n'ont pas d'emplacement** dans l'app : ce sont des variantes du
  catalogue des 389 absentes de la bibliothèque (à écarter ou à reprendre plus tard).
- Magasin média de l'app = **par empreinte** (`sha256(contenu)[:16].gif`) + vignettes
  `thumbs/<même nom>.webp`. media-index.json est régénéré au build.
- 96 tests : **94 passent, 0 échec, 2 ignorés**. APK : archive saine, signature v2
  (certificat du keystore du dépôt, empreinte `168df81a…`).

## 3. LES 4 CHANTIERS DEMANDÉS LE 02/10/2026 (à mener dans ce nouvel ordre)

1. **Coachs** : les rendre les plus performants et réalistes possible dans
   l'accompagnement ; consignes et suivis cohérents, qui s'adaptent aux retours et aux
   résultats réels de l'utilisateur.
2. **Émilie** : ajouter **metcon piscine** et **metcon aqua tabata** en plus de ce
   qu'elle a déjà.
3. **Séances piscine / aqua** : trop faciles et pas assez diversifiées — enrichir et
   durcir (nouvelles structures, intervalles, variantes).
4. **IA conversationnelle** : la plus performante possible. À traiter en **dernier**.

## 4. MÉTHODE ET OUTILLAGE (éprouvés)

- Outils : `evolution/media/tools/` (`retouche-*.py`, `page-lot.py`, `nouveau-lot.py`,
  `enregistrer-validation.py`, `planche-tri.py`, `priorite-sources.py`).
- Le corpus des **389 visuels livrés** est dans
  `evolution/media/refonte-photo/gif/{homme,femme}/<slug>-<profil>.gif`
  (branches d'archive, par ex. `c6852983` = 430 fichiers, 82 Mo).
- Les retouches validées sont dans
  `evolution/media/refonte-photo/hd-2026-09-30/lotN/exports/` (WebP 660 q90 + GIF de
  repli 660) et `.../sans-source/vert/exports/` (GIF taille native).
- Chaque lot a son PV `hd-2026-09-30/VALIDATION-LOTn-<date>.json` (sha256 des fichiers,
  mesures, particularités).
- **Piège** : le sandbox se réinitialise ; un `git fetch` **par SHA** est permis, puis
  `git reset --hard FETCH_HEAD` pour retrouver l'état. Ne pas refaire `git add -A` après
  une purge (le venv `.cache/pyvenv` a déjà été committé une fois).

## 5. CHAÎNE DE LIVRAISON (téléchargement)

1. Build APK : pousser un tag `v*` → le workflow `android-release.yml` construit l'APK
   signé et publie la release (≈ 3 min).
2. Copie téléchargeable : workflow `mirror-apk.yml` → `downloads/` dans le dépôt
   (`github.com/.../raw/<branche>/downloads/<fichier>.apk`) — c'est le lien qui fonctionne
   sur le téléphone (les hôtes `*.githubusercontent.com` sont filtrés par certains
   réseaux).
3. `pages-apk.yml` existe pour un lien `github.io`, mais **GitHub Pages doit être activé
   une fois à la main** (Settings → Pages → Source : GitHub Actions) ; l'agent n'a pas le
   droit de l'activer.
4. Le téléchargement depuis le chat doit être un **lien brut dans le message** (copier-
   coller dans Chrome), pas un clic dans l'aperçu.

## 6. PROCHAINE ACTION CONCRÈTE

Commencer par le **chantier 1 (coachs)** : inventorier les consignes et suivis actuels
(`src/engine/coach.js`, `team-review.js`, `voice-coach.js`, `planner.js`), lister ce qui
est générique ou incohérent, puis proposer des règles qui réagissent aux retours et
résultats (RPE, séances manquées, progression 1RM, cardio, douleurs). Ne rien changer
dans l'app sans validation. Ensuite seulement : chantier 2 (metcon piscine + aqua tabata
pour Émilie), chantier 3 (diversification piscine/aqua), chantier 4 (IA conversationnelle).
