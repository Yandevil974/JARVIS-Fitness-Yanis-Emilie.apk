#!/usr/bin/env python3
"""Construit la 1.4.9 : APK 1.4.0 (base epinglee) + arborescence web 1.4.8 refondue (331 GIF photo).

Chaine complete (rejouable apres reset de l'espace de travail) :

    python3 -m venv .cache/pyvenv && .cache/pyvenv/bin/pip install pillow numpy
    node    evolution/media/tools/payloads-148.mjs          # payloads du bundle ORIGINAL 1.4.8
    python3 evolution/media/tools/overlay-331.py            # -> .cache/web-148 (web 1.4.8 + 331 GIF + hook)
    python3 evolution/android/build-media-149.py --unsigned # APK NON SIGNE + tous les controles (sans cle)
    # --- livraison, uniquement quand l'utilisateur a colle sa cle de recuperation dans /tmp/rk.txt (0600) ---
    pip install --target .cache/signing-tools jdk4py==17.0.9.2 cryptography==46.0.3   # (cf. HOME-RELEASE.md)
    python3 evolution/android/prepare-home-tools.py         # apksigner.jar epingle ef494179...
    python3 evolution/android/signing-media.py restore --recovery-key-file /tmp/rk.txt
    python3 evolution/android/build-media-149.py --real     # signe v2+v3, downloads/…-1.4.9.apk + .sha256 + .fidelity.json

La cle n'est JAMAIS creee ici : sans identite restauree, --real refuse de tourner.
Les 9 DEX restent identiques octet pour octet a la 1.4.0 ; seuls assets/public/** et les
identifiants de version changent. Aucune prescription, duree ni consigne n'est modifiee
(l'overlay ne touche que les chemins de medias : voir overlay-331.py).
"""
import argparse
import hashlib
import importlib.util
import json
import pathlib
import re
import shutil
import subprocess
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'complete-hotfix'))
from apk_binary import chunks, patch_manifest, pool_strings, u16  # noqa: E402

BASE = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.0.apk'
BASE_SHA = '30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7'
PREVIOUS = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.8.apk'
PREVIOUS_SHA = 'fee667192291dd8adc93593bb395b6193e82849e11a4d5db94bf9218c8b99e9f'
BUNDLE = 'assets/public/assets/index-CBCies4k.js'
APP_ID = 'app.yanis.fitness.evolution.home'
VERSION = '1.4.9'
VERSION_CODE = 20
WEB = ROOT / '.cache/web-148'
JAVA = ROOT / '.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER = ROOT / '.cache/home-tools/apksigner.jar'
SIGNER_SHA = 'ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc'
PRIVATE = ROOT / '.private/yanis-fitness-evolution-media-142'
KEY_ALIAS = 'jarvis-evolution-media-142'
IDENTITY = ROOT / 'evolution/android/identity-media-142.json'
ENCRYPTED = ROOT / 'evolution/signing/evolution-media-142.encrypted.json'
CERT_SHA = '150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b'
MANIFESTE = ROOT / 'evolution/media/refonte-photo/livraison/manifeste-331.json'
APK = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.9.apk'
UNSIGNED_OUT = ROOT / '.cache/build/Yanis-Fitness-Evolution-1.4.9-non-signe.apk'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


alignment = module('alignment_media', ROOT / 'JARVIS-Fitness-Source/scripts/rebuild-apk.py')


def run(*args):
    subprocess.run([str(item) for item in args], check=True)


