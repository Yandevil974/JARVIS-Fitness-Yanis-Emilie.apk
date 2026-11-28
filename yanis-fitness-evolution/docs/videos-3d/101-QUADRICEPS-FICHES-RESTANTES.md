# Lot 101 — Quadriceps : les 6 fiches encore sans vidéo

## État vérifié

Contrôle fait dans le code (`videoFor`), pas de mémoire : sur les 31 fiches `qua` de la bibliothèque, **6 n'ont aucune vidéo** alors que les 25 autres sont couvertes.

| Fiche | Nom affiché | Matériel | Prescription | GIF conservé |
| --- | --- | --- | --- | --- |
| `presse-a-cuisses-pieds-hauts` | Presse à cuisses pieds hauts | machine | 3 × 12 (Émilie) | `73b7bb33f4a9d6df.gif` |
| `front-squat` | Front squat | barre | 5 × 5–7 · 4210 · 120 s | `08e001311b255115.gif` |
| `fentes-bulgares-halteres-pied-avant-sureleve` | Fentes bulgares haltères, pied avant surélevé | haltères | 4 × 8–10 | `7709724c07a6ef07.gif` |
| `back-squat-inertie-pause-complete` | Back squat inertie, pause complète | barre | 5 × 6–8 | `8403a244b533745c.gif` |
| `fentes-barre` | Fentes barre | barre | 3 × 8–10 · 2010 · 75 s | `6baa655d39de069e.gif` |
| `drop-lunges-fentes-controlees` | Drop lunges, fentes contrôlées | poids du corps | 6 × 8–10 | `cb0991bbf1591550.gif` |

Aucune de ces fiches n'est déclarée `coached` : **une vidéo n'existe pas**, je ne change pas les statuts avant d'avoir le fichier.

## Ce qui a été fait dans ce lot

J'ai généré et contrôlé les images de référence. Cinq sont retenues et versionnées ici ; **aucune vidéo n'est générée**.

| Fiche | Image retenue | Télécharger |
| --- | --- | --- |
| Presse pieds hauts | `qua-05-presse-pieds-hauts-v3.jpg` | https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/cb6e528/yanis-fitness-evolution/docs/videos-3d/qua-05-presse-pieds-hauts-v3.jpg |
| Front squat | `qua-11-front-squat-v4.jpg` | https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/cb6e528/yanis-fitness-evolution/docs/videos-3d/qua-11-front-squat-v4.jpg |
| Fente bulgare haltères | `qua-12-fente-bulgare-halteres-pied-avant-v1.jpg` | https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/cb6e528/yanis-fitness-evolution/docs/videos-3d/qua-12-fente-bulgare-halteres-pied-avant-v1.jpg |
| Back squat sur sécurités | `qua-16-back-squat-securites-v2.jpg` | https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/cb6e528/yanis-fitness-evolution/docs/videos-3d/qua-16-back-squat-securites-v2.jpg |
| Fentes contrôlées | `qua-25-drop-lunges-controlees-v1.jpg` | https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/cb6e528/yanis-fitness-evolution/docs/videos-3d/qua-25-drop-lunges-controlees-v1.jpg |

Fiche **fentes barre** : l'image validée existe déjà, `qua-fentes-barre-correction-cadree.jpg` (voir le prompt long dans `71-QUADRICEPS-FENTES-BARRE.md`). Rien à regénérer.

## Défauts constatés sur mes propres essais

1. **Presse pieds hauts, premier essai** : le modèle avait rendu une peau humaine au lieu du mannequin chromé, et le bras droit passait derrière la machine. Deuxième essai : chrome correct, mais le bras droit était **caché par le dossier** et les pieds se touchaient presque. Version retenue : les deux mains sont sur les poignées, les deux pieds sont hauts et écartés.
2. **Front squat, premier et deuxième essais** : la barre touchait la gorge et les mains formaient des poings au-dessus de la barre. Image intermédiaire (v3) : une main avait six doigts. **Version retenue v4** : barre sur les pectoraux, cou dégagé, les deux mains refermées sur la barre, coudes hauts.
3. **Back squat sécurités, premier essai** : la barre passait devant la poitrine au lieu de reposer sur le dos, et **une main comptait six doigts**. Version retenue : barre sur les trapèzes, les deux barres de sécurité horizontales juste sous la barre.
4. **Fente bulgare haltères** : l'haltère de la main arrière est **caché derrière la cuisse** sur cet essai. Il faudra une reprise avant de générer la vidéo, pour que les deux haltères soient visibles.
5. **Fentes contrôlées** : le genou arrière est un peu bas et l'athlète est cadré un peu près à droite, mais les deux appuis sont lisibles. Acceptable comme point de départ.

## Prompts vidéo à coller

### 1. Presse à cuisses pieds hauts

