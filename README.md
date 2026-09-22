# Mise à jour 1.0.4

Fiabilisation des déplacements liés, correction des informations de photos, bilans d’équipe datés et versionnés, validation avant sauvegarde et protection de l’aperçu web. **Les programmes et la sauvegarde de Yanis sont conservés.**

Voir `CORRECTIONS_1.0.4.md`. Tests et compilation doivent être lancés séparément dans un environnement de 2 Go de RAM ; Gradle est limité à 768 Mo et un worker.

---

# JARVIS FITNESS 1.0.3 — Yanis & Émilie

**Version personnalisée : reprise du programme HTML complet et de la sauvegarde JSON de Yanis.**

## Nouveautés essentielles

- Votre JSON est inclus uniquement dans les assets privés Android. Sur un profil Yanis vide, il peut être restauré automatiquement ; sinon une confirmation est demandée avec export préalable. Émilie n’est pas remplacée.
- **Accueil → Votre semaine complète** et **Programme → Cette semaine / Calendrier** affichent musculation, METCON, piscine et cardio après séance. Une journée METCON ouvre les blocs elliptique, transition puis exercices de piscine.
- **Mon équipe → Retours enregistrés** contient les trois bilans et dix retours du JSON. Les huit rôles du fichier sont accessibles, avec des conseils actuels locaux. L’équipe est explicitement virtuelle.
- **Entraînement → Journal du fichier** permet de relire les 102 lignes d’origine, y compris les champs vides et les journées non effectuées.
- Les couleurs sont distinctes : bleu musculaire, orange METCON, cyan piscine, violet récupération et accents multicolores pour l’équipe.
- La date de départ du **10 août 2026** est restaurée. La semaine du **31 août au 6 septembre** est allégée dans le HTML : pas de METCON intense. La semaine suivante réaffiche les séances combinées.

### Intégrité de la sauvegarde

12 journaux musculaires (11 validés, 1 non effectué), 4 journées complémentaires (3 réalisées, 1 non effectuée), 387 séries renseignées, 15 bilans de récupération, 9 pesées, 10 références de force, 10 objectifs mensuels, 4 photos J0 et 4 simulations M12. Les 80 séries sans répétitions renseignées restent incomplètes ; aucune répétition, durée ou distance n’a été inventée.

Les anciennes séances déjà en cours et les saisies locales plus récentes ne sont pas écrasées. Les valeurs d’unité incertaine restent consultables ; une confirmation de convention est nécessaire avant réemploi. Les dips et autres mouvements au poids du corps peuvent recevoir une charge additionnelle.

**Confidentialité : l’APK personnalisé et le fichier de restauration contiennent les données et photos de Yanis. Ne pas les diffuser publiquement.** Le JSON et les nouvelles photos personnelles ne sont pas servis par le site de prévisualisation. Pour voir ces données dans l’aperçu web, importer le JSON via Profil → Données.

Voir `AUDIT_RESTAURATION_JSON.md` pour le détail des correspondances et corrections, et `VERIFICATION.md` pour les tests exécutés.

---

## Documentation et historique technique

# JARVIS FITNESS — Yanis & Émilie

Application Android personnelle de coaching et de suivi sportif, avec une interface bleu saphir plus lumineuse et deux profils indépendants.

## Installer sur Android

1. Télécharger **JARVIS-Fitness-Yanis-Emilie.apk** sur le téléphone.
2. Ouvrir le fichier depuis **Mes fichiers → Téléchargements**.
3. Si Android le demande, autoriser temporairement **l’installation d’applications inconnues** pour le gestionnaire de fichiers utilisé. Révoquer ensuite cette autorisation.
4. Installer puis ouvrir **JARVIS Fitness**.
5. Choisir **Yanis** ou **Émilie** dans le sélecteur de profil. Sur écran fermé : ouvrir **Plus**, puis toucher le profil en bas du menu.
6. Vérifier les informations personnelles, le matériel et la date de départ du programme. Les données préremplies d’Émilie proviennent de son HTML ; ce ne sont pas de nouvelles mesures.

