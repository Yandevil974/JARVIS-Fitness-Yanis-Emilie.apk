# Dos #22 et #25 — contrôle des vidéos déposées

Dépôt `1f97ee4` : les mouvements et images de départ correspondent respectivement au rowing assis câble unilatéral #22 et au rowing à l'élastique #25. Selon l'accord permanent de Yanis, les deux vidéos sont intégrées **telles que déposées** au statut `coached`, sans demander de confirmation ni de nouvelle vidéo. GIF et programmation restent inchangés.

| # | Fichier source · SHA-256, identique dans `public` et `release` | Observations | Dix instants |
|---|---|---|---|
| 22 | `1794021140299.mp4` · `2652d14747509f569770b21fbc03f0fc83ca02669aac91b685f7635641be54be` | Rowing assis à une poignée ; la main libre est partiellement masquée, le buste tourne légèrement, la pause est prolongée et le retour est plus rapide que le tempo 3011. Les consignes rappellent un tronc stable et le tempo prescrit. | [Planche](./controle-dos-22-25/1794021140299-dix-instants.jpg) |
| 25 | `1794021625378.mp4` · `4e26e5c0d706641c6645e80b5b18486720bb35bc8b4ee507cf7edbca8821bdf7` | Rowing avec bandes fixées devant ; une main est masquée en fin de tirage et la symétrie est difficile à vérifier. La pause est prolongée et le retour est plus rapide que 3010. Rappeler de vérifier l'état de l'élastique et de fixer solidement l'ancrage. | [Planche](./controle-dos-22-25/1794021625378-dix-instants.jpg) |

Tous les plans ont été décodés : #22 528 × 640, 145/145 images, 24 i/s, 6,04 s ; #25 640 × 480, 121/121 images, 24 i/s, 5,04 s. Les fichiers sont distincts l'un de l'autre et ne sont pas identiques octet pour octet aux autres MP4 présents à la racine au moment du contrôle. Les planches ne prouvent pas la conformité continue de l'anatomie ni de la fixation du matériel.

**#24 :** aucune vidéo de pullover haltère plat dans ce dépôt ; son GIF reste disponible. Les essais précédents n'avaient pas donné de photo proposée ; une [nouvelle candidate](./43-DOS-24-PULLOVER-PRODUCTION.md) a depuis été préparée.

## Vérifications

- Tests Node : **240 réussis, 0 échec, 2 ignorés**, dont contrôle des sources, copies, GIF, programmation, sécurité et voix. Build web réussi.
- Le serveur du build retourne HTTP 200 pour la page, les deux MP4, leurs posters et le GIF du #24.
- Parcours Playwright préparé, mais Chromium absent : le test n'a pas pu démarrer ; la lecture en navigateur reste à vérifier. Aucun APK n'a été produit.
