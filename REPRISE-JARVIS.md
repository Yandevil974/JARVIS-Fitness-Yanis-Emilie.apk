# Passation JARVIS Fitness — animations HOMME

> Texte prêt à copier-coller dans un nouveau chat pour reprendre le travail.

## Message de reprise

Tu reprends le dépôt `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`, sur la branche Arena fixe :

`arena/1f46170c-jarvis-fitness-yanis-emilie-ap`

Ne change pas de branche. Tout commit ou push doit rester sur cette branche. Avant de conclure sur l’état du travail, consulte aussi les branches distantes : le premier état limité au checkout local avait été jugé incomplet.

### Objectif actif

Poursuivre la production des animations **HOMME**. Terminer le front squat **B-04** en contrôlant les trois poses A/M/B, puis finaliser le GIF et sa planche. L’exercice suivant, après validation du front squat, est `fentes-bulgares-halteres-pied-avant-sureleve` HOMME B-04.

### État du front squat B-04 au 10 octobre 2026

Dossier source :

`yanis-fitness-evolution/animations/themeB/_sources/B-04/`

- `front-squat-A.png` — pose A de départ conservée et validée ; ne pas la remplacer.
- `front-squat-M.png` — candidat intermédiaire généré à partir d’un guide de posture, puis raffiné par comparaison avec B. La flexion est visible, mais vérifier la progression du haut du corps et de la barre par rapport aux deux extrêmes.
- `front-squat-B.png` — nouveau candidat bas : squat nettement plus profond, pli de hanche au niveau ou légèrement sous le haut des genoux, talons au sol, barre en front rack. Candidat prometteur, validation visuelle finale requise.
- `front-squat-homme-B-04-preview.gif` — prévisualisation en 5 images `A → M → B → M → A`, 1376×768, boucle d’environ 1,4 s.
- `front-squat-homme-B-04-planche-validation.png` — planche de contrôle A/M/B ; M et B restent indiquées comme candidates.
- `SUIVI.md` — état des poses, décisions et URL des sources réellement consultées.

Le GIF a été assemblé comme **prévisualisation source**, pas comme intégration dans l’application. Le haut du corps/barre de M est moins descendu que dans B ; examiner la planche et améliorer M si la transition paraît trop brusque. Ne pas déclarer les candidats validés sans contrôle visuel.

### Limite d’intégration

`INTEGRATION-GIFS-HOMME.md` n’est pas présent dans ce checkout, mais la passation précédente indique que l’intégration applicative exige une confirmation explicite du principe des GIFs HOMME partagés et de la première vague. En attendant cette confirmation, ne modifier aucun fichier de `public/media/`, `src/` ou `release/`. Aucun build ou changement applicatif n’a été effectué pour B-04.

### Références et traçabilité

Consulter des références visuelles adaptées à l’exercice et inscrire dans `SUIVI.md` uniquement les URL réellement examinées. Ne pas prétendre avoir ouvert une page inaccessible ; les aperçus d’image ne sont pas des pages textuelles chargées, et une transcription YouTube ne remplace pas le visionnage des images. La passation précédente cite notamment un aperçu de squat goblet profond de face de Men's Health comme guide de posture B ; voir le tableau de `SUIVI.md` pour l’historique complet. H2O Les Angles, Nutrimuscle, ForceIndex et Praticonnect avaient été mentionnés comme pistes, mais leurs URL n’étaient pas disponibles dans le suivi courant : ne pas les présenter comme sources consultées sans vérification.

### Règles de travail

- Conserver A et la cohérence du personnage, du décor, du cadrage frontal, de la barre en front rack et des pieds au sol.
- Suivre le nombre d’appels à `generate_image` ; maximum 10 par tour. Le drapeau rouge mentionné auparavant concerne la limite de contexte du chat, pas ce plafond d’images.
- Ne pas ajouter au dépôt les dossiers de travail temporaires `tmp-front-squat/` ou `image-search/` ; ils contiennent des essais et des références, pas les livrables à intégrer.
- Vérifier `git status`, `git diff --check` et les dimensions/nombre d’images du GIF avant livraison.
- Les compteurs transmis avant B-04 étaient 77/614 et 3/10 (dernière livraison précédente : leg extension HOMME `945908f9`). B-04 n’a pas encore modifié ces compteurs dans l’application.

