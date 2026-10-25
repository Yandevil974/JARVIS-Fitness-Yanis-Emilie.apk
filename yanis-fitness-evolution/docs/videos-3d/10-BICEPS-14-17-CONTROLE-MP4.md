# Biceps #14 à #17 — contrôle des quatre MP4 reçus

Date : 25/10/2026
Source : commit utilisateur `3b36ada` (« Add files via upload »)
Décision : **aucun des quatre MP4 n'est intégré ou marqué `validated` en l'état.**

Les fichiers restent disponibles dans `controle-14-17/` pour comparaison et
reprise. Leur présence dans la documentation ne les rend pas jouables dans
l'application. Les GIF existants demeurent les visuels utilisés pour #14 à #17.

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

| # | Planche des six instants | Zooms | Verdict |
|---|---|---|---|
| #14 | [Contrôle](./controle-14-17/biceps-14-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-14-zooms.jpg) | **Non intégré — cycle incomplet** |
| #15 | [Contrôle](./controle-14-17/biceps-15-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-15-zooms.jpg) | **Non intégré — athlète et prise non stables** |
| #16 | [Contrôle](./controle-14-17/biceps-16-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-16-zooms.jpg) | **Non intégré — anatomie et caméra non stables** |
| #17 | [Contrôle](./controle-14-17/biceps-17-six-instants.jpg) | [Mains et bras](./controle-14-17/biceps-17-zooms.jpg) | **Non intégré — séquence et fin non conformes** |

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

## Conséquence pour l'application

- Aucun ajout dans `public/videos/` ou `release/videos/`.
- Aucune entrée ajoutée dans `src/data/exercise-videos.js`.
- Aucun statut `coached` ou `validated` attribué.
- Aucun changement de version et aucune nouvelle release.
- Les quatre sources sont conservées pour audit, mais une nouvelle génération
  est nécessaire avant une intégration propre.

Si Yanis souhaite malgré tout exploiter une séquence imparfaite comme support
`coached`, cela nécessitera son accord explicite et une consigne corrective
adaptée ; ce statut ne sera pas déduit automatiquement de ce contrôle.
