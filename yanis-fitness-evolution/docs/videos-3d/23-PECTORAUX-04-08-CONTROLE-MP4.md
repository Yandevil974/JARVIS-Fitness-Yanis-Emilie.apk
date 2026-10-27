# Pectoraux #04→#08 — contrôle et intégration des MP4

**Date : 27/10/2026 · Sources déposées par Yanis dans `bc5d963`**

## Verdict

| N° | Exercice | Source retenue | État |
|---|---|---|---|
| #04 | Développé incliné barre | `1793102790470.mp4` | **Intégré `coached`** — trajectoire sternum prioritaire |
| #05 | Développé haltères plat prise neutre | `1793102886886.mp4` | **Intégré `coached`** — appuis et synchronisation prioritaires |
| #06 | Écartés haltères décliné | `1793103523306.mp4` | **Intégré `coached`** — paumes au plafond, coudes fixes et grand arc prioritaires |
| #07 | Développé haltères incliné 30° | `1793102874770.mp4`, **source identique à #03** | **Intégré `coached`** — tempo `4010` prioritaire |
| #08 | Développé haltères décliné prise neutre | `1793102776303.mp4` | **Intégré `coached`** — tempo `4010` prioritaire |

Le dépôt des sources vaut accord d'intégration. **`coached` ne signifie pas
validé techniquement** : les posters, notices et descriptifs audio ci-dessous
restent prioritaires sur les défauts repérés. Aucun GIF n'a été supprimé.

## Correspondances et intégrité

Tous les fichiers sont entièrement décodés avec OpenCV headless : **24 i/s**,
**97/97 frames**, **4,042 s**, sans erreur de lecture. Instants inspectés :
**0,00 ; 0,79 ; 1,58 ; 2,42 ; 3,21 ; 4,00 s**. Les planches conservent le rapport
d'aspect des sources, notamment celui carré de #05.

| N° | Source | Dimensions | SHA-256 |
|---|---|---:|---|
| #04 | `1793102790470.mp4` | 640×360 | `a528d6247264601aadf877d502f10c84d3d256f43b90884c19fabde5c145925c` |
| #05 | `1793102886886.mp4` | 1024×1024 | `980a2bedb84f0d49348158d2d184577a30fed41556f986743c7745069a148c55` |
| #06 | `1793103523306.mp4` | 640×360 | `1f0c03735eae4174cd773f4ce7b99a65ed6005e3a4be813912a9693bd2301557` |
| #07 | `1793102874770.mp4` | 640×360 | `7f0a54a9fea81ce5cb9d02eeb0c7b0dfff5fd7bb29cd178884dc8319b0e3d5e7` |
| #08 | `1793102776303.mp4` | 640×360 | `5b9e772704164192379c3768369ff6943136471da3c777c267eaba55743e82d6` |

La source #07 est **strictement identique, octet pour octet**, à
`1792945064689.mp4`, déjà utilisée pour #03 : même SHA-256 et comparaison `cmp`
réussie. Elle illustre donc le même geste incliné, mais **ce n'est pas une
nouvelle animation distincte**. Son utilisation pour #07 impose de suivre le
tempo `4010` du catalogue et non la vitesse visible.

Programmation conservée : #04 **5 × 8-10 · `3010` · 60 s** ; #05
**5 × 10-12 · `3010` · 60 s** ; #06 **5 × 12-15 · `3010` · 120 s** ;
#07 et #08 **4 × 8-10 · `4010` · 90 s**.

## Contrôle technique

### #04 — Développé incliné à la barre

- **Conforme :** banc incliné, une seule barre droite, départ en haut, descente
  et retour sont lisibles.
- **Réserve importante :** la barre passe devant le visage et se rapproche du
  cou au lieu de rester sur la ligne du sternum.
- **Consigne prioritaire :** tête appuyée, barre au-dessus puis vers le
  haut/milieu du sternum, descente en trois secondes et poussée en une seconde.
  Ne pas reproduire la trajectoire vers le visage ou le cou.

[MP4 contrôlé](./controle-pectoraux-04-08/pectoraux-04-source-1793102790470.mp4) ·
[Six instants](./controle-pectoraux-04-08/pectoraux-04-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-04-08/pectoraux-04-zoom-technique.jpg)

### #05 — Développé haltères plat en prise neutre

- **Conforme :** banc plat, deux haltères et orientation neutre des prises sont
  identifiables.
- **Réserves :** le buste se redresse, les appuis se soulèvent et les deux bras
  perdent leur synchronisation. La coloration musculaire devient également
  instable ; elle ne sert pas de repère d'exécution.
- **Consigne prioritaire :** tête, omoplates et hanches appuyées, paumes face à
  face, deux haltères qui descendent ensemble en trois secondes puis remontent
  ensemble en une seconde. Ne pas transformer la poussée en redressement du
  buste.

[MP4 contrôlé](./controle-pectoraux-04-08/pectoraux-05-source-1793102886886.mp4) ·
[Six instants](./controle-pectoraux-04-08/pectoraux-05-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-04-08/pectoraux-05-zoom-technique.jpg)

