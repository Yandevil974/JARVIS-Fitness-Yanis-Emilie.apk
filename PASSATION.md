# 🚩 Passation — Yanis Fitness Evolution

**Mise à jour : 21 septembre 2026.** Lire ce document avant de poursuivre dans une nouvelle conversation. Les fichiers et commits accessibles sont la source de vérité ; un ancien message annonçant un fichier ne garantit pas sa présence actuelle.

## État actuel — validation reçue et accueil intégré au candidat web

**Dernière réponse de l’utilisateur : « Parfait je valide ».** Il valide la révision 03 (orbe bleu tournoyant, clair/sombre coloré, ancienne carte photo). L’intégration de l’accueil est désormais autorisée. Ne pas lui redemander de valider les mêmes maquettes. Cela n’autorise ni l’IA ni une nouvelle identité Android.

**Travail réalisé : `evolution/home/`.** Le web du véritable APK 1.3.0 est étendu, pas remplacé par les anciennes sources React. Orbe bleu avec pause/mouvements réduits, carte d’origine déplacée en premier avec ses callbacks inchangés, thèmes colorés et contrôles reliés aux vrais profils. Les sept étapes et toutes les sections restent disponibles ; les formulaires complets peuvent être plus longs que dans une capture de maquette.

- `evolution/home/README.md` : périmètre, reproduction, limites, prochaine étape.
- `evolution/home/baseline.json`, `build.mjs`, `Home.jsx`, `home.css` : entrée 1.3.0 épinglée et intégration.
- `evolution/home/validation.json` : **4 tests Node + 90 tests navigateur réussis**, les 90 dans un passage complet, aucun échec/ignoré. Deux profils/deux thèmes, six largeurs ; conservation des 11 rubriques et onglets à 1440 px pour les deux profils ; parcours mobiles, chronos, voix, bilans, décisions et notifications simulées.
- Bundle candidat SHA-256 : **`0586fc9c2402f6580eb20c6fd5ee49c735cd6cd257b08bf613bca1dda65ecb94`**.
- Inventaire : 272 fichiers web, 271 inchangés ; seules `t2` (composition accueil) et `I3` (raccourcis mobiles de l’accueil) changent parmi les déclarations existantes. Moteurs et observateurs des sept étapes identiques.
- Candidat temporaire `.cache/home-web/` servi sur **5183** ; reconstruire avec `node evolution/home/build.mjs` si le cache disparaît. La référence web pour tests est l’APK livré extrait sous `.cache/home-reference/` sur 5184. Ne jamais servir la racine ou des données privées.
- **Aucun nouvel APK produit. L’APK 1.3.0 publié est inchangé et n’inclut PAS la refonte.** Aucun test physique, aucune nouvelle validation native. Le navigateur est une origine distincte du téléphone ; ne pas importer de sauvegarde sensible dans un aperçu partagé.

### Prochaine étape et blocage

La prochaine étape est la livraison Android, **bloquée par la signature actuelle absente**. Restaurer le matériel privé autorisé, vérifier le certificat, puis préparer une recette de mise à jour intégrant le candidat web validé avec un versionCode augmenté et les contrôles d’inventaire/signature. `evolution/android/build.py --new-parallel` / `release-next.json` restent les recettes de **l’ancienne livraison 1.3.0** ; ne pas les lancer en croyant qu’elles emballent déjà la refonte. Ne pas remplacer un téléchargement par un ancien APK renommé, ni recréer une identité sans accord. Ne pas redemander à l’utilisateur de fouiller une archive déjà déclarée introuvable. Pas de secret dans le chat.

**IA conversationnelle toujours en pause.** Annoncer clairement qu’il s’agit d’un candidat web vérifié, pas d’une mise à jour Android installable livrée.

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

La révision 03 a été approuvée par **« Parfait je valide »** et intégrée sous `evolution/home/`. Consulter l’état actuel en tête de document : tests web terminés, livraison Android bloquée par la signature. Ne plus attendre une validation graphique déjà reçue et ne pas commencer l’IA à la place.

## 3. Application existante livrée — à conserver

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

## 4. Signature — point de vigilance pour un futur APK

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

> Reprends Yanis Fitness Evolution dans `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Lis `PASSATION.md` sur la branche de travaux `arena/01a0bd57-jarvis-fitness-yanis-emilie-ap` en respectant la branche imposée à ta session. J’ai validé par « Parfait je valide » l’organisation B, l’orbe bleu tournoyant, les modes clair/sombre colorés et l’ancienne carte séance avec l’homme sur la machine. L’intégration fonctionnelle est dans `evolution/home/` : 4 tests d’intégrité et 90 tests navigateur réussis, les sept étapes conservées. Aucun nouvel APK n’a été livré ; la 1.3.0 reste inchangée. Prochaine étape : récupération de la signature existante puis recette de mise à jour et validation de l’APK réel. Ne recrée pas de clé/application et ne me redemande pas de fouiller l’archive introuvable. L’IA reste en pause. Conserve les fonctions, les deux profils, les données et l’identité. Préviens-moi avec 🚩 lorsqu’une passation devient prudente, sans inventer une limite exacte du chat.

Si une validation ou des corrections sont données après cette passation, mettre à jour ce document avec les mots exacts de l’utilisateur et les éventuelles réserves avant de démarrer l’intégration.
