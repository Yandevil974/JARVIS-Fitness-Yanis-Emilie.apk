# Dos #05 et #09→#13 — contrôle des vidéos déposées

Dépôt de Yanis `38c21c1` : six sources attribuées au lot demandé par geste et comparaison visuelle avec les photos de départ ; elles sont intégrées `coached` avec leurs réserves, notice et descriptif vocal. L'intégration ne signifie pas que les défauts sont corrigés. Les programmations, GIF, vidéos et sources antérieurs sont conservés. Aucun APK n'a été produit.

| # | Fichier déposé | Réserves constatées | Dix instants |
|---|---|---|---|
| 05 | `1793766716767.mp4` | **Identique au MP4 déjà utilisé pour #07** (`1793528285602.mp4`). Le buste se redresse au tirage : le défaut signalé par Yanis n'est pas corrigé. Ne pas le reproduire ; maintenir le buste fixe incliné à 45°. | [Planche](./controle-dos-05-09-13/1793766716767-dix-instants.jpg) |
| 09 | `1793801260971.mp4` | Départ bras fléchis, barre et câble difficiles à suivre continûment. Partir bras tendus et garder la barre devant la tête ; suivre le 3010. | [Planche](./controle-dos-05-09-13/1793801260971-dix-instants.jpg) |
| 10 | `1793767077350.mp4` | La vidéo dure 5,04 s alors que pause 2 s + montée 1 s + descente 4 s exigent 7 s. Vue arrière : passage du menton au-dessus non certifié. | [Planche](./controle-dos-05-09-13/1793767077350-dix-instants.jpg) |
| 11 | `1793800879136.mp4` | Les poignées et la prise neutre paumes face à face ne sont pas clairement démontrées ; cycle de 7 s impossible à montrer fidèlement en 5,04 s. | [Planche](./controle-dos-05-09-13/1793800879136-dix-instants.jpg) |
| 12 | `1793800965600.mp4` | **Identique au MP4 utilisé pour #02** (`1793362391793.mp4`) : bras déformé, coude trop haut et trajet du coude ouvert non clairement démontré. Ne pas reproduire le défaut. | [Planche](./controle-dos-05-09-13/1793800965600-dix-instants.jpg) |
| 13 | `1793801178290.mp4` | Supination peu lisible, buste se redresse et pause visible. Garder la prise supinée et le buste incliné fixe, sans pause, tempo 3010. | [Planche](./controle-dos-05-09-13/1793801178290-dix-instants.jpg) |

Les sources #05, #10, #11, #12 et #13 : 640 × 480, 24 i/s, 121 images décodées sur 121, 5,04 s. #09 : 1024 × 768, 24 i/s, 97 images décodées sur 97, 4,04 s. Les planches donnent dix instants répartis ; elles ne suffisent pas pour certifier l'anatomie ou le tempo. SHA-256 des sources et de chaque copie `public/` et `release/` :

| # | SHA-256 |
|---|---|
| 05 | `6569b54e0935d0320d6abc9904508c67237d621aac0bbae7e29c437359d74793` |
| 09 | `0f3e7d8114d77ca73d15e75cdbdac9593fe462a25d942667dfc9b96e35a4410d` |
| 10 | `8791a1ea3cab9d7ea88d86d631bd2b7297358e13eb3b2f03a49a5e2cdc37377a` |
| 11 | `be0d4305552668e9314bc950c6730e5f1fa6ec0a4aa85ac55363491e5b55ddaf` |
| 12 | `3a0a0ceefcb3e1c2296badfe2ff21be7fad66da68f29609a8a29c3dda61d813f` |
| 13 | `65578aca4e4de125c3d4f229f2f7e06abea93e533e24fe4caa36aa6b0204a331` |

## Vérifications

- Tests Node : **237 réussis, 0 échec, 2 ignorés** ; build web réussi. Les tests dédiés vérifient les sources, doublons, copies, GIF, tempos et consignes.
- Serveur du build : page et six fichiers MP4 répondent HTTP 200.
- Parcours Playwright préparé mais non exécuté : aucun navigateur Playwright n'est installé dans cet environnement. La navigation et la lecture effectives en navigateur restent à vérifier.
