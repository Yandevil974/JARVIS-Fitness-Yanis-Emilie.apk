# 🚩 Passation — Yanis Fitness Evolution

**Mise à jour : 21 septembre 2026.** Lire ce document avant de poursuivre dans une nouvelle conversation. Les fichiers et commits accessibles sont la source de vérité ; un ancien message annonçant un fichier ne garantit pas sa présence actuelle.

## État actuel — APK 1.4.0 complet fabriqué, signé et vérifié

**Dernière décision :** après explication de l’installation séparée et du transfert JSON, l’utilisateur a choisi **« Oui, on y va »**, puis écrit **« Poursuis »**. Cette nouvelle autorisation a été utilisée pour **une** nouvelle identité. Ne pas la régénérer lors d’une reprise. L’IA générale reste en pause.

### Livrable actuel

- **`downloads/Yanis-Fitness-Evolution-1.4.0.apk`**, 24 905 185 octets : étapes 1–7 et accueil approuvé (orbe bleu tournoyant, clair/sombre colorés, carte photo d’origine).
- SHA-256 **`30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`**.
- Notice : `downloads/INSTALLATION-1.4.0.md`. Rapports : `.fidelity.json`, `.apk.sha256`, `evolution/android/validation-home-release.json`, `evolution/android/HOME-RELEASE.md`.
- Nom exact **Yanis Fitness Evolution**, version **1.4.0 / code 11**, nouveau package **`app.yanis.fitness.evolution.home`**. Installation à côté des anciennes, transfert explicite des données par JSON. Les APK 1.3.0 et antérieurs restent inchangés.
- **90 tests navigateur réussis dans un passage complet sur le web extrait du nouvel APK signé**, 150 tests de logique, 4 tests d’intégrité, 8 tests APK/signature/récupération. Trois builds signés identiques. Signature v2/v3 et alignement vérifiés. Aucun test physique/emulateur, pas de promesse de son/micro/notifications OEM validés sur téléphone.
- 272 fichiers web, 271 inchangés ; **les neuf DEX Android sont identiques octet pour octet à la 1.3.0**. Quatre entrées ZIP changent : manifeste, table de ressources (package), configuration Capacitor et bundle web. Toutes les étapes natives sont conservées.
- Bundle web embarqué SHA **`f80a7e82cbe8d45b7c959541ce384c54f3694582eef14515467dbfef204f9f26`** ; correspond au candidat d’accueil validé `0586fc9c2402f6580eb20c6fd5ee49c735cd6cd257b08bf613bca1dda65ecb94`, avec uniquement `V 1.3.0` remplacé par `V 1.4.0`.

### Nouvelle signature — ne plus perdre la continuité

- Autorisation : `evolution/android/home-authorization.json`.
- Identité immuable : `evolution/android/identity-home.json` ; recette mutable : `release-home.json`, `build-home.py`.
- Certificat **`7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd`**.
- Privé actuellement présent : `.private/yanis-fitness-evolution-home/` (hors Git, jamais servi par HTTP).
- ZIP **`Yanis-Fitness-Evolution-1.4-SAUVEGARDE-PRIVEE.zip`** présenté via le visualiseur pendant la fabrication. Ce ZIP contient les secrets ; **conservation externe non confirmée**. Demander de le conserver en deux endroits privés, sans réclamer le contenu ou un secret dans le chat.
- Copie chiffrée publique : `evolution/signing/evolution-home.encrypted.json`. Récupération documentée dans `evolution/signing/HOME-IDENTITY.md` via `signing-home.py`, **sans initialisation**. Un secret ou le ZIP privé reste indispensable.
- Chaque build signe après une restauration réelle de la sauvegarde chiffrée et vérifie le certificat. La présence d’une copie chiffrée ne remplace pas la conservation du secret.
- Ne pas lancer les anciennes recettes `signing-next.py` / `build.py --new-parallel` pour cette livraison : elles concernent la 1.3.0. Garder les anciennes identités et leurs APK intacts.

### Prochaine étape

