# REPRISE JARVIS — passation et consigne réunies

**Document de référence à lire au début du prochain chat · 9 octobre 2026.**
L'utilisateur n'a pas à recopier ce document : son lien et une courte demande de reprise suffisent.
Ce document remplace les anciennes consignes de production alternée HOMME/FEMME.
Le journal historique détaillé reste [SUIVI.md](yanis-fitness-evolution/animations/SUIVI.md).

## 1. Nouvelle priorité utilisateur — application opérationnelle rapidement

**Produire uniquement des GIFs HOMME pour le moment. Le même GIF HOMME d'un exercice
servira à Yanis ET à Émilie. Les nouvelles versions FEMME sont reportées à plus tard.**

- Ne pas lancer leg press FEMME ni back squat FEMME à la prochaine reprise.
- Conserver tous les GIFs FEMME déjà réalisés : ni suppression ni régénération.
- Une seule animation validée par exercice suffit pour la première phase commune.
- Le partage est autorisé **entre les deux profils pour le même exercice**, jamais entre
  deux exercices différents. Ne pas dupliquer artificiellement les fichiers ou les compteurs.
- Les programmes, charges, objectifs et réglages de Yanis et Émilie restent distincts :
  mutualiser le visuel ne signifie pas fusionner leur entraînement.
- Cette décision fixe la stratégie de production et le futur routage des médias. **Elle ne
  signifie pas que l'application ou l'APK a déjà été modifiée.** Ce tour ne change que les documents.
- Avant intégration, préparer le mapping exercice → GIF HOMME → deux profils, vérifier la
  couverture et les réserves, puis faire valider l'étape d'intégration. Ne pas modifier
  `release/`, `public/media` ou le code applicatif pendant la seule production des images.
- Ne pas attendre les variantes FEMME pour préparer une version utilisable. Proposer une
  intégration progressive des GIFs HOMME validés ; ne pas annoncer une APK prête sans build
  et tests réels sur les deux profils.

## 2. Dépôt et synchronisation sûre

- Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.
- Historique consolidé : `arena/7967ce00-jarvis-fitness-yanis-emilie-ap`.
- Dernier exercice livré : **`fa9d52a` — leg press HOMME**, après
  `d83b70c` — squat cycliste FEMME, et `069dd4f` — squat cycliste HOMME.
- Le HEAD distant peut être plus récent (documentation, nouvelles livraisons) : le vérifier.
- Toujours rester sur la branche imposée à la session. Aucun changement de branche ni push
  sur une autre branche. Si une future session impose une autre branche, y récupérer
  l'historique selon ses instructions, sans `git switch`.

Au démarrage, lire les statuts avant toute modification :

```bash
git status --short --branch
git log -3 --oneline
git ls-remote origin refs/heads/arena/7967ce00-jarvis-fitness-yanis-emilie-ap
git fetch origin arena/7967ce00-jarvis-fitness-yanis-emilie-ap
```

Si l'arbre est propre et l'historique compatible, récupérer par `git merge --ff-only FETCH_HEAD`
sur la branche autorisée. Si cela échoue ou si des modifications sont présentes, examiner
la divergence et préserver le travail ; aucun reset destructif ni suppression aveugle de verrou.
Le sandbox est déjà revenu plusieurs fois à `ddd1fb9` : ne jamais présumer que les fichiers
locaux sont à jour. Vérifier les livrables réellement présents après synchronisation.

## 3. État vérifié et comptage

| Élément | État |
|---|---|
| Compteur historique HOMME + FEMME | **76/614 livrées**, 538 restantes dans l'ancien périmètre double |
| Première phase désormais prioritaire | **307 entrées d'exercices**, une version HOMME commune aux deux profils ; couverture réelle à auditer |
| Objectif de 10 nouveaux GIFs en cours | **2 déjà livrés**, 8 encore à produire, désormais HOMME uniquement |
| Thème A | 50/50 H+F historiquement livrés, dont 25 HOMME ; réserves des circuits H maintenues |
| B-01 et B-02 quadriceps | Livrés H+F ; ne pas les refaire |
| B-03 | Non clos sans réserve : POC back squat H imparfait ; pas de nouvelle production F à faire maintenant |
| Intégration de ces nouveaux GIFs | Pas encore réalisée dans l'application |

