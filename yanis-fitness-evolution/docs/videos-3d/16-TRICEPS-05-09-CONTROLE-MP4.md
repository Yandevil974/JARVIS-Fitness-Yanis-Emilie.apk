# Triceps #05→#09 — contrôle des MP4 et intégration accompagnée

Date : 25/10/2026

Sources déposées par Yanis : commit `2e8bca6`

Statut du lot : **#05, #06, #07, #08 et #09 intégrés en `coached`, jamais
`validated`**. #03 reste sans MP4 ; après clarification de Yanis, sa nouvelle
photo de production ajoute une barre fixe d'appui des coudes dans l'angle de #08.
#02 n'est pas modifié.

## Accord d'intégration et exception de mutualisation

Le dépôt des vidéos sur la branche par Yanis vaut accord d'exploitation, sans
redemander une confirmation d'intégration. Cet accord ne supprime pas les
réserves relevées pendant l'inspection technique.

Yanis autorise en outre explicitement **une même vidéo pour #05, #06 et #09**.
Cette dérogation est limitée à ces trois exercices. Un seul MP4 canonique est
stocké et trois entrées y pointent, mais leurs trajectoires, notices et
descriptifs audio restent distincts. Les autres variantes continuent de suivre
la règle d'une vidéo propre par exercice.

## Correspondance des fichiers

| # | Exercice et identifiant | Source déposée | MP4 canonique dans `public/videos/` | Programmation | Statut |
|---|---|---|---|---|---|
| #05 | French press barre EZ — `french-press-barre-ez` | `1792931668427.mp4` | `extensions-triceps-ez-commune-05-06-09.mp4` | 4 × 8-10 · `4010` · repos 75 s | `coached` |
| #06 | Extensions triceps barre EZ — `extensions-triceps-barre-ez` | `1792931668427.mp4` | `extensions-triceps-ez-commune-05-06-09.mp4` | 4 × 8-10 · `4010` · repos 75 s | `coached` |
| #07 | Barre au front (pushdown triceps) — `barre-au-front-pushdown-triceps` | `1792931897027.mp4` | `barre-au-front-pushdown-triceps.mp4` | 3 × 10/8/6 · `3010` · repos 75 s · drop set | `coached` |
| #08 | French press haltère un bras — `french-press-haltere-un-bras` | `1792931952605.mp4` | `french-press-haltere-un-bras.mp4` | 3 × 8-10 · `3010` · repos 75 s | `coached` |
| #09 | Extensions triceps + pullover barre EZ — `extensions-triceps-pullover-barre-ez` | `1792931668427.mp4` | `extensions-triceps-ez-commune-05-06-09.mp4` | 3 × 8-10 · `3010` · repos 75 s | `coached` |

Les trois sources ont été entièrement décodées image par image avec OpenCV :
**640×360, 24 i/s, 97 frames déclarées et 97 frames lues, 4,042 s**, sans erreur
de lecture. Les instants contrôlés sont 0,00 s, 0,79 s, 1,58 s, 2,42 s, 3,21 s
et 4,00 s, complétés par des zooms sur les positions haute et basse.

| Source | SHA-256 |
|---|---|
| `1792931668427.mp4` | `526ac47917b6d5d91ddd8ec891d1c2ee2d445c7c076edc4a0f0184e191a29666` |
| `1792931897027.mp4` | `ecc1ee5d13b4cfe9b8fe01b7a233f1887784979fe3c4e7ecb96882d51cebf4ea` |
| `1792931952605.mp4` | `7f845f726ccdd9da34e5565636426877a5d995908b15f1e5d26a4c045859fcc9` |

Pour chaque source, le fichier racine, la copie `public/`, la copie `release/`
et la copie de preuve ont le même hash. Aucun MP4 n'a été réencodé.

## Source commune #05/#06/#09 — `1792931668427.mp4`

### Ce qui est reconnaissable

- Athlète allongé sur un banc plat avec une barre EZ chargée et deux mains sur
  la barre.
- Flexions et extensions des coudes répétées, avec retour à la position basse
  en fin de fichier, ce qui permet une boucle sans saut de position final.
- Triceps colorés et matériel lisible ; le sac dans le décor et le filigrane ne
  sont pas des consignes de l'application.

### Réserves conservées

- En position basse, la barre arrive **trop près du cou/de la gorge** au lieu
  de respecter la zone propre à chaque variante.
- Les coudes s'ouvrent latéralement au lieu de garder une largeur stable.
- Deux cycles sont comprimés dans environ quatre secondes : la vitesse ne
  respecte ni le `4010` de #05/#06 ni le `3010` de #09.
- La source seule ne différencie pas correctement les trois trajectoires. Elle
  reste donc un support accompagné, pas une validation technique commune.

### Consignes prioritaires propres à chaque exercice

- **#05 — vers le front** : hauts des bras fixes, coudes à largeur stable,
  descente en quatre secondes vers le front avec un espace sûr, jamais vers le
  cou, puis remontée en une seconde en dépliant seulement les coudes.
- **#06 — derrière la tête** : hauts des bras fixes, pas de pullover, descente
  en quatre secondes derrière le sommet de la tête sans contact avec le front,
  le cou ou la gorge, puis remontée en une seconde.
- **#09 — extension + pullover** : arc derrière la tête associant volontairement
  les épaules et les coudes, descente en trois secondes puis retour au-dessus de
  la poitrine en une seconde ; jamais de descente vers le cou.

Les trois notices et les trois audio disent explicitement de ne pas reproduire
la proximité du cou, les coudes ouverts ou la vitesse de la vidéo IA.

