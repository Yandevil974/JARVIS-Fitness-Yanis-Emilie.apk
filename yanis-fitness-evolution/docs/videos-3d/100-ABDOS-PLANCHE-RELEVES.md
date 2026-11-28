# Lot 100 — Abdominaux : planche et relevés de jambes

## État

Les abdominaux comptent 15 fiches ; 9 étaient déjà couvertes. Il en restait **6**, couvertes par **deux clips seulement** :

| Fiche | Clip prévu |
| --- | --- |
| Gainage planche | `gainage-planche.mp4` |
| Circuit gainage (planche + latéral + bird dog) | `gainage-planche.mp4` (poste planche) |
| Circuit abdominaux (crunch + relevés + gainage) | `gainage-planche.mp4` (poste gainage) |
| Relevés de jambes allongée | `releves-de-jambes-allonge.mp4` |
| Relevés de jambes | `releves-de-jambes-allonge.mp4` |
| Relevés de jambes allongé | `releves-de-jambes-allonge.mp4` |

Les trois fiches « relevés de jambes » désignent le même geste dans le fichier source : elles partagent donc un seul clip, avec des consignes adaptées à chacune.

## Images de référence

**1. Planche** : [abs-planche-v2.jpg](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/0bce088/yanis-fitness-evolution/docs/videos-3d/abs-planche-v2.jpg)

**2. Relevés de jambes** : [abs-releves-jambes-v3.jpg](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/0bce088/yanis-fitness-evolution/docs/videos-3d/abs-releves-jambes-v3.jpg)

## Prompt 1 — planche

```
Même personnage que la référence : athlète argenté très musclé, casquette noire, short noir, baskets blanches. Salle claire, tapis noir au sol.

Gainage sur les avant-bras : les deux avant-bras au sol, coudes sous les épaules, jambes tendues, pointes de pied au sol. Corps aligné des épaules aux talons, bassin neutre, regard vers le tapis.

Vue de profil trois quarts. Athlète entier dans le cadre.

Coloration : les abdominaux seulement, à l'avant du ventre, en rouge-orangé. Rien d'autre de coloré.
```

## Prompt vidéo 1 — planche

```
Même personnage et même salle que la référence.

Gainage sur avant-bras, maintien immobile, cinq secondes. Les deux avant-bras au sol, coudes sous les épaules, jambes tendues, pointes de pied au sol, corps aligné des épaules aux talons. Aucun mouvement de pompe, les hanches ne montent pas.

Vue de profil trois quarts, athlète entier dans le cadre.

Coloration : les abdominaux seulement, en rouge-orangé. Rien d'autre de coloré.
```

## Prompt 2 — relevés de jambes

```
Même personnage que la référence : athlète argenté très musclé, casquette noire, short noir, baskets blanches. Salle claire, tapis noir au sol.

Allongé sur le dos, bras le long du corps paumes au sol. Les deux jambes tendues pointent vers le plafond, bien parallèles et écartées de la largeur du bassin, avec deux chaussures distinctes et nettement séparées. Bassin au sol.

Vue de profil trois quarts. Athlète entier dans le cadre, les deux pieds visibles séparément.

Coloration : les abdominaux seulement, à l'avant du ventre, en rouge-orangé. Rien sur les cuisses, rien sur les bras.
```

## Prompt vidéo 2 — relevés de jambes

```
Même personnage et même salle que la référence.

Relevés de jambes allongé. Allongé sur le dos, bras le long du corps, jambes tendues vers le plafond. Deux répétitions : descente lente des deux jambes ensemble sans décoller le bassin, arrêt avant que le bas du dos se creuse, puis remontée sans élan.

Vue de profil trois quarts, athlète entier dans le cadre, les deux pieds visibles séparément.

Coloration : les abdominaux seulement, en rouge-orangé. Rien sur les cuisses.
```

## Défauts constatés et corrigés

1. **Planche** : les deux mains se rejoignent en poing devant le visage, alors qu'elles doivent être à plat et écartées sous les épaules. Écrit en réserve sur les trois fiches concernées, avec la consigne corrective.
2. **Relevés de jambes, premier essai** : les deux chaussures se confondaient en une seule masse. Corrigé en exigeant deux chaussures distinctes, séparées de la largeur du bassin.

## Réserves à écrire dans la fiche et à dire en voix

- **Planche** : mains jointes devant le visage sur la vidéo → garder les mains à plat, écartées.
- **Circuit gainage** et **circuit abdominaux** : la vidéo ne montre que le poste de planche → les autres postes gardent leur propre vidéo ou la consigne écrite.
- **Relevés de jambes** (trois fiches) : la vidéo montre la position haute, pas la descente → suivre la consigne écrite et arrêter la descente dès que le bas du dos se creuse.

## Raccordement

Les six fiches sont déclarées dans `src/data/exercise-videos.js` en statut `pending` avec leurs fichiers cibles déjà nommés. Le GIF d'origine s'affiche tant que les clips ne sont pas déposés. Dès réception :

1. copier les fichiers sous `public/videos/gainage-planche.mp4` et `public/videos/releves-de-jambes-allonge.mp4` ;
2. poser les posters ;
3. passer les six entrées en `coached` avec `avoidSilentPreview: true`.

Après ces deux clips, les abdominaux passent à **15/15** et le total à **186 fiches sur 209**.

## Reste ensuite

Moyen fessier 9 (images prêtes, vidéos à déposer), quadriceps 6, triceps 4, épaules antérieures 2, lombaires 1, respiration 1.
