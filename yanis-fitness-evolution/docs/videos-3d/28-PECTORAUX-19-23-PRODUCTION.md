# Pectoraux #19→#23 — photos et prompts de production

> **Mise à jour après dépôt :** les cinq sont intégrés `coached` avec réserves.
> La source déposée pour #21 est identique à P11/T10 ; la prise rapprochée est
> corrigée par le poster et la voix. Voir le
> [contrôle du dépôt](./29-PECTORAUX-19-23-CONTROLE-MP4.md). Les indications
> « à produire » ci-dessous décrivent l'état historique du kit initial.

**Date : 29/10/2026 · État initial : kit prêt, cinq MP4 à produire**

Ce dernier lot termine la préparation des **23 pectoraux** dans l'ordre réel du
catalogue. Il ne reprend ni ne régénère les lots #01→#18 et ne rouvre pas le
**triceps #11**, toujours en stand-by. Les cinq photos utilisent l'athlète chromé
déjà montré et validé.

**Aucun nouveau MP4 n'était déposé après le commit `57d8d37` lors de la
préparation.** Les cinq identifiants ci-dessous restent donc sans entrée vidéo
(`null`) : rien n'est marqué `coached`, `validated` ou intégré. Les GIF, la
programmation et la version **1.12.0/195** restent inchangés ; aucun APK n'est
produit.

> Le dépôt ultérieur d'une source par Yanis vaudra accord d'intégration. Il
> faudra alors contrôler le mouvement réel et intégrer avec les réserves
> constatées, sans redemander confirmation. Une photo ou un prompt n'est pas une
> preuve de mouvement et ne doit jamais être présenté comme un MP4 intégré.

## État du kit et programmation réelle

| #   | Exercice et identifiant                                                                          | Programmation exacte                                                                         | Départ de la photo                  | État au 29/10      |
| --- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------ |
| #19 | Câbles croisés + rotation externe — `cables-croises-rotation-externe`                            | **3 × 12-15 · `3010` · repos 60 s**                                                          | **Ouverte, rotation externe**       | **MP4 à produire** |
| #20 | Développé couché plat, inertie depuis les pins — `developpe-couche-plat-inertie-depuis-les-pins` | **5 × 6-8 · `4010` · repos 120 s** · note : **« Pause complète sur les pins. »**             | **Basse, barre posée sur les pins** | **MP4 à produire** |
| #21 | Développé couché barre — `developpe-couche-barre`                                                | **3 × 8-10 · `3010` · repos 120 s** · **« Volume réduit : entretien, technique parfaite. »** | **Haute**                           | **MP4 à produire** |
| #22 | Développé couché — test 1RM — `developpe-couche-test-1rm`                                        | **5 × 1-5 · `4010` · repos 180 s** · **« Testez votre record annuel en toute sécurité. »**   | **Haute, sécurités + pareur**       | **MP4 à produire** |
| #23 | Pompes — `pompes`                                                                                | **3 × 8-15 · `3010` · repos 90 s** · **« Mains sous les épaules, corps aligné. »**           | **Haute, gainée**                   | **MP4 à produire** |

Les tempos suivent le découpage de l'application : excentrique, pause basse,
concentrique, contraction haute. Pour `3010`, la descente ou l'ouverture dure
**3 s**, puis la montée ou la fermeture **1 s**. Pour `4010`, ces durées sont
**4 s puis 1 s**. Une animation montre **une répétition complète**, pas toutes
les séries et répétitions de la séance.

**Exception spécifique du #20 :** sa note « Pause complète sur les pins » impose
un arrêt net, sans rebond, même si le quatrième caractère du tempo ne lui attribue
pas une durée chiffrée. La barre devient immobile et est réellement supportée par
les deux pins ; le corps reste gainé. Cette consigne propre au #20 ne s'étend pas
au #21 ou au #22.

## Cinq sources distinctes, sans nouvelle mutualisation

La règle **une vidéo exacte par exercice** reste appliquée. Les dérogations déjà
accordées aux triceps #05/#06/#09 et aux pectoraux #15/#17 ne concernent pas ce
lot.

