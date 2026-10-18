# Générateur de démonstrations vidéo 3D

Rendu 3D **logiciel** (aucun GPU, aucune API externe) d'un athlète articulé qui exécute
un exercice, avec muscles mis en évidence et incrustations pédagogiques.

```
python3 video.py        # rend public/media/video/extension-triceps-poulie.mp4 + affiche
node preview-server.mjs # prévisualisation http://localhost:8099
```

Dépendances : `numpy`, `Pillow`, `imageio-ffmpeg` (binaire ffmpeg inclus).

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `engine3d.py` | Rasterizer z-buffer : primitives (ellipsoïde, tube fuselé, loft, boîte arrondie), caméra, éclairage studio, brouillard, peinture faciale |
| `human.py` | Athlète riggé (torse, tête, bras avec triceps peints, jambes, tenue), matériel de poulie, câble |
| `scene.py` | Décor de salle (sol, murs, machines, luminaires), ombre de contact, passes de rendu |
| `anatomy_badge.py` | Planches anatomiques des badges, découpées dans `public/human/back.webp` avec les tracés de `src/components/anatomical-regions.js` |
| `video.py` | Animation (4 répétitions, 3 angles), incrustations (badges, compteur, titre), encodage H.264 |
| `preview-server.mjs` + `preview.html` | Prévisualisation du lecteur tel qu'intégré dans l'application |

## Ajouter un exercice

1. Décrire une fonction de pose (angles articulaires en fonction du temps) dans `video.py`.
2. Décrire la caméra/les angles dans `SHOTS`.
3. Nommer la sortie avec l'**identifiant du catalogue** (`slug` du nom de l'exercice).
4. Ajouter l'entrée correspondante dans `public/media/video/manifest.json` et passer
   `validated: true` seulement après contrôle visuel image par image.

Le rendu dure ~10 min pour 276 trames sur un cœur ; réduire `DURATION` ou la résolution
pour itérer plus vite.