### #06 — Écartés haltères décliné

- **Conforme :** banc décliné, deux haltères, ouverture et fermeture en arc sont
  reconnaissables ; les paumes sont orientées vers le haut sur les positions
  extrêmes.
- **Réserves :** les bras se désynchronisent, les coudes se plient davantage en
  cours de cycle et les mains/haltères se déforment ponctuellement.
- **Consigne prioritaire :** **paumes vers le plafond pendant toute la
  répétition**, dos des mains vers le sol, léger angle de coude fixe, deux bras
  qui ferment le grand arc en une seconde puis l'ouvrent en trois secondes. Ne
  pas transformer le mouvement en développé.

[MP4 contrôlé](./controle-pectoraux-04-08/pectoraux-06-source-1793103523306.mp4) ·
[Six instants](./controle-pectoraux-04-08/pectoraux-06-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-04-08/pectoraux-06-zoom-technique.jpg)

### #07 — Développé haltères incliné à 30°

- **Conforme :** banc incliné, deux haltères et cycle de développé lisibles.
- **Réserves :** la source est identique à #03, sa durée de **4,042 s** ne permet
  pas de reproduire littéralement une descente de quatre secondes suivie d'une
  poussée d'une seconde ; la tête se redresse légèrement et les haltères se
  rapprochent du visage.
- **Consigne prioritaire :** banc à 30°, tête appuyée, haltères à côté du haut de
  la poitrine, **descente en quatre secondes et poussée en une seconde**. La
  vitesse visible ne doit pas être copiée.

[MP4 contrôlé](./controle-pectoraux-04-08/pectoraux-07-source-1793102874770.mp4) ·
[Six instants](./controle-pectoraux-04-08/pectoraux-07-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-04-08/pectoraux-07-zoom-technique.jpg) ·
[Source #03 identique déjà documentée](./controle-pectoraux-01-04/pectoraux-03-source-1792945064689.mp4)

### #08 — Développé haltères décliné en prise neutre

- **Conforme :** banc décliné, deux haltères, prise neutre et cycle de poussée
  sont lisibles, avec des appuis globalement stables.
- **Réserve :** la durée de **4,042 s** rend la descente trop rapide pour le
  tempo `4010`, qui exige quatre secondes de descente puis une seconde de
  poussée.
- **Consigne prioritaire :** paumes face à face, deux haltères synchronisés à
  côté du bas de la poitrine, descente en quatre secondes et poussée en une
  seconde, sans collision ni rotation des avant-bras.

[MP4 contrôlé](./controle-pectoraux-04-08/pectoraux-08-source-1793102776303.mp4) ·
[Six instants](./controle-pectoraux-04-08/pectoraux-08-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-04-08/pectoraux-08-zoom-technique.jpg)

## Intégration applicative

- `/videos/developpe-incline-barre.mp4` ;
- `/videos/developpe-halteres-plat-prise-neutre.mp4` ;
- `/videos/ecartes-halteres-decline.mp4` ;
- `/videos/developpe-halteres-incline-30.mp4` ;
- `/videos/developpe-halteres-decline-prise-neutre.mp4` ;
- cinq posters issus des références de production #04→#08 ;
- cinq entrées `coached`, chacune avec `title`, `handCue`, `movementCue`,
  `notice` et `spoken` adaptés à ses propres réserves ;
- GIF #04→#08 conservés, vidéos et statuts précédents inchangés ;
- version **1.12.0 / 195** inchangée, aucun APK produit ;
- #11 triceps toujours en stand-by.

Les sources, planches de contrôle et métadonnées sont conservées dans
[`controle-pectoraux-04-08/`](./controle-pectoraux-04-08/). Les prompts de
production restent dans
[`22-PECTORAUX-04-08-PRODUCTION.md`](./22-PECTORAUX-04-08-PRODUCTION.md).

## Validation finale

- **Tests ciblés Node : 21/21 réussites.**
- **Parcours ciblé Playwright : 1/1 réussite**, avec les huit vidéos pectorales,
  leurs posters, notices et descriptifs audio.
- **Suite Node complète : 227 tests — 225 réussites, 0 échec, 2 ignorés.**
- **Suite Playwright complète : 47 scénarios — 36 réussites, 0 échec,
  11 ignorés.**
- Un scénario de test du coach dépendant du jour a été isolé sur une seule
  séance hebdomadaire ; **aucune règle du moteur de coach n'a été modifiée**.
- `npm run build:portable` et `npm run build` réussis : **1679 modules**,
  **970 médias** dans chacun des index `public/` et `release/`, triés et
  identiques. Bundle principal : `release/assets/index-CI6rFFlA.js`.
- Pour chacun des cinq exercices : SHA-256 source = preuve = copie publique =
  copie `release/` ; posters identiques entre `public/` et `release/`.
- Les cinq URL MP4 et les cinq URL de posters répondent **HTTP 200** sur le
  serveur de développement.
- Reste hors portée : lecture sur le téléphone de Yanis, régénération des
  défauts IA documentés et toute production d'APK.
