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

## 27. Lot 28 (meme tour)

Acceptees 7 : souleve-de-terre-roumain-halteres (reformulation sobre apres blocage moderation),
developpe-couche-decline-prise-serree, ecartes-halteres et developpe-halteres-plat (vue axiale
cote tete, coherente aux deux cases), leg-extension (machine ancree), pont-fessier-au-sol-activation,
pompes-inclinees-mains-surelevees. Refusees 2 : elevations-laterales-coude-a-90 (3e : vert enfin
limite aux deltoïdes mais textes START/END incrustes et 4 halteres en case fin),
mountain-climbers (6e : l'edition ancree sur les chaussures n'a pas permute les jambes).
Relecture batch 9 : 3/3 conformes (elevations-laterales-assises, elevations-laterales-lean-away,
elliptique-fractionne). Feuilles : `verification/lot28-01..03.jpg`, `verification/relecture-09.jpg`.

## 29. Lot 29 (meme tour)

Acceptees 7 : pullover-haltere-plat, rowing-a-l-elastique, extension-triceps-a-la-poulie,
pallof-press-a-l-elastique, fire-hydrant-a-l-elastique, kickback-a-l-elastique,
mollets-debout-unilateraux. Refusees 3 : elevations-laterales-coude-a-90 (4e : plus de texte,
2 halteres, vert correct, mais case depart encore bras tendus), mountain-climbers (7e : edition
chaussures sans permutation — decision utilisateur demandee), releves-de-jambes-incline
(1er : paire de chaussures en double sous le banc en case 2).
Relecture batch 10 : 3/3 conformes (elliptique-mise-en-route, elliptique-recuperation-active,
elliptique-retour-au-calme). Feuilles : `verification/lot29-01..04.jpg`,
`verification/relecture-10.jpg`.

## 31. Lot 30 : photo de reference utilisateur (meme tour)

Photo de reference du mountain climbers fournie par l'utilisateur (pose : hanches plus hautes
que les epaules, pied plie leve sole vers l'arriere) encodee dans les prompts des deux cases.
Acceptees 6 : elevations-laterales-coude-a-90 (RESOLU par cases simples separees puis
assemblage : depart avant-bras horizontaux, fin goalpost, vert deltoïdes seul),
releves-de-jambes-incline (plus de chaussures en double), developpe-couche-plat-inertie-depuis-les-pins,
curl-halteres-incline-supination, ecartes-halteres-decline, souleve-de-terre-roumain-unilateral-haltere.
Refusees 2 : mountain-climbers (8e refus : la pose de la photo est bien la, mais les deux cases
gardent la meme jambe avant), developpe-incline-halteres (1er : un seul haltere a deux mains).
Relecture batch 11 : 3/3 conformes (etirement-dans-l-encadrement-de-porte, etirement-des-flechisseurs,
etirement-du-cobra). Feuilles : `verification/lot30b-01..03.jpg`, `verification/relecture-11.jpg`.

## 32. Couverture et suite (état lot 30)

Relus sur les quinze tours : **194 couples** dont 171 parmi les valides actuels.
Production lot 30 : **201 / 331** ; restants 130 (musculation 48, protocoles piscine 40,
tabata au sol 27, piscine guides 9, aqua tabata 6). **2 planches en attente** dans
`production/a-refaire.json` : mountain-climbers (8ᵉ refus) et developpe-incline-halteres
(1ᵉ refus).

## 33. Lot 31 : la vue de FACE résout mountain climbers (même tour)

Stratégie convenue avec l'utilisateur appliquée : mountain climbers dessiné **de face**,
caméra basse devant l'athlète — case 1 genou avant du côté GAUCHE de l'image, case 2 du
côté DROIT : la permutation de jambes devient enfin lisible. **9ᵉ refus effacé, planche
acceptée.**
Acceptées 9 : mountain-climbers (RÉSOLU), triceps-dips, extensions-triceps-poulie,
elevations-laterales-halteres-myo-reps (reps partielles mi-hauteur→épaules),
gainage-lateral-dynamique (hanches basses→ligne droite), hip-thrust-unilateral-1-jambe,
glute-ham-raise (machine GHR, torse horizontal→vertical), developpe-derriere-la-nuque,
mobilite-des-epaules (bâton cuisses→derrière le dos).
Refusée 1 : developpe-incline-halteres (2ᵉ refus : case 1 correcte deux haltères séparés,
case 2 un seul haltère à deux mains) → lot 32 en cases simples séparées + assemblage PIL.
Relecture batch 12 : 3/3 conformes (etirement-du-flechisseur-de-hanche-chevalier,
etirement-du-piriforme-assis, fentes-alternees). Feuilles : `verification/lot31b-01..04.jpg`,
`verification/relecture-12.jpg`.

## 34. Couverture et suite (état lot 31)

**210 / 331 couples valides**, 121 restants (musculation 39, protocoles piscine 40,
tabata au sol 27, piscine guides 9, aqua tabata 6). Relecture cumulative : **171 couples
valides relus**, **39 restent à relire** (feuilles de 3, mêmes outils, aucun raccourci
vignette). **1 planche en attente** dans `production/a-refaire.json` :
developpe-incline-halteres (2ᵉ refus). Prochain lot 32 : cette planche en cases simples
séparées + assemblage PIL, puis poursuite musculation (39) selon le plan.

## 35. Lot 32 : refus en cases separees + musculation (meme tour)

Developpe incline halteres tente en deux cases SIMPLES separees puis assemblees PIL :
case 2 de nouveau un seul haltere a deux mains -> 3e refus. Huit planches neuves :
acceptees 6 : extensions-triceps-barre-ez (cases generees inversees, echangees par PIL),
leg-curl-machine (machine complete, bassin plaque), releves-de-jambes (jambes basses->
verticale), face-pull-a-l-elastique (ancre = montant du rack, coudes hauts),
tractions-prise-large (suspension->menton), developpe-militaire-inertie-depuis-les-pins
(barre au front depuis les pins->verrouillage).
Refusees 3 : developpe-incline-halteres (3e), tirage-vertical-prise-large (grille 2x2,
tetes coupees), ab-wheel-roulette (orientation inversee entre cases).
Relecture batch 13 : 3/3 conformes (fentes-arriere-au-poids-du-corps, fentes-barre,
fentes-bulgares-halteres-pied-avant-sureleve). Feuilles : `verification/lot32b-01..03.jpg`,
`verification/relecture-13.jpg`.

## 36. Couverture et suite (etat lot 32)

**216 / 331 couples valides**, 115 restants (protocoles piscine 40, musculation 33,
tabata au sol 27, piscine guides 9, aqua tabata 6). Relecture cumulative : **174 couples
valides relus**, **42 restent a relire**. **3 planches en attente** dans
`production/a-refaire.json` : developpe-incline-halteres (3e refus), tirage-vertical-prise-large
(1er), ab-wheel-roulette (1er). Prochain lot 33 : ces 3 planches (strategies ci-dessus)
+ 7 planches de musculation.

## 37. Lot 33 : vue de FACE pied de banc et format 2 panneaux (meme tour)

Developpe incline halteres : camera dans l'axe des pieds (vue de FACE du buste) ->
les deux halteres restent separes a gauche et a droite du sternum aux deux cases :
**4e refus efface, planche acceptee**. Tirage vertical prise large : consigne de format
EXACTLY TWO panels paysage -> machine complete, tetes et barre entieres : **resolu**.
Acceptees 8 : developpe-incline-halteres, tirage-vertical-prise-large,
kickback-a-la-poulie-drop-set-final (poulie BASSE, sangle de cheville), hip-thrust-unilateral-leste,
pallof-press-a-la-poulie (ancre poulie mi-hauteur, buste face camera), barre-au-front-pushdown-triceps,
curl-scott-haltere-neutre, leg-press (presse 45 degres).
Refusee 1 : ab-wheel-roulette (2e : case 1 = deux personnages, corps duplique).
1 echec de generateur (0 image) compte dans le lot.
Relecture batch 14 : 2/3 conformes ; **extensions-triceps-barre-ez RETIREE des valides**
(orientation de tete inversee entre cases) -> a-refaire. Feuilles :
`verification/lot33b-01..03.jpg`, `verification/relecture-14.jpg`.

## 38. Couverture et suite (etat lot 33)

**223 / 331 couples valides**, 108 restants (protocoles piscine 40, tabata au sol 27,
piscine guides 9, aqua tabata 6, musculation 26). Relecture cumulative : **176 couples
valides relus**, **47 restent a relire**. **2 planches en attente** dans
`production/a-refaire.json` : ab-wheel-roulette (2e refus), extensions-triceps-barre-ez
(retiree a la relecture). Prochain lot 34 : ces 2 planches + 8 planches (musculation 26
puis tabata au sol 27).

## 39. Lot 34 : un seul personnage et ancre de tete (meme tour)

