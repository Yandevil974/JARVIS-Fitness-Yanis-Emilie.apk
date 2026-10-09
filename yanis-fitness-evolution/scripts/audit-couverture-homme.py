#!/usr/bin/env python3
"""Audit de couverture : GIFs HOMME livrés -> exercices de l'application.

Produit un JSON (sortie standard) avec :
  - le mapping GIF livré -> exercice(s) app (id, nom, muscle, sources, override actuel) ;
  - le résumé de couverture (inventaire exercices couverts / total).

Le matching app reproduit `norm()` et `slug()` de `src/engine/utils.js` et
suit le routage de `src/data/library.js` (`exercise.gif = GIF_OVERRIDES[norm(name)]
|| guide.img`, indépendant du profil : un GIF d'exercice sert les deux profils).

Usage (depuis la racine `yanis-fitness-evolution/`) :
    python3 scripts/audit-couverture-homme.py > /tmp/audit.json

Ne modifie aucun fichier. Les POC et les GIFs FEMME sont exclus du comptage.
"""
import glob
import hashlib
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def norm(s):
    s = unicodedata.normalize("NFD", str(s or ""))
    s = re.sub(r"[̀-ͯ]", "", s)
    s = s.lower().replace("’", " ").replace("'", " ")
    s = re.sub(r"[-–—]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")


# ——— exercices app (même construction que src/data/library.js) ———
legacy = json.load(open(f"{ROOT}/src/data/legacy.json", encoding="utf-8"))
exos = {}
for src, data in legacy.items():
    for phase in data.get("PROGRAM", {}).values():
        for sess in phase.get("sessions", {}).values():
            for row in sess.get("exos", []):
                name, muscle = row[0], row[1]
                k = slug(name)
                exos.setdefault(k, {"name": name, "muscle": muscle, "sources": []})
                if src not in exos[k]["sources"]:
                    exos[k]["sources"].append(src)
for name in ["Pompes", "Squat au poids du corps", "Rowing à l’élastique",
             "Fentes arrière au poids du corps", "Mobilité des épaules",
             "Respiration diaphragmatique"]:
    exos.setdefault(slug(name), {"name": name, "muscle": None, "sources": ["jarvis"]})

# ——— overrides et guides actuels ———
ov_txt = open(f"{ROOT}/src/data/gif-overrides.js", encoding="utf-8").read()
overrides = dict(re.findall(r'"([^"]+)"\s*:\s*"(/media/[^"]+\.gif)"', ov_txt))
guides = {}
for src in ("elite", "emilie"):
    for name, g in legacy[src].get("MUSCU_GUIDES", {}).items():
        if isinstance(g, dict) and g.get("img"):
            guides.setdefault(norm(name), g["img"])
        elif isinstance(g, dict) and g.get("ref"):
            guides.setdefault(norm(name), f"ref:{g['ref']}")


def current_gif(name):
    n = norm(name)
    return overrides.get(n) or guides.get(n)


# ——— GIFs HOMME livrés (hors femme/, hors POC) ———
gifs = []
for p in sorted(glob.glob(f"{ROOT}/animations/**/*-3poses.gif", recursive=True)):
    rel = os.path.relpath(p, f"{ROOT}/animations")
    if "/femme/" in rel:
        continue
    base = os.path.basename(p)[: -len("-3poses.gif")]
    sha16 = hashlib.sha256(open(p, "rb").read()).hexdigest()[:16]
    gifs.append({"base": base, "rel": rel, "sha16": sha16})

# ——— matching GIF -> exercices (slug exact, alias, puis flou) ———
ALIASES = {
    "squat-poids-du-corps": ["squat au poids du corps"],
    "fentes-arriere-pdc": ["fentes arrière au poids du corps"],
    "developpe-halteres-plat-neutre": ["développé haltères plat, prise neutre"],
    "developpe-halteres-decline-neutre": ["développé haltères décliné, prise neutre"],
    "developpe-halteres-incline-30": ["développé haltères incliné 30°"],
    "developpe-halteres-incline-45": ["développé haltères incliné 45°"],
    "developpe-halteres-incline-45-prise-neutre": ["développé haltères incliné 45°, prise neutre"],
    "hip-thrust-unilateral-1-jambe": ["hip thrust unilatéral (1 jambe)"],
    "pont-fessier-activation": ["pont fessier au sol — activation"],
    "abduction-assise-machine-ou-elastique": ["abduction assise (machine ou élastique)"],
    "abduction-hanche-elastique": ["abduction hanche à l'élastique"],
    "clamshell-elastique": ["clamshell à l'élastique"],
    "face-pull-a-l-elastique": ["face pull à l'élastique"],
    "pallof-press-a-l-elastique": ["pallof press à l'élastique"],
    "fire-hydrant-elastique": ["fire hydrant à l'élastique"],
    "bulgarian-split-squat-halteres": ["bulgarian split squat haltères"],
    "step-up-sur-banc-hauteur-du-genou": ["step-up sur banc (hauteur du genou)"],
    "back-squat-charge-moderee": ["back squat (charge modérée)"],
    "presse-a-cuisses-pieds-hauts": ["presse à cuisses pieds hauts"],
    "squat-cycliste-squat-complet": ["squat cycliste (squat complet)"],
    "circuit-abdos": ["circuit abdominaux (crunch + relevés + gainage)"],
    "circuit-gainage": ["circuit gainage (planche + latéral + bird dog)"],
    "dead-bug-rotation": ["dead bug avec rotation"],
}


def match_exos(base):
    if base in exos:
        return [base]
    for alias in ALIASES.get(base, []):
        for eid, e in exos.items():
            if eid == slug(alias) or norm(e["name"]) == norm(alias):
                return [eid]
    nb = norm(base).replace("-", " ")
    return [eid for eid, e in exos.items() if nb and nb in norm(e["name"])]


mapping = []
for g in gifs:
    hits = match_exos(g["base"])
    entry = {"gif": g["base"], "rel": g["rel"], "sha16": g["sha16"], "exos": []}
    for eid in hits:
        e = exos[eid]
        entry["exos"].append({
            "id": eid, "name": e["name"], "muscle": e["muscle"],
            "sources": e["sources"], "current": current_gif(e["name"]),
        })
    mapping.append(entry)

# ——— couverture inventaire ———
inv = json.load(open(f"{ROOT}/animations/inventaire.json", encoding="utf-8"))
inv_ids = {e["id"]: e for e in inv["exercices"]}
covered = set()
for m in mapping:
    for ex in m["exos"]:
        if ex["id"] in inv_ids:
            covered.add(ex["id"])
    if m["gif"] in inv_ids:
        covered.add(m["gif"])

out = {
    "summary": {
        "nb_app_exos": len(exos),
        "nb_gifs_homme": len(gifs),
        "nb_inv_exos": len(inv_ids),
        "nb_inv_couverts": len(covered),
        "pct_inv_couverts": round(100.0 * len(covered) / len(inv_ids), 1),
    },
    "mapping": mapping,
    "poc": {"base": "back-squat", "rel": "poc/back-squat.gif"},
    "inv_couverts": sorted(covered),
}
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
print()
