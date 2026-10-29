# Pectoraux #09→#13 — contrôle et intégration des MP4

**Date : 29/10/2026 · Sources déposées par Yanis dans `dd2009864190dcc52ff15d90ff29616f02c37196`**

## Verdict

| N° | Exercice | Source retenue | État |
|---|---|---|---|
| #09 | Développé haltères plat | `1793267854248.mp4`, **source identique à P05** | **Intégré `coached`** — pronation, appuis et synchronisation prioritaires |
| #10 | Câbles croisés | `1793268142078.mp4` | **Intégré `coached`** — grand arc, coudes fixes et tempo prioritaires |
| #11 | Développé couché barre plat | `1793268156130.mp4`, **source identique à T10 triceps** | **Intégré `coached`** — prise pectorale standard et tempo `4010` prioritaires |
| #12 | Développé haltères incliné 45°, prise neutre | `1793268364920.mp4` | **Intégré `coached`** — banc à 45°, prise neutre et tempo prioritaires |
| #13 | Écartés haltères | `1793268616358.mp4` | **Intégré `coached`, MP4 de Yanis conservé tel quel** — grand arc symétrique, coudes fixes et retour en haut prioritaires |

Le dépôt des sources vaut accord d'intégration. Yanis a ensuite demandé
explicitement de **garder sa vidéo d'écarté haltères #13**, sans la remplacer.
**`coached` ne signifie pas validé techniquement** : les posters, notices et
descriptifs audio priment sur les défauts repérés. Aucun GIF n'a été supprimé
et aucun des cinq MP4 n'est marqué `validated`.

## Correspondances et intégrité

Les cinq fichiers ont été entièrement décodés avec OpenCV headless, sans erreur
de lecture : **24 i/s**, toutes les frames déclarées lues. Six instants par
vidéo et des zooms techniques sont conservés dans
[`controle-pectoraux-09-13/`](./controle-pectoraux-09-13/).

| N° | Dimensions | Frames | Durée | SHA-256 |
|---|---:|---:|---:|---|
| #09 | 1024×1024 | 97/97 | 4,042 s | `980a2bedb84f0d49348158d2d184577a30fed41556f986743c7745069a148c55` |
| #10 | 640×360 | 121/121 | 5,042 s | `66a5c114c31de56580eb2e9354f515036fbb81796c4a5ea306f2f10138d184f1` |
| #11 | 640×480 | 97/97 | 4,042 s | `de0cd5fc9ac91d055c8215f0f99fe522e2165de4ff8d39224e798872b975bf28` |
| #12 | 640×360 | 121/121 | 5,042 s | `5acc5e419349388e7a42fba4a8b61b65c9312f6866d5a969b568df14c4cf8065` |
| #13 | 640×640 | 121/121 | 5,042 s | `d507a27a9f95c883c6c32fdd82df9c3219c57d71d6e301ebfd0428860d07fd29` |

Deux réutilisations sont établies par SHA-256 **et** comparaison octet pour
octet :

- **#09 = P05** : `1793267854248.mp4` est strictement identique à
  `1793102886886.mp4`, déjà utilisé pour
  `developpe-halteres-plat-prise-neutre`. Ce n'est pas une nouvelle animation ;
  la voix impose donc la **pronation** du #09 au lieu de la prise neutre visible.
- **#11 = T10 triceps** : `1793268156130.mp4` est strictement identique à
  `1792939358423.mp4`, déjà utilisé pour `developpe-couche-prise-serree`. La
  voix impose la **prise pectorale standard** et le tempo `4010`, pas la prise
  rapprochée et le tempo `3010` de la source triceps.

Programmation conservée : #09 **4 × 8-10 · `3010` · 75 s** ; #10
**4 × 10/8/6 · `3010` · 75 s** ; #11 **5 × 6,6,6,8,8 · `4010` · 90 s** ;
#12 **5 × 8-10 · `3010` · 60 s** ; #13 **5 × 8-10 · `3010` · 120 s**.

## Contrôle technique

### #09 — Développé haltères plat

- **Lisible :** banc plat, deux haltères et trajectoire de développé.
- **Réserves :** source identique au #05 neutre ; le buste se redresse, les
  appuis se soulèvent et les bras perdent leur synchronisation.
- **Consigne prioritaire :** prise pronée, paumes vers les pieds, dos des mains
  vers la tête, appuis stables, descente des deux haltères en trois secondes
  puis poussée en une seconde.

[MP4 contrôlé](./controle-pectoraux-09-13/pectoraux-09-source-1793267854248.mp4) ·
[Six instants](./controle-pectoraux-09-13/pectoraux-09-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-09-13/pectoraux-09-zoom-technique.jpg)

### #10 — Câbles croisés

- **Lisible :** deux poulies hautes, deux poignées et grand arc de croisement.
- **Réserves :** l'angle des coudes varie et la durée de **5,042 s** ne permet
  pas de copier littéralement le cycle de quatre secondes du tempo `3010`.
- **Consigne prioritaire :** une seconde pour refermer devant le bas des
  pectoraux, trois secondes pour ouvrir, coudes souples fixes et aucune presse.

[MP4 contrôlé](./controle-pectoraux-09-13/pectoraux-10-source-1793268142078.mp4) ·
[Six instants](./controle-pectoraux-09-13/pectoraux-10-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-09-13/pectoraux-10-zoom-technique.jpg)

### #11 — Développé couché barre plat

- **Lisible :** banc plat, une barre droite et cycle de poussée.
- **Réserves :** la source est celle du développé prise serrée triceps #10 ;
  elle montre une prise rapprochée et sa durée de **4,042 s** est trop courte
  pour une descente de quatre secondes suivie d'une poussée d'une seconde.
