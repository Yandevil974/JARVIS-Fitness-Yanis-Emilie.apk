# Évolution de JARVIS — ordre validé

L’application complète fournie par l’utilisateur est la référence. Le dossier historique `JARVIS-Fitness-Source` sert à certains outils/tests et à la lecture du code, **pas à reconstruire seul l’application complète**.

## État au 20 septembre 2026

**Livraison intermédiaire 1.2.0 Yanis Fitness Evolution :** les étapes 1 à 4 sont embarquées dans un APK signé. Le nom demandé est appliqué sans changer le package ni la signature de la 1.1.0 ; cette version est une mise à jour de celle-ci et reste parallèle à la 1.0.6. [Livraison et contrôles](android/README.md). **Essais réels sur téléphone toujours à confirmer, indépendamment de la poursuite autorisée du développement.**

1. **Rappels et échéances : implémentés, testés et embarqués.** Voir [le détail](reminders/README.md).
2. **Voix et microphone : nouveau module natif intégré aux DEX de l’APK complet.** Diagnostics, dictée modifiable avant envoi, annulation et priorité des chronos. Compilation API et simulations réussies, dont un passage après aller-retour du DEX final. **Validation acoustique et permissions réelles encore à faire.** [Détail](voice/README.md).
3. **JARVIS porte-parole : implémenté, testé et embarqué.** Accueil facultatif désactivé par défaut, priorités expliquées et attribuées, choix de voix/débit/silence, Pourquoi/Répéter/Plus tard. Aucun micro automatique. 75 tests JS et 49 tests navigateur cumulatifs réussis ; ceux du navigateur ont été relancés sur le web extrait du nouvel APK. [Détail](spokesperson/README.md).
4. **Rendez-vous interactifs : implémentés, testés et embarqués en 1.2.0.** Avant/après séance, bilan hebdomadaire, mensurations et photos facultatives. Brouillons par profil, relecture puis confirmation, historiques existants conservés. 94 tests JS et 60 navigateur cumulatifs réussis sur le web de l’APK signé. [Détail](appointments/README.md).
5. **Propositions d’adaptation : implémentées et testées dans le web cumulatif, pas encore dans un nouvel APK.** Comparaison prudente de deux réalisations, hausse/maintien/allègement expliqués ou données insuffisantes, prise en compte des ressentis, aucune mutation. Réévaluation sans test maximal. 125 tests JS et 68 navigateur cumulatifs. [Détail et limites](adaptation/README.md).
6. **Décisions et suivi : implémentés et testés dans le web cumulatif, pas encore dans un nouvel APK.** Accepter/refuser/reporter, relecture puis confirmation, cible compatible unique, historique par profil et suivi des vraies séries après clôture. Refus respecté par le calcul historique de charge ; report sans application automatique. 154 tests JS et 77 navigateur cumulatifs. [Détail et limites](decisions/README.md).
7. **Prochaine étape — notifications Android application fermée :** autorisations, programmation, annulation après saisie, dédoublonnage, discrétion sur écran verrouillé.
8. **IA conversationnelle générale en dernier**, conformément à la décision de l’utilisateur. Aucun fournisseur, budget ou transfert cloud n’a été choisi ou implémenté.

Annoncer l’étape suivante à chaque étape terminée. Ne pas présenter une inspection statique de la voix comme un test réussi sur téléphone.

## Installation reportée à la fin à la demande de l’utilisateur

L’utilisateur a précisé : « Je vais installer quand t’auras terminé. On poursuit ». Le développement continue dans l’ordre validé **sans exiger d’installation intermédiaire**. Pas de nouvel APK pour les étapes 5–6 : la 1.2.0 reste une livraison historique des étapes 1–4. L’emballage final devra intégrer les étapes suivantes, garder le nom **Yanis Fitness Evolution**, le package et la signature permanents, puis subir à nouveau les tests sur le contenu réellement empaqueté.

L’installation, l’import, les permissions et les essais acoustiques restent **non vérifiés sur appareil**, volontairement reportés ; cette autorisation de poursuivre ne vaut pas validation Android. La conservation externe de l’archive de signature reste également à confirmer, sans bloquer le développement.

## Nouvelle identité Android autorisée

La clé de la 1.0.6 n’a pas été retrouvée dans l’espace accessible. Après explication des conséquences, l’utilisateur a autorisé une nouvelle application installée à côté, avec export/import et sans suppression de l’ancienne.

La **1.1.0 Évolution**, puis la **1.2.0 Yanis Fitness Evolution**, package `app.jarvis.fitness.evolution`, sont construites et signées avec la même clé. La nouvelle clé n’est ni dans Git ni dans les caches ; une archive privée a été restaurée et utilisée pour signer l’APK. Elle est fournie séparément à l’utilisateur, qui doit la télécharger et la sauvegarder hors de cet environnement. La copie externe reste à confirmer.

La 1.2.0 remplace la 1.1.0, mais ce n’est pas une mise à jour installable par-dessus la 1.0.6. **Ne pas désinstaller ni effacer l’ancienne application.** La validation sur téléphone reste ouverte ; ne pas présenter cette version comme « tout testé et opérationnel sur Android ». Voir [l’installation](../downloads/INSTALLATION-1.2.0.md).
