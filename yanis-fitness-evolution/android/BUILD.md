# Yanis Fitness Evolution — build Android

Application autonome, séparée de « JARVIS Fitness » (n’importe pas son
empreinte de signature) :

| Élément                   | Valeur                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| appId / namespace         | `app.yanis.fitness.evolution`                                                                                                     |
| versionName / versionCode | `1.11.0` / `194`                                                                                                                   |
| Clé de release            | `android/keystore/yanis-fitness-evolution.p12` (PKCS12, alias `yanis-fitness-evolution`)                                          |
| Stockage navigateur       | clé `yanis-fitness-evolution.v1` — l’ancienne clé `jarvis_fitness_v3` n’est lue qu’une fois, sans jamais être modifiée ni effacée |

## Prérequis (machine locale)

- JDK 17, Android SDK (platform 34 + build-tools), `ANDROID_HOME` défini.
- `npm ci` dans ce dossier.

## Chaîne complète

```bash
npm run build:portable # runtime.js + runtime.css + media-index.json pour l’export « HTML autonome »
npm run build          # vite → release/
npx cap sync android   # copie release/ dans android/app/src/main/assets/public
cd android && ./gradlew assembleRelease
# APK : android/app/build/outputs/apk/release/app-release.apk
```

Les mots de passe du keystore valent `yanis-evolution-2026` par défaut ; pour
les changer :

```bash
./gradlew assembleRelease -PYFE_STORE_PASSWORD='…' -PYFE_KEY_PASSWORD='…'
```

## Vérifications de la version 1.11.0 (25/10/2026)

- Intégration des biceps #14→#17 en `coached` après validation explicite de Yanis des meilleures sources disponibles, sans les déclarer techniquement `validated`.
- Posters de référence, notices propres à chaque réserve et descriptifs audio corrigés, y compris dans la visionneuse agrandie.
- Les défauts restent documentés : retour haut imposé pour #14, marteau neutre pour #15, biceps du bras posé pour #16 et fin basse sans remontée supplémentaire pour #17.
- `npm test` — **217 tests : 215 réussites, 0 échec, 2 ignorés**.
- Playwright complet — **31 réussites, 0 échec, 11 ignorés** (sauvegarde externe absente, comme auparavant).
- `npm run build` — **1679 modules**, build réussi et `release/` régénéré avec les quatre MP4 et leurs posters.
- Version Android : `versionName 1.11.0`, `versionCode 194`. L'APK signé est assemblé et contrôlé par le workflow GitHub de release, avec contrôle nominatif des quatre nouvelles vidéos et de leurs posters.

## Vérifications de la version 1.10.0 (24/10/2026)

- Overlay de séance sur les démonstrations : série, objectif, récupération et progression issus de l’état réel de l’entraînement.
- Adaptation de charge JARVIS sur la séance existante, avec aperçu et confirmation ; aucun programme parallèle ni historique réécrit.
- Repère vocal facultatif citant la performance précédente avec la même unité, sans transformer les agrégats importés en records.
- `npm test` — **215 tests : 213 réussites, 0 échec, 2 ignorés**.
- Playwright complet — **30 réussites, 0 échec, 11 ignorés** (sauvegarde externe absente, comme auparavant).
- `npm run build` — **1679 modules**, build réussi et `release/` régénéré.
- Version Android : `versionName 1.10.0`, `versionCode 193`. L'APK signé est assemblé et contrôlé par le workflow GitHub de release.

## Vérifications de la version 1.9.0 (24/10/2026)

- Déplacement inter-semaines : contenu et identifiant de la séance sélectionnée conservés, avec verrouillage du contenu source.
- Copie depuis « Semaine complète » : blocs liés repris avec de nouveaux identifiants, sans modifier l’original ni transférer ses séries validées.
- Effacement de l’historique JARVIS avec confirmation, limité aux messages du profil actif.
- Vitesse d’élocution persistée et transmise à Android TextToSpeech comme à la synthèse du navigateur.
- `npm test` — **208 tests : 206 réussites, 0 échec, 2 ignorés**.
- Playwright complet — **28 réussites, 0 échec, 11 ignorés** (sauvegarde externe absente, comme auparavant).
- `npm run build` — **1679 modules**, build réussi et `release/` régénéré.
- Version Android : `versionName 1.9.0`, `versionCode 192`. L'APK signé est assemblé et contrôlé par le workflow GitHub de release.

## Vérifications du correctif JARVIS 1.8.9 (24/10/2026)

- Commandes de modification de programme et de report hebdomadaire : **9/9 tests ciblés**.
- `npm test` — **202 tests : 200 réussites, 0 échec, 2 ignorés**.
- Parcours JARVIS dans le navigateur, proposition puis application du report : **2/2 tests ciblés**.
- Playwright complet — **25 réussites, 0 échec, 11 ignorés** (sauvegarde externe absente, comme auparavant).
- `npm run build` — **1678 modules**, build réussi et `release/` régénéré.
- Version Android : `versionName 1.8.9`, `versionCode 191`. L'APK signé est assemblé et contrôlé par le workflow GitHub de release.

## Vérifications de la reprise 1.8.8 + test7 (22/10/2026)

- `npm test` — **187 tests : 185 réussis, 0 échec, 2 ignorés**. Tous les tests JARVIS Brain passent.
- Contrôle ciblé échauffement/vidéos — **14/14 réussites**.
- `npm run build` — **1678 modules**, build réussi et `release/` régénéré.
- Playwright — **18 tests généraux réussis** et **2 tests ciblés réussis** (JARVIS Brain, vidéos du récapitulatif et du minuteur). **11 scénarios de restauration sont ignorés** car leur sauvegarde jointe n'est pas disponible.
- Le workflow Android vérifie la signature, `versionName 1.8.8`, `versionCode 190`, le nombre de médias et de MP4 embarqués, ainsi que les six vidéos témoins de l'échauffement.
- La validation sur téléphone reste distincte de ces contrôles automatisés.

## Cohabitation avec l’ancienne application

Les deux APK peuvent cohabiter : identifiants différents, clés de stockage
différentes. L’import des données se fait depuis Profil → Données &
sauvegardes (JSON ou HTML exporté de l’ancienne application, ou le fichier
`DOC-20260919-WA0000..json`).
