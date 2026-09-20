# Étape 5 — propositions fondées sur des séances comparables

**Implémentation web cumulative, en lecture seule. Pas de nouvel APK à cette étape.** L’utilisateur a choisi d’installer à la fin du développement. La livraison 1.2.0 reste inchangée et contient seulement les étapes 1–4 ; l’emballage Android final devra intégrer cette extension et celles qui suivent, avec le même package/certificat et le nom **Yanis Fitness Evolution**.

## Ce qui est disponible

Un panneau **Faire évoluer mon entraînement** dans Accueil et Entraînement. Sélection d’un exercice réellement réalisé, proposition expliquée, dates et séries sources, limites, liens vers les rendez-vous avant/après séance existants. Les profils restent indépendants. Les données sont recalculées après une saisie et au changement de jour, y compris au retour au premier plan.

Le panneau distingue :

- **Hausse prudente à envisager** : un palier matériel renseigné, jamais une hausse appliquée ;
- **Maintien proposé** : pas de critère suffisant pour progresser/alléger, ou prudence liée aux ressentis ; pas un diagnostic de stagnation ;
- **Allègement à envisager** : difficulté répétée documentée, baisse chiffrée seulement si un palier borné existe ;
- **Données insuffisantes** : manque explicite, plutôt qu’une performance ou une marge inventée ;
- **Prudence** : douleur signalée, aucune progression chiffrée proposée.

**Réévaluation ≠ test maximal.** Aucun test 1RM, nouvelle séance, série ou charge n’est créé par cette analyse. Aucun bouton « appliquer » ou « accepter » ne prétend encore enregistrer une décision : c’est l’étape 6.

## Règles locales v1 — explicites et conservatrices

Ces seuils sont des heuristiques de l’application, pas une validation clinique ou une garantie de résultat. Ils utilisent les observations enregistrées, pas un modèle médical ni une IA générale.

### Comparabilité

- Les **deux dernières réalisations** de l’exercice, à des dates distinctes, toutes deux dans les **42 derniers jours**. Pas de sélection d’anciennes réussites pour contourner une dernière séance partielle ou différente.
- Une réalisation non datée/identifiant ambigu bloque l’analyse de l’exercice jusqu’à correction. Les données futures, prévues et la séance en cours ne sont pas des observations utilisables.
- Séances terminées, exercice présent exactement une fois, nombre de séries réellement complétées égal au nombre prévu. Refus des séries agrégées, incomplètes, aux identifiants dupliqués ou d’unités incohérentes.
- Même ordre d’exercices et blocs, mêmes valeurs enregistrées de phase/source/méthode (si présentes), séries prescrites, plage de répétitions, repos et tempo **prescrits**. Les champs inconnus ne sont pas reconstruits. Une pyramide/AMRAP/drop set ne peut pas être assimilé à une plage uniforme par ses seules bornes numériques.
- **Même charge réelle**, constante entre les séries et entre les deux séances. Pas d’interprétation du nombre de répétitions quand la charge change.
- Comparaisons chiffrées limitées aux **kg total** et **kg/main**, sans conversion entre les deux. Poids du corps, kg ajoutés, secondes, cardio, charges variables, schémas variables et séances allégées prévues restent hors de cette règle simplifiée.
- La technique, le matériel réellement utilisé et les temps de repos réels ne sont pas mesurés. Le panneau l’indique : équivalence des champs enregistrés, pas preuve de conditions parfaitement identiques.

### Effort, récupération et prudence