Donner le **lien direct de la 1.4.0**, puis installation/import/test sur téléphone pour Yanis et Émilie, sans désinstaller les anciennes applications. La nouvelle installation portera le même nom : appuyer sur Ouvrir après l’installation puis vérifier la version 1.4.0. Accorder à nouveau les permissions et activer explicitement les rappels par profil si souhaité. Éviter les rappels doublons provenant des anciennes installations. Confirmer la conservation de la sauvegarde privée.

L’aperçu navigateur sur 5183 sert le contenu de **l’APK signé** depuis `.cache/home-signed-web/`. Ce n’est pas une installation Android. Les fichiers de cache et outils peuvent disparaître ; les sources, l’APK public, les rapports et la sauvegarde chiffrée sont dans Git. Ne jamais servir la racine du dépôt ni les fichiers privés. Les tests de référence utilisent la 1.3.0 extraite sur 5184.

**IA conversationnelle toujours en pause, prévue seulement après le retour de test demandé.**

## 1. Historique des demandes visuelles — priorité avant toute IA

L’utilisateur demande :

> « Avant de poursuivre préviens moi avec un drapeau rouge la limite du chat et une passation pour un nouveau chat. Peux tu me proposer un accueil de l’appli plus jarvisien, futuriste, et faire remonter. Avant de faire IA conversationnelle, et montre moi tes idées avant que je valide. »

- **IA conversationnelle en pause.** Aucun fournisseur, budget, hébergement ou accord de transfert de données choisi. Le questionnaire précédent a été ignoré ; ne pas déduire un accord cloud.
- **Montrer les idées AVANT validation.** Cet accord a depuis été reçu (« Parfait je valide ») pour la refonte de l’accueil, pas pour l’IA ou une autre identité.
- **Dernier choix explicite : organisation B + style lumineux/orbe A, avec les couleurs de l’application en mode clair.** Une nouvelle maquette a été demandée, pas une intégration. La séance, le point JARVIS et les priorités suivent donc la structure B ; aucune autre remontée de rubrique n’a été précisée.

> « l’organisation de B avec le style lumineux et l’orbe de A.,oui avec les couleurs quil y a sur mon appli en mode claire. Peux tu faire une nouvelle maquette en fonction de ca stp »

- L’utilisateur se perd dans le workspace : **montrer les images directement dans le chat**, pas seulement des chemins ou du code.
- **Dernière correction de l’utilisateur (révision 03) :** garder l’orbe **bleu et tournoyant**, montrer aussi un **sombre qui conserve des couleurs**, et retrouver l’ancienne présentation de « Prochaine séance » **avec l’homme sur la machine**. À ce moment, il s’agissait encore d’une demande de maquettes ; la validation explicite est venue ensuite (voir état actuel).

> « L'orbe de jarvis faudrait qu'il garde le bleu et tournoyant. En sombre faudrait quil garde aussi des couleurs. Peux tu me montrer en maquette. “Prochaine séance” je souhaite le format et la présentation d'avant avec le mec sur la machine. C'était top »

- Prévenir avec **🚩 PASSATION — NOUVEAU CHAT** quand une nouvelle conversation est prudente. Ne pas inventer un pourcentage de contexte restant ou garantir une alerte avant une coupure : aucun compteur exact n’est disponible.

## 2. Références visuelles — révision 03 validée

Dossier isolé : **`design/accueil-jarvis/`**.

**Version actuelle : `design/accueil-jarvis/revision-bleu/`.** Deux maquettes claire/sombre colorée, même orbe bleu quel que soit le profil, rotation CSS réelle avec pause et mouvements réduits. La carte séance reprend la photographie exacte et la hiérarchie d’origine, adaptée au format téléphone : homme sur la machine à droite, textes à gauche, bouton et lien programme. Image extraite de l’APK, identique au `training-hero.jpg` des sources, pas une nouvelle image générée. Les textes restent fictifs.

