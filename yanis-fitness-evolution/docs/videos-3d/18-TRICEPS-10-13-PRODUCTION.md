# Triceps #10 à #13 — photos, zooms et prompts vidéo

Date de préparation : 25/10/2026

Ce lot contient les quatre références de génération suivantes : **développé
couché prise serrée**, **extensions avec deux haltères sur banc incliné à 30°
avec barre d'appui des coudes**, **pushdown unilatéral à la poulie haute avec
poignée D** et **California press du catalogue avec barre droite vers le cou**.

**Révisions #11 demandées par Yanis :** la photo et le prompt reprennent le
même type de barre fixe matelassée d'appui des coudes que le #03. Ils reprennent
aussi **l'orientation latérale du #03**, tête à gauche et pieds à droite, car la
vue précédente laissait le logiciel transformer le geste en développé couché.
Le banc à 30°, les deux haltères et la prise neutre restent obligatoires.

Les quatre photos, leurs zooms et les prompts sont prêts pour inspection.

> **État après dépôt de Yanis :** les MP4 #10, #12 et #13 ont été déposés dans
> le commit `72a205d` puis intégrés en `coached` avec leurs réserves ; voir
> [`19-TRICEPS-10-13-CONTROLE-MP4.md`](./19-TRICEPS-10-13-CONTROLE-MP4.md).
> **#11 n'a pas encore de MP4** : sa future génération doit utiliser la photo
> révisée avec appui des coudes et orientation latérale du #03, pour éviter un
> développé couché. Les prompts ci-dessous restent les références de production.

Les vidéos triceps #01→#09, tous les GIF d'origine, le catalogue et la version
applicative **1.12.0/195** restent inchangés. La préparation et l'intégration
de ce lot ne produisent aucun APK.

## Correspondances exactes du catalogue

| # | Exercice et identifiant | Programmation réelle | GIF d'origine conservé | Référence retenue |
|---|---|---|---|---|
| #10 | Développé couché prise serrée — `developpe-couche-prise-serree` | 3 × 8-10 · `3010` · repos 60 s | `/media/5e38d08443e26319.gif` | Banc plat, barre droite, prise pronée à largeur d'épaules ou légèrement plus serrée, coudes près du buste et barre vers le bas de la poitrine. |
| #11 | Extensions triceps haltères incliné — `extensions-triceps-halteres-incline` | 3 × 8-10 · `3010` · repos 60 s · banc à 30° | `/media/2ec2c2c1b7eb18a5.gif` | **Orientation latérale du #03**, deux haltères au-dessus de la ligne tête–épaules, prise neutre et descente à côté de la tête. Ajouter **une barre fixe matelassée d'appui des coudes reliée au banc**. Ne pas transformer en développé incliné. |
| #12 | Pushdown triceps câble — `pushdown-triceps-cable` | 3 × 8-10 · `3010` · repos 120 s | `/media/028724a3c679a470.gif` | Le GIF montre **une seule main et une poignée D**, et non une barre à deux mains : retenir un pushdown unilatéral avec le coude fixe contre les côtes. |
| #13 | California press barre au cou — `california-press-barre-au-cou` | 4 × 12-15 · `3010` · repos 60 s · **« Ne pas trop charger ! »** | `/media/843d0c24da25ffee.gif` | Banc plat, barre droite en prise pronée rapprochée, coudes fléchis et barre vers le cou avec un espace sans contact. Ne pas substituer une variante au front puis à la poitrine. |

Le #12 ne doit pas reprendre la barre droite bilatérale du #07. Le #13 ne doit
pas devenir un second développé couché prise serrée #10 : leurs positions
basses et leurs trajectoires sont volontairement différentes.

## Photos et zooms retenus

L'athlète reste celui de
[`reference-personnage-verrouille.jpg`](./reference-personnage-verrouille.jpg) :
homme massif chrome argenté, casquette noire mate, short noir, chaussures
blanches, salle claire et triceps actifs rouge/orange.

- [Planche des quatre photos](./vague2-triceps-10-13-apercu.jpg)
- [Planche des quatre zooms](./vague2-triceps-10-13-zooms.jpg)

