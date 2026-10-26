# Pectoraux #01→#04 — contrôle et intégration des MP4

**Date : 25/10/2026 · Sources déposées par Yanis dans `bdae589` et `6bd8cb5`**

> **Mise à jour du 26/10/2026 :** la nouvelle référence #04 et les prompts
> #04→#08 sont dans
> [`22-PECTORAUX-04-08-PRODUCTION.md`](./22-PECTORAUX-04-08-PRODUCTION.md).
> Aucun MP4 #04→#08 n'est intégré à ce stade.

## Verdict

| N° | Exercice | Source retenue | État |
|---|---|---|---|
| #01 | Pompes inclinées (mains surélevées) | `1792945442178.mp4`, **nouvelle version remise** | **Intégré `coached`** |
| #01 ancien | Même exercice | `1792945053224.mp4` | **Non intégré ; comparaison seulement** |
| #02 | Développé couché haltères | `1792945070437.mp4` | **Intégré `coached`** |
| #03 | Développé incliné haltères | `1792945064689.mp4` | **Intégré `coached`** |
| #04 | Développé incliné barre | **Aucun MP4 correspondant** | **Non intégré ; photo à reprendre** |

Le dépôt des sources vaut accord d'intégration. **`coached` ne signifie pas
validé techniquement** : les notices et les descriptifs audio ci-dessous restent
prioritaires sur les défauts repérés. La nouvelle #01 est la seule vidéo de
pompes utilisée par l'application.

## Correspondances et intégrité

Tous les fichiers sont entièrement décodés avec OpenCV headless : **24 i/s**,
**97/97 frames**, **4,042 s**, sans erreur de lecture. Instants inspectés :
**0,00 ; 0,79 ; 1,58 ; 2,42 ; 3,21 ; 4,00 s**.

| Source | Exercice | Dimensions | SHA-256 |
|---|---|---:|---|
| `1792945442178.mp4` | #01 nouvelle | 640×360 | `84856c33666a0988df562e86d3350ba414668aa5fa200460a988ef26307476d9` |
| `1792945053224.mp4` | #01 ancienne | 640×360 | `d21abe61d60bfba1fc76e833792e8fccf49f358c840c4d9b3dfd20821655c637` |
| `1792945070437.mp4` | #02 | 1024×576 | `57de008b37bb385ea5334073060b0f02825adfb757ae7986833512a74f8546f0` |
| `1792945064689.mp4` | #03 | 640×360 | `7f0a54a9fea81ce5cb9d02eeb0c7b0dfff5fd7bb29cd178884dc8319b0e3d5e7` |

Programmation conservée : #01 **3 × 8-12 · `2010` · 60 s** ; #02 et #03
**3 × 10-12 · `2011` · 75 s**. Aucune entrée n'est créée pour #04, dont le
programme reste **5 × 8-10 · `3010` · 60 s**.

## Contrôle technique

### #01 — Nouvelle version des pompes sur barre

- **Conforme :** mains réellement surélevées sur une barre fixe, corps gainé,
  coudes fléchis en bas puis extension et retour vers la barre.
- **Choix de source :** la nouvelle version remise présente un retour final plus
  proche de la position initiale que l'ancienne. L'ancienne n'est pas intégrée.
- **Réserve :** un temps d'arrêt haut est visible alors que `2010` ne prévoit
  aucune pause. L'audio impose une montée en une seconde et une descente en deux
  secondes, sans pause.

[Nouveau MP4 contrôlé](./controle-pectoraux-01-04/pectoraux-01-source-1792945442178.mp4) ·
[Six instants](./controle-pectoraux-01-04/pectoraux-01-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-01-04/pectoraux-01-zoom-technique.jpg) ·
[Comparaison ancienne/nouvelle](./controle-pectoraux-01-04/pectoraux-01-comparaison-ancienne-nouvelle.jpg) ·
[Ancienne source non intégrée](./controle-pectoraux-01-04/pectoraux-01-ancienne-source-1792945053224.mp4)

### #02 — Développé couché avec deux haltères

- **Conforme :** banc plat, deux haltères indépendants, descente à côté de la
  poitrine et extension au-dessus de la poitrine.
- **Réserve :** les deux bras perdent leur synchronisation vers la fin du cycle.
  Le poster et l'audio imposent deux charges qui descendent et remontent
  ensemble, une contraction d'une seconde en haut et le tempo `2011`.

[MP4 contrôlé](./controle-pectoraux-01-04/pectoraux-02-source-1792945070437.mp4) ·
[Six instants](./controle-pectoraux-01-04/pectoraux-02-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-01-04/pectoraux-02-zoom-technique.jpg)

### #03 — Développé incliné avec deux haltères

- **Conforme :** banc incliné, deux haltères, départ en haut, descente et retour
  en haut sont lisibles.
- **Réserve :** la tête se redresse légèrement et les haltères se rapprochent du
  visage en bas. L'audio impose la tête appuyée, les charges à côté du haut de
  la poitrine et le tempo `2011`, sans transformer le geste en développé épaules.

[MP4 contrôlé](./controle-pectoraux-01-04/pectoraux-03-source-1792945064689.mp4) ·
[Six instants](./controle-pectoraux-01-04/pectoraux-03-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-01-04/pectoraux-03-zoom-technique.jpg)

### #04 — Toujours absent

Aucun fichier ne montre un développé incliné avec une barre droite. La photo de
production reste également à reprendre, puisque les candidates précédentes
plaçaient la barre au cou. **Ne pas utiliser une vidéo haltère comme substitut.**
Le prompt reste dans
[`20-PECTORAUX-01-04-PRODUCTION.md`](./20-PECTORAUX-01-04-PRODUCTION.md).

## Intégration applicative

- `/videos/pompes-inclinees-mains-surelevees.mp4` depuis la **nouvelle** #01 ;
- `/videos/developpe-couche-halteres.mp4` pour #02 ;
- `/videos/developpe-incline-halteres.mp4` pour #03 ;
- trois posters issus des photos de production retenues ;
- trois entrées `coached` avec `title`, `handCue`, `movementCue`, `notice` et
  `spoken`, chacune avec sa réserve propre ;
- GIF #01/#02/#03/#04 conservés, vidéos précédentes et statuts inchangés ;
- version **1.12.0 / 195** inchangée, aucun APK produit.

## Validation finale

- **Tests ciblés Node : 21/21 réussites.**
- **Parcours ciblé Playwright : 1/1 réussite**, avec vidéos, posters, notices et
  descriptifs audio des trois exercices.
- **Suite Node complète : 227 tests — 225 réussites, 0 échec, 2 ignorés.**
- **Suite Playwright complète : 47 scénarios — 36 réussites, 0 échec,
  11 ignorés.**
- `npm run build:portable` et `npm run build` réussis : **1679 modules**,
  **960 médias** dans chacun des index `public/` et `release/`, triés et
  identiques. Bundle principal : `release/assets/index-zCV5zQ_N.js`.
- Pour #01 nouvelle, #02 et #03 : SHA-256 source = preuve = copie publique =
  copie `release/`. Pour l'ancienne #01 : source = preuve de comparaison,
  sans copie applicative. Les trois posters sont identiques entre `public/` et
  `release/`.
- Reste hors portée : lecture sur le téléphone de Yanis, nouvelle photo/MP4 #04
  et toute production d'APK.
