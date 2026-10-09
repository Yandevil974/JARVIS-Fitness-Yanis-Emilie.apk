# PASSATION — reconstruction des animations JARVIS Fitness

**État de référence : 9 octobre 2026 · 74 / 614 animations livrées · 540 restantes**

- Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.
- Branche portant l'historique consolidé connu :
  `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap`.
- Dernier commit d'exercice connu : `069dd4f` — `squat-cycliste-squat-complet` HOMME
  (Lot B-03). Toujours vérifier le HEAD distant au début du prochain tour ; le sandbox peut
  revenir à un commit plus ancien.
- La consigne autonome à copier-coller est dans `CONSIGNE-A-COPIER-COLLER.md`.
- Journal des détails, décisions techniques, sources et rejets :
  `yanis-fitness-evolution/animations/SUIVI.md`.

## État des lots

| Thème / lot | État actuel |
|---|---|
| Thème A | **Terminé : 50/50** (25 HOMME + 25 FEMME) |
| B-01 — quadriceps | **Terminé : 3/3 exercices HOMME et 3/3 FEMME** |
| B-02 — quadriceps | **Terminé : 3/3 exercices HOMME et 3/3 FEMME** ; B-02F = 9/9 positions et assemblages produits |
| B-03 — quadriceps | **En cours, ne pas annoncer terminé** ; détails ci-dessous |

**Compteur Thème B : 14/187** (le détail des comptages est dans `SUIVI.md`).

## Lot B-03 — avancement et reprise

| Exercice | Matériel | HOMME | FEMME | Action |
|---|---|---|---|---|
| `back-squat` | barre | POC existant, qualité à recontrôler | À produire | Ne pas remplacer le POC sans accord explicite |
| `squat-cycliste-squat-complet` | poids du corps | ✅ Livré (`069dd4f`) | À produire | Garder l'identité validée ; vérifier les trois positions |
| `leg-press` | machine | À produire | À produire | Vérifier la technique et le matériel en ligne ; appliquer la recette machine |

### Livrable déjà commité : squat cycliste HOMME

- PNG A/M/B : `yanis-fitness-evolution/animations/themeB/_sources/B-03/squat-cycliste-squat-complet-{A,M,B}.png` (1376×768).
- GIF : `yanis-fitness-evolution/animations/themeB/squat-cycliste-squat-complet-3poses.gif` (460×257, 4 frames).
- Planche statique : `yanis-fitness-evolution/animations/themeB/LOT-B03-squat-cycliste-squat-complet-PLANCHE-FINALE.jpg` (1440×300).
- RMSE A→M **0,0778**, M→B **0,0911** (seuil minimal 0,030 respecté) ; contrôle identité 1:1 conforme.
- Technique : talons surélevés sur un disque noir, pieds rapprochés et pointes vers l'avant,
  buste droit, genoux dans l'axe des orteils, squat profond contrôlé.
- Vérification technique consignée dans le commit et le suivi :
  [Sport Équipements](https://www.sport-equipements.fr/squat-cycliste/),
  [SmartWorkout](https://smartworkout.app/en/exercise-library/legs/cyclist-squat),
  [Grand Est Cyclisme](https://www.grandestcyclisme.fr/squat-cycliste/).

## Prochaines actions

1. Ouvrir git sur la branche de session imposée par le prompt système et vérifier le HEAD, les
   fichiers et `git status` ; ne jamais changer de branche.
2. Lire `SUIVI.md`, `PLAN-THEMES.md` et la consigne autonome. Recontrôler le POC `back-squat`
   sans le remplacer ; inscrire un verdict clair. Toute reprise du POC nécessite l'accord
   explicite de l'utilisateur.
3. Poursuivre le Lot B-03 : `leg-press` HOMME puis les versions FEMME prévues (`back-squat`,
   squat cycliste, leg press). Recherche technique en ligne et contrôle du matériel avant chaque
   exercice.
4. Pour chaque nouvelle image : repartir d'une pose de référence validée ; identité, carrure et
   cadrage à contrôler à 1:1 ; RMSE entre positions **≥ 0,030** ; budget de **10 appels IA max
   par tour**, rejets inclus. Vérifier les appuis par crop/zoom plutôt que rejeter sur impression.
5. Assembler les planches du lot uniquement à partir des GIFs/images validés ; committer et
   pousser chaque exercice complet sur la branche autorisée ; actualiser les trois documents.
6. Ne jamais annoncer B-03 complet avant que les statuts HOMME/FEMME et les assemblages requis
   soient réellement vérifiés.

## Recettes et réserves à conserver

- **Identité mannequin** : peau blanche argentée lisse et mate (pas de fibres grises striées, pas
  d'aspect écorché), carrure massive identique à la référence validée, même cadrage et échelle.
  Éditer une pose de référence ; ne pas générer sur texte seul ni chaîner depuis une image non
  conforme. Contrôle 1:1 du buste avant assemblage. Les paragraphes de masse exacts HOMME/FEMME
  et les références sont dans `CONSIGNE-A-COPIER-COLLER.md`.
- **Leg press** : référence machine = `themeB/_sources/B-02/presse-a-cuisses-pieds-hauts-{A,M,B}.png` ;
  référence d'identité = pose validée du profil cible dans le Thème A. Ne pas confondre
  `leg-press` et `presse-a-cuisses-pieds-hauts` : ce sont deux entrées distinctes.
- **Femme sur la presse** : trois stratégies de repositionnement ont échoué. La seule méthode
  validée est « garde tout, ne bouge rien » : conserver machine, jambes, pieds et appuis de la
  frame HOMME conforme, et ne changer que torse/tête/identité. Les rejets et formulations exactes
  sont documentés dans `SUIVI.md` ; ne pas réessayer les stratégies refusées.
- **Réserve B-02F** : mi-course de la presse acceptée à RMSE **0,0360** (juste au-dessus du seuil,
  amplitude moins franche) ; presse inclinée à chariot. Ne refaire cette image que sur demande.
- Les GIFs, planches et sources doivent être commités et annoncés avec un lien GitHub direct :
  l'utilisateur n'a pas le visualiseur Arena.
