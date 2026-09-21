# Yanis Fitness Evolution — Yanis & Émilie

> **Priorité avant l’IA — 21 septembre :** [nouvelle maquette JARVIS : organisation B + orbe A, mode clair](design/accueil-jarvis/README.md), **à valider avant toute intégration**. L’APK reste inchangé. [🚩 Passation pour une nouvelle conversation](PASSATION.md).

## Version complète à tester avant l’IA — 1.3.0

### [📥 Télécharger Yanis Fitness Evolution 1.3.0](downloads/Yanis-Fitness-Evolution-1.3.0.apk?raw=true)

**Les étapes 1 à 7 sont maintenant réunies dans ce nouvel APK signé.** Les fonctions de l’application complète sont conservées : rappels/report, voix et dictée explicites, porte-parole facultatif, rendez-vous guidés, adaptations expliquées, décisions avec historique et suivi réel, puis notifications Android application fermée. **L’IA conversationnelle générale n’est pas ajoutée.**

**Nouvelle application séparée, expressément autorisée après la perte de la signature précédente.** Package `app.yanis.fitness.evolution` ; nom exact **Yanis Fitness Evolution**. Elle s’installe à côté des anciennes, sans les désinstaller. Exporter le JSON à jour depuis l’application utilisée, importer dans la nouvelle **V 1.3.0**, vérifier Yanis et Émilie puis fermer/rouvrir. Les APK historiques ci-dessous restent inchangés.

[Installation et parcours de test](downloads/INSTALLATION-1.3.0.md) · [Notifications et vérifications](evolution/notifications/README.md) · [Rapport de fidélité](downloads/Yanis-Fitness-Evolution-1.3.0.fidelity.json) · [Empreinte SHA-256](downloads/Yanis-Fitness-Evolution-1.3.0.apk.sha256)

