# 🚩 DRAPEAU ROUGE — CONSIGNE + PASSATION

## Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

**État consolidé au 6 octobre 2026 · dernier commit de contenu `494682f` · branche `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`**

> ### 🚩 DRAPEAU ROUGE — limite du tour atteinte
>
> **9 images IA sur 10 utilisées** (3 exercices × 3 positions) pour livrer le **LOT A-03**.
> Ce drapeau marque une **limite technique de génération**, pas un jugement sur les images
> produites. Le lot est livré, commité et poussé. La suite reprend au prochain tour.
>
> Cette passation est ajoutée dans le **commit immédiatement suivant `494682f`**
> (`git log --oneline` pour le retrouver).
>
> ### 🚨 BLOQUANT — la photo de référence du personnage FÉMININ a été perdue
>
> Le user a envoyé `Screenshot_20261006_215711_Chrome.jpg` (photo du mannequin femme
> déjà validé). Le sandbox s'est réinitialisé avant que je puisse la committer :
> **le fichier a disparu** (il était dans `/home/user/uploads/`, hors dépôt).
> 👉 **Redemander la photo au user et la COMMITER IMMÉDIATEMENT dans le dépôt**
> (par ex. `yanis-fitness-evolution/animations/REF-personnage-feminin.jpg`).
> Tant qu'elle n'est pas dans git, un reset la fera disparaître à nouveau.

À copier-coller tel quel pour reprendre le chantier dans un nouveau chat.

---

## 0. CADRE

- Dépôt : `github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public)
- **Branche de travail (session courante) : `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`**
- Dernier commit de contenu : **`494682f`** — LOT A-03, échauffement (suite)

### ⚠️ Reprise de l'ancienne branche — FAIT, ne pas refaire

L'historique du chantier vivait sur `arena/fbb1ddb2-…` (dernier commit `acae07f`), lui-même
descendant de `arena/773dbe1e-…`. Au 2026-10-06, la branche de session `arena/50bc4ba3-…`
était encore sur `main` (`ddd1fb9`). Reprise effectuée en fast-forward :

```bash
git fetch origin arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap
git merge --ff-only FETCH_HEAD        # fast-forward : ddd1fb9 est bien un ancêtre
git push -u origin arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap
```

**Tout l'historique (POC → LOT 5 → passation `acae07f`) est présent sur
`arena/50bc4ba3-…`.** Les autres branches ne sont plus nécessaires : ne plus y toucher.

### Historique consolidé

```
494682f  LOT A-03 — échauffement, suite (thème A)
c05a672  périmètre HOMME + FEMME — 614 animations
918e424  LOT A-02 — échauffement, suite (thème A) + script build-gif-lot.sh
c45342b  décisions user — circuits composites, A-01 validé
48106d9  DRAPEAU ROUGE — consigne + passation
6bb5fad  LOT A-01 — échauffement & activation (thème A)
e8b7199  plan de production thématique (357 animations, 5 thèmes, 108 lots)
acae07f  passation — commit de référence à jour (ancienne branche)
4dd79d9  passation — référence, restauration après reset, comptage exact
67d6751  référence de commit exacte
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
9. **Les lots sont organisés PAR THÈME**, plus par fichier dupliqué.
   Voir `yanis-fitness-evolution/animations/PLAN-THEMES.md`.
10. **Terminer un thème entier avant de passer au suivant** (consigne du user, 2026-10-06).
    Le thème A (échauffement) est en cours — ne pas attaquer le thème B avant la fin.
11. **PÉRIMÈTRE HOMME + FEMME** (décision du user, 2026-10-06) : chaque exercice, chaque
    étirement et chaque guide piscine existe en **deux** animations — mannequin homme
    (Yanis) et mannequin femme (Émilie). Les étapes de chrono étaient déjà H + F.
    **Total = 614 animations.**
12. **Committer immédiatement toute nouvelle image de référence.** Les fichiers déposés
    dans `/home/user/uploads/` ou `/home/user/work/` sont **effacés** par les resets du
    sandbox. Seul ce qui est dans git survit.

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
4. Assembler le GIF : A → M → B → M → boucle, format **460×257**.
5. Assembler une planche animée de montage, 1 colonne par exercice.
6. Afficher la planche dans le chat pour validation, puis committer et pousser
   immédiatement.
