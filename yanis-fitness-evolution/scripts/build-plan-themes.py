#!/usr/bin/env python3
"""Plan de production THÉMATIQUE du chantier « reconstruction des animations ».

Regroupe les animations nécessaires par thème (échauffement, musculation,
étirements, cardio, piscine) puis découpe chaque thème en lots de 3 exercices
(plafond de production : 10 images IA par tour = 3 exercices × 3 positions).

PÉRIMÈTRE HOMME + FEMME (décision du user, 2026-10-06) :
chaque exercice, chaque étirement et chaque guide piscine existe en DEUX
animations — une avec le mannequin homme (Yanis) et une avec le mannequin femme
(Émilie). Les étapes de chrono étaient déjà comptées homme + femme.
  Total = 209x2 exercices + 100 chrono + 29x2 étirements + 19x2 guides = 614.

Source de vérité : animations/inventaire.json
Sortie : animations/PLAN-THEMES.md
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INV = os.path.join(ROOT, "animations", "inventaire.json")
OUT = os.path.join(ROOT, "animations", "PLAN-THEMES.md")

# ——— Exercices du catalogue musculation rattachés au thème ÉCHAUFFEMENT ——
ACTIVATION = [
    "mobilite-des-epaules",
    "pont-fessier-au-sol-activation",
    "clamshell-a-l-elastique",
    "fire-hydrant-a-l-elastique",
    "squat-au-poids-du-corps",
    "fentes-arriere-au-poids-du-corps",
    "pompes",
    "gainage-planche",
    "abduction-hanche-a-l-elastique",
    "abduction-assise-machine-ou-elastique",
    "pallof-press-a-l-elastique",
    "face-pull-a-l-elastique",
    "respiration-diaphragmatique",
    "hip-thrust-unilateral-1-jambe",
    "dead-bug",
    "bird-dog",
    "gainage-lateral",
    "mountain-climbers",
    "dead-bug-avec-rotation",
    "gainage-lateral-dynamique",
    "circuit-gainage-planche-lateral-bird-dog",
    "circuit-abdominaux-crunch-releves-gainage",
]

# ——— Animations déjà livrées (POC → LOT 5) ———
LIVRE = {
    "back-squat": "POC",
    "developpe-couche-barre": "POC",
    "hip-thrust-barre": "POC",
    "souleve-de-terre-roumain-barre": "POC",
    "dead-bug": "LOT 1",
    "bird-dog": "LOT 1",
    "gainage-lateral": "LOT 1",
    "mountain-climbers": "LOT 2",
    "dead-bug-avec-rotation": "LOT 2",
    "gainage-lateral-dynamique": "LOT 2",
    "circuit-gainage-planche-lateral-bird-dog": "LOT 3",
    "circuit-abdominaux-crunch-releves-gainage": "LOT 3",
    "developpe-halteres-plat": "LOT 4",
    "developpe-halteres-plat-prise-neutre": "LOT 4",
    "developpe-halteres-decline-prise-neutre": "LOT 4",
    "developpe-halteres-incline-30": "LOT 5",
    "developpe-halteres-incline-45": "LOT 5",
    "developpe-halteres-incline-45-prise-neutre": "LOT 5",
    "mobilite-des-epaules": "LOT A-01 H+F",
    "pont-fessier-au-sol-activation": "LOT A-01 H+F",
    "clamshell-a-l-elastique": "LOT A-01 H+F",
    "fire-hydrant-a-l-elastique": "LOT A-02 H+F (F sous réserve)",
    "squat-au-poids-du-corps": "LOT A-02 H+F (F sous réserve)",
    "fentes-arriere-au-poids-du-corps": "LOT A-02 H+F (F sous réserve)",
    "pompes": "LOT A-03",
    "gainage-planche": "LOT A-03",
    "abduction-hanche-a-l-elastique": "LOT A-03",
}

# ——— Sous-thèmes de musculation, par groupe musculaire ———
SOUS_THEMES = [
    ("B-JAM", "Jambes — quadriceps & squats", ["qua"]),
    ("B-FES", "Fessiers & ischio-jambiers", ["fes", "isc"]),
    ("B-MOL", "Mollets", ["mol"]),
    ("B-DOS", "Dos & tirages", ["dos", "lom"]),
    ("B-PEC", "Pectoraux", ["pec"]),
    ("B-EPA", "Épaules", ["epA", "epL", "epP"]),
    ("B-BIC", "Biceps", ["bic", "avb"]),
    ("B-TRI", "Triceps", ["tri"]),
    ("B-ABS", "Abdominaux, obliques & gainage", ["abs", "tra", "moy"]),
]

MUSCLE_LABEL = {
    "qua": "quadriceps", "fes": "fessiers", "isc": "ischio-jambiers",
    "mol": "mollets", "dos": "dos", "lom": "lombaires", "pec": "pectoraux",
    "epA": "épaules (antérieur)", "epL": "épaules (latéral)",
    "epP": "épaules (postérieur)", "bic": "biceps", "avb": "avant-bras",
    "tri": "triceps", "abs": "abdominaux", "tra": "transverse",
    "moy": "moyen fessier",
}

MATERIEL_LABEL = {
    "bodyweight": "poids du corps", "dumbbell": "haltères", "barbell": "barre",
    "cable": "poulie", "machine": "machine", "band": "élastique",
    "pullup": "barre de traction", "bench": "banc",
}


def mat(e):
    return " + ".join(MATERIEL_LABEL.get(m, m) for m in (e.get("materiel") or []))


def main():
    inv = json.load(open(INV, encoding="utf-8"))
    ex = inv["exercices"]
    by_id = {e["id"]: e for e in ex}

    themes = []

    # ——— THÈME A : échauffement, mobilité & activation ———
    a_items = []
    for i in ACTIVATION:
        e = by_id.get(i)
        if not e:
            raise SystemExit("id inconnu dans ACTIVATION : " + i)
        a_items.append(("Exercice", e["nom"], e["id"], MUSCLE_LABEL.get(e["muscle"], e["muscle"]),
                        mat(e) + " · H + F (2 anim.)", LIVRE.get(i)))
    for step in inv["etapes_chrono"]:
        if step["id"].startswith("warmup-"):
            a_items.append(("Étape chrono", step["id"], step["id"], "échauffement",
                            "étape chrono · H + F (2 anim.)", None))
    themes.append(("A", "ÉCHAUFFEMENT, MOBILITÉ & ACTIVATION",
                   "Ce qui est montré AVANT la séance : mise en route, mobilité "
                   "articulaire, activation, séries d'approche.", a_items,
                   "mobilite-des-epaules / pont-fessier-au-sol-activation / "
                   "clamshell-a-l-elastique"))

    # ——— THÈME B : musculation, par groupe musculaire ———
    activation = set(ACTIVATION)
    for code, titre, muscles in SOUS_THEMES:
        items = []
        for e in ex:
            if e["id"] in activation:
                continue
            if e.get("muscle") not in muscles:
                continue
            items.append(("Exercice", e["nom"], e["id"],
                          MUSCLE_LABEL.get(e["muscle"], e["muscle"]),
                          mat(e) + " · H + F (2 anim.)", LIVRE.get(e["id"])))
        if items:
            themes.append(("B", titre, "Sous-thème musculation — " +
                           ", ".join(MUSCLE_LABEL.get(m, m) for m in muscles),
                           items, None))

    # ——— THÈME C : étirements & récupération ———
    c_items = [("Étirement", s["nom"], s["id"], "étirement", "H + F (2 anim.)", None)
               for s in inv["etirements"]]
    for step in inv["etapes_chrono"]:
        if step["id"].startswith("stretch-"):
            c_items.append(("Étape chrono", step["id"], step["id"], "étirement",
                            "étape chrono · H + F (2 anim.)", None))
    themes.append(("C", "ÉTIREMENTS & RÉCUPÉRATION",
                   "Fin de séance et jours de récupération.", c_items, None))

    # ——— THÈME D : cardio & transitions ———
    d_items = []
    for step in inv["etapes_chrono"]:
        if step["id"].startswith("cardio-"):
            d_items.append(("Étape chrono", step["id"], step["id"], "cardio",
                            "étape chrono · H + F (2 anim.)", None))
    themes.append(("D", "CARDIO & TRANSITIONS",
                   "Étapes chronométrées de cardio (elliptique) et transitions.",
                   d_items, None))

    # ——— THÈME E : piscine & aqua ———
    e_items = []
    for step in inv["etapes_chrono"]:
        if step["id"].startswith("pool-") or step["id"].startswith("guide-"):
            e_items.append(("Étape chrono", step["id"], step["id"], "piscine",
                            "étape chrono · H + F (2 anim.)", None))
    for i, g in enumerate(inv["guides"], 1):
        e_items.append(("Guide piscine", "Guide piscine %d" % i,
                        "guide-piscine-%d" % i, "piscine", "guide · H + F (2 anim.)", None))
    themes.append(("E", "PISCINE & AQUA",
                   "Décor exception : piscine intérieure, vue mi-air / mi-eau.",
                   e_items, None))

    # ——— Comptage des animations (une étape chrono = 2 animations, H + F) ———
    def poids(item):
        # Périmètre homme + femme : chaque entrée vaut 2 animations.
        return 2

    # ——— Sortie markdown ———
    L = []
    L.append("# Plan de production THÉMATIQUE — reconstruction des animations\n")
    L.append("Généré par `scripts/build-plan-themes.py` depuis `animations/inventaire.json`.\n")
    L.append("Règle : **1 exercice = 1 animation spécifique**, aucun fichier partagé.\n")
    L.append("Périmètre **HOMME + FEMME** : chaque entrée = 2 animations (Yanis + Émilie).\n")
    L.append("Plafond de production : **10 images IA par tour = 1 lot de 3 exercices par tour**\n")
    L.append("(3 positions par exercice : départ → mi-course → finale).\n")

    total_anim = 0
    total_lots = 0
    L.append("\n## Vue d'ensemble\n")
    L.append("| Thème | Intitulé | Entrées | Animations | Lots de 3 |")
    L.append("| --- | --- | --- | --- | --- |")
    recap = []
    for code, titre, desc, items, _ in themes:
        n_anim = sum(poids(i) for i in items)
        n_lots = (len(items) + 2) // 3
        total_anim += n_anim
        total_lots += n_lots
        recap.append((code, titre, len(items), n_anim, n_lots))
        L.append("| %s | %s | %d | %d | %d |" % (code, titre, len(items), n_anim, n_lots))
    L.append("| **Total** | | **%d** | **%d** | **%d** |" %
             (sum(r[2] for r in recap), total_anim, total_lots))

    for code, titre, desc, items, premier in themes:
        n_anim = sum(poids(i) for i in items)
        L.append("\n---\n")
        L.append("## Thème %s — %s\n" % (code, titre))
        L.append("%s\n" % desc)
        L.append("\n%d entrées · %d animations · %d lots de 3.\n" %
                 (len(items), n_anim, (len(items) + 2) // 3))
        if premier:
            L.append("\n**Premier lot à produire :** %s\n" % premier)
        n_lots = (len(items) + 2) // 3
        for k in range(n_lots):
            chunk = items[k * 3:(k + 1) * 3]
            if code == "B":
                lot = "%s-%02d" % (code, k + 1)
            else:
                lot = "%s-%02d" % (code, k + 1)
            L.append("\n### Lot %s\n" % lot)
            L.append("| # | Entrée | Identifiant | Groupe | Matériel | Statut |")
            L.append("| --- | --- | --- | --- | --- | --- |")
            for j, it in enumerate(chunk, 1):
                statut = "✅ %s" % it[5] if it[5] else "à recréer"
                L.append("| %d | %s | `%s` | %s | %s | %s |" %
                         (j, it[1], it[2], it[3], it[4], statut))

    L.append("\n---\n")
    L.append("\n## Rappel de style (ne pas dévier)\n")
    L.append("- Mannequin anatomique 3D très musclé, **corps blanc argenté mat**.\n")
    L.append("- **Visage entièrement noir mat**, sans aucun trait. Casquette blanche.\n")
    L.append("- Short noir, baskets blanches. Muscles travaillés **doré jaune-orangé**.\n")
    L.append("- Décor unique : **terrasse bord de mer** (pierre claire, mer, palmiers, "
             "mur blanc bas).\n")
    L.append("- Exception : **piscine intérieure** pour les exercices aquatiques "
             "(vue mi-air / mi-eau).\n")
    L.append("- **Tapis de sport noir** pour tous les exercices au sol.\n")
    L.append("- Interdit : salle de sport, parquet, mur intérieur, miroir.\n")

    open(OUT, "w", encoding="utf-8").write("\n".join(L) + "\n")
    print("OK", OUT, "themes=%d entrees=%d animations=%d lots=%d" %
          (len(themes), sum(r[2] for r in recap), total_anim, total_lots))


if __name__ == "__main__":
    main()
