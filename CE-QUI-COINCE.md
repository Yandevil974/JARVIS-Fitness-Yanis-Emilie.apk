# 🚧 Ce qui coince — état au 26 septembre 2026, après lot67 — ÉTAPE2 : 26 retours ouverts, corrections à montrer avant validation

## 🚩 Lot68 tour3 (27/09/2026) — 26, 85 ET 204 proposés : toutes les reprises ont une proposition

**6/10 appels ce tour (4 restants). Proposition n°204 isolée NON VALIDÉE** (SHA 4efdfe0c…f3e10 ; hang mort
bras tendus / menton au-dessus de la barre, supination lisible aux deux cases ; réserves : échelle plus grande
en fin — saut de case, défaut aussi présent dans l'AVANT livré —, marge menton modérée). Méthode : éditions
hang→haut refusées par le modèle → retour au DIPTYQUE une génération avec guides.
**26 propositions non validées sur 26 points — 0 sans proposition.** Aucune approuvée ; le « T » reçu NE VALIDE RIEN.
Reste avant PDF : RÉSERVES des propositions (teintes olive 19, débords verts 44/45/80/85, échelle poids 80,
tapis 26, trajectoires, cadrages… voir registres), puis PDF AVANT gauche/APRÈS droite des seules reprises via
`tools/pdf-corrections-avant-apres.py`, accord utilisateur avant intégration. Rien d'intégré ; aucun GIF livré,
manifeste, état ou PDF principal modifié ; pas de valide-couples.py. **Branche : `arena/01a0e12a-jarvis-fitness-yanis-emilie-ap`.**
AVANT étape3 : question vert identique n°260, attendre la réponse. Rappels-utilisateur.json non traité.

Les 389 visuels du PDF restent publiés sans modification. Votre relecture a rouvert
**26 points de suivi** : aucune proposition n’est intégrée avant votre accord.
La relecture interne antérieure ne remplace pas votre validation.

> ⚠️ **Branche de travail changée par la plateforme** : cette session Arena est fixée sur
> `arena/01a0dcad-jarvis-fitness-yanis-emilie-ap`. Le contenu de `arena/01a0dbe5-…` (commit
> `e96e51b`) y a été récupéré intégralement ; tout le travail est désormais poussé sur
> **`01a0dcad`** uniquement. L'ancienne branche n'est plus alimentée.

## 0. Feuille de route donnée par l'utilisateur le 26/09 (dans cet ordre, par étapes)

1. **Piscine + cardio pour Yanis TERMINÉ** : 58 couples homme ajoutés et validés aux lots51–56,
   n°332–389. Câblage athlète=profil posé et testé. Dernier : elliptique-fractionné homme n°389.
2. **ÉTAPE ACTUELLE : vérification du PDF par l'utilisateur.** PDF 131 pages / 389 exercices,
   numéros stables. Retours reçus : 26 points ouverts (§1). Montrer les propositions AVANT validation.
   Ne pas commencer étape3 sans instruction ou fin de revue.
3. Pouvoir **augmenter le niveau** du programme cardio (piscine et autres) sur Émilie et Yanis
   (les protocoles ont déjà 3 niveaux `niveaux[]` ; la sélection est automatique dans `bh()` :
   à exposer à l'utilisateur — à concevoir après l'étape 1).
4. **Images pendant le chronomètre** (piscine, aqua, nage fractionnée, elliptique) : le timer `v5`
   n'affiche une image que pour piscine (`JarvisPoolMedia`) ; les étapes elliptique n'en ont aucune.
5. Construire l'application (1.4.9 → clé de signature utilisateur). AVANT cela, rappeler les ajouts
   metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie (§1).
6. IA conversationnelle (en dernier).

## 1. Retours PDF :26 points ouverts, accord utilisateur obligatoire

**26 propositions sur26 points, aucune approuvée** :19/26/31/37/38/44/45/46/47/48/64/80/85/87/90/126/148/149/150/194/204/222/239/265/298/380.
**0 sans proposition.** Prochain travail : réserves des propositions, puis PDF reprises.
Lot68 :21 générations cumulées (26 : 8 ; 85 : 7 ; 204 : 6 dont 1 échec + 2 refus modèle) ; tour3 : 6/10.
Historique : Lot67 :7 générations ;80 proposé sur banc INCLINÉ conformément à confirmation utilisateur.
Départ paumes vers le haut, prises fermées/bras ouverts ; arrivée plus allongée/poids rapprochés.
Réserves flexion coudes/trajectoire, échelle poids, légère variation buste/tête, aplats verts.
GIF788×440,2×500ms ; ROI pectoraux626/487, pas validation de style. Aucun angle exact prescrit.
Reconstruction lot67/assemble.py ; review/lot67-proposition-80.jpg ; détail §85.
Suite26/85/204 et réserves restantes. Aucun livré remplacé ; comparatif bloque3 manquants.
PDF uniquement reprises, AVANT gauche/APRÈS droite quand TOUT prêt, accord avant intégration.

### Rappels obligatoires
-AVANT étape3 : demander choix vert identique260, attendre réponse.
-À construction app : rappeler metcon + piscine nage fractionnée et/ou Aqua tabata pour Émilie,
  confirmer périmètre avant coder. Rappels-utilisateur.json reste non traité.

## 1b. Chantiers ouverts (pas bloquants, planifiés)

1. **Lot « style » : 33 GIF** ayant une case sans vert lime sur le corps
   (`production/style-a-reprendre.json` : 26 mesurés + 7 constatés à la lecture visuelle de ce
   tour). Le geste est juste partout ; reprise **uniquement sur votre décision** (§3.2).
2. **Relecture cumulative : TERMINÉE** (feuilles `verification/relecture-26-01..06.jpg`).
3. **Livraison finale** : terminer les étapes utilisateur §0 avant signature (§3.6).

## 2. Blocs techniques récurrents du générateur d'images (constats, pas des excuses)

1. **Barre sur le dos vs rack avant** : en vue de profil, une génération sur deux pose la
   barre devant le cou. Les vues **de face** et **de dos** réussissent (prouvé lot 20).
2. **Amplitude finale des tirages** : le modèle s'arrête à mi-course pour les rowings lourds féminins.
3. **Orientation gauche/droite** : les gestes unilatéraux se retournent parfois entre les
   deux cases ; il faut l'ancrer explicitement (« tête du même côté de l'image »).
