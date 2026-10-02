#!/usr/bin/env python3
"""pdf-vert-seul.py — le PDF de validation du chantier « vert seul » sur les 34 visuels femme.

Mêmes sorties que retouche-vert-seul.py, mais en PDF : ça s'ouvre sans serveur et sans
visionneuse HTML. Pour chaque image : les 2 images du GIF avant, les 2 images après,
et les chiffres.

    python3 evolution/media/tools/pdf-vert-seul.py
"""
import json
import pathlib

from PIL import Image, ImageSequence
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image as RLImage,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = pathlib.Path(__file__).resolve().parents[3]
VERT = ROOT / "evolution/media/refonte-photo/hd-2026-09-30/sans-source/vert"
AVANT = VERT / "avant"
CACHE = ROOT / ".cache/sans-source"
SORTIE = VERT / "VERT-SEUL-34-FEMME.pdf"

GRIS = colors.HexColor("#9aa4b2")
SOMBRE = colors.HexColor("#1f2a3a")


def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle("titre", parent=s["Title"], fontSize=19, spaceAfter=6))
    s.add(ParagraphStyle("t2", parent=s["Heading2"], fontSize=13, spaceBefore=8, spaceAfter=5))
    s.add(ParagraphStyle("corps", parent=s["BodyText"], fontSize=9.5, leading=13,
                         alignment=TA_LEFT, spaceAfter=5))
    s.add(ParagraphStyle("petit", parent=s["BodyText"], fontSize=8, leading=10.5, spaceAfter=2))
    return s


def images_gif(chemin):
    im = Image.open(chemin)
    return [f.convert("RGB") for f in ImageSequence.Iterator(im)]