- **#19** ne doit pas reprendre le crossover #10 sans montrer la rotation externe.
- **#20** est un départ sans élan depuis les pins, avec arrêt complet à chaque
  répétition.
- **#21** est le développé couché barre classique en technique contrôlée `3010` ;
  il ne doit pas hériter de la source ou de la prise rapprochée du #11.
- **#22** est un test 1RM sécurisé : ses pins sont des **sécurités de secours** et
  ne doivent pas porter la barre pendant une répétition réussie. Le pareur reste
  prêt sans tirer sur la barre.
- **#23** est une pompe au sol, distincte des pompes inclinées #01.

## Pourquoi les anciens GIF ne suffisent pas

Les GIF ont été inspectés avant la préparation et restent tous conservés dans
`public/media/` et `release/media/`.

- **#19** — `/media/09395898bff010e6.gif` : deux frames identiques montrent la
  position ouverte debout entre deux poulies, mais **aucune rotation externe ni
  répétition n'est visible**. La photo verrouille les deux câbles et les prises ;
  le prompt impose la rotation par les épaules, sans relâcher les poignées.
- **#20** — `/media/a73949925ba1c2fd.gif` : la famille du développé couché bas
  est visible, mais deux frames ne prouvent ni le contact avec les deux pins ni
  l'arrêt complet. La photo montre la barre supportée par les deux bras de
  sécurité, juste au-dessus de la poitrine.
- **#21** — `/media/acbab53a64c18aab.gif` : cinq frames montrent le haut et le bas
  d'un développé couché. La nouvelle photo verrouille la prise pectorale standard,
  la barre au-dessus des pectoraux, les appuis et le banc plat ; le prompt impose
  la descente de trois secondes.
- **#22** — `/media/bcaf491c4edff6de.gif` : deux frames identiques ne démontrent
  ni une répétition ni la sécurité d'un test 1RM. La photo ajoute des sécurités
  visibles et un pareur derrière la tête, sans simuler un échec.
- **#23** — `/media/8a1cd56aeaf90580.gif` : la famille des pompes au sol est
  correcte. La photo retient le départ en planche haute, paumes sous les épaules
  et ligne tête–hanches–talons, sans banc ni appui sur les genoux.

## Photos et zooms retenus pour production

L'athlète reste celui de
[`reference-personnage-verrouille.jpg`](./reference-personnage-verrouille.jpg) :
homme massif chrome argenté, casquette noire mate, short noir, chaussures
blanches, salle claire et pectoraux rouge/orange.

- [Planche des cinq photos](./vague3-pectoraux-19-23-apercu.jpg)
- [Planche des cinq zooms techniques](./vague3-pectoraux-19-23-zooms.jpg)

| #   | Point de contrôle principal                                                 | Photo à joindre au prompt                                      | Zoom                                                                     |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| #19 | Deux câbles tendus, deux poignées saisies, bras ouverts et rotation externe | [Photo #19](./vague3-pectoraux-19-cables-rotation-externe.jpg) | [Zoom rotation externe](./vague3-pectoraux-19-zoom-rotation-externe.jpg) |
| #20 | Barre basse réellement posée sur les deux pins, banc plat                   | [Photo #20](./vague3-pectoraux-20-developpe-pins.jpg)          | [Zoom barre/pins](./vague3-pectoraux-20-zoom-barre-pins.jpg)             |
| #21 | Prise standard, barre horizontale au-dessus des pectoraux                   | [Photo #21](./vague3-pectoraux-21-developpe-barre.jpg)         | [Zoom prise/sternum](./vague3-pectoraux-21-zoom-prise-sternum.jpg)       |
| #22 | Sécurités réglées et pareur prêt, sans échec simulé                         | [Photo #22](./vague3-pectoraux-22-test-1rm.jpg)                | [Zoom sécurité 1RM](./vague3-pectoraux-22-zoom-securite-1rm.jpg)         |
| #23 | Mains sous les épaules, bras verticaux et corps gainé                       | [Photo #23](./vague3-pectoraux-23-pompes.jpg)                  | [Zoom appuis/gainage](./vague3-pectoraux-23-zoom-appuis-gainage.jpg)     |

