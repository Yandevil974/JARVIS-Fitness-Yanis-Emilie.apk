# Installation de Yanis Fitness Evolution 1.4.2 (23 septembre 2026)

> **Cette version remplace la 1.4.1.** La 1.4.1 était valide et identique dans son contenu, mais sa clé de signature n'existait que dans l'espace de travail et a été détruite par une réinitialisation de l'environnement : aucune mise à jour de cette installation n'aurait plus été possible. La 1.4.2 porte **le même contenu corrigé** avec une identité dont la sauvegarde chiffrée est conservée dans le dépôt. **N'installez pas la 1.4.1 ; utilisez la 1.4.2.**

Cette version corrige la récupération en piscine : les étapes aquatiques (marche
aquatique, nage douce, fractionné nagé) affichent désormais le guide aquatique dans
l’aperçu **et** dans le minuteur, y compris quand le bloc piscine suit une séance de
musculation. Aucune autre partie de l’application n’est modifiée : 9 bibliothèques
natives sur 9 sont identiques octet pour octet à la 1.4.0, et 271 des 272 fichiers
web sont inchangés.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `Yanis-Fitness-Evolution-1.4.2.apk` | application à installer (24 909 281 octets) |
| `Yanis-Fitness-Evolution-1.4.2.apk.sha256` | empreinte de contrôle |
| `Yanis-Fitness-Evolution-1.4.2.fidelity.json` | inventaire de fidélité (ce qui a changé, ce qui n’a pas changé) |
| `Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` | sauvegarde PRIVÉE de la nouvelle clé (à garder hors du téléphone, ne jamais publier) |

[Télécharger l’APK 1.4.2](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/f69f469/downloads/Yanis-Fitness-Evolution-1.4.2.apk) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/f69f469/downloads/Yanis-Fitness-Evolution-1.4.2.apk.sha256) · [inventaire de fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/f69f469/downloads/Yanis-Fitness-Evolution-1.4.2.fidelity.json)

Empreinte SHA-256 de l’APK :

```
6e08516ec3a439bdfc7f68024fcb47feb26bae833fd443b3428251797734ceff
```

## Étapes sur le téléphone

1. **Sauvegarder les données** : dans la 1.4.0, ouvrez les réglages de sauvegarde et
   exportez le fichier JSON (charges, historique, réglages, profils). C’est la seule
   copie de vos données : sans elle, la désinstallation efface tout.
2. **Désinstaller la 1.4.0** : la 1.4.2 garde le même identifiant d’application
   (`app.yanis.fitness.evolution.home`) mais une signature différente, autorisée
   explicitement le 23 septembre 2026. Android refuse d’installer par-dessus une
   application signée autrement ; la désinstallation est donc obligatoire.
3. **Installer la 1.4.2** en ouvrant le fichier APK téléchargé, puis en autorisant
   l’installation depuis cette source si le téléphone le demande.
4. **Restaurer** le JSON exporté à l’étape 1 depuis l’écran de sauvegarde de la 1.4.2.

Vérification facultative sur un ordinateur :

```
sha256sum Yanis-Fitness-Evolution-1.4.2.apk
# doit afficher 6e08516ec3a439bdfc7f68024fcb47feb26bae833fd443b3428251797734ceff
```

## Limites honnêtes de cette livraison

- Aucun test sur téléphone réel n’a été possible ici : la vérification porte sur la
  signature (v2 et v3), l’alignement, l’inventaire des fichiers et la comparaison
  octet par octet avec la 1.4.0.
- La correction a été validée dans un navigateur (26 tests d’écran, dont les cas
  piscine après musculation) sur le même paquet web que celui embarqué dans l’APK.
- Le ZIP privé est en clair : à conserver hors du téléphone et hors de GitHub.
  Sans lui, aucune mise à jour future de cette application ne sera possible.
- L’IA conversationnelle reste exclue, comme demandé.
