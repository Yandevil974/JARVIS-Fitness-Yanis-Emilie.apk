#!/usr/bin/env bash
# Assemblage d'un lot d'animations — chantier « reconstruction des animations ».
#
#   build-gif-lot.sh <dossier_source> <dossier_sortie> <titre_planche> <ex1> <ex2> [<ex3>]
#
# Pour chaque exercice <ex>, le dossier source contient soit les 3 positions
#     <ex>-A.png  <ex>-M.png  <ex>-B.png
# soit déjà l'animation <ex>-3poses.gif (dans ce cas elle est seulement coalescée).
#
# Produit dans le dossier de sortie :
#     <ex>-3poses.gif        animation 460x257, boucle A → M → B → M
#     <titre_planche>.gif    planche animée, 1 colonne par exercice
#
# Format validé du chantier : 460x257, -delay 130/110, -colors 96, boucle infinie.
# ATTENTION : ne jamais appliquer -layers optimize à la planche (ça recadre les frames
# à la zone qui bouge — on obtenait 473x265 au lieu de 1404x265).
set -euo pipefail

SRC=${1:?dossier source manquant}
OUT=${2:?dossier sortie manquant}
TITRE=${3:?titre de planche manquant}
shift 3
EXOS=("$@")
N=${#EXOS[@]}

BG='#0b0e13'
GAP=12
MARGIN=8
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

# 1. recadrage + GIF 3 positions par exercice
for n in "${EXOS[@]}"; do
  if [ -f "$SRC/$n-A.png" ]; then
    for p in A M B; do
      [ -f "$SRC/$n-$p.png" ] || { echo "manque : $SRC/$n-$p.png" >&2; exit 1; }
      convert "$SRC/$n-$p.png" -resize '460x257^' -gravity center -extent 460x257 \
        "$TMP/r-$n-$p.png"
    done
    convert -delay 130 "$TMP/r-$n-A.png" \
            -delay 110 "$TMP/r-$n-M.png" \
            -delay 130 "$TMP/r-$n-B.png" \
            -delay 110 "$TMP/r-$n-M.png" \
            -loop 0 -colors 96 -layers optimize "$OUT/$n-3poses.gif"
  elif [ -f "$SRC/$n-3poses.gif" ]; then
    cp "$SRC/$n-3poses.gif" "$OUT/$n-3poses.gif"
  else
    echo "manque : $SRC/$n-A.png ou $SRC/$n-3poses.gif" >&2
    exit 1
  fi
  convert "$OUT/$n-3poses.gif" -coalesce "$TMP/f-$n-%d.png"
done

# 2. planche animée : 1 colonne par exercice, 4 frames (A M B M)
W=$(( N * 460 + (N - 1) * GAP + 2 * MARGIN ))
for i in 0 1 2 3; do
  FILES=()
  for k in "${!EXOS[@]}"; do
    n=${EXOS[$k]}
    if [ "$k" -gt 0 ]; then
      convert "$TMP/f-$n-$i.png" -background "$BG" -splice "${GAP}x0+0+0" "$TMP/s-$n-$i.png"
      FILES+=("$TMP/s-$n-$i.png")
    else
      FILES+=("$TMP/f-$n-$i.png")
    fi
  done
  convert -background "$BG" "${FILES[@]}" +append -bordercolor "$BG" -border "$MARGIN" \
    -gravity center -extent "${W}x265" "$TMP/row-$i.png"
done
convert -delay 130 "$TMP/row-0.png" \
        -delay 110 "$TMP/row-1.png" \
        -delay 130 "$TMP/row-2.png" \
        -delay 110 "$TMP/row-3.png" \
        -loop 0 -colors 96 "$OUT/$TITRE.gif"

echo "OK — $OUT"
identify -format "%f %wx%h %n frames\n" "$OUT/$TITRE.gif"
