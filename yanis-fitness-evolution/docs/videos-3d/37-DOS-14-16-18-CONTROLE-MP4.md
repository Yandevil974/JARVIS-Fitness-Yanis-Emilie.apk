# Dos #14, #16, #17 et #18 — vidéos déposées

Dépôt `880da73` : quatre MP4 distincts, attribués par correspondance des images de départ avec les références du lot. Conformément à l'accord permanent de Yanis, les quatre sont intégrés **tels que déposés**, `coached` avec notices et voix ; les observations ne sont pas une demande de refaire les vidéos. Les sources, programmations et GIF sont conservés. Aucun APK n'a été produit.

| # | Source · SHA-256 (identique aux copies public et release) | Points accompagnés | Contrôle |
|---|---|---|---|
| 14 | `1793976101827.mp4` · `61df379deb9fb79ff2a27fca2baf47a10e130a20762ece905ca419d2aa98b1a1` | Étirement complet peu lisible ; la boucle amorce un nouveau tirage. Tempo et amplitude confortables indiqués par la voix. | [10 instants](./controle-dos-14-16-18/1793976101827-dix-instants.jpg) |
| 16 | `1793977380187.mp4` · `0be6f1e548be10012650822c2f5897797126e62d6f0d6a15af0cb172a737aee9` | Les coudes s'écartent, comme signalé par Yanis ; la vidéo ne montre pas le retour complet des deux bras avant la boucle. Rappeler le trajet vers les hanches, près du buste, sans écartement à 90°. | [10 instants](./controle-dos-14-16-18/1793977380187-dix-instants.jpg) |
| 17 | `1793975208310.mp4` · `7a5b49a949ec06ffe8d25d0086ec777aa35e50e163c8ed5b5c4c3c8f30de00f5` | La vue ne démontre pas nettement le passage du menton devant la barre et le retour est plus rapide que le tempo 4010. Prise large mais confortable. | [10 instants](./controle-dos-14-16-18/1793975208310-dix-instants.jpg) |
| 18 | `1793975505590.mp4` · `08dc196321ba74b51aa65f573a1902b05bb77e8463f5b25e36a4f0604f7b6383` | Tirage derrière la nuque choisi par Yanis : bras fléchis au départ, tempo non démontré et répétition dans le clip. Ne pas forcer ; tête neutre, pas de contact avec la nuque, arrêter si douleur et choisir un tirage devant si besoin. | [10 instants](./controle-dos-14-16-18/1793975505590-dix-instants.jpg) |

Chaque source a été entièrement décodée : 640 × 480, 24 images/s, 121 images sur 121, environ 5,04 s. Les planches de dix instants ne prouvent pas la conformité continue de l'anatomie ou du tempo.

**#15 reste sans MP4 dans ce dépôt** ; son GIF est conservé. La photo de référence en supination reste à travailler : ne pas proposer une prise incorrecte comme conforme.

## Vérifications

- Tests Node : **238 réussis, 0 échec, 2 ignorés** ; build web réussi. Les tests dédiés contrôlent les quatre sources, copies, posters, GIF, programmation et voix.
- Le serveur du build retourne HTTP 200 pour la page et les quatre MP4.
- Parcours Playwright préparé, mais navigateur absent dans l'environnement : le test n'a pas pu démarrer. La navigation et la lecture réelles en navigateur restent à vérifier.
