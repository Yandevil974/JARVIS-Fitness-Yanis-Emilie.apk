# 🚩 Passation — Yanis Fitness Evolution

**Mise à jour : 23 septembre 2026.** Lire ce document avant de poursuivre dans une nouvelle conversation. Les fichiers et commits accessibles sont la source de vérité ; un ancien message annonçant un fichier ne garantit pas sa présence actuelle.

## Dernière avancée — sauvegarde privée 1.4.2 récupérable + blocage d'Émilie reproduit (23 septembre 2026)

- **Sauvegarde privée** : `downloads/Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` (4 873 octets, SHA-256 `59323c9a048cc04fce831e8b2bc480a06cf3d75e7201e810efc80d58902067e0`) contient `.p12`, mot de passe, `identity.json`, `recovery-key.txt` et `A-LIRE.txt`. **Ne jamais publier ce ZIP sur GitHub** : il est en clair, et un commit est irréversible (le blob reste dans l'historique). Livré ici par lien local/aperçu et par la clé de récupération donnée dans la conversation.
- **Chemin de récupération durable, reprouvé aujourd'hui** : la copie **chiffrée** `evolution/signing/evolution-media-142.encrypted.json` (publique, commit `c17dccf`) + `recovery-key.txt` reconstruisent l'identité privée. Test réel : matériel privé déplacé, puis `python3 evolution/android/signing-media.py restore --recovery-key-file …` → **tous les fichiers reconstruits identiques octet pour octet**, certificat `150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b`. Le ZIP lui-même a été reconstruit à l'identique. Un espace de travail effacé ne peut donc plus faire perdre cette identité.
- **Blocage d'Émilie reproduit, pas déduit** (`review/REVIEW-EMILIE-BLOCAGE.md`, preuves `review/emilie-block-w5-*.png`, `w9-accueil.png`, spec `evolution/media/tests/emilie-session-block.spec.mjs`) : une séance de musculation **commencée et jamais clôturée** reste en mémoire. Semaines suivantes, l'accueil annonce « Reprendre ma séance », rouvre **la séance de la semaine 1 avec sa série déjà validée** (1/29 séries, compteur 40320:00), l'échauffement reste « Avant de commencer », la vue « Cette semaine » ne contient **aucun** « Validé »/« Terminée » — et **la minuterie est refusée** : « Lancer 30 secondes » ouvre la modale « Clôturer votre séance ». Tant que cette séance dort, ni le programme du jour ni le chronomètre ne démarrent. **Défaut hérité** : le mécanisme est identique dans les bundles 1.0.6, 1.3.0 et 1.4.0 publiés. **Rien n'est corrigé** : la proposition (clôturer automatiquement en « partielle » au changement de jour, ou demander explicitement) attend l'accord de l'utilisateur.
- **Tests** : `node --test` **39/39 vert** ; le nouveau test de traçabilité interdit de fermer ce groupe sans décision. `review/findings.json` : **48 groupes ouverts**.
- `review/emilie-block-*` conserve les captures ; les suites navigateur média/accueil n'ont pas été relancées (Chromium réinstallé, serveurs :5186/:5187 relancés pour la reproduction).

### Prochaine étape précise

1. **Décision utilisateur sur le blocage d'Émilie** : clôture automatique « partielle » au changement de jour (recommandé) ou choix explicite à l'ouverture. Dès l'accord, implémenter dans `candidate/build.mjs`, reconstruire, faire tomber le compteur 40320:00, puis reconstruire un APK (l'identité 1.4.2 est récupérable, donc possible). 2. Vérifier auprès d'Émilie si sa séance des premières semaines est **encore** proposée en « Reprendre ma séance » : si oui, le correctif est nécessaire ; si elle l'a clôturée, chercher la seconde cause. 3. Reprendre l'audit visuel : règle de style puis **48 groupes ouverts**, sans en fermer un seul silencieusement. **IA conversationnelle en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Dernière avancée — APK 1.4.2 publié avec une identité durable (23 septembre 2026)

**État : l'application corrigée est téléchargeable, et son identité de signature ne peut plus être perdue.** Un troisième effacement de l'espace de travail a eu lieu entre deux messages : il a détruit `.cache/`, `.private/` et **la sauvegarde de la clé 1.4.1**. Le dépôt Git, lui, a tout conservé. Deux conséquences, traitées dans cette étape.

[Télécharger la 1.4.2](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/Yanis-Fitness-Evolution-1.4.2.apk) · [consignes](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/INSTALLATION-1.4.2.md) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/Yanis-Fitness-Evolution-1.4.2.apk.sha256) · [fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/c17dccf/downloads/Yanis-Fitness-Evolution-1.4.2.fidelity.json)

- **Incident consigné, pas caché** : la 1.4.1 (`d3ca5a27…`) était signée avec une clé dont la seule sauvegarde était un ZIP en clair dans l'espace de travail. Cet espace est réinitialisé régulièrement : la clé est **détruite**, aucune mise à jour de cette installation n'est possible. Son APK reste publié mais **il ne faut pas l'installer**. C'est une faute de méthode, corrigée ci-dessous.
- **Méthode corrigée et éprouvée** : la nouvelle identité `150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b` est sauvegardée **chiffrée (AES-256-GCM) dans le dépôt public** — `evolution/signing/evolution-media-142.encrypted.json` — et la clé de récupération reste privée, chez l'utilisateur. La restauration a été **réellement testée** : fichiers privés supprimés, puis reconstruits depuis le seul fichier chiffré du dépôt, avec un contrôle qui **signe et vérifie** avec la clé restaurée (`evolution/android/signing-media.py`). C'est la convention déjà utilisée pour l'identité 1.4.0 ; elle est désormais appliquée à la lignée média.
- **APK publié** : `downloads/Yanis-Fitness-Evolution-1.4.2.apk`, 24 909 281 octets, SHA-256 `6e08516ec3a439bdfc7f68024fcb47feb26bae833fd443b3428251797734ceff`, versionName 1.4.2 / versionCode 13. **Contenu identique à la 1.4.1** : la seule entrée qui diffère entre les deux APK est `AndroidManifest.xml` (le numéro de version). Le paquet web est bien `b74853bc…`, celui validé en navigateur.
- **Fidélité et signature revérifiées** : 9/9 DEX identiques octet pour octet, 271/272 fichiers web inchangés, inventaire ZIP inchangé, signature **v2 + v3**, un signataire, alignement vérifié. L'APK a été **retéléchargé depuis GitHub après publication** et comparé octet pour octet : mêmes octets, même empreinte, `apksigner` y retrouve *Verifies* et le certificat `150e3846…`.
- **Les certificats existants sont intacts** : `7d6f9c8f…` (1.4.0) et `4d4fbd84…` (historique) ne sont ni régénérés ni remplacés. Seule une nouvelle identité a été créée, comme autorisé le 23 septembre.
- **Sauvegarde privée à récupérer maintenant** : `downloads/Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` (`.p12`, mot de passe, `recovery-key.txt`, mode d'emploi). Il est **ignoré par Git**. Sans lui, la copie chiffrée du dépôt reste inutilisable ; avec lui, tout l'espace de travail peut être reconstruit.
- **Suites sur cet environnement neuf** : `node --test` **38/38 vert**, bundle candidat reconstruit à l'identique (`b74853bc…`, reproductible depuis l'APK 1.4.0), `apksigner.jar` reconstruit à l'empreinte épinglée `ef494179…`. Les suites navigateur n'ont pas été relancées sur cet environnement (Chromium à réinstaller) ; elles portaient sur **exactement le même paquet web**, ce qui est vérifiable par empreinte et non par affirmation.
- **Audit visuel inchangé** : 94/94 dessins relus au moins une fois, aucun validé définitivement, **47 groupes ouverts**.

