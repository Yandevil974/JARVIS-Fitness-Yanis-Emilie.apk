# File des générations d'images — reprise modules 1 et 2 (16/10/26)

Plafond plateforme : 10 images générées par tour. Cette file ordonne le reste du
travail ; chaque entrée = 1 appel generate_image. Cocher au fur et à mesure.

## Module 1 (urgent)
- [ ] P2-vide : édition de pose-02-final.png « retirer athlète + machine » (plaque de fond scène P2)
- [ ] P3-vide : édition de pose-03-propre.png « retirer athlète + machine » (plaque de fond scène P3)
      → puis matte par différence + composite sur decor-E1-elliptique-vide-v1
      (composite-elliptique.py v3 à repasser en matage différence) ; le crochet
      résiduel de pose-03-propre est recopié depuis P3-vide (fond vrai, sans bavure).
- [ ] scapulaire M : édition de pose-02-final.png « poitrine descendue à mi-course »
      (delta moyen = accepté par l'éditeur, cf. lot1 M)

## Module 2 — lot 1 (clés A/M/B : 01 et 02 prêtes)
- [ ] 03-balasana M : édition de 03-position-de-l-enfant-POSE.png ? non : édition de
      03-balāsana-A-v2.png « buste à mi-hauteur, bras mi-tendus » (vérifier A d'abord)

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
