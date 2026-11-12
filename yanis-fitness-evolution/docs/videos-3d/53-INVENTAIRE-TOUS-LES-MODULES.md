# Inventaire des vidéos — tous les modules

Objectif demandé par Yanis : **tous les mouvements et étapes de tous les modules doivent disposer de leur vidéo**, y compris piscine, aqua Tabata, Tabata/HIIT, elliptique, étirements, récupération et les éléments dynamiques. Les GIF restent conservés. Le plan historique par familles d'étirements et ses ~230 vidéos ne constituent plus un objectif complet.

## État constaté sur la branche

- Musculation : 203 fiches Elite + Émilie, 130 avec vidéo, **73 sans**. Triceps #11 est compté parmi les 73 mais reste en stand-by. Sur les fiches couvertes, 120 `coached`, 10 `validated` ; une réserve n'implique pas qu'il faut refaire la vidéo, et les vidéos acceptées en l'état ne sont pas à régénérer.
- Catalogue Jarvis seul : 6 fiches, 5 avec vidéo, **1 sans vidéo associée à la fiche** : respiration diaphragmatique. Au total, 209 fiches, 135 couvertes et **74 non couvertes**.
- Échauffement : 5 étapes avec vidéo enregistrée et un montage. Les approches utilisent la vidéo du premier exercice quand elle existe. La vidéo de mobilité des épaules est réutilisée pour la fiche Jarvis du même nom, en `coached` avec consigne propre ; la vidéo du pont fessier est également réutilisée pour la fiche d'activation au sol. Ne pas présumer qu'il faut une génération supplémentaire si la même vidéo exacte existe déjà.
- Étirements : **29 fiches distinctes**, toutes sans vidéo 3D associée ; la bibliothèque contient déjà des GIF mais ne branche pas ces fiches sur `stepVideoFor`. Les noms proches restent distincts dans cet inventaire, sans affirmer qu'il faut deux fichiers pour une posture identique.
- Tabata/HIIT au sol : 6 modes, 48 occurrences et **38 libellés distincts** ; aucun n'a de vidéo 3D résolue pour l'étape générée avec son suffixe `round`. Les « pompes » ont déjà une vidéo dans le catalogue : il faut vérifier et raccorder la source appropriée plutôt que la recréer d'office. Les noms variant ou les exercices partiellement semblables ne sont pas automatiquement fusionnés.
- Piscine et aqua (6 protocoles source, 2 METCON et 2 facultatifs) : **960 occurrences** dans les trois niveaux, **217 libellés exacts** ; lorsqu'on retire seulement les numéros de tour, palier et effort variable, **56 libellés** demeurent, tous sans vidéo d'étape associée. Ces 56 couvrent également des phases de repos et de départ et contiennent de nombreux synonymes ou étapes voisines : ce ne sont pas 56 vidéos distinctes obligatoires. Les listes source Elite et Émilie sont identiques actuellement ; les niveaux et tours ne doivent pas être comptés comme de nouveaux mouvements à chaque répétition.
- Elliptique : **5 guides** sans vidéo d'étape enregistrée : mise en route, fractionné, récupération active, retour au calme et transition. Une même vidéo ne convient que si elle montre réellement la phase concernée.

Les cinq catégories précédentes représentent **202 entrées/libellés à couvrir avant rapprochement** (74 + 29 + 38 + 56 + 5), **pas 202 vidéos à générer** : une même action figure dans plusieurs modules et une vidéo déjà présente peut parfois servir. Ce chiffre n'est pas exhaustif pour tous les écrans ; il ne comprend notamment pas les sélecteurs et routines ci-dessous. Il ne faut pas l'additionner aux 73. Le nombre exact de nouveaux fichiers à générer pour couvrir toute l'application n'est pas encore établi : il dépend d'un rapprochement technique mouvement par mouvement et des vidéos existantes, pas d'une estimation par familles.

## À intégrer aussi dans l'inventaire complet

- Générateur cardio : course, vélo, elliptique, marche, rameur, cardio libre, allures, phases d'effort et de récupération. Le cardio « libre » ne désigne pas une activité unique et ne permet pas de définir à lui seul une vidéo exacte.
- Piscine personnalisée : crawl, brasse, dos, papillon et « libre », avec distances et rounds variables. « Libre » n'impose pas un style unique ; ne pas inventer une technique. Les protocoles fractionnés, pyramides, aqua HIIT, aqua Tabata et METCON reprennent des mouvements communs mais aussi des phases distinctes.
- Séances de récupération : respiration lente, cercles d'épaules, rétraction scapulaire, mobilité thoracique gauche/droite, mobilité poignets/coudes, respiration détendue et huit étirements issus de la bibliothèque.
- Étapes de repos, départ de tour, transitions, échauffement et retour au calme : elles sont dans l'objectif de couverture, pas exclues. Une phase composée de plusieurs consignes peut nécessiter plusieurs mouvements ou un montage ; cela reste à définir sans inventer une correspondance.
- Les circuits composés de plusieurs mouvements et les approches liées aux exercices peuvent demander plusieurs démonstrations, et pas nécessairement un MP4 différent pour chaque répétition numérotée.

