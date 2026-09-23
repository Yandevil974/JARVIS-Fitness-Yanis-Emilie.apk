#!/usr/bin/env python3
"""Identity of the media-correction lineage (1.4.2 and its successors).

Same convention as signing-home.py: the private material lives in .private/, the
plaintext ZIP is handed to the user, and an AES-256-GCM ciphertext is committed
so that a lost workspace can be repaired with the user's recovery key.

    python3 evolution/android/signing-media.py init      # one-shot, refuses to overwrite
    python3 evolution/android/signing-media.py restore --recovery-key-file /path/recovery-key.txt
    python3 evolution/android/signing-media.py inspect --recovery-key-file /path/recovery-key.txt

Why the encrypted copy is committed: the 1.4.1 identity was created on 23 Sep 2026
with only a plaintext ZIP in the workspace; a sandbox reset destroyed it and no
future update of that install is possible. This script exists so that never
happens again.
"""
import argparse
import base64
import datetime as dt
import io
import json
import os
import pathlib
import secrets
import sys
import zipfile

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

ROOT = pathlib.Path(__file__).resolve().parents[2]
PRIVATE = ROOT / '.private/yanis-fitness-evolution-media-142'
IDENTITY = ROOT / 'evolution/android/identity-media-142.json'
ENCRYPTED = ROOT / 'evolution/signing/evolution-media-142.encrypted.json'
ARCHIVE = 'Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip'
APP_ID = 'app.yanis.fitness.evolution.home'
VERSION = '1.4.2'
VERSION_CODE = 13
KEY_ALIAS = 'jarvis-evolution-media-142'
P12 = KEY_ALIAS + '.p12'
NAMES = {'jarvis-evolution-media-142.p12', 'password.txt', 'identity.json', 'A-LIRE.txt', 'recovery-key.txt'}
AAD = b'Yanis Fitness Evolution signing backup v1\0'
PREVIOUS = '7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd'


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()


def public_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    os.chmod(path, 0o644)


def private_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('xb') as stream:
        os.chmod(path, 0o600)
        stream.write(data)


def inspect_backup(data, identity):
    """Validate inventory, identity, key pairing AND an actual signature."""
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        if set(archive.namelist()) != NAMES or len(archive.namelist()) != len(NAMES):
            raise ValueError('Unexpected private backup inventory')
        if any(item.file_size > 100_000 for item in archive.infolist()):
            raise ValueError('Oversized private backup')
        if json.loads(archive.read('identity.json')) != identity:
            raise ValueError('Identity mismatch')
        key, cert, _ = pkcs12.load_key_and_certificates(
            archive.read(P12), archive.read('password.txt').strip())
        if not isinstance(key, rsa.RSAPrivateKey) or key.key_size != 3072:
            raise ValueError('Unexpected signing key')
        if cert.fingerprint(hashes.SHA256()).hex() != identity['certificateSha256']:
            raise ValueError('Certificate mismatch')
        message = secrets.token_bytes(64)
        signature = key.sign(message, padding.PKCS1v15(), hashes.SHA256())
        cert.public_key().verify(signature, message, padding.PKCS1v15(), hashes.SHA256())
        if len(base64.b64decode(archive.read('recovery-key.txt').strip(), validate=True)) != 32:
            raise ValueError('Invalid recovery key')
    return True


def seal(data, identity, key):
    nonce = secrets.token_bytes(12)
    encrypted = AESGCM(key).encrypt(nonce, data, AAD + canonical(identity))
    return {'format': 1, 'algorithm': 'AES-256-GCM', 'identity': identity,
            'nonce': base64.b64encode(nonce).decode(),
            'ciphertext': base64.b64encode(encrypted).decode()}


def unseal(envelope, key):
    if envelope.get('format') != 1 or envelope.get('algorithm') != 'AES-256-GCM':
        raise ValueError('Unsupported backup format')
    nonce = base64.b64decode(envelope['nonce'], validate=True)
    encrypted = base64.b64decode(envelope['ciphertext'], validate=True)
    if len(nonce) != 12 or len(key) != 32 or len(encrypted) > 200_000:
        raise ValueError('Invalid backup bounds')
    data = AESGCM(key).decrypt(nonce, encrypted, AAD + canonical(envelope['identity']))
    inspect_backup(data, envelope['identity'])
    return data


def read_recovery_key(path):
    key = base64.b64decode(pathlib.Path(path).read_bytes().strip(), validate=True)
    if len(key) != 32:
        raise ValueError('The recovery key must be 32 bytes in base64')
    return key


