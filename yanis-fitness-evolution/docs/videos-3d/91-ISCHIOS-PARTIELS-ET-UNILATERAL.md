# Ischios — partiels et roumain unilatéral : contrôle avant vidéo

**Mise à jour du 22/10/2026 : les trois clips ont été déposés et raccordés.** Ils sont `coached`, avec leurs réserves écrites dans la fiche et dans la voix, et les GIF restent conservés. L'audit passe à 150 fiches musculation avec vidéo sur 203. Les sections ci-dessous gardent le détail des réserves et la résolution de la consigne ; elles ne demandent plus de génération.

Il restait trois fiches ischios sans vidéo raccordée à l'audit après `ffe4bfd`. Aucun raccordement ni nouvelle APK dans ce lot. Une recherche et comparaison SHA des MP4 présents à la racine avaient déjà été effectuées (voir #89) ; cela ne prouve pas qu'une vidéo soit absente du téléphone ou d'un autre emplacement. Le roumain avec haltère est une fiche distincte et sa vidéo n'est pas réutilisée automatiquement.

## Deux études écartées pour les soulevés de terre partiels

- `isc-terre-partiel-standard-v2.jpg` : corps entier, barre et prise visibles. Les bras de sécurité semblent derrière ou trop courts pour recevoir la barre ; contact non démontré. Coloration imparfaite. **Brouillon seulement : ne pas lancer une vidéo payante sur cette base.**
- `isc-terre-partiel-snatch-v1.jpg` : corps entier et prise plus large visibles. Les supports ressemblent à de courts taquets : leur alignement avec la barre et le contact futur sont incertains ; l'écartement de la prise doit aussi être contrôlé. **Brouillon seulement : ne pas lancer une vidéo payante sur cette base.**

Les GIF conservés des fiches sont respectivement `/media/66e84e7479c88c0d.gif` et `/media/6cfcff2b2b4dcee5.gif`. La première image du GIF du partiel montre des disques sur des blocs, pas forcément la même installation que les sécurités de la prescription ; le GIF snatch vu de profil ne permet pas bien de juger la prise. Ne pas considérer ces GIF comme preuve suffisante des détails de la cage.

**Rectification de #89 :** pour le partiel ordinaire, une prescription indique bien « Barres de sécurité à hauteur des genoux » (6 × 6–8, tempo 3210, 180 s) ; l'autre prescrit une pause complète de 2 s sur les barres (7 × 3–5, tempo 3210, 180 s). Pour la prise snatch : pause complète de 2 s sur les barres (5 × 6–8, tempo 3210, 120 s) ; hauteur non précisée dans cette prescription. Ces prescriptions restent intactes ; les 2 s de pause ne sont pas à généraliser silencieusement à toutes les séances.

### Prompts techniques envisagés après obtention d'une référence fiable

**Partiel standard :**
> Vidéo 3D anatomique, caméra fixe en plan large trois quarts : athlète entier, deux pieds, barre, disques et deux sécurités visibles à chaque instant. Barre droite devant les tibias, tenue à deux mains juste à l'extérieur des jambes, bras tendus, pieds au sol. Départ barre posée sur les deux barres de sécurité d'une cage stable réglées à hauteur des genoux, deux contacts simultanés sous la barre, les disques à l'extérieur des supports. Redresser hanches et genoux jusqu'à la station droite sans cambrer ; redescendre près des jambes, reposer la barre sur les deux sécurités et marquer une pause complète de 2 secondes avant la répétition suivante lorsque la séance le prescrit. Dos neutre, pas de rebond, ni de barre traversant les jambes ; muscles arrière des cuisses rouge-orangé lumineux. Pas de zoom ni de membre coupé.

**Partiel prise snatch :**
> Même installation et même mouvement, mais saisir la barre à deux mains beaucoup plus écartées que les épaules, à l'intérieur des disques ; coudes tendus. Barre posée et immobile deux secondes sur les deux sécurités à chaque retour avant de remonter. Position des supports réglée selon la séance et la morphologie, cage stable. Garder mains, barre, pieds, visage et supports visibles tout le long, sans inventer de contact ; arrière des cuisses rouge-orangé lumineux, caméra fixe, aucun zoom.

Le générateur peut ignorer les contacts ou le tempo ; vérifier la vidéo reçue et appliquer les consignes de la séance. Ces prompts ne rendent pas les deux images utilisables en l'état.

## Roumain unilatéral : consigne vérifiée

La fiche indique « Hanche en arrière, jambe tendue devant, dos plat », alors que le GIF conservé `/media/6223da1b562d9339.gif` montre une jambe libre partant vers l'arrière.

Les sites spécialisés tranchent : dans le roumain unilatéral, la jambe d'appui reste au sol presque tendue et la **jambe libre part derrière**, en contrepoids, dans l'axe du buste, bassin tourné vers le sol. « Jambe tendue devant » désigne donc la jambe d'appui, placée devant l'observateur, pas la jambe libre. Sources consultées : [Élanvif](https://lefun-ajaccio.fr/sport/souleve-de-terre-roumain/), [Fitnesstechstore](https://www.fitnesstechstore.fr/blogs/noticias/souleve-de-terre-roumain-technique-muscles-et-differences-avec-le-souleve-de-terre-conventionnel), [Nutripure](https://www.nutripure.fr/fr/blog/souleve-de-terre-roumain-n1308), [SmartWorkout](https://smartworkout.app/en/exercise-library/legs/bodyweight-single-leg-romanian-deadlift), [Bodybuilding Wizard](https://bodybuilding-wizard.com/single-leg-romanian-deadlift-exercise-tutorial/).

Le texte de la fiche et le GIF n'ont pas été modifiés : la clarification est portée par la notice et la voix du clip `roumain-unilateral-sans-charge.mp4`.

## Intégration du 22/10/2026

| Fiche | Source | Empreinte SHA-256 |
| --- | --- | --- |
| roumain unilatéral sans charge | `1795068446835.mp4` | `e63d6ed5d11afc7971f4e4ecf5efd6c7dce7aceda16765e50d9feb8566089c0b` |
| soulevé de terre partiel | `1795067608663.mp4` | `a0459ecc88c12885da0624e0048ff134ee18b81926fb1e10a4e7511e7ef59065` |
| partiel, prise snatch | `1795067763520.mp4` | `97e7af519787f92e45045175a79a3ccc3a6f76a51fee1afb6c51ad42b70ea490` |

640×360, 121 images à 24 images par seconde, 13 images contrôlées par clip. Copies intactes dans `public/videos` et `release/videos`, affiches extraites de la première image, GIF et prescriptions conservés, `coached` et `avoidSilentPreview`.

Réserves conservées :

- **Partiel standard** : la barre n'est pas clairement en appui sur les deux sécurités et la pause de 2 s n'est pas montrée ; la coloration déborde sur l'avant des cuisses.
- **Prise snatch** : écartement de la prise et appui sur les sécurités difficiles à vérifier, pause non démontrée.
- **Roumain sans charge** : le bassin face au sol et la tenue d'un seul côté ne sont pas démontrés ; le clip ne remplace pas la consigne écrite.

Aucun crédit de génération consommé : les trois clips viennent du dépôt de Yanis.
