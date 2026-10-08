#!/usr/bin/env bash
# Planche animée d'un lot — assemblage DEPUIS LES GIF DÉJÀ LIVRÉS
# (coalesce + recoloriage), pour ne pas ré-encoder les GIF individuels déjà commités.
#
#   build-gif-lot-depuis-gifs.sh <out.gif> <ex1.gif> <ex2.gif> <ex3.gif>
#
# Gabarit identique à build-gif-lot.sh : 3 colonnes de 460x257, GAP 12, MARGIN 8,
# hauteur 265, delays 130/110/130/110, -colors 96, SANS -layers optimize.
set -euo pipefail

OUT=${1:?fichier de sortie manquant}
shift
[ $# -eq 3 ] || { echo "il faut exactement 3 GIF en entrée" >&2; exit 1; }

BG='#0b0e13'
GAP=12
MARGIN=8
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

for n in "$@"; do
  base=$(basename "$n" .gif)
  convert "$n" -coalesce "$TMP/f-$base-%d.png"
done

set -- "$@"
for i in 0 1 2 3; do
  FILES=()
  k=0
  for n in "$@"; do
    base=$(basename "$n" .gif)
    if [ "$k" -gt 0 ]; then
      convert "$TMP/f-$base-$i.png" -background "$BG" -splice "${GAP}x0+0+0" "$TMP/s-$base-$i.png"
      FILES+=("$TMP/s-$base-$i.png")
    else
      FILES+=("$TMP/f-$base-$i.png")
    fi
    k=$((k + 1))
  done
  convert -background "$BG" "${FILES[@]}" +append -bordercolor "$BG" -border "$MARGIN" \
    -gravity center -extent 1420x265 "$TMP/row-$i.png"
done

convert -delay 130 "$TMP/row-0.png" \
        -delay 110 "$TMP/row-1.png" \
        -delay 130 "$TMP/row-2.png" \
        -delay 110 "$TMP/row-3.png" \
        -loop 0 -colors 96 "$OUT"

echo "OK — $OUT"
identify -format "%f %wx%h %n frames\n" "$OUT"
