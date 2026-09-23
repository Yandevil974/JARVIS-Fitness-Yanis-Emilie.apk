# Livraison actuelle — 1.4.0 (21 septembre 2026)

L’utilisateur a explicitement autorisé une nouvelle installation séparée (« Oui, on y va », puis « Poursuis »). L’APK complet avec l’accueil est signé et vérifié : [livraison et limites](HOME-RELEASE.md), [signature à conserver](../signing/HOME-IDENTITY.md). Les blocages ci-dessous sont historiques. Aucun nouveau blocage de fabrication pour cette identité, mais sa sauvegarde privée externe reste à confirmer. Test physique demandé, IA en pause.

# État de livraison vérifié — 20 septembre 2026

> **Évolution de la décision :** après cet état de blocage, l’utilisateur a explicitement autorisé une nouvelle application séparée. Une identité `app.yanis.fitness.evolution` et une sauvegarde chiffrée ont été créées ; l’étape 7 est reconstruite et le nouvel APK 1.3.0 signé a été validé automatiquement et livré dans `downloads/`. L’installation et les services réels sur téléphone restent à confirmer. [Reconstruction et contrôles](../notifications/README.md) · [Sauvegarde de la nouvelle identité](../signing/NEXT-IDENTITY.md). Le constat ci-dessous reste l’historique de la perte précédente.

L’utilisateur demande désormais un APK à tester **avant l’IA conversationnelle**, contrairement au report initial de toute installation à la fin.

## Disponibilité constatée dans l’environnement actuel

- La connexion GitHub fonctionne à nouveau. La branche de session a été récupérée et avancée sans modification destructive jusqu’au commit distant `23fcb8a3852fbf9575e993e8cd77c4360badf2be` : sources des étapes 1–6 présentes.
- Le commit local d’étape 7 annoncé dans la conversation, `4acc669d86d6d715d14f68b392709a7adcbfb93d`, est absent des objets locaux et non disponible via l’API GitHub. Son envoi avait échoué pour défaut d’authentification.
- Les sources `evolution/notifications/`, le candidat signé `.cache/notifications-native/candidate.apk` et le répertoire privé de signature antérieur ne sont pas présents dans l’environnement retrouvé. Ne pas prétendre pouvoir livrer ce candidat ni réexécuter ses anciens tests sans restauration.
- La dernière livraison publique vérifiée est **Yanis Fitness Evolution 1.2.0, étapes 1–4 seulement**, inchangée : 24 872 409 octets, SHA-256 `3a92b5fda83f68ad205599fb4349aaae776b651c67b414e9b8021b99bdedcc26`.

[Téléchargement direct de la 1.2.0](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/1283a534015e4cbbc57fdc5aa8d0c62c839ee5db/downloads/Yanis-Fitness-Evolution-1.2.0.apk)

Ce lien ne remplace pas la demande d’une version contenant les étapes 1–7. Il permet seulement un test partiel de la version publiée.

## Conditions pour une nouvelle livraison

Restaurer les travaux non publiés de l’étape 7 et la signature permanente depuis leurs sauvegardes, puis reconstruire et vérifier le véritable APK destiné au téléchargement. Ne pas générer une nouvelle clé ou une troisième identité, ne pas renommer l’ancien APK pour le présenter comme une nouvelle version, ne pas publier d’archive de signature. La sauvegarde confidentielle antérieure porte le nom `JARVIS-signature-CONFIDENTIEL.zip` ; sa conservation externe n’a pas été confirmée.

L’IA reste en attente. Les tests et empreintes du candidat cités dans la conversation sont des résultats antérieurs, pas une preuve de disponibilité actuelle du fichier.

## Vérification après recherche de l’utilisateur

L’utilisateur indique ne pas trouver l’archive confidentielle dans ses téléchargements. Cela ne prouve pas qu’aucune sauvegarde externe n’existe ; ne plus présenter sa possession comme acquise.

Nouvelle recherche dans les fichiers accessibles sous `/home/user` (hors objets Git et certaines dépendances) : aucun fichier correspondant aux noms de signature, extensions `.jks`/`.keystore`/`.p12`, candidat APK ou étape 7. L’API Actions de ce dépôt retourne zéro artefact. La liste des secrets GitHub est inaccessible (HTTP 403 « Resource not accessible by integration »), ce qui n’équivaut pas à une liste vide. Aucun accès aux sauvegardes internes d’Arena n’est disponible parmi les outils de cette session.

Prochaine piste de récupération : demander au support Arena si une restauration de la session antérieure est possible, notamment du commit non publié et du répertoire privé de signature. Ne pas garantir cette restauration. Ne pas transmettre de clé ou mot de passe dans un ticket public. Aucune nouvelle identité, migration ou désinstallation n’est autorisée par ce constat.

# Livraison 1.4.1 — 23 septembre 2026 (correction piscine)

Nouvelle clé **autorisée par l’utilisateur le 23 septembre 2026** (« si faut en construire une autre avec une nouvelle clé tu as mon autorisation »). Les certificats existants ne sont ni régénérés ni remplacés : `7d6f9c8f…` (1.4.0) et `4d4fbd84…` (historique) restent intacts. La nouvelle identité porte l’empreinte `d3ca5a27cf9b97f15404b1d1dad5c35abf5ec39e4917d0d30e89078a71782a3d`.

