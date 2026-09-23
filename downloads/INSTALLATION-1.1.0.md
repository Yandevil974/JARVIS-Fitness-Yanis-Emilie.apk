# Installer JARVIS Fitness Évolution 1.1.0 sans supprimer l’ancienne application

**Version de validation Android.** L’APK est construit, signé et contrôlé, mais n’a pas encore été installé/testé sur un téléphone dans cet environnement. Les essais audio automatisés utilisent des services simulés. Ne pas considérer cette livraison comme la validation finale de toutes les fonctions Android.

## Télécharger

[Télécharger l’APK 1.1.0](JARVIS-Fitness-1.1.0-evolution.apk?raw=true)

L’application s’appelle **JARVIS Fitness Évolution** (`app.jarvis.fitness.evolution`). Elle utilise une nouvelle signature, autorisée après l’échec de récupération de celle de la 1.0.6. Elle s’installe **à côté** de JARVIS Fitness Complet et des versions précédentes ; elle ne récupère pas automatiquement leurs données.

## Les quatre étapes

1. **Dans l’ancienne application qui contient les données les plus récentes** : ouvrir **Mon profil → Données & sauvegardes → Exporter la sauvegarde JSON**. Conserver ce fichier en lieu privé. Une sauvegarde ancienne du dépôt ne remplace pas cet export à jour.
2. Télécharger puis installer l’APK 1.1.0. Si Android le demande, autoriser temporairement l’installation depuis le navigateur utilisé. Si une alerte de sécurité inhabituelle ou une erreur apparaît, s’arrêter et transmettre son texte ; ne pas désactiver globalement les protections du téléphone.
3. Ouvrir **JARVIS Fitness Évolution**, puis **Mon profil → Données & sauvegardes → Choisir une sauvegarde → Sauvegarder puis importer**. Choisir le JSON exporté à l’étape 1.
4. Vérifier **Yanis ET Émilie** : séances, programme, bilans de force, mensurations, poids et photos. Fermer puis rouvrir l’application et vérifier que les données restent présentes.

**Ne désinstaller aucune ancienne application et ne pas effacer ses données.** En cas d’échec d’installation ou d’import, l’ancienne reste la référence. Les deux applications ne se synchronisent pas : une fois la nouvelle vérifiée, choisir celle à utiliser au quotidien pour ne pas avoir deux historiques divergents.

## Ce que contient cette version

- L’application complète fournie, avec les correctifs du chrono.
- Étape 1 : rappels persistants, mensurations distinctes du poids, reports et profils indépendants.
- Étape 2 : nouveau module Android de dictée, diagnostic, brouillon modifiable avant envoi, annulation et priorité des chronos.
- Étape 3 : point d’équipe expliqué, accueil vocal facultatif, voix/débit/silence et Pourquoi / Répéter / Plus tard.

**Pas encore les étapes 4 à 7, ni l’IA conversationnelle générale.** Le coach conversationnel existant reste local à règles. Le Bluetooth natif et les notifications application fermée ne sont pas présentés comme de nouvelles fonctions terminées.

## Vérification simple sur ton téléphone

Après avoir vérifié l’import :

1. **JARVIS → Diagnostic voix et microphone → Vérifier les services vocaux**, puis **Tester la voix**. Vérifier le volume média et que le mode silencieux de l’application est désactivé.
2. Appuyer sur le micro, accorder l’autorisation si souhaité, dicter une phrase. Elle doit rester dans le champ modifiable : **rien ne part sans appuyer sur Envoyer**. Essayer aussi Arrêter l’écoute.
3. Sur l’accueil, ouvrir **Réglages vocaux**, actualiser les voix et tester un débit. L’accueil automatique est désactivé par défaut.
4. Lancer un court chrono, essayer pause/reprise puis terminer et valider. Vérifier l’absence d’écran blanc et de double annonce.
5. Pendant une lecture, mettre l’application en arrière-plan puis verrouiller l’écran : vérifier l’arrêt du son. Revenir dans l’application et changer de profil : aucun brouillon ne doit passer de Yanis à Émilie.

Les services vocaux peuvent nécessiter une voix française installée et une connexion Internet. Le fonctionnement hors ligne n’est pas garanti. Si un point ne marche pas, noter le modèle du téléphone, sa version Android et le message affiché ; ne pas envoyer de sauvegarde personnelle dans un dépôt public.

## Sauvegarde privée de la nouvelle signature

Une archive **`JARVIS-signature-CONFIDENTIEL.zip`** est fournie séparément dans la conversation, **pas dans GitHub ni dans l’APK**. Elle sert aux futures mises à jour. Télécharge-la et conserve-la dans un emplacement privé sauvegardé, idéalement avec une seconde copie.

**Ne la publie jamais.** Elle contient le fichier de clé protégé et son mot de passe ; le ZIP lui-même n’est pas chiffré. Elle ne remplace pas les sauvegardes JSON de tes données sportives.

## Empreintes publiques

- APK SHA-256 : `8ccf8cd0d8029a468882d078fa873c166716b142f9fd63fa3d38c41091517040`
- Certificat signataire SHA-256 : `0849b90901a80eecbd587bd41d5acfbfb120096889bb979dfa37564a8de23225`
- Android minimal : 8.0 / API 26 ; cible API 34 ; version 1.1.0 / code 8 ; debug désactivé.

[Rapport de conservation](JARVIS-Fitness-1.1.0-evolution.fidelity.json) · [Construction et contrôles techniques](../evolution/android/README.md)
