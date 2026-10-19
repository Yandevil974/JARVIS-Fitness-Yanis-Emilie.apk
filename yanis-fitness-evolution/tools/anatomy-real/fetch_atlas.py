"""Télécharge l'atlas anatomique libre (BodyParts3D, CC BY-SA 2.1 JP).

Source : github.com/ashemag/human-atlas (public/models). Les fichiers sont
récupérés via l'API GitHub (blob base64) car raw n'est pas toujours joignable.
"""
import base64
import json
import os
import subprocess
import sys

ROOT = os.environ.get("ATLAS_DIR", "/tmp/anat")
REPO = "ashemag/human-atlas"


def gh_json(path):
    out = subprocess.run(["gh", "api", path], capture_output=True, check=True)
    return json.loads(out.stdout)


def fetch_blob(sha, dest, size):
    out = subprocess.run(["gh", "api", f"repos/{REPO}/git/blobs/{sha}",
                          "--jq", ".content"], capture_output=True, check=True)
    data = base64.b64decode(out.stdout)
    with open(dest, "wb") as fh:
        fh.write(data)
    assert os.path.getsize(dest) == size, (dest, os.path.getsize(dest), size)


def main():
    os.makedirs(ROOT, exist_ok=True)
    tree = gh_json(f"repos/{REPO}/git/trees/HEAD?recursive=1")
    models = [t for t in tree["tree"] if t["path"].startswith("public/models/")]
    for t in models:
        dest = os.path.join(ROOT, os.path.basename(t["path"]))
        if os.path.exists(dest) and os.path.getsize(dest) == t.get("size", -1):
            print("ok", dest)
            continue
        fetch_blob(t["sha"], dest, t["size"])
        print("dl", dest, t["size"])
    meta = json.load(open(os.path.join(ROOT, "atlas.json")))
    print("parts", len(meta["parts"]), "version", meta.get("modelVersion"))


if __name__ == "__main__":
    sys.exit(main())