Ab wheel : consigne EXACTLY ONE person per panel -> plus de corps duplique, orientation
coherente aux deux cases : **2e refus efface**. Extensions triceps barre EZ : regeneration
avec ancre « head faces LEFT in BOTH panels » -> ordre ET orientation corrects : **retrait
relecture efface**. Acceptees 7 : ab-wheel-roulette, extensions-triceps-barre-ez,
gainage-lateral (planche laterale, bras au plafond), souleve-de-terre-roumain-unilateral
(haltere main opposee, jambe libre tendue), respiration-diaphragmatique (ventre plat->
souleve), squat-cycliste (talons sur plots, squat complet), elevations-laterales.
Refusees 3 : tirage-vertical-prise-neutre (prise montree pronation large), souleve-de-terre-partiel
(deux lockouts, pas de depart sur pins), mollets-unilateraux (pied libre au sol).
Relecture batch 15 : 3/3 conformes (fentes-marchees, flexion-avant-jambes-tendues, front-squat).
Feuilles : `verification/lot34b-01..04.jpg`, `verification/relecture-15.jpg`.

## 40. Couverture et suite (etat lot 34)

**230 / 331 couples valides**, 101 restants (protocoles piscine 40, tabata au sol 27,
musculation 19, piscine guides 9, aqua tabata 6). Relecture cumulative : **190 couples
valides relus**, **40 restent a relire**. **3 planches en attente** dans
`production/a-refaire.json` : tirage-vertical-prise-neutre, souleve-de-terre-partiel,
mollets-unilateraux (1er refus chacun). Prochain lot 35 : ces 3 planches + 7 planches
(musculation 19 puis tabata au sol 27).

## 41. Lot 35 : poignees neutres et pied libre en l'air (meme tour)

Acceptees 6 : tirage-vertical-prise-neutre (**resolu** : deux poignees verticales paralleles,
paumes face a face), mollets-unilateraux (**resolu** : pied libre croise derriere la cheville,
en l'air aux deux cases), developpe-halteres-plat-prise-neutre (vue de FACE pied de banc,
deux halteres separes), extensions-triceps-halteres-plat, curl-scott-90-haltere-supination,
leg-press-unilateral (pied droit hors sled aux deux cases).
Refusees 4 : souleve-de-terre-partiel (2e : depart non pose sur pins + vert quadriceps),
curl-halteres-incline-prise-neutre (grille 2x2), releves-de-jambes-suspendu (grille 2x2),
mollets-a-la-presse (case 2 genoux flechis = leg press, vert absent case 2).
Relecture batch 16 : 2/3 ; **hip-thrust-barre RETIREE des valides** (halteres au lieu de la
barre = materiel faux, critere utilisateur) ; gainage-planche et jackknife-sur-swiss-ball
conformes. Feuilles : `verification/lot35b-01..04.jpg`, `verification/relecture-16.jpg`.

## 42. Couverture et suite (etat lot 35)

**235 / 331 couples valides**, 96 restants (protocoles piscine 40, tabata au sol 27,
musculation 14, piscine guides 9, aqua tabata 6). Relecture cumulative : **192 couples
valides relus**, **43 restent a relire**. **5 planches en attente** dans
`production/a-refaire.json` : souleve-de-terre-partiel (2e), curl-halteres-incline-prise-neutre,
releves-de-jambes-suspendu, mollets-a-la-presse (1ers), hip-thrust-barre (relecture).
Prochain lot 36 : ces 5 planches + 5 planches (musculation 14 puis tabata au sol 27).

## 43. Lot 36 : « termine les refus » (meme tour)

Objectif du tour : clos les 5 planches de a-refaire. Clos 3 : curl-halteres-incline-prise-neutre
(format 2 panneaux impose), releves-de-jambes-suspendu (format 2 panneaux), hip-thrust-barre
(BARRE longue avec disques aux deux bouts, critere materiel respecte).
Restent 2 malgre 10/10 generations : souleve-de-terre-partiel (5e refus : aucun depart barre
sur pins buste 45 deg, ni par prompt texte, ni par cases separees, ni par vocabulaire
« deadlift bottom » ; vert souvent quadriceps) et mollets-a-la-presse (3e refus : genoux
flechis = leg press, vert tibias, une case2 en planche double).
Strategie lot 37 : EDITION d'image (case lockout propre editee en case depart ; case unique
editee en paire) — methode deja prouvee au lot 26.
Feuilles : `verification/lot36b-01..02.jpg`, `verification/lot36c.jpg`, `verification/lot36d.jpg`.

## 44. Couverture et suite (etat lot 36)

**238 / 331 couples valides**, 93 restants (protocoles piscine 40, tabata au sol 27,
musculation 11, piscine guides 9, aqua tabata 6). Relecture cumulative : **192 couples
valides relus**, **46 restent a relire**. **2 planches en attente** dans
`production/a-refaire.json` : souleve-de-terre-partiel (5e refus) et mollets-a-la-presse
(3e refus), toutes deux vers la strategie d'EDITION. Prochain lot 37 : ces 2 planches par
edition + 8 planches (musculation 11 puis tabata au sol 27).

## 45. Lot 37 : edits et vues de FACE pied de banc (meme tour)

Strategie edition testee sur les 2 resistantes : echec (sd-partiel : l'edit retourne la vue
de dos sans hinge ; mollets-presse : edit quasi identique, chevilles immobilees).
Acceptees 5 : developpe-halteres-decline-prise-neutre et developpe-halteres-incline-45-prise-neutre
(vues de FACE pied de banc, deux halteres separes), extensions-triceps-halteres-incline,
tirage-vertical-prise-pronation, gainage-planche (couple DEJA valide : nouvelle planche relue
et conforme, remplace le GIF precedent).
Refusees 3 : souleve-de-terre-partiel (6e), mollets-a-la-presse (4e), drop-lunges-fentes-sautees-controlees
(1er : haltere orphelin case 1).
Relecture batch 17 : 3/3 conformes (hip-thrust-barre confirmee avec BARRE, jumping-jacks,
lean-away-pull-ups). Feuilles : `verification/lot37b-01..03.jpg`, `verification/relecture-17.jpg`.

## 46. Couverture et suite (etat lot 37)

**242 / 331 couples valides**, 89 restants (protocoles piscine 40, tabata au sol 27,
piscine guides 9, aqua tabata 6, musculation 7). Relecture cumulative : **200 couples
valides relus**, **42 restent a relire**. **3 planches en attente** dans
`production/a-refaire.json` : souleve-de-terre-partiel (6e), mollets-a-la-presse (4e),
drop-lunges-fentes-sautees-controlees (1er). Prochain lot 38 : ces 3 planches (block pull,
talons debordants, poids du corps) + 7 planches (musculation 7 puis tabata au sol 27).

## 47. Lot 38 : block pull enfin juste, mais de face le vert fuit (meme tour)