- **Consigne prioritaire :** mains légèrement plus larges que les épaules,
  barre sur la ligne du milieu du sternum, descente en quatre secondes puis
  poussée en une seconde, jamais vers le cou ou le visage.

[MP4 contrôlé](./controle-pectoraux-09-13/pectoraux-11-source-1793268156130.mp4) ·
[Six instants](./controle-pectoraux-09-13/pectoraux-11-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-09-13/pectoraux-11-zoom-technique.jpg)

### #12 — Développé haltères incliné 45° en prise neutre

- **Lisible :** banc incliné, deux haltères et cycle de développé.
- **Réserves :** l'angle visuel ne permet pas de certifier 45°, les charges se
  rapprochent du visage et la durée de **5,042 s** ne respecte pas le cycle de
  quatre secondes.
- **Consigne prioritaire :** banc réglé à 45°, paumes face à face, haltères à
  côté du haut de la poitrine et loin du visage, poussée en une seconde puis
  descente en trois secondes.

[MP4 contrôlé](./controle-pectoraux-09-13/pectoraux-12-source-1793268364920.mp4) ·
[Six instants](./controle-pectoraux-09-13/pectoraux-12-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-09-13/pectoraux-12-zoom-technique.jpg)

### #13 — Écartés haltères

- **Lisible :** banc plat, deux haltères et intention d'écarté en grand arc.
- **Réserves :** les bras se désynchronisent, les coudes changent d'angle et le
  cycle de **5,042 s** finit en bas au lieu de rejoindre proprement le haut.
- **Décision de Yanis :** le MP4 est **conservé tel quel**, sans régénération.
- **Consigne prioritaire :** paumes face à face, coudes souples avec un angle
  constant, ouverture symétrique en trois secondes puis fermeture en une
  seconde avec retour complet en haut. Ne pas transformer l'écarté en presse.

[MP4 contrôlé](./controle-pectoraux-09-13/pectoraux-13-source-1793268616358.mp4) ·
[Six instants](./controle-pectoraux-09-13/pectoraux-13-six-instants.jpg) ·
[Zoom technique](./controle-pectoraux-09-13/pectoraux-13-zoom-technique.jpg) ·
[Photo de référence](./vague3-pectoraux-13-ecartes-halteres.jpg) ·
[Zoom du grand arc](./vague3-pectoraux-13-zoom-grand-arc.jpg)

## Intégration applicative

Chaque MP4 est installé sous son nom catalogue dans `public/videos/` et
`release/videos/`, avec son poster dans les deux dossiers `videos/posters/` :

- `/videos/developpe-halteres-plat.mp4` ;
- `/videos/cables-croises.mp4` ;
- `/videos/developpe-couche-barre-plat.mp4` ;
- `/videos/developpe-halteres-incline-45-prise-neutre.mp4` ;
- `/videos/ecartes-halteres.mp4`.

Les cinq entrées de `src/data/exercise-videos.js` sont `coached`, avec `title`,
`handCue`, `movementCue`, `notice` et `spoken` propres à chaque variante. Les
sources originales, une copie de preuve, les planches et les métadonnées sont
conservées. Les GIF de fallback restent présents dans `public/` et `release/`.

### Contrat de lecture guidée

- Le visuel est un MP4 **muet**, en boucle et adapté à la lecture intégrée ;
  la voix est un descriptif français distinct, déclenché par **Écouter le
  descriptif**.
- **Lecture / Pause** pilote la vidéo sans déclencher la voix ; la reprise
  reprend le média.
- Fermer ou remplacer une fiche met la vidéo en pause et annule le descriptif
  vocal. La visionneuse agrandie applique le même nettoyage.
- Le navigateur utilise `speechSynthesis.cancel()` ; la source Android expose
  également `JarvisSpeech.stop()` pour arrêter TextToSpeech et toute phrase en
  attente. **Aucun APK n'a été compilé.**

## Validation finale

- **Tests ciblés Node : 2/2 réussites** pour les associations, GIF, posters,
  programmation et consignes #09→#13.
- **Parcours ciblé Playwright : 1/1 réussite**, avec les cinq vidéos, leurs
  posters, notices, voix distinctes, et le contrôle pause → reprise → arrêt/nettoyage
  sur #13.
- **Suite Node complète : 229 tests — 227 réussites, 0 échec, 2 ignorés.**
- **Suite Playwright complète : 48 scénarios — 37 réussites, 0 échec,
  11 ignorés.** Les 11 ignorés sont les mêmes tests de restauration/maintenance
  qui exigent la sauvegarde personnelle `transformation_12_mois_sauvegarde.json`,
  non publiée ; tous les tests vidéo ont été exécutés.
- `npm run build:portable` et `npm run build` réussis : **1679 modules** et
  **980 médias** dans chacun des index `public/` et `release/`, triés et
  identiques. Bundle principal : `release/assets/index-ooB0dR9r.js`.
- Pour chacun des cinq exercices : SHA-256 source = preuve = copie publique =
  copie `release/` ; posters identiques entre `public/` et `release/`.
- Les cinq URL MP4 et les cinq URL de posters répondent **HTTP 200** sur le
  serveur de développement.
- Version **1.12.0 / 195** inchangée ; aucune suppression de GIF ; #01→#08 non
  régénérés ; #11 triceps toujours en stand-by ; aucun APK produit.
- Reste hors portée : validation de la lecture sur le téléphone de Yanis et
  correction des défauts visuels documentés. Le MP4 #13 reste celui fourni par
  Yanis, conformément à sa demande.
