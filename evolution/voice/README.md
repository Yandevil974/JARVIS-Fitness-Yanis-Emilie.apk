# Étape 2 — voix et microphone

> **Mise à jour livraison :** les étapes 1 à 3 sont désormais intégrées dans [l’APK signé 1.1.0 Évolution](../android/README.md), sous une nouvelle identité autorisée pour installation parallèle. Les anciens constats « pas d’APK / intégration DEX à faire » ci-dessous décrivent le checkpoint de cette étape, avant livraison. **Les essais Android réels restent à faire.**


> Le compte rendu chiffré et le hash ci-dessous correspondent au checkpoint étape 2 (`e8c32f5`). Le contrôleur partagé et le plugin ont depuis été enrichis pour [l’étape 3 — porte-parole](../spokesperson/README.md), avec choix de voix, débit et silence. Les commandes reconstruisent désormais ces sources communes actualisées ; le harnais natif comporte 20 scénarios. Voir l’étape 3 pour les résultats cumulatifs et le hash du nouvel aperçu complet.

**État : interface intégrée et testée sur le web ; module Android réécrit, compilé contre les API réelles et testé avec services simulés. Pas encore intégré aux DEX d’un nouvel APK complet, signé ou essayé sur téléphone. L’étape n’est donc pas déclarée validée sur Android.**

Le dernier APK disponible reste la 1.0.6. La clé de signature est indisponible dans l’environnement restauré ; aucun nouveau certificat ou package n’a été créé. Voir [le plan et le blocage de livraison](../README.md).

## Ce qui est implémenté

### Dans JARVIS

- États visibles : préparation du microphone, écoute, transcription, lecture, erreur, retour au repos.
- **Dictée → brouillon modifiable → envoi explicite**. Aucun envoi ou changement de programme n’est déclenché par une reconnaissance seule.
- Deuxième pression sur le micro = annulation. Les résultats tardifs sont ignorés.
- Le brouillon ne passe pas d’un profil à l’autre. Changement de profil, sortie de la page ou arrière-plan arrêtent la capture.
- Diagnostic des services **sans demander l’autorisation du micro**, puis boutons séparés pour tester le microphone, tester la voix et tout arrêter.
- Le diagnostic distingue service présent, permission, moteur de synthèse prêt et langue française. Une liste de voix non chargée n’est pas présentée comme une vérification positive.
- Erreurs explicites : permission refusée, service absent, silence, paroles non reconnues, microphone occupé, problème réseau, langue absente, délai dépassé, ancien plugin Android incompatible.
- Clavier utilisable après une erreur. Aucun réglage de volume/mode silencieux du téléphone n’est contourné.
- Diagnostic mobile dépliable sans masquage par la hauteur fixe de l’ancien panneau de conversation.

### Coordination audio

Un seul contrôleur coordonne dictée, lecture et annonces de séance :

1. La dictée coupe une lecture en cours.
2. Une réponse ordinaire ne parle pas pendant l’écoute ou sur une annonce du chrono.
3. Une annonce prioritaire peut interrompre la réponse ou l’écoute.
4. Un chrono actif bloque le lancement du micro et des tests vocaux ; sa pause les rend disponibles.
5. Les règles de décompte et leur dédoublonnage existants sont conservés.
6. Choisir une suggestion de message arrête également le micro ; aucune transcription tardive ne vient ensuite remplir le champ.

Il ne s’agit pas d’un mode d’écoute continue ni d’un assistant conversationnel général.

### Android : protocole vocal 2

Source : `JARVIS-Fitness-Source/android/app/src/main/java/app/jarvis/fitness/JarvisSpeechPlugin.java`.

Ce fichier natif est réutilisable **sans reconstruire le web à partir des anciennes sources**. Les méthodes et l’annotation restent sur le même nom `JarvisSpeech` et la même classe native.

