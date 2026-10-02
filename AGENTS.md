# AGENTS.md — lu automatiquement par la plupart des agents de code

## 🚩 Avant toute action dans ce dépôt

**Ne commence rien avant d'avoir lu `PASSATION-COPIER-COLLER.md` (racine du dépôt).**

Ce dépôt est un chantier long mené par passation entre sessions. Un agent qui agit sans
lire la passation **refait ou défait du travail déjà validé par l'utilisateur**.

### Étapes obligatoires à l'ouverture d'une session

1. `git fetch origin arena/01a0fc53-jarvis-fitness-yanis-emilie-ap`
2. `git show --name-only --oneline HEAD`
   - ne rend **que** l'en-tête → le sandbox a été purgé → `git reset --hard FETCH_HEAD`
   - sinon → `git merge --ff-only FETCH_HEAD`
3. Lire `PASSATION-COPIER-COLLER.md`, puis
   `evolution/media/refonte-photo/PASSATION-NOUVEAU-CHAT.md`.
4. Recréer l'environnement : `python3 -m venv .cache/pyvenv &&
   .cache/pyvenv/bin/pip install -q pillow numpy opencv-contrib-python-headless reportlab`
   (venv + fetch + travail dans la **même** commande : le venv est purgé en 1 à 2 minutes).
5. `git fetch --depth=1 origin c685298378773817460fb358bc605af7ce154b8b:refs/remotes/base/lots-complets`

### Interdits absolus

- Ne jamais toucher à un numéro déjà validé.
- Ne jamais remplacer un GIF livré sans accord explicite, numéro par numéro.
- Ne jamais reconstruire l'APK sans accord.
- Ne jamais agrandir un GIF sans accord explicite (refusé le 02/10/2026 pour les 34 femme).
- Ne jamais rejouer un outil sur un lot déjà validé : une régression du lot 4 a écrasé
  6 fichiers approuvés.

### Règle de décision

Les chiffres ne tranchent pas. L'utilisateur a l'œil ; l'agent mesure et propose.
Toute modification de code doit être annoncée et validée avant d'être livrée.

Branche de travail : `arena/01a0fc53-jarvis-fitness-yanis-emilie-ap` (ne pas en changer).
