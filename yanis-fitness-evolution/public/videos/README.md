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
