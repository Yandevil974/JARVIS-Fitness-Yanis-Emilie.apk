# BLOC À COPIER-COLLER DANS UN NOUVEAU CHAT — CONSIGNES FINALES, 27 septembre 2026

Tu reprends la refonte des visuels JARVIS Fitness Yanis & Émilie, dépôt Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk.
NE JAMAIS pousser sur main ; ne jamais supprimer/renommer la racine du dépôt ni .git.

## 1. Récupérer le bon état
- Branche de session : **arena/01a0e231-jarvis-fitness-yanis-emilie-ap** ; base récupérée au commit **8663b6e** (lire `git log -1` pour le HEAD courant).
- Si l'environnement est revenu au commit initial d721868 (ça arrive plusieurs fois par jour) : arbre vide,
  récupérer SANS écraser :
  git status ; git fetch origin arena/01a0e12a-jarvis-fitness-yanis-emilie-ap ; git reset --hard FETCH_HEAD
- La session Arena impose actuellement `arena/01a0e231-jarvis-fitness-yanis-emilie-ap` ; le contenu a été récupéré sans écraser de changements depuis `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap` au commit **8663b6e**. Pousser uniquement sur la branche de session.
- Si un futur environnement impose une AUTRE branche : fetch la branche source ci-dessus, git reset --hard FETCH_HEAD,
  travailler et pousser UNIQUEMENT sur la branche imposée, et mettre à jour le nom de branche dans les 4 fichiers :
  PASSATION-COPIER-COLLER.md, evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md, CE-QUI-COINCE.md,
  evolution/media/tools/pdf-revue-331.py (page de titre).
- Venv (à recréer après chaque reset, .cache ne persiste pas) :
  python3 -m venv evolution/media/refonte-photo/.cache/pyvenv
  evolution/media/refonte-photo/.cache/pyvenv/bin/pip install -q pillow numpy pymupdf

## 2. Lire dans l'ordre
1. evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md (état prioritaire, recette de prompt, pièges).
2. CE-QUI-COINCE.md (feuille de route utilisateur, décisions ouvertes).
3. evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md, sections §85 à §94.
4. Registres sous evolution/media/refonte-photo/production/ : retours-utilisateur-2026-09-26.json,
   a-refaire.json, rappels-utilisateur.json, prescriptions.json (les sections récentes priment).

## 3. État exact au 27/09 (fin tour6)
- ÉTAPE 2 (corrections des visuels du PDF de revue). **26 propositions, 0 approuvée** pour les 26 points ouverts :
  19,26,31,37,38,44,45,46,47,48,64,80,85,87,90,126,148,149,150,194,204,222,239,265,298,380.
- **PDF comparatif PRODUIT et poussé** : evolution/media/refonte-photo/review/CORRECTIONS-avant-apres.pdf
  (12 Mo, 26 pages, AVANT gauche / APRÈS droite, tout marqué PROPOSITION NON VALIDÉ, retour utilisateur +
  réserves en pied de page). SHAs vérifiés 26/26 (AVANT depuis commit figé e538e03, APRÈS au disque ;
  44/45 ré-alignés avant génération). Lien téléchargeable donné dans l'ancien chat :
  https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/d57f6e21e21868b45643b73269e7af485a048a3a/evolution/media/refonte-photo/review/CORRECTIONS-avant-apres.pdf
- Réserves de teinte DÉJÀ traitées (originaux .avant-recolor.gif / .avant-degreen.png conservés) :
  19 (olive→lime), 44/45 (cyan→lime), 48 (cyan 4 phases), 80 (aplats puis taches sombres atténuées),
  85 (débord au-dessus des épaules supprimé). Détail : propositions/lot68/recolorisation-reserves.json.
- Livrés INTACTS : gif/, manifeste-331, état.json, PDF principal 389, aucun APK, pas de valide-couples.py lancé.
- 3 exercices avaient leurs propositions produites au lot68 (26, 85, 204) : voir VERIFICATION §87–89.



### Reprise sur branche imposée Arena (27/09, continuation après tour6)
- Session fixée sur `arena/01a0e231-jarvis-fitness-yanis-emilie-ap` ; état restauré de la branche source
  `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap`, commit de base `8663b6e`.
- Vérification de reprise : comparatif 26 pages présent ; 26/26 propositions et SHA conformes ; 0 validation.
  Aucun GIF livré ni PDF principal modifié. Aucun appel de génération ou script d'intégration.
