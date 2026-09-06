# Vérification — JARVIS Fitness 1.0.4

## Tests exécutés

| Vérification | Résultat |
|---|---|
| Tests métier, données, migration et stockage | **85 réussis, 0 échec** |
| Parcours Playwright | **27 réussis, 0 échec**, plus 1 test de protection web |
| Comparaison au `weekPlan` original des deux HTML | **2 184 journées conformes** : 364 jours × 3 disponibilités × 2 profils |
| Reprise du JSON réel | Noms, charges, séries, répétitions, RIR, RPE et statuts comparés ligne par ligne |
| Séries renseignées | 387 conservées ; 350 associées à des jours déclarés réalisés, 37 à une séance non effectuée |
| Répétitions manquantes | 80 séries conservées sans inventer des reps ou un tonnage |
| Bilans d’équipe | 3 bilans et 10 textes historiques comparés au JSON |
| Photos M12 | 4 reconnues comme simulations source ; séparées des 4 photos J0 |
| Restauration | Profil seul, idempotence, Émilie conservée, saisie locale plus récente conservée |
| Chrono combiné | Temps suivi par bloc, pause/saut, confirmation explicite et résultat partiel sans piscine fictive |
| Écrans | 344, 360, 690, 829, 840 et 1440 pixels selon les scénarios |
| Compilation web / Android | Réussie, Vite 6.4.3 / Gradle 8.2.1 / Java 17 |
| APK | `app.jarvis.fitness`, version 1.0.4, code 5, Android API 26+ / cible 34 |

## Parcours particuliers vérifiés

- Nouveau profil vide : reprise du JSON intégré, données présentes après rechargement et import non dupliqué.
- Profil déjà utilisé : restauration proposée, confirmation et sauvegarde avant fusion ; pas d’écrasement silencieux.
- Import du JSON original avec le sélecteur de fichiers normal.
- METCON + piscine visibles dans la semaine suivante, détails d’intervalles et exercices aquatiques accessibles.
- Affichage des huit rôles, des ressentis et de la demande de ne pas modifier la programmation.
- Correction d’une charge importée même si ses répétitions sont absentes.
- Navigation sur Fold5 fermé/déplié et S24 simulés ; continuité de la séance pendant le redimensionnement.
- Sauvegarde corrompue conservée en quarantaine ; protection contre un autre écrivain.

## Limites

Les essais d’interface s’exécutent dans Chromium. Aucun téléphone physique n’était connecté : il faut encore valider la dictée, la voix française, la sélection/partage de fichiers et la lecture du fichier privé sur les téléphones réels. La compilation Java et la structure de l’APK ne remplacent pas ces tests matériels.

L’APK est une version de test signée pour installation directe, non une publication Google Play. Les annonces en arrière-plan ne sont pas garanties lorsque le système suspend l’application.

L’équipe est virtuelle et fonctionne localement. Les avatars sont illustratifs. Les avis historiques restent des textes importés, pas de nouveaux diagnostics ni une preuve de consultation professionnelle. L’atlas humain est pédagogique, pas un modèle biomécanique 3D rotatif.

## Traces

`tests/unit-results.log`, `tests/e2e-output.log`, `tests/e2e-results.json`, `tests/android-build.log`, `tests/apk-signature.log`, `tests/apk-manifest.txt`.

Tests spécifiques : `tests/source-fidelity.test.js` et `tests/restored-app.spec.js`. Le JSON personnel n’est pas inclus dans l’archive de sources ; ses tests sont optionnels quand ce fichier n’est pas présent.

## Maintenance 1.0.4

Les nouveaux tests vérifient les familles de séances liées, leur décalage d’horaire et leur report sans perte d’historique, les simulations photo verrouillées, la datation et les versions de bilans, les écritures invalides bloquées et la quarantaine en cours de session. La protection web a été contrôlée par requêtes : sauvegarde privée, clé et assets Android refusés (HTTP 403), application et médias publics accessibles.

Les essais lancés simultanément ont saturé la mémoire disponible. Les résultats ci-dessus proviennent des relances séparées réussies. La compilation finale utilise 768 Mo de mémoire Java et un seul worker.

Traces complémentaires : `tests/maintenance.test.js`, `tests/maintenance.spec.js`, `tests/maintenance-e2e.log`, `tests/preview-security.spec.js`, `tests/preview-security.log`.
