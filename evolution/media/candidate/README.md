# Candidat ciblé — piscine, pont au sol et French press EZ (non livré)

23 septembre 2026. Continuité de la **1.4.0 complète**, sans reconstruction depuis l’ancienne interface React, sans nouvelle signature ni APK. La version publiée est intacte.

## Deux réassociations exactes, aucun remplacement par famille

| Identifiant | Visuel corrigé, déjà dans l’APK | Justification |
|---|---|---|
| `pont-fessier-au-sol-activation` | `/media/8eecb0152081ff26.gif` | Pont bilatéral au sol sans charge ; 12 images et agrandissement revus. Le vrai pont pieds sur banc reste inchangé. |
| `french-press-barre-ez` | `/media/ea226c444f72de0f.gif` | Extension triceps couché avec barre EZ, deux positions revues ; le guide original embarqué indique déjà ce GIF et « Coudes fixes, barre vers le front ». La résolution effective choisissait à tort la poulie. |

Provenance : `association-overrides.json`, `../review/long-animations.json`, `../review/short-focus.json`. Les **207 autres résolutions** restent identiques. Ni les haltères, ni la poulie, ni les variantes avec pullover/California press ne reçoivent cette barre EZ par déduction. Plusieurs restent incorrectes : ce n’est pas une validation de ces variantes.

**Pas de nouveaux médias, retouche, miroir, rotation ni photos ajoutées.** Les deux GIF et leurs vignettes WebP d’origine sont réutilisés octet pour octet. Identifiants, noms, anciennes associations et SHA sont contrôlés ; les fichiers effectivement extraits sont vérifiés avant écriture du bundle candidat. Aucun exercice, prescription, charge ou historique modifié.

## Surfaces corrigées et limites

- `Kh` consulte uniquement les deux identifiants revus. Les fiches et les démonstrations de séance qui l’utilisent reçoivent le visuel corrigé.
- `Z5` applique une **copie de présentation**, sans muter le catalogue, pour que les deux cartes de bibliothèque utilisent les bonnes vignettes. Le pont passe du libellé « ANATOMIE RÉALISTE » à « GUIDE HUMAIN » parce qu’il affiche désormais le dessin de son mouvement.
- `k5` donne priorité à la même association exacte dans l’aperçu **« ENSUITE » du repos** ; le zoom reprend cette image. Séance sauvegardée et minuteur de repos ne sont pas réécrits.
- **Ce n’est pas une correction universelle des minuteurs guidés** : les images directes `step.img` non aquatiques, les échauffements/approches et les anciens chemins sans identifiant restent à traiter séparément.
- Les consignes génériques du pont (`Yu.bridge`) mentionnent encore banc/sol et charge ; elles ne sont pas corrigées dans ce passage. Le groupe pont reste ouvert.
- Le French press montre **deux positions clés**, pas une vidéo continue. La lecture/pause est testée, pas une certification clinique ni la fidélité de gel sur l’image exacte courante.

## Protection piscine conservée

- `bg` : en contexte explicite `pool`, ne cherche plus les guides cardio en dernier recours. Hors piscine, comportement antérieur conservé.
- `v5` : image, guide et zoom du chrono aquatique sont résolus selon l’étape et son contexte au lieu de faire confiance à une ancienne `step.img`. **Aucune réécriture des données, consignes ou durées.**
- Dans une séance mixte, le segment est prioritaire : une vraie étape cardio/post/transition n’est pas transformée en piscine. Un ancien chrono mixte sans segment identifiable n’est pas deviné.
- « Marche aquatique » utilise l’image piscine existante. Une récupération générique non résolue montre un **message de lacune**, jamais un elliptique ou une autre démonstration trompeuse. Cela ne satisfait PAS la couverture finale demandée.
- Les images aquatiques anciennes ne deviennent pas validées grâce à cette séparation de contextes : plusieurs sont signalées erronées.

## Intégrité et contrôles

Rapport courant : [validation.json](validation.json). Bundle candidat SHA **`148cef273a0e3223cc0c3bdb9bdba320163cf1da7582194fcc746155c46b52e8`**.

