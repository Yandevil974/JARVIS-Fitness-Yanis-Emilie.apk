# Refonte visuelle sur la photo de l'utilisateur — méthode et état

> Consigne du 25 septembre 2026 : « refais en entier les gifs animés via la nouvelle
> photo de l'homme et de la femme que je viens de mettre. Les nouveaux gifs doivent
> être conformes à la photo, même style, exactement le même visage et corps.
> Tous les exercices : musculation, Tabata, Aqua Tabata, piscine, Metcon piscine,
> vélo elliptique, échauffement, étirement — tout doit être changé et conforme.
> Aucun oubli, aucun exercice ne doit avoir un blanc. »

## 1. La méthode qui marche (v5, celle qui a été approuvée)

**On ne redessine pas le personnage : on RETOUCHE la photo de l'utilisateur.**

1. La photo donne le visage, le corps et le décor : rien de tout cela n'est recréé.
2. Chaque position d'exercice est une **retouche de la position précédente** :
   « Edit this image. Keep EVERYTHING identical … Change ONLY the arms ».
   Le geste est écrit en termes très concrets (`RAISED BOTH ARMS OUT SIDEWAYS …
   HORIZONTAL … T shape`, `dumbbell held VERTICALLY … must NOT be horizontal`),
   sinon le modèle ne change que la couleur.
3. Deux positions = un GIF de 2 images, 500 ms, boucle infinie
   (`evolution/media/tools/photo-to-gif.py`).
4. Seuls les muscles travaillés sont surlignés en **vert lime** ; le reste du corps
   garde sa peau naturelle.
5. Aucune rotation, aucun miroir global, aucune substitution d'outil.
   Une prescription ne se réécrit jamais pour justifier une mauvaise image.

## 2. Références épinglées (ne jamais les régénérer)

| Fichier | Rôle |
|---|---|
| `photo/homme-source.jpg` | capture envoyée par l'utilisateur, 703 × 1172 |
| `photo/femme-source.jpg` | capture envoyée par l'utilisateur, 1661 × 906 |
| `photo/homme-avatar-1.4.8.png` | version épingleée du dépôt (commit `763f4d7`), 768 × 1376 — même image, même visage |
| `photo/femme-avatar-1.4.8.png` | version épingleée du dépôt, 1408 × 768 — même image |
| `photo/famille-approuvee-480x262.gif` | l'unique GIF photoréaliste approuvé (`jarvis-incline-lateral-raise.gif`) : montre la direction exacte attendue |

Le JPEG de l'utilisateur et le PNG du dépôt ont été mesurés image par image :
**écart moyen 2,7 / 255 pour la femme** (mêmes pixels, JPEG/PNG) et même visage,
même salle, même corps pour l'homme (recadrage identique à 0,5 %). La chaîne doit
donc repartir de **cette** photo, sans nouvelle identité visuelle.

## 3. Modèles maîtres (les deux seuls à réutiliser)

| Fichier | Contenu |
|---|---|
| `planches/maitre-homme.png` | l'homme de la photo, debout face caméra, salle lumineuse, corps entier |
| `planches/maitre-femme.png` | la femme de la photo, debout face caméra, même salle, corps entier |

Toutes les positions de tous les exercices masculins descendent de
`maitre-homme.png` ; toutes les positions féminines descendent de
`maitre-femme.png`. C'est ce qui garantit « exactement le même visage et corps ».

## 4. Exemples de contrôle (demandés par l'utilisateur le 25 septembre)

| Fichier | Mouvement | Athlète |
|---|---|---|
| `gif/elevations-laterales-assises-homme.gif` | élévations latérales assises, haltères le long du corps puis T horizontal | homme |
| `gif/curl-marteau-assis-femme.gif` | curl marteau assis, bras allongés puis flexion complète | femme |
| `exemple-2-exercices-chacun.jpg` | planche de contrôle des deux GIF, position 1 et position 2 côte à côte | les deux |

## 5. Étendue mesurée du travail restant

Mesure faite sur l'inventaire livré (`evolution/media/review/inventory-1.4.0.json`) :

| Surface | Noms à illustrer |
|---|---|
| Musculation (catalogue) | 209 |
| Étirements | 29 |
| Tabata au sol | 38 |
| Tabata aqua | 6 |
| Guides piscine | 19 |
| Étapes de protocoles piscine (repos, mises en place, nages) | 111 noms distincts sur 420 étapes |
| Guides cardio / elliptique | 5 |
| Échauffement | 3 |
| Récupérations et transitions | déjà comptées ci-dessus |
| **Total de noms distincts** | **399** |
| Variantes d'alias produites hors photo (lot 2) | 8 + 2 à refaire + 3 à produire |

Chaque nom = 2 positions = **2 images générées**. Répartition par athlète à valider
avec l'utilisateur (un seul média est servi par exercice dans l'application).

## 6. Interdits rappelés

- Aucune image de la famille C (refusée).
- Piscine : jamais de vélo, d'elliptique, ni de photo générique ; l'Aqua Tabata et le
  Metcon piscine gardent leur décor aquatique.
- Aucun nom sans visuel, aucun écran blanc.
- La clé de récupération de signature ne se publie jamais : `/tmp/rk.txt`, droits 0600.
