# JARVIS FITNESS AI — audit préalable et architecture

## 1. Sources analysées, sans modification

- `uploads/Transformation_Elite_V2.html` : 9 650 299 octets, 6 577 lignes HTML ; 279 déclarations de fonctions JavaScript, 35 constantes de données extraites, 16 écrans DOM, 140 noms d’exercices dans le programme.
- `uploads/Emilie_transformation_V7.html` : 22 698 996 octets, 7 355 lignes HTML ; 290 déclarations de fonctions JavaScript, 46 constantes de données extraites, 17 écrans DOM, 72 noms d’exercices dans le programme.
- Lecture intégrale des deux fichiers par l’auditeur, parsing de tout le DOM et de tout le script principal avec Acorn ; inventaires détaillés des fonctions, accès à l’état, écrans, champs, boutons et médias dans `audit/`.
- 133 références à des médias embarqués, dédupliquées ; 108 fichiers extraits (GIF/JPEG, y compris les photos source). Les SVG animés et tous les programmes sont conservés dans les données source.
- Les petits scripts Cloudflare ajoutés en fin de fichier ne sont pas des fonctions sportives ; ils ne sont pas réexécutés.
- Les sources ne contiennent pas un historique personnel exporté complet. Émilie contient un profil prérempli ; les historiques se trouvent normalement dans le stockage du navigateur de l’utilisatrice. Ils ne peuvent pas être récupérés d’un autre navigateur sans export.

Inventaires : `audit/elite-functions.md`, `audit/emilie-functions.md`, fichiers `*-dom.json`, `*-function-analysis.json`, `media-manifest.json`. Empreintes SHA-256 dans les inventaires.

## 2. Décision utilisateur

Une application, **deux profils indépendants** : Élite et Émilie. Aucun mélange des performances, photos, mensurations, messages ou préférences. Les propriétés préremplies du fichier Émilie sont identifiées comme données source à vérifier, pas comme nouvelles mesures.

## 3. Fonctions existantes à conserver et destination

| Existant dans les sources | Destination JARVIS |
|---|---|
| Tableau de bord, recommandations, briefing vocal, scanner musculaire | Accueil + JARVIS + carte musculaire interactive |
| Profil, âge, taille, sexe (Émilie), niveau, fréquence, équipement, objectifs | Profil + préférences du programme |
| 12 phases mensuelles et finale (52 semaines), macrocycles, splits et méthodes avancées | Programme → cycles source consultables et activables ; moteur adaptatif distinct |
| Priorité fessiers, moyen fessier et transverse ; rotation des abdominaux | Bibliothèque, cycles Émilie et choix des groupes prioritaires |
| Test 1RM déclaré/estimé, réévaluation à 8 semaines, historique | Progression → Force & 1RM |
| Journal : charge, répétitions, nombre de séries, RPE, RIR, commentaire | Entraînement → journal par série ; import de l’agrégat historique avec provenance |
| Séance terminée, partielle, non réalisée ; historique hebdomadaire | Historique + calendrier modifiable |
| Progression par exercice, double progression, tonnage et volume | Moteur de progression explicable + graphiques |
| Échauffement spécifique, séries d’approche, validation et étirements | Mode séance + Récupération |
| Guides GIF, SVG animés, étapes, respiration, tempo, anatomie | Bibliothèque de mouvements + fiche anatomique |
| Nutrition : métabolisme, calories, macros, phases, ajustement manuel | Nutrition (accès secondaire, sans supprimer le module) |
| Repas par jour, aliments et portions, journal nutritionnel | Nutrition → repas suggérés et journal réel séparés |
| Poids, masse grasse, mensurations J0 et mensuelles | Progression → Corps |
| Photos face/profil/dos/complément, compression, comparateur, jalons | Progression → Photos ; pas de simulation comptée comme résultat |
| Bilans hebdomadaires et mensuels, équipe multi-expertise, impression | Progression → Rapports et export imprimable |
| Objectifs principaux, cibles, objectifs mensuels cochables | Profil → Objectifs |
| Badges, discipline, records, score de transformation | Progression → Records & niveaux ; scores redéfinis sur données réelles |
| Calendrier, jours piscine, choix cardio, séquences combinées | Programme + Cardio & Piscine |
| Six protocoles Pool Lab, chacun avec trois niveaux ; petit bassin 8,5 × 4 m | Cardio & Piscine → protocoles source en base temps |
| Aqua Tabata, six familles Tabata, elliptique, cardio guidé, saisie manuelle | Cardio & Piscine → générateur, chrono et journal |
| Check-in sommeil, fatigue, stress, courbatures, motivation, énergie | Récupération → score documenté et adaptation prudente |
| Minuteurs pause/reprise/saut, bips, durée effective, notes et RPE | Minuteur universel persistant, aucune activité enregistrée implicitement |
| Assistant texte, reconnaissance et synthèse vocales navigateur | JARVIS, capacités détectées et repli texte |
| Sauvegarde automatique, export/import JSON, export HTML avec données (Émilie) | Stockage versionné + export JSON + export HTML de sauvegarde lisible |
| Auto-test, signalement stockage bloqué, navigation mobile | Diagnostic, avertissements et tests unitaires/E2E |

