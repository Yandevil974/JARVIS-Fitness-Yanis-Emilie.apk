#!/usr/bin/env bash
# Grille de contrôle 3 exercices x 3 positions — chantier « reconstruction des animations ».
#
#   build-planche-grille.sh <src_dir> <out.jpg> "<titre>" <prenom> <ex1> <ex2> <ex3>
#
# Gabarit validé (identique aux planches LOT-A04/A05/A08) : 1440x900
#   - bandeau d'en-tête de 40 px (fond #111828) avec le titre ;
#   - 3 lignes de 3 vignettes de 480x286 (image 480x264 + bandeau de libellé 22 px) ;
#   - libellé au bas de chaque vignette (exercice + position).
#
# ATTENTION : toujours passer -font DejaVu-Sans (la police par défaut échoue dans le sandbox).
set -euo pipefail

SRC=${1:?dossier source manquant}
OUT=${2:?fichier de sortie manquant}
TITRE=${3:?titre manquant}
PRENOM=${4:-HOMME}
shift 4
EXOS=("$@")
[ ${#EXOS[@]} -eq 3 ] || { echo "il faut exactement 3 exercices" >&2; exit 1; }

FONT=DejaVu-Sans
BG='#111828'
TILEW=480
TILEH=286
IMGH=264
LBLH=22
HEAD=42
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# 1. les 9 vignettes, chacune avec son bandeau de libellé
for i in 0 1 2; do
  ex=${EXOS[$i]}
  for p in A M B; do
    convert "$SRC/$ex-$p.png" -resize "${TILEW}x${IMGH}^" -gravity center -extent "${TILEW}x${IMGH}" "$TMP/img-$i-$p.png"
    convert -size "${TILEW}x${LBLH}" "xc:$BG" -font "$FONT" -pointsize 13 -fill '#e6e9ee' \
      -annotate +8+15 "$(echo "$ex" | tr 'a-z' 'A-Z') $PRENOM — POS $p" "$TMP/lbl-$i-$p.png"
    convert "$TMP/img-$i-$p.png" "$TMP/lbl-$i-$p.png" -append "$TMP/tile-$i-$p.png"
  done
  convert "$TMP/tile-$i-A.png" "$TMP/tile-$i-M.png" "$TMP/tile-$i-B.png" +append "$TMP/row-$i.png"
done

# 2. bandeau d'en-tête + empilement des 3 lignes
convert -size "1440x${HEAD}" "xc:$BG" -font "$FONT" -pointsize 17 -fill '#e6e9ee' \
  -annotate +12+26 "$TITRE" "$TMP/head.png"
convert -background "$BG" "$TMP/head.png" "$TMP/row-0.png" "$TMP/row-1.png" "$TMP/row-2.png" \
  -append -quality 92 "$OUT"

echo "OK — $OUT"
identify -format "%f %wx%h\n" "$OUT"
