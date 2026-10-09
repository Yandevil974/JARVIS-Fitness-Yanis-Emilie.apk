# Intégration progressive des GIFs HOMME — mapping exercice → GIF → deux profils

**Statut : DOCUMENT DE PRÉPARATION — 9 octobre 2026.** Aucune modification du code
applicatif, de `public/media/`, de `release/` ou des APK n'a été faite dans ce document.
L'intégration effective est soumise à **validation explicite de l'utilisateur** avant
toute intervention. La production des GIFs HOMME continue en parallèle : elle ne touche
ni au code ni aux médias applicatifs.

## 1. Décision et périmètre

- Priorité utilisateur (REPRISE-JARVIS.md §1) : **un GIF HOMME par exercice**, commun à
  **Yanis (profil `elite`) et Émilie (profil `emilie`)** pour ce même exercice.
- Le partage est autorisé **entre les deux profils pour le même exercice**, jamais entre
  deux exercices distincts. Ne pas dupliquer artificiellement les fichiers ou les compteurs.
- Programmes, charges, objectifs et réglages de Yanis et Émilie restent **distincts** :
  mutualiser le visuel ne fusionne pas les entraînements.
- Versions FEMME : **reportées**, et toutes les livraisons FEMME existantes sont
  **conservées** (ni suppression ni régénération).

## 2. Audit de couverture — méthode et chiffres

Méthode (reproductible : `python3 scripts/audit-couverture-homme.py` depuis
`yanis-fitness-evolution/`) : un exercice est **couvert** s'il existe un GIF HOMME livré
(`animations/**/<exercice>-3poses.gif`, hors `femme/`, hors POC) correspondant à son
identifiant inventaire, avec poses A/M/B contrôlées (RMSE ≥ 0,030, MD5 distincts,
identité 1:1). Le matching app reproduit `norm()`/`slug()` de `src/engine/utils.js` et le
routage de `src/data/library.js`. Les POC et réserves sont **séparés** du comptage.

Résultats au 9 octobre 2026 :

| Élément | Valeur |
|---|---|
| GIFs HOMME livrés (individuels, hors `femme/`) | **40** |
| — dont exercices de l'inventaire | **37** |
| — dont étapes chrono échauffement (`GIF_STEPS`) | **3** (`warmup-approche`, `warmup-mobilite`, `warmup-route`) |
| Exercices app (bibliothèque) | 209 |
| **Exercices inventaire couverts par un GIF HOMME validé** | **37 / 209 (17,7 %)** |
| Exercices sans GIF HOMME | 172 |
| POC séparé | `back-squat` (portrait 480×860, disques coupés, 3ᵉ pose debout — **réserve conservée**, ne pas remplacer sans accord explicite) |
| Compteur historique H+F (ne pas confondre) | 77/614 — périmètre double ancien ; **ne pas le convertir en couverture HOMME** |

Réserves à séparer de la couverture : POC `back-squat` (ci-dessus) ; presse B-02F mi-course
(FEMME, conservée, amplitude moins franche) ; circuits HOMME LOT 3 en réserve.

## 3. Mapping exercice → GIF HOMME → deux profils

Routage app constaté (lecture seule) : `exercise.gif = GIF_OVERRIDES[norm(name)] ||
guide.img` (`src/data/library.js`) est **indépendant du profil** — un même GIF d'exercice
sert automatiquement **les deux profils**. `stepGif()` (étapes chrono, `GIF_STEPS`) reste
profil-spécifique (homme/femme) et n'est **pas** modifié dans cette phase. La démonstration
résolue par `demonstrationFor()` (`src/engine/demo-match.js`) suit ce `gif` (niveaux exact
→ variante → famille).

