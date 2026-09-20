import hashlib, importlib.util, json, pathlib, struct, subprocess, sys, tempfile, unittest, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'evolution/android'))
from build import dex_classes, sha, JAVA, TOOLS, CONFIG, WEB_SHA, bridge, smali_tree
sys.path.insert(0, str(ROOT / 'complete-hotfix/tests'))
from test_apk_binary import attrs
from apk_binary import chunks, pool_strings, u16
APK = ROOT / 'downloads/JARVIS-Fitness-1.1.0-evolution.apk'
IDENTITY = json.loads((ROOT / 'evolution/android/identity.json').read_text())
class ReleaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base = zipfile.ZipFile(ROOT / '.cache/reference/base.apk')
        cls.apk = zipfile.ZipFile(APK)
        cls.report = json.loads(APK.with_suffix('.fidelity.json').read_text())
    @classmethod
    def tearDownClass(cls): cls.base.close(); cls.apk.close()
    def test_signature_and_identity_are_pinned_and_not_old_key(self):
        result = subprocess.check_output([JAVA, '-jar', str(TOOLS / 'apksigner.jar'), 'verify', '--verbose', '--print-certs', str(APK)], text=True)
        self.assertIn('Verified using v2 scheme (APK Signature Scheme v2): true', result)
        self.assertIn('Verified using v3 scheme (APK Signature Scheme v3): true', result)
        self.assertIn('Number of signers: 1', result)
        self.assertIn(IDENTITY['certificateSha256'], result)
        self.assertNotEqual(IDENTITY['certificateSha256'], IDENTITY['previousCertificateSha256'])
        self.assertEqual(sha(APK.read_bytes()), self.report['apkSha256'])
        self.assertFalse(self.report['deviceTested'])
    def test_manifest_changes_only_authorized_identity_version_debug_values(self):
        original = attrs(self.base.read('AndroidManifest.xml'))
        actual = attrs(self.apk.read('AndroidManifest.xml'))
        old, new = 'app.jarvis.fitness', IDENTITY['appId']
        replacements = {old:new, '1.0.4':IDENTITY['version']}
        for suffix in ['fileprovider','androidx-startup','DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION']: replacements[old+'.'+suffix]=new+'.'+suffix
        expected = []
        for tag,name,kind,value in original:
            if (tag,name)==('manifest','versionCode'): value=IDENTITY['versionCode']
            elif (tag,name)==('application','debuggable'): value=0
            elif kind==3: value=replacements.get(value,value)
            expected.append((tag,name,kind,value))
        self.assertEqual(actual,expected)
        for entry in [('manifest','package',3,new),('uses-sdk','minSdkVersion',16,26),('uses-sdk','targetSdkVersion',16,34),
            ('activity','name',3,'app.jarvis.fitness.MainActivity'),('uses-permission','name',3,'android.permission.RECORD_AUDIO'),
            ('action','name',3,'android.speech.RecognitionService'),('action','name',3,'android.intent.action.TTS_SERVICE')]:self.assertIn(entry,actual)
    def test_all_entries_preserved_with_only_five_authorized_changes(self):
        self.assertEqual(sorted(self.base.namelist()),sorted(self.apk.namelist()))
        changed=sorted(n for n in self.base.namelist() if self.base.read(n)!=self.apk.read(n))
        self.assertEqual(changed,sorted(['AndroidManifest.xml','resources.arsc','assets/capacitor.config.json',CONFIG['bundle']['path'],'classes9.dex']))
    def test_packaged_web_is_exact_stage3_except_visible_version(self):
        path=CONFIG['bundle']['path']; bundle=self.apk.read(path)
        validated=bundle.replace(b'V 1.1.0',b'V 1.0.6')
        self.assertEqual(bundle.count(b'V 1.1.0'),1); self.assertEqual(sha(validated),WEB_SHA)
        self.assertEqual(sha(bundle),self.report['webBundleSha256'])
        self.assertEqual(len([n for n in self.apk.namelist() if n.startswith('assets/public/') and not n.endswith('/')]),272)
    def test_dex_classes_are_unique_and_only_speech_family_changes(self):
        before=[];after=[]
        for n in self.base.namelist():
            if n.endswith('.dex'):
                before+=dex_classes(self.base.read(n));after+=dex_classes(self.apk.read(n))
                if n!='classes9.dex':self.assertEqual(self.base.read(n),self.apk.read(n))
        self.assertEqual(len(before),4953);self.assertEqual(len(after),4968);self.assertEqual(len(set(after)),len(after))
        for n in set(before)^set(after):self.assertIn('JarvisSpeechPlugin',n)
    def test_packaged_dex_round_trip_and_retained_native_classes(self):
        with tempfile.TemporaryDirectory() as temp:
            folder=pathlib.Path(temp); dex=folder/'classes9.dex';dex.write_bytes(self.apk.read('classes9.dex'))
            bridge('disassemble',dex,folder/'smali')
            actual=smali_tree(folder/'smali')
            self.assertEqual(actual,smali_tree(ROOT/'.cache/android-release/merged-smali'))
            for name in ['MainActivity','JarvisBackupPlugin']:
                path='app/jarvis/fitness/'+name+'.smali'
                self.assertEqual(actual[path],(ROOT/'.cache/android-release/old-smali'/path).read_bytes())
            speech=actual['app/jarvis/fitness/JarvisSpeechPlugin.smali']
            for name in ['diagnostics','listen','cancelListen','speak','stopSpeech','microphoneResult','voiceOptionsVersion']:
                self.assertIn(name.encode(),speech)
    def test_resource_ids_and_unrelated_values_stay_intact(self):
        original=self.base.read('resources.arsc');updated=self.apk.read('resources.arsc')
        a=[(k,original[o:o+s]) for o,k,_,s in chunks(original,u16(original,2))]
        b=[(k,updated[o:o+s]) for o,k,_,s in chunks(updated,u16(updated,2))]
        self.assertEqual(len(a),len(b))
        for (kind,x),(kind2,y) in zip(a,b):
            self.assertEqual(kind,kind2)
            if kind==0x200:
                self.assertEqual(x[:12],y[:12]);self.assertEqual(x[268:],y[268:]);self.assertEqual(y[12:268].decode('utf-16le').split('\0')[0],IDENTITY['appId'])
            elif kind==1:self.assertEqual(pool_strings(y),[{'app.jarvis.fitness':IDENTITY['appId'],'JARVIS Fitness':IDENTITY['appName']}.get(s,s) for s in pool_strings(x)])
    def test_private_files_absent_and_previous_apk_unchanged(self):
        for n in self.apk.namelist():
            self.assertFalse(n.lower().endswith(('.p12','.jks','.keystore','.pem','.key')))
            self.assertNotIn('password.txt',n);self.assertNotIn('DOC-20260919',n)
        tracked=subprocess.check_output(['git','ls-files'],cwd=ROOT,text=True).splitlines()
        self.assertFalse(any('JARVIS-signature-CONFIDENTIEL' in n or '.jarvis-fitness-signing' in n for n in tracked))
        self.assertEqual(sha((ROOT/'downloads/JARVIS-Fitness-1.0.6-complet.apk').read_bytes()),'7df80180e56c64f6293b2d0c7e40286f57e94e0a812f061344e08c34b2438b82')
if __name__=='__main__':unittest.main()