Les zooms sont des recadrages des photos retenues, pas de nouvelles générations.
Une photo fixe ne prouve ni le tempo, ni la trajectoire, ni la continuité des
câbles pendant le mouvement : ces éléments sont imposés par les prompts puis
contrôlés image par image sur chaque MP4 reçu.

---

## #19 — Câbles croisés + rotation externe — MP4 À PRODUIRE

### Exécution attendue

Debout au centre de deux poulies réglées autour de la hauteur des épaules, une
poignée dans chaque main et deux câbles tendus. Buste stable, épaules basses,
coudes légèrement fléchis avec un angle constant. La rotation externe vient des
**épaules**, pas d'un relâchement des mains, d'un poignet qui se tord ou d'une
rotation du buste.

1. La photo commence **bras ouverts**, paumes ouvertes vers l'avant/légèrement
   vers le haut dans la mesure permise par une prise ferme, pouces orientés vers
   l'extérieur.
2. **Refermer en 1 s** dans un grand arc horizontal devant les pectoraux jusqu'à
   rapprocher les poignées sans collision ni croisement incontrôlé.
3. **Ouvrir en 3 s** sur la même trajectoire. Terminer l'ouverture par une courte
   rotation externe des deux épaules pour revenir à la photo, sans changer
   l'angle des coudes et sans pause. Tempo `3010`.

Le GIF ne montre pas cette rotation : le MP4 doit donc être contrôlé sur ce point
et ne peut pas être validé sur la seule ressemblance de la position de départ.

### Prompt Arena Video / PixVerse — à copier avec la photo #19

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied OPEN CABLE CROSSOVER image, preserving his matte black cap, black shorts, white sneakers, bright grey gym and stable red-orange pectorals. CAMERA AND MACHINE LOCKED: frontal full-body view, athlete standing centered between TWO pulley towers at approximately shoulder height, EXACTLY TWO continuous taut diagonal cables and TWO D-handles, one handle firmly gripped in each hand. START at the exact WIDE position in the image: arms open to the sides, the same small fixed elbow bend on both sides, shoulders down, chest open and BOTH SHOULDERS EXTERNALLY ROTATED so the palms open forward/slightly upward and the thumbs rotate outward while the fingers remain wrapped around the handles. PHASE 1 (1 second): sweep both handles forward and inward together in a wide horizontal arc until they come close in front of the pectorals, keeping the elbow angles and torso stable and avoiding handle collision or uncontrolled crossing. PHASE 2 (3 seconds): slowly reopen both arms along the same arc; finish the opening with a SMALL, VISIBLE EXTERNAL ROTATION OF BOTH UPPER ARMS back to the supplied palm-open position. The rotation comes from the shoulders, not from releasing the handles, twisting the wrists or turning the torso. Show ONE continuous 1-second-close / 3-second-open repetition, tempo 3010, with no added pause. Keep both cables attached and taut throughout. No reverse fly, no face pull, no unilateral elbow-at-side cuff drill, no bench, no dumbbells, no extra cables or limbs, no camera movement, no text, no logo, no watermark.
```

---

## #20 — Développé couché plat, inertie depuis les pins — MP4 À PRODUIRE

### Exécution attendue

Sur banc plat dans un rack, tête et dos appuyés, pieds au sol, prise pronée
standard légèrement plus large que les épaules. Les deux pins sont réglés pour
que la barre s'arrête juste au-dessus du milieu des pectoraux, jamais contre le
cou. Contrairement aux sécurités de secours du #22, **les pins du #20 portent
volontairement la barre à chaque répétition**.

1. La photo commence **en bas**, barre immobile et posée sur les deux pins,
   coudes fléchis et avant-bras presque verticaux. Le corps reste gainé.
2. **Pousser en 1 s**, sans élan ni rebond préalable, jusqu'au-dessus des
   pectoraux avec les deux bras symétriques.
3. **Redescendre en 4 s** jusqu'aux deux pins. Déposer complètement la barre et
   marquer un arrêt net, sans rebond ni relâchement du buste. La note « Pause
   complète sur les pins. » prime sur toute interprétation du tempo comme un
   toucher-rebond.

### Prompt Arena Video / PixVerse — à copier avec la photo #20

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied BOTTOM PIN BENCH PRESS image, preserving his matte black cap, black shorts, white sneakers, bright grey gym and stable red-orange pectorals. CAMERA AND RACK LOCKED: side three-quarter view, athlete lying on a FLAT bench with head and back supported and both feet planted, ONE straight Olympic barbell in a standard pronated grip slightly wider than the shoulders. START at the exact DEAD-STOP BOTTOM in the image: the bar is motionless just above the MID-STERNUM and its weight is PHYSICALLY SUPPORTED BY BOTH horizontal safety pins/spotter arms, with bent elbows, stacked wrists and a braced torso. These are the working pins for every repetition, not the high racking J-hooks and not emergency-only safeties. PHASE 1 (1 second): press the bar directly off both pins without any preliminary bounce or momentum, extending both arms symmetrically until the bar is above the pectorals. PHASE 2 (4 seconds): lower the same bar slowly and evenly back to the two pins; place it fully on them and finish COMPLETELY MOTIONLESS with no rebound, while keeping the upper back and feet set. Show ONE 1-second-up / 4-second-down pin-press repetition followed by the required complete stop on the pins. The bar must never travel to the neck or face. No touch-and-go bounce, no incline bench, no dumbbells, no spotter lifting the bar, no moving pins, no extra limbs, no camera movement, no text, no logo, no watermark.
```