def make_identity():
    key = rsa.generate_private_key(public_exponent=65537, key_size=3072)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Yanis Fitness Evolution')])
    now = dt.datetime.now(dt.timezone.utc)
    cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name)
            .public_key(key.public_key()).serial_number(x509.random_serial_number())
            .not_valid_before(now - dt.timedelta(days=1))
            .not_valid_after(now + dt.timedelta(days=10000))
            .sign(key, hashes.SHA256()))
    identity = {'appId': APP_ID, 'appName': 'Yanis Fitness Evolution', 'version': VERSION,
                'versionCode': VERSION_CODE,
                'certificateSha256': cert.fingerprint(hashes.SHA256()).hex(),
                'previousCertificateSha256': PREVIOUS,
                'installation': 'same package as 1.4.0, new signature: uninstall 1.4.0 then install this build, restore the JSON backup',
                'userAuthorizedNewIdentity': True, 'authorizationDate': '2026-09-23',
                'authorizationNote': 'new key explicitly authorized by the user; the existing certificates are never regenerated'}
    password = secrets.token_urlsafe(48).encode()
    recovery_key = secrets.token_bytes(32)
    files = {
        P12: pkcs12.serialize_key_and_certificates(KEY_ALIAS.encode(), key, cert, None,
                                                   serialization.BestAvailableEncryption(password)),
        'password.txt': password + b'\n',
        'identity.json': json.dumps(identity, ensure_ascii=False, indent=2).encode() + b'\n',
        'recovery-key.txt': base64.b64encode(recovery_key) + b'\n',
        'A-LIRE.txt': ('SAUVEGARDE PRIVEE - YANIS FITNESS EVOLUTION 1.4.2\n\n'
                       'Ce ZIP contient la signature et les secrets de recuperation de l\'application corrigee.\n'
                       'Il n\'est pas chiffre : ne le publie jamais sur GitHub ni ailleurs.\n'
                       'Garde deux copies privees (telephone + cloud prive ou cle USB).\n'
                       'Ce n\'est PAS l\'application a installer, ni la sauvegarde de tes donnees sportives.\n'
                       'Cette signature permet les futures mises a jour de app.yanis.fitness.evolution.home.\n'
                       'La copie chiffree versionnee dans le depot se restaure avec recovery-key.txt,\n'
                       'via : python3 evolution/android/signing-media.py restore --recovery-key-file recovery-key.txt\n'
                       'Ne desinstalle rien avant d\'avoir exporte le JSON de sauvegarde de tes donnees.\n').encode(),
    }
    return identity, files, recovery_key


def initialize():
    # Check every location BEFORE producing a key: a partial state must be
    # restored or audited, never silently replaced by a different identity.
    if PRIVATE.exists() or IDENTITY.exists() or ENCRYPTED.exists():
        raise ValueError('Identity or backup already exists. Restore it; do not regenerate. '
                         + 'See evolution/signing/evolution-media-142.encrypted.json')
    old_mask = os.umask(0o077)
    try:
        identity, files, recovery_key = make_identity()
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w', zipfile.ZIP_DEFLATED) as archive:
            for name, value in files.items():
                archive.writestr(name, value)
        data = stream.getvalue()
        inspect_backup(data, identity)
        envelope = seal(data, identity, recovery_key)
        assert unseal(envelope, recovery_key) == data
        # Local copies first, public metadata last.
        PRIVATE.mkdir(mode=0o700, parents=True)
        for name, value in files.items():
            private_write(PRIVATE / name, value)
        private_write(PRIVATE / ARCHIVE, data)
        private_write(ROOT / 'downloads' / ARCHIVE, data)
        public_write(ENCRYPTED, json.dumps(envelope, ensure_ascii=False, indent=2).encode() + b'\n')
        public_write(IDENTITY, files['identity.json'])
        return identity, ROOT / 'downloads' / ARCHIVE
    finally:
        os.umask(old_mask)


def restore(recovery_key_file):
    if PRIVATE.exists() and any(PRIVATE.iterdir()):
        raise ValueError('Private material already present: ' + str(PRIVATE))
    envelope = json.loads(ENCRYPTED.read_text(encoding='utf-8'))
    data = unseal(envelope, read_recovery_key(recovery_key_file))
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        files = {name: archive.read(name) for name in archive.namelist()}
    old_mask = os.umask(0o077)
    try:
        PRIVATE.mkdir(mode=0o700, parents=True)
        for name, value in files.items():
            private_write(PRIVATE / name, value)
        private_write(PRIVATE / ARCHIVE, data)
        private_write(ROOT / 'downloads' / ARCHIVE, data)
        public_write(IDENTITY, files['identity.json'])
    finally:
        os.umask(old_mask)
    return envelope['identity']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('init', help='create the identity; refuses if any part already exists')
    for name in ('restore', 'inspect'):
        item = sub.add_parser(name, help='rebuild the private files from the committed ciphertext')
        item.add_argument('--recovery-key-file', required=True)
    args = parser.parse_args()
    if args.command == 'init':
        identity, archive = initialize()
        print('NEW identity certificate:', identity['certificateSha256'])
        print('private material:', PRIVATE)
        print('private backup (plaintext, never to publish):', archive)
        print('committed ciphertext:', ENCRYPTED)
        return
    envelope = json.loads(ENCRYPTED.read_text(encoding='utf-8'))
    if args.command == 'inspect':
        data = unseal(envelope, read_recovery_key(args.recovery_key_file))
        print('Ciphertext matches its public identity and its key can sign:',
              len(data), 'bytes,', envelope['identity']['certificateSha256'])
        return
    identity = restore(args.recovery_key_file)
    print('RESTORED identity:', identity['certificateSha256'])
    print('private material:', PRIVATE)


if __name__ == '__main__':
    sys.exit(main())
