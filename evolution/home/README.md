# Accueil JARVIS validé — intégré à la livraison complète 1.4.0

## Mise à jour — livraison Android disponible

Après autorisation explicite d’une nouvelle installation séparée (« Oui, on y va », puis « Poursuis »), **l’APK 1.4.0 est signé et vérifié**, avec cet accueil et les sept étapes. [Téléchargement/import](../../downloads/INSTALLATION-1.4.0.md) · [Recette et contrôles](../android/HOME-RELEASE.md). 90 tests navigateur ont été rejoués avec succès sur le web extrait du nouvel APK signé. La 1.3.0 reste inchangée ; aucun test physique n’est revendiqué. La nouvelle signature est documentée dans `evolution/signing/HOME-IDENTITY.md` et ne doit pas être régénérée.

**Les sections ci-dessous décrivent l’intégration web initiale et le blocage historique, désormais levé par cette nouvelle autorisation — pas par récupération de l’ancienne clé.**

## Autorisation et état

Le 21 septembre 2026, après les maquettes claire/sombre et le GIF du commit `be03bad2e0c365795de8668f918900ce6f0877f6`, l’utilisateur a répondu **« Parfait je valide »**. La refonte de l’accueil est donc autorisée. Cela ne vaut ni accord pour l’IA conversationnelle, ni autorisation de recréer l’identité Android.

**Intégration fonctionnelle réalisée et vérifiée dans le web de l’application complète 1.3.0**, pas dans la vieille application React seule. L’APK publié reste inchangé. Aucun nouveau fichier APK, aucune nouvelle clé, aucune nouvelle identité et aucune nouvelle version Android n’ont été produits.

