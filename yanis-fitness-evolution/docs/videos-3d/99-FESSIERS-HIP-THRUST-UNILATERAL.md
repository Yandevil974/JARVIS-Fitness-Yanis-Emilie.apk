# Lot 99 — Fessiers : les trois hip thrust unilatéraux

## État

Les fessiers sont couverts à **11 fiches sur 14**. Les trois restantes sont les variantes unilatérales du hip thrust :

- Hip thrust unilatéral (1 jambe)
- Hip thrust unilatéral
- Hip thrust unilatéral lesté

**Un seul clip suffit** pour les trois : même mouvement, seules la charge et la présentation changent. Le générateur ne doit donc produire qu'une image et qu'une vidéo.

## Image de référence

**Image** : [fes-hip-thrust-unilateral-v1.jpg](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/COMMIT/yanis-fitness-evolution/docs/videos-3d/fes-hip-thrust-unilateral-v1.jpg)

Méthode courte, validée sur le lot moyen fessier.

## Prompt image

```
Même personnage que la référence : athlète argenté très musclé, casquette noire, short noir, baskets blanches. Salle claire, sol gris.

Hip thrust au sol, haut du dos posé sur un banc, une seule jambe d'appui fléchie pied à plat au sol, l'autre jambe tendue en l'air. Une barre chargée dans le pli des hanches avec un coussin, tenue à deux mains.

Vue de profil. Athlète et banc entiers dans le cadre.

Coloration : le grand fessier seulement, la fesse de la jambe d'appui, en rouge-orangé. Rien d'autre de coloré.
```

## Prompt vidéo

```
Même personnage et même salle que la référence.

Hip thrust unilatéral : haut du dos sur un banc, une jambe fléchie pied à plat, l'autre tendue en l'air, barre dans le pli des hanches avec un coussin. Deux répétitions : montée du bassin jusqu'à l'alignement des épaules et du genou, une seconde en haut, descente lente sans poser complètement.

Vue de profil, athlète et banc entiers dans le cadre.

Coloration : le grand fessier de la jambe d'appui seulement, en rouge-orangé. Rien d'autre de coloré.
```

## Défauts constatés et corrigés pendant la préparation

Deux essais ont été écartés avant de garder l'image :

1. **Barre sur le ventre** au lieu du pli des hanches, et **rouge débordant sur l'avant de la cuisse**. Corrigé en nommant le pli des hanches et en limitant la coloration à la fesse.
2. La barre restait un peu haute. Corrigé en la décrivant « juste au-dessus du bassin, coussin entre la barre et le corps ».

Points de vigilance pour la vidéo, à vérifier au zoom avant de la garder :

- la **barre ne flotte pas** et reste dans le pli des hanches ;
- le **bassin ne s'affaisse pas** : le corps est aligné des épaules au genou d'appui ;
- la **jambe libre ne pousse pas** et ne touche pas le sol ;
- le rouge ne déborde **ni sur le quadriceps, ni sur le mollet, ni sur le bas du dos**.

## Raccordement prévu

Les trois fiches sont déjà déclarées dans `src/data/exercise-videos.js` avec le fichier cible `public/videos/fessiers-hip-thrust-unilateral.mp4`, en statut `pending` : le GIF d'origine reste affiché tant que la vidéo n'est pas déposée. Dès que le fichier arrive, il suffit de changer le statut en `coached` et de poser le poster.

Après ce clip, les fessiers passent à **14/14**.
