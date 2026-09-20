# JARVIS Fitness — Yanis & Émilie

## Version actuelle : **1.0.6 complète**, basée sur l’APK ajouté le 20 septembre

### [Télécharger JARVIS Fitness Complet (APK)](downloads/JARVIS-Fitness-1.0.6-complet.apk?raw=true)

Cette version reprend **l’intégralité de `JARVIS-Fitness.apk`** ajouté au dépôt, et conserve le correctif du chronomètre / de la page blanche.

Le premier correctif 1.0.5 utilisait l’archive de sources, plus ancienne que cet APK : des fonctions n’y figuraient pas. **La 1.0.6 ne reconstruit pas l’application à partir de ces anciennes sources.** Elle conserve directement tout le contenu de l’APK complet, avec un correctif limité et vérifié.

### Contrôles de conservation

- **Aucun fichier supprimé** par rapport à l’APK complet fourni.
- **9 fichiers de code Android identiques**.
- **271 fichiers web identiques** : images, animations, polices, styles, pages d’entrée et modules auxiliaires.
- Un seul fichier JavaScript corrigé : 540 de ses 545 déclarations principales sont inchangées. Les cinq changements concernent le chrono, sa fenêtre de validation, l’étiquette de version et la protection contre une page blanche.
- Comparaison des **11 rubriques** et de leurs **28 onglets Yanis / 27 onglets Émilie**, en affichage téléphone et grand écran.
- **21 tests navigateur réussis**, dont import de la sauvegarde fournie, 1RM / charges calculées, guidage vocal, illustrations, pause/reprise et validation du chrono. **10 tests de conservation du code et des ressources** réussis.

Les fonctions de l’APK fourni sont conservées, notamment : bilan 1RM, charges personnalisées, guidage vocal de séance, RIR, coach conversationnel, thèmes clair/sombre, illustrations, échauffements et étirements guidés, paramètres et panneau montre/ceinture. Les limites Android existantes pour les capteurs et les notifications ne sont pas modifiées.

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
