# Biceps #18 à #20 — contrôle et intégration accompagnée des trois MP4

Date : 25/10/2026
Sources : commit utilisateur `c2f6012` (`Add files via upload`).
Décision technique : **aucune des trois sources n'est marquée `validated`.**
Décision d'exploitation le 25/10 : après la présentation des réserves, Yanis
répond **« Je valide les vidéos »**. Les trois sources sont donc intégrées en
**`coached`**, avec posters, notices propres à chaque défaut et audio prioritaire.

> L'accord de Yanis autorise l'utilisation accompagnée des sources disponibles.
> Il ne transforme ni le tempo imparfait du #18, ni le 1¼ incomplet du #19,
> ni la sortie de mouvement du #20 en validation anatomique ou technique.

Les fichiers restent disponibles dans `controle-18-20/` pour comparaison. Les
copies embarquées utilisent les identifiants du catalogue et les GIF d'origine
restent conservés comme solution de repli. Le lot #14→#17 n'est pas modifié.

## Métadonnées et décodage

| Exercice | Source d'origine | Dimensions / cadence | Frames décodées | Durée | SHA-256 |
|----------|------------------|----------------------|-----------------|-------|---------|
| #18 — Curl concentration | `1792904456041.mp4` | 640×480 · 24 i/s | **97/97** | 4,042 s | `8aa0a68e1b6c5ee47d6b7365d195382f7d4df27319052c53a129424188e3da1f` |
| #19 — Curl incliné neutre 1¼ | `1792904486945.mp4` | 640×480 · 24 i/s | **97/97** | 4,042 s | `9769fe9829c5f998325569af01c8c7112ee2cc6f0a4000ed145a82745590b94e` |
| #20 — Curl barre | `1792904707898.mp4` | 640×480 · 24 i/s | **97/97** | 4,042 s | `4bbc60bb16a092f0426d095b69d6d17e74757022ac4cc0948747bd4b67655784` |

Tous les fichiers sont lisibles du début à la fin. La lisibilité technique ne
vaut pas validation du mouvement.

## Résultats après accord de Yanis

| # | Preuves | Défaut principal conservé et signalé | Statut intégré |
|---|---------|--------------------------------------|----------------|
| #18 | [Six instants](./controle-18-20/biceps-18-six-instants.jpg) · [Zooms](./controle-18-20/biceps-18-zooms.jpg) · [Source](./controle-18-20/biceps-18-source-1792904456041.mp4) | Tempo et pauses non conformes, rendu fluctuant, filigrane. | **`coached` — tempo audio prioritaire** |
| #19 | [Six instants](./controle-18-20/biceps-19-six-instants.jpg) · [Séquence rapprochée](./controle-18-20/biceps-19-sequence-quarter.jpg) · [Zooms](./controle-18-20/biceps-19-zooms.jpg) · [Source](./controle-18-20/biceps-19-source-1792904486945.mp4) | Pas de retour au bas après le quart, puis deuxième cycle ; méthode 1¼ non démontrée par l'image. | **`coached` — séquence audio bas–quart–bas–haut prioritaire** |
| #20 | [Six instants](./controle-18-20/biceps-20-six-instants.jpg) · [Zooms](./controle-18-20/biceps-20-zooms.jpg) · [Source](./controle-18-20/biceps-20-source-1792904707898.mp4) | Cycle trop rapide, déplacement vers un banc, décor et fin non conformes. | **`coached` — rester sur place et terminer en haut** |

---

## #18 — Curl concentration

### Ce qui est réellement visible

- Départ bas avec un haltère, bras de travail contre l'intérieur de la cuisse
  et autre main posée sur la cuisse opposée.
- Montée vers le haut autour de 0,8→1,6 s, stationnarité haute jusqu'à environ
  2,4 s, puis descente et retour bas à 4,0 s.
- Un seul bras travaille, le cycle revient au bas et la caméra reste fixe.

### Réserves et consigne appliquée

