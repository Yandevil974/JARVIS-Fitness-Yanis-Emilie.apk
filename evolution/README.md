# Évolution de JARVIS — ordre validé

L’application complète fournie par l’utilisateur est la référence. Les anciennes sources `JARVIS-Fitness-Source` servent aux outils/tests et à la lecture du code, **pas à reconstruire seules l’application complète**.

## Livraison actuelle — 1.4.0, étapes 1–7 et accueil validé

[**Télécharger l’APK complet 1.4.0**](../downloads/Yanis-Fitness-Evolution-1.4.0.apk?raw=true) · [Installation/import sans suppression](../downloads/INSTALLATION-1.4.0.md) · [Rapport de livraison](android/HOME-RELEASE.md).

Nouvelle installation séparée explicitement autorisée le 21 septembre (« Oui, on y va », puis « Poursuis »). Package `app.yanis.fitness.evolution.home`, nom inchangé **Yanis Fitness Evolution**. Les neuf DEX sont conservés, les sept étapes ci-dessous sont incluses et l’accueil approuvé est embarqué. 90 tests navigateur sur le web du nouvel APK, 150 tests de logique, 4 tests d’intégrité et 8 contrôles APK/récupération réussis. Pas de test physique/emulateur. [Signature actuelle à préserver](signing/HOME-IDENTITY.md).

**Priorité actuelle : [audit/correction des visuels d’exercice](media/README.md), après le signalement des dips et de mauvaises correspondances dans toutes les catégories. Audit documenté, pas encore de nouvel APK corrigé. Conserver la signature 1.4.0. IA conversationnelle toujours en pause.**

## Historique précédant l’autorisation de la nouvelle installation

## Accueil validé — 21 septembre 2026

Après validation explicite « Parfait je valide », [la refonte est intégrée au candidat web complet](home/README.md) : orbe bleu animé, clair/sombre colorés, carte séance d’origine remontée. **4 tests Node et 90 tests navigateur réussis**. Les sept étapes restent inchangées. **Aucun nouvel APK produit** : récupération de la signature actuelle puis recette de mise à jour Android nécessaires. La 1.3.0 ci-dessous reste la livraison antérieure, sans cette refonte. IA toujours en pause.

## État au 20 septembre 2026 — version 1.3.0 complète à tester

[**Télécharger Yanis Fitness Evolution 1.3.0**](../downloads/Yanis-Fitness-Evolution-1.3.0.apk?raw=true) · [Installation sans suppression de l’ancienne application](../downloads/INSTALLATION-1.3.0.md)

L’utilisateur demande maintenant à tester **toutes les étapes 1 à 7 avant l’IA**, et a explicitement autorisé une nouvelle application séparée après la perte de fichiers privés et du travail non publié de la session précédente. Le nouveau package est `app.yanis.fitness.evolution`, avec le nom exact **Yanis Fitness Evolution**. Les sources des étapes 1–6 ont été conservées ; l’étape 7 a été reconstruite et intégrée aux DEX de l’APK complet.

1. **Rappels et échéances : embarqués.** Suivi par profil, actions, reports et annulations. Les mensurations réelles ne sont pas remplacées par le poids ; lire ne marque pas comme réalisé. [Détail](reminders/README.md).
2. **Voix et microphone : embarqués.** Plugin natif de diagnostics, dictée modifiable avant envoi, annulation, protection contre les callbacks tardifs et priorité des chronos. [Détail](voice/README.md).
3. **JARVIS porte-parole facultatif : embarqué.** Point court fondé sur des données réelles, priorités expliquées, lecture/répétition/report et réglages vocaux séparés. Aucun micro automatique. [Détail](spokesperson/README.md).
4. **Rendez-vous interactifs : embarqués.** Avant/après une séance réelle, bilan hebdomadaire, mensurations avec photos facultatives ; brouillons par profil, relecture et confirmation. [Détail](appointments/README.md).
5. **Adaptations expliquées : embarquées.** Comparaisons prudentes de réalisations comparables ; hausse/maintien/allègement ou données insuffisantes ; ressentis et prudence, aucune mutation à la consultation. [Détail](adaptation/README.md).
6. **Décisions et suivi : embarqués.** Accepter/refuser/reporter avec confirmation explicite, une cible compatible choisie, historique par profil et suivi des vraies séries. Refus respecté, pas d’application automatique des reports. [Détail](decisions/README.md).
7. **Notifications application fermée : reconstruites, embarquées.** Autorisation Android distincte du consentement par profil, programmation privée, annulation, dédoublonnage, reprise après redémarrage/heure/fuseau et contenu discret. [Détail et limites](notifications/README.md).
8. **IA conversationnelle générale : pas commencée.** Aucun fournisseur, budget ou transfert cloud choisi. Elle vient après le test demandé et les corrections éventuelles.

## Vérifications et limites

176 tests JavaScript ; 86 parcours navigateur validés sur le web du même APK signé ; 25 scénarios de notifications et 20 de voix avec services Android simulés, également vérifiés depuis le DEX final. Conservation des 11 rubriques et de leurs onglets, des données à l’import/export dans les deux profils, des ressources et de l’essentiel des DEX. Trois constructions signées identiques, alignement/signature v2/v3 vérifiés. [Résultats et détail des passages](notifications/README.md#contrôles).

**Aucun téléphone ni émulateur utilisé.** Installation/import réels, son/micro, réception des notifications, écran verrouillé, redémarrage et économie d’énergie restent à vérifier sur l’appareil. Les notifications sont inexactes et Android peut les retarder ; après un arrêt forcé, rouvrir l’application. Les services vocaux peuvent dépendre du réseau et des langues installées.

## Données et signature

Garder les anciennes applications intactes, exporter le JSON depuis celle réellement utilisée, installer la nouvelle 1.3.0 à côté, importer puis vérifier Yanis et Émilie. Les APK 1.0.6, 1.1.0 et 1.2.0 restent inchangés ; la nouvelle clé **ne permet pas** de les mettre à jour en place.

La nouvelle identité est conservée séparément dans `android/identity-next.json` ; la configuration de livraison est `android/release-next.json`. [Sauvegarde chiffrée et récupération](signing/NEXT-IDENTITY.md). L’archive privée de signature a été affichée séparément à l’utilisateur, mais sa conservation externe reste **à confirmer**. Ne jamais publier l’archive en clair, la clé ou le secret de récupération. Ne pas générer encore une identité pour résoudre une absence de clé.

Les constats précédents de fichiers absents restent documentés dans [l’historique de livraison](android/DELIVERY-STATUS.md). Ne pas confondre cette reconstruction disponible avec le candidat d’étape 7 anciennement annoncé et non retrouvé.

**Prochaine étape : le test de l’utilisateur, avant toute IA conversationnelle.** Annoncer l’étape suivante après chaque étape terminée et ne jamais présenter les simulations comme une validation sur téléphone.
