# 📋 CONSIGNE À COPIER-COLLER — nouveau chat

Copier tout le bloc entre les deux lignes et le coller comme premier message du nouveau chat.
Cette consigne décrit l'état **actuel** du dépôt ; `SUIVI.md` reste le journal détaillé et la
source de vérité pour l'historique, les réserves et les tentatives rejetées.

---

Reprends le chantier « reconstruction des animations » de JARVIS Fitness.

## Dépôt et branche

- Dépôt public : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.
- Historique consolidé connu : branche
  `arena/bdd122a8-jarvis-fitness-yanis-emilie-ap` ; dernier exercice commité connu :
  `069dd4f` (`squat-cycliste-squat-complet` HOMME, Lot B-03, 74/614).
- **Respecte toujours la branche imposée par le prompt système de ta session. Ne change jamais
de branche et ne pousse jamais sur une autre branche.** Si elle est celle ci-dessus, au début
  du tour :

```bash
rm -f .git/index.lock
git fetch origin arena/bdd122a8-jarvis-fitness-yanis-emilie-ap
git reset --hard FETCH_HEAD
git status --short --branch
git log -1 --oneline
```

Si le prompt système fixe une autre branche de session, reste sur cette branche et suis ses
instructions pour récupérer l'historique consolidé ; ne fais pas de `git switch`.

Lis ensuite `PASSATION-ANIMATIONS.md`, `yanis-fitness-evolution/animations/SUIVI.md` et
`yanis-fitness-evolution/animations/PLAN-THEMES.md`. Le sandbox peut revenir à un ancien HEAD :
ne présume jamais qu'un appel interrompu ou un fichier généré a abouti ; vérifie le HEAD et les
fichiers réellement présents avant de reprendre.

## 1. ÉTAT CONSOLIDÉ — 9 octobre 2026

- **74 / 614 animations livrées** (540 restantes).
- **Thème A terminé : 50/50** (25 HOMME + 25 FEMME).
- **Thème B : 14/187** ; chantier actuel : Jambes, quadriceps & squats.
- **Lot B-01 terminé HOMME + FEMME** (3/3 exercices par profil).
- **Lot B-02 terminé HOMME + FEMME** (3/3 exercices par profil). Le B-02F est complet :
  9/9 positions, GIFs individuels, planches statiques et assemblages du lot.
- **Lot B-03 en cours — ne pas l'annoncer comme terminé :**
  - `back-squat` (`barre`) : un POC existe ; **recontrôler sa qualité** selon la règle 2 avant
    toute décision. Ne pas le remplacer/régénérer sans accord explicite.
  - `squat-cycliste-squat-complet` (`poids du corps`) : **HOMME livré** (`069dd4f`) ; FEMME
    encore à produire.
  - `leg-press` (`machine`) : HOMME et FEMME encore à produire.
  - La version FEMME de `back-squat` est à produire selon le plan du lot ; le POC HOMME ne la
    remplace pas et ne doit pas être compté comme sa livraison.

### Dernière livraison : squat cycliste HOMME (`069dd4f`)

- Sources : `yanis-fitness-evolution/animations/themeB/_sources/B-03/squat-cycliste-squat-complet-{A,M,B}.png` (1376×768).
- Technique : talons surélevés sur un disque noir, pieds très rapprochés, pointes vers l'avant,
  buste droit, genoux dans l'axe des orteils, descente contrôlée en squat complet.
- RMSE : A→M **0,0778**, M→B **0,0911** (seuil 0,030 respecté).
- Identité contrôlée à 1:1 : peau lisse et mate, carrure massive, visage noir sans traits,
  casquette, short noir et baskets blanches — conforme.
- Livrables : `themeB/squat-cycliste-squat-complet-3poses.gif` (460×257, 4 frames) et
  `themeB/LOT-B03-squat-cycliste-squat-complet-PLANCHE-FINALE.jpg` (1440×300).
- Technique vérifiée avant génération :
  https://www.sport-equipements.fr/squat-cycliste/ ·
  https://smartworkout.app/en/exercise-library/legs/cyclist-squat ·
  https://www.grandestcyclisme.fr/squat-cycliste/.

## 2. SUITE IMMÉDIATE

1. Examiner le POC `back-squat` (état réel des fichiers, cadrage corps entier, identité, pose et
   matériel). **Aucune modification de l'animation POC sans accord explicite** ; noter le verdict
   et la décision dans `SUIVI.md`.
2. Continuer le Lot B-03, en HOMME puis FEMME : produire `leg-press` HOMME, puis les versions
   FEMME requises (`back-squat`, `squat-cycliste-squat-complet`, `leg-press`). Pour `leg-press`,
   faire la recherche technique en ligne et vérifier `inventaire.json` avant toute génération.
3. Pour chaque exercice, contrôler les 3 sources A/M/B avant l'assemblage ; assembler le GIF et
   la planche statique. Ne construire le GIF/planche globale B-03 qu'avec les livrables validés.
4. Mettre à jour `SUIVI.md`, ce document et `PASSATION-ANIMATIONS.md` avec le vrai compteur et les
   réserves ; ne jamais annoncer un exercice incomplet.

## 3. RÈGLES NON NÉGOCIABLES

1. **1 exercice = 1 animation spécifique** : ne jamais copier/renommer/réutiliser un GIF d'un
   autre exercice.
2. **Ne jamais remplacer une animation déjà livrée ni le POC sans accord explicite.** Les deux
   circuits HOMME du LOT 3 et les corrections hors accord explicite restent en réserve.
3. Ne pas toucher à `release/`, `public/media` ni au code applicatif avant intégration validée.
4. Dire franchement les échecs, rejets et réserves. Ne pas présenter un exercice comme fini s'il
   manque une position, un GIF ou son contrôle.
