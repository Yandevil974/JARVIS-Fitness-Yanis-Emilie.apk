# Étape 3 — JARVIS porte-parole de l’équipe

**Implémentation intégrée et testée dans l’application web complète. Le module vocal Android a été enrichi, compilé contre les API réelles et testé avec des services simulés. Aucun nouvel APK signé, aucune intégration DEX et aucun essai acoustique sur téléphone à ce stade.**

L’utilisateur a validé le passage à cette étape après le compte rendu de l’étape 2. L’étape suivante est **4 — rendez-vous interactifs**. L’IA conversationnelle générale reste réservée à la fin.

## Comportement

Sur l’accueil, « Le point de ton équipe » complète — sans remplacer — le tableau des rappels et les autres éléments du tableau de bord.

- Bonjour personnalisé et **trois priorités visibles au maximum**, attribuées aux coaches virtuels déjà présents dans chaque profil.
- **Pourquoi ?** expose le signal enregistré, sa date ou le calcul de l’échéance. Les boutons ouvrent les formulaires/pages existants ; ouvrir n’équivaut pas à valider.
- **Écouter le point**, puis **Répéter le point** après une lecture terminée : deux priorités au maximum à l’oral. Répéter lit le point actuellement affiché, pas un ancien message.
- **Plus tard · 1 h** masque temporairement ce point uniquement. Il ne reporte ni ne valide aucun rappel. La pause survit au rechargement ; « Afficher maintenant » la lève.
- Réglages par profil : choix d’une voix française disponible sur l’appareil, débit 0,8 / 0,9 / normal 0,98 / 1,1 / 1,2, voix de JARVIS activée, accueil facultatif et mode silencieux.
- Le mode silencieux coupe **toutes** les lectures, tests sonores et annonces vocales des chronos inclus. Un indicateur demeure sur les autres pages. Il ne bloque pas une dictée explicitement demandée.
- « Actualiser les voix disponibles » lance un diagnostic, **sans ouvrir le microphone**. « Tester ces réglages » permet de tester le choix avant de l’enregistrer ; fermer la fenêtre arrête cette lecture. Pour réactiver le son depuis un profil silencieux, enregistrer d’abord la désactivation du mode silencieux.
- Les identifiants de voix navigateur et Android sont séparés. Une voix disparue provoque une erreur explicite plutôt qu’un remplacement silencieux. Certaines voix nécessitent Internet ; aucune garantie de fonctionnement hors ligne.

### Accueil vocal facultatif

**Désactivé par défaut**, même si la voix de JARVIS était déjà activée auparavant.

Une fois activé : au plus une **tentative** par jour local et par profil, seulement sur l’accueil, au premier plan, sans fenêtre ouverte, sans chrono actif et sans audio occupé. La tentative est enregistrée avant la lecture : un refus d’autoplay, une interruption ou un échec ne déclenche pas une boucle de relance. Le bouton manuel reste disponible. Une interaction peut être nécessaire selon le navigateur.

Un changement de profil, une sortie de l’accueil ou le passage en arrière-plan annule sa lecture ; un callback tardif ne la marque pas comme terminée. Les chronos gardent leur coordination prioritaire et leur débit normal. L’accueil ne lance **jamais** le microphone.

### Priorités explicables, pas de conclusions inventées

Le moteur `engine.mjs` est local et déterministe :

1. Signal de douleur explicitement déclaré dans les check-ins récents (écart de zéro à trois jours) : rappel de prudence daté attribué au référent santé, **sans diagnostic**.
2. Fatigue déclarée de 4 ou 5/5 dans le dernier check-in récent : invitation à refaire le point, pas une déduction de baisse de performance.
3. Rappels dus calculés par l’étape 1, avec les échéances datées avant les premiers repères non renseignés. Les tâches reportées ne sont pas réannoncées.
4. Sans rappel dû : prochaine échéance connue, décrite comme future. Sans échéance disponible : message honnête, pas un bilan positif inventé.

Les coaches/noms/rôles proviennent des métadonnées de l’application complète. Aucun appel de modèle, aucune analyse de photo, aucun nouveau programme, aucune proposition d’adaptation de l’étape 5. Le texte rappelle qu’il s’agit d’une **équipe virtuelle à règles locales**.

## Données et conservation

État additionnel sous chaque profil, sans stockage d’enregistrement ou de transcription supplémentaire :

```text
spokesperson:
  version: 1
  settings: silent, rate, voiceIds.browser, voiceIds.android, greetingEnabled
  daily: day, attempted, played
  deferred: from, until
```

Les réglages importés sont normalisés ; les valeurs invalides ne peuvent pas activer l’accueil automatiquement. Une pause importée doit correspondre à exactement une heure et ne pas commencer dans le futur. Les champs sont conservés par la validation existante des sauvegardes JSON.

`build.mjs` enchaîne le correctif historique, les rappels et la coordination vocale sur **l’APK complet fourni et épinglé**, pas sur l’ancienne archive de sources.

