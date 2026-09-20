# Étape 6 — décisions, application confirmée et suivi

**Implémentée dans le web cumulatif de développement. Aucun nouvel APK à cette étape.** L’utilisateur installera à la fin. Le nom **Yanis Fitness Evolution**, le package et la signature permanents restent inchangés ; la 1.2.0 publiée reste limitée aux étapes 1–4.

## Parcours disponible

Dans le panneau d’adaptation d’Accueil et d’Entraînement : **Choisir une décision → accepter, refuser ou reporter → vérifier → confirmer**. Fermer, annuler, sélectionner une cible ou ouvrir la relecture n’enregistre rien.

- **Accepter une proposition chiffrée** : choisir explicitement **une seule séance du programme actuel**, future ou du jour, dans les 30 prochains jours. Voir sa cible réellement stockée avant/après. Une cible automatique/non fixée est indiquée comme telle : la charge historique n’est pas présentée à tort comme la cible actuelle. Cocher l’accord, relire puis confirmer.
- **Accepter un maintien ou un allègement non chiffrable** : mémoriser le principe, **sans prétendre appliquer une charge**.
- **Refuser** : mémoriser le refus et sa note facultative, sans modifier le programme.
- **Reporter** : choisir une date entre demain et dans 30 jours. Le report reste visible dans le panneau et l’historique ; arrivé à échéance, il indique **À revoir**, sans appliquer une proposition ni créer une notification Android.
- **Réexaminer** : décision explicite, nouvelle analyse avec les données actuelles, nouvelle confirmation. L’ancienne entrée reste conservée avec un lien vers celle qui la remplace, même si les nouvelles données changent la proposition. Les sources obsolètes ne sont jamais réutilisées comme autorisation.
- Une proposition déjà acceptée ne peut pas être appliquée une deuxième fois avec les mêmes preuves. Aucun bouton de refus ultérieur ne prétend annuler silencieusement une modification déjà appliquée.

## Protections avant toute modification

`ticket` capture le profil, la date, l’analyse et une représentation canonique exacte des sources pertinentes, ressentis, rendez-vous, paramètres de palier et décisions. `prepare` vérifie cette capture et prépare un choix **sans mutation**. `apply` revérifie dans la transaction `updateProfile` : une fenêtre devenue obsolète ne peut donc pas modifier un autre profil ou une séance changée entre-temps.

- Analyse toujours admissible : hausse, maintien ou allègement. Pas de décision d’adaptation à partir d’une alerte douleur ou de données insuffisantes.
- Même profil et même journée ; rejet après minuit, changement de sources, modification des ressentis ou décision concurrente.
- Pour une charge : aucune séance en cours, cible actuelle unique et prévue, ni ancienne/archive, ni cible déjà réalisée, ni allègement source, ni séries déjà saisies.
- Même prescription que les preuves de l’étape 5 : exercice/unité, séries, plage, ordre, blocs, tempo, repos, phase et méthode.
- Le **véritable constructeur de séance hôte `Yg`** est exécuté sur une copie pour vérifier qu’au démarrage la prescription, le matériel et la charge seront conservés. Une substitution d’exercice, une indisponibilité ou une adaptation de volume incompatible bloque l’application.
- La séance choisie, son programme, sa date, sa cible et le matériel sont contrôlés à nouveau lors de la confirmation.
- Une seule écriture ciblée : `targetLoad` et l’identifiant de décision sur **un exercice d’une séance**. Aucune réécriture des séries réalisées, autres séances, historiques, références 1RM, chrono ou archives.
- Doublons et rejeux de transaction sans double application. Une erreur de contrôle ne laisse aucune mutation partielle.
- Le message de réussite attend la présence de la décision dans le contexte partagé. Le statut de sauvegarde durable/les erreurs de stockage restent ceux du store complet d’origine, pas un second système parallèle.

## Respect du choix dans le calcul historique de charge

L’aperçu original utilisait `ho` (calcul de recommandation) alors que le constructeur de séance honore aussi `targetLoad`. Modifier seulement le champ du programme aurait pu afficher une autre charge. Une délégation ciblée est ajoutée à `ho` :

1. Une charge acceptée, encore reliée à sa cible compatible et à son profil, apparaît comme **Charge confirmée par vous**, et passe réellement dans la séance démarrée.
2. **Un refus/report ne doit pas être contourné par l’ancien calcul automatique**, qui pouvait reproposer le même palier à partir des mêmes séries. Tant que les deux réalisations et la prescription de cet exercice restent identiques aux preuves de la décision, aucun nouveau palier automatique n’est ajouté : une cible explicite existante est conservée ; à défaut, le repère de charge réellement observé est retenu. Cela ne fixe aucun `targetLoad` dans le programme refusé/reporté.
3. Pour une acceptation, les autres séances équivalentes non choisies ne reçoivent pas indirectement ce même palier via le calcul historique.
4. Une nouvelle réalisation ou une prescription différente sort de cette décision : elle nécessite une nouvelle analyse. Cette protection n’est pas un verrou médical universel ni un blocage permanent de toute progression future.
5. Le corps complet du calcul historique est conservé et exécuté. Si une recommandation historique de récupération est déjà plus basse que le repère retenu après refus/report, elle reste prioritaire : le verrou ne force pas une hausse et ne masque pas cet allègement. Sans décision pertinente, le calcul historique reste inchangé. Pas de suppression générale des fonctionnalités de charge, de force ou des conventions existantes.

