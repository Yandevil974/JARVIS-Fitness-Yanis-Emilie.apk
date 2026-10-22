# RAPPORT R7 — 13 octobre 2026 — FIN DES CORRECTIONS

## 0. REPRISE (à lire en premier)

Le dépôt ne contenait **pas** le dossier `animations/` : la branche de la session précédente
(`arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`) existait bien sur GitHub mais **n'était pas
dans le clone** (refspec de fetch limité à `main` + la branche courante).
→ Récupérée par `git fetch origin refs/heads/arena/7a4a778b-...` puis **fast-forward** sur la
branche de cette session (`arena/b4c56c3f-...`). **Aucune force-push, aucune autre branche créée.**
Tout le travail du 11 octobre est donc intact et désormais aussi sur cette branche.

---

## 1. LA DERNIÈRE POSE — ABDUCTION HANCHE — FAITE

`build/corrections/abduction-hanche-elastique-3poses.gif`

| Contrôle | Mesure | Cible | Verdict |
|---|---|---|---|
| Images | 5 (440×246) | 5 | ✅ |
| Délais | 25 / 20 / 50 / 20 / 25 cs | identique | ✅ |
| Poids | **328 Ko** | < 600 Ko | ✅ |
| Sol (coin bas-gauche) | **229 → 235** en rouge | 225-240 | ✅ |
| Saturation | 40,1 → 42,3 | ≥ 22 (E1) | ✅ |
| Mer bleue | 2,74 % → 5,11 % | 1,86-21,14 mesurés sur les 19 GIF déjà validés | ✅ |
| Vert lime | **0,00 %** | 0 | ✅ |
| Muscles dorés | présents | — | ✅ |

Assemblage : `./faire-gif.sh abduction-hanche-elastique-{0,1,2}.png 440x246 …gif`

### Les 2 candidats générés pour la pose M, et pourquoi CAND2

| | CAND1 ❌ rejeté | CAND2 ✅ retenu |
|---|---|---|
| Sol (coin) | 218 196 167 | **230 210 183** |
| Mer | 1,77 % | **4,71 %** |
| Profil des noirs mats (étalement / centre) | 0,463 / 37,2 | **0,774 / 47,0** |
| Corrélation structurelle vs les poses DEBOUT | 0,036 | **0,343** |
| Corrélation structurelle vs les poses AU SOL | −0,006 | 0,014 |

Repères de calibration (à retenir) :
- poses DEBOUT entre elles : 0,269 de corrélation moyenne · poses AU SOL entre elles : 0,026 ·
  DEBOUT vs AU SOL : 0,006 → **la métrique sépare bien les deux familles**.
- « même pose, décor différent » (seul changement de décor) = **0,746 à 0,774**.
- CAND2 ↔ pose M source = **0,760** → CAND2 reproduit la pose d'origine **exactement au niveau
  des deux autres poses** (A↔srcA = 0,746 · B↔srcB = 0,774). CAND1, lui, ne corrèle avec rien.

**Ce que l'outil ne peut PAS faire : il ne juge pas la posture à l'œil.** Les chiffres disent
« même exercice, même cadrage, même échelle que les poses A et B, même fidélité à la source ».
Le contrôle visuel final (jambe bien tendue sur le côté, mains sur les hanches) appartient à
l'utilisateur, sur la planche présentée.

### Posture — références fittness consultées AVANT de générer (exigence du verrou, règle 4)

