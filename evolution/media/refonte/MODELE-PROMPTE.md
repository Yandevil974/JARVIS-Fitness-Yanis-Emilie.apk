# Modele de prompte — refonte complete des visuels

> **v5 (en vigueur)** : on ne dessine plus le personnage, on RETOUCHE. Maitre Yanis =
> votre photo avec fond de salle + visage (`modele/yanis-maitre.png`) ; maitre Emilie =
> retouche du maitre Yanis ; chaque position = retouche du maitre, prompte « Edit this image.
> Keep EVERYTHING identical ... Change ONLY the arms ». Ecrire le geste en termes tres
> concrets (« RAISES BOTH ARMS ... HORIZONTAL ... T shape », « dumbbell held VERTICALLY ...
> must NOT be horizontal ») sinon la retouche ne change que la couleur.
> GIF : `tools/images-to-gif.py SORTIE.gif POS1.png POS2.png`.
>
> **v4 (abandonnee)** : UNE image par modele et par mouvement, 16:9, **2 cases** cote a cote
> (position 1 / position 2), personnage a ~80 % de la hauteur, la photo de reference donnee
> comme « exact character model » (« keep his body mass and proportions EXACTLY; do not make
> him slimmer »), salle de sport **sombre** (murs anthracite, sol caoutchouc, racks, spots
> chauds). Fichiers : `planches/v4/<mouvement>-yanis.png` et `-emilie.png`. Production :
> `planche-style.py --grid 1x2 --fenetre scene --out evolution/media/refonte/gif planches/v4/*.png`.
> La trame 2 x 4 ci-dessous (v3) est abandonnee : 8 petites cases = personnages trop petits,
> donc de moins en moins muscles.


## Les deux images de reference

| Image | Role |
|---|---|
| `Screenshot_20260905_122043_Facebook(1).jpg` (racine du depot) | Le **style et la physionomie** : personnage en matiere blanche brillante, **tres fortement muscle**, fond de studio sombre. |
| `evolution/media/refonte/reference/curl-marteau-reference.jpg` | Exemple de **dessin technique** : quand l'utilisateur en fournit un, il donne le mouvement, jamais le style. |

## Ordre de l'utilisateur

> « Ton personnage est de moins en moins muscle. Garde la meme physionomie. Et rajoute un decors de salle. Recommence le tout. »

Trois regles, non negociables :

1. **Meme physionomie partout** : celle de la photo, c'est-a-dire TRES muscle (pectoraux epais, larges epaules et dos, bras pleins, cuisses fortes, anatomie tres lisible). Le modele a tendance a degrader la masse d'un lot a l'autre : les memes mots sont donc recopiees a l'identique dans CHAQUE prompte.
2. **Decor de salle** pour tout mouvement au sol ou en salle : veritable salle de musculation, pas un studio vide. Pour la piscine, le decor reste le bassin.
3. **Tout recommence** : les planches produites avant cette consigne sont refaites.

## La trame

Le texte entre `<` et `>` est remplace pour chaque mouvement. Tout le reste est
recopie **mot pour mot** d'un mouvement a l'autre.

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

    <STYLE>.

    <DECOR>.

    The man: <HOMME>. The woman: <FEMME>.

    <EXERCICE>, <POSITION A>. <POSITION B>. Seen from a three-quarter front view
    with the SAME camera, the SAME framing, the SAME equipment and the SAME
    athlete scale in all eight panels.

    Lime green on <MUSCLES> only; everything else stays white. No text, no
    labels, no numbers, no arrows, no logo, no watermark.

## Blocs constants (a recopier tels quels)

`<STYLE>` — glossy white-grey 3D anatomical muscle figure, smooth porcelain/clay
material, strongly defined muscles, soft contact shadow, muscles worked
highlighted in bright lime green. **Both athletes have the SAME very heavily
muscled physique as the reference photo: a thick chest, broad shoulders and a
wide back, full and rounded arms, thick legs, very low body fat, every muscle
group clearly visible — never a slim, average or slightly toned body.**