**Vérifications :** 176 tests JavaScript ; 86 parcours navigateur validés sur le web du même APK signé ; 25 scénarios natifs de notifications et 20 de voix avec services Android simulés, vérifiés aussi après conversion du DEX final ; 8 contrôles du nouvel APK ; signature v2/v3 et constructions répétées identiques. 272 fichiers web conservés, dont 271 inchangés ; huit DEX sur neuf inchangés ; 4 971 classes uniques. [Détail des passages de test](evolution/notifications/README.md#contrôles).

**Aucun téléphone ni émulateur utilisé ici.** Installation/import sur appareil, micro/son, notifications réelles, écran verrouillé, redémarrage et économie de batterie restent à tester. Les alarmes Android sont inexactes et un arrêt forcé impose de rouvrir l’application.

La nouvelle signature a une sauvegarde chiffrée dans le dépôt et une archive **privée** remise séparément dans la conversation. Cette dernière contient les secrets et ne doit jamais être publiée. Sa conservation externe par l’utilisateur reste à confirmer. [Procédure de récupération](evolution/signing/NEXT-IDENTITY.md).

**Prochaine étape : test de l’utilisateur et corrections éventuelles, puis l’IA conversationnelle en dernier.**

## Historique — APK 1.2.0, étapes 1 à 4

### [Télécharger Yanis Fitness Evolution 1.2.0](downloads/Yanis-Fitness-Evolution-1.2.0.apk?raw=true)

**Nom demandé appliqué ; APK complet signé avec la même identité que la 1.1.0.** Les étapes 1 à 4 sont intégrées : rappels, dictée/lecture, porte-parole et rendez-vous guidés avant/après séance, hebdomadaires et de mensurations. Le programme ne change jamais sur simple ouverture ou saisie d’un rendez-vous. Photos facultatives ; poids seul insuffisant pour les mensurations.

- **Déjà sur la 1.1.0 Évolution ?** Exporter une sauvegarde par précaution, puis installer cet APK comme mise à jour, **sans désinstaller**. Même identifiant Android et même signature : pas de troisième application.
- **Encore sur la 1.0.6 ou une ancienne application ?** Exporter le JSON à jour, installer la 1.2.0 à côté, importer et vérifier les deux profils. Ne pas supprimer l’ancienne application.

[Guide de mise à jour et essais téléphone](downloads/INSTALLATION-1.2.0.md) · [Étape 4](evolution/appointments/README.md) · [Construction/signature](evolution/android/README.md) · [Rapport de conservation](downloads/Yanis-Fitness-Evolution-1.2.0.fidelity.json)

**Contrôles réussis :** 94 tests JS, 60 tests navigateur sur le web extrait de l’APK signé, 9 tests APK et 5 tests de ressources Android. Même certificat que la 1.1.0, signature v2/v3, build répété identique. Les 20 scénarios vocaux simulés passent après conversion du DEX embarqué vers la JVM. **Installation, conservation des données et son/micro sur téléphone restent à confirmer.** Aucun téléphone ni émulateur utilisé ici.

La sauvegarde confidentielle de la signature est remise séparément dans la conversation, jamais dans ce dépôt public. La conserver en stockage privé, distinct des sauvegardes sportives ; sa copie externe n’est pas encore confirmée.

**Cette livraison 1.2.0 s’arrête à l’étape 4.** La suite du développement est décrite ci-dessus et dans le [plan validé](evolution/README.md).

## Historique — 1.1.0 Évolution, étapes 1 à 3

[APK 1.1.0 inchangé](downloads/JARVIS-Fitness-1.1.0-evolution.apk?raw=true) · [Guide historique](downloads/INSTALLATION-1.1.0.md)

Cette version a établi l’identité permanente `app.jarvis.fitness.evolution`, après autorisation d’une nouvelle application parallèle à la 1.0.6 dont la clé n’a pas été retrouvée. **La 1.2.0 réutilise cette identité et sa clé ; seul son nom/version évolue.**

## Historique — APK 1.0.6 complète, conservé sans modification

[Télécharger l’ancienne 1.0.6](downloads/JARVIS-Fitness-1.0.6-complet.apk?raw=true)

Cette version reprend **l’intégralité de `JARVIS-Fitness.apk`** ajouté au dépôt, et conserve le correctif du chronomètre / de la page blanche.

Le premier correctif 1.0.5 utilisait l’archive de sources, plus ancienne que cet APK : des fonctions n’y figuraient pas. **La 1.0.6 ne reconstruit pas l’application à partir de ces anciennes sources.** Elle conserve directement tout le contenu de l’APK complet, avec un correctif limité et vérifié.

### Contrôles de conservation

- **Aucun fichier supprimé** par rapport à l’APK complet fourni.
- **9 fichiers de code Android identiques**.
- **271 fichiers web identiques** : images, animations, polices, styles, pages d’entrée et modules auxiliaires.
- Un seul fichier JavaScript corrigé : 540 de ses 545 déclarations principales sont inchangées. Les cinq changements concernent le chrono, sa fenêtre de validation, l’étiquette de version et la protection contre une page blanche.
- Comparaison des **11 rubriques** et de leurs **28 onglets Yanis / 27 onglets Émilie**, en affichage téléphone et grand écran.
- **21 tests navigateur réussis**, dont import de la sauvegarde fournie, 1RM / charges calculées, guidage vocal, illustrations, pause/reprise et validation du chrono. **10 tests de conservation du code et des ressources** réussis.

Les fonctions de l’APK fourni sont conservées, notamment : bilan 1RM, charges personnalisées, guidage vocal de séance, RIR, coach local à règles, thèmes clair/sombre, illustrations, échauffements et étirements guidés, paramètres et panneau montre/ceinture. Les limites Android existantes pour les capteurs et les notifications ne sont pas modifiées.

### Installation sans perdre de données

L’application s’appelle **JARVIS Fitness Complet** et s’installe **à côté des précédentes** (`app.jarvis.fitness.complete`). Les clés de signature des versions précédemment installées ne sont pas disponibles pour cette livraison ; ce n’est donc pas une mise à jour automatique de leurs données.

1. Dans l’application qui contient vos données les plus récentes : **Profil → Données & sauvegardes → Exporter la sauvegarde JSON**.
2. Installer l’APK puis ouvrir **JARVIS Fitness Complet**.
3. **Profil → Données & sauvegardes → Choisir une sauvegarde → Sauvegarder puis importer**.
4. Vérifier Yanis et Émilie. Si le chrono terminé réapparaît, le valider : il se ferme sans écran blanc.
5. **Ne pas désinstaller les anciennes applications avant d’avoir vérifié les deux profils.**

[Notice d’installation](downloads/INSTALLATION.md) · [Contrôles et reconstruction](complete-hotfix/README.md) · [Rapport de conservation fichier par fichier](downloads/JARVIS-Fitness-1.0.6-complet.fidelity.json)

Signature Android v2/v3 et alignement vérifiés. **Pas de test sur un téléphone physique dans cet environnement.** Aucun JSON personnel n’a été ajouté à l’APK distribué.

### Pour les prochains correctifs

- Procédure actuelle : [`complete-hotfix/`](complete-hotfix/), basée sur le bon APK et verrouillée par empreinte SHA-256.
- Anciennes sources : [`JARVIS-Fitness-Source/`](JARVIS-Fitness-Source/), conservées à titre historique. Leur build ne doit pas remplacer celui de l’application complète.
- Le téléchargement direct évite les pièces jointes Releases et le quota d’artefacts GitHub Actions. L’ancienne livraison reste accessible dans son historique, mais n’est plus proposée comme version actuelle.
