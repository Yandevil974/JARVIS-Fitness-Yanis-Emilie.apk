# File des générations d'images — reprise modules 1 et 2 (16/10/26)

Plafond plateforme : 10 images générées par tour. Cette file ordonne le reste du
travail ; chaque entrée = 1 appel generate_image. Cocher au fur et à mesure.

## Module 1 (urgent)
- [x] P2-vide, P3-vide : plaques de fond générées (decor-E1-elliptique-P2/P3-vide-v1)
- [x] scapulaire M : pose-M-micourse-v5 (point médian, scène identique) → GIF scapulaire fluide v1 CONFORME (mesuré)
- [ ] POSE 3 PROPRE : le patch plaque P3 a cassé la poignée loin (le masque « crochet »
      mordait sur la barre noire) → abandon du patch. Nouvelle voie : génération
      text-to-image (sans image source) « phase avant + machine à 2 poignées »,
      puis SA plaque vide (édition), puis matage différence + composite
      (composite-elliptique.py v3) sur decor-E1-elliptique-vide-v1.
      = 2 générations (P3-t2i, P3-t2i-vide)
- [ ] GIF elliptique fluide = composite P1, P2, P3-propre (loop 0,1,2,1 + flous)

## Module 2 — lot 1 (clés A/M/B : 01 et 02 prêtes)
- [x] 01 : GIF fluide v2 CONFORME-mesuré (mer 2,2-2,7 % = acceptable, contrôle visuel mer présente)
- [x] 03 : M-v3 ok (scène identique) → GIF fluide v2 CONFORME
- [ ] 02 : M-v3 (dérive caméra) et M-v4 (torse trop doré, colonne décalée) REJETÉS
      → réessayer M : édition de A-v2, delta moyen, verrou « colonne au même pixel,
      torse : pectoraux dorés seuls, abdominaux blanc argent comme la source »

## Module 2 — lots 2 à 8 (19 visuels × 3 clés A, M, B)
Lot 2 : suspension-barre · torsion-allongee · mains-croisees-dos
Lot 3 : bras-contre-poitrine · bras-devant-main-tiree · bras-derriere
Lot 4 : coude-dessus-tete · main-dans-le-dos · flechisseurs
Lot 5 : extenseurs · cobra · pigeon-assis
Lot 6 : talon-fesse-debout · allonge-cote · flexion-avant
Lot 7 : jambe-tendue-pliee · grenouille · contre-le-mur
Lot 8 : mollet-escalier
  A = génération complète (références athlète + décor E1) ; M et B = éditions de A
  (delta moyen/grand décrit en entier : l'éditeur suit, cf. lot1 M/B réussis).

## Après chaque lot
1. inspection visuelle de chaque clé (read_file) ;
2. mesure verifier-pose.py (sol_dom 219-253, saturation 22-47, lime ~0) ;
3. faire-boucle-fluide.py (loop 0,1,2,1) → GIF 440x246 ;
4. media-add.py + sources (STRETCH_IMAGES / visuals-gifs.js) en fin de module ;
5. build-galerie.py → page de validation ; commit + push.