5. **Maximum 10 appels `generate_image` par tour** : compter chaque appel, y compris les rejets,
   et signaler le total réel.
6. Vérifier en ligne la technique exacte **avant** de générer et citer les URL consultées dans le
   commit ; vérifier aussi le matériel dans `inventaire.json`.
7. L'œil de l'utilisateur tranche : fournir les planches utiles pour validation.
8. Commits et push autorisés, mais uniquement sur la branche imposée par le prompt système.
9. Progresser par thème : A (terminé) → B (en cours) → C → D → E.
10. Périmètre : 614 animations HOMME + FEMME.
11. Le sandbox peut se réinitialiser : vérifier git au début de chaque tour et committer/pousser
    chaque exercice complet sans attendre la fin d'un lot.
12. Contrôle avant commit : inspection visuelle, format paysage, anti-doublon MD5, et RMSE entre
    positions consécutives **≥ 0,030** (`compare -metric RMSE a.png b.png null:`).
13. Le user n'a pas le visualiseur d'Arena : chaque aperçu à valider doit être commité et annoncé
    avec un lien GitHub direct.

## 4. IDENTITÉ VISUELLE — À RESPECTER POUR CHAQUE NOUVELLE IMAGE

- Toujours éditer une **pose de référence validée**, jamais partir d'un prompt texte seul ni
  chaîner depuis une image non conforme.
- Homme : `themeA/_sources/A-02/squat-poids-du-corps-{A,M,B}.png`.
- Femme : `themeA/femme/_sources/A-02F/squat-poids-du-corps-{A,M,B}.png`.
- Peau blanche argentée **lisse et mate** — pas de fibres grises striées, pas d'aspect écorché,
  pas de peau chromée. Carrure très musclée et massive, même échelle/cadrage que la référence.
  Casquette blanche, visage noir mat sans traits, short noir, baskets blanches ; pour la femme,
  ajouter tresse argentée, brassière et short noirs. Décor terrasse bord de mer ; pas de salle.
- Paragraphe HOMME à inclure mot pour mot :

  > He is a VERY muscular, heavily hypertrophied 3D anatomical bodybuilder: extremely wide
  > shoulders and big round deltoids, thick massive arms, huge full rounded pectorals, wide
  > lats, deep defined abdominals, narrow waist, powerful legs. IMPORTANT: do NOT slim him
  > down, do NOT make him leaner or narrower — copy his exact silhouette, shoulder width,
  > arm thickness, chest volume and muscle size from this reference image. He must fill the
  > frame exactly the same way (same camera, same distance, same framing, same scale).

- Paragraphe FEMME à réutiliser mot pour mot :

  > She is a VERY muscular, heavily hypertrophied female 3D anatomical athlete: wide toned
  > shoulders, full round deltoids, thick strong arms, well-defined abdominals, firm narrow
  > waist, powerful thick thighs and glutes. IMPORTANT: do NOT slim her down, do NOT make her
  > thinner or narrower — copy her exact silhouette, shoulder width, arm thickness, chest
  > volume and muscle size from this reference image. She must fill the frame exactly the
  > same way (same camera, same distance, same framing, same scale).

- Contrôle d'identité **1:1** (sans redimensionner) sur le buste avant assemblage : peau mate,
  silhouette/carrure, échelle, tenue et décor.

## 5. RECETTES ET OUTILS DÉJÀ VALIDÉS

- **`leg-press`** : réutiliser comme référence machine la presse de
  `themeB/_sources/B-02/presse-a-cuisses-pieds-hauts-{A,M,B}.png` et comme référence d'identité
  la pose validée du profil cible dans le Thème A. Vérifier que le mouvement demandé correspond
  bien à `leg-press` et au matériel déclaré ; ne pas confondre avec
  `presse-a-cuisses-pieds-hauts` (exercice différent). Pour FEMME, l'installation sur machine a
  déjà résisté aux consignes de scène et aux références inversées : ne pas refaire ces stratégies.
  La méthode validée est **« GARDE TOUT, NE BOUGE RIEN — seuls le torse et la tête changent »** :
  prendre la frame HOMME validée (machine, pose, pieds et appuis conservés), puis ne modifier que
  l'identité. Vérifier les appuis par crop/zoom avant de rejeter une image.
- Presse B-02F : sa position M est acceptée à RMSE **0,0360**, juste au-dessus du seuil, avec une
  réserve d'amplitude ; matériel incliné à chariot. Ne pas la refaire sans demande explicite.
- Position de squat/fente : si la hauteur de bassin se bloque, mettre la référence de hauteur M
  ou B en première image ; ne pas chaîner depuis une image non conforme.
- Step-up : éviter le mot « bench » ; employer « STEP PLATFORM », les deux pieds à plat sur le
  dessus, la plateforme directement sous les pieds. L'essai interrompu du « long bench » ne doit
  pas être relancé sans nouvelle instruction.
- Outils (à exécuter depuis `yanis-fitness-evolution/animations/`) :
  - `bash ../scripts/build-planche-exo.sh <src_dir> <out.jpg> <ex> "<A>" "<M>" "<B>"` → 1440×300 ;
  - `bash ../scripts/build-planche-grille.sh <src_dir> <out.jpg> "<titre>" <HOMME|FEMME> <ex1> <ex2> <ex3>` → 1440×900 ;
  - `bash ../scripts/build-gif-lot-depuis-gifs.sh <out.gif> <gif1> <gif2> <gif3>` → planche 1420×265 ;
  - chaque GIF individuel : 460×257, 4 frames.
- Toujours mettre `-font DejaVu-Sans` aux commandes ImageMagick `convert -annotate`.

---