Preuves : [six instants](controle-05-09/triceps-05-06-09-six-instants.jpg) ·
[zoom technique](controle-05-09/triceps-05-06-09-zoom-technique.jpg) ·
[source contrôlée](controle-05-09/triceps-05-06-09-source-1792931668427.mp4).

## #07 — Pushdown à la poulie haute — `1792931897027.mp4`

### Ce qui est reconnaissable

- Position debout face à une poulie haute, une barre droite horizontale et un
  câble relié au centre de la barre.
- Prise en pronation visible sur les zooms, coudes proches du buste et cycle
  bas → haut → bas identifiable.
- Aucun chiffre de drop set ni changement de charge ajouté à la démonstration.

### Réserves conservées

- La montée et la descente sont plus rapides que le tempo `3010`, avec des
  temps d'arrêt qui ne doivent pas devenir des pauses imposées.
- Un filigrane est présent ; il ne fait pas partie des consignes.

### Consigne prioritaire intégrée

Barre droite en pronation, paumes vers le sol, poignets alignés et coudes contre
les côtes. Laisser monter la barre vers le bas de la poitrine en trois secondes
en pliant seulement les coudes, puis la pousser près des cuisses en une seconde,
sans pause ni balancement du buste. Le drop set 10/8/6 reste une consigne de
programmation, pas une action à reproduire dans la vidéo.

Preuves : [six instants](controle-05-09/triceps-07-six-instants.jpg) ·
[zoom technique](controle-05-09/triceps-07-zoom-technique.jpg) ·
[source contrôlée](controle-05-09/triceps-07-source-1792931897027.mp4).

## #08 — French press unilatérale — `1792931952605.mp4`

### Ce qui est reconnaissable

- Position allongée sur banc plat, **un seul haltère** tenu par une seule main.
- Main libre placée contre le coude de travail, descente à côté de la tête et
  remontée identifiables.

### Réserves conservées

- L'orientation du poignet et de l'haltère change pendant le geste au lieu de
  conserver une prise neutre parfaitement stable.
- Le cycle est accéléré par rapport au tempo `3010`.
- Le fichier termine sa deuxième descente en bas ; le raccord de boucle revient
  directement en haut sans montrer une remontée contrôlée complète.

### Consigne prioritaire intégrée

Un seul haltère en prise neutre, poignet droit, haut du bras vertical et fixe,
main libre soutenant légèrement le coude. Descendre à côté de la tête en trois
secondes en pliant seulement le coude, sans contact avec le visage, puis
remonter en une seconde. **Chaque répétition doit revenir en haut avec contrôle**,
sans copier le raccord de boucle. Terminer la série du même côté avant de changer
de bras.

Preuves : [six instants](controle-05-09/triceps-08-six-instants.jpg) ·
[zoom technique](controle-05-09/triceps-08-zoom-technique.jpg) ·
[source contrôlée](controle-05-09/triceps-08-source-1792931952605.mp4).

## Intégration réalisée

- Cinq entrées `coached` dans `src/data/exercise-videos.js`, chacune avec
  `title`, `handCue`, `movementCue`, `notice` et `spoken` spécifiques.
- Trois MP4 uniques copiés sans réencodage dans `public/videos/` et
  `release/videos/` ; les originaux déposés à la racine sont conservés.
- Quatre posters installés dans `public/videos/posters/` et
  `release/videos/posters/` :
  - #05 depuis `vague2-triceps-05-barre-ez.jpg` pour conserver le repère vers
    le front ;
  - #06/#09 depuis la frame 20 de la source commune, en position haute sûre —
    ce poster ne valide pas la position basse ;
  - #07 depuis `vague2-triceps-07-pushdown-barre.jpg` ;
  - #08 depuis `vague2-triceps-08-haltere-un-bras.jpg`.
- GIF d'origine conservés dans `public/` et `release/` :
  - #05/#08 : `/media/a40720f67740d2a0.gif` ;
  - #06 : `/media/3aea2b016706d5d4.gif` ;
  - #07 : `/media/4b9f932f0c18e763.gif` ;
  - #09 : `/media/e9aa82132494b300.gif`.
- #03 reste sans entrée vidéo ; sa nouvelle référence photo et son prompt avec
  barre fixe d'appui des coudes sont documentés dans
  [`13-TRICEPS-02-05-PRODUCTION.md`](./13-TRICEPS-02-05-PRODUCTION.md). #02/#04
  conservent leurs entrées précédentes et #02 n'a pas été retouché.
- Aucun changement de programme, de charge, de version ou d'APK. Version
  publiée inchangée : **1.12.0 / 195**.

## Vérifications

- [x] Décodage complet des trois sources : **97/97 frames chacune**.
- [x] Hashes identiques entre origine, `public/`, `release/` et preuves.
- [x] Parcours Playwright ciblé #05→#09 : **1/1 réussite**, avec sources,
  posters, notices, consignes de prise, audio et agrandissement de #09.
- [x] Suite Node complète : **223 tests, 221 réussites, 0 échec, 2 ignorés**.
- [x] Suite Playwright complète : **45 scénarios, 34 réussites, 0 échec,
  11 ignorés**. Les scénarios ignorés sont les restaurations sans sauvegarde
  jointe, pas des échecs de ce lot.
- [x] Build portable et build Vite : **1679 modules**, **946 médias** indexés
  dans `public/` et `release/`, avec les deux index triés et identiques.
- [x] Les sept nouveaux médias applicatifs uniques — trois MP4 et quatre
  posters — sont présents dans `public/` et `release/` ; les huit JPEG ont été
  vérifiés et les GIF d'origine sont toujours présents.
