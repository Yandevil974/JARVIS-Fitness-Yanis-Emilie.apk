"""Run with PYTHONPATH=.cache/signing-tools python3 -m unittest discover ..."""
import base64
import importlib.util
import io
import json
import pathlib
import tempfile
import unittest
import zipfile
from cryptography.exceptions import InvalidTag

MODULE = pathlib.Path(__file__).resolve().parents[1] / 'signing-next.py'
spec = importlib.util.spec_from_file_location('signing_next', MODULE)
signing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(signing)


class SigningRecovery(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = pathlib.Path(cls.tmp.name)
        cls.private = cls.root / 'private'
        cls.public = cls.root / 'identity.json'
        cls.encrypted = cls.root / 'encrypted.json'
        cls.identity = signing.initialize(cls.private, cls.public, cls.encrypted)
        cls.envelope = json.loads(cls.encrypted.read_text())
        cls.key = base64.b64decode((cls.private / 'recovery-key.txt').read_bytes())
        cls.data = (cls.private / signing.ARCHIVE).read_bytes()

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_private_signing_and_roundtrip(self):
        self.assertTrue(signing.inspect_backup(self.data, self.identity))
        self.assertEqual(signing.unseal(self.envelope, self.key), self.data)

    def test_new_identity_does_not_reuse_old_package(self):
        self.assertEqual(self.identity['appId'], 'app.yanis.fitness.evolution')
        self.assertEqual(self.identity['appName'], 'Yanis Fitness Evolution')
        self.assertNotEqual(self.identity['certificateSha256'], self.identity['previousCertificateSha256'])

    def test_new_key_cannot_silently_replace_old(self):
        with self.assertRaises(ValueError):
            signing.initialize(self.private, self.public, self.encrypted)
        self.assertEqual((self.private / signing.ARCHIVE).read_bytes(), self.data)

    def test_public_identity_blocks_even_if_private_missing(self):
        with self.assertRaises(ValueError):
            signing.initialize(self.root / 'missing', self.public, self.encrypted)
        self.assertFalse((self.root / 'missing').exists())

    def test_wrong_recovery_key(self):
        with self.assertRaises(InvalidTag):
            signing.unseal(self.envelope, bytes(32))

    def test_ciphertext_tampering(self):
        changed = dict(self.envelope)
        data = bytearray(base64.b64decode(changed['ciphertext']))
        data[len(data) // 2] ^= 1
        changed['ciphertext'] = base64.b64encode(data).decode()
        with self.assertRaises(InvalidTag):
            signing.unseal(changed, self.key)

    def test_metadata_is_authenticated(self):
        changed = {**self.envelope, 'identity': {**self.identity, 'appId': 'wrong'}}
        with self.assertRaises(InvalidTag):
            signing.unseal(changed, self.key)

    def test_public_files_do_not_contain_secrets(self):
        public = self.encrypted.read_bytes() + self.public.read_bytes()
        for name in ('password.txt', 'recovery-key.txt'):
            self.assertNotIn((self.private / name).read_bytes().strip(), public)
        self.assertNotIn((self.private / 'jarvis-evolution.p12').read_bytes(), public)
        self.assertEqual(set(self.envelope), {'format', 'algorithm', 'identity', 'nonce', 'ciphertext'})

    def test_private_permissions(self):
        self.assertEqual(self.private.stat().st_mode & 0o777, 0o700)
        for file in self.private.iterdir():
            self.assertEqual(file.stat().st_mode & 0o777, 0o600)

    def test_restore_actual_backup(self):
        target = self.root / 'restored'
        signing.restore(self.encrypted, self.private / 'recovery-key.txt', target, self.public)
        self.assertEqual((target / signing.ARCHIVE).read_bytes(), self.data)
        with self.assertRaises(ValueError):
            signing.restore(self.encrypted, self.private / 'recovery-key.txt', target, self.public)

    def test_reject_wrong_public_identity_before_restore(self):
        other = self.root / 'wrong-public.json'
        other.write_text('{}')
        with self.assertRaises(ValueError):
            signing.restore(self.encrypted, self.private / 'recovery-key.txt', self.root / 'wrong', other)
        self.assertFalse((self.root / 'wrong').exists())

    def test_unexpected_zip_path_rejected(self):
        stream = io.BytesIO(self.data)
        with zipfile.ZipFile(stream, 'a') as archive:
            archive.writestr('../outside', b'no')
        with self.assertRaises(ValueError):
            signing.inspect_backup(stream.getvalue(), self.identity)

    def test_mismatched_signing_certificate_rejected(self):
        wrong = {**self.identity, 'certificateSha256': '0' * 64}
        stream = io.BytesIO()
        with zipfile.ZipFile(io.BytesIO(self.data)) as src, zipfile.ZipFile(stream, 'w') as dst:
            for name in src.namelist():
                dst.writestr(name, json.dumps(wrong).encode() if name == 'identity.json' else src.read(name))
        with self.assertRaisesRegex(ValueError, 'Certificate mismatch'):
            signing.inspect_backup(stream.getvalue(), wrong)


if __name__ == '__main__':
    unittest.main()