| # | Position de la photo | Photo seule | Zoom de contrôle |
|---|---|---|---|
| #10 | **Basse**, barre droite juste au-dessus du bas de la poitrine, coudes rentrés | [Photo #10](./vague2-triceps-10-developpe-serre.jpg) | [Zoom prise et trajectoire #10](./vague2-triceps-10-zoom-prise.jpg) |
| #11 | **Haute, orientation latérale du #03**, banc à 30°, deux haltères en prise neutre et **barre matelassée d'appui derrière/sous les coudes** | [Photo #11](./vague2-triceps-11-extensions-incline.jpg) | [Zoom orientation, prises et appui #11](./vague2-triceps-11-zoom-30-neutre.jpg) |
| #12 | **Basse**, main droite sur une poignée D près de la cuisse, coude droit contre le buste | [Photo #12](./vague2-triceps-12-pushdown-poignee.jpg) | [Zoom poignée et coude #12](./vague2-triceps-12-zoom-poignee.jpg) |
| #13 | **Basse**, de profil, coudes fléchis et barre droite au niveau du cou sans contact | [Photo #13](./vague2-triceps-13-california-cou.jpg) | [Zoom espace barre/cou #13](./vague2-triceps-13-zoom-cou.jpg) |

Pour #11, la photo révisée reprend le
[`montage d'appui du #03`](./vague2-triceps-03-appui-coudes.jpg) : une seule
barre droite matelassée, fixée au châssis du banc par deux supports métalliques,
placée immédiatement derrière et légèrement sous les deux coudes. Elle n'est
pas tenue, ne porte aucun disque et ne touche ni les mains ni les avant-bras.
La caméra reprend également le profil latéral du #03 ; dans cette vue, les deux
haltères se chevauchent partiellement, mais le prompt impose toujours un
haltère par main et des poignées parallèles au grand axe tête–pieds du banc.

Pour #13, les premières candidates bras tendus n'ont pas été retenues : elles
ne montraient pas la particularité « barre au cou ». La photo finale reprend le
profil du GIF, avec les coudes fléchis. La barre est fortement raccourcie par la
perspective ; le zoom permet de contrôler son extrémité droite et l'espace avec
le cou. La future vidéo devra conserver cet espace et une charge légère.

Ces images sont des références de génération, pas une preuve que les futurs
MP4 seront exacts. Chaque vidéo devra être inspectée à plusieurs instants.

---

## #10 — Développé couché prise serrée — PRÊT

### Exécution précise attendue

Allongé sur banc plat, tête, omoplates et hanches appuyées, pieds au sol. Tenir
une barre droite en pronation, mains à largeur d'épaules ou légèrement plus
rapprochées, sans coller les mains. Les poignets restent empilés au-dessus des
avant-bras.

1. La photo commence en position basse, barre juste au-dessus du bas du
   sternum, sans rebond contre la poitrine.
2. **Pousser en 1 s** en dépliant les coudes jusqu'au-dessus de la poitrine,
   sans décoller les hanches ni rouler les épaules vers l'avant.
3. **Descendre en 3 s** vers le bas de la poitrine, coudes à environ 30-45° du
   buste, puis revenir exactement à la photo. Aucun déplacement vers le cou,
   le front ou derrière la tête.