7. Mettre à jour `animations/SUIVI.md` (compteurs, réserves) et
   `animations/PLAN-THEMES.md` (statuts, via `scripts/build-plan-themes.py`).

**Plafond : 10 images IA par tour = 3 exercices par tour maximum.**
Chaque image chaînée doit être générée après que sa source existe (ne pas chaîner
plusieurs niveaux dans le même appel parallèle).

### Script d'assemblage (à utiliser tel quel)

```bash
scripts/build-gif-lot.sh <dossier_source> <dossier_sortie> <titre_planche> <ex1> <ex2> [<ex3>]
# le dossier source contient <ex>-A.png / -M.png / -B.png (ou déjà <ex>-3poses.gif)
# produit <ex>-3poses.gif (460x257, -delay 130/110, -colors 96) + la planche animée
```

⚠️ **Ne jamais appliquer `-layers optimize` à la planche** : cela recadre les frames sur
la zone qui bouge (473×265 obtenu au lieu de 1404×265). L'optimiser uniquement sur les GIF
individuels. Le script contient déjà le garde-fou.

⚠️ Pour afficher un GIF multi-positions à l'écran, toujours passer par
`convert x.gif -coalesce` (frames partiellement optimisées).

---

## 4. INVENTAIRE (source de vérité)

Fichiers : `animations/inventaire.json` + `animations/INVENTAIRE.md`
Script d'audit : `scripts/audit-animations.mjs` (nécessite `npm install`, non installé
dans le sandbox au 2026-10-06 — les comptages ont été refaits en Python depuis
`inventaire.json`).

- **614 animations nécessaires** après le passage au périmètre HOMME + FEMME :
  209×2 exercices + 100 chrono (50 étapes × 2 profils) + 29×2 étirements + 19×2 guides
  = **614** (les 10 protocoles aqua sont à `animation_necessaire: false`)
- Avant cette décision le compteur était de 357 (un seul mannequin) — ne plus s'y fier.
- Le code confirme le besoin : `src/data/visuals-gifs.js` → `stepGif(cle, profil)` renvoie
  la variante **femme** pour `profil === 'emilie'`, avec **repli sur l'homme** s'il n'y en
  a pas. Les 209 **exercices** en revanche partagent un seul GIF
  (`GIF_OVERRIDES[nom]`, aucune variante de profil) — l'app ne saura montrer la version
  femme des exercices qu'après une évolution du code (phase 11 d'intégration).
- 48 fichiers dupliqués (servant plusieurs exercices) · 1 orphelin · 29 manquants
  (variantes femme des étapes chrono `stretch-*`)
- Toutes les lignes sont en statut « à recréer » : aucune animation existante n'est
  réutilisée.

---

## 5. ÉTAT D'AVANCEMENT