- `SpeechRecognizer` piloté dans l’application remplace l’activité externe de dictée : arrêt effectif, destruction et gestion des erreurs.
- Toutes les opérations sont sérialisées sur le thread principal Android.
- `diagnostics`, `listen`, `cancelListen`, `speak`, `stopSpeech` ; événements `speechState` corrélés au `requestId`.
- Une seule écoute à la fois ; annuler pendant une demande de permission empêche le résultat tardif d’ouvrir ensuite le micro.
- Vérification de l’initialisation TTS et de la disponibilité du français ; échec propagé plutôt que masqué.
- La promesse `speak` se termine à la fin réelle signalée par le moteur, ou avec une erreur/annulation/délai maximal, pas dès la simple mise en file d’attente.
- Délais bornés : 20 secondes pour la reconnaissance, permission incluse ; 60 secondes pour la lecture. Pas de promesse infinie.
- Arrêt des ressources sur `handleOnStop`, destruction sur `handleOnDestroy`. Le simple affichage de la demande de permission n’est pas traité comme une annulation automatique via `onPause`.
- `EXTRA_PREFER_OFFLINE` reste une **préférence**, jamais une garantie : le service installé et ses langues déterminent l’usage éventuel du réseau.

Les permissions `RECORD_AUDIO`, les requêtes de visibilité `RecognitionService` / `TTS_SERVICE` et l’activité native ont été vérifiées dans les manifestes binaires de l’APK de référence et de la 1.0.6, pas uniquement dans le XML historique.

**Protection de compatibilité :** le web exige `protocolVersion: 2` avant tout nouvel appel vocal Android. Une simple substitution du JS dans l’ancien APK afficherait « mise à jour APK nécessaire », et non de faux contrôles d’arrêt. Ne pas distribuer cette substitution comme une étape 2 terminée.

## Conservation de l’application complète

`build.mjs` enchaîne le correctif 1.0.6 puis [l’étape 1](../reminders/README.md), tous deux épinglés à l’APK complet fourni, puis modifie uniquement :

- `Ut` : sortie vocale centralisée et erreurs visibles ;
- `T5` : compositeur et diagnostics, retrait de l’ancien gestionnaire de dictée, arrêt lors d’une suggestion ;
- `I3` : observateur de profil/chrono/voix ;
- `b5` et `_5` : annonces dirigées vers la sortie prioritaire, règles de chrono/séance inchangées.

Le moteur local, les messages/actions, les formulaires, les profils et toutes les autres fonctions sont conservés. Les sept correctifs historiques du chrono sont toujours présents. **272 fichiers web conservés, dont 271 strictement inchangés ; seul le bundle principal est étendu.** Aucun JSON personnel de test n’est copié dans les assets.

Bundle web testé : `c07ad6d6538a1c06f1839bc9ded30e71d7f27a8f18afc69388e53d0284bcb25e`.

## Vérifications réalisées

- **21 tests JS** : 16 contrôleur/bridge simulé + 5 intégration/conservation/hash/protocole.
- **39 tests navigateur**, tous réussis sur le build final : 8 nouveaux parcours vocaux, 4 comparaisons des 11 écrans et de tous leurs onglets (les deux profils à 390 et 1440 px), 10 régressions des rappels et 17 régressions historiques (chrono, guidage, 1RM, import, thèmes).
- **14 scénarios natifs sur JVM avec doubles explicites des services Android/Capacitor** : permissions, annulation avant autorisation, callbacks tardifs, silence/erreurs, ressources, arrière-plan, TTS terminé/annulé/échoué, absence du français, délais et exclusion écoute/lecture.
- **Compilation séparée du plugin de production contre Android API 34 et les signatures de classes du véritable APK complet**, sans doubles pour cette compilation. Deux avertissements d’imports inutilisés proviennent des annotations Capacitor, aucun échec de compilation.
- Les 27 tests moteur/intégration de l’étape 1 ont aussi été relancés avec succès.

Les tests vocaux navigateur utilisent une reconnaissance et une synthèse **simulées**. Les tests JVM ne sont ni un émulateur ni un téléphone. Aucun résultat ne prouve encore le fonctionnement acoustique, les permissions réelles ou le comportement hors ligne d’un appareil donné.