**Compatibilité déclarée par le manifeste : Android 8.0 ou ultérieur (API 26+).** Android System WebView doit être à jour. La version livrée est un APK de test signé, pour installation directe ; elle n’est pas publiée sur Google Play.

Avant de désinstaller ou de réinitialiser l’application, exporter une sauvegarde JSON. Android efface normalement les données privées d’une application désinstallée.

## Retrouver mon programme et mes exercices

1. Toucher **Programme** dans la barre du bas (ou à gauche sur le Fold5 déplié).
2. L’onglet **Mon programme** s’ouvre directement.
3. Choisir **Yanis** ou **Émilie**, puis le **mois / la phase**.
4. Toucher **Afficher mes exercices** pour aller à la liste. Les blocs **J1, J2, J3…** reprennent les séances du fichier HTML.
5. Toucher le nom d’un exercice pour sa fiche ou **Démarrer J1/J2…** pour lancer la séance d’origine.

Il n’est pas nécessaire de créer un nouveau programme. **Calendrier** sert à consulter les dates ; **Régler mon calendrier** permet de choisir des jours et un départ, avec confirmation et archivage de l’ancien planning.

**Mon programme** affiche la référence HTML intacte. Le calendrier peut conserver vos réglages ou adaptations précédentes. Le lancement depuis la référence reprend ses prescriptions exactes ; une séance déjà en cours doit être clôturée avant d’en démarrer une autre.

## Les deux programmes source

- **Yanis** correspond au fichier `Transformation_Elite_V2.html`. L’identifiant interne historique `elite` reste utilisé pour assurer la compatibilité des imports.
- **Émilie** correspond au fichier `Emilie_transformation_V7.html`.
- Chaque profil ouvre par défaut son **programme source**, organisé sur 52 semaines : les 12 phases sources et la phase finale sont disponibles.
- Les exercices, prescriptions de séries/répétitions, tempos, repos et notes des phases sont conservés dans `src/data/legacy.json`.
- Les enchaînements source à repos nul sont traités comme des blocs : passage au mouvement suivant, puis repos prescrit à la fin du bloc.
- Une adaptation au temps disponible conserve les séries déjà réalisées et protège les repos des blocs conservés.
- Au lancement d’une séance source, les exercices ne sont plus remplacés automatiquement selon le matériel. Les incompatibilités sont signalées et les refus restent respectés ; toute substitution doit être choisie. Aucune charge n’est transférée entre exercices.
- Les programmes d’origine restent consultables dans **Programme → Mon programme**. Un programme adaptatif distinct reste disponible sur choix explicite.

Les nouveaux relevés, performances, photos, historiques, préférences et messages de Yanis et d’Émilie ne sont pas fusionnés. Il s’agit de deux espaces de données, pas de deux comptes protégés par mot de passe.

## Ce que contient l’application

- Tableau de bord, calendrier modifiable, cycles et programmes source.
- Bibliothèque de 209 variantes/mouvements normalisés ; consignes, variantes, favoris et refus.
- Atlas humain détaillé avec zones musculaires interactives, à visée pédagogique.
- Démonstrations humaines issues des GIF fournis. Lorsqu’une démonstration exacte manque, une vue anatomique et les consignes sont proposées — pas une animation géométrique inventée ni une fausse vidéo exacte.
- Mode séance, enregistrement des séries réellement réalisées, RPE/RIR, enchaînements et repos.
- Estimation 1RM, références de force, recommandations ajustables, historiques et records.
- Cardio, natation, protocoles petit bassin, Aqua HIIT et Tabata.
- Bilans de récupération, respiration, mobilité et étirements.
- Nutrition, propositions de repas et journal des aliments effectivement consommés.
- Mensurations, poids, photos privées, comparaison et objectifs.
- Statistiques, équilibre musculaire, bilans hebdomadaires/mensuels et exports.

### Ce que « AI » signifie ici

