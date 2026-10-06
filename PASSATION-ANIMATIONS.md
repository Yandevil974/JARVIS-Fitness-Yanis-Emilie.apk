# 🚩 DRAPEAU ROUGE — CONSIGNE + PASSATION

## Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

**État consolidé au 6 octobre 2026 · dernier commit de contenu : LOT A-03 FEMME (thème A, 1 réserve) · branche de session `arena/6a360b28-jarvis-fitness-yanis-emilie-ap`**

> ### 🚩 DRAPEAU ROUGE — limite du tour atteinte
>
> **10 images IA sur 10 utilisées** (LOT A-03 FEMME : pompes 3 positions, gainage planche
> 3 positions dont **1 échec rejoué**, abduction hanche 3 positions). Ce drapeau marque
> une **limite technique de génération**, pas un jugement sur les images produites.
> Le lot est livré, commité et poussé — **avec 1 réserve** (abduction hanche position B
> trop proche de la mi-course, 1 image à régénérer).
>
> **Aucune image n'a été gaspillée en silence** : l'échec du gainage planche (mi-course
> rendue identique au départ) a été détecté par comparaison objective des pixels
> (RMSE 0,054) *avant* assemblage, et la position a été régénérée avec une consigne
> d'asymétrie explicite.
>
> ### 👁️ NOUVEAUTÉ MAJEURE — l'agent VOIT les images
>
> Les tours précédents portaient la réserve « l'agent ne voit pas les images ». **Ce
> n'est plus vrai** : l'agent a contrôlé visuellement les 9 images générées *et* les GIF
> déjà livrés. C'est ce contrôle qui a permis de détecter que le fire hydrant partait en
> extension arrière et que la mi-course du squat était ratée — au lieu de les livrer en
> silence. **Conséquence : l'agent peut désormais s'auto-contrôler avant de livrer, et
> signaler un défaut de qualité sur les lots déjà validés** (cf. le squat homme, § 8).
>
> ### ⚠️ BRANCHE DE SESSION
>
> La session en cours est rattachée à la branche
> **`arena/6a360b28-jarvis-fitness-yanis-emilie-ap`** (contrainte technique : Arena suit
> la session par cette branche, l'agent ne peut pas écrire sur une autre).
> En ouverture de tour, cette branche a été **avancée en fast-forward sur tout
> l'historique de `arena/50bc4ba3-…`** puis le LOT A-02 FEMME y a été ajouté.
> Elle contient donc **l'intégralité du chantier** : `475beaa` (état 50bc4ba3) + LOT A-02
> FEMME. Les liens de fichiers ci-dessous pointent sur la branche de session.
>
> ### ✅ DÉBLOQUÉ — la photo du personnage féminin est dans le dépôt
>
> `yanis-fitness-evolution/animations/REF-personnage-feminin.jpg` (déposée par le user
> sur GitHub, déplacée et commitée en `f9b95da`). Elle survivra désormais aux resets.
> **C'est la source à utiliser pour toutes les versions Émilie.**
>
> ### 🚨 RÈGLE VITALE — le sandbox se réinitialise à CHAQUE tour
>
> Constaté 4 fois le 2026-10-06. À chaque tour : la branche locale retombe sur `ddd1fb9`
> et **tout ce qui est hors de git est effacé** (`/home/user/uploads/`, `/home/user/work/`).
> Deux conséquences opérationnelles :
> 1. **Toujours commencer par** `git fetch origin` puis, si HEAD est retombé,
>    `git reset --hard origin/arena/50bc4ba3-jarvis-fitness-yanis-emilie-ap`.
> 2. **Ne jamais laisser un livrable ou une référence hors de git.** Pour toute nouvelle
>    image de référence : demander au user de la déposer **sur GitHub** (onglet du dépôt →
>    branche `arena/50bc4ba3-…` → *Add file* → *Upload files*). Les pièces jointes du chat
>    et `curl` (pas d'accès HTTP sortant depuis le sandbox) ne fonctionnent pas.
> 3. **Un lot interrompu est un lot perdu** : les images intermédiaires sont hors dépôt.
>    Ne commencer un lot que si l'on a les 9 images disponibles dans le tour.
>    Le LOT A-04 en a fait les frais (A et M générées, B interrompues, tout effacé).

À copier-coller tel quel pour reprendre le chantier dans un nouveau chat.

---

## 0. CADRE

- Dépôt : `github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public)
- **Branche de travail (session courante) : `arena/6a360b28-jarvis-fitness-yanis-emilie-ap`**
  — contrainte d'Arena : la session est suivie par cette branche, l'agent ne peut écrire
  que dessus. Elle a été **fast-forwardée sur tout l'historique de
  `arena/50bc4ba3-…`** (jusqu'à `475beaa`) puis complétée par le LOT A-02 FEMME.
- Dernier commit de contenu : **`bda24e1`** — LOT A-02 FEMME (3 animations, 2 sous réserve)

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
(e33605b)  LOT A-03 FEMME — mannequin femme (pompes + gainage planche + abduction)
bda24e1  LOT A-02 FEMME — mannequin femme (thème A, 2 animations sous réserve)
475beaa  DRAPEAU ROUGE — passation (état de la branche arena/50bc4ba3-…)
da07c20  LOT A-01 FEMME — mannequin femme (thème A)
f9b95da  référence du personnage féminin, déplacée et commitée
45056dd  Add files via upload (dépôt du user : photo du personnage femme)
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
12. **Le sandbox se réinitialise à chaque tour.** Toujours `git fetch origin` + si
    besoin `git reset --hard origin/arena/6a360b28-…` (ou de la branche de session
    affichée dans le prompt système) **en ouverture de tour**.
    **Seul ce qui est dans git survit.** Toute référence doit être déposée par le user
    **sur GitHub** (pas en pièce jointe du chat) puis commitée.
13. **Un lot commencé doit être terminé dans le même tour** (9 images), sinon les images
    intermédiaires sont perdues au reset suivant. Voir le LOT A-04, perdu ainsi.

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
| Animations créées | **37 / 614** |
| **Restant à produire** | **577** |
| Versions femme produites | **9 / 307** (LOT A-01 FEMME : 3 · **LOT A-02 FEMME : 3** · **LOT A-03 FEMME : 3**) |
| Animations femme à reprendre | **3** (A-02F fire hydrant M/B, A-02F squat M, A-03F abduction B) |
| Animations corrigées | 3 / 5 (option A partielle) |
| Fichiers dupliqués traités | 4 / 48 · `666443484c7f0861.gif` → 1 / 3 |
| `bcdbe16aeafaafec.gif` | 8 / 8 ✅ soldé |
| `8de6e89e5395700c.gif` | 6 / 7 (le 7ᵉ est tranché : 30° prise neutre) |
| Doublons sur les fichiers du chantier | 0 (64 empreintes md5 distinctes pour 64 fichiers GIF/PNG) |
| Lots livrés | 12 (POC, L1, L2, L3, L4, L5, A-01, A-02, A-03, **A-01 FEMME**, **A-02 FEMME**, **A-03 FEMME**) |

### Thème A — ÉCHAUFFEMENT, MOBILITÉ & ACTIVATION : 17 / 25 entrées en HOMME, 9 en FEMME

**Convention de nommage :** `themeA/<exercice>-3poses.gif` = homme,
`themeA/femme/<exercice>-3poses.gif` = femme.

**Restant pour solder le thème A (H + F) = 24 animations neuves (+ 3 images de reprise) :**
- **8 versions femme à rattraper** (les lots 1, 2 et 3 n'existent qu'en homme) → 3 tours ;
  il ne reste plus rien à rattraper sur A-01 / A-02 / A-03 FEMME (soldés) ;
- **LOT A-04 jamais produit** (abduction assise, pallof press, face pull) → H **et** F ;
- **8 entrées jamais produites** → 16 animations (8 homme + 8 femme) ;
- 2 circuits → **4 animations** composites (2 homme + 2 femme) ;
- reprises : A-02F fire hydrant M/B + squat M (3 images) et A-03F abduction B (1 image),
  **en attente d'accord du user** (règle 2).

| Lot | Contenu | Statut |
| --- | --- | --- |
| LOT 1 | dead bug, bird dog, gainage latéral | ✅ |
| LOT 2 | mountain climbers, dead bug rotation, gainage latéral dyn. | ✅ |
| LOT 3 | circuit gainage, circuit abdominaux | ✅ **mais à REFAIRE en composite** |
| **A-01** | mobilité des épaules, pont fessier activation, clamshell | ✅ validé |
| **A-02** | fire hydrant, squat poids du corps, fentes arrière pdc | ✅ livré |
| **A-03** | pompes, gainage planche, abduction hanche élastique | ✅ livré |
| **A-01 FEMME** | mobilité des épaules, pont fessier, clamshell — mannequin femme | ✅ livré (`themeA/femme/`) |
| **A-02 FEMME** | fire hydrant, squat pdc, fentes arrière — mannequin femme | ⚠️ **livré sous réserve** (fire hydrant M/B et squat M à refaire) |
| **A-03 FEMME** | pompes, gainage planche, abduction hanche — mannequin femme | ✅ livré (`themeA/femme/`) · ⚠️ abduction B sous réserve |
| **LOTS 1/2/3 — versions FEMME** | dead bug, bird dog, gainage latéral, mountain climbers, dead bug rotation, gainage latéral dyn., 2 circuits | ⬜ **à produire (rattrapage de la fille)** |
| **A-04** | abduction assise, pallof press, face pull élastique | ⚠️ **perdu au reset — jamais produit (H ni F)** |
| **A-05** | respiration diaphragmatique, hip thrust unilatéral (1 jambe) | ⬜ à produire |
| **A-06/A-07** | `warmup-route`, `warmup-mobilite`, `warmup-approche` (H + F = 6 anim.) | ⬜ à produire |
| — | circuits gainage + abdominaux, version **composite 3 phases** | ⬜ à refaire |

---

## 6. PROCHAINE ACTION — FINIR LE THÈME A

Le user a demandé de **terminer le thème échauffement avant de passer au suivant**.

0. ✅ **FAIT** — la photo du personnage féminin est dans le dépôt
   (`yanis-fitness-evolution/animations/REF-personnage-feminin.jpg`).
1. ✅ **FAIT (ce tour)** — **LOT A-03 FEMME** (`pompes`, `gainage-planche`,
   `abduction-hanche-a-l-elastique`) livré, commité et poussé. 3 animations, 1 réserve
   (abduction B trop proche de la mi-course).
2. 🔴 **À FAIRE EN PRIORITÉ — RATTRAPAGE DE LA FILLE** (consigne du user : que les deux
   mannequins avancent ensuite au même rythme). Il reste **8 entrées du thème A qui
   n'existent qu'en homme** → 8 animations femme, à produire dans cet ordre :
   - **lot 1 FEMME** : `dead-bug`, `bird-dog`, `gainage-lateral` ;
   - **lot 2 FEMME** : `mountain-climbers`, `dead-bug-rotation`, `gainage-lateral-dyn` ;
   - **lot 3 FEMME** : `circuit-gainage`, `circuit-abdos` (versions composites).
   Puis H et F avancent **ensemble** sur les entrées jamais produites (A-04 → A-05 →
   étapes chrono `warmup-*` → circuits composites).
3. **LOT A-04** : `abduction-assise-machine-ou-elastique`, `pallof-press-a-l-elastique`,
   `face-pull-a-l-elastique` — 3 exercices, 9 images (**jamais produits** : H d'abord,
   F juste après).
4. **LOT A-05** : `respiration-diaphragmatique`, `hip-thrust-unilateral-1-jambe`
   (2 exercices) + les étapes chrono.
5. **Étapes chrono d'échauffement** (H + F) : `warmup-route` H/F, `warmup-mobilite` H/F,
   `warmup-approche` H/F = 6 animations.
   - `warmup-route` = mise en route, marche ou vélo très facile, allure conversationnelle.
   - `warmup-mobilite` = cercles d'épaules (haut du corps) / mobilité hanches & chevilles
     (bas du corps) — **à garder visuellement distinct de « mobilité des épaules » (A-01)**.
   - `warmup-approche` = série d'approche légère, ~50 % de la charge de travail.
6. **Circuits composites** (H + F, 1 circuit par tour) :
   - circuit gainage : planche → latéral → bird dog,
   - circuit abdominaux : crunch → relevés de jambes → gainage.
   Décision du user : les **trois mouvements déroulés à la suite** dans une seule animation
   (3 phases × 3 positions = 9 images par circuit). **Remplacent** les fichiers LOT 3
   existants — accord explicite déjà donné (§ 7.2), mais montrer la planche avant de
   committer le remplacement.
7. **Reprises en attente d'accord** (règle 2 — ne pas toucher sans validation) :
   A-02F fire hydrant M/B + squat M (3 images, sources dans `_sources/A-02F/`),
   A-03F abduction B (1 image, sources dans `_sources/A-03F/`), squat HOMME (position
   finale pas assez basse).
8. **Ensuite seulement : thème B — musculation**, en commençant par
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
6. ✅ **Personnage femme confirmé conforme** au style validé : l'agent a pu comparer
   visuellement la planche `themeA/femme/LOT-A01F-echauffement-femme.gif` et les
   images du LOT A-02 FEMME à la référence `Screenshot_20261005_212714_Facebook.jpg` —
   même code visuel (corps argenté mat, visage noir sans traits, casquette, tresse,
   tenue noire, baskets blanches, terrasse bord de mer, tapis noir, muscles dorés).
   Seule réserve de style : le générateur ajoute parfois des reflets brillants sur les
   jambes (à surveiller).
7. 🔴 **Décisions en attente du user :**
   - **Accord pour refaire les 2 animations du LOT A-02 FEMME** (fire hydrant M/B,
     squat M) — 3 images au prochain tour, les 6 autres positions sont déjà dans git.
   - **Accord pour refaire le squat HOMME** (`themeA/squat-poids-du-corps-3poses.gif`,
     position finale pas assez basse) — la règle 2 interdit de toucher à une animation
     livrée sans accord explicite.
   - Confirmation que la planche `themeA/femme/LOT-A02F-echauffement-femme.gif`
     montre bien le bon personnage et le bon décor.
   - **Accord pour refaire la position B de l'abduction hanche FEMME**
     (`themeA/femme/abduction-hanche-elastique-3poses.gif`) — 1 image au prochain tour,
     les 8 autres positions sont déjà dans git et dans `_sources/A-03F/`.
8. ⏳ **Aucune autre décision en attente.**

---

## 8. RÉSERVES CONNUES (honnêtes)

- **POC** : cadrages coupés et artefacts sur 3 animations (voir § 6, option A).
- **Circuits LOT 3** : une seule position animée sur trois alors que le user veut une
  animation composite en 3 phases. À refaire (§ 6.6).
- **Artefacts résiduels** dans les lots 1 et 3 (bavures au-dessus des tapis).
- **Cadrages hétérogènes** : la largeur des images varie d'un lot à l'autre.
- **LOT 4** : mouvements sur banc, donc pas de tapis noir au sol ; développé plat montré
  en prise classique ; léger écart de cadrage entre les trois mouvements.
- **LOTS A-01 / A-02 / A-03** : ✅ **réserve levée partiellement** — l'agent **voit
  désormais les images** et a contrôlé les lots existants. La conformité de style a été
  constatée sur les planches A-01 FEMME, A-02 FEMME et sur les frames des lots A-02/A-03
  HOMME. La validation finale reste celle de l'utilisateur (règle 7).
- **LOT A-02 FEMME** : 2 animations livrées **non conformes** (fire hydrant M/B = le
  mouvement part en extension arrière ; squat M = mi-descente trop proche du départ).
  Détail et sources dans la section « LOT A-02 FEMME » de `animations/SUIVI.md`.
- **LOT A-03 FEMME** : 1 animation sous réserve — `abduction-hanche-elastique-3poses.gif`
  position finale trop proche de la mi-course (écart RMSE 0,029 : le mouvement ne se lit
  pas). Les 9 positions sources sont conservées dans `themeA/femme/_sources/A-03F/` :
  **1 seule image** à régénérer. Pompes et gainage planche FEMME conformes.
- **Squat HOMME (LOT A-02)** : position finale pas assez basse (cuisses sous le
  parallèle) — défaut constaté par contrôle visuel, **non corrigé** faute d'accord
  (règle 2).
- **Stabilité de cadrage** : d'une position à l'autre, le générateur change parfois
  légèrement l'angle et l'échelle (squat homme et femme : face → dos → profil). À
  surveiller pour les lots suivants ; piste : renforcer la consigne « same camera
  framing/angle, same position in the frame » dans les prompts (déjà fait au A-02F,
  insuffisant).
- **Reset du sandbox × 4 dans la même session** (2026-10-06), **à chaque tour** : la
  branche locale retombe sur `ddd1fb9` et tout ce qui est hors dépôt est effacé (photos
  envoyées en pièce jointe, images intermédiaires). Restauration par
  `git fetch origin` puis `git merge --ff-only origin/<branche de session>`
  (branche affichée dans le prompt système).
  **Conséquences :** (a) ne jamais laisser un livrable ou une référence hors de git ;
  (b) terminer un lot dans le tour où il est commencé — le **LOT A-04 a été perdu**
  ainsi (positions A et M générées, B interrompues, fichiers effacés) ;
  (c) `curl` n'a pas d'accès HTTP sortant depuis le sandbox : seule la voie GitHub
  (dépôt du user puis `git fetch`) permet de recevoir un fichier.
- Pour afficher un GIF multi-positions à l'écran, toujours passer par
  `convert x.gif -coalesce`.

---

## 9. DOCUMENTS ET LIENS

Documents livrés (dépôt public, branche de session `arena/6a360b28-jarvis-fitness-yanis-emilie-ap`)

- **`yanis-fitness-evolution/animations/PLAN-THEMES.md`** — plan de production thématique
  (5 thèmes, 108 lots de 3), régénéré par `scripts/build-plan-themes.py`.
- **`yanis-fitness-evolution/scripts/build-gif-lot.sh`** — assemblage GIF + planche.
- `yanis-fitness-evolution/animations/SUIVI.md` — suivi, compteurs, réserves.
- `yanis-fitness-evolution/animations/INVENTAIRE.md` — inventaire lisible.
- `yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf` — bilan 14 pages.
- `yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf` — LOT 4 + LOT 5 + corrections.
- Scripts PDF : `scripts/build-nouveaux-gifs-pdf.py`, `scripts/build-bilan-pdf.py`
  (dépendance : `reportlab`).
- **`animations/themeA/femme/_sources/A-02F/`** — atelier temporaire : les 6 positions
  saines du LOT A-02 FEMME conservées dans git pour ne régénérer que 3 images au
  prochain tour. À supprimer une fois le lot corrigé.

Téléchargement direct (remplacer le nom de fichier au besoin) :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/6a360b28-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/6a360b28-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf
```

Onglet du dépôt avec tous les GIF :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/tree/arena/6a360b28-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations
```

---

## 10. PHRASE DE REPRISE POUR LE NOUVEAU CHAT

> Reprends le chantier « reconstruction des animations » de JARVIS Fitness.
> Dépôt `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`, branche de session affichée dans
> le prompt système (l'agent ne peut écrire que sur celle-là ; elle contient tout
> l'historique du chantier).
> En ouverture de tour : `git fetch origin` puis, si HEAD est retombé sur `ddd1fb9`,
> `git reset --hard origin/<branche de session>`.
> Lis `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
> `yanis-fitness-evolution/animations/PLAN-THEMES.md`, puis :
> 1. **RATTRAPAGE DE LA FILLE** (consigne du user : rattraper l'homme pour qu'ensuite les
>    deux avancent au même rythme) — il reste **8 entrées du thème A qui n'existent qu'en
>    homme** : **lot 1 FEMME** (`dead-bug`, `bird-dog`, `gainage-lateral`), puis
>    **lot 2 FEMME** (`mountain-climbers`, `dead-bug-rotation`, `gainage-lateral-dyn`),
>    puis **lot 3 FEMME** (les 2 circuits). Référence identité :
>    `animations/REF-personnage-feminin.jpg` ; chaîner A → M → B ; assembler avec
>    `scripts/build-gif-lot.sh` (460×257, `-delay 130/110`, planche 1420×265, **jamais
>    `-layers optimize` sur la planche**) ; montrer la planche ; commit + push ;
>    mettre à jour `SUIVI.md` / `PLAN-THEMES.md`.
> 2. **Reprises en attente d'accord du user** (ne jamais remplacer une animation livrée
>    sans accord) : A-02F fire hydrant M/B + squat M (3 images), A-03F abduction B
>    (1 image) — les positions saines sont dans `themeA/femme/_sources/` ; squat HOMME.
> 3. **Ensuite** : LOT A-04 (abduction assise, pallof press, face pull — jamais produits),
>    LOT A-05, les étapes chrono `warmup-*` H + F, puis les circuits composites.
> 4. **Terminer tout le thème A (H + F) avant d'attaquer le thème B.**
> Périmètre : **614 animations**. ⚠️ **3 exercices maxi par tour (10 images IA)**.
> L'agent **voit les images** : contrôler chaque position (et comparer objectivement les
> pixels, ex. `compare -metric RMSE`) **avant** de livrer, et signaler les réserves
> honnêtement — jamais de faux 100 %.
