# Vérification de l'APK 1.8.2 — 16/10/2026 (faite sur le fichier lui-même)

Le fichier `downloads/Yanis-Fitness-Evolution-1.8.2.apk` est dans le dépôt : il a donc pu être
**analysé directement** (ce qui n'était pas possible sur l'asset de release, hôte non accessible
depuis la sandbox).

## Contrôles passés

| Contrôle | Résultat |
|---|---|
| Intégrité ZIP (`unzip -t`) | ✅ « No errors detected » |
| Taille | ✅ **95 561 328 octets** (= celle de l'asset de release) |
| SHA-256 | ✅ `540f15ed8a4ae2f3cf846dd2977d8dce99a024bdb1e9507b7b4eef34abfa3b31` (identique dans le `.sha256` publié) |
| Manifeste | ✅ `app.yanis.fitness.evolution` · **versionName 1.8.2** · **versionCode 184** · minSdk **26** (Android 8.0) · targetSdk 34 |
| Signature | ✅ **signé (schéma v2)** — 1 certificat |
| Certificat | ✅ SHA-256 `168df81abcbcae290a23cced74bbdc10e226f5093fc6a1c419e950125b74af26` — **le même que l'APK 1.7.2** déjà installé par le passé : aucune rupture de clé |
| Contenu | ✅ 405 médias + `assets/public/index.html`, `runtime.js`, bundle ; **les 3 GIF du lot 1 sont présents** (`acbab53a64c18aab`, `d36d738b07fe1305`, `6baa655d39de069e`) + échauffement (`4d6d57f97bdd691e`) + abduction (`0e3fd7381f21657e`) |

Comparaison avec l'APK 1.7.2 (extrait de l'historique) : **même package, même certificat, même
schéma de signature (v2), même minSdk**. Le mode de fabrication de l'APK n'a donc pas changé.

## Conclusion

L'APK est **techniquement installable** : rien ne le distingue des versions que le téléphone a
déjà installées. En revanche, le compteur GitHub indique **0 téléchargement** de l'asset 1.8.2
(et 0 pour la 1.8.1), alors que l'ancienne 1.5.2 en compte 4 : **le fichier n'est jamais arrivé
sur le téléphone**. La cause est donc côté téléchargement (hôte d'assets filtré, coupure réseau
sur 91 Mo, ou fichier partiel), pas côté APK.

Deux liens sont fournis (hôtes différents) + le miroir dans le dépôt, et la taille attendue est
affichée pour permettre le contrôle avant installation.
