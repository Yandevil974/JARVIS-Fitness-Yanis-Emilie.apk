#!/usr/bin/env python3
"""Build the complete cumulative app with the new speech DEX and authorized identity.
No historical React rebuild. No private signing material in the APK or Git.
"""
import argparse, hashlib, importlib.util, json, os, pathlib, re, shutil, struct, subprocess, sys, tempfile, zipfile, zlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'complete-hotfix'))
from apk_binary import patch_manifest, patch_resources
spec = importlib.util.spec_from_file_location('alignment', ROOT / 'JARVIS-Fitness-Source/scripts/rebuild-apk.py')
alignment = importlib.util.module_from_spec(spec); spec.loader.exec_module(alignment)
TOOLS = ROOT / '.cache/apk-tools'
JAVA = os.environ.get('JAVA_BIN', str(ROOT / '.cache/java-tools/jdk4py/java-runtime/bin/java'))
BASE = ROOT / '.cache/reference/base.apk'
PRIVATE = ROOT.parent / '.jarvis-fitness-signing'
CONFIG = json.loads((ROOT / 'complete-hotfix/manifest.json').read_text())
WEB_SHA = 'd581bf4058ef0079d727cef521066f3c06227e1b11d4d467d3ed3a69655000e6'
APKSIGNER_SHA = 'e709f014757e9bdf2997452bcfe6d49861df5d530e86bbb6b2fa04baf94f7c03'
def sha(data): return hashlib.sha256(data).hexdigest()
def run(*args): subprocess.run([str(a) for a in args], cwd=ROOT, check=True)
def bridge(mode, src, dst): run(JAVA, '-XX:ActiveProcessorCount=1', '-cp', os.pathsep.join([str(TOOLS / 'apktool.jar'), str(TOOLS)]), 'DexBridge', mode, src, dst)
def smali_tree(folder): return {str(p.relative_to(folder)): p.read_bytes() for p in sorted(folder.rglob('*.smali'))}
def speech_class(name): return bool(re.fullmatch(r'app/jarvis/fitness/(?:JarvisSpeechPlugin(?:\$.*)?|-\$\$Lambda\$JarvisSpeechPlugin\$.*)\.smali', name))
def dex_classes(data):
    if data[:8] not in [b'dex\n035\0', b'dex\n037\0', b'dex\n038\0']: raise ValueError('Unsupported DEX version')
    assert struct.unpack_from('<I', data, 32)[0] == len(data)
    assert struct.unpack_from('<I', data, 8)[0] == zlib.adler32(data[12:]) & 0xffffffff
    assert data[12:32] == hashlib.sha1(data[32:]).digest()
    def word(offset): return struct.unpack_from('<I', data, offset)[0]
    strings, types, count, defs = word(60), word(68), word(96), word(100)
    result = []
    for i in range(count):
        offset = word(strings + 4 * word(types + 4 * word(defs + 32 * i)))
        while data[offset] & 128: offset += 1
        offset += 1
        end = data.index(0, offset)
        result.append(data[offset:end].decode('utf-8'))
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=pathlib.Path, default=ROOT / 'downloads/JARVIS-Fitness-1.1.0-evolution.apk')
    args = parser.parse_args()
    identity = json.loads((ROOT / 'evolution/android/identity.json').read_text())
    assert identity['userAuthorizedNewIdentity'] is True
    assert identity['appId'] not in ['app.jarvis.fitness', 'app.jarvis.fitness.fixed', 'app.jarvis.fitness.complete']
    assert sha(BASE.read_bytes()) == CONFIG['base']['sha256']
    for item in json.loads((ROOT / 'evolution/android/tools.json').read_text()):
        assert sha((TOOLS / item['file']).read_bytes()) == item['sha256'], 'Wrong tool: ' + item['file']
    assert sha((TOOLS / 'apksigner.jar').read_bytes()) == APKSIGNER_SHA
    native_report = json.loads((ROOT / '.cache/voice-native/compile-report.json').read_text())
    assert sha((ROOT / native_report['source']).read_bytes()) == native_report['sourceSha256'], 'Recompile native source'
    classes = pathlib.Path(native_report['output'])
    assert sha((classes / 'app/jarvis/fitness/JarvisSpeechPlugin.class').read_bytes()) == native_report['classSha256']
    run('node', ROOT / 'evolution/spokesperson/build.mjs')
    web_path = CONFIG['bundle']['path'].removeprefix('assets/public/')
    bundle = (ROOT / '.cache/spokesperson-web' / web_path).read_bytes()
    assert sha(bundle) == WEB_SHA, 'New web revision needs renewed validation and release pin'
    assert bundle.count(b'V 1.0.6') == 1
    bundle = bundle.replace(b'V 1.0.6', ('V ' + identity['version']).encode())
    work = ROOT / '.cache/android-release'
    if work.exists(): shutil.rmtree(work)
    work.mkdir(parents=True)
    with zipfile.ZipFile(work / 'plugin.jar', 'w') as jar:
        compiled = sorted(classes.glob('app/jarvis/fitness/JarvisSpeechPlugin*.class'))
        assert len(compiled) == 3
        for p in compiled: jar.write(p, p.relative_to(classes))
    newdex = work / 'newdex'; newdex.mkdir()
    run(JAVA, '-cp', TOOLS / 'r8.jar', 'com.android.tools.r8.D8', '--min-api', '26', '--lib', ROOT / '.cache/voice-native/android.jar',
        '--classpath', ROOT / '.cache/voice-native/reference-classes.jar', '--output', newdex, work / 'plugin.jar')
    with zipfile.ZipFile(BASE) as z: (work / 'original.dex').write_bytes(z.read('classes9.dex'))
    old, new, merged, check = [work / x for x in ['old-smali', 'new-smali', 'merged-smali', 'check-smali']]
    bridge('disassemble', work / 'original.dex', old); bridge('disassemble', newdex / 'classes.dex', new)
    before, plugin = smali_tree(old), smali_tree(new)
    removed = {name for name in before if speech_class(name)}
    assert len(before) == 6 and len(removed) == 4 and len(plugin) == 19
    assert all(speech_class(name) for name in plugin)
    assert all(b'LambdaMetafactory' not in text and b'invoke-custom' not in text for text in plugin.values())
    retained = {name: text for name, text in before.items() if name not in removed}
    expected = {**retained, **plugin}
    for name, text in expected.items():
        p = merged / name; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(text)
    native_dex = work / 'classes9.dex'
    bridge('assemble', merged, native_dex); bridge('disassemble', native_dex, check)
    assert smali_tree(check) == expected, 'DEX round-trip changed instructions/annotations/debug info'
    main = retained['app/jarvis/fitness/MainActivity.smali']
    assert b'Lapp/jarvis/fitness/JarvisSpeechPlugin;' in main and b'->registerPlugin' in main
    speech = plugin['app/jarvis/fitness/JarvisSpeechPlugin.smali']
    for marker in [b'.annotation runtime Lcom/getcapacitor/annotation/CapacitorPlugin;', b'.annotation runtime Lcom/getcapacitor/annotation/PermissionCallback;', b'android.permission.RECORD_AUDIO', b'protocolVersion', b'voiceOptionsVersion', b'diagnostics(', b'cancelListen(', b'stopSpeech(']:
        assert marker in speech, 'Missing native bridge metadata: ' + marker.decode()
    unsigned, aligned = work / 'unsigned.apk', work / 'aligned.apk'
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(unsigned, 'w') as dst:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.filename == CONFIG['bundle']['path']: data = bundle
            elif info.filename == 'classes9.dex': data = native_dex.read_bytes()
            elif info.filename == 'AndroidManifest.xml':
                oldid, newid = 'app.jarvis.fitness', identity['appId']
                replacements = {oldid: newid, '1.0.4': identity['version']}
                for suffix in ['fileprovider', 'androidx-startup', 'DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION']: replacements[oldid + '.' + suffix] = newid + '.' + suffix
                data = patch_manifest(data, replacements, identity['versionCode'])
            elif info.filename == 'resources.arsc':
                data = patch_resources(data, {'app.jarvis.fitness': identity['appId'], 'JARVIS Fitness': identity['appName']}, 'app.jarvis.fitness', identity['appId'])
            elif info.filename == 'assets/capacitor.config.json':
                cap = json.loads(data); cap.update(appId=identity['appId'], appName=identity['appName'])
                data = (json.dumps(cap, ensure_ascii=False, indent=2) + '\n').encode()
            dst.writestr(info, data)
    alignment.align_apk(unsigned, aligned)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    candidate = work / 'signed.apk'
    # Sign using an independently restored private backup. This checks access to
    # the actual private key, not only presence of its public certificate.
    with tempfile.TemporaryDirectory(prefix='sign-from-backup-', dir=PRIVATE) as temp:
        secret = pathlib.Path(temp)
        with zipfile.ZipFile(PRIVATE / 'JARVIS-signature-CONFIDENTIEL.zip') as z:
            assert set(z.namelist()) == {'jarvis-evolution.p12', 'password.txt', 'identity.json', 'A-LIRE.txt'}
            z.extractall(secret)
        assert json.loads((secret / 'identity.json').read_text()) == identity
        for file in secret.iterdir(): file.chmod(0o600)
        run(JAVA, '-jar', TOOLS / 'apksigner.jar', 'sign', '--ks', secret / 'jarvis-evolution.p12', '--ks-pass', 'file:' + str(secret / 'password.txt'),
            '--ks-key-alias', 'jarvis-evolution', '--v1-signing-enabled', 'false', '--v2-signing-enabled', 'true', '--v3-signing-enabled', 'true',
            '--v4-signing-enabled', 'false', '--out', candidate, aligned)
    verified = subprocess.check_output([JAVA, '-jar', str(TOOLS / 'apksigner.jar'), 'verify', '--verbose', '--print-certs', str(candidate)], text=True)
    assert 'Signer #1 certificate SHA-256 digest: ' + identity['certificateSha256'] in verified
    assert 'Number of signers: 1' in verified and 'Verified using v2 scheme (APK Signature Scheme v2): true' in verified and 'Verified using v3 scheme (APK Signature Scheme v3): true' in verified
    print(verified)
    alignment.verify_alignment(candidate)
    with zipfile.ZipFile(BASE) as src, zipfile.ZipFile(candidate) as dst:
        assert sorted(src.namelist()) == sorted(dst.namelist()), 'Resource inventory changed'
        changed = sorted(n for n in src.namelist() if src.read(n) != dst.read(n))
        assert changed == sorted(['AndroidManifest.xml', 'resources.arsc', 'assets/capacitor.config.json', CONFIG['bundle']['path'], 'classes9.dex'])
        all_classes, original_count = [], 0
        for name in src.namelist():
            if name.endswith('.dex'):
                original_count += len(dex_classes(src.read(name)))
                all_classes += dex_classes(dst.read(name))
        assert len(all_classes) == len(set(all_classes)) == original_count - len(removed) + len(plugin)
        assert dst.read(CONFIG['bundle']['path']) == bundle
        web = [n for n in dst.namelist() if n.startswith('assets/public/') and not n.endswith('/')]
        assert len(web) == 272
    report = dict(identity=identity, baseApkSha256=sha(BASE.read_bytes()), apkSha256=sha(candidate.read_bytes()),
        webBundleSha256=sha(bundle), validatedStage3WebSha256=WEB_SHA, changedEntries=changed, webFiles=272, unchangedWebFiles=271,
        nativeDexFiles=9, byteIdenticalDexFiles=8, originalClasses=original_count, resultingClasses=len(all_classes),
        removedSpeechClasses=sorted(removed), newSpeechClasses=sorted(plugin), unchangedClassesInRebuiltDex=sorted(retained),
        nativeSourceSha256=native_report['sourceSha256'], nativeDexSha256=sha(native_dex.read_bytes()),
        nativeRoundTripExact=True, signedFromRestoredPrivateBackup=True, signatureVerified=['v2', 'v3'], alignmentVerified=True,
        deviceTested=False, stagesIncluded=[1, 2, 3], stagesNotYetImplemented=[4, 5, 6, 7, 'general conversational AI'])
    # Expose the deliverable only after every integrity/signature check succeeds.
    temporary_output = args.output.with_suffix('.apk.tmp')
    shutil.copyfile(candidate, temporary_output)
    temporary_output.replace(args.output)
    args.output.with_suffix('.fidelity.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print('Signed APK:', args.output, '\nSHA-256:', report['apkSha256'])
if __name__ == '__main__': main()