### Prompt Arena Video / PixVerse — à copier avec la photo #10

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied image, preserving his matte black baseball cap, black shorts, white sneakers, bright grey gym and stable red-orange triceps glow. START at the exact CONTROLLED BOTTOM position in the image: lying face-up on a FLAT BENCH, ONE rigid STRAIGHT BARBELL held in TWO close pronated hands approximately shoulder-width apart, wrists stacked, elbows bent and tucked about 30-45 degrees from the ribs, bar horizontal just above the LOWER CHEST with no bounce or body contact. PHASE 1 (1 second): press the bar upward by extending the elbows until the arms are nearly straight above the chest; keep the feet, head, shoulder blades and hips supported and do not roll the shoulders forward. PHASE 2 (3 seconds): lower the SAME bar slowly along the SAME path back toward the lower sternum, keeping the elbows close to the torso and the wrists straight, then finish exactly at the supplied bottom image. Show one continuous 1-second-up / 3-second-down cycle, about 4 seconds, implementing tempo 3010 with no added pause. This is a CLOSE-GRIP BENCH PRESS only: never move the bar toward the neck, throat, chin, forehead or behind the head, never turn it into a California press, skullcrusher or pullover. Keep the straight bar, both grips and the camera fixed; no EZ bar, no dumbbells, no excessively narrow touching hands, no flared elbows, no hip bridge, no extra limbs or fingers, no camera movement, no text, no logo, no watermark.
```

---

## #11 — Extensions avec deux haltères sur banc à 30° et appui des coudes — PRÊT

### Exécution précise attendue

Le dossier forme un angle bas d'environ **30° avec le sol**. Le dos, les
omoplates et la tête restent appuyés ; les pieds restent au sol. Tenir deux
haltères séparés, un dans chaque main, en prise neutre paumes face à face.

L'orientation reprend celle du #03 : **vue latérale, tête à gauche et pieds à
droite**, sans tourner le buste vers la caméra. Les haltères restent au-dessus
de la ligne tête–épaules, jamais au-dessus du bas de la poitrine. Chaque
poignée est parallèle au grand axe tête–pieds du banc, avec un disque vers la
tête et l'autre vers les pieds, pour éviter une lecture en développé couché.

À la demande de Yanis, la photo reprend le montage du #03 : **une seule barre
droite matelassée d'appui des coudes**, fixée au châssis du banc par deux
supports métalliques. Elle est placée immédiatement derrière et légèrement
sous les deux coudes. L'arrière des hauts des bras, près des coudes, reste
légèrement appuyé contre elle. Cette barre n'est pas une charge : elle ne
porte aucun disque, n'est jamais tenue et ne touche ni les mains ni les
avant-bras.

1. La photo commence bras presque tendus au-dessus des épaules, haltères
   séparés, poignets droits et appui des coudes lisible.
2. **Descendre en 3 s** en pliant seulement les coudes. Les haltères se
   dirigent à côté de la tête et légèrement derrière, vers les épaules, sans
   contact avec la tête, le dossier ou la barre d'appui.
3. Les hauts des bras gardent leur angle et leur appui stable, sans descendre
   vers la poitrine, sans s'ouvrir latéralement et sans soulever les coudes de
   la barre pour créer un élan.
4. **Remonter en 1 s** en dépliant seulement les coudes jusqu'à la photo. La
   barre et ses deux fixations restent immobiles. Ne pas effectuer de
   développé incliné et ne pas réunir les deux haltères.

### Prompt Arena Video / PixVerse — à copier avec la photo #11

Le texte ci-dessous décrit le geste positivement et place le verrouillage des
épaules et des hauts des bras avant tous les détails. L'expression
« développé couché » est volontairement absente du prompt à copier : la répéter,
même dans une négation, peut renforcer la mauvaise association du générateur.

```text
Create ONE continuous 4-second animation of a LYING TWO-DUMBBELL TRICEPS EXTENSION, using the supplied image as the exact START and END pose. Preserve the same massive silver-chrome athlete, matte black cap, black shorts, white sneakers, bright grey gym and red-orange triceps.

LOCKED SETUP: fixed near-90-degree LATERAL SIDE VIEW, head toward the LEFT and feet toward the RIGHT; bench backrest at 30 DEGREES; head, back and hips fully supported. Exactly TWO independent matching dumbbells, ONE in EACH hand, with a TRUE NEUTRAL GRIP, palms facing each other and handles parallel to the long head-to-foot axis of the bench. Keep the single padded elbow support and its two metal attachments fixed to the bench, immediately BEHIND AND SLIGHTLY BELOW BOTH ELBOWS.

MOTION PRIORITY: THE ELBOWS ARE THE ONLY MOVING JOINTS. Both shoulder joints, both upper arms, the torso and the chest remain completely stationary. START with the arms nearly extended and both dumbbells above the HEAD / SHOULDER LINE. From 0 to 3 seconds, slowly bend the elbows and rotate ONLY THE FOREARMS so the dumbbells travel backward BESIDE THE EARS and slightly behind the head toward the shoulders, with a safe gap. Both dumbbells remain in the head / shoulder zone throughout. From 3 to 4 seconds, straighten only the elbows and retrace exactly the same arc back to the supplied image. Both elbow contact points remain lightly supported by the stationary padded bar.

