# Générateur « corps anatomique réel » (BodyParts3D)

Rendu de la démonstration **Extension triceps à la poulie** à partir d'un vrai
maillage anatomique libre, riggé à la main (aucun service externe, aucune clé).

- Source : [ashemag/human-atlas](https://github.com/ashemag/human-atlas)
  (`public/models`, 2 234 pièces issues de **BodyParts3D 4.0**).
- Licence des données : **CC BY-SA 2.1 Japan** (Mitsuhashi et al., *Nucleic Acids
  Research* 2009). La peau utilisée est la pièce `FMA7163` (22 902 sommets,
  44 744 faces).
- Conversion : mm/Z-up → m/Y-up, puis repère moteur (X avant, Y haut, Z gauche).

## Utilisation

```bash
# 1. télécharger l'atlas (≈ 57 Mo) : cache dans /tmp/anat
python3 fetch_atlas.py

# 2. rendu de la vidéo (≈ 30 min sur 2 cœurs ; 900×1124, 24 i/s, muet)
PYTHONPATH=..:../anatomy-video python3 final_video.py ../../public/media/video/extension-triceps-poulie.mp4

# 3. images de contrôle
PYTHONPATH=..:../anatomy-video python3 - <<'PY'
import final_video as V, final2 as F
from engine3d import to_image
for t in (0.9, 2.1, 4.4, 6.6):
    name, _ = V.shot_at(t)
    eye, tgt, fov = [s[1:4] for s in V.SHOTS if s[0] == name][0]
    cam = V.Camera(eye, tgt, fov=fov, width=V.W, height=V.H)
    bg, dep = V.background(cam)
    th, ln = V.pose_at(t)
    arr, _, _ = F.compose(th, ln, cam, bg=bg, bg_depth=dep)
    to_image(arr, exposure=1.02).save(f"/tmp/frame-{t:.1f}.png")
PY
```

`ATLAS_DIR` permet de placer le cache ailleurs que `/tmp/anat`.

## Modules

| Fichier | Rôle |
| --- | --- |
| `fetch_atlas.py` | télécharge `atlas.json` + `body-*.bin` via `gh api` |
| `atlas.py` | lecture mémoire des morceaux, extraction de la peau |
| `normals.py` | orientation cohérente des faces (le maillage source est mélangé) et normales lissées |
| `rig.py` | poids du coude par distance géodésique sur la peau |
| `body.py` | repère, articulations, pose, argent strié, surlignage triceps/deltoïde |
| `outfit.py` | champs signés de tissu (coutures analytiques lisses) |
| `wear.py` | découpe géométrique des pièces (bords fondus) — banc d'essai |
| `final2.py` | scène : corps + tissus peints au pixel + barre + câble + poulie + salle |
| `final_video.py` | 3 plans, 4 répétitions, incrustations, encodage H.264 |

Les stries de fibres et la coupe nette des tissus sont calculées **par pixel**
dans `tools/anatomy-video/engine3d.py` (options `striate` et `cloth` du `Mesh`).
