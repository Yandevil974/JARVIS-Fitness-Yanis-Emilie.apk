#!/usr/bin/env bash
# Planche de contrôle statique d'un exercice — chantier « reconstruction des animations ».
#
#   build-planche-exo.sh <src_dir> <out.jpg> <exo_id> "<ligne1>" "<labA>" "<labM>" "<labB>"
#
# Produit un JPEG 1440x300 : bandeau d'en-tête 40 px (fond #111828) + 3 vignettes
# A / M / B de 480x260 côte à côte, chaque libellé au-dessus de sa vignette.
#
# ATTENTION : toujours passer -font DejaVu-Sans (la police Helvetica par défaut
# échoue dans le sandbox).
set -euo pipefail

SRC=${1:?dossier source manquant}
OUT=${2:?fichier de sortie manquant}
EXO=${3:?identifiant de exercice manquant}
L1=${4:-}
LABA=${5:-A}
LABM=${6:-M}
LABB=${7:-B}

FONT=DejaVu-Sans
BG='#111828'
TXT='#e6e9ee'
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# 1. les 3 positions, recadrées en 480x260 (paysage 16:9 conservé)
for p in A M B; do
  convert "$SRC/$EXO-$p.png" -resize '480x260^' -gravity center -extent 480x260 "$TMP/$p.png"
done

# 2. bandeau d'en-tête : 1 ligne de titre + 1 libellé par vignette
convert -size 1440x40 "xc:$BG" -font "$FONT" -pointsize 15 -fill "$TXT" \
  -annotate +10+16 "$L1" \
  -pointsize 13 \
  -annotate +10+34  "$LABA" \
  -annotate +490+34 "$LABM" \
  -annotate +970+34 "$LABB" \
  "$TMP/head.png"

# 3. bande des vignettes puis assemblage vertical
convert "$TMP/A.png" "$TMP/M.png" "$TMP/B.png" +append "$TMP/row.png"
convert -background "$BG" "$TMP/head.png" "$TMP/row.png" -append -quality 92 "$OUT"

echo "OK — $OUT"
identify -format "%f %wx%h\n" "$OUT"
