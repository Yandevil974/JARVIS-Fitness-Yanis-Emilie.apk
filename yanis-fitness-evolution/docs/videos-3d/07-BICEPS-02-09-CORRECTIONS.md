# Biceps #02 et #09 — reprise prioritaire depuis test7

Date : 22/10/2026  
Point de reprise : `c88ae9f` (`v1.5.1-videos-vague1-test7`).  
Les essais postérieurs à test7 ne sont **pas** repris.

> **Correction prioritaire de Yanis — 22/10/2026 :** sur #02 comme sur #09,
> les mains de la position de départ doivent être orientées **paumes vers le
> sol**. Les anciennes images avec les paumes vers le haut sont rejetées. Les
> fichiers ci-dessous sont les nouveaux candidats corrigés, encore soumis à la
> validation de Yanis ; aucune vidéo n'est activée.

## 1. Personnage verrouillé par Yanis

**Image maître :** [reference-personnage-verrouille.jpg](./reference-personnage-verrouille.jpg)  
SHA-256 : `fc7b899d9ab2aa0f68408acbcaf36022a4c005fe5759b2640083ed2cf9d307d9`.

Cette capture fournie par Yanis est l'unique ancre d'identité pour les prochains
visuels : homme massif chrome argenté, casquette noire mate, short noir,
chaussures blanches, salle grise claire, muscles actifs orange. Ne pas changer
de visage, de morphologie, de matière, de casquette ou de décor entre les exercices.

**Verrou de production :** aucune vidéo n'est marquée `validated` sans contrôle
du geste ET de la prise en zoom. Les visuels ci-dessous restent des propositions
de production tant que Yanis n'a pas validé le geste corrigé.

---

## 2. Biceps #02 — Curl Scott barre EZ, pronation

### Images à ouvrir / télécharger

- [Visuel #02 — position de départ basse](./vague1-biceps-02-scott-ez-pronation.jpg)
- [Zoom #02 — contrôle de la prise](./vague1-biceps-02-zoom-prise.jpg)

SHA-256 du candidat #02 : `963a3316ea1bef5093fcb1151d3bbf0fd36c0f607ff94d56747735f3a4d0f010`.

### Description précise du geste

Assis au pupitre, buste contre le support et haut des bras posés à plat sur le
coussin incliné. Tenir **une barre EZ** des deux mains en **prise pronation /
inversée** : paumes vers le sol, dos des mains vers le plafond, doigts passant
au-dessus de la barre puis refermés dessous, poignets droits. Au départ de la
photo, les coudes sont presque tendus mais non verrouillés et la barre est basse.

1. **Montée (2,5 s)** : fléchir uniquement les coudes et amener la barre EZ vers
   le menton. La pronation reste identique du début à la fin.
2. **Descente (2,5 s)** : revenir lentement à la position exacte de la photo,
   sans relâcher la prise et sans verrouiller brutalement les coudes.
3. **Immobiles** : haut des bras contre le coussin, épaules, buste, hanches,
   genoux, tête et caméra. La barre reste horizontale et ne se déforme pas.

**Non conforme :** supination, paumes vers le haut, prise mixte, doigts pointés
vers le haut, barre droite, bras qui décollent du pupitre ou élan du buste.

### Prompt Arena Video / PixVerse (à copier avec le visuel #02)

```text
Animate the EXACT same massive silver-chrome athletic man from the supplied image, keeping his matte black baseball cap, black shorts, white sneakers, grey gym and stable orange biceps glow unchanged. START at the exact low position in the image: seated at a preacher bench, upper arms flat on the inclined pad, elbows nearly extended but softly unlocked, one horizontal chrome EZ curl bar held low with BOTH hands in a fixed OVERHAND PRONATED GRIP. Palms face the floor, backs of hands face up, fingers wrap over and down around the bar, wrists straight. PHASE 1 (2.5 seconds): bend ONLY the elbows and curl the EZ bar smoothly upward toward the chin; maintain the exact same pronated grip throughout. PHASE 2 (2.5 seconds): lower the bar slowly along the same arc to the exact start position without locking the elbows. LOCKED: upper arms glued to the pad, shoulders, torso, hips, head and camera still; bar rigid, horizontal and undeformed; no wrist rotation. Static front three-quarter camera, natural continuous movement, end frame identical to the first frame. AVOID: supination, underhand grip, palms turning up, mixed grip, fingers pointing upward, straight bar, moving shoulders, arms lifting off the pad, swinging torso, morphing equipment, extra fingers or limbs, flickering glow, text, logo, watermark.
```

---

## 3. Biceps #09 — Curl deux haltères au banc Scott 90°, supination

### Images à ouvrir / télécharger

- [Visuel #09 — position de départ basse, paumes vers le sol](./vague1-biceps-09-supination-scott-90.jpg)
- [Zoom #09 — contrôle de la prise corrigée](./vague1-biceps-09-zoom-prise.jpg)

SHA-256 du candidat #09 : `c1b873782784afc391baeb70066e804079cd5a807f08f594cb35604dfafec7f1`.

### Position de départ corrigée

Assis bien droit sur le siège à 90°, buste contre le support, haut des bras à
plat sur le pupitre. Tenir **deux haltères séparés**, bas, avec les coudes
presque tendus mais non verrouillés. Au départ de la photo, les deux mains sont
en **pronation** : **paumes vers le sol, dos des mains visible vers le haut,
doigts passant par-dessus les poignées puis refermés dessous**, poignets droits.

**Non conforme au départ :** paumes vers le haut ou vers le corps, poignées
soutenues par le dessous, prise neutre/marteau, haltères déjà levés, un seul
haltère, haltères fusionnés, barre EZ, bras décollés du pupitre ou élan.

### Verrou avant prompt vidéo

La correction demandée par Yanis verrouille **la position de départ de l'image**.
L'ancien prompt qui imposait une supination fixe dès le départ est retiré.
Avant toute génération MP4, Yanis doit encore confirmer la trajectoire de #09 :

- soit les paumes restent vers le sol pendant toute la répétition ;
- soit elles commencent vers le sol puis effectuent une supination pendant la
  montée, avec la rotation inverse au retour.

Tant que ce choix et le nouveau visuel ne sont pas validés, #09 reste `pending`
et aucune consigne de mouvement n'est présentée comme définitive.

---

## 4. Grille de validation avant intégration MP4

- [ ] Même athlète que l'image maître dans toutes les images et les vidéos.
- [ ] #02 : deux mains en pronation sur une barre EZ, vérifiées en zoom.
- [ ] #09 : deux haltères, paumes vers le sol au départ, vérifiées en zoom ;
      trajectoire de rotation confirmée avant le prompt MP4.
- [ ] Haut des bras en contact avec le pupitre pendant toute la répétition.
- [ ] Une montée et une descente contrôlées, sans élan ni coude verrouillé.
- [ ] Matériel, mains, membres et glow stables ; caméra fixe.
- [ ] Validation explicite de Yanis avant de passer l'entrée à `validated`.
