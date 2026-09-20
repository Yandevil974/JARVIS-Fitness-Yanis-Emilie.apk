# Étape 1 — rappels et échéances fiables

**Statut : code web intégré, aperçu fonctionnel, tests réussis. Livraison APK bloquée par la continuité de signature ; aucun changement à l’application déjà installée.**

## Fonctionnement

L’accueil présente **tous** les suivis activés : mensurations, bilan de force, bilan hebdomadaire d’équipe et photos facultatives. Chaque carte présente son état, la dernière date fiable, l’échéance, une explication et les actions de saisie/navigation et de report.

- **Poids ≠ mensurations.** Les 15 champs de tours corporels de l’application complète, y compris les fessiers, sont reconnus. Une pesée ou un taux de masse grasse seul ne valide pas ce suivi.
- Cadence mensuelle par défaut depuis le dernier relevé réel ; choix alternatif de 28 jours. Un mois calendaire est ajouté avec plafonnement au dernier jour du mois. La date manquée **ne saute jamais** automatiquement au mois suivant.
- Exemple vérifié sur une copie du fichier fourni : mensurations du 10 août → échéance du **10 septembre**, même avec une pesée le 4 septembre et une ouverture en octobre. Ce fichier est une fixture de test, pas une lecture de l’état actuel du téléphone.
- Bilan de force : préférence existante `forceRevalWeeks` partagée avec la rubrique 1RM, 8 semaines par défaut. Le rappel n’impose pas un test maximal.
- Bilan d’équipe : 7 jours après le dernier bilan enregistré. Ouvrir le formulaire ou lire un conseil ne le valide pas.
- Photos : désactivées par défaut, activation facultative. Les simulations et les photos sans date fiable ne décalent pas le suivi.
- Données futures, dates impossibles et entrées `needsDate` ne créent pas de faux repères. Sans mensuration datée, l’action peut ouvrir le relevé existant pour en confirmer la date réelle.
- **Reporter** conserve la carte et l’échéance initiale. Date choisie strictement après aujourd’hui et l’échéance, au plus 90 jours après aujourd’hui. Retour automatique à cette date, possibilité d’annuler le report.
- Une nouvelle saisie correspondante crée le cycle suivant ; elle n’hérite pas du report du cycle précédent.
- **Yanis et Émilie restent indépendants.** Les paramètres/reports sont enregistrés dans `profile.followUp`, et suivent la sauvegarde JSON et le rechargement normal de l’application.
- La cloche reçoit une entrée par échéance due. Lire les notifications ne termine jamais les tâches. Un report met l’alerte en lecture ; à expiration elle redevient non lue, sans créer une nouvelle entrée à chaque rendu.
- Les rappels sont calculés localement à l’ouverture, au retour au premier plan et au changement de jour. **Pas encore de notifications Android application fermée** : étape 7.
- Aucun programme, séance, mesure ou bilan existant n’est modifié par le moteur de rappels.

## Intégration conservatrice

`build.mjs` exige l’APK de référence épinglé par `complete-hotfix/manifest.json`, extrait ses assets, applique d’abord les **sept correctifs historiques de chrono/bordure d’erreur/version**, puis intègre le nouveau module :

- `t2` : tableau de suivi sur l’accueil ; remplacement de l’ancienne carte de force en doublon.
- `N5` : retrait des anciens rappels de suivi au calendrier glissant ; maintien des autres alertes, notamment douleur/récupération/coaching.
- `G3` : retrait du seul ancien émetteur de notification force ; maintien des rappels de séance et rapports hebdomadaires automatiques.
- `I3` : observateur des échéances du profil actif.
- `Q5` : bouton d’accès au suivi depuis la cloche.

Le module réutilise **le React, le contexte, les formulaires et la persistance de l’application complète**. Pas de deuxième magasin de données. CSS préfixé `jf-`, thèmes clair/sombre et disposition mobile.

Le navigateur est servi depuis le seul répertoire extrait, jamais depuis la racine du dépôt. Les sauvegardes personnelles de test ne sont ni copiées dans les assets ni embarquées dans un nouvel APK.

### Conservation vérifiée

- Même inventaire web : **272 fichiers, zéro ajouté, zéro retiré ; seul le bundle JS change**.
- **271 fichiers web identiques** octet pour octet : images, styles d’origine, polices, plugins, HTML.
- **523 déclarations de la 1.0.6 identiques**, cinq fonctions hôtes modifiées ci-dessus ; nouvelle extension ajoutée avant le montage React. Le code natif n’est pas modifié.
- Empreinte du bundle de cette étape : `3b093d27174c6d3f3b3d1392a930f14993e6b317c22250df449ad023cf4dc2fd`.
- Aucun remplacement de `downloads/JARVIS-Fitness-1.0.6-complet.apk` et aucune modification de ses sommes de contrôle.

