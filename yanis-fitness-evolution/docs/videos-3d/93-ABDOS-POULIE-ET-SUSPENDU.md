# Abdos : références et prompts — crunch à la poulie, relevés suspendus

**Mise à jour du 22/10/2026 : les deux vidéos ont été déposées et intégrées.** Le crunch sert aux deux fiches, les relevés à la leur : l'audit passe à 153 fiches musculation avec vidéo sur 203. Les prompts restent ci-dessous pour mémoire, et les réserves sont portées par la fiche et par la voix.

Deux vidéos à générer pour quatre fiches. Les images de référence sont ci-dessous, avec leurs liens de téléchargement et leurs réserves. Les prompts sont prêts à copier tels quels.

Personnage demandé dans les deux cas : l'athlète habituel, argenté à musculature apparente, casquette noire, short noir, baskets blanches, même salle claire au sol gris. Aucune génération vidéo n'a encore été lancée.

---

## 1. Crunch à la poulie

**Fichier** : `abs-crunch-poulie-v1.jpg`
**Télécharger** : https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/d5055a9/yanis-fitness-evolution/docs/videos-3d/abs-crunch-poulie-v1.jpg
**Voir et zoomer** : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/d5055a9/yanis-fitness-evolution/docs/videos-3d/abs-crunch-poulie-v1.jpg

Couvre les fiches « Crunch à la poulie » et « Crunch à la poulie (ou au sol) ».

**Ce que montre l'image** : agenouillé sur un tapis face à la colonne, corde tenue derrière la tête, buste enroulé, abdominaux rouge-orangé, corps entier.

**Réserves** : la corde arrive très haut près de la casquette et la prise des mains est peu lisible ; on ne distingue pas nettement que le bassin reste au-dessus des talons.

**Prompt à copier :**

```
Vidéo anatomique 3D réaliste, une répétition complète de crunch à la poulie haute.
Personnage identique aux autres vidéos : athlète argenté à musculature apparente, casquette noire, short noir, baskets blanches, même salle claire au sol gris.
Caméra fixe, trois quarts de face, sans zoom ni changement de plan. Le corps entier reste dans le cadre du début à la fin : tête, casquette, deux mains, deux coudes, genoux et pieds visibles.
Position : agenouillé sur un tapis devant la colonne à poulie, bassin au-dessus des genoux, pas assis sur les talons. Les deux mains tiennent la corde derrière la tête, coudes vers l'avant, câble tendu vers la poulie haute.
Mouvement : enrouler le buste vers le bassin en expirant, coudes rapprochés, sans tirer avec les bras ni plier les hanches ; s'arrêter dans une amplitude confortable ; revenir lentement à la position de départ sans relâcher la tension. Aucun élan, aucun balancement du bassin, aucune traction des bras.
Coloration : abdominaux en rouge-orangé lumineux, comme les autres vidéos de l'application ; pas de rouge sur les bras, les épaules ou les cuisses.
Aucun texte, aucune flèche, aucun membre supplémentaire, aucun collage, aucun saut de boucle.
```

---

## 2. Relevés de jambes suspendu

**Fichier** : `abs-releves-jambes-suspendu-v2.jpg`
**Télécharger** : https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/d5055a9/yanis-fitness-evolution/docs/videos-3d/abs-releves-jambes-suspendu-v2.jpg
**Voir et zoomer** : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/d5055a9/yanis-fitness-evolution/docs/videos-3d/abs-releves-jambes-suspendu-v2.jpg

Couvre la fiche « Relevés de jambes suspendu ».

**Ce que montre l'image** : suspendu à une barre de traction fixée entre deux montants verticaux aux pieds au sol, jambes remontées ensemble devant, abdominaux rouge-orangé.

**Réserves** : le haut des montants et la traverse de liaison sortent du cadre, la fixation complète au-dessus de la barre n'est pas vérifiable ; le bassin est déjà en position haute et la tête reste proche de la barre.

**Prompt à copier :**

```
Vidéo anatomique 3D réaliste, une répétition complète de relevés de jambes suspendu.
Personnage identique aux autres vidéos : athlète argenté à musculature apparente, casquette noire, short noir, baskets blanches, même salle claire au sol gris.
Caméra fixe, trois quarts de côté, sans zoom ni changement de plan. La barre, les deux mains, la tête et les deux chaussures restent visibles à chaque image.
Matériel : barre de traction solidement fixée entre deux montants verticaux d'une station, pieds des montants au sol et raccords visibles de chaque côté. La barre ne doit jamais flotter dans le vide ni sembler suspendue sans support.
Mouvement : suspendu à la barre, prise en pronation, bras tendus, épaules légèrement engagées, corps allongé sans balancer. Départ jambes tendues vers le sol, puis remonter ensemble les deux jambes devant jusqu'à hauteur de hanche ou un peu plus haut selon une amplitude confortable, genoux légèrement souples, sans élan. Redescendre lentement jusqu'à la position jambes tendues, sans laisser le corps se balancer.
Ne pas montrer de balancier, de jambes alternées, de pause en haut avec rebond, ni de saut de boucle.
Coloration : abdominaux en rouge-orangé lumineux ; pas de rouge sur les bras, les épaules ou les cuisses.
Aucun texte, aucune flèche, aucun membre supplémentaire, aucun collage.
```

---

## Intégration du 22/10/2026

| Fiche(s) | Source | Empreinte SHA-256 |
| --- | --- | --- |
| Crunch à la poulie + variante au sol | `1795093830394.mp4` | `f6821d2afe880816da71949ef2161999c16ef97d259e3bb23200b17ca48967af` |
| Relevés de jambes suspendu | `1795094147317.mp4` | `f739ea0f5ee183e89f04372e4e7e56c42e40c1e4366873a00a359240653b8750` |

640×360, 121 images à 24 images par seconde, 13 images contrôlées par clip. Copies intactes dans `public/videos` et `release/videos`, affiches extraites de la première image, `coached` et `avoidSilentPreview`, GIF et prescriptions conservés.

Réserves constatées à l'inspection :

- **Crunch** : la corde est tenue très haut, contre la casquette, et la prise des mains est peu lisible ; le contact avec la nuque est approximatif. La variante au sol n'est pas démontrée.
- **Relevés suspendus** : la barre se raccorde à des montants qui sortent du cadre, la fixation complète n'est pas vérifiable. Le bassin reste haut sur presque tout le clip et les genoux restent fléchis ; l'amplitude et l'absence de balancier ne sont pas démontrées.

Aucun crédit de génération consommé : les deux clips viennent du dépôt de Yanis.

## Après réception

Les deux clips seront contrôlés image par image, puis intégrés en `coached` avec leurs réserves écrites dans la fiche et dans la voix, comme les lots précédents. Les GIF et les prescriptions restent conservés. La vidéo crunch pourra servir aux deux fiches si le matériel et le geste correspondent.
