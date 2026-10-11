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

## 5. DÉCOR — LES DEUX RENDUS À NE PAS CONFONDRE

| | ✅ VERROUILLÉ (B-04, 10-11 oct.) | ❌ À NE PAS REPRODUIRE |
|---|---|---|
| Mer | bande **pâle et calme à l'horizon** | mer **turquoise saturée montant haut** |
| Muret bas blanc | **visible, continu, dégagé** | masqué par la végétation |
| Végétation | quelques palmiers **en arrière-plan** | dense, au premier plan, floue |
| Lumière | **neutre**, rendu photo | très saturée, dorée, aspect « peint » |

### Mesures réelles (11 octobre 2026)

| Image | Saturation bande haute | Saturation globale |
|---|---|---|
| **Votre fichier** `00-ATHLETE-REFERENCE…jpg` (développé couché prise serrée) | **20,4** | **23,1** |
| **Verrou** `POSE-A-front-squat-reference-decor.png` | **18,4** | **15,1** |

Le chiffre est **proche** — mais l'œil voit autre chose, et c'est ça qui compte :

- Sur **votre fichier**, la **mer turquoise saturée occupe tout le haut de l'image**, et la **végétation sombre
  vient au premier plan**, encadrant l'athlète.
- Sur le **verrou**, il y a une **bande pâle ciel + mer à l'horizon**, le **muret bas blanc bien dégagé**, et la
  végétation reste **en arrière-plan**.

**Ce n'est donc pas la couleur qui diffère, c'est la composition** : place de la mer, présence du muret, proximité
de la végétation. C'est ce point précis qui décide de la cible des corrections (voir `PLAN-CORRECTION.md`).

---

*Verrou posé sur la branche `arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`. Plan de correction chiffré : `animations/_audit/2026-10-11/PLAN-CORRECTION.md`.*
