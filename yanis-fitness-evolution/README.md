# Yanis Fitness Evolution

Réplica fidèle puis évolution autonome de JARVIS Fitness 1.5.0, dans une
application séparée (nouvel identifiant, nouveau magasin de données, propre
chaîne de build). L’application d’origine n’est ni lue en écriture, ni
modifiée, ni remplacée.

## Ce qui est porté de la 1.5.0 (vérifié contre le bundle de référence)

- **Bilan de force 1RM** : page dédiée, protocoles, charges calculées,
  réévaluation programmée par le coach, rappels tableau de bord et
  notification système dédiée (`force-reval-*`).
- **Capteurs cardio** : Web Bluetooth direct (service 0x180D), Polar / Garmin
  / Wahoo / Decathlon, zones Tanaka, batterie, intervalles RR, encadré Galaxy
  Watch (« Heart for Bluetooth »), aucune donnée inventée.
- **Notifications système** : flux de permission exact, icône/badge,
  notification de test, rappels de séance et rapports hebdomadaires.
- **Coach JARVIS** : interpréteur de commandes complet, replanification,
  findings dashboard (« À l’écoute de votre corps »), réponses d’équipe,
  suivi des douleurs et mensurations, historique `dismissedFindings`.
- **Minuteur & voix** : observer du minuteur flottant, jalons [60-30-15-10-5-3-2-1],
  compte à rebours d’étape [5-3-2-1], annonces de fin par type, file
  d’annonces anti-répétition par minuteur (pause, prolongation, double
  minuteur testés unitairement).
- **Échauffement / refroidissement** : images par étape, guide contextuel
  (piscine ≠ vélo), bandeau « Repos hors séquence », rappel cooldown.
- **Menu profil en tête d’écran**, séparation stricte Yanis / Émilie.
- **Zoom images** : toutes les animations et photos ouvrent une visionneuse ;
  chaque animation reste explicitement associée à son exercice (aucune
  substitution inter-domaine, jamais).
- **Direction visuelle V1** : page « Visuels » avec exemples homme/femme au
  visage créé, comparaison GIF/MP4 pour des élévations latérales sur banc incliné, choix mémorisé dans
  `preferences.visualStyle` / `preferences.visualFormat`, et export ZIP
  téléchargeable (`public/visuals/jarvis-visual-preview.zip`). Les animations
  humaines créées affichent désormais un visage cohérent avec le personnage.
- **Entraînements, programme HTML conservé, Progression, Cardio & piscine,
  Récupération, Nutrition, Mon équipe** avec lecture chiffrée des photos de
  progression.

## Corrections apportées par rapport à la 1.5.0

- Export « HTML autonome » : `runtime.css` est régénéré au build (1.0.4
  l’avait figé, 1.5.0 ne livrait ni runtime.js, ni runtime.css, ni
  media-index → l’export échouait sur téléphone).
- Correctif du diviseur d’anneau du compte à rebours (étapes courtes).
- Aucun import d’animation d’un autre domaine quand une animation manque :
  un visuel cohérent est généré et rattaché à l’exercice.

## Démarrage

```bash
npm ci
npm run dev            # http://localhost:5173
npm test               # moteur + stockage + import + minuteur
npm run build          # release/ prêt pour Capacitor
```

Voir `android/BUILD.md` pour la génération d’APK.

## Données

Import depuis Profil → Données & sauvegardes (JSON/HTML de l’ancienne
application ou export WhatsApp `DOC-*.json`, schemaVersion 3). L’ancienne clé
`jarvis_fitness_v3` est adoptée en lecture seule au premier lancement si le
nouveau magasin est vide ; elle n’est jamais écrite ni effacée.
