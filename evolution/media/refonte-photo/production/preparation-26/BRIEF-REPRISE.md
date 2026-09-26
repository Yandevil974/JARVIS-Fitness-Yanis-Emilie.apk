# N°26 — fiche de reprise, PAS une proposition visuelle

Préparée le 26/09/2026 après lot67. **0 génération ce tour** : outil de génération d’images indisponible. Ne pas compter cette fiche comme une correction, un candidat ou une validation. Aucun lot68 produit.

## Demande conservée

« Crunch poulie : mains et corde derrière la tête ; éloigner davantage de la machine. »

- Identifiant : `crunch-a-la-poulie|homme`, numéro PDF figé **26**.
- Yanis : référence `planches/maitre-homme.png`, même visage A et physique. Aucune famille C.
- Prescriptions conservées : consulter `production/prescriptions.json`. Ne pas changer séries, répétitions, tempo, repos ou remplacer le mouvement pour justifier une image.
- AVANT : GIF exact et SHA dans `production/retours-utilisateur-2026-09-26.json`, commit figé e538e03823ea7830d97cf897f8a0d503c9625bd4.

## Ce qui a échoué

- Lot60 : inscription parasite, câble non raccordé à la corde, flexion trop faible.
- Lot62 : le modèle n’a pas respecté l’orientation demandée ; mains et corde repassent devant la tête en fin, athlète trop proche de la station.
- Ne pas reprendre la mauvaise paire entière comme référence dominante. Ne pas recommencer seulement en ajoutant davantage de négations au même prompt.

## Nouvelle stratégie : construire l’arrivée d’abord

Une photo unique, profil stable, puis édition de cette photo pour la phase de départ. L’arrivée doit être acceptée au contrôle interne avant tout assemblage.

### Repères de composition (à guider visuellement, non prescription biomécanique)

- Athlète agenouillé au centre-gauche, **visage orienté vers la gauche**.
- Station à **droite et derrière l’athlète**, poulie haute clairement visible.
- Espace de sol nettement visible entre athlète et station ; ne pas inscrire une distance chiffrée ni inventer une consigne de charge.
- Un câble continu depuis la poulie haute jusqu’au point d’attache de la corde. Deux extrémités de corde, chacune réellement tenue dans une main.
- Mains près de l’arrière de la tête, corde derrière la tête, sans tirer sur la nuque. Ne pas dessiner une corde enroulée autour du cou.
- Le câble passe du côté arrière du crâne vers la station, pas à travers la tête ou le corps. Son raccord à la corde doit rester lisible.
- Arrivée : enroulement visible du haut du tronc vers les genoux, pas seulement flexion des bras ou mouvement de tête ; bassin et genoux stables, corps toujours dans le même sens.
- Cadrage large et constant : sommet du crâne, mains, coudes, genoux, chaussures, poulie et attache tous entiers.

Ces repères doivent être contrôlés anatomiquement sur le rendu réel. Une bonne disposition des points ne constitue pas une validation du geste.

### Prompt de départ pour la photo d’arrivée

Single full-body photograph, not a diptych. Use the reference male athlete, same face and physique, black shorts and shoes, warm parquet gym. Kneeling cable abdominal crunch FINISH. Clear side profile: athlete faces LEFT, cable station behind him at RIGHT. Visible floor gap between athlete and station. Both hands hold the two ends of the rope near the BACK of the head; rope stays behind the head, not in front of the face, never around the neck. One continuous cable connects the high pulley to the rope attachment behind and above the head. Trunk curls forward through the spine toward the knees, hips and knees stable, not a mere arm pull. Green abdominal muscle overlay on skin. Entire head, both hands, elbows, knees, shoes and pulley visible. No text, arrows, duplicate cables or extra limbs.

Si le modèle ignore de nouveau l’orientation, préparer un guide de points/câble indépendant et lire son rendu avant de produire la phase opposée. Ne pas accepter des mains revenues devant le visage pour augmenter le compteur.

### Phase de départ, après contrôle de l’arrivée

Éditer uniquement l’enroulement du tronc pour retrouver le départ plus redressé. Garder le même profil, caméra, machine, genoux et bassin. Mains/corde toujours derrière la tête ; le câble reste raccordé et suit le déplacement de la corde. Aucun miroir ou rotation globale. Assembler ensuite DÉBUT à gauche / FIN à droite.

## Porte de contrôle avant de déclarer une proposition

- [ ] Deux mains anatomiquement lisibles, tenant réellement la corde derrière la tête dans les DEUX phases.
- [ ] Câble relié sans discontinuité ni second câble parasite ; rien ne traverse le crâne ou le corps.
- [ ] Même station, orientation, cadrage et distance ; espace de sol visible.
- [ ] Enroulement réel du tronc, pas une traction de nuque ou des bras seulement.
- [ ] Aucun membre en trop ; tête, chaussures, mains et machine non coupées.
- [ ] Vert sur les abdominaux aux deux phases, mesuré dans une ROI corporelle hors décor ; ne pas confondre présence mesurée et validation stylistique.
- [ ] Lecture pleine définition, gros plans au doute, contrôle du GIF et de ses raccords.
- [ ] GIF isolé sous `propositions/`, SHA enregistré, validation utilisateur false. Laisser toutes les réserves explicites.

Le format seul ne suffit pas. Si le mouvement reste faux, conserver le refus et ne pas produire de GIF candidat. Maximum10 appels par tour, échecs compris.

## Après réussite seulement

Mettre à jour les deux registres, mesures, review, passations et vérification ; commit/push sur la branche Arena imposée. Aucune modification de `gif/`, livraison, manifeste, numérotation, état ou APK sans accord utilisateur.

Puis reprendre85 et204, traiter les réserves des propositions existantes, et produire le PDF comparatif complet des seules reprises (AVANT gauche / APRÈS droite) quand tout est prêt. Avant étape3 : demander le choix du vert identique260. À la construction de l’app : rappeler metcon + piscine fractionnée et/ou Aqua Tabata pour Émilie, confirmer avant coder.
