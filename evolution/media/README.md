# Démonstrations d’exercice — correctifs 1.5.0 construits, APK signé en attente

**22 septembre 2026.** L’audit du 21 septembre (25 groupes de constats) est maintenant **traité correspondance par correspondance** : table de revue explicite, bundle web 1.5.0 patché à partir de l’exact bundle 1.4.0, tests de logique + rendu DOM, script de réempaquetage Android (même package, même clé). **Le fichier APK signé n’existe pas encore** : la sauvegarde privée de la signature 1.4.0 n’est pas présente dans cet environnement (voir « Livraison »).

## Ce qui est livré dans le dépôt

| Élément | Fichier | Contenu |
|---|---|---|
| Table de revue | [`mapping.json`](mapping.json) (générée par [`review/compose-mapping.py`](review/compose-mapping.py)) | 209 exercices : **119 exact · 64 variante · 26 none** (56 associations changent par rapport à la 1.4.0) ; 42 mouvements Tabata au sol (38 démonstrations dont 17 dessins ajoutés, 3 repos, 1 absence) ; 19 guides piscine dont 6 réassociés ; 29 étirements dont 8 revus (2 nouveaux dessins) ; échauffement (5 étapes + approches, 2 nouveaux dessins). Chaque entrée garde `previous` (ce que la 1.4.0 affichait) et une `note` lisible dans l’application pour toute variante ou absence. |
| Correctif du bundle | [`build.mjs`](build.mjs) | Refuse tout autre bundle que le 1.4.0 (SHA `f80a7e82…`), applique 17 remplacements à ancre unique + le remplacement du bloc d’alias `Z4…eo`, puis vérifie que le résultat s’analyse (acorn). Sortie : `.cache/media-web/` (racine web complète) + `.cache/media-build-report.json`. |
| Nouveau média | [`assets/dips-triceps-corrige.gif`](assets/dips-triceps-corrige.gif) | Dips aux barres parallèles : image basse d’origine, **image haute redessinée dans le même style** (2 positions fixes, 650 ms). L’original reste dans l’APK ; `mapping.dips.variant` permet d’y revenir. |
| Aperçu avant/après | [`review/corrections-apercu.jpg`](review/corrections-apercu.jpg) | 16 corrections représentatives (musculation, piscine, étirement, échauffement). |
| Constats | [`review/findings.json`](review/findings.json) | 25 groupes : **16 corrigés, 7 absences explicites, 2 partiels** (variante annotée), chacun avec sa `resolution`. |
| Tests | [`tests/build.test.mjs`](tests/build.test.mjs), [`tests/dom-smoke.mjs`](tests/dom-smoke.mjs), [`tests/audit.test.mjs`](tests/audit.test.mjs) | 11 tests Node (mapping complet, fichiers présents, contexte sol/aqua, normalisation, invariants du bundle) + **132 contrôles de rendu réel du bundle patché** dans happy-dom (accueil, chrono Tabata sol/aqua/échauffement/étirements, 16 fiches, protocoles piscine, liste des étirements) + 6 tests de provenance de l’audit. |
| Android | [`../android/build-media.py`](../android/build-media.py), [`../android/release-media.json`](../android/release-media.json), [`../android/tests/test_media_release.py`](../android/tests/test_media_release.py) | 1.4.0 signé → **1.5.0 / code 12**, package `app.yanis.fitness.evolution.home` inchangé, 9 DEX / `resources.arsc` / `capacitor.config.json` identiques, seuls `AndroidManifest.xml` (version) et le bundle changent, 18 médias ajoutés. Candidat **non signé** vérifié (`.cache/media-release/`). |

### Ce que l’application fait désormais

