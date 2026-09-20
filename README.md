# JARVIS Fitness — Yanis & Émilie

## Correctif 1.0.5 — chronomètre et page blanche

Les sources de l’archive d’origine sont maintenant accessibles et modifiables dans [`JARVIS-Fitness-Source/`](JARVIS-Fitness-Source/).

### Installation sans supprimer vos données

L’APK corrigé est nommé **JARVIS-Fitness-1.0.5-corrige.apk** et l’application **JARVIS Fitness Corrigé**.

La clé de signature de l’ancien APK n’était pas présente dans l’archive. Cette version utilise donc un identifiant Android distinct (`app.jarvis.fitness.fixed`) pour **s’installer à côté de l’ancienne**, sans désinstallation ni effacement de ses données.

1. Dans l’ancienne application : **Profil → Données & sauvegardes → Exporter la sauvegarde JSON**. Si elle affiche une page blanche, la fermer puis la rouvrir sans valider l’ancien chrono.
2. Installer l’APK corrigé et ouvrir **JARVIS Fitness Corrigé**.
3. Dans **Profil → Données & sauvegardes → Choisir une sauvegarde**, sélectionner le JSON exporté, puis **Sauvegarder puis importer**.
4. Si l’ancien chrono terminé réapparaît après import, l’ouvrir et valider l’échauffement : il se ferme désormais correctement.
5. Vérifier les deux profils avant toute suppression de l’ancienne application. **Ne pas désinstaller l’ancienne application avant cette vérification.**

La sauvegarde du 19 septembre présente dans ce dépôt a également été testée. Préférer un export plus récent si de nouvelles séances ont été saisies depuis.

### Diagnostic et contrôles

Voir [`CORRECTIONS_1.0.5.md`](JARVIS-Fitness-Source/CORRECTIONS_1.0.5.md) pour le diagnostic, les tests et la procédure de reconstruction hors GitHub Actions.

L’APK distribué ne contient pas de sauvegarde personnelle embarquée. Les fichiers personnels déjà présents dans le dépôt initial n’ont pas été modifiés.
