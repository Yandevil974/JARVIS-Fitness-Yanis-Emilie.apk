# Dos #06→#08 — contrôle des vidéos déposées

Dépôt `3271978` : trois fichiers attribués aux photos de départ #06, #07 et #08, respectivement ; le rapprochement visuel de la première image et des références confirme ces attributions. **Aucune source distincte pour #05** n'a été déposée dans ce lot : son GIF reste le repli. Les trois vidéos du lot sont intégrées `coached` avec leurs notices et voix ; ce statut ne valide pas les défauts observés. Les GIF et sources sont conservés.

| # | Source | SHA-256 (identique aux copies public et release) | Réserves | Contrôle visuel |
|---|---|---|---|---|
| 06 | `1793528067713.mp4` | `6ceda9598ce31bdde1d6825e73c742ee88c535307bbc12f057773891f09d046d` | Le buste se redresse au tirage ; tempo 3011 non fidèlement démontré. Ne pas imiter le redressement. | [10 instants](./controle-dos-06-08/1793528067713-dix-instants.jpg) |
| 07 | `1793528285602.mp4` | `6569b54e0935d0320d6abc9904508c67237d621aac0bbae7e29c437359d74793` | Le buste se redresse et une pause apparaît en haut, contrairement au 3010. | [10 instants](./controle-dos-06-08/1793528285602-dix-instants.jpg) |
| 08 | `1793528482361.mp4` | `4fe9d5e2270ec6a337ebd40d37e317205aa2508a5d140feea5bfde8c9fc31901` | Pause en contraction ; poignée, mains et continuité du câble difficiles à certifier pendant tout le mouvement. Suivre la prise neutre et le 3010. | [10 instants](./controle-dos-06-08/1793528482361-dix-instants.jpg) |

Chaque source a été décodée intégralement : 640 × 480, 24 images/s, 121 images, soit environ 5,04 s. Les planches montrent dix instants de chaque vidéo ; elles n'établissent pas une conformité anatomique image par image ni un tempo exact. La programmation n'est pas modifiée. Aucun nouvel APK n'a été produit.

## Vérifications

- Tests Node : 236 réussis, 0 échec, 2 ignorés ; build web réussi.
- Serveur du build : page et trois MP4 répondent HTTP 200 ; les hashes et GIF sont vérifiés par le test Node dédié.
- Parcours Playwright préparé mais non exécuté : Chromium ne démarre pas dans cet environnement, faute des bibliothèques système NSS/NSPR. La navigation et la lecture effectives en navigateur restent à vérifier.
