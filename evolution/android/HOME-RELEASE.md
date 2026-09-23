# Livraison Android 1.4.0 — complète, accueil validé inclus

**21 septembre 2026. Nouvelle installation séparée explicitement autorisée et signée.**

[APK](../../downloads/Yanis-Fitness-Evolution-1.4.0.apk?raw=true) · [Installation/import](../../downloads/INSTALLATION-1.4.0.md) · [Signature/récupération](../signing/HOME-IDENTITY.md) · [Rapport d’inventaire](../../downloads/Yanis-Fitness-Evolution-1.4.0.fidelity.json)

## Pas de reconstruction d’une ancienne base

`build-home.py` part de **l’APK complet 1.3.0 livré**, vérifie son empreinte et reproduit l’accueil autorisé via `evolution/home/build.mjs`. Son SHA de candidat correspond à celui validé lors de l’intégration. Il met uniquement l’étiquette visible de version à 1.4.0, réécrit les identifiants d’installation et le numéro de version, aligne et signe avec la nouvelle identité autorisée.

Quatre entrées changent : manifeste, table de ressources (nom interne du package uniquement), configuration Capacitor et bundle web. **Tous les neuf DEX restent identiques octet pour octet** : voix, diagnostics, rappels natifs, récepteurs et protections ne sont pas recompilés ou remplacés. Aucune ancienne installation n’est modifiée.

Le nom affiché reste exactement **Yanis Fitness Evolution**. Package `app.yanis.fitness.evolution.home`, version 1.4.0 / code 11. Les autorités de fournisseurs et la permission interne utilisent le nouveau package ; les noms de classes Java existants sont conservés. Android minimum 26, cible 34, debug désactivé, sauvegarde système désactivée. Pas de nouvelle permission ni de réseau IA.

## Vérification de la livraison

- SHA-256 APK : `30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7` ; 24 905 185 octets.
- Web embarqué : `f80a7e82cbe8d45b7c959541ce384c54f3694582eef14515467dbfef204f9f26`.
- Candidat d’accueil avant changement d’étiquette : `0586fc9c2402f6580eb20c6fd5ee49c735cd6cd257b08bf613bca1dda65ecb94`.
- 272 fichiers web, 271 inchangés ; photographie d’origine et autres ressources conservées.
- Trois builds signés identiques. Signature v2/v3 vérifiée avec le certificat attendu, alignement 4 octets / bibliothèques natives 16 Kio selon le type de fichier.
- **90 tests navigateur réussis, un seul passage complet** (~8,5 minutes), sur le web extrait du candidat signé ; l’APK livré a ensuite été comparé octet pour octet à ce candidat.
- **150 tests de logique, 4 tests d’intégrité web, 8 tests APK/signature/récupération réussis.** Les simulations navigateur de notifications restent des simulations, pas un test Android physique.
- Vérification des attributs de manifeste, identifiants de ressources, inventaire, neuf DEX inchangés, versions, confidentialité des fichiers privés, restauration du certificat et refus de régénération.
- Pas de téléphone/emulateur testé. L’installation réelle, le micro/son, les notifications/Doze/OEM/redémarrage restent à confirmer. **L’IA conversationnelle générale n’est pas incluse.**

## Reproduire sans créer une autre identité

Installer les dépendances d’outils hors Git : `npm ci --prefix JARVIS-Fitness-Source`, `cryptography==46.0.3` et `jdk4py==17.0.9.2` sous `.cache/signing-tools`. Restaurer la signature existante si nécessaire ; **ne pas relancer l’initialisation**.

```sh
python3 evolution/android/prepare-home-tools.py
PYTHONPATH=.cache/signing-tools python3 evolution/android/build-home.py
HOME_APK=$PWD/downloads/Yanis-Fitness-Evolution-1.4.0.apk \
PYTHONPATH=.cache/signing-tools python3 -m unittest discover \
  -s evolution/android/tests -p test_home_release.py -v
```

`prepare-home-tools.py` épingle les sources de l’outil Android apksigner (LineageOS/AOSP) et ECJ. Compilation Java 8 avec UTF-8 explicite ; seule l’initialisation du fournisseur facultatif Conscrypt est rendue réflexive, pas les implémentations cryptographiques. Le signer produit est épinglé dans `release-home.json` (SHA `ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc`). L’ancienne recette `build.py --new-parallel` reste celle de la 1.3.0 et n’est pas utilisée pour cette livraison.

Pour les tests navigateur : extraire `assets/public/` du **nouvel APK signé** sous `.cache/home-signed-web`, servir uniquement ce dossier sur 5183, et la 1.3.0 sous `.cache/home-reference` sur 5184. Exécuter la configuration `evolution/home/playwright.config.mjs` avec Chromium et ses bibliothèques. Les sorties de test restent hors Git.

**Prochaine étape : l’utilisateur installe la 1.4.0, importe sa sauvegarde JSON et vérifie Yanis/Émilie sans supprimer l’ancienne application. Confirmer aussi la sauvegarde privée de signature en deux endroits. L’IA vient ensuite.**

## Publication vérifiée

APK publié au commit `653b95bcef9636527a14bef7fbc2b25331284613`, téléchargé à nouveau via GitHub et comparé octet pour octet au candidat testé. [Lien direct](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/653b95bcef9636527a14bef7fbc2b25331284613/downloads/Yanis-Fitness-Evolution-1.4.0.apk). La [release de test](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.4.0-evolution) référence ce fichier Git ; elle n’a pas d’asset attaché après un échec réseau EOF de l’upload. Le téléchargement direct fonctionne indépendamment des assets de release.
