#!/usr/bin/env python3
"""Repack the signed 1.4.0 with the corrected web bundle AND the media that
bundle references, then sign it with the SAME durable identity as 1.4.2, so the
app updates in place without uninstalling.

Correctif 1.4.8 : la 1.4.7 livree portait un bundle qui referencait cinq
animations aquatiques, mais le script de construction ne recopiait que le
fichier de script. Les cinq fichiers sont maintenant emballes, et la
construction refuse de produire un APK si un media reference par le bundle
manque.

Only the web bundle and the version identifiers change; the nine DEX stay
byte-identical. The identity is never created here: this script refuses to run
without the private material, restored from the committed ciphertext with the
user's recovery key.

    python3 evolution/android/signing-media.py restore --recovery-key-file recovery-key.txt
    python3 evolution/android/build-media-143.py --real
"""
import argparse
import re
import hashlib
import importlib.util
import json
import pathlib
import shutil
import subprocess
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'complete-hotfix'))
from apk_binary import chunks, patch_manifest, pool_strings, u16

BASE = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.0.apk'
BASE_SHA = '30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7'
BUNDLE = 'assets/public/assets/index-CBCies4k.js'
BUNDLE_SHA = 'ce7c4b897a1d2413c91ccb2073a318e91a7771c825f86c09abd8de7304bc4dc6'
APP_ID = 'app.yanis.fitness.evolution.home'
VERSION = '1.4.8'
VERSION_CODE = 19
JAVA = ROOT / '.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER = ROOT / '.cache/home-tools/apksigner.jar'
SIGNER_SHA = 'ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc'
PRIVATE = ROOT / '.private/yanis-fitness-evolution-media-142'
KEY_ALIAS = 'jarvis-evolution-media-142'
IDENTITY = ROOT / 'evolution/android/identity-media-142.json'
ENCRYPTED = ROOT / 'evolution/signing/evolution-media-142.encrypted.json'
APK = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.8.apk'
CERT_SHA = '150e3846d867aae1d08694d0d5d2b53e404f77ca635edb88055618b6d769d37b'


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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--real', action='store_true', help='build the release APK')
    parser.add_argument('--output', type=pathlib.Path)
    args = parser.parse_args()
    if not args.real:
        parser.error('this script only builds the real release; the web candidate is built by evolution/media/candidate/build.mjs')
    output = (args.output or APK).resolve()
    if not output.is_relative_to(ROOT / 'downloads'):
        raise ValueError('Release output must stay inside downloads/')
    assert sha(BASE.read_bytes()) == BASE_SHA, 'Wrong 1.4.0 baseline'
    assert sha(SIGNER.read_bytes()) == SIGNER_SHA, 'Wrong signer build'
    if not PRIVATE.exists():
        raise ValueError('Private identity missing: restore it with signing-media.py '
                         'and the recovery key; never mint a replacement key')
    identity = json.loads(IDENTITY.read_text(encoding='utf-8'))
    assert ENCRYPTED.exists(), 'The committed ciphertext for this identity is required'
    # The identity is the durable media key introduced with 1.4.2; only the build
    # version changes here, and the key itself is pinned by fingerprint.
    assert identity['certificateSha256'] == CERT_SHA, 'Wrong signing identity'
    assert identity['appId'] == APP_ID, 'Wrong package identity'
    web = (ROOT / '.cache/media-pool-candidate' / BUNDLE.replace('assets/public/', '')).read_bytes()
    assert sha(web) == BUNDLE_SHA, 'Candidate web bundle changed: rebuild and renew the pin'
    work = ROOT / '.cache/media-release'
    work.mkdir(parents=True, exist_ok=True)
    unsigned, aligned, candidate = [work / name for name in ['unsigned.apk', 'aligned.apk', 'signed.apk']]
    # Toute l'arborescence web candidate (script + medias) est la source de
    # verite : les medias produits pour cette version sont ajoutes, les fichiers
    # modifies sont remplaces, les autres restent identiques octet pour octet.
    overlay = {}
    for file in sorted((ROOT / '.cache/media-pool-candidate').rglob('*')):
        if file.is_file():
            overlay['assets/public/' + file.relative_to(ROOT / '.cache/media-pool-candidate').as_posix()] = file
    added, replaced_media = [], []
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(unsigned, 'w') as dst:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.filename == BUNDLE:
                data = web
            else:
                candidate = overlay.get(info.filename)
                if candidate is not None and candidate.read_bytes() != data:
                    data = candidate.read_bytes()
                    if info.filename != 'assets/public/index.html':
                        replaced_media.append(info.filename)
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
            info = zipfile.ZipInfo(name, (2026, 9, 24, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            dst.writestr(info, overlay[name].read_bytes())
            added.append(name)
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
    provided = json.loads((ROOT / 'evolution/media/candidate/pool-animations-map.json').read_text(encoding='utf-8'))
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(candidate) as dst:
        base_names, names = src.namelist(), dst.namelist()
        assert set(base_names) <= set(names), 'ZIP inventory lost entries'
        changed = sorted(name for name in base_names if src.read(name) != dst.read(name)) + sorted(added)
        dex = [name for name in base_names if name.endswith('.dex')]
        assert len(dex) == 9 and all(src.read(name) == dst.read(name) for name in dex), 'Native implementation changed'
        webfiles = [name for name in names if name.startswith('assets/public/') and not name.endswith('/')]
        assert len(webfiles) == 272 + len(added), 'Web inventory changed unexpectedly'
        assert dst.read(BUNDLE) == web
        # Aucun media reference par le paquet ne doit manquer : c'est exactement
        # le defaut de la 1.4.7 livree (cinq animations referencees, absentes).
        present = set(names)
        referenced = set()
        for name in names:
            if name.startswith('assets/public/') and name.endswith(('.js', '.html')):
                referenced |= {match.decode('utf-8') for match in
                               re.findall(rb'"(/(?:media|thumbs|team)/[^"]+)"', dst.read(name))}
        dangling = sorted(path for path in referenced if 'assets/public' + path not in present)
        assert not dangling, 'Media referenced by the delivered bundle but absent from the APK: ' + ', '.join(dangling)
        for name, digest in provided['files'].items():
            entry = 'assets/public' + name
            assert entry in present, 'Provided animation missing from the APK: ' + entry
            data = dst.read(entry)
            assert data[:6] in (b'GIF89a', b'GIF87a') and sha(data) == digest, 'Provided animation altered: ' + entry
        land = json.loads((ROOT / 'evolution/media/candidate/tabata-land-animations-map.json').read_text(encoding='utf-8'))
        for name, digest in land['files'].items():
            entry = 'assets/public' + name
            assert entry in present, 'Land animation missing from the APK: ' + entry
            data = dst.read(entry)
            assert data[:6] in (b'GIF89a', b'GIF87a') and len(data) > 1000 and sha(data) == digest, 'Land animation altered: ' + entry
        alias = json.loads((ROOT / 'evolution/media/candidate/alias-visuals-map.json').read_text(encoding='utf-8'))
        for name, digest in alias['files'].items():
            entry = 'assets/public' + name
            assert entry in present, 'Alias animation missing from the APK: ' + entry
            data = dst.read(entry)
            assert data[:6] in (b'GIF89a', b'GIF87a') and len(data) > 1000 and sha(data) == digest, 'Alias animation altered: ' + entry
        recovery = json.loads((ROOT / 'evolution/media/candidate/pool-recovery-map.json').read_text(encoding='utf-8'))
        for name, digest in recovery['files'].items():
            entry = 'assets/public' + name
            assert entry in present, 'Pool recovery animation missing from the APK: ' + entry
            data = dst.read(entry)
            assert data[:6] in (b'GIF89a', b'GIF87a') and len(data) > 1000 and sha(data) == digest, 'Pool recovery animation altered: ' + entry
        stretch = json.loads((ROOT / 'evolution/media/candidate/stretch-visuals-map.json').read_text(encoding='utf-8'))
        for name, digest in stretch['files'].items():
            entry = 'assets/public' + name
            assert entry in present, 'Stretch visual missing from the APK: ' + entry
            data = dst.read(entry)
            assert data[:2] == b'\xff\xd8' and sha(data) == digest, 'Stretch visual altered: ' + entry
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(candidate, output)
    report = {
        'mode': 'release-signed-new-durable-media-identity', 'identity': identity, 'baseApkSha256': BASE_SHA,
        'apkSha256': sha(output.read_bytes()), 'apkBytes': output.stat().st_size, 'packagedWebSha256': sha(web),
        'packagedWebDifference': 'V 1.4.0 -> cette version: memes corrections, plus tous les visuels humains produits (cinq guides aquatiques, trente-trois mouvements de Tabata au sol, quatre etirements sans dessin fidele, dix variantes d alias, deux animations de recuperation piscine)',
        'changedEntries': changed, 'webFiles': 272 + len(added), 'addedEntries': added, 'replacedMediaEntries': replaced_media, 'nativeDexFiles': 9,
        'byteIdenticalDexFiles': 9, 'signatureVerified': ['v2', 'v3'], 'alignmentVerified': True,
        'version': VERSION, 'versionCode': VERSION_CODE, 'releaseCertificateSha256': identity['certificateSha256'],
        'previousCertificateSha256': identity['previousCertificateSha256'], 'signerSha256': SIGNER_SHA,
        'stagesIncluded': [1, 2, 3, 4, 5, 6, 7], 'approvedHomeIncluded': True,
        'generalConversationalAiIncluded': False, 'deviceTested': False,
        'externalPrivateBackupRetentionConfirmed': False,
        'durableBackup': {'committedCiphertext': str(ENCRYPTED.relative_to(ROOT)),
                          'restoreCommand': 'python3 evolution/android/signing-media.py restore --recovery-key-file <recovery-key.txt>',
                          'plaintextArchive': 'downloads/Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip (git-ignored)'},
        'forgottenWorkoutFix': {'decision': 'user, 23 September 2026: close the stale session automatically as partial',
                                'behaviour': 'a strength session started on another day is closed as partial on load (or at the next start/timer click), keeps its own date and its completed sets, and no longer blocks the program or the guides',
                                'verifiedBy': ['evolution/media/tests/emilie-session-block.spec.mjs', 'evolution/media/review/REVIEW-EMILIE-BLOCAGE.md']},
        'supersedes': {'apk': 'downloads/Yanis-Fitness-Evolution-1.4.6.apk',
                       'reason': 'same identity and corrections; this build adds the five aquatic guide animations'},
        'displayFix': {'finding': 'combo-step-seconds-display',
                       'behaviour': 'combined-session step rows show 25 min / 1 min 30 s / 45 s instead of 1500 s; the timed value itself is unchanged',
                       'verifiedBy': ['evolution/media/tests/pool-candidate.test.mjs']},
        'tabataContextFix': {'finding': 'tabata-land-to-water',
                       'behaviour': 'in a land Tabata, a step such as Gainage planche or Montees de genoux no longer resolves the aquatic guide (neither the step visual nor the movement advice); the same names keep their validated aquatic guide in Aqua Tabata',
                       'untouched': ['names','durations','instructions','prescriptions','aquatic guides'],
                       'measured': 'evolution/media/review/REVIEW-TABATA-CONTEXTE.md',
                       'verifiedBy': ['evolution/media/tests/tabata-context.spec.mjs','evolution/media/tests/pool-candidate.test.mjs']},
        'approvedCorrections': {'stretchVisuals': ['Pigeon assis -> /media/stretch-piriforme.jpg','Main dans le dos -> /media/stretch-triceps-coude.jpg',
                        'Mollet en escalier -> /media/stretch-nouveau-mollet-escalier.jpg',
                        'Adduction de la hanche debout -> /media/stretch-nouveau-adduction-croisement.jpg',
                        'Mains croisees derriere le dos -> /media/stretch-nouveau-mains-croisees-dos.jpg',
                        'Etirement des flechisseurs -> /media/stretch-nouveau-flechisseurs-poignet.jpg'],
                       'aquaticGaps': ['Gainage au bord (vertical)','Mobilité épaules aquatique','Mobilité hanches / chevelles','Ciseaux au bord','Talons-fesses'],
                       'rule': 'image exchanged or explicit gap, never a rewritten instruction',
                       'evidence': 'evolution/media/review/stretch-echanges-avant-apres.png',
                       'verifiedBy': ['evolution/media/tests/stretch-media.spec.mjs','evolution/media/tests/pool-land-guides.spec.mjs']},
        'providedAnimations': {'guides': {'Gainage au bord (vertical)': '/media/gainage-vertical.gif',
                        'Mobilité épaules aquatique': '/media/mobilite-epaules.gif',
                        'Mobilité hanches / chevelles': '/media/mobilite-hanches-chevelles.gif',
                        'Ciseaux au bord': '/media/ciseaux-au-bord.gif',
                        'Talons-fesses': '/media/talons-fesses.gif'},
                       'format': '480 x 262, 2 images, 500 ms, même famille que les GIF aquatiques existants',
                       'replaced': 'les dessins terrestres de ces cinq guides et la lacune explicite livrée en 1.4.6',
                       'untouched': ['consignes','noms','durées','état enregistré'],
                       'evidence': 'evolution/media/review/pool-animations-5-guides.png',
                       'verifiedBy': ['evolution/media/tests/pool-land-guides.spec.mjs']},
        'aliasVariants': {'request': 'user, 24 September 2026: complete tous les elements manquants (variantes sans dessin fidele)',
                       'gap': 'evolution/media/review/GAPS-SANS-DESSIN.json : dix exercices affichaient le dessin d une AUTRE variante',
                       'delivered': 'evolution/media/candidate/alias-visuals-map.json (variantes resolues par identifiant, niveau exact)',
                       'format': '480 x 262, 2 images, 500 ms, meme famille que les GIF livres',
                       'remaining': 'aucune variante du releve : le champ reste de la carte est vide ; il reste l essai sur le telephone',
                       'verifiedBy': ['evolution/media/tests/alias-visuals.test.mjs','evolution/media/tests/pool-candidate.test.mjs']},
        'tabataLandAnimations': {'request': 'user, 24 September 2026: oui complete tous les elements manquants',
                       'context': 'resolvees uniquement dans un Tabata AU SOL (jamais piscine, etirement, echauffement, repos)',
                       'delivered': 'lots A + B + C + D : 33 mouvements dessines, 5 noms equivalents du meme mouvement, les 38 noms du generateur au sol sont couverts',
                       'map': 'evolution/media/candidate/tabata-land-animations-map.json',
                       'format': '480 x 262, 2 images, 500 ms, meme famille que les GIF deja livres',
                       'remaining': 'aucun nom du generateur au sol ; il reste l essai sur le telephone',
                       'verifiedBy': ['evolution/media/tests/tabata-land-media.test.mjs','evolution/media/tests/media-inventory.test.mjs']},
        'poolRecoveries': {'request': 'user, 24 September 2026: one single complete version, all missing media',
                       'gap': 'mesure sur les 420 etapes des six protocoles piscine : 117 « Repos » et 18 « ... en place » ne resolvaient aucun media aquatique',
                       'delivered': 'deux animations humaines produites : /media/pool-repos.gif (recuperation dans leau) et /media/pool-en-place.gif (mise en place avant l effort)',
                       'map': 'evolution/media/candidate/pool-recovery-map.json',
                       'context': 'servies uniquement quand un contexte piscine est deja etabli ; hors piscine, aucun nom ne change de visuel',
                       'measured': 'zero etape sans visuel et zero media de terre sur les 420 etapes ; les recuperations nommees gardent leur image aquatique livree',
                       'verifiedBy': ['evolution/media/tests/pool-candidate.test.mjs','evolution/media/tests/media-inventory.test.mjs']},
        'stretchVisuals': {'request': 'user, 24 September 2026: one single complete version, all missing media',
                       'gap': 'evolution/media/review/GAPS-SANS-DESSIN.json : quatre etirements sans dessin fidele (le dessin montre un AUTRE mouvement)',
                       'delivered': ['Mollet en escalier','Adduction de la hanche debout','Mains croisees derriere le dos','Etirement des flechisseurs'],
                       'format': '1376 x 768, image fixe, une seule posture, meme famille que les etirements deja livres',
                       'map': 'evolution/media/candidate/stretch-visuals-map.json',
                       'unchanged': 'noms, durees, consignes et donnees enregistrees ; les anciens dessins restent dans le paquet',
                       'verifiedBy': ['evolution/media/tests/stretch-media.test.mjs','evolution/media/tests/media-inventory.test.mjs']},
        'installNote': 'same package AND same signature as 1.4.6/1.4.5/1.4.4/1.4.3/1.4.2: installs straight over 1.4.6 without uninstalling; coming from 1.4.0 or 1.4.1, uninstall first and restore the JSON backup'}
    (output.parent / (output.name + '.sha256')).write_text(report['apkSha256'] + '  ' + output.name + '\n')
    (output.parent / (output.stem + '.fidelity.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(verification.splitlines()[-1])
    print('RELEASE APK:', output)
    print('SHA256:', report['apkSha256'], report['apkBytes'], 'bytes')
    print('changed entries:', changed)
    print('signed with the durable identity', identity['certificateSha256'])


if __name__ == '__main__':
    main()
