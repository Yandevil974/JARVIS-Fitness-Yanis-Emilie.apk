#!/usr/bin/env python3
# ============================================================================
#  lister-sans-animation.py — combien d'exercices s'affichent SANS animation ?
#  Source de verite : les DONNEES de l'application (src/data/legacy.json),
#  en reproduisant exactement la resolution de src/data/library.js :
#      guides = { norm(cle) -> guide }   (elite + emilie MUSCU_GUIDES)
#      guide  = guides[nom];  si guide.ref -> guides[norm(ref)]
#      gif    = guide.img
#  Un exercice est "sans animation" si ce gif est absent. Chiffre MESURE,
#  pas estime : ce script est rejouable apres chaque integration.
# ============================================================================
import json, re, sys, unicodedata, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
LEGACY = os.path.join(ROOT, "src", "data", "legacy.json")


def norm(s):
    s = unicodedata.normalize("NFD", str(s if s is not None else ""))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower().replace("’", " ").replace("'", " ")
    s = re.sub(r"[-–—]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slug(s):
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", norm(s)))


def main():
    legacy = json.load(open(LEGACY))
    guides = {}
    for src in ("elite", "emilie"):
        for k, v in (legacy[src].get("MUSCU_GUIDES") or {}).items():
            guides.setdefault(norm(k), v)

    rows = {}
    for source, data in legacy.items():
        for phase in (data.get("PROGRAM") or {}).values():
            for s in (phase.get("sessions") or {}).values():
                for row in s.get("exos") or []:
                    key = slug(row[0])
                    if key not in rows:
                        rows[key] = {"row": row, "sources": [source]}
                    elif source not in rows[key]["sources"]:
                        rows[key]["sources"].append(source)

    extra = [("Pompes", "pec"), ("Squat au poids du corps", "qua"),
             ("Rowing à l’élastique", "dos"), ("Fentes arrière au poids du corps", "qua"),
             ("Mobilité des épaules", "epA"), ("Respiration diaphragmatique", "tra")]
    for name, m in extra:
        rows[slug(name)] = {"row": [name, m], "sources": ["jarvis"]}

    out = []
    for key, item in rows.items():
        row = item["row"]
        name = row[0]
        g = guides.get(norm(name))
        if g and g.get("ref"):
            g = guides.get(norm(g["ref"])) or guides.get(g["ref"]) or g
        gif = (g or {}).get("img")
        out.append({
            "id": key, "nom": name, "muscle": row[1] if len(row) > 1 else "",
            "sources": "+".join(item["sources"]), "gif": gif,
            "guide": bool(g), "ref": (guides.get(norm(name)) or {}).get("ref", ""),
        })

    total = len(out)
    sans = [o for o in out if not o["gif"]]
    avec = [o for o in out if o["gif"]]
    sans_guide = [o for o in sans if not o["guide"]]

    print(f"EXERCICES AU TOTAL (tous profils)   : {total}")
    print(f"  avec animation                    : {len(avec)}")
    print(f"  SANS animation                    : {len(sans)}")
    print(f"      dont aucun guide du tout      : {len(sans_guide)}")
    print(f"      avec un guide mais sans image : {len(sans) - len(sans_guide)}")
    for prof in ("elite", "emilie"):
        n = len([o for o in sans if prof in o["sources"]])
        t = len([o for o in out if prof in o["sources"]])
        print(f"  côté {prof:7} : {n} sans animation sur {t} exercices")

    if "--liste" in sys.argv:
        print("\n--- LISTE SANS ANIMATION (par muscle) ---")
        for o in sorted(sans, key=lambda o: (o["muscle"], o["nom"])):
            tag = "AUCUN GUIDE" if not o["guide"] else f"guide present, ref='{o['ref']}'"
            print(f"  [{o['sources']:12}] {o['nom'][:52]:52} {o['muscle']:4} {tag}")
    if "--json" in sys.argv:
        json.dump(sans, open("sans-animation.json", "w"), ensure_ascii=False, indent=1)
        print("\n-> sans-animation.json")


if __name__ == "__main__":
    main()