### Prochaine action

Ouvrir la planche et le GIF, juger si M est assez intermédiaire et si le passage M→B est crédible. Si nécessaire, corriger M sans toucher à A, mettre à jour le GIF, la planche et `SUIVI.md`, puis demander/obtenir l’autorisation explicite avant toute intégration applicative. Conserver tous les changements sur la branche Arena fixe indiquée plus haut.

## Liens de visualisation (ajoutés le 10 octobre 2026)

Visualisation directe sur GitHub, branche `arena/83fa8373-jarvis-fitness-yanis-emilie-ap` :

- GIF candidat M4 : [front-squat-homme-B-04-preview-M4.gif](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/arena/83fa8373-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/themeB/_sources/B-04/front-squat-homme-B-04-preview-M4.gif)
- Bande A / M4 / B : [front-squat-homme-B-04-strip-M4.png](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/arena/83fa8373-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/themeB/_sources/B-04/front-squat-homme-B-04-strip-M4.png)
- Liste complète et statut : [SUIVI.md](https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/arena/83fa8373-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/themeB/_sources/B-04/SUIVI.md)

M4 est un candidat non validé ; l'ancienne M et le GIF d'origine sont conservés. Aucune intégration dans l'application.

## Mise à jour : front squat HOMME B-04 intégré (10 octobre 2026)

- Front squat validé : pose A conservée, pose M4 retenue (l'ancienne M reste en archive), pose B validée.
- GIF intégré : `public/media/6008e0f8a2557d40.gif`, référencé par `src/data/legacy.json` (elite, « front squat »). Index et manifeste d'audit mis à jour, et `release/` patché pour ce seul GIF (rebuild complet écarté, voir SUIVI.md).
- Tests : 94 réussis, 0 échec.
- Prochain exercice : fentes bulgares haltères pied avant surélevé, HOMME B-04 (`fentes-bulgares-halteres-pied-avant-sureleve`).

## Règles de production des GIF HOMME (consigne de l'utilisateur, 10 octobre 2026)

1. Chercher des modèles de référence sur internet (image_search / fetch_page) pour chaque pose. Ne pas se contenter d'images générées de zéro. Consigner dans SUIVI.md uniquement les URL réellement consultées.
2. Ne pas présenter les GIF un par un : construire le lot, puis présenter les 10 GIF réalisés d'un coup.
3. Ne rien intégrer dans l'application (public/media, src, release) sans nouvelle autorisation explicite pour ce lot.
4. Garder les dossiers de travail (image-search/, tmp-front-squat/) hors du dépôt.

## Lot HOMME en cours (10 octobre 2026) — suivi et règle de présentation

**Règle** : les GIF sont présentés à l'utilisateur uniquement lorsque le lot de 10 est terminé. Les GIF du lot sont ensuite inclus dans cette passation, avec leur lien GitHub.

**Physique** : personnage musclé, comme le front squat validé. Ne pas le rendre plus mince.

**Lot (état au 10 octobre 2026)**
1. Front squat : **intégré** (M4, GIF 440×246, hash `6008e0f8a2557d40`).
2. Fentes bulgares haltères pied avant surélevé : poses A, B2 (de face, profondeur modérée), M. GIF de travail 1376×768 `fentes-bulgares-preview.gif`. Conversion au format application à faire. Voir `SUIVI-fentes-bulgares.md`.
3. Leg extension : A3, M5, B4 retenues ; GIF au format application `leg-extension-app.gif` (440×440). Non intégré. Voir `SUIVI-leg-extension.md`.
4. à 10 : non commencés.