def cellule(titre, img, largeur, s, tag=None):
    p = CACHE / f"pdf-{abs(hash(titre)) % 10**9}.jpg"
    img.save(p, "JPEG", quality=93, subsampling=0)
    contenu = [[Paragraph(titre, s["petit"])]]
    if tag:
        contenu.insert(0, [Paragraph(tag, s["petit"])])
    contenu.append([RLImage(str(p), width=largeur,
                            height=largeur * img.size[1] / img.size[0])])
    t = Table(contenu, colWidths=[largeur])
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("BOX", (0, 0), (-1, -1), 0.3, GRIS),
    ]))
    return t


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    d = json.load(open(VERT / "CONTROLES.json"))
    s = styles()
    doc = SimpleDocTemplate(str(SORTIE), pagesize=A4, title="Vert seul — 34 visuels femme",
                            author="JARVIS Fitness", leftMargin=13 * mm, rightMargin=13 * mm,
                            topMargin=13 * mm, bottomMargin=13 * mm)
    W = doc.width
    ref = d["reference_260"]
    story = []

    # ---------- page 1
    story += [
        Paragraph("Le vert seul — 34 visuels femme sans source native", s["titre"]),
        Paragraph(
            "Décision du 02/10/2026 : <b>pas d'agrandissement</b>. Chaque GIF reste à la taille "
            "exacte du fichier livré (440 px de haut, 2 images de 500 ms). <b>Seule la zone verte "
            "change</b> : elle est ramenée dans la famille du n°260 par correspondance de "
            "percentiles — la méthode du prototype 44 validé. "
            f"<b>{d['resume']['pixels_hors_zone_modifies']} pixel modifié hors zone verte.</b> "
            "Rien n'est intégré dans l'application, aucun GIF livré n'est remplacé.", s["corps"]),
        Paragraph("Résumé", s["t2"]),
    ]
    r = d["resume"]
    lignes = [["34 numéros", "14 fichiers uniques (plusieurs partagent le même GIF)"],
              ["Images traitées", str(r["images_traitees"])],
              ["Sans vert du tout", f"{r['numeros_sans_vert']} numéros : "
                                    f"{', '.join(str(n) for n in d['numeros_sans_vert'])}"],
              ["Taille des exports", "identique à la source, 2 images de 500 ms"],
              ["Référence 260", f"saturation {ref['saturation']} · teinte {ref['teinte']}°"],
              ["Pixels hors zone modifiés", str(r["pixels_hors_zone_modifies"])]]
    t = Table(lignes, colWidths=[W * 0.30, W * 0.70])
    t.setStyle(TableStyle([("FONTSIZE", (0, 0), (-1, -1), 9),
                           ("GRID", (0, 0), (-1, -1), 0.3, GRIS),
                           ("BACKGROUND", (0, 0), (0, -1), SOMBRE),
                           ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
                           ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story += [t, Spacer(1, 8), Paragraph("Les 10 images, en chiffres", s["t2"])]
    lig = [["n°", "exercice", "px vert", "S avant", "S après", "teinte avant", "teinte après",
            "couv.", "déb."]]
    for e in d["images"]:
        lig.append([", ".join(str(n) for n in e["numeros"])[:22],
                    e["cle"].replace("-", " ")[:26],
                    str(e["avant"]["pixels"]), f"{e['avant']['saturation']:.3f}",
                    f"{e['apres']['saturation']:.3f}", f"{e['avant']['teinte']:.0f}°",
                    f"{e['apres']['teinte']:.0f}°", f"{e['couverture_peau']:.2f}",
                    f"{e['debordement_vert']:.2f}"])
    t = Table(lig, colWidths=[W * .13, W * .25, W * .08, W * .10, W * .10, W * .11,
                              W * .11, W * .06, W * .06], repeatRows=1)
    t.setStyle(TableStyle([("FONTSIZE", (0, 0), (-1, -1), 7.2),
                           ("GRID", (0, 0), (-1, -1), 0.25, GRIS),
                           ("BACKGROUND", (0, 0), (-1, 0), SOMBRE),
                           ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                           ("ALIGN", (2, 1), (-1, -1), "CENTER"),
                           ("ROWBACKGROUNDS", (0, 1), (-1, -1),
                            [colors.white, colors.HexColor("#eef2f7")])]))
    story += [t, Spacer(1, 10),
              Paragraph("<b>Le piège à trancher.</b> 5 images sur 10 ont une teinte éloignée du "
                        "vert muscle (n°260 = 86°). Elles sont signalées en rouge sur leur page : "
                        "dans un bassin, l'eau peut être prise pour le muscle peint. Le n°292 "
                        "(147°) et le n°313 (165°, cyan) sont les deux cas les plus douteux — et "
                        "le 313 est le seul dont la saturation <b>baisse</b> au lieu de monter. "
                        "À valider à l'œil, numéro par numéro.", s["corps"]),
              PageBreak()]

    # ---------- une page par image
    for e in d["images"]:
        nums = ", ".join(str(n) for n in e["numeros"])
        avant = images_gif(AVANT / f"{e['numeros'][0]}-livre-{e['taille'].replace(chr(215), 'x')}.gif")
        apres = images_gif(VERT / e["export"])
        cw = W / 2 - 6

        story += [Paragraph(f"n°{nums} — {e['cle'].replace('-', ' ')}", s["titre"]),
                  Paragraph(f"{e['taille']} · {e['images']} images de {e['durees'][0]} ms · "
                            f"zone verte {e['avant']['pixels']} px · "
                            f"{e['poids_source']//1024} ko → {e['poids_export']//1024} ko",
                            s["corps"])]
        if e["alerte"]:
            t = Table([[Paragraph(f"<b>À regarder :</b> {e['alerte']}", s["corps"])]],
                      colWidths=[W])
            t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#3b1220")),
                                   ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#f87171")),
                                   ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#fecaca")),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 8),
                                   ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                                   ("TOPPADDING", (0, 0), (-1, -1), 6),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
            story += [t, Spacer(1, 5)]

        grille = []
        for i in range(len(avant)):
            grille.append([cellule(f"AVANT — image {i + 1}", avant[i], cw, s),
                           cellule(f"APRÈS — image {i + 1}", apres[i], cw, s)])
        t = Table(grille, colWidths=[W / 2, W / 2])
        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                               ("LEFTPADDING", (0, 0), (-1, -1), 3),
                               ("RIGHTPADDING", (0, 0), (-1, -1), 3)]))
        story += [t, Spacer(1, 6)]

        lig = [["", "saturation", "teinte", "nuances", "couverture", "débordement",
                "hors zone"]]
        lig.append(["avant", f"{e['avant']['saturation']:.3f}", f"{e['avant']['teinte']}°",
                    str(e["avant"]["nuances"]), "—", "—", "—"])
        lig.append(["après", f"{e['apres']['saturation']:.3f}", f"{e['apres']['teinte']}°",
                    str(e["apres"]["nuances"]), f"{e['couverture_peau']:.2f}",
                    f"{e['debordement_vert']:.2f}", str(e["pixels_hors_zone_modifies"])])
        lig.append(["n°260", f"{ref['saturation']:.3f}", f"{ref['teinte']}°", "—", "—", "—", "—"])
        t = Table(lig, colWidths=[W * .12, W * .16, W * .13, W * .14, W * .15, W * .15, W * .15])
        t.setStyle(TableStyle([("FONTSIZE", (0, 0), (-1, -1), 8),
                               ("GRID", (0, 0), (-1, -1), 0.3, GRIS),
                               ("BACKGROUND", (0, 0), (-1, 0), SOMBRE),
                               ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                               ("BACKGROUND", (0, 3), (-1, 3), colors.HexColor("#f4e7d4")),
                               ("ALIGN", (1, 0), (-1, -1), "CENTER")]))
        story += [t]
        if e is not d["images"][-1]:
            story.append(PageBreak())

    doc.build(story)
    print("écrit", SORTIE, f"({SORTIE.stat().st_size / 1048576:.1f} Mo)")


if __name__ == "__main__":
    main()
