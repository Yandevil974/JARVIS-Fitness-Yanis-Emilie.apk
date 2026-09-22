"""Fidelity of the 1.5.0 repack (media corrections) against the published 1.4.0.
Runs on the unsigned candidate by default (MEDIA_APK=... for the signed release)."""
import hashlib, importlib.util, json, os, pathlib, sys, unittest, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'complete-hotfix/tests'));sys.path.insert(0,str(ROOT/'complete-hotfix'))
from test_apk_binary import attrs
spec=importlib.util.spec_from_file_location('media_build',ROOT/'evolution/android/build-media.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
APK=pathlib.Path(os.environ.get('MEDIA_APK',str(ROOT/'.cache/media-release/unsigned-candidate.apk')))
def sha(b):return hashlib.sha256(b).hexdigest()
@unittest.skipUnless(APK.exists(),'run evolution/android/build-media.py --unsigned-candidate first')
class MediaReleaseTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.base=zipfile.ZipFile(ROOT/m.RELEASE['baseApk']);cls.apk=zipfile.ZipFile(APK);cls.report=json.loads(APK.with_suffix('.fidelity.json').read_text())
 @classmethod
 def tearDownClass(cls):cls.base.close();cls.apk.close()
 def test_release_is_an_update_of_the_same_identity(self):
  identity=json.loads(m.IDENTITY_FILE.read_text())
  self.assertEqual(m.RELEASE['appId'],identity['appId']);self.assertEqual(m.RELEASE['appId'],'app.yanis.fitness.evolution.home')
  self.assertEqual((m.RELEASE['previousVersion'],m.RELEASE['previousVersionCode']),(identity['version'],identity['versionCode']))
  self.assertGreater(m.RELEASE['versionCode'],identity['versionCode']);self.assertEqual(m.RELEASE['versionCode'],12);self.assertEqual(m.RELEASE['version'],'1.5.0')
  self.assertEqual(sha((ROOT/m.RELEASE['baseApk']).read_bytes()),m.RELEASE['baseApkSha256'])
  self.assertEqual(self.report['identity']['certificateSha256'],'7d6f9c8fd826b4bdcbee3e444263b2e357d60e1c3182173c6f3d03bcd37921fd')
 def test_manifest_only_version_changes(self):
  expected=[]
  for tag,name,kind,value in attrs(self.base.read('AndroidManifest.xml')):
   if (tag,name)==('manifest','versionCode'):value=12
   elif kind==3 and value=='1.4.0':value='1.5.0'
   expected.append((tag,name,kind,value))
  actual=attrs(self.apk.read('AndroidManifest.xml'));self.assertEqual(actual,expected)
  self.assertIn(('manifest','package',3,'app.yanis.fitness.evolution.home'),actual);self.assertIn(('manifest','versionName',3,'1.5.0'),actual)
 def test_entries_dex_resources_config_identical_except_bundle_plus_one_media(self):
  base,apk=self.base.namelist(),self.apk.namelist()
  self.assertEqual(sorted(set(apk)-set(base)),sorted(m.NEW_ENTRIES));self.assertEqual(set(base)-set(apk),set())
  self.assertEqual(sorted(n for n in base if self.base.read(n)!=self.apk.read(n)),sorted(m.ALLOWED))
  dex=[n for n in apk if n.endswith('.dex')];self.assertEqual(len(dex),9)
  for n in dex+['resources.arsc','assets/capacitor.config.json']:self.assertEqual(self.base.read(n),self.apk.read(n),n)
  for name,digest in m.NEW_ENTRIES.items():
   info=self.apk.getinfo(name);self.assertEqual(sha(self.apk.read(name)),digest);self.assertEqual(info.compress_type,zipfile.ZIP_STORED)
  m.alignment.verify_alignment(APK)
 def test_packaged_web_is_the_validated_media_bundle_with_version_bump(self):
  web=self.apk.read(m.BUNDLE);self.assertEqual(web.count(b'V 1.5.0'),1);self.assertEqual(web.count(b'V 1.4.0'),0)
  self.assertEqual(sha(web.replace(b'V 1.5.0',b'V 1.4.0')),m.RELEASE['validatedMediaBundleSha256'])
  self.assertEqual(sha(web),self.report['packagedWebSha256'])
  for marker in [b'JarvisMediaMap',b'JarvisHome',b'JarvisNotifications',b'JarvisDecisions',b'JarvisAppointments',b'JarvisSpokesperson',b'JarvisVoice',b'JarvisFollowUp']:self.assertIn(marker,web)
  self.assertNotIn(b'level:"famille"',web);self.assertNotIn(b'const Z4={',web)
  # Every media path referenced by the reviewed mapping is packaged.
  mapping=json.loads((ROOT/'evolution/media/mapping.json').read_text());names=set(self.apk.namelist())
  paths={e['media'] for e in mapping['exercises'].values() if e['media']}
  for group in ['stretches','poolGuides','warmup']:paths|={e['media'] for e in mapping[group].values() if e.get('media')}
  for group in mapping['movements'].values():paths|={e['media'] for e in group.values() if e.get('media')}
  for path in sorted(paths):self.assertIn('assets/public'+path,names,path)
 def test_signed_release_when_present(self):
  if not self.report.get('signed'):self.skipTest('unsigned candidate: signing needs the private backup on a trusted machine')
  self.assertEqual(self.report['signatureVerified'],['v2','v3']);self.assertTrue(self.report['sameCertificateAs140'])
if __name__=='__main__':unittest.main()