### Prochaine étape précise

Deux choses en parallèle. **(1) Côté utilisateur** : télécharger la 1.4.2, puis tester sur le téléphone — exporter le JSON dans la 1.4.0, désinstaller, installer, restaurer, et vérifier les blocs **piscine après musculation** ainsi que la conservation des charges et de l'historique. **(2) Côté audit** : reprendre les visuels — décider la **règle de style** avant toute nouvelle illustration, puis traiter les **47 groupes ouverts** sans en fermer un seul silencieusement : écarts de matériel (curl debout pour banc Scott, mollets debout pour presse à mollets, développé debout pour nuque/un bras, relevé suspendu pour relevé incliné, élévation latérale debout pour variantes assises/inclinées), approches d'échauffement restantes, affichage hérité des durées en secondes dans la modale, et les 79 alias de noms proches pas encore examinés un par un. Maintenir les bonnes animations, la récupération aquatique, les 209 exercices, les 11 rubriques, les deux profils, les étapes 1–7 et l'accueil validé. **IA conversationnelle en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Étape précédente — récupération piscine corrigée et carte d'alias livrée mise au jour

**23 septembre 2026 — toujours un candidat web, pas une nouvelle livraison APK.** SHA courant : `b74853bca4761ccb0f36a4f4612ed4e69b82f42b392dbf1cb7dfd7f6d047e373`. Il remplace `aba4c373…`, `8badf3aa…` et `5c041fb8…`. Les deux réassociations, l'échauffement ciblé et la protection piscine précédents sont conservés.

- **Le défaut piscine est reprouvé sur la 1.4.0 publiée**, pas seulement décrit : le web extrait de l'APK signé est servi localement et les mêmes tests y donnent **3 échecs / 4**. Un bloc « Piscine après musculation » y affiche la récupération **vélo/elliptique** pour deux prescriptions, et **aucune vignette** pour « 25 min de piscine à allure soutenue ». Le test `tests/pool-recovery.test.mjs` évalue la fonction `bg` **exacte du bundle signé**. Captures : `review/pool-defect-published-1.4.0-{30min,25min}.png`.
- **Trois verrous corrigés, un par couche fautive** : (1) l'aperçu de séance combinée passe désormais **le format du bloc** au résolveur, pas le segment hérité de l'import HTML (`G4` → `JarvisStepGuide`) ; (2) la **liste des étapes** suit le même segment — sans cela les étapes étiquetées `pool` n'étaient jamais affichées ; (3) le **chrono** (`Mg`) donne le segment `pool` aux étapes d'un composant déclaré `format:"pool"`, donc le contexte aquatique est appelé. Le contexte aquatique traite aussi un segment dont la clé de composant est déclarée pool. Le vrai bloc elliptique terrestre garde son guide sec.
- **12 textes piscine réellement livrés revus** (`candidate/pool-texts.json`) : 4 « Marche aquatique », 3 exacts + 4 représentatifs « Nage douce », 1 « Fractionné — nager ». Ordre de résolution : **texte revu** → mot-clé historique (conservé mais **non validé**) → **lacune explicite**. Jamais de repli cardio, jamais de photo générique, jamais l'image persistée d'une étape. Portée mesurée : `cardio.apres==="piscine"` = 26 occurrences, 12 textes uniques.
- **Vérifiable en images** : 12 captures candidat / 1.4.0 publiée (fiche **et** chrono), `review/pool-candidate-*.png` et `pool-reference-1.4.0-*.png`, script reproductible `candidate/capture-pool-review.mjs`. La fiche et le chrono montrent la même étape aquatique.
- **Carte d'alias livrée extraite** : **114 des 209 exercices n'ont aucun dessin propre** ; le bundle les résout par une carte d'alias (104 entrées) puis par similarité de nom. Résolution livrée : 95 exacts / 104 « variante » / 10 « famille », dont **25 alias sans aucune relation de nom**. Registre `review/alias-substitutions.json` (triage mot-à-mot, jamais une décision), rapport `review/REVIEW-ALIASES.md`.
- **Les 25 alias sans relation de nom sont revus un par un** (`review/alias-review.json`) : 19 écarts, 1 variante inversée (fente bulgare pied avant/arrière), 1 ambiguïté de libellé (« barre au front (pushdown triceps) »), 1 cas proche mais distinct (good morning), **2 refus de remplacement** (step-up), 1 corrigé par la réassociation revue. **Aucun groupe fermé.**
- **Fait lourd** : **16 des 17 dessins cibles sont déjà le visuel propre d'un autre exercice** — l'application montre le dessin d'un autre (pullovers → « Tirage vertical », ab wheel → « Jackknife sur swiss ball », wood chop → « Crunch à la poulie », clamshell → « Abduction assise machine », glute ham raise → « Leg curl allongé »). Groupe ouvert `resolution-by-another-exercise-drawing`.
- **Refus explicite** : le seul vrai dessin de step-up livré tient **deux haltères** alors que les deux prescriptions sont déclarées **au poids du corps** : il n'est pas substitué, **aucune consigne n'est réécrite**. Preuves `review/alias-stepup-candidate-12frames.png`, `review/alias-elastic-*.png` (12 images chacune), `review/alias-decisions-25-pass2.png`.
- **5 dessins cibles relus ici** (10 images, `review/alias-target-frames.json`) ; il reste **35 des 94 dessins livrés jamais relus** — groupe ouvert `thirtyfive-drawings-never-reviewed`. Aucune revendication « tous les exercices ont leur visuel ».
- **Familles de dessins relevées avant toute nouvelle illustration** (`review/illustration-survey.json`, `review/REVIEW-ILLUSTRATIONS.md`) : 71 dessins anatomiques filaires et 23 illustrations réalistes coexistent déjà, plus 3 photos cardio, 10 photos aquatiques et 30 photos étirements/échauffement. Ajouter un dessin créerait une **sixième famille** : décision de style à prendre explicitement.
- **Tests** : **37 tests Node PASS** (10 caractérisations/APK, 21 candidat, 6 traçabilité) ; **26 parcours navigateur ciblés PASS (3,5 min)** dont 3 blocs piscine après musculation et 1 bloc elliptique terrestre ; **8 accueil/11 rubriques PASS (57,9 s)** en comparaison stricte avec le web 1.4.0. Ni les 90 tests complets ni Android physique relancés.
- **Nouveau constat consigné, non corrigé** : les lignes d'étape de la modale combinée affichent la durée brute en secondes (« 1500 s ») — affichage hérité, identique en 1.4.0. **41 groupes ouverts**, aucun exercice promu automatiquement.
- **Intégrité** : 271/272 fichiers web identiques (seul `assets/public/assets/index-CBCies4k.js`), APK livré intact, **aucune image, identité ou signature ajoutée**, aucune migration de données, aucune prescription réécrite. Registres : `candidate/validation.json`, rapports `review/REVIEW-POOL.md`, `review/REVIEW-ALIASES.md`, `review/REVIEW-ILLUSTRATIONS.md`.
- **Note de continuité** : l'espace de travail de cette session a été recréé ; l'audit a été restauré depuis la branche `arena/01a0bd57-jarvis-fitness-yanis-emilie-ap` et poussé sur la branche de session (`cbe07b2`), puis complété. Les fichiers versionnés sont la source de vérité ; les caches régénérables (`.cache/`) sont reconstruits à la demande.

