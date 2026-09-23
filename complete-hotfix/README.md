# Correctif complet 1.0.6 — conserver l’APK de référence, pas reconstruire une version ancienne

## Origine du décalage de fonctionnalités

L’archive `JARVIS-Fitness-Sources.zip` date du 6 septembre. Le fichier **`JARVIS-Fitness.apk`**, ajouté au dépôt au commit `84e2986da2f004d4eae81e52a9a41e7b69e80f8d`, contient un bundle web du 9 septembre, plus complet. Les deux APK d’origine portent pourtant le même numéro interne 1.0.4 : comparer uniquement ce numéro aurait été insuffisant.

Cette procédure utilise le SHA-256 du **bon fichier**, enregistré dans `manifest.json`. Elle refuse un autre APK ou un fichier déjà corrigé. Elle n’importe jamais le build React de `JARVIS-Fitness-Source` dans la version complète.

## Conservation exhaustive

Le script de livraison compare chaque entrée de l’APK signé à celle de l’APK fourni. Il échoue s’il y a un fichier ajouté, un fichier supprimé ou une modification hors liste autorisée.

Les seules entrées différentes sont :

| Entrée | Modification autorisée |
|---|---|
| `assets/public/assets/index-CBCies4k.js` | Sept remplacements précis : garde du workout, horloge au premier plan, transition unique, protection d’erreur racine, étiquette 1.0.6. |
| `AndroidManifest.xml` | Identifiant d’installation parallèle, autorités associées, version 1.0.6/code 7, mode debug désactivé. Les classes Java et permissions fonctionnelles sont conservées. |
| `assets/capacitor.config.json` | Nom et identifiant de l’application uniquement. |
| `resources.arsc` | Nom d’affichage et package uniquement, sans changer les identifiants des ressources ni leurs données internes. |

**Tous les autres fichiers sont identiques octet par octet**, dont les 9 DEX natifs et les 271 autres fichiers web. Aucune image, animation, police, feuille de style ou fonctionnalité entière n’est remplacée par un équivalent plus ancien. Tous les chemins des ressources Android sont également conservés.

Dans le bundle JavaScript : **540/545 déclarations principales sont identiques**. Le test AST vérifie que seuls `El` (horloge), `b5` (observateur), `v5` (fenêtre chrono), `_3` (étiquette de version) et l’appel de montage racine changent. Tous les textes existants, sauf l’étiquette de version, sont préservés. Le patch est réversible : en inversant les sept remplacements, on retrouve exactement le bundle fourni.

Le rapport `downloads/JARVIS-Fitness-1.0.6-complet.fidelity.json` contient les empreintes de tous les fichiers web et DEX, et la liste des quatre fichiers modifiés.

## Validation effectuée

- **5 tests JavaScript** : checksum de référence, refus d’un bundle différent, réversibilité, contrôle AST, conservation des libellés et comparaison de tous les fichiers web.
- **5 tests Python** : conservation des chaînes et de leurs indices, UTF-8 / UTF-16 / Unicode / longueurs longues, modification ciblée des attributs du manifeste, identifiants et offsets de ressources inchangés.
- **21 tests navigateur réussis, aucun ignoré** sur les assets strictement identiques à ceux de l’APK signé.
  - Comparaison des **11 écrans principaux** et de chaque onglet à l’APK fourni, pour **Yanis et Émilie**, à **390 px et 1440 px**.
  - 28 onglets pour Yanis, 27 pour Émilie, vérifiés dans les deux largeurs.
  - Saisie de cinq bases 1RM, génération des charges suggérées, conservation après rechargement.
  - Thème sombre/clair, réglage de guidage vocal, présence du panneau montre/ceinture.
  - Annonces de décompte uniques, image d’échauffement réelle et agrandissement, validation des étirements sans valider un échauffement à tort.
  - Les 11 régressions de chronomètre : repos, séance combinée, pause/reprise, rattrapage, échauffement autonome / séance supprimée / correspondante / différente, persistance.
  - Import réel du JSON fourni : séances, activités, mesures, photos, bilans de force et plans identiques pour les deux profils après fermeture du chrono.
