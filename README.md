# JARVIS-Fitness-Yanis-Emilie.apk

## Version à installer — correctif visuel piscine (1.7.1)

**[Yanis-Fitness-Evolution-1.7.1-piscine-emilie.apk](downloads/Yanis-Fitness-Evolution-1.7.1-piscine-emilie.apk)** — APK signée, copie miroir de la release GitHub.

**Correctif** : « Piscine après musculation » affiche maintenant une femme dans l’eau pour le profil Émilie. Les étapes elliptiques gardent leur visuel de vélo. Les médias GIF et les contenus validés sont inchangés.

Tests : **130 tests, 128 réussis, 0 échec, 2 ignorés**. Build Android signé : réussi.

## Version précédente — METCON Émilie (1.7.0)

**[Yanis-Fitness-Evolution-1.7.0-metcon-emilie.apk](downloads/Yanis-Fitness-Evolution-1.7.0-metcon-emilie.apk)** — APK signée, copie miroir de la release GitHub.

**Chantier 2 validé** : METCON Piscine et METCON Aqua Tabata sont ajoutés au profil Émilie sans modifier les six protocoles source. Le niveau et le choix cardio sur les sept jours du calendrier source sont mémorisés. Sous 45/100, Aqua Recovery est recommandé sans verrouillage dur ; le coach propose au plus un format par semaine.

Durées totales : Piscine **1080 / 1320 / 1620 s** ; Aqua Tabata **1185 / 1475 / 1795 s**.

Tests : **128 tests, 126 réussis, 0 échec, 2 ignorés**. E2E : **17 réussis, 0 échec, 11 ignorés**.

## Version précédente — correctifs visuels du 03/10/2026 (1.6.1)

**[Yanis-Fitness-Evolution-1.6.1-coachs.apk](downloads/Yanis-Fitness-Evolution-1.6.1-coachs.apk)** — APK signé, keystore du dépôt.

**Ce qui change (1.6.1 — trois défauts visuels signalés, corrigés sans toucher
aux chiffres ni aux GIF validés)** :
1. **« Ma bibliothèque »** : les 74 dernières illustrations anatomiques sont
   remplacées par vos photos humaines animées du corpus livré (GIF humain du
   même muscle + même type de mouvement ; table de correspondance dans
   `src/data/gif-overrides.js`, bloc « Rattrapage 03/10/2026 »).
2. **Piscine / aqua — étape « Repos »** : le repli affiche désormais une
   récupération DANS l'eau (marche/récup aquatique), plus l'homme aux
   abdominaux au sol de la salle.
