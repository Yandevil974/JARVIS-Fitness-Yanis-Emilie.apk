# Les 34 visuels « femme » sans source native — exemple à valider

**État au 02/10/2026 : exemple fabriqué, en attente de votre œil. Aucun des 34 n'est traité.**

## Le constat

Les 34 numéros femme des séries piscine / aqua / elliptique n'ont **aucune planche PNG native**.
Il n'existe donc rien de plus grand que le GIF livré. Tous font **440 px de haut**, 2 images
de 500 ms, de 404 à 442 px de large, de 150 à 217 ko.

Les 87 visuels déjà refaits l'ont été à **660 px** de haut. Le facteur d'agrandissement
nécessaire ici est donc de **1,5** — modéré, ce n'est pas un ×3.

## Ce que contient le PDF

`EXEMPLE-AGRANDISSEMENT-34-FEMME.pdf` (7 pages, 2,1 Mo) montre deux numéros (233 aqua-jogging
et 274 gainage vertical) traités de trois façons. **Pas de zoom** : l'original est laissé tel quel
et les quatre cases sont affichées **à la même taille**, celle de l'application — seule la densité
de pixels change. Chaque image du GIF a sa page (les GIF ont 2 images).

| | Méthode | Bruit de plat | Acuité des contours | Couleurs |
|---|---|---|---|---|
| — | GIF livré (départ, 440 px) | 0,91 | — autre échelle | 256 |
| **A** | Agrandissement simple (Lanczos 440 → 660) | 0,78 | 178 | 46 473 |
| **B** | Sur-échantillonnage (Lanczos ×2 puis retour 660) | 0,78 | 179 | 48 452 |
| **C** | Anti-bruit du tramage + sur-échantillonnage + netteté | **0,58** | **201** | 79 950 |

*Chiffres du n°233 ; le n°274 donne la même hiérarchie (C : bruit 0,58, acuité 206).*

A et B sont pratiquement identiques : le passage par le double ne change presque rien à cette
échelle. **C est le seul qui gagne sur les deux tableaux** : un tiers de bruit en moins et des
contours plus francs, parce qu'il retire d'abord le tramage du GIF (256 couleurs) avant
d'agrandir.

## Comment décider

Comparez chaque variante **à l'original posé juste à côté**, du même coup d'œil :

1. Le bord de la silhouette : franc, ou mou ?
2. La peau et l'eau : reste-t-il des petits points de tramage ?
3. Les doigts et le visage : le détail tient-il ?
4. Sur le n°233, le vert : reste-t-il net et bien posé ?

Si aucune des trois variantes ne va, l'autre voie que vous avez ouverte est la **création d'un
PNG** : refaire le visuel au lieu de l'agrandir. Dites-le et je prépare un exemple de cette voie.

## Interdits respectés

`gif_livres_modifies : 0` · `apk_reconstruit : false` · rien d'intégré dans l'application.

## Refabriquer

```bash
git fetch --depth=1 origin c685298378773817460fb358bc605af7ce154b8b:refs/remotes/base/lots-complets
python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy opencv-contrib-python-headless reportlab
python3 evolution/media/tools/agrandir-sans-source.py
```
