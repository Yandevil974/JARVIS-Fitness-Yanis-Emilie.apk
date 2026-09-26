#!/usr/bin/env python3
"""PDF limité aux retours : AVANT à gauche, APRÈS proposé à droite.

Refuse toute génération finale tant qu'un numéro du registre n'a pas de
proposition. Lit l'AVANT dans le commit figé, pas dans une planche source
(parfois mal associée). Supporte 2 ou 4 frames sans modifier aucun GIF.
Toutes les pages sont marquées NON VALIDÉES. Aucune intégration automatique.
"""
import argparse
import hashlib
import io
import json
import pathlib
import subprocess

import pymupdf as fitz
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[3]
R = ROOT / 'evolution/media/refonte-photo'


def frames(blob):
    result = []
    with Image.open(io.BytesIO(blob)) as im:
        if im.n_frames not in (2, 4):
            raise ValueError(f'Nombre de frames inattendu : {im.n_frames}')
        for i in range(im.n_frames):
            im.seek(i)
            out = io.BytesIO()
            im.convert('RGB').save(out, format='PNG')
            result.append(out.getvalue())
    return result


def prepare(entries):
    """Tout vérifier avant d'ouvrir/créer le fichier de sortie."""
    missing = [e['numero_signale'] for e in entries if not e.get('proposition')]
    if missing:
        raise ValueError('Comparatif complet non prêt. Propositions manquantes : ' +
                         ', '.join(map(str, missing)))
    ready = []
    for e in sorted(entries, key=lambda x: x['numero_signale']):
        before = e['avant']
        blob = subprocess.check_output(
            ['git', 'show', before['commit'] + ':' + before['gif']], cwd=ROOT)
        if hashlib.sha256(blob).hexdigest() != before['sha256']:
            raise ValueError(f"SHA avant incorrect : {e['numero_signale']}")
        after = e['proposition']
        blob_after = (ROOT / after['gif']).read_bytes()
        if hashlib.sha256(blob_after).hexdigest() != after['sha256']:
            raise ValueError(f"SHA proposition incorrect : {e['numero_signale']}")
        ready.append((e, frames(blob), frames(blob_after)))
    return ready


def place_column(page, images, rect):
    # 2 phases : empilées dans chaque colonne ; 4 phases : grille 2×2.
    cols = 1 if len(images) == 2 else 2
    for i, blob in enumerate(images):
        row, col = divmod(i, cols)
        cell_w, cell_h = rect.width / cols, rect.height / 2
        x, y = rect.x0 + col * cell_w, rect.y0 + row * cell_h
        page.insert_text((x + 8, y + 14), f'Phase {i + 1}', fontsize=10)
        page.insert_image(fitz.Rect(x + 8, y + 22, x + cell_w - 8,
                                    y + cell_h - 8), stream=blob,
                          keep_proportion=True)


def render(ready, output):
    if not ready:
        raise ValueError('Aucun exercice à comparer')
    doc = fitz.open()
    for e, before, after in ready:
        page = doc.new_page(width=1190, height=842)
        page.insert_text((30,32), f"N° {e['numero_signale']} - {e['nom']}", fontsize=18)
        page.insert_text((30,55), 'PROPOSITION NON VALIDÉE - aucun remplacement sans votre accord', fontsize=11)
        page.insert_text((40,85), 'AVANT - version que vous avez relue', fontsize=14)
        page.insert_text((615,85), 'APRÈS - proposition à examiner', fontsize=14)
        page.draw_line((595,70),(595,755),color=(0.65,0.65,0.65),width=1)
        place_column(page, before, fitz.Rect(30,100,580,755))
        place_column(page, after, fitz.Rect(610,100,1160,755))
        page.insert_textbox(fitz.Rect(30,770,1160,832),
                            e['retour_utilisateur'] + '\n' + e['detail'], fontsize=10)
    output.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output, deflate=True)
    doc.close()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out', type=pathlib.Path,
                    default=R/'review/CORRECTIONS-avant-apres.pdf')
    args = ap.parse_args()
    registry = json.loads((R/'production/retours-utilisateur-2026-09-26.json').read_text())
    try:
        ready = prepare(registry['entrees'])
    except (ValueError, FileNotFoundError) as exc:
        raise SystemExit(str(exc))
    render(ready, args.out)
    print(f'{len(ready)} exercices, avant à gauche / après à droite : {args.out}')


if __name__ == '__main__':
    main()
