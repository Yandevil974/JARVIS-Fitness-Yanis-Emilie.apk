# Suivi — Leg extension HOMME B-04

**Date :** 2026-10-10
**État :** pose A candidate ; pose B rejetée ; pose M non commencée.

## Poses

- `leg-extension-A.png` — assis, genoux fléchis à ~90°, rouleau sur les tibias. Candidate. Généré à partir de la pose A du front squat et d'un aperçu de machine trouvé en ligne.
- `leg-extension-B.png` — **rejetée** : jambes encore fléchies, cadrage différent. Conservée pour traçabilité.

## Références (aperçus d'images uniquement, aucune page ouverte)

- ritfitsports.com (article « what is a leg extension machine ») — aperçu d'une machine vue de face.
- titan.fitness (produit leg extension/curl) — aperçus en extension.
Stockées dans `image-search/` (hors dépôt).

## Nouvel essai de pose B (10 octobre 2026)

- `leg-extension-B2.png` — **rejetée** : même consigne explicite (genoux tendus, tibias horizontaux) à partir de A et d'un aperçu de machine en extension. Résultat quasi identique à A, genoux toujours fléchis. Conservée pour traçabilité.
- Constat : le générateur n'arrive pas à produire l'extension de genoux à partir d'une pose assise, malgré deux consignes différentes. Pose M non commencée.

## Méthode retenue : même machine et même angle pour toute la séquence (10 octobre 2026)

- **Constat** : les essais B/B2 à partir de la vue de face (machine différente, genoux qui ne se tendent pas) ont échoué. Ils ne sont pas repris.
- `leg-extension-B3.png` — **B retenue (candidate)** : jambes tendues, genoux verrouillés, tibias horizontaux. Générée sans image d'entrée, avec une machine Titan en trois-quarts. Vous aviez accepté un autre profil si nécessaire.
- `leg-extension-A2.png` — **A candidate** : même machine, même angle, genoux fléchis à ~90°, rouleau sur les tibias. Générée à partir de B3 pour garder la cohérence.
- `leg-extension-M2.png` — **M rejetée** : quasi identique à A2, pas de transition. Conservée pour traçabilité.
- **Reste à faire** : une vraie pose M intermédiaire (genoux à mi-extension), puis le GIF A2 → M → B3 → M → A2.
- Les anciens fichiers A (vue de face) et B/B2 restent comme traces, hors séquence.

## Physique et séquence musclée (10 octobre 2026)

- **Consigne utilisateur** : le mannequin doit avoir le physique musclé du personnage validé (front squat). Les essais B3, A2 et M2 (plus minces et moins musclés) sont écartés.
- `leg-extension-B4.png` — **B candidate** : jambes tendues, physique musclé, machine Titan en trois-quarts. Retenue.
- `leg-extension-A3.png` — **A candidate** : même personnage, genoux à ~90°, même machine et angle que B4. Retenue.
- `leg-extension-M3.png` — **M rejetée** : trop proche de B4 (jambes presque tendues).
- `leg-extension-M4.png` — **M rejetée** : trop proche de A3 (genoux encore à ~90°).
- **Reste à faire** : une pose M à mi-extension (genoux vers 45° de flexion), puis le GIF A3 → M → B4 → M → A3. Le générateur oscille entre les extrêmes ; à traiter ensuite.

## Pose M retenue (10 octobre 2026)

- `leg-extension-M5.png` — **M candidate** : mi-extension (genoux ~135°, tibias ~45°, rouleau à mi-tibia). Générée à partir de A3, B4 et d'un aperçu Titan en extension (`image-search/`, hors dépôt). Elle fait bien la transition, contrairement à M3 et M4.
- `leg-extension-preview.gif` — GIF de travail A3 → M5 → B4 → M5 → A3, 1024×1024, 5 images. Non intégré, non présenté avant le lot de 10.

- `leg-extension-app.gif` — **format application** : 440×440, 5 images A3 → M5 → B4 → M5 → A3. Non intégré : le lot de 10 n'est pas terminé, et l'intégration suivra l'autorisation du lot.
