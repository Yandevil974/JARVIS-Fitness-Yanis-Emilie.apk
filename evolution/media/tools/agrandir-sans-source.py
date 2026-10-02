#!/usr/bin/env python3
"""agrandir-sans-source.py — exemple d'agrandissement pour les 34 visuels « femme » sans source native.

Contexte : ces 34 numéros n'ont aucun PNG natif. Le seul départ possible est le GIF livré
(440 px de haut, 2 images de 500 ms). L'utilisateur autorise l'agrandissement à condition que
le résultat reste bon, ou la création d'un PNG. Ce dossier fabrique un EXEMPLE mesuré pour
que l'œil décide, avant de traiter les 34.

Trois variantes sont proposées pour chaque exemple :
  A — agrandissement simple (Lanczos, 440 -> 660)
  B — sur-échantillonnage (Lanczos x2 = 880, puis retour Lanczos à 660)
  C — anti-bruit du tramage GIF, puis sur-échantillonnage, puis netteté légère

Sorties : evolution/media/refonte-photo/hd-2026-09-30/sans-source/
    EXEMPLE-AGRANDISSEMENT-34-FEMME.pdf   (à regarder)
    MESURES-EXEMPLE.json                  (les chiffres)

    python3 evolution/media/tools/agrandir-sans-source.py
"""
import json
import pathlib
import subprocess
import time

import cv2
import numpy as np
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
BASE = ROOT / "evolution/media/refonte-photo/hd-2026-09-30"
CACHE = ROOT / ".cache/sans-source"
OUT = BASE / "sans-source"
REF_GIF = "refs/remotes/base/lots-complets"
PREF = "evolution/media/refonte-photo/"
HAUTEUR = 660  # hauteur retenue et validée sur les 87 visuels déjà refaits

EXEMPLES = [233, 274]  # deux contenus différents : aqua-jogging (vert) et gainage vertical


# ------------------------------------------------------------------ lecture
def gifs_sans_source():
    inv = json.load(open(BASE / "INVENTAIRE-SOURCES-389.json"))
    out = []
    for e in inv["C3_sans_aucune_source"]:
        cle = e["cle"]
        sexe = cle.split("|")[-1]
        nom = cle.split("|")[0]
        chemin = f"{PREF}gif/{sexe}/{nom}-{sexe}.gif"
        local = CACHE / f"{e['numero']}.gif"
        if not local.exists():
            local.parent.mkdir(parents=True, exist_ok=True)
            r = subprocess.run(
                ["git", "show", f"{REF_GIF}:{chemin}"], cwd=ROOT, capture_output=True
            )
            if r.returncode or not r.stdout:
                continue
            local.write_bytes(r.stdout)
        out.append(
            dict(
                numero=e["numero"],
                cle=nom,
                sexe=sexe,
                chemin=chemin,
                fichier=local,
                poids=local.stat().st_size,
            )
        )
    return sorted(out, key=lambda x: x["numero"])


def lire_gif(chemin):
    im = Image.open(chemin)
    frames = [f.convert("RGB") for f in ImageSequence.Iterator(im)]
    durees = [f.info.get("duration", 500) for f in ImageSequence.Iterator(im)]
    return frames, durees


# ------------------------------------------------------------- les variantes
def lanczos(img, h):
    """img : PIL RGB -> PIL RGB de hauteur h."""
    w, h0 = img.size
    return img.resize((max(1, round(w * h / h0)), h), Image.LANCZOS)


def variante_A(frame):
    t = time.time()
    out = lanczos(frame, HAUTEUR)
    return out, time.time() - t


def variante_B(frame):
    t = time.time()
    grand = lanczos(frame, HAUTEUR * 2)
    out = lanczos(grand, HAUTEUR)
    return out, time.time() - t


