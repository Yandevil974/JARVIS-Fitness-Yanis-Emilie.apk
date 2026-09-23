#!/usr/bin/env python3
"""Repack the signed 1.4.0 with the corrected web bundle and sign it with the
durable media-correction identity (evolution/android/signing-media.py).

Only the web bundle and the version identifiers change; the nine DEX stay
byte-identical. The identity itself is never created here: this script refuses to
run without the private material, so a lost workspace can only be repaired by
restoring the committed ciphertext with the user's recovery key.

    python3 evolution/android/signing-media.py restore --recovery-key-file recovery-key.txt
    python3 evolution/android/build-media-142.py --real
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
BUNDLE_SHA = 'b74853bca4761ccb0f36a4f4612ed4e69b82f42b392dbf1cb7dfd7f6d047e373'
APP_ID = 'app.yanis.fitness.evolution.home'
VERSION = '1.4.2'
VERSION_CODE = 13
JAVA = ROOT / '.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER = ROOT / '.cache/home-tools/apksigner.jar'
SIGNER_SHA = 'ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc'
PRIVATE = ROOT / '.private/yanis-fitness-evolution-media-142'
KEY_ALIAS = 'jarvis-evolution-media-142'
IDENTITY = ROOT / 'evolution/android/identity-media-142.json'
ENCRYPTED = ROOT / 'evolution/signing/evolution-media-142.encrypted.json'
APK = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.2.apk'


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
    assert identity['version'] == VERSION, 'Identity version mismatch'
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
        'packagedWebDifference': 'V 1.4.0 -> V 1.4.2: same corrected web as 1.4.1, durable signing identity',
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
        'supersedes': {'apk': 'downloads/Yanis-Fitness-Evolution-1.4.1.apk',
                       'reason': 'the 1.4.1 signing key existed only as a plaintext backup in the workspace and was destroyed by a sandbox reset; this build carries the same content with a durable identity'},
        'installNote': 'same package as 1.4.0 with a different signature: uninstall 1.4.0 first, then restore the JSON backup'}
    (output.parent / (output.name + '.sha256')).write_text(report['apkSha256'] + '  ' + output.name + '\n')
    (output.parent / (output.stem + '.fidelity.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(verification.splitlines()[-1])
    print('RELEASE APK:', output)
    print('SHA256:', report['apkSha256'], report['apkBytes'], 'bytes')
    print('changed entries:', changed)
    print('signed with the durable identity', identity['certificateSha256'])


if __name__ == '__main__':
    main()
