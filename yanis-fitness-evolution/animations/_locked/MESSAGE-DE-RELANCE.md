# MESSAGE DE RELANCE — à copier-coller dans un nouveau chat

> Remplace le message précédent. **La décision décor est prise : E1.** Ne plus la reposer.

---

## TEXTE À COPIER

```
Lis _locked/REFERENCE-VERROUILLEE.md puis _locked/SUIVI-COMMUN.md.
Le décor est VERROUILLÉ : cible E1 (mer bleue bien visible + végétation dense,
lumière chaude) = le décor de mon fichier et des 1ers GIF validés.
Ne me repose plus la question du décor.

RÈGLE NON NÉGOCIABLE :
1. Mon athlète : mannequin 3D très musclé, corps blanc/argent mat, visage noir
   sans traits, casquette blanche, short noir, baskets blanches, muscles
   jaune-orangé doré. Intouchable.
2. Décor E1 verrouillé, mer visible. Toute image qui s'en écarte est rejetée
   avant de m'être montrée.
3. Une image fixe par exercice AVANT tout GIF, puis j'attends mon accord explicite.
4. En cas de doute sur la composition d'un GIF, me référer aux sites de fitness
   existants qui proposent photos et GIFs.
5. Chaque GIF terminé m'est présenté immédiatement.
6. « Y » = relance du chat, ce n'est pas une validation.

CHIFFRES VERROUILLÉS : 307 exercices · 39 livrés · 268 restants · 21 à corriger.

1er TRAVAIL — corriger les GIF (dans cet ordre) :
A. Les 4 cassés/déformés : bulgarian-split-squat (cassé), goblet-squat (pose B
   écrasée), step-up (le banc bouge), squat-cycliste (l'échelle saute).
   ATTENTION : bulgarian-split-squat et fentes-bulgares-halteres-pied-avant-sureleve
   sont DEUX exercices distincts — pas le même GIF.
B. Réparation gratuite : leg-extension-3poses.gif (4 images) → remplacer par
   la version app 5 images déjà prête, puis réaligner le décor.
C. Les 16 autres au décor pâle : garder le personnage et la pose, régénérer
   UNIQUEMENT le fond sur E1. (dont front squat, fentes bulgares déjà terminées)

MÉTHODE : partir de la dernière pose validée, jamais de zéro. Retoucher, ne pas
recréer. Vérifier toi-même personnage + décor E1 avant de me montrer. 10 appels
image par tour maximum.

DONNE-MOI AUSSI LE FEU VERT D'INTÉGRATION pour les 2 GIF terminés
(fentes bulgares et leg extension) : ils sont prêts, ils font passer l'app de
1 à 3 exercices animés, sans aucune génération.

Rien dans public/media, src, release sans mon autorisation.
```

---

## POURQUOI CES CHIFFRES (vérifiés le 11 octobre 2026)

| | |
|---|---|
| Périmètre actif HOMME | **307** |
| Livrés | **39** (12,7 %) |
| Restants | **268** |
| À corriger sous cible E1 | **21** |
| Conformes E1 | **18** |

**Méthode de mesure du décor** (rejouable) :
```bash
convert IMG -resize 400x -colorspace HSL -channel G -separate +channel \
        -format "%[fx:mean*100]" info:
```
→ **E1 conforme : ≥ 22.** Décor pâle : < 22.

**Preuves visuelles :** `reference/DECISION-DECOR-11-OCT.jpg`,
`reference/1ers-GIFs-valides-vs-fichier-utilisateur.jpg`,
`reference/front-squat-verrou-vs-1ers-valides.jpg`

**Table complète :** `QUEUE-CORRECTION.tsv` (50 GIF mesurés et classés).