## Tests exécutés

**58 tests propres à la validation de cette étape, tous réussis :**

- **22 tests moteur** : séparation poids/tours corporels, dates, fins de mois/années bissextiles, échéances persistantes, force/photos/bilans, reports/expiration/annulation, nouvelles saisies, profils, import malformé, notifications idempotentes, non-mutation et conservation JSON. Également exécutés avec `TZ=Indian/Reunion` et `TZ=Europe/Paris`.
- **5 tests d’intégration** : hash de référence obligatoire, build déterministe, inventaire conservé, sept anciens correctifs présents, contrôle AST des seuls points de raccordement.
- **31 tests navigateur** : 14 nouveaux tests/comparaisons plus 17 régressions existantes. Comparaison des 11 écrans et de tous leurs onglets pour chaque profil à 390 et 1440 px, sauf la seule zone de rappels volontairement remplacée. Saisies réelles de poids et mensurations, formulaire hebdomadaire, liens force/photos, report puis retour à échéance, lecture de cloche, changement de profil, export/réimport JSON, alertes douleur conservées, réglages mobile clair/sombre. Les chronos, images d’échauffement, annonces simulées, bilans de force et autres fonctions complètes sont toujours couverts.

Les **5 tests JS et 5 tests Python historiques** ont aussi été relancés avec succès. Ils vérifient le correctif 1.0.6 et les outils binaires, pas la signature d’un nouvel APK.

**Limites :** tests Chromium, pas de téléphone Android physique. Pas de nouveau test vocal natif, pas de nouvelle signature, ni d’installation Android. L’aperçu conserve l’indication historique V 1.0.6 ; ce n’est pas une nouvelle livraison de cet APK.

## Reproduction

Depuis la racine du dépôt :

```sh
npm ci --prefix JARVIS-Fitness-Source
mkdir -p .cache/reference
# Seulement si le fichier de référence n’est pas déjà présent :
gh api 'repos/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/contents/JARVIS-Fitness.apk?ref=84e2986da2f004d4eae81e52a9a41e7b69e80f8d' \
  -H 'Accept: application/vnd.github.raw+json' > .cache/reference/base.apk
node evolution/reminders/build.mjs
# Sortie : .cache/reminders-web ; rapport : .cache/reminders-build-report.json
```

Extraire aussi `assets/public/` de cet APK dans `.cache/reference/assets/public` pour les comparaisons (aucun correctif appliqué à cette copie). Exemple :

```sh
python3 - <<'PY'
from pathlib import Path
import zipfile
with zipfile.ZipFile('.cache/reference/base.apk') as z:
    for name in z.namelist():
        if name.startswith('assets/public/') and not name.endswith('/'):
            target = Path('.cache/reference') / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(z.read(name))
PY
TZ=Indian/Reunion node --test evolution/reminders/tests/*.test.mjs
```

Servir `.cache/reminders-web` sur le port 5175 et `.cache/reference/assets/public` sur 5176 (serveurs persistants séparés, `python3 -m http.server PORT --bind 0.0.0.0 --directory CHEMIN`). Puis :

```sh
# Installer le navigateur de test si nécessaire :
JARVIS-Fitness-Source/node_modules/.bin/playwright install chromium
JARVIS-Fitness-Source/node_modules/.bin/playwright test \
  --config evolution/reminders/playwright.config.mjs
```

Variables optionnelles : `COMPLETE_BASE_WEB`, `REMINDERS_WEB` pour les tests d’intégration ; `COMPLETE_URL`, `COMPLETE_REFERENCE_URL`, `CHROMIUM_EXECUTABLE_PATH` pour les tests navigateur.

Dans ce sandbox, le téléchargement Playwright standard n’était pas disponible lors des travaux précédents. Chromium fourni par `@sparticuz/chromium` a été utilisé avec son exécutable et ses bibliothèques AL2023 (`LD_LIBRARY_PATH`) ; ces outils restent hors Git.

## Suite

**Étape 2 : voix et microphone Android**, puis le reste du [plan validé](../README.md). L’IA conversationnelle générale reste explicitement pour la fin. Le blocage de signature doit être résolu avant une nouvelle livraison APK.