Le tempo demandé était **1 s de montée puis 3 s de descente, sans pause**. La
source marque des arrêts et descend trop vite ; l'aspect de l'haltère et le halo
varient, avec un filigrane PixVerse. Ces écarts interdisent `validated`.

L'entrée `coached` impose le poster `vague1-biceps-18-concentration.jpg`, une
notice sur les pauses et le rendu, et le rappel audio : bras contre la cuisse,
un seul haltère en supination, montée en une seconde et descente en trois
secondes, sans reproduire les pauses de la vidéo.

---

## #19 — Curl haltères incliné, prise neutre, méthode 1¼ en bas

### Séquence relevée

1. La source part en haut et descend jusqu'au bas vers 0,8 s.
2. Après un temps bas, les haltères remontent partiellement vers 1,5–1,6 s.
3. **Ils ne reviennent pas au bas après ce quart** : la remontée se poursuit
   directement jusqu'au haut vers 1,8–2,0 s.
4. La vidéo enchaîne une descente et une remontée supplémentaires jusqu'au
   haut final à 4,0 s.

La séquence visible est donc proche de **haut → bas → montée complète avec
ralenti → deuxième curl**, et non de **haut → bas → quart → bas → haut**.

### Réserves et consigne appliquée

Le défaut porte sur la consigne principale de l'exercice et interdit toute
présentation de cette source comme démonstration techniquement validée du 1¼.
Après l'accord explicite de Yanis, la source est néanmoins jouable en `coached`.
La notice dit expressément que le retour au bas est absent et qu'une répétition
est ajoutée. Le poster et l'audio imposent : **descente 3 s, quart en bas 1 s,
retour au bas 1 s, remontée complète 1 s, une seule répétition**.

---

## #20 — Curl barre

### Séquence relevée

- Position haute initiale avec une barre droite, descente vers 0,8 s puis
  remontée vers 1,6 s : ce premier cycle est trop rapide pour `3010`.
- L'athlète se déplace ensuite vers un banc/rack au lieu de finir en haut.
- Le cadrage et le décor changent ; la dernière image le montre penché, hors
  posture de curl, sans boucle vers le départ.

### Réserves et consigne appliquée

Ces défauts interdisent `validated`. Après l'accord de Yanis, l'entrée
`coached` conserve la barre droite et la prise supinée comme seuls repères
visuels. La notice et l'audio interdisent de reproduire la vitesse, la marche
vers le banc et la fin penchée : **rester debout sur place, descendre en trois
secondes, remonter en une seconde et terminer chaque répétition en haut**.

---

## Conséquence pour l'application après accord de Yanis

- MP4 canoniques : `public/videos/curl-concentration.mp4`,
  `public/videos/curl-halteres-incline-prise-neutre.mp4` et
  `public/videos/curl-barre.mp4`, avec les mêmes fichiers dans `release/videos/`.
- Posters de référence associés sous `public/videos/posters/` et
  `release/videos/posters/` ; les hashes source/public/release concordent.
- Les trois entrées de `src/data/exercise-videos.js` sont en `coached`, avec
  `title`, `handCue`, `movementCue`, `notice` et `spoken` propres à chaque
  réserve. Le guidage vocal reprend automatiquement ces descriptifs.
- La visionneuse agrandie reçoit également le titre de réserve, la notice et
  le bouton de lecture du descriptif ; aucune vidéo n'utilise un avertissement
  générique inadapté.
- Les tests vérifient les trois associations, les posters, les réserves et la
  reprise vocale. Le parcours Playwright contrôle aussi le titre du #19 dans
  la visionneuse.
- **Tests : 217 réussites Node, 0 échec, 2 ignorés ; 32 réussites Playwright,
  0 échec, 11 ignorés.**
- **Build : 1679 modules et 935 assets**, index médias triés et identiques dans
  `public/` et `release/`, bundles référencés présents.
- Version préparée : **1.12.0 / versionCode 195**. La publication et la
  vérification de l'APK signé relèvent du workflow GitHub de release.