La livraison d’une mise à jour Android reste bloquée par l’absence locale de la clé privée de signature actuelle. Voir [la passation](../../PASSATION.md#4-signature--point-de-vigilance-pour-un-futur-apk). Ne pas demander à nouveau à l’utilisateur de chercher une archive qu’il a indiqué ne pas retrouver ; ne pas demander de secret dans le chat.

## Intégration

- **Orbe bleu/cyan animé** indépendant du profil et du thème. Pause manuelle ; mouvements réduits du système **et** réglage existant du profil ; suspension en arrière-plan, pendant une fenêtre de l’application ou un chrono actif. Aucun état micro/IA en ligne inventé.
- **Accueil clair et sombre coloré** : lavande/violet pour le point de l’équipe, menthe/vert profond pour les rappels, actions orange ou rose selon le profil. Styles limités à l’accueil ; aucun thème global d’une autre rubrique remplacé.
- **Carte séance originale déplacée en premier**, pas réécrite : même photographie, données, libellés, logique et callbacks (musculation, cardio/piscine, reprise). Aucune valeur de maquette n’est importée dans l’application.
- **Profils réels** : les pastilles sont des boutons radio accessibles reliés au `switchProfile` existant. Les données, préférences et brouillons restent dans le magasin d’origine.
- **Activité en cours prioritaire** : bandeau avant le décor pour revenir à la séance ou ouvrir le chrono original. Les alertes stockage, fenêtres et observateurs globaux restent inchangés.
- Ordre : carte séance, point de l’équipe, rappels, accès programme ; les rendez-vous, adaptations/décisions, notifications Android, indicateurs, calendrier, suivi, équipe et autres blocs complets restent plus bas. Les cartes fonctionnelles peuvent être plus longues que dans la maquette : leurs contrôles, explications et données réelles ne sont pas supprimés pour tenir dans une capture.
- Navigation mobile de l’accueil : Accueil, Entraînement, Progression, JARVIS, Plus. **Plus ouvre la navigation complète d’origine** ; les 11 rubriques restent accessibles. La navigation des autres écrans ne change pas.
- La véritable barre de l’application est conservée. Pas de fausse heure, batterie, encoche ou coque de téléphone issue des maquettes.

## Conservation vérifiable

`baseline.json` épingle l’APK livré (SHA-256 `4c2efeaea0d1d59e9bc329f4b3651e2a860a1416bad900c23a15e0249622a323`) et son bundle. `build.mjs` refuse une autre entrée ou une entrée déjà modifiée.

Sur le bundle complet, seules deux déclarations existantes changent :

1. `t2` : composition de l’accueil, déplacement de la carte entière et transmission des composants existants au nouveau conteneur `JarvisHome.Layout`.
2. `I3` : ordre des raccourcis mobiles **sur l’accueil seulement**. Le bouton Plus et les protections/observateurs du composant sont conservés.

Deux déclarations sont ajoutées : le module de présentation `JarvisHomeModule` et son instance `JarvisHome`. Les moteurs de suivi, voix, porte-parole, rendez-vous, adaptations, décisions et notifications, les chronos, le stockage, les formulaires et les autres écrans restent **identiques octet pour octet**.

Inventaire web : **272 fichiers conservés, 271 inchangés**. Seul `assets/index-CBCies4k.js` change ; styles/JSX nouveaux y sont intégrés. L’image d’origine reste à son chemin existant. Aucun fichier de données personnelles ajouté, aucune migration, aucune nouvelle API ou permission.

## Validation du candidat

Voir [`validation.json`](validation.json) pour les empreintes et les limites.

- **4 tests Node d’intégrité réussis** : déclarations, littéraux et carte originale, inventaire, reproductibilité et refus des entrées incorrectes.
- **90 tests navigateur réussis dans un passage complet**, aucun échec ni test ignoré (environ 9 min 20 s).
- Dont **8 tests propres à l’accueil** : deux profils × deux thèmes, géométrie aux largeurs 320/360/390/768/1024/1440, rotation/pause, changements de profil, thème conservé après rechargement, préférence système de mouvement réduit, priorité du chrono et comparaison des 11 rubriques/onglets des deux profils à la 1.3.0 (comparaison exhaustive à 1440 px).
- Les autres tests couvrent import/export, 1RM, guidage, voix, brouillons, bilans, confirmations, adaptations, décisions, rappels et simulations navigateur du pont Android, ainsi que les régressions des chronos.
- Inspection visuelle des captures mobiles. Un débordement à 320 px (anneau transformé et ancien libellé d’indicateur) a été corrigé avant le passage complet.

**Limites :** tests du candidat web, pas d’un APK contenant la refonte. Pas de nouvelle compilation/validation native ou de téléphone réel. Les services Android sont simulés dans les tests navigateur ; réception sur téléphone, son réel, Doze/OEM et redémarrage ne sont pas nouvellement validés.

## Reproduire le candidat et les tests

Les dépendances de `JARVIS-Fitness-Source` servent uniquement d’outils. Depuis la racine :

```sh
npm ci --prefix JARVIS-Fitness-Source
node evolution/home/build.mjs
python3 -m http.server 5183 --bind 0.0.0.0 --directory .cache/home-web
```

Le navigateur reçoit la vraie application web et ses données locales à cette origine. **Ne pas importer de sauvegarde sensible dans un aperçu partagé.** Ces données de navigateur ne sont pas celles du téléphone. Ne servir ni la racine du dépôt, ni les fichiers privés.

Pour la comparaison, extraire `assets/public/` de l’APK livré dans `.cache/home-reference/` (sans le préfixe) et servir ce dossier sur 5184. Les fichiers générés restent hors Git sous `.cache/` ; le build refuse une destination en dehors de ce dossier.

```sh
node --test evolution/home/tests/integration.test.mjs
LD_LIBRARY_PATH=$PWD/.cache/browser-libs/lib \
CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
  JARVIS-Fitness-Source/node_modules/.bin/playwright test \
  --config evolution/home/playwright.config.mjs
```

`COMPLETE_URL` remplace le candidat par défaut sur 5183 ; `HOME_REFERENCE_URL` remplace la référence sur 5184. Les dépendances et Chromium doivent être présents. La configuration réutilise les tests existants, mais remplace les anciennes comparaisons de mise en page d’accueil des étapes 1–7 par les contrôles dédiés à la refonte autorisée ; elle n’exclut pas leurs tests fonctionnels.

## Prochaine étape — livraison Android, bloquée

- Restaurer **la signature existante**, vérifier le certificat attendu et conserver `app.yanis.fitness.evolution`. Pas de régénération implicite.
- Préparer une recette de mise à jour signée incluant **ce candidat web vérifié**, avec versionCode augmenté et contrôle d’inventaire/resources/DEX. **La recette `evolution/android/build.py --new-parallel` et `release-next.json` restent celles de la 1.3.0 ; elles ne livrent pas encore cette refonte.** Le nouveau builder web part de l’APK livré, pas de l’ancien bundle `V 1.0.6` attendu par cette recette historique.
- Recontrôler l’APK effectivement signé et le tester sur appareil, puis donner son lien direct. Ne pas remplacer le lien 1.3.0 par un téléchargement identique annoncé comme nouveau.
- L’IA conversationnelle reste en pause. Aucune nouvelle identité autorisée par la validation graphique.