Actuellement le registre `step-videos.js` ne référence que l'échauffement, et sa résolution est par nom exact normalisé. Les libellés dynamiques (rounds, distances, styles) et certains écrans de bibliothèque d'étirements devront être raccordés explicitement : **présence d'un MP4 dans le dépôt ≠ affichage partout où il est nécessaire**.

## Épaules #11 : vidéo déposée et accompagnée

La vidéo propre à #11 a été déposée et intégrée en `coached`. Elle montre le développé assis, mais la rotation et la prise neutre en bas ne sont pas clairement visibles : la notice et la voix rappellent de suivre la consigne, non la prise de l'image. Le GIF reste disponible en repli. Détails dans [le contrôle du lot](./58-EPAULES-11-15-ET-18-POTEAU.md).

## Détail des libellés recensés

### 29 fiches d'étirement sans vidéo associée

- Étirement dans l'encadrement de porte
- Bras tendu contre le mur
- Position de l'enfant (Balasana)
- Suspension à la barre
- Torsion allongée
- Mains croisées derrière le dos
- Bras tendu contre la poitrine
- Bras tendu devant, main tirée
- Bras tendu derrière
- Coude au-dessus de la tête
- Main dans le dos
- Étirement des fléchisseurs
- Étirement des extenseurs
- Étirement du cobra
- Position de l'enfant
- Torsion allongée genoux
- Pigeon assis
- Talon vers la fesse (debout)
- Allongé sur le côté
- Flexion avant jambes tendues
- Une jambe tendue, une pliée
- Grenouille (plantes jointes)
- Étirement contre le mur
- Mollet en escalier
- Étirement du piriforme assis
- Adduction de la hanche debout
- Étirement du fléchisseur de hanche (chevalier)
- Cobra doux
- Respiration diaphragmatique allongée

### 38 libellés Tabata/HIIT au sol sans vidéo associée

- Battements de jambes
- Burpees
- Burpees simplifiés
- Chaise au mur
- Chaise douce
- Corde invisible
- Crunch
- Dead bug
- Dips au bord
- Fentes alternées
- Fentes arrière
- Gainage planche
- High knees
- Jumping jacks
- Marche sur place
- Mollets
- Montées de genoux
- Montées sur mollets
- Mountain climbers
- Mountain climbers lents
- Oiseau-chien
- Patineurs
- Planche
- Planche latérale D
- Planche latérale G
- Pompes
- Pompes au mur
- Pompes inclinées
- Ponts fessiers
- Relevés de jambes
- Repos actif
- Respiration profonde
- Russian twist
- Squats
- Squats doux
- Squats sautés
- Squats sumo
- Superman

### 56 libellés piscine/aqua sans vidéo associée, numéros de répétition retirés

- Aqua-jogging sur place
- Aqua-jogging — EFFORT
- Aqua-jogging — effort variable
- Battements de jambes — EFFORT
- Battements de jambes — effort variable
- Ciseaux au bord — EFFORT
- Ciseaux au bord — effort variable
- Ciseaux — mains au bord
- Déplacements latéraux (4 m)
- Déplacements latéraux (4 m) — EFFORT
- Déplacements latéraux (4 m) — effort variable
- Gainage vertical au bord
- Gainage vertical — EFFORT
- Gainage vertical — effort variable
- Marche aquatique — récupération active
- Marche aquatique — récupération entre les pyramides
- Marche aquatique — récupération entre les tours
- Mobilité hanches / chevilles
- Mobilité épaules aquatique
- Montées de genoux
- Montées de genoux — EFFORT
- Montées de genoux — effort variable
- Nage douce
- Nage douce + respiration
- Nage douce sur place
- Nage en pyramide — palier
- Nage statique Z2
- Nage statique Z2/Z3
- Nage statique douce
- Nager sprint
- Nager — fractionné
- Pompes au bord — EFFORT
- Repos
- Retour au calme
- Retour au calme + mobilité
- Retour au calme + respiration
- Retour au calme — nage douce
- Retour au calme — nage très douce
- Récup active — marche aquatique
- Récup complète — souffler au bord
- Récup courte — marche
- Récup entre tabatas
- Récup — marche
- Récup — marche aquatique
- Récupération — marche aquatique
- Tabata — en place
- Talons-fesses — EFFORT
- Talons-fesses — effort variable
- Tour aqua — départ
- Tour — en place
- Échauffement soigneux — nage douce
- Échauffement — battements + mobilité
- Échauffement — battements au bord
- Échauffement — marche aquatique
- Échauffement — nage douce
- Étirements au bord

### 5 guides cardio / elliptique sans vidéo associée

- Elliptique — mise en route
- Elliptique — fractionné
- Elliptique — récupération active
- Elliptique — retour au calme
- Transition

## Reproduire le comptage

À la racine de `yanis-fitness-evolution` : `node scripts/audit-videos-tous-modules.mjs --json`. Le script lit les données réellement utilisées et s'arrête si les protocoles piscine des deux profils divergent. Les compteurs sont datés de l'état de la branche lors de l'audit : ils changent dès qu'une vidéo est intégrée.
