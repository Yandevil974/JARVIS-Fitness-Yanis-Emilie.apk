# JARVIS Fitness Corrigé 1.0.5

Correction du chrono terminé impossible à fermer et de la page blanche lors de la validation de l’échauffement.

## Important : ne désinstallez pas l’ancienne application

La clé de signature de l’ancien APK n’était pas fournie. La version corrigée s’installe **à côté** sous le nom **JARVIS Fitness Corrigé**, afin de conserver l’ancienne application et toutes ses données.

1. Dans l’ancienne application : Profil → Données & sauvegardes → Exporter la sauvegarde JSON. Si nécessaire, fermer puis rouvrir l’appli sans valider le chrono bloqué.
2. Installer `JARVIS-Fitness-1.0.5-corrige.apk` (Android 8.0 ou plus récent). Android peut demander d’autoriser l’installation depuis votre navigateur ou gestionnaire de fichiers.
3. Ouvrir **JARVIS Fitness Corrigé**.
4. Profil → Données & sauvegardes → Choisir une sauvegarde → sélectionner le JSON → Sauvegarder puis importer.
5. Vérifier les profils Yanis et Émilie. Si le chrono terminé revient après import, ouvrez-le et validez : il se ferme maintenant sans erreur.

Votre fichier de sauvegarde du 19 septembre a également été testé. Préférez un export plus récent si vous avez saisi d’autres séances depuis.

L’APK ne contient pas de sauvegarde personnelle intégrée.

## Vérifications

83 tests unitaires réussis et 28 tests navigateur réussis (dont 11 nouveaux tests chrono). Test complémentaire avec la véritable sauvegarde fournie sur la version compilée : validation sans écran blanc, données des deux profils conservées après rechargement.

Signature Android v2/v3 et alignement des ressources vérifiés. Pas d’essai sur un téléphone Android physique dans cet environnement.

Fichier généré localement, sans dépendre du quota de stockage GitHub Actions.
