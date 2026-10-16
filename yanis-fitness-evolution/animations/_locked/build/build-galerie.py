#!/usr/bin/env python3
"""build-galerie.py — page de validation regroupant les GIF des modules 1 et 2.

Lit MANIFESTE-VALIDATION.json (listes d'entrées {module, etiquette, gif, etat,
recommandations}) et produit GALERIE-MODULES-1-2.html : tous les GIF en lecture
boucle, côte à côte avec leurs recommandations, pour validation ou corrections.

  python3 build-galerie.py
"""
import json
import os

ICI = os.path.dirname(os.path.abspath(__file__))
MANIFESTE = os.path.join(ICI, "MANIFESTE-VALIDATION.json")
SORTIE = os.path.join(ICI, "..", "GALERIE-MODULES-1-2.html")

TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>JARVIS Fitness — validation modules 1 et 2</title>
<style>
 body {{ font-family: system-ui, sans-serif; margin: 0; background: #10151c; color: #eef2f6; }}
 header {{ padding: 24px 32px; background: #182231; border-bottom: 3px solid #f0a500; }}
 h1 {{ margin: 0 0 6px; font-size: 22px; }}
 header p {{ margin: 2px 0; color: #b9c4d0; font-size: 14px; }}
 main {{ padding: 24px 32px 80px; }}
 h2 {{ margin: 34px 0 10px; font-size: 18px; color: #f0a500; border-bottom: 1px solid #2c3a4d; padding-bottom: 6px; }}
 .grille {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(430px, 1fr)); gap: 18px; }}
 figure {{ margin: 0; background: #182231; border: 1px solid #2c3a4d; border-radius: 10px; overflow: hidden; }}
 figure img {{ width: 100%; display: block; background: #000; }}
 figcaption {{ padding: 10px 14px 14px; font-size: 13px; }}
 figcaption b {{ display: block; font-size: 14px; margin-bottom: 4px; }}
 ul {{ margin: 6px 0 0; padding-left: 18px; color: #cfd8e3; }}
 .etat {{ display: inline-block; margin-top: 8px; padding: 2px 10px; border-radius: 12px;
          background: #143d2b; color: #7ce8a9; font-size: 12px; }}
 .etat.attente {{ background: #4d3a14; color: #ffd479; }}
</style>
</head>
<body>
<header>
 <h1>JARVIS Fitness — animations modules 1 et 2 à valider</h1>
 <p>Athlète verrouillé · décor E1 terrasse-mer · sol sablé clair · mouvement fluide (cadence animation, sans diaporama).</p>
 <p>Chaque GIF boucle en lecture : valider tel quel, ou indiquer les corrections par numéro.</p>
</header>
<main>
{sections}
</main>
</body>
</html>
"""


def main():
    data = json.load(open(MANIFESTE, encoding="utf-8"))
    sections = []
    for module in data["modules"]:
        cartes = []
        for e in module["entrees"]:
            recos = "".join(f"<li>{r}</li>" for r in e.get("recommandations", []))
            etat = e.get("etat", "à valider")
            cls = "" if etat.startswith("intégr") else " attente"
            media = (f"<img src=\"{e['gif']}\" alt=\"{e['etiquette']}\">"
                     if e.get("gif") else
                     "<div style=\"padding:28px;background:#0d1420;color:#8fa1b3;"
                     "text-align:center\">visuel en production — entrée ajoutée "
                     "dès ses clés contrôlées</div>")
            cartes.append(
                f"<figure>{media}"
                f"<figcaption><b>{e['num']}. {e['etiquette']}</b>"
                f"<ul>{recos}</ul>"
                f"<span class=\"etat{cls}\">{etat}</span></figcaption></figure>"
            )
        sections.append(
            f"<h2>{module['titre']}</h2><div class=\"grille\">{''.join(cartes)}</div>"
        )
    html = TEMPLATE.format(sections="\n".join(sections))
    with open(SORTIE, "w", encoding="utf-8") as f:
        f.write(html)
    print("galerie écrite :", os.path.abspath(SORTIE))


if __name__ == "__main__":
    main()
