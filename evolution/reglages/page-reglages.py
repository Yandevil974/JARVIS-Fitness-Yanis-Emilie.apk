#!/usr/bin/env python3
"""page-reglages.py — fabrique cardio-piscine.html depuis rapport-cardio-piscine.json.

Même esprit que evolution/media/tools/page-lot.py : un outil rejouable, une page
de lecture pour l'utilisateur. Ne modifie aucune donnée de l'application.

Usage : python3 evolution/reglages/page-reglages.py
"""
import json
import os

ICI = os.path.dirname(os.path.abspath(__file__))
RAPPORT = os.path.join(ICI, "rapport-cardio-piscine.json")
SORTIE = os.path.join(ICI, "cardio-piscine.html")

JOURS = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]
COULEUR = {
    "strength": "#2f6df6",
    "metcon": "#c2410c",
    "swim": "#0e7490",
    "cardio": "#7c3aed",
    "recovery": "#65a30d",
    "rest": "#94a3b8",
}
NOM = {
    "strength": "Musculation",
    "metcon": "METCON",
    "swim": "Piscine",
    "cardio": "Cardio",
    "recovery": "Récup. active",
    "rest": "Repos",
}


def cellule(type_, texte=""):
    c = COULEUR.get(type_, "#94a3b8")
    nom = NOM.get(type_, type_)
    return (
        f'<td class="j" style="background:{c}">'
        f'<b>{nom}</b><span>{texte}</span></td>'
    )


def semaine(jours, titre):
    out = [f'<div class="sem"><div class="sem-t">{titre}</div><table><tr>']
    for d in jours:
        out.append(f"<th>{JOURS[int(d['jour'])] if d['jour'] in JOURS else d['jour']}</th>")
    out.append("</tr><tr>")
    for d in jours:
        extra = d.get("cardio") or ""
        out.append(cellule(d["type"], extra))
    out.append("</tr></table></div>")
    return "".join(out)


def main():
    with open(RAPPORT, encoding="utf-8") as f:
        r = json.load(f)
    t = r["totals"]

    lignes_reg = "".join(
        f"<tr class='{'ecart' if x['basculeSource'] != x['basculeApp'] else ''}'>"
        f"<td>{x['cas']}</td>"
        f"<td class='n'>{x['dureSource']}</td>"
        f"<td class='n'>{x['dureApp']}</td>"
        f"<td>{x['basculeSource']}</td>"
        f"<td>{x['basculeApp']}</td></tr>"
        for x in r["regulation"]
    )

    materiel = ""
    for c in r["equipmentCases"]:
        rows = "".join(
            f"<tr><td>{d['jour']}</td>"
            f"<td style='color:{COULEUR.get(d['type'], '#94a3b8')}'><b>{NOM.get(d['type'], d['type'])}</b></td>"
            f"<td>{d.get('cardio') or '—'}</td></tr>"
            for d in c["semaine1"]
        )
        materiel += (
            f"<div class='mat'><div class='mat-t'>{c['profil']} — {c['materiel']}</div>"
            f"<table>{rows}</table></div>"
        )

    html = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cardio &amp; piscine — réglages des deux profils</title>
