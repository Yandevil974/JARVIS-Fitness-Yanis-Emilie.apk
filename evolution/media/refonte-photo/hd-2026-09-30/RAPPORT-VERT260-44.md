# Prototype n°44 — WebP animé 660 px + vert rapproché du 260 (30/09/2026)

Réglages **choisis par l'utilisateur le 30/09/2026** : format **WebP animé**, hauteur **660 px**,
**vert rapproché du n°260**. Aucun GIF livré remplacé, aucun appel de génération d'image,
APK non reconstruit, proposition **non intégrée**.

Dossier : `evolution/media/refonte-photo/hd-2026-09-30/prototype-44-vert260/`
Outil rejouable : `evolution/media/tools/prototype-hd-44-vert260.py`
Page de test (à ouvrir sur le téléphone) : `evolution/media/refonte-photo/hd-2026-09-30/index.html`

---

## 1. Ce qui a été fait, dans l'ordre imposé (retouche AVANT export)

1. **Mesure du vert réel des masters** : le vert n'est pas seulement pastel, il est **dilué**.
   Phase 1 : cœur 10 386 px pour un périmètre de 787 px → **transition de ~13 px** avec la peau
   (phase 2 : ~8 px). C'est ce halo qui produit l'effet « feuille verte collée ».
   Une seule zone verte par phase, sur le bras : **aucune plante parasite**.
2. **Contour resserré** : rampe alpha 0,03 → 0,17 (au lieu d'une transition qui court jusqu'à ~0,26),
   silhouette = plus grande composante connexe, trous internes comblés (les sillons du muscle ne
   trouent pas la forme). Mesuré : transition **13,0 → 8,5 px** (phase 1) et **8,2 → 5,5 px** (phase 2).
3. **Famille de couleurs du 260** par **correspondance de percentiles** (p5/p50/p95) sur la saturation
   et la valeur, teinte recentrée à 50 % de l'écart — calculée sur **les deux phases ensemble** pour
   qu'elles partagent le même vert (aucun saut au changement d'image). **Aucun pixel uniformisé.**

| | médiane RGB | teinte | saturation | valeur | nuances distinctes | part teinte dominante |
|---|---|---|---|---|---|---|
| Master phase 1 | 134,179,62 | 85,4° | 0,677 | 0,702 | 15 049 | 0,002 |
| **Travail phase 1** | **104,156,20** | 85,6° | **0,894** | 0,612 | 11 137 | 0,003 |
| Master phase 2 | 116,187,47 | 90,4° | 0,749 | 0,733 | 12 332 | 0,001 |
| **Travail phase 2** | **96,166,13** | 88,1° | **0,925** | 0,651 | 9 657 | 0,002 |
| Référence 260 | 91,157,17 | 86,3° | 0,914 | 0,616 | — (6 teintes, GIF 256 couleurs) | 0,310 |

La référence 260 mesurée sur son GIF n'a que **6 teintes** avec 31 % sur la teinte dominante : c'est un
GIF appauvri. Le prototype atteint la **même famille** (saturation 0,89–0,93, valeur 0,61–0,65,
teinte 86–88°) en gardant **11 137 nuances** et une teinte dominante à **0,3 %** : relief conservé,
pas de plaque.

**Garantie mesurée** : 1 045 768 / 1 052 290 pixels hors zone verte → **0 pixel modifié** (écart max 0).

## 2. Exports réellement décodés (388×660, 2 images, 2×500 ms)

| Fichier | Poids | Erreur hors vert | Erreur dans le vert | PSNR |
|---|---|---|---|---|
| **WebP animé q90** | **98 ko** | 1,85 | 1,88 | 41,3 dB |
| WebP animé q92 | 115 ko | 1,61 | 1,68 | 42,2 dB |
| WebP animé q85 | 73 ko | 2,23 | 2,29 | 39,5 dB |
| WebP animé sans perte (contrôle) | 612 ko | 0 | 0 | sans perte |
| GIF de repli 660 (si la WebView refuse le WebP) | 403 ko | 2,79 | 2,05 | 37,5 dB |
| *Livré aujourd'hui (259×440, pour mémoire)* | *198 ko* | *10,7* | *24,0* | *21,7 dB* |

Le GIF de repli à cette définition est **moucheté dans le vert** (limite de 256 couleurs, visible sur
`planches/VERT260-png-vs-decode.png`) : c'est exactement la limite décrite dans la passation.

**Poids projeté pour les 389 visuels** : ≈ **37 Mo** en WebP q90 (44 Mo en q92), contre **72 Mo**
aujourd'hui — plus net *et* deux fois plus léger.

## 3. Contrôles de non-régression du geste validé

- Cadrage : même fenêtre que le GIF livré (259/264 de la largeur), **aucun recadrage, miroir ou rotation**.
- Rien hors de la zone verte n'a bougé : **0 pixel**.
- Le geste (prise supinée, coude sur le pupitre, position du disque) vient du **master lot69** déjà
  validé ; ce prototype ne redessine ni main ni bras.
- `sha256` des deux GIF livrés 44/45 consignés dans `CONTROLES.json` (`livres_inchanges`).

## 4. Décision demandée avant toute reprise des 389

1. Le WebP animé s'anime-t-il bien sur le téléphone (voir diagnostic de `index.html`) ?
2. Qualité d'image retenue : **q92 (115 ko)**, **q90 (98 ko)** ou q85 (73 ko) ?
3. Le vert (contour resserré + famille 260) est-il validé tel quel ?

Ensuite seulement : reprise des 389 selon cette méthode, **numéro par numéro, avec accord explicite**
avant tout remplacement d'un GIF livré. Les 26 corrections de geste et les 3 styles intégrés (44/45/80)
restent en place ; le n°80 n'est pas touché.
