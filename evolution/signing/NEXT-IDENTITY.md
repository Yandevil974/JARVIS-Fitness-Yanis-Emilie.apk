# Nouvelle application séparée — autorisation du 20 septembre 2026

L’utilisateur a explicitement autorisé une autre application pour retrouver toutes les étapes 1–7 avant l’IA. Nom inchangé : **Yanis Fitness Evolution**. Nouveau package : `app.yanis.fitness.evolution`. Ne jamais réutiliser le package de l’application précédente avec cette nouvelle clé. Ne désinstaller aucune ancienne application ; migration JSON explicite et vérification des deux profils.

## Signature et sauvegarde

- Identité publique : `../android/identity-next.json`. Les anciens `identity.json`, `release.json` et APK restent inchangés.
- Clé RSA 3072 créée une seule fois, keystore PKCS12 ; refus de régénération si l’identité OU l’un des emplacements de sauvegarde existe.
- Dossier de travail privé : `.private/yanis-fitness-evolution/`, dans le workspace, ignoré par Git, jamais servi par HTTP. Permissions 700/600.
- Archive privée : `Yanis-Fitness-Evolution-SAUVEGARDE-PRIVEE.zip`, remise par le visualiseur Arena. Elle contient le keystore, son mot de passe, l’identité et la clé de récupération. Le ZIP lui-même n’est PAS chiffré. Ne pas le publier.
- Copie **chiffrée uniquement** versionnée : `evolution-next.encrypted.json`. AES-256-GCM, nonce aléatoire 96 bits, clé aléatoire indépendante 256 bits, identité publique authentifiée. Aucune clé de déchiffrement ou mot de passe dans Git. La clé de récupération est uniquement dans le dossier/l’archive privés.
- La copie chiffrée Git ne suffit pas sans la clé de récupération. La conservation de deux copies externes privées par l’utilisateur reste **à confirmer**. Ne jamais considérer qu’un appel au visualiseur prouve le téléchargement.

## Vérification et restauration

```sh
python3 -m pip install --target .cache/signing-tools cryptography==46.0.3
PYTHONPATH=.cache/signing-tools python3 -m unittest discover -s evolution/android/tests -p test_signing_next.py -v
# Avec recovery-key.txt retrouvé dans une copie PRIVÉE :
PYTHONPATH=.cache/signing-tools python3 evolution/android/signing-next.py \
  --restore-with-key-file /chemin/prive/recovery-key.txt \
  --restore-to /chemin/prive/nouveau-dossier
```

Restauration vérifiée : identité, inventaire ZIP fermé, certificat, capacité de la clé privée à signer et signature vérifiée par le certificat public. Tests du mauvais secret, altération du chiffré et des métadonnées, traversée de chemins, mauvais certificat, permissions et refus d’écrasement. Cette vérification n’est pas un test de l’application sur Android.

Les commandes d’initialisation ne doivent plus être utilisées pour cette identité. Si le dossier privé disparaît, restaurer la sauvegarde ; ne pas contourner les protections.