Les accents orange de Yanis et rose/violet d’Émilie restent dans les cartes/actions ; **l’orbe ne devient plus orange ou rose**. Clair : lavande/menthe pastel. Sombre : violet/vert profond, ambre et cyan, pas noir/gris uniforme. Révision 03 désormais validée et intégrée au candidat web décrit ci-dessus.

Historique des références conservées :

- **A — NEXUS / cockpit JARVIS** : bleu nuit/cyan, orbe technique, présence JARVIS marquée.
- **B — VECTOR / futuriste utile** : graphite/menthe, séance remontée en premier, briefing et priorité lisibles.
- **C — ORBIT / compagnon futuriste** : halo indigo, verre fumé, ambiance plus douce.
- **Nouvelle étude réalisée : B × A en mode clair**, sous `design/accueil-jarvis/clair/`. Orbe compact en regard du bonjour, séance en première carte, point JARVIS lavande, priorité menthe, programme et navigation. Palette relevée dans le CSS embarqué dans l’APK livré : Yanis ivoire/orange/corail et pastels ; Émilie rose/violet. Cette version claire a depuis été corrigée par la révision 03 (orbe bleu animé, carte photo et thème sombre). **Version historique remplacée par la révision 03 validée.** Les trois premières pistes restent conservées comme références.
- Les noms des pistes ne remplacent PAS le nom de l’application : **Yanis Fitness Evolution** reste inchangé.

À consulter en priorité :

- `design/accueil-jarvis/revision-bleu/maquette-claire.png` et `maquette-sombre.png` — images individuelles à afficher dans le chat.
- `design/accueil-jarvis/revision-bleu/comparatif.png` — les deux thèmes côte à côte.
- `design/accueil-jarvis/revision-bleu/orbe-bleu-anime.gif` — aperçu du mouvement (8 secondes, 100 images).
- `design/accueil-jarvis/revision-bleu/index.html` et `README.md` — prototype et documentation/provenance/tests. `serve.py` sert le design seul sur 5182, entrée par cette révision.

Étude claire précédente :

- `design/accueil-jarvis/clair/maquette-yanis.png` — nouvelle proposition principale claire.
- `design/accueil-jarvis/clair/maquette-emilie.png` — même organisation, palette Émilie.
- `design/accueil-jarvis/clair/index.html` — prototype autonome avec changement de profil ; les autres actions restent simulées.

Références initiales :

- `design/accueil-jarvis/propositions-accueil.png` — comparaison des trois propositions.
- `design/accueil-jarvis/proposition-a.png`, `proposition-b.png`, `proposition-c.png` — vues séparées.
- `design/accueil-jarvis/index.html` — étude visuelle consultable dans un navigateur.
- `design/accueil-jarvis/README.md` — intention, règles de hiérarchie et périmètre.

**Données fictives explicitement marquées.** Aucune sauvegarde sportive chargée. Les profils de démonstration changent seulement les textes (et les accents colorés dans la nouvelle étude claire), sans lire ni écrire les données personnelles. Dans le comparatif initial, les profils restent indépendants entre les trois propositions. Les autres boutons montrent un avertissement de maquette : pas de micro, réseau IA, envoi de message, sauvegarde ou lancement de séance.

Vérifications réalisées sur les maquettes seulement : trois concepts, sept largeurs de 320 à 1440 px sans débordement ni contenu recouvert par la navigation, changement de profil isolé, absence d’écriture dans les stockages web, d’appel externe et d’erreur JavaScript. **Ce ne sont pas de nouveaux tests de l’APK.**

Nouvelle étude claire : contrôles réussis pour **les deux profils × sept largeurs (320, 360, 390, 520, 768, 1024, 1440 px)**, palettes distinctes, aucune icône manquante, aucun texte tronqué ni recouvrement par la navigation ; actions inertes, stockages web vides, aucune requête externe ni erreur JavaScript. Deux PNG exportés et inspectés visuellement. Script : `design/accueil-jarvis/clair/render.mjs`.