| Élément | Valeur |
| --- | --- |
| Animations créées | **28 / 614** (toutes en version homme pour l'instant) |
| **Restant à produire** | **586** |
| Versions femme produites | **0** — bloqué, voir l'alerte 🚨 en tête de document |
| Animations corrigées | 3 / 5 (option A partielle) |
| Fichiers dupliqués traités | 4 / 48 · `666443484c7f0861.gif` → 1 / 3 |
| `bcdbe16aeafaafec.gif` | 8 / 8 ✅ soldé |
| `8de6e89e5395700c.gif` | 6 / 7 (le 7ᵉ est tranché : 30° prise neutre) |
| Doublons sur les fichiers du chantier | 0 (32 empreintes md5 distinctes) |
| Lots livrés | 9 (POC, L1, L2, L3, L4, L5, A-01, A-02, A-03) |

### Thème A — ÉCHAUFFEMENT, MOBILITÉ & ACTIVATION : 17 / 25 entrées (versions HOMME)

**Restant pour solder le thème A (H + F) ≈ 34 animations ≈ 12 tours :**
- 14 exercices déjà livrés en homme → **14 versions femme** à produire ;
- 8 entrées jamais produites → **16 animations** (8 homme + 8 femme) ;
- 2 circuits → **4 animations** composites (2 homme + 2 femme).

| Lot | Contenu | Statut |
| --- | --- | --- |
| LOT 1 | dead bug, bird dog, gainage latéral | ✅ |
| LOT 2 | mountain climbers, dead bug rotation, gainage latéral dyn. | ✅ |
| LOT 3 | circuit gainage, circuit abdominaux | ✅ **mais à REFAIRE en composite** |
| **A-01** | mobilité des épaules, pont fessier activation, clamshell | ✅ validé |
| **A-02** | fire hydrant, squat poids du corps, fentes arrière pdc | ✅ livré |
| **A-03** | pompes, gainage planche, abduction hanche élastique | ✅ livré |
| **A-01/02/03 — versions FEMME** | les 9 mêmes exercices avec le mannequin femme | 🚨 bloqué : photo de référence perdue |
| **A-04** | abduction assise, pallof press, face pull élastique | ⬜ à produire |
| **A-05** | respiration diaphragmatique, hip thrust unilatéral (1 jambe) | ⬜ à produire |
| **A-06/A-07** | `warmup-route`, `warmup-mobilite`, `warmup-approche` (H + F = 6 anim.) | ⬜ à produire |
| — | circuits gainage + abdominaux, version **composite 3 phases** | ⬜ à refaire |

---

## 6. PROCHAINE ACTION — FINIR LE THÈME A (≈ 7 tours)

Le user a demandé de **terminer le thème échauffement avant de passer au suivant**.

0. 🚨 **EN PREMIER : récupérer la photo du personnage féminin** et la committer dans le
   dépôt (`yanis-fitness-evolution/animations/REF-personnage-feminin.jpg`). Sans elle,
   aucune version Émilie ne peut être produite et le périmètre H + F reste bloqué.
1. **LOT A-04** (`animations/themeA/`) : `abduction-assise-machine-ou-elastique`,
   `pallof-press-a-l-elastique`, `face-pull-a-l-elastique` — 3 exercices, 9 images.
1bis. **Versions FEMME de A-01 → A-03** dès que la photo est dispo (9 animations,
   3 tours) : mobilité des épaules, pont fessier, clamshell, fire hydrant, squat pdc,
   fentes arrière, pompes, gainage planche, abduction hanche.
3. **LOT A-05** : `respiration-diaphragmatique`, `hip-thrust-unilateral-1-jambe`
   (2 exercices = 6 images) + 1 animation d'étape chrono (3 images).
4. **Étapes chrono d'échauffement** (4 tours en H + F) : `warmup-route` H/F,
   `warmup-mobilite` H/F, `warmup-approche` H/F = 6 animations.
   - `warmup-route` = mise en route, marche ou vélo très facile, allure conversationnelle.
   - `warmup-mobilite` = cercles d'épaules (haut du corps) / mobilité hanches & chevilles
     (bas du corps) — **à garder visuellement distinct de « mobilité des épaules » (A-01)**.
   - `warmup-approche` = série d'approche légère, ~50 % de la charge de travail.
5. **Circuits composites** (4 tours en H + F, 1 circuit par tour) :
   - circuit gainage : planche → latéral → bird dog,
   - circuit abdominaux : crunch → relevés de jambes → gainage.
   Décision du user : les **trois mouvements déroulés à la suite** dans une seule animation
   (≈ 3 phases × 3 positions = 9 images par circuit). **Remplacent** les fichiers LOT 3
   existants — accord explicite du user déjà donné (décision § 7.2), mais montrer la planche
   avant de committer le remplacement.
6. **Ensuite seulement : thème B — musculation**, en commençant par
   `developpe-incline-halteres` (30°, prise neutre), puis jambes/quadriceps.

### ⚠️ Toujours en souffrance (reporté à chaque tour depuis `acae07f`)

**Option A — réparation du POC, jamais commencée** (3 animations à refaire, 9 images) :

- `poc/back-squat.gif` → départ cadré trop serré (torse seul) : refaire en pied,
  corps entier jusqu'aux semelles, barre complète dans le cadre.
- `poc/hip-thrust-barre.gif` → artefacts, planche du banc coupée : refaire avec banc
  et barre entièrement visibles, épaules contre le banc, hanches basses.
- `poc/souleve-de-terre-roumain.gif` → tête et pieds coupés + salissures : refaire
  debout, barre au contact des cuisses, corps entier dans le cadre.
- Puis chaîner M et B depuis chaque nouvelle position A.
- À caser **après** la fin du thème A, sauf contre-ordre du user.

---

## 7. DÉCISIONS

1. ✅ **`developpe-incline-halteres` — TRANCHÉ PAR LE USER (2026-10-06) :
   banc incliné 30°, prise neutre** (paumes face à face).
   À produire en ouverture du thème B — pectoraux.
   Attention à le rendre visuellement distinct de `developpe-halteres-incline-30`
   (LOT 5, 30° prise classique) et de `developpe-halteres-incline-45-prise-neutre`
   (LOT 5, 45° prise neutre).
2. ✅ **Circuits du LOT 3 — TRANCHÉ PAR LE USER : animation COMPOSITE en 3 phases.**
   Les trois mouvements déroulés à la suite dans une seule animation
   (≈ 9 images par circuit → 1 circuit par tour). À faire en fin de thème A.
3. ✅ **Lots par thème** (A échauffement → B musculation → C étirements → D cardio →
   E piscine). Les anciens fichiers dupliqués (`e5532fe8fa9b40e9.gif` soulevés de terre,
   `f1a40f2c8c8502db.gif` mollets, `e169d622c8002b38.gif` élévations latérales…) sont
   désormais traités **à l'intérieur** du thème B.
4. ✅ **Terminer le thème A avant d'attaquer le thème B** (consigne du user, 2026-10-06).
5. ✅ **LOT A-01 validé par le user** — LOT A-02 livré, en attente de validation.
6. ⏳ **Tenue du mannequin femme** : le user a répondu « je l'avais déjà validée,
   remontre-la moi ». La planche de présentation a été montrée
   (`animations/PLANCHE-PERSONNAGE-FEMININ.png`, à régénérer — elle n'a pas survécu au
   reset). À revalider dès que la photo de référence est revenue.
   Choix par défaut appliqué en attendant : **parité avec l'homme** — brassière noire +
   short noir + baskets blanches + casquette blanche, corps blanc argenté mat, tête noire
   sans traits, muscles dorés. À confirmer.
7. ⏳ **Aucune autre décision en attente.**

---

## 8. RÉSERVES CONNUES (honnêtes)

- **POC** : cadrages coupés et artefacts sur 3 animations (voir § 6, option A).
- **Circuits LOT 3** : une seule position animée sur trois alors que le user veut une
  animation composite en 3 phases. À refaire (§ 6.5).
- **Artefacts résiduels** dans les lots 1 et 3 (bavures au-dessus des tapis).
- **Cadrages hétérogènes** : la largeur des images varie d'un lot à l'autre.
- **LOT 4** : mouvements sur banc, donc pas de tapis noir au sol ; développé plat montré
  en prise classique ; léger écart de cadrage entre les trois mouvements.
- **LOTS A-01 / A-02 / A-03** : l'agent **ne peut pas voir les images générées** (pas de
  capacité visuelle sur ce poste). La conformité au style est décrite dans les prompts,
  pas constatée. Validation visuelle = utilisateur.
