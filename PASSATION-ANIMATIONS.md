# 🚩 DRAPEAU ROUGE — CONSIGNE + PASSATION

## Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

**État consolidé au 6 octobre 2026 · commit `48106d9` · branche `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`**

> ### 🚩 DRAPEAU ROUGE — limite du tour atteinte
>
> **9 images IA sur 10 utilisées** (3 exercices × 3 positions) pour livrer le **LOT A-01**.
> Ce drapeau marque une **limite technique de génération**, pas un jugement sur les images
> produites. Le lot est livré, commité et poussé. La suite reprend au prochain tour.

À copier-coller tel quel pour reprendre le chantier dans un nouveau chat.

---

## 0. CADRE

- Dépôt : `github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public)
- **Branche de travail (session courante) : `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`**
- Dernier commit de contenu : **`6bb5fad`** — LOT A-01, échauffement & activation
  (plan thématique ajouté en `e8b7199`)

### ⚠️ Reprise de l'ancienne branche — FAIT, ne pas refaire

L'historique du chantier vivait sur `arena/fbb1ddb2-…` (dernier commit `acae07f`), lui-même
descendant de `arena/773dbe1e-…`. Au 2026-10-06, la branche de session `arena/50bc4ba3-…`
était encore sur `main` (`ddd1fb9`). Reprise effectuée :

```bash
git fetch origin arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap
git merge --ff-only FETCH_HEAD        # fast-forward : ddd1fb9 est bien un ancêtre
git push -u origin arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap
```

**Tout l'historique (POC → LOT 5 → passation `acae07f`) est donc présent sur
`arena/50bc4ba3-…`.** Les autres branches ne sont plus nécessaires : ne plus y toucher.

### Historique consolidé (de la branche de session)

```
6bb5fad  LOT A-01 — échauffement & activation (thème A)
e8b7199  plan de production thématique (357 animations, 5 thèmes, 108 lots)
acae07f  passation — commit de référence à jour
4dd79d9  passation — référence, restauration après reset, comptage exact
67d6751  référence de commit exacte dans la passation
845a112  consigne + passation à jour pour reprise du chantier
9fdf21b  PDF dédié aux nouveaux GIF (LOT 4, LOT 5, corrections)
ef9f148  bilan visuel PDF du chantier + script de génération
4a61b62  option A — correction des 3 animations défaillantes
3d0d196  LOT 5 — développés haltères inclinés 30°, 45°, 45° prise neutre
02f7c8d  LOT 4 — développés haltères plat, plat prise neutre, décliné prise neutre
1e7f70a  LOT 3 — circuits gainage et abdominaux
26a1ffe  LOT 2 — mountain climbers, dead bug avec rotation, gainage latéral dynamique
8e5b5d3  LOT 1 — dead bug, bird dog, gainage latéral
957fffe  inventaire maître + POC validé
```

- Toujours commencer par : `git fetch origin`, vérifier la branche et le diff, puis avancer.
  **Ne jamais changer de branche.**
- ⚠️ Le sandbox se réinitialise souvent. **Committer et pousser immédiatement après chaque
  lot.** Le distant est la source de vérité. Après un reset, restaurer avec
  `git fetch origin` puis
  `git reset --hard origin/arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`
  (vérifier d'abord que l'ancien HEAD local est bien un ancêtre).

---

## 1. CONSIGNE À NE PAS NÉGOCIER

1. **RÈGLE ABSOLUE N°1 : 1 exercice = 1 animation spécifique.**
   Aucun GIF partagé entre deux exercices. Interdit : copier, renommer, réutiliser,
   animation « proche » ou générique.
2. Ne jamais remplacer une animation livrée sans accord explicite, exercice par exercice.
3. Ne pas toucher à `release/` ni aux médias existants (`public/media`) tant que
   l'intégration n'est pas validée. Aucun fichier applicatif modifié à ce stade.
4. Signaler honnêtement les échecs et les réserves. Jamais de faux 100 %.
5. **Drapeau rouge = limite technique de génération atteinte (10 images IA par tour, soit
   3 exercices maximum).** Ce n'est PAS un jugement sur les images produites. Le dire au
   user quand la limite est atteinte et reprendre au tour suivant.
6. Si un doute existe sur la technique d'un exercice : vérifier en ligne (GB Performance,
   Docteur Fitness, YouTube, guides spécialisés) avant de générer, et **citer la source
   dans le message de commit**.
7. **L'œil de l'utilisateur tranche.** Afficher la planche de montage dans le chat pour
   validation.
8. Le user a donné son accord permanent pour committer et pousser les lots de ce chantier.
9. **Nouveau (2026-10-06) : les lots suivants sont organisés PAR THÈME**, plus par fichier
   dupliqué. Voir `yanis-fitness-evolution/animations/PLAN-THEMES.md`.

---

## 2. STYLE VALIDÉ (ne pas dévier)

- Mannequin anatomique 3D **TRÈS MUSCLÉ**, corps **BLANC ARGENTÉ MAT** (jamais chromé,
  jamais miroir).
- **VISAGE ENTIÈREMENT NOIR MAT**, lisse, sans aucun trait. Casquette blanche.
- Short noir, baskets blanches. Muscles travaillés **dorés jaune-orangé brillant**.
- **DÉCOR UNIQUE : terrasse bord de mer** (pierre claire, mer, palmiers, mur blanc bas).
  INTERDIT : salle de sport, parquet en bois, mur intérieur, miroir.
- **EXCEPTION : piscine intérieure** pour les exercices aquatiques (vue mi-air / mi-eau).
- **TAPIS DE SPORT NOIR** pour tous les exercices au sol (impossible sous un banc,
  cf. réserves).

---

## 3. MÉTHODE DE PRODUCTION D'UNE ANIMATION (3 positions)

1. Générer la position de **DÉPART** depuis la référence
   `Screenshot_20261005_212714_Facebook.jpg` (racine du dépôt).
2. Générer la **MI-COURSE** en CHAÎNANT sur l'image précédente (source_image = l'étape
   d'avant).
3. Générer la **POSITION FINALE** en chaînant sur la mi-course.
4. Assembler le GIF : A → M → B → M → boucle (ImageMagick `convert`,
   `-delay 130/110`, `-colors 96 -layers optimize`), format **460×257**
   (`-resize 460x257^ -gravity center -extent 460x257`).
5. Assembler une planche animée de montage, 3 colonnes (une par exercice).
6. Afficher la planche dans le chat pour validation, puis committer et pousser
   immédiatement.
7. Mettre à jour `animations/SUIVI.md` (compteurs, réserves, prochaines étapes)
   et `animations/PLAN-THEMES.md` (statuts — via `scripts/build-plan-themes.py`).

**Plafond : 10 images IA par tour = 3 exercices par tour maximum.**
Chaque image chaînée doit être générée après que sa source existe (ne pas chaîner
plusieurs niveaux dans le même appel parallèle).

### Recette d'assemblage éprouvée (LOT A-01)

```bash
# 1. recadrage + GIF 3 positions
convert "$n-$p.png" -resize '460x257^' -gravity center -extent 460x257 "r-$n-$p.png"
convert -delay 130 r-A.png -delay 110 r-M.png -delay 130 r-B.png -delay 110 r-M.png \
        -loop 0 -colors 96 -layers optimize "$n-3poses.gif"