4. **Têtes/pieds coupés** aux bords des cases : corrigé par la consigne de marges (lot 20).
5. **Modération d'image** : 1 blocage aléatoire sur 30 générations ; un échec compte dans le lot de 10.
6. **Vert absent d'une case** : le générateur ne colore souvent que la case « de travail » ;
   c'est l'origine du lot style (33).

## 3. Décisions que j'attends de vous (rien n'est fermé en silence)

1. **back-extension-45° prise snatch** (compté valide) : aucune barre n'apparaît, bras
   croisés. Le geste 45° est juste, le qualificatif « prise snatch » non représenté.
   → garder tel quel, ou refaire avec barre prise large sur les épaules ?
2. **Lot « style » des 33 GIF** dont une case n'a pas de vert lime : les régénérer
   (3 à 4 lots de 10) ou accepter l'état livré ?
3. **PDF de revue** (`livraison/REVUE-331-exercices.pdf`, 131 pages, 389 exercices) : numéros
   **figés** (1–331 inchangés ; Yanis piscine à partir du n° 332). Vos « coquille au n° X » sont
   traités en priorité 1 au prochain tour.
4. **Essai téléphone de la 1.4.8** : les groupes de constats restent OUVERTS jusqu'à votre
   retour ; aucun n'est clos sans vous.
5. **Souleve de terre — test 1RM** : un seul plateau par côté (charge peu crédible pour un 1RM),
   geste et ordre justes. → garder, ou refaire avec barre lourde ?
6. **Clé de signature** : absente de cet espace de travail, je ne la fabrique ni ne la
   publie. **Chaîne technique prête, mais feuille de route §0 encore en cours** : `evolution/android/build-media-149.py --unsigned`
   reconstruit et contrôle l'APK 1.4.9 non signé en 3 s (103,8 Mo, 331 GIF vérifiés dans le zip) ;
   le mode `--real` signe v2+v3 avec l'identité durable `150e3846…` restaurée depuis le
   chiffré du dépôt par **votre clé de récupération** (`/tmp/rk.txt`, mode 0600), dépose
   `downloads/Yanis-Fitness-Evolution-1.4.9.apk` + `.sha256` + `.fidelity.json`.
   Prérequis outils (hors Git, à réinstaller après reset) : `jdk4py==17.0.9.2` +
   `cryptography==46.0.3` sous `.cache/signing-tools`, `prepare-home-tools.py` (apksigner épinglé).

## 4. Contraintes d'environnement (sans impact sur le contenu)

- L'espace de travail se réinitialise souvent : restauration = `git fetch origin
  arena/01a0dcad-jarvis-fitness-yanis-emilie-ap && git reset --hard FETCH_HEAD` + venv.
  **Zéro perte** : tout est poussé à chaque tour.
- `.cache/` n'est pas persistant : web 1.4.8, payloads, APK non signé se régénèrent en
  moins d'une minute (`payloads-148.mjs` → `overlay-331.py` → `build-media-149.py --unsigned`).
- 2 GIF orphelins à la racine de `gif/` (premiers lots) : sans effet sur l'app, nettoyage
  prévu au câblage final.
