# Dos #01→#05 — kit de production vidéo

**Mise à jour : #01 à #04 intégrés `coached` après dépôt. #05 reste sans vidéo : l'ancienne image est rejetée et une nouvelle photo candidate a été préparée. La vidéo signalée par Yanis relevait le dos ; ne pas la réutiliser.** Le dépôt ultérieur des sources par Yanis vaut accord d'intégration après contrôle ; les réserves réelles seront conservées. Les GIF d'origine restent les replis. Aucun changement de programmation ni d'APK.

## Athlète et revue

[Personnage verrouillé](./reference-personnage-verrouille.jpg) · [Ancienne planche des photos](./vague4-dos-01-05-apercu.jpg) · [Ancienne planche des zooms](./vague4-dos-01-05-zooms.jpg)

**Attention : le #05 dans ces deux planches et sa photo initiale sont rejetés ; ne pas les utiliser comme référence de production.**

Les images sont des références IA fixes, pas une preuve de mouvement, de sécurité ou d'exactitude anatomique dynamique. Contrôler particulièrement le dégagement de l'haltère du banc #02, la continuité de l'attache et du câble #03 et le réglage réel des appuis cuisses #01/#04. Les zooms sont des recadrages des photos, pas des variantes générées.

| #   | Fiche exacte                    | Séries × répétitions | Tempo | Repos | Photo                                                 | Zoom                                       |
| --- | ------------------------------- | -------------------- | ----- | ----: | ----------------------------------------------------- | ------------------------------------------ |
| 01  | `tirage-vertical-prise-neutre`  | 3 × 12-15            | 2011  |  75 s | [Photo](./vague4-dos-01-tirage-vertical-neutre.jpg)   | [Zoom](./vague4-dos-01-zoom-technique.jpg) |
| 02  | `rowing-haltere-un-bras`        | 3 × 12/côté          | 2011  |  60 s | [Photo](./vague4-dos-02-rowing-haltere-un-bras.jpg)   | [Zoom](./vague4-dos-02-zoom-technique.jpg) |
| 03  | `tirage-horizontal-a-la-poulie` | 3 × 12               | 2011  |  75 s | [Photo](./vague4-dos-03-tirage-horizontal-poulie.jpg) | [Zoom](./vague4-dos-03-zoom-technique.jpg) |
| 04  | `tirage-vertical-prise-large`   | 4 × 10-12            | 2011  |  90 s | [Photo](./vague4-dos-04-tirage-vertical-large.jpg)    | [Zoom](./vague4-dos-04-zoom-technique.jpg) |
| 05  | `rowing-barre-buste-penche`     | 3 × 10-12            | 2011  |  90 s | [Nouvelle photo candidate](./vague4-dos-05-rowing-barre-v4.jpg) | [Nouveau zoom](./vague4-dos-05-zoom-technique-v2.jpg)                            |

**Tempo `2011`** : retour excentrique 2 s, aucune pause en position étirée, tirage concentrique 1 s, contraction 1 s. Les prompts commencent en position étirée : tirer 1 s, tenir 1 s, revenir 2 s, sans pause supplémentaire. Une animation montre une répétition, pas une série entière.

## Lecture des GIF existants

- #01 et #04 partagent `/media/f44fc658f6103c5b.gif` à deux images. Il ne distingue pas les prises : #01 exige une **prise neutre paumes face à face**, #04 une **barre large pronation**. Produire deux vidéos distinctes.
- #02 `/media/23beb23cf39592a5.gif`, deux images : la figure semble utiliser deux haltères debout. La fiche impose **un bras**, 12 répétitions par côté, sans rotation du bassin. Une main et le genou opposés en appui sur banc sont la variante retenue pour la photo.
- #03 `/media/b2d6a7d98ed3d560.gif`, deux images : l'image de départ arrondit fortement le dos. La fiche impose buste fixe et tirage vers le nombril ; conserver une colonne neutre et ne pas copier l'enroulement.
- #05 `/media/f00bd9ef43286ee0.gif`, deux images : rowing barre, mais l'angle exact et la continuité ne sont pas démontrés ; la fiche impose buste **à 45°**, sans élan des reins.
- Tous ces GIF restent présents en `public/media/` et `release/media/`, même lorsqu'ils sont imparfaits.

## #01 — Tirage vertical prise neutre

Poitrine ouverte, pieds au sol, cuisses maintenues ; paumes face à face sur deux poignées de la même attache, câble continu à la poulie haute. Coudes vers le bas, poignée vers le haut de poitrine sans incliner ou balancer le buste. Revenir bras allongés sans perdre le contrôle.

