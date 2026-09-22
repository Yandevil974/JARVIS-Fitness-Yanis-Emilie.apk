# Yanis Fitness Evolution — build Android

Application autonome, séparée de « JARVIS Fitness » (n’importe pas son
empreinte de signature) :

| Élément | Valeur |
| --- | --- |
| appId / namespace | `app.yanis.fitness.evolution` |
| versionName / versionCode | `1.5.1` / `151` |
| Clé de release | `android/keystore/yanis-fitness-evolution.p12` (PKCS12, alias `yanis-fitness-evolution`) |
| Stockage navigateur | clé `yanis-fitness-evolution.v1` — l’ancienne clé `jarvis_fitness_v3` n’est lue qu’une fois, sans jamais être modifiée ni effacée |

## Prérequis (machine locale)

- JDK 17, Android SDK (platform 34 + build-tools), `ANDROID_HOME` défini.
- `npm ci` dans ce dossier.

## Chaîne complète

```bash
npm run build          # vite → release/
npm run build:portable # runtime.js + runtime.css + media-index.json pour l’export « HTML autonome »
npx cap sync android   # copie release/ dans android/app/src/main/assets/public
cd android && ./gradlew assembleRelease
# APK : android/app/build/outputs/apk/release/app-release.apk
```

Les mots de passe du keystore valent `yanis-evolution-2026` par défaut ; pour
les changer :

```bash
./gradlew assembleRelease -PYFE_STORE_PASSWORD='…' -PYFE_KEY_PASSWORD='…'
```

## Vérifications locales possibles

- `npm test` — 96 tests unitaires (94 verts) (moteur, stockage, import DOC réel, minuteur/voix).
- `npx playwright test` — parcours complets une fois les navigateurs installés
  (`npx playwright install chromium`).

## Cohabitation avec l’ancienne application

Les deux APK peuvent cohabiter : identifiants différents, clés de stockage
différentes. L’import des données se fait depuis Profil → Données &
sauvegardes (JSON ou HTML exporté de l’ancienne application, ou le fichier
`DOC-20260919-WA0000..json`).
