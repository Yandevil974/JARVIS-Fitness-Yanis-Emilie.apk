#!/usr/bin/env python3
"""Repack the signed 1.4.0 with the corrected web bundle and sign it with the
media-correction key. Nothing but the web bundle and the version identifiers
changes; the nine DEX stay byte-identical.

Dry run (throwaway key inside .cache, output inside .cache, never a release):
    python3 evolution/android/build-media-141.py --dry-run
Real build (requires the private key material, never committed):
    python3 evolution/android/build-media-141.py --output /path/to/app.apk

A new key cannot update an installation signed with the old one: the corrected
app keeps the same package name and is therefore installed after uninstalling
the 1.4.0 build, with the JSON backup/restore already provided by the app.
"""
import argparse, base64, hashlib, importlib.util, io, json, os, pathlib, secrets, shutil, subprocess, sys, tempfile, zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'complete-hotfix'))
from apk_binary import chunks, patch_manifest, pool_strings, u16

BASE = ROOT / 'downloads/Yanis-Fitness-Evolution-1.4.0.apk'
BASE_SHA = '30b20ce10ddc9bfeadee3590816f1f3d03f54c6c7126261ed76824278b35a8b7'
BUNDLE = 'assets/public/assets/index-CBCies4k.js'
BUNDLE_SHA = 'b74853bca4761ccb0f36a4f4612ed4e69b82f42b392dbf1cb7dfd7f6d047e373'
APP_ID = 'app.yanis.fitness.evolution.home'
VERSION = '1.4.1'
VERSION_CODE = 12
JAVA = ROOT / '.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER = ROOT / '.cache/home-tools/apksigner.jar'
SIGNER_SHA = 'ef49417931f9519fe8ccfbc3cc51caaaab0f3079a5772b7f1aa28ac0e4662cdc'
PRIVATE = ROOT / '.private/yanis-fitness-evolution-media'
DRY_PRIVATE = ROOT / '.cache/media-apk-test-identity'
IDENTITY = ROOT / 'evolution/android/identity-media-141.json'
ARCHIVE = 'Yanis-Fitness-Evolution-1.4.1-SAUVEGARDE-PRIVEE.zip'
NAMES = ['jarvis-evolution-media.p12', 'password.txt', 'identity.json', 'A-LIRE.txt']


def sha(data): return hashlib.sha256(data).hexdigest()


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


alignment = module('alignment_media', ROOT / 'JARVIS-Fitness-Source/scripts/rebuild-apk.py')


def run(*args): subprocess.run([str(a) for a in args], check=True)


def make_identity():
    from cryptography import x509
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives.serialization import pkcs12
    from cryptography.x509.oid import NameOID
    import datetime as dt
    key = rsa.generate_private_key(public_exponent=65537, key_size=3072)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Yanis Fitness Evolution')])
    now = dt.datetime.now(dt.timezone.utc)
    cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name)
            .public_key(key.public_key()).serial_number(x509.random_serial_number())
            .not_valid_before(now - dt.timedelta(days=1))
            .not_valid_after(now + dt.timedelta(days=10000))
            .sign(key, hashes.SHA256()))
    password = secrets.token_urlsafe(48).encode()
    identity = {'appId': APP_ID, 'appName': 'Yanis Fitness Evolution', 'version': VERSION,
                'versionCode': VERSION_CODE,
                'certificateSha256': cert.fingerprint(hashes.SHA256()).hex(),
                'previousCertificateSha256': '7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd',
                'installation': 'same package as 1.4.0, new signature: uninstall 1.4.0 then install this build, restore the JSON backup',
                'userAuthorizedNewIdentity': True, 'authorizationDate': '2026-09-23'}
    p12 = pkcs12.serialize_key_and_certificates(b'jarvis-evolution-media', key, cert, None,
                                                serialization.BestAvailableEncryption(password))
    return identity, {'jarvis-evolution-media.p12': p12, 'password.txt': password + b'\n',
                      'identity.json': json.dumps(identity, ensure_ascii=False, indent=2).encode() + b'\n'}