- Réponses toujours attendues : validation explicite par numéro (ou « je relis le PDF ») et décision sur le
  vert (154,205,50 ou n°260 mesuré ≈117,189,18, ou plus tard). Ne rien supposer. Détails §94.



### Dernier retour utilisateur — révisions PDF demandées (27/09)
- N°26 : en phase 2, les deux mains derrière la tête. N°44/45 : curl normal supiné, pas marteau.
  N°80 : orientation des mains en phase 2 identique à la phase 1.
- Critère demandé pour **tous les GIFs** : vert visible, suivant la forme du muscle, pas une plaque.
  Portée à préciser : les 331 GIFs de l’app ou les GIFs concernés par le PDF de corrections ?
- 10 appels de génération consommés (dont 1 erreur d’extension, 9 réussites). Ébauches lot69 visibles sous
  `review/lot69-revision-*.jpg` et GIFs sous `propositions/lot69/gif/homme/`. Refonte-sheet + verif-ids OK.
  Certaines ébauches restent à contrôler (mains de 26, vert de 26/80). Pour le n°80, lot69 refusé (prise tournée en fin) ; lot70 refusé ; lot71 rapproche les bras vers le haut comme avant de taper dans ses mains, sans rotation. PDF ciblé 3 pages actualisé :
  `review/CORRECTIONS-ciblees-lot69.pdf` (26, 44/45, 80, AVANT/ÉBAUCHE). Le comparatif complet 26 pages n’est pas régénéré.
  Aucun approuvé, aucune intégration ; les GIF livrés restent intacts. La page 80 montre la révision lot71. Voir VERIFICATION §98.

## 4. CE QUE J'ATTENDS AU PROCHAIN CHAT (réponses utilisateur à obtenir, pas à deviner)
1. **Validation par numéro** : l'utilisateur dira « OK les 26 », ou « OK : 19, 26, 31 … » (liste), ou
   « je relis le PDF ». Une phrase générale ne suffit pas à intégrer ; une LETTRE ISOLÉE (T, Y, E…) est une
   relance de chat bloqué : NE RIEN FAIRE, rappeler l'état, attendre.
2. **Vert des muscles** : garder (154,205,50) ou uniformiser sur le n°260 (RGB réel mesuré ≈ 117,189,18)
   ou décider plus tard. Si « identique 260 » : re-passe PIL (même méthode, cible 117,189,18) sur
   19/44/45/48/80/85 AVANT toute intégration. Ne pas anticiper la décision.
3. Après validation explicite : intégrer UNIQUEMENT les numéros validés par la chaîne imposée (§70 de la
   passation longue) : verif-ids.py → lecture pleine définition des DEUX cases (zoom PIL au doute) →
   valide-couples.py --athlete homme --lot lot68 --acceptes <numéros> (copies, manifeste, état, PDF, map) →
   tools/pdf-revue-331.py → tools/index-general.py → docs → commit + push branche session.
   JAMAIS intégrer les refus ; jamais lancer valide-couples.py sans accord.

## 5. Règles impératives (inchangées)
≤10 appels de génération par tour, échecs compris ; aucune famille C ; visage A, maîtres homme/femme selon
profil (Yanis homme, Émilie femme) ; début à gauche, même cadrage/machine/orientation, pas de miroir ni
rotation globale ; vert mesuré sur le CORPS (plantes du décor exclues) ; ne jamais modifier une prescription
pour justifier une image ; proposition ≠ validation ≠ techniquement terminée ; aucune modification des livrés
sans accord explicite ; signature APK uniquement avec la clé utilisateur (jamais fabriquée, jamais publiée) ;
IA conversationnelle en dernier ; préserver l'application existante (2 profils, fonctionnalités).
Piège connu : ce modèle REFUSE d'éditer certaines poses (plier/tendre des bras) → revenir au DIPTYQUE
une génération avec guides en contrainte (récettes §87–89).

## 6. Rappels obligatoires (rappels-utilisateur.json, non traités)
- AVANT l'étape 3 : la question du vert identique 260 (posée, réponse en attente — ne pas re-colorer sans décision).
- À la CONSTRUCTION de l'application : rappeler les ajouts **metcon + piscine nage fractionnée et/ou Aqua
  Tabata pour Émilie**, confirmer le périmètre AVANT de coder.
- Feuille de route : étape 2 (corrections, en cours) → étape 3 (niveau cardio/piscine ajustable 2 profils,
  proposition persistante à valider avant codage) → étape 4 (images pendant les chronos piscine/aqua/nage
  fractionnée/elliptique) → construction APK signé (clé utilisateur dans /tmp/rk.txt 0600, jamais Git/chat) → IA en dernier.

