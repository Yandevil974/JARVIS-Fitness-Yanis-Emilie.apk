# 📋 À COPIER-COLLER DANS LE NOUVEAU CHAT — état au 01/10/2026

> **Suite du chantier (02/10/2026) : branche `arena/01a0fae1-jarvis-fitness-yanis-emilie-ap`.**
> L'historique de `arena/01a0edb7-jarvis-fitness-yanis-emilie-ap` (tête `3c163a6`) a été repris **tel quel**
> (`git fetch origin 3c163a6:refs/remotes/base/passation`, puis adoption de l'arbre, aucun `reset --hard`).
> État inchangé au moment de la reprise : lot 1 validé non intégré, lot 2 proposé en attente, APK intact.
> Ce document reste la référence ; seul le nom de la branche de travail change.
> Ce fichier contient **deux blocs** : (1) la *consigne* à coller en premier message,
> (2) la *passation* complète à coller juste derrière. Rien d'autre n'est nécessaire pour reprendre.

---

## BLOC 1 — LA CONSIGNE (à coller en premier)

```
Reprise du chantier « qualité des visuels » de l'app JARVIS Fitness (Yanis & Émilie),
dépôt Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk, branche arena/01a0fae1-jarvis-fitness-yanis-emilie-ap
(suite de arena/01a0edb7-..., repris tel quel).

Priorité absolue : NETTETÉ et QUALITÉ. On ne recolore plus des GIF pixellisés : on part des sources
PNG natives, on retouche à la résolution native, PUIS on exporte.

Méthode VALIDÉE (n°44, puis lot 1 : 45/48/19/85) — à reprendre telle quelle, sans l'inventer à nouveau :
outils evolution/media/tools/retouche-lot1-vert260.py et retouche-lot2-vert260.py ; sortie = PNG de travail
natif + WebP animé 660 q90 (livrable) + GIF de repli 660 ; contrôles dans CONTROLES.json ; page de
validation en HTML à ouvrir sur le téléphone.

État : lot 1 VALIDÉ par l'utilisateur (propositions seules, RIEN d'intégré).
Lot 2 (n°11, 12, 30, 42) PROPOSÉ, en attente de validation numéro par numéro.

Ta tâche immédiate : faire valider le lot 2, puis continuer par lots de 4 numéros tant qu'il existe un PNG
natif exploitable (340 numéros sur 389). Ne remplace AUCUN GIF livré sans un accord explicite couvrant
le numéro. Ne touche ni à l'APK, ni aux prescriptions, ni aux gestes/prises validés.

Interdits permanents : proposition ≠ validation ≠ intégration ; 0 image générée sans nécessité ;
≤ 10 générations par tour ; une lettre isolée (Y, E, T…) = ne rien faire et attendre ;
push uniquement sur la branche imposée ; WebP/APNG dans l'app seulement après test sur le téléphone + accord.

Après la qualité des visuels : réglage cardio/piscine des 2 profils → visuels des séries piscine/aqua/
elliptique (34 numéros « femme » sans source native) → construction de l'app → IA conversationnelle en dernier.
Avant la construction, rappeler à l'utilisateur de confirmer les ajouts metcon + piscine nage fractionnée
et/ou Aqua Tabata pour Émilie.

Lis la passation ci-dessous en entier avant d'agir, puis dis-moi ce que tu as compris et ce que tu proposes.
```

---

## BLOC 2 — LA PASSATION COMPLÈTE (à coller juste après)

```
=== PASSATION — JARVIS FITNESS (visuels), 01/10/2026 ===

DÉPÔT : Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk
BRANCHE DE TRAVAIL : arena/01a0fae1-jarvis-fitness-yanis-emilie-ap
  (branche imposée par la session ; a repris l'arbre de arena/01a0edb7-..., tête 3c163a6)
NE JAMAIS pousser ailleurs, ne jamais supprimer/renommer la racine du dépôt ni .git.

------------------------------------------------------------
1. OÙ EN EST LE CHANTIER
------------------------------------------------------------
- Prototype n°44 : VALIDÉ (WebP animé 660 q90, vert famille 260). Fichier
  44-vert260-660-webp-q90.webp, sha256 0ecbbd67…, 388×660, 98 ko.
- Lot 1 : n°45, 48, 19, 85 — VALIDÉS par l'utilisateur (« C'est bon ») le 01/10/2026,
  empreintes dans hd-2026-09-30/VALIDATION-LOT1-2026-10-01.json. RIEN N'EST INTÉGRÉ :
  les GIF de l'app n'ont pas été remplacés, l'APK n'a pas été reconstruit.
- Lot 2 : n°11, 12, 30, 42 — PROPOSÉ le 01/10/2026, en attente de validation.
- Fichiers produits (jamais dans l'app) :
  evolution/media/refonte-photo/hd-2026-09-30/
    lot1/  (travail/, exports/, planches/, CONTROLES.json, valider.html)
    lot2/  (idem)
  Page à ouvrir sur le téléphone : …/hd-2026-09-30/lot2/valider.html (serveur local port 8080).

------------------------------------------------------------
2. LA MÉTHODE VALIDÉE (ne pas réinventer)
------------------------------------------------------------
Ordre imposé : source PNG native → retouche sur PNG de travail à la résolution native → PUIS export.
Jamais l'inverse. Jamais d'agrandissement d'un GIF (ce n'est pas une source HD).

Ce que fait la retouche (déterministe, aucun modèle) :
 a) identifie la zone verte réelle du numéro (ROI + seuil ; possibilité de plusieurs ROI, ex. 85 : un
    deltoïde par ROI) ;
 b) resserre le contour : rampe alpha 0,03–0,17 (le halo de 6–13 px donnait l'effet « plaque collée ») ;
 c) rapproche la famille de couleurs de la référence n°260 par correspondance de percentiles p5/p50/p95
    sur la saturation et la valeur, teinte recentrée de moitié — AUCUN pixel uniformisé : chaque pixel
    garde sa nuance (texture, relief, ombres) ;
 d) n'écrit qu'ensuite : PNG de travail natif, WebP animé 660 q90, GIF de repli 660 (palette partagée) ;
 e) décode réellement chaque export et le compare au PNG de travail ; consigne « 0 pixel modifié hors zone ».

Référence de vert = n°260 (RGB ≈ 112,182,12 ; saturation médiane 0,914 ; teinte 86,3°). Ce n'est pas
une couleur uniforme à plaquer : la consigne utilisateur est « contour anatomique net, relief, ombres,
texture » — pas une feuille verte collée.

Pièges vérifiés (à ne pas répéter) :
 1) Le vert vu dans le GIF de l'app peut ne pas exister dans la source native : sur n°1, 9, 10 le vert de
    la case est celui du FEUILLAGE du décor (RGB 202,215,21 sur une feuille). Toujours identifier la zone
    verte sur la source avant de retoucher, sinon on peint une plante.
 2) Le « vert » peut être un vêtement, pas un muscle : n°19 = panneau vert du legging (olive, R≈G, B très
    bas). Le lot68 l'a transformé en aplat lime qui débordait sur l'avant-bras (fichier
    recolorisation-reserves.json, validation_utilisateur: false) → à ne jamais reprendre.
 3) Les GIF de l'app ne sont PAS les fichiers des branches d'archive : yanis-fitness-evolution/public/media
    est un magasin par empreinte de nom (94 GIF uniques pour 389 numéros, 0 contenu commun avec
    refonte-photo/gif/). Toujours vérifier git show <réf>:<chemin> avant toute comparaison.
 4) Agrandir/recadrer ne crée pas de netteté. Le tramage Pillow ne change rien (Floyd = aucun).
    Seule la palette partagée entre phases aide (≈ −11 ko à qualité égale).

------------------------------------------------------------
3. POURQUOI CE CHANTIER (mesures conservées)
------------------------------------------------------------
- Le GIF livré du 44 (259×440) est agrandi ×2 à ×3,4 par l'app (.movement-visual = 300 px de haut) :
  c'est la cause mécanique du « pixélisé ». Écart au maître : 10,7/255 hors vert et 24/255 dans le vert
  (PSNR 21,7 dB) ; un export rejoué depuis le maître tombe à 1,9 et 9,7 (PSNR 38,2 dB).
- L'erreur du GIF se concentre dans le vert : le plafond de 256 couleurs frappe exactement la zone regardée.
- Poids projeté des 389 : aujourd'hui 72 Mo (391 GIF) ; WebP animé 660 q90 ≈ 37 Mo ;
  GIF 660 ≈ 160 Mo. Le GIF haute définition est le scénario le plus lourd.
- Inventaire : 355 numéros sur 389 ont une source native ; 340 sont exploitables à 660 px SANS agrandissement
  (panneaux natifs 1376×768 et 1456×720). 34 numéros n'ont AUCUNE source PNG native : tous « femme »,
  séries piscine/aqua/elliptique (210, 224-259, 274-276, 289-330) → chantier piscine séparé, à traiter avec
  les guides piscine, jamais en aveugle.

------------------------------------------------------------
4. INTERDITS PERMANENTS (accord explicite de l'utilisateur)
------------------------------------------------------------
- Aucun GIF livré remplacé sans un accord explicite couvrant LE numéro. Proposition ≠ validation ≠ intégration.
- APK : intact ; jamais reconstruit ni signé (seule la clé de l'utilisateur pourrait le signer) ;
  conserver les 2 profils et les fonctionnalités ; l'IA conversationnelle en dernier.
- Ne pas modifier une prescription pour justifier une image. Ne pas redessiner les gestes/prises validés.
  N°80 : ne JAMAIS tourner les mains à nouveau ; garder la prise acceptée.
- Départ de phase gauche→droite, même caméra/même machine/même orientation entre les phases ;
  pas de miroir ni de rotation globale ; vérifier TOUTES les phases (4 pour le Zottman n°48).
- Ne pas intégrer d'essais rejetés (ex. raccord coussin du 48 : rejeté, à ne pas reprendre).
- Les deux audits des 389 (technique + segmentation automatique) ne certifient ni la netteté ni l'anatomie :
  segmentation incertaine en piscine/occlusions → ne pas appliquer les masques aveuglément.
- WebP/APNG : uniquement en comparaison ; changement de format de l'app interdit sans test réel sur le
  téléphone (WebView) ET accord. Le GIF reste plafonné à 256 couleurs : ne pas promettre une photo parfaite.
- Ne pas présenter un PNG net comme preuve que le GIF est net : montrer le fichier réellement décodé.
- ≤ 10 appels de génération d'image par tour (échecs compris) ; une lettre isolée (Y, T, E…) = relance
  technique : ne rien faire, attendre.
- Push uniquement sur la branche imposée par la session (arena/01a0fae1-jarvis-fitness-yanis-emilie-ap
  au 02/10/2026). Jamais main. Jamais de reset --hard.

------------------------------------------------------------
5. LOT 2 — VALIDÉ LE 02/10/2026 (ne plus redemander)
------------------------------------------------------------
n°11 (back-squat, 2 cases) → 577×660, WebP 101 ko, PSNR 41,85 ; GIF repli 389 ko.
n°12 (back-squat barre haute) → 577×660, WebP 103 ko, PSNR 41,81 ; GIF repli 392 ko.
n°30 (curl barre debout) → 583×660, WebP 110 ko, PSNR 41,70 ; GIF repli 402 ko.
n°42 (curl Scott barre EZ pronation) → 588×660, WebP 113 ko, PSNR 41,93 ; GIF repli 419 ko.
Fessiers/quadriceps, biceps/avant-bras : 0 pixel modifié hors zone ; saturation après passage 0,904 / 0,930 /
0,873 / 0,876 (référence 260 = 0,914).
→ DÉJÀ VALIDÉ le 02/10/2026 : « 11 OK », « 12 OK », « 30 OK », « 42 OK » (empreintes et mesures dans
  hd-2026-09-30/VALIDATION-LOT2-2026-10-02.json). Portée : les propositions, pas l'intégration.
→ Lot suivant : 4 numéros depuis les sources natives, priorité au plus gros écart GIF livré ↔ source.

------------------------------------------------------------
6. SUITE (dans cet ordre)
------------------------------------------------------------
1) Faire valider le lot 2 (et le lot 1 s'il redemande des retouches).
2) Continuer par lots de 4 numéros, en partant des sources natives (INVENTAIRE-SOURCES-389.json).
   Priorité aux numéros dont le GIF livré est le plus éloigné de sa source.
   Attention : vérifier que le vert existe bien dans la source (pièges §2).
3) Quand la série visuelle est validée : décider avec l'utilisateur le sort de l'intégration
   (GIF 660 plus lourds, ou WebP animé dans l'app après test WebView + accord) puis intégrer,
   numéro par numéro, sans rien écraser d'autre.
4) Réglage cardio/piscine des 2 profils → visuels des séries piscine/aqua/elliptique (34 numéros sans source).
5) Construction de l'app. Avant : faire confirmer les ajouts metcon + piscine nage fractionnée et/ou
   Aqua Tabata pour Émilie.
6) IA conversationnelle en dernier.

------------------------------------------------------------
7. REPRISE TECHNIQUE (nouveau bac à sable)
------------------------------------------------------------
- Le bac à sable se réinitialise (venv et métadonnées git) : recréer l'environnement
  (python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy) et refaire un git fetch.
- Récupérer les bases d'archive par leur SHA (le fetch par nom échoue sur ce remote) :
    git fetch origin 3c163a6:refs/remotes/base/passation      # 02/10/2026 : arbre complet du chantier visuels
    git fetch origin 3cbb3e5:refs/remotes/base/passation-old   # 01/10/2026 : 25 GIF livrés + les 4 docs
    git fetch origin c685298:refs/remotes/base/lots-complets  # base complète (391 GIF, tous les lots)
  Ces réfs ne doivent JAMAIS être écrasées.
- Après réinitialisation, ne jamais faire reset --hard : vérifier git status, puis au besoin
  git reset --mixed origin/arena/01a0fae1-jarvis-fitness-yanis-emilie-ap et restaurer les fichiers suivis
  (git checkout -- .), en préservant les fichiers non suivis.
- Outils disponibles :
    evolution/media/tools/prototype-hd-44.py et prototype-hd-44-vert260.py (prototype 44)
    evolution/media/tools/retouche-lot1-vert260.py (lot 1 ; contient toutes les fonctions)
    evolution/media/tools/retouche-lot2-vert260.py (lot 2 ; réutilise le lot 1)
- Registres : livraison/numerotation-pdf.json (les 389), production/plan.json, livraison/manifeste-331.json,
  hd-2026-09-30/INVENTAIRE-SOURCES-389.json (source native de chaque numéro).
- Documents longs (même état, version détaillée) : PASSATION.md, PASSATION-NOUVEAU-CHAT.md,
  CE-QUI-COINCE.md, ainsi que hd-2026-09-30/VALIDATION-44-2026-09-30.json,
  VALIDATION-LOT1-2026-10-01.json, lot1/CONTROLES.json, lot2/CONTROLES.json.
```

---

## Deux phrases à retenir

- **La méthode est validée, la série peut reprendre** : sources natives → PNG de travail natif → WebP 660 q90 (+ GIF de repli), avec « 0 pixel modifié hors zone ».
- **Rien n'est dans l'app** : lot 1 validé mais non intégré, lot 2 en attente, APK intact. Aucun GIF livré ne sera remplacé sans un accord numéro par numéro.
