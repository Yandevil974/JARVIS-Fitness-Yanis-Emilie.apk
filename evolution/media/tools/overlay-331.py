#!/usr/bin/env python3
"""Overlay refonte 331 sur le build web 1.4.8 -> bundle 1.4.9 non signe.

Idempotent : repart toujours du bundle ORIGINAL extrait de l'APK 1.4.8.
Etapes :
  1. extraction web (assets/public) de downloads/Yanis-Fitness-Evolution-1.4.8.apk -> .cache/web-148/
  2. copie des 331 GIFs refonte -> media/refonte-<ident>-<athlete>.gif (SHA verifies contre manifeste-331.json)
  3. ecrasement des anciens chemins /media non ambigus (meme GIF pour toutes les clefs qui le referencent)
  4. patch payloads JSON.parse(`...`) : EXO_GIFS svg -> <img class="exo-gif">, imgs MUSCU_GUIDES/POOL_GUIDES/etc -> nouveau chemin
  5. hook bundle : const REFONTE_MEDIA (id -> chemin, ou {homme,femme} pour les 6 ids partages)
     + __refontePick (profil actif lu dans localStorage jarvis_fitness_v3, cache 1,5 s)
     + pre-hook JarvisReviewedMedia + surcharge de la map eo (utilisee par Kh)
  6. rapport -> evolution/media/refonte-photo/livraison/overlay-report.json

Prerequis : .cache/payloads-148.json (payloads du bundle ORIGINAL, via node :
  new Function('return JSON.parse(`...`)') sur les 2 litteraux =JSON.parse(`...`)).

Usage : python3 evolution/media/tools/overlay-331.py
"""
import json, re, shutil, hashlib, zipfile, unicodedata, pathlib
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[3]
EV = ROOT / 'evolution'
WEB = ROOT / '.cache/web-148'
APK = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.8.apk'
LIV = EV / 'media/refonte-photo/livraison'
BUNDLE_REL = 'assets/index-CBCies4k.js'

def norm(s):
    s = unicodedata.normalize('NFD', str(s).lower())
    s = ''.join(c for c in s if unicodedata.category(c)[0] != 'M')
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()

