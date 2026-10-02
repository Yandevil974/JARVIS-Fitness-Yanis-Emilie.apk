# Priorité des numéros — ce qui est mesuré, et ce qui ne peut pas l'être (02/10/2026)

## 1. Ce que la mesure donne (reproductible)

`evolution/media/tools/priorite-sources.py` → `hd-2026-09-30/PRIORITE-SOURCES.json`, sur les **355**
numéros qui ont une source PNG native. Trois mesures, sans aucun jugement visuel :

| Mesure | Ce qu'elle établit | Seuil retenu |
|---|---|---|
| **Erreur d'alignement** | la planche native annoncée est-elle bien celle du GIF livré ? (recalage grossier puis fin de la fenêtre horizontale) | ≤ 26/255 ⇒ planche confirmée ; **22 numéros écartés** (dont 218, 235, 239 à 47–80/255, déjà signalés) |
| **Facteur de perte** | combien de pixels de la source ont été jetés pour fabriquer le GIF livré | ×3,05 pour le cas courant (planche 1376×768 → case 688×768 → GIF 385×440) ; jusqu'à **×9,2** (387, 388) et ×9,19 (264) |
| **Vert des deux côtés** | y a-t-il une tache verte dans la source, là où le GIF en montre une ? | 78 numéros retent ; 252 « à regarder » (souvent : pas de vert franc dans le GIF) |

## 2. Ce que la mesure NE DONNE PAS (essais faits, tous négatifs)

Je n'ai **pas de vision** dans cette session. J'ai donc cherché un discriminant automatique entre
« vert posé sur le muscle » et « vert du décor ». Étalonné sur les 4 numéros du lot 2 que tu as validés
(11, 12, 30, 42) contre les 3 pièges connus (1, 9, 10) :

| Discriminant testé | Validés (11/12/30/42) | Pièges (1/9/10) | Verdict |
|---|---|---|---|
| Recouvrement (IoU) des masques verts GIF ↔ source | 0,27 – 0,67 | 0,00 – 0,45 | **se recouvrent** — inutilisable |
| Part du vert du GIF retrouvée dans la source | 0,34 – 0,85 | 0,00 – 0,53 | **se recouvrent** — inutilisable |
| Teinte du vert dans la source | 75,8° – 80,4° | 83,7° – 87,5° | **inversé** — le piège est plus proche du 260 que les vrais |
| Proportion de peau autour de la tache | 0,18 – 0,35 | 0,06 – 0,35 | **se recouvrent** — inutilisable |
| Position de la tache (y dans la fenêtre) | 18 – 267 | 53 – 197 | **se recouvrent** — inutilisable |

**Conclusion** : il n'existe pas, avec ces seules mesures, de tri automatique fiable. C'est exactement
le piège n°1 de la passation (« le vert de la case est celui du feuillage du décor »). La décision
appartient à l'œil. À ne pas retenter : ça coûte une session pour rien.

## 3. Ce que ça change pour la conduite du chantier

- La **file d'attente** est objective (78 numéros, triés par perte décroissante) : `PRIORITE-SOURCES.json`.
- Le **choix des 4 numéros d'un lot** se fait désormais sur la page de tri visuel
  (`hd-2026-09-30/tri/tri.html`, fabriquée par `evolution/media/tools/planche-tri.py`) : tu y vois la
  source native, le GIF livré et la zone verte détectée en magenta, et tu me dis ceux où le vert est
  bien sur le muscle.
- Une fois les 4 numéros arrêtés, la retouche reprend **exactement** la méthode validée
  (`retouche-lot2-vert260.py`), avec des ROI explicites par numéro.

## 4. Rappel des exclusions déjà actées

- n°**1, 9, 10** : vert = feuillage du décor dans la source → écartés (décision du 01/10/2026).
- n°**218, 235, 239** : la planche annoncée ne correspond pas au GIF livré → source à retrouver.
- n°**19, 48, 85** (lot 1, validés) : la retouche n'a PAS utilisé le chemin du manifeste
  (`A_manifeste`) mais les propositions `lot57` / `lot64` / `lot68`. Le tableau de priorité les classe
  donc « écartés » à tort — c'est un artefact de l'inventaire, pas un doute sur ces numéros.
- 34 numéros « femme » (210, 224-259, 274-276, 289-330) : aucune source native → chantier piscine,
  après les visuels.