**Ne pas convertir automatiquement 76/614 en une couverture HOMME de 76/307.**
Il faut distinguer fichiers livrés, exercices couverts par un GIF HOMME validé et profils
raccordés dans l'application. Un GIF utilisé par deux profils reste un seul GIF produit.
Le ratio historique Thème B « 16/187 » mélange des conventions anciennes : ne pas en tirer
un pourcentage de couverture H/F sans audit. Les 2 GIFs déjà livrés sur l'objectif de 10
restent comptés, même si l'un est FEMME ; la nouvelle priorité ne réécrit pas l'historique.

### B-03 — état à conserver

| Exercice | HOMME | FEMME |
|---|---|---|
| `back-squat` | POC audité, intact avec réserves ; correction soumise à accord explicite | Reportée |
| `squat-cycliste-squat-complet` | Livré `069dd4f` | Livrée `d83b70c`, conservée |
| `leg-press` | Livrée `fa9d52a` | Reportée |

POC back squat : format portrait 480×860, disques coupés latéralement, troisième pose debout
au lieu d'une troisième profondeur. Corps entier visible en A. Ne pas remplacer sans accord.
Ne pas refaire ni attendre une FEMME pour avancer vers B-04 HOMME.

### Derniers livrables accessibles

- [Leg press HOMME — GIF](yanis-fitness-evolution/animations/themeB/leg-press-3poses.gif)
- [Leg press HOMME — planche finale](yanis-fitness-evolution/animations/themeB/LOT-B03-leg-press-PLANCHE-FINALE.jpg)
- [Squat cycliste HOMME — GIF](yanis-fitness-evolution/animations/themeB/squat-cycliste-squat-complet-3poses.gif)
- [Squat cycliste FEMME — GIF conservé](yanis-fitness-evolution/animations/themeB/femme/squat-cycliste-squat-complet-3poses.gif)

Leg press H : sources `themeB/_sources/B-03/leg-press-{A,M,B}.png`, 1376×768 ; GIF 460×257,
4 frames A/M/B/M ; planche 1440×300. RMSE A→M **0,0978314**, M→B **0,102198**.
Pieds au centre du plateau fixe, siège mobile sur rails. Identité 1:1, appuis et anti-doublons
contrôlés. Dernier tour de production : 8 appels image, 1 GIF livré.

## 4. Suite immédiate — HOMME uniquement

1. Vérifier Git, lire ce document, les dernières sections de SUIVI et
   [PLAN-THEMES.md](yanis-fitness-evolution/animations/PLAN-THEMES.md).
2. Auditer la couverture des exercices par les GIFs HOMME, en séparant les POC/réserves.
   Ne pas refabriquer un GIF déjà livré pour simplement le partager avec Émilie.
3. Poursuivre le thème B, quadriceps. File de production proposée pour les 8 GIFs restants
   (à vérifier contre l'état réel et l'inventaire avant génération) :

| Lot | Exercices HOMME |
|---|---|
| B-04 | `leg-extension`, `front-squat`, `fentes-bulgares-halteres-pied-avant-sureleve` |
| B-05 | `step-up-haut`, `back-squat-barre-haute`, `hack-squat` |
| B-06, début | `back-squat-inertie-pause-complete`, `fentes-barre` |

4. Pour chaque exercice : recherche technique, vérification matériel, poses A/M/B,
   contrôles, GIF et planche, commit et push sur la branche autorisée.