- **Reset du sandbox × 2 en une seule session** (2026-10-06) : la branche locale est
  retombée sur `ddd1fb9` et les fichiers hors dépôt ont été effacés (dont la photo du
  personnage femme et les images intermédiaires). Restauration systématique par
  `git reset --hard origin/arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`.
  **Conséquence : ne jamais laisser un livrable ou une référence hors de git.**
- Pour afficher un GIF multi-positions à l'écran, toujours passer par
  `convert x.gif -coalesce`.

---

## 9. DOCUMENTS ET LIENS

Documents livrés (dépôt public, branche `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`)

- **`yanis-fitness-evolution/animations/PLAN-THEMES.md`** — plan de production thématique
  (5 thèmes, 108 lots de 3), régénéré par `scripts/build-plan-themes.py`.
- **`yanis-fitness-evolution/scripts/build-gif-lot.sh`** — assemblage GIF + planche.
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
> `arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`, dernier commit de contenu `494682f`.
> Lis `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
> `yanis-fitness-evolution/animations/PLAN-THEMES.md`, mets à jour la branche locale
> depuis origin (`git reset --hard origin/arena/50bc4ba3-...` si elle est retombée sur
> `ddd1fb9`), puis :
> 1. récupère la **photo du personnage féminin** et committe-la dans le dépôt ;
> 2. produis les **versions FEMME de A-01 → A-03**, puis le **LOT A-04**
>    (abduction assise, pallof press, face pull élastique) ;
> 3. **terminer tout le thème A (échauffement) en HOMME + FEMME avant le thème B**,
>    en finissant par les 3 étapes chrono `warmup-*` et les 2 circuits composites.
> Périmètre : **614 animations** (H + F). Décisions en attente : § 7.6 (tenue femme).
