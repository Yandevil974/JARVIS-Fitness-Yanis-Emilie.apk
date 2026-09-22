# JARVIS Fitness Complet — version 1.0.6

Cette version conserve les fonctions et les écrans de **JARVIS-Fitness.apk** que vous avez ajouté, avec le correctif du chronomètre et de la page blanche. Elle remplace la livraison 1.0.5 comme version recommandée.

## Ne désinstallez aucune ancienne version pour le moment

L’application s’installe séparément sous le nom **JARVIS Fitness Complet**. Les données des applications précédentes ne sont pas transférées automatiquement.

1. Ouvrir l’application qui contient vos données **les plus récentes** (l’originale ou la première version corrigée, selon celle que vous avez utilisée).
2. **Profil → Données & sauvegardes → Exporter la sauvegarde JSON**. Si l’ancienne application affiche une page blanche, la fermer puis la rouvrir sans valider le chrono bloqué.
3. Installer `JARVIS-Fitness-1.0.6-complet.apk`. Android peut demander l’autorisation d’installer depuis votre navigateur / gestionnaire de fichiers.
4. Ouvrir **JARVIS Fitness Complet**.
5. **Profil → Données & sauvegardes → Choisir une sauvegarde → Sauvegarder puis importer**.
6. Vérifier les profils Yanis et Émilie. Si le chrono terminé revient avec la sauvegarde, ouvrez-le et validez : il se ferme maintenant sans page blanche.

**Conservez les anciennes applications et le fichier JSON jusqu’à avoir vérifié les deux profils.**

Les clés de signature des versions installées précédemment ne sont pas disponibles pour cette livraison : une installation parallèle évite toute désinstallation ou perte de données. Android minimal : 8.0.

## Ce qui a été vérifié

- Aucun fichier de l’APK complet fourni n’a été retiré ; tous les modules métier, les images et les styles sont conservés.
- Comparaison automatique des 11 rubriques, des 28 onglets Yanis et des 27 onglets Émilie, sur petit et grand écran.
- 21 tests navigateur et 10 tests de conservation du code / des ressources réussis.
- Import de votre JSON testé, sans modification des séances, activités, mesures, photos, bilans de force et programmes des deux profils.
- Signature Android v2/v3 et alignement des ressources vérifiés.

Pas d’essai sur un téléphone Android physique ni de test réel de montre/ceinture dans cet environnement. Les limites Android signalées par l’application restent celles de l’APK fourni.

L’APK ne contient pas votre sauvegarde personnelle. Le téléchargement direct ne dépend pas du quota de stockage GitHub Actions.
