#!/usr/bin/env python3
"""Repack the signed 1.4.0 with the corrected web bundle (pool fix + forgotten
workout fix) and sign it with the SAME durable identity as 1.4.2, so the app
updates in place without uninstalling.

Only the web bundle and the version identifiers change; the nine DEX stay
byte-identical. The identity is never created here: this script refuses to run
without the private material, restored from the committed ciphertext with the
user's recovery key.

    python3 evolution/android/signing-media.py restore --recovery-key-file recovery-key.txt
    python3 evolution/android/build-media-143.py --real
"""
import argparse
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
BUNDLE_SHA = '6fbd242ab9dbadf7f89543d54daf35949d542198f0b358196514f1b12e61062e'
APP_ID = 'app.yanis.fitness.evolution.home'
VERSION = '1.4.5'
VERSION_CODE = 16
JAVA = ROOT / '.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER = ROOT / '.cache/home-tools/apksigner.jar'
SIGNER_SHA = 'ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc'
PRIVATE = ROOT / '.private/yanis-fitness-evolution-media-142'
KEY_ALIAS = 'jarvis-evolution-media-142'
IDENTITY = ROOT / 'evolution/android/identity-media-142.json'
ENCRYPTED = ROOT / 'evolution/signing/evolution-media-142.encrypted.json'
APK = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.5.apk'
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
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(unsigned, 'w') as dst:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.filename == BUNDLE:
                data = web
            elif info.filename == 'AndroidManifest.xml':
                values = None
                for offset, kind, _, size in chunks(data, u16(data, 2)):
                    if kind == 1:
                        values = pool_strings(data[offset:offset + size])
                        break
                assert values and '1.4.0' in values and APP_ID in values
                data = patch_manifest(data, {'1.4.0': VERSION}, VERSION_CODE)
            dst.writestr(info, data)
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
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(candidate) as dst:
        assert src.namelist() == dst.namelist(), 'ZIP inventory changed'
        changed = sorted(name for name in src.namelist() if src.read(name) != dst.read(name))
        dex = [name for name in src.namelist() if name.endswith('.dex')]
        assert len(dex) == 9 and all(src.read(name) == dst.read(name) for name in dex), 'Native implementation changed'
        webfiles = [name for name in src.namelist() if name.startswith('assets/public/') and not name.endswith('/')]
        assert len(webfiles) == 272 and dst.read(BUNDLE) == web
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(candidate, output)
    report = {
        'mode': 'release-signed-new-durable-media-identity', 'identity': identity, 'baseApkSha256': BASE_SHA,
        'apkSha256': sha(output.read_bytes()), 'apkBytes': output.stat().st_size, 'packagedWebSha256': sha(web),
        'packagedWebDifference': 'V 1.4.4 -> V 1.4.5: same corrections, plus a land Tabata step can no longer display an aquatic pool guide (visual and movement advice); the aquatic protocol keeps its validated guides',
        'changedEntries': changed, 'webFiles': 272, 'unchangedWebFiles': 271, 'nativeDexFiles': 9,
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
        'supersedes': {'apk': 'downloads/Yanis-Fitness-Evolution-1.4.4.apk',
                       'reason': 'same identity, aquatic correction, forgotten-workout fix and readable durations; this build adds the land/aquatic Tabata context separation'},
        'displayFix': {'finding': 'combo-step-seconds-display',
                       'behaviour': 'combined-session step rows show 25 min / 1 min 30 s / 45 s instead of 1500 s; the timed value itself is unchanged',
                       'verifiedBy': ['evolution/media/tests/pool-candidate.test.mjs']},
        'tabataContextFix': {'finding': 'tabata-land-to-water',
                       'behaviour': 'in a land Tabata, a step such as Gainage planche or Montees de genoux no longer resolves the aquatic guide (neither the step visual nor the movement advice); the same names keep their validated aquatic guide in Aqua Tabata',
                       'untouched': ['names','durations','instructions','prescriptions','aquatic guides'],
                       'measured': 'evolution/media/review/REVIEW-TABATA-CONTEXTE.md',
                       'verifiedBy': ['evolution/media/tests/tabata-context.spec.mjs','evolution/media/tests/pool-candidate.test.mjs']},
        'installNote': 'same package AND same signature as 1.4.4/1.4.3/1.4.2: installs straight over 1.4.4 without uninstalling; coming from 1.4.0 or 1.4.1, uninstall first and restore the JSON backup'}
    (output.parent / (output.name + '.sha256')).write_text(report['apkSha256'] + '  ' + output.name + '\n')
    (output.parent / (output.stem + '.fidelity.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(verification.splitlines()[-1])
    print('RELEASE APK:', output)
    print('SHA256:', report['apkSha256'], report['apkBytes'], 'bytes')
    print('changed entries:', changed)
    print('signed with the durable identity', identity['certificateSha256'])


if __name__ == '__main__':
    main()