3. **Crawl « Nage douce »** : la paire dont la 2 image redressait la personne
   à la verticale (« personne à l'envers ») est remplacée par la paire du
   corpus à deux images horizontales (femme `a9b2430d317e3bba`,
   homme `f5754e3553d3922c`).

Tests : **119 tests, 117 passent, 0 échec** (3 nouveaux verrous : repli piscine,
crawl propre, bibliothèque 100 % corpus humain).

## Version précédente — coachs réactifs (chantier 1 : A–E) + tous les GIF humains

**[Yanis-Fitness-Evolution-1.6.0-coachs.apk](downloads/Yanis-Fitness-Evolution-1.6.0-coachs.apk)** — APK signé, keystore du dépôt.

**Ce qui change (chantier 1 — propositions A à E validées le 02/10/2026)** :
- **A — Une seule décision du coach par semaine**, calculée sur vos retours réels
  (RPE/RIR saisis, séances manquées, bilans fatigue/douleur, score de récupération,
  progression) et affichée de façon identique dans « Mon équipe », la carte « Le coach
  a noté » et l'en-tête de la prochaine séance. Décisions possibles : protéger
  (douleur), décharge −40 %, allégement −20 %, reprise progressive après coupure,
  prêt à progresser (+2,5 kg), cap maintenu.
- **B — Le bilan agit** : fatigue ≥ 4/5 ou douleur ≥ 3/5 dans le bilan hebdomadaire
  ⇒ la prochaine séance est automatiquement réduite (visible dans « Mes adaptations »,
  une fois par jour, jamais de rattrapage inventé).
- **C — RPE systématique** : RPE moyen > 8,5 ⇒ allègement proposé ; ≤ 6,5 avec toutes
  les séances terminées ⇒ progression de charge annoncée.
- **D — Séances manquées** : alerte avec action pour réajuster la fréquence ; chaque
  séance manquée reste replanifiable depuis Programme.
- **E — Rôles santé et mobilité branchés sur vos données** (douleurs et énergie des
  7 derniers jours, échauffements et retours au calme validés) au lieu de textes fixes.
- Rien d'autre n'a changé : les 209 exercices, les chronos en GIF humain (piscine,
  aqua, METCON, étirements, elliptique, HIIT/Aqua Tabata) sont identiques à la
  version `chrono-gifs-v3`.

Tests : **116 tests, 114 passent, 0 échec** (dont 14 nouveaux pour l'état du coach).

## Version précédente — tous les GIF humains, chrono compris (y compris HIIT / Aqua Tabata)

[Yanis-Fitness-Evolution-1.5.1-chrono-gifs-v3.apk](downloads/Yanis-Fitness-Evolution-1.5.1-chrono-gifs-v3.apk) — 87 763 952 octets, signature `168df81a…` (empreinte SHA-256 dans le `.sha256` joint).

**Le chrono affiche le GIF humain du mouvement exact**, quelle que soit la séance : musculation,
échauffement, étirements, piscine et aqua, cardio elliptique, et désormais les **25 mouvements
HIIT / Aqua Tabata** (Burpees, Squats, Jumping jacks, Montées de genoux, Planche latérale,
Russian twist, Superman, Ponts fessiers, Pompes au mur, Corde invisible, Patineurs…) — avec
la variante femme pour Montées de genoux, Fentes alternées, Ponts fessiers et Squats.

## Version précédente — deuxième passe

[Yanis-Fitness-Evolution-1.5.1-chrono-gifs-v2.apk](downloads/Yanis-Fitness-Evolution-1.5.1-chrono-gifs-v2.apk) — 81 950 730 octets, signature `168df81a…` (empreinte SHA-256 dans le `.sha256` joint).

**Le chrono affiche un GIF humain à chaque étape, quelle que soit son origine** : 50 visuels
d'étapes sont passés des illustrations statiques à des **GIF humains** (variante homme/femme)
— 29 étirements, 19 guides piscine, 10 étapes de protocole piscine/aqua, 5 étapes de cardio
elliptique, 3 étapes d'échauffement — le **dernier exercice de musculation** encore illustré
par une image fixe (« Développé haltères assis ») est corrigé, et un **filet de sécurité**
choisit un GIF humain selon la nature de l'effort : aucun chrono ne peut rester sans humain
animé. Contrôles : 209/209 exercices, 420 étapes de protocoles, 0 visuel introuvable.

## Version précédente — tous les GIF humains, chrono compris

[Yanis-Fitness-Evolution-1.5.1-chrono-gifs.apk](downloads/Yanis-Fitness-Evolution-1.5.1-chrono-gifs.apk) — 81 727 540 octets (première passe du 02/10, remplacée par la `v2`).

## Version précédente — tous les exercices avec leur GIF humain

[Yanis-Fitness-Evolution-1.5.1-gifs-integres.apk](downloads/Yanis-Fitness-Evolution-1.5.1-gifs-integres.apk) — 68 150 190 octets, signature `168df81a…` (empreinte SHA-256 dans le `.sha256` joint).

**Ce qui change** : les **209 exercices** ont maintenant un visuel humain animé (95 avant).

- **38 visuels** viennent des retouches validées (lots 1 à 21, prototype n°44, série
  « femme » au vert corrigé) — ce sont les remplacements demandés.
- **106 visuels** viennent du corpus des GIF livrés (les 389 visuels), attribués à
  l'exercice correspondant.
- **10 guides piscine** reçoivent leur visuel animé à la place de l'illustration statique :
  Ciseaux au bord, Marche aquatique, Aqua-jogging, Battements, Déplacements latéraux,
  Nage douce, Gainage vertical, Sprint (n°292), Retour au calme (n°313), Talons-fesses.
- L'onglet **« Aperçu visuels »** reste disponible pour comparer avant/après.
- Règle respectée : un GIF existant n'a été remplacé que là où une retouche validée le
  concerne.

## Versions précédentes

- [Yanis-Fitness-Evolution-1.5.1-apercu-visuels.apk](downloads/Yanis-Fitness-Evolution-1.5.1-apercu-visuels.apk) — 34 305 511 octets : galerie d'aperçu, médias d'origine.
- [Yanis-Fitness-Evolution-1.5.1.apk](downloads/Yanis-Fitness-Evolution-1.5.1.apk) — 24 564 188 octets : version stable de base (chantier 1).

## Ce qui n'est pas dans ces versions

- Aucun APK d'origine modifié, prescriptions, gestes et prises intouchés.
- Le chantier 2 (METCON Piscine et Aqua Tabata pour Émilie) est livré en 1.7.0.
  La diversification des séances piscine et l'IA conversationnelle restent à venir ;
  l'IA demeure le dernier chantier. Voir `PASSATION-NOUVEAU-CHAT.md`.

## Vérifications

- `npm test` : **130 tests, 128 réussis, 0 échec, 2 ignorés**.
- E2E (dernière exécution en 1.7.0) : **17 réussis, 0 échec, 11 ignorés**.
- Audit GIF : 209/209 exercices, 58 positions d'étirement, 1454/1454 étapes
  piscine/aqua, 50/50 HIIT, 912/912 METCON, 0 média manquant ; audit statique :
  0 étape statique.
- APK : archive saine (`unzip -t`), signature v2 avec le certificat du keystore du dépôt.
