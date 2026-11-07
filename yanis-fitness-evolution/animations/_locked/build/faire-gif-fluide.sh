#!/usr/bin/env bash
# faire-gif-fluide.sh — GIF "vrai mouvement" : enchaîne les poses clés à cadence
# d'animation (8-10 images/s), sans délai diaporama. Boucle explicite fournie.
# usage: faire-gif-fluide.sh SIZE OUT IMG:DELAY[cs] [IMG:DELAY ...]
set -euo pipefail
SIZE="$1"; OUT="$2"; shift 2
CMD=(convert)
for spec in "$@"; do
  img="${spec%:*}"; d="${spec##*:}"
  CMD+=(-delay "$d" "$img")
done
CMD+=(-loop 0 -resize "${SIZE}!" -layers Optimize "$OUT")
"${CMD[@]}"
echo "--- $OUT : $(identify -format '%n images %wx%h' "$OUT" | head -c 60)"
