#!/usr/bin/env python3
"""Explicit one-time signing identity creation. Never print/store secrets in Git.
The private directory MUST be outside the repository and outside disposable caches.
"""
import argparse, hashlib, json, os, pathlib, secrets, subprocess, tempfile, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[2]
PRIVATE = ROOT.parent / '.jarvis-fitness-signing'
KEYTOOL = ROOT / '.cache/java-tools/jdk4py/java-runtime/bin/keytool'
IDENTITY = ROOT / 'evolution/android/identity.json'
BACKUP = PRIVATE / 'JARVIS-signature-CONFIDENTIEL.zip'
def run(*args):
    # keytool never receives passwords as command arguments; only private file paths.
    subprocess.run([str(x) for x in args], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
def certificate(directory):
    return subprocess.check_output([str(KEYTOOL), '-exportcert', '-keystore', str(directory / 'jarvis-evolution.p12'),
        '-storepass:file', str(directory / 'password.txt'), '-alias', 'jarvis-evolution'], stderr=subprocess.PIPE)
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--initialize-authorized-new-identity', action='store_true')
    args = parser.parse_args()
    if not args.initialize_authorized_new_identity: parser.error('Explicit initialization flag required. This is NOT old-key recovery.')
    if PRIVATE.exists() or IDENTITY.exists(): raise SystemExit('Refusing to replace existing identity/private directory. Recover it, do not regenerate.')
    PRIVATE.mkdir(mode=0o700)
    old_mask = os.umask(0o077)
    try:
        password = PRIVATE / 'password.txt'
        with password.open('x') as f: f.write(secrets.token_urlsafe(48) + '\n')
        run(KEYTOOL, '-genkeypair', '-storetype', 'PKCS12', '-keystore', PRIVATE / 'jarvis-evolution.p12',
            '-storepass:file', password, '-alias', 'jarvis-evolution', '-keyalg', 'RSA', '-keysize', '3072',
            '-sigalg', 'SHA256withRSA', '-validity', '10000', '-dname', 'CN=JARVIS Fitness Evolution, O=JARVIS Fitness', '-noprompt')
        cert = certificate(PRIVATE)
        fingerprint = hashlib.sha256(cert).hexdigest()
        identity = dict(appId='app.jarvis.fitness.evolution', appName='JARVIS Fitness Évolution', version='1.1.0', versionCode=8,
            certificateSha256=fingerprint, previousCertificateSha256='5c6af2226164d32ab145c3bedd789e1ed4d30170858122cfaa76bb01c9bd62e7',
            installation='parallel, not an in-place update of 1.0.6', userAuthorizedNewIdentity=True)
        assert fingerprint != identity['previousCertificateSha256']
        (PRIVATE / 'identity.json').write_text(json.dumps(identity, ensure_ascii=False, indent=2) + '\n')
        (PRIVATE / 'A-LIRE.txt').write_text('CONFIDENTIEL — SIGNATURE DE JARVIS FITNESS ÉVOLUTION\n\n'
            'Garder cette archive dans un emplacement privé sauvegardé, comme un mot de passe.\n'
            'Ne jamais la publier sur GitHub, dans un APK ou dans un message public.\n'
            'Elle contient la clé protégée et son mot de passe : le ZIP lui-même n’est PAS chiffré.\n'
            'Elle permet de signer les prochaines mises à jour de cette nouvelle application.\n'
            'Elle ne contient pas les données sportives : exporter aussi la sauvegarde JSON depuis l’application.\n'
            'Ne pas la supprimer après installation. Conserver idéalement deux copies privées.\n')
        with zipfile.ZipFile(BACKUP, 'x', zipfile.ZIP_DEFLATED) as z:
            for name in ['jarvis-evolution.p12', 'password.txt', 'identity.json', 'A-LIRE.txt']: z.write(PRIVATE / name, name)
        # A separate restored copy is usable. APK building also tests private-key signing
        # from this restored archive, not merely extraction of its public certificate.
        with tempfile.TemporaryDirectory(prefix='restore-check-', dir=PRIVATE) as tmp:
            with zipfile.ZipFile(BACKUP) as z: z.extractall(tmp)
            assert certificate(pathlib.Path(tmp)) == cert, 'Restored identity mismatch'
        IDENTITY.write_text(json.dumps(identity, ensure_ascii=False, indent=2) + '\n')
        os.chmod(IDENTITY, 0o644)
        print('Created new parallel-install identity. Public certificate SHA-256:', fingerprint)
        print('Private backup created and public certificate checked after restoration. No secrets printed.')
    finally: os.umask(old_mask)
if __name__ == '__main__': main()
