# JARVIS-Fitness-Yanis-Emilie.apk

## Version à installer — aperçu des visuels retouchés

[Yanis-Fitness-Evolution-1.5.1-apercu-visuels.apk](downloads/Yanis-Fitness-Evolution-1.5.1-apercu-visuels.apk) — 34 305 511 octets, SHA-256 `4c38a85d1b192fbce98e925d8ac5c1d2def93b99bbe71489fed5341763e7656e`, signature `168df81a…`.

Cette version ajoute un onglet **« Aperçu visuels »** dans le menu : les **87 visuels
retouchés** (lots 1 à 21 + prototype n°44) et les **10 corrections de vert du chantier 2
« femme »** (28 numéros) — soit **115 numéros**, à juger à l'œil sur le téléphone.

**Rien n'est remplacé** : ces visuels sont posés à côté, dans `public/apercu/` ; les GIF
déjà livrés et les médias de l'application sont intacts. L'intégration aux médias ne se
fera qu'après accord, numéro par numéro.

Ce qu'il faut regarder en premier (tirent vers le cyan : l'eau du bassin peut avoir été
prise pour le muscle peint) : **n°292, 313, 210, 274, 326**.

Installation : directe, **à côté** de JARVIS Fitness 1.5.0 (identifiant distinct,
`app.yanis.fitness.evolution`) ; rien n'est écrasé.

## Version stable (sans la galerie)

[Yanis-Fitness-Evolution-1.5.1.apk](downloads/Yanis-Fitness-Evolution-1.5.1.apk) — 24 564 188 octets, SHA-256 `d44bda228fdcb70d3a65c2e1443c54cb0918b2843fb4a98bdc574c454f2aba0d`, signature `168df81a…`.

Contient le **chantier 1** (seuil « 3 séances dures / 7 jours » de Yanis) : retour strict à
la source avec `sourceProtoName()` / `sourceHardSession()`.

## Ce qui n'est pas dans ces versions

- Aucun GIF livré n'a été remplacé, aucun APK d'origine modifié, prescriptions, gestes et
  prises intouchés.
- Les visuels de la galerie restent hors des médias de l'application tant qu'ils ne sont
  pas validés numéro par numéro.

## Vérifications

- 96 tests unitaires : **94 passent, 0 échec, 2 ignorés**.
- APK : archive saine (`unzip -t`), signature v2 avec le certificat du keystore du dépôt.
- Empreintes : `sha256sum -c *.sha256` dans `downloads/`.