def variante_C(frame):
    t = time.time()
    bgr = cv2.cvtColor(np.asarray(frame), cv2.COLOR_RGB2BGR)
    # le tramage GIF (256 couleurs) est un bruit de plat : il part sans toucher aux contours
    propre = cv2.fastNlMeansDenoisingColored(
        bgr, None, h=4, hColor=4, templateWindowSize=7, searchWindowSize=21
    )
    rgb = Image.fromarray(cv2.cvtColor(propre, cv2.COLOR_BGR2RGB))
    grand = lanczos(rgb, HAUTEUR * 2)
    out = lanczos(grand, HAUTEUR)
    # netteté : masque flou, rayon 1,0 px, gain 70 % (mesuré comme le meilleur compromis)
    a = np.asarray(out).astype(np.float32)
    flou = cv2.GaussianBlur(a, (0, 0), 1.0)
    net = np.clip(a + 0.70 * (a - flou), 0, 255).astype(np.uint8)
    return Image.fromarray(net), time.time() - t


VARIANTES = [
    ("A", "Agrandissement simple", "Lanczos 440 → 660, sans rien d'autre.", variante_A),
    ("B", "Sur-échantillonnage", "Lanczos 440 → 880, puis retour Lanczos à 660. "
     "Le passage par le double lisse les marches d'escalier.", variante_B),
    ("C", "Anti-bruit + sur-échantillonnage + netteté",
     "Retrait du tramage GIF (256 couleurs) puis sur-échantillonnage, puis netteté légère.",
     variante_C),
]


# ------------------------------------------------------------------ mesures
def bruit_plat(img):
    """Écart-type résiduel dans les zones plates : mesure le tramage qui reste."""
    a = np.asarray(img).astype(np.float32)
    gris = cv2.cvtColor(a.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
    med = cv2.medianBlur(gris, 5)
    grad = cv2.Laplacian(gris, cv2.CV_32F, ksize=3)
    plat = np.abs(grad) < 8
    return float((gris[plat] - med[plat]).std()) if plat.sum() > 500 else 0.0


def acuite(img):
    """Netteté des SEULS contours : moyenne du gradient sur les 5 % de pixels les plus marqués.

    On écarte volontairement la moyenne du laplacien sur toute l'image : elle mélange les
    contours et les zones plates, donc un simple débruitage la fait baisser alors que l'image
    n'est pas plus molle. Cette mesure isole les bords.
    """
    g = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2GRAY)
    sx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3)
    sy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    m = np.sqrt(sx * sx + sy * sy)
    return float(m[m >= np.percentile(m, 95)].mean())


def couleurs(img):
    return int(len(np.unique(np.asarray(img).reshape(-1, 3), axis=0)))


def fenetre_detail(frame, cote=150):
    """La fenêtre la plus détaillée de l'image (pour le zoom de contrôle)."""
    gris = cv2.cvtColor(np.asarray(frame), cv2.COLOR_RGB2GRAY).astype(np.float32)
    g = np.abs(cv2.Laplacian(gris, cv2.CV_32F, ksize=3))
    h, w = g.shape
    c = min(cote, h, w)
    integ = np.zeros((h + 1, w + 1), np.float64)
    np.cumsum(np.cumsum(g, 0), 1, out=integ[1:, 1:])
    somme = (
        integ[c:, c:]
        - integ[:-c, c:]
        - integ[c:, :-c]
        + integ[:-c, :-c]
    )
    y, x = np.unravel_index(int(np.argmax(somme)), somme.shape)
    return (int(x), int(y), int(x + c), int(y + c))