`<DECOR>` (salle / sol) — The background of every panel is a real GYM: a dark
rubber floor, a wall of black weight plates and dumbbell racks behind, a power
rack and a bench press station visible in soft focus further back, a mirrored
wall, soft ceiling lighting, and a few blurred pieces of equipment. Never an
empty studio, never a plain flat background, never a white background.

`<DECOR>` (piscine) — The scene is a SWIMMING POOL: the athlete stands in
chest-deep water, the water surface cutting across the chest in every panel and
rendered as a light blue translucent band with a light foam line, the submerged
part of the body seen slightly through the water, a dark pool wall and a lane
rope in the background, water droplets and a small splash in the air.

`<HOMME>` — shirtless, very heavily muscled, black shorts, black sneakers, short
cropped hair, a sculpted realistic face with eyes, nose and lips in the same
glossy white material.

`<FEMME>` — athletic, toned and clearly feminine build with the same strongly
defined musculature, black sports bra, black fitted shorts, black sneakers, hair
in a high ponytail, a sculpted realistic face with eyes, nose and lips in the
same glossy white material.

## Precision du mouvement : tout decompter

L'utilisateur verifie les details articulaires : il a refuse le premier lot
temoin parce que **le poignet ne tournait pas en haut du curl marteau**. Le
prompte doit decrire, pour CHAQUE position : l'articulation, le sens,
l'amplitude et l'orientation de l'objet tenu. Quand l'utilisateur fournit un
dessin technique, on lui donne le mouvement et on ecrit :

    The exercise and its two positions are EXACTLY those of the second image:
    same posture, same arm path, same grip, same wrist orientation at the bottom
    and at the top. Reproduce them in the style of the first image, never in the
    line-drawing style of the second.

## Ce que le modele fait, constate

* Canvas : **il faut ecrire « WIDE LANDSCAPE 16:9 »**. Sans ces mots il sort du
  768 x 1374 (portrait), inutilisable.
* Il ne tient **jamais** la grille 2 x 2 : il dessine **2 rangees x 4 colonnes**.
  On en profite : colonnes 0 et 1 = les deux positions, colonnes 2 et 3 les
  repetent. On ne garde que 0 et 1.
* Il dessine un **filet clair** autour de chaque case et de l'image :
  `planche-style.py` l'efface avant de mesurer.
* Il faut demander **12 % de marge** au-dessus de la tete et sous les pieds,
  sinon le personnage touche le bas de sa case.
* Sans rappel, la masse musculaire diminue d'un lot a l'autre : d'ou le bloc
  `<STYLE>` recopie a l'identique.

## Espace de travail : tout pousser tout de suite

L'espace de travail est **reinitialise a chaque message** (tout ce qui n'est pas
pousse sur GitHub disparait, `.cache` compris). Donc : generer les planches,
**les commiter et les pousser immediatement**, puis produire les GIF. En cas de
reinitialisation :

    git fetch -q origin arena/01a0d3f4-jarvis-fitness-yanis-emilie-ap
    git reset -q --hard FETCH_HEAD
    bash evolution/media/setup-tools.sh        # en tache de fond

## Controles et production

    # controle : 1 personnage par case, marges, paires dupliquees
    .cache/pyvenv/bin/python evolution/media/tools/planche-style.py --check <planche.png>

    # production : <nom>-yanis.gif et <nom>-emilie.gif
    .cache/pyvenv/bin/python evolution/media/tools/planche-style.py \
        --out evolution/media/refonte/gif <planche.png> ...

    # piscine : la surface de l'eau a la meme luminosite que le corps,
    # la detection est impossible -> fenetre centree sur la case
    .cache/pyvenv/bin/python evolution/media/tools/planche-style.py --fenetre case \
        --out evolution/media/refonte/gif <planche-piscine.png>

Sortie : 2 images, 500 ms, boucle infinie. Cadre **246 x 440** (rapport de la
photo de reference), elargi automatiquement a 308 x 440 ou 374 x 440 quand le
personnage ne tient pas, sans jamais le couper ni le deformer. Les deux modeles
d'un meme mouvement partagent le meme cadre.