### Prochaine étape précise

Poursuivre la revue **dessin par dessin des 35 GIF jamais relus** (matériel, position, boucle), en priorité ceux qui servent de cible d'alias ; puis les dessins corrects pour **dips/triceps/fessiers** ; puis les étapes d'échauffement et approches restantes. Les 25 alias sans relation de nom sont revus individuellement : ne pas les rouvrir sans nouvelle preuve et **ne fermer aucun groupe** — les visuels manquants doivent être créés puis vérifiés, et la **règle de style** (ligne anatomique filaire ou illustration réaliste) doit être validée avant toute nouvelle image. Pour les anciennes approches sans identité, prévoir un traitement explicite des lacunes : **pas de remplacement depuis une séance qui aurait changé**. Maintenir les bonnes animations, la récupération aquatique, les 209 exercices, les 11 rubriques, les deux profils, les étapes 1–7 et l'accueil validé. **IA en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Étape précédente — pont au sol précis et échauffement ciblé (historique)

**23 septembre 2026 — toujours un candidat web, pas une nouvelle livraison APK.** Les deux réassociations précédentes et la protection piscine sont conservées. SHA courant : `5c041fb8d73a40bf0df0bbec64619ba5b54cc2682b85a0cb123ddcb43f8234c6`.

- **Fiche du pont au sol** : les trois phases décrivent maintenant les épaules au sol, les pieds à plat, la montée sans cambrure et les **2 secondes de contraction déjà prescrites**. Même précision par défaut en séance. Les notes/tips explicites du programme restent prioritaires. Le catalogue (2 × 15, tempo 2012, repos 45 s), la note source, respiration/erreurs et toutes les autres variantes restent inchangés : pas de changement global de `Yu.bridge`.
- **Activation fessiers d’échauffement** : bon GIF au sol en fiche et chrono. Les **10 répétitions / 60 s propres à cette phase** ne sont pas transformées en prescription de séance. Une ancienne étape sauvegardée est corrigée uniquement si contexte, nom, pattern, durée et consigne correspondent exactement ; l’ancienne image reste dans le stockage, aucune migration.
- **Approches des deux IDs déjà revus** (pont au sol et French press EZ) : bon visuel en fiche, chrono et zoom. Les nouvelles étapes conservent leur `exerciseId` / `mediaRole` via **les deux boutons de lancement**. Aucun changement de charge, pourcentage, arrondi, répétition ou durée. La validation finale du chrono marque toujours l’échauffement effectué et retire le chrono comme auparavant.
- **Limites** : mobilité hanches/chevilles, activation scapulaire et panneau général d’échauffement encore à traiter. Les **207 autres approches conservent leur visuel antérieur** ; les anciennes approches sans identité ne sont pas déduites de la séance actuelle. Le libellé générique « charge légère à choisir » existe encore pour le poids du corps. Ne pas annoncer tous les échauffements corrigés. **41 groupes ouverts** à la date de la dernière avancée, dips et autres variantes non résolus, aucun exercice accepté automatiquement comme définitivement validé.
- **32 tests Node PASS**, dont comparaison des 209 générateurs d’échauffement sur **1 254 combinaisons** charge/incrément ; **20 parcours navigateur ciblés PASS (3,2 min)** et **8 accueil/11 rubriques PASS (57,6 s)**. Deux profils, nouveaux et anciens chronos, zoom/rechargement, achèvement et conservation des données. Ni les 90 tests complets ni Android physique relancés.
- **271/272 fichiers web identiques** et APK livré intact ; aucune nouvelle image d’exercice, signature ou identité. Neuf fonctions ciblées autorisées par AST (`bg/v5/Kh/Z5/k5/Bg/a5/$5/j5`) et helpers ; tout le reste est identique. Seules les **deux réassociations** existantes et une **précision technique par ID** sont actives. Le dossier privé de signature reste absent : aucun nouvel APK possible dans cette étape sans restaurer l’identité existante.
- Harnais de tests : dépendance VM `lt.elite.PATTERN_INFO` extraite du véritable bundle ; sélection de vignette par classe, son nom accessible étant l’alt de l’image et non « Agrandir ». Une collecte parallèle a rencontré un ENOENT de dossier temporaire : **lancer les suites média puis accueil séquentiellement**. Le passage final est entièrement vert ; pas de contournement applicatif. Conserver `MEDIA_REVIEW_CANDIDATE=1` pour l’unique différence autorisée de libellé bibliothèque du pont.
- Captures réelles affichées/examinées et sauvegardées : `review/floor-bridge-technique-candidate.jpg`, `review/warmup-bridge-candidate.jpg`. Rapport : `review/REVIEW-WARMUP.md`. Métadonnées techniques : `candidate/technique-overrides.json`, helper `candidate/warmup-context.mjs`, tests `tests/warmup-candidate.*` et `candidate/validation.json`, sous `evolution/media/`.

