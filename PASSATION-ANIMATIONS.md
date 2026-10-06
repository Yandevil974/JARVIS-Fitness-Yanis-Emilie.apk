# CONSIGNE + PASSATION — Chantier « RECONSTRUCTION DES ANIMATIONS » (JARVIS Fitness)

À copier-coller tel quel pour reprendre le chantier dans un nouveau chat.
État consolidé au **6 octobre 2026**, commit **67d6751**
(dernier commit de contenu : `9fdf21b`).

---

## 0. CADRE

- **Dépôt** : `github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk` (public)
- **Branche de travail** : `arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap`
- **Dernier commit de contenu** : `9fdf21b` — PDF dédié aux nouveaux GIF
  (cette passation a été ajoutée en `845a112` puis ajustée en `67d6751`)
- **Historique du chantier** : `67d6751` → `845a112` → `9fdf21b` → `ef9f148` → `4a61b62`
  → `3d0d196` (LOT 5) → `02f7c8d` (LOT 4) → `1e7f70a` (LOT 3) → `26a1ffe` (LOT 2)
  → `8e5b5d3` (LOT 1) → `957fffe` (POC)
- **Toujours commencer par** : `git fetch origin`, vérifier la branche et le diff, puis avancer.
  Ne jamais changer de branche, ne jamais travailler sur une autre branche.
- ⚠️ Une consigne historique mentionnait la branche `arena/773dbe1e-…`. Elle contenait le même
  chantier : son historique a été récupéré et repris sur la branche de session `arena/fbb1ddb2-…`
  (qui est un descendant direct). **Travailler uniquement sur `arena/fbb1ddb2-…`.**
- ⚠️ Le sandbox se réinitialise souvent (constaté plusieurs fois, parfois entre deux messages).
  **Committer et pousser immédiatement après chaque lot.** Le distant est la source de vérité.
  Après un reset, la branche locale peut retomber sur un vieux commit : restaurer avec
  `git fetch origin` puis
  `git reset --hard origin/arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap`
  (vérifier d'abord que l'ancien HEAD local est bien un ancêtre, pour ne rien perdre).

---

## 1. CONSIGNE À NE PAS NÉGOCIER

1. **RÈGLE ABSOLUE N°1 : 1 exercice = 1 animation spécifique.**
   Aucun GIF partagé entre deux exercices. Interdit : copier, renommer, réutiliser,
   animation « proche » ou générique.
2. **Ne jamais remplacer une animation livrée sans accord explicite**, exercice par exercice.
3. **Ne pas toucher à `release/` ni aux médias existants (`public/media`) tant que
   l'intégration n'est pas validée.** Aucun fichier applicatif modifié à ce stade.
4. **Signaler honnêtement les échecs et les réserves.** Jamais de faux 100 %.
5. **Drapeau rouge** = limite technique de génération atteinte (10 images IA par tour, soit
   3 exercices maximum). Ce n'est **pas** un jugement sur les images produites. Le dire au
   user quand la limite est atteinte et reprendre au tour suivant.
6. **Si un doute existe sur la technique d'un exercice : vérifier en ligne** (GB Performance,
   Docteur Fitness, YouTube, guides spécialisés) **avant** de générer, et citer la source
   dans le message de commit.
7. **L'œil de l'utilisateur tranche.** Afficher la planche de montage dans le chat pour
   validation.
8. Le user a donné son **accord permanent pour committer et pousser** les lots de ce chantier.

---

## 2. STYLE VALIDÉ (ne pas dévier)

- Mannequin anatomique 3D **TRÈS MUSCLÉ**, corps **BLANC ARGENTÉ MAT**
  (jamais chromé, jamais miroir).
- **VISAGE ENTIÈREMENT NOIR MAT**, lisse, sans aucun trait. **Casquette blanche**.
- **Short noir, baskets blanches.** Muscles **travaillés** dorés **jaune-orangé brillant**.
- **DÉCOR UNIQUE : terrasse bord de mer** (pierre claire, mer, palmiers, mur blanc bas).
  **INTERDIT** : salle de sport, parquet en bois, mur intérieur, miroir.
- **EXCEPTION** : piscine intérieure pour les exercices aquatiques (vue mi-air / mi-eau).
- **TAPIS DE SPORT NOIR** pour tous les exercices au sol (impossible sous un banc, cf. réserves).

---

## 3. MÉTHODE DE PRODUCTION D'UNE ANIMATION (3 positions)

1. Générer la **position de DÉPART** depuis la référence
   `Screenshot_20261005_212714_Facebook.jpg` (racine du dépôt).
2. Générer la **MI-COURSE en CHAÎNANT** sur l'image précédente
   (`source_image` = l'étape d'avant).
3. Générer la **POSITION FINALE en chaînant** sur la mi-course.
4. Assembler le GIF : **A → M → B → M → boucle** (ImageMagick `convert`,
   `-delay 130/110`, `-colors 96 -layers optimize`), format **460×257**
   (`-resize 460x257^ -gravity center -extent 460x257`).
5. Assembler une **planche animée montage 3 colonnes** (une colonne par exercice).
6. **Afficher la planche dans le chat** pour validation, puis **committer et pousser
   immédiatement**.
7. Mettre à jour `animations/SUIVI.md` (compteurs, réserves, prochaines étapes).

**Plafond : 10 images IA par tour = 3 exercices par tour maximum.**
Chaque image chaînée doit être générée **après** que sa source existe (ne pas chaîner
plusieurs niveaux dans le même appel parallèle).

---

