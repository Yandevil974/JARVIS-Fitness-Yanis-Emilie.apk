#!/usr/bin/env python3
"""PDF dédié aux NOUVEAUX GIF du chantier (LOT 4, LOT 5 et corrections).

Contrairement à build-bilan-pdf.py (qui couvre l'ensemble du chantier), ce PDF ne
présente que le travail de la session : les 6 animations créées (LOT 4 + LOT 5) et les
3 animations corrigées, avec leurs 3 positions, les sources techniques et les chemins
exacts dans le dépôt.

Usage :  python3 scripts/build-nouveaux-gifs-pdf.py [dossier_travail] [pdf_de_sortie]
Dépendance : reportlab
"""
import os
import sys

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (Image, PageBreak, Paragraph, SimpleDocTemplate,
                                Spacer, Table, TableStyle)

WORK = sys.argv[1] if len(sys.argv) > 1 else "/tmp/pdfbuild"
OUT = sys.argv[2] if len(sys.argv) > 2 else "animations/BILAN-NOUVEAUX-GIFS.pdf"

FRAMES = os.path.join(WORK, "frames")
PLANCHES = os.path.join(WORK, "planches")
PAIRS = os.path.join(WORK, "pairs")

BASE = "yanis-fitness-evolution/animations"
REPO = "https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/blob/arena/fbb1ddb2-jarvis-fitness-yanis-emilie-ap"

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DJV", f"{FONT_DIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DJV-B", f"{FONT_DIR}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFontFamily("DJV", normal="DJV", bold="DJV-B")

INK = colors.HexColor("#12212e")
OK = colors.HexColor("#1d7a46")
MUTED = colors.HexColor("#5b6b7a")
RULE = colors.HexColor("#d7dee5")
GOLD = colors.HexColor("#b06d00")

S = {
    "title": ParagraphStyle("title", fontName="DJV-B", fontSize=23, leading=28, textColor=INK),
    "sub": ParagraphStyle("sub", fontName="DJV", fontSize=11.5, leading=16, textColor=MUTED),
    "h1": ParagraphStyle("h1", fontName="DJV-B", fontSize=15, leading=19, textColor=INK,
                         spaceBefore=4, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName="DJV-B", fontSize=11, leading=14, textColor=GOLD,
                         spaceBefore=10, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="DJV", fontSize=9.6, leading=13.4, textColor=INK),
    "small": ParagraphStyle("small", fontName="DJV", fontSize=8.3, leading=11.4, textColor=MUTED),
    "cell": ParagraphStyle("cell", fontName="DJV", fontSize=9, leading=12, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="DJV-B", fontSize=9, leading=12, textColor=INK),
    "label": ParagraphStyle("label", fontName="DJV", fontSize=7.2, leading=9, textColor=MUTED,
                            alignment=1),
    "cap": ParagraphStyle("cap", fontName="DJV-B", fontSize=10.5, leading=13.5, textColor=INK),
    "mono": ParagraphStyle("mono", fontName="DJV", fontSize=8, leading=11, textColor=MUTED),
}

NEW = [
    ("LOT 4", "developpe-halteres-plat-3poses", "Développé haltères plat", "02f7c8d",
     "Haltères tenus à hauteur de poitrine, avant-bras verticaux, coudes à 45° du buste — "
     "mi-course de la poussée — extension complète au-dessus des pectoraux, haltères non "
     "entrechoqués. Banc plat, pieds au sol.",
     "RÉSERVE : le nom de l'exercice ne précise aucune prise ; l'animation est montrée en "
     "prise classique (paumes vers l'avant)."),
    ("LOT 4", "developpe-halteres-plat-neutre-3poses", "Développé haltères plat, prise neutre", "02f7c8d",
     "Même mouvement mais haltères parallèles, paumes face à face, coudes rentrés près du "
     "corps — mi-course — extension. C'est la variante la plus douce pour l'épaule.",
     ""),
    ("LOT 4", "developpe-halteres-decline-neutre-3poses", "Développé haltères décliné, prise neutre", "02f7c8d",
     "Banc décliné, tête en bas, chevilles calées sous les rouleaux, prise neutre — "
     "mi-course — extension des pectoraux inférieurs.",
     "RÉSERVE : mouvement sur banc, donc pas de tapis noir au sol (impossible sous un banc)."),

    ("LOT 5", "developpe-halteres-incline-30-3poses", "Développé haltères incliné 30°", "3d0d196",
     "Banc volontairement PEU incliné : à 30° c'est le haut des pectoraux qui travaille le "
     "plus. Haltères à hauteur des pectoraux supérieurs, coudes à 45° du buste — mi-course — "
     "extension dans l'axe du banc, sans entrechoquer les haltères.",
     "Technique vérifiée en ligne : 30° est l'angle de référence pour le faisceau "
     "claviculaire (au-delà, les deltoïdes prennent le relais)."),
    ("LOT 5", "developpe-halteres-incline-45-3poses", "Développé haltères incliné 45°", "3d0d196",
     "Banc incliné à 45°, pente bien marquée pour être immédiatement distinguable du 30°. "
     "Prise en pronation — mi-course — extension quasi verticale au-dessus des épaules.",
     "Technique vérifiée en ligne : à 45° les deltoïdes antérieurs sont nettement plus "
     "sollicités ; c'est la limite haute recommandée."),
    ("LOT 5", "developpe-halteres-incline-45-prise-neutre-3poses", "Développé haltères incliné 45°, prise neutre", "3d0d196",
     "Banc à 45°, haltères parallèles tenus paumes face à face, coudes rentrés près du "
     "corps — mi-course — extension, en conservant la prise neutre du début à la fin.",
     "Technique vérifiée en ligne : la prise neutre réduit la rotation externe de l'humérus, "
     "variante recommandée en cas d'épaule sensible."),
]

CORR = [
    ("dead-bug-rotation", "Dead bug avec rotation", "4a61b62",
     "Le retour au sol servait de position de départ et la rotation n'apparaissait jamais.",
     "A genoux 90° bras au plafond — M rotation du tronc avec bras étendu au-dessus de la "
     "tête et jambe opposée tendue — B extension maximale, lombaires plaquées au sol."),
    ("gainage-lateral", "Gainage latéral", "4a61b62",
     "Deux variantes mélangées : planche sur avant-bras puis planche haute sur la main.",
     "A hanches basses (installation) — M mi-hauteur — B ligne droite complète, main libre "
     "sur la hanche, coude sous l'épaule."),
    ("gainage-lateral-dyn", "Gainage latéral dynamique", "4a61b62",
     "Départ et finale visuellement identiques : aucun mouvement des hanches.",
     "A hanches hautes (ligne droite) — M creux hanches descendues — B retour en haut."),
]


def frames(slug, old=False, count=3):
    base = os.path.join(WORK, "old") if old else FRAMES
    return [Image(os.path.join(base, f"{slug}-{i}.jpg"), width=160, height=89.4)
            if os.path.exists(os.path.join(base, f"{slug}-{i}.jpg")) else "" for i in range(count)]


def strip(slug):
    t = Table([frames(slug),
               [Paragraph("A · départ", S["label"]), Paragraph("M · mi-course", S["label"]),
                Paragraph("B · finale", S["label"])]],
              colWidths=[170, 170, 170])
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 1), (-1, 1), 0),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