- APK et bundle 1.4.0 exigés par SHA ; refus d’un autre APK, d’un bundle modifié ou d’une double application.
- **271/272 fichiers web identiques** ; seul `assets/public/assets/index-CBCies4k.js` change. Les fonctions `bg`, `v5`, `Kh`, `Z5`, `k5` et les helpers isolés constituent l’unique périmètre AST autorisé. Accueil, catalogue, moteurs de données/chronos et fonctions des sept étapes inchangés. Les deux changements de vues sont aussi comparés exactement à leurs expressions de départ.
- **26 tests Node réussis** : 9 caractérisations/provenance, 11 candidat, 6 traçabilité. Les 209 résolutions, les copies de présentation immuables, les 420 étapes piscine et les deux vignettes sont contrôlées.
- **14 tests navigateur ciblés réussis en un passage complet (2,1 min)** : 6 piscine, 4 bibliothèque/fiches/animation, 4 séances sauvegardées/aperçu de repos/zoom/rechargement, dans les deux profils. Thèmes clair/sombre couverts ; données fictives validées par le schéma.
- **8 tests accueil/11 rubriques réussis (57,9 s)** sur ce même candidat, face au web intact de la 1.4.0. L’option `MEDIA_REVIEW_CANDIDATE=1` autorise uniquement le changement intentionnel du libellé de la carte du pont : les libellés et images précis des deux versions sont d’abord vérifiés, puis cette seule chaîne contextualisée est normalisée. Aucune suppression globale des libellés ; sans option, comparaison historique inchangée.
- La capture Émilie sombre du French press a été affichée et examinée : dessin couché avec barre EZ, tête et appuis visibles. Comparatif des deux positions dans `../review/french-press-comparison.jpg`.
- Les premiers tests de séance ont rejeté la fixture `kg` (convention invalide), puis une injection de fixture en cours de navigation a été écrasée par la sauvegarde au déchargement. Corrigé **dans les tests seulement** : conventions existantes et cas initiaux séparés par exercice/profil, avec vrai rechargement sans modification du stockage. La comparaison accueil a ensuite détecté le libellé du pont attendu ; l’exception précise ci-dessus a été ajoutée. Aucun contournement applicatif pour rendre les tests verts.
- **Ni les 90 tests complets de livraison ni Android physique relancés.** Aucun nouvel APK construit ou signé. Dossier privé de signature toujours absent ; aucune clé créée.

## Reproduction

```bash
npm ci --prefix JARVIS-Fitness-Source --ignore-scripts
node evolution/media/candidate/build.mjs
node evolution/media/coverage.mjs
node --test evolution/media/tests/*.test.mjs
PYTHONPATH=.cache/image-tools python3 evolution/media/review_frames.py --short-focus --tile 300
```

Servir seulement `.cache/media-pool-candidate/` sur 5186 et le web intact extrait de la 1.4.0 sur 5187, **jamais le dépôt ou `.private`**. Par exemple : `python3 -m http.server 5186 --bind 0.0.0.0 --directory .cache/media-pool-candidate`.

```bash
LD_LIBRARY_PATH="$PWD/.cache/browser-libs/lib" \
  node JARVIS-Fitness-Source/node_modules/@playwright/test/cli.js test \
  --config evolution/media/candidate/playwright.config.mjs
MEDIA_REVIEW_CANDIDATE=1 LD_LIBRARY_PATH="$PWD/.cache/browser-libs/lib" \
  CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
  COMPLETE_URL=http://127.0.0.1:5186 HOME_REFERENCE_URL=http://127.0.0.1:5187 \
  node JARVIS-Fitness-Source/node_modules/@playwright/test/cli.js test \
  --config evolution/home/playwright.config.mjs evolution/home/tests/home.spec.mjs
```

Chromium 138.0.7204.0 via `@sparticuz/chromium@138.0.2`, `/tmp/chromium`, bibliothèques al2023 du même paquet. Les caches peuvent disparaître.

## Suite

**36 groupes encore ouverts.** Poursuivre les variantes triceps/fessiers, les dessins des dips, les consignes du pont, puis les échauffements/approches et images directes des chronos. Préserver les visuels valables. Aucun remplacement photographique global autorisé. Les autres catégories et chaque surface restent à valider ; pas d’annonce « tous les exercices corrigés ». Actualiser et présenter `PASSATION.md` à chaque étape. L’IA conversationnelle vient en dernier.
