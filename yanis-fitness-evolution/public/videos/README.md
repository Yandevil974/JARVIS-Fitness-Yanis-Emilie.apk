# Bibliothèque des vidéos 3D — Yanis Fitness Evolution

## Convention de nommage

```
/public/videos/<id-exercice>.mp4        → vidéo validée ou accompagnée (H.264)
/public/videos/posters/<id-exercice>.jpg → image d’attente (poster)
```

`<id-exercice>` = identifiant unique du catalogue (`EXERCISE_MAP`,
ex. `extension-triceps-a-la-poulie`). L’association vidéo ↔ exercice se fait
dans `src/data/exercise-videos.js` (statut `pending` → `coached` ou
`validated`). `coached` est réservé aux vidéos IA avec défaut connu : le
`coaching.spoken`, la consigne visible et le repli GIF sont alors obligatoires.

## Spécifications des fichiers

| Réglage   | Valeur recommandée                              |
|-----------|--------------------------------------------------|
| Conteneur | MP4 (H.264 + AAC), fallback WebM accepté         |
| Résolution| 720p (1280×720) — 1080p uniquement si < 8 Mo    |
| Durée     | 6 à 12 s en boucle (1 répétition complète)       |
| Poids     | **≤ 8 Mo par vidéo** (idéal : 2 à 5 Mo)          |
| Audio     | aucun (muet) — la voix du coach reste dans l’app |

## Compression (à lancer avant d’ajouter une vidéo)

```bash
ffmpeg -i entree.mp4 -c:v libx264 -crf 23 -preset slow \
  -vf "scale=1280:-2" -movflags +faststart -an \
  public/videos/<id-exercice>.mp4

ffmpeg -i public/videos/<id-exercice>.mp4 -ss 00:00:01 -frames:v 1 -q:v 3 \
  public/videos/posters/<id-exercice>.jpg
```

## Règle anti-gonflement du dépôt

- Ne committer que des vidéos **validées**, ou **coached** avec leur consigne
  corrective (check-list `docs/videos-3d/03-PROCEDURE.md`).
- Au-delà de ~20 vidéos, passer au stockage externe (hébergeur statique ou
  GitHub Releases) : mettre l’URL https dans `src` de `exercise-videos.js`
  au lieu d’un chemin local. Le lecteur (`Movement.jsx`) accepte les deux.
- Ne JAMAIS supprimer le GIF d’origine tant que la vidéo n’est pas validée.

## Triceps #02/#04 — intégration accompagnée du 25/10/2026

| Exercice | MP4 canonique | Poster | Statut et réserve principale |
|---|---|---|---|
| #02 `triceps-dips` | `triceps-dips.mp4` | `posters/triceps-dips.jpg` | `coached` : buste incliné, texte IA parasite et filigrane ; buste droit et tempo `3010` dictés |
| #04 `french-press-poulie-basse` | `french-press-poulie-basse.mp4` | `posters/french-press-poulie-basse.jpg` | `coached` : coude vers l’avant et corde peu lisible ; coudes hauts et tempo `3010` dictés |

Leur dépôt sur la branche par Yanis vaut accord d'intégration, pas perfection
technique. Les GIF d'origine restent présents. Contrôle complet :
`docs/videos-3d/14-TRICEPS-02-04-CONTROLE-MP4.md`.

## Triceps #05→#09 — intégration accompagnée du 25/10/2026

| Exercice | MP4 canonique | Poster | Statut et réserve principale |
|---|---|---|---|
| #05 `french-press-barre-ez` | `extensions-triceps-ez-commune-05-06-09.mp4` | `posters/french-press-barre-ez.jpg` | `coached` : source commune trop proche du cou ; barre vers le front et tempo `4010` dictés |
| #06 `extensions-triceps-barre-ez` | `extensions-triceps-ez-commune-05-06-09.mp4` | `posters/extensions-triceps-ez-commune-05-06-09.jpg` | `coached` : même source ; barre derrière la tête, hauts des bras fixes et tempo `4010` dictés |
| #07 `barre-au-front-pushdown-triceps` | `barre-au-front-pushdown-triceps.mp4` | `posters/barre-au-front-pushdown-triceps.jpg` | `coached` : cycle accéléré ; coudes fixes, drop set et tempo `3010` dictés |
| #08 `french-press-haltere-un-bras` | `french-press-haltere-un-bras.mp4` | `posters/french-press-haltere-un-bras.jpg` | `coached` : orientation du poignet et vitesse ; prise neutre et tempo `3010` dictés |
| #09 `extensions-triceps-pullover-barre-ez` | `extensions-triceps-ez-commune-05-06-09.mp4` | `posters/extensions-triceps-ez-commune-05-06-09.jpg` | `coached` : même source ; arc derrière la tête, épaules + coudes et tempo `3010` dictés |

La source commune #05/#06/#09 est une **exception explicitement autorisée par
Yanis**, limitée à ces trois identifiants. Elle ne change pas la convention de
nommage ni la règle d'une vidéo propre aux autres variantes. Les cinq entrées
restent `coached`, jamais `validated`. #03 reste reporté et #02 n'est pas
retouché sans clarification. Preuves :
`docs/videos-3d/16-TRICEPS-05-09-CONTROLE-MP4.md`.
