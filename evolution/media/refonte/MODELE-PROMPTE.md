# Modele de prompte — refonte des GIF d'apres la photo de reference

Photo de reference : `Screenshot_20260905_122043_Facebook(1).jpg`, a la racine du
depot (deposee par l'utilisateur le 24 septembre 2026, commit `afbfc461`).
C'est l'image de style : elle est TOUJOURS passee en entree du modele.

## La trame

Le texte entre `<` et `>` est remplace pour chaque mouvement.

    A WIDE LANDSCAPE demonstration sheet, 16:9, wider than tall: two horizontal
    bands of equal height, each band divided into four panels of equal width, so
    eight panels in total, separated by thin light-grey lines. TOP BAND, all
    four panels show the same MAN: panel 1 and panel 3 show the <POSITION A>,
    panel 2 and panel 4 show the <POSITION B> (panels 3 and 4 repeat panels 1
    and 2). BOTTOM BAND, all four panels show the same WOMAN: panel 1 and panel 3
    the <POSITION A>, panel 2 and panel 4 the <POSITION B>.

    Exactly one athlete per panel, entirely inside its own panel, with an empty
    margin of at least 12 percent of the panel height above the head and below
    the feet, and empty space at the sides.

    Style of the reference photo in all eight panels: <STYLE>.
    The man: <HOMME>. The woman: <FEMME>.

    <EXERCICE>, <POSITION A>. <POSITION B>.
    <CAMERA>, identical in all eight panels, same framing, same athlete scale,
    same equipment.

    Lime green on <MUSCLES> only; everything else stays white.
    No text, no labels, no numbers, no arrows, no logo, no watermark.

## Blocs constants

`<STYLE>` — glossy white-grey 3D anatomical muscle figure, smooth porcelain/clay
material, strongly defined muscles, dark charcoal studio background with soft top
lighting, a subtle darker floor, soft contact shadow, muscles worked highlighted
in bright lime green.

`<HOMME>` — shirtless, muscular, <TENUE HOMME>, short cropped hair, a sculpted
realistic face with eyes, nose and lips in the same glossy white material.

`<FEMME>` — athletic toned feminine build, <TENUE FEMME>, hair in a high
ponytail, a sculpted realistic face with eyes, nose and lips in the same glossy
white material.

`<CAMERA>` — seen from a three-quarter front view (camera about 25 degrees to the
athlete's right).

Variantes de tenue : salle → `black shorts, black sneakers` /
`black sports bra, black fitted shorts, black sneakers` ; piscine →
`black swim shorts` / `black one-piece sports swimsuit` ; sol → idem salle avec
`on a thin dark exercise mat`.

Piscine, remplacer le fond : `The scene is a SWIMMING POOL: the athlete stands in
chest-deep water, the water surface cutting across the chest in every panel and
rendered as a light blue translucent band with a light foam line, the submerged
part of the body seen slightly through the water, a dark pool wall and a lane
rope in the background, water droplets and a small splash in the air.`

## Ce que le modele fait, constate le 24 septembre 2026

* Canvas : il sort du 1376 x 768 (paysage) quand le prompte dit « wide landscape
  16:9 ». Sans ces mots, il est sorti en 768 x 1374 (portrait) pour les deux
  planches `pilote-montees-de-genoux` et `pilote-aqua-jogging`, inutilisables
  telles quelles (cases de 192 x 687, personnage touchant les bords).
* Il ne tient JAMAIS la grille 2 x 2 demandee : il dessine 2 rangees x 4
  colonnes. On en profite : les colonnes 0 et 1 portent les deux positions, les
  colonnes 2 et 3 les repetent. On ne garde que 0 et 1.
* Il dessine un filet clair autour de chaque case et tout autour de l'image.
  `planche-style.py --check` les efface avant de mesurer, sinon le filet est pris
  pour le personnage.
* Demander 12 % de marge au-dessus de la tete et sous les pieds : sans cette
  consigne, le personnage touche le bas de sa case (constate sur
  `test-a-curl-marteau`).

## Controles avant de produire

    .cache/pyvenv/bin/python evolution/media/tools/planche-style.py --check <planche.png>

Attendu : `personnages=1` sur les huit cases, aucun `REFAIRE`, `paire dupliquee`
pour les quatre comparaisons, et des tailles de position voisines d'une case a
l'autre (une difference de plus de 20 % trahit un changement d'echelle du modele).

## Production

    .cache/pyvenv/bin/python evolution/media/tools/planche-style.py \
        --out evolution/media/refonte/gif <planche.png> ...

Sorties : `<nom>-yanis.gif` et `<nom>-emilie.gif`, 246 x 440 (rapport de la photo
de reference) ou 440 x 246 pour un mouvement allonge, 2 images, 500 ms, boucle
infinie, environ 50 Ko. Les deux images d'un GIF partagent la meme fenetre de
cadrage : aucune saccade.