Le coach utilise un **moteur de règles local explicable**. Aucun LLM externe n’est connecté. Il comprend notamment la réduction de durée, la fatigue, les séances manquées, les substitutions, la priorité musculaire, le déplacement de séances, la programmation et certaines saisies de performance. Il signale les demandes non reconnues au lieu d’inventer une réponse.

Une charge absente reste inconnue. Une seule série libre ne suffit pas à déclencher une augmentation automatique. Les calculs comparent le même exercice et la même convention de charge.

## Fonctions Android

- Application empaquetée localement : interface, programmes, police et médias sont embarqués.
- Stockage privé Android, avec copie précédente, complété par IndexedDB lorsque disponible.
- Exports via la feuille de partage/enregistrement Android : JSON, sauvegarde HTML lisible et fichier HTML autonome avec données.
- Sélection de fichiers et photos via le sélecteur Android.
- Retour Android intégré à la navigation.
- Retour haptique après validation d’une série, si disponible.
- Dictée via le service vocal Android, après autorisation du microphone ; le texte reconnu reste modifiable avant envoi au coach.
- Annonces via la synthèse vocale Android, si une voix française est installée.
- Redimensionnement autorisé pour le Galaxy Z Fold, sans orientation imposée.

La dictée peut utiliser le service Google/Samsung configuré sur le téléphone et éventuellement son réseau. La préférence hors ligne est demandée, sans garantie que le fournisseur la respecte ou dispose du modèle français. Le moteur de coaching lui-même n’envoie pas les données à un service d’IA.

Les minuteurs utilisent des échéances horodatées et reprennent correctement leur état après réduction/rechargement. **Les annonces et rappels ne sont pas garantis lorsque l’application est fermée ou suspendue par Android** : cette version n’utilise pas de service Android permanent en arrière-plan.

## Sauvegardes et confidentialité

- **Profil → Données & sauvegardes → Exporter la sauvegarde JSON** contient les deux profils. Sur Android, choisir la destination dans la feuille de partage.
- Import possible depuis un JSON JARVIS, un export JSON des anciens programmes ou un HTML reconnu contenant une sauvegarde. Aucun script importé n’est exécuté.
- Une sauvegarde incompatible bloque l’écriture automatique : les originaux ne sont pas écrasés par des valeurs neuves.
- Les historiques présents dans un autre navigateur ne peuvent pas être récupérés depuis le seul HTML du programme. Il faut exporter leurs données depuis ce navigateur.
- L’APK contient les médias des fichiers fournis, dont l’archive photographique source de Yanis. **Ne pas le diffuser publiquement sans vérifier les droits et accords correspondants.** Les images M12 de simulation restent étiquetées et ne sont pas comptées comme des progrès réels.
- Aucune montre ni aucun capteur n’est connecté. Aucun flux de capteur n’est simulé. Aucune synchronisation cloud n’est configurée.

## Vérification

Voir `VERIFICATION.md` et les fichiers de tests. La compilation Android et la signature de l’APK sont vérifiées. Les moteurs et les parcours de l’interface sont testés automatiquement.

**Aucun téléphone physique n’était connecté à l’environnement de développement.** L’installation sur votre Galaxy Z Fold, la voix française, la dictée, le sélecteur de fichiers et les choix de partage Android doivent encore être validés sur votre appareil. Les dimensions d’écran sont testées dans Chromium ; ce n’est pas une certification matérielle Samsung.

L’atlas est une illustration humaine générée à visée pédagogique, pas un modèle biomécanique 3D rotatif ni un outil médical. Les GIF source et l’atlas ne remplacent pas la vérification d’exécution par un professionnel. Interrompre un exercice douloureux ; demander un avis compétent en cas de douleur importante ou persistante.

## Développement

### Architecture

