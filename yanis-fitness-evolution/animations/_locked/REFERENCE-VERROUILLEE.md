# 🔒 RÉFÉRENCE VERROUILLÉE — GIFs JARVIS FITNESS
**Verrou posé le 11 octobre 2026.** À lire par **tout agent** avant de produire quoi que ce soit.

---

## 1. OÙ EST LE VERROU

Dossier **`yanis-fitness-evolution/animations/_locked/`** — c'est la base commune. Il est poussé sur GitHub
(branche `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`) : **n'importe quel agent peut le lire, personne ne le modifie sans l'accord de l'utilisateur.**

```
animations/_locked/
  REFERENCE-VERROUILLEE.md            ← ce document (la règle)
  reference/
    01-FRONT-SQUAT-verrouille-...gif  ← GIF de référence, intégré dans l'app
    02-FENTES-BULGARES-verrouille.gif ← GIF de référence, profil + banc fixe
    03-LEG-EXTENSION-verrouille.gif   ← GIF de référence, format app
    POSE-A-front-squat-reference-decor.png  ← LA référence décor, pleine résolution
    DECOR-reference-terrasse-mer.jpg        ← la même, allégée pour lecture rapide
```

**Ces 3 GIF et cette image sont le mètre-étalon.** Toute nouvelle image doit leur ressembler.
Si une image ne ressemble pas à `POSE-A-front-squat-reference-decor.png`, elle est **fausse** : on la jette avant de la montrer à l'utilisateur.

---

## 2. LE VERROU — RÈGLES NON NÉGOCIABLES

> **1. MON ATHLÈTE — TOUS LES GIFS DOIVENT LUI RESSEMBLER.**
> Mannequin anatomique 3D **très musclé** · corps **blanc / argent mat** · visage **noir mat, sans aucun trait** · **casquette blanche** · **short noir** · **baskets blanches** · muscles travaillés surlignés **jaune-orangé doré**.
> La référence prioritaire reste **la photo de l'utilisateur**.
> **Ne jamais régénérer, remplacer ni réinterpréter ce personnage.**

> **2. LE DÉCOR EST FIGÉ — IL DOIT RESSEMBLER AUX 1ers GIF VALIDÉS.**
> Terrasse claire au bord de mer · **mer visible** · **palmiers et végétation en arrière-plan** · **muret bas blanc bien dégagé** · lumière neutre, **non saturée**.
> **Interdits** : salle de sport, parquet, mur intérieur, miroir, fond gris, mer saturée montant à l'horizon, végétation au premier plan masquant le muret.

> **3. UNE IMAGE DOIT ÊTRE PROPOSÉE POUR CHAQUE EXERCICE.**
> Une **seule image fixe** de validation, **par exercice**, **avant** tout GIF — pour que l'utilisateur vérifie que **tous ses critères** sont pris en compte. Puis **attendre son accord explicite**.
> **Aucune pose M, aucune pose B, aucun GIF, aucune planche avant cet accord.**
> L'agent vérifie **lui-même** le personnage et le décor avant de présenter. L'utilisateur ne doit pas avoir à redemander.

> **4. EN CAS DE DOUTE SUR LA COMPOSITION D'UN GIF.**
> Se référer à **tous les sites de fitness existants** qui proposent photos et GIFs d'exercices, et s'y conformer (posture, amplitude, prise, angle de vue, placement du matériel). Consigner les références réellement consultées.

> **5. CHAQUE GIF RÉALISÉ DOIT ÊTRE PRÉSENTÉ** dès qu'il est terminé. Pas de lot de 10, pas d'attente de regroupement.

> **6. « Y » = RELANCER LE CHAT.** Ce n'est pas une validation.

> **7. RIEN NE SE MODIFIE SANS AUTORISATION.** Ne rien changer dans `public/media/`, `src/`, `release/`, et ne supprimer aucun GIF, sans accord explicite.

---

## 3. NE JAMAIS PARTIR DE CES BASES (elles sont fausses)

| Source | Pourquoi c'est interdit |
|---|---|
| `public/media/*.gif` (94 fichiers de la session, 325 sur la branche) | corpus historique de l'app : dessins au trait, photos de salle, anatomies rouges. **Pas le style verrouillé.** |
| `animations/**/LOT-*.gif`, `PLANCHE-*.gif` | planches de montage, plusieurs exercices par image. Ce ne sont **pas** des GIF d'exercice. |
| `evolution/media/refonte-photo/` (branches septembre) | corpus **abandonné** : photo réelle, salle de sport, muscles **vert lime**. |
| `poc/back-squat.gif` | hors format (portrait 480×860), disques coupés, 3ᵉ pose debout. **Conservé avec réserves, ne pas imiter.** |
| Tout GIF marqué **ÉCART** dans `animations/_audit/` | cassé ou non conforme — à refaire, pas à copier. |

---

## 4. MÉTHODE DE PRODUCTION (celle qui a marché)