## Historique et suivi factuel

Namespace additionnel **`p.evolutionDecisions = { version: 1, records: [...] }`**, inclus dans les vrais exports/imports JSON des deux profils. L’historique garde le choix, sa date/note/report, les motifs et preuves au moment du choix, l’éventuel lien `supersedes`, la cible avant/après et la distinction `applied`.

Les clichés de prescription sont indépendants des tableaux modifiables du programme. Une modification ultérieure ne réécrit pas rétroactivement la décision. Les entrées sont affichées par pages de 20, sans éviction silencieuse.

Le suivi est calculé en lecture seule :

- **En attente** : cible appliquée mais pas de séance réalisée.
- **En cours** : workout lié par `planId`, aucune réussite déduite.
- **À vérifier / cible modifiée / absente** : aucun rétablissement automatique, historique conservé.
- **Observation réelle** : séance enregistrée liée par son `planId` exact, avec date réelle. Compter seulement les séries complétées, non agrégées, d’unité et de valeurs valides, sans identifiants dupliqués. Afficher les charges, répétitions et efforts saisis ; conserver la distinction partielle/terminée.
- Plusieurs réalisations liées ou identifiants de séries ambigus : aucun résultat favorable choisi arbitrairement.
- Une série sur trois est affichée **une sur trois**, jamais trois séries réalisées parce qu’elles étaient prévues. Une prescription modifiée limite la comparaison. Aucun « progrès grâce à cette décision » inventé et aucun diagnostic.

## Conservation technique

- Extension cumulative de l’étape 5 ; pas de reconstruction depuis l’ancienne archive incomplète.
- Point d’extension React facultatif dans le panneau de l’étape 5. Sans contrôleur de décision, l’aperçu de l’étape 5 reste en lecture seule.
- Helpers `prescription` et `sample` exportés de l’étape 5 sans modifier leurs règles.
- Injection de la route de fenêtre dans `Q5`, délégation après le calcul historique complet dans `ho`, liaison du contrôleur au panneau. `Yg`, le provider, le stockage, la fin de séance, les timers, les formulaires et le reste du programme hôte restent inchangés.
- Les tests de conservation masquent seulement les nouveaux contrôles/historiques, l’ancien pied de panneau remplacé et normalisent sa phrase d’introduction volontairement actualisée. Les données et preuves de l’étape 5 restent comparées, ainsi que les 11 rubriques et leurs onglets.
- Aucun appel réseau, service de notification natif, nouvelle permission ni écoute automatique. L’ouverture de la fenêtre annule une lecture/capture antérieure via le coordinateur existant.

## Vérifications

- **26 tests moteur + 3 tests d’intégration** propres à cette étape : absence d’effet à l’ouverture/relecture, cible unique, snapshots, transaction périmée, changement de profil/date/source/matériel, refus/report/réexamen, doublons, conservation du vrai démarrage et suivi sans série inventée.
- **154 tests JavaScript cumulatifs** réussis, étapes 1–6.
- **77 tests navigateur cumulatifs** : 9 nouveaux parcours, conservation complète dans les deux profils à 390/1440 px et régressions antérieures. Ils utilisent les vrais contrôles d’export/import, le véritable aperçu et démarrage d’entraînement, puis la saisie d’une série et la clôture partielle pour contrôler le suivi.
- Mode sombre vérifié visuellement sur mobile ; relecture et confirmation restent accessibles sans débordement horizontal.
- Bundle validé : `3280c9c4ced5f827a9ddc51c53ad631c94dc08a06fa1206cbf2119c802bfa9c7`. Un seul bundle web changé ; les 271 autres fichiers web sont conservés. APK 1.2.0, configuration de livraison Android et identité de signature inchangés.

Les tests portent sur le **web cumulatif**, pas sur un nouvel APK signé. Aucun essai téléphone ni nouvelle validation acoustique/native n’est revendiqué. L’APK final et ses tests d’emballage restent à produire après les étapes restantes.

```sh
node evolution/decisions/build.mjs
TZ=Indian/Reunion node --test evolution/{reminders,voice,spokesperson,appointments,adaptation,decisions}/tests/*.test.mjs
# Web étape 6 sur 5179 ; référence étape 5 inchangée sur 5178.
LD_LIBRARY_PATH="$PWD/.cache/chromium-libs/lib" CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
  JARVIS-Fitness-Source/node_modules/.bin/playwright test --config evolution/decisions/playwright.config.mjs
```

**Prochaine étape : 7 — notifications Android application fermée**, avec permission, programmation, annulation après réalisation/réexamen, dédoublonnage et discrétion sur écran verrouillé. **L’IA conversationnelle générale reste en dernier.**