def build():
    doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm,
                            topMargin=16 * mm, bottomMargin=15 * mm,
                            title="JARVIS Fitness — nouveaux GIF (LOT 4, LOT 5, corrections)",
                            author="Chantier reconstruction des animations")
    st = []

    # ————— couverture —————
    st.append(Paragraph("JARVIS FITNESS · CHANTIER ANIMATIONS", S["sub"]))
    st.append(Paragraph("Les nouveaux GIF — LOT 4, LOT 5 et corrections", S["title"]))
    st.append(Spacer(1, 6))
    st.append(Paragraph(
        "Ce document présente uniquement le travail de cette session : "
        "<b>6 nouvelles animations</b> et <b>3 animations corrigées</b>, chacune en trois "
        "positions chaînées (départ → mi-course → finale → retour → boucle). "
        "Les GIF animés eux-mêmes sont dans le dépôt, dossier "
        f"<font color='#b06d00'>{BASE}/</font>.", S["body"]))
    st.append(Spacer(1, 10))

    rows = [["Livrable", "Contenu", "Nb animations", "Commit"]]
    rows += [
        ["LOT 4", "développé haltères plat · plat prise neutre · décliné prise neutre", "3", "02f7c8d"],
        ["LOT 5", "développé haltères incliné 30° · 45° · 45° prise neutre", "3", "3d0d196"],
        ["Corrections", "dead bug avec rotation · gainage latéral · gainage latéral dynamique",
         "3", "4a61b62"],
    ]
    t = Table([[Paragraph(c, S["cellb"] if i == 0 else S["cell"]) for c in r]
               for i, r in enumerate(rows)], colWidths=[68, 243, 78, 62])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, RULE),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2f5")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
    ]))
    st.append(t)
    st.append(Spacer(1, 12))

    st.append(Paragraph("Ce qui a changé sur ces 6 fichiers", S["h1"]))
    for line in [
        "<b>Développés haltères</b> : les 7 exercices qui partageaient le fichier "
        "<font face='DJV'>8de6e89e5395700c.gif</font> ont désormais leur propre animation, "
        "un par un. 6 sur 7 sont traités à ce jour.",
        "<b>Inclinaisons réellement distinctes</b> : banc peu incliné à 30°, pente marquée à "
        "45°, et prise neutre dédiée — les trois se distinguent au premier coup d'œil.",
        "<b>Prise neutre</b> : haltères parallèles tenus paumes face à face, coudes rentrés, "
        "sur le plat comme sur l'incliné.",
        "<b>Aucun doublon</b> : les 24 animations du chantier ont des empreintes md5 toutes "
        "distinctes — la règle « 1 exercice = 1 animation » est respectée.",
        "<b>Aucun média existant modifié</b> : tout est dans animations/, l'application et "
        "public/media restent intacts jusqu'à la phase d'intégration.",
    ]:
        st.append(Paragraph(f"• {line}", S["body"]))
    st.append(PageBreak())

    # ————— les 6 nouveaux —————
    st.append(Paragraph("Les 6 nouvelles animations", S["h1"]))
    st.append(Paragraph(
        "Chaque ligne montre les trois positions générées puis chaînées en GIF.", S["small"]))
    st.append(Spacer(1, 6))
    cur = None
    for lot, slug, name, commit, note, reserve in NEW:
        if lot != cur:
            if cur is not None:
                st.append(PageBreak())
            st.append(Paragraph(lot, S["h2"]))
            cur = lot
        st.append(Paragraph(
            f"{name} <font size=7 color='#8a99a8'>({slug}.gif · commit {commit})</font> "
            f"— <font color='#1d7a46'>NOUVEAU</font>", S["cap"]))
        st.append(strip(slug))
        st.append(Paragraph(note, S["small"]))
        if reserve:
            st.append(Paragraph(f"<font color='#b06d00'>{reserve}</font>", S["small"]))
        st.append(Spacer(1, 11))

    # ————— avant / après —————
    st.append(PageBreak())
    st.append(Paragraph("Les 3 animations corrigées — avant / après", S["h1"]))
    st.append(Paragraph(
        "Ces trois animations existaient déjà mais ne correspondaient pas à leur exercice. "
        "Elles ont été entièrement régénérées (commit 4a61b62).", S["small"]))
    st.append(Spacer(1, 8))
    for slug, name, commit, before, after in CORR:
        st.append(Paragraph(f"{name} <font size=7 color='#8a99a8'>({slug}.gif)</font>", S["cap"]))
        pair = os.path.join(PAIRS, f"{slug}.jpg")
        if os.path.exists(pair):
            iw, ih = ImageReader(pair).getSize()
            st.append(Image(pair, width=500, height=500 * ih / iw))
        st.append(Paragraph(f"<b>Avant :</b> {before}", S["small"]))
        st.append(Paragraph(f"<b>Après :</b> {after}", S["small"]))
        st.append(Spacer(1, 12))

    # ————— planches —————
    st.append(PageBreak())
    st.append(Paragraph("Planches de montage animées", S["h1"]))
    for f, title in [("LOT4-developpes-halteres", "LOT 4 — plat / plat prise neutre / décliné prise neutre"),
                     ("LOT5-developpes-inclines", "LOT 5 — incliné 30° / incliné 45° / incliné 45° neutre")]:
        p = os.path.join(PLANCHES, f"{f}.jpg")
        if not os.path.exists(p):
            continue
        st.append(Paragraph(title, S["cap"]))
        iw, ih = ImageReader(p).getSize()
        st.append(Image(p, width=500, height=500 * ih / iw))
        st.append(Spacer(1, 10))

    # ————— fichiers —————
    st.append(PageBreak())
    st.append(Paragraph("Où récupérer les fichiers", S["h1"]))
    files = [["Fichier dans le dépôt", "Commit"]]
    for lot, slug, name, commit, _, _ in NEW:
        files.append([f"{BASE}/lot{'4' if lot == 'LOT 4' else '5'}/{slug}.gif", commit])
    files.append([f"{BASE}/lot4/LOT4-developpes-halteres.gif", "02f7c8d"])
    files.append([f"{BASE}/lot5/LOT5-developpes-inclines.gif", "3d0d196"])
    files.append([f"{BASE}/lot2/dead-bug-rotation-3poses.gif", "4a61b62"])
    files.append([f"{BASE}/lot1/gainage-lateral-3poses.gif", "4a61b62"])
    files.append([f"{BASE}/lot2/gainage-lateral-dyn-3poses.gif", "4a61b62"])
    files.append([f"{BASE}/BILAN-VISUEL-ANIMATIONS.pdf", "ef9f148"])
    t = Table([[Paragraph(c, S["cellb"] if i == 0 else S["mono"]) for c in r]
               for i, r in enumerate(files)], colWidths=[390, 61])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, RULE),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2f5")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    st.append(t)
    st.append(Spacer(1, 10))
    st.append(Paragraph(
        "L'onglet du dépôt contenant tous les GIF : "
        f"<font color='#b06d00'>{REPO}/{BASE}</font>", S["body"]))
    st.append(Spacer(1, 10))

    st.append(Paragraph("Ce qui reste à faire", S["h1"]))
    for line in [
        "<b>Développé incliné haltères</b> (le 7ᵉ exercice du fichier 8de6e89e5395700c.gif) : "
        "le nom ne précise ni angle ni prise — décision utilisateur requise avant génération.",
        "<b>POC</b> : 3 animations à reprendre (back squat tête coupée, hip thrust planche du "
        "banc coupée, soulevé de terre roumain tête et pieds coupés). Plan de reprise détaillé "
        "dans animations/SUIVI.md.",
        "<b>LOT 6</b> : les 6 soulevés de terre du fichier e5532fe8fa9b40e9.gif.",
        "<b>Circuits du LOT 3</b> : une seule position animée sur les trois du circuit.",
        "<b>Phase 11</b> : intégration dans l'application, après validation complète des lots.",
    ]:
        st.append(Paragraph(f"• {line}", S["body"]))

    def footer(canv, d):
        canv.saveState()
        canv.setStrokeColor(RULE)
        canv.setLineWidth(0.5)
        canv.line(20 * mm, 12 * mm, A4[0] - 20 * mm, 12 * mm)
        canv.setFont("DJV", 7.5)
        canv.setFillColor(MUTED)
        canv.drawString(20 * mm, 8.4 * mm,
                        "JARVIS Fitness — nouveaux GIF (LOT 4, LOT 5, corrections) — 6 octobre 2026")
        canv.drawRightString(A4[0] - 20 * mm, 8.4 * mm, f"page {d.page}")
        canv.restoreState()

    doc.build(st, onFirstPage=footer, onLaterPages=footer)
    print("PDF écrit :", OUT, os.path.getsize(OUT) // 1024, "Ko")


if __name__ == "__main__":
    build()