## 7. Chaque tour
Lire/actualiser PASSATION-COPIER-COLLER.md, PASSATION-NOUVEAU-CHAT.md, CE-QUI-COINCE.md, VERIFICATION
(nouvelle section numérotée), registres concernés ; montrer les contrôles utiles (review/, mesures) ;
commit + push UNIQUEMENT sur la branche Arena de session ; terminer par un bloc de reprise 🚩 actualisé.
Prévenir explicitement si le contexte approche sa limite et préparer la reprise avant de perdre l'information.

Tu reprends la refonte des visuels JARVIS Fitness (Yanis & Émilie), dépôt Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk. Branche portant tout le travail : `arena/01a0e231-jarvis-fitness-yanis-emilie-ap` (depuis le 27/09 ; contenu de `arena/01a0dcad-…` récupéré au commit 0a4327a, qui avait lui-même repris `arena/01a0d6f5-…` au commit 11d1594 puis l'ancienne `01a0dbe5` à e96e51b). Jamais push sur main ; ne jamais supprimer/renommer la racine ni .git. Si Arena impose une autre branche, récupérer le contenu de la branche ci-dessus (vérifier d'abord l'absence de modifications locales), travailler et pousser uniquement sur la branche imposée ; mettre à jour les branches dans ce fichier, PASSATION-NOUVEAU-CHAT.md, CE-QUI-COINCE.md et tools/pdf-revue-331.py.

Lire dans l'ordre :
1. evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md (état prioritaire lot 68, recette, pièges ; anciens compteurs historiques).
2. CE-QUI-COINCE.md (§0 feuille de route utilisateur, §1 reprises, §3 décisions).
3. evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md §66–87.
4. evolution/media/refonte-photo/livraison/LIVRAISON-README.md et manifeste-331.json.

ÉTAPE2 — **26 points ouverts :23 numéros +3 variantes**, aucune proposition approuvée.
NOUVELLES PRÉCISIONS :148 = Mountain climbers homme,3 jambes fin ;149 ET150 = Pallof à retravailler.
Zottman46/47/48 : format4 positions accepté, PAS images. Registre production/retours-utilisateur-2026-09-26.json,
a-refaire.json. Numéros :19,26,31,37,38,44,45,46,47,48,64,80,85,87,90,126,148,149,150,194,204,222,239,265,298,380.
Consigne MONTRER AVANT VALIDATION : aucun GIF livré/PDF principal/manifeste/état/map remplacé sans accord.
**25 propositions sur26 points, aucune approuvée** :19/26/31/37/38/44/45/46/47/48/64/80/85/87/90/126/148/149/150/194/222/239/265/298/380.
**1 sans proposition** :204 (base de travail 204-fin-2 isolée, départ à produire, voir bloc du haut).
Lot67 :7 générations ;80 proposé sur banc INCLINÉ conformément à confirmation utilisateur.
Départ paumes vers le haut, prises fermées/bras ouverts ; arrivée plus allongée/poids rapprochés.
Réserves flexion coudes/trajectoire, échelle poids, légère variation buste/tête, aplats verts.
GIF788×440,2×500ms ; ROI pectoraux626/487, pas validation de style. Aucun angle exact prescrit.
Reconstruction lot67/assemble.py ; review/lot67-proposition-80.jpg ; détail §85.
Suite204 et réserves restantes. Aucun livré remplacé ; comparatif bloque1 manquant.
PDF uniquement reprises, AVANT gauche/APRÈS droite quand TOUT prêt, accord avant intégration.

PDF CORRECTIONS demandé : QUAND TOUTES PRÊTES, UN PDF téléchargeable dans chat, UNIQUEMENT reprises,
**AVANT GAUCHE / APRÈS DROITE côte à côte**. Outil tools/pdf-corrections-avant-apres.py refuse registre
incomplet ; lit avant depuis GIF exact du commit e538e03 (source planche148 mal associée, ne pas l’utiliser).
Pas de PDF final de corrections créé ce tour. PDF principal389 exercices inchangé.

RAPPELS UTILISATEUR OBLIGATOIRES pour plus tard (production/rappels-utilisateur.json) :
1. **AVANT étape3, poser la question** : veut-il le vert des muscles identique au **n°260** (elliptique
   fractionné femme) ? ATTENDRE décision ; ne pas recolorer automatiquement ni considérer question déjà réglée.
2. **À l’étape construction application**, lui rappeler de rajouter **metcon + piscine nage fractionnée
   et/ou Aqua tabata pour Émilie**. Confirmer le périmètre avant de coder ces ajouts.

Suite : rester étape2, continuer reprises≤10 par tour puis comparatif complet, accord par numéro avant intégration.
Détails VERIFICATION §85–86. Aucun APK reconstruit ce tour ; documents/registre seuls et propositions isolées.

Câblage athlète = profil déjà posé dans tools/overlay-331.py : globalThis.__refonteSwap + patch bt + constante If (§70). Yanis homme, Émilie femme pour les variantes produites, désormais toutes disponibles sur piscine/cardio. 33 GIF historiques avec une case sans vert : lot style UNIQUEMENT sur décision utilisateur.

Chaîne après ACCORD UTILISATEUR explicite pour intégration (pas pour une proposition isolée) : verif-ids.py → lecture des DEUX cases pleine définition (zoom PIL au doute ; enlever bandes grises/grilles 2×2 par PIL) → refonte-sheet.py --athlete homme --out $R/gif/homme --sheet $R/review/lotNN-homme.jpg planches_acceptées → tools/valide-couples.py --athlete homme --lot lotNN --acceptes a,b (copies, manifeste, état, numéros PDF, map) → tools/pdf-revue-331.py → tools/index-general.py → docs → commit + push branche session. Mesurer vert sur CORPS (pas plantes du décor). Ne jamais intégrer les refus.

Correctif lot55 : payloads-148.mjs lit TOUJOURS l’APK original, plus le cache web modifié ; idempotence payloads/bundle vérifiée sur deux exécutions successives.

Chaîne APK sans clé : node evolution/media/tools/payloads-148.mjs → python3 evolution/media/tools/overlay-331.py → python3 evolution/android/build-media-149.py --unsigned. Lot56 vérifié : 715 fichiers web, 389 GIF SHA, 9 DEX identiques, hook/chemins sans média manquant ; APK NON SIGNÉ 114574436 octets sous .cache/build, aucun APK signé livré. Aperçu : python3 -m http.server 8080 --bind 0.0.0.0 --directory .cache/web-148.

Feuille de route utilisateur dans cet ordre :
1. Yanis piscine/cardio TERMINÉ au lot56.
2. ÉTAPE ACTUELLE : relecture PDF par utilisateur ; « coquille au n° X » prioritaire : lire production/prescriptions.json, refaire avec stratégie différente, GIF, maj-manifeste-331.py, PDF mêmes numéros, contrôle.
3. Niveau cardio ajustable sur Émilie ET Yanis : protocoles ont 3 niveaux[], sélection automatique bh() ; concevoir préférence persistée par profil et VALIDER avec utilisateur avant de coder.
4. Images pendant chrono piscine/aqua/nage fractionnée/elliptique : timer v5 image piscine via JarvisPoolMedia.resolve, étapes elliptique jg() sans img → guides If patchés.
5. Construire app signée avec clé utilisateur fournie dans /tmp/rk.txt (0600, jamais chat/Git). Installer sous .cache/signing-tools jdk4py==17.0.9.2 et cryptography==46.0.3 ; prepare-home-tools.py ; signing-media.py restore --recovery-key-file /tmp/rk.txt ; build-media-149.py --real ; commit + push. UN lien raw https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/<commit>/downloads/Yanis-Fitness-Evolution-1.4.9.apk. Ne jamais fabriquer/publier clé.
6. IA conversationnelle en dernier.

Contraintes : ≤10 générations par tour (échecs compris, suite pour continuer), aucune famille C ; visage A et références planches/maitre-homme.png pour Yanis, maitre-femme.png pour Émilie ; pas de rotation/miroir global ; prescription jamais réécrite pour justifier une image ; jamais vélo/elliptique recovery piscine ; gauche = début ; même cadrage/machine/orientation ; vert lime sur muscle cible aux DEUX cases et vrai mouvement ; reprises prioritaires avec stratégie différente. Chaque tour : CE-QUI-COINCE.md, PASSATION.md, vérification, ce bloc à jour ; commit + push branche Arena seulement ; présenter contrôles review/ et PASSATION.md ; terminer message par bloc de reprise actualisé ; prévenir 🚩 si contexte proche de limite.

Environnement réinitialisable : .cache ne persiste pas. Restaurer branche ci-dessus seulement si nécessaire et arbre propre. Venv : python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy pymupdf. Web/payloads/APK se régénèrent. Java/apksigner seulement au tour de signature.