- Deux fonctions hôtes seulement évoluent depuis l’étape 2 : `t2` (ajout du point sur l’accueil) et `I3` (observateur des préférences).
- Toutes les autres déclarations hôtes, les coaches, les écrans, les formulaires et les règles des chronos sont conservés.
- **272 ressources web présentes ; 271 strictement inchangées.** Seul le bundle principal est étendu. Aucun fichier de sauvegarde privée n’est servi.
- La coordination vocale commune reçoit les préférences du profil avant les effets d’accueil, refuse les réglages d’un autre profil et permet une annulation par propriétaire de lecture.

Bundle final testé, SHA-256 :

`d581bf4058ef0079d727cef521066f3c06227e1b11d4d467d3ed3a69655000e6`

## Android : ajout des options vocales

Le plugin conserve `protocolVersion: 2` et annonce séparément `voiceOptionsVersion: 1`.

- Diagnostic : voix françaises via `TextToSpeech.getVoices()`, identifiant, langue, indication d’utilisation du réseau.
- Lecture : application de `voiceId` et de `rate`, contrôle des erreurs de sélection et de débit.
- Un choix par défaut réinitialise la langue au lieu d’hériter de la voix du profil précédent.
- Un ancien plugin sans la capacité supplémentaire est refusé pour une voix ou un débit personnalisés. Les nouveaux réglages ne sont pas présentés comme appliqués lorsqu’ils ne le sont pas.

SHA-256 de la source native compilée : `1b1fae3c7892e018ec0843ae0ac8b19151f6cc95e84ebd0371b60c89977b09e2`.

**Compilation API 34 ≠ exécution Android.** Le bridge, les langues installées, les permissions, l’autoplay, l’arrêt écran verrouillé et l’acoustique restent à vérifier sur un appareil après intégration et signature. Les outils de compilation et leurs dépendances épinglées sont documentés dans [l’étape 2](../voice/README.md).

## Vérifications du build final

- **75 tests JS réussis** : 27 rappels, 21 coordination vocale/intégration et 27 de cette étape (15 moteur/données, 8 lecture/bridge simulé, 4 intégration/conservation).
- **49 tests navigateur réussis** : 10 nouveaux parcours du porte-parole, 4 comparaisons des 11 rubriques et de tous leurs onglets pour les deux profils à 390/1440 px, 8 parcours vocaux, 10 rappels et 17 régressions historiques. Pour les comparaisons, seul le nouveau point d’équipe est exclu ; le compositeur vocal et le tableau de rappels restent comparés.
- **20 scénarios natifs JVM réussis**, avec doubles des services Android : les 14 scénarios de l’étape 2 et 6 sur les voix/débits (énumération du français, réseau, application et retour au défaut, voix absente/non française, débits invalides, refus du moteur).
- Compilation du plugin de production contre **Android API 34 et les signatures du véritable APK complet**, sans doubles pour cette compilation. Deux avertissements d’import inutilisé dans les annotations Capacitor ; aucune erreur.
- Contrôle visuel du panneau mobile et de ses réglages ; défilement du formulaire, fermeture clavier et absence de débordement horizontal testés.

La reconnaissance et la synthèse utilisées par les tests navigateur sont **simulées**. Les tests JVM ne tournent pas dans un émulateur. Ces résultats ne certifient pas le fonctionnement audio d’un téléphone.

### Reproduire

Depuis la racine, avec les dépendances et l’APK de référence décrits dans les étapes précédentes :

```sh
node evolution/voice/build.mjs
node evolution/spokesperson/build.mjs
TZ=Indian/Reunion node --test evolution/reminders/tests/*.test.mjs evolution/voice/tests/*.test.mjs evolution/spokesperson/tests/*.test.mjs
node evolution/voice/compile-native.mjs
python3 evolution/voice/tests/native-lifecycle.py
```

Servir `.cache/spokesperson-web` sur 5175 et `.cache/voice-web` sur 5176 (référence de conservation). Dans cet environnement, utiliser les outils de processus pour les serveurs persistants ; hors Arena, deux terminaux suffisent :

```sh
python3 -m http.server 5175 --bind 0.0.0.0 --directory .cache/spokesperson-web
python3 -m http.server 5176 --bind 0.0.0.0 --directory .cache/voice-web
```

Puis :

```sh
LD_LIBRARY_PATH="$PWD/.cache/chromium-libs/lib" \
CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
JARVIS-Fitness-Source/node_modules/.bin/playwright test \
  --config evolution/spokesperson/playwright.config.mjs
```

`COMPLETE_URL` et `STEP2_URL` permettent d’utiliser d’autres adresses. Les rapports, compilations, captures et assets reconstruits restent dans `.cache`, hors Git.

## Livraison et suite

La **1.0.6 reste le dernier APK livré** et ne contient pas ces évolutions. La clé privée de sa signature n’est pas disponible dans l’environnement restauré. Aucun changement de certificat/package, aucune demande de désinstallation et aucune promesse de mise à jour compatible pour contourner ce blocage.

**Étape suivante : 4 — rendez-vous interactifs avant/après séance, bilan hebdomadaire et mensurations mensuelles, photos facultatives.** La mémoire des décisions, les adaptations confirmées, les notifications application fermée et l’IA générale restent dans l’ordre validé.
