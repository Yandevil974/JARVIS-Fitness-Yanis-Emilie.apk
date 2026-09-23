# Candidat ciblé — frontière piscine/cardio (non livré)

23 septembre 2026. Continuité de la **1.4.0 complète**, sans reconstruction depuis l’ancienne interface React, sans nouvelle signature ni APK. La 1.4.0 publiée est conservée intacte.

## Ce qui change, uniquement dans le candidat web

- `bg` : en contexte explicite `pool`, ne cherche plus dans les guides cardio en dernier recours. Hors piscine, son comportement antérieur est conservé.
- `v5` : le visuel et le guide du chrono aquatique sont résolus à partir de l’étape actuelle et de son contexte, au lieu de faire confiance à une ancienne `step.img`. Le zoom utilise le même visuel. **Aucune réécriture du minuteur enregistré**, des consignes, des durées ou des données.
- Dans une séance mixte, le segment de l’étape est prioritaire : une vraie étape cardio/post/transition n’est pas transformée en piscine. Un ancien minuteur mixte sans segment identifiable n’est pas deviné.
- Une récupération explicite « marche aquatique » reprend l’image piscine existante. Les noms génériques non résolus (« Récupération active », « Repos »…) montrent dans le chrono un **message de lacune**, jamais un elliptique ou une photo générique présentée comme la démonstration. Cela ne satisfait PAS encore la couverture demandée par l’utilisateur.

**Pas de nouveaux médias, pas de rotation ou retouche d’image, aucun remplacement par les photos proposées.** Les images aquatiques existantes ne deviennent pas « validées » grâce à ce code : plusieurs sont déjà signalées erronées dans l’audit. Le statut du helper l’indique explicitement.

## Protections de continuité

- SHA de l’APK et du bundle 1.4.0 exigés ; refus d’un autre APK, d’un bundle modifié ou d’une double application du correctif.
- **271/272 fichiers web strictement identiques**, seul `assets/public/assets/index-CBCies4k.js` change.
- Comparaison AST : toutes les autres instructions de premier niveau sont identiques octet pour octet. Seuls `bg`, `v5` et le helper isolé diffèrent ; catalogue, accueil, moteur des chronos, fonctions des sept étapes inchangés.
- Tests vérifiant les 420 étapes piscine sans sélection cardio. Cette propriété est une séparation de contextes, **pas une certification anatomique**.
- APK livré inchangé ; aucun outil de signature n’est appelé. Le dossier privé 1.4.0 reste absent dans cette reprise ; aucune clé créée.

## Contrôles effectués

Voir [validation.json](validation.json).

- **17 tests Node réussis** : 9 caractérisations/provenance de la version publiée + 8 tests du candidat, dont intégrité et absence de mutation.
- **6 tests navigateur ciblés réussis en un passage complet** : deux profils × deux thèmes, ancienne image elliptique dans le chrono piscine, image/consigne/zoom, rechargement, pause/reprise, passage à une vraie étape cardio, persistance et isolation des profils ; cas générique signalé comme incomplet. Données de test fictives, pas de sauvegarde utilisateur.
- **8 tests navigateur de l’accueil existants relancés avec succès sur ce candidat**, comparé à la 1.4.0 : orbe bleu, rotation, thèmes, priorités du chrono et parcours des 11 rubriques pour les deux profils.
- Captures de chrono Yanis clair/Émilie sombre examinées : visuel aquatique visible, pas d’elliptique à cette étape. Cela ne remplace pas la revue sémantique de toutes les images.
- Les premiers passages de la nouvelle suite ont échoué à cause des tests : bouton différent en pause (« Reprendre le chrono »), deux boutons « Fermer », vérification avant écriture différée, puis mensuration fictive incomplète (`values` absent). Sélecteurs, attente de persistance et fixture ont été corrigés ; validation du schéma de la fixture ajoutée. **Aucun changement de code applicatif pour rendre ces tests verts.**
- Ce ne sont ni les 90 tests complets de livraison relancés, ni des tests Android/Doze/OEM. Aucun nouveau APK testé sur appareil.

## Reproduction

```bash
npm ci --prefix JARVIS-Fitness-Source --ignore-scripts
node evolution/media/candidate/build.mjs
node --test evolution/media/tests/*.test.mjs
```

La sortie web est exclusivement `.cache/media-pool-candidate/`. Servir **seulement ce dossier** pour les tests (jamais le dépôt ou `.private`). Exemple sur le port 5186 : `python3 -m http.server 5186 --bind 0.0.0.0 --directory .cache/media-pool-candidate`. Pour la comparaison de l’accueil, extraire le web de la 1.4.0 sans modification et le servir séparément sur 5187.

```bash
# Chromium de test disponible via CHROMIUM_EXECUTABLE_PATH.
node JARVIS-Fitness-Source/node_modules/@playwright/test/cli.js test \
  --config evolution/media/candidate/playwright.config.mjs
COMPLETE_URL=http://127.0.0.1:5186 HOME_REFERENCE_URL=http://127.0.0.1:5187 \
  node JARVIS-Fitness-Source/node_modules/@playwright/test/cli.js test \
  --config evolution/home/playwright.config.mjs evolution/home/tests/home.spec.mjs
```

Ici : Chromium 138.0.7204.0 fourni par `@sparticuz/chromium@138.0.2`, `/tmp/chromium` et `LD_LIBRARY_PATH=$PWD/.cache/browser-libs/lib` (bibliothèques al2023 de ce même paquet), `CHROMIUM_EXECUTABLE_PATH=/tmp/chromium` pour la suite accueil. Les dépendances/caches peuvent disparaître à la reprise.

## Ce qui reste ouvert

**Les 26 groupes restent ouverts.** Il faut encore compléter les médias manquants, supprimer les mauvaises associations pool/sol dans les autres rubriques, reproduire le parcours exact signalé par l’utilisateur et achever la revue de chaque séquence animée. Les minuteries mixtes anciennes sans segment réclament un traitement explicite, pas une déduction hasardeuse. Ne pas annoncer « tous les exercices corrigés » ni livrer ce seul candidat comme mise à jour finale.

Prochaine étape : revue traçable image par image et table explicite des associations, en conservant les visuels valables ; priorité dips/triceps et récupérations aquatiques. Mettre à jour et présenter la passation **à chaque étape**, en continuant dans ce chat tant qu’il reste utilisable.
