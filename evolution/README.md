# Évolution de JARVIS — ordre validé

L’application complète fournie par l’utilisateur est la référence. Le dossier historique `JARVIS-Fitness-Source` sert à certains outils/tests et à la lecture du code, **pas à reconstruire seul l’application complète**.

## État au 20 septembre 2026

1. **Rappels et échéances : implémentation web intégrée et testée.** Voir [le détail et les commandes](reminders/README.md). Aperçu utilisable ; **pas encore livré dans un nouvel APK**.
2. **Voix et microphone : interface implémentée et testée ; validation Android réelle en attente.** Module natif réécrit et compilé contre les API réelles. Les tests de cette étape sont repris dans la validation cumulative de l’étape 3. Diagnostics, permissions, écoute/transcription/lecture, brouillon modifiable, annulation, erreurs et priorité des chronos. **Restent l’intégration DEX dans l’APK complet, la signature et les essais réels sur téléphone.** [Détail et reproduction](voice/README.md).
3. **JARVIS porte-parole de l’équipe : implémentation web intégrée et testée**, autorisée après validation de l’étape 2. Accueil facultatif désactivé par défaut, priorités attribuées aux coaches et expliquées, choix de voix/débit/silence, Pourquoi/Répéter/Plus tard. Aucun micro automatique. Validation cumulative : **75 tests JS, 49 tests navigateur et 20 scénarios natifs simulés réussis** ; module Android enrichi et compilé contre les API réelles. **Pas de nouvel APK ni d’essai sur téléphone.** [Détail et reproduction](spokesperson/README.md).
4. **Prochaine étape — rendez-vous interactifs** : avant/après séance, bilan hebdomadaire, mensurations mensuelles et photos facultatives.
5. Adaptations fondées sur les données : comparaisons pertinentes, propositions expliquées, pas de conclusions inventées ; bilan distinct d’un test maximal.
6. Mémoire des décisions : accepté/refusé/reporté, suivi, historique. **Confirmation obligatoire avant modification du programme.**
7. Notifications Android application fermée : autorisations, programmation, annulation après saisie, dédoublonnage, discrétion sur écran verrouillé.
8. **IA conversationnelle générale en dernier**, conformément à la décision de l’utilisateur. Aucun fournisseur, budget ou transfert cloud n’a été choisi ou implémenté.

Annoncer l’étape suivante à chaque étape terminée. Ne pas présenter une inspection statique de la voix comme un test réussi sur téléphone.

## Blocage de la livraison Android

L’APK signé 1.0.6 dans `downloads/` reste la dernière livraison. Il **ne contient pas** les étapes 1 à 3. La clé privée et son mot de passe utilisés pour signer ce binaire ne sont plus disponibles dans l’environnement restauré. La continuité de signature n’est donc pas assurée.

Aucun nouvel APK, package ou certificat n’a été créé pour contourner ce blocage. Ne pas promettre une mise à jour installable par-dessus la 1.0.6, ni demander de désinstaller l’application contenant les données. Résoudre la signature et organiser une conservation privée durable de la clé avant toute nouvelle diffusion Android ; ne jamais publier la clé ou son mot de passe dans Git.
