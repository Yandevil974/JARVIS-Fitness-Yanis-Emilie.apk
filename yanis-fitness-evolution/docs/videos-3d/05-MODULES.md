# Plan module par module — vidéos 3D (19/10/2026)

## Rappel honnête : qui fait quoi ?

- **Les vidéos MP4 sont générées UNIQUEMENT sur Arena Video**
  (https://arena.ai/video) par Yanis : 2 générations gratuites/jour,
  5-8 s par vidéo. L'atelier de code ne peut pas les générer.
- **L'atelier prépare chaque kit** : images de référence (personnage +
  casquette) + mini-prompt à copier + intégration du MP4 dès réception.
- **Travail de Yanis par vidéo** : ~5 min (photo + texte + Entrée +
  téléchargement + envoi ici).

## Carte complète des modules (liste Yanis + oubliés complétés)

| # | Module | Vidéo 3D ? | Nb vidéos | Notes |
|---|--------|-----------|-----------|-------|
| 1 | Musculation | ✅ | 203, par vagues de ~10 | Triceps prêt (priorité). Vague 1 : bras+pectoraux |
| 2 | Échauffement | ✅ | 4 | Kit PRÊT (voir ci-dessous). Joué à chaque séance ! |
| 3 | Piscine + Aqua HIIT/Tabata | ✅ | ~12 | Nage douce, statique, marche aqua, fractionné, sprint, aqua-jogging, genoux, battements, dépl. latéraux, talons-fesses, ciseaux, pompes au bord |
| 4 | Elliptique | ✅ | 2-3 | Pédalage (sert aussi au fractionné) + récup active |
| 5 | Étirements | ✅ | ~8 familles | Porte, mur, enfant, torsion, pigeon, quad debout, ischios, mollet, cobra… (29 au total, regroupés) |
| 6 | Récup active / retour au calme | ♻️ réutilise | 0-1 | Réutilise elliptique + nage douce |
| 7 | Fractionnée (nage) | ✅ | 1 | Incluse dans le kit piscine (n° 3) |
| 8 | Tabata | ♻️ = Aqua Tabata | 0 | Dans l'app, Tabata = Aqua Tabata (piscine, n° 3) |
| 9 | METCON elliptique+piscine | ♻️ réutilise | 0 | Réutilise n° 3 + n° 4 |
| 10 | Approches / Tests 1RM | ♻️ réutilise | 0 | Réutilise la vidéo de l'exercice de muscu |
| 11 | Chronomètre | ❌ inutile | 0 | C'est l'outil qui time tout, pas un exercice |
| 12 | Pauses / repos | ❌ inutile | 0 | Visuel respiration actuel suffisant |
| 13 | Transitions | ❌ inutile | 0 | Texte suffit (« bois, sèche-toi, rejoins le bassin ») |
| 14 | Respiration diaphragmatique | ❌ inutile | 0 | Guide respiratoire actuel suffisant |

**Total à générer : ~230 vidéos → à 2/jour ≈ 4 mois.** D'où l'ordre :
d'abord ce qui passe à CHAQUE séance (échauffement), puis la muscu par
vagues, puis piscine, elliptique, étirements.

## Ordre proposé

1. **Triceps** (kit déjà livré : image présentée + prompt envoyé).
2. **Échauffement** (kit ci-dessous, 4 vidéos = 2 jours de génération).
3. **Muscu vague 1** : bras + pectoraux (~10 vidéos).
4. **Piscine** (~12 vidéos).
5. **Elliptique** (2-3 vidéos).
6. **Étirements** (~8 vidéos).
7. **Muscu vagues suivantes** par groupe musculaire.

## KIT ÉCHAUFFEMENT — prêt ✅ (19/10/2026)

Générer sur https://arena.ai/video : joindre la photo, coller le texte.

### E1 — Mise en route (marche tapis) ✅ VALIDÉE + INTÉGRÉE le 20/10/2026
Photo : `warmup-mise-en-route.jpg` — MP4 : `public/videos/warmup-mise-en-route.mp4`
(4 s, 1024×768, 930 Ko, audio retiré). Contrôle : marche conforme, anatomie
OK, filigrane PixVerse bref en début (acceptable, remplaçable plus tard).
Affichée dans l'échauffement + le minuteur guidé (`step-videos.js`).
```text
Animate this chrome character with black cap walking briskly on a treadmill: steady natural stride, arms swinging, upright posture. Legs glowing warm orange. Side view, static camera, bright gym, realistic tempo, smooth loop, no deformed feet.
```

### E2 — Mobilité des épaules (cercles de bras)
Photo : `warmup-mobilite-epaules.jpg`
```text
Animate this chrome character with black cap doing slow shoulder arm circles: both arms extended, rotating in smooth controlled circles, chest open. Shoulders glowing orange. Front view, static camera, bright gym, smooth loop, no deformed hands.
```

### E3 — Mobilité hanches (squat profond tenu)
Photo : `warmup-mobilite-hanches.jpg`
```text
Animate this chrome character with black cap holding a deep squat stretch: gentle mobility bounce, knees tracking over toes, chest up, heels down. Hips and quads glowing orange. Static camera, bright gym, smooth loop, realistic tempo.
```

### E4 — Activation fessiers (pont fessier)
Photo : `warmup-pont-fessier.jpg`
```text
Animate this chrome character with black cap doing slow glute bridges: hips lifting high then lowering with control, shoulders staying on the mat. Glutes glowing red. Side view, static camera, bright gym, smooth loop, no deformed limbs.
```

## Intégration prévue (dès réception des MP4)

- Muscu : déjà codé (`exercise-videos.js` + `Movement.jsx`).
- Échauffement/piscine/cardio/étirements : les étapes utilisent `img` +
  visuels de guides ; à la réception du 1er MP4 d'un module, ajouter la
  table de correspondance étape→vidéo (même pattern, ~20 lignes) + repli
  actuel conservé. Ne pas coder avant d'avoir un MP4 validé.
