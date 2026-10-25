# Biceps #14 à #17 — contrôle des quatre MP4 reçus

Date : 25/10/2026
Source : commit utilisateur `3b36ada` (« Add files via upload »)
Décision technique : **aucun des quatre MP4 n'est marqué `validated`.**
Décision d'exploitation le 25/10 : Yanis valide explicitement leur intégration,
faute de meilleure version disponible. Ils sont donc intégrés en **`coached`**,
avec posters de référence, notices propres à chaque défaut et audio prioritaire.

> Accord de Yanis : « Je valide les 4 vidéos car je ne peux pas faire mieux ».
> Cet accord autorise leur utilisation accompagnée ; il ne transforme pas les
> défauts relevés ci-dessous en validation anatomique ou technique.

Les fichiers restent disponibles dans `controle-14-17/` pour comparaison. Les
copies embarquées utilisent les identifiants du catalogue et les GIF d'origine
restent conservés comme solution de repli.

## Méthode de contrôle

- Ouverture et extraction avec OpenCV Headless.
- Pour chaque MP4 : **1024 × 768**, **24 im/s**, **97 images**, **4,042 s**.
- Six instants contrôlés : **0,00 s, 0,79 s, 1,58 s, 2,42 s, 3,21 s et 4,00 s**.
- Contrôle rapproché complémentaire du buste, des bras, des haltères et des mains.
- Comparaison avec les positions et les mouvements définis dans
  `09-BICEPS-14-17-PRODUCTION.md`.

## Correspondance des sources

| Exercice | Fichier source | Taille | SHA-256 |
|---|---|---:|---|
| #14 — Curl incliné avec supination | [`1792899561171.mp4`](./controle-14-17/1792899561171.mp4) | 724 085 octets | `20a7497948901b8a3625c6bd7f538bf920638fab793ada5da40fc5d300504eab` |
| #15 — Curl marteau debout | [`1792899854355.mp4`](./controle-14-17/1792899854355.mp4) | 905 905 octets | `e406cb700477c60383bbc5bb68f6b109455961d1f672fa9f34e3a1cbd90c5cab` |
| #16 — Curl Scott à un haltère | [`1792899883807.mp4`](./controle-14-17/1792899883807.mp4) | 911 133 octets | `7e7bf4ef6f120b8c99316c013fdab43e8e40a2129b7c6b6479cf6bd6a4680095` |
| #17 — Zottman debout | [`1792900163401.mp4`](./controle-14-17/1792900163401.mp4) | 1 048 806 octets | `c3ce9dbb335abde38c8bd53107e4f52cad220ba42692b46ffd4af32c8a67098f` |

## Résultats

| # | Planche des six instants | Zooms | Statut après accord de Yanis |
|---|---|---|---|
| #14 | [Contrôle](./controle-14-17/biceps-14-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-14-zooms.jpg) | **`coached` — cycle incomplet signalé** |
| #15 | [Contrôle](./controle-14-17/biceps-15-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-15-zooms.jpg) | **`coached` — athlète et prise non stables signalés** |
| #16 | [Contrôle](./controle-14-17/biceps-16-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-16-zooms.jpg) | **`coached` — anatomie et caméra non stables signalées** |
| #17 | [Contrôle](./controle-14-17/biceps-17-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-17-zooms.jpg) | **`coached` — séquence et fin non conformes signalées** |

### #14 — Curl incliné avec supination

Le banc incliné et les deux haltères sont bien présents. En revanche, la
séquence remonte d'abord légèrement vers le sommet, puis descend et **termine
en bas à 4,00 s**. Elle ne réalise donc pas le cycle haut → bas → haut demandé
et ne peut pas former la boucle attendue. La supination progressive n'est pas
assez lisible pour compenser ce défaut de séquence.

**Correction de génération :** commencer exactement au sommet, rendre le premier
mouvement visible descendant, montrer une seule répétition complète et finir au
sommet, dans la position exacte de la photo.

### #15 — Curl marteau debout

La prise neutre verticale est visible au début, mais elle n'est pas conservée.
La séquence change aussi fortement de rendu : musculature rouge sur tout le
corps, puis apparence différente du buste, avec des chiffres incrustés et des
variations de cadrage. À 3,21 s, les haltères hauts ne conservent pas clairement
la verticale du marteau.

**Correction de génération :** conserver exactement le même athlète chrome, la
même tenue, le même décor et le même cadrage ; supprimer tout chiffre ou texte ;
garder les deux haltères verticaux, les pouces haut et les paumes neutres
pendant toute la répétition ; finir en haut.

### #16 — Curl Scott à un haltère

Un seul haltère et une flexion/extension au pupitre sont visibles. Cependant,
la caméra et le décor dérivent. Surtout, la coloration rouge/orange quitte le
biceps de travail et apparaît sur la cuisse dans les derniers instants, ce qui
rend la représentation anatomique incorrecte.

**Correction de génération :** verrouiller la caméra et le décor ; conserver la
coloration exclusivement sur le biceps de travail, jamais sur une jambe ;
garder le haut du bras sur le coussin, une seule haltère et la supination fixe ;
finir en haut.

### #17 — Zottman debout à deux haltères

La séquence commence bien en bas avec deux haltères et passe par une position
haute puis une position basse. Mais elle effectue une nouvelle remontée et
**termine en haut à 4,00 s**, au lieu de revenir en bas en supination. La caméra
et le décor changent également. Les rotations aux extrémités et la descente
pronée ne sont pas assez lisibles dans les instants contrôlés pour valider le
Zottman.

**Correction de génération :** une seule séquence bas supiné → haut supiné →
rotation à l'arrêt → bas proné → rotation à l'arrêt → bas supiné ; aucune
seconde montée ; caméra fixe ; dernière position basse identique à la photo.
Prévoir 6 à 8 secondes pour laisser les rotations et la descente contrôlée
lisibles.

## Conséquence pour l'application après accord de Yanis

- Les quatre MP4 sont copiés dans `public/videos/` et dans le build `release/`
  avec leurs identifiants catalogue, sans modifier les sources d'audit.
- Les quatre posters sont les images de référence déjà préparées, afin de
  montrer la position et la prise à reproduire avant la lecture.
- Les entrées de `src/data/exercise-videos.js` sont toutes en `coached`, avec
  `handCue`, `movementCue`, `notice` et `spoken` propres à chaque exercice.
- Le titre de la notice est personnalisable dans `Movement.jsx` et dans la
  visionneuse : #14/#15/#16/#17 ne reçoivent donc pas un avertissement générique
  inadapté sur la seule rotation des mains.
- Le guidage vocal reprend automatiquement le descriptif corrigé. Aucun statut
  `validated` n'est attribué et les GIF d'origine ne sont pas supprimés.
- Les tests unitaires vérifient les quatre associations, les réserves et la
  reprise vocale ; le test Playwright vérifie leur affichage dans la
  bibliothèque et la visionneuse.