**Prompt Arena Video / PixVerse — joindre la photo #01 :**

```text
Animate the EXACT silver chrome athlete and scene in the supplied seated NEUTRAL GRIP lat pulldown image. Camera locked, full body and whole machine in frame, black cap, black shorts, white shoes, red-orange back highlight. Athlete seated upright with chest open, both thighs held under stable pads and both feet flat. START arms extended overhead: both hands securely hold the parallel handles of ONE neutral-grip attachment, palms facing each other; ONE taut cable connects its center to the overhead pulley throughout. Pull the handle toward upper chest in ONE second by driving elbows down, hold the contraction ONE second, then return arms overhead in TWO seconds, no extra pause. Tempo 2011. Keep torso still, wrists neutral, no rocking, no bar behind neck, no added handles, no extra limbs, no text or logo.
```

## #02 — Rowing haltère un bras

Un genou et la main du même côté appuyés sur banc, pied opposé au sol ; un seul haltère dans la main libre. Dos plat, bassin stable ; tirer le coude vers la hanche/le ciel, sans tourner le tronc ; finir la série du côté puis changer.

**Prompt — joindre la photo #02 :**

```text
Animate the exact supplied silver chrome man doing a ONE-ARM dumbbell row, in the same bright gym and fixed side view. Left knee and left palm remain supported on the flat bench, right foot stays firmly on the floor. The RIGHT hand holds exactly ONE dumbbell, hanging vertically clear of the near side of the bench; the other hand remains empty and planted. Neutral flat back, hips and shoulders square to the floor, neck aligned. From the straight-arm start, pull the dumbbell alongside the right waist in ONE second by driving the elbow close to the torso and upward; hold ONE second; lower in TWO seconds until the arm is extended. Tempo 2011. No trunk or pelvis rotation, no momentum, no dumbbell collision with bench or body, no second dumbbell, no camera motion, no text or extra limbs. Show one controlled repetition on the SAME side.
```

## #03 — Tirage horizontal à la poulie

Assis, pieds en appui, genoux souples et colonne neutre ; buste fixe légèrement penché si confortable. Tirer la poignée vers le nombril, puis tendre les bras sans arrondir le dos ni balancer le tronc. Garder le câble raccordé à la poulie basse.

**Prompt — joindre la photo #03 :**

```text
Animate the exact supplied seated cable-row image with the same silver chrome athlete and bright gym, locked side camera and full equipment visible. Feet remain on the footplates, knees softly bent, neutral straight back and torso fixed, upright or very slightly inclined. Both hands hold the two grips of ONE close neutral V handle, palms facing each other, with ONE continuous taut cable connected to the low front pulley. START with arms extended. Pull the handle to the NAVEL in ONE second, elbows traveling back near the torso; hold ONE second; return the handle in TWO seconds until arms extend. Tempo 2011. The cable stays physically attached and clear of the feet and body. Do not round the spine, row by swinging the torso, change handle, cross cables, add limbs or move the camera. No text or watermark.
```

## #04 — Tirage vertical prise large

Barre longue devant la tête, mains en pronation plus larges que les épaules, pouces enroulés ; cuisses sous appuis, poitrine ouverte. Coudes vers le bas et l'arrière, barre vers le haut des pectoraux, jamais derrière la nuque.

**Prompt — joindre la photo #04 :**

```text
Animate the supplied WIDE GRIP lat pulldown still, preserving the exact silver chrome athlete, cap, shorts, shoes, bright gym and fixed front three-quarter camera. Seated stable, feet flat and thighs held by pads. Both hands grip ONE long bar widely in an OVERHAND grip, wider than shoulder width, thumbs wrapped; ONE taut cable stays attached at the center to the overhead pulley. START with arms extended and bar above head IN FRONT of body. Pull bar to upper chest in ONE second, elbows down and back; hold ONE second; return bar upward in TWO seconds to extended arms, tempo 2011. Torso stays stable and chest open, no swinging. Never take bar behind neck, never change to parallel neutral handles, no extra arms, no text or camera movement.
```

## #05 — Rowing barre buste penché : nouvelle photo, vidéo à refaire

**Remarque de Yanis :** la photo précédente comporte un bras tordu et la vidéo obtenue relève le dos. Cette image et cette animation ne sont pas acceptées comme référence finale. Aucune nouvelle vidéo n'est intégrée pour #05 ; le GIF reste disponible. Une nouvelle [photo candidate](./vague4-dos-05-rowing-barre-v4.jpg) et son [zoom](./vague4-dos-05-zoom-technique-v2.jpg) remplacent la référence rejetée pour la préparation. Les deux bras sont distincts ; la photo fixe ne prouve pas la stabilité du dos dans la future animation.