- Signature **v2/v3** vérifiée par `apksigner`, alignement des ressources contrôlé et décodage indépendant du résultat avec Apktool 2.9.3.

**Limites :** pas d’installation sur un Android physique, ni de connexion réelle à une montre / ceinture dans cet environnement. Les appels vocaux sont testés en navigateur avec synthèse simulée ; le code de synthèse native est inchangé. Le panneau Bluetooth d’origine conserve ses avertissements sur l’indisponibilité du Bluetooth web dans une WebView Android. Il n’est pas présenté comme une nouvelle connexion native ajoutée.

## Reproduire la livraison

Les dépendances de test Node sont celles du dossier historique (utilisées comme outils, pas comme sources de l’application complète).

```sh
npm ci --prefix JARVIS-Fitness-Source
mkdir -p .cache
# Récupération exacte du fichier ajouté par l’utilisateur :
gh api 'repos/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/contents/JARVIS-Fitness.apk?ref=84e2986da2f004d4eae81e52a9a41e7b69e80f8d' \
  -H 'Accept: application/vnd.github.raw+json' > .cache/JARVIS-Fitness-reference.apk

python3 complete-hotfix/rebuild-complete.py \
  --base .cache/JARVIS-Fitness-reference.apk \
  --java /chemin/java \
  --apksigner /chemin/apksigner.jar \
  --keystore /chemin/prive/jarvis-complete.p12 \
  --password-file /chemin/prive/mot-de-passe \
  --output .cache/JARVIS-Fitness-1.0.6-complet.apk
```

Le SDK Android, Gradle et GitHub Actions ne sont pas nécessaires à cette procédure. Les APK sont de simples conteneurs ZIP ; `apk_binary.py` ne réécrit que les chaînes autorisées dans les pools et les deux attributs numériques du manifeste. Cela évite une recompilation AAPT qui aurait renommé des variantes de ressources sans nécessité.

La signature est ensuite refaite avec une clé privée hors Git. **Les prochaines versions de `app.jarvis.fitness.complete` devront réutiliser cette même clé.** Préserver une sauvegarde privée de la clé et de son mot de passe ; ne jamais les publier dans le dépôt ou l’APK.

## Exécuter les tests

Extraire les assets de l’APK de référence dans `.cache/apk-analysis/new/assets/public`, et ceux de l’APK signé dans `.cache/complete-web`. Servir uniquement ces sous-dossiers statiques : référence sur 5176, correctif sur 5175. Ne pas servir la racine du dépôt ou les sauvegardes privées.

```sh
node --test complete-hotfix/tests/patch-integrity.test.mjs
COMPLETE_BASE_APK=.cache/JARVIS-Fitness-reference.apk \
  python3 -m unittest discover -s complete-hotfix/tests -p 'test_*.py' -v
JARVIS-Fitness-Source/node_modules/.bin/playwright test \
  --config complete-hotfix/playwright.config.mjs
```

`COMPLETE_BASE_WEB`, `COMPLETE_PATCHED_WEB`, `COMPLETE_URL`, `COMPLETE_REFERENCE_URL` et `CHROMIUM_EXECUTABLE_PATH` permettent d’adapter les chemins et le navigateur.

## Installation / données

Nom **JARVIS Fitness Complet**, package **app.jarvis.fitness.complete**, Android minimal **8.0 / API 26**. Cette version s’installe à côté des versions précédentes. Les clés des versions précédemment installées ne sont pas disponibles pour la livraison actuelle ; ne pas tenter de les remplacer en désinstallant sans sauvegarde.

Exporter le JSON depuis l’application contenant les données les plus récentes, puis l’importer dans **Profil → Données & sauvegardes**. Rien n’est transféré automatiquement entre applications. Les fichiers personnels déjà présents dans le dépôt n’ont pas été modifiés ni embarqués dans l’APK.
