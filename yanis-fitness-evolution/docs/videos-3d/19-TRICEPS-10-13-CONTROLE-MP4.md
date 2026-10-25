# Triceps #10→#13 — contrôle et intégration des MP4

**Date : 25/10/2026 · Sources déposées par Yanis dans `72a205d`**

## Verdict

| N° | Exercice | MP4 public | État |
|---|---|---|---|
| #10 | Développé couché prise serrée | `/videos/developpe-couche-prise-serree.mp4` | **Intégré `coached`** |
| #11 | Extensions triceps haltères incliné | **Aucun MP4 déposé** | **EN STAND-BY ; GIF conservé** |
| #12 | Pushdown triceps câble | `/videos/pushdown-triceps-cable.mp4` | **Intégré `coached`** |
| #13 | California press (barre au cou) | `/videos/california-press-barre-au-cou.mp4` | **Intégré `coached`** |

Conformément à la règle de Yanis, le dépôt des trois sources sur la branche
vaut accord d'intégration. **`coached` ne signifie pas validé techniquement** :
les réserves #10/#12/#13 restent visibles et les consignes audio corrigées sont
prioritaires sur les mouvements approximatifs de l'IA.

**#11 reste sans MP4 et passe en stand-by à la demande de Yanis.** Ce point ne
bloque plus la suite ; il sera rappelé lors des prochains échanges vidéo. Sa
photo canonique conserve le banc à 30°, les deux haltères en prise neutre, la
barre fixe matelassée derrière/légèrement sous les coudes et l'orientation
latérale de #03 — tête à gauche, pieds à droite — pour empêcher une
transformation en développé couché. Préparation et prompt :
[`18-TRICEPS-10-13-PRODUCTION.md`](./18-TRICEPS-10-13-PRODUCTION.md).

## Correspondances des sources

| N° | Fichier déposé | Programmation conservée |
|---|---|---|
| #10 | `1792939358423.mp4` | 3 × 8-10 · `3010` · repos 60 s |
| #12 | `1792939610909.mp4` | 3 × 8-10 · `3010` · repos 120 s |
| #13 | `1792939503953.mp4` | 4 × 12-15 · `3010` · repos 60 s · **Ne pas trop charger !** |

Aucune source correspondant à #11 n'est présente dans le dépôt. Les trois MP4
ont été copiés **sans réencodage** vers leur nom canonique ; les fichiers
originaux à la racine sont conservés.

## Contrôle technique

Les trois fichiers sont entièrement décodés avec OpenCV headless, à **24 i/s**,
**97/97 frames** et **4,042 s**, sans erreur de lecture. Six instants ont été
inspectés pour chacun : **0,00 ; 0,79 ; 1,58 ; 2,42 ; 3,21 ; 4,00 s**.

| N° | Dimensions | SHA-256 de la source |
|---|---:|---|
| #10 | 640×480 | `de0cd5fc9ac91d055c8215f0f99fe522e2165de4ff8d39224e798872b975bf28` |
| #12 | 640×480 | `3b978e95584f674a7338b3e559544d7aadb5df2075df315624473e81ac3f0648` |
| #13 | 896×1024 | `489c970e5df0a28ffbbcf3608dabfc316d1238675de588f237ff162d7b6e94b4` |

### #10 — Développé couché prise serrée

- **Conforme :** banc plat, barre droite, prise rapprochée sans mains jointes,
  coudes proches et trajectoire vers le bas de la poitrine sont lisibles.
- **Réserve :** arrêts marqués et tempo approximatif ; la vidéo ne démontre pas
  strictement le `3010` du programme.
- **Consigne applicative :** une seconde de poussée, trois secondes de descente,
  sans pause, sans rebond et jamais de trajectoire vers le cou.

[MP4 contrôlé](./controle-10-13/triceps-10-source-1792939358423.mp4) ·
[Six instants](./controle-10-13/triceps-10-six-instants.jpg) ·
[Zoom technique](./controle-10-13/triceps-10-zoom-technique.jpg)

### #12 — Pushdown unilatéral à la poulie haute

- **Conforme :** poignée D reconnaissable, main droite active et extension du
  coude visibles.
- **Réserve importante :** la main traverse le buste vers l'épaule opposée ;
  le coude et l'épaule se déplacent au lieu de rester fixes.
- **Consigne applicative :** coude contre les côtes, avant-bras seul, prise D
  pronée, retour à environ 90° puis extension près de la cuisse. La trajectoire
  croisée est explicitement interdite dans la notice et l'audio.

[MP4 contrôlé](./controle-10-13/triceps-12-source-1792939610909.mp4) ·
[Six instants](./controle-10-13/triceps-12-six-instants.jpg) ·
[Zoom technique](./controle-10-13/triceps-12-zoom-technique.jpg)

### #13 — California press avec descente vers le cou

- **Conforme :** barre droite légère et trajectoire vers le haut du cou. Le zoom
  technique contrôlé montre un **espace visible entre la barre et le cou/menton**.
- **Réserves :** cadrage et zoom changeants, barre très proche du visage et
  tempo/cycle approximatifs. L'espace observé n'autorise pas à supprimer la
  notice de sécurité ni à augmenter la charge.
- **Consigne applicative :** charge légère, espace constant, aucun contact avec
  le cou, le menton ou le visage, descente en trois secondes et montée en une
  seconde. **Ne pas trop charger !** reste prioritaire.

[MP4 contrôlé](./controle-10-13/triceps-13-source-1792939503953.mp4) ·
[Six instants](./controle-10-13/triceps-13-six-instants.jpg) ·
[Zoom technique](./controle-10-13/triceps-13-zoom-technique.jpg)

## Intégration applicative

- Trois entrées ajoutées dans `src/data/exercise-videos.js`, toutes en
  `coached`, avec `title`, `handCue`, `movementCue`, `notice` et `spoken`.
- Trois posters issus des références validées de préparation, installés dans
  `public/videos/posters/` et `release/videos/posters/`.
- Les vidéos #01→#09 et leurs statuts restent inchangés.
- Les GIF #10/#11/#12/#13 sont conservés ; #11 utilise toujours son GIF faute
  de MP4. L'autorisation de réutilisation limitée à #05/#06/#09 n'est pas
  étendue à ce lot.
- Version inchangée : **1.12.0 / 195**. Aucun APK produit.

## Validation finale

- **Tests ciblés Node : 19/19 réussites.**
- **Parcours ciblé Playwright : 1/1 réussite**, avec ouverture des trois vidéos,
  posters, notices et lecture des descriptifs corrigés.
- **Suite Node complète : 225 tests — 223 réussites, 0 échec, 2 ignorés.**
- **Suite Playwright complète : 46 scénarios — 35 réussites, 0 échec,
  11 ignorés.**
- `npm run build:portable` et `npm run build` réussis : **1679 modules**,
  **954 médias** dans chacun des index `public/` et `release/`, triés et
  identiques. Bundle principal : `release/assets/index-BgZOhX6Q.js`.
- Les SHA-256 source = copie de preuve = copie publique = copie `release/` sont
  identiques pour chacune des trois vidéos ; les posters sont également
  identiques entre `public/` et `release/`.
- Reste hors portée : lecture sur le téléphone de Yanis et toute production
  d'APK.