def build_unsigned(unsigned):
    """APK 1.4.0 + overlay complet de .cache/web-148 (bundle patche, 331 GIF, chemins ecrases)."""
    assert sha(BASE.read_bytes()) == BASE_SHA, 'Wrong 1.4.0 baseline'
    assert (WEB / 'assets/index-CBCies4k.js').exists(), 'Lancer d abord overlay-331.py (.cache/web-148 absent)'
    web = (WEB / 'assets/index-CBCies4k.js').read_bytes()
    assert b'const REFONTE_MEDIA=' in web and b'__refontePick' in web, 'Bundle sans hook refonte : overlay non applique'
    overlay = {}
    for file in sorted(WEB.rglob('*')):
        if file.is_file():
            overlay['assets/public/' + file.relative_to(WEB).as_posix()] = file
    added, replaced = [], []
    unsigned.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(unsigned, 'w') as dst:
        for info in src.infolist():
            if info.filename.startswith('META-INF/'):
                continue  # signatures de la 1.4.0 : retirees, l APK sera re-signe (ou reste non signe)
            data = src.read(info.filename)
            candidate = overlay.get(info.filename)
            if candidate is not None and candidate.read_bytes() != data:
                data = candidate.read_bytes()
                replaced.append(info.filename)
            if info.filename == 'AndroidManifest.xml':
                values = None
                for offset, kind, _, size in chunks(data, u16(data, 2)):
                    if kind == 1:
                        values = pool_strings(data[offset:offset + size])
                        break
                assert values and '1.4.0' in values and APP_ID in values
                data = patch_manifest(data, {'1.4.0': VERSION}, VERSION_CODE)
            dst.writestr(info, data)
        known = set(src.namelist())
        for name in sorted(overlay):
            if name in known:
                continue
            info = zipfile.ZipInfo(name, (2026, 9, 26, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            dst.writestr(info, overlay[name].read_bytes())
            added.append(name)
    return web, added, replaced


def check_apk(candidate, web, added):
    """Controles communs (non signe ou signe) : DEX, inventaire, 331 GIF refonte, aucun media pendouillant."""
    man = json.load(open(MANIFESTE))
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(candidate) as dst:
        assert dst.testzip() is None, 'ZIP corrompu'
        base_names = [n for n in src.namelist() if not n.startswith('META-INF/')]
        names = dst.namelist()
        assert set(base_names) <= set(names), 'ZIP inventory lost entries'
        dex = [name for name in base_names if name.endswith('.dex')]
        assert len(dex) == 9 and all(src.read(name) == dst.read(name) for name in dex), 'Native implementation changed'
        webfiles = [name for name in names if name.startswith('assets/public/') and not name.endswith('/')]
        assert len(webfiles) == 272 + len(added), ('Web inventory changed unexpectedly', len(webfiles), len(added))
        assert dst.read(BUNDLE) == web
        present = set(names)
        referenced = set()
        for name in names:
            if name.startswith('assets/public/') and name.endswith(('.js', '.html')):
                # les <img> injectes dans les payloads (template literal) portent des \" echappes :
                # on normalise les antislashs de fin avant de verifier la presence du fichier
                referenced |= {match.decode('utf-8').rstrip('\\') for match in
                               re.findall(rb'"(/(?:media|thumbs|team)/[^"]+)"', dst.read(name))}
        dangling = sorted(path for path in referenced if 'assets/public' + path not in present)
        assert not dangling, 'Media referenced by the delivered bundle but absent from the APK: ' + ', '.join(dangling)
        # les 331 GIF refonte, octet pour octet ceux du manifeste
        refonte = 0
        for e in man['entrees']:
            entry = 'assets/public/media/refonte-%s-%s.gif' % (e['identifiant'], e['athlete'])
            assert entry in present, 'GIF refonte absent : ' + entry
            data = dst.read(entry)
            assert data[:6] == b'GIF89a' and sha(data) == e['gif_sha256'], 'GIF refonte altere : ' + entry
            refonte += 1
        assert refonte == 331, refonte
        # le hook du bundle reference bien chaque GIF
        js = dst.read(BUNDLE).decode('utf-8')
        m = re.search(r'const REFONTE_MEDIA=(\{.*?\});let __rp=', js)
        assert m, 'hook REFONTE_MEDIA introuvable'
        ref = json.loads(m.group(1))
        paths = set()
        for v in ref.values():
            paths |= set(v.values()) if isinstance(v, dict) else {v}
        assert len(paths) == 331, len(paths)
        assert all('assets/public' + p in present for p in paths), 'chemin du hook absent du zip'
        changed = sorted(name for name in base_names if src.read(name) != dst.read(name))
    return {'changedEntries': len(changed), 'webFiles': 272 + len(added), 'addedEntries': len(added),
            'refonteGifs': refonte, 'dualIds': sorted(k for k, v in ref.items() if isinstance(v, dict))}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--unsigned', action='store_true', help='APK non signe dans .cache/build + controles (sans cle)')
    mode.add_argument('--real', action='store_true', help='APK signe avec l identite restauree -> downloads/')
    parser.add_argument('--output', type=pathlib.Path)
    args = parser.parse_args()
    if args.unsigned:
        unsigned = args.output or UNSIGNED_OUT
        web, added, replaced = build_unsigned(unsigned)
        report = check_apk(unsigned, web, added)
        report.update({'mode': 'unsigned-preview', 'apk': str(unsigned), 'apkBytes': unsigned.stat().st_size,
                       'apkSha256': sha(unsigned.read_bytes()), 'replacedEntries': len(replaced),
                       'version': VERSION, 'versionCode': VERSION_CODE})
        print(json.dumps(report, ensure_ascii=False, indent=1))
        return 0
    output = (args.output or APK).resolve()
    if not output.is_relative_to(ROOT / 'downloads'):
        raise ValueError('Release output must stay inside downloads/')
    assert sha(PREVIOUS.read_bytes()) == PREVIOUS_SHA, 'Wrong 1.4.8 previous release'
    assert JAVA.exists(), 'Java (jdk4py) absent : voir HOME-RELEASE.md'
    assert sha(SIGNER.read_bytes()) == SIGNER_SHA, 'Wrong signer build'
    if not PRIVATE.exists():
        raise ValueError('Private identity missing: restore it with signing-media.py '
                         'and the recovery key; never mint a replacement key')
    identity = json.loads(IDENTITY.read_text(encoding='utf-8'))
    assert ENCRYPTED.exists(), 'The committed ciphertext for this identity is required'
    assert identity['certificateSha256'] == CERT_SHA, 'Wrong signing identity'
    assert identity['appId'] == APP_ID, 'Wrong package identity'
    work = ROOT / '.cache/media-release-149'
    work.mkdir(parents=True, exist_ok=True)
    unsigned, aligned, candidate = [work / name for name in ['unsigned.apk', 'aligned.apk', 'signed.apk']]
    web, added, replaced = build_unsigned(unsigned)
    alignment.align_apk(unsigned, aligned)
    run(JAVA, '-jar', SIGNER, 'sign', '--ks', PRIVATE / (KEY_ALIAS + '.p12'),
        '--ks-pass', 'file:' + str(PRIVATE / 'password.txt'), '--ks-key-alias', KEY_ALIAS,
        '--v1-signing-enabled', 'false', '--v2-signing-enabled', 'true', '--v3-signing-enabled', 'true',
        '--v4-signing-enabled', 'false', '--out', candidate, aligned)
    verification = subprocess.check_output(
        [str(JAVA), '-jar', str(SIGNER), 'verify', '--verbose', '--print-certs', str(candidate)], text=True)
    for item in ['Signer #1 certificate SHA-256 digest: ' + identity['certificateSha256'], 'Number of signers: 1',
                 'Verified using v2 scheme (APK Signature Scheme v2): true',
                 'Verified using v3 scheme (APK Signature Scheme v3): true']:
        assert item in verification, item
    alignment.verify_alignment(candidate)
    report = check_apk(candidate, web, added)
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(candidate, output)
    report.update({
        'mode': 'release-signed-same-durable-media-identity', 'identity': identity, 'baseApkSha256': BASE_SHA,
        'previousApkSha256': PREVIOUS_SHA, 'apkSha256': sha(output.read_bytes()), 'apkBytes': output.stat().st_size,
        'packagedWebSha256': sha(web),
        'packagedWebDifference': 'V 1.4.8 -> 1.4.9 : memes prescriptions, durees et consignes ; 331 animations refaites '
                                 'a partir de la photo validee (homme/femme), athlete = proprietaire du profil pour les '
                                 '6 identifiants partages, anciens chemins /media non ambigus ecrases par le GIF refondu',
        'nativeDexFiles': 9, 'byteIdenticalDexFiles': 9, 'signatureVerified': ['v2', 'v3'], 'alignmentVerified': True,
        'version': VERSION, 'versionCode': VERSION_CODE, 'releaseCertificateSha256': identity['certificateSha256'],
        'previousCertificateSha256': identity['previousCertificateSha256'], 'signerSha256': SIGNER_SHA,
        'stagesIncluded': [1, 2, 3, 4, 5, 6, 7], 'approvedHomeIncluded': True,
        'generalConversationalAiIncluded': False, 'deviceTested': False,
        'refonteManifest': str(MANIFESTE.relative_to(ROOT)),
        'durableBackup': {'committedCiphertext': str(ENCRYPTED.relative_to(ROOT)),
                          'restoreCommand': 'python3 evolution/android/signing-media.py restore --recovery-key-file <recovery-key.txt>'},
        'supersedes': {'apk': 'downloads/Yanis-Fitness-Evolution-1.4.8.apk',
                       'reason': 'same identity, same corrections; this build replaces every exercise animation by the photo-based refonte'},
        'installNote': 'meme paquet et meme signature que la 1.4.8 : mise a jour en place, sans desinstaller',
    })
    output.with_suffix('.fidelity.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (output.parent / (output.name + '.sha256')).write_text('%s  %s\n' % (report['apkSha256'], output.name), encoding='utf-8')
    print(json.dumps({k: report[k] for k in ('apkSha256', 'apkBytes', 'webFiles', 'addedEntries', 'refonteGifs', 'version', 'versionCode')},
                     ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
