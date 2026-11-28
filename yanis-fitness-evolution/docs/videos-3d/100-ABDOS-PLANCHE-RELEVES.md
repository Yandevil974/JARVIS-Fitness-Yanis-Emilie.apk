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

## Raccordement — fait

Les deux clips ont été déposés par Yanis le 22 novembre 2026 et intégrés dans le commit `48f1bda`.

| Clip livré | Source reçue | Format | Empreinte SHA-256 du fichier rangé |
| --- | --- | --- | --- |
| `gainage-planche.mp4` | `1795856844662.mp4` | 640×360, 121 images, 5 s | `a8b0024c1769acd67e2ffd1d76dc15aa1bec6c74baa462aa1ce312859f9377f7` |
| `releves-de-jambes-allonge.mp4` | `1795856818170.mp4` | 640×496, 121 images, 5 s | `16132041ceb70676d06c89eeb245ed0b508f4723136bcc233af56a8f16b43493` |

Ce qui est en place :

1. les deux MP4 sont dans `public/videos/` **et** `release/videos/` ;
2. les posters (image 60 de chaque clip) sont dans `public/videos/posters/` et `release/videos/posters/` ;
3. les deux fichiers figurent dans `media-index.json` (public et release) ;
4. les six fiches sont passées en `coached` avec `avoidSilentPreview: true`, consignes réécrites pour chacune ;
5. les GIF d'origine sont conservés, ils restent le repli si une vidéo manque ;
6. un test dédié vérifie les empreintes, la présence dans les deux dossiers et la conservation des GIF : `tests/abdos-planche-releves.test.js`.

**Défaut de la vidéo de planche** : le clip porte un filigrane « PixVerse.ai » en bas de l'image. Il n'a pas été retiré ; il est signalé ici pour mémoire. Le geste lui-même est propre, c'est la position des mains qui demande la réserve ci-dessous.

Couverture après ce lot : **abdominaux 15/15**, total **186 fiches sur 209**.

## Reste ensuite

Un seul lot à la fois. Le prochain annoncé est **quadriceps, 6 fiches**. Puis triceps 4, épaules antérieures 2, lombaires 1, transverse 1, respiration 1, et moyen fessier 9 (images déjà prêtes, aucune vidéo déposée).