# 2. planche 3 colonnes animée (1404x265)
convert "SEQ-$n.gif" -coalesce "f-$n-%d.png"          # 4 frames A M B M
for i in 0 1 2 3; do
  convert -background '#0b0e13' -gravity center f-a-$i.png f-b-$i.png f-c-$i.png \
          +append -bordercolor '#0b0e13' -border 4 -gravity center -extent 1404x265 row-$i.png
done
convert -delay 130 row-0.png -delay 110 row-1.png -delay 130 row-2.png \
        -delay 110 row-3.png -loop 0 -colors 96 PLANCHE.gif
```

⚠️ **Ne pas appliquer `-layers optimize` à la planche** : cela recadre les frames
(obtenu 473×265 au lieu de 1404×265). L'optimiser uniquement sur les GIF individuels.

⚠️ Pour afficher un GIF multi-positions à l'écran, toujours passer par
`convert x.gif -coalesce` (frames partiellement optimisées).

---

## 4. INVENTAIRE (source de vérité)

Fichiers : `animations/inventaire.json` + `animations/INVENTAIRE.md`
Script d'audit : `scripts/audit-animations.mjs` (nécessite `npm install`, non installé
dans le sandbox au 2026-10-06 — les comptages ont été refaits en Python depuis
`inventaire.json`).

- **357 animations nécessaires** = 209 musculation + 100 chrono (50 étapes × 2 profils)
  + 29 étirements + 19 guides piscine
  (les 10 protocoles aqua sont à `animation_necessaire: false`)
- 48 fichiers dupliqués (servant plusieurs exercices) · 1 orphelin · 29 manquants
  (variantes femme des étapes chrono `stretch-*`)
- Toutes les lignes sont en statut « à recréer » : aucune animation existante n'est
  réutilisée.

---

## 5. ÉTAT D'AVANCEMENT

| Élément | Valeur |
| --- | --- |
| Animations créées | **22 / 357** |
| **Restant à produire** | **335** |
| Animations corrigées | 3 / 5 (option A partielle) |
| Fichiers dupliqués traités | 4 / 48 · `666443484c7f0861.gif` → 1 / 3 |
| `bcdbe16aeafaafec.gif` | 8 / 8 ✅ soldé |
| `8de6e89e5395700c.gif` | 6 / 7 |
| Doublons sur les 29 fichiers du chantier | 0 (26 empreintes md5 distinctes) |
| Lots livrés | 7 (POC, L1, L2, L3, L4, L5, **A-01**) |

### Lots livrés

- **POC** (`animations/poc/`) — 5 : back squat, développé couché barre, hip thrust barre,
  soulevé de terre roumain, nage douce (femme).
- **LOT 1** (`animations/lot1/`) — 3 : dead bug, bird dog, gainage latéral.
- **LOT 2** (`animations/lot2/`) — 3 : mountain climbers, dead bug avec rotation,
  gainage latéral dynamique.
- **LOT 3** (`animations/lot3/`) — 2 : circuit gainage, circuit abdominaux.
- **LOT 4** (`animations/lot4/`) — 3 : développé haltères plat, plat prise neutre,
  décliné prise neutre.
- **LOT 5** (`animations/lot5/`) — 3 : développé haltères incliné 30°, incliné 45°,
  incliné 45° prise neutre.
- **LOT A-01** (`animations/themeA/`) — 3 *(nouveau, plan thématique)* :
  mobilité des épaules, pont fessier au sol — activation, clamshell à l'élastique.
  Planche : `themeA/LOT-A01-echauffement.gif`.

Corrigées (commit `4a61b62`) : dead bug avec rotation, gainage latéral,
gainage latéral dynamique.

---

## 6. PROCHAINE ACTION

Ordre demandé par le user : **thème par thème** (échauffement → musculation →
étirements → cardio → piscine).

1. ▶️ **LOT A-02** (`animations/themeA/`) — **validé par le user, à produire au
   prochain tour** — 3 exercices :
   `fire-hydrant-a-l-elastique`, `squat-au-poids-du-corps`,
   `fentes-arriere-au-poids-du-corps`.
2. **LOT A-03** : `pompes`, `gainage-planche`, `abduction-hanche-a-l-elastique`.
3. **LOT A-04** : `abduction-assise-machine-ou-elastique`, `pallof-press-a-l-elastique`,
   `face-pull-a-l-elastique`.
4. **LOT A-05** : `respiration-diaphragmatique`, `hip-thrust-unilateral-1-jambe`
   (dead bug déjà livré en LOT 1).
5. **Fin du thème A** : les 3 étapes chrono d'échauffement `warmup-route`,
   `warmup-mobilite`, `warmup-approche` (2 animations chacune : homme + femme),
   puis les **2 circuits composites** (gainage, abdominaux) — 1 circuit par tour.
6. Puis **thème B — musculation**, sous-thème par sous-thème (jambes/quadriceps en
   premier), **thème C — étirements**, **thème D — cardio**, **thème E — piscine**.
7. **Phase 11** : intégration dans l'application, après validation complète des lots.

### ⚠️ Toujours en souffrance (reporté à chaque tour depuis `acae07f`)

**Option A — réparation du POC, jamais commencée** (3 animations à refaire, 9 images) :

- `poc/back-squat.gif` → départ cadré trop serré (torse seul) : refaire en pied,
  corps entier jusqu'aux semelles, barre complète dans le cadre.
- `poc/hip-thrust-barre.gif` → artefacts, planche du banc coupée : refaire avec banc
  et barre entièrement visibles, épaules contre le banc, hanches basses.
- `poc/souleve-de-terre-roumain.gif` → tête et pieds coupés + salissures : refaire
  debout, barre au contact des cuisses, corps entier dans le cadre.
- Puis chaîner M et B depuis chaque nouvelle position A.

---

## 7. DÉCISIONS EN ATTENTE (ne pas trancher seul)

1. ⏳ **`developpe-incline-halteres`** — 7ᵉ et dernier exercice du fichier
   `8de6e89e5395700c.gif`. Son nom ne précise ni angle ni prise.
   **Le user a répondu « autre » sans préciser (2026-10-06).** Redemander explicitement
   l'angle (30° / 45° / autre) et la prise (classique / neutre) avant de produire.
   **Ne pas deviner.** C'est le seul exercice restant de `8de6e89e5395700c.gif` (6/7).
2. ✅ **Circuits du LOT 3 — TRANCHÉ PAR LE USER (2026-10-06) : animation COMPOSITE en
   plusieurs phases.** Le circuit gainage (planche → latéral → bird dog) et le circuit
   abdominaux (crunch → relevés de jambes → gainage) doivent dérouler **les trois
   mouvements à la suite** dans une seule animation.
   Conséquence : ≈ 3 phases × 3 positions = **9 images par circuit, soit 1 circuit par
   tour**. À reprogrammer en fin de thème A.
3. ✅ **Confirmé au 2026-10-06 :** les lots sont produits **par thème**
   (A échauffement → B musculation → C étirements → D cardio → E piscine), et non plus
   par fichier dupliqué. Le thème A est ouvert avec A-01. Les fichiers dupliqués restants
   (`e5532fe8fa9b40e9.gif` soulevés de terre, `f1a40f2c8c8502db.gif` mollets,
   `e169d622c8002b38.gif` élévations latérales…) sont traités **à l'intérieur** du thème B.
4. ✅ **LOT A-01 validé par le user (2026-10-06)** — feu vert pour le LOT A-02.

---

## 8. RÉSERVES CONNUES (honnêtes)

- **POC** : cadrages coupés et artefacts sur 3 animations (voir § 6, option A).
- **Circuit gainage / circuit abdominaux** : une seule position animée sur trois, alors que
  le user a tranché pour une **animation composite en 3 phases** (§ 7.2). À refaire en fin
  de thème A, à raison d'un circuit par tour (9 images par circuit).
- **Artefacts résiduels** dans les lots 1 et 3 (bavures au-dessus des tapis).
- **Cadrages hétérogènes** : la largeur des images varie d'un lot à l'autre.
- **LOT 4** : mouvements sur banc, donc pas de tapis noir au sol ; développé plat montré
  en prise classique ; léger écart de cadrage entre les trois mouvements.
- **LOT A-01** : l'agent **ne peut pas voir les images générées** (pas de capacité
  visuelle sur ce poste). La conformité au style est décrite dans les prompts, pas
  constatée. Validation visuelle = utilisateur.
- Pour afficher un GIF multi-positions à l'écran, toujours passer par
  `convert x.gif -coalesce`.

---

## 9. DOCUMENTS ET LIENS

Documents livrés (dépôt public, branche `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`)

- **`yanis-fitness-evolution/animations/PLAN-THEMES.md`** — plan de production thématique
  (5 thèmes, 108 lots de 3), régénéré par `scripts/build-plan-themes.py`.
- `yanis-fitness-evolution/animations/SUIVI.md` — suivi, compteurs, réserves.
- `yanis-fitness-evolution/animations/INVENTAIRE.md` — inventaire lisible.
- `yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf` — bilan 14 pages.
- `yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf` — LOT 4 + LOT 5 + corrections.
- Scripts PDF : `scripts/build-nouveaux-gifs-pdf.py`, `scripts/build-bilan-pdf.py`
  (dépendance : `reportlab`).

Téléchargement direct (remplacer le nom de fichier au besoin) :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf
```

Onglet du dépôt avec tous les GIF :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/tree/arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations
```

---

## 10. PHRASE DE REPRISE POUR LE NOUVEAU CHAT

> Reprends le chantier « reconstruction des animations » de JARVIS Fitness.
> Dépôt `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`, branche
> `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`, dernier commit `48106d9`.
> Lis `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
> `yanis-fitness-evolution/animations/PLAN-THEMES.md`, mets à jour la branche locale
> depuis origin, puis enchaîne sur la prochaine action : **LOT A-02**
> (fire hydrant à l'élastique, squat au poids du corps, fentes arrière au poids du corps).
> Ne tranche pas seul les décisions en attente (§ 7).