---

## #21 — Développé couché barre — MP4 À PRODUIRE

### Exécution attendue

Sur banc plat, arrière de la tête, omoplates et hanches appuyés, pieds stables.
Prise pronée standard légèrement plus large que les épaules, poignets alignés et
barre horizontale. La consigne catalogue est : **« Barre au-dessus des pectoraux,
descente contrôlée. »**

1. La photo commence **en haut**, bras presque tendus et barre au-dessus des
   pectoraux.
2. **Descendre en 3 s** vers le milieu du sternum, coudes modérément inclinés et
   avant-bras presque verticaux, sans heurter la barre sur la poitrine.
3. **Pousser en 1 s** pour revenir à la photo, sans rebond et sans déplacer la
   barre vers le cou ou le visage. Tempo `3010`, volume réduit et technique
   parfaite.

### Prompt Arena Video / PixVerse — à copier avec la photo #21

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied TOP FLAT BARBELL BENCH PRESS image, preserving his matte black cap, black shorts, white sneakers, bright grey gym and stable red-orange pectorals. CAMERA AND SETUP LOCKED: clean side three-quarter view, athlete lying on a horizontal flat bench with head, shoulder blades and hips supported and both feet planted. ONE straight level Olympic barbell, STANDARD PRONATED CHEST GRIP slightly wider than shoulder width, straight stacked wrists and symmetrical arms; this is NOT a close-grip triceps press. START at the exact TOP position in the image with the bar above the PECTORALS and arms nearly extended without harsh locking. PHASE 1 (3 seconds): lower the bar under perfect control toward a light touch at the MID-STERNUM, elbows moderately tucked and forearms nearly vertical, keeping the bar level and the feet and upper back stable. PHASE 2 (1 second): press along the same controlled path back to the supplied top image without bouncing the bar or moving it toward the neck or face. Show ONE continuous 3-second-down / 1-second-up repetition, tempo 3010, with no added pause and no exaggerated arch. This is a reduced-volume perfect-technique set, not a maximal test. No close grip, no pin-press dead stop, no spotter pulling the bar, no incline bench, no dumbbells, no extra limbs, no camera movement, no text, no logo, no watermark.
```

---

## #22 — Développé couché — test 1RM — MP4 À PRODUIRE

### Exécution attendue

La note exacte est **« Testez votre record annuel en toute sécurité. »** Le banc
plat est placé dans un rack avec deux sécurités réglées juste sous le point de
contact normal et un pareur derrière la tête. Sur une répétition réussie, la
barre ne se pose pas sur ces sécurités : elles sont là pour secourir, contrairement
aux pins de travail du #20.

1. La photo commence **en haut**, barre contrôlée au-dessus des pectoraux,
   pareur attentif avec les mains proches mais sans porter la charge.
2. **Descendre en 4 s** jusqu'au contact contrôlé avec le milieu des pectoraux,
   sans rebond et sans toucher les sécurités si la répétition est maîtrisée.
3. **Pousser en 1 s** pour terminer une seule répétition complète. Le pareur ne
   tire pas sur la barre et n'ajoute pas de répétition forcée. Ne jamais simuler
   un écrasement, une barre lâchée ou un échec dangereux.

La plage **5 × 1-5** et les **180 s de repos** restent des consignes de séance ;
l'animation ne montre qu'une répétition sécurisée, pas cinq séries ni un enchaînement
de cinq maximales.

### Prompt Arena Video / PixVerse — à copier avec la photo #22

```text
Animate the EXACT same massive silver-chrome athletic man and the SAME single human spotter from the supplied 1RM SAFETY SETUP image, preserving the chrome athlete's matte black cap, black shorts, white sneakers, bright grey gym and stable red-orange pectorals. CAMERA, RACK AND TWO PEOPLE LOCKED: side three-quarter view, athlete on a FLAT bench inside a power rack, ONE plausibly loaded straight Olympic barbell, TWO clearly visible safety arms set just below the normal chest touch point, and ONE attentive spotter standing behind the lifter's head with both hands close to the bar but NOT carrying it. START at the exact TOP position with the bar above the pectorals and the lifter's arms symmetrical. PHASE 1 (4 seconds): lower the bar slowly and evenly to a controlled light touch at the mid-pectorals without bouncing and WITHOUT resting it on the emergency safeties during this successful repetition. PHASE 2 (1 second): complete ONE controlled press back to the top; the spotter only tracks the bar with ready hands and does not pull, assist or add a forced rep. Keep feet, upper back, bar path, safety arms and spotter stable. Show only ONE secured 4-second-down / 1-second-up maximal-test repetition, tempo 4010. The safeties are emergency-only here, unlike exercise 20's working pins. No failed lift, no dropped bar, no crushing, no uncontrolled grind, no extra people or limbs, no incline bench, no dumbbells, no camera movement, no text, no logo, no watermark.
```

---

## #23 — Pompes — MP4 À PRODUIRE

### Exécution attendue

Au sol sur un tapis, paumes à plat directement sous les épaules, doigts écartés
vers l'avant, bras verticaux et jambes tendues sur les orteils. La note exacte
est **« Mains sous les épaules, corps aligné. »**

1. La photo commence **en haut**, tête, hanches, genoux et talons dans une même
   ligne, abdominaux et fessiers gainés.
2. **Descendre en 3 s** en fléchissant les deux coudes ensemble, poitrine proche
   du tapis, coudes modérément écartés et corps toujours rigide.
3. **Pousser en 1 s** pour revenir à la planche haute, sans creuser les hanches,
   monter les fesses ni poser les genoux. Tempo `3010`.

### Prompt Arena Video / PixVerse — à copier avec la photo #23

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied TOP FLOOR PUSH-UP image, preserving his matte black cap, black shorts, white sneakers, bright grey gym, black exercise mat and stable red-orange pectorals. CAMERA LOCKED in a side three-quarter full-body view. START at the exact HIGH PLANK in the image: both palms flat DIRECTLY UNDER THE SHOULDERS, fingers spread forward, arms vertical and extended, legs straight on the toes, and head, upper back, hips, knees and heels forming ONE straight braced line. PHASE 1 (3 seconds): bend both elbows together and lower the whole rigid body slowly until the chest is close to the mat, elbows moderately angled from the torso, hands fixed and neck neutral. PHASE 2 (1 second): press through both palms and extend the elbows to return to the supplied high plank in one piece. Show ONE continuous 3-second-down / 1-second-up STANDARD FLOOR PUSH-UP, tempo 3010, with no added pause. Keep the hips level and the same straight body line throughout; no sagging hips, no piked buttocks, no knees touching the mat, no hands sliding forward, no incline bench, no decline support, no extra limbs, no camera movement, no text, no logo, no watermark.
```

