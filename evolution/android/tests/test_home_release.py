import base64, importlib.util, json, os, pathlib, subprocess, sys, tempfile, unittest, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'complete-hotfix/tests'))
from test_apk_binary import attrs
from apk_binary import chunks, pool_strings, u16
spec=importlib.util.spec_from_file_location('home_build',ROOT/'evolution/android/build-home.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
APK=pathlib.Path(os.environ.get('HOME_APK',str(ROOT/'.cache/home-release/candidate.apk')))
IDENTITY=json.loads(m.signing.IDENTITY.read_text());OLD='app.yanis.fitness.evolution';NEW=IDENTITY['appId']
class HomeReleaseTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.base=zipfile.ZipFile(ROOT/m.RELEASE['baseApk']);cls.apk=zipfile.ZipFile(APK);cls.report=json.loads(APK.with_suffix('.fidelity.json').read_text())
 @classmethod
 def tearDownClass(cls):cls.base.close();cls.apk.close()
 def test_signature_alignment_and_actual_certificate(self):
  result=subprocess.check_output([str(m.JAVA),'-jar',str(m.SIGNER),'verify','--verbose','--print-certs',str(APK)],text=True)
  for text in ['Verified using v2 scheme (APK Signature Scheme v2): true','Verified using v3 scheme (APK Signature Scheme v3): true','Number of signers: 1',IDENTITY['certificateSha256']]:self.assertIn(text,result)
  self.assertNotEqual(IDENTITY['certificateSha256'],IDENTITY['previousCertificateSha256']);m.alignment.verify_alignment(APK)
  self.assertEqual(m.sha(APK.read_bytes()),self.report['apkSha256'])
 def test_manifest_only_authorized_identity_version_changes(self):
  expected=[]
  for tag,name,kind,value in attrs(self.base.read('AndroidManifest.xml')):
   if (tag,name)==('manifest','versionCode'):value=11
   elif kind==3:
    if value==OLD or value.startswith(OLD+'.'):value=NEW+value[len(OLD):]
    elif value=='1.3.0':value='1.4.0'
   expected.append((tag,name,kind,value))
  actual=attrs(self.apk.read('AndroidManifest.xml'));self.assertEqual(actual,expected)
  for entry in [('manifest','package',3,NEW),('manifest','versionName',3,'1.4.0'),('uses-sdk','minSdkVersion',16,26),('uses-sdk','targetSdkVersion',16,34),('application','debuggable',18,0),('application','allowBackup',18,0),('activity','name',3,'app.jarvis.fitness.MainActivity'),('receiver','name',3,'app.jarvis.fitness.ReminderReceiver'),('receiver','exported',18,0),('uses-permission','name',3,'android.permission.POST_NOTIFICATIONS'),('uses-permission','name',3,'android.permission.RECEIVE_BOOT_COMPLETED')]:self.assertIn(entry,actual)
  self.assertFalse(any(kind==3 and isinstance(value,str) and value.startswith(OLD+'.') and value!=NEW and not value.startswith(NEW+'.') for _,_,kind,value in actual))
 def test_all_entries_and_nine_dex_byte_identical_except_four_allowlisted(self):
  self.assertEqual(self.base.namelist(),self.apk.namelist())
  self.assertEqual(sorted(n for n in self.base.namelist() if self.base.read(n)!=self.apk.read(n)),sorted(m.ALLOWED))
  dex=[n for n in self.apk.namelist() if n.endswith('.dex')];self.assertEqual(len(dex),9)
  for n in dex:self.assertEqual(self.base.read(n),self.apk.read(n),n)
 def test_packaged_home_exact_except_version_no_functions_removed(self):
  web=self.apk.read(m.BUNDLE);self.assertEqual(web.count(b'V 1.4.0'),1)
  self.assertEqual(m.sha(web.replace(b'V 1.4.0',b'V 1.3.0')),m.RELEASE['validatedHomeBundleSha256'])
  self.assertEqual(m.sha(web),self.report['packagedWebSha256'])
  for marker in [b'JarvisHome',b'JarvisNotifications',b'JarvisDecisions',b'JarvisAppointments',b'JarvisSpokesperson',b'JarvisVoice',b'JarvisFollowUp']:self.assertIn(marker,web)
  self.assertEqual(len([n for n in self.apk.namelist() if n.startswith('assets/public/') and not n.endswith('/')]),272)
 def test_resource_ids_and_names_preserved_and_new_package_consistent(self):
  a=self.base.read('resources.arsc');b=self.apk.read('resources.arsc')
  aa=[(k,a[o:o+s]) for o,k,_,s in chunks(a,u16(a,2))];bb=[(k,b[o:o+s]) for o,k,_,s in chunks(b,u16(b,2))]
  self.assertEqual(len(aa),len(bb))
  for (kind,x),(kind2,y) in zip(aa,bb):
   self.assertEqual(kind,kind2)
   if kind==0x200:self.assertEqual(x[:12],y[:12]);self.assertEqual(x[268:],y[268:]);self.assertEqual(y[12:268].decode('utf-16le').split('\0')[0],NEW)
   elif kind==1:self.assertEqual(pool_strings(y),[NEW if s==OLD else s for s in pool_strings(x)]);self.assertIn('Yanis Fitness Evolution',pool_strings(y))
  conf=json.loads(self.apk.read('assets/capacitor.config.json'));self.assertEqual(conf['appId'],NEW);self.assertEqual(conf['appName'],'Yanis Fitness Evolution')
 def test_original_apk_unchanged_and_private_files_not_packaged_or_tracked(self):
  self.assertEqual(m.sha((ROOT/m.RELEASE['baseApk']).read_bytes()),m.RELEASE['baseApkSha256'])
  for n in self.apk.namelist():
   self.assertFalse(any(s in n.lower() for s in ['password.txt','recovery-key','sauvegarde-privee','.p12','.jks','.private']))
  tracked=subprocess.check_output(['git','ls-files'],cwd=ROOT,text=True).splitlines()
  self.assertFalse(any('.private/' in p or 'SAUVEGARDE-PRIVEE.zip' in p or p.endswith(('.p12','.jks')) for p in tracked))
 def test_backup_decrypts_restores_and_resigns_without_changing_identity(self):
  envelope=json.loads(m.signing.ENCRYPTED.read_text());key=base64.b64decode((m.signing.PRIVATE/'recovery-key.txt').read_bytes().strip())
  data=m.signing.unseal(envelope,key);self.assertTrue(m.signing.inspect_backup(data,IDENTITY))
  self.assertEqual(data,(m.signing.PRIVATE/m.signing.ARCHIVE).read_bytes())
  with tempfile.TemporaryDirectory(dir=m.signing.PRIVATE) as temp:
   target=pathlib.Path(temp)/'restored';m.signing.restore(m.signing.ENCRYPTED,m.signing.PRIVATE/'recovery-key.txt',target)
   self.assertEqual(json.loads((target/'identity.json').read_text()),IDENTITY)
   self.assertEqual((target/m.signing.ARCHIVE).read_bytes(),data)
 def test_bad_recovery_and_regeneration_are_rejected(self):
  envelope=json.loads(m.signing.ENCRYPTED.read_text());key=base64.b64decode((m.signing.PRIVATE/'recovery-key.txt').read_bytes().strip())
  with self.assertRaises(Exception):m.signing.unseal(envelope,bytes(32))
  corrupt=dict(envelope);corrupt['ciphertext']=base64.b64encode(b'bad ciphertext').decode()
  with self.assertRaises(Exception):m.signing.unseal(corrupt,key)
  with self.assertRaises(ValueError):m.signing.initialize()
if __name__=='__main__':unittest.main()