**Posture impérative :** debout, pieds au sol, hanches en arrière, genoux légèrement fléchis, buste et dos neutres à environ **45° au-dessus du sol**. Les deux bras doivent être anatomiquement normaux, reliés aux épaules, coudes naturels et poignets droits, avec les deux mains tenant une seule barre. Pendant la répétition, **bassin, hanches, dos, torse, cou et tête conservent exactement leur angle** : seuls les épaules et les coudes se déplacent pour tirer la barre. Aucun redressement, aucune oscillation, pas de soulevé de terre.

### Prompt pour recréer la photo #05

```text
Create ONE still instructional fitness image using the provided locked character reference: the same muscular silver-chrome athlete, black cap, black shorts, white shoes and bright grey gym, with the back muscles highlighted red-orange. Full body visible from a clear side three-quarter angle. BENT-OVER BARBELL ROW START POSITION: feet planted, knees gently bent, hips pushed back, flat neutral spine and torso held at 45 degrees ABOVE THE FLOOR, neck aligned. Exactly TWO anatomically normal arms, each naturally connected from shoulder to upper arm to elbow to forearm to wrist and hand; no twisted, dislocated, reversed or extra limbs. Both arms hang straight beneath the shoulders, with both hands gripping ONE straight barbell in a comfortable overhand grip. Bar hangs below the knees, with equal plates, clear of the legs. No bench, no text, no watermark. This is a single static starting pose, not an upright deadlift.
```

**Contrôle avant de lancer la vidéo :** vérifier les deux bras et les deux mains, les coudes, la prise sur la même barre, les pieds et le buste à 45°. Si un bras paraît tordu ou le buste trop droit, ne pas utiliser la photo.

### Prompt vidéo corrigé — à joindre uniquement à la nouvelle photo #05 conforme

```text
Animate the EXACT same athlete and camera in the supplied CORRECT bent-over barbell-row start image. The athlete is already hinged forward at 45 DEGREES ABOVE THE FLOOR. LOCK THE ENTIRE TORSO AND HIP ANGLE for EVERY FRAME: hips stay back, pelvis does not rotate, chest and shoulders do not rise, neutral straight back remains at the SAME 45-degree angle, head and neck remain aligned, knees and planted feet remain still. The upper body NEVER stands up, never rocks, never performs a deadlift. Start with both naturally shaped arms hanging beneath the shoulders and both hands holding ONE straight barbell in overhand grip. Pull the bar close to the legs toward the navel in ONE second by bending BOTH elbows and drawing them back; hold ONE second; lower the bar in TWO seconds by extending the elbows. Tempo 2011, one complete repetition. Only the arms and shoulder blades move; no torso extension, no hip extension, no lumbar swing. Preserve anatomically normal upper arms, elbows, forearms, wrists and hands throughout: no twisting, dislocation, backward bending, extra limbs or changing grip. No camera movement, no text, no logo.
```

À réception, vérifier le corps entier pendant toute la vidéo et rejeter un redressement même bref, un bras tordu ou une barre traversant le corps. Le dépôt par Yanis vaut accord d'intégration ; seule une source contrôlée sera ajoutée avec les réserves réelles.

## Références de geste

- [StrengthLog — tirage vertical neutre](https://www.strengthlog.com/lat-pulldown-with-neutral-grip/) : paumes face à face, cuisses maintenues, tirage vers le haut de poitrine.
- [ACE — tirage vertical et tirage assis](https://www.acefitness.org/continuing-education/certified/december-2018/7138/ace-sponsored-research-what-is-the-best-back-exercise/) : prise large, appuis et tirage vers le ventre.
- [StrengthLog — rowing haltère à un bras](https://www.strengthlog.com/strength-training-for-badminton/) : appuis main/genou et haltère vers la taille, un côté à la fois.
- [StrengthLog — rowing barre](https://www.strengthlog.com/best-upper-body-workout/) : variante à 45° ; la programmation de cette application reste prioritaire.

## À réception

Identifier chaque source par le geste et le hash, décoder toutes les images, examiner au moins huit instants et les zooms mains/câbles/appuis. Vérifier les cinq sources distinctes, le tempo, la prise et la stabilité, puis intégrer après dépôt selon le contrôle réel : `coached` avec notice et descriptif vocal pour toute réserve ; `validated` seulement si réellement vérifié. Conserver GIF, sources et lots antérieurs. Les fiches #01 à #04 sont intégrées ; #05 reste sans vidéo jusqu'à réception d'une source corrigée.