| Source | Ce qui est retenu pour la pose |
|---|---|
| [PureGym — Standing Hip Abduction](https://www.puregym.com/exercises/legs/inner-outer-thigh/standing-hip-abduction/) | bande **au-dessus des chevilles**, pieds écartés largeur de hanches, « putting your hands on your hips can help you isolate », **torse droit, ne pas se pencher** |
| [MOTRA — Resistance Band Standing Hip Abduction](https://www.motra.com/exercises/resistanceBandStandingHipAbduction) | « keep torso upright and hips level », **genou tendu**, pause en haut, pas d'élan |
| [FitWill — Resistance Band Standing Balance Hip Abduction](https://fitwill.app/exercise/6736/resistance-band-standing-balance-hip-abduction/) | « place your hands on your hips », pied d'appui raciné, **jambe levée sur le côté sans incliner le torse** |
| [Fitbod — Standing Hip Abduction](https://fitbod.me/exercises/standing-hip-abduction) | debout, **mains sur les hanches**, jambe tendue levée latéralement, retour contrôlé |

→ Le prompt imposait : debout, de face, torse vertical, hanches de niveau, **les deux mains sur les
hanches**, appui sur une jambe, l'autre tendue sur le côté contre l'élastique, « do NOT lie him
down, do NOT change the exercise or the camera angle ».

---

## 2. VÉRIFICATION DEMANDÉE : les 17 GIF en attente, mesurés

Outil : `build/verifier-pose.py` (écrit ce tour, réutilisable).
**Toutes les images de chaque GIF** ont été mesurées (5 par GIF = 90 mesures), après `-coalesce`.

Seuil de mer = **1,86 %**, soit le minimum mesuré sur les 19 GIF/poses **déjà validés** par
l'utilisateur (médiane 8,7 %). Pas un chiffre inventé.

### 🔴 4 GIF encore PÂLES — saturation < 22 → hors cible E1

| GIF | Saturation min | Mer | Sol |
|---|---|---|---|
| `pallof-press-a-l-elastique-3poses.gif` | **14,3** | 3,62 % | 177-213 |
| `abduction-assise-machine-ou-elastique-3poses.gif` | **14,5** | 7,30 % | 203-240 |
| `squat-cycliste-squat-complet-3poses.gif` | **14,8** | 8,07 % | 202-233 |
| `squat-poids-du-corps-3poses.gif` | **15,2** | 7,80 % | 203-236 |

### 🟠 3 GIF dont le coin de sol reste GRIS (< 215 en rouge)

| GIF | Sol (min-max) |
|---|---|
| `bulgarian-split-squat-3poses-CORRIGE.gif` | **195-198** |
| `face-pull-a-l-elastique-3poses.gif` | **196-196** |
| `pallof-press-a-l-elastique-3poses.gif` | **177-213** |

⚠️ Réserve honnête : sur `face-pull` le coin bas-gauche est constant (196 sur les 5 images) →
il contient probablement un objet (poteau, bande) et non le sol. **Le contrôle visuel fait foi.**
Idem pour `bulgarian-…-CORRIGE` (195-198 sur les 5 images).

### ✅ 11 GIF sans alerte mesurée

clamshell · pompes · pont-fessier · gainage-planche · fire-hydrant · back-squat-charge-moderee ·
presse-a-cuisses-pieds-hauts · step-up · leg-press · goblet-squat · bulgarian-split-squat
(et bulgarian-split-squat-halteres, dont une image a un coin à 93 = objet sombre, pas le sol).

**Aucun des 17 n'est touché.** Rien n'a été régénéré : la règle « ne jamais régénérer un GIF
conforme » et « rien sans accord explicite » s'applique. Ces 4 + 3 sont **proposés** à l'arbitrage
de l'utilisateur, pas repris.

---

## 3. PIÈGE DE MESURE DÉCOUVERT CE TOUR (à ne pas répéter)

La première version de l'outil mesurait la mer **uniquement dans les 45 % du haut** de l'image.
Résultat : 7 GIF annoncés « sans mer » (0,14 % à 0,92 %).
En mesurant **sur l'image entière**, tous passent (2,71 % à 14,52 %).
→ **La bande « haut 45 % » n'est pas la mer : c'est le ciel.** Ne jamais conclure « pas de mer »
avec une mesure de bande. Mesure corrigée : `mer%` = image entière, `merH%` = bande haute
(conservée à titre d'indice uniquement).

---

## 4. ÉTAT — FIN DE MISSION ATTEINTE (conditions du §7 de la passation)

La dernière pose est **faite, mesurée et présentée**. Les corrections sont terminées.
Le reste (les ~91 exercices sans animation côté élite) n'entre PAS dans cette mission et
n'a pas été commencé : il attend le feu vert.
