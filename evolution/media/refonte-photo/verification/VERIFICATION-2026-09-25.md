# Vérification des mouvements déjà créés — 25 septembre 2026

**Reprise de session** (`arena/01a0d6f5-…`, contenu de `arena/01a0d51c-…` récupéré) : avant de
produire quoi que ce soit, les GIF déjà comptés « valides » ont été **mesurés puis relus
case par case**, conformément à la règle « jamais d'acceptation à l'œil sur une vignette ».

## 1. Ce qui a été contrôlé, et comment

| Outil | Rôle | Résultat |
|---|---|---|
| `evolution/media/tools/verif-gifs.py` (nouveau) | mesure les 119 GIF livrés : signature GIF89a, 2 images, 500 ms, boucle, hauteur 440, identifiant réel du plan, athlète du plan, vert présent dans les deux cases, différence entre les deux cases, quasi-doubles entre mouvements, zone du vert vs muscle cible | 119 contrôlés : structure 100 % conforme (2 images / 500 ms / 440 px / boucle infinie), **0 quasi-double**, **0 fichier orphelin déclaré valide** (2 GIF racine orphelins : `curl-marteau-assis-femme.gif`, `elevations-laterales-assises-homme.gif`, hors plan), 26 signalements « vert absent d'une case » au masque strict |
| `evolution/media/tools/feuilles-verif.py` (nouveau) | imprime les DEUX cases de chaque GIF en pleine définition, 3 mouvements par feuille | 13 feuilles de relecture produites (`verification/verif-*.jpg`) |
| Lecture humaine | chaque feuille relue case par case contre la prescription de `production/prescriptions.json` | **38 GIF livrés relus** (26 signalés + 3 zone + 9 tirés au sort) + les 10 du lot 17 |

Le masque « vert » a été recalibré : sur tissu noir le vert lime devient olive
(ex. `114,122,65`) ; le masque strict du départ criait « vert absent » à tort. Avec le masque
tolérant (hors bords du décor, plantes exclues) : **21 GIF ont vraiment une case sans vert**.

## 2. Verdicts de relecture (38 GIF livrés)

**Conformes au geste prescrit : 34.** Dont les 26 signalés « vert absent » : le geste était
juste, c'est le surlignage qui manque sur une case (voir §4). Exemples relus : abductions
assise/élastique/poulie (jambe **sur le côté**, câble **horizontal** de poulie basse),
clamshell, kickback poulie (jambe **en arrière**), fentes avant/arrière/bulgares, glute bridge,
hack squat, mollets assis, rowing assis unilatéral (**un seul bras** du début à la fin, poulie
basse), torsion allongée genoux, cobra doux, étirement contre le mur, respiration
diaphragmatique, curl barre (pronation), mountain climbers, crunch, relevés de jambes,
step-up haut, rowing barre buste penché (pronation), échauffement mise en route,
développés militaires haltères assis, back extension 45° prise snatch, back squat charge
modérée, leg curl pieds pointés, leg curl machine femme.

**Refusés — le geste montré n'était pas le geste prescrit : 4.** Tous refaits au lot 17,
relus et acceptés (voir `production/a-refaire.json`, `correctionsUtilisateur`) :

| Mouvement | Défaut mesuré à la relecture | Correction livrée |
|---|---|---|
| Développé couché — test 1RM (homme) | athlète **assis**, poussée au-dessus de la tête : un développé militaire assis | allongé à plat, prise pronation mains sur la barre, lot 17 |
| Leg curl allongé, 1 1/4 en haut (homme) | cases **inversées** (gauche = fléchi = fin) + banc incliné | gauche tendu → droite talons aux fesses, lot 17 |
| Dead bug avec rotation (femme) | départ **pieds au sol**, pas de position dead bug, rotation absente | table-top + extension opposée, vert sur la taille, lot 17 |
| Grenouille (plantes jointes) (homme) | ni case ne montrait la prescription (« assis, plantes jointes, genoux écartés ») : flexion debout puis grenouille sur avant-bras | assis, plantes jointes, genoux poussés au sol, lot 17 |

**Faux positifs du contrôle automatique : 3** (cobra doux, étirement contre le mur,
respiration diaphragmatique) : la zone du vert semblait contredire le code muscle du plan,
la relecture montre que le code muscle du plan rattache ces étirements à un autre slug ;
vert cohérent avec l'étirement montré. Aucune suite.

**Question ouverte, non bloquante : 1** — `back-extension-45-prise-snatch|homme` : aucune
barre ni prise large n'apparaît (bras croisés). Le geste « back extension 45° » est juste,
le qualificatif « prise snatch » n'est pas représenté. À trancher avec l'utilisateur.

## 3. Lot 17 (10 planches produites ce tour, relues case par case)

Acceptées 8 : elevations-laterales-incline-30-face-au-banc (vert désormais sur les
**deltoïdes**, pas la nuque), developpe-couche-test-1rm, leg-curl-allonge-1-1-4-en-haut,
grenouille-plantes-jointes, safety-bar-squat-ou-barre-classique, dead-bug-avec-rotation,
step-up-sur-banc-hauteur-du-genou, rowing-barre-buste-penche.
Refusées 2 (2ᵉ refus, non comptées, GIF supprimés) : back-extension-horizontal (banc encore
incliné, bras pendant au départ), triceps-extensions-halteres-banc-plat (athlète assis au
lieu d'allongé à plat). Feuilles : `verification/lot17-01..04.jpg`.

## 4. Style : le vert manque sur une case (21 GIF)

`production/style-a-reprendre.json` liste, mesuré au masque tolérant, les 21 GIF livrés dont
une case (presque toujours la case de départ) n'a **aucun** surlignage : la famille livrée
colore le muscle cible dans les deux cases. Ce n'est pas une erreur de geste : ces 21
mouvements restent valides, le surlignage sera repris dans un lot dédié (régénération des
planches concernées), sans toucher aux gestes.
Autre artefact noté : `mountain-climbers|homme` montre des bandes grises de recalage en haut
des cases — à reprendre dans le même lot style.

## 5. Couverture et suite

Relus ce tour : **48 couples** (38 livrés + 10 lot 17). Restent à relire : **75** des 123
valides (feuilles de 3, mêmes outils, aucun raccourci). Production : **123 / 331**,
restants 208 (musculation 126, protocoles piscine 40, tabata au sol 27, piscine guides 9,
aqua tabata 6) ; 2 planches en attente de 3ᵉ essai (`production/a-refaire.json`).
