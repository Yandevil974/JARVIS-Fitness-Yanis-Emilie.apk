# Triceps #02/#04 — contrôle des MP4 et intégration accompagnée

Date : 25/10/2026

Sources déposées par Yanis : commit `891b7b3`

Statut du lot : **#02 et #04 intégrés en `coached`, jamais `validated`**.

**#03 et #05 restent reportés à la fin, sans MP4 ni statut vidéo.**

## Règle d'accord et statut technique

Yanis a précisé : **« À partir du moment où je mets la vidéo sur ta branche,
c'est validé pour moi. »** Le dépôt des deux sources sur la branche vaut donc
accord d'exploitation et d'intégration. Il n'est pas nécessaire de redemander
une validation d'exploitation.

Cet accord utilisateur ne change pas le résultat de l'inspection technique :
les défauts visibles restent consignés et les deux sources sont exploitées en
`coached`, avec poster de référence, notice propre et descriptif audio
correctif. Elles ne sont pas présentées comme techniquement parfaites.

## Correspondance des fichiers

| # | Exercice et identifiant | Source déposée | Fichier canonique | Programmation | Statut |
|---|---|---|---|---|---|
| #02 | Triceps dips — `triceps-dips` | `1792927642615.mp4` | `public/videos/triceps-dips.mp4` | 4 × 8-10 · `3010` · repos 60 s | `coached` |
| #04 | French press poulie basse — `french-press-poulie-basse` | `1792920234771.mp4` | `public/videos/french-press-poulie-basse.mp4` | 4 × 12-15 · `3010` · repos 120 s | `coached` |

Les deux sources ont été entièrement décodées : **1024×768, 24 i/s, 97 frames,
4,042 s**, sans erreur de lecture jusqu'à la dernière frame. Les copies de
`public/`, `release/` et du dossier de preuve sont identiques aux originaux.

| Source | SHA-256 |
|---|---|
| #02 — `1792927642615.mp4` | `5cb9e08f03f3183f4ff877301d0f1684f3c1ff543756b0630019ccfa04486ba3` |
| #04 — `1792920234771.mp4` | `0009b5c53e9a5db5543f131949ef6887521cb2b5e0575d9ff9d3df69aaf9a7a1` |

## #02 — Triceps dips

### Ce qui est reconnaissable

- Appui sur deux barres parallèles, descente en dips puis retour en haut.
- Le mouvement correspond à la famille demandée, contrairement à l'ancien GIF
  qui montrait des extensions allongées avec haltères.

### Réserves conservées

- Le buste s'incline au lieu de rester proche de la verticale.
- Du texte IA parasite apparaît notamment vers **1,58–2,42 s**, avec un
  filigrane. Ces écritures ne sont pas une consigne de l'application.

### Consigne prioritaire intégrée

Buste droit, épaules basses, coudes près du corps, une main sur chaque barre,
poignets alignés et pieds décollés. Descente en trois secondes jusqu'à environ
90° de flexion des coudes, remontée en une seconde, sans balancement des jambes
ni pause. Le tempo `3010` du programme reste prioritaire.

Preuves : [six instants](controle-02-04/triceps-02-six-instants.jpg) ·
[zooms](controle-02-04/triceps-02-zooms.jpg) ·
[source contrôlée](controle-02-04/triceps-02-source-1792927642615.mp4).

## #04 — French press poulie basse

### Ce qui est reconnaissable

- Position debout dos à la poulie basse avec une corde.
- Cycle haut → mains derrière la tête → retour en haut identifiable.

### Réserves conservées

- Un coude part vers l'avant et l'avant-bras passe parfois devant le visage.
- La corde est peu lisible dans la position basse ; la notice et l'audio doivent
  donc rester explicites sur l'équipement et la position des deux mains.

### Consigne prioritaire intégrée

Dos à la poulie basse, une extrémité de corde dans chaque main, poignets
neutres, buste gainé et deux coudes hauts près des oreilles. Descente des mains
derrière la tête en trois secondes en pliant seulement les coudes, puis remontée
en une seconde en dépliant les coudes. Le tempo `3010` du programme reste
prioritaire.

Preuves : [six instants](controle-02-04/triceps-04-six-instants.jpg) ·
[zooms](controle-02-04/triceps-04-zooms.jpg) ·
[source contrôlée](controle-02-04/triceps-04-source-1792920234771.mp4).

## Intégration réalisée

- Deux entrées `coached` dans `src/data/exercise-videos.js`, chacune avec
  `title`, `handCue`, `movementCue`, `notice` et `spoken` spécifiques.
- MP4 copiés sous leurs identifiants canoniques dans `public/videos/` et
  `release/videos/`, sans réencodage.
- Posters de référence installés dans `public/videos/posters/` et
  `release/videos/posters/` :
  - #02 depuis `vague2-triceps-02-dips.jpg` ;
  - #04 depuis `vague2-triceps-04-poulie-basse.jpg`.
- Les GIF d'origine sont conservés dans `public/` et `release/` :
  `/media/3aea2b016706d5d4.gif` pour #02 et
  `/media/a40720f67740d2a0.gif` pour #04.
- Le pilote #01 `extension-triceps-a-la-poulie` reste `validated` et inchangé.
- Aucun ajout pour `triceps-extensions-halteres-banc-plat` (#03) ou
  `french-press-barre-ez` (#05) : ils restent reportés, sans régénération.
- Aucun changement de programme, de charge, de version ou d'APK.

## Vérifications

- [x] Tests ciblés vidéos et voix : **15/15**.
- [x] Suite Node complète : **221 tests, 219 réussites, 0 échec, 2 ignorés**.
- [x] Suite Playwright complète : **44 scénarios, 33 réussites, 0 échec,
  11 ignorés**. Le parcours #02/#04 couvre les sources, posters, notices,
  consignes de prise, audio et agrandissement de #04.
- [x] Build portable et build Vite : **1679 modules**, **939 médias** indexés.
- [x] Les quatre nouveaux médias applicatifs et les deux GIF d'origine sont
  présents dans `public/` et `release/`.
- [x] Version publiée inchangée : **1.12.0 / 195**. Aucun nouvel APK demandé ou
  produit dans cette étape.
