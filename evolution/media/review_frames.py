"""Generate indexed, all-frame review aids from the pinned delivered APK.
Outputs alone do NOT constitute visual review. Decisions live in review/long-animations.json and review/short-focus.json.
"""
import argparse, hashlib, io, json, math
from pathlib import Path
from zipfile import ZipFile
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parents[2]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', help='Exact media path, e.g. /media/name.gif')
    parser.add_argument('--tile', type=int, default=150)
    parser.add_argument('--short-focus', action='store_true', help='Regenerate the 13 recorded short-GIF review sheets')
    args = parser.parse_args()
    if not 100 <= args.tile <= 600: parser.error('tile must be 100..600')
    out = ROOT / ('.cache/media-audit/indexed-short-focus' if args.short_focus else '.cache/media-audit/full-frames')
    out.mkdir(parents=True, exist_ok=True)
    baseline = json.loads((ROOT/'evolution/media/baseline.json').read_text())
    assets = json.loads((ROOT/'evolution/media/review/assets-1.4.0.json').read_text())['assets']
    inventory = json.loads((ROOT/'evolution/media/review/inventory-1.4.0.json').read_text())
    apk = ROOT/baseline['apk']
    assert hashlib.sha256(apk.read_bytes()).hexdigest() == baseline['apkSha256']
    labels = {}
    for e in inventory['exercises']:
        if e['resolved']: labels.setdefault(e['resolved']['path'],set()).add(e['resolved']['name'])
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',11)
    sheets, records = [], []
    tile = args.tile; height = tile+20
    columns = 2 if args.short_focus else 6
    per_page = 3 if args.short_focus else 4
    if args.short_focus:
        focus = json.loads((ROOT/'evolution/media/review/short-focus.json').read_text())['clips']
        selected = [next(a for a in assets if a['path'] == c['path']) for c in focus]
    else:
        selected = [a for a in assets if a['frames'] > 2]
    with ZipFile(apk) as z:
        for number, asset in enumerate(selected):
            if args.only and asset['path'] != args.only: continue
            data = z.read('assets/public'+asset['path'])
            assert hashlib.sha256(data).hexdigest() == asset['sha256']
            im = Image.open(io.BytesIO(data)); assert im.n_frames == asset['frames']
            sheet = Image.new('RGB',(tile*columns,55+math.ceil(im.n_frames/columns)*height),'#ebedf0'); d=ImageDraw.Draw(sheet)
            d.text((8,4),f"{number+1:02} | {asset['path']} | {im.n_frames} frames",fill='#152434',font=font)
            d.text((8,26),' / '.join(sorted(labels.get(asset['path'],{'Pas de résolution musculation dans cet inventaire'})))[:116],fill='#334455',font=small)
            frames=[]
            for i in range(im.n_frames):
                im.seek(i);frame=im.convert('RGBA');duration=im.info.get('duration',0)
                frames.append({'index':i,'durationMs':duration,'rgbaSha256':hashlib.sha256(frame.tobytes()).hexdigest()})
                bg=Image.new('RGBA',frame.size,'white');bg.alpha_composite(frame);rgb=bg.convert('RGB');rgb.thumbnail((tile-5,tile-5))
                x=(i%columns)*tile;y=55+(i//columns)*height;sheet.paste(rgb,(x+(tile-rgb.width)//2,y))
                d.text((x+4,y+tile-3),f'{i:02} / {duration} ms',font=small,fill='#172a42')
            filename=f'{number+1:02}-{Path(asset["path"]).stem}-{tile}.jpg';sheet.save(out/filename,quality=94)
            sheets.append(sheet);records.append({'number':number+1,'path':asset['path'],'assetSha256':asset['sha256'],'frameCount':im.n_frames,'sheet':filename,'frames':frames})
    if not records: raise ValueError('No matching animation')
    for start in range(0,len(sheets),per_page):
        batch=sheets[start:start+per_page];page=Image.new('RGB',(tile*columns,sum(s.height for s in batch)+12*(len(batch)-1)),'#465263');y=0
        for sheet in batch:page.paste(sheet,(0,y));y+=sheet.height+12
        page.save(out/f'page-{start//per_page+1:02}-{tile}.jpg',quality=94)
    manifest={'baselineSha256':baseline['apkSha256'],'clipCount':len(records),'frameCount':sum(r['frameCount'] for r in records),'meaning':'Generated contact sheets, NOT review decisions. Frames are coalesced by Pillow and displayed in order, including last-to-first comparison.','clips':records}
    (out/('single-manifest.json' if args.only else 'manifest.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(records)} clips / {manifest["frameCount"]} frames / {math.ceil(len(records)/per_page)} pages: {out}')
if __name__=='__main__':main()
