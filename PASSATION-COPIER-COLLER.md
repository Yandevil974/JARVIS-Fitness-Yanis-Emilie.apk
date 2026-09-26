# BLOC À COPIER-COLLER DANS UN NOUVEAU CHAT — lot 57, 26 septembre 2026

Tu reprends la refonte des visuels JARVIS Fitness (Yanis & Émilie), dépôt Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk. Branche portant tout le travail : `arena/01a0dcad-jarvis-fitness-yanis-emilie-ap`. Jamais push sur main ; ne jamais supprimer/renommer la racine ni .git. Cette session a repris l'ancienne branche 01a0dbe5 au commit e96e51b. Si Arena impose une autre branche, récupérer le contenu de la branche ci-dessus (vérifier d'abord l'absence de modifications locales), travailler et pousser uniquement sur la branche imposée ; mettre à jour les branches dans ce fichier, PASSATION-NOUVEAU-CHAT.md, CE-QUI-COINCE.md et tools/pdf-revue-331.py.

Lire dans l'ordre :
1. evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md (état prioritaire lot 57, recette, pièges ; anciens compteurs historiques).
2. CE-QUI-COINCE.md (§0 feuille de route utilisateur, §1 reprises, §3 décisions).
3. evolution/media/refonte-photo/verification/VERIFICATION-2026-09-25.md §66–74.
4. evolution/media/refonte-photo/livraison/LIVRAISON-README.md et manifeste-331.json.

ÉTAPE2 — retours PDF reçus : **22 numéros signalés + 3 variantes = 25 points ouverts**.
NOUVELLE CONSIGNE : « Montre-moi corrections avant validation ». Aucun GIF livré/PDF principal/
manifeste/état/map remplacé sans accord explicite par numéro. Les 389 entrées livrées sont inchangées,
mais les statuts « valides » historiques ne valent pas acceptation après ces contestations.
Registre complet : production/retours-utilisateur-2026-09-26.json ; reprises dans a-refaire.json.
Numéros : 19,26,31,37,44,45,46,64,80,85,87,90,126,148,150,194,204,222,298,239,265,380.
Extensions : marteau assis38 ; Zottman assis47 et Scott un bras48.
Lot57 : **10 générations**, 3 propositions 19/37/64 isolées dans propositions/lot57/.
Comparatif à montrer : review/LOT57-propositions-avant-validation.pdf (4 pages). AUCUNE validée.
19 jambe corrigée mais teinte olive, ZERO pixel lime strict → renforcer avant intégration.
37 marteau corrigé par schéma vertical, vert faible. 64 banc décliné corrigé par schéma tête basse.
Refus internes 26/31/38/44/45 : pas encore corrections réussies. Autres points à traiter.
Clarifier : 148 = Mountain climbers homme ; Pallof élastique femme =149. N°150 corps/cadrage
stable, seuls bras mobiles ? Zottman46/47/48 : proposer 4 phases montée supination / descente pronation,
accord avant modification format. 80 registre Écartés haltères vs « incliné » demandé : à confirmer.
265 = étirement pectoral avant-bras90° sur montant + petite fente avant, expliquer le geste.
PDF PRINCIPAL inchangé : 131 pages /389 exercices, numéros fixes. Assertions : PDF/manifeste/état/
numéros/TOUS GIF livrés identiques. Aucune reconstruction APK ce tour. Détail VERIFICATION §74.
Suite : montrer/attendre avis, puis continuer reprises par lots≤10 ; pas d'étape3 sans instruction.

Câblage athlète = profil déjà posé dans tools/overlay-331.py : globalThis.__refonteSwap + patch bt + constante If (§70). Yanis homme, Émilie femme pour les variantes produites, désormais toutes disponibles sur piscine/cardio. 33 GIF historiques avec une case sans vert : lot style UNIQUEMENT sur décision utilisateur.

Chaîne après lot : verif-ids.py → lecture des DEUX cases pleine définition (zoom PIL au doute ; enlever bandes grises/grilles 2×2 par PIL) → refonte-sheet.py --athlete homme --out $R/gif/homme --sheet $R/review/lotNN-homme.jpg planches_acceptées → tools/valide-couples.py --athlete homme --lot lotNN --acceptes a,b (copies, manifeste, état, numéros PDF, map) → tools/pdf-revue-331.py → tools/index-general.py → docs → commit + push branche session. Mesurer vert sur CORPS (pas plantes du décor). Ne jamais intégrer les refus.

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
