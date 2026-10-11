# PASSATION ET CONSIGNE — GIFs JARVIS FITNESS
**État au 11 octobre 2026** — à lire en entier avant toute action.

---

# ⛔ RÈGLE NON NÉGOCIABLE — À RECOPIER SUR CHAQUE PASSATION

**1. MON ATHLÈTE — TOUS LES GIFS DOIVENT LUI RESSEMBLER.**
Mannequin anatomique 3D très musclé · corps blanc / argent **mat** · visage noir mat **sans traits** · casquette blanche · short noir · baskets blanches · muscles travaillés **jaune-orangé doré**.
La référence prioritaire reste **MA photo / MA capture**. Ne jamais régénérer, remplacer ni réinterpréter ce personnage.

**2. LE DÉCOR EST FIGÉ.**
Terrasse claire au bord de mer · **mer visible** · **palmiers et végétation** · muret bas blanc.
Il doit ressembler aux **1ers GIF validés**. Aucune modification, aucun remplacement, aucune réinterprétation. Toute image qui s'en écarte est **rejetée et corrigée avant d'être présentée**.

**3. UNE IMAGE DOIT M'ÊTRE PROPOSÉE POUR CHAQUE EXERCICE.**
Une image fixe de validation, **par exercice**, avant tout GIF — pour que je vérifie que **tous mes critères** sont pris en compte.
Puis **j'attends mon accord explicite**. Aucune pose M, aucune pose B, aucun GIF, aucune planche animée avant cet accord.
L'agent doit vérifier lui-même le personnage et le décor **avant** de me montrer l'image : je ne dois pas avoir à redemander que le personnage ou la mer soient conservés.

**4. EN CAS DE DOUTE SUR LA COMPOSITION D'UN GIF.**
Se référer à **tous les sites de fitness existants** qui proposent photos et GIFs d'exercices, et s'y conformer (posture, amplitude, prise, angle de vue, placement du matériel). Consigner les références réellement consultées.

**5. CHAQUE GIF RÉALISÉ DOIT M'ÊTRE PRÉSENTÉ.**
Pas de lot de 10, pas d'attente de regroupement. Un GIF terminé = présenté immédiatement.

**6. « Y » SIGNIFIE RELANCER LE CHAT.** Ce n'est pas une validation. Le chat bloque : « Y » sert à repartir.

---

## 1. BRANCHE

- Branche de session imposée par Arena : **`arena/7a4a778b-jarvis-fitness-yanis-emilie-ap`**. Ne pas en changer. Ne rien pousser ailleurs.
- Branches de référence, **lecture seule uniquement** :
  - `arena/6d7633a6-jarvis-fitness-yanis-emilie-ap` — état du **9 octobre** (77 GIF individuels, le plus fourni).
  - `arena/83fa8373-jarvis-fitness-yanis-emilie-ap` — état du **10 octobre** (lot B-04, front squat intégré).
- Ne jamais `checkout` une branche de référence sur la seule base d'une ancienne passation.

## 2. L'AUDIT EST FAIT — RÉSULTAT EN UNE LIGNE

**77 GIF individuels livrés (45 HOMME + 32 FEMME) · 26 planches · couverture HOMME réelle 42/307 = 13,7 % · 5 écarts techniques vérifiés dont 1 GIF cassé · lot B-04 : 1 intégré, 2 terminés non intégrés, 1 bloqué, 1 introuvable.**

Détail complet, mesures, réconciliation des compteurs 74/76/77 et preuves visuelles :
→ **`yanis-fitness-evolution/animations/_audit/2026-10-11/RAPPORT-AUDIT-2026-10-11.md`**

## 3. CHIFFRES À NE PAS CONFONDRE

| Périmètre | Nombre | Nature |
|---|---|---|
| Chantier HOMME (périmètre **actif**) | **307** entrées | ce qu'il reste à couvrir |
| Couverture HOMME réelle | **42** | 13,7 % |
| Compteur mixte historique | **77 / 614** | hérité, **ne plus l'utiliser comme objectif** |
| `animations/` | 103 fichiers = **77 individuels + 26 planches** | 45 H + 32 F |
| Corpus historique de l'app | 188 GIF (94 public + 94 release) | style d'origine, **pas** le style verrouillé |
| Corpus « refonte-photo » (septembre) | 266 H + 124 F + 511 planches | **abandonné** : photo réelle, salle, vert lime |

