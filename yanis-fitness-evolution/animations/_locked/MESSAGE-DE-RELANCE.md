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

CHIFFRES VERROUILLÉS : 307 exercices · 39 livrés · 268 restants.
À corriger : 1 cassé (bulgarian) + 20 décors à réaligner sur E1. Pas plus : les listes
plus longues qui circulaient venaient d'erreurs de lecture, corrigées le 11 octobre.

1er TRAVAIL — corriger les GIF (vérifié image par image le 11 octobre) :

A. LE SEUL GIF VRAIMENT CASSÉ : themeB/bulgarian-split-squat-3poses.gif
   (images 2, 3 et 4 = fond vide, aucun athlète). À régénérer entièrement.
   ATTENTION : bulgarian-split-squat et fentes-bulgares-halteres-pied-avant-sureleve
   sont DEUX exercices distincts — interdiction de réutiliser le même GIF.

B. 20 GIF au décor PÂLE à réaligner sur E1 (l'animation est correcte) :
   presse-a-cuisses · back-squat-charge-moderee · bulgarian-halteres · leg-press ·
   goblet-squat · leg-extension · step-up · squat-cycliste · abduction-assise ·
   pallof-press · squat-poids-du-corps · face-pull · clamshell · fire-hydrant ·
   abduction-hanche · pompes · gainage-planche · pont-fessier-activation ·
   front squat (déjà dans l'app) · fentes bulgares (terminé)
   MÉTHODE : garder le personnage et la pose, régénérer UNIQUEMENT les 3 FONDS,
   puis relancer build/faire-gif.sh. Aucune régénération d'athlète.

C. POC back-squat : hors format (portrait 480x860) — hors périmètre, à trancher.

8 GIF du thème A + les 3 lots 4/5 + les circuits sont DÉJÀ conformes E1 : ne pas y toucher.

VÉRIFICATION — méthode obligatoire (sinon on se trompe) :
   convert GIF -coalesce -format "%s:%wx%h moy=%[fx:int(mean*100)]%% ec=%[fx:int(standard_deviation*100)]%%\n" info:
   Piège : identify sur un GIF non coalescé affiche une image 1x1 sur des fichiers SAINS.
   Toujours coalescer avant de conclure.

OUTIL PRÊT : build/faire-gif.sh A.png M.png B.png 440x246 sortie.gif
   (assemble A->M->B->M->A avec les délais officiels 25/20/50/20/25 cs et mesure le décor)

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
