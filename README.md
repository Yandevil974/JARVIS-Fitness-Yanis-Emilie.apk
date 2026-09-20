# JARVIS Fitness — Yanis & Émilie

## Nouvel APK : JARVIS Fitness Évolution 1.1.0

### [Télécharger l’APK 1.1.0 Évolution](downloads/JARVIS-Fitness-1.1.0-evolution.apk?raw=true)

**Version de validation Android : APK complet construit et signé, essais sur téléphone encore nécessaires.** Il contient les correctifs du chrono et les étapes 1 à 3 : rappels, nouveau module natif de dictée/lecture et point d’équipe avec réglages vocaux. Ce n’est pas encore la fin du plan d’évolution.

**Installation à côté de l’ancienne application, autorisée par l’utilisateur.** La clé de la 1.0.6 n’a pas été retrouvée. Cette version a une nouvelle identité, `app.jarvis.fitness.evolution`, et une nouvelle signature sauvegardée en privé. Elle ne remplace pas automatiquement la 1.0.6 et ne récupère pas seule ses données.

1. Exporter le JSON **à jour** depuis l’ancienne application.
2. Installer **JARVIS Fitness Évolution**, puis importer ce JSON dans **Mon profil → Données & sauvegardes**.
3. Vérifier Yanis et Émilie, fermer/rouvrir, puis tester voix, micro et chrono. **Ne désinstaller aucune ancienne application.**

[Guide d’installation et essais](downloads/INSTALLATION-1.1.0.md) · [Construction/signature et contrôles](evolution/android/README.md) · [Rapport de conservation](downloads/JARVIS-Fitness-1.1.0-evolution.fidelity.json)

**Contrôles réussis :** 75 tests JS, 49 tests navigateur sur le web extrait de l’APK, 8 tests de livraison et 5 tests de ressources Android. Les 20 scénarios vocaux simulés passent aussi après conversion du DEX embarqué vers la JVM. Signature v2/v3 et alignement vérifiés. **Aucun de ces tests ne remplace un essai sur téléphone.**

La sauvegarde confidentielle de la signature est remise séparément dans la conversation, jamais dans ce dépôt public. La télécharger et la conserver en lieu privé ; elle est distincte des sauvegardes sportives.

**Prochaine priorité : validation sur le téléphone. Ensuite : étape 4, rendez-vous interactifs.** L’IA conversationnelle générale reste pour la fin. [Plan validé](evolution/README.md).

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