## 4. Défauts ou ambiguïtés identifiés à corriger

1. **Charges entre mouvements** : `CHARGE_RULES`/`CHARGE_FALLBACK` transfèrent des 1RM via des ratios entre machines, haltères, mouvements unilatéraux et barre. Cela donne une fausse précision. Le moteur JARVIS ne déduit une charge que de l’exercice exact et de sa convention de charge ; sinon « Donnée insuffisante ».
2. **1RM** : la formule d’Epley renvoie davantage que la charge pour une seule répétition ; traitement spécifique de 1 rep, valeurs invalides et avertissement sur les séries longues.
3. **Progression** : certaines branches augmentent sur les seules répétitions et l’arrondi peut neutraliser une baisse. La nouvelle décision utilise les séries réellement terminées, le RPE/RIR renseigné, la récupération, le volume récent, l’objectif et l’incrément disponible. Un RPE élevé ne prouve pas une mauvaise technique.
4. **Scores inventés** : plusieurs fonctions utilisent des valeurs par défaut (20, 30, FCM 179, humeur médiane…). Elles ne doivent pas devenir des observations. Les composantes inconnues restent nulles, avec niveau de complétude.
5. **Récupération** : `moyenneRecup(jours)` ignore son argument dans les sources. Les fenêtres temporelles sont explicites.
6. **Volume** : le volume programmé n’est pas le volume effectué. Les graphiques JARVIS ne confondent pas les deux.
7. **Statut** : un exercice au poids du corps peut être réussi sans charge. Les validations portent sur la réalisation, pas sur la présence de kg.
8. **Records** : les badges existants peuvent confondre un premier journal avec un nouveau record ; comparaison avant/après sur le même exercice, sans transférer entre variantes.
9. **Cardio** : deux schémas de données existent (`cardio[date]` et `cardio.seances`). Migration unifiée avec conservation du brut ; éviter le double comptage de la piscine.
10. **Nutrition** : portions arrondies et totaux doivent être recalculés ensemble. Aucun chiffre de dépense ne sera présenté comme une mesure de capteur.
11. **Import** : fusion superficielle et validation insuffisante ; validation de schéma, limites de taille et conservation des anciens champs dans une archive de migration. Aucun script d’un HTML importé n’est exécuté.
12. **Sécurité sportive** : éviter « zéro risque », séances quotidiennes récompensées ou tests maximaux prescrits sans précautions. Les jours de repos participent à la régularité. Douleur : arrêt de l’exercice concerné, pas de diagnostic.
13. **Photos** : le fichier Élite contient des images J0 et une simulation M12. La simulation ne devient jamais une photo de progression réelle.
14. **DOM** : interpolation HTML et gestionnaires inline remplacés par les composants React et l’échappement automatique ; les contenus source ne sont pas utilisés comme code applicatif.

## 5. Architecture conçue avant le développement de l’application

Application React + Vite, ressources locales, pas de CDN nécessaire à l’exécution.

- `src/data/` : données source extraites, bibliothèque normalisée, protocoles et métadonnées.
- `src/engine/` : fonctions pures (1RM, progression, fatigue, programmation, adaptation, statistiques, nutrition, migration, commandes du coach).
- `src/store/` : deux profils, stockage versionné, persistance, validation et export.
- `src/components/` : composants accessibles, graphiques SVG, anatomie, mouvements animés, modales et minuteurs.
- `src/pages/` : Accueil, JARVIS, Entraînement, Programme, Progression, Cardio & Piscine, Récupération, Profil, Nutrition.
- `public/media/` : médias source dédupliqués, chargés seulement à la demande.
- `tests/` : calculs, migration, décisions, programmation et scénarios navigateur.

### Modèle de données