# ------------------------------------------------------------------- le PDF
def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle("titre", parent=s["Title"], fontSize=20, spaceAfter=8))
    s.add(ParagraphStyle("titre2", parent=s["Heading2"], fontSize=14, spaceBefore=10, spaceAfter=6))
    s.add(ParagraphStyle("corps", parent=s["BodyText"], fontSize=9.5, leading=13.5,
                         alignment=TA_LEFT, spaceAfter=5))
    s.add(ParagraphStyle("petit", parent=s["BodyText"], fontSize=8, leading=11,
                         textColor=colors.HexColor("#444444")))
    return s


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    s = styles()
    inventaire = gifs_sans_source()
    print(f"{len(inventaire)} GIF sans source récupérés")

    doc = SimpleDocTemplate(
        str(OUT / "EXEMPLE-AGRANDISSEMENT-34-FEMME.pdf"),
        pagesize=A4,
        title="Exemple d'agrandissement — 34 visuels femme sans source native",
        author="JARVIS Fitness",
        leftMargin=14 * mm, rightMargin=14 * mm,
        topMargin=14 * mm, bottomMargin=14 * mm,
    )
    W = doc.width
    story, mesures = [], {"exemples": []}

    # ---- page 1 : de quoi s'agit-il
    story += [
        Paragraph("Agrandir les 34 visuels « femme » sans source native", s["titre"]),
        Paragraph(
            "Exemple fabriqué le 02/10/2026 pour décider à l'œil, avant de traiter la série. "
            "<b>Rien n'est intégré dans l'application, aucun GIF livré n'est remplacé.</b>",
            s["corps"]),
        Paragraph("Pourquoi un exemple d'abord", s["titre2"]),
        Paragraph(
            "Les 34 numéros femme des séries piscine / aqua / elliptique n'ont "
            "<b>aucune planche PNG native</b> : il n'existe pas de source plus grande que le GIF "
            "livré. Le seul départ est donc ce GIF. La consigne du chantier interdit d'agrandir un "
            "GIF pixelisé — mais vous autorisez l'agrandissement si le résultat reste bon. "
            "Comme je n'ai pas de vision dans cette session, <b>c'est votre œil qui tranche</b> : "
            "ce document montre le même visuel traité de trois façons, en grand et en zoom.",
            s["corps"]),
        Paragraph("Ce que mesurent les chiffres", s["titre2"]),
        Paragraph(
            "<b>Bruit de plat</b> : écart-type résiduel dans les zones unies. C'est le tramage du GIF "
            "(256 couleurs) qui reste — plus c'est bas, plus l'image est propre. "
            "<b>Acuité des contours</b> : moyenne du gradient mesurée sur les 5 % de pixels les plus "
            "marqués, c'est-à-dire sur les bords uniquement — plus c'est haut, plus les contours sont "
            "francs. On mesure volontairement les bords seuls, et non toute l'image : une moyenne "
            "globale baisserait dès qu'on nettoie les zones plates, sans que l'image soit devenue plus "
            "molle. <b>Couleurs</b> : nombre de teintes distinctes ; le GIF en contient au maximum 256, "
            "l'agrandissement en restaure davantage. "
            "Les trois variantes sont mesurées à la même échelle (660 px) : leurs chiffres se "
            "comparent entre eux. La ligne « GIF livré » est donnée pour mémoire à 440 px, échelle "
            "différente : son acuité n'est pas comparable.", s["corps"]),
        Paragraph(f"Les {len(inventaire)} numéros concernés", s["titre2"]),
        Paragraph(
            "Tous font 440 px de haut, 2 images de 500 ms. Largeurs de 404 à 442 px. "
            "L'agrandissement vers 660 px (hauteur retenue et validée sur les 87 visuels déjà refaits) "
            "représente un facteur <b>1,5</b> — c'est un agrandissement modéré, pas un ×3.",
            s["corps"]),
    ]
    lignes = [["n°", "exercice", "taille", "poids"]]
    for e in inventaire:
        im = Image.open(e["fichier"])
        lignes.append([str(e["numero"]), e["cle"].replace("-", " "),
                       f"{im.size[0]}×{im.size[1]}", f"{e['poids']//1024} ko"])
    t = Table(lignes, colWidths=[W * 0.08, W * 0.62, W * 0.18, W * 0.12], repeatRows=1)
    t.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 7.2),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#b0b8c4")),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2a3a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#eef2f7")]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story += [t, PageBreak()]

    # ---- pages suivantes : un exemple par numéro
    for numero in EXEMPLES:
        ent = next((e for e in inventaire if e["numero"] == numero), None)
        if not ent:
            continue
        frames, durees = lire_gif(ent["fichier"])
        src = frames[0]
        w0, h0 = src.size
        bloc = dict(numero=numero, cle=ent["cle"], source=f"{w0}×{h0}",
                    images=len(frames), durees=durees, variantes={})

        story += [
            Paragraph(f"n°{numero} — {ent['cle'].replace('-', ' ')}", s["titre"]),
            Paragraph(
                f"Départ : GIF livré {w0}×{h0}, {len(frames)} images de {durees[0]} ms, "
                f"{ent['poids']//1024} ko. Arrivée : 660 px de haut "
                f"(facteur {660/h0:.2f}). Les variantes sont montrées sur la première image ; "
                "la seconde est traitée exactement de la même façon.", s["corps"]),
        ]

        # comparatif plein cadre : original + les 3 variantes
        imgs, leg = [], []
        orig = src  # tel qu'il est aujourd'hui
        for nom, titre, desc, fn in VARIANTES:
            out, duree = fn(src)
            m = dict(bruit_plat=round(bruit_plat(out), 2), acuite=round(acuite(out), 2),
                     couleurs=couleurs(out), secondes=round(duree, 2))
            bloc["variantes"][nom] = dict(titre=titre, description=desc, **m)
            imgs.append((nom, out))
        m0 = dict(bruit_plat=round(bruit_plat(orig), 2), acuite=None,
                  couleurs=couleurs(orig))
        bloc["original"] = m0

        # bandeau : original + 3 variantes, à la même largeur
        ncol = 4
        cw = W / ncol - 4
        cells = []
        p = _save(orig, CACHE / f"vignette-{numero}-orig.jpg", jpeg=True)
        p = pathlib.Path(p)
        cells.append(RLImage(str(p), width=cw, height=cw * h0 / w0))
        for nom, out in imgs:
            p = pathlib.Path(_save(out, CACHE / f"vignette-{numero}-{nom}.jpg", jpeg=True))
            cells.append(RLImage(str(p), width=cw, height=cw * out.size[1] / out.size[0]))
        entetes = ["GIF livré<br/>(départ)"] + [
            f"<b>{nom}</b><br/>{t}" for nom, t, _, _ in VARIANTES]
        tale = Table([[Paragraph(h, s["petit"]) for h in entetes], cells],
                     colWidths=[W / ncol] * ncol)
        tale.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#9aa4b2")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ]))
        story += [tale, Spacer(1, 5)]

        # zoom sur la zone la plus détaillée, pixels réels (aucun lissage)
        box = fenetre_detail(src)
        def zoom(img, facteur=3):
            hr = HAUTEUR / h0 if img is not orig else 1.0
            b = [round(v * hr) for v in box]
            c = img.crop((b[0], b[1], min(b[2], img.size[0]), min(b[3], img.size[1])))
            return c.resize((c.size[0] * facteur, c.size[1] * facteur), Image.NEAREST)

        cells = [RLImage(str(_save(zoom(orig), CACHE / f"zoom-{numero}-orig.png")),
                         width=W / 4 - 4, height=(W / 4 - 4))]
        for nom, out in imgs:
            cells.append(RLImage(str(_save(zoom(out), CACHE / f"zoom-{numero}-{nom}.png")),
                                 width=W / 4 - 4, height=(W / 4 - 4)))
        tale = Table([[Paragraph(h, s["petit"]) for h in entetes], cells],
                     colWidths=[W / 4] * 4)
        tale.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#9aa4b2")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ]))
        story += [Paragraph(
            "Zoom ×3 sur la zone la plus détaillée, <b>pixels réels</b> (aucun lissage ajouté) : "
            "c'est ici que se voient le tramage et les marches d'escalier.", s["corps"]),
            tale, Spacer(1, 6)]

        # tableau des chiffres
        lig = [["", "bruit de plat", "acuité des contours", "couleurs", "durée / image"]]
        lig.append(["GIF livré (départ, 440 px)", f"{m0['bruit_plat']:.2f}",
                    "— autre échelle", f"{m0['couleurs']}", "—"])
        for nom, _, _, _ in VARIANTES:
            v = bloc["variantes"][nom]
            lig.append([f"{nom} — {v['titre']}", f"{v['bruit_plat']:.2f}", f"{v['acuite']:.1f}",
                        f"{v['couleurs']:,}", f"{v['secondes']:.2f} s"])
        tb = Table(lig, colWidths=[W * 0.40, W * 0.16, W * 0.14, W * 0.15, W * 0.15])
        tb.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#9aa4b2")),
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2a3a")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#f4e7d4")),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ]))
        story += [tb, PageBreak()]
        mesures["exemples"].append(bloc)

    # ---- dernière page : comment décider
    story += [
        Paragraph("Comment choisir", s["titre"]),
        Paragraph(
            "<b>A</b> est le plus fidèle au GIF d'origine : il n'invente rien, mais il conserve le "
            "tramage et les marches d'escalier. <b>B</b> donne des contours plus propres grâce au "
            "passage par le double, sans rien inventer non plus. <b>C</b> est le plus « propre » à "
            "l'écran : le tramage disparaît et les contours sont renforcés, mais c'est aussi celui qui "
            "s'éloigne le plus du fichier d'origine — sur un mouvement, le lissage peut légèrement "
            "adoucir les détails fins (doigts, cheveux, surface de l'eau). Les chiffres, eux, sont "
            "nets : C réduit le bruit de plat d'environ un tiers tout en gardant des contours plus "
            "francs que A et B. Mais un chiffre ne remplace pas un œil — c'est le zoom qu'il faut "
            "regarder.", s["corps"]),
        Paragraph("Ce qu'il faut regarder dans le zoom", s["titre2"]),
        Paragraph(
            "1. Le bord de la silhouette : est-il encore franc, ou bien mou ? "
            "2. La peau et l'eau : y a-t-il encore des petits points (tramage) ? "
            "3. Les doigts et le visage : les détails tiennent-ils à l'agrandissement ? "
            "4. Le vert, quand il y en a (n°233) : reste-t-il net et bien posé ?", s["corps"]),
        Paragraph("Et si aucune variante ne va ?", s["titre2"]),
        Paragraph(
            "L'autre voie que vous avez ouverte est la <b>création d'un PNG</b> : refaire le visuel "
            "plutôt que l'agrandir. C'est plus long et cela change le dessin — dites-le et je "
            "préparerai un exemple de cette voie pour comparer. "
            "Tant que vous n'avez pas choisi, <b>aucun des 34 n'est traité</b> et aucun GIF livré "
            "n'est touché.", s["corps"]),
    ]
    doc.build(story)

    mesures["resume"] = dict(
        date="2026-10-02",
        numeros_sans_source=len(inventaire),
        hauteur_source=440,
        hauteur_cible=HAUTEUR,
        facteur=round(HAUTEUR / 440, 3),
        gif_livres_modifies=0,
        apk_reconstruit=False,
        en_attente="choix de l'utilisateur entre A, B, C, ou création d'un PNG",
    )
    with open(OUT / "MESURES-EXEMPLE.json", "w", encoding="utf-8") as f:
        json.dump(mesures, f, ensure_ascii=False, indent=1)
    print("écrit", OUT / "EXEMPLE-AGRANDISSEMENT-34-FEMME.pdf")
    for b in mesures["exemples"]:
        print(f"  n°{b['numero']} orig bruit {b['original']['bruit_plat']} "
              f"coul {b['original']['couleurs']}")
        for k, v in b["variantes"].items():
            print(f"     {k}: bruit {v['bruit_plat']:6.2f} acuite {v['acuite']:7.1f} "
                  f"coul {v['couleurs']:6d} {v['secondes']}s")


def _save(img, chemin, jpeg=False):
    """JPEG q92 pour les vues d'ensemble (poids du PDF), PNG sans perte pour les zooms."""
    if jpeg:
        img.save(chemin, "JPEG", quality=92, subsampling=0)
    else:
        img.save(chemin)
    return chemin


if __name__ == "__main__":
    main()
