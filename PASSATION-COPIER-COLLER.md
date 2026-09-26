# BLOC À COPIER-COLLER DANS UN NOUVEAU CHAT — lot 55, 26 septembre 2026

Tu reprends la refonte des visuels JARVIS Fitness (Yanis & Émilie), dépôt Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk. Branche portant tout le travail : `arena/01a0dcad-jarvis-fitness-yanis-emilie-ap`. Jamais push sur main ; ne jamais supprimer/renommer la racine ni .git. Cette session a repris l'ancienne branche 01a0dbe5 au commit e96e51b. Si Arena impose une autre branche, récupérer le contenu de la branche ci-dessus (vérifier d'abord l'absence de modifications locales), travailler et pousser uniquement sur la branche imposée ; mettre à jour les branches dans ce fichier, PASSATION-NOUVEAU-CHAT.md, CE-QUI-COINCE.md et tools/pdf-revue-331.py.

Lire dans l'ordre :
1. evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md (état prioritaire lot 55, recette, pièges ; anciens compteurs historiques).
2. CE-QUI-COINCE.md (§0 feuille de route utilisateur, §1 reprises, §3 décisions).
3. evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md §66–72.
4. evolution/media/refonte-photo/livraison/LIVRAISON-README.md et manifeste-331.json.

État mesuré : **388 couples valides / 1 restant** (389 total). Les 331 d'origine sont valides ET relus.
Pour Yanis piscine/cardio, 58 couples homme ajoutés, 57 validés (n°332–388). Lot55 : 7 générations.
Talons-fesses homme accepté n°387, copie effort n°388 : dos strict, guide de pose local puis rendu
photo de la case droite, pas de miroir. GIF 129×440, 2×500 ms, vert jambes 349/756 pixels.
PDF `evolution/media/refonte-photo/livraison/REVUE-331-exercices.pdf` : **131 pages / 388 exercices**,
numéros 1–386 inchangés. Contrôle accepté review/lot55-homme.jpg. Refus dans verification/lot55-refus/.

Lot56 : **elliptique-fractionne|homme SEUL restant**, essais 4–7 au lot55 refusés : même phase
malgré référence mise-en-route, vue ¾ frontale, guide superposé puis pose effacée. Essai8 : nouvelle
phase seule depuis maître + schéma indépendant de machine, vue de face stricte, SANS photo de la
pose précédente (ancrage trop fort), puis phase opposée même machine. Deux mains sur poignées
mobiles, pieds sur pédales opposées, vert muscles aux deux cases ; pas de miroir global.
Voir production/a-refaire.json et VERIFICATION §72. Talons-fesses n'est PLUS à reprendre.

Câblage athlète = profil déjà posé dans tools/overlay-331.py : globalThis.__refonteSwap + patch bt + constante If (§70). Yanis homme, Émilie femme quand variante disponible ; fractionné Yanis attend encore sa variante. 33 GIF historiques avec une case sans vert : lot style UNIQUEMENT sur décision utilisateur.

Chaîne après lot : verif-ids.py → lecture des DEUX cases pleine définition (zoom PIL au doute ; enlever bandes grises/grilles 2×2 par PIL) → refonte-sheet.py --athlete homme --out $R/gif/homme --sheet $R/review/lotNN-homme.jpg planches_acceptées → tools/valide-couples.py --athlete homme --lot lotNN --acceptes a,b (copies, manifeste, état, numéros PDF, map) → tools/pdf-revue-331.py → tools/index-general.py → docs → commit + push branche session. Mesurer vert sur CORPS (pas plantes du décor). Ne jamais intégrer les refus.

Correctif lot55 : payloads-148.mjs lit TOUJOURS l’APK original, plus le cache web modifié ; idempotence payloads/bundle vérifiée sur deux exécutions successives.

Chaîne APK sans clé : node evolution/media/tools/payloads-148.mjs → python3 evolution/media/tools/overlay-331.py → python3 evolution/android/build-media-149.py --unsigned. Lot55 vérifié : 714 fichiers web, 388 GIF SHA, 9 DEX identiques, hook/chemins sans média manquant ; APK NON SIGNÉ 114420961 octets sous .cache/build, aucun APK signé livré. Aperçu : python3 -m http.server 8080 --bind 0.0.0.0 --directory .cache/web-148.

Feuille de route utilisateur dans cet ordre :
1. Finir Yanis piscine/cardio (lot56).
2. Relecture PDF par utilisateur ; « coquille au n° X » prioritaire : lire production/prescriptions.json, refaire avec stratégie différente, GIF, maj-manifeste-331.py, PDF mêmes numéros, contrôle.
3. Niveau cardio ajustable sur Émilie ET Yanis : protocoles ont 3 niveaux[], sélection automatique bh() ; concevoir préférence persistée par profil et VALIDER avec utilisateur avant de coder.
4. Images pendant chrono piscine/aqua/nage fractionnée/elliptique : timer v5 image piscine via JarvisPoolMedia.resolve, étapes elliptique jg() sans img → guides If patchés.
5. Construire app signée avec clé utilisateur fournie dans /tmp/rk.txt (0600, jamais chat/Git). Installer sous .cache/signing-tools jdk4py==17.0.9.2 et cryptography==46.0.3 ; prepare-home-tools.py ; signing-media.py restore --recovery-key-file /tmp/rk.txt ; build-media-149.py --real ; commit + push. UN lien raw https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/<commit>/downloads/Yanis-Fitness-Evolution-1.4.9.apk. Ne jamais fabriquer/publier clé.
6. IA conversationnelle en dernier.

Contraintes : ≤10 générations par tour (échecs compris, suite pour continuer), aucune famille C ; visage A et références planches/maitre-homme.png pour Yanis, maitre-femme.png pour Émilie ; pas de rotation/miroir global ; prescription jamais réécrite pour justifier une image ; jamais vélo/elliptique recovery piscine ; gauche = début ; même cadrage/machine/orientation ; vert lime sur muscle cible aux DEUX cases et vrai mouvement ; reprises prioritaires avec stratégie différente. Chaque tour : CE-QUI-COINCE.md, PASSATION.md, vérification, ce bloc à jour ; commit + push branche Arena seulement ; présenter contrôles review/ et PASSATION.md ; terminer message par bloc de reprise actualisé ; prévenir 🚩 si contexte proche de limite.

Environnement réinitialisable : .cache ne persiste pas. Restaurer branche ci-dessus seulement si nécessaire et arbre propre. Venv : python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy pymupdf. Web/payloads/APK se régénèrent. Java/apksigner seulement au tour de signature.