## Reproduire le web

Depuis la racine, avec les dépendances et l’APK de référence décrits dans la documentation de l’étape 1 :

```sh
npm ci --prefix JARVIS-Fitness-Source
node evolution/voice/build.mjs
node --test evolution/voice/tests/*.test.mjs
```

Servir uniquement `.cache/voice-web` sur 5175 et `.cache/reminders-web` sur 5176, puis :

```sh
JARVIS-Fitness-Source/node_modules/.bin/playwright test --config evolution/voice/playwright.config.mjs
```

Variables : `COMPLETE_URL`, `STEP1_URL`, `CHROMIUM_EXECUTABLE_PATH`. Chromium du sandbox demande aussi son `LD_LIBRARY_PATH`. L’aperçu reste séparé du stockage de l’application installée.

## Reproduire la compilation native et les tests de cycle de vie

Le SDK/Gradle standard n’est pas accessible via les hôtes de téléchargement dans ce sandbox. Une **vérification de compilation**, sans reconstruire l’APK, est donc effectuée avec les outils suivants, hors Git :

```sh
mkdir -p .cache/voice-native
python3 -m pip install --target .cache/java-tools jdk4py==17.0.9.2
# API Android 34 et compilateur Eclipse, sources de téléchargement épinglées :
gh api 'repos/Sable/android-platforms/contents/android-34/android.jar?ref=b439048ed3def8f48fa5801bb4bf4729b112f7ac' \
  -H 'Accept: application/vnd.github.raw+json' > .cache/voice-native/android.jar
gh api 'repos/processing/processing4/contents/java/mode/org.eclipse.jdt.core.jar?ref=c14695476ed904fba445668c05384b0c5ad9bc24' \
  -H 'Accept: application/vnd.github.raw+json' > .cache/voice-native/ecj.jar
gh api 'repos/google/enjarify/tarball/f2db0563aa83885ce6e6acd5b7dc9a8a1a1e1987' > .cache/voice-native/enjarify.tar.gz
tar xf .cache/voice-native/enjarify.tar.gz -C .cache/voice-native
# Classes converties uniquement pour leurs signatures de compilation, PAS pour les redistribuer :
PYTHONPATH=$(echo .cache/voice-native/google-enjarify-*) python3 -m enjarify.main \
  .cache/reference/base.apk -o .cache/voice-native/reference-classes.jar
node evolution/voice/compile-native.mjs
python3 evolution/voice/tests/native-lifecycle.py
```

`compile-native.mjs` vérifie les empreintes de l’APK, de l’API et du compilateur. Les annotations originales Capacitor du package verrouillé sont compilées également, car la conversion DEX→JAR ne conserve pas toute leur métadonnée. **Ces classes d’annotations et le JAR converti ne doivent pas être embarqués dans l’APK.** La conversion de vérification a traduit 4 953 classes sans erreur.

Sorties : `.cache/voice-native/compile-report.json`, `.cache/voice-build-report.json` et classes temporaires. Aucun fichier signé produit ; pas de clé privée générée ou publiée.

## Ce qu’il reste avant validation de l’étape 2 sur Android

1. Intégrer le nouveau plugin aux DEX de l’APK **complet**, avec désucrage des lambdas et contrôle des classes/ressources ; ne pas utiliser le build web historique comme raccourci.
2. Résoudre la continuité de signature et sa sauvegarde privée durable avant diffusion.
3. Tester sur un téléphone : première demande/refus/refus permanent/réautorisation du micro, service absent, silence, erreur réseau, français absent, mode avion avec et sans langue téléchargée, son réel/TTS, annulation répétée, changements de profil, pause/reprise et annonces chrono, arrière-plan/écran verrouillé. Vérifier qu’aucun message n’est envoyé sans action explicite.

**Étape suivante après validation : étape 3, JARVIS porte-parole de l’équipe** (accueil court facultatif, priorités attribuées, préférences vocales). L’IA conversationnelle générale reste pour la fin et n’a pas été ajoutée.
