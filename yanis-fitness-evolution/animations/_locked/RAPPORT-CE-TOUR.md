# RAPPORT — reprise du sol sablé

## Réponse à « le sol n'est plus couleur sablé »
Demande utilisateur du 11/10. **Feu vert « Oui »** donné pour reprendre les GIF déjà intégrés et intégrer les nouveaux.

## Mesure (coin de sol bas-gauche, sans tapis ni athlète)
Cible = **232 211 188** (mesurée sur `poc/back-squat.gif`, 1er GIF validé).

### Déjà repris et intégrés (session parallèle, commit `64f6b0d`)
| Exercice | Média | Coin de sol |
|---|---|---|
| front squat | `08e001311b255115` | **237 220 193** |
| fentes bulgares | `81d9dc9b0652b954` | **242 223 192** |
| back squat charge modérée | `8dcad3315ed67aa3` | **228 206 180** |
| presse à cuisses pieds hauts | `73b7bb33f4a9d6df` | **226 205 179** |
| step-up sur banc | `0e32e3e5fab9f6f6` | **223 198 165** |
| leg extension | `4a75246261f34b24` | 196 177 151 (machine noire à gauche) |

### Traités ce tour
| Exercice | Média | Coin de sol | État |
|---|---|---|---|
| bulgarian split squat | `f183700b3362f93b` | **224 203 175** | prêt, à intégrer |
| leg press | `d7bd0092279c8789` | **234 216 192** | prêt, à intégrer |

### Bloqués par le quota de génération (10 images/tour)
| Exercice | Pose manquante | État |
|---|---|---|
| bulgarian split squat haltères | pose M | A (224) et B refaits ; M = ancienne pose pâle conservée |
| goblet squat | pose M | A (227) et B refaits ; M = ancienne pose pâle conservée |

→ **Les poses A et B ont été refaites et sont enregistrées** dans `build/corrections/_poses-sable/`.
Pour finir : **1 seule génération** par exercice (la pose M), puis `faire-gif.sh A M B 440x246 sortie.gif`.

## Recette qui fonctionne (à réutiliser)
Passer **2 images** au générateur :
1. la pose existante (athlète à conserver tel quel) ;
2. `reference/05-SOL-CIBLE-1er-GIF-valide.png` (= `poc/back-squat.gif[0]`) comme référence de décor.
Et demander explicitement : *large smooth pale cream/sandy flagstones, NOT grey, NOT dark, NOT small cobblestones with dark grout lines*.

## Pièges
- **Le coin de sol est le seul endroit mesurable** : le tiers bas est pollué par le tapis noir et la machine. Une mesure sur le tiers bas donne des chiffres faux (ex. 145 au lieu de 224).
- Le `/tmp` est purgé régulièrement : toujours recopier les références depuis le dépôt avant de générer.
