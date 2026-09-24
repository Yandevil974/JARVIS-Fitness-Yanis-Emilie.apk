#!/usr/bin/env bash
# Reconstruit l'outillage de l'espace de travail apres un effacement (le cache
# n'est jamais conserve). Idempotent : relancer ne casse rien.
#   bash evolution/media/setup-tools.sh
set -u
cd "$(dirname "$0")/../.." || exit 1
ROOT="$PWD"
PY="$ROOT/.cache/pyvenv/bin/python"

echo "== Python : Pillow, cryptography, jdk4py =="
if [ ! -x "$PY" ]; then python3 -m venv .cache/pyvenv; fi
"$PY" -m pip install --quiet --upgrade pip >/dev/null 2>&1
"$PY" -m pip install --quiet pillow cryptography jdk4py 2>&1 | tail -3
"$PY" - <<'EOF'
import PIL, cryptography, jdk4py, pathlib
print('pillow', PIL.__version__, '| cryptography', cryptography.__version__)
print('java:', pathlib.Path(jdk4py.JAVA_HOME) / 'bin/java')
EOF

echo "== java attendu par les scripts de signature =="
JRT=$("$PY" -c "import jdk4py,pathlib;print(pathlib.Path(jdk4py.JAVA_HOME))")
rm -rf .cache/signing-tools/jdk4py
mkdir -p .cache/signing-tools/jdk4py
# java-runtime doit pointer le dossier du JDK (celui qui contient bin/, lib/…)
ln -sfn "$JRT" .cache/signing-tools/jdk4py/java-runtime
ls -l .cache/signing-tools/jdk4py/java-runtime/bin/java

echo "== apksigner =="
if [ ! -f .cache/home-tools/apksigner.jar ]; then
  "$PY" evolution/android/prepare-home-tools.py 2>&1 | tail -3
fi
sha256sum .cache/home-tools/apksigner.jar 2>/dev/null || echo "apksigner absent (voir prepare-home-tools.py)"

echo "== Playwright + Chromium (essais navigateur, non bloquant) =="
if [ ! -d JARVIS-Fitness-Source/node_modules/@playwright/test ]; then
  (cd JARVIS-Fitness-Source && npm install --no-audit --no-fund 2>&1 | tail -3)
fi
if [ -z "${CHROMIUM_EXECUTABLE_PATH:-}" ]; then
  (cd JARVIS-Fitness-Source && PLAYWRIGHT_BROWSERS_PATH="$ROOT/.cache/ms-playwright" npx playwright install chromium 2>&1 | tail -3)
  CHROME=$(find "$ROOT/.cache/ms-playwright" -maxdepth 3 -name 'chrome' -o -maxdepth 3 -name 'headless_shell' 2>/dev/null | head -1)
  [ -n "$CHROME" ] && echo "chromium: $CHROME" || echo "chromium indisponible"
fi
echo "SETUP_DONE"
