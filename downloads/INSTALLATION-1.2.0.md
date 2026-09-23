# Yanis Fitness Evolution 1.2.0

[Télécharger l’APK](Yanis-Fitness-Evolution-1.2.0.apk?raw=true)

Le nom demandé est appliqué à l’application Android. JARVIS reste le nom de l’assistant à l’intérieur. Les profils **Yanis et Émilie** restent séparés et disponibles.

## Si JARVIS Fitness Évolution 1.1.0 est déjà installé

1. Par précaution, exporter le JSON à jour : **Mon profil → Données & sauvegardes → Exporter la sauvegarde JSON**.
2. Ouvrir le nouvel APK et accepter la **mise à jour**. **Ne pas désinstaller la 1.1.0 et ne pas effacer ses données.**
3. Le nom devient **Yanis Fitness Evolution**. Vérifier les données de Yanis et d’Émilie, fermer puis rouvrir l’application.

La 1.2.0 conserve le même identifiant Android et la même signature que la 1.1.0 : elle est construite pour la remplacer en conservant ses données, pas pour créer une troisième application. Cette mise à jour n’a pas encore été essayée sur un téléphone dans notre environnement.

## Si tu utilises encore la 1.0.6 ou une ancienne application

Tu peux installer directement la 1.2.0, sans passer par la 1.1.0. Elle s’installe **à côté** de cette ancienne application :

1. Exporter le JSON depuis l’application qui possède les données les plus récentes.
2. Installer **Yanis Fitness Evolution**.
3. Dans la nouvelle application : **Mon profil → Données & sauvegardes → Choisir une sauvegarde → Sauvegarder puis importer**.
4. Vérifier les deux profils et leurs séances, mesures, photos, bilans et programmes. Fermer/rouvrir et vérifier encore.
5. Garder l’ancienne application intacte tant que ces vérifications ne sont pas terminées.

Si Android refuse l’installation ou demande de désinstaller, **ne rien supprimer** : conserver les sauvegardes et transmettre le message exact affiché.

## Nouveauté : mes rendez-vous avec l’équipe

Sur **Accueil**, et avec des raccourcis dans **Entraînement** :

- **Avant ma séance** : énergie, temps disponible, douleur importante. Cela ne lance pas la séance. Si une séance est déjà ouverte, la préparation garde son identifiant ; sinon elle concerne seulement la journée.
- **Après ma séance** : choisir une séance réellement enregistrée, préciser l’effort et les problèmes. Les séries, durées et performances originales restent inchangées.
- **Bilan hebdomadaire guidé** : ressentis et questions enregistrés dans le bilan habituel de **Mon équipe → Retours enregistrés**. Une modification conserve les versions antérieures. Les dates doivent appartenir aux 52 semaines du programme existant.
- **Mensurations guidées** : au moins un tour corporel en cm. Le poids seul ne valide pas les mensurations. Les photos sont facultatives : cocher la case ouvre le module photo après confirmation, sans ajouter ni analyser automatiquement une image.

Chaque parcours comporte **contexte → réponses → relecture et confirmation**. Fermer ou choisir « Garder pour plus tard » ne valide rien. Les brouillons sont repris depuis Accueil et restent dans leur profil ; une préparation d’un ancien jour doit être refaite avec ton état actuel. Les douze derniers rendez-vous confirmés sont consultables dans le panneau ; les autres restent conservés dans les données exportées.

Une douleur importante confirmée rejoint les ressentis du jour concerné et ne supprime jamais une alerte déjà présente. La protection existante peut alors empêcher un nouvel effort. Aucun diagnostic ni allègement automatique du programme.

Ces formulaires fonctionnent localement. Ce ne sont pas encore des conversations avec une IA générale ou des professionnels. La dictée reste disponible dans **JARVIS** ; les formulaires n’activent jamais le micro automatiquement.

## Essais à faire sur ton téléphone

- Vérifier que la 1.1.0 est bien mise à jour sans perte de données, ou que l’import depuis l’ancienne application est complet.
- Saisir un brouillon réel, fermer/rouvrir, le reprendre, vérifier l’autre profil, puis confirmer seulement si les valeurs sont correctes.
- Vérifier les mensurations dans Progression et le bilan dans Mon équipe.
- Tester les permissions micro, la dictée puis l’envoi volontaire, la lecture, le chrono, le passage en arrière-plan et le mode avion. Les services vocaux disponibles dépendent du téléphone ; le fonctionnement hors ligne n’est pas garanti.
- Conserver en privé l’archive de signature confidentielle déjà remise, séparément des JSON sportifs. Ne jamais la publier sur GitHub.

**Contrôles automatiques réussis :** 94 tests JS, 60 tests navigateur sur le web extrait de l’APK final signé, 9 contrôles de livraison APK, conservation des 11 rubriques dans les deux profils, signature v2/v3 et même certificat que la 1.1.0. Les 20 simulations vocales passent aussi sur le DEX embarqué reconverti vers la JVM. Aucun test sur téléphone ou émulateur n’est revendiqué.

**Étape suivante : 5 — propositions d’adaptation expliquées, fondées sur des séances comparables.** Puis mémoire des décisions, notifications application fermée, et IA conversationnelle générale en dernier.
