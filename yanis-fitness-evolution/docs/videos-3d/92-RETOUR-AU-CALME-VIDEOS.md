# Retour au calme : la liste « Terminer en douceur » suit les vidéos

Signalé par capture d'écran le 22/10/2026 : en cliquant sur **Étirements** dans une séance, la page « Terminer en douceur » affichait encore les anciens GIF, alors que le chrono lancé depuis cette même page montrait bien les nouvelles vidéos 3D, et que la fiche détaillée d'un étirement les montrait aussi.

## Cause

`CooldownModal` (`src/components/modals/ProtocolModals.jsx`) dessinait systématiquement `stretchImage(ex, profil)` (le GIF), sans consulter `stepVideoFor(nom)`. Le chrono (`TimerModal`) et `StretchModal` consultaient déjà cette table. La page était donc la seule à ignorer les vidéos validées.

## Correction

- Chaque ligne de la liste affiche maintenant la vidéo 3D quand l'étirement en a une, sinon son GIF d'origine (aucun média supprimé).
- La vidéo se lit en boucle, muette, en préchargement de métadonnées, avec le bouton d'agrandissement.
- L'agrandissement ouvre la visionneuse avec le libellé de la vidéo, la réserve de prudence et, si la voix est activée dans les préférences, le descriptif parlé.
- Aucun changement du chrono, des prescriptions ni des GIF : le comportement de « Lancer les étirements guidés » reste identique.

## Contrôle

`tests/cooldown-stretch-video.spec.js` ouvre la page pour les deux profils et vérifie, ligne par ligne, que la vidéo correspond exactement à `stepVideoFor(nom)` et que les autres étirements gardent une image. Le test est ajouté aux deux workflows (`training-layout-check`, `android-release`).

## Ce que la page montrera encore en GIF

Cinq étirements ont une vidéo validée aujourd'hui : bras tendu contre la poitrine, coude au-dessus de la tête, cobra, position de l'enfant et talon vers la fesse debout. Deux d'entre eux ont deux libellés dans les données (« Cobra doux » / « Étirement du cobra », « Position de l'enfant » / « Position de l'enfant (Balasana) ») et partagent donc la même vidéo. Les autres — par exemple « Suspension à la barre », « Torsion allongée », « Étirement dans l'encadrement de porte », « Bras tendu contre le mur » visibles sur la capture — n'ont pas encore de vidéo : leur GIF reste affiché tant qu'aucune vidéo n'est validée. C'est le prochain lot d'étirements, pas un défaut de cette correction.

## État

Aucune APK publiée pour cette correction : elle sera incluse dans la prochaine. Aucun crédit de génération consommé.
