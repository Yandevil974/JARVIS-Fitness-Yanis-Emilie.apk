#!/usr/bin/env python3
"""Preserve the entire supplied APK; patch only the confirmed timer defect.

Unlike the 1.0.5 procedure, this script NEVER copies the older React build
into the APK. All feature code, CSS, media, fonts and native DEX are retained.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile
from apk_binary import patch_manifest, patch_resources

ROOT = Path(__file__).resolve().parent
CONFIG = json.loads((ROOT / 'manifest.json').read_text())
# Reuse only ZIP alignment primitives, not the older web build/rebuild pipeline.
spec = importlib.util.spec_from_file_location('zip_helpers', ROOT.parent / 'JARVIS-Fitness-Source/scripts/rebuild-apk.py')
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)


def run(*args):
    subprocess.run([str(a) for a in args], check=True)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def verify_fidelity(base_path, target_path):
    """Fail delivery if anything beyond the explicit allowlist changed/disappeared."""
    allowed = {'AndroidManifest.xml', 'resources.arsc', 'assets/capacitor.config.json', CONFIG['bundle']['path']}
    with zipfile.ZipFile(base_path) as a, zipfile.ZipFile(target_path) as b:
        before, after = set(a.namelist()), set(b.namelist())
        removed = sorted(before - after)
        added = sorted(after - before)
        if removed or added:
            raise ValueError(f'Unexpected inventory change: removed={removed}, added={added}')
        changed = sorted(name for name in before if a.read(name) != b.read(name))
        if set(changed) != allowed:
            raise ValueError(f'Unexpected modified entries: {changed}')
        natives = sorted(name for name in before if name.endswith('.dex'))
        web = sorted(name for name in before if name.startswith('assets/public/'))
        assets = {
            name: digest(b.read(name)) for name in sorted(before)
            if name.startswith('assets/public/') or name.endswith('.dex')
        }
        return {
            'baseSha256': digest(Path(base_path).read_bytes()),
            'apkSha256': digest(Path(target_path).read_bytes()),
            'baseCommit': CONFIG['base']['commit'],
            'baseFilename': CONFIG['base']['path'],
            'version': CONFIG['version'], 'appId': CONFIG['appId'],
            'removedEntries': removed, 'addedEntries': added,
            'changedEntries': changed,
            'nativeDexIdentical': len(natives),
            'webFileCount': len(web), 'webFilesByteIdentical': len(web) - 1,
            'verifiedFileHashes': assets,
        }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['base', 'apksigner', 'keystore', 'password-file', 'output']:
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--java', default='java')
    args = parser.parse_args()
    if digest(args.base.read_bytes()) != CONFIG['base']['sha256']:
        raise ValueError('Wrong APK base: use the complete JARVIS-Fitness.apk pinned in manifest.json')
    with tempfile.TemporaryDirectory(prefix='jarvis-complete-') as tmp:
        work = Path(tmp)
        old, new = 'app.jarvis.fitness', CONFIG['appId']
        unsigned, aligned = work / 'unsigned.apk', work / 'aligned.apk'
        with zipfile.ZipFile(args.base) as original, zipfile.ZipFile(unsigned, 'w') as output:
            for info in original.infolist():
                data = original.read(info.filename)
                if info.filename == CONFIG['bundle']['path']:
                    bundle = work / 'bundle.js'
                    bundle.write_bytes(data)
                    run('node', ROOT / 'patch-web.mjs', bundle)
                    data = bundle.read_bytes()
                elif info.filename == 'AndroidManifest.xml':
                    replacements = {old: new, '1.0.4': CONFIG['version']}
                    for suffix in ['fileprovider', 'androidx-startup', 'DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION']:
                        replacements[f'{old}.{suffix}'] = f'{new}.{suffix}'
                    data = patch_manifest(data, replacements, CONFIG['versionCode'])
                elif info.filename == 'resources.arsc':
                    data = patch_resources(data, {old: new, 'JARVIS Fitness': CONFIG['appName']}, old, new)
                elif info.filename == 'assets/capacitor.config.json':
                    cap = json.loads(data)
                    cap.update(appId=new, appName=CONFIG['appName'])
                    data = (json.dumps(cap, ensure_ascii=False, indent=2) + '\n').encode()
                output.writestr(info, data)
        helpers.align_apk(unsigned, aligned)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        run(args.java, '-jar', args.apksigner, 'sign', '--ks', args.keystore,
            '--ks-pass', f'file:{args.password_file}', '--v1-signing-enabled', 'false',
            '--v2-signing-enabled', 'true', '--v3-signing-enabled', 'true',
            '--v4-signing-enabled', 'false', '--out', args.output, aligned)
        run(args.java, '-jar', args.apksigner, 'verify', '--verbose', '--print-certs', args.output)
        helpers.verify_alignment(args.output)
        report = verify_fidelity(args.base, args.output)
        args.output.with_suffix('.fidelity.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        print(json.dumps({k: v for k, v in report.items() if k != 'verifiedFileHashes'}, indent=2))


if __name__ == '__main__':
    main()
