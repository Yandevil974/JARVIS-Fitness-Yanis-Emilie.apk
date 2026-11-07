# Pectoraux #19→#23 — contrôle du dépôt et intégration

**Sources déposées par Yanis dans `55032eeb8b1155663d8133b8ae546733a008aa2b`.** Le dépôt vaut accord d'intégration ; `coached` indique une vidéo utilisable avec réserves, pas une validation technique.

| #   | Source              | Résultat et réserve principale                                                                                                        | Preuve                                                                  |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 19  | `1793342522096.mp4` | **coached** — crossover visible, rotation externe des épaules non démontrée clairement, flexion des coudes et vitesse à corriger      | [8 instants](./controle-pectoraux-19-23/pectoraux-19-huit-instants.jpg) |
| 20  | `1793342895653.mp4` | **coached** — développé visible, contact et support par les deux pins non démontrés clairement ; pause réelle indispensable           | [8 instants](./controle-pectoraux-19-23/pectoraux-20-huit-instants.jpg) |
| 21  | `1793343077279.mp4` | **coached** — doublon exact de P11 et T10 ; prise rapprochée à corriger en prise pectorale standard                                   | [8 instants](./controle-pectoraux-19-23/pectoraux-21-huit-instants.jpg) |
| 22  | `1793343306601.mp4` | **coached** — pareur et supports visibles, réglage de sécurité et non-contact en bas non vérifiables sur la vidéo ; tempo trop rapide | [8 instants](./controle-pectoraux-19-23/pectoraux-22-huit-instants.jpg) |
| 23  | `1793343560636.mp4` | **coached** — pompe au sol lisible ; pause basse et vitesse à corriger                                                                | [8 instants](./controle-pectoraux-19-23/pectoraux-23-huit-instants.jpg) |

Le fichier #21 est strictement identique aux sources `1793268156130.mp4` et `1792939358423.mp4` (SHA-256 `de0cd5fc9ac91d055c8215f0f99fe522e2165de4ff8d39224e798872b975bf28`). Le dépôt vaut accord d'intégration malgré ce doublon : une copie propre à #21 est enregistrée sans masquer cette identité. Le poster, la notice et l'audio imposent la prise pectorale standard et le tempo 3010 ; le GIF reste le repli. Cette décision ne prétend pas que la prise visible est correcte.

## Décodage et empreintes

Les cinq sources ont été entièrement décodées avec OpenCV : toutes les images annoncées sont lisibles. Les planches montrent huit instants répartis sur chaque vidéo ; les contrôles visuels sont des constats, pas une certification de la sécurité du matériel réel.

| #   | Format    |  Images | i/s |   Durée | SHA-256                                                            |
| --- | --------- | ------: | --: | ------: | ------------------------------------------------------------------ |
| 19  | 640×360   | 121/121 |  24 | 5,042 s | `a2c1a2a6fd72d4b35839cde9962cbffb87080daa11bda6b881db848e6324c3b0` |
| 20  | 640×640   | 121/121 |  24 | 5,042 s | `67f05fd70e0b69c1d449c56a1770c6bb342c46d5fd8297b2fe6ffd2481f4a35e` |
| 21  | 640×480   |   97/97 |  24 | 4,042 s | `de0cd5fc9ac91d055c8215f0f99fe522e2165de4ff8d39224e798872b975bf28` |
| 22  | 1024×1024 |   97/97 |  24 | 4,042 s | `59412a10eaaec743a2976050d9d6d1cce8a6c38690e531861173e43f0bc8fc5e` |
| 23  | 640×360   | 121/121 |  24 | 5,042 s | `b75b555c60519a8fd874cdce4eaf69ed2b755da1bde99433abf29fdb00f9eca0` |

## Consignes prioritaires et sécurité

- **#19** : les coudes restent souples à angle constant ; fermer en 1 s, ouvrir en 3 s et terminer avec une rotation externe douce des épaules sans tordre les poignets. La vidéo ne prouve pas cette rotation.
- **#20** : dans un rack stable, régler et tester des pins de travail solides et de même hauteur. La barre doit être **immobile et réellement supportée par les deux pins à chaque répétition**, puis être poussée en 1 s et reposée après une descente de 4 s. Ne pas copier le contact incertain de la vidéo.
- **#21** : le dépôt reproduit la source P11/T10 et sa prise rapprochée ; utiliser une prise standard plus large que les épaules et le tempo 3010 de cette fiche, sans copier la prise de la vidéo.
- **#22** : avant toute charge, faire vérifier le réglage des deux sécurités en conditions réelles et convenir d'un signal avec un pareur compétent. Elles doivent pouvoir arrêter la barre en cas d'échec sans gêner la répétition réussie ; ne pas se fier aux positions de la vidéo. Sans dispositif sûr, pas de test maximal. Le pareur reste prêt sans toucher la barre qui progresse ; descente 4 s, poussée 1 s. Les sécurités sont des secours, pas les pins de travail du #20.
- **#23** : mains sous épaules, corps aligné, descente 3 s puis poussée 1 s, sans pause basse ni genoux au sol.

Les cinq MP4 `coached` et les cinq posters propres sont recopiés à l'identique dans `public/videos/` et `release/videos/`. Les descriptifs `spoken`, notices, gestes et prises sont propres à chaque fiche et priment sur la vidéo. Les cinq GIF d'origine et les exercices antérieurs sont conservés. La programmation et la version **1.12.0/195** ne changent pas ; aucun APK.

## Vérifications

- Suite Node complète : **234 réussites, 0 échec, 2 ignorés**.
- Suite Playwright complète : **39 réussites, 0 échec, 11 ignorés**, dont le parcours des cinq nouvelles fiches, notices et voix.
- Les tests ciblés vérifient les cinq empreintes, les copies `public/` et `release/`, la programmation et les GIF. **32 liens locaux** des documents #28 à #30 ont été vérifiés, sans lien absent.
- Build web réussi : **1 679 modules**, `release/` actualisé ; aucun APK n’est produit.
