# APK complet 1.1.0 — nouvelle identité autorisée, étapes 1 à 3 intégrées

**APK construit et signé ; validation sur téléphone encore nécessaire.** Il ne s’agit plus d’un simple aperçu web ni d’une compilation Java sans DEX. L’utilisateur a autorisé une installation parallèle avec une nouvelle signature après [la recherche infructueuse de l’ancienne clé](../signing/RECOVERY.md).

[APK](../../downloads/JARVIS-Fitness-1.1.0-evolution.apk?raw=true) · [Installation sans suppression de l’ancienne application](../../downloads/INSTALLATION-1.1.0.md) · [Rapport de conservation](../../downloads/JARVIS-Fitness-1.1.0-evolution.fidelity.json)

## Livraison

| Champ | Valeur |
|---|---|
| Nom | JARVIS Fitness Évolution |
| Package | `app.jarvis.fitness.evolution` |
| Version / code | 1.1.0 / 8 |
| Android | min 26, cible 34, debug désactivé |
| APK SHA-256 | `8ccf8cd0d8029a468882d078fa873c166716b142f9fd63fa3d38c41091517040` |
| Certificat SHA-256 | `0849b90901a80eecbd587bd41d5acfbfb120096889bb979dfa37564a8de23225` |
| Schémas de signature | v2 et v3 vérifiés |
| Essai Android réel | **Non réalisé** |

L’ancienne 1.0.6 et son fichier APK restent inchangés. Les données ne passent pas automatiquement entre les applications : export/import JSON depuis la version réellement utilisée, puis contrôle des deux profils. Ne pas désinstaller pour tenter de résoudre une incompatibilité de signature.

## Chaîne de construction

1. Base complète épinglée au commit `84e2986da2f004d4eae81e52a9a41e7b69e80f8d` et au SHA-256 historique. Refus de toute autre base.
2. Extension cumulative `evolution/spokesperson/build.mjs` : correctifs historiques + rappels + coordination vocale + porte-parole. Le bundle testé `d581bf…000e6` est conservé exactement, sauf l’étiquette visible `V 1.0.6` devenue `V 1.1.0`.
3. Plugin de production compilé par ECJ contre API 34 et les signatures du véritable hôte. Seuls ses trois fichiers `.class` entrent dans D8, **pas les annotations Capacitor recompilées ni le JAR de conversion de l’hôte**.
4. D8 1.5.13-q1 épinglé, API minimale 26 : désucrage des lambdas en classes synthétiques. Aucun appel LambdaMetafactory/invoke-custom résiduel dans le nouveau plugin.
5. Désassemblage du seul `classes9.dex`. Remplacement des quatre classes de l’ancienne famille `JarvisSpeechPlugin` par les dix-neuf classes de la nouvelle famille. `MainActivity` et `JarvisBackupPlugin` restent identiques au niveau smali, instructions, annotations et debug compris.
6. Assemblage via les bibliothèques smali/baksmali d’Apktool 2.3.4 ; nouveau désassemblage et comparaison exacte. Ordre des chemins trié et assemblage mono-processeur pour supprimer les variations d’ordre des structures DEX. Le DEX réassemblé utilise le format 035, compatible API 26 ; les huit autres DEX 038 ne changent pas.
7. Modification ciblée des pools de chaînes, package, autorités associées, version et debug. Aucun rebuild AAPT ni renommage des ressources.
8. Alignement, signature **depuis une copie restaurée de l’archive privée**, vérification v2/v3 et certificat attendu, contrôle des inventaires/classes/ressources. Le fichier n’est copié vers la destination de livraison qu’après réussite des contrôles.

**Conservation :** 272 fichiers web, dont 271 byte-identiques à la base ; 9 DEX présents, dont 8 byte-identiques. Parmi les 4 953 classes originales, seules les quatre classes de l’ancienne famille vocale sont remplacées ; résultat : 4 968 classes uniques. Cinq entrées ZIP changent, aucune n’est ajoutée ni supprimée. Les 11 rubriques et leurs onglets restent testés.

## Signature privée et sauvegarde

`identity.json` ne contient que l’identité publique et l’empreinte du certificat, jamais une clé privée ni un mot de passe.

La nouvelle clé RSA 3072 est dans un keystore PKCS12 protégé, **hors dépôt, hors serveur web et hors des caches temporaires**, sous un répertoire privé de l’espace de travail. Fichiers privés en mode 600, répertoire 700. L’archive `JARVIS-signature-CONFIDENTIEL.zip` est remise séparément à l’utilisateur pour sauvegarde externe. Sa restauration a réellement servi à signer l’APK, ce qui vérifie la possibilité d’utiliser la clé privée.

**L’archive contient la clé et son mot de passe, et n’est pas elle-même chiffrée.** Elle est strictement confidentielle, ne doit jamais être publiée dans GitHub, et doit être conservée dans un stockage privé sauvegardé. Sa création locale ne prouve pas que l’utilisateur l’a téléchargée : la copie externe doit être confirmée. Les sauvegardes JSON sportives sont distinctes.