<style>
*{{box-sizing:border-box}}
body{{margin:0;background:#0b1220;color:#e2e8f0;font:15px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}}
.wrap{{max-width:1080px;margin:0 auto;padding:32px 20px 80px}}
h1{{font-size:28px;margin:0 0 6px}}
.sous{{color:#94a3b8;margin:0 0 28px}}
h2{{font-size:19px;margin:38px 0 12px;padding-bottom:8px;border-bottom:1px solid #1e293b}}
h3{{font-size:16px;margin:22px 0 8px;color:#cbd5e1}}
.cartes{{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0 8px}}
.carte{{flex:1 1 190px;background:#111c31;border:1px solid #1e293b;border-radius:12px;padding:16px}}
.carte b{{display:block;font-size:26px;color:#fff}}
.carte span{{color:#94a3b8;font-size:13px}}
.ok{{color:#4ade80}} .ko{{color:#f87171}} .att{{color:#fbbf24}}
table{{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}}
th,td{{border:1px solid #1e293b;padding:7px 9px;text-align:left}}
th{{background:#0f172a;color:#94a3b8;font-weight:600}}
td.n{{text-align:right}}
tr.ecart td{{background:#3b1220}}
.sem{{margin:12px 0;border:1px solid #1e293b;border-radius:12px;overflow:hidden}}
.sem-t{{background:#0f172a;padding:8px 12px;font-weight:600;color:#cbd5e1}}
.sem table{{margin:0;border:0}} .sem th,.sem td{{border:0;border-right:1px solid #0b1220}}
td.j{{color:#fff;text-align:center;vertical-align:top;width:14.2%}}
td.j b{{display:block;font-size:12px}} td.j span{{font-size:11px;opacity:.85}}
.mats{{display:flex;gap:12px;flex-wrap:wrap}}
.mat{{flex:1 1 320px;border:1px solid #1e293b;border-radius:12px;overflow:hidden}}
.mat-t{{background:#0f172a;padding:8px 12px;font-weight:600}}
.mat table{{margin:0;border:0}} .mat td{{border:0;border-top:1px solid #1e293b}}
.encadre{{background:#111c31;border:1px solid #1e293b;border-left:3px solid #f59e0b;border-radius:8px;padding:14px 16px;margin:14px 0}}
.encadre.vert{{border-left-color:#4ade80}}
.encadre.rouge{{border-left-color:#f87171}}
.encadre p{{margin:6px 0 0}} .encadre p:first-child{{margin-top:0}}
code{{background:#0f172a;padding:1px 5px;border-radius:4px;font-size:12.5px;color:#fbbf24}}
.question{{background:#111c31;border:1px solid #1e293b;border-radius:12px;padding:16px;margin:12px 0}}
.question b{{color:#fbbf24}}
ul{{margin:8px 0;padding-left:20px}} li{{margin:5px 0}}
</style></head><body><div class="wrap">

<h1>Cardio &amp; piscine — réglages des deux profils</h1>
<p class="sous">Vérification du moteur de l'application contre les deux fichiers sources
(<code>Transformation_Elite_V2</code> = Yanis, <code>Emilie_transformation_V7</code> = Émilie).
Aucun visuel, aucune image : uniquement les réglages. Rien n'a été modifié.</p>

<div class="cartes">
  <div class="carte"><b>{t['joursComparés']:,}</b><span>jours comparés</span></div>
  <div class="carte"><b class="ok">{t['divergents']}</b><span>écart de placement (cardio / piscine)</span></div>
  <div class="carte"><b class="ok">{t['cardioDureesDivergentes']}</b><span>écart de durée ou de zone</span></div>
  <div class="carte"><b class="ko">{t['regulationDivergente']}</b><span>écarts d'auto-régulation</span></div>
</div>

<div class="encadre vert"><p><b>Le placement est fidèle.</b> 18 scénarios (2 profils × 3 fréquences
× 3 configurations de jours piscine), 52 semaines chacun : le jour, le type de séance et
la séance de musculation sont identiques au fichier source dans 100 % des cas.
Les durées et zones cardiaques d'Émilie sont identiques sur toute l'année.</p></div>

<h2>1. Ce qui est vérifié juste</h2>
<ul>
<li>Jours d'entraînement : Yanis 4×/sem. = lun · mar · jeu · ven ; Émilie = lun · mar · jeu · sam. Identiques à la source.</li>
<li>Jours METCON de Yanis (mercredi et samedi à 4×/sem.) et jours cardio d'Émilie (mercredi et vendredi).</li>
<li>Rotation des séances de musculation, semaines de deload, phase finale.</li>
<li>Durées et zones d'Émilie : 20 min Z1 en elliptique, 25 min Z1 en piscine, 28 min Z2 le mercredi en phase « composition », 30 min en deload.</li>
<li>Contenu du METCON de Yanis (elliptique + transition 5 min + piscine) et sa rotation de protocoles.</li>
</ul>

<h2>2. Le seuil « 3 séances dures / 7 jours » (Yanis) — 3 écarts</h2>
<p>C'est le réglage qui fait basculer le METCON en version modérée quand la charge est élevée.
La source compte comme « dure » : tout tabata, tout elliptique en HIIT ou Intervalles, et toute
piscine qui n'est ni Aqua Recovery ni Swim Endurance. L'application ne compte que les
activités de type <code>hiit</code> ou <code>aqua</code> (plus, en supplément, toute séance notée RPE ≥ 8).</p>
<table><tr><th>Cas (sur 7 jours)</th><th class="n">dures source</th><th class="n">dures app</th><th>source</th><th>application</th></tr>
{lignes_reg}</table>
<div class="encadre rouge"><p><b>Conséquence mesurée.</b> Après trois METCON « elliptique HIIT + Swim Sprint »,
la source bascule en version modérée ; l'application reste en version intense, car elle ne compte
aucune de ces six séances comme dure. Le réglage ne protège donc plus Yanis.</p></div>

<h2>3. Un réglage sans effet chez Yanis</h2>
<p>Les cases <b>Piscine</b> et <b>Vélo elliptique</b> de « Profil → Matériel &amp; préférences »
ne changent <b>rien</b> à la semaine de Yanis : le METCON est imposé quel que soit le matériel.
Chez Émilie, le même réglage fonctionne et modifie bien la semaine. C'est conforme au fichier
source (le METCON de Yanis y est imposé), mais l'application affiche des cases qui ne servent pas.</p>
<div class="mats">{materiel}</div>

<h2>4. Deux réglages à connaître</h2>
<ul>
<li><b>Jour piscine d'Émilie par défaut.</b> Un nouveau profil Émilie démarre avec le vendredi
coché. À 4 séances par semaine, le vendredi est déjà un jour cardio : la case piscine est
absorbée sans effet. À 3 ou 5 séances, elle ajoute une séance de piscine. Le fichier source
démarre, lui, sans aucun jour piscine coché.</li>
<li><b>Mémoire du dernier protocole.</b> La source évite de reproposer le protocole de la
dernière séance <em>de toute l'histoire</em>. L'application ne regarde que les 7 derniers jours :
après une semaine sans piscine, le même protocole peut revenir deux fois de suite.</li>
</ul>

<h2>5. Ce qui est une addition de l'application (à confirmer avant le build)</h2>
<div class="question"><p><b>1 · La piscine fractionnée.</b> L'écran « Nage en longueurs »
(séries × distance, récupération, style, temps cible, bouton « Lancer le fractionné »)
n'existe dans <b>aucun</b> des deux fichiers sources : l'expression « Nage en longueurs »
y apparaît zéro fois. C'est un ajout. Le garder ?</p></div>
<div class="question"><p><b>2 · L'Aqua Tabata d'Émilie.</b> Celui-là n'est <b>pas</b> un ajout :
il vient de la source, qui écrit « le Tabata se fait aussi dans la piscine (20/10, zéro impact) :
voir Pool Lab → Aqua Tabata » et liste les six protocoles « chacun en 3 niveaux ».
Il est déjà proposé dans l'application, et il entre aussi dans la rotation du METCON de Yanis.
Le confirmer tel quel ?</p></div>
<div class="question"><p><b>3 · Le METCON.</b> Son contenu et sa rotation sont fidèles à la source,
à l'exception du seuil du §2. Faut-il corriger le seuil pour revenir au comportement de la source ?</p></div>

<h2>6. Comment ces chiffres sont obtenus</h2>
<p><code>evolution/reglages/comparer-cardio-piscine.mjs</code> importe le vrai moteur de
l'application (<code>src/engine/source-schedule.js</code>) et le compare, jour par jour, aux
fonctions extraites des fichiers sources (<code>audit/reference/</code> :
<code>elite-weekPlan.js</code>, <code>emilie-weekPlan.js</code>, <code>emilie-cardioDuJour.js</code>,
<code>elite-coachExtra.js</code>). Rejouable : <code>node evolution/reglages/comparer-cardio-piscine.mjs</code>.</p>

</div></body></html>"""

    with open(SORTIE, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"écrit {SORTIE} ({len(html)} octets)")


if __name__ == "__main__":
    main()
