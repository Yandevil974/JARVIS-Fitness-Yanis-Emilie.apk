# JARVIS-Fitness-Yanis-Emilie.apk

## Version à installer — tous les exercices avec leur GIF humain

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
- Les 4 chantiers demandés le 02/10/2026 (coachs, metcon piscine/aqua pour Émilie,
  diversification des séances piscine, IA conversationnelle) sont à mener dans un
  nouveau chat — voir `PASSATION-NOUVEAU-CHAT.md`.

## Vérifications

- 96 tests unitaires : **94 passent, 0 échec, 2 ignorés**.
- 209/209 exercices avec visuel présent dans le magasin média, 0 fichier manquant, 0
  vignette manquante.
- APK : archive saine (`unzip -t`), signature v2 avec le certificat du keystore du dépôt.
