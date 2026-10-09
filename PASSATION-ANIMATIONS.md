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


## Précisions utilisateur — reprise du 9 octobre 2026

- Le drapeau rouge signale uniquement la limite de discussion du chat : préparer alors
  la consigne et la passation. Il ne signale pas le budget de génération d'images.
- Objectif suivant : **10 nouveaux GIFs**, avec planches consultables et téléchargeables
  sur GitHub dès chaque exercice complet. Le plafond reste 10 appels image par tour,
  rejets inclus ; 10 GIFs à trois poses nécessitent plusieurs tours.
- Avant génération, rechercher la technique dans des sources fitness, GB Performance,
  YouTube et autres sources pertinentes ; consigner uniquement les sources réellement
  consultées et signaler les éventuelles restrictions d'accès.
- Reprise sur `arena/7967ce00-jarvis-fitness-yanis-emilie-ap`, historique `cafe252`
  récupéré par avance rapide depuis la branche précédente, sans changement de branche.
- Ce tour est un bilan avant production : **0 appel image, 0 nouveau GIF**.
- Ordre prévu : 4 GIFs manquants B-03 (leg press H ; back squat, squat cycliste et
  leg press F), puis 6 GIFs B-04 (leg extension, front squat, fentes bulgares haltères
  pied avant surélevé, H et F). Le POC back squat H reste intact et hors de ces 10 nouveautés.
- Vérification fichiers : sources A/M/B du squat cycliste H présentes, GIF 460×257
  à 4 frames, planche 1440×300. POC back squat présent mais toile portrait 480×860,
  non conforme au format paysage actuel ; examen visuel détaillé encore à faire.
- Compteur historique conservé : 74/614, 540 restantes. Le dénominateur historique
  « Thème B : 14/187 » nécessite une harmonisation avec le périmètre H+F avant
  d'en tirer un pourcentage ; ne pas le modifier sans audit.


## Dernier tour de production — 9 octobre 2026

- **10 appels image, 0 nouveau GIF livré**, compteur inchangé **74/614**, 540 restantes.
- POC back squat H audité : portrait, disques coupés latéralement, B debout (pas trois
  profondeurs). Corps entier visible en A. Conservé intact ; correction soumise à accord.
- Leg press H : 3 essais A rejetés ; pas de position retenue.
- Squat cycliste F : A retenue sur **cale inclinée** (pas disque) dans
  `themeB/femme/_sources/B-03F/squat-cycliste-squat-complet-A.png`.
  M/B dans `_travail/B-03F/` NON VALIDÉES : profondeur insuffisante malgré RMSE conforme.
- Planche consultable : `themeB/femme/LOT-B03F-squat-cycliste-PLANCHE-TRAVAIL.jpg`.
  Ce n'est ni un GIF livré ni une planche finale. Ne pas incrémenter le compteur.
- Prochain travail : M/B du cycliste F depuis A retenue, puis leg press H/F et back squat F.
  Ne pas chaîner depuis M/B non conformes. B-04 reste à produire ensuite.
- Sources techniques et 10 tentatives détaillées dans la dernière section de `SUIVI.md`.
  Recherches GB Performance/YouTube sans tutoriel exploitable ; aucune vidéo visionnée.
- Branche de reprise actuelle : `arena/7967ce00-jarvis-fitness-yanis-emilie-ap`.
  Les paragraphes antérieurs sont historiques ; ce dernier bilan prévaut pour la reprise.


## État courant après la reprise suivant `1f099e7` — 9 octobre 2026

- **Squat cycliste FEMME : A + nouvelle M retenues (2/3), B non validée.**
- Sources à utiliser : `themeB/femme/_sources/B-03F/squat-cycliste-squat-complet-{A,M}.png`.
- Nouvelle M : identité et appuis contrôlés, RMSE A→M **0,0944469**, pas de doublon PNG.
- `_travail/B-03F/` contient seulement des essais refusés ; son M est OBSOLÈTE.
- Planche `themeB/femme/LOT-B03F-squat-cycliste-PLANCHE-TRAVAIL.jpg` mise à jour :
  A/M retenues, B explicitement refusée. « Travail non livré » = essai, pas GIF achevé.
- **8 appels image ce tour**, 1 image retenue comme M, 7 autres refusées comme B.
  Arrêt volontaire avant 10 : plusieurs guidages échouent sur la profondeur complète.
- Aucun nouveau GIF : **74/614**, 540 restantes ; objectif 10 nouveaux GIFs : 0/10.
- Recherches : Women's Health, transcription YouTube Katie Orlic et texte/photo SimpliFaster.
  Détail des URL, contrôles et méthodes infructueuses dans la dernière section de `SUIVI.md`.
- Priorité : trouver un guidage de pose B qui descende réellement sous les genoux, sans
  changer identité/cadrage/appuis. Ne pas répéter à l'identique les essais déjà refusés.
- Leg press H/F, back squat F et B-04 restent à produire. Aucun POC ou GIF existant remplacé.
