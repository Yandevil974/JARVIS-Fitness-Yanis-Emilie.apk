# Ischios — références à examiner : trois variantes de leg curl

## Avant toute dépense vidéo

Avant le dernier dépôt, l'audit recensait 10 fiches ischios sans vidéo raccordée. Les MP4 présents à la racine avaient été comparés par SHA-256 à ceux de `public/videos` ; cela n'exclut pas un fichier sur le téléphone ou ailleurs. La vidéo standard `1794629898835.mp4` ne démontre pas clairement les positions des pieds ni la répétition 1¼ et n'est pas déclarée équivalente automatiquement. Depuis, le clip `1794726183867.mp4`, correspondant à la référence pieds fléchis, a été déposé et raccordé avec réserves : il reste 9 fiches ischios sans vidéo. Les GIF et prescriptions restent inchangés.

## 1. Pieds pointés — proposition à valider

Image `isc-legcurl-pieds-pointes-v3.jpg` : les pieds sont dans le prolongement des jambes, pointes éloignées des tibias. Corps entier visible, ischios rouges. Réserves : pieds sans chaussures, partiellement superposés ; les mains et la liaison roller/levier ne sont pas parfaitement lisibles. Ne pas considérer cette machine comme une représentation technique irréprochable ; il faudra vérifier ces points dans une éventuelle vidéo.

**Prompt, uniquement si Yanis accepte la référence et ses réserves :**

> Vidéo anatomique 3D réaliste, plan fixe large de profil, un seul athlète, corps entier, tête, deux mains, jambes, pieds et machine visibles en permanence avec marge autour des pieds quand ils remontent. Athlète allongé sur le ventre, tête à gauche, jambes vers la droite, bassin et cuisses posés sur le banc. Les deux mains tiennent les poignées sans bouger ; genoux alignés avec le pivot de la machine ; rouleau derrière le bas des deux jambes juste au-dessus des talons, attaché à un levier qui pivote avec lui. Au départ les genoux sont presque tendus, sans verrouillage. Les DEUX chevilles sont en flexion plantaire : pointes éloignées des tibias, pieds pointés dans le prolongement des jambes ; conserver cet angle des chevilles tout au long du mouvement. Fléchir simultanément les deux genoux pour rapprocher les talons des fesses, sans décoller le bassin ni bouger les cuisses ; le rouleau reste en contact et tourne avec le levier. Revenir lentement en contrôlant le mouvement, sans claquer la charge. Une répétition complète, sans balancement ni changement de posture des pieds. Mise en valeur rouge-orangé lumineuse des ischios à l'arrière des cuisses comme dans les autres vidéos, pas sur l'avant des cuisses. Deux bras, deux jambes, deux pieds distincts, aucun membre coupé, pas de texte ni changement de caméra.

Fiche Elite : 5 × 6–8, tempo 4010, consigne « Contracter les mollets. » La vidéo peut illustrer le geste mais ne garantit pas le tempo exact ; la prescription de l'application reste la référence.

## 2. Pieds fléchis — vidéo reçue et raccordée

Yanis a déposé `1794726183867.mp4` après présentation de la référence. SHA-256 : `8d4d33a062dd3a654eabbf284782630dda384d14a29b5f1beed3872f1305f18f`. Le clip 640 × 360, 121 images à 24 images/s correspond visuellement à la référence pieds fléchis et montre une montée puis une descente, pas le 1¼. Sur 11 images échantillonnées, le corps reste dans le cadre ; les jambes et pieds se superposent, leur angle change ou est difficile à vérifier et le rouleau semble se détacher de son levier. Le tempo exact n'est pas démontré. Clip recopié sans modification en public/release, seul le mouvement pieds fléchis est raccordé en `coached` avec notice, voix et `avoidSilentPreview`. GIF et fiche (5 × 6–8, tempo 4010, repos 60 s) conservés. Aucun nouveau rendu demandé.