def main():
    man = json.load(open(LIV / 'manifeste-331.json'))
    assoc = json.load(open(LIV / 'association-331.json'))
    if WEB.exists():
        shutil.rmtree(WEB)
    z = zipfile.ZipFile(APK)
    for n in z.namelist():
        if n.startswith('assets/public/') and not n.endswith('/'):
            dst = WEB / n[len('assets/public/'):]
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(z.read(n))
    js_path = WEB / BUNDLE_REL
    js = js_path.read_text(encoding='utf-8')
    newpath = {e['cle']: f"/media/refonte-{e['identifiant']}-{e['athlete']}.gif" for e in man['entrees']}
    bad = 0
    for e in man['entrees']:
        b = (EV / e['gif']).read_bytes()
        if hashlib.sha256(b).hexdigest() != e['gif_sha256']:
            bad += 1
            print('SHA KO', e['cle'])
        (WEB / 'media' / pathlib.Path(newpath[e['cle']]).name).write_bytes(b)
    assert bad == 0, 'SHA manifeste invalides'
    old2new, amb = {}, set()
    for cle, olds in assoc.items():
        if cle not in newpath:
            continue
        for o in olds:
            if o in old2new and old2new[o] != newpath[cle]:
                amb.add(o)
            old2new.setdefault(o, newpath[cle])
    overw = 0
    for o, n in old2new.items():
        if o in amb:
            continue
        p = WEB / o.lstrip('/')
        if p.exists():
            p.write_bytes((WEB / 'media' / pathlib.Path(n).name).read_bytes())
            overw += 1
    payloads = json.load(open(ROOT / '.cache/payloads-148.json'))
    nom2cle = {}
    for e in man['entrees']:
        for nom in e['noms']:
            nom2cle.setdefault(norm(nom), e['cle'])
    oldpaths = {o for olds in assoc.values() for o in olds}
    path2cle = {o: c for c, olds in assoc.items() if c in newpath for o in olds}
    stats = {'exo': 0, 'img': 0}
    def img_html(cle):
        return (f'<img class="exo-gif" src="{newpath[cle]}" alt="" '
                f'style="width:100%;height:auto;border-radius:8px;object-fit:cover;background:#0a0e1a"/>')
    def walk(o):
        if isinstance(o, dict):
            img = o.get('img')
            if isinstance(img, str) and img in oldpaths:
                c = path2cle.get(img)
                if c:
                    o['img'] = newpath[c]
                    stats['img'] += 1
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for pay in payloads:
        if not isinstance(pay, dict):
            continue
        ex = pay.get('EXO_GIFS')
        if isinstance(ex, dict):
            for k in list(ex.keys()):
                c = nom2cle.get(norm(k))
                if c and isinstance(ex[k], str) and ex[k].lstrip().startswith('<svg'):
                    ex[k] = img_html(c)
                    stats['exo'] += 1
        walk(pay)
    spans = [m.span(1) for m in re.finditer(r'=JSON\.parse\((`[^`]*`)\)', js)]
    assert len(spans) == len(payloads), (len(spans), len(payloads))
    for (s, e_), pay in sorted(zip(spans, payloads), key=lambda t: -t[0][0]):
        text = json.dumps(pay, ensure_ascii=False, separators=(',', ':'))
        text = text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        js = js[:s] + '`' + text + '`' + js[e_:]
    idcount = Counter(e['identifiant'] for e in man['entrees'])
    ref = {}
    for e in man['entrees']:
        ident = e['identifiant']
        if idcount[ident] > 1:
            ref.setdefault(ident, {})[e['athlete']] = newpath[e['cle']]
        else:
            ref[ident] = newpath[e['cle']]
    const = 'const REFONTE_MEDIA=' + json.dumps(ref, ensure_ascii=False, separators=(',', ':')) + ';'
    pick = ('let __rp={a:"homme",t:0};function __refontePick(i){const v=REFONTE_MEDIA[i.id];'
            'if(typeof v==="string")return v;if(v){const n=Date.now();if(n-__rp.t>1500){__rp.t=n;'
            'try{const s=JSON.parse(localStorage.getItem("jarvis_fitness_v3")||"null");'
            'if(s&&s.activeProfile)__rp.a=s.activeProfile==="emilie"?"femme":"homme";}catch(e){}}'
            'return v[__rp.a]||v.homme||v.femme;}return null}')
    anchor = 'function Kh(i){return JarvisReviewedMedia(i)'
    assert js.count(anchor) == 1
    loop = ('for(const[__k,__v]of Object.entries(REFONTE_MEDIA)){'
            'const __p=typeof __v==="string"?__v:(__v.homme||__v.femme);'
            'if(eo.has(__k)){const __e=eo.get(__k);eo.set(__k,{path:__p,name:__e.name,level:"exact"})}}')
    js = js.replace(anchor, const + pick + loop + anchor, 1)
    # --- athlete = profil actif PARTOUT : piscine/elliptique ne passent pas par le hook (ids) mais par
    # POOL_GUIDES (noms), la constante If, providedAnimations/Recoveries et la map yg -> tous rendus via
    # bt(chemin). On redirige donc au niveau de bt : chemin refonte (ou ancien chemin non ambigu) -> variante
    # de l'athlete du profil actif quand elle existe (REFONTE_MEDIA[id] = {homme, femme}).
    old2ident = {}
    for cle, olds in assoc.items():
        if cle in newpath:
            for o in olds:
                if o not in amb and ' ' not in o and (WEB / o.lstrip('/')).exists():
                    old2ident.setdefault(o, cle.split('|')[0])
    swap = ('globalThis.REFONTE_OLD=' + json.dumps(old2ident, ensure_ascii=False, separators=(',', ':')) + ';'
            'globalThis.__refonteSwap=function(p){if(typeof p!=="string")return p;let id=null;'
            'const m=/^\\/media\\/refonte-(.+)-(homme|femme)\\.gif$/.exec(p);'
            'if(m)id=m[1];else if(globalThis.REFONTE_OLD[p])id=globalThis.REFONTE_OLD[p];if(!id)return p;'
            'const v=REFONTE_MEDIA[id];if(!v)return p;if(typeof v==="string")return v;return __refontePick({id:id})||p};')
    js = js.replace(anchor, swap + anchor, 1)
    bt_old = 'bt=i=>{var o;return((o=globalThis.__JARVIS_ASSETS__)==null?void 0:o[i])??i}'
    assert js.count(bt_old) == 1, 'resolveur bt introuvable'
    js = js.replace(bt_old, 'bt=i=>{i=(globalThis.__refonteSwap||(x=>x))(i);var o;return((o=globalThis.__JARVIS_ASSETS__)==null?void 0:o[i])??i}', 1)
    # constante If (guides elliptique, codee en dur) : img -> chemin refonte du meme nom
    i0 = js.find('If=[{k:["echauffement elliptique"')
    i1 = js.find('];', i0) + 2
    assert 0 < i0 < i1
    def patch_if(m):
        c = nom2cle.get(norm(m.group(2)))
        return m.group(1) + (newpath[c] if c else m.group(3)) + m.group(4)
    bloc, n_if = re.subn(r'(t:"([^"]+)",img:")([^"]+)(")', patch_if, js[i0:i1])
    js = js[:i0] + bloc + js[i1:]
    anchor2 = 'function JarvisReviewedMedia(i){'
    assert js.count(anchor2) == 1
    js = js.replace(anchor2, anchor2 +
                    'if(i&&i.id&&REFONTE_MEDIA[i.id]){const __p=__refontePick(i);'
                    'if(__p)return{path:__p,name:(i.noms&&i.noms[0])||i.name||i.id,level:"exact"};}', 1)
    js_path.write_text(js, encoding='utf-8')
    rep = {'copies': len(man['entrees']), 'overwrites': overw, 'ambigus': len(amb),
           'payload_exo': stats['exo'], 'payload_img': stats['img'],
           'refonte_keys': len(ref), 'old_paths_swap': len(old2ident), 'if_patches': n_if,
           'dual_ids': sorted(k for k, v in ref.items() if isinstance(v, dict)),
           'media_files': len(list((WEB / 'media').iterdir())),
           'bundle_size': len(js)}
    (LIV / 'overlay-report.json').write_text(json.dumps(rep, ensure_ascii=False, indent=1))
    print(json.dumps(rep, ensure_ascii=False))

if __name__ == '__main__':
    main()
