# 📋 BLOC À COPIER-COLLER DANS UN NOUVEAU CHAT (état lot 48, commit 7c89402)

Tu reprends le projet de refonte des visuels de l'app JARVIS Fitness (Yanis & Émilie).
Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Branche de travail OBLIGATOIRE :
`arena/01a0d6f5-jarvis-fitness-yanis-emilie-ap` (jamais push sur `main`, aucune autre branche,
ne jamais supprimer/renommer la racine du repo).

**Lis d'abord, dans cet ordre :**
1. `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md` (pièges, recette de prompt, chaîne de production)
2. `CE-QUI-COINCE.md` (racine) — décisions ouvertes
3. `evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md` (§63→66)
4. `evolution/media/refonte-photo/livraison/LIVRAISON-README.md` + `livraison/manifeste-331.json`

**État actuel :** 331/331 couples valides, 0 restant. PDF de revue livré à l'utilisateur :
`evolution/media/refonte-photo/livraison/REVUE-331-exercices.pdf` (112 pages, exercices
numérotés 1→331 par rubrique, nom + athlète + identifiant + frames 1 et 2 du GIF) — l'utilisateur
relit par NUMÉRO. APK 1.4.9 NON SIGNÉ construit et contrôlé (lot 47, voir §65) : pipeline
`evolution/media/tools/rebuild-assoc-331.py` puis `evolution/media/tools/overlay-331.py`
(copie 331 GIF, écrase anciens chemins, patch payloads EXO_GIFS/imgs, hook REFONTE_MEDIA avec
6 ids duaux homme/femme via activeProfile `jarvis_fitness_v3`), repackage zip, contrôles node.
Relecture cumulative : 310 relus / 21 non relus. Style : 26 GIF en attente de décision user.

**Priorités à la reprise, dans cet ordre :**
1. Si l'utilisateur signale une coquille PDF (« coquille au n° X ») : corriger la planche avec
   posture corrigée et vert aux DEUX cases, régénérer le GIF, puis régénérer le PDF AVEC LES
   MÊMES NUMÉROS (`evolution/media/tools/pdf-revue-331.py`), montrer la planche de contrôle.
2. Si l'utilisateur colle la CLÉ DE SIGNATURE : signer l'APK 1.4.9, déposer
   `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`, donner UN seul
   lien raw GitHub dans le chat. La clé n'est JAMAIS fabriquée ni publiée ; fournie par
   l'utilisateur (`/tmp/rk.txt`, mode 0600).
3. Sinon : poursuite relecture (feuilles de 3, `evolution/media/tools/feuilles-verif.py`) ;
   lot « style » (26) uniquement sur décision explicite de l'utilisateur.

**Contraintes permanentes :** lots ≤ 10 images par tour (l'utilisateur enchaîne par « suite ») ;
aucune image « famille C » ; athlète = propriétaire du profil (Émilie → femme
`planches/maitre-femme.png`, Yanis → homme `planches/maitre-homme.png`, face A) ; pas de
rotation/miroir global ; ne jamais réécrire une prescription pour justifier une mauvaise image ;
jamais vélo/elliptique comme recovery piscine ; reprendre `production/a-refaire.json` (refus)
en priorité avec une stratégie DIFFÉRENTE à chaque essai ; tenir à jour chaque tour
`CE-QUI-COINCE.md`, `PASSATION.md`, `verification/…` ; commit + push branche arena seulement ;
présenter les planches de contrôle `review/` après chaque lot ; vérifications d'exactitude du
mouvement AVANT toute production.

**Environnement :** l'espace de travail se RÉINITIALISE souvent. Restauration :
`git fetch origin arena/01a0d6f5-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD` ;
venv : `python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy`.
`.cache/` n'est PAS persistant : web 1.4.8, payloads, APK non signé se régénèrent avec les outils
ci-dessus (payloads via node : `new Function('return JSON.parse(`…`)')` sur les 2 littéraux
`=JSON.parse(`…`)` du bundle — le parse Python échoue sur `\escape`).