| GIF HOMME livré | id inventaire | Nom app | Override actuel | sha16 (pipeline) |
|---|---|---|---|---|
| lot1/bird-dog-3poses.gif | bird-dog | Bird dog | /media/bcdbe16aeafaafec.gif | 5dfeaab0767c5ca6 |
| lot1/dead-bug-3poses.gif | dead-bug | Dead bug | /media/bcdbe16aeafaafec.gif | 41735d061367b022 |
| lot1/gainage-lateral-3poses.gif | gainage-lateral | Gainage latéral | /media/bcdbe16aeafaafec.gif | 0c732d19d52bacd8 |
| lot2/dead-bug-rotation-3poses.gif | dead-bug-avec-rotation | Dead bug avec rotation | /media/bcdbe16aeafaafec.gif | 35f4d4a0bde51dbb |
| lot2/gainage-lateral-dyn-3poses.gif | gainage-lateral-dynamique | Gainage latéral dynamique | /media/bcdbe16aeafaafec.gif | bbaf5fe228056ef2 |
| lot2/mountain-climbers-3poses.gif | mountain-climbers | Mountain climbers | /media/bcdbe16aeafaafec.gif | 1cca4ba138339384 |
| lot3/circuit-abdos-3poses.gif | circuit-abdominaux-crunch-releves-gainage | Circuit abdominaux (crunch + relevés + gainage) | /media/bcdbe16aeafaafec.gif | b230036a9e14adf7 |
| lot3/circuit-gainage-3poses.gif | circuit-gainage-planche-lateral-bird-dog | Circuit gainage (planche + latéral + bird dog) | /media/bcdbe16aeafaafec.gif | ff9d5572f7ab2a8e |
| lot4/developpe-halteres-decline-neutre-3poses.gif | developpe-halteres-decline-prise-neutre | Développé haltères décliné, prise neutre | /media/8de6e89e5395700c.gif | a2aac7faf6086dca |
| lot4/developpe-halteres-plat-3poses.gif | developpe-halteres-plat | Développé haltères plat | /media/8de6e89e5395700c.gif | 995a40ea2baa4715 |
| lot4/developpe-halteres-plat-neutre-3poses.gif | developpe-halteres-plat-prise-neutre | Développé haltères plat, prise neutre | /media/8de6e89e5395700c.gif | 25e8e59786cb8f3a |
| lot5/developpe-halteres-incline-30-3poses.gif | developpe-halteres-incline-30 | Développé haltères incliné 30° | /media/8de6e89e5395700c.gif | 3e7a189eeb6022ac |
| lot5/developpe-halteres-incline-45-3poses.gif | developpe-halteres-incline-45 | Développé haltères incliné 45° | /media/8de6e89e5395700c.gif | d4be85a729ef534f |
| lot5/developpe-halteres-incline-45-prise-neutre-3poses.gif | developpe-halteres-incline-45-prise-neutre | Développé haltères incliné 45°, prise neutre | /media/8de6e89e5395700c.gif | c4e8385facb4cc71 |
| themeA/abduction-assise-machine-ou-elastique-3poses.gif | abduction-assise-machine-ou-elastique | Abduction assise (machine ou élastique) | /media/71105357b5f1b5a1.gif | a954b981a2f54d78 |
| themeA/abduction-hanche-elastique-3poses.gif | abduction-hanche-a-l-elastique | Abduction hanche à l'élastique | /media/71105357b5f1b5a1.gif | a8f48a98c30f15f5 |
| themeA/clamshell-elastique-3poses.gif | clamshell-a-l-elastique | Clamshell à l'élastique | /media/491a14439fa13d26.gif | 014563600de45a53 |
| themeA/face-pull-a-l-elastique-3poses.gif | face-pull-a-l-elastique | Face pull à l'élastique | /media/da0df09961077306.gif | 2bb7c8c4c0412b1d |
| themeA/fentes-arriere-pdc-3poses.gif | fentes-arriere-au-poids-du-corps | Fentes arrière au poids du corps | /media/5e4cdda12471b2b3.gif | 6c0dfcfe4f714ece |
| themeA/fire-hydrant-elastique-3poses.gif | fire-hydrant-a-l-elastique | Fire hydrant à l'élastique | /media/bad374a6afbb744e.gif | 8160895e29d94a37 |
| themeA/gainage-planche-3poses.gif | gainage-planche | Gainage planche | /media/0703d5049735ed62.gif | 653802d65a31b55e |
| themeA/hip-thrust-unilateral-1-jambe-3poses.gif | hip-thrust-unilateral-1-jambe | Hip thrust unilatéral (1 jambe) | /media/cd5a8b464328c8b9.gif | ad88fab800ad7f1c |
| themeA/mobilite-des-epaules-3poses.gif | mobilite-des-epaules | Mobilité des épaules | /media/6e8ef0c7fab7dba8.gif | 496f6cb98871e619 |
| themeA/pallof-press-a-l-elastique-3poses.gif | pallof-press-a-l-elastique | Pallof press à l'élastique | /media/7de6cc31c5c5301e.gif | 1032b1bcfcf76401 |
| themeA/pompes-3poses.gif | pompes | Pompes | /media/7e96ab14f783b338.gif | 77f750580fcfada5 |
| themeA/pont-fessier-activation-3poses.gif | pont-fessier-au-sol-activation | Pont fessier au sol — activation | /media/666443484c7f0861.gif | a8349341f0070c2b |
| themeA/respiration-diaphragmatique-3poses.gif | respiration-diaphragmatique | Respiration diaphragmatique | /media/114a727b696375ef.gif | 88b4b38fc22d6f0c |
| themeA/squat-poids-du-corps-3poses.gif | squat-au-poids-du-corps | Squat au poids du corps | /media/3a18659a669ab642.gif | f605e2ceaa6cb8fc |
| themeA/warmup-approche-3poses.gif | — | — étape chrono `GIF_STEPS: warmup-approche` (homme) | — (déjà routé) | a682b8ecb52830ac |
| themeA/warmup-mobilite-3poses.gif | — | — étape chrono `GIF_STEPS: warmup-mobilite` (homme) | — (déjà routé) | 13b9b8af559284b8 |
| themeA/warmup-route-3poses.gif | — | — étape chrono `GIF_STEPS: warmup-route` (homme) | — (déjà routé) | 815556695140e1d5 |
| themeB/back-squat-charge-moderee-3poses.gif | back-squat-charge-moderee | Back squat (charge modérée) | /media/d7f9e6b6ba8a231b.gif | 77777e244c5dccec |
| themeB/bulgarian-split-squat-3poses.gif | bulgarian-split-squat | Bulgarian split squat | /media/dc3d5e6a21656655.gif | 651d4dd2161e0f73 |
| themeB/bulgarian-split-squat-halteres-3poses.gif | bulgarian-split-squat-halteres | Bulgarian split squat haltères | /media/baf2d8590660fc97.gif | c8f159c3c61a11f3 |
| themeB/goblet-squat-3poses.gif | goblet-squat | Goblet squat | /media/d7f9e6b6ba8a231b.gif | 10223b8769a21490 |
| themeB/leg-extension-3poses.gif | leg-extension | Leg extension | /media/26f2b337d32111ac.gif | f857168a1c43527b |
| themeB/leg-press-3poses.gif | leg-press | Leg press | /media/a4443a1008f6202b.gif | 922884c5ca5c2683 |
| themeB/presse-a-cuisses-pieds-hauts-3poses.gif | presse-a-cuisses-pieds-hauts | Presse à cuisses pieds hauts | /media/27c43e424dc2ea1a.gif | bbfc72dcc7f4f1ee |
| themeB/squat-cycliste-squat-complet-3poses.gif | squat-cycliste-squat-complet | Squat cycliste (squat complet) | /media/fdcc2d01cb5a53d1.gif | 1155ecf8049db516 |
| themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif | step-up-sur-banc-hauteur-du-genou | Step-up sur banc (hauteur du genou) | /media/b74c8ef81f7c0bda.gif | ae815ad9e156bcc9 |
| `poc/back-squat.gif` | `back-squat` | Back squat | POC — conservé avec réserves, non remplacé | — |

