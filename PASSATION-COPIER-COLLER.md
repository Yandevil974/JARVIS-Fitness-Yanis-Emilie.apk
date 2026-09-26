# 📋 BLOC À COPIER-COLLER DANS UN NOUVEAU CHAT (état lot 51, 26 septembre 2026)

Tu reprends le projet de refonte des visuels de l'app JARVIS Fitness (Yanis & Émilie).
Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Branche portant tout le travail :
`arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap` (jamais push sur `main`, ne jamais
supprimer/renommer la racine du repo). **Si Arena t'impose une autre branche de session** :
récupère d'abord `git fetch origin arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap && git reset
--hard FETCH_HEAD`, travaille et pousse sur la branche imposée, puis mets à jour les noms de
branche dans `PASSATION-COPIER-COLLER.md`, `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md`,
`CE-QUI-COINCE.md` et la page de titre de `evolution/media/tools/pdf-revue-331.py`.

**Lis d'abord, dans cet ordre :**
1. `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md` (pièges, recette de prompt, chaîne de production)
2. `CE-QUI-COINCE.md` (racine) — décisions ouvertes
3. `evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md` (§65→67)
4. `evolution/media/refonte-photo/livraison/LIVRAISON-README.md` + `livraison/manifeste-331.json`

**État actuel :** **363 couples valides / 26 restants** (les 331 d'origine sont tous valides ET relus ;
le 26/09 l'utilisateur a demandé les visuels piscine/cardio pour YANIS : 58 couples homme ajoutés,
32 validés au lot 51). `production/a-refaire.json` : 1 (battements-au-bord|homme, retry lot 52 avec
ancrage par côté caméra). Restent 15 générations : lot 52 = battements-au-bord, nage-statique-a-l-elastique,
fractionne-nager, sprint-nager-a-fond, recup-complete-souffler, talons-fesses, etirements-au-bord,
mobilite-epaules-aquatique, mobilite-hanches-chevilles, nage-douce-respiration (homme, bassin) ; lot 53 =
elliptique-mise-en-route, -fractionne, -recuperation-active, -retour-au-calme, transition (homme) PUIS le
câblage « athlète = profil » pour piscine/elliptique (patch `bt` + constante `If`, voir VERIFICATION §68).
Après chaque lot : `verif-ids.py` → `refonte-sheet.py --athlete homme` → lecture des 2 cases →
`tools/valide-couples.py --athlete homme --lot lotNN --acceptes …` (copies conformes + manifeste + etat +
numéro PDF) → `pdf-revue-331.py` (numéros FIGÉS par `livraison/numerotation-pdf.json`) → `index-general.py`.
Style : 33 GIF en attente de décision user. PDF : `livraison/REVUE-331-exercices.pdf` (122 pages, 363
exercices, 1→331 inchangés, Yanis piscine dès 332) — l'utilisateur relit par NUMÉRO.
**Feuille de route utilisateur (26/09, par étapes)** : 1 Yanis piscine/cardio (en cours) ; 2 corrections
PDF sur ses retours ; 3 pouvoir augmenter le niveau du programme cardio (piscine + autres) pour les deux ;
4 images pendant le chrono (piscine, aqua, nage fractionnée, elliptique) ; 5 construire l'app ; 6 IA
conversationnelle en dernier. Prévenir l'utilisateur dès que la limite de contexte approche. Chaîne APK 1.4.9
rejouable en 1 min sans clé : `node evolution/media/tools/payloads-148.mjs` →
`python3 evolution/media/tools/overlay-331.py` → `python3 evolution/android/build-media-149.py --unsigned`
(APK non signé `.cache/build/…-1.4.9-non-signe.apk`, 103,8 Mo, 331 GIF vérifiés SHA dans le zip, hook
`REFONTE_MEDIA` 325 ids dont 6 duaux homme/femme par `activeProfile` de `jarvis_fitness_v3`, 9 DEX identiques).

**Priorités à la reprise, dans cet ordre :**
1. Si l'utilisateur signale une coquille PDF (« coquille au n° X ») : relire la prescription
   (`production/prescriptions.json`), refaire la planche (posture juste, vert aux DEUX cases,
   stratégie DIFFÉRENTE de l'essai précédent), `verif-ids.py`, `refonte-sheet.py`, lecture des deux
   cases, `evolution/media/tools/maj-manifeste-331.py`, puis régénérer le PDF AVEC LES MÊMES NUMÉROS
   (`evolution/media/tools/pdf-revue-331.py`) et montrer la planche de contrôle `review/`.
2. Si l'utilisateur colle la CLÉ DE RÉCUPÉRATION (32 octets base64) : l'écrire dans `/tmp/rk.txt`
   (mode 0600, jamais dans Git ni dans le chat), puis `pip install --target .cache/signing-tools
   jdk4py==17.0.9.2 cryptography==46.0.3` (cf. `evolution/android/HOME-RELEASE.md`),
   `python3 evolution/android/prepare-home-tools.py` (apksigner épinglé `ef494179…`),
   `python3 evolution/android/signing-media.py restore --recovery-key-file /tmp/rk.txt`,
   `python3 evolution/android/build-media-149.py --real` (signature v2+v3, identité durable
   `150e3846…`, dépôt `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`),
   commit + push, puis UN seul lien raw GitHub
   `https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/<commit>/downloads/Yanis-Fitness-Evolution-1.4.9.apk`.
   La clé n'est JAMAIS fabriquée ni publiée.
3. Sinon : lot « style » (33) uniquement sur décision explicite de l'utilisateur ; décisions
   ouvertes de `CE-QUI-COINCE.md` §3 (back-extension prise snatch, soulevé de terre 1RM à un plateau).

**Contraintes permanentes :** lots ≤ 10 images par tour (l'utilisateur enchaîne par « suite ») ;
aucune image « famille C » ; athlète = propriétaire du profil (Émilie → femme
`planches/maitre-femme.png`, Yanis → homme `planches/maitre-homme.png`, face A) ; pas de
rotation/miroir global ; ne jamais réécrire une prescription pour justifier une mauvaise image ;
jamais vélo/elliptique comme recovery piscine ; case de gauche = DÉBUT du geste ; même cadrage aux
deux cases ; vert lime sur le muscle cible aux deux cases ; reprendre `production/a-refaire.json`
(refus) en priorité avec une stratégie DIFFÉRENTE à chaque essai ; tenir à jour chaque tour
`CE-QUI-COINCE.md`, `PASSATION.md`, `verification/…`, `PASSATION-COPIER-COLLER.md` ; commit + push
branche arena seulement ; présenter les planches de contrôle `review/` après chaque lot ;
vérifications d'exactitude du mouvement AVANT toute production ; jamais d'acceptation à l'œil sur
une vignette (feuilles pleine définition, zoom PIL au moindre doute).

**Environnement :** l'espace de travail se RÉINITIALISE souvent. Restauration :
`git fetch origin arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD` ;
venv : `python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy pymupdf`.
`.cache/` n'est PAS persistant : web 1.4.8, payloads, APK non signé se régénèrent avec les trois
commandes ci-dessus (payloads via node : `new Function('return JSON.parse(`…`)')` sur les 2 littéraux
`=JSON.parse(`…`)` du bundle — le parse Python échoue sur `\escape`). Aucun Java ni apksigner dans
l'image de base : à installer seulement au tour de signature.

Signale par un drapeau rouge 🚩 ta limite dans le chat, et prépare une nouvelle passation comme
celle-ci pour repartir dans un nouveau chat.
