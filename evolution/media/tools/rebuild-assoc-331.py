#!/usr/bin/env python3
"""Reconstruit livraison/association-331.json : cle refonte -> [chemins /media d'origine dans le build 1.4.8].

Sources : payloads (.cache/payloads-148.json), maps candidates (evolution/media/candidate/*.json),
scan litteral du bundle ("nom":"/media/x", t:"...",img:"/media/...", k:"...",img:"...").
Les noms sans chemin (musculation dessinee en SVG via EXO_GIFS) restent [] : l'overlay les couvre
par le hook REFONTE_MEDIA + patch EXO_GIFS (nom -> <img>).

Usage : python3 evolution/media/tools/rebuild-assoc-331.py
"""
import json, re, unicodedata, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]
EV = ROOT / 'evolution'
LIV = EV / 'media/refonte-photo/livraison'
CAND = EV / 'media/candidate'
BUNDLE = ROOT / '.cache/web-148/assets/index-CBCies4k.js'

def norm(s):
    s = unicodedata.normalize('NFD', str(s).lower())
    s = ''.join(c for c in s if unicodedata.category(c)[0] != 'M')
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()

def main():
    man = json.load(open(LIV / 'manifeste-331.json'))
    nom2cle = {}
    for e in man['entrees']:
        for nom in e['noms']:
            nom2cle.setdefault(norm(nom), e['cle'])
    assoc = {e['cle']: [] for e in man['entrees']}
    def add(nom, path):
        c = nom2cle.get(norm(nom))
        if c and isinstance(path, str) and path.startswith('/media/') and path not in assoc[c]:
            assoc[c].append(path)
    # 1. payloads
    payloads = json.load(open(ROOT / '.cache/payloads-148.json'))
    def walk(o, key_nom=None):
        if isinstance(o, dict):
            img = o.get('img')
            noms = [o.get(k) for k in ('t', 'nom', 'k', 'titre') if isinstance(o.get(k), str)]
            if key_nom:
                noms.append(key_nom)
            for n in noms:
                add(n, img)
            for k, v in o.items():
                walk(v, key_nom=k if isinstance(k, str) else None)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for p in payloads:
        walk(p)
    n_pay = sum(len(v) for v in assoc.values())
    # 2. maps candidates
    for f in sorted(CAND.glob('*.json')):
        if f.name in ('refonte-331-map.json', 'baseline.json'):
            continue
        try:
            data = json.load(open(f))
        except Exception:
            continue
        def walkm(o, key_nom=None):
            if isinstance(o, dict):
                for k, v in o.items():
                    if isinstance(v, str) and v.startswith('/media/'):
                        add(k, v)
                        if key_nom:
                            add(key_nom, v)
                    else:
                        walkm(v, key_nom=k if isinstance(k, str) else key_nom)
            elif isinstance(o, list):
                for v in o:
                    walkm(v, key_nom)
        walkm(data)
    n_maps = sum(len(v) for v in assoc.values()) - n_pay
    # 3. scan bundle
    js = BUNDLE.read_text(encoding='utf-8')
    pats = [
        r'"([^"]{3,90})"\s*:\s*"(/media/[^"]+)"',
        r'\bt\s*:\s*"([^"]{3,90})"[^{}]{0,120}?img\s*:\s*"(/media/[^"]+)"',
        r'\bk\s*:\s*"([^"]{3,90})"[^{}]{0,120}?img\s*:\s*"(/media/[^"]+)"',
        r'\bnom\s*:\s*"([^"]{3,90})"[^{}]{0,120}?img\s*:\s*"(/media/[^"]+)"',
    ]
    for p in pats:
        for m in re.finditer(p, js):
            add(m.group(1), m.group(2))
    n_js = sum(len(v) for v in assoc.values()) - n_pay - n_maps
    app = sum(1 for v in assoc.values() if v)
    (LIV / 'association-331.json').write_text(json.dumps(assoc, ensure_ascii=False, indent=1))
    print(f'clefs appariees {app}/{len(assoc)} (payloads {n_pay}, maps {n_maps}, bundle {n_js})')

if __name__ == '__main__':
    main()