1. **Partir de la dernière pose validée** comme image d'entrée (jamais de zéro).
2. **Retoucher** : « garde tout identique, change uniquement … ». Ne rien recréer : le visage, le décor et le cadrage ne se régénèrent pas.
3. **Vérifier soi-même** : personnage, tenue, rendu mat, muscles dorés, **muret bas blanc dégagé**, **mer visible mais non saturée**, **végétation en arrière-plan**.
4. Contrôler les **3 poses** A / M / B, puis assembler.
5. **Format app** : 5 images `A → M → B → M → A` (retour à A pour la boucle).
6. **Présenter immédiatement**, puis attendre l'accord. **Ne rien intégrer sans autorisation.**
7. Choix des outils d'assemblage : `imagemagick` (`convert -delay`).
8. Garder les dossiers de travail (`image-search/`, `tmp-*`) **hors du dépôt**.

## 5. DÉCOR — ⚠️ CORRECTION DU 11 OCTOBRE 2026 (preuve chiffrée)

> **Cette section remplace la version précédente, qui allait dans le MAUVAIS SENS et aurait abîmé 25 GIF conformes.**
> Mesures refaites sur les images elles-mêmes (saturation moyenne, `-colorspace HSL`). Preuves visuelles dans
> `reference/DECISION-DECOR-11-OCT.jpg`, `reference/1ers-GIFs-valides-vs-fichier-utilisateur.jpg`,
> `reference/front-squat-verrou-vs-1ers-valides.jpg`.

### Les trois rendus, mesurés

| Rendu | Saturation | Qui | Ce qu'on voit |
|---|---|---|---|
| **A — DENSE** | **36 à 47** | POC (5 oct.), lots 1-5 (5-6 oct.), theme A début, **et le fichier de l'utilisateur (23,1)** | **mer bleue bien visible montant dans le cadre**, **végétation dense au 1er plan**, lumière dorée, plantes en pot, mur bas de couleurs différentes |
| **B — PÂLE** | **13 à 21** | travail du **7 au 10 oct.** (B-01 → B-04, theme A fin) : front squat, fentes bulgares, leg extension, bulgarians, goblet, squat cycliste, leg press, presse, step-up, abductions, pallof, face-pull… | presque **tout pâle**, mer **à peine perceptible**, végétation rare, mur blanc haut |

### La dérive, facts

La production est passée du rendu **A** (5-6 oct.) au rendu **B** (7-10 oct.) **sans que personne ne le décide explicitement**.
**19 GIF** sont au rendu B, **25 GIF** au rendu A.

### Ce que dit la consigne de l'utilisateur

> « décor mer et végétation ressemblant aux **1ers gifs qui ont été validés** »

Les 1ers GIF validés (POC du 5 oct., lots 1 à 5) sont au rendu **A — DENSE**. Le fichier de référence envoyé par
l'utilisateur le 11 octobre est **du même côté** (mer visible, végétation dense, plantes en pot).
**Le rendu verrouillé est donc le A — DENSE.**

⚠️ **Mais** : les 3 GIF que l'utilisateur a explicitement validés les 10-11 oct. (front squat, fentes bulgares,
leg extension) sont au rendu **B — PÂLE**. Sa validation portait sur la **pose** (c'était le sujet des échanges),
pas sur le décor.

**→ Question posée à l'utilisateur le 11 octobre : garder A (dense, conforme à ses 2 références) ou B (pâle,
conforme à ses 3 dernières validations de pose) ? Ce choix fixe quels GIF doivent être réalignés : 19 si A, 25 si B.**

### Interdits (inchangés)

Salle de sport, parquet, mur intérieur, miroir, fond gris.

*Verrou posé sur la branche `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`. Plan de correction chiffré : `animations/_audit/2026-10-11/PLAN-CORRECTION.md`.*

---

## 5 bis. ✅ DÉCISION DE L'UTILISATEUR — 11 OCTOBRE 2026 : **CIBLE E1 (DENSE) — VERROUILLÉE**

> **L'utilisateur a choisi E1.** Le décor de référence est **celui de son fichier**
> `00-ATHLETE-REFERENCE-utilisateur-2026-10-11.jpg`, qui est **aussi celui des 1ers GIF validés**
> (POC du 5 oct., lots 1 à 5).

### Ce que ça veut dire concrètement

| | Cible verrouillée **E1 / DENSE** |
|---|---|
| Mer | **bleue, bien visible**, montant dans le cadre |
| Végétation | **dense**, palmiers et plantes, y compris au premier plan |
| Plantes en pot | présentes sur la terrasse |
| Lumière | chaude / dorée |
| Muret bas | présent mais **secondaire** |
| Saturation mesurée | **22 → 47** |

**Est considéré NON conforme :** tout décor « pâle » (saturation < 22) où la mer est à peine perceptible
et la végétation absente. C'est le rendu de la production du 7 au 10 octobre : **il doit être réaligné sur E1.**

**Cette question ne doit plus être reposée.** E1 est la cible jusqu'à nouvel ordre explicite de l'utilisateur.

⚠️ **Conséquence à assumer :** le **front squat** (saturation 14,9) est aujourd'hui **intégré dans l'app**
avec un décor pâle, donc **hors cible E1**. Idem pour les 2 GIF terminés (fentes bulgares 17,1 et
leg extension 14,1). Ne rien modifier dans l'app sans autorisation explicite, mais **le signaler**.

*Mesure reproductible : `convert IMG -resize 400x -colorspace HSL -channel G -separate +channel -format "%[fx:mean*100]" info:`*
