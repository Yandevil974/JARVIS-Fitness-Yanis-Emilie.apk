# Audit des démonstrations — en cours, pas un nouvel APK

**Mis à jour le 23 septembre 2026.** Demande : retrouver des visuels fidèles aux exercices, dans toutes les rubriques, sans incohérence anatomique/orientation, notamment sur les dips/triceps. L’IA conversationnelle reste en pause.

## Avancée suivante — candidat ciblé et continuité vérifiée

L’utilisateur demande de **continuer dans ce chat** et de **lui remettre la passation à chaque étape**, sans « démonter » l’application. Premier correctif préparé à part : [candidate/README.md](candidate/README.md), rapport [candidate/validation.json](candidate/validation.json).

Le candidat isole les guides piscine du cardio et résout l’image/guide/zoom des chronos aquatiques sans réécrire les données enregistrées. Les vrais segments cardio sont préservés. **271/272 fichiers web inchangés**, 17 tests Node (9 audit + 8 candidat), 6 parcours navigateur ciblés et 8 tests accueil/non-régression réussis. L’APK publié est intact. Les récupérations génériques restent explicitement incomplètes ; aucun nouveau média n’est ajouté. **26 groupes toujours ouverts, aucune livraison corrigée.**

## Consignes de continuité — dernière demande utilisateur

**Continuer à l’identique sur l’application complète et le style validé, sans repartir de zéro.** Cela signifie conserver ce qui fonctionne, pas conserver les visuels fautifs. Préserver les deux profils, les 209 exercices et toutes leurs variantes, les 11 rubriques, les charges/historiques/données, les chronos, les étapes 1–7 et l’accueil validé (orbe bleu tournoyant, thèmes colorés, carte « Prochaine séance » d’origine).

- **Tous les exercices doivent être pourvus du bon visuel**, dans musculation, échauffement/approches, piscine, Tabata sol/aqua et étirements. Inclure les phases de récupération et les différentes surfaces d’affichage. Pas de validation finale avec des images génériques, absentes, cassées ou d’un autre mouvement.
- **Aucune coquille d’animation acceptée** : contrôler toutes les images de chaque séquence, la tête/le corps/les appuis, l’orientation, le bon matériel et la bonne posture, les transitions, la boucle et le cadrage réel. Un GIF décodable ou une première image correcte ne suffisent pas. Ne pas transformer un défaut en rotation/miroir global.
- Garder les illustrations/animations d’origine lorsqu’elles sont correctes ; pas de remplacement global par des photos, pas de réécriture des consignes pour s’adapter à une mauvaise image. La proposition photographique dips reste non approuvée.
- **Piscine, nage fractionnée, récupération : aucun vélo ni elliptique à sec.** Le visuel doit suivre la consigne aquatique de l’étape (marche dans l’eau, nage douce, récupération au bord selon le cas), sans modifier le programme. Les vrais blocs elliptiques des séances mixtes restent distincts et conservés.
- Continuité technique : même package et même certificat 1.4.0 pour la future mise à jour, pas de nouvelle application parallèle. IA après le travail de l’application et les essais utilisateur.

### Nouveau point d’audit : récupération piscine → elliptique

Signalement utilisateur enregistré dans `pool-recovery-to-cardio` : **26 groupes ouverts** au total. Le mécanisme de repli est reproduit dans le code livré : `bg("Récupération active", "pool")` et `bg("Récup active", "pool")` sélectionnent `cardio-recup-active.jpg`, dont l’image montre un elliptique à sec. `bg` essaie les guides cardio après les guides piscine même en contexte piscine.

**Limite importante :** les 24 récupérations des trois niveaux du Swim Interval standard contiennent le mot « marche » et résolvent vers la marche aquatique dans ce résolveur. Le chemin exact de l’écran signalé sur le téléphone reste à reproduire. Vérifier les séances complémentaires, les noms génériques et les minuteurs enregistrés : `v5` affiche `step.img` en priorité. Un correctif du seul catalogue ne garantit donc pas la correction de toutes les surfaces.

**9 tests de caractérisation/provenance passent au 23 septembre** : les 6 existants relancés et 3 nouveaux tests exécutant les fonctions `Ge/bg` extraites du bundle signé, après contrôle des SHA. Ils documentent le défaut actuel et la distinction piscine/cardio ; **ils ne valident pas une correction**, et n’incluent pas les essais navigateur du candidat décrits plus haut. Aucun test téléphone.

### Point de reprise après interruption

Les planches des 16 premières animations longues ont été affichées dans l’échange interrompu, mais aucun registre de validation complète n’a été conservé. Ne pas annoncer les 46 animations longues/588 images entièrement validées. Le script et les planches temporaires de cette tentative ne sont pas présents après la réinitialisation ; poursuivre à partir des inventaires persistés et consigner les décisions par média/association. **Aucun correctif de production ni nouvel APK à cette étape.**

## Résultat à ce stade

**Le signalement est fondé.** Il existe des erreurs de correspondance, des substitutions automatiques excessives, des conflits piscine/sol et des défauts à l’intérieur de certains fichiers. La 1.4.0 publiée n’a pas été corrigée par cet audit. Aucun nouvel APK ni changement de signature.

| Périmètre du catalogue réellement embarqué | Inventaire et contrôle effectués | Constats |
|---|---|---|
| Musculation, deux profils réunis | 209 exercices et leurs associations effectives | 95 indiqués « exact », 104 « variante », 10 « famille ». Ces étiquettes ne prouvent pas la justesse : même certaines associations « exact » sont fausses. |
| Échauffement | Générateur `Bg`, ses trois images et ses étapes conditionnelles | Même image de bras pour hanches/chevilles et activation fessiers. Développé couché pour toutes les séries d’approche, même avant un squat. |
| Piscine | 19 guides, 6 protocoles × 3 niveaux, **420 étapes** résolues | Plusieurs gestes terrestres sans rapport avec les consignes aquatiques. Les récupérations doivent aussi rester cohérentes avec la consigne et le contexte aquatique ; aucun repli vers vélo/elliptique. |
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

Les **26 groupes de constats ouverts** sont documentés dans [review/findings.json](review/findings.json). Ils ne constituent pas une promesse qu’il n’existe aucune autre erreur.

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
- **9 tests de caractérisation/provenance de l’audit réussis au 23 septembre.** Ce ne sont pas des tests attestant une application corrigée, ni une validation clinique de technique sportive.

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
node --test evolution/media/tests/*.test.mjs
```

Le serveur d’inspection est temporaire, limité aux fichiers web extraits, fermé après la capture ; aucun fichier privé n’est servi. Son instrumentation n’est jamais écrite dans un APK. Les sorties régénérées doivent correspondre aux instantanés `review/`. Ne pas reconstruire l’application à partir des seules anciennes sources React.