Acceptees 6 : drop-lunges-fentes-sautees-controlees (RESOLU : poids du corps, permutation
nette), developpe-halteres-incline-pronation (vue de FACE pied de banc), elevations-laterales-incline-30
(couche sur le flanc, banc incline), gainage-planche femme, pompes-inclinees (mains sur
banc), russian-twist (rotation alternee, pieds au sol).
Refusees 4 : souleve-de-terre-partiel (7e : geste block pull ENFIN correct mais vue de FACE
le vert part sur quadriceps — la chaine posterieure n'est pas visible de face), souleve-de-terre-partiel-prise-snatch
(1er : meme cause), mollets-a-la-presse (5e : genoux flechis, vert tibias), squats-sautes
(1er : bras tronques en moignons).
Lecon : tout deadlift/rack pull se dessine desormais DE DOS pour que le vert posterior
chain soit visible. Relecture batch 18 : 3/3 conformes (leg-curl-allonge-pieds-flechis,
leg-curl-allonge, main-dans-le-dos). Feuilles : `verification/lot38b-01..04.jpg`,
`verification/relecture-18.jpg`.

## 48. Couverture et suite (etat lot 38)

**248 / 331 couples valides**, 83 restants (protocoles piscine 40, tabata au sol 25,
piscine guides 9, aqua tabata 6, musculation 3). Relecture cumulative : **209 couples
valides relus**, **39 restent a relire**. **4 planches en attente** dans
`production/a-refaire.json` : souleve-de-terre-partiel (7e), souleve-de-terre-partiel-prise-snatch
(1er) — tous deux en VUE DE DOS au lot 39 —, mollets-a-la-presse (5e, derniere tentative
texte sinon decision utilisateur), squats-sautes (1er, bras entiers). Prochain lot 39 :
ces 4 planches + 6 planches de tabata au sol (25).

## 49. Lot 39 : les 4 dernieres refusees RESOLUES, a-refaire VIDE (meme tour)

souleve-de-terre-partiel (8e essai) et souleve-de-terre-partiel-prise-snatch (2e) : VUE DE
DOS aux deux cases, block pull sur blocs noirs — depart hanche basse buste 45 deg barre sur
blocs, lockout debout blocs vides, vert fessiers/ischios/lombaires/trapezes VISIBLE :
acceptes. mollets-a-la-presse (6e) : genoux 180 deg, plante seule sur la plaque, talon pendu
case1 / talon monte case2 : accepte. squats-sautes (2e) : bras entiers visibles (ballants
arriere puis au-dessus de la tete), saut decolle : accepte.
**a-refaire.json VIDE** — plus aucune planche refusee. **Surface musculation TERMINEE :
203 couples valides, 0 restant.**
2 echecs generateur comptes dans le lot (reset workspace en plein tour + MAX_TOKENS).
Feuilles : `verification/lot39b-01..02.jpg`.

## 50. Couverture et suite (etat lot 39)

**252 / 331 couples valides**, 79 restants (protocoles piscine 40, tabata au sol 24,
piscine guides 9, aqua tabata 6). Relecture cumulative : **213 couples valides relus**,
**39 restent a relire**. Prochain lot 40 : tabata au sol (24 restants), puis piscine.

## 51. Lot 40 : tabata au sol, 9/10 du premier coup (meme tour)

Acceptees 9 : battements-de-jambes (ciseaux alternes), burpees-simplifies (debout -> planche),
chaise-au-mur (cuisses paralleles), chaise-douce (assise partielle), dead-bug (bras/jambe
opposes), dips-au-bord, fentes-arriere, high-knees (genoux alternes), marche-sur-place.
Refusee 1 : corde-invisible (grille 2x2, corps entier absent des cases).
Relecture batch 19 : 3/3 conformes (mains-croisees-derriere-le-dos, mollet-en-escalier,
pigeon-assis). Feuilles : `verification/lot40b-01..04.jpg`, `verification/relecture-19.jpg`.

## 52. Couverture et suite (etat lot 40)

**261 / 331 couples valides**, 70 restants (protocoles piscine 40, tabata au sol 15,
piscine guides 9, aqua tabata 6). Relecture cumulative : **225 couples valides relus**,
**36 restent a relire**. **1 planche en attente** : corde-invisible (format 2 panneaux au
lot 41). Prochain lot 41 : corde-invisible + 9 planches de tabata au sol (15).

## 53. Lot 41 : corde invisible RESOLUE, 9/10 acceptees (meme tour)

Priorite au refus du lot 40 : corde-invisible regeneree en bandeau paysage 2 panneaux,
corps entier dans chaque case, mains vides sans corde, saut reel case 2 : **ACCEPT**
(note style : case 1 sans vert lime -> `production/style-a-reprendre.json`).
Acceptees aussi 8 : mollets (profil, talons poses -> talons decolles, genoux 180 deg),
montees-sur-mollets (vue DE DOS, talons hauts, vert mollets), montees-de-genoux (profil,
genoux alternes a la hanche, bras opposes), mountain-climbers-lents (vue de FACE camera
basse, genoux alternes sous la poitrine, vert abdos+epaules), patineurs (sauts lateraux
alternes, jambe arriere decollee), planche (gainage avant-bras, 2 frames statiques),
planche-laterale-g (planche cote gauche, hanche levee, bras du dessus hanche puis ciel),
pompes-au-mur (meme mur, bras tendus -> coudes flechis poitrine au mur).
Refusee 1 : oiseau-chien (case 2 extension du MEME cote : bras loin + jambe loin tendus
ensemble, appuis du meme cote ; zoom `verification/zoom-oiseau-droite.jpg`) -> a-refaire,
retry lot 42 avec cotes camera imposes. GIF oiseau-chien supprime.
Relecture batch 20 : 3/3 conformes (pompes, pompes-inclinees-mains-surelevees,
pont-fessier-au-sol-activation). Feuilles : `verification/lot41b-01..04.jpg`,
`verification/relecture-20.jpg`.

## 54. Couverture et suite (etat lot 41)

**270 / 331 couples valides**, 61 restants (protocoles piscine 40, tabata au sol 6,
piscine guides 9, aqua tabata 6). Relecture cumulative : **228 couples valides relus**,
**33 restent a relire**. **1 planche en attente** : oiseau-chien (cotes camera au lot 42).
Prochain lot 42 : oiseau-chien + 5 dernieres tabata au sol (ponts-fessiers, repos-actif,
respiration-profonde, squats-doux, squats-sumo) + 4 planches piscine guides.

## 55. Lot 42 : oiseau-chien RESOLU, 7/8 acceptees, premiers guides piscine (meme tour)

Priorite au refus lot 41 : oiseau-chien regenere avec cotes camera imposes (bras PROCHE
vertical au sol + jambe PROCHE tendue en arriere, bras LOIN vers l'avant, genou LOIN au sol)
= membres OPPOSES cette fois : **ACCEPT**.
Acceptees aussi 6 : ponts-fessiers (hanches au sol -> pont ligne epaules-genoux),
repos-actif (marche lente relachee, 2 phases), respiration-profonde (profil, main poitrine +
main ventre, inspire ventre sorti -> expire ventre rentre), squats-sumo (stance large orteils
45 deg -> squat profond genoux dans l'axe), gainage-au-bord-vertical FEMME (vertical mains au
bord -> genoux poitrine, vert a travers l'eau), pompes-au-bord FEMME (bras tendus -> coudes
flechis poitrine au bord, meme margelle).
Refusee 1 : squats-doux (case 1 FACE, case 2 DOS 3/4 : cadrage qui saute) -> a-refaire,
retry lot 43 face ancree aux deux cases. GIF squats-doux supprime.
2 echecs transitoires generateur (lecture maitre-femme.png) sur battements-au-bord et
marche-aquatique : a rejouer au lot 43, comptes dans le plafond du lot.
Relecture batch 21 : 3/3 conformes (position-de-l-enfant, position-de-l-enfant-balasana,
presse-a-cuisses-pieds-hauts). Feuilles : `verification/lot42b-01..02.jpg`,
`verification/lot42f.jpg`, `verification/relecture-21.jpg`.

## 56. Couverture et suite (etat lot 42)

**277 / 331 couples valides**, 54 restants (protocoles piscine 40, piscine guides 7,
aqua tabata 6, tabata au sol 1). Relecture cumulative : **247 couples valides relus**,
**30 restent a relire**. **1 planche en attente** : squats-doux (face ancree au lot 43).
Prochain lot 43 : squats-doux + battements-au-bord + marche-aquatique (replay) + 6 planches
piscine guides (fractionne-nager, nage-statique-a-l-elastique, recup-complete-souffler,
sprint-nager-a-fond, talons-fesses, + 1 protocole piscine).

## 57. Lot 43 : squats-doux RESOLU, 8/8 acceptes, piscine guides TERMINEE (meme tour)

squats-doux (2e essai) : FACE camera ancree aux deux cases, amplitude 45 deg, bras tendus
devant, vert face des cuisses : **ACCEPT** -> a-refaire VIDE.
Replays OK des 2 echecs transitoires du lot 42 : battements-au-bord (battement alterne,
splash) et marche-aquatique (2 phases de pas). Acceptees aussi 5 : fractionne-nager
(pull face a l'eau -> recovery respire), nage-statique-a-l-elastique (elastique JAUNE UN
seul tendu, meme ancre aux deux cases, streamline -> traction), recup-complete-souffler
(mains au bord, inspire poitrine levee -> expire relache), sprint-nager-a-fond (bras
alternes au-dessus de l'eau, gros splash), talons-fesses (talons alternes aux fesses,
vert ischios a travers l'eau).
**Surface tabata au sol TERMINEE : 37/37. Surface piscine guides TERMINEE : 9/9.**
Relecture batch 22 : 3/3 conformes (pullover-cable-bras-tendus, pullover-haltere-plat,
pushdown-triceps-cable). Feuilles : `verification/lot43b.jpg`, `verification/lot43f-01..03.jpg`,
`verification/relecture-22.jpg`.

## 58. Couverture et suite (etat lot 43)

**285 / 331 couples valides**, 46 restants (protocoles piscine 40, aqua tabata 6).
Relecture cumulative : **258 couples valides relus**, **27 restent a relire**.
**Aucune planche en attente** (a-refaire VIDE). Prochain lot 44 : 10 planches de
protocoles piscine (féminines), puis aqua tabata (6).

## 59. Lot 44 : protocoles piscine, 8 planches + 26 copies conformes (meme tour)

Acceptees 8 (femme, bassin) : aqua-jogging-sur-place (genoux alternes, bras pompes),
ciseaux-mains-au-bord (jambes en V -> croisees serrees), deplacements-lateraux-4-m
(demi-squat tenu, pas chasses), montees-de-genoux-effort (genoux aux hanches, bras
opposes), etirements-au-bord (triceps/epaule d'un cote puis de l'autre),
mobilite-epaules-aquatique (bras devant -> balais arriere sous l'eau),
mobilite-hanches-chevilles (genou 90 deg devant d'un cote puis de l'autre), repos
(vertical relache au bord, 2 frames calmes).
Refusee 1 : nage-douce (case 2 DEUX femmes, corps duplique) -> a-refaire, lot 45 avec
ancre EXACTLY ONE woman. nage-douce-respiration : echec transitoire MAX_TOKENS puis
plafond atteint : generee au lot 45.
26 copies conformes de GIF deja valides pour les etapes de protocole au MEME geste que
leur guide (l'app d'origine partageait deja ces medias) : recuperations marchees (5),
retour-au-calme, variantes EFFORT (battements, ciseaux, deplacements, gainage, pompes,
talons-fesses), echauffements (battements, battements+mobilite, marche), gainage vertical,
nage statique douce/Z2, fractionne 1/6, sprint 1/8, tabata/tour en place, aqua-jogging
EFFORT, recup complete au bord, retour-au-calme-respiration/mobilite.
Notes style mesurees [0,0] : etirements-au-bord et repos (vert absent des deux cases) ;
relecture-23 : releves-de-jambes-allong homme case 1 sans vert -> style-a-reprendre (25).
Relecture batch 23 : 3/3 conformes (releves-de-jambes femme, homme, allonge homme).
Feuilles : `verification/lot44f-01..03.jpg`, `verification/relecture-23.jpg`.

## 60. Couverture et suite (etat lot 44)

**319 / 331 couples valides**, 12 restants (protocoles piscine 6 de la famille
« nage douce », aqua tabata 6). Relecture cumulative : **295 couples valides relus**,
**24 restent a relire**. **1 planche en attente** : nage-douce (+ nage-douce-respiration
a generer). Prochain lot 45 : nage-douce (ancre une seule femme), nage-douce-respiration,
4 copies conformes depuis nage-douce, puis les 6 aqua tabata (plafond 10 generations).

## 61. Lot 45 : nage douce RESOLUE, 331/331 COUPLES VALIDES (meme tour)

nage-douce (2e essai) : ancre « EXACTLY ONE woman, ONE head, ONE body per panel » :
brasse douce glide -> pull respire, UNE seule femme par case : **ACCEPT**.
nage-douce-respiration (generee ce tour apres l'echec MAX_TOKENS du lot 44) : crawl tres
lent, expire face a l'eau -> inspire tete tournee, vert flancs : **ACCEPT** (decalage decor
-92 compense au recadrage).
10 copies conformes : 4 protocoles « nage douce » (echauffements x2, retours au calme x2)
depuis nage-douce ; 6 aqua tabata depuis leurs guides au meme geste (aqua-jogging,
battements de jambes, ciseaux au bord, deplacements lateraux, gainage vertical,
montees de genoux EFFORT).
**ETAT FINAL : 331 / 331 couples valides, 0 restant, toutes surfaces confondues**
(musculation 203, tabata sol 37, piscine guides 9, protocoles piscine 40, aqua tabata 6,
etirements 29, elliptique 5, echauffement 3). a-refaire VIDE. verif-gifs : 331 GIFs
controles, aucun valide sans GIF ; 2 orphelins historiques hors dossier gif (racine).
Relecture batch 24 : 3/3 conformes (releves-de-jambes-allongee femme, incline homme,
suspendu homme) ; note style : allongee femme case 1 sans vert -> style-a-reprendre (25).
Feuilles : `verification/lot45f.jpg`, `verification/relecture-24.jpg`.

## 62. Couverture et suite (etat lot 45 — JALON)

**331 / 331 couples valides, 0 restant.** Index general : 331 vignettes.
Relecture cumulative : **307 couples valides relus**, **24 restent a relire** (campagne
poursuivie par feuilles de 3 aux lots suivants, en parallele du lot « style » des 25 GIF
sans vert sur une case et de la livraison finale signee).
Prochain tour : livraison finale (APK signe par la cle de l'utilisateur, images pleine
resolution, lien raw unique) + poursuite relecture/style.

## 63. Lot 46 : paquet de livraison 331 pret, relecture-25 3/3 (meme tour)

Relecture batch 25 : 3/3 conformes (respiration-diaphragmatique homme,
respiration-diaphragmatique-allongee homme — le vert sur le ventre EST la bonne zone,
l'heuristique « tra attendu en haut » de verif-gifs est fausse pour ces fiches —,
reverse-crunch femme). Note style : allongee homme case 1 sans vert -> style (26).
Paquet de livraison cree : `livraison/manifeste-331.json` (331 entrees : cle, surface,
noms, chemin GIF, SHA-256, frames, taille, planche source pleine resolution) ;
`livraison/LIVRAISON-README.md` (recette d'integration bundle candidat, signature
utilisateur uniquement, depot 1.4.9 + lien raw unique) ; map d'integration
`evolution/media/candidate/refonte-331-map.json` (331 cles -> GIF + SHA).
Aucune generation ce tour (plafond intact). Prochain tour : build bundle candidat avec la
map, controles, puis signature AVEC LA CLE UTILISATEUR et publication 1.4.9.

## 64. Couverture et suite (etat lot 46)

**331 / 331 couples valides, 0 restant.** Relecture cumulative : **310 relus**,
**21 restent a relire**. Style : 26 GIF. Livraison : paquet pret, cle utilisateur attendue.

## 65. Build 1.4.9 non signe : overlay refonte 331 sur le bundle 1.4.8 (lot 47)

Pipeline outille et rejouable (reset #33 surmonte, tout reconstruit depuis `50de383`) :
- `evolution/media/tools/rebuild-assoc-331.py` → `livraison/association-331.json`
  (193/331 clefs appariees a leurs chemins `/media/…` d'origine ; les 138 restantes sont
  les noms musculation dessines en SVG par `EXO_GIFS`, couverts par le hook).
- `evolution/media/tools/overlay-331.py` (idempotent, repart du bundle ORIGINAL de
  `downloads/Yanis-Fitness-Evolution-1.4.8.apk`) :
  1. 331 GIF copies vers `media/refonte-<ident>-<athlete>.gif`, **331/331 SHA manifeste OK** ;
  2. 146 anciens chemins `/media` ecrases (non ambigus), 30 ambigus laisses intacts
     (couverts par redirection payload + hook) ;
  3. payloads re-emis : **72/72 `EXO_GIFS`** svg → `<img class="exo-gif" src="/media/refonte-…">`,
     **133 imgs** MUSCU_GUIDES/POOL_GUIDES/ECHAUFFEMENT redirigees ;
  4. hook bundle : `const REFONTE_MEDIA` (325 ids, dont **6 duaux {homme,femme}** :
     battements-de-jambes, dead-bug, gainage-planche, montees-de-genoux, mountain-climbers,
     releves-de-jambes) + `__refontePick` (profil actif lu dans `localStorage
     jarvis_fitness_v3`, cache 1,5 s → **athlete = proprietaire du profil**, exigence user)
     + pre-hook `JarvisReviewedMedia` + surcharge de la map `eo` (utilisee par `Kh`).
- Controles : `node --check` SYNTAX OK ; payloads reparsent (2/2) ; **331 chemins hook,
  0 manquant, 0 non-GIF** ; media 535 fichiers (204 + 331).
- APK non signe : `.cache/build/Yanis-Fitness-Evolution-1.4.9-non-signe.apk`
  (103 440 048 octets ; 326 entrees remplacees, 331 ajoutees, signatures META-INF retirees,
  testzip OK, hook + 331 gifs verifies DANS le zip). Non persiste (.cache) : le regenerer
  avec overlay-331.py + repackage.
- Apercu live : `python3 -m http.server 8080 --bind 0.0.0.0 --directory .cache/web-148`.
- Restant : signature **avec la cle utilisateur uniquement** (jamais fabriquee/publiee),
  depot `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`,
  lien raw unique.

## 66. Relecture 26 : les 16 derniers couples relus, 3 gestes/cadrages faux corriges (lot 50, 26/09)

**Reprise dans un nouveau chat** : session Arena `arena/01a0dbe5-…` (contenu de
`arena/01a0d6f5-…` recupere au commit `11d1594`, puis travail poursuivi sur la nouvelle branche —
l'ancienne branche n'est plus alimentee).

Liste nominative reconstruite (le compteur « 310 relus / 21 restants » etait un compteur
glissant, sans liste) : couples valides en ordre alphabetique apres le curseur
`reverse-crunch|femme` de la relecture 25, produits avant le lot 17 (les lots >= 17 sont lus
case par case a la production) et absents des feuilles du batch 1 = **16 couples**. Feuilles
`verification/relecture-26-01..06.jpg` (pleine definition, 3 par feuille), prescriptions relues
dans `production/prescriptions.json` AVANT lecture.

| Couple | Verdict |
|---|---|
| rowing-assis-au-cou | conforme (tirage vertical prise large, barre a la nuque, vue de dos aux 2 cases) ; vert case 1 absent -> style |
| rowing-assis-etirement | **cases INVERSEES** (gauche = poignee au ventre = fin ; droite = etirement = debut) -> cases echangees par PIL, planche `lot50/rowing-assis-etirement.png`, aucune generation ; vert case fin absent -> style |
| rowing-assis-prise-neutre | conforme (poulie basse, cable horizontal, poignee V, debut bras tendus) ; vert case 1 absent -> style |
| souleve-de-terre | **REFUSE** : ordre inverse (gauche = verrouillage debout), angle qui change (face puis 3/4), vert sur quadriceps pour cible ischios -> **refait lot 50** (profil strict, gauche = barre au sol hanches hautes dos plat prise pronation, droite = verrouillage, memes plateaux, vert ischios + fessiers aux 2 cases) ; accepte |
| souleve-de-terre-roumain-barre | conforme (debout -> barre sous les genoux, jambes quasi tendues, dos neutre) ; vert case 1 faible -> style |
| souleve-de-terre-test-1rm | conforme (barre au sol -> verrouillage, vue de face aux 2 cases) ; note : un seul plateau par cote pour un 1RM (cosmetique) |
| split-squat-barbell-pied-avant-sureleve | conforme ; zoom : barre SUR LE DOS aux 2 cases, pied avant sur le step, genou arriere pres du sol |
| squats | conforme (debout -> squat, vert quadriceps aux 2 cases) |
| superman | conforme (a plat -> bras et jambes decolles) ; vert case 1 absent -> style |
| suspension-a-la-barre | conforme (suspendu, epaules relachees) ; vert case 1 absent -> style |
| talon-vers-la-fesse-debout | conforme (appui, talon a la fesse, cheville tenue, genoux serres, vert quadriceps) |
| tirage-vertical-lean-away | conforme ; zoom : poulie haute, cable vertical, poignee double, buste incline en arriere ; vert case 1 absent -> style |
| torsion-allongee | **REFUSE** : torsion ASSISE (jambe croisee, main au sol) alors que la fiche dit « sur le dos, genoux plies, basculez les jambes d'un cote, regardez de l'autre » -> **refait lot 50** (sur le dos, vue de cote surelevee, genoux bascules du cote oppose a la camera, tete tournee vers la camera, vert taille/lombaires) ; different de torsion-allongee-genoux (vue zenithale, genoux a droite) : pas de quasi-double ; accepte |
| tractions-pull-up | conforme (pronation, suspension -> menton au-dessus de la barre, vert dorsaux aux 2 cases) |
| transition (femme, elliptique) | **REFUSE** : case 1 de face, case 2 de profil = GIF qui saute -> **refait lot 50** (profil aux 2 cases pres de l'elliptique : boire une gorgee, puis marcher vers le bassin ; texte de l'app : « buvez quelques gorgees, sechez-vous et rejoignez le bassin sans trainer, gardez les muscles chauds ») ; accepte |
| une-jambe-tendue-une-pliee | conforme ; zoom : plante du pied plie contre la cuisse, penche vers le pied tendu |

Lot 50 = **3 generations** (plafond 10 intact pour 7), 0 echec, `verif-ids.py` OK avant conversion,
`refonte-sheet.py` -> `gif/homme/{torsion-allongee,souleve-de-terre,rowing-assis-etirement}-homme.gif`,
`gif/femme/transition-femme.gif` ; planches de controle `review/lot50-homme.jpg`, `review/lot50-femme.jpg`.
`verif-gifs.py` : 331 GIF, structure 100 % conforme, aucun nouveau quasi-double hors copies piscine
declarees, 2 orphelins historiques inchanges.

**PDF de revue regenere AVEC LES MEMES NUMEROS** (`livraison/REVUE-331-exercices.pdf`, 112 pages ;
verification programmatique : meme ordre de cles avant/apres) : n° **169** rowing assis + etirement,
n° **180** souleve de terre, n° **327** torsion allongee, n° **330** transition — pages 61 et 110 controlees a l'ecran.

Manifeste : nouvel outil `evolution/media/tools/maj-manifeste-331.py` (SHA/frames/taille re-mesures,
planche source retrouvee par correspondance d'image, jamais par le nom seul) : 4 entrees GIF
mises a jour, 10 planches `lot01/lot03/{homme,femme}` retrouvees, 3 attributions corrigees
(dead-bug femme lot20, gainage-planche homme lot37, releves-de-jambes homme lot02 : les jumeaux
homme/femme pointaient sur la meme planche). `candidate/refonte-331-map.json` : 4 SHA mis a jour.

## 67. Couverture et suite (etat lot 50)

**331 / 331 couples valides, 0 restant. Relecture cumulative TERMINEE : 331 / 331 relus, 0 restant.**
Style : **33 GIF** ayant une case sans vert sur le corps (26 mesures + 7 constates a la lecture
visuelle de cette relecture ; geste juste partout) — decision utilisateur attendue.
`a-refaire.json` VIDE. Chaine 1.4.9 rejouee apres reset : `payloads-148.mjs` (nouveau, node),
`overlay-331.py` (331 copies, 146 ecrasements, 72 EXO_GIFS, 133 imgs, 325 cles, 6 duaux, 535 medias,
`node --check` OK), **`evolution/android/build-media-149.py --unsigned`** (nouveau : APK 1.4.0 base
epinglee + web 1.4.8 refondu, META-INF retire, version 1.4.9 / code 20, 9 DEX identiques, 657 fichiers
web = 272 + 385, 331 GIF refonte verifies SHA dans le zip, hook 331 chemins presents, aucun media
pendouillant) -> `.cache/build/Yanis-Fitness-Evolution-1.4.9-non-signe.apk` (103 757 865 o).
Mode `--real` (signature v2+v3 avec l'identite `150e3846…` restauree par la cle utilisateur,
depot `downloads/…-1.4.9.apk` + `.sha256` + `.fidelity.json`) ecrit, **non execute : cle absente**.

## 68. Lot 51 : Yanis dans le bassin — 9/10 acceptees, 32 couples homme valides (26/09, apres reset #2 de la session)

**Retour utilisateur (26/09)** : « Piscine et autres exercices de cardio pour Yanis : il n'y a pas
d'image » — exact : les 60 couples piscine / aqua tabata / elliptique n'existaient que chez la femme.
Regle athlete = proprietaire du profil -> **58 couples homme ajoutes au plan** (`plan.json` : lignes
homme miroir des lignes femme aquatiques/elliptique ; `etat.json` restants = 58 ; 2 cles en collision
avec la version terrestre deja valide — battements-de-jambes|homme, montees-de-genoux|homme — sont
servies par le guide piscine du meme geste, par NOM, au cablage). 24 gestes distincts a generer,
le reste en copies conformes exactement comme chez la femme (memes groupes de SHA).

**Numerotation PDF FIGEE** : `livraison/numerotation-pdf.json` (cle -> numero) ; `pdf-revue-331.py`
lit ce fichier : 1-331 ne bougent plus jamais, les nouveaux couples recoivent les numeros suivants.
Nouveaux outils : `tools/valide-couples.py` (GIF -> copies conformes + manifeste + etat + numero PDF +
map candidate, en une commande).

Lot 51 = 10 generations homme, bassin interieur, memes reperes que la famille femme (vue coupee
au niveau de l'eau, eau poitrine/taille, maillot noir, vert visible a travers l'eau), feuilles
`verification/lot51-01..04.jpg` relues case par case :

| Planche | Verdict |
|---|---|
| aqua-jogging-sur-place | ACCEPT (genou droit puis gauche, bras opposes, vert cuisses + abdos) |
| battements-au-bord | **REFUS** : meme jambe levee dans les 2 cases + 0 px de vert -> a-refaire (lot 52, ancrage par cote camera, vue 3/4 arriere) |
| ciseaux-mains-au-bord | ACCEPT (V ouvert -> jambes croisees, vue 3/4 arriere surelevee) |
| deplacements-lateraux-4-m | ACCEPT (demi-squat tenu, pieds ecartes -> joints ; note : eau a la taille) |
| gainage-au-bord-vertical | ACCEPT (vertical mains au bord -> genoux poitrine) |
| marche-aquatique | ACCEPT (2 phases de grand pas, bras opposes ; note : eau a la taille) |
| montees-de-genoux-effort | ACCEPT (genou droit puis gauche a la hanche, splash) |
| nage-douce | ACCEPT (brasse : glisse -> traction tete sortie ; bandes grises du generateur recadrees avant conversion, GIF 570x440) |
| pompes-au-bord | ACCEPT (bras tendus -> coudes flechis poitrine au bord) |
| repos | ACCEPT (avant-bras au bord, expire -> inspire, vert leger epaules) |

`valide-couples.py --athlete homme --lot lot51` : 9 GIF + **23 copies conformes** = **32 couples
homme valides (n° 332 a 363)**. PDF regenere : 122 pages, 363 exercices, 1-331 inchanges (page 61 = n° 180
controlee). `review/lot51-homme.jpg`, `review/index-general.jpg` (363 vignettes).

**Etat : 363 valides / 26 restants** (piscine 9, protocoles 12, elliptique 5) = 15 generations restantes :
lot 52 (10) : battements-au-bord (retry), nage-statique-a-l-elastique, fractionne-nager, sprint-nager-a-fond,
recup-complete-souffler, talons-fesses, etirements-au-bord, mobilite-epaules-aquatique,
mobilite-hanches-chevilles, nage-douce-respiration ; lot 53 (5) : elliptique-mise-en-route, elliptique-fractionne,
elliptique-recuperation-active, elliptique-retour-au-calme, transition (homme).

**Cablage prevu (lot 53)** : les visuels piscine/elliptique ne passent pas par le hook `REFONTE_MEDIA`
(ids) mais par `POOL_GUIDES` (payload, par NOM), la constante `If` (guides elliptique, codee en dur,
imgs `/media/cardio-*.jpg` non redirigees par l'overlay actuel) et `providedAnimations/Recoveries`.
Solution retenue : patch de `bt` (resolveur universel des `src` d'images) -> `__refonteSwap(path)` :
tout chemin `/media/refonte-<ident>-<athlete>.gif` (ou ancien chemin table `REFONTE_OLD`) est servi
dans la variante de l'athlete du profil actif quand elle existe ; + patch de `If` vers les chemins
refonte. Verification : apercu web, profil Yanis -> homme dans le bassin ; profil Emilie -> femme.

## 69. Lot 52 : piscine Yanis suite — 6/10 acceptees, 4 refus motives (26/09)

10 generations homme (bassin), vert mesure present dans les DEUX cases des 10 planches, feuilles
`verification/lot52-01..04.jpg` relues case par case :

| Planche | Verdict |
|---|---|
| battements-au-bord (essai 2, vue 3/4 arriere) | **REFUS** : jambe levee PLIEE + meme jambe aux 2 cases (vert OK) -> essai 3 en vue zenithale |
| etirements-au-bord | ACCEPT (mollet pied au mur -> quadriceps talon a la fesse, main au bord) |
| fractionne-nager | ACCEPT (traction tete dans l'eau -> retour aerien + respiration laterale) |
| mobilite-epaules-aquatique | ACCEPT (bras bas a la surface -> bras tendus au-dessus de la tete ; note : eau a la taille) |
| mobilite-hanches-chevilles | **REFUS** : homme debout dans 20 cm d'eau (marche du bassin) + jambe devant aux 2 cases |
| nage-douce-respiration | ACCEPT (expire bulles face dans l'eau -> inspire tete tournee) |
| nage-statique-a-l-elastique | ACCEPT apres recadrage : le generateur a rendu une GRILLE 2x2 (2 rangees identiques) -> rangee du haut conservee (PIL, 1376x381) ; elastique jaune unique ancre au bord, ceinture, streamline -> traction |
| recup-complete-souffler | ACCEPT (mains au bord, inspire yeux fermes -> expire levres pincees epaules basses) |
| sprint-nager-a-fond | **REFUS** : corps VERTICAL (course aquatique) au lieu d'un crawl horizontal -> essai 2 en profil |
| talons-fesses | **REFUS** : case 1 = genou devant (montee de genou) au lieu du talon a la fesse |

`valide-couples.py --lot lot52` : 6 GIF + 6 copies conformes = **12 couples (n° 364-375)**. PDF : 126 pages,
375 exercices, 1-331 inchanges. **Etat : 375 valides / 14 restants** = 9 generations : 4 retries
(`a-refaire.json`, strategies differentes consignees) + 5 elliptique/transition homme -> lot 53, puis cablage.

## 70. Lot 53 : 6/9 acceptees, CABLAGE « athlete = profil » pose pour piscine/elliptique (26/09, apres reset #3)

9 generations (4 reprises + 5 elliptique/transition homme), vert mesure aux 2 cases sur les 9, feuilles
`verification/lot53-01..03.jpg` :

| Planche | Verdict |
|---|---|
| battements-au-bord (essai 3, vue zenithale) | **ACCEPT** : jambes tendues, pied droit puis pied gauche a la surface, vert fessiers/ischios |
| mobilite-hanches-chevilles (essai 2) | ACCEPT : eau a la taille, main au bord, jambe tendue devant -> derriere |
| sprint-nager-a-fond (essai 2, profil) | ACCEPT : crawl horizontal, bras droit puis gauche en retour aerien, gros splash |
| talons-fesses (essai 2) | **REFUS** : talon a la fesse juste mais MEME jambe aux 2 cases -> essai 3 en vue 3/4 arriere |
| elliptique-mise-en-route | **REFUS** : machine en MIROIR entre les cases (console devant puis derriere) |
| elliptique-fractionne | **REFUS** : cases quasi identiques (meme pedale, meme genou) |
| elliptique-recuperation-active | ACCEPT : vue 3/4 arriere, pedalage lent puis gorgee d'eau (texte app : « profitez-en pour boire ») |
| elliptique-retour-au-calme | ACCEPT : dernier pas tres lent -> machine arretee, main sur la poitrine, inspiration |
| transition (homme) | ACCEPT : boire pres de l'elliptique -> marcher vers le bassin, serviette |

`valide-couples.py --lot lot53` : 6 GIF + 4 copies = **10 couples (n° 376-385)**. **Etat : 385 valides / 4 restants**
(talons-fesses + talons-fesses-effort, elliptique-mise-en-route, elliptique-fractionne) = 3 generations,
strategies consignees dans `a-refaire.json`. PDF : 129 pages, 385 exercices, 1-331 inchanges.

**Cablage pose dans `overlay-331.py`** (verifie par simulation node des deux profils) :
- `globalThis.__refonteSwap(chemin)` : tout `/media/refonte-<id>-<athlete>.gif` OU ancien chemin non ambigu
  (`REFONTE_OLD`, 146 chemins : `/media/2e23…gif`, `/media/pool-repos.gif`, `/media/cardio-transition.jpg`…)
  est servi dans la variante de l'athlete du profil actif quand `REFONTE_MEDIA[id]` est double (60 ids duaux) ;
- `bt` (resolveur universel des `src` d'images) appelle `__refonteSwap` : couvre POOL_GUIDES (par nom), la
  constante `If`, providedAnimations/Recoveries, la map `yg`, le timer, les vignettes et la modale image ;
- constante `If` (5 guides elliptique) : imgs `/media/cardio-*.jpg` -> chemins refonte du meme nom.
Simulation : profil yanis -> nage-douce, aqua-jogging, pompes au bord (ancien chemin), transition, repos =
variantes HOMME ; profil emilie = variantes FEMME ; musculation homme-only inchangee ; elliptique-mise-en-route
reste femme chez Yanis tant que l'homme n'est pas produit (lot 54). `node --check` OK ;
`build-media-149.py --unsigned` OK : 711 fichiers web, 385 GIF verifies SHA dans le zip, hook 385 chemins,
aucun media pendouillant (les controles acceptent desormais N >= 331 couples).


## 71. Lot 54 — reprise de session, 386 valides / 3 restants (26/09/2026)

Branche imposée `arena/01a0dcad-jarvis-fitness-yanis-emilie-ap`, reprise de l'ancienne
`arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap` au commit `e96e51b`. Pas de push sur main.

**6 générations** : 3 planches initiales, 2 éditions ciblées de cases refusées,
1 édition de couleur de la mise en route (vert initial trop faible : 413 / 8 pixels dans la ROI jambes).

- **Elliptique mise en route homme ACCEPTÉE, n° 386** : deux phases alternées, même orientation
  et même cadrage, pieds sur pédales. Le modèle a choisi un volant avant, mais identique dans les
  deux cases (la prescription n'impose pas de volant arrière). Bande grise centrale retirée par PIL
  avant édition couleur. Édition finale : gestes conservés et vert lime renforcé aux deux cases.
- **Talons-fesses REFUSÉ** : essai 3 vue ¾ arrière, puis essai 4 édition d'une case seule : toujours
  la même jambe levée. Pas de GIF intégré. Prochain essai : dos strict symétrique, repères gauche/droite
  de chaque case, pas de miroir global.
- **Elliptique fractionné REFUSÉ** : essai 2 pédales opposées puis essai 3 édition de la case seule :
  même jambe proche devant. Pas de GIF intégré. Prochain essai : référence de phases de la mise en route
  réussie, demande d'effort soutenu spécifique, pas de simple copie du GIF facile.
- Refus conservés dans `planches/lot54/` et `verification/lot54-refus/` ; contrôle initial des trois
  candidats `review/lot54-candidats.jpg` (ATTENTION : contient les refus et la mise en route avant renforcement).
  Contrôle FINAL accepté : `review/lot54-homme.jpg`.

Contrôles : `verif-ids.py` OK ; lecture des deux cases pleine définition ; GIF 415×440,
2 frames de 500 ms, boucle 0 ; vert mesuré DANS LA ROI JAMBES : **2271 / 2689 pixels**
(pas les plantes du décor), `verification/lot54-mesures.json`.
`valide-couples.py` : 1 ajout, aucune copie. Les 385 numéros antérieurs sont inchangés (assertion).
PDF **130 pages / 386 exercices**, index 386, manifeste/état/map à jour.
Chaîne payloads → overlay → build --unsigned OK : **712 fichiers web, 386 GIF SHA vérifiés**,
9 DEX identiques, contrôle chemins/hook ; APK non signé 114288643 octets. Aucun APK signé livré.

Reste **3 couples / 2 gestes** : talons-fesses homme + copie talons-fesses-effort homme,
elliptique-fractionne homme. `a-refaire.json` mis à jour avec stratégies différentes pour le lot 55.
Les 33 cas de style historiques restent en attente de décision utilisateur.


## 72. Lot 55 — talons-fesses résolu, 388 valides / 1 restant (26/09/2026)

**7 générations**, sans miroir global :
1. Talons-fesses essai 5, dos strict : alternance juste, mais second talon trop bas.
2. Elliptique fractionné essai 4 depuis mise-en-route : même phase, main libre derrière le dos → refus.
3. Talons essai 6, édition amplitude : vert renforcé mais second talon toujours bas → refus en l'état.
4. Elliptique essai 5, vue ¾ frontale : même jambe proche basse → refus.
5. Talons essai 7, case droite guidée : ancienne pose effacée localement et guide dessiné par PIL,
   puis rendu photographique par générateur. **Accepté** : jambe droite pliée talon à la fesse,
   jambe gauche au sol. Assemblage PIL avec case gauche de l'essai 6 ; aucun miroir/rotation.
6. Elliptique essai 6, guide rose superposé : le générateur supprime le guide sans changer de jambe → refus.
7. Elliptique essai 7, ancienne pose effacée et guide peint : même jambe encore → refus.

Planche finale talons-fesses relue en pleine définition, puis GIF : 129×440 (planche étroite de dos),
2 frames de 500 ms, boucle infinie ; vert DANS LA ROI jambes : **349 / 756 pixels**.
`verification/lot55-mesures.json`, contrôle accepté `review/lot55-homme.jpg`.
Les intermédiaires refusés sont dans `verification/lot55-refus/` (pas intégrés dans l'app).
`valide-couples.py` : talons-fesses homme **n° 387**, copie conforme talons-fesses-effort **n° 388**.
Les 386 anciens numéros restent identiques (assertion). PDF **131 pages / 388 exercices**,
index 388, manifeste/état/map actualisés. Yanis piscine : terminé ; reste seulement l'elliptique fractionné.

**Prochain lot 56, essai 8** : génération d'une phase seule depuis maître + schéma indépendant,
vue de face stricte, sans photo d'ancienne pose qui ancre le générateur ; ensuite phase opposée
même machine, deux mains sur poignées, contrôle avant assemblage. Voir a-refaire.json.

**Correctif technique** : payloads-148.mjs lisait le cache web s'il existait, donc pouvait extraire
les payloads déjà modifiés de l'overlay. Désormais lecture TOUJOURS depuis l'APK original 1.4.8.
Test : deux chaînes payloads → overlay successives avec cache présent produisent exactement les
mêmes SHA payloads et bundle ; 72 EXO_GIFS / 133 images repatchés à chaque exécution.
Build --unsigned contrôlé : **388 GIF SHA, 714 fichiers web, 9 DEX identiques**, aucun chemin manquant,
APK 114420961 octets. Pas de signature, pas de livraison APK finale.

Les 33 cas style historiques restent ouverts. Ordre utilisateur inchangé : finir dernier visuel,
retours PDF, proposition niveau cardio à valider, images chrono, signature, IA en dernier.


## 73. Lot 56 — ÉTAPE 1 TERMINÉE, passage à l’ÉTAPE 2 (26/09/2026)

**389 / 389 couples validés, 0 restant.** Les 58 ajouts homme piscine/cardio sont terminés.
Elliptique-fractionné homme **n° 389**. L'utilisateur demande explicitement d'être prévenu
au passage à l'étape 2 : annoncé dans le chat, PDF présenté pour SA relecture.

Workspace réinitialisé au début du tour (HEAD d721868) : arbre propre, récupération de c2a56c4
sur la branche de session `arena/01a0dcad-jarvis-fitness-yanis-emilie-ap`, venv réinstallé.

**4 générations** :
- Phase A, maître seul face stricte : pédalage lisible mais vert sur short et non muscles → refus.
- Phase B, édition de A : noir/vert corrigés, mais même jambe → refus comme seconde phase.
- Phase C, maître + schéma de pose indépendant : genou côté gauche image haut, autre pied bas,
  deux mains aux poignées, quadriceps/mollets verts, machine de face → acceptée comme début.
- Phase D, C + schéma de pose opposé : genou côté droit image haut, autre pied bas ; même machine,
  même orientation, même décor → acceptée comme fin. Seul le schéma abstrait de guidage a été
  symétrisé ; AUCUNE photo/athlète/machine/décor n'a été retourné en miroir.
Assemblage des photos C+D par PIL, lecture des deux cases pleine définition puis contrôle GIF.
Les bras restent sur les poignées ; l'alternance est démontrée par les jambes et pédales.

GIF 292×440, deux frames 500 ms, boucle infinie. Vert ROI jambes **638 / 319 pixels**,
différence moyenne ROI 43,30 niveaux RGB. Mesures `verification/lot56-mesures.json`.
`verif-ids.py` OK ; 389 SHA du manifeste contrôlés ; état 389/0 ; a-refaire.json vide
(ancienne reprise conservée en historique). Contrôle accepté `review/lot56-homme.jpg`.
PDF **131 pages / 389 exercices**, les 388 numéros antérieurs inchangés (assertion).
Index 389 ; manifeste/état/map mis à jour. Simulation du hook extrait du bundle : 6 résolutions
(talons, talons effort, elliptique fractionné × profils Yanis/Émilie) correctes, rapport
`verification/lot56-profils.json`.

Chaîne payloads → overlay → build --unsigned OK : **389 GIF SHA, 715 fichiers web, 9 DEX identiques**,
aucun média manquant, APK non signé 114574436 octets. Pas d'APK signé livré.

**Prochaine action = ÉTAPE 2** : attendre les retours utilisateur par NUMÉRO du PDF, corriger en
priorité sans renumérotation. Ne pas lancer étape 3 (réglage niveau cardio) avant fin de sa revue
ou instruction explicite. 33 cas style et autres décisions de CE-QUI-COINCE §3 toujours ouverts.


## 74. Lot 57 — retours PDF utilisateur, PROPOSITIONS AVANT VALIDATION (26/09/2026)

**Nouvelle règle explicite : « Montre-moi corrections avant validation ».** Aucun GIF livré,
PDF principal, manifeste, état publié, map ou numéro modifié. Les 389 entrées existent toujours,
mais le « 389 validés » historique n'est PLUS un verdict de qualité après les retours utilisateur.
Registre `production/retours-utilisateur-2026-09-26.json` : **22 numéros signalés + 3 variantes = 25 points**.
Reprises inscrites dans `production/a-refaire.json`, statuts distincts, accord par numéro obligatoire.

Tous les retours : 19, 26, 31, 37, 44, 45, 46, 64, 80, 85, 87, 90, 126, 148, 150, 194, 204,
222, 298, 239, 265, 380. Extensions : marteau assis 38 ; Zottman assis 47 et Scott un bras 48.
**Ambiguïtés** : 148 est Mountain climbers homme, Pallof élastique femme est 149 (ne pas modifier
148 par supposition). 150 : confirmer même corps/cadrage avec bras mobiles. Zottman : proposer
4 phases pour monter supination/descendre pronation ; attendre accord avant changement de format.
80 : nom du registre Écartés haltères, pas « incliné » ; vérifier avec utilisateur avant changer banc.
265 : prescription = avant-bras 90° au montant, fente douce vers avant, étirement pectoral, changer côté.

Workspace réinitialisé, repris e538e03 (arbre propre) sur branche 01a0dcad ; venv restauré.
**10 générations** : 8 planches initiales + 2 reprises guidées par schémas indépendants (37,64).
Tous les noms vérifiés `verif-ids.py`, prescriptions lues ; images lues pleine définition.

| N° | Verdict de préparation, PAS validation utilisateur |
|---|---|
|19|Proposition : jambe arrière corrigée, même jambe ; amplitude de départ déjà fléchie à apprécier. Vert olive : ZERO pixel au seuil lime strict, à renforcer avant intégration.|
|26|Refus interne : éloignement insuffisant, pieds coupés, amplitude insuffisante.|
|31|Refus interne : rotation de main départ non obtenue.|
|37|Essai1 refusé (supination), essai2 schéma marteau vertical : proposition paumes neutres.|
|38|Refus interne : supination en haut ; utiliser schéma gagnant 37 au prochain lot.|
|44|Refus interne : bras encore à côté du pupitre au départ, supination en haut.|
|45|Refus interne : quasi inchangé.|
|64|Essai1 refusé (banc incliné mauvais sens), essai2 schéma tête basse : proposition décliné ; prise à relire avec utilisateur.|

Les 3 propositions sont ISOLÉES dans `propositions/lot57/` (planches, GIF candidats, mesures).
**Document à montrer** : `review/LOT57-propositions-avant-validation.pdf` (4 pages) : avant/proposition
19,37,64 puis suivi complet des 25 points. Contrôles JPG `review/lot57-proposition-femme.jpg`,
`review/lot57-propositions-homme.jpg`. Les 5 refus internes ne sont pas présentés comme corrections réussies.
Mesures `propositions/lot57/mesures.json` : 2×500 ms ; vert ROI 19=0/0 (olive), 37=14/3 (faible),
64=184/74. Ne PAS confondre approbation gestuelle des propositions et contrôle final prêt à intégrer.

Assertions binaires : PDF principal, manifeste, numérotation, état et TOUS GIF livrés identiques à HEAD.
Aucun `valide-couples.py`, `maj-manifeste-331.py`, rebuild PDF principal ni APK exécuté.
**Suite** : attendre avis sur propositions et réponses aux questions ; continuer les reprises par lots
≤10. Toute intégration nécessite accord explicite ET contrôles finaux (notamment vert de 19).
Étape2 toujours en cours ; étape3 interdite sans instruction. Les 33 cas style historiques restent séparés.


## 75. Lot58 — clarifications utilisateur, rappels d’étapes, propositions Pallof (26/09/2026)

**Nouvelles consignes confirmées** :
-148 = Mountain climbers homme, image finale à TROIS jambes ; cible désormais certaine.
-149 ET150 = deux Pallof à retravailler ;149 ajouté au registre (pas remplacé par148).
-Zottman46/47/48 : accord pour préparer4 positions, PAS validation des images.
-Quand TOUTES les corrections demandées sont prêtes, fournir UN PDF téléchargeable dans le chat,
  UNIQUEMENT exercices concernés, **AVANT À GAUCHE / APRÈS À DROITE, côte à côte**.
  Aucun PDF partiel présenté comme final. Le comparatif du lot57 était empilé : il est historique.
-**AVANT étape3, poser la question** : uniformiser le vert des muscles sur celui du **n°260** ?
  Ne pas prendre cette décision à la place de l’utilisateur, ni recolorer automatiquement.
-**Au moment de construire l’application**, rappeler à l’utilisateur d’ajouter **metcon + piscine
  nage fractionnée et/ou Aqua tabata pour Émilie**. Ce rappel n’autorise pas encore le codage.
Rappels structurés : `production/rappels-utilisateur.json`, statuts à demander / à rappeler.

Registre : **26 points =23 numéros directement concernés +3 variantes**, tous non approuvés.
5 propositions existantes au total :19/37/64 (lot57),149/150 (lot58) ;21 encore à préparer/expliquer.
Le registre conserve pour chaque AVANT le chemin GIF, SHA et commit figé e538e03 ; ne PAS utiliser
aveuglément la planche source (celle associée au n°148 montre une femme alors que le GIF livré
homme est bien un homme à3 jambes). Le comparatif lit les GIF exacts, pas cette association erronée.

**8 appels génération, dont1 échec technique** (plafond10 respecté) :
-148 essai1 : encore3 jambes → refus ; essai2 schéma deux jambes : plus de jambe surnuméraire,
  mais même jambe pliée dans les deux cases → refus (deux images empilées, non converties).
-149 : proposition frontale stable, élastique ancré à gauche, bras repliés→tendus ; non validée.
-150 : proposition même corps/cadrage, poulie à droite, bras repliés→tendus ; non validée.
-46 : premier appel sans image (MAX_TOKENS), second2×2 : pas de rotation nette des prises → refus.
-47 : grille2×2, supination identique aux cases2/3 et1/4 → refus.
-48 :4 cases horizontales, même prise et bras à côté du pupitre en bas → refus.
Tous les fichiers isolés sous `propositions/lot58/`, aucun n’est intégré.

`verif-ids.py` OK pour6 identifiants. Seuls149/150 convertis en GIF CANDIDATS (396×440,2×500ms).
Contrôle `review/lot58-propositions-pallof.jpg`, lecture pleine définition puis GIF.
Mesures ROI abdomen :0/0 pixels au seuil strict lime sur les deux propositions (teinte jaune-vert).
C’est un contrôle gestuel proposé, pas une validation couleur ; arbitrage futur n°260 non anticipé.
Prochaines stratégies :148 deux phases séparées avec jambe lointaine explicitement guidée ;
Zottman une paire curl classique et une paire curl INVERSÉ indépendantes, contrôle de chaque prise
avant assemblage4 frames. Ne jamais considérer4 cases identiques comme cycle correct.

**Outil comparatif** `tools/pdf-corrections-avant-apres.py` :
-Une page par numéro concerné, avant gauche/après droite, phases2 ou4 dans chaque colonne.
-Lit AVANT depuis le commit figé avec contrôle SHA ; APRÈS depuis proposition avec contrôle SHA.
-Refuse AVANT toute création du PDF final si un numéro n’a pas de proposition (21 manquants actuellement).
-Toujours marqué PROPOSITION NON VALIDÉE ; aucune écriture du manifeste/GIF livré.
Tests : rejet du registre incomplet ; test2 pages149/150 dans .cache seulement (4 images/page,
coordonnées AVANT gauche/APRÈS droite vérifiées) ; lecture4 frames synthétiques OK.
Aucun PDF final de corrections créé/livré ce tour. Le PDF principal389 exercices reste inchangé.

**Suite** : rester à l’étape2, continuer les reprises par lots≤10 puis comparatif complet, accord utilisateur
par numéro avant intégration. Les nouveaux rappels sont des arrêts obligatoires aux étapes indiquées.


## 76. Lot59 — cinq numéros supplémentaires proposés, AUCUNE intégration (26/09/2026)

**10 générations** :6 initiales (90,126,194,222,239,380) +4 reprises (90,126,222,239).
Prescriptions relues et AVANT extrait des GIF réellement livrés (pas des planches associées).
Propositions NON VALIDÉES :
-90 : essai1 refusé (support plié + curl) ; essai2 schéma indépendant : support tendu et vraie
  élévation latérale. Recalage automatique -92px coupait mains/haltère : GIF candidat reconstruit
  des deux demi-planches ENTIÈRES sans recalage, hauteur440,2×500ms. Vert ROI242/212 pixels.
-194 : même jambe droite appuyée sur step au départ et à l’arrivée. Réserve explicite : disques
  de barre partiellement coupés ; ce n’est PAS prêt à intégrer sans revue/correction de cadrage.
-222/298 : femme debout DANS le bassin, pieds au fond, jambes sous eau. Eau aux hanches ; profondeur
  à apprécier par utilisateur (ne pas prétendre que l’abdomen est immergé). Essai2 demandant eau
  poitrine n’a pas remonté l’eau de départ ; essai1 conservé comme proposition.298 copie conforme
  CANDIDATE de222, aucune copie dans le répertoire GIF livré.
-380 : tronc reste orienté droite, jambe devant puis derrière. Proposition non validée.
Refus :126 (tronc corrigé face sol, pieds/ballon encore coupés ou zoom différent après reprise) ;
239 (bras croisé devant poitrine, puis essai2 sans main au mur au départ et coude plié fin).
Stratégies différentes suivantes consignées dans a-refaire.json et registre retours.

**Total :10 propositions sur26 points** (19,37,64,90,149,150,194,222,298,380), aucune approuvée.
16 points sans proposition :26,31,38,44,45,46,47,48,80,85,87,126,148,204,239,265.
Les réserves de cadrage/style sur propositions existantes restent OUVERTES : « proposition » n’est
ni acceptation de l’utilisateur ni validation technique finale. Ne pas confondre compteurs.
Mesures `propositions/lot59/mesures.json` :90 vert strict positif ;194/222/298/380 zéro au seuil strict
(teinte jaune-vert). Ne pas anticiper décision utilisateur sur vert n°260.
Contrôles à montrer : review/lot59-propositions-homme.jpg et lot59-propositions-piscine.jpg.
Toutes images/GIF candidats isolés sous propositions/lot59/ ; verif-ids OK sur6 identifiants.

Assertions : PDF principal, manifeste, état, numérotation et TOUS GIF livrés identiques à HEAD.
Outil comparatif refuse le registre incomplet (16 manquants), aucun PDF final créé. Pas de build APK.
Rester étape2. PDF final quand tout prêt : seulement reprises, AVANT gauche / APRÈS droite,
lien téléchargeable dans le chat, validation utilisateur avant intégration.
**Rappels maintenus** : AVANT étape3 poser question vert identique260 ; à construction app rappeler
metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie, puis confirmer périmètre.


## 77. Lot60 — trois propositions supplémentaires, aucune validation (26/09/2026)

Workspace réinitialisé au commit initial : arbre propre, fetch/reset sur branche de session,
reprise du dernier état distant **088ac98 (lot59)**, venv restauré. Aucun travail distant écrasé.
Prescriptions relues pour26/38/85/87/204/265 avant génération.

**8 appels génération, dont1 échec technique** :5 initiales38/85/87/204/265,
reprise265 guidée par schéma indépendant,26 nouvelle stratégie vue large, reprise204 sans image.

Propositions isolées NON VALIDÉES :
-**38 curl marteau assis** : référence du37 corrigé, posture assise, prise neutre maintenue et
  haltères verticaux en haut. Deux cases différentes, pieds visibles.
-**87 élévations latérales haltères myo-reps femme** : véritable élévation vers les côtés, pas curl.
  Le protocole myo-reps (séries/pauses) n’est pas modifié, l’image montre seulement le geste.
-**265 étirement encadrement de porte** : essai1 refusé (seule paume au montant, avant-bras pas
  vertical) ; essai2 schéma coude90°, avant-bras sur montant + petite fente avant. Amplitude douce
  et couleur à apprécier. Recalage automatique -84px coupait le bras final : GIF reconstruit
  depuis les demi-planches entières SANS recalage (180×440,2×500ms).

Refus internes :
-26 : mention ABS parasite, câble indépendant passant devant corps sans connexion à la corde,
  faible flexion ; ne pas intégrer. Prochain schéma câble unique correctement relié.
-85 : bras tendus départ, position haute proche tirage et poids coupés. Prochain schéma3D
  coudes90°, avant-bras horizontaux même hauteur, cadre large.
-204 : pronation au lieu de supination, menton sous barre ; reprise échouée techniquement.
  Prochain référence des mains seules + schéma menton au-dessus barre.

`verif-ids.py` OK sur6 identifiants ; toutes images lues pleine définition puis GIF relus.
Mesures ROI dans `propositions/lot60/mesures.json` :38=0/7,87=0/0,265=686/0 pixels strict lime.
Les teintes/ROI ne valent pas validation stylistique : réserves couleur ouvertes, pas d’uniformisation
avant la question260. Contrôles review/lot60-propositions-homme.jpg et lot60-proposition-femme.jpg.
Les3 GIF candidats sont UNIQUEMENT dans propositions/lot60/gif/, aucun GIF livré remplacé.

**Total13 propositions sur26 points**, toutes NON approuvées :19/37/38/64/87/90/149/150/194/222/265/298/380.
**13 sans proposition** :26/31/44/45/46/47/48/80/85/126/148/204/239.
Les réserves de cadrage et de style des candidats des lots précédents restent ouvertes ;
13 propositions ne veut PAS dire13 corrections techniquement terminées.
Comparatif complet bloqué sur ces13 manquants ; aucun PDF final de corrections créé.
Assertions : PDF principal/manifeste/état/numéros/TOUS GIF livrés inchangés. Aucun APK reconstruit.

Étape2 maintenue. À la fin des reprises : PDF UNIQUEMENT exercices concernés, avant GAUCHE/après DROITE,
lien téléchargeable, accord utilisateur avant toute intégration.
Rappels inchangés : AVANT étape3 demander choix vert identique260 ; lors construction application
rappeler metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie, confirmer avant codage.