### Prochaine étape précise

Continuer les dessins corrects pour dips/triceps/fessiers, puis couvrir les étapes d’échauffement et approches restantes. Pour les anciennes approches sans identité, prévoir un traitement explicite des lacunes : **pas de remplacement depuis une séance qui aurait changé**. Maintenir les bonnes animations, la récupération aquatique, les 209 exercices, les 11 rubriques, les deux profils, les étapes 1–7 et l’accueil validé. **IA en dernier ; actualiser ET présenter cette passation à chaque étape, ici dans le même chat.** Aucun changement de chat imposé ; avertir avec 🚩 avant la limite.

## Étape précédente — French press, bibliothèque et repos (historique)

**Continuer ici avec le même assistant ; actualiser ET présenter cette passation à chaque étape.** Préserver toute l’application validée, aucune refonte, aucune suppression de fonction, IA conversationnelle en dernier.

- **13 GIF courts / 26 images relus**, sur cinq planches, plus deux vignettes originales affichées/examinées. Registre `evolution/media/review/short-focus.json` ; rapport et comparaison `review/REVIEW-SHORT-FOCUS.md`, `review/french-press-comparison.jpg`. C’est une relecture ciblée parmi les 48 GIF courts, pas 13 nouveaux médias. Les 46 GIF longs/588 images restent tracés séparément : ne pas recommencer ce lot sans raison.
- **Deux réassociations cumulatives seulement** dans `candidate/association-overrides.json` : pont au sol → `/media/8eecb0152081ff26.gif` ; **French press barre EZ** → `/media/ea226c444f72de0f.gif` à la place de la poulie. Pour le French press, les deux positions et le conseil original embarqué « Coudes fixes, barre vers le front » ont été vérifiés. Ce dessin couché avec barre EZ existait déjà. Aucune photo ou nouvelle image ajoutée, aucun miroir/retournement, aucune définition/prescription modifiée. **207 autres résolutions identiques**, y compris la vraie variante poulie ; les haltères/pullover/California press ne sont pas remplacés arbitrairement par une barre EZ.
- **Bibliothèque corrigée pour ces deux identifiants** : vignettes WebP d’origine, copie de présentation immuable. Le pont affiche maintenant « GUIDE HUMAIN », pas l’ancienne anatomie générique. **Aperçu « ENSUITE » du repos et zoom** alignés aussi. Fiches, animation/pause, séance sauvegardée, aperçu/zoom et rechargement testés dans les deux profils. Aucune réécriture des charges, séances, historiques ou chronos.
- **Limites à garder visibles :** le French press est un GIF à deux positions clés, pas une vidéo continue ; pas de certification clinique. Les consignes génériques du pont mentionnent encore banc/sol et charge. Les échauffements/approches et `step.img` des autres chronos guidés restent à traiter. Le test du repos concerne la séance sauvegardée et son aperçu, PAS tous les minuteurs guidés. Dips toujours fautifs, proposition photo toujours non approuvée. **41 groupes ouverts** (dernier état), aucun exercice promu automatiquement en acceptation finale.
- **26 tests Node PASS** (9 caractérisations, 11 candidat, 6 traçabilité). **14 tests navigateur ciblés PASS en 2,1 min**, puis **8 accueil/11 rubriques PASS en 57,9 s** sur le même candidat. Rapport `candidate/validation.json`. Pas de reprise des 90 tests complets ni d’essai Android physique.
- Les nouveaux tests ont nécessité des corrections de fixtures, pas de contournement applicatif : convention `kg` remplacée par les conventions existantes ; abandon d’une modification artificielle du stockage pendant que l’app tourne, car la sauvegarde au déchargement la remplace. Cas initiaux isolés par exercice/profil, vrai rechargement inchangé. La comparaison accueil a correctement signalé le nouveau libellé du pont ; **`MEDIA_REVIEW_CANDIDATE=1` est requis** pour admettre seulement cette différence précise, avec assertions des libellés ET vignettes candidate/référence. Pas de masque global des textes ; comportement historique des tests conservé sans option.
- **SHA candidat courant : `148cef273a0e3223cc0c3bdb9bdba320163cf1da7582194fcc746155c46b52e8`**. Il remplace `b5ab9b…` (piscine + pont seul). Toujours **271/272 fichiers web identiques**, dont tous les médias. AST : seuls `bg`, `v5`, `Kh`, `Z5`, `k5` et helpers ciblés autorisés à différer ; accueil, catalogue, moteurs et étapes 1–7 inchangés. Sources React historiques NON utilisées pour reconstruire l’app.
- **Aucun nouvel APK**, aucune nouvelle identité/signature. La 1.4.0 publiée reste intacte ; son lien plus bas n’est PAS une livraison des corrections visuelles. `.private/yanis-fitness-evolution-home/` toujours absent, revérifié ; ne pas générer une autre clé ni demander sans cesse à l’utilisateur de chercher le ZIP.
- Capture Émilie sombre du French press et comparatif avant/après affichés et examinés dans ce passage : tête/appuis visibles et bon matériel. Ne pas assimiler ces images à la validation de toutes les surfaces.

### Reprise précise