## 4. INVENTAIRE (source de vérité)

Fichiers : `animations/inventaire.json` + `animations/INVENTAIRE.md`
Script d'audit : `scripts/audit-animations.mjs`

- **357 animations nécessaires au minimum**
- 209 exercices de musculation · 50 étapes de chrono × 2 profils · 29 étirements ·
  19 guides piscine · 10 protocoles aqua
- **48 fichiers dupliqués** (servant plusieurs exercices) · **189 orphelins** · 0 manquant
- Toutes les lignes sont en statut `à recréer` : aucune animation existante n'est réutilisée.

---

## 5. ÉTAT D'AVANCEMENT

| Élément | Valeur |
| --- | --- |
| Animations créées | **19 / 357** |
| Animations corrigées | 3 / 5 (option A partielle) |
| Fichiers dupliqués traités | 4 / 48 |
| `bcdbe16aeafaafec.gif` | **8 / 8 ✅ soldé** |
| `8de6e89e5395700c.gif` | 6 / 7 |
| Doublons de fichier sur les 25 fichiers du chantier | 0 (19 animations + 6 planches, md5 distincts) |

**Lots livrés**

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

**Corrigées (commit `4a61b62`)** : dead bug avec rotation, gainage latéral,
gainage latéral dynamique.

---

## 6. PROCHAINE ACTION (dans cet ordre)

1. **Terminer l'option A — POC (3 animations)**, toujours non commencé :
   - `poc/back-squat.gif` → départ cadré trop serré (torse seul) : refaire en pied,
     corps entier jusqu'aux semelles, barre complète dans le cadre.
   - `poc/hip-thrust-barre.gif` → artefacts, planche du banc coupée : refaire avec banc
     et barre entièrement visibles, épaules contre le banc, hanches basses.
   - `poc/souleve-de-terre-roumain.gif` → tête et pieds coupés + salissures : refaire
     debout, barre au contact des cuisses, corps entier dans le cadre.
   - Puis chaîner M et B depuis chaque nouvelle position A.
2. **LOT 6** : `e5532fe8fa9b40e9.gif` → **6 soulevés de terre**.
3. Puis `f1a40f2c8c8502db.gif` (5 mollets), `e169d622c8002b38.gif` (5 élévations latérales),
   puis les 43 autres fichiers dupliqués.
4. **Phase 11** : intégration dans l'application, après validation complète des lots.

---

## 7. DÉCISIONS EN ATTENTE (ne pas trancher seul)

1. **`developpe-incline-halteres`** — le 7ᵉ (et dernier) exercice du fichier
   `8de6e89e5395700c.gif`. Son nom ne précise **ni angle ni prise** : impossible de
   deviner. Demander à l'utilisateur : banc 30° ? 45° ? prise classique ou neutre ?
2. **Circuits du LOT 3** — le circuit gainage (planche → latéral → bird dog) et le circuit
   abdominaux (crunch → relevés de jambes → gainage) comportent 3 mouvements enchaînés,
   mais l'animation n'en déroule qu'un seul. Faut-il une animation composite en plusieurs
   phases, ou un découpage ?

---

## 8. RÉSERVES CONNUES (honnêtes)

- **POC** : cadrages coupés et artefacts sur 3 animations (voir § 6.1).
- **Circuit gainage / circuit abdominaux** : une seule position animée sur trois (§ 7.2).
- **Artefacts résiduels** dans les lots 1 et 3 (bavures au-dessus des tapis).
- **Cadrages hétérogènes** : la largeur des images varie d'un lot à l'autre.
- **LOT 4** : mouvements sur banc, donc pas de tapis noir au sol ; développé plat montré
  en prise classique ; léger écart de cadrage entre les trois mouvements.
- Pour afficher un GIF multi-positions à l'écran, toujours passer par
  `convert x.gif -coalesce` (frames partiellement optimisées).

---

## 9. DOCUMENTS ET LIENS

**Documents livrés (dans le dépôt, branche `arena/fbb1ddb2-…`)**

- PDF « nouveaux GIF » (7 pages) — LOT 4 + LOT 5 + corrections :
  `yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf`
- PDF bilan complet du chantier (14 pages) :
  `yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf`
- Scripts de régénération des PDF :
  `yanis-fitness-evolution/scripts/build-nouveaux-gifs-pdf.py`
  et `scripts/build-bilan-pdf.py` (dépendance : `reportlab`)

**Téléchargement direct** (dépôt public, remplacer le nom de fichier au besoin) :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/BILAN-NOUVEAUX-GIFS.pdf
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/BILAN-VISUEL-ANIMATIONS.pdf
```

**Onglet du dépôt avec tous les GIF** :

```
https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/tree/arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations
```

**Fichiers de suivi à tenir à jour** : `animations/SUIVI.md`, `animations/INVENTAIRE.md`.

---

## 10. PHRASE DE REPRISE POUR LE NOUVEAU CHAT

> Reprends le chantier « reconstruction des animations » de JARVIS Fitness.
> Dépôt `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`, branche
> `arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap`, dernier commit `67d6751`.
> Lis `PASSATION-ANIMATIONS.md` et `yanis-fitness-evolution/animations/SUIVI.md`,
> mets à jour la branche locale depuis origin, puis enchaîne sur la prochaine action :
> les 3 reprises du POC (back squat, hip thrust, soulevé de terre roumain), puis le LOT 6
> (6 soulevés de terre du fichier e5532fe8fa9b40e9.gif). Ne tranche pas seul les deux
> décisions en attente (§ 7).
