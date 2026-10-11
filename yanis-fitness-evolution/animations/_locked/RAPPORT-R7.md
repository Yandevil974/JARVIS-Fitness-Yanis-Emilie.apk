# RAPPORT R7 — dernière pose (abduction hanche M) — 11 octobre 2026

## Mission
Régénérer **uniquement** la pose M d'abduction hanche (la précédente était un athlète
allongé sur le côté = autre exercice), assembler le GIF, mesurer, présenter.
**Ne pas intégrer** sans accord explicite.

## Fait
- Source pose M : `_audit/2026-10-11/gif/themeA/abduction-hanche-elastique-3poses.gif` image 1
  (athlète DEBOUT, jambe droite en abduction, élastique, mains sur les hanches).
- Référence sol : `reference/05-SOL-CIBLE-1er-GIF-valide.png`.
- 1 génération. Poses A et B **non repayées** (`_poses-sable/abduction-hanche-elastique-{0,2}.png`).
- Assemblage : `build/faire-gif.sh` → `build/corrections/abduction-hanche-elastique-3poses.gif`.

## Mesures (commandes exécutées)

```
identify pose M : PNG 1376x768
coin SW 18%x14% :
  pose 0  236 214 186  sat 43.3
  pose 1  241 221 190  sat 49.7
  pose 2  230 212 186  sat 41.2
GIF : 5 × 440x246, délais 25 20 50 20 25 cs, 325243 octets (320K)
sol coin GIF : 235 214 185 / 241 220 190 / 230 211 185
saturation A=43.0 B=40.8  → E1 OK
images coalescées : moy 66/64/62/64/66 %  ec 27/26/27/26/27 %  (aucune vide)
```

## Contrôle visuel pose M
- DEBOUT, face caméra, deux mains sur les hanches, jambe droite levée sur le côté.
- Élastique noir aux chevilles. Casquette blanche, visage noir, short noir, baskets blanches.
- Muscles cuisses/hanches jaune-orangé doré (pas vert lime, pas rouge).
- Sol : grandes dalles crème/sablé, pas de petits pavés gris.
- Mer bleue dense, palmiers et plantes, lumière dorée. Un seul fond continu, pas d'artefact.

## Intégration (accord « Ok »)
- `public/media/3d5191762cfcb157.gif` + `release/media/` (325 243 octets)
- media-index 277 → 278 (public = release, 0 manquant)
- `legacy.json` + `index-BLZxzv9Y.js` patchés **en binaire**, delta **0 octet**
- 1 exercice = 1 animation : seule « Abduction hanche à l'élastique »
- `npm test` : 94 passés / 0 échec / 2 skipped
- Ancien `b49969e64dc275f5.gif` conservé. Poulie et assise inchangées.

## Suite
Exercices sans animation : **92** (dont **86** côté elite). Protocole : 1 image fixe → accord → GIF.