1. Poursuivre les dessins exacts pour dips/triceps/fessiers, sans substitutions par famille ou matériel. Les dessins de tractions/step-up du lot court n’exposent pas une amplitude complète ; pas de réassociation automatique. Le GIF aquatique de jambe n’est pas un kickback terrestre.
2. Préciser les consignes **du seul pont au sol**, sans changer sa prescription ni la vraie variante sur banc ; traiter échauffements/approches et anciens chronos guidés par contexte/identifiant. Ne pas déclarer ces surfaces corrigées par le seul nouveau helper bibliothèque/repos.
3. Garder ce candidat cumulatif et les protections piscine ; compléter les médias manquants avant acceptation finale. Continuer à contrôler les 209 IDs et les autres catégories, les deux profils/thèmes, mouvement/boucle/cadrage et les données persistées.
4. Commandes : `node evolution/media/candidate/build.mjs`, `node evolution/media/coverage.mjs`, `node --test evolution/media/tests/*.test.mjs`. Planches courtes : `PYTHONPATH=.cache/image-tools python3 evolution/media/review_frames.py --short-focus --tile 300`. Reproduction navigateur/envs complets dans `evolution/media/candidate/README.md` ; ne pas oublier `MEDIA_REVIEW_CANDIDATE=1` pour les tests accueil sur ce candidat.
5. Mettre à jour et **présenter à nouveau `PASSATION.md`** à la prochaine étape. Aucun changement de chat imposé actuellement ; avertir avec 🚩 avant d’atteindre la limite.

## Étape précédente — animations longues et pont seul (historique, remplacé par le cumul ci-dessus)

L’utilisateur dit **« Poursuis »**. Toujours continuer dans ce chat et **présenter la passation à chaque étape**. Ne pas repartir de zéro ni remplacer globalement les visuels.

- **46 GIF longs / 588 images vus sur planches intégrales ordonnées**, quatre séquences agrandies (1, 12, 25, 35). Registre versionné : `evolution/media/review/long-animations.json`. Il contient hachages, tous les indices vus, observations et états par association. Script reproductible désormais sauvegardé : `evolution/media/review_frames.py`. Ce n’est pas une certification anatomique ni une lecture réelle de tous les GIF dans toutes les vues ; ne plus refaire ce lot sans raison, mais compléter sa validation en situation.
- **102 associations dans ce lot : 58 écarts, 23 variantes à préciser, 21 gestes de base cohérents**, sans acceptation finale automatique. Dix nouveaux groupes documentés (36 à cette date, **41 au dernier état**). Notamment kickback triceps/fessier, adduction/abduction, bilatéral/unilatéral et marche en pont/répétitions 1,5. Les incertitudes restent explicitement séparées des écarts certains.
- **209 identifiants suivis individuellement** dans `review/exercise-coverage.json`, dérivé par `evolution/media/coverage.mjs`. Les autres catégories restent dans l’inventaire et les constats ; ce registre musculation ne les déclare pas validées.
- **Une seule réassociation ajoutée au candidat piscine conservé** : `pont-fessier-au-sol-activation` → GIF existant `/media/8eecb0152081ff26.gif` (pont bilatéral au sol sans charge). Douze images et agrandissement vérifiés ; animation en fiche et pause/reprise testées pour les deux profils. Le vrai pont pieds sur banc garde `/media/0766d3a06bf79dc8.gif`. Les 208 autres résolutions restent identiques. Aucun média binaire, définition d’exercice, prescription, charge ou donnée modifié.
- **Limites explicites :** la vignette bibliothèque de ce pont lit encore `k.gif` et reste anatomique ; les consignes génériques `Yu.bridge` mentionnent encore banc/sol et charge. Images directes, échauffements et chronos enregistrés restent à examiner par surface. Le groupe pont n’est donc PAS clos. Le GIF de step-up avec haltères et celui d’abduction assise avec bande sont seulement des pistes, pas des remplacements intégrés ; ne pas substituer un matériel sans vérifier la prescription.
- **22 tests Node réussis** : 9 caractérisations de l’APK, 9 tests du candidat, 4 tests de traçabilité. **16 parcours navigateur réussis** : 8 ciblés piscine/pont puis les 8 tests accueil/11 rubriques sur le même candidat. Les nouveaux tests de fiche ont nécessité une correction de sélecteur (onglet Bibliothèque) et de méthode de capture (rendu GIF réel plutôt que canvas). Aucun contournement dans l’application pour rendre les tests verts. Pas de reprise des 90 tests complets ni de test Android physique.
- Bundle candidat courant SHA **`b5ab9b5570c00b7842d202ae8fb03fd23ef2c9f80f6f5046393a74aa9663d47f`**, remplace le candidat piscine seul `75f39ae8…`. Toujours **271/272 fichiers web identiques** à la 1.4.0. AST : seules `bg`, `v5`, `Kh` et le helper isolé changent ; tous les autres blocs identiques. Rapport `candidate/validation.json`, recette `candidate/README.md`, association explicite `candidate/association-overrides.json`.
- **APK 1.4.0 intact ; aucun APK corrigé livré.** Clé privée toujours absente, revérifiée ; aucune nouvelle identité créée ou autorisée. IA en pause.

**Prochaine étape :** poursuivre les réassociations exactes et les ressources manquantes, en priorité dips/triceps et variantes fessiers ; traiter les vues encore alimentées directement par un ancien `gif/img` sans effacer les données. Garder les sources déjà correctes et le candidat cumulatif. Rapport lisible : `evolution/media/review/REVIEW-ANIMATIONS.md`, comparatif du pont `review/floor-bridge-comparison.jpg`.

## Étape précédente — candidat piscine seul (historique)

**Dernière consigne utilisateur :** « Pour l'instant tu fonctionne encore. On poursuit avec toi et a chaque fois met moi la passation stp. Sur les autres chat c'était l'enfer il m'ont démonté l'appli ». **Continuer ici tant que possible ; actualiser ET présenter la passation à chaque étape. Ne pas imposer un changement de chat ni une refonte.**

### Travail effectivement effectué dans cette étape

