# Dos #01→#04 — contrôle et intégration

**Dépôt de Yanis : `de14f79323cd04bc78acdf6ba1f93dad44e81a5b`.** Les quatre sources sont intégrées en `coached`, avec leurs réserves et consignes vocales ; ce statut ne prétend pas valider techniquement les vidéos. La programmation, la version 1.12.0/195 et tous les GIF restent inchangés.

| #   | Exercice                      | Source              | Réserve                                                                                                          | Preuve                                                      |
| --- | ----------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 01  | Tirage vertical prise neutre  | `1793362378254.mp4` | Continuité exacte des mains et du câble difficile à certifier ; pause prolongée                                  | [8 instants](./controle-dos-01-04/dos-01-huit-instants.jpg) |
| 02  | Rowing haltère un bras        | `1793362391793.mp4` | Bras déformé, coude trop haut, haltère proche du banc ; amplitude naturelle, bassin stable et dégagement priment | [8 instants](./controle-dos-01-04/dos-02-huit-instants.jpg) |
| 03  | Tirage horizontal à la poulie | `1793362422076.mp4` | Continuité du câble près des pieds et durée de pause difficiles à certifier ; buste fixe et câble dégagé         | [8 instants](./controle-dos-01-04/dos-03-huit-instants.jpg) |
| 04  | Tirage vertical prise large   | `1793362437804.mp4` | Barre trop basse sur le buste et pause prolongée ; tirer au haut de la poitrine, devant la tête                  | [8 instants](./controle-dos-01-04/dos-04-huit-instants.jpg) |

Chaque fichier a été décodé intégralement : **640×480, 24 i/s, 121/121 images, 5,042 s**. Les planches montrent huit instants répartis sur la durée ; elles ne certifient pas à elles seules l'exactitude de chaque image. Les animations ne constituent pas une preuve du tempo `2011` : tirer en 1 seconde, tenir 1 seconde, revenir en 2 secondes.

| #   | SHA-256 de la source et des copies `public/` / `release/`          |
| --- | ------------------------------------------------------------------ |
| 01  | `e8f3228d7c9d8215e4cf1bc4a83e5ab53e50ad2d013037a6dc60e3e0120711e3` |
| 02  | `3a0a0ceefcb3e1c2296badfe2ff21be7fad66da68f29609a8a29c3dda61d813f` |
| 03  | `b86fd59cdc27a7b0e6dbae0bf6694d29251ee092eaf34e455427b855bab158fb` |
| 04  | `9fc805ab40b126826c71aca1ddde535cd819238b7ea24baf24b675b6465ab29f` |

Les quatre vidéos sont différentes. #01 conserve sa prise neutre et #04 sa prise pronée large. Chaque fiche dispose d'un poster, d'une notice et d'un descriptif audio propre ; les fichiers d'origine et les GIF sont conservés.

**Dos #05 reste en attente.** Yanis a signalé un bras tordu et une vidéo qui redresse le dos : ne pas réutiliser la photo rejetée. Une première tentative de génération avait été refusée ; une nouvelle photo candidate a depuis été préparée. La [fiche de production mise à jour](./30-DOS-01-05-PRODUCTION.md) contient un nouveau prompt photo et un prompt vidéo imposant un dos stable à 45°. Aucun MP4 #05 n'a été intégré.

## Vérifications

- Suite Node : **235 réussites, 0 échec, 2 ignorés**.
- Parcours Playwright ciblé sur le build web : **1 réussite**, avec les quatre vidéos, leurs notices et voix, ainsi que le GIF de repli #05.
- Build web réussi ; page et fichier vidéo répondent en HTTP 200 sur le serveur d’aperçu, accès `.private` interdit (403). Aucun APK produit.