- `src/pages`, `src/components` : interface React, formulaires et vues.
- `src/data` : programmes sources, bibliothèque et consignes.
- `src/engine` : calculs, progression, planification, blocs de séance, récupération, nutrition et coach.
- `src/store` : modèle, validation, migrations, sauvegardes et exports.
- `src/platform` : stockage, partage, retour haptique et interfaces natives Android.
- `android` : projet Android Studio / Capacitor et module vocal Java.
- `tests` : tests unitaires et parcours Playwright.
- `AUDIT_ET_ARCHITECTURE.md` : audit pré-modification des fichiers fournis.

### Prérequis

Node.js 20+, Java 17, Android SDK Platform 34 et Build Tools 34.0.0. Configurer `JAVA_HOME` et `ANDROID_HOME`. Créer `android/local.properties` avec `sdk.dir=...` si Android Studio ne le crée pas.

```sh
npm ci
npm run dev
npm test
npx playwright install chromium
npm run test:e2e  # avec le serveur de développement lancé
npm run android:build
```

L’APK est produit dans `android/app/build/outputs/apk/debug/app-debug.apk`. Les dossiers de dépendances et de compilation ne sont pas inclus dans l’archive source ; `npm run android:sync` régénère aussi les assets Android.

`npm run build:portable` crée le runtime du fichier HTML autonome exportable. Ce runtime ne remplace pas les sources modulaires.

Le shim `scripts/patch-capacitor.cjs` adapte l’import de `tar` du CLI Capacitor 6 à sa version 7 corrigée. Il est exécuté après installation des dépendances. Il ne modifie pas les données utilisateur.

Pour une publication Google Play : utiliser une clé de production conservée en sécurité, une configuration release, adapter le SDK cible aux exigences de publication en vigueur, rédiger les déclarations de confidentialité et effectuer les tests matériels nécessaires. Ne pas remplacer la clé de signature d’une mise à jour installée sans prévoir l’export/réimport des données.

## Mise à jour 1.0.1 — Galaxy Z Fold5 et Galaxy S24

- Galaxy S24 : interface compacte.
- Galaxy Z Fold5 fermé : interface compacte ; déplié : navigation latérale, exercice au centre, minuteur et muscles à droite. Le seuil du mode élargi passe à 600 pixels CSS.
- Quatre tests de formats représentatifs et de changement de taille complètent les huit parcours précédents : **12 parcours d’interface réussis**. Une série enregistrée reste intacte lors du passage fermé → déplié → paysage → fermé.
- Dimensions testées par simulation Chromium ; le zoom One UI et les barres système peuvent modifier la taille utile. Pas de test matériel physique revendiqué.
- Le même APK s’installe sur les deux modèles. Chaque téléphone conserve ses propres données : **pas de synchronisation automatique entre appareils**.
- Signature identique à la version précédente, code de version Android 2 : installer la mise à jour **sans désinstaller** l’application. Une sauvegarde JSON reste recommandée avant toute mise à jour.

## Mise à jour 1.0.2 — bleu plus clair, programme d’origine visible

- Format Fold5 / S24 inchangé ; surfaces bleues éclaircies et boutons plus lumineux.
- Accès direct **Programme → Mon programme**, bouton **Afficher mes exercices**, mois et séances source clairement identifiés.
- Profil et phase mémorisés séparément. Les prescriptions affichées sont lues directement depuis le programme du HTML correspondant.
- Pas de changement automatique d’exercices ou de volume au lancement d’une séance source. Les charges proposées restent issues des performances connues et modifiables.
- Un bilan de récupération seul ne réduit plus le nombre de séries. Une case facultative permet d’autoriser l’adaptation ; les demandes au coach restent à confirmer.
- Les indications d’allégement des phases source restent visibles. Aucun coefficient supplémentaire de réduction des séries n’est imposé à leurs lignes d’origine.
- Les enchaînements avec 0 seconde de repos restent à 0 seconde, y compris dans l’estimation de durée.
- Une séance source non liée à une date planifiée est correctement conservée comme séance libre dans l’historique et le calendrier.
- Données et séances déjà en cours préservées lors de la mise à jour. Les adaptations explicitement choisies restent distinctes de la référence originale.
