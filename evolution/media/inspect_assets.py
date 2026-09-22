"""Decode every frame; compare packaged bytes; do NOT infer semantic validity."""
import argparse, hashlib, io, json, subprocess
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'assets/public/'

def inspect():
    base = json.loads((ROOT/'evolution/media/baseline.json').read_text())
    current = ROOT/base['apk']
    raw = current.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == base['apkSha256'], 'Unknown APK'
    original = subprocess.check_output(['git','show',f"{base['originalCommit']}:{base['originalPath']}"], cwd=ROOT)
    assert hashlib.sha256(original).hexdigest() == base['originalApkSha256'], 'Unknown original'
    inventory = json.loads((ROOT/'evolution/media/review/inventory-1.4.0.json').read_text())
    used = {e['resolved']['path'] for e in inventory['exercises'] if e['resolved']}
    used |= {e['img'] for k in ['stretches','poolGuides','cardioGuides'] for e in inventory[k] if e.get('img')}
    used |= set(inventory['warmupImages'].values())
    records = []
    with ZipFile(io.BytesIO(raw)) as z, ZipFile(io.BytesIO(original)) as old:
        images = [n for n in z.namelist() if n.startswith(PREFIX) and n.endswith(('.gif','.jpg','.png','.webp','.svg'))]
        same = sum(n in old.namelist() and z.read(n) == old.read(n) for n in images)
        selected = sorted(used | {'/'+n.removeprefix(PREFIX) for n in images if n.endswith('.gif')})
        for name in selected:
            data = z.read(PREFIX + name.lstrip('/'))
            with Image.open(io.BytesIO(data)) as im:
                frames = getattr(im, 'n_frames', 1)
                durations = []
                for index in range(frames):
                    im.seek(index)
                    im.convert('RGBA').load()  # Actually decode, not only read GIF headers.
                    durations.append(im.info.get('duration', 0))
                records.append({'path':name,'sha256':hashlib.sha256(data).hexdigest(),'width':im.width,'height':im.height,'frames':frames,'durationsMs':durations})
    return {'baselineSha256':base['apkSha256'],'comparisonOriginalSha256':base['originalApkSha256'],
            'packagedImageCount':len(images),'byteIdenticalToOriginal':same,
            'inspectedAssetCount':len(records),'decodedFrames':sum(e['frames'] for e in records),
            'frameCounts':dict(Counter(e['frames'] for e in records)),
            'visualReviewScope':'First and middle frames/contact sheets reviewed separately; decoding all frames does not certify their content.',
            'assets':records}

if __name__ == '__main__':
    p=argparse.ArgumentParser();p.add_argument('--output',default='.cache/media-audit/assets-decoded.json');args=p.parse_args()
    report=inspect();out=ROOT/args.output;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items()if k!='assets'},ensure_ascii=False))
