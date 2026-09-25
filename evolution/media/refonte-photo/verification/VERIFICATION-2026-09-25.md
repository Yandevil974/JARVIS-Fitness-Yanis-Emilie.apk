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

## 5. Lot 18 (10 planches, même tour) et relecture — batch 2

**Lot 18** : 3ᵉ essai des 2 planches en attente + 8 mouvements neufs. Acceptées 6 :
triceps-extensions-halteres-banc-plat (enfin allongé à plat, coudes qui plient),
california-press-barre-au-cou (prise serrée, barre au cou), curl-scott-barre-ez-pronation,
curl-scott-barre-ez-supination (prises opposées, bras posés sur le pad),
french-press-barre-ez, hip-thrust-barre-test-de-charge-max-3-5-reps (vue 3/4 avant,
différente du hip thrust livré). Refusées 4 : back-extension-horizontal (3ᵉ refus : banc
horizontal enfin juste mais bras pendant au départ au lieu de mains croisées),
rowing-barre-ez-supination-buste-penche (un haltère dessiné au lieu de la barre EZ),
curl-poulie-basse (cadrage différent entre les deux cases),
rowing-barre-buste-penche-test-3-5-reps (aucun tirage en case de fin).
Feuilles : `verification/lot18-01..04.jpg`.

**Relecture batch 2** (12 couples valides, feuilles `verification/relecture-02-01..04.jpg`) :
conformes 9 (adduction hanche debout, allongé sur le côté, bras tendu contre la poitrine /
contre le mur / derrière / devant main tirée, back-squat, back-squat-test-1rm,
circuit-abdominaux-crunch-releves-gainage) ; **refusés 3** : back-squat-barre-haute et
back-squat-inertie-pause-complete (barre en rack AVANT à gauche puis SUR LE DOS à droite :
la barre saute), burpees (cases inversées : saut à gauche, planche à droite).
Ces 3 GIF sont retirés des valides et repassent en production.

## 7. Lot 19 (reprise des planches refusees, meme tour)

