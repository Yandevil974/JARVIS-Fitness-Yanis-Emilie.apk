# Installer Yanis Fitness Evolution 1.4.0 — version complète avec le nouvel accueil

**Cette version contient les étapes 1 à 7 ET l’accueil validé.** Orbe JARVIS bleu animé, modes clair/sombre colorés, carte « Prochaine séance » avec la photographie d’origine et ses vraies actions. Les 11 rubriques, les deux profils, les bilans, brouillons, décisions, voix et rappels restent présents. L’IA conversationnelle générale n’est pas encore ajoutée.

## Télécharger

[Télécharger l’APK 1.4.0](Yanis-Fitness-Evolution-1.4.0.apk?raw=true) — environ 25 Mo. Ce n’est plus le fichier 1.3.0 : le nouvel accueil est bien embarqué dans cet APK.

- Nom Android : **Yanis Fitness Evolution**.
- Version : **1.4.0**, code **11**.
- Identifiant de la nouvelle installation : `app.yanis.fitness.evolution.home`.
- Android 8.0 minimum (API 26).
- SHA-256 : `30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`.

## Important : garder l’ancienne application

La nouvelle installation séparée et sa nouvelle signature ont été explicitement autorisées (« Oui, on y va », puis « Poursuis »). **La 1.4.0 s’installe à côté de la 1.3.0 et des anciennes applications**, pas par-dessus. Les applications portent le même nom affiché ; leurs données ne sont pas automatiquement communes.

1. **Dans l’ancienne application qui contient tes données récentes**, exporte une sauvegarde JSON depuis **Mon profil → Données & sauvegardes**. Garde ce fichier intact, avec une deuxième copie.
2. Télécharge l’APK 1.4.0 sur ton téléphone et ouvre-le. Si Android le demande, autorise l’installation pour l’application qui ouvre ce fichier. Ne désinstalle aucune ancienne application.
3. À la fin de l’installation, appuie sur **Ouvrir** pour entrer dans la nouvelle application. Vérifie la version **1.4.0** dans l’interface ; les deux icônes peuvent avoir le même nom.
4. Dans la nouvelle application : **Mon profil → Données & sauvegardes → Choisir une sauvegarde → Sauvegarder puis importer**. Choisis le JSON exporté à l’étape 1.
5. Vérifie séparément **Yanis et Émilie** : programme, séances, mesures, photos présentes dans la sauvegarde, bilans, historiques et brouillons. Ferme puis rouvre l’application et vérifie leur conservation. Les données absentes du JSON ne peuvent pas être inventées ou récupérées automatiquement.
6. Teste l’accueil clair/sombre, l’orbe, l’ouverture d’une séance, le chrono et les commandes vocales volontaires. Les autorisations micro et notifications appartiennent à la nouvelle installation ; elles peuvent devoir être accordées à nouveau.
7. Pour les rappels : **Accueil → Rappels Android**, autorisation Android puis activation explicite pour chaque profil souhaité. Si les anciennes applications envoient déjà des rappels, désactive leurs rappels après validation de la nouvelle pour éviter les doublons, sans supprimer leurs données.

## Sauvegarde privée de la signature — à conserver absolument

Un fichier séparé a été présenté dans le chat : **`Yanis-Fitness-Evolution-1.4-SAUVEGARDE-PRIVEE.zip`**.

- **Ce n’est pas l’APK et ce n’est pas ta sauvegarde sportive JSON.**
- Il contient les secrets nécessaires aux futures mises à jour de **cette nouvelle installation**.
- Garde deux copies privées (par exemple téléphone + cloud privé/clé USB). Ne le publie pas sur GitHub et ne colle aucun secret dans le chat.
- Une copie chiffrée est conservée dans le dépôt ; elle nécessite le secret du ZIP pour être récupérée. Elle n’est pas une récupération magique si toutes les copies privées sont perdues.
- Sa conservation externe par l’utilisateur reste à confirmer. Ne pas présenter un simple affichage du fichier comme preuve de sauvegarde durable.

## Vérifications et limites

- 90 tests navigateur réussis sur les ressources **extraites de cet APK signé** ; import/export des deux profils, fonctions complètes, voix/chronos et notifications avec pont natif simulé.
- 150 tests de logique, 4 tests d’intégrité de l’accueil, 8 contrôles APK/signature/récupération réussis.
- Signatures v2/v3 et alignement vérifiés ; trois constructions signées identiques ; 272 fichiers web conservés, 271 inchangés ; neuf DEX Android strictement identiques à la 1.3.0.
- **Pas de test sur téléphone physique ici.** L’installation, la réception réelle des rappels (écran verrouillé, économie d’énergie), le micro et le son devront être confirmés sur ton téléphone. Android peut retarder les rappels ; après un arrêt forcé, rouvrir l’application.

**Prochaine étape : installation, import et retour de test sur ton téléphone. L’IA conversationnelle vient ensuite.**