- Chaque série doit renseigner un RPE ou un RIR. Si les deux sont présents et indiquent des marges opposées, demander de vérifier plutôt que sélectionner le plus favorable.
- Hausse seulement si **chaque série** atteint le haut de la plage avec une marge (RIR ≥ 2 ou RPE ≤ 8 ; aucun autre indicateur renseigné ne contredit cette marge), **sur les deux séances**.
- Un seul incrément déjà configuré dans le profil, au maximum **5 %** de la charge réelle. Si le palier est absent/trop grand/inexploitable, maintien sans inventer un disque plus petit. Les petits incréments fractionnaires sont conservés, pas arrondis vers un autre palier.
- Allègement envisageable si, **sur chacune des deux séances**, une série est sous le bas de la plage **et** renseigne un effort élevé (RPE ≥ 9 ou RIR ≤ 1). Une séance difficile isolée ne suffit pas. Baisse d’un palier, au maximum **10 %**, charge restant positive ; sinon suggestion qualitative sans cible numérique.
- Douleur du jour ou des séances sources, et douleur élevée du dernier bilan des sept jours : pas de proposition de progression. Une réponse négative ne supprime pas une alerte positive existante.
- L’absence de douleur doit être explicitement renseignée pour le jour et pour les deux séances ; un brouillon ne vaut jamais confirmation.
- Fatigue élevée actuelle/du dernier bilan récent, énergie basse ou sommeil court du jour : pas de hausse. Un retour après séance très difficile ou contenant un commentaire à relire interrompt aussi une hausse. Les formulations exactes « RAS », « R.A.S. », « rien à signaler », « aucun problème » et « aucun » ne sont pas traitées comme des problèmes ; elles **ne remplacent pas** une réponse explicite sur la douleur. Aucun diagnostic automatique à partir du texte libre.

## Architecture et conservation

- `engine.mjs` : fonctions pures ; pas d’appel réseau, de mutation, de stockage ni de hasard. Résultat avec version de règle, profil, date, sources, preuves, raisons et éventuelle proposition. `targetLoad` est seulement le **type de changement envisagé**, pas une mutation exécutée.
- `Board.jsx` : lecture du contexte partagé, sélecteur local et fenêtre de preuves. Les seuls boutons d’action ouvrent les rendez-vous originaux avec le profil/contexte/source appropriés ; leur confirmation garde les protections de l’étape 4.
- `build.mjs` : intègre cumulativement l’étape 4, puis ajoute les panneaux à `t2` et `V5`. Toutes les autres déclarations hôtes, formulaires, moteur de bilan, génération de programme, historique, timers, voix et store sont inchangés.
- Un seul bundle web modifié ; les **271 autres fichiers web** restent byte-identiques à l’APK complet de référence. Aucun JSON personnel n’est embarqué.
- Aucune décision persistée, aucune migration et aucun changement de namespace existant. L’étape 6 ajoutera des décisions explicites avec protection contre les sources devenues obsolètes et vérification de la séance cible avant toute modification.

## Tests

- **28 scénarios moteur** : succès/insuffisance/maintien/allègement, limites de charge, RPE/RIR, ordre/blocs/unités, dates, séries agrégées, absence de sélection opportuniste, douleurs, fatigue, rendez-vous confirmés vs brouillons, profils et absence de mutation.
- **3 contrôles d’intégration** : conservation AST, déterminisme, refus d’un bundle de référence inconnu.
- **125 tests JS cumulatifs** réussis, étapes 1–5.
- **68 tests navigateur cumulatifs** : 8 nouveaux parcours, 4 comparaisons intégrales des 11 rubriques et de leurs onglets contre le web extrait de la 1.2.0 (390/1440 px, deux profils), et les régressions antérieures. Pas de mutation de programme ni de décision au rechargement. Mode sombre contrôlé visuellement, tableau défilant dans le panneau sur mobile.

Ces tests portent sur le **web cumulatif de développement**, pas sur un nouvel APK signé. Aucune nouvelle validation native/acoustique n’est revendiquée. La configuration Android publiée reste épinglée sur la 1.2.0, inchangée.

```sh
node evolution/adaptation/build.mjs
TZ=Indian/Reunion node --test evolution/{reminders,voice,spokesperson,appointments,adaptation}/tests/*.test.mjs
# Servir .cache/adaptation-web sur 5178 et le web extrait de la 1.2.0 sur 5177.
LD_LIBRARY_PATH="$PWD/.cache/chromium-libs/lib" CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
  JARVIS-Fitness-Source/node_modules/.bin/playwright test --config evolution/adaptation/playwright.config.mjs
```

**Prochaine étape : 6 — accepter, refuser ou reporter une proposition, conserver la décision et suivre son effet.** Confirmation obligatoire, cible compatible, aucun changement rétroactif des performances. Ensuite notifications Android application fermée, puis IA conversationnelle générale en dernier.
