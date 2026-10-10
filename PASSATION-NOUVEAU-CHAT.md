# Passation — JARVIS Fitness, animations HOMME (B-04)

Date : 10 octobre 2026. Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`.

## Branche (obligatoire)

`arena/83fa8373-jarvis-fitness-yanis-emilie-ap`

Ne pas changer de branche. Ne jamais forcer le push (`git push --force`) : l'utilisateur pousse aussi sur cette branche (commit `c55a13e`). Avant tout push, faire `git fetch origin <branche>` et vérifier que le HEAD local contient le distant. Le dépôt local a déjà été réinitialisé deux fois pendant la session ; vérifier `git log` au démarrage.

## Consignes de l'utilisateur (à respecter)

1. **Présenter chaque GIF dès qu'il est terminé** (pas de regroupement en lot de 10). Utiliser `present_file` puis donner le lien GitHub.
2. **Ne rien intégrer** dans `public/media/`, `src/` ou `release/` sans autorisation explicite. Le front squat a été intégré après autorisation ; les autres GIF attendent la leur.
3. **Physique** : personnage musclé, comme le front squat validé. Ne pas le rendre mince.
4. **Banc / décor** : quand la vue est de profil, le banc doit aussi être vu de profil, à la même place sur toutes les images d'une même séquence.
5. **Essayer d'autres angles** quand une pose échoue (ex. face → profil).
6. **Références** : chercher des modèles en ligne (`image_search`), les stocker dans `image-search/` (exclu du dépôt). Ne consigner dans les suivis que les URL réellement ouvertes ; distinguer aperçus d'images et pages chargées.
7. **Ne pas ajouter** `tmp-front-squat/` ni `image-search/` au dépôt.
8. Limite technique : 10 appels `generate_image` maximum par tour. Si un fichier de référence est introuvable, relancer `image_search`.

## État du lot HOMME

| # | Exercice | État | Fichiers clés |
|---|---|---|---|
| 1 | Front squat HOMME B-04 | **Intégré** (M4, GIF 440×246, hash `6008e0f8a2557d40`). Référencé dans `src/data/legacy.json` (elite, « front squat »). `release/` patché uniquement pour ce GIF. | `front-squat-A.png`, `front-squat-M4.png`, `front-squat-B.png` |
| 2 | Fentes bulgares haltères pied avant surélevé | **GIF terminé, non intégré** : `fentes-bulgares-profil-banc-app.gif` (440×246, A → M → B5 → M → A, banc de profil). | `fentes-bulgares-A-banc-profil2.png`, `fentes-bulgares-M-banc-profil.png`, `fentes-bulgares-B5-banc-profil.png` |
| 2b | Fentes — version de l'utilisateur | Version 2 poussée par l'utilisateur (commit `c55a13e`) : `fentes-bulgares-profil-app-v2.gif`. | — |
| 3 | Leg extension | **GIF terminé, non intégré** : `leg-extension-app.gif` (440×440, A3 → M5 → B4 → M5 → A3, vue trois-quarts, physique musclé). | `leg-extension-A3.png`, `leg-extension-M5.png`, `leg-extension-B4.png` |
| 4 | Tractions | **Bloqué** : pose A rejetée de face et de profil (le personnage reste debout sur le tapis). | `tractions-A.png`, `tractions-A-profil.png`, `SUIVI-tractions.md` |
| 5+ | Exercices suivants | Non commencés. Liste dans la bibliothèque (`src/data/library.js`, exercices sans GIF). Pistes : développé couché prise serrée, good morning debout, fentes marchées, développé haltères incliné 45°, rowing haltère buste penché, écartés haltères. | — |

Dossier de travail : `yanis-fitness-evolution/animations/themeB/_sources/B-04/`. Suivis : `SUIVI.md` (front squat), `SUIVI-fentes-bulgares.md`, `SUIVI-leg-extension.md`, `SUIVI-tractions.md`.

## Décisions en attente de l'utilisateur

- Fentes : garder la version 2 de l'utilisateur ou la série de l'assistant (`fentes-bulgares-profil-banc-app.gif`) ?
- Autoriser ou non l'intégration des GIF fentes et leg extension dans l'application.
- Tractions : pose suspendue (pieds au-dessus du tapis) à réessayer, ou passer à un autre exercice.

## Pièges rencontrés

- Le générateur ne produit pas la flexion de la jambe avant de fentes de face : passer au profil.
- Le générateur pose les pieds au sol pour les tractions : demander explicitement une suspension, pieds au-dessus du tapis.
- Une image trop différente (banc à une autre place, machine différente) casse la séquence : toujours partir de la dernière pose validée comme référence.
- Ne pas présenter un GIF avant de l'avoir vérifié visuellement (la flexion et le banc doivent être visibles).

## Liens GitHub (branche `arena/83fa8373-jarvis-fitness-yanis-emilie-ap`)

Base : https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/arena/83fa8373-jarvis-fitness-yanis-emilie-ap/yanis-fitness-evolution/animations/themeB/_sources/B-04/

- Fentes profil (terminé) : `fentes-bulgares-profil-banc-app.gif`
- Fentes version 2 utilisateur : `fentes-bulgares-profil-app-v2.gif`
- Leg extension (terminé) : `leg-extension-app.gif`
- Front squat intégré : `public/media/6008e0f8a2557d40.gif`
