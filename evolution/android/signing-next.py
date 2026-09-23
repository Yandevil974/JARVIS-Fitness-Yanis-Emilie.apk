#!/usr/bin/env python3
"""Explicitly authorized NEW parallel identity. Never replace the historical identity.
Requires cryptography==46.0.3. No secrets are printed or passed on command lines.
Only authenticated ciphertext and public identity metadata may enter Git.
"""
import argparse
import base64
import datetime as dt
import hashlib
import io
import json
import os
from pathlib import Path
import secrets
import zipfile

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

ROOT = Path(__file__).resolve().parents[2]
PRIVATE = ROOT / '.private/yanis-fitness-evolution'
IDENTITY = ROOT / 'evolution/android/identity-next.json'
ENCRYPTED = ROOT / 'evolution/signing/evolution-next.encrypted.json'
ARCHIVE = 'Yanis-Fitness-Evolution-SAUVEGARDE-PRIVEE.zip'
APP_ID = 'app.yanis.fitness.evolution'
NAMES = {'jarvis-evolution.p12', 'password.txt', 'identity.json', 'A-LIRE.txt', 'recovery-key.txt'}
AAD = b'Yanis Fitness Evolution signing backup v1\0'


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()


def private_write(path, data):
    with path.open('xb') as stream:
        os.chmod(path, 0o600)
        stream.write(data)


def inspect_backup(data, identity):
    """Validate inventory, identity, key pairing AND actual private-key signing."""
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        if set(archive.namelist()) != NAMES or len(archive.namelist()) != len(NAMES):
            raise ValueError('Unexpected private backup inventory')
        if any(i.file_size > 100_000 for i in archive.infolist()):
            raise ValueError('Oversized private backup')
        if json.loads(archive.read('identity.json')) != identity:
            raise ValueError('Identity mismatch')
        key, cert, _ = pkcs12.load_key_and_certificates(
            archive.read('jarvis-evolution.p12'), archive.read('password.txt').strip())
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


def initialize(private=PRIVATE, identity_path=IDENTITY, encrypted_path=ENCRYPTED):
    # Check every location BEFORE producing any new identity. A partial operation
    # must be audited/restored, never silently overwritten with a different key.
    if private.exists() or identity_path.exists() or encrypted_path.exists():
        raise ValueError('Identity or backup already exists. Restore it; do not regenerate.')
    private.parent.mkdir(parents=True, exist_ok=True)
    private.mkdir(mode=0o700)
    old_mask = os.umask(0o077)
    try:
        key = rsa.generate_private_key(public_exponent=65537, key_size=3072)
        name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Yanis Fitness Evolution')])
        now = dt.datetime.now(dt.timezone.utc)
        cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name)
                .public_key(key.public_key()).serial_number(x509.random_serial_number())
                .not_valid_before(now - dt.timedelta(days=1))
                .not_valid_after(now + dt.timedelta(days=10000))
                .sign(key, hashes.SHA256()))
        identity = {'appId': APP_ID, 'appName': 'Yanis Fitness Evolution',
                    'version': '1.3.0', 'versionCode': 10,
                    'certificateSha256': cert.fingerprint(hashes.SHA256()).hex(),
                    'previousCertificateSha256': '0849b90901a80eecbd587bd41d5acfbfb120096889bb979dfa37564a8de23225',
                    'installation': 'parallel to all previous applications; explicit JSON migration',
                    'userAuthorizedNewIdentity': True,
                    'authorizationDate': '2026-09-20'}
        password = secrets.token_urlsafe(48).encode()
        recovery_key = secrets.token_bytes(32)
        files = {
            'jarvis-evolution.p12': pkcs12.serialize_key_and_certificates(
                b'jarvis-evolution', key, cert, None, serialization.BestAvailableEncryption(password)),
            'password.txt': password + b'\n',
            'identity.json': json.dumps(identity, ensure_ascii=False, indent=2).encode() + b'\n',
            'recovery-key.txt': base64.b64encode(recovery_key) + b'\n',
            'A-LIRE.txt': ('SAUVEGARDE PRIVÉE — YANIS FITNESS EVOLUTION\n\n'
                'Ce ZIP contient la signature et les secrets de récupération de la NOUVELLE application.\n'
                'Ce ZIP lui-même n’est pas chiffré. Ne le publie jamais sur GitHub ou ailleurs.\n'
                'Télécharge-le et garde deux copies dans des emplacements privés sauvegardés,\n'
                'par exemple ton téléphone ET un espace cloud privé ou une clé USB.\n'
                'Ce n’est PAS l’application à installer, ni la sauvegarde de tes données sportives.\n'
                'La signature permet les futures mises à jour de app.yanis.fitness.evolution.\n'
                'La copie chiffrée du dépôt est récupérable avec recovery-key.txt ; ce secret ne doit jamais y être publié.\n'
                'Ne désinstalle aucune ancienne application avant vérification de l’import des deux profils.\n').encode(),
        }
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w', zipfile.ZIP_DEFLATED) as archive:
            for name, value in files.items():
                archive.writestr(name, value)
        data = stream.getvalue()
        inspect_backup(data, identity)
        envelope = seal(data, identity, recovery_key)
        assert unseal(envelope, recovery_key) == data
        # Local backup written FIRST; ciphertext and public identity last.
        for name, value in files.items():
            private_write(private / name, value)
        private_write(private / ARCHIVE, data)
        encrypted_path.parent.mkdir(parents=True, exist_ok=True)
        private_write(encrypted_path, json.dumps(envelope, ensure_ascii=False, indent=2).encode() + b'\n')
        private_write(identity_path, files['identity.json'])
        encrypted_path.chmod(0o644)
        identity_path.chmod(0o644)
        return identity
    finally:
        os.umask(old_mask)


def restore(encrypted_path, key_path, target, identity_path=IDENTITY):
    if target.exists():
        raise ValueError('Refusing to overwrite an existing private directory')
    envelope = json.loads(encrypted_path.read_text())
    if envelope['identity'] != json.loads(identity_path.read_text()):
        raise ValueError('Public identity mismatch')
    key = base64.b64decode(key_path.read_bytes().strip(), validate=True)
    data = unseal(envelope, key)
    target.mkdir(parents=True, mode=0o700)
    old_mask = os.umask(0o077)
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            for name in NAMES:  # fixed inventory; never extract arbitrary ZIP paths
                private_write(target / name, archive.read(name))
        private_write(target / ARCHIVE, data)
    finally:
        os.umask(old_mask)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--initialize-authorized-parallel-identity', action='store_true')
    parser.add_argument('--restore-with-key-file', type=Path)
    parser.add_argument('--restore-to', type=Path)
    args = parser.parse_args()
    if args.initialize_authorized_parallel_identity:
        if args.restore_with_key_file or args.restore_to:
            parser.error('Choose initialization OR restoration')
        identity = initialize()
        print('New parallel identity created; public certificate SHA-256:', identity['certificateSha256'])
        print('Encrypted backup round-trip and private-key signing verified.')
        print('External private backup retention is NOT yet confirmed.')
    elif args.restore_with_key_file and args.restore_to:
        restore(ENCRYPTED, args.restore_with_key_file, args.restore_to)
        print('Restored existing identity and verified private-key signing. No new identity generated.')
    else:
        parser.error('Explicit authorization flag or recovery-file/target arguments required')


if __name__ == '__main__':
    main()