Show ONE continuous 3-second lowering and 1-second return, tempo 3010, without a pause. Fixed camera, fixed 30-degree bench, fixed shoulders and upper arms, two separate neutral-grip dumbbells and fixed padded support from the first to the last frame; no camera movement, no extra limbs or fingers, no text, no logo, no watermark.
```

---

## #12 — Pushdown unilatéral à la poulie haute avec poignée D — PRÊT

### Exécution précise attendue

Debout face à la poulie haute, buste stable avec une très légère inclinaison,
pieds à largeur de hanches. La main droite tient **une seule poignée D** ; la
main gauche reste sur la hanche ou sur le cadre fixe et ne touche jamais le
câble.

1. La photo commence en bas, coude droit presque déplié contre les côtes et
   poignée près de la cuisse droite.
2. **Remonter en 3 s** en laissant le câble plier seulement le coude jusqu'à
   environ 90°, avant-bras proche de l'horizontale. Le haut du bras ne suit
   pas la poignée et l'épaule ne recule pas.
3. **Pousser en 1 s** en dépliant seulement le coude jusqu'à la photo, sans
   balancer le buste ni casser le poignet.
4. La démonstration reste côté droit ; le changement de côté se fait après la
   série, pas au milieu du cycle. Le repos réel du programme est de 120 s.

### Prompt Arena Video / PixVerse — à copier avec la photo #12

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied image, preserving his matte black baseball cap, black shorts, white sneakers, bright grey gym and stable red-orange glow on the RIGHT triceps. START at the exact BOTTOM position in the image: standing facing a HIGH CABLE PULLEY, the RIGHT hand holding ONE SINGLE D-HANDLE beside the right thigh, right arm nearly extended, right upper arm vertical and pinned against the ribs, wrist straight, torso tall with only a slight forward lean. The LEFT hand stays on the left hip and never touches the working handle or cable. Exactly one cable connects the high pulley to the single D-handle. PHASE 1 (3 seconds): allow the handle to rise slowly by bending ONLY the right elbow to about 90 degrees, until the right forearm is approximately horizontal; keep the right upper arm, elbow position, shoulder, torso and feet stationary. PHASE 2 (1 second): push the same D-handle down beside the right thigh by extending ONLY the right elbow, returning exactly to the supplied bottom image. Show one continuous 3-second-up / 1-second-down cycle, about 4 seconds, implementing tempo 3010 with no added pause and no arm switch. This is a SINGLE-ARM PUSHDOWN: never create a two-hand straight bar, wide bar, EZ bar, rope, second handle, second working arm or lower cable. No rowing motion, no shoulder pull, no elbow drifting forward, no torso rocking, no wrist bending, no extra limbs or fingers, no camera movement, no text, no logo, no watermark.
```

---

## #13 — California press du catalogue, barre droite au cou — PRÊT

### Exécution précise attendue

Cette consigne suit **l'intitulé et le GIF du catalogue**, et non les autres
variantes du California press qui passent par le front puis la poitrine.
Allongé sur banc plat, tête et hanches appuyées, pieds au sol. Utiliser une
barre droite légère en prise pronée rapprochée, pouces enroulés et poignets
alignés.

1. La photo commence en position basse : coudes fléchis, barre juste au-dessus
   et légèrement devant la base du cou, avec un espace visible. Il n'y a aucun
   contact avec le cou, le menton, le visage ou la poitrine.
2. **Pousser en 1 s** dans le même alignement jusqu'à placer la barre au-dessus
   de la ligne haute de la poitrine/du cou, bras presque tendus, sans écarter
   les coudes ni cambrer le dos.
3. **Redescendre en 3 s** vers la base du cou en associant la flexion des
   coudes à un léger ajustement contrôlé des hauts des bras. Garder les coudes
   relativement proches et dirigés vers l'avant.
4. Terminer à la photo sans contact et sans rebond. **Ne pas trop charger** :
   ne pas ajouter de disques, ne pas transformer la démonstration en test de
   force et ne pas chercher une amplitude douloureuse.