- **Racine du défaut corrigée** : la normalisation `Ge()` transformait les traits d’union/apostrophes des clés de guides, donc 20 exercices (tractions, step-up haut, kickback poulie drop set, Pallof press…) perdaient leur propre image et le tableau d’alias/score `Z4` en substituait une autre. Les clés sont normalisées à la source ; l’alias `gg` (French press → poulie) est supprimé ; **le score par famille n’existe plus** : chaque exercice a une décision de revue.
- **Trois états visibles** : « Illustration humaine · source » (exact) ; « Même mouvement, détail différent · voir la note » (variante, avec la différence écrite : matériel, uni/bilatéral, angle, assis/debout) ; carte **« Pas de démonstration pour ce mouvement »** (aucun autre mouvement n’est affiché, la consigne écrite reste). Les étapes de repos gardent le guide respiratoire.
- **Contexte sol / piscine** : `JarvisMedia.movement(nom, meta.type)` — « Gainage planche », « Battements de jambes », « Montées de genoux », « Marche sur place » ne prennent plus un guide piscine dans un Tabata au sol ; les consignes piscine n’apparaissent que dans les chronos aqua/nage ; un nom aqua inconnu n’affiche jamais un GIF terrestre.
- **Piscine** : ciseaux, talons-fesses, gainage au bord, mobilité épaules et hanches/chevilles utilisent les illustrations aquatiques déjà présentes dans la source elite ; la note de variante s’affiche sous l’illustration dans le protocole et dans le chrono.
- **Échauffement** : bas du corps → mobilité hanches/chevilles sans image (absence explicite au lieu de cercles de bras), activation fessiers → pont au sol ; haut du corps → activation scapulaire sans image ; **les séries d’approche montrent la démonstration validée du premier exercice de la séance** au lieu du développé couché.
- **Étirements** : pigeon assis → posture assise ; « Main dans le dos » → coude levé (variante) ; mollet en escalier et croisement debout → absence explicite ; 5 fiches gardent leur image en variante annotée.
- **Minuteurs déjà enregistrés** : les images persistées dans les étapes sont réévaluées à l’affichage (`JarvisMedia.stepImage`), sans toucher aux durées, charges ou données.

### Dessins ajoutés pour les lacunes (lots 1–3, 22 septembre, réversibles)

17 dessins générés **dans les styles existants de la bibliothèque** (référence : GIF dips pour les GIF 2 positions à 650 ms ; fiches `stretch-*.jpg` pour les deux étirements), contrôlés un par un (orientation constante entre les deux positions, un seul personnage, position conforme à la consigne ; 5 premières versions rejetées et refaites). Aucun visuel existant n’est remplacé. Planches : `review/proposals-tabata-lot1.jpg`, `review/proposals-lot2.jpg`, `review/proposals-lot3.jpg` ; fiches `review/proposals-lot*.json` ; fichiers `assets/tabata-*.gif`, `assets/warmup-*.gif`, `assets/stretch-mollet-escalier.jpg`, `assets/stretch-adduction-croisee.jpg`.

- **Tabata au sol** : jumping jacks, burpees (+ simplifiés en variante annotée), squats sautés, montées de genoux (+ high knees, marche sur place en variante annotée), patineurs, chaise au mur (+ chaise douce), superman, russian twist, dips au bord, squats sumo, battements de jambes (sol — en piscine le GIF aquatique reste), crunch, corde invisible. Seul « Échauffement progressif » (échauffement libre) garde la carte d’absence.
- **Échauffement** : mobilité hanches & chevilles, activation scapulaire (`Bg` patché : chaque étape a son propre visuel).
- **Étirements** : mollet en escalier, adduction de la hanche debout (jambe croisée).
- **Retirer un dessin** : enlever son nom de `VALIDATED_PROPOSALS` (`review/compose-mapping.py`) ou remettre l’entrée `N(...)` correspondante, relancer la chaîne ; la carte « Pas de démonstration » revient.

### Lacunes restantes (assumées, visibles dans l’app)

- **26 exercices de musculation sans démonstration** : face pull ×2, clamshell, 12 curls Scott/Zottman/concentration/poulie basse, California press, pullover ×2, good morning, leg extension, mollets presse, glute ham raise, drop lunges, crunch swiss ball, ab wheel, wood chop. Prochain lot de dessins (avec matériel), à montrer dans le chat.
- « Échauffement progressif » (Tabata) et « Étirements au bord » (piscine, partiel).

## Livraison — ce qu’il reste pour l’APK

```bash
node evolution/media/build.mjs                       # bundle 1.5.0 patché (.cache/media-web)
node --test evolution/media/tests/*.test.mjs         # 11 tests
python3 evolution/android/build-media.py --unsigned-candidate   # repack vérifié, NON signé
python3 -m unittest evolution/android/tests/test_media_release.py
# Sur la machine qui possède .private/yanis-fitness-evolution-home (sauvegarde 1.4.0 restaurée),
# le JDK (.cache/signing-tools/jdk4py) et apksigner (.cache/home-tools, SHA ef49417931f9…) :
python3 evolution/android/build-media.py             # signe avec LA MÊME clé 1.4.0 → downloads/Yanis-Fitness-Evolution-1.5.0.apk
```

Aucune clé n’est générée, aucun secret n’est demandé dans le chat. Le script refuse d’écrire un APK non signé dans `downloads/`.

### Aperçu dans le navigateur

`python3 -m http.server 8080 --bind 0.0.0.0` dans `.cache/media-web/` sert l’application 1.5.0 patchée (état local du navigateur, deux profils). Contrôle DOM complet : `node evolution/media/tests/dom-smoke.mjs` (nécessite `cd .cache/dom-tools && npm install happy-dom`).