Image `isc-legcurl-pieds-flechis-v1.jpg` : pieds repliés, pointes rapprochées des tibias par rapport à l'image précédente, corps entier. Réserves : pieds en partie superposés et liaison du rouleau au levier peu lisible ; les mains sont également petites. La position affichée n'est pas une mesure précise de l'angle des chevilles.

**Prompt préparé avant réception, conservé à titre d'historique :**

> Vidéo anatomique 3D réaliste, plan fixe large de profil, un seul athlète entièrement visible avec marge au-dessus des jambes et autour des pieds. Allongé sur le ventre, tête à gauche, bassin et cuisses stables contre le banc ; deux mains aux poignées. Genoux alignés avec le pivot, rouleau contre l'arrière des deux chevilles et attaché au levier de la machine. Départ jambes presque tendues sans verrouiller. Les DEUX chevilles sont fléchies vers le haut : ramener les pointes des pieds vers l'avant des tibias, en dorsiflexion, et garder cette position pendant toute la répétition ; ne pas pointer les pieds dans le prolongement des jambes. Plier les deux genoux, talons vers les fesses, sans soulever les hanches ni déplacer les cuisses ; le rouleau suit les chevilles sur son levier. Redescendre lentement jusqu'au départ, sans à-coup. Une répétition complète, deux jambes et pieds distincts, corps entier et machine toujours dans le cadre, pas de bascule du buste ni de texte. Ischios arrière en rouge-orangé lumineux comme les vidéos existantes.

Fiche Elite : 5 × 6–8, tempo 4010, consigne « Tirer les pieds (tibial antérieur). » La vidéo ne garantit pas le tempo exact ; la prescription de l'application reste la référence.

## 3. 1¼ en haut — même position de départ, définition à clarifier

On peut employer l'image existante `isc-08-leg-curl-allonge-v3.jpg` pour la position de départ, sans fabriquer de nouvelle image. Elle ne montre évidemment pas le quart de répétition ; rouleau/levier et mains sont peu lisibles. La vidéo standard, elle, ne montre pas clairement cette méthode.

Attention, la source du programme contient « **demi-rep en plus en haut** », tandis que le conseil associé dit « **Monte, quart de descente, remonte** ». Ne pas trancher silencieusement avant une génération payante. Proposition de séquence à confirmer : partir jambes presque tendues, monter complètement, redescendre **d'un quart de l'amplitude totale** à partir du haut, remonter, puis redescendre complètement. Si Yanis veut une demi-descente, adapter le prompt avant de produire la vidéo.

**Prompt provisoire, après confirmation de la séquence et accord sur la référence :**

> Vidéo 3D anatomique réaliste, caméra fixe, plan large de profil, athlète entier visible avec marge pour les pieds levés. Athlète allongé ventre et cuisses appuyés sur le banc, mains sur poignées, genoux alignés sur l'axe de la machine. Deux chevilles sous un rouleau relié à son levier ; jambes presque tendues au départ. Plier les genoux et monter le rouleau jusqu'en haut. Redescendre seulement d'un quart de l'amplitude depuis cette position haute, remonter jusqu'en haut, puis redescendre lentement jusqu'au départ : c'est une seule répétition 1¼. Hanches et cuisses restent collées au banc, seules les jambes sous les genoux et le levier bougent ; chevilles neutres. Bien distinguer les quatre phases, sans répétition standard supplémentaire. Deux pieds et corps entier dans le cadre, pas de zoom ni texte, ischios rouge-orangé lumineux. Le tempo 3210 est indiqué dans le programme mais ne peut être garanti par la génération.

## En attente

Leg curl debout : plusieurs essais, rouleau/levier encore illisibles. Soulevé de terre : essais avec barre trop haute, mains ou coloration incertaines. Glute ham raise : appui du corps sur le coussin non convaincant. Aucune de ces images d'essai ne doit être considérée validée ou utilisée pour générer une vidéo. Le roumain sans haltère a une indication de jambe devant à vérifier ; ne pas confondre avec la vidéo à l'haltère. Les variantes de soulevé de terre partiel et test 1RM restent à examiner individuellement. Musculation non terminée.
