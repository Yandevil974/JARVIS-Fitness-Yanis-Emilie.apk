# Recette — chaîne de livraison APK corrigée (essai à blanc)

**23 septembre 2026.** Essai **à blanc uniquement** : clé de test jetable dans `.cache`, sortie dans `.cache`, **aucune identité de livraison créée**, aucun fichier publié. Rapport machine : `.cache/media-apk-dryrun/fidelity.json`.

## Ce qui a été prouvé

| Étape | Résultat |
|---|---|
| Chaîne d'outils | `jdk4py==17.0.9.2` (JRE) + `ecj.jar` (compilateur Eclipse) + `apksig-source.tar.gz`, téléchargés aux commits épinglés via `gh api`, empreintes vérifiées |
| `apksigner.jar` reconstruit | **empreinte identique à celle épinglée** dans `release-home.json` : `ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc` — signataire reproductible |
| Vérification de l'APK 1.3.0 livré | v2 et v3 vérifiés, certificat `4d4fbd84…` (identité historique) |
| Repack de l'APK 1.4.0 | base épinglée `30b20ce1…`, **2 entrées modifiées seulement** : `AndroidManifest.xml` (versionCode 11 → 12, versionName 1.4.0 → 1.4.1) et `assets/public/assets/index-CBCies4k.js` (bundle corrigé `b74853bc…`) |
| Fichiers natifs | **9 DEX sur 9 octet pour octet identiques** ; 272 fichiers web conservés |
| Alignement | 4 octets (ressources), 16 Kio (libs natives) vérifiés |
| Signature | v2 + v3 vérifiés, 1 signataire, certificat de test `6e3a679f…` |
| Taille | 24 909 281 octets (base 24 905 185, **+4 096** dus à l'alignement) |

Manifeste relu après patche : `versionName` = **1.4.1**, `appId` = `app.yanis.fitness.evolution.home` (inchangé).

Script reproductible : `evolution/android/build-media-141.py --dry-run` (refuse par construction toute sortie hors de `.cache`, refuse toute écriture d'identité existante).

## Ce que l'essai à blanc ne prouve pas

- **Aucune installation réelle** : pas d'appareil ni d'émulateur Android ici. La vérification porte sur la structure, l'alignement et la signature, pas sur un lancement sur téléphone.
- **Aucune identité de livraison** : la clé de test est jetable et ne doit jamais servir à publier.
- Les visuels restent ceux du candidat : **41 groupes ouverts**, **30 dessins jamais relus** (35 moins les 5 revus), approches d'échauffement et Tabata au sol non résolus. Un APK publié maintenant corrigerait la récupération aquatique mais **pas** ces lacunes.

## Autres commandes utiles

- Générer le build web : `node evolution/media/candidate/build.mjs` (déterministe, redonne `b74853bc…`)
- Outils : `python3 evolution/android/prepare-home-tools.py` (JRE jdk4py + apksigner épinglé)
- Essai : `python3 evolution/android/build-media-141.py --dry-run`