## Production et contrôle à réception

1. Générer **cinq MP4 distincts**, chacun avec sa propre photo et son propre
   prompt, caméra fixe et une répétition entièrement visible. Une durée de
   5–8 s est acceptable si le tempo demandé reste lisible et si le clip ne coupe
   ni le départ ni le retour.
2. Dès dépôt par Yanis, l'accord d'intégration est acquis. Identifier chaque
   source sans la renommer dans son dossier de preuve, calculer son SHA-256 et
   la décoder entièrement avec OpenCV.
3. Produire six instants et un zoom par source. Vérifier le nombre de bras, de
   mains, de barres, de câbles et de personnes, ainsi que la continuité du geste.
4. Contrôles spécifiques : rotation externe réelle au #19 ; contact et arrêt sur
   les deux pins au #20 ; prise standard et descente `3010` au #21 ; sécurités
   non utilisées pendant la répétition réussie et pareur non interventionniste
   au #22 ; alignement complet du corps au #23.
5. N'installer les MP4 dans `public/videos/` et `release/videos/` qu'après ce
   contrôle. Utiliser les photos du présent kit comme posters, conserver les GIF
   et créer des notices/audio propres à chaque exercice.
6. Si une source est imparfaite mais retenue, utiliser **`coached`** avec des
   réserves explicites et une voix corrective. Ne pas passer à `validated` sans
   mouvement réellement conforme. Documenter le contrôle dans un nouveau fichier
   séparé plutôt que d'annoncer ici une intégration anticipée.

