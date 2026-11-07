#!/usr/bin/env python3
"""fluid-gif.py — GIF à mouvement fluide par interpolation optique entre poses clés.

Le protocole visuel interdit le diaporama (A-M-B-M-A figé) : le GIF doit montrer
un vrai mouvement. Ici les images intermédiaires sont CALCULÉES par flux optique
(DIS Farneback) entre deux poses clés partageant la même scène : le décor reste
identique, seuls les membres bougent, image après image.

USAGE
  python3 fluid-gif.py --keys A.png,B.png --segments "0>1:7,1>0:7" \
      --size 440x246 --delay 9 --out sortie.gif [--frames-dir DIR]

  --keys      poses clés, dans l'ordre (mêmes scène/caméra)
  --segments  boucle : liste de transitions idx>idx:nb_intermediaires
              (la pose d'arrivée d'un segment est la clé elle-même, non dupliquée)
  --delay     délai GIF en centièmes par image intermédiaire (les clés gardent
              un délai un peu plus long, --delay-key, défaut delay+4)
  --out       GIF de sortie (palette commune, -loop 0)
  --frames-dir  optionnel : y écrire aussi les images intermédiaires en PNG

Contrôle : le script affiche le nombre d'images et la durée de boucle.
"""

import cv2
import numpy as np


def load_resize(path, w, h):
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"FICHIER ABSENT ou illisible : {path}")
    if (img.shape[1], img.shape[0]) != (w, h):
        img = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA)
    return img


def flow_between(a, b):
    ga = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    gb = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    dis.setUseSpatialPropagation(True)
    return dis.calc(ga, gb, None)


def warp(img, flow, t):
    h, w = flow.shape[:2]
    xs, ys = np.meshgrid(np.arange(w, dtype=np.float32),
                         np.arange(h, dtype=np.float32))
    mapx = (xs + t * flow[..., 0]).astype(np.float32)
    mapy = (ys + t * flow[..., 1]).astype(np.float32)
    return cv2.remap(img, mapx, mapy, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_REPLICATE)


def intermediate(a, b, flow_ab, flow_ba, t):
    wa = warp(a, flow_ab, t)
    wb = warp(b, flow_ba, 1.0 - t)
    out = ((1.0 - t) * wa.astype(np.float32) + t * wb.astype(np.float32))
    return np.clip(out, 0, 255).astype(np.uint8)
