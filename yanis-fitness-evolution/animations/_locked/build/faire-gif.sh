#!/usr/bin/env bash
# ============================================================================
#  faire-gif.sh — assemblage reproductible des GIF d'exercice (JARVIS Fitness)
#  Vérifié le 11 octobre 2026 : reproduit les 3 GIF verrouillés à ~1,7 % près
#  (RMSE ~1050/65535), sans regénérer l'athlète.
#
#  POURQUOI C'EST UTILE
#  --------------------
#  Les poses (A, M, B) sont des PNG. Le GIF est une simple chaîne :
#      A -> M -> B -> M -> A    (le retour à A fait la boucle propre)
#  Donc pour corriger UNIQUEMENT le décor, il suffit de régénérer les 3 fonds
#  et de relancer ce script. Le personnage n'est jamais touché.
#
#  USAGE
#  -----
#    ./faire-gif.sh ""<A.png>" ""<M.png>" ""<B.png>" ""<largeurxhauteur>"" ""<sortie.gif>""
#
#  EXEMPLES (tailles réellement utilisées par le projet)
#    terrains/athlète debout ou au sol (format large) : 440x246
#    leg extension (l'athlète tient dans un carré)     : 440x440
#
#  RÉFÉRENCES
#  ----------
#    leg extension : 440x440  · 5 images · délais 25 20 50 20 25 centisecondes
#    front squat   : 440x246  · 5 images · délais 25 20 50 20 25 cs
#    fentes bulg.  : 440x246  · 5 images · délais 25 20 50 20 25 cs
#
#  CONTRÔLE FOURNI
#  ---------------
#    - le nombre d'images et la taille finale,
#    - la saturation du décor : cible E1 => >= 22
#      (mesure : convert IMG -resize 400x -colorspace HSL -channel G \
#                -separate +channel -format "%[fx:mean*100]" info:)
# ============================================================================
set -euo pipefail

if [ "$#" -ne 5 ]; then
  echo "usage: $0 A.png M.png B.png LARGEURxHAUTEUR sortie.gif" >&2
  exit 2
fi

A="$1"; M="$2"; B="$3"; SIZE="$4"; OUT="$5"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for f in "$A" "$M" "$B"; do
  [ -f "$f" ] || { echo "FICHIER ABSENT : $f" >&2; exit 1; }
done

# 1) mise au format exact (les sources sont en 1024x1024 ou 1376x768)
convert "$A" -resize "${SIZE}!" "$TMP/a.png"
convert "$M" -resize "${SIZE}!" "$TMP/m.png"
convert "$B" -resize "${SIZE}!" "$TMP/b.png"

# 2) chaîne A -> M -> B -> M -> A, délais officiels 25/20/50/20/25 cs
#    ATTENTION : -delay doit être placé AVANT chaque image (sinon le 1er délai vaut 0
#    et tous les suivants sont décalés d'un cran -> la boucle ne tourne pas comme prévu).
convert -delay 25 "$TMP/a.png" -delay 20 "$TMP/m.png" -delay 50 "$TMP/b.png" \
        -delay 20 "$TMP/m.png" -delay 25 "$TMP/a.png" -loop 0 \
        -layers Optimize "$OUT"

# 3) contrôle
echo "--- $OUT"
echo -n "   images : "; convert "$OUT" -coalesce -format "%wx%h " info: ; echo
echo -n "   délais : "; convert "$OUT" -format "%T cs " info: ; echo
SAT_A=$(convert "$TMP/a.png" -resize 400x -colorspace HSL -channel G -separate +channel -format "%[fx:mean*100]" info:)
SAT_B=$(convert "$TMP/b.png" -resize 400x -colorspace HSL -channel G -separate +channel -format "%[fx:mean*100]" info:)
printf "   saturation A = %.1f   B = %.1f\n" "$SAT_A" "$SAT_B"
awk -v s="$SAT_A" 'BEGIN{ if (s>=22) print "   DECOR : OK cible E1"; else print "   DECOR : PALE -> NON conforme E1 (>= 22 requis)" }'
echo "   taille : $(du -h "$OUT" | cut -f1)"