### Prompt Arena Video / PixVerse — à copier avec la photo #13

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied SIDE-VIEW image, preserving his matte black baseball cap, black shorts, white sneakers, bright gym and stable red-orange triceps glow. START at the exact LOWERED position in the image: lying face-up on a FLAT BENCH, BOTH ELBOWS DEEPLY BENT, ONE LIGHT RIGID STRAIGHT BARBELL held in TWO close pronated hands slightly narrower than shoulder width, thumbs wrapped and wrists straight. The bar hovers just above and slightly in front of the BASE OF THE NECK with a CLEAR AIR GAP; it never touches the neck, chin, face or chest. PHASE 1 (1 second): press the same light bar upward along the same neck-line path until the arms are nearly extended above the upper-chest / neck line, keeping the elbows relatively close, the head supported, the ribs controlled and the hips on the bench. PHASE 2 (3 seconds): lower the bar slowly back toward the base of the neck by bending the elbows with a small controlled adjustment of the upper arms; keep the elbows directed forward and finish exactly at the supplied lowered image with the same visible safety gap. Show one continuous 1-second-up / 3-second-down cycle, about 4 seconds, implementing tempo 3010 without a pause. Follow ONLY this catalogue's 'BARBELL TO THE NECK' variant: do NOT redirect the bar to the forehead, behind the head or lower chest, do NOT add a forehead-then-chest sequence, do NOT turn it into the close-grip bench press of exercise 10, a skullcrusher, a pullover or a JM press with body contact. USE A LIGHT LOAD and never add plates or show a maximal effort. Preserve the straight bar and both grips; no EZ bar, no dumbbells, no flared elbows, no bouncing, no neck or face contact, no extra limbs or fingers, no camera movement, no text, no logo, no watermark.
```

## Contrôle obligatoire à réception des MP4

- **#10** : barre droite, prise serrée mais mains non jointes, coudes rentrés,
  descente en 3 s vers le bas de la poitrine et remontée en 1 s ; aucune
  trajectoire vers le cou ou le front.
- **#11** : orientation latérale du #03 et banc bas à 30° conservés ; deux
  haltères indépendants, prise neutre et poignées parallèles au grand axe du
  banc dans toutes les frames ; barre matelassée et deux fixations visibles et
  immobiles, appuis des coudes stables, descente en 3 s à côté de la tête sans
  heurter le support et aucune transformation en développé incliné.
- **#12** : une seule poignée D, un seul bras actif et un câble venant d'en
  haut ; coude fixe contre les côtes, retour contrôlé en 3 s, extension en 1 s,
  aucun changement de bras dans le cycle.
- **#13** : barre droite légère, coudes fléchis en bas, trajectoire vers le cou
  uniquement et espace sans contact visible ; rejeter tout contact avec le cou
  ou le visage, toute charge ajoutée et toute variante front/poitrine.
- Vérifier la durée, la résolution, la cadence, la lecture intégrale et la
  boucle de chaque MP4, puis comparer plusieurs frames au GIF et à la photo.

Le dépôt d'une vidéo par Yanis sur la branche vaut accord d'exploitation, sans
nouvelle demande de confirmation. Le statut technique reste néanmoins soumis
au contrôle : une source imparfaite peut être intégrée en `coached` avec des
réserves, mais ne doit pas être déclarée `validated` sans conformité réelle.

## Références techniques consultées

- [#10 — Close-Grip Bench Press, Gravitus](https://gravitus.com/guides/exercises/close-grip-bench-press/) :
  prise rapprochée sans mains jointes, coudes près du buste et trajectoire vers
  le bas de la poitrine.
- [#11 — Incline Dumbbell Tricep Extension, Muscle & Strength](https://www.muscleandstrength.com/exercises/incline-two-arm-dumbbell-extension.html) :
  banc à faible inclinaison, deux haltères, prise neutre et descente vers les
  épaules par flexion des coudes. La barre d'appui et l'orientation latérale
  sont des adaptations personnalisées demandées par Yanis, reprises du #03
  pour empêcher la génération d'un développé couché.
- [#12 — Single Arm Cable Tricep Extension, Gravitus](https://gravitus.com/guides/exercises/single-arm-cable-tricep-extension/) :
  poignée D à poulie haute, coude fixé contre le corps et extension unilatérale.
- [#13 — California triceps press, AAFS](https://www.aafs.net/blog/california-press-the-best-exercise-for-triceps/) :
  prise rapprochée et coudes contrôlés. La cible précise au cou et la barre
  droite sont ici verrouillées par l'intitulé et le GIF du catalogue, pas par
  une variante générique au front puis à la poitrine.

## Vérifications de cette préparation

- Les quatre identifiants, GIF, séries, répétitions, tempos, repos et notes ont
  été relus depuis `EXERCISE_MAP` avec Node et correspondent au tableau.
- Les **13 liens locaux** du document ont été résolus, sans fichier manquant.
- Les quatre photos, quatre zooms et deux planches sont des JPEG lisibles ;
  les planches, les détails de prise, l'appui des coudes et la nouvelle
  orientation latérale du #11 ont été inspectés visuellement.
- Le contrôle whitespace du nouveau Markdown ne signale aucune erreur.
- La préparation initiale était limitée à ce document et à ces images. Les
  changements applicables après dépôt des MP4, les builds et les tests sont
  consignés séparément dans le document 19. Aucun APK n'est produit.
