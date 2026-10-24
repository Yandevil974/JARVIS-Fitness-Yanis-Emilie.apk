# Yanis Fitness Evolution — build Android

Application autonome, séparée de « JARVIS Fitness » (n’importe pas son
empreinte de signature) :

| Élément                   | Valeur                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| appId / namespace         | `app.yanis.fitness.evolution`                                                                                                     |
| versionName / versionCode | `1.8.9` / `191`                                                                                                                   |
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
