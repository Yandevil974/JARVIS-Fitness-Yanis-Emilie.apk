# Pectoraux #14→#18 — contrôle et intégration des MP4

**Date : 29/10/2026 · Sources déposées par Yanis dans `7a946d8936a5df00d0ccf4e518f85ccc3355228e`**

## Verdict

| N° | Exercice | Source retenue | État |
|---|---|---|---|
| #14 | Dips | `1793271389650.mp4` | **Intégré `coached`** — buste penché et tempo `4010` prioritaires |
| #15 | Développé haltères incliné, pronation | `1793271577730.mp4`, **source commune avec #17** | **Intégré `coached`** — banc à environ **30°**, pronation et tempo prioritaires |
| #16 | Écartés câbles incliné | `1793271763315.mp4` | **Intégré `coached`** — poignées arrêtées au-dessus du haut des pectoraux, coudes fixes et tempo prioritaires |
| #17 | Développé haltères incliné 45° | `1793271577730.mp4`, **même source que #15** | **Intégré `coached`** — banc à **45°** imposé par le poster et la voix, malgré l’angle plus faible visible |
| #18 | Développé haltères incliné | `1793271872816.mp4` | **Intégré `coached`** — une seconde de poussée, trois secondes de descente et back-off dictés |

Le dépôt des sources vaut accord d’intégration. Yanis a également demandé
explicitement que **#15 et #17 prennent la même vidéo**. Cette dérogation est
limitée à ces deux entrées : elle ne supprime pas leur différence de réglage.
**`coached` ne signifie pas validé techniquement** : les posters, notices et
descriptifs audio priment sur les défauts repérés. Aucun GIF n’a été supprimé et
aucun des cinq exercices n’est marqué `validated`.

## Une vidéo commune, deux inclinaisons obligatoires

La mutualisation #15/#17 concerne **uniquement le fichier MP4**, pas la position
à reproduire :

- **#15** : banc à **environ 30°**, 4 × 6-8, repos 90 s. Sa voix précise
  « trente degrés, pas quarante-cinq » et décrit la descente de quatre secondes
  à côté du haut des pectoraux suivie d’une poussée d’une seconde.
- **#17** : banc à **45°**, 5 × 5-7, repos 120 s. Sa voix indique que la source
  commune montre une inclinaison plus faible et qu’il ne faut pas copier cet
  angle. Le geste de développé et la prise pronée restent identiques, mais le
  réglage du banc et la programmation sont propres à cette fiche.
- Les deux entrées utilisent une seule copie canonique,
  `/videos/developpe-halteres-incline-commun-15-17.mp4`, mais **deux posters et
  deux textes/audio différents**. Le poster #15 montre le banc à environ 30° ;
  celui du #17 montre le banc à 45°.