Révision 03 : contrôles réussis **clair/sombre × Yanis/Émilie × sept largeurs**, photo originale et icônes chargées, pas de texte tronqué ni recouvrement de navigation/pied de carte. Rotation réellement vérifiée, pause/reprise, mouvements réduits, bleu indépendant du profil. Profils isolés, actions inertes, stockages web vides, aucune requête externe ni erreur JavaScript. PNG et GIF exportés et inspectés. SHA de l’APK revérifié inchangé. Scripts dans `revision-bleu/` ; images intermédiaires hors Git sous `.cache/`.

### Suite après validation

La révision 03 a été approuvée par **« Parfait je valide »** et intégrée sous `evolution/home/`. Consulter l’état actuel en tête de document : nouvelle installation séparée explicitement autorisée, APK 1.4.0 signé et contrôlé. Ne plus attendre une validation graphique déjà reçue et ne pas commencer l’IA à la place.

## 3. Livraison précédente 1.3.0 — à conserver, remplacée comme téléchargement principal par la 1.4.0

**Yanis Fitness Evolution 1.3.0**, versionCode 10, étapes 1 à 7 incluses, pas d’IA conversationnelle générale.

- Package : **`app.yanis.fitness.evolution`**.
- Certificat SHA-256 : `4d4fbd84463300631bb19e0186f4efc51c589a2e27da1ab56dc1f1ad5479e7dc`.
- APK : `downloads/Yanis-Fitness-Evolution-1.3.0.apk` ; 24 901 083 octets.
- SHA-256 : **`4c2efeaea0d1d59e9bc329f4b3651e2a860a1416bad900c23a15e0249622a323`**, revérifié pendant cette étude visuelle, APK inchangé.
- Livraison source : **`a62496689dacf7665470f7c65c906bc4f1f86dfa`**.
- Téléchargement direct : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/a62496689dacf7665470f7c65c906bc4f1f86dfa/downloads/Yanis-Fitness-Evolution-1.3.0.apk
- Release de test : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.3.0-evolution
- Notice : `downloads/INSTALLATION-1.3.0.md`.

Cette application séparée a été autorisée expressément après la perte de la signature précédente. Elle s’installe à côté des anciennes. **Ne pas désinstaller ou effacer les anciennes applications.** Exporter le JSON depuis celle qui contient les données récentes, importer dans la 1.3.0, vérifier Yanis ET Émilie et la conservation après fermeture/réouverture.

**Aucun retour de test sur téléphone n’a été fourni.** Ne pas présenter installation, acoustique, notifications/Doze/OEM/redémarrage comme validés sur appareil.

### Historique des contrôles de livraison, pas relancés pour ces maquettes

176 tests JS ; 86 parcours navigateur sur un même APK signé (78 lors du passage complet + 8 après correction des doubles/sélecteurs de test, sans changement de code applicatif) ; 25 scénarios natifs de notifications et 20 de voix avec services simulés, également après conversion du DEX final. Huit tests du nouvel APK, neuf contrôles publics historiques, treize tests de signature/récupération, cinq tests de ressources. L’ancienne archive privée absente a un test distinct explicitement ignoré. Trois builds signés identiques. Les détails sont dans `evolution/notifications/README.md`.

## 4. Historique de la signature 1.3.0 — nouvelle identité 1.4.0 décrite en tête

**Constat du 21 septembre :** le workspace a été retrouvé au commit initial `98291d5`. Les sources ont été récupérées depuis la branche distante par fetch et avance rapide, sans changer de branche ni écraser de modifications. Le dossier privé de la nouvelle signature **n’est pas présent dans cet environnement retrouvé**. Cela n’efface pas l’APK déjà publié ni les sources de l’étape 7 reconstruites et poussées.

