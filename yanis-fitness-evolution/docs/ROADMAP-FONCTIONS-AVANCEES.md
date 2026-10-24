# Chantiers avancés différés — JARVIS / Yanis Fitness Evolution

**Enregistré le :** 24 octobre 2026  
**Statut :** travail mis de côté à redémarrer sur demande explicite de l’utilisateur  
**Base fonctionnelle conservée :** Yanis Fitness Evolution **1.10.0**, versionCode **193**, commit `78355a7`

## Décision

L’utilisateur a demandé de conserver ce travail pour une reprise ultérieure. Les fonctions ci-dessous ne sont **ni annulées ni présentées comme disponibles**. Elles ne doivent pas être simulées dans l’interface et ne doivent pas être regroupées dans une seule version sans validation intermédiaire.

La version 1.10.0 reste la référence : guidage de séance sur les démonstrations, adaptation ciblée des charges avec confirmation, repères vocaux fondés sur l’historique, planning et données existants conservés.

## Ordre de reprise proposé

L’ordre suivant est une proposition technique, pas une date de livraison ni un engagement de version. Chaque brique fera l’objet d’un périmètre, de tests et d’une validation séparés.

### 1. Focus audio et musique pendant les consignes vocales

**Objectif :** réduire temporairement le volume des autres lectures pendant une consigne de JARVIS, puis restaurer l’état audio.

**Travail à reprendre :**

- intégrer le focus audio Android natif et son cycle de vie ;
- couvrir la mise en pause, la reprise, l’arrière-plan, les interruptions et les appels ;
- tester avec plusieurs lecteurs et versions Android, dont Spotify et Apple Music lorsqu’ils sont disponibles ;
- distinguer le ducking système d’un prétendu accès au flux audio interne de ces applications ;
- conserver un réglage utilisateur et une désactivation simple.

**Critères minimaux d’acceptation :**

- aucune coupure définitive de la musique après une annonce ;
- aucune annonce vocale perdue silencieusement ;
- comportement réel vérifié sur téléphone, pas seulement dans le navigateur ;
- aucune promesse de contrôle direct de Spotify ou Apple Music sans API correspondante.

**Fondations existantes :** `src/components/VoiceCoach.jsx`, `src/engine/voice-coach.js`, `src/engine/speech.js`.

### 2. Analyse caméra et comptage expérimental des répétitions

**Objectif initial :** une bêta limitée à un ou deux exercices simples, avec correction manuelle possible. L’analyse du squelette et le comptage sont deux étapes distinctes.

**Travail à reprendre :**

- choisir un moteur de pose compatible avec l’application et les appareils visés ;
- demander la permission caméra explicitement et définir le traitement local ou l’envoi éventuel des images ;
- cadrer l’angle, la distance, la lumière, les occlusions et la position du téléphone ;
- détecter les phases du mouvement avant de compter une répétition complète ;
- définir les règles par exercice : amplitude, pauses, répétitions partielles et perte de suivi ;
- afficher la confiance et permettre de corriger le compteur avant l’enregistrement ;
- ne proposer une correction technique vocale que pour des règles validées sur de vrais mouvements.

**Critères minimaux d’acceptation :**

- aucun résultat présenté comme fiable lorsque le corps n’est pas visible ou que la confiance est insuffisante ;
- aucune série enregistrée automatiquement sans validation ou règle explicite et testée ;
- correction manuelle simple et historique réel préservé ;
- protocole de test sur plusieurs morphologies, angles et conditions de lumière ;
- aucune correction médicale ou diagnostic de douleur.

**Fondations d’interface uniquement :** `src/components/Movement.jsx`, `src/pages/Training.jsx`. La version actuelle affiche un objectif et ne compte pas les répétitions par vision.

### 3. Récupération connectée : HRV, sommeil et stress

**Objectif :** utiliser uniquement des données réellement disponibles, avec leur source, leur date et leur couverture, sans réinventer les scores des fabricants.

**Travail à reprendre :**

- commencer par Health Connect sur Android lorsque les données y sont réellement publiées ;
- définir les autorisations et la synchronisation avant toute intégration de compte Garmin, Apple, Whoop ou Oura ;
- distinguer les données directes, les métriques calculées localement et les scores propriétaires ;
- traiter les artefacts et valeurs manquantes des intervalles RR avant toute métrique HRV expérimentale ;
- conserver le bilan manuel comme solution de secours ;
- faire évoluer la séance existante uniquement selon des règles explicites et avec le consentement prévu par le parcours.

**Critères minimaux d’acceptation :**

- source et fraîcheur visibles pour chaque donnée ;
- aucune valeur sommeil, stress ou HRV fabriquée à partir de la seule fréquence cardiaque ;
- aucune équivalence implicite entre un RMSSD local et un score de récupération constructeur ;
- aucune adaptation destructive du planning ou de l’historique ;
- suppression et révocation des accès prévues.

**Fondations existantes :** `src/components/WearablePanel.jsx`, `src/engine/wearable.js`, `src/engine/fitness.js`. Le cardio BLE et les intervalles RR existants ne constituent pas une chaîne complète HRV/sommeil/stress.

### 4. Reconnaissance des aliments par photo

**Objectif :** proposer une aide à la saisie, jamais une valeur nutritionnelle présentée comme exacte à partir d’une seule image.

**Travail à reprendre :**

- choisir le modèle de reconnaissance et la base nutritionnelle ;
- définir explicitement si les photos restent locales ou sont envoyées à un service ;
- détecter les aliments candidats et afficher un niveau de confiance ;
- demander confirmation des aliments, des portions, de la cuisson et des ajouts visibles ou non ;
- estimer les incertitudes de poids, d’huile, de sauce et de composition ;
- enregistrer seulement après validation de l’utilisateur et permettre la correction du repas.

**Critères minimaux d’acceptation :**

- aliments et quantités modifiables avant enregistrement ;
- incertitude visible et absence de faux chiffres précis lorsque la portion est inconnue ;
- consentement explicite pour tout traitement externe des photos ;
- les règles alimentaires, allergies et préférences ne sont jamais déduites d’une photo.

**Fondation existante :** `src/engine/nutrition.js` et le journal alimentaire actuel. Aucune reconnaissance visuelle n’est présente dans la 1.10.0.

## Règles communes à conserver lors de la reprise

- Ne pas régresser le programme source, le déplacement/copie des séances, les blocs liés ou l’historique.
- Une demande de modification de charge, de séance ou d’exercice reste ciblée sur l’élément concerné : **aucun programme parallèle** et aucun message générique de création de programme.
- Un report de séances reste un simple décalage des dates, pas une régénération.
- Ne jamais inventer une répétition, une métrique de santé, un aliment, une portion ou une connexion constructeur.
- Prévoir des autorisations explicites, une finalité claire, la suppression des données et une solution de repli hors service externe.
- Ajouter les tests Node et Playwright adaptés, puis effectuer les validations matérielles nécessaires : caméra, capteurs, audio et santé ne peuvent pas être validés par la seule CI.
- Une brique validée à la fois ; pas de release regroupant tous ces chantiers sans nouvelle décision.

## Point de reprise

À la prochaine demande, commencer par relire ce document et choisir explicitement **une seule brique**, son périmètre et son appareil de validation. Aucune date ni numéro de version n’est réservé pour ces travaux.
