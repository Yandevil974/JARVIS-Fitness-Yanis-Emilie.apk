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
RELEASE = json.loads((ROOT / 'evolution/android/release.json').read_text())
WEB_SHA = RELEASE['webSha256']
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
    global RELEASE, WEB_SHA, PRIVATE
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=pathlib.Path)
    parser.add_argument('--new-parallel', action='store_true', help='Authorized 2026-09-20 identity and stages 1–7, never replace older identities')
    args = parser.parse_args()
    if args.new_parallel:
        RELEASE = json.loads((ROOT / 'evolution/android/release-next.json').read_text())
        WEB_SHA = RELEASE['webSha256']
        PRIVATE = ROOT / '.private/yanis-fitness-evolution'
    if args.output is None: args.output = ROOT / RELEASE['output']
    if args.new_parallel and args.output.resolve() in [(ROOT / 'downloads' / n).resolve() for n in ['Yanis-Fitness-Evolution-1.2.0.apk','JARVIS-Fitness-1.1.0-evolution.apk','JARVIS-Fitness-1.0.6-complet.apk']]:
        raise ValueError('Refusing to overwrite historical release')
    creation = json.loads((ROOT / ('evolution/android/identity-next.json' if args.new_parallel else 'evolution/android/identity.json')).read_text())
    # Immutable signing identity is separate from mutable release branding/version.
    identity = {**creation, **{k: RELEASE[k] for k in ['appName', 'version', 'versionCode']}}
    identity['installation'] = creation['installation'] if args.new_parallel else 'in-place update of 1.1.0; remains parallel to 1.0.6'
    assert identity['versionCode'] >= creation['versionCode'] if args.new_parallel else identity['versionCode'] > creation['versionCode']
    if args.new_parallel: assert identity['appId'] == 'app.yanis.fitness.evolution'
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
    run('node', ROOT / ('evolution/' + RELEASE['webStage'] + '/build.mjs'))
    web_path = CONFIG['bundle']['path'].removeprefix('assets/public/')
    bundle = (ROOT / ('.cache/' + RELEASE['webStage'] + '-web') / web_path).read_bytes()
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
    reminders_report = None
    if args.new_parallel:
        reminders_report = json.loads((ROOT / '.cache/notifications-native/compile-report.json').read_text())
        for item in reminders_report['sources']: assert sha((ROOT / item['path']).read_bytes()) == item['sha256'], 'Recompile reminder sources'
        native_classes = pathlib.Path(reminders_report['output'])
        expected_classes = ['JarvisRemindersPlugin.class','ReminderScheduler.class','ReminderReceiver.class']
        assert sorted(p.name for p in native_classes.glob('app/jarvis/fitness/*.class')) == sorted(expected_classes)
        with zipfile.ZipFile(work / 'plugin.jar', 'a') as jar:
            for name in expected_classes:
                p = native_classes / 'app/jarvis/fitness' / name
                jar.write(p, p.relative_to(native_classes))
    newdex = work / 'newdex'; newdex.mkdir()
    run(JAVA, '-cp', TOOLS / 'r8.jar', 'com.android.tools.r8.D8', '--min-api', '26', '--lib', ROOT / '.cache/voice-native/android.jar',
        '--classpath', ROOT / '.cache/voice-native/reference-classes.jar', '--output', newdex, work / 'plugin.jar')
    with zipfile.ZipFile(BASE) as z: (work / 'original.dex').write_bytes(z.read('classes9.dex'))
    old, new, merged, check = [work / x for x in ['old-smali', 'new-smali', 'merged-smali', 'check-smali']]
    bridge('disassemble', work / 'original.dex', old); bridge('disassemble', newdex / 'classes.dex', new)
    before, plugin = smali_tree(old), smali_tree(new)
    removed = {name for name in before if speech_class(name)}
    assert len(before) == 6 and len(removed) == 4 and len(plugin) == (22 if args.new_parallel else 19)
    assert all(speech_class(name) or (args.new_parallel and name in ['app/jarvis/fitness/'+n+'.smali' for n in ['JarvisRemindersPlugin','ReminderScheduler','ReminderReceiver']]) for name in plugin)
    assert all(b'LambdaMetafactory' not in text and b'invoke-custom' not in text for text in plugin.values())
    retained = {name: text for name, text in before.items() if name not in removed}
    original_retained = dict(retained)
    if args.new_parallel:
        path = 'app/jarvis/fitness/MainActivity.smali'
        marker = b'    invoke-super {p0, p1}, Lcom/getcapacitor/BridgeActivity;->onCreate(Landroid/os/Bundle;)V'
        addition = b'    const-class v0, Lapp/jarvis/fitness/JarvisRemindersPlugin;\n\n    invoke-virtual {p0, v0}, Lapp/jarvis/fitness/MainActivity;->registerPlugin(Ljava/lang/Class;)V\n\n'
        assert retained[path].count(marker) == 1
        retained[path] = retained[path].replace(marker, addition + marker)
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
                if args.new_parallel:
                    sys.path.insert(0, str(ROOT / 'evolution/notifications'))
                    from manifest import add_notifications
                    data = add_notifications(data)
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
        with zipfile.ZipFile(PRIVATE / ('Yanis-Fitness-Evolution-SAUVEGARDE-PRIVEE.zip' if args.new_parallel else 'JARVIS-signature-CONFIDENTIEL.zip')) as z:
            assert set(z.namelist()) == ({'jarvis-evolution.p12', 'password.txt', 'identity.json', 'A-LIRE.txt'} | ({'recovery-key.txt'} if args.new_parallel else set()))
            z.extractall(secret)
        assert json.loads((secret / 'identity.json').read_text()) == creation
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
        webBundleSha256=sha(bundle), validatedWebSha256=WEB_SHA, webStage=RELEASE['webStage'], changedEntries=changed, webFiles=272, unchangedWebFiles=271,
        nativeDexFiles=9, byteIdenticalDexFiles=8, originalClasses=original_count, resultingClasses=len(all_classes),
        removedSpeechClasses=sorted(removed), newSpeechClasses=sorted(n for n in plugin if speech_class(n)), newNotificationClasses=sorted(n for n in plugin if not speech_class(n)), unchangedClassesInRebuiltDex=sorted(n for n in retained if retained[n] == original_retained[n]),
        nativeSourceSha256=native_report['sourceSha256'], nativeDexSha256=sha(native_dex.read_bytes()),
        nativeRoundTripExact=True, signedFromRestoredPrivateBackup=True, signatureVerified=['v2', 'v3'], alignmentVerified=True,
        deviceTested=False, stagesIncluded=RELEASE['stagesIncluded'], stagesNotYetImplemented=['general conversational AI'] if args.new_parallel else [5, 6, 7, 'general conversational AI'], notificationSources=reminders_report['sources'] if reminders_report else [])
    # Expose the deliverable only after every integrity/signature check succeeds.
    temporary_output = args.output.with_suffix('.apk.tmp')
    shutil.copyfile(candidate, temporary_output)
    temporary_output.replace(args.output)
    args.output.with_suffix('.fidelity.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print('Signed APK:', args.output, '\nSHA-256:', report['apkSha256'])
if __name__ == '__main__': main()
