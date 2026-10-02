#!/usr/bin/env bash
# Prépare le bac à sable après une réinitialisation (arrive souvent, parfois en cours de tour).
#
# Ce qui NE SURVIT PAS à une réinitialisation (et qu'il faut donc recréer) :
#   .cache/            -> le venv Python (pillow, numpy) et les sources extraites de git
#   tri/               -> la page de tri visuel (dossier ignoré par git)
#   refs/remotes/base/*-> les réfs d'archive (sources natives + GIF livrés)
#   le serveur         -> le processus du port 8080 est tué
# Ce qui SURVIT : tout ce qui est commis (outils, lots 1/2/3/..., CONTROLES.json, passation).
#
# Usage : bash evolution/media/tools/preparer-session.sh
set -e
cd "$(dirname "$0")/../.."

echo "== 1. environnement Python =="
[ -x .cache/pyvenv/bin/python ] || python3 -m venv .cache/pyvenv
.cache/pyvenv/bin/pip install -q pillow numpy
.cache/pyvenv/bin/python -c "import PIL, numpy; print('   Pillow', PIL.__version__, '| numpy', numpy.__version__)"

echo "== 2. réfs d'archive (c'est le plus long, ~1 min 45) =="
git rev-parse --verify -q base/lots-complets >/dev/null \
  || git fetch --depth=1 origin c685298378773817460fb358bc605af7ce154b8b:refs/remotes/base/lots-complets
git rev-parse --verify -q base/passation >/dev/null \
  || git fetch --depth=1 origin 3c163a639b5ff40591e2c7078758e71c30be9c88:refs/remotes/base/passation
git rev-parse --verify -q base/gif-livres >/dev/null \
  || git fetch --depth=1 origin 3cbb3e5fa9f9c11294d1393e1eaa2dca900538c2:refs/remotes/base/gif-livres
git rev-parse --short base/lots-complets base/passation base/gif-livres

echo "== 3. vérification de la branche =="
git branch --show-current
echo "   (si cette branche n'est pas arena/01a0fae1-..., signaler : on ne pousse que sur la branche imposée)"

echo "== 4. serveur de validation =="
echo "   lancer à part : python3 evolution/media/tools/serve-validation.py 8080"

echo "== 5. page de tri visuel (si le lot suivant doit être choisi) =="
echo "   .cache/pyvenv/bin/python evolution/media/tools/planche-tri.py <numéros séparés par des virgules> \"titre\""
echo ""
echo "Prêt."
