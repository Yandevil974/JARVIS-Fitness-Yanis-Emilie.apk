#!/usr/bin/env python3
"""media-add.py — intègre un GIF dans l'app (étapes 1 et 2 de la passation §6).

  python3 media-add.py chemin/du.gif [chemin2.gif ...]

- nom de fichier = sha256 du contenu, 16 premiers caractères (collision vérifiée)
- copie dans public/media/ ET release/media/
- régénère public/media-index.json (liste plate TRIÉE, préfixe /, JSON compact,
  hors runtime.js/runtime.css/media-index.json) puis copie à l'identique dans release/
Affiche le nom produit pour chaque GIF (à recoller dans les sources).
"""
import hashlib
import json
import os
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
EXCLUS = {"runtime.js", "runtime.css", "media-index.json"}


def index_payload(media_dir):
    names = sorted(
        n for n in os.listdir(media_dir)
        if n not in EXCLUS and os.path.isfile(os.path.join(media_dir, n))
    )
    return ["/media/" + n for n in names]


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: media-add.py fichier.gif [...]")
    pub = os.path.join(ROOT, "public", "media")
    rel = os.path.join(ROOT, "release", "media")
    for src in sys.argv[1:]:
        raw = open(src, "rb").read()
        name = hashlib.sha256(raw).hexdigest()[:16] + ".gif"
        for d in (pub, rel):
            dst = os.path.join(d, name)
            if os.path.exists(dst):
                if open(dst, "rb").read() == raw:
                    print(f"{src} -> {name} (déjà présent, identique)")
                    continue
                sys.exit(f"COLLISION sha16 pour {src} -> {name}")
            shutil.copyfile(src, dst)
        print(f"{src} -> /media/{name}")
    payload = json.dumps(index_payload(pub), separators=(",", ":"), ensure_ascii=False)
    for p in (os.path.join(ROOT, "public", "media-index.json"),
              os.path.join(ROOT, "release", "media-index.json")):
        open(p, "w", encoding="utf-8").write(payload)
    n = len(json.loads(payload))
    print(f"media-index.json régénéré : {n} entrées (public + release)")


if __name__ == "__main__":
    main()
