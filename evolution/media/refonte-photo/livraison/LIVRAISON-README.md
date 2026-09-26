# État actuel — lot 55, 26 septembre 2026

**388 couples valides / 1 restant**, PDF 131 pages. N° 387 talons-fesses homme,
n° 388 talons-fesses-effort homme (copie conforme). Reste elliptique-fractionné homme.
APK non signé contrôlé : 388 GIF, 714 fichiers web ; aucune signature effectuée.
Branche : `arena/01a0dcad-jarvis-fitness-yanis-emilie-ap`.
La suite utilisateur (relecture, niveau cardio, images chrono) précède la signature.
Les sections suivantes documentent les livraisons historiques.

# Livraison finale — refonte photo des 331 animations (prête à signer)

25 septembre 2026. **331 / 331 couples validés, 0 restant** : chaque exercice de l'app
(11 rubriques, 2 profils, étapes 1–7 conservées) a son animation refaite à partir de la
photo validée (homme = `planches/maitre-homme.png`, femme = `planches/maitre-femme.png`,
visage A), lue case par case avant acceptation.

## Contenu du paquet

- `manifeste-331.json` : pour chaque couple `identifiant|athlete` — surface, noms d'affichage,
  chemin du GIF livré, SHA-256 du GIF, nombre de frames (2), taille (≈ 440 px de haut),
  planche source pleine résolution (`planches/lotNN/*.png`, 1456×720 = 2 cases côte à côte).
- GIFs livrés : `evolution/media/refonte-photo/gif/{homme,femme}/<identifiant>-<athlete>.gif`
  (2 images, 500 ms, boucle infinie — spécification identique à la 1.4.0).
- Planches pleine résolution : `evolution/media/refonte-photo/planches/lot01..lot45/*.png`.
  Les étapes de protocole/aqua tabata qui partagent un geste avec un guide déjà validé
  pointent vers la planche d'origine (copie conforme du GIF, comme l'app d'origine partageait
  ses médias) — le manifeste le documente case par case.
- Index visuel de contrôle : `review/index-general.jpg` (331 vignettes numérotées).
- Mesures : `verification/verif-gifs.json` (331 GIF contrôlés : frames, durées, boucle,
  identifiant/athlète du plan, vert des deux cases, quasi-doubles, orphelins).

## Intégration dans l'APK (à faire au tour de livraison)

1. `evolution/media/candidate/refonte-331-map.json` (cle → GIF) alimente le bundle candidat
   (`evolution/media/candidate/build.mjs`) : chaque résolution `/media/*` de l'app d'origine
   est remplacée par le GIF refondu du même identifiant, sans toucher catalogue,
   prescriptions, durées ni consignes (règle : jamais réécrire une prescription pour
   justifier une image).
2. Contrôles post-bundle : `node evolution/media/coverage.mjs`, `node --test
   evolution/media/tests/*.test.mjs`, comparaison AST au périmètre autorisé,
   fidélité 271/272 fichiers web hors média remplacé.
3. Signature : **uniquement avec la cle de l'utilisateur**, re-collée par lui au moment du
   build (`/tmp/rk.txt`, mode 0600, jamais publiée, jamais créée ici). v2+v3, alignement,
   empreinte SHA-256 publiée à côté de l'APK.
4. Dépôt : `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`,
   puis **un seul lien raw GitHub** dans le chat.

## Chantiers connexes (non bloquants)

- Lot « style » : 33 GIF ayant une case sans vert lime (`production/style-a-reprendre.json`),
  reprise sans toucher aux gestes, selon la décision utilisateur §3 de `CE-QUI-COINCE.md`.
- Relecture cumulative : **TERMINÉE** (331 / 331 relus, relecture 26 du 26/09 ; 3 GIF refaits au lot 50 :
  torsion-allongee, souleve-de-terre, transition ; rowing-assis-etirement cases remises dans l'ordre).


---

## État lot 47 (build exécuté)

- `association-331.json` : table clef → chemins `/media` d'origine (193 clefs ; les 138
  noms SVG sont couverts par le patch `EXO_GIFS` + le hook `REFONTE_MEDIA`).
- `overlay-report.json` : rapport chiffré de l'overlay (copies, écrasements, patches).
- APK **non signé** construit : `.cache/build/Yanis-Fitness-Evolution-1.4.9-non-signe.apk`
  (103 440 048 o, 331 GIF intégrés, contrôles node OK). `.cache` n'est pas persistant :
  régénérer via `tools/rebuild-assoc-331.py` + `tools/overlay-331.py` + repackage.
- Athlète par profil : 6 identifiants partagés homme/femme résolus dynamiquement par
  `activeProfile` (localStorage `jarvis_fitness_v3`) — Émilie voit la femme, Yanis l'homme.
- **Manque uniquement : la clé de signature utilisateur** (jamais fabriquée ni publiée),
  puis dépôt `downloads/…-1.4.9.apk` + `.sha256` + `.fidelity.json` + lien raw unique.

---

## État lot 50 (26 septembre 2026)

- Branche de session : `arena/01a0dbe5-jarvis-fitness-yanis-emilie-ap`.
- Manifeste rafraîchi par `evolution/media/tools/maj-manifeste-331.py` (SHA/frames/taille re-mesurés,
  planche source retrouvée par correspondance d'image) ; `candidate/refonte-331-map.json` à jour.
- PDF de revue régénéré avec les mêmes numéros (n° 169, 180, 327, 330 = nouvelles images).
- Chaîne APK rejouable sans clé : `node evolution/media/tools/payloads-148.mjs` →
  `python3 evolution/media/tools/overlay-331.py` → `python3 evolution/android/build-media-149.py --unsigned`
  (contrôles : 9 DEX identiques, 657 fichiers web, 331 GIF refonte SHA OK dans le zip, hook complet,
  aucun média manquant ; APK non signé 103 757 865 o).
- **Signature** : `python3 evolution/android/build-media-149.py --real` après
  `signing-media.py restore --recovery-key-file /tmp/rk.txt` (clé utilisateur, jamais créée ici) ;
  dépôt `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json` + lien raw unique.
