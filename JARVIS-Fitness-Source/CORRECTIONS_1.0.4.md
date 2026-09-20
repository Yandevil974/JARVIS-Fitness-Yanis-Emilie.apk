# JARVIS Fitness 1.0.4 — fiabilité et corrections

Les programmes HTML, la sauvegarde personnelle de Yanis, les données d’Émilie et le thème multicolore sont conservés. Cette version corrige les opérations de suivi ; elle ne remplace pas vos programmes.

## Calendrier et blocs liés

- Déplacer une séance déplace aussi ses blocs cardio/piscine encore planifiés.
- Un changement d’horaire conserve le décalage entre les blocs, y compris après minuit.
- Le déplacement est refusé si un bloc possède déjà un résultat, s’il est en cours ou si un jour cible est occupé.
- Un METCON déplacé sur un jour normalement consacré au repos garde ses deux blocs : il ne se transforme plus automatiquement en récupération aquatique.
- Le report d’une séance manquée conserve l’ancien groupe et crée de nouveaux identifiants liés pour le report.
- Retirer une séance planifiée retire ses blocs planifiés ; retirer uniquement un bloc après séance ne supprime pas la musculation.
- Les exercices et protocoles ne sont pas régénérés à l’occasion d’un simple déplacement.

**Accès :** ouvrir une journée → ouvrir le bloc → **Déplacer la séance et ses blocs**. Pour une séance de musculation, le bouton **Modifier** reste disponible.

## Photos importées

**Progression → Photos → crayon** permet de corriger la date, la vue, le titre et la note, sans modifier le fichier image. Une date inconnue peut rester vide. Les simulations M12 reconnues dans la source ne peuvent pas être transformées en résultats réels par changement d’étiquette.

## Bilans d’équipe

Un bilan antidaté est maintenant associé à la semaine correspondant à sa date. Une correction conserve sa version précédente, consultable dans **Mon équipe → Retours enregistrés**. Les bilans importés du HTML restent séparés des nouveaux bilans JARVIS.

## Sauvegardes et confidentialité

- Le nouvel état est validé avant écriture ; un état invalide ne peut plus écraser la dernière sauvegarde valide, même à la fermeture.
- Une corruption survenue dans le stockage pendant la session est conservée en quarantaine.
- Le bouton Retour Android ne ferme pas volontairement l’application si la sauvegarde demandée échoue.
- L’aperçu web refuse l’accès par URL aux sauvegardes privées, aux clés de signature et aux assets Android personnels. Les fonctions normales et médias publics de l’app restent accessibles.
- Les compilations Android ne provoquent plus de rechargement intempestif de l’aperçu web.

## Qualité des données

Les répétitions inconnues ne deviennent pas un record de zéro répétition. Un groupe de plusieurs séries importées n’est pas présenté comme un record de tonnage d’une seule série.

## Vérifications

- **85 tests métier/stockage réussis**.
- **27 parcours d’interface réussis**, plus **1 test d’accès web privé réussi**.
- Compilation Android 1.0.4 (code 5) réussie après réduction de la mémoire de compilation et exécution séquentielle.
- Les premiers essais simultanés ont saturé l’environnement ; les résultats retenus sont ceux des vérifications relancées séparément.

La voix, le partage de fichiers et les interactions matérielles restent à valider sur les téléphones physiques. L’APK reste une version de test, non publiée sur Google Play.
