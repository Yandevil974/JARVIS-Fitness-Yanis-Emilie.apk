"""Checks the actual signed parallel APK, independently of historical 1.2.0 tests."""
import collections, importlib.util, json, pathlib, struct, subprocess, sys, tempfile, unittest, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'evolution/android'))
from build import dex_classes, sha, JAVA, TOOLS, CONFIG, bridge, smali_tree, alignment
sys.path.insert(0,str(ROOT/'complete-hotfix/tests'))
from test_apk_binary import attrs
from apk_binary import chunks, pool_strings, u16, u32
RELEASE=json.loads((ROOT/'evolution/android/release-next.json').read_text())
IDENTITY=json.loads((ROOT/'evolution/android/identity-next.json').read_text())
APK=ROOT/RELEASE['output']

class ParallelApkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base=zipfile.ZipFile(ROOT/'.cache/reference/base.apk');cls.apk=zipfile.ZipFile(APK)
        cls.report=json.loads(APK.with_suffix('.fidelity.json').read_text())
        cls.temp=tempfile.TemporaryDirectory();cls.work=pathlib.Path(cls.temp.name)
        for key,apk in [('original',cls.base),('actual',cls.apk)]:
            dex=cls.work/(key+'.dex');dex.write_bytes(apk.read('classes9.dex'));bridge('disassemble',dex,cls.work/key)
        cls.original=smali_tree(cls.work/'original');cls.actual=smali_tree(cls.work/'actual')
    @classmethod
    def tearDownClass(cls):cls.base.close();cls.apk.close();cls.temp.cleanup()
    def test_real_signature_alignment_and_separate_identity(self):
        output=subprocess.check_output([JAVA,'-jar',str(TOOLS/'apksigner.jar'),'verify','--verbose','--print-certs',str(APK)],text=True)
        for text in ['Number of signers: 1','Verified using v2 scheme (APK Signature Scheme v2): true','Verified using v3 scheme (APK Signature Scheme v3): true',IDENTITY['certificateSha256']]:self.assertIn(text,output)
        self.assertEqual(IDENTITY['appId'],'app.yanis.fitness.evolution')
        self.assertNotEqual(IDENTITY['certificateSha256'],IDENTITY['previousCertificateSha256'])
        self.assertEqual(sha(APK.read_bytes()),self.report['apkSha256']);alignment.verify_alignment(APK)
        self.assertFalse(self.report['deviceTested']);self.assertEqual(self.report['stagesIncluded'],list(range(1,8)))
    def test_inventory_and_packaged_web_exact(self):
        self.assertEqual(sorted(self.base.namelist()),sorted(self.apk.namelist()))
        self.assertEqual(sorted(n for n in self.base.namelist() if self.base.read(n)!=self.apk.read(n)),sorted(['AndroidManifest.xml','resources.arsc','assets/capacitor.config.json',CONFIG['bundle']['path'],'classes9.dex']))
        web=[n for n in self.apk.namelist() if n.startswith('assets/public/') and not n.endswith('/')]
        self.assertEqual(len(web),272);self.assertEqual(sum(self.base.read(n)==self.apk.read(n) for n in web),271)
        bundle=self.apk.read(CONFIG['bundle']['path']);version=('V '+RELEASE['version']).encode()
        self.assertEqual(bundle.count(version),1);self.assertEqual(sha(bundle.replace(version,b'V 1.0.6')),RELEASE['webSha256'])
        self.assertEqual(sha(bundle),self.report['webBundleSha256'])
    def test_manifest_only_expected_permissions_and_private_receiver(self):
        before=attrs(self.base.read('AndroidManifest.xml'));after=attrs(self.apk.read('AndroidManifest.xml'))
        replacements={'app.jarvis.fitness':IDENTITY['appId'],'1.0.4':RELEASE['version']}
        for suffix in ['fileprovider','androidx-startup','DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION']:replacements['app.jarvis.fitness.'+suffix]=IDENTITY['appId']+'.'+suffix
        expected=[]
        for tag,name,kind,value in before:
            if (tag,name)==('manifest','versionCode'):value=RELEASE['versionCode']
            elif (tag,name)==('application','debuggable'):value=0
            elif kind==3:value=replacements.get(value,value)
            expected.append((tag,name,kind,value))
        expected += [('uses-permission','name',3,p) for p in ['android.permission.POST_NOTIFICATIONS','android.permission.RECEIVE_BOOT_COMPLETED']]
        expected += [('receiver','name',3,'app.jarvis.fitness.ReminderReceiver'),('receiver','enabled',18,4294967295),('receiver','exported',18,0)]
        expected += [('action','name',3,'android.intent.action.'+s) for s in ['BOOT_COMPLETED','MY_PACKAGE_REPLACED','TIME_SET','TIMEZONE_CHANGED']]
        self.assertEqual(collections.Counter(after),collections.Counter(expected))
        self.assertIn(('application','allowBackup',18,0),after)
        self.assertIn(('uses-sdk','minSdkVersion',16,26),after);self.assertIn(('uses-sdk','targetSdkVersion',16,34),after)
        data=self.apk.read('AndroidManifest.xml');stack=[];names=None;receiver_filters=[];in_new=False
        for o,k,h,z in chunks(data,u16(data,2)):
            part=data[o:o+z]
            if k==1:names=pool_strings(part)
            elif k==0x102:
                name=names[u32(part,h+4)]
                if name=='receiver':
                    raw=part[36:]; in_new=any(names[u32(raw,i+16)]=='app.jarvis.fitness.ReminderReceiver' for i in range(0,len(raw),20) if raw[i+15]==3)
                    if in_new:self.assertEqual(stack,['manifest','application'])
                if name=='intent-filter' and in_new:receiver_filters.append(len(stack))
                stack.append(name)
            elif k==0x103:
                name=names[u32(part,h+4)];self.assertEqual(stack.pop(),name)
                if name=='receiver':in_new=False
        self.assertEqual(stack,[]);self.assertEqual(receiver_filters,[3])
    def test_dex_classes_unique_and_preserved(self):
        before=[];after=[]
        for n in self.base.namelist():
            if n.endswith('.dex'):
                before+=dex_classes(self.base.read(n));after+=dex_classes(self.apk.read(n))
                if n!='classes9.dex':self.assertEqual(self.base.read(n),self.apk.read(n))
        self.assertEqual(len(before),4953);self.assertEqual(len(after),4971);self.assertEqual(len(set(after)),4971)
        for name in set(before)^set(after):self.assertTrue('JarvisSpeechPlugin' in name or name in ['Lapp/jarvis/fitness/'+n+';' for n in ['JarvisRemindersPlugin','ReminderScheduler','ReminderReceiver']],name)
        path='app/jarvis/fitness/JarvisBackupPlugin.smali';self.assertEqual(self.actual[path],self.original[path])
    def test_main_activity_registration_is_the_only_retained_class_change(self):
        path='app/jarvis/fitness/MainActivity.smali';added=b'    const-class v0, Lapp/jarvis/fitness/JarvisRemindersPlugin;\n\n    invoke-virtual {p0, v0}, Lapp/jarvis/fitness/MainActivity;->registerPlugin(Ljava/lang/Class;)V\n\n'
        self.assertEqual(self.actual[path].count(added),1);self.assertEqual(self.actual[path].replace(added,b''),self.original[path])
        self.assertEqual(self.actual,smali_tree(ROOT/'.cache/android-release/merged-smali'))
    def test_native_contract_and_french_text_packaged(self):
        plugin=self.actual['app/jarvis/fitness/JarvisRemindersPlugin.smali']
        for marker in [b'CapacitorPlugin;',b'PermissionCallback;',b'android.permission.POST_NOTIFICATIONS',b'name = "JarvisReminders"',b'notificationPermission',b'requestPermissionForAlias',b'begin(',b'replace(',b'setEnabled(']:self.assertIn(marker,plugin)
        scheduler=self.actual['app/jarvis/fitness/ReminderScheduler.smali']
        self.assertIn(b'Un point t\\u2019attend dans ton suivi.',scheduler)
        self.assertIn(b'setAndAllowWhileIdle',scheduler);self.assertNotIn(b'setExact',scheduler)
        self.assertNotIn(b'LambdaMetafactory',b''.join(self.actual.values()))
        self.assertNotIn(b'invoke-custom',b''.join(self.actual.values()))
    def test_resource_ids_preserved_and_branding_exact(self):
        old=self.base.read('resources.arsc');new=self.apk.read('resources.arsc')
        a=[(k,old[o:o+s]) for o,k,_,s in chunks(old,u16(old,2))];b=[(k,new[o:o+s]) for o,k,_,s in chunks(new,u16(new,2))]
        self.assertEqual(len(a),len(b))
        for (kind,x),(kind2,y) in zip(a,b):
            self.assertEqual(kind,kind2)
            if kind==0x200:self.assertEqual(x[:12],y[:12]);self.assertEqual(x[268:],y[268:]);self.assertEqual(y[12:268].decode('utf-16le').split('\0')[0],IDENTITY['appId'])
            elif kind==1:self.assertEqual(pool_strings(y),[{'app.jarvis.fitness':IDENTITY['appId'],'JARVIS Fitness':'Yanis Fitness Evolution'}.get(s,s) for s in pool_strings(x)])
        cap=json.loads(self.apk.read('assets/capacitor.config.json'));self.assertEqual(cap['appId'],IDENTITY['appId']);self.assertEqual(cap['appName'],'Yanis Fitness Evolution')
    def test_no_private_material_and_historical_apks_unchanged(self):
        for n in self.apk.namelist():
            self.assertFalse(n.lower().endswith(('.p12','.jks','.keystore','.pem','.key')))
            self.assertFalse(any(s in n for s in ['password.txt','recovery-key.txt','DOC-20260919','SAUVEGARDE-PRIVEE']))
        private=ROOT/'.private/yanis-fitness-evolution'
        data=APK.read_bytes()
        for name in ['password.txt','recovery-key.txt']:self.assertNotIn((private/name).read_bytes().strip(),data)
        self.assertEqual(sha((ROOT/'downloads/Yanis-Fitness-Evolution-1.2.0.apk').read_bytes()),'3a92b5fda83f68ad205599fb4349aaae776b651c67b414e9b8021b99bdedcc26')
        self.assertEqual(sha((ROOT/'downloads/JARVIS-Fitness-1.0.6-complet.apk').read_bytes()),'7df80180e56c64f6293b2d0c7e40286f57e94e0a812f061344e08c34b2438b82')

if __name__=='__main__':unittest.main()
