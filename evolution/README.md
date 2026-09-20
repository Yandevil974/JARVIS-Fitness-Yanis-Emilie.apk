# Évolution de JARVIS — ordre validé

L’application complète fournie par l’utilisateur est la référence. Le dossier historique `JARVIS-Fitness-Source` sert à certains outils/tests et à la lecture du code, **pas à reconstruire seul l’application complète**.

## État au 20 septembre 2026

**Livraison intermédiaire 1.1.0 Évolution :** les étapes 1 à 3 sont maintenant embarquées dans un APK signé, installé en parallèle sous une nouvelle identité autorisée. [Livraison et contrôles](android/README.md). **Priorité immédiate : import des données et essais réels sur téléphone.**

1. **Rappels et échéances : implémentés, testés et embarqués.** Voir [le détail](reminders/README.md).
2. **Voix et microphone : nouveau module natif intégré aux DEX de l’APK complet.** Diagnostics, dictée modifiable avant envoi, annulation et priorité des chronos. Compilation API et simulations réussies, dont un passage après aller-retour du DEX final. **Validation acoustique et permissions réelles encore à faire.** [Détail](voice/README.md).
3. **JARVIS porte-parole : implémenté, testé et embarqué.** Accueil facultatif désactivé par défaut, priorités expliquées et attribuées, choix de voix/débit/silence, Pourquoi/Répéter/Plus tard. Aucun micro automatique. 75 tests JS et 49 tests navigateur cumulatifs réussis ; ceux du navigateur ont été relancés sur le web extrait du nouvel APK. [Détail](spokesperson/README.md).
4. **Prochaine étape — rendez-vous interactifs** : avant/après séance, bilan hebdomadaire, mensurations mensuelles et photos facultatives.
5. Adaptations fondées sur les données : comparaisons pertinentes, propositions expliquées, pas de conclusions inventées ; bilan distinct d’un test maximal.
6. Mémoire des décisions : accepté/refusé/reporté, suivi, historique. **Confirmation obligatoire avant modification du programme.**
7. Notifications Android application fermée : autorisations, programmation, annulation après saisie, dédoublonnage, discrétion sur écran verrouillé.
8. **IA conversationnelle générale en dernier**, conformément à la décision de l’utilisateur. Aucun fournisseur, budget ou transfert cloud n’a été choisi ou implémenté.

Annoncer l’étape suivante à chaque étape terminée. Ne pas présenter une inspection statique de la voix comme un test réussi sur téléphone.

## Nouvelle identité Android autorisée

La clé de la 1.0.6 n’a pas été retrouvée dans l’espace accessible. Après explication des conséquences, l’utilisateur a autorisé une nouvelle application installée à côté, avec export/import et sans suppression de l’ancienne.

La **1.1.0 Évolution**, package `app.jarvis.fitness.evolution`, est construite et signée. La nouvelle clé n’est ni dans Git ni dans les caches ; une archive privée a été restaurée et utilisée pour signer l’APK. Elle est fournie séparément à l’utilisateur, qui doit la télécharger et la sauvegarder hors de cet environnement. La copie externe reste à confirmer.

Ce n’est pas une mise à jour installable par-dessus la 1.0.6. **Ne pas désinstaller ni effacer l’ancienne application.** La validation sur téléphone reste ouverte ; ne pas présenter cette version comme « tout testé et opérationnel sur Android ». Voir [l’installation](../downloads/INSTALLATION-1.1.0.md).
