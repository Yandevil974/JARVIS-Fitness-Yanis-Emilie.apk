# Tabata — contexte au sol et aquatique (mesuré le 23 septembre 2026)

Groupe `tabata-land-to-water` — **corrigé dans la 1.4.5** (`6fbd242a…`), groupe **laissé ouvert** faute d'essai sur téléphone.

## Ce qui est mesuré

Le générateur du Tabata construit les deux enchaînements dans le même composant :
au sol `type:"hiit"` avec les mouvements `TABATA_MODES`, au bord du bassin
`type:"aqua"` avec la liste aquatique. Plusieurs noms sont **identiques dans les
deux contextes** (Montées de genoux, Battements de jambes, Gainage planche,
Marche sur place, Ciseaux au bord…).

Jusqu'à la 1.4.4 incluse, le chrono guidé résolvait les **guides aquatiques sans
vérifier le contexte** : en plein Tabata **au sol**, l'étape « Gainage planche »
affichait le GIF du guide *Gainage au bord (vertical)* — comme visuel du
mouvement **et** dans le bloc « Consignes du mouvement » (consignes de bassin,
margelle comprise).

## Avant / après, mêmes états, mêmes profils, mêmes thèmes

| Cas | 1.4.4 livrée (`52dfc705`/`22109c5b`) | 1.4.5 (`6fbd242a…`) |
|---|---|---|
| Tabata **au sol**, « Gainage planche · round 1/8 » | GIF aquatique `f1dde35bd517f24b.gif` en visuel de mouvement **et** en consignes | aucune image aquatique, aucune consigne de bassin ; le visuel honnête reste le visuel générique (groupe `tabata-missing-demonstrations` ouvert) |
| Tabata **au sol**, « Montées de genoux · round 2/8 » | GIF aquatique `fe34482aa6faf932.gif` | identique au cas précédent : rien d'aquatique |
| **Aqua Tabata**, « Montées de genoux · round 1/8 » | GIF aquatique `fe34482aa6faf932.gif` + consignes | **strictement identique** (guide validé conservé) |

Captures (pleine image, téléphone 390 × 900) :
`tabata-land-avant-144.png`, `tabata-land-corrige-145.png`,
`tabata-aqua-avant-144.png`, `tabata-aqua-corrige-145.png`.

## Preuves automatiques

- `evolution/media/tests/tabata-context.spec.mjs` (5 parcours) : **5 réussis** sur le bundle corrigé,
  et **4 échecs / 1 réussite** rejoués contre la 1.4.4 livrée — les 4 échecs sont
  exactement les cas au sol, l'aqua reste vert. Le même test distingue donc la
  correction de la livraison précédente.
- `evolution/media/tests/pool-candidate.test.mjs` (test « Tabata au sol : aucun guide
  aquatique… ») : les 4 noms mesurés ne résolvent **rien** en contexte terre et
  gardent **exactement** leur guide en contexte aquatique ; les mouvements et
  libellés `TABATA_MODES` sont comparés octet pour octet au paquet 1.4.0.
- Aucune valeur prescrite touchée : noms, durées, consignes, `meta` du chrono et
  état enregistré sont identiques avant/après dans chaque parcours.
