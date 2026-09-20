# Étape 7 reconstruite — rappels Android application fermée

## État de cette reconstruction

Les travaux non publiés de la précédente session n’ont pas été retrouvés. Cette implémentation est une **nouvelle reconstruction**, ajoutée cumulativement aux sources conservées des étapes 1–6, sans reconstruire l’interface historique incomplète. L’utilisateur a autorisé une nouvelle application parallèle le 20 septembre 2026.

Un APK 1.3.0 de validation est construit et signé avec `app.yanis.fitness.evolution`, nom **Yanis Fitness Evolution**. Sa publication attend la fin des contrôles navigateur. Les anciennes applications, leurs APK et leurs identités restent inchangés. L’IA conversationnelle n’est pas ajoutée.

## Fonctionnement

- Depuis Accueil : **Rappels Android**. Le réglage de Mon profil dirige aussi vers ces contrôles sur Android, au lieu d’afficher un interrupteur navigateur sans effet.
- Deux actions distinctes : autoriser Android, puis activer explicitement chaque profil sur ce téléphone. Aucun consentement importé depuis le JSON ; les nouveaux profils restent désactivés. `allowBackup=false` conservé dans le manifeste.
- Notification de test volontaire, sans activation de profil ni modification d’un bilan. Bouton des paramètres Android pour un refus ou un canal bloqué.
- Programmation locale et hors connexion : séances prévues environ 30 minutes avant, bilans à 18 h. Une date/heure explicite invalide ne reçoit pas une heure inventée. Une séance commencée (`planId`), terminée ou partielle annule son ancien rappel.
- Les reports, suppressions et nouvelles saisies réconcilient les tâches ; lire une notification ne termine rien. Une tâche sans date reçoit un premier rappel à programmer, sans inventer la date du bilan.
- Plan minimal capturé synchroniquement, avant hachage asynchrone : pas de copie des photos ou de tout le magasin. Payload natif limité à 128 entrées / 90 jours ; uniquement profil, clé hachée SHA-256, date/minute et expiration. Les identifiants de tâches initiales restent stables entre jours.
- Un seul écrivain côté web ; token de session natif et révisions croissantes rejettent les mises à jour périmées. Échecs affichés et nouvelles tentatives possibles. Les snapshots inchangés ne réécrivent pas continuellement le plan.
- Consentement, plan et tentatives déjà effectuées conservés dans des préférences privées Android. Un seul `setAndAllowWhileIdle` inexact pour le prochain passage, aucune permission d’alarme exacte, aucun service réseau/réveil ajouté.
- Receiver non exporté pour redémarrage, changement d’heure/fuseau et remplacement du package. Reprogrammation après déverrouillage ; aucune livraison tardive après expiration d’une séance. Expiration des bilans à deux jours, conservation des identités déjà tentées pour les tâches actives, historique ancien borné à 512 clés avec purge hors plan après 90 jours.
- Déduplication enregistrée **avant** l’appel d’affichage : une tentative n’est pas une preuve que la personne a vu la notification. Une défaillance d’affichage après cette écriture peut supprimer une alerte plutôt que la répéter.
- Canal privé et contenu générique : « Un point t’attend dans ton suivi. » Aucun nom, mensuration, douleur, photo ou exercice. Icône système monochrome ; disparition automatique à expiration. Le test disparaît après une minute.
- Ouvrir les contrôles Android arrête la lecture/dictée et rejette les fins de lecture tardives. L’ancien émetteur navigateur est désactivé sur Android seulement ; l’historique de notifications et les rapports locaux sont conservés.

## Intégration native et fidélité

Trois nouvelles classes Java, compilées explicitement en **UTF-8** contre API 34 et les signatures du véritable hôte. Un test de texte français a détecté puis fait corriger l’encodage ASCII implicite du compilateur ; la compilation vocale utilise désormais aussi UTF-8.

Les trois classes sont ajoutées au DEX contenant déjà le plugin vocal ; `MainActivity` ne change que pour enregistrer le nouveau plugin. `JarvisBackupPlugin` reste byte-identique au niveau smali. Annotation Capacitor, callback de permission et nom du plugin contrôlés dans le DEX final. 4 971 classes uniques ; huit DEX inchangés, 271 fichiers web inchangés. Ressources, identifiants et inventaire ZIP conservés. Le manifeste reçoit uniquement les deux permissions `POST_NOTIFICATIONS` / `RECEIVE_BOOT_COMPLETED` et le receiver privé, en plus de l’identité/version autorisées.

## Contrôles

- 176 tests Node cumulatifs réussis.
- 25 scénarios natifs de notifications et 20 de voix réussis avec services Android **simulés**, sur les classes API-compilées et le DEX final reconverti vers la JVM.
- 8 contrôles du nouvel APK signé ; 9 contrôles publics des APK historiques ; 13 contrôles de sauvegarde/signature ; 5 contrôles de ressources réussis. Un contrôle distinct de l’ancienne archive privée est explicitement ignoré car celle-ci demeure absente — la nouvelle signature ne la remplace pas dans ce test.
- Vérifications navigateur cumulatives en cours sur le web extrait de l’APK signé.

**Aucun téléphone ni émulateur utilisé.** Les permissions réelles, la réception écran verrouillé, Doze/économie d’énergie/OEM, le redémarrage et le son/micro doivent être essayés sur l’appareil. Après « Forcer l’arrêt », l’utilisateur doit rouvrir l’application ; Android peut retarder les alertes. Aucun fonctionnement à heure exacte garanti.

## Reproduire

Préparer les dépendances épinglées et la base complète comme indiqué dans `../voice/README.md` et `../android/README.md`, puis :

```sh
node evolution/voice/compile-native.mjs
node evolution/notifications/compile-native.mjs
node evolution/notifications/build.mjs
# Vérifier le hash web public dans release-next.json ; ne pas régénérer l’identité.
python3 evolution/android/build.py --new-parallel
PYTHONPATH=.cache/signing-tools python3 -m unittest discover -s evolution/android/tests -p 'test_*.py' -v
COMPLETE_BASE_APK="$PWD/.cache/reference/base.apk" python3 -m unittest discover -s complete-hotfix/tests -p test_apk_binary.py -v
```

Les simulations du scheduler utilisent les sources JSON-java au commit `f9b5587c87aaf02e4a5ed1991d48d6c05993624a`, archive SHA-256 `64c481f11f667252bd02dc13a0b8ed13ab6b2b7ab99466c0dcf69fd1a57b6e3d`. Elles ne sont pas embarquées. `python3 evolution/notifications/tests/native-scheduler.py` exécute les classes compilées ; `NOTIFICATIONS_HOST_CLASSES` permet de viser le JAR reconverti depuis le DEX final. Même principe avec `NATIVE_HOST_CLASSES` pour les tests vocaux.

Pour le navigateur : extraire seulement `assets/public/` du candidat signé vers `.cache/notifications-web`, servir ce dossier sur 5180 et `.cache/decisions-web` sur 5179. Ne jamais servir la racine du dépôt ni `.private`. `playwright.config.mjs` compare les 11 rubriques et leurs onglets aux étapes 1–6, dans les deux profils et deux largeurs ; seuls le nouveau panneau et les changements explicites de texte/version sont normalisés.

**Prochaine étape : terminer les contrôles, publier le véritable APK complet et laisser l’utilisateur le tester avant l’IA.**
