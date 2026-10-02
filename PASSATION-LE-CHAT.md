# 📋 À COLLER TEL QUEL DANS LE CHAT — consigne et passation

> **Mode d'emploi :** sélectionner **tout** le bloc ci-dessous, à partir de « CONTEXTE »
> jusqu'à « *Fin du bloc* », et le coller comme premier message du nouveau chat. Il est
> autoportant : il ne suppose rien de ce que le chat sait déjà, et ne dépend d'aucun fichier.

---

CONTEXTE — je travaille sur l'application **JARVIS Fitness** (Yanis & Émilie), un projet de
389 visuels d'exercices. On avance par passation entre chats : **chaque nouveau chat doit
recevoir ce bloc avant de faire quoi que ce soit**, sinon il refait ou défait du travail déjà
validé. Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`. Arrêté le **02/10/2026**.

## 1. LA CONSIGNE (règles, à ne pas négocier)

1. **PRIORITÉ ABSOLUE : NETTETÉ et QUALITÉ.** Partir des PNG natifs, retoucher en résolution
   native, **PUIS** exporter. Jamais recolourier un GIF pixelisé, jamais agrandir un GIF.
2. **« Le vert doit bien couvrir la peau, pas dépassé. »** Trois mesures dans chaque
   `CONTROLES.json` : `couverture_peau`, `debordement_vert`, et la décomposition du manque
   (`manque_peau / manque_vert_pale / manque_autre`).
3. **Lots de 4 numéros.** Ne JAMAIS toucher à un numéro déjà validé. Ne JAMAIS remplacer un
   GIF livré sans accord explicite, numéro par numéro.
4. **APK, prescriptions, gestes et prises validés : intouchables.**
5. **Dès que la limite de session approche : DRAPEAU ROUGE**, avec consigne et passation
   recopiées. Ne pas partir sans.
6. **L'œil de l'utilisateur tranche, jamais les chiffres seuls.** Le tri muscle/décor
   automatique a échoué (IoU, teinte, peau en anneau, position : les pièges 1/9/10 recouvrent
   les bons numéros).

## 2. ÉTAT CHIFFRÉ (vérifié, s'y fier)

- **21 lots validés = 86 numéros + le prototype n°44 = 87 visuels refaits.**
- Aucun numéro en attente. Chaque lot a son PV (sha256 + mesures) :
  `hd-2026-09-30/VALIDATION-LOT1 à LOT21-2026-10-02.json`.
- Répartition des 355 numéros qui ont une source PNG native :
  **78** « RETENUE » → **tous traités** · **8** choisis à la main → lots 1 et 2
  (11, 12, 19, 30, 42, 45, 48, 85) · **252** « A REGARDER » → jamais triés (le gisement
  suivant) · **22** « ECARTER » · **3** « source inexploitable ».
- **34 numéros « femme » sans aucune source native** → chantier 2 ci-dessous.
- **0 pixel modifié hors zone** sur toutes les phases. Aucun GIF livré remplacé.
  **APK intact. Rien d'intégré dans l'application.**

## 3. LA MÉTHODE EN BREF

- **Référence n°260 : saturation 0,914 — teinte 86,3°.** Ces deux chiffres sont des
  **MÉDIANES** mesurées à seuil 0,12 sur la plus grande composante verte : en moyenne on
  trouve 0,691, ce qui n'est pas la référence.
- Seuils d'alerte : contour > 8 px · saturation < 0,87 ou > 0,96 · zone > 9 000 px ·
  teinte à plus de 5° de 86,3° · tout pixel modifié hors zone.
- Trois régimes de vert : (a) pâle à remonter, (b) déjà bon = gain de netteté pure,
  (c) SUR-saturé à faire DESCENDRE (0,96–1,00 → 0,92). Le cas (c) rend le vert moins intense
  qu'avant : **le signaler**, c'est un choix d'œil.
- Un lot peut ne contenir **aucune** nouvelle image : les numéros d'un même groupe (même
  planche + mêmes fenêtres) sortent identiques à l'octet près. **Le dire** au lieu de faire
  revalider la même image.
- **Ne JAMAIS rejouer un outil sur un lot déjà validé** : une régression du lot 4 a écrasé
  6 fichiers approuvés.

## 4. LA SUITE, DANS L'ORDRE DÉCIDÉ PAR L'UTILISATEUR

| # | Chantier | État |
|---|---|---|
| 1 | Cardio et piscine des deux profils (réglages, pas des visuels) | ✅ **FAIT** |
| 2 | Les 34 visuels « femme » sans source native | 🟡 **VERT FAIT — en attente de validation** |
| 3 | Le build de l'application | ⬜ à venir |
| 4 | L'IA conversationnelle | ⬜ **en dernier** |
| 5 | AVANT le build : confirmer metcon + piscine fractionnée + Aqua Tabata | ✅ **DÉCIDÉ** |
| 6 | Gisement en réserve : les 252 numéros « A REGARDER » | ⬜ réserve |

**Prochaine action concrète** : valider les 10 corrections de vert du chantier 2, numéro par
numéro, puis passer au build.

## 5. CHANTIER 1 — Cardio & piscine des deux profils : FAIT

Comparaison du **vrai** moteur `src/engine/source-schedule.js` contre les fichiers sources.

| Mesure | Résultat |
|---|---|
| Jours comparés (18 scénarios × 52 semaines) | **6 552** |
| Écarts de placement du cardio / de la piscine | **0** |
| Écarts de durée ou de zone (Émilie) | **0** |
| Écarts d'auto-régulation (après correction) | **0** |

**Un seul défaut, trouvé et corrigé** : le seuil « 3 séances dures / 7 jours » de Yanis ne
comptait que les types `hiit`/`aqua` (+ `rpe >= 8`). Après 3 METCON « HIIT + Swim Sprint » :
la source comptait 6 séances dures (bascule modéré), l'app en comptait 0 (restait intense).
Corrigé par `sourceProtoName()` et `sourceHardSession()`. L'ajout « RPE ≥ 8 » est **retiré**
(retour strict à la source). 96 tests passent, build OK.
**Seul fichier de l'app modifié : `src/engine/source-schedule.js`.**

**Décisions utilisateur du 02/10/2026 — ne pas les redemander :**
- seuil du METCON corrigé ✅
- matériel laissé **fidèle à la source** chez Yanis (cases Piscine/Elliptique sans effet,
  comme dans le fichier source)
- **piscine fractionnée gardée** (ajout assumé : « Nage en longueurs » apparaît 0 fois dans
  les sources)
- **Aqua Tabata confirmé tel quel** (ce n'est pas un ajout : il vient de la source)

## 6. CHANTIER 2 — Les 34 visuels femme : VERT SEUL, PAS D'AGRANDISSEMENT

**Décision utilisateur : « N'agrandit pas. Laisse comme c'est. Juste la couleur verte à
améliorer. »** Les 3 variantes d'agrandissement et la voie « création d'un PNG » sont
**abandonnées**.

- 34 numéros = **14 fichiers uniques** (plusieurs partagent le même GIF à l'octet près)
- **6 numéros sans vert** : 289, 290, 291, 298, 305, 316 — rien à améliorer
- **10 images traitées** (28 numéros) · taille **identique à la source** · 2 images de 500 ms
- **0 pixel modifié hors zone** · saturation remontée vers **0,918**

**Deux corrections de méthode, établies en refaisant le calcul :**
- la référence 260 se mesure en **MÉDIANE**, pas en moyenne : à seuil 0,12 on retrouve
  exactement 0,914 et 86,1°
- le débordement se mesure contre le **halo** (score > 0,02), pas contre le seul cœur vert :
  **0,00 partout** au lieu de 0,45 à 0,69

**Piège — l'eau prise pour le muscle.** 5 images sur 10 ont une teinte loin du vert muscle
(260 = 86,3°). Dans une piscine, le bassin peut être confondu avec le muscle peint : même
famille d'erreur que les n°1, 9 et 10 où c'était le feuillage du décor. **À trancher à l'œil :**

| n° | teinte avant | saturation | signal |
|---|---|---|---|
| **313** | 164,7° | 0,840 → **0,764** | cyan — **le seul dont la saturation baisse** |
| **292** | 147,5° | 0,526 → 0,917 | **très éloignée** — probablement l'eau du bassin |
| 274, 275, 276 | 125,0° | 0,277 → 0,918 | tire vers le cyan |
| 210, 246 | 124,9° | 0,425 → 0,918 | tire vers le cyan |
| 326 | 122,5° | 0,259 → 0,916 | tire vers le cyan |

Franches : 224/225/257/304/306/307/308 (80,0°) · 233/234/324/329 (96,2°) ·
237/255/256 (83,1°) · 252/253 (87,0°) · 258/259/314/315 (100,3°).

## 7. PIÈGES DÉJÀ RENCONTRÉS — ne pas les refaire

- **Ne JAMAIS rejouer un outil sur un lot déjà validé** (régression du lot 4 : 6 fichiers
  approuvés écrasés). Si c'est nécessaire, restaurer juste après avec
  `git checkout HEAD -- <fichiers>` et vérifier par `git status`.
- **Le vert du GIF livré peut ne pas exister dans la source native** (n°1, 9, 10 : feuillage).
  Étendre le piège à l'eau du bassin pour les séries piscine (n°292, 313).
- **Les GIF de l'app ne sont pas les fichiers des branches d'archive** : `public/media` est un
  magasin **par empreinte** (94 GIF uniques pour 389 numéros). Toujours vérifier avant de
  comparer.
- **`git fetch` ne peut pas récupérer ces branches par leur nom**, mais **par SHA oui**.
- **Ne pas confondre moyenne et médiane** sur la saturation.
- **Ne pas zoomer ni rogner** dans un document de comparaison : « Pas de zoom, laisser
  l'original. » Toutes les cellules à la même taille d'affichage.

## 8. DEUX CHANTIERS TECHNIQUES OUVERTS

- `page-lot.py` n'affiche NI `couverture_peau` NI `debordement_vert` dans `valider.html` :
  il faut lire `CONTROLES.json`. **À brancher.**
- Le n°35 n'a qu'une seule phase au lieu de deux (erreur d'alignement 14,97/255, la plus
  forte du programme). Accepté tel quel, mais **à comprendre**.

---

*Fin du bloc — dernière mise à jour 02/10/2026.*

**Pour commencer :** ne rien modifier. Confirmer que le contexte est pris, puis attendre la
consigne. La prochaine action est la validation numéro par numéro des 10 corrections de vert
(surtout **292** et **313**), avant de passer au build de l'application.
