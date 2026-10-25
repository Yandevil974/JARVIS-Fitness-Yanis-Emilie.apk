# Triceps #03 — contrôle du MP4 et intégration accompagnée

Date : 25/10/2026

Source déposée par Yanis : `1792934757048.mp4`, commit `587fed0`

Statut : **#03 intégré en `coached`, jamais `validated`**. Le dépôt sur la
branche vaut accord d'intégration ; l'inspection conserve néanmoins les réserves
de tempo et de pause. Les vidéos et les statuts précédents restent inchangés.

## Correspondance exacte

| Élément | Valeur |
|---|---|
| Exercice | Triceps extensions haltères, banc plat |
| Identifiant | `triceps-extensions-halteres-banc-plat` |
| Programmation | 4 × 10-12 · `3010` · repos 60 s |
| MP4 canonique | `public/videos/triceps-extensions-halteres-banc-plat.mp4` |
| Poster | `public/videos/posters/triceps-extensions-halteres-banc-plat.jpg` |
| GIF conservé | `/media/3aea2b016706d5d4.gif` |
| Statut | `coached` |

La source a été entièrement décodée avec OpenCV : **640×360, 24 i/s, 97 frames
déclarées et 97 frames lues, 4,042 s**, sans erreur de lecture. Les instants
contrôlés sont 0,00 s, 0,79 s, 1,58 s, 2,42 s, 3,21 s et 4,00 s, avec un zoom
complémentaire sur les positions haute et basse.

SHA-256 de la source :
`a934fcc3a4a60e627b50fc3acfc06d4c2ae74581c63e9f4c6b00354c43390c34`.

## Ce qui est conforme et lisible

- Position allongée sur banc plat dans l'angle latéral trois-quarts de #08.
- **Deux haltères séparés**, un dans chaque main, sans barre tenue ni charge
  ajoutée à la barre d'appui.
- **Prise neutre visible**, paumes face à face et poignets alignés.
- **Barre fixe matelassée d'appui des coudes** conservée derrière et légèrement
  sous les coudes, avec son support vertical relié au banc ; elle ne remplace
  pas les haltères et ne bloque pas les avant-bras.
- Hauts des bras globalement fixes et haltères descendant à côté de la tête.
- Cycle haut → bas → haut complet, avec retour à la position haute en fin de
  fichier et continuité de la boucle.

Preuves : [six instants](controle-03/triceps-03-six-instants.jpg) ·
[zoom prise et appui](controle-03/triceps-03-zoom-technique.jpg) ·
[source contrôlée](controle-03/triceps-03-source-1792934757048.mp4).

## Réserves conservées

- La descente est plus rapide que les **trois secondes** exigées par le tempo
  `3010`.
- La vidéo marque un temps d'arrêt en position basse alors que le programme ne
  demande pas de pause.
- Les haltères passent près de la tête : le descriptif impose explicitement de
  conserver un espace sûr et de ne toucher ni le visage, ni la casquette, ni le
  banc.

Ces réserves empêchent de présenter la source comme une référence technique
parfaite. Elles sont corrigées par la notice visible et le descriptif audio,
sans rejeter l'intégration autorisée par Yanis.

## Consigne prioritaire intégrée

Deux haltères en prise neutre, paumes face à face et poignets droits. La barre
matelassée fixe du banc reste derrière et légèrement sous les coudes ; elle n'est
pas une charge et n'est jamais tenue. Garder les hauts des bras immobiles et les
coudes légèrement appuyés. Descendre les deux haltères à côté de la tête en trois
secondes en pliant seulement les coudes, puis remonter en une seconde, sans pause
en bas et sans contact avec la tête. Ne pas reproduire la descente rapide ni la
pause visibles dans la vidéo IA.

## Intégration réalisée

- Entrée `coached` dans `src/data/exercise-videos.js` avec `title`, `handCue`,
  `movementCue`, `notice` et `spoken` propres à #03.
- MP4 copié sans réencodage dans `public/videos/` et `release/videos/` sous
  `triceps-extensions-halteres-banc-plat.mp4` ; original racine conservé.
- Poster créé depuis `vague2-triceps-03-appui-coudes.jpg`, puis copié dans
  `public/videos/posters/` et `release/videos/posters/`.
- GIF `/media/3aea2b016706d5d4.gif` conservé dans `public/` et `release/`.
- Tests vidéo, voix et parcours navigateur étendus à #03 ; agrandissement de #09
  et autres vidéos toujours couverts.
- Aucun changement de programme, de version ou d'APK. Version publiée inchangée :
  **1.12.0 / 195**. Les triceps #01→#09 ont désormais tous une vidéo intégrée,
  avec leurs statuts et notices respectifs.

## Vérifications

- [x] Décodage complet : **97/97 frames**.
- [x] Source, copie applicative et copie de preuve au même SHA-256.
- [x] Contrôles ciblés vidéos et voix : **17/17 réussites**.
- [x] Parcours Playwright ciblé #03/#05→#09 : **1/1 réussite**, avec source,
  poster, notice, consigne de prise et audio de #03.
- [x] Suite Node complète : **223 tests, 221 réussites, 0 échec, 2 ignorés**.
- [x] Suite Playwright complète : **45 scénarios, 34 réussites, 0 échec,
  11 ignorés**.
- [x] Build portable et build Vite : **1679 modules**, **948 médias** indexés,
  avec les index `public/` et `release/` triés et identiques.