- Ajout d’un **candidat web isolé**, reproductible depuis la 1.4.0 signée exacte : `evolution/media/candidate/`. Aucun APK modifié ou signé ; aucune nouvelle identité.
- Frontière piscine/cardio dans `bg` et affichage du chrono `v5` : une étape piscine connue réutilise son association aquatique, même si un vieux chrono contient une image elliptique. Visuel, guide et agrandissement utilisent la même association. Le segment de l’étape prime dans les séances mixtes ; les véritables blocs cardio restent inchangés.
- Les noms génériques sans guide aquatique affichent un message de lacune dans le chrono plutôt qu’un vélo/elliptique ou une photo trompeuse. **Ce n’est pas une couverture complète** ; les 26 groupes restent ouverts. Aucun dessin/animation remplacé ou déclaré validé par ce correctif.
- **271 des 272 fichiers web sont inchangés** ; seul le bundle ciblé diffère. Comparaison AST : toutes les autres instructions de premier niveau restent identiques, notamment catalogue, accueil, moteur des chronos et sept étapes. Aucun changement des consignes, durées, historiques ou sauvegardes.
- **17 tests Node réussis** (9 caractérisations de la 1.4.0 + 8 tests du candidat), **6 nouveaux parcours navigateur réussis** (deux profils/deux thèmes, reprise, zoom, pause/reprise, étape cardio réelle, isolation) et **8 tests accueil existants réussis** sur le candidat comparé à la 1.4.0, dont les 11 rubriques. Ce n’est PAS la totalité des 90 tests de livraison relancée, ni un test Android physique.
- Tests navigateur : premiers échecs dus aux sélecteurs, à l’écriture différée et à une fixture de mensuration incomplète ; tests corrigés, schéma de fixture désormais validé, passage complet final vert. Aucun changement applicatif supplémentaire pour contourner les échecs. Données exclusivement fictives.
- Rapport précis : `evolution/media/candidate/validation.json`, recette/limites : `candidate/README.md`. Bundle candidat SHA **`75f39ae838c5ae7fc96b624f4f21ed4b960820590226d814de03ca86ce4b0107`**. Sortie reproductible `.cache/media-pool-candidate/`, non suivie par Git. Ne pas la présenter comme un APK livré.
- **`.private/yanis-fitness-evolution-home/` toujours absent**, revérifié dans cette reprise. Pas de génération de clé. Le candidat ne nécessite pas de signature ; toute future livraison doit restaurer l’identité 1.4.0 existante.

### Prochaine étape précise

Compléter la revue traçable de toutes les images des animations et la table des associations exactes, priorités dips/triceps et récupération aquatique. Garder le candidat piscine comme base incrémentale, sans repartir de zéro. Les mauvais guides aquatiques anciens, les visuels manquants et les minuteries mixtes sans segment restent à résoudre. Le parcours exact de l’utilisateur n’a pas été reproduit sur téléphone. Préserver les médias valables et ne pas remplacer globalement par des photos.

## 🚩 Exigences de continuité et récupération piscine

L’utilisateur demande de remettre l’audit à jour **ici dans le chat** et de préciser pour la suite : **« faire une continuité à l’identique »**, **pas de coquilles dans les animations**, **tous les exercices pourvus**, et **pas de vélo lors de la récupération en nage fractionnée en piscine**. Il souhaite une passation avant que le chat ne ralentisse davantage. Ne pas supposer que les réponses interrompues ont été terminées.

### Consignes impératives pour la continuation

1. **Continuer l’application complète existante, pas une refonte ni une version allégée.** Conserver les deux profils, les 209 exercices/variantes, les 11 rubriques, les charges/historiques/données, les chronos, les étapes 1–7 et l’accueil validé : orbe bleu tournoyant, clair/sombre colorés, carte « Prochaine séance » avec photo d’origine. Continuité à l’identique de ce qui est validé ; corriger les défauts, pas les reproduire.
2. **Chaque exercice doit avoir son visuel correspondant**, dans musculation, échauffement/approches, piscine, Tabata sol/aqua et étirements. Aucun exercice oublié ; une image absente, générique ou d’un autre mouvement reste une lacune non résolue.
3. **Animations sans coquilles :** examiner chaque image et la boucle, tête/corps/appuis, matériel, posture, direction et cadrage dans l’application. Préserver les anciens visuels corrects. Ne pas changer les consignes pour justifier une mauvaise image, ni remplacer globalement les dessins par des photos. Le comparatif photo dips n’est toujours pas approuvé.
4. **Récupération en nage fractionnée : pas de vélo/elliptique à sec.** Montrer la récupération aquatique correspondant à la consigne (marche aquatique, nage douce ou bord selon l’étape), dans les fiches, chronos, agrandissements et minuteurs repris après fermeture. Ne pas supprimer les véritables blocs elliptiques des séances mixtes.
5. Même package/certificat 1.4.0 pour la future mise à jour ; pas de nouvelle identité. IA générale toujours en dernier. Fournir un vrai lien direct seulement après construction et vérification du futur APK corrigé.

### État de l’audit avant le candidat ciblé — historique conservé

- Branche de session récupérée par avance rapide depuis le dépôt distant jusqu’à `9526b3e` ; audit original au commit `58acfff`. Ne pas repartir de zéro.
- **26 groupes ouverts**, dont le nouveau `pool-recovery-to-cardio`. Le repli de `bg("Récupération active", "pool")` vers l’image d’elliptique a été reproduit en exécutant la fonction exacte du bundle signé. Le fichier a été vu : appareil elliptique à sec. Les 24 récupérations standard libellées « marche » se résolvent correctement dans ce résolveur : **le parcours exact du téléphone reste à reproduire**, ne pas prétendre l’avoir testé. Examiner aussi les séances complémentaires et `step.img` prioritaire dans `v5`.
- **9 tests de caractérisation/provenance passent** (6 existants + 3 nouveaux), avec SHA APK et bundle contrôlés. Ce ne sont pas des tests d’une application corrigée. Aucun nouveau test navigateur ou appareil.
- Les planches des 16 premières animations longues ont été affichées avant interruption ; aucun registre exhaustif de validation n’a été sauvegardé. Les planches/script temporaires n’ont pas survécu à cette nouvelle réinitialisation. Ne pas considérer les 46 animations longues/588 images comme intégralement validées ; compléter et tracer la revue.
- **Aucun média corrigé en production, aucun nouvel APK livré.** La 1.4.0 publiée reste inchangée, SHA `30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`.
- **Signature : `.private/yanis-fitness-evolution-home/` est absent**, existence revérifiée le 23 septembre. Sa présence mentionnée lors de la livraison était historique. Conservation externe du ZIP privé non confirmée. Le fichier chiffré Git seul ne suffit pas. Ne pas régénérer de clé ; restaurer cette même identité avant un futur APK signé. L’audit peut continuer sans clé. Ne pas demander de secrets dans le chat ni demander répétitivement de rechercher d’anciennes archives introuvables.