```
Même personnage et même salle que la référence : athlète argenté chromé, casquette noire, short noir, baskets blanches.

Presse à cuisses inclinée, machine entière dans le cadre, athlète assis, dos et bassin contre le dossier, les deux mains sur les poignées.

Deux pieds hauts et écartés sur le plateau, entièrement à plat, sans dépasser le bord ; genoux dans l'axe des orteils.

Départ jambes presque tendues : plier en trois secondes jusqu'à une profondeur confortable sans décoller le bassin, puis pousser en une seconde sans verrouiller les genoux.

Vue de trois quarts avant, athlète et machine entiers dans le cadre, deux chaussures distinctes, deux mains visibles.

Coloration : quadriceps seulement, en rouge-orangé. Rien d'autre de coloré. Aucun texte, aucun filigrane, aucune deuxième personne.
```

### 2. Front squat

```
Même personnage et même salle que la référence : athlète argenté chromé, casquette noire, short noir, baskets blanches.

Front squat, barre droite posée sur le haut des pectoraux sous le menton, cou dégagé, les deux mains refermées sur la barre, coudes hauts pointés vers l'avant.

Départ debout : descendre en trois secondes, cuisses proches de l'horizontale, talons au sol, buste vertical ; pause de deux secondes en bas ; remonter en deux secondes sans élan.

Vue de trois quarts avant, athlète entier dans le cadre, deux chaussures distinctes, deux mains et toute la barre avec ses deux disques visibles.

Coloration : quadriceps seulement, en rouge-orangé. Rien d'autre. Aucun texte, aucune deuxième personne, aucune barre qui traverse le cou.
```

### 3. Fente bulgare haltères, pied avant surélevé

```
Même personnage et même salle que la référence : athlète argenté chromé, casquette noire, short noir, baskets blanches.

Pied avant à plat sur une marche basse stable, pied arrière sur le banc, un haltère dans chaque main, bras légèrement écartés : les deux haltères restent visibles à l'extérieur des cuisses pendant tout le mouvement.

Descendre en trois secondes, genou arrière vers le sol sans le toucher, buste droit ; remonter en une seconde sans pousser sur le banc.

Vue de trois quarts avant, athlète entier avec la marche, le banc, les deux chaussures et les deux haltères dans le cadre.

Coloration : quadriceps seulement, en rouge-orangé. Rien d'autre. Aucun texte, aucune deuxième personne, aucun haltère caché.
```

### 4. Back squat avec pause sur les barres de sécurité

```
Même personnage et même salle que la référence : athlète argenté chromé, casquette noire, short noir, baskets blanches.

Rack vu de trois quarts arrière, les deux barres de sécurité horizontales réglées juste sous la position basse de la barre.

La barre reste posée sur les trapèzes, sous la base du cou, les deux mains la tiennent, les coudes sous la barre : elle ne passe jamais devant la poitrine.

Descendre en quatre secondes jusqu'à poser la barre sur les sécurités, pause complète d'une seconde, puis remonter sous contrôle genoux dans l'axe.

Athlète et rack entiers dans le cadre, deux chaussures distinctes. Coloration : quadriceps seulement, en rouge-orangé. Aucun texte, aucune deuxième personne.
```

### 5. Fentes barre

Image et prompt long déjà écrits dans `71-QUADRICEPS-FENTES-BARRE.md` : barre sur les trapèzes, vue de trois quarts arrière, fente arrière avec remontée.

### 6. Fentes contrôlées au poids du corps

```
Même personnage et même salle que la référence : athlète argenté chromé, casquette noire, short noir, baskets blanches.

Fente au poids du corps, mains sur les hanches, sans haltère, sans banc et sans saut.

Depuis la position basse : remonter en une seconde en poussant dans le pied avant, pieds côte à côte ; reculer une jambe, poser les orteils et descendre en deux secondes, genou arrière vers le sol sans le toucher.

Vue de profil trois quarts, athlète entier dans le cadre avec de la marge au-dessus de la tête et sous les pieds.

Coloration : quadriceps seulement, en rouge-orangé. Rien d'autre. Aucun texte, aucune deuxième personne, aucun saut.
```

## Réserves à inscrire dans les fiches lors de la réception

- **Presse pieds hauts** : la vidéo #09 (`leg-press.mp4`) ne convient pas, elle montre une presse bilatérale pieds à largeur de hanches et coupe une main. Ne pas la recycler.
- **Front squat** : le back squat existant n'est **pas** un front squat. Ne pas partager.
- **Fente bulgare haltères** : distincte de `bulgarian-split-squat-halteres` (pied arrière sur banc, pied avant au sol) et de la fente au poids du corps. Vérifier les deux haltères et les deux appuis.
- **Back squat sécurités** : distinct de `back-squat`, la pause sur les barres de sécurité est un autre geste. Les sécurités doivent être visibles et en contact.
- **Fentes contrôlées** : distincte de `drop-lunges-fentes-sautees-controlees` (le geste sauté est déjà couvert). Pas de saut ici, et l'alternance des côtés doit être montrée.

## Suite

Après ces 6 fiches, les quadriceps passeraient à **31/31** et le total à **192 sur 209**. Un seul lot à la fois : je n'ouvre pas les triceps avant d'avoir clos les quadriceps.
