# Étape 4 — rendez-vous interactifs

**Implémentée et embarquée dans Yanis Fitness Evolution 1.2.0.** [APK et installation](../../downloads/INSTALLATION-1.2.0.md). Les essais sur téléphone restent à faire ; les simulations ne valident pas l’audio réel ni l’installation Android.

## Intégration cumulative et conservation

`build.mjs` part du même APK complet épinglé et appelle l’intégration de l’étape 3. Trois fonctions hôtes seulement sont étendues :

- `t2` : panneau de rendez-vous sur Accueil ;
- `V5` : raccourcis dans Entraînement, sans remplacer ses onglets ;
- `Q5` : nouvelle route de fenêtre `appointment`.

Le moteur de bilan `_g`, les formulaires originaux, le provider, le stockage, la génération de programme, la fin de séance, les minuteurs et les données de l’équipe ne sont pas remplacés. La nouvelle UI partage React, le contexte, les fenêtres et le coordinateur vocal existants. Le titre du document devient **Yanis Fitness Evolution**. Le label Android est changé par la chaîne de livraison, avec **le même package et la même clé que la 1.1.0**.

## Parcours

1. **Avant séance** : énergie 1–5, temps disponible 5–240 minutes, réponse explicite oui/non à la douleur importante ; circonstances facultatives. Identifiant de séance conservé seulement si une séance est réellement en cours, sinon préparation du jour sans liaison inventée à un futur entraînement.
2. **Après séance** : cible exacte `session:<id>` ou `activity:<id>`, date de cette réalisation, effort 1–10, problèmes et douleur. Séances terminées/partielles ou activités cardio, natation, aquatique, HIIT réellement datées ; jamais séances prévues, activités futures, repos, récupération ou activités sans durée. Aucun enregistrement synthétique de séance ni réécriture de ses séries/RPE/durée.
3. **Hebdomadaire** : reprend le constructeur de bilan d’équipe existant et ses contrôles. Une révision dans la même semaine conserve l’identifiant et `previousVersions`. Refus des bilans vides et des dates hors du cycle existant de 52 semaines, sans changer la date de début du programme pour les rendre acceptables.
4. **Mensurations** : au moins une des quinze circonférences reconnues, 1–300 cm. Poids facultatif, 25–350 kg. Une pesée seule ne clôture pas ce rendez-vous ni le rappel. Révision sans doublon de la mesure créée ; le taux de masse grasse éventuellement ajouté dans le formulaire original est conservé. Les photos passent uniquement par le module photo existant, après confirmation et à la demande.

Les trois écrans d’un parcours sont **contexte, réponses, relecture**. Seul le bouton final confirme. Un test couvre le piège React du remplacement d’un bouton « Continuer » par un bouton submit pendant le même clic : clés distinctes et annulation de l’action native empêchent une confirmation involontaire. Entrée pendant la saisie ne saute pas la relecture.

## Persistance et sécurité

- Extension locale `p.appointments` : brouillons avec contexte/étape, rendez-vous confirmés avec réponses, date, lien source et identifiants de bilan/mesure.
- Les brouillons ne sont ni des tâches terminées ni des séances faites. Fermeture, navigation et rechargement ne les valident pas. Ils sont repris ou effacés explicitement depuis Accueil ; une ancienne préparation ne peut être validée après changement de journée ou de séance.
- Bilans et mensurations commencés auparavant peuvent être repris avec leur date explicite d’origine. Aucune actualisation silencieuse en « mesure d’aujourd’hui ».
- Contrôle du profil capturé dans chaque mutation ; changement de profil ferme la fenêtre d’origine. Contrôle de la présence/statut/date de la séance source avant enregistrement. La réussite n’est annoncée qu’après retour de l’enregistrement dans le contexte partagé.
- Une douleur importante confirmée ajoute `painReported: true` aux ressentis du jour concerné, conserve leurs autres valeurs et ne donne aucune autorisation d’allègement. Une réponse « non » ne supprime jamais une alerte antérieure.
- Dates réelles, absence de valeurs futures, limites numériques et textes bornés ; les champs inconnus d’un import ne sont pas injectés dans les formulaires.
- Les rendez-vous confirmés restent conservés ; Accueil affiche les douze derniers avec leurs réponses. Les bilans/mesures restent aussi dans leurs historiques originaux. Les brouillons et rendez-vous suivent le JSON complet des deux profils.
- Aucun appel réseau, microphone automatique, génération de plan, adaptation automatique, photo obligatoire ni diagnostic. L’ouverture annule une lecture/capture précédente ; les signaux des chronos restent gérés par le coordinateur existant. La dictée n’est pas ajoutée aux champs de ces formulaires : elle reste dans JARVIS.

Le namespace additionnel est conservé par le validateur/exporteur complet existant. Il n’exige aucune migration destructive. Les saisies de ce module sont validées avant intégration aux mesures, ressentis et bilans.

## Vérifications de cette livraison

- **19 tests JS propres à cette étape** : 16 scénarios du moteur et 3 contrôles AST/construction déterministe.
- **94 tests JS cumulatifs** réussis (étapes 1–4).
- **60 tests navigateur cumulatifs** réussis sur les fichiers extraits de l’APK final signé : 11 scénarios nouveaux, 4 comparaisons de conservation des 11 rubriques et de leurs onglets en 390/1440 px pour Yanis/Émilie, et les régressions antérieures. Le test export/import utilise les vrais boutons de sauvegarde avec des rendez-vous dans un profil et un brouillon dans l’autre.
- Mode sombre contrôlé visuellement ; vérification automatisée d’un contraste d’au moins 4,5:1 pour les textes de confirmation et les boutons. Les couleurs suivent maintenant les variables de thème de l’application complète.
- **9 tests APK** : notamment nom exact, package/certificat inchangés depuis la 1.1.0 et code de version croissant. Anciennes livraisons inchangées.
- **20 simulations natives** réussies après conversion du DEX final (21 classes, zéro erreur) ; ce n’est pas un test Android.

```sh
node evolution/appointments/build.mjs
TZ=Indian/Reunion node --test evolution/{reminders,voice,spokesperson,appointments}/tests/*.test.mjs
# Servir uniquement le web de l’APK 1.2.0 sur 5177 et celui de la 1.1.0 sur 5175.
LD_LIBRARY_PATH="$PWD/.cache/chromium-libs/lib" CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
  JARVIS-Fitness-Source/node_modules/.bin/playwright test --config evolution/appointments/playwright.config.mjs
```

Le test de conservation masque seulement les nouveaux panneaux `.ja-board` et normalise l’étiquette de version. Il compare tout le reste, y compris les étapes 1–3, au web de la 1.1.0.

**Prochaine étape : 5 — propositions expliquées d’augmentation, maintien ou allègement à partir de séances comparables.** Les décisions, les notifications application fermée et l’IA générale viennent ensuite, dans cet ordre.
