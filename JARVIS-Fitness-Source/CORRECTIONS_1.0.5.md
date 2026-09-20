# Correctif 1.0.5 — 20 septembre 2026

## Cause reproduite

Le JSON fourni contient, pour Yanis, un minuteur `warmup` terminé, sans `meta.workoutId`, avec `workout: null`.

L’ancien code effectuait :

```js
if (q.workout?.id === t.meta.workoutId) q.workout.warmupDone = true;
```

Les deux identifiants étaient `undefined` : la comparaison réussissait puis l’écriture sur `null` provoquait `Cannot set properties of null (setting 'warmupDone')`. L’erreur survenait dans le fournisseur d’état, hors de la protection des pages, ce qui démontait toute l’interface. Le minuteur terminé restait sauvegardé et réapparaissait à l’ouverture suivante.

Ce scénario a été reproduit dans la version non corrigée avec le fichier fourni : zéro `.app-shell` après validation.

## Corrections

- Validation d’un échauffement autonome ou d’une séance supprimée sans accéder à une séance inexistante.
- Une séance n’est marquée échauffée que si son identifiant existe et correspond au minuteur.
- Le minuteur terminé est supprimé après validation, sans créer de performance fictive.
- Recalcul immédiat de l’affichage au retour au premier plan ; rattrapage du minuteur dès le montage et lors du retour de visibilité/focus.
- Protection contre des notifications multiples au même changement d’étape.
- Protection d’erreur autour du fournisseur d’état : une erreur imprévue affiche une possibilité de recharger plutôt qu’un écran vide.
- Interdiction explicite des chemins privés dans le serveur de développement, même lorsqu’un fichier est absent (pas de réponse HTML de repli sur ces chemins).

## Tests

- Tests unitaires : **83 réussis, 2 ignorés** (anciens tests conditionnels à une sauvegarde privée absente).
- Tests navigateur : **28 réussis, 11 ignorés** au total après correction du test de protection des chemins privés ; les tests ignorés requièrent une ancienne sauvegarde de développement non fournie.
- Parmi eux, **11 nouveaux tests de régression** : les deux profils, échauffement autonome, séance correspondante, autre séance, séance supprimée, persistance après rechargement, décompte, pause/reprise, rattrapage après suspension, résultats cardio/piscine et fermeture du repos.
- Test supplémentaire sur le **bundle de production**, viewport téléphone 412 × 915 : import du véritable JSON fourni via le sélecteur de fichiers, validation, rechargement. Vérification que séances, activités, mesures et photos restent identiques pour les deux profils.
- Signature APK v2 et v3 vérifiée avec `apksigner` ; alignement des ressources vérifié ; fichiers DEX natifs inchangés ; ressources web embarquées comparées octet par octet au build corrigé.
- Limite : pas d’installation ni d’essai sur un téléphone Android physique dans cet environnement.

## Livraison sans dépendre de GitHub Actions

Ce dépôt ne comportait pas de workflow ni d’historique de builds Actions au moment du diagnostic. Le problème de quota d’artefacts évoqué pour un autre projet n’est donc pas établi ici.

Les téléchargements directs du SDK Android ne fonctionnaient pas dans l’environnement. L’APK de secours a été construit localement avec le script `scripts/rebuild-apk.py` :

1. compilation des sources React corrigées et du runtime d’export portable ;
2. décodage des ressources de l’APK original avec Apktool 2.9.3, **sans modifier son code natif DEX** ;
3. remplacement des assets web, du numéro de version et de l’identifiant d’installation ;
4. recompilation des ressources, alignement ZIP et signature avec une nouvelle clé privée ;
5. vérification cryptographique et comparaison des assets/DEX.

Cette procédure ne crée aucun artefact GitHub Actions et n’est pas bloquée par leur quota.

### Reproduire

```sh
npm ci
npm test
npm run build:portable
npm run build
python3 scripts/rebuild-apk.py \
  --base '../JARVIS-Fitness-Yanis-Emilie (1).apk' \
  --java /chemin/vers/java \
  --apktool /chemin/vers/apktool.jar \
  --apksigner /chemin/vers/apksigner.jar \
  --keystore /chemin/prive/jarvis-fixed.p12 \
  --password-file /chemin/prive/mot-de-passe \
  --output /chemin/livraison/JARVIS-Fitness-1.0.5-corrige.apk
```

Un build Android classique reste possible via `npm run android:build` avec le SDK Android et Java 17. Pour mettre à jour la version de secours installée, il faudra signer avec **la même nouvelle clé**, conservée hors dépôt. Ne jamais publier de clé ni de mot de passe dans GitHub ou les assets web.

## Compatibilité d’installation

- Version : **1.0.5**, code **6**.
- Android minimal : **8.0 / API 26**.
- Application : **JARVIS Fitness Corrigé**, identifiant `app.jarvis.fitness.fixed`.
- L’ancienne clé de signature n’était pas fournie. La nouvelle application s’installe en parallèle : les données ne sont pas transférées automatiquement, il faut importer le JSON.
- Aucun JSON personnel n’est embarqué dans l’APK public.

SHA-256 du fichier livré :

```text
d553099621994c907938e11ac16b48101236a91f3a017c0f3614f370636b7418
```
