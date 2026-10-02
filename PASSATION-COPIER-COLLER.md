# 📋 PASSATION — bloc à coller dans le nouveau chat

> **Mode d'emploi.** Copier tout le bloc ci-dessous (de « CONSIGNE ET PASSATION » jusqu'à la
> fin) et le coller comme premier message du nouveau chat. Il contient la consigne, l'état
> chiffré, la suite, les pièges et la procédure de purge. Rien d'autre n'est nécessaire
> pour reprendre.

---

## CONSIGNE ET PASSATION — JARVIS Fitness (Yanis & Émilie)

Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`
Branche : `arena/01a0fc53-jarvis-fitness-yanis-emilie-ap`
À lire en entrant, dans l'ordre : `PASSATION-COPIER-COLLER.md` (racine) puis
`evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md`.
Arrêté le **02/10/2026** — dernier commit **`391442e`**.

### 1. ÉTAT CHIFFRÉ (vérifié, s'y fier)

- **21 lots validés = 86 numéros + le prototype n°44 = 87 visuels refaits.**
- Aucun numéro en attente. Tous les PV existent :
  `hd-2026-09-30/VALIDATION-LOT1 à LOT21-2026-10-02.json` (sha256 + mesures).
- Répartition du programme (355 numéros ont une source PNG native) :
  - **78** « RETENUE » → **TOUS traités**
  - **8** choisis à la main → lots 1 et 2 (11, 12, 19, 30, 42, 45, 48, 85)
  - **252** « A REGARDER » → jamais triés : c'est le gisement suivant
  - **22** « ECARTER » · **3** « source inexploitable »
- **34 numéros « femme » sans aucune source native** → voir chantier 2 ci-dessous.
- **0 pixel modifié hors zone** sur toutes les phases. Aucun GIF livré remplacé.
  APK intact. Rien d'intégré dans l'app.

### 2. LA CONSIGNE (règles, à ne pas négocier)

1. **PRIORITÉ ABSOLUE : NETTETÉ et QUALITÉ.** Partir des PNG natifs, retoucher en résolution
   native, **PUIS** exporter. Jamais recolourier un GIF pixelisé, jamais agrandir un GIF.
2. **« Le vert doit bien couvrir la peau, pas dépassé. »** Mesuré par trois chiffres dans
   chaque `CONTROLES.json` : `couverture_peau`, `debordement_vert`, et la décomposition du
   manque (`manque_peau / manque_vert_pale / manque_autre`).
3. **Lots de 4 numéros.** Ne JAMAIS toucher à un numéro déjà validé. Ne JAMAIS remplacer un
   GIF livré sans accord explicite, numéro par numéro.
4. **APK, prescriptions, gestes et prises validés : intouchables.**
5. **Dès que la limite de session approche : DRAPEAU ROUGE**, avec consigne et passation
   recopiées. Ne pas partir sans.
6. **Je n'ai PAS de vision dans cette session.** Le tri muscle/décor automatique a échoué
   (IoU, teinte, peau en anneau, position : les pièges 1/9/10 recouvrent les bons numéros).
   **C'est l'œil de l'utilisateur qui tranche, jamais mes chiffres seuls.**

### 3. LA MÉTHODE EN BREF

- **Référence n°260 : saturation 0,914 — teinte 86,3°.**
- Seuils d'alerte : contour > 8 px · saturation < 0,87 ou > 0,96 · zone > 9 000 px ·
  teinte à plus de 5° de 86,3° · tout pixel modifié hors zone.
- Outils : `evolution/media/tools/`
  `nouveau-lot.py` → fabrique `retouche-lotN` depuis le MODÈLE `retouche-lot4` ·
  `retouche-lotN` → `exports/` `planches/` `CONTROLES.json` ·
  `page-lot.py` → `valider.html` · `page-sommaire.py` → `sommaire.html` ·
  `enregistrer-validation.py` → le PV · `servir-validation.py` → prévisualisation
- Trois régimes de vert : (a) pâle à remonter, (b) déjà bon = gain de netteté pure,
  (c) SUR-saturé à faire DESCENDRE (0,96-1,00 → 0,92). Le cas (c) rend le vert moins intense
  qu'avant : **le signaler**, c'est un choix d'œil.
- Un lot peut ne contenir **aucune** nouvelle image : les numéros d'un même groupe (même
  planche + mêmes fenêtres) sortent identiques à l'octet près. **Le dire** au lieu de faire
  revalider la même image.

### 4. RÉGLAGES PAR NUMÉRO — modèle `retouche-lot4-vert260.py`

Ne pas y toucher sans raison : chacun répond à une demande précise.

- `ETENDRE_VERT = False` → on reste sur le **COEUR VERT FRANC**, pas le halo
- `COUVRIR_PEAU = {1, 66, 297}` → couvrir aussi la peau que le GIF livré peignait
- `GAMMA_VALEUR = {124: [0.55, 1.0]}` → vert presque noir, éclairci phase 1 seule
- `370 / 371 / 372` → gardés malgré un agrandissement ×1,73 (source 688×381 < GIF 794×440) :
  **JAMAIS** présentés comme un gain de netteté.

### 5. LA SUITE, DANS L'ORDRE DÉCIDÉ PAR L'UTILISATEUR

| # | Chantier | État |
|---|---|---|
| 1 | Cardio et piscine des deux profils (réglages, pas des visuels) | ✅ **FAIT** |
| 2 | Les 34 visuels « femme » sans source native | 🟡 **VERT SEUL FAIT — en attente de validation** |
| 3 | Le build de l'application | ⬜ à venir |
| 4 | L'IA conversationnelle | ⬜ en dernier |
| 5 | AVANT le build : confirmer metcon + piscine fractionnée + Aqua Tabata | ✅ **DÉCIDÉ** |
| 6 | Gisement en réserve : les 252 numéros « A REGARDER » jamais triés | ⬜ réserve |

**Prochaine action concrète** : valider les 10 corrections de vert
(`sans-source/vert/VERT-SEUL-34-FEMME.pdf`), numéro par numéro, puis passer au build.

### 6. CHANTIER 1 — Cardio & piscine des deux profils : FAIT

Outil : `evolution/reglages/comparer-cardio-piscine.mjs` (importe le **vrai** moteur
`src/engine/source-schedule.js`) → `rapport-cardio-piscine.json` → `page-reglages.py` →
`cardio-piscine.html`. Contrôle ciblé : `verifier-seuil.mjs`.

| Mesure | Résultat |
|---|---|
| Jours comparés (18 scénarios × 52 semaines) | **6 552** |
| Écarts de placement du cardio / de la piscine | **0** |
| Écarts de durée ou de zone (Émilie) | **0** |
| Écarts d'auto-régulation (après correction) | **0** |

**Un seul défaut, corrigé** : le seuil « 3 séances dures / 7 jours » de Yanis ne comptait que
les types `hiit`/`aqua` (+ `rpe >= 8`). Après 3 METCON « HIIT + Swim Sprint » : la source
comptait 6 séances dures (bascule modéré), l'app en comptait 0 (restait intense).
Corrigé par `sourceProtoName()` et `sourceHardSession()`, qui rejouent les expressions de
`elite-coachExtra.js`. L'ajout « RPE ≥ 8 » est **retiré** (retour strict à la source décidé).
96 tests passent, build OK. **Seul fichier de l'app modifié : `src/engine/source-schedule.js`.**

**Décisions utilisateur du 02/10/2026** : seuil corrigé · matériel laissé **fidèle à la
source** chez Yanis (cases Piscine/Elliptique sans effet, comme dans le fichier source) ·
**piscine fractionnée gardée** (ajout assumé : « Nage en longueurs » apparaît 0 fois dans les
sources) · **Aqua Tabata confirmé tel quel** (ce n'est pas un ajout : il vient de la source).

### 7. CHANTIER 2 — Les 34 visuels femme : VERT SEUL, PAS D'AGRANDISSEMENT

**Décision utilisateur : « N'agrandit pas. Laisse comme c'est. Juste la couleur verte à
améliorer. »** Les 3 variantes d'agrandissement (A Lanczos, B sur-échantillonnage,
C anti-bruit) et la voie « création d'un PNG » sont **abandonnées**.

Outil : `evolution/media/tools/retouche-vert-seul.py`. PDF : `pdf-vert-seul.py`.
Sorties : `hd-2026-09-30/sans-source/vert/` (`avant/`, `exports/`, `planches/`,
`CONTROLES.json`, `valider.html`, `VERT-SEUL-34-FEMME.pdf`).

| | |
|---|---|
| 34 numéros | **14 fichiers uniques** (plusieurs partagent le même GIF à l'octet près) |
| Sans vert du tout | **6 numéros** : 289, 290, 291, 298, 305, 316 |
| Images traitées | **10** (28 numéros) |
| Taille des exports | **identique à la source**, 2 images de 500 ms |
| Pixels modifiés hors zone | **0** |
| Saturation | remontée vers **0,918** (référence 260 = 0,914) |

**Deux corrections de méthode, établies en refaisant le calcul :**
- La référence 260 se mesure en **MÉDIANE**, pas en moyenne : à seuil 0,12 on retrouve
  exactement 0,914 et 86,1° (la moyenne donne 0,691).
- Le débordement se mesure contre le **halo** (score > 0,02), pas contre le seul cœur vert
  franc : **0,00 partout** au lieu de 0,45 à 0,69.

**Piège signalé — l'eau prise pour le muscle** (5 images sur 10, à trancher à l'œil) :

| n° | teinte avant | |
|---|---|---|
| **313** | 164,7° | cyan — **le seul dont la saturation baisse** (0,840 → 0,764) |
| **292** | 147,5° | probablement l'eau du bassin |
| 210, 246 | 124,9° | tire vers le cyan |
| 274, 275, 276 | 125,0° | tire vers le cyan |
| 326 | 122,5° | tire vers le cyan |

Franches : 224/225/257/304/306/307/308 (80,0°) · 233/234/324/329 (96,2°) ·
237/255/256 (83,1°) · 252/253 (87,0°) · 258/259/314/315 (100,3°).

### 8. PIÈGES DÉJÀ RENCONTRÉS — ne pas les refaire

- **Ne JAMAIS rejouer un outil sur un lot déjà validé** : une régression du lot 4 a écrasé
  6 fichiers approuvés. Si c'est nécessaire, restaurer juste après avec
  `git checkout HEAD -- <fichiers>` et vérifier par `git status`.
- **Le vert du GIF livré peut ne pas exister dans la source native** (n°1, 9, 10 : feuillage
  du décor). Étendre le piège à l'eau du bassin pour les séries piscine (n°292, 313).
- **Les GIF de l'app ne sont pas les fichiers des branches d'archive** : `public/media` est un
  magasin **par empreinte** (94 GIF uniques pour 389 numéros). Toujours vérifier
  `git show <branche>:<chemin>` avant de comparer.
- **`git fetch` ne peut pas récupérer ces branches par leur nom**, mais **par SHA oui** :
  `git fetch origin <sha>:refs/remotes/base/<nom>`.
- **Ne pas confondre moyenne et médiane** sur la saturation : la référence 260 est une médiane.

### 9. DEUX CHANTIERS TECHNIQUES OUVERTS

- `page-lot.py` n'affiche NI `couverture_peau` NI `debordement_vert` dans `valider.html` :
  il faut lire `CONTROLES.json`. **À brancher.**
- Le n°35 n'a qu'une seule phase au lieu de deux (erreur d'alignement 14,97/255, la plus
  forte du programme). Accepté tel quel, mais **à comprendre**.

### 10. APRÈS UNE PURGE DU SANDBOX (vérifié 18 fois)

La purge remet l'arbre sur `ddd1fb9` et efface `.cache/`, les refs `base/*` et le serveur.

```bash
git fetch origin arena/01a0fc53-jarvis-fitness-yanis-emilie-ap
git log --oneline -2
git show --name-only --oneline HEAD | grep -v '\.cache/pyvenv'
#   ne rend QUE l'en-tête  → aucun travail réel → git reset --hard FETCH_HEAD
#   sinon                  → git merge --ff-only FETCH_HEAD
python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install -q \
        pillow numpy opencv-contrib-python-headless reportlab
git fetch --depth=1 origin c685298378773817460fb358bc605af7ce154b8b:refs/remotes/base/lots-complets
```

**Enchaîner venv + fetch + travail dans la MÊME commande** : le venv est purgé en 1 à 2
minutes. Un `.gitignore` couvre `.cache/`, `tri/` et `__pycache__/`.

### 11. ÉTAT DES DÉCISIONS EN ATTENTE

- ⏳ **Valider les 10 corrections de vert** (chantier 2), numéro par numéro.
- ⏳ Avant le build : rien d'autre à confirmer — les décisions metcon / piscine fractionnée /
  Aqua Tabata ont déjà été prises le 02/10/2026 (§6).

---

*Fin du bloc à coller. Dernière mise à jour : 02/10/2026, commit `391442e`.*
