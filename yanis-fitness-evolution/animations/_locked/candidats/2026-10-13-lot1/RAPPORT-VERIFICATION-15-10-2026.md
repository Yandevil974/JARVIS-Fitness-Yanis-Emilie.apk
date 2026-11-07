# LOT 1 (3 polyarticulaires) — vérification indépendante du 15/10/2026

> **MISE À JOUR — 15/10, plus tard dans la journée : lot 1 INTÉGRÉ.**
> Feu vert explicite reçu (« J'autorise l'intégration des 3 GIF tels quels ») →
> intégration aux 5 endroits + runtime (commit `a7090a7`), puis APK téléphone
> **1.5.2 / versionCode 182** (commit `13bfc85`, release `v1.5.2-lot1-musculation`,
> workflow « Build Yanis Fitness Evolution APK » : succès).
> Vérifié après coup : les 3 exercices portent bien leur GIF
> (`Développé couché barre` → `/media/acbab53a64c18aab.gif`,
> `Tractions prise large` → `/media/d36d738b07fe1305.gif`,
> `Fentes barre` → `/media/6baa655d39de069e.gif`), 124 exercices animés sur 209,
> `media-index` 288 entrées triées, bundle à 2 tables + `node --check` OK,
> `npm test` 96 · 94 passés · 0 échec · 2 ignorés.
> **Les réserves du §3 restent valables** (01 : amplitude + barre horizontale ; 02 : menton vers
> la barre) : elles ne bloquent pas la livraison (objectif 1 : l'app doit marcher) mais
> méritent une reprise ultérieure.

Statut initial de cette vérification (avant le feu vert) : **RIEN N'ÉTAIT INTÉGRÉ**, les 3 GIF
attendaient une phrase explicite en toutes lettres.
Vérification faite dans une nouvelle session (clone vierge + branche de reprise).

## 1. État mesuré de l'app (reproduit, pas estimé)

| Contrôle | Résultat |
|---|---|
| `npm test` | **96 tests · 94 passés · 0 échec · 2 ignorés** ✅ |
| `public/media-index.json` | **285 entrées**, trié ✅, identique à `release/` ✅ |
| Abduction de hanche (intégrée le 15/10) | HTTP **200 · image/gif · 335 342 o** ✅ |
| Collision de nom pour les 3 sha du lot 1 | aucune ✅ |

## 2. Mesures `verifier-pose.py --frames` (rejouées ce tour, identiques au relevé du 13/10)

| GIF | sol_dom (5 frames) | saturation | mer | lime | or |
|---|---|---|---|---|---|
| 01 développé couché barre | 227-235 | 41,6-42,9 | 2,82-3,86 % | ≤ 0,05 % | 4,43-5,04 % |
| 02 tractions prise large | 229-233 | 43,7-46,1 | 2,64-3,42 % | ≤ 0,07 % | 4,20-5,06 % |
| 03 fentes barre | 225-234 | 43,2-45,1 | 2,36-2,68 % | ≤ 0,06 % | 5,85-6,13 % |

Tous dans la plage validée (219-253 pour `sol_dom` en rouge ; cible 232 211 188).
Structure : 5 frames, 440x246, délais **25/20/50/20/25 cs**, ~320 Ko, séquence A-M-B-M-A vérifiée
(NCC frame ↔ pose source = 0,997-0,998 pour les 5 positions, les 3 GIF).

## 3. Contrôle visuel fait par l'agent (vision activée, images lues une par une)

Ce qui est **conforme** :
- Athlète : corps blanc/argent mat, visage noir sans traits, casquette, short noir,
  baskets blanches, muscles jaune-orangé doré. Aucun vert lime, aucun rouge.
- Décor E1 : terrasse vue mer, mer bleue dense, végétation dense (palmiers + plantes en pot),
  lumière dorée, muret bas. Aucun interdit (pas de salle, parquet, miroir, pavés gris).
- Sol sablé clair, joints très atténués (meilleur que l'ancien décor pâle).
- 03 fentes barre : vraie descente (bassin **+38 px** de 768, 4,9 %), genou avant bien plié,
  pied avant posé au sol, aucune jambe qui traverse le sol. Amplitude conforme.

Ce qui **n'est pas conforme** (mesuré image par image, repères en pixels sur le 1376x768) :

| Point | Mesure | Lecture |
|---|---|---|
| 01 — amplitude | centre de la barre : A y=236 → B y=281 (Δ **45 px / 768 = 5,9 %**) | mouvement réel mais **faible** : la barre s'arrête **sous** le niveau des pectoraux, elle ne touche jamais la poitrine |
| 01 — barre | dénivelé entre les deux disques : A **+14 px**, M 0 px, B **−15 px** | la barre **bascule d'un côté puis de l'autre** au lieu de rester horizontale ; la référence athlète (barre horizontale) n'est pas tenue |
| 01 — caméra | banc de profil « couché » en vue diagonale | la barre part de très haut à gauche et descend à droite ; lueur d'erreur de perspective du générateur |
| 02 — amplitude | le corps monte de **10,7 px / 768 = 1,4 %** ; écart menton→barre quasi inchangé (259 px en A, 259 px en B) | **le menton ne monte jamais vers la barre** ; ce n'est pas une traction, c'est une suspension qui se tend |
| 02 — bras | de face, les coudes restent tendus | aucune flexion visible du coude, or c'est LE geste de la traction |

Références consultées pour juger les postures (règle 4.6) :
- traction, prise large et menton au-dessus de la barre : espace-musculation.com/traction.html,
  wod-open.com/pull-up-guide-complet-traction-crossfit/ (« le menton doit passer au-dessus de la barre »),
  conseilsport.decathlon.fr/reussir-a-faire-des-tractions-musculation
- développé couché : barre horizontale, descendue jusqu'aux pectoraux avant de pousser.

Comparaison interne (mêmes mesures sur des GIF déjà validés du dépôt) :

| Animation | Amplitude du centroïde du corps (5 frames) |
|---|---|
| front squat verrouillé | **73,8 px** (30,0 % de la hauteur) |
| fentes bulgares verrouillées | **22,2 px** (9,0 %) |
| 01 développé couché (lot 1) | 7,6 px (3,1 %) |
| 02 tractions (lot 1) | 10,7 px (4,3 %) |
| 03 fentes barre (lot 1) | 7,3 px (3,0 %) — mais vraie descente du bassin (38 px) |

## 4. Demande de décision

1. **01 développé couché barre** : à refaire (amplitude + barre horizontale) ?
2. **02 tractions prise large** : à refaire (menton vers la barre + flexion des coudes) ?
3. **03 fentes barre** : conforme au contrôle visuel → intégration possible telle quelle.

Tant que la phrase d'accord n'est pas écrite en toutes lettres, **rien n'entre dans l'app**.

## 5. Aperçus joints

- `APERCU-LOT1-3-en-1.gif` — les 3 GIF animés côte à côte (5 frames, 25/20/50/20/25 cs).
- `APERCU-LOT1-pose-B.png` — la pose B des 3 exercices (le point le plus bas du mouvement).