5. Fournir les liens GitHub dès chaque exercice achevé, sans attendre les huit.
6. Préparer ensuite le raccordement des GIFs HOMME validés pour **les deux profils** :
   mapping contrôlé, inventaire des manquants, plan d'intégration et tests de lecture des
   médias. Faire confirmer l'intégration avant de toucher au code/aux médias applicatifs.
   Ne pas confondre livrable graphique, validation visuelle utilisateur et APK opérationnelle.

## 5. Consignes de production non négociables

- 1 exercice = 1 animation spécifique. Même GIF autorisé pour Yanis et Émilie sur CET exercice.
- Ne pas remplacer un GIF livré ou un POC sans accord explicite ; ne pas supprimer les FEMME.
- Recherche en ligne AVANT génération : sites fitness, GB Performance, YouTube et autres sources
  pertinentes. Noter les URL réellement consultées dans SUIVI et le commit. Une transcription
  YouTube n'est pas un visionnage image par image. Signaler un accès impossible ou une source
  non trouvée ; aucune référence spécifique GB Performance exploitable identifiée jusqu'ici.
- Vérifier le matériel exact dans `animations/inventaire.json` : ne pas confondre des variantes.
- Repartir d'une pose validée et conserver l'identité. Pas de génération texte seul, ni de nouvelle
  pose chaînée depuis un essai refusé. Une retouche locale du même essai reste un essai à contrôler.
- **Maximum 10 appels `generate_image` par tour**, rejets et corrections inclus. C'est un plafond,
  pas une obligation ni une promesse de 10 GIFs par tour.
- **Le drapeau rouge concerne uniquement la limite de discussion du chat.** À ce moment,
  actualiser la passation/consigne sur GitHub et donner le court message de reprise. Jamais
  de drapeau rouge pour signaler le budget d'images.
- Avant assemblage : inspection A/M/B, crops/zooms des appuis, buste à 1:1 sans redimensionnement,
  cadrage paysage, anatomie et matériel stables, MD5 distincts, RMSE consécutive ≥ **0,030**.
  `compare -metric RMSE a.png b.png null:` ; le seuil ne remplace pas le contrôle technique.
- Ne pas assembler un GIF final avec une pose refusée. Une planche de travail doit être marquée
  « EN COURS / NON VALIDÉ » et ne compte pas comme animation livrée.
- GIF individuel : 460×257, 4 frames A/M/B/M ; planche : 1440×300. Conserver les sources.
- Commit/push dès chaque exercice complet ; mettre à jour ce document, SUIVI et le plan.
- Fournir des liens GitHub de consultation ET téléchargement des GIFs et planches. L'utilisateur
  ne dépend pas du visualiseur Arena ; son jugement visuel reste déterminant.
- Avancer par thèmes A → B → C → D → E, sans produire les doublons FEMME pour le moment.

## 6. Identité visuelle et références

La production FEMME ci-dessous est **en réserve pour plus tard**, pas une tâche à lancer.
Les chemins de cette section sont relatifs à `yanis-fitness-evolution/animations/`.

- Toujours éditer une **pose de référence validée**, jamais partir d'un prompt texte seul ni
  chaîner depuis une image non conforme.
- Homme : `themeA/_sources/A-02/squat-poids-du-corps-{A,M,B}.png`.
- Femme : `themeA/femme/_sources/A-02F/squat-poids-du-corps-{A,M,B}.png`.
- Peau blanche argentée **lisse et mate** — pas de fibres grises striées, pas d'aspect écorché,
  pas de peau chromée. Carrure très musclée et massive, même échelle/cadrage que la référence.
  Casquette blanche, visage noir mat sans traits, short noir, baskets blanches ; pour la femme,
  ajouter tresse argentée, brassière et short noirs. Décor terrasse bord de mer ; pas de salle.
