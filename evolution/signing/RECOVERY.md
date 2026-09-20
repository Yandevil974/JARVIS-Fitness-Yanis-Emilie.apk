# Recherche de la clé de signature — 20 septembre 2026

L’utilisateur a demandé de suspendre l’étape 4 pour traiter la livraison Android, en commençant par la récupération de la clé. **Aucune nouvelle clé n’a été générée, aucun APK n’a été resigné, aucun changement d’identifiant n’a été fait.**

## Identité à conserver

- Application livrée : `app.jarvis.fitness.complete`, version 1.0.6.
- APK : `downloads/JARVIS-Fitness-1.0.6-complet.apk`.
- SHA-256 APK : `7df80180e56c64f6293b2d0c7e40286f57e94e0a812f061344e08c34b2438b82`.
- SHA-256 du certificat public signataire : `5c6af2226164d32ab145c3bedd789e1ed4d30170858122cfaa76bb01c9bd62e7`.

Les deux empreintes ont été reconfirmées : fichier APK et certificat DER extrait du bloc de signature v2. Cette extraction n’est pas une nouvelle vérification cryptographique complète de la signature. La vérification originale par apksigner est documentée dans le correctif 1.0.6.

## Résultat de la recherche

- Aucun fichier candidat trouvé par nom de clé/keystore/signature/mot de passe ou extension usuelle dans les emplacements accessibles sous `/home/user`, `/tmp`, `/opt` et `/mnt` (hors dépendances système/Node et objets Git).
- Aucun fichier candidat dans l’inventaire de `JARVIS-Fitness-Sources.zip`.
- Aucun chemin de clé candidat dans les ajouts de l’historique Git local disponible, ni dans l’arbre courant de `main` interrogé via GitHub. **Le clone est shallow : cette recherche locale ne constitue pas un audit de tout l’historique distant.**
- Aucune variable d’environnement dont le nom indique une configuration de signature Android/JARVIS.
- Aucun workflow run ou artefact Actions retourné pour ce dépôt ; aucun environnement GitHub retourné ; aucun asset attaché à la release `v1.0.6-complet`. L’APK est distribué depuis `downloads/`.
- **Secrets GitHub non vérifiables avec l’autorisation actuelle** : la liste renvoie HTTP 403 « Resource not accessible by integration ». Ne pas interpréter ce refus comme une liste vide. Même avec une autorisation suffisante, l’API GitHub ne restitue pas la valeur d’un secret existant ; un workflow autorisé peut éventuellement l’utiliser sans l’afficher.

Conclusion : **clé non retrouvée dans l’espace accessible**, pas preuve de son absence de toute sauvegarde externe. Le certificat public contenu dans l’APK ne permet pas de reconstituer sa clé privée. La documentation précédente mentionne un keystore privé, mais aucune copie utilisable n’est disponible ici.

## Prochaine décision

Vérifier auprès de l’utilisateur l’existence d’une copie privée du keystore (par exemple `.p12` ou `.jks`), d’un ancien espace de construction récupérable, ou de secrets de signature déjà configurés. Ne demander ni contenu de clé ni mot de passe dans le chat, et ne rien déposer dans ce dépôt public.

Si une copie est retrouvée, la tester dans un emplacement privé non servi, sans afficher de secrets, puis vérifier que son certificat correspond à l’empreinte ci-dessus avant toute signature. Prévoir une sauvegarde privée durable et vérifiée ; `.cache` et `/tmp` ne sont pas une conservation durable.

Si aucune copie n’est récupérable, expliquer le blocage d’une mise à jour directe de la 1.0.6 et obtenir une décision explicite sur une migration conservant les données. Ne pas générer silencieusement une nouvelle identité de signature, ni demander de désinstaller l’application actuelle.

L’intégration DEX du module vocal et les essais Android restent nécessaires indépendamment de la récupération de la clé.