## Références techniques et visuelles consultées

- [#19 — ATHLEAN-X, D2 Flexion Crossover](https://learn.athleanx.com/articles/best-lower-chest-workout) :
  repère pour une rotation provenant de l'épaule. La trajectoire unilatérale D2
  n'est **pas** copiée : le GIF du catalogue reste bilatéral, debout et horizontal.
- [#20 — StrengthLog, Pin Bench Press](https://www.strengthlog.com/pin-bench-press/) :
  banc plat dans un rack, pins réglés juste au-dessus de la poitrine, descente
  contrôlée jusqu'aux sécurités et gainage conservé.
- [#22 — Guide 1RM, sécurité du test](https://onerepmaxcalculators.com/guides/one-rep-max-basics/how-to-test-one-rep-max/) :
  sécurités réglées sous le point bas et pareur prêt à intervenir sans porter la
  barre pendant la répétition. Cette référence sert à la sécurité, pas à modifier
  la programmation `5 × 1-5 · 4010 · 180 s`.
- [#23 — FitCraft, Hand Plank](https://getfitcraft.com/exercises/hand-planks) :
  utilisé uniquement pour la **position haute** des pompes : poignets sous les
  épaules, bras tendus et ligne tête–talons ; ce n'est pas une référence de
  répétition complète ni de tempo.
- Références internes : GIF des cinq fiches, athlète verrouillé, distinction avec
  le crossover #10, le développé #11 et les pompes inclinées #01.

## Vérifications du kit

- Lecture du catalogue : **23 pectoraux**, avec les cinq identifiants, séries,
  répétitions, tempos, repos et GIF ci-dessus strictement conservés.
- Registre vidéo : les cinq entrées #19→#23 sont toujours `null` ; aucune
  intégration n'a été inventée.
- GIF #19→#23 présents dans `public/media/` **et** `release/media/`.
- **12/12 JPEG** décodés sans erreur et uniques par SHA-256 : 5 photos, 5 zooms
  et 2 planches ; **13 liens locaux valides, 0 absent**.
- Suite Node complète : **229 réussites, 0 échec, 2 ignorés**.
- Prettier validé sur ce document ; `git diff --check` propre. Aucune donnée du
  catalogue, du registre vidéo ou de version n'a été modifiée.

## État historique du kit avant dépôt

- **5 photos, 5 zooms, 2 planches et 5 prompts** prêts pour Arena Video/PixVerse.
- **0 MP4 intégré** à ce stade ; les cinq entrées restent sans vidéo.
- Aucune modification du catalogue, des tempos, des répétitions ou des repos.
- Tous les GIF et tous les lots #01→#18 sont conservés ; triceps #11 toujours en
  stand-by.
- Version **1.12.0/195** inchangée ; **aucun APK produit**.
