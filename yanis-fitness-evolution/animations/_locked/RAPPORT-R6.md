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