- Identité publique immuable : `evolution/android/identity-next.json`.
- Livraison actuelle : `evolution/android/release-next.json`.
- Sauvegarde **chiffrée** conservée dans Git : `evolution/signing/evolution-next.encrypted.json` (AES-256-GCM).
- Archive privée remise dans la conversation précédente : **`Yanis-Fitness-Evolution-SAUVEGARDE-PRIVEE.zip`**. Elle contient le keystore, son mot de passe et `recovery-key.txt`. **Sa conservation externe n’a pas été confirmée.**
- La copie chiffrée ne peut pas être restaurée sans le secret. Ne pas affirmer le contraire et ne pas annoncer un futur APK signé tant que ce point n’est pas résolu.
- Restaurer depuis une copie privée selon `evolution/signing/NEXT-IDENTITY.md` et `evolution/android/signing-next.py`, vérifier le certificat attendu. Ne demander aucun secret en texte dans le chat, ne rien publier en clair et ne jamais servir `.private` par HTTP.
- **Ne jamais régénérer une clé, contourner les protections ou créer une autre application sans un nouvel accord explicite.** L’autorisation antérieure a déjà été utilisée pour la 1.3.0 ; elle n’autorise pas une succession d’identités.
- Les anciens `identity.json`/`release.json` concernent la 1.2.0. Ne pas les substituer à `identity-next.json`/`release-next.json`.

Les maquettes visuelles n’ont pas besoin de cette clé ; leur réalisation ne justifie ni nouveau keystore ni nouveau build.

## 5. Sources et exigences de conservation

Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.

Branche contenant les travaux : **`arena/01a0bd57-jarvis-fitness-yanis-emilie-ap`**. Dans une nouvelle session, respecter la branche imposée par Arena : consulter/récupérer ces commits sans changer arbitrairement de branche, sans reset destructif, sans travailler directement sur `main`. Vérifier l’état Git avant toute action.

- APK complet fourni : référence épinglée par `complete-hotfix/manifest.json`. Les extensions cumulatives sont dans `evolution/`.
- **Ne pas reconstruire l’application complète uniquement depuis les anciennes sources `JARVIS-Fitness-Source/`**, moins complètes. Elles servent aux outils/tests et au plugin vocal.
- Étapes présentes : `reminders`, `voice`, `spokesperson`, `appointments`, `adaptation`, `decisions`, `notifications`.
- Une consultation n’est pas une confirmation ; aucune adaptation ou saisie de bilan automatique.
- Poids ≠ mensurations ; pas de données de progression ou de récupération inventées.
- Profils et historiques séparés, brouillons préservés ; annulation des callbacks vocaux tardifs et priorité du chrono.
- Pas de faux état « micro actif », « capteur connecté », « IA en ligne » ni de score médical fictif dans la future interface.
- Garder les alertes de sécurité/stockage et les séances/chronos en cours prioritaires, même si un orbe est ajouté.
- Annoncer la prochaine étape après chaque étape terminée. **IA générale en dernier**.

## 6. Message court à coller dans un nouveau chat

> Reprends Yanis Fitness Evolution dans `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Lis `PASSATION.md` sur la branche de travaux `arena/01a0bd57-jarvis-fitness-yanis-emilie-ap` en respectant la branche imposée à ta session. J’ai validé l’accueil puis autorisé explicitement une nouvelle installation complète (« Oui, on y va », puis « Poursuis »). L’APK 1.4.0 inclut les étapes 1–7 et l’orbe bleu animé, les modes clair/sombre colorés et la carte avec l’homme sur la machine. Il est signé, sous `downloads/`, avec 90 tests navigateur sur le web du nouvel APK, 150 tests de logique et contrôles d’intégrité/signature réussis. Prochaine étape : mon installation/import/test sur téléphone et conservation du ZIP privé. Ne recrée pas de clé : l’identité est `identity-home.json`, package `app.yanis.fitness.evolution.home`, récupération dans `evolution/signing/HOME-IDENTITY.md`. Les anciennes applications restent intactes. L’IA reste en pause. Préviens-moi avec 🚩 lorsqu’une passation devient prudente, sans inventer une limite exacte du chat.

Si une validation ou des corrections sont données après cette passation, mettre à jour ce document avec les mots exacts de l’utilisateur et les éventuelles réserves avant de démarrer l’intégration.