### Texte de reprise pour une nouvelle conversation

> Lis `PASSATION.md` et `evolution/media/README.md`, puis poursuis l’audit et les corrections des visuels de Yanis Fitness Evolution en continuité à l’identique de l’application complète 1.4.0 et du style validé. Ne repars pas de zéro et ne perds aucune fonction ni donnée. Tous les exercices de musculation, échauffement, piscine, Tabata et étirements doivent avoir un visuel fidèle ; contrôler toutes les images des animations, sans tête inversée, mauvaise posture ou mauvais matériel. Conserver les visuels corrects. En récupération de nage fractionnée, aucun vélo/elliptique : respecter la consigne aquatique, y compris dans les minuteurs enregistrés. Les **41 groupes d’anomalies** restent ouverts. La revue des 46 GIF longs/588 images est tracée dans `review/long-animations.json` ; continue sans recommencer cet inventaire. Reprends le candidat cumulatif `evolution/media/candidate/` (SHA `b74853bc…` : récupération piscine corrigée, deux réassociations, échauffement ciblé ; **37 tests Node et 26 parcours navigateur réussis**), sans le confondre avec un APK livré. Même identité 1.4.0, IA en dernier. Continue dans ce chat tant que possible ; actualise et présente la passation à chaque étape, puis précise la suivante.

### Ordre de reprise recommandé

1. Lire `evolution/media/README.md`, puis `review/findings.json` et les inventaires. Le problème porte sur **toutes les catégories**, pas seulement le GIF des dips.
2. Compléter l’inspection **image par image** des animations longues et vérifier les cadrages/orientations réellement affichés dans les fiches, agrandissements et chronos. Les planches première/médiane ne suffisent pas pour valider ces animations.
3. Conserver les anciens visuels corrects ; corriger les associations par **exercice, matériel, position et contexte sol/piscine**, sans modifier les exercices pour les faire correspondre aux images. Priorités identifiées : dips/triceps, approches d’échauffement, collisions Tabata/piscine, étirements erronés.
4. Le comparatif photographique des dips est une **proposition non approuvée**, pas un remplacement déjà accepté. Si un autre support est nécessaire, le montrer directement dans le chat et expliquer s’il s’agit d’animation ou de deux positions fixes. **Ne pas remplacer globalement les dessins par des photos** sous prétexte de cette demande.
5. Garder un état de revue explicite pour chaque correspondance. Une image générique ou l’absence signalée de démonstration ne satisfait pas « tous ont leur image correspondante » ; ne pas annoncer l’audit terminé avec ces lacunes.
6. Intégrer et tester les corrections sur toutes les surfaces, y compris les minuteurs déjà enregistrés, sans perdre les deux profils, les charges, les données, les sept étapes ou l’accueil validé. Ensuite seulement produire une mise à jour **avec le package et la signature 1.4.0 existants**, numéro de version augmenté, contrôles du nouvel APK et lien direct. **Aucune nouvelle identité autorisée ; IA en pause.**

## Priorité actuelle — audit/correction des visuels d’exercice (en cours)

Après réception du lien 1.4.0, l’utilisateur signale que les images animées ne sont plus comme avant et demande **toutes les catégories** : musculation, échauffement, piscine, Tabata, étirements ; exemple dips/triceps avec tête incohérente. **IA toujours en pause.**

- Rapport et scripts : **`evolution/media/README.md`** ; catalogue runtime complet `review/inventory-1.4.0.json`, métadonnées 137 médias/727 images internes décodées, **41 groupes d’anomalies ouverts** dans `review/findings.json`.
- **209 exercices, 29 étirements, 19 guides piscine, 420 étapes de 18 niveaux/6 protocoles, 38 noms Tabata au sol et 6 aqua**, 5 guides cardio inventoriés dans le vrai bundle signé. Les données ne viennent pas du vieux `Movement.jsx`.
- **262/262 images identiques au complet original fourni**, pas seulement à 1.3.0 ; cela ne prouve PAS leur justesse. Les deux images du GIF dips changent l’orientation du regard/haut du corps de façon incohérente. Ne pas tenter un retournement global.
- Correspondances fausses confirmées : hip thrust unilatéral/squat bulgare, step-up/fentes, tractions/tirage poulie, extensions triceps sur banc/poulie debout, etc. Échauffement : bras pour activation fessiers et développé couché pour toutes les approches. Étirements : plusieurs positions différentes du texte. Piscine : plusieurs gestes terrestres erronés.
- **Tabata au sol : 4 noms renvoient à un guide piscine ; 34 autres ne résolvent aucune démonstration et affichent la photo générique de récupération.** Résoudre par contexte, pas par mots-clés.
- Les planches première/médiane des 137 médias ont été vues ; cela couvre les deux images des 48 GIF à deux images. Les 46 animations 12/24 images ont maintenant été examinées sur planches intégrales ; voir le registre nouveau en tête, sans confondre revue sur planches et lecture réelle dans toutes les vues. Décodage réussi ≠ contenu correct.
- **9 tests de caractérisation/provenance de l’audit réussis au 23 septembre**, pas des tests d’une application corrigée. Aucun correctif de production, nouvel APK, remplacement de signature ou modification des séances à ce stade.
- **Proposition dips en photographies réelles**, non intégrée : `evolution/media/review/dips-comparaison.jpg`, provenance/licence à côté. Deux positions, pas une vidéo continue. Source `yuhonas/free-exercise-db` au commit `a859101d633a01c4a1a920d6a8ce41dabba0705f`. Aucun changement esthétique global validé à ce stade. Montrer le comparatif directement et clarifier le support des remplacements (dessins anatomiques / photos réelles en complément), car l’utilisateur veut retrouver ses anciens visuels.
- **Suite :** table explicite des gestes/matériels/positions/contextes, remplacements validés de chaque visuel fautif, suppression des replis trompeurs, tests de toutes les surfaces (y compris minuteurs persistés), puis mise à jour avec **la clé et le package 1.4.0 existants**, pas une nouvelle installation parallèle. Les sept étapes et l’accueil approuvé restent intacts.

