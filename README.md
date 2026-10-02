# JARVIS-Fitness-Yanis-Emilie.apk

# 🚩 DRAPEAU ROUGE — À LIRE AVANT TOUT

Ce dépôt suit un chantier long, mené par **passation entre chats**. Un nouveau chat qui
commence sans lire la passation **refait ou défait du travail déjà validé**.

## Les 3 fichiers à lire, dans l'ordre

| # | Fichier | Pourquoi |
|---|---|---|
| 1 | **`PASSATION-COPIER-COLLER.md`** *(racine)* | le bloc complet à coller dans le nouveau chat : consigne, état chiffré, suite, pièges, procédure de purge |
| 2 | `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md` | l'historique complet et détaillé (42 sections, 1 000 lignes) |
| 3 | `evolution/reglages/` · `evolution/media/refonte-photo/hd-2026-09-30/sans-source/vert/` | les rapports des deux chantiers en cours |

## État au 02/10/2026 — branche `arena/01a0fc53-jarvis-fitness-yanis-emilie-ap`

- **21 lots validés = 87 visuels refaits.** Aucun numéro en attente. APK intact.
- **Chantier 1 — Cardio & piscine des deux profils (réglages) : FAIT.** 6 552 jours comparés,
  0 écart de placement. Un défaut trouvé et corrigé (seuil d'auto-régulation du METCON).
- **Chantier 2 — Les 34 visuels femme sans source native : VERT SEUL FAIT, EN ATTENTE DE
  VALIDATION.** Décision utilisateur : **pas d'agrandissement**. 14 fichiers uniques,
  10 images traitées, 6 numéros sans vert, 0 pixel modifié hors zone.
  → `sans-source/vert/VERT-SEUL-34-FEMME.pdf` (11 pages).

## Les 6 règles qui ne se négocient pas

1. **Netteté et qualité d'abord.** Partir des PNG natifs, retoucher en résolution native,
   puis exporter. Jamais recolourier un GIF pixelisé, jamais agrandir sans accord.
2. **Le vert doit bien couvrir la peau, pas dépassé.** Mesuré par `couverture_peau`,
   `debordement_vert`, et la décomposition `manque_peau / manque_vert_pale / manque_autre`.
3. **Lots de 4 numéros.** Ne JAMAIS toucher à un numéro déjà validé. Ne JAMAIS remplacer un
   GIF livré sans accord explicite, numéro par numéro.
4. **APK, prescriptions, gestes et prises validés : intouchables.**
5. **DRAPEAU ROUGE avant de partir**, avec consigne et passation recopiées.
6. **L'œil de l'utilisateur tranche, jamais les chiffres seuls.** Le tri automatique
   muscle/décor a échoué (IoU, teinte, peau en anneau, position).

Après une purge du sandbox : voir la procédure dans `PASSATION-COPIER-COLLER.md` §7.
