# Signature de la livraison avec accueil — identité autorisée le 21 septembre 2026

Après explication de l’installation séparée et du transfert JSON, l’utilisateur a choisi **« Oui, on y va »**, puis écrit **« Poursuis »**. L’autorisation est enregistrée dans `evolution/android/home-authorization.json`. Elle a été utilisée une fois pour l’identité suivante ; **elle ne permet pas de recréer encore une clé à chaque reprise de session**.

- Application : **Yanis Fitness Evolution**.
- Package : **`app.yanis.fitness.evolution.home`**.
- Création : **1.4.0 / code 11**.
- Certificat SHA-256 : **`7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd`**.
- Identité publique immuable : `evolution/android/identity-home.json`.
- Livraison : `evolution/android/release-home.json` ; les futures versions ne doivent pas changer le package ou le certificat.
- Local privé : `.private/yanis-fitness-evolution-home/`, ignoré par Git.
- ZIP privé remis via le visualiseur : **`Yanis-Fitness-Evolution-1.4-SAUVEGARDE-PRIVEE.zip`** ; il n’est pas chiffré, ne jamais le publier.
- Sauvegarde publique **chiffrée** : `evolution/signing/evolution-home.encrypted.json`, AES-256-GCM avec identité authentifiée.

Le ZIP et la sauvegarde chiffrée ont été vérifiés : correspondance clé/certificat, signature privée d’un challenge, déchiffrement et restauration, refus d’une mauvaise clé ou d’un contenu altéré. L’APK a été signé depuis une restauration effective de la sauvegarde chiffrée. **La conservation de copies privées par l’utilisateur n’est pas encore confirmée.** Lui demander de garder deux copies privées, sans lui demander de divulguer les secrets.

## Récupérer, jamais régénérer

Dépendance : `cryptography==46.0.3` (hors Git). Utiliser un fichier de récupération placé dans un emplacement privé, pas son contenu dans une commande ou dans le chat.

```sh
PYTHONPATH=.cache/signing-tools python3 evolution/android/signing-home.py \
  --restore-with-key-file /chemin/prive/recovery-key.txt \
  --restore-to .private/yanis-fitness-evolution-home
```

La cible doit être absente ; le script refuse tout écrasement. Il vérifie l’identité, l’intégrité, le certificat et la capacité de signer. Les fichiers restaurés restent en mode privé. Si le ZIP privé est disponible, il contient ce fichier de récupération et le keystore ; ne pas les copier dans les téléchargements publics.

Sans secret ni ZIP privé, la sauvegarde chiffrée ne suffit pas. Ne pas masquer cette limite, ne pas réinitialiser l’identité et ne pas ouvrir de ticket public contenant des secrets. Cette identité est différente de celles des APK précédents, tous conservés inchangés.
