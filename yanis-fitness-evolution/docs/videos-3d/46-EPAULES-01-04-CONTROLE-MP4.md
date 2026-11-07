# Épaules #01 à #04 — contrôle des vidéos déposées

**Mise à jour** : le #04 ci-dessous décrit la première version. Une nouvelle vidéo a depuis été intégrée ; voir [contrôle de reprise #04](./47-EPAULES-04-REPRISE-CONTROLE.md). Les observations sur #01 à #03 restent valables.

Quatre MP4 déposés par Yanis au commit `99e7f96`. Conformément à son accord permanent, les quatre sont conservés tels quels et intégrés `coached` avec notices et descriptifs vocaux ; aucune nouvelle génération n'est demandée. Le statut `coached` ne signifie pas que les vidéos représentent parfaitement les exercices. Les fichiers originaux, les GIF et la programmation sont conservés.

| # | Exercice | Fichier reçu | SHA-256 | Observations |
|---|---|---|---|---|
| 01 | Développé militaire haltères assis | `1794029524905.mp4` | `36b8de7fcac4de278220161659ec9bcee2967cf23583f06362e49db528769ffe` | Les haltères sortent encore partiellement du cadre au sommet (notamment vers 2 s), malgré la demande de cadrage large ; la prise et la position haute ne sont pas entièrement visibles. Le tempo 2011 n'est pas démontré clairement. Ne pas prétendre que ce défaut est résolu. |
| 02 | Élévations latérales haltères | `1794028540590.mp4` | `468b595c00e0f29072990ccc9a44daa538a7e235e56d86986e7359c6fc0d2f55` | Les bras montent légèrement au-delà de l'horizontale ; les mains et haltères sont peu lisibles pendant le mouvement, et le tempo 2011 n'est pas clairement montré. Voix : hauteur des épaules au maximum, poignets confortables et rythme de la fiche. |
| 03 | Face pull à l'élastique | `1794028776811.mp4` | `a067343915505928313299c6085a58c3d484530d8f60cffb392b5de1e3cd7522` | Tirage globalement vers le visage ; prises, attaches et symétrie peu lisibles, tempo 2011 non démontré clairement. Vérifier ancrage et état de l'élastique ; ne jamais l'attacher aux poignets. |
| 04 | Face pull à la poulie | `1794028207138.mp4` | `37b72b6627dea4a3d11ae08248e09ce66e3d3e0ea62762ef3c15d311e2c2df82` | **Mouvement incorrect : la corde descend vers les hanches au lieu d'être tirée vers le visage. Ne pas reproduire cette trajectoire.** La notice et la voix le disent explicitement, puis dictent le face pull et le tempo de la fiche. Ce n'est pas une démonstration correcte du geste. En miniature silencieuse sans notice, le GIF source est affiché à sa place ; la vidéo et la notice restent disponibles dans la fiche complète. |

Les quatre fichiers font 121 images sur 121 décodées, à 24 images/s (5,04 s). #01 : 640×448 ; #02–#04 : 640×480. PixVerse apparaît sur les vidéos. Les planches d'images sont dans `controle-epaules-01-04/` (0, 1, 2, 3, 4 et 5 secondes). Les copies MP4 dans `public/videos/` et `release/videos/` correspondent octet pour octet aux sources. Les posters sont ceux du kit, pas une preuve du geste animé ; pour #01 celui à cadrage large est conservé en référence même si le MP4 reçu ne conserve pas cet espace en haut.

Programmation inchangée : #01 3 × 10–12, tempo 2011, repos 75 s ; #02–#04 3 × 15, tempo 2011, repos 45 s. Tous les GIF demeurent présents. La variante myo-reps #05 n'est pas automatiquement associée à #02. Aucun nouvel APK n'est produit lors de cette intégration.

Vérifications : `npm test` : 242 réussis, 0 échec, 2 ignorés ; `npm run build` réussi. Le test du lot vérifie chaque hash, les posters, GIF, programmation et voix ; la lecture sur un téléphone n’a pas été testée ici.
