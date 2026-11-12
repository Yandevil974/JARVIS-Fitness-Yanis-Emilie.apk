# Nouveau critère : athlète entier dans les vidéos

Yanis demande que les vidéos de l'application où l'athlète n'est pas visible en entier soient refaites. Cela modifie la décision précédente de garder un cadrage coupé : inscrire les clips concernés à refaire, vérifier les remplacements en mouvement complet, sans supprimer les GIF ni multiplier les générations pour un même mouvement. Les vidéos actuelles restent provisoirement raccordées, avec leurs réserves, jusqu'à réception d'un remplacement ; elles ne constituent pas une validation du cadrage.

## Comptage historique avant le lot step-up / squat cycliste

Pour le comptage actuel, voir [l’inventaire](./53-INVENTAIRE-TOUS-LES-MODULES.md).

- 203 fiches musculation Elite et Émilie : 116 ont une vidéo raccordée, 87 n'en ont pas.
- Les 116 fiches utilisent 104 chemins vidéo différents, mais 93 contenus binaires différents par SHA-256 : plusieurs noms de fichiers sont des copies identiques. Ce décompte concerne seulement les vidéos actuellement utilisées par les fiches Elite et Émilie ; il n'est ni un comptage des nouveaux mouvements à produire ni un audit de cadrage.
- Catalogue entier de 209 fiches, y compris les six fiches Jarvis : 120 avec vidéo, 89 sans. Étirements, piscine, HIIT et autres modules doivent être traités en plus, en regroupant seulement les gestes réellement identiques.
- Clips dont une coupure de l'athlète est déjà attestée : **au moins deux contenus différents**. `goblet-squat.mp4` : tête coupée à la remontée. `hip-thrust-barre.mp4` : bas des chaussures coupé au début ; ce même clip est utilisé pour les fiches #02 et #14. Le cadrage du reste des vidéos n'a pas encore été vérifié intégralement : le nombre final à refaire n'est pas connu.
- Pour les épaules #01/#06, les haltères sont partiellement coupés en haut : vérifier séparément le cadrage du corps et du matériel, sans affirmer à ce stade que le corps est coupé.

## Back squat : source coupée découverte ensuite

Sur les images échantillonnées du fichier `back-squat.mp4` (97 images, 24 i/s), la tête et une partie de la barre sortent du cadre en fin de remontée. La source doit être refaite selon le critère corps entier ; une mise à l'échelle ne peut pas la réparer. Elle reste provisoire pour `back-squat`, `back-squat-charge-moderee`, `back-squat-barre-haute` et `back-squat-test-1rm`, désormais toutes en `coached` avec notice sur le cadrage. Un même remplacement pourra être partagé uniquement s'il montre bien ce squat barre classique et reste compatible avec les prescriptions et réserves propres à chaque fiche. Il ne démontre ni la pause sur sécurités de #16 ni une safety bar. Ne pas l'attribuer à #21 tant que le remplacement n'est pas contrôlé ; la fiche accepte néanmoins une barre classique. Le nombre complet de sources coupées reste inconnu. Une [nouvelle référence de départ et son prompt](./76-QUADRICEPS-REPRISE-BACK-SQUAT.md) sont préparés ; le remplacement ne sera possible qu’après contrôle du clip reçu.

## Split squat poulie basse #19 : cadrage à refaire

La vidéo reçue coupe les chaussures dans le fichier pendant la montée. Elle reste provisoirement raccordée en `coached` avec le GIF conservé. Refaire la vidéo depuis l'image conservée par Yanis, sans remplacer celle-ci : détails dans [la fiche #19](./75-QUADRICEPS-SPLIT-SQUAT-POULIE-CHOIX.md).

## Goblet squat : reprise prioritaire

Nouvelle [référence large](./qua-goblet-squat-reference-cadrage-large.jpg). L'athlète est entier, plus petit dans l'image, avec une grande marge au-dessus de la tête et sous les pieds. Il tient un haltère vertical devant la poitrine ; c'est une position intermédiaire, pas une vidéo. La marge vise à garder la tête dans le cadre au redressement mais seule la vidéo permettra de le vérifier.

### Prompt Arena Video / PixVerse

> Plan fixe très large, caméra immobile et sans zoom ni recadrage ; l'athlète reste petit au centre et entièrement visible de la casquette aux deux chaussures pendant toute la répétition, y compris debout. Conserver une grande marge au-dessus de la tête, sous les pieds et sur les côtés. Athlète chromé à casquette noire, quadriceps rouges ; un seul haltère vertical tenu près de la poitrine par les deux mains. Les pieds restent à plat, écartés à peu près à la largeur des épaules. Depuis la position intermédiaire de la photo, remonter en une seconde et tenir une seconde debout ; descendre en trois secondes dans une amplitude confortable, genoux dans l'axe des orteils, talons ancrés et dos neutre ; sans rebond, remonter en une seconde et tenir une seconde. L'haltère et les mains restent proches de la poitrine, les bras et les jambes conservent une anatomie cohérente. Montrer au moins une répétition complète. Ne couper ni la tête, ni les mains, ni les pieds ; ne pas ajouter de membre, d'haltère, de texte ou de compteur. Pas de changement de caméra.

Le tempo est une instruction au générateur, pas une garantie. Contrôler toute la vidéo reçue, notamment son cadrage, la stabilité des pieds et des mains, avant d'intégrer le remplacement.

## Hip thrust barre #02/#14

La référence que Yanis a explicitement retenue reste conservée ; le clip reçu coupe le bas des chaussures au début et doit désormais être refait selon le nouveau critère. Les deux fiches partagent le même mouvement et doivent partager le même remplacement, avec leurs propres prescriptions et consignes. Préparer un cadrage assez large pour les deux pieds et toute la montée, sans révoquer la décision concernant l'image déjà retenue.

## Correction demandée : mise à l'échelle dans l'application

Yanis précise que la mise à l'échelle doit être corrigée dans l'application, sans travail précipité. La vidéo principale utilisait déjà `object-fit: contain`, mais la vignette « Ensuite » et les aperçus d'échauffement utilisaient `cover`, qui coupe une partie de l'image selon les proportions du cadre. La correction utilise `contain`, garde les proportions et élargit la vignette vidéo « Ensuite » ; les indicateurs de séance et le bouton Agrandir sont placés au-dessus de la vidéo plutôt que par-dessus l'athlète. Le GIF d'origine reste inchangé. Ces réglages affichent l'intégralité des pixels présents dans chaque fichier et ne nécessitent aucune nouvelle génération.

**Limite à ne pas confondre :** réduire une vidéo ne peut pas recréer la tête ou les chaussures déjà absentes de ses images d'origine. Le goblet squat et le hip thrust cités plus haut ont des coupures dans le fichier lui-même : la mise à l'échelle ne les répare pas. La référence de reprise du goblet reste disponible mais ne signifie pas qu'une nouvelle vidéo est nécessaire pour corriger les simples recadrages d'interface.