`signing.py` refuse de recréer une identité si le répertoire privé ou le fichier d’identité existe. **Ne pas relancer une génération pour faire disparaître un blocage de clé.** Pour les futures versions, restaurer la même identité et vérifier son empreinte. Les secrets GitHub n’ont pas été configurés : les autorisations actuelles ne permettent pas leur audit.

## Outils épinglés et contraintes réseau

`tools.json` enregistre dépôts, commits et SHA-256. Tous les téléchargements sont vérifiés ; aucun JAR outil n’est commité.

- D8 depuis le dépôt de prebuilts LineageOS, commit `c6dea7fb206c2736e593c885bf48c67c814a912a`.
- Bibliothèques Apktool 2.3.4 depuis le miroir `nubosoftware/nubomanagement`, commit `a7242ecc30a46125f8fe3382333d9a84643e7aa9`. Utilisées seulement pour DEX/smali, pas pour reconstruire les ressources.
- `apksigner` compilé depuis les sources LineageOS/AOSP `android_tools_apksig`, commit `6447768c0e8ab4385a47e7bb85e6bdba0085dced`.
- Seule adaptation de l’outil de signature : résolution réflexive du fournisseur **optionnel** Conscrypt, absent du JRE hôte, avec repli sur les fournisseurs JCA de Java 17. Aucune modification des algorithmes de signature/vérification. La signature connue de la 1.0.6 est vérifiée avant utilisation.
- JAR apksigner construit : `e709f014757e9bdf2997452bcfe6d49861df5d530e86bbb6b2fa04baf94f7c03`.

Les téléchargements directs Google/Maven et les assets de releases GitHub échouaient par SSL EOF. Les pointeurs Git LFS trouvés dans d’autres miroirs n’étaient pas des JAR utilisables et ont été abandonnés. Les fichiers de `tools.json` sont les seules dépendances retenues. Java/ECJ/API/Enjarify et leurs empreintes sont documentés dans [l’étape voix](../voice/README.md).

## Contrôles réalisés

- **75 tests JS** cumulatifs réussis.
- **49 tests navigateur** réussis sur les fichiers web **extraits du nouvel APK signé**, y compris conservation des rubriques, import/export, les deux profils, chronos et parcours vocaux simulés.
- **8 tests de livraison APK** réussis : signature/identité, manifeste/permissions/SDK, inventaire exact, bundle embarqué, DEX/classes uniques, aller-retour smali, ressources et absence de fichiers privés.
- **5 tests historiques de manipulation des ressources Android** réussis.
- **20 scénarios natifs simulés** réussis sur les classes Java de production, puis les **mêmes 20** réussis sur le DEX final reconverti vers la JVM par Enjarify. Conversion de 21 classes, zéro erreur. Ce second passage vérifie aussi le désucrage/assemblage, **pas l’exécution sur Android**.
- Deux constructions finales avec les mêmes entrées et la même clé donnent exactement le même SHA-256 d’APK. Un premier essai d’assemblage parallèle variait dans l’ordre des données DEX sans changement smali ; l’assemblage déterministe ci-dessus l’a corrigé.

Aucun téléphone ni émulateur utilisé. Restent à confirmer : installation réelle et import sur appareil, comportement des permissions/services vocaux, son/micro, mode avion, interruption/arrière-plan/écran verrouillé. La présence d’une API n’est pas une preuve d’acoustique ou de fonctionnement hors ligne.

## Reproduire

Depuis la racine, avec les prérequis documentés dans l’étape voix :

```sh
python3 evolution/android/prepare-tools.py
node evolution/voice/compile-native.mjs
# La clé doit déjà exister dans le stockage privé, ou être restaurée de sa sauvegarde.
# Ne PAS générer une nouvelle clé pour reproduire cette version.
python3 evolution/android/build.py
python3 -m unittest discover -s evolution/android/tests -p 'test_*.py' -v
python3 evolution/voice/tests/native-lifecycle.py
PYTHONPATH=$(echo .cache/voice-native/google-enjarify-*) python3 -m enjarify.main \
  .cache/android-release/classes9.dex -o .cache/android-release/packaged-native-host.jar
NATIVE_HOST_CLASSES="$PWD/.cache/android-release/packaged-native-host.jar" \
  python3 evolution/voice/tests/native-lifecycle.py
```

Extraire uniquement `assets/public/` depuis l’APK vers `.cache/android-web` pour le serveur de test 5175. Servir `.cache/voice-web` sur 5176 comme référence. Utiliser ensuite la configuration Playwright de l’étape 3. Ne jamais servir la racine du dépôt ou le dossier de signature.

## Suite

**Priorité immédiate : installer en parallèle, importer et vérifier sur le téléphone.** Après retour sur ces essais, reprendre **l’étape 4 — rendez-vous interactifs**. Les étapes 4 à 7 ne sont pas incluses dans cette livraison et l’IA conversationnelle générale reste à la fin.
