# Reprise du HTML et de la sauvegarde de Yanis — version 1.0.3

## Source personnelle

Fichier original : `transformation_12_mois_sauvegarde.json`, **538 927 octets**.
SHA-256 : `40cf13416048e403223b1a2139d0ae024ea1894b0e877c6475ee569b5249eb7b`.

Le fichier original n’a pas été modifié. La copie brute est conservée dans le profil restauré ; elle n’est jamais exécutée comme du code.

| Champ du JSON | Reprise dans JARVIS |
|---|---|
| `profil` | Nom Yanis, date de départ du 10 août 2026, niveau « confirmé », expérience, paramètres physiques et objectif conservés. |
| `poids`, `mg` | 9 pesées et 3 entrées de masse grasse, avec leurs dates originales. |
| `mensurations` | Relevé J0 et relevé M1 conservés. La date non fournie du relevé mensuel n’est pas inventée. |
| `journal`, `seances` | 16 journées : 12 journaux musculaires (11 validés, 1 non effectué), 4 déclarations complémentaires (3 réalisées, 1 non effectuée). |
| Lignes d’exercices | 102 lignes, **387 séries renseignées** : 350 rattachées à des jours déclarés réalisés, 37 à une séance non effectuée. Les 80 séries dont les répétitions sont vides restent incomplètes. |
| Charges, reps, séries, RIR, RPE, notes | Valeurs conservées ligne par ligne, y compris celles d’une séance non effectuée. Aucun 1RM ni tonnage n’est calculé à partir de répétitions absentes. |
| `journal.prep` | Échauffement et étirements cochés conservés. |
| `recup` | 15 bilans et leurs sept composantes. La formule source n’utilise pas de valeurs fictives quand des composantes manquent. |
| `force` | 10 références déclarées, date du bilan, fréquence de réévaluation et données source conservées. Convention à vérifier avant réemploi automatique. |
| `hebdo` | 3 bilans : ressentis, difficultés, questions et **10 retours historiques** importés textuellement dans Mon équipe → Retours enregistrés. |
| `photos` | 4 photos J0 importées ; 4 images M12 reconnues comme les simulations intégrées au HTML, clairement distinguées de photos de résultats. |
| `objectifsMensuels` | 10 objectifs avec état et commentaire de progression source conservés. |
| `nutri` | Paramètres et formule de calcul du HTML Élite conservés ; aucun repas consommé n’est inventé puisque le journal est vide. |
| `cardio`, `natation`, `tabata` | Les listes de résultats détaillés sont vides dans le JSON. Les journées cochées ne deviennent pas artificiellement des minutes, kilomètres ou rounds réalisés. |
| `badges`, `badgesNouveaux`, `bilanVu`, `ui`, `stats`, `stretchSuivi` | Conservés comme données source ; les dates techniques ne sont pas converties en dates de performance. |

## Différences réellement corrigées par rapport aux versions précédentes

### Calendrier

La fonction `weekPlan` du HTML a été reprise et comparée automatiquement pour **364 jours × 3 disponibilités × 2 profils = 2 184 journées**.

- Pour Yanis, une disponibilité de 4 jours ne signifie pas systématiquement 4 séances musculaires. Les phases d’accumulation à 3 séances utilisent lundi, mardi et jeudi ; le groupe tourne d’une semaine à l’autre. Les phases à 4 séances utilisent aussi le vendredi.
- Les journées METCON se trouvent sur les jours complémentaires, avec les blocs **elliptique puis piscine**, et une transition de 5 minutes comme dans le coach du HTML.
- Chaque quatrième semaine et la finale sont allégées dans `programPos`, même si le booléen statique de la phase pouvait laisser croire autre chose. La semaine du 31 août au 6 septembre est donc sans METCON intense, conformément au fichier.
- Pour Émilie, la séquence J1/J2/J3/J4 reste fixe à 4 séances ; J5 n’est pas ajouté à la rotation sauf disponibilité de 5 séances. Le cardio après musculation et les jours piscine sont réintégrés.
- Les dates historiques et séances manquées ne disparaissent pas après génération d’un nouveau calendrier.

### Historique et programme

Le JSON contient des exercices de « Bras & épaules » les 1er et 3 septembre, alors que le calendrier annonçait d’autres groupes. Le HTML ouvrait systématiquement J1 lorsque le bouton était utilisé en semaine de deload sans clé explicite. **Ces saisies ont été conservées sous leurs vrais exercices**, sans transférer les charges à des jambes ou à des pectoraux. Le nouveau lancement respecte la séance choisie dans le calendrier.

La référence mensuelle reste intacte. L’allégement planifié appartient au programme source ; les adaptations supplémentaires de JARVIS restent explicites. Les retours de bilan ne modifient pas automatiquement le programme, notamment lorsque la demande enregistrée est de le conserver.

### Équipe

Les huit rôles de chaque HTML sont visibles. Leurs descriptions sont issues du fichier ; les conseils actuels sont locaux et explicables. Les dix retours historiques sont distincts de nouveaux conseils. L’interface indique qu’il s’agit d’une **équipe virtuelle**, pas de professionnels effectivement consultés.

### Protection lors de la restauration

- Sur un profil Yanis vide : la sauvegarde native jointe peut être reprise automatiquement.
- Si des données existent déjà : un aperçu et une confirmation sont demandés ; une exportation préalable de l’état courant est proposée par le flux de restauration.
- Les données d’Émilie ne sont pas remplacées.
- Les saisies locales plus récentes sont conservées ; les doublons de la même sauvegarde sont empêchés par un reçu d’import.
- Les originales restent consultables dans Entraînement → Journal du fichier, même lorsqu’un conflit impose de garder une saisie locale.

## Limites assumées

Certaines anciennes règles produisaient de faux constats (« sommeil perturbé » à partir du seul mot « sommeil », record estimé présenté trop vite, récupération médiane inventée). Les textes historiques restent visibles comme archives, mais ces comportements ne sont pas reproduits comme diagnostics ou nouvelles performances. Les rapports restent des aides logicielles, pas des avis médicaux.

Les tests de l’interface sont exécutés dans Chromium. L’APK est compilé et signé, mais le fonctionnement matériel de la voix et du partage doit encore être validé sur les téléphones.
