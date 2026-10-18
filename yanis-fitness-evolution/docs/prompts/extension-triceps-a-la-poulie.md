# Démonstrations vidéo 3D — dossier de l'exercice pilote

Exercice exact du catalogue : **« Extension triceps à la poulie »**
Identifiant : `extension-triceps-a-la-poulie`
Source dans les données : profil **Émilie** (`legacy.json` → `PROGRAM`, muscle `tri`)
Séries / répétitions : **2 × 12**, tempo **2011**, repos **45 s**, charge en kg total
Consigne réelle de l'application : « **Coudes collés au corps, extension complète.** »
Conseil réel : « Coudes fixes, verrouille les bras en bas. »

---

## 1. Dossier technique du mouvement

| Élément | Description |
| --- | --- |
| Type d'exercice | Isolation triceps, tirage vertical à la poulie haute (câble) |
| Matériel | Station de poulie haute, barre droite de poussée (ou corde), mousqueton |
| Position de départ | Debout, pieds largeur de bassin, genoux légèrement fléchis, buste droit et légèrement penché (~8°), épaules basses, coudes collés au tronc, avant-bras fléchis (~50–55° sous l'horizontale) tenant la barre |
| Trajectoire | La barre descend en arc quasi vertical de la poitrine vers les cuisses ; les coudes restent fixes le long du tronc ; les poignets restent neutres |
| Phase concentrique | Extension des coudes jusqu'à ~160–165° (bras presque tendus), expiration, triceps en contraction maximale |
| Phase excentrique | Retour lent sur ~2 s, résistance contrôlée, coudes immobiles, pas de relâchement |
| Amplitude | 50° → 165° d'extension du coude (amplitude confortable, sans verrouillage brutal) |
| Muscles principaux | Triceps brachial : **chef long** (porte sur l'omoplate), **chef latéral**, **chef médial** |
| Muscles secondaires | Deltoïde antérieur, brachioradial, gainage du tronc (ischio-jambiers / fessiers en appui) |
| Erreurs à éviter | Coudes qui s'écartent, épaules qui montent, buste qui se balance pour lancer la charge, verrouillage brutal du coude, poignets cassés |

## 2. Angles de vue retenus (et pourquoi)

1. **3/4 avant droit** — contrôle de la posture, des coudes collés et de la prise de barre.
2. **Profil droit** — contrôle de la trajectoire verticale de la barre et de l'amplitude réelle du coude.
3. **Arrière 3/4 droit** — lecture directe du triceps (les trois chefs sont postérieurs) + deltoïde postérieur.

Les trois vues utilisent **le même personnage, la même tenue, le même matériel et le même fond** :
aucun raccord de personnage, aucune variation d'anatomie entre les plans.

## 3. Critères de validation appliqués

| Critère | Comment il a été vérifié | Résultat |
| --- | --- | --- |
| Conformité de l'exercice | Le mouvement est une extension de coude à la poulie haute, barre tenue à deux mains | ✅ |
| Nombre et position des membres | Deux bras, deux jambes, mains sur la barre, épaules alignées | ✅ |
| Cohérence des articulations | Coude = seul degré de liberté animé du bras ; pas d'inversion de coude | ✅ |
| Trajectoire du matériel | La barre suit un arc vertical contrôlé, le câble reste tendu vers la poulie | ✅ |
| Absence de déformations majeures | Contrôle sur les 276 trames (différences inter-images lissées hors 3 coupes de caméra) | ✅ |
| Visibilité des muscles | Triceps rouges, secondaires orange, lisible de face, de profil et de dos | ✅ |
| Continuité du mouvement | 4 répétitions complètes, 3 coupes de caméra seulement, boucle propre | ✅ |
| Qualité des images de début et de fin | Image d'accroche (affiche) + plan final « muscles sollicités » | ✅ |

## 4. Prompt Arena.ai prêt à copier

> **Usage** : si tu veux une génération par modèle vidéo (image réelle, autre style), copie
> le bloc ci-dessous dans la fonction vidéo d'Arena.ai. La version livrée dans
> l'application n'utilise pas ce prompt : elle est rendue localement (voir plus bas).

```
Démonstration anatomique 3D verticale 9:16, salle de musculation sombre et sobre,
personnage masculin athlétique en tenue rouge (débardeur rouge, short noir, casquette),
vue de trois quarts avant à hauteur de poitrine.

EXERCICE : extension triceps à la poulie haute, debout.
MATÉRIEL : station de poulie haute à câble, barre droite tenue à deux mains, prise
pronation largeur d'épaules.
POSITION DE DÉPART : pieds largeur de bassin, genoux légèrement fléchis, buste droit
très légèrement penché, coudes collés au tronc, avant-bras fléchis à ~90°, barre
devant la poitrine.
MOUVEMENT : extension complète des deux coudes jusqu'à bras presque tendus, la barre
descend en ligne quasi verticale vers les cuisses, les coudes ne bougent pas ; retour
lent et contrôlé sur 2 secondes. Amplitude du coude 50° → 165°.
RYTHME : 1 seconde en extension, courte tenue, 2 secondes de retour ; 4 répétitions.
MUSCLES : triceps brachial surligné en rouge (chef long, chef latéral, chef médial),
deltoïde antérieur et brachioradial en orange ambré. Le reste du corps reste en teinte
naturelle. Pas de squelette, pas de rayons X.
CAMÉRA : fixe, léger travelling latéral de 20 cm, sujet toujours entièrement cadré.
STYLE : rendu 3D réaliste, éclairage studio de salle de sport, fond flou sombre,
contraste élevé, couleurs naturelles, 24 i/s.

À ÉVITER ABSOLUMENT : membres supplémentaires, doigts fusionnés, coudes qui s'écartent,
barre qui se déforme, épaules qui montent, buste qui balance, câble qui flotte,
changement de personnage ou de tenue, texte incrusté, watermark.
```

**Après génération, contrôle obligatoire** : compter les membres, vérifier que les coudes
restent fixes, que la barre ne se déforme pas et que le câble rejoint la poulie. Une vidéo
non conforme ne doit pas être marquée `validated: true` dans le manifeste.

## 5. Pourquoi la vidéo livrée n'utilise pas un modèle vidéo externe

Le pipeline livré avec le dépôt (`tools/anatomy-video/`) rend le personnage, le matériel,
le décor et les incrustations **localement et de façon déterministe** :

- aucun compte, aucune clé API, aucun coût ;
- aucune dépendance à un modèle qui pourrait changer ou disparaître ;
- animation biomécanique contrôlée par la pose (coude = seul degré de liberté) ;
- rendu reproductible : relancer la commande redonne exactement le même fichier.

Le surlignage musculaire est une **planche anatomique 2D superposée**, construite à partir
de l'atlas humain livré avec l'application (`public/human/back.webp`,
`src/components/anatomical-regions.js`). C'est une aide pédagogique fidèle à la
localisation des chefs du triceps, **pas** une simulation de déformation musculaire en
temps réel : cette limite est écrite dans le manifeste et dans la fiche exercice.
