# 📋 CONSIGNE À COPIER-COLLER — nouveau chat

Copier **tout le bloc ci-dessous** (entre les deux lignes) et le coller en premier message
du nouveau chat. Il est autonome : il ne suppose rien des conversations précédentes.

---

Reprends le chantier « reconstruction des animations » de JARVIS Fitness.

**Dépôt** `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`,
**branche de session** `arena/6a360b28-jarvis-fitness-yanis-emilie-ap` (c'est la seule sur
laquelle tu peux écrire ; elle contient tout l'historique du chantier).
Dernier commit de contenu : **`1257544`**.

**OUVERTURE OBLIGATOIRE :** `git fetch origin` ; si HEAD est retombé sur `ddd1fb9`,
`git reset --hard origin/arena/6a360b28-jarvis-fitness-yanis-emilie-ap`.

Lis ensuite `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
`yanis-fitness-evolution/animations/PLAN-THEMES.md`.

**À FAIRE : LOT 3 — les 2 circuits composites** (dernier reste du rattrapage de la fille) :
`circuit-gainage` (planche → gainage latéral → bird dog) puis `circuit-abdominaux`
(crunch → relevés de jambes → gainage). Les 3 mouvements déroulés à la suite dans UNE
seule animation, **1 circuit par tour** (≈ 9 images). À produire d'abord en **FEMME**
(jamais fait), référence identité `animations/REF-personnage-feminin.jpg`. Le remplacement
des fichiers HOMME (aujourd'hui version simple) seulement **après validation de la planche
par le user**.

**Ensuite, entrées jamais produites, en HOMME + FEMME :** LOT A-04 (abduction assise,
pallof press, face pull), LOT A-05 (respiration diaphragmatique, hip thrust unilatéral),
puis les 3 étapes chrono `warmup-route`, `warmup-mobilite`, `warmup-approche`.

**Reprises en attente d'accord du user** (ne JAMAIS remplacer une animation livrée sans
accord explicite) : A-02F fire hydrant M/B + squat M (3 images, sources dans
`themeA/femme/_sources/A-02F/`), A-03F abduction B (1 image, sources dans
`_sources/A-03F/`), squat HOMME (position finale pas assez basse).

**CONSIGNE À NE PAS NÉGOCIER**

1. **1 exercice = 1 animation spécifique** — jamais copier / renommer / réutiliser.
2. Ne jamais remplacer une animation livrée sans accord explicite.
    ⚠️ **Feu vert du 2026-10-07** : les corrections de GIF déjà livrés sont autorisées ;
    chaque correction reste tracée dans `SUIVI.md` (section « CORRECTIONS AUTORISÉES »).
3. Pas touche à `release/` ni à `public/media` avant validation de l'intégration.
4. Honnêteté sur les échecs et réserves. Jamais de faux 100 %.
5. **Drapeau rouge à 10 images IA = 3 exercices par tour.** Limite technique, pas un
   jugement sur les images. Rejouer une image ratée est normal : la **compter** et le dire.
6. Technique doutée → vérifier en ligne et **citer la source dans le commit**.
7. **L'œil de l'utilisateur tranche** : planche affichée pour validation.
8. Accord permanent pour committer/pousser.
9. **Lots par thème** — A échauffement → B musculation → C étirements → D cardio → E piscine.
10. **Terminer un thème entier avant de passer au suivant.**
11. **Périmètre HOMME + FEMME** — 614 animations. `themeA/` = homme, `themeA/femme/` = femme.
12. **Le sandbox se réinitialise à chaque tour : seul ce qui est dans git survit.** Toute
    référence doit être déposée par le user **sur GitHub**. Pas de pièce jointe, pas de `curl`.
13. **Terminer un lot dans le tour où il est commencé** — et **committer dès qu'un exercice
    est complet**, sans attendre la fin du lot (le LOT A-04 et 3 images du LOT R2 ont été
    perdus par un reset).
14. **Doute sur la CONFIGURATION d'un mouvement → vérifier en ligne AVANT de générer**
    (YouTube, sites de fitness spécialisés, GB Performance, guides de coachs, articles de
    référence…). 1 exercice = 1 configuration **exacte et cohérente** : point d'appui,
    angle des articulations, hauteur du bassin, sens du mouvement, amplitude. **La source
    est citée dans le message de commit** (règle 6 étendue : c'est une exigence, pas une
    option).
15. **Le user n'a NI le visualiseur d'Arena NI les pièces jointes** (constaté le
    2026-10-07) : **tout aperçu à valider doit être déposé DANS LE DÉPÔT** (planche de
    travail, grille de contrôle, GIF) **et signalé par un LIEN GitHub** dans le message.
    « Fichier affiché » ≠ « user a vu ».

**Style** — mannequin très musclé, corps blanc argenté **mat** (jamais chromé), visage
**noir mat sans traits**, casquette blanche, short noir, baskets blanches, muscles
travaillés doré jaune-orangé. Décor : terrasse bord de mer (pierre claire, mer, palmiers,
mur blanc bas). Exception piscine intérieure pour l'aqua. Tapis noir au sol. Interdit :
salle, parquet, mur intérieur, miroir. **Les deux mannequins suivent le même code.**

**Méthode** — 3 positions chaînées (A → M → B) depuis la référence
(`Screenshot_20261005_212714_Facebook.jpg` pour l'homme,
`animations/REF-personnage-feminin.jpg` pour la femme), assemblage
`scripts/build-gif-lot.sh` (460×257, `-delay 130/110`, boucle A→M→B→M + planche 1420×265),
validation, commit + push, mise à jour `SUIVI.md` / `PLAN-THEMES.md`.
⚠️ Jamais `-layers optimize` sur la planche.

**Contrôle qualité obligatoire avant de livrer** — visuel sur chaque position ;
objectif `compare -metric RMSE` (seuil de lisibilité **0,030**) ; **format paysage**
(le générateur rend parfois du portrait, inexploitable) ; anti-doublon `md5sum`.

**ÉTAT** — 44 / 614 animations livrées. **LOT 3 FEMME** : `circuit-gainage` **LIVRÉ**
(9/9, composite, commit `f07c04d`, planche validée) ; `circuit-abdominaux` **8 / 9** (la
9ᵉ — planche haute tenue — ouvre le prochain tour). Thème A : **17 / 25 en homme,
15 / 25 en femme**.
Lots 1 et 2 du thème A rattrapés en femme. Reste : **LOT 3** (2 circuits composites),
**A-04** (3 entrées), **A-05** (2 entrées), **warmup-route / mobilite / approche** (3 entrées),
et les **reprises sous réserve** A-02F (3 images), A-03F (1 image), squat HOMME.

**RÉSERVES** — POC à réparer (3 animations) ; circuits LOT 3 encore en version simple ;
artefacts lots 1 et 3 ; LOT 4 sans tapis (mouvements sur banc) ; squat HOMME pas assez bas ;
fire hydrant M/B et squat M femme à refaire ; abduction B femme trop proche de M ;
le corps ressort parfois **brillant** au lieu d'argenté mat.

**⚠️ LIVRAISON AU USER — LE VISUALISEUR N'EST PAS DISPONIBLE (constaté le 2026-10-07).**
Le user n'a accès ni au visualiseur d'Arena ni aux pièces jointes : **tout aperçu doit être
déposé DANS LE DÉPÔT** (planche de travail + GIF) et signalé par un **lien GitHub**, en
plus du commentaire de chat. Ne jamais considérer « fichier affiché » comme « user a vu ».

---