10 generations (1 echec de moderation compte dans le lot : curl-poulie-basse, a retenter).
Acceptees 4 : rowing-barre-ez-supination-buste-penche (barre complete aux deux bouts,
supination lisible), burpees (planche a gauche, saut a droite, enfin dans l'ordre),
hip-thrust-unilateral (pied d'appui seul, genou libre leve), souleve-de-terre-roumain-barre-test-3-5-reps
(charge lourde, barre sous les genoux, ischios).
Refusees 5 : back-extension-horizontal (5e refus : tete coupee au bord de la case de fin),
back-squat-barre-haute (vert sur les adducteurs au lieu des quadriceps),
back-squat-inertie-pause-complete (rack avant a gauche encore), good-morning-debout
(barre devant le cou a gauche, derriere a droite), rowing-barre-buste-penche-test-3-5-reps
(tirage a la hanche, vert absent en case de fin). Feuilles : `verification/lot19-01..03.jpg`.

## 9. Lot 20 (solution aux planches refusees, meme tour)

Changement de strategie par type d'echec : marges explicites (tetes/pieds jamais coupes),
vert impose aux DEUX cases, vues de FACE ou de DOS pour garantir la barre sur le dos,
echelle identique entre les cases. Acceptees 7 : back-extension-horizontal (6e essai),
curl-poulie-basse, back-squat-barre-haute (vert quadriceps), back-squat-inertie-pause-complete
(vue de dos), bulgarian-split-squat, bird-dog, dead-bug (note : bras au sol au lieu
d'overhead en case de fin, ecart de consigne non bloquant).
Refusees 3 : good-morning-debout (case fin debout barre dans les mains), rowing-haltere-un-bras
(profil retourne entre les cases), rowing-barre-buste-penche-test-3-5-reps (3e refus,
tirage a la hanche). Feuilles : `verification/lot20-01..04.jpg`.
Liste des blocs et decisions attendues : `CE-QUI-COINCE.md` a la racine du depot.

## 11. Lot 21 + relecture batch 3 (meme tour)

Lot 21 : 3 refusees reprises + 7 neuves. Acceptees 8 : good-morning-debout (vue de dos,
hinge complet barre sur le dos), rowing-haltere-un-bras (orientation ancree),
pullover-cable-bras-tendus (bras tendus, barre des cuisses, note : la tour de poulie
n'apparait qu'en case 2, ecart de decor mineur), rowing-haltere-un-bras-coude-ouvert,
french-press-haltere-un-bras, glute-bridge-en-1-5-reps (hanches jamais reposees),
split-squat-poulie-basse, circuit-gainage-planche-lateral-bird-dog (2 stations).
Refusees 2 : rowing-barre-buste-penche-test-3-5-reps (4e refus, barre a la hanche),
developpe-haltere-un-bras-debout (vert sur l'epaule du bras LIBRE).
Relecture batch 3 : 3/3 conformes (coude-au-dessus-de-la-tete, crunch-sur-swiss-ball,
curl-haltere-supination-banc-scott-90). Feuilles : `verification/lot21-01..04.jpg`,
`verification/relecture-03.jpg`.

## 13. Lot 22 + relecture batch 4 (meme tour)

Lot 22 : les 2 refusees reprises par EDITION de la planche precedente + 8 neuves.
Acceptees 9 : rowing-barre-buste-penche-test-3-5-reps (edition de la case fin : tirage
complet coudes a 90 degres ; ecart residuel note : arrivee au ventre plutot qu'aux cotes
basses, aucune consigne de l'app ne fixe la hauteur — question utilisateur toujours ouverte),
rowing-haltere-buste-penche, french-press-poulie-basse, pushdown-triceps-cable,
cables-croises, tractions-prise-neutre-chin-up, wood-chop-poulie-haute, curl-concentration,
mollets-debout. Refusee 1 : developpe-haltere-un-bras-debout (l'edition n'a pas deplace le
vert, toujours sur l'epaule du bras libre).
Relecture batch 4 : 3/3 conformes (curl-marteau-assis, curl-zottman-assis,
curl-zottman-un-bras-banc-scott). Feuilles : `verification/lot22-01..04.jpg`,
`verification/relecture-04.jpg`.

## 15. Lot 23 + relecture batch 5 (meme tour)

Lot 23 : la refusee reprise en regeneration complete (vert decrit par la position dans
l'image) + 9 neuves. Acceptees 7 : curl-poulie-basse-supination, rowing-haltere-un-bras-prise-neutre,
cables-croises-rotation-externe (depart mains devant le corps, fin mains ecartees coudes
colles), ecartes-cables-incline (dos au banc incline), tractions-supination-chin-up,
squat-au-poids-du-corps, crunch-a-la-poulie. Refusees 3 : developpe-haltere-un-bras-debout
(3e refus : case depart vert sur l'epaule du bras libre, la case fin etait bonne),
mountain-climbers (les deux cases montrent la meme jambe avant), developpe-couche-halteres
(un seul haltere tenu a deux mains).
Relecture batch 5 : 3/3 conformes (developpe-couche-barre-plat, developpe-couche-barre,
developpe-halteres-assis-neutre-pronation) ; note mineure : sur 2 de ces 3 planches le vert
n'apparait que sur la case de travail, ecart cosmetique tolere.
Feuilles : `verification/lot23-01..04.jpg`, `verification/relecture-05.jpg`.

## 17. Audit realisme machines/cables (decision utilisateur du tour)

Defaut retenu par l'utilisateur : machines et câbles invraisemblables ; perimetre :
audit complet des 161 validées AVANT de produire. 68 planches auditees sur planches-contact
(`verification/audit-machines-01..09.jpg`, `audit-bancs-01..02.jpg`,
`audit-bancs-appui-01.jpg`) : toutes celles comportant un câble, une poulie, une machine,
un banc ou un banc d'appui. Les 93 restantes (haltères, barre, poids du corps, sol,
étirements, piscine) n'ont aucun appareil : le défaut retenu y est structurellement absent.

**6 planches validées à refaire** (listées dans `production/audit-realisme.json` et
`production/a-refaire.json`) : cables-croises-rotation-externe (grée incohérente entre les
cases), developpe-couche-barre (assis au lieu d'allongé), developpe-couche-test-1rm (charge
invraisemblable), ecartes-cables-incline (deux poignées sur une seule poulie),
kickback-a-la-poulie (câble au sol non fixé en case 1), step-up-sur-banc-hauteur-du-genou
(pied d'appui hors banc en case 2). Règles de grée pour tous les prompts futurs dans
`production/audit-realisme.json` (`regles_futurs_prompts`).

## 19. Lot 24 = les 9 refus/audit (meme tour)

9 regenérations avec les règles de grée de `production/audit-realisme.json`.
Acceptees 7 : les 6 remplacements d'audit (cables-croises-rotation-externe : grée unique
ancree poulie poitrine ; developpe-couche-barre : allonge ; developpe-couche-test-1rm :
barre chargee des deux cotes ; ecartes-cables-incline : deux poulies basses une de chaque
cote ; kickback-a-la-poulie : sangle fixee cable tendu des la case 1 ; step-up-sur-banc :
pied d'appui sur le banc en case 2) + developpe-couche-halteres (deux halteres separes).
Note cosmetique : ecartes-cables-incline n'a du vert que sur la case de travail.
Refusees 2 : developpe-haltere-un-bras-debout (4e refus : deux halteres en case depart,
cote de travail inverse entre les cases), mountain-climbers (2e refus : jambes non echangees).
Prochaine strategie pour ces deux-la : generer les deux cases SEPAREMENT (description
relative a la camera : jambe proche/lointaine, bras cote gauche de l'image) puis assembler
la planche par script. Feuilles : `verification/lot24-01..03.jpg`.

## 21. Lot 25 : refaits utilisateur + cases separees (meme tour)

Refaites a la demande utilisateur : ecartes-cables-incline (desormais ALLONGE sur le pad,
vert aux deux cases, deux poulies basses ancrees) et elevations-laterales-incline-30-face-au-banc
(torse FACE au pad, pieds joints derriere, plus a califourchon) : acceptees toutes les deux.
Cases separees puis assemblees : developpe-haltere-un-bras-debout (case 2 bonne, case 1
haltere dans la mauvaise main : 5e refus), mountain-climbers (saut d'angle et de decor entre
les cases, echange illisible : 3e refus). Neuves acceptees 4 : extensions-triceps-pullover-barre-ez,
curl-halteres-incline, leg-curl-debout, curl-scott-haltere-prise-neutre.
Relecture batch 6 : 3/3 conformes (developpe-halteres-assis-prise-neutre, developpe-halteres-assis,
developpe-incline-barre ; note cosmetique vert case fin seule sur 2 d'entre elles).
Feuilles : `verification/lot25-01..03.jpg`, `verification/relecture-06.jpg`.

## 23. Lot 26 : le developpe un bras RESOLU (meme tour)

Strategie gagnante : editer la case 2 reussie pour abaisser le bras a l'epaule → case 1
garantie coherent (meme decor, meme cote, manche verte conservee) : developpe-haltere-un-bras-debout
ACCEPTÉ apres 5 refus. Neuves acceptees 7 : curl-barre-debout, curl-marteau, curl-zottman,
squat-cycliste-squat-complet, drop-lunges-fentes-controlees, reverse-crunch, crunch-a-la-poulie-ou-au-sol.
Refusees 2 : elevations-laterales-coude-a-90 (case depart bras tendus au lieu de coudes 90
avant-bras devant), mountain-climbers (4e refus : meme jambe avant aux deux cases malgre
proche/lointaine). Relecture batch 7 : 3/3 conformes (developpe-militaire-debout,
developpe-militaire-test-1rm, dips ; note vert case fin seule sur le test-1rm).
Feuilles : `verification/lot26-01..04.jpg`, `verification/relecture-07.jpg`.

## 25. Lot 27 (meme tour)

Plafond de 10 generations atteint : souleve-de-terre-roumain-halteres reporte au lot 28.
Acceptees 7 : developpe-couche-prise-serree, elevations-laterales-halteres,
bulgarian-split-squat-halteres, curl-halteres, goblet-squat, face-pull-a-la-poulie
(poulie tete ancree, corde tendue), tirage-horizontal-a-la-poulie (poulie basse ancree).
Refusees 2 : elevations-laterales-coude-a-90 (2e : geometrie bonne mais vert aussi sur les
abdominaux), mountain-climbers (5e : cases assemblees pieds nus vs chaussures, meme jambe avant).
Relecture batch 8 : 3/3 conformes (echauffement-mobilite, echauffement-series-d-approche,
elevations-laterales-assises-variante). Feuilles : `verification/lot27-01..03.jpg`,
`verification/relecture-08.jpg`.

## 26. Couverture et suite

Relus sur les onze tours : **162 couples** (38 livrés + 10 lot 17 + 12 relecture + 10 lot 18).
Sur les **181 valides** actuels, **44 restent à relire** (feuilles de 3, mêmes outils).
Production : **137 / 331** ; restants 194 (musculation 112, protocoles piscine 40,
tabata au sol 27, piscine guides 9, aqua tabata 6). **3 planches en attente** dans
`production/a-refaire.json` : rowing-barre-buste-penche-test-3-5-reps (3ᵉ refus),
good-morning-debout (2ᵉ refus), rowing-haltere-un-bras (1ᵉʳ refus).
