> **Document historique — version remplacée.** La 1.4.1 n'a plus de clé de signature récupérable (perdue lors d'une réinitialisation de l'environnement). Utilisez la 1.4.2 : contenu identique, identité durable. Voir `INSTALLATION-1.4.2.md`.

# Installation de Yanis Fitness Evolution 1.4.1 (23 septembre 2026)

Cette version corrige la récupération en piscine : les étapes aquatiques (marche
aquatique, nage douce, fractionné nagé) affichent désormais le guide aquatique dans
l’aperçu **et** dans le minuteur, y compris quand le bloc piscine suit une séance de
musculation. Aucune autre partie de l’application n’est modifiée : 9 bibliothèques
natives sur 9 sont identiques octet pour octet à la 1.4.0, et 271 des 272 fichiers
web sont inchangés.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `Yanis-Fitness-Evolution-1.4.1.apk` | application à installer (24 909 281 octets) |
| `Yanis-Fitness-Evolution-1.4.1.apk.sha256` | empreinte de contrôle |
| `Yanis-Fitness-Evolution-1.4.1.fidelity.json` | inventaire de fidélité (ce qui a changé, ce qui n’a pas changé) |
| `Yanis-Fitness-Evolution-1.4.1-SAUVEGARDE-PRIVEE.zip` | sauvegarde PRIVÉE de la nouvelle clé (à garder hors du téléphone, ne jamais publier) |

[Télécharger l’APK 1.4.1](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/f69f469/downloads/Yanis-Fitness-Evolution-1.4.1.apk) · [empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/f69f469/downloads/Yanis-Fitness-Evolution-1.4.1.apk.sha256) · [inventaire de fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/f69f469/downloads/Yanis-Fitness-Evolution-1.4.1.fidelity.json)

Empreinte SHA-256 de l’APK :

```
c8dff99767923e1a452acffd0484d3e19cc989bacad212ee3cbb47bef01a668d
```

## Étapes sur le téléphone

1. **Sauvegarder les données** : dans la 1.4.0, ouvrez les réglages de sauvegarde et
   exportez le fichier JSON (charges, historique, réglages, profils). C’est la seule
   copie de vos données : sans elle, la désinstallation efface tout.
2. **Désinstaller la 1.4.0** : la 1.4.1 garde le même identifiant d’application
   (`app.yanis.fitness.evolution.home`) mais une signature différente, autorisée
   explicitement le 23 septembre 2026. Android refuse d’installer par-dessus une
   application signée autrement ; la désinstallation est donc obligatoire.
3. **Installer la 1.4.1** en ouvrant le fichier APK téléchargé, puis en autorisant
   l’installation depuis cette source si le téléphone le demande.
4. **Restaurer** le JSON exporté à l’étape 1 depuis l’écran de sauvegarde de la 1.4.1.

Vérification facultative sur un ordinateur :

```
sha256sum Yanis-Fitness-Evolution-1.4.1.apk
# doit afficher c8dff99767923e1a452acffd0484d3e19cc989bacad212ee3cbb47bef01a668d
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