## Dernier APK livré — 1.4.0 complet fabriqué, signé et vérifié

**Décision de livraison précédente :** après explication de l’installation séparée et du transfert JSON, l’utilisateur a choisi **« Oui, on y va »**, puis écrit **« Poursuis »**. Cette nouvelle autorisation a été utilisée pour **une** nouvelle identité. Ne pas la régénérer lors d’une reprise. L’IA générale reste en pause.

### Livrable actuel

- **`downloads/Yanis-Fitness-Evolution-1.4.0.apk`**, 24 905 185 octets : étapes 1–7 et accueil approuvé (orbe bleu tournoyant, clair/sombre colorés, carte photo d’origine).
- SHA-256 **`30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`**.
- **Publication vérifiée** au commit `653b95bcef9636527a14bef7fbc2b25331284613`. L’APK téléchargé depuis GitHub est identique octet pour octet au fichier testé. Lien direct : https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/653b95bcef9636527a14bef7fbc2b25331284613/downloads/Yanis-Fitness-Evolution-1.4.0.apk
- Release de test : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.4.0-evolution — la description pointe vers l’APK Git ; aucun asset attaché (upload EOF, ne pas inventer un lien `/releases/download/`).
- Notice : `downloads/INSTALLATION-1.4.0.md`. Rapports : `.fidelity.json`, `.apk.sha256`, `evolution/android/validation-home-release.json`, `evolution/android/HOME-RELEASE.md`.
- Nom exact **Yanis Fitness Evolution**, version **1.4.0 / code 11**, nouveau package **`app.yanis.fitness.evolution.home`**. Installation à côté des anciennes, transfert explicite des données par JSON. Les APK 1.3.0 et antérieurs restent inchangés.
- **90 tests navigateur réussis dans un passage complet sur le web extrait du nouvel APK signé**, 150 tests de logique, 4 tests d’intégrité, 8 tests APK/signature/récupération. Trois builds signés identiques. Signature v2/v3 et alignement vérifiés. Aucun test physique/emulateur, pas de promesse de son/micro/notifications OEM validés sur téléphone.
- 272 fichiers web, 271 inchangés ; **les neuf DEX Android sont identiques octet pour octet à la 1.3.0**. Quatre entrées ZIP changent : manifeste, table de ressources (package), configuration Capacitor et bundle web. Toutes les étapes natives sont conservées.
- Bundle web embarqué SHA **`f80a7e82cbe8d45b7c959541ce384c54f3694582eef14515467dbfef204f9f26`** ; correspond au candidat d’accueil validé `0586fc9c2402f6580eb20c6fd5ee49c735cd6cd257b08bf613bca1dda65ecb94`, avec uniquement `V 1.3.0` remplacé par `V 1.4.0`.

### Nouvelle signature — ne plus perdre la continuité

- Autorisation : `evolution/android/home-authorization.json`.
- Identité immuable : `evolution/android/identity-home.json` ; recette mutable : `release-home.json`, `build-home.py`.
- Certificat **`7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd`**.
- Privé présent à la livraison mais **absent lors de la vérification du 23 septembre** : `.private/yanis-fitness-evolution-home/` (hors Git, jamais servi par HTTP).
- ZIP **`Yanis-Fitness-Evolution-1.4-SAUVEGARDE-PRIVEE.zip`** présenté via le visualiseur pendant la fabrication. Ce ZIP contient les secrets ; **conservation externe non confirmée**. Demander de le conserver en deux endroits privés, sans réclamer le contenu ou un secret dans le chat.
- Copie chiffrée publique : `evolution/signing/evolution-home.encrypted.json`. Récupération documentée dans `evolution/signing/HOME-IDENTITY.md` via `signing-home.py`, **sans initialisation**. Un secret ou le ZIP privé reste indispensable.
- Chaque build signe après une restauration réelle de la sauvegarde chiffrée et vérifie le certificat. La présence d’une copie chiffrée ne remplace pas la conservation du secret.
- Ne pas lancer les anciennes recettes `signing-next.py` / `build.py --new-parallel` pour cette livraison : elles concernent la 1.3.0. Garder les anciennes identités et leurs APK intacts.

### Livraison déjà effectuée et vérifications téléphone

Le **lien direct de la 1.4.0 a déjà été donné**. Installation/import/test sur téléphone pour Yanis et Émilie, sans désinstaller les anciennes applications. La nouvelle installation portera le même nom : appuyer sur Ouvrir après l’installation puis vérifier la version 1.4.0. Accorder à nouveau les permissions et activer explicitement les rappels par profil si souhaité. Éviter les rappels doublons provenant des anciennes installations. Confirmer la conservation de la sauvegarde privée.

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

> Lis `PASSATION.md` et `evolution/media/README.md`, puis poursuis l’audit et les corrections des visuels de Yanis Fitness Evolution en continuité à l’identique de l’application complète 1.4.0 et du style validé. Ne repars pas de zéro et ne perds aucune fonction ni donnée. Tous les exercices de musculation, échauffement, piscine, Tabata et étirements doivent avoir un visuel fidèle ; contrôler toutes les images des animations, sans tête inversée, mauvaise posture ou mauvais matériel. Conserver les visuels corrects. En récupération de nage fractionnée, aucun vélo/elliptique : respecter la consigne aquatique, y compris dans les minuteurs enregistrés. Les **41 groupes d’anomalies** restent ouverts. La revue des 46 GIF longs/588 images est tracée dans `review/long-animations.json` ; continue sans recommencer cet inventaire. Reprends le candidat cumulatif `evolution/media/candidate/` (SHA `b74853bc…` : récupération piscine corrigée, deux réassociations, échauffement ciblé ; **37 tests Node et 26 parcours navigateur réussis**), sans le confondre avec un APK livré. Même identité 1.4.0, IA en dernier. Continue dans ce chat tant que possible ; actualise et présente la passation à chaque étape, puis précise la suivante.

Si une validation ou des corrections sont données après cette passation, mettre à jour ce document avec les mots exacts de l’utilisateur et les éventuelles réserves avant de démarrer l’intégration.
