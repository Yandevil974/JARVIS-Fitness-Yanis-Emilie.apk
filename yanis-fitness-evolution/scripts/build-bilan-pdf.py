#!/usr/bin/env python3
"""Bilan visuel du chantier « reconstruction des animations » au format PDF.

Le PDF sert à valider visuellement chaque animation (3 positions A / M / B),
lot par lot, avant l'intégration dans l'application.

Pré-requis : les images extraites des GIF doivent exister dans un dossier de
travail (voir ci-dessous). Extraction type, depuis animations/ :

    for p in <lot>/<nom>; do
      for i in 0 1 2; do
        convert "$p.gif[$i]" -coalesce -resize 460x257! "$OUT/frames/<nom>-$i.png"
      done
    done
    # planches : convert "<planche>.gif[0]" -coalesce -resize 1396x265! "$OUT/planches/<planche>.png"
    # anciennes versions (avant/après) : git show <commit>:<chemin>.gif > x.gif puis mêmes frames

Usage :
    python3 scripts/build-bilan-pdf.py [dossier_travail] [pdf_de_sortie]

Dépendance : reportlab (pip install reportlab)
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
OUT = sys.argv[2] if len(sys.argv) > 2 else "animations/BILAN-VISUEL-ANIMATIONS.pdf"

FRAMES = os.path.join(WORK, "frames")
OLD = os.path.join(WORK, "old")
PLANCHES = os.path.join(WORK, "planches")

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DJV", f"{FONT_DIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DJV-B", f"{FONT_DIR}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFontFamily("DJV", normal="DJV", bold="DJV-B")

INK = colors.HexColor("#12212e")
ACCENT = colors.HexColor("#d98a00")
OK = colors.HexColor("#1d7a46")
WARN = colors.HexColor("#b3261e")
MUTED = colors.HexColor("#5b6b7a")
RULE = colors.HexColor("#d7dee5")

S = {
    "title": ParagraphStyle("title", fontName="DJV-B", fontSize=23, leading=28, textColor=INK),
    "sub": ParagraphStyle("sub", fontName="DJV", fontSize=11.5, leading=16, textColor=MUTED),
    "h1": ParagraphStyle("h1", fontName="DJV-B", fontSize=15, leading=19, textColor=INK,
                         spaceBefore=4, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName="DJV-B", fontSize=11, leading=14, textColor=INK,
                         spaceBefore=8, spaceAfter=2),
    "body": ParagraphStyle("body", fontName="DJV", fontSize=9.6, leading=13.4, textColor=INK),
    "small": ParagraphStyle("small", fontName="DJV", fontSize=8.3, leading=11.4, textColor=MUTED),
    "cell": ParagraphStyle("cell", fontName="DJV", fontSize=9, leading=12, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="DJV-B", fontSize=9, leading=12, textColor=INK),
    "label": ParagraphStyle("label", fontName="DJV", fontSize=7.2, leading=9, textColor=MUTED,
                            alignment=1),
    "cap": ParagraphStyle("cap", fontName="DJV-B", fontSize=10, leading=13, textColor=INK),
}

# ————— contenu —————
ANIMATIONS = [
    # (lot, fichier, nom affiché, statut, description technique)
    ("POC", "back-squat", "Back squat", "warn",
     "Départ debout barre sur les trapèzes — descente sous la parallèle — remontée. "
     "RÉSERVE : cadrage trop serré, on ne voit que le torse, la tête est coupée."),
    ("POC", "developpe-couche-barre", "Développé couché barre", "ok",
     "Barre au contact du buste — poussée au-dessus des pectoraux — extension."),
    ("POC", "hip-thrust-barre", "Hip thrust barre", "warn",
     "Épaules sur le banc, barre sur les hanches — poussée des hanches — verrouillage. "
     "RÉSERVE : artefacts visuels, planche du banc coupée."),
    ("POC", "souleve-de-terre-roumain", "Soulevé de terre roumain", "warn",
     "Barre au contact des cuisses — hinge hanches en arrière — étirement des ischios. "
     "RÉSERVE : tête et pieds coupés, salissures dans le décor."),
    ("POC", "nage-douce-femme", "Nage douce (femme)", "ok",
     "Piscine intérieure (vue mi-air / mi-eau) — coulée puis traction du bras."),

    ("LOT 1", "dead-bug-3poses", "Dead bug", "ok",
     "Genoux 90°, bras au plafond — bras et jambe opposés tendus au ras du sol — retour."),
    ("LOT 1", "bird-dog-3poses", "Bird dog", "ok",
     "Quadrupédie — bras et jambe opposés tendus — retour, dos neutre."),
    ("LOT 1", "gainage-lateral-3poses", "Gainage latéral", "ok",
     "CORRIGÉ — hanches basses (installation) — mi-hauteur — ligne droite complète, "
     "main libre sur la hanche, coude sous l'épaule."),

    ("LOT 2", "mountain-climbers-3poses", "Mountain climbers", "ok",
     "Planche haute sur les mains — genou opposé vers la poitrine — retour."),
    ("LOT 2", "dead-bug-rotation-3poses", "Dead bug avec rotation", "ok",
     "CORRIGÉ — genoux 90° bras au plafond — rotation du tronc, bras étendu au-dessus de "
     "la tête et jambe opposée tendue — extension maximale, lombaires plaquées."),
    ("LOT 2", "gainage-lateral-dyn-3poses", "Gainage latéral dynamique", "ok",
     "CORRIGÉ — hanches hautes (ligne droite) — creux hanches descendues — retour en haut."),

    ("LOT 3", "circuit-gainage-3poses", "Circuit gainage", "warn",
     "Planche frontale sur avant-bras. RÉSERVE : le circuit comporte 3 positions "
     "(planche → latéral → bird dog) mais l'animation n'en déroule qu'une seule."),
    ("LOT 3", "circuit-abdos-3poses", "Circuit abdominaux", "warn",
     "Crunch genoux fléchis — relevé de jambes — gainage. RÉSERVE : le circuit comporte "
     "3 mouvements enchaînés, l'animation ne montre qu'une seule position."),

    ("LOT 4", "developpe-halteres-plat-3poses", "Développé haltères plat", "ok",
     "Haltères à hauteur de poitrine, prise en pronation — mi-course — extension "
     "complète au-dessus des pectoraux."),
    ("LOT 4", "developpe-halteres-plat-neutre-3poses", "Développé haltères plat, prise neutre", "ok",
     "Haltères parallèles, paumes face à face, coudes rentrés — mi-course — extension."),
    ("LOT 4", "developpe-halteres-decline-neutre-3poses", "Développé haltères décliné, prise neutre", "ok",
     "Banc décliné tête en bas, chevilles sous les rouleaux, prise neutre — mi-course — "
     "extension des pectoraux inférieurs."),

    ("LOT 5", "developpe-halteres-incline-30-3poses", "Développé haltères incliné 30°", "ok",
     "Banc peu incliné (30°) pour cibler le haut des pectoraux, coudes à 45° du buste — "
     "mi-course — extension sans entrechoquer les haltères."),
    ("LOT 5", "developpe-halteres-incline-45-3poses", "Développé haltères incliné 45°", "ok",
     "Banc incliné à 45° (deltoïdes antérieurs davantage sollicités), prise en pronation — "
     "mi-course — extension quasi verticale."),
    ("LOT 5", "developpe-halteres-incline-45-prise-neutre-3poses", "Développé haltères incliné 45°, prise neutre", "ok",
     "Banc à 45°, haltères parallèles paumes face à face, coudes rentrés (variante la plus "
     "douce pour l'épaule) — mi-course — extension."),
]

CORRECTIONS = [
    ("dead-bug-rotation", "Dead bug avec rotation",
     "Avant : le retour au sol sert de position de départ et la rotation n'apparaît jamais "
     "(A jambes tendues bras levés, M crunch, B allongé).",
     "Après : A genoux 90° bras au plafond — M rotation du tronc + bras étendu au-dessus de "
     "la tête et jambe opposée tendue — B extension maximale."),
    ("gainage-lateral", "Gainage latéral",
     "Avant : A planche sur avant-bras, M bras levé, B planche haute sur la main — deux "
     "variantes mélangées, progression incohérente.",
     "Après : A hanches basses — M mi-hauteur — B ligne droite, main libre sur la hanche."),
    ("gainage-lateral-dyn", "Gainage latéral dynamique",
     "Avant : départ et finale visuellement identiques, aucun mouvement des hanches.",
     "Après : A hanches hautes — M creux hanches descendues — B retour en ligne droite."),
]


def frames(name, count=3, old=False):
    base = OLD if old else FRAMES
    out = []
    for i in range(count):
        p = os.path.join(base, f"{name}-{i}.jpg")
        out.append(Image(p, width=160, height=89.4) if os.path.exists(p) else "")
    return out


def anim_block(lot, slug, name, status, note):
    status_txt = {
        "ok": '<font color="#1d7a46">CONFORME</font>',
        "warn": '<font color="#b3261e">À REPRENDRE</font>',
    }[status]
    head = Paragraph(f"{name} <font size=7 color='#8a99a8'>({lot} · {slug}.gif)</font> — {status_txt}",
                     S["cap"])
    imgs = Table([frames(slug),
                  [Paragraph("A · départ", S["label"]), Paragraph("M · mi-course", S["label"]),
                   Paragraph("B · finale", S["label"])]],
                 colWidths=[170, 170, 170])
    imgs.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 1), (-1, 1), 0),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
    ]))
    return [head, imgs, Paragraph(note, S["small"]), Spacer(1, 9)]


def build():
    doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm,
                            topMargin=16 * mm, bottomMargin=15 * mm,
                            title="JARVIS Fitness — Bilan visuel des animations",
                            author="Chantier reconstruction des animations")
    story = []

    # ————— couverture —————
    story.append(Paragraph("JARVIS FITNESS", S["sub"]))
    story.append(Paragraph("Reconstruction des animations — bilan visuel", S["title"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Règle absolue : <b>1 exercice = 1 animation spécifique</b>. Aucun fichier partagé "
        "entre deux exercices. Chaque animation comporte 3 positions chaînées : départ → "
        "mi-course → finale, puis retour à la mi-course pour la boucle.", S["body"]))
    story.append(Spacer(1, 10))

    figures = [
        ["Animations nécessaires (minimum)", "357"],
        ["Animations créées à ce jour", "19"],
        ["Lots livrés", "POC + LOT 1 à LOT 5"],
        ["Animations corrigées (option A)", "3 / 5"],
        ["Fichiers dupliqués traités", "4 / 48"],
        ["Doublons de fichier sur les 24 animations", "0 (empreintes md5 distinctes)"],
        ["POC à reprendre", "3 animations (cadrages et artefacts)"],
    ]
    t = Table([[Paragraph(a, S["cell"]), Paragraph(f"<b>{b}</b>", S["cell"])] for a, b in figures],
              colWidths=[330, 175])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, RULE),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f5f7f9")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    story.append(Paragraph("Style validé (ne pas dévier)", S["h1"]))
    for line in [
        "Mannequin anatomique 3D très musclé, corps <b>blanc argenté mat</b> — jamais chromé ni miroir.",
        "Visage <b>entièrement noir mat</b>, lisse, sans aucun trait. Casquette blanche.",
        "Short noir, baskets blanches. Muscles travaillés <b>dorés jaune-orangé</b>.",
        "Décor unique : <b>terrasse bord de mer</b> (pierre claire, mer, palmiers, mur blanc bas). "
        "Interdit : salle de sport, parquet en bois, mur intérieur, miroir.",
        "Exception : <b>piscine intérieure</b> pour les exercices aquatiques (vue mi-air / mi-eau).",
        "<b>Tapis de sport noir</b> pour tous les exercices au sol.",
    ]:
        story.append(Paragraph(f"• {line}", S["body"]))
    story.append(PageBreak())

    # ————— méthode + état —————
    story.append(Paragraph("Méthode de production d'une animation", S["h1"]))
    for i, line in enumerate([
        "Position de DÉPART générée depuis la référence « Screenshot_20261005_212714_Facebook.jpg ».",
        "MI-COURSE générée en chaînant sur l'image précédente (source_image = étape d'avant).",
        "POSITION FINALE générée en chaînant sur la mi-course.",
        "Assemblage du GIF : A → M → B → M → boucle (ImageMagick, -delay 130/110, "
        "-colors 96 -layers optimize).",
        "Planche de contrôle en montage 3 colonnes, puis commit et push immédiats.",
        "Technique de l'exercice vérifiée en ligne (bench 30° vs 45°, prise neutre, dead bug "
        "avec rotation, planche latérale) avant toute génération.",
    ], 1):
        story.append(Paragraph(f"<b>{i}.</b> {line}", S["body"]))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Avancement par lot", S["h1"]))
    rows = [["Lot", "Contenu", "Animations", "Statut"]]
    rows += [
        ["POC", "back squat, développé couché barre, hip thrust barre, soulevé de terre "
                "roumain, nage douce (femme)", "5", "À repréciser les cadrages"],
        ["LOT 1", "dead bug, bird dog, gainage latéral", "3", "Livré — gainage latéral corrigé"],
        ["LOT 2", "mountain climbers, dead bug avec rotation, gainage latéral dynamique", "3",
         "Livré — 2 animations corrigées"],
        ["LOT 3", "circuit gainage, circuit abdominaux", "2", "Livré — réserve circuits"],
        ["LOT 4", "développé haltères plat, plat prise neutre, décliné prise neutre", "3", "Livré"],
        ["LOT 5", "développé haltères incliné 30°, 45°, 45° prise neutre", "3", "Livré"],
        ["LOT 6", "à venir : soulevés de terre (6 exercices du fichier e5532fe8fa9b40e9.gif)", "—", "Non commencé"],
    ]
    t = Table([[Paragraph(c, S["cellb"] if i == 0 else S["cell"]) for c in r] for i, r in enumerate(rows)],
              colWidths=[52, 275, 58, 120])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, RULE),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2f5")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ————— planches visuelles par lot —————
    story.append(Paragraph("Les animations, position par position", S["h1"]))
    story.append(Paragraph(
        "Chaque ligne montre les trois positions générées puis chaînées. Les fichiers GIF "
        "animés correspondants sont dans le dépôt, dossier animations/.", S["small"]))
    story.append(Spacer(1, 6))
    current = None
    for lot, slug, name, status, note in ANIMATIONS:
        if lot != current:
            if current is not None:
                story.append(PageBreak())
            story.append(Paragraph(f"{lot}", S["h2"]))
            current = lot
        story += anim_block(lot, slug, name, status, note)

    # ————— avant / après —————
    story.append(PageBreak())
    story.append(Paragraph("Option A — corrections avant / après", S["h1"]))
    story.append(Paragraph(
        "Trois animations ont été entièrement régénérées après l'audit de conformité. "
        "Les images « avant » proviennent du commit 3d0d196, les images « après » du commit "
        "4a61b62.", S["small"]))
    story.append(Spacer(1, 8))
    for slug, name, before, after in CORRECTIONS:
        story.append(Paragraph(name, S["cap"]))
        pair = os.path.join(WORK, "pairs", f"{slug}.jpg")
        if os.path.exists(pair):
            iw, ih = ImageReader(pair).getSize()
            story.append(Image(pair, width=500, height=500 * ih / iw))
        story.append(Paragraph(f"<b>Avant :</b> {before}", S["small"]))
        story.append(Paragraph(f"<b>Après :</b> {after}", S["small"]))
        story.append(Spacer(1, 12))

    # ————— planches de montage —————
    story.append(PageBreak())
    story.append(Paragraph("Planches de montage (animation A → M → B → M)", S["h1"]))
    for f, title in [
        ("PLANCHE-POC-5-exercices", "POC — 5 exercices"),
        ("LOT1-gainage-planche", "LOT 1 — dead bug, bird dog, gainage latéral"),
        ("LOT2-abdos-dynamiques", "LOT 2 — mountain climbers, dead bug rotation, gainage latéral dyn."),
        ("LOT3-circuits", "LOT 3 — circuit gainage, circuit abdominaux"),
        ("LOT4-developpes-halteres", "LOT 4 — développés haltères plat / neutre / décliné"),
        ("LOT5-developpes-inclines", "LOT 5 — développés inclinés 30° / 45° / 45° neutre"),
    ]:
        p = os.path.join(PLANCHES, f"{f}.jpg")
        if not os.path.exists(p):
            continue
        story.append(Paragraph(title, S["cap"]))
        iw, ih = ImageReader(p).getSize()          # proportions réelles de la planche
        story.append(Image(p, width=500, height=500 * ih / iw))
        story.append(Spacer(1, 7))

    # ————— audit et suite —————
    story.append(PageBreak())
    story.append(Paragraph("Audit de conformité et suite du chantier", S["h1"]))
    story.append(Paragraph(
        "Contrôles passés : aucun fichier en doublon (24 empreintes md5 distinctes), les "
        "3 positions existent sur toutes les animations, style et décor respectés sur "
        "l'ensemble des lots.", S["body"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Réserves restantes", S["h2"]))
    for line in [
        "<b>POC (3 animations)</b> : cadrages trop serrés et artefacts — back squat (tête "
        "coupée), hip thrust (banc coupé), soulevé de terre roumain (tête et pieds coupés). "
        "Correction non terminée : plafond de génération atteint. Plan de reprise détaillé "
        "dans SUIVI.md.",
        "<b>Circuits (LOT 3)</b> : le circuit gainage et le circuit abdominaux comportent "
        "chacun 3 mouvements enchaînés, mais l'animation n'en déroule qu'un seul. Décision "
        "attendue : animation composite en plusieurs phases ou découpage.",
        "<b>Artefacts résiduels</b> dans les lots 1 et 3 (bavures au-dessus des tapis).",
        "<b>Cadrages hétérogènes</b> : la largeur des images varie encore d'un lot à l'autre.",
    ]:
        story.append(Paragraph(f"• {line}", S["body"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Prochaines étapes", S["h2"]))
    for line in [
        "Terminer l'option A : régénérer les 3 départs du POC puis leurs mi-course et finale.",
        "LOT 6 : les 6 soulevés de terre du fichier e5532fe8fa9b40e9.gif.",
        "Puis f1a40f2c8c8502db.gif (5 mollets), e169d622c8002b38.gif (5 élévations latérales), "
        "et les 43 autres fichiers dupliqués.",
        "Décision en attente : angle et prise de « développé incliné haltères », le seul "
        "exercice du fichier 8de6e89e5395700c.gif encore non traité (6/7 à ce jour).",
        "Phase 11 : intégration dans l'application après validation complète des lots. "
        "Aucun fichier applicatif ni média existant n'a été modifié à ce stade.",
    ]:
        story.append(Paragraph(f"• {line}", S["body"]))

    def footer(canv, d):
        canv.saveState()
        canv.setStrokeColor(RULE)
        canv.setLineWidth(0.5)
        canv.line(20 * mm, 12 * mm, A4[0] - 20 * mm, 12 * mm)
        canv.setFont("DJV", 7.5)
        canv.setFillColor(MUTED)
        canv.drawString(20 * mm, 8.4 * mm,
                        "JARVIS Fitness — chantier reconstruction des animations — 6 octobre 2026")
        canv.drawRightString(A4[0] - 20 * mm, 8.4 * mm, f"page {d.page}")
        canv.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("PDF écrit :", OUT, os.path.getsize(OUT) // 1024, "Ko")


if __name__ == "__main__":
    build()
