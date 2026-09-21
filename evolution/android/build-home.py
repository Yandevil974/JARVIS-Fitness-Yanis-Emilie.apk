#!/usr/bin/env python3
"""Repack the complete signed 1.3.0 with the approved home and authorized 1.4 identity.
All nine DEX remain byte-identical. No Gradle/legacy React rebuild. No key generation.
"""
import argparse, base64, hashlib, importlib.util, io, json, os, pathlib, shutil, subprocess, sys, tempfile, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'complete-hotfix'))
from apk_binary import patch_manifest, patch_resources, chunks, u16, pool_strings

def module(name, file):
 spec=importlib.util.spec_from_file_location(name,file);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
alignment=module('alignment_home',ROOT/'JARVIS-Fitness-Source/scripts/rebuild-apk.py')
signing=module('signing_home',ROOT/'evolution/android/signing-home.py')
RELEASE=json.loads((ROOT/'evolution/android/release-home.json').read_text())
JAVA=ROOT/'.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER=ROOT/'.cache/home-tools/apksigner.jar'
BUNDLE='assets/public/assets/index-CBCies4k.js'
ALLOWED=['AndroidManifest.xml','resources.arsc','assets/capacitor.config.json',BUNDLE]
def sha(data):return hashlib.sha256(data).hexdigest()
def run(*args):subprocess.run(list(map(str,args)),cwd=ROOT,check=True)
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--output',type=pathlib.Path);args=parser.parse_args()
 output=(args.output or ROOT/RELEASE['output']).resolve()
 if output != (ROOT/RELEASE['output']).resolve() and not output.is_relative_to(ROOT/'.cache'):
  raise ValueError('Only this release or a temporary candidate output is permitted')
 base=ROOT/RELEASE['baseApk'];identity=json.loads(signing.IDENTITY.read_text())
 assert sha(base.read_bytes())==RELEASE['baseApkSha256']
 assert sha(SIGNER.read_bytes())==RELEASE['apksignerSha256']
 for name in ['appId','appName']:assert identity[name]==RELEASE[name]
 assert identity['userAuthorizedNewIdentity'] and identity['appId']!='app.yanis.fitness.evolution'
 # Compile just the approved web presentation on the exact complete baseline.
 run('node',ROOT/'evolution/home/build.mjs')
 web=(ROOT/'.cache/home-web'/BUNDLE.removeprefix('assets/public/')).read_bytes()
 assert sha(web)==RELEASE['validatedHomeBundleSha256'],'Home changed: renew checks and release pin'
 assert web.count(b'V 1.3.0')==1
 web=web.replace(b'V 1.3.0',('V '+RELEASE['version']).encode())
 assert b'V 1.4.0' in web
 work=ROOT/'.cache/home-release';work.mkdir(parents=True,exist_ok=True)
 unsigned,aligned,candidate=[work/n for n in ['unsigned.apk','aligned.apk','signed.apk']]
 old='app.yanis.fitness.evolution';new=identity['appId']
 with zipfile.ZipFile(base) as src,zipfile.ZipFile(unsigned,'w') as dst:
  for info in src.infolist():
   data=src.read(info.filename)
   if info.filename==BUNDLE:data=web
   elif info.filename=='AndroidManifest.xml':
    values=[]
    for offset,kind,head,size in chunks(data,u16(data,2)):
     if kind==1:values=pool_strings(data[offset:offset+size]);break
    assert old in values and '1.3.0' in values and new not in values
    replacements={value:new+value[len(old):] for value in values if value==old or value.startswith(old+'.')}
    replacements['1.3.0']=RELEASE['version']
    data=patch_manifest(data,replacements,RELEASE['versionCode'])
   elif info.filename=='resources.arsc':data=patch_resources(data,{old:new},old,new)
   elif info.filename=='assets/capacitor.config.json':
    config=json.loads(data);assert config['appId']==old
    config.update(appId=new,appName=RELEASE['appName']);data=(json.dumps(config,ensure_ascii=False,indent=2)+'\n').encode()
   dst.writestr(info,data)
 alignment.align_apk(unsigned,aligned)
 # Sign using a restored encrypted backup, not merely the original keystore.
 envelope=json.loads(signing.ENCRYPTED.read_text())
 assert envelope['identity']==identity
 key=base64.b64decode((signing.PRIVATE/'recovery-key.txt').read_bytes().strip(),validate=True)
 data=signing.unseal(envelope,key)
 assert data==(signing.PRIVATE/signing.ARCHIVE).read_bytes()
 with tempfile.TemporaryDirectory(prefix='restored-for-signing-',dir=signing.PRIVATE) as temp:
  secret=pathlib.Path(temp)
  with zipfile.ZipFile(io.BytesIO(data)) as backup:
   for name in signing.NAMES:signing.private_write(secret/name,backup.read(name))
  run(JAVA,'-jar',SIGNER,'sign','--ks',secret/'jarvis-evolution.p12','--ks-pass','file:'+str(secret/'password.txt'),'--ks-key-alias','jarvis-evolution',
      '--v1-signing-enabled','false','--v2-signing-enabled','true','--v3-signing-enabled','true','--v4-signing-enabled','false','--out',candidate,aligned)
 verification=subprocess.check_output([str(JAVA),'-jar',str(SIGNER),'verify','--verbose','--print-certs',str(candidate)],text=True)
 for item in ['Signer #1 certificate SHA-256 digest: '+identity['certificateSha256'],'Number of signers: 1','Verified using v2 scheme (APK Signature Scheme v2): true','Verified using v3 scheme (APK Signature Scheme v3): true']:assert item in verification
 alignment.verify_alignment(candidate)
 with zipfile.ZipFile(base) as src,zipfile.ZipFile(candidate) as dst:
  assert src.namelist()==dst.namelist(),'ZIP inventory changed'
  changes=sorted(n for n in src.namelist() if src.read(n)!=dst.read(n));assert changes==sorted(ALLOWED)
  dex=[n for n in src.namelist() if n.endswith('.dex')];assert len(dex)==9
  assert all(src.read(n)==dst.read(n) for n in dex),'Native implementation changed'
  webfiles=[n for n in src.namelist() if n.startswith('assets/public/') and not n.endswith('/')];assert len(webfiles)==272
  assert dst.read(BUNDLE)==web
  # Binary table entry structure/resource IDs and unchanged native receivers stay in place.
  assert dst.read('assets/public/training-hero.jpg')==src.read('assets/public/training-hero.jpg')
 report={'identity':identity,'version':RELEASE['version'],'versionCode':RELEASE['versionCode'],'apkSha256':sha(candidate.read_bytes()),'baseApkSha256':sha(base.read_bytes()),
  'apkBytes':candidate.stat().st_size,'validatedHomeBundleSha256':RELEASE['validatedHomeBundleSha256'],'packagedWebSha256':sha(web),'packagedWebDifference':'V 1.3.0 -> V 1.4.0 only after approved home build',
  'changedEntries':changes,'webFiles':272,'unchangedWebFiles':271,'nativeDexFiles':9,'byteIdenticalDexFiles':9,'signatureVerified':['v2','v3'],'alignmentVerified':True,
  'signedFromRestoredEncryptedBackup':True,'stagesIncluded':RELEASE['stagesIncluded'],'approvedHomeIncluded':True,'generalConversationalAiIncluded':False,'deviceTested':False,
  'signerSha256':sha(SIGNER.read_bytes()),'externalPrivateBackupRetentionConfirmed':False}
 output.parent.mkdir(parents=True,exist_ok=True);temp=output.with_suffix('.apk.tmp');shutil.copyfile(candidate,temp);temp.replace(output)
 output.with_suffix('.fidelity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 output.with_suffix('.apk.sha256').write_text(report['apkSha256']+'  '+output.name+'\n')
 print(verification);print('SIGNED APK:',output);print('SHA256:',report['apkSha256'])
if __name__=='__main__':main()