---

# Audit du 21 septembre 2026 (conservé pour référence)

**21 septembre 2026.** Demande : retrouver des visuels fidèles aux exercices, dans toutes les rubriques, sans incohérence anatomique/orientation, notamment sur les dips/triceps. L’IA conversationnelle reste en pause.

## Résultat à ce stade

**Le signalement est fondé.** Il existe des erreurs de correspondance, des substitutions automatiques excessives, des conflits piscine/sol et des défauts à l’intérieur de certains fichiers. La 1.4.0 publiée n’a pas été corrigée par cet audit. Aucun nouvel APK ni changement de signature.

| Périmètre du catalogue réellement embarqué | Inventaire et contrôle effectués | Constats |
|---|---|---|
| Musculation, deux profils réunis | 209 exercices et leurs associations effectives | 95 indiqués « exact », 104 « variante », 10 « famille ». Ces étiquettes ne prouvent pas la justesse : même certaines associations « exact » sont fausses. |
| Échauffement | Générateur `Bg`, ses trois images et ses étapes conditionnelles | Même image de bras pour hanches/chevilles et activation fessiers. Développé couché pour toutes les séries d’approche, même avant un squat. |
| Piscine | 19 guides, 6 protocoles × 3 niveaux, **420 étapes** résolues | Plusieurs gestes terrestres sans rapport avec les consignes aquatiques. Les étapes « Repos »/« en place » sans démonstration ne sont pas des exercices manquants. |
| Tabata/HIIT au sol | 6 modes, **38 noms distincts** | 4 sélectionnent des guides de piscine ; 34 ne trouvent aucune démonstration et le composant montre une photo générique de récupération. |
| Tabata/HIIT aqua | Les 6 noms du générateur, distincts des 19 guides | À contrôler par contexte et par consigne, pas uniquement par mot-clé. |
| Étirements | 29 fiches avec image et consigne | Plusieurs positions ne correspondent pas au texte ; exemple : pigeon au sol, tête coupée, pour une consigne de piriforme assis. |
| Cardio elliptique/transition | 5 guides et leurs ressources | Images repérées et positions clés examinées ; ne pas les confondre avec les protocoles aquatiques. |

### Exemples confirmés

- **Dips** : le fichier `/media/c3a2b9892161522e.gif` a deux images. Le regard et l’orientation du haut du personnage changent de côté sans transition cohérente des appuis et du bas du corps. Ce n’est pas un simple `rotate(180deg)` à retirer. **Ne pas retourner arbitrairement l’image.**
- **Hip thrust unilatéral** → squat bulgare ; **step-up** → fentes ; **tractions** → tirage assis à la poulie.
- **Extensions de triceps avec haltères sur banc** → extension debout au-dessus de la tête à la poulie.
- **Face pull** → tirage vertical ; **leg extension** → presse ; **good morning** → soulevé de terre ; **pullover** → tirage vertical.
- **Bird dog** → planche latérale ; **respiration** → dead bug ; **roulette abdominale** → swiss-ball.
- **Gainage vertical au bord**, mobilité aquatique, ciseaux et talons-fesses : plusieurs images montrent un autre geste à sec.
- **Étirements** : marche/mollet illustré par un appui au mur ; triceps dans le dos illustré bras baissés ; flexion assise illustrée debout ; autres divergences recensées.

Les **25 groupes de constats ouverts** sont documentés dans [review/findings.json](review/findings.json). Ils ne constituent pas une promesse qu’il n’existe aucune autre erreur.

## Comparaison avec les versions fournies

Référence actuelle : APK signé 1.4.0, SHA `30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7`.

- Les **262 images** de la 1.4.0 sont identiques octet pour octet à celles du `JARVIS-Fitness.apk` complet fourni au commit `84e2986da2f004d4eae81e52a9a41e7b69e80f8d` (SHA `691488f08ada180de1022bf336b14024c71e52427cb2c43547ac3d53c8b8b5ab`), ainsi qu’à celles de la 1.3.0.
- Les 220 images communes avec `JARVIS-Fitness-Yanis-Emilie (1).apk` sont également identiques ; 42 autres images ont été ajoutées entre cette ancienne version et le complet fourni.
- Le GIF des dips de `JARVIS-Fitness-Sources.zip` est lui aussi identique. Revenir aveuglément à ces fichiers ne résout donc pas le défaut.
- `gi`, `Kh`, `s5`, `Bg`, `bg`, `w5`, `g3`, `W4` sont identiques à leurs versions du complet d’origine fourni. Le minuteur `v5` a d’autres correctifs fonctionnels ; ne pas l’écraser par une ancienne version.
- Cela **n’identifie pas la version présente sur le téléphone** et ne prouve pas que toutes les anciennes versions connues de l’utilisateur avaient ces erreurs.