Racine versionnée → profils indépendants → profil/équipement/objectifs, plan daté, séances, séries, activités, check-ins, mesures, photos, tests de force, journal nutritionnel, favoris/refus, messages, journal des adaptations, archives source. Identifiants stables, dates locales `YYYY-MM-DD`, unités explicites, valeurs inconnues nulles.

### Boucle adaptative

Série ou activité validée → persistance → agrégats réels → décision motivée → proposition suivante → modification manuelle possible → nouvelle séance. Les commandes sensibles produisent une proposition confirmable ; une adaptation n’efface pas les séries déjà effectuées. Les séances manquées restent dans l’historique et sont replanifiées sans superposer des séances lourdes.

### IA et voix

Le mode fourni fonctionne **localement avec des règles explicables et une compréhension d’intentions bornée**, sans prétendre être un grand modèle connecté. Il connaît le contexte, modifie le plan et conserve ses adaptations. Les demandes non reconnues sont explicitement signalées. Le modèle de données et un adaptateur d’outils permettront une API IA future côté serveur, sans clé API dans le navigateur. Voix via les capacités natives du navigateur, activable ; pas de promesse de micro sur tous les environnements.

### Nouvelle identité visuelle

Graphite/obsidienne, accent menthe glacée, typographie nette, navigation latérale, panneaux bordés fins, imagerie sportive éditoriale et anneaux de données. Aucun recyclage de la grille orange/bleu et des menus des anciens fichiers. Écran étroit : navigation basse ; écran Fold ouvert : navigation compacte et deux colonnes ; grand écran : navigation + centre + rail d’analyse.

## 6. Ordre de réalisation

Audit → architecture → interface → profils/persistance → bibliothèque → saisie/1RM → progression → commandes adaptatives → séance/timer/voix → cardio/piscine/intervalles → récupération → statistiques/rapports → Fold → tests et documentation des limites.

## Révision demandée : Android, titane et identité Yanis

L’utilisateur a précisé que la dominante verte ne convenait pas, qu’il souhaitait des formes humaines très réalistes plutôt que des silhouettes géométriques, et une application Android reprenant les programmes de ses deux HTML. **Élite désigne Yanis.**

Modifications appliquées :
- Interface graphite/titane avec bleu discret ; remplacement du personnage géométrique et de la carte musculaire polygonale par un atlas humain détaillé et des démonstrations humaines source.
- Profil affiché **Yanis** ; clé technique `elite` conservée pour les données et imports.
- Programmes **source** activés par défaut, au lieu du programme générique JARVIS. Les variantes adaptatives restent un choix explicite.
- Repos nul utilisé pour reconnaître les enchaînements source (trisets/supersets) ; repos de fin de bloc conservé après réduction de séance.
- Enveloppe Android Capacitor, module vocal Java, stockage privé, partage des exports, retour système et retour haptique.
- Sources modulaires et projet Android Studio fournis ; une compilation HTML autonome reste possible pour préserver l’export des anciennes applications.

La vérification exécutée et ses limites figurent dans `VERIFICATION.md`. La réalisation ne prétend ni à un LLM connecté, ni à une modélisation biomécanique 3D complète, ni à un test matériel Samsung qui n’a pas eu lieu.

### Ajustement demandé en 1.0.2

L’utilisateur apprécie le format mais souhaite plus de bleu, une interface moins sombre et retrouver son programme immédiatement. La disposition est conservée ; la palette devient bleu saphir plus lumineuse. L’onglet par défaut de Programme devient **Mon programme**, avec mois, J1/J2/J3, exercices et prescriptions lus directement dans les données source. Le générateur n’est plus présenté comme le passage obligé.

Une séance lancée depuis cette référence conserve ses lignes exactes. Les changements automatiques de matériel/volume ont été retirés de ce parcours ; l’allégement après bilan requiert une autorisation explicite. Les séances en cours, adaptations antérieures et historiques ne sont pas réinitialisés.

### Reprise complète avec le JSON de Yanis (1.0.3)

L’analyse du JSON réel a révélé des manques malgré les inventaires initiaux : journées METCON + piscine, cardio après séance, équipe et avis sauvegardés n’étaient pas suffisamment reliés aux vues. La version 1.0.3 reprend `weekPlan`, `programPos`, les combinaisons du coach source, les huit rôles et les bilans enregistrés. Le calendrier a été comparé aux fonctions des HTML sur 2 184 journées. Le détail de la restauration et des ambiguïtés traitées est consigné dans `AUDIT_RESTAURATION_JSON.md`.
