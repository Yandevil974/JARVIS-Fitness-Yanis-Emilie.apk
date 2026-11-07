# Dos #19, #20, #21 et #23 — contrôle des vidéos déposées

Dépôt `2d02b2c` : attribution par le mouvement visible (traction, rowing un bras, pullover debout et tirage vertical), en cohérence avec le lot #19→#23. Les quatre MP4 sont conservés **tels que déposés** et intégrés `coached`, avec voix et avertissements adaptés. L'accord permanent de Yanis est acquis : ne pas lui demander de confirmation ni d'autre vidéo. GIF et programmation inchangés.

| # | Fichier source · SHA-256, identique dans `public` et `release` | Observations | Dix instants |
|---|---|---|---|
| 19 | `1794018778897.mp4` · `8791a1ea3cab9d7ea88d86d631bd2b7297358e13eb3b2f03a49a5e2cdc37377a` | **Identique octet pour octet au #10** (`1793767077350.mp4`). La traction est visible, mais pas clairement la phase lean away ni le tempo demandé. | [Planche](./controle-dos-19-21-23/1794018778897-dix-instants.jpg) |
| 20 | `1794018798425.mp4` · `3a0a0ceefcb3e1c2296badfe2ff21be7fad66da68f29609a8a29c3dda61d813f` | **Identique au #02 et au #12** (`1793362391793.mp4`, `1793800965600.mp4`). Bras déformé et coude trop haut ; prise neutre et tempo pas clairement démontrés. Ne pas copier ces défauts. | [Planche](./controle-dos-19-21-23/1794018798425-dix-instants.jpg) |
| 21 | `1794019288070.mp4` · `4007b979a1452f009c8bd96322119a070f8792b921d93edabc20860f6bc23693` | Pullover à la poulie haute ; prise et attache deviennent peu lisibles en bas, une pause est visible et le rythme ne démontre pas le 3010. | [Planche](./controle-dos-19-21-23/1794019288070-dix-instants.jpg) |
| 23 | `1794018866928.mp4` · `0f3e7d8114d77ca73d15e75cdbdac9593fe462a25d942667dfc9b96e35a4410d` | **Identique au #09** (`1793801260971.mp4`). Départ bras fléchis ; pas de quart de répétition en bas visible ni de tempo 3012 démontré. La voix rappelle la méthode 1¼ en bas et le quart ajoute du temps. | [Planche](./controle-dos-19-21-23/1794018866928-dix-instants.jpg) |

Toutes les images ont été décodées : #19 et #20 640 × 480, 121/121 images, 24 i/s, 5,04 s ; #21 496 × 640, 121/121 images, 24 i/s, 5,04 s ; #23 1024 × 768, 97/97 images, 24 i/s, 4,04 s. Les planches ne prouvent pas la conformité continue de l'anatomie, du tempo ou de la fixation des équipements.

**#22 :** aucune vidéo de rowing assis câble unilatéral n'est identifiable dans ce dépôt. Son GIF reste disponible. Une nouvelle photo candidate a ensuite été préparée dans [le lot suivant](./41-DOS-22-24-25-PRODUCTION.md). L'absence de correspondance n'empêche pas l'intégration des quatre vidéos reçues.

## Vérifications

- Tests Node : **239 réussis, 0 échec, 2 ignorés**, dont contrôle des sources, doublons, copies, GIF, programmation et voix. Build web réussi.
- Le serveur du build retourne HTTP 200 pour la page, les quatre MP4 et le GIF du #22.
- Le parcours Playwright n'a pas pu démarrer : Chromium est absent de l'environnement. La lecture réelle en navigateur reste à vérifier. Aucun APK n'a été produit.