Réconciliation : 74 (`069dd4f`), 75 (`d83b70c`), 76 (`fa9d52a`), 77 (`945908f`) sont des **instantanés successifs** du même compteur. **Aucune contradiction** — 77 est l'état réel.

## 4. ÉTAT DU LOT B-04 (à traiter en premier)

| Exercice | État | Fichier |
|---|---|---|
| Front squat | ✅ **validé et intégré** | `public/media/6008e0f8a2557d40.gif` (440×246, 5 img) |
| Fentes bulgares haltères pied avant surélevé | ✅ **terminé**, non intégré | `_sources/B-04/fentes-bulgares-profil-banc-app.gif` (440×246, 5 img, banc fixe) |
| Leg extension | 🟡 **version app terminée**, non intégrée | `_sources/B-04/leg-extension-app.gif` (440×440, 5 img) |
| Tractions | ❌ **bloqué** — 2 poses A rejetées (pieds au sol, pas suspendu) | `tractions-A.png`, `tractions-A-profil.png` |
| Développé couché prise serrée | ⚠️ **introuvable** — `developpe-couche-prise-serree-A-validation-v5.png` n'existe sur **aucune** des 36 branches distantes | à reconfirmer avec vous |

Les GIF et les planches de ces 5 cas sont dans `_audit/2026-10-11/gif/B-04/` et `planches/20-…` à `23-…`.

## 5. ÉCARTS VÉRIFIÉS — NE RIEN CORRIGER SANS AUTORISATION

1. **`themeB/bulgarian-split-squat-3poses.gif` — CASSE.** Images 2 et 3 = fond vide, image 4 = 1×1 pixel. Aucune animation.
2. **`themeB/leg-extension-3poses.gif` — 4 images** au lieu de 5, rendu encombré, athlète masqué. Version propre disponible non intégrée.
3. **`themeB/goblet-squat-3poses.gif` — pose basse écrasée** (artéfacts sur l'image 3), fichier régénéré le 5 oct.
4. **`themeB/step-up-sur-banc-hauteur-du-genou-3poses.gif` — cadrage et échelle du banc incohérents** d'une image à l'autre (`squat-cycliste` : même défaut léger).
5. **`poc/back-squat.gif` — portrait 480×860**, disques coupés, 3ᵉ pose debout, câblage 50/50.

**Interdiction : ne rien modifier ni supprimer durant un audit. Demander l'autorisation avant toute correction.**

## 6. À FAIRE AVANT TOUTE NOUVELLE PRODUCTION

1. Lire le rapport d'audit du 11 octobre.
2. Faire valider par l'utilisateur les 6 points listés en §7 du rapport.
3. Demander le fichier de référence `Screenshot_20261011_085401_Google.jpg` (absent de ce chat).
4. **Ensuite seulement** : pour l'exercice suivant, produire **une seule image fixe**, la vérifier soi-même (personnage + décor + lisibilité de la pose), la présenter, puis **attendre l'accord explicite**.
5. Ne rien intégrer dans `public/media/`, `src/` ou `release/` sans autorisation explicite. Présenter les livrables avec `present_file`.

## 7. MESSAGE DE REPRISE (à copier tel quel)

> Lis cette passation en entier. La règle non négociable en tête s'applique : **mon athlète et le décor vue sur mer sont intouchables, une image doit m'être proposée pour chaque exercice avant tout GIF, chaque GIF terminé doit m'être présenté, et « Y » sert à relancer le chat.**
> L'audit du 11 octobre est fait : **77 GIF individuels (45 HOMME + 32 FEMME), 26 planches, couverture HOMME 42/307 = 13,7 %, 5 écarts dont 1 GIF cassé, lot B-04 : 1 intégré / 2 terminés non intégrés / 1 bloqué / 1 introuvable.**
> Ne génère rien. **Montre-moi d'abord le rapport d'audit et le dossier de preuves**, puis attends mes décisions.

---

*Fichiers de cet audit : dossier `yanis-fitness-evolution/animations/_audit/2026-10-11/` — 78 fichiers, aucun livrable du dépôt modifié.*