def material(dry_run):
    if dry_run:
        if IDENTITY.exists():
            raise ValueError('Refuse to overwrite an existing identity file: ' + str(IDENTITY))
        identity, files = make_identity()
        DRY_PRIVATE.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            (DRY_PRIVATE / name).write_bytes(data)
        (DRY_PRIVATE / 'A-LIRE.txt').write_text(
            'IDENTITÉ DE TEST — usage interne à la vérification. Ne pas publier, ne pas installer.\n'
            'La clé de livraison sera créée à l\'étape suivante et sa sauvegarde privée remise à l\'utilisateur.\n')
        print('DRY RUN identity certificate:', identity['certificateSha256'])
        return identity, DRY_PRIVATE, True
    raise ValueError('Real build refused here: see the delivery step of PASSATION.md')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--output', type=pathlib.Path)
    args = parser.parse_args()
    if not args.dry_run:
        parser.error('this build script only performs the dry run; the release path is documented in PASSATION.md')
    output = (args.output or ROOT / '.cache/media-apk-dryrun/Yanis-Fitness-Evolution-1.4.1-dryrun.apk').resolve()
    if not output.is_relative_to(ROOT / '.cache'):
        raise ValueError('Dry-run output must stay inside .cache')
    assert sha(BASE.read_bytes()) == BASE_SHA, 'Wrong 1.4.0 baseline'
    assert sha(SIGNER.read_bytes()) == SIGNER_SHA, 'Wrong signer build'
    web = (ROOT / '.cache/media-pool-candidate' / BUNDLE.replace('assets/public/', '')).read_bytes()
    assert sha(web) == BUNDLE_SHA, 'Candidate web bundle changed: rebuild and renew the pin'
    identity, private, dry = material(True)
    work = ROOT / '.cache/media-release'
    work.mkdir(parents=True, exist_ok=True)
    unsigned, aligned, candidate = [work / n for n in ['unsigned.apk', 'aligned.apk', 'signed.apk']]
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
    run(JAVA, '-jar', SIGNER, 'sign', '--ks', private / 'jarvis-evolution-media.p12',
        '--ks-pass', 'file:' + str(private / 'password.txt'), '--ks-key-alias', 'jarvis-evolution-media',
        '--v1-signing-enabled', 'false', '--v2-signing-enabled', 'true', '--v3-signing-enabled', 'true',
        '--v4-signing-enabled', 'false', '--out', candidate, aligned)
    verification = subprocess.check_output([str(JAVA), '-jar', str(SIGNER), 'verify', '--verbose', '--print-certs', str(candidate)], text=True)
    for item in ['Signer #1 certificate SHA-256 digest: ' + identity['certificateSha256'], 'Number of signers: 1',
                 'Verified using v2 scheme (APK Signature Scheme v2): true', 'Verified using v3 scheme (APK Signature Scheme v3): true']:
        assert item in verification, item
    alignment.verify_alignment(candidate)
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(candidate) as dst:
        assert src.namelist() == dst.namelist(), 'ZIP inventory changed'
        changed = sorted(n for n in src.namelist() if src.read(n) != dst.read(n))
        dex = [n for n in src.namelist() if n.endswith('.dex')]
        assert len(dex) == 9 and all(src.read(n) == dst.read(n) for n in dex), 'Native implementation changed'
        webfiles = [n for n in src.namelist() if n.startswith('assets/public/') and not n.endswith('/')]
        assert len(webfiles) == 272 and dst.read(BUNDLE) == web
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(candidate, output)
    report = {'mode': 'dry-run-test-key-never-release', 'baseApkSha256': BASE_SHA, 'apkSha256': sha(output.read_bytes()),
              'apkBytes': output.stat().st_size, 'packagedWebSha256': sha(web), 'changedEntries': changed,
              'webFiles': 272, 'unchangedWebFiles': 271, 'nativeDexFiles': 9, 'byteIdenticalDexFiles': 9,
              'signatureVerified': ['v2', 'v3'], 'alignmentVerified': True, 'version': VERSION, 'versionCode': VERSION_CODE,
              'testCertificateSha256': identity['certificateSha256'], 'deviceTested': False,
              'installNote': 'same package as 1.4.0 with a different signature: uninstall 1.4.0 first, then restore the JSON backup'}
    (output.parent / 'fidelity.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(verification.splitlines()[-1])
    print('DRY-RUN APK:', output)
    print('SHA256:', report['apkSha256'], report['apkBytes'], 'bytes')
    print('changed entries:', changed)
    print('dry run only: the test certificate is NOT a release identity')


if __name__ == '__main__':
    main()
