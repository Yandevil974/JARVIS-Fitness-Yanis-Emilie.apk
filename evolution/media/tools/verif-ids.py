# -*- coding: utf-8 -*-
"""Verifie que chaque nom de fichier de planche correspond a un identifiant REEL du plan.
Usage : verif-ids.py planches/lotNN/*.png
Sans cet outil, une planche peut etre dessinee pour un mouvement qui n'existe pas."""
import json, sys, pathlib
plan = pathlib.Path(__file__).resolve().parent.parent / 'refonte-photo' / 'production' / 'plan.json'
idx = {m['identifiant'] for m in json.load(open(plan))['mouvements']}
mauvais = [p.stem for p in (pathlib.Path(a) for a in sys.argv[1:]) if p.stem not in idx]
for p in sys.argv[1:]:
    s = pathlib.Path(p).stem
    print(('OK  ' if s in idx else 'HORS PLAN '), s)
if mauvais:
    print('\n%d planche(s) sans cible dans le plan : %s' % (len(mauvais), ', '.join(mauvais)))
    sys.exit(1)
print('\ntoutes les planches ont une cible valide')
