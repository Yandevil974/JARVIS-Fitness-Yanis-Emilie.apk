# Dos #24 — pullover haltère plat : vidéo déposée

Yanis a déposé `1794023643714.mp4` au commit `9dc0b7b` et demande expressément de **prendre cette vidéo telle quelle** : le générateur ne descend pas plus bas et il ne souhaite pas dépenser d'autres crédits. Ne pas demander de nouvelle vidéo ni relancer une génération. Elle est intégrée `coached` avec la voix et les réserves ci-dessous ; programmation et GIF d'origine sont conservés.

- Source et copies `public/videos/pullover-haltere-plat.mp4` et `release/videos/pullover-haltere-plat.mp4` : SHA-256 `0466ffefd32052cec304f4b114150f1bca74ef032023f865772983d0da4905de`.
- Vidéo 640 × 400, 24 images/s, 121 images décodées sur 121, environ 5,04 s. [Planche de dix instants](./controle-dos-24/1794023643714-dix-instants.jpg).
- L'haltère vertical ne descend pas nettement derrière la tête ; les coudes changent d'angle et la prise des mains est peu lisible. Ne pas décrire l'image comme une démonstration correcte de l'amplitude. La voix recommande une prise sûre adaptée au matériel, une descente à l'arrière de la tête **uniquement dans une amplitude confortable**, sans forcer ni chercher à toucher le sol, avec arrêt avant toute douleur. Elle rappelle le tempo 3010.
- Programmation inchangée : 3 séries de 12–15, tempo 3010, 60 s de repos. Le GIF `/media/f56fbc2e2510c4b2.gif` reste disponible en repli.

Avec cette intégration, les **25 exercices du dos ont une vidéo**. Le #11 triceps reste séparément en stand-by.

## Vérifications

- Tests Node : **241 réussis, 0 échec, 2 ignorés** ; build web réussi. Le test vérifie la source, les copies, le GIF, la programmation, les consignes et les 25 vidéos dos.
- Le serveur du build retourne HTTP 200 pour la page, le MP4, son poster et le GIF d'origine.
- Le test Playwright n'a pas pu démarrer : Chromium n'est pas installé. La lecture en navigateur reste à vérifier. Aucun APK produit.