Notes de lecture du tableau :

- **Profils servis** : pour chaque exercice, le GIF HOMME livré servira **Yanis + Émilie**
  (démo d'exercice partagée). La colonne « sources » de l'audit (présence dans le
  programme `elite` et/ou `emilie` de `legacy.json`) n'affecte pas ce routage.
- **sha16** : 16 premiers caractères hex du SHA-256 du fichier — convention de nommage du
  corpus `public/media/` (vérifiée sur `26f2b337d32111ac.gif`).
- Les 3 GIFs `warmup-*` sont des visuels d'étapes de chrono déjà routés (`GIF_STEPS`,
  entrées `homme` seules aujourd'hui ; repli `homme` pour Émilie). Leur remplacement est
  une **vague ultérieure** (les étapes restent fonctionnelles avec le corpus actuel).
- Le POC `back-squat` est listé pour mémoire : **non remplacé** sans accord explicite.

## 4. Inventaire des manquants (file de production)

Objectif des 10 nouveaux GIFs : **3/10 livrés** (squat cycliste H `069dd4f`, leg press H
`fa9d52a`, leg extension H `945908f`). Restants, HOMME uniquement :

| Lot | Exercices HOMME restants |
|---|---|
| B-04 | `front-squat` (**en cours** : pose A validée et conservée, M/B rejetées — amplitude insuffisante — à reprendre depuis A), `fentes-bulgares-halteres-pied-avant-sureleve` |
| B-05 | `step-up-haut`, `back-squat-barre-haute`, `hack-squat` |
| B-06, début | `back-squat-inertie-pause-complete`, `fentes-barre` |

Puis poursuite des thèmes B (reste), C, D, E selon `PLAN-THEMES.md` (172 exercices sans
GIF HOMME à ce jour, hors étapes chrono).

## 5. Plan d'intégration progressive

### Vague 1 (proposée, testable) — 3 exercices

`leg-extension` (`945908f`, sha16 `f857168a1c43527b`), `leg-press` (`fa9d52a`, sha16
`922884c5ca5c2683`), `squat-cycliste-squat-complet` (`069dd4f`, sha16 `1155ecf8049db516`).

Pipeline par exercice :

1. Copier le GIF validé dans `public/media/<sha16>.gif` (nom = 16 premiers hex du SHA-256).
2. Mettre à jour `src/data/gif-overrides.js` : clé = `norm(nom exercice)` (ex. `"leg
   extension"`), valeur = `/media/<sha16>.gif`. Remplace l'ancien override corpus pour
   cet exercice.
3. **Aucun** changement dans `EXPLICIT_MATCHES` (`demo-match.js`), `GIF_STEPS`
   (`visuals-gifs.js`) ni `stepGif` : les étapes chrono restent sur le corpus actuel.
4. Build + tests de lecture des médias :
   - `node scripts/audit-gifs.mjs` — chaque exercice a un humain animé ;
   - `node scripts/audit-statiques.mjs` — aucun visuel statique en chrono ;
   - `node --test tests/gif-coverage.test.js` — non-régression couverture GIF + existence
     des fichiers référencés dans `public/media` ;
   - lecture manuelle sur **les deux profils** (`elite` = Yanis, `emilie` = Émilie) de la
     fiche exercice (GIF animé, boucle A/M/B/M lisible).
5. Validation visuelle utilisateur sur les deux profils, puis élargissement.

### Vagues suivantes

- **Vague 2** : B-01/B-02 quadriceps (8 exercices : `goblet-squat`,
  `bulgarian-split-squat`, `bulgarian-split-squat-halteres`,
  `step-up-sur-banc-hauteur-du-genou`, `back-squat-charge-moderee`,
  `presse-a-cuisses-pieds-hauts` + 2 en réserve de contrôle).
- **Vague 3** : lots 1–5 + thème A restant (développés haltères, échauffement, activation).
- **Vague 4+** : `warmup-*` (étapes chrono, remplacements homme puis femme), puis poursuite
  de la production (thèmes B reste, C, D, E) avec intégration par lots de 3 validés.

### Garde-fous

- **Ne pas supprimer** les anciens fichiers `/media/` : le corpus reste en place pour les
  exercices non encore couverts.
- **Ne pas remplacer** le POC `back-squat` sans accord explicite.
- **Un exercice = un GIF spécifique** : ne pas partager un GIF entre deux exercices
  distincts, ne pas dupliquer les fichiers.
- Les GIFs FEMME livrés restent en place ; les versions FEMME des exercices restent
  **reportées** (leur intégration éventuelle est une décision ultérieure, après production).
- Anti-doublon : sha16 et MD5 distincts vérifiés à la livraison de chaque GIF.
- Ne pas annoncer d'APK prête sans **build et tests réels sur les deux profils**.

## 6. Points de vigilance (placeholders partagés à séparer)

- `/media/d7f9e6b6ba8a231b.gif` sert à la fois `back-squat-charge-moderee`, `goblet-squat`,
  `front-squat` et `hack-squat` (approximation corpus) — les vagues 1–2 et la production
  sépareront ces partages.
- `/media/8de6e89e5395700c.gif` sert les 5 développés haltères (lots 4–5) — vague 3.
- `/media/bcdbe16aeafaafec.gif` sert les circuits et exercices des lots 1–2 — vague 3.
- `front-squat` : pose A validée conservée (`themeB/_sources/B-04/front-squat-A.png`) ;
  M/B rejetées ce tour (amplitude insuffisante : ~1/8 et ~1/3 de squat au lieu de
  mi-descente franche et cuisses parallèles) ; reprise depuis A à la prochaine session.
- `hack-squat` et `front-squat` partagent le même override actuel : la production HOMME
  les séparera (ne pas intégrer l'un pour l'autre).

## 7. Validation demandée

Avant toute modification de `public/media/`, `src/` ou `release/`, confirmer :

1. ce plan d'intégration progressive ;
2. la **vague 1** (3 exercices : leg extension, leg press, squat cycliste) ;
3. le principe « GIF HOMME commun aux deux profils » appliqué au routage `exercise.gif`.

La validation visuelle des planches finales par l'utilisateur reste déterminante et
indépendante de ce plan documentaire.