- Paragraphe HOMME à inclure mot pour mot :

  > He is a VERY muscular, heavily hypertrophied 3D anatomical bodybuilder: extremely wide
  > shoulders and big round deltoids, thick massive arms, huge full rounded pectorals, wide
  > lats, deep defined abdominals, narrow waist, powerful legs. IMPORTANT: do NOT slim him
  > down, do NOT make him leaner or narrower — copy his exact silhouette, shoulder width,
  > arm thickness, chest volume and muscle size from this reference image. He must fill the
  > frame exactly the same way (same camera, same distance, same framing, same scale).

- Paragraphe FEMME à réutiliser mot pour mot :

  > She is a VERY muscular, heavily hypertrophied female 3D anatomical athlete: wide toned
  > shoulders, full round deltoids, thick strong arms, well-defined abdominals, firm narrow
  > waist, powerful thick thighs and glutes. IMPORTANT: do NOT slim her down, do NOT make her
  > thinner or narrower — copy her exact silhouette, shoulder width, arm thickness, chest
  > volume and muscle size from this reference image. She must fill the frame exactly the
  > same way (same camera, same distance, same framing, same scale).

- Contrôle d'identité **1:1** (sans redimensionner) sur le buste avant assemblage : peau mate,
  silhouette/carrure, échelle, tenue et décor.

## 7. Recettes, outils et réserves à transmettre

- **Leg press** : utiliser les A/M/B HOMME B-03 désormais livrées pour cette entrée. La famille
  de machine a été vérifiée avec photo latérale et transcription Force USA Compact Leg Press :
  https://www.youtube.com/watch?v=OYZembAJ5II ; technique générale :
  https://www.magicfit.fr/les-conseils-du-coach-lexercice-leg-press/ ; cinématique :
  https://www.fitrated.com/gear/strength-training/force-usa-compact-leg-press-review/.
  Ne pas confondre siège mobile/plateau fixe avec siège fixe/plateau mobile. La presse B-02
  pieds hauts reste un autre exercice, à ne pas remplacer.
- **Déblocage des poses** : les références corps entier ont parfois figé le mouvement.
  Un guide articulé dérivé de la pose validée + crop du buste à 1:1 a fonctionné ; seul le
  rendu IA nettoyé et contrôlé peut entrer dans le GIF, jamais le guide brut. Recettes et
  échecs précis dans les dernières sections de SUIVI. Ne pas répéter les stratégies refusées.
- **FEMME sur presse, uniquement plus tard** : « garde tout, ne bouge rien » depuis la pose
  HOMME conforme ; conserver machine, jambes, pieds et appuis, changer seulement l'identité
  torse/tête. Les repositionnements globaux ont échoué. Contrôle par crop avant rejet.
- **Réserve B-02F** : mi-course presse acceptée à RMSE 0,0360, amplitude moins franche.
  Ne pas refaire sans demande. Les deux circuits HOMME LOT 3 restent aussi en réserve.
- **Step-up** : dire « STEP PLATFORM », pas « bench » ; préciser pieds sur la plateforme,
  plateforme directement sous les pieds. Ne pas relancer l'essai « long bench » interrompu.
- Les anciens statuts/ordres H+F dans SUIVI sont historiques. La priorité HOMME commune
  aux deux profils de ce document prévaut. Les variantes FEMME restent dans la feuille de
  route, mais leur génération ne bloque plus la première version partagée.

Outils depuis `yanis-fitness-evolution/animations/` :

```bash
bash ../scripts/build-planche-exo.sh <src_dir> <out.jpg> <exo_id> "<titre>" "<A>" "<M>" "<B>"
bash ../scripts/build-planche-grille.sh <src_dir> <out.jpg> "<titre>" <HOMME|FEMME> <ex1> <ex2> <ex3>
bash ../scripts/build-gif-lot-depuis-gifs.sh <out.gif> <gif1> <gif2> <gif3>
```

Toujours `-font DejaVu-Sans` pour `convert -annotate`. Ne construire une planche globale
qu'avec des exercices validés ; ne pas annoncer un lot complet avec un POC en réserve.