- APK publié : `downloads/Yanis-Fitness-Evolution-1.4.1.apk`, 24 909 281 octets, SHA-256 `c8dff99767923e1a452acffd0484d3e19cc989bacad212ee3cbb47bef01a668d`.
- Base : 1.4.0 (`30b20ce1…`) ; seules entrées modifiées : `AndroidManifest.xml` (versionName 1.4.1, versionCode 12) et `assets/public/assets/index-CBCies4k.js` (paquet web `b74853bc…`, deux réécritures de code livré). 9/9 DEX identiques octet pour octet, 271/272 fichiers web inchangés.
- Signature v2 + v3 vérifiée, alignement vérifié, un seul signataire.
- Sauvegarde privée : `downloads/Yanis-Fitness-Evolution-1.4.1-SAUVEGARDE-PRIVEE.zip` (ignorée par Git, non publiée) et `.private/yanis-fitness-evolution-media/` (droits 700/600). Seule l’empreinte publique est commitée : `evolution/android/identity-media-141.json`.
- Installation : même identifiant d’application, signature différente ⇒ désinstaller la 1.4.0, installer la 1.4.1, restaurer le JSON de sauvegarde. Détail : [INSTALLATION-1.4.1.md](../../downloads/INSTALLATION-1.4.1.md).
- Aucun test sur téléphone réel dans cet environnement ; l’IA conversationnelle reste exclue.

# Livraison 1.4.2 — 23 septembre 2026 (identité durable)

Incident consigné : l’identité 1.4.1 (`d3ca5a27…`) avait été créée avec pour seule sauvegarde un ZIP en clair dans l’espace de travail ; **une réinitialisation de l’environnement l’a détruite** et aucune mise à jour de cette installation n’est possible. Son APK reste publié mais **il ne faut pas l’installer**. Correctif de méthode : l’identité de la lignée média est désormais sauvegardée **chiffrée (AES-256-GCM) dans le dépôt**, `evolution/signing/evolution-media-142.encrypted.json`, restaurable avec la clé de récupération remise à l’utilisateur ; la restauration a été **testée en supprimant réellement les fichiers privés**.

- APK publié : `downloads/Yanis-Fitness-Evolution-1.4.2.apk`, 24 909 281 octets, SHA-256 `6e08516ec3a439bdfc7f68024fcb47feb26bae833fd443b3428251797734ceff`, versionName 1.4.2, versionCode 13.
- Contenu **identique à la 1.4.1** : la seule entrée qui diffère entre les deux APK est `AndroidManifest.xml` (numéro de version). Le paquet web est le bundle revu `b74853bc…`, celui qui a passé 26/26 tests navigateur et 8/8 accueil.
- Identité : `150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b` ; les certificats `7d6f9c8f…` (1.4.0) et `4d4fbd84…` (historique) restent intacts.
- Vérifications : signature v2 + v3, un signataire, alignement, inventaire ZIP inchangé, 9/9 DEX identiques octet pour octet, 271/272 fichiers web inchangés.
- Sauvegarde privée en clair : `downloads/Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` (ignorée par Git) ; à télécharger et conserver hors téléphone.
- Installation : même identifiant d’application, signature différente ⇒ désinstaller la 1.4.0, installer la 1.4.2, restaurer le JSON. Détail : [INSTALLATION-1.4.2.md](../../downloads/INSTALLATION-1.4.2.md).

# Livraison 1.4.3 — 23 septembre 2026 (séance oubliée)

Correctif décidé par l'utilisateur (« fais ce que tu recommande ») après reproduction du blocage d'Émilie. Même identité durable que la 1.4.2 (`150e3846…`) : **la 1.4.3 s'installe par-dessus la 1.4.2 sans désinstallation**.

- `downloads/Yanis-Fitness-Evolution-1.4.3.apk`, 24 909 288 octets, SHA-256 `31e950848b0379830c09e9a4061eab49c812869343050747a0e163944941141c`, versionName 1.4.3 / versionCode 14.
- Base 1.4.0 ; par rapport à la 1.4.2, seules deux entrées changent : `AndroidManifest.xml` (version) et le paquet web (`52dfc705…`). 9/9 DEX identiques, 271/272 fichiers web inchangés, inventaire ZIP inchangé, v2+v3 vérifiées.
- Règle appliquée : une séance de musculation d'un autre jour est clôturée automatiquement en « partielle » (date et séries réelles conservées), au chargement, au clic « Lancer la séance » et au clic d'une minuterie guidée. Compteur de séance en heures au-delà d'une heure.
- Preuves : `evolution/media/tests/emilie-session-block.spec.mjs` (2 tests), `review/REVIEW-EMILIE-BLOCAGE.md`, captures `review/emilie-fixed-*.png`. Suite Node 40/40, média 28/28, suite d'origine 90/90.
- Détail utilisateur : [INSTALLATION-1.4.3.md](../../downloads/INSTALLATION-1.4.3.md). Aucun essai sur appareil réel.
