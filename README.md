# JARVIS-Fitness-Yanis-Emilie.apk

## Version à installer

[Yanis-Fitness-Evolution-1.5.1.apk](downloads/Yanis-Fitness-Evolution-1.5.1.apk) — 24 564 188 octets, SHA-256 `d44bda228fdcb70d3a65c2e1443c54cb0918b2843fb4a98bdc574c454f2aba0d`, signature `168df81a…`.

Installation directe **à côté** de JARVIS Fitness 1.5.0 : identifiant distinct
(`app.yanis.fitness.evolution`), rien n'est écrasé, les deux jeux de données restent
indépendants.

Fichier identique à l'octet près à l'APK de la release
[v1.5.1-evolution-build4](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.5.1-evolution-build4)
(signature vérifiée : certificat du keystore de l'application).

## Ce que contient cette version (1.5.1, build 4)

- **Chantier 1** : seuil « 3 séances dures / 7 jours » de Yanis — retour strict à la source
  (`sourceProtoName()` / `sourceHardSession()`). Trois METCON « HIIT + Swim Sprint »
  donnent désormais 6 séances dures côté application, comme la source (bascule en modéré),
  au lieu de 0. L'ajout « RPE ≥ 8 » est retiré.
- **96 tests : 94 passent, 0 échec, 2 ignorés.**
- Cardio & piscine des deux profils conformes aux sources ; METCON, piscine fractionnée et
  Aqua Tabata confirmés.

## Ce qui n'est pas dans cette version

- Les 87 visuels refaits (21 lots + prototype n°44) et les 10 corrections de vert du
  chantier 2 — **hors application**, en attente de validation numéro par numéro.
- Aucun GIF livré n'a été remplacé, aucun APK d'origine modifié.

## Installation

1. Télécharger `Yanis-Fitness-Evolution-1.5.1.apk` ci-dessus.
2. Autoriser « installer des applications inconnues » pour le navigateur si demandé.
3. Ouvrir le fichier et installer.

Pour vérifier l'empreinte : `sha256sum -c Yanis-Fitness-Evolution-1.5.1.apk.sha256`.