[Comparaison visuelle #15 / #17](./controle-pectoraux-14-18/pectoraux-15-17-comparaison-inclinaisons.jpg) ·
[Six instants de la source commune](./controle-pectoraux-14-18/pectoraux-15-17-six-instants.jpg) ·
[Zoom du geste commun](./controle-pectoraux-14-18/pectoraux-15-17-zoom-technique.jpg)

## Correspondances et intégrité

Les quatre fichiers ont été entièrement décodés avec OpenCV headless, sans
erreur de lecture : **24 i/s**, toutes les frames déclarées lues. Six instants
par source et des zooms techniques sont conservés dans
[`controle-pectoraux-14-18/`](./controle-pectoraux-14-18/).

| Source et affectation | Dimensions | Frames | Durée | SHA-256 |
|---|---:|---:|---:|---|
| #14 — `1793271389650.mp4` | 640×360 | 121/121 | 5,042 s | `6ed4456f046c27e3d8f144454082b84f3d7870f57b80fde99821e0b05491026d` |
| #15/#17 — `1793271577730.mp4` | 640×360 | 121/121 | 5,042 s | `dcaffa1c19618a17698fd26dc3a270540cc8fed699e9215ea90a7bc9bf2d09f2` |
| #16 — `1793271763315.mp4` | 1024×576 | 97/97 | 4,042 s | `4e4f2af6a27030753d3ae9ef93478b7b90087a0f7a00b5c5c06be66eeed58e33` |
| #18 — `1793271872816.mp4` | 1024×576 | 97/97 | 4,042 s | `32358837ef39cc75773b8ef22b06781d561956c76dbe9bd1f462dca998aafb77` |

Pour chaque source, l’empreinte SHA-256 est identique entre le fichier déposé à
la racine, la preuve documentaire et les copies `public/` et `release/`. Les
cinq posters sont également identiques à leurs photos de référence et entre
`public/` et `release/`.

Programmation conservée : #14 **6 × 8,8,6,6,4,4 · `4010` · 120 s · charge
croissante** ; #15 **4 × 6-8 · `4010` · 90 s** ; #16 **5 × 8-10 · `3010` ·
120 s** ; #17 **5 × 5-7 · `4010` · 120 s** ; #18 **4 × 12,10,8,15 · `3010` ·
90 s · 12→10→8 puis back-off 15**.

## Contrôle technique

### #14 — Dips pectoraux

- **Lisible :** deux appuis, corps suspendu, inclinaison initiale du buste et
  cycle de flexion/extension des coudes.
- **Réserves :** le buste se redresse pendant le cycle et la répartition visible
  ne correspond pas exactement à une descente de quatre secondes suivie d’une
  poussée d’une seconde.
- **Consigne prioritaire :** conserver le buste penché vers l’avant et les jambes
  sans balancement, descendre en quatre secondes dans une amplitude confortable
  puis pousser en une seconde. Ne pas transformer le mouvement en pompes au sol
  ou en dips triceps au buste vertical.

[MP4 contrôlé](./controle-pectoraux-14-18/pectoraux-14-source-1793271389650.mp4) ·
[Six instants](./controle-pectoraux-14-18/pectoraux-14-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-14-18/pectoraux-14-zoom-technique.jpg)

### #15 — Développé haltères incliné en pronation

- **Lisible :** banc incliné, deux haltères, appuis et cycle de développé.
- **Réserves :** la durée de **5,042 s** ne garantit pas les phases exactes du
  tempo `4010`. La source est aussi utilisée pour #17, mais elle ne doit pas
  faire passer #15 à 45°.
- **Consigne prioritaire :** pour cette fiche, banc à **environ 30°**, paumes
  vers les pieds, descente des deux haltères en quatre secondes à côté du haut
  des pectoraux puis poussée en une seconde, sans pause ni prise neutre.

[MP4 contrôlé](./controle-pectoraux-14-18/pectoraux-15-17-source-1793271577730.mp4) ·
[Poster 30°](./vague3-pectoraux-15-halteres-incline-pronation.jpg) ·
[Zoom 30°/pronation](./vague3-pectoraux-15-zoom-pronation-30.jpg)

### #16 — Écartés câbles incliné

- **Lisible :** banc incliné, deux poulies basses, deux câbles et poignées,
  intention de grand arc.
- **Réserves :** la vidéo amène les poignées **au-dessus de la tête** et augmente
  la flexion des coudes au lieu de conserver un écarté à coudes souples fixes.
  Le rythme visible ne remplace pas le tempo `3010`.
- **Consigne prioritaire :** arrêter la fermeture au-dessus du **haut des
  pectoraux**, sans croiser les mains, puis ouvrir en trois secondes sur le même
  arc. La fermeture dure une seconde ; l’angle des coudes ne change pas.

[MP4 contrôlé](./controle-pectoraux-14-18/pectoraux-16-source-1793271763315.mp4) ·
[Six instants](./controle-pectoraux-14-18/pectoraux-16-six-instants.jpg) ·
[Zoom de la réserve](./controle-pectoraux-14-18/pectoraux-16-zoom-technique.jpg) ·
[Poster poulies basses](./vague3-pectoraux-16-ecartes-cables-incline.jpg)

### #17 — Développé haltères incliné 45°

- **Lisible :** même développé avec deux haltères que #15, prise pronée et appuis
  visibles.
- **Réserves :** la source commune montre un banc **moins incliné que 45°**.
  Elle ne constitue donc pas une preuve visuelle de l’angle exigé par #17.
- **Décision appliquée :** le MP4 est conservé et partagé avec #15 à la demande
  de Yanis ; le poster à 45° et le descriptif audio sont prioritaires.
- **Consigne prioritaire :** régler le banc à **45°**, garder tête et dos appuyés
  sans se redresser en développé épaules, descendre en quatre secondes puis
  pousser en une seconde, paumes vers les pieds et charges éloignées du visage.

[MP4 contrôlé](./controle-pectoraux-14-18/pectoraux-15-17-source-1793271577730.mp4) ·
[Poster 45°](./vague3-pectoraux-17-halteres-incline-45.jpg) ·
[Zoom 45°/pronation](./vague3-pectoraux-17-zoom-45-pronation.jpg) ·
[Comparaison avec #15](./controle-pectoraux-14-18/pectoraux-15-17-comparaison-inclinaisons.jpg)

### #18 — Développé haltères incliné

- **Lisible :** départ en bas, banc incliné, deux haltères et cycle de poussée.
- **Réserves :** la vidéo marque un temps en haut et la descente visible est
  trop rapide pour la consigne de trois secondes.
- **Consigne prioritaire :** depuis le bas, pousser en une seconde puis descendre
  en trois secondes sans pause, sur banc à environ 30° et en prise pronée. La
  séquence **12→10→8 puis back-off 15** appartient à la programmation, sans
  modifier le geste.

[MP4 contrôlé](./controle-pectoraux-14-18/pectoraux-18-source-1793271872816.mp4) ·
[Six instants](./controle-pectoraux-14-18/pectoraux-18-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-14-18/pectoraux-18-zoom-technique.jpg) ·
[Poster bas contrôlé](./vague3-pectoraux-18-halteres-incline.jpg)

## Intégration applicative

Quatre MP4 canoniques sont installés dans `public/videos/` et `release/videos/`,
avec cinq posters distincts dans les deux dossiers `videos/posters/` :

- `/videos/dips.mp4` ;
- `/videos/developpe-halteres-incline-commun-15-17.mp4`, utilisé par #15 **et** #17 ;
- `/videos/ecartes-cables-incline.mp4` ;
- `/videos/developpe-halteres-incline.mp4`.

Les cinq entrées de `src/data/exercise-videos.js` sont `coached`, avec `title`,
`handCue`, `movementCue`, `notice` et `spoken` propres à chaque exercice. Les
sources originales, les preuves, les planches et les métadonnées sont conservées.
Les GIF de fallback restent présents dans `public/` et `release/`.

### Contrat de lecture guidée

- Le visuel est un MP4 **muet**, en boucle et adapté à la lecture intégrée ; la
  voix est un descriptif français distinct, déclenché par **Écouter le
  descriptif**.
- **Lecture / Pause** pilote la vidéo sans déclencher la voix ; la reprise
  reprend le média.
- Fermer ou remplacer une fiche met la vidéo en pause et annule le descriptif
  vocal. La visionneuse agrandie applique le même nettoyage.
- Le navigateur utilise `speechSynthesis.cancel()` ; la source Android expose
  également `JarvisSpeech.stop()`. **Aucun APK n’a été compilé.**

## Validation finale

- **Tests ciblés des fichiers vidéo/voix : 25/25 réussites**, dont les deux
  nouveaux tests Node #14→#18.
- **Parcours ciblé Playwright : 1/1 réussite**, avec les cinq fiches, quatre
  sources canoniques, cinq posters, notices et voix distinctes, ainsi que
  pause → reprise → arrêt/nettoyage sur #17.
- **Suite Node complète : 231 tests — 229 réussites, 0 échec, 2 ignorés.**
- **Suite Playwright complète : 49 scénarios — 38 réussites, 0 échec,
  11 ignorés.** Les 11 ignorés sont les mêmes tests de restauration/maintenance
  qui exigent la sauvegarde personnelle `transformation_12_mois_sauvegarde.json`,
  non publiée ; tous les tests vidéo ont été exécutés.
- `npm run build:portable` et `npm run build` réussis : **1679 modules** et
  **989 médias** dans chacun des index `public/` et `release/`, triés et
  identiques. Bundle principal : `release/assets/index-C6ou-c4W.js`.
- Les quatre URL MP4 canoniques et les cinq URL de posters répondent **HTTP 200**
  sur le serveur de développement.
- Version **1.12.0 / 195** inchangée ; aucune suppression de GIF ; #01→#13 non
  régénérés ; #11 triceps toujours en stand-by ; aucun APK produit.
- Reste hors portée : validation de la lecture sur le téléphone de Yanis et
  correction des défauts visuels documentés. Le partage #15/#17 reste `coached`
  et ne vaut pas validation de l’inclinaison visible.
