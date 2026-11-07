# RAPPORT R6 — suite des décors (11 octobre)

## Fait ce tour
| Exercice | État | Sol |
|---|---|---|
| **pompes** | ✅ GIF prêt (`build/corrections/pompes-3poses.gif`) | 219 |
| **pont-fessier-activation** | ✅ GIF prêt (`build/corrections/pont-fessier-activation-3poses.gif`) | 233 |
| **face-pull** | ✅ GIF prêt (`build/corrections/face-pull-a-l-elastique-3poses.gif`) | 214 (A) / 180 (B) |
| abduction hanche | poses A et B faites (sol 228 / 215) — **pose M faite** | à assembler |
| clamshell | poses faites mais **cadrage incohérent** (pose A cadrée différemment, pose B en contre-jour) | **à refaire** |
| fire hydrant | poses A et B faites, A en contre-jour | **à refaire** |
| gainage planche | poses refaites mais **artefacts visuels confirmés** | **à refaire** |

## ⚠️ Piège mesuré ce tour
La mesure du sol doit se faire **au coin bas-gauche (18%x14%)**, et **uniquement sur les poses où le coin est du sol**.
- Sur les poses au sol (clamshell, fire hydrant, gainage) le coin contient le **tapis noir** ou une **ombre** → mesures fausses.
- La mesure « bas 28% + pixels clairs » donne **120 111 101 sur des GIF déjà validés par l'utilisateur** → inutilisable.
→ **Faire confiance au contrôle visuel** : dalles crèmes larges et claires, mer bleue dense, végétation dense, lumière dorée.

## Cause des échecs de ce tour
Le générateur applique parfois le décor **sans éclairer la scène** (contre-jour) et parfois en assemblant
des morceaux de fonds différents (artefacts de rectangles plus clairs).
→ Dans le prompt, insister : **« one single continuous background, BRIGHTLY LIT, no collage, no patchwork,
no lighter rectangles, no visible seams »**.

## Reste à faire (4 exercices, 11 poses)
| Exercice | Poses manquantes |
|---|---|
| clamshell | 3 (cadrage à reprendre) |
| fire hydrant | 3 |
| gainage planche | 3 (sans artefacts) |
| abduction hanche | 1 (pose M générée, à assembler) |

**2 tours de 10 générations suffisent.** Les poses déjà bonnes sont conservées dans `build/corrections/_poses-sable/`.

---

# SUITE — tour du 11/10 (après R6)

## 3 exercices TERMINÉS et prêts (sol sablé, sans artefacts)
| Exercice | Fichier | Sol (coin) |
|---|---|---|
| gainage planche | `gainage-planche-3poses.gif` | 229 |
| clamshell | `clamshell-3poses.gif` | 230 |
| fire hydrant | `fire-hydrant-3poses.gif` | 238 |

Prompt qui a corrigé les artefacts : ajouter **« ONE SINGLE CONTINUOUS BACKGROUND, BRIGHTLY LIT, no collage,
no patchwork, no lighter rectangles, no visible seams »**. Les 9 poses sont propres, contrôlées visuellement.

## RESTE : 1 seule pose — abduction hanche (pose M)
Les poses A et B (session parallèle) sont **bonnes** (sol 236 et 230, athlète **DEBOUT**, mains sur les hanches).
La pose M régénérée est **FAUSSE** : le générateur a produit un athlète **allongé sur le côté** (autre exercice).
→ **NE PAS ASSEMBLER `abduction-hanche-1.png`** : relancer la génération de la pose M avec la source d'origine
`animations/_audit/2026-10-11/gif/themeA/abduction-hanche-elastique-3poses.gif` (pose 1) et **imposer dans le prompt :
« the athlete is STANDING UPRIGHT, front-facing, both hands on the hips, one leg lifted straight out to the side,
do NOT lie him down, do NOT change the exercise or the camera angle »**.

**Le quota de 10 générations d'images par tour a été atteint** — c'est la seule raison pour laquelle
cette dernière pose n'est pas faite. **1 génération suffit au prochain tour**, puis :
```bash
./animations/_locked/build/faire-gif.sh abduction-hanche-0.png abduction-hanche-1.png abduction-hanche-2.png 440x246 abduction-hanche-elastique-3poses.gif
```
Les poses 0 et 2 sont dans `build/corrections/_poses-sable/abduction-hanche-elastique-{0,2}.png`.

## ⚠️ NUANCE DE MESURE (importante)
Sur les exercices **au sol** (clamshell, fire hydrant, gainage, pompes, pont fessier), le coin bas-gauche contient
le **tapis noir** → la mesure du coin donne 170-230 alors que le sol est bon.
Ex. clamshell mesuré 171 au coin, mais visuellement le sol est bien sablé clair, sans artefact.
→ **Sur ces exercices : le contrôle VISUEL fait foi** (dalles crèmes larges et claires, mer bleue dense,
végétation dense, lumière dorée, aucun rectangle plus clair, aucune couture). La mesure au coin n'est fiable
que sur les exercices **debout** (athlète qui n'occupe pas le coin).