## Ce qui a réellement été vérifié

- Données extraites **en exécutant le bundle de l’APK signé**, pas depuis le composant React historique `src/components/Movement.jsx`.
- 137 médias d’exercice inventoriés : **94 GIF animés et 43 images fixes**. Les 727 images internes ont été décodées sans erreur, avec tailles/durées/hachages enregistrés.
- Planches visuelles des première et médiane images de ces 137 médias examinées. Pour les 48 GIF à deux images, cela couvre leurs deux images, notamment les dips. Les fichiers à 12/24 images demandent encore une inspection visuelle complète avant validation définitive.
- Analyse des résolveurs, du générateur d’échauffement et du minuteur. La recherche par mot-clé sans contexte explique les conflits Tabata/piscine.
- **6 tests de caractérisation/provenance de l’audit réussis.** Ce ne sont pas des tests attestant une application corrigée, ni une validation clinique de technique sportive.

## Proposition illustrée, non intégrée

[Comparatif des dips](review/dips-comparaison.jpg) : ancien GIF à gauche, proposition photographique à droite.

Les deux photographies de `Parallel_Bar_Dip`, dans `yuhonas/free-exercise-db` au commit immuable `a859101d633a01c4a1a920d6a8ce41dabba0705f`, ont été examinées. Elles représentent le même sportif, le même côté de caméra et les deux positions sur barres parallèles. **Ce sont deux positions photographiques, pas une vidéo continue et pas une image modifiée par IA.**

Provenance et SHA dans [proposal-sources.json](review/proposal-sources.json), licence déclarée par le dépôt reproduite dans [PROPOSAL-LICENSE.md](review/PROPOSAL-LICENSE.md). L’exemple sert à choisir une direction pour les visuels faux/introuvables ; pas de remplacement esthétique global décidé. Les visuels valables doivent être conservés.

## Suite du travail — sans perdre les sept étapes ni l’accueil

1. Résoudre le choix du support lorsque le dessin d’origine est faux : illustrations anatomiques fidèles à rechercher, ou photographies réelles vérifiées en positions clés. Ne pas prétendre qu’un remplacement photographique est identique à l’ancien dessin.
2. Constituer une table explicite **exercice + position + matériel + contexte**, avec état de revue. Éliminer les substitutions par simple muscle/famille, y compris celles étiquetées « exact » à tort. Ne pas modifier un exercice ou ses consignes pour justifier une image.
3. Corriger toutes les surfaces : cartes et détails de bibliothèque, séance, échauffement/approches, fiches/chronos d’étirements, piscine, Tabata au sol/aqua, guides agrandis et miniatures. Prévoir les minuteurs déjà enregistrés avec leurs anciennes images.
4. Pour une ressource manquante ou cassée : absence explicite, jamais un autre mouvement silencieusement. Cela reste **une lacune**, pas la satisfaction de la demande « tous ont leur image ».
5. Tests de non-régression sémantiques et navigateur, les deux profils/thèmes : correspondances, contexte, animation complète, pause/mouvement réduit, absence de retournement/cadrage coupant la tête, absence de requête distante, maintien des charges/chronos/données.
6. Puis APK de mise à jour : même package `app.yanis.fitness.evolution.home`, **même clé 1.4.0**, version/code augmentés. Aucun changement d’identité autorisé. Lien direct après vérification de l’APK final. IA ensuite seulement.

## Reproduire

Dépendances de développement : dépendances Node existantes de `JARVIS-Fitness-Source`, Playwright/Chromium, Python + Pillow (inspection réalisée avec Pillow 12.3.0).

```bash
# JARVIS_CHROMIUM peut désigner un autre Chromium disponible.
LD_LIBRARY_PATH="$PWD/.cache/browser-libs/lib" \
  node evolution/media/capture.mjs .cache/media-audit/inventory.json
PYTHONPATH=.cache/image-tools \
  python3 evolution/media/inspect_assets.py
node --test evolution/media/tests/audit.test.mjs
```

Le serveur d’inspection est temporaire, limité aux fichiers web extraits, fermé après la capture ; aucun fichier privé n’est servi. Son instrumentation n’est jamais écrite dans un APK. Les sorties régénérées doivent correspondre aux instantanés `review/`. Ne pas reconstruire l’application à partir des seules anciennes sources React.
