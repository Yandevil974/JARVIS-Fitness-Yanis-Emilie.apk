# Module 2 — Lot 1 : GIFs construits et intégrés

Lot 1 (3 mouvements) construit en animations 5 images A → M → B → M → A, en 440×246, avec pauses 25/20/50/20/25 cs. Chaque exercice dispose de son propre GIF :

| Exercice | Fichier | Taille |
|---|---|---:|
| Étirement dans l'encadrement de porte | `bab86b940de4e194.gif` | 337 709 octets |
| Bras tendu contre le mur | `ff256cedce4d41af.gif` | 341 659 octets |
| Position de l'enfant / Balasana | `51aa04203880f26a.gif` | 328 455 octets |

Intégration effectuée dans `public/media` et `release/media`, données de `src/data/visuals.js`, `public/media-index.json`, `release/media-index.json`, et runtime portable. Les images JPG précédentes restent intactes. Les alias de nom de Balasana pointent vers le même GIF parce qu'ils désignent le même exercice; les trois exercices distincts ont trois contenus/hachages différents.

Références de mouvement consultées :
- ExRx, Doorway Chest Stretch : https://exrx.net/Stretches/ChestGeneral/Doorway
- ExRx, Doorway Biceps Stretch (bras tendu contre le mur) : https://exrx.net/Stretches/Biceps/Doorway
- Beyogi, Child's Pose : https://beyogi.com/learn-yoga/poses/childs-pose/

Vérifications : `npm run build` réussi; `npm run build:portable` réussi; `npm test` — 97 tests, 95 réussis, 0 échec, 2 ignorés. Test de non-régression ajouté : mappings distincts, fichiers présents, signature GIF et nom conforme au SHA-256.

Ce lot est intégré au build web local. L'APK n'a pas été reconstruit et le module 2 n'est pas encore terminé : les lots 2 à 8 restent à produire/intégrer. Aucun autre module n'a été ouvert.
