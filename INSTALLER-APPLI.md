# 📲 Installer Yanis Fitness Evolution 1.8.3

**Release stable du 16 octobre 2026** — base applicative 1.8.2, avec les trois GIFs d'étirement approuvés. La release GitHub `v1.8.3-jarvis-animations` est la release stable `latest`.

## 1. Télécharger

- **[Télécharger l'APK 1.8.3](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/download/v1.8.3-jarvis-animations/yanis-fitness-evolution-1.8.3.apk)**
- [Télécharger le fichier SHA-256](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/download/v1.8.3-jarvis-animations/yanis-fitness-evolution-1.8.3.apk.sha256)
- [Ouvrir la page de la release](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/releases/tag/v1.8.3-jarvis-animations)

## 2. Vérifier le fichier téléchargé

| Élément | Valeur attendue |
|---|---|
| Nom | `yanis-fitness-evolution-1.8.3.apk` |
| Taille | **97 214 600 octets** (≈ **92,7 Mio**) |
| SHA-256 | `f824af57a32a21da651a26fdfa2aefa7d1c6a540fe257602435c0d126ee16be2` |

Le SHA-256 est aussi fourni par l'API des assets GitHub et dans le fichier `.apk.sha256` attaché à la release. Pour vérifier sur macOS/Linux :

```sh
sha256sum yanis-fitness-evolution-1.8.3.apk
```

Sous Windows :

```bat
certutil -hashfile yanis-fitness-evolution-1.8.3.apk SHA256
```

La somme doit correspondre exactement à la valeur ci-dessus. Si la taille est inférieure, le téléchargement est incomplet : recommencez, de préférence en Wi-Fi.

## 3. Installer ou mettre à jour

1. Prévoir au moins **300 Mo** d'espace libre et utiliser Android **8.0 ou plus récent**.
2. Télécharger l'APK puis l'ouvrir depuis la notification de téléchargement ou l'application **Fichiers**.
3. Si Android le demande, autoriser temporairement l'installation d'applications inconnues pour le navigateur ou l'application Fichiers.
4. Confirmer l'installation. Si l'application 1.8.2 est déjà installée, installer cette version **par-dessus** : ne désinstallez pas l'ancienne application.

C'est la même application Android, identifiant `app.yanis.fitness.evolution`, signée avec la clé du projet. La version installée passe de **versionCode 184** à **185** (versionName **1.8.3**); Android l'accepte comme mise à jour et les données locales sont conservées.

## Contrôles de livraison

Le build de release a été exécuté sur GitHub Actions depuis le commit `1096a967080a24ce01cd3c60be3e44339d7a3a19`. Les tests passent (**154 au total, 152 réussis, 2 ignorés, aucun échec**). Le workflow a validé le manifeste/version Android, la signature APK, le nombre complet de médias embarqués et la présence des trois GIFs d'étirement ainsi que des trois GIFs témoins du lot musculation.
